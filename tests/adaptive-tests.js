window.verifyAdaptive = async () => {
  const A=window.MATREE_ADAPTIVE, M=window.MATREE, $=s=>document.querySelector(s);
  const check=(condition,message)=>{if(!condition)throw Error(message);};
  const state=()=>JSON.parse(localStorage.getItem('matree.profiles.v1'));
  const profile=()=>state().profiles.find(p=>p.id===state().activeId);
  const submit=id=>$(id).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  const click=id=>$(id).click();
  const reply=wrong=> {const q=profile().adaptive.active.pending;$('#adaptive-answer').value=String(wrong?(q.options?q.answer%q.options.length+1:q.answer+1000):q.answer);submit('#adaptive-answer-form');};
  const random=Math.random;Math.random=()=>0;
  const expected={
    'f-count':[3,6,4],'f-compare':[4,2,4],'f-line':[4,6,8],'f-split':[2,2,2],'f-ten':[8,8,8],'f-place':[22,2,200],
    'f-add-small':[4,4,4],'f-sub-small':[2,2,2],'f-add-place':[55,55,55],'f-sub-place':[27,27,27],'f-double':[4,2,4],
    'f-groups':[4,4,4],'f-table':[4,4,4],'f-sharing':[2,2,2],'f-inverse':[2,2,2],'f-remainder':[1,1,1],'f-equality':[3,2,1],
    'f-pattern':[8,8,8],'f-half':[2,4,2],'f-fraction-count':[2,2,2],'f-fraction-line':[.5,.25,1/3],'f-fraction-equal':[2,2,2],
    'f-fraction-add':[.75,.6,.375],'f-decimal':[.2,.02,.2],'f-decimal-compare':[.2,.2,.2],'f-decimal-add':[.4,.4,.4],
    'f-percent':[2,2,2],'f-round':[20,20,20],'f-order':[6,6,6],'f-equation':[2,4,2],'f-negative':[-2,2,-2],
    'f-shapes':[3,4,5],'f-bodies':[6,8,12],'f-length':[200,2,200],'f-mass':[2000,2,2000],'f-volume':[20,2,20],
    'f-clock':[2,15,2],'f-time':[120,90,120],'f-perimeter':[8,8,8],'f-area':[4,4,4],'f-angle':[90,180,90],
    'f-scale':[4,2,4],'f-symmetry':[4,2,3],'f-readtable':[2,2,4],'f-frequency':[3,2,3],'f-mean':[4,4,4],
    'f-median':[4,2,4],'f-chance':[1,0,6],'f-probability':[.5,.25,1/3],'f-combinations':[4,4,4],
    'f-coordinate':[2,2,2],'f-proportion':[4,2,4],'f-word-add':[4,2,4],'f-word-mult':[4,2,4],'f-reasonable':[40,40,40]
  };
  try{for(const [id,answers]of Object.entries(expected))answers.forEach((answer,v)=>check(Math.abs(M.unreviewedGenerate(id,v).answer-answer)<1e-9,`Foundation legacy math ${id}:${v}`));}finally{Math.random=random;}
  check(Object.keys(expected).length===M.foundationIds.size,'Every new foundation has independently calculated answers');
  check(M.nodes.filter(n=>n.grade===0).every(n=>n.deps.every(id=>M.nodes.find(d=>d.id===id).grade===0)),'Earlier foundations never depend on a higher-school skill');
  const shared=M.nodes.find(n=>n.id==='brak-forlanga');
  check(['4-6','7','8','9'].every(v=>shared.yearViews.includes(v))&&shared.learnedAt==='4-6','Fraction extension has one skill with multiple year memberships');
  check(M.nodes.every(n=>n.yearViews.includes(n.learnedAt)&&new Set(n.yearViews).size===n.yearViews.length),'Year memberships include initial learning without duplicate tags');
  const initialProfile=window.MATREE_APP.profile(),previousShared=initialProfile.results[shared.id];
  const sharedQuestions=[0,1,2].map(v=>{const q=M.generate(shared.id,v);return {...q,response:String(q.answer),correct:true};});
  initialProfile.results[shared.id]={history:[{score:3,date:new Date().toISOString(),items:sharedQuestions}]};window.MATREE_APP.save();window.MATREE_APP.render();
  click('[data-stage="0"]');click('[data-foundation="2"]');check($('.skill-node[data-node="brak-forlanga"]').classList.contains('mastered'),'Shared result is shown in foundations');
  click('[data-stage="7"]');check($('.skill-node[data-node="brak-forlanga"]').classList.contains('mastered'),'The same result is shown in year 7');
  check(!$('.skill-node[data-node="brak-add-olika"]').classList.contains('mastered'),'Sharing does not approve a different, more advanced skill');
  check(document.querySelectorAll('.skill-node[data-node="brak-forlanga"]').length===1,'Shared skill appears once in a year view');
  click('#reset-filters');check(document.querySelectorAll('.skill-node').length===M.detailNodes.length,'All-years view counts each shared skill once');
  check(A.scopedPool({scope:'7'}).some(n=>n.id===shared.id),'Adaptive year 7 includes the same shared skill');
  const reused=A.create({scope:'7',known:[shared.id],limit:60});
  while(reused.pending){check(reused.pending.nodeId!==shared.id,'A passed shared skill is not tested again');A.answer(reused,String(reused.pending.answer));}
  check(A.validate({active:null,sessions:[reused],confirmations:[]}).sessions[0].known.includes(shared.id),'Previously shown shared evidence survives export/import');
  const alreadyShown=A.create({scope:'7',known:A.scopedPool({scope:'7'}).map(n=>n.id)});
  check(alreadyShown.ended&&!alreadyShown.pending&&alreadyShown.items.length===0,'An already-covered selection finishes without invented questions');
  if(previousShared)initialProfile.results[shared.id]=previousShared;else delete initialProfile.results[shared.id];window.MATREE_APP.save();window.MATREE_APP.render();
  for(const scope of ['1-3','4-6','7','8','9'])for(const wrong of [false,true]) {
    const s=A.create({scope,start:['1-3','4-6'].includes(scope)?'basic':'higher',limit:60});
    const allowed=new Set(A.scopedPool(s).map(n=>n.id));
    check(allowed.size>0&&s.pending,`Scope ${scope} has entry questions without testing earlier grades`);
    let count=0;
    while(s.pending){
      check(allowed.has(s.pending.nodeId),`Scope ${scope} never leaves its selected grade`);
      const q=s.pending,value=wrong?(q.options?q.answer%q.options.length+1:q.answer+1000):q.answer;
      // Tiny year-nine prefix values must use the decimal notation accepted by the input.
      check(A.answer(s,value.toLocaleString('sv-SE',{useGrouping:false,maximumSignificantDigits:17})),`Scope ${scope} accepts the test response for ${q.nodeId}`);
      check(++count<=60,`Scope ${scope} is bounded`);
    }
    const imported=A.validate({active:null,sessions:[s],confirmations:[]});
    check(imported.sessions[0].scope===scope&&s.items.every(i=>allowed.has(i.nodeId)),`Scope ${scope} persists on export/import`);
  }
  const oldPass=A.create({start:'higher'});delete oldPass.scope;
  check(A.validate({active:oldPass,sessions:[],confirmations:[]}).active.scope===null,'Older mixed paused passes remain compatible');
  const wrongScope=A.create({scope:'1-3'});wrongScope.scope='9';let scopeRejected=false;
  try{A.validate({active:wrongScope,sessions:[],confirmations:[]});}catch{scopeRejected=true;}
  check(scopeRejected,'Import rejects questions outside their declared grade');
  for(const mode of ['all-right','all-wrong','mixed']) {
    const s=A.create({start:'higher',limit:60});let count=0;
    while(s.pending){const wrong=mode==='all-wrong'||mode==='mixed'&&count%3===1;const before=s.pending;A.answer(s,String(wrong?(before.options?before.answer%before.options.length+1:before.answer+1000):before.answer));count++;check(count<=60,'Adaptive run terminates within selected limit');check(!s.pending||M.nodes.find(n=>n.id===s.pending.nodeId).level==='core','Adaptive run only selects core skills');}
    check(s.ended&&s.items.length>0,'Runs end with evidence');
    A.validate({active:null,sessions:[s],confirmations:[]});
    check(A.summary(s).every(r=>r.total<=4),'No repeated failing loop beyond four questions per skill');
    check(mode!=='all-wrong'||A.summary(s).every(r=>r.state!=='shown'),'Wrong answers never mark a skill shown');
  }
  const mixed=A.create();const id=mixed.pending.nodeId;
  A.answer(mixed,String(mixed.pending.answer));A.answer(mixed,String(mixed.pending.answer));A.answer(mixed,String(mixed.pending.options?mixed.pending.answer%mixed.pending.options.length+1:mixed.pending.answer+1000));
  check(mixed.pending.nodeId===id&&A.evidence(mixed,id).state==='partial','Two right and one wrong triggers confirmation question');
  check(mixed.pending.variant===2,'Confirmation returns to the failed aspect of the skill');
  A.answer(mixed,String(mixed.pending.answer));check(A.evidence(mixed,id).state==='shown','Third right across four items gives direct evidence');
  const fail=A.create({start:'higher'}), failing=fail.pending.nodeId;
  A.answer(fail,String(fail.pending.options?fail.pending.answer%fail.pending.options.length+1:fail.pending.answer+1000));check(fail.pending.nodeId===failing,'Single error gets another variant');
  A.answer(fail,String(fail.pending.options?fail.pending.answer%fail.pending.options.length+1:fail.pending.answer+1000));
  check(fail.pending.nodeId!==failing&&fail.pending.reason.includes('Tidigare delmoment'),'Repeated error routes to an earlier prerequisite');
  click('[data-stage="0"]');click('[data-foundation="1"]');check([...document.querySelectorAll('.skill-node')].every(n=>M.matchesYearView(M.nodes.find(x=>x.id===n.dataset.node),'1-3')),'Stage 1–3 filter');
  click('[data-foundation="2"]');check([...document.querySelectorAll('.skill-node')].every(n=>M.matchesYearView(M.nodes.find(x=>x.id===n.dataset.node),'4-6')),'Stage 4–6 filter');click('#reset-filters');
  click('#adaptive-open');$('#adaptive-limit').value='30';submit('#adaptive-setup');
  check(profile().adaptive.active.scope==='1-3','Student setup saves the selected grade group');
  check($('#adaptive-dialog').classList.contains('student-mode')&&(document.activeElement=== $('#adaptive-answer')||document.activeElement.matches('[data-choice],#student-question-title')),'Student mode focuses the question or answer without hiding the prompt');
  const q=profile().adaptive.active.pending;
  $('#adaptive-answer').value='invalid';submit('#adaptive-answer-form');check(profile().adaptive.active.items.length===0&&$('#adaptive-error').textContent,'Invalid input is not scored');
  reply(false);check(profile().adaptive.active.items.length===1&&!contentHasAnswer(),'Correct answer advances directly without revealing grading');
  click('#adaptive-pause');check(profile().adaptive.active.items.length===1&&$('#adaptive-resume'),'Pause preserves session');
  const pending=profile().adaptive.active.pending.prompt;
  click('#adaptive-close');click('#adaptive-open');click('#adaptive-resume');check(profile().adaptive.active.pending.prompt===pending,'Resuming retains exact pending question');
  click('#adaptive-skip');check(profile().adaptive.active.items.at(-1).skipped&&!profile().adaptive.active.items.at(-1).correct,'Skip records uncertainty and advances');
  while(profile().adaptive.active){reply(false);}
  check($('#adaptive-teacher-report')&&profile().adaptive.sessions.length===1,'Completed session archives and shows student handoff');
  click('#adaptive-teacher-report');check($('#adaptive-content').textContent.includes('Begränsat underlag')&&$('.answer-review'),'Report includes evidence groups and actual answers');
  const exported=state();A.validate(profile().adaptive);
  click('#adaptive-close');click('#adaptive-open');submit('#adaptive-setup');reply(true);click('#adaptive-pause');click('#adaptive-finish');
  check(profile().adaptive.sessions.length===2&&A.summary(profile().adaptive.sessions.at(-1))[0].state==='partial','Teacher can end early without turning one answer into mastery');
  const corrupted=JSON.parse(JSON.stringify(profile().adaptive));corrupted.sessions[0].items[0].correct=!corrupted.sessions[0].items[0].correct;
  let rejected=false;try{A.validate(corrupted);}catch{rejected=true;}check(rejected,'Import validates scores against actual responses');
  // En senare bråkuppgift ger ett granskningsförslag, aldrig automatisk mastery.
  const manual={results:{'brak-add-olika':{history:[{items:[{prompt:'1/2 + 1/3',response:'5/6',correct:true}]}]}},adaptive:{active:null,sessions:[],confirmations:[]}};
  check(A.indirect(manual).some(c=>c.targetId==='brak-forlanga')&&!manual.results['brak-forlanga'],'Indirect evidence is linked to selected tasks and does not create direct results');
  const real=window.MATREE_APP.profile(),savedResult=real.results['brak-add-olika'];
  const mixedRecord={...mixed,ended:new Date().toISOString(),endReason:'teacher',pending:null};
  real.adaptive.sessions.push(mixedRecord);window.MATREE_APP.save();window.MATREE_APP.render();
  click('#adaptive-close');window.MATREE_APP.openSkill(id);check($('#skill-content').textContent.includes('3 av 4 rätt'),'Teacher skill view preserves the actual adaptive denominator');$('[data-close="skill-dialog"]').click();
  click('[data-view="np"]');check($('#np-view').textContent.includes('3/4'),'NP overview preserves the actual adaptive denominator');click('[data-view="tree"]');
  real.adaptive.sessions.pop();window.MATREE_APP.save();window.MATREE_APP.render();click('#adaptive-open');
  const realQuestions=[0,1,2].map(v=>({...M.generate('brak-add-olika',v),response:'5/6',correct:true}));
  real.results['brak-add-olika']={history:[{score:3,date:new Date().toISOString(),items:realQuestions}]};
  window.MATREE_APP.save();window.MATREE_APP.render();click('#adaptive-close');window.MATREE_APP.openSkill('brak-forlanga');
  check($('[data-confirm-indirect]')&&!real.results['brak-forlanga'],'Teacher can inspect indirect evidence without invented direct scores');
  click('[data-confirm-indirect]');check(real.adaptive.confirmations.some(c=>c.targetId==='brak-forlanga')&&$('.skill-node[data-node="brak-forlanga"]').classList.contains('supported'),'Confirming method gives a separate supported state');
  click('[data-revoke-indirect]');check(!real.adaptive.confirmations.some(c=>c.targetId==='brak-forlanga'),'Teacher can revoke a method confirmation');
  $('[data-close="skill-dialog"]').click();if(savedResult)real.results['brak-add-olika']=savedResult;else delete real.results['brak-add-olika'];window.MATREE_APP.save();window.MATREE_APP.render();
  click('#adaptive-open');
  click('#adaptive-close');click('#adaptive-open');submit('#adaptive-setup');reply(false);click('#adaptive-pause');click('#adaptive-close');
  const pictureSession=A.create({scope:'1-3'});
  pictureSession.pending={...M.generate('f-shapes',0),nodeId:'f-shapes',variant:0,reason:'En testomgång som börjar med geometriska former.'};
  A.answer(pictureSession,String(pictureSession.pending.answer));
  real.adaptive.active=pictureSession;window.MATREE_APP.save();window.MATREE_APP.render();
  localStorage.setItem('verification-adaptive-prompt',profile().adaptive.active.pending.prompt);
  return '165 independent foundation answers; shared year views and results, prior evidence reuse, scoped routing, student mode, pause, report and validation passed';
  function contentHasAnswer(){return $('#adaptive-content').textContent.includes('Rätt svar:');}
};
