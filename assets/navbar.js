document.addEventListener("DOMContentLoaded", () => {

function getCart(){
return JSON.parse(localStorage.getItem("cart") || "[]");
}

function updateCartCount(){
document.getElementById("cartCount").innerText = getCart().length;
}

const root = document.createElement("div");

root.innerHTML = `
<style>
.navbar{position:sticky;top:0;z-index:9999;background:#0f172a;color:#fff;font-family:Arial}
.topbar{display:flex;gap:10px;align-items:center;padding:10px}
.menu-btn{font-size:24px;cursor:pointer}
.search{flex:1;padding:8px;border:none;border-radius:6px}
.cart{font-weight:bold}
.menu-list{display:none;background:#111827;max-height:70vh;overflow:auto}
.menu-list.show{display:block}
.menu-list a{display:block;padding:10px;color:#fff;border-bottom:1px solid #1f2937;text-decoration:none}
</style>

<div class="navbar">
<div class="topbar">
<div class="menu-btn">☰</div>
<input class="search" placeholder="Search products">
<div class="cart">🛒 <span id="cartCount">0</span></div>
</div>

<div class="menu-list">
<a href="index.html">Home</a>
<a href="products.html">Products</a>
<a href="cart.html">Cart</a>
<a href="seller.html">Seller</a>
<a href="login.html">Login</a>
<a href="products.html?cat=Electronics">Electronics</a>
<a href="products.html?cat=Books">Books</a>
<a href="products.html?cat=Grocery">Grocery</a>
</div>
</div>
`;

document.body.prepend(root);

root.querySelector(".menu-btn").onclick = () => {
root.querySelector(".menu-list").classList.toggle("show");
};

updateCartCount();

});
