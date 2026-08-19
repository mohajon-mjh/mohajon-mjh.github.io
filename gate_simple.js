const fs=require("fs");
["index.html","admin.html"].forEach(f=>{
if(!fs.existsSync(f))return;
let h=fs.readFileSync(f,"utf8");
h=h.replace(/let __boot=true;[\s\S]*?else\{localStorage\.setItem\("mjhAdminOk","1"\);setBoth\(true\);\}\s*\}\);/,`onAuthStateChanged(auth,async u=>{
 if(!u){setBoth(false);return;}
 const emailOk=(u.email||"").toLowerCase()===ADMIN_EMAIL;
 let roleOk=false;
 try{const s=await get(ref(db,"users/"+u.uid));const r=(s.val()||{}).role;roleOk=(r==="admin"||r==="superadmin");}catch(e){}
 setBoth(emailOk||roleOk);
});`);
fs.writeFileSync(f,h);
console.log("✅",f);
});
