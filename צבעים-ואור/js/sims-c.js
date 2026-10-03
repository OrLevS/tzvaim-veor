/* Sims, part C — ported from the "why-sky-blue" motion explainer (video editing/why-sky-blue):
   prism + wavelength wave, the air "pinball" (replaces the old SVG sky sim) and the sunset path.
   Uses GSAP when available for the auto-play moments; works without it. */
(function(){
const S = window.SIMS;
const G = () => typeof gsap!=='undefined' && window.APP_MOTION!==false && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const STOPS=[[400,'#7B61C4'],[450,'#4A8FD6'],[500,'#2A9D8F'],[570,'#E9C46A'],[600,'#F4A261'],[640,'#E76F51'],[700,'#E76F51']];
const hex2rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgb2hex=a=>'#'+a.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
function lamColor(l){for(let i=0;i<STOPS.length-1;i++){const[a,ca]=STOPS[i],[b,cb]=STOPS[i+1];if(l<=b){const t=Math.max(0,(l-a)/(b-a));const A=hex2rgb(ca),B=hex2rgb(cb);return rgb2hex(A.map((v,k)=>v+(B[k]-v)*t))}}return STOPS[STOPS.length-1][1]}
const lamName=l=>l<425?'סגול':l<485?'כחול':l<540?'ירוק־טורקיז':l<585?'צהוב':l<620?'כתום':'אדום';
const BANDS=[{l:410,n:'סגול'},{l:460,n:'כחול'},{l:520,n:'ירוק'},{l:575,n:'צהוב'},{l:605,n:'כתום'},{l:680,n:'אדום'}];
BANDS.forEach(b=>b.c=lamColor(b.l));
const scat=l=>Math.pow(680/l,4);
function fitCanvas(c){const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x,w:r.width,h:r.height}}
const NS='http://www.w3.org/2000/svg';
S._lamColor = lamColor;

/* ---------- prism + wave ---------- */
S.prism = host => {
  const F = S._frame(host,'אור לבן הוא בעצם מסיבה של צבעים','המנסרה שוברת את האור (שבירה, לא פיזור): כל אורך גל משנה כיוון במידה קצת שונה, והצבעים נפרדים.');
  F.root.classList.add('sim-dark');
  F.view.innerHTML = `<div class="pw">
    <div><svg class="prism-svg" viewBox="0 0 600 320" role="img" aria-label="קרן אור לבנה נכנסת למנסרה ויוצאת מפורקת לצבעי הקשת">
      <line x1="600" y1="150" x2="345" y2="160" stroke="#FBF5ED" stroke-width="7" stroke-linecap="round"/>
      <g class="rays"></g>
      <line class="rayWhite" x1="262" y1="165" x2="10" y2="175" stroke="#FBF5ED" stroke-width="7" stroke-linecap="round"/>
      <path d="M300 60 L370 250 L230 250 Z" fill="rgba(251,245,237,.18)" stroke="#FBF5ED" stroke-width="3" stroke-linejoin="round"/>
    </svg></div>
    <div><canvas class="wave-canvas" aria-hidden="true"></canvas><p class="wave-read"><span class="readout"></span> ננומטר · <b class="lname"></b></p></div>
  </div>`;
  const rays=F.view.querySelector('.rays'), white=F.view.querySelector('.rayWhite');
  const els=BANDS.map(b=>{const l=document.createElementNS(NS,'line');l.setAttribute('stroke',b.c);l.setAttribute('stroke-width','7');l.setAttribute('stroke-linecap','round');rays.appendChild(l);return l});
  let spreadV=0;
  const draw=v=>{spreadV=v;const s=v/100;els.forEach((l,i)=>{const ang=(i-2.5)*s*.085+s*.10*(5-i)/5;l.setAttribute('x1',262);l.setAttribute('y1',165);l.setAttribute('x2',262-260*Math.cos(ang));l.setAttribute('y2',175+260*Math.sin(ang)*1.6-(5-i)*s*4)});
    white.style.opacity=Math.max(0,1-s*2.2);
    F.read.textContent=s<.08?'עכשיו: קרן לבנה אחת.':s<.5?'הצבעים מתחילים להיפרד…':'כל צבעי הקשת. הסגול משנה כיוון הכי הרבה, האדום הכי מעט.';};
  const sp=S._slider(F.ctrls,'כמה לפרק את האור?',0,100,0,1,v=>draw(v));
  let lam=650;
  const lamIn=S._slider(F.ctrls,'אורך הגל',400,700,lam,1,v=>{lam=v;upd();});
  const upd=()=>{F.view.querySelector('.readout').textContent=lam;const n=F.view.querySelector('.lname');n.textContent=lamName(lam);n.style.color=lamColor(lam);};
  upd(); draw(0);
  const wc=F.view.querySelector('.wave-canvas'); let W=fitCanvas(wc), phase=0;
  const stop=S._loop(()=>{const {x,w,h}=W; x.clearRect(0,0,w,h); const px=lam/7.2;
    x.lineWidth=2;x.strokeStyle='rgba(251,245,237,.18)';x.beginPath();for(let i=0;i<=w;i+=3){const y=h/2+Math.sin((i/(700/7.2))*Math.PI*2+phase)*h*.3;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke();
    x.lineWidth=5;x.lineCap='round';x.strokeStyle=lamColor(lam);x.beginPath();for(let i=0;i<=w;i+=2){const y=h/2+Math.sin((i/px)*Math.PI*2+phase)*h*.3;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke();
    x.strokeStyle='#FBF5ED';x.lineWidth=1.5;x.setLineDash([4,4]);const p0=((Math.PI/2-phase)/(2*Math.PI))*px;const s0=((p0%px)+px)%px;x.beginPath();x.moveTo(s0,18);x.lineTo(s0+px,18);x.stroke();x.setLineDash([]);
    x.fillStyle='#FBF5ED';x.beginPath();x.arc(s0,18,3,0,7);x.arc(s0+px,18,3,0,7);x.fill();
    phase-=.05;});
  const onR=()=>{W=fitCanvas(wc)}; addEventListener('resize',onR);
  if(G()){const o={v:0};gsap.to(o,{v:100,duration:2.2,delay:.4,ease:'power2.inOut',onUpdate:()=>{sp.value=o.v;draw(o.v)}});} else {sp.value=100;draw(100);}
  return {destroy(){stop();removeEventListener('resize',onR);}};
};

/* ---------- air pinball + observer: the main "why blue" graphic (combined with the explainer's video scenes) ---------- */
S.sky = host => {
  const F = S._frame(host,'האוויר הוא מכונת פינבול לאור','מודל מפושט: נקודות טורקיז = מולקולות אוויר. גל קצר (כחול, סגול) מתפזר הרבה יותר מגל ארוך (אדום) — בערך פי 6 בין כחול לאדום. הקווים הדקים: אור שהתפזר והגיע לעין.');
  F.root.classList.add('sim-dark','sim-hero');
  F.view.innerHTML = `<canvas class="sim-canvas big" role="img" aria-label="השמש שולחת חלקיקי אור בכל הצבעים. הכחולים והסגולים נתקלים במולקולות האוויר ומתפזרים לכל הכיוונים — וחלק מהם מגיע לעין של האדם מכל כיווני השמיים. האדומים ממשיכים כמעט ישר."></canvas>
    <div class="pb-row"><div class="pb-eye"><div class="swatch"></div><p class="pb-h">מה מגיע לעין<br>מהשמיים</p></div><div class="pb-bars"><p class="pb-h">כמה כל צבע מתפזר (אדום = 1)</p><div class="bars"></div></div></div>`;
  const sc=F.view.querySelector('canvas'); let SC=fitCanvas(sc);
  let mode='all', paused=false, dens=.45, mols=[], phs=[], beams=[], counts=BANDS.map(()=>0), seen=BANDS.map(()=>0), rot=0;
  const ground=()=>SC.h-56, eye=()=>({x:SC.w*.42, y:ground()-46});
  const initMols=()=>{mols=[];const n=Math.round(40+dens*100*1.6);for(let i=0;i<n;i++)mols.push({x:Math.random()*SC.w*.86,y:30+Math.random()*(ground()-70),f:0})};
  initMols();
  S._seg(F.ctrls,'איזה אור לשלוח',[['all','כל הצבעים'],['red','רק אדום'],['blue','רק כחול']],'all',k=>{mode=k;counts=BANDS.map(()=>0);seen=BANDS.map(()=>0);});
  S._slider(F.ctrls,'כמה אוויר יש בדרך?',0,100,45,1,v=>{dens=v/100;initMols();});
  const pb=S._btn(F.ctrls,'השהיה',()=>{paused=!paused;pb.textContent=paused?'המשך':'השהיה';},'ghost');
  const bars=F.view.querySelector('.bars'), maxS=scat(BANDS[0].l);
  BANDS.forEach(b=>{const d=document.createElement('div');d.style.background=b.c;d.style.height='0%';d.innerHTML=`<b>${scat(b.l).toFixed(1)}</b><span>${b.n}</span>`;bars.appendChild(d)});
  setTimeout(()=>[...bars.children].forEach((d,i)=>d.style.height=(scat(BANDS[i].l)/maxS*100)+'%'),300);
  const spawn=()=>{const idx=mode==='red'?5:mode==='blue'?1:Math.floor(Math.random()*6);const sy=50+Math.random()*(ground()-120);phs.push({x:SC.w-70,y:sy,vx:-2.6,vy:(Math.random()-.5)*.25,i:idx,sc:false,life:0})};
  const drawSun=(x,cx,cy)=>{ rot+=.004; x.save(); x.translate(cx,cy);
    const g=x.createRadialGradient(0,0,10,0,0,150);g.addColorStop(0,'rgba(233,196,106,.55)');g.addColorStop(1,'rgba(233,196,106,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,150,0,7);x.fill();
    x.rotate(rot); x.strokeStyle='#E9C46A'; x.lineWidth=5; x.lineCap='round';
    for(let k=0;k<8;k++){ x.rotate(Math.PI/4); x.beginPath(); x.moveTo(0,-52); x.quadraticCurveTo(10,-62,0,-74); x.stroke(); }
    x.rotate(-rot); x.fillStyle='#E9C46A'; x.beginPath(); x.arc(0,0,40,0,7); x.fill();
    x.fillStyle='#5A2A0C'; x.beginPath(); x.arc(-12,-5,3.6,0,7); x.arc(12,-5,3.6,0,7); x.fill();
    x.strokeStyle='#5A2A0C'; x.lineWidth=3; x.beginPath(); x.moveTo(-11,11); x.quadraticCurveTo(0,21,11,11); x.stroke(); x.restore(); };
  const drawPerson=(x)=>{ const e=eye(), gx=e.x, gy=ground(); x.strokeStyle='#FBF5ED'; x.fillStyle='#FBF5ED'; x.lineWidth=5; x.lineCap='round';
    x.beginPath(); x.arc(gx,gy-46,11,0,7); x.fill(); x.beginPath(); x.moveTo(gx,gy-35); x.lineTo(gx,gy-12); x.moveTo(gx-12,gy-28); x.lineTo(gx,gy-22); x.lineTo(gx+12,gy-28); x.moveTo(gx,gy-12); x.lineTo(gx-9,gy+6); x.moveTo(gx,gy-12); x.lineTo(gx+9,gy+6); x.stroke();
    x.fillStyle='#264653'; x.beginPath(); x.arc(gx+4,gy-47,2.4,0,7); x.fill(); };
  const stop=S._loop(()=>{const {x,w,h}=SC, gy=ground(), e=eye();
    x.fillStyle='rgba(27,51,61,.45)'; x.fillRect(0,0,w,h);
    drawSun(x,w-62,62);
    mols.forEach(m=>{m.f=Math.max(0,m.f-.04);x.fillStyle=m.f?`rgba(251,245,237,${.35+m.f*.6})`:'rgba(42,157,143,.75)';x.beginPath();x.arc(m.x,m.y,2.4+m.f*5,0,7);x.fill()});
    if(!paused) for(let k=0;k<2;k++) spawn();
    phs.forEach(p=>{ if(!paused){ p.x+=p.vx; p.y+=p.vy; p.life++;
        if(!p.sc && p.x<w-110 && Math.random()<.0016*dens*scat(BANDS[p.i].l)*3.2){ const a=Math.random()*Math.PI*2; p.vx=Math.cos(a)*2.6; p.vy=Math.sin(a)*2.6; counts[p.i]++; p.sc=true; p.sx=p.x; p.sy=p.y;
          let best=null,bd=1e9; for(const m of mols){const d=(m.x-p.x)**2+(m.y-p.y)**2; if(d<bd){bd=d;best=m}} if(best&&bd<900) best.f=1; }
        if(p.sc && !p.hit && (p.x-e.x)**2+(p.y-e.y)**2<46*46){ p.hit=true; seen[p.i]++; beams.push({x:p.sx,y:p.sy,c:BANDS[p.i].c,a:1}); } }
      x.fillStyle=BANDS[p.i].c; x.beginPath(); x.arc(p.x,p.y,p.sc?3.2:2.6,0,7); x.fill(); });
    phs=phs.filter(p=>p.x>-10&&p.x<w+10&&p.y>-10&&p.y<gy&&p.life<900&&!p.hit); if(phs.length>700) phs.splice(0,phs.length-700);
    beams.forEach(b=>{ x.strokeStyle=b.c; x.globalAlpha=b.a*.85; x.lineWidth=2; x.setLineDash([5,5]); x.beginPath(); x.moveTo(b.x,b.y); x.lineTo(e.x,e.y); x.stroke(); x.setLineDash([]); x.globalAlpha=1; if(!paused) b.a-=.012; });
    beams=beams.filter(b=>b.a>0); if(beams.length>40) beams.splice(0,beams.length-40);
    x.fillStyle='#2A9D8F'; x.beginPath(); x.moveTo(0,gy+10); x.quadraticCurveTo(w*.5,gy-18,w,gy+10); x.lineTo(w,h); x.lineTo(0,h); x.closePath(); x.fill();
    drawPerson(x);
    x.fillStyle='rgba(251,245,237,.85)'; x.font='15px Rubik'; x.textAlign='right'; x.fillText('השמש',w-14,h-14); x.textAlign='center'; x.fillText('העין שלנו',e.x,h-12);
  });
  const sw=F.view.querySelector('.swatch');
  const iv=setInterval(()=>{ const tot=seen.reduce((a,b)=>a+b,0)||1, totS=counts.reduce((a,b)=>a+b,0); let mix=[0,0,0]; seen.forEach((c,i)=>{const r=hex2rgb(BANDS[i].c);mix=mix.map((v,k)=>v+r[k]*c/tot)}); if(seen.some(Boolean)) sw.style.background=rgb2hex(mix.map(v=>v+(255-v)*.25));
    const red=counts[5]||1;
    F.read.textContent = mode==='all' ? `מהשמיים הגיעו לעין ${seen.reduce((a,b)=>a+b,0)} חלקיקים מפוזרים — רובם כחולים וסגולים. כחולים התפזרו פי ${(counts[1]/red).toFixed(1)} מאדומים.`
      : mode==='red' ? `רק ${totS} אדומים התפזרו — כמעט שום אור אדום לא מגיע לעין מהשמיים.` : `${totS} כחולים התפזרו — והם מגיעים לעין מכל הכיוונים.`; },600);
  const ro = new ResizeObserver(()=>{ SC=fitCanvas(sc); initMols(); }); ro.observe(sc);
  return {destroy(){stop();clearInterval(iv);ro.disconnect();}};
};

/* ---------- sunset ---------- */
S.sunset = host => {
  const F = S._frame(host,'ולמה השקיעה כתומה?','מודל פשוט (אוויר נקי, בלי אבק ועננים) — אבל המגמה אמיתית: ככה שהדרך באוויר ארוכה יותר, יותר כחול מתפזר הצידה לפני שהאור מגיע אלינו.');
  F.view.innerHTML = `<div class="ss"><svg class="sunset-svg" viewBox="0 0 800 440" role="img" aria-label="השמש זזה לאורך היום. ככל שהיא נמוכה יותר, הדרך של האור באוויר ארוכה יותר והשמיים משנים צבע.">
      <defs><linearGradient id="ssSky" x1="0" y1="0" x2="0" y2="1"><stop class="t" offset="0" stop-color="#8FC3E6"/><stop class="b" offset="1" stop-color="#FBF5ED"/></linearGradient>
      <radialGradient id="ssGlow"><stop offset="0" stop-color="#E9C46A" stop-opacity=".7"/><stop offset="1" stop-color="#E9C46A" stop-opacity="0"/></radialGradient></defs>
      <rect width="800" height="440" fill="url(#ssSky)"/>
      <path d="M0 150 Q400 70 800 150" fill="none" stroke="#FBF5ED" stroke-width="2" stroke-dasharray="6 8" opacity=".75"/>
      <text x="790" y="140" font-size="16" fill="#264653" text-anchor="end" font-family="Rubik" direction="rtl">גבול האטמוספרה</text>
      <circle class="glow" r="70" fill="url(#ssGlow)"/><line class="path" stroke="#FBF5ED" stroke-width="5" stroke-dasharray="3 10" stroke-linecap="round"/>
      <circle class="sun" r="30" fill="#E9C46A"/>
      <path d="M0 370 Q400 330 800 370 V440 H0Z" fill="#2A9D8F"/>
      <g transform="translate(400 348)"><circle cy="-30" r="11" fill="#264653"/><path d="M0-19 V8 M-12 -6 L0 -12 L12 -6 M0 8 L-9 26 M0 8 L9 26" stroke="#264653" stroke-width="5" stroke-linecap="round" fill="none"/></g>
    </svg>
    <aside class="ss-side"><p class="pb-h">כמה מכל צבע מגיע ישר מהשמש?</p><div class="bars tb"></div><p class="ss-time"><span class="readout"></span> · הדרך באוויר ארוכה <b class="am"></b></p></aside></div>`;
  const q=s=>F.view.querySelector(s), tb=q('.tb');
  BANDS.forEach(b=>{const d=document.createElement('div');d.style.background=b.c;d.innerHTML=`<b></b><span>${b.n}</span>`;tb.appendChild(d)});
  const mixC=(a,b,t)=>rgb2hex(hex2rgb(a).map((v,k)=>v+(hex2rgb(b)[k]-v)*t));
  const sunset=v=>{const elev=Math.max(-4,90-Math.abs(v-50)*1.88), e=elev*Math.PI/180;
    const sx=v<50?400-Math.cos(e)*340:400+Math.cos(e)*340, sy=360-Math.sin(e)*290;
    ['sun','glow'].forEach(c=>{q('.'+c).setAttribute('cx',sx);q('.'+c).setAttribute('cy',sy)});
    const am=elev>0?Math.min(38,1/(Math.sin(e)+.15*Math.pow(elev+3.885,-1.253))):38;
    const p=q('.path');p.setAttribute('x1',400);p.setAttribute('y1',318);p.setAttribute('x2',400+(sx-400)*.72);p.setAttribute('y2',318+(sy-318)*.72);
    const T=BANDS.map(b=>Math.exp(-.12*scat(b.l)*.45*am));
    [...tb.children].forEach((d,i)=>{d.style.height=Math.max(2,T[i]*100)+'%';d.querySelector('b').textContent=Math.round(T[i]*100)+'%'});
    let top,bot,sun; if(elev>30){top='#8FC3E6';bot='#FBF5ED';sun='#E9C46A'} else if(elev>10){const k=(30-elev)/20;top=mixC('#8FC3E6','#4A8FD6',k*.4);bot=mixC('#FBF5ED','#E9C46A',k);sun=mixC('#E9C46A','#F4A261',k)} else if(elev>0){const k=(10-elev)/10;top=mixC('#6FA6D8','#264653',k*.7);bot=mixC('#E9C46A','#E76F51',k);sun=mixC('#F4A261','#E76F51',k)} else {top='#264653';bot='#5A2A0C';sun='#E76F51'}
    q('.t').setAttribute('stop-color',top);q('.b').setAttribute('stop-color',bot);q('.sun').setAttribute('fill',sun);
    const hrs=6+v/100*12.5,hh=Math.floor(hrs),mm=Math.round((hrs-hh)*60/5)*5; q('.readout').textContent=`${hh}:${String(mm%60).padStart(2,'0')}`;
    q('.am').textContent=`פי ${am<10?am.toFixed(1):Math.round(am)}`;
    F.read.textContent = elev>30?'בצהריים הדרך באוויר קצרה — רוב הצבעים מגיעים.' : elev>0?'השמש יורדת: הכחול והסגול ״נעלמים״ ראשונים, כי הם מתפזרים הכי הרבה.' : 'בשקיעה כמעט רק כתום ואדום מגיעים ישר מהשמש.';};
  const sa=S._slider(F.ctrls,'שעה ביום',0,100,50,1,v=>sunset(v)); sunset(50);
  if(G()){const o={v:50};gsap.to(o,{v:96,duration:3,delay:.5,ease:'power1.inOut',onUpdate:()=>{sa.value=o.v;sunset(o.v)}});}
  return {destroy(){}};
};
})();
