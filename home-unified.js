/* MJH Home Unified Super Loader v2 - 100% Cache First, 0 Extra Firebase Calls on Load */
(function(){
"use strict";
var CK="mjh_home_cache", CT="mjh_home_cache_t", ALL=[], lastCat=null;

// 1. ডেটা স্লিম করা (শুধু প্রয়োজনীয় ফিল্ড)
function slim(p){
  return {
    id:p.id, title:p.title, price:p.price, discountPrice:p.discountPrice, 
    oldPrice:p.oldPrice, stock:p.stock, status:p.status, category:p.category, 
    categoryId:p.categoryId, images:p.images, image:p.image, 
    isTrending:p.isTrending, isFeatured:p.isFeatured, isFlashSale:p.isFlashSale, 
    isRecommended:p.isRecommended
  };
}

// 2. ক্যাশ বা Firebase থেকে লোড করা
function load(cb){
  try{
    var t=+localStorage.getItem(CT)||0;
    if(Date.now()-t < 300000){ // ৫ মিনিট ক্যাশ ভ্যালিড
      var c=JSON.parse(localStorage.getItem(CK)||"null");
      if(c && c.length){ ALL=c; return cb(); } // ⚡ INSTANT LOAD FROM CACHE
    }
  }catch(e){}
  
  // ক্যাশ না থাকলে বা এক্সপায়ার হলে Firebase থেকে আনবে
  fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/products.json")
  .then(function(r){ return r.json(); })
  .then(function(d){
    ALL = Object.keys(d||{}).map(function(id){ var p=d[id]||{}; p.id=id; return p; });
    try{
      localStorage.setItem(CK, JSON.stringify(ALL.map(slim)));
      localStorage.setItem(CT, String(Date.now()));
    }catch(e){}
    cb();
  }).catch(function(){ cb(); });
}

function active(p){ var s=String(p.status||"").toLowerCase(); return s===""||s==="active"||s==="approved"; }

function priceTxt(p){
  try{ if(window.MJHCurrency && MJHCurrency.formatPrice) return MJHCurrency.formatPrice(p.price); }catch(e){}
  return "৳"+(parseFloat(p.price)||0).toFixed(2);
}

// 3. প্রোডাক্ট কার্ড তৈরি
function card(p){
  var img=(p.images&&(p.images.main||p.images[0]))||p.image||"https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
  var old=parseFloat(p.oldPrice||p.discountPrice)||0, pr=parseFloat(p.price)||0;
  var disc=old>pr?Math.round(((old-pr)/old)*100):0;
  return '<a href="product-details.html?id='+p.id+'" style="text-decoration:none;color:inherit">'+
    '<div style="min-width:170px;max-width:170px;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.08);overflow:hidden;margin-right:12px;flex:0 0 auto">'+
    '<div style="position:relative">'+
    '<img src="'+img+'" loading="lazy" style="width:100%;height:130px;object-fit:contain;background:#f1f3f5;display:block">'+
    (p.stock>0?'<span style="position:absolute;top:6px;left:6px;background:#22c55e;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">IN STOCK</span>':
    '<span style="position:absolute;top:6px;left:6px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">OUT OF STOCK</span>')+
    (disc>0?'<span style="position:absolute;top:6px;right:6px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">-'+disc+'%</span>':'')+
    '</div><div style="padding:10px">'+
    '<div style="font-size:12px;font-weight:600;color:#0b1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(p.title||"Product")+'</div>'+
    '<div style="margin-top:6px;font-size:14px;font-weight:800;color:#0b1a2e">'+priceTxt(p)+
    (old>pr?' <span style="font-size:11px;color:#94a3b8;text-decoration:line-through;font-weight:500">'+priceTxt(old)+'</span>':'')+
    '</div></div></div></a>';
}

// 4. সেকশনে ডেটা ফিল করা
function fill(el, list){
  if(!el) return;
  el.innerHTML="";
  if(!list.length){
    el.style.display="block";
    el.innerHTML='<p style="text-align:center;color:#888;padding:20px">📦 এই section-এ এখনো পণ্য যোগ করা হয়নি</p>';
    return;
  }
  el.style.display="flex"; el.style.overflowX="auto"; el.style.padding="8px 0";
  list.slice(0, 40).forEach(function(p){ el.insertAdjacentHTML("beforeend", card(p)); });
}

function byFlag(f){ return ALL.filter(function(p){ return active(p) && p[f]===true; }); }
function byCat(cat){ return ALL.filter(function(p){ return active(p) && ((p.categoryId||"")===cat || String(p.category||"").toLowerCase()===String(cat).toLowerCase()); }); }

// 5. সব সেকশন একসাথে রেন্ডার করা (এটাই মেইন ম্যাজিক)
function fillAllSections(){
  fill(document.getElementById("trendingProductsGrid"), byFlag("isTrending"));
  fill(document.getElementById("flashSaleProductsGrid"), byFlag("isFlashSale"));
  fill(document.getElementById("featuredProducts"), byFlag("isFeatured"));
  
  // Deals of the Day (Fallback to Flash Sale or Recommended if no specific flag)
  var deals = byFlag("isFlashSale").length > 0 ? byFlag("isFlashSale") : byFlag("isRecommended");
  fill(document.getElementById("dealsGrid"), deals);
  
  // Special Categories (Using Featured or Trending as fallback for special display)
  fill(document.getElementById("specialCatCarousel"), byFlag("isFeatured")); 
  
  if(lastCat) fill(document.getElementById("globalCatCarousel"), byCat(lastCat));
}

function run(){
  window.loadGlobalCatProducts = function(catId){
    lastCat=catId;
    fill(document.getElementById("globalCatCarousel"), byCat(catId));
  };
  
  fillAllSections(); // ⚡ INSTANT RENDER FROM CACHE
  
  // Auto-click first category if none selected
  var b=document.querySelector("#globalCatsRow1 .cat.active")||document.querySelector("#globalCatsRow1 .cat");
  if(b && !lastCat){ try{b.click();}catch(e){} }
  
  // Fallback for slow networks after 3 seconds
  setTimeout(function(){
    ["trendingProductsGrid","flashSaleProductsGrid","dealsGrid","globalCatCarousel","featuredProducts","specialCatCarousel"].forEach(function(id){
      var el=document.getElementById(id);
      if(el && /লোড হচ্ছে/.test(el.textContent)){
        el.style.display="block";
        el.innerHTML='<p style="text-align:center;color:#888;padding:20px">📦 লোড হচ্ছে... অথবা এই section-এ পণ্য নেই</p>';
      }
    });
  }, 3000);
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ load(run); });
else load(run);
})();
