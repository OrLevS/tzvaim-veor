/* Cover scenes (animated SVG) */
const C={coral:'#E76F51',sand:'#F4A261',gold:'#E9C46A',teal:'#2A9D8F',navy:'#264653',brown:'#5A2A0C',beige:'#E6D3B9',cream:'#FBF5ED',paper:'#fffdf8'};
/* ================== scenes ================== */
const T=(x,y,s,o={})=>{const ltr=(o.extra||'').includes('direction');const a=o.a||'middle';const anc=ltr?a:({start:'end',end:'start'}[a]||a);return `<text x="${x}" y="${y}" ${ltr?'':'direction="rtl"'} class="${o.cls||'svgt'}" text-anchor="${anc}" font-size="${o.s||15}" fill="${o.f||C.navy}" ${o.w?`font-weight="${o.w}"`:''} ${o.extra||''}>${s}</text>`};
const photon=(path,color,dur,begin,r=6)=>`<circle r="${r}" fill="${color}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/></circle>`;
const bg=(f)=>`<rect width="640" height="360" fill="${f}"/>`;
const wl2rgb=l=>{let h; if(l<440)h=270-(l-400)*0.5; else if(l<490)h=240-(l-440)*1.2; else if(l<510)h=180-(l-490)*2; else if(l<580)h=140-(l-510)*1.4; else if(l<645)h=42-(l-580)*0.6; else h=0; return `hsl(${Math.max(0,h)},85%,52%)`;};

const SCENES={
sky(){
  const mol=[[300,150],[220,110],[380,120],[160,170],[450,190],[260,200],[350,70],[120,90],[500,150],[420,240],[200,240]];
  let s=bg(C.cream)+`<path d="M0 0H640V250Q320 280 0 250Z" fill="${C.teal}" opacity=".13"/>`+
  `<path d="M0 305Q160 285 320 305T640 305V360H0Z" fill="${C.beige}"/>`+
  `<g opacity=".25" stroke="${C.navy}" stroke-dasharray="4 7" fill="none"><path d="M540 80L300 150L110 292"/><path d="M540 80L60 340"/></g>`;
  s+=`<g class="spin"><g stroke="${C.gold}" stroke-width="4" stroke-linecap="round"><path d="M540 28v-12M540 112v12M498 70h-12M582 70h12M510 40l-8-8M570 100l8 8M570 40l8-8M510 100l-8 8"/></g></g><circle cx="540" cy="70" r="30" fill="${C.gold}"/>`;
  mol.forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="${i?4:7}" fill="${C.navy}" opacity="${i?.35:.9}" class="bob" style="--d:${-i*.4}s"/>`);
  s+=`<circle cx="300" cy="150" r="14" fill="none" stroke="${C.teal}" stroke-width="2" class="pulse"/>`;
  // long wave passes
  for(let i=0;i<4;i++) s+=photon('M520 90L40 345',C.coral,4,-i*1,5);
  // short-wave scatter
  const paths=['M520 90L300 150L110 290','M520 90L300 150L420 30','M520 90L300 150L620 230','M520 90L300 150L20 120','M520 90L300 150L330 330'];
  paths.forEach((p,i)=>{for(let k=0;k<2;k++) s+=photon(p,C.teal,3.4,-(i*.68+k*1.7),5)});
  s+=`<g transform="translate(105,295)"><path d="M-30 0Q0-22 30 0Q0 22-30 0Z" fill="#fff" stroke="${C.navy}" stroke-width="3"/><circle r="9" fill="${C.navy}"/><circle r="3" cx="3" cy="-3" fill="#fff"/></g>`;
  s+=T(540,140,'אור שמש')+T(300,185,'מולקולת אוויר',{s:13})+T(105,340,'עין',{s:13,w:700});
  s+=`<g transform="translate(470,300)"><circle cx="140" cy="0" r="6" fill="${C.coral}"/>${T(128,5,'ארוך־גל: ממשיך כמעט ישר',{a:'end',s:13})}<circle cx="140" cy="24" r="6" fill="${C.teal}"/>${T(128,29,'קצר־גל: מתפזר לכל כיוון',{a:'end',s:13})}</g>`;
  return s;
},
chain(){
  let s=bg(C.cream);
  s+=`<rect x="400" y="40" width="210" height="270" rx="16" fill="#fff" stroke="${C.beige}" stroke-width="2"/>`+T(505,70,'רשימת עובדות',{w:700,s:14});
  const facts=[[100,'אור השמש לבן'],[150,'יש אורכי גל שונים'],[200,'האוויר מפזר אור'],[250,'ניוטון ופיצול אור']];
  facts.forEach(([y,t],i)=>{s+=`<rect x="416" y="${y-18}" width="178" height="28" rx="8" fill="${C.gold}" class="pop" style="--d:${i*.5}s;opacity:0"/>`+`<circle cx="586" cy="${y-4}" r="4" fill="${C.navy}"/>`+T(574,y+1,t,{a:'end',s:14})});
  const chips=[[95,'אור שמש',C.gold,'#264653'],[170,'האוויר מפזר אור קצר־גל',C.teal,'#fff'],[245,'אור מפוזר מגיע לעין',C.coral,'#264653']];
  chips.forEach(([y,t,c,f],i)=>{s+=`<g class="pop" style="--d:${2.2+i*.9}s"><rect x="80" y="${y-22}" width="240" height="44" rx="22" fill="${c}"/>${T(200,y+6,t,{f,s:15,w:500})}</g>`;
    if(i<2) s+=`<path d="M200 ${y+24}V${y+50}" stroke="${C.navy}" stroke-width="3" marker-end="url(#ah)" class="draw" style="--len:30;--d:${2.7+i*.9}s"/>`});
  s+=`<g class="pop" style="--d:5s"><rect x="100" y="290" width="200" height="40" rx="12" fill="${C.navy}"/>${T(200,316,'…ולכן השמיים נראים כחולים',{f:'#fff',s:14})}</g>`;
  s+=`<path d="M330 140Q370 120 395 140" fill="none" stroke="${C.brown}" stroke-width="2.5" stroke-dasharray="5 5" class="pop" style="--d:1.8s"/>`;
  s+=T(200,48,'הסבר סיבתי',{w:700,s:14});
  s+=`<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.navy}"/></marker></defs>`;
  return s;
},
object(){
  const kt='0;.30;.333;.63;.666;.96;1', dur='9s';
  const anim=(a,b,c)=>`<animate attributeName="fill" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${a};${a};${b};${b};${c};${c};${a}"/>`;
  let s=bg(C.cream)+`<rect y="270" width="640" height="90" fill="${C.beige}"/>`;
  s+=`<polygon points="290,58 350,58 500,270 140,270" opacity=".32">${anim('#fff4d6','#E76F51','#2A9D8F')}</polygon>`;
  s+=`<rect x="280" y="22" width="80" height="40" rx="10" fill="${C.navy}"/><rect x="300" y="0" width="40" height="24" fill="${C.navy}"/>`;
  const obj=[[190,'אדום',[C.coral,C.coral,'#4a2a22']],[290,'כחול',[C.teal,'#3b2c28',C.teal]],[390,'לבן',['#ffffff','#F09A84','#8FCFC6']]];
  obj.forEach(([x,l,v])=>{s+=`<rect x="${x-4}" y="196" width="68" height="68" rx="6" stroke="${C.navy}" stroke-width="2.5">${anim(...v)}</rect>`+T(x+30,300,'דף '+l,{s:14})});
  const L=[['אור לבן',0],['אור אדום',1],['אור כחול',2]];
  L.forEach(([t,i])=>{const vals=[0,0,0,0,0,0,0];vals[i*2]=1;vals[i*2+1]=1;if(i==0)vals[6]=1;s+=`<g opacity="0">${T(560,110,t,{s:22,w:700,cls:'svgh'})}<animate attributeName="opacity" dur="${dur}" repeatCount="indefinite" keyTimes="${kt}" values="${vals.join(';')}"/></g>`});
  s+=T(560,140,'מקור האור משתנה',{s:13,f:C.muted});
  s+=T(80,110,'מה החומר',{s:14})+T(80,130,'מחזיר, ומה',{s:14})+T(80,150,'הוא בולע?',{s:14});
  return s;
},
cost(){
  let s=bg(C.cream);
  const nodes=[[540,'חומר גלם'],[400,'עיבוד'],[260,'הובלה'],[120,'מכירה']];
  const coins=[1,3,4,5];
  s+=`<path d="M500 220H160" stroke="${C.navy}" stroke-width="3" stroke-dasharray="8 8" class="draw" style="--len:340;--d:.3s"/>`;
  nodes.forEach(([x,l],i)=>{
    s+=`<g class="pop" style="--d:${i*.8}s"><circle cx="${x}" cy="220" r="40" fill="#fff" stroke="${C.navy}" stroke-width="3"/>${T(x,226,l,{s:14,w:500})}</g>`;
    for(let k=0;k<coins[i];k++) s+=`<g class="pop" style="--d:${i*.8+.4+k*.18}s"><ellipse cx="${x}" cy="${160-k*12}" rx="22" ry="7" fill="${C.gold}" stroke="${C.brown}" stroke-width="1.5"/></g>`;
  });
  ['אוכרה','אולטרמרין','ארגמן'].forEach((t,i)=>s+=`<g class="pop" style="--d:${i*.25}s"><rect x="${430-i*150}" y="30" width="110" height="34" rx="17" fill="${[C.sand,C.navy,C.coral][i]}"/>${T(485-i*150,52,t,{s:14,f:i==1?'#fff':C.navy,w:500})}</g>`);
  s+=`<g class="pop" style="--d:4s"><rect x="150" y="290" width="340" height="44" rx="12" fill="${C.beige}"/>${T(320,318,'מחיר: עבודה · זמינות · ביקוש · מעמד — לא רק ״נדיר״',{s:14})}</g>`;
  return s;
},
rgb(){
  let s=bg('#17303a');
  s+=`<g class="rgb" style="isolation:isolate">
  <circle cx="320" cy="170" r="88" fill="#ff2a1a" style="--fx:-190px;--fy:-20px;--tx:-46px;--ty:-26px"/>
  <circle cx="320" cy="170" r="88" fill="#1fe000" style="--fx:190px;--fy:-20px;--tx:46px;--ty:-26px"/>
  <circle cx="320" cy="170" r="88" fill="#2a3cff" style="--fx:0px;--fy:120px;--tx:0px;--ty:48px"/></g>`;
  s+=T(320,330,'אדום + ירוק → נתפס כצהוב · שלושתם יחד → נתפס כלבן',{f:'#fff',s:15});
  s+=T(40,40,'ערבוב חיבורי (RGB)',{a:'start',f:C.gold,s:18,w:700});
  return s;
},
print(){
  let s=bg(C.cream);
  // print (left)
  s+=`<rect x="40" y="60" width="250" height="230" rx="10" fill="#fff" stroke="${C.beige}" stroke-width="2"/>`;
  const ink=['#00a6d6','#d6007e','#f2d200','#1a1a1a'];
  for(let r=0;r<5;r++)for(let c=0;c<6;c++){const k=ink[(r+c)%4];const rr=4+((r*3+c*5)%7);s+=`<circle cx="${70+c*38}" cy="${92+r*42}" r="${rr}" fill="${k}" opacity=".85"><animate attributeName="r" values="${rr};${rr*1.35};${rr}" dur="${3+(c%3)}s" repeatCount="indefinite"/></circle>`}
  s+=T(165,320,'דפוס — נקודות דיו מחזירות אור (CMYK)',{s:13});
  // dark overlay
  s+=`<rect width="640" height="360" fill="#0f1f25" opacity="0"><animate attributeName="opacity" values="0;0;.86;.86;0" keyTimes="0;.35;.45;.85;1" dur="10s" repeatCount="indefinite"/></rect>`;
  // screen (right)
  s+=`<rect x="350" y="60" width="250" height="180" rx="12" fill="#111" stroke="${C.navy}" stroke-width="6"/><rect x="455" y="240" width="40" height="30" fill="${C.navy}"/><rect x="425" y="268" width="100" height="10" rx="5" fill="${C.navy}"/>`;
  const sub=['#ff2a1a','#1fe000','#2a3cff'];
  for(let r=0;r<4;r++)for(let c=0;c<6;c++)sub.forEach((col,k)=>{const x=368+c*37+k*10,y=76+r*40;const o=((r*7+c*3+k*5)%9)/9;s+=`<rect x="${x}" y="${y}" width="8" height="30" rx="2" fill="${col}" opacity="${.25+o*.7}"><animate attributeName="opacity" values="${.2+o*.6};${.9-o*.5};${.2+o*.6}" dur="${2+((c+k)%4)}s" repeatCount="indefinite"/></rect>`});
  s+=T(475,305,'מסך — תתי־פיקסלים פולטים אור (RGB)',{s:13});
  s+=`<g opacity="1">${T(320,36,'חדר מואר',{s:18,w:700})}<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.35;.45;.85;1" dur="10s" repeatCount="indefinite"/></g>`;
  s+=`<g opacity="0">${T(320,36,'חדר חשוך: מה עדיין נראה?',{s:18,w:700,f:C.gold})}<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.35;.45;.85;1" dur="10s" repeatCount="indefinite"/></g>`;
  return s;
},
eye(){
  let s=bg(C.cream);
  s+=`<circle cx="160" cy="170" r="92" fill="#fff" stroke="${C.navy}" stroke-width="4"/>`;
  s+=`<path d="M236 112A92 92 0 0 1 236 228" fill="none" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>`;
  s+=`<ellipse cx="76" cy="170" rx="12" ry="34" fill="${C.teal}" opacity=".5"/>`;
  s+=`<path d="M0 140L76 150L240 170M0 200L76 190L240 170" fill="none" stroke="${C.gold}" stroke-width="3" class="draw" style="--len:260;--dur:6s"/>`;
  s+=`<path id="nerve" d="M248 170Q290 200 280 280" fill="none" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/>`;
  for(let i=0;i<3;i++) s+=photon('M248 170Q290 200 280 280',C.coral,1.6,-i*.53,5);
  s+=`<g transform="translate(280,300)"><ellipse rx="44" ry="26" fill="${C.sand}"/>${T(0,6,'מוח',{s:14,w:700})}</g>`;
  s+=T(262,98,'רשתית',{s:13,f:C.coral,w:700});
  // graph
  s+=`<g id="graph"><line x1="350" y1="220" x2="620" y2="220" stroke="${C.navy}" stroke-width="2"/><line x1="350" y1="60" x2="350" y2="220" stroke="${C.navy}" stroke-width="2"/></g>`;
  s+=T(485,244,'אורך גל (ננומטר) · 400 → 700',{s:12,f:C.muted})+T(490,40,'רגישות שלושת סוגי המדוכים',{s:14,w:700});
  s+=`<g id="curves"></g><line id="scan" x1="350" x2="350" y1="60" y2="220" stroke="${C.navy}" stroke-width="2" stroke-dasharray="4 4"/><circle id="scanDot" cx="350" cy="52" r="8"/>`;
  s+=`<g id="bars"></g><text id="wl" x="620" y="350" direction="rtl" text-anchor="start" class="svgt" font-size="13"></text>`;
  return s;
},
studies(){
  let s=bg(C.cream);
  const st=[['א׳',14,'אין',9,'—'],['ב׳',240,'יש + הקצאה מקרית',.4,'—'],['ג׳',1100,'סקר',null,'מתאם חלש'],['ד׳',62,'יש',5,'⚠ גם תאורה שונה']];
  st.forEach(([l,n,cmp,d,warn],i)=>{const x=470-i*150;
    s+=`<g class="pop" style="--dur:12s;--d:${i*.4}s"><rect x="${x}" y="60" width="136" height="238" rx="16" fill="#fff" stroke="${C.beige}" stroke-width="2"/>`;
    s+=T(x+68,92,'מחקר '+l,{s:17,w:700});
    s+=T(x+68,118,'n = '+n.toLocaleString('en'),{s:13,extra:'direction="ltr"'});
    const dots=Math.min(24,Math.max(2,Math.round(Math.sqrt(n)*0.7)));
    for(let k=0;k<dots;k++) s+=`<circle cx="${x+22+(k%8)*13}" cy="${136+Math.floor(k/8)*13}" r="4" fill="${C.teal}"/>`;
    s+=T(x+68,196,'השוואה: '+cmp,{s:12});
    if(d!==null){const w=Math.max(3,d*11);s+=`<rect x="${x+118-w}" y="214" width="${w}" height="14" rx="4" fill="${C.coral}"/>`+T(x+68,250,'הבדל: '+d+' נק׳',{s:12})}
    else s+=T(x+68,226,'אין קבוצות להשוואה',{s:12});
    s+=T(x+68,280,warn,{s:12,f:C.brown,w:500})+`</g>`;
  });
  s+=`<g><circle r="26" fill="${C.gold}" fill-opacity=".25" stroke="${C.navy}" stroke-width="5"/><path d="M18 18L36 36" stroke="${C.navy}" stroke-width="8" stroke-linecap="round"/><animateMotion dur="10s" repeatCount="indefinite" path="M540 150L390 190L240 150L90 190L240 150L390 190Z"/></g>`;
  s+=`<rect x="220" y="14" width="200" height="30" rx="15" fill="${C.navy}"/>`+T(320,34,'נתונים בדויים לתרגול',{f:C.gold,s:14,w:700});
  s+=T(320,332,'מי נבדק? מה הושווה? מה נמדד? מה עוד השתנה?',{s:15});
  return s;
},
gray(){
  const g='#8C867D';
  let s=`<rect width="320" height="270" fill="${C.cream}"/><rect x="320" width="320" height="270" fill="${C.navy}"/><rect y="270" width="640" height="90" fill="${C.beige}"/>`;
  s+=`<rect x="125" y="95" width="70" height="70" fill="${g}" class="sq-slide" style="--sx:150px;--sy:185px"/>`;
  s+=`<rect x="445" y="95" width="70" height="70" fill="${g}" class="sq-slide" style="--sx:-90px;--sy:185px"/>`;
  s+=T(160,220,'על רקע בהיר')+T(480,220,'על רקע כהה',{f:'#fff'});
  s+=T(160,40,'אותו ריבוע בדיוק?',{s:18,w:700})+T(480,40,'נזיז ונבדוק.',{s:18,w:700,f:C.gold});
  s+=T(560,325,'על אותו רקע →',{s:14,w:500});
  return s;
},
names(){
  let s=bg(C.cream);
  s+=`<circle cx="320" cy="150" r="64" fill="${C.teal}"/><circle cx="320" cy="150" r="64" fill="none" stroke="${C.teal}" stroke-width="3" class="pulse"/>`;
  const face=(x,col,d)=>`<g class="bob" style="--d:${d}s"><circle cx="${x}" cy="230" r="52" fill="${col}"/><circle cx="${x-16}" cy="220" r="5" fill="${C.navy}"/><circle cx="${x+16}" cy="220" r="5" fill="${C.navy}"/><path d="M${x-16} 248Q${x} 260 ${x+16} 248" fill="none" stroke="${C.navy}" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=face(520,C.sand,0)+face(120,C.gold,-1.5);
  const bub=(x,t,d)=>`<g class="pop" style="--dur:6s;--d:${d}s"><rect x="${x-56}" y="88" width="112" height="50" rx="22" fill="#fff" stroke="${C.navy}" stroke-width="2.5"/><path d="M${x-8} 137L${x} 156L${x+10} 137" fill="#fff" stroke="${C.navy}" stroke-width="2.5"/><rect x="${x-10}" y="132" width="22" height="8" fill="#fff"/>${T(x,120,t,{s:20,w:700})}</g>`;
  s+=bub(520,'כחול!',0)+bub(120,'ירוק!',1.5);
  const ch=[['מדידה',470],['הגדרה ושפה',320],['חוויה פרטית',170]];
  ch.forEach(([t,x],i)=>s+=`<g class="pop" style="--dur:9s;--d:${2.5+i*.5}s"><rect x="${x-62}" y="306" width="124" height="34" rx="17" fill="${C.beige}"/>${T(x,328,t,{s:14,w:500})}</g>`);
  s+=T(320,40,'אותו גירוי — אותו שם? אותה חוויה?',{s:18,w:700});
  return s;
},
spectrum(){
  let s=bg(C.cream);
  const lv=[[100,'רמה גבוהה'],[170,''],[270,'רמה נמוכה']];
  lv.forEach(([y,t])=>s+=`<line x1="40" y1="${y}" x2="210" y2="${y}" stroke="${C.navy}" stroke-width="3"/>`+(t?T(125,y-8,t,{s:12,f:C.muted}):''));
  s+=`<circle cx="125" cy="270" r="11" fill="${C.coral}"><animate attributeName="cy" values="270;270;100;100;270;270" keyTimes="0;.15;.3;.5;.62;1" dur="6s" repeatCount="indefinite"/></circle>`;
  s+=`<path d="M140 270Q150 200 140 110" stroke="${C.gold}" stroke-width="3" fill="none" stroke-dasharray="5 5" opacity="0"><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;.15;.3;.35;1" dur="6s" repeatCount="indefinite"/></path>`;
  s+=T(165,195,'עירור',{s:13,f:C.brown,extra:'opacity=".9"'});
  s+=`<path d="M0 0q8-12 16 0t16 0 16 0 16 0" fill="none" stroke="${wl2rgb(656)}" stroke-width="4" opacity="0"><animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.55;.85;1" path="M190 190L300 170" calcMode="linear"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.55;.6;.82;.86;1" dur="6s" repeatCount="indefinite"/></path>`;
  s+=T(110,320,'פליטה: אור באורך גל מסוים',{s:13});
  const x=l=>310+(l-400)*(300/300);
  const bar=(y,label)=>`<rect x="310" y="${y}" width="300" height="56" rx="8" fill="#14262d"/>`+T(616,y+33,label,{a:'start',s:13,extra:'transform="translate(-300,0)"'});
  s+=bar(80,'')+bar(200,'');
  s+=T(460,70,'ייחוס: מימן',{s:14,w:700})+T(460,190,'״לא ידוע״',{s:14,w:700});
  [410,434,486,656].forEach((l,i)=>{s+=`<rect x="${x(l)-2}" y="80" width="4" height="56" fill="${wl2rgb(l)}"/>`;
    s+=`<rect x="${x(l)-2}" y="200" width="4" height="56" fill="${wl2rgb(l)}" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(.2+i*.15).toFixed(2)};${(.25+i*.15).toFixed(2)};.92;1" dur="8s" repeatCount="indefinite"/></rect>`});
  [400,500,600,700].forEach(l=>s+=`<line x1="${x(l)}" x2="${x(l)}" y1="262" y2="270" stroke="${C.navy}"/>`+T(x(l),286,l,{s:12,f:C.muted}));
  s+=T(460,320,'אורך גל (ננומטר) — מיקום הקווים, לא רק הצבע',{s:13});
  return s;
},
lamp(){
  let s=bg('#1d3640')+`<defs><radialGradient id="glow"><stop offset="0" stop-color="${C.gold}" stop-opacity=".75"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient></defs>`;
  for(let i=0;i<46;i++){const x=(i*137)%640,y=(i*59)%200+10;const left=x<320;s+=`<circle cx="${x}" cy="${y}" r="${1+(i%3)*.6}" fill="#fff" opacity="${left?.18:.85}" class="twinkle" style="--d:${-(i%7)*.4}s"/>`}
  s+=`<circle cx="160" cy="150" r="170" fill="url(#glow)" class="bob" style="--d:-1s"/>`;
  s+=`<rect x="0" y="300" width="640" height="60" fill="#2f2a26"/>`;
  s+=`<rect x="156" y="150" width="8" height="150" fill="${C.beige}"/><circle cx="160" cy="146" r="16" fill="${C.gold}"/>`;
  s+=`<polygon points="472,140 488,140 560,300 400,300" fill="${C.gold}" opacity=".35"/>`;
  s+=`<rect x="476" y="140" width="8" height="160" fill="${C.beige}"/><path d="M452 140H508L496 126H464Z" fill="${C.beige}"/><rect x="468" y="138" width="24" height="5" fill="${C.gold}"/>`;
  s+=`<g transform="translate(440,262)"><circle r="7" fill="${C.sand}"/><path d="M0 7V26M0 12L-9 20M0 12L9 20M0 26L-7 38M0 26L7 38" stroke="${C.sand}" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=T(160,335,'פולט לכל הכיוונים',{f:'#fff',s:14})+T(480,335,'מכוון לאן שצריך',{f:'#fff',s:14});
  s+=T(160,36,'זוהר שמיים · סנוור',{f:C.gold,s:16,w:700})+T(480,36,'פחות זוהר · יותר כוכבים',{f:C.gold,s:16,w:700});
  return s;
},
chroma(){
  let s=bg(C.cream);
  s+=`<rect x="240" y="140" width="160" height="200" rx="10" fill="#fff" fill-opacity=".5" stroke="${C.navy}" stroke-width="3"/>`;
  s+=`<rect x="243" y="292" width="154" height="45" fill="${C.teal}" opacity=".3"/>`;
  s+=`<rect x="290" y="40" width="60" height="285" fill="#fff" stroke="${C.beige}" stroke-width="2"/><rect x="282" y="34" width="76" height="10" rx="4" fill="${C.navy}"/>`;
  s+=`<rect x="291" width="58" fill="${C.teal}" opacity=".16"><animate attributeName="y" values="320;80;80" keyTimes="0;.8;1" dur="9s" repeatCount="indefinite"/><animate attributeName="height" values="5;245;245" keyTimes="0;.8;1" dur="9s" repeatCount="indefinite"/></rect>`;
  s+=`<line x1="291" x2="349" stroke="${C.teal}" stroke-width="2" stroke-dasharray="3 3"><animate attributeName="y1" values="320;80;80" keyTimes="0;.8;1" dur="9s" repeatCount="indefinite"/><animate attributeName="y2" values="320;80;80" keyTimes="0;.8;1" dur="9s" repeatCount="indefinite"/></line>`;
  s+=`<line x1="294" x2="346" y1="278" y2="278" stroke="#777" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  const bands=[[C.navy,262,1],[C.teal,210,.9],[C.coral,165,.85],[C.gold,118,.8]];
  bands.forEach(([col,ty,o],i)=>s+=`<ellipse cx="320" rx="${12+i}" ry="7" fill="${col}" opacity="${i?0:o}"><animate attributeName="cy" values="278;${ty};${ty}" keyTimes="0;.8;1" dur="9s" repeatCount="indefinite"/>${i?`<animate attributeName="opacity" values="0;${o};${o}" keyTimes="0;.25;1" dur="9s" repeatCount="indefinite"/>`:''}</ellipse>`);
  s+=`<circle cx="320" cy="278" r="8" fill="#222"><animate attributeName="opacity" values="1;0;0" keyTimes="0;.3;1" dur="9s" repeatCount="indefinite"/></circle>`;
  s+=T(420,90,'חזית הממס',{a:'start',s:14,w:500})+`<path d="M415 86H360" stroke="${C.navy}" stroke-width="1.5" marker-end="url(#ah2)"/>`;
  s+=T(420,283,'קו התחלה (עיפרון)',{a:'start',s:14})+`<path d="M415 279H360" stroke="${C.navy}" stroke-width="1.5" marker-end="url(#ah2)"/>`;
  s+=T(420,320,'מים (ממס)',{a:'start',s:14});
  s+=`<g transform="translate(40,120)"><rect width="180" height="96" rx="14" fill="${C.beige}"/>${T(90,30,'הרחבה',{s:13,f:C.brown,w:700})}${T(90,58,'Rf = מרחק הכתם',{s:14,extra:'direction="ltr"'})}${T(90,80,'÷ מרחק חזית הממס',{s:14})}</g>`;
  s+=`<defs><marker id="ah2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${C.navy}"/></marker></defs>`;
  return s;
},
model(){
  let s=bg(C.cream);
  const n=[[540,'מקור אור',C.gold],[400,'חומר',C.coral],[260,'עין',C.teal],[120,'מוח',C.sand]];
  s+=`<path d="M540 140H120" stroke="${C.navy}" stroke-width="3" stroke-dasharray="6 6"/>`;
  n.forEach(([x,l,c],i)=>{s+=`<circle cx="${x}" cy="140" r="46" fill="none" stroke="${c}" stroke-width="4" class="pulse" style="--d:${i*.75}s"/><circle cx="${x}" cy="140" r="42" fill="${c}"/>`+T(x,146,l,{s:16,w:700,f:i==2?'#fff':C.navy})});
  s+=photon('M540 140H120',C.navy,3,0,7);
  s+=T(320,60,'כשאנחנו רואות.ים צבע — איפה הוא נמצא?',{s:24,cls:'svgh'});
  [['טענה',C.navy],['ראיה',C.teal],['הנמקה',C.coral],['גבולות',C.brown]].forEach(([t,c],i)=>s+=`<g class="pop" style="--d:${1+i*.6}s"><rect x="${470-i*130}" y="250" width="110" height="44" rx="22" fill="${c}"/>${T(525-i*130,278,t,{f:'#fff',s:16,w:500})}</g>`);
  s+=T(320,330,'שתי ראיות משיעורים שונים + מגבלה רלוונטית',{s:14,f:C.muted});
  return s;
}
};

/* eye scene live graph */
let eyeRaf=null;
function initEye(svg){
  const X=l=>350+(l-400)*0.9, H=150, base=220;
  const cones=[['S',440,30,C.navy],['M',535,42,C.gold],['L',565,48,C.coral]];
  const g=svg.querySelector('#curves');let html='';
  cones.forEach(([n,pk,w,c])=>{let d='';for(let l=400;l<=700;l+=5){const v=Math.exp(-((l-pk)**2)/(2*w*w));d+=(l==400?'M':'L')+X(l).toFixed(1)+' '+(base-v*H).toFixed(1)}
    html+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="3.5" class="drawonce" style="--len:500"/>`+`<text x="${X(pk)}" y="${base-H-6}" text-anchor="middle" class="svgt" font-size="13" font-weight="700" fill="${c==C.gold?C.brown:c}">${n}</text>`});
  g.innerHTML=html;
  const bars=svg.querySelector('#bars');let bh='';
  cones.forEach(([n,,,c],i)=>{bh+=`<text x="356" y="${276+i*22}" class="svgt" font-size="12" text-anchor="end">${n}</text><rect x="362" y="${266+i*22}" height="14" rx="4" fill="${c}" width="0" data-bar="${i}"/>`});
  bars.innerHTML=bh;
  const scan=svg.querySelector('#scan'),dot=svg.querySelector('#scanDot'),wl=svg.querySelector('#wl'),rects=bars.querySelectorAll('rect');
  let t0=performance.now(),elapsed=0,last=t0;
  const loop=now=>{ if(window.APP_MOTION!==false) elapsed+=now-last; last=now;
    const ph=(elapsed/9000)%2, p=ph<1?ph:2-ph, l=410+p*280, x=X(l);
    scan.setAttribute('x1',x);scan.setAttribute('x2',x);dot.setAttribute('cx',x);dot.setAttribute('fill',wl2rgb(l));
    cones.forEach(([,pk,w],i)=>rects[i].setAttribute('width',(Math.exp(-((l-pk)**2)/(2*w*w))*230).toFixed(1)));
    wl.textContent=`אורך גל ≈ ${Math.round(l)} ננומטר · דפוס תגובה: S / M / L`;
    eyeRaf=requestAnimationFrame(loop)};
  eyeRaf=requestAnimationFrame(loop);
}


/* lesson-1 cover, redrawn in the style of the "why-sky-blue" explainer (animated by motion.js) */
SCENES.sky = () => `<rect width="640" height="360" fill="#FBF5ED"/>
  <g transform="translate(520 105) scale(.62)"><g id="heroSun">
    <g id="heroRays" stroke="#E9C46A" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M0-120q14 -20 0 -40"/><path d="M85-85q24-4 28-28"/><path d="M120 0q20 14 40 0"/><path d="M85 85q4 24 28 28"/>
      <path d="M0 120q-14 20 0 40"/><path d="M-85 85q-24 4-28 28"/><path d="M-120 0q-20-14-40 0"/><path d="M-85-85q-4-24-28-28"/></g>
    <circle r="78" fill="#E9C46A"/><circle cx="-22" cy="-8" r="6" fill="#5A2A0C"/><circle cx="22" cy="-8" r="6" fill="#5A2A0C"/>
    <path d="M-20 20q20 18 40 0" stroke="#5A2A0C" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>
  <g class="hero-dots">
    <circle cx="90" cy="70" r="8" fill="#4A8FD6"/><circle cx="160" cy="250" r="6" fill="#7B61C4"/><circle cx="430" cy="250" r="7" fill="#4A8FD6"/>
    <circle cx="300" cy="60" r="5" fill="#2A9D8F"/><circle cx="60" cy="190" r="5" fill="#E76F51"/><circle cx="360" cy="150" r="8" fill="#4A8FD6"/>
    <circle cx="230" cy="130" r="5" fill="#4A8FD6"/><circle cx="270" cy="210" r="5" fill="#7B61C4"/></g>
  <path id="heroRibbon" d="M-20 320 C 110 270, 190 350, 320 300 S 540 250, 660 310" stroke="#2A9D8F" stroke-width="7" fill="none" stroke-linecap="round"/>`;
