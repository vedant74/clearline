/* UI + image pipeline. Model runs at 320x320; the mask is upscaled and applied to the
   original-resolution image only when exporting, so downloads are full resolution. */
(function () {
  "use strict";
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const PREVIEW_MAX = 1400;

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
  };

  const S = {
    img: null, name: "image", W: 0, H: 0, pw: 0, ph: 0,
    low: null, previewImg: null, previewMask: null, previewBaseMask: null,
    strokes: [], mode: "compare", brush: "erase",
    bg: "transparent", color: "#ffffff", bgImg: null, ready: false, busy: false, ms: 0,
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

  /* ---------- mask building ---------- */
  // Upscale the low-res probability map to w x h and apply an edge curve controlled by "Edge softness".
  function buildMask(w, h) {
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
    // Edge curve: smoothstep around 0.5 with width set by the softness slider.
    const f = Number(el.feather.value) / 100;
    const width = 0.06 + f * 0.7, lo = 0.5 - width / 2;
    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) {
      let t = (v / 255 - lo) / width; t = t < 0 ? 0 : t > 1 ? 1 : t;
      lut[v] = Math.round(t * t * (3 - 2 * t) * 255);
    }
    const md = ox.getImageData(0, 0, w, h), d = md.data;
    for (let p = 3; p < d.length; p += 4) d[p] = lut[d[p]];
    ox.putImageData(md, 0, 0);
    return out;
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
    if (rebuildBase || !S.previewBaseMask) { free(S.previewBaseMask); S.previewBaseMask = buildMask(S.pw, S.ph); }
    const x = S.previewMask.getContext("2d");
    x.globalCompositeOperation = "copy"; x.drawImage(S.previewBaseMask, 0, 0);
    x.globalCompositeOperation = "source-over";
    const sc = S.pw / S.W;
    for (const st of S.strokes) drawStroke(x, st, sc, 0);
    updateEditButtons();
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
  // Paint background (if any) into ctx, then the cutout. `work` is a scratch canvas w x h holding the mask.
  function compose(ctx, w, h, src, maskC, forceOpaque) {
    // cutout = mask, then image "source-in" -> image pixels with mask alpha
    const work = canvas(w, h), wx = work.getContext("2d");
    wx.drawImage(maskC, 0, 0, w, h);
    wx.globalCompositeOperation = "source-in";
    wx.imageSmoothingQuality = "high";
    wx.drawImage(src, 0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    const bg = S.bg;
    if (bg === "color" || (forceOpaque && bg === "transparent") || (bg === "image" && !S.bgImg)) {
      ctx.fillStyle = bg === "color" ? S.color : "#ffffff"; ctx.fillRect(0, 0, w, h);
    } else if (bg === "blur") {
      drawBlurred(ctx, src, w, h);
    } else if (bg === "image" && S.bgImg) {
      drawCover(ctx, S.bgImg, w, h);
    }
    ctx.drawImage(work, 0, 0);
    free(work);
  }

  function render() {
    if (!S.ready) return;
    compose(el.after.getContext("2d"), S.pw, S.ph, S.previewImg, S.previewMask, false);
  }

  /* ---------- export at full resolution ---------- */
  async function exportBlob(type) {
    const W = S.W, H = S.H;
    const mask = buildMask(W, H), mx = mask.getContext("2d");
    for (const st of S.strokes) drawStroke(mx, st, 1, 0);
    const out = canvas(W, H);
    compose(out.getContext("2d"), W, H, S.img, mask, type === "image/jpeg");
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
      a.download = S.name + "-no-bg." + (type === "image/png" ? "png" : "jpg");
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
    window.Segmenter.load((f, cached) => {
      if (modelProgressText) setStatus(cached ? "Loading AI model from cache…" : "Downloading AI model (one time)… " + Math.round(f * 100) + "%", cached ? null : f);
    }).catch(() => {});
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
      S.img = img;
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
      for (const c of [el.after, el.before]) { c.width = S.pw; c.height = S.ph; }
      el.before.getContext("2d").drawImage(S.previewImg, 0, 0);
      el.after.getContext("2d").clearRect(0, 0, S.pw, S.ph);
      el.stage.style.setProperty("--ar", (S.pw / S.ph).toFixed(5));
      warn(warnings.join(" "));

      modelProgressText = true;
      setStatus(window.Segmenter.isStub() ? "Test mode: using stub mask…" : "Loading AI model…", null);
      prewarm();
      await window.Segmenter.load();
      setStatus("Removing background on your device…", null);
      await new Promise((r) => setTimeout(r, 20));
      const t0 = performance.now();
      S.low = await window.Segmenter.predict(img, img.naturalWidth, img.naturalHeight);
      S.strokes = []; S.redo = [];
      rebuildPreviewMask(true);
      S.ms = performance.now() - t0;
      S.ready = true;
      render();
      hideStatus();
      el.dlPng.disabled = el.dlJpg.disabled = false;
      el.meta.textContent = S.W + " × " + S.H + " px · done in " + (S.ms / 1000).toFixed(1) + " s · nothing uploaded" + (window.Segmenter.isStub() ? " · STUB MASK (test mode)" : "");
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
  }));
  $$("[data-brush]").forEach((b) => b.addEventListener("click", () => {
    S.brush = b.dataset.brush;
    $$("[data-brush]").forEach((x) => x.classList.toggle("is-on", x === b));
    el.cursor.dataset.brush = S.brush;
  }));
  el.brushSize.addEventListener("input", () => { el.brushSizeOut.textContent = el.brushSize.value; sizeCursor(); });
  function sizeCursor() { const s = Number(el.brushSize.value); el.cursor.style.width = el.cursor.style.height = s + "px"; }
  sizeCursor();

  /* brush painting */
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
    S.strokes.push(active);
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
  const end = () => { active = null; };
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
  $$("input[name=bg]").forEach((r) => r.addEventListener("change", () => {
    S.bg = r.value;
    el.colorRow.hidden = S.bg !== "color";
    el.blurRow.hidden = S.bg !== "blur";
    if (S.bg === "image" && !S.bgImg) el.bgFile.click();
    render();
  }));
  // Clicking "Image…" again lets you pick a different background.
  $("input[name=bg][value=image]").addEventListener("click", () => { if (S.bgImg) el.bgFile.click(); });
  $$(".sw").forEach((b) => b.addEventListener("click", () => { S.color = b.dataset.c; el.bgColor.value = b.dataset.c; render(); }));
  el.bgColor.addEventListener("input", () => { S.color = el.bgColor.value; render(); });
  el.blurAmt.addEventListener("input", () => { el.blurOut.textContent = el.blurAmt.value; render(); });
  el.bgFile.addEventListener("change", async () => {
    const f = el.bgFile.files[0]; el.bgFile.value = "";
    if (!f) return;
    try { S.bgImg = await loadImage(f); render(); } catch (e) { warn(e.message); }
  });

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

  // Small hook for automated tests and debugging.
  window.__bgapp = { state: S, exportBlob };
})();
