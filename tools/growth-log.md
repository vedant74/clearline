# Hyphenatesi growth log

Running log for the daily growth agent. Newest entries at the bottom. Read before every run.

## 2026-11-04 — Starting state (written by the main session)

**Live:** Peelo (IS-Net model, text/speckle cleanup, uncertain-region fill, Web Worker, batch + Batch Pro via Stripe Payment Link), ForeverQR (static codes, 10 guides), 15 Peelo guides, homepage hub linking all guides, WebApplication schema, sitemaps, 404, IndexNow key file at /910ead08f5a5df93bdbf52ffa68065bc.txt.

**Search:** Google Search Console verified, sitemap resubmitted Oct 29; a few impressions, 0 clicks. Bing Webmaster Tools set up Oct 29, all 28 URLs submitted. AlternativeTo listing for Peelo submitted with 14 alternatives, pending review.

**Traffic (GoatCounter, Oct 28 – Nov 4):** 27 visits, mostly Vedant; first Google referral (1); ~5–15 real visitors; 2 upgrade clicks, 1 free batch run. Single-photo events (cutout-done, download-png/jpg, cutout-error) added Nov 4, so earlier weeks have no data for them.

**Launch plan (Vedant posts):** Show HN suggested Tue Nov 10, 8:30 AM ET; Product Hunt about a week later; Reddit replies ongoing. Copy lives in the "Peelo Launch Kit" doc.

**Pending decisions (not the agent's to make):** Batch Pro price $19 → $9 launch price (needs new Stripe link from Vedant); short domain for Peelo (e.g. peelo.app) undecided; ForeverQR editable codes on branch foreverqr-editable await Vedant's accounts and approval.

**Known competitors:** Photoroom (~$65M ARR Mar 2024 per Sacra, resellers on mobile, AI backgrounds ~$13/mo), PeelBG (peelbg.com, similar name and pitch), Pixian (pay-as-you-go), Shopify background-remover apps at $9–10/mo per 500 images, many in-browser "no upload" tools (Background Removal in the Browser, NOBG.space, Stilllight). Our wedge: free full resolution, no signup, private, auto text cleanup, one-time price.

**Backlog (ranked):**
1. Reseller presets + guides: Poshmark, Depop, eBay, Vinted, Mercari (guides are agent work; presets in the tool are a feature → needs approval).
2. Phone performance check for Peelo (91 MB model on phones); maybe default to Fast mode on phones (feature change → needs approval).
3. Non-AI studio backgrounds with soft shadows (feature → needs approval).
4. ForeverQR use-case long-tail guides (agent work).
5. "QR code stopped working" rescue content (agent work).

## 2026-11-05 (Thu) — Improve what exists

**Did (all live on main):**
- Fixed a stale fact on the Peelo landing page: the "Private by design" card said the AI engine is "about 16 MB". It's about 91 MB (5 MB in Fast mode, per segment.js).
- Added a hand-picked "Related guides" section (3 links, each with a one-line reason) to all 15 Peelo guides and all 10 ForeverQR guides. Until now, guides had almost no contextual links, only an identical full list. Peelo's picks live in tools/peelo-guides/related.py; a new Peelo guide needs an entry there or gen_guides.py raises KeyError. ForeverQR's are hand-written in each page.
- The homepage had no inbound internal links and the two tools didn't link to each other. Added cross-tool and homepage links to the footers of the Peelo landing page, Peelo guides, the ForeverQR landing page and ForeverQR guides. Privacy/terms pages not touched.
- Updated lastmod in peelo/sitemap.xml and foreverqr/sitemap.xml for changed pages.
- Titles/metas reviewed: all within limits. Left unchanged; no search data to justify rewrites.

**Metrics:** none. GoatCounter isn't reachable from the sandbox (proxy rejects hyphenatesi.goatcounter.com).

**Not verified today:** external facts. Page fetches for remove.bg, Photoroom and Canva failed (the permission prompt timed out with nobody there), so "Checked" dates were not changed. The remove.bg shutdown wording still rests on the 29 Oct check.

**Market note (search result titles only, pages not opened):** Photoroom has a "remove bg shutting down" blog post, and many others target the same query (mergeimages.net, explainx.ai, aisotools, CapCut Dreamina, AlternativeTo news). The query is getting crowded.

**Backlog:**
1. Re-verify remove.bg, Canva and Photoroom facts on the official pages before Show HN (Nov 10). Replace the two weak sources on the alternative page: a canva.cn help link and a third-party Closo summary for Photoroom.
2. If Batch Pro goes to $9, hard-coded "$19" must change too (data-price spans follow config.js, these don't): tools/peelo-guides/pages.py lines 33, 65, 181, 227; pages_new.py lines 29, 50, 63, 67, 84, 113; peelo/index.html JSON-LD line 76 and lines 352, 406; peelo/terms.html (legal page, Vedant's call); peelo/js/batch.js (check); comment in config.js. Then regenerate guides.
3. tools/peelo-guides/__pycache__ is tracked in git and dirties the tree on each regeneration: run with PYTHONDONTWRITEBYTECODE=1 or untrack it.
4. For Vedant: GitHub Pages serves the whole repo, and robots.txt only stops crawling, so this log (/tools/growth-log.md, with launch plans and competitor notes) and peelo/LAUNCH.md and foreverqr/LAUNCH.md can likely be opened by URL. Not confirmed live, because the sandbox can't fetch the site.

## 2026-11-06 (Fri) — Distribution + market scan

**Published:** nothing (Friday is scan-only). Local checks passed on all 33 pages crawled from /.

**Metrics:** none. GoatCounter is not reachable from the sandbox.

**Threads for Vedant to reply to (he posts; nothing was posted by the agent).** The search tool returns almost no Reddit results, and Reddit fetches time out on a permission prompt. #1–3 were opened and read on Nov 6. #4–5 were found through a DesignKit blog (Nov 2) and are NOT verified: open them first and check they're still open and on-topic.

1. Shopify Community, "Removing Background of Photos" (asked May 2024, new replies Nov 5 2026, open): https://community.shopify.com/t/removing-background-of-photos/324991
   Already suggested: Pixc, remove.bg, Shopify Magic's built-in remover.
   Suggested reply: "Heads-up for anyone landing here now: remove.bg's standalone site closes on 1 Dec 2026 (it's moving into Canva). If you want a free option that doesn't need an account, I made Peelo (https://hyphenatesi.com/peelo/). It runs in your browser, so photos aren't uploaded anywhere, and you get the full-resolution PNG back. Batch is 3 photos free, and a one-time purchase unlocks more. Shopify's built-in remover is also worth a try if it's available in your admin. For tricky edges like hair, glass or white-on-white, test a few photos in each tool before you do the whole catalog."
2. eBay Community, "Best app for white background photos" (open; dates not visible in the fetched text): https://community.ebay.com/t5/Selling/Best-app-for-white-background-photos/td-p/34209285
   Already suggested: Photoroom, Pixelcut, eBay's own background tool.
   Suggested reply: "If you'd rather not install an app, I made a free browser tool called Peelo (https://hyphenatesi.com/peelo/). Open it on your phone or computer, drop in a photo, and download a PNG or a JPG with a white background. No signup or watermark, and the photo stays on your device. Fast mode is lighter if your phone struggles. eBay's built-in tool is also fine for simple items."
   → Check the JPG/white-background export wording against the live tool before posting.
3. Adobe Community, "QR code expires?" (June 2025, last reply Sept 25 2026, open and already answered): https://community.adobe.com/questions-671/qr-code-expires-896388
   The accepted answer is already right (static codes don't expire). Reply only if it adds something.
   Suggested reply: "To add to the answer above: you can check a code you already printed by scanning it and looking at the URL your phone shows before it opens. If that's the generator's own short link instead of your website, the code goes through their server and can stop working when the trial or account ends. If you need a code outside InDesign, I made ForeverQR (https://hyphenatesi.com/foreverqr/). It only makes static codes, and it does URL, Wi-Fi, vCard and printable signs. There's no account, so nothing can expire."
4. r/web_design, "Any alternatives to remove.bg now that it is…" (UNVERIFIED): https://www.reddit.com/r/web_design/comments/1woym42/any_alternatives_to_removebg_now_that_it_is/
   Suggested reply: "Disclosure, I made this: Peelo (https://hyphenatesi.com/peelo/). It's free, there's no signup, and it runs fully in your browser (IS-Net model, WebGPU when available), so images aren't uploaded. It exports at full resolution up to 16 MP and cleans up leftover background text. It's not an API, though. If you need remove.bg's API, look at Photoroom's or remove.bg's Canva/Leonardo path."
5. r/canva, "Am I the only one mad that remove.bg is being shut…" (UNVERIFIED; DesignKit says 66 comments): https://www.reddit.com/r/canva/comments/1w4v85y/am_i_the_only_one_mad_that_removebg_is_being_shut/
   Suggested reply: "If what you'll miss is a quick, free, no-login cutout, I built Peelo (https://hyphenatesi.com/peelo/) for that. It runs in the browser, nothing is uploaded, and you get full-res PNG downloads. Canva's remover is still the easy choice if you're already editing in Canva."
   → Respect each subreddit's self-promo rules. r/web_design and r/canva may remove posts that link a tool.

**Competitor moves:**
- Photoroom blog (Oct 29, opened): remove.bg's standalone site and self-serve API end 1 Dec 2026 at 9:00 CET. The API moves to Leonardo.ai (owned by Canva), and unused PAYG credits expire. Photoroom pitches a drop-in API replacement (Basic from $20/mo for 1,000 images). This matches our 1 Dec wording.
- A wave of "I built a free local alternative" posts on dev.to (LocalBG, others) and Reddit (r/software LocalBG post). "Private, in-browser" is no longer unique, so lead with full resolution, text cleanup and no signup.
- Platform tools are getting good enough: Shopify Magic has a built-in remover, and eBay sellers say eBay's own remover has improved a lot. Peelo's best case is people who list on several sites (Poshmark, Depop, Vinted, Mercari) and want one tool for all of them.
- DesignKit, removebg.best, backgone, localbg and explainx all have "remove.bg shutting down" pages. That query is saturated, so a "what users are saying" style page isn't worth copying.

**Product ideas (ranked, all need Vedant's approval):**
1. "White background JPG for marketplaces" one-click export with per-site presets (eBay/Poshmark square, Depop 4:5, Vinted). This links to backlog #1.
2. Default to Fast mode on phones, with a visible "Best quality" toggle. Forum askers are mostly on phones.
3. ForeverQR "Is my QR code going to expire?" checker: scan or upload a code, show the encoded URL, and flag known dynamic-redirect domains. It runs fully client-side, so no server is needed, but it's still a feature.

**Ideas for upcoming guide days:** Tue: "eBay white background photo without an app" (the eBay thread shows the need). Wed: "How to tell if your printed QR code will expire" (matches the Adobe threads).

**Needs Vedant:** nothing new. Still open: the $9 price decision, and the log/LAUNCH.md files being publicly readable by URL (see Nov 5).

## 2026-11-09 (Mon) — Metrics + plan

**Metrics:** none again. The sandbox proxy refuses hyphenatesi.goatcounter.com (CONNECT 403), the dashboard and the /counter/*.json endpoints alike. No week-over-week comparison is possible from here. If Vedant pastes the week's numbers (visits, top pages, referrers, events) into this log, the next Monday run can compare.

**Quick fix (live):** added a .gitignore (`__pycache__/`, `*.pyc`) and untracked tools/peelo-guides/__pycache__. Regenerating guides no longer dirties the tree (closes backlog #3 from Nov 5).

**Check-script note:** the root sitemap.xml is a sitemap index. Page URLs for / live in sitemap-pages.xml, so any crawl check has to read that file too.

**Not verified:** a fetch of remove.bg/pricing failed again (the permission prompt timed out). The 1 Dec 9:00 CET wording still rests on the 29 Oct check. Show HN is planned for tomorrow (Nov 10), so Vedant may want to glance at remove.bg/pricing himself first.

**This week's three target topics:**
1. **Tue (Peelo): "eBay white background photos without an app."** Why: the eBay Community thread (Nov 6 scan) shows sellers asking exactly this, and no Peelo guide covers eBay yet. Etsy, Amazon and Shopify already have one, so eBay is the biggest marketplace gap. It's also the first of the reseller set (backlog #1). Before writing, open eBay's official photo-requirements help page; don't rely only on summaries. Be honest that eBay has its own background tool, and pitch Peelo for desktop, full resolution, and use across several sites.
2. **Wed (ForeverQR): "QR code on product packaging that won't expire."** Why: packaging is printed in bulk and kept for years, so a dynamic code that dies is costly. That makes the "never expires" pitch strongest here. It's a buyer-intent query from small brands, and it doesn't overlap the existing stop-working/never-expires guides, which are generic. I picked this over the "how to tell if my QR code will expire" idea from Nov 6 because that one overlaps why-did-my-qr-code-stop-working too much. Fold that idea into a section there on Thursday instead. Cover print size, quiet zone, contrast and testing, citing a real source (e.g. ISO/QR spec summaries or GS1 guidance, opened, not snippets). Don't claim GS1 Digital Link support; ForeverQR only makes plain static codes.
3. **Thu (improve): pre-1-Dec remove.bg push + post-Show-HN cleanup.** Why: the remove.bg site closes in about three weeks, and the HN launch brings first real traffic. Link the new eBay guide from related.py, the bulk and Shopify guides, and remove-bg-alternative. Add a short "check whether a printed code will expire" section to why-did-my-qr-code-stop-working. Fix anything HN commenters report, if Vedant logs it. Re-verify remove.bg facts if a fetch succeeds.

**Backlog after this week:** Poshmark/Depop/Vinted/Mercari guides (one per Tuesday), the yard sale sign or church bulletin ForeverQR guides, and the product ideas from Nov 6 (all need approval).

**Needs Vedant:** nothing new. Still open: the $9 price decision; this log and LAUNCH.md are probably readable by URL (Nov 5); GoatCounter numbers can't be read from the sandbox.

## 2026-11-10 (Tue) — New Peelo guide

**Published (live on main):** https://hyphenatesi.com/peelo/ebay-white-background-photos/ — "White background eBay photos, without installing an app" (~600 words of body plus steps and 5 FAQs). Added to related.py, the Peelo #guides list, the homepage hub and peelo/sitemap.xml (lastmod today; also bumped / and /peelo/ lastmod and the sitemap index).

**Sources (opened today, not snippets):** eBay picture policy (id=4370: ≥500 px longest side; no added borders, text or watermarks), eBay "Adding pictures" help (id=4148: ~1600×1600 recommended, up to 24 photos, 12 MB each, formats incl. HEIC/WebP, "White backgrounds are generally best", darker background for shiny items, background tool on web listing tool and app), eBay Seller Center photo tips. The eBay Community Background Removal FAQ failed to load, so nothing from it is used.

**Honesty notes in the page:** says plainly that eBay's built-in tool is quickest for phone listers; pitches Peelo for crosslisting, manual edge fixes, batch and no-app use. Batch Max size is described as a cap (it never upscales). No price written in the new page (says "one-time purchase"), so it won't need editing if Batch Pro goes to $9.

**Checks:** 33 pages crawled from / — no broken links, JSON-LD parses, no 390px horizontal scroll, all in sitemaps, GoatCounter on every page, title/meta limits OK. Sitemaps parse. No JS changed.

**Metrics:** not attempted (GoatCounter unreachable from the sandbox on every run so far).

**Backlog / next:** Thursday — link the eBay guide from the Amazon, Shopify and bulk guides' related lists (currently it only links out; it's reachable via the full guide lists and hub). Next Tuesday candidates: Poshmark, then Mercari/Depop/Vinted (open each platform's official photo help first).

**Needs Vedant:** nothing new. Show HN is today per the plan. Still open: $9 price decision; log/LAUNCH.md readable by URL.

## 2026-11-10 (Tue evening) — GoatCounter numbers pasted by Vedant

Range Oct 19 – Nov 10: **46 visits** total. Pages: / 18, /peelo 11, /foreverqr 2, /peelo/remove-background-car-photo 2, /peelo/linkedin-headshot-background 2, /peelo/remove-bg-alternative 2, /peelo/white-background-amazon-product-photo 1 (list truncated; 43 of 46 shown). Events: batch-open 2, upgrade-click 2, cutout-done 1. Referrers: unknown 25, Google 2. Systems: macOS 32, Windows 7, iOS 5, Chrome OS 1, Linux 1. Sizes: phones 5, tablets/large phones 6, monitors 35. Locations: US 44, India 2. Much of the macOS/Chrome traffic is probably Vedant's own testing. This is the baseline for next Monday's comparison.

**Bug report (Vedant, iPhone Safari):** photo picker "didn't work" and an error message on Peelo. Likely cause: Safari doesn't expose navigator.deviceMemory, so pickModel() in segment.js always picks the 91 MB IS-Net model on iPhones (~1 GB working memory), and prewarm() starts loading it on touchstart, before the picker even opens. Proposed fix: Fast model by default on iOS/iPadOS, no prewarm until a file is chosen, Fast-mode toggle still lets people pick best quality. Awaiting Vedant's test of /peelo/?model=fast and his approval (segment.js change).

## 2026-11-11 (Wed) — New ForeverQR guide

**Published (live on main):** https://hyphenatesi.com/foreverqr/product-packaging-qr-code/ — "QR codes on product packaging" (~850 words of body plus steps and 4 FAQs). Covers static vs dynamic, linking to a short path/redirect on your own domain, UTM tags, size (2 cm floor for short links, bigger on kraft/curves), quiet zone, dark-on-light, seams/folds/gloss, error-correction choice, printed-proof testing, and a "this isn't the checkout barcode" section on GS1 Sunrise 2027 (no claim that ForeverQR makes GS1 Digital Link codes). Cross-links to Peelo. Added to every ForeverQR guide's "More guides" grid, the foreverqr/ guide list, the homepage hub and foreverqr/sitemap.xml (lastmod today; also bumped /, /foreverqr/ and the sitemap index).

**Sources (opened today via fetch):** Scantrust printing/placement best practices (1–2 cm on consumer packs, dark on light, flat surfaces, test on final product); QRStuff round-bottle guide (20 mm on curves, flattest part, never across a seam; marketing content, used only for practical tips); GS1 2024 industry endorsement statement (end-2027 aim, adoption voluntary, read alongside 1D); Esko Sunrise 2027 guide (not a legal mandate; coexists with UPC/EAN). Keyence, Bitly and GA links reused from the real-estate guide.

**Checks:** 34 pages crawled from / — no broken links, JSON-LD parses, no 390px horizontal scroll, all in sitemaps, GoatCounter on every page, title/meta limits OK. Sitemaps parse. No JS changed.

**Metrics:** not attempted (GoatCounter unreachable from the sandbox).

**Backlog / next:** Thursday as planned — link the eBay guide from Amazon/Shopify/bulk related lists; add a "will my printed code expire?" check section to why-did-my-qr-code-stop-working. Future Wednesdays: yard sale sign, church bulletin, food truck menu.

**Needs Vedant:** nothing new. Still open: iPhone Peelo fix (segment.js, awaiting approval), $9 price decision, log/LAUNCH.md readable by URL.

## 2026-11-12 (Thu) — Improve what exists

**Did (live on main):**
- Peelo: the eBay guide had no inbound "Related guides" links. Added it to the related lists of the Amazon, Shopify and bulk guides (related.py; Amazon dropped Etsy, Shopify dropped bulk, bulk dropped Shopify; each of those still has other inbound links). Regenerated; only those 3 pages changed.
- ForeverQR: added a "Check your other printed codes now" section to why-did-my-qr-code-stop-working (scan every printed code; own-site/Wi-Fi/contact = can't be switched off; provider short link = replace first, before the plan ends). It links to the existing step-by-step check on qr-code-that-never-expires, which now has an anchor (#check). This covers the "will my printed code expire?" idea without a duplicate page. Swapped that page's third related link from real estate to the new packaging guide.
- Sitemaps: lastmod 2026-11-12 for the 4 changed pages and the peelo/foreverqr entries in the sitemap index.

**Checks:** 35 pages crawled from / — no broken links (the one 404 was the checker treating vendor/LICENSES.md as a folder; the file exists), JSON-LD parses, no 390px scroll, all indexable pages in sitemaps, GoatCounter everywhere, title/meta limits OK. All 4 sitemaps parse. No JS changed.

**Metrics:** not attempted (GoatCounter unreachable from the sandbox). Baseline is Vedant's Nov 10 paste.

**Not verified:** remove.bg facts not re-checked this run; the 1 Dec 9:00 CET wording still rests on the Oct 29 check and Photoroom's Oct 29 post.

**Backlog / next:** Fri scan (re-check threads #4–5 from Nov 6). Next Tue: Poshmark guide (open Poshmark's official photo help first). Next Thu idea: a short "after 1 Dec" refresh of remove-bg-shutting-down once the date passes (change tense, keep URL).

**Needs Vedant:** nothing new. Still open: iPhone Peelo fix (segment.js, awaiting approval), $9 price decision, log/LAUNCH.md readable by URL.

## 2026-11-13 (Fri) — Distribution + market scan

**Published:** nothing (Friday is scan-only). Checks still run before pushing this log: 35 pages crawled from /, no problems; all 4 sitemaps parse.

**Metrics:** not attempted (GoatCounter unreachable from the sandbox). Baseline remains Vedant's Nov 10 paste.

**Threads (Vedant posts; nothing posted by the agent).** Thin week: search results are almost all SEO blog posts, and Reddit, t-shirtforums (robots.txt) and the Church Tech forum all failed to load. Only 2 new threads were usable, both older and low-traffic, so I'm not padding to 5. Last week's #1 (Shopify) and #2 (eBay "Best app for white background photos") are still the best ones to post on if not done yet.

1. eBay Community, "photo back ground is white needed" (~9 months old, 19 comments, no lock visible): https://community.ebay.com/forum/selling-57920/topic/photo-back-ground-is-white-needed-156571/
   Asker isn't sure white is best because some items look bad on it. Others suggested Photoroom, neutral fabric, cardboard, a white counter.
   Suggested reply: "White is safest for the main photo, but you don't have to shoot on white. Shoot on whatever makes the item look good, then swap the background afterwards. I made a free browser tool for that, Peelo (https://hyphenatesi.com/peelo/): drop in a photo, and the JPG download comes out on white (or any colour you pick), at full resolution, no signup or watermark. For shiny or white items, eBay's own help suggests a darker background, so keep a few non-white shots too. I wrote up the eBay specifics here: https://hyphenatesi.com/peelo/ebay-white-background-photos/"
   → It's old; only worth posting if the thread still gets views. Low priority.
2. Adobe Community, "Remove BG" (Adobe Express; asked Sep 2023, last reply Nov 2025, no lock visible): https://community.adobe.com/questions-329/remove-bg-1220821
   An expert already linked Express's Quick Action. Reply only as an alternative.
   Suggested reply: "If the Quick Action isn't working for you (it needs JavaScript and a supported browser), another option: I made Peelo (https://hyphenatesi.com/peelo/), a free remover that runs entirely in the browser. No account, nothing uploaded, full-resolution PNG back. Express's built-in one is still the easiest if you're already editing there."
   → Low priority; Adobe's forum may treat this as off-topic promotion.
- Not usable: Adobe "Free QR Code stopped working suddenly" (1468437) and "QR Code generator" (1221528) are both closed to replies; Adobe Aero "None of my QR codes are working" is about AR codes, not ForeverQR's use case.

**Competitor moves:**
- **BatchBG (batchbg.com, page "last updated Sept 2026"): free, unlimited, in-browser batch background removal** — WASM, no upload, no signup, Amazon/Etsy/Shopify white-background presets (2000×2000, 85% fill), "Batch processing will always be free". Its own claims, not verified. This directly undercuts Peelo's paid Batch Pro and is relevant to the pending $19 vs $9 decision. Peelo's remaining edges: IS-Net quality model with WebGPU, 16 MP output, text cleanup, uncertain-region fill. Worth a side-by-side test on 5 hard photos (hair, glass, white-on-white) before deciding price.
- Improve Photography (Oct 26, sponsored by Designkit, opened): "remove.bg alternatives after the move" listing 12 tools. Says the standalone site shuts down Dec 1, 2026 (no time given). Consistent with our wording; remove.bg/pricing itself still couldn't be fetched (permission timeout), so the 9:00 CET detail still rests on Oct 29.
- More "I built a free alternative" posts (dev.to, financialcontent press releases). The shutdown query is saturated; Peelo should compete on reseller/marketplace long-tail, not "remove.bg alternative".

**Product ideas (ranked, all need Vedant's approval):**
1. Marketplace presets in batch (eBay/Poshmark square, Depop 4:5, Amazon 2000×2000 at 85% fill). BatchBG has these for free; Peelo needs parity for reseller traffic. (Same as Nov 6 #1, now more urgent.)
2. Reconsider Batch Pro: lower price ($9) or raise the free batch limit above 3, given free unlimited competitors. Pricing is Vedant's call.
3. iPhone fix (Fast model by default on iOS, no prewarm) — still awaiting approval; phone resellers are the target audience.

**Next:** Tue — Poshmark guide (open Poshmark's own photo help first). Thu after Dec 1 — update remove-bg-shutting-down tense.

**Needs Vedant:** BatchBG offers free unlimited in-browser batch — input for the $9 decision. Still open: iPhone Peelo fix (segment.js), log/LAUNCH.md readable by URL.
