/* Interactive simulations, part A (lessons 1–7).
   Each sim: SIMS[id](host) builds itself inside host and returns {destroy}. */
window.SIMS = window.SIMS || {};
(function(){
const S = window.SIMS;
const motion = () => window.APP_MOTION !== false;
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const mix = (a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb = c=>`rgb(${c[0]},${c[1]},${c[2]})`;

/* shared UI helpers */
S._frame = (host, title, note) => {
  host.innerHTML = `<div class="sim"><div class="sim-head"><span class="sim-badge">הדמיה</span><b>${title}</b></div><div class="sim-view"></div><div class="sim-ctrls"></div><p class="sim-read" aria-live="polite"></p>${note?`<p class="sim-note">${note}</p>`:''}</div>`;
  const r = host.firstElementChild;
  return {root:r, view:r.querySelector('.sim-view'), ctrls:r.querySelector('.sim-ctrls'), read:r.querySelector('.sim-read')};
};
S._slider = (ctrls, label, min, max, val, step, on) => {
  const id = 's'+Math.random().toString(36).slice(2,8);
  const w = document.createElement('label'); w.className='ctl'; w.htmlFor=id;
  w.innerHTML = `<span>${label}</span><input id="${id}" type="range" min="${min}" max="${max}" step="${step||1}" value="${val}">`;
  ctrls.appendChild(w);
  const inp = w.querySelector('input'); inp.addEventListener('input',()=>on(+inp.value)); return inp;
};
S._seg = (ctrls, label, opts, val, on) => {
  const w = document.createElement('div'); w.className='ctl'; w.setAttribute('role','group'); w.setAttribute('aria-label',label);
  w.innerHTML = `<span>${label}</span><div class="segs">${opts.map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k===val}">${t}</button>`).join('')}</div>`;
  ctrls.appendChild(w);
  w.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return; w.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b)); on(b.dataset.k);});
  return w;
};
S._btn = (ctrls, text, on, cls) => { const b=document.createElement('button'); b.type='button'; b.className='sim-btn '+(cls||''); b.innerHTML=text; b.addEventListener('click',on); ctrls.appendChild(b); return b; };
S._loop = fn => { let id, last=performance.now(), alive=true; const f=now=>{ if(!alive) return; const dt=Math.min(50,now-last); last=now; if(motion()) fn(dt); id=requestAnimationFrame(f); }; id=requestAnimationFrame(f); return ()=>{alive=false; cancelAnimationFrame(id);} };
const NS='http://www.w3.org/2000/svg';
const svgEl=(tag,attrs,parent)=>{const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e;};
S._svgEl = svgEl;

/* ---------- 1. milk tank ---------- */
S.milk = host => {
  const F = S._frame(host,'מכל מים עם מעט חלב','אנלוגיה בלבד: חלקיקי החלב גדולים בהרבה ממולקולות האוויר, וההדגמה אינה הוכחה מלאה למנגנון באטמוספרה.');
  F.view.innerHTML = `<svg viewBox="0 0 640 300" class="sim-svg">
    <rect width="640" height="300" fill="#13252c"/>
    <rect x="120" y="80" width="380" height="140" rx="10" fill="#2b4650" stroke="#9fb6bc" stroke-width="3"/>
    <rect id="water" x="123" y="83" width="374" height="134" rx="8" fill="#fff" opacity=".05"/>
    <polygon id="beam" points="560,140 560,160 123,170 123,130" fill="#fff" opacity=".1"/>
    <rect id="side" x="123" y="120" width="374" height="60" fill="#6f9fe6" opacity="0" filter="url(#bl)"/>
    <defs><filter id="bl"><feGaussianBlur stdDeviation="10"/></filter></defs>
    <g><rect x="560" y="132" width="60" height="36" rx="6" fill="#E9C46A"/><rect x="548" y="138" width="14" height="24" fill="#c9a94f"/></g>
    <rect x="40" y="90" width="14" height="120" rx="4" fill="#ddd"/>
    <circle id="spot" cx="47" cy="150" r="22" fill="#fff" filter="url(#bl)"/>
    <text x="580" y="195" text-anchor="middle" fill="#fff" font-size="14" direction="rtl">פנס</text>
    <text x="47" y="236" text-anchor="middle" fill="#fff" font-size="14" direction="rtl">מבט מהקצה</text>
    <text x="310" y="252" text-anchor="middle" fill="#fff" font-size="14" direction="rtl">מבט מהצד ↓</text>
  </svg>`;
  const q=s=>F.view.querySelector(s);
  const set = m => { // m 0..100
    const t=m/100;
    q('#water').setAttribute('opacity',(.05+t*.35).toFixed(2));
    q('#side').setAttribute('opacity',(Math.min(1,t*1.6)*.75).toFixed(2));
    q('#beam').setAttribute('opacity',(.12*(1-t)).toFixed(2));
    const spot = t<.5 ? mix([255,255,250],[255,180,90],t/.5) : mix([255,180,90],[200,70,40],(t-.5)/.5);
    q('#spot').setAttribute('fill',rgb(spot)); q('#spot').setAttribute('opacity',(1-t*.55).toFixed(2));
    F.read.textContent = m===0 ? 'מים בלבד: האור עובר כמעט בלי להתפזר. מהצד כמעט לא רואים את האלומה.'
      : m<45 ? 'מעט חלב: מהצד האלומה נראית בגוון כחלחל, ובקצה האור עדיין כמעט לבן.'
      : 'הרבה חלב: מהצד — גוון כחלחל־לבנבן; בקצה — כתם חלש יותר, בגוון כתמתם־אדמדם.';
  };
  S._slider(F.ctrls,'כמות חלב',0,100,0,1,set); set(0);
  return {destroy(){}};
};

/* ---------- 2. sky scattering ---------- */
S.sky = host => {
  const F = S._frame(host,'אור השמש באטמוספרה','מודל מפושט: נקודות כחולות = אור קצר־גל, כתומות = ארוך־גל. ככל שאורך הגל קצר יותר, הפיזור במולקולות האוויר חזק בהרבה.');
  F.view.innerHTML = `<svg viewBox="0 0 640 340" class="sim-svg"><defs>
    <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop id="sk1" offset="0"/><stop id="sk2" offset="1"/></linearGradient></defs>
    <rect width="640" height="340" fill="url(#skyg)"/>
    <path d="M0 300Q320 280 640 300V340H0Z" fill="#3b3a2c"/>
    <g id="parts"></g>
    <circle id="sun" r="20"/>
    <g transform="translate(320,296)"><path d="M-14 0Q0-10 14 0Q0 10-14 0Z" fill="#fff" stroke="#264653" stroke-width="2"/><circle r="4" fill="#264653"/></g>
    <text x="320" y="328" text-anchor="middle" font-size="13" fill="#fff" direction="rtl">צופה</text>
    <text id="lbl" x="620" y="28" text-anchor="start" font-size="15" fill="#fff" direction="rtl"></text>
  </svg>`;
  const q=s=>F.view.querySelector(s), parts=q('#parts');
  let el=70, filter='all', P=[];
  const OBS=[320,296];
  const airmass = e=>{const r=e*Math.PI/180; return 1/(Math.sin(r)+0.50572*Math.pow(e+6.07995,-1.6364));};
  const sunPos = ()=>{const r=el*Math.PI/180, R=270; return [OBS[0]+R*Math.cos(r)*(el<90?1:0)+ (el<90?0:0), OBS[1]-R*Math.sin(r)];};
  const tauS=.32, tauL=tauS*.17;
  const update=()=>{
    const m=airmass(el), sS=Math.exp(-tauS*m), sL=Math.exp(-tauL*m);
    const [sx,sy]=sunPos(); q('#sun').setAttribute('cx',sx); q('#sun').setAttribute('cy',sy);
    const sunC = mix([255,255,235],[255,120,40],clamp(1-sS*1.25,0,1));
    q('#sun').setAttribute('fill',rgb(sunC));
    const low=clamp((25-el)/22,0,1);
    q('#sk1').setAttribute('stop-color',rgb(mix([80,140,215],[40,60,110],low)));
    q('#sk2').setAttribute('stop-color',rgb(mix([150,195,235],[240,140,80],low)));
    q('#lbl').textContent = el>60?'צהריים':el>20?'אחר הצהריים':'קרוב לשקיעה';
    F.read.textContent = `אורך המסלול באוויר: פי ${m.toFixed(1)} מאשר כשהשמש מעל הראש · קצר־גל שמגיע ישירות מכיוון השמש: ${Math.round(sS*100)}% · ארוך־גל: ${Math.round(sL*100)}%`;
  };
  S._slider(F.ctrls,'גובה השמש',3,88,el,1,v=>{el=v;update();});
  S._seg(F.ctrls,'להציג',[['all','הכול'],['s','רק קצר־גל'],['l','רק ארוך־גל']],'all',k=>{filter=k;});
  update();
  let acc=0;
  const stop=S._loop(dt=>{
    acc+=dt; const [sx,sy]=sunPos(); const m=airmass(el);
    while(acc>70){acc-=70; for(const type of ['s','l']){
      const dx=OBS[0]-sx, dy=OBS[1]-sy, d=Math.hypot(dx,dy), sp=.22;
      const off=(Math.random()-.5)*40;
      const c=svgEl('circle',{r:3.2,fill:type==='s'?'#3d6fe0':'#f07a3a'},parts);
      P.push({x:sx-dy/d*off,y:sy+dx/d*off,vx:dx/d*sp,vy:dy/d*sp,type,c,sc:false,life:0,d});
    }}
    const k = (.32/ (Math.hypot(OBS[0]-sx,OBS[1]-sy))) * m; // per px extinction for short
    P=P.filter(p=>{
      p.life+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
      if(!p.sc){const pk=(p.type==='s'?k:k*.17)*Math.hypot(p.vx,p.vy)*dt; if(Math.random()<pk){p.sc=true; const a=Math.random()*Math.PI*2; p.vx=Math.cos(a)*.2; p.vy=Math.sin(a)*.2; p.c.setAttribute('r',2.4);}}
      const show = filter==='all'||filter===p.type;
      p.c.setAttribute('cx',p.x.toFixed(1)); p.c.setAttribute('cy',p.y.toFixed(1)); p.c.style.display=show?'':'none';
      p.c.setAttribute('opacity', p.sc?.7:1);
      const dead = p.x<-10||p.x>650||p.y<-10||p.y>300||p.life>9000;
      if(dead) p.c.remove(); return !dead;
    });
  });
  return {destroy:stop};
};

/* ---------- 3. causal chain builder ---------- */
S.chain = host => {
  const F = S._frame(host,'בונים שרשרת סיבתית','לחצו על כרטיס כדי להכניס אותו לחוליה הבאה; לחיצה על כרטיס בשרשרת מחזירה אותו. יש כאן גם כרטיסים שאינם חוליה בשרשרת.');
  const cards=[
    {id:1,t:'אור השמש כולל טווח של אורכי גל'},
    {id:2,t:'האור עובר דרך האוויר'},
    {id:3,t:'מולקולות האוויר מפזרות אור קצר־גל חזק יותר'},
    {id:4,t:'אור מפוזר מגיע לעין מכל כיווני השמיים'},
    {id:5,t:'מערכת הראייה מפרשת את האור הזה ככחלחל'},
    {id:9,t:'האוויר צבוע בכחול',x:1},
    {id:8,t:'השמיים משקפים את הים',x:1}
  ].sort(()=>Math.random()-.5);
  let slots=[null,null,null,null,null];
  F.view.innerHTML=`<div class="chain"><div class="chain-slots"></div><div class="chain-pool"></div></div>`;
  const draw=(checked)=>{
    const sl=F.view.querySelector('.chain-slots'), pool=F.view.querySelector('.chain-pool');
    sl.innerHTML=slots.map((id,i)=>{const c=cards.find(x=>x.id===id); let st='';
      if(checked&&c){st=c.x?'bad':(c.id===i+1?'ok':'off');}
      return `<div class="slot ${st}">${c?`<button type="button" class="card-c" data-out="${i}">${c.t}</button>`:`<span class="slot-n">${i+1}</span>`}</div>${i<4?'<span class="arrow" aria-hidden="true">←</span>':''}`}).join('');
    pool.innerHTML=cards.filter(c=>!slots.includes(c.id)).map(c=>`<button type="button" class="card-c" data-in="${c.id}">${c.t}</button>`).join('');
  };
  F.view.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.in){const i=slots.indexOf(null); if(i>-1) slots[i]=+b.dataset.in;}
    if(b.dataset.out!==undefined) slots[+b.dataset.out]=null;
    draw(false); F.read.textContent='';
  });
  S._btn(F.ctrls,'✓ בדיקה',()=>{draw(true);
    const bad=slots.some(id=>cards.find(c=>c.id===id)?.x), empty=slots.includes(null), ok=slots.every((id,i)=>id===i+1);
    F.read.textContent= ok?'השרשרת שלמה. עכשיו — מי יכולה להסביר בעל פה איך כל חוליה מובילה לבאה?'
      : bad?'יש בשרשרת כרטיס שאינו חוליה בהסבר (מסומן באדום). למה הוא לא מתאים?'
      : empty?'חסרות חוליות. מה צריך לקרות בין שני כרטיסים כדי שהאחד יוביל לשני?'
      : 'חלק מהחוליות לא במקום (מסומנות במסגרת מקווקווה). איך זה מוביל לשלב הבא?';
  });
  S._btn(F.ctrls,'↺ התחלה מחדש',()=>{slots=[null,null,null,null,null];draw(false);F.read.textContent='';},'ghost');
  draw(false);
  return {destroy(){}};
};

/* ---------- 4. light on objects ---------- */
S.light = host => {
  const F = S._frame(host,'אור פוגע: מוחזר, נבלע או עובר','מודל מפושט: שלוש רצועות במקום ספקטרום רציף. חומרים אמיתיים מחזירים בדרך כלל גם מעט משאר האור, ולכן ״כהה״ אינו תמיד שחור מוחלט.');
  const BAND={r:['אדום','#e2483a'],g:['ירוק','#3fae4b'],b:['כחול','#3b6fe0']};
  const LIGHTS={w:['לבן','rgb'],r:['אדום','r'],g:['ירוק','g'],b:['כחול','b']};
  const OBJ={red:['דף אדום','r','reflect'],blue:['דף כחול','b','reflect'],white:['דף לבן','rgb','reflect'],black:['דף שחור','','reflect'],filter:['מסנן שקוף אדום','r','pass']};
  let L='w', O='red';
  F.view.innerHTML=`<svg viewBox="0 0 640 300" class="sim-svg"><rect width="640" height="300" fill="#f4ede2"/><g id="g"></g></svg>`;
  const g=F.view.querySelector('#g');
  const draw=()=>{
    const inc=[...LIGHTS[L][1]], [oname,keep,how]=OBJ[O];
    const out=inc.filter(c=>keep.includes(c)), lost=inc.filter(c=>!keep.includes(c));
    const look = how==='pass'&&!out.length || !out.length ? '#2b2421' : (()=>{const v={r:[226,72,58],g:[63,174,75],b:[59,111,224]}; let s=[0,0,0]; out.forEach(c=>s=s.map((x,i)=>x+v[c][i])); if(out.length===3) return '#fbfbf7'; return rgb(s.map(x=>Math.min(255,x)));})();
    let h=`<g transform="translate(560,40)"><rect x="-26" y="-14" width="52" height="34" rx="8" fill="#264653"/><text y="44" text-anchor="middle" font-size="14" fill="#264653" direction="rtl">אור ${LIGHTS[L][0]}</text></g>`;
    // incoming rays
    inc.forEach((c,i)=>{h+=`<path d="M${548-i*6} 62L${330-i*6} 150" stroke="${BAND[c][1]}" stroke-width="4" class="ray"/>`;});
    if(how==='reflect'){
      h+=`<rect x="250" y="150" width="160" height="26" rx="4" fill="${look}" stroke="#264653" stroke-width="2"/><text x="330" y="200" text-anchor="middle" font-size="14" fill="#264653" direction="rtl">${oname}</text>`;
      out.forEach((c,i)=>{h+=`<path d="M${322-i*6} 150L${110-i*6} 70" stroke="${BAND[c][1]}" stroke-width="4" class="ray d2"/>`;});
      lost.forEach((c,i)=>{h+=`<circle cx="${305+i*24}" cy="163" r="6" fill="${BAND[c][1]}" class="absorb"/>`;});
      h+=`<g transform="translate(95,60)"><path d="M-22 0Q0-15 22 0Q0 15-22 0Z" fill="#fff" stroke="#264653" stroke-width="2.5"/><circle r="6" fill="#264653"/></g><text x="95" y="100" text-anchor="middle" font-size="14" fill="#264653" direction="rtl">עין</text>`;
    } else {
      h+=`<rect x="250" y="140" width="160" height="16" rx="4" fill="#e2483a" opacity=".45" stroke="#264653" stroke-width="2"/><text x="330" y="132" text-anchor="middle" font-size="14" fill="#264653" direction="rtl">${oname}</text>`;
      out.forEach((c,i)=>{h+=`<path d="M${322-i*6} 156L${250-i*6} 250" stroke="${BAND[c][1]}" stroke-width="4" class="ray d2"/>`;});
      lost.forEach((c,i)=>{h+=`<circle cx="${300+i*24}" cy="148" r="6" fill="${BAND[c][1]}" class="absorb"/>`;});
      h+=`<rect x="160" y="250" width="160" height="30" rx="4" fill="${look}" stroke="#264653" stroke-width="2"/><text x="240" y="296" text-anchor="middle" font-size="13" fill="#264653" direction="rtl">מסך לבן מאחורי המסנן</text>`;
    }
    g.innerHTML=h;
    const nm=a=>a.length?a.map(c=>BAND[c][0]).join(', '):'כלום';
    F.read.textContent=`מגיע: ${nm(inc)} · ${how==='pass'?'עובר':'מוחזר'}: ${nm(out)} · נבלע: ${nm(lost)} → ${out.length?'נראה בצבע של מה ש'+(how==='pass'?'עבר':'הוחזר'):'נראה כהה'}`;
  };
  S._seg(F.ctrls,'תאורה',Object.entries(LIGHTS).map(([k,v])=>[k,v[0]]),L,k=>{L=k;draw();});
  S._seg(F.ctrls,'חומר',Object.entries(OBJ).map(([k,v])=>[k,v[0]]),O,k=>{O=k;draw();});
  draw();
  return {destroy(){}};
};

/* ---------- 5. cost chain ---------- */
S.cost = host => {
  const F = S._frame(host,'שרשרת הייצור של חומר צבע','דירוג איכותי לתרגול (1–3 מטבעות = קושי/עלות יחסיים), לא מחירים היסטוריים.');
  const ST=['חומר גלם','עיבוד','הובלה','מכירה'];
  const D={
    ochre:['אוכרה',[[1,'אדמה עשירה בתחמוצות ברזל — נמצאת בהרבה מקומות'],[1,'חפירה, טחינה ושטיפה; לפעמים חימום לשינוי גוון'],[1,'לרוב זמינה קרוב למקום השימוש'],[1,'ביקוש רחב, אבל קל להשיג']]],
    ultra:['אולטרמרין טבעי',[[3,'אבן לפיס לזולי, שנכרתה בעיקר באפגניסטן'],[3,'הפרדת הכחול מהאבן — תהליך ארוך ועתיר עבודה'],[3,'מסע ארוך עד לאירופה'],[3,'ביקוש גבוה; נשמר לעיתים לפרטים החשובים בציור']]],
    purple:['ארגמן מחלזונות',[[3,'חלזונות ים; נדרשו כמויות עצומות לכמות קטנה של צבע'],[3,'מיצוי ממושך ומסריח'],[2,'מרכזי ייצור בחופי מזרח הים התיכון'],[3,'סמל למעמד — מזוהה עם שליטים']]],
    mauve:['מוורין סינתטי (1856)',[[1,'חומרים שמקורם בזפת פחם — תוצר לוואי של התעשייה'],[2,'תהליך כימי במפעל, בכמויות גדולות'],[1,'מפעלים קרובים לשווקים'],[2,'אופנתי מאוד בהתחלה; ככל שהתפשט — הפך זמין יותר']]]
  };
  let k='ochre';
  F.view.innerHTML=`<div class="costv"></div>`;
  const v=F.view.firstElementChild;
  const draw=()=>{const [name,st]=D[k];
    v.innerHTML=`<h5>${name}</h5><div class="cost-row">${st.map(([lv,t],i)=>`<div class="cost-st" style="--i:${i}"><div class="coins">${'<i></i>'.repeat(lv)}</div><b>${ST[i]}</b><p>${t}</p></div>${i<3?'<span class="arrow" aria-hidden="true">←</span>':''}`).join('')}</div>`;
    const sum=st.reduce((a,b)=>a+b[0],0);
    F.read.textContent=`סך הקושי בשרשרת: ${sum} מתוך 12. איפה בשרשרת נוצרת רוב העלות — ומה היה יכול לשנות אותה?`;
  };
  S._seg(F.ctrls,'חומר צבע',Object.entries(D).map(([a,b])=>[a,b[0]]),k,x=>{k=x;draw();});
  draw();
  return {destroy(){}};
};

/* ---------- 6. RGB / CMY mixer ---------- */
S.rgb = host => {
  const F = S._frame(host,'ערבוב אור וערבוב מסננים','גררו את העיגולים. באורות — מוסיפים אור לעין; במסננים — כל מסנן בולע חלק מהאור.');
  let mode='add', I=[255,255,255];
  const pos=[[260,140],[380,140],[320,240]];
  F.view.innerHTML=`<svg viewBox="0 0 640 360" class="sim-svg" style="touch-action:none"><rect id="bg" width="640" height="360"/><g id="cs" style="isolation:isolate"></g><text id="hint" x="320" y="345" text-anchor="middle" font-size="14" direction="rtl"></text></svg>`;
  const svg=F.view.querySelector('svg'), cs=svg.querySelector('#cs');
  const circles=[0,1,2].map(i=>svgEl('circle',{r:95,cx:pos[i][0],cy:pos[i][1],style:'cursor:grab'},cs));
  const draw=()=>{
    const add=mode==='add';
    svg.querySelector('#bg').setAttribute('fill',add?'#0f1d22':'#ffffff');
    const fills = add ? [[I[0],0,0],[0,I[1],0],[0,0,I[2]]] : [[255-I[0],255,255],[255,255-I[1],255],[255,255,255-I[2]]];
    circles.forEach((c,i)=>{c.setAttribute('fill',rgb(fills[i])); c.style.mixBlendMode=add?'screen':'multiply';});
    const h=svg.querySelector('#hint'); h.setAttribute('fill',add?'#fff':'#264653');
    h.textContent = add ? 'אורות: אדום · ירוק · כחול (RGB)' : 'מסננים: ציאן (בולע אדום) · מג׳נטה (בולע ירוק) · צהוב (בולע כחול)';
    F.read.textContent = add ? `אדום ${I[0]} · ירוק ${I[1]} · כחול ${I[2]}. בחפיפה של אדום וירוק העין מקבלת דפוס שנתפס כצהוב — לא נוצר אור צהוב חדש.`
      : `חוזק המסננים: ${I.map(x=>Math.round(x/2.55)+'%').join(' · ')}. בחפיפה של שלושתם כמעט כל האור נבלע.`;
  };
  let drag=null,off=[0,0];
  const pt=e=>{const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse());};
  circles.forEach((c,i)=>c.addEventListener('pointerdown',e=>{drag=i; const p=pt(e); off=[p.x-pos[i][0],p.y-pos[i][1]]; c.setPointerCapture(e.pointerId);}));
  svg.addEventListener('pointermove',e=>{if(drag===null) return; const p=pt(e); pos[drag]=[clamp(p.x-off[0],40,600),clamp(p.y-off[1],40,320)]; circles[drag].setAttribute('cx',pos[drag][0]); circles[drag].setAttribute('cy',pos[drag][1]);});
  svg.addEventListener('pointerup',()=>drag=null);
  S._seg(F.ctrls,'מצב',[['add','ערבוב אורות (חיבורי)'],['sub','מסננים (חיסורי)']],mode,k=>{mode=k;draw();});
  ['אדום / ציאן','ירוק / מג׳נטה','כחול / צהוב'].forEach((l,i)=>S._slider(F.ctrls,l,0,255,255,1,v=>{I[i]=v;draw();}));
  draw();
  return {destroy(){}};
};

/* ---------- 7. screen vs print magnifier ---------- */
S.screen = host => {
  const F = S._frame(host,'זכוכית מגדלת: מסך מול הדפסה','אותה ״תמונה״ — שקיעה פשוטה — במסך ובהדפסה. הגדילו, ואז כבו את האור בחדר.');
  F.view.innerHTML=`<div class="two-cv"><figure><canvas width="300" height="220"></canvas><figcaption>מסך — תתי־פיקסלים פולטים אור (RGB)</figcaption></figure><figure><canvas width="300" height="220"></canvas><figcaption>הדפסה — נקודות דיו מחזירות אור (CMYK)</figcaption></figure></div>`;
  const [cS,cP]=F.view.querySelectorAll('canvas');
  let z=6, dark=false;
  const img=(x,y)=>{ // x,y in 0..1
    const d=Math.hypot(x-.5,y-.55); if(d<.2) return [245,170,60];
    if(y>.7) return [42,120,130]; return mix([240,120,80],[120,160,210],y/.7);
  };
  const draw=()=>{
    const s=Math.max(3,z*3); // cell size px
    let g=cS.getContext('2d'); g.fillStyle='#000'; g.fillRect(0,0,300,220);
    for(let y=0;y<220;y+=s) for(let x=0;x<300;x+=s){const c=img(x/300,y/220); const w=s/3;
      ['r','g','b'].forEach((k,i)=>{g.fillStyle=`rgb(${i==0?c[0]:0},${i==1?c[1]:0},${i==2?c[2]:0})`; g.fillRect(x+i*w+ (s>6?.5:0),y+(s>6?.5:0),w-(s>6?1:0),s-(s>6?1:0));});}
    g=cP.getContext('2d'); g.globalCompositeOperation='source-over'; g.fillStyle='#fff'; g.fillRect(0,0,300,220); g.globalCompositeOperation='multiply';
    const inks=[['#00aeef',c=>1-c[0]/255,0],['#ec008c',c=>1-c[1]/255,.25],['#fff200',c=>1-c[2]/255,.5]];
    const ps=s*1.3;
    for(let y=0;y<220+ps;y+=ps) for(let x=0;x<300+ps;x+=ps){const c=img(x/300,y/220); const k=Math.min(1-c[0]/255,1-c[1]/255,1-c[2]/255);
      inks.forEach(([col,f,o])=>{const a=Math.max(0,f(c)-k); if(a<.02) return; g.fillStyle=col; g.beginPath(); g.arc(x+o*ps*.5,y+o*ps*.3,Math.sqrt(a)*ps*.55,0,7); g.fill();});
      if(k>.03){g.fillStyle='#222'; g.beginPath(); g.arc(x+ps*.4,y+ps*.6,Math.sqrt(k)*ps*.5,0,7); g.fill();}}
    g.globalCompositeOperation='source-over';
    if(dark){g.fillStyle='rgba(5,10,12,.93)'; g.fillRect(0,0,300,220);}
    F.view.querySelector('.two-cv').classList.toggle('dark',dark);
    F.read.textContent = dark ? 'בחדר חשוך: המסך עדיין נראה — הוא פולט אור. ההדפסה כמעט נעלמת — אין אור שיחזור ממנה.'
      : z<3 ? 'ממרחק: העין ״מחברת״ את הנקודות לצבע אחד.' : 'מקרוב: רואים את הרכיבים — פסים צבעוניים במסך, נקודות דיו בהדפסה.';
  };
  S._slider(F.ctrls,'הגדלה',1,12,z,1,v=>{z=v;draw();});
  S._seg(F.ctrls,'החדר',[['on','מואר'],['off','חשוך']],'on',k=>{dark=k==='off';draw();});
  draw();
  return {destroy(){}};
};

/* ---------- 8. cones ---------- */
S.cones = host => {
  const F = S._frame(host,'שלושה סוגי מדוכים, תחומים חופפים','גרף מפושט לתרגול. מה שהמוח מקבל הוא דפוס של שלוש תגובות — לא ״צבע מוכן״.');
  const C=[['S',443,32,'#3b5bb5'],['M',535,42,'#2f8f5a'],['L',565,47,'#d0562f']];
  const resp=(l)=>C.map(([,p,w])=>Math.exp(-((l-p)**2)/(2*w*w)));
  const X=l=>40+(l-400)*1.0, BASE=200, H=160;
  let mode='one', lam=580, red=.8, green=.6;
  const wl2=l=>{let h; if(l<440)h=270-(l-400)*.5; else if(l<490)h=240-(l-440)*1.2; else if(l<510)h=180-(l-490)*2; else if(l<580)h=140-(l-510)*1.4; else if(l<645)h=42-(l-580)*.6; else h=0; return `hsl(${Math.max(0,h)},85%,52%)`;};
  let curves=''; C.forEach(([n,p,w,c])=>{let d='';for(let l=400;l<=700;l+=4){d+=(l==400?'M':'L')+X(l)+' '+(BASE-resp(l)[C.findIndex(x=>x[0]==n)]*H).toFixed(1)} curves+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="3"/><text x="${X(p)}" y="${BASE-H-6}" text-anchor="middle" font-size="13" font-weight="700" fill="${c}">${n}</text>`;});
  F.view.innerHTML=`<svg viewBox="0 0 640 250" class="sim-svg"><rect width="640" height="250" fill="#fffdf8"/>
    <defs><linearGradient id="spg" x1="0" x2="1">${[400,440,480,520,560,600,640,700].map(l=>`<stop offset="${(l-400)/300}" stop-color="${wl2(l)}"/>`).join('')}</linearGradient></defs>
    <rect x="40" y="206" width="300" height="10" fill="url(#spg)"/>
    <line x1="40" y1="${BASE}" x2="340" y2="${BASE}" stroke="#264653"/>${curves}
    <text x="190" y="236" text-anchor="middle" font-size="12" fill="#5d5148">אורך גל (ננומטר) 400 → 700</text>
    <g id="marks"></g><g id="bars"></g></svg>`;
  const marks=F.view.querySelector('#marks'), bars=F.view.querySelector('#bars');
  const barSet=(y0,label,r)=>`<text x="620" y="${y0-8}" text-anchor="start" font-size="13" fill="#264653" direction="rtl">${label}</text>`+C.map(([n,,,c],i)=>`<text x="372" y="${y0+12+i*22}" font-size="12" fill="#264653">${n}</text><rect x="386" y="${y0+i*22}" width="${(r[i]*220).toFixed(1)}" height="15" rx="4" fill="${c}"/>`).join('');
  const draw=()=>{
    if(mode==='one'){
      const r=resp(lam);
      marks.innerHTML=`<line x1="${X(lam)}" x2="${X(lam)}" y1="${BASE-H}" y2="${BASE}" stroke="#264653" stroke-dasharray="4 4"/><circle cx="${X(lam)}" cy="${BASE-H-22}" r="9" fill="${wl2(lam)}"/>`;
      bars.innerHTML=barSet(70,`תגובות לאור ${lam} ננומטר`,r);
      F.read.textContent=`${lam} ננומטר: S ${Math.round(r[0]*100)}% · M ${Math.round(r[1]*100)}% · L ${Math.round(r[2]*100)}%. אותו אורך גל מעורר כמה סוגי מדוכים — בעוצמות שונות.`;
    } else {
      const ry=resp(580), rr=resp(630).map(x=>x*red), rg=resp(530).map(x=>x*green), mixr=rr.map((x,i)=>Math.min(1,x+rg[i]));
      marks.innerHTML=[580,630,530].map((l,i)=>`<line x1="${X(l)}" x2="${X(l)}" y1="${BASE-H}" y2="${BASE}" stroke="${i?wl2(l):'#264653'}" stroke-width="${i?2.5:1.5}" stroke-dasharray="${i?'':'4 4'}"/>`).join('');
      bars.innerHTML=barSet(40,'אור צהוב (580 ננומטר)',ry)+barSet(150,'אדום (630) + ירוק (530) יחד',mixr);
      const diff=Math.abs(mixr[2]/Math.max(.01,mixr[1]) - ry[2]/ry[1]);
      F.read.textContent = diff<.12 ? 'הדפוסים כמעט זהים — ולכן גם התפיסה דומה: ״צהוב״. אין קולטן צהוב; יש יחס בין תגובות M ו־L.' : 'שנו את עוצמות האדום והירוק עד שדפוס L/M יתאים לדפוס של הצהוב.';
    }
  };
  const box=document.createElement('div'); box.className='ctl-row';
  S._seg(F.ctrls,'מצב',[['one','אורך גל אחד'],['mix','צהוב מול אדום+ירוק']],mode,k=>{mode=k; F.ctrls.querySelectorAll('.only-one').forEach(e=>e.hidden=k!=='one'); F.ctrls.querySelectorAll('.only-mix').forEach(e=>e.hidden=k!=='mix'); draw();});
  S._slider(F.ctrls,'אורך גל',400,700,lam,1,v=>{lam=v;draw();}).closest('.ctl').classList.add('only-one');
  const r1=S._slider(F.ctrls,'עוצמת האדום',0,100,80,1,v=>{red=v/100;draw();}).closest('.ctl'); r1.classList.add('only-mix'); r1.hidden=true;
  const r2=S._slider(F.ctrls,'עוצמת הירוק',0,100,60,1,v=>{green=v/100;draw();}).closest('.ctl'); r2.classList.add('only-mix'); r2.hidden=true;
  draw();
  return {destroy(){}};
};
})();
