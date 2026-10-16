/* Theme changes must leave exact questions, drafts and pupil results untouched. */
window.verifyTheme=()=>{
  const root=document.documentElement,app=MATREE_APP,p=app.profile(),check=(c,m)=>{if(!c)throw Error(m);};
  const original=root.dataset.theme,stored=localStorage.getItem('matree.theme.v1'),before=JSON.stringify(p),profiles=localStorage.getItem('matree.profiles.v1');
  const button=document.querySelector('.topbar [data-theme-toggle]');
  try{
    check(['light','dark'].includes(original),'A valid theme is applied before the app renders');
    button.click();const next=original==='dark'?'light':'dark';
    check(root.dataset.theme===next&&localStorage.getItem('matree.theme.v1')===next,'Theme switch saves the chosen appearance separately');
    check(button.getAttribute('aria-label')==='Byt till '+(next==='dark'?'ljust':'mörkt')+' tema','Theme button names the action in Swedish');
    check(JSON.stringify(p)===before&&localStorage.getItem('matree.profiles.v1')===profiles,'Changing appearance does not write pupil data');
    const host=document.createElement('div');host.hidden=true;document.body.append(host);
    try{
      host.innerHTML=MATREE.renderQuestionVisual(MATREE.generateReviewed('rita-linje',0));
      for(const line of host.querySelectorAll('[data-series]')){
        const label=host.querySelector('[data-series-label="'+line.dataset.series+'"]');
        check(getComputedStyle(line).stroke===getComputedStyle(label).fill,'Graph labels retain the matching series colour in either theme');
      }
      if(next==='dark')check(getComputedStyle(host.querySelector('[data-series-label]')).stroke==='rgb(27, 40, 34)','Dark graph labels avoid white paint halos');
    }finally{host.remove();}
    button.focus();check(document.activeElement===button,'Theme control is keyboard focusable');
    button.click();check(root.dataset.theme===original,'Light and dark themes can both be restored');
    return 'System-aware theme, separate preference, accessible toggle and unchanged pupil data passed';
  }finally{
    if(stored===null)localStorage.removeItem('matree.theme.v1');else localStorage.setItem('matree.theme.v1',stored);
    window.dispatchEvent(new StorageEvent('storage',{key:'matree.theme.v1'}));
  }
};
window.showThemeStudent=(id='rita-linje',v=1)=>{
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const app=MATREE_APP,p=app.profile(),q=MATREE.generate(id,v),s=MATREE_ADAPTIVE.create({scope:'9',limit:30});
  s.pending={...q,nodeId:id,variant:v,reason:'Temakontroll.'};p.adaptive.active=s;app.save();app.render();
  document.querySelector('#adaptive-open').click();document.querySelector('#adaptive-resume').click();
  return {answer:q.answer,options:q.options};
};
window.verifyStudentTheme=()=>{
  const app=MATREE_APP,s=app.profile().adaptive.active,button=document.querySelector('#adaptive-dialog [data-theme-toggle]'),before=JSON.stringify(s),profiles=localStorage.getItem('matree.profiles.v1');
  if(!button)throw Error('Missing theme control in pupil mode');
  const original=document.documentElement.dataset.theme;button.click();
  if(document.documentElement.dataset.theme===original||JSON.stringify(s)!==before||localStorage.getItem('matree.profiles.v1')!==profiles)throw Error('Pupil theme change lost the exact question or draft');
  if(s.pending.options&&document.querySelector('#adaptive-answer').value!==s.draft.value)throw Error('Choice draft changed with theme');
  button.click();return 'Pupil theme switch preserves exact pending question, submitted answers and draft';
};
window.showThemeReport=()=>{
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const app=MATREE_APP,p=app.profile(),s=MATREE_ADAPTIVE.create({scope:'9',limit:30});
  s.id='theme-preview';
  const allowed=MATREE_ADAPTIVE.scopedPool(s).map(n=>n.id),ids=['koordinater','pythagoras-hyp','brak-forlanga','cirkeldiagram'].filter(id=>allowed.includes(id));
  for(const id of allowed)if(ids.length<4&&!ids.includes(id))ids.push(id);
  for(let i=0;i<12;i++){
    const id=ids[Math.floor(i/3)],q=MATREE.generate(id,i%3);
    s.pending={...q,nodeId:id,variant:i%3,reason:'Temakontroll.'};
    MATREE_ADAPTIVE.answer(s,i<3?String(q.answer):i<6?String(q.options?q.answer%q.options.length+1:q.answer+1):'',i>=6);
  }
  s.ended=new Date().toISOString();s.endReason='teacher';s.pending=null;
  p.adaptive=MATREE_ADAPTIVE.validate({active:null,sessions:[s],confirmations:[]});app.save();app.showProgress();
  document.querySelector('[data-adaptive-report="theme-preview"]').click();
};
