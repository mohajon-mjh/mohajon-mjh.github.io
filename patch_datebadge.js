const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldStr = `    <div class="product-card-content">
      <h3 class="product-card-title">\${data.title || data.name || "Unnamed Product"}</h3>
      <div class="product-card-price">
        <span class="current-price">\${priceDisplay}</span>
        \${hasOldPrice ? \`<span class="old-price">\${oldPriceDisplay}</span>\` : ""}
      </div>
      <div class="product-card-actions" style="flex-direction:column">`;

const newStr = `    <div class="product-card-content">
      <h3 class="product-card-title">\${data.title || data.name || "Unnamed Product"}</h3>
      <div class="product-card-price">
        <span class="current-price">\${priceDisplay}</span>
        \${hasOldPrice ? \`<span class="old-price">\${oldPriceDisplay}</span>\` : ""}
      </div>
      \${dateRangeHTML}
      <div class="product-card-actions" style="flex-direction:column">`;

if(!html.includes(oldStr)){
  console.log("❌ oldStr (card content) মিলছে না");
  process.exit(1);
}
html = html.replace(oldStr, newStr);
console.log("✅ (১) কার্ডের HTML-এ dateRangeHTML বসানো হয়েছে");

const anchorStr = `  const stockBadge = stock <= 0`;
const anchorReplacement = `  let dateRangeHTML = "";
  if(mapInfo.startDate || mapInfo.endDate){
    let dateText = "";
    if(mapInfo.startDate && mapInfo.endDate){
      dateText = "⏰ অফার: " + mapInfo.startDate + " থেকে " + mapInfo.endDate + " পর্যন্ত";
    } else if(mapInfo.endDate){
      dateText = "⏰ অফার শেষ: " + mapInfo.endDate;
    } else if(mapInfo.startDate){
      dateText = "⏰ অফার শুরু: " + mapInfo.startDate;
    }
    dateRangeHTML = '<div class="offer-date-badge" style="font-size:11px;color:#e67e22;margin:4px 0;font-weight:600">' + dateText + '</div>';
  }

  const stockBadge = stock <= 0`;

if(!html.includes(anchorStr)){
  console.log("❌ anchorStr (stockBadge) মিলছে না");
  process.exit(1);
}
html = html.replace(anchorStr, anchorReplacement);
console.log("✅ (২) dateRangeHTML ভ্যারিয়েবল যোগ করা হয়েছে");

fs.writeFileSync('index.html', html, 'utf8');
console.log("✅ সব প্যাচ সম্পন্ন");
