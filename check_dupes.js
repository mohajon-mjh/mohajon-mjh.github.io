const API_KEY = "AIzaSyDj_LLHWBgcKfQClnaOUqEtULHhP1vSVxw";
const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com";
const ADMIN_EMAIL = "mohajonmjh@gmail.com";
const ADMIN_PASSWORD = "Mjh@Mohajon$1975";

const categoryIds = {
  "Second-Hand & Refurbished Goods": "-Oyxb9C2sczQEh7NA2Ez",
  "Musical Instruments": "-Oyxb9G7jRs3ebu4aApZ",
  "Printing Supplies": "-Oyxb9KLNTILlB5DCJ05"
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
  const res = await fetch(`${DB_URL}/products.json?auth=${idToken}`);
  const all = await res.json();
  const entries = Object.entries(all || {});

  for (const [name, catId] of Object.entries(categoryIds)) {
    const matches = entries.filter(([id, p]) => p.categoryId === catId);
    const titleCounts = {};
    matches.forEach(([id, p]) => {
      titleCounts[p.title] = (titleCounts[p.title] || 0) + 1;
    });
    const dupeTitles = Object.entries(titleCounts).filter(([t, c]) => c > 1);
    console.log(`\n${name}: মোট ${matches.length}টি প্রোডাক্ট`);
    if (dupeTitles.length > 0) {
      console.log(`  ⚠️ ডুপ্লিকেট পাওয়া গেছে (${dupeTitles.length}টি টাইটেল):`);
      dupeTitles.forEach(([t, c]) => console.log(`    - "${t}" x${c}`));
    } else {
      console.log(`  ✅ কোনো ডুপ্লিকেট নেই`);
    }
  }
}

main().catch(err => console.error("ব্যর্থ:", err));
