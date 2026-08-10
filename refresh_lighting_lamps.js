const fs = require('fs');
const path = require('path');
const os = require('os');

const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const CLOUD_NAME = "fd70754d";
const UPLOAD_PRESET = "mohajon-mjh";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";
const SELLER_ID = "SqVK0FFNFietVqov8la6hwSAF023";

const BASE_IMAGE_DIR = path.join(os.homedir(), "storage/downloads/mohajon-mjh/assets/images/categories");
const FOLDER = "Lighting & Lamps";
const CATEGORY_ID = "lighting_lamps";

const products = [
  {title:"Angle Holder",price:180},{title:"Armoured Cable",price:8500},{title:"B22 Holder",price:120},
  {title:"Batten Holder",price:150},{title:"Bell Transformer",price:850},{title:"Cable Clip",price:150},
  {title:"Cable Gland",price:250},{title:"Cable Tie 100mm",price:80},{title:"Cable Tie 150mm",price:120},
  {title:"Cable Tie 200mm",price:160},{title:"Cable Tie 250mm",price:220},{title:"Cable Tie 300mm",price:280},
  {title:"Ceiling Fan",price:3800},{title:"Changeover Switch",price:2500},{title:"Coaxial Cable",price:2800},
  {title:"Connector Strip",price:180},{title:"Contactor",price:2200},{title:"Coupler",price:150},
  {title:"Cube Adapter",price:450},{title:"Digital Multimeter",price:1650},{title:"Distribution Board",price:2800},
  {title:"Door Bell",price:650},{title:"Double Sided Tape",price:250},{title:"Down Light",price:650},
  {title:"E27 Holder",price:150},{title:"Emergency Light",price:1500},{title:"Exhaust Fan",price:2800},
  {title:"Extension Board",price:950},{title:"Fan Box",price:180},{title:"Fan Capacitor MK",price:280},
  {title:"Fan Hook",price:120},{title:"Fan Regulator",price:650},{title:"Ferrule",price:150},
  {title:"Flexible Cable",price:1800},{title:"Flood Light",price:2500},{title:"Heat Shrink Tube",price:350},
  {title:"Indicator Lamp",price:180},{title:"Industrial Socket",price:1250},{title:"Inspection Box",price:450},
  {title:"Isolator",price:1200},{title:"Junction Box",price:300},{title:"LAN Cable",price:1200},
  {title:"LED Bulb",price:180},{title:"LED Tube",price:650},{title:"Lighting Lamps",price:950},
  {title:"Line Tester",price:180},{title:"Lug Terminal",price:250},{title:"MCB",price:450},
  {title:"MCB Box",price:650},{title:"MCCB",price:3800},{title:"Motion Sensor",price:650},
  {title:"Multi Plug",price:450},{title:"Neon Tester",price:150},{title:"Night Lamp",price:450},
  {title:"Panel Light",price:1800},{title:"Pedestal Fan",price:4500},{title:"Pendant Holder",price:180},
  {title:"Photo Cell Sensor",price:850},{title:"Power Strip",price:950},{title:"Push Button",price:180},
  {title:"PVC Bend",price:80},{title:"PVC Conduit Pipe",price:220},{title:"PVC Insulation Tape",price:60},
  {title:"RCBO",price:1450},{title:"RCCB",price:1650},{title:"Relay",price:550},
  {title:"Saddle Clip",price:100},{title:"Selector Switch",price:450},{title:"Single Core Wire",price:2200},
  {title:"Spike Guard",price:750},{title:"Spot Light",price:1500},{title:"Street Light",price:4500},
  {title:"Table Fan",price:2800},{title:"Table Lamp Pendant Light",price:1800},{title:"Telephone Cable",price:850},
  {title:"Terminal Block",price:250},{title:"Timer Switch",price:1200},{title:"Tube Light",price:700},
  {title:"Twin Cable",price:2800},{title:"Voltage Tester",price:450},{title:"Wall Fan",price:3500},
  {title:"Wire Connector",price:250},
  {title:"Aquarium LED Light",price:1800},{title:"Ballast",price:800},{title:"Bulb Holder",price:120},
  {title:"Camping Lantern",price:1500},{title:"Candle Lamp",price:900},{title:"Ceiling Fan with LED Light",price:8500},
  {title:"Ceiling Rose",price:250},{title:"CFL Bulb",price:300},{title:"Chandelier Light",price:8000},
  {title:"Christmas Lights",price:1200},{title:"Construction Light",price:3500},{title:"Curtain Lights",price:1200},
  {title:"Deck Light",price:1500},{title:"Decorative Ceiling Fan",price:12000},{title:"Decorative Lantern",price:1500},
  {title:"Decorative Lighting",price:2500},{title:"Desk Light",price:1500},{title:"Dimmer Switch",price:1500},
  {title:"DMX Controller",price:6500},{title:"Eid Decorative Lights",price:1500},{title:"Electrical Lighting Components",price:2500},
  {title:"Electrical Wire",price:1200},{title:"Emergency Exit Light",price:2200},{title:"Emergency Lighting",price:3000},
  {title:"Exit Sign Light",price:2500},{title:"Explosion Proof Light",price:15000},{title:"Extension Cord",price:850},
  {title:"Fairy Lights",price:650},{title:"Festive Lights",price:1000},{title:"Filament Bulb",price:350},
  {title:"Flashlight",price:800},{title:"Germicidal UV Light",price:3500},{title:"Halogen Bulb",price:250},
  {title:"Headlamp",price:900},{title:"Heat Lamp",price:1800},{title:"High Bay Light",price:5500},
  {title:"Incandescent Bulb",price:120},{title:"Industrial Lighting",price:8500},{title:"Infrared Lamp",price:2800},
  {title:"Inspection Lamp",price:1650},{title:"Keychain Flashlight",price:450},{title:"Lamp Base",price:900},
  {title:"Lamp Holder",price:150},{title:"Lamp Shade",price:1200},{title:"LED Driver",price:450},
  {title:"LED Emergency Bulb",price:450},{title:"LED Neon Light",price:2800},{title:"LED Panel Light",price:1800},
  {title:"LED Strip Light",price:1200},{title:"LED Video Light",price:3500},{title:"Light Cleaning Kit",price:650},
  {title:"Light Socket",price:180},{title:"Light Stand",price:2500},{title:"Low Bay Light",price:3500},
  {title:"Machine Light",price:2200},{title:"Motion Sensor Light",price:1350},{title:"Mounting Hardware",price:800},
  {title:"Moving Head Light",price:18000},{title:"Neon Sign",price:3500},{title:"Office Panel Light",price:1800},
  {title:"PAR Light",price:3000},{title:"Pendant Light",price:3500},{title:"Plant Grow Light",price:2500},
  {title:"Portable Work Light",price:1800},{title:"Post Light",price:3500},{title:"Ramadan Lantern",price:1250},
  {title:"Recessed Ceiling Light",price:1800},{title:"Rechargeable Emergency Light",price:1800},{title:"Rechargeable Flashlight",price:1500},
  {title:"Remote Control",price:500},{title:"Replacement Lamp Shade",price:1200},{title:"Replacement LED Module",price:500},
  {title:"Ring Light",price:2000},{title:"Security Light",price:2200},{title:"Shop Display Light",price:2800},
  {title:"Smart Bulb",price:850},{title:"Smart Ceiling Fan",price:15000},{title:"Smart Ceiling Light",price:4500},
  {title:"Smart Dimmer",price:1800},{title:"Smart Light Strip",price:1800},{title:"Smart Lighting",price:2500},
  {title:"Smart Lighting Hub",price:3500},{title:"Smart Switch",price:1200},{title:"Softbox Light",price:4500},
  {title:"Solar Camping Light",price:1900},{title:"Solar Flood Light",price:4800},{title:"Solar Garden Light",price:1200},
  {title:"Solar Lantern",price:1250},{title:"Solar Lighting",price:3500},{title:"Solar Path Light",price:1800},
  {title:"Solar Spot Light",price:1650},{title:"Solar Street Light",price:8500},{title:"Solar String Light",price:1100},
  {title:"Solar Wall Light",price:1000},{title:"Spare Bulbs",price:350},{title:"Starter",price:120},
  {title:"String Lights",price:750},{title:"Studio Flash",price:8500},{title:"Tactical Flashlight",price:2000},
  {title:"Task Light",price:1350},{title:"Track Light",price:2500},{title:"Transformer",price:2500},
  {title:"UV Lamp",price:1500},{title:"Vintage Edison Bulb",price:650},{title:"Wall Sconce Light",price:2200},
  {title:"Warehouse Light",price:4500},{title:"Wi-Fi Light Controller",price:1500},{title:"Work Light",price:2500},
  {title:"Work Torch",price:1200},{title:"Zigbee Light Controller",price:2200}
];

function toFile(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") + ".png";
}

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error("Login failed: " + JSON.stringify(data));
  return data.idToken;
}

async function uploadToCloudinary(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const form = new FormData();
  form.append("file", new Blob([fileBuffer]), path.basename(filePath));
  form.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Cloudinary upload failed: " + JSON.stringify(data));
  return data.secure_url;
}

async function fetchExisting(idToken) {
  const res = await fetch(`${DB_URL}/products.json?orderBy="categoryId"&equalTo="${CATEGORY_ID}"&auth=${idToken}`);
  const data = await res.json();
  return data || {};
}

async function deleteProduct(idToken, id) {
  await fetch(`${DB_URL}/products/${id}.json?auth=${idToken}`, { method: "DELETE" });
}

async function addProduct(idToken, title, price, imageUrl) {
  const body = {
    title, price, categoryId: CATEGORY_ID, sellerId: SELLER_ID,
    stock: 20, status: "active", images: { main: imageUrl }, createdAt: Date.now()
  };
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.name) throw new Error("Firebase write failed: " + JSON.stringify(data));
  return data;
}

async function main() {
  console.log("লগইন হচ্ছে...");
  const idToken = await loginAdmin();
  console.log("লগইন সফল ✅\n");

  console.log("পুরনো Lighting & Lamps প্রোডাক্ট খোঁজা হচ্ছে...");
  const existing = await fetchExisting(idToken);
  const existingIds = Object.keys(existing);
  console.log(`পুরনো প্রোডাক্ট পাওয়া গেছে: ${existingIds.length}টি — সব ডিলিট করা হচ্ছে...`);

  let deleted = 0;
  for (const id of existingIds) {
    await deleteProduct(idToken, id);
    deleted++;
  }
  console.log(`✅ ডিলিট সম্পন্ন: ${deleted}টি\n`);

  console.log("নতুন প্রোডাক্ট আপলোড শুরু...\n");
  let added = 0, failed = 0;
  for (const item of products) {
    const file = toFile(item.title);
    const imagePath = path.join(BASE_IMAGE_DIR, FOLDER, file);
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ ছবি পাওয়া যায়নি: ${imagePath}`);
      failed++; continue;
    }
    try {
      const imageUrl = await uploadToCloudinary(imagePath);
      await addProduct(idToken, item.title, item.price, imageUrl);
      added++;
      console.log(`✅ ${item.title}`);
    } catch (err) {
      console.log(`❌ ব্যর্থ: ${item.title} — ${err.message}`);
      failed++;
    }
  }
  console.log(`\n===== সারাংশ =====`);
  console.log(`ডিলিট হয়েছে: ${deleted} | নতুন যোগ: ${added} | ব্যর্থ: ${failed}`);
}

main().catch(err => { console.error("স্ক্রিপ্ট ব্যর্থ:", err); process.exit(1); });
