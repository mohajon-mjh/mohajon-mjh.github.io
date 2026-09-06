// MJH Admin UI Settings Manager
(function(){
const DB='https://mohajon-mjh-default-rtdb.firebaseio.com';
function fbPut(p,o){return window.MJHFB?MJHFB.put(p,o):fetch(DB+'/'+p+'.json',{method:'PUT',body:JSON.stringify(o),headers:{'Content-Type':'application/json'}});}
const DEFAULT={catPadV:20,catPadH:26,catFont:16,catMinW:150,catMaxW:220,catRadius:12,catW:0,catH:0,prodMinW:150,prodMaxW:150,prodImgH:150,prodImgW:0,prodTitleFont:14,prodPriceFont:16,prodPad:10,secFont:24,secMargin:20};

function showStatus(msg,color){
  var s=document.getElementById('uiStatus');
  if(s){s.textContent=msg;s.style.display='block';s.style.background=color==='success'?'#27ae60':color==='error'?'#e74c3c':'#3498db';s.style.color='#fff';setTimeout(function(){s.style.display='none';},4000);}
  var t=document.createElement('div');
  t.textContent=msg;
  t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:99999;padding:14px 24px;border-radius:10px;color:#fff;font-weight:800;box-shadow:0 4px 14px rgba(0,0,0,.4);background:'+(color==='success'?'#27ae60':color==='error'?'#e74c3c':'#3498db');
  document.body.appendChild(t);
  setTimeout(function(){t.remove();},4000);
}

function loadHistory(){
  fetch(`${DB}/settings/uiHistory.json`).then(r=>r.json()).then(h=>{
    const el=document.getElementById('uiHistory');
    if(!el)return;
    if(!h||!Object.keys(h).length){el.innerHTML='<p>কোনো history নেই</p>';return;}
    const arr=Object.entries(h).sort((a,b)=>b[1].at-a[1].at).slice(0,5);
    el.innerHTML=arr.map(([k,v])=>`<div style="padding:6px;border-bottom:1px solid #ddd"><b>${new Date(v.at).toLocaleString()}</b>: ${v.desc||'UI updated'}</div>`).join('');
  });
}

function loadSettings(){
  fetch(`${DB}/settings/uiConfig.json`).then(r=>r.json()).then(cfg=>{
    const c=cfg||DEFAULT;
    for(const k in c){
      const el=document.getElementById(k);
      if(el)el.value=c[k];
    }
    loadHistory();
  });
}

function saveSettings(desc='UI updated'){
  const c={};
  for(const k in DEFAULT){
    const el=document.getElementById(k);
    c[k]=el?+el.value:DEFAULT[k];
  }
  
  // Backup current state before save
  fetch(`${DB}/settings/uiConfig.json`).then(r=>r.json()).then(old=>{
    const histKey=Date.now();
    const hist={at:Date.now(),desc:desc,config:old||DEFAULT};
    fbPut(`settings/uiHistory/${histKey}`,hist);
  });
  
  fbPut('settings/uiConfig',c)
    .then(function(){showStatus('✅ Settings saved to Firebase!','success');loadHistory();})
    .catch(e=>showStatus('❌ Error: '+e.message,'error'));
}

function resetSettings(){
  if(!confirm('সব settings default এ ফিরিয়ে আনবেন?'))return;
  fbPut('settings/uiConfig',DEFAULT)
    .then(function(){showStatus('✅ Reset to default!','success');loadSettings();});
}

function undoLastChange(){
  fetch(`${DB}/settings/uiHistory.json`).then(r=>r.json()).then(h=>{
    if(!h||!Object.keys(h).length){showStatus('❌ কোনো history নেই','error');return;}
    const arr=Object.entries(h).sort((a,b)=>b[1].at-a[1].at);
    const last=arr[0][1];
    if(!confirm(`Undo করতে চান?\nTime: ${new Date(last.at).toLocaleString()}\nDesc: ${last.desc}`))return;
    
    fbPut('settings/uiConfig',last.config)
      .then(function(){showStatus('✅ Undo successful!','success');loadSettings();});
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  const save=document.getElementById('saveUI');
  const reset=document.getElementById('resetUI');
  const undo=document.getElementById('undoUI');
  if(save)save.onclick=()=>saveSettings();
  if(reset)reset.onclick=resetSettings;
  if(undo)undo.onclick=undoLastChange;
  loadSettings();
});
/*__uiBinder*/
setTimeout(function(){
  var sv=document.getElementById('saveUI');if(sv)sv.onclick=function(){saveSettings();};
  var rs=document.getElementById('resetUI');if(rs)rs.onclick=resetSettings;
  var un=document.getElementById('undoUI');if(un)un.onclick=undoLastChange;
},800);
})();
