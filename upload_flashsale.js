const fs = require('fs');
const path = require('path');
const os = require('os');

const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const CLOUD_NAME = "fd70754d";
const UPLOAD_PRESET = "mohajon-mjh";

const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const IMAGE_DIR = path.join(os.homedir(), "storage/downloads/mohajon-mjh/assets/images/categories/Flash Sale");

const products = [
  { title: "Premium Basmati Rice (5 kg)", price: 1650, categoryId: "agriculture_food_beverage", file: "premium_basmati_rice_5kg.png" },
  { title: "Smart Air Fryer", price: 8900, categoryId: "appliances_home_appliances_large_small", file: "smart_air_fryer.png" },
  { title: "Handmade Wall Art Painting", price: 2750, categoryId: "art_collectibles_crafts", file: "handmade_wall_art_painting.png" },
  { title: "Car Door Visor Set", price: 2200, categoryId: "automotive_vehicle_parts_accessories", file: "car_door_visor_set.png" },
  { title: "3-in-1 Baby Stroller", price: 12500, categoryId: "baby_products_baby_essentials", file: "baby_stroller_3_in_1.png" },
  { title: "Facial Serum Set", price: 2850, categoryId: "beauty_personal_care", file: "facial_serum_set.png" },
  { title: "Bestselling Novel Collection", price: 1950, categoryId: "books_media_music", file: "bestselling_novel_collection.png" },
  { title: "Mini Air Compressor", price: 5800, categoryId: "business_industrial_machinery", file: "mini_air_compressor.png" },
  { title: "4K Action Camera", price: 12900, categoryId: "cameras_photo", file: "4k_action_camera.png" },
  { title: "Premium Cotton Panjabi", price: 1890, categoryId: "clothing_fashion_apparel_men_women_kids", file: "premium_cotton_panjabi.png" },
  { title: "Wireless Keyboard & Mouse Combo", price: 2750, categoryId: "computers_tablets_networking", file: "wireless_keyboard_mouse_combo.png" },
  { title: "Ceramic Floor Tiles", price: 95, categoryId: "construction_building_materials", file: "ceramic_floor_tiles.png" },
  { title: "20,000mAh Power Bank", price: 2490, categoryId: "consumer_electronics", file: "power_bank_20000mah.png" },
  { title: "LED Switch Board Set", price: 890, categoryId: "electrical_equipment_supplies", file: "led_switch_board_set.png" },
  { title: "43-inch Smart TV", price: 34900, categoryId: "electronics_tv_audio_gaming", file: "43_inch_smart_tv.png" },
  { title: "Dates Gift Box", price: 1750, categoryId: "food_grocery", file: "dates_gift_box.png" },
  { title: "Designer Wall Shelf", price: 3200, categoryId: "furniture_home_decor", file: "designer_wall_shelf.png" },
  { title: "Garden Tool Set", price: 2950, categoryId: "gardening_outdoor_living", file: "garden_tool_set.png" },
  { title: "Couple Gift Hamper", price: 2450, categoryId: "gifts_crafts", file: "couple_gift_hamper.png" },
  { title: "Digital Blood Pressure Monitor", price: 2650, categoryId: "health_medical_supplies", file: "digital_blood_pressure_monitor.png" },
  { title: "Whey Protein Powder", price: 4800, categoryId: "health_wellness", file: "whey_protein_powder.png" },
  { title: "Non-Stick Cookware Set", price: 5900, categoryId: "home_kitchen", file: "non_stick_cookware_set.png" },
  { title: "Cordless Drill Machine", price: 7500, categoryId: "home_improvement_tools_hardware", file: "cordless_drill_machine.png" },
  { title: "Mini Welding Machine", price: 9800, categoryId: "industrial_machinery_equipment", file: "mini_welding_machine.png" },
  { title: "Rose Gold Ladies Watch", price: 2950, categoryId: "jewelry_eyewear_watches", file: "rose_gold_ladies_watch.png" },
  { title: "Remote Control Ceiling Light", price: 3850, categoryId: "lighting_lamps", file: "remote_control_ceiling_light.png" },
  { title: "24-inch Trolley Luggage", price: 5900, categoryId: "luggage_bags_cases", file: "24_inch_trolley_luggage.png" },
  { title: "Premium Notebook Set", price: 750, categoryId: "office_school_supplies", file: "premium_notebook_set.png" },
  { title: "Dog Food (3 kg)", price: 1850, categoryId: "pet_supplies", file: "dog_food_3kg.png" },
  { title: "Solar Charger Panel", price: 6500, categoryId: "renewable_energy", file: "solar_charger_panel.png" },
  { title: "CCTV Camera Kit", price: 8900, categoryId: "safety_security", file: "cctv_camera_kit.png" },
  { title: "Sports Sneakers", price: 3500, categoryId: "shoes_accessories", file: "sports_sneakers.png" },
  { title: "Smart Door Lock", price: 11900, categoryId: "smart_home_surveillance", file: "smart_door_lock.png" },
  { title: "Yoga Mat", price: 1250, categoryId: "sports_outdoors_fitness", file: "yoga_mat.png" },
  { title: "Remote Control Car", price: 2850, categoryId: "toys_games_hobbies", file: "remote_control_car.png" },
  { title: "Gaming Controller", price: 4200, categoryId: "video_games_consoles", file: "gaming_controller.png" },
  { title: "Electric Bicycle", price: 85000, categoryId: "vehicles_transportation", file: "electric_bicycle.png" },
  { title: "1.5 Ton Split Air Conditioner", price: 58500, categoryId: "air_conditioners_refrigerators_washing_machines", file: "1_5_ton_split_air_conditioner.png" },
  { title: "Wireless Earbuds", price: 2950, categoryId: "mobile_phones_accessories", file: "wireless_earbuds.png" },
  { title: "Gaming Laptop", price: 145000, categoryId: "laptops_pcs", file: "gaming_laptop.png" },
  { title: "Bluetooth Speaker", price: 3200, categoryId: "headphones_speakers_audio", file: "bluetooth_speaker.png" },
  { title: "Lipstick Set (6 Pieces)", price: 1250, categoryId: "makeup_skincare_fragrance", file: "lipstick_set_6_pieces.png" },
  { title: "3-Seater Sofa", price: 38500, categoryId: "furniture_sofas_beds_etc", file: "3_seater_sofa.png" },
  { title: "Cordless Screwdriver", price: 3850, categoryId: "power_tools_hand_tools", file: "cordless_screwdriver.png" },
  { title: "Mini Drone with Camera", price: 8900, categoryId: "drones_action_cameras", file: "mini_drone_with_camera.png" },
  { title: "Electric Scooter", price: 125000, categoryId: "bicycles_scooters_electric_vehicles", file: "electric_scooter.png" },
  { title: "Refurbished Smartphone", price: 22500, categoryId: "-Oyxb9C2sczQEh7NA2Ez", file: "refurbished_smartphone.png" },
  { title: "Acoustic Guitar", price: 9800, categoryId: "-Oyxb9G7jRs3ebu4aApZ", file: "acoustic_guitar.png" },
  { title: "Refill Ink Bottle (4-Color Set)", price: 1450, categoryId: "-Oyxb9KLNTILlB5DCJ05", file: "refill_ink_bottle_4_color_set.png" },
  { title: "Eid Gift Hamper", price: 2250, categoryId: "-Oyxb9OPyv4nTfQOslVE", file: "eid_gift_hamper.png" },
  { title: "Tasbih & Prayer Mat Set", price: 1150, categoryId: "-Oyxb9SZBPl644MoQZq7", file: "tasbih_prayer_mat_set.png" },
  { title: "LED Wedding Stage Decoration", price: 24500, categoryId: "-Oyxb9WqJTNvJ22w4Ta7", file: "led_wedding_stage_decoration.png" }
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
  const existingFlashSaleTitles = new Set();
  let deleteCount = 0;

  for(const key of Object.keys(allData)){
    const p = allData[key];
    if(p && p.isFlashSale === true){
      if(newTitles.has(p.title)){
        existingFlashSaleTitles.add(p.title);
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
    if(existingFlashSaleTitles.has(p.title)){
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
        isFlashSale: true,
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
