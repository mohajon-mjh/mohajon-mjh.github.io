const categories = [
"Agriculture, Food & Beverage",
"Appliances (Home Appliances, Large & Small)",
"Art, Collectibles & Crafts",
"Automotive / Vehicle Parts & Accessories",
"Baby Products / Baby Essentials",
"Beauty & Personal Care",
"Books, Media & Music",
"Business & Industrial / Machinery",
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
"Home Improvement / Tools & Hardware",
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
"Sports & Outdoors / Fitness",
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

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.createElement("div");
    btn.className = "hamburger";
    btn.innerHTML = "☰";

    const menu = document.createElement("nav");
    menu.className = "side-menu";

    let html = "<h2>All Categories</h2><ul>";

    categories.forEach(c=>{
        html += `<li onclick="location.href='products.html?category=${encodeURIComponent(c)}'">${c}</li>`;
    });

    html += "</ul>";

    menu.innerHTML = html;

    document.body.appendChild(btn);
    document.body.appendChild(menu);

    btn.onclick = ()=>{
        menu.classList.toggle("active");
    };

    document.addEventListener("click",(e)=>{
        if(!menu.contains(e.target) && !btn.contains(e.target)){
            menu.classList.remove("active");
        }
    });

});
