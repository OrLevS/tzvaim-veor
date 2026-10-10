/* Interactive simulations, part D — color-matching game (lesson 5–6).
   Three rounds: build the target shade from R, G, B sliders (0–255), press "בדיקה", get a % match. */
(function(){
const S = window.SIMS;
const TARGETS = [
  {name:'צהוב לימון', c:[255,220,0]},
  {name:'טורקיז', c:[42,157,143]},
  {name:'כתום שקיעה', c:[231,111,81]}
];
const CH = [['אדום','R','#d8402a'],['ירוק','G','#2A9D8F'],['כחול','B','#2f5fd0']];
const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
/* how close: 100% = identical. distance in RGB space, scaled so that being ~40 off on every channel ≈ 75% */
const score = (a,b) => { const d = Math.sqrt(a.reduce((s,v,i)=>s+(v-b[i])**2,0)/3); return Math.max(0, Math.round(100*(1-d/160))); };

S.match = host => {
  const F = S._frame(host,'משחק: מייצרים גוון מדויק','כל גוון במסך בנוי משלושה מספרים: כמה אור אדום, ירוק וכחול (0–255). הזיזו את הסליידרים, ואז ״בדיקה״.');
  let round = 0, mine = [128,128,128], checked = false;
  const results = [];
  F.view.innerHTML = `<div class="mt">
    <p class="mt-round" aria-live="polite"></p>
    <div class="mt-sw">
      <figure><div class="mt-box" data-k="target"></div><figcaption>הגוון המבוקש</figcaption></figure>
      <figure><div class="mt-box" data-k="mine"></div><figcaption>הגוון שלי</figcaption></figure>
    </div>
    <div class="mt-sliders">${CH.map(([he,en,col],i)=>`<label class="mt-sl"><span class="mt-lab" style="--c:${col}">${he} <small>${en}</small></span><input type="range" min="0" max="255" step="1" value="128" data-i="${i}" style="--c:${col}" aria-label="${he}"><output>128</output></label>`).join('')}</div>
    <div class="mt-act"><button type="button" class="sim-btn mt-check">בדיקה</button><button type="button" class="sim-btn mt-next" hidden>לגוון הבא ←</button></div>
    <div class="mt-res" aria-live="polite"></div>
  </div>`;
  const q = s => F.view.querySelector(s), qa = s => [...F.view.querySelectorAll(s)];
  const inputs = qa('input[type=range]');
  const paint = () => {
    const T = TARGETS[round];
    q('.mt-round').textContent = round < TARGETS.length ? `גוון ${round+1} מתוך ${TARGETS.length}: ${T.name}` : 'סיכום';
    if(T) q('[data-k=target]').style.background = rgb(T.c);
    q('[data-k=mine]').style.background = rgb(mine);
    inputs.forEach((inp,i)=>{ inp.value = mine[i]; inp.nextElementSibling.textContent = mine[i]; inp.disabled = checked; });
    F.read.textContent = `הגוון שלי: אדום ${mine[0]} · ירוק ${mine[1]} · כחול ${mine[2]}`;
  };
  inputs.forEach((inp,i)=>inp.addEventListener('input',()=>{ mine[i] = +inp.value; paint(); }));
  q('.mt-check').addEventListener('click',()=>{
    if(checked || round >= TARGETS.length) return;
    const T = TARGETS[round], p = score(mine, T.c);
    checked = true; results.push(p);
    const diffs = T.c.map((v,i)=>mine[i]-v), far = diffs.map(Math.abs).indexOf(Math.max(...diffs.map(Math.abs)));
    const tip = Math.abs(diffs[far]) < 12 ? 'כמעט מושלם בכל שלושת הצבעים!' : `הכי רחוק: ${CH[far][0]} — ${diffs[far]>0?'יותר מדי':'חסר'} (${Math.abs(diffs[far])}).`;
    q('.mt-res').innerHTML = `<p class="mt-pct"><b>${p}%</b> התאמה</p><p>המספרים של הגוון המבוקש: אדום ${T.c[0]} · ירוק ${T.c[1]} · כחול ${T.c[2]}</p><p>${tip}</p>`;
    q('.mt-check').hidden = true;
    const nx = q('.mt-next'); nx.hidden = false; nx.textContent = round < TARGETS.length-1 ? 'לגוון הבא ←' : 'לסיכום ←';
    paint();
  });
  q('.mt-next').addEventListener('click',()=>{
    round++; checked = false; mine = [128,128,128];
    q('.mt-next').hidden = true;
    if(round >= TARGETS.length){
      q('.mt-sw').hidden = true; q('.mt-sliders').hidden = true;
      const avg = Math.round(results.reduce((a,b)=>a+b,0)/results.length);
      q('.mt-res').innerHTML = `<p class="mt-pct"><b>${avg}%</b> בממוצע</p><ul class="mt-sum">${TARGETS.map((t,i)=>`<li><i style="background:${rgb(t.c)}"></i>${t.name}: ${results[i]}%</li>`).join('')}</ul><p>מה למדנו? כל גוון במסך = שלושה מספרים של אור. יותר אור = בהיר יותר.</p>`;
      const again = q('.mt-check'); again.hidden = false; again.textContent = 'משחק חדש';
      again.onclick = () => { round = 0; results.length = 0; checked = false; mine = [128,128,128]; q('.mt-sw').hidden = false; q('.mt-sliders').hidden = false; q('.mt-res').innerHTML = ''; again.textContent = 'בדיקה'; again.onclick = null; paint(); };
    } else { q('.mt-check').hidden = false; q('.mt-res').innerHTML = ''; }
    paint();
  });
  paint();
  return { destroy(){ host.innerHTML = ''; } };
};
})();
