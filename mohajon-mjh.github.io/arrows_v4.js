const fs=require("fs");
const tag=`
<script>/*mjhArrowsV4*/
(function(){
var LIMIT=20;
var TARGETS=["flashSaleProductsGrid","trendingProductsGrid","specialCatCarousel","dealsGrid","featuredProducts","comingSoonGrid","globalCatCarousel","productsGrid","productGrid","allProductsGrid","categoryProductsGrid","catProductsGrid","searchGrid","mainGrid"];
function cardsOf(g){var out=[],ch=g.children;for(var i=0;i<ch.length;i++){if(ch[i].classList&&ch[i].classList.contains("product-card"))out.push(ch[i]);}return out;}
function makeArrow(g){
 var old=g.querySelector(".mjh-ar4");if(old)old.remove();
 var hid=cardsOf(g).filter(function(c){return c.style.display==="none";});
 if(!hid.length)return;
 var a=document.createElement("div");a.className="mjh-ar4";
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
function apply(g){
 if(!g)return false;
 if(g.querySelector(".scroll-arrow-card"))return false;
 var cards=cardsOf(g);
 if(cards.length<=LIMIT)return false;
 if(g.getAttribute("data-ar4")===String(cards.length))return true;
 g.setAttribute("data-ar4",String(cards.length));
 for(var i=0;i<cards.length;i++)cards[i].style.display=i<LIMIT?"":"none";
 makeArrow(g);
 return true;
}
function scan(){
 var done=[];
 TARGETS.forEach(function(id){
  var g=document.getElementById(id);
  if(g&&cardsOf(g).length>0){
   var r=apply(g);
   done.push(id+"="+cardsOf(g).length+(r?"->20+ARROW":(g.querySelector(".scroll-arrow-card")?"->native-arrow":"")));
  }
 });
 var ds=document.querySelectorAll("div,ul,section");
 for(var i=0;i<ds.length;i++){
  var d=ds[i];if(d.id&&TARGETS.indexOf(d.id)>-1)continue;
  if(d.children.length>20&&cardsOf(d).length>20){apply(d);done.push((d.id||"auto")+"=auto");}
 }
 window.MJH_ARROW_REPORT=done.join(" | ");
}
var n=0;var iv=setInterval(function(){n++;scan();if(n>25)clearInterval(iv);},2000);
setTimeout(scan,1500);setTimeout(scan,5000);setTimeout(scan,9000);
})();
</script>
`;
["index.html","products.html"].forEach(function(f){
 if(!fs.existsSync(f))return;
 let h=fs.readFileSync(f,"utf8");
 h=h.replace(/<script>\/\*mjhArrowsV3\*\/[\s\S]*?<\/script>/g,"");
 if(h.indexOf("mjhArrowsV4")===-1){h+=tag;}
 fs.writeFileSync(f,h);
 console.log(f,"-> V4 installed");
});
