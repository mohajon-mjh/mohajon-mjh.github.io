/* Arrow System public v16 — emoji gate only. No picker, no cursor, no click blocking */
(function(){
  var PATH1='settings/arrowSystem', PATH2='arrowSystem';
  var cfg=null, db=null, fbD=null;

  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; return true; }catch(e){return false} }

  function curCat(){try{return new URLSearchParams(location.search).get('id')||''}catch(e){return ''}}
  function uid(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function normCfg(v){
    if(!v)return {enabled:true,markers:[]};
    var m=v.markers;
    if(m&&!Array.isArray(m)){m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]});}
    m=Array.isArray(m)?m:[];
    m.forEach(function(x){ if(x&&!x.id)x.id=uid(); });
    return {enabled:v.enabled!==false,markers:m};
  }
  function loadCfg(cb){
    fbD.get(fbD.ref(db,PATH1)).then(function(s){
      if(s.exists()){ cb(normCfg(s.val())); }
      else fbD.get(fbD.ref(db,PATH2)).then(function(s2){ cb(normCfg(s2.exists()?s2.val():null)); }).catch(function(){ cb(normCfg(null)); });
    }).catch(function(){ cb(normCfg(null)); });
  }

  function resolveContainer(card){
    var n=card.parentElement;
    while(n && n!==document.body){
      if(n.querySelectorAll('.product-card').length>1) return n;
      n=n.parentElement;
    }
    return card.parentElement;
  }
  function layoutOf(cards){
    return (cards.length>1 && cards[0].offsetTop===cards[1].offsetTop) ? 'h' : 'v';
  }
  function relX(n,ct){var x=0;while(n&&n!==ct){x+=n.offsetLeft;n=n.offsetParent;}return x;}
  function relY(n,ct){var y=0;while(n&&n!==ct){y+=n.offsetTop;n=n.offsetParent;}return y;}

  function placeOverlay(m,card,ct,mode){
    var d=document.createElement('div');d.className='arrow-marker';
    var h=(m.height||28);
    var horiz=(mode==='h');
    var w= m.width>0? m.width : (horiz?44:Math.max(60,card.offsetWidth-10));
    var cx=relX(card,ct), cy=relY(card,ct);
    var left,top;
    if(horiz){ left=cx+card.offsetWidth-Math.round(w/2); top=cy+Math.round(card.offsetHeight/2)-Math.round(h/2); }
    else { left=cx+Math.round(card.offsetWidth/2)-Math.round(w/2); top=cy+card.offsetHeight-Math.round(h/2)+2; }
    var S=function(k,v){d.style.setProperty(k,v,'important')};
    S('position','absolute');S('left',left+'px');S('top',top+'px');
    S('width',w+'px');S('height',h+'px');
    S('display','flex');S('align-items','center');S('justify-content','center');
    S('line-height','1');S('font-size',Math.max(14,h-6)+'px');
    S('border','none');S('outline','none');
    S('box-shadow','0 1px 4px rgba(0,0,0,.25)');
    S('background','rgba(255,255,255,.95)');
    S('z-index','60');S('margin','0');S('padding','0');S('border-radius','8px');
    S('pointer-events','auto');S('cursor','pointer');
    d.textContent=m.emoji||'➡️';
    d.title='আরো পণ্য দেখতে ক্লিক করো';
    d.onclick=function(e){ e.stopPropagation(); e.preventDefault(); m._un=!m._un; apply(); };
    ct.appendChild(d);
  }

  function apply(){
    document.querySelectorAll('.arrow-marker').forEach(function(e){e.remove()});
    var cardsAll=[].slice.call(document.querySelectorAll('.product-card'));
    cardsAll.forEach(function(c){ c.style.removeProperty('display'); });
    if(!cfg||cfg.enabled===false)return true;
    if(!cardsAll.length)return false;
    var containers=[];
    cardsAll.forEach(function(c){var ct=resolveContainer(c); if(containers.indexOf(ct)<0)containers.push(ct);});
    var c=curCat();
    containers.forEach(function(ct){
      var cards=[].slice.call(ct.querySelectorAll('.product-card'));
      if(!cards.length)return;
      if(getComputedStyle(ct).position==='static') ct.style.position='relative';
      var mode=layoutOf(cards);
      var attr=(ct.getAttribute&&ct.getAttribute('data-cat'))||'';
      var ms=(cfg.markers||[]).filter(function(m){
        if(!m)return false; var s=m.scope||'all';
        return s==='all'||s===c||(attr&&attr.indexOf(s)>-1)||(ct.id&&ct.id.indexOf(s)>-1);
      }).sort(function(a,b){return (a.position||0)-(b.position||0)});

      var limit=cards.length, arrows=[];
      if(ms.length){
        limit=Math.min(ms[0].position,cards.length);
        arrows.push({m:ms[0],pos:limit});
        var i=0;
        while(i<ms.length && ms[i]._un){
          limit=(i+1<ms.length)? Math.min(ms[i+1].position,cards.length) : cards.length;
          i++;
          if(i<ms.length) arrows.push({m:ms[i],pos:Math.min(ms[i].position,cards.length)});
        }
      }
      cards.forEach(function(card,idx){
        if(idx+1>limit) card.style.setProperty('display','none','important');
      });
      arrows.forEach(function(a){ if(a.pos>=1) placeOverlay(a.m,cards[a.pos-1],ct,mode); });
    });
    return true;
  }

  function start(){
    initFB().then(function(ok){
      if(!ok){setTimeout(start,2000);return}
      loadCfg(function(v){
        cfg=v;
        var tries=0;
        var iv=setInterval(function(){tries++; if(apply()||tries>20)clearInterval(iv)},500);
      });
    });
  }
  start();
})();
