window.verifySkillGroups=()=>{
  const M=window.MATREE,A=window.MATREE_ADAPTIVE,app=window.MATREE_APP,$=s=>document.querySelector(s),check=(c,m)=>{if(!c)throw Error(m);};
  let selections=0;
  const sets=[M.detailNodes,...['1-3','4-6','7','8','9'].map(s=>M.detailNodes.filter(n=>M.matchesYearView(n,s))),...M.categories.map(c=>M.detailNodes.filter(n=>n.category===c.id)),...['core','extension'].map(l=>M.detailNodes.filter(n=>n.level===l))];
  for(const visible of sets)for(const expanded of [new Set(),new Set(['fraction-equivalence','right-triangles']),new Set(M.skillGroups.map(g=>g.id))]){
    const p=M.projectMap(visible,{expanded}),all=p.entries.flatMap(e=>e.members.map(n=>n.id)),ids=new Set(all);
    check(all.length===visible.length&&ids.size===visible.length&&visible.every(n=>ids.has(n.id)),'Every filtered skill appears exactly once');
    check(p.rawEdgeCount===p.internalCount+p.edges.reduce((sum,e)=>sum+e.pairs.length,0),'All prerequisite pairs survive grouping');
    const done=new Set(),active=new Set(),byId=new Map(p.entries.map(e=>[e.id,e]));
    const visit=id=>{check(!active.has(id),'Grouped projection remains acyclic');if(done.has(id))return;active.add(id);byId.get(id).deps.forEach(visit);active.delete(id);done.add(id);};
    p.entries.forEach(e=>visit(e.id));selections++;
  }
  const p=M.projectMap(M.detailNodes);
  check(p.entries.length<M.detailNodes.length*.65,'Default grouping materially reduces card count');
  check(document.querySelectorAll('.skill-node').length===p.entries.length&&document.querySelector('[data-group]'),'Default UI renders groups');
  check(M.mixedControlIds.size===11&&M.detailNodes.length===253,'Mixed checks are kept outside the detailed denominator');
  check(M.detailNodes.some(n=>n.id==='uttryck')&&M.detailNodes.every(n=>n.deps.every(id=>!M.mixedControlIds.has(id))),'Substitution remains a separate skill and no detailed skill requires a broad control');
  check(!A.scopedPool({scope:null}).some(n=>M.mixedControlIds.has(n.id)),'Automatic sampling excludes duplicated broad controls');
  const saved={results:app.profile().results,quiz:app.profile().quiz,adaptive:app.profile().adaptive};
  try{
    const profile=app.profile();profile.results={};profile.quiz=null;profile.adaptive={active:null,sessions:[],confirmations:[]};
    const item=(id,score)=>({history:[{score,date:'2026-10-14T10:00:00.000Z',items:[0,1,2].map(v=>{const q=M.generateReviewed(id,v),correct=v<score;return {...q,response:String(q.answer+(correct?0:1000)),correct};})}]});
    profile.results['pythagoras-hyp']=item('pythagoras-hyp',3);app.render();
    check(!$('.skill-node[data-group="right-triangles"]').classList.contains('mastered'),'Group is not all mastered after one passed member');
    $('.skill-node[data-group="right-triangles"]').click();
    check($('#skill-content .group-summary').textContent.includes('1 av 5'),'Group reflects just the individually demonstrated skill');
    check($('#skill-content [data-open="pythagoras-katet"]')&&!app.latest('pythagoras-katet')&&!app.latest('pythagoras-kontroll'),'One passed aspect does not approve other group members');
    $('#skill-dialog').close();
    app.openGroup('fraction-equivalence');$('[data-expand-group="fraction-equivalence"]').click();
    check(M.skillGroups.find(g=>g.id==='fraction-equivalence').members.every(id=>$('.skill-node[data-node="'+id+'"]')),'An individual group expands into all its skill cards');
    app.openGroup('fraction-equivalence');$('[data-collapse-group="fraction-equivalence"]').click();
    check(!$('.skill-node[data-node="brak-forlanga"]')||p.unfolded.has('fraction-equivalence'),'Collapse restores the coherent group projection');
    $('.skill-node[data-group="fraction-meaning"]').click();check($('#skill-content .group-controls [data-open="brak"]'),'Old broad check remains accessible within its group');
    $('#skill-content [data-open="brak"]').click();check($('#skill-content [data-start="brak"]'),'Old broad check keeps its own questions');$('#skill-dialog').close();
    profile.results['f-negative']=item('f-negative',3);app.render();check(app.latest('negativa').score===3,'Old negative-number result resolves to the shared skill');
    const old=[0,1,2].map(v=>M.generateReviewed('f-negative',v));profile.quiz={nodeId:'f-negative',questions:old,answers:[],responses:[],index:0};
    app.openSkill('f-negative');check($('#skill-content h2').textContent==='Negativa tal och tallinjen'&&profile.quiz.questions[0].answer===old[0].answer,'Paused alias quiz retains the exact original answer');$('#skill-dialog').close();profile.quiz=null;
    const archived=A.create({scope:'4-6'});archived.pending={...M.generateReviewed('f-median',0),nodeId:'f-median',variant:0,reason:'En tidigare sparad kontroll.'};
    check(A.validate({active:archived,sessions:[],confirmations:[]}).active.pending.nodeId==='f-median','Previously saved mixed median questions remain resumable');
    app.openSkill('pythagoras-hyp');$('[data-focus="pythagoras-hyp"]').click();check($('.skill-node[data-node="kvadratrot"]')&&!$('.skill-node[data-group]'),'Prerequisite focus always shows the actual skills');$('#clear-focus').click();
    $('#search').value='Förlänga bråk';$('#search').dispatchEvent(new Event('input'));check($('.skill-node[data-node="brak-forlanga"]'),'Search opens matching subskills directly');$('#reset-filters').click();
  }finally{const profile=app.profile();profile.results=saved.results;profile.quiz=saved.quiz;profile.adaptive=saved.adaptive;$('#skill-dialog').close();$('#adaptive-dialog').close();app.save();app.render();$('[data-map-mode="details"]').click();}
  return selections+' grouped projections retain every skill and dependency without cycles; independent group evidence, expansion, focused prerequisites and legacy questions passed';
};
