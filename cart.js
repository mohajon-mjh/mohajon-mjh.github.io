const cart = JSON.parse(localStorage.getItem("cart") || "[]");

document.addEventListener("DOMContentLoaded", () => {
document.body.innerHTML += "<h2>Cart Items</h2><div id='cartBox'></div>";

document.getElementById("cartBox").innerHTML =
cart.length ? cart.map((id,i)=>
`<div style="padding:10px;border:1px solid #ccc;margin:5px">
Product ID: ${id}
<button onclick="removeItem(${i})">Remove</button>
</div>`
).join("")
: "Cart is empty";
});

function removeItem(index){
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
cart.splice(index,1);
localStorage.setItem("cart",JSON.stringify(cart));
location.reload();
}
