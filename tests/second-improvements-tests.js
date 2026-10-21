/* Technical presentation checks; synthetic input fixtures are not pupil experiments. */
window.secondCheck=(value,message)=>{if(!value)throw Error(message);};
window.verifySecondMath=()=>{
  const M=MATREE,check=secondCheck,host=document.createElement('div');
  const cases=['1/2','−3/4','0/7','1,5/2','□/5','3/□','(x + 1)/5 − x/4','2 × 3/(4 × 5)','förändring i y/förändring i x','½ + ¾'];
  const rows=cases.map(raw=>{
    host.innerHTML=M.renderMathText(raw);
    check(host.querySelector('.math-fraction'),'Missing stacked fraction '+raw);
    check(host.textContent===raw,'Source text changed '+raw);
    return {raw,fractions:[...host.querySelectorAll('.math-fraction')].map(e=>[e.dataset.numerator,e.dataset.denominator])};
  });
  for(const raw of ['km/h','m/s','g/cm³','=A5/B5','2026/10/21']){
    host.innerHTML=M.renderMathText(raw);check(!host.querySelector('.math-fraction'),'Non-fraction converted '+raw);
  }
  host.innerHTML=M.renderMathText('<img src=x onerror=alert(1)> 1/2');check(!host.querySelector('img'),'Unsafe HTML');
  host.innerHTML=M.renderQuestionVisual({prompt:'',answer:0,unit:'',visual:{type:'tree',first:['1/3','2/3'],next:[['1/3','2/3'],['1/3','2/3']]}});
  check(host.querySelectorAll('.math-svg-fraction').length===6,'Tree labels stacked');
  const saved={prompt:'Beräkna 1/2 + 1/4.',answer:.75,unit:'',answerKind:'fraction',explanation:'1/2 = 2/4. Svaret är 3/4.'},before=JSON.stringify(saved);
  M.renderMathText(saved.prompt);M.renderAnswerFields(saved,'answer');check(JSON.stringify(saved)===before,'Stored question mutated');
  host.innerHTML='<div class="review-answer-values"><p><span>Rätt svar</span><strong>'+M.renderMathText('3/4')+'</strong></p></div>';document.body.append(host);
  check(getComputedStyle(host.querySelector('.math-fraction')).display==='inline-grid','Report keeps vertical fraction grid');host.remove();
  return {cases:rows,unitsAndLegacySyntax:'unchanged',svgFractions:6,storedQuestion:'unchanged'};
};
window.secondInputFixture=()=>{
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  MATREE_APP.openSkill('brak-multiplikation');MATREE_APP.startQuiz('brak-multiplikation');
  // Frozen synthetic UI fixture: exercises events, not bank knowledge or pupil performance.
  const q={prompt:'Beräkna 1/2 + 1/4.',answer:.75,unit:'',answerKind:'fraction',explanation:'1/2 = 2/4. Då blir summan 3/4.'};
  const quiz=MATREE_APP.profile().quiz;quiz.questions=[structuredClone(q),structuredClone(q),structuredClone(q)];quiz.index=0;quiz.answers=[];quiz.responses=[];delete quiz.draft;
  MATREE_APP.openSkill('brak-multiplikation');
  secondCheck(document.querySelector('#answer').type==='text'&&!document.querySelector('.fraction-entry'),'Single input is default');
  return 'synthetic fraction form';
};
window.verifySecondDrafts=()=>{
  const M=MATREE,$=s=>document.querySelector(s),check=secondCheck,q=MATREE_APP.profile().quiz.questions[0];
  for(const raw of ['0/3','−2/5','2/','1 / 2','0,75','0']){
    M.restoreDraft(q,M.makeDraft(q,raw),'answer');
    check($('#answer').value===raw,'Draft changed '+raw);
    check($('#answer').type==='text','Single field preserves legacy drafts '+raw);
    if(raw.includes('/')&&!raw.endsWith('/'))check($('[data-fraction-preview]').querySelector('.math-fraction'),'Complete draft has preview');
  }
  M.restoreDraft(q,M.makeDraft(q,''),'answer');return {drafts:'zero, negative, unfinished, spaces, decimal, integer preserved'};
};
window.verifySecondMobile=()=>{
  const $=s=>document.querySelector(s),check=secondCheck;
  check($('#map-filter-panel').hidden,'Mobile starts folded');
  check($('#map-title').textContent.includes('alla år')&&$('#map-title').textContent.includes('alla moment'),'Selection outside filters');
  $('#map-filter-toggle').click();check(!$('#map-filter-panel').hidden,'Filters reachable');
  $('#search').value='bråk';$('#search').dispatchEvent(new Event('input',{bubbles:true}));
  $('#map-filter-toggle').click();check($('#map-filter-panel').hidden&&!$('#map-search-summary').hidden&&$('#map-search-summary').textContent.includes('bråk'),'Folded active search visible');
  $('#map-filter-toggle').click();$('#reset-filters').click();
  $('#map-filter-toggle').click();
  return {default:'folded',selection:'visible',search:'visible while folded'};
};
window.verifySecondConnections=()=>{
  const $=s=>document.querySelector(s),check=secondCheck,map=$('#skill-map');
  const from=map.querySelector('.connection').dataset.from,node=from.startsWith('group:')?map.querySelector('[data-group="'+from.slice(6)+'"]'):map.querySelector('[data-node="'+from+'"]');
  const edges=map.querySelectorAll('.connection').length,graph=JSON.stringify(MATREE.detailNodes.map(n=>[n.id,n.deps,n.dependencyReasons]));
  node.focus();let related=map.querySelectorAll('.connection.related').length;check(related>0,'Keyboard selects relationships');
  map.dispatchEvent(new PointerEvent('pointerleave'));check(map.querySelectorAll('.connection.related').length===related,'Selection survives hover leave');
  node.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));
  $('#map-connections').click();check(map.classList.contains('show-connections'),'Explicit all edges');
  $('#map-connections').click();check(map.querySelectorAll('.connection').length===edges&&graph===JSON.stringify(MATREE.detailNodes.map(n=>[n.id,n.deps,n.dependencyReasons])),'Graph unchanged');
  return {edges,related,keyboardAndTouch:'pinned',graph:'unchanged'};
};
window.secondChoiceFixture=()=>{
  secondInputFixture();
  const quiz=MATREE_APP.profile().quiz;
  quiz.questions[0]={prompt:'Vilket bråk är lika med 1/2?',answer:2,unit:'',answerKind:'choice',options:['1/4','2/4','3/4','4/4'],explanation:'2/4 och 1/2 är lika stora.'};
  MATREE_APP.openSkill('brak-multiplikation');
  secondCheck(document.querySelectorAll('.choice-button .math-fraction').length===4,'Choice fractions stacked');
};
window.secondVisualInventory=()=>{
  const rows=[];
  for(const n of MATREE.detailNodes)for(let variant=0;variant<3;variant++){
    const q=MATREE.generate(n.id,variant);if(!['dots','shape','numberline'].includes(q.visual?.type))continue;
    const host=document.createElement('div');host.innerHTML=MATREE.renderQuestionVisual(q);
    rows.push({id:n.id,variant,prompt:MATREE.questionStem(q),type:q.visual.type,accessibleName:host.querySelector('svg')?.getAttribute('aria-label')});
  }
  return {note:'One generated example per current template; names assessed in relation to each prompt, not pupil evidence.',rows};
};
