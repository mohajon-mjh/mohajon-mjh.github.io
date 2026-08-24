/*pricefix-v2*/
(function(){
Promise.all([import("https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js"),import("https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js")]).then(function(M){
var A=M[0],D=M[1],AU=M[2];
var app=A.getApps().length?A.getApps()[0]:A.initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"});
var db=D.getDatabase(app),auth=AU.getAuth(app);
var KEY=[["bathrobe",1400],["bermuda",900],["short",900],["blazer",4200],["suit",4500],["tuxedo",6500],["bomber",2600],["jacket",2600],["coat",3000],["hoodie",1500],["sweater",1300],["cardigan",1400],["shirt",1100],["tshirt",650],["t-shirt",650],["polo",900],["jeans",1600],["pant",1400],["trouser",1400],["chino",1500],["skirt",1100],["dress",1600],["gown",3500],["saree",2500],["kurti",1200],["punjabi",1800],["boot",2400],["sneaker",2200],["shoe",2000],["sandal",800],["loafer",1800],["belt",550],["wallet",650],["bag",1500],["backpack",1600],["watch",1800],["cap",500],["hat",500],["glove",600],["tie",450],["scarf",600],["sock",250],["underwear",450],["boxer",400],["bra",700],["lingerie",900],["nightwear",1000],["pajama",900],["uniform",1200],["phone",15000],["smartphone",12000],["laptop",45000],["tablet",20000],["headphone",2000],["earbud",1500],["speaker",2500],["camera",15000],["tv",35000],["fridge",45000],["washer",35000],["fan",2500],["lamp",900],["chair",3500],["table",5000],["sofa",25000],["bed",20000]];
function autoPrice(t){t=(t||"").toLowerCase();for(var i=0;i<KEY.length;i++){if(t.indexOf(KEY[i][0])>-1)return KEY[i][1];}return 1200;}
var GC=["electronics","computers","tv_appliances","watches","men_fashion","women_fashion","mother_baby","toys_games","grocery","spices","food_beverages","beauty","health","home_kitchen","automotive","sports","pet_supplies","books","travel","gift_items"];
function toast(msg){var t=document.createElement("div");t.textContent=msg;t.style.cssText="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#111;color:#4ade80;padding:10px 18px;border-radius:20px;font-size:13px;font-weight:700;z-index:99999";document.body.appendChild(t);setTimeout(function(){t.remove();},4000);}
function addBtn(){
 if(document.getElementById("priceFixBtn"))return;
 var b=document.createElement("button");b.id="priceFixBtn";b.innerHTML="💰 দাম অটো-ফিক্স";
 b.style.cssText="position:fixed;bottom:60px;right:16px;z-index:99999;background:#16a34a;color:#fff;border:none;border-radius:30px;padding:12px 18px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4)";
 b.onclick=async function(){
  var badStr=prompt("যে দামগুলো ভুল সেগুলো কমা দিয়ে লিখুন (যেমন: 0,1917):","0,1917");
  if(badStr===null)return;
  var bad=badStr.split(",").map(function(s){return +s.trim();}).filter(function(n){return !isNaN(n);});
  if(!bad.length){alert("কিছু লেখেননি");return;}
  if(!confirm(bad.length+" টি ভুল দাম ঠিক করা হবে। শুরু করবো?"))return;
  b.disabled=true;b.textContent="⏳ চলছে...";
  var fixed=0;
  for(var g=0;g<GC.length;g++){
   try{
    var map=(await D.get(D.ref(db,"settings/globalCategoryProducts/"+GC[g]))).val()||{};
    for(var pid in map){
     var p=(await D.get(D.ref(db,"products/"+pid))).val();
     if(p&&bad.indexOf(+p.price||0)>-1){
      var np=autoPrice(p.title);
      await D.update(D.ref(db,"products/"+pid),{price:np,discountPrice:Math.round(np*1.25)});
      fixed++;
     }
    }
   }catch(e){}
  }
  b.disabled=false;b.innerHTML="💰 দাম অটো-ফিক্স";
  toast("✅ "+fixed+" টি পণ্যের আলাদা আলাদা দাম বসানো হয়েছে!");
 };
 document.body.appendChild(b);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addBtn);else addBtn();
}).catch(function(e){console.error(e);});
})();
