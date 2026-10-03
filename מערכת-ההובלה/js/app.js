/* מערכת ההובלה — מבוסס על צבעים-ואור/js/app.js: מבט על + מצגת בגלילה לכל שיעור */
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
 {name:'שיעורים 1–2',from:1,to:2,sup:'שרשרת סיבתית, תרשים, מושגים ותחילות משפטים',exp:'הסבר של 3–4 משפטים עם סיבה ותוצאה; בשיעור 2 — טענה, ראיה מהמדידה והנמקה'}];
const PRINCIPLES=['כל שיעור מתחיל משאלה או תופעה, ומסתיים בתוצר אישי קצר שאפשר לבדוק.','קודם חושבות.ים לבד, אחר כך משוחחות.ים. תשובה קבוצתית אינה מחליפה תוצר אישי.','רצף הכתיבה: רעיון ראשוני → הסבר בעל פה → כתיבה עצמאית → בדיקת דיוק → תיקון נראה לעין.','בזמן הכתיבה מציעים מושגים, תרשים, שאלות או תחילות משפטים — לא פסקה שלמה להעתקה.','מספקים הסבר מפורש וקצר אחרי ההתנסות. פעילות מעניינת זקוקה לחיבור למודל המדעי.','כל רכיב דיגיטלי מופעל במסך המשותף; אין משימות שמחייבות טלפון אישי.','מטה־קוגניציה מתייחסת להחלטה ממשית: מה לבדוק, האם השיטה מועילה, מה חסר ומה משנים.','מבחינים בין דיוק מדעי לבין איות וכתב יד. תמיכה אינה ויתור על חשיבה.'];

/* ---------- tabs ---------- */
const tabs=$('#tabs');
tabs.innerHTML=`<a class="tab" data-id="home" href="#home"><span class="num">★</span><span class="lbl">מבט על</span></a>`+
  LESSONS.map(l=>`<a class="tab" data-id="${l.n}" data-type="${l.t}" href="#${l.n}"><span class="num">${l.n}</span><span class="lbl">${esc(l.q)}</span></a>`).join('');

/* ---------- toggles ---------- */
const projBtn=$('#projBtn'), motBtn=$('#motBtn');
let proj=false; // projection toggle hidden for now (teacher strip is off)
const applyProj=()=>{document.body.classList.toggle('proj',proj); projBtn.setAttribute('aria-pressed',proj); projBtn.querySelector('span:last-child').textContent=proj?'מצב מורה':'מצב הקרנה';};
projBtn.addEventListener('click',()=>{proj=!proj; try{localStorage.setItem('cl-proj',proj?'1':'0')}catch(e){} applyProj();});
const applyMot=()=>{document.body.classList.toggle('still',!window.APP_MOTION); motBtn.setAttribute('aria-pressed',!window.APP_MOTION); motBtn.querySelector('span:last-child').textContent=window.APP_MOTION?'עצירת תנועה':'הפעלת תנועה'; $$('svg').forEach(s=>s.pauseAnimations&&(window.APP_MOTION?s.unpauseAnimations():s.pauseAnimations())); if(window.gsap){ window.APP_MOTION?gsap.globalTimeline.resume():gsap.globalTimeline.pause(); }};
motBtn.addEventListener('click',()=>{window.APP_MOTION=!window.APP_MOTION; applyMot();});
applyProj();

/* ---------- home ---------- */
const COVER=[
 ['למה צריך מערכת הובלה','כל תא צריך חמצן וגלוקוז ולפנות פחמן דו־חמצני ופסולת; נשימה תאית; דיפוזיה מספיקה רק למרחקים קצרים מאוד.'],
 ['שלושת המרכיבים','לב (משאבה), כלי דם (עורקים, ורידים, נימים), דם (פלזמה, תאי דם אדומים עם המוגלובין, תאי דם לבנים, טסיות).'],
 ['התאמה בין מבנה לתפקוד','דופן עורק עבה, שסתומים בוורידים, נים עם דופן של שכבת תאים אחת ושטח פנים גדול, החדר השמאלי העבה.'],
 ['הלב','שתי עליות, שני חדרים, מחיצה ושסתומים; מהלך פעימה; דופק ומדידתו.'],
 ['מחזור גדול ומחזור קטן','מסלול הדם המלא; דם עשיר ודל בחמצן; עורק/וריד מוגדרים לפי הכיוון.'],
 ['קשר למערכות אחרות','נשימה (חילוף גזים בריאות), עיכול (ספיגת גלוקוז), הפרשה (סינון פסולת); מה משתנה במאמץ; בריאות הלב.']];
function home(){
  return `<section class="home">
  <div class="hero wrap">
    <div><span class="eyebrow">מדע וטכנולוגיה · כיתות ז׳–ח׳ · 2 שיעורים של 45 דקות</span>
    <h1>מערכת <span>ה</span>הובלה</h1>
    <p class="lede">שני שיעורים שמכסים את מערכת ההובלה בגוף האדם לפי תוכנית הלימודים: למה כל תא צריך משלוח, ממה בנויה המערכת, איך הלב עובד ולאן הדם הולך. כל שיעור הוא מצגת בגלילה: ניחוש ← התנסות ← הסבר ← כתיבה ← רפלקציה, עם הדמיות במסך המשותף ויומן חוקר.ת לכל תלמיד.ה.</p>
    <a class="cta" href="#1">מתחילות.ים בשיעור 1 ←</a></div>
    <div class="hero-art" aria-hidden="true">${heroSvg()}</div>
  </div>
  <div class="wrap">
    <h2 class="sec-h">שתי שאלות</h2>
    <div class="lgrid">${LESSONS.map((l,i)=>`<a class="lcard rv" style="--i:${i}" data-type="${l.t}" href="#${l.n}"><span class="lnum">${l.n}</span><span class="ltype">${typeName(l.t)} · שיעור ${l.c} מתוך 2</span><b>${esc(l.q)}</b><span class="lmeta">${l.slides.length} שלבים · ${l.slides.filter(s=>s.sim).length} שלבים עם הדמיה</span></a>`).join('')}</div>
    <h2 class="sec-h">יומן חוקר.ת — להדפסה ולמסך</h2>
    <div class="mats">${LESSONS.map(l=>`<a href="יומן/print.html?l=${l.n}" target="_blank">🖨 יומן · שיעור ${l.n}</a><a class="ghost" href="יומן/print.html?l=${l.n}&key=1" target="_blank">🔑 גרסת מורה עם תשובות · ${l.n}</a><a class="ghost" href="יומן/digital.html?l=${l.n}" target="_blank">💻 יומן דיגיטלי · ${l.n}</a>`).join('')}</div>
    <h2 class="sec-h">מה היחידה מכסה</h2>
    <ul class="cov">${COVER.map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul>
    <h2 class="sec-h">עקרונות שחוזרים בכל השיעורים</h2>
    <ul class="princ">${PRINCIPLES.map(p=>`<li>${p}</li>`).join('')}</ul>
    <p class="note">צריך שיעור שלישי? המקום הטבעי לפצל: שיעור 2 עד ״מסע של תא דם אדום״, ושיעור 3 — מאמץ, קשר למערכות אחרות, בריאות הלב וכתיבת טענה–ראיה–הנמקה.</p>
  </div></section>`;
}
function heroSvg(){return `<svg viewBox="0 0 420 300"><path d="M210 250 C60 160 90 40 160 50 C185 54 205 74 210 96 C215 74 235 54 260 50 C330 40 360 160 210 250Z" fill="#E04B3A"><animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur="1s" repeatCount="indefinite" additive="sum"/></path>
  <path d="M10 160 H120 L135 120 L150 200 L165 160 H250 L262 140 L275 160 H410" fill="none" stroke="#264653" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="beam"/>
  <circle cx="60" cy="60" r="12" fill="#E9C46A"/><circle cx="360" cy="70" r="10" fill="#2A9D8F"/><circle cx="340" cy="250" r="9" fill="#7A2433"/><circle cx="80" cy="240" r="8" fill="#E04B3A"/></svg>`;}

/* ---------- lesson view (frames come from deck.js) ---------- */
const stageOf=n=>STAGES.find(s=>n>=s.from&&n<=s.to);
let io=null, simIO=null, mounted=new Map(), timers=[], current=null, deck=null;
function cleanup(){ io&&io.disconnect(); simIO&&simIO.disconnect(); deck&&deck.io&&deck.io.disconnect(); mounted.forEach(m=>m&&m.destroy&&m.destroy()); mounted.clear(); timers.forEach(clearInterval); timers=[]; if(typeof eyeRaf!=='undefined'&&eyeRaf){cancelAnimationFrame(eyeRaf);} }
function show(id){
  cleanup();
  const main=$('#main'); const l=LESSONS.find(x=>String(x.n)===String(id));
  current=l||null; deck=null;
  document.body.classList.toggle('in-deck',!!l);
  main.innerHTML = l ? DECK.html(l,{next:LESSONS.find(x=>x.n===l.n+1), stage:stageOf(l.n), typeName}) : home();
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
