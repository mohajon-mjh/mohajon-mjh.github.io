/* mjh-feed-ads-v1 */
(function(){
var PUB="ca-pub-5496507853221471";
var SLOT="5048517352";
function place(){
 try{
 if(localStorage.getItem("mjh_ads_off")==="1")return;
 var cards=document.querySelectorAll(".product-card, .product-item, [data-product-id]");
 if(cards.length<10)return;
 for(var i=9;i<cards.length;i+=10){
  var ref=cards[i];
  if(ref.nextElementSibling&&ref.nextElementSibling.classList.contains("mjh-feed-ad"))continue;
  var w=document.createElement("div");w.className="mjh-feed-ad";
  w.style.cssText="grid-column:1/-1;width:100%;margin:12px 0;text-align:center;min-height:60px";
  w.innerHTML='<ins class="adsbygoogle" style="display:block" data-ad-client="'+PUB+'" data-ad-slot="'+SLOT+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  ref.parentNode.insertBefore(w,ref.nextSibling);
  try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}
 }
 }catch(e){}
}
window.addEventListener("load",function(){setTimeout(place,2000);setTimeout(place,6000);setTimeout(place,12000);});
})();
