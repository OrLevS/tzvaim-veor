/* מערכת ההובלה — תרשימי שחור־לבן ואייקונים ליומן (נרשמים ל־journal.js).
   לפי worksheet-design.md: תוויות בתוך התרשים באותיות (א–ד), לא במספרים — כדי לא להתנגש במספרי המשימות. */
window.JOURNAL_ICONS = {
  in:  '<rect x="15" y="6" width="13" height="20" rx="3"/><path d="M2 16h10 M8 12l4 4-4 4"/>',
  out: '<rect x="4" y="6" width="13" height="20" rx="3"/><path d="M19 16h10 M25 12l4 4-4 4"/>',
  artery: '<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="8.5"/><circle cx="16" cy="16" r="4"/>',
  vein: '<path d="M4 16q0-10 12-10t12 10q0 10-12 10T4 16z"/><path d="M12 10q4 6 0 12 M20 10q-4 6 0 12"/>',
  cap: '<circle cx="16" cy="16" r="6"/>',
  heart: '<path d="M16 27C4 19 4 9 10 7c3-1 5 1 6 3 1-2 3-4 6-3 6 2 6 12-6 20z"/>'
};
window.JOURNAL_DIAGRAMS = {
  vessels3: () => `<figure class="dg">
   <figcaption class="dg-title">חתכים של כלי דם (לא בקנה מידה)</figcaption>
   <svg viewBox="0 0 520 175" role="img" aria-label="שלושה חתכים של כלי דם, מסומנים א׳, ב׳ ו־ג׳">
    <g transform="translate(440,75)"><circle r="20" class="ln" style="stroke-width:2"/><ellipse rx="13" ry="8" class="dot"/><text y="88" class="lbl">א׳</text></g>
    <g transform="translate(260,75)"><path d="M-64 -14 Q-56 -58 0 -54 Q62 -52 64 -8 Q66 42 8 50 Q-60 56 -64 -14Z" class="ln" style="stroke-width:6"/><path d="M-24 -44 Q0 -8 -2 24 M24 -42 Q4 -8 2 24" class="ln"/><text y="88" class="lbl">ב׳</text></g>
    <g transform="translate(90,75)"><circle r="58" class="ln" style="stroke-width:16"/><circle r="24" class="ln"/><text y="88" class="lbl">ג׳</text></g>
   </svg></figure>`,
  heart4: () => `<figure class="dg">
   <figcaption class="dg-title">הלב (תרשים מפושט) — צד שמאל של הגוף מופיע מימין לנו</figcaption>
   <svg viewBox="0 0 520 250" role="img" aria-label="תרשים לב עם ארבעה חללים מסומנים א׳ עד ד׳, ריאות למעלה וגוף למטה">
    <rect x="190" y="4" width="140" height="34" rx="16" class="ln fillw"/><text x="260" y="27" class="lbl">ריאות</text>
    <rect x="190" y="212" width="140" height="34" rx="16" class="ln fillw"/><text x="260" y="235" class="lbl">הגוף</text>
    <rect x="160" y="54" width="94" height="64" rx="16" class="ln fillw"/><text x="207" y="93" class="lbl">א׳</text>
    <rect x="266" y="54" width="94" height="64" rx="16" class="ln fillw"/><text x="313" y="93" class="lbl">ג׳</text>
    <rect x="160" y="124" width="94" height="76" rx="20" class="ln fillw"/><text x="207" y="168" class="lbl">ב׳</text>
    <rect x="266" y="124" width="94" height="76" rx="20" class="ln fillw" style="stroke-width:9"/><text x="313" y="168" class="lbl">ד׳</text>
    <path d="M160 160 Q110 100 200 38" class="ln" marker-end="url(#ja)"/><path d="M320 38 Q410 100 360 86" class="ln" marker-end="url(#ja)"/>
    <path d="M360 170 Q420 200 330 222" class="ln" marker-end="url(#ja)"/><path d="M190 225 Q100 140 158 86" class="ln" marker-end="url(#ja)"/>
    <defs><marker id="ja" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="dot"/></marker></defs>
    <text x="62" y="130" class="lbl">צד ימין</text><text x="62" y="150" class="lbl">של הגוף</text>
    <text x="458" y="130" class="lbl">צד שמאל</text><text x="458" y="150" class="lbl">של הגוף</text>
   </svg></figure>`
};
