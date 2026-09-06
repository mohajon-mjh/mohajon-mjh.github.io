/* MJH Element Picker v1 */
(function(){
if(location.search.indexOf("picker=1")===-1)return;
var isAdmin=false;
try{if(localStorage.getItem("mjhUser")||localStorage.getItem("user"))isAdmin=true;}catch(e){}
if(!isAdmin)return;
var DB="https://mohajon-mjh-default-rtdb.firebaseio.com";
var selected=null;
document.body.style.cursor="crosshair";
var tip=document.createElement("div");
tip.style.cssText="position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:9999;background:#e74c3c;color:#fff;padding:8px 18px;border-radius:20px;font-weight:700;font-size:13px";
tip.textContent="🎯 Picker Mode: যেকোনো element এ ক্লিক করুন";
document.body.appendChild(tip);
var hl=document.createElement("div");
hl.style.cssText="position:fixed;border:3px dashed #e74c3c;background:rgba(231,76,60,.12);pointer-events:none;z-index:9998;display:none;border-radius:6px";
document.body.appendChild(hl);
var panel=document.createElement("div");
panel.style.cssText="position:fixed;right:8px;bottom:8px;z-index:9999;background:#0f172a;color:#fff;border:2px solid #f39c12;border-radius:12px;padding:14px;width:290px;max-height:85vh;overflow:auto;display:none;font-size:12px";
panel.innerHTML='<b style="color:#f39c12">🎯 Selected Element</b><div id="pkSel" style="word-break:break-all;color:#8be9fd;margin:4px 0"></div><b>📏 বর্তমান Size:</b> <span id="pkCur" style="color:#7bed9f"></span><hr style="border-color:#333"><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><label>Width (px)<input id="pkW" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Height (px)<input id="pkH" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Min-Width<input id="pkMinW" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Max-Width<input id="pkMaxW" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Padding<input id="pkPad" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Font Size<input id="pkFont" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>Radius<input id="pkRad" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label><label>ভিতরের ছবি Height<input id="pkImgH" style="width:100%;padding:5px;border-radius:5px;border:1px solid #444;background:#1e293b;color:#fff"></label></div><div style="display:flex;gap:6px;margin-top:10px"><button id="pkPrev" style="flex:1;background:#3498db;color:#fff;border:none;padding:8px;border-radius:6px;font-weight:700">👁 Preview</button><button id="pkSave" style="flex:1;background:#27ae60;color:#fff;border:none;padding:8px;border-radius:6px;font-weight:700">💾 Save</button><button id="pkClose" style="background:#c0392b;color:#fff;border:none;padding:8px 10px;border-radius:6px">✖</button></div><div id="pkMsg" style="margin-top:6px;color:#7bed9f"></div>';
document.body.appendChild(panel);
function selectorFor(el){
 if(el.id)return "#"+el.id;
 var path=[],cur=el;
 while(cur&&cur!==document.body){
  if(cur.id){path.unshift("#"+cur.id);break;}
  var p=cur.parentNode;if(!p)break;
  var idx=[].indexOf.call(p.children,cur)+1;
  path.unshift(cur.tagName.toLowerCase()+":nth-child("+idx+")");
  cur=p;
 }
 return path.join(" > ");
}
document.addEventListener("click",function(e){
 if(panel.contains(e.target))return;
 e.preventDefault();e.stopPropagation();
 selected=e.target;
 var r=selected.getBoundingClientRect();
 hl.style.display="block";
 hl.style.top=(r.top-2)+"px";hl.style.left=(r.left-2)+"px";
 hl.style.width=(r.width+4)+"px";hl.style.height=(r.height+4)+"px";
 var c=getComputedStyle(selected);
 document.getElementById("pkSel").textContent=selectorFor(selected);
 document.getElementById("pkCur").textContent=c.width+" × "+c.height+" | pad:"+c.padding+" | font:"+c.fontSize;
 document.getElementById("pkW").value=parseInt(c.width)||"";
 document.getElementById("pkH").value=parseInt(c.height)||"";
 document.getElementById("pkMinW").value=parseInt(c.minWidth)||"";
 document.getElementById("pkMaxW").value=parseInt(c.maxWidth)||"";
 document.getElementById("pkPad").value=c.padding;
 document.getElementById("pkFont").value=parseInt(c.fontSize)||"";
 document.getElementById("pkRad").value=parseInt(c.borderRadius)||"";
 var img=selected.tagName==="IMG"?selected:selected.querySelector("img");
 document.getElementById("pkImgH").value=img?parseInt(getComputedStyle(img).height)||"":"";
 panel.style.display="block";
},true);
function buildCss(){
 var css={},v=function(id){return document.getElementById(id).value.trim();};
 if(v("pkW"))css["width"]=v("pkW")+"px";
 if(v("pkH"))css["height"]=v("pkH")+"px";
 if(v("pkMinW"))css["min-width"]=v("pkMinW")+"px";
 if(v("pkMaxW"))css["max-width"]=v("pkMaxW")+"px";
 if(v("pkPad"))css["padding"]=v("pkPad");
 if(v("pkFont"))css["font-size"]=v("pkFont")+"px";
 if(v("pkRad"))css["border-radius"]=v("pkRad")+"px";
 return css;
}
document.getElementById("pkPrev").onclick=function(){
 if(!selected)return;
 var css=buildCss();
 for(var p in css)selected.style.setProperty(p,css[p],"important");
 var ih=document.getElementById("pkImgH").value.trim();
 var img=selected.tagName==="IMG"?selected:selected.querySelector("img");
 if(ih&&img)img.style.setProperty("height",ih+"px","important");
 document.getElementById("pkMsg").textContent="👁 Preview applied";
};
document.getElementById("pkSave").onclick=function(){
 if(!selected)return;
 var sel=selectorFor(selected),css=buildCss(),ih=document.getElementById("pkImgH").value.trim();
 var key="ov_"+Date.now();
 var obj={selector:sel,css:css,at:Date.now(),label:(selected.textContent||selected.tagName).trim().slice(0,30)||selected.tagName};
 if(ih)obj.imgCss={height:ih+"px"};
 fetch(DB+"/settings/uiOverrides/"+key+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(obj)})
 .then(function(r){document.getElementById("pkMsg").textContent=r.ok?"✅ Saved!":"❌ failed";});
};
document.getElementById("pkClose").onclick=function(){panel.style.display="none";hl.style.display="none";selected=null;};
})();
