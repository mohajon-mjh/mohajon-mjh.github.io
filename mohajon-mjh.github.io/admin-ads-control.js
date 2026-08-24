/*admin-ads-control-v1*/
(function(){
function add(){
 if(document.getElementById("adsCtrlBtn"))return;
 var b=document.createElement("button");b.id="adsCtrlBtn";
 function isOff(){try{return localStorage.getItem("mjh_ads_off")==="1";}catch(e){return false;}}
 function label(){var off=isOff();b.innerHTML=off?"📢 এড চালু করুন":"💰 এড বন্ধ করুন";b.style.background=off?"#16a34a":"#dc2626";}
 b.style.cssText="position:fixed;bottom:120px;right:16px;z-index:99999;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";
 label();
 b.onclick=function(){
  var off=isOff();
  try{localStorage.setItem("mjh_ads_off",off?"0":"1");}catch(e){}
  label();
  var t=document.createElement("div");
  t.textContent=(off?"✅ এড চালু হয়েছে — পেজ রিফ্রেশ করুন":"⏸️ এড বন্ধ হয়েছে — পেজ রিফ্রেশ করুন");
  t.style.cssText="position:fixed;bottom:180px;left:50%;transform:translateX(-50%);background:#111;color:#fff;padding:10px 18px;border-radius:20px;font-size:13px;z-index:99999";
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},2500);
 };
 document.body.appendChild(b);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);else add();
})();
