/* Complete the text review by ID/variant, including mixed and retained legacy IDs. */
window.buildRemainingQuestionAudit=()=>{
  const M=MATREE,covered=new Set(previouslyReviewedQuestionVariants),random=Math.random,rows=[],errors=[],missing=[];
  verifyReviewedQuestions();
  try{
    for(const id of Object.keys(M.reviewedBank))for(let v=0;v<3;v++){
      if(covered.has(`${id}:${v}`))continue;missing.push(`${id}:${v}`);
      for(const [sample,mode] of ['random','minimum','maximum'].entries()){
        let state=(20261016+missing.length*7919)>>>0;
        Math.random=mode==='minimum'?()=>0:mode==='maximum'?()=>.999999999:()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
        let raw,q,expected;
        try{
          raw=M.generateReviewed(id,v);const rawExpected=solveReviewedQuestion(id,v,raw);
          q=raw.answerKind==='choice'?M.expandChoice(id,v,raw):M.responsePlan[id]?.[v]==='C'?M.toChoice(id,v,raw):raw;
          expected=raw.answerKind==='choice'?solveReviewedQuestion(id,v,q):rawExpected;
          const actual=q.optionValues?q.optionValues[q.answer-1]:q.answer;
          if(!Number.isFinite(actual)||!Number.isFinite(expected)||Math.abs(actual-expected)>1e-9*Math.max(1,Math.abs(expected)))throw Error(`Facit ${actual}, expected ${expected}`);
          M.questionExtras(q);
          if(q.optionValues){const shown=M.parseAnswer(q.options[q.answer-1]),tol=Math.abs(expected)<.01?Math.max(1e-15,Math.abs(expected)*1e-6):.000501;if(Math.abs(shown-expected)>tol)throw Error('Displayed option is inaccurate');}
        }catch(error){errors.push({id,v,mode,message:error.message,q:q||raw});}
        if(q){const node=M.nodes.find(n=>n.id===id);rows.push({scope:'remaining',number:rows.length+1,id,title:node.title,category:node.category,grade:node.learnedAt,v,sample,mode,expected,q,prompt:M.questionStem(q),answer:M.answerText(q)});}
      }
    }
  }finally{Math.random=random;}
  window.questionAudit=rows;
  window.remainingQuestionAudit={previouslyReviewed:covered.size,total:Object.keys(M.reviewedBank).length*3,remaining:missing.length,missing,questions:rows.length,rows,errors};
  return remainingQuestionAudit;
};
window.auditAllVariantEdges=()=>{
  const M=MATREE,random=Math.random,errors=[];let checked=0;
  try{
    for(const id of Object.keys(M.reviewedBank))for(let v=0;v<3;v++)for(const value of [0,.999999999]){
      Math.random=()=>value;let q;
      try{
        const raw=M.generateReviewed(id,v),rawExpected=solveReviewedQuestion(id,v,raw);
        q=raw.answerKind==='choice'?M.expandChoice(id,v,raw):M.responsePlan[id]?.[v]==='C'?M.toChoice(id,v,raw):raw;
        const expected=raw.answerKind==='choice'?solveReviewedQuestion(id,v,q):rawExpected,actual=q.optionValues?q.optionValues[q.answer-1]:q.answer;
        if(!Number.isFinite(actual)||!Number.isFinite(expected)||Math.abs(actual-expected)>1e-9*Math.max(1,Math.abs(expected)))throw Error('Wrong answer');
        M.questionExtras(q);checked++;
      }catch(error){errors.push({id,v,value,message:error.message,q});}
    }
  }finally{Math.random=random;}
  return {checked,errors};
};
window.showRemainingStudent=number=>{
  document.body.classList.remove('question-gallery-active');document.querySelector('#question-gallery')?.remove();
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  const row=questionAudit.find(r=>r.number===number),app=MATREE_APP,p=app.profile(),session=MATREE_ADAPTIVE.create({scope:row.grade,limit:30});
  session.pending={...row.q,nodeId:row.id,variant:row.v,reason:'Kontroll av återstående mallvariant.'};
  p.adaptive.active=session;app.save();app.render();
  document.querySelector('#adaptive-open').click();document.querySelector('#adaptive-resume').click();
  return {id:row.id,number,answer:row.q.answer,options:row.q.options};
};
