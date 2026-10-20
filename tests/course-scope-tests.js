/* A year-nine course assessment must not start with the map's elementary prerequisites. */
window.verifyCourseScope=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),check=(c,m)=>{if(!c)throw Error(m);};
  const saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const core=['stora-tal','prefix-stora','prefix-sma','potens-begrepp','tiopotens','negativ-exponent','grundpotens-stora','grundpotens-sma','potens-multiplikation','potens-division','grundpotens-rakning','kvadrattal','kvadratrot','talmangder','irrationella'];
  const same=(a,b)=>a.length===b.length&&a.every(id=>b.includes(id));
  try{
    check(M.matchesYearView(M.detailNodes.find(n=>n.id==='positionssystem'),'9'),'Map retains earlier prerequisite context');
    check(same(A.scopedPool({scope:'9',category:'tal'}).map(n=>n.id),core),'Year nine numbers contains its fifteen course skills, not recurring elementary prerequisites');
    check(same(A.scopedPool({scope:'9',category:'tal',mode:'all'}).map(n=>n.id),[...core,'rot-rakning']),'Full year nine numbers includes the square-root extension');
    for(const scope of ['1-3','4-6']){
      check(A.scopedPool({scope,category:'tal'}).every(n=>!core.includes(n.id)),'Foundations and year-nine numbers use different skill selections');
      check(A.create({scope,category:'tal'}).pending.nodeId!==A.create({scope:'9',category:'tal'}).pending.nodeId,'A new pupil gets a different starting skill in foundations');
    }
    for(const scope of ['7','8','9'])for(const mode of ['adaptive','all']){
      const s=A.create({scope,category:'tal',mode,limit:90}),expected=A.scopedPool(s).map(n=>n.id);
      while(s.pending){check(expected.includes(s.pending.nodeId),'Every number question belongs to the chosen course');check(A.answer(s,s.pending.answer.toLocaleString('sv-SE',{useGrouping:false,maximumSignificantDigits:17})),'Course question accepts its exact numeric answer');}
      const restored=A.validate({active:null,sessions:[s],confirmations:[]}).sessions[0];
      check(restored.selection==='course'&&same(A.scopedPool(restored).map(n=>n.id),expected),'Course policy survives completed-session validation');
    }
    const estimate=A.estimateAll('9','tal');
    check(estimate.skills===16&&estimate.core===15&&estimate.extension===1&&estimate.minQuestions===32&&estimate.maxQuestions===64,'Full year-nine numbers has a course-specific question/time estimate');
    const full=A.create({scope:'9',category:'tal',mode:'all'});
    while(full.pending)A.answer(full,'',true);
    check(full.items.length===32&&same(A.summary(full).map(r=>r.node.id),[...core,'rot-rakning']),'Full mode stays in year nine even when every answer is skipped');
    const legacy=A.create({scope:'9',category:'tal',selection:'progression'});delete legacy.selection;
    check(legacy.pending.nodeId==='positionssystem','Legacy fixture reproduces the former year-nine start');
    legacy.draft=M.makeDraft(legacy.pending,legacy.pending.options?'1':'123');
    const exact=JSON.stringify(legacy.pending),draft=JSON.stringify(legacy.draft),restored=A.validate({active:JSON.parse(JSON.stringify(legacy)),sessions:[],confirmations:[]}).active;
    check(!restored.selection&&JSON.stringify(restored.pending)===exact&&JSON.stringify(restored.draft)===draft,'Older paused questions and drafts retain their original selection and exact content');
    check(A.scopedPool(restored).some(n=>n.id==='positionssystem')&&A.scopeLabel(restored).includes('äldre urval'),'Older reports and paused sessions identify their broader content');
    const fresh=A.create({scope:'9',category:'tal'});fresh.draft=M.makeDraft(fresh.pending,fresh.pending.options?'1':'-');
    const resumed=A.validate({active:JSON.parse(JSON.stringify(fresh)),sessions:[],confirmations:[]}).active;
    check(resumed.selection==='course'&&JSON.stringify(resumed.pending)===JSON.stringify(fresh.pending)&&JSON.stringify(resumed.draft)===JSON.stringify(fresh.draft),'New course question and draft survive validation');
    p.results={};p.quiz=null;p.adaptive={active:null,sessions:[full],confirmations:[]};app.save();app.render();
    check(app.latest('positionssystem')===undefined&&!p.results.positionssystem,'Year-nine answers do not automatically approve elementary prerequisites');
    let rejected=false;try{A.validate({active:{...fresh,selection:'unknown'},sessions:[],confirmations:[]});}catch{rejected=true;}
    check(rejected,'Unknown content policies are rejected on import');
    return 'Course-specific year 7–9 selection, distinct foundations, exact year-nine number coverage, estimates and unchanged legacy questions/drafts passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};
window.verifyAssessedCoverage=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,check=(c,m)=>{if(!c)throw Error(m);};
  check(M.detailNodes.length===249&&M.skillGroups.length===56,'Retired digital group is absent from assessed totals');
  check(M.detailNodes.every(n=>!M.retiredSkillIds.has(n.id)&&n.deps.every(id=>!M.retiredSkillIds.has(id))),'No assessed skill requires a retired digital skill');
  let selections=0;
  for(const scope of ['1-3','4-6','7','8','9'])for(const category of M.categories.map(c=>c.id)){
    const nodes=A.scopedPool({scope,category});
    check(!A.scopedPool({scope,category,mode:'all'}).some(n=>n.retired),'New full selection excludes retired content');
    if(!nodes.length)continue;
    const s=A.create({scope,category,limit:90}),ids=new Set(nodes.map(n=>n.id));
    while(s.pending){check(ids.has(s.pending.nodeId)&&!M.retiredSkillIds.has(s.pending.nodeId),'Natural route stays within assessed selection');A.answer(s,'',true);}
    const expected=Math.min(90,nodes.length*2);
    check(s.items.length===expected,'Failures do not prematurely block other selected skills: '+scope+'/'+category);
    check(s.endReason===(expected===nodes.length*2?'all-tested':'limit'),'End reason distinguishes exhausted selection from question cap');
    if(s.endReason==='all-tested')check(A.summary(s).length===nodes.length&&A.summary(s).every(r=>r.state==='followup'),'Exhausted failed pass has direct evidence for every selected skill');
    const copy=A.validate({active:null,sessions:[s],confirmations:[]}).sessions[0];
    check(copy.coveragePolicy==='exhaustive'&&copy.catalogue==='assessed','New policies survive serialization');selections++;
  }
  const legacy=A.create({scope:'8',category:'problem',limit:30});delete legacy.catalogue;delete legacy.coveragePolicy;
  legacy.pending={...M.generateReviewed('kalkylblad',0),nodeId:'kalkylblad',variant:0,reason:'Äldre sparad fråga.'};
  legacy.draft=M.makeDraft(legacy.pending,legacy.pending.options?'1':'1,');
  const savedQuestion=JSON.stringify(legacy.pending),savedDraft=JSON.stringify(legacy.draft);
  const restored=A.validate({active:legacy,sessions:[],confirmations:[]}).active;
  check(JSON.stringify(restored.pending)===savedQuestion&&JSON.stringify(restored.draft)===savedDraft,'Retired saved question and draft survive validation exactly');
  check(A.scopedPool(restored).some(n=>n.id==='kalkylblad')&&!restored.coveragePolicy,'Older paused selection and routing stay intact');
  const p=app.profile(),saved={quiz:p.quiz,results:p.results,adaptive:p.adaptive};
  try{
    p.quiz=null;check(app.startQuiz('kalkylblad')===false&&!p.quiz,'A new manual retired control cannot start');
    p.quiz={nodeId:'kalkylblad',questions:[0,1,2].map(v=>M.generateReviewed('kalkylblad',v)),index:0,answers:[],responses:[]};
    const prompt=p.quiz.questions[0].prompt;
    app.openSkill('kalkylblad');
    check(document.querySelector('#manual-question-title').textContent===M.questionStem(p.quiz.questions[0]),'Explicitly paused retired manual question can still resume');
    document.querySelector('[data-pause-manual]').click();check(p.quiz.questions[0].prompt===prompt,'Pausing again preserves legacy manual question');
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
  return selections+' assessed selections continue after failures; retired content excluded; legacy questions, drafts and policies preserved';
};
