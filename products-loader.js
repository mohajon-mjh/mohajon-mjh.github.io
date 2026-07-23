(function() {
    const db = window.db;
    if (!db) {
        console.error('Firebase not initialized');
        return;
    }

    let productsCache = [];

    function loadProducts() {
        const productsRef = db.ref('products');
        productsRef.once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                productsCache = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
            } else {
                productsCache = [];
            }
            
            const event = new CustomEvent('productsLoaded', {
                detail: { products: productsCache }
            });
            document.dispatchEvent(event);
            
            console.log('✅ Products loaded from Firebase:', productsCache.length);
        }, (error) => {
            console.error('Error loading products:', error);
        });
    }

    window.ProductsLoader = {
        loadProducts,
        getProducts: () => productsCache
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProducts);
    } else {
        loadProducts();
    }
})();
