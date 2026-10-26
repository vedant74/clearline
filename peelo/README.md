# Peelo: private, full-resolution background remover

A static website that removes image backgrounds **entirely in the browser**. Photos are never uploaded. Downloads keep the original resolution (up to 16 MP) with no signup, watermark or ads. It's aimed at people leaving remove.bg, whose pricing page says its standalone service ends on 1 Dec 2026 and moves into Canva.

Features: drag and drop, file picker or paste; model download progress (cached with the Cache API); before/after slider; checkerboard preview; transparent, solid-colour, blurred-original or custom-image backgrounds; erase/restore refine brush with undo; edge-softness control; PNG and JPG export at full resolution; light/dark mode; batch waitlist form.

## Model and licences

| Component | Licence | Source |
|---|---|---|
| U²-Net small (`u2netp`) weights | **Apache-2.0** | https://github.com/xuebinqin/U-2-Net (LICENSE copied to `models/LICENSE-U2Net-Apache-2.0.txt`) |
| ONNX export of u2netp | MIT (rembg project) | https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx |
| onnxruntime-web **1.20.1** (pinned) | MIT | https://www.npmjs.com/package/onnxruntime-web |

- `u2netp` is a **general salient-object** model. It isn't limited to portraits, so it works on products, pets, people and logos.
- The model is **vendored** in `models/u2netp.onnx` (4.6 MB, sha256 `309c8469…ddd8`, see `models/MODEL-NOTE.txt`). The ORT runtime is vendored in `vendor/ort/` (the largest file is 11 MB). Both are well under GitHub Pages' 100 MB per-file limit, and the site makes **no third-party requests**.
- These were deliberately not used: `@imgly/background-removal` (AGPL), BRIA RMBG-1.4/2.0 (non-commercial), and the larger U²-Net/IS-Net files (about 170 MB each, too big for Pages).
- Quality trade-off: u2netp is small. It's very good on single clear subjects and weaker on fine hair, glass and cluttered scenes, which is why the refine brush exists. You can swap in a bigger permissively licensed model by changing `MODEL_URL` (input must be 1×3×320×320 or you must adjust `MODEL_INPUT_SIZE`).

## How it works

1. The image is decoded locally. Anything over `MAX_PIXELS` (16 MP) is scaled down, and the user sees a warning.
2. A 320×320 copy goes through u2netp in onnxruntime-web (WASM, single-threaded so it works without cross-origin isolation).
3. The probability mask is upscaled in steps to the working resolution, then shaped with a smoothstep edge curve (the "Edge softness" slider controls the feather).
4. Brush strokes are stored in image coordinates and replayed at full resolution on export. The preview is capped at 1400 px for speed.
5. On export, the mask is applied to the original-resolution image and composited over the chosen background.

## URL presets, marketplace mode, PWA, guides

- **URL presets** (used by the guide pages): `?preset=marketplace` (white, square, 85% fill), `?preset=logo` / `?preset=signature` (Plain background method, transparent), or individually `?bg=transparent|white|black|blur|<hex>`, `?format=square|original`, `?fill=50..100`, `?method=ai|plain`. Documented at the top of `js/app.js`.
- **Square framing / Marketplace photo:** the subject's bounding box is measured on the full-resolution mask and a square is built around it at the chosen fill. It never upscales, is capped at 16 MP, and keeps subjects cut off by the bottom edge (headshots, cars) anchored to the bottom.
- **Plain background method:** keys out the border colour (white paper, flat logo backgrounds) at full resolution, with no model download.
- **PWA:** `manifest.webmanifest`, `icons/`, and `sw.js` (scope `/peelo/`). The shell is network-first with an offline fallback, `vendor/` is cache-first, and the model stays in the app's own Cache API cache. Bump `VERSION` in `sw.js` when the precache list changes.
- **Guides:** 11 static pages in `/<slug>/index.html`, linked from the home page `#guides` and listed in `sitemap.xml`.

## Structure

```
index.html        page + SEO meta + FAQ JSON-LD
styles.css        mobile-first styles, light/dark tokens
config.js         all settings (name, model URL, signup endpoint, analytics, payment link)
js/segment.js     model loading (Cache API + progress) and inference; stub mask for tests
js/app.js         UI, mask building, refine brush, compositing, export
models/           u2netp.onnx + licence notes
vendor/ort/       onnxruntime-web 1.20.1 runtime files + licence note
privacy.html, terms.html   TEMPLATES, so fill in the bracketed items before launch
og-image.png, favicon.svg, robots.txt, .nojekyll
test/             make_test_image.py, e2e.py (Playwright), out/ (test artefacts)
screenshots/      test screenshots at 390px and 1280px
```

## Deploy to GitHub Pages (3 steps)

1. Create a new GitHub repo and push the **contents** of this folder to the `main` branch. `test/out/` can be left out.
2. In the repo, go to **Settings → Pages → Build and deployment**, choose *Deploy from a branch*, then `main` / `(root)`.
3. Open `https://<user>.github.io/<repo>/`. Later, add a custom domain on the same page and set `og:image` / canonical to absolute URLs.

## Configuration (`config.js`)

| Key | Default | Purpose |
|---|---|---|
| `PRODUCT_NAME` | `Peelo` | Shown wherever `data-name` appears. Also search-replace "Peelo" in `<title>`/meta in `index.html`, the legal pages and `og-image.png`. |
| `MODEL_URL` | `models/u2netp.onnx` | Any CORS-enabled URL to the same model. |
| `MODEL_CACHE_NAME` | `bg-model-u2netp-v1` | Bump this after changing the model so browsers re-download it. |
| `ORT_WASM_PATH` | `vendor/ort/` | Location of the runtime `.wasm`/`.mjs`. |
| `USE_STUB_MODEL` | `false` | Uses a fake elliptical mask (or visit `?stub=1`) to test the pipeline without the model. |
| `MAX_PIXELS` / `WARN_FILE_MB` | `16000000` / `25` | Large-image handling. |
| `SIGNUP_ENDPOINT` | `""` | POSTs JSON `{email, source}`. Empty shows a local thank-you and stores nothing. |
| `ANALYTICS_SNIPPET` | `""` | Raw HTML injected into `<head>`. Update the privacy page and the footer's "no third-party requests" line if you use it. |
| `PAYMENT_LINK` | `""` | Shows a "Pre-order batch" button when set. |

## Testing

```
python3 test/make_test_image.py
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 test/e2e.py   # serves on port 18792
```
The test runs real model inference at 390px and 1280px and checks the PNG alpha against a ground-truth mask. It also checks JPG colour backgrounds, erase/restore at full resolution, no horizontal scroll, the 16 MP cap, and stub mode.
