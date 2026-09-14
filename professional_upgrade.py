import os
import shutil
import re
from datetime import datetime

print("=" * 60)
print("🚀 PROFESSIONAL PRODUCT PAGE UPGRADE")
print("=" * 60)

# Backup তৈরি
backup_file = f"product-details.html.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
shutil.copy("product-details.html", backup_file)
print(f"\n✅ Backup created: {backup_file}")

# product-details.html পড়া
with open("product-details.html", "r", encoding="utf-8") as f:
    content = f.read()

# STEP 1: Duplicate mjhRelatedProducts script সরানো (line 738)
print("\n🔧 STEP 1: Removing duplicate related products script...")
pattern = r'<script>/\*mjhRelatedProducts\*/.*?</script>'
if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    print("   ✅ Removed duplicate mjhRelatedProducts script")
else:
    print("   ⚠️  mjhRelatedProducts script not found")

# STEP 2: Discount logic standardization
print("\n🔧 STEP 2: Standardizing discount logic...")
# Find the render function and update discount calculation
old_discount_logic = r'var price=\+P\.price\|\|0,old=\+P\.discountPrice\|\|0;\s+var hasOld=old>0&&old>price;\s+var disc=hasOld\?Math\.round\(\(1-price/old\)\*100\):0;'

new_discount_logic = '''var price=+P.price||0;
 var discountPercent=+P.discountPercent||0;
 var old=+P.discountPrice||0;
 var hasOld=false;
 var disc=0;
 if(discountPercent>0){
   old=price/(1-discountPercent/100);
   hasOld=true;
   disc=discountPercent;
 } else if(old>0&&old>price){
   hasOld=true;
   disc=Math.round((1-price/old)*100);
 }'''

if re.search(old_discount_logic, content):
    content = re.sub(old_discount_logic, new_discount_logic, content)
    print("   ✅ Discount logic standardized (supports both discountPrice and discountPercent)")
else:
    print("   ⚠️  Could not find discount logic to update")

# STEP 3: Professional image zoom enhancement
print("\n🔧 STEP 3: Adding professional image zoom...")
zoom_css = '''
.main-img img:hover {
  transform: scale(1.8) !important;
  cursor: zoom-in;
  transition: transform 0.3s ease;
  z-index: 1000;
  position: relative;
}

.zoom-hint {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  pointer-events: none;
}
'''

if '.main-img img:hover' not in content:
    content = content.replace('</style>', zoom_css + '\n</style>')
    print("   ✅ Added professional image zoom (hover to zoom)")
else:
    print("   ⚠️  Image zoom already exists")

# STEP 4: Professional breadcrumb enhancement
print("\n🔧 STEP 4: Enhancing breadcrumb...")
old_crumb = '<div class="crumb">Home › Products › <span id="crumbTitle">Product</span></div>'
new_crumb = '<div class="crumb" style="font-size:12px;color:#565959;margin-bottom:10px"><a href="index.html" style="color:#007185;text-decoration:none">🏠 Home</a> <span style="color:#ccc;margin:0 8px">›</span> <a href="products.html" style="color:#007185;text-decoration:none">Products</a> <span style="color:#ccc;margin:0 8px">›</span> <span id="crumbCat" style="color:#565959"></span> <span style="color:#ccc;margin:0 8px">›</span> <span id="crumbTitle" style="color:#111;font-weight:500">Product</span></div>'

if old_crumb in content:
    content = content.replace(old_crumb, new_crumb)
    print("   ✅ Professional breadcrumb added with category link")
else:
    print("   ⚠️  Could not find breadcrumb to update")

# STEP 5: Update render function to populate category breadcrumb
print("\n🔧 STEP 5: Adding category to breadcrumb...")
crumb_update_old = 'document.getElementById("crumbTitle").textContent=(P.title||"Product").slice(0,30);'
crumb_update_new = '''document.getElementById("crumbTitle").textContent=(P.title||"Product").slice(0,30);
 var crumbCat=document.getElementById("crumbCat");
 if(crumbCat&&P.categoryId){
   var catName=P.categoryId.replace(/_/g,' ').replace(/\\b\\w/g,l=>l.toUpperCase());
   crumbCat.innerHTML='<a href="products.html?categoryId='+encodeURIComponent(P.categoryId)+'" style="color:#007185;text-decoration:none">'+catName+'</a>';
 }'''

if crumb_update_old in content:
    content = content.replace(crumb_update_old, crumb_update_new)
    print("   ✅ Category added to breadcrumb")
else:
    print("   ⚠️  Could not find breadcrumb update location")

# STEP 6: Add smooth scroll animations
print("\n🔧 STEP 6: Adding smooth animations...")
animation_css = '''
.related-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.btn-y, .btn-o {
  transition: all 0.2s ease;
}

.btn-y:hover, .btn-o:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.main-img img {
  transition: transform 0.3s ease;
}
'''

if '.related-card:hover' not in content:
    content = content.replace('</style>', animation_css + '\n</style>')
    print("   ✅ Added smooth hover animations")
else:
    print("   ⚠️  Animations already exist")

# STEP 7: Performance optimization - lazy loading
print("\n🔧 STEP 7: Adding performance optimizations...")
if 'loading="lazy"' not in content:
    content = content.replace('<img id="mainImg"', '<img id="mainImg" loading="lazy"')
    print("   ✅ Added lazy loading to main image")
else:
    print("   ⚠️  Lazy loading already exists")

# STEP 8: Add zoom hint
print("\n🔧 STEP 8: Adding zoom hint...")
zoom_hint = '''<div class="zoom-hint">🔍 Hover to zoom</div>'''
if 'zoom-hint' not in content:
    content = content.replace('<img id="mainImg"', zoom_hint + '<img id="mainImg"')
    print("   ✅ Added zoom hint overlay")
else:
    print("   ⚠️  Zoom hint already exists")

# Write updated content
with open("product-details.html", "w", encoding="utf-8") as f:
    f.write(content)

print("\n" + "=" * 60)
print("✅ UPGRADE COMPLETE!")
print("=" * 60)
print("\n📋 Changes made:")
print("   ✓ Removed duplicate related products script")
print("   ✓ Standardized discount logic (discountPercent + discountPrice)")
print("   ✓ Added professional image zoom (hover effect)")
print("   ✓ Enhanced breadcrumb with category link")
print("   ✓ Added smooth animations")
print("   ✓ Added performance optimizations")
print("   ✓ Added zoom hint overlay")
print(f"\n💾 Backup saved: {backup_file}")
print("\n🔄 Next steps:")
print("   1. Delete unused product-details.js (if needed)")
print("   2. Test the page")
print("   3. Git commit and push")

