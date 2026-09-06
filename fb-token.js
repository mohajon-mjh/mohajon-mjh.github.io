/* MJH Firebase Authenticated Write helper */
window.MJHFB=(function(){
var CFG={apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",authDomain:"mohajon-mjh.firebaseapp.com",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",storageBucket:"mohajon-mjh.firebasestorage.app",messagingSenderId:"526105903976",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"};
var ready=null;
function auth(){
 if(ready)return ready;
 ready=Promise.all([
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),
  import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js")
 ]).then(function(ms){
  var app=ms[0].getApps().length?ms[0].getApp():ms[0].initializeApp(CFG);
  return ms[1].getAuth(app);
 });
 return ready;
}
function token(){
 return auth().then(function(a){
  if(a.currentUser)return a.currentUser.getIdToken();
  return new Promise(function(res){
   var t0=Date.now();
   var iv=setInterval(function(){
    if(a.currentUser){clearInterval(iv);res(a.currentUser.getIdToken());}
    else if(Date.now()-t0>3000){clearInterval(iv);res(null);}
   },200);
  });
 });
}
function req(method,path,obj){
 return token().then(function(tk){
  if(!tk)throw new Error("login দরকার — আগে login.html এ যান");
  return fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/"+path+".json?auth="+tk,{
   method:method,headers:{"Content-Type":"application/json"},
   body:obj?JSON.stringify(obj):undefined
  }).then(function(r){
   if(!r.ok)throw new Error("HTTP "+r.status);
   return r.json();
  });
 });
}
return {
 put:function(p,o){return req("PUT",p,o);},
 patch:function(p,o){return req("PATCH",p,o);},
 del:function(p){return req("DELETE",p);}
};
})();
