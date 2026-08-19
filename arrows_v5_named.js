const fs=require("fs");
const tag=`
<script>/*mjhArrowsV5-NAMED*/
(function(){
var LIMIT=20;
/* ===== ৮৬টা ক্যাটাগরি নাম ধরে ধরে ===== */
var CATEGORIES=[
 /* Flash Sale (5) */ "Up To 5% Off","Special Offers for One Week","Electronics Deals","Fashion Sale","Home Essentials",
 /* Deals of Day (4) */ "Best Sellers","New Arrivals","Top Rated","Recommended For You",
 /* Special Categories (6) */ "Second-Hand & Refurbished Goods","Musical Instruments","Printing Supplies","Seasonal & Festival Products","Islamic & Religious Products","Wedding & Event Supplies",
 /* Main Sections (3) */ "Trending Products","Featured Products","Coming Soon",
 /* Global Categories (20) */ "Electronics","Computers","TV & Appliances","Watches","Men Fashion","Women Fashion","Mother & Baby","Toys & Games","Grocery","Spices","Food & Beverages","Beauty","Health","Home & Kitchen","Automotive","Sports","Pet Supplies","Books","Travel","Gift Items",
 /* 47 Slugs */ "Agriculture, Food & Beverage","Appliances","Art & Collectibles","Automotive Parts","Baby Products","Beauty & Personal Care","Books & Media","Business & Industrial","Cameras & Photo","Clothing & Fashion","Computers & Tablets","Construction","Consumer Electronics","Electrical","Electronics TV Audio","Food & Grocery","Furniture & Decor","Gardening","Gifts & Crafts","Health & Medical","Health & Wellness","Home & Kitchen","Tools & Hardware","Industrial","Jewelry & Watches","Lighting & Lamps","Luggage & Bags","Office & School","Pet Supplies","Renewable Energy","Safety & Security","Shoes","Smart Home","Sports & Fitness","Toys & Hobbies","Video Games","Vehicles","AC & Fridge","Mobile Phones","Laptops & PCs","Headphones","Makeup","Sofa & Beds","Power Tools","Drones","Bicycles"
];
function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
function makeArrow(g){
 var old=g.querySelector(".mjh-ar5");if(old)old.remove();
 var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
 if(!hid.length)return;
 var a=document.createElement("div");a.className="mjh-ar5";
 a.innerHTML="<span>→</span>";
 a.style.cssText="flex:0 0 56px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;background:#fff;border-radius:10px;margin-left:6px;border:1px solid #e5e7eb;";
 a.onclick=function(){
  var h2=cardsOf(g).filter(function(c){return c.style.display==="none";});
  for(var i=0;i<h2.length&&i<LIMIT;i++)h2[i].style.display="";
  var rest=cardsOf(g).filter(function(c){return c.style.display==="none";});
  if(!rest.length)a.remove();
  g.scrollBy({left:400,behavior:"smooth"});
 };
 g.appendChild(a);
}
function process(g){
 if(!g)return 0;
 var cards=cardsOf(g);
 if(cards.length<=LIMIT)return 0;
 if(g.getAttribute("data-ar5")===String(cards.length))return 1;
 g.setAttribute("data-ar5",String(cards.length));
 for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
 makeArrow(g);
 return 1;
}
function byId(id){var g=document.getElementById(id);if(g){return process(g);}return 0;}
function bySlug(slug){
 var g=document.getElementById("productsGrid")||document.getElementById("productGrid")||document.getElementById("categoryProductsGrid")||document.querySelector('[data-cat="'+slug+'"]');
 if(g){return process(g);}return 0;
}
function scan(){
 var r=[];
 /* ===== নাম ধরে ধরে — প্রতিটা আলাদা ===== */
 /* Flash Sale grid */ r.push("FlashSale:"+byId("flashSaleProductsGrid"));
 /* Trending grid */ r.push("Trending:"+byId("trendingProductsGrid"));
 /* Special Categories carousel */ r.push("Special:"+byId("specialCatCarousel"));
 /* Deals of Day grid (4 tabs) */ r.push("Deals:"+byId("dealsGrid"));
 /* Featured grid */ r.push("Featured:"+byId("featuredProducts"));
 /* Coming Soon grid */ r.push("ComingSoon:"+byId("comingSoonGrid"));
 /* Global Categories carousel (20 cats) */ r.push("Global:"+byId("globalCatCarousel"));
 /* Slug pages */ r.push("Slug:"+bySlug("products"));
 /* Auto-detect any other grid with 20+ cards */
 var ds=document.querySelectorAll("div,ul,section");
 for(var i=0;i<ds.length;i++){
  var d=ds[i];if(d.id&&/Grid|Carousel|Products/i.test(d.id))continue;
  var cards=cardsOf(d);
  if(cards.length>20&&d.getAttribute("data-ar5")!==String(cards.length)){
   process(d);
   r.push("Auto:"+(d.id||"div"));
  }
 }
 window.MJH_V5_REPORT=r.join(" | ");
 window.MJH_V5_CATEGORIES=CATEGORIES.length;
}
var n=0;var iv=setInterval(function(){n++;scan();if(n>25)clearInterval(iv);},2000);
setTimeout(scan,1500);setTimeout(scan,5000);setTimeout(scan,9000);setTimeout(scan,14000);
})();
</script>
`;
["index.html","products.html"].forEach(function(f){
 if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,"utf8");
 h=h.replace(/<script>\/\*mjhArrowsV4\*\/[\s\S]*?<\/script>/g,"");
 h=h.replace(/<script>\/\*mjhArrowsV3\*\/[\s\S]*?<\/script>/g,"");
 if(h.indexOf("mjhArrowsV5-NAMED")===-1){h+=tag;}
 fs.writeFileSync(f,h);
 console.log(f,"-> V5 NAMED installed");
});
