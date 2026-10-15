/* Grupper organiserar kartan. Underlag och förkunskaper hör fortfarande till delmomenten. */
(() => {
  'use strict';
  const M=window.MATREE,byId=new Map(M.visibleNodes.map(n=>[n.id,n]));
  const definitions=[
  [
    "numbers",
    "Taluppfattning",
    "tal",
    "f-count f-compare f-line f-split f-ten positionssystem tal-siffra",
    ""
  ],
  [
    "add-sub",
    "Addition och subtraktion",
    "tal",
    "f-add-small f-sub-small f-add-place f-sub-place addition",
    ""
  ],
  [
    "multiply-divide",
    "Multiplikation och division",
    "tal",
    "f-groups f-table f-sharing f-remainder multiplikation",
    ""
  ],
  [
    "decimals",
    "Decimaltal",
    "tal",
    "decimal-plats sortera-tal decimal-addition decimal-subtraktion tiomultiplikation tiodivision decimal-multiplikation decimal-division",
    "decimal"
  ],
  [
    "rounding",
    "Avrundning och överslag",
    "tal",
    "avrunda-heltal avrunda-decimal overslag",
    ""
  ],
  [
    "negative",
    "Negativa tal",
    "tal",
    "negativa negativ-subtraktion negativ-multiplikation negativ-division",
    ""
  ],
  [
    "prefixes",
    "Stora tal och prefix",
    "tal",
    "stora-tal prefix-stora prefix-sma",
    ""
  ],
  [
    "powers",
    "Potenser",
    "tal",
    "potens-begrepp tiopotens negativ-exponent potens-multiplikation potens-division",
    ""
  ],
  [
    "scientific",
    "Grundpotensform",
    "tal",
    "grundpotens-stora grundpotens-sma grundpotens-rakning",
    ""
  ],
  [
    "roots",
    "Kvadrater och kvadratrötter",
    "tal",
    "kvadrattal kvadratrot rot-rakning",
    ""
  ],
  [
    "primes",
    "Delbarhet och primtal",
    "tal",
    "delbarhet primtal primfaktorer",
    ""
  ],
  [
    "number-sets",
    "Talmängder",
    "tal",
    "talmangder irrationella",
    ""
  ],
  [
    "other-notation",
    "Andra sätt att skriva tal",
    "tal",
    "romerska andra-talbaser",
    ""
  ],
  [
    "fraction-meaning",
    "Bråk som delar och antal",
    "brak",
    "f-half brak-del-hel f-fraction-line brak-del-antal brak-hela blandad-form",
    "brak"
  ],
  [
    "fraction-equivalence",
    "Likvärdiga bråk och nämnare",
    "brak",
    "brak-likvardiga brak-forlanga brak-forkorta brak-jamfora gemensam-namnare brak-mgn",
    ""
  ],
  [
    "fraction-add-sub",
    "Addition och subtraktion av bråk",
    "brak",
    "brak-add-lika brak-sub-lika brak-add-olika brak-sub-olika",
    ""
  ],
  [
    "fraction-multiply-divide",
    "Multiplikation och division av bråk",
    "brak",
    "brak-heltal-mult brak-multiplikation brak-division brak-korsforkorta",
    ""
  ],
  [
    "arithmetic-rules",
    "Likhet och räkneordning",
    "algebra",
    "likhet prioritering parentes-tal",
    ""
  ],
  [
    "expressions",
    "Variabler och algebraiska uttryck",
    "algebra",
    "variabel uttryck skriva-uttryck forenkla-termer distributiva minus-parentes tva-parenteser kvadreringsregel konjugatregel faktorisera-uttryck algebra-brak",
    ""
  ],
  [
    "equations",
    "Ekvationer",
    "algebra",
    "ekvation-add ekvation-mult ekvation-tva-steg ekvation-bada ekvation-parentes ekvation-namnare ekvation-provning ekvation-text andragrad",
    "ekvation"
  ],
  [
    "patterns",
    "Talmönster och regler",
    "algebra",
    "monster monster-regel",
    ""
  ],
  [
    "shapes",
    "Former och deras egenskaper",
    "geometri",
    "former vinkeltyper triangel-typer fyrhorningar f-angle",
    ""
  ],
  [
    "basic-units",
    "Längd, massa och volymenheter",
    "geometri",
    "f-length langd langd-enheter f-mass f-volume dimensioner",
    ""
  ],
  [
    "areas",
    "Omkrets och area",
    "geometri",
    "omkrets f-area area-rektangel area-triangel area-parallellogram area-sammansatt",
    "area"
  ],
  [
    "square-cubic-units",
    "Kvadrat- och kubikenheter",
    "geometri",
    "area-enheter hektar volym-enheter",
    ""
  ],
  [
    "circles",
    "Cirklar, bågar och sektorer",
    "geometri",
    "cirkel-begrepp cirkel-omkrets cirkel-area cirkelbage cirkelsektor",
    ""
  ],
  [
    "bodies",
    "Geometriska kroppar",
    "geometri",
    "f-bodies kroppar",
    ""
  ],
  [
    "cuboids",
    "Rätblock: volym och yta",
    "geometri",
    "volym-ratblock begransningsyta",
    ""
  ],
  [
    "solid-measures",
    "Volym och yta hos andra kroppar",
    "geometri",
    "volym-prisma volym-cylinder cylinder-yta volym-pyramid volym-kon volym-klot klot-yta",
    ""
  ],
  [
    "right-triangles",
    "Rätvinkliga trianglar",
    "geometri",
    "pythagoras-hyp pythagoras-katet pythagoras-kontroll rymiddiagonal trigonometri",
    ""
  ],
  [
    "length-scale",
    "Längdskala",
    "geometri",
    "f-scale skala-verklighet skala-bild skala-bestamma",
    "skala"
  ],
  [
    "similarity",
    "Likformighet, area- och volymskala",
    "geometri",
    "likformighet areaskala volymskala likformighet-avancerad",
    ""
  ],
  [
    "symmetry",
    "Symmetri och spegling",
    "geometri",
    "spegelsymmetri rotationssymmetri spegla-koordinat",
    ""
  ],
  [
    "angles",
    "Vinklar och vinkelsummor",
    "geometri",
    "triangel-vinkelsumma sidovinklar parallella-vinklar manghorning-vinkel",
    "vinklar"
  ],
  [
    "proportions",
    "Proportionella samband",
    "samband",
    "f-double f-proportion proportionalitet enhetspris forhallande recept",
    ""
  ],
  [
    "time",
    "Tid och tidsenheter",
    "samband",
    "f-clock f-time tid-enheter",
    ""
  ],
  [
    "speed",
    "Hastighet, sträcka och tid",
    "samband",
    "hastighet vag-tid",
    ""
  ],
  [
    "coordinates",
    "Koordinatsystem",
    "samband",
    "f-coordinate koordinater",
    ""
  ],
  [
    "reading-relations",
    "Tabeller och grafer för samband",
    "samband",
    "samband-tabell graf-avlasning",
    ""
  ],
  [
    "functions",
    "Funktioner och linjära samband",
    "samband",
    "funktion-begrepp funktionsvarde startvarde lutning linje-ekvation rita-linje jamfora-samband icke-linjart",
    "funktion"
  ],
  [
    "sequences",
    "Aritmetiska och geometriska talföljder",
    "samband",
    "aritmetisk geometrisk-talfoljd",
    ""
  ],
  [
    "systems",
    "Ekvationssystem",
    "samband",
    "ekvationssystem ekvationssystem-add",
    ""
  ],
  [
    "percent-basics",
    "Procent: begrepp, del och helhet",
    "procent",
    "procent-begrepp procent-huvud procent-delen procent-andelen procent-hela",
    "procent"
  ],
  [
    "percent-change",
    "Procentuell förändring",
    "procent",
    "procent-rabatt procent-okning procent-forandring forandringsfaktor procent-jamfora procent-over100 procent-baklanges",
    "forandring"
  ],
  [
    "repeated-change",
    "Upprepade procentförändringar",
    "procent",
    "upprepad-forandring upprepad-samma",
    ""
  ],
  [
    "interest",
    "Ränta",
    "procent",
    "ranta ranta-tid",
    ""
  ],
  [
    "data-frequency",
    "Data och frekvens",
    "statistik",
    "avlasa frekvenstabell relativ-frekvens",
    ""
  ],
  [
    "central-tendency",
    "Lägesmått och spridning",
    "statistik",
    "medel median typvarde variationsbredd viktat-medel val-lagesmatt",
    "f-median"
  ],
  [
    "diagrams",
    "Statistiska diagram",
    "statistik",
    "stapel-stolp linjediagram cirkeldiagram diagram-vinkel histogram vilseledande",
    ""
  ],
  [
    "quartiles",
    "Kvartiler och lådagram",
    "statistik",
    "kvartiler ladagram",
    ""
  ],
  [
    "probability-basics",
    "Grundläggande sannolikhet",
    "sannolikhet",
    "f-chance sannolikhet-skala gynnsamma-utfall experiment-sannolikhet forvantat-antal",
    "sannolikhet"
  ],
  [
    "multi-probability",
    "Sannolikhet i flera steg",
    "sannolikhet",
    "komplement trad-oberoende trad-beroende flera-vagar minst-en tre-drag tva-tarningar",
    ""
  ],
  [
    "combinations",
    "Utfall och kombinationer",
    "sannolikhet",
    "f-combinations kombinationer ordna-objekt oordnade-val",
    ""
  ],
  [
    "word-problems",
    "Textproblem med grundläggande räknesätt",
    "problem",
    "f-word-add f-word-mult",
    ""
  ],
  [
    "problem-strategies",
    "Problemlösning och representationer",
    "problem",
    "problem-bild problem-baklanges problem-tabell problem-graf problem-ekvation problem-rimlighet problem-flersteg",
    ""
  ],
  [
    "digital-tools",
    "Programmering och digitala verktyg",
    "problem",
    "kod-variabel kod-loop kalkylblad simulering",
    ""
  ],
  [
    "applications",
    "Tillämpningar: mått, material och ekonomi",
    "problem",
    "densitet material moms amortering",
    ""
  ]
];
  M.skillGroups=definitions.map(([id,title,category,members,controls])=>({id,title,category,members:members.split(' '),controls:controls?controls.split(' '):[]}));
  M.groupForSkill=new Map();
  for(const group of M.skillGroups)for(const id of [...group.members,...group.controls]){
    if(!byId.has(id)||M.groupForSkill.has(id))throw Error('Ogiltig eller dubblerad gruppmedlem: '+id);
    M.groupForSkill.set(id,group);
  }
  M.mixedControlIds=new Set(M.skillGroups.flatMap(g=>g.controls));
  M.detailNodes=M.visibleNodes.filter(n=>!M.mixedControlIds.has(n.id));
  M.legacyAdaptiveIds=new Set(['f-median']);
  M.projectMap=(visible,{details=false,expanded=new Set()}={})=>{
    const visibleIds=new Set(visible.map(n=>n.id)),rawEdges=visible.flatMap(n=>n.deps.filter(id=>visibleIds.has(id)).map(id=>({from:id,to:n.id})));
    const unfolded=new Set(expanded);
    let entries,edges,internalCount,cycle;
    // A folded group can otherwise turn an acyclic skill graph into a cycle.
    // Unfold such a group rather than discard a prerequisite arrow.
    for(let attempt=0;attempt<=M.skillGroups.length;attempt++){
      const map=new Map(),owner=new Map();
      for(const n of visible){const g=M.groupForSkill.get(n.id),fold=g&&!details&&!unfolded.has(g.id),id=fold?'group:'+g.id:n.id;
        if(!map.has(id))map.set(id,{id,title:fold?g.title:n.title,category:n.category,groupId:fold?g.id:null,members:[],deps:[]});
        map.get(id).members.push(n);owner.set(n.id,id);
      }
      const paths=new Map();internalCount=0;
      for(const pair of rawEdges){const from=owner.get(pair.from),to=owner.get(pair.to);if(from===to){internalCount++;continue;}const key=from+'|'+to;
        if(!paths.has(key))paths.set(key,{from,to,pairs:[]});paths.get(key).pairs.push(pair);
      }
      entries=[...map.values()];edges=[...paths.values()];for(const edge of edges)map.get(edge.to).deps.push(edge.from);
      const done=new Set(),active=[],visit=id=>{const index=active.indexOf(id);if(index>=0)return active.slice(index);if(done.has(id))return null;active.push(id);for(const dep of map.get(id).deps){const found=visit(dep);if(found)return found;}active.pop();done.add(id);return null;};
      cycle=null;for(const entry of entries){cycle=visit(entry.id);if(cycle)break;}
      if(!cycle)break;
      const candidates=cycle.map(id=>map.get(id)).filter(e=>e.groupId).sort((a,b)=>b.members.length-a.members.length);
      if(!candidates.length)throw Error('Cirkulära delmoment i kartan.');unfolded.add(candidates[0].groupId);
    }
    if(cycle)throw Error('Grupperna kunde inte ordnas efter förkunskaper.');
    return {entries,edges,internalCount,rawEdgeCount:rawEdges.length,unfolded};
  };
})();
