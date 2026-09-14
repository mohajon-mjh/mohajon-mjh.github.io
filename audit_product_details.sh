#!/bin/bash
echo "=========================================="
echo "📊 PRODUCT-DETAILS.HTML AUDIT REPORT"
echo "=========================================="
echo ""
echo "📄 ফাইলের সাইজ:"
wc -l product-details.html
echo ""
echo "📦 HEAD SECTION (first 100 lines):"
echo "------------------------------------------"
head -100 product-details.html
echo ""
echo "⚙️ ALL SCRIPT TAGS:"
echo "------------------------------------------"
grep -n "<script" product-details.html
echo ""
echo "📁 RELATED JS FILES:"
echo "------------------------------------------"
ls -la *.js 2>/dev/null | grep -i "product" || echo "No product JS files found"
echo ""
echo "🎨 CSS CLASSES (first 40):"
echo "------------------------------------------"
grep -n "class=" product-details.html | head -40
echo ""
echo "📜 PRODUCT-DETAILS.JS (if exists):"
echo "------------------------------------------"
if [ -f "product-details.js" ]; then
  cat product-details.js
else
  echo "❌ product-details.js not found"
fi
echo ""
echo "🔍 ADDITIONAL CHECKS:"
echo "------------------------------------------"
echo "Total <script> tags: $(grep -c "<script" product-details.html)"
echo "Total <link> tags: $(grep -c "<link" product-details.html)"
echo "Has Firebase config: $(grep -c "firebase" product-details.html)"
echo "Has price display: $(grep -c "price" product-details.html)"
echo "Has discount logic: $(grep -c "discount" product-details.html)"
echo ""
echo "=========================================="
echo "✅ AUDIT COMPLETE"
echo "=========================================="
