const fs=require("fs");
const f="home-products.html";
let s=fs.readFileSync(f,"utf8");
const bak=s;
const pairs=[
 ["toast(\"✅ \"+n+\"টার তারিখ বসল\")", "toast(\"✅ \"+n+\"টার তারিখ বসল\");var bs=$(\"bSt\");if(bs)bs.innerHTML=\"<span style='color:#2ecc71;font-weight:700'>✅ তারিখ সেট হয়েছে (\"+n+\"টি)</span>\""],
 ["<span id='bSt'></span>", "</div><div class='bar' style='background:transparent;padding:0;margin:4px 0'><span id='bSt'></span>"],
 ["🗂️ All Products", "📁 All Products"],
 ["বর্তমান দাম (৳) — অটো ক্যালকুলেটেড হয়", "বর্তমান দাম (৳) — অটো ক্যালকুলেট হয়"]
];
let applied=0;
for(const p of pairs){
 const c=s.split(p[0]).length-1;
 if(c>0){ s=s.split(p[0]).join(p[1]); console.log("✅ replaced x"+c+" : "+p[0].slice(0,45)); applied++; }
 else console.log("⏭️ not found (skip): "+p[0].slice(0,45));
}
if(applied>0){ fs.writeFileSync(f+".bak2",bak); fs.writeFileSync(f,s); console.log("✅ মোট "+applied+"টা প্যাচ। ব্যাকআপ: home-products.html.bak2"); }
else console.log("❌ কিছু বদলায়নি — ফাইল অক্ষত");
