import json
import urllib.request
from datetime import datetime

DB = "https://mohajon-mjh-default-rtdb.firebaseio.com"

print("🔧 Generating sitemap.xml...")

# Fetch products
products = json.load(urllib.request.urlopen(f"{DB}/products.json", timeout=60))

# Build sitemap
sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

# Static pages
static_pages = [
    "/",
    "/products.html",
    "/about.html",
    "/contact.html",
    "/privacy.html",
    "/terms.html",
]

for page in static_pages:
    sitemap.append(f'  <url>')
    sitemap.append(f'    <loc>https://mohajon-mjh.github.io{page}</loc>')
    sitemap.append(f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
    sitemap.append(f'    <changefreq>daily</changefreq>')
    sitemap.append(f'    <priority>1.0</priority>')
    sitemap.append(f'  </url>')

# Product pages
for pid, p in products.items():
    if p.get('status') == 'active':
        sitemap.append(f'  <url>')
        sitemap.append(f'    <loc>https://mohajon-mjh.github.io/product-details.html?id={pid}</loc>')
        sitemap.append(f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
        sitemap.append(f'    <changefreq>weekly</changefreq>')
        sitemap.append(f'    <priority>0.8</priority>')
        sitemap.append(f'  </url>')

sitemap.append('</urlset>')

# Save
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(sitemap))

print(f"✅ Sitemap generated: sitemap.xml")
print(f"   • Static pages: {len(static_pages)}")
print(f"   • Product pages: {len([p for p in products.values() if p.get('status') == 'active'])}")
print(f"   • Total URLs: {len(static_pages) + len([p for p in products.values() if p.get('status') == 'active'])}")

