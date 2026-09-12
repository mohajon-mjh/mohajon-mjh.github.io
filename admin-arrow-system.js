/* Arrow System v2.1 — FULL MANUAL CONTROL (mount fix: card goes inside UI Settings section) */
(async function(){
  var FB='arrowSystem';
  var EMO=['➡️','⬅️','️','⬇️','▶️','◀️','🔺','🔻','','👈','','👇','','⏪','','🔽','️','↩️','','➔','>','»','«','—','★','✓','⚡','🔥','⭐','✨','✅','❗','🎯','📌','💰','🛒','️','💎'];
  var CATS=['all','agric','auto','beauty','books','computers','food','gift','grocery','handi','health','home','kids','men','mobile','pets','spices','sports','toys','travel','tv','watches','women'];
  var cfg={enabled:true,markers:[]}, editingId=null, picker=null, db=null, fbD=null;

  function normCfg(v){
    if(!v) return {enabled:true,markers:[]};
    var m=v.markers;
    if(m && !Array.isArray(m)){
      m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]});
    }
    return {enabled:v.enabled!==false,markers:Array.isArray(m)?m:[]};
  }
  function prepCfg(v){
    var o={enabled:v.enabled!==false,markers:{}};
    (v.markers||[]).forEach(function(m,i){o.markers[i]=m});
    return o;
  }

  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; return true; }catch(e){console.error('[ArrowAdmin] FB init fail',e);return false} }
  function load(cb){ initFB().then(function(ok){ if(!ok){setTimeout(function(){load(cb)},1500);return}
    fbD.get(fbD.ref(db,FB)).then(function(s){ cfg=normCfg(s.val()); cb&&cb(); }); }); }
  function save(msg){ initFB().then(function(ok){ if(!ok)return alert('Firebase ready নয়');
    fbD.set(fbD.ref(db,FB),prepCfg(cfg)).then(function(){ toast(msg||'Saved ✅'); renderList(); }); }); }
  function uid(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function toast(t){var d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:600';document.body.appendChild(d);setTimeout(function(){d.remove()},2500)}

  function openPicker(btn,hidden){
    closePicker();
    picker=document.createElement('div');
    picker.style.cssText='position:fixed;z-index:99999;background:#fff;border:1px solid #ccc;border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(8,38px);gap:4px;max-height:300px;overflow:auto;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 8px 30px rgba(0,0,0,.35)';
    EMO.forEach(function(e){var b=document.createElement('button');b.type='button';b.textContent=e;b.style.cssText='font-size:22px;border:0;background:#f5f5f5;border-radius:6px;padding:4px;cursor:pointer';b.onclick=function(){hidden.value=e;btn.textContent=e;closePicker()};picker.appendChild(b)});
    var ci=document.createElement('input');ci.placeholder='custom (যেমন > বা ★)';ci.style.cssText='grid-column:1/-1;padding:6px;margin-top:6px;border:1px solid #ccc;border-radius:6px';
    var sb=document.createElement('button');sb.type='button';sb.textContent='Set custom';sb.style.cssText='grid-column:1/-1;background:#3498db;color:#fff;border:0;border-radius:6px;padding:8px;margin-top:4px;cursor:pointer;font-weight:600';
    sb.onclick=function(){if(ci.value){hidden.value=ci.value;btn.textContent=ci.value;closePicker()}};
    picker.appendChild(ci);picker.appendChild(sb);
    document.body.appendChild(picker);
  }
  function closePicker(){if(picker){picker.remove();picker=null}}

  function renderList(){
    var box=document.getElementById('asList'); if(!box)return; box.innerHTML='';
    if(!(cfg.markers||[]).length){ box.innerHTML='<p style="color:#888;font-size:13px;margin:6px 0">কোনো marker নেই — ➕ Add Marker চাপো</p>'; return; }
    cfg.markers.forEach(function(m,i){
      var d=document.createElement('div');
      d.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap;border:1px solid '+(editingId===m.id?'#3498db':'#ddd')+';border-radius:8px;padding:8px 10px;margin:6px 0;background:'+(editingId===m.id?'#eaf4fd':'#fafafa');
      var wDisp=(m.width===0||!m.width)?'full':m.width;
      d.innerHTML='<b style="min-width:26px">#'+(i+1)+'</b>'+
        '<span style="font-size:13px">Scope: <b>'+(m.scope||'all')+'</b></span>'+
        '<span style="font-size:13px">পণ্য <b>'+(m.position||1)+'</b> এর পরে</span>'+
        '<span style="font-size:24px">'+(m.emoji||'➡️')+'</span>'+
        '<span style="font-size:12px;color:#666">H:'+(m.height||28)+' W:'+wDisp+'</span>'+
        '<span style="flex:1"></span>'+
        '<button class="e" style="background:#3498db;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer">✏️ Edit</button>'+
        '<button class="x" style="background:#e74c3c;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer">🗑️ Delete</button>';
      d.querySelector('.e').onclick=function(){ startEdit(m); };
      d.querySelector('.x').onclick=function(){ if(confirm('Marker #'+(i+1)+' delete করবে?')){ cfg.markers.splice(i,1); save('Marker deleted 🗑️'); } };
      box.appendChild(d);
    });
  }

  function formVals(){ return {
    scope: document.getElementById('asScope').value||'all',
    position: parseInt(document.getElementById('asPos').value||'1',10),
    emoji: document.getElementById('asEmoji').value||'➡️',
    height: parseInt(document.getElementById('asH').value||'28',10),
    width: parseInt(document.getElementById('asW').value||'0',10) }; }
  function resetForm(m){ m=m||{scope:'all',position:1,emoji:'➡️',height:28,width:0};
    document.getElementById('asScope').value=m.scope||'all';
    document.getElementById('asPos').value=m.position||1;
    document.getElementById('asEmoji').value=m.emoji||'➡️';
    document.getElementById('asEmojiBtn').textContent=m.emoji||'➡️';
    document.getElementById('asH').value=m.height||28;
    document.getElementById('asW').value=m.width||0; }
  function showForm(on){ document.getElementById('asForm').style.display=on?'block':'none'; }
  function startEdit(m){ editingId=m.id; resetForm(m); showForm(true); renderList();
    document.getElementById('asFormTitle').textContent='✏️ Marker Edit করো'; document.getElementById('asForm').scrollIntoView({behavior:'smooth',block:'center'}); }

  function buildCard(){
    var c=document.createElement('div'); c.id='arrowSystemCard';
    c.style.cssText='background:#fff;border-radius:12px;padding:16px;margin:16px 0;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.08)';
    c.innerHTML='<h3 style="margin:0 0 6px">➡️ Arrow System (Manual Control)</h3>'+
      '<p style="margin:0 0 10px;font-size:13px;color:#666">সব কিছু তুমি নিজে control করবে: add / edit / save / delete। Site এ page refresh করলে দেখাবে।</p>'+
      '<label style="font-size:14px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="asEnabled" style="width:18px;height:18px"> <b>System ON/OFF</b></label>'+
      '<div id="asList" style="margin-top:10px"></div>'+
      '<div style="margin-top:8px"><button id="asAdd" style="background:#f39c12;color:#fff;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:600">➕ Add Marker</button></div>'+
      '<div id="asForm" style="display:none;margin-top:12px;border:2px solid #3498db;border-radius:10px;padding:12px;background:#f4f9ff">'+
      '<b id="asFormTitle" style="display:block;margin-bottom:8px">➕ নতুন Marker</b>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">'+
      '<label>Scope<select id="asScope" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px">'+CATS.map(function(x){return '<option value="'+x+'">'+(x==='all'?'সব ক্যাটাগরি (all)':x)+'</option>'}).join('')+'</select></label>'+
      '<label>Position (কততম পণ্যের পরে)<input id="asPos" type="number" min="1" value="1" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px"></label>'+
      '<label>Emoji (click করো)<button type="button" id="asEmojiBtn" style="width:100%;padding:8px;font-size:22px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer">➡️</button><input id="asEmoji" type="hidden" value="➡️"></label>'+
      '<label>Height (px)<input id="asH" type="number" value="28" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px"></label>'+
      '<label style="grid-column:1/-1">Width (px, 0 = full width)<input id="asW" type="number" value="0" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px"></label>'+
      '</div>'+
      '<div style="margin-top:10px;display:flex;gap:8px">'+
      '<button id="asSaveM" style="background:#27ae60;color:#fff;border:0;border-radius:8px;padding:9px 14px;cursor:pointer;font-weight:600">💾 Save Marker</button>'+
      '<button id="asCancel" style="background:#95a5a6;color:#fff;border:0;border-radius:8px;padding:9px 14px;cursor:pointer">❌ Cancel</button>'+
      '</div></div>';
    return c;
  }
  function wire(){
    document.getElementById('asEnabled').checked = cfg.enabled!==false;
    document.getElementById('asEnabled').onchange=function(){ cfg.enabled=this.checked; save(this.checked?'System ON ✅':'System OFF ⛔'); };
    document.getElementById('asAdd').onclick=function(){ editingId=null; resetForm(); showForm(true); renderList(); document.getElementById('asFormTitle').textContent='➕ নতুন Marker'; };
    document.getElementById('asCancel').onclick=function(){ editingId=null; showForm(false); renderList(); };
    document.getElementById('asEmojiBtn').onclick=function(){ openPicker(document.getElementById('asEmojiBtn'),document.getElementById('asEmoji')); };
    document.getElementById('asSaveM').onclick=function(){
      var v=formVals();
      if(editingId){ var mk=cfg.markers.find(function(x){return x.id===editingId}); if(mk){mk.scope=v.scope;mk.position=v.position;mk.emoji=v.emoji;mk.height=v.height;mk.width=v.width;} }
      else { v.id=uid(); cfg.markers=cfg.markers||[]; cfg.markers.push(v); }
      editingId=null; showForm(false); save('Marker saved ✅');
    };
  }

  function mount(){
    if(document.getElementById('arrowSystemCard'))return;
    var leaf=null,all=document.querySelectorAll('*');
    for(var i=0;i<all.length;i++){var e=all[i];if(e.childElementCount===0&&/UI Settings Panel/i.test(e.textContent||'')){leaf=e;break}}
    if(!leaf){setTimeout(mount,1000);return}
    var card=buildCard();
    // host candidates: section container (header এর parent এর parent) → header এর parent → body
    var hosts=[];
    var p1=leaf.parentElement, p2=p1?p1.parentElement:null;
    if(p2&&p2!==document.body)hosts.push(p2);
    if(p1)hosts.push(p1);
    hosts.push(document.body);
    for(var h=0;h<hosts.length;h++){
      hosts[h].appendChild(card);
      var r=card.getBoundingClientRect();
      if(r.height>0&&r.width>0){ console.log('[ArrowAdmin] mounted ✔'); break; }
      card.remove();
    }
    wire();
    renderList();
  }
  var t=setInterval(function(){ if(/UI Settings Panel/i.test(document.body.textContent||'')){ clearInterval(t); load(mount); } },600);
})();
