document.addEventListener("DOMContentLoaded", () => {

const categories = [
{name:"Spices",img:"assets/images/categories/spices.jpg"},
{name:"Rice",img:"assets/images/categories/rice.jpg"},
{name:"Oil",img:"assets/images/categories/oil.jpg"},
{name:"Grocery",img:"assets/images/categories/grocery.jpg"},
{name:"Beverages",img:"assets/images/categories/beverages.jpg"},
{name:"Snacks",img:"assets/images/categories/snacks.jpg"},
{name:"Health & Beauty",img:"assets/images/categories/beauty.jpg"},
{name:"Fashion",img:"assets/images/categories/fashion.jpg"},
{name:"Electronics",img:"assets/images/categories/electronics.jpg"},
{name:"Mobile Phones",img:"assets/images/categories/mobile.jpg"},
{name:"Computers",img:"assets/images/categories/computer.jpg"},
{name:"TV & Appliances",img:"assets/images/categories/tv.jpg"},
{name:"Home & Kitchen",img:"assets/images/categories/home.jpg"},
{name:"Books",img:"assets/images/categories/books.jpg"},
{name:"Sports",img:"assets/images/categories/sports.jpg"},
{name:"Automotive",img:"assets/images/categories/automotive.jpg"}
];

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

document.body.insertAdjacentHTML("afterbegin", `
<style>
.navbar{position:sticky;top:0;z-index:9999;background:#0f172a;color:#fff;padding:12px}
.topbar{display:flex;gap:10px;align-items:center}
.menu-btn{font-size:26px;cursor:pointer}
.search{flex:1;padding:8px;border-radius:6px;border:none}
.cart{cursor:pointer}
.mega-menu{display:none;position:absolute;top:60px;left:0;right:0;background:#fff;color:#000;padding:15px}
.mega-menu.show{display:block}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.card{border:1px solid #ddd;border-radius:10px;overflow:hidden;text-align:center;text-decoration:none;color:#000}
.card img{width:100%;height:90px;object-fit:cover}
.card span{display:block;padding:8px;font-weight:bold}
</style>

<div class="navbar">
  <div class="topbar">
    <div class="menu-btn">☰</div>
    <input class="search" placeholder="Search products...">
    <div class="cart">🛒 <span id="cartCount">${cart.length}</span></div>
  </div>

  <div class="mega-menu">
    <div class="grid">
      ${categories.map(c=>`
        <a class="card" href="products.html?cat=${encodeURIComponent(c.name)}">
          <img src="${c.img}" onerror="this.src='https://placehold.co/300x200?text=${encodeURIComponent(c.name)}'">
          <span>${c.name}</span>
        </a>
      `).join("")}
    </div>
  </div>
</div>
`);

const btn = document.querySelector(".menu-btn");
const menu = document.querySelector(".mega-menu");

btn.onclick = () => menu.classList.toggle("show");

document.addEventListener("click",(e)=>{
  if(!menu.contains(e.target) && !btn.contains(e.target)){
    menu.classList.remove("show");
  }
});

const search = document.querySelector(".search");
search.addEventListener("keyup",(e)=>{
  if(location.pathname.includes("products.html")){
    const url = new URL(location.href);
    url.searchParams.set("q", e.target.value);
    history.replaceState({},'',url);
  }
});

});

// CATEGORY LINKS (AUTO ADD)
const categoriesHTML = `
  <a href="categories/spices.html">🌶 Spices</a>
  <a href="categories/grains.html">🌾 Grains</a>
  <a href="categories/oil.html">🛢 Oil</a>
  <a href="categories/dry-fruits.html">🥜 Dry Fruits</a>
`;

document.addEventListener("DOMContentLoaded",()=>{
  const menu = document.querySelector(".menu");
  if(menu){
    menu.innerHTML += categoriesHTML;
  }
});
