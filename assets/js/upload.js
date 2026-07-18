import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw",
  authDomain: "mohajon-mjh.firebaseapp.com",
  databaseURL: "https://mohajon-mjh-default-rtdb.firebaseio.com",
  projectId: "mohajon-mjh",
  storageBucket: "mohajon-mjh.firebasestorage.app",
  messagingSenderId: "526105903976",
  appId: "1:526105903976:web:f9321c6d68ecbd19d58cdd",
  measurementId: "G-RX6CCQZHSH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let currentUser=null;
let sellerVerified=false;

onAuthStateChanged(auth,(user)=>{

  if(!user){
    location.href="login.html?role=seller";
    return;
  }

  currentUser=user;

  const sellerRef=ref(db,"sellers/"+user.uid);

  onValue(sellerRef,(snap)=>{

    if(!snap.exists()){
      location.href="seller.html";
      return;
    }

    const seller=snap.val();
    sellerVerified = seller.status === "approved";

    window.lockSellerUI?.(sellerVerified);

  });

});

/* ===================== AUTO CATEGORY DETECTION ===================== */
const CATEGORY_KEYWORDS = {
  mobile_phones_accessories: ["mobile","phone","smartphone","iphone","samsung galaxy","xiaomi","oppo","vivo","realme","phone case","screen protector","charger cable","power bank"],
  laptops_pcs: ["laptop","notebook","macbook","desktop pc","computer pc","chromebook"],
  computers_tablets_networking: ["tablet","ipad","router","wifi","networking","modem","keyboard","mouse","monitor","webcam","ssd","hard drive","ram","motherboard","graphics card","cooling fan","pc case","cpu","processor"],
  consumer_electronics: ["television","tv","electronics","gadget"],
  electronics_tv_audio_gaming_etc: ["smart tv","led tv","audio system","home theater"],
  headphones_speakers_audio: ["headphone","earphone","earbuds","speaker","bluetooth speaker","microphone","audio"],
  cameras_photo: ["camera","dslr","lens","tripod","photography"],
  drones_action_cameras: ["drone","action camera","gopro"],
  air_conditioners_refrigerators_washing_machines: ["ac ","air conditioner","refrigerator","fridge","washing machine"],
  appliances_home_appliances_large_small: ["blender","microwave","oven","toaster","iron","vacuum cleaner","rice cooker","kettle"],
  beauty_personal_care: ["shampoo","soap","perfume","deodorant","razor","toothbrush"],
  makeup_skincare_fragrance: ["makeup","lipstick","skincare","cream","serum","foundation","fragrance"],
  clothing_fashion_apparel_men_women_kids: ["shirt","t-shirt","pant","jeans","dress","saree","panjabi","kurta","jacket","clothing"],
  shoes_accessories: ["shoe","sandal","sneaker","boot","slipper"],
  jewelry_eyewear_watches: ["jewelry","necklace","ring","earring","watch","sunglasses","eyewear"],
  luggage_bags_cases: ["bag","backpack","luggage","suitcase","wallet","purse"],
  baby_products_baby_essentials: ["baby","diaper","infant","stroller","baby food"],
  toys_games_hobbies: ["toy","game","puzzle","doll","lego"],
  video_games_consoles: ["playstation","xbox","nintendo","video game","gaming console","game cartridge"],
  sports_outdoors_fitness: ["sports","fitness","gym","yoga","cricket","football","exercise"],
  bicycles_scooters_electric_vehicles: ["bicycle","bike","scooter","electric vehicle","golf cart"],
  vehicles_transportation: ["car","motorcycle","vehicle","truck"],
  automotive_vehicle_parts_accessories: ["car parts","engine oil","tire","tyre","car accessories"],
  home_kitchen: ["kitchen","cookware","utensil","plate","dinner set","pan","pot"],
  furniture_home_decor: ["furniture","home decor","curtain","carpet","rug","wall art"],
  furniture_sofas_beds_etc: ["sofa","bed","mattress","chair","table","wardrobe"],
  lighting_lamps: ["light","lamp","bulb","led light","chandelier"],
  home_improvement_tools_hardware: ["tool","hardware","screwdriver","drill","hammer","nail"],
  power_tools_hand_tools: ["power tool","hand tool","wrench","saw"],
  gardening_outdoor_living: ["garden","plant","pot","outdoor","lawn"],
  pet_supplies: ["pet","dog food","cat food","aquarium","pet toy"],
  office_school_supplies: ["pen","pencil","notebook","paper","stapler","office supplies","school bag"],
  books_media_music: ["book","novel","magazine","cd","dvd","vinyl"],
  food_grocery: ["food","grocery","rice","spice","snack","beverage","masala"],
  agriculture_food_beverage: ["agriculture","farming","seed","fertilizer"],
  health_medical_supplies: ["medical","first aid","thermometer","mask","medicine"],
  health_wellness: ["vitamin","supplement","wellness","health"],
  safety_security: ["safety","security camera","lock","alarm","cctv"],
  smart_home_surveillance: ["smart home","surveillance","smart bulb","smart plug"],
  renewable_energy: ["solar","renewable energy","solar panel"],
  construction_building_materials: ["cement","brick","construction","building material"],
  industrial_machinery_equipment: ["industrial","machinery","equipment"],
  business_industrial_machinery: ["machine","factory equipment"],
  electrical_equipment_supplies: ["wire","cable","electrical","switch","socket"],
  art_collectibles_crafts: ["art","craft","collectible","painting","handmade"],
  gifts_crafts: ["gift","craft item"]
};

function detectCategory(productName){
  const nameLower = productName.toLowerCase();
  for(const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)){
    for(const kw of keywords){
      if(nameLower.includes(kw)){
        return categoryId;
      }
    }
  }
  return "";
}

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("product-name");
  const categorySelect = document.getElementById("product-category");
  let userManuallyChangedCategory = false;

  if(categorySelect){
    categorySelect.addEventListener("change", () => {
      userManuallyChangedCategory = true;
    });
  }

  if(nameInput && categorySelect){
    nameInput.addEventListener("input", () => {
      if(userManuallyChangedCategory) return;
      const detected = detectCategory(nameInput.value);
      if(detected){
        categorySelect.value = detected;
      }
    });
  }
});

/* 🚫 BASIC DUPLICATE + SPAM CONTROL */
function isValidProduct(name, price){

  if(!name || name.length<3) return false;
  if(price<=0 || price>1000000) return false;

  return true;
}

document.getElementById("product-form").addEventListener("submit",function(e){

  e.preventDefault();

  if(!currentUser) return alert("Login required");
  if(!sellerVerified) return alert("Seller not verified");

  const name=document.getElementById("product-name").value.trim();
  const price=parseFloat(document.getElementById("product-price").value);
  const categoryId=document.getElementById("product-category").value;

  if(!isValidProduct(name,price)){
    alert("Invalid product data");
    return;
  }

  if(!categoryId){
    alert("দয়া করে একটি ক্যাটাগরি নির্বাচন করুন");
    return;
  }

  const productData={
    title:name,
    price,
    description:document.getElementById("product-desc").value,
    stock:parseInt(document.getElementById("product-stock").value)||0,
    categoryId:categoryId,
    sellerId:currentUser.uid,
    createdAt:Date.now(),
    status:"pending"
  };

  const file=document.getElementById("product-image").files[0];

  if(file){
    const reader=new FileReader();
    reader.onload=(e)=>{
      productData.images={ img1: e.target.result };
      save(productData);
    };
    reader.readAsDataURL(file);
  }else{
    productData.images={ img1: "assets/images/default-product.jpg" };
    save(productData);
  }

});

function save(data){

  const newRef=push(ref(db,"products"));

  set(newRef,data)
  .then(()=>{
    alert("Submitted for admin approval");
    location.href="seller-dashboard.html";
  })
  .catch(err=>alert(err.message));
}
