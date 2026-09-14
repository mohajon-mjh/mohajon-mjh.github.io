import re, json

# Return Policy এবং Shipping Details
RETURN_POLICY = '"hasMerchantReturnPolicy":{"@type":"MerchantReturnPolicy","applicableCountry":"BD","returnPolicyCategory":"https://schema.org/MerchantReturnFiniteReturnWindow","merchantReturnDays":7,"returnMethod":"https://schema.org/ReturnByMail","returnFees":"https://schema.org/ReturnShippingFees"}'

SHIPPING = '"shippingDetails":{"@type":"OfferShippingDetails","shippingRate":{"@type":"MonetaryAmount","value":170,"currency":"BDT"},"shippingDestination":{"@type":"DefinedRegion","addressCountry":"BD"},"deliveryTime":{"@type":"ShippingDeliveryTime","handlingTime":{"@type":"QuantitativeValue","minValue":0,"maxValue":1,"unitCode":"d"},"transitTime":{"@type":"QuantitativeValue","minValue":2,"maxValue":5,"unitCode":"d"}}}'

# product_schema.js ফাইল আপডেট
with open("product_schema.js", "r", encoding="utf-8") as f:
    js = f.read()

# offers অবজেক্টে return policy এবং shipping যোগ
js = re.sub(
    r'"offers":\s*\{[^}]*"url":url\s*\}',
    '"offers":{"@type":"Offer","price":p.price||0,"priceCurrency":"BDT","availability":"https://schema.org/InStock","url":url,' + RETURN_POLICY + ',' + SHIPPING + '}',
    js
)

# description fallback যোগ (Firebase থেকে না আসলে hardcoded text)
js = js.replace(
    '"description":p.description||""',
    '"description":p.description||(p.title+" - High quality product from Mohajon MJH Market Place. Cash on delivery available all over Bangladesh.")'
)

with open("product_schema.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ product_schema.js updated")

# product-details.html ফাইল আপডেট (যদি injected schema থাকে)
with open("product-details.html", "r", encoding="utf-8") as f:
    html = f.read()

if "product-schema" in html:
    # offers অবজেক্টে return policy এবং shipping যোগ
    html = re.sub(
        r'"offers":\s*\{[^}]*"url":url\s*\}',
        '"offers":{"@type":"Offer","price":p.price||0,"priceCurrency":"BDT","availability":"https://schema.org/InStock","url":url,' + RETURN_POLICY + ',' + SHIPPING + '}',
        html
    )
    
    # description fallback যোগ
    html = html.replace(
        '"description":p.description||""',
        '"description":p.description||(p.title+" - High quality product from Mohajon MJH Market Place. Cash on delivery available all over Bangladesh.")'
    )
    
    with open("product-details.html", "w", encoding="utf-8") as f:
        f.write(html)
    
    print("✅ product-details.html updated")
else:
    print("ℹ️ product-details.html already clean")

print("\n🎉 সব ঠিক হয়ে গেছে! এখন git push করুন।")
