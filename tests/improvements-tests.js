window.verifyReportContext=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s);
  const saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive};
  const check=(condition,message)=>{if(!condition)throw Error(message);};
  const finish=(s,id,time)=>{s.id=id;s.started=s.ended=time;s.endReason='teacher';s.pending=null;s.items.forEach(i=>i.date=time);return s;};
  try{
    p.results={};p.quiz=null;
    const older=A.create({scope:'1-3',limit:30});for(let i=0;i<3;i++)A.answer(older,String(older.pending.answer));
    finish(older,'report-context-old',new Date(Date.now()-86400000).toISOString());
    const newer=A.create({scope:'1-3',limit:30});A.answer(newer,'',true);A.answer(newer,'',true);finish(newer,'report-context-new',new Date().toISOString());
    const id=older.items[0].nodeId;
    p.adaptive={active:null,sessions:[older,newer],confirmations:[]};app.save();app.showProgress();
    $('[data-adaptive-report="'+older.id+'"]').click();
    $('#report-method')?.setAttribute('open','');const section=$('.report-method');section.open=true;
    $('#adaptive-dialog').scrollTop=150;const scroll=$('#adaptive-dialog').scrollTop;
    $('#report-shown [data-adaptive-node]').click();
    check($('.pass-outcome').textContent.includes('3/3'),'Older report must retain its 3/3 outcome after newer 0/2');
    check($('.pass-answers').querySelectorAll('.answer-review').length===3,'Older report shows only its three saved questions');
    check($('.pass-answers').textContent.includes(M.questionStem(older.items[0])),'Older report retains exact question text');
    check(!$('.pass-answers').textContent.includes('Jag vet inte'),'Newer skipped answers must not leak into older report');
    $('.report-return').click();
    check($('.report-method').open&&Math.abs($('#adaptive-dialog').scrollTop-scroll)<2,'Returning restores open report sections and scroll');
    $('#adaptive-close').click();$('[data-adaptive-report="'+newer.id+'"]').click();$('#report-followup [data-adaptive-node]').click();
    check($('.pass-outcome').textContent.includes('0/2')&&$('.pass-answers').textContent.includes('Jag vet inte'),'Newer skipped answers retain their outcome and label');
    $('[data-close="skill-dialog"]').click();
    const legacyItems=[0,1,2].map(v=>({...M.generateReviewed(id,v),response:'',correct:false}));
    p.results[id]={history:[{score:0,date:new Date(Date.now()+1000).toISOString(),items:legacyItems}]};app.openSkill(id);
    check($('.answer-review').textContent.includes('Svar saknas i äldre underlag'),'Missing legacy answers are distinct from skipped responses');
    return 'Historical report context, exact saved questions, skipped versus missing answers and report position passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());p.results=saved.results;p.quiz=saved.quiz;p.adaptive=saved.adaptive;app.save();app.render();}
};

window.verifyProfileCounts=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved={results:p.results,quiz:p.quiz,adaptive:p.adaptive,name:p.name};
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    p.name='Test <profil>';p.results={'f-round':{history:[{score:3,date:new Date().toISOString()}]},'avrunda-heltal':{history:[{score:3,date:new Date().toISOString()}]}};p.quiz=null;
    const completed=A.create({scope:'4-6',limit:30});
    completed.pending={...M.generateReviewed('avrunda-heltal',0),nodeId:'avrunda-heltal',variant:0,reason:'Delat underlag.'};A.answer(completed,String(completed.pending.answer));
    completed.ended=new Date().toISOString();completed.pending=null;completed.endReason='teacher';
    const active=A.create({scope:'1-3',limit:30});A.answer(active,String(active.pending.answer));
    p.adaptive={active,sessions:[completed],confirmations:[]};A.validate(p.adaptive);
    let counts=app.profileCounts(p);
    check(counts.skills===2&&counts.passes===3,'Manual aliases and automatic evidence count unique skills; only completed rounds count as passes');
    const questions=[0,1,2].map(v=>M.generateReviewed('f-shapes',v));p.quiz={nodeId:'f-shapes',questions,answers:[true],responses:[String(questions[0].answer)],index:1};
    counts=app.profileCounts(p);check(counts.skills===3&&counts.passes===3,'Saved partial manual answers count a tested skill without an extra completed pass');
    app.save();app.render();check($('#active-profile').textContent.includes(p.name),'Active student is explicit and escaped');
    $('#active-profile').click();check($('#profile-list').textContent.includes('3 prövade delmoment · 3 avslutade pass'),'Profile list uses the same unique-skill and pass counts');
    $('[data-close="profiles-dialog"]').click();check($('.adaptive-launch p').textContent.includes('Pausat pass'),'Paused session is visible in the launch area');
    $('.last-report-link').click();check($('#adaptive-content').textContent.includes('1 svar på 1 delmoment'),'Latest report link selects the actual last completed pass');$('#adaptive-close').click();
    const fingerprint=M.questionFingerprint(active.pending);$('#adaptive-open').click();$('#adaptive-resume').click();
    check(M.questionFingerprint(p.adaptive.active.pending)===fingerprint,'Profile shortcuts preserve the exact paused question');$('#adaptive-pause').click();$('#adaptive-close').click();
    return 'Unique profile counts across aliases, automatic/manual/partial evidence, active student and latest/paused shortcuts passed';
  }finally{document.querySelectorAll('dialog[open]').forEach(d=>d.close());Object.assign(p,saved);app.save();app.render();}
};

window.verifyMapWorkspace=async()=>{
  const app=MATREE_APP,$=s=>document.querySelector(s),check=(c,m)=>{if(!c)throw Error(m);};
  $('[data-view="tree"]').click();$('#reset-filters').click();$('[data-map-mode="groups"]').click();
  await new Promise(r=>setTimeout(r,160));
  try{
    const map=$('#map-scroll');map.scrollTop=360;window.scrollTo(0,300);
    const top=map.scrollTop,page=scrollY;app.openGroup('numbers');$('[data-close="skill-dialog"]').click();await new Promise(r=>setTimeout(r,0));
    check(map.scrollTop===top&&scrollY===page,'Closing a map group preserves canvas and page position');
    $('#search').value='bråk';$('#search').dispatchEvent(new Event('input'));
    check($('[data-map-mode="details"]').getAttribute('aria-pressed')==='true'&&$('#map-title').textContent.includes('Sökresultat'),'Search explicitly shows detailed results');
    $('#search').value='';$('#search').dispatchEvent(new Event('input'));
    check($('[data-map-mode="groups"]').getAttribute('aria-pressed')==='true','Clearing search restores chosen group mode');
    $('#map-zoom').value='120';$('#map-zoom').dispatchEvent(new Event('input'));check($('#zoom-value').textContent==='120 %','Zoom remains functional');
    $('[data-map-mode="details"]').click();check(document.querySelectorAll('.skill-node[data-node]').length===MATREE.detailNodes.length,'Full detailed map remains accessible');
    return 'Map orientation, search mode, zoom and complete detailed map passed';
  }finally{$('#map-zoom').value='100';$('#map-zoom').dispatchEvent(new Event('input'));$('#reset-filters').click();$('[data-map-mode="details"]').click();window.scrollTo(0,0);}
};

window.verifyFollowupReport=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved=p.adaptive;
  const check=(c,m)=>{if(!c)throw Error(m);};
  try{
    const s=A.create({scope:'4-6',limit:30});s.id='grouped-followup';s.items=[];
    for(const [id,count,outcome]of [['f-coordinate',3,'right'],['avrunda-heltal',2,'wrong'],['monster',2,'skip'],['f-word-mult',1,'right']]){
      for(let v=0;v<count;v++){const q=M.generateReviewed(id,v),skipped=outcome==='skip',response=skipped?'':String(outcome==='right'?q.answer:q.answerKind==='choice'?q.answer%q.prompt.split('\n').filter(l=>/^\d+\. /.test(l)).length+1:q.answer+999);
        s.items.push({...q,nodeId:id,variant:v,reason:'Specifikt underlag för rapportkontroll.',response,skipped,correct:!skipped&&A.correct(q,response),date:new Date().toISOString()});}
    }
    s.ended=new Date().toISOString();s.pending=null;s.endReason='teacher';p.adaptive={active:null,sessions:[s],confirmations:[]};A.validate(p.adaptive);
    const original=JSON.stringify(s);app.save();app.showProgress();$('[data-adaptive-report="'+s.id+'"]').click();
    const cards=[...document.querySelectorAll('.followup-suggestion')];
    check(cards.length>0&&cards.length<=3,'At most three evidence-based suggestions');
    check(cards.every(c=>c.textContent.includes('rätt')&&c.querySelector('[data-adaptive-node]').dataset.adaptiveNode!==M.resolveSkillId('f-coordinate')),'Suggestions cite saved outcomes and exclude shown prerequisites');
    $('.report-answers').open=true;
    for(const [filter,count]of [['incorrect',2],['skipped',2],['partial',1],['all',8]]){
      $('[data-answer-filter="'+filter+'"]').click();
      check(document.querySelectorAll('#report-answer-groups .answer-review').length===count,'Answer filter count for '+filter);
    }
    check(document.querySelectorAll('.report-answer-group').length===4,'Saved answers are grouped by canonical skill');
    check(JSON.stringify(s)===original,'Suggestions and filters never change saved evidence');
    return 'Three justified followups, wrong/skip/partial filters, grouped answers and unchanged evidence passed';
  }finally{$('#adaptive-dialog').close();p.adaptive=saved;app.save();app.render();}
};

window.verifyStudentWorkspace=()=>{
  const M=MATREE,A=MATREE_ADAPTIVE,app=MATREE_APP,p=app.profile(),$=s=>document.querySelector(s),saved=p.adaptive;
  const check=(condition,message)=>{if(!condition)throw Error(message);};
  try{
    for(const id of ['rita-linje','pythagoras-hyp','tabell','multiplikation']){
      const s=A.create({scope:null,limit:30}),q=id==='multiplikation'?M.generateReviewed(id,0):M.generate(id,id==='tabell'?1:0);
      s.pending={...q,nodeId:id,variant:0,reason:'Kontroll av elevens arbetsyta.'};p.adaptive={active:s,sessions:[],confirmations:[]};app.save();app.render();
      $('#adaptive-open').click();$('#adaptive-resume').click();
      const submit=$('#adaptive-answer-form .primary-button'),skip=$('#adaptive-skip');
      check(submit.closest('form')&&skip.type==='button','Skip must not submit the answer form');
      if(innerWidth>=1000&&q.visual)check(submit.getBoundingClientRect().bottom<innerHeight&&skip.getBoundingClientRect().bottom<innerHeight,'Image question actions fit the laptop viewport');
      if(q.options){$('#adaptive-answer-form [data-choice="'+q.answer+'"]').click();check(!submit.disabled,'Selected choice enables moved submit button');}
      else $('#adaptive-answer').value=String(q.answer);
      $('#adaptive-answer-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
      check(s.items.length===1&&s.items[0].correct,'Moved controls retain correct answer submission');
      $('#adaptive-skip').click();check(s.items.length===2&&s.items[1].skipped,'Skip records exactly one skipped response');
      $('#adaptive-pause').click();$('#adaptive-close').click();
    }
    return 'Student image, table, numeric and choice controls retain submission and skip behaviour';
  }finally{$('#adaptive-dialog').close();p.adaptive=saved;app.save();app.render();}
};
