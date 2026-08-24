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

# 1. Checkbox HTML (after মার্কেট প্রাইস field)
old1 = '<label>মার্কেট প্রাইস (ঐচ্ছিক, ৳) <input type="number" class="bulk-old-price" value="" placeholder="আসল বাজার দাম"></label>'
new1 = old1 + '\n        <label><input type="checkbox" class="bulk-flashsale"> ⚡ Flash Sale</label>\n        <label><input type="checkbox" class="bulk-trending"> 🔥 Trending</label>'
content, ok1 = replace_once(content, old1, new1, "Checkbox HTML")

# 2. Read checkbox values (after itemOldPrice read)
old2 = 'const itemOldPrice = itemOldPriceEl ? (parseFloat(itemOldPriceEl.value) || 0) : 0;'
new2 = old2 + '\n        const itemFlashSale = div.querySelector(".bulk-flashsale").checked;\n        const itemTrending = div.querySelector(".bulk-trending").checked;'
content, ok2 = replace_once(content, old2, new2, "Read checkbox values")

# 3a. Update block (existingKey)
old3 = '''            price: itemPrice,
              minPrice: itemPrice,
              maxPrice: itemMaxPrice,
              discountPrice: itemOldPrice,
              stock: itemStock,
              categoryId: itemCategoryId,
              description: itemDesc,
              status: "active",
              images: { main: imageUrl },
              updatedAt: Date.now()'''
new3 = old3.replace(
    'discountPrice: itemOldPrice,\n              stock: itemStock,',
    'discountPrice: itemOldPrice,\n              isFlashSale: itemFlashSale,\n              isTrending: itemTrending,\n              stock: itemStock,'
)
content, ok3 = replace_once(content, old3, new3, "Update block (existingKey)")

# 3b. Create block (new product)
old4 = '''title: itemTitle,
              price: itemPrice,
              minPrice: itemPrice,
              maxPrice: itemMaxPrice,
              discountPrice: itemOldPrice,
              stock: itemStock,'''
new4 = old4.replace(
    'discountPrice: itemOldPrice,\n              stock: itemStock,',
    'discountPrice: itemOldPrice,\n              isFlashSale: itemFlashSale,\n              isTrending: itemTrending,\n              stock: itemStock,'
)
content, ok4 = replace_once(content, old4, new4, "Create block (new product)")

with open("assets/js/admin.js", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
