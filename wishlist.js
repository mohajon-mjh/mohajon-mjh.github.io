function getWishlist(){
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function saveWishlist(list){
  localStorage.setItem("wishlist", JSON.stringify(list));
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
