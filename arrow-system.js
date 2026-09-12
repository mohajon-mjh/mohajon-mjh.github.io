/* Arrow System public v9 — correct container climb (carousel wrapper fix) */
(function(){
  var EMO=['➡️','⬅️','⬆️','️','▶️','️','🔺','','👉','','👆','','⏩','','','','↪️','️','➤','➔','>','»','«','—','★','✓','⚡','🔥','⭐','✨','✅','❗','🎯','','','🛒','🏷️','💎'];
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

  // carousel wrapper skip করে আসল container খোঁজা
  function resolveContainer(card){
    var n=card.parentElement;
    while(n && n!==document.body){
      if(n.querySelectorAll('.product-card').length>1) return n;
      n=n.parentElement;
    }
    return card.parentElement;
  }
  function childOf(container,node){
    var n=node;
    while(n && n.parentElement!==container) n=n.parentElement;
    return n||node;
  }
  function layoutOf(cards){
    return (cards.length>1 && cards[0].offsetTop===cards[1].offsetTop) ? 'h' : 'v';
  }
  function markerEl(m,mode,ct){
    var d=document.createElement('div');d.className='arrow-marker';
    var h=(m.height||28);
    var S=function(k,v){d.style.setProperty(k,v,'important')};
    S('display','flex');S('align-items','center');S('justify-content','center');
    S('line-height','1');S('font-size',(h-4)+'px');
    S('border','none');S('outline','none');S('box-shadow','none');S('background','transparent');
    S('height',h+'px');S('padding','0');S('min-width','0');S('min-height','0');S('max-height',h+'px');
    if(mode==='h'){ S('align-self','center');S('flex','0 0 auto');S('width',(m.width>0?m.width+'px':'60px'));S('margin','0 4px'); }
    else {
      var grid=getComputedStyle(ct).display.indexOf('grid')===0;
      if(grid){S('grid-column','1 / -1');}
      S('align-self','center');S('width',(m.width>0?m.width+'px':'100%'));S('margin','5px 0');
    }
    d.textContent=m.emoji||'➡️';
    if(pickActive){ S('background','rgba(39,174,96,.15)');S('cursor','pointer');S('pointer-events','auto');
      d.onclick=function(e){e.stopPropagation();e.preventDefault();openEdit(m);}; }
    return d;
  }

  function apply(){
    document.querySelectorAll('.arrow-marker').forEach(function(e){e.remove()});
    if(!cfg||cfg.enabled===false)return true;
    var cardsAll=[].slice.call(document.querySelectorAll('.product-card'));
    if(!cardsAll.length)return false;
    var containers=[];
    cardsAll.forEach(function(c){var ct=resolveContainer(c); if(containers.indexOf(ct)<0)containers.push(ct);});
    var c=curCat();
    containers.forEach(function(ct){
      var cards=[].slice.call(ct.querySelectorAll('.product-card'));
      if(!cards.length)return;
      var mode=layoutOf(cards);
      var attr=(ct.getAttribute&&ct.getAttribute('data-cat'))||'';
      var ms=(cfg.markers||[]).filter(function(m){
        if(!m)return false; var s=m.scope||'all';
        return s==='all'||s===c||(attr&&attr.indexOf(s)>-1)||(ct.id&&ct.id.indexOf(s)>-1);
      });
      ms.sort(function(a,b){return (a.position||0)-(b.position||0)});
      var anchors={};
      ms.forEach(function(m){
        var pos=parseInt(m.position||0,10); if(pos<1||pos>cards.length)return;
        var anchorChild=childOf(ct,cards[pos-1]);
        var n=markerEl(m,mode,ct);
        if(anchors[pos]) anchors[pos].insertAdjacentElement('afterend',n);
        else anchorChild.insertAdjacentElement('afterend',n);
        anchors[pos]=n;
      });
    });
    return true;
  }

  function nearestTarget(x,y){
    var cards=[].slice.call(document.querySelectorAll('.product-card'));
    var best=null,bestD=1e9;
    for(var i=0;i<cards.length;i++){
      var r=cards[i].getBoundingClientRect();
      if(r.width<5||r.height<5)continue;
      var inside=(x>=r.left-5&&x<=r.right+5&&y>=r.top-5&&y<=r.bottom+5);
      var cx=r.left+r.width/2, cy=r.top+r.height/2;
      var dd=inside?0:Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy));
      if(dd<bestD){bestD=dd;best={card:cards[i],r:r};}
    }
    if(!best||bestD>170)return null;
    var ct=resolveContainer(best.card);
    var cards2=[].slice.call(ct.querySelectorAll('.product-card'));
    var horiz=cards2.length>1?(cards2[0].offsetTop===cards2[1].offsetTop):false;
    var idx=cards2.indexOf(best.card);
    var after=horiz?(x>best.r.left+best.r.width/2):(y>best.r.top+best.r.height/2);
    var k=after?idx:idx-1; if(k<0)k=0;
    return {k:k};
  }
  function clearHint(){var h=document.getElementById('asDropHint');if(h)h.remove();}
  function showHint(card,after,horiz){
    clearHint();
    var el=document.createElement('div');el.id='asDropHint';
    el.style.cssText='position:fixed;z-index:99997;pointer-events:none;background:rgba(39,174,96,.25);border:2px dashed #27ae60;border-radius:8px;';
    var r=card.getBoundingClientRect();
    if(horiz){var w=26;el.style.left=(after?r.right+2:r.left-w-2)+'px';el.style.top=r.top+'px';el.style.width=w+'px';el.style.height=r.height+'px';}
    else{var h2=22;el.style.left=r.left+'px';el.style.top=(after?r.bottom+2:r.top-h2-2)+'px';el.style.width=r.width+'px';el.style.height=h2+'px';}
    document.body.appendChild(el);
  }

  function closePopup(){if(popup){popup.remove();popup=null;}clearHint();}
  function buildPopup(title,vals,onSave,onDelete){
    closePopup();
    popup=document.createElement('div');popup.className='as-popup-overlay';
    popup.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px';
    var box=document.createElement('div');box.className='as-popup';
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
    buildPopup('➕ Arrow: পণ্য '+pos+' এর পরে (scope: '+scopeForPage()+')', {emoji:'➡️',height:28,width:0}, function(v){
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
    if(!flag){ alert('Picker চালু করতে আগে একই browser এ Admin Panel খোলো।'); return; }
    pickActive=true;
    document.body.style.cursor='crosshair';
    var bar=document.createElement('div');bar.id='asBar';
    bar.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;background:#8e44ad;color:#fff;padding:8px 14px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.3);text-align:center;cursor:default';
    bar.innerHTML='🎯 Picker ON — যেখানে খুশি tap = সেই ফাঁকে arrow | arrow এ tap = edit/delete <button id="apExit" style="background:#e74c3c;color:#fff;border:0;border-radius:6px;padding:4px 8px;cursor:pointer;margin-left:8px">❌ Exit</button>';
    document.body.appendChild(bar);
    bar.querySelector('#apExit').onclick=function(){ var q=location.search.replace(/[?&]aspick=1/,''); if(q.indexOf('?')===-1)q=q.replace(/^&/,'?'); location.href=location.pathname+q; };
    document.addEventListener('click', function(e){
      if(!pickActive)return;
      var t=e.target;
      if(t.closest && t.closest('#asBar, .arrow-marker, .as-popup, .as-popup-overlay, button, a, input, select, textarea, label'))return;
      var tgt=nearestTarget(e.clientX,e.clientY);
      if(!tgt)return;
      e.preventDefault(); e.stopPropagation();
      showHint(tgt.card||null,tgt.after,tgt.horiz);
      setTimeout(function(){ openNew(tgt.k+1); },150);
    }, true);
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
