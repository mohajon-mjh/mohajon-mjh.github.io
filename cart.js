function getCart(){
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}
function addCart(id, name, price, sellerId){
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if(item){
    item.qty = (item.qty || 1) + 1;
  } else {
    cart.push({id, name, price, qty:1, sellerId: sellerId || "unknown"});
  }
  saveCart(cart);
}
function removeCart(id){
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}
function updateCartQty(id, qty){
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if(item){
    item.qty = Math.max(1, qty);
  }
  saveCart(cart);
}
function updateCartUI(){
  let cart = getCart();
  let count = cart.reduce((sum,i)=>sum + (i.qty||1),0);
  document.querySelectorAll("#cartCount").forEach(el=>{
    el.textContent = count;
  });
}
window.addCart = addCart;
window.removeCart = removeCart;
window.updateCartQty = updateCartQty;
window.getCart = getCart;
function renderCartList(containerId){
 var c=JSON.parse(localStorage.getItem("cart")||"[]");
 var el=document.getElementById(containerId);if(!el)return;
 if(!c.length){el.innerHTML="<p style=\'text-align:center;color:#888;padding:20px\'>Cart is empty</p>";return;}
 el.innerHTML=c.map((i,idx)=>`
  <div class="cart-row" data-id="${i.id}" ${i.bogoKey?`data-bogo-key="${i.bogoKey}"`:''} style="display:flex;gap:10px;align-items:center;padding:12px;border-bottom:1px solid #eee;${i.isFree?\'background:#fff8e1;border-left:4px solid #f39c12\':\'\'}">
   <div style="flex:1"><b>${i.name}</b><br>
    <small>${i.isFree?\'🎁 FREE (BOGO)\':\'৳\'+(i.price||0)} × \'+(i.qty||1)+\' = ৳\'+((i.price||0)*(i.qty||1))}</small>
   </div>
   ${i.isFree?\'<span style="background:#f39c12;color:#fff;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700">FREE</span>\':
   `<input type="number" min="1" value="${i.qty||1}" style="width:60px;padding:6px;border:1px solid #ddd;border-radius:6px" onchange="updateCartQty(\'${i.id}\',+this.value)">`}
   ${i.isFree?\'<button disabled style="opacity:.4">🗑</button>\':
   `<button onclick="removeCart(\'${i.id}\')" style="background:#e74c3c;color:#fff;border:none;padding:6px 12px;border-radius:6px;cursor:pointer">🗑</button>`}
  </div>`).join("");
}
window.addEventListener("storage", updateCartUI);
document.addEventListener("DOMContentLoaded", updateCartUI);
document.addEventListener("headerLoaded", updateCartUI);
