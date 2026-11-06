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
