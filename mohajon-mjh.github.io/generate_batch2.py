import json, os

BASE_PROJECT = os.path.expanduser("~/mohajon-mjh.github.io/assets/images/categories")

CATEGORY_MAP = {
    "Furniture (Sofas, Beds, etc.)": "furniture_sofas_beds_etc",
    "Gardening & Outdoor Living": "gardening_outdoor_living",
    "Gifts & Crafts": "gifts_crafts",
    "Headphones, Speakers & Audio": "headphones_speakers_audio",
    "Health & Medical Supplies": "health_medical_supplies",
    "Health & Wellness": "health_wellness",
    "Home & Kitchen": "home_kitchen",
    "Home Improvement, Tools & Hardware": "home_improvement_tools_hardware",
    "Industrial Machinery & Equipment": "industrial_machinery_equipment",
    "Jewelry, Eyewear & Watches": "jewelry_eyewear_watches",
}

existing = json.load(open(os.path.expanduser("~/mohajon-mjh.github.io/data/products-placeholder.json")))
existing_main = json.load(open(os.path.expanduser("~/mohajon-mjh.github.io/data/products.json")))

used_image_paths = set()
for v in existing.values():
    used_image_paths.add(v["images"]["main"])
if isinstance(existing_main, dict):
    for v in existing_main.values():
        used_image_paths.add(v["images"]["main"])
else:
    for v in existing_main:
        used_image_paths.add(v["images"]["main"])

def titleize(fname):
    name = fname.rsplit(".", 1)[0]
    name = name.replace("_", " ").replace("-", " ")
    words = name.split(" ")
    return " ".join(w.upper() if w.isdigit() and len(w) <= 2 else w.capitalize() for w in words)

sku_counter = 3035
new_products = {}
summary = {}

for folder, category_id in CATEGORY_MAP.items():
    dir_path = os.path.join(BASE_PROJECT, folder)
    if not os.path.isdir(dir_path):
        print(f"WARNING: folder not found: {dir_path}")
        continue

    files = sorted(f for f in os.listdir(dir_path) if f.lower().endswith(".png"))
    added = 0

    for fname in files:
        image_path = f"assets/images/categories/{folder}/{fname}"
        if image_path in used_image_paths:
            continue

        title = titleize(fname)
        sku = f"p{sku_counter:04d}"
        new_products[sku] = {
            "sellerId": "admin",
            "title": title,
            "description": f"{title} — product details to be completed by admin (image, description, and price pending).",
            "price": 100,
            "stock": 10,
            "categoryId": category_id,
            "netWeight": "",
            "status": "pending",
            "createdAt": 1782984093000,
            "updatedAt": 1782984093000,
            "images": {"main": image_path},
            "sku": sku
        }
        sku_counter += 1
        added += 1

    summary[category_id] = added

out_path = os.path.expanduser("~/mohajon-mjh.github.io/data/products-placeholder-batch2.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(new_products, f, ensure_ascii=False, indent=2)

print("=== SUMMARY ===")
for cat, count in summary.items():
    print(f"{cat}: {count} new products")
print(f"\nTotal new products: {len(new_products)}")
print(f"SKU range: p3035 to p{sku_counter-1:04d}")
print(f"Saved to: {out_path}")
