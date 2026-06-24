document.addEventListener("DOMContentLoaded", () => {

const root = document.createElement("div");

root.innerHTML = `
<style>
.navbar{
position:sticky;
top:0;
z-index:999;
background:#0f172a;
color:white;
padding:10px;
font-family:Arial;
}

.topbar{
display:flex;
align-items:center;
justify-content:space-between;
gap:10px;
}

.menu-btn{
font-size:22px;
cursor:pointer;
}

.search{
flex:1;
padding:6px;
border-radius:5px;
border:none;
outline:none;
}

.cart{
cursor:pointer;
}

.menu-list{
display:none;
flex-direction:column;
margin-top:10px;
background:#111827;
padding:10px;
border-radius:8px;
max-height:60vh;
overflow:auto;
}

.menu-list a{
color:white;
text-decoration:none;
padding:6px 0;
border-bottom:1px solid #1f2937;
}

.menu-list.show{
display:flex;
}
</style>

<div class="navbar">

  <div class="topbar">
    <div class="menu-btn">☰</div>

    <input class="search" placeholder="Search products...">

    <div class="cart">🛒 <span id="cartCount">0</span></div>
  </div>

  <div class="menu-list">
    <a href="index.html">Home</a>
    <a href="products.html">Products</a>
    <a href="cart.html">Cart</a>
    <a href="seller.html">Seller</a>
    <a href="login.html">Login</a>

    <hr>

    <a href="#">Electronics</a>
    <a href="#">Mobile Phones</a>
    <a href="#">Computers</a>
    <a href="#">TV & Appliances</a>
    <a href="#">Home & Kitchen</a>
    <a href="#">Grocery</a>
    <a href="#">Health & Beauty</a>
    <a href="#">Fashion</a>
    <a href="#">Books</a>
    <a href="#">Sports</a>
    <a href="#">Automotive</a>
  </div>

</div>
`;

document.body.prepend(root);

// toggle menu
const btn = root.querySelector(".menu-btn");
const menu = root.querySelector(".menu-list");

btn.onclick = () => {
menu.classList.toggle("show");
};

});
