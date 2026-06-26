function renderProducts(list, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = "";

  list.forEach(product => {
    const badge = product.badge
      ? `<span class="badge">${product.badge}</span>`
      : "";

    target.innerHTML += `
      <div class="product-card">
        ${badge}
        <div class="wishlist">❤</div>

        <img src="${product.image}" alt="${product.name}">

        <div class="product-info">
          <div class="product-category">${product.category}</div>

          <h3 class="product-title">${product.name}</h3>

          <div class="rating">
            ⭐ ${product.rating} (${product.reviews})
          </div>

          <div class="price-row">
            <span class="price">৳${product.price}</span>
            <span class="old-price">৳${product.oldPrice}</span>
          </div>

          <button class="cart-btn">Add To Cart</button>
        </div>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("trendingProducts")) {
    renderProducts(PRODUCTS, "trendingProducts");
  }

  if (document.getElementById("products")) {
    renderProducts(PRODUCTS, "products");
  }

});
