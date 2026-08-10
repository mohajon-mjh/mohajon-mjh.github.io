const fs = require('fs');
let content = fs.readFileSync('assets/js/admin.js', 'utf8');

const oldBlock = `    addBtn.onclick = async () => {
      const name = document.getElementById("fsc-name").value.trim();
      const order = parseInt(document.getElementById("fsc-order").value) || 0;
      const startDate = document.getElementById("fsc-startdate").value.trim();
      const endDate = document.getElementById("fsc-enddate").value.trim();
      if(!name){ alert("ক্যাটাগরির নাম দিন"); return; }
      try{
        const newRef = push(ref(db, "settings/flashSaleCategories"));
        await set(newRef, { name, order, startDate, endDate, createdAt: Date.now() });
        document.getElementById("fsc-name").value = "";
        document.getElementById("fsc-order").value = "0";
        document.getElementById("fsc-startdate").value = "";
        document.getElementById("fsc-enddate").value = "";
        alert("✅ ক্যাটাগরি যোগ হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);`;

const newBlock = `    addBtn.onclick = async () => {
      const name = document.getElementById("fsc-name").value.trim();
      const order = parseInt(document.getElementById("fsc-order").value) || 0;
      if(!name){ alert("ক্যাটাগরির নাম দিন"); return; }
      try{
        const newRef = push(ref(db, "settings/flashSaleCategories"));
        await set(newRef, { name, order, createdAt: Date.now() });
        document.getElementById("fsc-name").value = "";
        document.getElementById("fsc-order").value = "0";
        alert("✅ ক্যাটাগরি যোগ হয়েছে");
      }catch(err){
        alert("❌ Error: " + err.message);`;

if (!content.includes(oldBlock)) {
  console.log("❌ oldBlock মিলছে না — ম্যানুয়াল চেক দরকার");
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('assets/js/admin.js', content, 'utf8');
console.log("✅ addBtn.onclick থেকে fsc-startdate/fsc-enddate রেফারেন্স সরানো হয়েছে");
