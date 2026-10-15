/* Egna färdighetsbeskrivningar utifrån Matte Direkt 7–9 v3. Inga bokuppgifter återges. */
(() => {
  'use strict';
  const old = window.MATREE;
  const books = {
    '7tal': [7, 'MD 7 kap 1 tal_ocr.pdf', 6, 'Tal'],
    '7geo': [7, 'MD 7 kap 2 geometri_ocr.pdf', 54, 'Geometri'],
    '7alg': [7, 'MD 7 kap 3 algebra_ocr.pdf', 106, 'Algebra'],
    '7brak': [7, 'MD 7 kap 4 bråk_ocr.pdf', 150, 'Bråk'],
    '7pro': [7, 'MD 7 kap 5 procent_ocr.pdf', 190, 'Procent'],
    '7stat': [7, 'MD 7 kap 6 statistik_ocr.pdf', 228, 'Statistik'],
    '8tal': [8, 'MD 8 kap 1 Tal_ocr.pdf', 6, 'Tal'],
    '8geo': [8, 'MD 8 kap 2 Geometri_ocr.pdf', 54, 'Geometri'],
    '8alg': [8, 'MD 8 kap 3 Algebra_ocr.pdf', 98, 'Algebra'],
    '8sam': [8, 'MD 8 kap 4 Samband_ocr.pdf', 136, 'Samband'],
    '8pro': [8, 'MD 8 kap 5 Procent_ocr.pdf', 172, 'Procent'],
    '8sann': [8, 'MD 8 kap 6 Sannolikhet_ocr.pdf', 208, 'Sannolikhet'],
    '8problem': [8, 'MD 8 kap 7 Problemlösning och repetition_ocr.pdf', 250, 'Problemlösning'],
    '9tal': [9, 'MD9 kap 1 Tal_ocr.pdf', 6, 'Tal'],
    '9geo': [9, 'MD9 kap 2 Geometri_ocr.pdf', 52, 'Geometri'],
    '9sam': [9, 'MD9 kap 3 Samband och funktioner_ocr.pdf', 96, 'Samband och funktioner'],
    '9pro': [9, 'MD9 kap 4 Procent och statistik_ocr.pdf', 142, 'Procent och statistik'],
    np: [9, 'MD9 kap 5.1 Sluttampen_ocr.pdf', 178, 'Genrepet · inför NP'],
    styva: [9, 'MD9 kap 5.2 Styva linan_ocr.pdf', 242, 'Styva linan'],
    gym: [9, 'MD9 kap 6 Inför gymnasiet_ocr.pdf', 270, 'Inför gymnasiet'],
    '9problem': [9, 'MD9 kap 7 Problemlösning och repetition_ocr.pdf', 286, 'Problemlösning']
  };
  const categories = [
    ['tal','Tal & räkning','#738f5e','#edf3e5','÷'],
    ['brak','Bråk & andelar','#638d83','#e7f2ed','½'],
    ['algebra','Algebra','#9382b3','#f0ecf7','x'],
    ['geometri','Geometri & mätning','#bb9761','#faf1e3','△'],
    ['samband','Samband & funktioner','#6b87b0','#edf1f9','ƒ'],
    ['procent','Procent','#b78c65','#f9eee3','%'],
    ['statistik','Statistik','#68959d','#e9f2f3','▥'],
    ['sannolikhet','Sannolikhet','#ab8098','#f5eaf0','⚄'],
    ['problem','Problemlösning & verktyg','#938b5c','#f2f0e4','⌘']
  ].map(([id,name,color,bg,symbol]) => ({id,name,color,bg,symbol}));
  function source(ref) {
    const [id, pageText] = ref.split(':');
    const [grade, file, start, chapter] = books[id];
    const page = Number(pageText);
    return { book: id, grade, file, chapter, page, printed: start + page - 1,
      url: `${grade}/${encodeURIComponent(`Matte Direkt ${grade} v3`)}/${encodeURIComponent(file)}#page=${page}` };
  }
  // id | titel | område | årskurs (0 = tidigare grund) | nivå | källa:PDF-sida | Genrepet:PDF-sida | förkunskaper | beskrivning
  const originalMeta = `
positionssystem|tal|0|7tal:5|4|
addition|tal|0|7tal:6|5|positionssystem
multiplikation|tal|0|7tal:6|5|addition
brak|brak|7|7brak:3|7|brak-del-hel,brak-del-antal
decimal|tal|7|7tal:11|7|decimal-plats,decimal-addition,tiomultiplikation
procent|procent|7|7pro:11|47|procent-begrepp,procent-delen,procent-andelen
monster|algebra|7|7alg:15|40|addition
likhet|algebra|0|7alg:9|35|addition
uttryck|algebra|7|7alg:4|32|variabel,prioritering
ekvation|algebra|7|7alg:11|35|ekvation-add,ekvation-mult
negativa|tal|8|8tal:18|14|negativ-tallinje
funktion|samband|9|9sam:9|45|funktionsvarde,lutning,startvarde
former|geometri|0|7geo:6|19|
langd|geometri|7|7geo:4|20|positionssystem
omkrets|geometri|7|7geo:11|24|former,langd,addition
area|geometri|7|7geo:13|24|area-rektangel,area-triangel
vinklar|geometri|7|7geo:7|21|vinkeltyper,triangel-vinkelsumma
skala|geometri|9|9geo:9|27|skala-bild,skala-verklighet
avlasa|statistik|0|7stat:3|53|
tabell|statistik|7|7stat:3|53|avlasa,addition
medel|statistik|7|7stat:5|52|tabell,multiplikation
median|statistik|7|7stat:6|52|sortera-tal,medel
sannolikhet|sannolikhet|8|8sann:3|56|sannolikhet-skala,gynnsamma-utfall
forandring|procent|8|8pro:5|48|procent-forandring,forandringsfaktor
`.trim().split('\n');
  const meta = new Map(originalMeta.map(line => { const [id,category,grade,ref,np,deps] = line.split('|'); return [id, {category,grade:Number(grade),source:source(ref),np:Number(np),deps:deps?deps.split(','):[],level:'core',overview: !['positionssystem','addition','multiplikation','monster','likhet','former','langd','omkrets','avlasa','tabell','medel','median','negativa'].includes(id)}]; }));
  const originalNodes = old.nodes.map(node => ({...node,...meta.get(node.id)}));
  const rows = `
tal-siffra|Tal och siffror|tal|7|core|7tal:5|4|positionssystem|Skilja mellan ett tal, dess siffror och siffrornas platsvärden.
sortera-tal|Jämföra och ordna tal|tal|7|core|7tal:14|18|positionssystem,decimal-plats|Avgöra storleksordning även när talen har olika många decimaler.
decimal-plats|Tiondelar till tusendelar|tal|7|core|7tal:11|7|positionssystem|Tolka decimalernas platsvärde och hitta tal på tallinjen.
decimal-addition|Addera decimaltal|tal|7|core|8tal:4|8|decimal-plats,addition|Addera tal med olika antal decimaler.
decimal-subtraktion|Subtrahera decimaltal|tal|7|core|8tal:4|8|decimal-plats,addition|Beräkna skillnader och hantera växling över decimaltecknet.
tiomultiplikation|Multiplicera med 10, 100, 1 000|tal|7|core|7tal:15|9|decimal-plats,multiplikation|Förklara hur platsvärdena ändras vid multiplikation med tiopotenser.
tiodivision|Dividera med 10, 100, 1 000|tal|7|core|7tal:16|9|decimal-plats,multiplikation|Flytta mellan platsvärden vid division med tiopotenser.
avrunda-heltal|Avrunda heltal|tal|7|core|7tal:17|4|positionssystem|Avrunda till angivet tiotal, hundratal eller tusental.
avrunda-decimal|Avrunda decimaltal|tal|7|core|7tal:18|9|decimal-plats,avrunda-heltal|Välja avrundningssiffra och avrunda till angiven noggrannhet.
overslag|Överslagsräkning|tal|7|core|7tal:19|9|avrunda-heltal,multiplikation|Göra en enkel uppskattning för att bedöma ett svars rimlighet.
delbarhet|Delbarhet och siffersumma|tal|7|core|7tal:7|6|multiplikation,tal-siffra|Använda regler för delbarhet med 2, 3, 5 och 10.
primtal|Primtal och sammansatta tal|tal|7|core|7tal:9|6|delbarhet|Avgöra om ett tal har andra delare än ett och sig självt.
primfaktorer|Primtalsfaktorisering|tal|7|core|7tal:10|6|primtal,multiplikation|Dela upp ett sammansatt tal i primtalsfaktorer.
decimal-multiplikation|Multiplicera decimaltal|tal|8|core|8tal:11|9|decimal-plats,multiplikation,tiodivision|Beräkna produkter och resonera om multiplikation med tal mindre än ett.
decimal-division|Dividera med decimaltal|tal|8|core|8tal:13|9|tiomultiplikation,multiplikation,decimal-plats|Förlänga en division så att divisorn blir ett heltal.
negativ-tallinje|Negativa tal på tallinjen|tal|8|core|8tal:17|14|sortera-tal|Jämföra negativa tal och tolka avstånd från noll.
negativ-subtraktion|Subtrahera negativa tal|tal|8|core|8tal:18|14|negativ-tallinje,addition|Skilja mellan ett negativt tal och att subtrahera ett tal.
negativ-multiplikation|Multiplicera negativa tal|tal|8|core|8tal:20|14|negativ-tallinje,multiplikation|Använda teckenregler för en produkt.
negativ-division|Dividera negativa tal|tal|8|core|8tal:20|14|negativ-multiplikation,multiplikation|Bestämma både tecken och värde i en kvot.
stora-tal|Miljoner och miljarder|tal|9|core|9tal:3|4|positionssystem|Växla mellan stora tal skrivna med ord och siffror.
prefix-stora|Kilo, mega och giga|tal|9|core|9tal:4|16|stora-tal,tiomultiplikation|Tolka prefix som beskriver stora antal.
prefix-sma|Milli, mikro och nano|tal|9|core|9tal:9|16|tiodivision,decimal-plats|Tolka prefix som beskriver små delar av en enhet.
potens-begrepp|Bas och exponent|tal|9|core|9tal:11|15|multiplikation|Tolka en potens som upprepad multiplikation.
tiopotens|Tiopotenser|tal|9|core|9tal:5|15|potens-begrepp,tiomultiplikation|Skriva och beräkna positiva tiopotenser.
negativ-exponent|Negativa exponenter|tal|9|core|9tal:9|15|tiopotens,tiodivision|Tolka negativa exponenter som inverser av tiopotenser.
grundpotens-stora|Grundpotensform: stora tal|tal|9|core|9tal:6|15|tiopotens,decimal-plats|Skilja koefficienten från tiopotensen i grundpotensform.
grundpotens-sma|Grundpotensform: små tal|tal|9|core|9tal:9|15|grundpotens-stora,negativ-exponent|Skriva små tal med en koefficient och en negativ tiopotens.
potens-multiplikation|Multiplicera potenser|tal|9|core|9tal:12|15|potens-begrepp,addition|Använda exponentregeln för potenser med samma bas.
potens-division|Dividera potenser|tal|9|core|9tal:12|15|potens-multiplikation,negativ-subtraktion|Subtrahera exponenter vid division av potenser med samma bas.
grundpotens-rakning|Räkna i grundpotensform|tal|9|core|9tal:8|15|grundpotens-stora,potens-multiplikation,potens-division,decimal-multiplikation|Räkna med koefficient och tiopotens och normalisera svaret.
kvadrattal|Kvadrattal|tal|9|core|9tal:13|17|potens-begrepp|Koppla kvadrattal till en kvadrats area.
kvadratrot|Kvadratrötter|tal|9|core|9tal:14|17|kvadrattal|Hitta den icke-negativa kvadratroten och uppskatta mellan heltal.
talmangder|Naturliga, hela och rationella tal|tal|9|core|9tal:15|3|negativ-tallinje,brak-del-hel|Känna igen hur olika talmängder ingår i varandra.
irrationella|Irrationella och reella tal|tal|9|core|9tal:15|3|talmangder,kvadratrot|Skilja rationella tal från exempelvis roten ur två.
romerska|Romerska tal|tal|7|core|7tal:4||tal-siffra|Tolka ett talsystem utan vårt vanliga positionssystem.
andra-talbaser|Andra talbaser|tal|7|extension|7tal:38||positionssystem,potens-begrepp|Tolka platsvärden när basen inte är tio.
rot-rakning|Räkna med kvadratrötter|tal|9|extension|9tal:37||kvadratrot,primfaktorer|Förenkla produkter och kvoter med kvadratrötter.
brak-del-hel|Bråk som del av en hel|brak|7|core|7brak:3|7|multiplikation|Tolka täljare och nämnare i lika stora delar av en helhet.
brak-del-antal|Bråk som del av ett antal|brak|7|core|7brak:6|11|brak-del-hel,multiplikation|Beräkna exempelvis tre fjärdedelar av ett antal.
blandad-form|Bråk större än ett|brak|7|core|7brak:4|11|brak-del-hel,multiplikation|Växla mellan blandad form och bråkform.
brak-likvardiga|Likvärdiga bråk|brak|7|core|7brak:7|7|brak-del-hel|Se att olika bråk kan beskriva samma andel.
brak-forlanga|Förlänga bråk|brak|7|core|7brak:9|8|brak-likvardiga,multiplikation|Multiplicera täljare och nämnare med samma tal.
brak-forkorta|Förkorta bråk|brak|7|core|7brak:10|8|brak-likvardiga,delbarhet|Dividera täljare och nämnare med en gemensam faktor.
brak-jamfora|Jämföra bråk|brak|7|core|7brak:8|7|brak-likvardiga,brak-forlanga|Jämföra bråk med olika täljare och nämnare.
gemensam-namnare|Gemensam nämnare|brak|7|core|7brak:12|8|brak-forlanga,multiplikation|Hitta en gemensam nämnare inför addition eller jämförelse.
brak-add-lika|Addera bråk: lika nämnare|brak|7|core|7brak:11|8|brak-del-hel,addition|Addera täljarna och behålla enheten som nämnaren anger.
brak-sub-lika|Subtrahera bråk: lika nämnare|brak|7|core|7brak:11|8|brak-del-hel,addition|Beräkna skillnader mellan lika stora bråkdelar.
brak-add-olika|Addera bråk: olika nämnare|brak|7|core|7brak:12|8|gemensam-namnare,brak-add-lika|Göra bråk jämförbara innan täljarna adderas.
brak-sub-olika|Subtrahera bråk: olika nämnare|brak|7|core|7brak:12|8|gemensam-namnare,brak-sub-lika|Subtrahera bråk efter omvandling till samma nämnare.
brak-decimal|Bråk till decimalform|brak|7|core|7brak:13|7|brak-del-hel,multiplikation,decimal-plats|Tolka bråkstrecket som division.
brak-heltal-mult|Heltal gånger bråk|brak|8|core|8tal:5|11|brak-add-lika,multiplikation|Tolka multiplikation som upprepad addition av samma bråk.
brak-multiplikation|Bråk gånger bråk|brak|8|core|8tal:7|12|brak-del-antal,brak-heltal-mult|Beräkna en andel av en andel.
brak-division|Dividera med bråk|brak|8|core|8tal:9|13|brak-multiplikation,brak-likvardiga|Tolkar hur många bråkdelar som ryms och använder det inverterade talet.
brak-hela|Hitta helheten från en bråkdel|brak|7|core|7brak:6|11|brak-del-antal,multiplikation|Räkna bakåt från en känd del till hela mängden.
brak-mgn|Minsta gemensamma nämnare|brak|8|extension|8tal:37||gemensam-namnare,primfaktorer|Välja minsta möjliga gemensamma nämnare.
brak-korsforkorta|Förkorta före multiplikation|brak|8|extension|8tal:40||brak-multiplikation,brak-forkorta|Förenkla faktorer före beräkning av en produkt.
prioritering|Räkneordning|algebra|7|core|7alg:3|5|addition,multiplikation|Utföra multiplikation och division före addition och subtraktion.
parentes-tal|Räkna med parenteser|algebra|7|core|7alg:7|5|prioritering|Utföra beräkningen i parentesen först.
variabel|Variabel och obekant|algebra|7|core|7alg:4|32|multiplikation,likhet|Tolka bokstäver som varierande eller okända tal.
skriva-uttryck|Från text till uttryck|algebra|7|core|7alg:5|32|variabel|Översätta exempelvis fler än, dubbelt så många och fast kostnad till uttryck.
forenkla-termer|Samla liknande termer|algebra|7|core|7alg:6|33|variabel,addition|Sammanföra termer av samma slag utan att blanda variabler och konstanter.
distributiva|Multiplicera in i parentes|algebra|7|core|7alg:8|34|forenkla-termer,multiplikation,parentes-tal|Multiplicera varje term i parentesen med faktorn utanför.
minus-parentes|Minus framför parentes|algebra|8|core|8alg:7|33|forenkla-termer,negativ-subtraktion|Byta tecken på varje term när en parentes subtraheras.
tva-parenteser|Multiplicera två parenteser|algebra|8|core|8alg:10|34|distributiva,forenkla-termer|Multiplicera varje term i den ena parentesen med varje term i den andra.
ekvation-add|Ekvation: addition och subtraktion|algebra|7|core|7alg:9|35|likhet,addition|Isolera ett obekant tal genom samma operation i båda leden.
ekvation-mult|Ekvation: multiplikation och division|algebra|7|core|7alg:10|35|likhet,multiplikation|Isolera ett obekant tal genom att dividera eller multiplicera båda leden.
ekvation-tva-steg|Ekvationer i flera steg|algebra|7|core|7alg:11|35|ekvation-add,ekvation-mult|Utföra omvända operationer i rätt ordning.
ekvation-bada|Obekanta i båda leden|algebra|8|core|8alg:5|36|ekvation-tva-steg,forenkla-termer|Samla variabler på en sida och tal på den andra.
ekvation-parentes|Ekvationer med parenteser|algebra|8|core|8alg:9|36|ekvation-bada,distributiva,minus-parentes|Förenkla parenteser och lös sedan ekvationen.
ekvation-provning|Pröva en lösning|algebra|7|core|7alg:10|35|uttryck,likhet|Sätta in ett föreslaget värde och kontrollera båda leden.
ekvation-text|Ställa upp en ekvation|algebra|7|core|7alg:12|37|skriva-uttryck,ekvation-tva-steg|Välja obekant och översätta ett textproblem till en likhet.
monster-regel|Mönstrets generella regel|algebra|7|core|7alg:15|40|monster,skriva-uttryck|Beskriva figur nummer n med ett uttryck.
kvadreringsregel|Kvadreringsreglerna|algebra|9|extension|styva:5||tva-parenteser,kvadrattal|Utveckla kvadraten av en summa eller en differens.
konjugatregel|Konjugatregeln|algebra|8|extension|8alg:31||tva-parenteser,kvadrattal|Använda skillnaden mellan två kvadrater.
faktorisera-uttryck|Bryta ut gemensam faktor|algebra|8|extension|8alg:33||distributiva,primfaktorer|Använda distributiva lagen baklänges.
algebra-brak|Förenkla algebraiska bråk|algebra|9|extension|styva:8||faktorisera-uttryck,brak-forkorta|Förkorta gemensamma faktorer och hålla reda på otillåtna nämnare.
ekvation-namnare|Ekvationer med nämnare|algebra|9|extension|styva:14||ekvation-parentes,gemensam-namnare|Multiplicera båda leden med en gemensam nämnare.
andragrad|Enkla andragradsekvationer|algebra|9|extension|9tal:39||kvadratrot,ekvation-mult,negativ-tallinje|Ta hänsyn till både positiv och negativ lösning till en kvadratekvation.
dimensioner|Längd, area och volym|geometri|7|core|7geo:3|20|former|Skilja en, två och tre dimensioner och deras enheter.
langd-enheter|Omvandla längdenheter|geometri|7|core|7geo:4|20|langd,tiomultiplikation,tiodivision|Växla mellan millimeter, centimeter, decimeter, meter och kilometer.
vinkeltyper|Spetsig, rät och trubbig vinkel|geometri|7|core|7geo:7|21|former|Klassificera vinklar och koppla grader till delar av ett varv.
triangel-typer|Olika slags trianglar|geometri|7|core|7geo:9|22|vinkeltyper,former|Använda egenskaper hos likbenta, liksidiga och rätvinkliga trianglar.
fyrhorningar|Fyrhörningars egenskaper|geometri|7|core|7geo:10|19|former,vinkeltyper|Skilja rektangel, kvadrat, romb och parallellogram.
triangel-vinkelsumma|Triangelns vinkelsumma|geometri|7|core|7geo:8|21|vinkeltyper,addition|Beräkna en okänd vinkel med hjälp av 180 grader.
sidovinklar|Sidovinklar och vertikalvinklar|geometri|9|core|9geo:3|21|vinkeltyper,addition|Använda räta linjer och motstående vinklar vid en skärning.
parallella-vinklar|Vinklar vid parallella linjer|geometri|9|core|9geo:4|21|sidovinklar|Använda likbelägna vinklar och alternatvinklar.
area-rektangel|Rektangelns area|geometri|7|core|7geo:13|24|dimensioner,multiplikation,langd|Beräkna area med längd gånger bredd.
area-parallellogram|Parallellogrammens area|geometri|7|core|7geo:14|24|area-rektangel|Använda vinkelrät höjd i stället för sned sidlängd.
area-triangel|Triangelns area|geometri|7|core|7geo:15|24|area-parallellogram,multiplikation|Beräkna bas gånger vinkelrät höjd delat med två.
area-sammansatt|Area av sammansatta figurer|geometri|7|core|7geo:17|24|area-rektangel,area-triangel,addition|Dela upp en yta eller subtrahera ett urtag.
area-enheter|Kvadratenheter|geometri|8|core|8geo:7|20|area-rektangel,langd-enheter|Förstå varför ett längdsteg ger hundra kvadratenheter.
hektar|Hektar och kvadratkilometer|geometri|8|core|8geo:8|20|area-enheter,stora-tal|Omvandla enheter för större areor.
cirkel-begrepp|Cirkel: radie, diameter och pi|geometri|8|core|8geo:5|24|langd,multiplikation|Koppla radie och diameter och tolka pi som ett förhållande.
cirkel-omkrets|Cirkelns omkrets|geometri|8|core|8geo:5|24|cirkel-begrepp,decimal-multiplikation|Beräkna omkrets från radie eller diameter.
cirkel-area|Cirkelns area|geometri|8|core|8geo:9|24|cirkel-begrepp,area-rektangel,decimal-multiplikation|Använda radien två gånger i formeln för cirkelns area.
cirkelbage|Cirkelbåge|geometri|8|core|8geo:11||cirkel-omkrets,brak-del-antal,vinkeltyper|Beräkna en del av omkretsen från medelpunktsvinkeln.
cirkelsektor|Cirkelsektorns area|geometri|8|core|8geo:11||cirkel-area,brak-del-antal,vinkeltyper|Beräkna en del av cirkelns area från medelpunktsvinkeln.
kroppar|Geometriska kroppar|geometri|7|core|7geo:5|25|dimensioner,former|Känna igen basytor, hörn, kanter och sidoytor.
volym-ratblock|Rätblockets volym|geometri|7|core|7geo:21|26|area-rektangel,kroppar,multiplikation|Beräkna volym genom basytans area gånger höjden.
volym-enheter|Kubikenheter och liter|geometri|8|core|8geo:12|20|volym-ratblock,langd-enheter|Växla mellan kubikmeter, kubikdecimeter, liter och milliliter.
begransningsyta|Rätblockets begränsningsyta|geometri|7|core|7geo:22|25|area-rektangel,kroppar,addition|Summera alla sidoytors areor.
volym-prisma|Prismats volym|geometri|9|core|np:26|26|area-triangel,volym-ratblock|Beräkna volym när basytan är en annan månghörning än en rektangel.
volym-cylinder|Cylinderns volym|geometri|8|core|8geo:13|26|cirkel-area,volym-ratblock|Koppla cirkulär basyta till kroppens höjd.
cylinder-yta|Cylinderns mantelyta och totalyta|geometri|8|core|8geo:22||cirkel-omkrets,cirkel-area,area-rektangel|Veckla ut manteln till en rektangel och lägga till basytorna.
volym-pyramid|Pyramidens volym|geometri|8|core|8geo:15|26|volym-ratblock,brak-del-antal|Använda en tredjedel av basytans area gånger höjden.
volym-kon|Konens volym|geometri|8|core|8geo:15|26|volym-cylinder,volym-pyramid|Beräkna volym från cirkulär basyta och vinkelrät höjd.
volym-klot|Klotets volym|geometri|8|core|8geo:16||cirkel-begrepp,decimal-multiplikation,brak-del-antal|Sätta in radien i en given volymformel för klot.
pythagoras-hyp|Pythagoras: hypotenusan|geometri|9|core|9geo:5|22|kvadrattal,kvadratrot,triangel-typer|Beräkna hypotenusan i en rätvinklig triangel.
pythagoras-katet|Pythagoras: okänd katet|geometri|9|core|9geo:6|23|pythagoras-hyp,ekvation-add|Lösa ut en katet med subtraktion och kvadratrot.
pythagoras-kontroll|Är triangeln rätvinklig?|geometri|9|core|9geo:8|22|pythagoras-hyp|Kontrollera om sidlängderna uppfyller Pythagoras samband.
skala-verklighet|Skala: bild till verklighet|geometri|9|core|9geo:9|27|langd-enheter,multiplikation|Beräkna verkligt mått från bildens mått och längdskalan.
skala-bild|Skala: verklighet till bild|geometri|9|core|9geo:9|27|langd-enheter,multiplikation|Beräkna bildmått från ett verkligt mått.
skala-bestamma|Bestämma längdskalan|geometri|9|core|9geo:10|27|skala-verklighet,brak-forkorta|Jämföra mått i samma enhet för att bestämma en skala.
areaskala|Areaskala|geometri|9|core|9geo:11|27|skala-bestamma,area-rektangel,kvadrattal|Kvadrera längdskalan vid jämförelse av areor.
volymskala|Volymskala|geometri|9|core|9geo:11|27|skala-bestamma,volym-ratblock,potens-begrepp|Upphöja längdskalan till tre vid jämförelse av volymer.
likformighet|Likformiga figurer|geometri|9|core|9geo:13|28|skala-bestamma,brak-likvardiga|Använda samma förhållande mellan motsvarande sidor.
spegelsymmetri|Spegelsymmetri|geometri|9|core|9geo:17|29|former,fyrhorningar|Hitta symmetrilinjer och spegelvända delar.
rotationssymmetri|Rotationssymmetri|geometri|9|core|9geo:17|29|vinkeltyper,spegelsymmetri|Bestämma hur stor vridning som får en figur att täcka sig själv.
spegla-koordinat|Spegla i koordinatsystem|geometri|9|core|9geo:18|29|koordinater,negativ-tallinje,spegelsymmetri|Beskriva hur koordinater ändras vid spegling i en axel.
manghorning-vinkel|Månghörningars vinkelsumma|geometri|7|extension|7geo:41||triangel-vinkelsumma,distributiva|Dela en månghörning i trianglar för att härleda vinkelsumman.
rymiddiagonal|Rymddiagonal|geometri|9|extension|9geo:37||pythagoras-hyp,kroppar|Använda Pythagoras två gånger i ett rätblock.
likformighet-avancerad|Likformighet i inbäddade trianglar|geometri|9|extension|9geo:39||likformighet,ekvation-tva-steg|Matcha motsvarande sidor när trianglar delar en del av figuren.
klot-yta|Klotets begränsningsyta|geometri|8|extension|8geo:37||cirkel-area,decimal-multiplikation|Använda formeln för klotets yta och skilja area från volym.
koordinater|Koordinater och origo|samband|9|core|9sam:7|45|negativ-tallinje,avlasa|Läsa punkter i alla fyra kvadranter med rätt ordning på koordinaterna.
samband-tabell|Samband i tabeller|samband|8|core|8sam:3|41|tabell,monster|Följa hur en storhet beror av en annan.
graf-avlasning|Läsa en graf|samband|8|core|8sam:4|46|avlasa,samband-tabell|Läsa axlarnas skalor och tolka värden i ett samband.
proportionalitet|Proportionella samband|samband|8|core|8sam:9|42|samband-tabell,multiplikation|Känna igen konstant kvot och avsaknad av fast startvärde.
enhetspris|Enhetspris och jämförelser|samband|8|core|8sam:5|43|proportionalitet,decimal-division|Jämföra kostnader genom pris per enhet.
forhallande|Förhållande och blandningar|samband|9|core|np:44|44|brak-del-antal,multiplikation|Skilja förhållandet mellan delar från andelen av helheten.
recept|Skala upp ett recept|samband|8|core|8sam:9|43|proportionalitet,brak-del-antal|Skala samtliga mängder med samma faktor.
hastighet|Hastighet, sträcka och tid|samband|8|core|8sam:11|46|proportionalitet,multiplikation|Beräkna en av storheterna med hjälp av de två andra.
tid-enheter|Timmar, minuter och decimaler|samband|8|core|8sam:11|46|brak-del-hel,multiplikation|Växla mellan minuter och decimalform av timmar.
vag-tid|Väg–tid-diagram|samband|8|core|8sam:12|46|graf-avlasning,hastighet,tid-enheter|Skilja vila, rörelse och återfärd i ett diagram.
funktion-begrepp|Vad är en funktion?|samband|9|core|9sam:3|41|samband-tabell,variabel|Tolka ett entydigt samband från invärde till utvärde.
funktionsvarde|Beräkna funktionsvärden|samband|9|core|9sam:8|45|funktion-begrepp,uttryck,negativa|Sätta in positiva, negativa och nollvärden i en regel.
startvarde|Startvärdet m|samband|9|core|9sam:9|45|funktion-begrepp,koordinater|Tolka skärningen med y-axeln och värdet när x är noll.
lutning|Lutningen k|samband|9|core|9sam:10|45|koordinater,decimal-division,negativa|Beräkna förändringen i y per steg i x.
linje-ekvation|Bestämma en linjes ekvation|samband|9|core|9sam:11|45|lutning,startvarde,ekvation-add|Bestämma k och m från punkter eller en tabell.
rita-linje|Från regel till linje|samband|9|core|9sam:12|45|funktionsvarde,koordinater|Välja punkter som ligger på linjen och koppla tabell till graf.
jamfora-samband|Jämföra två linjära modeller|samband|9|core|9sam:6|41|linje-ekvation,ekvation-bada|Hitta när två kostnader eller andra värden är lika.
aritmetisk|Aritmetiska talföljder|samband|9|core|9sam:13|40|monster-regel,forenkla-termer|Koppla konstant differens till en regel för det n:te talet.
formel-omskrivning|Skriva om formler|samband|9|core|9sam:16|45|ekvation-tva-steg,variabel|Lösa ut en variabel med samma operation i båda leden.
icke-linjart|Icke-linjära samband|samband|9|core|9sam:3|46|funktion-begrepp,lutning|Känna igen när förändringen inte är konstant.
geometrisk-talfoljd|Geometriska talföljder|samband|9|extension|9sam:39||aritmetisk,potens-begrepp|Beskriva en talföljd där nästa tal fås med en konstant faktor.
ekvationssystem|Ekvationssystem: substitution|samband|9|extension|styva:17||jamfora-samband,ekvation-bada|Lösa två ekvationer med två obekanta genom insättning.
ekvationssystem-add|Ekvationssystem: addition|samband|9|extension|styva:19||ekvationssystem,distributiva|Eliminera en variabel genom att addera ekvationer.
procent-begrepp|Procent betyder hundradelar|procent|7|core|7pro:3|47|brak-del-hel,decimal-plats|Koppla procent till bråkform och decimalform.
procent-huvud|1 %, 10 %, 25 % och 50 %|procent|7|core|7pro:5|47|procent-begrepp,multiplikation|Använda vanliga andelar för huvudräkning.
procent-delen|Beräkna delen|procent|7|core|7pro:12|47|procent-begrepp,decimal-multiplikation|Multiplicera andelen med det hela.
procent-andelen|Beräkna andelen|procent|7|core|7pro:9|49|procent-begrepp,decimal-division|Dividera delen med det hela och uttrycka kvoten i procent.
procent-hela|Beräkna det hela|procent|7|core|7pro:13|49|procent-delen,decimal-division|Beräkna ursprungsmängden från en känd del och andel.
procent-rabatt|Rabatt och nytt pris|procent|7|core|7pro:8|48|procent-delen,addition|Skilja rabatten från priset efter rabatten.
procent-okning|Höjning och nytt värde|procent|7|core|7pro:6|48|procent-delen,addition|Lägga en procentuell ökning till ursprungsvärdet.
procent-forandring|Förändringen i procent|procent|8|core|8pro:5|49|procent-andelen,addition|Dividera förändringen med det ursprungliga värdet.
forandringsfaktor|Förändringsfaktor|procent|8|core|8pro:7|48|procent-begrepp,procent-rabatt,procent-okning|Växla mellan en procentuell förändring och en multiplikativ faktor.
procent-jamfora|Vilket värde jämför vi med?|procent|8|core|8pro:11|49|procent-forandring|Välja rätt bas vid jämförelser mellan två värden.
procent-over100|Procent över 100|procent|8|core|8pro:10|48|forandringsfaktor|Tolka ökningar som är större än ursprungsvärdet.
procent-baklanges|Ursprungsvärde efter förändring|procent|9|core|9pro:4|49|forandringsfaktor,procent-hela|Dividera med förändringsfaktorn för att hitta det gamla värdet.
upprepad-forandring|Flera procentuella förändringar|procent|9|core|9pro:7|48|forandringsfaktor,decimal-multiplikation|Multiplicera faktorer i stället för att addera procentsatser.
upprepad-samma|Samma förändring flera gånger|procent|9|core|9pro:8||upprepad-forandring,potens-begrepp|Använda potensform för upprepad procentuell förändring.
ranta|Ränta för ett år|procent|9|core|9pro:3||procent-delen|Beräkna en fiktiv årsränta från kapital och given räntesats.
ranta-tid|Ränta för del av ett år|procent|9|core|9pro:5||ranta,brak-del-antal|Anpassa enkel ränta till en angiven del av året.
procentenheter|Procent och procentenheter|procent|9|core|9pro:12||procent-forandring|Skilja skillnaden mellan andelar från deras relativa förändring.
promille|Promille och ppm|procent|9|extension|9pro:31||procent-begrepp,tiodivision|Växla mellan små andelar i decimalform, promille och ppm.
index|Index och basår|procent|9|extension|gym:12||procent-forandring,forandringsfaktor|Jämföra ett värde med ett basår som fått index 100.
typvarde|Typvärde|statistik|7|core|7stat:5|52|tabell|Hitta värdet som förekommer oftast och upptäcka flera typvärden.
variationsbredd|Variationsbredd|statistik|7|core|7stat:7|52|sortera-tal,addition|Beräkna skillnaden mellan största och minsta observationen.
frekvenstabell|Frekvenstabell|statistik|7|core|7stat:3|53|tabell|Ordna data med antal observationer per värde eller kategori.
relativ-frekvens|Relativ frekvens|statistik|8|core|8sann:11|56|frekvenstabell,procent-andelen|Beskriva hur stor andel av observationerna ett utfall står för.
stapel-stolp|Stapel- och stolpdiagram|statistik|7|core|7stat:8|53|frekvenstabell,avlasa|Läsa höjder och skilja kategorier från numeriska utfall.
linjediagram|Linjediagram över tid|statistik|7|core|7stat:11|53|avlasa,sortera-tal|Läsa en förändring över tid med axlarnas gradering.
cirkeldiagram|Cirkeldiagram|statistik|7|core|7stat:9|54|procent-delen,brak-del-hel|Tolka en sektor som andel av en helhet.
diagram-vinkel|Andel till sektorvinkel|statistik|7|core|7stat:9|54|cirkeldiagram,vinkeltyper,procent-delen|Omvandla en andel till en vinkel i ett cirkeldiagram.
viktat-medel|Medelvärde ur frekvenstabell|statistik|9|core|np:55|55|medel,frekvenstabell|Ta hänsyn till hur många gånger varje värde förekommer.
histogram|Histogram och klassintervall|statistik|9|core|np:55|55|frekvenstabell,stapel-stolp|Läsa grupperade observationer med lika breda intervall.
kvartiler|Kvartiler och kvartilavstånd|statistik|9|core|9pro:10||median,variationsbredd|Dela ordnade data i fyra delar och beskriva den mittersta hälften.
ladagram|Lådagram|statistik|9|core|9pro:10||kvartiler,avlasa|Tolka minsta värde, kvartiler, median och största värde.
val-lagesmatt|Välja och jämföra lägesmått|statistik|9|core|9pro:9|52|medel,median,typvarde|Resonera om hur extrema värden påverkar medelvärde och median.
vilseledande|Granska diagram kritiskt|statistik|9|core|np:55|55|stapel-stolp,procent-jamfora|Upptäcka hur en avklippt axel kan förändra intrycket.
venndiagram|Venndiagram|statistik|9|extension|styva:21||frekvenstabell,addition|Räkna union och överlapp utan att dubbelräkna.
sannolikhet-skala|Sannolikhet mellan 0 och 1|sannolikhet|8|core|8sann:3|56|brak-del-hel,procent-begrepp|Tolka omöjligt, säkert och lika troliga utfall.
gynnsamma-utfall|Gynnsamma och möjliga utfall|sannolikhet|8|core|8sann:5|56|brak-del-hel,multiplikation|Beräkna sannolikhet i ett utfallsrum med lika sannolika utfall.
komplement|Komplementhändelser|sannolikhet|8|core|8sann:4|58|sannolikhet-skala,brak-sub-lika|Använda att en händelse och dess komplement summerar till ett.
forvantat-antal|Förväntat antal utfall|sannolikhet|8|core|8sann:6|56|gynnsamma-utfall,brak-del-antal|Beräkna förväntat antal utan att tolka det som ett säkert utfall.
trad-oberoende|Träddiagram: oberoende händelser|sannolikhet|8|core|8sann:7|57|gynnsamma-utfall,brak-multiplikation|Multiplicera sannolikheter längs en väg med oberoende steg.
trad-beroende|Träddiagram: utan återläggning|sannolikhet|8|core|8sann:9|57|trad-oberoende,brak-multiplikation|Ändra både antal och utfallsrum efter ett drag utan återläggning.
flera-vagar|Addera alternativa vägar|sannolikhet|8|core|8sann:8|58|trad-oberoende,brak-add-olika|Summera sannolikheter för ömsesidigt uteslutande vägar.
minst-en|Minst en: komplementmetoden|sannolikhet|8|core|8sann:8|58|komplement,trad-oberoende|Beräkna minst en genom ett minus sannolikheten för ingen.
experiment-sannolikhet|Sannolikhet från försök|sannolikhet|8|core|8sann:11|56|relativ-frekvens,gynnsamma-utfall|Skilja observerad frekvens från en teoretisk sannolikhet.
kombinationer|Multiplikationsprincipen|sannolikhet|8|core|8sann:13|59|multiplikation|Räkna antalet kombinationer av oberoende val.
ordna-objekt|Ordna olika föremål|sannolikhet|8|core|8sann:14|59|kombinationer|Minska antalet val för varje plats när ett föremål inte får återanvändas.
tva-tarningar|Utfall med två tärningar|sannolikhet|8|extension|8sann:31||kombinationer,gynnsamma-utfall|Skilja lika sannolika utfallspar från olika sannolika summor.
oordnade-val|Val där ordningen saknar betydelse|sannolikhet|8|extension|8sann:36||ordna-objekt,kombinationer|Undvika dubbelräkning av samma urval i olika ordning.
tre-drag|Tre beroende drag|sannolikhet|9|extension|styva:25||trad-beroende,minst-en|Kombinera flera drag utan återläggning med komplementmetoden.
problem-bild|Representera med en bild|problem|8|core|8problem:1||brak-del-antal,forhallande|Använda en indelad sträcka eller yta för att göra ett problem tydligt.
problem-baklanges|Arbeta baklänges|problem|8|core|8problem:2||ekvation-tva-steg,brak-hela|Ångra händelser i omvänd ordning för att hitta ett startvärde.
problem-tabell|Undersöka systematiskt med tabell|problem|8|core|8problem:4||tabell,uttryck|Pröva möjliga värden systematiskt och hålla reda på fallen.
problem-graf|Lösa problem med graf|problem|8|core|8problem:5||jamfora-samband,graf-avlasning|Koppla en skärningspunkt till svaret på ett textproblem.
problem-ekvation|Välja ekvation som metod|problem|9|core|9problem:4||ekvation-text,ekvation-bada|Formulera en modell och tolka lösningen i sammanhanget.
problem-rimlighet|Kontrollera svar och enhet|problem|9|core|np:61|61|overslag,langd-enheter,ekvation-provning|Pröva om storleksordning och enhet stämmer med frågan.
problem-flersteg|Flerstegsproblem inför NP|problem|9|core|np:63|63|problem-rimlighet,procent-delen,volym-enheter|Kombinera beräkningar och behålla rätt enhet genom flera steg.
kod-variabel|Följa kod med variabler|problem|8|core|8alg:13||variabel,prioritering|Följa hur värdet i en variabel ändras av instruktioner.
kod-loop|Upprepning i kod|problem|8|core|8alg:14||kod-variabel,monster|Följa en enkel upprepning steg för steg.
kalkylblad|Formler i kalkylblad|problem|8|core|8geo:17||variabel,medel|Tolka cellreferenser och en enkel beräkningsformel.
simulering|Simulera slumpförsök|problem|8|core|8sann:15||kod-loop,experiment-sannolikhet|Tolka många simulerade försök och den relativa frekvensen.
densitet|Täthet och sammansatta enheter|problem|8|extension|8geo:36||area-enheter,decimal-division|Beräkna antal per area eller massa per volym från givna data.
material|Materialåtgång med spill|problem|9|extension|gym:5||area-sammansatt,procent-okning,langd-enheter|Kombinera mått, materialbehov och ett givet procentuellt tillägg.
moms|Pris med och utan given moms|problem|9|extension|gym:9||forandringsfaktor,procent-baklanges|Beräkna med en uttryckligen given skattesats i en matematikuppgift.
amortering|Ränta och amortering|problem|9|extension|gym:11||ranta,multiplikation,addition|Skilja kostnaden för ett lån från återbetalning av lånebeloppet.
trigonometri|Sinus, cosinus och tangens|geometri|9|extension|gym:13||triangel-typer,pythagoras-hyp,likformighet|Använda ett givet trigonometriskt förhållande i en rätvinklig triangel.
`.trim().split('\n');
  const added = rows.map(line => {
    const [id,title,category,grade,level,ref,np,deps,description] = line.split('|');
    return {id,title,category,grade:Number(grade),stage:3,level,source:source(ref),np:np?Number(np):null,deps:deps?deps.split(','):[],description,overview:false};
  });
  const nodes = [...originalNodes, ...added];
  const byId = new Map(nodes.map(n => [n.id,n]));
  const visiting = new Set();
  function depth(node) {
    if (Number.isInteger(node.depth)) return node.depth;
    if (visiting.has(node.id)) throw new Error(`Cykel i färdighetskartan: ${node.id}`);
    visiting.add(node.id);
    node.depth = node.deps.length ? 1 + Math.max(...node.deps.map(id => { if (!byId.has(id)) throw new Error(`Saknad förkunskap: ${id}`); return depth(byId.get(id)); })) : 0;
    visiting.delete(node.id); return node.depth;
  }
  const reasons = {
    'pythagoras-hyp:kvadratrot': 'Efter att kateternas kvadrater summerats behöver eleven ta kvadratroten.',
    'brak-add-olika:gemensam-namnare': 'Delarna måste ha samma storlek innan de kan läggas ihop.',
    'procent-baklanges:forandringsfaktor': 'Det nya värdet divideras med samma faktor som användes vid förändringen.',
    'area-triangel:area-parallellogram': 'En triangel har halva arean av en parallellogram med samma bas och höjd.',
    'trad-beroende:trad-oberoende': 'Trädets struktur återanvänds, men sannolikheterna måste ändras efter varje drag.',
    'upprepad-forandring:forandringsfaktor': 'Varje förändring verkar på det senast beräknade värdet.',
    'procentenheter:procent-forandring': 'Skillnaden i procentenheter måste kunna skiljas från relativ förändring.'
  };
  nodes.forEach(node => {
    depth(node);
    node.npSource = node.np ? source(`np:${node.np}`) : null;
    node.dependencyReasons = Object.fromEntries(node.deps.map(id => [id, reasons[`${node.id}:${id}`] || byId.get(id).description]));
  });
  old.categories = categories; old.nodes = nodes; old.books = books; old.source = source;
  old.legacyGenerate = old.generate;
  old.addedIds = new Set(added.map(n => n.id));
})();
