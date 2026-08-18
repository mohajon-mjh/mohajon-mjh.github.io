const fs = require("fs");

// 1. index.html থেকে date filter বাদ (date খালি থাকলেও পণ্য দেখাবে)
let h = fs.readFileSync("index.html", "utf8");
let hChanged = false;
if (h.indexOf("if(!fsIsOfferActive(mapInfo)) return null;") > -1) {
  h = h.split("if(!fsIsOfferActive(mapInfo)) return null;").join("/* date check removed */");
  hChanged = true;
  console.log("✓ flash date filter removed");
}
if (h.indexOf("if(!dotdIsOfferActive(mapInfo)) return null;") > -1) {
  h = h.split("if(!dotdIsOfferActive(mapInfo)) return null;").join("/* date check removed */");
  hChanged = true;
  console.log("✓ dotd date filter removed");
}
if (hChanged) fs.writeFileSync("index.html", h);

// 2. category-gate.js-এ universal fallback system
let g = fs.readFileSync("category-gate.js", "utf8");
if (g.indexOf("UNIVERSAL FALLBACK") > -1) {
  console.log("✓ fallback already present");
  process.exit(0);
}
const FALLBACK = `
/* UNIVERSAL FALLBACK: ticked-only products show even if main loader is empty */
var FB_DONE = {};
function fbCard(p){
 var id=p.id,price=+p.price||0;
 var old=p.discountPrice&&+p.discountPrice>price?+p.discountPrice:0;
 var disc=old?Math.round((1-price/old)*100):(parseInt(p.discountPercent)||0);
 var stock=parseInt(p.stock)||0;
 var img=(p.images&&p.images.main)||"";
 if(!img&&p.images){var vs=Object.values(p.images);for(var i=0;i<vs.length;i++){if(typeof vs[i]==="string"&&vs[i].indexOf("http")===0){img=vs[i];break;}}}
 if(!img)img="https://dummyimage.com/300x300/eeeeee/555&text=MJH";
 var badge=stock<=0?'<span class="stock-badge out-of-stock">Out of Stock</span>':(stock<=5?'<span class="stock-badge low-stock">Low Stock</span>':'<span class="stock-badge in-stock">In Stock</span>');
 var c=document.createElement("div");c.className="product-card";c.style.cursor="pointer";
 c.innerHTML='<div class="product-card-image">'+badge+(disc>0?'<span class="discount-badge">-'+disc+'%</span>':'')+'<img src="'+img+'" loading="lazy" onerror="this.onerror=null;this.src=\\'https://dummyimage.com/300x300/eeeeee/555&text=MJH\\';"></div><div class="product-card-content"><h3 class="product-card-title">'+(p.title||p.name||"Product")+'</h3><div class="product-card-price"><span class="current-price">'+fmt(price)+'</span>'+(old?'<span class="old-price">'+fmt(old)+'</span>':'')+'</div><div class="product-card-actions" style="flex-direction:column"><button class="btn-add-to-cart" style="width:100%">🛒 Add to Cart</button><button class="btn-buy-now" style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button></div></div>';
 c.onclick=function(){location.href="product-details.html?id="+encodeURIComponent(id);};
 c.querySelector(".btn-add-to-cart").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);e.target.textContent="Added ✓";setTimeout(function(){e.target.textContent="🛒 Add to Cart";},1200);};
 c.querySelector(".btn-buy-now").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);location.href="cart.html";};
 return c;
}
function isEmptyG(el){if(!el)return false;var t=(el.textContent||"").trim();return t===""||/লোড হচ্ছে|এখনো কোনো|শীঘ্রই পণ্য|লোড করতে সমস্যা/.test(t);}
function fbFill(key,gridSel,nodePath){
 var gridEl=document.querySelector(gridSel);
 if(!gridEl||!isEmptyG(gridEl)||FB_DONE[key])return;
 FB_DONE[key]=1;
 get(ref(gdb,"settings/"+nodePath+"/"+key)).then(function(s){
  var map=s.val()||{};var pids=Object.keys(map);
  if(!pids.length){FB_DONE[key]=0;return;}
  Promise.all(pids.slice(0,30).map(function(pid){
   return get(ref(gdb,"products/"+pid)).then(function(ps){
    if(!ps.exists())return null;var v=ps.val();
    return (v&&v.status==="active")?Object.assign({id:pid},v):null;
   }).catch(function(){return null;});
  })).then(function(vals){
   var list=vals.filter(Boolean);
   if(list.length){gridEl.innerHTML="";list.forEach(function(p){gridEl.appendChild(fbCard(p));});}
   else{FB_DONE[key]=0;}
  });
 }).catch(function(){FB_DONE[key]=0;});
}
function fbRun(){
 var fa=document.querySelector("#flashCatsRow .cat.active");
 if(fa){fbFill(fa.getAttribute("data-cat")||"","#flashSaleProductsGrid","flashSaleCategoryProducts");}
 var da=document.querySelector("#dotdCatsRow .cat.active");
 if(da){fbFill(da.getAttribute("data-cat")||"","#dealsGrid","dealsOfDayCategoryProducts");}
 var sa=document.querySelector("#specialCatsContainer .cat.active");
 if(sa){var sl=sa.getAttribute("data-slug")||sa.getAttribute("data-cat")||"";fbFill(sl,"#specialCatCarousel","specialCategoryProducts");}
}
setTimeout(function(){var n=0;var iv=setInterval(function(){n++;fbRun();if(n>40)clearInterval(iv);},3000);},5000);
document.addEventListener("click",function(e){
 if(e.target.closest&&e.target.closest("#flashCatsRow .cat,#dotdCatsRow .cat,#specialCatsContainer .cat")){
  FB_DONE={};setTimeout(fbRun,1500);setTimeout(fbRun,4000);
 }
});
`;
const MARKER = "window.MJHCategoryGate={ready:ready,isOff:isOff,showSoon:showSoon,norm:norm};";
if (g.indexOf(MARKER) > -1) {
  g = g.split(MARKER).join(FALLBACK + "\n" + MARKER);
  fs.writeFileSync("category-gate.js", g);
  console.log("✓ universal fallback added");
} else {
  console.log("✗ marker not found in category-gate.js");
}
