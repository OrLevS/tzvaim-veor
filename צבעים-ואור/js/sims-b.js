/* Interactive simulations, part B (lessons 8–14). Depends on sims-a.js helpers. */
(function(){
const S = window.SIMS;
const svgEl = S._svgEl;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- 9. studies (fictional practice data) ---------- */
S.studies = host => {
  const F = S._frame(host,'ארבעה מחקרים — נתונים בדויים לתרגול','לחצו על קלף כדי להפוך אותו לרשימת בדיקה. סדרו לפי כמה אתן.ם סומכות.ים על כל מחקר.');
  const D=[
    {id:'א׳',title:'14 נבדקים, ללא קבוצת השוואה',rows:[['מי נבדק','14 נבדקים','warn'],['קבוצת השוואה','אין','no'],['הקצאה מקרית','אין','no'],['מה עוד השתנה','לא ידוע','warn'],['גודל ההבדל','9 נקודות — אבל לעומת מה?','warn']]},
    {id:'ב׳',title:'240 נבדקים, השוואה והקצאה מקרית',rows:[['מי נבדק','240 נבדקים','ok'],['קבוצת השוואה','יש','ok'],['הקצאה מקרית','יש','ok'],['מה עוד השתנה','מבוקר','ok'],['גודל ההבדל','0.4 נקודות — קטן מאוד','warn']]},
    {id:'ג׳',title:'סקר של 1,100 משיבים',rows:[['מי נבדק','1,100 משיבים','ok'],['קבוצת השוואה','אין — זה סקר','no'],['הקצאה מקרית','אין','no'],['מה עוד השתנה','גורמים רבים אפשריים','warn'],['מה נמצא','מתאם חלש — מתאם אינו סיבתיות','warn']]},
    {id:'ד׳',title:'62 נבדקים, קבוצת השוואה',rows:[['מי נבדק','62 נבדקים','warn'],['קבוצת השוואה','יש','ok'],['הקצאה מקרית','לא צוין','warn'],['מה עוד השתנה','גם התאורה הייתה שונה!','no'],['גודל ההבדל','5 נקודות','warn']]}
  ];
  let order=[0,1,2,3]; const flipped=new Set();
  F.view.innerHTML='<div class="studies"></div>';
  const v=F.view.firstElementChild, ic={ok:'✓',no:'✗',warn:'?'};
  const draw=()=>{v.innerHTML=order.map((i,pos)=>{const d=D[i];const f=flipped.has(i);
    return `<div class="st-card ${f?'flip':''}"><div class="st-rank">${pos+1}</div><button type="button" class="st-face" data-f="${i}" aria-expanded="${f}">
      <b>מחקר ${d.id}</b>${f?`<ul>${d.rows.map(r=>`<li class="${r[2]}"><span>${ic[r[2]]}</span><span><small>${r[0]}</small>${r[1]}</span></li>`).join('')}</ul>`:`<p>${d.title}</p><small class="fake">נתונים בדויים לתרגול</small>`}</button>
      <div class="st-move"><button type="button" data-up="${pos}" aria-label="להזיז למעלה" ${pos?'':'disabled'}>▲</button><button type="button" data-dn="${pos}" aria-label="להזיז למטה" ${pos<3?'':'disabled'}>▼</button></div></div>`;}).join('');};
  v.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.f){const i=+b.dataset.f; flipped.has(i)?flipped.delete(i):flipped.add(i);}
    if(b.dataset.up){const p=+b.dataset.up; [order[p-1],order[p]]=[order[p],order[p-1]];}
    if(b.dataset.dn){const p=+b.dataset.dn; [order[p+1],order[p]]=[order[p],order[p+1]];}
    draw(); F.read.textContent=`הדירוג שלכן.ם: ${order.map(i=>D[i].id).join(' ← ')}. לפי אילו שני קריטריונים דירגתן.ם?`;});
  draw();
  return {destroy(){}};
};

/* ---------- 10. gray squares ---------- */
S.gray = host => {
  const F = S._frame(host,'אותו אפור, הקשר שונה','גררו את הריבוע הימני. שני הריבועים צבועים באותו גוון בדיוק.');
  const G='#8a8580';
  F.view.innerHTML=`<svg viewBox="0 0 640 320" class="sim-svg" style="touch-action:none">
    <rect width="320" height="320" fill="#f3ece0"/><rect x="320" width="320" height="320" fill="#1f343b"/>
    <rect id="bridge" x="155" y="150" width="330" height="22" fill="${G}" opacity="0"/>
    <rect id="a" x="120" y="115" width="90" height="90" fill="${G}"/>
    <rect id="b" x="430" y="115" width="90" height="90" fill="${G}" style="cursor:grab"/>
    <g id="after" opacity="0"><rect width="640" height="320" fill="#fff"/><circle cx="320" cy="160" r="4" fill="#000"/></g>
    <g id="fix" opacity="0"><rect x="220" y="80" width="200" height="160" fill="#2A9D8F"/><rect x="290" y="80" width="60" height="160" fill="#E9C46A"/><circle cx="320" cy="160" r="4" fill="#000"/></g>
    <text id="cd" x="320" y="290" text-anchor="middle" font-size="18" fill="#264653"></text></svg>`;
  const svg=F.view.querySelector('svg'), b=svg.querySelector('#b');
  let drag=false,off=[0,0];
  const pt=e=>{const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse());};
  b.addEventListener('pointerdown',e=>{drag=true; const p=pt(e); off=[p.x-+b.getAttribute('x'),p.y-+b.getAttribute('y')]; b.setPointerCapture(e.pointerId);});
  svg.addEventListener('pointermove',e=>{if(!drag) return; const p=pt(e); const x=clamp(p.x-off[0],0,550), y=clamp(p.y-off[1],0,230); b.setAttribute('x',x); b.setAttribute('y',y);
    F.read.textContent = x+45<320 ? 'עכשיו שני הריבועים על אותו רקע. איך הם נראים?' : 'על רקע כהה הריבוע נראה בהיר יותר. האם הוא השתנה — או ההקשר?';});
  svg.addEventListener('pointerup',()=>drag=false);
  S._btn(F.ctrls,'חיבור הריבועים בפס אפור',()=>{const br=svg.querySelector('#bridge'); const on=br.getAttribute('opacity')==='0'; br.setAttribute('opacity',on?1:0); F.read.textContent=on?'פס אחד, באותו גוון לכל אורכו, מחבר בין הריבועים.':'';});
  S._btn(F.ctrls,'↺ החזרה למקום',()=>{b.setAttribute('x',430);b.setAttribute('y',115);F.read.textContent='';},'ghost');
  let t=null;
  S._btn(F.ctrls,'דמות גרר (רשות)',()=>{ if(t) return;
    const fix=svg.querySelector('#fix'), af=svg.querySelector('#after'), cd=svg.querySelector('#cd'); let n=20; fix.setAttribute('opacity',1);
    F.read.textContent='מי שרוצה: מסתכלות.ים על הנקודה השחורה בלי להזיז את העיניים. מי שלא נוח לה.ו — מתבוננות.ים בחברים ומתעדות.ים דיווחים.';
    t=setInterval(()=>{n--; cd.textContent=n>0?n:''; if(n<=0){clearInterval(t); fix.setAttribute('opacity',0); af.setAttribute('opacity',1); cd.textContent='מה רואים עכשיו על הלבן?';
      setTimeout(()=>{af.setAttribute('opacity',0); cd.textContent=''; t=null;},8000);}},1000);
  },'ghost');
  return {destroy(){ if(t) clearInterval(t); }};
};

/* ---------- 11. color names ---------- */
S.names = host => {
  const F = S._frame(host,'איפה עובר הגבול בין ״ירוק״ ל״כחול״?','המורה מזיזה את הגוון; הכיתה מצביעה; המורה סופרת. הצבעה בכיתה — לא מדידה של חוויה פרטית.');
  const W=['ירוק','טורקיז','כחול'], COL=['#4caf50','#26a69a','#3f6fd8'];
  const H=[100,120,140,160,175,190,205,220,240]; let hi=4; const T={}; H.forEach(h=>T[h]=[0,0,0]);
  F.view.innerHTML=`<div class="names"><div class="nm-sw" aria-hidden="true"></div><div class="nm-tally"></div><svg viewBox="0 0 360 150" class="nm-chart"></svg></div>
   <div class="nm-acc"><h6>גרף שתלוי רק בצבע — איך משפרים?</h6><svg viewBox="0 0 360 180" class="acc-chart"></svg></div>`;
  const sw=F.view.querySelector('.nm-sw'), tally=F.view.querySelector('.nm-tally'), ch=F.view.querySelector('.nm-chart');
  const draw=()=>{const h=H[hi]; sw.style.background=`hsl(${h},60%,45%)`;
    tally.innerHTML=W.map((w,i)=>`<button type="button" data-w="${i}"><span>${w}</span><b>${T[h][i]}</b></button>`).join('')+`<button type="button" class="ghost" data-z>איפוס הגוון</button>`;
    ch.innerHTML=H.map((hh,j)=>{const t=T[hh], s=t[0]+t[1]+t[2]||1; let y=130; return `<rect x="${12+j*38}" y="134" width="30" height="10" fill="hsl(${hh},60%,45%)"/>`+t.map((c,i)=>{const hgt=c/s*110; y-=hgt; return `<rect x="${12+j*38}" y="${y}" width="30" height="${hgt}" fill="${COL[i]}" opacity=".85"/>`}).join('')+(j===hi?`<rect x="${10+j*38}" y="18" width="34" height="128" fill="none" stroke="#264653" stroke-width="2" rx="4"/>`:'');}).join('');
    const t=T[h], s=t[0]+t[1]+t[2]; F.read.textContent = s? `בגוון הזה: ${W.map((w,i)=>w+' '+t[i]).join(' · ')}. איפה יש הכי הרבה אי־הסכמה?` : 'הצביעו: איך הייתן.ם קוראות.ים לגוון הזה?';
  };
  tally.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; const h=H[hi]; if(b.dataset.z!==undefined) T[h]=[0,0,0]; else T[h][+b.dataset.w]++; draw();});
  S._slider(F.ctrls,'גוון',0,H.length-1,hi,1,v=>{hi=v;draw();});
  // accessibility chart
  const acc=F.view.querySelector('.acc-chart'); let gray=false, marks=false;
  const A=[20,35,30,55,60,80], B=[30,28,45,40,62,58];
  const line=(d,c,dash,mk,lab)=>{const pts=d.map((v,i)=>[40+i*58,160-v*1.6]); return `<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="3.5" ${dash?'stroke-dasharray="8 6"':''}/>`+(mk?pts.map(p=>mk==='c'?`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${c}"/>`:`<rect x="${p[0]-5}" y="${p[1]-5}" width="10" height="10" fill="${c}"/>`).join(''):'')+(lab?`<text x="${pts[5][0]+8}" y="${pts[5][1]+4}" font-size="13" fill="#264653" direction="rtl" text-anchor="end">${lab}</text>`:'');};
  const drawAcc=()=>{acc.innerHTML=`<line x1="30" y1="165" x2="340" y2="165" stroke="#264653"/>`+line(A,'#d9534f',false,marks&&'c',marks&&'קבוצה א')+line(B,'#4caf50',marks,marks&&'s',marks&&'קבוצה ב')+(marks?'':`<g font-size="12" fill="#264653"><rect x="330" y="8" width="10" height="10" fill="#d9534f"/><text x="324" y="17" text-anchor="end">קבוצה א</text><rect x="250" y="8" width="10" height="10" fill="#4caf50"/><text x="244" y="17" text-anchor="end">קבוצה ב</text></g>`);
    acc.style.filter=gray?'grayscale(1)':'';};
  S._seg(F.ctrls,'הגרף',[['c','בצבע'],['g','גווני אפור']],'c',k=>{gray=k==='g';drawAcc();});
  S._seg(F.ctrls,'שיפור',[['0','רק צבע'],['1','תוויות, קווים וסמנים']],'0',k=>{marks=k==='1';drawAcc();});
  draw(); drawAcc();
  return {destroy(){}};
};

/* ---------- 12. spectrum ---------- */
S.spectrum = host => {
  const F = S._frame(host,'אור שנפלט: רמות אנרגיה וקווי ספקטרום','מודל מפושט של אטום מימן: האלקטרון מתחיל ברמה 2. לחצו על רמה גבוהה יותר כדי לעורר אותו.');
  const wl2=l=>{let h; if(l<440)h=270-(l-400)*.5; else if(l<490)h=240-(l-440)*1.2; else if(l<510)h=180-(l-490)*2; else if(l<580)h=140-(l-510)*1.4; else if(l<645)h=42-(l-580)*.6; else h=0; return `hsl(${Math.max(0,h)},90%,55%)`;};
  const BAL={3:656,4:486,5:434,6:410};
  const REF={H:['מימן',[410,434,486,656]],He:['הליום',[447,471,492,502,588,668]],Na:['נתרן',[589]],Hg:['כספית',[405,436,546,577,579]]};
  const CASES={a:['דגימה א',[410,434,486,656]],b:['דגימה ב',[410,434,486,589,656]],c:['דגימה ג',[447,471,502,588,620,668]]};
  const Y=n=>40+ (1-(1/4-1/(n*n))/(1/4-1/36))*0; // placeholder
  const lvY=n=>250-((1/4-1/(n*n))/(1/4-1/36))*200;
  const X=l=>300+(l-400)*1.0;
  let emitted=new Set(), cs='a', refs=new Set(['H']);
  F.view.innerHTML=`<svg viewBox="0 0 640 330" class="sim-svg"><rect width="640" height="330" fill="#fffdf8"/>
    ${[2,3,4,5,6].map(n=>`<g class="lv" data-n="${n}" style="cursor:${n>2?'pointer':'default'}"><rect x="20" y="${lvY(n)-9}" width="220" height="18" fill="transparent"/><line x1="30" x2="230" y1="${lvY(n)}" y2="${lvY(n)}" stroke="#264653" stroke-width="${n===2?4:2.5}"/><text x="236" y="${lvY(n)+5}" font-size="12" fill="#5d5148">n=${n}</text></g>`).join('')}
    <circle id="e" cx="130" cy="${lvY(2)}" r="9" fill="#E76F51"/>
    <path id="ph" d="" fill="none" stroke-width="3"/>
    <text x="130" y="290" text-anchor="middle" font-size="13" fill="#264653" direction="rtl">רמות אנרגיה (לחצו על רמה)</text>
    <rect x="300" y="40" width="300" height="40" rx="6" fill="#111"/><g id="em"></g>
    <text x="620" y="34" text-anchor="start" font-size="13" fill="#264653" direction="rtl">מה פלטנו</text>
    <text x="620" y="124" text-anchor="start" font-size="13" fill="#264653" direction="rtl" id="cname"></text>
    <rect x="300" y="130" width="300" height="40" rx="6" fill="#111"/><g id="un"></g><g id="rf"></g>
    ${[400,500,600,700].map(l=>`<line x1="${X(l)}" x2="${X(l)}" y1="176" y2="182" stroke="#264653"/><text x="${X(l)}" y="196" text-anchor="middle" font-size="11" fill="#5d5148">${l}</text>`).join('')}
    <text x="450" y="212" text-anchor="middle" font-size="12" fill="#5d5148" direction="rtl">אורך גל (ננומטר)</text>
    <g id="leg"></g></svg>`;
  const q=s=>F.view.querySelector(s);
  const drawEm=()=>{q('#em').innerHTML=[...emitted].map(l=>`<rect x="${X(l)-2}" y="40" width="4" height="40" fill="${wl2(l)}"/>`).join('');};
  const drawCase=()=>{const [nm,ls]=CASES[cs]; q('#cname').textContent=nm+' — ״לא ידוע״';
    q('#un').innerHTML=ls.map(l=>`<rect x="${X(l)-2}" y="130" width="4" height="40" fill="${wl2(l)}"/>`).join('');
    const marks=['#E9C46A','#2A9D8F','#E76F51','#9b5de5']; let h='',lg='';
    [...refs].forEach((r)=>{const i=Object.keys(REF).indexOf(r); REF[r][1].forEach(l=>h+=`<path d="M${X(l)} ${222+i*14}L${X(l)-5} ${232+i*14}H${X(l)+5}Z" fill="${marks[i]}"/>`);
      lg+=`<text x="620" y="${232+i*14}" text-anchor="start" font-size="11" fill="#264653" direction="rtl">${REF[r][0]}</text>`;
      h+=`<line x1="300" x2="600" y1="${236+i*14}" y2="${236+i*14}" stroke="${marks[i]}" stroke-width="1" opacity=".4"/>`;});
    q('#rf').innerHTML=h; q('#leg').innerHTML=lg;
    const match=r=>REF[r][1].filter(l=>ls.some(x=>Math.abs(x-l)<3)).length+'/'+REF[r][1].length;
    F.read.textContent=[...refs].map(r=>`${REF[r][0]}: ${match(r)} מהקווים נמצאים בדגימה`).join(' · ')+'. האם יש קווים בדגימה שאף ייחוס לא מסביר?';
  };
  let busy=false;
  q('svg').addEventListener('click',e=>{const g=e.target.closest('.lv'); if(!g||busy) return; const n=+g.dataset.n; if(n<3) return; busy=true;
    const el=q('#e'); el.setAttribute('cy',lvY(n));
    setTimeout(()=>{ el.setAttribute('cy',lvY(2)); const l=BAL[n]; const ph=q('#ph'); ph.setAttribute('stroke',wl2(l));
      let d='M140 '+lvY(2); for(let x=0;x<130;x+=10) d+=` q5 -8 10 0`; ph.setAttribute('d',d); ph.style.opacity=1;
      emitted.add(l); drawEm(); F.read.textContent=`ירידה מרמה ${n} לרמה 2 → פוטון באורך גל ${l} ננומטר. הפרש אנרגיה גדול יותר = אורך גל קצר יותר.`;
      setTimeout(()=>{ph.style.opacity=0; busy=false;},900);},700);
  });
  S._seg(F.ctrls,'דגימה',Object.entries(CASES).map(([k,v])=>[k,v[0]]),cs,k=>{cs=k;drawCase();});
  const w=document.createElement('div'); w.className='ctl'; w.innerHTML='<span>ספקטרומי ייחוס</span><div class="segs">'+Object.entries(REF).map(([k,v])=>`<button type="button" data-r="${k}" aria-pressed="${refs.has(k)}">${v[0]}</button>`).join('')+'</div>';
  w.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; const r=b.dataset.r; refs.has(r)?refs.delete(r):refs.add(r); b.setAttribute('aria-pressed',refs.has(r)); drawCase();});
  F.ctrls.appendChild(w);
  S._btn(F.ctrls,'↺ ניקוי מה שפלטנו',()=>{emitted.clear();drawEm();},'ghost');
  drawCase();
  return {destroy(){}};
};

/* ---------- 13. street lamp ---------- */
S.lamp = host => {
  const F = S._frame(host,'פנס רחוב: מה משתנה כשמשנים?','מודל מפושט לתרגול — המדדים איכותיים, לא מדידות אמיתיות.');
  let shield=false, I=70, cool=false, hours='all';
  F.view.innerHTML=`<div class="lampv"><svg viewBox="0 0 400 300" class="sim-svg"><defs><radialGradient id="lg"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="300" fill="#13232a"/><rect id="haze" width="400" height="200" fill="#c9a86a" opacity="0"/><g id="stars"></g>
    <circle id="glow" cx="200" cy="110" r="150" fill="url(#lg)"/>
    <polygon id="cone" points="190,112 210,112 290,262 110,262" fill="#fff3c4"/>
    <rect y="262" width="400" height="38" fill="#3a332c"/><rect x="196" y="110" width="8" height="152" fill="#b9ab96"/>
    <path id="sh" d="M176 112H224L214 98H186Z" fill="#b9ab96"/><circle id="bulb" cx="200" cy="114" r="7"/>
    <g transform="translate(250,232)"><circle r="6" fill="#F4A261"/><path d="M0 6V22M0 10L-7 17M0 10L7 17M0 22L-6 32M0 22L6 32" stroke="#F4A261" stroke-width="3" stroke-linecap="round"/></g></svg>
    <div class="meters"></div></div>`;
  const q=s=>F.view.querySelector(s);
  const stars=[...Array(40)].map((_,i)=>[(i*97)%400,(i*53)%180+6]);
  const draw=()=>{const i=I/100, col=cool?'#e8f1ff':'#ffe2a8';
    const hf={all:1,mid:.55,sensor:.35}[hours];
    const ground=i*(shield?.9:.6), glare=i*(shield?.2:.85), up=i*(shield?.06:.55)*(cool?1.35:1), energy=i*hf;
    q('#glow').setAttribute('opacity',(shield?.12:.75)*i); q('#cone').setAttribute('opacity',.08+.3*ground); q('#cone').setAttribute('fill',col);
    q('#bulb').setAttribute('fill',col); q('#sh').style.display=shield?'':'none'; q('#haze').setAttribute('opacity',(up*.35).toFixed(2));
    const vis=Math.round(stars.length*(1-Math.min(1,up*1.6)));
    q('#stars').innerHTML=stars.map((s,k)=>`<circle cx="${s[0]}" cy="${s[1]}" r="1.4" fill="#fff" opacity="${k<vis?.9:.08}"/>`).join('');
    const M=[['תאורה על המדרכה',ground,'#2A9D8F'],['סנוור',glare,'#E76F51'],['אור שבורח לשמיים (זוהר שמיים)',Math.min(1,up),'#9b7fd1'],['צריכת חשמל',energy,'#E9C46A']];
    q('.meters').innerHTML=M.map(([n,v,c])=>`<div class="meter"><span>${n}</span><div><i style="width:${Math.round(v*100)}%;background:${c}"></i></div></div>`).join('');
    F.read.textContent=`איזה מדד חשוב למי? הולך.ת רגל, תושב.ת, עירייה, בעלי חיים — לכל אחד מדד הצלחה אחר.`;
  };
  S._seg(F.ctrls,'כיוון',[['0','לכל הכיוונים'],['1','מכוון למטה']],'0',k=>{shield=k==='1';draw();});
  S._slider(F.ctrls,'עוצמה',10,100,I,1,v=>{I=v;draw();});
  S._seg(F.ctrls,'גוון',[['w','חם'],['c','קר (כחלחל)']],'w',k=>{cool=k==='c';draw();});
  S._seg(F.ctrls,'שעות',[['all','כל הלילה'],['mid','עד חצות'],['sensor','חיישן תנועה']],'all',k=>{hours=k;draw();});
  draw();
  return {destroy(){}};
};

/* ---------- 14. chromatography ---------- */
S.chroma = host => {
  const F = S._frame(host,'כרומטוגרפיה על נייר','טושים א׳ ו־ב׳ מסיסים במים; טוש ג׳ אינו מסיס במים. החליטו על השיטה — ואז הפעילו.');
  const M={a:['טוש א׳',[['#2d6fd6',.82],['#c2368f',.56],['#e8b81a',.93],['#3a3a3a',.2]]],b:['טוש ב׳',[['#3a3a8a',.35],['#c0392b',.62]]],c:['טוש ג׳ (לא מסיס במים)',[['#222',0]]]};
  let m='a', pen=false, low=false, t=0, run=false, picked=null;
  F.view.innerHTML=`<svg viewBox="0 0 640 320" class="sim-svg"><rect width="640" height="320" fill="#fbf5ed"/>
    <rect x="250" y="120" width="140" height="190" rx="8" fill="#fff" fill-opacity=".5" stroke="#264653" stroke-width="3"/>
    <rect x="253" y="262" width="134" height="45" fill="#2A9D8F" opacity=".28"/>
    <rect x="290" y="20" width="60" height="285" fill="#fff" stroke="#E6D3B9" stroke-width="2"/>
    <rect id="wet" x="291" width="58" fill="#2A9D8F" opacity=".15"/>
    <line id="start" x1="294" x2="346" y1="245" y2="245" stroke-dasharray="4 3" stroke-width="2"/>
    <g id="spots"></g><line id="front" x1="291" x2="349" stroke="#2A9D8F" stroke-width="2" stroke-dasharray="3 3"/>
    <g id="ruler"></g><text id="lbl" x="420" y="60" font-size="14" fill="#264653" direction="rtl" text-anchor="end"></text></svg>`;
  const q=s=>F.view.querySelector(s);
  const startY=()=>low?275:245, WATER=262, TOP=35;
  const frontY=()=>WATER-(WATER-TOP)*Math.min(1,t);
  const draw=()=>{const fy=frontY(), sy=startY(), dist=sy-fy;
    q('#wet').setAttribute('y',fy); q('#wet').setAttribute('height',Math.max(0,304-fy));
    q('#front').setAttribute('y1',fy); q('#front').setAttribute('y2',fy); q('#front').style.display=t>0?'':'none';
    q('#start').setAttribute('y1',sy); q('#start').setAttribute('y2',sy); q('#start').setAttribute('stroke',pen?'#3b5bb5':'#777');
    let h='';
    if(low && t>0){ h+=`<rect x="253" y="262" width="134" height="45" fill="#333" opacity="${Math.min(.35,t*.6)}"/>`; }
    else {
      M[m][1].forEach(([c,rf],i)=>{const moved = t>0 && rf>0; const y=moved? sy-dist*rf : sy; const op = moved? Math.min(.9,.2+t) : 1;
        h+=`<ellipse class="spot" data-i="${i}" cx="320" cy="${y}" rx="${moved?12+i:8}" ry="${moved?7:8}" fill="${c}" opacity="${t>0&&!moved&&m!=='c'?0:op}" style="cursor:pointer"/>`;});
      if(t===0||m==='c') h+=`<circle cx="320" cy="${sy}" r="8" fill="#222"/>`;
      if(pen&&t>0) h+=`<rect x="294" y="${sy-dist*.7}" width="52" height="${dist*.7}" fill="#3b5bb5" opacity=".18"/>`;
    }
    q('#spots').innerHTML=h;
    q('#lbl').textContent = low&&t>0 ? 'הכתם היה מתחת למים: הדיו התמוסס לתוך המים במקום לעלות בנייר.' : '';
    if(picked!==null && t>=1 && !low){const rf=M[m][1][picked][1]; const sd=(dist*rf), y=sy-sd;
      q('#ruler').innerHTML=`<line x1="370" x2="370" y1="${sy}" y2="${y}" stroke="#E76F51" stroke-width="3"/><line x1="395" x2="395" y1="${sy}" y2="${fy}" stroke="#2A9D8F" stroke-width="3"/>`;
      F.read.textContent=`מרחק הכתם ${Math.round(sd/4)} מ״מ ÷ מרחק חזית הממס ${Math.round(dist/4)} מ״מ = Rf ≈ ${rf.toFixed(2)} (משווים רק בתנאים זהים).`;
    } else q('#ruler').innerHTML='';
  };
  let stop=null;
  q('svg').addEventListener('click',e=>{const s=e.target.closest('.spot'); if(!s||t<1) return; picked=+s.dataset.i; draw();});
  S._seg(F.ctrls,'טוש',Object.entries(M).map(([k,v])=>[k,v[0]]),m,k=>{m=k;reset();});
  S._seg(F.ctrls,'קו התחלה',[['p','עיפרון'],['n','עט']],'p',k=>{pen=k==='n';reset();});
  S._seg(F.ctrls,'מיקום הכתם',[['h','מעל פני המים'],['l','מתחת לפני המים']],'h',k=>{low=k==='l';reset();});
  const go=S._btn(F.ctrls,'▶ הפעלה',()=>{ if(run) return; if(t>=1) t=0; run=true; picked=null;
    stop=S._loop(dt=>{t=Math.min(1,t+dt/7000); draw(); if(t>=1){run=false; stop(); F.read.textContent=low?'מה השתבש בשיטה?':m==='c'?'שום דבר לא זז. האם זה אומר שבדיו יש חומר אחד בלבד?':'לחצו על כתם כדי לחשב Rf. כמה כתמים יש — והאם זה בהכרח מספר החומרים?';}});
  });
  function reset(){ if(stop) stop(); run=false; t=0; picked=null; F.read.textContent=''; draw(); }
  draw();
  return {destroy(){ if(stop) stop(); }};
};

/* ---------- 15. four-link model ---------- */
S.model = host => {
  const F = S._frame(host,'מודל ארבע החוליות','לחצו על חוליה כדי לנתק אותה — מה קורה לצבע שאנחנו רואות.ים?');
  const N=[['src','מקור אור','#E9C46A','בלי מקור אור אין אור שיגיע לחומר — בחושך מוחלט לא רואים צבע.'],['mat','חומר','#E76F51','החומר קובע אילו חלקים של האור מוחזרים, נבלעים או עוברים (שיעור 3).'],['eye','עין','#2A9D8F','בלי קליטה ברשתית אין מידע שעובר הלאה. שלושה סוגי מדוכים מגיבים בדפוס (שיעור 7).'],['brain','מוח','#F4A261','המוח מעבד ומשווה הקשר — אותו אור יכול להיראות אחרת (שיעור 9).']];
  const off=new Set(); let mat=0; const MATS=[['דף אדום','#e2483a'],['דף כחול','#3b6fe0'],['דף לבן','#f7f3ea']];
  F.view.innerHTML='<div class="model4"></div>';
  const v=F.view.firstElementChild;
  const draw=()=>{const broken=N.findIndex(n=>off.has(n[0]));
    v.innerHTML=N.map((n,i)=>`<button type="button" class="m-node ${off.has(n[0])?'off':''} ${broken>-1&&i>broken?'dim':''}" data-k="${n[0]}" style="--c:${n[2]}" aria-pressed="${!off.has(n[0])}"><b>${n[1]}</b>${n[0]==='mat'?`<small>${MATS[mat][0]}</small>`:''}</button>${i<3?`<span class="m-link ${broken>-1&&i>=broken?'cut':''}" aria-hidden="true"><i></i></span>`:''}`).join('')+
      `<div class="m-out"><span class="m-sw" style="background:${broken>-1?'#1d1d1d':MATS[mat][1]}"></span><span>${broken>-1?'אין תפיסת צבע':'נתפס: '+MATS[mat][0].replace('דף ','')}</span></div>`;
  };
  v.addEventListener('click',e=>{const b=e.target.closest('.m-node'); if(!b) return; const k=b.dataset.k; off.has(k)?off.delete(k):off.add(k); draw(); const n=N.find(x=>x[0]===k); F.read.textContent=(off.has(k)?'נותק: ':'חובר: ')+n[1]+'. '+n[3];});
  S._btn(F.ctrls,'החלפת חומר',()=>{mat=(mat+1)%3;draw();},'ghost');
  S._btn(F.ctrls,'↺ חיבור הכול',()=>{off.clear();draw();F.read.textContent='';},'ghost');
  draw();
  return {destroy(){}};
};
})();
