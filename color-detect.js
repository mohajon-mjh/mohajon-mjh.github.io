/* MJH Color Detect v1 - universal auto color system */
(function(){
var DB=[
["black",["black","কালো"],[25,25,25]],
["white",["white","সাদা"],[245,245,245]],
["red",["red","লাল","crimson"],[215,35,40]],
["orange",["orange","কমলা"],[250,140,20]],
["yellow",["yellow","হলুদ"],[240,215,40]],
["gold",["gold","সোনালি"],[210,170,60]],
["green",["green","সবুজ"],[35,135,70]],
["teal",["teal","ফিরোজা"],[20,130,125]],
["skyblue",["skyblue","sky","lightblue","light blue","আকাশি","আসমানি"],[120,190,230]],
["blue",["blue","নীল","royalblue"],[30,70,180]],
["navy",["navy","নেভি","গাঢ় নীল"],[25,35,90]],
["purple",["purple","বেগুনি","violet"],[130,60,170]],
["pink",["pink","গোলাপি"],[240,130,180]],
["maroon",["maroon","মেরুন"],[130,25,45]],
["brown",["brown","বাদামি"],[130,80,45]],
["copper",["copper","তামা","bronze"],[185,110,80]],
["silver",["silver","grey","gray","রূপালি","ধূসর"],[180,180,185]]
];
function norm(s){return String(s||"").toLowerCase().trim();}
function canonical(name){
 var n=norm(name);
 for(var i=0;i<DB.length;i++){
  if(DB[i][0]===n.replace(/[^a-z0-9]+/g,""))return DB[i][0];
  for(var a=0;a<DB[i][1].length;a++){var al=DB[i][1][a];if(n===al||(al.length>2&&n.indexOf(al)>-1))return DB[i][0];}
 }
 return n.replace(/[^a-z0-9\u0980-\u09ff]+/g,"");
}
function dist(a,b){var dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2];return dr*dr+dg*dg+db*db;}
function nameFromRgb(rgb){var best=null,bd=1e18;for(var i=0;i<DB.length;i++){var d=dist(rgb,DB[i][2]);if(d<bd){bd=d;best=DB[i][0];}}return best;}
function label(can){for(var i=0;i<DB.length;i++)if(DB[i][0]===can)return DB[i][1][1]||DB[i][1][0];return can;}
function detectFromUrl(url,cb){
 var img=new Image();img.crossOrigin="anonymous";
 img.onload=function(){
  try{
   var S=48,c=document.createElement("canvas");c.width=S;c.height=S;
   var x=c.getContext("2d");x.drawImage(img,0,0,S,S);
   var d=x.getImageData(0,0,S,S).data;
   function px(i){return [d[i],d[i+1],d[i+2]];}
   var bg=[0,0,0];
   [px(0),px((S-1)*4),px((S*S-S)*4),px((S*S-1)*4)].forEach(function(p){bg[0]+=p[0]/4;bg[1]+=p[1]/4;bg[2]+=p[2]/4;});
   var sum=[0,0,0],n=0;
   for(var i=0;i<d.length;i+=16){
    var p=px(i);
    if(dist(p,bg)<900)continue;
    sum[0]+=p[0];sum[1]+=p[1];sum[2]+=p[2];n++;
   }
   if(!n){cb(null);return;}
   var rgb=[sum[0]/n,sum[1]/n,sum[2]/n];
   var can=nameFromRgb(rgb);
   cb({canonical:can,label:label(can),rgb:rgb});
  }catch(e){cb(null);}
 };
 img.onerror=function(){cb(null);};
 img.src=url;
}
window.MJHColor={canonical:canonical,detectFromUrl:detectFromUrl,nameFromRgb:nameFromRgb,label:label,DB:DB};
})();
