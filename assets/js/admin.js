import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update, remove, push, set, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd",
  measurementId: "G-RX6CCQZHSH"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

/* 🔐 শুধুমাত্র এই UID admin panel এ ঢুকতে পারবে */
const ADMIN_UIDS = [
  "SqVK0FFNFietVqov8la6hwSAF023"
];

const productsDiv = document.getElementById("products");
const allProductsDiv = document.getElementById("all-products");
const sellerReqDiv = document.getElementById("seller-requests");
const sellerCommDiv = document.getElementById("seller-commissions");
const ordersDiv = document.getElementById("orders-commission");
const notepadDiv = document.getElementById("admin-notepad");
const trendingDiv = document.getElementById("trending-manager");
const searchInput = document.getElementById("product-search");

let currentAdminUid = null;

async function uploadToCloudinaryGlobal(file){
  const CLOUD_NAME = "fd70754d";
  const UPLOAD_PRESET = "mohajon-mjh";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });
  if(!res.ok){
    const errText = await res.text();
    throw new Error("Cloudinary upload failed: " + errText);
  }
  const data = await res.json();
  return data.secure_url;
}
let allProductsCache = {}; // key -> data, used for search filtering

function adminFmt(bdtAmount){
  if(window.MJHCurrency && typeof window.MJHCurrency.formatPrice === 'function'){
    return window.MJHCurrency.formatPrice(bdtAmount);
  }
  return "৳" + (parseFloat(bdtAmount) || 0).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("adminCurrencySelector");
  if(sel){
    const saved = localStorage.getItem("selectedCurrency") || "BDT";
    sel.value = saved;
    sel.addEventListener("change", () => {
      localStorage.setItem("selectedCurrency", sel.value);
      location.reload();
    });
  }
});

onAuthStateChanged(auth, (user) => {
  if(!user){
    alert("Login required");
    location.href="login.html?role=admin";
    return;
  }
  if(!ADMIN_UIDS.includes(user.uid)){
    alert("❌ Unauthorized Admin Access");
    signOut(auth);
    location.href="login.html?role=admin";
    return;
  }

  currentAdminUid = user.uid;
  loadFlashSaleCategories();
  loadDealsOfDayCategories();
  loadProducts();
  loadAllProducts();
  loadSellerRequests();
  loadSellerCommissions();
  loadDeliveredOrders();
  loadOrderStats();
  loadNotepad();
  loadNotificationBell();
  loadAllSellers();
  loadFinancePanel();
  loadAllOrdersPanel();
  loadCurrencyPanel();
  loadBulkUpload();
  loadComingSoon();
  loadTrending();
});

/* ===================== OVERVIEW STATS ===================== */
function loadOrderStats(){
  const totalEl = document.getElementById("total-orders");
  const pendingEl = document.getElementById("pending-orders");
  const revenueEl = document.getElementById("admin-revenue");
  if(!totalEl) return;

  onValue(ref(db,"orders"), (snapshot) => {
    const orders = snapshot.val() || {};
    let pending = 0;
    let revenue = 0;

    Object.values(orders).forEach(o => {
      if(o.status === "pending") pending++;
      if(o.status === "delivered"){
        (o.items || []).forEach(i => {
          revenue += (parseFloat(i.price) || 0) * (i.qty || 1);
        });
      }
    });

    totalEl.textContent = Object.keys(orders).length;
    pendingEl.textContent = pending;
    if(revenueEl) revenueEl.textContent = adminFmt(revenue);
  });
}

/* ===================== PENDING PRODUCT APPROVAL (+ EDIT) ===================== */
function loadProducts(){
  if(!productsDiv) return;
  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{
    productsDiv.innerHTML="<div class='section-title'><h3>🆕 Pending Products</h3></div>";

    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();
      if(data.status !== "pending") return;
      count++;

      const div = document.createElement("div");
      div.className="card";

      div.innerHTML=`
        <label>নাম
          <input type="text" class="p-name" value="${(data.title||data.name||'').replace(/"/g,'&quot;')}">
        </label>
        <label>দাম (৳)
          <input type="number" class="p-price" value="${data.price||0}">
        </label>
        <label>স্টক
          <input type="number" class="p-stock" value="${data.stock||0}">
        </label>
        <p>Seller: ${data.sellerEmail || data.sellerId}</p>
        <p>Status: ${data.status}</p>
        <button class="save-btn">Save</button>
        <button class="approve">Approve</button>
        <button class="reject">Reject / Delete</button>
      `;

      div.querySelector(".save-btn").onclick = async () => {
        const newName = div.querySelector(".p-name").value.trim();
        const newPrice = parseFloat(div.querySelector(".p-price").value);
        const newStock = parseInt(div.querySelector(".p-stock").value);
        try{
          const updates = { price:newPrice, stock:newStock, updatedAt: Date.now() };
          if(data.title !== undefined) updates.title = newName;
          else updates.name = newName;
          await update(ref(db,"products/"+key), updates);
          alert("✅ আপডেট হয়েছে");
        }catch(err){
          alert("❌ Error: " + err.message);
        }
      };

      div.querySelector(".approve").onclick = async () => {
        try{
          await update(ref(db,"products/"+key),{ status:"active", updatedAt: Date.now() });
        }catch(err){
          alert("❌ Approve Error: " + err.message);
        }
      };

      div.querySelector(".reject").onclick = async () => {
        if(!confirm("এই প্রোডাক্ট বাতিল/ডিলিট করবেন?")) return;
        try{
          await remove(ref(db,"products/"+key));
        }catch(err){
          alert("❌ Delete Error: " + err.message);
        }
      };

      productsDiv.appendChild(div);
    });

    if(count === 0) productsDiv.innerHTML += "<p>কোনো pending প্রোডাক্ট নেই।</p>";
  });
}

/* ===================== ALL PRODUCTS - EDIT / DELETE / SEARCH ===================== */
function loadAllProducts(){
  if(!allProductsDiv) return;
  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{
    allProductsCache = {};
    snapshot.forEach(child=>{
      allProductsCache[child.key] = child.val();
    });
    renderAllProducts(searchInput ? searchInput.value : "");
  });

  if(searchInput){
    searchInput.addEventListener("input", () => {
      renderAllProducts(searchInput.value);
    });
  }
}

let allProductsRenderLimit = 50;

function renderAllProducts(filterText){
  allProductsDiv.innerHTML="<div class='section-title'><h3>✏️ সব প্রোডাক্ট — এডিট / ডিলিট</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  let allKeys = Object.keys(allProductsCache);
  if(search){
    allKeys = allKeys.filter(key=>{
      const data = allProductsCache[key];
      const name = (data.title || data.name || "").toLowerCase();
      return name.includes(search);
    });
  } else {
    allKeys = allKeys.slice(0, allProductsRenderLimit);
  }

  allKeys.forEach(key=>{
    const data = allProductsCache[key];
    count++;

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <label>নাম
        <input type="text" class="edit-name" value="${(data.title||data.name||'').replace(/"/g,'&quot;')}">
      </label>
      <label>দাম (৳)
        <input type="number" class="edit-price" value="${data.price||0}">
      </label>
      <label>স্টক
        <input type="number" class="edit-stock" value="${data.stock||0}">
      </label>
      <label>ডেলিভারি
        <select class="edit-free-delivery">
          <option value="paid" ${!data.isFreeDelivery ? "selected" : ""}>Paid Delivery</option>
          <option value="free" ${data.isFreeDelivery ? "selected" : ""}>Free Delivery</option>
        </select>
      </label>
      <label>ডেলিভারি চার্জ (৳)
        <input type="number" class="edit-delivery-charge" value="${data.deliveryCharge||0}" min="0">
      </label>
      <label>ডেলিভারি সময়
        <input type="text" class="edit-delivery-time" value="${(data.deliveryTime||'').replace(/"/g,'&quot;')}" placeholder="যেমন: ৩-৫ কার্যদিবস">
      </label>
      <label>Rating (0-5, "Top Rated" ট্যাবের জন্য)
        <input type="number" class="edit-rating" value="${data.rating||0}" min="0" max="5" step="0.1">
      </label>
      <label>Sold Count ("Best Sellers" ট্যাবের জন্য)
        <input type="number" class="edit-soldcount" value="${data.soldCount||0}" min="0">
      </label>
      <label><input type="checkbox" class="edit-recommended" ${data.isRecommended ? "checked" : ""}> ⭐ Recommended (Deals of the Day - Recommended ট্যাবে দেখাবে)</label>
      <label><input type="checkbox" class="edit-featured" ${data.isFeatured ? "checked" : ""}> 🌟 Featured (Featured Products সেকশনে দেখাবে)</label>
      <label><input type="checkbox" class="edit-flashsale" ${data.isFlashSale ? "checked" : ""}> ⚡ Flash Sale (Flash Sale সেকশনে দেখাবে)</label>
      <label><input type="checkbox" class="edit-trending" ${data.isTrending ? "checked" : ""}> 🔥 Trending (Trending Products সেকশনে দেখাবে)</label>
      <p style="font-size:12px;color:#999">Status: ${data.status} | Seller: ${data.sellerEmail || data.sellerId}</p>
      <button class="save-btn">Save</button>
      <button class="delete-btn">Delete</button>
    `;

    div.querySelector(".save-btn").onclick = async () => {
      const newName = div.querySelector(".edit-name").value.trim();
      const newPrice = parseFloat(div.querySelector(".edit-price").value);
      const newStock = parseInt(div.querySelector(".edit-stock").value);
      try{
        const isFree = div.querySelector(".edit-free-delivery").value === "free";
        const deliveryCharge = parseFloat(div.querySelector(".edit-delivery-charge").value) || 0;
        const deliveryTime = div.querySelector(".edit-delivery-time").value.trim();
        const newRating = parseFloat(div.querySelector(".edit-rating").value) || 0;
        const newSoldCount = parseInt(div.querySelector(".edit-soldcount").value) || 0;
        const newRecommended = div.querySelector(".edit-recommended").checked;
        const newFeatured = div.querySelector(".edit-featured").checked;
        const newFlashSale = div.querySelector(".edit-flashsale").checked;
        const newTrending = div.querySelector(".edit-trending").checked;
        const updates = {
          price:newPrice,
          stock:newStock,
          isFreeDelivery: isFree,
          deliveryCharge: isFree ? 0 : deliveryCharge,
          deliveryTime: deliveryTime,
          rating: newRating,
          soldCount: newSoldCount,
          isRecommended: newRecommended,
          isFeatured: newFeatured,
          isFlashSale: newFlashSale,
          isTrending: newTrending,
          updatedAt: Date.now()
        };
        if(data.title !== undefined) updates.title = newName;
        else updates.name = newName;
        await update(ref(db,"products/"+key), updates);
        alert("✅ প্রোডাক্ট আপডেট হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);
      }
    };

    div.querySelector(".delete-btn").onclick = async () => {
      if(!confirm("এই প্রোডাক্ট সম্পূর্ণ ডিলিট করবেন?")) return;
      try{
        await remove(ref(db,"products/"+key));
      }catch(err){
        alert("❌ Delete Error: " + err.message);
      }
    };

    allProductsDiv.appendChild(div);
  });

  if(count === 0) allProductsDiv.innerHTML += "<p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>";

  const totalCount = Object.keys(allProductsCache).length;
  if(!search && totalCount > allProductsRenderLimit){
    const moreBtn = document.createElement("button");
    moreBtn.className = "save-btn";
    moreBtn.style.cssText = "display:block;margin:15px auto";
    moreBtn.textContent = `⬇️ আরও দেখান (${totalCount - allProductsRenderLimit}টি বাকি)`;
    moreBtn.onclick = () => {
      allProductsRenderLimit += 50;
      renderAllProducts(searchInput ? searchInput.value : "");
    };
    allProductsDiv.appendChild(moreBtn);
  }
}

/* ===================== FLASH SALE CATEGORY MANAGER (v2) ===================== */
let trendingCache = {};
const trendingSearchInput = document.getElementById("trending-search");

let fscCategoriesCache = {};
let fscSelectedCatId = null;
let fscSelectedCatProducts = {}; // pid -> {discountPercent, addedAt}

function loadFlashSaleCategories(){
  const listDiv = document.getElementById("fsc-list");
  if(!listDiv) return;
  onValue(ref(db, "settings/flashSaleCategories"), (snapshot) => {
    fscCategoriesCache = snapshot.val() || {};
    renderFscList();
    if(fscSelectedCatId && fscCategoriesCache[fscSelectedCatId]){
      document.getElementById("fsc-products-title").textContent = "🛍️ প্রোডাক্ট — " + (fscCategoriesCache[fscSelectedCatId].name||"").replace(/\n/g," ");
    }
  });

  const addBtn = document.getElementById("fsc-add-btn");
  if(addBtn){
    addBtn.onclick = async () => {
      const name = document.getElementById("fsc-name").value.trim();
      const order = parseInt(document.getElementById("fsc-order").value) || 0;
      if(!name){ alert("ক্যাটাগরির নাম দিন"); return; }
      try{
        const newRef = push(ref(db, "settings/flashSaleCategories"));
        await set(newRef, { name, order, createdAt: Date.now() });
        document.getElementById("fsc-name").value = "";
        document.getElementById("fsc-order").value = "0";
        alert("✅ ক্যাটাগরি যোগ হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);
      }
    };
  }
}

function renderFscList(){
  const listDiv = document.getElementById("fsc-list");
  if(!listDiv) return;
  const entries = Object.entries(fscCategoriesCache).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
  if(entries.length === 0){
    listDiv.innerHTML = "<p style=\"color:#888\">কোনো Flash Sale ক্যাটাগরি নেই</p>";
    return;
  }
  listDiv.innerHTML = "";
  entries.forEach(([id, item]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer";
    div.innerHTML = `
      <h3 class="fsc-cat-name" style="margin:0;flex:1">${(item.name||"").replace(/</g,"&lt;")}</h3>
      <div style="display:flex;gap:8px">
        <button class="save-btn fsc-edit-btn">✏️ Edit</button>
        <button class="danger-btn fsc-delete-btn">🗑️ Delete</button>
      </div>
    `;
    div.querySelector(".fsc-cat-name").onclick = () => selectFscCategory(id);
    div.querySelector(".fsc-edit-btn").onclick = (e) => {
      e.stopPropagation();
      const h3 = div.querySelector(".fsc-cat-name");
      const currentName = item.name || "";
      h3.outerHTML = `<div class="fsc-cat-editbox" style="flex:1;display:flex;gap:8px;align-items:center">
        <input type="text" class="fsc-cat-name-input" value="${currentName.replace(/"/g,"&quot;")}" style="flex:1">
        <button class="save-btn fsc-cat-save-btn">💾</button>
      </div>`;
      const editBox = div.querySelector(".fsc-cat-editbox");
      const input = editBox.querySelector(".fsc-cat-name-input");
      const saveBtn = editBox.querySelector(".fsc-cat-save-btn");
      const editBtn = div.querySelector(".fsc-edit-btn");
      editBtn.style.display = "none";
      input.focus();
      saveBtn.onclick = async (ev) => {
        ev.stopPropagation();
        const newName = input.value.trim();
        if(!newName){ alert("নাম খালি রাখা যাবে না"); return; }
        try{
          await update(ref(db, "settings/flashSaleCategories/"+id), { name: newName });
        }catch(err){ alert("❌ Error: " + err.message); }
      };
    };
    div.querySelector(".fsc-delete-btn").onclick = async (e) => {
      e.stopPropagation();
      if(!confirm(`"${item.name}" ক্যাটাগরি এবং এর সব প্রোডাক্ট লিংক ডিলিট করবেন? (মূল প্রোডাক্ট ডিলিট হবে না)`)) return;
      try{
        await remove(ref(db, "settings/flashSaleCategories/"+id));
        await remove(ref(db, "settings/flashSaleCategoryProducts/"+id));
        if(fscSelectedCatId === id){
          fscSelectedCatId = null;
          document.getElementById("fsc-products-panel").style.display = "none";
        }
      }catch(err){ alert("❌ Error: " + err.message); }
    };
    listDiv.appendChild(div);
  });
}

function selectFscCategory(catId){
  fscSelectedCatId = catId;
  const panel = document.getElementById("fsc-products-panel");
  panel.style.display = "block";
  const title = document.getElementById("fsc-products-title");
  title.textContent = "🛍️ " + ((fscCategoriesCache[catId]||{}).name||"").replace(/\\n/g," ");
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

async function fscUpdateCategoryMaxDiscount(catId){
  try{
    const mapSnap = await get(ref(db, "settings/flashSaleCategoryProducts/"+catId));
    const map = mapSnap.exists() ? mapSnap.val() : {};
    let maxDiscount = 0;
    Object.values(map).forEach(info => {
      const d = parseInt(info.discountPercent) || 0;
      if(d > maxDiscount) maxDiscount = d;
    });
    const catSnap = await get(ref(db, "settings/flashSaleCategories/"+catId));
    if(!catSnap.exists()) return;
    const oldName = catSnap.val().name || "";
    if(/\d+\s*%/.test(oldName)){
      const newName = oldName.replace(/\d+(\s*%)/, maxDiscount + "$1");
      if(newName !== oldName){
        await update(ref(db, "settings/flashSaleCategories/"+catId), { name: newName });
      }
    }
  }catch(err){ console.error("fscUpdateCategoryMaxDiscount error:", err); }
}

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
    html += `<span style="text-decoration:line-through;color:#888;margin-right:8px">৳${data.discountPrice}</span>`;
  }
  html += `<span style="font-weight:bold">৳${data.price||0}</span>`;
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
    ? `<label style="display:inline-block;margin-right:8px"><input type="checkbox" class="fsc-item-check" data-pid="${pid}"></label>`
    : "";

  const actionBtnHTML = isInCategory
    ? `<button class="danger-btn fsc-item-remove">🗑️ Remove</button>`
    : `<button class="save-btn fsc-item-addcat">➕ এই ক্যাটাগরিতে যোগ করুন</button>`;

  const initialPrice = data ? (data.price||0) : 0;
  const initialOldPrice = (data && data.discountPrice) ? data.discountPrice : initialPrice;

  div.innerHTML = `
    ${checkboxHTML}<h3 class="dotd-item-title" style="display:inline-block">${title}</h3>
    <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-item-oldprice" value="${initialOldPrice}"></label>
    <label>Discount % <input type="number" class="fsc-item-discount" value="${mapInfo.discountPercent||0}" min="0" max="100" style="width:80px"></label>
    <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="fsc-item-price" value="${initialPrice}" readonly style="background:#222;color:#8f8"></label>
    <div class="fsc-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
    <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-startdate" value="${mapInfo.startDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-item-enddate" value="${mapInfo.endDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn fsc-item-save">💾 Save</button>
      ${actionBtnHTML}
    </div>
  `;

  (function(){
    const priceInput = div.querySelector(".fsc-item-price");
    const oldPriceInput = div.querySelector(".fsc-item-oldprice");
    const discountInput = div.querySelector(".fsc-item-discount");
    const previewEl = div.querySelector(".fsc-item-preview");
    function fscRecalc(){
      const op = parseFloat(oldPriceInput.value) || 0;
      const d = parseInt(discountInput.value) || 0;
      const newPrice = Math.round(op * (1 - d/100));
      priceInput.value = newPrice;
      const save = op - newPrice;
      if(d > 0 && save > 0){
        previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
      } else {
        previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
      }
    }
    oldPriceInput.addEventListener("input", fscRecalc);
    discountInput.addEventListener("input", fscRecalc);
    fscRecalc();
  })();

  div.querySelector(".fsc-item-save").onclick = async () => {
    const newOldPrice = parseFloat(div.querySelector(".fsc-item-oldprice").value) || 0;
    const newDiscount = parseInt(div.querySelector(".fsc-item-discount").value) || 0;
    const newPrice = Math.round(newOldPrice * (1 - newDiscount/100));
    const savedOldPrice = newDiscount > 0 ? newOldPrice : null;
    const newStart = div.querySelector(".fsc-item-startdate").value.trim();
    const newEnd = div.querySelector(".fsc-item-enddate").value.trim();
    try{
      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: savedOldPrice, updatedAt: Date.now() });
      if(isInCategory){
        await update(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`), {
          discountPercent: newDiscount, startDate: newStart, endDate: newEnd
        });
        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
      }
      alert("✅ সেভ হয়েছে");
    }catch(err){ alert("❌ Error: " + err.message); }
  };

  if(isInCategory){
    div.querySelector(".fsc-item-remove").onclick = async () => {
      if(!confirm("এই প্রোডাক্টটি এই ক্যাটাগরি থেকে সরাবেন?")) return;
      try{
        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`));
        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
      }catch(err){ alert("❌ Error: " + err.message); }
    };
  } else {
    div.querySelector(".fsc-item-addcat").onclick = async () => {
      try{
        await set(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}`), { discountPercent: 0, addedAt: Date.now() });
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
  const bulkDateApplyBtn = document.getElementById("fsc-bulk-date-apply-btn");
  const statusEl = document.getElementById("fsc-bulk-status");

  if(bulkDateApplyBtn){
    bulkDateApplyBtn.onclick = () => {
      const checked = document.querySelectorAll(".fsc-item-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      const startVal = document.getElementById("fsc-bulk-startdate").value.trim();
      const endVal = document.getElementById("fsc-bulk-enddate").value.trim();
      if(!startVal && !endVal){ alert("অন্তত একটা তারিখ দিন"); return; }
      checked.forEach(cb => {
        const card = cb.closest(".card");
        const startInput = card.querySelector(".fsc-item-startdate");
        const endInput = card.querySelector(".fsc-item-enddate");
        if(startVal && startInput) startInput.value = startVal;
        if(endVal && endInput) endInput.value = endVal;
      });
      statusEl.textContent = "✅ সিলেক্টেড " + checked.length + "টি প্রোডাক্টে তারিখ বসানো হয়েছে, এখন Save চাপুন";
      setTimeout(()=>{ statusEl.textContent=""; }, 4000);
    };
  }

  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("fsc-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".fsc-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".fsc-item-discount");
      if(discInput) discInput.value = val;
      const oldPriceInput = card.querySelector(".fsc-item-oldprice");
      const priceInput = card.querySelector(".fsc-item-price");
      const previewEl = card.querySelector(".fsc-item-preview");
      if(oldPriceInput && priceInput){
        const op = parseFloat(oldPriceInput.value) || 0;
        const newPrice = Math.round(op * (1 - val/100));
        priceInput.value = newPrice;
        if(previewEl){
          const save = op - newPrice;
          if(val > 0 && save > 0){
            previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
          } else {
            previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
          }
        }
      }
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
      const oldPrice = parseFloat(card.querySelector(".fsc-item-oldprice").value) || 0;
      const discount = parseInt(card.querySelector(".fsc-item-discount").value) || 0;
      const price = Math.round(oldPrice * (1 - discount/100));
      const savedOldPrice = discount > 0 ? oldPrice : null;
      const start = card.querySelector(".fsc-item-startdate").value.trim();
      const end = card.querySelector(".fsc-item-enddate").value.trim();
      updates[`products/${pid}/price`] = price;
      updates[`products/${pid}/discountPrice`] = savedOldPrice;
      updates[`products/${pid}/updatedAt`] = Date.now();
      updates[`settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}/discountPercent`] = discount;
      updates[`settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}/startDate`] = start;
      updates[`settings/flashSaleCategoryProducts/${fscSelectedCatId}/${pid}/endDate`] = end;
    }
    try{
      await update(ref(db), updates);
      await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
      statusEl.textContent = `✅ ${checked.length}টি প্রোডাক্ট সেভ হয়েছে`;
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "❌ Error: " + err.message;
    }
  };

  bulkActionBtn.onclick = async () => {
    const checked = document.querySelectorAll(".fsc-item-check:checked");
    if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
    if(!confirm(`${checked.length}টি প্রোডাক্ট এই ক্যাটাগরি থেকে সরাবেন?`)) return;
    try{
      for(const cb of checked){
        await remove(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${cb.dataset.pid}`));
      }
      await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
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

  const selectAllBox = document.getElementById("fsc-add-select-all");
  if(selectAllBox){
    selectAllBox.onchange = () => {
      document.querySelectorAll(".fsc-add-check").forEach(cb => { cb.checked = selectAllBox.checked; });
    };
  }

  const saveAllBtn = document.getElementById("fsc-add-save-all-btn");
  const saveStatusEl = document.getElementById("fsc-add-save-status");
  if(saveAllBtn){
    saveAllBtn.onclick = async () => {
      const checked = document.querySelectorAll(".fsc-add-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      let successCount = 0, failCount = 0;
      for(const cb of checked){
        const card = cb.closest(".card");
        if(!card || !card._doSave) continue;
        saveStatusEl.textContent = `সেভ হচ্ছে... (${successCount + failCount + 1}/${checked.length})`;
        try{
          await card._doSave();
          successCount++;
        }catch(err){
          failCount++;
        }
      }
      saveStatusEl.textContent = `✅ সম্পন্ন: ${successCount}টি সেভ হয়েছে` + (failCount > 0 ? `, ❌ ${failCount}টি ব্যর্থ` : "");
    };
  }

  const priceApplyBtn = document.getElementById("fsc-price-apply-btn");
  const priceStatusEl = document.getElementById("fsc-price-status");
  if(priceApplyBtn){
    priceApplyBtn.onclick = () => {
      const raw = document.getElementById("fsc-price-paste").value;
      if(!raw.trim()){ alert("প্রাইস লিস্ট পেস্ট করুন"); return; }

      function normalizeText(s){
        return (s || "").toLowerCase().replace(/[^a-z0-9\u0980-\u09ff]/g, "");
      }

      const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
      const parsed = [];
      lines.forEach(line => {
        const priceMatch = line.match(/৳\s*([\d,]+)/) || line.match(/([\d,]+)\s*$/);
        if(!priceMatch) return;
        const price = parseInt(priceMatch[1].replace(/,/g, ""));
        const namePart = line.slice(0, priceMatch.index).replace(/[—–-]+\s*$/, "").trim();
        if(!namePart || isNaN(price)) return;
        parsed.push({ normalized: normalizeText(namePart), price, original: namePart });
      });

      let matchedCount = 0;
      document.querySelectorAll(".fsc-add-title").forEach(titleInput => {
        const card = titleInput.closest(".card");
        const cardNorm = normalizeText(titleInput.value);
        const match = parsed.find(p => p.normalized === cardNorm) ||
                      parsed.find(p => cardNorm.includes(p.normalized) || p.normalized.includes(cardNorm));
        if(match && card){
          const oldPriceInput = card.querySelector(".fsc-add-oldprice");
          if(oldPriceInput){
            oldPriceInput.value = match.price;
            oldPriceInput.dispatchEvent(new Event("input"));
            matchedCount++;
          }
        }
      });

      priceStatusEl.textContent = `✅ ${matchedCount}টি প্রোডাক্টে দাম বসানো হয়েছে (মোট লিস্ট: ${parsed.length}টি লাইন)`;
    };
  }
}

function fscFilenameToTitle(filename){
  const base = filename.replace(/\.[^/.]+$/, "");
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

    div.innerHTML = `
      <label style="display:inline-block;margin-right:8px"><input type="checkbox" class="fsc-add-check"></label>
      <img class="fsc-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="fsc-add-title" value="${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="fsc-add-oldprice" value="0"></label>
      <label>Discount % <input type="number" class="fsc-add-discount" value="0" min="0" max="100" style="width:80px"></label>
      <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="fsc-add-price" value="0" readonly style="background:#222;color:#8f8"></label>
      <div class="fsc-add-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
      <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-startdate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="fsc-add-enddate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>স্টক <input type="number" class="fsc-add-stock" value="20"></label>
      <div style="clear:both"></div>
      <button type="button" class="save-btn fsc-add-save">💾 Save</button>
      <button type="button" class="danger-btn fsc-add-remove">🗑️ বাদ দিন</button>
    `;

    (function(){
      const priceInput = div.querySelector(".fsc-add-price");
      const oldPriceInput = div.querySelector(".fsc-add-oldprice");
      const discountInput = div.querySelector(".fsc-add-discount");
      const previewEl = div.querySelector(".fsc-add-item-preview");
      function fscRecalcAdd(){
        const op = parseFloat(oldPriceInput.value) || 0;
        const d = parseInt(discountInput.value) || 0;
        const newPrice = Math.round(op * (1 - d/100));
        priceInput.value = newPrice;
        const save = op - newPrice;
        if(d > 0 && save > 0){
          previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
        } else {
          previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
        }
      }
      oldPriceInput.addEventListener("input", fscRecalcAdd);
      discountInput.addEventListener("input", fscRecalcAdd);
      fscRecalcAdd();
    })();

    div.querySelector(".fsc-add-remove").onclick = () => div.remove();

    async function doSaveFsc(){
      const saveBtn = div.querySelector(".fsc-add-save");
      const itemTitle = div.querySelector(".fsc-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".fsc-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".fsc-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".fsc-add-startdate").value.trim();
      const itemEnd = div.querySelector(".fsc-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".fsc-add-stock").value) || 0;

      if(!itemTitle){ throw new Error("নাম দিন"); }

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
        await set(ref(db, `settings/flashSaleCategoryProducts/${fscSelectedCatId}/${newRef.key}`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await fscUpdateCategoryMaxDiscount(fscSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
        throw err;
      }
    }
    div._doSave = doSaveFsc;
    div.querySelector(".fsc-add-save").onclick = () => {
      doSaveFsc().catch(err => alert("❌ সমস্যা: " + err.message));
    };

    addListDiv.appendChild(div);
  });
}



/* ===================== DEALS OF THE DAY CATEGORY MANAGER ===================== */
let dotdCategoriesCache = {};
let dotdSelectedCatId = null;
let dotdSelectedCatProducts = {}; // pid -> {discountPercent, addedAt}

function loadDealsOfDayCategories(){
  const listDiv = document.getElementById("dotd-list");
  if(!listDiv) return;
  onValue(ref(db, "settings/dealsOfDayCategories"), (snapshot) => {
    dotdCategoriesCache = snapshot.val() || {};
    renderDotdList();
    if(dotdSelectedCatId && dotdCategoriesCache[dotdSelectedCatId]){
      document.getElementById("dotd-products-title").textContent = "🛍️ প্রোডাক্ট — " + (dotdCategoriesCache[dotdSelectedCatId].name||"").replace(/\n/g," ");
    }
  });

  const addBtn = document.getElementById("dotd-add-btn");
  if(addBtn){
    addBtn.onclick = async () => {
      const name = document.getElementById("dotd-name").value.trim();
      const order = parseInt(document.getElementById("dotd-order").value) || 0;
      if(!name){ alert("ক্যাটাগরির নাম দিন"); return; }
      try{
        const newRef = push(ref(db, "settings/dealsOfDayCategories"));
        await set(newRef, { name, order, createdAt: Date.now() });
        document.getElementById("dotd-name").value = "";
        document.getElementById("dotd-order").value = "0";
        alert("✅ ক্যাটাগরি যোগ হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);
      }
    };
  }
}

function renderDotdList(){
  const listDiv = document.getElementById("dotd-list");
  if(!listDiv) return;
  const entries = Object.entries(dotdCategoriesCache).sort((a,b)=>(a[1].order||0)-(b[1].order||0));
  if(entries.length === 0){
    listDiv.innerHTML = "<p style=\"color:#888\">কোনো Deals of the Day ক্যাটাগরি নেই</p>";
    return;
  }
  listDiv.innerHTML = "";
  entries.forEach(([id, item]) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;cursor:pointer";
    div.innerHTML = `
      <h3 class="dotd-cat-name" style="margin:0;flex:1">${(item.name||"").replace(/</g,"&lt;")}</h3>
      <div style="display:flex;gap:8px">
        <button class="save-btn dotd-edit-btn">✏️ Edit</button>
        <button class="danger-btn dotd-delete-btn">🗑️ Delete</button>
      </div>
    `;
    div.querySelector(".dotd-cat-name").onclick = () => selectDotdCategory(id);
    div.querySelector(".dotd-edit-btn").onclick = (e) => {
      e.stopPropagation();
      const h3 = div.querySelector(".dotd-cat-name");
      const currentName = item.name || "";
      h3.outerHTML = `<div class="dotd-cat-editbox" style="flex:1;display:flex;gap:8px;align-items:center">
        <input type="text" class="dotd-cat-name-input" value="${currentName.replace(/"/g,"&quot;")}" style="flex:1">
        <button class="save-btn dotd-cat-save-btn">💾</button>
      </div>`;
      const editBox = div.querySelector(".dotd-cat-editbox");
      const input = editBox.querySelector(".dotd-cat-name-input");
      const saveBtn = editBox.querySelector(".dotd-cat-save-btn");
      const editBtn = div.querySelector(".dotd-edit-btn");
      editBtn.style.display = "none";
      input.focus();
      saveBtn.onclick = async (ev) => {
        ev.stopPropagation();
        const newName = input.value.trim();
        if(!newName){ alert("নাম খালি রাখা যাবে না"); return; }
        try{
          await update(ref(db, "settings/dealsOfDayCategories/"+id), { name: newName });
        }catch(err){ alert("❌ Error: " + err.message); }
      };
    };
    div.querySelector(".dotd-delete-btn").onclick = async (e) => {
      e.stopPropagation();
      if(!confirm(`"${item.name}" ক্যাটাগরি এবং এর সব প্রোডাক্ট লিংক ডিলিট করবেন? (মূল প্রোডাক্ট ডিলিট হবে না)`)) return;
      try{
        await remove(ref(db, "settings/dealsOfDayCategories/"+id));
        await remove(ref(db, "settings/dealsOfDayCategoryProducts/"+id));
        if(dotdSelectedCatId === id){
          dotdSelectedCatId = null;
          document.getElementById("dotd-products-panel").style.display = "none";
        }
      }catch(err){ alert("❌ Error: " + err.message); }
    };
    listDiv.appendChild(div);
  });
}

function selectDotdCategory(catId){
  dotdSelectedCatId = catId;
  const panel = document.getElementById("dotd-products-panel");
  panel.style.display = "block";
  const title = document.getElementById("dotd-products-title");
  title.textContent = "🛍️ " + ((dotdCategoriesCache[catId]||{}).name||"").replace(/\\n/g," ");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("dotd-view-section").style.display = "none";
  document.getElementById("dotd-add-section").style.display = "none";

  onValue(ref(db, "settings/dealsOfDayCategoryProducts/"+catId), (snapshot) => {
    dotdSelectedCatProducts = snapshot.val() || {};
    if(dotdCurrentSubview === "owncat") renderDotdOwnCatView();
  });

  setupDotdNav();
  setupDotdAddSection();
}

let dotdCurrentSubview = "owncat";
let dotdSelectedIds = new Set();

async function dotdUpdateCategoryMaxDiscount(catId){
  try{
    const mapSnap = await get(ref(db, "settings/dealsOfDayCategoryProducts/"+catId));
    const map = mapSnap.exists() ? mapSnap.val() : {};
    let maxDiscount = 0;
    Object.values(map).forEach(info => {
      const d = parseInt(info.discountPercent) || 0;
      if(d > maxDiscount) maxDiscount = d;
    });
    const catSnap = await get(ref(db, "settings/dealsOfDayCategories/"+catId));
    if(!catSnap.exists()) return;
    const oldName = catSnap.val().name || "";
    if(/\d+\s*%/.test(oldName)){
      const newName = oldName.replace(/\d+(\s*%)/, maxDiscount + "$1");
      if(newName !== oldName){
        await update(ref(db, "settings/dealsOfDayCategories/"+catId), { name: newName });
      }
    }
  }catch(err){ console.error("dotdUpdateCategoryMaxDiscount error:", err); }
}

function setupDotdNav(){
  const navView = document.getElementById("dotd-nav-view");
  const navAdd = document.getElementById("dotd-nav-add");
  const viewSection = document.getElementById("dotd-view-section");
  const addSection = document.getElementById("dotd-add-section");

  navView.onclick = () => {
    viewSection.style.display = "block";
    addSection.style.display = "none";
    switchDotdSubview("owncat");
  };
  navAdd.onclick = () => {
    viewSection.style.display = "none";
    addSection.style.display = "block";
  };

  document.getElementById("dotd-sub-owncat").onclick = () => switchDotdSubview("owncat");
  document.getElementById("dotd-sub-all").onclick = () => switchDotdSubview("all");
  document.getElementById("dotd-sub-search").onclick = () => switchDotdSubview("search");

  // ডিফল্টে প্রোডাক্ট ভিউ খোলা থাকবে
  viewSection.style.display = "block";
  addSection.style.display = "none";
  switchDotdSubview("owncat");
}

function switchDotdSubview(mode){
  dotdCurrentSubview = mode;
  dotdSelectedIds = new Set();
  document.getElementById("dotd-search-box").style.display = (mode === "search") ? "block" : "none";
  document.getElementById("dotd-toolbar").style.display = (mode === "search") ? "none" : "block";

  if(mode === "owncat") renderDotdOwnCatView();
  else if(mode === "all") renderDotdAllProductsView();
  else if(mode === "search") renderDotdSearchView();
}

function dotdFormatPriceRow(data){
  let html = "";
  if(data.discountPrice && data.discountPrice > 0){
    html += `<span style="text-decoration:line-through;color:#888;margin-right:8px">৳${data.discountPrice}</span>`;
  }
  html += `<span style="font-weight:bold">৳${data.price||0}</span>`;
  return html;
}

function dotdBuildProductCard(pid, data, opts){
  // opts: { mode: 'owncat'|'all'|'search', mapInfo }
  const div = document.createElement("div");
  div.className = "card";
  const title = data ? (data.title || data.name || "Unnamed") : "⚠️ প্রোডাক্ট পাওয়া যায়নি";
  const mapInfo = opts.mapInfo || {};
  const isInCategory = opts.mode === "owncat";

  const checkboxHTML = isInCategory
    ? `<label style="display:inline-block;margin-right:8px"><input type="checkbox" class="dotd-item-check" data-pid="${pid}"></label>`
    : "";

  const actionBtnHTML = isInCategory
    ? `<button class="danger-btn dotd-item-remove">🗑️ Remove</button>`
    : `<button class="save-btn dotd-item-addcat">➕ এই ক্যাটাগরিতে যোগ করুন</button>`;

  const initialPrice = data ? (data.price||0) : 0;
  const initialOldPrice = (data && data.discountPrice) ? data.discountPrice : initialPrice;

  div.innerHTML = `
    ${checkboxHTML}<h3 class="dotd-item-title" style="display:inline-block">${title}</h3>
    <label>মূল দাম / Market Price (৳) <input type="number" class="dotd-item-oldprice" value="${initialOldPrice}"></label>
    <label>Discount % <input type="number" class="dotd-item-discount" value="${mapInfo.discountPercent||0}" min="0" max="100" style="width:80px"></label>
    <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="dotd-item-price" value="${initialPrice}" readonly style="background:#222;color:#8f8"></label>
    <div class="dotd-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
    <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="dotd-item-startdate" value="${mapInfo.startDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="dotd-item-enddate" value="${mapInfo.endDate||''}" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
    <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="save-btn dotd-item-save">💾 Save</button>
      ${actionBtnHTML}
    </div>
  `;

  (function(){
    const priceInput = div.querySelector(".dotd-item-price");
    const oldPriceInput = div.querySelector(".dotd-item-oldprice");
    const discountInput = div.querySelector(".dotd-item-discount");
    const previewEl = div.querySelector(".dotd-item-preview");
    function fscRecalc(){
      const op = parseFloat(oldPriceInput.value) || 0;
      const d = parseInt(discountInput.value) || 0;
      const newPrice = Math.round(op * (1 - d/100));
      priceInput.value = newPrice;
      const save = op - newPrice;
      if(d > 0 && save > 0){
        previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
      } else {
        previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
      }
    }
    oldPriceInput.addEventListener("input", fscRecalc);
    discountInput.addEventListener("input", fscRecalc);
    fscRecalc();
  })();

  div.querySelector(".dotd-item-save").onclick = async () => {
    const newOldPrice = parseFloat(div.querySelector(".dotd-item-oldprice").value) || 0;
    const newDiscount = parseInt(div.querySelector(".dotd-item-discount").value) || 0;
    const newPrice = Math.round(newOldPrice * (1 - newDiscount/100));
    const savedOldPrice = newDiscount > 0 ? newOldPrice : null;
    const newStart = div.querySelector(".dotd-item-startdate").value.trim();
    const newEnd = div.querySelector(".dotd-item-enddate").value.trim();
    try{
      await update(ref(db, "products/"+pid), { price: newPrice, discountPrice: savedOldPrice, updatedAt: Date.now() });
      if(isInCategory){
        await update(ref(db, `settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}`), {
          discountPercent: newDiscount, startDate: newStart, endDate: newEnd
        });
        await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
      }
      alert("✅ সেভ হয়েছে");
    }catch(err){ alert("❌ Error: " + err.message); }
  };

  if(isInCategory){
    div.querySelector(".dotd-item-remove").onclick = async () => {
      if(!confirm("এই প্রোডাক্টটি এই ক্যাটাগরি থেকে সরাবেন?")) return;
      try{
        await remove(ref(db, `settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}`));
        await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
      }catch(err){ alert("❌ Error: " + err.message); }
    };
  } else {
    div.querySelector(".dotd-item-addcat").onclick = async () => {
      try{
        await set(ref(db, `settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}`), { discountPercent: 0, addedAt: Date.now() });
        alert("✅ যোগ হয়েছে — এখন 'এই ক্যাটাগরির প্রোডাক্ট' এ দেখা যাবে");
      }catch(err){ alert("❌ Error: " + err.message); }
    };
  }

  return div;
}

function setupDotdToolbar(getIdsAndData){
  const selectAllBox = document.getElementById("dotd-select-all");
  selectAllBox.checked = false;
  selectAllBox.onchange = () => {
    document.querySelectorAll(".dotd-item-check").forEach(cb => {
      cb.checked = selectAllBox.checked;
      const pid = cb.dataset.pid;
      if(selectAllBox.checked) dotdSelectedIds.add(pid); else dotdSelectedIds.delete(pid);
    });
  };
  document.querySelectorAll(".dotd-item-check").forEach(cb => {
    cb.onchange = () => {
      const pid = cb.dataset.pid;
      if(cb.checked) dotdSelectedIds.add(pid); else dotdSelectedIds.delete(pid);
    };
  });

  const bulkApplyBtn = document.getElementById("dotd-bulk-apply-btn");
  const bulkSaveBtn = document.getElementById("dotd-bulk-save-btn");
  const bulkActionBtn = document.getElementById("dotd-bulk-action-btn");
  const bulkDateApplyBtn = document.getElementById("dotd-bulk-date-apply-btn");
  const statusEl = document.getElementById("dotd-bulk-status");

  if(bulkDateApplyBtn){
    bulkDateApplyBtn.onclick = () => {
      const checked = document.querySelectorAll(".dotd-item-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      const startVal = document.getElementById("dotd-bulk-startdate").value.trim();
      const endVal = document.getElementById("dotd-bulk-enddate").value.trim();
      if(!startVal && !endVal){ alert("অন্তত একটা তারিখ দিন"); return; }
      checked.forEach(cb => {
        const card = cb.closest(".card");
        const startInput = card.querySelector(".dotd-item-startdate");
        const endInput = card.querySelector(".dotd-item-enddate");
        if(startVal && startInput) startInput.value = startVal;
        if(endVal && endInput) endInput.value = endVal;
      });
      statusEl.textContent = "✅ সিলেক্টেড " + checked.length + "টি প্রোডাক্টে তারিখ বসানো হয়েছে, এখন Save চাপুন";
      setTimeout(()=>{ statusEl.textContent=""; }, 4000);
    };
  }

  bulkApplyBtn.onclick = () => {
    const val = parseInt(document.getElementById("dotd-bulk-discount").value);
    if(isNaN(val) || val < 0 || val > 100){ alert("সঠিক % দিন (0-100)"); return; }
    document.querySelectorAll(".dotd-item-check:checked").forEach(cb => {
      const card = cb.closest(".card");
      const discInput = card.querySelector(".dotd-item-discount");
      if(discInput) discInput.value = val;
      const oldPriceInput = card.querySelector(".dotd-item-oldprice");
      const priceInput = card.querySelector(".dotd-item-price");
      const previewEl = card.querySelector(".dotd-item-preview");
      if(oldPriceInput && priceInput){
        const op = parseFloat(oldPriceInput.value) || 0;
        const newPrice = Math.round(op * (1 - val/100));
        priceInput.value = newPrice;
        if(previewEl){
          const save = op - newPrice;
          if(val > 0 && save > 0){
            previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
          } else {
            previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
          }
        }
      }
    });
    statusEl.textContent = "✅ সিলেক্টেড প্রোডাক্টে % বসানো হয়েছে, এখন Save চাপুন";
    setTimeout(()=>{ statusEl.textContent=""; }, 4000);
  };

  bulkSaveBtn.onclick = async () => {
    const checked = document.querySelectorAll(".dotd-item-check:checked");
    if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
    const updates = {};
    for(const cb of checked){
      const pid = cb.dataset.pid;
      const card = cb.closest(".card");
      const oldPrice = parseFloat(card.querySelector(".dotd-item-oldprice").value) || 0;
      const discount = parseInt(card.querySelector(".dotd-item-discount").value) || 0;
      const price = Math.round(oldPrice * (1 - discount/100));
      const savedOldPrice = discount > 0 ? oldPrice : null;
      const start = card.querySelector(".dotd-item-startdate").value.trim();
      const end = card.querySelector(".dotd-item-enddate").value.trim();
      updates[`products/${pid}/price`] = price;
      updates[`products/${pid}/discountPrice`] = savedOldPrice;
      updates[`products/${pid}/updatedAt`] = Date.now();
      updates[`settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}/discountPercent`] = discount;
      updates[`settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}/startDate`] = start;
      updates[`settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${pid}/endDate`] = end;
    }
    try{
      await update(ref(db), updates);
      await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
      statusEl.textContent = `✅ ${checked.length}টি প্রোডাক্ট সেভ হয়েছে`;
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "❌ Error: " + err.message;
    }
  };

  bulkActionBtn.onclick = async () => {
    const checked = document.querySelectorAll(".dotd-item-check:checked");
    if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
    if(!confirm(`${checked.length}টি প্রোডাক্ট এই ক্যাটাগরি থেকে সরাবেন?`)) return;
    try{
      for(const cb of checked){
        await remove(ref(db, `settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${cb.dataset.pid}`));
      }
      await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
      statusEl.textContent = "✅ সরানো হয়েছে";
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "❌ Error: " + err.message;
    }
  };
}

function setupDotdViewPricePaste(){
  const btn = document.getElementById("dotd-view-price-apply-btn");
  const statusEl = document.getElementById("dotd-view-price-status");
  if(!btn) return;
  btn.onclick = () => {
    const raw = (document.getElementById("dotd-view-price-paste")||{}).value || "";
    if(!raw.trim()){ alert("প্রাইস লিস্ট পেস্ট করুন"); return; }
    function normalizeText(s){
      return (s || "").toLowerCase().replace(/[^a-z0-9\u0980-\u09ff]/g, "");
    }
    const parsed = [];
    raw.split("\n").map(l => l.trim()).filter(Boolean).forEach(line => {
      const priceMatch = line.match(/৳\s*([\d,]+)/) || line.match(/([\d,]+)\s*$/);
      if(!priceMatch) return;
      const price = parseInt(priceMatch[1].replace(/,/g, ""));
      const namePart = line.slice(0, priceMatch.index).replace(/[—–-]+\s*$/, "").trim();
      if(!namePart || isNaN(price)) return;
      parsed.push({ normalized: normalizeText(namePart), price });
    });
    let matchedCount = 0;
    document.querySelectorAll("#dotd-products-list .dotd-item-title").forEach(h3 => {
      const card = h3.closest(".card");
      if(!card) return;
      const cardNorm = normalizeText(h3.textContent);
      const match = parsed.find(p => p.normalized === cardNorm) ||
                    parsed.find(p => cardNorm.includes(p.normalized) || p.normalized.includes(cardNorm));
      if(match){
        const oldPriceInput = card.querySelector(".dotd-item-oldprice");
        if(oldPriceInput){
          oldPriceInput.value = match.price;
          oldPriceInput.dispatchEvent(new Event("input"));
          matchedCount++;
        }
      }
    });
    if(statusEl){
      statusEl.textContent = "✅ " + matchedCount + "টি প্রোডাক্টে দাম বসেছে (মোট লাইন: " + parsed.length + ") — এবার সব সিলেক্ট করে 💾 সিলেক্টেড Save চাপুন";
      setTimeout(()=>{ statusEl.textContent=""; }, 10000);
    }
  };
}

async function renderDotdOwnCatView(){
  const listDiv = document.getElementById("dotd-products-list");
  if(!listDiv) return;
  const pids = Object.keys(dotdSelectedCatProducts);
  if(pids.length === 0){
    listDiv.innerHTML = "<p style='color:#888'>এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই। 'All Products' বা 'Search' থেকে যোগ করুন।</p>";
    return;
  }
  listDiv.innerHTML = "<p style='color:#888'>লোড হচ্ছে...</p>";
  const rows = await Promise.all(pids.map(async (pid) => {
    try{
      const snap = await get(ref(db, "products/"+pid));
      return { pid, data: snap.val(), mapInfo: dotdSelectedCatProducts[pid] };
    }catch(e){ return { pid, data: null, mapInfo: dotdSelectedCatProducts[pid] }; }
  }));
  listDiv.innerHTML = "";
  rows.forEach(({pid, data, mapInfo}) => {
    listDiv.appendChild(dotdBuildProductCard(pid, data, { mode: "owncat", mapInfo }));
  });
  setupDotdToolbar();
  setupDotdViewPricePaste();
}

function renderDotdAllProductsView(){
  const listDiv = document.getElementById("dotd-products-list");
  if(!listDiv) return;
  listDiv.innerHTML = "";
  const entries = Object.entries(allProductsCache).slice(0, 100);
  if(entries.length === 0){
    listDiv.innerHTML = "<p style='color:#888'>কোনো প্রোডাক্ট পাওয়া যায়নি</p>";
    return;
  }
  entries.forEach(([pid, data]) => {
    if(dotdSelectedCatProducts[pid]) return; // আগে থেকেই আছে
    listDiv.appendChild(dotdBuildProductCard(pid, data, { mode: "all", mapInfo: {} }));
  });
  const note = document.createElement("p");
  note.style.cssText = "color:#888;font-size:12px;text-align:center;margin-top:10px";
  note.textContent = "সর্বোচ্চ ১০০টি দেখানো হচ্ছে — নির্দিষ্ট প্রোডাক্ট খুঁজতে 'Search Products' ব্যবহার করুন";
  listDiv.appendChild(note);
}

function renderDotdSearchView(){
  const listDiv = document.getElementById("dotd-products-list");
  const searchInput = document.getElementById("dotd-search-input");
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
      const isAlready = !!dotdSelectedCatProducts[pid];
      listDiv.appendChild(dotdBuildProductCard(pid, data, { mode: isAlready ? "owncat" : "all", mapInfo: dotdSelectedCatProducts[pid] || {} }));
    });
  };
}

function setupDotdAddSection(){
  const fileInput = document.getElementById("dotd-add-file-input");
  const addListDiv = document.getElementById("dotd-add-list");
  if(!fileInput || !addListDiv) return;

  fileInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    renderDotdAddList(files, addListDiv);
  };

  const selectAllBox = document.getElementById("dotd-add-select-all");
  if(selectAllBox){
    selectAllBox.onchange = () => {
      document.querySelectorAll(".dotd-add-check").forEach(cb => { cb.checked = selectAllBox.checked; });
    };
  }

  const saveAllBtn = document.getElementById("dotd-add-save-all-btn");
  const saveStatusEl = document.getElementById("dotd-add-save-status");
  if(saveAllBtn){
    saveAllBtn.onclick = async () => {
      const checked = document.querySelectorAll(".dotd-add-check:checked");
      if(checked.length === 0){ alert("কিছু সিলেক্ট করুন"); return; }
      let successCount = 0, failCount = 0;
      for(const cb of checked){
        const card = cb.closest(".card");
        if(!card || !card._doSave) continue;
        saveStatusEl.textContent = `সেভ হচ্ছে... (${successCount + failCount + 1}/${checked.length})`;
        try{
          await card._doSave();
          successCount++;
        }catch(err){
          failCount++;
        }
      }
      saveStatusEl.textContent = `✅ সম্পন্ন: ${successCount}টি সেভ হয়েছে` + (failCount > 0 ? `, ❌ ${failCount}টি ব্যর্থ` : "");
    };
  }

  const priceApplyBtn = document.getElementById("dotd-price-apply-btn");
  const priceStatusEl = document.getElementById("dotd-price-status");
  if(priceApplyBtn){
    priceApplyBtn.onclick = () => {
      const raw = document.getElementById("dotd-price-paste").value;
      if(!raw.trim()){ alert("প্রাইস লিস্ট পেস্ট করুন"); return; }

      function normalizeText(s){
        return (s || "").toLowerCase().replace(/[^a-z0-9\u0980-\u09ff]/g, "");
      }

      const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
      const parsed = [];
      lines.forEach(line => {
        const priceMatch = line.match(/৳\s*([\d,]+)/) || line.match(/([\d,]+)\s*$/);
        if(!priceMatch) return;
        const price = parseInt(priceMatch[1].replace(/,/g, ""));
        const namePart = line.slice(0, priceMatch.index).replace(/[—–-]+\s*$/, "").trim();
        if(!namePart || isNaN(price)) return;
        parsed.push({ normalized: normalizeText(namePart), price, original: namePart });
      });

      let matchedCount = 0;
      document.querySelectorAll(".dotd-add-title").forEach(titleInput => {
        const card = titleInput.closest(".card");
        const cardNorm = normalizeText(titleInput.value);
        const match = parsed.find(p => p.normalized === cardNorm) ||
                      parsed.find(p => cardNorm.includes(p.normalized) || p.normalized.includes(cardNorm));
        if(match && card){
          const oldPriceInput = card.querySelector(".dotd-add-oldprice");
          if(oldPriceInput){
            oldPriceInput.value = match.price;
            oldPriceInput.dispatchEvent(new Event("input"));
            matchedCount++;
          }
        }
      });

      priceStatusEl.textContent = `✅ ${matchedCount}টি প্রোডাক্টে দাম বসানো হয়েছে (মোট লিস্ট: ${parsed.length}টি লাইন)`;
    };
  }
}

function dotdFilenameToTitle(filename){
  const base = filename.replace(/\.[^/.]+$/, "");
  return base.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function renderDotdAddList(files, addListDiv){
  addListDiv.innerHTML = "";
  if(files.length === 0) return;

  files.forEach((file) => {
    const title = dotdFilenameToTitle(file.name);
    const div = document.createElement("div");
    div.className = "card";
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = div.querySelector(".dotd-add-preview");
      if(img) img.src = e.target.result;
    };
    reader.readAsDataURL(file);

    div.innerHTML = `
      <label style="display:inline-block;margin-right:8px"><input type="checkbox" class="dotd-add-check"></label>
      <img class="dotd-add-preview" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
      <label>নাম <input type="text" class="dotd-add-title" value="${title}"></label>
      <label>মূল দাম / Market Price (৳) <input type="number" class="dotd-add-oldprice" value="0"></label>
      <label>Discount % <input type="number" class="dotd-add-discount" value="0" min="0" max="100" style="width:80px"></label>
      <label>বর্তমান দাম (৳) — অটো ক্যালকুলেট হয় <input type="number" class="dotd-add-price" value="0" readonly style="background:#222;color:#8f8"></label>
      <div class="dotd-add-item-preview" style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:6px;font-size:14px"></div>
      <label>Offer শুরুর তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="dotd-add-startdate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>Offer শেষের তারিখ (dd-mm-yyyy, ঐচ্ছিক) <input type="text" class="dotd-add-enddate" placeholder="খালি রাখুন যদি না দেখাতে চান"></label>
      <label>স্টক <input type="number" class="dotd-add-stock" value="20"></label>
      <div style="clear:both"></div>
      <button type="button" class="save-btn dotd-add-save">💾 Save</button>
      <button type="button" class="danger-btn dotd-add-remove">🗑️ বাদ দিন</button>
    `;

    (function(){
      const priceInput = div.querySelector(".dotd-add-price");
      const oldPriceInput = div.querySelector(".dotd-add-oldprice");
      const discountInput = div.querySelector(".dotd-add-discount");
      const previewEl = div.querySelector(".dotd-add-item-preview");
      function fscRecalcAdd(){
        const op = parseFloat(oldPriceInput.value) || 0;
        const d = parseInt(discountInput.value) || 0;
        const newPrice = Math.round(op * (1 - d/100));
        priceInput.value = newPrice;
        const save = op - newPrice;
        if(d > 0 && save > 0){
          previewEl.innerHTML = '<span style="text-decoration:line-through;color:#888">৳' + op + '</span> → <strong style="color:#8f8">৳' + newPrice + '</strong> &nbsp; <span style="color:#fc6">(Save ৳' + save + ')</span>';
        } else {
          previewEl.innerHTML = '<strong>৳' + newPrice + '</strong> <span style="color:#888">(কোনো ডিসকাউন্ট নেই)</span>';
        }
      }
      oldPriceInput.addEventListener("input", fscRecalcAdd);
      discountInput.addEventListener("input", fscRecalcAdd);
      fscRecalcAdd();
    })();

    div.querySelector(".dotd-add-remove").onclick = () => div.remove();

    async function doSaveDotd(){
      const saveBtn = div.querySelector(".dotd-add-save");
      const itemTitle = div.querySelector(".dotd-add-title").value.trim();
      const itemOldPriceRaw = parseFloat(div.querySelector(".dotd-add-oldprice").value) || 0;
      const itemDiscount = parseInt(div.querySelector(".dotd-add-discount").value) || 0;
      const itemPrice = Math.round(itemOldPriceRaw * (1 - itemDiscount/100));
      const itemOldPrice = itemDiscount > 0 ? itemOldPriceRaw : null;
      const itemStart = div.querySelector(".dotd-add-startdate").value.trim();
      const itemEnd = div.querySelector(".dotd-add-enddate").value.trim();
      const itemStock = parseInt(div.querySelector(".dotd-add-stock").value) || 0;

      if(!itemTitle){ throw new Error("নাম দিন"); }

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
        await set(ref(db, `settings/dealsOfDayCategoryProducts/${dotdSelectedCatId}/${newRef.key}`), {
          discountPercent: itemDiscount, startDate: itemStart, endDate: itemEnd, addedAt: Date.now()
        });
        await dotdUpdateCategoryMaxDiscount(dotdSelectedCatId);
        saveBtn.textContent = "✅ সেভ হয়েছে";
      }catch(err){
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save";
        throw err;
      }
    }
    div._doSave = doSaveDotd;
    div.querySelector(".dotd-add-save").onclick = () => {
      doSaveDotd().catch(err => alert("❌ সমস্যা: " + err.message));
    };

    addListDiv.appendChild(div);
  });
}


/* ===================== TRENDING PRODUCTS MANAGER ===================== */
function loadTrending(){
  if(!trendingDiv) return;
  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{
    trendingCache = {};
    snapshot.forEach(child=>{
      const data = child.val();
      if(data.status === "active") trendingCache[child.key] = data;
    });
    renderTrending(trendingSearchInput ? trendingSearchInput.value : "");
  });

  if(trendingSearchInput){
    trendingSearchInput.addEventListener("input", () => {
      renderTrending(trendingSearchInput.value);
    });
  }
}

function renderTrending(filterText){
  trendingDiv.innerHTML="<div class='section-title'><h3>🔥 Trending Products</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  Object.keys(trendingCache).forEach(key=>{
    const data = trendingCache[key];
    const name = (data.title || data.name || "").toLowerCase();
    if(search && !name.includes(search)) return;
    count++;

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${data.title || data.name}</h3>
      <p>মূল দাম: ৳${data.price}</p>
      <label><input type="checkbox" class="tr-toggle" ${data.isTrending ? "checked" : ""}> Trending-এ যুক্ত করুন</label>
      <label>Discount %:
        <input type="number" class="tr-discount" value="${data.discountPercent||0}" min="0" max="100">
      </label>
      <button class="save-btn">Save</button>
    `;

    div.querySelector(".save-btn").onclick = async () => {
      const isOn = div.querySelector(".tr-toggle").checked;
      const discount = parseInt(div.querySelector(".tr-discount").value) || 0;
      try{
        await update(ref(db,"products/"+key), {
          isTrending: isOn,
          discountPercent: discount,
          updatedAt: Date.now()
        });
        alert("✅ Trending আপডেট হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);
      }
    };

    trendingDiv.appendChild(div);
  });

  if(count === 0) trendingDiv.innerHTML += "<p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>";
}

/* ===================== SELLER REQUEST APPROVAL ===================== */
function loadSellerRequests(){
  if(!sellerReqDiv) return;
  const reqRef = ref(db,"sellerRequests");
  onValue(reqRef,(snapshot)=>{
    sellerReqDiv.innerHTML="<div class='section-title'><h3>🏪 Seller আবেদন</h3></div>";
    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();
      if(data.status !== "pending") return;
      count++;

      const div = document.createElement("div");
      div.className="card";

      div.innerHTML=`
        <h3>${data.storeName}</h3>
        <p>নাম: ${data.ownerName || '-'}</p>
        <p>ফোন: ${data.phone || '-'}</p>
        <p>ঠিকানা: ${data.address || '-'}</p>
        <p>Location: ${data.location || '-'}</p>
        <p>ডকুমেন্ট: ${data.documents || '-'}</p>
        <p>UID: ${data.uid}</p>
        <p>Status: ${data.status}</p>
        <label>কমিশন হার (%): <input type="number" class="commission-rate" value="10" min="0" max="100" style="width:70px"></label>
        <button class="approve-seller">Approve</button>
        <button class="reject-seller">Reject</button>
      `;

      div.querySelector(".approve-seller").onclick = async () => {
        const rate = parseFloat(div.querySelector(".commission-rate").value) || 10;
        const now = Date.now();
        const updates = {};
        updates[`sellerRequests/${key}/status`] = "approved";
        updates[`sellers/${data.uid}`] = {
          ownerUid: data.uid,
          storeName: data.storeName,
          status: "approved",
          commissionRate: rate,
          createdAt: now,
          updatedAt: now
        };
        updates[`users/${data.uid}/role`] = "seller";
        updates[`users/${data.uid}/updatedAt`] = now;

        try{
          await update(ref(db), updates);
          alert("Seller approved ✅");
        }catch(err){
          alert("Error: " + err.message);
        }
      };

      div.querySelector(".reject-seller").onclick = () => {
        if(confirm("এই আবেদন বাতিল করবেন?")){
          update(ref(db,"sellerRequests/"+key),{status:"rejected"});
        }
      };

      sellerReqDiv.appendChild(div);
    });

    if(count === 0) sellerReqDiv.innerHTML += "<p>কোনো pending seller আবেদন নেই।</p>";
  });
}

/* ===================== APPROVED SELLERS - EDIT COMMISSION ===================== */
function loadSellerCommissions(){
  if(!sellerCommDiv) return;
  const sellersRef = ref(db,"sellers");
  onValue(sellersRef,(snapshot)=>{
    sellerCommDiv.innerHTML="<div class='section-title'><h3>💰 Approved Sellers — কমিশন এডিট</h3></div>";

    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();
      if(data.status !== "approved") return;
      count++;

      const div = document.createElement("div");
      div.className="card";

      div.innerHTML=`
        <h3>${data.storeName}</h3>
        <p>UID: ${key}</p>
        <label>কমিশন হার (%):
          <input type="number" class="edit-commission" value="${data.commissionRate||10}" min="0" max="100">
        </label>
        <button class="save-commission">Save</button>
      `;

      div.querySelector(".save-commission").onclick = async () => {
        const rate = parseFloat(div.querySelector(".edit-commission").value) || 0;
        try{
          await update(ref(db,"sellers/"+key), {
            commissionRate: rate,
            updatedAt: Date.now()
          });
          alert("✅ কমিশন আপডেট হয়েছে");
        }catch(err){
          alert("Error: " + err.message);
        }
      };

      sellerCommDiv.appendChild(div);
    });

    if(count === 0) sellerCommDiv.innerHTML += "<p>কোনো অনুমোদিত seller নেই।</p>";
  });
}

/* ===================== DELIVERED ORDERS + COMMISSION + STOCK SYNC ===================== */
function loadDeliveredOrders(){
  if(!ordersDiv) return;
  const ordersRef = ref(db,"orders");

  onValue(ordersRef,(snapshot)=>{
    ordersDiv.innerHTML="<div class='section-title'><h3>📦 Delivered Orders — Commission বাকি</h3></div>";

    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();

      if(data.status !== "delivered" || data.commissionAdded) return;
      count++;

      const div = document.createElement("div");
      div.className="card";
      div.innerHTML=`
        <h3>Order #${key.slice(0,8)}</h3>
        <p>Seller ID: ${data.sellerId}</p>
        <p>Total: ${adminFmt(data.total)}</p>
        <button class="add-commission">Confirm & Add Commission</button>
      `;

      div.querySelector(".add-commission").onclick = async () => {
        try{
          const sellerSnap = await get(ref(db, `sellers/${data.sellerId}/commissionRate`));
          const rate = sellerSnap.exists() ? sellerSnap.val() : 10;
          const amount = data.total * (rate/100);

          const newComm = push(ref(db,"commissions"));
          await set(newComm, {
            sellerId: data.sellerId,
            orderId: key,
            amount: amount,
            rate: rate,
            createdAt: Date.now()
          });

          const items = data.items || [];
          for(const item of items){
            const productRef = ref(db, "products/"+item.id);
            const pSnap = await get(productRef);
            if(pSnap.exists()){
              const p = pSnap.val();
              const qty = Number(item.qty || 1);
              let newStock = Number(p.stock || 0) - qty;
              if(newStock < 0) newStock = 0;
              const newSoldCount = Number(p.soldCount || 0) + qty;
              await update(productRef, { stock: newStock, soldCount: newSoldCount });
            }
          }

          const sellerEarning = data.total - amount;
          const walletRef = ref(db, "wallets/"+data.sellerId);
          const walletSnap = await get(walletRef);
          const currentBalance = walletSnap.exists() ? (walletSnap.val().balance || 0) : 0;
          await set(walletRef, {
            balance: currentBalance + sellerEarning,
            currency: "BDT",
            updatedAt: Date.now()
          });

          await update(ref(db,"orders/"+key), { commissionAdded: true });
          alert(`কমিশন যোগ হয়েছে: ৳${amount.toFixed(2)} (${rate}%), Seller Wallet-এ ৳${sellerEarning.toFixed(2)} যোগ হয়েছে, এবং স্টক আপডেট হয়েছে`);
        }catch(err){
          alert("Error: " + err.message);
        }
      };

      ordersDiv.appendChild(div);
    });

    if(count === 0) ordersDiv.innerHTML += "<p>কোনো নতুন delivered অর্ডার নেই।</p>";
  });
}

/* ===================== ADMIN NOTEPAD (secret notes) ===================== */
function loadNotepad(){
  if(!notepadDiv) return;

  notepadDiv.innerHTML = `
    <div class="section-title"><h3>📝 Admin Notepad (গোপন নোট)</h3></div>
    <div class="card">
      <textarea id="notepad-text" rows="10" placeholder="এখানে গোপন তথ্য/নোট লিখে রাখুন..."></textarea>
      <button id="notepad-save" class="save-btn">Save Note</button>
      <span id="notepad-status" style="margin-left:10px;font-size:13px;color:#8f8"></span>
    </div>
  `;

  const textarea = document.getElementById("notepad-text");
  const statusEl = document.getElementById("notepad-status");

  get(ref(db, "adminNotes/main")).then(snap => {
    if(snap.exists()){
      textarea.value = snap.val().content || "";
    }
  });

  document.getElementById("notepad-save").onclick = async () => {
    try{
      await set(ref(db,"adminNotes/main"), {
        content: textarea.value,
        updatedBy: currentAdminUid,
        updatedAt: Date.now()
      });
      statusEl.textContent = "✅ সেভ হয়েছে " + new Date().toLocaleTimeString();
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "Error: " + err.message;
    }
  };
}

/* ===================== NOTIFICATION BELL ===================== */
function loadNotificationBell(){
  const bell = document.getElementById("notifBell");
  const badge = document.getElementById("notifBadge");
  const dropdown = document.getElementById("notifDropdown");
  if(!bell || !badge || !dropdown) return;

  let pendingOrdersData = [];
  let pendingSellersData = [];
  let pendingProductsData = [];
  let pendingWithdrawsData = [];

  function renderDropdown(){
    const total = pendingOrdersData.length + pendingSellersData.length + pendingProductsData.length + pendingWithdrawsData.length;

    if(total === 0){
      badge.style.display = "none";
      dropdown.innerHTML = `<div class="notif-empty">কোনো নতুন নোটিফিকেশন নেই।</div>`;
      return;
    }

    badge.style.display = "flex";
    badge.textContent = total > 99 ? "99+" : total;

    let html = "";

    pendingProductsData.forEach(p => {
      html += `<div class="notif-item" data-tab="pending">🆕 নতুন প্রোডাক্ট — ${p.title || 'N/A'}</div>`;
    });

    pendingOrdersData.forEach(o => {
      html += `<div class="notif-item" data-tab="orders">📦 নতুন অর্ডার — ৳${o.total || 0} (${o.key.slice(0,6)})</div>`;
    });

    pendingSellersData.forEach(s => {
      html += `<div class="notif-item" data-tab="sellerreq">🏪 নতুন Seller আবেদন — ${s.storeName || 'N/A'}</div>`;
    });

    pendingWithdrawsData.forEach(w => {
      html += `<div class="notif-item" data-tab="finance">💳 নতুন Withdraw — ৳${w.amount || 0}</div>`;
    });

    dropdown.innerHTML = html;

    dropdown.querySelectorAll(".notif-item").forEach(item => {
      item.addEventListener("click", () => {
        const tab = item.dataset.tab;
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        if(tabBtn) tabBtn.click();
        dropdown.classList.remove("active");
      });
    });
  }

  onValue(ref(db,"orders"), (snapshot) => {
    pendingOrdersData = [];
    snapshot.forEach(child => {
      const d = child.val();
      if(d.status === "pending"){
        pendingOrdersData.push({ key: child.key, total: d.total });
      }
    });
    renderDropdown();
  });

  onValue(ref(db,"sellerRequests"), (snapshot) => {
    pendingSellersData = [];
    snapshot.forEach(child => {
      const d = child.val();
      if(d.status === "pending"){
        pendingSellersData.push({ key: child.key, storeName: d.storeName });
      }
    });
    renderDropdown();
  });

  onValue(ref(db,"products"), (snapshot) => {
    pendingProductsData = [];
    snapshot.forEach(child => {
      const d = child.val();
      if(d.status === "pending"){
        pendingProductsData.push({ key: child.key, title: d.title || d.name });
      }
    });
    renderDropdown();
  });

  onValue(ref(db,"withdrawRequests"), (snapshot) => {
    pendingWithdrawsData = [];
    snapshot.forEach(child => {
      const d = child.val();
      if(d.status === "pending"){
        pendingWithdrawsData.push({ key: child.key, amount: d.amount });
      }
    });
    renderDropdown();
  });

  bell.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if(!bell.contains(e.target)){
      dropdown.classList.remove("active");
    }
  });
}

/* ===================== ALL SELLERS - LIST + SUSPEND/DELETE ===================== */
function loadAllSellers(){
  const allSellersDiv = document.getElementById("all-sellers");
  if(!allSellersDiv) return;

  const sellersRef = ref(db,"sellers");

  onValue(sellersRef,(snapshot)=>{
    allSellersDiv.innerHTML = "<div class='section-title'><h3>👥 সব Seller</h3></div>";

    let counts = { approved: 0, pending: 0, rejected: 0, suspended: 0 };
    const rows = [];

    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      if(counts[data.status] !== undefined) counts[data.status]++;
      rows.push({ key, data });
    });

    const summary = document.createElement("div");
    summary.className = "card";
    summary.innerHTML = `
      <p>✅ Approved: <b>${counts.approved}</b> &nbsp; ⏳ Pending: <b>${counts.pending}</b> &nbsp; ❌ Rejected: <b>${counts.rejected}</b> &nbsp; 🚫 Suspended: <b>${counts.suspended}</b></p>
    `;
    allSellersDiv.appendChild(summary);

    if(rows.length === 0){
      allSellersDiv.innerHTML += "<p>কোনো seller নেই।</p>";
      return;
    }

    rows.forEach(({key, data}) => {
      const div = document.createElement("div");
      div.className = "card";

      const statusColor = {
        approved: "#2ecc71",
        pending: "#f39c12",
        rejected: "#c0392b",
        suspended: "#7f8c8d"
      }[data.status] || "#999";

      div.innerHTML = `
        <h3>${data.storeName || 'N/A'}</h3>
        <p>UID: ${key}</p>
        <p>Status: <span style="color:${statusColor};font-weight:bold">${data.status}</span></p>
        <p>কমিশন হার: ${data.commissionRate || 0}%</p>
        <p style="font-size:12px;color:#999">যোগদান: ${data.createdAt ? new Date(data.createdAt).toLocaleDateString('bn-BD') : '-'}</p>
        <button class="toggle-suspend-btn" style="background:${data.status === 'suspended' ? '#2ecc71' : '#e67e22'}">
          ${data.status === 'suspended' ? '✅ Reactivate' : '🚫 Suspend'}
        </button>
        <button class="delete-seller-btn" style="background:#c0392b">🗑️ Delete Seller</button>
      `;

      div.querySelector(".toggle-suspend-btn").onclick = async () => {
        const newStatus = data.status === "suspended" ? "approved" : "suspended";
        if(!confirm(`এই seller-কে ${newStatus === 'suspended' ? 'Suspend' : 'Reactivate'} করবেন?`)) return;
        try{
          await update(ref(db,"sellers/"+key), { status: newStatus, updatedAt: Date.now() });
        }catch(err){
          alert("Error: " + err.message);
        }
      };

      div.querySelector(".delete-seller-btn").onclick = async () => {
        if(!confirm(`⚠️ এই seller-কে সম্পূর্ণ ডিলিট করবেন? এই কাজ Undo করা যাবে না।\n\nদোকান: ${data.storeName}`)) return;
        try{
          await remove(ref(db,"sellers/"+key));
          await update(ref(db,"users/"+key), { role: "customer", updatedAt: Date.now() });
          alert("✅ Seller ডিলিট করা হয়েছে");
        }catch(err){
          alert("❌ Error: " + err.message);
        }
      };

      allSellersDiv.appendChild(div);
    });
  });
}

/* ===================== FINANCE PANEL ===================== */
function loadFinancePanel(){
  const panel = document.getElementById("finance-panel");
  if(!panel) return;

  let totalRevenue = 0;
  let totalCommission = 0;
  let totalWalletBalance = 0;
  let withdrawRows = [];

  function render(){
    panel.innerHTML = `
      <div class="card">
        <h3>📊 আর্থিক সারাংশ</h3>
        <p>মোট Revenue (Delivered): <b>${adminFmt(totalRevenue)}</b></p>
        <p>মোট Commission আয় (Admin): <b>${adminFmt(totalCommission)}</b></p>
        <p>Seller-দের মোট Wallet ব্যালেন্স: <b>${adminFmt(totalWalletBalance)}</b></p>
      </div>
      <div class="section-title"><h3>💳 Withdraw Requests</h3></div>
    `;

    if(withdrawRows.length === 0){
      panel.innerHTML += "<p>কোনো Withdraw request নেই।</p>";
      return;
    }

    withdrawRows.forEach(({key, data}) => {
      const div = document.createElement("div");
      div.className = "card";

      const statusColor = {
        pending: "#f39c12",
        approved: "#2ecc71",
        rejected: "#c0392b",
        paid: "#2ecc71"
      }[data.status] || "#999";

      div.innerHTML = `
        <p>Seller UID: ${data.userId}</p>
        <p>পরিমাণ: <b>${adminFmt(data.amount)}</b></p>
        <p>মাধ্যম: ${data.bankDetails || '-'}</p>
        <p>Status: <span style="color:${statusColor};font-weight:bold">${data.status}</span></p>
        <p style="font-size:12px;color:#999">${new Date(data.createdAt).toLocaleString('bn-BD')}</p>
        ${data.status === "pending" ? `
          <button class="wd-approve-btn" style="background:#2ecc71">✅ Approve & Paid</button>
          <button class="wd-reject-btn" style="background:#c0392b">❌ Reject</button>
        ` : ''}
      `;

      if(data.status === "pending"){
        div.querySelector(".wd-approve-btn").onclick = async () => {
          if(!confirm(`৳${data.amount} পেমেন্ট সম্পন্ন করেছেন কি? এটা Seller-এর Wallet থেকে কেটে নেওয়া হবে।`)) return;
          try{
            const walletRef = ref(db, "wallets/"+data.userId);
            const walletSnap = await get(walletRef);
            const currentBalance = walletSnap.exists() ? (walletSnap.val().balance || 0) : 0;

            if(currentBalance < data.amount){
              alert("⚠️ Seller-এর Wallet balance যথেষ্ট নেই।");
              return;
            }

            await set(walletRef, {
              balance: currentBalance - data.amount,
              currency: "BDT",
              updatedAt: Date.now()
            });

            await update(ref(db,"withdrawRequests/"+key), { status: "paid" });
            alert("✅ Withdraw সম্পন্ন হয়েছে।");
          }catch(err){
            alert("❌ Error: " + err.message);
          }
        };

        div.querySelector(".wd-reject-btn").onclick = async () => {
          if(!confirm("এই Withdraw request বাতিল করবেন?")) return;
          try{
            await update(ref(db,"withdrawRequests/"+key), { status: "rejected" });
          }catch(err){
            alert("❌ Error: " + err.message);
          }
        };
      }

      panel.appendChild(div);
    });
  }

  onValue(ref(db,"orders"), (snapshot) => {
    totalRevenue = 0;
    snapshot.forEach(child => {
      const o = child.val();
      if(o.status === "delivered") totalRevenue += (o.total || 0);
    });
    render();
  });

  onValue(ref(db,"commissions"), (snapshot) => {
    totalCommission = 0;
    snapshot.forEach(child => {
      totalCommission += (child.val().amount || 0);
    });
    render();
  });

  onValue(ref(db,"wallets"), (snapshot) => {
    totalWalletBalance = 0;
    snapshot.forEach(child => {
      totalWalletBalance += (child.val().balance || 0);
    });
    render();
  });

  onValue(ref(db,"withdrawRequests"), (snapshot) => {
    withdrawRows = [];
    snapshot.forEach(child => {
      withdrawRows.push({ key: child.key, data: child.val() });
    });
    withdrawRows.reverse();
    render();
  });
}

/* ===================== ALL ORDERS - FILTER + STATUS UPDATE ===================== */
function loadAllOrdersPanel(){
  const filterBar = document.getElementById("order-filter-bar");
  const ordersDiv = document.getElementById("all-orders");
  if(!filterBar || !ordersDiv) return;

  let allOrdersData = [];
  let currentFilter = "all";

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
  const statusLabels = {
    all: "সব", pending: "Pending", processing: "Processing",
    shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded"
  };

  filterBar.innerHTML = statuses.map(s =>
    `<button class="order-filter-btn ${s==='all'?'active':''}" data-status="${s}" style="padding:8px 12px;margin:3px;border:none;border-radius:6px;cursor:pointer;background:${s==='all'?'#2980b9':'#333'};color:#fff">${statusLabels[s]}</button>`
  ).join("");

  filterBar.querySelectorAll(".order-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.status;
      filterBar.querySelectorAll(".order-filter-btn").forEach(b => {
        b.style.background = "#333";
        b.classList.remove("active");
      });
      btn.style.background = "#2980b9";
      btn.classList.add("active");
      renderOrders();
    });
  });

  function renderOrders(){
    ordersDiv.innerHTML = "";
    const filtered = currentFilter === "all" ? allOrdersData : allOrdersData.filter(o => o.data.status === currentFilter);

    if(filtered.length === 0){
      ordersDiv.innerHTML = "<p>কোনো অর্ডার পাওয়া যায়নি।</p>";
      return;
    }

    filtered.forEach(({key, data}) => {
      const div = document.createElement("div");
      div.className = "card";

      const addr = data.shippingAddress || {};
      const statusColor = {
        pending: "#f39c12", processing: "#3498db", shipped: "#9b59b6",
        delivered: "#2ecc71", cancelled: "#c0392b", refunded: "#7f8c8d"
      }[data.status] || "#999";

      div.innerHTML = `
        <h3>Order #${key.slice(0,8)}</h3>
        <p>ক্রেতা: ${addr.name || 'N/A'} | ফোন: ${addr.phone || '-'}</p>
        <p>ঠিকানা: ${addr.address || '-'} (${addr.area || '-'})</p>
        <p>Total: ${adminFmt(data.total)}</p>
        <p>Payment: ${data.paymentId || '-'}</p>
        <p>Status: <span style="color:${statusColor};font-weight:bold">${data.status}</span></p>
        <p style="font-size:12px;color:#999">${new Date(data.createdAt).toLocaleString('bn-BD')}</p>
        <select class="order-status-select">
          ${statuses.filter(s=>s!=='all').map(s => `<option value="${s}" ${data.status===s?'selected':''}>${statusLabels[s]}</option>`).join("")}
        </select>
        <button class="order-status-save">Update Status</button>
      `;

      div.querySelector(".order-status-save").onclick = async () => {
        const newStatus = div.querySelector(".order-status-select").value;
        try{
          await update(ref(db,"orders/"+key), { status: newStatus, updatedAt: Date.now() });
          alert("✅ Status আপডেট হয়েছে");
        }catch(err){
          alert("❌ Error: " + err.message);
        }
      };

      ordersDiv.appendChild(div);
    });
  }

  onValue(ref(db,"orders"), (snapshot) => {
    allOrdersData = [];
    snapshot.forEach(child => {
      allOrdersData.push({ key: child.key, data: child.val() });
    });
    allOrdersData.reverse();
    renderOrders();
  });
}

/* ===================== CURRENCY RATE MANAGEMENT ===================== */
function loadCurrencyPanel(){
  const panel = document.getElementById("currency-panel");
  if(!panel) return;

  const CURRENCIES = [
    { code: "USD", label: "US Dollar ($)" },
    { code: "EUR", label: "Euro (€)" },
    { code: "GBP", label: "British Pound (£)" },
    { code: "SAR", label: "Saudi Riyal (﷼)" },
    { code: "AED", label: "UAE Dirham (د.إ)" },
    { code: "QAR", label: "Qatari Riyal (﷼)" },
    { code: "KWD", label: "Kuwaiti Dinar (د.ك)" },
    { code: "BHD", label: "Bahraini Dinar (.د.ب)" },
    { code: "OMR", label: "Omani Rial (﷼)" },
    { code: "MYR", label: "Malaysian Ringgit (RM)" },
    { code: "SGD", label: "Singapore Dollar (S$)" },
    { code: "INR", label: "Indian Rupee (₹)" },
    { code: "PKR", label: "Pakistani Rupee (₨)" },
    { code: "NPR", label: "Nepalese Rupee (₨)" },
    { code: "LKR", label: "Sri Lankan Rupee (₨)" },
    { code: "CNY", label: "Chinese Yuan (¥)" },
    { code: "JPY", label: "Japanese Yen (¥)" },
    { code: "KRW", label: "South Korean Won (₩)" },
    { code: "THB", label: "Thai Baht (฿)" },
    { code: "IDR", label: "Indonesian Rupiah (Rp)" },
    { code: "PHP", label: "Philippine Peso (₱)" },
    { code: "VND", label: "Vietnamese Dong (₫)" },
    { code: "AUD", label: "Australian Dollar (A$)" },
    { code: "NZD", label: "New Zealand Dollar (NZ$)" },
    { code: "CAD", label: "Canadian Dollar (C$)" },
    { code: "CHF", label: "Swiss Franc (Fr)" },
    { code: "SEK", label: "Swedish Krona (kr)" },
    { code: "NOK", label: "Norwegian Krone (kr)" },
    { code: "DKK", label: "Danish Krone (kr)" },
    { code: "RUB", label: "Russian Ruble (₽)" },
    { code: "TRY", label: "Turkish Lira (₺)" },
    { code: "ZAR", label: "South African Rand (R)" },
    { code: "EGP", label: "Egyptian Pound (£)" },
    { code: "NGN", label: "Nigerian Naira (₦)" },
    { code: "KES", label: "Kenyan Shilling (KSh)" },
    { code: "BRL", label: "Brazilian Real (R$)" },
    { code: "MXN", label: "Mexican Peso ($)" },
    { code: "ARS", label: "Argentine Peso ($)" },
    { code: "HKD", label: "Hong Kong Dollar (HK$)" },
    { code: "TWD", label: "Taiwan Dollar (NT$)" },
    { code: "ILS", label: "Israeli Shekel (₪)" },
    { code: "JOD", label: "Jordanian Dinar (د.ا)" },
    { code: "IQD", label: "Iraqi Dinar (ع.د)" },
    { code: "IRR", label: "Iranian Rial (﷼)" },
    { code: "AFN", label: "Afghan Afghani (؋)" },
    { code: "MMK", label: "Myanmar Kyat (K)" },
    { code: "PLN", label: "Polish Zloty (zł)" },
    { code: "UAH", label: "Ukrainian Hryvnia (₴)" },
    { code: "RON", label: "Romanian Leu (lei)" },
    { code: "MAD", label: "Moroccan Dirham (د.م.)" }
  ];

  panel.innerHTML = `
    <div class="section-title"><h3>🌍 Currency Exchange Rate</h3></div>
    <div class="card">
      <p style="font-size:13px;color:#aaa">সব প্রোডাক্টের দাম ৳ BDT-তে সেভ থাকে। এখানে ১ ইউনিট বিদেশি মুদ্রা = কত টাকা (BDT) সেট করুন। ক্রেতারা navbar থেকে মুদ্রা বেছে নিলে দাম স্বয়ংক্রিয়ভাবে কনভার্ট হয়ে দেখাবে।</p>
      <div id="currency-rate-fields"></div>
      <button id="currency-save-btn" class="save-btn">Save Rates</button>
      <span id="currency-save-status" style="margin-left:10px;font-size:13px;color:#8f8"></span>
    </div>
  `;

  const fieldsDiv = document.getElementById("currency-rate-fields");
  fieldsDiv.innerHTML = CURRENCIES.map(c => `
    <label>${c.label} — ১ ${c.code} = কত টাকা (৳)?
      <input type="number" step="0.01" class="currency-rate-input" data-code="${c.code}" value="0">
    </label>
  `).join("");

  get(ref(db, "settings/currencyRates")).then(snap => {
    if(snap.exists()){
      const rates = snap.val();
      CURRENCIES.forEach(c => {
        const input = fieldsDiv.querySelector(`[data-code="${c.code}"]`);
        if(input && rates[c.code]) input.value = rates[c.code];
      });
    } else {
      const defaults = { USD: 110, EUR: 119, GBP: 139, SAR: 29.3, AED: 30, QAR: 30.2, KWD: 358, BHD: 292, OMR: 286, MYR: 23.5, SGD: 82, INR: 1.32, PKR: 0.39, NPR: 0.83, LKR: 0.37, CNY: 15.3, JPY: 0.75, KRW: 0.081, THB: 3.1, IDR: 0.007, PHP: 1.9, VND: 0.0044, AUD: 71, NZD: 65, CAD: 80, CHF: 125, SEK: 10.4, NOK: 10.2, DKK: 16, RUB: 1.15, TRY: 3.3, ZAR: 6, EGP: 2.25, NGN: 0.068, KES: 0.85, BRL: 19.5, MXN: 5.7, ARS: 0.11, HKD: 14.1, TWD: 3.4, ILS: 30, JOD: 155, IQD: 0.084, IRR: 0.0026, AFN: 1.55, MMK: 0.052, PLN: 27.6, UAH: 2.65, RON: 24, MAD: 11 };
      CURRENCIES.forEach(c => {
        const input = fieldsDiv.querySelector(`[data-code="${c.code}"]`);
        if(input) input.value = defaults[c.code];
      });
    }
  });

  document.getElementById("currency-save-btn").onclick = async () => {
    const rates = {};
    fieldsDiv.querySelectorAll(".currency-rate-input").forEach(input => {
      rates[input.dataset.code] = parseFloat(input.value) || 0;
    });

    const statusEl = document.getElementById("currency-save-status");
    try{
      await set(ref(db, "settings/currencyRates"), rates);
      statusEl.textContent = "✅ সেভ হয়েছে " + new Date().toLocaleTimeString();
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "Error: " + err.message;
    }
  };
}

/* ===================== BULK PRODUCT UPLOAD ===================== */
function loadBulkUpload(){
  const fileInput = document.getElementById("bulk-file-input");
  const listDiv = document.getElementById("bulk-upload-list");
  if(!fileInput || !listDiv) return;

  const ALL_CATEGORIES = {
    agriculture_food_beverage: "Agriculture, Food & Beverage",
    appliances_home_appliances_large_small: "Appliances (Home Appliances, Large & Small)",
    art_collectibles_crafts: "Art, Collectibles & Crafts",
    automotive_vehicle_parts_accessories: "Automotive, Vehicle Parts & Accessories",
    baby_products_baby_essentials: "Baby Products, Baby Essentials",
    beauty_personal_care: "Beauty & Personal Care",
    books_media_music: "Books, Media & Music",
    business_industrial_machinery: "Business & Industrial, Machinery",
    cameras_photo: "Cameras & Photo",
    clothing_fashion_apparel_men_women_kids: "Clothing, Fashion & Apparel (Men, Women, Kids)",
    computers_tablets_networking: "Computers, Tablets & Networking",
    construction_building_materials: "Construction & Building Materials",
    consumer_electronics: "Consumer Electronics",
    electrical_equipment_supplies: "Electrical Equipment & Supplies",
    electronics_tv_audio_gaming: "Electronics (TV, Audio, Gaming, etc.)",
    food_grocery: "Food & Grocery",
    furniture_home_decor: "Furniture & Home Decor",
    gardening_outdoor_living: "Gardening & Outdoor Living",
    gifts_crafts: "Gifts & Crafts",
    health_medical_supplies: "Health & Medical Supplies",
    health_wellness: "Health & Wellness",
    home_kitchen: "Home & Kitchen",
    home_improvement_tools_hardware: "Home Improvement, Tools & Hardware",
    industrial_machinery_equipment: "Industrial Machinery & Equipment",
    jewelry_eyewear_watches: "Jewelry, Eyewear & Watches",
    lighting_lamps: "Lighting & Lamps",
    luggage_bags_cases: "Luggage, Bags & Cases",
    office_school_supplies: "Office & School Supplies",
    pet_supplies: "Pet Supplies",
    renewable_energy: "Renewable Energy",
    safety_security: "Safety & Security",
    shoes_accessories: "Shoes & Accessories",
    smart_home_surveillance: "Smart Home & Surveillance",
    sports_outdoors_fitness: "Sports & Outdoors, Fitness",
    toys_games_hobbies: "Toys, Games & Hobbies",
    video_games_consoles: "Video Games & Consoles",
    vehicles_transportation: "Vehicles & Transportation",
    air_conditioners_refrigerators_washing_machines: "Air Conditioners, Refrigerators, Washing Machines",
    mobile_phones_accessories: "Mobile Phones & Accessories",
    laptops_pcs: "Laptops & PCs",
    headphones_speakers_audio: "Headphones, Speakers & Audio",
    makeup_skincare_fragrance: "Makeup, Skincare & Fragrance",
    furniture_sofas_beds_etc: "Furniture (Sofas, Beds, etc.)",
    power_tools_hand_tools: "Power Tools & Hand Tools",
    drones_action_cameras: "Drones & Action Cameras",
    bicycles_scooters_electric_vehicles: "Bicycles, Scooters & Electric Vehicles",
    secondhand_refurbished_goods: "Second-Hand & Refurbished Goods",
    musical_instruments: "Musical Instruments",
    printing_supplies: "Printing Supplies",
    seasonal_festival_products: "Seasonal & Festival Products",
    islamic_religious_products: "Islamic & Religious Products",
    wedding_event_supplies: "Wedding & Event Supplies"
  };

  const PRICE_TABLE = {
    extension_board: 350, power_strip: 450, spike_guard: 550, multi_plug: 250, cube_adapter: 150,
    ceiling_fan: 2200, exhaust_fan: 900, table_fan: 1500, wall_fan: 1800, pedestal_fan: 2500,
    fan_capacitor_mk: 80, fan_regulator: 150, fan_hook: 100, fan_box: 60,
    led_bulb: 120, tube_light: 250, led_tube: 350, panel_light: 450, down_light: 300,
    flood_light: 800, street_light: 1500, spot_light: 250, emergency_light: 600, night_lamp: 150,
    batten_holder: 40, angle_holder: 50, pendant_holder: 80, e27_holder: 30, b22_holder: 30,
    mcb: 150, rccb: 800, rcbo: 1200, mccb: 2000, isolator: 300, changeover_switch: 900,
    distribution_board: 1200, mcb_box: 200,
    single_core_wire: 1800, twin_cable: 1500, flexible_cable: 800,
    armoured_cable: 2500, lan_cable: 1500, telephone_cable: 800, coaxial_cable: 700,
    pvc_conduit_pipe: 150, pvc_bend: 25, junction_box: 40, inspection_box: 60, saddle_clip: 50, coupler: 15,
    cable_tie_100mm: 50, cable_tie_150mm: 60, cable_tie_200mm: 70, cable_tie_250mm: 80, cable_tie_300mm: 90,
    cable_clip: 30, cable_gland: 40,
    indicator_lamp: 60, neon_tester: 40, line_tester: 50, digital_multimeter: 900, voltage_tester: 300,
    connector_strip: 50, terminal_block: 30, wire_connector: 20, lug_terminal: 15, ferrule: 10,
    pvc_insulation_tape: 25, heat_shrink_tube: 60, double_sided_tape: 50,
    door_bell: 350, bell_transformer: 250, timer_switch: 450, motion_sensor: 550, photo_cell_sensor: 400,
    relay: 200, contactor: 800, push_button: 60, selector_switch: 150, industrial_socket: 350,

    rice: 65, paddy: 28, wheat: 35, corn: 30, barley: 90, oats: 180, millet: 120, soybeans: 90,
    lentils: 140, chickpeas: 120, green_gram: 130, black_gram: 140, mustard_seeds: 150,
    sesame_seeds: 220, sunflower_seeds: 200, groundnuts: 160, potatoes: 30, onions: 60,
    garlic: 180, ginger: 200, turmeric: 300, fresh_vegetables: 50, fresh_fruits: 100, herbs: 150,
    tea_leaves: 400, coffee_beans: 900, cotton: 120, jute: 60, sugarcane: 40, tobacco_leaves: 250,
    animal_feed: 40, organic_fertilizer: 25, compost: 20, bio_fertilizer: 150, seeds: 100, seedlings: 15,

    frozen_foods: 350, meat: 750, chicken: 220, fish: 400, shrimp: 700, eggs: 130, milk: 80,
    cheese: 600, butter: 500, yogurt: 100, honey: 700, bread: 60, biscuits: 40, cakes: 350,
    pasta: 120, noodles: 60, rice_flour: 70, wheat_flour: 55, sugar: 130, salt: 40, spices: 250,
    cooking_oil: 180, ghee: 900, pickles: 150, sauces: 120, jam: 250, jelly: 200, chocolate: 300,
    candy: 150, snacks: 100, dry_fruits: 900, nuts: 700,

    mineral_water: 20, drinking_water: 60, soft_drinks: 60, juice: 100, fruit_juice: 120,
    energy_drinks: 100, tea: 400, green_tea: 500, coffee: 600, instant_coffee: 550,
    milk_drinks: 40, yogurt_drinks: 40, coconut_water: 80, flavored_water: 40, syrup: 250,
    smoothies: 100, protein_drinks: 350,

    organic_rice: 120, organic_vegetables: 100, organic_fruits: 150, organic_honey: 900,
    organic_tea: 600, organic_coffee: 1100, organic_spices: 350, herbal_tea: 450,
    herbal_products: 300, natural_sweeteners: 350, stevia_leaves: 500, jaggery: 150,
    coconut_sugar: 400, agave_syrup: 800, monk_fruit_sweetener: 1200, xylitol: 900
  };

  const CATEGORY_MAP = {
    extension_board: "electrical_equipment_supplies", power_strip: "electrical_equipment_supplies",
    spike_guard: "electrical_equipment_supplies", multi_plug: "electrical_equipment_supplies", cube_adapter: "electrical_equipment_supplies",
    ceiling_fan: "appliances_home_appliances_large_small", exhaust_fan: "appliances_home_appliances_large_small",
    table_fan: "appliances_home_appliances_large_small", wall_fan: "appliances_home_appliances_large_small", pedestal_fan: "appliances_home_appliances_large_small",
    fan_capacitor_mk: "electrical_equipment_supplies", fan_regulator: "electrical_equipment_supplies",
    fan_hook: "electrical_equipment_supplies", fan_box: "electrical_equipment_supplies",
    led_bulb: "lighting_lamps", tube_light: "lighting_lamps", led_tube: "lighting_lamps", panel_light: "lighting_lamps",
    down_light: "lighting_lamps", flood_light: "lighting_lamps", street_light: "lighting_lamps",
    spot_light: "lighting_lamps", emergency_light: "lighting_lamps", night_lamp: "lighting_lamps",
    batten_holder: "lighting_lamps", angle_holder: "lighting_lamps", pendant_holder: "lighting_lamps",
    e27_holder: "lighting_lamps", b22_holder: "lighting_lamps",
    mcb: "electrical_equipment_supplies", rccb: "electrical_equipment_supplies", rcbo: "electrical_equipment_supplies",
    mccb: "electrical_equipment_supplies", isolator: "electrical_equipment_supplies",
    changeover_switch: "electrical_equipment_supplies", distribution_board: "electrical_equipment_supplies", mcb_box: "electrical_equipment_supplies",
    single_core_wire: "electrical_equipment_supplies", twin_cable: "electrical_equipment_supplies", flexible_cable: "electrical_equipment_supplies",
    armoured_cable: "electrical_equipment_supplies", lan_cable: "electrical_equipment_supplies", telephone_cable: "electrical_equipment_supplies", coaxial_cable: "electrical_equipment_supplies",
    pvc_conduit_pipe: "electrical_equipment_supplies", pvc_bend: "electrical_equipment_supplies", junction_box: "electrical_equipment_supplies", inspection_box: "electrical_equipment_supplies", saddle_clip: "electrical_equipment_supplies", coupler: "electrical_equipment_supplies",
    cable_tie_100mm: "electrical_equipment_supplies", cable_tie_150mm: "electrical_equipment_supplies", cable_tie_200mm: "electrical_equipment_supplies", cable_tie_250mm: "electrical_equipment_supplies", cable_tie_300mm: "electrical_equipment_supplies",
    cable_clip: "electrical_equipment_supplies", cable_gland: "electrical_equipment_supplies",
    indicator_lamp: "electrical_equipment_supplies", neon_tester: "electrical_equipment_supplies", line_tester: "electrical_equipment_supplies", digital_multimeter: "electrical_equipment_supplies", voltage_tester: "electrical_equipment_supplies",
    connector_strip: "electrical_equipment_supplies", terminal_block: "electrical_equipment_supplies", wire_connector: "electrical_equipment_supplies", lug_terminal: "electrical_equipment_supplies", ferrule: "electrical_equipment_supplies",
    pvc_insulation_tape: "electrical_equipment_supplies", heat_shrink_tube: "electrical_equipment_supplies", double_sided_tape: "electrical_equipment_supplies",
    door_bell: "electrical_equipment_supplies", bell_transformer: "electrical_equipment_supplies", timer_switch: "electrical_equipment_supplies", motion_sensor: "electrical_equipment_supplies", photo_cell_sensor: "electrical_equipment_supplies",
    relay: "electrical_equipment_supplies", contactor: "electrical_equipment_supplies", push_button: "electrical_equipment_supplies", selector_switch: "electrical_equipment_supplies", industrial_socket: "electrical_equipment_supplies",

    rice: "agriculture_food_beverage", paddy: "agriculture_food_beverage", wheat: "agriculture_food_beverage",
    corn: "agriculture_food_beverage", barley: "agriculture_food_beverage", oats: "agriculture_food_beverage",
    millet: "agriculture_food_beverage", soybeans: "agriculture_food_beverage", lentils: "agriculture_food_beverage",
    chickpeas: "agriculture_food_beverage", green_gram: "agriculture_food_beverage", black_gram: "agriculture_food_beverage",
    mustard_seeds: "agriculture_food_beverage", sesame_seeds: "agriculture_food_beverage", sunflower_seeds: "agriculture_food_beverage",
    groundnuts: "agriculture_food_beverage", potatoes: "agriculture_food_beverage", onions: "agriculture_food_beverage",
    garlic: "agriculture_food_beverage", ginger: "agriculture_food_beverage", turmeric: "agriculture_food_beverage",
    fresh_vegetables: "agriculture_food_beverage", fresh_fruits: "agriculture_food_beverage", herbs: "agriculture_food_beverage",
    tea_leaves: "agriculture_food_beverage", coffee_beans: "agriculture_food_beverage", cotton: "agriculture_food_beverage",
    jute: "agriculture_food_beverage", sugarcane: "agriculture_food_beverage", tobacco_leaves: "agriculture_food_beverage",
    animal_feed: "agriculture_food_beverage", organic_fertilizer: "agriculture_food_beverage", compost: "agriculture_food_beverage",
    bio_fertilizer: "agriculture_food_beverage", seeds: "agriculture_food_beverage", seedlings: "agriculture_food_beverage",

    frozen_foods: "agriculture_food_beverage", meat: "agriculture_food_beverage", chicken: "agriculture_food_beverage",
    fish: "agriculture_food_beverage", shrimp: "agriculture_food_beverage", eggs: "agriculture_food_beverage",
    milk: "agriculture_food_beverage", cheese: "agriculture_food_beverage", butter: "agriculture_food_beverage",
    yogurt: "agriculture_food_beverage", honey: "agriculture_food_beverage", bread: "agriculture_food_beverage",
    biscuits: "agriculture_food_beverage", cakes: "agriculture_food_beverage", pasta: "agriculture_food_beverage",
    noodles: "agriculture_food_beverage", rice_flour: "agriculture_food_beverage", wheat_flour: "agriculture_food_beverage",
    sugar: "agriculture_food_beverage", salt: "agriculture_food_beverage", spices: "agriculture_food_beverage",
    cooking_oil: "agriculture_food_beverage", ghee: "agriculture_food_beverage", pickles: "agriculture_food_beverage",
    sauces: "agriculture_food_beverage", jam: "agriculture_food_beverage", jelly: "agriculture_food_beverage",
    chocolate: "agriculture_food_beverage", candy: "agriculture_food_beverage", snacks: "agriculture_food_beverage",
    dry_fruits: "agriculture_food_beverage", nuts: "agriculture_food_beverage",

    mineral_water: "agriculture_food_beverage", drinking_water: "agriculture_food_beverage", soft_drinks: "agriculture_food_beverage",
    juice: "agriculture_food_beverage", fruit_juice: "agriculture_food_beverage", energy_drinks: "agriculture_food_beverage",
    tea: "agriculture_food_beverage", green_tea: "agriculture_food_beverage", coffee: "agriculture_food_beverage",
    instant_coffee: "agriculture_food_beverage", milk_drinks: "agriculture_food_beverage", yogurt_drinks: "agriculture_food_beverage",
    coconut_water: "agriculture_food_beverage", flavored_water: "agriculture_food_beverage", syrup: "agriculture_food_beverage",
    smoothies: "agriculture_food_beverage", protein_drinks: "agriculture_food_beverage",

    organic_rice: "agriculture_food_beverage", organic_vegetables: "agriculture_food_beverage", organic_fruits: "agriculture_food_beverage",
    organic_honey: "agriculture_food_beverage", organic_tea: "agriculture_food_beverage", organic_coffee: "agriculture_food_beverage",
    organic_spices: "agriculture_food_beverage", herbal_tea: "agriculture_food_beverage", herbal_products: "agriculture_food_beverage",
    natural_sweeteners: "agriculture_food_beverage", stevia_leaves: "agriculture_food_beverage", jaggery: "agriculture_food_beverage",
    coconut_sugar: "agriculture_food_beverage", agave_syrup: "agriculture_food_beverage", monk_fruit_sweetener: "agriculture_food_beverage",
    xylitol: "agriculture_food_beverage"
  };

  const BULK_CATEGORY_KEYWORDS = {
    mobile_phones_accessories: ["mobile","phone","smartphone","iphone","samsung galaxy","xiaomi","oppo","vivo","realme","phone case","screen protector","charger cable","power bank"],
    laptops_pcs: ["laptop","notebook","macbook","desktop pc","computer pc","chromebook"],
    computers_tablets_networking: ["tablet","ipad","router","wifi","networking","modem","keyboard","mouse","monitor","webcam","ssd","hard drive","ram","motherboard","graphics card","cooling fan","pc case","cpu","processor"],
    consumer_electronics: ["television","tv","electronics","gadget"],
    electronics_tv_audio_gaming: ["smart tv","led tv","audio system","home theater"],
    headphones_speakers_audio: ["headphone","earphone","earbuds","speaker","bluetooth speaker","microphone","audio"],
    cameras_photo: ["camera","dslr","lens","tripod","photography"],
    drones_action_cameras: ["drone","action camera","gopro"],
    air_conditioners_refrigerators_washing_machines: ["ac ","air conditioner","refrigerator","fridge","washing machine","freezer","washer","dryer"],
    appliances_home_appliances_large_small: ["blender","microwave","oven","toaster","iron","vacuum cleaner","rice cooker","kettle"],
    beauty_personal_care: ["shampoo","soap","perfume","deodorant","razor","toothbrush"],
    makeup_skincare_fragrance: ["makeup","lipstick","skincare","cream","serum","foundation","fragrance"],
    clothing_fashion_apparel_men_women_kids: ["shirt","t-shirt","pant","jeans","dress","saree","panjabi","kurta","jacket","clothing"],
    shoes_accessories: ["shoe","sandal","sneaker","boot","slipper"],
    jewelry_eyewear_watches: ["jewelry","necklace","ring","earring","watch","sunglasses","eyewear"],
    luggage_bags_cases: ["bag","backpack","luggage","suitcase","wallet","purse"],
    baby_products_baby_essentials: ["baby","diaper","infant","stroller","baby food"],
    toys_games_hobbies: ["toy","game","puzzle","doll","lego"],
    video_games_consoles: ["playstation","xbox","nintendo","video game","gaming console","game cartridge"],
    sports_outdoors_fitness: ["sports","fitness","gym","yoga","cricket","football","exercise"],
    bicycles_scooters_electric_vehicles: ["bicycle","bike","scooter","electric vehicle","golf cart"],
    vehicles_transportation: ["car","motorcycle","vehicle","truck"],
    automotive_vehicle_parts_accessories: ["car parts","engine oil","tire","tyre","car accessories"],
    home_kitchen: ["kitchen","cookware","utensil","plate","dinner set","pan","pot"],
    furniture_home_decor: ["furniture","home decor","curtain","carpet","rug","wall art"],
    furniture_sofas_beds_etc: ["sofa","bed","mattress","chair","table","wardrobe"],
    lighting_lamps: ["light","lamp","bulb","led","chandelier","fixture","sconce","spotlight","floodlight","lantern"],
    home_improvement_tools_hardware: ["tool","hardware","screwdriver","drill","hammer","nail"],
    power_tools_hand_tools: ["power tool","hand tool","wrench","saw"],
    gardening_outdoor_living: ["garden","plant","pot","outdoor","lawn"],
    pet_supplies: ["pet","dog food","cat food","aquarium","pet toy"],
    office_school_supplies: ["pen","pencil","notebook","paper","stapler","office supplies","school bag"],
    books_media_music: ["book","novel","magazine","cd","dvd","vinyl"],
    food_grocery: ["food","grocery","rice","spice","snack","beverage","masala","tea","coffee","chili","turmeric","cumin","chicken","meat","biscuit","chocolate"],
    agriculture_food_beverage: ["agriculture","farming","seed","fertilizer","paddy","wheat","corn","organic"],
    health_medical_supplies: ["medical","first aid","thermometer","mask","medicine"],
    health_wellness: ["vitamin","supplement","wellness","health"],
    safety_security: ["safety","security camera","lock","alarm","cctv"],
    smart_home_surveillance: ["smart home","surveillance","smart bulb","smart plug"],
    renewable_energy: ["solar","renewable energy","solar panel"],
    construction_building_materials: ["cement","brick","construction","building material"],
    industrial_machinery_equipment: ["industrial","machinery","equipment"],
    business_industrial_machinery: ["machine","factory equipment"],
    electrical_equipment_supplies: ["wire","cable","electrical","switch","socket","mcb","fan","holder","connector","circuit","plug"],
    art_collectibles_crafts: ["art","craft","collectible","painting","handmade"],
    gifts_crafts: ["gift","craft item"]
  };

  function detectCategoryFromTitle(title){
    const nameLower = title.toLowerCase();
    for(const [categoryId, keywords] of Object.entries(BULK_CATEGORY_KEYWORDS)){
      for(const kw of keywords){
        if(nameLower.includes(kw)){
          return categoryId;
        }
      }
    }
    return "";
  }

  function filenameToTitle(filename){
    const base = filename.replace(/\.[^/.]+$/, "");
    return base.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  function filenameToKey(filename){
    return filename.replace(/\.[^/.]+$/, "");
  }

  let selectedFiles = [];

  fileInput.addEventListener("change", (e) => {
    selectedFiles = Array.from(e.target.files);
    renderBulkList();
  });

  async function renderBulkList(){
    listDiv.innerHTML = "";
    if(selectedFiles.length === 0) return;

    let COMBINED_CATEGORIES = { ...ALL_CATEGORIES };
    try{
      const scSnap = await get(ref(db, "settings/specialCategories"));
      if(scSnap.exists()){
        scSnap.forEach(child => {
          const d = child.val();
          if(d && d.slug && d.name){
            COMBINED_CATEGORIES[d.slug] = "✦ " + d.name;
          }
        });
      }
    }catch(err){
      console.error("Special categories load error:", err);
    }

    listDiv.innerHTML = `<div class="section-title"><h3>${selectedFiles.length}টি প্রোডাক্ট প্রস্তুত</h3></div>`;

    const uploadBtn = document.createElement("button");
    uploadBtn.textContent = `✅ Upload All (${selectedFiles.length})`;
    uploadBtn.className = "save-btn";
    uploadBtn.style.marginBottom = "15px";
    listDiv.appendChild(uploadBtn);

    const bulkCatWrap = document.createElement("div");
    bulkCatWrap.style.marginBottom = "15px";
    bulkCatWrap.innerHTML = `
      <label style="display:block;margin-bottom:5px">🏷️ সব আইটেমের জন্য একসাথে ক্যাটাগরি বসান:
        <select id="bulk-apply-category-select" style="margin-left:8px;max-width:220px">
          <option value="">-- ক্যাটাগরি বাছাই করুন --</option>
        </select>
        <button id="bulk-apply-category-btn" type="button" class="save-btn" style="margin-left:8px;padding:6px 12px">সবগুলোতে বসাও</button>
      </label>
    `;
    listDiv.appendChild(bulkCatWrap);

    const bulkApplySelect = bulkCatWrap.querySelector("#bulk-apply-category-select");
    Object.entries(COMBINED_CATEGORIES).forEach(([id, label])=>{
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = label;
      bulkApplySelect.appendChild(opt);
    });

    const itemsContainer = document.createElement("div");
    listDiv.appendChild(itemsContainer);

    bulkCatWrap.querySelector("#bulk-apply-category-btn").onclick = () => {
      const val = bulkApplySelect.value;
      if(!val){ alert("আগে একটা ক্যাটাগরি বাছাই করুন"); return; }
      itemsContainer.querySelectorAll(".bulk-category").forEach(sel=>{
        sel.value = val;
      });
      alert(`✅ সব প্রোডাক্টে "${COMBINED_CATEGORIES[val]}" ক্যাটাগরি বসানো হয়েছে`);
    };

    const categoryOptionsHTML = (selectedId) => Object.entries(COMBINED_CATEGORIES).map(
      ([id, label]) => `<option value="${id}" ${selectedId===id?'selected':''}>${label}</option>`
    ).join('');

    selectedFiles.forEach((file, idx) => {
      const key = filenameToKey(file.name);
      const title = filenameToTitle(file.name);
      const categoryId = CATEGORY_MAP[key] || detectCategoryFromTitle(title) || "";
      const price = PRICE_TABLE[key] || 100;

      const div = document.createElement("div");
      div.className = "card";
      div.dataset.index = idx;

      div.bulkFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = div.querySelector(".bulk-preview-img");
        if(img) img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      div.innerHTML = `
        <img class="bulk-preview-img" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
        <label>নাম <input type="text" class="bulk-title" value="${title}"></label>
        <label>দাম (৳) <input type="number" class="bulk-price" value="${price}"></label>
        <label>মার্কেট প্রাইস (ঐচ্ছিক, ৳) <input type="number" class="bulk-old-price" value="" placeholder="আসল বাজার দাম"></label>
        <label><input type="checkbox" class="bulk-flashsale"> ⚡ Flash Sale</label>
        <label><input type="checkbox" class="bulk-trending"> 🔥 Trending</label>
        <label>স্টক <input type="number" class="bulk-stock" value="20"></label>
        <label>ক্যাটাগরি
          <select class="bulk-category">
            ${categoryOptionsHTML(categoryId)}
          </select>
        </label>
        <label>বিবরণ (ঐচ্ছিক)<textarea class="bulk-desc" rows="2" placeholder="প্রোডাক্টের বিবরণ লিখুন"></textarea></label>
        <div style="clear:both"></div>
        <button type="button" class="save-btn bulk-save-btn" style="margin-top:8px">✅ Save (এককভাবে)</button>
        <button type="button" class="danger-btn bulk-remove-btn" style="margin-top:8px">🗑️ বাদ দিন</button>
      `;

      div.querySelector(".bulk-remove-btn").onclick = () => {
        div.remove();
        selectedFiles = selectedFiles.filter(f => f !== file);
        const remaining = itemsContainer.querySelectorAll(".card").length;
        const titleEl = listDiv.querySelector(".section-title h3");
        if(titleEl) titleEl.textContent = `${remaining}টি প্রোডাক্ট প্রস্তুত`;
        uploadBtn.textContent = `✅ Upload All (${remaining})`;
        if(remaining === 0){
          listDiv.innerHTML = "";
        }
      };

      div.querySelector(".bulk-save-btn").onclick = async () => {
        const saveBtn = div.querySelector(".bulk-save-btn");
        const itemTitle = div.querySelector(".bulk-title").value.trim();
        const itemPrice = parseFloat(div.querySelector(".bulk-price").value) || 0;
        const itemOldPriceEl = div.querySelector(".bulk-old-price");
        const itemOldPrice = itemOldPriceEl ? (parseFloat(itemOldPriceEl.value) || 0) : 0;
        const itemFlashSale = div.querySelector(".bulk-flashsale").checked;
        const itemTrending = div.querySelector(".bulk-trending").checked;
        const itemStock = parseInt(div.querySelector(".bulk-stock").value) || 0;
        const itemCategoryId = div.querySelector(".bulk-category").value;
        const itemDesc = div.querySelector(".bulk-desc").value.trim();

        if(!itemTitle){ alert("নাম দিন"); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = "সেভ হচ্ছে...";

        try{
          const imageUrl = await uploadToCloudinaryGlobal(file);

          const existingSnap = await get(ref(db, "products"));
          let existingKey = null;
          if(existingSnap.exists()){
            existingSnap.forEach(child=>{
              const d = child.val();
              if((d.sellerId === currentAdminUid || d.sellerId === "admin") && d.title && d.title.trim().toLowerCase() === itemTitle.toLowerCase() && d.categoryId === itemCategoryId){
                existingKey = child.key;
              }
            });
          }

          if(existingKey){
            await update(ref(db, "products/"+existingKey), {
              price: itemPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,
              isTrending: itemTrending,
              stock: itemStock,
              categoryId: itemCategoryId,
              description: itemDesc,
              status: "active",
              images: { main: imageUrl },
              updatedAt: Date.now()
            });
          }else{
            const newRef = push(ref(db, "products"));
            await set(newRef, {
              title: itemTitle,
              price: itemPrice,
              discountPrice: itemOldPrice,
              isFlashSale: itemFlashSale,
              isTrending: itemTrending,
              stock: itemStock,
              categoryId: itemCategoryId,
              description: itemDesc,
              sellerId: currentAdminUid,
              status: "active",
              createdAt: Date.now(),
              images: { main: imageUrl }
            });
          }

          saveBtn.textContent = "✅ সেভ হয়েছে";
        }catch(err){
          console.error("Individual save error:", err);
          alert("❌ সমস্যা: " + err.message);
          saveBtn.disabled = false;
          saveBtn.textContent = "✅ Save (এককভাবে)";
        }
      };

      itemsContainer.appendChild(div);
    });

    uploadBtn.onclick = async () => {
      uploadBtn.disabled = true;
      uploadBtn.textContent = "চেক করা হচ্ছে...";

      const existingByTitle = {};
      try{
        const snap = await get(ref(db, "products"));
        if(snap.exists()){
          snap.forEach(child=>{
            const d = child.val();
            if((d.sellerId === currentAdminUid || d.sellerId === "admin") && d.title){
              const compositeKey = d.title.trim().toLowerCase() + "|" + (d.categoryId || "");
              existingByTitle[compositeKey] = child.key;
            }
          });
        }
      }catch(err){
        console.error("Existing products fetch error:", err);
      }

      const cards = itemsContainer.querySelectorAll(".card");
      let successCount = 0;
      let updatedCount = 0;

      for(const card of cards){
        try{
          const title = card.querySelector(".bulk-title").value.trim();
          const price = parseFloat(card.querySelector(".bulk-price").value) || 0;
          const stock = parseInt(card.querySelector(".bulk-stock").value) || 0;
          const categoryId = card.querySelector(".bulk-category").value;
          const file = card.bulkFile;
          const desc = card.querySelector(".bulk-desc") ? card.querySelector(".bulk-desc").value.trim() : "";

          if(!title || !file) continue;

          uploadBtn.textContent = `ছবি আপলোড হচ্ছে (${successCount+1}/${cards.length})...`;
          const imageUrl = await uploadToCloudinaryGlobal(file);

          const existingKey = existingByTitle[title.toLowerCase() + "|" + categoryId];

          if(existingKey){
            await update(ref(db, "products/"+existingKey), {
              price: price,
              stock: stock,
              categoryId: categoryId,
              description: desc,
              status: "active",
              images: { main: imageUrl },
              updatedAt: Date.now()
            });
            updatedCount++;
          }else{
            const productData = {
              title: title,
              price: price,
              stock: stock,
              categoryId: categoryId,
              description: desc,
              sellerId: currentAdminUid,
              status: "active",
              createdAt: Date.now(),
              images: { main: imageUrl }
            };

            const newRef = push(ref(db, "products"));
            await set(newRef, productData);
          }
          successCount++;
        }catch(err){
          console.error("Bulk upload error:", err);
        }
      }

      uploadBtn.textContent = `✅ সম্পন্ন (${successCount}/${cards.length})`;
      alert(`✅ ${successCount}টি প্রোডাক্ট প্রসেস হয়েছে! (${updatedCount}টি আপডেট/replace, ${successCount-updatedCount}টি নতুন)`);
      selectedFiles = [];
      fileInput.value = "";
    };
  }
}


/* ===================== COMING SOON (FUTURE PRODUCTS) ===================== */
function loadComingSoon(){
  const addBtn = document.getElementById("cs-add-btn");
  const listDiv = document.getElementById("coming-soon-list");
  if(!addBtn || !listDiv) return;

  let csSelectedFile = null;
  const imgInput = document.getElementById("cs-image");
  if(imgInput){
    imgInput.addEventListener("change", (e)=>{
      csSelectedFile = e.target.files[0] || null;
    });
  }

  async function uploadToCloudinary(file){
    const CLOUD_NAME = "fd70754d";
    const UPLOAD_PRESET = "mohajon-mjh";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    if(!res.ok){
      const errText = await res.text();
      throw new Error("Cloudinary upload failed: " + errText);
    }
    const data = await res.json();
    return data.secure_url;
  }

  addBtn.addEventListener("click", async ()=>{
    const title = document.getElementById("cs-title").value.trim();
    const price = parseFloat(document.getElementById("cs-price").value) || 0;
    const categoryId = document.getElementById("cs-category").value;

    if(!title){ alert("নাম দিন"); return; }
    if(!csSelectedFile){ alert("ছবি দিন"); return; }

    addBtn.disabled = true;
    addBtn.textContent = "ছবি আপলোড হচ্ছে...";

    try{
      const imageUrl = await uploadToCloudinary(csSelectedFile);

      addBtn.textContent = "যোগ হচ্ছে...";

      const newRef = push(ref(db, "futureProducts"));
      await set(newRef, {
        title: title,
        categoryId: categoryId,
        expectedPrice: price,
        images: { main: imageUrl },
        createdAt: Date.now(),
        released: false
      });
      document.getElementById("cs-title").value = "";
      document.getElementById("cs-price").value = "";
      if(imgInput) imgInput.value = "";
      csSelectedFile = null;
      alert("✅ Coming Soon প্রোডাক্ট যোগ হয়েছে");
      csRenderList();
    }catch(err){
      console.error(err);
      alert("❌ সমস্যা: " + err.message);
    }finally{
      addBtn.disabled = false;
      addBtn.textContent = "➕ যোগ করুন";
    }
  });

  csRenderList();

  async function csRenderList(){
    listDiv.innerHTML = '<p style="color:#888">লোড হচ্ছে...</p>';
    try{
      const snap = await get(ref(db, "futureProducts"));
      const data = snap.val() || {};
      const entries = Object.entries(data).filter(([id, item]) => !item.released);

      if(entries.length === 0){
        listDiv.innerHTML = '<p style="color:#888">কোনো Coming Soon প্রোডাক্ট নেই</p>';
        return;
      }

      listDiv.innerHTML = "";
      entries.forEach(([id, item])=>{
        const div = document.createElement("div");
        div.className = "card";
        const img = (item.images && item.images.main) ? item.images.main : "";
        div.innerHTML = `
          <img src="${img}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px">
          <h4>${item.title}</h4>
          <p>আনুমানিক দাম: ৳${item.expectedPrice}</p>
          <p>ক্যাটাগরি: ${item.categoryId}</p>
          <div style="clear:both;margin-top:10px">
            <label>বাস্তব দাম (৳) <input type="number" class="cs-release-price" value="${item.expectedPrice}" style="width:100px"></label>
            <label>স্টক <input type="number" class="cs-release-stock" value="20" style="width:80px"></label>
            <button class="save-btn cs-release-btn">🚀 Release করুন</button>
            <button class="danger-btn cs-delete-btn">🗑️ Delete</button>
          </div>
        `;

        div.querySelector(".cs-release-btn").onclick = async ()=>{
          if(!confirm(`"${item.title}" এখন Release করবেন?`)) return;
          const realPrice = parseFloat(div.querySelector(".cs-release-price").value) || item.expectedPrice;
          const realStock = parseInt(div.querySelector(".cs-release-stock").value) || 0;

          try{
            const newProductRef = push(ref(db, "products"));
            await set(newProductRef, {
              title: item.title,
              price: realPrice,
              stock: realStock,
              categoryId: item.categoryId,
              sellerId: currentAdminUid,
              status: "active",
              createdAt: Date.now(),
              images: item.images || {}
            });

            const notifySnap = await get(ref(db, "futureNotify/"+id));
            const notifyData = notifySnap.val() || {};
            const uids = Object.keys(notifyData);
            for(const uid of uids){
              const notifRef = push(ref(db, "notifications/"+uid));
              await set(notifRef, {
                title: "🎉 প্রোডাক্ট এসে গেছে!",
                message: `আপনার অপেক্ষা করা "${item.title}" এখন কেনার জন্য পাওয়া যাচ্ছে!`,
                read: false,
                type: "product_release",
                createdAt: Date.now()
              });
            }

            await remove(ref(db, "futureProducts/"+id));
            await remove(ref(db, "futureNotify/"+id));

            alert(`✅ Release সফল! ${uids.length} জন ইউজারকে নোটিফাই করা হয়েছে।`);
            csRenderList();
          }catch(err){
            console.error(err);
            alert("❌ সমস্যা: " + err.message);
          }
        };

        div.querySelector(".cs-delete-btn").onclick = async ()=>{
          if(!confirm(`"${item.title}" ডিলিট করবেন?`)) return;
          await remove(ref(db, "futureProducts/"+id));
          await remove(ref(db, "futureNotify/"+id));
          csRenderList();
        };

        listDiv.appendChild(div);
      });
    }catch(err){
      console.error(err);
      listDiv.innerHTML = '<p style="color:red">লোড করতে সমস্যা হয়েছে</p>';
    }
  }
}

(function(){
  const scNameInput = document.getElementById("sc-name");
  const scSlugInput = document.getElementById("sc-slug");
  const scOrderInput = document.getElementById("sc-order");
  const scStartInput = document.getElementById("sc-startdate");
  const scEndInput = document.getElementById("sc-enddate");
  const scAddBtn = document.getElementById("sc-add-btn");
  const scListDiv = document.getElementById("sc-list");

  if(!scAddBtn || !scListDiv) return;

  scAddBtn.addEventListener("click", async ()=>{
    const name = scNameInput.value.trim();
    const slug = scSlugInput.value.trim();
    const order = parseInt(scOrderInput.value) || 0;
    if(!name || !slug){ alert("নাম ও Category ID দুটোই দিন"); return; }
    try{
      const newRef = push(ref(db, "settings/specialCategories"));
      const startDate = scStartInput ? scStartInput.value.trim() : "";
      const endDate = scEndInput ? scEndInput.value.trim() : "";
      await set(newRef, { name, slug, order, startDate, endDate, createdAt: Date.now() });
      scNameInput.value = "";
      scSlugInput.value = "";
      scOrderInput.value = "0";
      if(scStartInput) scStartInput.value = "";
      if(scEndInput) scEndInput.value = "";
      alert("✅ Special Category যোগ হয়েছে");
      scRenderList();
    }catch(err){
      console.error(err);
      alert("❌ সমস্যা: " + err.message);
    }
  });

  async function scRenderList(){
    scListDiv.innerHTML = '<p style="color:#888">লোড হচ্ছে...</p>';
    try{
      const snap = await get(ref(db, "settings/specialCategories"));
      const data = snap.val() || {};
      const entries = Object.entries(data).sort((a,b)=>(a[1].order||0)-(b[1].order||0));

      if(entries.length === 0){
        scListDiv.innerHTML = '<p style="color:#888">কোনো Special Category যোগ করা হয়নি</p>';
        return;
      }

      scListDiv.innerHTML = "";
      entries.forEach(([id, item])=>{
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <label>নাম <input type="text" class="sc-edit-name" value="${(item.name||'').replace(/"/g,'&quot;')}"></label>
          <label>Category ID <input type="text" class="sc-edit-slug" value="${(item.slug||'').replace(/"/g,'&quot;')}"></label>
          <label>Order <input type="number" class="sc-edit-order" value="${item.order||0}" style="width:80px"></label>
          <label>শুরুর তারিখ <input type="text" class="sc-edit-startdate" value="${(item.startDate||'').replace(/"/g,'&quot;')}" placeholder="dd-mm-yyyy"></label>
          <label>শেষের তারিখ <input type="text" class="sc-edit-enddate" value="${(item.endDate||'').replace(/"/g,'&quot;')}" placeholder="dd-mm-yyyy"></label>
          <div style="margin-top:10px">
            <button class="save-btn sc-save-btn">💾 Save</button>
            <button class="danger-btn sc-delete-btn">🗑️ Delete</button>
          </div>
        `;

        div.querySelector(".sc-save-btn").onclick = async ()=>{
          const newName = div.querySelector(".sc-edit-name").value.trim();
          const newSlug = div.querySelector(".sc-edit-slug").value.trim();
          const newOrder = parseInt(div.querySelector(".sc-edit-order").value) || 0;
        const newStartDate = div.querySelector(".sc-edit-startdate").value.trim();
        const newEndDate = div.querySelector(".sc-edit-enddate").value.trim();
          try{
            await update(ref(db, "settings/specialCategories/"+id), { name: newName, slug: newSlug, order: newOrder, startDate: newStartDate, endDate: newEndDate });
            alert("✅ Update হয়েছে");
            scRenderList();
          }catch(err){
            console.error(err);
            alert("❌ সমস্যা: " + err.message);
          }
        };

        div.querySelector(".sc-delete-btn").onclick = async ()=>{
          if(!confirm(`"${item.name}" ডিলিট করবেন?`)) return;
          try{
            await remove(ref(db, "settings/specialCategories/"+id));
            scRenderList();
          }catch(err){
            console.error(err);
            alert("❌ সমস্যা: " + err.message);
          }
        };

        scListDiv.appendChild(div);
      });
    }catch(err){
      console.error(err);
      scListDiv.innerHTML = '<p style="color:red">লোড করতে সমস্যা হয়েছে</p>';
    }
  }

  scRenderList();
})();
