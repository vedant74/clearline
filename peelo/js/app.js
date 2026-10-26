/* UI + image pipeline. Model runs at 320x320; the mask is upscaled and applied to the
   original-resolution image only when exporting, so downloads are full resolution.

   URL presets (used by the guide pages), all optional:
     ?preset=marketplace          white background, square, product fills 85%
     ?preset=logo | signature     "Plain background" method, transparent output
     ?bg=transparent|white|black|blur|<6-digit hex, no #>
     ?format=square|original      square canvas with the subject centred
     ?fill=50..100                % of the square's side the subject's longer edge fills
     ?method=ai|plain             AI subject detection, or key out a plain/solid background */
(function () {
  "use strict";
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const PREVIEW_MAX = 1400;
  const MAX_SIDE = Math.floor(Math.sqrt(C.MAX_PIXELS)); // square exports stay under the pixel cap

  const el = {
    dropzone: $("#dropzone"), fileInput: $("#fileInput"), workspace: $("#workspace"),
    status: $("#status"), statusText: $("#statusText"), statusBar: $("#statusBar"), warn: $("#warn"),
    stage: $("#stage"), after: $("#afterCanvas"), before: $("#beforeCanvas"),
    compare: $("#compare"), handle: $("#compareHandle"), cursor: $("#brushCursor"),
    refinePanel: $("#refinePanel"), brushSize: $("#brushSize"), brushSizeOut: $("#brushSizeOut"),
    undo: $("#undoBtn"), resetEdits: $("#resetEditsBtn"),
    feather: $("#feather"), featherOut: $("#featherOut"),
    colorRow: $("#colorRow"), bgColor: $("#bgColor"), blurRow: $("#blurRow"), blurAmt: $("#blurAmt"), blurOut: $("#blurOut"),
    bgFile: $("#bgFile"), dlPng: $("#dlPng"), dlJpg: $("#dlJpg"), meta: $("#meta"), newBtn: $("#newBtn"),
    fill: $("#fill"), fillOut: $("#fillOut"), fillRow: $("#fillRow"), marketBtn: $("#marketBtn"),
    presetNote: $("#presetNote"), frameNote: $("#frameNote"),
  };

  const S = {
    img: null, name: "image", W: 0, H: 0, pw: 0, ph: 0,
    low: null, lowFor: null, keyBg: null, previewImg: null, previewMask: null, previewBaseMask: null,
    strokes: [], mode: "compare", brush: "erase",
    bg: "transparent", color: "#ffffff", bgImg: null, ready: false, busy: false, ms: 0,
    square: false, fill: 0.85, method: "ai", bbox: null, bboxDirty: true,
  };

  /* ---------- helpers ---------- */
  function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function free(c) { if (c) { c.width = 0; c.height = 0; } }
  function setStatus(text, frac) {
    el.status.hidden = false;
    el.statusText.textContent = text;
    el.statusBar.style.width = frac == null ? "100%" : Math.round(frac * 100) + "%";
    el.status.classList.toggle("indeterminate", frac == null);
  }
  function hideStatus() { el.status.hidden = true; }
  function warn(msg) { el.warn.hidden = !msg; el.warn.textContent = msg || ""; }

  let filterSupported = null;
  function canvasFilterOK() {
    if (filterSupported !== null) return filterSupported;
    try {
      const c = canvas(4, 1), x = c.getContext("2d");
      x.fillStyle = "#000"; x.fillRect(0, 0, 4, 1);
      x.filter = "blur(2px)";
      x.fillStyle = "#fff"; x.fillRect(0, 0, 1, 1);
      x.filter = "none";
      filterSupported = x.getImageData(2, 0, 1, 1).data[0] > 0;
    } catch (_) { filterSupported = false; }
    return filterSupported;
  }
  function smoothLUT(lo, width) {
    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) {
      let t = (v - lo) / width; t = t < 0 ? 0 : t > 1 ? 1 : t;
      lut[v] = Math.round(t * t * (3 - 2 * t) * 255);
    }
    return lut;
  }

  /* ---------- mask building ---------- */
  // AI method: upscale the low-res probability map to w x h and apply an edge curve ("Edge softness").
  function buildAIMask(w, h) {
    const n = S.low.size, src = S.low.data;
    const lowC = canvas(n, n), lx = lowC.getContext("2d");
    const id = lx.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const p = i * 4; id.data[p] = id.data[p + 1] = id.data[p + 2] = 255;
      id.data[p + 3] = Math.round(src[i] * 255);
    }
    lx.putImageData(id, 0, 0);
    // Upscale in up-to-4x steps for smoother interpolation.
    let cur = lowC, cw = n, ch = n;
    while (cw * 4 < w || ch * 4 < h) {
      const nw = Math.min(w, cw * 4), nh = Math.min(h, ch * 4);
      const nx = canvas(nw, nh), c2 = nx.getContext("2d");
      c2.imageSmoothingEnabled = true; c2.imageSmoothingQuality = "high";
      c2.drawImage(cur, 0, 0, nw, nh);
      if (cur !== lowC) free(cur);
      cur = nx; cw = nw; ch = nh;
    }
    const out = canvas(w, h), ox = out.getContext("2d", { willReadFrequently: true });
    ox.imageSmoothingEnabled = true; ox.imageSmoothingQuality = "high";
    ox.drawImage(cur, 0, 0, w, h);
    if (cur !== lowC) free(cur);
    free(lowC);
    const f = Number(el.feather.value) / 100;
    const width = (0.06 + f * 0.7) * 255;
    const lut = smoothLUT(127.5 - width / 2, width);
    const md = ox.getImageData(0, 0, w, h), d = md.data;
    for (let p = 3; p < d.length; p += 4) d[p] = lut[d[p]];
    ox.putImageData(md, 0, 0);
    return out;
  }

  // Estimate a plain background colour from the image border (per-channel median).
  function estimateBg(src, w, h) {
    const c = canvas(w, h), x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(src, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h).data, R = [], G = [], B = [];
    const take = (px, py) => { const p = (py * w + px) * 4; if (d[p + 3] > 128) { R.push(d[p]); G.push(d[p + 1]); B.push(d[p + 2]); } };
    const step = Math.max(1, Math.floor(Math.max(w, h) / 400));
    for (let i = 0; i < w; i += step) { take(i, 0); take(i, h - 1); }
    for (let j = 0; j < h; j += step) { take(0, j); take(w - 1, j); }
    free(c);
    if (!R.length) return [255, 255, 255];
    const med = (a) => { a.sort((p, q) => p - q); return a[a.length >> 1]; };
    return [med(R), med(G), med(B)];
  }

  // Plain-background method: alpha from each pixel's distance to the background colour.
  // Good for logos, signatures and scans where AI subject detection is the wrong tool.
  function buildKeyMask(w, h, src) {
    const out = canvas(w, h), ox = out.getContext("2d", { willReadFrequently: true });
    ox.drawImage(src, 0, 0, w, h);
    const md = ox.getImageData(0, 0, w, h), d = md.data;
    const bg = S.keyBg || [255, 255, 255];
    const f = Number(el.feather.value) / 100;
    const lut = smoothLUT(10 + f * 30, 18 + f * 90);
    for (let p = 0; p < d.length; p += 4) {
      const dist = Math.max(Math.abs(d[p] - bg[0]), Math.abs(d[p + 1] - bg[1]), Math.abs(d[p + 2] - bg[2]));
      const a = (lut[dist] * d[p + 3] + 127) / 255;
      d[p] = d[p + 1] = d[p + 2] = 255; d[p + 3] = a;
    }
    ox.putImageData(md, 0, 0);
    return out;
  }

  function buildMask(w, h, src) {
    return S.method === "plain" ? buildKeyMask(w, h, src) : buildAIMask(w, h);
  }

  function drawStroke(ctx, st, scale, from) {
    const pts = st.points;
    ctx.save();
    ctx.globalCompositeOperation = st.mode === "erase" ? "destination-out" : "source-over";
    ctx.strokeStyle = "#fff"; ctx.fillStyle = "#fff";
    ctx.lineWidth = st.size * scale; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const start = Math.max(0, (from || 0) - 1);
    if (pts.length === 1 || start === pts.length - 1) {
      const p = pts[pts.length - 1];
      ctx.beginPath(); ctx.arc(p[0] * scale, p[1] * scale, st.size * scale / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(pts[start][0] * scale, pts[start][1] * scale);
      for (let i = start + 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * scale, pts[i][1] * scale);
      ctx.stroke();
    }
    ctx.restore();
  }

  function rebuildPreviewMask(rebuildBase) {
    if (rebuildBase || !S.previewBaseMask) { free(S.previewBaseMask); S.previewBaseMask = buildMask(S.pw, S.ph, S.previewImg); }
    const x = S.previewMask.getContext("2d");
    x.globalCompositeOperation = "copy"; x.drawImage(S.previewBaseMask, 0, 0);
    x.globalCompositeOperation = "source-over";
    const sc = S.pw / S.W;
    for (const st of S.strokes) drawStroke(x, st, sc, 0);
    S.bboxDirty = true;
    updateEditButtons();
  }

  /* ---------- square framing ---------- */
  // Bounding box of the visible subject (alpha above a small threshold) in mask pixels.
  function maskBBox(maskC) {
    const w = maskC.width, h = maskC.height;
    const d = maskC.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y++) {
      const row = y * w * 4;
      let first = -1, last = -1;
      for (let x = 0; x < w; x++) if (d[row + x * 4 + 3] > 40) { first = x; break; }
      if (first < 0) continue;
      for (let x = w - 1; x >= first; x--) if (d[row + x * 4 + 3] > 40) { last = x; break; }
      if (first < x0) x0 = first; if (last > x1) x1 = last;
      if (y < y0) y0 = y; y1 = y;
    }
    if (x1 < 0) return { x: 0, y: 0, w: w, h: h, empty: true };
    return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }
  // Square layout: the subject's longer side fills `fill` of the square. Subjects cut off by the
  // bottom of the photo (headshots, products on a table edge) sit flush with the bottom.
  function frameLayout(bb, srcH, fill, maxSide) {
    let side = Math.max(1, Math.round(Math.max(bb.w, bb.h) / fill));
    const scale = Math.min(1, maxSide / side);
    side = Math.max(1, Math.round(side * scale));
    const w = Math.max(1, Math.round(bb.w * scale)), h = Math.max(1, Math.round(bb.h * scale));
    const bottom = !bb.empty && bb.y + bb.h >= srcH * 0.995;
    return { side, scale, w, h, dx: Math.round((side - w) / 2), dy: bottom ? side - h : Math.round((side - h) / 2) };
  }

  /* ---------- compositing ---------- */
  function drawCover(ctx, img, w, h) {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    const s = Math.max(w / iw, h / ih), dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }
  function drawBlurred(ctx, img, w, h) {
    const r = Math.max(1, Number(el.blurAmt.value) / 1000 * Math.max(w, h));
    if (canvasFilterOK()) {
      ctx.save(); ctx.filter = "blur(" + r.toFixed(1) + "px)";
      // Overdraw edges so the blur doesn't fade to transparent at the borders.
      const m = r * 2; ctx.drawImage(img, -m, -m, w + 2 * m, h + 2 * m); ctx.restore();
      return;
    }
    // Fallback (older Safari): downscale/upscale twice approximates a gaussian blur.
    const k = Math.max(1, r / 1.5);
    const sw = Math.max(1, Math.round(w / k)), sh = Math.max(1, Math.round(h / k));
    const a = canvas(sw, sh), ax = a.getContext("2d");
    ax.imageSmoothingQuality = "high"; ax.drawImage(img, 0, 0, sw, sh);
    const b = canvas(Math.max(1, sw >> 1), Math.max(1, sh >> 1)), bx = b.getContext("2d");
    bx.imageSmoothingQuality = "high"; bx.drawImage(a, 0, 0, b.width, b.height);
    ax.clearRect(0, 0, sw, sh); ax.drawImage(b, 0, 0, sw, sh);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(a, 0, 0, w, h); ctx.restore();
    free(a); free(b);
  }
  // Paint the chosen background into a w x h context. `src` is the original photo (for blur).
  function paintBg(ctx, w, h, src, srcW, srcH, forceOpaque) {
    const bg = S.bg;
    if (bg === "color" || (forceOpaque && bg === "transparent") || (bg === "image" && !S.bgImg)) {
      ctx.fillStyle = bg === "color" ? S.color : "#ffffff"; ctx.fillRect(0, 0, w, h);
    } else if (bg === "blur") {
      if (Math.abs(w / h - srcW / srcH) < 0.01) { drawBlurred(ctx, src, w, h); return; }
      // Different aspect (square framing): blur at the photo's aspect, then cover-fit.
      const k = Math.min(1, 2000 / Math.max(srcW, srcH));
      const t = canvas(Math.round(srcW * k), Math.round(srcH * k));
      drawBlurred(t.getContext("2d"), src, t.width, t.height);
      drawCover(ctx, t, w, h); free(t);
    } else if (bg === "image" && S.bgImg) {
      drawCover(ctx, S.bgImg, w, h);
    }
  }
  function compose(ctx, w, h, src, maskC, forceOpaque) {
    // cutout = mask, then image "source-in" -> image pixels with mask alpha
    const work = canvas(w, h), wx = work.getContext("2d");
    wx.drawImage(maskC, 0, 0, w, h);
    wx.globalCompositeOperation = "source-in";
    wx.imageSmoothingQuality = "high";
    wx.drawImage(src, 0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    paintBg(ctx, w, h, src, w, h, forceOpaque);
    ctx.drawImage(work, 0, 0);
    free(work);
  }
  // Square output: crop the subject (bb, in mask pixels), scale by L.scale, centre on the square.
  // `k` = source pixels per mask pixel (1 for the preview, >1 if the original exceeded 16 MP).
  function composeFramed(ctx, src, k, maskC, bb, L, forceOpaque) {
    const work = canvas(L.w, L.h), wx = work.getContext("2d");
    wx.imageSmoothingEnabled = true; wx.imageSmoothingQuality = "high";
    wx.drawImage(maskC, bb.x, bb.y, bb.w, bb.h, 0, 0, L.w, L.h);
    wx.globalCompositeOperation = "source-in";
    wx.drawImage(src, bb.x * k, bb.y * k, bb.w * k, bb.h * k, 0, 0, L.w, L.h);
    ctx.clearRect(0, 0, L.side, L.side);
    paintBg(ctx, L.side, L.side, src, maskC.width, maskC.height, forceOpaque);
    ctx.drawImage(work, L.dx, L.dy);
    free(work);
  }

  function sizeCanvases(w, h) {
    for (const c of [el.after, el.before]) if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    el.stage.style.setProperty("--ar", (w / h).toFixed(5));
  }

  function render() {
    if (!S.ready) return;
    const framed = S.square && S.mode !== "refine";
    el.frameNote.hidden = !(S.square && S.mode === "refine");
    if (framed) {
      if (S.bboxDirty || !S.bbox) { S.bbox = maskBBox(S.previewMask); S.bboxDirty = false; }
      const L = frameLayout(S.bbox, S.ph, S.fill, PREVIEW_MAX);
      sizeCanvases(L.side, L.side);
      composeFramed(el.after.getContext("2d"), S.previewImg, 1, S.previewMask, S.bbox, L, false);
      // "Before" shows the original photo in the same placement so the slider lines up.
      const bx = el.before.getContext("2d");
      bx.clearRect(0, 0, L.side, L.side);
      bx.drawImage(S.previewImg, L.dx - S.bbox.x * L.scale, L.dy - S.bbox.y * L.scale, S.pw * L.scale, S.ph * L.scale);
    } else {
      sizeCanvases(S.pw, S.ph);
      el.before.getContext("2d").drawImage(S.previewImg, 0, 0);
      compose(el.after.getContext("2d"), S.pw, S.ph, S.previewImg, S.previewMask, false);
    }
    updateMeta();
  }

  function outputSize() {
    if (!S.square) return [S.W, S.H];
    const bb = S.bbox || { x: 0, y: 0, w: S.pw, h: S.ph }, r = S.W / S.pw;
    const L = frameLayout({ x: bb.x * r, y: bb.y * r, w: bb.w * r, h: bb.h * r, empty: bb.empty }, S.H, S.fill, MAX_SIDE);
    return [L.side, L.side];
  }
  function updateMeta() {
    if (!S.ready) return;
    const o = outputSize();
    el.meta.textContent = (S.square ? "Square output, about " + o[0] + " × " + o[1] + " px" : o[0] + " × " + o[1] + " px") +
      " · done in " + (S.ms / 1000).toFixed(1) + " s · nothing uploaded" + (window.Segmenter.isStub() && S.method === "ai" ? " · STUB MASK (test mode)" : "");
  }

  /* ---------- export at full resolution ---------- */
  async function exportBlob(type) {
    const W = S.W, H = S.H, jpeg = type === "image/jpeg";
    const mask = buildMask(W, H, S.img), mx = mask.getContext("2d");
    for (const st of S.strokes) drawStroke(mx, st, 1, 0);
    let out;
    if (S.square) {
      const bb = maskBBox(mask), L = frameLayout(bb, H, S.fill, MAX_SIDE);
      out = canvas(L.side, L.side);
      composeFramed(out.getContext("2d"), S.img, (S.img.naturalWidth || W) / W, mask, bb, L, jpeg);
    } else {
      out = canvas(W, H);
      compose(out.getContext("2d"), W, H, S.img, mask, jpeg);
    }
    free(mask);
    const blob = await new Promise((res) => out.toBlob(res, type, 0.92));
    free(out);
    if (!blob) throw new Error("Your browser could not encode this image size.");
    return blob;
  }
  async function download(type) {
    if (!S.ready || S.busy) return;
    S.busy = true;
    const btn = type === "image/png" ? el.dlPng : el.dlJpg, label = btn.textContent;
    btn.textContent = "Preparing…"; btn.disabled = true;
    try {
      await new Promise((r) => setTimeout(r, 30));
      const blob = await exportBlob(type);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = S.name + (S.square ? "-square" : "-no-bg") + "." + (type === "image/png" ? "png" : "jpg");
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    } catch (e) {
      warn(e.message || "Export failed.");
    } finally {
      btn.textContent = label; btn.disabled = false; S.busy = false;
    }
  }

  /* ---------- loading an image ---------- */
  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("This file couldn't be opened. Try a JPG, PNG or WebP (iPhone HEIC photos: share or export as JPG first).")); };
      img.src = url;
    });
  }

  let modelProgressText = null;
  function prewarm() {
    if (S.method === "plain") return;
    window.Segmenter.load((f, cached) => {
      if (modelProgressText) setStatus(cached ? "Loading AI model from cache…" : "Downloading AI model (one time)… " + Math.round(f * 100) + "%", cached ? null : f);
    }).catch(() => {});
  }

  // Run the AI model for the current image if the AI method needs it and it hasn't run yet.
  async function ensureSegmented() {
    if (S.method !== "ai" || (S.low && S.lowFor === S.img)) return;
    modelProgressText = true;
    setStatus(window.Segmenter.isStub() ? "Test mode: using stub mask…" : "Loading AI model…", null);
    prewarm();
    try {
      await window.Segmenter.load();
      setStatus("Removing background on your device…", null);
      await new Promise((r) => setTimeout(r, 20));
      S.low = await window.Segmenter.predict(S.img, S.img.naturalWidth, S.img.naturalHeight);
      S.lowFor = S.img;
    } finally { modelProgressText = null; }
  }

  async function handleFile(file) {
    if (!file || !/^image\//.test(file.type || "image/")) { showWorkspace(); warn("That doesn't look like an image file."); return; }
    if (S.busy) return;
    S.busy = true; S.ready = false;
    showWorkspace();
    warn("");
    el.dlPng.disabled = el.dlJpg.disabled = true;
    el.meta.textContent = "";
    const warnings = [];
    if (file.size > C.WARN_FILE_MB * 1024 * 1024) warnings.push("Large file (" + (file.size / 1048576).toFixed(0) + " MB): processing may be slow on phones.");
    try {
      setStatus("Opening image…", null);
      const img = await loadImage(file);
      if (S.img && S.img.src.startsWith("blob:")) URL.revokeObjectURL(S.img.src);
      S.img = img; S.low = null; S.lowFor = null;
      S.name = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[^\w\-]+/g, "-").slice(0, 60) || "image";
      let W = img.naturalWidth, H = img.naturalHeight;
      if (W * H > C.MAX_PIXELS) {
        const k = Math.sqrt(C.MAX_PIXELS / (W * H));
        warnings.push("This photo is " + W + "×" + H + ". It will be saved at " + Math.floor(W * k) + "×" + Math.floor(H * k) + " (16 MP browser limit).");
        W = Math.floor(W * k); H = Math.floor(H * k);
      }
      S.W = W; S.H = H;
      const ps = Math.min(1, PREVIEW_MAX / Math.max(W, H));
      S.pw = Math.max(1, Math.round(W * ps)); S.ph = Math.max(1, Math.round(H * ps));
      free(S.previewImg); free(S.previewMask); free(S.previewBaseMask); S.previewBaseMask = null;
      S.previewImg = canvas(S.pw, S.ph);
      const px = S.previewImg.getContext("2d"); px.imageSmoothingQuality = "high"; px.drawImage(img, 0, 0, S.pw, S.ph);
      S.previewMask = canvas(S.pw, S.ph);
      S.keyBg = estimateBg(S.previewImg, S.pw, S.ph);
      sizeCanvases(S.pw, S.ph);
      el.before.getContext("2d").drawImage(S.previewImg, 0, 0);
      el.after.getContext("2d").clearRect(0, 0, S.pw, S.ph);
      warn(warnings.join(" "));

      const t0 = performance.now();
      await ensureSegmented();
      if (S.method === "plain") setStatus("Removing plain background…", null);
      S.strokes = [];
      rebuildPreviewMask(true);
      S.ms = performance.now() - t0;
      S.ready = true;
      render();
      hideStatus();
      el.dlPng.disabled = el.dlJpg.disabled = false;
      el.stage.dataset.state = "done";
    } catch (e) {
      console.error(e);
      hideStatus();
      warn("Couldn't remove the background: " + ((e && e.message) || "unknown error") + ". Try reloading the page.");
      el.stage.dataset.state = "error";
    } finally {
      modelProgressText = null;
      S.busy = false;
    }
  }

  function showWorkspace() {
    el.dropzone.hidden = true; el.workspace.hidden = false;
    const pr = $("#presetRow"); if (pr) pr.hidden = true;
  }

  /* ---------- input wiring ---------- */
  el.dropzone.addEventListener("click", () => el.fileInput.click());
  el.dropzone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.fileInput.click(); } });
  ["pointerenter", "touchstart", "focus"].forEach((ev) => el.dropzone.addEventListener(ev, prewarm, { once: true, passive: true }));
  el.fileInput.addEventListener("change", () => { handleFile(el.fileInput.files[0]); el.fileInput.value = ""; });
  document.addEventListener("dragover", (e) => { e.preventDefault(); el.dropzone.classList.add("is-over"); });
  document.addEventListener("dragleave", (e) => { if (!e.relatedTarget) el.dropzone.classList.remove("is-over"); });
  document.addEventListener("drop", (e) => {
    e.preventDefault(); el.dropzone.classList.remove("is-over");
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  });
  window.addEventListener("paste", (e) => {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) if (it.kind === "file" && it.type.startsWith("image/")) { handleFile(it.getAsFile()); e.preventDefault(); return; }
  });
  el.newBtn.addEventListener("click", () => el.fileInput.click());

  /* compare slider */
  function setCompare() {
    const v = Number(el.compare.value);
    el.before.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
    el.handle.style.left = v + "%";
  }
  el.compare.addEventListener("input", setCompare);
  setCompare();

  /* modes */
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    S.mode = b.dataset.mode;
    $$("[data-mode]").forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", x === b); });
    el.refinePanel.hidden = S.mode !== "refine";
    el.stage.classList.toggle("refining", S.mode === "refine");
    render();
  }));
  $$("[data-brush]").forEach((b) => b.addEventListener("click", () => {
    S.brush = b.dataset.brush;
    $$("[data-brush]").forEach((x) => x.classList.toggle("is-on", x === b));
    el.cursor.dataset.brush = S.brush;
  }));
  el.brushSize.addEventListener("input", () => { el.brushSizeOut.textContent = el.brushSize.value; sizeCursor(); });
  function sizeCursor() { const s = Number(el.brushSize.value); el.cursor.style.width = el.cursor.style.height = s + "px"; }
  sizeCursor();

  /* brush painting (refine mode always shows the whole photo, so coordinates map 1:1) */
  let active = null;
  function toImg(e) {
    const r = el.after.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * S.W, (e.clientY - r.top) / r.height * S.H];
  }
  function moveCursor(e) {
    const r = el.stage.getBoundingClientRect();
    el.cursor.style.transform = "translate(" + (e.clientX - r.left) + "px," + (e.clientY - r.top) + "px) translate(-50%,-50%)";
  }
  el.stage.addEventListener("pointerdown", (e) => {
    if (S.mode !== "refine" || !S.ready) return;
    e.preventDefault();
    el.stage.setPointerCapture(e.pointerId);
    const r = el.after.getBoundingClientRect();
    active = { mode: S.brush, size: Number(el.brushSize.value) * S.W / r.width, points: [toImg(e)] };
    S.strokes.push(active); S.bboxDirty = true;
    drawStroke(S.previewMask.getContext("2d"), active, S.pw / S.W, 0);
    render(); updateEditButtons();
  });
  el.stage.addEventListener("pointermove", (e) => {
    if (S.mode !== "refine") return;
    el.cursor.hidden = false; moveCursor(e);
    if (!active) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    const from = active.points.length;
    for (const ce of (evs.length ? evs : [e])) active.points.push(toImg(ce));
    drawStroke(S.previewMask.getContext("2d"), active, S.pw / S.W, from);
    render();
  });
  const end = () => { active = null; S.bboxDirty = true; };
  el.stage.addEventListener("pointerup", end);
  el.stage.addEventListener("pointercancel", end);
  el.stage.addEventListener("pointerleave", () => { el.cursor.hidden = true; });
  el.undo.addEventListener("click", () => { S.strokes.pop(); rebuildPreviewMask(false); render(); });
  el.resetEdits.addEventListener("click", () => { S.strokes = []; rebuildPreviewMask(false); render(); });
  function updateEditButtons() { el.undo.disabled = el.resetEdits.disabled = S.strokes.length === 0; }

  /* edge softness */
  let fTimer = 0;
  el.feather.addEventListener("input", () => {
    el.featherOut.textContent = el.feather.value;
    if (!S.ready) return;
    cancelAnimationFrame(fTimer);
    fTimer = requestAnimationFrame(() => { rebuildPreviewMask(true); render(); });
  });

  /* background options */
  function setBg(kind, color) {
    S.bg = kind;
    if (color) { S.color = color; el.bgColor.value = color; }
    const r = $("input[name=bg][value=" + kind + "]"); if (r) r.checked = true;
    el.colorRow.hidden = S.bg !== "color";
    el.blurRow.hidden = S.bg !== "blur";
    syncMarketBtn();
  }
  $$("input[name=bg]").forEach((r) => r.addEventListener("change", () => {
    setBg(r.value);
    if (S.bg === "image" && !S.bgImg) el.bgFile.click();
    render();
  }));
  // Clicking "Image…" again lets you pick a different background.
  $("input[name=bg][value=image]").addEventListener("click", () => { if (S.bgImg) el.bgFile.click(); });
  $$(".sw").forEach((b) => b.addEventListener("click", () => { setBg("color", b.dataset.c); render(); }));
  el.bgColor.addEventListener("input", () => { S.color = el.bgColor.value; syncMarketBtn(); render(); });
  el.blurAmt.addEventListener("input", () => { el.blurOut.textContent = el.blurAmt.value; render(); });
  el.bgFile.addEventListener("change", async () => {
    const f = el.bgFile.files[0]; el.bgFile.value = "";
    if (!f) return;
    try { S.bgImg = await loadImage(f); render(); } catch (e) { warn(e.message); }
  });

  /* framing: original size or square with padding */
  function setSquare(on) {
    S.square = !!on;
    $$("[data-frame]").forEach((x) => { const sel = (x.dataset.frame === "square") === S.square; x.classList.toggle("is-on", sel); x.setAttribute("aria-pressed", sel); });
    el.fillRow.hidden = !S.square;
    syncMarketBtn();
  }
  function setFill(pct) {
    const v = Math.max(50, Math.min(100, Math.round(Number(pct) || 85)));
    S.fill = v / 100; el.fill.value = v; el.fillOut.textContent = v + "%";
    syncMarketBtn();
  }
  $$("[data-frame]").forEach((b) => b.addEventListener("click", () => { setSquare(b.dataset.frame === "square"); render(); }));
  el.fill.addEventListener("input", () => { setFill(el.fill.value); render(); });

  /* cut-out method */
  async function setMethod(m) {
    S.method = m === "plain" ? "plain" : "ai";
    $$("[data-method]").forEach((x) => { const sel = x.dataset.method === S.method; x.classList.toggle("is-on", sel); x.setAttribute("aria-pressed", sel); });
    if (!S.ready || S.busy) return;
    S.busy = true;
    try {
      await ensureSegmented();
      hideStatus();
      rebuildPreviewMask(true); render();
    } catch (e) { console.error(e); hideStatus(); warn("Couldn't run the AI model: " + ((e && e.message) || "unknown error")); }
    finally { S.busy = false; }
  }
  $$("[data-method]").forEach((b) => b.addEventListener("click", () => setMethod(b.dataset.method)));

  /* "Marketplace photo" = white background + square + 85% fill */
  function isMarket() { return S.square && S.bg === "color" && S.color.toLowerCase() === "#ffffff"; }
  function syncMarketBtn() {
    if (!el.marketBtn) return;
    const on = isMarket();
    el.marketBtn.classList.toggle("is-on", on); el.marketBtn.setAttribute("aria-pressed", on);
    $$("[data-preset]").forEach((b) => {
      const p = b.dataset.preset, sel = p === "marketplace" ? on : S.method === "plain" && S.bg === "transparent";
      b.classList.toggle("is-on", sel); b.setAttribute("aria-pressed", sel);
    });
    describePreset();
  }
  function applyMarket(on) {
    if (on) { setBg("color", "#ffffff"); setFill(85); setSquare(true); }
    else { setSquare(false); setBg("transparent"); }
  }
  el.marketBtn.addEventListener("click", () => { applyMarket(!isMarket()); render(); });

  /* presets row above the drop zone */
  function describePreset() {
    const bits = [];
    if (S.method === "plain") bits.push("plain-background method (logos, signatures)");
    if (S.bg === "color") bits.push((S.color.toLowerCase() === "#ffffff" ? "white" : S.color) + " background");
    else if (S.bg !== "transparent") bits.push(S.bg + " background");
    else bits.push("transparent background");
    if (S.square) bits.push("square, subject fills " + Math.round(S.fill * 100) + "%");
    const custom = S.method === "plain" || S.square || S.bg !== "transparent";
    el.presetNote.hidden = !custom;
    el.presetNote.textContent = custom ? "Preset: " + bits.join(" · ") + ". You can change it after adding a photo." : "";
  }
  $$("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    const p = b.dataset.preset, wasOn = b.getAttribute("aria-pressed") === "true";
    if (p === "marketplace") { setMethod("ai"); applyMarket(!wasOn); }
    else if (wasOn) { setMethod("ai"); setBg("transparent"); }
    else { setMethod("plain"); setSquare(false); setBg("transparent"); }
    syncMarketBtn();
  }));

  function applyURLPreset() {
    let q; try { q = new URLSearchParams(location.search); } catch (_) { return; }
    const P = {}, preset = (q.get("preset") || "").toLowerCase();
    if (preset === "marketplace") Object.assign(P, { bg: "white", format: "square", fill: "85" });
    if (preset === "logo" || preset === "signature") Object.assign(P, { bg: "transparent", method: "plain" });
    for (const k of ["bg", "format", "fill", "method"]) { const v = q.get(k); if (v) P[k] = v.toLowerCase(); }
    if (P.method) setMethod(P.method);
    if (P.fill) setFill(P.fill);
    if (P.format) setSquare(P.format === "square");
    if (P.bg) {
      const b = P.bg.replace(/^#/, "");
      if (b === "white") setBg("color", "#ffffff");
      else if (b === "black") setBg("color", "#000000");
      else if (b === "transparent" || b === "blur") setBg(b);
      else if (/^[0-9a-f]{6}$/.test(b)) setBg("color", "#" + b);
    }
    syncMarketBtn();
  }

  el.dlPng.addEventListener("click", () => download("image/png"));
  el.dlJpg.addEventListener("click", () => download("image/jpeg"));

  /* theme */
  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (_) {}
  });

  /* config-driven bits */
  $$("[data-name]").forEach((n) => { n.textContent = C.PRODUCT_NAME; });
  if (C.ANALYTICS_SNIPPET) {
    try { document.head.appendChild(document.createRange().createContextualFragment(C.ANALYTICS_SNIPPET)); } catch (_) {}
  }
  const pay = $("#payLink");
  if (C.PAYMENT_LINK) { pay.href = C.PAYMENT_LINK; pay.hidden = false; pay.rel = "noopener"; }
  $("#signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#email").value.trim(), msg = $("#signupMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Please enter a valid email."; return; }
    if (!C.SIGNUP_ENDPOINT) { msg.textContent = "Thanks! We'll let you know when batch is ready."; e.target.reset(); return; }
    msg.textContent = "Sending…";
    try {
      const r = await fetch(C.SIGNUP_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "batch-waitlist" }) });
      msg.textContent = r.ok ? "Thanks! We'll let you know when batch is ready." : "Couldn't sign you up right now. Please try again later.";
      if (r.ok) e.target.reset();
    } catch (_) { msg.textContent = "Couldn't sign you up right now. Please try again later."; }
  });

  applyURLPreset();

  /* installable app: service worker (scoped to this folder) */
  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js", { scope: "./" }).catch((e) => console.warn("Service worker not registered:", e && e.message));
    });
  }

  // Small hook for automated tests and debugging.
  window.__bgapp = { state: S, exportBlob, setSquare, setFill, setBg, setMethod };
})();
