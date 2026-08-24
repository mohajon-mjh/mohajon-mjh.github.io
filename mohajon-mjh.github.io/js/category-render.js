document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("categoryImages");
  if (!container) return;

  const category = decodeURIComponent(
    new URLSearchParams(window.location.search).get("category") || ""
  );

  const images =
    window.CATEGORY_IMAGES &&
    window.CATEGORY_IMAGES[category];

  if (!images || images.length === 0) {
    container.innerHTML = "<h3>No images found</h3>";
    return;
  }

  container.innerHTML = images
    .map(img => `<img src="${img}" style="width:100%;max-width:400px;margin:10px;border-radius:10px;">`)
    .join("");

});
