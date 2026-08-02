with open("assets/js/admin.js", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def replace_once(content, old, new, label):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: ঠিক হয়েছে")
    return content, True

# 1. Form fields HTML
old1 = '''<label>সর্বনিম্ন দাম (৳) <input type="number" class="bulk-price" value="${price}"></label>
        <label>সর্বোচ্চ দাম (৳) <input type="number" class="bulk-price-max" value="${price}"></label>
        <label>মার্কেট প্রাইস (ঐচ্ছিক, ৳) <input type="number" class="bulk-old-price" value="" placeholder="আসল বাজার দাম"></label>'''
new1 = '''<label>দাম (৳) <input type="number" class="bulk-price" value="${price}"></label>
        <label>মার্কেট প্রাইস (ঐচ্ছিক, ৳) <input type="number" class="bulk-old-price" value="" placeholder="আসল বাজার দাম"></label>'''
content, ok1 = replace_once(content, old1, new1, "Form fields HTML")

# 2. Read variables (per-card save)
old2 = '''const itemPrice = parseFloat(div.querySelector(".bulk-price").value) || 0;
        const itemMaxPriceEl = div.querySelector(".bulk-price-max");
        const itemMaxPrice = itemMaxPriceEl ? (parseFloat(itemMaxPriceEl.value) || itemPrice) : itemPrice;
        const itemOldPriceEl = div.querySelector(".bulk-old-price");'''
new2 = '''const itemPrice = parseFloat(div.querySelector(".bulk-price").value) || 0;
        const itemOldPriceEl = div.querySelector(".bulk-old-price");'''
content, ok2 = replace_once(content, old2, new2, "Read variables (per-card)")

# 3. Write block 1 - update existing
old3 = '''await update(ref(db, "products/"+existingKey), {
              price: itemPrice,
              minPrice: itemPrice,
              maxPrice: itemMaxPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,'''
new3 = '''await update(ref(db, "products/"+existingKey), {
              price: itemPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,'''
content, ok3 = replace_once(content, old3, new3, "Write block 1 - update")

# 4. Write block 1 - create new
old4 = '''await set(newRef, {
              title: itemTitle,
              price: itemPrice,
              minPrice: itemPrice,
              maxPrice: itemMaxPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,'''
new4 = '''await set(newRef, {
              title: itemTitle,
              price: itemPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,'''
content, ok4 = replace_once(content, old4, new4, "Write block 1 - create")

# 5. Read variables (Upload All batch)
old5 = '''const price = parseFloat(card.querySelector(".bulk-price").value) || 0;
          const maxPriceEl = card.querySelector(".bulk-price-max");
          const maxPrice = maxPriceEl ? (parseFloat(maxPriceEl.value) || price) : price;
          const stock = parseInt(card.querySelector(".bulk-stock").value) || 0;'''
new5 = '''const price = parseFloat(card.querySelector(".bulk-price").value) || 0;
          const stock = parseInt(card.querySelector(".bulk-stock").value) || 0;'''
content, ok5 = replace_once(content, old5, new5, "Read variables (Upload All)")

# 6. Write block 2 - update existing
old6 = '''await update(ref(db, "products/"+existingKey), {
              price: price,
              minPrice: price,
              maxPrice: maxPrice,
              stock: stock,'''
new6 = '''await update(ref(db, "products/"+existingKey), {
              price: price,
              stock: stock,'''
content, ok6 = replace_once(content, old6, new6, "Write block 2 - update")

# 7. Write block 2 - create new
old7 = '''const productData = {
              title: title,
              price: price,
              minPrice: price,
              maxPrice: maxPrice,
              stock: stock,'''
new7 = '''const productData = {
              title: title,
              price: price,
              stock: stock,'''
content, ok7 = replace_once(content, old7, new7, "Write block 2 - create")

with open("assets/js/admin.js", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
