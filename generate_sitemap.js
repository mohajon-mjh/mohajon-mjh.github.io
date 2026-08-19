const fs=require("fs");
const https=require("https");
const URL="https://mohajon-mjh-default-rtdb.firebaseio.com/products.json";

https.get(URL,(res)=>{
 let d="";
 res.on("data",c=>d+=c);
 res.on("end",()=>{
  const o=JSON.parse(d);
  const base="https://mohajon-mjh.github.io";
  let xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Main pages
  xml+=`  <url><loc>${base}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n`;
  xml+=`  <url><loc>${base}/products.html</loc><priority>0.9</priority><changefreq>daily</changefreq></url>\n`;
  
  // Product pages
  Object.keys(o).forEach(id=>{
   xml+=`  <url><loc>${base}/product-details.html?id=${id}</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>\n`;
  });
  
  xml+="</urlset>";
  fs.writeFileSync("sitemap.xml",xml);
  console.log("✅ sitemap.xml generated with",Object.keys(o).length,"products");
  console.log("Size:",(xml.length/1024).toFixed(1),"KB");
 });
});
