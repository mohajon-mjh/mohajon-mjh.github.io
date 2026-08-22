/* MJH Home Unified Loader v3 - সব section + category একই নিয়মে */
(function(){
"use strict";
var CK="mjh_home_v3",CT="mjh_home_v3_t",ALL=[],lastCat=null;
function slim(p){return {id:p.id,title:p.title,price:p.price,discountPrice:p.discountPrice,oldPrice:p.oldPrice,stock:p.stock,status:p.status,category:p.category,categoryId:p.categoryId,images:p.images,image:p.image,isTrending:p.isTrending,isFeatured:p.isFeatured,isFlashSale:p.isFlashSale,isRecommended:p.isRecommended,brand:p.brand};}
function priceTxt(p){try{if(window.MJHCurrency&&MJHCurrency.formatPrice)return MJHCurrency.formatPrice(p.price);}catch(e){}return "৳"+(parseFloat(p.price)||0).toFixed(2);}
function card(p){
 var img=(p.images&&(p.images.main||p.images[0]))||p.image||"https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
 var old=parseFloat(p.oldPrice||p.discountPrice)||0,pr=parseFloat(p.price)||0;
 var disc=old>pr?Math.round(((old-pr)/old)*100):0;
 var stk=parseInt(p.stock)||0;
 return '<a href="product-details.html?id='+p.id+'" style="text-decoration:none;color:inherit;display:inline-block"><div style="width:170px;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.08);overflow:hidden;margin-right:12px;margin-bottom:12px;vertical-align:top">'+
 '<div style="position:relative;background:#f1f3f5"><img src="'+img+'" loading="lazy" style="width:100%;height:140px;object-fit:contain;display:block">'+
 (stk>0?'<span style="position:absolute;top:6px;left:6px;background:#22c55e;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">IN STOCK</span>':'<span style="position:absolute;top:6px;left:6px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">OUT</span>')+
 (disc>0?'<span style="position:absolute;top:6px;right:6px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">-'+disc+'%</span>':'')+
 '</div><div style="padding:10px"><div style="font-size:12px;font-weight:600;color:#0b1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(p.title||"Product")+'</div>'+
 '<div style="margin-top:6px;font-size:14px;font-weight:800;color:#0b1a2e">'+priceTxt(p)+(old>pr?' <span style="font-size:11px;color:#94a3b8;text-decoration:line-through;font-weight:500">'+priceTxt(old)+'</span>':'')+'</div>'+
 '</div></div></a>';
}
function fill(el,list){
 if(!el)return;
 el.innerHTML="";
 if(!list.length){el.style.display="block";el.innerHTML='<p style="text-align:center;color:#888;padding:20px">📦 এখনো পণ্য নেই — Admin থেকে এই section-এ পণ্য যোগ করুন</p>';return;}
 el.style.display="flex";el.style.flexWrap="wrap";el.style.padding="8px 0";
 list.slice(0,40).forEach(function(p){el.insertAdjacentHTML("beforeend",card(p));});
}
function load(cb){
 try{var t=+localStorage.getItem(CT)||0;if(Date.now()-t<300000){var c=JSON.parse(localStorage.getItem(CK)||"null");if(c&&c.length){ALL=c;return cb();}}}catch(e){}
 fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json").then(function(r){return r.json();}).then(function(d){
  ALL=Object.keys(d||{}).map(function(id){var p=d[id]||{};p.id=id;return p;}).filter(function(p){var s=String(p.status||"").toLowerCase();return s===""||s==="active"||s==="approved";});
  try{localStorage.setItem(CK,JSON.stringify(ALL.map(slim)));localStorage.setItem(CT,String(Date.now()));}catch(e){}
  cb();
 }).catch(function(){cb();});
}
function byFlag(f){return ALL.filter(function(p){return p[f]===true;});}
function byCat(cat){return ALL.filter(function(p){var c1=String(p.categoryId||""),c2=String(p.category||"").toLowerCase(),c3=String(cat).toLowerCase();return c1===cat||c2===c3||c1.toLowerCase()===c3;});}
function fillSections(){
 fill(document.getElementById("trendingProductsGrid"),byFlag("isTrending"));
 fill(document.getElementById("flashSaleProductsGrid"),byFlag("isFlashSale"));
 fill(document.getElementById("featuredProducts"),byFlag("isFeatured"));
 if(lastCat)fill(document.getElementById("globalCatCarousel"),byCat(lastCat));
}
// Global Category buttons build
function buildGcButtons(){
 var row1=document.getElementById("globalCatsRow1"),row2=document.getElementById("globalCatsRow2");
 if(!row1||!row2)return;
 var cats=[];
 var map={};
 ALL.forEach(function(p){
  var c=(p.category||p.categoryId||"").trim();
  if(c&&c!=="Uncategorized"&&!map[c]){map[c]=true;cats.push(c);}
 });
 cats.sort();
 row1.innerHTML="";row2.innerHTML="";
 cats.forEach(function(c,i){
  var btn=document.createElement("div");
  btn.className="cat";
  btn.textContent=c;
  btn.onclick=function(){
   document.querySelectorAll("#globalCatsRow1 .cat,#globalCatsRow2 .cat").forEach(function(b){b.classList.remove("active");});
   btn.classList.add("active");
   lastCat=c;
   fill(document.getElementById("globalCatCarousel"),byCat(c));
  };
  (i<10?row1:row2).appendChild(btn);
 });
 if(cats.length){row1.firstChild.click();}
}
// window.loadGlobalCatProducts compatibility
window.loadGlobalCatProducts=function(catId){lastCat=catId;fill(document.getElementById("globalCatCarousel"),byCat(catId));};
function run(){
 fillSections();
 buildGcButtons();
 setTimeout(fillSections,5000);
 setTimeout(fillSections,10000);
 setTimeout(function(){
  ["trendingProductsGrid","flashSaleProductsGrid","dealsGrid","globalCatCarousel","featuredProducts","specialCatCarousel"].forEach(function(id){
   var el=document.getElementById(id);
   if(el&&/লোড হচ্ছে/.test(el.textContent)){el.innerHTML='<p style="text-align:center;color:#888;padding:20px">📦 এই section-এ এখনো পণ্য নেই</p>';}
  });
 },7000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){load(run);});else load(run);
})();
