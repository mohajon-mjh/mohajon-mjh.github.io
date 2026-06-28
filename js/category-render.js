document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("categoryImages");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (!category || !window.CATEGORY_IMAGES) return;

  const images = window.CATEGORY_IMAGES[category] || [
    "https://via.placeholder.com/600x400?text=No+Image"
  ];

  container.innerHTML = "";

  images.forEach(img => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${img}" style="width:100%;max-width:400px;margin:10px;border-radius:10px;">
    `;
    container.appendChild(div);
  });

});
