/* mjh-manual-ads-v1 */
(function(){
var PUB="ca-pub-5496507853221471";
var S={top:"8983842600",flash:"4113187125",mid:"5048517352",bottom:"3512074406",prod:"8796190673"};
function mk(slot){
 var w=document.createElement("div");w.className="mjh-ad";w.setAttribute("data-adslot",slot);
 w.style.cssText="margin:16px auto;max-width:970px;text-align:center;min-height:50px";
 w.innerHTML='<ins class="adsbygoogle" style="display:block" data-ad-client="'+PUB+'" data-ad-slot="'+slot+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
 return w;
}
function push(){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}}
function sec(el){return el.closest(".section")||el;}
function place(){
 try{
 if(localStorage.getItem("mjh_ads_off")==="1")return;
 var path=location.pathname;
 var home=(path==="/"||/index/.test(path)||path==="");
 if(home){
  var f=document.querySelector("#flashCatsRow");
  if(f&&!document.querySelector('[data-adslot="'+S.top+'"]')){var a1=mk(S.top);var fs=sec(f);fs.parentNode.insertBefore(a1,fs);push();}
  var g=document.querySelector("#flashSaleProductsGrid");
  if(g&&!document.querySelector('[data-adslot="'+S.flash+'"]')){var a2=mk(S.flash);sec(g).parentNode.insertBefore(a2,sec(g).nextSibling);push();}
  var t=document.querySelector("#trendingProductsGrid");
  if(t&&!document.querySelector('[data-adslot="'+S.mid+'"]')){var a3=mk(S.mid);sec(t).parentNode.insertBefore(a3,sec(t).nextSibling);push();}
  var ft=document.querySelector("footer");
  if(ft&&!document.querySelector('[data-adslot="'+S.bottom+'"]')){var a4=mk(S.bottom);ft.parentNode.insertBefore(a4,ft);push();}
 }
 if(/product-details/.test(path)){
  var main=document.querySelector("main")||document.body;
  if(!document.querySelector('[data-adslot="'+S.prod+'"]')){
   var a5=mk(S.prod);
   var price=main.querySelector("h1");
   if(price)price.parentNode.insertBefore(a5,price.nextSibling);else main.appendChild(a5);
   push();
  }
 }
 }catch(e){}
}
window.addEventListener("load",function(){setTimeout(place,2000);setTimeout(place,6000);});
})();
