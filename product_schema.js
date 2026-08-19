const fs=require("fs");
let h=fs.readFileSync("product-details.html","utf8");
const schema=`
<script>/*product-schema*/
(function(){
 var url=location.href;
 var m=url.match(/id=([^&]+)/);
 if(!m)return;
 fetch('https://mohajon-mjh-default-rtdb.firebaseio.com/products/'+m[1]+'.json')
 .then(r=>r.json())
 .then(p=>{
  if(!p||!p.title)return;
  var ld={
   "@context":"https://schema.org",
   "@type":"Product",
   "name":p.title,
   "description":p.description||"",
   "image":(p.images&&p.images.main)||"",
   "brand":{"@type":"Brand","name":"MJH"},
   "offers":{
    "@type":"Offer",
    "price":p.price||0,
    "priceCurrency":"BDT",
    "availability":"https://schema.org/InStock",
    "url":url
   }
  };
  if(p.rating)ld.aggregateRating={"@type":"AggregateRating","ratingValue":p.rating,"reviewCount":p.reviews||1};
  var s=document.createElement("script");
  s.type="application/ld+json";
  s.textContent=JSON.stringify(ld);
  document.head.appendChild(s);
 });
})();
</script>`;
if(h.indexOf("product-schema")===-1){
 h+=schema;
 fs.writeFileSync("product-details.html",h);
 console.log("✅ Product JSON-LD schema added");
}
