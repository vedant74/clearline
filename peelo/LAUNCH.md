# Launch plan

## Name options
1. **Peelo** (current pick). Short, friendly, and it suggests "peel the background off". Check the domain and trademark before committing.
2. **ClearCut Local**. Descriptive, and "Local" carries the privacy promise. Downside: "ClearCut" is a common term and hard to own in search.
3. **Backdrop Off**. Literal, good for SEO, and it reads like a verb phrase. Downside: long and less brandable.

To change the name, edit `CONFIG.PRODUCT_NAME` and search-replace "Peelo" in `index.html`, `privacy.html`, `terms.html` and `og-image.png`.

## Positioning
For sellers, creators and small teams who need clean product and profile cutouts, Peelo is a free background remover that runs entirely in your browser. Downloads are full resolution, there are no credits, no account and no watermark, and photos are never uploaded. remove.bg's standalone service ends on 1 Dec 2026, and the main alternatives gate HD downloads behind subscriptions. Peelo makes the basic job free and private, and charges once (not monthly) only for batch processing.

## Store / directory listing copy
- **Title (≤30):** `Peelo: Background Remover` (25)
- **Subtitle (≤30):** `Free, full-res, no upload` (25)
- **Description:**
  Remove the background from any photo in seconds, right in your browser. Peelo runs its AI on your own device, so your images are never uploaded. Download a transparent PNG or a JPG on white, any colour, a blurred background or your own backdrop, all at the original resolution. No account, no credits, no watermark, no ads. If the AI misses an edge, fix it with the erase and restore brush. Made for Etsy, eBay, Shopify and Depop sellers, social posts, profile photos and slides. Batch processing (pay once, no subscription) is coming soon.
- **Keywords (10):** background remover, remove background, remove.bg alternative, transparent png, cutout, product photo, free background eraser, no upload, full resolution, photo editor

## Launch posts (honest, disclosed, timed around the 1 Dec 2026 shutdown)
Rules: say you built it, follow each subreddit's self-promotion rules (many only allow it in weekly threads), reply to every comment, and don't use sock puppets or fake reviews.

**1. r/Etsy, around Tue 4 Nov 2026 (4 weeks before the shutdown)**
> **I made a free background remover that doesn't upload your photos. Feedback from sellers wanted**
> Disclosure: I built this. I kept hitting paywalls for HD downloads when cleaning up listing photos, so I made a tool that runs entirely in the browser. The download is the full resolution of your photo, with no account and no watermark. It handles single products well. It's weaker on fuzzy hair and glass, so there's a manual erase/restore brush. I'd love to know what breaks on *your* product photos. [link]

**2. r/ecommerce, around Mon 17 Nov 2026 (2 weeks out)**
> **remove.bg's standalone service ends Dec 1. What are you switching to for product cutouts?**
> remove.bg's pricing page says it's moving into Canva on 1 Dec. If you only need cutouts for listings, here are the options I've found: Canva (if you already pay), Photoroom (subscription for HD), the open-source rembg if you're technical, and the free in-browser tool I built (disclosure), which is full resolution with no upload. Happy to add others people use. Main question: would you pay once for batch (a folder in, zip out), and roughly how much?

**3. Product Hunt, Tue 25 Nov 2026**
> **Tagline (≤60):** Free background remover that never uploads your photos
> **First comment:** Why this, why now (the remove.bg shutdown), what's free forever (single images at full resolution), what's paid (batch, pay once), the honest limits (hair and glass), and the model's licence (IS-Net, Apache-2.0).

**4. TikTok / Reels / Shorts script (~25 s), post the week of 24 Nov and again on 1 Dec**
> [0–3s, screen recording] "remove.bg is shutting down its standalone site on December 1st. Here's the free thing I use instead."
> [3–12s] Drop a messy product photo in, the background vanishes, drag the before/after slider.
> [12–18s] "Full resolution, no account, and the photo never leaves your phone." Toggle airplane mode and remove another background.
> [18–25s] Swap to a white background and download. "Link in bio. I made it, tell me what it gets wrong."

**5. Show HN / r/SideProject on Mon 1 Dec 2026 (shutdown day)**
> **Show HN: In-browser background removal, full res, no upload (IS-Net + ONNX Runtime Web)**
> Technical write-up: a 1024×1024 Apache-2.0 IS-Net model (fp16 weights, 91 MB, WebGPU when available, WASM otherwise), a connected-component pass that drops background text, mask upscaled and edge-shaped at up to 16 MP, a refine brush replayed at full resolution on export, no server, static hosting. Be upfront about the quality limits compared with large server models.

## Batch pricing (pay once)
| Plan | Price | Includes |
|---|---|---|
| Free | $0 | Unlimited single images, full resolution, all backgrounds, refine brush |
| **Batch Lifetime** | **$19 one-time** ($12 early-bird for the waitlist until 31 Dec 2026) | Folder/multi-file drop, consistent background and padding presets, ZIP download, still 100% on-device, future updates for v1.x |
| Batch Team | $49 one-time | Up to 5 people, saved brand presets (background colour, margins, square/marketplace sizes) |

For comparison, the competitors' HD subscriptions cost about £30+/month. The one-time price is the hook, and it fits a product with no server costs.

## Weekly metrics (first month)
Use privacy-friendly analytics, or GitHub Pages traffic plus waitlist counts.

| Week (start) | Unique visitors | Images processed | Downloads (PNG+JPG) | Download rate (downloads/processed) | Waitlist signups | Visitor to signup | Notes / main channel |
|---|---|---|---|---|---|---|---|
| Wk 1 (3 Nov) target | 500 | 600 | 400 | ≥65% | 25 | 5% | r/Etsy post |
| Wk 2 (10 Nov) target | 1,000 | 1,300 | 900 | ≥65% | 50 | 5% | SEO indexing, replies |
| Wk 3 (17 Nov) target | 2,000 | 2,800 | 1,900 | ≥65% | 100 | 5% | r/ecommerce |
| Wk 4 (24 Nov–1 Dec) target | 5,000 | 7,000 | 4,700 | ≥65% | 250 | 5% | Product Hunt, TikTok, shutdown day |
| **Month total target** | **8,500** | **11,700** | **7,900** | | **425** | | |
| Actual | | | | | | | |

Kill/continue signal by 15 Dec: at least 300 waitlist signups and at least 30 early-bird pre-orders (if `PAYMENT_LINK` is live) means building batch next. Fewer than 100 signups means trying the SEO pages ("remove.bg alternative", "remove background without uploading") for another month before investing more.
