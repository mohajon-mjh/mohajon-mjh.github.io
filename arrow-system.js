/* Arrow System v2 — public (manual: refresh এ apply হয়) */
(function(){
  var cfg=null, db=null, fbD=null;
  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; return true; }catch(e){console.warn('[ArrowSystem] FB fail',e);return false} }
  function curCat(){try{return new URLSearchParams(location.search).get('id')||''}catch(e){return ''}}
  function normCfg(v){
    if(!v) return {enabled:true,markers:[]};
    var m=v.markers;
    if(m && !Array.isArray(m)){
      m=Object.keys(m).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return m[k]});
    }
    return {enabled:v.enabled!==false,markers:Array.isArray(m)?m:[]};
  }
  function markerEl(m){var d=document.createElement('div');d.className='arrow-marker';
    var w=(!m.width||m.width==0)?'100%':(m.width+'px');
    d.style.cssText='display:flex;align-items:center;justify-content:center;height:'+(m.height||28)+'px;width:'+w+';font-size:'+((m.height||28)-4)+'px;margin:6px 0;line-height:1;pointer-events:none;';
    d.textContent=m.emoji||'➡️';return d}
  function apply(){
    document.querySelectorAll('.arrow-marker').forEach(function(e){e.remove()});
    if(!cfg||cfg.enabled===false)return true;
    var grids=[].slice.call(document.querySelectorAll('#productGrid,.product-grid,#productsGrid,.products-grid'));
    if(!grids.length)return false;
    var found=false, c=curCat();
    grids.forEach(function(g){
      var cards=[].filter.call(g.children,function(ch){return ch.classList&&ch.classList.contains('product-card')});
      if(!cards.length)return; found=true;
      var ms=(cfg.markers||[]).filter(function(m){return m&&(m.scope==='all'||!m.scope||m.scope===c)});
      ms.sort(function(a,b){return (a.position||0)-(b.position||0)});
      var anchors={};
      ms.forEach(function(m){var pos=parseInt(m.position||0,10); if(pos<1||pos>cards.length)return;
        var n=markerEl(m);
        if(anchors[pos])anchors[pos].insertAdjacentElement('afterend',n); else cards[pos-1].insertAdjacentElement('afterend',n);
        anchors[pos]=n;});
    });
    return found;
  }
  function start(){
    initFB().then(function(ok){
      if(!ok){setTimeout(start,2000);return}
      fbD.get(fbD.ref(db,'arrowSystem')).then(function(s){
        cfg=normCfg(s.val());
        var tries=0;
        var iv=setInterval(function(){tries++; if(apply()||tries>20)clearInterval(iv)},500);
      }).catch(function(e){console.warn('[ArrowSystem] get fail',e)});
    });
  }
  start();
})();
