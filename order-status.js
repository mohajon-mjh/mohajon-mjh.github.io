import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

onValue(ref(db,"orders"), (snap) => {
  const data = snap.val() || {};

  document.body.innerHTML = "<h2>Orders Control</h2>";

  Object.entries(data).forEach(([key,o]) => {
    document.body.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:5px">
        <b>${o.name}</b><br>
        Order: ${o.orderId || "N/A"}<br>
        Phone: ${o.phone || ""}<br>
        Address: ${o.address || ""}<br>
        Payment: ${o.paymentMethod || "COD"}<br>
        Status: ${o.status}<br>

        <button onclick="changeStatus('${key}','pending')">Pending</button>
        <button onclick="changeStatus('${key}','shipped')">Shipped</button>
        <button onclick="handleDelivered('${key}',o)">Delivered</button>
      </div>
    `;
  });
});

window.changeStatus = function(id,status){
  update(ref(db,"orders/"+id),{status});
  alert("Updated");
};

// SAFE STOCK UPDATE (FIXED VERSION)
window.handleDelivered = async function(orderKey, orderData){

  const items = orderData.items || [];

  for (const item of items) {
    const productRef = ref(db,'products/'+item.id);
    const snap = await get(productRef);

    if (snap.exists()) {
      const p = snap.val();
      const qty = item.qty || 1;

      let newStock = (p.stock || 0) - qty;
      if (newStock < 0) newStock = 0;

      await update(productRef, { stock: newStock });
    }
  }

  await update(ref(db,"orders/"+orderKey), { status: "delivered" });
  alert("Delivered + Stock Updated");
};
