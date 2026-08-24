#!/bin/bash

echo "🔄 === SITEMAP SYNC START ==="
echo ""

# Step 1: Firebase থেকে sitemap regenerate
echo "📡 Step 1: Firebase থেকে products fetch করছি..."
node -e '
const https=require("https");
const fs=require("fs");
https.get("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json",res=>{
 let d="";res.on("data",c=>d+=c);res.on("end",()=>{
  const p=JSON.parse(d),ids=Object.keys(p);
  let x="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
  x+="  <url><loc>https://mohajon-mjh.github.io/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n";
  ids.forEach(id=>{x+=`  <url><loc>https://mohajon-mjh.github.io/product-details.html?id=${id}</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>\n`;});
  x+="</urlset>\n";
  fs.writeFileSync("sitemap.xml",x);
  console.log("✅ Sitemap updated:",ids.length+1,"URLs (home + products)");
 });
});'

echo ""
echo "📝 Step 2: Git-এ add করছি..."
git add sitemap.xml

echo ""
echo "💾 Step 3: Commit করছি..."
COUNT=$(grep -c "<loc>" sitemap.xml)
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git commit -m "Sitemap sync: ${COUNT} URLs ($TIMESTAMP)" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Commit সম্পন্ন"
  echo ""
  echo "🚀 Step 4: GitHub-এ push করছি..."
  git push
  if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 === ALL DONE! ==="
    echo "📊 Total URLs: $COUNT"
    echo "🕐 Time: $TIMESTAMP"
    echo "✅ Sitemap live: https://mohajon-mjh.github.io/sitemap.xml"
  else
    echo "❌ Push failed!"
  fi
else
  echo "⏭️ কোনো পরিবর্তন নেই — sitemap already up-to-date"
fi
