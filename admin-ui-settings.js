// MJH Admin UI Settings Manager v3 (clean + colors + popup)
(function(){
var DB='https://mohajon-mjh-default-rtdb.firebaseio.com';
var COLORS={catBg:1,catTxt:1,prodBg:1,prodTxt:1};
var DEFAULT={catPadV:20,catPadH:26,catFont:16,catMinW:150,catMaxW:220,catRadius:12,catW:0,catH:0,catBg:'',catTxt:'',prodMinW:150,prodMaxW:150,prodImgH:150,prodImgW:0,prodBg:'',prodTxt:'',prodTitleFont:14,prodPriceFont:16,prodPad:10,secFont:24,secMargin:20};

function toast(msg,ok){
 try{
  var t=document.createElement('div');
  t.textContent=msg;
  t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:14px 26px;border-radius:10px;color:#fff;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,.5);background:'+(ok?'#27ae60':'#e74c3c');
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},4000);
 }catch(e){}
}
function fbPut(p,o){
 if(window.MJHFB)return MJHFB.put(p,o);
 return fetch(DB+'/'+p+'.json',{method:'PUT',body:JSON.stringify(o),headers:{'Content-Type':'application/json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();});
}
function fbGet(p){return fetch(DB+'/'+p+'.json').then(function(r){return r.json();});}
function readForm(){
 var c={};
 for(var k in DEFAULT){
  var el=document.getElementById(k);
  if(!el){c[k]=DEFAULT[k];continue;}
  c[k]=COLORS[k]?el.value.trim():(el.value===''?0:+el.value);
 }
 return c;
}
function fillForm(c){for(var k in DEFAULT){var el=document.getElementById(k);if(el&&c[k]!==undefined)el.value=c[k];}}
function loadHistory(){
 fbGet('settings/uiHistory').then(function(h){
  var el=document.getElementById('uiHistory');if(!el)return;
  if(!h||!Object.keys(h).length){el.innerHTML='<p style="color:#888">কোনো history নেই</p>';return;}
  var arr=Object.keys(h).map(function(k){return h[k];}).sort(function(a,b){return (b.at||0)-(a.at||0);}).slice(0,5);
  el.innerHTML=arr.map(function(v){return '<div style="padding:6px;border-bottom:1px solid #ddd;color:#333"><b>'+new Date(v.at).toLocaleString()+'</b>: '+(v.desc||'UI updated')+'</div>';}).join('');
 }).catch(function(){});
}
function loadSettings(){fbGet('settings/uiConfig').then(function(c){if(c)fillForm(c);loadHistory();}).catch(function(){});}
function saveSettings(){
 var c=readForm();
 fbGet('settings/uiConfig').then(function(old){fbPut('settings/uiHistory/'+Date.now(),{at:Date.now(),desc:'UI updated',config:old||DEFAULT});}).catch(function(){});
 fbPut('settings/uiConfig',c).then(function(){toast('✅ Settings saved to Firebase!',true);loadHistory();}).catch(function(e){toast('❌ Save failed: '+(e.message||e),false);});
}
function resetSettings(){
 if(!confirm('সব settings default এ ফিরিয়ে আনবেন?'))return;
 fbPut('settings/uiConfig',DEFAULT).then(function(){toast('✅ Reset to default!',true);fillForm(DEFAULT);}).catch(function(e){toast('❌ '+(e.message||e),false);});
}
function undoLastChange(){
 fbGet('settings/uiHistory').then(function(h){
  if(!h||!Object.keys(h).length){toast('❌ কোনো history নেই',false);return;}
  var arr=Object.keys(h).map(function(k){return h[k];}).sort(function(a,b){return (b.at||0)-(a.at||0);});
  var last=arr[0];
  if(!confirm('Undo করবেন?\n'+new Date(last.at).toLocaleString()))return;
  fbPut('settings/uiConfig',last.config).then(function(){toast('✅ Undo successful!',true);fillForm(last.config);}).catch(function(e){toast('❌ '+(e.message||e),false);});
 });
}
window.mjhUISave=saveSettings;
window.mjhUIReset=resetSettings;
window.mjhUIUndo=undoLastChange;
function bind(){
 var sv=document.getElementById('saveUI');if(sv)sv.onclick=saveSettings;
 var rs=document.getElementById('resetUI');if(rs)rs.onclick=resetSettings;
 var un=document.getElementById('undoUI');if(un)un.onclick=undoLastChange;
 loadSettings();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else setTimeout(bind,300);
setTimeout(bind,1200);
})();
