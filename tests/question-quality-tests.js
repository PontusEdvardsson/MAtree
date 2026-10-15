/* Regression checks for issues found by reading and rendering the sampled bank. */
window.verifyQuestionQuality=()=>{
  const M=MATREE,check=(c,m)=>{if(!c)throw Error(m);};
  for(const id of ['f-half','brak-del-hel'])for(let i=0;i<30;i++){
    const q=M.generateReviewed(id,1);
    check(q.prompt.includes('utan att förkorta'),'Denominator question specifies the original, unreduced partition');
  }
  for(let i=0;i<60;i++){
    const q=M.generate('brak-decimal',0);
    check(q.options.every(s=>!s.includes('/')),'Decimal-form questions offer decimal answers');
    const raw=M.generateReviewed('tiodivision',1),converted=M.toChoice('tiodivision',1,raw);
    check(Math.abs(M.parseAnswer(converted.options[converted.answer-1])-raw.answer)<1e-12,'Place-value alternatives keep every necessary decimal');
    check(!M.questionStem(converted).includes('avrundade'),'Exact decimal division does not introduce rounding');
  }
  check(M.answerText({answer:1/3,answerKind:'fraction'})==='1/3','Fraction answer key is exact, not a rounded decimal');
  check(M.generateReviewed('sortera-tal',1).prompt.includes(';'),'Decimal lists use unambiguous separators');
  check(!M.questionAnswerHint({prompt:'Skriv 1/1000 i decimalform.',answer:.001,answerKind:'decimal'}).includes('bråk'),'Small decimal-form questions do not suggest fraction notation');
  check(M.questionAnswerHint(M.generateReviewed('avrunda-decimal',0))==='Skriv ett heltal.','Integer rounding uses the matching answer hint');
  const conversion=M.generateReviewed('brak-decimal',2),fraction=conversion.prompt.match(/\d+\/\d+/)[0],older={...conversion};delete older.responseFormat;
  check(conversion.responseFormat==='decimal'&&!M.responseAllowed(conversion,fraction),'New decimal conversions require conversion instead of copying the given fraction');
  check(M.responseAllowed(conversion,M.fmt(conversion.answer)),'Decimal conversion accepts Swedish decimal notation');
  check(M.responseAllowed(older,fraction),'Older saved conversions retain their original numerical grading');
  check(M.questionExtras(conversion).responseFormat==='decimal','Response format survives backup serialization');
  check(M.validateDraft(conversion,M.makeDraft(conversion,'0,'))?.value==='0,','An unfinished decimal answer survives draft validation');
  check(M.draftQuestionKey(older)===JSON.stringify([older.prompt,older.answer,older.unit,older.answerKind||null,null,null,older.visual||null]),'Older paused questions keep the same draft identity');
  for(let i=0;i<40;i++){
    check(M.generate('primtal',0).options.every(s=>Number.isInteger(M.parseAnswer(s))),'Prime-number alternatives all contain numbers, not definition statements');
    for(const v of [0,1]){
      const raw=M.generateReviewed('brak-jamfora',v),q=M.toChoice('brak-jamfora',v,raw),original=[...raw.prompt.matchAll(/\d+\/\d+/g)].map(m=>m[0]);
      check(q.options.length===2&&original.every(s=>q.options.includes(s)),'Fraction comparisons retain the two fractions as written');
    }
    check(!M.generate('gemensam-namnare',1).options.includes('−0'),'Alternatives do not display negative zero');
    check(M.generateReviewed('hastighet',0).prompt.startsWith('En bil'),'High-speed travel uses a plausible vehicle');
    check(M.generateReviewed('f-combinations',0).prompt.includes('ett par byxor'),'Clothing choices count pairs of trousers');
    check(M.generateReviewed('f-combinations',2).prompt.includes('Alla färger finns i varje storlek'),'Inverse combination question states that all combinations exist');
    check(M.generateReviewed('moms',0).prompt.startsWith('Priset utan moms är '),'VAT question uses a complete sentence');
  }
  const host=document.createElement('div');host.style='position:absolute;left:-10000px;width:500px';document.body.append(host);
  try{
    host.innerHTML=M.renderQuestionVisual(M.generateReviewed('koordinater',0));
    const labels=[...host.querySelectorAll('svg text')],zero=labels.find(e=>e.textContent==='0').getBBox(),minusOne=labels.find(e=>M.parseAnswer(e.textContent)===-1).getBBox();
    check(zero.x>minusOne.x+minusOne.width+1,'Graph origin and minus-one labels do not merge into minus ten');
  }finally{host.remove();}
  const legacy={prompt:'Skriv 5/8 i decimalform.',answer:1,answerKind:'choice',options:['5/8','1/2']};
  check(M.questionExtras(legacy).options[0]==='5/8'&&M.answerText(legacy)==='5/8','Saved older choices retain their original order and answer text');
  const app=MATREE_APP,p=app.profile(),saved={quiz:p.quiz,adaptive:p.adaptive},$=s=>document.querySelector(s),submit=s=>$(s).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  try{
    p.quiz={nodeId:'brak-decimal',questions:[conversion,conversion,conversion],answers:[],responses:[],index:0};app.openSkill('brak-decimal');
    $('#answer').value=fraction;submit('#answer-form');
    check(p.quiz.answers.length===0&&$('#answer-error').textContent.includes('decimalform'),'Manual conversion gives format guidance without grading an unconverted fraction');
    $('#answer').value=M.fmt(conversion.answer);submit('#answer-form');check(p.quiz.answers[0]===true,'Manual conversion grades the decimal answer correctly');$('#skill-dialog').close();p.quiz=null;
    const session=MATREE_ADAPTIVE.create({scope:'7',limit:30});session.pending={...conversion,nodeId:'brak-decimal',variant:2,reason:'Formatkontroll.'};p.adaptive={active:session,sessions:[],confirmations:[]};app.save();app.render();$('#adaptive-open').click();$('#adaptive-resume').click();
    $('#adaptive-answer').value=fraction;submit('#adaptive-answer-form');
    check(session.items.length===0&&$('#adaptive-error').textContent.includes('decimalform'),'Student conversion gives format guidance without counting a submitted answer');
    $('#adaptive-answer').value=M.fmt(conversion.answer);submit('#adaptive-answer-form');check(session.items[0]?.correct,'Student conversion grades the decimal answer correctly');
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());p.quiz=saved.quiz;p.adaptive=saved.adaptive;app.save();app.render();}
  return 'Question-quality regressions passed: wording, exact decimal/fraction representation, comparable alternatives, plausible contexts, unchanged saved choices and separated graph labels';
};
