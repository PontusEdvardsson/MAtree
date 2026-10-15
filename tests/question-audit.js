/* Reproducible browser samples, independently solved before conversion to choices. */
window.buildQuestionAudit=({seedOffset=0,variantOffset=0,exclude=[]}={})=>{
  const M=MATREE,original=Math.random,rows=[],errors=[];
  const excluded=new Set(exclude),newQuestions=new Set();
  window.verifyReviewedQuestions();
  try{
    for(const scope of ['1-3','4-6','7','8','9']){
      const nodes=M.detailNodes.filter(n=>M.matchesYearView(n,scope)),seen=new Set();let attempt=0,count=0;
      while(count<120&&attempt<12000){
        const index=attempt%nodes.length,node=nodes[index],v=(index+Math.floor(attempt/nodes.length)+variantOffset)%3,seed=20261015+Number(scope.replace('-',''))*10000+attempt++ + seedOffset;
        let state=seed;if(seedOffset){state=Math.imul(state^(state>>>16),0x45d9f3b);state=Math.imul(state^(state>>>16),0x45d9f3b);state=(state^(state>>>16))>>>0;}Math.random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
        const raw=M.generateReviewed(node.id,v),rawExpected=solveReviewedQuestion(node.id,v,raw);
        const q=raw.answerKind==='choice'?M.expandChoice(node.id,v,raw):M.responsePlan[node.id][v]==='C'?M.toChoice(node.id,v,raw):raw;
        const fingerprint=M.questionFingerprint(q),key=node.id+'|'+fingerprint;if(seen.has(key)||excluded.has(fingerprint)||exclude.length&&newQuestions.has(fingerprint))continue;seen.add(key);newQuestions.add(fingerprint);
        const expected=raw.answerKind==='choice'?solveReviewedQuestion(node.id,v,q):rawExpected;
        const actual=q.optionValues?q.optionValues[q.answer-1]:q.answer;
        if(Math.abs(actual-expected)>1e-9*Math.max(1,Math.abs(expected)))errors.push({scope,id:node.id,v,expected,actual});
        rows.push({scope,number:++count,id:node.id,title:node.title,category:node.category,v,seed,seedOffset,fingerprint,expected,q,prompt:M.questionStem(q),answer:M.answerText(q)});
      }
      if(count!==120)throw Error('Not enough distinct samples: '+scope);
    }
  }finally{Math.random=original;}
  if(errors.length)throw Error(JSON.stringify(errors));
  window.questionAudit=rows;
  return rows;
};
window.auditQuestionUI=async scope=>{
  const app=MATREE_APP,p=app.profile(),saved=p.quiz;let submitted=0,visuals=0;
  const rows=questionAudit.filter(s=>s.scope===scope),issues=[];
  try{
    for(const row of rows){
      p.quiz={nodeId:row.id,questions:[row.q,row.q,row.q],answers:[],responses:[],index:0};
      app.openSkill(row.id);
      const form=document.querySelector('#answer-form'),input=document.querySelector('#answer');
      if(!form||!input)throw Error('Missing form: '+row.id);
      if(row.q.options)document.querySelector(`#answer-form [data-choice="${row.q.answer}"]`).click();
      else {input.value=row.q.answer.toLocaleString('sv-SE',{useGrouping:false,maximumSignificantDigits:17});input.dispatchEvent(new Event('input',{bubbles:true}));}
      if(row.q.visual){
        visuals++;
        for(const svg of form.closest('#skill-content').querySelectorAll('svg')){
          const box=svg.viewBox.baseVal;if(!box.width)continue;
          for(const t of svg.querySelectorAll('text')){const b=t.getBBox();if(b.x<-.5||b.y<-.5||b.x+b.width>box.width+.5||b.y+b.height>box.height+.5)issues.push(row.id+': clipped '+t.textContent);}
        }
      }
      form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      if(p.quiz.answers[0]!==true)throw Error('Correct answer rejected: '+row.id+' '+row.v);
      document.querySelector('#skill-dialog').close();
      p.quiz={nodeId:row.id,questions:[row.q,row.q,row.q],answers:[],responses:[],index:0};app.openSkill(row.id);
      if(row.q.options)document.querySelector(`#answer-form [data-choice="${row.q.answer%row.q.options.length+1}"]`).click();
      else document.querySelector('#answer').value=(row.q.answer+1).toLocaleString('sv-SE',{useGrouping:false,maximumSignificantDigits:17});
      document.querySelector('#answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      if(p.quiz.answers[0]!==false)throw Error('Wrong answer accepted: '+row.id+' '+row.v);
      document.querySelector('#skill-dialog').close();submitted++;
    }
    if(issues.length)throw Error(issues.join('\n'));
    return {scope,questions:submitted,correctSubmissions:submitted,wrongSubmissions:submitted,visuals};
  }finally{p.quiz=saved;document.querySelector('#skill-dialog').close();app.save();app.render();}
};
window.auditGallery=(scope,start=1)=>{
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const rows=questionAudit.filter(s=>s.scope===scope&&(Array.isArray(start)?start.includes(s.number):s.number>=start&&s.number<start+6));
  questionGallery(rows.map(s=>({id:s.id,v:s.v,seed:s.seed,q:s.q})));
  return rows.map(s=>({number:s.number,id:s.id,prompt:s.prompt,answer:s.answer}));
};
window.showAuditStudent=(scope,number)=>{
  document.body.classList.remove('question-gallery-active');document.querySelector('#question-gallery')?.remove();
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const row=questionAudit.find(s=>s.scope===scope&&s.number===number),app=MATREE_APP,p=app.profile(),session=MATREE_ADAPTIVE.create({scope,limit:30});
  session.pending={...row.q,nodeId:row.id,variant:row.v,reason:'Reproducerbar bild- och svarskontroll.'};
  p.adaptive.active=session;app.save();app.render();
  document.querySelector('#adaptive-open').click();document.querySelector('#adaptive-resume').click();
  return {id:row.id,answer:row.q.answer,prompt:row.prompt,options:row.q.options};
};
