const fs=require("fs");
let h=fs.readFileSync("index.html","utf8");
const tag='<meta name="google-site-verification" content="x8Xat_aWS0zqxAAuNxDsMsf6qnKF2_NdjwIo85FYODc" />';
if(h.indexOf("google-site-verification")===-1){
 if(h.indexOf("</head>")>-1)h=h.replace("</head>",tag+"\n</head>");
 else if(h.indexOf("<head")>-1)h=h.replace(/<head([^>]*)>/,"<head$1>\n"+tag);
 else h=tag+"\n"+h;
 fs.writeFileSync("index.html",h);
 console.log("✅ verification tag added");
}else console.log("already there");
