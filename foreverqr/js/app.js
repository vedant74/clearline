/* ForeverQR app - plain JS, no build step.
 * Generator: qrcode-generator (MIT). Scanner: BarcodeDetector when available, jsQR (Apache-2.0) fallback, lazy-loaded.
 * Everything runs in the browser; nothing about the codes is sent anywhere.
 */
(function () {
  'use strict';

  var CFG = window.CONFIG || {};
  var NAME = CFG.PRODUCT_NAME || 'ForeverQR';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (window.qrcode && qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  }

  /* ------------------------------------------------------------------ config wiring */
  $$('[data-config="PRODUCT_NAME"]').forEach(function (el) { el.textContent = NAME; });
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  if (CFG.CONTACT_EMAIL) { var cl = $('#contactLink'); cl.href = 'mailto:' + CFG.CONTACT_EMAIL; cl.hidden = false; }
  if (CFG.PAYMENT_LINK) { var pl = $('#preorderLink'); pl.href = CFG.PAYMENT_LINK; pl.hidden = false; }

  function injectAnalytics(html) {
    if (!html) return;
    var tpl = document.createElement('template');
    tpl.innerHTML = String(html).trim();
    Array.prototype.forEach.call(tpl.content.childNodes, function (node) {
      if (node.nodeName === 'SCRIPT') {
        var s = document.createElement('script');
        Array.prototype.forEach.call(node.attributes, function (a) { s.setAttribute(a.name, a.value); });
        s.text = node.textContent;
        document.head.appendChild(s);
      } else if (node.nodeType === 1) {
        document.head.appendChild(node.cloneNode(true));
      }
    });
  }
  injectAnalytics(CFG.ANALYTICS_SNIPPET);

  function track(name) {
    try {
      if (window.goatcounter && typeof window.goatcounter.count === 'function') {
        window.goatcounter.count({ path: name, title: name, event: true });
      }
      if (typeof window.plausible === 'function') window.plausible(name);
    } catch (e) { /* analytics must never break the app */ }
  }

  // Style options open by default on wide screens; on phones keep the preview close to the inputs.
  if (window.matchMedia && matchMedia('(min-width: 860px)').matches) $('#styleBox').open = true;

  /* ------------------------------------------------------------------ theme */
  $('#themeToggle').addEventListener('click', function () {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ------------------------------------------------------------------ tabs */
  var tabs = { make: $('#tab-make'), scan: $('#tab-scan') };
  function showTab(name, focus) {
    Object.keys(tabs).forEach(function (k) {
      var on = k === name;
      tabs[k].setAttribute('aria-selected', String(on));
      tabs[k].tabIndex = on ? 0 : -1;
      $('#' + k).hidden = !on;
    });
    if (focus) tabs[name].focus();
    if (name !== 'scan') stopCamera();
  }
  Object.keys(tabs).forEach(function (k) {
    tabs[k].addEventListener('click', function () { showTab(k); history.replaceState(null, '', '#' + k); });
    tabs[k].addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); showTab(k === 'make' ? 'scan' : 'make', true); }
    });
  });
  $$('.top-nav a[href="#make"], .top-nav a[href="#scan"]').forEach(function (a) {
    a.addEventListener('click', function () { showTab(a.getAttribute('href').slice(1)); });
  });
  if (location.hash === '#scan') showTab('scan');

  /* ------------------------------------------------------------------ payload builders */
  function escWifi(s) { return String(s).replace(/([\\;,":])/g, '\\$1'); }
  function escV(s) { return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1'); }
  function cleanPhone(s) { return String(s).replace(/[^\d+*#]/g, ''); }

  function normalizeUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
    return u;
  }

  function buildPayload(type, v) {
    switch (type) {
      case 'url': return normalizeUrl(v.url);
      case 'text': return String(v.text || '');
      case 'wifi': {
        if (!v.ssid) return '';
        var enc = v.wenc || 'WPA';
        var s = 'WIFI:T:' + enc + ';S:' + escWifi(v.ssid) + ';';
        if (enc !== 'nopass' && v.wpass) s += 'P:' + escWifi(v.wpass) + ';';
        if (v.whidden) s += 'H:true;';
        return s + ';';
      }
      case 'vcard': {
        if (!(v.first || v.last || v.org || v.vtel || v.vemail)) return '';
        var L = ['BEGIN:VCARD', 'VERSION:3.0'];
        L.push('N:' + escV(v.last || '') + ';' + escV(v.first || '') + ';;;');
        L.push('FN:' + escV(([v.first, v.last].filter(Boolean).join(' ')) || v.org || ''));
        if (v.org) L.push('ORG:' + escV(v.org));
        if (v.title) L.push('TITLE:' + escV(v.title));
        if (v.vtel) L.push('TEL;TYPE=CELL:' + cleanPhone(v.vtel));
        if (v.vemail) L.push('EMAIL:' + String(v.vemail).trim());
        if (v.vurl) L.push('URL:' + normalizeUrl(v.vurl));
        if (v.vadr) L.push('ADR;TYPE=WORK:;;' + escV(v.vadr) + ';;;;');
        L.push('END:VCARD');
        return L.join('\r\n');
      }
      case 'email': {
        if (!v.eto) return '';
        var q = [];
        if (v.esub) q.push('subject=' + encodeURIComponent(v.esub));
        if (v.ebody) q.push('body=' + encodeURIComponent(v.ebody));
        return 'mailto:' + String(v.eto).trim() + (q.length ? '?' + q.join('&') : '');
      }
      case 'sms': return v.snum ? 'SMSTO:' + cleanPhone(v.snum) + ':' + (v.smsg || '') : '';
      case 'tel': return v.tel ? 'tel:' + cleanPhone(v.tel) : '';
    }
    return '';
  }

  /* ------------------------------------------------------------------ QR model -> shapes */
  // Alignment pattern centre coordinates per QR version (ISO/IEC 18004, Annex E).
  var ALIGN_POS = [null, [],
    [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62],
    [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
    [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];

  // Shapes are in module units (including margin). Rendered to canvas or SVG.
  function buildModel(text, opts) {
    var qr = qrcode(0, opts.ecl);
    qr.addData(text, 'Byte');
    qr.make();
    var n = qr.getModuleCount();
    var m = opts.margin;
    var total = n + 2 * m;
    var shapes = [];
    var fg = opts.fg, bg = opts.bg, style = opts.style;

    function inFinder(r, c) {
      return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
    }
    // Logo hole (modules left clear in the centre).
    var hole = null;
    if (opts.logo) {
      var hs = Math.floor(n * 0.24);
      if ((n - hs) % 2) hs += 1;
      var h0 = (n - hs) / 2;
      hole = { r0: h0, c0: h0, r1: h0 + hs, c1: h0 + hs };
    }
    function inHole(r, c) { return hole && r >= hole.r0 && r < hole.r1 && c >= hole.c0 && c < hole.c1; }

    // Background
    shapes.push({ k: 'rect', x: 0, y: 0, w: total, h: total, fill: bg });

    // Finder patterns
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p) {
      var y = p[0] + m, x = p[1] + m;
      var rr = style === 'square' ? 0 : (style === 'dots' ? 2.2 : 1.6);
      var ri = style === 'square' ? 0 : (style === 'dots' ? 1.5 : 1.0);
      var rc = style === 'square' ? 0 : (style === 'dots' ? 1.5 : 0.8);
      shapes.push({ k: 'rect', x: x, y: y, w: 7, h: 7, r: rr, fill: fg });
      shapes.push({ k: 'rect', x: x + 1, y: y + 1, w: 5, h: 5, r: ri, fill: bg });
      shapes.push({ k: 'rect', x: x + 2, y: y + 2, w: 3, h: 3, r: rc, fill: fg });
    });

    // Alignment patterns: in styled modes draw them as solid shapes, because scanners
    // look for a continuous dark ring (separate dots break detection).
    var aligns = [];
    if (style !== 'square') {
      var ver = (n - 17) / 4;
      var pos = ALIGN_POS[ver] || [];
      pos.forEach(function (ar) {
        pos.forEach(function (ac) {
          if ((ar < 9 && ac < 9) || (ar < 9 && ac > n - 10) || (ar > n - 10 && ac < 9)) return;
          if (hole && ar + 2 >= hole.r0 && ar - 2 < hole.r1 && ac + 2 >= hole.c0 && ac - 2 < hole.c1) return;
          aligns.push([ar, ac]);
          var x = ac - 2 + m, y = ar - 2 + m;
          shapes.push({ k: 'rect', x: x, y: y, w: 5, h: 5, r: style === 'dots' ? 1.6 : 1.0, fill: fg });
          shapes.push({ k: 'rect', x: x + 1, y: y + 1, w: 3, h: 3, r: style === 'dots' ? 1.0 : 0.6, fill: bg });
          if (style === 'dots') shapes.push({ k: 'circle', cx: ac + m + 0.5, cy: ar + m + 0.5, rad: 0.5, fill: fg });
          else shapes.push({ k: 'rect', x: x + 2, y: y + 2, w: 1, h: 1, r: 0.3, fill: fg });
        });
      });
    }
    function inAlign(r, c) {
      for (var i = 0; i < aligns.length; i++) if (Math.abs(aligns[i][0] - r) <= 2 && Math.abs(aligns[i][1] - c) <= 2) return true;
      return false;
    }

    // Data modules
    for (var r = 0; r < n; r++) {
      if (style === 'square') {
        var c = 0;
        while (c < n) {
          if (qr.isDark(r, c) && !inFinder(r, c) && !inHole(r, c)) {
            var start = c;
            while (c < n && qr.isDark(r, c) && !inFinder(r, c) && !inHole(r, c)) c++;
            shapes.push({ k: 'rect', x: start + m, y: r + m, w: c - start, h: 1, fill: fg });
          } else c++;
        }
      } else {
        for (var c2 = 0; c2 < n; c2++) {
          if (!qr.isDark(r, c2) || inFinder(r, c2) || inHole(r, c2) || inAlign(r, c2)) continue;
          if (style === 'dots') shapes.push({ k: 'circle', cx: c2 + m + 0.5, cy: r + m + 0.5, rad: 0.45, fill: fg });
          else shapes.push({ k: 'rect', x: c2 + m + 0.04, y: r + m + 0.04, w: 0.92, h: 0.92, r: 0.32, fill: fg });
        }
      }
    }

    var logoBox = null;
    if (hole) {
      var pad = 0.5;
      logoBox = { x: hole.c0 + m + pad, y: hole.r0 + m + pad, w: hole.c1 - hole.c0 - 2 * pad, h: hole.r1 - hole.r0 - 2 * pad };
    }
    return { n: n, total: total, shapes: shapes, logoBox: logoBox, version: qr.getTypeNumber ? qr.getTypeNumber() : null };
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCanvas(canvas, model, px, logoImg) {
    canvas.width = px; canvas.height = px;
    var ctx = canvas.getContext('2d');
    var s = px / model.total;
    model.shapes.forEach(function (sh) {
      ctx.fillStyle = sh.fill;
      if (sh.k === 'circle') {
        ctx.beginPath(); ctx.arc(sh.cx * s, sh.cy * s, sh.rad * s, 0, Math.PI * 2); ctx.fill();
      } else if (sh.r) {
        roundRectPath(ctx, sh.x * s, sh.y * s, sh.w * s, sh.h * s, sh.r * s); ctx.fill();
      } else {
        // Snap to whole pixels so adjacent modules never show hairline seams.
        var x0 = Math.round(sh.x * s), y0 = Math.round(sh.y * s);
        var x1 = Math.round((sh.x + sh.w) * s), y1 = Math.round((sh.y + sh.h) * s);
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    });
    if (model.logoBox && logoImg) {
      var b = model.logoBox;
      var iw = logoImg.naturalWidth || logoImg.width || 1, ih = logoImg.naturalHeight || logoImg.height || 1;
      var k = Math.min(b.w / iw, b.h / ih);
      var dw = iw * k, dh = ih * k;
      ctx.drawImage(logoImg, (b.x + (b.w - dw) / 2) * s, (b.y + (b.h - dh) / 2) * s, dw * s, dh * s);
    }
  }

  function fmt(n) { return String(Math.round(n * 1000) / 1000); }
  function xmlEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // Inner SVG elements of a code (in module units, viewBox 0 0 total total).
  function buildSvgBody(model, logo) {
    var out = [];
    // Group consecutive square runs of the same colour into one path for a small file.
    var path = [], pathFill = null;
    function flush() { if (path.length) { out.push('<path fill="' + pathFill + '" d="' + path.join('') + '"/>'); path = []; } }
    model.shapes.forEach(function (sh, i) {
      if (sh.k === 'rect' && !sh.r && i > 0) {
        if (pathFill !== sh.fill) { flush(); pathFill = sh.fill; }
        path.push('M' + fmt(sh.x) + ' ' + fmt(sh.y) + 'h' + fmt(sh.w) + 'v' + fmt(sh.h) + 'h-' + fmt(sh.w) + 'z');
        return;
      }
      flush();
      if (sh.k === 'circle') out.push('<circle cx="' + fmt(sh.cx) + '" cy="' + fmt(sh.cy) + '" r="' + fmt(sh.rad) + '" fill="' + sh.fill + '"/>');
      else out.push('<rect x="' + fmt(sh.x) + '" y="' + fmt(sh.y) + '" width="' + fmt(sh.w) + '" height="' + fmt(sh.h) + '"' +
        (sh.r ? ' rx="' + fmt(sh.r) + '"' : '') + ' fill="' + sh.fill + '"/>');
    });
    flush();
    if (model.logoBox && logo && logo.dataUrl) {
      var b = model.logoBox;
      out.push('<image x="' + fmt(b.x) + '" y="' + fmt(b.y) + '" width="' + fmt(b.w) + '" height="' + fmt(b.h) +
        '" preserveAspectRatio="xMidYMid meet" href="' + xmlEsc(logo.dataUrl) + '" xlink:href="' + xmlEsc(logo.dataUrl) + '"/>');
    }
    return out.join('');
  }
  function shapeRendering() { return state.style === 'square' ? 'crispEdges' : 'geometricPrecision'; }

  function buildSvg(model, logo, sizePx) {
    var T = model.total;
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + T + ' ' + T +
      '" width="' + sizePx + '" height="' + sizePx + '" shape-rendering="' + shapeRendering() + '">' + buildSvgBody(model, logo) + '</svg>';
  }

  /* ------------------------------------------------------------------ generator UI */
  var form = $('#makeForm');
  var canvas = $('#qrCanvas');
  var labelInput = $('#o-label');
  var DEFAULT_CAPTION = { url: 'Scan me', text: 'Scan me', wifi: 'Scan for Wi-Fi', vcard: 'Scan to save my contact',
    email: 'Scan to email us', sms: 'Scan to text us', tel: 'Scan to call us' };
  var state = { type: 'url', payload: '', model: null, ecl: 'M', style: 'square', fg: '#111111', bg: '#ffffff', margin: 4, size: 2048 };
  var logo = null; // { img, dataUrl }

  function readValues() {
    var v = {};
    $$('input, textarea, select', form).forEach(function (el) {
      if (!el.name || el.type === 'file') return;
      if (el.type === 'radio') { if (el.checked) v[el.name] = el.value; }
      else if (el.type === 'checkbox') v[el.name] = el.checked;
      else v[el.name] = el.value;
    });
    return v;
  }

  function hexToRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }
  function lum(h) {
    var c = hexToRgb(h).map(function (x) { return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) { var A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); }

  function setButtons(on) { ['#dlPng', '#dlSvg', '#copyPng', '#dlSignPng', '#dlSignSvg'].forEach(function (s) { $(s).disabled = !on; }); }

  function render() {
    var v = readValues();
    state.type = v.type;
    $$('.fields', form).forEach(function (f) { f.hidden = f.getAttribute('data-type') !== v.type; });
    state.fg = v.fg; state.bg = v.bg; state.style = v.style; state.size = parseInt(v.size, 10);
    state.margin = parseInt(v.margin, 10);
    $('#o-margin-out').textContent = String(state.margin);
    if (logo && v.ecl !== 'H') { $('#o-ecl').value = 'H'; v.ecl = 'H'; }
    state.ecl = v.ecl;

    // Colour warnings
    var warn = $('#contrastWarn'), cr = contrast(v.fg, v.bg);
    if (lum(v.fg) > lum(v.bg)) { warn.textContent = 'Light code on a dark background: many phone cameras can’t read inverted codes. Use a darker code colour.'; warn.hidden = false; }
    else if (cr < 4) { warn.textContent = 'Low contrast (' + cr.toFixed(1) + ':1). Some phones may not scan this. Aim for at least 4:1.'; warn.hidden = false; }
    else warn.hidden = true;

    var payload = buildPayload(v.type, v);
    state.payload = payload;
    var err = $('#genError');
    var info = $('#payloadInfo');
    if (!payload) {
      state.model = null;
      var ctx = canvas.getContext('2d'); canvas.width = canvas.height = 320;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-2') || '#eee';
      ctx.fillRect(0, 0, 320, 320);
      info.textContent = 'Fill in the fields to make your code.';
      err.hidden = true; setButtons(false); updateCaption();
      return;
    }
    try {
      state.model = buildModel(payload, { ecl: state.ecl, margin: state.margin, fg: v.fg, bg: v.bg, style: v.style, logo: !!logo });
      drawCanvas(canvas, state.model, 640, logo && logo.img);
      err.hidden = true; setButtons(true);
      var shown = payload.length > 120 ? payload.slice(0, 117) + '…' : payload;
      info.textContent = 'Encodes: ' + shown.replace(/\r\n/g, ' ⏎ ');
      canvas.setAttribute('aria-label', 'QR code for ' + shown);
      updateCaption();
    } catch (e) {
      state.model = null; setButtons(false);
      err.textContent = 'That’s too much data for one QR code. Shorten it, or lower error correction.';
      err.hidden = false;
    }
  }

  var t = null;
  function scheduleRender() { clearTimeout(t); t = setTimeout(render, 60); }
  form.addEventListener('input', scheduleRender);
  form.addEventListener('change', scheduleRender);

  $('#o-logo').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) { toast('#toast', 'Logo is over 3 MB — please use a smaller file.'); e.target.value = ''; return; }
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () { logo = { img: img, dataUrl: rd.result }; $('#logoClear').hidden = false; $('#o-ecl').value = 'H'; render(); };
      img.onerror = function () { toast('#toast', 'Couldn’t read that image.'); };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  });
  $('#logoClear').addEventListener('click', function () { logo = null; $('#o-logo').value = ''; $('#logoClear').hidden = true; render(); });

  function slug(s) { return String(s).replace(/^[a-z]+:(\/\/)?/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 40).toLowerCase() || 'code'; }
  function fileBase() { return 'qr-' + (state.type === 'url' ? slug(state.payload) : state.type); }

  function pngBlob(px) {
    return new Promise(function (resolve, reject) {
      if (!state.model) return reject(new Error('no code'));
      var c = document.createElement('canvas');
      drawCanvas(c, state.model, px, logo && logo.img);
      c.toBlob(function (b) { b ? resolve(b) : reject(new Error('toBlob failed')); }, 'image/png');
    });
  }
  function saveBlob(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  function toast(sel, msg) { var el = $(sel); el.textContent = msg; clearTimeout(el._t); el._t = setTimeout(function () { el.textContent = ''; }, 4000); }

  $('#dlPng').addEventListener('click', function () {
    pngBlob(state.size).then(function (b) { saveBlob(b, fileBase() + '-' + state.size + '.png'); toast('#toast', 'PNG downloaded (' + state.size + ' px).'); track('generate-download'); });
  });
  $('#dlSvg').addEventListener('click', function () {
    if (!state.model) return;
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + buildSvg(state.model, logo, 1024);
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), fileBase() + '.svg');
    toast('#toast', 'SVG downloaded.'); track('generate-download');
  });
  $('#copyPng').addEventListener('click', function () {
    if (!navigator.clipboard || !window.ClipboardItem) { toast('#toast', 'Your browser can’t copy images — use Download instead.'); return; }
    var item = new ClipboardItem({ 'image/png': pngBlob(1024) });
    navigator.clipboard.write([item]).then(function () { toast('#toast', 'Image copied — paste it anywhere.'); track('generate-copy'); },
      function () { toast('#toast', 'Copy was blocked by the browser — use Download instead.'); });
  });

  render();

  /* ------------------------------------------------------------------ caption + printable sign */
  function captionText() { return (labelInput.value || '').trim() || DEFAULT_CAPTION[state.type] || 'Scan me'; }
  function updateCaption() {
    var cap = $('#qrCaption'), v = (labelInput.value || '').trim();
    cap.textContent = v; cap.hidden = !v;
    labelInput.placeholder = DEFAULT_CAPTION[state.type] || 'Scan me';
  }
  labelInput.addEventListener('input', updateCaption);

  // Second line on the sign: tells people what the code does before they scan it.
  function subline() {
    var v = readValues();
    switch (state.type) {
      case 'url': try { var u = new URL(state.payload); return u.hostname.replace(/^www\./, '') + (u.pathname.length > 1 ? u.pathname : ''); } catch (e) { return ''; }
      case 'wifi': return v.ssid ? 'Network: ' + v.ssid : '';
      case 'vcard': return [v.first, v.last].filter(Boolean).join(' ') || v.org || '';
      case 'email': return (v.eto || '').trim();
      case 'sms': return (v.snum || '').trim();
      case 'tel': return (v.tel || '').trim();
    }
    return '';
  }

  var SIGN_W = 1800, SIGN_H = 2400, SIGN_QR = 1300, SIGN_GAP = 90; // 6 x 8 in at 300 dpi; code is ~4.3 in wide
  var SIGN_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  function wrapText(ctx, text, maxW) {
    var words = text.split(/\s+/), lines = [], line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width <= maxW || !line) line = test; else { lines.push(line); line = w; }
    });
    if (line) lines.push(line);
    return lines;
  }
  function fitText(ctx, text, maxW) {
    while (text.length > 1 && ctx.measureText(text).width > maxW) text = text.slice(0, -2) + '…';
    return text;
  }

  // Shared layout for PNG and SVG so both look the same.
  function signLayout() {
    var c = document.createElement('canvas').getContext('2d');
    var cap = captionText(), size = 150, lines;
    var sizes = [150, 128, 110, 96, 84];
    for (var i = 0; i < sizes.length; i++) {
      size = sizes[i]; c.font = '800 ' + size + 'px ' + SIGN_FONT;
      lines = wrapText(c, cap, SIGN_W - 300);
      if (lines.length <= 2 && lines.every(function (l) { return c.measureText(l).width <= SIGN_W - 300; })) break;
    }
    if (lines.length > 2) lines = [lines[0], lines.slice(1).join(' ')]; // overflow goes to line 2 and is cut with an ellipsis
    lines = lines.map(function (l) { return fitText(c, l, SIGN_W - 300); });
    var lineH = Math.round(size * 1.18);
    var sub = subline(), subSize = 62;
    c.font = '500 ' + subSize + 'px ' + SIGN_FONT;
    if (sub) sub = fitText(c, sub, SIGN_W - 300);
    var blockH = lines.length * lineH + SIGN_GAP + SIGN_QR + (sub ? 70 + subSize : 0);
    var top = Math.round((SIGN_H - blockH) / 2);
    return { lines: lines, size: size, lineH: lineH, capTop: top, qrX: (SIGN_W - SIGN_QR) / 2, qrY: top + lines.length * lineH + SIGN_GAP,
      sub: sub, subSize: subSize, subY: top + lines.length * lineH + SIGN_GAP + SIGN_QR + 70 + Math.round(subSize * 0.8) };
  }

  function signPngBlob() {
    return new Promise(function (resolve, reject) {
      if (!state.model) return reject(new Error('no code'));
      var L = signLayout(), c = document.createElement('canvas');
      c.width = SIGN_W; c.height = SIGN_H;
      var ctx = c.getContext('2d');
      ctx.fillStyle = state.bg; ctx.fillRect(0, 0, SIGN_W, SIGN_H);
      ctx.strokeStyle = state.fg; ctx.lineWidth = 8;
      roundRectPath(ctx, 60, 60, SIGN_W - 120, SIGN_H - 120, 70); ctx.stroke();
      ctx.fillStyle = state.fg; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.font = '800 ' + L.size + 'px ' + SIGN_FONT;
      L.lines.forEach(function (l, i) { ctx.fillText(l, SIGN_W / 2, L.capTop + i * L.lineH + Math.round(L.size * 0.9)); });
      var q = document.createElement('canvas');
      drawCanvas(q, state.model, SIGN_QR, logo && logo.img);
      ctx.drawImage(q, L.qrX, L.qrY);
      if (L.sub) { ctx.font = '500 ' + L.subSize + 'px ' + SIGN_FONT; ctx.globalAlpha = 0.8; ctx.fillText(L.sub, SIGN_W / 2, L.subY); ctx.globalAlpha = 1; }
      c.toBlob(function (b) { b ? resolve(b) : reject(new Error('toBlob failed')); }, 'image/png');
    });
  }

  function signSvg() {
    if (!state.model) return '';
    var L = signLayout(), T = state.model.total;
    var out = ['<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' +
      SIGN_W + ' ' + SIGN_H + '" width="6in" height="8in">'];
    out.push('<rect width="' + SIGN_W + '" height="' + SIGN_H + '" fill="' + state.bg + '"/>');
    out.push('<rect x="60" y="60" width="' + (SIGN_W - 120) + '" height="' + (SIGN_H - 120) + '" rx="70" fill="none" stroke="' + state.fg + '" stroke-width="8"/>');
    var fam = xmlEsc(SIGN_FONT);
    L.lines.forEach(function (l, i) {
      out.push('<text x="' + SIGN_W / 2 + '" y="' + (L.capTop + i * L.lineH + Math.round(L.size * 0.9)) + '" text-anchor="middle" font-family="' + fam +
        '" font-weight="800" font-size="' + L.size + '" fill="' + state.fg + '">' + xmlEsc(l) + '</text>');
    });
    out.push('<svg x="' + L.qrX + '" y="' + L.qrY + '" width="' + SIGN_QR + '" height="' + SIGN_QR + '" viewBox="0 0 ' + T + ' ' + T +
      '" shape-rendering="' + shapeRendering() + '">' + buildSvgBody(state.model, logo) + '</svg>');
    if (L.sub) out.push('<text x="' + SIGN_W / 2 + '" y="' + L.subY + '" text-anchor="middle" font-family="' + fam + '" font-weight="500" font-size="' +
      L.subSize + '" fill="' + state.fg + '" fill-opacity="0.8">' + xmlEsc(L.sub) + '</text>');
    out.push('</svg>');
    return out.join('');
  }

  $('#dlSignPng').addEventListener('click', function () {
    signPngBlob().then(function (b) { saveBlob(b, fileBase() + '-sign.png'); toast('#toast', 'Printable sign downloaded (6 × 8 in at 300 dpi).'); track('sign-download'); });
  });
  $('#dlSignSvg').addEventListener('click', function () {
    var svg = signSvg(); if (!svg) return;
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), fileBase() + '-sign.svg');
    toast('#toast', 'Printable sign downloaded (SVG).'); track('sign-download');
  });

  /* ------------------------------------------------------------------ presets via URL (?type=wifi&label=...) */
  // Only pre-selects and pre-fills. Never downloads or submits anything.
  var TYPE_ALIASES = { url: 'url', link: 'url', website: 'url', text: 'text', wifi: 'wifi', 'wi-fi': 'wifi', vcard: 'vcard', contact: 'vcard',
    email: 'email', mail: 'email', sms: 'sms', text_message: 'sms', phone: 'tel', tel: 'tel', call: 'tel' };
  function applyPreset() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    var label = q.get('label');
    if (label) labelInput.value = label.replace(/[\u0000-\u001f]/g, '').slice(0, 60);
    var type = TYPE_ALIASES[(q.get('type') || '').toLowerCase()];
    if (!type) { if (label) updateCaption(); return; }
    var radio = $('input[name="type"][value="' + type + '"]', form);
    radio.checked = true;
    function set(sel, val, max) { if (val != null && val !== '') $(sel).value = String(val).slice(0, max || 300); }
    var u = q.get('url');
    if (type === 'url') $('#f-url').value = (u && /^https?:\/\//i.test(u)) ? u.slice(0, 1500) : '';
    set('#f-text', q.get('text'), 1500);
    set('#f-ssid', q.get('ssid'), 64);
    if (/^(WPA|WEP|nopass)$/.test(q.get('enc') || '')) $('#f-wenc').value = q.get('enc');
    if (type === 'sms') { set('#f-snum', q.get('number'), 40); set('#f-smsg', q.get('msg'), 300); }
    if (type === 'tel') set('#f-tel', q.get('number'), 40);
    if (type === 'email') { set('#f-eto', q.get('to'), 200); set('#f-esub', q.get('subject'), 200); set('#f-ebody', q.get('body'), 1000); }
    if (type === 'vcard') { set('#f-org', q.get('org'), 100); }
    showTab('make');
    render();
    var fields = $('.fields[data-type="' + type + '"]', form);
    var first = $$('input, textarea', fields).filter(function (el) { return !el.value; })[0] || $('input, textarea', fields);
    var tool = $('.tool');
    if (tool && tool.scrollIntoView) tool.scrollIntoView({ block: 'start' });
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
    track('preset-' + type);
  }
  applyPreset();

  /* ------------------------------------------------------------------ offline / install (PWA) */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(function () { /* offline support is optional */ });
    });
  }

  /* ------------------------------------------------------------------ scanner */
  var jsqrPromise = null;
  function loadJsQR() {
    if (window.jsQR) return Promise.resolve(window.jsQR);
    if (!jsqrPromise) jsqrPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'vendor/jsQR-1.4.0.js';
      s.onload = function () { res(window.jsQR); };
      s.onerror = function () { jsqrPromise = null; rej(new Error('Could not load the decoder.')); };
      document.head.appendChild(s);
    });
    return jsqrPromise;
  }
  var detector = null;
  try { if ('BarcodeDetector' in window) detector = new window.BarcodeDetector({ formats: ['qr_code'] }); } catch (e) { detector = null; }

  function decodeImageData(imgData) {
    return loadJsQR().then(function (jsQR) {
      var r = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'attemptBoth' });
      return r ? r.data : null;
    });
  }

  function imageToData(img, maxDim) {
    var w = img.naturalWidth || img.videoWidth || img.width, h = img.naturalHeight || img.videoHeight || img.height;
    var k = Math.min(1, maxDim / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
    var ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); // flatten transparency
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return ctx.getImageData(0, 0, c.width, c.height);
  }

  function decodeImageElement(img) {
    var tryDetector = detector ? detector.detect(img).then(function (codes) { return codes && codes.length ? codes[0].rawValue : null; }, function () { return null; }) : Promise.resolve(null);
    return tryDetector.then(function (hit) {
      if (hit) return hit;
      var sizes = [1000, 600, 1800];
      var i = 0;
      function next() {
        if (i >= sizes.length) return null;
        return decodeImageData(imageToData(img, sizes[i++])).then(function (r) { return r || next(); });
      }
      return next();
    });
  }

  function decodeFile(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { decodeImageElement(img).then(function (r) { URL.revokeObjectURL(url); res(r); }, rej); };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('Not an image we can read.')); };
      img.src = url;
    });
  }

  var scanStatus = $('#scanStatus');
  $('#scanFile').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    stopCamera();
    scanStatus.textContent = 'Reading image…';
    decodeFile(f).then(function (text) {
      if (text == null) { scanStatus.textContent = 'No QR code found. Try a sharper or closer photo.'; $('#scanResult').hidden = true; }
      else { scanStatus.textContent = ''; showResult(text); }
    }, function (err) { scanStatus.textContent = err.message; });
    e.target.value = '';
  });

  // Camera
  var stream = null, loopTimer = null, video = $('#scanVideo');
  function stopCamera() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (stream) { stream.getTracks().forEach(function (tr) { tr.stop(); }); stream = null; }
    if (video) video.srcObject = null;
    var vw = $('#videoWrap'); if (vw) vw.hidden = true;
    var cs = $('#camStop'), cst = $('#camStart'); if (cs) cs.hidden = true; if (cst) cst.hidden = false;
  }
  $('#camStart').addEventListener('click', function () {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { scanStatus.textContent = 'Camera isn’t available here. Upload a photo instead.'; return; }
    scanStatus.textContent = 'Starting camera…';
    loadJsQR().catch(function () {});
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }).then(function (s) {
      stream = s; video.srcObject = s; $('#videoWrap').hidden = false; $('#camStart').hidden = true; $('#camStop').hidden = false;
      return video.play();
    }).then(function () { scanStatus.textContent = 'Point the camera at a QR code.'; tick(); }, function (err) {
      stopCamera();
      scanStatus.textContent = (err && err.name === 'NotAllowedError') ? 'Camera permission was denied. You can upload a photo instead.' : 'Couldn’t start the camera. Upload a photo instead.';
    });
  });
  $('#camStop').addEventListener('click', function () { stopCamera(); scanStatus.textContent = ''; });

  function tick() {
    if (!stream) return;
    var p;
    if (video.readyState < 2) p = Promise.resolve(null);
    else if (detector) p = detector.detect(video).then(function (c) { return c && c.length ? c[0].rawValue : null; }, function () { return null; });
    else p = decodeImageData(imageToData(video, 640)).catch(function () { return null; });
    p.then(function (text) {
      if (text != null && stream) { if (navigator.vibrate) navigator.vibrate(60); stopCamera(); scanStatus.textContent = ''; showResult(text); }
      else if (stream) loopTimer = setTimeout(tick, 150);
    });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopCamera(); });

  // Result rendering (DOM nodes + textContent only: never inject decoded data as HTML)
  var SHORTENERS = /^(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rebrand\.ly|cutt\.ly|shorturl\.at|rb\.gy|qrco\.de|qr-code-generator\.com|l\.ead\.me|me-qr\.com|tiny\.cc|s\.id|t\.ly)$/i;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function copyBtn(label, value) {
    var b = el('button', { type: 'button', 'class': 'btn' }, label);
    b.addEventListener('click', function () {
      (navigator.clipboard ? navigator.clipboard.writeText(value) : Promise.reject()).then(function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = label; }, 1800); },
        function () { b.textContent = 'Copy failed'; });
    });
    return b;
  }
  function parseWifi(s) {
    var out = {}, re = /(T|S|P|H):((?:\\.|[^;])*);/g, m;
    while ((m = re.exec(s))) out[m[1]] = m[2].replace(/\\(.)/g, '$1');
    return out;
  }

  function showResult(text) {
    track('scan-result');
    var box = $('#scanResult'), kind = $('#resultKind'), body = $('#resultBody'), acts = $('#resultActions');
    body.textContent = ''; acts.textContent = '';
    box.hidden = false;
    var lower = text.trim().toLowerCase();
    var url = null;
    if (/^https?:\/\//.test(lower)) { try { url = new URL(text.trim()); } catch (e) { url = null; } }

    if (url) {
      kind.textContent = 'Link — check it before you open it';
      var p = el('p', { 'class': 'result-url', id: 'resultText' });
      var href = url.href, host = url.hostname;
      var idx = href.indexOf(host);
      p.appendChild(document.createTextNode(href.slice(0, idx)));
      p.appendChild(el('mark', null, host));
      p.appendChild(document.createTextNode(href.slice(idx + host.length)));
      body.appendChild(p);
      body.appendChild(el('p', { 'class': 'hint' }, 'Highlighted part is the website you’ll actually visit: ' + host));
      var warns = [];
      if (url.protocol === 'http:') warns.push('Not encrypted (http). Avoid entering passwords or card details.');
      if (/(^|\.)xn--/.test(host)) warns.push('This domain uses lookalike characters (punycode). Be careful.');
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.indexOf(':') >= 0) warns.push('Link goes to a raw IP address, not a named website.');
      if (url.username || url.password) warns.push('Link contains an “@” login trick; the real site is ' + host + '.');
      if (SHORTENERS.test(host)) warns.push('This is a short/redirect link — the final destination is hidden and may stop working if the service expires it.');
      warns.forEach(function (w) { body.appendChild(el('p', { 'class': 'result-warn' }, '⚠ ' + w)); });
      var open = el('a', { 'class': 'btn primary', href: href, target: '_blank', rel: 'noopener noreferrer nofollow' }, 'Open link');
      acts.appendChild(open);
      acts.appendChild(copyBtn('Copy link', href));
    } else if (/^wifi:/i.test(text)) {
      var w = parseWifi(text.slice(5));
      kind.textContent = 'Wi-Fi network';
      var dl = el('dl', { 'class': 'kv' });
      [['Network', w.S || ''], ['Password', w.P || '(none)'], ['Security', w.T || 'unknown'], ['Hidden', w.H === 'true' ? 'yes' : 'no']].forEach(function (r) {
        dl.appendChild(el('dt', null, r[0])); dl.appendChild(el('dd', null, r[1]));
      });
      body.appendChild(dl);
      if (w.P) acts.appendChild(copyBtn('Copy password', w.P));
    } else if (/^begin:vcard/i.test(text)) {
      kind.textContent = 'Contact card';
      body.appendChild(el('pre', { 'class': 'result-pre', id: 'resultText' }, text));
      var save = el('button', { type: 'button', 'class': 'btn primary' }, 'Save contact (.vcf)');
      save.addEventListener('click', function () { saveBlob(new Blob([text], { type: 'text/vcard' }), 'contact.vcf'); });
      acts.appendChild(save);
      acts.appendChild(copyBtn('Copy text', text));
    } else if (/^(mailto:|tel:|smsto:|sms:)/i.test(text)) {
      var isMail = /^mailto:/i.test(text), isTel = /^tel:/i.test(text);
      kind.textContent = isMail ? 'Email' : isTel ? 'Phone number' : 'Text message';
      body.appendChild(el('pre', { 'class': 'result-pre', id: 'resultText' }, text));
      var target = text;
      var sm = /^smsto:([^:]*):?([\s\S]*)$/i.exec(text);
      if (sm) target = 'sms:' + sm[1] + (sm[2] ? '?&body=' + encodeURIComponent(sm[2]) : '');
      acts.appendChild(el('a', { 'class': 'btn primary', href: target, rel: 'noopener noreferrer' }, isMail ? 'Open email app' : isTel ? 'Call' : 'Open messages'));
      acts.appendChild(copyBtn('Copy', text));
    } else {
      kind.textContent = 'Text';
      body.appendChild(el('pre', { 'class': 'result-pre', id: 'resultText' }, text));
      if (/^[a-z][a-z0-9+.-]*:/i.test(lower) && /^(javascript|data|vbscript|file|intent):/i.test(lower)) {
        body.appendChild(el('p', { 'class': 'result-warn' }, '⚠ This code contains a script/system link. We won’t open it.'));
      }
      acts.appendChild(copyBtn('Copy text', text));
    }
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ------------------------------------------------------------------ waitlist */
  $('#signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('#s-email'), msg = $('#signupMsg'), email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
    if (!CFG.SIGNUP_ENDPOINT) {
      msg.textContent = 'Thanks — coming soon.'; input.value = ''; return; // nothing stored or sent
    }
    var fd = new FormData(); fd.append('email', email); fd.append('source', 'dynamic-waitlist');
    msg.textContent = 'Sending…';
    fetch(CFG.SIGNUP_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).then(function (r) {
      if (!r.ok && r.type !== 'opaque') throw new Error(r.status);
      msg.textContent = 'Thanks — you’re on the list. We’ll email you once, at launch.'; input.value = ''; track('waitlist-signup');
    }).catch(function () { msg.textContent = 'Something went wrong. Please try again in a minute.'; });
  });

  // Small test/debug surface (harmless in production).
  window.QRApp = {
    buildPayload: buildPayload, buildSvg: function () { return state.model ? buildSvg(state.model, logo, 1024) : ''; },
    pngBlob: pngBlob, signPngBlob: signPngBlob, signSvg: signSvg, decodeImageData: decodeImageData, decodeFile: decodeFile,
    state: function () { return { type: state.type, payload: state.payload, ecl: state.ecl, n: state.model && state.model.n }; }
  };
})();
