/* mjh-home-arrows-v1 */
(function(){
 function addArrows(){
  var nodes=document.querySelectorAll("div,ul,section");
  for(var i=0;i<nodes.length;i++){
   var el=nodes[i];
   if(el.dataset.arrowDone)continue;
   var st=getComputedStyle(el);
   if((st.overflowX==="auto"||st.overflowX==="scroll")&&el.scrollWidth>el.clientWidth+80){
    el.dataset.arrowDone="1";
    var p=el.parentElement;if(!p||p.querySelector(".mjh-arrow"))continue;
    p.style.position="relative";
    var b=document.createElement("button");b.className="mjh-arrow";b.innerHTML="→";
    b.style.cssText="position:absolute;right:6px;top:45%;z-index:50;width:40px;height:40px;border-radius:50%;background:#111;color:#fff;border:2px solid #f59e0b;font-size:20px;cursor:pointer";
    b.onclick=function(){el.scrollBy({left:el.clientWidth*0.8,behavior:"smooth"});};
    p.appendChild(b);
   }
  }
 }
 window.addEventListener("load",function(){setTimeout(addArrows,2500);setTimeout(addArrows,7000);setTimeout(addArrows,14000);});
})();
