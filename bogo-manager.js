/* MJH BOGO Manager v1 - Buy 1 Get 1 system
   শুধু Mega Offers > Buy 1 Get 1 category এর products এ কাজ করে
   Rule A: type=same → Buy 1 Get 1 same product FREE
   Rule B: type=specific → Buy product → Get freeProductId FREE
*/
(function(){
  const DB_URL="https://mohajon-mjh-default-rtdb.firebaseio.com";
  let PRODUCTS_CACHE={};

  async function fetchProduct(id){
    if(PRODUCTS_CACHE[id])return PRODUCTS_CACHE[id];
    try{
      const r=await fetch(`${DB_URL}/products/${encodeURIComponent(id)}.json`);
      const p=await r.json();
      PRODUCTS_CACHE[id]=p||null;
      return p;
    }catch(e){return null;}
  }

  // বর্তমান cart থেকে BOGO rules check করে free items যোগ/আপডেট/সরানো
  async function syncBogoFreeItems(cart){
    const bogoKeys=new Set();
    for(const item of cart){
      if(item.isFree)continue;
      const p=await fetchProduct(item.id);
      if(!p||!p.bogo||!p.bogo.enabled)continue;
      const b=p.bogo;
      const paidQty=Math.max(1,item.qty||1);
      const maxFree=Math.max(1,b.maxFreeQuantity||1);
      const freeQty=Math.min(paidQty*maxFree, paidQty);

      if(b.type==="same"){
        const key=`BOGO_${item.id}_FREE`;
        bogoKeys.add(key);
        const existing=cart.find(c=>c.bogoKey===key);
        if(existing){existing.qty=freeQty;}
        else{cart.push({
          id:item.id,name:`🎁 FREE — ${item.name}`,
          price:item.price,qty:freeQty,sellerId:item.sellerId,
          isFree:true,bogoKey:key,linkedTo:item.id
        });}
      }else if(b.type==="specific"&&b.freeProductId){
        const key=`BOGO_${item.id}_FREE_${b.freeProductId}`;
        bogoKeys.add(key);
        const fp=await fetchProduct(b.freeProductId);
        if(!fp)continue;
        const existing=cart.find(c=>c.bogoKey===key);
        if(existing){existing.qty=freeQty;}
        else{cart.push({
          id:b.freeProductId,name:`🎁 FREE — ${fp.title||fp.name}`,
          price:fp.price||0,qty:freeQty,sellerId:fp.sellerId||item.sellerId,
          isFree:true,bogoKey:key,linkedTo:item.id
        });}
      }
    }
    // যে BOGO free items এর linked paid item নেই → সরানো
    for(let i=cart.length-1;i>=0;i--){
      const c=cart[i];
      if(c.isFree&&c.bogoKey&&!bogoKeys.has(c.bogoKey))cart.splice(i,1);
      if(c.isFree&&c.bogoKey){c.qty=Math.max(1,c.qty||1);c.price=0;}
    }
    return cart;
  }

  // Cart UI এ FREE items এর qty button disable করা
  function patchCartUI(){
    setTimeout(()=>{
      document.querySelectorAll('[data-bogo-key]').forEach(el=>{
        const inp=el.querySelector("input[type=number]");
        const btns=el.querySelectorAll("button");
        if(inp){inp.disabled=true;inp.title="BOGO Free — auto manage";}
        btns.forEach(b=>{
          if(b.textContent&&/(qty|\+|\-|update)/i.test(b.textContent)){
            b.disabled=true;b.style.opacity="0.4";
          }
        });
      });
    },300);
  }

  // Original cart functions কে wrap করে BOGO aware করা
  function installCartHooks(){
    if(!window.__bogoInstalled){
      const origAdd=window.addCart;
      const origRemove=window.removeCart;
      const origUpdate=window.updateCartQty;
      const origSave=window.saveCart||function(c){localStorage.setItem("cart",JSON.stringify(c));};

      window.addCart=async function(id,name,price,sellerId){
        if(origAdd)origAdd(id,name,price,sellerId);
        await syncAndSave();
      };
      window.removeCart=async function(id){
        // Paid item সরাতে গেলে linked free items ও সরবে
        let cart=JSON.parse(localStorage.getItem("cart")||"[]");
        cart=cart.filter(c=>c.id!==id&&c.linkedTo!==id);
        cart=await syncBogoFreeItems(cart);
        localStorage.setItem("cart",JSON.stringify(cart));
        if(window.updateCartUI)window.updateCartUI();
        patchCartUI();
      };
      window.updateCartQty=async function(id,qty){
        let cart=JSON.parse(localStorage.getItem("cart")||"[]");
        const item=cart.find(c=>c.id===id&&!c.isFree);
        if(item)item.qty=Math.max(1,qty);
        cart=await syncBogoFreeItems(cart);
        localStorage.setItem("cart",JSON.stringify(cart));
        if(window.updateCartUI)window.updateCartUI();
        patchCartUI();
      };

      // Free items এর qty manually change করা বন্ধ
      window.__bogoProtectFreeItem=function(id){return false;};
      window.__bogoInstalled=true;
    }
  }

  async function syncAndSave(){
    let cart=JSON.parse(localStorage.getItem("cart")||"[]");
    cart=await syncBogoFreeItems(cart);
    localStorage.setItem("cart",JSON.stringify(cart));
    if(window.updateCartUI)window.updateCartUI();
    patchCartUI();
  }

  // Page load এ cart sync করা
  async function onReady(){
    installCartHooks();
    await syncAndSave();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",onReady);
  }else{
    onReady();
  }

  // Checkout/buyflow এ cart total থেকে free item বাদ দেওয়ার helper
  window.MJH_BOGO={
    isFreeItem:item=>!!(item&&item.isFree),
    paidSubtotal:cart=>cart.filter(i=>!i.isFree).reduce((s,i)=>s+(i.price||0)*(i.qty||1),0),
    freeItems:cart=>cart.filter(i=>i.isFree),
    sync:syncAndSave
  };
})();
