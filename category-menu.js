document.addEventListener("DOMContentLoaded", () => {

const categories = [
"Agriculture, Food & Beverage",
"Appliances (Home Appliances, Large & Small)",
"Art, Collectibles & Crafts",
"Automotive, Vehicle Parts & Accessories",
"Baby Products, Baby Essentials",
"Beauty & Personal Care",
"Books, Media & Music",
"Business & Industrial, Machinery",
"Cameras & Photo",
"Clothing, Fashion & Apparel (Men, Women, Kids)",
"Computers, Tablets & Networking",
"Construction & Building Materials",
"Consumer Electronics",
"Electrical Equipment & Supplies",
"Electronics (TV, Audio, Gaming, etc.)",
"Food & Grocery",
"Furniture & Home Decor",
"Gardening & Outdoor Living",
"Gifts & Crafts",
"Health & Medical Supplies",
"Health & Wellness",
"Home & Kitchen",
"Home Improvement, Tools & Hardware",
"Industrial Machinery & Equipment",
"Jewelry, Eyewear & Watches",
"Lighting & Lamps",
"Luggage, Bags & Cases",
"Office & School Supplies",
"Pet Supplies",
"Renewable Energy",
"Safety & Security",
"Shoes & Accessories",
"Smart Home & Surveillance",
"Sports & Outdoors, Fitness",
"Toys, Games & Hobbies",
"Video Games & Consoles",
"Vehicles & Transportation",
"Air Conditioners, Refrigerators, Washing Machines",
"Mobile Phones & Accessories",
"Laptops & PCs",
"Headphones, Speakers & Audio",
"Makeup, Skincare & Fragrance",
"Furniture (Sofas, Beds, etc.)",
"Power Tools & Hand Tools",
"Drones & Action Cameras",
"Bicycles, Scooters & Electric Vehicles"
];

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const categoryList = document.getElementById("categoryList");

if (categoryList) {
    categoryList.innerHTML = "";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat;

        li.onclick = () => {
            window.location.href =
                "products.html?category=" + encodeURIComponent(cat);
        };

        categoryList.appendChild(li);
    });
}

if (menuBtn && sideMenu) {
    menuBtn.onclick = () => {
        sideMenu.classList.toggle("active");
    };
}

});
