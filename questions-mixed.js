/* Blandade svarssätt i hela banken. C = klickbart flerval, O = eget svar.
   Fördelningen är fast per aspekt, så ett formatbyte inte ändrar vad som prövas. */
(() => {
  'use strict';
  const M=window.MATREE,base=M.generate,{shuffle}=M.reviewedTools;
  M.generateReviewed=base;
  M.responsePlan={
    'f-count':'CCO',
    'f-compare':'CCO',
    'f-line':'CCO',
    'f-split':'CCO',
    'f-ten':'CCO',
    'f-place':'CCO',
    'positionssystem':'CCO',
    'f-add-small':'CCO',
    'f-sub-small':'CCO',
    'f-add-place':'CCO',
    'f-sub-place':'CCO',
    'addition':'CCO',
    'f-double':'CCO',
    'f-groups':'CCO',
    'f-table':'CCO',
    'f-sharing':'CCO',
    'f-inverse':'CCO',
    'multiplikation':'CCO',
    'f-remainder':'CCO',
    'f-equality':'CCO',
    'likhet':'CCO',
    'f-pattern':'CCO',
    'monster':'CCO',
    'f-half':'CCO',
    'brak-del-hel':'CCO',
    'f-fraction-count':'CCO',
    'brak-del-antal':'CCO',
    'brak':'CCO',
    'f-fraction-line':'OCC',
    'f-fraction-equal':'OCC',
    'brak-likvardiga':'OCC',
    'brak-forlanga':'OCC',
    'brak-forkorta':'OCC',
    'brak-jamfora':'CCO',
    'gemensam-namnare':'CCO',
    'f-fraction-add':'CCO',
    'brak-add-lika':'COO',
    'brak-sub-lika':'OCO',
    'brak-add-olika':'OCO',
    'brak-sub-olika':'COO',
    'blandad-form':'OCO',
    'brak-hela':'OCO',
    'f-decimal':'CCO',
    'decimal-plats':'CCO',
    'f-decimal-compare':'OCC',
    'sortera-tal':'OCC',
    'f-decimal-add':'CCO',
    'decimal-addition':'CCO',
    'decimal-subtraktion':'CCO',
    'f-round':'CCO',
    'avrunda-heltal':'COO',
    'f-percent':'CCO',
    'procent-huvud':'CCO',
    'procent-begrepp':'CCO',
    'f-readtable':'CCO',
    'avlasa':'CCO',
    'f-frequency':'CCO',
    'tabell':'CCO',
    'frekvenstabell':'CCO',
    'f-mean':'CCO',
    'medel':'CCO',
    'f-median':'CCO',
    'median':'CCO',
    'typvarde':'OOC',
    'f-chance':'CCC',
    'f-probability':'CCO',
    'gynnsamma-utfall':'CCO',
    'sannolikhet':'CCO',
    'f-shapes':'OCC',
    'former':'OCC',
    'f-bodies':'CCO',
    'kroppar':'CCO',
    'f-length':'CCO',
    'langd':'CCO',
    'langd-enheter':'CCO',
    'f-mass':'CCO',
    'f-volume':'CCO',
    'f-clock':'CCO',
    'f-time':'CCO',
    'f-perimeter':'CCO',
    'omkrets':'CCO',
    'f-area':'CCO',
    'area-rektangel':'CCO',
    'f-angle':'CCO',
    'f-scale':'CCO',
    'f-symmetry':'OCC',
    'spegelsymmetri':'OCC',
    'f-combinations':'CCO',
    'f-coordinate':'OCC',
    'f-proportion':'CCO',
    'proportionalitet':'COC',
    'f-word-add':'CCO',
    'f-word-mult':'CCO',
    'f-reasonable':'OCC',
    'overslag':'OOC',
    'f-order':'CCO',
    'prioritering':'CCO',
    'f-equation':'CCO',
    'ekvation-add':'CCO',
    'f-negative':'COO',
    'negativ-tallinje':'COO',
    'negativa':'OCO',
    'tal-siffra':'OCO',
    'delbarhet':'OCC',
    'primtal':'COC',
    'primfaktorer':'OCO',
    'avrunda-decimal':'OCO',
    'tiomultiplikation':'COO',
    'tiodivision':'OCO',
    'brak-decimal':'COO',
    'parentes-tal':'COO',
    'forenkla-termer':'OOC',
    'distributiva':'OOC',
    'ekvation-mult':'COO',
    'ekvation-tva-steg':'OCO',
    'ekvation-text':'COO',
    'monster-regel':'OCO',
    'procent-delen':'CCO',
    'procent-andelen':'CCO',
    'procent-hela':'CCO',
    'procent-rabatt':'CCO',
    'procent-okning':'CCO',
    'stapel-stolp':'COO',
    'linjediagram':'OCO',
    'cirkeldiagram':'OCO',
    'decimal':'OCO',
    'procent':'CCO',
    'ekvation':'OCO',
    'uttryck':'COO',
    'variabel':'CCO',
    'skriva-uttryck':'CCC',
    'ekvation-provning':'CCC',
    'romerska':'COO',
    'andra-talbaser':'OCO',
    'dimensioner':'CCC',
    'vinkeltyper':'CCC',
    'triangel-typer':'CCO',
    'fyrhorningar':'CCC',
    'triangel-vinkelsumma':'CCO',
    'vinklar':'CCO',
    'area-triangel':'OCC',
    'area':'CCO',
    'area-parallellogram':'OCC',
    'area-sammansatt':'OCO',
    'volym-ratblock':'COO',
    'begransningsyta':'OCO',
    'skala-verklighet':'COO',
    'skala-bild':'COO',
    'skala':'COO',
    'manghorning-vinkel':'COO',
    'variationsbredd':'OCO',
    'diagram-vinkel':'OCO',
    'sannolikhet-skala':'CCO',
    'decimal-multiplikation':'COO',
    'decimal-division':'OCO',
    'negativ-subtraktion':'OCO',
    'negativ-multiplikation':'OCO',
    'negativ-division':'COO',
    'stora-tal':'OCO',
    'prefix-stora':'COO',
    'prefix-sma':'COO',
    'potens-begrepp':'OOC',
    'tiopotens':'OCO',
    'negativ-exponent':'COO',
    'grundpotens-stora':'OOC',
    'grundpotens-sma':'OOC',
    'potens-multiplikation':'OOC',
    'potens-division':'OOC',
    'grundpotens-rakning':'OOC',
    'kvadrattal':'OCO',
    'kvadratrot':'COO',
    'talmangder':'CCC',
    'irrationella':'CCO',
    'rot-rakning':'COO',
    'brak-heltal-mult':'OOC',
    'brak-multiplikation':'OOC',
    'brak-division':'OOC',
    'brak-korsforkorta':'OOC',
    'brak-mgn':'OCO',
    'minus-parentes':'OOC',
    'tva-parenteser':'OOC',
    'ekvation-bada':'COO',
    'ekvation-parentes':'COO',
    'ekvation-namnare':'COO',
    'kvadreringsregel':'OOC',
    'konjugatregel':'OOC',
    'faktorisera-uttryck':'OCC',
    'algebra-brak':'OOC',
    'andragrad':'CCO',
    'sidovinklar':'OOC',
    'parallella-vinklar':'COO',
    'area-enheter':'OCO',
    'hektar':'OCO',
    'volym-enheter':'OCO',
    'cirkel-begrepp':'OOC',
    'cirkel-omkrets':'COO',
    'cirkel-area':'COO',
    'cirkelbage':'OCO',
    'cirkelsektor':'COO',
    'volym-prisma':'COO',
    'volym-pyramid':'COO',
    'volym-cylinder':'COO',
    'volym-kon':'COO',
    'cylinder-yta':'OCO',
    'volym-klot':'COO',
    'klot-yta':'OCO',
    'pythagoras-hyp':'COO',
    'pythagoras-katet':'COO',
    'pythagoras-kontroll':'CCC',
    'skala-bestamma':'OCO',
    'areaskala':'OCO',
    'volymskala':'OCO',
    'likformighet':'OOC',
    'rotationssymmetri':'OCO',
    'spegla-koordinat':'OOC',
    'rymiddiagonal':'COO',
    'likformighet-avancerad':'OCO',
    'trigonometri':'OCO',
    'koordinater':'OCC',
    'samband-tabell':'CCO',
    'graf-avlasning':'COO',
    'enhetspris':'OOC',
    'forhallande':'COO',
    'recept':'OCO',
    'hastighet':'OCO',
    'tid-enheter':'OCO',
    'vag-tid':'COO',
    'funktion-begrepp':'CCC',
    'funktionsvarde':'OCO',
    'startvarde':'COO',
    'lutning':'OCO',
    'linje-ekvation':'COO',
    'rita-linje':'CCC',
    'jamfora-samband':'OOC',
    'aritmetisk':'OOC',
    'geometrisk-talfoljd':'OOC',
    'formel-omskrivning':'CCC',
    'icke-linjart':'CCO',
    'ekvationssystem':'OCO',
    'ekvationssystem-add':'OCO',
    'funktion':'COO',
    'procent-forandring':'CCO',
    'forandringsfaktor':'CCO',
    'procent-jamfora':'COO',
    'procent-over100':'OCO',
    'procent-baklanges':'COO',
    'upprepad-forandring':'COO',
    'upprepad-samma':'OCO',
    'ranta':'COO',
    'ranta-tid':'COO',
    'procentenheter':'COO',
    'promille':'COO',
    'index':'COO',
    'forandring':'COO',
    'relativ-frekvens':'COO',
    'viktat-medel':'OCO',
    'histogram':'COO',
    'kvartiler':'COO',
    'ladagram':'OCO',
    'val-lagesmatt':'CCC',
    'vilseledande':'OOC',
    'venndiagram':'COO',
    'komplement':'CCO',
    'forvantat-antal':'OCC',
    'trad-oberoende':'OCO',
    'trad-beroende':'COO',
    'flera-vagar':'COO',
    'minst-en':'OCO',
    'experiment-sannolikhet':'OOC',
    'kombinationer':'COO',
    'ordna-objekt':'COO',
    'tva-tarningar':'COO',
    'oordnade-val':'COO',
    'tre-drag':'COO',
    'problem-bild':'CCO',
    'problem-baklanges':'COO',
    'problem-tabell':'COO',
    'problem-graf':'COO',
    'problem-ekvation':'OCO',
    'problem-rimlighet':'CCC',
    'problem-flersteg':'COO',
    'kod-variabel':'OCO',
    'kod-loop':'OCO',
    'kalkylblad':'CCC',
    'simulering':'OCC',
    'densitet':'COO',
    'material':'OCO',
    'moms':'COO',
    'amortering':'COO'
  };
  // Rebalance the visible skills after consolidation; archived IDs keep their original plan.
  M.responseCounts={};
  for(const category of M.categories){
    const ids=M.detailNodes.filter(n=>n.category===category.id).map(n=>n.id),total=ids.length*3,target=Math.round(total/2);
    let count=ids.reduce((sum,id)=>sum+[...M.responsePlan[id]].filter(c=>c==='C').length,0);
    for(const id of ids){if(count>=target)break;const plan=[...M.responsePlan[id]];if(plan.filter(c=>c==='C').length>=2)continue;const slot=[1,0,2].find(v=>plan[v]==='O');if(slot!==undefined){plan[slot]='C';M.responsePlan[id]=plan.join('');count++;}}
    M.responseCounts[category.id]={choice:count,total};
  }
  const nodes=new Map(M.nodes.map(n=>[n.id,n]));
  const clean=s=>s.replace(/[\u00a0\u202f]/g,'').replace(/−/g,'-');
  const nums=s=>(clean(s).match(/-?\d+(?:[.,]\d+)?/g)||[]).map(x=>Number(x.replace(',','.')));
  const near=(a,b)=>Math.abs(a-b)<=1e-10*Math.max(1e-9,Math.abs(a),Math.abs(b));
  const stem=q=>q.prompt.split('\n\n')[0];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const median=a=>{a=[...a].sort((a,b)=>a-b);return a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2;};
  function fraction(value){
    // Continued fractions keep the alternatives readable while preserving their value.
    const sign=value<0?-1:1;let x=Math.abs(value),h0=0,h1=1,k0=1,k1=0;
    for(let i=0;i<24;i++){const a=Math.floor(x),h=a*h1+h0,k=a*k1+k0;if(k>1000000)break;
      if(near(h/k,Math.abs(value)))return k===1?String(sign*h):`${sign*h}/${k}`;
      [h0,h1,k0,k1]=[h1,h,k1,k];if(x===a)break;x=1/(x-a);
    }
    return null;
  }
  function label(value,asFraction,exactDecimal=false,roundPlaces=null){
    if(asFraction){const f=fraction(value);if(f)return f;}
    const rounded=roundPlaces!==null?Number(value.toFixed(roundPlaces)):!exactDecimal&&Math.abs(value)>=.01?Math.round(value*1000)/1000:value;
    return (Object.is(rounded,-0)?0:rounded).toLocaleString('sv-SE',{maximumFractionDigits:12,useGrouping:false});
  }
  function candidates(id,v,q){
    const p=stem(q),n=nums(p),[a,b,c,d]=n,result=q.answer,cat=nodes.get(id).category,out=[];
    const push=(...xs)=>out.push(...xs);
    if(id==='f-double')push(...(v===1?[a*2,a-2,a,a+2]:[a/2,a+2,a,a*3]));
    if(id==='f-proportion')push(a,b,a+b,a*b,a-b,result*2,result/2);
    if(id==='negativ-exponent')push(...(v===1?[-result,result-1,result+1]:[result*10,result/10,1/result]));
    if(['koordinater','f-coordinate'].includes(id)){
      const point=q.visual?.type==='coordinate'?q.visual:q.visual?.points?.[0];
      if(point)push(point.x,point.y,-point.x,-point.y,point.x+1,point.y+1);
    }
    if(q.visual?.type==='grid'){const {rows,cols}=q.visual;push(rows,cols,rows+cols,2*(rows+cols),result-1,result+1);}
    if(['tiomultiplikation','tiodivision'].includes(id))push(result*10,result/10,result*100,result/100);
    if(['f-round','avrunda-heltal','avrunda-decimal'].includes(id)){
      const step=id==='avrunda-decimal'?10**(-v):/tusental/.test(p)?1000:/hundratal/.test(p)?100:10;
      push(Math.floor(a/step)*step,Math.ceil(a/step)*step,result-step,result+step,result+2*step,result+3*step);
    }
    const pairs=[...clean(p).matchAll(/(-?\d+)\/(\d+)/g)].map(m=>[Number(m[1]),Number(m[2])]);
    if(cat==='brak'||cat==='sannolikhet'){
      if(pairs.length>=2){const [[A,B],[C,D]]=pairs;push((A+C)/(B+D),A*C/(B*D),(A+C)/(B*D),(A-C)/(B-D),A*D/(B*C),A/B+C/D);}
      else if(pairs.length){const [A,B]=pairs[0];push(B/A,(A+1)/B,A/(B+1),A/(A+B));}
      push(1-result,result/2,result*2,0,1);
      if(id.includes('komplement'))push(a/b,a/100,b/a);
      if(['trad-oberoende','trad-beroende','flera-vagar','tre-drag'].includes(id))push(a/(a+b),b/(a+b),(a/(a+b))**2,(b/(a+b))**2,2*result);
    }
    if(cat==='procent'){
      if(/procentenheter/.test(id))push(b-a,(b-a)/a*100,a+b,b);
      else if(/forandring|jamfora|baklanges|index/.test(id))push((b-a)/b*100,(b-a)/a*100,b/a,(b/a-1)*100,a*(1-b/100),a*(1+b/100),a+b,a-b);
      else push(a*b/100,a*b,a+b,a-b,a/b*100,b/a*100,a*(1-b/100),a*(1+b/100));
      push(result/100,result*100,100-result,result/2,result*2);
    }
    if(cat==='geometri'){
      if(/area|hektar/.test(id))push(a*b,2*(a+b),a+b,a*b/2,result*2,result/2,result*100,result/100);
      if(/volym|yta/.test(id))push(a*b*c,a*b*c/3,a*b,2*a*b,result*3,result/3,result*2,result/2);
      if(/cirkel|klot|cylinder|kon$/.test(id))push(2*3.14*a,3.14*a*a,3.14*(a/2)**2,2*3.14*a*a,result*2,result*4,result/2,result/4);
      if(/vinkel/.test(id))push(a,90-a,180-a,180-a-b,360-a,90,180);
      if(/pythagoras/.test(id)&&q.visual?.type==='triangle'){const x=q.visual.labels.map(Number).filter(Number.isFinite);push(x[0]+x[1],Math.abs(x[0]-x[1]),x[0]**2+x[1]**2,Math.sqrt(Math.abs(x[0]**2-x[1]**2)));}
      if(/skala|likform/.test(id))push(a*b,b/a,a/b,result**2,Math.sqrt(Math.abs(result)),result*10,result/10);
      if(/enheter|langd|mass|volume/.test(id))push(result*10,result/10,result*100,result/100);
    }
    if(cat==='statistik'){
      const visual=q.visual;
      if(visual?.values){const values=visual.values,total=values.reduce((a,b)=>a+b,0);push(total,total/values.length,median(values),Math.max(...values),Math.min(...values));if(visual.type==='table'){const weighted=values.reduce((sum,x,i)=>sum+x*Number(visual.labels[i]),0);push(weighted,weighted/values.length,Number(visual.labels[0]));}}
      if(visual?.type==='boxplot')push(...visual.stats,visual.stats[4]-visual.stats[0],visual.stats[3]-visual.stats[1]);
      if(visual?.type==='venn')push(visual.left+visual.both+visual.right+2*visual.both,visual.left+visual.right,visual.both,visual.left+visual.both,visual.right+visual.both);
      if(n.length>=3){const data=/Data: (.+?)\./.exec(p);const values=data?nums(data[1]):n;push(values.reduce((a,b)=>a+b,0),median(values),Math.max(...values)-Math.min(...values),values.reduce((a,b)=>a+b,0)/values.length);}
      push(a/b,b/a,a+b,result*100,result/100);
    }
    if(cat==='samband'){
      if(q.visual?.type==='cartesian'&&q.visual.series.length){const points=q.visual.series[0].points,[x,y]=points[0],[X,Y]=points.at(-1),k=(Y-y)/(X-x);push(k,y-k*x,-k,(Y-y),1/k);}
      push(a*b,a/b,b/a,a+b,a-b);
      if(['hastighet','tid-enheter','vag-tid','f-clock','f-time'].includes(id))push(result*60,result/60);
    }
    if(cat==='tal'||cat==='algebra'||cat==='problem'){
      if(/×|\*/.test(p))push(a+b,a-b,a/b);
      if(/÷/.test(p))push(a*b,a-b,b/a);
      if(/−| - /.test(p))push(a+b,b-a,-result);
      if(/\+/.test(p))push(a-b,a*b);
      if(/potens|prefix/.test(id))push(result*10,result/10,result*100,result/100,1/result);
      if(/rest/.test(id))push(Math.floor(a/b),b,a%b);
      if(/forlanga|forkorta/.test(id))push(a,b,c,a*c,b*c);
      if(/place|plats|positions|decimal/.test(id))push(result*10,result/10,result*100,result/100);
      if(/ekvation|equation/.test(id))push(-result,a+b,a-b,b/a,a/b);
    }
    // Counting mistakes and common scale errors supply alternatives for short direct questions.
    push(result+1,result-1,result+2,result*2,result/2,-result,result*10,result/10,0);
    return out.filter(Number.isFinite);
  }
  function numericChoice(id,v,q){
    if(id==='brak-jamfora'){
      const options=shuffle([...q.prompt.matchAll(/\d+\/\d+/g)].map(m=>m[0])),optionValues=options.map(M.parseAnswer),answer=optionValues.findIndex(x=>near(x,q.answer))+1;
      return {...q,prompt:q.prompt+'\n\n'+options.map((s,i)=>`${i+1}. ${s}`).join('\n')+'\n\nVälj ett svar.',answer,answerKind:'choice',options,optionValues};
    }
    const decimalNotation=q.answerKind==='decimal'||/decimalform/.test(q.prompt)||['tiomultiplikation','tiodivision','decimal-multiplikation','decimal-division'].includes(id);
    const exactDecimal=decimalNotation&&Math.abs(q.answer-Number(q.answer.toFixed(9)))<=1e-12*Math.max(1e-9,Math.abs(q.answer));
    const roundPlaces=decimalNotation&&!exactDecimal?(Math.abs(q.answer)<.01?9:3):null;
    const asFraction=!decimalNotation&&(q.answerKind==='fraction'||['brak','sannolikhet'].includes(nodes.get(id).category)&&!Number.isInteger(q.answer)),format=value=>label(value,asFraction,exactDecimal,roundPlaces),correct=format(q.answer);
    const selected=[{text:correct,value:q.answer}],seen=new Set([correct]);
    const probability=nodes.get(id).category==='sannolikhet'&&!Number.isInteger(q.answer);
    const physicalUnits=new Set(['cm','m','mm','dm','km','cm²','m²','cm³','m³','g','kg','liter','l','dl','h','min','sekunder','kr','kr/kg','paket','personer']);
    const integerOnly=q.answerKind==='integer'&&nodes.get(id).category!=='sannolikhet',nonnegative=q.answer>=0&&(/Hur många|Avrunda|Vilken rest|täljare|nämnare/i.test(q.prompt)||physicalUnits.has(q.unit)),positiveDenominator=/nämnare/.test(q.prompt);
    const decimalPlaces=Math.max(3,(correct.split(',')[1]||'').length);
    for(const value of candidates(id,v,q)){
      if(integerOnly&&!Number.isInteger(value)||nonnegative&&value<0)continue;
      if(positiveDenominator&&value===0)continue;
      if(exactDecimal&&Math.abs(value-Number(value.toFixed(decimalPlaces)))>1e-12*Math.max(1e-9,Math.abs(value)))continue;
      if(near(value,q.answer)||probability&&(value<0||value>1))continue;
      const text=format(value);if(seen.has(text))continue;
      selected.push({text,value});seen.add(text);if(selected.length===4)break;
    }
    for(let delta=3;selected.length<4;delta++){
      const value=probability?(delta%9+1)/10:q.answer+delta,text=format(value);
      if(!seen.has(text)&&!near(value,q.answer)){selected.push({text,value});seen.add(text);}
    }
    const options=shuffle(selected),answer=options.findIndex(o=>near(o.value,q.answer))+1;
    let prompt=q.prompt.replace(/Svara med ett bråk\.?/g,'').replace(/Ange bara talet framför %\.?/g,'').trim();
    if(roundPlaces!==null)prompt+=` Alternativen är avrundade till ${roundPlaces===9?'nio':'tre'} decimaler.`;
    else if(!exactDecimal&&!asFraction&&Math.abs(q.answer)>=.01&&!near(Math.round(q.answer*1000)/1000,q.answer))prompt+=' Alternativen är avrundade till tre decimaler.';
    prompt+='\n\n'+options.map((o,i)=>`${i+1}. ${o.text}`).join('\n')+'\n\nVälj ett svar.';
    return {...q,prompt,answer,answerKind:'choice',options:options.map(o=>o.text),optionValues:options.map(o=>o.value)};
  }
  // Extra alternatives are specific misconceptions, never generic "all/none of the above".
  const extra={
    'f-equality':['Likhetstecknet betyder att man ska skriva nästa tal.'],
    'likhet':['Likhetstecknet betyder att man ska skriva nästa tal.'],
    'f-symmetry':['Det räcker att båda delarna har samma area.'],
    'spegelsymmetri':['Det räcker att båda delarna har samma area.'],
    'proportionalitet':['Kostnaden minskar alltid när antalet ökar.','Ja, alla linjära samband är proportionella.'],
    'primtal':['Det har ingen positiv delare.'],
    'variabel':['Den representerar alltid samma bestämda tal i alla uppgifter.'],
    'dimensioner':['kg'],
    'vinkeltyper':['rak'],
    'fyrhorningar':['Vinkelsumman är alltid 180°.'],
    'area-parallellogram':['Summan av två intilliggande sidor'],
    'talmangder':['Alla negativa tal är irrationella tal.'],
    'irrationella':['Decimalutvecklingen är alltid oändlig och periodisk.'],
    'sidovinklar':['De har två olika hörn och lika långa vinkelben.'],
    'cirkel-begrepp':['En del av cirkelns rand mellan två punkter.'],
    'likformighet':['De har samma omkrets men behöver inte ha samma vinklar.'],
    'funktion-begrepp':['Ett tillåtet x måste ha minst två olika y.','(1, 4), (2, 5), (1, 6)'],
    'formel-omskrivning':['h = A/b','x = (y + m)/k','t = v − s'],
    'val-lagesmatt':['Variationsbredden'],
    'vilseledande':['Att y-axeln börjar vid noll.'],
    'simulering':['Slumpa heltal 1–5 med lika sannolikhet.','För att varje försök ska få samma resultat.']
  };
  const natural=new Set(['f-chance','f-decimal-compare','sortera-tal','andragrad','rita-linje','jamfora-samband']);
  function expandedChoice(id,v,q){
    const parsed=q.prompt.split('\n').filter(s=>/^\d+\. /.test(s)).map(s=>s.replace(/^\d+\. /,''));
    const correct=parsed[q.answer-1],wrong=parsed.filter((_,i)=>i!==q.answer-1);
    if(parsed.length>=4||natural.has(id)||parsed.length===2&&parsed.every(x=>['Ja','Nej','A','B','Medianen','Medelvärdet'].includes(x)))return {...q,options:parsed};
    const p=stem(q),n=nums(p),[a,b,c]=n,more=[];
    if(extra[id]&&(id!=='primtal'||v===2))more.push(...(id==='formel-omskrivning'?[extra[id][v]]:id==='funktion-begrepp'?[extra[id][v===2?1:0]]:id==='simulering'?[extra[id][v===2?1:0]]:extra[id]));
    if(id==='f-shapes'||id==='former')more.push(...['cirkel','triangel','kvadrat','femhörning','sexhörning'].filter(x=>x!==q.visual?.name&&!(q.visual?.name==='kvadrat'&&x==='rektangel')));
    if(['f-coordinate','koordinater','spegla-koordinat'].includes(id)){const xy=nums(correct);more.push(`(${-xy[0]}, ${-xy[1]})`,`(${xy[1]+1}, ${xy[0]+1})`);}
    if(id==='typvarde')more.push('Inget tal är ett typvärde.');
    if(id==='delbarhet')for(let x=2;x<25;x++)if(a%x!==0)more.push(String(x));
    if(id==='primtal'&&v===0)more.push('1','9','15');
    if(id==='gemensam-namnare')for(let x=2;x<30;x++)if(x%b!==0||x%n[3]!==0)more.push(String(x));
    if(id==='potens-begrepp')more.push(`${a} + ${b}`,Array(b+1).fill(a).join(' × '),Array(b+2).fill(a).join(' × '));
    if(id==='primfaktorer'){more.push(`1 × ${a}`,String(a));}
    if(id==='area-triangel')more.push(`(${a} + ${b}) ÷ 2`);
    if(id==='sannolikhet-skala')more.push('2','−1');
    if(id==='potens-multiplikation'||id==='potens-division')more.push('x^(0)','x^(-10)');
    if(id==='grundpotens-rakning'){const parts=nums(correct);more.push(`${M.fmt(parts[0])} × 10^(${parts.at(-1)-1})`,`${M.fmt(parts[0])} × 10^(${parts.at(-1)+2})`);}
    if(id==='kvadrattal'){const number=M.parseAnswer(correct);more.push(String(number+2),String(number+3));}
    if(id==='ekvation-provning')more.push(String(Number(correct)+2));
    if(['brak-heltal-mult','brak-multiplikation','brak-division','brak-korsforkorta'].includes(id))more.push(`(${correct}) × 2`,`(${correct}) ÷ 2`);
    else if(id.startsWith('brak-')||id==='f-fraction-equal'||id==='f-fraction-line'){
      const fractions=[...p.matchAll(/(\d+)\/(\d+)/g)].map(m=>[Number(m[1]),Number(m[2])]),[A,B]=fractions[0]||[1,2];
      more.push(`${A+B}/${B}`,`${A+2*B}/${B}`,'0');
    }
    if(['forenkla-termer','distributiva','minus-parentes','tva-parenteser','kvadreringsregel','konjugatregel','faktorisera-uttryck','algebra-brak','skriva-uttryck','monster-regel','aritmetisk','geometrisk-talfoljd'].includes(id))more.push(correct.replace(/-?\d+(?:[.,]\d+)?/,s=>M.fmt(Number(s.replace(',','.'))+1)),correct.replace(/-?\d+(?:[.,]\d+)?/,s=>M.fmt(Number(s.replace(',','.'))+2)));
    if(id==='ekvation-text')more.push(`x − (x + ${a}) = ${b}`);
    if(id==='variabel'&&v===0)more.unshift(`${a} plus ${b} gånger x`);
    if(id==='linje-ekvation')more.push(`y = 0x + ${correct.includes('−')?'99':'−99'}`);
    if(id==='icke-linjart'&&v===0)more.push('y = 4x + 2');
    if(id==='kalkylblad')more.push(v===2?`=A${a}*B${a+1}`:`=A${a}-B${a}`);
    if(['f-reasonable','overslag','problem-rimlighet'].includes(id)){const text=correct.match(/^(\d+(?:,\d+)?) (.+)$/);if(text)more.push(`${Number(text[1].replace(',','.'))*10+1} ${text[2]}`);}
    const correctNumber=M.parseAnswer(correct);
    for(const text of more){
      if(wrong.length>=3)break;
      if(/NaN|undefined|Infinity/.test(text))continue;
      if(text===correct||wrong.includes(text))continue;
      const value=M.parseAnswer(text);if(Number.isFinite(correctNumber)&&Number.isFinite(value)&&near(value,correctNumber))continue;
      wrong.push(text);
    }
    if(wrong.length<3)throw Error(`Saknar meningsfullt alternativ: ${id}:${v}`);
    const options=shuffle([correct,...wrong.slice(0,3)]),answer=options.indexOf(correct)+1;
    return {...q,prompt:p+'\n\n'+options.map((s,i)=>`${i+1}. ${s}`).join('\n')+'\n\nVälj ett svar.',answer,options};
  }
  M.toChoice=numericChoice;
  M.expandChoice=expandedChoice;
  M.generate=(id,v)=>{const q=base(id,v);if(q.answerKind==='choice')return expandedChoice(id,v,q);return M.responsePlan[id]?.[((v%3)+3)%3]==='C'?numericChoice(id,v,q):q;};
  M.questionStem=q=>q.options?stem(q):q.prompt;
  M.answerText=(q,response=q.answer)=>{const index=M.parseAnswer(String(response));return q.options&&Number.isInteger(index)&&index>=1&&index<=q.options.length?q.options[index-1]:String(response===q.answer?(q.answerKind==='fraction'?fraction(q.answer)||M.fmt(q.answer):M.fmt(q.answer)):response);};
  M.responseAllowed=(q,response)=>{const value=M.parseAnswer(response);return Number.isFinite(value)&&(!q.options||Number.isInteger(value)&&value>=1&&value<=q.options.length)&&(!q.options&&q.responseFormat==='decimal'?!String(response).includes('/'):true);};
  M.questionFingerprint=item=>{const text=`${stem(item)}|${JSON.stringify(item.visual||null)}`;let hash=2166136261;for(const char of text){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');};
})();
