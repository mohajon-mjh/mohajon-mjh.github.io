import { listenOrders, listenProducts } from "./event-engine.js";
import { calculateBusiness } from "./business-engine.js";

listenOrders((orders)=>{
  listenProducts((products)=>{

    const stats = calculateBusiness(products, orders);

    const el1 = document.getElementById("g-revenue");
    const el2 = document.getElementById("g-profit");
    const el3 = document.getElementById("g-top-product");

    if(el1) el1.textContent = "৳" + stats.revenue;
    if(el2) el2.textContent = "৳" + stats.profit;
    if(el3) el3.textContent = stats.topProduct?.name || "N/A";
  });
});
