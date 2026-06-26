(function() {
    let allProducts = [];
    let filteredProducts = [];

    const grid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    function renderProducts(products) {
        if (!grid) {
            console.error('Product grid not found');
            return;
        }

        if (!products || products.length === 0) {
            grid.innerHTML = `<div class="loading-placeholder">No products available</div>`;
            return;
        }

        allProducts = products;
        filteredProducts = [...products];
        applyFilters();
        console.log('✅ Rendered', products.length, 'products');
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category || '';

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
        if (oldPrice > price && oldPrice > 0) {
            discount = Math.round(((oldPrice - price) / oldPrice) * 100);
        }

        let imageUrl = product.image || 'assets/images/products/default.jpg';
        if (!imageUrl || imageUrl === '' || imageUrl === 'undefined') {
            imageUrl = 'assets/images/products/default.jpg';
        }

        card.innerHTML = `
            <div class="product-card-image">
                <img src="${imageUrl}" 
                     alt="${product.name || 'Product'}" 
                     onerror="this.onerror=null; this.src='assets/images/products/default.jpg'">
                ${stockBadge}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${product.name || 'Unnamed Product'}</h3>
                <div class="product-card-category">${product.category || 'Uncategorized'}</div>
                <div class="product-card-price">
                    <span class="current-price">$${price.toFixed(2)}</span>
                    ${oldPrice > price ? `<span class="old-price">$${oldPrice.toFixed(2)}</span>` : ''}
                </div>
                ${product.weight ? `<div class="product-card-weight">${product.weight}</div>` : ''}
                <div class="product-card-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="btn-wishlist" data-id="${product.id}">❤</button>
                    <a href="product-details.html?id=${product.id}" class="btn-view-details">View Details</a>
                </div>
            </div>
        `;
        return card;
    }

    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';

        filteredProducts = allProducts.filter(product => {
            const nameMatch = product.name ? product.name.toLowerCase().includes(searchTerm) : false;
            const categoryMatch = category === 'all' || product.category === category;
            return nameMatch && categoryMatch;
        });

        if (grid) {
            grid.innerHTML = '';
            if (filteredProducts.length === 0) {
                grid.innerHTML = `<div class="loading-placeholder">No products found</div>`;
            } else {
                filteredProducts.forEach(product => {
                    grid.appendChild(createProductCard(product));
                });
            }
        }

        const count = document.getElementById('product-count');
        if (count) {
            count.textContent = `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''}`;
        }

        console.log('✅ Filtered:', filteredProducts.length, 'products');
    }

    document.addEventListener('productsLoaded', function(e) {
        const products = e.detail ? e.detail.products : [];
        renderProducts(products);
    });

    window.applyFilters = applyFilters;
    window.renderProducts = renderProducts;
    console.log('✅ Product renderer initialized');
})();
