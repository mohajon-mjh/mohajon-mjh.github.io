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
  const entries = Object.entries(data).filter(([id, item]) => item.slug === "lighting_lamps");
  console.log(`পাওয়া গেছে ${entries.length}টি এন্ট্রি lighting_lamps slug দিয়ে`);
  for (const [id, item] of entries) {
    await fetch(`${DB_URL}/settings/specialCategories/${id}.json?auth=${idToken}`, { method: "DELETE" });
    console.log(`🗑️ ডিলিট হয়েছে: ${id} (${item.name})`);
  }
  console.log("✅ সম্পন্ন — এখন Special Offers শুধু Flash Sale সারিতেই থাকবে");
}
main().catch(err => { console.error("❌", err.message); process.exit(1); });
