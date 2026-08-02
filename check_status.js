const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function main(){
  const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const authData = await authRes.json();
  const idToken = authData.idToken;

  const settingsRes = await fetch(`${DB_URL}/settings.json?auth=${idToken}`);
  const settings = await settingsRes.json();
  console.log("=== Global Discount Setting ===");
  console.log("flashSaleGlobalDiscount:", settings ? settings.flashSaleGlobalDiscount : "(settings নোডই নেই)");

  const allRes = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const allData = (await allRes.json()) || {};

  console.log("\n=== Flash Sale প্রোডাক্ট ===");
  let fsCount = 0;
  const fsTitles = {};
  for(const key of Object.keys(allData)){
    const p = allData[key];
    if(p && p.isFlashSale === true){
      fsCount++;
      if(!fsTitles[p.title]) fsTitles[p.title] = [];
      fsTitles[p.title].push({key, price: p.price, discountPercent: p.discountPercent, status: p.status});
    }
  }
  console.log("মোট Flash Sale প্রোডাক্ট:", fsCount);
  for(const title of Object.keys(fsTitles)){
    if(fsTitles[title].length > 1){
      console.log(`⚠️ ডুপ্লিকেট টাইটেল: ${title}`, JSON.stringify(fsTitles[title]));
    }
  }

  console.log("\n=== Trending প্রোডাক্ট ===");
  let trCount = 0;
  const trList = [];
  for(const key of Object.keys(allData)){
    const p = allData[key];
    if(p && p.isTrending === true){
      trCount++;
      trList.push({key, title: p.title, status: p.status});
    }
  }
  console.log("মোট Trending প্রোডাক্ট:", trCount);
  console.log(JSON.stringify(trList, null, 2));
}

main().catch(err => console.error("❌", err.message));
