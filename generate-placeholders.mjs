import { readdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const CATEGORY_MAP = {
  "Agriculture, Food & Beverage": "agriculture_food_beverage",
  "Appliances (Home Appliances, Large & Small)": "appliances_home_appliances_large_small",
  "Art, Collectibles & Crafts": "art_collectibles_crafts",
  "Automotive, Vehicle Parts & Accessories": "automotive_vehicle_parts_accessories",
  "Baby Products, Baby Essentials": "baby_products_baby_essentials",
  "Beauty & Personal Care": "beauty_personal_care",
  "Books, Media & Music": "books_media_music",
  "Business & Industrial, Machinery": "business_industrial_machinery",
  "Cameras & Photo": "cameras_photo",
  "Clothing, Fashion & Apparel (Men, Women, Kids)": "clothing_fashion_apparel_men_women_kids",
  "Computers, Tablets & Networking": "computers_tablets_networking",
  "Construction & Building Materials": "construction_building_materials",
  "Consumer Electronics": "consumer_electronics",
  "Electrical Equipment & Supplies": "electrical_equipment_supplies",
  "Electronics (TV, Audio, Gaming, etc.)": "electronics_tv_audio_gaming",
  "Furniture & Home Decor": "furniture_home_decor",
  "Gardening & Outdoor Living": "gardening_outdoor_living",
  "Gifts & Crafts": "gifts_crafts",
  "Health & Medical Supplies": "health_medical_supplies",
  "Health & Wellness": "health_wellness",
  "Home & Kitchen": "home_kitchen",
  "Home Improvement, Tools & Hardware": "home_improvement_tools_hardware",
  "Industrial Machinery & Equipment": "industrial_machinery_equipment",
  "Jewelry, Eyewear & Watches": "jewelry_eyewear_watches",
  "Lighting & Lamps": "lighting_lamps",
  "Luggage, Bags & Cases": "luggage_bags_cases",
  "Office & School Supplies": "office_school_supplies",
  "Pet Supplies": "pet_supplies",
  "Renewable Energy": "renewable_energy",
  "Safety & Security": "safety_security",
  "Shoes & Accessories": "shoes_accessories",
  "Smart Home & Surveillance": "smart_home_surveillance",
  "Sports & Outdoors, Fitness": "sports_outdoors_fitness",
  "Toys, Games & Hobbies": "toys_games_hobbies",
  "Video Games & Consoles": "video_games_consoles",
  "Vehicles & Transportation": "vehicles_transportation",
  "Air Conditioners, Refrigerators, Washing Machines": "air_conditioners_refrigerators_washing_machines",
  "Mobile Phones & Accessories": "mobile_phones_accessories",
  "Laptops & PCs": "laptops_pcs",
  "Headphones, Speakers & Audio": "headphones_speakers_audio",
  "Makeup, Skincare & Fragrance": "makeup_skincare_fragrance",
  "Furniture (Sofas, Beds, etc.)": "furniture_sofas_beds_etc",
  "Power Tools & Hand Tools": "power_tools_hand_tools",
  "Drones & Action Cameras": "drones_action_cameras",
  "Bicycles, Scooters & Electric Vehicles": "bicycles_scooters_electric_vehicles"
};

const BASE_DIR = "assets/images/categories";
const now = 1782984093000;
let sku = 134; // continue after p0133

const products = {};

for (const [folderName, categoryId] of Object.entries(CATEGORY_MAP)) {
  const folderPath = join(BASE_DIR, folderName);
  if (!existsSync(folderPath)) {
    console.warn(`⚠️  Folder not found: ${folderName}`);
    continue;
  }

  const files = readdirSync(folderPath).filter(f => f.toLowerCase().endsWith(".png"));

  files.forEach((file, idx) => {
    const id = "p" + String(sku).padStart(4, "0");
    sku++;

    const label = idx === 0 ? folderName : `${folderName} (${idx + 1})`;

    products[id] = {
      sellerId: "admin",
      title: label,
      description: `${label} — product details to be completed by admin (image, description, and price pending).`,
      price: 100,
      stock: 10,
      categoryId: categoryId,
      netWeight: "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
      images: { main: `${BASE_DIR}/${folderName}/${file}` },
      sku: id
    };
  });
}

writeFileSync("data/products-placeholder.json", JSON.stringify(products, null, 2));
console.log(`✅ Generated ${Object.keys(products).length} placeholder products in data/products-placeholder.json`);
