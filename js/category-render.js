document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("categoryImages");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  let category = params.get("category");

  if (!category) {
    container.innerHTML = "<h3>Category not found</h3>";
    return;
  }

  // FIX: decode URL properly
  category = decodeURIComponent(category.trim());

  console.log("Selected Category:", category);

  const images = (window.CATEGORY_IMAGES && window.CATEGORY_IMAGES[category])
    ? window.CATEGORY_IMAGES[category]
    : [];

  if (images.length === 0) {
    container.innerHTML = "<h3>Loading products...</h3>";
    return;
  }

  container.innerHTML = "";

  images.forEach(img => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${img}" style="width:100%;max-width:400px;margin:10px;border-radius:10px;">
    `;
    container.appendChild(div);
  });

});
