# Launch kit

## 1. Name options

| Name | Why | Watch-outs |
|---|---|---|
| **ForeverQR** (in use) | The promise is in the name. Easy to say and to remember, and it reads well as "forever QR code". | Check the domain (`foreverqr.com` / `.app` / `.io`), app-store names and trademarks before you commit. |
| **KeepQR** | Short and verb-like ("keep your codes working"). | "Keep" is softer than "forever". Check the domain. |
| **PlainQR** | Says honest, no tricks, no upsell. Fits a "no dark patterns" brand. | Doesn't name the main pain (codes expiring). |

The name is changed in `config.js` (`PRODUCT_NAME`) and in the `<title>`/meta tags with a search-and-replace.

## 2. Positioning

Small businesses printed QR codes from "free" generators, and after the trial those codes quietly turned into paywalls. Menus, flyers and packaging stopped working until the owner paid $15–50 a month. ForeverQR makes **static QR codes that can never expire**: the link is written into the code itself, so nobody, including us, can switch it off. There's no signup, no watermark and no trial. The same site has an ad-free scanner that shows the full link before opening it. People who need editable codes will be able to buy **dynamic codes once** instead of renting them, with a written promise that their redirects survive even if we don't.

## 3. App Store / Play listing (for a later wrapped app)

- **Title (28/30):** `ForeverQR: QR Code Generator`
- **Subtitle (29/30):** `No signup. Codes never expire`
- **Play short description (80 max):** `Free QR codes that never expire. No signup, no watermark, ad-free scanner.`

**Description:**

> Make QR codes that keep working forever. Free, with no account and no watermark.
>
> Many QR apps hand you "dynamic" codes on a free trial and then switch them off unless you subscribe. ForeverQR makes static codes: your link is stored inside the code itself, so it can't expire and we can't disable it.
>
> CREATE
> • Website links, text, Wi-Fi login, contact cards, email, SMS and phone numbers
> • Your colours, rounded or dot styles, and your logo in the centre
> • High-resolution PNG and print-ready SVG
>
> SCAN
> • Scan with the camera or from a photo or screenshot
> • No ads. Ever.
> • See the full link and the real website before you open anything, with warnings for suspicious links
>
> PRIVATE BY DESIGN
> • Codes are made on your device. We never see what's in them.
>
> Coming soon: editable codes you pay for once, not every month.

**Keywords (10):** qr code generator, qr code maker, free qr code, qr scanner, wifi qr code, no subscription, static qr code, qr code logo, vcard qr, barcode reader

## 4. Launch posts

### Reddit, r/smallbusiness (check the self-promo rules first, or post in the weekly promo thread)

> **Title:** PSA: if your printed QR code "stopped working", it was probably a dynamic code from a free trial
>
> I keep seeing posts from restaurant and shop owners whose menu or flyer QR codes suddenly lead to a "subscribe to reactivate" page. Here's what's going on. A lot of generators make *dynamic* codes by default. The code points to *their* short link, which forwards to your site. When the trial ends, the forwarding stops.
>
> How to tell: scan your code and look at the link before it opens. If it's something like `qrco.de/...` or `l.ead.me/...` and not your own website, it's dynamic.
>
> The fix: make a *static* code, where your own URL is inside the code. Static codes can't expire because there's no middleman. Most generators can make them for free if you dig around.
>
> Disclosure: I got annoyed enough to build a free one with no signup, no watermark and no trial (link in comments if allowed). It also has a scanner that shows the full link first, so you can check your old codes. Happy to answer questions about reprinting or what size to print at.

### Product Hunt

- **Tagline (≤60):** `Free QR codes that never expire. No signup, no trial.`
- **First comment:** A short story about the trial trap, what static means, what's free forever (everything static), and what's coming (pay-once dynamic codes plus the shutdown promise). Ask for feedback on the pricing.

### X / Threads

> Your "free" QR code generator is a subscription in disguise.
> Trial ends → every menu, flyer and sign you printed goes dead.
> I made one where that's impossible: static codes, no signup, no watermark. The link lives inside the code. Nothing to switch off.

### Indie Hackers / Hacker News ("Show HN")

> Show HN: ForeverQR – static QR generator with no signup, plus an ad-free scanner
> No backend. Everything runs in the browser (qrcode-generator + jsQR). The scanner never auto-opens links and highlights the real domain, which helps against quishing. I'm considering pay-once dynamic codes with an export-on-shutdown guarantee. Would you trust that?

### TikTok / Reels / Shorts script (≈25 s)

> **[0–3s]** *(Hold up a restaurant menu with a QR code)* "This QR code is being held hostage."
> **[3–8s]** *(Scan it. Screen shows a "subscribe to reactivate" page)* "The owner made it on a 'free' site. The trial ended, so now it's a paywall."
> **[8–15s]** *(Screen recording of ForeverQR: paste URL → code appears)* "A static QR code puts your link inside the code. There's no middleman, so it can't expire."
> **[15–22s]** *(Tap Download SVG, then show it printed)* "Free, no signup, no watermark. Print it once and you're done."
> **[22–25s]** *(Text on screen: ForeverQR)* "Check your codes before your customers do."

## 5. Pricing: dynamic codes, pay once

| Plan | One-time price | Includes |
|---|---|---|
| **Starter** | $19 | 5 editable codes, unlimited edits, simple scan counts, 50k scans/month fair use |
| **Business** | $49 | 50 editable codes, scan stats by day/device/country (no personal data), CSV export |
| **Agency** | $129 | 300 codes, custom short domain (your `go.yourbrand.com`), team sharing, bulk CSV create |

- **The shutdown promise (main selling point):** every plan can export its redirect table at any time. On Business and above, codes can sit on the customer's own domain, so they keep working even if we close.
- **Early bird:** 30% off for waitlist members for 7 days at launch.
- **Unit economics:** Redirects on Cloudflare Workers or a small KV store cost fractions of a cent per 10k scans, so a one-time price stays profitable as long as the fair-use caps hold. Review the caps after 3 months of real data.
- **Upgrade path:** a top-up of +20 codes for $15, also one-time. No subscriptions at all; that's the brand.

## 6. Weekly metrics

| Metric | Source | Why it matters | Month-1 target |
|---|---|---|---|
| Unique visitors | GoatCounter / Plausible | Top of the funnel | 3,000 |
| Codes generated (PNG + SVG + copy events) | `generate-download`, `generate-copy` events | Core value delivered | 1,200 |
| Generate rate (codes ÷ visitors) | derived | Shows whether the UX works | ≥ 35% |
| Scanner uses | `scan-result` event | Second use case and repeat visits | 250 |
| Waitlist signups | `waitlist-signup` event / form provider | Demand for the paid product | 90 |
| Waitlist conversion (signups ÷ visitors) | derived | Whether the pay-once pitch lands | ≥ 3% |
| Search clicks / impressions | Google Search Console | SEO traction on "qr code doesn't expire" queries | 300 clicks / 15k impressions |
| Top referrers | analytics | Which launch channel worked | — (look at it weekly) |
| Pre-orders (if `PAYMENT_LINK` set) | Stripe / Lemon Squeezy | Willingness to pay | 5 |
| Support emails / complaints | inbox | Bugs and trust issues | Read 100% of them within 48 h |

The targets are first guesses for a launch with no budget (Reddit + Product Hunt + SEO). Reset them after week 2 based on what actually happens.
