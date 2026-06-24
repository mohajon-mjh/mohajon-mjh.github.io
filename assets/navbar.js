document.addEventListener("DOMContentLoaded", () => {

const nav = document.createElement("div");

nav.innerHTML = `
<style>
.navbar {
  background:#0f172a;
  padding:10px;
  color:white;
  position:relative;
}

.menu-btn {
  font-size:22px;
  cursor:pointer;
  user-select:none;
}

.menu-list {
  display:none;
  flex-direction:column;
  margin-top:10px;
}

.menu-list a {
  color:white;
  text-decoration:none;
  padding:5px 0;
}

.menu-list.show {
  display:flex;
}
</style>

<div class="navbar">
  <div class="menu-btn">☰ Menu</div>

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

document.body.prepend(nav);

// toggle menu
const btn = nav.querySelector(".menu-btn");
const list = nav.querySelector(".menu-list");

btn.onclick = () => {
  list.classList.toggle("show");
};

});
