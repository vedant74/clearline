# Peelo guide pages generator

`python3 gen_guides.py` regenerates every `/peelo/<slug>/index.html` from `pages.py` + `pages_new.py`.
Edit content in those files, not in the generated HTML (hand edits are overwritten).
After adding a page: add it to `/peelo/index.html` (#guides list), `/index.html` (homepage hub)
and `/peelo/sitemap.xml`.
