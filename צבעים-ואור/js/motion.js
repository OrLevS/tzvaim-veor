/* Motion layer (GSAP), in the spirit of the "why-sky-blue" explainer:
   kinetic headings word by word, letter-drop stage titles, elastic feedback, cover entrances,
   paper grain, spectrum progress. Everything is skipped when motion is off or reduced. */
(function(){
const on = () => typeof gsap!=='undefined' && window.APP_MOTION!==false && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
if(on()) document.documentElement.classList.add('gsap-on');

function splitWords(el){ if(el.dataset.split) return $$('.w',el); el.dataset.split=1;
  const t=el.textContent.trim(); el.setAttribute('aria-label',t);
  el.innerHTML=t.split(/\s+/).map(w=>`<span class="w" aria-hidden="true">${w}</span>`).join(' '); return $$('.w',el); }
function splitChars(el){ if(el.dataset.split) return $$('.c',el); el.dataset.split=1;
  const t=el.textContent.trim(); el.setAttribute('aria-label',t);
  el.innerHTML=t.split(/(\s+)/).map(w=>/\s/.test(w)?w:`<span class="wd">${[...w].map(c=>`<span class="c" aria-hidden="true">${c}</span>`).join('')}</span>`).join(''); return $$('.c',el); }

/* called by deck.js the first time a frame becomes visible */
function enter(f){
  /* text stays still — motion only in the graphics (cover art, simulations, timer) */
  if(!on()) return;
  const rule=f.querySelector('.rule'); if(rule) gsap.from(rule,{scaleX:0,duration:.8,ease:'power3.out'});
  const art=f.querySelector('.cover-art svg');
  if(art){ gsap.from(f.querySelector('.cover-art'),{scale:.94,opacity:0,duration:.8,ease:'power2.out'});
           if(art.querySelector('#heroSun')) heroScene(art); }
}

/* the lesson-1 cover: smiling sun, floating light-dots, ribbon */
function heroScene(svg){
  const sun=svg.querySelector('#heroSun'), rays=svg.querySelector('#heroRays'), rib=svg.querySelector('#heroRibbon');
  gsap.from(sun,{scale:0,svgOrigin:'0 0',duration:1,ease:'elastic.out(1,.5)',delay:.2});
  gsap.to(rays,{rotation:360,svgOrigin:'0 0',duration:40,repeat:-1,ease:'none'});
  if(rib){ const L=rib.getTotalLength(); gsap.fromTo(rib,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:1.8,ease:'power2.inOut',delay:.4}); }
  $$('.hero-dots circle',svg).forEach((c,i)=>{ gsap.from(c,{scale:0,transformOrigin:'center',transformBox:'fill-box',duration:.5,delay:.8+i*.06,ease:'back.out(2)'});
    gsap.to(c,{x:gsap.utils.random(-40,40),y:gsap.utils.random(-30,30),duration:gsap.utils.random(3,6),yoyo:true,repeat:-1,ease:'sine.inOut',delay:i*.2}); });
}

/* elastic feedback for anything you press */
document.addEventListener('click',e=>{
  if(!on()) return;
  const b=e.target.closest('.g-opt, .segs button, .sim-btn, .g-reveal, .tm-go, .card-c, .st-face, .m-node, .nm-tally button');
  if(b) gsap.fromTo(b,{scale:.93},{scale:1,duration:.55,ease:'elastic.out(1,.4)'});
},true);

/* reveal: the answer drops in word by word */
function reveal(el){ if(!on()) return; gsap.from(el,{opacity:0,duration:.5,ease:'power1.out'}); }

window.MOTION = {enter, reveal, on};
})();
