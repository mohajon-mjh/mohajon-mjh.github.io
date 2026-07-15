import json

d1 = json.load(open('data/products.json'))
d2 = json.load(open('data/products-placeholder.json'))

all_skus = []
for v in d1.values():
    s = v.get('sku','')
    if s.startswith('p') and s[1:].isdigit():
        all_skus.append(int(s[1:]))
for v in d2.values():
    s = v.get('sku','')
    if s.startswith('p') and s[1:].isdigit():
        all_skus.append(int(s[1:]))

print("Max SKU number found:", max(all_skus))
print("Next available:", max(all_skus)+1)
print("Total unique SKUs:", len(set(all_skus)))
print("Total entries checked:", len(all_skus))
