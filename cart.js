function getCart(){
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function addCart(id, name, price){
  let cart = getCart();

  let item = cart.find(i => i.id === id);

  if(item){
    item.qty = (item.qty || 1) + 1;
  } else {
    cart.push({id, name, price, qty:1});
  }

  saveCart(cart);
}

function removeCart(id){
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateCartUI(){
  let cart = getCart();
  let count = cart.reduce((sum,i)=>sum + (i.qty||1),0);

  document.querySelectorAll("#cartCount").forEach(el=>{
    el.textContent = count;
  });
}

window.addEventListener("storage", updateCartUI);
document.addEventListener("DOMContentLoaded", updateCartUI);
