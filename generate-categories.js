const fs = require("fs");
const https = require("https");

const DB_URL = "https://mohajon-mjh-default-rtdb.firebaseio.com/categories.json";

// fetch firebase data
function getData(url){
  return new Promise((resolve,reject)=>{
    https.get(url,res=>{
      let data="";
      res.on("data",c=>data+=c);
      res.on("end",()=>resolve(JSON.parse(data||"{}")));
    }).on("error",reject);
  });
}

function makePage(name, image){
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${name}</title>
</head>
<body>

<h1>${name} Category</h1>

<img src="${image}" width="300">

<script>
const imgs = [
  "${image}",
  "https://source.unsplash.com/300x300/?${name}",
  "https://source.unsplash.com/300x300/?food",
  "https://source.unsplash.com/300x300/?product"
];

document.body.innerHTML += imgs.map(i =>
  '<img src="'+i+'" width="200" style="margin:10px">'
).join("");
</script>

</body>
</html>
`;
}

async function run(){
  const data = await getData(DB_URL);

  if(!fs.existsSync("categories")){
    fs.mkdirSync("categories");
  }

  Object.keys(data).forEach(key=>{
    const cat = data[key];

    const html = makePage(cat.name, cat.image);

    fs.writeFileSync(
      `categories/${key}.html`,
      html
    );

    console.log("Created:", key + ".html");
  });

  console.log("DONE 🚀 All category pages generated");
}

run();
