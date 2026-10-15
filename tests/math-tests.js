/* Facit för ett oberoende valt parameterfall: a = b = c = 2. */
window.verifyExpandedMath = () => {
  const expected = {
    'tal-siffra':4,'sortera-tal':2.2,'decimal-plats':[.2,.02,.002],'decimal-addition':2.22,'decimal-subtraktion':2.18,
    'tiomultiplikation':[20.2,202,2020],'tiodivision':[2.2,.22,.022],'avrunda-heltal':[20,200,2000],'avrunda-decimal':[2,2.2,2.23],'overslag':4000,
    'primfaktorer':[3,2,5],'decimal-multiplikation':.04,'decimal-division':2,'negativ-tallinje':[-2,-2,4],'negativ-subtraktion':[4,0,4],'negativ-multiplikation':[-4,4,-4],'negativ-division':[-2,2,-2],
    'stora-tal':[2000000,2000000000,2000000],'prefix-stora':[3,6,9],'prefix-sma':[-3,-6,-9],'potens-begrepp':[4,8,16],'tiopotens':[1000,10000,100000],'negativ-exponent':[.1,.01,.001],
    'grundpotens-stora':[4,5,6],'grundpotens-sma':[-2,-3,-4],'potens-multiplikation':4,'potens-division':0,'grundpotens-rakning':[4,5,6],'kvadrattal':4,'kvadratrot':2,'romerska':[14,26,40],'andra-talbaser':[5,6,9],'rot-rakning':4,
    'brak-del-hel':.5,'brak-del-antal':4,'blandad-form':5,'brak-likvardiga':2,'brak-forlanga':4,'brak-forkorta':3,'brak-jamfora':.5,'gemensam-namnare':2,'brak-add-lika':.8,'brak-sub-lika':.4,
    'brak-add-olika':.75,'brak-sub-olika':.25,'brak-decimal':[.5,.4,.25],'brak-heltal-mult':1,'brak-multiplikation':1/3,'brak-division':4,'brak-hela':6,'brak-mgn':2,'brak-korsforkorta':2/3,
    'prioritering':6,'parentes-tal':8,'forenkla-termer':4,'distributiva':4,'minus-parentes':2,'tva-parenteser':4,'ekvation-add':2,'ekvation-mult':[2,4,2],'ekvation-tva-steg':2,'ekvation-bada':2,'ekvation-parentes':2,'ekvation-text':2,'monster-regel':14,
    'kvadreringsregel':[4,-4,4],'konjugatregel':-4,'faktorisera-uttryck':2,'algebra-brak':[2,2,0],'ekvation-namnare':8,'andragrad':[2,-2,2],
    'langd-enheter':[22,220,2200],'triangel-typer':[80,60,80],'triangel-vinkelsumma':160,'sidovinklar':[160,20,160],'parallella-vinklar':20,'area-rektangel':4,'area-parallellogram':4,'area-triangel':2,'area-sammansatt':12,
    'area-enheter':[200,2,200],'hektar':[20000,200,20000],'cirkel-begrepp':[8,2,8],'cirkel-omkrets':[12.56,6.28,12.56],'cirkel-area':12.56,'cirkelbage':[3.14,6.28,12.56/6],'cirkelsektor':[3.14,6.28,12.56/6],
    'kroppar':[6,12,8],'volym-ratblock':8,'volym-enheter':[200,200,2],'begransningsyta':24,'volym-prisma':4,'volym-cylinder':25.12,'cylinder-yta':[25.12,50.24,25.12],'volym-pyramid':8,'volym-kon':25.12,'volym-klot':100.48/3,
    'pythagoras-hyp':10,'pythagoras-katet':8,'skala-verklighet':4,'skala-bild':2,'skala-bestamma':200,'areaskala':4,'volymskala':8,'likformighet':4,'spegelsymmetri':[4,2,3],'rotationssymmetri':[90,120,180],'spegla-koordinat':[-2,2,-2],'manghorning-vinkel':540,'rymiddiagonal':14,'likformighet-avancerad':4,'klot-yta':50.24,
    'koordinater':[-2,2,-2],'samband-tabell':10,'graf-avlasning':4,'enhetspris':20,'forhallande':2,'recept':100,'hastighet':[40,20,2],'tid-enheter':[.25,.75,1.5],'funktionsvarde':[-2,2,6],'startvarde':[2,-2,2],'lutning':[2,-2,2],'linje-ekvation':2,'jamfora-samband':2,'aritmetisk':10,'geometrisk-talfoljd':[8,16,32],'ekvationssystem':2,'ekvationssystem-add':2,
    'procent-begrepp':[.2,20,.2],'procent-huvud':[20,50,100],'procent-delen':20,'procent-andelen':20,'procent-hela':200,'procent-rabatt':180,'procent-okning':220,'procent-forandring':10,'forandringsfaktor':[1.1,.9,1.1],'procent-jamfora':20,'procent-over100':60,'procent-baklanges':200,'upprepad-forandring':[192,180,192],'upprepad-samma':[242,266.2,292.82],'ranta':40,'ranta-tid':[10,20,30],'procentenheter':2,'promille':[.002,.000002,.002],'index':120,
    'typvarde':2,'variationsbredd':5,'frekvenstabell':6,'relativ-frekvens':.2,'stapel-stolp':4,'linjediagram':2,'cirkeldiagram':20,'diagram-vinkel':[90,180,36],'viktat-medel':3,'histogram':4,'kvartiler':[5,13,5],'ladagram':[6,10,6],'vilseledande':10,'venndiagram':6,
    'gynnsamma-utfall':.5,'komplement':.8,'forvantat-antal':20,'trad-oberoende':.25,'trad-beroende':1/6,'flera-vagar':[.5,3/8,.25],'minst-en':[.75,.875,.9375],'experiment-sannolikhet':.2,'kombinationer':8,'ordna-objekt':[6,24,120],'tva-tarningar':[1/9,1/6,1/9],'oordnade-val':6,'tre-drag':1,
    'problem-bild':6,'problem-baklanges':2,'problem-tabell':2,'problem-graf':2,'problem-ekvation':2,'problem-flersteg':4,'kod-variabel':8,'kod-loop':6,'kalkylblad':2,'simulering':20,'densitet':20,'material':4.4,'moms':200,'amortering':200,'trigonometri':[6,8,6]
  };
  const random = Math.random;
  let checks=0;
  try {
    Math.random=()=>0;
    for (const [id,answers] of Object.entries(expected)) for(let variant=0;variant<3;variant++) {
      const q=MATREE.unreviewedGenerate(id,variant),answer=Array.isArray(answers)?answers[variant]:answers;
      if (Math.abs(q.answer-answer)>Math.max(1e-10,Math.abs(answer)*1e-12)) throw Error(`Independent mathematics check failed: ${id}, variant ${variant}: ${q.answer} vs ${answer}`);
      checks++;
    }
    for (const id of MATREE.addedIds) for(let variant=0;variant<3;variant++) {
      const q=MATREE.unreviewedGenerate(id,variant);
      if (q.prompt.includes('alternativets nummer')) {
        const choices=q.prompt.split('\n').filter(line=>/^\d+\. /.test(line)).map(line=>line.replace(/^\d+\. /,''));
        if(new Set(choices).size!==choices.length || !Number.isInteger(q.answer) || q.answer<1 || q.answer>choices.length) throw Error(`Invalid answer choices: ${id}`);
      } else if (!Object.hasOwn(expected,id) && id!=='delbarhet') throw Error(`Missing independent numeric example: ${id}`);
    }
    return `${checks} independent numeric checks across new templates passed; choices are distinct and indexed correctly`;
  } finally { Math.random=random; }
};
