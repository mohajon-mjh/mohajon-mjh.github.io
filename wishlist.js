document.addEventListener("DOMContentLoaded",()=>{
const wish = JSON.parse(localStorage.getItem("wish")||"[]");

document.body.innerHTML += "<h2>Wishlist</h2><div id='wbox'></div>";

document.getElementById("wbox").innerHTML =
wish.length ? wish.map(id =>
`<div style="padding:10px;border:1px solid #ccc;margin:5px">
Product ID: ${id}
</div>`).join("")
: "No wishlist items";
});
