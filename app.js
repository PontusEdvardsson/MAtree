(() => {
  'use strict';
  const { categories, generate, parseAnswer, fmt } = window.MATREE, nodes=window.MATREE.visibleNodes;
  const adaptive = window.MATREE_ADAPTIVE, detailNodes=window.MATREE.detailNodes;
  let mapMode='groups',currentMapNodes=[];
  const expandedGroups=new Set();
  let dialogReturnSelector='#continue-button',dialogMapPosition=null;
  const mapContext=()=>JSON.stringify([category,stage,foundationBand,level,focusId,zoom,search,view,mapMode,[...expandedGroups]]);
  function rememberDialogOrigin(fallback) {
    const origin=document.activeElement;
    dialogMapPosition={context:mapContext(),left:$('#map-scroll').scrollLeft,top:$('#map-scroll').scrollTop,page:window.scrollY};
    dialogReturnSelector=origin?.dataset.group?'[data-group="'+origin.dataset.group+'"]':origin?.dataset.node?'[data-node="'+origin.dataset.node+'"]':origin?.id?'#'+CSS.escape(origin.id):fallback;
  }
  const $ = selector => document.querySelector(selector);
  const esc = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const key = 'matree.profiles.v1';
  const byId = id => nodes.find(node => node.id === window.MATREE.resolveSkillId(id));
  const uid = () => window.crypto?.randomUUID?.() || `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const newProfile = name => ({ id: uid(), name, results: {}, quiz: null, adaptive: adaptive.validate(null) });
  let storageOK = true, loadWarning = '', category = 'all', stage = 'all', foundationBand = 'all', level = 'all', focusId = null, zoom = 1, search = '', view = 'tree', selected = null, toastTimer;
  function validateQuiz(quiz) {
    if (quiz === null || quiz === undefined) return null;
    if (!byId(quiz.nodeId) || !Array.isArray(quiz.questions) || quiz.questions.length !== 3 || !Array.isArray(quiz.answers) || quiz.answers.length > 3 || !quiz.answers.every(answer => typeof answer === 'boolean') || !Number.isInteger(quiz.index) || quiz.index < 0 || quiz.index > 2 || ![quiz.index, quiz.index + 1].includes(quiz.answers.length)) throw new Error('Ogiltig pågående omgång.');
    const questions = quiz.questions.map(q => {
      if (typeof q.prompt !== 'string' || q.prompt.length > 2000 || typeof q.explanation !== 'string' || q.explanation.length > 3000 || typeof q.answer !== 'number' || !Number.isFinite(q.answer) || typeof q.unit !== 'string' || q.unit.length > 30) throw new Error('Ogiltig fråga i filen.');
      return { prompt: q.prompt, explanation: q.explanation, answer: q.answer, unit: q.unit, ...window.MATREE.questionExtras(q) };
    });
    const responses = Array.isArray(quiz.responses) && quiz.responses.length === quiz.answers.length && quiz.responses.every(r => typeof r === 'string' && r.length <= 60) ? [...quiz.responses] : quiz.answers.map(() => '');
    if(quiz.answeredAt!==undefined&&(typeof quiz.answeredAt!=='string'||!Number.isFinite(Date.parse(quiz.answeredAt))))throw Error('Ogiltigt datum för pågående svar.');
    if(quiz.reportSessionId!==undefined&&(typeof quiz.reportSessionId!=='string'||quiz.reportSessionId.length>100))throw Error('Ogiltig rapportreferens.');
    const draft=window.MATREE.validateDraft(quiz.answers.length>quiz.index?null:questions[quiz.index],quiz.draft);
    return { nodeId: quiz.nodeId, questions, answers: [...quiz.answers], responses, index: quiz.index, ...(draft?{draft}:{}), ...(quiz.answeredAt?{answeredAt:quiz.answeredAt}:{}), ...(quiz.reportSessionId?{reportSessionId:quiz.reportSessionId}:{}) };
  }
  function validateData(data) {
    if (data?.version !== 1 || !Array.isArray(data.profiles) || !data.profiles.length || data.profiles.length > 200) throw new Error('Filen måste vara en MAtree-export med 1–200 profiler.');
    const ids = new Set();
    const profiles = data.profiles.map(p => {
      if (typeof p.id !== 'string' || !p.id || p.id.length > 100 || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 40 || !p.results || typeof p.results !== 'object' || Array.isArray(p.results)) throw new Error('Filen innehåller en ogiltig elevprofil.');
      ids.add(p.id);
      const results = {};
      for (const node of window.MATREE.nodes) {
        const result = p.results[node.id];
        if (!result) continue;
        if (!Array.isArray(result.history) || result.history.length > 100 || !result.history.every(r => Number.isInteger(r.score) && r.score >= 0 && r.score <= 3 && typeof r.date === 'string' && Number.isFinite(Date.parse(r.date)))) throw new Error('Ogiltigt resultat i filen.');
        if (result.history.length) results[node.id] = { history: result.history.map(r => {
          const record = { score: r.score, date: r.date };
          if (r.items !== undefined) {
            if (!Array.isArray(r.items) || r.items.length !== 3 || !r.items.every(item => typeof item.prompt === 'string' && item.prompt.length <= 2000 && typeof item.response === 'string' && item.response.length <= 60 && typeof item.answer === 'number' && Number.isFinite(item.answer) && typeof item.unit === 'string' && item.unit.length <= 30 && typeof item.correct === 'boolean' && typeof item.explanation === 'string' && item.explanation.length <= 3000) || r.items.filter(item => item.correct).length !== r.score) throw new Error('Ogiltiga uppgiftssvar i filen.');
            record.items = r.items.map(item => ({ prompt:item.prompt,response:item.response,answer:item.answer,unit:item.unit,correct:item.correct,explanation:item.explanation,...window.MATREE.questionExtras(item) }));
          }
          return record;
        }) };
      }
      return { id: p.id, name: p.name.trim(), results, quiz: validateQuiz(p.quiz), adaptive: adaptive.validate(p.adaptive) };
    });
    return { version: 1, profiles, activeId: ids.has(data.activeId) ? data.activeId : profiles[0].id };
  }
  let data;
  try {
    const saved = localStorage.getItem(key);
    if (saved) data = validateData(JSON.parse(saved));
  } catch (error) { storageOK = false; loadWarning = 'Tidigare data kunde inte läsas. Exportera arbetet innan du stänger sidan. Befintlig lagring skrivs inte över.'; }
  if (!data) { const p = newProfile('Elev 1'); data = { version: 1, profiles: [p], activeId: p.id }; }
  const profile = () => data.profiles.find(p => p.id === data.activeId);
  const latest = id => {
    const M=window.MATREE,manual=M.skillIds(id).flatMap(key=>profile().results[key]?.history||[]).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date)).at(-1),auto=adaptive.latestEvidence(profile(),id);
    let result=!auto||manual&&Date.parse(manual.date)>=Date.parse(auto.date)?manual:{score:auto.state==='shown'?3:auto.state==='followup'?Math.min(auto.right,2):null,date:auto.date,items:auto.items,total:auto.total,adaptive:true,right:auto.right};
    const quiz=profile().quiz;
    if(quiz&&M.resolveSkillId(quiz.nodeId)===M.resolveSkillId(id)&&quiz.answers.length&&(!quiz.answeredAt||!result||Date.parse(quiz.answeredAt)>=Date.parse(result.date))){
      result={score:null,date:quiz.answeredAt||null,total:quiz.answers.length,right:quiz.answers.filter(Boolean).length,pending:true,items:quiz.questions.slice(0,quiz.answers.length).map((q,i)=>({...q,response:quiz.responses?.[i]||'',correct:quiz.answers[i]}))};
    }
    return result;
  };
  const evidenceKind=result=>!result?'untried':result.score===3?'mastered':result.score===null?'partial':'practice';
  function evidenceCounts(list=detailNodes){
    const counts={mastered:0,practice:0,partial:0,untried:0};
    for(const node of list)counts[evidenceKind(latest(node.id))]++;
    return counts;
  }
  function evidenceText(id,includeDate=false){
    const r=latest(id);if(!r)return 'Oprövad';
    const label={mastered:'Visad kunskap',practice:'Behöver följas upp',partial:'Begränsat underlag'}[evidenceKind(r)];
    return label+' · '+(r.right??r.score)+'/'+(r.total||3)+' rätt'+(r.pending?' · Pågående kontroll':includeDate?' · '+new Date(r.date).toLocaleDateString('sv-SE'):'');
  }
  function status(node) {
    const result = latest(node.id);
    if (result) return evidenceKind(result);
    if (profile().adaptive.confirmations.some(c=>c.targetId===node.id)) return 'supported';
    if (adaptive.indirect(profile()).some(c=>c.targetId===node.id)) return 'indirect';
    return node.deps.every(id => latest(id)?.score === 3) ? 'available' : 'locked';
  }
  const statusLabel = value => ({ mastered: 'Visad kunskap', practice: 'Behöver träning', available: 'Redo att utforska', locked: 'Förkunskaper oprövade',partial:'Begränsat underlag',supported:'Metod bekräftad',indirect:'Indirekt underlag' })[value];
  const stageLabel = value => value === 0 ? 'Tidigare grunder' : `Åk ${value}`;
  const sourceLabel = source => source.kind === 'curriculum' ? `Lgr22 · ${source.chapter}` : `MD ${source.grade} · ${source.chapter} · s. ${source.printed}`;
  const sourceLink = source => `<a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener">${esc(sourceLabel(source))} ↗<small>${source.kind==='curriculum'?'Eget delmoment med kursplanen som områdesunderlag':`PDF-sida ${source.page}`}</small></a>`;
  function ancestors(id, found = new Set()) {
    for (const dep of byId(id).deps) if (!found.has(dep)) { found.add(dep); ancestors(dep, found); }
    return found;
  }
  function save() {
    if (storageOK) {
      try { localStorage.setItem(key, JSON.stringify(data)); }
      catch (error) { storageOK = false; toast('Det gick inte att spara. Exportera profilerna för att behålla arbetet.'); }
    }
    $('#save-status').innerHTML = storageOK ? '<i></i> Sparas på den här enheten' : '⚠ Sparas bara under denna session · Exportera profiler';
  }
  function toast(message) {
    clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 6000);
  }
  function nextSkill() {
    if (profile().quiz) return byId(profile().quiz.nodeId);
    const needs = detailNodes.filter(n => n.level === 'core' && status(n) === 'practice');
    for (const node of needs) {
      const untested = node.deps.map(byId).find(n => !latest(n.id));
      if (untested) return untested;
    }
    const entryPoints = ['brak-del-hel', 'ekvation-add', 'procent-begrepp', 'area-rektangel', 'sannolikhet-skala'];
    const entry = entryPoints.map(byId).find(n => !latest(n.id));
    return entry || needs[0] || detailNodes.find(n => n.level === 'core' && status(n) === 'available') || detailNodes.find(n => n.level === 'core' && !latest(n.id)) || byId('funktionsvarde');
  }
  function render() {
    if(document.body.dataset.view!==view)$('#summary-stats').open=view!=='tree';
    document.body.dataset.view=view;
    $('#profile-name').textContent = profile().name; $('#avatar').textContent = profile().name.charAt(0).toUpperCase();
    $('#active-profile').textContent='Elev: '+profile().name;
    $('#active-profile').setAttribute('aria-label','Aktiv elev '+profile().name+'. Öppna elevprofiler.');
    $('#profile-button').setAttribute('aria-label','Elevprofil: '+profile().name+'. Byt eller skapa profil.');
    $('#mobile-category').innerHTML = [{id:'all',name:'Alla områden'},...categories].map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    $('#mobile-category').value = category;
    $('#level-filter').value = level;
    $('#level-filter').closest('label').hidden = stage === '0';
    $('#foundation-filters').hidden = stage !== '0';
    document.querySelectorAll('[data-foundation]').forEach(b=>{b.classList.toggle('selected',b.dataset.foundation===foundationBand);b.setAttribute('aria-pressed',String(b.dataset.foundation===foundationBand));});
    const counts=evidenceCounts(),mastered=counts.mastered,practice=counts.practice,checked=detailNodes.length-counts.untried;
    $('#summary-stats-label').textContent='Samlat elevunderlag · '+mastered+' visade · '+practice+' att följa upp · '+counts.partial+' begränsade · '+counts.untried+' oprövade';
    const rounds = Object.values(profile().results).reduce((total, r) => total + r.history.length, 0) + profile().adaptive.sessions.length;
    $('#stats').innerHTML = [
      `<div class="stat-top">Visad kunskap <span class="stat-icon">✧</span></div><div class="stat-value"><strong>${mastered}</strong><span>av ${detailNodes.length} färdigheter</span></div><div class="stat-progress"><i style="width:${mastered / detailNodes.length * 100}%"></i></div>`,
      `<div class="stat-top">Att undersöka vidare <span class="stat-icon">⌕</span></div><div class="stat-value"><strong>${practice}</strong><span>efter genomförd kontroll</span></div>`,
      `<div class="stat-top">Begränsat underlag</div><div class="stat-value"><strong>${counts.partial}</strong><span>delmoment</span></div>`,
      `<div class="stat-top">Ännu inte prövade <span class="stat-icon">◌</span></div><div class="stat-value"><strong>${detailNodes.length - checked}</strong><span>färdigheter</span></div>`,
      `<div class="stat-top">Genomförda kontroller <span class="stat-icon">✓</span></div><div class="stat-value"><strong>${rounds}</strong><span>manuella och automatiska pass</span></div>`
    ].map(content => `<div class="stat">${content}</div>`).join('');
    $('#continue-button').innerHTML = `${profile().quiz ? 'Fortsätt kontroll' : checked ? 'Nästa delmoment' : 'Manuell kontroll'} <span>↗</span>`;
    $('#category-nav').innerHTML = [{ id: 'all', name: 'Alla områden', color: '#b8c7a5' }, ...categories].map(cat => `<button class="category-button ${category === cat.id ? 'selected' : ''}" data-category="${cat.id}" aria-pressed="${category === cat.id}"><i class="category-dot" style="background:${cat.color}"></i>${cat.name}<span class="category-count">${cat.id === 'all' ? detailNodes.length : detailNodes.filter(n => n.category === cat.id).length}</span></button>`).join('');
    document.querySelectorAll('[data-stage]').forEach(button => { button.classList.toggle('selected', button.dataset.stage === stage); button.setAttribute('aria-pressed', String(button.dataset.stage === stage)); });
    document.querySelectorAll('[data-view]').forEach(button => { button.classList.toggle('active', button.dataset.view === view); button.setAttribute('aria-current', button.dataset.view === view ? 'page' : 'false'); });
    $('#tree-view').hidden = view !== 'tree'; $('#progress-view').hidden = view !== 'progress'; $('#np-view').hidden = view !== 'np';
    $('#breadcrumb').textContent = {tree:'Kunskapsträdet',progress:'Elevöversikt',np:'Inför NP'}[view];
    $('#page-title').textContent = { tree: 'Kunskapsträdet', np: 'Inför NP', progress: 'Elevöversikt' }[view];
    $('#page-description').textContent = view === 'tree' ? 'Delområden och förkunskaper från årskurs 1 till 9.' : view === 'np' ? 'Kartlägg mot Genrepet och den gröna kursens bas vid slutet av nian.' : `Prövade kunskaper och förslag att följa upp för ${profile().name}.`;
    renderMap(); if (view === 'progress') renderProgress(); if (view === 'np') renderNP();
    document.dispatchEvent(new Event('matree-render'));
  }
  function renderMap() {
    const M=window.MATREE;
    const focused=focusId?new Set([focusId,...ancestors(focusId),...nodes.filter(n=>n.deps.includes(focusId)).map(n=>n.id)]):null;
    currentMapNodes=nodes.filter(n=>focused?focused.has(n.id):!M.mixedControlIds.has(n.id)&&(category==='all'||category===n.category)&&M.matchesYearView(n,stage)&&(stage!=='0'||foundationBand==='all'||M.matchesYearView(n,foundationBand==='1'?'1-3':'4-6'))&&(level==='all'||level===n.level)&&(!search||(n.title+' '+n.description+' '+categories.find(c=>c.id===n.category).name).toLocaleLowerCase('sv').includes(search)));
    const visible=currentMapNodes,projection=M.projectMap(visible,{details:mapMode==='details'||!!search||!!focused,expanded:expandedGroups});
    const entries=projection.entries,entryById=new Map(entries.map(n=>[n.id,n]));
    document.querySelectorAll('[data-map-mode]').forEach(b=>{const effective=search||focused?'details':mapMode;b.classList.toggle('selected',b.dataset.mapMode===effective);b.setAttribute('aria-pressed',String(b.dataset.mapMode===effective));b.disabled=!!search||!!focused;});
    $('#focus-banner').hidden=!focusId;
    $('#focus-banner').innerHTML=focusId?'<div><strong>'+esc(byId(focusId).title)+'</strong><span>Alla '+ancestors(focusId).size+' förkunskaper samt nästa direkta steg. Filter pausas i fokusvyn.</span></div><button class="secondary-button" id="clear-focus">Tillbaka till urvalet ×</button>':'';
    $('#map-title').textContent=focusId?'Förkunskapskedjan':(search?'Sökresultat':category==='all'?'Alla områden':categories.find(c=>c.id===category).name)+(stage==='all'?' · alla år':stage==='0'?' · grunder'+(foundationBand==='all'?'':foundationBand==='1'?' åk 1–3':' åk 4–6'):' · åk '+stage);
    $('#node-count').textContent=entries.length+' kort · '+visible.length+' delmoment · '+projection.rawEdgeCount+' kopplingar';
    const map=$('#skill-map');
    if(!visible.length){map.style.width='360px';map.style.height='360px';map.innerHTML='<div class="empty-map">Inga delmoment matchar filtret.<br><br>Prova ett annat sökord eller välj ”Rensa filter”.</div>';applyZoom(360,360);return;}
    const lanes=categories.filter(c=>entries.some(n=>n.category===c.id)),depths=new Map();
    function localDepth(n){if(depths.has(n.id))return depths.get(n.id);const d=n.deps.length?1+Math.max(...n.deps.map(id=>localDepth(entryById.get(id)))):0;depths.set(n.id,d);return d;}
    entries.forEach(localDepth);
    const compact=mapMode==='groups'&&!focused&&!search,maxDepth=Math.max(...depths.values()),positions=new Map(),laneTops=new Map();
    const viewport=$('#map-scroll').clientWidth||1000,padding=compact?16:28,gap=24;
    const cols=Math.max(1,Math.min(4,Math.floor((viewport/zoom-2*padding+gap)/(260+gap))));
    const cardWidth=compact?Math.min(320,Math.max(220,Math.floor((viewport/zoom-2*padding-(cols-1)*gap)/cols))):260;
    const width=compact?Math.max(viewport/zoom,cols*cardWidth+(cols-1)*gap+2*padding):56+maxDepth*308+260;
    let top=compact?22:65;
    for(const lane of lanes){
      laneTops.set(lane.id,top);const counts=new Map();
      const list=entries.filter(n=>n.category===lane.id).sort((a,b)=>compact?depths.get(a.id)-depths.get(b.id)||a.title.localeCompare(b.title,'sv'):Math.min(...a.members.map(n=>n.grade))-Math.min(...b.members.map(n=>n.grade))||a.title.localeCompare(b.title,'sv'));
      list.forEach((n,index)=>{
        const col=compact?index%cols:depths.get(n.id),row=compact?Math.floor(index/cols):counts.get(col)||0;
        positions.set(n.id,{x:padding+col*(compact?cardWidth+gap:308),y:top+32+row*140});counts.set(col,row+1);
      });
      top+=(compact?Math.ceil(list.length/cols):Math.max(...counts.values()))*140+55;
    }
    const height=top;map.style.width=width+'px';map.style.height=height+'px';map.style.setProperty('--card-width',cardWidth+'px');
    map.classList.toggle('compact',compact);map.classList.toggle('show-connections',$('#map-connections').checked);
    $('#map-connections-control').hidden=!compact;
    $('#map-guidance').textContent=search?'Sökning visar enskilda delmoment. Rensa sökfältet för att återgå till '+(mapMode==='groups'?'grupper.':'alla delmoment.'):compact?'Öppna en grupp för att välja delmoment. Peka på ett kort för att se kopplingar.':'Pilarna visar förkunskaper. Avgränsa med område eller årskurs, eller öppna en förkunskapskedja. Dra för att flytta kartan.';
    const edges=projection.edges.map(edge=>{
      const from=positions.get(edge.from),to=positions.get(edge.to),x1=from.x+cardWidth,y1=from.y+56,x2=to.x,y2=to.y+56,bend=Math.max(20,(x2-x1)/2);
      const label=edge.pairs.map(p=>byId(p.from).title+' → '+byId(p.to).title).join('; ');
      return '<path class="connection '+(edge.pairs.every(p=>latest(p.from)?.score===3)?'done':'')+'" data-from="'+edge.from+'" data-to="'+edge.to+'" d="M '+x1+' '+y1+' C '+(x1+bend)+' '+y1+', '+(x2-bend)+' '+y2+', '+x2+' '+y2+'" marker-end="url(#arrow)"><title>'+esc(label)+'</title></path>';
    }).join('');
    const columns=compact?'':Array.from({length:maxDepth+1},(_,i)=>'<div class="map-column-label" style="left:'+(28+i*308)+'px">'+(i===0?'UTGÅNGSPUNKTER':'BYGGER VIDARE · STEG '+i)+'</div>').join('');
    const labels=lanes.map((cat,i)=>'<div class="map-lane-label" style="top:'+laneTops.get(cat.id)+'px;--lane-color:'+cat.color+';color:'+cat.color+'"><i class="category-dot" style="background:'+cat.color+'"></i>'+cat.name+'</div>'+(i?'<div class="map-lane-rule" style="top:'+(laneTops.get(cat.id)-15)+'px"></div>':'')).join('');
    const cards=entries.map(entry=>{
      const pos=positions.get(entry.id),cat=categories.find(c=>c.id===entry.category);
      const style=' style="left:'+pos.x+'px;top:'+pos.y+'px;--node-color:'+cat.color+';--node-bg:'+cat.bg+'"';
      const head='<span class="node-port in"></span><span class="node-top"><span class="node-symbol">'+cat.symbol+'</span><span class="node-title">'+esc(entry.title)+'</span></span>';
      if(entry.groupId){
        const shown=entry.members.filter(n=>latest(n.id)?.score===3).length,practice=entry.members.some(n=>status(n)==='practice'),partial=entry.members.some(n=>latest(n.id));
        const state=shown===entry.members.length?'mastered':practice?'practice':partial?'partial':entry.members.some(n=>status(n)==='available')?'available':'locked';
        return '<button class="skill-node skill-group '+state+'" data-group="'+entry.groupId+'"'+style+' aria-label="'+esc(entry.title)+', '+shown+' av '+entry.members.length+' delmoment visade. Öppna delmoment.">'+head+'<span class="node-bottom"><span class="node-status"><i></i>'+shown+' av '+entry.members.length+' visade</span><span class="group-open">Öppna →</span></span><span class="node-port out"></span></button>';
      }
      const node=entry.members[0],state=status(node),year=node.grade|| (node.foundationBand===1?'1–3':'4–6');
      return '<button class="skill-node '+state+(node.id===focusId?' focus-node':'')+'" data-node="'+node.id+'"'+style+' aria-label="'+esc(node.title)+', '+(node.grade?stageLabel(node.grade):'Grunder åk '+year)+', '+statusLabel(state)+'">'+head+'<span class="node-bottom"><span class="node-status"><i></i>'+(latest(node.id)||['supported','indirect'].includes(state)?statusLabel(state):'Inte prövad')+'</span><span>'+year+' '+(node.level==='extension'?'<b class="level-key">R</b>':node.npSource?'<b class="np-key">NP</b>':'')+'</span></span><span class="node-port out"></span></button>';
    }).join('');
    map.innerHTML='<svg class="connections" width="'+width+'" height="'+height+'" aria-hidden="true"><defs><marker id="arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5" fill="#a6b797"/></marker></defs>'+edges+'</svg>'+columns+labels+cards;
    applyZoom(width,height);
  }
  function openGroup(id) {
    const M=window.MATREE,group=M.skillGroups.find(g=>g.id===id);if(!group)return;
    const all=group.members.map(byId),included=all.filter(n=>currentMapNodes.some(v=>v.id===n.id)),list=included.length?included:all,other=all.filter(n=>!list.includes(n));
    const shown=list.filter(n=>latest(n.id)?.score===3).length,cat=categories.find(c=>c.id===group.category);
    selected=null;if(!$('#skill-dialog').open){rememberDialogOrigin('[data-group="'+id+'"]');$('#skill-dialog').showModal();}
    $('#skill-content').innerHTML=[
      '<div class="dialog-top"><div><div class="eyebrow">'+esc(cat.name.toUpperCase())+'</div><h2 id="skill-dialog-title">'+esc(group.title)+'</h2></div><button class="icon-button" data-close="skill-dialog" aria-label="Stäng">×</button></div>',
      '<p class="group-summary"><strong>'+shown+' av '+list.length+' delmoment</strong> med visad kunskap i urvalet.</p><p class="muted small">Öppna ett delmoment för frågor, elevens svar och förkunskaper. Varje delmoment har sitt eget underlag.</p>',
      '<div class="group-members">'+prerequisiteButtons(list.map(n=>n.id))+'</div>',
      other.length?'<details class="dialog-section"><summary>Övriga delmoment i gruppen · '+other.length+'</summary>'+prerequisiteButtons(other.map(n=>n.id))+'</details>':'',
      group.controls.length?'<details class="dialog-section group-controls"><summary>Blandade kontroller och tidigare underlag · '+group.controls.length+'</summary><p class="muted small">Dessa frågor finns kvar som separata kontroller. Resultaten godkänner inte gruppens delmoment automatiskt.</p>'+prerequisiteButtons(group.controls)+'</details>':'',
      '<div class="dialog-actions"><button class="secondary-button" data-expand-group="'+id+'">Visa delmoment i kartan ↗</button>'+(expandedGroups.has(id)?'<button class="text-button" data-collapse-group="'+id+'">Samla gruppen igen</button>':'')+'</div>'
    ].join('');
    $('#skill-dialog').scrollTop=0;
  }
  function applyZoom(width = parseFloat($('#skill-map').style.width), height = parseFloat($('#skill-map').style.height)) {
    $('#skill-map').style.transform = `scale(${zoom})`;
    $('#map-sizer').style.width = `${width*zoom}px`; $('#map-sizer').style.height = `${height*zoom}px`;
    $('#zoom-value').textContent = `${Math.round(zoom*100)} %`;
  }
  function prerequisiteButtons(ids, target = null) {
    return ids.map(id => { const node = byId(id), state = status(node); return `<button class="prerequisite" data-open="${id}"><span>${state === 'mastered' ? '✓' : '↳'}</span><span class="dependency-label">${node.title}${target?`<small>${esc(target.dependencyReasons[id])}</small>`:''}</span><span>${latest(id) ? statusLabel(state) : 'Inte prövad'} →</span></button>`; }).join('');
  }
  function openSkill(id) {
    id=window.MATREE.resolveSkillId(id);
    selected = id;
    if (!$('#skill-dialog').open) { rememberDialogOrigin('[data-node="'+id+'"]'); $('#skill-dialog').showModal(); }
    if (profile().quiz&&window.MATREE.resolveSkillId(profile().quiz.nodeId) === id) { renderQuiz(); return; }
    const node = byId(id), cat = categories.find(c => c.id === node.category), result = latest(id);
    const successors = nodes.filter(n=>n.deps.includes(id));
    $('#skill-content').innerHTML = [
      `<div class="dialog-top"><div><div class="eyebrow">${cat.name.toUpperCase()}</div><h2 id="skill-dialog-title">${node.title}</h2></div><button class="icon-button" data-close="skill-dialog" aria-label="Stäng">×</button></div>`,
      `<div class="skill-meta"><span class="tag">Lärs in: ${window.MATREE.yearViewLabel(node.learnedAt)}</span><span class="tag ${node.level}">${node.level==='core'?'Bas':'Fördjupning'}${node.source.book==='gym'?' · inför gymnasiet':''}</span>${node.npSource?'<span class="tag">Genrepet · NP</span>':''}</div>`,
      `<p class="muted small">Ingår i: ${node.yearViews.map(window.MATREE.yearViewLabel).join(', ')}. Samma färdighet och elevresultat visas i alla dessa urval.</p>`,
      window.MATREE.groupForSkill.has(id)?'<button class="text-button" data-group="'+window.MATREE.groupForSkill.get(id).id+'">← Se gruppens delmoment</button>':'',
      `<p>${node.description}</p><p class="muted small">${result?statusLabel(status(node)):'Inte prövad'}${window.MATREE.mixedControlIds.has(node.id)?' · Blandad kontroll. Delmomenten behåller sina egna resultat.':''}</p>`,
      `<div class="dialog-actions skill-start-actions"><button class="primary-button" data-start="${id}">${result?'Prova igen':'Prova förståelsen'} <span>↗</span></button></div><p class="muted small">Tre frågor ger en första indikation. Komplettera med elevens resonemang.${profile().quiz?' En annan omgång är pausad; fortsätt eller avsluta den först.':''}</p>`,
      `<details class="book-sources"><summary>Underlag och hänvisningar</summary>${sourceLink(node.source)}${(node.mergedSources||[]).filter(s=>s.url!==node.source.url).map(sourceLink).join('')}${node.npSource&&node.source.book!=='np'?sourceLink(node.npSource):''}<p class="muted small">${node.source.kind==='curriculum'?'Kursplanen anger innehåll för stadiet. Delmomentet och frågorna är egna pedagogiska förslag.':'Sidhänvisningen visar var momentet behandlas. Beroendena är ett pedagogiskt förslag. Frågorna här är nyskrivna kontrollfrågor.'}</p></details>`,
      result?`<p class="muted small">Senaste kontroll: ${result.right??result.score} av ${result.total||3} rätt · ${result.pending?'Pågående kontroll':new Date(result.date).toLocaleDateString('sv-SE')}${result.adaptive?' · Automatiskt pass':''}</p>`:'',
      result?.items?`<details class="answer-review"><summary>Se elevens svar i senaste kontrollen</summary>${result.items.map((item,i)=>`<div class="review-item"><strong>${i+1}. ${esc(item.prompt)}</strong>${window.MATREE.renderQuestionVisual(item)}<p>${item.correct?'✓':'↳'} Elevens svar: ${esc(item.skipped?'Jag vet inte':item.response?window.MATREE.answerText(item,item.response):'Svar saknas i äldre underlag')} ${esc(item.unit)}<br>Rätt svar: ${esc(window.MATREE.answerText(item))} ${esc(item.unit)}</p><p class="muted">${esc(item.explanation)}</p></div>`).join('')}</details>`:'',
      `<div class="dialog-section"><h3>Direkta förkunskaper · ${node.deps.length}</h3>${node.deps.length?prerequisiteButtons(node.deps,node):'<p class="muted small">En grundläggande utgångspunkt i den här kartan.</p>'}<button class="secondary-button" data-focus="${node.id}">Visa hela förkunskapskedjan · ${ancestors(id).size} noder ↗</button></div>`,
      `<div class="dialog-section"><h3>Efterföljande färdigheter · ${successors.length}</h3>${successors.length?prerequisiteButtons(successors.map(n=>n.id)):'<p class="muted small">Inga efterföljande noder i detta urval.</p>'}</div>`,
      ''
    ].join('');
    $('#skill-dialog').scrollTop=0;
    const indirect = adaptive.indirect(profile()).filter(c=>c.targetId===id);
    if(indirect.length) $('#skill-content').insertAdjacentHTML('beforeend', `<div class="dialog-section"><h3>Indirekt underlag · lärargranskning</h3><p class="muted small">Rätt svar på en senare uppgift ger en möjlighet att undersöka metoden. Bekräftelse ersätter inte en direkt kontroll.</p>${indirect.slice(-5).map(c=>{const confirmed=profile().adaptive.confirmations.some(k=>k.targetId===id&&k.sourceId===c.sourceId&&k.prompt===c.prompt&&k.sessionId===c.sessionId);return `<div class="review-item"><strong>${esc(byId(c.sourceId).title)}</strong><p>${esc(c.prompt)}</p>${window.MATREE.renderQuestionVisual(c)}<p>Elevens svar: ${esc(window.MATREE.answerText(c,c.response))}</p><p>${esc(c.reason)}</p>${confirmed?`<span>Metod bekräftad av lärare</span><button class="text-button" data-revoke-indirect="${id}" data-source="${c.sourceId}" data-session="${esc(c.sessionId)}" data-prompt="${esc(c.prompt)}">Ångra bekräftelse</button>`:`<button class="secondary-button" data-confirm-indirect="${id}" data-source="${c.sourceId}" data-session="${esc(c.sessionId)}" data-prompt="${esc(c.prompt)}">Bekräfta observerad metod</button>`}</div>`;}).join('')}</div>`);
  }
  function startQuiz(id) {
    id=window.MATREE.resolveSkillId(id);
    if (profile().quiz && window.MATREE.resolveSkillId(profile().quiz.nodeId) !== id) {
      toast('Du har en pausad omgång. Fortsätt den eller avsluta den först.');
      selected = profile().quiz.nodeId; renderQuiz(); return;
    }
    profile().quiz ||= { nodeId: id, questions: [0, 1, 2].map(i => window.MATREE.freshQuestion(id, i,[...(profile().results[id]?.history.flatMap(r=>r.items||[])||[]),...profile().adaptive.sessions.flatMap(s=>s.items).filter(item=>item.nodeId===id)])), answers: [], responses: [], index: 0 };
    selected = id; save(); render(); renderQuiz();return true;
  }
  function renderQuiz() {
    const quiz = profile().quiz, node = byId(quiz.nodeId), q = quiz.questions[quiz.index], answered = quiz.answers.length > quiz.index;
    $('#skill-content').innerHTML = `<div class="dialog-top"><div><div class="eyebrow">KUNSKAPSKONTROLL · ${quiz.index + 1} AV 3</div><h2 id="skill-dialog-title">${node.title}</h2></div><button class="icon-button" data-close="skill-dialog" aria-label="Pausa och stäng">×</button></div><div class="question-progress" aria-label="${quiz.answers.filter(Boolean).length} rätt hittills">${[0, 1, 2].map(i => `<span class="${i < quiz.answers.length ? quiz.answers[i] ? 'correct' : 'incorrect' : i === quiz.index ? 'current' : ''}"></span>`).join('')}</div><h3 class="question-text" id="manual-question-title" tabindex="-1">${esc(window.MATREE.questionStem(q))}</h3>${window.MATREE.renderQuestionVisual(q)}${answered ? `<div class="feedback ${quiz.answers[quiz.index] ? '' : 'wrong'}" role="status"><strong>${quiz.answers[quiz.index] ? 'Rätt svar.' : `Inte riktigt. Svaret är ${esc(window.MATREE.answerText(q))}${q.unit ? ` ${esc(q.unit)}` : ''}.`}</strong><p>${esc(q.explanation)}</p></div><div class="dialog-actions"><button class="primary-button" id="next-question">${quiz.index === 2 ? 'Se resultatet' : 'Nästa fråga'} <span>→</span></button></div>` : `<form id="answer-form">${window.MATREE.renderAnswerFields(q,'answer')}<p class="answer-help" id="answer-help"></p><p id="answer-error" role="alert" class="small"></p></form>`}<div class="dialog-actions"><button class="text-button" data-close="skill-dialog">Pausa och fortsätt senare</button><button class="text-button" id="abandon-quiz">Avsluta omgången</button></div>`;
    if (!answered) {
      $('#answer-help').textContent=window.MATREE.questionAnswerHint(q)+(q.unit&&!q.options?` Skriv svaret utan enheten ${q.unit}.`: '');
      if (q.answer !== 0 && Math.abs(q.answer)<.01) $('#answer-help').textContent = 'Skriv detta lilla tal utan avrundning, med decimaler eller som ett exakt bråk. Exempel: 0,000002 eller 2/1000000.';
      window.MATREE.restoreDraft(q,quiz.draft,'answer');
      (q.options||q.visual?$('#manual-question-title'):$('#answer')).focus({preventScroll:true}); $('#skill-dialog').scrollTop=0;
    } else $('#next-question').focus();
    document.dispatchEvent(new CustomEvent('matree-control-render',{detail:{id:node.id,kind:'quiz'}}));
  }

  function saveQuizDraft(){
    const quiz=profile().quiz,input=$('#answer');if(!quiz||!input||quiz.answers.length>quiz.index)return;
    quiz.draft=window.MATREE.makeDraft(quiz.questions[quiz.index],input.value);save();
  }
  document.addEventListener('input',event=>{if(event.target.id==='answer')saveQuizDraft();});
  document.addEventListener('matree-answer-change',event=>{if(event.target.id==='answer-form')saveQuizDraft();});

  function checkAnswer(event) {
    event.preventDefault();
    const quiz = profile().quiz;
    if (!quiz || quiz.answers.length > quiz.index) return;
    const value = parseAnswer($('#answer').value);
    if (!window.MATREE.responseAllowed(quiz.questions[quiz.index],$('#answer').value)) { const q=quiz.questions[quiz.index];$('#answer-error').textContent = q.options?'Välj ett svarsalternativ.':q.responseFormat==='decimal'?'Skriv svaret i decimalform med komma eller punkt, utan bråkstreck.':'Skriv ett giltigt tal eller bråk utan enhet, till exempel −2, 0,5 eller 1/2.'; return; }
    const expected = quiz.questions[quiz.index].answer;
    const tolerance = expected !== 0 && Math.abs(expected) < .01 ? Math.abs(expected)*.000001 : .000501;
    delete quiz.draft;
    quiz.answers.push(Math.abs(value - expected) <= tolerance);
    quiz.answeredAt=new Date().toISOString();
    quiz.responses.push($('#answer').value.trim());
    save(); renderQuiz();
  }
  function finishQuiz() {
    const quiz = profile().quiz, node = byId(quiz.nodeId), score = quiz.answers.filter(Boolean).length;
    profile().results[node.id] ||= { history: [] };
    const history = profile().results[node.id].history;
    history.push({ score, date: new Date().toISOString(), items: quiz.questions.map((q, i) => ({ ...q, response: quiz.responses[i], correct: quiz.answers[i] })) });
    if (history.length > 100) history.shift();
    profile().quiz = null; save(); render();
    const unresolved = node.deps.filter(id => latest(id)?.score !== 3);
    $('#skill-content').innerHTML = `<div class="dialog-top"><div class="eyebrow">${node.title.toUpperCase()}</div><button class="icon-button" data-close="skill-dialog" aria-label="Stäng">×</button></div><div class="result-hero"><span>${score === 3 ? '✧' : '↟'}</span><h3 id="skill-dialog-title">${score === 3 ? 'Visad kunskap' : 'Behöver följas upp'}</h3><p>${score} av 3 rätt i den här omgången</p></div><p>${score === 3 ? 'Färdigheten markeras som visad kunskap i trädet. Förkunskaperna behåller sina egna resultat och kan undersökas separat.' : 'Svaren visar att den här färdigheten behöver undersökas vidare. Pröva en förkunskap eller träna på förklaringarna och gör en ny omgång.'}</p>${score < 3 && unresolved.length ? `<div class="dialog-section"><h3>Förslag: undersök förkunskaperna</h3>${prerequisiteButtons(unresolved)}<p class="muted small">Detta är möjliga nästa kontroller. Ett fel avgör inte vilken förkunskap som saknas.</p></div>` : ''}<p class="muted small">Tre frågor ger en första indikation. Komplettera med elevens resonemang och fler uppgifter för en säkrare bedömning.</p><div class="dialog-actions"><button class="secondary-button" data-start="${node.id}">Prova igen</button><button class="primary-button" data-open="${nextSkill().id}">Nästa steg →</button></div>`;
    document.dispatchEvent(new CustomEvent('matree-control-render',{detail:{id:node.id,kind:'result'}}));
  }

  let manualHistoryRows=[],manualHistoryPosition=null;
  function openManualRecord(index){
    const entry=manualHistoryRows[index];if(!entry||entry.ownerId!==profile().id)return;
    const M=window.MATREE,record=entry.record,node=entry.node;
    manualHistoryPosition={profileId:profile().id,page:scrollY,record};
    openSkill(node.id);dialogReturnSelector='#progress-view [data-manual-record="'+index+'"]';
    $('#skill-content').innerHTML='<div class="dialog-top"><div><div class="eyebrow">VALD MANUELL KONTROLL</div><h2 id="skill-dialog-title">'+esc(node.title)+'</h2></div><button class="icon-button" data-close="skill-dialog" aria-label="Stäng">×</button></div>'+
      '<button id="manual-history-return" class="text-button">← Tillbaka till kontrollhistoriken</button>'+
      '<p class="report-meta"><strong>'+esc(profile().name)+'</strong> · '+new Date(record.date).toLocaleString('sv-SE',{dateStyle:'short',timeStyle:'short'})+'</p>'+
      '<p class="pass-outcome manual-record-outcome">'+record.score+'/3 rätt · '+(record.score===3?'Visad i denna kontroll':'Behöver följas upp i denna kontroll')+'</p>'+
      '<section class="manual-record-answers" aria-label="Sparade svar i vald kontroll">'+(record.items?record.items.map((item,i)=>'<details class="answer-review"><summary>'+(i+1)+'. '+(item.correct?'Rätt':'Fel')+'</summary><p class="review-prompt">'+esc(M.questionStem(item))+'</p>'+M.renderQuestionVisual(item)+'<div class="review-answer-values"><p><span>Elevens svar</span><strong>'+esc(item.response?M.answerText(item,item.response):'Svar saknas i äldre underlag')+(item.response&&item.unit?' '+esc(item.unit):'')+'</strong></p><p><span>Rätt svar</span><strong>'+esc(M.answerText(item))+' '+esc(item.unit)+'</strong></p></div>'+(item.options?'<details class="option-review"><summary>Visa de sparade svarsalternativen</summary><ol>'+item.options.map(o=>'<li>'+esc(o)+'</li>').join('')+'</ol></details>':'')+'<p>'+esc(item.explanation)+'</p></details>').join(''):'<p class="muted">Endast poäng och datum finns sparade. Svar saknas i äldre underlag.</p>')+'</section>'+
      '<div class="dialog-actions"><button class="secondary-button" data-open="'+node.id+'">Öppna senaste samlade underlaget</button></div>';
    $('#skill-dialog').scrollTop=0;
  }
  function returnManualHistory(){
    const previous=manualHistoryPosition;$('#skill-dialog').close();view='progress';render();
    if(previous?.profileId===profile().id){const index=manualHistoryRows.findIndex(r=>r.record===previous.record);dialogReturnSelector=index>=0?'#progress-view [data-manual-record="'+index+'"]':'#continue-button';window.scrollTo(0,previous.page);$(dialogReturnSelector)?.focus({preventScroll:true});}
  }

  function renderProgress() {
    const needs=detailNodes.filter(n=>evidenceKind(latest(n.id))==='practice'),mastered=detailNodes.filter(n=>evidenceKind(latest(n.id))==='mastered'),partial=detailNodes.filter(n=>evidenceKind(latest(n.id))==='partial'),next=nextSkill();
    const rows=list=>list.length?list.map(n=>'<button class="progress-skill" data-open="'+n.id+'">'+esc(n.title)+'<span>'+esc(evidenceText(n.id,true))+' ↗</span></button>').join(''):'<div class="progress-empty">Inga resultat här ännu.</div>';
    const history = nodes.flatMap(n=>window.MATREE.skillIds(n.id).flatMap(id=>(profile().results[id]?.history||[]).map(r=>({...r,record:r,node:n,ownerId:profile().id})))).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20);
    manualHistoryRows=history;
    $('#progress-view').innerHTML = `<div class="progress-panel"><div class="eyebrow">FÖRSLAG PÅ NÄSTA KONTROLL</div><h2>${next.title}</h2><p>${profile().quiz ? 'En pågående omgång är sparad. Fortsätt från samma fråga.' : needs.some(n => n.deps.includes(next.id)) ? 'En oprövad förkunskap till en färdighet där eleven behöver uppföljning. Kontrollera den för att se om den behöver tränas.' : 'En utgångspunkt för att kartlägga högstadiets matematik och de kunskaper den bygger på.'}</p><button class="primary-button" data-open="${next.id}">Öppna färdigheten ↗</button></div><div class="progress-grid"><div class="progress-panel"><h2>Att undersöka vidare</h2><p>Senaste omgången hade färre än tre rätt.</p>${rows(needs)}</div><div class="progress-panel"><h2>Visad kunskap</h2><p>Manuellt: 3/3. Automatiskt: minst tre rätt och högst ett fel.</p>${rows(mastered)}</div><div class="progress-panel"><h2>Begränsat underlag</h2><p>Det finns inskickade svar, men de räcker inte för ett samlat utfall.</p>${rows(partial)}</div></div><div class="progress-panel"><h2>Senaste kontrollerna</h2><p>Upp till 20 senaste omgångarna. Oprövade noder betyder att underlag saknas.</p>${history.length ? history.map((r,index) => `<button class="progress-skill" data-manual-record="${index}">${r.node.title}<span>${r.score}/3 · ${new Date(r.date).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}</span></button>`).join('') : '<div class="progress-empty">Börja med en färdighet för att samla underlag.</div>'}</div>`;
  }
  function renderNP() {
    const core=detailNodes.filter(n=>n.level==='core'),np=core.filter(n=>n.npSource),coreCounts=evidenceCounts(core),shown=coreCounts.mastered;
    $('#np-view').innerHTML = `<div class="progress-panel np-intro"><div class="eyebrow">GRÖN KURS SOM RIKTMÄRKE</div><h2>${shown} av ${core.length} delområden med visad kunskap</h2><p>Basen bygger på den gröna kursen genom årskurs 7–9. ${np.length} delområden är också kopplade till Genrepet, bokens repetition inför NP. Röda fördjupningar ingår inte i den här räknaren. Den anger kartlagt underlag, inte ett betyg eller en prognos för provet.</p><div class="dialog-actions"><button class="primary-button" data-np-filter="core">Visa basen i trädet ↗</button></div>${sourceLink(window.MATREE.source('np:2'))}</div><div class="progress-grid">${categories.map(cat=>{
      const list=core.filter(n=>n.category===cat.id),counts=evidenceCounts(list),done=counts.mastered,practice=counts.practice;
      return `<div class="progress-panel"><h2><i class="category-dot" style="display:inline-block;background:${cat.color}"></i> ${cat.name}</h2><p>${done}/${list.length} visade · ${practice} att följa upp · ${counts.partial} med begränsat underlag · ${counts.untried} oprövade</p><div class="stat-progress"><i style="width:${list.length?done/list.length*100:0}%"></i></div><details class="np-details"><summary>Se delområden och nästa steg</summary>${list.map(n=>`<button class="progress-skill" data-open="${n.id}">${n.title}<span>${esc(evidenceText(n.id))} ${n.npSource?'· NP':''} ↗</span></button>`).join('')}</details></div>`;
    }).join('')}</div>`;
  }

  function profileCounts(p){
    const M=window.MATREE,allowed=new Set(detailNodes.map(n=>n.id)),tested=new Set();
    const add=id=>{const canonical=M.resolveSkillId(id);if(allowed.has(canonical))tested.add(canonical);};
    Object.entries(p.results).forEach(([id,result])=>{if(result.history.length)add(id);});
    for(const session of [...p.adaptive.sessions,...(p.adaptive.active?[p.adaptive.active]:[])])for(const item of session.items)add(item.nodeId);
    if(p.quiz?.answers.length)add(p.quiz.nodeId);
    return {skills:tested.size,passes:Object.values(p.results).reduce((sum,r)=>sum+r.history.length,0)+p.adaptive.sessions.length};
  }

  function renderProfiles() {
    $('#profile-list').innerHTML = data.profiles.map(p => {const counts=profileCounts(p);return '<div class="profile-row"><button class="profile-select" data-profile="'+esc(p.id)+'"><span class="avatar">'+esc(p.name.charAt(0).toUpperCase())+'</span><span class="profile-identity"><strong>'+esc(p.name)+'</strong><small>'+counts.skills+' '+(counts.skills===1?'prövat delmoment':'prövade delmoment')+' · '+counts.passes+' '+(counts.passes===1?'avslutat pass':'avslutade pass')+'</small></span>'+(p.id===data.activeId?'<span class="profile-active">Aktiv ✓</span>':'')+'</button>'+(data.profiles.length>1?'<button class="delete-profile" data-delete="'+esc(p.id)+'" aria-label="Ta bort '+esc(p.name)+'">Ta bort</button>':'')+'</div>';}).join('');
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.close) { $(`#${button.dataset.close}`).close(); return; }
    if (button.dataset.view) { view = button.dataset.view; render(); }
    if (button.dataset.category) { category = button.dataset.category; focusId = null; view = 'tree'; render(); $('#map-scroll').scrollTo(0,0); }
    if (button.dataset.stage) { stage = button.dataset.stage; if (stage === '0') level = 'all'; focusId = null; render(); $('#map-scroll').scrollTo(0,0); }
    if (button.dataset.foundation) { foundationBand=button.dataset.foundation; focusId=null; render(); $('#map-scroll').scrollTo(0,0); }
    if (button.dataset.mapMode) { mapMode=button.dataset.mapMode; expandedGroups.clear(); renderMap(); $('#map-scroll').scrollTo(0,0); }
    if (button.dataset.group) openGroup(button.dataset.group);
    if (button.dataset.expandGroup || button.dataset.collapseGroup) { const id=button.dataset.expandGroup||button.dataset.collapseGroup; if(button.dataset.expandGroup)expandedGroups.add(id);else expandedGroups.delete(id); $('#skill-dialog').close();renderMap(); const g=window.MATREE.skillGroups.find(g=>g.id===id),el=button.dataset.expandGroup?g.members.map(id=>$('[data-node="'+id+'"]')).find(Boolean):$('[data-group="'+id+'"]');if(el){$('#map-scroll').scrollTo(Math.max(0,parseFloat(el.style.left)*zoom-80),Math.max(0,parseFloat(el.style.top)*zoom-80));el.focus({preventScroll:true});} }
    if (button.dataset.revokeIndirect) { profile().adaptive.confirmations=profile().adaptive.confirmations.filter(c=>!(c.targetId===button.dataset.revokeIndirect&&c.sourceId===button.dataset.source&&c.sessionId===button.dataset.session&&c.prompt===button.dataset.prompt));save();render();openSkill(button.dataset.revokeIndirect); }
    if (button.dataset.confirmIndirect) { const c=adaptive.indirect(profile()).find(c=>c.targetId===button.dataset.confirmIndirect&&c.sourceId===button.dataset.source&&c.sessionId===button.dataset.session&&c.prompt===button.dataset.prompt);if(c){profile().adaptive.confirmations.push({targetId:c.targetId,sourceId:c.sourceId,sessionId:c.sessionId,prompt:c.prompt,date:new Date().toISOString()});profile().adaptive.confirmations=profile().adaptive.confirmations.slice(-500);save();render();openSkill(c.targetId);} }
    if (button.dataset.focus) { focusId = button.dataset.focus; view='tree'; $('#skill-dialog').close(); render(); const pos=$(`[data-node="${focusId}"]`); if(pos) { $('#map-scroll').scrollLeft=Math.max(0,parseFloat(pos.style.left)*zoom-100); $('#map-scroll').scrollTop=Math.max(0,parseFloat(pos.style.top)*zoom-100); pos.focus({preventScroll:true}); } }
    if (button.id === 'clear-focus') { focusId=null; render(); }
    if (button.dataset.npFilter) { level=button.dataset.npFilter; category=stage='all'; focusId=null; search=''; $('#search').value=''; view='tree'; render(); $('#map-scroll').scrollTo(0,0); }
    if (button.dataset.manualRecord!==undefined)openManualRecord(Number(button.dataset.manualRecord));
    if (button.id==='manual-history-return')returnManualHistory();
    if (button.dataset.node || button.dataset.open) openSkill(button.dataset.node || button.dataset.open);
    if (button.dataset.start) startQuiz(button.dataset.start);
    if (button.id === 'continue-button') openSkill(nextSkill().id);
    if (button.id === 'reset-filters') { category = stage = level = 'all'; focusId=null; search = ''; $('#search').value = ''; render(); $('#map-scroll').scrollTo(0,0); }
    if (button.id === 'about-button') $('#about-dialog').showModal();
    if (button.id === 'profile-button' || button.id === 'active-profile') { $('#profile-message').textContent = ''; renderProfiles(); $('#profiles-dialog').showModal(); }
    if (button.id === 'next-question') { const quiz = profile().quiz; if (!quiz || quiz.answers.length <= quiz.index) return; if (quiz.index === 2) finishQuiz(); else { quiz.index++; save(); renderQuiz(); } }
    if (button.id === 'abandon-quiz' && confirm('Avsluta den pågående omgången? Svaren i just den här omgången sparas då inte som ett resultat.')) { const id = profile().quiz.nodeId; profile().quiz = null; save(); render(); openSkill(id); }
    if (button.dataset.profile) { data.activeId = button.dataset.profile; save(); render(); $('#profiles-dialog').close(); toast(`Aktiv profil: ${profile().name}`); }
    if (button.dataset.delete) {
      const p = data.profiles.find(p => p.id === button.dataset.delete);
      if (p && data.profiles.length > 1 && confirm(`Ta bort profilen ”${p.name}” och dess resultat från den här webbläsaren?`)) { data.profiles = data.profiles.filter(item => item.id !== p.id); if (data.activeId === p.id) data.activeId = data.profiles[0].id; save(); renderProfiles(); render(); }
    }
    if (button.id === 'export-button') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `matree-profiler-${new Date().toISOString().slice(0, 10)}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Profilerna har exporterats.');
    }
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'answer-form') checkAnswer(event);
    if (event.target.id === 'profile-form') {
      event.preventDefault(); const name = $('#new-profile').value.trim();
      if (!name) { $('#new-profile').setCustomValidity('Ange ett namn eller smeknamn.'); $('#new-profile').reportValidity(); return; }
      if (data.profiles.length >= 200) { $('#profile-message').textContent = 'Maximalt 200 profiler kan sparas.'; return; }
      const p = newProfile(name); data.profiles.push(p); data.activeId = p.id; save(); render(); renderProfiles(); $('#new-profile').value = ''; $('#profiles-dialog').close(); toast(`Profilen ${name} är skapad.`);
    }
  });
  $('#mobile-category').addEventListener('change', event => { category = event.target.value; focusId=null; render(); });
  $('#level-filter').addEventListener('change', event => { level=event.target.value; focusId=null; render(); $('#map-scroll').scrollTo(0,0); });
  $('#map-zoom').addEventListener('input', event => { zoom=Number(event.target.value)/100; applyZoom(); });
  $('#new-profile').addEventListener('input', () => $('#new-profile').setCustomValidity(''));
  $('#search').addEventListener('input', event => { search = event.target.value.trim().toLocaleLowerCase('sv'); focusId=null; renderMap(); $('#map-scroll').scrollTo(0,0); });
  const mapScroll = $('#map-scroll');
  let pan = null, suppressPanClick = false;
  mapScroll.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    // Låt webbläsaren hantera drag i själva rullisterna.
    const bounds = mapScroll.getBoundingClientRect();
    if (event.clientX >= bounds.left + mapScroll.clientLeft + mapScroll.clientWidth ||
        event.clientY >= bounds.top + mapScroll.clientTop + mapScroll.clientHeight) return;
    suppressPanClick = false;
    pan = { id: event.pointerId, x: event.clientX, y: event.clientY,
      left: mapScroll.scrollLeft, top: mapScroll.scrollTop, dragging: false };
  });
  function endPan() {
    if (!pan) return;
    const { id, dragging } = pan;
    pan = null;
    suppressPanClick = dragging;
    mapScroll.classList.remove('is-panning');
    if (mapScroll.hasPointerCapture(id)) mapScroll.releasePointerCapture(id);
  }
  window.addEventListener('pointermove', event => {
    if (!pan || event.pointerId !== pan.id) return;
    if (!(event.buttons & 1)) { endPan(); return; }
    const dx = event.clientX - pan.x, dy = event.clientY - pan.y;
    // Små handrörelser ska fortfarande räknas som ett vanligt nodklick.
    if (!pan.dragging && Math.hypot(dx, dy) < 5) return;
    if (!pan.dragging) {
      pan.dragging = true;
      mapScroll.setPointerCapture(event.pointerId);
      mapScroll.classList.add('is-panning');
    }
    event.preventDefault();
    mapScroll.scrollLeft = pan.left - dx;
    mapScroll.scrollTop = pan.top - dy;
  });
  window.addEventListener('pointerup', event => { if (pan?.id === event.pointerId) endPan(); });
  window.addEventListener('pointercancel', event => { if (pan?.id === event.pointerId) endPan(); });
  mapScroll.addEventListener('lostpointercapture', endPan);
  window.addEventListener('blur', endPan);
  mapScroll.addEventListener('click', event => {
    if (!suppressPanClick || event.detail === 0) return;
    suppressPanClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  function highlightConnections(node) {
    const id=node&&(node.dataset.node||'group:'+node.dataset.group);
    document.querySelectorAll('.connection').forEach(edge=>edge.classList.toggle('related',!!id&&(edge.dataset.from===id||edge.dataset.to===id)));
  }
  $('#skill-map').addEventListener('pointerover',event=>highlightConnections(event.target.closest('[data-node],[data-group]')));
  $('#skill-map').addEventListener('focusin',event=>highlightConnections(event.target.closest('[data-node],[data-group]')));
  $('#skill-map').addEventListener('pointerleave',()=>highlightConnections(null));
  $('#skill-map').addEventListener('focusout',event=>highlightConnections(event.relatedTarget?.closest?.('[data-node],[data-group]')));
  $('#map-connections').addEventListener('change',event=>$('#skill-map').classList.toggle('show-connections',event.target.checked));
  $('#skill-dialog').addEventListener('close',()=>{if(document.querySelector('dialog[open]'))return;if(dialogMapPosition?.context===mapContext()){$('#map-scroll').scrollTo(dialogMapPosition.left,dialogMapPosition.top);window.scrollTo(0,dialogMapPosition.page);}const target=focusId?$('[data-node="'+focusId+'"]'):$(dialogReturnSelector);(target?.getClientRects().length?target:$('#continue-button')).focus({preventScroll:true});});
  let resizeTimer;
  new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(view==='tree'&&mapMode==='groups'&&!focusId&&!search)renderMap();},120);}).observe($('#map-scroll'));
  $('#import-file').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 20_000_000) throw new Error('Filen är för stor (max 20 MB).');
      const imported = validateData(JSON.parse(await file.text()));
      if (data.profiles.length + imported.profiles.length > 200) throw new Error('Importen skulle ge fler än 200 profiler.');
      // Importera som separata kopior så att befintliga resultat aldrig skrivs över.
      const copies = imported.profiles.map(p => ({ ...p, id: uid(), name: data.profiles.some(existing => existing.name === p.name) ? `${p.name.slice(0, 30)} (import)` : p.name }));
      data.profiles.push(...copies); data.activeId = copies[imported.profiles.findIndex(p=>p.id===imported.activeId)].id; save(); render(); renderProfiles(); $('#profile-message').textContent = `${copies.length} profiler importerade. Befintliga profiler finns kvar.`;
    } catch (error) { $('#profile-message').textContent = `Kunde inte importera: ${error.message}`; }
    event.target.value = '';
  });
  window.addEventListener('storage', event => {
    if (event.key === key) { storageOK = false; $('#save-status').textContent = '⚠ Profiler har ändrats i en annan flik · Ladda om eller exportera'; toast('En annan flik har ändrat profilerna. Exportera eventuellt arbete här och ladda sedan om.'); }
  });
  window.MATREE_APP={profile,profileCounts,evidenceCounts,save,render,startQuiz,categoryScope:()=>view==='tree'&&category!=='all'?category:null,yearScope:()=>view!=='tree'||stage==='all'?null:stage==='0'?(foundationBand==='2'?'4-6':'1-3'):stage,openSkill,openGroup,esc,latest,storageOK:()=>storageOK,showProgress:()=>{view='progress';render();}};
  save(); render(); if (loadWarning) toast(loadWarning);
})();
