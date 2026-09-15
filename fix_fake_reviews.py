import re
import shutil
from datetime import datetime

print("=" * 70)
print("🔧 REMOVING FAKE REVIEWS SYSTEM")
print("=" * 70)

backup = f"product-details.html.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}_reviews"
shutil.copy("product-details.html", backup)
print(f"\n✅ Backup created: {backup}")

with open("product-details.html", "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Remove default fake rating/reviews (4.3 / 2700)
print("\n🔧 Fix 1: Removing default fake rating (4.3) and reviews (2700)...")
old = 'var rating=+P.rating||4.3,reviews=+P.reviews||2700;'
new = 'var rating=+P.rating||0,reviews=+P.reviews||0;'
if old in content:
    content = content.replace(old, new)
    print("   ✅ Default fake values removed (now 0 if no real data)")
else:
    print("   ⚠️  Pattern not found")

# Fix 2: Rating bar shows only if real reviews exist
print("\n🔧 Fix 2: Rating bar conditional (only real reviews)...")
old_bar = '\'<div class="rating-bar"><span class="stars">\'+stars(rating)+\'</span><span class="count">\'+rating.toFixed(1)+\' (\'+reviews.toLocaleString()+\' reviews)</span></div>\'+\''
new_bar = '\'(reviews>0?\'<div class="rating-bar"><span class="stars">\'+stars(rating)+\'</span><span class="count">\'+rating.toFixed(1)+\' (\'+reviews.toLocaleString()+\' reviews)</span></div>\':\'<div class="rating-bar"><span class="count" style="color:#565959;font-size:13px">⭐ নতুন পণ্য — এখনো রিভিউ আসেনি</span></div>\')+\'
if old_bar in content:
    content = content.replace(old_bar, new_bar)
    print("   ✅ Rating bar now shows only with real reviews")
else:
    print("   ⚠️  Rating bar pattern not found")

# Fix 3: Remove fake mjhReviews script (generated fake names/texts)
print("\n🔧 Fix 3: Removing fake review generator script...")
pattern = r'<script>/\*mjhReviews v1\*/.*?</script>'
if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    print("   ✅ Fake review generator removed")
else:
    print("   ⚠️  mjhReviews script not found")

with open("product-details.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n" + "=" * 70)
print("✅ FAKE REVIEWS REMOVED!")
print("=" * 70)
print(f"\n💾 Backup: {backup}")

