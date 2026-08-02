with open("products-loader.js", "r", encoding="utf-8") as f:
    content = f.read()

report = []

def replace_once(content, old, new, label):
    n = content.count(old)
    if n != 1:
        report.append(f"❌ {label}: {n} বার পাওয়া গেছে (দরকার ১ বার) — SKIP")
        return content, False
    content = content.replace(old, new, 1)
    report.append(f"✅ {label}: যোগ হয়েছে")
    return content, True

# 1. Add flashSale URL getter + state vars, right after getCategoryFromURL
old1 = '''    function getCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("categoryId");
    }'''
new1 = old1 + '''

    function getFlashSaleFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("flashSale") === "true";
    }

    let isFlashSaleMode = false;
    let fullFlashSaleProducts = [];
    let flashSaleRenderedCount = 0;

    function loadFlashSaleProducts() {
        isLoading = true;
        const productsRef = db.ref('products');
        productsRef.orderByChild('isFlashSale').equalTo(true).once('value', (snapshot) => {
            const data = snapshot.val();
            fullFlashSaleProducts = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
                : [];
            flashSaleRenderedCount = Math.min(PAGE_SIZE, fullFlashSaleProducts.length);
            productsCache = fullFlashSaleProducts.slice(0, flashSaleRenderedCount);
            hasMore = flashSaleRenderedCount < fullFlashSaleProducts.length;
            isLoading = false;
            console.log('✅ Flash Sale products loaded (total match):', fullFlashSaleProducts.length, '| দেখানো হচ্ছে:', productsCache.length);
            dispatchLoaded(true);
        }, (error) => {
            isLoading = false;
            console.error('Error loading flash sale products:', error);
        });
    }

    function loadMoreFlashSaleProducts() {
        if (!hasMore || isLoading) return;
        flashSaleRenderedCount = Math.min(flashSaleRenderedCount + PAGE_SIZE, fullFlashSaleProducts.length);
        productsCache = fullFlashSaleProducts.slice(0, flashSaleRenderedCount);
        hasMore = flashSaleRenderedCount < fullFlashSaleProducts.length;
        console.log('✅ আরও Flash Sale প্রোডাক্ট দেখানো হচ্ছে, মোট:', productsCache.length);
        dispatchLoaded(false);
    }'''
content, ok1 = replace_once(content, old1, new1, "getFlashSaleFromURL + state + load functions")

# 2. loadMore(): handle flash sale mode first
old2 = '''    function loadMore() {
        if (isLoading) return;
        if (currentCategory && currentCategory !== 'all') {
            loadMoreCategoryProducts();
            return;
        }'''
new2 = '''    function loadMore() {
        if (isLoading) return;
        if (isFlashSaleMode) {
            loadMoreFlashSaleProducts();
            return;
        }
        if (currentCategory && currentCategory !== 'all') {
            loadMoreCategoryProducts();
            return;
        }'''
content, ok2 = replace_once(content, old2, new2, "loadMore() flash sale branch")

# 3. loadProducts(): check flashSale param first
old3 = '''    function loadProducts() {
        currentCategory = getCategoryFromURL();
        if (currentCategory && currentCategory !== 'all') {
            loadCategoryProducts(currentCategory);
        } else {
            loadFirstPage();
        }
    }'''
new3 = '''    function loadProducts() {
        isFlashSaleMode = getFlashSaleFromURL();
        if (isFlashSaleMode) {
            loadFlashSaleProducts();
            return;
        }
        currentCategory = getCategoryFromURL();
        if (currentCategory && currentCategory !== 'all') {
            loadCategoryProducts(currentCategory);
        } else {
            loadFirstPage();
        }
    }'''
content, ok3 = replace_once(content, old3, new3, "loadProducts() flash sale check")

with open("products-loader.js", "w", encoding="utf-8") as f:
    f.write(content)

print("\n".join(report))
