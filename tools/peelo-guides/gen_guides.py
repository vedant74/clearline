#!/usr/bin/env python3
"""Generates /peelo/<slug>/index.html guide pages. Content lives in pages.py."""
import html, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pages import PAGES  # noqa: E402
from pages_new import NEW_PAGES  # noqa: E402
PAGES = PAGES + NEW_PAGES

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "peelo")
BASE = "https://hyphenatesi.com/peelo/"


def strip_tags(s):
    s = re.sub(r"<[^>]+>", "", s)
    return html.unescape(re.sub(r"\s+", " ", s)).strip()


def build(p):
    url = BASE + p["slug"] + "/"
    title, desc = p["title"], p["description"]
    assert len(title) <= 60, (p["slug"], len(title), title)
    assert len(desc) <= 155, (p["slug"], len(desc))
    faq_ld = {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": strip_tags(q),
                        "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}} for q, a in p["faqs"]],
    }
    crumbs_ld = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Peelo", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "Guides", "item": BASE + "#guides"},
            {"@type": "ListItem", "position": 3, "name": p["crumb"], "item": url},
        ],
    }
    cta = p["cta"]
    cta_html = (
        '<div class="cta-box">'
        f'<a class="btn primary" href="../{cta["href"]}">{cta["label"]}</a>'
        f'<p>{cta["note"]}</p></div>'
    )
    steps = "".join(f"<li>{s}</li>" for s in p["steps"])
    faqs = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in p["faqs"])
    sources = ""
    if p.get("sources"):
        items = "".join(f'<li><a href="{u}" rel="noopener nofollow">{html.escape(t)}</a>{(" – " + n) if n else ""}</li>'
                        for t, u, n in p["sources"])
        sources = f'<h2>Sources</h2><ul class="sources">{items}</ul><p class="sources">Checked {p.get("checked", "26 October 2026")}. Platform rules change, so confirm on the official page before you rely on them.</p>'
    others = "".join(f'<li><a href="../{o["slug"]}/">{o["crumb"]}</a></li>' for o in PAGES if o["slug"] != p["slug"])
    words = len(strip_tags(p["body"] + steps + faqs + p["lede"]).split())
    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#f6f3ee" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141311" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Peelo">
<meta property="og:title" content="{html.escape(p.get('og_title', title))}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../icons/apple-touch-icon.png">
<link rel="manifest" href="../manifest.webmanifest">
<link rel="stylesheet" href="../styles.css">
<script>try {{ var t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; }} catch (e) {{}}</script>
<script type="application/ld+json">
{json.dumps(faq_ld, ensure_ascii=False, indent=1)}
</script>
<script type="application/ld+json">
{json.dumps(crumbs_ld, ensure_ascii=False, indent=1)}
</script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="topbar">
  <a class="brand" href="../"><svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="3" width="26" height="26" rx="7" class="bm-bg"/><path d="M10 22c0-6 3-11 6-11s6 5 6 11z" class="bm-fg"/></svg><span>Peelo</span></a>
  <nav class="topnav">
    <a href="../">Open the tool</a>
    <a href="#more-guides">Guides</a>
    <button class="icon-btn" id="themeToggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/></svg>
    </button>
  </nav>
</header>

<main id="content" class="guide">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../">Peelo</a> › <a href="../#guides">Guides</a> › <span aria-current="page">{p["crumb"]}</span></nav>
  <article>
    <h1>{p["h1"]}</h1>
    <p class="lede">{p["lede"]}</p>
    {cta_html}
    {p["body"]}
    <h2 id="how-to">{p.get("steps_title", "How to do it with Peelo")}</h2>
    <ol class="steps">{steps}</ol>
    {p.get("after_steps", "")}
    {cta_html}
    <section class="faq">
      <h2>Questions</h2>
      {faqs}
    </section>
    {sources}
  </article>

  <section id="more-guides" class="more-guides">
    <h2>More guides</h2>
    <ul class="guide-grid">{others}</ul>
  </section>
</main>

<footer class="footer">
  <p><a href="../">Peelo</a> · <a href="../#guides">Guides</a> · <a href="../privacy.html">Privacy</a> · <a href="../terms.html">Terms</a></p>
  <p class="fine">Peelo is independent and not affiliated with remove.bg, Canva, Photoroom, Amazon, Etsy, Shopify or LinkedIn. Product names are trademarks of their owners.</p>
</footer>
<script src="../js/site.js"></script>
<script data-goatcounter="https://hyphenatesi.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</body>
</html>
"""
    out = os.path.join(ROOT, p["slug"])
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "index.html"), "w") as f:
        f.write(doc)
    return words


if __name__ == "__main__":
    for p in PAGES:
        w = build(p)
        print(f'{p["slug"]:45s} words={w:4d} title={len(p["title"])} desc={len(p["description"])}')
