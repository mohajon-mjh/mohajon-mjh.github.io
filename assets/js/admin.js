import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
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
    if(revenueEl) revenueEl.textContent = "৳" + revenue.toFixed(2);
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
          await update(ref(db,"products/"+key),{ status:"active", approvedAt: Date.now() });
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
      <p style="font-size:12px;color:#999">Status: ${data.status} | Seller: ${data.sellerEmail || data.sellerId}</p>
      <button class="save-btn">Save</button>
      <button class="delete-btn">Delete</button>
    `;

    div.querySelector(".save-btn").onclick = async () => {
      const newName = div.querySelector(".edit-name").value.trim();
      const newPrice = parseFloat(div.querySelector(".edit-price").value);
      const newStock = parseInt(div.querySelector(".edit-stock").value);
      try{
        const updates = { price:newPrice, stock:newStock, updatedAt: Date.now() };
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
        <p>Total: ৳${data.total}</p>
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

          await update(ref(db,"orders/"+key), { commissionAdded: true });
          alert(`কমিশন যোগ হয়েছে: ৳${amount.toFixed(2)} (${rate}%) এবং স্টক আপডেট হয়েছে`);
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
