const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";

const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const newCategories = [
  "Second-Hand & Refurbished Goods",
  "Musical Instruments",
  "Printing Supplies",
  "Seasonal & Festival Products",
  "Islamic & Religious Products",
  "Wedding & Event Supplies"
];

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
  console.log("✅ Logged in as admin");

  const existingRes = await fetch(`${DB_URL}/categories.json?auth=${idToken}`);
  const existing = await existingRes.json() || {};
  const existingNames = new Set(Object.values(existing).map(c => c.name));

  for(const name of newCategories){
    if(existingNames.has(name)){
      console.log(`⏭️  স্কিপ (আগে থেকেই আছে): ${name}`);
      continue;
    }
    const res = await fetch(`${DB_URL}/categories.json?auth=${idToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, createdAt: Date.now(), active: true })
    });
    const data = await res.json();
    if(!res.ok){
      console.error(`❌ ${name}: ${JSON.stringify(data)}`);
      continue;
    }
    console.log(`✅ তৈরি হয়েছে: ${name} => key: ${data.name}`);
  }

  console.log("\nসম্পন্ন।");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
