(function() {
    const db = window.db;
    if (!db) {
        console.error('Firebase not initialized');
        return;
    }

    const PAGE_SIZE = 30;

    let productsCache = [];
    let lastKey = null;
    let hasMore = true;
    let currentCategory = null;
    let isLoading = false;

    // ক্যাটাগরি মোডে পুরো ম্যাচিং লিস্ট এখানে থাকবে, productsCache-এ ধাপে ধাপে দেখানো হবে
    let fullCategoryProducts = [];
    let categoryRenderedCount = 0;

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
            fullCategoryProducts = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
                : [];
            categoryRenderedCount = Math.min(PAGE_SIZE, fullCategoryProducts.length);
            productsCache = fullCategoryProducts.slice(0, categoryRenderedCount);
            hasMore = categoryRenderedCount < fullCategoryProducts.length;
            isLoading = false;
            console.log('✅ Category products loaded (total match):', fullCategoryProducts.length, '| দেখানো হচ্ছে:', productsCache.length);
            dispatchLoaded(true);
        }, (error) => {
            isLoading = false;
            console.error('Error loading category products:', error);
        });
    }

    function loadMoreCategoryProducts() {
        if (!hasMore || isLoading) return;
        categoryRenderedCount = Math.min(categoryRenderedCount + PAGE_SIZE, fullCategoryProducts.length);
        productsCache = fullCategoryProducts.slice(0, categoryRenderedCount);
        hasMore = categoryRenderedCount < fullCategoryProducts.length;
        console.log('✅ আরও ক্যাটাগরি প্রোডাক্ট দেখানো হচ্ছে, মোট:', productsCache.length);
        dispatchLoaded(false);
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
        if (isLoading) return;
        if (currentCategory && currentCategory !== 'all') {
            loadMoreCategoryProducts();
            return;
        }
        if (!hasMore) return;
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
