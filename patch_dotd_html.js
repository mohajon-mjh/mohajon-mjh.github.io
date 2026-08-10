const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const oldNav = `    <button class="tab-btn" data-tab="trending">🔥 Trending Products</button>`;
const newNav = `    <button class="tab-btn" data-tab="trending">🔥 Trending Products</button>
    <button class="tab-btn" data-tab="dotd">⭐ Deals of the Day</button>`;

if(!html.includes(oldNav)){
  console.log("❌ নেভিগেশন বাটন মিলছে না");
  process.exit(1);
}
html = html.replace(oldNav, newNav);
console.log("✅ (১) সাইডবারে 'Deals of the Day' ট্যাব যোগ হয়েছে");

const startMarker = '<section id="tab-flashsale" class="tab-section">';
const startIdx = html.indexOf(startMarker);
if(startIdx === -1){ console.log("❌ startMarker পাওয়া যায়নি"); process.exit(1); }

const endMarker = '<section id="tab-specialcats" class="tab-section">';
const endIdx = html.indexOf(endMarker, startIdx);
if(endIdx === -1){ console.log("❌ endMarker পাওয়া যায়নি"); process.exit(1); }

const flashSaleBlock = html.slice(startIdx, endIdx);

let dotdBlock = flashSaleBlock;
dotdBlock = dotdBlock.replace(/id="tab-flashsale"/g, 'id="tab-dotd"');
dotdBlock = dotdBlock.replace(/fsc-/g, 'dotd-');
dotdBlock = dotdBlock.replace(/⚡ নতুন Flash Sale ক্যাটাগরি যোগ করুন/g, '⭐ নতুন Deals of the Day ক্যাটাগরি যোগ করুন');
dotdBlock = dotdBlock.replace(/যেমন: 🔥 Up To 40% Off/g, 'যেমন: 🏆 Best Sellers');

if(!html.includes(flashSaleBlock)){
  console.log("❌ flashSaleBlock ম্যাচ করছে না (অসম্ভব হওয়ার কথা)");
  process.exit(1);
}

html = html.slice(0, endIdx) + dotdBlock + '\n\n' + html.slice(endIdx);

fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ (২) Flash Sale সেকশন কপি করে 'Deals of the Day' সেকশন (dotd- প্রিফিক্স) যোগ করা হয়েছে");
