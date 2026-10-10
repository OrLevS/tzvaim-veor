/* מספור משותף ליומן: עמוד ומספר משימה לכל בלוק. משמש את ההדפסה, הדיגיטל והמצגת. */
window.JOURNAL_INDEX = function(L){
  const TASK = {choice:1, q:1, table:1, fields:1, marks:1, classify:1, chain:1, answer3:1, draw:1, pairs:1, ways:1};
  const map = {}; let t = 0;
  L.pages.forEach((p,pi)=>p.blocks.forEach(b=>{
    const n = TASK[b.type] ? 1 : 0;
    const tasks = []; for(let i=0;i<n;i++) tasks.push(++t);
    map[b.id] = {page: pi+1, tasks, block: b, pageTitle: p.title};
  }));
  map._total = t; return map;
};
/* טקסט של רמז למצגת: "עמוד 2 · משימה 4" */
window.JOURNAL_CUE_LABEL = function(L, idx, c){
  const a = idx[c.block]; if(!a) return null;
  const z = c.until ? idx[c.until] : null;
  const first = a.tasks.length ? (c.task!=null ? a.tasks[c.task] : a.tasks[0]) : null;
  let tFirst = first, tLast = first, pFirst = a.page, pLast = z ? z.page : a.page;
  if(z){ const zl = z.tasks.length ? z.tasks[z.tasks.length-1] : null; tLast = zl || tLast;
    if(tFirst==null){ for(const k in idx){ const v=idx[k]; if(v && v.page>=a.page && v.tasks && v.tasks.length){ tFirst=v.tasks[0]; break; } } } }
  const pages = pFirst===pLast ? `עמוד ${pFirst}` : `עמודים ${pFirst}–${pLast}`;
  const tasks = tFirst==null ? '' : (tFirst===tLast ? ` · משימה ${tFirst}` : ` · משימות ${tFirst}–${tLast}`);
  return {pages, tasks, text: pages + tasks, do: c.do};
};
