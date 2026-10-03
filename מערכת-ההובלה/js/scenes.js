/* מערכת ההובלה — סצנות פתיחה (SVG מונפש). נטען אחרי צבעים-ואור/js/scenes.js ומוסיף ל־SCENES. */
(function(){
const R='#E04B3A', P='#7A2433', N='#264653', G='#E9C46A', CR='#FBF5ED', BE='#E6D3B9', TE='#2A9D8F', SA='#F4A261';
const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" direction="rtl" text-anchor="${o.a||'middle'}" font-size="${o.s||15}" fill="${o.f||N}" ${o.w?`font-weight="${o.w}"`:''} font-family="Rubik,system-ui,sans-serif">${s}</text>`;
const dot=(path,c,dur,begin,r=6)=>`<circle r="${r}" fill="${c}"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/></circle>`;

/* lesson 1: from the nose to a toe */
SCENES.toe = () => {
  const route='M318 60 Q330 90 322 120 Q300 150 318 180 Q340 230 330 280 Q322 320 360 338';
  let s=`<rect width="640" height="360" fill="${CR}"/>
  <path d="M0 300 Q160 285 320 300 T640 300 V360 H0Z" fill="${BE}" opacity=".7"/>
  <!-- body -->
  <g fill="#fff" stroke="${N}" stroke-width="4" stroke-linejoin="round">
    <circle cx="318" cy="48" r="28"/>
    <path d="M276 92 Q318 76 360 92 L372 200 Q350 214 340 210 L344 330 Q346 346 372 346 L380 352 L326 352 L322 220 L314 220 L310 352 L262 352 L268 346 Q290 346 292 330 L296 210 Q286 214 264 200Z"/>
  </g>
  <!-- lungs -->
  <path d="M296 104 Q280 110 282 150 Q284 176 304 172 Q312 150 312 112Z" fill="${SA}" opacity=".85"/>
  <path d="M340 104 Q356 110 354 150 Q352 176 332 172 Q324 150 324 112Z" fill="${SA}" opacity=".85"/>
  <!-- heart -->
  <path d="M322 152 c-10 -10 -22 -2 -14 10 l14 14 l14 -14 c8 -12 -4 -20 -14 -10z" fill="${R}"><animateTransform attributeName="transform" type="scale" values="1;1.08;1" dur="1s" repeatCount="indefinite" additive="sum"/></path>
  <path d="${route}" fill="none" stroke="${N}" stroke-width="2.5" stroke-dasharray="3 8" opacity=".55"/>`;
  for(let i=0;i<6;i++) s+=dot(route,G,6,-i,5);
  s+=`<g transform="translate(372,340)"><circle r="20" fill="none" stroke="${R}" stroke-width="3"><animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite"/></circle></g>
  <g font-family="SKF Pogo,Rubik" font-size="54" fill="${R}"><text x="440" y="300">?</text></g>
  <g font-family="SKF Pogo,Rubik" font-size="34" fill="${TE}"><text x="170" y="120">?</text></g>
  ${t(180,60,'O₂',{s:22,w:700,f:N})}<path d="M196 62 Q250 40 290 52" stroke="${N}" stroke-width="2" fill="none" marker-end="url(#ah)"/>
  <defs><marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${N}"/></marker></defs>
  ${t(500,250,'תא בבוהן',{s:16,w:700})}<path d="M470 256 Q420 300 392 334" stroke="${N}" stroke-width="2" fill="none" marker-end="url(#ah)"/>`;
  return s;
};

/* lesson 2: a beating heart + ECG line */
SCENES.heart = () => {
  const ecg='M0 250 H200 L215 250 L225 220 L235 250 L250 250 L262 150 L276 310 L290 250 L320 250 L335 232 L350 250 H640';
  return `<rect width="640" height="360" fill="${CR}"/>
  <path d="${ecg}" fill="none" stroke="${TE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="1400">
    <animate attributeName="stroke-dashoffset" values="1400;0;0" keyTimes="0;.7;1" dur="2.4s" repeatCount="indefinite"/></path>
  <g transform="translate(470 130)"><g>
    <path d="M0 80 C-120 0 -90 -90 -24 -76 C-8 -72 0 -56 0 -44 C0 -56 8 -72 24 -76 C90 -90 120 0 0 80Z" fill="${R}"/>
    <path d="M-50 -40 Q-60 -10 -40 20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/>
    <animateTransform attributeName="transform" type="scale" values="1;1.1;.98;1" keyTimes="0;.15;.3;1" dur="0.9s" repeatCount="indefinite"/></g></g>
  <g font-family="SKF Pogo,Rubik" fill="${N}"><text x="90" y="110" font-size="40" direction="rtl" text-anchor="middle">לַב־דַּב</text></g>
  ${t(120,150,'פעימה ≈ 70 פעמים בדקה במנוחה',{s:15})}
  <g transform="translate(110,300)">${[0,1,2,3].map(i=>`<circle cx="${i*40}" cy="0" r="8" fill="${i%2?P:R}"><animate attributeName="cy" values="0;-14;0" dur="1.2s" begin="${-i*.3}s" repeatCount="indefinite"/></circle>`).join('')}</g>`;
};
})();
