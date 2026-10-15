window.verifyAnswerDrafts=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    p.results={};p.quiz=null;
    const s=A.create({scope:'4-6',limit:30}),q=M.generateReviewed('brak-forlanga',0);
    s.pending={...q,nodeId:'brak-forlanga',variant:0,reason:'Utkast prövas separat från inskickade svar.'};p.adaptive={active:s,sessions:[],confirmations:[]};app.save();app.render();
    $('#adaptive-open').click();$('#adaptive-resume').click();$('#adaptive-answer').value='-';$('#adaptive-answer').dispatchEvent(new Event('input',{bubbles:true}));
    check(s.items.length===0&&!app.latest('brak-forlanga'),'Incomplete numeric draft creates no evidence');
    $('#adaptive-pause').click();$('#adaptive-resume').click();check($('#adaptive-answer').value==='-','Numeric draft survives pause');
    check(A.validate(JSON.parse(JSON.stringify(p.adaptive))).active.draft.value==='-','Adaptive draft survives JSON validation');
    $('#adaptive-skip').click();check(!s.draft&&s.items.length===1&&s.items[0].skipped,'Skip clears the draft and records just a skipped answer');
    $('#adaptive-pause').click();$('#adaptive-close').click();
    const choice=M.generate('rita-linje',0),c=A.create({scope:'9',limit:30});c.pending={...choice,nodeId:'rita-linje',variant:0,reason:'Ett valt alternativ är fortfarande ett utkast.'};p.adaptive.active=c;app.save();app.render();
    $('#adaptive-open').click();$('#adaptive-resume').click();$('#adaptive-answer-form [data-choice="1"]').click();
    check(c.draft.value==='1'&&c.items.length===0,'Choice click persists a draft without submitting');
    $('#adaptive-pause').click();$('#adaptive-resume').click();check($('#adaptive-answer').value==='1'&&!$('#adaptive-answer-form .choice-submit').disabled,'Restored choice remains selected and can be submitted');
    const changed={...choice,options:[...choice.options].reverse()};check(M.validateDraft(changed,c.draft)===null,'Changed option order cannot reuse a draft');
    $('#adaptive-answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));check(!c.draft&&c.items.length===1,'Submitting clears the choice draft');
    $('#adaptive-pause').click();$('#adaptive-close').click();
    p.quiz={nodeId:'brak-forlanga',questions:[0,1,2].map(v=>M.generateReviewed('brak-forlanga',v)),answers:[],responses:[],index:0};
    app.openSkill('brak-forlanga');$('#answer').value='123';$('#answer').dispatchEvent(new Event('input',{bubbles:true}));$('[data-close="skill-dialog"]').click();app.openSkill('brak-forlanga');
    check($('#answer').value==='123'&&p.quiz.answers.length===0,'Manual draft survives closing without grading');
    $('#answer').value=String(p.quiz.questions[0].answer);$('#answer').dispatchEvent(new Event('input',{bubbles:true}));$('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    check(!p.quiz.draft&&p.quiz.answers[0],'Manual submission clears its draft');
    const old=JSON.parse(JSON.stringify(c));delete old.draft;check(!A.validate({active:old,sessions:[],confirmations:[]}).active.draft,'Older sessions without drafts remain valid');
    let rejected=false;try{M.validateDraft(choice,{questionKey:M.draftQuestionKey(choice),value:'12345'});}catch{rejected=true;}check(rejected,'Invalid imported choice drafts are rejected');
    return 'Numeric and choice drafts, exact question binding, manual pause, old data and clearing on submit/skip passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyEndReasons=()=>{
  const A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved=p.adaptive;
  const check=(c,m)=>{if(!c)throw Error(m);};
  const show=s=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());p.adaptive={active:null,sessions:[s],confirmations:[]};app.save();app.render();$('.last-report-link').click();};
  try{
    for(const [scope,total]of [['1-3',4],['9',16]]){
      const s=A.create({scope,limit:90});while(!s.ended)A.answer(s,'',true);
      check(s.items.length===total&&s.endReason==='coverage','Existing all-skip selection is unchanged for '+scope);show(s);
      check($('.report-end').dataset.endReason==='coverage'&&$('.report-end').textContent.includes('Urvalsreglerna'),'Rule-stop reason is explicit');
      check($('.report-end').textContent.includes(String(A.scopedPool(s).length-A.summary(s).length)),'Untried remainder is stated accurately');
      check(!$('#adaptive-content').textContent.includes('hela kartläggningen är klar'),'Early stop does not claim complete coverage');
      if(scope==='9'){$('[data-earlier-scope]').click();check($('#adaptive-start').value==='8'&&!p.adaptive.active,'Earlier scope is configured without starting a session');}
      else check($('.report-end').textContent.includes('tidigaste urvalet'),'Earliest scope has followup guidance');
    }
    const limit=A.create({scope:'9',limit:30});while(!limit.ended)A.answer(limit,String(limit.pending.answer));show(limit);
    check($('.report-end').dataset.endReason==='limit'&&$('.report-end').textContent.includes('Uppgiftstaket på 30'),'Question cap has a separate explanation');
    const teacher=A.create({scope:'7',limit:90});A.answer(teacher,String(teacher.pending.answer));teacher.ended=new Date().toISOString();teacher.pending=null;teacher.endReason='teacher';show(teacher);
    check($('.report-end').textContent.includes('av läraren'),'Teacher stop has a separate explanation');
    const old={...teacher,endReason:null};show(old);check($('.report-end').textContent.includes('saknas i detta äldre pass'),'Older unknown reason is not invented');
    const paused=A.create({scope:'1-3',limit:30});p.adaptive.active=paused;app.save();$('#adaptive-close').click();$('.last-report-link').click();
    check($('[data-earlier-scope]').disabled&&p.adaptive.active.id===paused.id,'Earlier-scope shortcut cannot overwrite another paused session');
    return 'Limit, teacher, rule-stop and unknown explanations, unchanged all-skip routing and safe earlier-scope selection passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());p.adaptive=saved;app.save();app.render();}
};

window.verifyPartialEvidence=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    p.results={};p.quiz=null;const s=A.create({scope:'7',limit:30});s.pending={...M.generateReviewed('brak-forlanga',0),nodeId:'brak-forlanga',variant:0,reason:'Begränsat underlag ska ha samma status i alla vyer.'};
    p.adaptive={active:s,sessions:[],confirmations:[]};s.draft=M.makeDraft(s.pending,'4');
    check(app.evidenceCounts().untried===M.detailNodes.length&&app.profileCounts(p).skills===0,'A draft alone is untried everywhere');
    A.answer(s,String(s.pending.answer));const counts=app.evidenceCounts();
    check(counts.partial===1&&counts.mastered===0&&counts.untried===M.detailNodes.length-1,'One submitted answer is partial, never untried or mastered');
    check(Object.values(counts).reduce((a,b)=>a+b,0)===M.detailNodes.length,'Evidence status counts cover the same denominator');
    app.save();app.render();$('[data-view="np"]').click();
    const row=$('#np-view [data-open="brak-forlanga"]');
    check(row.textContent.includes('Begränsat underlag')&&row.textContent.includes('1/1'),'NP row labels partial 1/1 explicitly');
    const panel=row.closest('.progress-panel');check(panel.textContent.includes('1 med begränsat underlag')&&panel.textContent.includes('18 oprövade'),'NP category excludes partial skill from untried count');
    app.showProgress();check($('#progress-view').textContent.includes('Begränsat underlag')&&$('#progress-view [data-open="brak-forlanga"]'),'Teacher overview includes partial evidence');
    const q=M.generateReviewed('f-count',0);p.quiz={nodeId:'f-count',questions:[q,M.generateReviewed('f-count',1),M.generateReviewed('f-count',2)],answers:[false],responses:['0'],index:1};
    check(app.latest('f-count').score===null&&app.evidenceCounts().partial===2,'Saved partial manual control is also partial, including legacy controls without timestamps');
    p.adaptive.active=null;s.ended=new Date().toISOString();s.endReason='teacher';s.pending=null;p.adaptive.sessions=[s];app.save();app.render();
    check(app.evidenceCounts().partial===2,'Archiving does not turn partial evidence into untried');
    return 'Drafts versus submitted evidence, pending manual/automatic controls, NP labels and consistent partial counts passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyManualHistory=()=>{
  const M=MATREE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    const id=M.resolveSkillId('avrunda-heltal'),alias=M.skillIds(id).find(key=>key!==id);
    const record=(right,time)=>({score:right?3:0,date:time,items:[0,1,2].map(v=>{const q=M.generate(id,v);return {...q,response:String(right?q.answer:q.options?q.answer%q.options.length+1:q.answer+100),correct:right};})});
    const older=record(true,new Date(Date.now()-86400000).toISOString()),newer=record(false,new Date().toISOString());
    p.results={[alias]:{history:[older]},[id]:{history:[newer]}};p.adaptive={active:null,sessions:[],confirmations:[]};
    p.quiz={nodeId:id,questions:[0,1,2].map(v=>M.generateReviewed(id,v)),answers:[],responses:[],index:0};p.quiz.draft=M.makeDraft(p.quiz.questions[0],'-');
    const quiz=JSON.stringify(p.quiz);app.save();app.showProgress();$('[data-manual-record="1"]').click();
    check($('.manual-record-outcome').textContent.includes('3/3'),'Older manual 3/3 remains distinct from newer 0/3');
    check(older.items.every(q=>$('.manual-record-answers').textContent.includes(M.questionStem(q))),'Older manual questions remain exact across merged skill IDs');
    for(const q of older.items.filter(q=>q.options))check(q.options.every(o=>$('.manual-record-answers').textContent.includes(o)),'Historical manual options retain their saved text');
    check(JSON.stringify(p.quiz)===quiz&&app.latest(id).score===0,'Historical inspection changes neither paused quiz nor latest result');
    $('#manual-history-return').click();check(!$('#progress-view').hidden,'Return opens manual control history');
    $('[data-manual-record="0"]').click();check($('.manual-record-outcome').textContent.includes('0/3'),'Newer manual control opens its own outcome');$('[data-close="skill-dialog"]').click();
    p.results={[alias]:{history:[{score:3,date:new Date().toISOString()}]}};app.showProgress();$('[data-manual-record="0"]').click();
    check($('.manual-record-answers').textContent.includes('Endast poäng')&&!$('.manual-record-answers .answer-review'),'Legacy aggregate-only record never invents question responses');
    return 'Selected manual records, merged IDs, saved choices, paused controls and aggregate-only history passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyDirectControl=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  const submit=()=>$('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  try{
    p.results={};p.quiz=null;
    const older=A.create({scope:'1-3',limit:90});while(!older.ended)A.answer(older,'',true);
    const newer=A.create({scope:'9',limit:30});A.answer(newer,String(newer.pending.answer));newer.ended=new Date().toISOString();newer.endReason='teacher';newer.pending=null;
    const active=A.create({scope:'7',limit:30}),activeBefore=JSON.stringify(active),olderBefore=JSON.stringify(older);
    p.adaptive={active,sessions:[older,newer],confirmations:[]};app.save();app.showProgress();
    $('#progress-view [data-adaptive-report="'+older.id+'"]').click();
    const start=$('.followup-suggestion [data-report-start]'),id=start.dataset.reportStart;
    check(start.getAttribute('aria-label').includes(p.name),'Direct action identifies both student and skill');
    const details=$('#adaptive-content details');if(details)details.open=true;
    start.click();
    check($('#answer-form')&&p.quiz.nodeId===id&&p.quiz.answers.length===0,'One click starts the suggested control without recording an answer');
    check($('.control-student').textContent.includes(p.name)&&$('#skill-dialog-title').textContent.includes(M.nodes.find(n=>n.id===id).title),'Student and skill remain visible in control');
    check(p.quiz.reportSessionId===older.id&&$('.control-report-return').dataset.adaptiveReport===older.id,'Control remembers the selected older report');
    const q=p.quiz.questions[0],draft=q.options?'1':'-';$('#answer').value=draft;$('#answer').dispatchEvent(new Event('input',{bubbles:true}));
    $('.control-report-return').click();
    check($('#adaptive-dialog').open&&$('#adaptive-content.teacher-report')&&(!details||$('#adaptive-content details').open),'Return restores the selected report and expanded evidence');
    const again=$('.followup-suggestion [data-report-start="'+id+'"]');check(again.textContent.includes('Fortsätt'),'Paused control has an explicit resume action');again.click();
    check($('#answer').value===draft&&p.quiz.answers.length===0,'Direct resume restores draft without submitting');
    for(let i=0;i<3;i++){
      const current=p.quiz.questions[p.quiz.index];$('#answer').value=String(current.answer);submit();
      check($('.control-report-return')&&p.quiz.answers[i],'Feedback retains return path');
      $('#next-question').click();
    }
    check(!p.quiz&&$('.control-report-return')&&p.results[id].history.at(-1).score===3,'Completed control retains return path and stores its own result');
    $('.control-report-return').click();
    check($('#adaptive-content .report-meta').textContent.includes(A.scopeLabel(older)),'Completion returns to older report rather than latest report');
    check(JSON.stringify(older)===olderBefore&&JSON.stringify(active)===activeBefore,'Direct control changes neither historical report nor paused automatic session');
    const other=M.detailNodes.find(n=>n.id!==id),questions=[0,1,2].map(v=>M.generate(other.id,v));
    p.quiz={nodeId:other.id,questions,answers:[],responses:[],index:0,draft:M.makeDraft(questions[0],questions[0].options?'1':'123')};app.save();
    const paused=JSON.stringify(p.quiz);$('.followup-suggestion [data-report-start="'+id+'"]').click();
    check($('#adaptive-dialog').open&&!$('#skill-dialog').open&&JSON.stringify(p.quiz)===paused,'Conflicting paused control is not overwritten or silently opened');
    check($('.paused-control-notice').textContent.includes(other.title),'Conflict names the actual paused skill');
    $('[data-resume-report-quiz]').click();
    check(p.quiz.nodeId===other.id&&$('#answer').value===p.quiz.draft.value&&$('.control-report-return'),'Explicit resume opens the actual paused control with its draft and return path');
    return 'One-click controls, exact older-report return, saved drafts, completion, conflicting paused controls and unchanged automatic evidence passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyTestAll=async()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    for(const scope of ['1-3','4-6','7','8','9']){
      const expected=M.detailNodes.filter(n=>M.matchesYearView(n,scope)),e=A.estimateAll(scope),ids=new Set(expected.map(n=>n.id));
      check(e.skills===ids.size&&e.minQuestions===2*ids.size&&e.maxQuestions===4*ids.size,'Estimate covers every distinct skill in '+scope);
      for(const kind of ['right','skip','one-wrong']){
        const s=A.create({scope,mode:'all',known:[expected[0].id]});let count=0;
        check(!s.known.length&&s.limit===e.maxQuestions,'Test all rechecks prior evidence without a small cap');
        while(s.pending){
          const q=s.pending;check(ids.has(q.nodeId),'Test all stays in chosen year '+scope);
          const first=!s.items.some(i=>i.nodeId===q.nodeId),skip=kind==='skip'||kind==='one-wrong'&&first;
          const response=q.answer.toLocaleString('en-US',{useGrouping:false,maximumSignificantDigits:17});
          check(A.answer(s,response,skip),'Question accepts its exact decimal answer: '+q.nodeId+' '+response);
          check(++count<=e.maxQuestions,'Full run is bounded');if(count%25===0)await new Promise(resolve=>setTimeout(resolve,0));
        }
        const rows=A.summary(s),expectedTotal=ids.size*(kind==='right'?3:kind==='skip'?2:4);
        check(rows.length===ids.size&&s.items.length===expectedTotal&&s.endReason==='all-tested','Every skill is tested despite failures, for '+scope+' '+kind);
        check(rows.every(r=>r.state===(kind==='skip'?'followup':'shown')),'Full mode preserves individual evidence rules');
        const imported=A.validate({active:null,sessions:[JSON.parse(JSON.stringify(s))],confirmations:[]}).sessions[0];
        check(imported.mode==='all'&&imported.limit===e.maxQuestions&&imported.endReason==='all-tested'&&imported.items.length===expectedTotal,'Large full run survives validation/export format');
      }
    }
    const standard=A.create({scope:'1-3',limit:90});while(standard.pending)A.answer(standard,'',true);
    check(standard.items.length===4&&standard.endReason==='coverage'&&!standard.mode,'Existing adaptive routing remains unchanged');
    p.results={};p.quiz=null;p.adaptive={active:null,sessions:[],confirmations:[]};app.save();app.render();$('#adaptive-open').click();
    $('#adaptive-start').value='4-6';$('#adaptive-limit').value='all';$('#adaptive-limit').dispatchEvent(new Event('change',{bubbles:true}));
    let e=A.estimateAll('4-6');
    check(!$('#adaptive-estimate').hidden&&$('#adaptive-estimate').textContent.includes(e.minQuestions+'–'+e.maxQuestions)&&$('#adaptive-estimate').textContent.includes('1 minut per fråga'),'Setup shows live question range and transparent time assumption');
    check($('#adaptive-retest').disabled&&$('#adaptive-retest').checked,'Test all explicitly includes previously shown skills');
    $('#adaptive-start').value='9';$('#adaptive-start').dispatchEvent(new Event('change',{bubbles:true}));e=A.estimateAll('9');
    check($('#adaptive-estimate').textContent.includes(e.skills+' delmoment')&&$('#adaptive-estimate').textContent.includes(e.extension+' fördjupningsmoment'),'Estimate updates with year and includes extensions');
    $('#adaptive-limit').value='30';$('#adaptive-limit').dispatchEvent(new Event('change',{bubbles:true}));
    check($('#adaptive-estimate').hidden&&!$('#adaptive-retest').disabled&&!$('#adaptive-retest').checked,'Returning to short mode restores the previous retest preference');
    $('#adaptive-limit').value='all';$('#adaptive-limit').dispatchEvent(new Event('change',{bubbles:true}));
    $('#adaptive-setup').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    check(p.adaptive.active.mode==='all'&&p.adaptive.active.scope==='9'&&p.adaptive.active.limit===e.maxQuestions,'UI starts a full run in the chosen year');
    const s=p.adaptive.active,q=s.pending;s.draft=M.makeDraft(q,q.options?'1':'-');app.save();$('#adaptive-pause').click();$('#adaptive-resume').click();
    check($('#adaptive-answer').value===s.draft.value,'Full run pauses and restores exact draft');
    check(A.validate(JSON.parse(JSON.stringify(p.adaptive))).active.mode==='all','Paused full run is importable');
    $('#adaptive-pause').click();$('#adaptive-finish').click();
    check(p.adaptive.sessions.at(-1).endReason==='teacher'&&$('.report-end').textContent.includes('av läraren'),'Manual stop still works in full mode');
    return 'Test all covers all five year selections with correct, skipped and mixed answers; 2–4 question estimates, extensions, unchanged standard routing, pause, drafts and large backup validation passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyCategoryScope=async()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    for(const scope of ['1-3','4-6','7','8','9'])for(const cat of M.categories){
      const expected=M.detailNodes.filter(n=>M.matchesYearView(n,scope)&&n.category===cat.id),ids=new Set(expected.map(n=>n.id)),estimate=A.estimateAll(scope,cat.id);
      check(estimate.skills===ids.size&&estimate.maxQuestions===ids.size*4,'Estimate uses both year and area');
      if(!ids.size){let rejected=false;try{A.create({scope,category:cat.id,mode:'all'});}catch{rejected=true;}check(rejected,'Empty area selection cannot start a full run');continue;}
      for(const mode of ['adaptive','all']){
        if(!A.scopedPool({scope,category:cat.id,mode}).length){let rejected=false;try{A.create({scope,category:cat.id,mode});}catch{rejected=true;}check(rejected,'Area with only extensions cannot start a core-only run');continue;}
        const s=A.create({scope,category:cat.id,mode,limit:30});let count=0;
        while(s.pending){check(ids.has(s.pending.nodeId),'Area run never tests outside selected year and area');A.answer(s,'',true);check(++count<=s.limit,'Area run is bounded');if(count%20===0)await new Promise(resolve=>setTimeout(resolve,0));}
        check(s.items.every(i=>M.nodes.find(n=>n.id===i.nodeId).category===cat.id),'No cross-area questions are inserted');
        if(mode==='all')check(A.summary(s).length===ids.size&&s.items.length===ids.size*2&&s.endReason==='all-tested','Test all visits every selected area skill after failures');
        check(A.validate({active:null,sessions:[s],confirmations:[]}).sessions[0].category===cat.id,'Area is preserved in completed backup records');
      }
    }
    const s=A.create({scope:'7',category:'tal',mode:'all'}),q=s.pending;s.draft=M.makeDraft(q,q.options?'1':'123');
    const imported=A.validate(JSON.parse(JSON.stringify({active:s,sessions:[],confirmations:[]}))).active;
    check(imported.category==='tal'&&imported.draft.value===s.draft.value,'Area and exact draft survive import of a paused full run');
    let rejected=false;try{A.validate({active:{...s,category:'geometri'},sessions:[],confirmations:[]});}catch{rejected=true;}check(rejected,'Import rejects a pending question from another area');
    rejected=false;try{A.create({scope:'7',category:'unknown'});}catch{rejected=true;}check(rejected,'Unknown area is rejected');
    const legacy=A.create({scope:'7'});check(!A.validate({active:legacy,sessions:[],confirmations:[]}).active.category,'Legacy sessions remain unfiltered');
    p.results={};p.quiz=null;p.adaptive={active:null,sessions:[],confirmations:[]};app.save();app.render();$('#adaptive-open').click();
    $('#adaptive-start').value='7';$('#adaptive-category').value='tal';$('#adaptive-limit').value='all';$('#adaptive-category').dispatchEvent(new Event('change',{bubbles:true}));
    const e=A.estimateAll('7','tal');
    check($('#adaptive-estimate').textContent.includes(e.skills+' delmoment')&&$('#adaptive-estimate').textContent.includes('Tal & räkning'),'Setup displays area-specific full estimate');
    $('#adaptive-start').value='1-3';$('#adaptive-category').value='procent';$('#adaptive-category').dispatchEvent(new Event('change',{bubbles:true}));
    check($('#adaptive-setup > .primary-button').disabled&&$('#adaptive-selection-info').textContent.includes('Inga delmoment'),'An empty year/area combination is explained before start');
    $('#adaptive-start').value='7';$('#adaptive-category').value='tal';$('#adaptive-category').dispatchEvent(new Event('change',{bubbles:true}));
    $('#adaptive-setup').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    check(p.adaptive.active.category==='tal'&&p.adaptive.active.limit===e.maxQuestions,'UI starts only chosen area in full mode');
    $('#adaptive-skip').click();$('#adaptive-pause').click();
    check($('#adaptive-content').textContent.includes('Tal & räkning'),'Paused run names its area');
    $('#adaptive-finish').click();
    check($('.report-meta').textContent.includes('Tal & räkning')&&$('.report-end').textContent.includes('av läraren'),'Report identifies its area and manual stop');
    $('#adaptive-new').click();check($('#adaptive-category').value==='tal','Next run retains last area choice');
    $('#adaptive-category').value='';$('#adaptive-category').dispatchEvent(new Event('change',{bubbles:true}));
    check($('#adaptive-estimate').textContent.includes(A.estimateAll('7').skills+' delmoment'),'All areas restores full-year estimate');
    return 'All 45 year/area selections, bounded adaptive and full routing, empty selections, scoped estimates, reports, paused drafts, backup validation and legacy sessions passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};
