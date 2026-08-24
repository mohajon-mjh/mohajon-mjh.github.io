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
  const body = {
    name: "🎉 Special Offers for One Week",
    slug: "lighting_lamps",
    order: -1,
    startDate: "08-08-2026",
    endDate: "15-08-2026",
    createdAt: Date.now()
  };
  const res = await fetch(`${DB_URL}/settings/specialCategories.json?auth=${idToken}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log("✅ Special Offers category যোগ হয়েছে, ID:", data.name);
}
main().catch(err => { console.error("❌", err.message); process.exit(1); });
