window.verifyReviewedQuestions=()=>{
  const M=window.MATREE,assert=(c,m)=>{if(!c)throw Error(m);};
  const nums=s=>(s.match(/[-−]?\d+(?:[.,]\d+)?/g)||[]).map(x=>Number(x.replace('−','-').replace(',','.')));
  const gcd=(a,b)=>{while(b){const t=b;b=a%b;a=t;}return Math.abs(a);};
  const options=q=>q.prompt.split('\n').filter(x=>/^\d+\. /.test(x)).map(x=>x.replace(/^\d+\. /,''));
  const answerChoice=(q,predicate)=>{const matches=options(q).map((o,i)=>predicate(o)?i+1:0).filter(Boolean);assert(matches.length===1,`Ambiguous choices: ${q.prompt}`);return matches[0];};
  const head=q=>q.prompt.split('\n\n')[0];
  const fractions=s=>[...s.matchAll(/(\d+)\/(\d+)/g)].map(m=>[Number(m[1]),Number(m[2])]);
  function solve(id,v,q){
    const p=head(q),n=nums(p),a=n[0],b=n[1],c=n[2],visual=q.visual;
    const aliases={decimal:[['decimal-plats',0],['decimal-addition',0],['tiomultiplikation',0]],procent:[['procent-begrepp',0],['procent-delen',0],['procent-andelen',0]],ekvation:[['ekvation-add',0],['ekvation-mult',0],['ekvation-tva-steg',0]],area:[['area-rektangel',0],['area-triangel',0],['area-rektangel',1]]};
    if(aliases[id])return solve(...aliases[id][v],q);
    if(id==='f-count')return v===0?a+1:v===1?a-1:visual.count;
    if(id==='f-compare')return v===0?Math.max(...n):v===1?Math.min(...n):b-a;
    if(id==='f-line')return v===0?n[1]+(n[1]-n[0]):v===1?(n[0]+n[1])/2:a+b;
    if(['f-split','f-ten'].includes(id))return v===0?b-a:a-b;
    if(['f-place','positionssystem'].includes(id)){if(v===0)return Math.floor(a/(/hundratals/.test(p)?100:/tiotals/.test(p)?10:1))%10*(/hundratals/.test(p)?100:/tiotals/.test(p)?10:1);return v===1?a*100+b*10+c:Math.floor(a/10);}
    if(['f-add-small','f-add-place'].includes(id))return v===1?b-a:a+b;
    if(id==='f-word-add')return v===1?a-b:a+b;
    if(['f-sub-small','f-sub-place'].includes(id))return v===1?a-b:a-b;
    if(id==='addition')return /−/.test(p)?a-b:p.includes('□')?b-a:a+b;
    if(id==='f-double')return v===1?a/2:v===2?a*2:a*2;
    if(['f-groups','f-table'].includes(id))return v===0?a*b:v===1?b/a:n.reduce((s,x)=>s+x,0);
    if(['f-sharing','f-inverse','multiplikation'].includes(id))return v===0&&id==='multiplikation'?a*b:v===2?b/a:a/b;
    if(id==='f-remainder')return v===1?Math.floor(a/b):a%b;
    if(['f-equality','likhet'].includes(id))return v===1?answerChoice(q,o=>o==='Vänster och höger sida har samma värde.'):v===0?a+b-c:c-a-b;
    if(['f-pattern','monster'].includes(id))return v===0?2*n[2]-n[1]:v===1?2*n[2]-n[1]:(n[0]+n[1])/2;
    if(['f-half','brak-del-hel'].includes(id))return v===0?visual.shaded/visual.parts:v===1?a:a;
    if(['f-fraction-count','brak-del-antal','brak'].includes(id))return v===2?a*b/c:a/b*c;
    if(id==='f-fraction-line')return v===0?visual.mark/visual.parts:v===1?n[3]/n[2]:answerChoice(q,o=>o==='1/2');
    if(['f-fraction-equal','brak-likvardiga'].includes(id))return v===0?a*c/b:v===1?c*b/a:answerChoice(q,o=>{const x=nums(o);return x[0]/x[1]===a/b;});
    if(id==='brak-forlanga')return v===0?a*c:v===1?b*c:answerChoice(q,o=>{const x=nums(o);return x[0]===a*c&&x[1]===b*c;});
    if(id==='brak-forkorta')return v===0?a/gcd(a,b):v===1?b/gcd(a,b):answerChoice(q,o=>{const x=nums(o);return x[0]===a/gcd(a,b)&&x[1]===b/gcd(a,b);});
    if(id==='brak-jamfora'){const fs=fractions(p).map(([x,y])=>x/y);return v===1?Math.min(...fs):Math.max(...fs);}
    if(id==='gemensam-namnare')return v===0?answerChoice(q,o=>Number(o)%n[1]===0&&Number(o)%n[3]===0):v===1?n[4]/n[1]:n[0]/n[4];
    if(['f-fraction-add','brak-add-lika','brak-sub-lika','brak-add-olika','brak-sub-olika'].includes(id)){const fs=fractions(p),sub=id.includes('sub');return v===2&&!id.includes('olika')?(sub?fs[0][0]-fs[1][0]:fs[0][0]+fs[1][0]):fs[0][0]/fs[0][1]+(sub?-1:1)*fs[1][0]/fs[1][1];}
    if(id==='blandad-form')return v===0?a*c+b:v===1?Math.floor(a/b):a%b;
    if(id==='brak-hela')return v===0?c/a*b:v===1?b*c:c*b/(b-a);
    if(['f-decimal','decimal-plats'].includes(id))return v===0?a/b:v===1?(b%1):Math.round(a*b);
    if(['f-decimal-compare','sortera-tal'].includes(id))return v===0?Math.max(...n):v===1?Math.min(...n):answerChoice(q,o=>o==='De är lika stora.');
    if(['f-decimal-add','decimal-addition','decimal-subtraktion'].includes(id)){const sub=id==='decimal-subtraktion';return v===1?(sub?a-b:b-a):(sub?a-b:a+b);}
    if(['f-round','avrunda-heltal'].includes(id)){const step=/tusental/.test(p)?1000:/hundratal/.test(p)?100:10;return Math.floor(a/step+.5)*step;}
    if(['f-percent','procent-huvud'].includes(id))return a*b/100;
    if(id==='procent-begrepp')return v===0?a/100:v===1?a*100:a/b*100;
    if(['f-readtable','avlasa'].includes(id)){const values=visual.values;return v===0?values[visual.labels.indexOf(p.match(/har (\w+)/)[1])]:v===1?Math.max(...values):Math.min(...values);}
    if(['f-frequency','tabell','frekvenstabell'].includes(id)){if(v===0){const last=n.at(-1);return n.slice(0,-1).filter(x=>x===last).length;}return v===1?visual.values.reduce((x,y)=>x+y,0):a-b-c;}
    if(['f-mean','medel'].includes(id))return v===1?b/a:n.reduce((x,y)=>x+y,0)/n.length;
    if(['f-median','median'].includes(id)){if(id==='f-median'&&v===2){const counts=new Map();n.forEach(x=>counts.set(x,(counts.get(x)||0)+1));return [...counts].sort((a,b)=>b[1]-a[1])[0][0];}const sorted=[...n].sort((a,b)=>a-b);return sorted.length%2?sorted[Math.floor(sorted.length/2)]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;}
    if(id==='typvarde'){if(v===1)return Number(visual.labels[visual.values.indexOf(Math.max(...visual.values))]);const counts=new Map();n.forEach(x=>counts.set(x,(counts.get(x)||0)+1));const max=Math.max(...counts.values()),modes=[...counts].filter(([_,c])=>c===max).map(([x])=>x);return v===0?modes[0]:answerChoice(q,o=>{const x=nums(o);return x.length===2&&modes.every(m=>x.includes(m));});}
    if(id==='f-chance')return answerChoice(q,o=>o===(v===0?'Säker':v===1?'Omöjlig':'Möjlig men inte säker'));
    if(['f-probability','gynnsamma-utfall','sannolikhet'].includes(id))return v===0?a/(a+b):v===1?b/a:(a-1)/6;
    if(['f-shapes','former'].includes(id)){const shape=visual.name;return v===2?answerChoice(q,o=>o===shape):({triangel:3,kvadrat:4,rektangel:4,femhörning:5,sexhörning:6})[shape];}
    if(['f-bodies','kroppar'].includes(id)){const types=p.includes('triangulärt')?[5,6,9]:p.includes('pyramid')?[5,5,8]:[6,8,12];return types[v];}
    if(['f-length','langd','langd-enheter','f-mass','f-volume'].includes(id)){if(id==='f-length'&&v===2)return a*100+b;const words=p.match(/Hur många (\w+) är [\d,]+ (\w+)/),to=words[1],from=words[2];const factor={m:1,cm:.01,mm:.001,dm:.1,km:1000,kg:1000,g:1,l:10,dl:1};return a*factor[from]/factor[to];}
    if(id==='f-clock'){const times=[...p.matchAll(/(\d+):(\d+)/g)].map(m=>Number(m[1])*60+Number(m[2]));return v===2?times[0]-times[1]:times[1]-times[0];}
    if(id==='f-time')return v===0?a*60+b:v===1?a/60:a*60;
    if(['f-perimeter','omkrets'].includes(id))return v===0?2*(a+b):v===1?a/4:a/2-b;
    if(['f-area','area-rektangel'].includes(id))return v===0&&visual?visual.rows*visual.cols:v===1?a/b:a*b;
    if(id==='f-angle')return v===0?90:v===1?180:a*90;
    if(id==='f-scale')return v===0?a*2:a/2;
    if(['f-symmetry','spegelsymmetri'].includes(id))return v===0?p.includes('kvadrat')&&!p.includes('inte')?4:p.includes('rektangel')?2:3:v===1?answerChoice(q,o=>o.startsWith('Delarna täcker')):answerChoice(q,o=>o===(p.includes('kvadrat')?'Ja':'Nej'));
    if(id==='f-combinations')return v===2?b/a:a*b;
    if(id==='f-coordinate')return v===0?visual.x:v===1?visual.y:answerChoice(q,o=>{const x=nums(o);return x[0]===a&&x[1]===b;});
    if(['f-proportion','proportionalitet'].includes(id)){if(id==='proportionalitet'&&v!==1)return answerChoice(q,o=>o===(v===0?'Kostnaden är proportionell mot antalet.':'Nej, eftersom en fast avgift tillkommer.'));return v===0?a*b:v===1?b/a:b/a;}
    if(id==='f-word-mult')return v===0?a*b:a/b;
    if(['f-reasonable','overslag'].includes(id))return v===0?Math.round(a/10)*10*b:v===1?Math.round(a/10)*10+Math.round(b/10)*10:answerChoice(q,o=>nums(o)[0]===a*b);
    if(['f-order','prioritering','parentes-tal'].includes(id)){const expression=p.replace(/^Beräkna /,'').replace(/\.$/,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');assert(/^[\d ()+*/.-]+$/.test(expression),'Safe arithmetic expression');return Function(`return (${expression})`)();}
    if(['f-equation','ekvation-add'].includes(id))return v===0?b-a:v===1?a+b:a-b;
    if(['f-negative','negativ-tallinje','negativa'].includes(id))return v===0?Math.max(...n):v===1?a-b:b-a;
    if(id==='tal-siffra')return v===0?String(a).length:v===1?String(a).split('').filter(x=>x==='0').length:Math.floor(a/10)%10;
    if(id==='delbarhet')return v===0?String(a).split('').reduce((s,x)=>s+Number(x),0):v===1?answerChoice(q,o=>a%Number(o)===0):answerChoice(q,o=>o===(a%b===0?'Ja':'Nej'));
    if(id==='primtal'){const isPrime=x=>x>1&&Array.from({length:Math.max(0,x-2)},(_,i)=>i+2).every(d=>x%d!==0);return v===0?answerChoice(q,o=>isPrime(Number(o))):v===1?2:answerChoice(q,o=>o==='Det har bara en positiv delare.');}
    if(id==='primfaktorer'){if(v===0)return a/(b*c);if(v===2)return n[1]*n[2]*n[3];return answerChoice(q,o=>{const parts=nums(o);return parts.reduce((a,b)=>a*b,1)===a&&parts.every(x=>x>1&&Array.from({length:Math.max(0,x-2)},(_,i)=>i+2).every(d=>x%d!==0));});}
    if(id==='avrunda-decimal'){const raw=Math.round(a*1000),step=10**(3-v);return Math.floor(raw/step+.5)*step/1000;}
    if(['tiomultiplikation','tiodivision'].includes(id))return id==='tiomultiplikation'?a*b:a/b;
    if(id==='brak-decimal')return a/b;
    if(id==='forenkla-termer')return v===0?a+c:v===1?b+c:answerChoice(q,o=>{const x=nums(o);return x[0]===a-b&&x[1]===c;});
    if(id==='distributiva')return v===0?a*b:v===1?a*c:answerChoice(q,o=>{const x=nums(o);return x[0]===a*b&&x[1]===a*c;});
    if(id==='ekvation-mult')return v===0?b/a:v===1?a*b:a/b;
    if(id==='ekvation-tva-steg')return v===0?(c-b)/a:v===1?(c+b)/a:(a-c)*b;
    if(id==='ekvation-text')return v===0?answerChoice(q,o=>o===`x + (x + ${a}) = ${b}`):v===1?(b-a)/2:(c-b)/a;
    if(id==='monster-regel'){if(v===0)return n[6]*(n[3]-n[1])+n[1]-(n[3]-n[1]);if(v===1){const step=n[1]-n[0],start=n[0]-step;return answerChoice(q,o=>{const x=nums(o);return x[0]===step&&x[1]===start;});}return a*c+b;}
    if(id==='procent-delen')return a*b/100;
    if(id==='procent-andelen')return a/b*100;
    if(id==='procent-hela')return b/(a/100);
    if(id==='procent-rabatt')return v===1?a*b/100:a*(1-b/100);
    if(id==='procent-okning')return v===1?a*b/100:a*(1+b/100);
    if(id==='stapel-stolp')return v===0?visual.values[visual.labels.indexOf(p.match(/stapel (\w+)/)[1])]:v===1?Math.max(...visual.values):Math.max(...visual.values)-Math.min(...visual.values);
    if(id==='linjediagram')return v===0?visual.values[2]:v===1?visual.values[1]-visual.values[0]:visual.values[2]-visual.values[1];
    if(id==='cirkeldiagram'){const share=visual.values[0]/visual.values.reduce((a,b)=>a+b,0);return v===0?share:v===1?a*share:share*100;}
    if(id==='uttryck')return v===0?a*c+b:v===1?a*(c+b):a*b;
    if(id==='variabel')return v===0?answerChoice(q,o=>o===`${a} gånger x plus ${b}`):v===1?answerChoice(q,o=>o.startsWith('Den representerar ett tal')):a*b;
    if(id==='skriva-uttryck')return answerChoice(q,o=>o===(v===0?`${b}x + ${a}`:v===1?`x + ${a}`:`${a}x`));
    if(id==='ekvation-provning')return answerChoice(q,o=>a*Number(o)+b===c);
    if(id==='romerska'){const symbols=p.match(/talet ([IVXLC]+)/)[1],values={I:1,V:5,X:10,L:50,C:100};return [...symbols].reduce((sum,x,i)=>sum+(values[x]<(values[symbols[i+1]]||0)?-values[x]:values[x]),0);}
    if(id==='andra-talbaser')return parseInt(p.match(/talet (\d+)/)[1],2);
    if(id==='dimensioner')return answerChoice(q,o=>o===['m²','m³','m'][v]);
    if(id==='vinkeltyper')return answerChoice(q,o=>o===(a<90?'spetsig':a===90?'rät':'trubbig'));
    if(id==='triangel-typer')return v===0?(180-a)/2:v===1?60:90-a;
    if(id==='fyrhorningar')return answerChoice(q,o=>o===(v===0?'De har fyra räta vinklar.':v===1?'Alla fyra sidor är lika långa.':'Den är både rektangel och romb.'));
    if(id==='triangel-vinkelsumma')return 180-a-b;
    if(id==='vinklar')return v===0?90-a:v===1?180-a:180-a-b;
    if(id==='area-triangel')return v===0?a*b/2:v===1?2*a/b:answerChoice(q,o=>o===`${a} × ${b} ÷ 2`);
    if(id==='area-parallellogram')return v===0?a*b:v===1?a/b:answerChoice(q,o=>o==='Den vinkelräta höjden');
    if(id==='area-sammansatt')return v===1?a+b:a*b-c*c;
    if(id==='volym-ratblock')return v===0?a*b*c:v===1?a/b/c:a*a*a;
    if(id==='begransningsyta')return v===0?2*(a*b+a*c+b*c):v===1?6*a*a:2*a*b;
    if(id==='skala-verklighet')return b*c/100;
    if(id==='skala-bild')return c/b;
    if(id==='skala')return v===0?solve('skala-verklighet',0,q):v===2?solve('skala-bild',0,q):a*b;
    if(id==='manghorning-vinkel')return v===1?a-2:(a-2)*180;
    if(id==='variationsbredd')return Math.max(...n)-Math.min(...n);
    if(id==='diagram-vinkel')return v===0?a*360/100:v===1?a/360*100:360/b;
    if(id==='sannolikhet-skala')return v===0?answerChoice(q,o=>Number(o.replace('−','-').replace(',','.'))>=0&&Number(o.replace('−','-').replace(',','.'))<=1):v===1?1:0;
    return window.solveReviewedHighschool(id,v,q);
  }
  const random=Math.random;let seed=98765,checked=0;
  window.solveReviewedQuestion=solve;
  try{
    Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const errors=[];
    for(const id of Object.keys(M.reviewedBank))for(let v=0;v<3;v++)for(let i=0;i<15;i++){
      const q=M.generateReviewed(id,v);try{const expected=solve(id,v,q);assert(Math.abs(q.answer-expected)<1e-9,`Reviewed answer ${id}:${v}: ${q.answer} vs ${expected}\n${q.prompt}`);M.questionExtras(q);checked++;}catch(error){if(!errors.some(e=>e.id===`${id}:${v}`))errors.push({id:`${id}:${v}`,message:error.message});}
    }
    assert(!errors.length,errors.map(e=>e.message).join('\n\n'));
    assert([...M.foundationIds].every(id=>Object.hasOwn(M.reviewedBank,id)),'Every foundation has reviewed questions');
    assert([...M.reviewedTargetIds].every(id=>Object.hasOwn(M.reviewedBank,id)),'Every skill included through year 9 has reviewed questions');
    assert(M.reviewedHighschoolIds.size===136,'136 additional unique skills for years 8–9 are reviewed');
    const visuals=new Set();
    for(const id of M.reviewedHighschoolIds)for(let v=0;v<3;v++){
      const item=M.generate(id,v);if(!item.visual)continue;visuals.add(item.visual.type);
      const restored=M.questionExtras(JSON.parse(JSON.stringify(item)));
      assert(JSON.stringify(restored.visual)===JSON.stringify(item.visual),`Visual survives serialization: ${id}`);
      const html=M.renderQuestionVisual({...item,...restored});assert(html.includes('question-visual')&&!/NaN|undefined|Infinity/.test(html),`Finite rendered geometry: ${id}`);
    }
    assert(['cartesian','xytable','histogram','boxplot','venn','tree','triangle','segments','truncatedbars'].every(type=>visuals.has(type)),'New mathematical representations are covered');
    for(const bad of [{type:'cartesian',xMin:0,xMax:5,yMin:0,yMax:5,xStep:0,yStep:1,series:[],points:[]},{type:'boxplot',stats:[1,2,3,2,5]},{type:'tree',first:['1/0','1/2'],next:[['1/2','1/2'],['1/2','1/2']]},{type:'triangle',labels:['a','b',{}],right:true}]){
      let rejected=false;try{M.questionExtras({visual:bad});}catch{rejected=true;}assert(rejected,'Malformed imported mathematical visuals are rejected');
    }
    const visualHost=document.createElement('div');visualHost.style='position:absolute;left:-10000px;width:500px';document.body.append(visualHost);
    try{
      for(const id of Object.keys(M.reviewedBank))for(let v=0;v<3;v++)for(let sample=0;sample<3;sample++){
        const item=M.generate(id,v);if(!item.visual)continue;
        visualHost.innerHTML=M.renderQuestionVisual(item);const svg=visualHost.querySelector('svg');if(!svg)continue;
        const viewport=svg.viewBox.baseVal;
        for(const label of svg.querySelectorAll('text')){const bounds=label.getBBox();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=viewport.width&&bounds.y+bounds.height<=viewport.height,`Clipped visual text ${id}:${v}: ${label.textContent}`);}
      }
    }finally{visualHost.remove();}
    for(let sample=0;sample<80;sample++){
      for(let v=0;v<3;v++)for(const id of ['ranta-tid','moms'])assert(!/\d+[.,]\d{7,}/.test(M.generateReviewed(id,v).prompt),`Floating-point artefact in ${id}`);
      for(let v=0;v<3;v++)for(const id of ['brak-hela','procent-baklanges','f-proportion']){const item=M.generate(id,v);assert(!item.optionValues?.some(x=>x<0),`Negative quantity choice in ${id}`);}
    }
    assert(M.parseAnswer(M.fmt(1e-9))===1e-9,'Nanoprefix answers remain visible and parseable');
    for(const id of ['cirkelbage','procent-forandring','index','viktat-medel','pythagoras-kontroll']){const seen=new Set();for(let i=0;i<40;i++){const item=M.generate(id,id==='cirkelbage'?2:0);seen.add(item.answerKind==='choice'?item.prompt:item.answer);}assert(seen.size>2,`Meaningful variation for ${id}`);}
    const answers=new Set(),counts=new Set();for(let i=0;i<40;i++){answers.add(M.generateReviewed('f-remainder',0).answer);counts.add(M.generateReviewed('f-frequency',0).answer);}assert(answers.size>=4&&counts.size>=3,'Previously constant answers genuinely vary');
    const avoid=[];for(let i=0;i<12;i++){const q=M.freshQuestion('brak-forlanga',0,avoid),fingerprint=M.questionFingerprint(q);assert(!avoid.some(x=>M.questionFingerprint(x)===fingerprint),'Fresh questions avoid recent repeats');avoid.push({...q,nodeId:'brak-forlanga'});}
    let rejected=false;try{M.questionExtras({visual:{type:'shape',name:'<script>'}});}catch{rejected=true;}assert(rejected,'Imported diagram content is restricted');
    return `${checked} independent checks of reviewed answers across ${Object.keys(M.reviewedBank).length} skills; variation, visual metadata and repeat avoidance passed`;
  }finally{Math.random=random;}
};
