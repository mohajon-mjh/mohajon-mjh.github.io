const fs=require("fs");
["index.html","products.html"].forEach(function(f){
 if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,"utf8");
 h=h.replace(/<script>\/\*mjhStripArrows2-v1\*\/[\s\S]*?<\/script>/g,"");
 h=h.replace(/<script>\/\*mjhStripArrows-v1\*\/[\s\S]*?<\/script>/g,"");
 fs.writeFileSync(f,h);
 console.log(f,"cleaned");
});
let a=fs.readFileSync("autofill-module.js","utf8");
const aOld=/const tg=document\.getElementById\("trendingProductsGrid"\);\s*if\(tg&&isEmptyGrid\(tg\)&&!filled\.trend\)\{filled\.trend=1;fillGrid\(tg,pool\);\}/;
if(aOld.test(a)){a=a.replace(aOld,"/*trending-autofill-off*/");console.log("autofill trending OFF");}
fs.writeFileSync("autofill-module.js",a);
let c=fs.readFileSync("category-gate.js","utf8");
const cOld=/if\(nT\)\{F2\.t=1;fillG\(tg,pl\);\}/;
if(cOld.test(c)){c=c.replace(cOld,"/*trending-gate-off*/");console.log("gate trending OFF");}
fs.writeFileSync("category-gate.js",c);
const tag=`
<script>/*mjhArrowsV3*/
(function(){
 var LIMIT=20;
 var SKIP={trendingProductsGrid:1,flashSaleProductsGrid:1,specialCatCarousel:1};
 function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
 function arrow(g){
  var old=g.querySelector(".mjh-ar3");if(old)old.remove();
  var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
  if(!hid.length)return;
  var a=document.createElement("div");a.className="mjh-ar3";
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
 function ensure(g){
  if(SKIP[g.id])return;
  var cards=cardsOf(g);
  if(cards.length<=LIMIT)return;
  if(g.getAttribute("data-ar3")===String(cards.length))return;
  g.setAttribute("data-ar3",String(cards.length));
  for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
  arrow(g);
 }
 function scan(){
  var ds=document.querySelectorAll("div,ul,section");
  for(var i=0;i<ds.length;i++){var d=ds[i];if(d.children.length>20&&cardsOf(d).length>20)ensure(d);}
 }
 var n=0;var iv=setInterval(function(){n++;scan();if(n>25)clearInterval(iv);},2000);
 setTimeout(scan,1500);setTimeout(scan,5000);setTimeout(scan,9000);
})();
</script>
`;
["index.html","products.html"].forEach(function(f){
 if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,"utf8");
 if(h.indexOf("mjhArrowsV3")===-1){h+=tag;fs.writeFileSync(f,h);console.log(f,"v3 arrows added");}
});
