/* MJH Cloudinary v1 */
window.MJH_CLOUD={cloudName:"your_actual_cloud_name",uploadPreset:"your_actual_preset",apiKey:"your_actual_key",apiSecret:"your_actual_secret"};
(async function(){
 async function sha1hex(s){const b=await crypto.subtle.digest("SHA-1",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");}
 window.MJHCloud={
  ready(){return window.MJH_CLOUD.cloudName.indexOf("PUT_")!==0;},
  async upload(file){
   const c=window.MJH_CLOUD;
   const fd=new FormData();fd.append("file",file);fd.append("upload_preset",c.uploadPreset);
   const r=await fetch("https://api.cloudinary.com/v1_1/"+c.cloudName+"/image/upload",{method:"POST",body:fd});
   const j=await r.json();
   if(!j.secure_url)throw new Error((j.error&&j.error.message)||"upload failed");
   return {url:j.secure_url,publicId:j.public_id};
  },
  pubIdFromUrl(u){try{const p=new URL(u).pathname;const m=p.split("/upload/")[1];if(!m)return null;return m.replace(/^v\d+\//,"").replace(/\.[a-z0-9]+$/i,"");}catch(e){return null;}},
  async remove(url){
   const c=window.MJH_CLOUD;const pid=this.pubIdFromUrl(url);
   if(!pid||!this.ready()||url.indexOf(c.cloudName)<0)return false;
   const ts=Math.floor(Date.now()/1000);
   const sig=await sha1hex("public_id="+pid+"&timestamp="+ts+c.apiSecret);
   const body=new URLSearchParams({public_id:pid,api_key:c.apiKey,timestamp:ts,signature:sig});
   const r=await fetch("https://api.cloudinary.com/v1_1/"+c.cloudName+"/image/destroy",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
   const j=await r.json();return j.result==="ok";
  }
 };
})();
