#!/usr/bin/env python3
"""Pre-push site checks for hyphenatesi.com (used by the daily growth agent).

Usage, from the repo root:  python3 tools/site_check.py [port]
Serves the repo locally, crawls every internal page reachable from /, and checks:
broken internal links, JSON-LD parses, no horizontal scroll at 390px,
every indexable page is in a sitemap, GoatCounter snippet present,
title <= 60 chars, meta description <= 155 chars, sitemaps parse as XML.
Exits non-zero if anything fails.
"""
import json, os, subprocess, sys, time, urllib.parse, xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 18947
BASE = f"http://127.0.0.1:{PORT}"
SITE = "https://hyphenatesi.com"
GC = 'data-goatcounter="https://hyphenatesi.goatcounter.com/count"'
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
problems = []

# Sitemaps
sitemap_urls = set()
def read_sitemap(path):
    try:
        tree = ET.parse(path)
    except ET.ParseError as e:
        problems.append(f"sitemap does not parse: {path}: {e}"); return
    root = tree.getroot()
    for loc in root.iter(NS + "loc"):
        u = loc.text.strip()
        if root.tag == NS + "sitemapindex":
            p = urllib.parse.urlparse(u).path.lstrip("/")
            read_sitemap(os.path.join(ROOT, p))
        else:
            sitemap_urls.add(urllib.parse.urlparse(u).path)
read_sitemap(os.path.join(ROOT, "sitemap.xml"))
for extra in ("peelo/sitemap.xml", "foreverqr/sitemap.xml", "sitemap-pages.xml"):
    if os.path.exists(os.path.join(ROOT, extra)):
        read_sitemap(os.path.join(ROOT, extra))

srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
                       cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.0)
try:
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        ctx = br.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        seen, queue, pages = set(), ["/"], 0
        while queue:
            path = queue.pop(0)
            if path in seen: continue
            seen.add(path)
            local = os.path.join(ROOT, urllib.parse.unquote(path).lstrip("/"))
            if path.endswith("/"): local = os.path.join(local, "index.html")
            if not os.path.exists(local):
                problems.append(f"broken link target: {path}"); continue
            if not local.endswith(".html"): continue
            pages += 1
            page.goto(BASE + path, wait_until="domcontentloaded")
            page.wait_for_timeout(150)
            html = open(local, encoding="utf-8").read()
            if GC not in html: problems.append(f"no GoatCounter: {path}")
            title = page.title()
            if len(title) > 60: problems.append(f"title {len(title)} chars: {path}")
            desc = page.eval_on_selector('meta[name="description"]', "e => e.content") if page.query_selector('meta[name="description"]') else ""
            if len(desc) > 155: problems.append(f"meta desc {len(desc)} chars: {path}")
            for block in page.eval_on_selector_all('script[type="application/ld+json"]', "els => els.map(e => e.textContent)"):
                try: json.loads(block)
                except Exception as e: problems.append(f"bad JSON-LD: {path}: {e}")
            if page.evaluate("document.documentElement.scrollWidth > window.innerWidth"):
                problems.append(f"horizontal scroll at 390px: {path}")
            robots = page.eval_on_selector('meta[name="robots"]', "e => e.content") if page.query_selector('meta[name="robots"]') else ""
            if "noindex" not in robots.lower() and path not in sitemap_urls and not path.endswith(("privacy.html", "terms.html")):
                problems.append(f"not in any sitemap: {path}")
            for href in page.eval_on_selector_all("a[href]", "els => els.map(e => e.getAttribute('href'))"):
                u = urllib.parse.urljoin(BASE + path, href)
                if u.startswith(SITE): u = BASE + u[len(SITE):]
                if not u.startswith(BASE): continue
                p = urllib.parse.urlparse(u).path or "/"
                if p not in seen: queue.append(p)
        br.close()
finally:
    srv.terminate()

print(f"{pages} pages crawled, {len(sitemap_urls)} sitemap URLs")
for p in problems: print("PROBLEM:", p)
print("OK" if not problems else f"{len(problems)} problem(s)")
sys.exit(1 if problems else 0)
