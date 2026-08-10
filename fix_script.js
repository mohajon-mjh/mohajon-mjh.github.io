const fs = require('fs');
let content = fs.readFileSync('upload_specialcats.js', 'utf8');

const oldFn = `async function addProduct(idToken, categoryId, title, price, imageUrl) {
  const body = {
    title,
    price,
    categoryId,
    slug: toSlug(title),
    imageUrl,
    createdAt: Date.now()
  };
  const res = await fetch(\`\${DB_URL}/products.json?auth=\${idToken}\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return await res.json();
}`;

const newFn = `const SELLER_ID = "SqVK0FFNFietVqov8la6hwSAF023";

async function addProduct(idToken, categoryId, title, price, imageUrl) {
  const body = {
    title,
    price,
    categoryId,
    sellerId: SELLER_ID,
    stock: 20,
    status: "active",
    images: { main: imageUrl },
    createdAt: Date.now()
  };
  const res = await fetch(\`\${DB_URL}/products.json?auth=\${idToken}\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!data.name) {
    throw new Error("Firebase write failed: " + JSON.stringify(data));
  }
  return data;
}`;

if (!content.includes(oldFn)) {
  console.log("❌ পুরনো ফাংশন হুবহু খুঁজে পাওয়া যায়নি — ম্যানুয়াল চেক দরকার।");
  process.exit(1);
}

content = content.replace(oldFn, newFn);
fs.writeFileSync('upload_specialcats.js', content, 'utf8');
console.log("✅ addProduct ফাংশন সফলভাবে ঠিক করা হয়েছে। এখন সঠিক schema দিয়ে লিখবে।");
