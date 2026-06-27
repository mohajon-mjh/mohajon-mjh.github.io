const fs = require("fs");
const path = require("path");

const dir = "assets/images/products";

if (!fs.existsSync(dir)) {
  console.log("Folder not found:", dir);
  process.exit();
}

const files = fs.readdirSync(dir);

const output = files.map((file) => {
  return {
    file,
    category: "grocery"
  };
});

fs.writeFileSync("grocery-category.json", JSON.stringify(output, null, 2));

console.log("Done: grocery-category.json created with", files.length, "items");
