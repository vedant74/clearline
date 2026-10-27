/* Segmentation engine: runs a background-removal model with onnxruntime-web and returns a low-res mask.
   Two models:
     hq   - IS-Net general use (Apache-2.0), 1024 px, ~91 MB one-time download. Default.
     fast - U^2-Net small (Apache-2.0), 320 px, 4.6 MB. Used on low-memory devices, with ?model=fast,
            or automatically if the hq model fails to load or run.
   After the model, a "main subject" cleanup drops text and stray blobs in the background
   (both models treat bold text as a subject). The raw mask is kept so the UI can turn cleanup off.
   Everything runs locally; the only network requests are for model/runtime files on this same site. */
(function () {
  "use strict";
  const C = window.CONFIG;

  const MODELS = C.MODELS || {
    hq: { parts: ["models/isnet/isnet-w16.onnx.part0", "models/isnet/isnet-w16.onnx.part1"], size: 1024,
          mean: [0.5, 0.5, 0.5], std: [1, 1, 1], cache: "bg-model-isnet-w16-v2", label: "high quality", mb: 91 },
    fast: { parts: [C.MODEL_URL || "models/u2netp.onnx"], size: C.MODEL_INPUT_SIZE || 320,
            mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225], cache: C.MODEL_CACHE_NAME || "bg-model-u2netp-v1",
            label: "fast", mb: 5 },
  };

  let sessionPromise = null;
  let active = null; // key of the model the session was built from
  let provider = null; // "webgpu" or "wasm"

  function param(k) { try { return new URLSearchParams(location.search).get(k); } catch (_) { return null; } }
  function useStub() { return param("stub") === "1" || !!C.USE_STUB_MODEL; }

  function pickModel() {
    const q = (param("model") || "").toLowerCase();
    if (q === "fast" || q === "hq") return q;
    try {
      const v = localStorage.getItem("peelo-model");
      if (v === "fast" || v === "hq") return v;
    } catch (_) {}
    // ~1 GB of working memory at 1024 px: stay on the small model for devices that report < 4 GB.
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return "fast";
    return "hq";
  }
  let wanted = pickModel();

  // Fetch one file with progress, using the Cache API so repeat visits are instant/offline.
  async function fetchPart(url, cache, onBytes) {
    if (cache) {
      try {
        const hit = await cache.match(url);
        if (hit) { const b = await hit.arrayBuffer(); onBytes(b.byteLength, true); return b; }
      } catch (_) {}
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Model download failed (HTTP " + res.status + ")");
    let buf;
    if (res.body) {
      const reader = res.body.getReader();
      const chunks = []; let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value); got += value.length; onBytes(value.length, false);
      }
      const out = new Uint8Array(got); let off = 0;
      for (const c of chunks) { out.set(c, off); off += c.length; }
      buf = out.buffer;
    } else {
      buf = await res.arrayBuffer(); onBytes(buf.byteLength, false);
    }
    if (cache) {
      try { await cache.put(url, new Response(buf.slice(0), { headers: { "content-type": "application/octet-stream" } })); } catch (_) {}
    }
    return buf;
  }

  async function fetchModel(m, onProgress) {
    let cache = null;
    try { cache = await caches.open(m.cache); } catch (_) {}
    const total = m.mb * 1e6; let got = 0; let allCached = true;
    const bufs = [];
    for (const p of m.parts) {
      const url = new URL(p, location.href).href;
      bufs.push(await fetchPart(url, cache, (n, cached) => {
        got += n; if (!cached) allCached = false;
        onProgress && onProgress(Math.min(0.99, got / total), allCached);
      }));
    }
    onProgress && onProgress(1, allCached);
    if (bufs.length === 1) return new Uint8Array(bufs[0]);
    const len = bufs.reduce((s, b) => s + b.byteLength, 0);
    const out = new Uint8Array(len); let off = 0;
    for (const b of bufs) { out.set(new Uint8Array(b), off); off += b.byteLength; }
    return out;
  }

  /* Runtime: the WebGPU build (runs on the graphics chip, several times faster) when the browser
     has a usable GPU adapter, otherwise the smaller CPU-only build. ?gpu=0 forces CPU. */
  let runtimePromise = null, gpuOK = false;
  function addScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = new URL(C.ORT_WASM_PATH + src, location.href).href;
      s.onload = res; s.onerror = () => rej(new Error("Runtime failed to load"));
      document.head.appendChild(s);
    });
  }
  function loadRuntime() {
    if (runtimePromise) return runtimePromise;
    runtimePromise = (async () => {
      if (window.ort) return;
      let adapter = null;
      if (param("gpu") !== "0" && navigator.gpu) {
        try { adapter = await navigator.gpu.requestAdapter(); } catch (_) {}
      }
      if (adapter) {
        try { await addScript("ort.webgpu.min.js"); gpuOK = true; return; } catch (_) {}
      }
      await addScript("ort.wasm.min.js");
    })();
    runtimePromise.catch(() => { runtimePromise = null; });
    return runtimePromise;
  }

  async function createSession(key, onProgress) {
    const [, bytes] = await Promise.all([loadRuntime(), fetchModel(MODELS[key], onProgress)]);
    if (!window.ort) throw new Error("Runtime failed to load");
    // Must be an absolute URL: the runtime dynamic-imports its .mjs loader from here.
    ort.env.wasm.wasmPaths = new URL(C.ORT_WASM_PATH, location.href).href;
    // Multi-threading needs cross-origin isolation, which GitHub Pages cannot provide.
    ort.env.wasm.numThreads = 1;
    let s = null;
    if (gpuOK) {
      try {
        s = await ort.InferenceSession.create(bytes, { executionProviders: ["webgpu"], graphOptimizationLevel: "all" });
        provider = "webgpu";
      } catch (e) { console.warn("[peelo] WebGPU unavailable, using CPU:", e); }
    }
    if (!s) {
      s = await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
      provider = "wasm";
    }
    active = key;
    return s;
  }

  function load(onProgress) {
    if (useStub()) return Promise.resolve("stub");
    if (sessionPromise && active === wanted) return sessionPromise;
    if (sessionPromise && active === null) return sessionPromise; // still loading
    sessionPromise = (async () => {
      try {
        return await createSession(wanted, onProgress);
      } catch (e) {
        if (wanted === "fast") throw e;
        console.warn("[peelo] high-quality model failed, using fast model:", e);
        wanted = "fast";
        return await createSession("fast", onProgress);
      }
    })();
    sessionPromise.catch(() => { sessionPromise = null; active = null; });
    return sessionPromise;
  }

  async function run(session, key, source, srcW, srcH) {
    const m = MODELS[key], size = m.size;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, srcW, srcH, 0, 0, size, size);
    const px = ctx.getImageData(0, 0, size, size).data;
    cv.width = cv.height = 0;
    const n = size * size;
    const input = new Float32Array(3 * n);
    let max = 1;
    for (let i = 0; i < n * 4; i += 4) {
      const v = Math.max(px[i], px[i + 1], px[i + 2]);
      if (v > max) max = v;
    }
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      input[i] = (px[p] / max - m.mean[0]) / m.std[0];
      input[n + i] = (px[p + 1] / max - m.mean[1]) / m.std[1];
      input[2 * n + i] = (px[p + 2] / max - m.mean[2]) / m.std[2];
    }
    const feeds = {};
    feeds[session.inputNames[0]] = new ort.Tensor("float32", input, [1, 3, size, size]);
    const results = await session.run(feeds);
    const out = results[session.outputNames[0]].data;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < n; i++) { if (out[i] < lo) lo = out[i]; if (out[i] > hi) hi = out[i]; }
    if (!isFinite(lo) || !isFinite(hi)) throw new Error("Model returned an invalid mask");
    const range = hi - lo || 1;
    const data = new Float32Array(n);
    for (let i = 0; i < n; i++) data[i] = (out[i] - lo) / range;
    return { data, size };
  }

  // Returns {data: cleaned Float32Array(size*size) 0..1, raw: model output, size, model}
  async function predict(source, srcW, srcH) {
    if (useStub()) { const s = stubMask(C.MODEL_INPUT_SIZE || 320); return { data: s.data, raw: s.data, size: s.size, model: "stub" }; }
    let session = await load();
    let r;
    try {
      r = await run(session, active, source, srcW, srcH);
    } catch (e) {
      if (provider === "webgpu") {
        console.warn("[peelo] WebGPU run failed, retrying on CPU:", e);
        gpuOK = false; sessionPromise = null; active = null;
        session = await load();
        r = await run(session, active, source, srcW, srcH);
        return { data: mainSubject(r.data, r.size), raw: r.data, size: r.size, model: active };
      }
      if (active === "fast") throw e;
      // Out of memory or similar on the big model: fall back for the rest of the visit.
      console.warn("[peelo] high-quality run failed, using fast model:", e);
      wanted = "fast"; sessionPromise = null; active = null;
      session = await load();
      r = await run(session, active, source, srcW, srcH);
    }
    return { data: mainSubject(r.data, r.size), raw: r.data, size: r.size, model: active };
  }

  /* ---- "main subject" cleanup ----
     Labels connected regions of the mask (> 0.5), keeps the largest, drops rows of similar-sized
     blobs (lines of text), keeps other big regions (a second car, a person next to a product) and
     small pieces touching a kept region (a detached hand). Soft edges near kept regions survive. */
  function mainSubject(m, N) {
    const n = N * N;
    const lab = new Int32Array(n);
    const stack = new Int32Array(n);
    const area = [0], y0 = [0], y1 = [0], x0 = [0], x1 = [0];
    let k = 0;
    for (let s = 0; s < n; s++) {
      if (lab[s] || m[s] <= 0.5) continue;
      k++; let top = 0; stack[top++] = s; lab[s] = k;
      let a = 0, ya = N, yb = 0, xa = N, xb = 0;
      while (top) {
        const p = stack[--top]; a++;
        const y = (p / N) | 0, x = p - y * N;
        if (y < ya) ya = y; if (y > yb) yb = y; if (x < xa) xa = x; if (x > xb) xb = x;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy; if (yy < 0 || yy >= N) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx; if (xx < 0 || xx >= N) continue;
            const q = yy * N + xx;
            if (!lab[q] && m[q] > 0.5) { lab[q] = k; stack[top++] = q; }
          }
        }
      }
      area.push(a); y0.push(ya); y1.push(yb + 1); x0.push(xa); x1.push(xb + 1);
    }
    if (k <= 1) return m;
    let L = 1;
    for (let i = 2; i <= k; i++) if (area[i] > area[L]) L = i;
    const keep = new Uint8Array(k + 1), text = new Uint8Array(k + 1);
    keep[L] = 1;
    const cand = [];
    for (let i = 1; i <= k; i++) if (i !== L && area[i] >= 4) cand.push(i);
    if (cand.length < 1500) {
      for (const i of cand) {
        const h = y1[i] - y0[i], cy = (y0[i] + y1[i]) / 2;
        let row = 0;
        for (const j of cand) {
          const hj = y1[j] - y0[j];
          if (Math.abs((y0[j] + y1[j]) / 2 - cy) < 0.3 * h && hj / h > 0.5 && hj / h < 2) { if (++row >= 3) break; }
        }
        if (row >= 3) text[i] = 1;
      }
    } else {
      for (const i of cand) text[i] = 1; // a page full of specks: treat all as background texture
    }
    for (let i = 1; i <= k; i++) if (i !== L && !text[i] && area[i] >= 0.08 * area[L]) keep[i] = 1;
    // Small pieces touching a kept region.
    let kept = new Uint8Array(n);
    for (let p = 0; p < n; p++) if (keep[lab[p]] && lab[p]) kept[p] = 1;
    const near = dilate(kept, N, Math.max(2, (N / 100) | 0));
    for (let p = 0; p < n; p++) {
      const i = lab[p];
      if (i && !keep[i] && !text[i] && near[p] && area[i] >= 0.002 * area[L]) keep[i] = 2;
    }
    for (let p = 0; p < n; p++) if (lab[p] && keep[lab[p]]) kept[p] = 1;
    const region = dilate(kept, N, Math.max(2, (N / 128) | 0));
    const out = new Float32Array(n);
    for (let p = 0; p < n; p++) out[p] = region[p] ? m[p] : 0;
    return out;
  }

  // Square dilation by radius r (separable running max over a 0/1 image).
  function dilate(src, N, r) {
    const tmp = new Uint8Array(N * N), out = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) {
      const row = y * N; let last = -1e9;
      for (let x = 0; x < N; x++) { if (src[row + x]) last = x; if (x - last <= r) tmp[row + x] = 1; }
      last = 1e9;
      for (let x = N - 1; x >= 0; x--) { if (src[row + x]) last = x; if (last - x <= r) tmp[row + x] = 1; }
    }
    for (let x = 0; x < N; x++) {
      let last = -1e9;
      for (let y = 0; y < N; y++) { if (tmp[y * N + x]) last = y; if (y - last <= r) out[y * N + x] = 1; }
      last = 1e9;
      for (let y = N - 1; y >= 0; y--) { if (tmp[y * N + x]) last = y; if (last - y <= r) out[y * N + x] = 1; }
    }
    return out;
  }

  function stubMask(size) {
    const data = new Float32Array(size * size);
    const cx = size / 2, cy = size / 2, rx = size * 0.3, ry = size * 0.38;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        data[y * size + x] = d < 1 ? 1 : 0;
      }
    return { data, size };
  }

  function setModel(key) {
    if (!MODELS[key]) return;
    wanted = key;
    try { localStorage.setItem("peelo-model", key); } catch (_) {}
  }

  window.Segmenter = {
    load, predict, isStub: useStub, setModel, mainSubject,
    get model() { return active || wanted; },
    get provider() { return provider; },
    models: MODELS,
  };
})();
