/* hp-enhance v3 - UNLIMITED files + price list matcher - ALL 7 sections */
(function(){
"use strict";
function $(id){return document.getElementById(id);}
var pending=[];
function smartTitle(f){var n=f.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim();return n.replace(/\b(\w)(\w*)/g,function(a,b,c){return b.toUpperCase()+c.toLowerCase();});}
function norm(s){return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
function parseLine(line){
 line=line.trim().replace(/[,،]\s*$/,"");
 var name="",price=0,di=-1;
 for(var i=line.length-1;i>=0;i--){var ch=line.charAt(i);if(ch==="\u2014"||ch==="\u2013"){di=i;break;}}
 if(di>-1){name=line.slice(0,di).trim();price=parseFloat(line.slice(di+1).replace(/[^\d.]/g,""))||0;}
 else{var pm=line.match(/\u09F3\s*([\d,]+(?:\.\d+)?)/);
  if(pm){price=parseFloat(pm[1].replace(/,/g,""))||0;name=line.replace(pm[0],"").trim();}
  else{var em=line.match(/\s([\d,]+(?:\.\d+)?)$/);if(em){price=parseFloat(em[1].replace(/,/g,""))||0;name=line.slice(0,line.length-em[0].length).trim();}}}
 return{name:name,price:price};
}
function score(t,n){var tw=norm(t).split(" ").filter(Boolean);var nw=norm(n).split(" ").filter(Boolean);if(!tw.length||!nw.length)return 0;var hits=0;nw.forEach(function(w){if(tw.indexOf(w)>-1)hits++;});if(norm(t).indexOf(norm(n))>-1||norm(n).indexOf(norm(t))>-1)return 1;return nw.length?hits/nw.length:0;}
function ensurePanel(){
 if($("hpSmartPanel"))return;
 var host=$("mainArea");if(!host)return;
 var p=document.createElement("div");p.id="hpSmartPanel";p.style.cssText="background:#232f3e;border-radius:8px;padding:10px;margin:8px 0;border:1px solid #FFD814";
 p.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input type="file" id="hpFiles" accept="image/*" multiple style="flex:1;min-width:160px"><button class="btn" style="background:#27ae60" id="hpLoad">📥 ফাইল লোড</button><span id="hpCount" style="color:#FFD814;font-weight:700"></span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><textarea id="hpPrices" rows="4" placeholder="দাম লিস্ট পেস্ট করুন (প্রতি লাইনে: নাম \u2014 \u09F3দাম)" style="flex:1;min-width:200px;background:#111;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px"></textarea><button class="btn" style="background:#f39c12" id="hpMatch">\u2705 দাম মিলান</button><button class="btn" style="background:#2980b9" id="hpSaveAll">\uD83D\uDCBE সব Save</button></div><div id="hpPend" style="max-height:400px;overflow-y:auto;margin-top:8px"></div>';
 host.insertBefore(p,host.firstChild);
 $("hpLoad").onclick=function(){var f=$("hpFiles");if(!f||!f.files.length)return alert("\u274C ফাইল সিলেক্ট করুন");Array.prototype.forEach.call(f.files,function(file){pending.push({title:smartTitle(file.name),price:0,stock:10,file:file});});render();alert("\u2705 "+f.files.length+"টা ফাইল লোড হয়েছে (মোট: "+pending.length+")");};
 $("hpMatch").onclick=function(){var lines=($("hpPrices").value||"").split("\n").map(function(l){return l.trim();}).filter(Boolean);var parsed=lines.map(parseLine).filter(function(q){return q.name&&q.price>0;});var n=0;pending.forEach(function(p){var best=null,bs=0;parsed.forEach(function(q){var s=score(p.title,q.name);if(s>bs){bs=s;best=q;}});if(best&&bs>=0.5){p.price=best.price;n++;}});render();alert("\u2705 "+n+"টার দাম বসেছে");};
 $("hpSaveAll").onclick=saveAll;
}
function render(){var box=$("hpPend");if(!box)return;
 box.innerHTML=pending.map(function(p,i){return '<div style="display:flex;gap:6px;align-items:center;background:#1a242f;border-radius:6px;padding:5px;margin:4px 0;flex-wrap:wrap"><span style="color:#888;font-size:11px">'+(i+1)+'</span><input value="'+String(p.title).replace(/"/g,"&quot;")+'" data-i="'+i+'" data-f="title" style="flex:2;min-width:110px"><input type="number" value="'+p.price+'" data-i="'+i+'" data-f="price" style="width:80px"><input type="number" value="'+p.stock+'" data-i="'+i+'" data-f="stock" style="width:60px"><button class="btn" style="background:#c0392b" data-del="'+i+'">\u2715</button></div>';}).join("");
 box.oninput=function(e){var t=e.target;if(!t.dataset)return;var i=+t.dataset.i;var f=t.dataset.f;if(pending[i]&&f)pending[i][f]=(f==="title")?t.value:(+t.value||0);};
 box.onclick=function(e){var b=e.target.closest?e.target.closest("button[data-del]"):null;if(b){pending.splice(+b.dataset.del,1);render();}};
 var s=$("hpSaveAll");if(s)s.textContent="\uD83D\uDCBE সব Save ("+pending.length+")";
 var c=$("hpCount");if(c)c.textContent=pending.length?"("+pending.length+"টা ফাইল)":"";
}
function saveAll(){
 var X=window.HPX;if(!X)return alert("\u274C লোড হয়নি");
 if(!pending.length)return alert("\u274C লিস্ট খালি");
 if(!confirm(pending.length+"টা পণ্য Save করবেন?"))return;
 var S=null;window.HP_SECTIONS.forEach(function(s){if(s.key===X.sec())S=s;});
 if(!S)return alert("\u274C section ঠিক নেই");
 var cat=X.cat();var n=0,tot=pending.length;var fd=X.fd(),db=X.db();
 var st=$("hpSaveAll");if(st){st.disabled=true;st.textContent="\u23F3 Save হচ্ছে (0/"+tot+")";}
 (function next(i){
  if(i>=tot){if(st){st.disabled=false;st.textContent="\uD83D\uDCBE সব Save";};alert("\u2705 "+n+"টা পণ্য Save হয়েছে");pending=[];render();X.reload();return;}
  var p=pending[i];
  if(st)st.textContent="\u23F3 Save হচ্ছে ("+i+"/"+tot+")";
  function fin(url){var id="p_"+Date.now().toString(36)+Math.random().toString(36).substr(2,4);
   var obj={title:p.title,price:p.price,stock:p.stock,status:"active",createdAt:Date.now(),images:{main:url||""}};
   fd.set(fd.ref(db,"products/"+id),obj).then(function(){
    if(S&&S.hasCats&&cat)return fd.set(fd.ref(db,S.prodPath+"/"+cat+"/"+id),{id:id,addedAt:Date.now()});
    if(S&&!S.hasCats&&S.flag){var up={};up["products/"+id+"/"+S.flag]=true;return fd.update(fd.ref(db),up);}
    if(S&&S.cs)return fd.set(fd.ref(db,"futureProducts/"+id),{title:p.title,expectedPrice:p.price,discountPercent:0,categoryId:"coming_soon",createdAt:Date.now(),released:false,images:{main:url||""}});
   }).then(function(){n++;next(i+1);}).catch(function(e){alert("\u274C "+e.message);next(i+1);});}
  if(p.file){var rd=new FileReader();rd.onload=function(){var img=new Image();img.onload=function(){var c=document.createElement("canvas");var w=400,h2=Math.round(400*img.height/img.width)||400;c.width=w;c.height=h2;var cx=c.getContext("2d");cx.fillStyle="#fff";cx.fillRect(0,0,w,h2);cx.drawImage(img,0,0,w,h2);fin(c.toDataURL("image/jpeg",0.72));};img.onerror=function(){fin("");};img.src=rd.result;};rd.readAsDataURL(p.file);}
  else fin("");
 })(0);
}
setInterval(function(){
 var X=window.HPX;if(!X)return;
 var S=null;window.HP_SECTIONS.forEach(function(s){if(s.key===X.sec())S=s;});
 var on=!!S&&(!!X.cat()||!S.hasCats);
 if(on){ensurePanel();var p=$("hpSmartPanel");if(p)p.style.display="";}
 else{var p2=$("hpSmartPanel");if(p2)p2.style.display="none";}
},1000);
})();
