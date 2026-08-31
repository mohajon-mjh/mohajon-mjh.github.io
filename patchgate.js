const fs=require("fs");
const f="category-gate.js";
let s=fs.readFileSync(f,"utf8");
const bak=s;
const pairs=[
 ["document.querySelectorAll(\"#globalCatsRow1 .cat,#globalCatsRow2 .cat\").forEach(function(c){var id=idFromText(c.textContent||\"\");if(id&&isOff(id)&&c.textContent.indexOf(\"🔜\")===-1)c.textContent=c.textContent+\" 🔜\";});",
  "document.querySelectorAll(\"#globalCatsRow1 .cat,#globalCatsRow2 .cat\").forEach(function(c){var id=idFromText(c.textContent||\"\");if(id&&isOff(id)&&c.textContent.indexOf(\"🔜\")===-1)c.textContent=c.textContent+\" 🔜\";});document.querySelectorAll(\"#globalCatCarousel .cat,#globalCatCarousel button,#globalCatCarousel a\").forEach(function(c){var id=idFromText(c.textContent||\"\");if(id&&isOff(id))c.style.display=\"none\";});"],
 ["var c=e.target.closest?e.target.closest(\"#globalCatsRow1 .cat,#globalCatsRow2 .cat,#flashCatsRow .cat,#dotdCatsRow .cat,#specialCatsContainer .cat\"):null;",
  "var c=e.target.closest?e.target.closest(\"#globalCatCarousel .cat,#globalCatsRow1 .cat,#globalCatsRow2 .cat,#flashCatsRow .cat,#dotdCatsRow .cat,#specialCatsContainer .cat\"):null;"],
 ["ready().then(function(){setTimeout(hideOff,1500);setTimeout(hideOff,4500);});",
  "ready().then(function(){[1500,4500,8000,12000,16000].forEach(function(t){setTimeout(hideOff,t);});});"]
];
let applied=0;
for(const p of pairs){
 const c=s.split(p[0]).length-1;
 if(c>0){s=s.split(p[0]).join(p[1]);console.log("✅ replaced x"+c+" : "+p[0].slice(0,50));applied++;}
 else console.log("⏭️ not found: "+p[0].slice(0,50));
}
if(applied>0){fs.writeFileSync(f+".bak3",bak);fs.writeFileSync(f,s);console.log("✅ প্যাচ লাগল "+applied+"টা। ব্যাকআপ: category-gate.js.bak3");}
else console.log("❌ কিছু মেলেনি — ফাইল অক্ষত");
