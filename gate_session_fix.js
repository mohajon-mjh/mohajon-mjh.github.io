const fs=require("fs");
["index.html","admin.html"].forEach(f=>{
if(!fs.existsSync(f))return;
let h=fs.readFileSync(f,"utf8");
h=h.replace(/onAuthStateChanged\(auth,async u=>\{[\s\S]*?setBoth\(emailOk\|\|roleOk\);\s*\}\);/,`let __boot=true;
onAuthStateChanged(auth,async u=>{
 if(!u){sessionStorage.removeItem("mjhAdminOk");__boot=true;setBoth(false);return;}
 const emailOk=(u.email||"").toLowerCase()===ADMIN_EMAIL;
 let roleOk=false;
 try{const s=await get(ref(db,"users/"+u.uid));const r=(s.val()||{}).role;roleOk=(r==="admin"||r==="superadmin");}catch(e){}
 const isA=emailOk||roleOk;
 if(!isA){setBoth(false);return;}
 if(__boot){__boot=false;if(sessionStorage.getItem("mjhAdminOk")==="1"){setBoth(true);}else{setBoth(false);}}
 else{sessionStorage.setItem("mjhAdminOk","1");setBoth(true);}
});`);
fs.writeFileSync(f,h);
console.log("✅",f);
});
