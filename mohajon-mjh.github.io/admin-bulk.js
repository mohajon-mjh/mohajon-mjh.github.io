/*admin-bulk-v1*/
(function(){
function rows(){
 var out=[];
 document.querySelectorAll('input[type="checkbox"]').forEach(function(cb){
  var el=cb.parentElement;
  for(var i=0;i<6&&el;i++){
   var rm=null;
   el.querySelectorAll("button").forEach(function(b){if((b.textContent||"").indexOf("Remove")>-1&&!rm)rm=b;});
   if(rm&&(el.textContent||"").length<2000){out.push({cb:cb,remove:rm});break;}
   el=el.parentElement;
  }
 });
 return out;
}
function addBar(){
 if(document.getElementById("bulkBar"))return;
 var head=null;
 document.querySelectorAll("h1,h2,h3,div,b").forEach(function(el){if(!head&&(el.textContent||"").indexOf("নতুন Flash Sale")>-1&&(el.textContent||"").length<60)head=el;});
 if(!head)return;
 var bar=document.createElement("div");bar.id="bulkBar";bar.style.cssText="display:flex;gap:10px;align-items:center;margin:10px 0;flex-wrap:wrap";
 bar.innerHTML='<label style="display:flex;gap:6px;align-items:center;color:#fff;font-size:13px;font-weight:700"><input type="checkbox" id="bulkAll" style="width:18px;height:18px"> সব সিলেক্ট</label><button id="bulkDel" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer">🗑️ সিলেক্টেড রিমুভ</button>';
 head.parentElement.insertBefore(bar,head.nextSibling);
 bar.querySelector("#bulkAll").onchange=function(e){rows().forEach(function(r){r.cb.checked=e.target.checked;});};
 bar.querySelector("#bulkDel").onclick=function(){var rs=rows().filter(function(r){return r.cb.checked;});if(!rs.length){alert("কোনো পণ্য সিলেক্ট করা নেই");return;}if(!confirm(rs.length+" টি পণ্য রিমুভ করবেন?"))return;rs.forEach(function(r){r.remove.click();});};
}
setTimeout(addBar,1500);setInterval(addBar,3000);
})();
