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
const flashSaleDiv = document.getElementById("flash-sale-manager");
const trendingDiv = document.getElementById("trending-manager");
const searchInput = document.getElementById("product-search");

let currentAdminUid = null;
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
  loadFlashSale();
  loadTrending();
  loadFlashSaleLabel();
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

function renderAllProducts(filterText){
  allProductsDiv.innerHTML="<div class='section-title'><h3>✏️ সব প্রোডাক্ট — এডিট / ডিলিট</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  Object.keys(allProductsCache).forEach(key=>{
    const data = allProductsCache[key];
    const name = (data.title || data.name || "").toLowerCase();
    if(search && !name.includes(search)) return;
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
        const updates = {
          price:newPrice,
          stock:newStock,
          isFreeDelivery: isFree,
          deliveryCharge: isFree ? 0 : deliveryCharge,
          deliveryTime: deliveryTime,
          rating: newRating,
          soldCount: newSoldCount,
          isRecommended: newRecommended,
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
}

/* ===================== FLASH SALE MANAGER ===================== */
let flashSaleCache = {};
let trendingCache = {};
const flashSaleSearchInput = document.getElementById("flashsale-search");
const trendingSearchInput = document.getElementById("trending-search");

/* ===================== FLASH SALE LABEL (Up To X% Off) ===================== */
function loadFlashSaleLabel(){
  const labelInput = document.getElementById("flashsale-label-input");
  const saveBtn = document.getElementById("flashsale-label-save");
  const statusEl = document.getElementById("flashsale-label-status");
  if(!labelInput || !saveBtn) return;

  get(ref(db, "settings/flashSaleLabel")).then(snap => {
    labelInput.value = snap.exists() ? snap.val() : "Up To 70% Off";
  });

  saveBtn.onclick = async () => {
    const val = labelInput.value.trim() || "Up To 70% Off";
    try{
      await set(ref(db, "settings/flashSaleLabel"), val);
      statusEl.textContent = "✅ সেভ হয়েছে";
      setTimeout(()=>{ statusEl.textContent=""; }, 3000);
    }catch(err){
      statusEl.style.color = "#f88";
      statusEl.textContent = "Error: " + err.message;
    }
  };
}

function loadFlashSale(){
  if(!flashSaleDiv) return;
  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{
    flashSaleCache = {};
    snapshot.forEach(child=>{
      const data = child.val();
      if(data.status === "active") flashSaleCache[child.key] = data;
    });
    renderFlashSale(flashSaleSearchInput ? flashSaleSearchInput.value : "");
  });

  if(flashSaleSearchInput){
    flashSaleSearchInput.addEventListener("input", () => {
      renderFlashSale(flashSaleSearchInput.value);
    });
  }
}

function renderFlashSale(filterText){
  flashSaleDiv.innerHTML="<div class='section-title'><h3>⚡ Flash Sale — Up To 70% Off</h3></div>";
  const search = (filterText||"").trim().toLowerCase();
  let count = 0;

  Object.keys(flashSaleCache).forEach(key=>{
    const data = flashSaleCache[key];
    const name = (data.title || data.name || "").toLowerCase();
    if(search && !name.includes(search)) return;
    count++;

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML=`
      <h3>${data.title || data.name}</h3>
      <p>মূল দাম: ৳${data.price}</p>
      <label><input type="checkbox" class="fs-toggle" ${data.isFlashSale ? "checked" : ""}> Flash Sale-এ যুক্ত করুন</label>
      <label>Discount %:
        <input type="number" class="fs-discount" value="${data.discountPercent||0}" min="0" max="70">
      </label>
      <button class="save-btn">Save</button>
    `;

    div.querySelector(".save-btn").onclick = async () => {
      const isOn = div.querySelector(".fs-toggle").checked;
      let discount = parseInt(div.querySelector(".fs-discount").value) || 0;
      if(discount > 70) discount = 70;
      try{
        await update(ref(db,"products/"+key), {
          isFlashSale: isOn,
          discountPercent: discount,
          updatedAt: Date.now()
        });
        alert("✅ Flash Sale আপডেট হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);
      }
    };

    flashSaleDiv.appendChild(div);
  });

  if(count === 0) flashSaleDiv.innerHTML += "<p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>";
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
    bicycles_scooters_electric_vehicles: "Bicycles, Scooters & Electric Vehicles"
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

  function filenameToTitle(filename){
    const base = filename.replace(/\.[^/.]+$/, "");
    return base.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  function filenameToKey(filename){
    return filename.replace(/\.[^/.]+$/, "");
  }

  let selectedFiles = [];

  fileInput.addEventListener("change", (e) => {
    selectedFiles = Array.from(e.target.files);
    renderBulkList();
  });

  function renderBulkList(){
    listDiv.innerHTML = "";
    if(selectedFiles.length === 0) return;

    listDiv.innerHTML = `<div class="section-title"><h3>${selectedFiles.length}টি প্রোডাক্ট প্রস্তুত</h3></div>`;

    const uploadBtn = document.createElement("button");
    uploadBtn.textContent = `✅ Upload All (${selectedFiles.length})`;
    uploadBtn.className = "save-btn";
    uploadBtn.style.marginBottom = "15px";
    listDiv.appendChild(uploadBtn);

    const itemsContainer = document.createElement("div");
    listDiv.appendChild(itemsContainer);

    const categoryOptionsHTML = (selectedId) => Object.entries(ALL_CATEGORIES).map(
      ([id, label]) => `<option value="${id}" ${selectedId===id?'selected':''}>${label}</option>`
    ).join('');

    selectedFiles.forEach((file, idx) => {
      const key = filenameToKey(file.name);
      const title = filenameToTitle(file.name);
      const categoryId = CATEGORY_MAP[key] || "";
      const price = PRICE_TABLE[key] || 100;

      const div = document.createElement("div");
      div.className = "card";
      div.dataset.index = idx;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = div.querySelector(".bulk-preview-img");
        if(img) img.src = e.target.result;
        div.dataset.imageData = e.target.result;
      };
      reader.readAsDataURL(file);

      div.innerHTML = `
        <img class="bulk-preview-img" style="width:80px;height:80px;object-fit:cover;border-radius:6px;float:left;margin-right:10px" src="">
        <label>নাম <input type="text" class="bulk-title" value="${title}"></label>
        <label>দাম (৳) <input type="number" class="bulk-price" value="${price}"></label>
        <label>স্টক <input type="number" class="bulk-stock" value="20"></label>
        <label>ক্যাটাগরি
          <select class="bulk-category">
            ${categoryOptionsHTML(categoryId)}
          </select>
        </label>
        <div style="clear:both"></div>
      `;

      itemsContainer.appendChild(div);
    });

    uploadBtn.onclick = async () => {
      uploadBtn.disabled = true;
      uploadBtn.textContent = "আপলোড হচ্ছে...";

      const cards = itemsContainer.querySelectorAll(".card");
      let successCount = 0;

      for(const card of cards){
        try{
          const title = card.querySelector(".bulk-title").value.trim();
          const price = parseFloat(card.querySelector(".bulk-price").value) || 0;
          const stock = parseInt(card.querySelector(".bulk-stock").value) || 0;
          const categoryId = card.querySelector(".bulk-category").value;
          const imageData = card.dataset.imageData;

          if(!title || !imageData) continue;

          const productData = {
            title: title,
            price: price,
            stock: stock,
            categoryId: categoryId,
            sellerId: currentAdminUid,
            status: "active",
            createdAt: Date.now(),
            images: { main: imageData }
          };

          const newRef = push(ref(db, "products"));
          await set(newRef, productData);
          successCount++;
        }catch(err){
          console.error("Bulk upload error:", err);
        }
      }

      uploadBtn.textContent = `✅ সম্পন্ন (${successCount}/${cards.length})`;
      alert(`✅ ${successCount}টি প্রোডাক্ট সফলভাবে আপলোড হয়েছে!`);
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

  let csSelectedImage = null;
  const imgInput = document.getElementById("cs-image");
  if(imgInput){
    imgInput.addEventListener("change", (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (ev)=>{ csSelectedImage = ev.target.result; };
      reader.readAsDataURL(file);
    });
  }

  addBtn.addEventListener("click", async ()=>{
    const title = document.getElementById("cs-title").value.trim();
    const price = parseFloat(document.getElementById("cs-price").value) || 0;
    const categoryId = document.getElementById("cs-category").value;

    if(!title){ alert("নাম দিন"); return; }
    if(!csSelectedImage){ alert("ছবি দিন"); return; }

    addBtn.disabled = true;
    addBtn.textContent = "যোগ হচ্ছে...";

    try{
      const newRef = push(ref(db, "futureProducts"));
      await set(newRef, {
        title: title,
        categoryId: categoryId,
        expectedPrice: price,
        images: { main: csSelectedImage },
        createdAt: Date.now(),
        released: false
      });
      document.getElementById("cs-title").value = "";
      document.getElementById("cs-price").value = "";
      if(imgInput) imgInput.value = "";
      csSelectedImage = null;
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
