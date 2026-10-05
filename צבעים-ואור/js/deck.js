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

/* the action vocabulary (same as the journal): verb + icon, the most visible thing on every activity screen */
const ICP = {
  write:'<path d="M5 27l2-7L22 5l5 5L12 25z M19 8l5 5"/>', draw:'<path d="M4 26c5-8 9 2 14-6s6-10 10-12"/><circle cx="8" cy="9" r="3"/>',
  read:'<path d="M4 7c5-2 9-1 12 2 3-3 7-4 12-2v18c-5-2-9-1-12 2-3-3-7-4-12-2z M16 9v18"/>', look:'<path d="M2 16Q16 2 30 16Q16 30 2 16z"/><circle cx="16" cy="16" r="4.5"/>',
  talk:'<path d="M5 6h22v14H14l-6 6v-6H5z"/>', think:'<path d="M16 4a8 8 0 0 0-5 14v4h10v-4A8 8 0 0 0 16 4z M12 26h8 M13 29h6"/>',
  pick:'<path d="M11 15V6a2.5 2.5 0 0 1 5 0v8 M16 13a2.5 2.5 0 0 1 5 0v2 M21 15a2.5 2.5 0 0 1 5 0v4c0 6-4 9-9 9s-7-2-9-6l-3-6a2 2 0 0 1 3.5-2L11 18"/>',
  check:'<rect x="4" y="4" width="24" height="24" rx="4"/><path d="M9 16l5 5 9-10"/>', compare:'<path d="M4 11h20l-5-5 M28 21H8l5 5"/>',
  search:'<circle cx="13" cy="13" r="8"/><path d="M19 19l9 9"/>', ear:'<path d="M10 13a7 7 0 0 1 14 0c0 5-5 6-5 11a4 4 0 0 1-8 0 M14 14a3 3 0 0 1 6 0"/>'
};
const ACT = {'בוחרים':'pick','מסמנים':'check','מקיפים':'check','כותבים':'write','מציירים':'draw','מסתכלים':'look','מתעדים':'look','מנחשים':'think','חושבים':'think','משווים':'compare','בודקים':'search','מסבירים':'talk','קוראים':'read','מחברים':'compare','מקשיבים':'ear'};
const KIND_ACT = {open:'חושבים',predict:'מנחשים',explore:'מסתכלים',explain:'מקשיבים',write:'כותבים',reflect:'בודקים',close:'בוחרים'};
const actPill = v => `<span class="actpill"><svg viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ICP[ACT[v]||'think']}</g></svg><b>${esc(v)}</b></span>`;

/* one screen per activity: [reading] → [guess] → [tasks (or "do")] ↔ [simulation(s)].
   Journal tasks are shown on screen: ✏️ במחברת or 🗳 מצביעים (no printing needed). */
function stageFrames(l, s, si, total, ctx){
  const m = MODE[s.mode] || MODE.class, mins = s.to - s.from;
  const work = s.mode && s.mode!=='class';
  const out = [], data = `data-stage="${si}"`, T = window.TASKS;
  const head = (verb, title, chip) => `<div class="ahead">${actPill(verb)}<span class="chip mode"><span aria-hidden="true">${m[1]}</span> ${m[0]}</span>${chip||''}</div>${title?`<p class="atitle">${esc(title)}</p>`:''}`;
  const vtimer = `<div class="vtimer" data-stage="${si}" data-min="${mins}" role="timer" aria-label="טיימר">
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="vt-bg" cx="60" cy="60" r="52"/><circle class="vt-ring" cx="60" cy="60" r="52" pathLength="100"/></svg>
      <div class="vt-mid"><output>${mins}:00</output><small>דקות</small></div>
      <div class="vt-ctl"><button type="button" class="vt-minus" aria-label="פחות דקה">−</button><button type="button" class="vt-go" aria-label="הפעלה">▶</button><button type="button" class="vt-plus" aria-label="עוד דקה">+</button><button type="button" class="vt-rs" aria-label="איפוס">↺</button></div>
    </div>`;
  const withTimer = body => work ? `<div class="work"><div class="wbody">${body}</div>${vtimer}</div>` : body;
  const g = s.gate;

  /* collect the journal blocks for this stage (in page order, not used before) */
  const pre = [], tasks = [];
  if(T && ctx.jblocks){
    (ctx.jcues||[]).filter(c=>c.slide===si).forEach(c=>{
      const B = ctx.jblocks, i0 = B.findIndex(x=>x.id===c.block), i1 = c.until ? B.findIndex(x=>x.id===c.until) : i0;
      if(i0<0) return;
      let st = i0; while(st>0 && (T.CONTENT[B[st-1].type] || B[st-1].type==='note') && !ctx.used.has(B[st-1].id)) st--;
      for(let i=st;i<=Math.max(i0,i1);i++){ const bl=B[i]; if(ctx.used.has(bl.id) || bl.type==='flow' || bl.type==='bank' || bl.type==='legend') continue;
        ctx.used.add(bl.id);
        if(i===i0 && c.at==='question' && g) continue;           // the guess screen already asks this
        (c.at==='question' && i<i0 ? pre : tasks).push(bl); }
    });
  }
  /* reading screens (consecutive content blocks share one screen) */
  const readFrames = list2 => { const fr=[]; let buf=[];
    const flush=()=>{ if(buf.length){ fr.push(frame('read','','',`${head(buf.some(b=>b.type==='diagram')?'מסתכלים':'קוראים')}${buf.map(b=>b.type==='note'?`<p class="tnote">${esc(b.text)}</p>`:T.content(b)).join('')}`,'',data)); buf=[]; } };
    list2.forEach(b=>{ if(T.CONTENT[b.type]||b.type==='note') buf.push(b); else { flush(); const t=T.task(b); if(t) fr.push(frame('task','','',`${head(b.act||'חושבים','', t.mode==='vote'?T.VOTE:T.NOTEBOOK)}${withTimer(`<div class="tbody">${t.body}</div>`)}`,'',data)); } });
    flush(); return fr; };

  out.push(...readFrames(pre));
  // A. guess: the question, the vote and the reveal — all on one screen
  if(g){
    out.push(frame('guess', '', '', `${head(s.gateAct||'מנחשים', s.title)}
      <p class="big-q">${esc(s.lead)}</p>
      ${list(g.options)?`<div class="g-opts">${g.options.map((o,k)=>`<button type="button" class="g-opt" data-k="${k}"><span>${esc(o)}</span><b>0</b></button>`).join('')}<button type="button" class="g-clear" title="איפוס הספירה">↺</button></div>`:''}
      <div class="reveal-wrap"><button type="button" class="g-reveal">כולם ניחשו? חשיפה</button><p class="reveal-txt" hidden>${esc(g.reveal)}</p></div>`, '', data));
  }
  const sims = [].concat(s.sim||[]).filter(k=>SIMS[k]);
  const simFrames = sims.map(k=> frame('sim', '', '', `<div class="ahead">${actPill('מסתכלים')}</div><div class="sim-host" data-sim="${k}"></div>`, '', data));
  if(s.video) simFrames.push(frame('video', '', '', `<div class="ahead">${actPill('מסתכלים')}</div><video controls preload="metadata" src="${esc(s.video.src)}"></video>`, '', data));
  const taskFrames = readFrames(tasks);
  // B. do: when there are no journal tasks for this stage — verb + one instruction per line
  let doFrames = [];
  if(!taskFrames.length && (list(s.steps) || list(s.starters) || !g)){
    const verb = s.act || KIND_ACT[s.kind] || 'חושבים';
    const steps = list(s.steps) ? `<ol class="dosteps">${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>` : (!g ? `<p class="big-q">${esc(s.lead)}</p>` : '');
    const st = list(s.starters) ? `<div class="starters slim"><span class="sl-h">אפשר להתחיל כך:</span>${s.starters.map(x=>`<span>${esc(x)}</span>`).join('')}</div>` : '';
    doFrames.push(frame('do', '', '', `${head(verb, g ? '' : s.title)}${withTimer(steps+st)}`, '', data));
  }
  if(s.simFirst) out.push(...simFrames, ...taskFrames, ...doFrames);
  else out.push(...doFrames, ...taskFrames, ...simFrames);
  return out;
}

function html(l, ctx){
  const next = ctx.next, st = ctx.stage, total = l.slides.length;
  const J = (window.JOURNAL||{})[l.n];
  ctx.used = new Set(); ctx.jblocks = J ? J.pages.flatMap(p=>p.blocks) : null;
  if(J && window.JOURNAL_INDEX){ const ix = window.JOURNAL_INDEX(J); ctx.jcues = (J.cues||[]).map(c=>Object.assign({}, c, {label: window.JOURNAL_CUE_LABEL(J, ix, c)})).filter(c=>c.label); ctx.jpages = J.pages.length; }
  const cover = frame('cover', `${ctx.typeName(l.t)} · שיעור ${l.n} · ${l.c} באשכול`, '',
    `<div class="cover-grid"><h2 class="q">${esc(l.q)}</h2><figure class="cover-art"><svg viewBox="0 0 640 360" id="coverSvg" role="img" aria-label="${esc(l.q)}">${typeof SCENES!=='undefined'&&SCENES[l.cover]?SCENES[l.cover]():''}</svg></figure></div>`,
    now('השקופית הפותחת. משאירים אותה על המסך כשנכנסים לכיתה.'), 'data-stage="0"');
  const plan = frame('plan', '', 'מה מחכה לנו היום',
    `<ol class="agenda">${l.slides.map(s=>`<li><span>${esc(s.title||KIND[s.kind])}</span></li>`).join('')}</ol>`,
    now('מציגים את מהלך השיעור בקצרה.', [['מטרות',l.goals.map(g=>g[0]+': '+g[1]),'say'],['חומרים',l.mat,'tip'],['שלב הכתיבה · '+st.name,['תמיכה: '+st.sup,'עצמאות מצופה: '+st.exp],'ask'],[esc(l.checkLabel||'בדיקת הבנה'),l.check?[l.check]:null,'watch'],['העמקה לבחירה',l.deep?[l.deep]:null,'ask']]), 'data-stage="0"');
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
  $$('.f-guess, .f-task').forEach(f=>f.addEventListener('click',e=>{
    const o=e.target.closest('.g-opt'); if(o){ const b=o.querySelector('b'); b.textContent=+b.textContent+1; o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); }
    if(e.target.closest('.g-clear')) $$('.g-opt b',e.target.closest('.g-opts')).forEach(b=>b.textContent=0);
  }));
  $$('.f-guess .g-reveal').forEach(b=>b.addEventListener('click',()=>{ const t=b.parentElement.querySelector('.reveal-txt'); t.hidden=false; b.hidden=true; window.MOTION&&MOTION.reveal(t); }));
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
