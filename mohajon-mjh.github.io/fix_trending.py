with open("index.html", encoding="utf-8") as f:
    html = f.read()

start_marker = "<!-- =========================================="
end_marker = '<div class="section">\n<h2>⭐ Deals Of The Day</h2>'

start_idx = html.find(start_marker)
end_idx = html.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("!!! মার্কার পাওয়া যায়নি, ম্যানুয়ালি চেক করুন")
else:
    before = html[:start_idx]
    after = html[end_idx:]
    replacement = '<div id="trendingProducts" class="products-trending">\n<div class="loading-placeholder">Loading...</div>\n</div>\n</div>\n\n'
    html = before + replacement + after
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Trending cards replaced with dynamic container.")
