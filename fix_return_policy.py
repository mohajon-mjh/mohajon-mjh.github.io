import shutil
from datetime import datetime

print("=" * 70)
print("🔧 FIXING: returnShippingFeesAmount (Google Search Console)")
print("=" * 70)

backup = f"product-details.html.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}_return"
shutil.copy("product-details.html", backup)
print(f"\n✅ Backup: {backup}")

with open("product-details.html", "r", encoding="utf-8") as f:
    content = f.read()

# Old (customer pays return shipping)
old = '"returnFees":"https://schema.org/ReturnShippingFees"'

# New (free return - Google compliant, customer friendly)
new = '"returnFees":"https://schema.org/FreeReturn"'

if old in content:
    content = content.replace(old, new)
    print("✅ Fixed: ReturnShippingFees → FreeReturn")
    
    with open("product-details.html", "w", encoding="utf-8") as f:
        f.write(content)
    
    print("\n" + "=" * 70)
    print("✅ FIX COMPLETE!")
    print("=" * 70)
    print("\n📋 Next:")
    print("   1. git add + commit + push")
    print("   2. Search Console এ 'Validate Fix' click করুন")
    print("   3. ১-২ দিন অপেক্ষা করুন")
else:
    print("❌ Pattern not found")

