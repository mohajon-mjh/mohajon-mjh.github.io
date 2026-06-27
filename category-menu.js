const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");

if (menuBtn && sideMenu) {
    menuBtn.addEventListener("click", () => {
        sideMenu.classList.toggle("active");
    });
}

document.querySelectorAll("#categoryList li").forEach(item => {
    item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        window.location.href = `products.html?category=${encodeURIComponent(category)}`;
    });
});
