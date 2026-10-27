# Peelo: private, full-resolution background remover

A static website that removes image backgrounds **entirely in the browser**. Photos are never uploaded. Downloads keep the original resolution (up to 16 MP) with no signup, watermark or ads. It's aimed at people leaving remove.bg, whose pricing page says its standalone service ends on 1 Dec 2026 and moves into Canva.

Features: drag and drop, file picker or paste; model download progress (cached with the Cache API); before/after slider; checkerboard preview; transparent, solid-colour, blurred-original or custom-image backgrounds; erase/restore refine brush with undo; edge-softness control; PNG and JPG export at full resolution; light/dark mode; **batch mode** (free for 3 photos, Batch Pro $19 one-time for up to 200 per run).

## Model and licences

| Component | Licence | Source |
|---|---|---|
| U²-Net small (`u2netp`) weights | **Apache-2.0** | https://github.com/xuebinqin/U-2-Net (LICENSE copied to `models/LICENSE-U2Net-Apache-2.0.txt`) |
| ONNX export of u2netp | MIT (rembg project) | https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx |
| onnxruntime-web **1.20.1** (pinned) | MIT | https://www.npmjs.com/package/onnxruntime-web |
| fflate **0.8.2** (ZIP for batch) | MIT | https://www.npmjs.com/package/fflate (`vendor/fflate/`, unmodified `umd/index.js`, licence copied) |

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
- **PWA:** (cache `VERSION` is `v3` since batch; `js/batch.js` and `vendor/fflate/fflate.min.js` are precached) `manifest.webmanifest`, `icons/`, and `sw.js` (scope `/peelo/`). The shell is network-first with an offline fallback, `vendor/` is cache-first, and the model stays in the app's own Cache API cache. Bump `VERSION` in `sw.js` when the precache list changes.
- **Guides:** 11 static pages in `/<slug>/index.html`, linked from the home page `#guides` and listed in `sitemap.xml`.

## Batch mode and Batch Pro

**What it does.** The *Batch* tab (also `/peelo/#batch`, the nav link and the pricing card) takes many photos by picker, drag-and-drop or paste. Settings are chosen once: method (AI subject or Plain background), background (transparent, white, colour, blur), marketplace square + fill, PNG or JPG, max size (original/4000/2048/1600/1000 px). Photos are processed one at a time with the same pipeline and model session as the single tool (`PeeloCore.cutoutImage` in `js/app.js`); canvases are freed after each photo and each result is streamed straight into a ZIP (fflate, store-only), so only the ZIP and 160 px thumbnails stay in memory. There's a progress bar with ETA, per-file status and thumbnails, pause/resume, cancel (stops after the current photo and still offers a ZIP of what finished), and failed files are listed with a reason while the rest continue. Output names are `<original>-no-bg.png` (or `-square`, `.jpg`), deduplicated with `-2`, `-3`. Limit 200 per run (`BATCH_MAX_FILES`); above 1 GB of input the user gets a memory warning.

**Free vs Pro.** Free users can batch `FREE_BATCH_LIMIT` (3) photos per batch. Adding a 4th shows the Pro prompt with "Unlock Batch Pro, $19" and "Process the first 3 free". After a user's 3rd single-photo cutout in a session, one dismissible card suggests batch (not shown again that session once dismissed, never shown to Pro users). A Pricing section (Free vs Batch Pro, no subscription) sits on the home page.

**Analytics** (GoatCounter custom events, skipped if GoatCounter didn't load; queued for up to 20 s while `count.js` loads): `event-batch-open`, `event-batch-run-free`, `event-batch-run-pro`, `event-upsell-shown`, `event-upgrade-click`, `event-pro-unlocked`.

### Batch Pro payments (Stripe Payment Link)

1. In Stripe: **Product catalogue → Add product**: name **Peelo Batch Pro**, price **$19.00 USD, One-off** (not recurring).
2. **Payment Links → New**, select that product. Optional: *Allow promotion codes*.
3. Under **After payment**, choose **Don't show confirmation page → Redirect customers to your website** and enter exactly:
   `https://hyphenatesi.com/peelo/?pro=<PRO_UNLOCK_TOKEN>#batch` (the token from `config.js`).
4. Copy the link (`https://buy.stripe.com/...`) into `CONFIG.STRIPE_PAYMENT_LINK`. Set `CONFIG.CONTACT_EMAIL` so "Restore purchase" and the refund FAQ show a real address (empty = "reply to your Stripe receipt email"; make sure Stripe's public support email is set).
5. Test with Stripe test mode (a `buy.stripe.com/test_...` link and card 4242 4242 4242 4242) before switching to the live link.

With `STRIPE_PAYMENT_LINK` empty the site shows **"Batch Pro: coming soon"** instead of a buy button, and the free 3-photo batch still works.

On load, `?pro=<token>` is compared with `PRO_UNLOCK_TOKEN`; on a match it's stored in `localStorage` (`peelo-pro`), the parameter is removed with `history.replaceState`, and a thank-you banner offers a "copy unlock link" for other browsers. A wrong token shows a short message and changes nothing.

**Honest limits: this is a soft lock for an early test.** The token is in the public `config.js`, so anyone who reads the source can unlock Pro, and an unlock lives only in one browser's storage (clearing site data or switching device needs the link again). Stripe's receipt email does **not** include the unlock link, so "Restore purchase" asks buyers to use the link they bookmarked or to contact you; reply with the unlock URL. To rotate the token, change `PRO_UNLOCK_TOKEN` and the Stripe redirect together (existing buyers would need the new link). If batch sales take off, replace this with real licence keys (e.g. a serverless check of the Stripe Checkout session).

**Refunds:** the FAQ says "contact us within 14 days for a refund". This is a placeholder: **confirm the policy** and fill in the "Paid features" section of `terms.html`.

## Structure

```
index.html        page + SEO meta + FAQ JSON-LD
styles.css        mobile-first styles, light/dark tokens
config.js         all settings (name, model URL, signup endpoint, analytics, payment link)
js/segment.js     model loading (Cache API + progress) and inference; stub mask for tests
js/app.js         UI, mask building, refine brush, compositing, export; exposes PeeloCore.cutoutImage
js/batch.js       batch mode, Pro unlock, upsell card, pricing buttons, analytics events
models/           u2netp.onnx + licence notes
vendor/ort/       onnxruntime-web 1.20.1 runtime files + licence note
vendor/fflate/    fflate 0.8.2 UMD build (ZIP) + MIT licence
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
| `PAYMENT_LINK` | `""` | Legacy pre-order link, unused now. |
| `STRIPE_PAYMENT_LINK` | `""` | Batch Pro Payment Link. Empty = "coming soon". |
| `PRO_UNLOCK_TOKEN` | random string | Must match the `?pro=` value in Stripe's after-payment redirect. |
| `PRO_PRICE` / `FREE_BATCH_LIMIT` / `BATCH_MAX_FILES` | `$19` / `3` / `200` | Pricing text and limits. |
| `CONTACT_EMAIL` | `""` | Shown in Restore purchase and the refund FAQ. |
| `SIGNUP_ENDPOINT` (again) | | The "notify me" form now appears only in the Pricing section, only while there's no payment link, and only if this is set. |

## Testing

```
python3 test/make_test_image.py
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 test/e2e.py   # serves on port 18792
```
The test runs real model inference at 390px and 1280px and checks the PNG alpha against a ground-truth mask. It also checks JPG colour backgrounds, erase/restore at full resolution, no horizontal scroll, the 16 MP cap, and stub mode.
