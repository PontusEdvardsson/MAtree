/* Egna delmoment och frågor för tidigare grunder. Kursplanen anger områden;
   den här finfördelningen och beroendena är pedagogiska förslag. */
(() => {
  'use strict';
  const M = window.MATREE, previousGenerate = M.generate;
  // Behåll kursplaceringen innan den tidigare inlärningen markeras i Grunder.
  const courseGrades = new Map(M.nodes.map(n=>[n.id,n.grade]));
  const q = (prompt, answer, explanation, unit = '') => ({ prompt, answer, explanation, unit });
  const rows = [
    ['f-count', 'Antal och talordning', 'tal', 1, [], 'Räkna antal och hitta talet före och efter.'],
    ['f-compare', 'Jämföra hela tal', 'tal', 1, ['f-count'], 'Jämföra storleken på två hela tal.'],
    ['f-line', 'Hela tal på tallinjen', 'tal', 1, ['f-count'], 'Följa tallinjens jämna steg.'],
    ['f-split', 'Dela upp små tal', 'tal', 1, ['f-count'], 'Se ett antal som två delar.'],
    ['f-ten', 'Tiokompisar', 'tal', 1, ['f-split'], 'Hitta två tal som tillsammans blir tio.'],
    ['f-place', 'Ental, tiotal och hundratal', 'tal', 1, ['f-count'], 'Bygga och dela upp tal med platsvärden.'],
    ['f-add-small', 'Addition inom 20', 'tal', 1, ['f-split', 'f-ten'], 'Addera små tal, även över tio.'],
    ['f-sub-small', 'Subtraktion inom 20', 'tal', 1, ['f-add-small'], 'Ta bort och beräkna skillnaden mellan små tal.'],
    ['f-add-place', 'Addition med växling', 'tal', 1, ['f-add-small', 'f-place'], 'Addera tvåsiffriga tal och växla tio ental.'],
    ['f-sub-place', 'Subtraktion med växling', 'tal', 1, ['f-sub-small', 'f-place'], 'Subtrahera tvåsiffriga tal och växla ett tiotal.'],
    ['f-double', 'Dubbelt och hälften', 'samband', 1, ['f-add-small'], 'Dubblera ett antal och dela ett jämnt antal i två.'],
    ['f-groups', 'Multiplikation som lika grupper', 'tal', 1, ['f-add-small'], 'Koppla upprepad addition till lika stora grupper.'],
    ['f-table', 'Multiplikationstabeller', 'tal', 1, ['f-groups'], 'Beräkna produkter i tabellerna till 10, även multiplikation med 0 och 1.'],
    ['f-sharing', 'Division som delning och gruppering', 'tal', 1, ['f-groups'], 'Dela lika och hitta antalet grupper.'],
    ['f-inverse', 'Samband mellan gånger och delat', 'tal', 1, ['f-table', 'f-sharing'], 'Använda en produkt för att hitta en kvot.'],
    ['f-remainder', 'Division med rest', 'tal', 2, ['f-inverse'], 'Skilja hela grupper från det som blir över.'],
    ['f-equality', 'Likhet och saknade tal', 'algebra', 1, ['f-add-small'], 'Se likhetstecknet som samma värde på båda sidor.'],
    ['f-pattern', 'Enkla talföljder', 'algebra', 1, ['f-add-small'], 'Upptäcka och fortsätta ett återkommande talsteg.'],
    ['f-half', 'Halvor och fjärdedelar', 'brak', 1, ['f-sharing'], 'Tolka lika stora delar av en helhet.'],
    ['f-fraction-count', 'Enkla bråk av ett antal', 'brak', 2, ['f-half', 'f-sharing'], 'Hitta en halv, en tredjedel eller en fjärdedel av ett antal.'],
    ['f-fraction-line', 'Enkla bråk på tallinjen', 'brak', 2, ['f-half'], 'Koppla bråk till jämna steg mellan noll och ett.'],
    ['f-fraction-equal', 'Likvärdiga bråk med små tal', 'brak', 2, ['f-half', 'f-table'], 'Se att olika indelningar kan visa samma andel.'],
    ['f-fraction-add', 'Addera bråk med samma nämnare', 'brak', 2, ['f-half', 'f-add-small'], 'Addera lika stora delar utan att ändra delarnas storlek.'],
    ['f-decimal', 'Tiondelar och hundradelar', 'tal', 2, ['f-place', 'f-half'], 'Tolka platsvärden till höger om decimaltecknet.'],
    ['f-decimal-compare', 'Jämföra enkla decimaltal', 'tal', 2, ['f-decimal', 'f-compare'], 'Jämföra decimaler efter platsvärde.'],
    ['f-decimal-add', 'Enkel addition med decimaler', 'tal', 2, ['f-decimal', 'f-add-small'], 'Addera tiondelar och tolka resultatet.'],
    ['f-percent', '50, 25 och 10 procent', 'procent', 2, ['f-fraction-count', 'f-decimal'], 'Koppla vanliga procenttal till enkla delar av ett antal.'],
    ['f-round', 'Avrunda och uppskatta heltal', 'tal', 2, ['f-place', 'f-compare'], 'Avrunda till tiotal för att bedöma storleksordning.'],
    ['f-order', 'Räkneordning med små tal', 'algebra', 2, ['f-add-small', 'f-table'], 'Räkna multiplikation före addition.'],
    ['f-equation', 'Enkla ekvationer med saknat tal', 'algebra', 2, ['f-equality', 'f-sub-small'], 'Hitta ett okänt tal i en enkel likhet.'],
    ['f-negative', 'Negativa tal och temperatur', 'tal', 2, ['f-line', 'f-sub-small'], 'Jämföra temperaturer över och under noll.'],
    ['f-shapes', 'Tvådimensionella former', 'geometri', 1, [], 'Känna igen hörn och sidor i enkla figurer.'],
    ['f-bodies', 'Enkla tredimensionella kroppar', 'geometri', 2, ['f-shapes'], 'Känna igen sidoytor och hörn i en kub.'],
    ['f-length', 'Centimeter och meter', 'geometri', 1, ['f-place'], 'Koppla en meter till hundra centimeter.'],
    ['f-mass', 'Gram och kilogram', 'geometri', 2, ['f-place', 'f-table'], 'Omvandla mellan gram och kilogram.'],
    ['f-volume', 'Deciliter och liter', 'geometri', 2, ['f-place'], 'Omvandla mellan deciliter och liter.'],
    ['f-clock', 'Klockslag och tidsåtgång', 'samband', 1, ['f-add-small'], 'Räkna minuter inom en timme och till nästa heltimme.'],
    ['f-time', 'Timmar och minuter', 'samband', 2, ['f-clock', 'f-table'], 'Omvandla hela och halva timmar till minuter.'],
    ['f-perimeter', 'Omkrets av rektanglar', 'geometri', 2, ['f-shapes', 'f-add-small', 'f-length'], 'Summera längderna runt en rektangel.'],
    ['f-area', 'Area som antal rutor', 'geometri', 2, ['f-shapes', 'f-table'], 'Räkna rutor i ett rektangulärt rutnät.'],
    ['f-angle', 'Räta och raka vinklar', 'geometri', 2, ['f-shapes'], 'Koppla en kvarts och en halv vridning till grader.'],
    ['f-scale', 'Enkel förstoring och förminskning', 'geometri', 2, ['f-double', 'f-length'], 'Ändra längder med faktorn två.'],
    ['f-symmetry', 'Spegelsymmetri', 'geometri', 1, ['f-shapes'], 'Identifiera symmetrilinjer i enkla figurer.'],
    ['f-readtable', 'Avläsa en enkel tabell', 'statistik', 1, ['f-compare'], 'Hitta ett angivet värde i en liten tabell.'],
    ['f-frequency', 'Antal och frekvens', 'statistik', 2, ['f-readtable', 'f-count'], 'Räkna hur ofta ett värde förekommer.'],
    ['f-mean', 'Medelvärde med små tal', 'statistik', 2, ['f-add-small', 'f-sharing'], 'Summera och fördela lika.'],
    ['f-median', 'Median och typvärde med små tal', 'statistik', 2, ['f-compare', 'f-frequency'], 'Hitta mittenvärdet och det vanligaste värdet.'],
    ['f-chance', 'Omöjligt, möjligt och säkert', 'sannolikhet', 1, ['f-count'], 'Skilja säkra och omöjliga utfall i konkreta situationer.'],
    ['f-probability', 'Enkla sannolikheter', 'sannolikhet', 2, ['f-half', 'f-chance'], 'Räkna gynnsamma utfall av lika möjliga utfall.'],
    ['f-combinations', 'Enkla kombinationer', 'sannolikhet', 2, ['f-groups'], 'Räkna val av två oberoende egenskaper.'],
    ['f-coordinate', 'Koordinater i första kvadranten', 'samband', 2, ['f-line'], 'Skilja den första koordinaten från den andra.'],
    ['f-proportion', 'Proportionella samband med små tal', 'samband', 2, ['f-table', 'f-inverse'], 'Använda ett konstant pris eller antal per styck.'],
    ['f-word-add', 'Textproblem med ett räknesätt', 'problem', 1, ['f-add-small', 'f-sub-small'], 'Välja addition eller subtraktion från en enkel situation.'],
    ['f-word-mult', 'Textproblem med grupper', 'problem', 2, ['f-table', 'f-sharing'], 'Välja multiplikation eller division i en situation med lika grupper.'],
    ['f-reasonable', 'Bedöma rimlighet med små tal', 'problem', 2, ['f-round', 'f-table'], 'Använda ett enkelt överslag och kontrollera storleksordningen.']
  ];
  const bank = {
    'f-count': (a,b,v) => v === 0 ? q(`Vilket tal kommer direkt efter ${a}?`, a+1, 'Räkna ett steg framåt.') : v === 1 ? q(`Vilket tal kommer direkt före ${a+5}?`, a+4, 'Räkna ett steg bakåt.') : q(`Hur många prickar ser du?\n\n${'● '.repeat(a+b).trim()}`, a+b, 'Räkna varje prick en gång.'),
    'f-compare': (a,b,v) => q(`Vilket tal är ${v===1?'minst':'störst'}: ${a} eller ${a+b}?`, v===1?a:a+b, 'Jämför hur stora antalen är.'),
    'f-line': (a,b,v) => q(`Tallinjen har lika stora steg: ${a}, ${a+(v+1)}, □, ${a+3*(v+1)}. Vilket tal saknas?`, a+2*(v+1), 'Fortsätt med samma steg.'),
    'f-split': (a,b,v) => q(`Talet ${a+b} delas upp i ${a} och ett annat tal. Vilket är det andra talet?`, b, 'Delarna ska tillsammans bli hela talet.'),
    'f-ten': a => q(`${a} + □ = 10. Vilket tal saknas?`, 10-a, 'De två delarna ska bli tio.'),
    'f-place': (a,b,v) => v===0?q(`Vilket tal består av ${a} tiotal och ${b} ental?`, a*10+b, 'Tiotal är grupper om tio.'):v===1?q(`Hur många tiotal finns i ${a*10+b}?`,a,'Tiotalssiffran anger antalet hela tiotal.'):q(`Vilket värde har siffran ${a} i talet ${a*100+b*10+2}?`,a*100,'Siffran står på hundratalsplatsen.'),
    'f-add-small': (a,b) => q(`Vad är ${a} + ${b}?`, a+b, 'Lägg ihop antalen.'),
    'f-sub-small': (a,b) => q(`Vad är ${a+b} − ${b}?`, a, 'Ta bort den ena delen från helheten.'),
    'f-add-place': (a,b) => q(`Vad är ${a*10+8} + ${b*10+7}?`, (a+b)*10+15, '15 ental är ett tiotal och fem ental.'),
    'f-sub-place': (a,b) => q(`Vad är ${a*10+12} − ${b+3}?`, a*10+9-b, 'Växla ett tiotal till tio ental vid behov.'),
    'f-double': (a,b,v) => v===1?q(`Vad är hälften av ${2*a}?`,a,'Dela i två lika stora delar.'):q(`Vad är dubbelt så mycket som ${a}?`,2*a,'Lägg ihop två lika stora antal.'),
    'f-groups': (a,b) => q(`Det finns ${a} grupper med ${b} stenar i varje. Hur många stenar finns totalt?`,a*b,'Lägg ihop lika stora grupper.'),
    'f-table': (a,b) => q(`Vad är ${a} × ${b}?`,a*b,'Multiplicera antalet grupper med antalet i varje.'),
    'f-sharing': (a,b,v) => v===1?q(`${a*b} klossar läggs i grupper med ${b} i varje. Hur många grupper blir det?`,a,'Räkna hur många hela grupper som ryms.'):q(`${a*b} klossar delas lika mellan ${a} personer. Hur många får varje person?`,b,'Dela i lika stora delar.'),
    'f-inverse': (a,b,v) => v===1?q(`${a} × ${b} = ${a*b}. Vad är ${a*b} ÷ ${b}?`,a,'Division och multiplikation hör ihop.'):q(`${a} × ${b} = ${a*b}. Vad är ${a*b} ÷ ${a}?`,b,'Division och multiplikation hör ihop.'),
    'f-remainder': (a,b) => q(`${a*b+1} klossar läggs i grupper med ${b} i varje. Hur många klossar blir över?`,1,'Resten är det som inte räcker till en hel grupp.'),
    'f-equality': (a,b,v) => q(`${a} + ${b} = □ + ${v+1}. Vilket tal ska stå i rutan?`,a+b-v-1,'Båda sidor ska ha samma värde.'),
    'f-pattern': (a,b) => q(`Fortsätt talföljden: ${a}, ${a+b}, ${a+2*b}, □.`,a+3*b,'Skillnaden mellan talen är densamma.'),
    'f-half': (a,b,v) => v===0?q('En hel delas i två lika stora delar. Vad är nämnaren i bråket för en del?',2,'En halv är en av två lika stora delar.'):v===1?q('En hel delas i fyra lika stora delar. Vad är nämnaren i bråket för en del?',4,'En fjärdedel är en av fyra lika stora delar.'):q('Hur många fjärdedelar är en halv?',2,'Två fjärdedelar täcker samma andel som en halv.'),
    'f-fraction-count': (a,b,v) => {const d=[2,3,4][v];return q(`Vad är 1/${d} av ${a*d}?`,a,`Dela antalet i ${d} lika delar.`);},
    'f-fraction-line': (a,b,v) => {const d=[2,4,3][v];return q(`Från 0 till 1 är tallinjen uppdelad i ${d} lika stora steg. Vilket tal står vid första steget efter 0? Svara med ett bråk.`,1/d,`Första steget är 1/${d}.`);},
    'f-fraction-equal': (a,b,v) => {const d=[2,3,4][v];return q(`1/${d} = □/${d*2}. Vilken täljare saknas?`,2,'Dubbla både täljare och nämnare för att behålla samma andel.');},
    'f-fraction-add': (a,b,v) => {const d=[4,5,8][v];return q(`Vad är 1/${d} + 2/${d}? Svara med ett bråk.`,3/d,'Delarna är lika stora. Lägg ihop antalet delar.');},
    'f-decimal': (a,b,v) => {const d=v===1?100:10;return q(`Skriv ${a}/${d} som ett decimaltal.`,a/d,'Nämnaren visar om det är tiondelar eller hundradelar.');},
    'f-decimal-compare': (a,b) => q(`Vilket tal är störst: ${M.fmt(a/10)} eller ${M.fmt(a/100)}?`,a/10,'Jämför platsvärdena från vänster.'),
    'f-decimal-add': (a,b) => q(`Vad är ${M.fmt(a/10)} + ${M.fmt(b/10)}?`,(a+b)/10,'Addera antalet tiondelar.'),
    'f-percent': (a,b,v) => {const d=[2,4,10][v],p=[50,25,10][v];return q(`Vad är ${p} % av ${a*d}?`,a,`${p} % är 1/${d} av det hela.`);},
    'f-round': (a,b) => q(`Avrunda ${a*10+b} till närmaste tiotal.`,Math.round((a*10+b)/10)*10,'Entalssiffran 5–9 ger avrundning uppåt.'),
    'f-order': (a,b) => q(`Vad är ${a} + ${b} × 2?`,a+2*b,'Multiplikation räknas före addition.'),
    'f-equation': (a,b,v) => v===1?q(`x − ${b} = ${a}. Vilket värde har x?`,a+b,'Addera samma tal på båda sidor.'):q(`x + ${b} = ${a+b}. Vilket värde har x?`,a,'Subtrahera samma tal på båda sidor.'),
    'f-negative': (a,b,v) => v===1?q(`Vilken temperatur är högst: −${a} °C eller ${b} °C? Svara med ett tal.`,b,'Positiva tal är större än negativa.'):q(`Det är ${a} °C. Temperaturen sjunker ${a+b} grader. Vad blir temperaturen?`,-b,'Fortsätt nedåt förbi noll.'),
    'f-shapes': (a,b,v) => q(`Hur många hörn har en ${['triangel','rektangel','femhörning'][v]}?`,[3,4,5][v],'Antalet hörn motsvarar antalet sidor.'),
    'f-bodies': (a,b,v) => q(`Hur många ${['sidoytor','hörn','kanter'][v]} har en kub?`,[6,8,12][v],'En kub har sex kvadratiska sidoytor, åtta hörn och tolv kanter.'),
    'f-length': (a,b,v) => v===1?q(`Hur många meter är ${a*100} centimeter?`,a,'Hundra centimeter är en meter.','m'):q(`Hur många centimeter är ${a} meter?`,a*100,'Varje meter är hundra centimeter.','cm'),
    'f-mass': (a,b,v) => v===1?q(`Hur många kilogram är ${a*1000} gram?`,a,'Tusen gram är ett kilogram.','kg'):q(`Hur många gram är ${a} kilogram?`,a*1000,'Varje kilogram är tusen gram.','g'),
    'f-volume': (a,b,v) => v===1?q(`Hur många liter är ${a*10} deciliter?`,a,'Tio deciliter är en liter.','l'):q(`Hur många deciliter är ${a} liter?`,a*10,'Varje liter är tio deciliter.','dl'),
    'f-clock': (a,b,v) => v===1?q('Hur många minuter är det från 10:45 till 11:00?',15,'Det är en kvart till nästa timme.','min'):q(`Hur många minuter är det från 10:${String(a).padStart(2,'0')} till 10:${String(a+b).padStart(2,'0')}?`,b,'Beräkna skillnaden mellan minutangivelserna.','min'),
    'f-time': (a,b,v) => v===1?q('Hur många minuter är en och en halv timme?',90,'En timme är 60 minuter och en halv är 30.','min'):q(`Hur många minuter är ${a} timmar?`,a*60,'Multiplicera antalet timmar med 60.','min'),
    'f-perimeter': (a,b) => q(`En rektangel är ${a} cm lång och ${b} cm bred. Vad är omkretsen?`,2*(a+b),'Summera alla fyra sidornas längder.','cm'),
    'f-area': (a,b) => q(`Ett rektangulärt rutnät har ${a} rader med ${b} rutor i varje rad. Hur många rutor täcker ytan?`,a*b,'Multiplicera rader med rutor per rad.','rutor'),
    'f-angle': (a,b,v) => q(`Hur många grader är ${v===1?'en rak vinkel':'en rät vinkel'}?`,v===1?180:90,'En kvarts varv är 90° och ett halvt varv är 180°.','°'),
    'f-scale': (a,b,v) => v===1?q(`En ${a*2} cm lång sträcka förminskas till hälften. Hur lång blir den?`,a,'Dela längden med två.','cm'):q(`En ${a} cm lång sträcka förstoras till dubbla längden. Hur lång blir den?`,a*2,'Multiplicera längden med två.','cm'),
    'f-symmetry': (a,b,v) => q(`Hur många symmetrilinjer har ${['en kvadrat','en rektangel som inte är en kvadrat','en liksidig triangel'][v]}?`,[4,2,3][v],'En symmetrilinje delar figuren i två delar som är varandras spegelbilder.'),
    'f-readtable': (a,b,v) => q(`Tabell över antal böcker:\nAli: ${a}\nBo: ${b}\nKim: ${a+b}\n\nHur många böcker har ${['Ali','Bo','Kim'][v]}?`,[a,b,a+b][v],'Läs av värdet på rätt rad.'),
    'f-frequency': (a,b,v) => q(`Värdena är ${a}, ${b+10}, ${a}, ${a}, ${b+10}. Hur många gånger förekommer ${v===1?b+10:a}?`,v===1?2:3,'Räkna varje förekomst av det angivna värdet.'),
    'f-mean': (a,b) => q(`Vad är medelvärdet av ${a}, ${a+2} och ${a+4}?`,a+2,'Summera de tre talen och dela med tre.'),
    'f-median': (a,b,v) => v===1?q(`Vad är typvärdet för ${a}, ${a+1}, ${a}, ${a+2}, ${a}?`,a,'Typvärdet är värdet som förekommer flest gånger.'):q(`Vad är medianen för ${a+4}, ${a}, ${a+2}?`,a+2,'Sortera talen och välj det i mitten.'),
    'f-chance': (a,b,v) => v===0?q('Alla kulor i en påse är röda. Hur många olika färger finns i påsen?',1,'Alla kulor har samma färg.'):v===1?q('En vanlig tärning har sidorna 1–6. Hur många sidor visar 7?',0,'Sju är ett omöjligt utfall.'):q('En vanlig tärning har sidorna 1–6. Hur många sidor visar ett tal mindre än 7?',6,'Alla sidor uppfyller villkoret; händelsen är säker.'),
    'f-probability': (a,b,v) => {const d=[2,4,3][v];return q(`I en påse finns 1 röd och ${d-1} blå kulor. Alla kulor har samma chans att dras. Vad är sannolikheten för röd? Svara med ett bråk.`,1/d,'Antal röda dividerat med totalt antal kulor.');},
    'f-combinations': (a,b) => q(`Du kan välja mellan ${a} tröjor och ${b} byxor. Hur många olika kombinationer finns?`,a*b,'Varje tröja kan kombineras med varje par byxor.'),
    'f-coordinate': (a,b,v) => q(`En punkt har koordinaterna (${a}, ${b}). Vad är ${v===1?'y':'x'}-koordinaten?`,v===1?b:a,'Koordinater skrivs i ordningen (x, y).'),
    'f-proportion': (a,b,v) => v===1?q(`${a} likadana pennor kostar ${a*b} kr. Vad kostar en penna?`,b,'Dela totalpriset med antalet pennor.','kr'):q(`En penna kostar ${b} kr. Vad kostar ${a} likadana pennor?`,a*b,'Multiplicera styckepriset med antalet.','kr'),
    'f-word-add': (a,b,v) => v===1?q(`Du har ${a+b} kort och ger bort ${b}. Hur många har du kvar?`,a,'Ta bort antalet som ges bort.'):q(`Du har ${a} kort och får ${b} till. Hur många har du nu?`,a+b,'Lägg ihop antalen.'),
    'f-word-mult': (a,b,v) => v===1?q(`${a*b} bullar delas lika på ${a} fat. Hur många ligger på varje fat?`,b,'Dela totalen lika mellan faten.'):q(`På varje fat ligger ${b} bullar. Det finns ${a} fat. Hur många bullar finns totalt?`,a*b,'Multiplicera antal fat med antal bullar på varje.'),
    'f-reasonable': (a,b) => q(`En penna kostar ${a*10+1} kr. Du köper ${b} pennor. Gör ett överslag genom att först avrunda pennans pris till närmaste tiotal. Vad blir överslaget?`,a*10*b,'Avrunda styckepriset och multiplicera med antalet.','kr')
  };
  for (const [id,title,category,foundationBand,deps,description] of rows) {
    M.nodes.push({id,title,category,grade:0,foundationBand,level:'core',stage:foundationBand,overview:false,deps,description,
      source:{kind:'curriculum',book:'lgr22',grade:foundationBand===1?3:6,chapter:`Centralt innehåll åk ${foundationBand===1?'1–3':'4–6'}`,url:'https://syllabuswebb.skolverket.se/compulsorycw/jsp/subject.htm?subjectCode=GRGRMAT01&tos=gr'},npSource:null});
  }
  const band2 = new Set('tal-siffra sortera-tal decimal-plats decimal-addition decimal-subtraktion tiomultiplikation tiodivision avrunda-heltal avrunda-decimal overslag brak-del-hel brak-del-antal blandad-form brak-likvardiga brak-forlanga brak-forkorta brak-jamfora brak-add-lika brak-sub-lika brak-decimal variabel prioritering ekvation-add ekvation-mult monster langd langd-enheter dimensioner vinkeltyper triangel-typer fyrhorningar symmetri omkrets area-rektangel skala-bild skala-verklighet proportionalitet tabell frekvenstabell stapel-stolp linjediagram medel median typvarde procent-begrepp'.split(' '));
  'brak decimal procent negativa negativ-tallinje skala sannolikhet sannolikhet-skala gynnsamma-utfall spegelsymmetri delbarhet'.split(' ').forEach(id=>band2.add(id));
  M.nodes.forEach(n => { if(n.grade===0)n.foundationBand ||= 1; if(band2.has(n.id)){n.grade=0;n.foundationBand=2;} });
  const links = {positionssystem:['f-place'],addition:['f-add-place','f-sub-place'],multiplikation:['f-table','f-inverse'],likhet:['f-equality'],former:['f-shapes'],avlasa:['f-readtable'],monster:['f-pattern'],langd:['f-length'], 'brak-del-hel':['f-half'], 'decimal-plats':['f-decimal'], 'procent-begrepp':['brak-del-hel','decimal-plats','f-percent'],procent:['procent-begrepp','f-percent'],proportionalitet:['f-proportion','multiplikation']};
  const byId = new Map(M.nodes.map(n=>[n.id,n]));
  M.nodes.forEach(n=> { if(links[n.id])n.deps=links[n.id]; delete n.depth; n.dependencyReasons=Object.fromEntries(n.deps.map(id=>[id,n.dependencyReasons?.[id]||byId.get(id).description])); });
  const depth = n => n.depth ?? (n.depth=n.deps.length?1+Math.max(...n.deps.map(id=>depth(byId.get(id)))):0);
  M.nodes.forEach(depth);
  // En färdighet har ett ID och ett resultat, men kan återkomma i flera kurser.
  // Årskursvyer utgår från kursplacering, bokhänvisning och utvalda repetitioner.
  const recurring = {
    8: 'positionssystem addition multiplikation decimal-plats tiomultiplikation tiodivision decimal-addition decimal-subtraktion brak-del-hel brak-del-antal brak-likvardiga brak-forlanga brak-forkorta gemensam-namnare brak-add-olika brak-sub-olika variabel likhet ekvation-add ekvation-mult area-rektangel langd-enheter procent-begrepp procent-delen procent-andelen medel median typvarde',
    9: 'positionssystem addition multiplikation decimal-plats tiomultiplikation tiodivision decimal-multiplikation decimal-division brak-del-hel brak-del-antal brak-likvardiga brak-forlanga brak-forkorta gemensam-namnare brak-add-olika brak-sub-olika variabel likhet ekvation-add ekvation-mult ekvation-tva-steg langd-enheter area-rektangel area-triangel procent-begrepp procent-delen procent-andelen proportionalitet medel median typvarde'
  };
  M.nodes.forEach(n=> {
    n.learnedAt=n.grade===0?(n.foundationBand===1?'1-3':'4-6'):String(n.grade);
    const views=new Set([n.learnedAt]),courseGrade=courseGrades.get(n.id);
    if(courseGrade>=7)views.add(String(courseGrade));
    if(n.source.kind!=='curriculum'&&n.source.grade>=7)views.add(String(n.source.grade));
    n.yearViews=[...views];
  });
  for(const [grade,ids]of Object.entries(recurring))for(const id of ids.split(' ')){
    const node=byId.get(id);
    if(!node)throw Error(`Saknad färdighet i årskursvyn: ${id}`);
    if(!node.yearViews.includes(grade))node.yearViews.push(grade);
  }
  M.matchesYearView=(node,view)=>view==='all'||view==='0'&&node.yearViews.some(v=>v==='1-3'||v==='4-6')||node.yearViews.includes(String(view));
  M.yearViewLabel=view=>`Åk ${String(view).replace('-','–')}`;
  M.foundationIds = new Set(rows.map(r=>r[0]));
  M.generate = (id, variant) => bank[id] ? bank[id](2+Math.floor(Math.random()*8),2+Math.floor(Math.random()*8),variant%3) : previousGenerate(id,variant%3);
})();
