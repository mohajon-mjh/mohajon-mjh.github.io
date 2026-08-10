const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const ID_MAP = {
  "-Oyxb9C2sczQEh7NA2Ez": "secondhand_refurbished_goods",
  "-Oyxb9G7jRs3ebu4aApZ": "musical_instruments",
  "-Oyxb9KLNTILlB5DCJ05": "printing_supplies"
};

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
  let totalFixed = 0;

  for (const [oldId, newSlug] of Object.entries(ID_MAP)) {
    console.log(`\n--- ${oldId} -> ${newSlug} ---`);
    const res = await fetch(`${DB_URL}/products.json?orderBy="categoryId"&equalTo="${oldId}"&auth=${idToken}`);
    const data = await res.json();
    const entries = Object.entries(data || {});
    console.log(`${entries.length}টি প্রোডাক্ট পাওয়া গেছে, categoryId আপডেট করা হচ্ছে...`);

    for (const [id, product] of entries) {
      const patchRes = await fetch(`${DB_URL}/products/${id}.json?auth=${idToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: newSlug })
      });
      if (patchRes.ok) {
        totalFixed++;
      } else {
        const err = await patchRes.text();
        console.log(`❌ ব্যর্থ (${product.title || id}):`, err);
      }
    }
    console.log(`✅ ${newSlug} শেষ`);
  }

  console.log(`\nমোট ঠিক করা হয়েছে: ${totalFixed}`);
}

main().catch(err => console.error("এরর:", err.message));
