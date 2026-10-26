/* Peelo service worker (scope: /peelo/).
   - App shell (HTML/CSS/JS/icons): network-first, so a deploy shows up on the next online load;
     the cached copy is the offline fallback.
   - Runtime files (vendor/ort/*, pinned version) and icons: cache-first.
   - The AI model is cached by the app itself (Cache API, CONFIG.MODEL_CACHE_NAME), so it is not
     duplicated here; models/ requests pass through.
   Bump VERSION when the precache list changes. Old peelo-shell-* caches are deleted on activate. */
const VERSION = "v2";
const SHELL = "peelo-shell-" + VERSION;
const RUNTIME = "peelo-runtime-" + VERSION;
const PRECACHE = [
  "./", "index.html", "styles.css", "config.js", "js/app.js", "js/segment.js", "favicon.svg",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
  "vendor/ort/ort.wasm.min.js",
];
const RUNTIME_FILES = ["vendor/ort/ort-wasm-simd-threaded.mjs", "vendor/ort/ort-wasm-simd-threaded.wasm"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    await shell.addAll(PRECACHE.map((u) => new Request(u, { cache: "reload" })));
    // Warm the runtime cache so the tool works offline after the first visit. Best effort.
    const rt = await caches.open(RUNTIME);
    await Promise.all(RUNTIME_FILES.map(async (u) => {
      try { if (!(await rt.match(u))) await rt.add(new Request(u, { cache: "reload" })); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL, RUNTIME]);
    for (const k of await caches.keys()) if (k.startsWith("peelo-") && !keep.has(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

const scopePath = new URL(self.registration.scope).pathname;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(scopePath)) return;
  const rel = url.pathname.slice(scopePath.length);
  if (rel.startsWith("models/")) return; // the app caches the model itself

  if (rel.startsWith("vendor/") || rel.startsWith("icons/")) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) { const c = await caches.open(RUNTIME); c.put(req, res.clone()); }
  return res;
}

async function networkFirst(req) {
  try {
    // Revalidate with the server so a new deploy isn't hidden behind the HTTP cache.
    const res = await fetch(req, { cache: "no-cache" });
    if (res.ok && res.type === "basic") { const c = await caches.open(SHELL); c.put(req, res.clone()); }
    return res;
  } catch (err) {
    const hit = (await caches.match(req)) || (await caches.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    if (req.mode === "navigate") { const home = await caches.match("./"); if (home) return home; }
    throw err;
  }
}
