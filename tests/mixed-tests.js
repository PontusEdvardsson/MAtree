window.verifyMixedQuestions=()=>{
  const M=window.MATREE,A=window.MATREE_ADAPTIVE,check=(c,m)=>{if(!c)throw Error(m);},counts={},errors=[];let checked=0;
  for(const node of M.detailNodes){counts[node.category]??={choice:0,total:0};for(let v=0;v<3;v++){
    counts[node.category].total++;if(M.responsePlan[node.id][v]==='C')counts[node.category].choice++;
    for(let i=0;i<10;i++)try{
      const raw=M.generateReviewed(node.id,v),expected=window.solveReviewedQuestion(node.id,v,raw),q=raw.answerKind==='choice'?M.expandChoice(node.id,v,raw):M.responsePlan[node.id][v]==='C'?M.toChoice(node.id,v,raw):raw;
      M.questionExtras(q);
      if(q.options){
        check(q.options.length>=2&&q.options.length<=4&&new Set(q.options).size===q.options.length,'Distinct alternatives');
        if(q.optionValues){
          check(Math.abs(q.optionValues[q.answer-1]-expected)<1e-9,'Converted mathematical answer matches independent solution');
          const correct=M.parseAnswer(q.options[q.answer-1]),tolerance=Math.abs(expected)<.01?Math.max(1e-15,Math.abs(expected)*1e-6):.000501;
          check(Math.abs(correct-expected)<=tolerance,'Displayed correct option represents the correct answer');
          check(q.optionValues.filter(x=>Math.abs(x-expected)<1e-10*Math.max(1e-9,Math.abs(expected))).length===1,'Only one mathematically correct option');
        }else check(window.solveReviewedQuestion(node.id,v,q)===q.answer,'Existing choice has one independently correct alternative');
        check(!M.responseAllowed(q,'0')&&!M.responseAllowed(q,'99')&&!M.responseAllowed(q,'1,2')&&!M.responseAllowed(q,''),'Invalid choice index rejected');
        check(A.correct(q,String(q.answer)),'Selected correct option is scored');
        check(!A.correct(q,String(q.answer%q.options.length+1)),'Selected distractor is not scored');
        const shuffled={...q,options:[...q.options].reverse()};check(M.questionFingerprint(q)===M.questionFingerprint(shuffled),'Answer order does not disguise a repeated question');
      }
      const restored={...q,...M.questionExtras(JSON.parse(JSON.stringify(q)))};check(JSON.stringify(restored.options)===JSON.stringify(q.options),'Options survive serialization');checked++;
    }catch(error){const key=node.id+':'+v;if(!errors.some(e=>e.startsWith(key+' ')))errors.push(key+' '+error.message);}
  }}
  check(!errors.length,errors.join('\n'));
  for(const [category,count]of Object.entries(counts))check(count.choice/count.total>=.45&&count.choice/count.total<=.55,`About half choices within ${category}: ${count.choice}/${count.total}`);
  check(M.visibleNodes.length===264&&Object.keys(M.skillAliases).length===25,'25 overlapping skills are consolidated');
  check(M.visibleNodes.every(n=>n.deps.every(id=>!M.skillAliases[id]&&id!==n.id)),'Visible dependencies use canonical skills without self-links');
  for(const options of [['same','same'],['one'],['one',{}],Array(5).fill('one')]){let rejected=false;try{M.questionExtras({answerKind:'choice',answer:1,options});}catch{rejected=true;}check(rejected,'Malformed imported alternatives are rejected');}
  window.mixedQuestionCounts=counts;
  return `${checked} mixed-format checks; four options where appropriate, approximately 50% per area, unique correct answers, strict choice input and 25 consolidated skills passed`;
};
window.verifyMixedUI=()=>{
  const M=window.MATREE,app=window.MATREE_APP,A=window.MATREE_ADAPTIVE,p=app.profile(),$=s=>document.querySelector(s),check=(c,m)=>{if(!c)throw Error(m);};
  const saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};p.results={};p.quiz=null;p.adaptive={active:null,sessions:[],confirmations:[]};
  const submit=id=>$(id).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  const history=(id,score,date)=>({history:[{score,date,items:[0,1,2].map(v=>{const q=M.generateReviewed(id,v),correct=v<score;return {...q,response:String(q.answer+(correct?0:1000)),correct};})}]});
  try{
    p.results['f-round']=history('f-round',3,'2026-10-12T10:00:00.000Z');app.save();app.render();
    check($('.skill-node[data-node="avrunda-heltal"]').classList.contains('mastered')&&!$('.skill-node[data-node="f-round"]'),'Old rounding result appears on one consolidated card');
    p.results['avrunda-heltal']=history('avrunda-heltal',1,'2026-10-13T10:00:00.000Z');app.save();app.render();
    check($('.skill-node[data-node="avrunda-heltal"]').classList.contains('practice'),'Newer result takes precedence over old merged mastery');delete p.results['avrunda-heltal'];
    const legacy=[0,1,2].map(v=>M.generateReviewed('f-round',v));p.quiz={nodeId:'f-round',questions:legacy,answers:[],responses:[],index:0};app.save();app.openSkill('f-round');
    check($('#skill-content h2').textContent==='Avrunda heltal'&&p.quiz.nodeId==='f-round'&&p.quiz.questions[0].answer===legacy[0].answer,'Legacy merged quiz keeps its original question and answer');$('#skill-dialog').close();
    const q=M.generate('brak-forlanga',2);p.quiz={nodeId:'brak-forlanga',questions:[q,M.generate('brak-forlanga',2),M.generate('brak-forlanga',2)],answers:[],responses:[],index:0};app.save();app.openSkill('brak-forlanga');
    check($('#answer').type==='hidden'&&$('#answer-form .choice-submit').disabled&&document.querySelectorAll('#answer-form [data-choice]').length===4,'Manual choice has four buttons and no typing field');
    check(!$('#skill-content .question-text').textContent.includes('alternativets nummer'),'Student sees the question without numbered input instructions');
    $(`#answer-form [data-choice="${q.answer}"]`).click();check($('#answer').value===String(q.answer)&&!$('#answer-form .choice-submit').disabled&&p.quiz.answers.length===0,'Click selects an answer without submitting it');
    submit('#answer-form');check(p.quiz.answers[0]===true,'Click and submit scores the selected answer');$('#next-question').click();
    check($('#answer').value===''&&$('#answer-form .choice-submit').disabled,'New question clears the previous selection');
    const wrong=p.quiz.questions[1].answer%4+1;$(`#answer-form [data-choice="${wrong}"]`).click();submit('#answer-form');
    check(p.quiz.answers[1]===false&&$('#skill-content .feedback').textContent.includes(M.answerText(p.quiz.questions[1])),'Wrong choice shows the answer text in feedback');$('#skill-dialog').close();p.quiz=null;
    const session=A.create({scope:'1-3'}),v=M.responsePlan['f-count'].indexOf('C');session.pending={...M.generate('f-count',v),nodeId:'f-count',variant:v,reason:'Test av flervalsgränssnitt.'};p.adaptive.active=session;app.save();app.render();
    $('#adaptive-open').click();$('#adaptive-resume').click();const correct=session.pending.answer;
    check($('#adaptive-answer').type==='hidden'&&document.querySelectorAll('#adaptive-answer-form [data-choice]').length===4,'Student mode displays clickable options');
    $(`#adaptive-answer-form [data-choice="${correct}"]`).click();submit('#adaptive-answer-form');
    check(session.items.length===1&&session.items[0].correct&&!$('#adaptive-content').textContent.includes('Rätt svar.'),'Student choice advances without exposing grading');
    A.validate(p.adaptive);$('#adaptive-pause').click();$('#adaptive-finish').click();
    check($('#adaptive-content .review-answer-values p:first-child strong').textContent.trim()===M.answerText(session.items[0],session.items[0].response),'Teacher report shows the chosen option text');$('#adaptive-dialog').close();
    const serialized=JSON.parse(localStorage.getItem('matree.profiles.v1'));check(serialized.profiles.find(x=>x.id===p.id).results['f-round'].history[0].score===3,'Saving keeps the original merged history');
    return 'Clickable manual and student answers, cleared selection, text feedback, teacher review, merged legacy history and newer-result precedence passed';
  }finally{p.results=saved.results;p.quiz=saved.quiz;p.adaptive=saved.adaptive;$('#skill-dialog').close();$('#adaptive-dialog').close();app.save();app.render();}
};
