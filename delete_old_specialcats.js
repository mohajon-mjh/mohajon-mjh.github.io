const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const categoryIds = [
  "-Oyxb9C2sczQEh7NA2Ez",
  "-Oyxb9G7jRs3ebu4aApZ",
  "-Oyxb9KLNTILlB5DCJ05"
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
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const all = await res.json();
  const entries = Object.entries(all || {});

  let totalDeleted = 0;
  for (const catId of categoryIds) {
    const matches = entries.filter(([id, p]) => p.categoryId === catId);
    console.log(`\ncategoryId ${catId}: ${matches.length}টি ডিলিট করা হচ্ছে...`);
    for (const [id, p] of matches) {
      await fetch(`${DB_URL}/products/${id}.json?auth=${idToken}`, { method: "DELETE" });
      totalDeleted++;
    }
    console.log(`✅ শেষ`);
  }
  console.log(`\nমোট ডিলিট হয়েছে: ${totalDeleted}`);
}

main().catch(err => console.error("ব্যর্থ:", err.message));
