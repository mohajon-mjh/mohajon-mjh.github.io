import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update, remove, push, set, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
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
const sellerReqDiv = document.getElementById("seller-requests");
const ordersDiv = document.getElementById("orders-commission");

onAuthStateChanged(auth, (user) => {

  if(!user){
    alert("Login required");
    location.href="login.html";
    return;
  }

  if(!ADMIN_UIDS.includes(user.uid)){
    alert("❌ Unauthorized Admin Access");
    signOut(auth);
    location.href="login.html";
    return;
  }

  loadProducts();
  loadSellerRequests();
  loadDeliveredOrders();
  loadOrderStats();
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

/* ===================== PRODUCT APPROVAL ===================== */
function loadProducts(){
  const productsRef = ref(db,"products");

  onValue(productsRef,(snapshot)=>{
    productsDiv.innerHTML="<h3>🆕 Pending Products</h3>";

    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();
      if(data.status !== "pending") return;
      count++;

      const div = document.createElement("div");
      div.className="card";

      div.innerHTML=`
        <h3>${data.title || data.name}</h3>
        <p>Price: ৳${data.price}</p>
        <p>Seller: ${data.sellerEmail || data.sellerId}</p>
        <p>Stock: ${data.stock}</p>
        <p>Status: ${data.status}</p>
        <button class="approve">Approve</button>
        <button class="reject">Reject</button>
      `;

      div.querySelector(".approve").onclick = () => {
        update(ref(db,"products/"+key),{
          status:"active",
          approvedAt: Date.now()
        });
      };

      div.querySelector(".reject").onclick = () => {
        if(confirm("এই প্রোডাক্ট বাতিল করবেন?")) remove(ref(db,"products/"+key));
      };

      productsDiv.appendChild(div);
    });

    if(count === 0) productsDiv.innerHTML += "<p>কোনো pending প্রোডাক্ট নেই।</p>";
  });
}

/* ===================== SELLER REQUEST APPROVAL ===================== */
function loadSellerRequests(){
  if(!sellerReqDiv) return;

  const reqRef = ref(db,"sellerRequests");

  onValue(reqRef,(snapshot)=>{
    sellerReqDiv.innerHTML="<h3>🏪 Seller আবেদন</h3>";

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

/* ===================== DELIVERED ORDERS + COMMISSION + STOCK SYNC ===================== */
function loadDeliveredOrders(){
  if(!ordersDiv) return;

  const ordersRef = ref(db,"orders");

  onValue(ordersRef,(snapshot)=>{
    ordersDiv.innerHTML="<h3>📦 Delivered Orders — Commission বাকি</h3>";

    let count = 0;
    snapshot.forEach(child=>{
      const key = child.key;
      const data = child.val();

      // শুধু delivered এবং এখনো কমিশন যোগ হয়নি এমন অর্ডার দেখাবে
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
          // ১. কমিশন হিসাব ও সেভ
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

          // ২. Stock sync (safe, ডাবল কমানো এড়াতে commissionAdded চেক আগেই করা হয়েছে)
          const items = data.items || [];
          for(const item of items){
            const productRef = ref(db, "products/"+item.id);
            const pSnap = await get(productRef);
            if(pSnap.exists()){
              const p = pSnap.val();
              const qty = Number(item.qty || 1);
              let newStock = Number(p.stock || 0) - qty;
              if(newStock < 0) newStock = 0;
              await update(productRef, { stock: newStock });
            }
          }

          // ৩. অর্ডারে flag বসানো যাতে দ্বিতীয়বার commission/stock না হয়
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
