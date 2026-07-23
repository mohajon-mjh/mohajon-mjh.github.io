(function() {
    const db = window.db;
    if (!db) {
        console.error('Firebase not initialized');
        return;
    }

    const PAGE_SIZE = 24;

    let productsCache = [];
    let lastKey = null;
    let hasMore = true;
    let currentCategory = null;
    let isLoading = false;

    function getCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("categoryId");
    }

    function dispatchLoaded(reset) {
        const event = new CustomEvent('productsLoaded', {
            detail: { products: productsCache, hasMore, reset }
        });
        document.dispatchEvent(event);
    }

    function loadCategoryProducts(categoryId) {
        isLoading = true;
        const productsRef = db.ref('products');
        productsRef.orderByChild('categoryId').equalTo(categoryId).once('value', (snapshot) => {
            const data = snapshot.val();
            productsCache = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
                : [];
            hasMore = false;
            isLoading = false;
            console.log('✅ Category products loaded:', productsCache.length);
            dispatchLoaded(true);
        }, (error) => {
            isLoading = false;
            console.error('Error loading category products:', error);
        });
    }

    function loadFirstPage() {
        isLoading = true;
        const productsRef = db.ref('products');
        productsRef.orderByKey().limitToFirst(PAGE_SIZE).once('value', (snapshot) => {
            const data = snapshot.val();
            const keys = data ? Object.keys(data) : [];
            productsCache = keys.map(key => ({ id: key, ...data[key] }));
            lastKey = keys.length ? keys[keys.length - 1] : null;
            hasMore = keys.length === PAGE_SIZE;
            isLoading = false;
            console.log('✅ Products loaded (page 1):', productsCache.length);
            dispatchLoaded(true);
        }, (error) => {
            isLoading = false;
            console.error('Error loading products:', error);
        });
    }

    function loadMore() {
        if (!hasMore || isLoading || currentCategory) return;
        isLoading = true;
        const productsRef = db.ref('products');
        productsRef.orderByKey().startAfter(lastKey).limitToFirst(PAGE_SIZE).once('value', (snapshot) => {
            const data = snapshot.val();
            const keys = data ? Object.keys(data) : [];
            const newProducts = keys.map(key => ({ id: key, ...data[key] }));
            productsCache = productsCache.concat(newProducts);
            lastKey = keys.length ? keys[keys.length - 1] : lastKey;
            hasMore = keys.length === PAGE_SIZE;
            isLoading = false;
            console.log('✅ More products loaded, total:', productsCache.length);
            dispatchLoaded(false);
        }, (error) => {
            isLoading = false;
            console.error('Error loading more products:', error);
        });
    }

    function loadProducts() {
        currentCategory = getCategoryFromURL();
        if (currentCategory && currentCategory !== 'all') {
            loadCategoryProducts(currentCategory);
        } else {
            loadFirstPage();
        }
    }

    window.ProductsLoader = {
        loadProducts,
        loadMore,
        getProducts: () => productsCache,
        hasMore: () => hasMore
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProducts);
    } else {
        loadProducts();
    }
})();
