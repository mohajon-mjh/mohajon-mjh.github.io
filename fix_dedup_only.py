print("🔧 Dedup ONLY: ডান-নিচের ৪টা floating বাটন চিরতরে delete")

with open("admin.html", "r", encoding="utf-8") as f:
    c = f.read()

dedup = '''
<script>/*mjh-dedup-float-v2*/
(function(){
 var KEY=["Social Media Post","এড বক","দাম অটো","ক্যাটাগরি অন/অফ"];
 function kill(){
  var nav=document.querySelector("nav.admin-tabs")||document.querySelector(".admin-tabs");
  var set={};
  if(nav){nav.querySelectorAll("button,a").forEach(function(b){
   var t=(b.textContent||"").replace(/✕/g,"").trim(); if(t)set[t]=1;
  });}
  document.querySelectorAll("body > button, body > a").forEach(function(el){
   var css=el.getAttribute("style")||"";
   if(css.indexOf("position:fixed")===-1)return;
   if(css.indexOf("right")===-1||css.indexOf("bottom")===-1)return;
   var t=(el.textContent||"").trim(); if(!t)return;
   var hit=false;
   for(var i=0;i<KEY.length;i++){if(t.indexOf(KEY[i])>-1){hit=true;break;}}
   if(!hit&&set[t])hit=true;
   if(hit)el.remove();
  });
 }
 setTimeout(kill,400);setTimeout(kill,1200);setTimeout(kill,2500);
 setTimeout(kill,5000);setTimeout(kill,9000);setTimeout(kill,14000);
 try{
  var t0=Date.now();
  var mo=new MutationObserver(function(){kill();if(Date.now()-t0>30000)mo.disconnect();});
  mo.observe(document.body,{childList:true});
 }catch(e){}
})();
</script>
</body>'''

if "mjh-dedup-float-v2" in c:
    print("⚠️  আগে থেকেই আছে")
else:
    c = c.replace("</body>", dedup, 1)
    with open("admin.html", "w", encoding="utf-8") as f:
        f.write(c)
    print("✅ বসানো হয়েছে: ৪টা floating বাটন এখন sidebar match এর অপেক্ষা করবে না — সরাসরি delete")

