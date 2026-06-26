import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const db = getDatabase();

let sellerId = null;

function calcDashboard(products, orders){

  let totalStock = 0;
  let inventoryValue = 0;
  let lowStock = 0;

  let totalOrders = 0;
  let revenue = 0;

  Object.values(products || {}).forEach(p => {

    if(!p) return;

    totalStock += Number(p.stock || 0);
    inventoryValue += (Number(p.stock || 0) * Number(p.price || 0));

    if((p.stock || 0) > 0 && (p.stock || 0) < 5){
      lowStock++;
    }
  });

  Object.values(orders || {}).forEach(o => {
    totalOrders++;

    if(o.status === "delivered"){
      (o.items || []).forEach(i=>{
        revenue += Number(i.price || 0) * Number(i.qty || 1);
      });
    }
  });

  document.getElementById("total-stock").textContent = totalStock;
  document.getElementById("inventory-value").textContent = "৳" + inventoryValue;
  document.getElementById("low-stock-count").textContent = lowStock;

  document.getElementById("total-orders").textContent = totalOrders;
  document.getElementById("total-revenue").textContent = "৳" + revenue;
}

function loadDashboard(uid){

  const productsRef = ref(db,"products");
  const ordersRef = ref(db,"orders");

  let productsData = {};
  let ordersData = {};

  onValue(productsRef, snap=>{
    productsData = snap.val() || {};
    calcDashboard(productsData, ordersData);
  });

  onValue(ordersRef, snap=>{
    ordersData = snap.val() || {};
    calcDashboard(productsData, ordersData);
  });
}

window.initSellerDashboard = function(uid){
  sellerId = uid;
  loadDashboard(uid);
};
