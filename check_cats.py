import json, urllib.request
d = json.load(urllib.request.urlopen("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json")) or {}
cats = {}
for pid, p in d.items():
    c = p.get("categoryId") or "NO-CATEGORY"
    cats[c] = cats.get(c, 0) + 1
print("TOTAL PRODUCTS:", len(d))
for c, n in sorted(cats.items(), key=lambda x: -x[1])[:20]:
    print(str(n).rjust(4), " ", c)
