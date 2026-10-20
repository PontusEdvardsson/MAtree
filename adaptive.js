/* Regelstyrt urval, inte en kalibrerad psykometrisk modell. */
(() => {
  'use strict';
  const M = window.MATREE, resolve=M.resolveSkillId, byId = id => M.visibleNodes.find(n=>n.id===resolve(id));
  const validId = id => M.detailNodes.some(n=>n.id===resolve(id))||M.legacyAdaptiveIds.has(resolve(id));
  const scopes = ['1-3','4-6','7','8','9'];
  const inScope = (node,scope,category=null,selection='progression') => (!scope || (selection==='course'?M.matchesCourseYear(node,scope):M.matchesYearView(node,scope)))&&(!category||node.category===category);
  const validCategory = category => category===null||M.categories.some(c=>c.id===category);
  // A saved pass without a policy keeps its original progression; a new selection uses the course.
  const scopedPool = session => {
    const nodes=session.id&&session.catalogue!=='assessed'?M.archivedDetailNodes:M.detailNodes;
    return nodes.filter(n=>(session.mode==='all'||n.level==='core')&&inScope(n,session.scope,session.category,session.selection??(session.id?'progression':'course')));
  };
  const scopeLabel = session => session.scope ? `Åk ${session.scope.replace('-','–')}${session.category?' · '+M.categories.find(c=>c.id===session.category).name:''}${session.mode==='all'?' · Testa alla':''}${session.id&&['7','8','9'].includes(session.scope)&&session.selection!=='course'?' · äldre urval med grunder':''}` : session.start==='basic'?'Tidigare grunder · äldre blandat pass':'Högstadieingångar · äldre blandat pass';
  function estimateAll(scope,category=null,selection='course') {
    const nodes=scopedPool({scope,category,mode:'all',selection}),skills=nodes.length;
    return {skills,core:nodes.filter(n=>n.level==='core').length,extension:nodes.filter(n=>n.level!=='core').length,minQuestions:skills*2,maxQuestions:skills*4,minMinutes:skills*2,maxMinutes:skills*4};
  }
  const basicAnchors = ['f-count','f-equality','f-shapes','f-readtable','f-double','f-half','f-chance','f-word-add','f-percent'];
  const higherAnchors = ['decimal-plats','brak-forlanga','ekvation-add','area-rektangel','proportionalitet','procent-begrepp','f-probability','f-mean','f-word-mult'];
  const now = () => new Date().toISOString();
  function correct(q, response) {
    if(!M.responseAllowed(q,response))return false;
    const value=M.parseAnswer(response), tolerance=q.answer!==0&&Math.abs(q.answer)<.01?Math.abs(q.answer)*.000001:.000501;
    return Number.isFinite(value)&&Math.abs(value-q.answer)<=tolerance;
  }
  function evidence(session, id) {
    const items=session.items.filter(i=>resolve(i.nodeId)===resolve(id)), right=items.filter(i=>i.correct).length, wrong=items.length-right;
    return {items,right,wrong,total:items.length,state:right>=3&&wrong<=1?'shown':wrong>=2?'followup':'partial'};
  }
  function known(session,id){return session.known?.some(key=>resolve(key)===resolve(id))||evidence(session,id).state==='shown';}
  function completed(session,id){return session.known?.some(key=>resolve(key)===resolve(id))||['shown','followup'].includes(evidence(session,id).state);}
  function ancestors(id, found=new Set()) { for(const dep of byId(id).deps)if(!found.has(dep)){found.add(dep);ancestors(dep,found);}return found; }
  function choose(session) {
    if(session.items.length>=session.limit)return null;
    const candidates=scopedPool(session),candidateIds=new Set(candidates.map(n=>n.id));
    const last=session.items.at(-1), current=last?resolve(last.nodeId):null;
    if(current&&!completed(session,current))return {id:current,reason:'En till uppgift prövar samma delmoment med en annan variant.'};
    if(current&&evidence(session,current).state==='followup'&&!session.remediation) {
      const direct=byId(current).deps;
      const missing=[...ancestors(current)].map(byId).filter(n=>candidateIds.has(n.id)&&!completed(session,n.id)).sort((a,b)=>(direct.includes(a.id)?0:1)-(direct.includes(b.id)?0:1)||a.depth-b.depth);
      if(missing.length){session.remediation=true;return {id:missing[0].id,reason:`Tidigare delmoment undersöks efter svårigheter med ${byId(current).title}.`};}
    }
    session.remediation=false;
    const blocked = n => [...ancestors(n.id)].some(id=>candidateIds.has(id)&&evidence(session,id).state==='followup');
    const anchors=session.scope?candidates.filter(n=>n.deps.every(id=>!candidateIds.has(id))):(session.start==='basic'?basicAnchors:higherAnchors).map(byId).filter(Boolean);
    const exhaustive=session.coveragePolicy==='exhaustive';
    const remaining=candidates.filter(n=>!completed(session,n.id)&&(exhaustive||session.mode==='all'||!blocked(n)));
    const eligible=exhaustive||session.mode==='all'?remaining:remaining.filter(n=>n.deps.every(id=>!candidateIds.has(id)||known(session,id))||anchors.some(a=>a.id===n.id));
    if(!eligible.length)return null;
    const categoryTotals=new Map();
    for(const item of session.items){const cat=byId(item.nodeId).category;categoryTotals.set(cat,(categoryTotals.get(cat)||0)+1);}
    const categoryCount = cat => categoryTotals.get(cat)||0;
    eligible.sort((a,b)=>categoryCount(a.category)-categoryCount(b.category) ||
      (anchors.some(n=>n.id===a.id)?0:1)-(anchors.some(n=>n.id===b.id)?0:1) || a.depth-b.depth || a.id.localeCompare(b.id));
    const node=eligible[0],direct=node.deps.filter(id=>candidateIds.has(id)),hasDirect=direct.length&&direct.every(id=>known(session,id));
    return {id:node.id,reason:exhaustive||session.mode==='all'?'Fler delmoment i valt urval undersöks, även när förkunskaper behöver följas upp.':hasDirect?'Nästa delmoment efter visade direkta förkunskaper inom urvalet, från detta eller tidigare kontroller.':'Ett ingångsmoment breddar kartläggningen till fler områden.'};
  }
  function next(session) {
    delete session.draft;
    const selected=choose(session);
    if(!selected){session.pending=null;session.ended=now();session.endReason=(session.coveragePolicy==='exhaustive'||session.mode==='all')&&scopedPool(session).every(n=>completed(session,n.id))?'all-tested':session.items.length>=session.limit?'limit':'coverage';return null;}
    const tried=new Set(session.items.filter(i=>resolve(i.nodeId)===selected.id).map(i=>i.variant));
    const passed=new Set(session.items.filter(i=>resolve(i.nodeId)===selected.id&&i.correct).map(i=>i.variant));
    const variant=[0,1,2].find(v=>!tried.has(v))??[0,1,2].find(v=>!passed.has(v))??session.items.filter(i=>i.nodeId===selected.id).length%3;
    // Undvik att samma parameteriserade fråga visas igen när det finns alternativ.
    const question=M.freshQuestion(selected.id,variant,[...session.items,...(session.recent||[])]);
    session.pending={...question,nodeId:selected.id,variant,reason:selected.reason};
    return session.pending;
  }
  function create({start='basic',limit=30,scope=null,known=[],recent=[],mode='adaptive',category=null,selection='course'}={}) {
    if(scope!==null&&!scopes.includes(scope))throw Error('Välj ett giltigt årskursurval.');
    if(!['adaptive','all'].includes(mode)||mode==='all'&&scope===null)throw Error('Välj ett giltigt kartläggningsläge och årskursurval.');
    if(!validCategory(category)||category!==null&&scope===null)throw Error('Välj ett giltigt kunskapsområde och årskursurval.');
    if(!['course','progression'].includes(selection))throw Error('Ogiltigt innehållsurval.');
    if(category&&!scopedPool({scope,category,mode,selection}).length)throw Error('Det finns inga delmoment i detta urval.');
    if(mode==='all'){known=[];limit=estimateAll(scope,category,selection).maxQuestions;}
    if(!Array.isArray(known)||known.some(id=>!validId(id)||!inScope(byId(id),scope,category,selection)))throw Error('Ogiltigt tidigare underlag.');
    const session={id:window.crypto?.randomUUID?.()||`a-${Date.now()}-${Math.random()}`,catalogue:'assessed',coveragePolicy:'exhaustive',started:now(),ended:null,endReason:null,start,scope,...(scope?{selection}:{}),...(category?{category}:{}),...(mode==='all'?{mode}:{}),known:[...new Set(known)],recent:recent.slice(-200),limit,items:[],pending:null,remediation:false};
    next(session);return session;
  }
  function answer(session,response,skip=false) {
    if(!session.pending||session.ended)return false;
    if(!skip&&!M.responseAllowed(session.pending,response))return false;
    session.items.push({...session.pending,response:skip?'':response.trim(),skipped:skip,correct:!skip&&correct(session.pending,response),date:now()});
    session.pending=null;next(session);return true;
  }
  function summary(session){return [...new Set(session.items.map(i=>resolve(i.nodeId)))].map(id=>({node:byId(id),...evidence(session,id)}));}
  const links = {
    'brak-add-olika':[{id:'brak-forlanga',reason:'Gemensam nämnare kan kräva förlängning. Bekräfta att eleven faktiskt visade omskrivningen.'},{id:'gemensam-namnare',reason:'Kontrollera hur eleven valde den gemensamma nämnaren.'}],
    'brak-sub-olika':[{id:'brak-forlanga',reason:'Kontrollera att eleven själv förlängde bråken innan subtraktionen.'}],
    'f-fraction-equal':[{id:'f-half',reason:'Be eleven förklara varför de olika indelningarna visar samma andel.'}],
    'area-rektangel':[{id:'multiplikation',reason:'Bekräfta att eleven själv utförde multiplikationen.'}],
    'f-area':[{id:'f-groups',reason:'Bekräfta att eleven såg raderna som lika stora grupper.'}],
    'procent-delen':[{id:'procent-begrepp',reason:'Be eleven förklara vad procenttalet betyder och hur det skrevs om.'}],
    'ekvation-tva-steg':[{id:'ekvation-add',reason:'Bekräfta hur eleven använde samma addition eller subtraktion på båda sidor.'}],
    'f-word-mult':[{id:'f-table',reason:'Bekräfta att eleven använde multiplikation och gjorde beräkningen själv.'}]
  };
  function indirect(profile) {
    const candidates=[];
    const add=(sourceId,item,sessionId)=> { if(!item.correct)return; for(const link of links[sourceId]||[])if(byId(link.id)) candidates.push({targetId:link.id,sourceId,sessionId,prompt:item.prompt,response:item.response,answer:item.answer,unit:item.unit,reason:link.reason,...M.questionExtras(item)}); };
    for(const session of profile.adaptive?.sessions||[])for(const item of session.items)add(item.nodeId,item,session.id);
    if(profile.adaptive?.active)for(const item of profile.adaptive.active.items)add(item.nodeId,item,profile.adaptive.active.id);
    for(const [id,result]of Object.entries(profile.results))for(const item of result.history.at(-1)?.items||[])add(id,item,'manual');
    return candidates;
  }
  function validate(state) {
    if(state===undefined||state===null)return {active:null,sessions:[],confirmations:[]};
    if(typeof state!=='object'||!Array.isArray(state.sessions)||state.sessions.length>30)throw Error('Ogiltiga automatiska pass.');
    const date = value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
    const question = item => item&&validId(item.nodeId)&&typeof item.prompt==='string'&&item.prompt.length<=2000&&typeof item.explanation==='string'&&item.explanation.length<=3000&&Number.isFinite(item.answer)&&typeof item.unit==='string'&&item.unit.length<=30&&Number.isInteger(item.variant)&&item.variant>=0&&item.variant<=2&&typeof item.reason==='string'&&item.reason.length<=500;
    const checkSession = (s,active) => {
      if(!s||typeof s.id!=='string'||s.id.length>100||!date(s.started)||!['basic','higher'].includes(s.start)||(s.mode==='all'?(!Number.isInteger(s.limit)||s.limit<1||s.limit>M.nodes.length*4):![30,60,90].includes(s.limit))||!Array.isArray(s.items)||s.items.length>s.limit||typeof s.remediation!=='boolean'||(active?s.ended!==null:!date(s.ended)))throw Error('Ogiltigt automatiskt pass.');
      const scope=s.scope??null,mode=s.mode??'adaptive',category=s.category??null,selection=s.selection??'progression';
      if(s.coveragePolicy!==undefined&&s.coveragePolicy!=='exhaustive')throw Error('Ogiltig regel för fortsatt prövning.');
      if(s.catalogue!==undefined&&s.catalogue!=='assessed')throw Error('Ogiltig innehållsversion.');
      if(!['course','progression'].includes(selection))throw Error('Ogiltigt innehållsurval i automatiskt pass.');
      if(!validCategory(category)||category!==null&&scope===null)throw Error('Ogiltigt kunskapsområde i automatiskt pass.');
      if(!['adaptive','all'].includes(mode)||mode==='all'&&scope===null)throw Error('Ogiltigt kartläggningsläge.');
      const allowed=new Set(scopedPool({id:s.id,catalogue:s.catalogue,scope,mode,category,selection}).map(n=>n.id));
      if(scope!==null&&!scopes.includes(scope))throw Error('Ogiltigt årskursurval i automatiskt pass.');
      const prior=s.known??[];
      if(mode==='all'&&(!Array.isArray(prior)||prior.length))throw Error('Testa alla får inte hoppa över tidigare visade färdigheter.');
      const recent=s.recent??[];
      if(!Array.isArray(recent)||recent.length>200||recent.some(i=>!validId(i.nodeId)||typeof i.fingerprint!=='string'||!/^[0-9a-f]{8}$/.test(i.fingerprint)))throw Error('Ogiltig uppgiftshistorik.');
      if(!Array.isArray(prior)||prior.length>M.nodes.length||new Set(prior).size!==prior.length||prior.some(id=>!validId(id)||!inScope(byId(id),scope,category,selection)))throw Error('Ogiltigt tidigare underlag i automatiskt pass.');
      const items=s.items.map(i=> {if(!question(i)||typeof i.response!=='string'||i.response.length>60||typeof i.correct!=='boolean'||typeof i.skipped!=='boolean'||!date(i.date)||i.correct!==(!i.skipped&&correct(i,i.response)))throw Error('Ogiltigt elevsvar i automatiskt pass.');return {...i,...M.questionExtras(i)};});
      if(active&&(s.items.length>=s.limit||!question(s.pending)))throw Error('Ogiltig pågående automatisk fråga.');
      if(!active&&s.pending!==null)throw Error('Avslutat pass har en pågående fråga.');
      if(items.some(i=>!inScope(byId(i.nodeId),scope,category,selection)||!allowed.has(resolve(i.nodeId))&&!M.legacyAdaptiveIds.has(resolve(i.nodeId)))||active&&(!inScope(byId(s.pending.nodeId),scope,category,selection)||!allowed.has(resolve(s.pending.nodeId))&&!M.legacyAdaptiveIds.has(resolve(s.pending.nodeId))))throw Error('Passet innehåller uppgifter utanför valt årskursurval.');
      const draft=active?M.validateDraft(s.pending,s.draft):null;
      return {id:s.id,...(s.coveragePolicy!==undefined?{coveragePolicy:s.coveragePolicy}:{}),...(s.catalogue!==undefined?{catalogue:s.catalogue}:{}),started:s.started,ended:s.ended,endReason:['limit','coverage','teacher','all-tested'].includes(s.endReason)?s.endReason:null,start:s.start,scope,...(s.selection!==undefined?{selection}:{}),...(category?{category}:{}),...(mode==='all'?{mode}:{}),known:[...prior],recent:recent.map(i=>({nodeId:i.nodeId,fingerprint:i.fingerprint})),limit:s.limit,items,pending:active?{...s.pending,...M.questionExtras(s.pending)}:null,remediation:s.remediation,...(draft?{draft}:{})};
    };
    const confirmations=(state.confirmations||[]).map(c=> {if(!validId(c.targetId)||!validId(c.sourceId)||typeof c.prompt!=='string'||c.prompt.length>2000||typeof c.sessionId!=='string'||c.sessionId.length>100||!date(c.date))throw Error('Ogiltig metodbekräftelse.');return {targetId:c.targetId,sourceId:c.sourceId,prompt:c.prompt,sessionId:c.sessionId,date:c.date};});
    if(confirmations.length>500)throw Error('För många metodbekräftelser.');
    return {active:state.active?checkSession(state.active,true):null,sessions:state.sessions.map(s=>checkSession(s,false)),confirmations};
  }
  function latestEvidence(profile,id) {
    const records=[...(profile.adaptive?.sessions||[]),...(profile.adaptive?.active?[profile.adaptive.active]:[])].filter(s=>s.items.some(i=>resolve(i.nodeId)===resolve(id)));
    const s=records.at(-1);return s?{...evidence(s,id),date:s.items.filter(i=>resolve(i.nodeId)===resolve(id)).at(-1).date}:null;
  }
  window.MATREE_ADAPTIVE={create,answer,next,summary,evidence,indirect,validate,latestEvidence,correct,scopedPool,scopeLabel,estimateAll};
})();
