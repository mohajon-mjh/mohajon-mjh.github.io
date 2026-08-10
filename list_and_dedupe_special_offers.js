const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  if (!data.idToken) throw new Error("Login failed: " + JSON.stringify(data));
  return data.idToken;
}

async function main() {
  const idToken = await loginAdmin();
  const res = await fetch(`${DB_URL}/settings/specialCategories.json?auth=${idToken}`);
  const data = await res.json() || {};

  const entries = Object.entries(data);
  console.log(`মোট এন্ট্রি: ${entries.length}\n`);

  // Find all entries with slug lighting_lamps, keep only the newest (last createdAt), delete rest
  const lightingEntries = entries.filter(([id, item]) => item.slug === "lighting_lamps");
  console.log(`"lighting_lamps" slug দিয়ে এন্ট্রি: ${lightingEntries.length}`);
  lightingEntries.forEach(([id, item]) => {
    console.log(` - ${id} | ${item.name} | createdAt: ${item.createdAt}`);
  });

  if (lightingEntries.length <= 1) {
    console.log("\n✅ ডুপ্লিকেট নেই, কিছু করার দরকার নেই।");
    return;
  }

  // Sort by createdAt descending, keep the newest, delete the rest
  lightingEntries.sort((a, b) => (b[1].createdAt || 0) - (a[1].createdAt || 0));
  const [keepId] = lightingEntries[0];
  const toDelete = lightingEntries.slice(1);

  console.log(`\n✅ রাখা হচ্ছে: ${keepId}`);
  for (const [id, item] of toDelete) {
    await fetch(`${DB_URL}/settings/specialCategories/${id}.json?auth=${idToken}`, { method: "DELETE" });
    console.log(`🗑️ ডিলিট হয়েছে: ${id} (${item.name})`);
  }
  console.log("\n✅ ডুপ্লিকেট রিমুভ সম্পন্ন");
}
main().catch(err => { console.error("❌", err.message); process.exit(1); });
