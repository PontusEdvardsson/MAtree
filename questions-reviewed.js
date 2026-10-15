/* Granskad och utökad uppgiftsbank för tidigare grunder och åk 7.
   Tre aspekter per färdighet väljs i en omgång; inom varje aspekt slumpas mall och tal. */
(() => {
  'use strict';
  const M=window.MATREE, previous=M.generate, f=M.fmt;
  const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[r(0,a.length-1)];
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const q=(prompt,answer,explanation,unit='',answerKind=Number.isInteger(answer)?'integer':'number',visual=null)=>({prompt,answer,explanation,unit,answerKind,...(visual?{visual}: {})});
  const choice=(prompt,correct,wrong,explanation,visual=null)=>{const options=shuffle([correct,...new Set(wrong.filter(x=>x!==correct))]);return q(`${prompt}\n\n${options.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\nSvara med alternativets nummer.`,options.indexOf(correct)+1,explanation,'','choice',visual);};
  const frac=(n,d)=>`${n}/${d}`;
  const table=(labels,values)=>({type:'table',labels,values});
  const fraction=(parts,shaded)=>({type:'fraction',parts,shaded});
  const bank={};
  const add=(ids,facets)=>ids.split(' ').forEach(id=>bank[id]=facets);
  // Taluppfattning. Ordning, position och antal får separata kontroller.
  add('f-count',[
    ()=>{const n=r(1,18);return q(`Vilket tal kommer efter ${n}?`,n+1,'Nästa tal är ett större.');},
    ()=>{const n=r(2,20);return q(`Vilket tal kommer före ${n}?`,n-1,'Föregående tal är ett mindre.');},
    ()=>{const n=r(3,15);return q('Hur många prickar ser du?',n,'Räkna varje prick en gång.','','integer',{type:'dots',count:n});}
  ]);
  add('f-compare',[
    ()=>{const a=r(1,40),b=a+r(1,15),values=shuffle([a,b]);return q(`Vilket tal är störst: ${values.join(' eller ')}?`,b,'Jämför antalen.');},
    ()=>{const a=r(1,40),b=a+r(1,15);return q(`Vilket tal är minst: ${shuffle([a,b]).join(' eller ')}?`,a,'Det mindre talet anger det mindre antalet.');},
    ()=>{const a=r(1,20),b=a+r(1,8);return q(`Ali har ${a} kort och Kim har ${b}. Hur många fler kort har Kim?`,b-a,'Skillnaden visar hur många fler.');}
  ]);
  add('f-line',[
    ()=>{const start=r(0,10),step=r(1,3);return q(`Tallinjen har lika stora steg: ${start}, ${start+step}, □, ${start+3*step}. Vilket tal saknas?`,start+2*step,'Fortsätt med samma steg.');},
    ()=>{const start=r(0,15),step=r(1,3);return q(`Tallinjen har lika stora steg: ${start}, □, ${start+2*step}, ${start+3*step}. Vilket tal saknas?`,start+step,'Det saknade talet ligger ett steg efter det första.');},
    ()=>{const a=r(0,10),distance=r(2,8);return q(`Du står på ${a} på tallinjen och går ${distance} steg åt höger. Var hamnar du?`,a+distance,'Steg åt höger ökar talet.');}
  ]);
  add('f-split f-ten',[
    id=>{const whole=id==='f-ten'?10:r(5,20),part=r(1,whole-1);return q(`${part} + □ = ${whole}. Vilket tal saknas?`,whole-part,'Delarna ska tillsammans bli helheten.');},
    id=>{const whole=id==='f-ten'?10:r(5,20),part=r(1,whole-1);return q(`${whole} = □ + ${part}. Vilket tal saknas?`,whole-part,'Likheten gäller även med helheten till vänster.');},
    id=>{const whole=id==='f-ten'?10:r(5,20),part=r(1,whole-1);return q(`Det behövs ${whole} knappar. Du har ${part}. Hur många fattas?`,whole-part,'Räkna från det du har till det som behövs.');}
  ]);
  add('f-place positionssystem',[
    ()=>{const h=r(1,9),t=r(0,9),e=r(0,9),place=pick([1,10,100]),n=h*100+t*10+e;const digit=place===100?h:place===10?t:e;return q(`Vilket värde har siffran på ${place===100?'hundratals':place===10?'tiotals':'entals'}platsen i ${n}?`,digit*place,'Platsen bestämmer siffrans värde.');},
    ()=>{const h=r(1,9),t=r(0,9),e=r(0,9);return q(`Vilket tal består av ${h} hundratal, ${t} tiotal och ${e} ental?`,h*100+t*10+e,'Lägg ihop platsvärdena.');},
    ()=>{const tens=r(1,9),e=r(0,9);return q(`Hur många hela tiotal finns i ${tens*10+e}?`,tens,'Ett tiotal är en grupp om tio.');}
  ]);
  function arithmetic(kind,facet,small=false,borrow=false){
    let a,b;
    if(borrow){const tens=r(2,8),u=r(0,5),take=r(u+1,9);a=tens*10+u;b=r(0,tens-1)*10+take;}
    else if(small){a=r(1,9);b=r(1,20-a);}
    else {a=r(12,75);b=r(11,24);}
    if(kind==='add'){
      if(!small){a=r(1,6)*10+r(5,9);b=r(1,2)*10+r(5,9);}
      if(facet===0)return q(`Vad är ${a} + ${b}?`,a+b,'Lägg ihop antalen och växla tio ental vid behov.');
      if(facet===1)return q(`${a} + □ = ${a+b}. Vilket tal saknas?`,b,'Hitta den saknade delen av summan.');
      return q(`På ett bord ligger ${a} pennor. Du lägger dit ${b} till. Hur många ligger där nu?`,a+b,'Situationen betyder addition.','pennor');
    }
    if(!borrow){if(small){a=a+b;}else if(a<b)[a,b]=[b,a];}
    if(facet===0)return q(`Vad är ${a} − ${b}?`,a-b,'Ta bort den andra delen från det första antalet.');
    if(facet===1)return q(`${a} − □ = ${a-b}. Vilket tal saknas?`,b,'Skillnaden mellan helheten och det som återstår är det borttagna.');
    return q(`Du har ${a} kort och ger bort ${b}. Hur många har du kvar?`,a-b,'Situationen betyder subtraktion.','kort');
  }
  add('f-add-small',[()=>arithmetic('add',0,true),()=>arithmetic('add',1,true),()=>arithmetic('add',2,true)]);
  add('f-sub-small',[()=>arithmetic('sub',0,true),()=>arithmetic('sub',1,true),()=>arithmetic('sub',2,true)]);
  add('f-add-place',[()=>arithmetic('add',0),()=>arithmetic('add',1),()=>arithmetic('add',2)]);
  add('f-sub-place',[()=>arithmetic('sub',0,false,true),()=>arithmetic('sub',1,false,true),()=>arithmetic('sub',2,false,true)]);
  add('addition',[()=>arithmetic('add',0),()=>arithmetic('sub',0,false,true),()=>arithmetic(pick(['add','sub']),1)]);
  add('f-double',[
    ()=>{const n=r(2,15);return q(`Vad är dubbelt så mycket som ${n}?`,2*n,'Dubbelt betyder två lika stora antal.');},
    ()=>{const n=r(2,15);return q(`Vad är hälften av ${2*n}?`,n,'Dela i två lika delar.');},
    ()=>{const n=r(2,15);return q(`Kim har ${n} kort. Ali har dubbelt så många. Hur många har Ali?`,2*n,'Två grupper med samma antal.');}
  ]);
  add('f-groups f-table',[
    id=>{const a=r(2,10),b=id==='f-table'?r(0,10):r(2,10);return id==='f-table'?q(`Vad är ${a} × ${b}?`,a*b,'Multiplicera faktorerna.'):q(`Det finns ${a} grupper med ${b} stenar i varje. Hur många stenar finns totalt?`,a*b,'Lika grupper kan räknas med multiplikation.');},
    id=>{const a=r(2,10),b=id==='f-table'?r(0,10):r(2,10);return q(`${a} × □ = ${a*b}. Vilket tal saknas?`,b,'Den saknade faktorn anger hur många i varje grupp.');},
    id=>{const a=r(2,10),b=id==='f-table'?r(0,10):r(2,10);return q(`Vad är ${Array.from({length:a},()=>b).join(' + ')}?`,a*b,'Upprepad addition kan skrivas som multiplikation.');}
  ]);
  add('f-sharing f-inverse multiplikation',[
    id=>{const a=r(2,10),b=r(2,10);return id==='multiplikation'?q(`Vad är ${a} × ${b}?`,a*b,'Antal grupper gånger antal i varje.'):q(`${a*b} klossar delas lika mellan ${a} personer. Hur många får varje person?`,b,'Dela i lika stora delar.');},
    ()=>{const a=r(2,10),b=r(2,10);return q(`${a*b} klossar läggs i grupper med ${b} i varje. Hur många grupper blir det?`,a,'Räkna hur många grupper som ryms.');},
    ()=>{const a=r(2,10),b=r(2,10);return q(`□ × ${b} = ${a*b}. Vilket tal saknas?`,a,'Division och multiplikation är omvända operationer.');}
  ]);
  add('f-remainder',[
    ()=>{const d=r(3,9),groups=r(2,8),rest=r(1,d-1);return q(`Beräkna ${groups*d+rest} ÷ ${d}. Vilken rest blir det?`,rest,'Resten är mindre än divisorn.');},
    ()=>{const d=r(3,9),groups=r(2,8),rest=r(1,d-1);return q(`${groups*d+rest} klossar läggs i grupper med ${d} i varje. Hur många hela grupper blir det?`,groups,'Räkna bara kompletta grupper.');},
    ()=>{const d=r(3,9),groups=r(2,8),rest=r(1,d-1);return q(`${groups*d+rest} bullar läggs ${d} på varje fat. Hur många bullar blir över när alla hela fat har fyllts?`,rest,'Det som inte fyller ett fat är resten.');}
  ]);
  add('f-equality likhet',[
    ()=>{const a=r(2,9),b=r(2,9),c=r(1,a+b-1);return q(`${a} + ${b} = □ + ${c}. Vilket tal saknas?`,a+b-c,'Båda sidor ska ha samma värde.');},
    ()=>{const a=r(2,9),b=r(2,9);return choice(`Vad betyder likhetstecknet i ${a+b} = ${a} + ${b}?`,'Vänster och höger sida har samma värde.',['Svaret måste alltid stå till höger.','Man ska alltid addera alla talen.'],'Likhetstecknet beskriver ett samband mellan två värden.');},
    ()=>{const a=r(3,15),b=r(1,9),c=r(1,8);return q(`${a} + ${b} = ${a+b+c} − □. Vilket tal saknas?`,c,'Kontrollera värdet på båda sidor.');}
  ]);
  add('f-pattern monster',[
    ()=>{const start=r(1,12),step=r(2,6);return q(`Vilket tal kommer sedan? ${start}, ${start+step}, ${start+2*step}, □.`,start+3*step,'Fortsätt med samma ökning.');},
    ()=>{const step=r(2,5),start=r(4,9)*step;return q(`Fortsätt: ${start}, ${start-step}, ${start-2*step}, □.`,start-3*step,'Talföljden minskar med samma tal varje gång.');},
    ()=>{const start=r(1,10),step=r(2,6);return q(`Vilket tal saknas? ${start}, □, ${start+2*step}, ${start+3*step}.`,start+step,'Kontrollera steget mellan kända tal.');}
  ]);
  // Bråk: bilder, andelar och beräkningar. Omskrivning får kontrollera båda delarna.
  add('f-half brak-del-hel',[
    id=>{const d=id==='f-half'?pick([2,4]):r(3,10),n=r(1,d-1);return q('Hur stor andel av figuren är färgad? Svara med ett bråk.',n/d,'Täljaren anger färgade delar och nämnaren alla lika stora delar.','','fraction',fraction(d,n));},
    id=>{const d=id==='f-half'?pick([2,4]):r(3,10),n=r(1,d-1);return q(`En helhet har ${d} lika stora delar, varav ${n} är ${n===1?'färgad':'färgade'}. Vad är nämnaren i bråket för den färgade andelen?`,d,'Nämnaren beskriver hela indelningen, inte bara de färgade delarna.');},
    id=>{const d=id==='f-half'?4:r(3,10),n=r(1,d-1);return q(`Bråket ${n}/${d} beskriver en del av en helhet. Hur många lika stora delar är markerade?`,n,'Täljaren anger antalet valda delar.');}
  ]);
  add('f-fraction-count brak-del-antal brak',[
    id=>{const d=id==='f-fraction-count'?pick([2,3,4]):r(3,8),unit=r(2,12);return q(`Vad är 1/${d} av ${d*unit}?`,unit,'Dela helheten i lika stora delar.');},
    id=>{const d=id==='f-fraction-count'?pick([2,3,4]):r(3,8),n=id==='f-fraction-count'?1:r(2,d-1),unit=r(2,12);return q(`${n}/${d} av ${d*unit} pärlor är blå. Hur många pärlor är blå?`,n*unit,'Dela med nämnaren och multiplicera med täljaren.');},
    id=>{const d=id==='f-fraction-count'?pick([2,3,4]):r(3,8),unit=r(2,12);return q(`Du har ${d*unit} klossar och använder 1/${d} av dem. Hur många klossar använder du?`,unit,'En andel av ett antal fås genom att dela antalet.');}
  ]);
  add('f-fraction-line',[
    ()=>{const d=pick([2,3,4,5]),n=r(1,d-1);return q('Vilket tal står vid A på tallinjen? Svara med ett bråk.',n/d,'Räkna lika stora steg mellan noll och ett.','','fraction',{type:'numberline',parts:d,mark:n});},
    ()=>{const d=pick([2,3,4,5]),n=r(1,d-1);return q(`Mellan 0 och 1 finns ${d} lika stora steg. Vilket tal står vid steg ${n} efter 0? Svara med ett bråk.`,n/d,'Varje steg är en del av helheten.','','fraction');},
    ()=>choice('Vilket bråk ligger exakt mitt mellan 0 och 1?','1/2',['1/4','3/4'],'Mittpunkten delar sträckan i två lika delar.')
  ]);
  add('f-fraction-equal brak-likvardiga',[
    ()=>{const d=r(2,6),n=r(1,d-1),k=r(2,5);return q(`${n}/${d} = □/${d*k}. Vilken täljare saknas?`,n*k,'Multiplicera täljare och nämnare med samma faktor.');},
    ()=>{const d=r(2,6),n=r(1,d-1),k=r(2,5);return q(`${n}/${d} = ${n*k}/□. Vilken nämnare saknas?`,d*k,'Andelen ska vara oförändrad.');},
    ()=>{const d=r(3,7),n=r(1,d-1),k=r(2,4);return choice(`Vilket bråk är lika stort som ${n}/${d}?`,frac(n*k,d*k),[frac(n*k,d),frac(n,d*k)],'Både täljare och nämnare måste ändras med samma faktor.');}
  ]);
  add('brak-forlanga',[
    ()=>{const d=r(3,9),n=r(1,d-1),k=r(2,6);return q(`Förläng ${n}/${d} med ${k}. Vilken blir täljaren?`,n*k,`Multiplicera båda delarna med ${k}.`);},
    ()=>{const d=r(3,9),n=r(1,d-1),k=r(2,6);return q(`Förläng ${n}/${d} med ${k}. Vilken blir nämnaren?`,d*k,`Även nämnaren ska multipliceras med ${k}.`);},
    ()=>{const d=r(3,9),n=r(1,d-1),k=r(2,6);return choice(`Vilket bråk får du när ${n}/${d} förlängs med ${k}?`,frac(n*k,d*k),[frac(n*k,d),frac(n,d*k)],'Förlängning ändrar indelningen, men inte andelen.');}
  ]);
  add('brak-forkorta',[
    ()=>{const d=r(3,9),n=pick(Array.from({length:d-1},(_,i)=>i+1).filter(n=>gcd(n,d)===1)),k=r(2,6);return q(`Förkorta ${n*k}/${d*k} så långt det går. Vilken blir täljaren?`,n,'Dividera båda delarna med deras största gemensamma faktor.');},
    ()=>{const d=r(3,9),n=pick(Array.from({length:d-1},(_,i)=>i+1).filter(n=>gcd(n,d)===1)),k=r(2,6);return q(`Förkorta ${n*k}/${d*k} så långt det går. Vilken blir nämnaren?`,d,'Förenkla både täljaren och nämnaren.');},
    ()=>{const d=r(3,9),n=pick(Array.from({length:d-1},(_,i)=>i+1).filter(n=>gcd(n,d)===1)),k=r(2,6);return choice(`Vilket bråk är ${n*k}/${d*k} förkortat så långt det går?`,frac(n,d),[frac(n*k,d),frac(n,d*k)],'En gemensam faktor ska tas bort ur både täljare och nämnare.');}
  ]);
  add('brak-jamfora',[
    ()=>{const n=r(1,4),d=n+r(1,4),e=d+r(1,5);return q(`Vilket bråk är störst: ${shuffle([frac(n,d),frac(n,e)]).join(' eller ')}?`,n/d,'Med samma täljare ger mindre nämnare större andel.','','fraction');},
    ()=>{const d=r(4,10),n=r(1,d-2);return q(`Vilket bråk är minst: ${shuffle([frac(n,d),frac(n+1,d)]).join(' eller ')}?`,n/d,'Med samma nämnare är färre delar mindre.','','fraction');},
    ()=>{const pair=pick([[2,3,3,4],[3,5,2,3],[4,5,5,6],[1,2,2,5]]),[a,b,c,d]=pair;return q(`Vilket bråk är störst: ${shuffle([frac(a,b),frac(c,d)]).join(' eller ')}?`,Math.max(a/b,c/d),'Jämför genom gemensam nämnare eller motsvarande andelar.','','fraction');}
  ]);
  add('gemensam-namnare',[
    ()=>{const a=r(2,6),b=r(2,6);return choice(`Vilken nämnare kan användas för både 1/${a} och 1/${b}?`,String(a*b),[String(a*b+1),String(a*b-1)],'En gemensam nämnare måste vara delbar med båda nämnarna.');},
    ()=>{const a=r(2,6),b=r(2,6);return q(`Skriv 1/${a} och 1/${b} med den gemensamma nämnaren ${a*b}. Vilken täljare får det första bråket?`,b,'Förläng med den faktor som ger den angivna nämnaren.');},
    ()=>{const pair=pick([[3,4],[4,6],[5,6],[6,8]]),[a,b]=pair,D=a*b/gcd(a,b);return q(`Använd nämnaren ${D} för 1/${a} och 1/${b}. Vilken täljare får det andra bråket?`,D/b,'Ändra både täljaren och nämnaren med samma faktor.');}
  ]);
  function fractionCalculation(id,facet){
    const subtract=id.includes('sub'),same=!id.includes('olika');let a,b,c,d;
    if(same){b=r(4,12);d=b;a=r(1,b-1);c=r(1,b-1);}
    else {b=pick([2,3,4,5,6]);d=pick([3,4,5,6,8].filter(x=>x!==b));a=r(1,b-1);c=r(1,d-1);}
    if(subtract&&a/b<c/d){[a,c]=[c,a];[b,d]=[d,b];}
    const answer=subtract?a/b-c/d:a/b+c/d,op=subtract?'−':'+';
    const why=same?'Räkna antalet delar och behåll nämnaren.':'Skriv först bråken med samma nämnare och beräkna sedan täljarna.';
    if(facet===1&&same)return q(`Två delar är ${a}/${b} och ${c}/${d}. Vad blir ${subtract?'skillnaden':'summan'}? Svara med ett bråk.`,answer,why,'','fraction');
    if(facet===2&&same){const n=subtract?a-c:a+c;return q(`Beräkna ${a}/${b} ${op} ${c}/${d} utan att förkorta svaret. Vilken täljare får du?`,n,why);}
    return q(`Beräkna ${a}/${b} ${op} ${c}/${d}. Svara med ett bråk.`,answer,why,'','fraction');
  }
  add('f-fraction-add brak-add-lika brak-sub-lika brak-add-olika brak-sub-olika',[id=>fractionCalculation(id,0),id=>fractionCalculation(id,1),id=>fractionCalculation(id,2)]);
  add('blandad-form',[
    ()=>{const whole=r(1,5),d=r(2,8),n=r(1,d-1);return q(`Skriv ${whole} hela och ${n}/${d} på ett bråkstreck med nämnaren ${d}. Vilken blir täljaren?`,whole*d+n,'Varje helhet innehåller lika många delar som nämnaren anger.');},
    ()=>{const whole=r(1,5),d=r(2,8),n=r(1,d-1);return q(`Skriv ${whole*d+n}/${d} i blandad form. Hur många hela ingår?`,whole,'Dividera täljaren med nämnaren för att hitta hela delar.');},
    ()=>{const whole=r(1,5),d=r(2,8),n=r(1,d-1);return q(`Skriv ${whole*d+n}/${d} i blandad form med nämnaren ${d}. Vilken täljare får bråkdelen?`,n,'Resten efter de hela delarna är bråkdelens täljare.');}
  ]);
  add('brak-hela',[
    ()=>{const d=r(3,8),n=r(1,d-1),part=r(2,10);return q(`${n}/${d} av ett antal är ${n*part}. Hur stort är hela antalet?`,d*part,'Hitta först en del, sedan hela antalet delar.');},
    ()=>{const d=pick([2,3,4]),part=r(3,12);return q(`Du använder 1/${d} av ett snöre. Den använda delen är ${part} cm. Hur långt var hela snöret?`,d*part,'En del multiplicerad med antalet lika delar ger helheten.','cm');},
    ()=>{const d=pick([3,4,5]),part=r(3,12);return q(`Efter att 1/${d} av ett antal tagits bort återstår ${(d-1)*part}. Hur stort var antalet från början?`,d*part,'Det som är kvar motsvarar flera av helhetens lika stora delar.');}
  ]);
  // Decimaler, avrundning och procent. Värden och svar får variera åt båda hållen.
  add('f-decimal decimal-plats',[
    id=>{const places=id==='f-decimal'?pick([10,100]):pick([10,100,1000]),n=r(1,9);return q(`Skriv ${n}/${places} i decimalform.`,n/places,'Nämnaren anger decimalens platsvärde.','','decimal');},
    id=>{const places=id==='f-decimal'?pick([10,100]):pick([10,100,1000]),whole=r(1,9),digit=r(1,9);return q(`Vilket värde har siffran ${digit} efter decimaltecknet i ${f(whole+digit/places)}?`,digit/places,'Siffrans position bestämmer dess värde.','','decimal');},
    id=>{const places=id==='f-decimal'?10:pick([10,100,1000]),n=r(1,places-1);return q(`Skriv ${f(n/places)} som ett bråk med nämnaren ${places}. Vilken blir täljaren?`,n,'Decimalerna motsvarar delar med den angivna nämnaren.');}
  ]);
  add('f-decimal-compare sortera-tal',[
    ()=>{const whole=r(0,8),n=r(1,9);return q(`Vilket tal är störst: ${shuffle([f(whole+n/10),f(whole+n/100)]).join(' eller ')}?`,whole+n/10,'Jämför platsvärden från vänster.','','decimal');},
    ()=>{const whole=r(0,8),n=r(1,8);return q(`Vilket tal är minst: ${shuffle([f(whole+n/10),f(whole+(n+1)/10),f(whole+n/100)]).join(', ')}?`,whole+n/100,'Fler skrivna decimaler betyder inte automatiskt större tal.','','decimal');},
    ()=>{const a=r(1,8),n=r(1,9);return choice(`Hur förhåller sig ${f(a+n/10)} och ${f(a+n/10)}0 till varandra?`,'De är lika stora.',['Det första är större.','Det andra är större.'],'En nolla sist i decimaldelen ändrar inte värdet.');}
  ]);
  function decimalSum(id,facet){const simple=id==='f-decimal-add',scale=simple?10:100,a=r(1,simple?19:399),b=r(1,simple?19:199),sub=id==='decimal-subtraktion';const larger=Math.max(a,b),smaller=Math.min(a,b);return facet===1?q(`${f(a/scale)} ${sub?'−':'+'} □ = ${f((sub?a-b:a+b)/scale)}. Vilket tal saknas?`,b/scale,'Behåll samma platsvärden när du räknar.','','decimal'):q(`Beräkna ${f((sub?larger:a)/scale)} ${sub?'−':'+'} ${f((sub?smaller:b)/scale)}.`,(sub?larger-smaller:a+b)/scale,'Räkna med motsvarande platsvärden.','','decimal');}
  add('f-decimal-add decimal-addition decimal-subtraktion',[id=>decimalSum(id,0),id=>decimalSum(id,1),id=>decimalSum(id,2)]);
  add('f-round avrunda-heltal',[
    id=>{const step=id==='f-round'?10:pick([10,100,1000]),n=r(1,8)*step+r(1,step-1);return q(`Avrunda ${n} till närmaste ${step===10?'tiotal':step===100?'hundratal':'tusental'}.`,Math.round(n/step)*step,'Siffran efter avrundningsplatsen bestämmer riktningen.');},
    id=>{const step=id==='f-round'?10:pick([10,100]),n=r(2,8)*step+r(1,step-1);return q(`Ett antal uppskattas genom avrundning till närmaste ${step===10?'tiotal':'hundratal'}. Vilket avrundat värde får ${n}?`,Math.round(n/step)*step,'Välj den närmaste jämna tiotals- eller hundratalsgränsen.');},
    id=>{const step=id==='f-round'?10:pick([10,100,1000]),n=r(1,8)*step+step/2;return q(`Avrunda ${n} till närmaste ${step===10?'tiotal':step===100?'hundratal':'tusental'}.`,Math.round(n/step)*step,'Mitt emellan avrundas uppåt för dessa positiva tal.');}
  ]);
  add('f-percent procent-huvud',[
    ()=>{const pct=pick([10,25,50]),whole=r(2,12)*20;return q(`Vad är ${pct} % av ${whole}?`,whole*pct/100,'Använd en tiondel, en fjärdedel eller hälften.');},
    ()=>{const pct=pick([10,25,50]),whole=r(2,12)*20;return q(`${pct} % av ${whole} elever väljer en aktivitet. Hur många elever är det?`,whole*pct/100,'Andelen av det hela ger antalet.');},
    ()=>{const pct=pick([10,25,50]),whole=r(2,12)*20;return q(`Du använder ${pct} % av ${whole} kr. Hur många kronor använder du?`,whole*pct/100,'Räkna den använda delen, inte pengarna som återstår.','kr');}
  ]);
  add('procent-begrepp',[
    ()=>{const n=pick([5,10,20,25,40,50,75,90]);return q(`Skriv ${n} % i decimalform.`,n/100,'Procent betyder hundradelar.','','decimal');},
    ()=>{const n=pick([5,10,20,25,40,50,75,90]);return q(`Skriv ${f(n/100)} i procentform.`,n,'Multiplicera decimalformen med hundra.','%');},
    ()=>{const [n,d]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[1,10]]);return q(`Hur många procent är ${n}/${d}?`,n/d*100,'En andel kan uttryckas som bråk eller som hundradelar.','%');}
  ]);
  // Statistik: osorterade värden, olika frekvenser och verkliga diagram.
  add('f-readtable avlasa',[
    ()=>{const labels=shuffle(['Ali','Kim','Sam']),values=shuffle([r(1,5),r(6,12),r(13,20)]),i=r(0,2);return q(`Hur många böcker har ${labels[i]} läst enligt tabellen?`,values[i],'Läs av rätt rad.','böcker','integer',table(labels,values));},
    ()=>{const values=shuffle([r(1,5),r(6,12),r(13,20)]);return q('Vilket är det största antalet i tabellen?',Math.max(...values),'Jämför de redovisade antalen.','','integer',table(['Måndag','Tisdag','Onsdag'],values));},
    ()=>{const values=shuffle([r(1,5),r(6,12),r(13,20)]);return q('Vilket är det minsta antalet i tabellen?',Math.min(...values),'Jämför observationerna.','','integer',table(['Ali','Kim','Sam'],values));}
  ]);
  function frequencies(){const value=r(1,9),count=r(2,5),other=r(1,Math.min(3,count-1));return {value,count,list:shuffle([...Array(count).fill(value),...Array(other).fill(value+1)])};}
  add('f-frequency tabell frekvenstabell',[
    ()=>{const {value,count,list}=frequencies();return q(`Värdena är ${list.join(', ')}. Hur många gånger förekommer ${value}?`,count,'Frekvens är antal förekomster.');},
    ()=>{const labels=['Äpple','Päron','Banan'],values=[r(1,7),r(1,7),r(1,7)];return q('Hur många svar finns totalt i frekvenstabellen?',values.reduce((a,b)=>a+b,0),'Summera frekvenserna.','','integer',table(labels,values));},
    ()=>{const a=r(1,7),b=r(1,7),c=r(1,7);return q(`Totalt svarade ${a+b+c} elever. ${a} valde äpple och ${b} päron. Resten valde banan. Hur många valde banan?`,c,'Totalen minus de kända frekvenserna ger det saknade antalet.');}
  ]);
  add('f-mean medel',[
    ()=>{const a=r(1,15),b=r(1,15),c=r(1,15);return q(`Vad är medelvärdet av ${shuffle([a,b,c]).join(', ')}?`,(a+b+c)/3,'Summera alla värden och dela med antalet.');},
    ()=>{const n=r(3,6),mean=r(2,12);return q(`${n} elever har tillsammans ${n*mean} pennor. Hur många har de i genomsnitt?`,mean,'Fördela totalen lika mellan alla.');},
    id=>{const a=r(1,15),b=r(1,15),c=r(1,15),d=r(1,15);return q(`Vad är medelvärdet av ${shuffle([a,b,c,d]).join(', ')}?`,(a+b+c+d)/4,'Antalet observationer är lika viktigt som summan.');}
  ]);
  add('f-median median',[
    ()=>{const list=shuffle([r(1,4),r(5,9),r(10,14),r(15,19),r(20,24)]),sorted=[...list].sort((a,b)=>a-b);return q(`Vad är medianen av ${list.join(', ')}?`,sorted[2],'Sortera och välj värdet i mitten.');},
    ()=>{const list=shuffle([r(1,4),r(5,9),r(10,14),r(15,19)]),sorted=[...list].sort((a,b)=>a-b);return q(`Vad är medianen av ${list.join(', ')}?`,(sorted[1]+sorted[2])/2,'Vid jämnt antal är medianen medelvärdet av de två mittersta.');},
    id=>{if(id==='f-median'){const {value,list}=frequencies();return q(`Vad är typvärdet för ${list.join(', ')}?`,list.filter(x=>x===value).length>list.filter(x=>x===value+1).length?value:value+1,'Typvärdet är det vanligaste värdet.');}const list=shuffle([r(1,4),r(5,9),r(10,14),r(15,19),r(40,80)]),sorted=[...list].sort((a,b)=>a-b);return q(`Vad är medianen av ${list.join(', ')}?`,sorted[2],'Ett stort yttervärde ändrar inte regeln för mittenvärdet.');}
  ]);
  add('typvarde',[
    ()=>{const value=r(1,8),count=r(3,5),list=shuffle([...Array(count).fill(value),value+1,value+2]);return q(`Vad är typvärdet för ${list.join(', ')}?`,value,'Välj värdet som förekommer flest gånger.');},
    ()=>{const value=r(1,8),labels=[String(value),String(value+1),String(value+2)],values=shuffle([1,2,4]);return q('Vad är typvärdet i frekvenstabellen?',Number(labels[values.indexOf(4)]),'Välj värdet med störst frekvens, inte själva frekvensen.','','integer',table(labels,values));},
    ()=>{const a=r(1,8),b=a+1;return choice(`Vilket påstående stämmer för ${shuffle([a,a,b,b,b+1]).join(', ')}?`,`${a} och ${b} är båda typvärden.`,[`${a} är det enda typvärdet.`,`${b+1} är typvärdet.`],'Flera värden kan dela den största frekvensen.');}
  ]);
  add('f-chance',[
    ()=>choice('En påse innehåller bara röda kulor. Du drar en kula. Hur är händelsen ”kulan är röd”?','Säker',['Omöjlig','Möjlig men inte säker'],'Alla möjliga utfall är röda.'),
    ()=>choice('En vanlig tärning har sidorna 1–6. Du kastar den. Hur är händelsen ”resultatet är 7”?','Omöjlig',['Säker','Möjlig men inte säker'],'Det finns inget möjligt utfall som är 7.'),
    ()=>{const color=pick(['röd','blå']);return choice(`En påse innehåller både röda och blå kulor. Du drar en kula. Hur är händelsen ”kulan är ${color}”?`,'Möjlig men inte säker',['Säker','Omöjlig'],'Både den efterfrågade färgen och andra färger kan dras.');}
  ]);
  add('f-probability gynnsamma-utfall sannolikhet',[
    ()=>{const a=r(1,6),b=r(1,6);return q(`En påse har ${a} röda och ${b} blå kulor. Alla kulor har samma chans att dras. Vad är sannolikheten för röd?`,a/(a+b),'Gynnsamma utfall delat med alla lika sannolika utfall.','','fraction');},
    ()=>{const sides=pick([4,6,8]),win=r(1,sides-1);return q(`Ett lyckohjul har ${sides} lika stora fält. ${win} fält ger vinst. Vad är sannolikheten för vinst?`,win/sides,'Varje lika stort fält har samma sannolikhet.','','fraction');},
    ()=>{const threshold=r(2,5);return q(`En vanlig rättvis tärning kastas. Vad är sannolikheten för ett tal mindre än ${threshold}?`,(threshold-1)/6,'Räkna gynnsamma sidor och dividera med sex.','','fraction');}
  ]);
  M.reviewedTools={r,pick,shuffle,q,choice,table,fraction,bank,add,arithmetic,gcd};
  M.unreviewedGenerate=previous;
})();
