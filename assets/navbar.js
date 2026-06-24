document.addEventListener("DOMContentLoaded", () => {
const nav = document.createElement("nav");
nav.style.cssText =
"background:#0f172a;padding:10px;overflow:auto;white-space:nowrap";

nav.innerHTML = `
<a href="index.html">Home</a> |
<a href="products.html">Products</a> |
<a href="cart.html">Cart</a> |
<a href="seller.html">Seller</a> |
<a href="login.html">Login</a> |
<a href="#">Electronics</a> |
<a href="#">Electronic Accessories</a> |
<a href="#">Computers</a> |
<a href="#">Mobile Phones</a> |
<a href="#">TV & Appliances</a> |
<a href="#">Home & Kitchen</a> |
<a href="#">Home & Lifestyle</a> |
<a href="#">Grocery</a> |
<a href="#">Food & Beverages</a> |
<a href="#">Health & Beauty</a> |
<a href="#">Women's Fashion</a> |
<a href="#">Men's Fashion</a> |
<a href="#">Watches & Bags</a> |
<a href="#">Mother & Baby</a> |
<a href="#">Toys & Games</a> |
<a href="#">Sports</a> |
<a href="#">Automotive</a> |
<a href="#">Pet Supplies</a> |
<a href="#">Books</a> |
<a href="#">Stationery</a> |
<a href="#">Tools</a> |
<a href="#">Software</a> |
<a href="#">Deals</a> |
<a href="#">New Arrivals</a> |
<a href="#">Best Sellers</a>
`;

document.body.prepend(nav);
});
