window.verifyDependencyReasons=()=>{
  const M=window.MATREE,app=window.MATREE_APP,$=s=>document.querySelector(s),check=(c,m)=>{if(!c)throw Error(m);};
  const byId=new Map(M.visibleNodes.map(n=>[n.id,n])),profileBefore=JSON.stringify(app.profile());
  const expectedReason='Bråken behöver uttryckas i lika stora delar innan täljarna kan adderas.';
  check(byId.get('brak-add-olika').dependencyReasons['gemensam-namnare']===expectedReason,'Specific reason survives the complete script loading order');
  check(byId.get('median').dependencyReview.medel===true&&!byId.get('pythagoras-hyp').dependencyReview.kvadratrot,'Conditional method and direct mathematical step are distinguished');
  let edges=0,rendered=0,groupPairs=0;
  for(const target of M.visibleNodes){
    check(Object.keys(target.dependencyReasons).length===target.deps.length,'No stale reasons after merging: '+target.id);
    for(const from of target.deps){
      const reason=target.dependencyReasons[from];
      check(typeof reason==='string'&&reason.length>30,'Every final dependency has a reason: '+from+' -> '+target.id);
      check(reason!==byId.get(from).description&&reason!==target.description,'No description fallback: '+from+' -> '+target.id);
      check(typeof target.dependencyReview[from]==='boolean','Explicit review status: '+from+' -> '+target.id);
      if(!M.mixedControlIds.has(target.id))edges++;
    }
  }
  check(edges===489&&M.detailNodes.length===253,'Reason annotations preserve all 489 edges and 253 skills');
  const inspectRows=()=>{
    for(const el of document.querySelectorAll('#skill-content [data-connection-from]')){
      const {connectionFrom:from,connectionTo:to}=el.dataset,target=byId.get(to);
      check(target.deps.includes(from),'Rendered reason belongs to a real directed edge');
      check(el.querySelector('.connection-reason').textContent.includes(target.dependencyReasons[from]),'Correct directed reason in both lists');
      check(!!el.querySelector('.connection-review')===target.dependencyReview[from],'Review flag accompanies its reason');rendered++;
    }
  };
  try{
    for(const target of M.visibleNodes){
      app.openSkill(target.id);
      const count=target.deps.length+M.visibleNodes.filter(n=>n.deps.includes(target.id)).length;
      check(document.querySelectorAll('#skill-content [data-connection-from]').length===count,'All incoming and outgoing reasons are accessible: '+target.id);
      inspectRows();
    }
    app.openSkill('gemensam-namnare');
    const outgoing=$('[data-connection-from="gemensam-namnare"][data-connection-to="brak-add-olika"]');
    check(outgoing.textContent.includes(expectedReason),'Successor shows the same concrete reason');
    outgoing.click();check($('#skill-dialog-title').textContent===byId.get('brak-add-olika').title,'Reason row opens the intended next skill');
    app.openSkill('f-fraction-equal');inspectRows();
    check($('#skill-dialog-title').textContent===byId.get('brak-likvardiga').title,'Old alias opens canonical reasons');
    $('#skill-dialog').close();$('#reset-filters').click();$('[data-map-mode="groups"]').click();
    for(const group of M.skillGroups){
      app.openGroup(group.id);const ids=new Set(group.members);
      const expected=M.detailNodes.flatMap(n=>n.deps.map(from=>({from,to:n.id}))).filter(p=>ids.has(p.from)||ids.has(p.to));
      const rows=[...document.querySelectorAll('.group-connections [data-connection-from]')];
      check(rows.length===expected.length,'Group includes every internal and external pair: '+group.id);
      for(const pair of expected)check(rows.some(r=>r.dataset.connectionFrom===pair.from&&r.dataset.connectionTo===pair.to),'No missing group reason');
      inspectRows();groupPairs+=rows.length;
    }
    $('#skill-dialog').close();$('[data-stage="7"]').click();app.openGroup('fraction-equivalence');
    const shown=new Set(M.skillGroups.find(g=>g.id==='fraction-equivalence').members.filter(id=>M.matchesYearView(byId.get(id),'7')));
    for(const row of document.querySelectorAll('.group-connections [data-connection-from]'))check(shown.has(row.dataset.connectionFrom)||shown.has(row.dataset.connectionTo),'Filtered group reasons concern included members');
    inspectRows();$('#skill-dialog').close();$('#reset-filters').click();
    for(const details of [false,true]){
      $('[data-map-mode="'+(details?'details':'groups')+'"]').click();
      const projection=M.projectMap(M.detailNodes,{details});
      for(const edge of projection.edges){
        const path=$('.connection[data-from="'+edge.from+'"][data-to="'+edge.to+'"]');
        check(path,'Projected edge exists');
        for(const pair of edge.pairs)check(path.textContent.includes(byId.get(pair.to).dependencyReasons[pair.from]),'Arrow tooltip retains every underlying reason');
      }
    }
    check(JSON.stringify(app.profile())===profileBefore,'Browsing reasons does not change student data');
  }finally{$('#skill-dialog').close();$('#reset-filters').click();$('[data-map-mode="groups"]').click();}
  return edges+' directed map reasons; '+rendered+' rendered explanations; '+groupPairs+' group pairs; aliases, filters, review flags, arrow tooltips and student data preservation passed';
};
