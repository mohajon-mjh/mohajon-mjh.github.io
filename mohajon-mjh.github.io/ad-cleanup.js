/* mjh-ad-cleanup-v1 : hide empty ad boxes, show when ads arrive */
(function(){
 function tidy(){
  document.querySelectorAll(".mjh-ad, .mjh-feed-ad").forEach(function(w){
   var ins=w.querySelector("ins.adsbygoogle");
   if(!ins)return;
   var has=ins.querySelector("iframe");
   w.style.display=has?"":"none";
  });
 }
 window.addEventListener("load",function(){setTimeout(tidy,6000);setTimeout(tidy,12000);setTimeout(tidy,20000);});
})();
