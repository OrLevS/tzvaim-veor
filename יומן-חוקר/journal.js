/* יומן חוקר.ת — רינדור (גרסה 4): הפעולה היא הדבר הבולט ביותר בכל משימה.
   כל משימה = 3 שכבות קבועות: [מספר + פעולה (פועל + אייקון)] → [הוראה קצרה, אחת בכל שורה] → [התוכן].
   בכל עמוד: פס התקדמות קצר (איפה אנחנו בשיעור). שחור־לבן: הצורה והאייקון נושאים את המשמעות, לא הצבע.
   mode = document.body.dataset.mode ('print' | 'digital') */
(function(){
const mode = document.body.dataset.mode;
const n = +(new URLSearchParams(location.search).get('l') || 1);
const L = (window.JOURNAL||{})[n];
const root = document.getElementById('journal');
if(!L){ root.textContent = 'לא נמצא שיעור ' + n; return; }
document.title = L.crumb ? `${L.title} · ${L.kind}` : `יומן חוקר.ת · שיעור ${L.n} · ${L.title}`;
const IX = window.JOURNAL_INDEX(L);
if(L.cls) document.body.classList.add(L.cls);
const esc = s => String(s ?? '').replace(/[<>&]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
let rich = s => esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\+\+(.+?)\+\+/g,'<u>$1</u>').replace(/_{3,}/g,'<span class="blank"></span>')
/* נוסחאות כימיות (רק ביחידות שמבקשות): H2O → H<sub>2</sub>O */
if(L.formulas){ const rich0 = rich; rich = s => rich0(s).replace(/([A-Za-z)])(\d+)/g,'$1<sub>$2</sub>'); }

/* outline icons (print well in black & white) */
const P = {
  write:'<path d="M5 27l2-7L22 5l5 5L12 25z M19 8l5 5"/>',
  draw:'<path d="M4 26c5-8 9 2 14-6s6-10 10-12"/><circle cx="8" cy="9" r="3"/>',
  read:'<path d="M4 7c5-2 9-1 12 2 3-3 7-4 12-2v18c-5-2-9-1-12 2-3-3-7-4-12-2z M16 9v18"/>',
  look:'<path d="M2 16Q16 2 30 16Q16 30 2 16z"/><circle cx="16" cy="16" r="4.5"/>',
  talk:'<path d="M5 6h22v14H14l-6 6v-6H5z"/>',
  think:'<path d="M16 4a8 8 0 0 0-5 14v4h10v-4A8 8 0 0 0 16 4z M12 26h8 M13 29h6"/>',
  pick:'<path d="M11 15V6a2.5 2.5 0 0 1 5 0v8 M16 13a2.5 2.5 0 0 1 5 0v2 M21 15a2.5 2.5 0 0 1 5 0v4c0 6-4 9-9 9s-7-2-9-6l-3-6a2 2 0 0 1 3.5-2L11 18"/>',
  check:'<rect x="4" y="4" width="24" height="24" rx="4"/><path d="M9 16l5 5 9-10"/>',
  compare:'<path d="M4 11h20l-5-5 M28 21H8l5 5"/>',
  search:'<circle cx="13" cy="13" r="8"/><path d="M19 19l9 9"/>',
  up:'<path d="M16 4L29 27H3z M16 12v8"/>',
  home:'<path d="M4 15L16 5l12 10 M7 13v14h18V13 M13 27v-8h6v8"/>',
  ear:'<path d="M10 13a7 7 0 0 1 14 0c0 5-5 6-5 11a4 4 0 0 1-8 0 M14 14a3 3 0 0 1 6 0"/>',
  dice:'<rect x="5" y="5" width="22" height="22" rx="5"/><circle cx="11" cy="11" r="1.6"/><circle cx="21" cy="21" r="1.6"/><circle cx="16" cy="16" r="1.6"/>',
  cloud:'<path d="M9 24a6 6 0 0 1 1-12 8 8 0 0 1 15 2 5 5 0 0 1 0 10z"/>',
  down:'<path d="M16 4v22 M7 18l9 9 9-9"/>'
};
const icon = (k, cls='') => `<svg class="ic ${cls}" viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${P[k]||''}</g></svg>`;
/* the action vocabulary — one verb, one icon, used the same way across the whole journal */
const ACT = {'בוחרים':'pick','מסמנים':'check','מקיפים':'check','כותבים':'write','מציירים':'draw','מסתכלים':'look','מתעדים':'look','מנחשים':'think','חושבים':'think','משווים':'compare','בודקים':'search','מסבירים':'talk','קוראים':'read','מחברים':'compare'};
const spk = b => mode==='digital' ? `<button type="button" class="spk" data-a="${b.id}" aria-label="הקראה" hidden>🔊</button>` : '';
const lines = (k, label) => (label?`<p class="llabel">${rich(label)}</p>`:'') + `<div class="lines" style="--n:${k}"></div>`;
const pie = f => `<svg class="pie" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>${f>=1?'<circle cx="12" cy="12" r="10" fill="currentColor"/>':f>0?`<path d="M12 12V2A10 10 0 ${f>.5?1:0} 1 ${(12+10*Math.sin(f*2*Math.PI)).toFixed(2)} ${(12-10*Math.cos(f*2*Math.PI)).toFixed(2)}Z" fill="currentColor"/>`:''}</svg>`;

const DIAGRAMS = {
  sky: () => `<figure class="dg sky">
   <figcaption class="dg-title"><span class="mk">1</span> מסלול אור השמש באוויר</figcaption>
   <svg viewBox="0 0 520 205" role="img" aria-label="אור שמש נכנס לאוויר. אור קצר־גל מתפזר ממולקולה לכל הכיוונים, וחלק מגיע לעין. אור ארוך־גל ממשיך ישר.">
    <path d="M0 50 H520" class="ln dash"/><text x="60" y="42" class="lbl">גבול האוויר</text>
    <circle cx="470" cy="22" r="16" class="ln fillw"/>
    <path d="M455 36 L270 108" class="sw"/><path d="M455 36 L120 175" class="lw"/>
    <circle cx="265" cy="110" r="7" class="dot"/>
    <path d="M262 114 L110 168" class="sw hl3"/><path d="M270 104 L330 58" class="sw"/><path d="M258 104 L170 70" class="sw"/><path d="M272 114 L360 160" class="sw"/>
    <g transform="translate(95,175)"><path d="M-18 0Q0-12 18 0Q0 12-18 0Z" class="ln fillw"/><circle r="4.5" class="dot"/></g><text x="95" y="200" class="lbl">עין</text>
    <path d="M0 194 Q130 184 260 194 T520 194" class="ln"/>
    <g class="num"><circle cx="370" cy="66" r="11"/><text x="370" y="71">א</text><circle cx="290" cy="128" r="11"/><text x="290" y="133">ב</text><circle cx="150" cy="140" r="13" class="hl"/><text x="150" y="145">ג</text><circle cx="200" cy="165" r="11"/><text x="200" y="170">ד</text></g>
   </svg>
   <div class="legend"><span class="mk">2</span><span><i class="lg sw"></i> קו מקווקו = אור כחול (קצר־גל)</span><span><i class="lg lw"></i> קו רציף = אור אדום (ארוך־גל)</span></div></figure>`
};

/* יחידות אחרות (למשל מערכת ההובלה) מוסיפות תרשימים משלהן דרך window.JOURNAL_DIAGRAMS */
Object.assign(DIAGRAMS, window.JOURNAL_DIAGRAMS || {});
Object.assign(P, window.JOURNAL_ICONS || {});  /* ואייקונים משלהן (צורה = משמעות, גם בשחור־לבן) */
/* גרסת מורה: ?key=1 מציג את התשובה (שדה key) מתחת לכל משימה */
const KEY = new URLSearchParams(location.search).get('key') === '1';
if(KEY){ document.body.classList.add('is-key'); document.title += ' · גרסת מורה'; }
const keyHtml = b => KEY && b.key ? `<p class="keyans"><b>למורה:</b> ${rich(b.key)}</p>` : '';

function taskHead(b){
  const a = IX[b.id], num = a.tasks.length ? `<span class="tnum">${a.tasks.join('–')}</span>` : '';
  const act = b.act ? `<span class="act">${icon(ACT[b.act]||'think')}<b>${esc(b.act)}</b></span>` : '';
  const meta = [b.tag==='up' ? `<span class="tag">${icon('up')} אתגרי</span>` : '', b.home ? `<span class="tag">${icon('home')} לבית</span>` : '', b.board ? `<span class="tag board">${icon('board')} יחד על הלוח</span>` : ''].join('');
  const inst = [].concat(b.q||[]).map(x=>`<p class="inst">${rich(x)}</p>`).join('');
  return `<div class="th">${num}${act}${meta}${spk(b)}</div>${inst}`;
}
const conf = kind => `<div class="conf"><p class="inst">${kind==='again'?'כמה אני בטוח.ה עכשיו? (השוו לעמוד 1)':'כמה אני בטוח.ה?'} <b>הקיפו.</b></p><div class="scale">${[['בכלל לא',.0],['קצת',.25],['די בטוח.ה',.5],['מאוד',1]].map(([w,f])=>`<span>${pie(f)}<small>${w}</small></span>`).join('')}</div></div>`;
const opt = o => typeof o==='string' ? `<span>${rich(o)}</span>` : `${icon(o.ic,'oi')}<span>${rich(o.t)}</span>`;

function block(b){
  const up = b.tag==='up' ? ' is-up' : '';
  switch(b.type){
    case 'choice': return `<div class="task${up}" id="${b.id}">${taskHead(b)}
      <ul class="opts${b.inline?' inline':''}">${b.options.map(o=>`<li><span class="box${b.multi?'':' round'}"></span>${opt(o)}</li>`).join('')}${b.other?'<li><span class="box round"></span><span>אחר: <span class="blank"></span></span></li>':''}</ul>
      ${b.lines?lines(b.lines,b.linesLabel):''}${b.confidence?conf(b.confidence):''}</div>`;
    case 'q': return `<div class="task${up}" id="${b.id}">${taskHead(b)}${b.steps?`<ul class="lst">${b.steps.map(s=>`<li>${rich(s)}</li>`).join('')}</ul>`:''}${b.lines===0?'':lines(b.lines||1,b.linesLabel)}</div>`;
    case 'fields': return `<div class="task${up}" id="${b.id}">${taskHead(b)}<div class="fields">${b.fields.map(f=>`<p class="field"><span>${rich(f)}</span><span class="blank long"></span></p>`).join('')}</div></div>`;
    case 'table': return `<div class="task" id="${b.id}">${taskHead(b)}<table><thead><tr>${b.cols.map(c=>`<th>${rich(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>Array.isArray(r) ? `<tr><th>${rich(r[0])}</th>${r.slice(1).map(c=>`<td${c?' class="given"':''}>${rich(c)}</td>`).join('')}</tr>` : `<tr><th>${opt(r)}</th>${b.cols.slice(1).map(()=>'<td></td>').join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'flow': return `<div class="flowstep" id="${b.id}">${icon('down','big')}<b>${rich(b.text)}</b>${icon('down','big')}</div>`;
    case 'classify': { const SV = b.solved || (b.example!=null ? {0:b.example} : {});
      return `<div class="task" id="${b.id}">${taskHead(b)}
      <div class="kinds">${b.kinds.map(k=>`<span>${icon(k.ic)} <b>${esc(k.t)}</b>${k.d?` = ${esc(k.d)}`:''}</span>`).join('')}</div>
      <ul class="rows">${b.items.map((x,i)=>{ const sv = SV[i]; return `<li class="${sv!=null?'ex':''}"><span class="txt">${rich(x)}</span><span class="pick2">${b.kinds.map((k,j)=>`<span class="pill${sv===j?' on':''}">${icon(k.ic)} ${esc(k.t)}</span>`).join('')}</span>${sv!=null?'<small class="exl">פתור</small>':''}</li>`; }).join('')}</ul>${b.lines?lines(b.lines,b.linesLabel):''}</div>`; }
    /* שתי דרכים, זו לצד זו (״בעצמי״ מימין, ״עם עזרה״ משמאל), באותו גודל. בוחרים אחת ומסמנים; מותר לעבור. */
    case 'ways': { const part = x => x.p ? `<p class="wp">${rich(x.p)}</p>`
        : x.line!=null ? `<p class="fr"><span>${rich(x.line)}</span><span class="blank"></span></p>`
        : x.lines ? lines(x.lines)
        : x.opts ? `<p class="wo">${x.label?`<span>${rich(x.label)}</span>`:''}${x.opts.map(o=>`<span><span class="box round"></span>${rich(o)}</span>`).join('')}</p>`
        : x.checks ? `<ul class="wc">${x.checks.map(o=>`<li><span class="box"></span>${rich(o)}</li>`).join('')}</ul>`
        : x.chain ? `<div class="vchain">${x.chain.map((c,i)=>`<span class="vb${c?'':' empty'}">${c?rich(c):''}</span>${i<x.chain.length-1?'<i>↓</i>':''}`).join('')}</div>` : '';
      /* only:'b' — רק הדרך עם התמיכה, בלי מלבנים ובלי תווית (כשזו האפשרות היחידה) */
      if(b.only) return `<div class="task${up}" id="${b.id}">${taskHead(b)}<div class="way1">${(b[b.only].parts||[]).map(part).join('')}</div></div>`;
      const way = (w,ic) => `<div class="way2"><p class="wt2"><span class="box"></span>${icon(ic)}<b>${esc(w.t)}</b></p>${(w.parts||[]).map(part).join('')}</div>`;
      return `<div class="task${up}" id="${b.id}">${taskHead(b)}<p class="wayhint">בחרו דרך אחת וסמנו אותה. התחלתם לבד ונתקעתם? עברו לדרך השנייה וסמנו גם אותה.</p><div class="ways2">${way(b.a,'write')}${way(b.b,'pick')}</div></div>`; }
    /* זוגות: מצב קצר + שתי אפשרויות לבחירה, צמודות אליו. it.ans = האפשרות הנכונה, it.solved = פריט פתור */
    case 'pairs': return `<div class="task${up}" id="${b.id}">${taskHead(b)}<ol class="pairs">${b.items.map(it=>`<li class="${it.solved?'ex':''}">${it.s?`<p class="ps">${rich(it.s)}${it.solved?' <small class="exl">פתור</small>':''}</p>`:''}<div class="po">${it.o.map((o,j)=>`<span class="opt2${it.solved&&j===it.ans?' on':''}"><span class="box round${it.solved&&j===it.ans?' fill':''}"></span><span>${rich(o)}</span></span>`).join('')}</div></li>`).join('')}</ol>${b.lines?lines(b.lines,b.linesLabel):''}</div>`;
    case 'marks': return `<div class="task" id="${b.id}">${taskHead(b)}
      <div class="kinds">${[['✓','מסכים.ה ויכול.ה להסביר'],['?','לא בטוח.ה'],['✗','חושב.ת שזה לא נכון']].map(([m,t])=>`<span><i class="mk3">${m}</i> ${t}</span>`).join('')}</div>
      <ol class="rows">${b.items.map(x=>`<li><span class="txt">${rich(x)}</span><span class="pick3"><i class="mk3">✓</i><i class="mk3">?</i><i class="mk3">✗</i></span></li>`).join('')}</ol>${b.lines?lines(b.lines,b.linesLabel):''}</div>`;
    case 'answer3': return `<div class="task" id="${b.id}">${taskHead(b)}<p class="inst">בחרו דרך אחת לענות:</p>
      <div class="ways"><div class="way"><p class="wt">${icon('write')} <b>עם עזרה</b></p>${b.frame.map(f=>`<p class="fr">${rich(f)}</p>`).join('')}${b.tall?'<p class="fr"><span class="blank"></span></p><p class="fr"><span class="blank"></span></p>':''}</div>
      <div class="way"><p class="wt">${icon('write')} <b>בעצמי</b> — במילים, או ${icon('draw')} <b>בציור</b> עם 3 תוויות</p><div class="selfbox${b.tall?' tall2':''}"></div></div></div></div>`;
    case 'draw': return `<div class="task" id="${b.id}">${taskHead(b)}<div class="selfbox tall"></div></div>`;
    case 'chain': return `<div class="task" id="${b.id}">${taskHead(b)}<div class="chainrow">${b.boxes.map((x,i)=>`<span class="cbox">${x?esc(x):''}</span>${i<b.boxes.length-1?'<span class="carr">←</span>':''}`).join('')}</div></div>`;
    case 'texts': return `<div class="texts" id="${b.id}">${b.items.map(t=>`<div class="txtbox"><p class="tt">${esc(t.title)}</p>${t.list?`<ul>${t.list.map(x=>`<li>${rich(x)}</li>`).join('')}</ul>`:`<p>${rich(t.text)}</p>`}</div>`).join('')}${spk(b)}</div>`;
    case 'route': return `<div class="route" id="${b.id}"><b>${esc(b.title)}</b>${b.steps.map((x,i)=>`<span><i class="mk">${i+1}</i>${esc(x)}</span>${i<b.steps.length-1?'<span class="rarr">←</span>':''}`).join('')}</div>`;
    case 'note': return `<p class="note" id="${b.id}">${rich(b.text)}${spk(b)}</p>`;
    case 'box': return `<div class="xbox${up}" id="${b.id}"><p class="xt">${b.tag==='up'?icon('up')+' ':''}<b>${esc(b.title)}</b>${spk(b)}</p>${[].concat(b.text).map(t=>`<p>${rich(t)}</p>`).join('')}</div>`;
    /* סיפור לאורך ציר זמן: שנה בעיגול, כותרת קצרה, 1–3 משפטים */
    case 'timeline': return `<div class="tline" id="${b.id}">${b.title?`<p class="xt">${icon('read')} <b>${esc(b.title)}</b></p>`:''}${b.intro?`<p class="tl-intro">${rich(b.intro)}</p>`:''}<ol>${b.items.map(it=>`<li><span class="yr">${esc(it.y)}</span><div><b>${rich(it.t)}</b> ${rich(it.x)}</div></li>`).join('')}</ol></div>`;
    /* הסבר שהמורה מלמדת: טקסט קצר + תרשים בצד (או מתחת) */
    case 'teach': return `<div class="teach${b.dg&&!b.below?' side':''}" id="${b.id}"><div class="tx"><p class="xt">${icon('ear')} <b>${esc(b.title)}</b></p>${[].concat(b.text||[]).map(t=>`<p>${rich(t)}</p>`).join('')}${b.list?`<ul>${b.list.map(t=>`<li>${rich(t)}</li>`).join('')}</ul>`:''}</div>${b.dg?`<div class="tdg">${DIAGRAMS[b.dg]()}</div>`:''}</div>`;
    case 'reps': return `<div class="reps" id="${b.id}">
      <div class="rep"><p class="rt"><span class="mk">1</span> תרשים מסלול</p><svg viewBox="0 0 300 150" aria-label="תרשים מסלול"><path d="M0 34H300" fill="none" stroke="#000" stroke-width="1.2" stroke-dasharray="5 4"/><circle cx="268" cy="20" r="11" fill="#fff" stroke="#000" stroke-width="2"/><path d="M258 30L160 78" stroke="#000" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M258 30L70 128" stroke="#000" stroke-width="3"/><circle cx="157" cy="80" r="5"/><path d="M155 83L62 118 M160 76L200 44 M153 76L100 50 M162 84L220 112" stroke="#000" stroke-width="2.2" stroke-dasharray="6 4" fill="none"/><g transform="translate(52,122)"><path d="M-13 0Q0-9 13 0Q0 9-13 0Z" fill="#fff" stroke="#000" stroke-width="2"/><circle r="3"/></g><path d="M0 142Q150 134 300 142" fill="none" stroke="#000" stroke-width="1.6"/></svg><p class="rk">מקווקו = כחול · רציף = אדום</p></div>
      <div class="rep"><p class="rt"><span class="mk">2</span> שרשרת סיבה ותוצאה</p><div class="mchain"><span>אור השמש — כל הצבעים</span><i>↓</i><span>פוגע במולקולות אוויר</span><i>↓</i><span>כחול מתפזר הרבה, אדום מעט</span><i>↓</i><span>כחול מגיע לעין מכל כיוון</span><i>↓</i><span class="end">ולכן: השמיים כחולים</span></div></div>
      <div class="rep"><p class="rt"><span class="mk">3</span> גרף: כמה כל צבע מתפזר?</p><svg viewBox="0 0 300 150" aria-label="גרף עמודות"><line x1="20" y1="122" x2="295" y2="122" stroke="#000" stroke-width="1.6"/>${[[7.6,'סגול'],[4.8,'כחול'],[2.9,'ירוק'],[2.0,'צהוב'],[1.6,'כתום'],[1,'אדום']].map(([v,n],i)=>`<rect x="${28+i*45}" y="${122-v*13}" width="32" height="${v*13}" fill="${['#222','#555','#777','#999','#b5b5b5','#d0d0d0'][i]}" stroke="#000" stroke-width="1"/><text x="${44+i*45}" y="${116-v*13}" font-size="12" font-weight="700" text-anchor="middle" font-family="Rubik">${v}</text><text x="${44+i*45}" y="138" font-size="12" text-anchor="middle" font-family="Rubik">${n}</text>`).join('')}</svg><p class="rk">אדום = 1 · משמאל גל קצר, מימין גל ארוך</p></div>
      <div class="rep"><p class="rt"><span class="mk">4</span> הסבר במילים</p><p class="rtext">אור השמש מכיל את כל הצבעים. כשהוא עובר באוויר, מולקולות האוויר מפזרות אור כחול הרבה יותר מאור אדום. לכן אור כחול מגיע אלינו מכל כיווני השמיים — והשמיים נראים כחולים.</p></div>
    </div>`;
    case 'diagram': return `<div class="diagram" id="${b.id}">${DIAGRAMS[b.name]()}</div>`;
  }
  return '';
}

const NP = L.pages.length, STEPS = L.progress || L.pages.map(p=>p.title);
const strip = pi => `<div class="prog" aria-label="איפה אנחנו">${STEPS.map((s,i)=>`<span class="${i<pi?'done':i===pi?'cur':''}"><i>${i<pi?'✓':i===pi?'●':'○'}</i>${esc(s)}</span>${i<STEPS.length-1?'<b>←</b>':''}`).join('')}</div>`;
root.innerHTML = L.pages.map((p,pi)=>`<section class="page${p.cover?' first':''}">
  <header class="ph"><span class="pnum">${pi+1}</span><div class="phx"><span class="crumb">${L.crumb?esc(L.crumb):`יומן חוקר.ת · ${L.n>=100?esc(L.kind):'שיעור '+L.n} · ${esc(L.title)}`}</span><h2>${esc(p.title)}</h2></div>${strip(p.step ?? pi)}</header>
  ${p.cover?`<div class="cover"><h1>${esc(L.title)}</h1><p class="name">שם: <span class="blank long"></span></p></div>`:p.name?`<div class="cover"><p class="lead">${rich(p.name)}</p><p class="name">שם: <span class="blank long"></span></p></div>`:''}
  <div class="pbody">${p.blocks.map(b=>block(b)+keyHtml(b)).join('')}</div>
  <footer class="pf"><span>עמוד ${pi+1} מתוך ${NP}</span>${pi===0?`<span class="key">${icon('up')} מסגרת מקווקוות = משימה אתגרית</span>`:''}</footer>
</section>`).join('');

if(mode!=='digital') return;
/* digital extras: read-aloud */
const audio = new Audio(); let cur=null;
document.querySelectorAll('.spk').forEach(btn=>{
  const src = `audio/l${String(L.n).padStart(2,'0')}/${btn.dataset.a}.mp3`;
  fetch(src,{method:'HEAD'}).then(r=>{ if(r.ok){ btn.hidden=false; btn.dataset.src=src; } }).catch(()=>{});
  btn.addEventListener('click',()=>{ if(cur===btn && !audio.paused){ audio.pause(); return; } cur=btn; audio.src=btn.dataset.src; audio.play(); });
});
})();
