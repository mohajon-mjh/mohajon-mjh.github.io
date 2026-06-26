document.addEventListener("DOMContentLoaded", () => {
    if (typeof PRODUCTS !== "undefined") {
        renderProducts(PRODUCTS, "products");
    }
});
