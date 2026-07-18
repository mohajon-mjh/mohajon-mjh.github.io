(function() {
    let allProducts = [];
    let filteredProducts = [];

    const grid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    function getCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("categoryId");
    }

    function getSearchFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("search");
    }

    function isWished(id) {
        const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
        return list.some(i => i.id === id);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.categoryId || '');
        card.style.cursor = 'pointer';

        const stock = parseInt(product.stock) || 0;

        let stockBadge = '';
        if (stock <= 0) {
            stockBadge = '<span class="stock-badge out-of-stock">Out of Stock</span>';
        } else if (stock <= 5) {
            stockBadge = '<span class="stock-badge low-stock">Low Stock</span>';
        } else {
            stockBadge = '<span class="stock-badge in-stock">In Stock</span>';
        }

        const price = parseFloat(product.price) || 0;
        const oldPrice = parseFloat(product.oldPrice) || 0;

        let discount = 0;
        if (oldPrice > price) {
            discount = Math.round(((oldPrice - price) / oldPrice) * 100);
        }

        const imageUrl =
            product.images && product.images.main && product.images.main.trim() !== ""
                ? product.images.main
                : "https://dummyimage.com/300x300/eeeeee/555555&text=MJH";

        const wished = isWished(product.id);

        card.innerHTML = `
            <div class="product-card-image">
                <img
                    src="${imageUrl}"
                    alt="${product.title || 'Product'}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://dummyimage.com/300x300/eeeeee/555555&text=MJH';">
                ${stockBadge}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ""}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.title || "Unnamed Product"}</h3>
                <div class="product-card-category">
                    ${product.categoryId || "Uncategorized"}
                </div>
                <div class="product-card-price">
                    <span class="current-price">৳${price.toFixed(2)}</span>
                    ${oldPrice > price
                        ? `<span class="old-price">৳${oldPrice.toFixed(2)}</span>`
                        : ""}
                </div>
                ${product.weight
                    ? `<div class="product-card-weight">${product.weight}</div>`
                    : ""}
                <div class="product-card-actions">
                    <button class="btn-add-to-cart" ${stock <= 0 ? "disabled" : ""}>
                        ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button class="btn-wishlist ${wished ? "active" : ""}">
                        ❤
                    </button>
                    <a href="product-details.html?id=${product.id}" class="btn-view-details">
                        View Details
                    </a>
                </div>
            </div>
        `;

        const addBtn = card.querySelector('.btn-add-to-cart');
        if (addBtn && stock > 0) {
            addBtn.addEventListener('click', () => {
                if (typeof addCart === 'function') {
                    addCart(product.id, product.title, price);
                }
                addBtn.textContent = "Added ✓";
                setTimeout(() => { addBtn.textContent = "Add to Cart"; }, 1200);
            });
        }

        const wishBtn = card.querySelector('.btn-wishlist');
        if (wishBtn) {
            wishBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof toggleWishlist === 'function') {
                    toggleWishlist(product.id, product.title);
                }
                wishBtn.classList.toggle('active');
            });
        }

        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-to-cart') || e.target.closest('.btn-wishlist') || e.target.closest('.btn-view-details')) {
                return;
            }
            window.location.href = `product-details.html?id=${product.id}`;
        });

        return card;
    }

    function applyFilters() {
        const searchTerm = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        const dropdownCategory = categoryFilter
            ? categoryFilter.value
            : "all";

        const urlCategory = getCategoryFromURL();

        filteredProducts = allProducts.filter(product => {
            const matchName = (product.title || "")
                .toLowerCase()
                .includes(searchTerm);

            const matchDropdown =
                dropdownCategory === "all" || product.categoryId === dropdownCategory;

            const matchUrl =
                !urlCategory || urlCategory === "all" ||
                (product.categoryId || "").trim() === urlCategory.trim();

            return matchName && matchDropdown && matchUrl;
        });

        if (grid) {
            grid.innerHTML = "";
            if (filteredProducts.length === 0) {
                grid.innerHTML = `<div class="loading-placeholder">No products found</div>`;
            } else {
                filteredProducts.forEach(product => {
                    grid.appendChild(createProductCard(product));
                });
            }
        }

        const count = document.getElementById("product-count");
        if (count) {
            count.textContent =
                `${filteredProducts.length} item${filteredProducts.length !== 1 ? "s" : ""}`;
        }
    }

    function renderProducts(products) {
        allProducts = products || [];

        const urlSearch = getSearchFromURL();
        if (urlSearch && searchInput) {
            searchInput.value = urlSearch;
        }

        applyFilters();
    }

    document.addEventListener("productsLoaded", function(e) {
        renderProducts(e.detail ? e.detail.products : []);
    });

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

    window.renderProducts = renderProducts;
    window.applyFilters = applyFilters;
})();
