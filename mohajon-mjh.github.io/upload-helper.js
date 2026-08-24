window.toBase64 = function(file){
return new Promise(resolve=>{
const reader = new FileReader();
reader.onload = ()=>resolve(reader.result);
reader.readAsDataURL(file);
});
};
