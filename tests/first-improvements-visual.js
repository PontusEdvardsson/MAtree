/* Rendered color spot checks, not a complete accessibility audit. */
window.firstImprovementContrast=(selectors,state)=>{
  const rgba=color=>{const c=document.createElement('canvas').getContext('2d');c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);};
  const blend=(f,b)=>f.slice(0,3).map((v,i)=>v*f[3]+b[i]*(1-f[3]));
  const lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  const rows=selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(e=>e.getClientRects().length).map(e=>{
    const ancestors=[];for(let p=e;p;p=p.parentElement)ancestors.unshift(p);
    let bg=[255,255,255];for(const a of ancestors)bg=blend(rgba(getComputedStyle(a).backgroundColor),bg);
    const s=getComputedStyle(e),fg=blend(rgba(s.color),bg),a=lum(fg),b=lum(bg),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    if(!e.disabled&&contrast<4.5)throw Error(selector+' text contrast '+contrast);
    let placeholderContrast=null;
    if(e.matches('input[placeholder]')){const p=lum(blend(rgba(getComputedStyle(e,'::placeholder').color),bg));placeholderContrast=(Math.max(p,b)+.05)/(Math.min(p,b)+.05);if(placeholderContrast<4.5)throw Error('Placeholder contrast '+placeholderContrast);}
    return {selector,text:e.innerText.trim().slice(0,100),color:s.color,background:bg,contrast,placeholderContrast,disabled:!!e.disabled,opacity:s.opacity,focused:document.activeElement===e,focusVisible:e.matches(':focus-visible'),outline:s.outline,border:s.borderColor};
  }));
  if(!rows.length)throw Error('No visible text measured');
  return {theme:document.documentElement.dataset.theme,state,rows,note:'Solid CSS color spot checks; no full WCAG claim. Disabled controls recorded, not thresholded.'};
};
window.firstImprovementTheme=theme=>{
  const before=JSON.stringify(MATREE_APP.profile());
  if(document.documentElement.dataset.theme!==theme)document.querySelector('.topbar [data-theme-toggle]').click();
  if(JSON.stringify(MATREE_APP.profile())!==before)throw Error('Theme changed pupil evidence');
};
window.firstImprovementInput=()=>{
  MATREE_APP.openSkill('stora-tal');MATREE_APP.startQuiz('stora-tal');
  const input=document.querySelector('#answer');input.value=String(MATREE_APP.profile().quiz.questions[0].answer).replace(/\B(?=(\d{3})+(?!\d))/g,' ');input.dispatchEvent(new Event('input',{bubbles:true}));
  document.querySelector('#answer-form').requestSubmit();
  if(MATREE_APP.profile().quiz.answers.length||!document.querySelector('#answer-error').textContent.includes('utan mellanslag'))throw Error('Invalid spacing needs explicit non-graded guidance');
  input.focus();return firstImprovementContrast(['.answer-label','#answer-help','#answer'],'input focus and rejected spacing');
};
window.firstImprovementChoice=()=>{
  MATREE_APP.endManualControl();MATREE_APP.openSkill('brak-del-hel');MATREE_APP.startQuiz('brak-del-hel');
  const q=MATREE_APP.profile().quiz.questions[0];document.querySelector('#answer').value=String(q.answer);document.querySelector('#answer-form').requestSubmit();document.querySelector('#next-question').click();
  if(!document.querySelector('.choice-button')||!document.querySelector('.choice-submit').disabled)throw Error('Expected unselected denominator choices');
  return firstImprovementContrast(['.choice-button','.choice-submit'],'unselected, submit disabled');
};
