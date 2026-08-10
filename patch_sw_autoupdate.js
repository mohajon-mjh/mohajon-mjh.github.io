const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldBlock = `<script>
if('serviceWorker' in navigator){
window.addEventListener('load',()=>{
navigator.serviceWorker.register('/sw.js');
});
}
</script>`;

const newBlock = `<script>
if('serviceWorker' in navigator){
window.addEventListener('load',()=>{
navigator.serviceWorker.register('/sw.js').then(reg=>{
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange',()=>{
if(refreshing) return;
refreshing = true;
window.location.reload();
});
reg.addEventListener('updatefound',()=>{
const newWorker = reg.installing;
if(!newWorker) return;
newWorker.addEventListener('statechange',()=>{
if(newWorker.state==='installed' && navigator.serviceWorker.controller){
newWorker.postMessage({type:'SKIP_WAITING'});
}
});
});
setInterval(()=>{ reg.update(); }, 60000);
});
});
}
</script>`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync('index.html', content, 'utf8');
  console.log("✅ index.html এ auto-update লজিক বসানো হয়েছে");
} else {
  console.log("❌ মিলছে না — ম্যানুয়াল চেক দরকার");
}
