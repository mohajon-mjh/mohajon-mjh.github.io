const fs = require('fs');
const path = require('path');
const os = require('os');

const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const CLOUD_NAME = "fd70754d";
const UPLOAD_PRESET = "mohajon-mjh";

const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const IMAGE_DIR = path.join(os.homedir(), "storage/downloads/mohajon-mjh/assets/images/categories/Tranding Products");

const products = [
  { title: "Premium Extra Virgin Olive Oil", price: 2250, categoryId: "agriculture_food_beverage", file: "premium_extra_virgin_olive_oil.png" },
  { title: "Robot Vacuum Cleaner", price: 34900, categoryId: "appliances_home_appliances_large_small", file: "robot_vacuum_cleaner.png" },
  { title: "Resin Art Table Clock", price: 2850, categoryId: "art_collectibles_crafts", file: "resin_art_table_clock.png" },
  { title: "Portable Car Jump Starter", price: 8500, categoryId: "automotive_vehicle_parts_accessories", file: "portable_car_jump_starter.png" },
  { title: "Electric Baby Bottle Warmer", price: 4200, categoryId: "baby_products_baby_essentials", file: "electric_baby_bottle_warmer.png" },
  { title: "LED Face Mask", price: 7900, categoryId: "beauty_personal_care", file: "led_face_mask.png" },
  { title: "Motivational Book Collection", price: 2500, categoryId: "books_media_music", file: "motivational_book_collection.png" },
  { title: "Portable Label Printer", price: 5900, categoryId: "business_industrial_machinery", file: "portable_label_printer.png" },
  { title: "Smartphone Gimbal Stabilizer", price: 11500, categoryId: "cameras_photo", file: "smartphone_gimbal_stabilizer.png" },
  { title: "Oversized Graphic T-Shirt", price: 1290, categoryId: "clothing_fashion_apparel_men_women_kids", file: "oversized_graphic_t_shirt.png" },
  { title: "Mechanical Gaming Keyboard", price: 6800, categoryId: "computers_tablets_networking", file: "mechanical_gaming_keyboard.png" },
  { title: "Waterproof Wall Panel", price: 2200, categoryId: "construction_building_materials", file: "waterproof_wall_panel.png" },
  { title: "Smart Watch", price: 5500, categoryId: "consumer_electronics", file: "smart_watch.png" },
  { title: "Smart Wi-Fi Switch", price: 1650, categoryId: "electrical_equipment_supplies", file: "smart_wifi_switch.png" },
  { title: "Android TV Box", price: 4900, categoryId: "electronics_tv_audio_gaming", file: "android_tv_box.png" },
  { title: "Organic Honey", price: 1450, categoryId: "food_grocery", file: "organic_honey.png" },
  { title: "Ergonomic Office Chair", price: 18500, categoryId: "furniture_home_decor", file: "ergonomic_office_chair.png" },
  { title: "Vertical Garden Planter", price: 2850, categoryId: "gardening_outdoor_living", file: "vertical_garden_planter.png" },
  { title: "Personalized Photo Frame", price: 1350, categoryId: "gifts_crafts", file: "personalized_photo_frame.png" },
  { title: "Fingertip Pulse Oximeter", price: 2250, categoryId: "health_medical_supplies", file: "fingertip_pulse_oximeter.png" },
  { title: "Collagen Peptides Powder", price: 4800, categoryId: "health_wellness", file: "collagen_peptides_powder.png" },
  { title: "Digital Kitchen Scale", price: 1650, categoryId: "home_kitchen", file: "digital_kitchen_scale.png" },
  { title: "Laser Distance Meter", price: 4900, categoryId: "home_improvement_tools_hardware", file: "laser_distance_meter.png" },
  { title: "Portable Pressure Washer", price: 9800, categoryId: "industrial_machinery_equipment", file: "portable_pressure_washer.png" },
  { title: "Stainless Steel Bracelet", price: 1450, categoryId: "jewelry_eyewear_watches", file: "stainless_steel_bracelet.png" },
  { title: "Rechargeable LED Table Lamp", price: 2350, categoryId: "lighting_lamps", file: "rechargeable_led_table_lamp.png" },
  { title: "Anti-Theft Backpack", price: 3200, categoryId: "luggage_bags_cases", file: "anti_theft_backpack.png" },
  { title: "Erasable Gel Pen Set", price: 650, categoryId: "office_school_supplies", file: "erasable_gel_pen_set.png" },
  { title: "Automatic Pet Feeder", price: 7500, categoryId: "pet_supplies", file: "automatic_pet_feeder.png" },
  { title: "Portable Solar Generator", price: 65000, categoryId: "renewable_energy", file: "portable_solar_generator.png" },
  { title: "Smart Video Doorbell", price: 8900, categoryId: "safety_security", file: "smart_video_doorbell.png" },
  { title: "Running Shoes", price: 3800, categoryId: "shoes_accessories", file: "running_shoes.png" },
  { title: "Smart Security Hub", price: 12500, categoryId: "smart_home_surveillance", file: "smart_security_hub.png" },
  { title: "Adjustable Dumbbell Set", price: 16500, categoryId: "sports_outdoors_fitness", file: "adjustable_dumbbell_set.png" },
  { title: "Building Blocks Set", price: 2400, categoryId: "toys_games_hobbies", file: "building_blocks_set.png" },
  { title: "VR Headset", price: 24900, categoryId: "video_games_consoles", file: "vr_headset.png" },
  { title: "Electric Motorcycle", price: 285000, categoryId: "vehicles_transportation", file: "electric_motorcycle.png" },
  { title: "Front Load Washing Machine", price: 58900, categoryId: "air_conditioners_refrigerators_washing_machines", file: "front_load_washing_machine (1).png" },
  { title: "Magnetic Wireless Charger", price: 2200, categoryId: "mobile_phones_accessories", file: "magnetic_wireless_charger.png" },
  { title: "AI Copilot Laptop", price: 165000, categoryId: "laptops_pcs", file: "ai_copilot_laptop.png" },
  { title: "Noise-Cancelling Headphones", price: 12900, categoryId: "headphones_speakers_audio", file: "noise_cancelling_headphones.png" },
  { title: "Cushion Foundation", price: 1850, categoryId: "makeup_skincare_fragrance", file: "cushion_foundation.png" },
  { title: "Storage Bed", price: 42500, categoryId: "furniture_sofas_beds_etc", file: "storage_bed.png" },
  { title: "Cordless Angle Grinder", price: 8900, categoryId: "power_tools_hand_tools", file: "cordless_angle_grinder.png" },
  { title: "FPV Racing Drone", price: 48000, categoryId: "drones_action_cameras", file: "fpv_racing_drone.png" },
  { title: "Electric Balance Bike", price: 38500, categoryId: "bicycles_scooters_electric_vehicles", file: "electric_balance_bike.png" },
  { title: "Refurbished MacBook", price: 98000, categoryId: "-Oyxb9C2sczQEh7NA2Ez", file: "refurbished_macbook.png" },
  { title: "Digital Piano", price: 68000, categoryId: "-Oyxb9G7jRs3ebu4aApZ", file: "digital_piano.png" },
  { title: "Wireless Thermal Label Printer", price: 7900, categoryId: "-Oyxb9KLNTILlB5DCJ05", file: "wireless_thermal_label_printer.png" },
  { title: "Ramadan Lantern Set", price: 1650, categoryId: "-Oyxb9OPyv4nTfQOslVE", file: "ramadan_lantern_set.png" },
  { title: "Digital Tasbih Counter", price: 450, categoryId: "-Oyxb9SZBPl644MoQZq7", file: "digital_tasbih_counter.png" },
  { title: "Floral Wedding Arch", price: 18500, categoryId: "-Oyxb9WqJTNvJ22w4Ta7", file: "floral_wedding_arch.png" }
];

async function uploadImage(filePath){
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer]);
  const formData = new FormData();
  formData.append("file", blob, path.basename(filePath));
  formData.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  if(!res.ok) throw new Error(JSON.stringify(data));
  return data.secure_url;
}

async function main(){
  const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const authData = await authRes.json();
  if(!authRes.ok){
    console.error("❌ Login failed:", JSON.stringify(authData));
    process.exit(1);
  }
  const idToken = authData.idToken;
  const uid = authData.localId;
  console.log("✅ Logged in as admin, uid:", uid);

  console.log("🔍 আগের সব প্রোডাক্ট চেক করা হচ্ছে...");
  const allRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const allData = (await allRes.json()) || {};

  const newTitles = new Set(products.map(p => p.title));
  const existingTrendingTitles = new Set();
  let deleteCount = 0;

  for(const key of Object.keys(allData)){
    const p = allData[key];
    if(p && p.isTrending === true){
      if(newTitles.has(p.title)){
        existingTrendingTitles.add(p.title);
      } else {
        try{
          const delRes = await fetch(`${DB_URL}/products/${key}.json?auth=${idToken}`, { method: "DELETE" });
          if(delRes.ok){
            console.log(`🗑️ ডিলিট করা হলো (নতুন লিস্টে নেই): ${p.title}`);
            deleteCount++;
          } else {
            console.error(`❌ ডিলিট ব্যর্থ: ${p.title}`);
          }
        }catch(err){
          console.error(`❌ ডিলিট এরর: ${p.title} — ${err.message}`);
        }
      }
    }
  }
  console.log(`🗑️ মোট ডিলিট হয়েছে: ${deleteCount}\n`);
  console.log(`মোট ${products.length}টার মধ্যে নতুনগুলো আপলোড শুরু হচ্ছে...\n`);

  let successCount = 0, failCount = 0, skipCount = 0;

  for(const p of products){
    if(existingTrendingTitles.has(p.title)){
      console.log(`⏭️ স্কিপ (আগে থেকেই আছে): ${p.title}`);
      skipCount++;
      continue;
    }
    try{
      const filePath = path.join(IMAGE_DIR, p.file);
      if(!fs.existsSync(filePath)){
        console.error(`❌ ${p.title}: ফাইল পাওয়া যায়নি (${p.file})`);
        failCount++;
        continue;
      }
      const imageUrl = await uploadImage(filePath);

      const productData = {
        title: p.title,
        price: p.price,
        stock: 20,
        categoryId: p.categoryId,
        sellerId: uid,
        status: "active",
        isTrending: true,
        images: { main: imageUrl },
        createdAt: Date.now()
      };

      const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if(!res.ok){
        console.error(`❌ ${p.title}: ${JSON.stringify(data)}`);
        failCount++;
        continue;
      }
      console.log(`✅ ${p.title} => ৳${p.price}`);
      successCount++;
    }catch(err){
      console.error(`❌ ${p.title}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nসম্পন্ন। নতুন যোগ: ${successCount}, স্কিপ: ${skipCount}, ব্যর্থ: ${failCount}, পুরনো ডিলিট: ${deleteCount}`);
}

main().catch(err => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
