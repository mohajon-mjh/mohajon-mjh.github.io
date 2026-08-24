with open("assets/js/admin.js", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def replace_once(content, old, new, label):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: যোগ হয়েছে")
    return content, True

# 1. Checkbox HTML
old1 = '<label><input type="checkbox" class="edit-featured" ${data.isFeatured ? "checked" : ""}> 🌟 Featured (Featured Products সেকশনে দেখাবে)</label>'
new1 = old1 + '\n      <label><input type="checkbox" class="edit-flashsale" ${data.isFlashSale ? "checked" : ""}> ⚡ Flash Sale (Flash Sale সেকশনে দেখাবে)</label>\n      <label><input type="checkbox" class="edit-trending" ${data.isTrending ? "checked" : ""}> 🔥 Trending (Trending Products সেকশনে দেখাবে)</label>'
content, ok1 = replace_once(content, old1, new1, "Checkbox HTML")

# 2. Read checkbox values
old2 = 'const newFeatured = div.querySelector(".edit-featured").checked;'
new2 = old2 + '\n        const newFlashSale = div.querySelector(".edit-flashsale").checked;\n        const newTrending = div.querySelector(".edit-trending").checked;'
content, ok2 = replace_once(content, old2, new2, "Read checkbox values")

# 3. Updates object
old3 = '          isFeatured: newFeatured,'
new3 = old3 + '\n          isFlashSale: newFlashSale,\n          isTrending: newTrending,'
content, ok3 = replace_once(content, old3, new3, "Updates object")

with open("assets/js/admin.js", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
