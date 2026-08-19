const fs=require("fs");
let h=fs.readFileSync("index.html","utf8");
let changes=0;

/* 1) তিনটা 30 → 20 */
if(h.indexOf("dotdBatchSize = 30")>-1){h=h.split("dotdBatchSize = 30").join("dotdBatchSize = 20");changes++;}
if(h.indexOf("FT_LIMIT = 30")>-1){h=h.split("FT_LIMIT = 30").join("FT_LIMIT = 20");changes++;}
if(h.indexOf("CS_LIMIT = 30")>-1){h=h.split("CS_LIMIT = 30").join("CS_LIMIT = 20");changes++;}

/* 2) Global Categories-এ 20+→ system */
const globalTag=`
<script>/*mjhGlobalCat20*/
(function(){
 var LIMIT=20;
 function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
 function run(){
  var g=document.getElementById("globalCatCarousel");
  if(!g)return;
  var cards=cardsOf(g);
  if(cards.length<=LIMIT)return;
  if(g.getAttribute("data-g20")===String(cards.length))return;
  g.setAttribute("data-g20",String(cards.length));
  for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
  var old=g.querySelector(".mjh-gc-ar");if(old)old.remove();
  var a=document.createElement("div");a.className="mjh-gc-ar";
  a.innerHTML="<span>→</span>";
  a.style.cssText="flex:0 0 56px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;background:#fff;border-radius:10px;margin-left:6px;border:1px solid #e5e7eb;";
  a.onclick=function(){
   var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
   for(var i=0;i<hid.length&&i<LIMIT;i++)hid[i].style.display="";
   var rest=cardsOf(g).filter(function(c){return c.style.display==="none";});
   if(!rest.length)a.remove();
   g.scrollBy({left:400,behavior:"smooth"});
  };
  g.appendChild(a);
 }
 var n=0;var iv=setInterval(function(){n++;run();if(n>25)clearInterval(iv);},2000);
 setTimeout(run,1500);setTimeout(run,5000);setTimeout(run,9000);
})();
</script>`;
if(h.indexOf("mjhGlobalCat20")===-1){h+=globalTag;changes++;}

/* 3) Category pages (4 grids) */
const catTag=`
<script>/*mjhCatPage20*/
(function(){
 var LIMIT=20;
 var IDS=["categoryProductsGrid","productGrid","productsGrid","mainGrid"];
 function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
 function run(){
  IDS.forEach(function(id){
   var g=document.getElementById(id);
   if(!g)return;
   var cards=cardsOf(g);
   if(cards.length<=LIMIT)return;
   if(g.getAttribute("data-cp20")===String(cards.length))return;
   g.setAttribute("data-cp20",String(cards.length));
   for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
   var old=g.querySelector(".mjh-cp-ar");if(old)old.remove();
   var a=document.createElement("div");a.className="mjh-cp-ar";
   a.innerHTML="<span>→</span>";
   a.style.cssText="flex:0 0 56px;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;background:#fff;border-radius:10px;margin-left:6px;border:1px solid #e5e7eb;";
   a.onclick=function(){
    var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
    for(var i=0;i<hid.length&&i<LIMIT;i++)hid[i].style.display="";
    var rest=cardsOf(g).filter(function(c){return c.style.display==="none";});
    if(!rest.length)a.remove();
    g.scrollBy({left:400,behavior:"smooth"});
   };
   g.appendChild(a);
  });
 }
 var n=0;var iv=setInterval(function(){n++;run();if(n>25)clearInterval(iv);},2000);
 setTimeout(run,1500);setTimeout(run,5000);setTimeout(run,9000);
})();
</script>`;
if(h.indexOf("mjhCatPage20")===-1){h+=catTag;changes++;}

fs.writeFileSync("index.html",h);
console.log("Changes made:",changes);

let p=fs.readFileSync("products.html","utf8");
if(p.indexOf("mjhCatPage20")===-1){p+=catTag;fs.writeFileSync("products.html",p);console.log("products.html updated");}
