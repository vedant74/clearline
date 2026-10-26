/* ForeverQR guide pages: theme toggle, footer year, service worker. No dependencies. */
(function () {
  'use strict';
  var btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', function () {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('../sw.js', { scope: '../', updateViaCache: 'none' }).catch(function () {});
    });
  }
})();
