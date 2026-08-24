const fs=require("fs");
let h=fs.readFileSync("index.html","utf8");
const seo=`
<!-- SEO Meta Tags -->
<title>MJH Marketplace - বাংলাদেশের অনলাইন শপিং প্ল্যাটফর্ম | Electronics, Fashion, Grocery</title>
<meta name="description" content="MJH Marketplace-এ কিনুন Electronics, Fashion, Grocery, Spices, Health & Beauty পণ্য। সেরা দামে Cash on Delivery। Seller হোন, আয় করুন।">
<meta name="keywords" content="online shopping bangladesh, electronics, fashion, grocery, spices, marketplace, cash on delivery, seller platform">
<meta name="author" content="MJH Marketplace">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://mohajon-mjh.github.io/">

<!-- Open Graph (Facebook, WhatsApp) -->
<meta property="og:type" content="website">
<meta property="og:title" content="MJH Marketplace - বাংলাদেশের অনলাইন শপিং">
<meta property="og:description" content="Electronics, Fashion, Grocery, Spices - সেরা দামে কিনুন">
<meta property="og:image" content="https://mohajon-mjh.github.io/og-image.jpg">
<meta property="og:url" content="https://mohajon-mjh.github.io/">
<meta property="og:site_name" content="MJH Marketplace">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MJH Marketplace - অনলাইন শপিং">
<meta name="twitter:description" content="Electronics, Fashion, Grocery - সেরা দাম">
<meta name="twitter:image" content="https://mohajon-mjh.github.io/og-image.jpg">

<!-- JSON-LD Structured Data (Organization) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "MJH Marketplace",
  "url": "https://mohajon-mjh.github.io",
  "description": "বাংলাদেশের অনলাইন শপিং প্ল্যাটফর্ম",
  "currenciesAccepted": "BDT, USD, EUR",
  "paymentAccepted": "Cash on Delivery, bKash",
  "areaServed": "Bangladesh"
}
</script>
`;
if(h.indexOf("<title>")>-1){
 h=h.replace(/<title>.*?<\/title>/,"");
}
h=h.replace("</head>",seo+"</head>");
fs.writeFileSync("index.html",h);
console.log("✅ SEO meta tags added");
