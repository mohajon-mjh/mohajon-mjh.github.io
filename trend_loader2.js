const fs=require("fs");
let h=fs.readFileSync("index.html","utf8");
h=h.replace(/<script>\/\*mjhTrendLoader2\*\/[\s\S]*?<\/script>/g,"");
const tag=`
<script>/*mjhTrendLoader2*/
(function(){
 var LIMIT=20;
 function fmt(v){return window.MJHCurrency?window.MJHCurrency.formatPrice(v):"৳"+v;}
 function load(){
  fetch('https://mohajon-mjh-default-rtdb.firebaseio.com/products.json?orderBy="isTrending"&equalTo=true')
  .then(function(r){return r.json();})
  .then(function(o){
   var g=document.getElementById("trendingProductsGrid");
   if(!g||!o)return;
   var items=Object.entries(o).filter(function(e){return e[1]&&e[1].status==="active";});
   if(!items.length)return;
   g.innerHTML="";
   items.forEach(function(e,i){
    var id=e[0],v=e[1];
    var price=+v.price||0;
    var img=(v.images&&v.images.main)||"https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
    var c=document.createElement("div");c.className="product-card";c.style.cursor="pointer";
    c.innerHTML='<div class="product-card-image"><span class="stock-badge in-stock">IN STOCK</span><img src="'+img+'" loading="lazy"></div><div class="product-card-content"><h3 class="product-card-title">'+(v.title||"")+'</h3><div class="product-card-price"><span class="current-price">'+fmt(price)+'</span></div><div class="product-card-actions" style="flex-direction:column"><button class="btn-add-to-cart">🛒 Add to Cart</button><button class="btn-buy-now">⚡ Buy Now</button></div></div>';
    c.addEventListener("click",function(){location.href="product-details.html?id="+id;});
    c.style.display=i<LIMIT?"":"none";
    g.appendChild(c);
   });
   if(items.length>LIMIT){
    var a=document.createElement("div");a.className="scroll-arrow-card";a.innerHTML="<span>→</span>";
    a.addEventListener("click",function(){
     Array.prototype.slice.call(g.children).forEach(function(x){if(x.classList.contains("product-card"))x.style.display="";});
     a.remove();
     g.scrollBy({left:400,behavior:"smooth"});
    });
    g.appendChild(a);
   }
  }).catch(function(e){console.error("trend load err",e);});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load);else setTimeout(load,300);
})();
</script>`;
h+=tag;
fs.writeFileSync("index.html",h);
console.log("loader added");
