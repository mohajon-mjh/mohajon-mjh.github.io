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
   "description":p.description||(p.title+" - High quality product from Mohajon MJH Market Place. Cash on delivery available all over Bangladesh."),
   "image":(p.images&&p.images.main)||"",
   "brand":{"@type":"Brand","name":"MJH"},
   "offers":{"@type":"Offer","price":p.price||0,"priceCurrency":"BDT","availability":"https://schema.org/InStock","url":url,"hasMerchantReturnPolicy":{"@type":"MerchantReturnPolicy","applicableCountry":"BD","returnPolicyCategory":"https://schema.org/MerchantReturnFiniteReturnWindow","merchantReturnDays":7,"returnMethod":"https://schema.org/ReturnByMail","returnFees":"https://schema.org/ReturnShippingFees"},"shippingDetails":{"@type":"OfferShippingDetails","shippingRate":{"@type":"MonetaryAmount","value":170,"currency":"BDT"},"shippingDestination":{"@type":"DefinedRegion","addressCountry":"BD"},"deliveryTime":{"@type":"ShippingDeliveryTime","handlingTime":{"@type":"QuantitativeValue","minValue":0,"maxValue":1,"unitCode":"d"},"transitTime":{"@type":"QuantitativeValue","minValue":2,"maxValue":5,"unitCode":"d"}}}}
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
