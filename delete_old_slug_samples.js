const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const SLUGS = [
  "secondhand_refurbished_goods",
  "musical_instruments",
  "printing_supplies"
];

async function loginAdmin() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true })
  });
  const data = await res.json();
  return data.idToken;
}

async function main() {
  const idToken = await loginAdmin();
  let totalDeleted = 0;

  for (const slug of SLUGS) {
    const res = await fetch(`${DB_URL}/products.json?orderBy="categoryId"&equalTo="${slug}"&auth=${idToken}`);
    const data = await res.json();
    const entries = Object.entries(data || {});
    console.log(`\n--- ${slug}: ${entries.length}টি পুরনো প্রোডাক্ট পাওয়া গেছে ---`);

    for (const [id, product] of entries) {
      await fetch(`${DB_URL}/products/${id}.json?auth=${idToken}`, { method: "DELETE" });
      console.log(`🗑️ ডিলিট: ${product.title || id}`);
      totalDeleted++;
    }
    console.log(`✅ ${slug} শেষ`);
  }

  console.log(`\nমোট ডিলিট হয়েছে: ${totalDeleted}`);
}

main().catch(err => console.error("এরর:", err.message));
