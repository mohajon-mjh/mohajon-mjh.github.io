const fs=require("fs");
const css=`
<style>/*mjhArrowV9CSS*/
.scroll-arrow-card{border:2px solid #16a34a !important;background:#ffffff !important;border-radius:12px !important;box-shadow:0 2px 8px rgba(22,163,74,.25) !important;}
.scroll-arrow-card span{color:#16a34a !important;font-weight:900 !important;font-size:36px !important;line-height:1 !important;}
</style>`;
const v9=`
<script>/*mjhArrowV9*/
(function(){
 var LIMIT=20;
 /* ===== ৩৮টা ক্যাটাগরি — প্রতিটার নাম আলাদা লাইনে ===== */
 var CATS={
  /* Flash Sale (৫) */
  "Up To 5% Off":"flashSaleProductsGrid",
  "Special Offers for One Week":"flashSaleProductsGrid",
  "Electronics Deals":"flashSaleProductsGrid",
  "Fashion Sale":"flashSaleProductsGrid",
  "Home Essentials":"flashSaleProductsGrid",
  /* Deals of Day (৪) */
  "Best Sellers":"dealsGrid",
  "New Arrivals":"dealsGrid",
  "Top Rated":"dealsGrid",
  "Recommended For You":"dealsGrid",
  /* Special (৬) */
  "Second-Hand & Refurbished Goods":"specialCatCarousel",
  "Musical Instruments":"specialCatCarousel",
  "Printing Supplies":"specialCatCarousel",
  "Seasonal & Festival Products":"specialCatCarousel",
  "Islamic & Religious Products":"specialCatCarousel",
  "Wedding & Event Supplies":"specialCatCarousel",
  /* মূল সেকশন (৩) */
  "Trending Products":"trendingProductsGrid",
  "Featured Products":"featuredProducts",
  "Coming Soon":"comingSoonGrid",
  /* Global (২০) */
  "Electronics":"globalCatCarousel",
  "Computers":"globalCatCarousel",
  "TV & Appliances":"globalCatCarousel",
  "Watches":"globalCatCarousel",
  "Men Fashion":"globalCatCarousel",
  "Women Fashion":"globalCatCarousel",
  "Mother & Baby":"globalCatCarousel",
  "Toys & Games":"globalCatCarousel",
  "Grocery":"globalCatCarousel",
  "Spices":"globalCatCarousel",
  "Food & Beverages":"globalCatCarousel",
  "Beauty":"globalCatCarousel",
  "Health":"globalCatCarousel",
  "Home & Kitchen":"globalCatCarousel",
  "Automotive":"globalCatCarousel",
  "Sports":"globalCatCarousel",
  "Pet Supplies":"globalCatCarousel",
  "Books":"globalCatCarousel",
  "Travel":"globalCatCarousel",
  "Gift Items":"globalCatCarousel"
 };
 function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
 function makeArrow(g){
  var old=g.querySelector(".mjh-v9-ar");if(old)old.remove();
  var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
  if(!hid.length)return;
  var a=document.createElement("div");a.className="mjh-v9-ar";
  a.innerHTML="<span>→</span>";
  a.style.cssText="flex:0 0 60px;min-width:60px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;border-radius:12px;margin-left:6px;border:2px solid #16a34a;box-shadow:0 2px 8px rgba(22,163,74,.25);";
  a.firstChild.style.cssText="color:#16a34a;font-weight:900;font-size:36px;line-height:1;";
  a.onclick=function(ev){
   ev.stopPropagation();
   var h2=cardsOf(g).filter(function(c){return c.style.display==="none";});
   for(var i=0;i<h2.length&&i<LIMIT;i++)h2[i].style.display="";
   if(!cardsOf(g).filter(function(c){return c.style.display==="none";}).length)a.remove();
   g.scrollBy({left:400,behavior:"smooth"});
  };
  g.appendChild(a);
 }
 function ensure(g){
  if(!g||g.querySelector(".scroll-arrow-card"))return;
  var cards=cardsOf(g);
  if(cards.length<=LIMIT)return;
  if(g.getAttribute("data-v9")===String(cards.length))return;
  g.setAttribute("data-v9",String(cards.length));
  for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
  makeArrow(g);
 }
 function scan(){
  var seen={};
  for(var name in CATS){var id=CATS[name];if(seen[id])continue;seen[id]=1;ensure(document.getElementById(id));}
  ["categoryProductsGrid","productGrid","productsGrid","mainGrid"].forEach(function(id){ensure(document.getElementById(id));});
  var ds=document.querySelectorAll("div,ul,section");
  for(var i=0;i<ds.length;i++){var d=ds[i];if(d.children.length>20&&cardsOf(d).length>20)ensure(d);}
 }
 /* নাম ধরে: কোন ক্যাটাগরিতে ক্লিক হলে তার গ্রিড চেক */
 document.addEventListener("click",function(ev){
  var t=ev.target;
  for(var i=0;i<5&&t;i++){
   var txt=(t.textContent||"").trim();
   if(txt&&txt.length<40){
    for(var name in CATS){
     if(txt.indexOf(name)>-1){
      var id=CATS[name];
      (function(x){setTimeout(function(){ensure(document.getElementById(x));},700);setTimeout(function(){ensure(document.getElementById(x));},1600);})(id);
      break;
     }
    }
   }
   t=t.parentElement;
  }
 },true);
 var n=0;var iv=setInterval(function(){n++;scan();if(n>60)clearInterval(iv);},3000);
 setTimeout(scan,2000);setTimeout(scan,6000);
})();
</script>`;
["index.html","products.html"].forEach(function(f){
 if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,"utf8");
 ["mjhTrendOverride","mjhArrowsV6-FINAL","mjhTrendingArrow","mjhArrowV7","mjhArrowV8"].forEach(function(m){
  h=h.replace(new RegExp("<script[^>]*>\\/\\*"+m+"\\*\\/[\\s\\S]*?<\\/script>","g"),"");
 });
 h=h.replace(/<style>\/\*mjhArrowV[789]CSS\*\/[\s\S]*?<\/style>/g,"");
 const log=[];
 if(f==="index.html"){
  const oldFn='function renderTrendingCard(id, data){\n  const price = parseFloat(data.price) || 0;';
  if(h.indexOf(oldFn)>-1){h=h.replace(oldFn,oldFn+"\n  const salePrice = price;");log.push("trending fixed");}
  if(h.indexOf("const LIMIT = 30;")>-1){h=h.split("const LIMIT = 30;").join("const LIMIT = 20;");log.push("global 20");}
 }
 h+=css+v9;
 fs.writeFileSync(f,h);
 console.log(f,"-> V9 named |",log.join(",")||"clean");
});
