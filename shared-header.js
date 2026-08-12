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
        <span style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(90deg,#131921,#232f3e);border:2px solid #FFD814;border-radius:20px;padding:4px 12px;box-shadow:0 0 12px rgba(255,216,20,.5)"><span style="font-size:15px">🌍</span><select id="currencySelector" style="background:transparent;color:#FFD814;border:none;font-size:13px;font-weight:800;cursor:pointer;outline:none">
          <option value="BDT">৳ BDT - Bangladesh</option>
          <option value="USD">$ USD - US Dollar</option>
          <option value="EUR">€ EUR - Euro</option>
          <option value="GBP">£ GBP - British Pound</option>
          <option value="SAR">﷼ SAR - Saudi Riyal</option>
          <option value="AED">د.إ AED - UAE Dirham</option>
          <option value="QAR">﷼ QAR - Qatari Riyal</option>
          <option value="KWD">د.ك KWD - Kuwaiti Dinar</option>
          <option value="BHD">.د.ب BHD - Bahraini Dinar</option>
          <option value="OMR">﷼ OMR - Omani Rial</option>
          <option value="MYR">RM MYR - Malaysia</option>
          <option value="SGD">S$ SGD - Singapore</option>
          <option value="INR">₹ INR - India</option>
          <option value="PKR">₨ PKR - Pakistan</option>
          <option value="NPR">₨ NPR - Nepal</option>
          <option value="LKR">₨ LKR - Sri Lanka</option>
          <option value="CNY">¥ CNY - China</option>
          <option value="JPY">¥ JPY - Japan</option>
          <option value="KRW">₩ KRW - South Korea</option>
          <option value="THB">฿ THB - Thailand</option>
          <option value="IDR">Rp IDR - Indonesia</option>
          <option value="PHP">₱ PHP - Philippines</option>
          <option value="VND">₫ VND - Vietnam</option>
          <option value="AUD">A$ AUD - Australia</option>
          <option value="NZD">NZ$ NZD - New Zealand</option>
          <option value="CAD">C$ CAD - Canada</option>
          <option value="CHF">Fr CHF - Switzerland</option>
          <option value="SEK">kr SEK - Sweden</option>
          <option value="NOK">kr NOK - Norway</option>
          <option value="DKK">kr DKK - Denmark</option>
          <option value="RUB">₽ RUB - Russia</option>
          <option value="TRY">₺ TRY - Turkey</option>
          <option value="ZAR">R ZAR - South Africa</option>
          <option value="EGP">£ EGP - Egypt</option>
          <option value="NGN">₦ NGN - Nigeria</option>
          <option value="KES">KSh KES - Kenya</option>
          <option value="BRL">R$ BRL - Brazil</option>
          <option value="MXN">$ MXN - Mexico</option>
          <option value="ARS">$ ARS - Argentina</option>
          <option value="HKD">HK$ HKD - Hong Kong</option>
          <option value="TWD">NT$ TWD - Taiwan</option>
          <option value="ILS">₪ ILS - Israel</option>
          <option value="JOD">د.ا JOD - Jordan</option>
          <option value="IQD">ع.د IQD - Iraq</option>
          <option value="IRR">﷼ IRR - Iran</option>
          <option value="AFN">؋ AFN - Afghanistan</option>
          <option value="MMK">K MMK - Myanmar</option>
          <option value="PLN">zł PLN - Poland</option>
          <option value="UAH">₴ UAH - Ukraine</option>
          <option value="RON">lei RON - Romania</option>
          <option value="MAD">د.م. MAD - Morocco</option>
        </select></span>
      </div>
      <div style="display:flex;align-items:center;gap:6px"><a href="help-center.html" style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(90deg,#7CFC00,#00a651);color:#111;font-weight:900;font-size:13px;padding:6px 14px;border-radius:20px;text-decoration:none;box-shadow:0 0 12px rgba(124,252,0,.7)"><span style="font-size:18px">❓</span> Help Center</a> | <a href="my-orders.html" style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(90deg,#FFD814,#FF9900);color:#111;font-weight:900;font-size:13px;padding:6px 16px;border-radius:20px;text-decoration:none;box-shadow:0 0 12px rgba(255,153,0,.8)"><span style="font-size:20px;animation:truckMove 1s infinite alternate">🚚</span> Track Order</a></div><style>@keyframes truckMove{from{transform:translateX(0)}to{transform:translateX(5px)}}</style>
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
