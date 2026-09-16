/* about-render v1 - settings/aboutPage থেকে about.html render */
(function(){
function esc(s){return String(s==null?"":s);}
function apply(p){
 var q=function(s){return document.querySelector(s);};
 if(p.heroTitle){var h=q(".about-hero h1");if(h)h.textContent=p.heroTitle;}
 if(p.heroSub){var hs=q(".about-hero p");if(hs)hs.textContent=p.heroSub;}
 if(p.founder){var f=q(".founder-card");if(f){if(p.founder.img)f.querySelector("img").src=p.founder.img;if(p.founder.name)f.querySelector("h2").textContent=p.founder.name;if(p.founder.role)f.querySelector(".role").textContent=p.founder.role;if(p.founder.bio)f.querySelector("p").innerHTML=p.founder.bio;}}
 if(p.story){var s=q("#story");if(s){if(p.story.title)s.querySelector("h3").textContent=p.story.title;if(p.story.text)s.querySelector("p").innerHTML=p.story.text;}}
 if(p.mission){var m=q("#mission");if(m){m.querySelector("h3").textContent=p.mission.title;m.querySelector("p").innerHTML=p.mission.text;}}
 if(p.vision){var v=q("#vision");if(v){v.querySelector("h3").textContent=p.vision.title;v.querySelector("p").innerHTML=p.vision.text;}}
 if(p.values&&p.values.length){var vg=q(".values-grid");if(vg)vg.innerHTML=p.values.map(function(x){return '<div class="value-item"><div class="icon">'+esc(x.icon)+'</div><b>'+esc(x.title)+'</b><p>'+esc(x.desc)+'</p></div>';}).join("");}
 if(p.delivery){var d=q("#delivery");if(d){d.querySelector("h3").textContent=p.delivery.title;d.querySelector("p").innerHTML=p.delivery.text;}}
 if(p.returns){var r=q("#returns");if(r){r.querySelector("h3").textContent=p.returns.title;r.querySelector("p").innerHTML=p.returns.text;}}
 if(p.payments){var pa=q("#payments");if(pa){pa.querySelector("h3").textContent=p.payments.title;pa.querySelector("p").innerHTML=p.payments.text;}}
 if(p.team&&p.team.length){var tg=q("#team .team-grid");if(tg)tg.innerHTML=p.team.map(function(x){return '<div class="team-card"><div class="icon">'+esc(x.icon)+'</div><b>'+esc(x.name)+'</b><span>'+esc(x.role)+'</span><p>'+esc(x.desc)+'</p></div>';}).join("");}
 if(p.history&&p.history.length){var tl=q("#history .timeline");if(tl)tl.innerHTML=p.history.map(function(x){return '<div class="t-item"><b>'+esc(x.title)+'</b><p>'+esc(x.text)+'</p></div>';}).join("");}
 if(p.achievements&&p.achievements.length){var al=q("#achievements .ach-list");if(al)al.innerHTML=p.achievements.map(function(x){return '<li>'+esc(x)+'</li>';}).join("");}
}
fetch("https://mohajon-mjh-default-rtdb.firebaseio.com/settings/aboutPage.json").then(function(r){return r.json();}).then(function(d){if(d&&d.page)apply(d.page);}).catch(function(){});
})();
