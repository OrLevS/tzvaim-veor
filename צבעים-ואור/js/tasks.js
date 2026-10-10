/* Journal tasks → presentation screens (no printing needed).
   Every task from the journal data becomes an activity screen:
   ✏️ במחברת — students write in their notebooks (frames/blanks shown on screen)
   🗳 מצביעים — the class votes and the teacher clicks the counters (like the guess vote).
   Reading material (texts, evidence cards, diagrams) is shown on screen. */
window.TASKS = (function(){
const esc = s => String(s ?? '').replace(/[<>&]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
/* the journal was written for paper — adapt the wording for notebooks */
const scr = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')
  .replace(/פסקה בגב הדף/g,'פסקה במחברת').replace(/בגב הדף/g,'במחברת')
  .replace(/חזרו לניחוש ולמשפט בעמוד 1/g,'חזרו לניחוש ולמשפט מתחילת השיעור').replace(/חזרו לעמוד 1/g,'חזרו לניחוש מתחילת השיעור')
  .replace(/\(השוו לעמוד 1\)/g,'(השוו להתחלה)').replace(/ביומן/g,'במחברת')
  .replace(/_{3,}/g,'<span class="tblank"></span>');
const TASK = {choice:1,q:1,table:1,fields:1,marks:1,classify:1,chain:1,answer3:1,draw:1};
const CONTENT = {texts:1, box:1, diagram:1, route:1};
const NOTEBOOK = '<span class="mchip nb">✏️ במחברת</span>';
const VOTE = '<span class="mchip vote">🗳 מצביעים</span>';
const lines = arr => [].concat(arr||[]).map(x=>`<p class="tinst">${scr(x)}</p>`).join('');
const votes = opts => `<div class="g-opts tv">${opts.map((o,k)=>`<button type="button" class="g-opt" data-k="${k}"><span>${scr(typeof o==='string'?o:o.t)}</span><b>0</b></button>`).join('')}<button type="button" class="g-clear" title="איפוס הספירה">↺</button></div>`;
const conf = kind => `<div class="tconf"><p class="tsub">${kind==='again'?'כמה אני בטוח.ה עכשיו?':'כמה אני בטוח.ה?'}</p>${votes(['בכלל לא','קצת','די בטוח.ה','מאוד'])}</div>`;
const nbLine = label => label ? `<p class="tnb">✏️ במחברת: ${scr(label)} <span class="tblank"></span></p>` : '';

const SKY = () => `<figure class="tdg"><figcaption><span class="tmk">1</span> מסלול אור השמש באוויר</figcaption>
  <svg viewBox="0 0 520 205" role="img" aria-label="אור שמש נכנס לאוויר. אור כחול מתפזר ממולקולה לכל הכיוונים, וחלק מגיע לעין. אור אדום ממשיך כמעט ישר.">
   <path d="M0 50 H520" fill="none" stroke="#264653" stroke-width="1.3" stroke-dasharray="6 5"/><text x="60" y="42" font-size="16" text-anchor="middle" fill="#264653" font-family="Rubik">גבול האוויר</text>
   <circle cx="470" cy="22" r="16" fill="#E9C46A"/>
   <path d="M455 36 L270 108" stroke="#4A8FD6" stroke-width="3" stroke-dasharray="7 5" fill="none"/><path d="M455 36 L120 175" stroke="#E76F51" stroke-width="3.4" fill="none"/>
   <circle cx="265" cy="110" r="7" fill="#264653"/>
   <path d="M262 114 L110 168" stroke="#4A8FD6" stroke-width="4.5" stroke-dasharray="7 5" fill="none"/><path d="M270 104 L330 58 M258 104 L170 70 M272 114 L360 160" stroke="#4A8FD6" stroke-width="3" stroke-dasharray="7 5" fill="none"/>
   <g transform="translate(95,175)"><path d="M-18 0Q0-12 18 0Q0 12-18 0Z" fill="#fff" stroke="#264653" stroke-width="2.2"/><circle r="4.5" fill="#264653"/></g><text x="95" y="200" font-size="15" text-anchor="middle" fill="#264653" font-family="Rubik">עין</text>
   <path d="M0 194 Q130 184 260 194 T520 194" fill="none" stroke="#264653" stroke-width="2"/>
   <g font-family="Rubik" font-size="14" font-weight="700" text-anchor="middle" fill="#264653">
    <circle cx="370" cy="66" r="11" fill="#fff" stroke="#264653" stroke-width="2"/><text x="370" y="71">א</text>
    <circle cx="290" cy="128" r="11" fill="#fff" stroke="#264653" stroke-width="2"/><text x="290" y="133">ב</text>
    <circle cx="150" cy="140" r="13" fill="#E9C46A" stroke="#264653" stroke-width="3"/><text x="150" y="145">ג</text>
    <circle cx="200" cy="165" r="11" fill="#fff" stroke="#264653" stroke-width="2"/><text x="200" y="170">ד</text></g>
  </svg>
  <div class="tlegend"><span class="tmk">2</span><span><i class="tl sw"></i> מקווקו = אור כחול (קצר־גל)</span><span><i class="tl lw"></i> רציף = אור אדום (ארוך־גל)</span></div></figure>`;

/* content blocks (reading) → body html */
function content(b){
  switch(b.type){
    case 'texts': return `<div class="ttexts">${b.items.map(t=>`<div class="ttext"><p class="ttt">${esc(t.title)}</p>${t.list?`<ul>${t.list.map(x=>`<li>${scr(x)}</li>`).join('')}</ul>`:`<p>${scr(t.text)}</p>`}</div>`).join('')}</div>`;
    case 'box': return `<div class="tcard"><p class="ttt">${esc(b.title)}</p><p>${scr(b.text)}</p></div>`;
    case 'route': return `<div class="troute"><b>${esc(b.title)}</b>${b.steps.map((x,i)=>`<span><i class="tmk">${i+1}</i>${esc(x)}</span>`).join('<span class="tarr">←</span>')}</div>`;
    case 'diagram': return b.name==='sky' ? SKY() : ((window.JOURNAL_DIAGRAMS||{})[b.name] ? window.JOURNAL_DIAGRAMS[b.name]() : '');
  }
  return '';
}
/* task blocks → {mode:'nb'|'vote', body} */
function task(b){
  const head = lines(b.sq||b.q);
  switch(b.type){
    case 'choice': return {mode:'vote', body: head + votes(b.other ? b.options.concat(['אחר']) : b.options) + nbLine(b.linesLabel) + (b.confidence?conf(b.confidence):'')};
    case 'classify': { const SV = b.solved || (b.example!=null ? {0:b.example} : {});
      return {mode:'vote', body: head + `<div class="tkinds">${b.kinds.map(k=>`<span><b>${esc(k.t)}</b>${k.d?` = ${esc(k.d)}`:''}</span>`).join('')}</div>
      <ul class="trows">${b.items.map((x,i)=>`<li${SV[i]!=null?' class="ex"':''}><span class="ttx">${scr(x)}</span>${SV[i]!=null?`<span class="tsolved">${esc(b.kinds[SV[i]].t)} · פתור</span>`:votes(b.kinds.map(k=>k.t))}</li>`).join('')}</ul>` + nbLine(b.linesLabel)}; }
    case 'marks': return {mode:'vote', body: head + `<ol class="trows">${b.items.map(x=>`<li><span class="ttx">${scr(x)}</span>${votes(['✓ מסכים.ה','? לא בטוח.ה','✗ לא נכון'])}</li>`).join('')}</ol>` + nbLine(b.linesLabel)};
    case 'q': return {mode:'nb', body: head + (b.steps?`<ul class="tlist">${b.steps.map(x=>`<li>${scr(x)}</li>`).join('')}</ul>`:'') + (b.linesLabel?`<p class="tsub">${scr(b.linesLabel)}</p>`:'')};
    case 'fields': return {mode:'nb', body: head + `<div class="tfields">${b.fields.map(f=>`<p>${scr(f)} <span class="tblank"></span></p>`).join('')}</div>`};
    case 'table': return {mode:'nb', body: head + `<div class="tfields">${b.rows.map(r=>`<p>${scr(typeof r==='string'?r:r.t)}: <span class="tblank"></span></p>`).join('')}</div>`};
    case 'answer3': return {mode:'nb', body: head + `<p class="tsub">בחרו דרך אחת:</p><div class="tways"><div><p class="ttt">עם עזרה</p>${b.frame.map(f=>`<p>${scr(f)}</p>`).join('')}</div><div><p class="ttt">בעצמי</p><p>במילים שלי — או בציור עם 3 תוויות.</p></div></div>`};
    case 'chain': return {mode:'nb', body: head + `<div class="tchain">${b.boxes.map(x=>`<span>${x?esc(x):''}</span>`).join('<i>←</i>')}</div>`};
    case 'draw': return {mode:'nb', body: head};
  }
  return null;
}
return {TASK, CONTENT, content, task, NOTEBOOK, VOTE};
})();
