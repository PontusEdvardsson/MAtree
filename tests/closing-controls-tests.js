window.verifyClosingControls=async()=>{
  const app=MATREE_APP,M=MATREE,A=MATREE_ADAPTIVE,$=s=>document.querySelector(s),p=app.profile();
  const saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive},check=(c,m)=>{if(!c)throw Error(m);};
  const id='brak-forlanga',tick=()=>new Promise(r=>setTimeout(r,0));
  const manual=()=>{p.quiz=null;app.openSkill(id);app.startQuiz(id);};
  const answer=()=>{const q=p.quiz.questions[p.quiz.index];$('#answer').value=String(q.answer);$('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));};
  const auto=()=>{p.adaptive.active=A.create({scope:'7',limit:30});app.save();app.render();$('#adaptive-open').click();$('#adaptive-resume').click();return p.adaptive.active;};
  try{
    p.results={};p.quiz=null;p.adaptive={active:null,sessions:[],confirmations:[]};
    for(const close of ['button','escape','backdrop']){
      manual();answer();const question=JSON.stringify(p.quiz.questions[0]);
      check($('.manual-submitted-answer').textContent.includes(M.answerText(p.quiz.questions[0],p.quiz.responses[0])),'Feedback displays the exact submitted answer before continuing');
      if(close==='button')$('#skill-content .dialog-top [data-close]').click();
      if(close==='escape')$('#skill-dialog').dispatchEvent(new Event('cancel',{cancelable:true}));
      if(close==='backdrop'){
        const d=$('#skill-dialog');d.dispatchEvent(new PointerEvent('pointerdown',{clientX:-10,clientY:-10,bubbles:true}));d.dispatchEvent(new MouseEvent('click',{clientX:-10,clientY:-10,bubbles:true}));
      }
      check(!p.quiz&&!$('#skill-dialog').open,'Manual '+close+' ends the control');
      const record=p.results[id].history.at(-1);
      check(record.score===1&&record.total===1&&record.items.length===1,'Only submitted answers are archived');
      check(JSON.stringify({...record.items[0],response:undefined,correct:undefined})===question,'Exact saved question survives early ending');
      check(app.latest(id).score===null&&app.latest(id).right===1&&app.latest(id).total===1,'Early manual result stays partial');
      check(!$('#control-end-status').hidden&&$('#control-end-description').textContent.includes('1 svar sparat'),'Ending acknowledges the submitted answer');
      $('#control-end-review').click();check($('.manual-record-outcome').textContent.includes('1/1')&&$('.manual-record-answers .answer-review'),'End confirmation opens the exact saved manual control');$('#skill-content .dialog-top [data-close]').click();
    }
    const before=p.results[id].history.length;manual();$('#answer').value='-';$('#answer').dispatchEvent(new Event('input',{bubbles:true}));$('#skill-content .dialog-top [data-close]').click();
    check(!p.quiz&&p.results[id].history.length===before,'Unsubmitted drafts create no result on close');
    manual();const pending=p.quiz;$('#answer').value='123';$('#answer').dispatchEvent(new Event('input',{bubbles:true}));$('[data-pause-manual]').click();await tick();
    check(p.quiz===pending&&p.quiz.draft.value==='123','Only explicit manual pause preserves the draft');
    app.openSkill(id);check($('#answer').value==='123','Explicitly paused question resumes');
    for(let i=0;i<3;i++){answer();if(i<2)$('#next-question').click();}
    $('#skill-content .dialog-top [data-close]').click();check(!p.quiz&&p.results[id].history.at(-1).score===3,'Closing after all three answers archives the completed result');
    app.openSkill(id);app.startQuiz(id);answer();$('#next-question').click();answer();$('#skill-content .dialog-top [data-close]').click();
    check(app.latest(id).score===null&&p.results[id].history.at(-1).total===2,'Two answers never imply three-question mastery');
    app.showProgress();$('[data-manual-record="0"]').click();check($('.manual-record-outcome').textContent.includes('2/2')&&$('.manual-record-outcome').textContent.includes('Avslutad i förtid'),'Historical partial control shows its true denominator and end state');$('#skill-content .dialog-top [data-close]').click();
    for(const close of ['escape','button','programmatic']){
      const session=auto();$('#adaptive-skip').click();
      const items=JSON.stringify(session.items);
      if(close==='escape')$('#adaptive-dialog').dispatchEvent(new Event('cancel',{cancelable:true}));
      if(close==='button')$('#adaptive-end').click();
      if(close==='programmatic'){$('#adaptive-dialog').close();await tick();}
      check(!p.adaptive.active&&p.adaptive.sessions.at(-1)===session,'Automatic '+close+' archives the active pass');
      check(session.endReason==='teacher'&&session.pending===null&&!session.draft&&JSON.stringify(session.items)===items,'Ending preserves submitted responses without inventing a skipped answer');
      check(!$('#adaptive-dialog').open,'Ending leaves the dialog');
      $('#control-end-review').click();check($('#adaptive-dialog .report-meta').textContent.includes('1 svar')&&$('.report-end').textContent.includes('manuellt'),'End confirmation opens the correct automatic report with neutral ending text');$('#adaptive-close').click();
    }
    const session=auto(),question=JSON.stringify(session.pending);$('#adaptive-answer').value='-';$('#adaptive-answer').dispatchEvent(new Event('input',{bubbles:true}));$('#adaptive-pause').click();$('#adaptive-close').click();await tick();
    check(p.adaptive.active===session&&JSON.stringify(session.pending)===question&&session.draft.value==='-','Closing after explicit automatic pause preserves question and draft');
    $('#adaptive-open').click();$('#adaptive-resume').click();window.dispatchEvent(new Event('pagehide'));check(!p.adaptive.active&&session.ended,'Leaving the page ends a running automatic control');$('#adaptive-dialog').close();await tick();
    manual();answer();window.dispatchEvent(new Event('pagehide'));check(!p.quiz&&app.latest(id).total===1,'Leaving the page ends a running manual control');window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));await tick();check(!$('#skill-dialog').open&&!$('#adaptive-dialog').open,'Back navigation cannot restore an ended question as an active form');
    const backup={version:1,activeId:'early-end-import',profiles:[{id:'early-end-import',name:'Importkontroll avslutad',results:p.results,quiz:null,adaptive:p.adaptive}]};
    const transfer=new DataTransfer();transfer.items.add(new File([JSON.stringify(backup)],'early-end.json',{type:'application/json'}));$('#import-file').files=transfer.files;$('#import-file').dispatchEvent(new Event('change',{bubbles:true}));
    for(let i=0;i<50&&app.profile()===p;i++)await new Promise(r=>setTimeout(r,10));
    const imported=app.profile();check(imported!==p&&!imported.quiz&&app.latest(id).score===null&&app.latest(id).total===1,'Import restores an ended partial record without resuming it');
    check(imported.results[id].history.length===p.results[id].history.length&&imported.results[id].history.at(-1).items.every((q,i)=>{const original=p.results[id].history.at(-1).items[i];return M.draftQuestionKey(q)===M.draftQuestionKey(original)&&q.response===original.response&&q.correct===original.correct&&q.explanation===original.explanation;}),'Import preserves historical partial questions and answers');
    const confirm=window.confirm;try{window.confirm=()=>true;$('[data-delete="'+imported.id+'"]').click();}finally{window.confirm=confirm;}
    $('[data-profile="'+p.id+'"]').click();
    return 'Close, Escape, backdrop and page exit end controls; explicit pause preserves drafts; partial history and import retain exact submitted answers';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();await tick();}
};
