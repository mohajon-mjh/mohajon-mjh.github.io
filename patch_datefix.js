const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFunc = `function fsParseDate(str){
  if(!str) return null;
  const parts = str.split("-");
  if(parts.length !== 3) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  if(!d || !m || !y) return null;
  return new Date(y, m-1, d, 23, 59, 59);
}

function fsIsOfferActive(mapInfo){
  const start = fsParseDate(mapInfo.startDate);
  const end = fsParseDate(mapInfo.endDate);
  const now = new Date();
  if(start && now < start) return false;
  if(end && now > end) return false;
  return true;
}`;

const newFunc = `function fsParseDate(str, endOfDay){
  if(!str) return null;
  const parts = str.split("-");
  if(parts.length !== 3) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  if(!d || !m || !y) return null;
  return endOfDay ? new Date(y, m-1, d, 23, 59, 59) : new Date(y, m-1, d, 0, 0, 0);
}

function fsIsOfferActive(mapInfo){
  const start = fsParseDate(mapInfo.startDate, false);
  const end = fsParseDate(mapInfo.endDate, true);
  const now = new Date();
  if(start && now < start) return false;
  if(end && now > end) return false;
  return true;
}`;

if(!html.includes(oldFunc)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
html = html.replace(oldFunc, newFunc);
fs.writeFileSync('index.html', html, 'utf8');
console.log("✅ Start date এখন দিনের শুরুতে (00:00:00) সেট হবে, End date দিনের শেষে (23:59:59)");
