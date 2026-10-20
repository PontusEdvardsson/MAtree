/* Frozen before the recorded run. A calculator-capable entry model with one
   explicit misconception: the bag NEVER changes, even without replacement.
   Ordered paths multiply; either order adds both paths. Unsupported => skip.
   If a predicted answer is absent among choices, choose first and flag guess.
   One natural year-eight pass <=30; eight fixed retakes on another control.
   Only rendered prompts/choices enter the policy. Archive is read after end. */
window.createProbabilityMisconception=()=>{
  const P=createUnderstandingPolicy(),nums=s=>(P.canonical(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
  return view=>{
    const p=view.prompt,n=nums(p),[a,b,c]=n;
    if(/^En påse har \d+ röd/.test(p))return {value:`${a}/${a+b}`,rule:'single-event'};
    if(/^Ett lyckohjul har/.test(p))return {value:`${b}/${a}`,rule:'single-event'};
    if(/^En vanlig rättvis tärning/.test(p))return {value:`${a-1}/6`,rule:'single-event'};
    if(p==='Vilket tal kan vara en sannolikhet?')return {value:view.options.find(o=>P.numeric(o)>=0&&P.numeric(o)<=1)??null,rule:'range'};
    if(/sannolikheten för en säker händelse/.test(p))return {value:1,rule:'certain'};
    if(/sannolikheten för en omöjlig händelse/.test(p))return {value:0,rule:'impossible'};
    if(/^Du väljer en tröja/.test(p))return {value:a*b*c,rule:'independent-choices'};
    if(/^En kod har/.test(p))return {value:b**a,rule:'independent-choices'};
    if(/^Det finns \d+ huvudrätter/.test(p))return {value:a*(b+1),rule:'independent-choices'};
    if(/^Sannolikheten för vinst är|^Sannolikheten för att det inte regnar är/.test(p))return {value:`${b-a}/${b}`,rule:'complement'};
    if(/^Sannolikheten för fel är/.test(p))return {value:100-a,rule:'complement'};
    if(/^Vinstsannolikheten är/.test(p))return {value:/Hur många försök/.test(p)?c*b/a:c*a/b,rule:'expected-count'};
    if(/^Vid \d+ försök är det förväntade antalet/.test(p))return {value:'Nej',rule:'expected-not-guaranteed'};
    if(/^Påsen har \d+ vita och \d+ svarta kulor\. Två kulor dras/.test(p)){
      const colors=p.match(/först dra en (vit|svart) kula och sedan en (vit|svart)/);
      if(colors){const first=colors[1]==='vit'?a:b,second=colors[2]==='vit'?a:b;return {value:`${first*second}/${(a+b)**2}`,rule:'bag-unchanged-ordered'};}
    }
    if(/^En påse har \d+ vita och \d+ svarta kulor/.test(p)&&/exakt en vit kula, oavsett ordning/.test(p))return {value:`${2*a*b}/${(a+b)**2}`,rule:'bag-unchanged-either-order'};
    return {value:null,rule:'unsupported-skip'};
  };
};
window.runProbabilityMisconception=()=>{
  const $=s=>document.querySelector(s),P=createUnderstandingPolicy(),policy=createProbabilityMisconception();
  function profile(name){if($('#adaptive-dialog').open)$('#adaptive-dialog').close();if($('#skill-dialog').open)$('#skill-dialog').close();$('#profile-button').click();$('#new-profile').value=name;$('#profile-form').requestSubmit();}
  const read=(title,form)=>({prompt:$(title).textContent,options:[...document.querySelectorAll(form+' [data-choice]')].map(e=>e.lastElementChild.textContent)});
  profile('Fryst felidé sannolikhet');$('#adaptive-open').click();
  for(const [s,value] of [['#adaptive-start','8'],['#adaptive-category','sannolikhet'],['#adaptive-limit','30']]){$(s).value=value;$(s).dispatchEvent(new Event('change',{bubbles:true}));}
  if($('#adaptive-setup > .primary-button').disabled)throw Error('Year-eight selection unexpectedly unavailable');
  const setup=$('#adaptive-selection-info').textContent;$('#adaptive-setup').requestSubmit();const transcript=[];
  for(let i=0;i<30&&$('#student-question-title');i++){
    const view=read('#student-question-title','#adaptive-answer-form'),decision=policy(view);let choiceGuess=false,selected=null;
    if(decision.value===null)$('#adaptive-skip').click();
    else{
      if(view.options.length){const value=P.numeric(String(decision.value));let index=view.options.findIndex(o=>P.canonical(o)===P.canonical(String(decision.value))||(Number.isFinite(value)&&Math.abs(P.numeric(o)-value)<1e-9));if(index<0){index=0;choiceGuess=true;}selected=view.options[index];document.querySelectorAll('#adaptive-answer-form [data-choice]')[index].click();}
      else{if(!Number.isFinite(P.numeric(String(decision.value))))throw Error('Unparseable policy response');$('#adaptive-answer').value=String(decision.value);$('#adaptive-answer').dispatchEvent(new Event('input',{bubbles:true}));selected=String(decision.value);}
      $('#adaptive-answer-form').requestSubmit();if($('#adaptive-error')?.textContent)throw Error('Rejected response: '+$('#adaptive-error').textContent);
    }
    transcript.push({...view,...decision,choiceGuess,selected});
  }
  if($('#adaptive-end'))$('#adaptive-end').click();
  // Outcomes and graph metadata are inspected only AFTER archival, never input
  // to the response policy or used to select an easier next question.
  const s=MATREE_APP.profile().adaptive.sessions.at(-1);
  if(!s||s.items.length!==transcript.length)throw Error('Archive/transcript mismatch');
  const outcomes=MATREE_ADAPTIVE.summary(s).map(r=>{
    let firstShownAt=null;for(let i=1;i<=s.items.length;i++)if(MATREE_ADAPTIVE.evidence({...s,items:s.items.slice(0,i)},r.node.id).state==='shown'){firstShownAt=i;break;}
    return {id:r.node.id,title:r.node.title,state:r.state,right:r.right,total:r.total,firstShownAt,prerequisites:r.node.deps.map(id=>({id,tested:s.items.some(i=>MATREE.resolveSkillId(i.nodeId)===id)}))};
  });
  const natural={scope:s.scope,category:s.category,selection:s.selection,setup,endReason:s.endReason,transcript:transcript.map((q,i)=>({...q,nodeId:s.items[i].nodeId,correct:s.items[i].correct,skipped:s.items[i].skipped})),outcomes};
  // Held-out contrasts fixed before running. Same policy, no reference input.
  const contrasts=[
    {prompt:'Påsen har 2 vita och 3 svarta kulor. Två kulor dras utan återläggning. Hur stor är sannolikheten att först dra en vit kula och sedan en vit kula?',expected:.1},
    {prompt:'Påsen har 2 vita och 3 svarta kulor. Två kulor dras med återläggning. Hur stor är sannolikheten att först dra en vit kula och sedan en vit kula?',expected:.16},
    {prompt:'En påse har 2 vita och 3 svarta kulor. Du drar två utan återläggning. Vad är sannolikheten för exakt en vit kula, oavsett ordning?',expected:.6}
  ].map(q=>{const decision=policy({prompt:q.prompt,options:[]});return {...q,...decision,correct:Math.abs(P.numeric(String(decision.value))-q.expected)<1e-9};});
  profile('Åtta omtag funktionsbegrepp');const attempts=[];
  for(let attempt=1;attempt<=8;attempt++){
    MATREE_APP.openSkill('funktion-begrepp');$('[data-start="funktion-begrepp"]').click();const questions=[];
    for(let i=0;i<3;i++){
      const view=read('#manual-question-title','#answer-form');if(!view.options.length)throw Error('Expected choice question');
      $('#answer-form [data-choice]').click();$('#answer-form').requestSubmit();questions.push({...view,selected:view.options[0],correct:!$('#skill-content .feedback').classList.contains('wrong')});$('#next-question').click();
    }
    const score=MATREE_APP.latest('funktion-begrepp').score;attempts.push({attempt,questions,score,status:score===3?'Visad kunskap':'Behöver följas upp'});$('#skill-dialog').close();
  }
  return {method:'Frozen misconception; natural course routing; DOM-only inputs; one pass<=30 and exactly eight retakes.',natural,contrasts,attempts};
};
