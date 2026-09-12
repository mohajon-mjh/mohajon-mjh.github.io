/* Arrow System public v5 — live picker (?aspick=1) + universal containers */
(function(){
  var EMO=['➡️','⬅️','️','⬇️','▶️','◀️','🔺','','👉','','👆','','⏩','','🔼','','↪️','️','➤','➔','>','»','«','—','★','✓','⚡','🔥','⭐','✨','✅','❗','🎯','📌','💰','🛒','🏷️','💎'];
  var cfg=null, db=null, fbD=null, appRef=null, authUser=null, popup=null;
  var pickMode=location.search.indexOf('aspick=1')>-1;
  var pickActive=false;

  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    appRef=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(appRef); fbD=d; return true; }catch(e){return false} }
  async function initAuth(){ if(authUser!==null)return !!authUser; try{
    var a=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js");
    authUser=a.getAuth(appRef).currentUser||false; return !!authUser; }catch(e){authUser=false;return false} }

  function curCat(){try{return new URLSearchParams(location.search).get('id')||''}catch(e){return ''}}
  function scopeForPage(){return curCat()||'all'}
  function uid(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function normCfg(v){ if(!v)return {enabled:true,markers:[]}; var m=v.markers; if(m&&!Array.isArray(m)){m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]});} return {enabled:v.enabled!==false,markers:Array.isArray(m)?m:[]}; }
  function prepCfg(v){ var o={enabled:v.enabled!==false,markers:{}}; (v.markers||[]).forEach(function(m,i){o.markers[i]=m}); return o; }
  function toastMsg(t){var d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:600';document.body.appendChild(d);setTimeout(function(){d.remove()},2500)}

  function markerEl(m,horiz){
    var d=document.createElement('div');d.className='arrow-marker';
    var h=(m.height||28), w=m.width>0?(m.width+'px'):(horiz?'60px':'100%');
    d.style.cssText='display:flex;align-items:center;justify-content:center;line-height:1;font-size:'+(h-4)+'px;border:none;outline:none;box-shadow:none;background:transparent;'+
      (horiz?'align-self:center;flex:0 0 auto;width:'+w+';height:'+h+'px;margin:0 4px;'
             :'width:'+w+';height:'+h+'px;margin:6px 0;');
    d.textContent=m.emoji||'➡️';
    if(pickActive){ d.style.pointerEvents='auto'; d.style.cursor='pointer'; d.style.background='rgba(39,174,96,.12)'; d.style.borderRadius='6px';
      d.onclick=function(e){e.stopPropagation();openEdit(m);}; }
    return d;
  }
  function gapEl(k,horiz){
    var g=document.createElement('div');g.className='arrow-gap';
    g.style.cssText='background:rgba(52,152,219,.15);border:1px dashed #3498db;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#3498db;font-weight:700;font-size:14px;'+
      (horiz?'flex:0 0 auto;align-self:stretch;width:18px;margin:0 2px;'
             :'height:18px;margin:2px 0;');
    g.textContent='+';
    g.onclick=function(){ openNew(k+1); };
    return g;
  }

  function apply(){
    document.querySelectorAll('.arrow-marker,.arrow-gap').forEach(function(e){e.remove()});
    if(!cfg||cfg.enabled===false)return true;
    var cardsAll=[].slice.call(document.querySelectorAll('.product-card'));
    if(!cardsAll.length)return false;
    var parents=[];
    cardsAll.forEach(function(c){ if(c.parentElement&&parents.indexOf(c.parentElement)<0)parents.push(c.parentElement); });
    var c=curCat();
    parents.forEach(function(p){
      var cards=[].filter.call(p.children,function(ch){return ch.classList&&ch.classList.contains('product-card')});
      if(!cards.length)return;
      var cs=getComputedStyle(p);
      var horiz=(cs.flexDirection&&cs.flexDirection.indexOf('row')===0)||(p.scrollWidth>p.clientWidth+10);
      var attr=(p.getAttribute&&p.getAttribute('data-cat'))||'';
      var ms=(cfg.markers||[]).filter(function(m){
        if(!m)return false; var s=m.scope||'all';
        return s==='all'||s===c||(attr&&attr.indexOf(s)>-1)||(p.id&&p.id.indexOf(s)>-1);
      });
      ms.sort(function(a,b){return (a.position||0)-(b.position||0)});
      var anchors={};
      ms.forEach(function(m){
        var pos=parseInt(m.position||0,10); if(pos<1||pos>cards.length)return;
        var n=markerEl(m,horiz);
        if(anchors[pos])anchors[pos].insertAdjacentElement('afterend',n); else cards[pos-1].insertAdjacentElement('afterend',n);
        anchors[pos]=n;
      });
      if(pickActive){
        for(var k=cards.length-1;k>=0;k--){
          var g=gapEl(k,horiz);
          cards[k].insertAdjacentElement('afterend',g);
        }
      }
    });
    return true;
  }

  function closePopup(){if(popup){popup.remove();popup=null}}
  function buildPopup(title,vals,onSave,onDelete){
    closePopup();
    popup=document.createElement('div');
    popup.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px';
    var box=document.createElement('div');
    box.style.cssText='background:#fff;color:#222;border-radius:12px;width:100%;max-width:420px;max-height:85vh;overflow:auto;padding:14px';
    box.innerHTML='<b style="display:block;margin-bottom:8px;color:#222">'+title+'</b>'+
      '<div style="margin-bottom:8px"><span style="font-size:12px;color:#222">Emoji:</span> <button type="button" id="apEmojiBtn" style="font-size:24px;padding:6px 12px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#222;cursor:pointer">'+(vals.emoji||'➡️')+'</button><input id="apEmoji" type="hidden" value="'+(vals.emoji||'➡️')+'"></div>'+
      '<div style="display:flex;gap:8px;margin-bottom:8px">'+
      '<label style="flex:1;font-size:12px;color:#222">Height<input id="apH" type="number" value="'+(vals.height||28)+'" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff"></label>'+
      '<label style="flex:1;font-size:12px;color:#222">Width<input id="apW" type="number" value="'+(vals.width||0)+'" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:6px;color:#222;background:#fff"></label>'+
      '</div>'+
      '<div id="apEmoGrid" style="display:grid;grid-template-columns:repeat(8,34px);gap:4px;margin-bottom:10px"></div>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
      '<button id="apSave" style="background:#27ae60;color:#fff;border:0;border-radius:8px;padding:9px 12px;cursor:pointer;font-weight:600">💾 Save</button>'+
      (onDelete?'<button id="apDel" style="background:#e74c3c;color:#fff;border:0;border-radius:8px;padding:9px 12px;cursor:pointer;font-weight:600">🗑️ Delete</button>':'')+
      '<button id="apCancel" style="background:#95a5a6;color:#fff;border:0;border-radius:8px;padding:9px 12px;cursor:pointer">❌ Cancel</button></div>';
    popup.appendChild(box);
    document.body.appendChild(popup);
    var grid=box.querySelector('#apEmoGrid');
    EMO.forEach(function(e){var b=document.createElement('button');b.type='button';b.textContent=e;b.style.cssText='font-size:20px;border:0;background:#f5f5f5;color:#222;border-radius:6px;padding:3px;cursor:pointer';b.onclick=function(){box.querySelector('#apEmoji').value=e;box.querySelector('#apEmojiBtn').textContent=e;};grid.appendChild(b)});
    box.querySelector('#apSave').onclick=function(){ onSave({emoji:box.querySelector('#apEmoji').value,height:parseInt(box.querySelector('#apH').value||'28',10),width:parseInt(box.querySelector('#apW').value||'0',10)}); closePopup(); };
    if(onDelete) box.querySelector('#apDel').onclick=function(){ onDelete(); closePopup(); };
    box.querySelector('#apCancel').onclick=closePopup;
    popup.addEventListener('click',function(e){if(e.target===popup)closePopup()});
  }
  function saveFB(msg){ fbD.set(fbD.ref(db,'arrowSystem'),prepCfg(cfg)).then(function(){ apply(); toastMsg(msg); }).catch(function(e){ alert('Save fail: '+(e.message||e)); }); }
  function openNew(pos){
    buildPopup('➕ Arrow বসাও: পণ্য '+pos+' এর পরে (scope: '+scopeForPage()+')', {emoji:'➡️',height:28,width:0}, function(v){
      cfg.markers=cfg.markers||[];
      cfg.markers.push({id:uid(),scope:scopeForPage(),position:pos,emoji:v.emoji,height:v.height,width:v.width});
      saveFB('Marker added ✅');
    }, null);
  }
  function openEdit(m){
    buildPopup('✏️ Arrow Edit / Delete', m, function(v){
      m.emoji=v.emoji; m.height=v.height; m.width=v.width; saveFB('Marker updated ✅');
    }, function(){
      cfg.markers=(cfg.markers||[]).filter(function(x){return x.id!==m.id}); saveFB('Marker deleted 🗑️');
    });
  }

  async function startPick(){
    var ok=await initAuth();
    if(!ok){ alert('🎯 Picker ব্যবহার করতে আগে একই browser এ admin login করো।'); return; }
    pickActive=true;
    var bar=document.createElement('div');
    bar.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;background:#8e44ad;color:#fff;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.3);text-align:center';
    bar.innerHTML='🎯 Picker ON — + এ tap = নতুন arrow | arrow এ tap = edit/delete <button id="apExit" style="background:#e74c3c;color:#fff;border:0;border-radius:6px;padding:4px 8px;cursor:pointer;margin-left:8px">❌ Exit</button>';
    document.body.appendChild(bar);
    bar.querySelector('#apExit').onclick=function(){ var q=location.search.replace(/[?&]aspick=1/,''); if(q.indexOf('?')===-1)q=q.replace(/^&/,'?'); location.href=location.pathname+q; };
    apply();
  }

  function start(){
    initFB().then(function(ok){
      if(!ok){setTimeout(start,2000);return}
      fbD.get(fbD.ref(db,'arrowSystem')).then(function(s){
        cfg=normCfg(s.val());
        var tries=0;
        var iv=setInterval(function(){tries++; if(apply()||tries>20)clearInterval(iv)},500);
        if(pickMode) startPick();
      }).catch(function(e){console.warn('[ArrowSystem] get fail',e)});
    });
  }
  start();
})();
