document.addEventListener("DOMContentLoaded", () => {

  const categories = [
    ["Agriculture, Food & Beverage", "agriculture_food_beverage"],
    ["Appliances (Home Appliances, Large & Small)", "appliances_home_appliances_large_small"],
    ["Art, Collectibles & Crafts", "art_collectibles_crafts"],
    ["Automotive, Vehicle Parts & Accessories", "automotive_vehicle_parts_accessories"],
    ["Baby Products, Baby Essentials", "baby_products_baby_essentials"],
    ["Beauty & Personal Care", "beauty_personal_care"],
    ["Books, Media & Music", "books_media_music"],
    ["Business & Industrial, Machinery", "business_industrial_machinery"],
    ["Cameras & Photo", "cameras_photo"],
    ["Clothing, Fashion & Apparel (Men, Women, Kids)", "clothing_fashion_apparel_men_women_kids"],
    ["Computers, Tablets & Networking", "computers_tablets_networking"],
    ["Construction & Building Materials", "construction_building_materials"],
    ["Consumer Electronics", "consumer_electronics"],
    ["Electrical Equipment & Supplies", "electrical_equipment_supplies"],
    ["Electronics (TV, Audio, Gaming, etc.)", "electronics_tv_audio_gaming"],
    ["Food & Grocery", "food_grocery"],
    ["Furniture & Home Decor", "furniture_home_decor"],
    ["Gardening & Outdoor Living", "gardening_outdoor_living"],
    ["Gifts & Crafts", "gifts_crafts"],
    ["Health & Medical Supplies", "health_medical_supplies"],
    ["Health & Wellness", "health_wellness"],
    ["Home & Kitchen", "home_kitchen"],
    ["Home Improvement, Tools & Hardware", "home_improvement_tools_hardware"],
    ["Industrial Machinery & Equipment", "industrial_machinery_equipment"],
    ["Jewelry, Eyewear & Watches", "jewelry_eyewear_watches"],
    ["Lighting & Lamps", "lighting_lamps"],
    ["Luggage, Bags & Cases", "luggage_bags_cases"],
    ["Office & School Supplies", "office_school_supplies"],
    ["Pet Supplies", "pet_supplies"],
    ["Renewable Energy", "renewable_energy"],
    ["Safety & Security", "safety_security"],
    ["Shoes & Accessories", "shoes_accessories"],
    ["Smart Home & Surveillance", "smart_home_surveillance"],
    ["Sports & Outdoors, Fitness", "sports_outdoors_fitness"],
    ["Toys, Games & Hobbies", "toys_games_hobbies"],
    ["Video Games & Consoles", "video_games_consoles"],
    ["Vehicles & Transportation", "vehicles_transportation"],
    ["Air Conditioners, Refrigerators, Washing Machines", "air_conditioners_refrigerators_washing_machines"],
    ["Mobile Phones & Accessories", "mobile_phones_accessories"],
    ["Laptops & PCs", "laptops_pcs"],
    ["Headphones, Speakers & Audio", "headphones_speakers_audio"],
    ["Makeup, Skincare & Fragrance", "makeup_skincare_fragrance"],
    ["Furniture (Sofas, Beds, etc.)", "furniture_sofas_beds_etc"],
    ["Power Tools & Hand Tools", "power_tools_hand_tools"],
    ["Drones & Action Cameras", "drones_action_cameras"],
    ["Bicycles, Scooters & Electric Vehicles", "bicycles_scooters_electric_vehicles"]
  ];

  // Use existing static markup if present; otherwise create it once.
  let menuBtn = document.getElementById("menuBtn");
  let sideMenu = document.getElementById("sideMenu");
  let categoryList = document.getElementById("categoryList");

  if (!menuBtn) {
    menuBtn = document.createElement("div");
    menuBtn.id = "menuBtn";
    menuBtn.className = "hamburger";
    menuBtn.innerHTML = "☰";
    document.body.appendChild(menuBtn);
  }

  if (!sideMenu) {
    sideMenu = document.createElement("nav");
    sideMenu.id = "sideMenu";
    sideMenu.className = "side-menu";
    sideMenu.innerHTML = "<h3>Categories</h3><ul id=\"categoryList\"></ul>";
    document.body.appendChild(sideMenu);
    categoryList = document.getElementById("categoryList");
  }

  if (!categoryList) {
    categoryList = document.createElement("ul");
    categoryList.id = "categoryList";
    sideMenu.appendChild(categoryList);
  }

  // 🏪 Seller/Admin quick links (মেনুর একদম উপরে, সবসময় দৃশ্যমান)
  if (!document.getElementById("quickLinksBox")) {
    const quickBox = document.createElement("div");
    quickBox.id = "quickLinksBox";
    quickBox.style.padding = "10px";
    quickBox.style.borderBottom = "2px solid #ddd";
    quickBox.style.marginBottom = "10px";
    quickBox.innerHTML = `
      <a href="become-seller.html" style="display:block;padding:8px 0;color:#28a745;font-weight:bold;text-decoration:none;">🏪 Become a Seller</a>
      <a href="seller-dashboard.html" style="display:block;padding:8px 0;color:#007bff;font-weight:bold;text-decoration:none;">📊 Seller Dashboard</a>
      <a href="admin.html" style="display:block;padding:8px 0;color:#dc3545;font-weight:bold;text-decoration:none;">🔧 Admin Panel</a>
    `;
    sideMenu.insertBefore(quickBox, sideMenu.firstChild);
  }

  categoryList.innerHTML = "";
  categories.forEach(([name, id]) => {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => {
      window.location.href = "products.html?categoryId=" + encodeURIComponent(id);
    });
    categoryList.appendChild(li);
  });

  // 🏪 Seller quick link (সব পেজে একবার যোগ হবে)
  if (!document.getElementById("sellerMenuLink")) {
    const sellerLink = document.createElement("a");
    sellerLink.id = "sellerMenuLink";
    sellerLink.href = "become-seller.html";
    sellerLink.textContent = "🏪 Become a Seller";
    sellerLink.style.display = "block";
    sellerLink.style.padding = "10px";
    sellerLink.style.borderTop = "1px solid #ddd";
    sellerLink.style.marginTop = "10px";
    sellerLink.style.textDecoration = "none";
    sellerLink.style.color = "#28a745";
    sellerLink.style.fontWeight = "bold";
    sideMenu.appendChild(sellerLink);
  }

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sideMenu.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      sideMenu.classList.remove("active");
    }
  });

});
