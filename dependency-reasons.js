/* Matematiska motiveringar till den färdiga grafen, efter sammanslagning.
   Varje rad är mål|förkunskap|motivering. ? markerar ett samband att granska:
   en möjlig metod, tillämpning eller jämförelse, inte ett generellt krav.
   Beroendena är pedagogiska förslag, inte fastställda av böcker eller kursplan. */
(() => {
  'use strict';
  const M=window.MATREE;
  const rows=`
positionssystem|f-count|Antal grupperas i tio ental per tiotal och tio tiotal per hundratal.
addition|f-add-place|Vid addition av större tal används samma växling av tio enheter till en enhet på nästa plats.
addition|f-sub-place|Vid subtraktion av större tal används samma uppdelning av ett tiotal i tio ental.
multiplikation|f-table|Tabellprodukterna används när större tal multipliceras och när kvoter beräknas.
multiplikation|f-sharing|Division tolkas som lika delning eller antal grupper och kontrolleras med motsvarande produkt.
brak|brak-del-hel|Täljare och nämnare beskriver hur många lika stora delar av helheten som avses i den blandade kontrollen.
brak|brak-del-antal|I den blandade kontrollen beräknas bråkdelar av antal genom lika delning och val av delar.
decimal|decimal-plats|Platsvärden avgör vad varje siffra betyder i den blandade decimalkontrollen.
decimal|decimal-addition|Den blandade kontrollens summor beräknas genom att addera ental, tiondelar och hundradelar var för sig.
decimal|tiomultiplikation|Multiplikation med tio används för att ändra decimalers storlek i den blandade kontrollen.
procent|procent-begrepp|Procenttalet tolkas som antal hundradelar av jämförelsevärdet i den blandade kontrollen.
procent|procent-huvud|Halva, fjärdedelen och tiondelen används för att beräkna vanliga procentandelar i kontrollen.
monster|f-add-small|Skillnaden mellan två tal kan användas som ett återkommande steg när talföljden fortsätts.
likhet|f-add-small|Summor beräknas på båda sidor för att avgöra om uttrycken har samma värde.
uttryck|variabel|Bokstaven ersätts med sitt givna talvärde innan uttrycket beräknas.
uttryck|prioritering|Efter insättning avgör räkneordningen vilka operationer som ska utföras först.
ekvation|ekvation-add|Addition eller subtraktion i båda leden används för att isolera det obekanta i kontrollens ekvationer.
ekvation|ekvation-mult|Multiplikation eller division i båda leden används när det obekanta har en faktor eller nämnare.
negativa|sortera-tal|Talens ordning utvidgas till vänster om noll, där exempelvis −5 är mindre än −2.
funktion|funktionsvarde|Insatta x-värden ger de y-värden som behövs för att undersöka kontrollens linjära samband.
funktion|lutning|Ändringen i y per steg i x används för att tolka hur snabbt det linjära sambandet förändras.
funktion|startvarde|Värdet när x är noll används för att tolka var kontrollens linje skär y-axeln.
langd|f-length|Mätning med centimeter och meter utvidgas till fler längdenheter och val av lämplig enhet.
omkrets|former|Figurens sidor identifieras så att hela ytterkanten räknas med en gång.
omkrets|f-add-small|Sidornas längder adderas till den sammanlagda längden runt figuren.
omkrets|f-length|Sidornas mått tolkas som längder och uttrycks i samma enhet innan de summeras.
area|area-rektangel|Rektangelns bas gånger höjd används för rektangulära delar i den blandade areakontrollen.
area|area-triangel|Triangulära delar beräknas som bas gånger höjd delat med två i den blandade kontrollen.
vinklar|vinkeltyper|Spetsiga, räta och trubbiga vinklar skiljs åt när kontrollens figurer tolkas.
vinklar|triangel-vinkelsumma|En okänd triangelvinkel beräknas genom att dra de andra två från 180°.
skala|skala-bild|Verkliga längder omvandlas till bildmått med längdskalan i den blandade kontrollen.
skala|skala-verklighet|Bildmått omvandlas till verkliga längder med längdskalan i den blandade kontrollen.
avlasa|f-compare|?Jämförelse av tal används när avlästa värden ska rangordnas; att hitta ett enskilt tabellvärde kräver inte detta.
medel|f-add-small|Observationernas värden adderas innan summan delas med antalet observationer.
medel|f-sharing|Summan fördelas lika mellan observationerna för att få medelvärdet.
median|sortera-tal|Värdena ordnas från minst till störst innan det mittersta värdet väljs.
median|medel|?Vid ett jämnt antal värden är medianen medelvärdet av de två mittersta; vid ett udda antal behövs inte medelvärde.
sannolikhet|sannolikhet-skala|Kontrollens sannolikheter tolkas mellan omöjligt, 0, och säkert, 1.
sannolikhet|gynnsamma-utfall|Vid lika sannolika utfall delas antalet gynnsamma utfall med antalet möjliga.
forandring|procent-forandring|Skillnaden jämförs med ursprungsvärdet för att bestämma förändringen i procent.
forandring|forandringsfaktor|Det gamla värdet multipliceras med faktorn för att få värdet efter förändringen.
tal-siffra|positionssystem|Samma siffra får olika värde beroende på om den står på entals-, tiotals- eller hundratalsplatsen.
sortera-tal|decimal-plats|?När decimaltal ordnas jämförs ental, tiondelar och hundradelar i tur och ordning; heltal kräver inte decimaler.
sortera-tal|f-compare|Jämförelse av två hela tal utvidgas till att placera flera tal i storleksordning.
decimal-plats|positionssystem|Platsvärdena fortsätter åt höger från ental till tiondelar, hundradelar och tusendelar.
decimal-plats|f-half|?Halvor ger ett konkret exempel på delar av en enhet, som 0,5; decimalers platsvärden kan också introduceras med tiondelar direkt.
decimal-addition|decimal-plats|Siffror med samma platsvärde adderas: tiondelar med tiondelar och hundradelar med hundradelar.
decimal-addition|f-add-small|De små summorna används på varje decimalplats och vid växling av tio delar.
decimal-subtraktion|decimal-plats|Lika platsvärden ställs under varandra och en tiondel kan växlas till tio hundradelar.
decimal-subtraktion|addition|Heltalens subtraktionsmetoder återanvänds för varje platsvärde i decimaltalen.
tiomultiplikation|decimal-plats|Varje siffra får tio, hundra eller tusen gånger större platsvärde när talet multipliceras.
tiomultiplikation|multiplikation|Produkten tolkas som att talets värde skalas upp med den angivna faktorn.
tiodivision|decimal-plats|Varje siffra får tio, hundra eller tusen gånger mindre platsvärde vid divisionen.
tiodivision|multiplikation|Divisionen kontrolleras genom att multiplicera kvoten med 10, 100 eller 1 000.
avrunda-heltal|positionssystem|Den angivna positionen avgör vilka närliggande tiotal, hundratal eller tusental som är aktuella.
avrunda-heltal|f-compare|Talet jämförs med mittpunkten mellan två avrundningsvärden för att välja det närmaste.
avrunda-decimal|decimal-plats|Den efterfrågade decimalplatsen och siffran närmast till höger identifieras inför avrundningen.
avrunda-decimal|avrunda-heltal|Samma regel om närmaste värde används, men stegen kan vara tiondelar eller hundradelar.
overslag|avrunda-heltal|Talen ersätts med närliggande, enklare tal innan ett ungefärligt svar beräknas.
overslag|f-table|?Tabellprodukter förenklar överslag av produkter, exempelvis 19 · 4 ≈ 20 · 4; andra överslag använder andra räknesätt.
delbarhet|multiplikation|Ett tal är delbart med en divisor när det kan skrivas som divisorn gånger ett heltal.
delbarhet|tal-siffra|Siffrorna skiljs från hela talet när sista siffran eller siffersumman används i delbarhetsregler.
primtal|delbarhet|Delare undersöks för att avgöra om ett tal större än 1 bara är delbart med 1 och sig självt.
primfaktorer|primtal|Faktoriseringen fortsätter tills alla faktorer är primtal.
primfaktorer|multiplikation|Talet skrivs som en produkt vars faktorer i sin tur kan delas upp.
decimal-multiplikation|decimal-plats|Faktorernas platsvärden avgör produktens storlek och decimalernas placering.
decimal-multiplikation|multiplikation|Heltalsprodukten används som ett delsteg när decimalfaktorernas siffror multipliceras.
decimal-multiplikation|tiodivision|En beräknad heltalsprodukt skalas ned med tiopotenser för att återställa faktorernas decimalvärden.
decimal-division|tiomultiplikation|Täljare och nämnare multipliceras med samma tiopotens så att divisorn blir ett heltal.
decimal-division|multiplikation|När divisorn är ett heltal används division och kontroll med kvoten gånger divisorn.
decimal-division|decimal-plats|Platsvärdena håller reda på storleken hos dividend, divisor och kvot när decimalerna flyttas.
negativ-subtraktion|negativa|Tallinjens riktning används för att tolka att subtraktion av ett negativt tal ökar värdet.
negativ-subtraktion|addition|Sambandet mellan addition och subtraktion används när a − (−b) skrivs som a + b.
negativ-multiplikation|negativa|Minustecknet tolkas som talets tecken när faktorernas tecken bestämmer produktens tecken.
negativ-multiplikation|multiplikation|Faktorernas belopp multipliceras innan rätt tecken sätts på produkten.
negativ-division|negativ-multiplikation|Kvotens tecken väljs så att kvoten gånger divisorn ger dividendens tecken.
negativ-division|multiplikation|Beloppen divideras och resultatet kontrolleras med motsvarande multiplikation.
stora-tal|positionssystem|Platsvärden grupperas i tusental, miljoner och miljarder när stora tal läses och skrivs.
prefix-stora|stora-tal|Kilo, mega och giga kopplas till tusen, en miljon respektive en miljard enheter.
prefix-stora|tiomultiplikation|Prefixets faktor används för att multiplicera ett mått till antalet grundenheter.
prefix-sma|tiodivision|En grundenhet delas med tusen, en miljon eller en miljard för att tolka små prefix.
prefix-sma|decimal-plats|Decimala platsvärden används för att skriva exempelvis milli som 0,001 av grundenheten.
potens-begrepp|multiplikation|En potens tolkas som upprepad multiplikation av samma bas.
tiopotens|potens-begrepp|Basen sätts till 10 och exponenten anger antalet tiotalsfaktorer.
tiopotens|tiomultiplikation|Upprepad multiplikation med 10 visar hur talvärdet förändras när exponenten ökar.
negativ-exponent|tiopotens|Tiopotensernas mönster fortsätts förbi 10⁰ till 10⁻¹, 10⁻² och mindre värden.
negativ-exponent|tiodivision|Varje steg nedåt i exponenten dividerar värdet med 10, även när exponenten blir negativ.
grundpotens-stora|tiopotens|Tiopotensen beskriver hur många gånger koefficienten ska skalas med 10.
grundpotens-stora|decimal-plats|Decimaltecknet placeras så att koefficienten är minst 1 och mindre än 10.
grundpotens-sma|grundpotens-stora|Samma form a · 10ⁿ används, med koefficient mellan 1 och 10, men nu för små positiva tal.
grundpotens-sma|negativ-exponent|En negativ exponent beskriver hur koefficienten skalas ned till ett tal mindre än 1.
potens-multiplikation|potens-begrepp|Vid samma bas räknas alla basfaktorer i båda potenserna tillsammans.
potens-multiplikation|addition|Exponenterna adderas eftersom de anger antalet basfaktorer i produkten.
potens-division|potens-multiplikation|När gemensamma basfaktorer förkortas återstår exponenternas skillnad, som motsvarar multiplikationsregelns omvändning.
potens-division|negativ-subtraktion|?Subtraktion av negativa exponenter används när nämnarens exponent är negativ; positiva exponenter kan behandlas först.
grundpotens-rakning|grundpotens-stora|Resultatet skrivs om så att koefficienten åter ligger mellan 1 och 10.
grundpotens-rakning|potens-multiplikation|Tiopotensdelarna multipliceras genom att exponenterna adderas.
grundpotens-rakning|potens-division|Tiopotensdelarna divideras genom att exponenterna subtraheras.
grundpotens-rakning|decimal-multiplikation|Koefficienterna multipliceras separat från tiopotenserna innan resultatet normaliseras.
kvadrattal|potens-begrepp|Exponent 2 tolkas som talet multiplicerat med sig självt.
kvadratrot|kvadrattal|Kvadratroten söker det icke-negativa tal vars kvadrat är det givna talet.
talmangder|negativa|Negativa heltal skiljs från naturliga tal när tal sorteras i talmängder.
talmangder|brak-del-hel|Bråk visar rationella tal som inte behöver vara heltal, exempelvis 3/4.
irrationella|talmangder|Rationella tal, som kan skrivas som kvoter av heltal, skiljs från övriga reella tal.
irrationella|kvadratrot|Rötter som √2 ger exempel på reella tal som inte kan skrivas som kvoter av heltal.
romerska|tal-siffra|?Skillnaden mellan tal och siffersymbol används för att jämföra två skrivsätt; decimala platsvärden styr inte romerska tal.
andra-talbaser|positionssystem|Siffrans värde bestäms fortfarande av positionen, men nästa plats väger basen gånger mer.
andra-talbaser|potens-begrepp|Positionernas vikter skrivs som potenser av den valda basen, exempelvis 1, 2, 4 och 8 i bas två.
rot-rakning|kvadratrot|En faktor som är ett kvadrattal kan lyftas ut ur roten, exempelvis √(9 · 2) = 3√2.
rot-rakning|primfaktorer|?Primfaktorisering kan hitta par av lika faktorer som bildar kvadrattal; enkla rötter kan förenklas utan full faktorisering.
`;
  const extraRows=`
brak-del-hel|f-half|Halvor och fjärdedelar utvidgas till andra lika stora delar, där nämnaren anger indelningen.
brak-del-antal|f-half|Idén om lika stora delar överförs från en sammanhängande helhet till en samling föremål.
brak-del-antal|f-sharing|Antalet delas i nämnarens antal lika grupper och täljarens antal grupper väljs.
blandad-form|brak-del-hel|När täljaren når nämnaren bildar bråkdelarna en hel; återstående delar bildar bråkdelen.
blandad-form|multiplikation|Division ger antalet hela och resten; multiplikation omvandlar hela tillbaka till bråkdelar.
brak-likvardiga|f-half|Samma yta kan delas i fler lika stora delar, så att exempelvis en halv blir två fjärdedelar.
brak-likvardiga|f-table|?Tabellprodukter hjälper att se att täljare och nämnare har skalats lika mycket; likvärdighet kan också visas med bilder.
brak-forlanga|brak-likvardiga|Bråkets värde bevaras när varje del delas upp lika mycket och både täljare och nämnare ökar med samma faktor.
brak-forlanga|multiplikation|Täljaren och nämnaren multipliceras med samma heltal för att få den nya indelningen.
brak-forkorta|brak-likvardiga|Bråket ska behålla samma värde när mindre delar sammanförs till färre, större delar.
brak-forkorta|delbarhet|En gemensam delare till täljare och nämnare används för att förkorta båda med samma tal.
brak-jamfora|brak-likvardiga|Ett bråk kan ersättas av ett lika stort bråk utan att jämförelsen ändras.
brak-jamfora|brak-forlanga|?Förlängning till samma nämnare gör delarna lika stora så att täljarna kan jämföras; det finns även andra jämförelsemetoder.
gemensam-namnare|brak-forlanga|Bråken förlängs så att båda får den valda gemensamma nämnaren.
gemensam-namnare|multiplikation|Multiplar av nämnarna används för att hitta ett tal som båda nämnarna delar.
brak-add-lika|f-half|Lika stora bråkdelar kan räknas tillsammans utan att delarnas storlek ändras.
brak-add-lika|f-add-small|Täljarna adderas medan den gemensamma nämnaren behålls.
brak-sub-lika|brak-del-hel|Nämnaren beskriver delarnas storlek och ändras inte när några av delarna tas bort.
brak-sub-lika|addition|Täljarna subtraheras för att ange hur många lika stora delar som återstår.
brak-add-olika|gemensam-namnare|Bråken behöver uttryckas i lika stora delar innan täljarna kan adderas.
brak-add-olika|brak-add-lika|När nämnarna blivit lika används regeln att addera täljarna och behålla nämnaren.
brak-sub-olika|gemensam-namnare|Bråken skrivs med lika stora delar innan antalet delar kan subtraheras.
brak-sub-olika|brak-sub-lika|Efter omskrivning till samma nämnare subtraheras täljarna medan nämnaren behålls.
brak-decimal|brak-del-hel|Bråket och decimaltalet ska beskriva samma andel av en helhet.
brak-decimal|multiplikation|Täljaren divideras med nämnaren för att beräkna bråkets decimalvärde.
brak-decimal|decimal-plats|Kvoten skrivs med rätt antal tiondelar, hundradelar och andra decimaldelar.
brak-heltal-mult|brak-add-lika|Ett heltal gånger ett bråk kan tolkas som upprepad addition av samma bråk.
brak-heltal-mult|multiplikation|Täljaren multipliceras med heltalet för att räkna det sammanlagda antalet bråkdelar.
brak-multiplikation|brak-del-antal|Idén att ta en del av en mängd utvidgas till att ta en bråkdel av en bråkdel.
brak-multiplikation|brak-heltal-mult|?Multiplikation som skalning utvidgas från heltalsfaktorer till bråkfaktorer; en areamodell kan också introducera regeln direkt.
brak-division|brak-multiplikation|Division med ett bråk utförs genom att multiplicera med dess invers och kan kontrolleras med en produkt.
brak-division|brak-likvardiga|?Med lika nämnare kan division tolkas som hur många lika stora delar som ryms i varandra; detta är en möjlig härledning.
brak-hela|brak-del-antal|Beräkningen av en bråkdel vänds: först hittas värdet av en del, sedan alla delar i helheten.
brak-hela|multiplikation|Det givna antalet divideras med täljaren och multipliceras med nämnaren för att få helheten.
brak-mgn|gemensam-namnare|Bland gemensamma nämnare väljs den minsta positiva för att förenkla beräkningen.
brak-mgn|primfaktorer|?Primfaktorer kan användas för att bygga nämnarnas minsta gemensamma multipel; små nämnare kan jämföras genom uppräkning.
brak-korsforkorta|brak-multiplikation|Produkten har alla täljarfaktorer över alla nämnarfaktorer, så gemensamma faktorer kan tas bort före uträkningen.
brak-korsforkorta|brak-forkorta|En täljarfaktor och en nämnarfaktor divideras med samma tal utan att produktens värde ändras.
prioritering|f-add-small|Addition utförs efter eventuell multiplikation när uttryck med flera räknesätt beräknas.
prioritering|f-table|Tabellprodukterna beräknas före addition och subtraktion i uttrycket.
parentes-tal|prioritering|Räkneordningen används inne i parentesen, vars värde sedan beräknas före operationerna utanför.
variabel|multiplikation|?I uttryck som 3x betyder talet framför bokstaven multiplikation; en bokstav kan introduceras som obekant även utan detta.
variabel|likhet|?I en ekvation står bokstaven för ett värde som gör leden lika; variabler i fristående uttryck kräver ingen likhet.
skriva-uttryck|variabel|En bokstav används för den okända eller varierande storheten när textens räkneoperationer skrivs symboliskt.
forenkla-termer|variabel|Termer med samma bokstavsdel identifieras som samma slags storhet, exempelvis x-termer.
forenkla-termer|addition|Koefficienterna adderas eller subtraheras när liknande termer samlas.
distributiva|forenkla-termer|?Efter inmultiplikation kan liknande termer samlas; själva fördelningen över parentesen kan läras före förenkling.
distributiva|multiplikation|Faktorn utanför parentesen multipliceras med varje term inne i den.
distributiva|parentes-tal|Parentesen avgränsar vilka termer som ska multipliceras med faktorn utanför.
minus-parentes|forenkla-termer|När parentesen tagits bort samlas termer med samma bokstavsdel.
minus-parentes|negativ-subtraktion|Att subtrahera en negativ term ger addition, vilket förklarar teckenbytet i exempelvis a − (b − c).
tva-parenteser|distributiva|Varje term i den första parentesen multipliceras med varje term i den andra.
tva-parenteser|forenkla-termer|Efter att delprodukterna skrivits ut samlas liknande termer i resultatet.
ekvation-add|likhet|Samma tal adderas eller subtraheras i båda leden så att likheten bevaras.
ekvation-add|f-sub-small|Subtraktion upphäver en addition till det obekanta, som när x + 5 = 12 löses.
ekvation-mult|likhet|Båda leden multipliceras eller divideras med samma icke-nolltal för att behålla likheten.
ekvation-mult|multiplikation|Division upphäver multiplikation med en faktor och multiplikation upphäver division.
ekvation-tva-steg|ekvation-add|En tillagd eller subtraherad konstant tas bort som ett steg mot att isolera det obekanta.
ekvation-tva-steg|ekvation-mult|När konstanten tagits bort divideras eller multipliceras båda leden för att isolera det obekanta.
ekvation-bada|ekvation-tva-steg|Efter att bokstavstermerna samlats löses den återstående ekvationen med omvända räkneoperationer.
ekvation-bada|forenkla-termer|Bokstavstermer samlas i ett led och taltermer i det andra innan det obekanta beräknas.
ekvation-parentes|ekvation-bada|?När parenteserna utvecklats kan obekanta finnas i båda leden; enklare parentesekvationer behöver inte detta steg.
ekvation-parentes|distributiva|En faktor framför en parentes multipliceras in innan ekvationen förenklas och löses.
ekvation-parentes|minus-parentes|?När en parentes subtraheras byts tecken på dess termer; parentesekvationer utan sådant minus behöver inte regeln.
ekvation-provning|uttryck|Det föreslagna värdet sätts in i ekvationens uttryck och båda leden beräknas.
ekvation-provning|likhet|Lösningen godtas endast om insättningen ger samma värde i vänster och höger led.
ekvation-text|skriva-uttryck|Textens storheter skrivs som uttryck som kan sättas lika med varandra.
ekvation-text|ekvation-tva-steg|?Den uppställda ekvationen kan lösas med flera omvända operationer; att ställa upp den kräver inte alltid att den redan kan lösas.
monster-regel|monster|Återkommande förändringar mellan stegen används för att hitta hur mönstret beror på platsnumret.
monster-regel|skriva-uttryck|Platsnumret får en variabel och mönstrets beräkningsregel skrivs som ett uttryck.
kvadreringsregel|tva-parenteser|En kvadrerad parentes utvecklas som två lika parenteser där alla termpar multipliceras.
kvadreringsregel|kvadrattal|De två ytterprodukterna känns igen som kvadrater, a² och b².
konjugatregel|tva-parenteser|Parenteserna multipliceras termvis så att de två motsatta blandtermerna tar ut varandra.
konjugatregel|kvadrattal|De återstående produkterna skrivs som skillnaden mellan två kvadrater, a² − b².
faktorisera-uttryck|distributiva|Inmultiplikation används baklänges: den gemensamma faktorn flyttas utanför parentesen.
faktorisera-uttryck|primfaktorer|?Primfaktorisering kan hitta en gemensam talfaktor i koefficienterna; en synlig gemensam faktor kan brytas ut direkt.
algebra-brak|faktorisera-uttryck|Summor skrivs som produkter så att gemensamma faktorer, inte enstaka termer, kan förkortas.
algebra-brak|brak-forkorta|Samma icke-nollfaktor i täljare och nämnare kan förkortas även när den innehåller en variabel.
ekvation-namnare|ekvation-parentes|?När nämnarna tagits bort kan parenteser behöva utvecklas; enkla bråkekvationer kan lösas utan detta moment.
ekvation-namnare|gemensam-namnare|En gemensam nämnare används för att multiplicera alla termer så att bråknämnarna försvinner.
andragrad|kvadratrot|När x² isolerats används kvadratroten för att hitta lösningarnas belopp.
andragrad|ekvation-mult|En koefficient framför x² divideras bort innan kvadratroten tas.
andragrad|negativa|För ett positivt högerled ger både ett positivt och ett negativt x samma kvadrat.
dimensioner|former|Linjer och plana figurer används för att skilja längd i en riktning från utbredning i två eller tre riktningar.
langd-enheter|langd|Enheternas storlek och relationer, exempelvis 100 cm = 1 m, avgör om måttalet ska öka eller minska.
langd-enheter|tiomultiplikation|Vid byte till mindre längdenheter multipliceras måttalet med 10, 100 eller 1 000.
langd-enheter|tiodivision|Vid byte till större längdenheter divideras måttalet med 10, 100 eller 1 000.
vinkeltyper|former|Figurernas mötande sidor används för att urskilja hörnets vinkel och jämföra den med en rät vinkel.
triangel-typer|vinkeltyper|Vinklarna används för att skilja spetsvinkliga, rätvinkliga och trubbvinkliga trianglar.
triangel-typer|former|Triangelns tre sidor identifieras och jämförs för att skilja liksidiga, likbenta och oliksidiga trianglar.
fyrhorningar|former|Fyra sidor och fyra hörn identifieras innan sidornas och vinklarnas egenskaper jämförs.
fyrhorningar|vinkeltyper|Räta vinklar används för att skilja exempelvis rektanglar från andra parallellogrammer.
triangel-vinkelsumma|vinkeltyper|Triangelns inre vinklar identifieras och tolkas som delar av vinkelsumman 180°.
triangel-vinkelsumma|addition|De kända vinklarna summeras och deras summa subtraheras från 180°.
sidovinklar|vinkeltyper|En rak vinkel, 180°, används som helhet när två sidovinklar möts på en linje.
sidovinklar|addition|En sidovinkel räknas ut genom att den kända vinkeln subtraheras från 180°.
parallella-vinklar|sidovinklar|Sidovinklar och vertikalvinklar kombineras med lika vinklar vid parallella linjer för att hitta okända vinklar.
area-rektangel|dimensioner|Arean tolkas som tvådimensionell täckning och svaret anges i kvadratenheter.
area-rektangel|multiplikation|Antalet rader av enhetsrutor multipliceras med antalet rutor i varje rad.
area-rektangel|langd|Bas och höjd mäts som längder i samma enhet innan de multipliceras.
area-parallellogram|area-rektangel|En triangel kan flyttas så att parallellogrammen blir en rektangel med samma bas, höjd och area.
area-triangel|area-parallellogram|En triangel har halva arean av en parallellogram med samma bas och vinkelräta höjd.
area-triangel|multiplikation|Basen multipliceras med höjden och produkten divideras med två.
area-sammansatt|area-rektangel|Rektangulära delar beräknas var för sig när figuren delas upp.
area-sammansatt|area-triangel|?Triangulära delar beräknas med bas gånger höjd delat med två; figurer med enbart rektanglar behöver inte detta.
area-sammansatt|addition|Delarnas areor adderas, eller en utskuren dels area subtraheras från en större figur.
area-enheter|area-rektangel|En kvadrat med sidan 1 m innehåller 100 · 100 kvadratcentimeter, vilket ger omvandlingsfaktorn.
area-enheter|langd-enheter|Längdenhetens omvandlingsfaktor används i två riktningar när kvadratenheter omvandlas.
hektar|area-enheter|Hektar och kvadratkilometer omvandlas via kvadratmeter, exempelvis 1 ha = 10 000 m².
hektar|stora-tal|De stora måttalen hålls isär, särskilt 10 000 m² per hektar och 1 000 000 m² per kvadratkilometer.
cirkel-begrepp|langd|Radie, diameter och omkrets tolkas som olika längder i samma cirkel.
cirkel-begrepp|multiplikation|Diametern är dubbla radien och kvoten mellan omkrets och diameter är pi.
cirkel-omkrets|cirkel-begrepp|Radie och diameter skiljs åt när omkretsen beräknas som 2πr eller πd.
cirkel-omkrets|decimal-multiplikation|Ett närmevärde för pi multipliceras med diametern för att få en ungefärlig omkrets.
cirkel-area|cirkel-begrepp|Radien används i πr²; en given diameter måste först halveras.
cirkel-area|area-rektangel|?Om cirkelsektorer läggs om till en ungefärlig rektangel kan bas gånger höjd förklara πr²; formeln kan också användas direkt.
cirkel-area|decimal-multiplikation|Radien multipliceras med sig själv och med ett närmevärde för pi.
cirkelbage|cirkel-omkrets|Hela cirkelns omkrets beräknas innan den andel som bågen utgör väljs.
cirkelbage|brak-del-antal|Andelen v/360 av hela omkretsen ger bågens längd.
cirkelbage|vinkeltyper|?Vinkelmått används för bågens andel av 360°; indelningen i spetsig, rät och trubbig är inte i sig ett krav.
cirkelsektor|cirkel-area|Hela cirkelns area beräknas innan sektorns andel tas ut.
cirkelsektor|brak-del-antal|Sektorns area är andelen v/360 av hela cirkelarean.
cirkelsektor|vinkeltyper|?Sektorns medelpunktsvinkel mäts i grader; namnen på vinkeltyperna räcker inte som förkunskap för denna beräkning.
kroppar|dimensioner|En kropp har utbredning i tre riktningar, medan dess sidoytor är tvådimensionella.
kroppar|former|Basytor och sidoytor känns igen som exempelvis trianglar och rektanglar när kroppar beskrivs.
volym-ratblock|area-rektangel|Basytans area ger antalet enhetskuber i ett lager.
volym-ratblock|kroppar|?Rätblockets bas och höjd används i volymberäkningen, men hela momentet om prismor och pyramider är bredare än vad som krävs.
volym-ratblock|multiplikation|Basytans antal enhetskuber multipliceras med antalet lager, alltså höjden.
volym-enheter|volym-ratblock|En kub med sidan 1 dm rymmer 10 · 10 · 10 cm³ och motsvarar en liter.
volym-enheter|langd-enheter|Längdens omvandlingsfaktor används i tre riktningar när kubikenheter byts.
begransningsyta|area-rektangel|Varje rektangulär sidoytas area beräknas med dess två sidlängder.
begransningsyta|kroppar|?Rätblockets sex ytor behöver identifieras; kunskap om andra prismor och pyramider är inte ett generellt krav.
begransningsyta|addition|Alla sex sidoytornas areor adderas till den totala begränsningsytan.
volym-prisma|area-triangel|?För ett triangulärt prisma beräknas basytan med triangelformeln; andra basformer använder andra areaformler.
volym-prisma|volym-ratblock|Principen basarea gånger höjd överförs från rektangulära till andra likadana baslager.
volym-cylinder|cirkel-area|Den cirkelformade basytans area beräknas som πr².
volym-cylinder|volym-ratblock|Principen basarea gånger höjd används även när lagren är cirkelformade.
cylinder-yta|cirkel-omkrets|Mantelns utvecklade rektangel har en sida lika lång som bascirkelns omkrets.
cylinder-yta|cirkel-area|De två cirkelformade basytornas areor läggs till mantelytan för att få totalytan.
cylinder-yta|area-rektangel|Den utrullade mantelytans area beräknas som omkrets gånger cylinderhöjd.
volym-pyramid|volym-ratblock|För en pyramid med rektangulär bas jämförs volymen med basarea gånger höjd hos motsvarande rätblock.
volym-pyramid|brak-del-antal|Pyramidens volym är en tredjedel av basarean gånger den vinkelräta höjden.
volym-kon|volym-cylinder|Konens volym utgår från cylindervolymen med samma basradie och höjd.
volym-kon|volym-pyramid|?Faktorn en tredjedel kan jämföras mellan pyramid och kon; konformeln kan introduceras utan att pyramidformeln redan behärskas.
volym-klot|cirkel-begrepp|Radie och diameter skiljs åt eftersom klotformeln använder radien.
volym-klot|decimal-multiplikation|Radien multipliceras tre gånger och med pi i beräkningen 4πr³/3.
volym-klot|brak-del-antal|?Faktorn 4/3 kan tolkas som fyra tredjedelar av πr³; just bråk av ett antal är en möjlig förberedelse, inte enda vägen.
pythagoras-hyp|kvadrattal|Kateternas längder kvadreras innan de två kvadraterna adderas.
pythagoras-hyp|kvadratrot|Efter att kateternas kvadrater summerats tas kvadratroten för att få hypotenusans längd.
pythagoras-hyp|triangel-typer|Den räta vinkeln identifieras så att hypotenusan kan skiljas från kateterna.
pythagoras-katet|pythagoras-hyp|Samma samband a² + b² = c² används, men nu är en katet i stället för hypotenusan okänd.
pythagoras-katet|ekvation-add|Den kända katetens kvadrat subtraheras från båda leden innan roten tas.
pythagoras-kontroll|pythagoras-hyp|Kvadraten av den längsta sidan jämförs med summan av de andra två sidornas kvadrater.
skala-verklighet|langd-enheter|Bildmått och verkliga mått omvandlas till jämförbara enheter.
skala-verklighet|multiplikation|Bildens längd multipliceras med skalfaktorn från bild till verklighet.
skala-bild|langd-enheter|Det verkliga måttet skrivs i bildens längdenhet innan skalan används.
skala-bild|multiplikation|Det verkliga måttet divideras med skalfaktorn vid förminskning till bilden.
skala-bestamma|skala-verklighet|Sambandet mellan bildlängd och verklig längd används baklänges för att bestämma skalan.
skala-bestamma|brak-forkorta|Förhållandet bildmått/verkligt mått förkortas till exempelvis 1/100.
areaskala|skala-bestamma|Längdskalfaktorn identifieras innan dess effekt i två riktningar beräknas.
areaskala|area-rektangel|När både bas och höjd ändras med samma faktor multipliceras arean med faktorn två gånger.
areaskala|kvadrattal|Areafaktorn skrivs som längdskalfaktorn i kvadrat.
volymskala|skala-bestamma|Längdskalfaktorn identifieras för de likformiga kropparnas motsvarande längder.
volymskala|volym-ratblock|När längd, bredd och höjd ändras med samma faktor påverkas volymprodukten tre gånger.
volymskala|potens-begrepp|Volymfaktorn skrivs som längdskalfaktorn upphöjd till tre.
likformighet|skala-bestamma|Kvoten mellan motsvarande sidlängder används för att hitta den gemensamma längdskalan.
likformighet|brak-likvardiga|Förhållandena mellan motsvarande sidor jämförs som lika stora kvoter.
spegelsymmetri|former|Figurens sidor och hörn paras ihop på lika avstånd från en tänkt spegellinje.
rotationssymmetri|vinkeltyper|?Rotationsvinkeln mäts som en del av 360°; att namnge spetsiga och trubbiga vinklar är inte nödvändigt i sig.
rotationssymmetri|spegelsymmetri|?Båda undersöker om en figur täcker sig själv efter en förändring, men rotationssymmetri kräver inte spegelsymmetri.
spegla-koordinat|koordinater|Punktens x- och y-koordinater används för att skriva läget före och efter speglingen.
spegla-koordinat|negativa|Spegling i en koordinataxel byter tecken på en koordinat men bevarar avståndet till axeln.
spegla-koordinat|spegelsymmetri|Punkt och spegelbild placeras lika långt från spegellinjen på var sin sida.
manghorning-vinkel|triangel-vinkelsumma|Månghörningen delas i trianglar och varje triangel bidrar med 180° till vinkelsumman.
manghorning-vinkel|distributiva|?Formeln (n − 2) · 180° kan utvecklas med distributiva lagen, men kan användas direkt utan den.
rymiddiagonal|pythagoras-hyp|Pythagoras används först på en sidoyta och sedan på triangeln med sidodiagonalen och kroppens höjd.
rymiddiagonal|kroppar|Kroppens kanter, sidoytor och inre diagonal skiljs åt för att hitta de två räta trianglarna.
likformighet-avancerad|likformighet|Motsvarande vinklar och sidor identifieras även när trianglar överlappar eller ligger inuti varandra.
likformighet-avancerad|ekvation-tva-steg|Sambandet mellan motsvarande sidlängder skrivs som en ekvation som löses för den okända längden.
klot-yta|cirkel-area|Formeln 4πr² kan beräknas som fyra gånger arean av en cirkel med samma radie.
klot-yta|decimal-multiplikation|Radien kvadreras och multipliceras med fyra och ett närmevärde för pi.
`;
  const finalRows=`
koordinater|negativa|Koordinater till vänster om origo eller under x-axeln behöver skrivas med negativa tal.
koordinater|avlasa|?Att följa märkta skalor kan överföras från diagram till koordinataxlar; vanlig tabellavläsning är inte ett nödvändigt förstadium.
samband-tabell|frekvenstabell|?Rad- och kolumnläsning återanvänds, men en sambandstabell parar ihop värden och behöver inte innehålla frekvenser.
samband-tabell|monster|Återkommande förändringar mellan tabellrader kan användas för att hitta regeln mellan storheterna.
graf-avlasning|avlasa|Axelrubriker, skalsteg och avlästa värden kopplas ihop för att tolka en punkt i grafen.
graf-avlasning|samband-tabell|?En grafpunkt kan översättas till ett värdepar i en tabell; grafer kan också introduceras direkt med axlar och punkter.
proportionalitet|f-proportion|Sambandet mellan antal och totalpris utvidgas till andra situationer med konstant värde per enhet.
proportionalitet|multiplikation|Den ena storheten multipliceras med en konstant faktor för att få den andra.
enhetspris|proportionalitet|Totalpriset delas med mängden för att hitta den konstanta kostnaden per enhet.
enhetspris|decimal-division|Priser och mängder i decimalform divideras för att få ett jämförbart pris per kilogram, liter eller styck.
forhallande|brak-del-antal|Förhållandets delar summeras till en helhet, som delas upp i motsvarande bråkandelar.
forhallande|multiplikation|En del beräknas med division och multipliceras med antalet delar för varje ingrediens eller grupp.
recept|proportionalitet|Varje ingrediens ändras med samma faktor när antalet portioner ändras.
recept|brak-del-antal|?En halv eller annan bråkdel av receptet beräknas genom att ta samma andel av varje mängd; heltalsökningar kan göras direkt.
hastighet|proportionalitet|Vid konstant hastighet ökar sträckan proportionellt med tiden.
hastighet|multiplikation|Sträcka beräknas som hastighet gånger tid; division ger hastighet eller tid när de andra storheterna är kända.
tid-enheter|brak-del-hel|Minuter tolkas som sextiondelar av en timme, exempelvis 15/60 timme.
tid-enheter|multiplikation|Timmar multipliceras med 60 till minuter och minuter divideras med 60 till timmar.
vag-tid|graf-avlasning|Tid och sträcka läses som ett sammanhörande värdepar på grafens axlar.
vag-tid|hastighet|Sträckändringen per tidsintervall används för att tolka rörelse och jämföra hastigheter.
vag-tid|tid-enheter|Tidsaxelns minuter eller timmar omvandlas så att hastighetens tidsenhet blir rätt.
funktion-begrepp|samband-tabell|Tabellens in- och utvärden används för att undersöka om varje invärde har exakt ett utvärde.
funktion-begrepp|variabel|Variabler namnger in- och utvärden när sambandet skrivs med en regel.
funktionsvarde|funktion-begrepp|Det givna invärdet kopplas till ett bestämt utvärde enligt funktionens regel.
funktionsvarde|uttryck|Invärdet sätts in i uttrycket och räkneoperationerna utförs för att få funktionsvärdet.
funktionsvarde|negativa|?Negativa invärden eller utvärden behöver tolkas med rätt tecken; funktioner med enbart positiva värden kan undersökas tidigare.
startvarde|funktion-begrepp|Startvärdet är det utvärde funktionen ger när invärdet är noll.
startvarde|koordinater|Skärningen med y-axeln har x = 0, så dess y-koordinat visar startvärdet.
lutning|koordinater|Två punkters koordinater används för att beräkna ändringen i y och ändringen i x.
lutning|decimal-division|?Lutningen beräknas som Δy/Δx; decimaldivision behövs när koordinater eller kvoter innehåller decimaler.
lutning|negativa|Negativa skillnader används för att beskriva linjer som sjunker när x ökar.
linje-ekvation|lutning|Den beräknade lutningen sätts in som k i y = kx + m.
linje-ekvation|startvarde|Skärningen med y-axeln ger konstanten m i linjens ekvation.
linje-ekvation|ekvation-add|När k och en punkt är kända kan m isoleras genom att kx subtraheras från y.
rita-linje|funktionsvarde|Valda x-värden sätts in i regeln för att få punkter på linjen.
rita-linje|koordinater|De beräknade värdeparen placeras som punkter i koordinatsystemet innan linjen dras.
jamfora-samband|linje-ekvation|Varje modell skrivs som en linje så att startvärden, lutningar och skärning kan jämföras.
jamfora-samband|ekvation-bada|?Modellernas uttryck sätts lika för att beräkna skärningen algebraiskt; jämförelser kan också göras i grafen.
aritmetisk|monster-regel|Den konstanta ökningen används för att skriva en regel som ger talet på en valfri plats.
aritmetisk|forenkla-termer|?En regel som a + d(n − 1) kan förenklas för jämförelse med andra regler; talföljden kan beräknas utan förenklingen.
formel-omskrivning|ekvation-tva-steg|Samma operation utförs i båda leden för att stegvis isolera den önskade storheten.
formel-omskrivning|variabel|Bokstäverna tolkas som olika storheter som kan behandlas algebraiskt även utan givna talvärden.
icke-linjart|funktion-begrepp|Varje invärde har fortfarande ett utvärde även när sambandet inte kan beskrivas med en rät linje.
icke-linjart|lutning|?Konstant lutning kan användas som jämförelse för att upptäcka icke-linjära samband; sådana samband kan också introduceras direkt.
geometrisk-talfoljd|aritmetisk|?Konstant kvot jämförs med konstant differens för att skilja två typer av talföljder; aritmetiska talföljder är inget nödvändigt förstadium.
geometrisk-talfoljd|potens-begrepp|Upprepad multiplikation med samma kvot skrivs som en potens i talföljdens regel.
ekvationssystem|jamfora-samband|?Två linjers gemensamma punkt ger en bild av en lösning till båda ekvationerna; substitution kan även läras algebraiskt direkt.
ekvationssystem|ekvation-bada|Efter substitution löses en ekvation i en variabel, som kan förekomma i båda leden.
ekvationssystem-add|ekvationssystem|?Idén att samma talpar ska lösa båda ekvationerna återanvänds; additionsmetoden kräver inte att substitutionsmetoden behärskas.
ekvationssystem-add|distributiva|Vid skalning av en ekvation multipliceras varje term så att en variabel kan elimineras genom addition.
procent-begrepp|brak-del-hel|Procenttalet tolkas som täljaren när en helhet delas i hundra lika stora delar.
procent-begrepp|decimal-plats|Hundradelar skrivs i decimalform, exempelvis 25 % = 0,25.
procent-begrepp|procent-huvud|?Kända andelar som 50 % = hälften kan konkretisera hundradelar, men kan också läras efter procentbegreppet; ordningen bör granskas.
procent-huvud|brak-del-antal|50 %, 25 % och 10 % beräknas som hälften, fjärdedelen och tiondelen av antalet.
procent-huvud|decimal-plats|?Platsvärden kan stödja beräkning av 10 % och 1 % genom division med 10 och 100; enkla andelar kan beräknas utan decimalnotation.
procent-delen|procent-begrepp|Procenttalet skrivs som en andel av hundra som ska tas av helheten.
procent-delen|decimal-multiplikation|Helheten multipliceras med procentandelens decimalform, exempelvis 0,15 för 15 %.
procent-andelen|procent-begrepp|Kvoten mellan del och helhet uttrycks i hundradelar, alltså procent.
procent-andelen|decimal-division|Delen divideras med helheten innan kvoten omvandlas till procent.
procent-hela|procent-delen|Sambandet del = andel · helhet används baklänges när delen och procentandelen är kända.
procent-hela|decimal-division|Delen divideras med procentandelens decimalform för att få helheten.
procent-rabatt|procent-delen|Rabattbeloppet beräknas som en procentandel av det ursprungliga priset.
procent-rabatt|addition|Rabattbeloppet subtraheras från det gamla priset för att få det nya.
procent-okning|procent-delen|Ökningsbeloppet beräknas som en procentandel av det ursprungliga värdet.
procent-okning|addition|Ökningsbeloppet adderas till ursprungsvärdet för att få det nya värdet.
procent-forandring|procent-andelen|Förändringens storlek divideras med ursprungsvärdet och uttrycks som procentandel.
procent-forandring|addition|Skillnaden mellan nytt och gammalt värde beräknas innan den jämförs med ursprungsvärdet.
forandringsfaktor|procent-begrepp|Hela ursprungsvärdet motsvarar 100 % = 1, som ökningen läggs till eller minskningen dras från.
forandringsfaktor|procent-rabatt|Efter p procent rabatt återstår andelen 1 − p/100 av ursprungspriset.
forandringsfaktor|procent-okning|Efter p procent ökning återstår hela ursprungsvärdet plus ökningen, alltså faktorn 1 + p/100.
procent-jamfora|procent-forandring|Nämnaren i förändringskvoten identifieras så att samma skillnad kan jämföras med olika ursprungsvärden.
procent-over100|forandringsfaktor|?En faktor större än 1 ger ett värde över 100 % av ursprunget; procent över 100 kan även läras direkt som fler än hundra hundradelar.
procent-baklanges|forandringsfaktor|Det nya värdet divideras med samma faktor som användes vid förändringen.
procent-baklanges|procent-hela|Det förändrade värdet ses som en känd andel av den okända ursprungliga helheten.
upprepad-forandring|forandringsfaktor|Varje förändringsfaktor verkar på det senast beräknade värdet, inte alltid på ursprungsvärdet.
upprepad-forandring|decimal-multiplikation|Förändringsfaktorerna multipliceras i följd med ursprungsvärdet.
upprepad-samma|upprepad-forandring|Samma faktor används vid varje förändring och produkten samlar alla stegen.
upprepad-samma|potens-begrepp|En faktor som används n gånger skrivs som faktorn upphöjd till n.
ranta|procent-delen|Årsräntan beräknas som räntesatsens procentandel av kapitalet.
ranta-tid|ranta|Räntan för ett helt år används som utgångsvärde när en kortare tidsperiod ska beräknas.
ranta-tid|brak-del-antal|Vid enkel ränta tas den bråkdel av årsräntan som tidsperioden utgör av ett år.
procentenheter|procent-forandring|Skillnaden mellan två procentsatser skiljs från den relativa förändringen jämfört med den ursprungliga procentsatsen.
promille|procent-begrepp|Idén om andelar överförs från hundradelar till tusendelar och miljondelar.
promille|tiodivision|Tal per tusen eller per miljon divideras med 1 000 respektive 1 000 000 för att få decimalandelen.
index|procent-forandring|Förändringen jämfört med basåret räknas i procent innan den kopplas till indexvärdet.
index|forandringsfaktor|Förhållandet till basåret multipliceras med 100, så att basårets faktor 1 blir index 100.
typvarde|frekvenstabell|Värdet med den högsta frekvensen identifieras som typvärde.
variationsbredd|sortera-tal|Det minsta och det största värdet identifieras i materialet.
variationsbredd|addition|Det minsta värdet subtraheras från det största för att få variationsbredden.
frekvenstabell|avlasa|Rätt kategori eller värde kopplas till rätt rad när observationerna räknas.
frekvenstabell|addition|Frekvenserna summeras för att kontrollera det totala antalet observationer.
relativ-frekvens|frekvenstabell|En kategoris frekvens och det totala antalet observationer hämtas ur tabellen.
relativ-frekvens|procent-andelen|Frekvensen divideras med totalen för att uttrycka kategorins andel i procent.
stapel-stolp|frekvenstabell|Varje frekvens överförs till höjden på kategorins stapel eller stolpe.
stapel-stolp|avlasa|Axelns skala används för att läsa av det antal som en stapelhöjd representerar.
linjediagram|avlasa|Punkternas värden läses med hjälp av tidsaxeln och värdeaxelns skala.
linjediagram|sortera-tal|Tidpunkterna ordnas och värden jämförs för att beskriva ökningar och minskningar.
cirkeldiagram|procent-delen|?När totalantalet är känt beräknas antalet i en sektor som en procentandel; att enbart läsa andelar kräver inte detta.
cirkeldiagram|brak-del-hel|Hela cirkeln ses som en helhet och varje sektor som en andel av den.
diagram-vinkel|cirkeldiagram|Sektorns andel av hela datamängden kopplas till samma andel av cirkelns hela varv.
diagram-vinkel|vinkeltyper|?Sektorvinkeln behöver tolkas i grader av 360°; att bara kunna namnge vinkeltyper är inte tillräckligt.
diagram-vinkel|procent-delen|Sektorvinkeln beräknas genom att ta den givna procentandelen av 360°.
viktat-medel|medel|Summan av alla observationer delas med antalet observationer även när värden upprepas.
viktat-medel|frekvenstabell|Varje värde multipliceras med sin frekvens för att bidra rätt antal gånger till totalsumman.
histogram|frekvenstabell|Observationer samlas i klassintervall och frekvenserna används för staplarna i histogrammet.
histogram|stapel-stolp|?Höjd och frekvens kan jämföras med stapeldiagram, men histogrammets sammanhängande intervall behöver introduceras särskilt.
kvartiler|median|Medianen delar de sorterade värdena i två delar som används för att hitta nedre och övre kvartil.
kvartiler|variationsbredd|?Idén om avstånd mellan yttervärden jämförs med avståndet mellan kvartilerna; variationsbredd krävs inte för att hitta kvartiler.
ladagram|kvartiler|Median och kvartiler bestämmer lådans kanter och mittlinje på en gemensam skala.
ladagram|avlasa|Skalans värden avläses vid lådans kanter, medianstrecket och diagrammets ändpunkter.
val-lagesmatt|medel|Medelvärdets känslighet för stora och små extremvärden vägs in när ett lägesmått väljs.
val-lagesmatt|median|Medianens mittposition används när extremvärden skulle ge en missvisande bild av det typiska värdet.
val-lagesmatt|typvarde|Det vanligaste värdet används för att beskriva typiska kategorier eller återkommande värden.
vilseledande|stapel-stolp|Stapelhöjder jämförs med axelns skala för att upptäcka exempelvis en avklippt nollpunkt.
vilseledande|procent-jamfora|?Procentpåståenden i diagram granskas mot rätt jämförelsevärde; missvisande axlar kan granskas utan procentberäkning.
venndiagram|frekvenstabell|?Frekvenser kan föras in som antal i mängder och överlapp; venndiagram kan också byggas direkt från en lista.
venndiagram|addition|Antal i åtskilda delar summeras, medan ett överlapp måste undvikas att räknas två gånger.
sannolikhet-skala|brak-del-hel|En sannolikhet som 1/4 tolkas som en andel mellan ingen chans och säker händelse.
sannolikhet-skala|procent-begrepp|?Sannolikheter kan anges som 0–100 % och jämföras med 0–1; en skala i enbart bråk kräver inte procent.
gynnsamma-utfall|f-half|Andelar av lika sannolika utfall uttrycks som bråk, exempelvis hälften av utfallen.
gynnsamma-utfall|f-chance|Händelsens villkor används för att skilja möjliga gynnsamma utfall från omöjliga utfall.
komplement|sannolikhet-skala|En händelse och dess komplement täcker tillsammans hela sannolikheten 1.
komplement|brak-sub-lika|Komplementets sannolikhet beräknas som 1 minus händelsens sannolikhet, med lika nämnare när bråk används.
forvantat-antal|gynnsamma-utfall|Sannolikheten för ett gynnsamt utfall används som förväntad andel av många försök.
forvantat-antal|brak-del-antal|Antalet försök multipliceras med sannolikheten för att få det förväntade antalet gynnsamma utfall.
trad-oberoende|gynnsamma-utfall|Varje grens sannolikhet bestäms genom att räkna gynnsamma och möjliga utfall i det steget.
trad-oberoende|brak-multiplikation|Sannolikheterna längs en väg multipliceras för att få sannolikheten för hela följden.
trad-beroende|trad-oberoende|Trädets struktur och vägprodukter återanvänds, men nästa stegs sannolikheter ändras efter varje drag.
trad-beroende|brak-multiplikation|De ändrade sannolikhetsbråken multipliceras längs vägen, exempelvis 3/5 · 2/4.
flera-vagar|trad-oberoende|Trädet används för att hitta alla åtskilda vägar som leder till den sökta händelsen.
flera-vagar|brak-add-olika|Sannolikheterna för alternativa, ömsesidigt uteslutande vägar adderas med gemensam nämnare vid behov.
minst-en|komplement|Sannolikheten för minst en träff beräknas som 1 minus sannolikheten för ingen träff.
minst-en|trad-oberoende|Vägen utan någon träff identifieras och dess sannolikheter multipliceras innan komplementet tas.
experiment-sannolikhet|relativ-frekvens|Antalet observerade träffar divideras med antalet försök för att uppskatta sannolikheten.
experiment-sannolikhet|gynnsamma-utfall|?En teoretisk utfallsandel kan jämföras med försöksresultatet när utfallen är lika sannolika; en empirisk uppskattning kräver inte detta.
kombinationer|multiplikation|Antalet alternativ i varje val multipliceras när varje val kan kombineras med alla alternativ i nästa.
ordna-objekt|kombinationer|Multiplikationsprincipen används med ett färre val för varje plats när föremål inte får upprepas.
tva-tarningar|kombinationer|Sex utfall på första tärningen kombineras med sex på den andra och ger 36 ordnade par.
tva-tarningar|gynnsamma-utfall|De par som uppfyller villkoret räknas och jämförs med alla 36 lika sannolika par.
oordnade-val|ordna-objekt|Antalet ordningar inom samma grupp används för att ta bort dubbelräkning av ett och samma urval.
oordnade-val|kombinationer|Först räknas möjliga valföljder, sedan korrigeras antalet för att ordningen inte ska spela roll.
tre-drag|trad-beroende|Trädet förlängs med ett tredje steg och antalet kvarvarande föremål uppdateras efter varje drag.
tre-drag|minst-en|?Vid frågor om minst en träff kan sannolikheten för noll träffar dras från 1; andra frågor om tre drag behöver inte denna metod.
problem-bild|brak-del-antal|?Bråkdelar kan ritas som lika stora delar av ett band eller en mängd; andra bildproblem behöver inte bråk.
problem-bild|forhallande|?Förhållanden kan visas med lika stora bilddelar för att jämföra mängder; att representera problem med bild är bredare än detta.
problem-baklanges|ekvation-tva-steg|?Räkneoperationerna upphävs i omvänd ordning, som vid ekvationslösning; baklängesräkning kan också göras utan bokstäver.
problem-baklanges|brak-hela|?När ett slutvärde är en känd bråkdel återskapas helheten; andra baklängesproblem använder andra omvända operationer.
problem-tabell|frekvenstabell|?Rader och kolumner kan ordna prövade fall, men en problemlösningstabell behöver inte vara en frekvenstabell.
problem-tabell|uttryck|?En beräkningsregel kan ge värdet i varje tabellrad; enklare systematisk uppräkning kräver inte algebraiska uttryck.
problem-graf|jamfora-samband|?När två modeller jämförs kan skärningen visa när de ger samma värde; andra grafproblem kräver bara avläsning.
problem-graf|graf-avlasning|Grafens punkter och axlar används för att översätta en bild till svar på problemets storheter.
problem-ekvation|ekvation-text|Problemets villkor uttrycks som en likhet med en obekant storhet.
problem-ekvation|ekvation-bada|?Obekanta kan finnas i båda leden när två situationer jämförs; enklare problem kan lösas med en enklare ekvation.
problem-rimlighet|overslag|Ett ungefärligt svar jämförs med det beräknade svaret för att upptäcka orimlig storlek.
problem-rimlighet|langd-enheter|?I mätproblem kontrolleras att längdmåtten har förenliga enheter; problem utan längder kräver andra enhetskontroller.
problem-rimlighet|ekvation-provning|?Ett svar kan sättas tillbaka i en ekvation för kontroll; rimlighet kan också bedömas utan att en ekvation används.
problem-flersteg|problem-rimlighet|Efter flera beräkningssteg kontrolleras slutvärdets storlek och enhet mot frågan.
problem-flersteg|procent-delen|?I procentbaserade flerstegsproblem beräknas en del som används vidare; flerstegsproblem i allmänhet kräver inte procent.
problem-flersteg|volym-enheter|?I volymbaserade flerstegsproblem omvandlas kubikenheter eller liter mellan steg; andra problem använder andra enheter.
kod-variabel|variabel|En variabels aktuella talvärde följs när instruktioner tilldelar och ändrar värdet.
kod-variabel|prioritering|Räkneordningen avgör vilket nytt värde ett uttryck i en tilldelning ger.
kod-loop|kod-variabel|Variabelns nya värde förs vidare till nästa upprepning av instruktionerna.
kod-loop|monster|?En upprepad taländring kan visa ett mönster som förenklar spårningen; loopar kan också följas ett steg i taget utan mönsterregel.
kalkylblad|variabel|En cellreferens står för ett värde som används i formeln och kan ändras när cellens innehåll ändras.
kalkylblad|medel|?En medelvärdesformel summerar valda celler och delar med antalet; andra kalkylbladsformler behöver inte medelvärde.
simulering|kod-loop|Slumpförsöket upprepas många gånger och träffarna räknas under upprepningen.
simulering|experiment-sannolikhet|Simulerade träffar divideras med antalet försök och tolkas som en uppskattning av sannolikheten.
densitet|area-enheter|?Vid antal per area behöver ytor jämföras i samma kvadratenhet; massa per volym kräver i stället volymenheter.
densitet|decimal-division|Massa eller antal divideras med volym eller area för att beräkna mängd per enhet.
material|area-sammansatt|Delarnas areor beräknas och summeras till ytan som materialet ska täcka.
material|procent-okning|Spilltillägget beräknas som en procentuell ökning av det ursprungliga materialbehovet.
material|langd-enheter|Alla längdmått omvandlas till samma enhet innan area och materialåtgång beräknas.
moms|forandringsfaktor|Priset utan moms multipliceras med 1 plus den givna momssatsen i decimalform.
moms|procent-baklanges|Priset med moms divideras med förändringsfaktorn för att få priset utan moms.
amortering|ranta|Räntan beräknas på kvarvarande skuld och skiljs från beloppet som betalar av skulden.
amortering|multiplikation|Lika amorteringar summeras genom multiplikation med antalet betalningar, eller beräknas genom division.
amortering|addition|Skulden minskas med amorteringen och betalningen beräknas som amortering plus ränta.
trigonometri|triangel-typer|Den räta vinkeln och sidornas lägen i förhållande till en vald vinkel identifieras.
trigonometri|pythagoras-hyp|?Pythagoras kan ge en saknad sida före en trigonometrisk beräkning; givna sidförhållanden kan användas utan detta steg.
trigonometri|likformighet|Likformiga räta trianglar har samma sidkvoter vid samma vinkel, vilket ligger bakom de trigonometriska förhållandena.
f-compare|f-count|Talens ordning och mängdernas antal används för att avgöra vilket tal som är störst.
f-line|f-count|Talföljdens ordning placeras på tallinjen med ett lika stort steg mellan på varandra följande tal.
f-split|f-count|Ett räknat antal delas i två grupper vars antal tillsammans bildar det ursprungliga talet.
f-ten|f-split|Talet tio delas i två delar så att den saknade delen kan bestämmas.
f-add-small|f-split|Ett av talen delas upp för att först nå tio och sedan lägga till resten.
f-add-small|f-ten|?Tiokompisar används vid strategin att gå via tio, exempelvis 8 + 5 = 10 + 3; addition kan också göras med andra strategier.
f-sub-small|f-add-small|Den saknade delen i en addition används för att räkna skillnaden, exempelvis 7 + ? = 12.
f-add-place|f-add-small|Entalen adderas och en summa över nio kan växlas till ett tiotal och resterande ental.
f-add-place|positionssystem|Tio ental växlas till ett tiotal medan talets sammanlagda värde bevaras.
f-sub-place|f-sub-small|Efter eventuell växling används små differenser för att subtrahera entalen.
f-sub-place|positionssystem|Ett tiotal delas upp i tio ental när entalen annars inte räcker vid subtraktionen.
f-double|f-add-small|Dubbelt räknas som två lika stora delar som adderas; hälften söker en av de lika delarna.
f-groups|f-add-small|Lika stora grupper summeras med upprepad addition innan samma summa skrivs som en produkt.
f-table|f-groups|Varje tabellprodukt kopplas till antalet grupper och antalet föremål i varje grupp.
f-sharing|f-groups|Totalen delas i lika stora grupper för att hitta gruppstorleken eller antalet grupper.
f-remainder|f-sharing|Först bildas så många hela lika stora grupper som möjligt; det som inte räcker till en ny grupp blir resten.
f-half|f-sharing|En helhet delas lika i två eller fyra delar så att varje del är lika stor.
f-fraction-line|f-half|Intervallet från 0 till 1 delas i lika stora halvor eller fjärdedelar och delarnas ändpunkter markeras.
f-bodies|former|Kubens och rätblockets plana sidoytor känns igen som kvadrater och rektanglar.
f-length|positionssystem|?Sambandet 100 cm = 1 m använder hundratal; enkel jämförelse och mätning av längd kan börja före positionssystemet.
f-mass|positionssystem|Tusen gram grupperas till ett kilogram, så att måttets siffror får rätt värde vid omvandling.
f-mass|f-table|?Små multiplikationsprodukter används vid upprepade lika massor; sambandet gram–kilogram kräver främst faktorn 1 000.
f-volume|positionssystem|Tio deciliter grupperas till en liter, på samma sätt som tio ental blir ett tiotal.
f-clock|f-add-small|Tidssteg adderas för att räkna hur lång tid som gått eller vilket klockslag det blir.
f-time|f-clock|Klockans timmar och minuter används som utgångspunkt när tidslängder omvandlas.
f-time|f-table|Antalet timmar multipliceras med 60 för att få minuter, exempelvis 3 · 60 via 3 · 6 tiotal.
f-area|former|Figurens gräns identifieras så att rutorna innanför kan räknas som dess area.
f-area|f-table|?I rektangulära rutnät kan rader gånger kolumner ersätta uppräkning av varje ruta; rutor kan även räknas en och en.
f-angle|former|Två mötande sidor används för att urskilja en vinkel i figurens hörn.
f-scale|f-double|Vid fördubbling eller halvering ändras varje motsvarande längd med samma faktor.
f-scale|f-length|Längder mäts och jämförs före och efter förstoringen eller förminskningen.
f-median|f-compare|Värdena sorteras innan det mittersta väljs i den blandade grundkontrollen.
f-median|frekvenstabell|Antal förekomster används för att hitta det vanligaste värdet i kontrollens typvärdesfrågor.
f-chance|f-count|Möjliga utfall räknas för att se om inga, några eller alla uppfyller händelsens villkor.
f-combinations|f-groups|Varje alternativ i det första valet bildar en lika stor grupp av alternativ i det andra valet.
f-coordinate|f-line|Två tallinjers skalor används för att beskriva läget vågrätt och lodrätt.
f-proportion|f-table|Styckepriset multipliceras med antalet för att beräkna totalpriset.
f-proportion|f-sharing|Totalpriset delas lika på antalet varor för att få priset per styck.
f-word-add|f-add-small|Textens ökning eller sammanslagning av antal översätts till addition.
f-word-add|f-sub-small|Textens minskning eller jämförelse av antal översätts till subtraktion.
f-word-mult|f-table|Antalet grupper multipliceras med antalet i varje grupp för att få textproblemets total.
f-word-mult|f-sharing|En given total fördelas lika för att hitta antalet per grupp eller antalet grupper i textproblemet.
`;
  const byId=new Map(M.visibleNodes.map(n=>[n.id,n]));
  for(const node of M.visibleNodes){node.dependencyReasons={};node.dependencyReview={};}
  for(const line of (rows+extraRows+finalRows).trim().split('\n').filter(Boolean)){
    const [to,from,raw]=line.split('|');
    const node=byId.get(to);
    if(!node?.deps.includes(from)||!raw||node.dependencyReasons[from])throw Error('Ogiltig kopplingsmotivering: '+line);
    node.dependencyReview[from]=raw.startsWith('?');
    node.dependencyReasons[from]=raw.replace(/^\?/, '');
  }
  for(const node of M.visibleNodes)for(const from of node.deps){
    if(!node.dependencyReasons[from])throw Error('Saknad kopplingsmotivering: '+from+' → '+node.id);
  }
})();
