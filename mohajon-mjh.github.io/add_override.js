const fs = require("fs");
let h = fs.readFileSync("index.html", "utf8");
const tag = `<script type="module">/*mjhTrendOverride*/
import{initializeApp}from"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import{getDatabase,ref,get}from"https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const ovApp=initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"},"mjhOverride");
const ovDb=getDatabase(ovApp);
setTimeout(async function(){
 try{
  const snap=await get(ref(ovDb,"products"));
  const all=snap.val()||{};
  const list=Object.entries(all).filter(function(e){return e[1]&&e[1].isTrending===true&&e[1].status==="active";});
  if(!list.length)return;
  const grid=document.getElementById("trendingProductsGrid");
  if(!grid)return;
  grid.innerHTML="";
  list.slice(0,30).forEach(function(e){
   const id=e[0],v=e[1];
   const img=(v.images&&v.images.main)||"https://dummyimage.com/300x300/eeeeee/555555&text=MJH";
   const price=window.MJHCurrency?window.MJHCurrency.formatPrice(+v.price||0):"৳"+(+v.price||0);
   const c=document.createElement("div");c.className="product-card";c.style.cursor="pointer";
   c.innerHTML='<div class="product-card-image"><span class="stock-badge in-stock">In Stock</span><img src="'+img+'" loading="lazy"></div><div class="product-card-content"><h3 class="product-card-title">'+(v.title||"Product")+'</h3><div class="product-card-price"><span class="current-price">'+price+'</span></div><div class="product-card-actions" style="flex-direction:column"><button class="btn-add-to-cart">🛒 Add</button><button style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px">⚡ Buy</button></div></div>';
   c.addEventListener("click",function(){location.href="product-details.html?id="+id;});
   grid.appendChild(c);
  });
  console.log("TRENDING OVERRIDE:",list.length,"products");
 }catch(e){console.error(e);}
},3500);
</script>`;
if(h.indexOf("mjhTrendOverride")===-1){
 h = h.replace("</body>", tag + "</body>");
 fs.writeFileSync("index.html", h, "utf8");
 console.log("SUCCESS: Override added, file size:", fs.statSync("index.html").size);
} else {
 console.log("ALREADY EXISTS");
}
