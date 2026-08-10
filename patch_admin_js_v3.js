const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

// পুরনো selectFscCategory থেকে setupFscSearch() কল পর্যন্ত পুরোটা রিপ্লেস করব
const startMarker = 'function selectFscCategory(catId){';
const endMarker = 'setupFscSearch();';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1) {
  console.log("❌ মার্কার পাওয়া যায়নি:", startIdx, endIdx);
  process.exit(1);
}
const endIdxFull = endIdx + endMarker.length;

const newLogic = `function selectFscCategory(catId){
  fscSelectedCatId = catId;
  const panel = document.getElementById("fsc-products-panel");
  panel.style.display = "block";
  const title = document.getElementById("fsc-products-title");
  title.textContent = "🛍️ " + ((fscCategoriesCache[catId]||{}).name||"").replace(/\\\\n/g," ");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("fsc-view-section").style.display = "none";
  document.getElementById("fsc-add-section").style.display = "none";

  onValue(ref(db, "settings/flashSaleCategoryProducts/"+catId), (snapshot) => {
    fscSelectedCatProducts = snapshot.val() || {};
    if(fscCurrentSubview === "owncat") renderFscOwnCatView();
  });

  setupFscNav();
  setupFscAddSection();
}

let fscCurrentSubview = "owncat";
let fscSelectedIds = new Set();

function setupFscNav(){
  const navView = document.getElementById("fsc-nav-view");
  const navAdd = document.getElementById("fsc-nav-add");
  const viewSection = document.getElementById("fsc-view-section");
  const addSection = document.getElementById("fsc-add-section");

  navView.onclick = () => {
    viewSection.style.display = "block";
    addSection.style.display = "none";
    switchFscSubview("owncat");
  };
  navAdd.onclick = () => {
    viewSection.style.display = "none";
    addSection.style.display = "block";
  };

  document.getElementById("fsc-sub-owncat").onclick = () => switchFscSubview("owncat");
  document.getElementById("fsc-sub-all").onclick = () => switchFscSubview("all");
  document.getElementById("fsc-sub-search").onclick = () => switchFscSubview("search");

  // ডিফল্টে প্রোডাক্ট ভিউ খোলা থাকবে
  viewSection.style.display = "block";
  addSection.style.display = "none";
  switchFscSubview("owncat");
}

function switchFscSubview(mode){
  fscCurrentSubview = mode;
  fscSelectedIds = new Set();
  document.getElementById("fsc-search-box").style.display = (mode === "search") ? "block" : "none";
  document.getElementById("fsc-toolbar").style.display = (mode === "search") ? "none" : "block";

  if(mode === "owncat") renderFscOwnCatView();
  else if(mode === "all") renderFscAllProductsView();
  else if(mode === "search") renderFscSearchView();
}

function fscFormatPriceRow(data){
  let html = "";
  if(data.discountPrice && data.discountPrice > 0){
    html += \`<span style="text-decoration:line-through;color:#888;margin-right:8px">৳\${data.discountPrice}</span>\`;
  }
  html += \`<span style="font-weight:bold">৳\${data.price||0}</span>\`;
  return html;
}

function fscBuildProductCard(pid, data, opts){
  // opts: { mode: 'owncat'|'all'|'search', mapInfo }
  const div = document.createElement("div");
  div.className = "card";
  const title = data ? (data.title || data.name || "Unnamed") : "⚠️ প্রোডাক্ট পাওয়া যায়নি";
  const mapInfo = opts.mapInfo || {};
  const isInCategory = opts.mode === "owncat";

  const checkboxHTML = isInCategory
    ? \`<label style="display:inline-block;margin-right:8px"><input type="checkbox" class="fsc-item-check" data-pid="\${pid}"></label>\`
    : "";

  const actionBtnHTML = isInCategory
    ? \`<button class="danger-btn fsc-item-remove">🗑️ Remove</button>\`
    : \`<button class="save-btn fsc-item-addcat">➕ এই ক্যাটাগরিতে যোগ করুন</button>\`;

  div.innerHTML = \`
    \${checkboxHTML}<h3 style="display:inline-block">\${title}</h3>
    <p>\${fscFormatPriceRow(data||{})}</p>
    <label>বর্তমান দাম (৳) <input type="number" class="fsc-item-price" value="\${data?data.price||0:0}"></label>
    <label>Market/Old Price (৳, ঐচ্ছিক — খালি রাখলে হোমপেজে দেখাবে না) <input type="number" class="fsc-item-oldprice" value="\${data&&data.discountPrice?data.discountPrice:''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Discount % <input type="number" class="fsc-item-discount" value="\${mapInfo.discountPercent||0}" min="0" max="100" style="width:80px"></label>
    <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-startdate" value="\${mapInfo.startDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-enddate" value="\${mapInfo.endDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn fsc-item-save">💾 Save</button>
      \${actionBtnHTML}
    </div>
  \`;

  div.querySelector(".fsc-item-save").onclick = async () => {
    const newPrice = parseFloat(div.querySelector(".fsc-item-price").value) || 0;
    const oldPriceVal = div.querySelector(".fsc-item-oldprice").value.trim();
    const newOldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
    const newDiscount = parseInt(div.querySelector(".fsc-item-discount").value) || 0;
    const newStart = div.querySelector(".fsc-item-startdate").value.trim();
    const newEnd = div.querySelector(".fsc-item-enddate").value.trim();
    try{
      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: newOldPrice, updatedAt: Date.now() });
      if(isInCategory){
        await update(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}\`), {
          discountPercent: newDiscount, startDate: newStart, endDate: newEnd
        });
      }
      alert("✅ সেভ হয়েছে");
    }catch(err){ alert("❌ Error: " + err.message); }
  };

  if(isInCategory){
    div.querySelector(".fsc-item-remove").onclick = async () => {
      if(!confirm("এই প্রোডাক্টটি এই ক্যাটাগরি থেকে সরাবেন?")) return;
      try{
        await remove(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}\`));
      }catch(err){ alert("❌ Error: " + err.message); }
    };
  } else {
    div.querySelector(".fsc-item-addcat").onclick = async () => {
      try{
        await set(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}\`), { discountPercent: 0, addedAt: Date.now() });
        alert("✅ যোগ হয়েছে — এখন 'এই ক্যাটাগরির প্রোডাক্ট' এ দেখা যাবে");
      }catch(err){ alert("❌ Error: " + err.message); }
    };
  }

  return div;
}

function setupFscToolbar(getIdsAndData){
  const selectAllBox = document.getElementById("fsc-select-all");
  selectAllBox.checked = false;
  selectAllBox.onchange = () => {
    document.querySelectorAll(".fsc-item-check").forEach(cb => {
      cb.checked = selectAllBox.checked;
      const pid = cb.dataset.pid;
      if(selectAllBox.checked) fscSelectedIds.add(pid); else fscSelectedIds.delete(pid);
    });
  };
  document.querySelectorAll(".fsc-item-check").forEach(cb => {
    cb.onchange = () => {
      const pid = cb.dataset.pid;
      if(cb.checked) fscSelectedIds.add(pid); else fscSelectedIds.delete(pid);
    };
  });

  const bulkApplyBtn = document.getElementById("fsc-bulk-apply-btn");
  const bulkSaveBtn = document.getElementById("fsc-bulk-save-btn");
  const bulkActionBtn = document.getElementById("fsc-bulk-action-btn");
  const statusEl = document.getElementById("fsc-bulk-status");

  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("fsc-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".fsc-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".fsc-item-discount");
      if(discInput) discInput.value = val;
    });
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";
    setTimeout(()=>{ statusEl.textContent=""; }, 4000);
  };

  bulkSaveBtn.onclick = async () => {
    const checked = document.querySelectorAll(".fsc-item-check:checked");
    if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
    const updates = {};
    for(const cb of checked){
      const pid = cb.dataset.pid;
      const card = cb.closest(".card");
      const price = parseFloat(card.querySelector(".fsc-item-price").value) || 0;
      const oldPriceVal = card.querySelector(".fsc-item-oldprice").value.trim();
      const oldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
      const discount = parseInt(card.querySelector(".fsc-item-discount").value) || 0;
      const start = card.querySelector(".fsc-item-startdate").value.trim();
      const end = card.querySelector(".fsc-item-enddate").value.trim();
      updates[\`products/\${pid}/price\`] = price;
      updates[\`products/\${pid}/discountPrice\`] = oldPrice;
      updates[\`products/\${pid}/updatedAt\`] = Date.now();
      updates[\`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}/discountPercent\`] = discount;
      updates[\`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}/startDate\`] = start;
      updates[\`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${pid}/endDate\`] = end;
    }
    try{
      await update(ref(db), updates);
      statusEl.textContent = \`✅ \${checked.length}টি প্রোডাক্ট সেভ হয়েছে\`;
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "❌ Error: " + err.message;
    }
  };

  bulkActionBtn.onclick = async () => {
    const checked = document.querySelectorAll(".fsc-item-check:checked");
    if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
    if(!confirm(\`\${checked.length}টি প্রোডাক্ট এই ক্যাটাগরি থেকে সরাবেন?\`)) return;
    try{
      for(const cb of checked){
        await remove(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${cb.dataset.pid}\`));
      }
      statusEl.textContent = "✅ সরানো হয়েছে";
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "❌ Error: " + err.message;
    }
  };
}

async function renderFscOwnCatView(){
  const listDiv = document.getElementById("fsc-products-list");
  if(!listDiv) return;
  const pids = Object.keys(fscSelectedCatProducts);
  if(pids.length === 0){
    listDiv.innerHTML = "<p style='color:#888'>এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই। 'All Products' বা 'Search' থেকে যোগ করুন।</p>";
    return;
  }
  listDiv.innerHTML = "<p style='color:#888'>লোড হচ্ছে...</p>";
  const rows = await Promise.all(pids.map(async (pid) => {
    try{
      const snap = await get(ref(db, "products/"+pid));
      return { pid, data: snap.val(), mapInfo: fscSelectedCatProducts[pid] };
    }catch(e){ return { pid, data: null, mapInfo: fscSelectedCatProducts[pid] }; }
  }));
  listDiv.innerHTML = "";
  rows.forEach(({pid, data, mapInfo}) => {
    listDiv.appendChild(fscBuildProductCard(pid, data, { mode: "owncat", mapInfo }));
  });
  setupFscToolbar();
}

function renderFscAllProductsView(){
  const listDiv = document.getElementById("fsc-products-list");
  if(!listDiv) return;
  listDiv.innerHTML = "";
  const entries = Object.entries(allProductsCache).slice(0, 100);
  if(entries.length === 0){
    listDiv.innerHTML = "<p style='color:#888'>কোনো প্রোডাক্ট পাওয়া যায়নি</p>";
    return;
  }
  entries.forEach(([pid, data]) => {
    if(fscSelectedCatProducts[pid]) return; // আগে থেকেই আছে
    listDiv.appendChild(fscBuildProductCard(pid, data, { mode: "all", mapInfo: {} }));
  });
  const note = document.createElement("p");
  note.style.cssText = "color:#888;font-size:12px;text-align:center;margin-top:10px";
  note.textContent = "সর্বোচ্চ ১০০টি দেখানো হচ্ছে — নির্দিষ্ট প্রোডাক্ট খুঁজতে 'Search Products' ব্যবহার করুন";
  listDiv.appendChild(note);
}

function renderFscSearchView(){
  const listDiv = document.getElementById("fsc-products-list");
  const searchInput = document.getElementById("fsc-search-input");
  if(!listDiv || !searchInput) return;
  listDiv.innerHTML = "<p style='color:#888'>উপরে সার্চ বক্সে প্রোডাক্টের নাম লিখুন</p>";

  searchInput.oninput = () => {
    const q = searchInput.value.trim().toLowerCase();
    listDiv.innerHTML = "";
    if(!q){
      listDiv.innerHTML = "<p style='color:#888'>উপরে সার্চ বক্সে প্রোডাক্টের নাম লিখুন</p>";
      return;
    }
    const matches = Object.entries(allProductsCache).filter(([pid, data]) => {
      const name = (data.title || data.name || "").toLowerCase();
      return name.includes(q);
    }).slice(0, 30);
    if(matches.length === 0){
      listDiv.innerHTML = "<p style='color:#888'>কোনো ফলাফল পাওয়া যায়নি</p>";
      return;
    }
    matches.forEach(([pid, data]) => {
      const isAlready = !!fscSelectedCatProducts[pid];
      listDiv.appendChild(fscBuildProductCard(pid, data, { mode: isAlready ? "owncat" : "all", mapInfo: fscSelectedCatProducts[pid] || {} }));
    });
  };
}

function setupFscAddSection(){
  const fileInput = document.getElementById("fsc-add-file-input");
  const addListDiv = document.getElementById("fsc-add-list");
  if(!fileInput || !addListDiv) return;

  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    renderFscAddList(files, addListDiv);
  };
}

function fscFilenameToTitle(filename){
  const base = filename.replace(/\\.[^/.]+\$/, "");
  return base.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function renderFscAddList(files, addListDiv){
  addListDiv.innerHTML = "";
  if(files.length === 0) return;

  files.forEach((file) => {
    const title = fscFilenameToTitle(file.name);
    const div = document.createElement("div");
    div.className = "card";
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = div.querySelector(".fsc-add-preview");
      if(img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    div.innerHTML = \`
      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="\${title}"></label>
      <label>বর্তমান দাম (৳) <input type="number" class="fsc-add-price" value="0"></label>
      <label>Market/Old Price (৳, ঐচ্ছিক) <input type="number" class="fsc-add-oldprice" value="" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Discount % <input type="number" class="fsc-add-discount" value="0" min="0" max="100" style="width:80px"></label>
      <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-startdate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-enddate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>স্টক <input type="number" class="fsc-add-stock" value="20"></label>
      <div style="clear:both"></div>
      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
      <button type="button" class="danger-btn fsc-add-remove">🗑️ বাদ দিন</button>
    \`;

    div.querySelector(".fsc-add-remove").onclick = () => div.remove();

    div.querySelector(".fsc-add-save").onclick = async () => {
      const saveBtn = div.querySelector(".fsc-add-save");
      const itemTitle = div.querySelector(".fsc-add-title").value.trim();
      const itemPrice = parseFloat(div.querySelector(".fsc-add-price").value) || 0;
      const oldPriceVal = div.querySelector(".fsc-add-oldprice").value.trim();
      const itemOldPrice = oldPriceVal === "" ? null : (parseFloat(oldPriceVal) || 0);
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;
      const itemStart = div.querySelector(".fsc-add-startdate").value.trim();
      const itemEnd = div.querySelector(".fsc-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".fsc-add-stock").value) || 0;

      if(!itemTitle){ alert("নাম দিন"); return; }

      saveBtn.disabled = true;
      saveBtn.textContent = "সেভ হচ্ছে...";
      try{
        const imageUrl = await uploadToCloudinaryGlobal(file);
        const newRef = push(ref(db, "products"));
        await set(newRef, {
          title: itemTitle,
          price: itemPrice,
          discountPrice: itemOldPrice,
          stock: itemStock,
          categoryId: "flashsale_only",
          sellerId: currentAdminUid,
          status: "active",
          createdAt: Date.now(),
          images: { main: imageUrl }
        });
        await set(ref(db, \`settings/flashSaleCategoryProducts/\${fscSelectedCatId}/\${newRef.key}\`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        alert("❌ সমস্যা: " + err.message);
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
      }
    };

    addListDiv.appendChild(div);
  });
}

setupFscSearch();`;

content = content.slice(0, startIdx) + newLogic + content.slice(endIdxFull);
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ admin.js এ নতুন Flash Sale প্রোডাক্ট লজিক বসানো হয়েছে");
