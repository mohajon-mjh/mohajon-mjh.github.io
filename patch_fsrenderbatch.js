const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldLine = 'nextItems.forEach(it => flashSaleGrid.appendChild(renderFlashSaleCard(it.id, it.data, fsGlobalDiscount)));';
const newLine = 'nextItems.forEach(it => flashSaleGrid.appendChild(renderFlashSaleCard(it.id, it.data, it.mapInfo)));';

if(!html.includes(oldLine)){ console.log("❌ oldLine মিলছে না"); process.exit(1); }
html = html.replace(oldLine, newLine);
fs.writeFileSync('index.html', html, 'utf8');
console.log("✅ fsRenderNextBatch() এ mapInfo পাস করা হচ্ছে");
