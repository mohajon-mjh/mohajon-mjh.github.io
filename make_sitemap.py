import datetime
today = datetime.date.today().isoformat()

# আপনার সব static পেজ (same as before)
static_pages = [
    ("https://mohajon-mjh.github.io/", "daily", "1.0"),
    ("https://mohajon-mjh.github.io/about.html", "monthly", "0.7"),
    ("https://mohajon-mjh.github.io/products.html", "daily", "0.9"),
    ("https://mohajon-mjh.github.io/terms.html", "monthly", "0.5"),
    ("https://mohajon-mjh.github.io/privacy.html", "monthly", "0.5"),
]

# নতুন প্রোডাক্ট ID (p_mtx6...)
products = [
    ("p_mtx6rxj4h0ebh", "weekly", "0.8"),
    ("p_mtx6durbdm9wa", "weekly", "0.8"),
]

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for url, freq, pri in static_pages:
        f.write('  <url><loc>' + url + '</loc><lastmod>' + today + '</lastmod><changefreq>' + freq + '</changefreq><priority>' + pri + '</priority></url>\n')
    for pid, freq, pri in products:
        f.write('  <url><loc>https://mohajon-mjh.github.io/product-details.html?id=' + pid + '</loc><lastmod>' + today + '</lastmod><changefreq>' + freq + '</changefreq><priority>' + pri + '</priority></url>\n')
    f.write("</urlset>\n")

with open("sitemap-index.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    f.write("  <sitemap><loc>https://mohajon-mjh.github.io/sitemap.xml</loc><lastmod>" + today + "</lastmod></sitemap>\n")
    f.write("</sitemapindex>\n")

print("✅ নতুন sitemap তৈরি হয়েছে!")
print("📦 মোট URL:", len(static_pages) + len(products))
print("\n🛒 নতুন প্রোডাক্ট:")
for pid, _, _ in products:
    print("  →", pid)
