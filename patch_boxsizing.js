const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const oldStr = `<style>
body{font-family:Arial;background:#111;color:#fff;padding:0;margin:0}`;

const newStr = `<style>
*{box-sizing:border-box}
body{font-family:Arial;background:#111;color:#fff;padding:0;margin:0;overflow-x:hidden}
html{overflow-x:hidden}`;

if(!html.includes(oldStr)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
html = html.replace(oldStr, newStr);
fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ box-sizing:border-box + overflow-x:hidden যোগ করা হয়েছে");
