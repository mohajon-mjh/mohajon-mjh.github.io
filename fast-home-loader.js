(function(){"use strict";
var P=null,S=null;
function $(id){return document.getElementById(id);}
function fmt(v){return window.MJHCurrency&&window.MJHCurrency.formatPrice?window.MJHCurrency.formatPrice(v):"৳"+(+v||0).toFixed(0);}
function card(id,p){var price=+p.price||0,old=+p.oldPrice||0,disc=old>price?Math.round((old-price)*100/old):0;
var img=p.main||"https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
var c=document.createElement("div");
c.style.cssText="background:#fff;border-radius:10px;padding:10px;min-width:150px;max-width:150px;flex:0 0 auto;box-shadow:0 2px 6px rgba(0,0,0,.08);cursor:pointer";
c.innerHTML='<div style="position:relative"><img loading="lazy" src="'+img+'" style="width:100%;height:120px;object-fit:cover;border-radius:8px">'+(disc>0?'<span style="position:absolute;top:4px;right:4px;background:#e74c3c;color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700">-'+disc+'%</span>':'')+'</div><b style="font-size:13px;display:block;margin:8px 0;min-height:32px;overflow:hidden">'+(p.title||id)+'</b><div style="font-weight:800;margin-bottom:6px">'+fmt(price)+(old>price?' <s style="color:#999;font-size:11px;font-weight:400">'+fmt(old)+'</s>':'')+'</div><button style="width:100%;background:#3498db;color:#fff;border:none;padding:7px;border-radius:6px;font-weight:700;margin-bottom:5px">🛒 Add to Cart</button><button style="width:100%;background:#f39c12;color:#111;border:none;padding:7px;border-radius:6px;font-weight:700">⚡ Buy Now</button>';
c.onclick=function(){location.href="product-details.html?id="+id;};return c;}
function row(grid,ids){grid.innerHTML="";var n=0;ids.forEach(function(id){var p=P[id];if(!p)return;grid.appendChild(card(id,p));n++;});if(!n)grid.innerHTML='<div style="padding:16px;color:#888">পণ্য নেই</div>';}
function section(catsEl,gridEl,ck,pk){if(!catsEl||!gridEl)return;var cats=S[ck]||{},prods=S[pk]||{};
var ids=Object.keys(cats).sort(function(a,b){return((cats[a]||{}).order||0)-((cats[b]||{}).order||0);});
if(!ids.length)return;catsEl.innerHTML="";
function show(cid){row(gridEl,Object.keys(prods[cid]||{}).slice(0,20));}
ids.forEach(function(cid,i){var b=document.createElement("div");b.textContent=((cats[cid]||{}).name)||cid;
b.style.cssText="padding:12px 16px;border-radius:10px;border:2px solid #f39c12;background:"+(i===0?"#2563eb":"#111")+";color:#fff;font-weight:700;min-width:110px;text-align:center;cursor:pointer;flex:0 0 auto";
b.onclick=function(){var xs=catsEl.children;for(var x=0;x<xs.length;x++)xs[x].style.background="#111";b.style.background="#2563eb";show(cid);};
catsEl.appendChild(b);if(i===0)show(cid);});}
function renderAll(){
section($("flashCatsRow"),$("flashSaleProductsGrid"),"flashSaleCategories","flashSaleCategoryProducts");
section($("globalCatsRow"),$("globalCatCarousel"),"globalCategories","globalCategoryProducts");
section($("dealsCatsRow"),$("dealsGrid"),"dealsOfDayCategories","dealsOfDayCategoryProducts");
section($("specialCatsContainer"),$("specialCatCarousel"),"specialCategories","specialCategoryProducts");
section($("everydayLowPriceCats"),$("everydayLowPriceGrid"),"everydayLowPriceCategories","everydayLowPriceCategoryProducts");
section($("comboOffersCats"),$("comboOffersGrid"),"comboOffersCategories","comboOffersCategoryProducts");
section($("clearanceOutletCats"),$("clearanceOutletGrid"),"clearanceOutletCategories","clearanceOutletCategoryProducts");}
function load(){var t0=Date.now();
try{var c=JSON.parse(localStorage.getItem("mjhSnap2")||"null");
if(c&&Date.now()-c.t<600000){P=c.p;S=c.s;renderAll();console.log("⚡ cache render:",Date.now()-t0,"ms");}}catch(e){}
Promise.all([fetch("data/products-mini.json").then(function(r){return r.json();}),
fetch("data/settings.json").then(function(r){return r.json();})]).then(function(rs){
P=rs[0];S=rs[1];try{localStorage.setItem("mjhSnap2",JSON.stringify({t:Date.now(),p:P,s:S}));}catch(e){}
renderAll();console.log("⚡ snapshot render:",Date.now()-t0,"ms");}).catch(function(e){console.warn("snapshot fail",e);});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load);else load();
document.addEventListener("currencyChanged",function(){if(P)renderAll();});
})();
