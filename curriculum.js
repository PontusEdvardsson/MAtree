/* Pedagogiskt utkast. Stadierna är ungefärliga och kan justeras av lärare. */
(() => {
  'use strict';
  const categories = [
    { id: 'tal', name: 'Tal & räkning', color: '#738f5e', bg: '#edf3e5', symbol: '÷' },
    { id: 'algebra', name: 'Algebra', color: '#9382b3', bg: '#f0ecf7', symbol: 'x' },
    { id: 'geometri', name: 'Geometri', color: '#bb9761', bg: '#faf1e3', symbol: '△' },
    { id: 'statistik', name: 'Statistik & sannolikhet', color: '#68959d', bg: '#e9f2f3', symbol: '▥' }
  ];
  const rows = [
    ['positionssystem', 'Positionssystemet', 'tal', 0, [], 'Förstå hur en siffras plats bestämmer dess värde.'],
    ['addition', 'Addition & subtraktion', 'tal', 1, ['positionssystem'], 'Addera, subtrahera och hitta tal som saknas.'],
    ['multiplikation', 'Multiplikation & division', 'tal', 2, ['addition'], 'Se lika stora grupper och sambandet mellan gånger och delat.'],
    ['brak', 'Bråk', 'tal', 3, ['multiplikation'], 'Beskriv delar av en helhet och beräkna en andel.'],
    ['decimal', 'Decimaltal', 'tal', 4, ['brak', 'positionssystem'], 'Koppla bråk till decimalform och räkna med decimaltal.'],
    ['procent', 'Procent', 'tal', 5, ['decimal'], 'Växla mellan procent och decimalform och beräkna procent av ett tal.'],
    ['monster', 'Talmönster', 'algebra', 0, [], 'Upptäck hur talföljder växer och fortsätt ett mönster.'],
    ['likhet', 'Likhetstecknet', 'algebra', 1, ['addition'], 'Förstå att båda sidor om likhetstecknet har samma värde.'],
    ['uttryck', 'Algebraiska uttryck', 'algebra', 2, ['likhet', 'multiplikation'], 'Sätt in ett värde i ett uttryck med en variabel.'],
    ['ekvation', 'Ekvationer', 'algebra', 3, ['uttryck'], 'Hitta det okända talet genom att hålla båda sidor lika.'],
    ['negativa', 'Negativa tal', 'algebra', 4, ['addition'], 'Räkna och resonera med tal på båda sidor om noll.'],
    ['funktion', 'Linjära samband', 'algebra', 5, ['ekvation', 'negativa', 'monster'], 'Koppla en regel till värden och förändringar i ett linjärt samband.'],
    ['former', 'Former & hörn', 'geometri', 0, [], 'Känn igen grundläggande geometriska former och deras egenskaper.'],
    ['langd', 'Längd & enheter', 'geometri', 1, ['positionssystem'], 'Växla mellan meter och centimeter och jämför längder.'],
    ['omkrets', 'Omkrets', 'geometri', 2, ['former', 'langd', 'addition'], 'Beräkna längden runt en figur och hitta en okänd sida.'],
    ['area', 'Area', 'geometri', 3, ['omkrets', 'multiplikation'], 'Beräkna rektanglars och trianglars area.'],
    ['vinklar', 'Vinklar', 'geometri', 4, ['former', 'addition'], 'Använd räta vinklar, raka vinklar och triangelns vinkelsumma.'],
    ['skala', 'Skala', 'geometri', 5, ['langd', 'multiplikation', 'brak'], 'Översätt mellan en bilds mått och verkliga mått.'],
    ['avlasa', 'Läsa av data', 'statistik', 0, [], 'Läs en liten datamängd och jämför observationer.'],
    ['tabell', 'Tabeller & frekvens', 'statistik', 1, ['avlasa', 'addition'], 'Räkna observationer och tolka hur ofta något förekommer.'],
    ['medel', 'Medelvärde', 'statistik', 2, ['tabell', 'multiplikation'], 'Fördela en summa jämnt och beräkna ett medelvärde.'],
    ['median', 'Median', 'statistik', 3, ['avlasa', 'medel'], 'Sortera observationer och hitta värdet i mitten.'],
    ['sannolikhet', 'Sannolikhet', 'statistik', 4, ['brak'], 'Räkna gynnsamma och möjliga utfall i enkla slumpförsök.'],
    ['forandring', 'Procentuell förändring', 'statistik', 5, ['procent', 'medel'], 'Jämför värden över tid och beräkna hur många procent något förändras.']
  ];
  const nodes = rows.map(([id, title, category, col, deps, description]) => ({ id, title, category, col, deps, description, stage: col < 2 ? 1 : col < 4 ? 2 : 3 }));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const fmt = value => { const digits=value!==0&&Math.abs(value)<.000001?12:6; return Number(value.toFixed(digits)).toLocaleString('sv-SE', { maximumFractionDigits: digits }); };
  const question = (prompt, answer, explanation, unit = '') => ({ prompt, answer, explanation, unit });
  function generate(id, variant) {
    const a = rand(2, 9), b = rand(2, 9), c = rand(2, 6);
    switch (id) {
      case 'positionssystem': {
        const n = a * 100 + b * 10 + c;
        if (variant === 0) return question(`Vilket värde har siffran ${a} i talet ${n}?`, a * 100, `${a} står på hundratalsplatsen och är därför värd ${a} × 100 = ${a * 100}.`);
        if (variant === 1) return question(`Vilket tal består av ${a} hundratal, ${b} tiotal och ${c} ental?`, n, `${a * 100} + ${b * 10} + ${c} = ${n}.`);
        return question(`Hur många tiotal är ${a * 10}?`, a, `Ett tiotal är 10. ${a * 10} ÷ 10 = ${a}.`);
      }
      case 'addition':
        if (variant === 0) return question(`Vad är ${a * 10 + b} + ${c * 10 + a}?`, a * 11 + b + c * 10, 'Addera tiotalen för sig och entalen för sig. Växla tio ental till ett tiotal om det behövs.');
        if (variant === 1) return question(`Vad är ${a * 10 + b} − ${a + b}?`, a * 9, `Du kan dela upp subtraktionen: ${a * 10 + b} − ${b} − ${a} = ${a * 9}.`);
        return question(`Vilket tal saknas? ${a * 3} + □ = ${a * 3 + b * 4}`, b * 4, `Det saknade talet är skillnaden: ${a * 3 + b * 4} − ${a * 3} = ${b * 4}.`);
      case 'multiplikation':
        if (variant === 0) return question(`Vad är ${a} × ${b}?`, a * b, `${a} grupper med ${b} i varje ger ${a * b}.`);
        if (variant === 1) return question(`${a * b} pennor delas lika mellan ${a} elever. Hur många får varje elev?`, b, `${a * b} ÷ ${a} = ${b}, eftersom ${a} × ${b} = ${a * b}.`, 'pennor');
        return question(`Vilket tal saknas? □ × ${b} = ${a * b}`, a, `Division är motsatsen till multiplikation: ${a * b} ÷ ${b} = ${a}.`);
      case 'brak':
        if (variant === 0) return question(`En helhet delas i ${b} lika stora delar. Vad är nämnaren i bråket för en del?`, b, `Nämnaren visar antalet lika stora delar i helheten: ${b}.`);
        if (variant === 1) return question(`Vad är 1/${b} av ${a * b}?`, a, `Dela helheten i ${b} lika stora delar: ${a * b} ÷ ${b} = ${a}.`);
        return question(`Vad är 3/4 av ${a * 4}?`, a * 3, `En fjärdedel är ${a * 4} ÷ 4 = ${a}. Tre fjärdedelar är ${a} × 3 = ${a * 3}.`);
      case 'decimal':
        if (variant === 0) return question(`Skriv ${a}/10 i decimalform.`, a / 10, `${a} tiondelar skrivs ${fmt(a / 10)}.`);
        if (variant === 1) return question(`Vad är ${fmt(a / 10)} + ${fmt(b / 10)}?`, (a + b) / 10, `${a} tiondelar + ${b} tiondelar = ${a + b} tiondelar = ${fmt((a + b) / 10)}.`);
        return question(`Vad är ${fmt(a + b / 10)} × 10?`, a * 10 + b, `När talet multipliceras med 10 blir varje siffras värde tio gånger så stort: ${a * 10 + b}.`);
      case 'procent':
        if (variant === 0) return question(`Skriv ${a * 10} % i decimalform.`, a / 10, `Procent betyder hundradelar: ${a * 10} ÷ 100 = ${fmt(a / 10)}.`);
        if (variant === 1) return question(`Vad är 25 % av ${a * 40}?`, a * 10, `25 % är en fjärdedel: ${a * 40} ÷ 4 = ${a * 10}.`);
        return question(`${a} av ${a * 5} elever cyklar. Hur många procent cyklar?`, 20, `${a} ÷ ${a * 5} = 0,2 = 20 %.`, '%');
      case 'monster': {
        const start = a + variant, step = b;
        if (variant === 1) return question(`Hur mycket ökar talföljden för varje steg? ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}`, step, `Skillnaden mellan två tal som följer på varandra är ${step}.`);
        return question(`Vilket tal kommer härnäst? ${start}, ${start + step}, ${start + step * 2}, …`, start + step * 3, `Lägg till ${step} varje gång. Nästa tal är ${start + step * 2} + ${step} = ${start + step * 3}.`);
      }
      case 'likhet':
        if (variant === 0) return question(`Vilket tal ska stå i rutan? ${a} + ${b} = □ + ${a - 1}`, b + 1, `Båda sidor ska vara ${a + b}. Därför behövs ${b + 1} i rutan.`);
        if (variant === 1) return question(`Vilket tal saknas? ${a + b} = ${a} + □`, b, `Likhetstecknet betyder att sidorna har samma värde, oavsett vilken sida summan står på.`);
        return question(`Vilket tal saknas? ${a} + ${b} = ${a + b + c} − □`, c, `Vänster sida är ${a + b}. Subtrahera ${c} från ${a + b + c} för att få samma värde.`);
      case 'uttryck':
        if (variant === 0) return question(`Beräkna 3x + ${b} när x = ${a}.`, 3 * a + b, `Sätt in ${a} i stället för x: 3 × ${a} + ${b} = ${3 * a + b}.`);
        if (variant === 1) return question(`En biljett kostar ${a * 10} kr. Uttrycket ${a * 10}n beskriver kostnaden för n biljetter. Vad kostar ${b} biljetter?`, a * 10 * b, `Sätt n = ${b}: ${a * 10} × ${b} = ${a * 10 * b}.`, 'kr');
        return question(`Beräkna 2(x + ${b}) när x = ${a}.`, 2 * (a + b), `Räkna parentesen först: 2 × (${a} + ${b}) = ${2 * (a + b)}.`);
      case 'ekvation':
        if (variant === 0) return question(`Lös ekvationen: x + ${b} = ${a + b}`, a, `Subtrahera ${b} från båda sidor: x = ${a + b} − ${b} = ${a}.`);
        if (variant === 1) return question(`Lös ekvationen: ${b}x = ${a * b}`, a, `Dela båda sidor med ${b}: x = ${a}.`);
        return question(`Lös ekvationen: 2x + ${b} = ${a * 2 + b}`, a, `Subtrahera ${b} från båda sidor och dela sedan med 2: x = ${a}.`);
      case 'negativa':
        if (variant === 0) return question(`Vad är −${a} + ${b}?`, b - a, `Starta på −${a} och gå ${b} steg åt höger på tallinjen. Då hamnar du på ${b - a}.`);
        if (variant === 1) return question(`Temperaturen är −${a} °C och sjunker ${b} grader. Vad blir temperaturen?`, -a - b, `När temperaturen sjunker går du åt vänster på tallinjen: −${a} − ${b} = −${a + b}.`, '°C');
        return question(`Vad är ${a} − (−${b})?`, a + b, `Att subtrahera ett negativt tal ger ${a} + ${b} = ${a + b}.`);
      case 'funktion':
        if (variant === 0) return question(`Sambandet är y = ${c}x + ${b}. Vad är y när x = ${a}?`, c * a + b, `Sätt in x = ${a}: ${c} × ${a} + ${b} = ${c * a + b}.`);
        if (variant === 1) return question(`En taxiresa kostar y = ${a * 10}x + ${b * 10} kr, där x är antal kilometer. Vad kostar resan innan någon sträcka har körts (x = 0)?`, b * 10, `När x = 0 är den rörliga kostnaden 0. Startavgiften är ${b * 10} kr.`, 'kr');
        return question(`I sambandet y = ${c}x + ${b}, hur mycket ökar y när x ökar med 1?`, c, `Koefficienten framför x, alltså ${c}, visar hur mycket y ökar per steg i x.`);
      case 'former':
        if (variant === 0) return question('Hur många hörn har en triangel?', 3, 'En triangel har tre sidor och tre hörn.');
        if (variant === 1) return question('Hur många sidor har en rektangel?', 4, 'En rektangel har fyra sidor. Motstående sidor är lika långa.');
        return question('Hur många räta vinklar har en kvadrat?', 4, 'En kvadrat har fyra lika långa sidor och fyra räta vinklar.');
      case 'langd':
        if (variant === 0) return question(`Hur många centimeter är ${a} meter?`, a * 100, `1 meter = 100 centimeter. ${a} × 100 = ${a * 100}.`, 'cm');
        if (variant === 1) return question(`Hur många meter är ${a * 100} centimeter?`, a, `Dela antalet centimeter med 100: ${a * 100} ÷ 100 = ${a}.`, 'm');
        return question(`Ett snöre är 1 meter. Du klipper av ${a * 10} cm. Hur många centimeter återstår?`, 100 - a * 10, `1 m = 100 cm. Då återstår 100 − ${a * 10} = ${100 - a * 10} cm.`, 'cm');
      case 'omkrets':
        if (variant === 0) return question(`En rektangel är ${a} cm lång och ${b} cm bred. Vad är omkretsen?`, 2 * (a + b), `Addera alla sidor: ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}.`, 'cm');
        if (variant === 1) return question(`En kvadrat har sidan ${a} cm. Vad är omkretsen?`, a * 4, `Fyra lika långa sidor: 4 × ${a} = ${a * 4}.`, 'cm');
        return question(`En kvadrat har omkretsen ${a * 4} cm. Hur lång är en sida?`, a, `Dela omkretsen med fyra: ${a * 4} ÷ 4 = ${a}.`, 'cm');
      case 'area':
        if (variant === 0) return question(`En rektangel är ${a} cm lång och ${b} cm bred. Vad är arean?`, a * b, `Area = längd × bredd = ${a} × ${b} = ${a * b}.`, 'cm²');
        if (variant === 1) return question(`En triangel har basen ${a * 2} cm och höjden ${b} cm. Vad är arean?`, a * b, `Triangelns area = bas × höjd ÷ 2 = ${a * 2} × ${b} ÷ 2 = ${a * b}.`, 'cm²');
        return question(`En rektangel har arean ${a * b} cm² och bredden ${b} cm. Hur lång är den?`, a, `Längd = area ÷ bredd = ${a * b} ÷ ${b} = ${a}.`, 'cm');
      case 'vinklar':
        if (variant === 0) { const angle = Math.min(a, 8) * 10; return question(`En rät vinkel delas i två. Den ena delen är ${angle}°. Hur stor är den andra?`, 90 - angle, `En rät vinkel är 90°. Den andra delen är 90° − ${angle}° = ${90 - angle}°.`, '°'); }
        if (variant === 1) return question(`Två vinklar ligger tillsammans längs en rak linje. Den ena är ${a * 10}°. Hur stor är den andra?`, 180 - a * 10, `En rak vinkel är 180°. Därför är den andra ${180 - a * 10}°.`, '°');
        return question(`En triangel har två vinklar som är ${a * 10}° och ${c * 10}°. Hur stor är den tredje?`, 180 - a * 10 - c * 10, `Triangelns vinkelsumma är 180°. Subtrahera de kända vinklarna: 180 − ${a * 10} − ${c * 10} = ${180 - a * 10 - c * 10}.`, '°');
      case 'skala':
        if (variant === 0) return question(`En ritning är i skala 1:100. En vägg är ${a} cm på ritningen. Hur lång är den i verkligheten, i meter?`, a, `${a} × 100 = ${a * 100} cm = ${a} m.`, 'm');
        if (variant === 1) return question(`En insekt är ${a} mm lång. Den avbildas i skala 3:1. Hur lång är bilden?`, a * 3, `Skala 3:1 är en förstoring. Bilden är tre gånger så lång: ${a * 3} mm.`, 'mm');
        return question(`I skala 1:100 ska en ${a} meter lång vägg ritas. Hur många centimeter blir det på ritningen?`, a, `${a} m = ${a * 100} cm. Dela med 100: ${a} cm på ritningen.`, 'cm');
      case 'avlasa':
        if (variant === 0) return question(`Antal lästa böcker: Alex ${a}, Kim ${a + b}, Sam ${a + 1}. Hur många böcker läste Kim?`, a + b, `Läs värdet vid Kim: ${a + b}.`, 'böcker');
        if (variant === 1) return question(`Antal cyklar: måndag ${a}, tisdag ${a + b}, onsdag ${a + c + b}. Vilket är det största antalet?`, a + b + c, `Jämför de tre talen. ${a + b + c} är störst.`, 'cyklar');
        return question(`Antal besökare: lördag ${a * 10}, söndag ${a * 10 + b}. Hur många fler kom på söndagen?`, b, `Ta skillnaden: ${a * 10 + b} − ${a * 10} = ${b}.`, 'besökare');
      case 'tabell':
        if (variant === 0) return question(`En enkät gav svaren: ja, nej, ja, ja, nej. Hur stor är frekvensen för ”ja”?`, 3, 'Frekvens betyder hur många gånger svaret förekommer. ”Ja” finns tre gånger.');
        if (variant === 1) return question(`Favoritfrukt: äpple ${a} elever, päron ${b} elever, banan ${c} elever. Alla valde en frukt. Hur många svarade?`, a + b + c, `Summera frekvenserna: ${a} + ${b} + ${c} = ${a + b + c}.`, 'elever');
        return question(`Av ${a + b + c} elever valde ${a} äpple och ${b} päron. Resten valde banan. Hur många valde banan?`, c, `Subtrahera de kända frekvenserna: ${a + b + c} − ${a} − ${b} = ${c}.`, 'elever');
      case 'medel':
        if (variant === 0) return question(`Vad är medelvärdet av ${a}, ${a + 2} och ${a + 4}?`, a + 2, `Summera och dela med antalet: (${a} + ${a + 2} + ${a + 4}) ÷ 3 = ${a + 2}.`);
        if (variant === 1) return question(`Fyra elever har tillsammans ${a * 4} pennor. Hur många pennor har de i genomsnitt?`, a, `Genomsnitt är medelvärde: ${a * 4} ÷ 4 = ${a}.`, 'pennor');
        return question(`Två tal har medelvärdet ${a + b}. Det ena är ${a}. Vilket är det andra?`, a + 2 * b, `Summan måste vara 2 × ${a + b} = ${2 * (a + b)}. Det andra talet är ${2 * (a + b)} − ${a} = ${a + 2 * b}.`);
      case 'median':
        if (variant === 0) return question(`Vad är medianen av ${a + 4}, ${a}, ${a + 2}?`, a + 2, `Sortera: ${a}, ${a + 2}, ${a + 4}. Talet i mitten är ${a + 2}.`);
        if (variant === 1) return question(`Vad är medianen av ${a}, ${a + 2}, ${a + 4}, ${a + 6}?`, a + 3, `Vid jämnt antal tar du medelvärdet av de två mittersta: (${a + 2} + ${a + 4}) ÷ 2 = ${a + 3}.`);
        return question(`Vad är medianen av ${a}, ${a + 1}, ${a + 2}, ${a + 3}, 100?`, a + 2, `Medianen är det mittersta värdet, ${a + 2}. Det höga värdet 100 ändrar inte vilket tal som ligger i mitten.`);
      case 'sannolikhet':
        if (variant === 0) return question('En vanlig sexsidig tärning kastas. Hur många utfall är jämna tal?', 3, 'De jämna utfallen är 2, 4 och 6. Det ger tre gynnsamma utfall.');
        if (variant === 1) return question(`I en påse finns ${a} röda och ${a} blå kulor. Du drar en kula slumpmässigt. Skriv sannolikheten för röd i decimalform.`, 0.5, `${a} röda av ${a * 2} totalt: ${a}/${a * 2} = 1/2 = 0,5.`);
        return question('En vanlig tärning kastas. Skriv sannolikheten för ett tal större än 4 som bråk eller decimaltal.', 1 / 3, 'Två gynnsamma utfall (5 och 6) av sex möjliga: 2/6 = 1/3.');
      case 'forandring':
        if (variant === 0) return question(`Ett pris ökar från ${a * 100} kr till ${a * 120} kr. Hur många procent ökar det?`, 20, `Ökningen är ${a * 20} kr. Dividera med ursprungspriset: ${a * 20} ÷ ${a * 100} × 100 = 20 %.`, '%');
        if (variant === 1) return question(`En tröja kostar ${a * 100} kr. Priset sänks med 30 %. Vad blir det nya priset?`, a * 70, `70 % av priset återstår: 0,7 × ${a * 100} = ${a * 70}.`, 'kr');
        return question('Ett pris höjs först med 10 % och sänks sedan med 10 %. Priset var från början 100 kr. Vad blir slutpriset?', 99, 'Efter höjningen: 100 × 1,1 = 110 kr. Efter sänkningen: 110 × 0,9 = 99 kr.', 'kr');
      default: throw new Error(`Frågemall saknas: ${id}`);
    }
  }
  function parseAnswer(input) {
    const value = String(input).trim().replace(/\u2212/g, '-').replace(',', '.');
    const number = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
    if (new RegExp(`^${number}$`).test(value)) return Number(value);
    const fraction = value.match(new RegExp(`^(${number})\\s*/\\s*(${number})$`));
    if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
    return NaN;
  }
  window.MATREE = { categories, nodes, generate, parseAnswer, fmt };
})();
