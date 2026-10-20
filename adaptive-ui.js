(() => {
  'use strict';
  const A=window.MATREE_ADAPTIVE, app=window.MATREE_APP, M=window.MATREE;
  const $=s=>document.querySelector(s), esc=app.esc, dialog=$('#adaptive-dialog'), content=$('#adaptive-content');
  let reportSessionId=null, savedTimer;
  const profile=()=>app.profile(), state=()=>profile().adaptive;
  const date=value=>new Date(value).toLocaleString('sv-SE',{dateStyle:'short',timeStyle:'short'});
  const byId=id=>M.visibleNodes.find(n=>n.id===M.resolveSkillId(id));
  function open(){if(!dialog.open)dialog.showModal();dialog.scrollTop=0;}
  function top(title){dialog.setAttribute('aria-labelledby','adaptive-dialog-title');return `<div class="dialog-top"><h2 id="adaptive-dialog-title">${title}</h2><button class="icon-button" id="adaptive-close" aria-label="Stäng">×</button></div>`;}
  const answerHint=q=>M.questionAnswerHint(q);

  function responseText(item){return item.skipped?'Jag vet inte':item.response?M.answerText(item,item.response)+(item.unit?' '+item.unit:''):'Svar saknas i äldre underlag';}
  function answerRow(item,index){
    return '<details class="answer-review"><summary>'+(index+1)+'. '+esc(byId(item.nodeId).title)+' · '+(item.skipped?'Överhoppad':item.correct?'Rätt':'Fel')+'</summary><p class="review-prompt">'+esc(M.questionStem(item))+'</p>'+M.renderQuestionVisual(item)+'<div class="review-answer-values"><p><span>Elevens svar</span><strong>'+esc(responseText(item))+'</strong></p><p><span>Rätt svar</span><strong>'+esc(M.answerText(item))+' '+esc(item.unit)+'</strong></p></div>'+(item.options?'<details class="option-review"><summary>Visa de sparade svarsalternativen</summary><ol>'+item.options.map(o=>'<li>'+esc(o)+'</li>').join('')+'</ol></details>':'')+'<p>'+esc(item.explanation)+'</p><p class="muted small">Urval: '+esc(item.reason)+'</p></details>';
  }

  let reportAnswerFilter='all',filterSessionId=null;
  function followupSuggestions(session){
    const rows=A.summary(session),shown=new Set([...rows.filter(r=>r.state==='shown').map(r=>r.node.id),...(session.known||[]).map(M.resolveSkillId)]),candidates=new Map();
    for(const row of rows.filter(r=>['followup','partial'].includes(r.state))){
      const deps=row.state==='followup'?row.node.deps.filter(id=>!shown.has(id)):[];
      for(const id of deps.length?deps:[row.node.id]){
        const target=byId(id);if(!target||shown.has(id))continue;
        if(!candidates.has(id))candidates.set(id,{node:target,rows:[],prerequisite:id!==row.node.id});
        candidates.get(id).rows.push(row);
      }
    }
    return [...candidates.values()].sort((a,b)=>b.rows.filter(r=>r.state==='followup').length-a.rows.filter(r=>r.state==='followup').length||a.node.depth-b.node.depth||a.node.title.localeCompare(b.node.title,'sv')).slice(0,3);
  }
  function suggestionCard(s,session){
    const facts=s.rows.map(r=>r.node.title+' ('+r.right+'/'+r.total+' rätt'+(r.items.some(i=>i.skipped)?', '+r.items.filter(i=>i.skipped).length+' överhoppade':'')+')').join('; ');
    const tried=session.items.some(i=>M.resolveSkillId(i.nodeId)===s.node.id),outside=!A.scopedPool(session).some(n=>n.id===s.node.id);
    return '<article class="followup-suggestion"><h4>'+esc(s.node.title)+'</h4><p>'+esc((s.prerequisite?'En direkt förkunskap att undersöka efter ':'Komplettera underlaget för ')+facts)+'.</p><p class="muted small">'+(tried?'Det finns svar att granska i passet.':'Delmomentet prövades inte i passet.')+(outside?' Utanför passets årskurs- eller områdesurval; undersök det separat.':'')+'</p><p class="small">Elev: '+esc(profile().name)+' · Manuell kontroll</p><div class="followup-actions"><button class="primary-button" data-report-start="'+esc(s.node.id)+'" aria-label="Starta eller fortsätt kontroll av '+esc(s.node.title)+' för '+esc(profile().name)+'">'+(profile().quiz&&M.resolveSkillId(profile().quiz.nodeId)===s.node.id?'Fortsätt kontroll':'Starta kontroll')+' →</button><button class="secondary-button" data-adaptive-node="'+esc(s.node.id)+'">Granska underlaget</button></div></article>';
  }
  function filteredAnswers(session){
    return session.items.map((item,index)=>({item,index})).filter(({item})=>reportAnswerFilter==='incorrect'?!item.correct&&!item.skipped:reportAnswerFilter==='skipped'?item.skipped:reportAnswerFilter==='partial'?A.evidence(session,item.nodeId).state==='partial':true);
  }
  function answerGroups(session){
    const filtered=filteredAnswers(session),ids=[...new Set(filtered.map(({item})=>M.resolveSkillId(item.nodeId)))];
    return ids.length?ids.map((id,i)=>'<details class="report-answer-group" data-answer-node="'+esc(id)+'"'+(i===0||reportAnswerFilter!=='all'?' open':'')+'><summary>'+esc(byId(id).title)+' <span class="report-badge">'+filtered.filter(x=>M.resolveSkillId(x.item.nodeId)===id).length+'</span></summary>'+filtered.filter(x=>M.resolveSkillId(x.item.nodeId)===id).map(x=>answerRow(x.item,x.index)).join('')+'</details>').join(''):'<p class="muted">Inga uppgifter matchar filtret.</p>';
  }
  function refreshAnswerFilter(){
    const session=state().sessions.find(s=>s.id===reportSessionId);if(!session)return;
    $('#report-answer-groups').innerHTML=answerGroups(session);$('#report-answer-count').textContent=filteredAnswers(session).length+' av '+session.items.length+' uppgifter';
    content.querySelectorAll('[data-answer-filter]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.answerFilter===reportAnswerFilter));b.classList.toggle('selected',b.dataset.answerFilter===reportAnswerFilter);});
  }

  let reportPosition=null;
  function rememberReport(){reportPosition={id:reportSessionId,scroll:dialog.scrollTop,open:[...content.querySelectorAll('details')].map(d=>d.open)};}
  function sessionSkill(id){
    const session=state().sessions.find(s=>s.id===reportSessionId),node=byId(id);if(!session||!node)return;
    if(dialog.open)rememberReport();dialog.close();app.openSkill(node.id);
    const evidence=A.evidence(session,node.id),items=evidence.items;
    $('#skill-content').innerHTML='<div class="dialog-top"><div><div class="eyebrow">UNDERLAG FRÅN VALT PASS</div><h2 id="skill-dialog-title">'+esc(node.title)+'</h2></div><button class="icon-button" data-close="skill-dialog" aria-label="Stäng">×</button></div>'+
      '<button class="text-button report-return" data-adaptive-report="'+esc(session.id)+'" data-restore-report="true">← Tillbaka till passets sammanställning</button>'+
      '<p class="report-meta"><strong>'+esc(profile().name)+'</strong> · '+A.scopeLabel(session)+' · '+date(session.started)+'</p>'+
      '<p class="pass-outcome">'+(items.length?evidence.right+'/'+evidence.total+' rätt · '+({shown:'Visad i passet',followup:'Behöver följas upp',partial:'Begränsat underlag'})[evidence.state]:'Delmomentet prövades inte i detta pass.')+'</p>'+
      '<p>'+esc(node.description)+'</p><section class="pass-answers" aria-label="Elevens svar i valt pass">'+items.map(answerRow).join('')+'</section>'+
      '<div class="dialog-section"><h3>Direkta förkunskaper att undersöka</h3>'+(node.deps.length?node.deps.map(dep=>'<button class="progress-skill" data-adaptive-node="'+esc(dep)+'">'+esc(byId(dep).title)+' →</button>').join(''):'<p class="muted small">En utgångspunkt i kartan.</p>')+'</div>'+
      '<div class="dialog-actions"><button class="secondary-button" data-current-skill="'+esc(node.id)+'">Öppna samlat underlag och kontroll</button></div>';
    $('#skill-dialog').scrollTop=0;
  }

  const duration=minutes=>minutes<60?minutes+' min':Math.floor(minutes/60)+' tim'+(minutes%60?' '+minutes%60+' min':'');
  function updateEstimate(){
    const scope=$('#adaptive-start')?.value,category=$('#adaptive-category')?.value||null,limit=$('#adaptive-limit'),retest=$('#adaptive-retest'),box=$('#adaptive-estimate');if(!limit||!box)return;
    const all=limit.value==='all',selection=A.scopedPool({scope,category,selection:'course',mode:all?'all':'adaptive'});
    $('#adaptive-setup > .primary-button').disabled=!selection.length;
    $('#adaptive-selection-info').textContent=selection.length?A.scopeLabel({scope,category})+' · '+selection.length+' delmoment'+(all?' inklusive fördjupning':' i basen'):!all&&A.estimateAll(scope,category).skills?'Det finns inga basmoment i detta urval. Välj Testa alla för att ta med fördjupning.':'Inga delmoment finns i detta urval. Välj ett annat område eller en annan årskurs.';
    if(all&&!retest.disabled){retest.dataset.previous=String(retest.checked);retest.checked=true;retest.disabled=true;}
    if(!all&&retest.disabled){retest.disabled=false;retest.checked=retest.dataset.previous==='true';}
    box.hidden=!all;$('#adaptive-session-help').hidden=all;
    if(all){
      const e=A.estimateAll(scope,category);
      box.innerHTML='<strong>Testa alla · '+e.skills+' delmoment · '+esc(A.scopeLabel({scope,category}))+'</strong>'+
        '<p>'+e.minQuestions+'–'+e.maxQuestions+' frågor · 2–4 frågor per delmoment.</p>'+
        '<p>Beräknad arbetstid: cirka '+duration(e.minMinutes)+'–'+duration(e.maxMinutes)+', räknat på 1 minut per fråga. Elevens tempo kan ge kortare eller längre tid; pauser tillkommer.</p>'+
        '<p class="small">Alla '+e.core+' basmoment'+(e.extension?' och '+e.extension+' fördjupningsmoment':'')+' i det valda urvalet prövas, även tidigare visade färdigheter. Svårigheter med förkunskaper stoppar inte övriga delmoment. Resultaten bedöms fortfarande var för sig.</p>'+
        '<p class="small">Dela gärna upp kartläggningen över flera tillfällen. Pausa för att spara frågan och ett påbörjat svar.</p>';
    }
  }
  document.addEventListener('change',event=>{if(['adaptive-start','adaptive-category','adaptive-limit'].includes(event.target.id))updateEstimate();});
  function setup(){
    open();dialog.classList.remove('student-mode');content.classList.remove('teacher-report');
    const active=state().active,last=state().sessions.at(-1);
    content.innerHTML=`${top('Automatisk kartläggning')}<p>Aktiv elevprofil: <strong>${esc(profile().name)}</strong></p><p>Eleven får en uppgift i taget, väljer svarsalternativ eller skriver ett eget svar. Vid återkommande rätt svar prövas fler moment; vid svårigheter undersöks tidigare delmoment inom urvalet.</p>${active?`<div class="session-resume"><p>${A.scopeLabel(active)} · pausat pass med ${active.items.length} sparade svar.</p><button class="primary-button" id="adaptive-resume">Fortsätt elevens pass →</button><button class="secondary-button" id="adaptive-finish">Avsluta och se underlaget</button></div>`:`<form id="adaptive-setup"><label for="adaptive-start">Årskursurval</label><select id="adaptive-start"><option value="1-3">Åk 1–3</option><option value="4-6">Åk 4–6</option><option value="7">Åk 7</option><option value="8">Åk 8</option><option value="9">Åk 9</option></select><label for="adaptive-category">Kunskapsområde</label><select id="adaptive-category"><option value="">Alla områden</option>${M.categories.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select><p class="muted small">Åk 7–9 prövar den valda årskursens kursinnehåll. Välj åk 1–3 eller 4–6 för tidigare grunder. Kartan kan även visa förkunskaper som inte ingår i passet. Oprövade förkunskaper godkänns inte automatiskt.</p><label class="adaptive-retest"><input id="adaptive-retest" type="checkbox"> Pröva även tidigare visade färdigheter</label><label for="adaptive-limit">Antal uppgifter / omfattning</label><select id="adaptive-limit"><option value="30">30 · kort första kartläggning</option><option value="60">60 · bredare kartläggning</option><option value="90">90 · längre pass</option><option value="all">Testa alla · hela urvalet</option></select><p class="small" id="adaptive-selection-info" role="status"></p><section id="adaptive-estimate" class="session-estimate" role="status" aria-live="polite" hidden></section><p class="muted" id="adaptive-session-help">Passet kan pausas när som helst. Urvalsreglerna kan avsluta det före uppgiftstaket. Välj Testa alla för att pröva varje delmoment i urvalet.</p><button class="primary-button">Starta elevens pass →</button></form>`}${last?`<div class="dialog-section"><button class="secondary-button" data-adaptive-report="${esc(last.id)}">Se senaste sammanställningen · ${A.scopeLabel(last)} · ${date(last.ended)}</button></div>`:''}<p class="muted small">Frågorna kommer från den lokala uppgiftsbanken. Urvalet följer regler utifrån svar och beroenden; det är ännu ingen validerad adaptiv diagnos. Facit visas i lärarens sammanställning.</p>`;
    if(!active){$('#adaptive-start').value=app.yearScope()||last?.scope||'1-3';$('#adaptive-category').value=app.categoryScope()||last?.category||'';if(last?.limit)$('#adaptive-limit').value=last.mode==='all'?'all':String(last.limit);updateEstimate();}
    $('#adaptive-resume')?.focus();
  }
  function student(saved=false){
    const session=state().active;if(!session){report();return;}
    open();dialog.classList.add('student-mode');content.classList.remove('teacher-report');
    dialog.setAttribute('aria-labelledby','student-question-title');
    const q=session.pending;
    // Samma facit, tydligare formulering även för en redan pausad fråga.
    if(q.nodeId==='f-chance'&&q.prompt==='En påse innehåller bara röda kulor. Hur många möjliga färger kan du dra?'){
      q.prompt='Alla kulor i en påse är röda. Hur många olika färger finns i påsen?';app.save();
    }
    const hint=q.options?'Välj ett alternativ och tryck Svara.':answerHint(q)+' Tryck Enter eller Svara när du är klar.';
    clearTimeout(savedTimer);
    content.innerHTML=`<header class="student-header"><span>Matematik · ${esc(profile().name)}</span><div class="student-header-actions"><button class="theme-toggle" type="button" data-theme-toggle aria-label="Byt till mörkt tema">Mörkt tema</button><button class="secondary-button" id="adaptive-pause">Pausa</button></div></header><div class="student-progress"><span>Uppgift ${session.items.length+1}</span><span id="student-save-status">${app.storageOK()?'Svar sparas på den här enheten':'Lagring fungerar inte · be läraren exportera efter passet'}</span></div><section class="student-question${q.visual?' has-visual':''}">${session.items.length===0?'<p class="student-instructions">Du kan använda papper när du räknar.</p>':''}<h1 class="question-text" id="student-question-title" tabindex="-1">${esc(M.questionStem(q))}</h1>${M.renderQuestionVisual(q)}<form id="adaptive-answer-form">${M.renderAnswerFields(q,'adaptive-answer')}<p id="adaptive-hint" class="answer-help">${hint}</p><p id="adaptive-error" role="alert"></p></form><div class="student-question-actions"><button type="button" class="secondary-button" id="adaptive-skip" aria-label="Jag vet inte, gå vidare till nästa uppgift">Jag vet inte</button><span class="student-saved" id="adaptive-saved" role="status" aria-live="polite"></span></div></section>`;
    window.MATREE_THEME.refresh();
    const form=$('#adaptive-answer-form'),actions=$('.student-question-actions');
    actions.classList.add('student-response-actions');actions.prepend(form.querySelector('.primary-button'));form.append(actions);
    M.restoreDraft(q,session.draft,'adaptive-answer');
    (q.options||q.visual?$('#student-question-title'):$('#adaptive-answer')).focus({preventScroll:true});dialog.scrollTop=0;
    $('#adaptive-answer-form').setAttribute('aria-describedby','student-question-title adaptive-hint');
    if(saved){
      $('#adaptive-saved').textContent=app.storageOK()?'Svar sparat':'Svar registrerat för detta pass';
      savedTimer=setTimeout(()=>{const message=$('#adaptive-saved');if(message)message.textContent='';},1800);
    }
  }
  function archive(session,reason){
    delete session.draft;
    session.ended ||= new Date().toISOString();session.endReason ||= reason;session.pending=null;
    state().sessions.push(session);state().sessions=state().sessions.slice(-30);state().active=null;
    reportSessionId=session.id;app.save();app.render();
  }
  function finish(){const session=state().active;if(session)archive(session,'teacher');report();}

  function saveStudentDraft(){
    const session=state().active,input=$('#adaptive-answer');if(!session?.pending||!input)return;
    session.draft=M.makeDraft(session.pending,input.value);app.save();
  }
  document.addEventListener('input',event=>{if(event.target.id==='adaptive-answer')saveStudentDraft();});
  document.addEventListener('matree-answer-change',event=>{if(event.target.id==='adaptive-answer-form')saveStudentDraft();});

  function respond(skip=false){
    const session=state().active;if(!session)return;
    const response=$('#adaptive-answer')?.value||'';
    if(!A.answer(session,response,skip)){$('#adaptive-error').textContent=session.pending.options?'Välj ett svarsalternativ eller ”Jag vet inte”.':session.pending.responseFormat==='decimal'?'Skriv svaret i decimalform med komma eller punkt, utan bråkstreck. Du kan också välja ”Jag vet inte”.':'Skriv ett tal eller bråk. Du kan också välja ”Jag vet inte”.';return;}
    if(session.ended){archive(session,session.endReason);complete();}else{app.save();student(true);}
  }
  function complete(){
    dialog.classList.add('student-mode');
    content.innerHTML=`<div class="student-complete"><h1 id="student-complete-title">Passet är klart</h1><p>${app.storageOK()?'Dina svar är sparade.':'Be läraren exportera profilerna innan sidan stängs.'} Lämna tillbaka skärmen till din lärare.</p><button class="secondary-button" id="adaptive-teacher-report">Visa sammanställningen</button></div>`;
    dialog.setAttribute('aria-labelledby','student-complete-title');
    $('#adaptive-teacher-report').focus();
  }

  function endSummary(session,rows,untried){
    const labels={'all-tested':session.category?'Alla delmoment inom valt område och årskursurval har prövats.':'Alla delmoment i valt årskursurval har prövats.',limit:'Uppgiftstaket på '+session.limit+' svar nåddes.',teacher:'Passet avslutades av läraren.',coverage:'Urvalsreglerna hittade inga fler lämpliga uppgifter inom passets urval.'};
    const lower={'4-6':'1-3','7':'4-6','8':'7','9':'8'}[session.scope];
    return '<section class="report-end" data-end-reason="'+esc(session.endReason||'unknown')+'" aria-label="Varför passet avslutades"><strong>'+esc(labels[session.endReason]||'Avslutsorsaken saknas i detta äldre pass.')+'</strong>'+
      '<p>'+session.items.length+' svar av högst '+session.limit+'. '+rows.length+' delmoment fick nya svar; '+untried.length+' finns kvar i listan Ej prövade. '+(session.mode==='all'?'Tidigare visade prövades på nytt.':'Tidigare visade redovisas separat.')+'</p>'+
      (session.scope&&['7','8','9'].includes(session.scope)&&session.selection!=='course'?'<p>Detta äldre pass behåller sitt tidigare urval med grunder. Starta ett nytt pass för att pröva årskursens innehåll.</p>':'')+
      (session.mode==='all'?'<p>Testa alla: även fördjupning och tidigare visade färdigheter ingår. Prövat betyder att svar har samlats in, inte att kunskapen är visad. Förkunskaper godkänns inte automatiskt.</p>':'')+
      (session.endReason==='coverage'&&untried.length?'<p>Oprövade moment återstår. Urvalet följer förkunskaper och tidigare svar; hela urvalet har inte prövats. Följ upp förslagen nedan eller välj ett tidigare årskursurval.</p>':'')+
      (session.scope==='1-3'&&session.endReason==='coverage'?'<p>Det här är det tidigaste urvalet. Följ upp med samtal, enklare exempel och konkret material.</p>':'')+
      (lower?'<button class="secondary-button" data-earlier-scope="'+lower+'"'+(state().active?' disabled':'')+'>Välj tidigare årskursurval</button>'+(state().active?'<p class="small">Ett annat pass är pausat. Fortsätt eller avsluta det innan ett nytt urval startas.</p>':''):'')+'</section>';
  }

  function report(restore=false){
    const session=state().sessions.find(s=>s.id===reportSessionId)||state().sessions.at(-1);
    if(!session){setup();return;}
    reportSessionId=session.id;if(filterSessionId!==session.id){reportAnswerFilter='all';filterSessionId=session.id;}open();dialog.classList.remove('student-mode');content.classList.add('teacher-report');
    const rows=A.summary(session),shown=rows.filter(r=>r.state==='shown'),follow=rows.filter(r=>r.state==='followup'),partial=rows.filter(r=>r.state==='partial');
    const prior=[...new Set((session.known||[]).map(M.resolveSkillId))].map(byId);
    const ids=new Set([...rows.map(r=>r.node.id),...prior.map(n=>n.id)]),untried=A.scopedPool(session).filter(n=>!ids.has(n.id));
    const suggestions=followupSuggestions(session);
    const section=(key,title,list,expanded)=>'<details class="report-section '+key+'" id="report-'+key+'"'+(expanded?' open':'')+'><summary>'+title+' <span class="report-badge">'+list.length+'</span></summary>'+(list.length?list.map(r=>'<button class="progress-skill" data-adaptive-node="'+r.node.id+'"><span class="report-skill-name">'+esc(r.node.title)+'<small>'+esc(M.categories.find(c=>c.id===r.node.category).name)+'</small></span><span>'+r.right+'/'+r.total+' rätt'+(r.items.some(i=>i.skipped)?' · '+r.items.filter(i=>i.skipped).length+' överhoppade':'')+' →</span></button>').join(''):'<p class="muted small">Inga delmoment i denna grupp.</p>')+'</details>';
    const stat=(key,title,count)=>'<button class="report-stat '+key+'" data-report-section="'+key+'"><strong>'+count+'</strong><span>'+title+'</span></button>';
    const answerRows=answerGroups(session);
    content.innerHTML=top('Sammanställning av elevens pass')+
      '<p class="report-meta"><strong>'+esc(profile().name)+'</strong> · '+A.scopeLabel(session)+' · '+date(session.started)+'<br>'+session.items.length+' svar på '+rows.length+' delmoment</p>'+
      endSummary(session,rows,untried)+
      '<div class="report-stats">'+stat('followup','Behöver följas upp',follow.length)+stat('shown','Visad i passet',shown.length)+stat('partial','Begränsat underlag',partial.length)+stat('untried','Ej prövade i urvalet',untried.length)+'</div>'+
      '<p class="muted small">Resultaten gäller detta pass. Öppna ett delmoment för att se elevens svar och förkunskaper.</p>'+
      (suggestions.length?'<section class="report-next"><h3>Förslag på nästa kontroller</h3><p class="muted small">Förslag att undersöka. Svaren avgör inte orsaken till svårigheterna.</p><div class="followup-suggestions">'+suggestions.map(s=>suggestionCard(s,session)).join('')+'</div></section>':'')+
      section('followup','Behöver följas upp',follow,follow.length>0)+section('partial','Begränsat underlag',partial,partial.length>0)+section('shown','Visad i passet',shown,!follow.length&&!partial.length)+
      (prior.length?'<details class="report-section"><summary>Tidigare visade vid passets start <span class="report-badge">'+prior.length+'</span></summary><p class="muted small">Direkt underlag från tidigare kontroller. Dessa är inte nya resultat från passet.</p>'+prior.map(n=>'<button class="progress-skill" data-adaptive-node="'+n.id+'">'+esc(n.title)+' →</button>').join('')+'</details>':'')+
      '<details class="report-section" id="report-untried"><summary>Ej prövade i detta urval <span class="report-badge">'+untried.length+'</span></summary><p class="muted small">Här saknas nya svar från detta pass. Det betyder inte att eleven saknar kunskapen.</p>'+untried.map(n=>'<button class="progress-skill" data-adaptive-node="'+n.id+'">'+esc(n.title)+' →</button>').join('')+'</details>'+
      '<details class="report-section report-answers"><summary>Alla uppgifter och elevens svar <span class="report-badge">'+session.items.length+'</span></summary><div class="tabs report-answer-filters" role="group" aria-label="Filtrera elevsvar">'+[['all','Alla'],['incorrect','Felsvar'],['skipped','Överhoppade'],['partial','Begränsat underlag']].map(([key,label])=>'<button data-answer-filter="'+key+'" aria-pressed="'+(reportAnswerFilter===key)+'" class="'+(reportAnswerFilter===key?'selected':'')+'">'+label+'</button>').join('')+'</div><p id="report-answer-count" class="small" role="status">'+filteredAnswers(session).length+' av '+session.items.length+' uppgifter</p><div id="report-answer-groups">'+answerRows+'</div></details>'+
      '<details class="report-section report-method"><summary>Så ska underlaget läsas</summary><p>Visad i passet kräver minst tre rätt och högst ett fel på samma delmoment. Minst två fel eller överhoppade svar ger uppföljning. Ett avbrutet delmoment med få svar visas som begränsat underlag.</p><p>Tidigare delmoment godkänns inte automatiskt. Frågorna täcker inte alla uttrycksformer och ger ingen betygs- eller NP-prognos. Följ upp elevens resonemang.</p></details>'+
      '<div class="dialog-actions report-actions"><button class="primary-button" id="adaptive-overview">Till elevöversikten →</button><button class="secondary-button" id="adaptive-new">Nytt pass</button></div>';
    dialog.scrollTop=0;
    if(restore&&reportPosition?.id===session.id){content.querySelectorAll('details').forEach((d,i)=>d.open=!!reportPosition.open[i]);dialog.scrollTop=reportPosition.scroll;}
  }

  let controlOrigin=null;
  function decorateControl(id){
    const stored=profile().quiz?.reportSessionId,origin=stored?{profileId:profile().id,sessionId:stored,nodeId:M.resolveSkillId(profile().quiz.nodeId)}:controlOrigin;
    if(!origin||origin.profileId!==profile().id||origin.nodeId!==M.resolveSkillId(id)||!state().sessions.some(s=>s.id===origin.sessionId))return;
    controlOrigin=origin;
    if(profile().quiz&&!profile().quiz.reportSessionId){profile().quiz.reportSessionId=origin.sessionId;app.save();}
    const head=$('#skill-content .dialog-top');if(!head)return;
    $('#skill-content .control-report-return')?.remove();$('#skill-content .control-student')?.remove();
    head.insertAdjacentHTML('afterend','<button class="text-button control-report-return" data-adaptive-report="'+esc(origin.sessionId)+'" data-restore-report="true">← Tillbaka till passets sammanställning</button><p class="small control-student">Elev: '+esc(profile().name)+' · Manuell kontroll</p>');
  }
  function startReportControl(id){
    const node=byId(id),session=state().sessions.find(s=>s.id===reportSessionId);if(!node||!session)return;
    const quiz=profile().quiz;
    if(quiz&&M.resolveSkillId(quiz.nodeId)!==node.id){
      const card=content.querySelector('[data-report-start="'+CSS.escape(node.id)+'"]').closest('.followup-suggestion');card.querySelector('.paused-control-notice')?.remove();
      card.insertAdjacentHTML('beforeend','<div class="paused-control-notice" role="status"><p>En kontroll av '+esc(byId(quiz.nodeId).title)+' är pausad. Den nya kontrollen har inte startats.</p><button class="secondary-button" data-resume-report-quiz="'+esc(M.resolveSkillId(quiz.nodeId))+'">Fortsätt i stället: '+esc(byId(quiz.nodeId).title)+'</button></div>');
      card.querySelector('.paused-control-notice').scrollIntoView({block:'nearest'});return;
    }
    rememberReport();controlOrigin={profileId:profile().id,sessionId:session.id,nodeId:node.id};
    if(quiz){quiz.reportSessionId=session.id;app.save();}
    dialog.close();app.openSkill(node.id);app.startQuiz(node.id);decorateControl(node.id);
  }
  document.addEventListener('matree-control-render',event=>decorateControl(event.detail.id));
  $('#skill-dialog').addEventListener('close',()=>{if(!profile().quiz?.reportSessionId)controlOrigin=null;});

  function update(){
    $('#adaptive-open').textContent=state().active?'Fortsätt elevläge →':'Starta elevläge →';
    const active=state().active,last=state().sessions.at(-1),launchInfo=$('.adaptive-launch p');
    launchInfo.hidden=!active&&!last;
    launchInfo.textContent=active?'Pausat pass · '+A.scopeLabel(active)+' · '+active.items.length+' sparade svar.':'';
    if(last)launchInfo.insertAdjacentHTML('beforeend',' <button class="text-button last-report-link" data-adaptive-report="'+esc(last.id)+'">Senaste sammanställningen · '+A.scopeLabel(last)+' · '+date(last.ended)+' →</button>');

    if(!$('#progress-view').hidden){
      const sessions=state().sessions;
      $('#progress-view').insertAdjacentHTML('afterbegin',`<section class="progress-panel"><h2>Automatiska kartläggningar</h2>${state().active?`<p>${A.scopeLabel(state().active)} · pausat pass · ${state().active.items.length} sparade svar</p><button class="primary-button" id="adaptive-resume-overview">Fortsätt elevläge →</button>`:''}${sessions.length?sessions.slice().reverse().map(s=>`<button class="progress-skill" data-adaptive-report="${esc(s.id)}">${A.scopeLabel(s)} · ${date(s.started)}<span>${s.items.length} uppgifter · ${A.summary(s).length} delmoment →</span></button>`).join(''):'<p>Inga avslutade automatiska pass ännu.</p>'}</section>`);
    }
  }
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.id==='adaptive-open'||b.id==='adaptive-new'){reportSessionId=null;setup();}
    if(['adaptive-resume','adaptive-resume-overview'].includes(b.id))student();
    if(b.id==='adaptive-pause'){app.save();setup();}
    if(b.id==='adaptive-close')dialog.close();
    if(b.id==='adaptive-finish')finish();
    if(b.id==='adaptive-skip')respond(true);
    if(b.id==='adaptive-teacher-report')report();
    if(b.dataset.adaptiveReport){$('#skill-dialog').close();reportSessionId=b.dataset.adaptiveReport;report(b.dataset.restoreReport==='true');}
    if(b.dataset.adaptiveNode)sessionSkill(b.dataset.adaptiveNode);
    if(b.dataset.reportStart)startReportControl(b.dataset.reportStart);
    if(b.dataset.resumeReportQuiz)startReportControl(b.dataset.resumeReportQuiz);
    if(b.dataset.currentSkill){app.openSkill(b.dataset.currentSkill);$('#skill-content .dialog-top').insertAdjacentHTML('afterend','<button class="text-button report-return" data-adaptive-report="'+esc(reportSessionId)+'" data-restore-report="true">← Tillbaka till passets sammanställning</button>');}
    if(b.dataset.answerFilter){reportAnswerFilter=b.dataset.answerFilter;refreshAnswerFilter();}
    if(b.dataset.reportSection){const section=$('#report-'+b.dataset.reportSection);if(section){section.open=true;section.scrollIntoView({block:'start'});}}
    if(b.dataset.earlierScope){const scope=b.dataset.earlierScope,category=state().sessions.find(s=>s.id===reportSessionId)?.category||'';reportSessionId=null;setup();if($('#adaptive-start')){$('#adaptive-start').value=scope;$('#adaptive-category').value=category;updateEstimate();$('#adaptive-start').focus();}}
    if(b.id==='adaptive-overview'){dialog.close();app.showProgress();}
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='adaptive-answer-form'){event.preventDefault();respond();}
    if(event.target.id==='adaptive-setup'){
      event.preventDefault();if(state().active)return;
      const scope=$('#adaptive-start').value,category=$('#adaptive-category').value||null,mode=$('#adaptive-limit').value==='all'?'all':'adaptive';
      const prior=mode==='all'||$('#adaptive-retest').checked?[]:A.scopedPool({scope,mode,category,selection:'course'}).filter(n=>app.latest(n.id)?.score===3).map(n=>n.id);
      const allowed=new Set(A.scopedPool({scope,mode,category,selection:'course'}).map(n=>n.id));
      const manual=Object.entries(profile().results).flatMap(([nodeId,result])=>result.history.flatMap(r=>(r.items||[]).map(i=>({...i,nodeId}))));
      const recent=[...manual,...state().sessions.flatMap(s=>s.items)].filter(i=>allowed.has(i.nodeId)).map(i=>({nodeId:i.nodeId,fingerprint:M.questionFingerprint(i)}));
      state().active=A.create({scope,mode,category,start:['1-3','4-6'].includes(scope)?'basic':'higher',known:prior,recent,limit:mode==='all'?A.estimateAll(scope,category).maxQuestions:Number($('#adaptive-limit').value)});
      if(state().active.ended){archive(state().active,state().active.endReason);complete();}else{app.save();student();}
    }
  });
  dialog.addEventListener('cancel',event=>{if(dialog.classList.contains('student-mode')&&state().active){event.preventDefault();app.save();setup();}});
  dialog.addEventListener('close',()=>{if(dialog.open)return;clearTimeout(savedTimer);dialog.classList.remove('student-mode');app.render();});
  document.addEventListener('matree-render',update);
  update();
})();
