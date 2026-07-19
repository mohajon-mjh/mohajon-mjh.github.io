(function(){
  function getCartCount(){
    try{
      const cart = JSON.parse(localStorage.getItem("cart")||"[]");
      return cart.reduce((s,i)=>s+(i.qty||1),0);
    }catch(e){return 0;}
  }
  function getWishCount(){
    try{
      const w = JSON.parse(localStorage.getItem("wishlist")||"[]");
      return w.length;
    }catch(e){return 0;}
  }
  function renderHeader(){
    const cartCount = getCartCount();
    const wishCount = getWishCount();
    return `
    <div class="topbar">
      <div>🌐 EN | العربية | বাংলা</div>
      <div>
        <select id="currencySelector" style="background:transparent;color:inherit;border:1px solid rgba(255,255,255,0.4);border-radius:4px;font-size:12px;padding:2px 4px;cursor:pointer">
          <option value="BDT">৳ BDT</option>
          <option value="USD">$ USD</option>
          <option value="SAR">﷼ SAR</option>
          <option value="MYR">RM MYR</option>
        </select>
      </div>
      <div>Help Center | Track Order</div>
    </div>
    <header class="market-header">
      <div class="logo"><a href="index.html"><img src="assets/images/logo.png" alt="MJH"></a></div>
      <div class="search">
        <input type="text" id="headerSearchInput" placeholder="Search products, brands and categories">
        <button id="headerSearchBtn">🔍</button>
      </div>
      <div class="header-actions">
        <a href="login.html">👤 Account</a>
        <a href="wishlist.html">❤️ Wishlist <span id="wishCount" class="count-badge">${wishCount}</span></a>
        <a href="cart.html">🛒 Cart <span id="cartCount" class="count-badge">${cartCount}</span></a>
      </div>
    </header>
    <nav class="market-nav" style="overflow-x:auto; white-space:nowrap; -webkit-overflow-scrolling:touch;">
      <span class="nav-home-wrap">
        <a href="index.html">Home</a>
        <button type="button" id="homeDropdownBtn" aria-label="More options">▾</button>
        <div id="homeDropdownMenu" class="home-dropdown-menu">
          <a href="admin.html" id="adminPanelLink" style="display:none">🔧 Admin Panel</a>
        </div>
      </span>
      <a href="products.html">All Products</a>
      <a href="products.html?categoryId=consumer_electronics">Electronics</a>
      <a href="products.html?categoryId=clothing_fashion_apparel_men_women_kids">Fashion</a>
      <a href="products.html?categoryId=food_grocery">Groceries</a>
      <a href="products.html?categoryId=beauty_personal_care">Health &amp; Beauty</a>
      <a href="products.html?categoryId=home_kitchen">Home &amp; Kitchen</a>
      <a href="products.html?categoryId=sports_outdoors_fitness">Sports</a>
      <a href="products.html?categoryId=books_media_music">Books</a>
      <a href="products.html?categoryId=automotive_vehicle_parts_accessories">Automotive</a>
    </nav>`;
  }

  function mount(){
    const placeholder = document.getElementById("navbar-placeholder");
    if(placeholder){
      placeholder.innerHTML = renderHeader();
    }
    const searchBtn = document.getElementById("headerSearchBtn");
    const searchInput = document.getElementById("headerSearchInput");
    function doSearch(){
      const term = searchInput.value.trim();
      window.location.href = "products.html" + (term ? ("?search="+encodeURIComponent(term)) : "");
    }
    if(searchBtn) searchBtn.addEventListener("click", doSearch);
    if(searchInput) searchInput.addEventListener("keypress", function(e){ if(e.key==="Enter") doSearch(); });

    const homeBtn = document.getElementById("homeDropdownBtn");
    const homeMenu = document.getElementById("homeDropdownMenu");
    if(homeBtn && homeMenu){
      homeBtn.addEventListener("click", function(e){
        e.stopPropagation();
        const willOpen = !homeMenu.classList.contains("active");
        if(willOpen){
          const rect = homeBtn.getBoundingClientRect();
          homeMenu.style.top = (rect.bottom + 6) + "px";
          homeMenu.style.left = rect.left + "px";
        }
        homeMenu.classList.toggle("active");
      });
      document.addEventListener("click", function(e){
        if(!homeMenu.contains(e.target) && e.target !== homeBtn){
          homeMenu.classList.remove("active");
        }
      });
      window.addEventListener("scroll", function(){
        homeMenu.classList.remove("active");
      });
    }

    const currencySel = document.getElementById("currencySelector");
    if(currencySel){
      const saved = localStorage.getItem("selectedCurrency") || "BDT";
      currencySel.value = saved;
      currencySel.addEventListener("change", () => {
        localStorage.setItem("selectedCurrency", currencySel.value);
        document.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: currencySel.value } }));
        location.reload();
      });
    }

    document.dispatchEvent(new CustomEvent("headerLoaded"));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();

/* ===================== SHOW ADMIN LINK ONLY FOR ADMIN ===================== */
(function(){
  const ADMIN_UIDS = ["SqVK0FFNFietVqov8la6hwSAF023"];

  function checkAdminAndShowLink(){
    const link = document.getElementById("adminPanelLink");
    if(!link) return;
    try{
      const userStr = localStorage.getItem("user");
      if(userStr){
        const userObj = JSON.parse(userStr);
        if(userObj && ADMIN_UIDS.includes(userObj.uid)){
          link.style.display = "block";
        } else {
          link.style.display = "none";
        }
      } else {
        link.style.display = "none";
      }
    }catch(e){
      link.style.display = "none";
    }
  }

  document.addEventListener("headerLoaded", checkAdminAndShowLink);
})();
