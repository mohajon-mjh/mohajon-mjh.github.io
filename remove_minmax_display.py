import io

def replace_once(content, old, new, label, report):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: ঠিক হয়েছে")
    return content, True

report = []

# --- index.html: 3 functions ---
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

for fn in ["renderFlashSaleCard", "renderTrendingCard", "renderDealCard"]:
    old = f'''function {fn}(id, data){{
  const price = parseFloat(data.price) || 0;
  const maxPrice = parseFloat(data.maxPrice) || 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(0);
  const priceDisplay = (maxPrice > price) ? `${{fmtP(price)}} - ${{fmtP(maxPrice)}}` : fmtP(price);'''
    new = f'''function {fn}(id, data){{
  const price = parseFloat(data.price) || 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(0);
  const priceDisplay = fmtP(price);'''
    html, ok = replace_once(html, old, new, f"index.html: {fn}", report)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

# --- product-render.js ---
with open("product-render.js", "r", encoding="utf-8") as f:
    pr = f.read()

old = '''const price = parseFloat(product.price) || 0;
        const maxPrice = parseFloat(product.maxPrice) || 0;
        const priceDisplay = (maxPrice > price) ? `${fmtPrice(price)} - ${fmtPrice(maxPrice)}` : fmtPrice(price);'''
new = '''const price = parseFloat(product.price) || 0;
        const priceDisplay = fmtPrice(price);'''
pr, ok = replace_once(pr, old, new, "product-render.js", report)

with open("product-render.js", "w", encoding="utf-8") as f:
    f.write(pr)

# --- product-details.js ---
with open("product-details.js", "r", encoding="utf-8") as f:
    pd = f.read()

old = '''function renderProduct(product){
  const price = parseFloat(product.price) || 0;
  const maxPrice = parseFloat(product.maxPrice) || 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(2);
  const priceDisplay = (maxPrice > price) ? `${fmtP(price)} - ${fmtP(maxPrice)}` : fmtP(price);'''
new = '''function renderProduct(product){
  const price = parseFloat(product.price) || 0;
  const fmtP = (v) => window.MJHCurrency ? window.MJHCurrency.formatPrice(v) : '৳'+v.toFixed(2);
  const priceDisplay = fmtP(price);'''
pd, ok = replace_once(pd, old, new, "product-details.js", report)

with open("product-details.js", "w", encoding="utf-8") as f:
    f.write(pd)

print("\n".join(report))
