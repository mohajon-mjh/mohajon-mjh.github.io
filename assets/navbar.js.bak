document.addEventListener("DOMContentLoaded", () => {

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

const root = document.createElement("div");

root.innerHTML = `
<style>
.navbar{
position:sticky;
top:0;
z-index:9999;
background:#0f172a;
color:#fff;
font-family:Arial,sans-serif;
box-shadow:0 2px 8px rgba(0,0,0,.2);
}

.topbar{
display:flex;
align-items:center;
gap:10px;
padding:10px;
}

.menu-btn{
font-size:24px;
cursor:pointer;
color:#fff;
}

.search{
flex:1;
padding:8px;
border:none;
border-radius:6px;
}

.cart{
color:#fff;
font-weight:bold;
white-space:nowrap;
}

.menu-list{
display:none;
background:#111827;
max-height:70vh;
overflow:auto;
}

.menu-list.show{
display:block;
}

.menu-list a{
display:block;
padding:10px 12px;
color:#fff;
text-decoration:none;
border-bottom:1px solid #1f2937;
}

.menu-list a:hover{
background:#1f2937;
}

@media(min-width:768px){
.menu-list{
columns:2;
}
}
</style>

<div class="navbar">

<div class="topbar">
<div class="menu-btn">☰</div>

<input class="search" placeholder="Search products">

<div class="cart">
🛒 <span id="cartCount">${cart.length}</span>
</div>
</div>

<div class="menu-list">

<a href="index.html">Home</a>
<a href="products.html">All Products</a>
<a href="cart.html">Cart</a>
<a href="seller.html">Seller</a>
<a href="login.html">Login</a>

<a href="products.html?cat=Electronics">Electronics</a>
<a href="products.html?cat=Electronic Accessories">Electronic Accessories</a>
<a href="products.html?cat=Computers">Computers</a>
<a href="products.html?cat=Mobile Phones">Mobile Phones</a>
<a href="products.html?cat=TV & Appliances">TV & Appliances</a>
<a href="products.html?cat=Home & Kitchen">Home & Kitchen</a>
<a href="products.html?cat=Home & Lifestyle">Home & Lifestyle</a>
<a href="products.html?cat=Grocery">Grocery</a>
<a href="products.html?cat=Food & Beverages">Food & Beverages</a>
<a href="products.html?cat=Health & Beauty">Health & Beauty</a>
<a href="products.html?cat=Women Fashion">Women Fashion</a>
<a href="products.html?cat=Men Fashion">Men Fashion</a>
<a href="products.html?cat=Watches & Bags">Watches & Bags</a>
<a href="products.html?cat=Mother & Baby">Mother & Baby</a>
<a href="products.html?cat=Toys & Games">Toys & Games</a>
<a href="products.html?cat=Sports & Outdoors">Sports & Outdoors</a>
<a href="products.html?cat=Automotive">Automotive</a>
<a href="products.html?cat=Pet Supplies">Pet Supplies</a>
<a href="products.html?cat=Books">Books</a>
<a href="products.html?cat=Stationery">Stationery</a>
<a href="products.html?cat=Tools">Tools</a>
<a href="products.html?cat=Software">Software</a>

<a href="products.html?cat=মসলা">মসলা</a>
<a href="products.html?cat=গ্রোসারি">গ্রোসারি</a>
<a href="products.html?cat=খাদ্য">খাদ্য</a>

</div>
</div>
`;

document.body.prepend(root);

const btn = root.querySelector(".menu-btn");
const menu = root.querySelector(".menu-list");

btn.onclick = () => {
menu.classList.toggle("show");
};

});
