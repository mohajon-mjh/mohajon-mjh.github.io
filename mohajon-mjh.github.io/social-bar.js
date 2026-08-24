/* mjh-social-bar-v1 */
(function(){
 var WA="966550171314";
 if(!document.getElementById("waFloat")){
  var a=document.createElement("a");a.id="waFloat";a.href="https://wa.me/"+WA;a.target="_blank";a.innerHTML="💬";a.title="WhatsApp অর্ডার";
  a.style.cssText="position:fixed;bottom:18px;left:14px;z-index:99998;width:52px;height:52px;border-radius:50%;background:#25d366;color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.4)";
  document.body.appendChild(a);
 }
 var f=document.querySelector("footer");
 if(f&&!document.getElementById("socRow")){
  var d=document.createElement("div");d.id="socRow";d.style.cssText="text-align:center;padding:10px 0";
  d.innerHTML='<a href="https://www.facebook.com/share/1DPYY5nJUc/" target="_blank" style="margin:0 6px;font-size:20px;text-decoration:none">📘</a><a href="https://www.tiktok.com/@jsa.media.studio" target="_blank" style="margin:0 6px;font-size:20px;text-decoration:none">🎵</a><a href="https://www.instagram.com/jsamediastudio" target="_blank" style="margin:0 6px;font-size:20px;text-decoration:none">📸</a><a href="https://www.youtube.com/@JSAMediaStudio" target="_blank" style="margin:0 6px;font-size:20px;text-decoration:none">▶️</a><a href="https://wa.me/'+WA+'" target="_blank" style="margin:0 6px;font-size:20px;text-decoration:none">💬</a>';
  f.insertBefore(d,f.firstChild);
 }
})();
