const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startNeedle = '⭐ Deals Of The Day</h2>';
const startH2Idx = html.indexOf(startNeedle);
if(startH2Idx === -1){ console.log("❌ 'Deals Of The Day' হেডিং পাওয়া যায়নি"); process.exit(1); }

const startDivIdx = html.lastIndexOf('<div class="section">', startH2Idx);
if(startDivIdx === -1){ console.log("❌ শুরুর div খুঁজে পাওয়া যায়নি"); process.exit(1); }

const endNeedle = 'Special Categories</h2>';
const endH2Idx = html.indexOf(endNeedle, startH2Idx);
if(endH2Idx === -1){ console.log("❌ 'Special Categories' হেডিং পাওয়া যায়নি"); process.exit(1); }

const endDivIdx = html.lastIndexOf('<div class="section">', endH2Idx);
if(endDivIdx === -1 || endDivIdx <= startDivIdx){ console.log("❌ শেষের div খুঁজে পাওয়া যায়নি"); process.exit(1); }

console.log("✅ সীমানা পাওয়া গেছে");
console.log("--- প্রথম ৮০ অক্ষর ---");
console.log(JSON.stringify(html.slice(startDivIdx, startDivIdx + 80)));
console.log("--- endDivIdx এর আগের ৮০ অক্ষর ---");
console.log(JSON.stringify(html.slice(endDivIdx - 80, endDivIdx)));
