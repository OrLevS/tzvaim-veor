/* Presentation engine: home view + per-lesson scroll deck */
(function(){
const LESSONS = (window.LESSONS||[]).sort((a,b)=>a.n-b.n);
const SIMS = window.SIMS;
const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=>String(s??'');
window.APP_MOTION = !matchMedia('(prefers-reduced-motion: reduce)').matches;

const KIND = {open:'פתיחה',predict:'ניבוי',explore:'התנסות',explain:'הסבר',write:'כתיבה',reflect:'רפלקציה',close:'סגירה'};
const MODE = {solo:['לבד','👤'],pair:['בזוגות','👥'],group:['בקבוצות','👪'],class:['במליאה','🏫']};
const typeName = t=>t==='sci'?'מדעים':'אוריינות מדעית';
const STAGES=[
 {name:'שיעורים 1–4',from:1,to:4,sup:'ציור, שאלות מכוונות, מושגים ותחילות משפטים',exp:'לחבר שניים–ארבעה משפטים עם סיבה ותוצאה'},
 {name:'שיעורים 5–8',from:5,to:8,sup:'מילות מפתח, טבלה או תרשים; פחות משפטי פתיחה',exp:'להסביר תוצאה ולבחור פרט שתומך בה'},
 {name:'שיעורים 9–12',from:9,to:12,sup:'מסגרת לטענה ולהנמקה, שאלת בדיקה או טענה נגדית',exp:'לציין חלופה, מגבלה או שיקול מתחרה'},
 {name:'שיעורים 13–14',from:13,to:14,sup:'ראיות ומושגים זמינים; מסגרת לפי הצורך',exp:'לנסח מסקנה עצמאית ולתקן אותה בעקבות משוב'}];
const PRINCIPLES=['כל שיעור מתחיל משאלה או תופעה, ומסתיים בתוצר אישי קצר שאפשר לבדוק.','קודם חושבות.ים לבד, אחר כך משוחחות.ים. תשובה קבוצתית אינה מחליפה תוצר אישי.','רצף הכתיבה: רעיון ראשוני → הסבר בעל פה → כתיבה עצמאית → בדיקת דיוק → תיקון נראה לעין.','בזמן הכתיבה מציעים מושגים, תרשים, שאלות או תחילות משפטים — לא פסקה שלמה להעתקה.','מספקים הסבר מפורש וקצר אחרי ההתנסות. פעילות מעניינת זקוקה לחיבור למודל המדעי.','כל רכיב דיגיטלי מופעל במסך המשותף; אין משימות שמחייבות טלפון אישי.','מטה־קוגניציה מתייחסת להחלטה ממשית: מה לבדוק, האם השיטה מועילה, מה חסר ומה משנים.','מבחינים בין דיוק מדעי לבין איות וכתב יד. תמיכה אינה ויתור על חשיבה.'];

/* ---------- tabs ---------- */
const tabs=$('#tabs');
tabs.innerHTML=`<a class="tab" data-id="home" href="#home"><span class="num">★</span><span class="lbl">מבט על</span></a>`+
  LESSONS.map(l=>`<a class="tab" data-id="${l.n}" data-type="${l.t}" href="#${l.n}"><span class="num">${l.label||l.n}</span><span class="lbl">${esc(l.q)}</span></a>`).join('');

/* ---------- toggles ---------- */
const projBtn=$('#projBtn'), motBtn=$('#motBtn');
let proj=false; // projection toggle hidden for now (teacher strip is off)
const applyProj=()=>{document.body.classList.toggle('proj',proj); projBtn.setAttribute('aria-pressed',proj); projBtn.querySelector('span:last-child').textContent=proj?'מצב מורה':'מצב הקרנה';};
projBtn.addEventListener('click',()=>{proj=!proj; try{localStorage.setItem('cl-proj',proj?'1':'0')}catch(e){} applyProj();});
const applyMot=()=>{document.body.classList.toggle('still',!window.APP_MOTION); motBtn.setAttribute('aria-pressed',!window.APP_MOTION); motBtn.querySelector('span:last-child').textContent=window.APP_MOTION?'עצירת תנועה':'הפעלת תנועה'; $$('svg').forEach(s=>s.pauseAnimations&&(window.APP_MOTION?s.unpauseAnimations():s.pauseAnimations())); if(window.gsap){ window.APP_MOTION?gsap.globalTimeline.resume():gsap.globalTimeline.pause(); }};
motBtn.addEventListener('click',()=>{window.APP_MOTION=!window.APP_MOTION; applyMot();});
applyProj();

/* ---------- home ---------- */
function home(){
  return `<section class="home">
  <div class="hero wrap">
    <div><span class="eyebrow">אשכול 1 · כיתה מעורבת ז׳–ח׳ · 14 שיעורים של 45 דקות</span>
    <h1>צבעים <span>ו</span>אור</h1>
    <p class="lede">כל שיעור הוא מצגת בגלילה: שאלה פותחת, ניחושים לפני חשיפה, התנסות, הסבר, כתיבה ורפלקציה — לפי הסדר. בצד כל שקופית: מה להגיד, מה לשאול ולמה לשים לב. ״מצב הקרנה״ מסתיר את הערות המורה.</p>
    <a class="cta" href="#1">מתחילות.ים בשיעור 1 ←</a></div>
    <div class="hero-art" aria-hidden="true">${heroSvg()}</div>
  </div>
  <div class="wrap">
    <h2 class="sec-h">ארבע־עשרה שאלות</h2>
    <div class="lgrid">${LESSONS.map((l,i)=>`<a class="lcard rv" style="--i:${i}" data-type="${l.t}" href="#${l.n}"><span class="lnum">${l.n}</span><span class="ltype">${typeName(l.t)} · ${l.c} באשכול</span><b>${esc(l.q)}</b><span class="lmeta">${l.slides.length} שלבים · ${l.slides.filter(s=>s.sim).length?'עם הדמיה':'ללא הדמיה'}</span></a>`).join('')}</div>
    <h2 class="sec-h">עקרונות שחוזרים בכל השיעורים</h2>
    <ul class="princ">${PRINCIPLES.map(p=>`<li>${p}</li>`).join('')}</ul>
    <h2 class="sec-h">התקדמות מיומנות הכתיבה</h2>
    <div class="prog">${STAGES.map((s,i)=>`<div class="pcard"><div class="pbar"><i style="width:${(i+1)*25}%"></i></div><h4>${s.name}</h4><p><b>תמיכה:</b> ${s.sup}</p><p><b>עצמאות מצופה:</b> ${s.exp}</p></div>`).join('')}</div>
    <p class="note">ההתקדמות גמישה לפי צורך, לא לפי שיוך לכיתה ז׳ או ח׳. משפט קצר ומדויק עדיף על פסקה ארוכה שהתלמיד.ה אינו.ה יכול.ה להסביר.</p>
  </div></section>`;
}
function heroSvg(){return `<svg viewBox="0 0 420 300"><defs><linearGradient id="hs" x1="0" x2="1"><stop offset="0" stop-color="#6a3fa0"/><stop offset=".2" stop-color="#2f5fd0"/><stop offset=".4" stop-color="#2A9D8F"/><stop offset=".55" stop-color="#7cc045"/><stop offset=".7" stop-color="#E9C46A"/><stop offset=".85" stop-color="#F4A261"/><stop offset="1" stop-color="#d8402a"/></linearGradient></defs>
  <path d="M10 160 L178 140" stroke="#264653" stroke-width="5" stroke-linecap="round" class="beam"/>
  <polygon points="180,60 260,195 100,195" fill="#E6D3B9" stroke="#264653" stroke-width="4" stroke-linejoin="round"/>
  <path d="M222 128 L412 70 L412 220 Z" fill="url(#hs)" class="fan"/>
  <circle cx="40" cy="55" r="22" fill="#E9C46A"/><g class="spin"><path d="M40 19v-10M40 91v10M4 55h-10M76 55h10M15 30l-7-7M65 80l7 7M65 30l7-7M15 80l-7 7" stroke="#E9C46A" stroke-width="4" stroke-linecap="round"/></g>
  <path d="M10 262 Q70 237 130 262 T250 262 T370 262" fill="none" stroke="#E76F51" stroke-width="5" stroke-linecap="round" class="wave"/></svg>`;}


/* ---------- lesson view (frames come from deck.js) ---------- */
const stageOf=n=>STAGES.find(s=>n>=s.from&&n<=s.to);
let io=null, simIO=null, mounted=new Map(), timers=[], current=null, deck=null;
function cleanup(){ io&&io.disconnect(); simIO&&simIO.disconnect(); deck&&deck.io&&deck.io.disconnect(); mounted.forEach(m=>m&&m.destroy&&m.destroy()); mounted.clear(); timers.forEach(clearInterval); timers=[]; if(typeof eyeRaf!=='undefined'&&eyeRaf){cancelAnimationFrame(eyeRaf);} }
function show(id){
  cleanup();
  const main=$('#main'); const l=LESSONS.find(x=>String(x.n)===String(id));
  current=l||null; deck=null;
  document.body.classList.toggle('in-deck',!!l);
  main.innerHTML = l ? DECK.html(l,{next:LESSONS.find(x=>x.n===l.n+1), stage:stageOf(l.stageN||l.n), typeName}) : home();
  $$('.tab').forEach(t=>{const on=t.dataset.id===String(l?l.n:'home'); t.classList.toggle('on',on); if(on){t.setAttribute('aria-current','page'); t.scrollIntoView({inline:'center',block:'nearest'});} else t.removeAttribute('aria-current');});
  window.scrollTo(0,0);
  if(!l){
    io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }),{threshold:.2});
    $$('.home, .home .lcard').forEach(el=>io.observe(el)); applyMot(); return;
  }
  if(l.cover==='eye' && typeof initEye==='function') initEye($('#coverSvg'));
  deck = DECK.wire(l,{motion:()=>window.APP_MOTION});
  const fq=new URLSearchParams(location.search).get('f'); if(fq){ const f=document.getElementById('f'+fq); f&&f.scrollIntoView({block:'start'}); }
  const oq=new URLSearchParams(location.search).get('only'); if(oq){ $$('.frame').forEach(f=>{ if(f.id!=='f'+oq) f.style.display='none'; else f.classList.add('in'); }); }
  simIO=new IntersectionObserver(es=>es.forEach(e=>{const h=e.target; if(e.isIntersecting && !mounted.has(h)){ mounted.set(h, SIMS[h.dataset.sim](h)); }
    else if(!e.isIntersecting && mounted.has(h)){ const m=mounted.get(h); m&&m.destroy&&m.destroy(); mounted.delete(h); h.innerHTML=''; }}),{rootMargin:'200px 0px'});
  $$('.sim-host').forEach(h=>simIO.observe(h));
  /* visual timer: one shared countdown per stage, shown on every work screen of that stage */
  const TS={};
  $$('.vtimer').forEach(el=>{ const k=el.dataset.stage; if(!TS[k]) TS[k]={total:+el.dataset.min*60,left:+el.dataset.min*60,id:null,els:[]}; TS[k].els.push(el); });
  const paint=T=>{ const m=Math.floor(T.left/60), sec=T.left%60, frac=T.total?T.left/T.total:0;
    T.els.forEach(el=>{ el.querySelector('output').textContent=`${m}:${String(sec).padStart(2,'0')}`;
      el.querySelector('.vt-ring').style.strokeDashoffset=(100-frac*100).toFixed(2);
      el.classList.toggle('warn', T.left>0 && frac<=.25); el.classList.toggle('done', T.left===0);
      el.classList.toggle('running', !!T.id); el.querySelector('.vt-go').textContent=T.id?'❚❚':'▶'; }); };
  const stopT=T=>{ clearInterval(T.id); T.id=null; };
  Object.values(TS).forEach(T=>{ paint(T);
    T.els.forEach(el=>{
      el.querySelector('.vt-go').addEventListener('click',()=>{ if(T.id){ stopT(T); paint(T); return; } if(T.left===0) T.left=T.total;
        T.id=setInterval(()=>{ T.left=Math.max(0,T.left-1); if(!T.left) stopT(T); paint(T); },1000); timers.push(T.id); paint(T); });
      el.querySelector('.vt-plus').addEventListener('click',()=>{ T.left+=60; T.total=Math.max(T.total,T.left); paint(T); });
      el.querySelector('.vt-minus').addEventListener('click',()=>{ T.left=Math.max(0,T.left-60); paint(T); });
      el.querySelector('.vt-rs').addEventListener('click',()=>{ stopT(T); T.total=+el.dataset.min*60; T.left=T.total; paint(T); });
    }); });
  applyMot();
}
document.addEventListener('keydown',e=>{
  if(!deck || e.target.closest('input,textarea,select,[contenteditable],summary') || e.altKey||e.ctrlKey||e.metaKey) return;
  if(['PageDown','ArrowDown'].includes(e.key)||(e.key===' '&&!e.target.closest('button'))){ e.preventDefault(); deck.go(deck.index()+1); }
  if(['PageUp','ArrowUp'].includes(e.key)){ e.preventDefault(); deck.go(deck.index()-1); }
});
window.addEventListener('hashchange',()=>show(location.hash.slice(1)||'home'));
show(location.hash.slice(1)||'home');
})();
