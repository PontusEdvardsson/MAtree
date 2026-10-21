/* Technical UI/regression checks with isolated fictional profiles, not blind pupil tests. */
window.verifyFirstImprovements=async()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,$=s=>document.querySelector(s);
  const check=(v,m)=>{if(!v)throw Error(m);},copy=v=>JSON.parse(JSON.stringify(v));
  const recommendation=()=>[...document.querySelectorAll('#progress-view .progress-panel')].find(e=>e.querySelector('.eyebrow')?.textContent==='FÖRSLAG PÅ NÄSTA KONTROLL');
  const ordered=v=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])])):v;
  const same=(a,b)=>JSON.stringify(ordered(a))===JSON.stringify(ordered(b));
  const before=await fetch('tests/first-improvements-before.json').then(r=>r.json());
  for(const c of before.cases){
    const original=Math.random;let state=c.seed,next;
    try{Math.random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};next=M.generate(c.id,c.variant);}finally{Math.random=original;}
    const previous=copy(c.question),current=copy(next);
    if(c.variant===0&&['brak-heltal-mult','brak-multiplikation'].includes(c.id)){
      check(!/division|invers/.test(next.explanation),'Multiplication must describe multiplication');
      delete previous.explanation;delete current.explanation;
    }
    if(c.id==='brak-del-hel'&&c.variant===1){
      check(!next.prompt.includes('Skriv den färgade andelen'),'Only denominator is requested');
      delete previous.prompt;delete current.prompt;
    }
    check(same(previous,current),'Unintended generator change: '+c.id+':'+c.variant);
  }
  const fresh=name=>{
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    $('#profile-button').click();$('#new-profile').value=name;$('#profile-form').requestSubmit();
  };
  fresh('Fiktiv förbättringskontroll');
  $('#adaptive-open').click();
  const setup=(scope,category,limit)=>{
    for(const [id,value] of [['adaptive-start',scope],['adaptive-category',category],['adaptive-limit',limit]]){
      $('#'+id).value=value;$('#'+id).dispatchEvent(new Event('change',{bubbles:true}));
    }
  };
  setup('7','','30');
  check($('#adaptive-session-help').textContent.includes('79 delmoment')&&$('#adaptive-session-help').textContent.includes('30 svar')&&$('#adaptive-session-help').textContent.includes('oprövade'),'Large selection describes limited coverage');
  setup('1-3','brak','30');check($('#adaptive-session-help').textContent.includes('1 delmoment'),'Small selection count');
  setup('9','sannolikhet','30');check($('#adaptive-setup > button').disabled&&!$('#adaptive-session-help').textContent,'Empty core selection does not promise coverage');
  setup('9','sannolikhet','all');check(!$('#adaptive-setup > button').disabled&&$('#adaptive-session-help').hidden&&!$('#adaptive-estimate').hidden,'All-mode includes extensions with separate estimate');
  $('#adaptive-dialog').close();
  const p=app.profile(),group=M.skillGroups.find(g=>g.id==='right-triangles');
  $('[data-map-mode="groups"]').click();
  check($('[data-group="right-triangles"]').textContent.includes('Inte prövat'),'Untried group is explicit');
  const record=(id,score)=>({score,total:3,date:'2026-10-21T08:00:00.000Z',items:[0,1,2].map(v=>({...M.generate(id,v),response:'0',correct:v<score}))});
  p.results[group.members[0]]={history:[record(group.members[0],3)]};
  p.results[group.members[1]]={history:[record(group.members[1],1)]};app.render();
  check($('[data-group="right-triangles"] .node-status').textContent.includes('1 visat · 2/5 prövade'),'Mixed group separates shown and tested');
  let filteredGroup=null;
  for(const scope of ['7','8','9']){
    $('[data-stage="'+scope+'"]').click();
    for(const g of M.skillGroups){
      const members=g.members.filter(id=>M.matchesYearView(M.detailNodes.find(n=>n.id===id),scope));
      const card=$('[data-group="'+g.id+'"] .node-status');
      if(card&&members.length>1&&members.length<g.members.length){
        check(card.textContent.includes('/'+members.length+' prövade')||card.textContent.includes(members.length+' delmoment'),'Group denominator uses actual filtered members');
        filteredGroup={id:g.id,scope,count:members.length,total:g.members.length};break;
      }
    }
    if(filteredGroup)break;
  }
  check(filteredGroup,'A group with a smaller year-filtered membership was verified');
  $('#reset-filters').click();

  // Complete a real manual UI round; grading data here drives a technical test only.
  fresh('Fiktiv nästa kontroll');app.openSkill('brak-del-hel');app.startQuiz('brak-del-hel');
  for(let i=0;i<3;i++){
    const q=app.profile().quiz.questions[i];$('#answer').value=String(q.answer);
    $('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));$('#next-question').click();
  }
  check($('.next-control').dataset.nextKind==='breadth'&&$('.next-control h3').textContent.includes('Ekvation'),'General next check names the target');
  const broadReason=$('.next-control-reason').textContent;
  const broadId=$('#skill-content .dialog-actions .primary-button').dataset.open;
  $('#skill-dialog').close();app.showProgress();
  check(recommendation().querySelector('p').textContent===broadReason,'Result and overview share recommendation reason');
  const followProfile=app.profile();followProfile.results={};
  const dependent=M.detailNodes.find(n=>n.level==='core'&&n.deps.length);
  followProfile.results[dependent.id]={history:[record(dependent.id,1)]};app.render();app.showProgress();
  check(recommendation().querySelector('p').textContent.includes(dependent.title)&&recommendation().querySelector('p').textContent.includes('avgör inte orsaken'),'Targeted prerequisite recommendation is not diagnosis');

  // Import EXACT old questions, options, history and both kinds of paused drafts.
  const old=id=>copy(before.cases.find(c=>c.id===id&&c.variant===0).question);
  const oldQs=before.cases.filter(c=>c.id==='brak-del-hel').map(c=>copy(c.question));
  const quiz={nodeId:'brak-del-hel',questions:oldQs,index:1,answers:[true],responses:[String(oldQs[0].answer)],draft:M.makeDraft(oldQs[1],oldQs[1].options?'2':'5')};
  const active=A.create({scope:'8',category:'brak'});
  active.pending={...old('brak-multiplikation'),nodeId:'brak-multiplikation',variant:0,reason:'Sparad före texträttning.'};active.draft=M.makeDraft(active.pending,'2/');
  const history={score:3,total:3,date:'2026-10-20T08:00:00.000Z',items:[0,1,2].map(v=>({...copy(before.cases.find(c=>c.id==='brak-multiplikation'&&c.variant===v).question),response:'1',correct:true}))};
  const fixture={...copy(app.profile()),id:'before-improvements',name:'Fiktivt äldre underlag',results:{'brak-multiplikation':{history:[history]}},quiz,adaptive:{active,sessions:[],confirmations:[]}};
  const transfer=new DataTransfer();transfer.items.add(new File([JSON.stringify({version:1,activeId:fixture.id,profiles:[fixture]})],'old.json',{type:'application/json'}));
  $('#profile-button').click();$('#import-file').files=transfer.files;$('#import-file').dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,80));
  check($('#profile-message').textContent.includes('importerade'),'Old fixture imported');
  const imported=app.profile();
  check(same(imported.quiz,quiz)&&same(imported.adaptive.active.pending,active.pending)&&same(imported.results['brak-multiplikation'].history[0],history),'Old questions/history import unchanged');
  $('[data-close="profiles-dialog"]').click();app.showProgress();$('[data-manual-record="0"]').click();
  check($('#skill-content').textContent.includes(history.items[0].explanation),'Historical report shows its stored explanation');$('#skill-dialog').close();
  $('#adaptive-open').click();$('#adaptive-resume').click();
  check($('#adaptive-answer').value==='2/'&&same(imported.adaptive.active.pending,active.pending),'Old auto question and unfinished fraction restored');
  $('#adaptive-pause').click();$('#adaptive-close').click();
  app.openSkill('brak-del-hel');
  check($('#manual-question-title').textContent===M.questionStem(oldQs[1])&&$('#answer').value===quiz.draft.value,'Old denominator wording/options/draft restored');
  $('[data-pause-manual]').click();
  let blob;const createURL=URL.createObjectURL;
  try{URL.createObjectURL=value=>{blob=value;return createURL(value);};$('#profile-button').click();$('#export-button').click();}finally{URL.createObjectURL=createURL;}
  const exported=JSON.parse(await blob.text()).profiles.find(p=>p.id===imported.id);
  check(same(exported.quiz,quiz)&&same(exported.adaptive.active.pending,active.pending)&&same(exported.adaptive.active.draft,active.draft)&&same(exported.results,fixture.results),'Export retains exact old evidence and drafts');
  $('[data-close="profiles-dialog"]').click();
  check(Number.isNaN(M.parseAnswer('13 089 000'))&&Number.isNaN(M.parseAnswer('1 2'))&&M.questionAnswerHint({answerKind:'integer',prompt:''}).includes('utan mellanslag'),'Format guidance changed without changing parser');
  return {baselineQuestions:before.cases.length,coverage:'large/small/empty/all',groups:'current selection, mixed evidence',filteredGroup,nextCheck:broadId,legacy:'history, report, both paused drafts and export exact',parser:'unchanged'};
};
