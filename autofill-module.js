/*autofill-v1: empty sections auto-fill from products DB*/
import {initializeApp,getApps,getApp} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getDatabase,ref,query,orderByChild,equalTo,limitToFirst,get} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
const afApp=getApps().some(a=>a.name==="mjhMain")?getApps().find(a=>a.name==="mjhMain"):(getApps().length?getApps()[0]:initializeApp({apiKey:"AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",databaseURL:"https://mohajon-mjh-default-rtdb.firebaseio.com",projectId:"mohajon-mjh",appId:"1:526105903976:web:f9321c6d68ecbd19d58cdd"},"mjhMain"));
const db=getDatabase(afApp);
const AF_START=Date.now();
let POOL=null;
async function getPool(){
 if(POOL)return POOL;
 try{
  const s=await get(query(ref(db,"products"),orderByChild("createdAt"),limitToFirst(300)));
  const o=s.val()||{};
  POOL=Object.keys(o).map(k=>Object.assign({id:k},o[k])).filter(p=>p&&p.status==="active");
  POOL.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 }catch(e){POOL=POOL||[];}
 return POOL;
}
const fmtP=v=>window.MJHCurrency&&window.MJHCurrency.formatPrice?window.MJHCurrency.formatPrice(v):"৳"+((+v||0).toFixed(0));
function afCard(p){
 const id=p.id,price=+p.price||0;
 const old=p.discountPrice&&+p.discountPrice>price?+p.discountPrice:0;
 const disc=old?Math.round((1-price/old)*100):(parseInt(p.discountPercent)||0);
 const stock=parseInt(p.stock)||0;
 let img=(p.images&&p.images.main)||"";
 if(!img&&p.images){const vs=Object.values(p.images);for(const u of vs){if(typeof u==="string"&&u.indexOf("http")===0){img=u;break;}}}
 if(!img)img="https://dummyimage.com/300x300/eeeeee/555&text=MJH";
 const badge=stock<=0?'<span class="stock-badge out-of-stock">Out of Stock</span>':(stock<=5?'<span class="stock-badge low-stock">Low Stock</span>':'<span class="stock-badge in-stock">In Stock</span>');
 const card=document.createElement("div");
 card.className="product-card";card.style.cursor="pointer";
 card.innerHTML='<div class="product-card-image">'+badge+(disc>0?'<span class="discount-badge">-'+disc+'%</span>':'')+'<img src="'+img+'" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'https://dummyimage.com/300x300/eeeeee/555&text=MJH\';"></div><div class="product-card-content"><h3 class="product-card-title">'+(p.title||p.name||"Product")+'</h3><div class="product-card-price"><span class="current-price">'+fmtP(price)+'</span>'+(old?'<span class="old-price">'+fmtP(old)+'</span>':'')+'</div><div class="product-card-actions" style="flex-direction:column"><button class="btn-add-to-cart" style="width:100%">🛒 Add to Cart</button><button class="btn-buy-now" style="width:100%;background:#f59e0b;color:#fff;margin-top:6px;border:none;border-radius:8px;padding:8px 14px;font-size:0.85rem;font-weight:600;cursor:pointer">⚡ Buy Now</button></div></div>';
 card.onclick=function(){location.href="product-details.html?id="+encodeURIComponent(id);};
 card.querySelector(".btn-add-to-cart").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);e.target.textContent="Added ✓";setTimeout(()=>e.target.textContent="🛒 Add to Cart",1200);};
 card.querySelector(".btn-buy-now").onclick=function(e){e.stopPropagation();if(typeof addCart==="function")addCart(id,p.title||p.name,price);location.href="cart.html";};
 return card;
}
function isEmptyGrid(g){if(!g)return false;const t=g.textContent||"";if(/এখনো কোনো|শীঘ্রই পণ্য|লোড করতে সমস্যা/.test(t))return true;if(/লোড হচ্ছে/.test(t))return (Date.now()-AF_START)>15000;return t.trim()==="";}
function fillGrid(g,list){g.innerHTML="";list.slice(0,30).forEach(p=>g.appendChild(afCard(p)));if(!list.length)g.innerHTML='<p style="text-align:center;color:#888">শীঘ্রই পণ্য যুক্ত হবে...</p>';}
const GC_MAP={electronics:["consumer_electronics","electronics_tv_audio_gaming","mobile_phones_accessories","computers_tablets_networking"],computers:["computers_tablets_networking","laptops_pcs"],tv_appliances:["electronics_tv_audio_gaming","appliances_home_appliances_large_small","air_conditioners_refrigerators_washing_machines"],watches:["jewelry_eyewear_watches"],men_fashion:["clothing_fashion_apparel_men_women_kids","shoes_accessories"],women_fashion:["clothing_fashion_apparel_men_women_kids","makeup_skincare_fragrance","shoes_accessories"],mother_baby:["baby_products_baby_essentials"],toys_games:["toys_games_hobbies","video_games_consoles"],grocery:["food_grocery","agriculture_food_beverage"],spices:["agriculture_food_beverage","food_grocery"],food_beverages:["food_grocery","agriculture_food_beverage"],beauty:["beauty_personal_care","makeup_skincare_fragrance"],health:["health_wellness","health_medical_supplies"],home_kitchen:["home_kitchen","furniture_home_decor","appliances_home_appliances_large_small"],automotive:["automotive_vehicle_parts_accessories","vehicles_transportation"],sports:["sports_outdoors_fitness"],pet_supplies:["pet_supplies"],books:["books_media_music"],travel:["luggage_bags_cases"],gift_items:["gifts_crafts"]};
const GC_NAMES=[["electronics","Electronics"],["computers","Computers"],["tv_appliances","TV"],["watches","Watches"],["men_fashion","Men Fashion"],["women_fashion","Women Fashion"],["mother_baby","Mother"],["toys_games","Toys"],["grocery","Grocery"],["spices","Spices"],["food_beverages","Food"],["beauty","Beauty"],["health","Health"],["home_kitchen","Home & Kitchen"],["automotive","Automotive"],["sports","Sports"],["pet_supplies","Pet"],["books","Books"],["travel","Travel"],["gift_items","Gift"]];
function gcIdFromActive(){const a=document.querySelector("#globalCatsRow1 .cat.active,#globalCatsRow2 .cat.active");if(!a)return null;const t=a.textContent||"";for(const e of GC_NAMES){if(t.indexOf(e[1])>-1)return e[0];}return null;}
async function gcFallback(){const id=gcIdFromActive();if(!id)return[];const slugs=GC_MAP[id]||[];let out=[];for(const s of slugs){try{const q=await get(query(ref(db,"products"),orderByChild("categoryId"),equalTo(s),limitToFirst(12)));const o=q.val()||{};Object.keys(o).forEach(k=>{if(o[k]&&o[k].status==="active")out.push(Object.assign({id:k},o[k]));});}catch(e){}if(out.length>=20)break;}return out;}
function dotdMode(){const a=document.querySelector("#dotdCatsRow .cat.active");const t=a?a.textContent:"";if(/Best/i.test(t))return "best";if(/New/i.test(t))return "new";if(/Top/i.test(t))return "top";return "rec";}
const filled={};
async function tick(){
 const pool=await getPool();
 const fg=document.getElementById("flashSaleProductsGrid");
 if(fg&&isEmptyGrid(fg)&&!filled.flash){filled.flash=1;let l=pool.filter(p=>(+p.discountPrice||0)>(+p.price||0)&&(+p.price||0)>0);if(!l.length)l=pool;fillGrid(fg,l);}
 /*trending-autofill-off*/
 const dg=document.getElementById("dealsGrid");
 if(dg&&isEmptyGrid(dg)){const m=dotdMode();if(!filled["d:"+m]){filled["d:"+m]=1;let l=pool.slice();if(m==="best")l.sort((a,b)=>(+b.reviews||0)-(+a.reviews||0));else if(m==="top")l.sort((a,b)=>(+b.rating||0)-(+a.rating||0));fillGrid(dg,l);}}
 const fp=document.getElementById("featuredProducts");
 if(fp&&isEmptyGrid(fp)&&!filled.feat){filled.feat=1;fillGrid(fp,pool.slice().sort((a,b)=>(+b.rating||0)-(+a.rating||0)));}
 const gc=document.getElementById("globalCatCarousel");
 if(gc&&isEmptyGrid(gc)){const id=gcIdFromActive();const k="gc:"+(id||"x");if(!filled[k]){filled[k]=1;const l=await gcFallback();if(l.length)fillGrid(gc,l);}}
}
setTimeout(function(){let n=0;const iv=setInterval(function(){n++;tick();if(n>40)clearInterval(iv);},3000);},4000);
