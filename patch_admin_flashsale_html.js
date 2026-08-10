const fs = require('fs');
const lines = fs.readFileSync('admin.html', 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('<section id="tab-flashsale" class="tab-section">'));
if (startIdx === -1) { console.log("❌ tab-flashsale শুরু পাওয়া যায়নি"); process.exit(1); }

let endIdx = -1;
for (let i = startIdx; i < startIdx + 40; i++) {
  if (lines[i].trim() === '</section>') { endIdx = i; break; }
}
if (endIdx === -1) { console.log("❌ tab-flashsale শেষ পাওয়া যায়নি"); process.exit(1); }

const newSection = [
'<section id="tab-flashsale" class="tab-section">',
'  <div class="card">',
'    <h3>⚡ নতুন Flash Sale ক্যাটাগরি যোগ করুন</h3>',
'    <label>নাম (ইমোজি সহ) <input type="text" id="fsc-name" placeholder="যেমন: 🔥 Up To 40% Off"></label>',
'    <label>Order (ক্রম নম্বর, ছোট আগে দেখাবে) <input type="number" id="fsc-order" value="0"></label>',
'    <label>শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" id="fsc-startdate" placeholder="যেমন: 08-08-2026"></label>',
'    <label>শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" id="fsc-enddate" placeholder="যেমন: 15-08-2026"></label>',
'    <button class="save-btn" id="fsc-add-btn">➕ ক্যাটাগরি যোগ করুন</button>',
'  </div>',
'',
'  <div id="fsc-list"></div>',
'',
'  <div class="card" id="fsc-products-panel" style="display:none">',
'    <h3 id="fsc-products-title">প্রোডাক্ট ম্যানেজমেন্ট</h3>',
'',
'    <div style="margin-bottom:12px">',
'      <input type="text" id="fsc-search-input" placeholder="🔍 সব প্রোডাক্ট থেকে সার্চ করে যোগ করুন...">',
'      <div id="fsc-search-results"></div>',
'    </div>',
'',
'    <div style="margin-bottom:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">',
'      <label style="margin:0">সবগুলোতে একসাথে %: <input type="number" id="fsc-bulk-discount" min="0" max="100" style="width:70px"></label>',
'      <button class="save-btn" id="fsc-bulk-apply-btn">✅ সবগুলোতে প্রয়োগ করুন</button>',
'      <span id="fsc-bulk-status" style="font-size:13px;color:#8f8"></span>',
'    </div>',
'',
'    <div id="fsc-products-list"></div>',
'  </div>',
'</section>'
];

lines.splice(startIdx, endIdx - startIdx + 1, ...newSection);
fs.writeFileSync('admin.html', lines.join('\n'), 'utf8');
console.log("✅ admin.html এ নতুন Flash Sale UI বসানো হয়েছে");
