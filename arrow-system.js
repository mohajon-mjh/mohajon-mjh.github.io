/* Arrow System public v4 — universal .product-card containers + horizontal row fix */
(function(){
  var cfg=null, db=null, fbD=null;
  async function initFB(){ if(db)return true; try{
    var m=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js");
    var d=await import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js");
    var C={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
    var app=m.getApps().length?m.getApp():m.initializeApp(C);
    db=d.getDatabase(app); fbD=d; return true; }catch(e){return false} }
  function curCat(){try{return new URLSearchParams(location.search).get('id')||''}catch(e){return ''}}
  function markerEl(m,horiz){
    var d=document.createElement('div');d.className='arrow-marker';
    var h=(m.height||28);
    var w=m.width>0?(m.width+'px'):(horiz?'60px':'100%');
    d.style.cssText='display:flex;align-items:center;justify-content:center;line-height:1;pointer-events:none;font-size:'+(h-4)+'px;'+
      (horiz
        ? 'align-self:center;flex:0 0 auto;width:'+w+';height:'+h+'px;margin:0 4px;border-radius:8px;'
        : 'width:'+w+';height:'+h+'px;margin:6px 0;');
    d.textContent=m.emoji||'➡️';
    return d;
  }
  function apply(){
    document.querySelectorAll('.arrow-marker').forEach(function(e){e.remove()});
    if(!cfg||cfg.enabled===false)return true;
    var cardsAll=[].slice.call(document.querySelectorAll('.product-card'));
    if(!cardsAll.length)return false;
    var parents=[];
    cardsAll.forEach(function(c){ if(c.parentElement&&parents.indexOf(c.parentElement)<0)parents.push(c.parentElement); });
    var c=curCat();
    parents.forEach(function(g){
      var cards=[].filter.call(g.children,function(ch){return ch.classList&&ch.classList.contains('product-card')});
      if(!cards.length)return;
      var cs=getComputedStyle(g);
      var horiz=(cs.flexDirection&&cs.flexDirection.indexOf('row')===0)||(g.scrollWidth>g.clientWidth+10);
      var attr=(g.getAttribute&&g.getAttribute('data-cat'))||'';
      var ms=(cfg.markers||[]).filter(function(m){
        if(!m)return false;
        var s=m.scope||'all';
        if(s==='all')return true;
        if(s===c)return true;
        if(attr&&attr.indexOf(s)>-1)return true;
        if(g.id&&g.id.indexOf(s)>-1)return true;
        return false;
      });
      ms.sort(function(a,b){return (a.position||0)-(b.position||0)});
      var anchors={};
      ms.forEach(function(m){
        var pos=parseInt(m.position||0,10); if(pos<1||pos>cards.length)return;
        var n=markerEl(m,horiz);
        if(anchors[pos])anchors[pos].insertAdjacentElement('afterend',n);
        else cards[pos-1].insertAdjacentElement('afterend',n);
        anchors[pos]=n;
      });
    });
    return true;
  }
  function start(){
    initFB().then(function(ok){
      if(!ok){setTimeout(start,2000);return}
      fbD.get(fbD.ref(db,'arrowSystem')).then(function(s){
        var v=s.val();
        if(v&&v.markers&&!Array.isArray(v.markers)){
          v.markers=Object.keys(v.markers).sort(function(a,b){return parseInt(a)-parseInt(b)}).map(function(k){return v.markers[k]});
        }
        cfg=v||{enabled:true,markers:[]};
        var tries=0;
        var iv=setInterval(function(){tries++; if(apply()||tries>20)clearInterval(iv)},500);
      }).catch(function(e){console.warn('[ArrowSystem] get fail',e)});
    });
  }
  start();
})();
