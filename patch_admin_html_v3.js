const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// ১. ক্যাটাগরি Add ফর্ম থেকে start/end date সরানো
const oldAddForm = `    <label>নাম (ইমোজি সহ) <input type="text" id="fsc-name" placeholder="যেমন: 🔥 Up To 40% Off"></label>
    <label>Order (ক্রম নম্বর, ছোট আগে দেখাবে) <input type="number" id="fsc-order" value="0"></label>
    <label>শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" id="fsc-startdate" placeholder="যেমন: 08-08-2026"></label>
    <label>শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" id="fsc-enddate" placeholder="যেমন: 15-08-2026"></label>
    <button class="save-btn" id="fsc-add-btn">➕ ক্যাটাগরি যোগ করুন</button>`;

const newAddForm = `    <label>নাম (ইমোজি সহ) <input type="text" id="fsc-name" placeholder="যেমন: 🔥 Up To 40% Off"></label>
    <label>Order (ক্রম নম্বর, ছোট আগে দেখাবে) <input type="number" id="fsc-order" value="0"></label>
    <button class="save-btn" id="fsc-add-btn">➕ ক্যাটাগরি যোগ করুন</button>`;

if (html.includes(oldAddForm)) {
  html = html.replace(oldAddForm, newAddForm);
  console.log("✅ ক্যাটাগরি Add ফর্ম থেকে date field সরানো হয়েছে");
} else {
  console.log("⚠️ oldAddForm মিলছে না, স্কিপ করা হলো (হয়তো আগেই বদলানো)");
}

// ২. fsc-products-panel সম্পূর্ণ পুনর্গঠন
const oldPanelStart = html.indexOf('<div class="card" id="fsc-products-panel"');
if (oldPanelStart === -1) {
  console.log("❌ fsc-products-panel পাওয়া যায়নি");
  fs.writeFileSync('admin.html', html, 'utf8');
  process.exit(1);
}
const sectionEndMarker = '</section>';
const oldPanelEnd = html.indexOf(sectionEndMarker, oldPanelStart);
if (oldPanelEnd === -1) {
  console.log("❌ fsc-products-panel এর শেষ </section> পাওয়া যায়নি");
  fs.writeFileSync('admin.html', html, 'utf8');
  process.exit(1);
}

const newPanel = `<div class="card" id="fsc-products-panel" style="display:none">
    <h3 id="fsc-products-title">ক্যাটাগরি</h3>

    <div id="fsc-nav-buttons" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px">
      <button id="fsc-nav-view" class="save-btn">🛍️ প্রোডাক্ট ভিউ</button>
      <button id="fsc-nav-add" class="save-btn">➕ নতুন প্রোডাক্ট এড</button>
    </div>

    <div id="fsc-view-section" style="display:none">
      <div id="fsc-view-subnav" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button id="fsc-sub-owncat" class="save-btn">📦 এই ক্যাটাগরির প্রোডাক্ট</button>
        <button id="fsc-sub-all" class="save-btn">🗂️ All Products</button>
        <button id="fsc-sub-search" class="save-btn">🔍 Search Products</button>
      </div>

      <div id="fsc-search-box" style="display:none;margin-bottom:12px">
        <input type="text" id="fsc-search-input" placeholder="🔍 প্রোডাক্ট নাম দিয়ে সার্চ করুন...">
      </div>

      <div id="fsc-toolbar" style="display:none;margin-bottom:12px;padding:10px;background:#1a1a1a;border-radius:8px">
        <label style="display:block;margin-bottom:8px"><input type="checkbox" id="fsc-select-all"> সব সিলেক্ট করুন</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <label style="margin:0">% <input type="number" id="fsc-bulk-discount" min="0" max="100" style="width:70px" placeholder="%"></label>
          <button id="fsc-bulk-apply-btn" class="save-btn">✅ সিলেক্টেডে % বসান</button>
          <button id="fsc-bulk-save-btn" class="save-btn">💾 সিলেক্টেড Save</button>
          <button id="fsc-bulk-action-btn" class="danger-btn">🗑️ সিলেক্টেড রিমুভ</button>
        </div>
        <span id="fsc-bulk-status" style="font-size:13px;color:#8f8"></span>
      </div>

      <div id="fsc-products-list"></div>
    </div>

    <div id="fsc-add-section" style="display:none">
      <p style="font-size:13px;color:#aaa">গ্যালারি/স্টোরেজ থেকে একাধিক ছবি সিলেক্ট করুন (.png ফাইলনাম অনুযায়ী নাম অটো বসবে)</p>
      <input type="file" id="fsc-add-file-input" accept="image/*" multiple>
      <div id="fsc-add-list"></div>
    </div>
  </div>
  </section>`;

html = html.slice(0, oldPanelStart) + newPanel + html.slice(oldPanelEnd + sectionEndMarker.length);
fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ fsc-products-panel পুনর্গঠন সম্পন্ন হয়েছে");
