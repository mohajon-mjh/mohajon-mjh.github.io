function getWishlist(){
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}
function saveWishlist(list){
  localStorage.setItem("wishlist", JSON.stringify(list));
  updateWishUI();
}
function toggleWishlist(id, name){
  let list = getWishlist();
  let index = list.findIndex(i => i.id === id);
  if(index >= 0){
    list.splice(index,1);
  } else {
    list.push({id,name});
  }
  saveWishlist(list);
}
function isWishlisted(id){
  return getWishlist().some(i => i.id === id);
}
function updateWishUI(){
  let count = getWishlist().length;
  document.querySelectorAll("#wishCount").forEach(el=>{
    el.textContent = count;
  });
}
window.toggleWishlist = toggleWishlist;
window.isWishlisted = isWishlisted;
window.getWishlist = getWishlist;
document.addEventListener("DOMContentLoaded", updateWishUI);
document.addEventListener("headerLoaded", updateWishUI);
