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
