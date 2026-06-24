document.addEventListener("DOMContentLoaded", () => {
const nav = document.createElement("nav");

nav.style.cssText =
"background:#0f172a;padding:10px;overflow:auto;white-space:nowrap";

nav.innerHTML = `
<a href="index.html">Home</a>
<a href="products.html">Products</a>
<a href="cart.html">Cart</a>
<a href="seller.html">Seller</a>
<a href="login.html">Login</a>
<a href="#">Electronics</a>
<a href="#">Mobile Phones</a>
<a href="#">Home & Kitchen</a>
<a href="#">Grocery</a>
<a href="#">Health & Beauty</a>
<a href="#">Fashion</a>
<a href="#">Books</a>
<a href="#">Sports</a>
<a href="#">Automotive</a>
`;

// সব link-কে white color দেবে
nav.querySelectorAll("a").forEach(a => {
a.style.color = "white";
a.style.marginRight = "15px";
a.style.textDecoration = "none";
});

document.body.prepend(nav);
});
