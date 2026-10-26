/* Site configuration. Edit these values; no build step needed. */
window.CONFIG = {
  // Product name shown across the UI (elements with data-name). Also update <title>/meta in index.html.
  PRODUCT_NAME: "Peelo",
  TAGLINE: "Free background remover that runs on your device",

  // Model. Vendored by default (4.6 MB, Apache-2.0). Can be any URL serving the same ONNX file
  // with CORS enabled, e.g. a GitHub Release asset or your own CDN.
  MODEL_URL: "models/u2netp.onnx",
  MODEL_INPUT_SIZE: 320,
  MODEL_CACHE_NAME: "bg-model-u2netp-v1", // bump to force re-download after changing MODEL_URL

  // onnxruntime-web runtime files (vendored from npm onnxruntime-web@1.20.1, MIT).
  ORT_WASM_PATH: "vendor/ort/",

  // Use a fake elliptical mask instead of the model (for testing without the model).
  // Can also be enabled per-visit with ?stub=1 in the URL.
  USE_STUB_MODEL: false,

  // Large image handling. Images above MAX_PIXELS are processed at a reduced size
  // (browsers, especially iOS Safari, fail on canvases above ~16.7 MP).
  MAX_PIXELS: 16000000,
  WARN_FILE_MB: 25,

  // Batch waitlist: POST {email, source} as JSON. Empty = show a local thank-you and store nothing.
  SIGNUP_ENDPOINT: "",
  // Optional raw HTML snippet (e.g. a privacy-friendly analytics <script>) injected into <head>.
  ANALYTICS_SNIPPET: "",
  // Optional payment link for "pay once" batch pre-orders. Empty = button hidden.
  PAYMENT_LINK: "",
};
