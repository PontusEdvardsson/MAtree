/* Oberoende lösningar beräknas från tryckt text och bilddata, inte generatorernas facit. */
window.solveReviewedHighschool=(id,v,q)=>{
  const assert=(c,m)=>{if(!c)throw Error(m);},p=q.prompt.split('\n\n')[0],visual=q.visual;
  const clean=s=>s.replace(/[\u00a0\u202f]/g,'').replace(/−/g,'-').replace(/,/g,'.');
  const nums=s=>(clean(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number),n=nums(p),[a,b,c,d,e]=n;
  const options=q.prompt.split('\n').filter(s=>/^\d+\. /.test(s)).map(s=>s.replace(/^\d+\. /,''));
  const choose=predicate=>{const matches=options.map((s,i)=>predicate(s)?i+1:0).filter(Boolean);assert(matches.length===1,`Ambiguous mathematical choices ${id}:${v}: ${q.prompt}`);return matches[0];};
  const textChoice=s=>choose(o=>o===s),equal=(a,b)=>Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(a),Math.abs(b));
  function value(expression,x=0){
    let s=clean(expression).replace(/(\d+)\/(\d+)/g,'($1/$2)').replace(/²/g,'^2').replace(/³/g,'^3').replace(/×/g,'*').replace(/÷/g,'/').replace(/√(\d+)/g,(_,n)=>`(${Math.sqrt(Number(n))})`);
    assert(/^[\d.x\s()+*/^\-]+$/.test(s),`Unsupported expression: ${expression}`);
    s=s.replace(/(\d|\))x/g,'$1*x').replace(/(\d|x|\))\(/g,'$1*(').replace(/\^/g,'**');
    return Function('x',`return (${s})`)(x);
  }
  const sameExpression=(s,t)=>[-3,-1,1,2,5].every(x=>equal(value(s,x),value(t,x)));
  const expression=prefix=>p.slice(p.indexOf(prefix)+prefix.length).split('. ')[0].replace(/[.?]$/,'');
  const calculation=()=>value(p.match(/Beräkna (.+?)(?:\. |\.$)/)[1]);
  const median=arr=>{const s=[...arr].sort((a,b)=>a-b),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2;};
  const factorial=x=>x<=1?1:x*factorial(x-1);
  const lineInfo=s=>{const points=s.points,[x0,y0]=points[0],[x1,y1]=points[points.length-1],k=(y1-y0)/(x1-x0);return {k,m:y0-k*x0};};
  if(['decimal-multiplikation','decimal-division'].includes(id))return /Beräkna/.test(p)?calculation():id==='decimal-multiplikation'?a*b:a/b;
  if(['negativ-subtraktion','negativ-multiplikation','negativ-division'].includes(id))return calculation();
  if(id==='stora-tal')return v===0?a*1e6+b*1000:v===1?a/1e6:a*1000;
  if(['prefix-stora','prefix-sma'].includes(id)){const symbol=p.match(v===0?/Prefixet ([kMGmµn])/:v===1?/Hur många ([kMGmµn])m/:/prefixet ([kMGmµn])/)[1],factor={k:1e3,M:1e6,G:1e9,m:1e-3,'µ':1e-6,n:1e-9}[symbol];return v===0?a*factor:v===1?a/factor:factor;}
  if(id==='potens-begrepp')return v===0?calculation():v===1?n.length-1:choose(o=>equal(value(o),a**b)&&o.split('×').length===b);
  if(['tiopotens','negativ-exponent'].includes(id))return v===1?Math.round(Math.log10(n[1])):calculation();
  if(['grundpotens-stora','grundpotens-sma'].includes(id)){const exponent=Math.floor(Math.log10(a)+1e-10),coefficient=a/10**exponent;return v===0?coefficient:v===1?exponent:choose(o=>{const t=nums(o);return t[0]>=1&&t[0]<10&&equal(value(o),a);});}
  if(['potens-multiplikation','potens-division'].includes(id)){if(v===1)return calculation();if(v===0)return id==='potens-division'?b-d:b+d;const source=p.match(/gäller för (.+?), där/)[1];return choose(o=>sameExpression(o,source));}
  if(id==='grundpotens-rakning'){if(v!==2)return calculation();const source=p.match(/formen för (.+?)\?/)[1];return choose(o=>{const coefficient=nums(o)[0];return coefficient>=1&&coefficient<10&&equal(value(o),value(source));});}
  if(id==='kvadrattal')return v===0?a*a:v===1?choose(o=>Number.isInteger(Math.sqrt(Number(o)))):calculation();
  if(id==='kvadratrot')return v===2?Math.floor(Math.sqrt(a)):Math.sqrt(a);
  if(id==='talmangder')return textChoice(['Heltal','Rationella tal','Alla rationella tal är reella tal.'][v]);
  if(id==='irrationella')return v===0?choose(o=>o.startsWith('√')&&!Number.isInteger(Math.sqrt(nums(o)[0]))):v===1?textChoice('Decimalutvecklingen är oändlig och inte periodisk.'):calculation();
  if(id==='rot-rakning')return v===0?Math.sqrt(a/b):calculation();
  if(['brak-heltal-mult','brak-multiplikation','brak-division','brak-korsforkorta'].includes(id)){
    if(v===0)return calculation();
    if(id==='brak-korsforkorta'&&v===1){let divisor=Math.min(a,d);while(a%divisor||d%divisor)divisor--;return divisor;}
    if(v===1){const [left,right]=p.split(' = '),l=value(left.split(/[×÷]/)[0]),target=value(right.split('. ')[0]);return id==='brak-division'?l/target:target/l;}
    const source=id==='brak-korsforkorta'?p.match(/av (.+?) har/)[1]:p.match(/med (.+?)\?/)[1];return choose(o=>equal(value(o),value(source)));
  }
  if(id==='brak-mgn'){if(v===0){let l=Math.max(b,d);while(l%b||l%d)l++;return l;}return v===1?c/b:value(p.match(/Beräkna (.+?)\. Svara/)[1]);}
  if(['minus-parentes','tva-parenteser','kvadreringsregel','konjugatregel','faktorisera-uttryck','algebra-brak'].includes(id)){
    if(options.length){const source=p.match(/(?:uttryck är lika med |lika med |utveckling av |uttryck är )(.+?)(?:\?| är korrekt|, där)/)?.[1];assert(source,`Missing symbolic source: ${p}`);return choose(o=>sameExpression(o,source));}
    if(id==='faktorisera-uttryck')return b/a;
    const src=p.match(/(?:Förenkla |Utveckla )(.+?)(?:\. |, där)/)[1],y0=value(src,0),yp=value(src,1),ym=value(src,-1);
    return /konstanttal/.test(p)?y0:(yp-ym)/2;
  }
  if(['ekvation-bada','ekvation-parentes','ekvation-namnare'].includes(id)){
    const [l,r]=p.match(/ekvationen (.+?)\. Vad/)[1].split(' = '),diff=x=>value(l,x)-value(r,x);return -diff(0)/(diff(1)-diff(0));
  }
  if(id==='andragrad')return v===0?choose(o=>{const solutions=nums(o);return solutions.length===2&&solutions.every(x=>x*x===a)&&solutions.includes(-Math.sqrt(a))&&solutions.includes(Math.sqrt(a));}):v===1?textChoice('0'):-Math.sqrt(a);
  if(id==='sidovinklar')return v===0?180-a:v===1?180/(1+a):textChoice('De har ett gemensamt vinkelben och de andra benen bildar en rak linje.');
  if(id==='parallella-vinklar')return v===2?180-a:a;
  if(['area-enheter','hektar','volym-enheter'].includes(id)){const units=p.match(/Omvandla .+? ([^ ]+) till ([^.]+)\./),unit={m:1,cm:.01,dm:.1,ha:10000,km:1000,liter:.001};function factor(s){return s==='ha'?unit.ha:s==='liter'?unit.liter:unit[s.replace(/[²³]/g,'')]**(s.endsWith('²')?2:s.endsWith('³')?3:1);}return a*factor(units[1])/factor(units[2]);}
  if(id==='cirkel-begrepp')return v===0?2*a:v===1?a/2:textChoice('En sträcka mellan två punkter på cirkelns rand.');
  if(id==='cirkel-omkrets')return v===0?2*3.14*a:v===1?3.14*a:a/(2*3.14);
  if(id==='cirkel-area')return v===0?3.14*a*a:v===1?3.14*(a/2)**2:Math.sqrt(a/3.14);
  if(id==='cirkelbage')return v===0?2*3.14*a*b/360:v===1?a*b/360:a/b*360;
  if(id==='cirkelsektor')return v===0?3.14*a*a*b/360:v===1?a*b/360:a/b*360;
  if(['volym-prisma','volym-pyramid'].includes(id)){const divisor=id==='volym-pyramid'?3:1;return v===0?a*b/divisor:v===1?a*divisor/b:a*b*c/2/divisor;}
  if(['volym-cylinder','volym-kon'].includes(id)){const divisor=id==='volym-kon'?3:1;return v===2?a*divisor/(3.14*b*b):3.14*(v===1?a/2:a)**2*b/divisor;}
  if(id==='cylinder-yta')return 2*3.14*a*b+(v===0?2:v===2?1:0)*3.14*a*a;
  if(['volym-klot','klot-yta'].includes(id)){const radius=v===1?a/2:a,whole=id==='volym-klot'?4/3*3.14*radius**3:4*3.14*radius**2;return whole*(v===2?.5:1);}
  if(['pythagoras-hyp','pythagoras-katet'].includes(id)){if(v===2)return id==='pythagoras-hyp'?a*Math.SQRT2:Math.sqrt(a*a-b*b);const lengths=visual.labels.map(Number);return id==='pythagoras-hyp'?Math.hypot(lengths[0],lengths[1]):Math.sqrt(lengths[2]**2-lengths[0]**2);}
  if(id==='pythagoras-kontroll'){const s=n.slice(0,3).sort((a,b)=>a-b);return textChoice(equal(s[0]**2+s[1]**2,s[2]**2)?'Ja':'Nej');}
  if(id==='skala-bestamma')return v===2?a/b:v===1?b/a:b*100/a;
  if(['areaskala','volymskala'].includes(id)){const power=id==='areaskala'?2:3;return v===0?a**power:v===1?b*a**power:a**(1/power);}
  if(id==='likformighet')return v===0?c*b/a:v===1?b/a:textChoice('Motsvarande vinklar är lika och motsvarande sidor har samma förhållande.');
  if(id==='rotationssymmetri'){const order=p.includes('rektangel')?2:p.includes('kvadrat')?4:p.includes('triangel')?3:6;return v===1?order:360/order;}
  if(id==='spegla-koordinat')return v===2?choose(o=>{const [x,y]=nums(o);return x===-a&&y===-b;}):v===0?-b:-a;
  if(id==='rymiddiagonal')return v===1?a*Math.sqrt(3):Math.hypot(a,b,c);
  if(id==='likformighet-avancerad')return v===0?c*b/a:v===1?c*(a+b)/a:c*(b/a)**2;
  if(id==='trigonometri')return a*b;
  if(id==='koordinater'){const point=visual.points[0];return v===2?choose(o=>{const [x,y]=nums(o);return x===point.x&&y===point.y;}):v===0?point.x:point.y;}
  if(id==='samband-tabell'){const info=lineInfo({points:visual.points});return v===0?info.k*a+info.m:v===1?info.k:(a-info.m)/info.k;}
  if(id==='graf-avlasning'){const info=lineInfo(visual.series[0]);return v===0?info.k*a+info.m:v===1?(a-info.m)/info.k:info.m;}
  if(id==='enhetspris')return v===0?b/a:v===1?a*b:textChoice(b/a<d/c?'A':'B');
  if(id==='forhallande')return v===0?c*a/(a+b):v===1?c*b/a:b/(a+b);
  if(id==='recept')return v===0?b/a*c:v===1?c/(b/a):b/a;
  if(id==='hastighet')return v===0?a/b:v===1?a*b/60:a/b*60;
  if(id==='tid-enheter')return v===0?a+b/60:v===1?a*60:(c-a)*60+d-b;
  if(id==='vag-tid'){const points=visual.series[0].points;return v===0?points[2][0]-points[1][0]:v===1?(points[1][1]-points[0][1])/(points[1][0]-points[0][0]):points.slice(1).reduce((sum,p,i)=>sum+Math.abs(p[1]-points[i][1]),0);}
  if(id==='funktion-begrepp')return textChoice(['Varje tillåtet x har exakt ett y.','Ja','(1, 4), (2, 4), (3, 7)'][v]);
  if(['funktionsvarde','funktion'].includes(id)){const expr=p.match(/y = (.+?) när x/)[1],x=Number(clean(p.match(/när x = ([-\d]+)\./)[1]));return value(expr,x);}
  if(id==='startvarde')return v===1?value(p.match(/y = (.+?) kronor/)[1],0):lineInfo(visual.series[0]).m;
  if(id==='lutning')return v===1?(d-b)/(c-a):lineInfo(visual.series[0]).k;
  if(id==='linje-ekvation')return v===0?choose(o=>{const expr=o.split(' = ')[1];return visual.series[0].points.every(([x,y])=>equal(value(expr,x),y));}):v===1?c-a*b:lineInfo(visual.series[0]).m;
  if(id==='rita-linje'){const source=p.match(/(?:grafen till y = (.+?)\?|rita y = (.+?)\. Vilken)/);assert(source,`Missing graph equation: ${p}`);return choose(o=>visual.series.find(s=>s.label===o).points.every(([x,y])=>equal(value(source[1]||source[2],x),y)));}
  if(id==='jamfora-samband')return v===0?(d-b)/(a-c):v===1?(a-c)*e+b-d:textChoice('B');
  if(['aritmetisk','geometrisk-talfoljd'].includes(id)){const geometric=id==='geometrisk-talfoljd';if(v===0){const index=d;return geometric?a*(b/a)**(index-1):a+(index-1)*(b-a);}if(v===1)return geometric?b/a:b-a;return choose(o=>{const expr=o.replace(/n/g,'x');return [1,2,4].every(index=>equal(value(expr,index),geometric?a*b**(index-1):a+(index-1)*b));});}
  if(id==='formel-omskrivning')return textChoice(['h = 2A/b','x = (y − m)/k','t = s/v'][v]);
  if(id==='icke-linjart')return v===0?choose(o=>!sameExpression(o.split(' = ')[1],`${(value(o.split(' = ')[1],1)-value(o.split(' = ')[1],-1))/2}x + ${value(o.split(' = ')[1],0)}`)):v===1?textChoice('Nej'):a*b*b;
  if(['ekvationssystem','ekvationssystem-add'].includes(id)){const system=p.match(/systemet (.+?)\. Vad/)[1].split(' och ');let x,y;if(id==='ekvationssystem'){const expr=system[0].split(' = ')[1],sum=Number(clean(system[1].split(' = ')[1])),m=value(expr,0),k=value(expr,1)-m;x=(sum-m)/(1+k);y=sum-x;}else{const numbers=system.map(s=>nums(s));x=(numbers[0][1]+numbers[1][1])/(numbers[0][0]+numbers[1][0]);y=numbers[0][1]-numbers[0][0]*x;}return /Vad är y/.test(p)?y:x;}
  if(['procent-forandring','forandring'].includes(id))return Math.abs(b-a)/a*100;
  if(id==='forandringsfaktor')return v===2?(a-1)*100:1+(v===1?-1:1)*a/100;
  if(id==='procent-jamfora')return (b-a)/(v===1?a:b)*100;
  if(id==='procent-over100')return v===1?a*b/100:a*(1+b/100);
  if(id==='procent-baklanges')return b/(1+(v===1?-1:1)*a/100);
  if(id==='upprepad-forandring')return a*(1+(v===1?-1:1)*b/100)*(1+(v===2?1:-1)*c/100);
  if(id==='upprepad-samma')return a*(1+(v===1?-1:1)*b/100)**c;
  if(id==='ranta')return v===0?a*b/100:v===1?b/a*100:a/(b/100);
  if(id==='ranta-tid')return v===2?b/a*12/c*100:a*b/100*c/12;
  if(id==='procentenheter')return v===0?b-a:v===1?(b-a)/a*100:a-b;
  if(id==='promille')return v===0?a/1000:v===1?a/1e6:a*1000;
  if(id==='index')return v===0?c/a*100:v===1?a*c/b:(b-a)/a*100;
  if(id==='relativ-frekvens')return v===0?a/b:v===1?a/b*100:b/(a+b);
  if(id==='viktat-medel'){if(v===2)return (a*b+c*d)/(a+c);const total=visual.values.reduce((s,x)=>s+x,0),sum=visual.values.reduce((s,x,i)=>s+x*Number(visual.labels[i]),0);return v===0?sum/total:sum;}
  if(id==='histogram')return v===0?visual.values[1]+visual.values[2]:v===1?visual.values.reduce((s,x)=>s+x,0):nums(visual.labels[visual.values.indexOf(Math.max(...visual.values))])[0];
  if(id==='kvartiler'){const data=nums(p.match(/Data: (.+?)\. Sortera/)[1]).sort((a,b)=>a-b),middle=Math.floor(data.length/2),lo=median(data.slice(0,middle)),hi=median(data.slice(Math.ceil(data.length/2)));return v===0?lo:v===1?hi:hi-lo;}
  if(id==='ladagram')return v===0?visual.stats[2]:v===1?visual.stats[3]-visual.stats[1]:visual.stats[4]-visual.stats[0];
  if(id==='val-lagesmatt')return textChoice(['Medianen','Typvärdet','Medelvärdet'][v]);
  if(id==='vilseledande')return v===0?(visual.values[1]-visual.values[0])/visual.values[0]*100:v===1?visual.baseline:textChoice('Y-axeln börjar över noll.');
  if(id==='venndiagram')return v===0?visual.left+visual.both+visual.right:v===1?visual.left:visual.left+visual.both+visual.right+visual.outside;
  if(id==='komplement')return v===2?100-a:1-a/b;
  if(id==='forvantat-antal')return v===0?a/b*c:v===1?c/(a/b):textChoice('Nej');
  if(['trad-oberoende','trad-beroende'].includes(id)){const t=a+b,replacement=id==='trad-oberoende',first=v===2?b:a,second=v===0?a:b,remove=!replacement&&v!==1?1:0;return first/t*(second-remove)/(t-(replacement?0:1));}
  if(id==='flera-vagar')return 2*a/(a+b)*b/(a+b-(v===1?1:0));
  if(id==='minst-en')return 1-(1-a)**b;
  if(id==='experiment-sannolikhet')return v===2?textChoice('Nej'):b/a*(v===1?100:1);
  if(id==='kombinationer')return v===0?a*b*c:v===1?b**a:a*(b+1);
  if(id==='ordna-objekt')return v===1?a*(a-1):factorial(a);
  if(id==='tva-tarningar'){const outcomes=[];for(let x=1;x<=6;x++)for(let y=1;y<=6;y++)if(v===1?x===y:x+y===a)outcomes.push([x,y]);return v===2?outcomes.length:outcomes.length/36;}
  if(id==='oordnade-val'){let count=0;function enumerate(last,remaining){if(!remaining){count++;return;}for(let i=last+1;i<=b;i++)enumerate(i,remaining-1);}enumerate(0,a);return count;}
  if(id==='tre-drag'){const t=a+b;return v===0?1-b/t*(b-1)/(t-1)*(b-2)/(t-2):v===1?a/t*(a-1)/(t-1)*(a-2)/(t-2):a/t*b/(t-1)*(a-1)/(t-2);}
  if(id==='problem-bild'){const length=nums(visual.label)[0]/visual.known;return v===0?length*visual.parts:v===1?length:length*(visual.parts-visual.known);}
  if(id==='problem-baklanges')return v===0?(c-b)/a:v===1?c/b-a:(c+b)*a;
  if(id==='problem-tabell'){let answer;for(let adults=0;adults<=a;adults++)if(adults*b+(a-adults)*c===d)answer=v===1?a-adults:adults;assert(answer!==undefined,'Ticket solution exists');return answer;}
  if(id==='problem-graf'){const A=lineInfo(visual.series[0]),B=lineInfo(visual.series[1]),x=(B.m-A.m)/(A.k-B.k);return v===0?x:v===1?A.k*x+A.m:A.m;}
  if(id==='problem-ekvation')return v===2?(a-2*b)/4:v===0?(b-2*a)/2:a-(b-2*a)/2;
  if(id==='problem-rimlighet')return v===0?textChoice(`${a*b} m²`):v===1?textChoice('Nej'):textChoice(`${a*.8} kr`);
  if(id==='problem-flersteg')return a*b*(1-c/100)+d;
  if(id==='kod-variabel'){const lines=p.split('\n'),env={};for(const line of lines){const match=line.match(/^([xy]) = (.+)$/);if(match){const expr=match[2].replace(/[xy]/g,s=>String(env[s]));env[match[1]]=value(expr);}}return /värde har y/.test(p)?env.y:env.x;}
  if(id==='kod-loop')return v===0?a+b*c:v===1?a*c**b:a-b*c;
  if(id==='kalkylblad'){const row=a;return textChoice(v===0?`=A${row}*B${row}`:v===1?`=(A${row}+B${row})/2`:`=A${row+1}*B${row+1}`);}
  if(id==='simulering')return v===0?a/b:textChoice(v===1?'Slumpa heltal 1–6 med lika sannolikhet.':'För att minska slumpvariationens inverkan på den relativa frekvensen.');
  if(id==='densitet')return v===0?a/b:v===1?a*b:a/b;
  if(id==='material')return v===0?a*b*(1+c/100):v===1?a/b*2:Math.ceil(a/b);
  if(id==='moms')return v===0?a*(1+b/100):v===1?a/(1+b/100):a*b/100;
  if(id==='amortering')return v===0?a-b*c:v===1?a*b/100/12+d:(a-b)*c/100/12;
  throw Error(`Missing independent highschool check ${id}:${v}`);
};
