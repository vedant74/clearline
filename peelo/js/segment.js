/* Segmentation engine: loads U^2-Net (u2netp) with onnxruntime-web and returns a low-res mask.
   Everything runs locally; the only network requests are for the model and runtime files
   served from this same site. */
(function () {
  "use strict";
  const C = window.CONFIG;
  const MEAN = [0.485, 0.456, 0.406];
  const STD = [0.229, 0.224, 0.225];

  let sessionPromise = null;

  function useStub() {
    try {
      if (new URLSearchParams(location.search).get("stub") === "1") return true;
    } catch (_) {}
    return !!C.USE_STUB_MODEL;
  }

  // Fetch with progress, storing the response in the Cache API so repeat visits are instant/offline.
  async function fetchModel(url, onProgress) {
    let cache = null;
    try {
      cache = await caches.open(C.MODEL_CACHE_NAME);
      const hit = await cache.match(url);
      if (hit) {
        onProgress && onProgress(1, true);
        return await hit.arrayBuffer();
      }
    } catch (_) { cache = null; } // Cache API unavailable (private mode, http, etc.)

    const res = await fetch(url);
    if (!res.ok) throw new Error("Model download failed (HTTP " + res.status + ")");
    const total = Number(res.headers.get("content-length")) || 0;
    let buf;
    if (res.body && total) {
      const reader = res.body.getReader();
      const chunks = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        got += value.length;
        onProgress && onProgress(got / total, false);
      }
      const out = new Uint8Array(got);
      let off = 0;
      for (const c of chunks) { out.set(c, off); off += c.length; }
      buf = out.buffer;
    } else {
      buf = await res.arrayBuffer();
    }
    onProgress && onProgress(1, false);
    if (cache) {
      try {
        await cache.put(url, new Response(buf.slice(0), { headers: { "content-type": "application/octet-stream" } }));
      } catch (_) {}
    }
    return buf;
  }

  function load(onProgress) {
    if (useStub()) return Promise.resolve("stub");
    if (sessionPromise) return sessionPromise;
    sessionPromise = (async () => {
      if (!window.ort) throw new Error("Runtime failed to load");
      // Must be an absolute URL: the runtime dynamic-imports its .mjs loader from here.
      ort.env.wasm.wasmPaths = new URL(C.ORT_WASM_PATH, location.href).href;
      // Multi-threading needs cross-origin isolation, which GitHub Pages cannot provide.
      ort.env.wasm.numThreads = 1;
      const bytes = await fetchModel(new URL(C.MODEL_URL, location.href).href, onProgress);
      return ort.InferenceSession.create(bytes, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
    })();
    sessionPromise.catch(() => { sessionPromise = null; });
    return sessionPromise;
  }

  // Returns {data: Float32Array(size*size) in 0..1, size}
  async function predict(source, srcW, srcH) {
    const size = C.MODEL_INPUT_SIZE;
    if (useStub()) return stubMask(size);
    const session = await load();
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, srcW, srcH, 0, 0, size, size);
    const px = ctx.getImageData(0, 0, size, size).data;
    const n = size * size;
    const input = new Float32Array(3 * n);
    let max = 1;
    for (let i = 0; i < n * 4; i += 4) {
      const m = Math.max(px[i], px[i + 1], px[i + 2]);
      if (m > max) max = m;
    }
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      input[i] = (px[p] / max - MEAN[0]) / STD[0];
      input[n + i] = (px[p + 1] / max - MEAN[1]) / STD[1];
      input[2 * n + i] = (px[p + 2] / max - MEAN[2]) / STD[2];
    }
    const feeds = {};
    feeds[session.inputNames[0]] = new ort.Tensor("float32", input, [1, 3, size, size]);
    const results = await session.run(feeds);
    const out = results[session.outputNames[0]].data;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < n; i++) { if (out[i] < lo) lo = out[i]; if (out[i] > hi) hi = out[i]; }
    const range = hi - lo || 1;
    const data = new Float32Array(n);
    for (let i = 0; i < n; i++) data[i] = (out[i] - lo) / range;
    return { data, size };
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

  window.Segmenter = { load, predict, isStub: useStub };
})();
