/* Batch mode + Batch Pro unlock + upsell.
   - Reuses the single-image pipeline via window.PeeloCore.cutoutImage (one shared model session).
   - Photos are processed one at a time; each result is streamed into a ZIP (fflate, MIT) right away,
     so only the ZIP and small thumbnails stay in memory.
   - Free: CONFIG.FREE_BATCH_LIMIT photos per batch. Pro: CONFIG.BATCH_MAX_FILES per run.
   - Pro unlock is a SOFT LOCK for an early test: Stripe redirects to ?pro=<PRO_UNLOCK_TOKEN>#batch and
     we remember it in localStorage. Anyone reading config.js can find the token. */
(function () {
  "use strict";
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const FREE = Number(C.FREE_BATCH_LIMIT) || 3;
  const MAX = Number(C.BATCH_MAX_FILES) || 200;
  const PRICE = C.PRO_PRICE || "$19";
  const PRO_KEY = "peelo-pro";
  const BIG_TOTAL = 1024 * 1024 * 1024; // warn above 1 GB of input

  /* ---------- analytics (GoatCounter, if it loaded) ---------- */
  // count.js loads async, so events fired during page load (pro-unlocked) wait for it briefly.
  const pending = [];
  let flushTries = 0;
  function gcReady() { return window.goatcounter && typeof window.goatcounter.count === "function"; }
  function flush() {
    if (gcReady()) {
      while (pending.length) { try { window.goatcounter.count(pending.shift()); } catch (_) {} }
    } else if (pending.length && flushTries++ < 40) setTimeout(flush, 500);
  }
  function track(name, title) {
    pending.push({ path: "event-" + name, title: title || name, event: true });
    flush();
  }

  /* ---------- Pro state ---------- */
  function isPro() {
    try { return !!C.PRO_UNLOCK_TOKEN && localStorage.getItem(PRO_KEY) === C.PRO_UNLOCK_TOKEN; } catch (_) { return false; }
  }
  let proSession = false; // if localStorage is blocked, keep the unlock for this page view
  const pro = () => proSession || isPro();
  const buyURL = () => (C.STRIPE_PAYMENT_LINK || "").trim();
  const unlockURL = () => location.origin + location.pathname + "?pro=" + encodeURIComponent(C.PRO_UNLOCK_TOKEN) + "#batch";

  const banner = $("#proBanner");
  function showBanner(html) { banner.innerHTML = html; banner.hidden = false; }

  function handleProParam() {
    let q; try { q = new URLSearchParams(location.search); } catch (_) { return; }
    if (!q.has("pro")) return;
    const ok = !!C.PRO_UNLOCK_TOKEN && q.get("pro") === C.PRO_UNLOCK_TOKEN;
    q.delete("pro");
    const qs = q.toString();
    try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + (location.hash || "#batch")); } catch (_) {}
    if (ok) {
      const already = isPro();
      try { localStorage.setItem(PRO_KEY, C.PRO_UNLOCK_TOKEN); } catch (_) {}
      proSession = true;
      if (!already) track("pro-unlocked", "Batch Pro unlocked");
      showBanner("<strong>Thank you! Batch Pro is unlocked in this browser.</strong> " +
        "Batch up to " + MAX + " photos per run. To unlock another browser or device, open this link there " +
        "(bookmark it): <button type=\"button\" class=\"linkish\" id=\"copyUnlock\">copy unlock link</button>" +
        " <button type=\"button\" class=\"icon-btn banner-x\" id=\"bannerX\" aria-label=\"Dismiss\">✕</button>");
      $("#copyUnlock").addEventListener("click", async (e) => {
        try { await navigator.clipboard.writeText(unlockURL()); e.target.textContent = "copied"; }
        catch (_) { e.target.textContent = unlockURL(); }
      });
      $("#bannerX").addEventListener("click", () => { banner.hidden = true; });
    } else {
      showBanner("That unlock link didn't match. " + contactHTML() + " and we'll sort it out.");
    }
  }
  function contactHTML() {
    const e = (C.CONTACT_EMAIL || "").trim();
    return e ? "Email <a href=\"mailto:" + e + "\">" + e + "</a>" : "Reply to your Stripe receipt email";
  }

  /* ---------- tabs ---------- */
  const tabs = $$(".tab-btn"), panel = $("#batch");
  let batchOpened = false;
  function setTab(t, scroll) {
    document.body.dataset.tab = t;
    tabs.forEach((b) => { const on = b.dataset.tab === t; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on); });
    panel.hidden = t !== "batch";
    if (t === "batch" && !batchOpened) { batchOpened = true; track("batch-open", "Batch opened"); }
    if (t === "batch") hideUpsell(false);
    if (scroll) $("#tool").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  tabs.forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab, false)));
  function hashRoute() { if (location.hash === "#batch") setTab("batch", true); }
  window.addEventListener("hashchange", hashRoute);
  // Links to #batch (nav, pricing): switch tab even when the hash is already #batch.
  $$('a[href="#batch"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); try { history.replaceState(null, "", "#batch"); } catch (_) {} setTab("batch", true); }));
  $$('a[href="#tool"]').forEach((a) => a.addEventListener("click", () => setTab("single", false)));

  /* ---------- pricing / buy buttons ---------- */
  function wireBuy(a) {
    if (!a) return;
    a.href = buyURL(); a.hidden = false;
    a.addEventListener("click", () => track("upgrade-click", "Upgrade clicked (" + a.id + ")"));
  }
  function setupPricing() {
    $$("[data-price]").forEach((n) => { n.textContent = PRICE; });
    const cl = $("#bContact"); if (cl) cl.innerHTML = contactHTML();
    $$(".contact-line").forEach((n) => {
      const e = (C.CONTACT_EMAIL || "").trim();
      n.innerHTML = e ? "email <a href=\"mailto:" + e + "\">" + e + "</a>" : "reply to your Stripe receipt email";
    });
    if (buyURL()) { wireBuy($("#bBuy")); wireBuy($("#priceBuy")); }
    else {
      $("#bSoon").hidden = false; $("#priceSoon").hidden = false;
      // Only offer the waitlist if it actually goes somewhere.
      if (C.SIGNUP_ENDPOINT) $("#signup").hidden = false;
    }
    if (pro()) {
      $("#priceTry").textContent = "Open batch (Pro unlocked)";
      $("#priceBuy").hidden = true; $("#priceSoon").hidden = true;
    }
  }

  /* ---------- upsell after the 3rd single cutout ---------- */
  const upsell = $("#upsell");
  let singles = 0;
  function upsellDismissed() { try { return sessionStorage.getItem("peelo-upsell-x") === "1"; } catch (_) { return false; } }
  document.addEventListener("peelo:cutout", () => {
    singles++;
    if (singles === 3 && !pro() && !upsellDismissed()) { upsell.hidden = false; track("upsell-shown", "Upsell shown after 3rd cutout"); }
  });
  function hideUpsell(remember) {
    upsell.hidden = true;
    if (remember) { try { sessionStorage.setItem("peelo-upsell-x", "1"); } catch (_) {} }
  }
  $("#upsellClose").addEventListener("click", () => hideUpsell(true));
  $("#upsellTry").addEventListener("click", () => { hideUpsell(true); setTab("batch", true); });

  /* ---------- batch settings ---------- */
  const B = { method: "ai", bg: "transparent", color: "#f2efe9", square: false, fill: 0.85, fmt: "png", maxSide: 0 };
  function segGroup(attr, key, after) {
    $$("[" + attr + "]").forEach((b) => b.addEventListener("click", () => {
      B[key] = b.getAttribute(attr);
      $$("[" + attr + "]").forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); });
      after && after();
    }));
  }
  segGroup("data-bmethod", "method");
  segGroup("data-bfmt", "fmt", syncHints);
  $$("input[name=bbg]").forEach((r) => r.addEventListener("change", () => { B.bg = r.value; syncHints(); }));
  $("#bColor").addEventListener("input", (e) => { B.color = e.target.value; });
  $("#bSquare").addEventListener("change", (e) => { B.square = e.target.checked; $("#bFillRow").hidden = !B.square; });
  $("#bFill").addEventListener("input", (e) => { B.fill = Number(e.target.value) / 100; $("#bFillOut").textContent = e.target.value + "%"; });
  $("#bMax").addEventListener("change", (e) => { B.maxSide = Number(e.target.value) || 0; });
  function syncHints() {
    $("#bColorRow").hidden = B.bg !== "color";
    $("#bFmtHint").hidden = !(B.fmt === "jpg" && B.bg === "transparent");
  }
  function settingsFor() {
    const bg = B.bg === "white" ? "color" : B.bg;
    return {
      method: B.method, bg, color: B.bg === "white" ? "#ffffff" : B.color, square: B.square, fill: B.fill,
      type: B.fmt === "jpg" ? "image/jpeg" : "image/png", maxSide: B.maxSide, feather: 0.35, blur: 20,
    };
  }

  /* ---------- queue ---------- */
  let queue = []; // {file, name, status: queued|working|done|failed|skipped, reason, li}
  let running = false, paused = false, cancelled = false, zipBlob = null, zipURL = null;
  const list = $("#bList"), input = $("#bInput"), drop = $("#bDrop");

  function fmtMB(n) { return n >= 1073741824 ? (n / 1073741824).toFixed(1) + " GB" : (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + " MB"; }
  function bwarn(msg) { const w = $("#bWarn"); w.hidden = !msg; w.textContent = msg || ""; }
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function addFiles(files) {
    if (running) return;
    resetResult();
    const imgs = Array.from(files || []).filter((f) => !f.type || /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
    const skipped = (files ? files.length : 0) - imgs.length;
    const room = MAX - queue.length;
    const take = imgs.slice(0, Math.max(0, room));
    take.forEach((file) => {
      const li = document.createElement("li");
      li.className = "file is-queued";
      li.innerHTML = "<span class=\"thumb\"></span><span class=\"fname\">" + esc(file.name || "image") +
        "</span><span class=\"fstat\">Waiting</span>";
      list.appendChild(li);
      queue.push({ file, name: file.name || "image", status: "queued", reason: "", li });
    });
    const msgs = [];
    if (imgs.length > take.length) msgs.push("Only " + MAX + " photos per run. The first " + MAX + " were added; run the rest as another batch.");
    if (skipped > 0) msgs.push(skipped + " file" + (skipped > 1 ? "s weren't images and were" : " wasn't an image and was") + " skipped.");
    const total = queue.reduce((a, q) => a + q.file.size, 0);
    if (total > BIG_TOTAL) msgs.push("That's " + fmtMB(total) + " of photos. It will work but can take a while and use a lot of memory; keep this tab open and in front. Choosing a smaller Max size helps.");
    bwarn(msgs.join(" "));
    refresh();
  }

  function resetResult() {
    if (zipURL) URL.revokeObjectURL(zipURL);
    zipBlob = null; zipURL = null;
    $("#bZip").hidden = true;
    // A finished run's list is replaced by the next selection.
    if (queue.length && queue.every((q) => q.status !== "queued")) clearQueue();
  }
  function clearQueue() {
    queue.forEach((q) => { const c = q.li.querySelector("canvas"); if (c) { c.width = c.height = 0; } });
    queue = []; list.innerHTML = ""; $("#bProgress").hidden = true;
  }

  function refresh() {
    const n = queue.length, total = queue.reduce((a, q) => a + q.file.size, 0);
    $("#bQueueBar").hidden = n === 0;
    drop.classList.toggle("compact", n > 0);
    $("#bCount").textContent = n ? n + " photo" + (n > 1 ? "s" : "") + " · " + fmtMB(total) : "";
    const gated = !pro() && n > FREE;
    const gate = $("#bGate");
    gate.hidden = !gated || running;
    if (gated && !running) {
      $("#bGateTitle").textContent = "You added " + n + " photos. Free batches do " + FREE + " at a time.";
      $("#bFreeRun").textContent = "Process the first " + FREE + " free";
    }
    $("#bFreeRun").hidden = !queue.some((q) => q.status === "queued");
    $("#bRun").disabled = running || n === 0 || !queue.some((q) => q.status === "queued");
    const doing = Math.min(n, pro() ? MAX : FREE);
    $("#bRun").textContent = n === 0 ? "Remove backgrounds" : gated ? "Process the first " + FREE + " free" : "Remove backgrounds (" + doing + ")";
    $("#bPlan").textContent = pro() ? "Batch Pro: up to " + MAX + " photos per run." : "Free: up to " + FREE + " photos per batch.";
    $("#bLimitNote").textContent = pro() ? "Batch Pro: up to " + MAX + " photos per run." : "Up to " + MAX + " per run with Batch Pro. Free: " + FREE + " photos per batch.";
  }

  drop.addEventListener("click", () => input.click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  input.addEventListener("change", () => { addFiles(input.files); input.value = ""; });
  $("#bAdd").addEventListener("click", () => input.click());
  $("#bClear").addEventListener("click", () => { if (running) return; resetResult(); clearQueue(); bwarn(""); refresh(); });
  document.addEventListener("drop", (e) => {
    if (document.body.dataset.tab !== "batch") return;
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
  window.addEventListener("paste", (e) => {
    if (document.body.dataset.tab !== "batch") return;
    const fs = [];
    for (const it of (e.clipboardData && e.clipboardData.items) || []) if (it.kind === "file" && it.type.startsWith("image/")) fs.push(it.getAsFile());
    if (fs.length) { e.preventDefault(); addFiles(fs); }
  });

  /* ---------- running ---------- */
  function setRow(q, status, text) {
    q.status = status;
    q.li.className = "file is-" + status;
    q.li.querySelector(".fstat").textContent = text;
  }
  function progress(done, total, text) {
    $("#bProgress").hidden = false;
    $("#bProgText").textContent = text;
    $("#bProgBar").style.width = Math.round((done / Math.max(1, total)) * 100) + "%";
  }
  function eta(ms) {
    const s = Math.max(1, Math.round(ms / 1000));
    return s < 60 ? "about " + s + " s left" : "about " + Math.floor(s / 60) + " min " + (s % 60) + " s left";
  }
  function outName(name, used) {
    const base = (name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "-").trim() || "image").slice(0, 100);
    const ext = B.fmt === "jpg" ? "jpg" : "png";
    let n = base + (B.square ? "-square" : "-no-bg") + "." + ext, i = 2;
    while (used.has(n.toLowerCase())) n = base + (B.square ? "-square" : "-no-bg") + "-" + (i++) + "." + ext;
    used.add(n.toLowerCase());
    return n;
  }
  const tick = () => new Promise((r) => setTimeout(r, 0));
  function waitWhilePaused() {
    return new Promise((res) => { const t = () => (paused && !cancelled ? setTimeout(t, 120) : res()); t(); });
  }

  async function run(limit) {
    if (running) return;
    const todo = queue.filter((q) => q.status === "queued").slice(0, limit);
    if (!todo.length) return;
    queue.filter((q) => q.status === "queued" && !todo.includes(q)).forEach((q) => setRow(q, "skipped", "Not in this free batch"));
    running = true; paused = false; cancelled = false;
    track(pro() ? "batch-run-pro" : "batch-run-free", "Batch run (" + (pro() ? "pro" : "free") + ", " + todo.length + ")");
    $("#bGate").hidden = true; $("#bRunCtl").hidden = false; $("#bPause").textContent = "Pause";
    $("#bRun").disabled = true; $("#bAdd").disabled = $("#bClear").disabled = true;
    resetZip();
    const s = settingsFor(), used = new Set();
    const parts = [];
    const zip = new fflate.Zip((err, chunk, final) => { if (err) console.error(err); else if (chunk && chunk.length) parts.push(chunk); });
    let done = 0, ok = 0, failed = 0;
    const t0 = performance.now();
    let workMs = 0;

    try {
      if (s.method === "ai") {
        progress(0, todo.length, window.Segmenter.isStub() ? "Test mode: stub mask…" : "Loading AI model…");
        await window.Segmenter.load((f, cached) => {
          progress(0, todo.length, cached ? "Loading AI model from cache…" : "Downloading AI model (one time)… " + Math.round(f * 100) + "%");
        });
      }
    } catch (e) {
      console.error(e);
      progress(0, 1, "Couldn't load the AI model: " + ((e && e.message) || "unknown error") + ". Try reloading, or use the Plain background method.");
      finish(); return;
    }

    for (const q of todo) {
      if (paused) { progress(done, todo.length, "Paused · " + done + " of " + todo.length + " done"); await waitWhilePaused(); }
      if (cancelled) break;
      setRow(q, "working", "Working…");
      const left = todo.length - done;
      progress(done, todo.length, "Photo " + (done + 1) + " of " + todo.length + (done ? " · " + eta((workMs / done) * left) : ""));
      await tick();
      const ts = performance.now();
      let img = null;
      try {
        img = await window.PeeloCore.loadImage(q.file);
        const r = await window.PeeloCore.cutoutImage(img, s);
        const buf = new Uint8Array(await r.blob.arrayBuffer());
        const name = outName(q.name, used);
        const entry = new fflate.ZipPassThrough(name);
        entry.mtime = Date.now();
        zip.add(entry); entry.push(buf, true);
        r.thumb.className = "thumb-c";
        const th = q.li.querySelector(".thumb"); th.innerHTML = ""; th.appendChild(r.thumb);
        setRow(q, "done", r.w + " × " + r.h);
        q.out = name; ok++;
      } catch (e) {
        console.warn("Batch: " + q.name + ": " + ((e && e.message) || e));
        const reason = /couldn't be opened/i.test((e && e.message) || "") ? "Couldn't open this file (damaged or not a supported image)" : ((e && e.message) || "Unknown error");
        setRow(q, "failed", "Failed: " + reason); q.reason = reason; failed++;
      } finally {
        if (img && img.src && img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
        if (img) { img.src = ""; img = null; }
      }
      done++; workMs = performance.now() - t0;
      progress(done, todo.length, done + " of " + todo.length + " done" + (done < todo.length ? " · " + eta((workMs / done) * (todo.length - done)) : ""));
      await tick();
    }
    todo.filter((q) => q.status === "queued").forEach((q) => setRow(q, "skipped", "Cancelled"));
    zip.end();
    if (ok) {
      zipBlob = new Blob(parts, { type: "application/zip" });
      zipURL = URL.createObjectURL(zipBlob);
      const a = $("#bZip");
      a.href = zipURL; a.download = "peelo-batch-" + new Date().toISOString().slice(0, 10) + ".zip";
      a.textContent = "Download ZIP (" + ok + " photo" + (ok > 1 ? "s" : "") + ", " + fmtMB(zipBlob.size) + ")";
      a.hidden = false;
    }
    parts.length = 0;
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    progress(1, 1, (cancelled ? "Cancelled. " : "Done. ") + ok + " ready" + (failed ? ", " + failed + " failed (see list)" : "") + " · " + secs + " s · nothing uploaded");
    finish();
  }
  function resetZip() { if (zipURL) URL.revokeObjectURL(zipURL); zipURL = null; zipBlob = null; $("#bZip").hidden = true; }
  function finish() {
    running = false; paused = false;
    $("#bRunCtl").hidden = true; $("#bAdd").disabled = $("#bClear").disabled = false;
    refresh();
  }

  $("#bRun").addEventListener("click", () => run(pro() ? MAX : FREE));
  $("#bFreeRun").addEventListener("click", () => run(FREE));
  $("#bPause").addEventListener("click", () => {
    paused = !paused;
    $("#bPause").textContent = paused ? "Resume" : "Pause";
    if (paused) $("#bProgText").textContent = "Pausing after the current photo…";
  });
  $("#bCancel").addEventListener("click", () => {
    cancelled = true; paused = false;
    $("#bProgText").textContent = "Cancelling after the current photo…";
  });
  window.addEventListener("beforeunload", (e) => { if (running) { e.preventDefault(); e.returnValue = ""; } });

  /* ---------- init ---------- */
  handleProParam();
  setupPricing();
  syncHints();
  refresh();
  if (location.hash === "#batch") setTab("batch", false); else document.body.dataset.tab = "single";

  window.__batch = { state: () => ({ queue: queue.map((q) => ({ name: q.name, status: q.status, reason: q.reason, out: q.out })), running, pro: pro(), zip: zipBlob }), getZip: () => zipBlob, isPro: pro, addFiles };
})();
