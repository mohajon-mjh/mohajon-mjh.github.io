import re

print("🔧 FINAL FIX: লাফালাফি + floating duplicate")

with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()

# ---- FIX 1: layout-fix-v1 এর ৪ সেকেন্ড interval বন্ধ ----
old1 = r'for\(var i=1;i<=15;i\+\+\)setTimeout\(fix,i\*600\);\s*setInterval\(fix,4000\);'
if re.search(old1, c):
    c = re.sub(old1, 'fix(); /* একবারই, কোনো repeat নেই */', c)
    print("✅ Fix 1: layout-fix interval বন্ধ (ধাক্কা থামবে)")
else:
    print("⚠️  Fix 1 pattern পাওয়া যায়নি")

# ---- FIX 2: floating duplicate চিরতরে delete ----
dedup = '''
<script>/*mjh-dedup-float-v1*/
(function(){
 var KEY=["Social Media Post","এড বক","দাম অটো","ক্যাটাগরি অন/অফ"];
 function sideTexts(){
  var nav=document.querySelector("nav.admin-tabs")||document.querySelector(".admin-tabs");
  var set={};
  if(nav){nav.querySelectorAll("button,a").forEach(function(b){
   var t=(b.textContent||"").replace(/✕/g,"").trim();
   if(t)set[t]=1;
  });}
  return set;
 }
 function kill(){
  var set=sideTexts();
  document.querySelectorAll("body > button, body > a").forEach(function(el){
   var css=el.getAttribute("style")||"";
   if(css.indexOf("position:fixed")===-1)return;
   if(css.indexOf("right")===-1||css.indexOf("bottom")===-1)return;
   var t=(el.textContent||"").trim();
   if(!t)return;
   var hit=!!set[t];
   if(!hit){for(var i=0;i<KEY.length;i++){if(t.indexOf(KEY[i])>-1){hit=true;break;}}}
   if(hit)el.remove();
  });
 }
 var t0=Date.now();
 try{
  var mo=new MutationObserver(function(){kill();if(Date.now()-t0>20000)mo.disconnect();});
  mo.observe(document.body,{childList:true});
 }catch(e){}
 setTimeout(kill,300);setTimeout(kill,1200);setTimeout(kill,3000);setTimeout(kill,6000);
})();
</script>
</body>'''

if "mjh-dedup-float-v1" not in c:
    c = c.replace("</body>", dedup, 1)
    print("✅ Fix 2: floating duplicate remover বসানো হয়েছে (delete, hide নয়)")
else:
    print("⚠️  Fix 2 আগে থেকেই আছে")

with open("admin.html", "w", encoding="utf-8") as f:
    f.write(c)

print("\n🎯 দুটো fix সম্পন্ন")
