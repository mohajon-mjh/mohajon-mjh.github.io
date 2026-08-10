const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');

// ===== ১. CSS যোগ করা (flex row, nowrap, scrollable) =====
const cssMarkerIdx = lines.findIndex(l => l.includes('#flashCatsRow::-webkit-scrollbar{display:none;}'));
if (cssMarkerIdx === -1) {
  console.log("❌ CSS marker পাওয়া যায়নি");
  process.exit(1);
}
if (!lines[cssMarkerIdx + 1] || !lines[cssMarkerIdx + 1].includes('#flashCatsRow{display:flex')) {
  lines.splice(cssMarkerIdx + 1, 0,
    '#flashCatsRow{display:flex;flex-wrap:nowrap;gap:12px;}',
    '#flashCatsRow .cat{flex:0 0 auto;min-width:150px;}'
  );
  console.log("✅ CSS যোগ হয়েছে");
} else {
  console.log("⚠️ CSS আগে থেকেই আছে, স্কিপ করা হলো");
}

// ===== ২. HTML বাটন ব্লক রিপ্লেস =====
const btnStart = lines.findIndex(l => l.includes('<div class="categories" id="flashCatsRow">'));
if (btnStart === -1) {
  console.log("❌ flashCatsRow div পাওয়া যায়নি");
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  process.exit(1);
}
let btnEnd = -1;
for (let i = btnStart + 1; i < btnStart + 10; i++) {
  if (lines[i].trim() === '</div>') { btnEnd = i; break; }
}
if (btnEnd === -1) {
  console.log("❌ flashCatsRow closing div পাওয়া যায়নি");
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  process.exit(1);
}
const newBtnBlock = [
  '<div class="categories" id="flashCatsRow">',
  '<a href="javascript:void(0)" class="cat" data-mode="flashsale" data-cat="" onclick="loadFlashCategoryProducts(\'flashsale\', null)">🔥 <span id="flashSaleLabelText">Up To 70% Off</span></a>',
  '<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="lighting_lamps" onclick="loadFlashCategoryProducts(\'category\', \'lighting_lamps\')">🎉 Special Offers<br>for One Week</a>',
  '<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="consumer_electronics" onclick="loadFlashCategoryProducts(\'category\', \'consumer_electronics\')">📱 Electronics Deals</a>',
  '<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="clothing_fashion_apparel_men_women_kids" onclick="loadFlashCategoryProducts(\'category\', \'clothing_fashion_apparel_men_women_kids\')">👕 Fashion Sale</a>',
  '<a href="javascript:void(0)" class="cat" data-mode="category" data-cat="home_kitchen" onclick="loadFlashCategoryProducts(\'category\', \'home_kitchen\')">🏠 Home Essentials</a>',
  '</div>'
];
lines.splice(btnStart, btnEnd - btnStart + 1, ...newBtnBlock);
console.log("✅ Flash Sale বাটন ব্লক রিপ্লেস হয়েছে");

// ===== ৩. JS লজিক রিপ্লেস (ইনলাইন ক্যাটাগরি লোডিং, ৩০-ব্যাচ arrow) =====
const jsStart = lines.findIndex(l => l.includes('const flashSaleGrid = document.getElementById("flashSaleProductsGrid")'));
if (jsStart === -1) {
  console.log("❌ flashSaleGrid JS marker পাওয়া যায়নি");
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  process.exit(1);
}
let jsEnd = -1;
for (let i = jsStart; i < jsStart + 200; i++) {
  if (lines[i].trim() === '</script>') { jsEnd = i; break; }
}
if (jsEnd === -1) {
  console.log("❌ </script> closing marker পাওয়া যায়নি");
  fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
  process.exit(1);
}

const newJsBlock = [
'const flashSaleGrid = document.getElementById("flashSaleProductsGrid");',
'const FS_STRIP_LIMIT = 30;',
'let fsAllItems = [];',
'let fsRenderedCount = 0;',
'let fsGlobalDiscount = 0;',
'',
'function fsRemoveArrow(){',
'  const old = flashSaleGrid.querySelector(".scroll-arrow-card");',
'  if(old) old.remove();',
'}',
'',
'function fsAddArrow(){',
'  fsRemoveArrow();',
'  const arrowCard = document.createElement("div");',
'  arrowCard.className = "scroll-arrow-card";',
'  arrowCard.innerHTML = "<span>→</span>";',
'  arrowCard.addEventListener("click", () => { fsRenderNextBatch(); });',
'  flashSaleGrid.appendChild(arrowCard);',
'}',
'',
'function fsRenderNextBatch(){',
'  fsRemoveArrow();',
'  const nextItems = fsAllItems.slice(fsRenderedCount, fsRenderedCount + FS_STRIP_LIMIT);',
'  nextItems.forEach(it => flashSaleGrid.appendChild(renderFlashSaleCard(it.id, it.data, fsGlobalDiscount)));',
'  fsRenderedCount += nextItems.length;',
'  if(fsRenderedCount < fsAllItems.length){',
'    fsAddArrow();',
'  }',
'}',
'',
'function loadFlashCategoryProducts(mode, categoryId){',
'  document.querySelectorAll("#flashCatsRow .cat").forEach(b => b.classList.remove("active"));',
'  const activeBtn = document.querySelector(`#flashCatsRow .cat[data-mode="${mode}"][data-cat="${categoryId||\'\'}"]`);',
'  if(activeBtn) activeBtn.classList.add("active");',
'',
'  flashSaleGrid.innerHTML = "<p style=\'text-align:center;color:#888\'>লোড হচ্ছে...</p>";',
'',
'  const fsQuery = mode === "flashsale"',
'    ? query(ref(fsDb, "products"), orderByChild("isFlashSale"), equalTo(true), limitToFirst(500))',
'    : query(ref(fsDb, "products"), orderByChild("categoryId"), equalTo(categoryId), limitToFirst(500));',
'',
'  get(ref(fsDb, "settings/flashSaleGlobalDiscount")).then(snap => {',
'    fsGlobalDiscount = snap.exists() ? (parseInt(snap.val()) || 0) : 0;',
'  }).catch(() => { fsGlobalDiscount = 0; }).finally(() => {',
'    onValue(fsQuery, (snapshot) => {',
'      flashSaleGrid.innerHTML = "";',
'      fsAllItems = [];',
'      fsRenderedCount = 0;',
'      snapshot.forEach(child => {',
'        if(child.val().status === "active"){',
'          fsAllItems.push({ id: child.key, data: child.val() });',
'        }',
'      });',
'      if(fsAllItems.length === 0){',
'        flashSaleGrid.innerHTML = "<p style=\'text-align:center;color:#888\'>এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>";',
'        return;',
'      }',
'      fsRenderNextBatch();',
'    }, { onlyOnce: true });',
'  });',
'}',
'window.loadFlashCategoryProducts = loadFlashCategoryProducts;',
'',
'loadFlashCategoryProducts("flashsale", null);'
];

lines.splice(jsStart, jsEnd - jsStart, ...newJsBlock);
console.log("✅ JS লজিক রিপ্লেস হয়েছে (ইনলাইন ক্যাটাগরি লোডিং)");

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log("\n✅ সব প্যাচ সফলভাবে প্রয়োগ হয়েছে");
