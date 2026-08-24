import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const db = getDatabase();

onValue(ref(db,"orders"), snap => {

  const orders = snap.val() || {};

  let pending = 0;
  let shipped = 0;
  let delivered = 0;
  let totalRevenue = 0;

  Object.values(orders).forEach(o => {

    if(o.status === "pending") pending++;
    if(o.status === "shipped") shipped++;
    if(o.status === "delivered") delivered++;

    if(o.status === "delivered"){
      (o.items || []).forEach(i=>{
        totalRevenue += (i.price || 0) * (i.qty || 1);
      });
    }
  });

  document.getElementById("total-orders").textContent =
    Object.keys(orders).length;

  document.getElementById("pending-orders").textContent = pending;

  const el = document.getElementById("admin-revenue");
  if(el) el.textContent = "৳" + totalRevenue;
});
