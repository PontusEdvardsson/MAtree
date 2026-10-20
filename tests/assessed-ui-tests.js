window.verifyAssessedUI=async()=>{
  const $=s=>document.querySelector(s),M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,check=(c,m)=>{if(!c)throw Error(m);};
  const ordered=v=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])])):v;
  const same=(a,b)=>JSON.stringify(ordered(a))===JSON.stringify(ordered(b));
  $('[data-map-mode="details"]').click();
  for(const id of M.retiredSkillIds){
    $('#search').value=M.visibleNodes.find(n=>n.id===id).title;$('#search').dispatchEvent(new Event('input'));
    check(!document.querySelector('.skill-node'),'Retired title not found in map search');
  }
  $('#reset-filters').click();
  check(!document.querySelector('[data-group="digital-tools"]'),'Digital group is absent');
  const legacy=A.create({scope:'8',category:'problem'});delete legacy.catalogue;delete legacy.coveragePolicy;
  legacy.pending={...M.generateReviewed('kalkylblad',0),nodeId:'kalkylblad',variant:0,reason:'Äldre sparad fråga.'};legacy.draft=M.makeDraft(legacy.pending,'1,');
  const questions=[0,1,2].map(v=>M.generateReviewed('kod-variabel',v));
  const quiz={nodeId:'kod-variabel',questions,index:0,answers:[],responses:[],draft:M.makeDraft(questions[0],'2')};
  const historicalItems=[0,1,2].map(v=>{const q=M.generateReviewed('kalkylblad',v);return {...q,response:String(q.answer),correct:true};});
  const fixture={...app.profile(),id:'retired-test',name:'Äldre testprofil',results:{kalkylblad:{history:[{score:3,date:'2026-10-19T10:00:00.000Z',items:historicalItems}] }},quiz,adaptive:{active:legacy,sessions:[],confirmations:[]}};
  const payload={version:1,activeId:fixture.id,profiles:[fixture]};
  const transfer=new DataTransfer();transfer.items.add(new File([JSON.stringify(payload)],'old-profile.json',{type:'application/json'}));
  $('#profile-button').click();$('#import-file').files=transfer.files;$('#import-file').dispatchEvent(new Event('change',{bubbles:true}));
  await new Promise(r=>setTimeout(r,100));
  check($('#profile-message').textContent.includes('importerade'),'Old digital evidence imports successfully: '+$('#profile-message').textContent);
  const imported=app.profile();
  check(same(imported.quiz,quiz),'Manual paused questions and draft import unchanged');
  check(same(imported.adaptive.active.pending,legacy.pending)&&same(imported.adaptive.active.draft,legacy.draft),'Automatic retired question and draft import unchanged');
  check(imported.results.kalkylblad.history[0].score===3,'Retired historical result is retained');
  const original=URL.createObjectURL;let backup;
  try{URL.createObjectURL=blob=>{backup=blob;return original(blob);};$('#export-button').click();}finally{URL.createObjectURL=original;}
  const exported=JSON.parse(await backup.text()).profiles.find(p=>p.name===imported.name);
  check(same(exported.quiz,quiz)&&same(exported.adaptive.active.pending,legacy.pending),'Export retains exact retired drafts and questions');
  $('[data-close="profiles-dialog"]').click();$('#profile-button').click();$('#new-profile').value='Nytt områdespass';$('#profile-form').requestSubmit();
  $('#adaptive-open').click();for(const [s,value] of [['#adaptive-start','8'],['#adaptive-category','samband'],['#adaptive-limit','30']]){$(s).value=value;$(s).dispatchEvent(new Event('change',{bubbles:true}));}
  $('#adaptive-setup').requestSubmit();let answers=0;while($('#adaptive-skip')){$('#adaptive-skip').click();if(++answers>30)throw Error('Pass exceeded limit');}
  const session=app.profile().adaptive.sessions.at(-1),pool=A.scopedPool(session),rows=A.summary(session);
  check(session.coveragePolicy==='exhaustive'&&session.catalogue==='assessed'&&answers===pool.length*2&&rows.length===pool.length,'Visible all-skip route reaches every selected skill');
  check(session.endReason==='all-tested'&&rows.every(r=>r.state==='followup'),'No early stop after failed entry skills');
  $('#adaptive-teacher-report').click();check($('.report-end').textContent.includes('Alla delmoment'),'Report accurately states exhausted selection');
  return {retiredSkills:4,activeSkills:M.detailNodes.length,importExport:'exact old questions and drafts retained',scope:session.scope,area:session.category,answers,skills:rows.length,endReason:session.endReason};
};
