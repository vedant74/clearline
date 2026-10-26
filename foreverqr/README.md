# ForeverQR: QR codes that never expire

A free, static QR code generator and ad-free scanner. Codes are made in the browser and hold the data directly, so they cannot expire or be switched off. You don't sign up, there's no watermark, and there's no trial. It's a static site with no backend, no build step and no CDN dependencies.

- **Generator:** URL, text, Wi-Fi, contact (vCard 3.0), email, SMS and phone codes. You can set the colours (with a contrast warning), choose square, rounded or dot styles, set error correction and margin, and add a centre logo (which switches error correction to High automatically). Downloads are PNG (512–4096 px) or SVG, and the image can be copied to the clipboard.
- **Scanner:** works from the camera or an uploaded image. It uses BarcodeDetector where the browser has it and falls back to jsQR, which is loaded only when needed. Results show in full. For links, the real domain is highlighted, risky links get warnings (http, punycode, raw IP, `@` login trick, URL shorteners), and nothing opens until the user taps.
- **Waitlist:** a "Dynamic codes, pay once" waitlist form, plus optional analytics and a payment link. All three are set in `config.js`.

## Files

```
index.html        Main page: generator, scanner, explainer, waitlist, FAQ (+ FAQPage JSON-LD, OG tags)
config.js         All settings (name, signup endpoint, analytics snippet, payment link, contact)
css/style.css     Styles; light/dark via prefers-color-scheme + toggle
js/app.js         All app logic (payload builders, renderer, PNG/SVG export, scanner, waitlist)
vendor/           qrcode-generator 1.4.4 (MIT), jsQR 1.4.0 (Apache-2.0), LICENSES.md
privacy.html      Privacy policy TEMPLATE (review before launch)
terms.html        Terms TEMPLATE (review before launch)
favicon.svg, og-image.png, robots.txt, sitemap.xml, .nojekyll
tests/e2e.js      Playwright end-to-end + round-trip decode test
screenshots/      Test screenshots
```

## Deploy to GitHub Pages in 3 steps

1. Create a new public GitHub repo and push the contents of this folder to the `main` branch, with `index.html` at the repo root. You can leave out `tests/` and `screenshots/`.
2. In the repo, go to **Settings → Pages → Build and deployment** and set Source to *Deploy from a branch*, Branch to `main` and folder to `/ (root)`, then click Save.
3. After about a minute the site is live at `https://<user>.github.io/<repo>/`. For a custom domain, add it under the same settings page and create the DNS record GitHub shows you. Then replace `https://example.com/` in `index.html` (canonical, `og:url`, `og:image`), `robots.txt` and `sitemap.xml` with your real URL.

## Configuration (`config.js`)

| Key | Default | What it does |
|---|---|---|
| `PRODUCT_NAME` | `"ForeverQR"` | Name shown in the header and footer. For SEO, also search-and-replace it in the `<title>` and meta tags of `index.html`, `privacy.html` and `terms.html`. |
| `SIGNUP_ENDPOINT` | `""` | URL the waitlist form POSTs `email` and `source` to as FormData. Works with Formspree, Getform, Basin or a Google Apps Script web app. If empty, the form shows "Thanks — coming soon" and stores and sends nothing. |
| `ANALYTICS_SNIPPET` | `""` | HTML `<script>` tag for GoatCounter or Plausible, pasted in as-is. Custom events are sent if the library supports them: `generate-download`, `generate-copy`, `scan-result`, `waitlist-signup`. |
| `PAYMENT_LINK` | `""` | A Stripe Payment Link or Lemon Squeezy URL. When set, a "Pre-order (pay once)" button appears. |
| `CONTACT_EMAIL` | `""` | Shows a Contact link in the footer. |

If you turn on analytics, a signup provider or payments, update `privacy.html` to match.

## Run the tests

```bash
cd apps/qr
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=/opt/npm-tools/node_modules node tests/e2e.js
```

The test serves the folder on port 18791 (change it with `PORT=`). It loads the page at 390 px and 1280 px, generates codes and downloads the PNG and SVG files, then decodes them with jsQR, both in Node and through the scanner UI. It also covers every code type, all three dot styles with and without a logo, and a 360-character URL. Along the way it checks for horizontal overflow, console errors and external network requests.
