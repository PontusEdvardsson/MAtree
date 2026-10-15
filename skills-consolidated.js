/* Ett gemensamt delmoment för samma kunskap. Äldre ID:n finns kvar för sparade profiler. */
(() => {
  'use strict';
  const M=window.MATREE,byId=new Map(M.nodes.map(n=>[n.id,n]));
  M.skillAliases={
    'f-place':'positionssystem','f-equality':'likhet','f-fraction-count':'brak-del-antal',
    'f-fraction-equal':'brak-likvardiga','f-fraction-add':'brak-add-lika',
    'f-decimal':'decimal-plats','f-decimal-compare':'sortera-tal','f-decimal-add':'decimal-addition',
    'f-round':'avrunda-heltal','f-order':'prioritering','f-equation':'ekvation-add',
    'f-shapes':'former','f-perimeter':'omkrets','f-readtable':'avlasa',
    'f-frequency':'frekvenstabell','tabell':'frekvenstabell','f-mean':'medel',
    'f-probability':'gynnsamma-utfall',
    'f-negative':'negativa','negativ-tallinje':'negativa','f-pattern':'monster',
    'f-inverse':'f-sharing','f-symmetry':'spegelsymmetri',
    'f-percent':'procent-huvud','f-reasonable':'overslag'
  };
  M.resolveSkillId=id=>M.skillAliases[id]||id;
  M.skillIds=id=>{const canonical=M.resolveSkillId(id);return [canonical,...Object.keys(M.skillAliases).filter(key=>M.skillAliases[key]===canonical)];};
  for(const [oldId,id]of Object.entries(M.skillAliases)){
    const old=byId.get(oldId),node=byId.get(id);old.mergedInto=id;
    node.mergedIds=[...(node.mergedIds||[]),oldId];node.mergedTitles=[...(node.mergedTitles||[]),old.title];
    node.mergedSources=[...(node.mergedSources||[]),old.source];
    node.yearViews=[...new Set([...node.yearViews,...old.yearViews])];
    // Use the earlier entry's prerequisites instead of requiring a duplicate of itself.
    if(old.depth<node.depth){node.deps=[...old.deps];node.learnedAt=old.learnedAt;node.grade=old.grade;node.foundationBand=old.foundationBand;}
  }
  M.visibleNodes=M.nodes.filter(n=>!n.mergedInto);
  for(const node of M.visibleNodes){node.deps=[...new Set(node.deps.map(M.resolveSkillId))].filter(id=>id!==node.id);delete node.depth;}
  const visiting=new Set(),depth=node=>{if(node.depth!==undefined)return node.depth;if(visiting.has(node.id))throw Error('Cirkulärt beroende efter sammanslagning.');visiting.add(node.id);node.depth=node.deps.length?1+Math.max(...node.deps.map(id=>depth(byId.get(id)))):0;visiting.delete(node.id);return node.depth;};
  M.visibleNodes.forEach(depth);
  for(const node of M.visibleNodes)node.dependencyReasons=Object.fromEntries(node.deps.map(id=>[id,byId.get(id).description]));
  byId.get('avrunda-heltal').description='Avrunda och uppskatta heltal till angivet tiotal, hundratal eller tusental. Överslagsräkning har en egen nod.';
  byId.get('f-median').title='Median och typvärde · grundkontroll';
  byId.get('uttryck').title='Beräkna värdet av uttryck';
  byId.get('uttryck').overview=false;
  byId.get('f-bodies').title='Kub och rätblock';
  byId.get('kroppar').title='Prismor och pyramider';
  byId.get('negativa').title='Negativa tal och tallinjen';
  byId.get('f-sharing').title='Division och multiplikationssamband';
  byId.get('procent-huvud').title='Vanliga procenttal med huvudräkning';
})();
