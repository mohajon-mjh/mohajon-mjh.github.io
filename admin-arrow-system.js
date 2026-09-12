/* Arrow System admin v3.7 — FULL manual control: add/edit/delete/delete-all, gate info */
(async function(){
  var VER='3.7';
  function setBadge(txt,bg){var b=document.getElementById('asBadge');if(!b){b=document.createElement('div');b.id='asBadge';b.style.cssText='position:fixed;bottom:8px;right:8px;z-index:99998;background:#27ae60;color:#fff;font-size:11px;padding:4px 8px;border-radius:6px;font-family:sans-serif;opacity:.9';document.body.appendChild(b);}b.textContent=txt;b.style.background=bg||'#27ae60';}
  setBadge('➡️ AS v'+VER);

  var FB='arrowSystem';
  var EMO=['➡️','⬅️','⬆️','⬇️','▶️','◀️','🔺','','👉','','👆','👇','⏩','⏪','🔼','','↪️','️','➤','➔','>','»','«','—','★','✓','⚡','🔥','⭐','✨','✅','❗','🎯','📌','','🛒','️','💎'];
  var GROUP_DEFS=[
    ['megaCategories','🎁 Mega Offers'],['flashSaleCategories','⚡ Flash Sale'],
    ['globalCategories','🌍 Global Categories'],['dealsOfDayCategories','🏷️ Deals of the Day'],
    ['everydayLowPriceCategories','💸 Everyday Low Price'],['clearanceOutletCategories','📦 Clearance Outlet'],
    ['comboOffersCategories','🧩 Combo Offers'],['specialCategories','⭐ Special Categories']
  ];
  var MENU_CATS=[
    ['agriculture_food_beverage','Agriculture, Food & Beverage'],['appliances_home_appliances_large_small','Appliances (Home, Large & Small)'],
    ['art_collectibles_crafts','Art, Collectibles & Crafts'],['automotive_vehicle_parts_accessories','Automotive, Vehicle Parts'],
    ['baby_products_baby_essentials','Baby Products & Essentials'],['beauty_personal_care','Beauty & Personal Care'],
    ['books_media_music','Books, Media & Music'],['business_industrial_machinery','Business & Industrial'],
    ['cameras_photo','Cameras & Photo'],['clothing_fashion_apparel_men_women_kids','Clothing & Fashion'],
    ['computers_tablets_networking','Computers, Tablets & Networking'],['construction_building_materials','Construction & Building'],
    ['consumer_electronics','Consumer Electronics'],['electrical_equipment_supplies','Electrical Equipment'],
    ['electronics_tv_audio_gaming','Electronics (TV, Audio, Gaming)'],['food_grocery','Food & Grocery'],
    ['furniture_home_decor','Furniture & Home Decor'],['gardening_outdoor_living','Gardening & Outdoor'],
    ['gifts_crafts','Gifts & Crafts'],['health_medical_supplies','Health & Medical'],
    ['health_wellness','Health & Wellness'],['home_kitchen','Home & Kitchen'],
    ['home_improvement_tools_hardware','Home Improvement & Tools'],['industrial_machinery_equipment','Industrial Machinery'],
    ['jewelry_eyewear_watches','Jewelry, Eyewear & Watches'],['lighting_lamps','Lighting & Lamps'],
    ['luggage_bags_cases','Luggage, Bags & Cases'],['office_school_supplies','Office & School Supplies'],
    ['pet_supplies','Pet Supplies'],['renewable_energy','Renewable Energy'],
    ['safety_security','Safety & Security'],['shoes_accessories','Shoes & Accessories'],
    ['smart_home_surveillance','Smart Home & Surveillance'],['sports_outdoors_fitness','Sports & Fitness'],
    ['toys_games_hobbies','Toys, Games & Hobbies'],['video_games_consoles','Video Games & Consoles'],
    ['vehicles_transportation','Vehicles & Transportation'],['air_conditioners_refrigerators_washing_machines','AC, Fridge, Washing Machine'],
    ['mobile_phones_accessories','Mobile Phones & Accessories'],['laptops_pcs','Laptops & PCs'],
    ['headphones_speakers_audio','Headphones, Speakers & Audio'],['makeup_skincare_fragrance','Makeup, Skincare & Fragrance'],
    ['furniture_sofas_beds_etc','Furniture (Sofas, Beds)'],['power_tools_hand_tools','Power Tools & Hand Tools'],
    ['drones_action_cameras','Drones & Action Cameras'],['bicycles_scooters_electric_vehicles','Bicycles, Scooters & EV']
  ];
  var CATNAMES={'all':'সব ক্যাটাগরি (all)'};
  var CATSOURCE={'all':'home'};
  var HOME_GROUPS=[];
  var cfg={enabled:true,markers:[]}, editingId=null, picker=null, scopeModal=null, db=null, fbD=null, auth=null;

  async function loadSettings(){
    HOME_GROUPS=[];
    var s=null;
    try{ var r1=await fetch('https://mohajon-mjh-default-rtdb.firebaseio.com/settings.json'); if(r1.ok) s=await r1.json(); }catch(e){}
    if(!s || !s.globalCategories){ try{ var r2=await fetch('/data/settings.json?ts='+Date.now(),{cache:'no-store'}); s=await r2.json(); }catch(e){} }
    if(s){
      GROUP_DEFS.forEach(function(g){
        var src=s[g[0]];
        if(g[0]==='megaCategories' && (!src || Object.keys(src).length<4) && s.customSections && s.customSections.mega && s.customSections.mega.cats){ src=s.customSections.mega.cats; }
        if(!src)return;
        var items=Object.keys(src).map(function(id){
          CATNAMES[id]=(src[id]&&src[id].name)||id; CATSOURCE[id]='home';
          return {id:id,name:(src[id]&&src[id].name)||id,order:(src[id]&&src[id].order)||99};
        }).sort(function(a,b){return a.order-b.order});
        if(items.length)HOME_GROUPS.push({title:g[1],items:items});
      });
    }
    MENU_CATS.forEach(function(m){ if(!CATNAMES[m[0]])CATNAMES[m[0]]=m[1]; if(!CATSOURCE[m[0]])CATSOURCE[m[0]]='menu'; });
    setBadge('➡️ AS v'+VER+' | Cats: '+(Object.keys(CATNAMES).length-1));
  }
  function previewURL(id){ return (CATSOURCE[id]==='menu') ? ('/category.html?id='+id) : '/index.html'; }
  function catLabel(id){ return CATNAMES[id]||id; }

  function checkAuth(){ if(!auth)return false; return !!auth.currentUser; }
  function normCfg(v){
    if(!v) return {enabled:true,markers:[]};
    var m=v.markers;
    if(m && !Array.isArray(m)){ m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]}); }
    return {enabled:v.enabled!==false,markers:Array.isArray(m)?m:[]};
  }
  function prepCfg(v){ var o={enabled:v.enabled!==false,markers:{}}; (v.markers||[]).forEach(function(m,i){o.markers[i]=m}); return o; }
  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var a=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; auth=a.getAuth(app); return true; }catch(e){setBadge('AS: Init Fail','#e74c3c');return false} }
  function load(cb){ initFB().then(function(ok){ if(!ok){setTimeout(function(){load(cb)},3000);return}
    fbD.get(fbD.ref(db,'settings/'+FB)).then(function(s){ cfg=normCfg(s.exists()?s.val():null); cb&&cb(); }).catch(function(){ fbD.get(fbD.ref(db,FB)).then(function(s2){ cfg=normCfg(s2.exists()?s2.val():null); cb&&cb(); }).catch(function(){ cb&&cb(); }); }); }); }
  async function save(msg){ if(!checkAuth()){ alert('⚠️ Permission Denied!\nলগইন করুন।'); setBadge('AS: Not Logged In','#e74c3c'); return; }
    initFB().then(function(ok){ if(!ok){alert('Firebase ready নয়');return}
      fbD.set(fbD.ref(db,'settings/'+FB),prepCfg(cfg)).then(function(){ toast(msg||'Saved ✅'); renderList(); setBadge('➡️ AS Saved','#27ae60'); }).catch(function(e){ alert('Save failed: '+(e.message||e)); setBadge('AS: Save Error','#e74c3c'); }); }); }
  function uid(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function toast(t){var d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:600';document.body.appendChild(d);setTimeout(function(){d.remove()},2500)}

  function closeScope(){ if(scopeModal){scopeModal.remove();scopeModal=null;} }
  function scopeItemBtn(it,hidden,btn){
    var b=document.createElement('button');b.type='button';b.textContent=it.name;
    b.style.cssText='display:block;width:100%;text-align:left;background:#f5f5f5;color:#222;border:0;border-radius:6px;padding:6px 8px;margin:3px 0;cursor:pointer;font-size:12px;font-weight:600';
    b.onclick=function(){hidden.value=it.id;btn.textContent=it.name;closeScope();onScopeChange();};
    return b;
  }
  function openScopePicker(hidden,btn){
    closeScope();
    scopeModal=document.createElement('div');
    scopeModal.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:10px';
    var box=document.createElement('div');
    box.style.cssText='background:#fff;color:#222;border-radius:12px;width:100%;max-width:680px;max-height:82vh;display:flex;flex-direction:column;overflow:hidden';
    box.innerHTML='<div style="padding:10px 14px;background:#3498db;color:#fff;display:flex;justify-content:space-between;align-items:center"><b>📂 Category Select (২ ভাগ)</b><button id="asScopeClose" style="background:#e74c3c;color:#fff;border:0;border-radius:4px;padding:4px 8px;cursor:pointer">✕</button></div>'+
      '<div style="padding:8px 14px 0"><button id="asScopeAll" style="background:#27ae60;color:#fff;border:0;border-radius:6px;padding:8px 12px;cursor:pointer;font-weight:600">সব ক্যাটাগরি (all)</button></div>'+
      '<div style="display:flex;gap:10px;padding:10px 14px 14px;overflow:auto;flex:1">'+
      '<div style="flex:1;min-width:160px;border-right:2px solid #eee;padding-right:8px"><b style="font-size:12px;color:#3498db">🏠 হোম পেজ ক্যাটাগরি</b><div id="asScopeLeft"></div></div>'+
      '<div style="flex:1;min-width:160px"><b style="font-size:12px;color:#e67e22">☰ Menu / All Category</b><div id="asScopeRight"></div></div>'+
      '</div>';
    scopeModal.appendChild(box);
    document.body.appendChild(scopeModal);
    var L=box.querySelector('#asScopeLeft'), R=box.querySelector('#asScopeRight');
    HOME_GROUPS.forEach(function(g){
      var h=document.createElement('div');h.textContent=g.title;h.style.cssText='font-weight:700;font-size:11px;margin:8px 0 2px;color:#555';L.appendChild(h);
      g.items.forEach(function(it){L.appendChild(scopeItemBtn(it,hidden,btn))});
    });
    MENU_CATS.forEach(function(m){R.appendChild(scopeItemBtn({id:m[0],name:m[1]},hidden,btn))});
    box.querySelector('#asScopeClose').onclick=closeScope;
    box.querySelector('#asScopeAll').onclick=function(){hidden.value='all';btn.textContent='সব ক্যাটাগরি (all)';closeScope();onScopeChange();};
    scopeModal.addEventListener('click',function(e){if(e.target===scopeModal)closeScope()});
  }

  function openPicker(btn,hidden){
    closePicker();
    picker=document.createElement('div');
    picker.style.cssText='position:fixed;z-index:99999;background:#fff;color:#222;border:1px solid #ccc;border-radius:10px;padding:10px;display:grid;grid-template-columns:repeat(8,38px);gap:4px;max-height:300px;overflow:auto;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 8px 30px rgba(0,0,0,.35)';
    picker.innerHTML='<div style="grid-column:1/-1;text-align:right;margin-bottom:6px"><button id="asPickerClose" style="background:#e74c3c;color:#fff;border:0;border-radius:4px;padding:4px 8px;cursor:pointer">✕ Close</button></div>';
    EMO.forEach(function(e){var b=document.createElement('button');b.type='button';b.textContent=e;b.style.cssText='font-size:22px;border:0;background:#f5f5f5;color:#222;border-radius:6px;padding:4px;cursor:pointer';b.onclick=function(){hidden.value=e;btn.textContent=e;closePicker()};picker.appendChild(b)});
    var ci=document.createElement('input');ci.placeholder='custom (যেমন > বা ★)';ci.style.cssText='grid-column:1/-1;padding:6px;margin-top:6px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff';
    var sb=document.createElement('button');sb.type='button';sb.textContent='Set custom';sb.style.cssText='grid-column:1/-1;background:#3498db;color:#fff;border:0;border-radius:6px;padding:8px;margin-top:4px;cursor:pointer;font-weight:600';
    sb.onclick=function(){if(ci.value){hidden.value=ci.value;btn.textContent=ci.value;closePicker()}};
    picker.appendChild(ci);picker.appendChild(sb);
    document.body.appendChild(picker);
    picker.addEventListener('click', function(e){e.stopPropagation()});
    setTimeout(function(){document.body.addEventListener('click', closePicker)},100);
    document.getElementById('asPickerClose').onclick=closePicker;
  }
  function closePicker(){if(picker){document.body.removeEventListener('click', closePicker);picker.remove();picker=null;}}

  function renderList(){
    var box=document.getElementById('asList'); if(!box)return; box.innerHTML='';
    if(!(cfg.markers||[]).length){ box.innerHTML='<p style="color:#888;font-size:13px;margin:6px 0">কোনো marker নেই — ➕ Add Marker চাপো</p>'; return; }
    cfg.markers.forEach(function(m,i){
      var d=document.createElement('div');
      d.style.cssText='display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid '+(editingId===m.id?'#3498db':'#ddd')+';border-radius:8px;padding:8px 10px;margin:6px 0;background:'+(editingId===m.id?'#eaf4fd':'#fafafa');
      var wDisp=(m.width===0||!m.width)?'auto':m.width;
      var srcTag=(CATSOURCE[m.scope]==='menu')?'☰':'🏠';
      var viewLink = m.scope && m.scope !== 'all' ? '<a href="'+previewURL(m.scope)+'" target="_blank" style="font-size:11px;color:#3498db;text-decoration:none;border:1px solid #3498db;padding:2px 6px;border-radius:4px;">👁️</a>' : '';
      d.innerHTML='<b style="min-width:24px;color:#222">#'+(i+1)+'</b>'+
        '<span style="font-size:22px">'+(m.emoji||'➡️')+'</span>'+
        '<span style="font-size:12px;color:#222">'+srcTag+' <b>'+catLabel(m.scope||'all')+'</b> '+viewLink+'</span>'+
        '<span style="font-size:12px;color:#222">পণ্য <b>'+(m.position||1)+'</b> এর পরে</span>'+
        '<span style="font-size:11px;color:#666">H:'+(m.height||28)+' W:'+wDisp+'</span>'+
        '<span style="flex:1"></span>'+
        '<button class="e" style="background:#3498db;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer">✏️ Edit</button>'+
        '<button class="x" style="background:#e74c3c;color:#fff;border:0;border-radius:6px;padding:6px 10px;cursor:pointer;font-weight:700">🗑️ Delete</button>';
      d.querySelector('.e').onclick=function(){ startEdit(m); };
      d.querySelector('.x').onclick=function(){ if(confirm('Marker #'+(i+1)+' ('+catLabel(m.scope||'all')+' / পণ্য '+(m.position||1)+' এর পরে) DELETE করবে?')){ cfg.markers.splice(i,1); save('Marker deleted 🗑️'); } };
      box.appendChild(d);
    });
  }

  function formVals(){ return {scope: document.getElementById('asScope').value||'all', position: parseInt(document.getElementById('asPos').value||'1',10), emoji: document.getElementById('asEmoji').value||'➡️', height: parseInt(document.getElementById('asH').value||'28',10), width: parseInt(document.getElementById('asW').value||'0',10) }; }
  function resetForm(m){ m=m||{scope:'all',position:1,emoji:'➡️',height:28,width:0};
    document.getElementById('asScope').value=m.scope||'all';
    document.getElementById('asScopeBtn').textContent=catLabel(m.scope||'all');
    document.getElementById('asPos').value=m.position||1;
    document.getElementById('asEmoji').value=m.emoji||'➡️';
    document.getElementById('asEmojiBtn').textContent=m.emoji||'➡️';
    document.getElementById('asH').value=m.height||28;
    document.getElementById('asW').value=m.width||0; onScopeChange(); }
  function showForm(on){ document.getElementById('asForm').style.display=on?'block':'none'; }
  function startEdit(m){ editingId=m.id; resetForm(m); showForm(true); renderList();
    document.getElementById('asFormTitle').textContent='✏️ Marker Edit করো'; document.getElementById('asForm').scrollIntoView({behavior:'smooth',block:'center'}); }
  function onScopeChange(){
    var v=document.getElementById('asScope').value;
    var pb=document.getElementById('asPreviewBtn');
    pb.style.display=(v&&v!=='all')?'inline-block':'none';
    pb.textContent=(CATSOURCE[v]==='menu')?'👁️ Preview (Menu)':'👁️ Preview (Home)';
  }

  function buildCard(){
    var c=document.createElement('div'); c.id='arrowSystemCard';
    c.style.cssText='background:#fff;border-radius:12px;padding:16px;margin:16px 0;color:#222;box-shadow:0 2px 8px rgba(0,0,0,.08)';
    c.innerHTML='<h3 style="margin:0 0 6px;color:#222">➡️ Arrow System (Manual Control)</h3>'+
      '<p style="margin:0 0 10px;font-size:13px;color:#666">সাইটে: emoji পর্যন্ত পণ্য দেখাবে → emoji তে ক্লিক করলে পরের পণ্যগুলো দেখাবে। সব add/edit/delete শুধু এখান থেকে।</p>'+
      '<label style="font-size:14px;display:flex;align-items:center;gap:6px;color:#222"><input type="checkbox" id="asEnabled" style="width:18px;height:18px"> <b>System ON/OFF</b></label>'+
      '<div id="asList" style="margin-top:10px"></div>'+
      '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">'+
      '<button id="asAdd" style="background:#f39c12;color:#fff;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:600">➕ Add Marker</button>'+
      '<button id="asPreviewBtn" style="background:#3498db;color:#fff;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:600;display:none">👁️ Preview</button>'+
      '<button id="asDelAll" style="background:#c0392b;color:#fff;border:0;border-radius:8px;padding:10px 14px;cursor:pointer;font-weight:600">🗑️ Delete All</button>'+
      '</div>'+
      '<div id="asForm" style="display:none;margin-top:12px;border:2px solid #3498db;border-radius:10px;padding:12px;background:#f4f9ff">'+
      '<b id="asFormTitle" style="display:block;margin-bottom:8px;color:#222">➕ নতুন Marker</b>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">'+
      '<label style="color:#222">Scope (click করে বাছো)<button type="button" id="asScopeBtn" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;background:#fff;color:#222;cursor:pointer;text-align:left;font-weight:600">সব ক্যাটাগরি (all)</button><input id="asScope" type="hidden" value="all"></label>'+
      '<label style="color:#222">Position (কততম পণ্যের পরে)<input id="asPos" type="number" min="1" value="1" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff"></label>'+
      '<label style="color:#222">Emoji (click করো)<button type="button" id="asEmojiBtn" style="width:100%;padding:8px;font-size:22px;border:1px solid #ccc;border-radius:6px;background:#fff;color:#222;cursor:pointer">➡️</button><input id="asEmoji" type="hidden" value="➡️"></label>'+
      '<label style="color:#222">Height (px)<input id="asH" type="number" value="28" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff"></label>'+
      '<label style="grid-column:1/-1;color:#222">Width (px, 0 = auto)<input id="asW" type="number" value="0" style="width:100%;padding:7px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff"></label>'+
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
    document.getElementById('asScopeBtn').onclick=function(){ openScopePicker(document.getElementById('asScope'), this); };
    document.getElementById('asPreviewBtn').onclick=function(){ var v=document.getElementById('asScope').value; if(v&&v!=='all')window.open(previewURL(v),'_blank'); };
    document.getElementById('asDelAll').onclick=function(){ if(confirm('সব marker DELETE করবে?')){ cfg.markers=[]; save('সব marker deleted 🗑️'); } };
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

  async function mount(){
    if(document.getElementById('arrowSystemCard'))return;
    var host=document.getElementById('tab-uisettings');
    if(!host){
      var leaf=null,all=document.querySelectorAll('*');
      for(var i=0;i<all.length;i++){var e=all[i];if(e.childElementCount===0&&/UI Settings Panel/i.test(e.textContent||'')){leaf=e;break}}
      if(!leaf){setTimeout(mount,1000);return}
      host=(leaf.closest&&leaf.closest('section.tab-section, section'))||leaf.parentElement.parentElement||document.body;
    }
    host.appendChild(buildCard());
    await loadSettings();
    wire();
    renderList();
  }

  var t=setInterval(function(){
    if(document.getElementById('tab-uisettings')){
      clearInterval(t);
      mount();
      load(function(){
        var en=document.getElementById('asEnabled'); if(en)en.checked=cfg.enabled!==false;
        renderList();
      });
    }
  },600);
})();
