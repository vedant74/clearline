/* ForeverQR service worker. Scope: /foreverqr/ (the folder this file lives in).
 * - Pages, CSS, JS, config: network-first (3 s timeout), falling back to the cache, so a deploy
 *   is picked up on the next visit and the app still opens offline.
 * - vendor/ and icons/: cache-first (file names are versioned / never change).
 * Bump VERSION when the precache list changes; old caches are deleted on activate.
 */
var VERSION = 'fqr-v1';
var SHELL = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/guide.js',
  'config.js',
  'favicon.svg',
  'manifest.webmanifest',
  'vendor/qrcode-generator-1.4.4.js',
  'vendor/jsQR-1.4.0.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('fqr-') === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function putCopy(req, res) {
  if (res && res.ok && res.type === 'basic') {
    var copy = res.clone();
    caches.open(VERSION).then(function (c) { c.put(req, copy); });
  }
  return res;
}

function networkFirst(req) {
  return new Promise(function (resolve) {
    var done = false;
    var timer = setTimeout(function () {
      caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) { if (hit && !done) { done = true; resolve(hit); } });
    }, 3000);
    fetch(req).then(function (res) {
      clearTimeout(timer); putCopy(req, res);
      if (!done) { done = true; resolve(res); }
    }).catch(function () {
      clearTimeout(timer);
      caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(function (hit) {
        if (done) return;
        done = true;
        if (hit) return resolve(hit);
        if (req.mode === 'navigate') return caches.match('./').then(function (home) { resolve(home || Response.error()); });
        resolve(Response.error());
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch third-party requests (analytics, forms)
  var scope = new URL(self.registration.scope);
  if (url.pathname.indexOf(scope.pathname) !== 0) return;
  var rel = url.pathname.slice(scope.pathname.length);
  if (/^(vendor|icons)\//.test(rel)) {
    e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req).then(function (res) { return putCopy(req, res); }); }));
    return;
  }
  e.respondWith(networkFirst(req));
});
