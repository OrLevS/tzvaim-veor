/* מערכת ההובלה — הדמיות למסך המשותף.
   משתמש בעזרים המשותפים מ־צבעים-ואור/js/sims-a.js (S._frame, _slider, _seg, _btn, _loop).
   כל הדמיה: SIMS[id](host) → {destroy}. */
(function(){
const S = window.SIMS;
const G = () => typeof gsap!=='undefined' && window.APP_MOTION!==false && !matchMedia('(prefers-reduced-motion: reduce)').matches;
const RICH='#E04B3A', POOR='#7A2433', O2='#E9C46A', CO2='#8FA3A8', GLU='#2A9D8F', NAVY='#264653', CREAM='#FBF5ED', BEIGE='#E6D3B9';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tx=(x,y,s,o={})=>`<text x="${x}" y="${y}" direction="rtl" text-anchor="${o.a||'middle'}" font-size="${o.s||15}" fill="${o.f||NAVY}" ${o.w?`font-weight="${o.w}"`:''} font-family="Rubik,system-ui,sans-serif">${s}</text>`;
function fit(c){const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=Math.max(1,r.width*d);c.height=Math.max(1,r.height*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x,w:r.width,h:r.height};}
function rr(x,X,Y,W,H,R){x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath();}
const legend = items => `<div class="hv-legend">${items.map(([c,t])=>`<span><i style="background:${c}"></i>${t}</span>`).join('')}</div>`;

/* ================= 1. diffusion vs. blood flow ================= */
S.diffusion = host => {
  const F = S._frame(host,'דיפוזיה לבד, או זרם דם?','מודל מפושט: נקודות צהובות = חמצן. התאים משתמשים בחמצן כל הזמן. המרחקים והזמנים בהדמיה אינם בקנה מידה אמיתי — בגוף, הפער גדול עוד הרבה יותר.');
  F.root.classList.add('sim-dark','sim-hero');
  F.view.innerHTML = `<canvas class="sim-canvas big" role="img" aria-label="ריאה בצד ימין ושבעה תאים בשורה עד הבוהן. במצב דיפוזיה החמצן מגיע רק לתאים הקרובים; במצב זרם דם הוא מגיע לכולם."></canvas>${legend([[O2,'חמצן'],['#3d6470','תא (עמודה = כמות חמצן בתא)']])}`;
  const cv=F.view.querySelector('canvas'); let W=fit(cv);
  let mode='diff', parts=[], cells=[], t=0;
  const N=7;
  const reset=()=>{parts=[]; cells=Array.from({length:N},()=>({o:0})); t=0;};
  reset();
  S._seg(F.ctrls,'איך החמצן זז?',[['diff','רק דיפוזיה'],['flow','עם זרם דם']],mode,k=>{mode=k;reset();});
  S._btn(F.ctrls,'↺ מההתחלה',reset,'ghost');
  const geo=()=>{const {w,h}=W; const lungX=w-90, x0=lungX-110, x1=70; const cy=h*.40, vy=h*.70;
    return {w,h,lungX,cy,vy,xs:Array.from({length:N},(_,i)=>x0-(x0-x1)*i/(N-1))};};
  const stop=S._loop(dt=>{
    const g=geo(), {x,w,h}=W; t+=dt/1000;
    // spawn
    const spawn = mode==='diff'?3:5;
    for(let i=0;i<spawn;i++){
      if(mode==='diff') parts.push({x:g.lungX-30+Math.random()*20,y:g.cy+(Math.random()-.5)*60,vx:0,vy:0,life:1});
      else parts.push({x:g.lungX-20,y:g.vy+(Math.random()-.5)*16,flow:true,life:1});
    }
    parts.forEach(p=>{
      if(p.flow){ p.x-=2.6*dt/16; p.y+= (Math.random()-.5)*1.2; p.y=clamp(p.y,g.vy-10,g.vy+10);
        g.xs.forEach((cx,i)=>{ if(Math.abs(p.x-cx)<14 && Math.random()<.03){ p.flow=false; p.hop=i; p.tx=cx+(Math.random()-.5)*30; p.ty=g.cy+18; } });
        if(p.x<30) p.life=0;
      } else if(p.hop!==undefined){ p.x+=(p.tx-p.x)*.12; p.y+=(p.ty-p.y)*.12; if(Math.abs(p.y-p.ty)<3){ cells[p.hop].o=Math.min(100,cells[p.hop].o+2.2); p.life=0; } }
      else { p.x+=(Math.random()-.5)*22; p.y+=(Math.random()-.5)*22; p.y=clamp(p.y,g.cy-70,g.cy+70); p.x=Math.min(p.x,g.lungX-10);
        g.xs.forEach((cx,i)=>{ if(Math.abs(p.x-cx)<26 && Math.abs(p.y-g.cy)<34 && Math.random()<.03){ cells[i].o=Math.min(100,cells[i].o+2.2); p.life=0; } });
        p.life-=.0022*dt/16; }
    });
    parts=parts.filter(p=>p.life>0); if(parts.length>1400) parts.splice(0,parts.length-1400);
    cells.forEach(c=>c.o=Math.max(0,c.o-.05*dt/16)); // cells keep using oxygen
    // draw
    x.clearRect(0,0,w,h);
    // lung
    x.fillStyle='#F4A261'; x.globalAlpha=.9; rr(x,g.lungX-20,g.cy-80,90,160,40); x.fill(); x.globalAlpha=1;
    x.fillStyle=CREAM; x.font='600 15px Rubik'; x.textAlign='center'; x.direction='rtl'; x.fillText('ריאה',g.lungX+25,g.cy+6);
    if(mode==='flow'){ x.strokeStyle=RICH; x.globalAlpha=.55; x.lineWidth=26; x.lineCap='round'; x.beginPath(); x.moveTo(g.lungX-10,g.vy); x.lineTo(40,g.vy); x.stroke(); x.globalAlpha=1;
      x.fillStyle=CREAM; x.font='13px Rubik'; x.fillText('← כלי דם: הלב דוחף את הדם',w/2,g.vy+34); }
    // cells
    g.xs.forEach((cx,i)=>{ const c=cells[i];
      x.fillStyle='#3d6470'; rr(x,cx-24,g.cy-30,48,60,14); x.fill();
      x.fillStyle=O2; const bh=50*c.o/100; rr(x,cx-6,g.cy+25-bh,12,Math.max(1,bh),4); x.fill();
      x.fillStyle='#bcd0cf'; x.font='12px Rubik'; x.fillText(`תא ${i+1}`,cx,g.cy-38);
    });
    x.fillStyle=CREAM; x.font='600 14px Rubik';
    x.fillText('קרוב לריאה',g.xs[0],g.cy+52); x.fillText('רחוק (הבוהן)',g.xs[N-1],g.cy+52);
    // particles
    x.fillStyle=O2; parts.forEach(p=>{x.beginPath();x.arc(p.x,p.y,2.6,0,7);x.fill();});
    // readout
    if(Math.round(t*10)%5===0){ const far=(cells[4].o+cells[5].o+cells[6].o)/3, near=(cells[0].o+cells[1].o)/2;
      F.read.textContent = t<2 ? 'מתחילים… עקבו אחרי העמודות הצהובות בתאים.'
        : mode==='diff' ? (far<8 ? `התאים הקרובים מקבלים חמצן (${Math.round(near)}%), אבל לתאים הרחוקים כמעט לא מגיע — דיפוזיה איטית מדי למרחקים ארוכים.` : 'גם לתאים רחוקים מגיע מעט — אבל לאט, ובגוף אמיתי המרחק גדול פי אלפים.')
        : `עם זרם: החמצן נישא במהירות לאורך כלי הדם, ועובר בדיפוזיה רק בצעד הקצר האחרון — לכל התאים, גם לרחוקים (${Math.round(far)}%).`; }
  });
  const onR=()=>{W=fit(cv)}; addEventListener('resize',onR);
  return {destroy(){stop();removeEventListener('resize',onR);}};
};

/* ================= 2. artery / vein / capillary ================= */
S.vessels = host => {
  const F = S._frame(host,'שלושה סוגי כלי דם','החתכים אינם בקנה מידה: נים צר פי מאות מעורק גדול.');
  const INFO={
    a:{n:'עורק',rows:[['כיוון','מהלב אל הגוף (״עורק = עוזב את הלב״)'],['דופן','עבה, שרירית וגמישה'],['לחץ','גבוה — מרגישים בו דופק'],['מיוחד','נמתח בכל פעימה וחוזר לצורתו']]},
    v:{n:'וריד',rows:[['כיוון','מהגוף בחזרה אל הלב'],['דופן','דקה יותר, חלל רחב'],['לחץ','נמוך'],['מיוחד','בוורידי הגפיים: שסתומים שמונעים זרימה אחורה; שרירי הרגליים ״סוחטים״ את הוורידים']]},
    c:{n:'נים',rows:[['כיוון','מחבר בין עורקים קטנים לוורידים קטנים'],['דופן','שכבת תאים אחת בלבד'],['רוחב','כמעט כמו תא דם אדום אחד — התאים עוברים בטור'],['מיוחד','רק כאן חומרים עוברים בין הדם לתאים']]}
  };
  F.view.innerHTML=`<div class="vs"><svg viewBox="0 0 640 260" class="sim-svg" role="img" aria-label="חתך של עורק, וריד ונים">
    <rect width="640" height="260" fill="#fffdf8"/>
    <g class="vs-g" data-k="a" transform="translate(520,120)"><circle r="78" fill="#e9a397"/><circle r="78" fill="none" stroke="#b5483a" stroke-width="3"/><circle r="34" fill="${RICH}"/><circle r="50" fill="none" stroke="#c96a5c" stroke-width="2" stroke-dasharray="3 5"/>${tx(0,112,'עורק',{s:17,w:700})}</g>
    <g class="vs-g" data-k="v" transform="translate(310,120)"><path d="M-80 -20 Q-70 -70 0 -66 Q78 -64 80 -10 Q84 50 10 62 Q-76 70 -80 -20Z" fill="#d9a3ad"/><path d="M-66 -18 Q-58 -56 0 -54 Q66 -52 68 -10 Q70 42 8 50 Q-62 56 -66 -18Z" fill="${POOR}"/><path d="M-30 -52 Q0 -10 -2 30 M30 -50 Q4 -10 2 30" stroke="#f3d6db" stroke-width="5" fill="none" stroke-linecap="round"/>${tx(0,112,'וריד',{s:17,w:700})}${tx(0,-76,'שסתום',{s:12,f:'#7A2433'})}</g>
    <g class="vs-g" data-k="c" transform="translate(110,120)"><circle r="26" fill="none" stroke="#c96a5c" stroke-width="4"/><circle r="22" fill="#f6d5cf"/><ellipse rx="17" ry="11" fill="${RICH}"/><circle r="5" cy="-26" fill="#c96a5c"/>${tx(0,112,'נים',{s:17,w:700})}${tx(0,60,'(מוגדל מאוד)',{s:12,f:'#5d5148'})}</g>
  </svg><div class="vs-card" aria-live="polite"><p class="vs-hint">לחצו על כלי דם — או על הכפתורים.</p></div></div>`;
  const card=F.view.querySelector('.vs-card');
  const show=k=>{const I=INFO[k]; F.view.querySelectorAll('.vs-g').forEach(g=>g.classList.toggle('on',g.dataset.k===k));
    card.innerHTML=`<h4>${I.n}</h4><dl>${I.rows.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
    if(G()) gsap.from(card,{opacity:0,y:10,duration:.4});
    seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));
    F.read.textContent = k==='a'?'הדופן העבה עומדת בלחץ הגבוה שהלב יוצר.':k==='v'?'הלחץ נמוך — ולכן השסתומים חשובים כדי שהדם לא ״ייפול״ חזרה לרגליים.':'דופן דקה = מרחק קצרצר לדיפוזיה. זו ״נקודת המסירה״.';};
  const seg=S._seg(F.ctrls,'כלי דם',[['a','עורק'],['v','וריד'],['c','נים']],null,show);
  F.view.querySelectorAll('.vs-g').forEach(g=>{g.style.cursor='pointer'; g.addEventListener('click',()=>show(g.dataset.k));});
  return {destroy(){}};
};

/* ================= 3. blood components ================= */
S.blood = host => {
  const F = S._frame(host,'ממה עשוי הדם?','אחוזים משוערים לדם של אדם בריא. דם שעומד במבחנה עם חומר נגד קרישה, או שמסובבים במַרכֵּזָה, נפרד לשכבות.');
  const INFO={
    p:{n:'פלזמה · כ־55%',t:'נוזל צהבהב, ברובו מים. נושא חומרים מומסים: גלוקוז, חומצות אמינו, מלחים, הורמונים, את רוב הפחמן הדו־חמצני ופסולת כמו שתנן. וגם חום.'},
    w:{n:'תאי דם לבנים וטסיות · פחות מ־1%',t:'תאי דם לבנים: מגינים על הגוף מפני חיידקים ונגיפים. טסיות: שברי תאים קטנים שעוזרים לדם להיקרש ולסגור פצע.'},
    r:{n:'תאי דם אדומים · כ־45%',t:'מכילים המוגלובין — חלבון שקושר חמצן בריאות ומשחרר אותו ליד התאים. צורתם דיסקית שקועה, והם גמישים מספיק כדי לעבור בנימים צרים. בטיפה אחת של דם — מיליוני תאים אדומים.'}
  };
  F.view.innerHTML=`<div class="bl"><svg viewBox="0 0 640 300" class="sim-svg" role="img" aria-label="מבחנת דם שנפרדת לשלוש שכבות">
    <rect width="640" height="300" fill="#fffdf8"/>
    <g transform="translate(470,20)">
      <path d="M0 0 H70 V230 Q70 262 35 262 Q0 262 0 230Z" fill="#fff" stroke="${NAVY}" stroke-width="3"/>
      <clipPath id="tube"><path d="M2 2 H68 V230 Q68 260 35 260 Q2 260 2 230Z"/></clipPath>
      <g clip-path="url(#tube)">
        <rect class="bl-mix" x="0" y="20" width="70" height="250" fill="#b33a3a"/>
        <g class="bl-layers" opacity="0">
          <rect class="bl-l" data-k="p" x="0" y="20" width="70" height="132" fill="#F2D27A"/>
          <rect class="bl-l" data-k="w" x="0" y="152" width="70" height="6" fill="#f4f1ea"/>
          <rect class="bl-l" data-k="r" x="0" y="158" width="70" height="112" fill="#a32630"/>
        </g>
      </g>
    </g>
    <g class="bl-labels" opacity="0">${tx(455,95,'פלזמה →',{a:'start',s:14})}${tx(455,160,'לבנים + טסיות →',{a:'start',s:14})}${tx(455,220,'אדומים →',{a:'start',s:14})}</g>
    <g class="bl-micro" transform="translate(150,150)"></g>
  </svg><div class="vs-card" aria-live="polite"><p class="vs-hint">קודם: ״לתת לדם לעמוד״. מה יעלה למעלה, ומה ישקע?</p></div></div>`;
  const q=s=>F.view.querySelector(s), card=F.view.querySelector('.vs-card');
  const micro={
    r:`${[[-70,-40],[0,-60],[70,-30],[-40,30],[40,40],[-100,40],[100,60]].map(([x,y])=>`<g transform="translate(${x},${y})"><ellipse rx="28" ry="24" fill="#c0392b"/><ellipse rx="12" ry="9" fill="#e07a6e"/></g>`).join('')}`,
    w:`<g><circle r="40" fill="#efe9f6" stroke="#9d8cc0" stroke-width="3"/><path d="M-18 -10 Q0 -30 18 -8 Q30 12 6 18 Q-20 24 -18 -10Z" fill="#7B61C4"/></g>${[[-90,50],[90,-40],[80,60]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#d9a3ad"/>`).join('')}${tx(0,90,'תא לבן · טסיות קטנות',{s:13})}`,
    p:`${[[-80,-40,GLU],[-20,-70,GLU],[50,-30,CO2],[90,40,GLU],[-60,40,CO2],[10,30,'#F4A261'],[-110,-5,'#F4A261']].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`).join('')}${tx(0,90,'מומסים בפלזמה: גלוקוז · פחמן דו־חמצני · שתנן ועוד',{s:13})}`
  };
  let sep=false;
  const separate=()=>{ if(sep) return; sep=true;
    if(G()){ gsap.to(q('.bl-mix'),{opacity:0,duration:1.6}); gsap.to([q('.bl-layers'),q('.bl-labels')],{opacity:1,duration:1.6}); }
    else { q('.bl-mix').setAttribute('opacity',0); q('.bl-layers').setAttribute('opacity',1); q('.bl-labels').setAttribute('opacity',1); }
    card.innerHTML='<p class="vs-hint">לחצו על שכבה (או על הכפתורים) כדי להכיר אותה.</p>';
    F.read.textContent='הדם נפרד: תאי הדם האדומים כבדים ושוקעים, הפלזמה נשארת למעלה.'; };
  const show=k=>{ separate(); const I=INFO[k]; card.innerHTML=`<h4>${I.n}</h4><p>${I.t}</p>`; q('.bl-micro').innerHTML=micro[k];
    F.view.querySelectorAll('.bl-l').forEach(r=>r.setAttribute('stroke',r.dataset.k===k?NAVY:'none')); F.view.querySelectorAll('.bl-l').forEach(r=>r.setAttribute('stroke-width',3));
    if(G()) gsap.from(q('.bl-micro').children,{scale:0,transformOrigin:'center',transformBox:'fill-box',duration:.5,stagger:.05,ease:'back.out(2)'});
    seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k)); };
  S._btn(F.ctrls,'⏳ לתת לדם לעמוד',separate);
  const seg=S._seg(F.ctrls,'שכבה',[['p','פלזמה'],['w','לבנים וטסיות'],['r','אדומים']],null,show);
  F.view.querySelectorAll('.bl-l').forEach(r=>{r.style.cursor='pointer'; r.addEventListener('click',()=>show(r.dataset.k));});
  return {destroy(){}};
};

/* ================= 4. capillaries: structure → function ================= */
S.capillary = host => {
  const F = S._frame(host,'למה הנימים דקים ורבים?','מודל מפושט: כל ריבוע הוא תא. צבע צהוב חזק = התא מקבל מספיק חמצן. הקצבים יחסיים בלבד.');
  F.root.classList.add('sim-dark','sim-hero');
  F.view.innerHTML=`<canvas class="sim-canvas big" role="img" aria-label="רקמה עם נימים. ככל שהדופן דקה יותר והנימים רבים יותר, יותר תאים מקבלים חמצן."></canvas>`;
  const cv=F.view.querySelector('canvas'); let W=fit(cv);
  let wall=1, n=2, parts=[];
  S._slider(F.ctrls,'עובי דופן הנים (שכבות תאים)',1,5,wall,1,v=>{wall=v;parts=[];});
  S._seg(F.ctrls,'כמה נימים ברקמה?',[['1','1'],['2','2'],['4','4']],'2',k=>{n=+k;parts=[];});
  const COLS=14, ROWS=8;
  const stop=S._loop(dt=>{
    const {x,w,h}=W; x.clearRect(0,0,w,h);
    const pad=30, cw=(w-2*pad)/COLS, ch=(h-2*pad)/ROWS;
    const caps=Array.from({length:n},(_,i)=>pad+(h-2*pad)*(i+.5)/n);
    const lam=ch*1.5, rate=1/wall;
    let ok=0;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const cy=pad+ch*(r+.5), d=Math.min(...caps.map(y=>Math.abs(y-cy)));
      const lvl=clamp(rate*Math.exp(-d/lam)*1.15,0,1); if(lvl>.45) ok++;
      x.fillStyle=`rgba(233,196,106,${.12+lvl*.8})`; rr(x,pad+c*cw+3,pad+r*ch+3,cw-6,ch-6,6); x.fill();
    }
    caps.forEach(y=>{ x.strokeStyle=RICH; x.lineWidth=14; x.lineCap='round'; x.beginPath(); x.moveTo(pad-10,y); x.lineTo(w-pad+10,y); x.stroke();
      x.strokeStyle=`rgba(251,245,237,.85)`; x.lineWidth=wall*2; x.beginPath(); x.moveTo(pad-10,y-8); x.lineTo(w-pad+10,y-8); x.moveTo(pad-10,y+8); x.lineTo(w-pad+10,y+8); x.stroke(); });
    // oxygen leaving capillaries
    if(Math.random()<.9) for(let k=0;k<n;k++){ if(Math.random()<rate*1.6) parts.push({x:pad+Math.random()*(w-2*pad),y:caps[k],vy:(Math.random()<.5?-1:1)*(.4+Math.random()*.5)*rate*1.2,life:1}); }
    parts.forEach(p=>{p.y+=p.vy*dt/16; p.x+=(Math.random()-.5)*1.2; p.life-=.008*dt/16;});
    parts=parts.filter(p=>p.life>0); x.fillStyle=O2; parts.forEach(p=>{x.globalAlpha=p.life; x.beginPath(); x.arc(p.x,p.y,2.4,0,7); x.fill();}); x.globalAlpha=1;
    const tot=COLS*ROWS, pct=Math.round(ok/tot*100);
    F.read.textContent=`תאים שמקבלים מספיק חמצן: ${pct}% · ${wall===1?'דופן של שכבה אחת — המעבר מהיר.':'דופן עבה — המעבר איטי יותר.'} ${n===4?'הרבה נימים: כל תא קרוב לנים.':n===1?'נים אחד: התאים הרחוקים ממנו נשארים בלי מספיק.':''}`;
  });
  const onR=()=>{W=fit(cv)}; addEventListener('resize',onR);
  return {destroy(){stop();removeEventListener('resize',onR);}};
};

/* ================= 5. pulse: 15-second timer + class data ================= */
S.pulse = host => {
  const F = S._frame(host,'מודדים דופק','סופרים 15 שניות ומכפילים ב־4. כאן אוספים מספרים מהכיתה (בלי שמות) — ההדמיה מחשבת ממוצע לדקה.');
  F.view.innerHTML=`<div class="pl">
    <div class="pl-timer"><button type="button" class="pl-go">▶ 15 שניות</button><output class="pl-out">15</output></div>
    <div class="pl-data">
      <label><span>במנוחה — ספירות של 15 שניות (מופרדות בפסיק)</span><input class="pl-in" data-k="rest" inputmode="numeric" placeholder="למשל: 18, 20, 17, 21"></label>
      <label><span>אחרי מאמץ — ספירות של 15 שניות</span><input class="pl-in" data-k="ex" inputmode="numeric" placeholder="למשל: 28, 31, 26, 30"></label>
    </div>
    <div class="pl-res">
      <div class="pl-col" data-k="rest"><svg viewBox="-60 -55 120 110" class="pl-heart"><path d="M0 40 C-60 0 -45 -45 -12 -38 C-4 -36 0 -28 0 -22 C0 -28 4 -36 12 -38 C45 -45 60 0 0 40Z" fill="${RICH}"/></svg><b class="pl-bpm">–</b><span>במנוחה (לדקה)</span></div>
      <div class="pl-col" data-k="ex"><svg viewBox="-60 -55 120 110" class="pl-heart"><path d="M0 40 C-60 0 -45 -45 -12 -38 C-4 -36 0 -28 0 -22 C0 -28 4 -36 12 -38 C45 -45 60 0 0 40Z" fill="${RICH}"/></svg><b class="pl-bpm">–</b><span>אחרי מאמץ (לדקה)</span></div>
    </div></div>`;
  const q=s=>F.view.querySelector(s); let tid=null;
  q('.pl-go').addEventListener('click',()=>{ if(tid){clearInterval(tid);tid=null;q('.pl-go').textContent='▶ 15 שניות';q('.pl-out').textContent='15';return;}
    let left=15; q('.pl-out').textContent=left; q('.pl-out').classList.remove('done'); q('.pl-go').textContent='■ עצירה';
    tid=setInterval(()=>{left--; q('.pl-out').textContent=left; if(left<=0){clearInterval(tid);tid=null;q('.pl-out').textContent='סוף!';q('.pl-out').classList.add('done');q('.pl-go').textContent='▶ 15 שניות';}},1000); });
  const avg=s=>{const a=String(s).split(/[,\s،]+/).map(Number).filter(v=>v>0&&v<80); return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;};
  const upd=()=>{ const r=avg(q('.pl-in[data-k=rest]').value), e=avg(q('.pl-in[data-k=ex]').value);
    [['rest',r],['ex',e]].forEach(([k,v])=>{ const col=q(`.pl-col[data-k=${k}]`); const bpm=v?Math.round(v*4):null;
      col.querySelector('.pl-bpm').textContent=bpm||'–'; const hs=col.querySelector('.pl-heart');
      hs.style.animationDuration = bpm ? (60/bpm)+'s' : ''; hs.classList.toggle('beat',!!bpm); });
    F.read.textContent = r&&e ? `ממוצע: ${Math.round(r*4)} במנוחה ← ${Math.round(e*4)} אחרי מאמץ. עלייה של בערך ${Math.round((e-r)/r*100)}%. מה השתנה בשרירים?` : r ? `ממוצע במנוחה: ${Math.round(r*4)} פעימות לדקה (${(Math.round(r*10)/10)} × 4).` : 'מקלידים ספירות של 15 שניות — ההדמיה מכפילה ב־4.'; };
  F.view.querySelectorAll('.pl-in').forEach(i=>i.addEventListener('input',upd)); upd();
  return {destroy(){ if(tid) clearInterval(tid); }};
};

/* ================= 6. the heart: one beat, valves ================= */
S.heart = host => {
  const F = S._frame(host,'פעימה אחת של הלב','תרשים מפושט (לא ציור אנטומי). כמו בכל תרשים לב: צד שמאל של הגוף מופיע מימין לנו. אדום בהיר = עשיר בחמצן, אדום כהה = דל בחמצן.');
  F.view.innerHTML=`<svg viewBox="0 0 640 380" class="sim-svg hh" role="img" aria-label="תרשים לב: שתי עליות, שני חדרים, מחיצה ושסתומים">
    <rect width="640" height="380" fill="#fffdf8"/>
    <!-- vessels: simple straight pipes so the route is readable -->
    <path d="M200 26 V72" stroke="${POOR}" stroke-width="22" stroke-linecap="round" class="hh-v" data-v="vc"/>
    <path d="M162 270 H112 V30" stroke="${POOR}" stroke-width="20" fill="none" stroke-linejoin="round" stroke-linecap="round" class="hh-v" data-v="pa"/>
    <path d="M440 26 V72" stroke="${RICH}" stroke-width="22" stroke-linecap="round" class="hh-v" data-v="pv"/>
    <path d="M478 270 H528 V30" stroke="${RICH}" stroke-width="24" fill="none" stroke-linejoin="round" stroke-linecap="round" class="hh-v" data-v="ao"/>
    <!-- chambers -->
    <g class="hh-c" data-c="ra"><rect x="160" y="70" width="140" height="110" rx="26" fill="#f3dcd8" stroke="${NAVY}" stroke-width="5"/><rect class="hh-f" x="166" y="76" width="128" height="98" rx="22" fill="${POOR}"/></g>
    <g class="hh-c" data-c="la"><rect x="340" y="70" width="140" height="110" rx="26" fill="#f3dcd8" stroke="${NAVY}" stroke-width="5"/><rect class="hh-f" x="346" y="76" width="128" height="98" rx="22" fill="${RICH}"/></g>
    <g class="hh-c" data-c="rv"><rect x="160" y="200" width="140" height="150" rx="34" fill="#f3dcd8" stroke="${NAVY}" stroke-width="7"/><rect class="hh-f" x="168" y="208" width="124" height="134" rx="28" fill="${POOR}"/></g>
    <g class="hh-c" data-c="lv"><rect x="340" y="200" width="140" height="150" rx="34" fill="#f3dcd8" stroke="${NAVY}" stroke-width="16"/><rect class="hh-f" x="352" y="212" width="116" height="126" rx="24" fill="${RICH}"/></g>
    <rect x="312" y="66" width="16" height="290" rx="6" fill="${NAVY}"/>
    <!-- AV valves -->
    <g class="hh-av"><path d="M175 190 L230 190 M245 190 L290 190" stroke="${CREAM}" stroke-width="7" stroke-linecap="round"/><path d="M355 190 L410 190 M425 190 L470 190" stroke="${CREAM}" stroke-width="7" stroke-linecap="round"/></g>
    <g class="hh-sl"><path d="M150 256 V284" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><path d="M490 256 V284" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/></g>
    <path class="hh-leak" d="M440 230 Q470 190 440 150" stroke="#E9C46A" stroke-width="5" fill="none" stroke-dasharray="6 6" opacity="0" marker-end="url(#ar)"/>
    <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E9C46A"/></marker></defs>
    <g class="hh-lbl">
      ${tx(230,130,'עלייה ימנית',{s:14,f:'#fff',w:600})}${tx(410,130,'עלייה שמאלית',{s:14,f:'#fff',w:600})}
      ${tx(230,280,'חדר ימני',{s:15,f:'#fff',w:700})}${tx(410,280,'חדר שמאלי',{s:15,f:'#fff',w:700})}
      ${tx(112,18,'לריאות ↑',{s:13,w:600})}${tx(200,18,'מהגוף ↓',{s:13,w:600})}${tx(440,18,'מהריאות ↓',{s:13,w:600})}${tx(528,18,'לגוף ↑',{s:13,w:600})}
      ${tx(70,300,'עורק הריאה',{s:12,f:'#5d5148'})}${tx(575,300,'אבי העורקים',{s:12,f:'#5d5148'})}
      ${tx(230,372,'צד ימין של הגוף',{s:12,f:'#5d5148'})}${tx(410,372,'צד שמאל של הגוף',{s:12,f:'#5d5148'})}
    </g>
    <text class="hh-sound" x="590" y="200" text-anchor="middle" font-size="26" font-weight="700" fill="${NAVY}" font-family="Rubik" opacity="0" direction="rtl"></text>
  </svg>`;
  const q=s=>F.view.querySelector(s), qa=s=>[...F.view.querySelectorAll(s)];
  const ch=k=>q(`.hh-c[data-c=${k}]`);
  let leak=false, auto=false, phase=-1, timer=null, speed=1;
  const setScale=(k,s)=>{ const g=ch(k), r=g.querySelector('rect'); const cx=+r.getAttribute('x')+70, cy=+r.getAttribute('y')+(+r.getAttribute('height'))/2; g.setAttribute('transform',`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`); };
  const fill=(k,v)=>{ const f=ch(k).querySelector('.hh-f'); f.style.opacity=.35+.65*v; };
  const sound=t=>{ const el=q('.hh-sound'); el.textContent=t; el.setAttribute('opacity',1); setTimeout(()=>el.setAttribute('opacity',0),350/speed); };
  const av=open=>q('.hh-av').style.opacity=open?.25:1, sl=open=>q('.hh-sl').style.opacity=open?.25:1;
  const flowV=(keys,on)=>keys.forEach(k=>q(`.hh-v[data-v=${k}]`).classList.toggle('flow',on));
  const PH=[
    ()=>{ ['ra','la','rv','lv'].forEach(k=>setScale(k,1)); av(true); sl(false); flowV(['vc','pv'],true); flowV(['pa','ao'],false); fill('ra',.8); fill('la',.8); fill('rv',.5); fill('lv',.5); q('.hh-leak').setAttribute('opacity',0);
      F.read.textContent='1 · הרפיה: דם זורם אל העליות (מהגוף לימנית, מהריאות לשמאלית) וממשיך לחדרים.'; },
    ()=>{ setScale('ra',.88); setScale('la',.88); fill('ra',.4); fill('la',.4); fill('rv',1); fill('lv',1);
      F.read.textContent='2 · העליות מתכווצות ודוחפות עוד דם לחדרים. השסתומים בין עלייה לחדר פתוחים.'; },
    ()=>{ setScale('ra',1); setScale('la',1); setScale('rv',.86); setScale('lv',.86); av(false); sl(true); sound('לַב'); flowV(['vc','pv'],false); flowV(['pa','ao'],true); fill('rv',.35); fill('lv',.35);
      if(leak){ q('.hh-leak').setAttribute('opacity',1); fill('la',.75); F.read.textContent='3 · שסתום דולף! חלק מהדם חוזר מהחדר השמאלי לעלייה (חץ צהוב). פחות דם יוצא לגוף בכל פעימה — והלב צריך לעבוד קשה יותר.'; }
      else F.read.textContent='3 · החדרים מתכווצים יחד: הימני דוחף לריאות, השמאלי (הדופן העבה!) לכל הגוף. השסתומים בין עלייה לחדר נסגרים — ״לַב״.'; },
    ()=>{ setScale('rv',1); setScale('lv',1); sl(false); sound('דַּב'); q('.hh-leak').setAttribute('opacity',0);
      F.read.textContent='4 · החדרים נרגעים. השסתומים ביציאה מהחדרים נסגרים — ״דַּב״ — כדי שהדם לא יחזור ללב.'; }
  ];
  const DUR=[900,600,900,600];
  const step=()=>{ phase=(phase+1)%4; PH[phase](); if(auto||phase<3) timer=setTimeout(step,DUR[phase]/speed); else timer=null; };
  const stopAll=()=>{ clearTimeout(timer); timer=null; };
  S._btn(F.ctrls,'▶ פעימה אחת (לאט)',()=>{ stopAll(); auto=false; speed=.6; phase=-1; step(); });
  S._seg(F.ctrls,'פעימות ברצף',[['0','עצירה'],['1','מנוחה'],['2.2','ריצה']],'0',k=>{ stopAll(); speed=+k||1; auto=k!=='0'; if(auto){ phase=-1; step(); } else PH[0](); });
  S._seg(F.ctrls,'שסתום בין העלייה לחדר השמאלי',[['ok','תקין'],['leak','דולף']],'ok',k=>{ leak=k==='leak'; });
  PH[0](); F.read.textContent='לחצו ״פעימה אחת״. מה מתכווץ קודם?';
  return {destroy(){ stopAll(); }};
};

/* ================= 7. the route of a red blood cell ================= */
S.route = host => {
  const F = S._frame(host,'מסע של תא דם אדום','סדרו את התחנות, מהחדר הימני. לחיצה על כרטיס בשרשרת מחזירה אותו.');
  const ST=[
    {id:1,t:'עורק הריאה',p:[250,60]},
    {id:2,t:'נימי הריאות',p:[320,30],swap:'rich'},
    {id:3,t:'ורידי הריאה',p:[390,60]},
    {id:4,t:'עלייה שמאלית',p:[360,150]},
    {id:5,t:'חדר שמאלי',p:[360,200]},
    {id:6,t:'אבי העורקים',p:[420,250]},
    {id:7,t:'נימי הגוף (בשריר)',p:[320,320],swap:'poor'},
    {id:8,t:'הווריד הנבוב',p:[220,250]},
    {id:9,t:'עלייה ימנית',p:[280,150]}
  ];
  const START=[280,200];
  const cards=ST.map(s=>s).sort(()=>Math.random()-.5);
  let slots=Array(9).fill(null);
  const path=[START,...ST.map(s=>s.p),START];
  F.view.innerHTML=`<div class="rt"><svg viewBox="0 0 640 350" class="sim-svg" role="img" aria-label="מסלול הדם: לב, ריאות וגוף">
    <rect width="640" height="350" fill="#fffdf8"/>
    <rect x="230" y="6" width="180" height="46" rx="22" fill="#F4A261" opacity=".55"/>${tx(372,35,'ריאות',{s:15,w:700})}
    <rect x="230" y="296" width="180" height="48" rx="22" fill="${BEIGE}"/>${tx(380,326,'הגוף',{s:15,w:700})}
    <path d="M250 60 Q240 30 300 30 H340 Q400 30 390 60 L360 150 V200 L420 250 Q470 320 340 320 H300 Q170 320 220 250 L280 150 V200" fill="none" stroke="#e8dccb" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="255" y="125" width="130" height="100" rx="22" fill="#f3dcd8" stroke="${NAVY}" stroke-width="3"/><path d="M320 125 V225" stroke="${NAVY}" stroke-width="5"/>${tx(320,118,'לב',{s:13,w:700})}
    <g class="rt-st">${ST.map(s=>`<g data-id="${s.id}"><circle cx="${s.p[0]}" cy="${s.p[1]}" r="12" fill="#fff" stroke="${NAVY}" stroke-width="2"/></g>`).join('')}<circle cx="${START[0]}" cy="${START[1]}" r="12" fill="${NAVY}"/></g>
    ${tx(150,205,'חדר ימני ← התחלה',{s:13,w:600})}
    <circle class="rt-cell" r="10" cx="${START[0]}" cy="${START[1]}" fill="${POOR}" stroke="#fff" stroke-width="2"/>
  </svg>
  <div class="chain"><div class="chain-slots"></div><div class="chain-pool"></div></div></div>`;
  const draw=checked=>{
    const sl=F.view.querySelector('.chain-slots'), pool=F.view.querySelector('.chain-pool');
    sl.innerHTML=`<div class="slot ok"><span class="card-c fixed">חדר ימני</span></div><span class="arrow" aria-hidden="true">←</span>`+slots.map((id,i)=>{const c=ST.find(x=>x.id===id); let st=''; if(checked&&c) st=c.id===i+1?'ok':'off';
      return `<div class="slot ${st}">${c?`<button type="button" class="card-c" data-out="${i}">${c.t}</button>`:`<span class="slot-n">${i+1}</span>`}</div><span class="arrow" aria-hidden="true">←</span>`}).join('')+`<div class="slot ok"><span class="card-c fixed">חדר ימני</span></div>`;
    pool.innerHTML=cards.filter(c=>!slots.includes(c.id)).map(c=>`<button type="button" class="card-c" data-in="${c.id}">${c.t}</button>`).join('');
    F.view.querySelectorAll('.rt-st g').forEach(g=>{ const i=slots.indexOf(+g.dataset.id); g.innerHTML=g.innerHTML.replace(/<text[\s\S]*<\/text>/,''); if(i>-1){ const s=ST.find(x=>x.id===+g.dataset.id); g.insertAdjacentHTML('beforeend',`<text x="${s.p[0]}" y="${s.p[1]+5}" text-anchor="middle" font-size="13" font-weight="700" fill="${NAVY}" font-family="Rubik">${i+1}</text>`);} });
  };
  F.view.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b||!b.closest('.chain')) return;
    if(b.dataset.in){const i=slots.indexOf(null); if(i>-1) slots[i]=+b.dataset.in;}
    if(b.dataset.out!==undefined) slots[+b.dataset.out]=null;
    draw(false); F.read.textContent=''; });
  S._btn(F.ctrls,'✓ בדיקה',()=>{ draw(true); const ok=slots.every((id,i)=>id===i+1), empty=slots.includes(null);
    F.read.textContent= ok?'המסלול נכון! עכשיו ״הפעלה״ — ועקבו אחרי הצבע.' : empty?'חסרות תחנות. מאיפה הדם יוצא מהחדר הימני?' : 'חלק מהתחנות לא במקום (מסגרת מקווקווה). רמז: אחרי הריאות הדם חוזר קודם ללב.'; });
  let anim=null;
  S._btn(F.ctrls,'▶ הפעלה',()=>{ const cell=F.view.querySelector('.rt-cell'); let i=0, t=0; cancelAnimationFrame(anim); cell.setAttribute('fill',POOR);
    const run=()=>{ t+=.025; if(t>=1){t=0;i++; const s=ST[i-1]; if(s&&s.swap) cell.setAttribute('fill',s.swap==='rich'?RICH:POOR);
        if(s) F.read.textContent = s.swap==='rich'?'בנימי הריאות: פחמן דו־חמצני יוצא, חמצן נכנס — הדם מתבהר.' : s.swap==='poor'?'בנימי הגוף: חמצן וגלוקוז יוצאים לתאי השריר, פחמן דו־חמצני נכנס — הדם מתכהה.' : s.id===1?'עורק הריאה: עורק — אבל עם דם דל בחמצן!':s.id===5?'החדר השמאלי דוחף את הדם לכל הגוף.':F.read.textContent;
        if(i>=path.length-1){ F.read.textContent='חזרנו לחדר הימני: סיבוב שלם — שני מחזורים, ופעמיים דרך הלב.'; return; } }
      const [x0,y0]=path[i],[x1,y1]=path[i+1]; cell.setAttribute('cx',x0+(x1-x0)*t); cell.setAttribute('cy',y0+(y1-y0)*t);
      anim=requestAnimationFrame(run); };
    run(); });
  S._btn(F.ctrls,'↺ מחדש',()=>{slots=Array(9).fill(null);draw(false);F.read.textContent='';},'ghost');
  draw(false);
  return {destroy(){ cancelAnimationFrame(anim); }};
};

/* ================= 8. exercise: what changes when we run ================= */
S.exercise = host => {
  const F = S._frame(host,'מה משתנה כשרצים?','ערכים משוערים ומעוגלים לנער.ה בריא.ה — הם משתנים מאוד מאדם לאדם. המטרה: לראות מה עולה יחד, ולמה.');
  const BARS=[
    {k:'o2',n:'חמצן שהשרירים צורכים',a:1,b:10,u:v=>`פי ${v.toFixed(v<2?1:0)}`,c:O2},
    {k:'hr',n:'דופק (פעימות בדקה)',a:70,b:180,u:v=>Math.round(v),c:RICH},
    {k:'co',n:'דם שהלב מזרים בדקה (ליטרים)',a:5,b:20,u:v=>Math.round(v),c:'#c0392b'},
    {k:'br',n:'נשימות בדקה',a:14,b:40,u:v=>Math.round(v),c:'#F4A261'},
    {k:'mu',n:'חלק הדם שמגיע לשרירים',a:20,b:80,u:v=>`${Math.round(v)}%`,c:GLU}
  ];
  F.view.innerHTML=`<div class="ex"><div class="ex-fig"><svg viewBox="-60 -55 120 110" class="pl-heart beat"><path d="M0 40 C-60 0 -45 -45 -12 -38 C-4 -36 0 -28 0 -22 C0 -28 4 -36 12 -38 C45 -45 60 0 0 40Z" fill="${RICH}"/></svg><b class="ex-state">מנוחה</b></div>
    <div class="ex-bars">${BARS.map(b=>`<div class="ex-row" data-k="${b.k}"><span class="ex-n">${b.n}</span><div class="ex-track"><i style="background:${b.c}"></i></div><b class="ex-v"></b></div>`).join('')}</div></div>`;
  const set=v=>{ const t=v/100; BARS.forEach(b=>{ const val=b.a+(b.b-b.a)*Math.pow(t,1.1); const row=F.view.querySelector(`.ex-row[data-k=${b.k}]`);
      row.querySelector('i').style.width=(val/b.b*100)+'%'; row.querySelector('.ex-v').textContent=b.u(val); });
    const hr=70+110*Math.pow(t,1.1); F.view.querySelector('.pl-heart').style.animationDuration=(60/hr)+'s';
    F.view.querySelector('.ex-state').textContent=t<.2?'מנוחה':t<.55?'הליכה מהירה':t<.85?'ריצה':'ריצה מהירה';
    F.read.textContent=t<.2?'במנוחה: השרירים צורכים מעט חמצן, ורוב הדם הולך לאיברים אחרים.':'השרירים מפרקים יותר גלוקוז ← צריכים יותר חמצן ← הלב פועם מהר יותר ומזרים יותר דם, הנשימה מואצת, ויותר דם מופנה לשרירים.'; };
  S._slider(F.ctrls,'עוצמת המאמץ: מנוחה ← ריצה',0,100,0,1,set); set(0);
  return {destroy(){}};
};
})();
