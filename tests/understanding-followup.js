/* Exploratory technical UI experiment. Not a blind or human validation study.
   Natural routing, no session/answer injection. Policies see DOM-only inputs.
   Unsupported natural-pass prompts are skipped, without learning from feedback.
   The old nine policies are reused unchanged for the transfer experiment. */
window.runUnderstandingFollowup=(phase='initial')=>{
  const $=s=>document.querySelector(s),P=createUnderstandingPolicy();
  const create=name=>{if($('#adaptive-dialog').open)$('#adaptive-dialog').close();if($('#skill-dialog').open)$('#skill-dialog').close();$('#profile-button').click();$('#new-profile').value=name;$('#profile-form').requestSubmit();};
  const read=(title,form)=>({prompt:$(title).textContent,options:[...document.querySelectorAll(form+' [data-choice]')].map(e=>e.lastElementChild.textContent),table:[...document.querySelectorAll('dialog[open] .question-visual tbody tr')].map(r=>[...r.children].map(c=>c.textContent))});
  function enter(view,value,form,input){
    if(value===null||value===undefined)return false;
    if(view.options.length){const number=P.numeric(String(value)),index=view.options.findIndex(o=>P.canonical(o)===P.canonical(String(value))||(Number.isFinite(number)&&Math.abs(P.numeric(o)-number)<1e-9));if(index<0)return false;document.querySelectorAll(form+' [data-choice]')[index].click();}
    else{if(!Number.isFinite(P.numeric(String(value))))return false;$(input).value=String(value);$(input).dispatchEvent(new Event('input',{bubbles:true}));}
    $(form).requestSubmit();return true;
  }
  // Separate model, frozen before its own run, designed from old transcripts.
  // It has entry-level calculator routines but no graph reading, definitions,
  // justification or general transfer rule. Original policies remain unchanged.
  function entryPolicy(category,view){
    const p=view.prompt,n=(P.canonical(p).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);
    if(category==='tal'){
      let m=p.match(/^Skriv (\d+) miljon(?:er)? och (\d+) tusen/);
      if(m)return +m[1]*1e6 + +m[2]*1000;
      if(/^Hur många miljoner är/.test(p))return n[0]/1e6;
      if(/^Skriv \d+ miljard(?:er)? som antal miljoner/.test(p))return n[0]*1000;
      m=p.match(/^Beräkna (\d+)\^(\d+)\.$/);if(m)return Number(m[1])**Number(m[2]);
      m=p.match(/^Produkten (.+) skrivs som/);if(m)return m[1].split('×').length;
      m=p.match(/^Vilken produkt skriver ut (\d+)\^(\d+)/);if(m)return Array(+m[2]).fill(m[1]).join(' × ');
      if(/^Skriv \d+\^\d+ × \d+\^\d+ som |^Beräkna \d+\^\d+ × \d+\^\d+\.|^Vilken regel gäller för x\^\d+ × x\^\d+/.test(p))return P.solve('potens-multiplikation',view);
    }
    if(category==='samband'){
      if(/^En vara kostar .+utan fast avgift/.test(p))return 'Kostnaden är proportionell mot antalet.';
      if(/^\d+ likadana pennor kostar/.test(p))return n[1]/n[0];
      if(/^Priset för n varor är/.test(p))return 'Nej, eftersom en fast avgift tillkommer.';
      if(/^Tabellen följer ett linjärt samband/.test(p)&&view.table.length>=2){
        const points=view.table.map(r=>r.map(P.numeric)),k=(points[1][1]-points[0][1])/(points[1][0]-points[0][0]),m=points[0][1]-k*points[0][0];
        return /förändringen i y/.test(p)?k:/Vilket x ger/.test(p)?(n[0]-m)/k:k*n[0]+m;
      }
      if(/^Skriv \d+ timm/.test(p))return n[0]+n[1]/60;
      if(/^Hur många minuter är/.test(p))return n[0]*60;
      if(/^En lektion börjar/.test(p))return (n[2]-n[0])*60+n[3]-n[1];
      if(/^Beräkna y = .+ när x = /.test(p))return P.solve('funktionsvarde',view);
    }
    return null;
  }
  const natural=[];
  for(const [scope,category,kind,recognize] of [
    ['9','tal','potens-multiplikation',p=>/^Skriv \d+\^\d+ × \d+\^\d+ som |^Beräkna \d+\^\d+ × \d+\^\d+\.|^Vilken regel gäller för x\^\d+ × x\^\d+/.test(p)],
    ['8','samband','funktionsvarde',p=>/^Beräkna y = .+ när x = /.test(p)],
    ['9','sannolikhet','trad-beroende',p=>/^Påsen har \d+ vita och \d+ svarta kulor\. Två kulor dras utan återläggning\./.test(p)],
    ['8','sannolikhet','trad-beroende',p=>/^Påsen har \d+ vita och \d+ svarta kulor\. Två kulor dras utan återläggning\./.test(p)]
  ].filter(c=>phase!=='entry'||c[1]!=='sannolikhet')){
    create('Naturligt '+category+' '+scope);$('#adaptive-open').click();
    for(const [selector,value] of [['#adaptive-start',scope],['#adaptive-category',category],['#adaptive-limit','30']]){$(selector).value=value;$(selector).dispatchEvent(new Event('change',{bubbles:true}));}
    const setup=$('#adaptive-selection-info').textContent;
    if($('#adaptive-setup > .primary-button').disabled){natural.push({scope,category,setup,notStarted:true});continue;}
    $('#adaptive-setup').requestSubmit();
    const transcript=[];
    for(let i=0;i<30&&$('#student-question-title');i++){
      const view=read('#student-question-title','#adaptive-answer-form'),response=phase==='entry'?entryPolicy(category,view):recognize(view.prompt)?P.solve(kind,view):null,recognized=response!==null;
      const submitted=recognized&&enter(view,response,'#adaptive-answer-form','#adaptive-answer');
      if(!submitted)$('#adaptive-skip').click();
      if($('#adaptive-error')?.textContent)throw Error('Natural response rejected: '+$('#adaptive-error').textContent);
      transcript.push({...view,recognized,response:response===null?null:String(response),action:submitted?'answer':'skip'});
    }
    if($('#adaptive-end'))$('#adaptive-end').click();
    // Read stored outcomes only AFTER the natural pass has ended. No outcomes
    // or hidden session fields are passed to recognition or response policies.
    const session=MATREE_APP.profile().adaptive.sessions.at(-1);
    if(!session||session.items.length!==transcript.length)throw Error('Transcript/archive mismatch: '+JSON.stringify({scope,category,setup,recorded:session?.items.length,observed:transcript.length,dialog:$('#adaptive-content').innerText}));
    const rows=MATREE_ADAPTIVE.summary(session);
    const outcomes=rows.map(r=>{
      let firstShownAt=null;
      for(let count=1;count<=session.items.length;count++)if(MATREE_ADAPTIVE.evidence({...session,items:session.items.slice(0,count)},r.node.id).state==='shown'){firstShownAt=count;break;}
      return {id:r.node.id,title:r.node.title,state:r.state,right:r.right,total:r.total,firstShownAt,prerequisites:r.node.deps.map(id=>({id,tested:session.items.some(i=>MATREE.resolveSkillId(i.nodeId)===id)}))};
    });
    natural.push({scope,category,setup,selection:session.selection,endReason:session.endReason,transcript:transcript.map((v,i)=>({...v,nodeId:session.items[i].nodeId,correct:session.items[i].correct,skipped:session.items[i].skipped})),outcomes});
  }
  if(phase==='entry')return {method:'Separate frozen entry-routine model; natural UI routing; no hidden answers; max30.',natural};
  // Frozen transfer set. Independent reference solutions fixed before running.
  // A mismatch is not automatically a conceptual deficit: also inspect parsing
  // and representation demands. Null/NaN denotes an unsupported representation.
  const transfers=[
    {kind:'potens-multiplikation',prompt:'Beräkna 2^3 × 3^2.',expected:72,reason:'8 × 9 = 72; baserna är olika.'},
    {kind:'brak-division',prompt:'Hur många halvlitersflaskor kan fyllas med 3/2 liter?',expected:3,reason:'1,5 liter delat med 0,5 liter ger tre flaskor.'},
    {kind:'kvadreringsregel',prompt:'Utveckla (2x + 3)². Vilken koefficient får x?',expected:12,reason:'4x² + 12x + 9; korsprodukten är 2·2x·3.'},
    {kind:'klot-yta',prompt:'Ett halvklot har radien 3 cm. Beräkna hela begränsningsytans area, inklusive den plana cirkelytan. Använd π = 3,14.',expected:84.78,reason:'Krökt yta 2πr² plus plan cirkelyta πr² ger 3·3,14·9.'},
    {kind:'funktionsvarde',prompt:'Ange värdet på y när x är två enligt tabellen.',table:[['x','y'],['0','1'],['1','3'],['2','5']],expected:5,reason:'Tabellens rad med x = 2 har y = 5.'},
    {kind:'upprepad-forandring',prompt:'Ett värde höjs med 20 % och sänks sedan med 20 %. Slutvärdet är 96. Vad var ursprungsvärdet?',expected:100,reason:'96 / (1,2·0,8) = 100.'},
    {kind:'viktat-medel',prompt:'Grupp A har 2 elever med medelvärdet 0. Grupp B har 2 elever med medelvärdet 10. Grupp C har 6 elever med medelvärdet 20. Vad är gruppernas gemensamma medelvärde?',expected:14,reason:'(2·0 + 2·10 + 6·20) / 10 = 14.'},
    {kind:'trad-beroende',prompt:'Påsen har 2 vita och 3 svarta kulor. Två kulor dras utan återläggning. Hur stor är sannolikheten för en vit och en svart kula i valfri ordning?',expected:.6,reason:'2/5·3/4 + 3/5·2/4 = 3/5.'},
    {kind:'moms',prompt:'Priset med moms är 1250 kr. Momssatsen är 25 %. Vad är momsen i kronor?',expected:250,reason:'Nettopris 1250/1,25 = 1000; moms 1250 − 1000 = 250.'}
  ].map(t=>{const response=P.solve(t.kind,{prompt:t.prompt,table:t.table||[],options:[]}),value=response===null?NaN:P.numeric(String(response));return {...t,response:response===null?null:String(response),supported:Number.isFinite(value),correct:Number.isFinite(value)&&Math.abs(value-t.expected)<1e-9};});
  // Exactly ten attempts; first visible choice every time. No learning from keys,
  // no retries until a chosen outcome, no assumption of four choices per item.
  create('Omtag första alternativet');const attempts=[];
  for(let attempt=1;attempt<=10;attempt++){
    MATREE_APP.openSkill('val-lagesmatt');$('[data-start="val-lagesmatt"]').click();const questions=[];
    for(let i=0;i<3;i++){
      const view=read('#manual-question-title','#answer-form');
      if(!view.options.length)throw Error('Guessing experiment encountered non-choice item');
      $('#answer-form [data-choice]').click();$('#answer-form').requestSubmit();
      questions.push({...view,selected:view.options[0],correct:!$('#skill-content .feedback').classList.contains('wrong')});$('#next-question').click();
    }
    const score=MATREE_APP.latest('val-lagesmatt').score;attempts.push({attempt,questions,score,status:score===3?'Visad kunskap':'Behöver följas upp'});$('#skill-dialog').close();
  }
  return {method:'UI-driven technical experiment; frozen visible-input policies; archived outcomes inspected only after natural passes.',natural,transfers,attempts};
};
