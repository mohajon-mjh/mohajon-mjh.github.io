/* MJH Watchdog v9 — শুধু আটকে থাকা "লোড হচ্ছে" ঠিক করে, আর কিছু না */
(function(){
"use strict";
function fix(){
 ["trendingProductsGrid","flashSaleProductsGrid","dealsGrid","globalCatCarousel","featuredProducts","specialCatCarousel","flashCatsRow","dotdCatsRow","specialCatsContainer"].forEach(function(id){
  var el=document.getElementById(id);
  if(!el)return;
  if(/লোড হচ্ছে/.test(el.textContent)&&!el.querySelector("a,.product-card,.cat")){
   el.innerHTML='<p style="text-align:center;color:#888;padding:16px">📦 এই মুহূর্তে পণ্য নেই — একটু পরে আবার দেখুন</p>';
  }
 });
}
setTimeout(fix,8000);
setTimeout(fix,14000);
})();
