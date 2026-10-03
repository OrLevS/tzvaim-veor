/* Lesson deck — "one concept per screen", modelled on OrLev's own course slides:
   one title with a thin multicolor rule, one idea, one visual; a small "עכשיו" strip tells the teacher what to do.
   Exposes window.DECK = {html(lesson), wire(lesson, ctx)} for app.js. */
(function(){
const SIMS = window.SIMS || {};
const esc = s => String(s ?? '');
const nums = s => esc(s).replace(/(\d+)–(\d+)/g,'<bdi dir="ltr">$1–$2</bdi>');
const list = a => a && a.length ? a : null;
const KIND = {open:'פתיחה',predict:'ניבוי',explore:'התנסות',explain:'הסבר',write:'כתיבה',reflect:'רפלקציה',close:'סגירה'};
const MODE = {solo:['לבד','👤'],pair:['בזוגות','👥'],group:['בקבוצות','👪'],class:['במליאה','🏫']};

/* teacher strip: one line "what to do now" + optional details */
function now(action, more, timerMin){
  const det = more && more.length ? `<details class="now-more"><summary>עוד למורה</summary>${more.map(([h,arr,cls])=>list(arr)?`<div class="t-sec ${cls||''}"><h5>${h}</h5>${arr.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:'').join('')}</details>` : '';
  const tm = timerMin ? `<div class="timer" data-min="${timerMin}"><button type="button" class="tm-go" aria-label="הפעלת טיימר">▶</button><output>${String(timerMin).padStart(2,'0')}:00</output><button type="button" class="tm-rs" aria-label="איפוס">↺</button></div>` : '';
  return `<aside class="now" aria-label="למורה"><div class="now-line"><b>עכשיו</b><span>${action}</span>${tm}</div>${det}</aside>`;
}
function frame(type, stageLabel, title, body, nowHtml, extra=''){
  return `<section class="frame f-${type}" ${extra}>
    <div class="fr-in">
      ${stageLabel?`<p class="fr-stage">${stageLabel}</p>`:''}
      ${title?`<h3 class="fr-title">${esc(title)}</h3><i class="rule" aria-hidden="true"></i>`:''}
      <div class="fr-body">${body}</div>
    </div>${nowHtml||''}
  </section>`;
}

function stageFrames(l, s, si, total, ctx){
  const m = MODE[s.mode] || MODE.class, t = s.teacher || {}, mins = s.to - s.from;
  const label = '';                       // less on every screen: no stage/time line
  const work = s.mode && s.mode!=='class'; // independent / pair / group work → visual timer
  const all = [['מה להגיד',t.say,'say'],['שאלות מנחות',t.ask,'ask'],['לשים לב',t.watch,'watch'],['טיפ',t.tip?[t.tip]:null,'tip']];
  const out = [];
  const data = `data-stage="${si}"`;
  const vtimer = `<div class="vtimer" data-stage="${si}" data-min="${mins}" role="timer" aria-label="טיימר">
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="vt-bg" cx="60" cy="60" r="52"/><circle class="vt-ring" cx="60" cy="60" r="52" pathLength="100"/></svg>
      <div class="vt-mid"><output>${mins}:00</output><small>דקות</small></div>
      <div class="vt-ctl"><button type="button" class="vt-minus" aria-label="פחות דקה">−</button><button type="button" class="vt-go" aria-label="הפעלה">▶</button><button type="button" class="vt-plus" aria-label="עוד דקה">+</button><button type="button" class="vt-rs" aria-label="איפוס">↺</button></div>
    </div>`;
  // 1. stage opener (like the deck's section slides): title + who works with whom
  out.push(frame('stage', '', '', `
    <p class="st-kind">${KIND[s.kind]||''}</p>
    <h3 class="st-title">${esc(s.title||'')}</h3><i class="rule" aria-hidden="true"></i>
    <div class="st-chips"><span class="chip big"><span aria-hidden="true">${m[1]}</span> ${m[0]}</span></div>`,
    now(`פותחים שלב חדש: ${esc(s.title||KIND[s.kind])}. עבודה ${m[0]} (בתכנון: ${mins} דק׳).`, all), data));
  // 2. the question — only the big question and the vote; the instruction goes to the teacher strip
  const g = s.gate;
  const qBody = `<p class="big-q">${esc(s.lead)}</p>` + (g && list(g.options) ? `<div class="g-opts">${g.options.map((o,k)=>`<button type="button" class="g-opt" data-k="${k}"><span>${esc(o)}</span><b>0</b></button>`).join('')}<button type="button" class="g-clear" title="איפוס הספירה">↺</button></div>` : '');
  out.push(frame(g?'question':'lead', label, '', qBody,
    now(g ? `אומרים: ״${esc(g.prompt)}״ — ואז אוספים ניחושים (לחיצה על תשובה = עוד הצבעה). עדיין לא חושפים.` : 'מקריאים את המשפט ומוודאים שכולם יודעים מה המשימה.', g?[['שאלות מנחות',t.ask,'ask'],['לשים לב',t.watch,'watch']]:null), data));
  // 3. reveal (curtain)
  if(g) out.push(frame('reveal', label, '', `
    <div class="curtain"><button type="button" class="g-reveal">כולם ניחשו? לחצו לחשיפה</button></div>
    <p class="reveal-txt" hidden>${esc(g.reveal)}</p>`,
    now('רק אחרי שכולם ניחשו: לוחצים על החשיפה.', [['מה להגיד',t.say,'say']]), data));
  // 4. instructions — at most 2 per screen; work stages get the big visual timer
  if(list(s.steps)){
    const n = s.steps.length, per = 2; const chunks = []; for(let i=0;i<n;i+=per) chunks.push(s.steps.slice(i,i+per));
    chunks.forEach((c,ci)=>{ const last = ci===chunks.length-1;
      const list2 = `<ol class="steps big" style="counter-reset:st ${ci*per}">${c.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
      out.push(frame('steps', label, '', work ? `<div class="work">${list2}${vtimer}</div>` : list2,
        now(work ? (last ? 'מקריאים, ומפעילים את הטיימר הגדול (▶). אפשר להוסיף או להוריד דקה.' : 'מקריאים את ההוראות. הטיימר משותף לכל השקופיות של השלב.') : 'מקריאים את ההוראות.',
            g?[['לשים לב',t.watch,'watch'],['טיפ',t.tip?[t.tip]:null,'tip']]:all), data)); });
  }
  // 5. simulation(s) — one screen per sim
  const sims = [].concat(s.sim||[]).filter(k=>SIMS[k]);
  const notes = [].concat(s.simNote||[]);
  sims.forEach((k,si2)=> out.push(frame('sim', label, '',
    `<div class="sim-host" data-sim="${k}"></div>`,
    now(esc(notes[si2]||notes[0]||'מפעילים את ההדמיה במסך המשותף, וקודם מבקשים ניבוי.')), data)));
  // 6. video (future: s.video = {src, title})
  if(s.video) out.push(frame('video', label, '',
    `<video controls preload="metadata" src="${esc(s.video.src)}"></video>`, now('מקרינים את הסרטון. עוצרים בכל כרטיס עצירה ושואלים.'), data));
  // 7. sentence starters (+ the timer, since writing is independent work)
  if(list(s.starters)) out.push(frame('starters', label, 'אפשר להתחיל כך',
    `<div class="starters big">${s.starters.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${work?vtimer.replace('class="vtimer"','class="vtimer small"'):''}`,
    now('משאירים את המסך הזה פתוח בזמן הכתיבה. לא מראים פסקה לדוגמה.', [['לשים לב',t.watch,'watch']]), data));

  /* journal cues: exactly which page/task to fill on which screen */
  const cues = (ctx.jcues||[]).filter(c=>c.slide===si);
  if(cues.length){
    const has = t => out.some(f=>f.includes(`class="frame f-${t}"`));
    const qType = g ? 'question' : 'lead';
    cues.forEach(c=>{
      let at = c.at==='question' ? qType : c.at;
      if(!has(at)) at = has('steps') ? 'steps' : qType;
      const k = out.findIndex(f=>f.includes(`class="frame f-${at}"`)); if(k<0) return;
      const lab = c.label;
      const banner = `<div class="jcue"><span class="jicon" aria-hidden="true">📒</span><p class="jwhere">יומן · ${lab.pages}${lab.tasks}</p></div>`;
      out[k] = out[k].replace('<div class="fr-body">', '<div class="fr-body">'+banner)
                     .replace('<b>עכשיו</b><span>', `<b>עכשיו</b><span><b class="jn">📒 יומן: ${lab.pages}${lab.tasks} — ${esc(c.do)}</b> `);
    });
    const sum = [...new Set(cues.map(c=>c.label.pages))].join(', ');
    out[0] = out[0].replace('<p class="st-count">', `<p class="st-journal">📒 ביומן החוקר: ${sum}</p><p class="st-count">`);
  }
  return out;
}

function html(l, ctx){
  const next = ctx.next, st = ctx.stage, total = l.slides.length;
  const J = (window.JOURNAL||{})[l.n];
  if(J && window.JOURNAL_INDEX){ const ix = window.JOURNAL_INDEX(J); ctx.jcues = (J.cues||[]).map(c=>Object.assign({}, c, {label: window.JOURNAL_CUE_LABEL(J, ix, c)})).filter(c=>c.label); ctx.jpages = J.pages.length; }
  const cover = frame('cover', `${ctx.typeName(l.t)} · שיעור ${l.n} · ${l.c} באשכול`, '',
    `<div class="cover-grid"><h2 class="q">${esc(l.q)}</h2><figure class="cover-art"><svg viewBox="0 0 640 360" id="coverSvg" role="img" aria-label="${esc(l.q)}">${typeof SCENES!=='undefined'&&SCENES[l.cover]?SCENES[l.cover]():''}</svg></figure></div>`,
    now('השקופית הפותחת. משאירים אותה על המסך כשנכנסים לכיתה.'), 'data-stage="0"');
  const plan = frame('plan', '', 'מה מחכה לנו היום',
    `<ol class="agenda">${l.slides.map(s=>`<li><span>${esc(s.title||KIND[s.kind])}</span></li>`).join('')}</ol>`,
    now(ctx.jpages ? `מציגים את מהלך השיעור בקצרה, ומחלקים את יומן החוקר — שיעור ${l.n} (${ctx.jpages} עמודים).` : 'מציגים את מהלך השיעור בקצרה.', [['מטרות',l.goals.map(g=>g[0]+': '+g[1]),'say'],['חומרים',l.mat,'tip'],['שלב הכתיבה · '+st.name,['תמיכה: '+st.sup,'עצמאות מצופה: '+st.exp],'ask'],[esc(l.checkLabel||'בדיקת הבנה'),l.check?[l.check]:null,'watch'],['העמקה לבחירה',l.deep?[l.deep]:null,'ask']]), 'data-stage="0"');
  const frames = l.slides.flatMap((s,i)=>stageFrames(l,s,i+1,total,ctx));
  const end = frame('end', '', 'סוף השיעור',
    `${next?`<a class="cta" href="#${next.n}">לשיעור ${next.n}: ${esc(next.q)} ←</a>`:'<a class="cta" href="#home">למבט על ←</a>'}`,
    '', `data-stage="${total+1}"`);
  const all = [cover, plan, ...frames, end].map((f,k)=>f.replace('<section class="frame', `<section id="f${k}" data-k="${k}" class="frame`));
  const rail = `<nav class="rail" aria-label="שלבי השיעור"><a href="#" data-stage-go="0" title="פתיחה"><i></i><span>פתיחה</span></a>${l.slides.map((s,i)=>`<a href="#" data-stage-go="${i+1}"><i></i><span>${i+1} · ${esc(s.title||KIND[s.kind])}</span></a>`).join('')}<a href="#" data-stage-go="${total+1}"><i></i><span>סוף</span></a></nav>`;
  return `<div class="deck" style="--k:${l.t==='sci'?'var(--teal)':'var(--rust)'}">${rail}<div class="minute" aria-hidden="true"><i></i></div><div class="fcount" aria-live="polite"></div>${all.join('')}</div>`;
}

function wire(l, ctx){
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  $$('.f-question').forEach(f=>f.addEventListener('click',e=>{
    const o=e.target.closest('.g-opt'); if(o){ const b=o.querySelector('b'); b.textContent=+b.textContent+1; o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); }
    if(e.target.closest('.g-clear')) $$('.g-opt b',f).forEach(b=>b.textContent=0);
  }));
  $$('.f-reveal').forEach(f=>f.querySelector('.g-reveal').addEventListener('click',()=>{ f.querySelector('.curtain').classList.add('open'); const t=f.querySelector('.reveal-txt'); t.hidden=false; window.MOTION&&MOTION.reveal(t); }));
  const frames = $$('.frame'), total = frames.length, cnt = document.querySelector('.fcount'), bar = document.querySelector('.minute i');
  const setActive = k => {
    const f = frames[k]; if(!f) return; const st = +f.dataset.stage;
    $$('.rail a').forEach(a=>a.classList.toggle('on', +a.dataset.stageGo===st));
    if(cnt) cnt.textContent = `${k+1} / ${total}`;
    const s = l.slides[st-1]; if(bar) bar.style.width = (s ? s.to/45*100 : st===0?0:100)+'%';
    frames.forEach(x=>x.classList.toggle('cur', x===f));
  };
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); if(!e.target.dataset.played){ e.target.dataset.played=1; window.MOTION&&MOTION.enter(e.target); } setActive(+e.target.dataset.k); } }),{threshold:.55});
  frames.forEach(f=>io.observe(f));
  $$('.rail a').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); const f=document.querySelector(`.frame[data-stage="${a.dataset.stageGo}"]`); f&&f.scrollIntoView({behavior:ctx.motion()?'smooth':'auto'}); }));
  return { io, go: k => { const f=frames[Math.max(0,Math.min(total-1,k))]; f&&f.scrollIntoView({behavior:ctx.motion()?'smooth':'auto',block:'start'}); },
           index: () => { const y=scrollY+innerHeight*.35; let k=0; frames.forEach((f,i)=>{ if(f.offsetTop<=y) k=i; }); return k; } };
}
window.DECK = {html, wire};
})();
