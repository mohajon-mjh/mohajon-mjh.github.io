const fs=require("fs");
let h=fs.readFileSync("index.html","utf8");
h=h.replace(/<title>[\s\S]*?<\/title>/,"<title>Mohajon MJH - International Online Marketplace | Electronics, Fashion, Grocery</title>");
h=h.replace(/<meta name="description" content="[^"]*">/g,'<meta name="description" content="Mohajon MJH - Your international online marketplace for electronics, fashion, groceries, and more. Worldwide deals, Cash on Delivery, Seller program. Order: WhatsApp +966550171314">');
h=h.replace(/<meta property="og:title" content="[^"]*">/g,'<meta property="og:title" content="Mohajon MJH - International Online Marketplace">');
h=h.replace(/<meta property="og:description" content="[^"]*">/g,'<meta property="og:description" content="Electronics, Fashion, Grocery & more - worldwide deals, seller program, cash on delivery.">');
fs.writeFileSync("index.html",h);
console.log("✅ title international");
