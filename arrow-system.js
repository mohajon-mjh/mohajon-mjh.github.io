/* Arrow System public v7 — DRAG & DROP placement + layout fix */
(function(){
  var EMO=['➡️','⬅️','⬆️','️','▶️','◀️','','','👉','','👆','👇','','⏪','🔼','','↪️','️','➤','➔','>','»','«','—','★','✓','⚡','🔥','⭐','✨','✅','❗','🎯','📌','','🛒','🏷️','💎'];
  var PATH1='settings/arrowSystem', PATH2='arrowSystem';
  var cfg=null, db=null, fbD=null, popup=null;
  var pickMode=location.search.indexOf('aspick=1')>-1;
  var pickActive=false;

  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; return true; }catch(e){return false} }

  function curCat(){try{return new URLSearchParams(location.search).get('id')||''}catch(e){return ''}}
  function scopeForPage(){return curCat()||'all'}
  function uid(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function normCfg(v){ if(!v)return {enabled:true,markers:[]}; var m=v.markers; if(m&&!Array.isArray(m)){m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]});} return {enabled:v.enabled!==false,markers:Array.isArray(m)?m:[]}; }
  function prepCfg(v){ var o={enabled:v.enabled!==false,markers:{}}; (v.markers||[]).forEach(function(m,i){o.markers[i]=m}); return o; }
  function toastMsg(t){var d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-weight:600';document.body.appendChild(d);setTimeout(function(){d.remove()},2500)}

  function loadCfg(cb){
    fbD.get(fbD.ref(db,PATH1)).then(function(s){
      if(s.exists()){ cb(normCfg(s.val())); }
      else fbD.get(fbD.ref(db,PATH2)).then(function(s2){ cb(normCfg(s2.exists()?s2.val():null)); }).catch(function(){ cb(normCfg(null)); });
    }).catch(function(){ cb(normCfg(null)); });
  }

  function layoutOf(cards,p){
    var horiz = cards.length>1 ? (cards[0].offsetTop===cards[1].offsetTop) : false;
    var grid = getComputedStyle(p).display.indexOf('grid')===0;
    if(horiz) return 'h';
    return grid ? 'vgrid' : 'vflex';
  }
  function markerEl(m,mode){
    var d=document.createElement('div');d.className='arrow-marker';
    var h=(m.height||28), wpx=m.width>0?(m.width+'px'):null;
    var base='display:flex;align-items:center;justify-content:center;line-height:1;font-size:'+(h-4)+'px;border:none;outline:none;box-shadow:none;background:transparent;';
    if(mode==='h') d.style.cssText=base+'align-self:center;flex:0 0 auto;width:'+(wpx||'60px')+';height:'+h+'px;margin:0 4px;border-radius:8px;';
    else if(mode==='vgrid') d.style.cssText=base+'grid-column:1/-1;align-self:center;width:'+(wpx||'auto')+';height:'+h+'px;margin:4px 0;';
    else d.style.cssText=base+'width:'+(wpx||'100%')+';height:'+h+'px;margin:6px 0;';
    d.textContent=m.emoji||'➡️';
    if(pickActive){ d.style.pointerEvents='auto'; d.style.cursor='pointer'; d.style.background='rgba(39,174,96,.15)';
      d.onclick=function(e){e.stopPropagation();openEdit(m);}; }
    return d;
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
      var mode=layoutOf(cards,p);
      var attr=(p.getAttribute&&p.getAttribute('data-cat'))||'';
      var ms=(cfg.markers||[]).filter(function(m){
        if(!m)return false; var s=m.scope||'all';
        return s==='all'||s===c||(attr&&attr.indexOf(s)>-1)||(p.id&&p.id.indexOf(s)>-1);
      });
      ms.sort(function(a,b){return (a.position||0)-(b.position||0)});
      var anchors={};
      ms.forEach(function(m){
        var pos=parseInt(m.position||0,10); if(pos<1||pos>cards.length)return;
        var n=markerEl(m,mode);
        if(anchors[pos])anchors[pos].insertAdjacentElement('afterend',n); else cards[pos-1].insertAdjacentElement('afterend',n);
        anchors[pos]=n;
      });
    });
    return true;
  }

  // ===== DRAG & DROP =====
  function clearHint(){ var h=document.getElementById('asDropHint'); if(h)h.remove(); }
  function showHint(card,after,horiz){
    clearHint();
    var el=document.createElement('div'); el.id='asDropHint';
    el.style.cssText='position:fixed;z-index:99998;pointer-events:none;background:rgba(39,174,96,.25);border:2px dashed #27ae60;border-radius:8px;';
    var r=card.getBoundingClientRect();
    if(horiz){ var w=26; el.style.left=(after? r.right+2 : r.left-w-2)+'px'; el.style.top=r.top+'px'; el.style.width=w+'px'; el.style.height=r.height+'px'; }
    else { var h2=22; el.style.left=r.left+'px'; el.style.top=(after? r.bottom+2 : r.top-h2-2)+'px'; el.style.width=r.width+'px'; el.style.height=h2+'px'; }
    document.body.appendChild(el);
  }
  function findTarget(x,y){
    var cards=[].slice.call(document.querySelectorAll('.product-card'));
    for(var i=0;i<cards.length;i++){
      var r=cards[i].getBoundingClientRect();
      if(x>=r.left-25&&x<=r.right+25&&y>=r.top-25&&y<=r.bottom+25){
        var p=cards[i].parentElement;
        var sib=[].filter.call(p.children,function(ch){return ch.classList&&ch.classList.contains('product-card')});
        var horiz = sib.length>1 ? (sib[0].offsetTop===sib[1].offsetTop) : false;
        var idx=sib.indexOf(cards[i]);
        var after = horiz ? (x > r.left+r.width/2) : (y > r.top+r.height/2);
        var k = after ? idx : idx-1; if(k<0)k=0;
        return {k:k, horiz:horiz, card:cards[i], after:after};
      }
    }
    return null;
  }
  function initDrag(){
    var chip=document.createElement('div');
    chip.style.cssText='position:fixed;bottom:64px;left:50%;transform:translateX(-50%);z-index:99999;background:#8e44ad;color:#fff;padding:12px 18px;border-radius:26px;font-size:13px;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.4);cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none';
    chip.textContent='➡️ টেনে দুই পণ্যের মাঝে ছাড়ো';
    document.body.appendChild(chip);
    chip.addEventListener('pointerdown', function(e){
      e.preventDefault();
      var ghost=document.createElement('div');
      ghost.id='asGhost';
      ghost.style.cssText='position:fixed;z-index:100000;pointer-events:none;background:#8e44ad;color:#fff;padding:8px 12px;border-radius:20px;font-size:20px;box-shadow:0 6px 18px rgba(0,0,0,.4);opacity:.9';
      ghost.textContent='➡️';
      document.body.appendChild(ghost);
      chip.style.opacity='.35';
      var tgt=null;
      var mv=function(ev){
        ev.preventDefault();
        ghost.style.left=(ev.clientX-20)+'px'; ghost.style.top=(ev.clientY-20)+'px';
        tgt=findTarget(ev.clientX,ev.clientY);
        if(tgt) showHint(tgt.card,tgt.after,tgt.horiz); else clearHint();
      };
      var up=function(ev){
        window.removeEventListener('pointermove',mv);
        window.removeEventListener('pointerup',up);
        window.removeEventListener('pointercancel',up);
        ghost.remove(); chip.style.opacity='1'; clearHint();
        if(tgt){ openNew(tgt.k+1); }
        tgt=null;
      };
      ghost.style.left=(e.clientX-20)+'px'; ghost.style.top=(e.clientY-20)+'px';
      window.addEventListener('pointermove',mv,{passive:false});
      window.addEventListener('pointerup',up);
      window.addEventListener('pointercancel',up);
    });
  }

  // ===== EDITOR POPUP =====
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
  function saveFB(msg){ fbD.set(fbD.ref(db,PATH1),prepCfg(cfg)).then(function(){ apply(); toastMsg(msg); }).catch(function(e){ alert('Save fail: '+(e.message||e)); }); }
  function openNew(pos){
    buildPopup('➕ Arrow বসাও: পণ্য '+pos+' এর পরে (scope: '+scopeForPage()+')', {emoji:'➡️',height:28,width:0}, function(v){
      cfg.markers=cfg.markers||[];
      cfg.markers.push({id:uid(),scope:scopeForPage(),position:pos,emoji:v.emoji,height:v.height,width:v.width});
      saveFB('Marker added ✅');
    }, null);
  }
  function openEdit(m){
    buildPopup('✏️ Arrow Editor — edit / delete', m, function(v){
      m.emoji=v.emoji; m.height=v.height; m.width=v.width; saveFB('Marker updated ✅');
    }, function(){
      cfg.markers=(cfg.markers||[]).filter(function(x){return x.id!==m.id}); saveFB('Marker deleted 🗑️');
    });
  }

  function startPick(){
    var flag=false; try{ flag=localStorage.getItem('asPickerAllowed')==='1'; }catch(e){}
    if(!flag){ alert('Picker চালু করতে আগে একই browser এ Admin Panel খোলো, তারপর এখানে ফিরে এসো।'); return; }
    pickActive=true;
    var bar=document.createElement('div');
    bar.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;background:#8e44ad;color:#fff;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.3);text-align:center';
    bar.innerHTML='🎯 Picker ON — chip টেনে ছাড়ো | arrow এ tap = edit/delete <button id="apExit" style="background:#e74c3c;color:#fff;border:0;border-radius:6px;padding:4px 8px;cursor:pointer;margin-left:8px">❌ Exit</button>';
    document.body.appendChild(bar);
    bar.querySelector('#apExit').onclick=function(){ var q=location.search.replace(/[?&]aspick=1/,''); if(q.indexOf('?')===-1)q=q.replace(/^&/,'?'); location.href=location.pathname+q; };
    initDrag();
    apply();
  }

  function start(){
    initFB().then(function(ok){
      if(!ok){setTimeout(start,2000);return}
      loadCfg(function(v){
        cfg=v;
        var tries=0;
        var iv=setInterval(function(){tries++; if(apply()||tries>20)clearInterval(iv)},500);
        if(pickMode) startPick();
      });
    });
  }
  start();
})();
