# Uppgiftsgranskning · åk 1–9

Granskningen omfattade ursprungligen 289 ID:n. Efter 25 sammanslagningar finns 264 gemensamma färdigheter och kontroller. Kartan visar 253 delmoment i 57 grupper samt sex fristående kort. Elva blandade kontroller ligger i sina grupper utan att räknas dubbelt. Alla äldre ID:n, frågor och elevsvar finns kvar. Den första genomgången omfattade 153 färdigheter i åk 1–3, 4–6 och 7. Åk 8–9 tillförde granskning av de återstående 136, inklusive fördjupningar och gymnasieblickar.

Alla dessa färdigheter använder nu den granskade banken. Den innehåller tre mallvarianter per färdighet, med slumpade tal, omkastade alternativ och olika frågeformer där det passar. Totalt finns 867 generatorvarianter, varav 408 tillkom för åk 8–9. Det är inte 867 fasta frågor: parametrarna ger fler frågor, medan vissa begreppsfrågor har en begränsad mängd meningsfulla varianter.

Av dessa hör 759 varianter till de 253 delmomenten, 33 till elva blandade kontroller och 75 till äldre sammanslagna ID:n. Ungefär hälften av delmomentens varianter i varje område har klickbara svarsalternativ, resten eget numeriskt svar. De numeriska flervalsfrågorna har normalt fyra alternativ med bland annat fel räknesätt, jämförelsebas, skalfaktor, tecken eller avrundningssteg. Vid jämförelse av givna tal eller bråk används just de angivna talen. Begreppsliga alternativ utgår från frågans innehåll. Naturliga ja/nej-frågor och vissa frågor med tre kategorier behåller två respektive tre svar. Alternativen och deras ordning sparas så att ett återupptaget pass använder samma fråga och samma facit.

## Återstående mallvarianter · 2026-10-15

De två föregående stickproven täckte 627 av bankens 867 kombinationer av ID och mallvariant. Denna genomgång omfattade samtliga återstående 240: 132 varianter i delmoment och 108 i blandade kontroller eller äldre sammanslagna ID:n. Därmed har exempel från alla 867 mallvarianter lästs igenom, inklusive frågor som fortfarande kan finnas i äldre profiler.

Varje återstående variant provades med ett reproducerbart slumpfrö och med minsta respektive största möjliga slumptal: sammanlagt 720 parameterfall. Frågetext, alternativ, facit, förklaring och bilddata lästes igenom. Vissa begreppsfrågor och gränsfall ger samma fråga, så detta är inte 720 unika frågetexter. Separata lösningsfunktioner kontrollerade facit från frågornas tal och bilddata. Dessutom kontrollerades min- och maxfall för hela banken, totalt 1 734 facitfall.

Genomgångens rättningar:

- Jämförelsefrågor om heltal, negativa tal och decimaler erbjuder endast talen som nämns i frågan. Ett nytt, ännu mindre eller större tal i alternativlistan kan annars göra urvalet otydligt.
- Vid beräkning av en riktig bråkdel eller högst 100 procent av ett antal hålls alternativen mellan noll och det hela. Alternativen prövar bland annat förväxling mellan delen, resten och det hela. Detta gäller särskilt angivna mallar; exempelvis procent över 100 och negativa tal behåller sina relevanta värden.
- Singularformer rättades för kulor, temperaturändringar, timmar, personer i recept och antal inträffade utfall.
- Vinkeluppgiften anger nu uttryckligen att en rak vinkel delas i två. Förklaringen av grundpotensform anger minst ett och mindre än tio.
- Förstoringsuppgiften om skalan n:1 varierar nu skalfaktorn mellan två och åtta, i stället för att alltid ha svaret fyra.
- Linjeekvationer får ett extra alternativ med halverad lutning och oförändrat startvärde. Den tidigare uppenbart orimliga konstantlinjen ersattes.
- Frekvenstabellernas totalsummor får alternativ som motsvarar enstaka rader, utelämnade rader eller dubbelräkning, i stället för exempelvis 1 100 svar i en liten tabell.

Alla 720 fall skickades genom sidans manuella svarskontroller med både rätt och fel svar, totalt 1 440 rättningskontroller. De 81 bildfrågorna kontrollerades även för klippt SVG-text. Skärmbilder granskades för samtliga 27 återstående bildvarianter och flera min-/maxfall. Elevlägets grafval, jämförelsefrågor, numeriska svar och bråksvar provades med riktiga klick och tangentbord i isolerad Chrome vid laptopstorlek 1366 × 768 och mobilstorlek 390 × 844. Hela regressionstestsviten passerade, inklusive pausade frågor, elevhistorik, utkast och export/import.

Inga matematiska facitfel hittades i dessa prov. Ändringarna påverkar nya frågor; sparade frågor, alternativ, facit och elevresultat behålls. Förkunskaper godkänns inte automatiskt.

Återskapa genomgången:

```powershell
python tests/run_browser.py
python tests/ui_preview.py tests/question-audit-remaining.json
python tests/ui_preview.py tests/question-visual-remaining.json
python tests/ui_preview.py tests/question-audit-remaining.json https://pontusedvardsson.github.io/MAtree/
```

`tests/question-audit-covered.js` dokumenterar de 627 tidigare granskade ID-/variantparen. `tests/question-audit-remaining.js` härleder resten från den aktuella banken. Kontrollfallen och resultaten skrivs till `.verification/question-audit-remaining.json`, `.verification/question-audit-all-edges.json` och `.verification/remaining-question-ui.json`. Skärmbilder sparas som `.verification/remaining-*.png`. Inga riktiga elevprofiler används.

Begränsningar: alla mallvarianter är nu representerade i genomläsningen, men inte varje möjlig kombination av slumpade parametrar. Några begreppsfrågor har få meningsfulla formuleringar och vissa felalternativ är fortfarande lätta. Kontrollerna bedömer svar, inte elevens fullständiga metod, och utgör ingen pedagogisk validering.

## Andra genomgången: 600 andra frågor

Fem nya omgångar genomfördes med 120 frågor vardera för åk 1–3, 4–6, 7, 8 och 9. Varje fråga jämfördes med hela förra stickprovet genom ett fingeravtryck av frågetext och bilddata. Alternativens ordning påverkar inte jämförelsen. Det nya stickprovet innehåller 600 olika frågor och ingen från föregående genomgång. Slumptalen sprids med ett nytt startfrö och mallvarianterna förskjuts ett steg.

| Omgång | Årskursurval | Nya frågor | Delmoment | Flerval | Bildfrågor |
|---|---|---:|---:|---:|---:|
| 1 | 1–3 | 120 | 26 | 79 | 11 |
| 2 | 4–6 | 120 | 61 | 71 | 9 |
| 3 | 7 | 120 | 77 | 65 | 5 |
| 4 | 8 | 120 | 91 | 58 | 8 |
| 5 | 9 | 120 | 104 | 60 | 10 |

Tillsammans täcks alla 253 delmoment. Alla 600 frågornas texter, alternativ, facit och bilddata lästes igenom. Facit kontrollerades med separata lösningsfunktioner. Varje fråga provades genom svarsformuläret med ett rätt och ett fel svar, totalt 1 200 rättningskontroller. Diagram och elevläge kontrollerades även med skärmbilder, riktiga klick och tangentbord vid 1366 × 768 och 390 × 844.

Ändringar från de nya omgångarna:

- **1–3:** Singularformerna `1 penna` och `1 rät vinkel` rättades. Dubbelt och hälften får alternativ som avser just dubblering, halvering eller en förväxling med addition/subtraktion.
- **4–6:** Avrundningsalternativ har nu samma precision som frågan ber om: exempelvis bara jämna tusental, eller tal på tiondelsnivå. Multiplikation och division med tiopotenser får platsvärdesalternativ. Onödiga periodiska decimaler tas bort som felalternativ i exakta decimaluppgifter.
- **7:** Frågor om positiva nämnare undviker noll och negativa alternativ. Rutnätsfrågor får felalternativ från den visade figurens rader, kolumner eller omkrets, i stället för exempelvis 1 000 rutor i ett litet rutnät.
- **8:** Glas i volymproblemen rymmer 0,2–0,5 liter. Formatkravet för nya frågor som uttryckligen ber om decimalform gäller även statistikfrågor som inte börjar med ”Skriv”. Periodiska decimalsvar får ett uttryckligt och fungerande avrundningsbesked; små sådana svar använder nio decimaler.
- **9:** Koordinatalternativ utgår från den ritade punkten och tecken-/axelförväxlingar. Negativa exponenter får flera rimliga små positiva tal som alternativ. Omvandlingsfel med faktorn 60 används i tidsuppgifter, inte generellt i alla uppgifter om samband.

Inga felaktiga matematiska facit hittades i stickprovet. Förbättringarna gäller språk, frågornas tydlighet och hur alternativen prövar färdigheten. Nya formatkrav sparas med frågan; äldre frågor och elevresultat behåller sina tidigare regler. Frågebankens färdigheter, pausade frågor, rapporter, profilbyte och export/import bevaras och regressionstestas.

Återskapa andra genomgången:

```powershell
python tests/run_browser.py
python tests/ui_preview.py tests/question-audit-second.json
python tests/ui_preview.py tests/question-visual-second.json
python tests/ui_preview.py tests/question-audit-second.json https://pontusedvardsson.github.io/MAtree/
```

Förra stickprovets fingeravtryck finns i `tests/question-audit-baseline.js`. De nya frågorna skrivs till `.verification/question-audit-second-600.json`. `.verification/second-audit-uniqueness.json` visar antalet nya frågor och noll överlapp; separata filer visar de 1 200 rättningskontrollerna. Inga riktiga elevprofiler används eller publiceras.

Kvarstående begränsningar: återkommande mallar kan likna varandra trots nya tal och bilder, och alla möjliga slumpvarianter har inte språkgranskats. Vissa felalternativ i övriga mallar är fortfarande relativt lätta. Automaträttningen bedömer svaren, inte elevens fullständiga metod.

## Första genomgången: fem granskningsomgångar 2026-10-15

Den publicerade sidan öppnades i Chrome. Därefter lästes 120 provfrågor per årskursurval med svarsalternativ, facit och bilddata. Facit räknades också fram med separata lösningsfunktioner från frågetexten och bilddata. Varje provfråga skickades genom det manuella svarsformuläret med både ett rätt och ett fel svar: 600 frågor och 1 200 rättningskontroller. Testerna använder isolerade syntetiska elevprofiler.

| Omgång | Årskursurval | Provfrågor | Olika frågor inklusive bilddata | Delmoment | Flerval | Bildfrågor |
|---|---|---:|---:|---:|---:|---:|
| 1 | 1–3 | 120 | 118 | 26 | 79 | 12 |
| 2 | 4–6 | 120 | 120 | 62 | 78 | 7 |
| 3 | 7 | 120 | 120 | 81 | 72 | 9 |
| 4 | 8 | 120 | 120 | 94 | 61 | 9 |
| 5 | 9 | 120 | 120 | 106 | 47 | 11 |

Urvalen täcker tillsammans alla 253 delmoment. Gemensamma färdigheter ingår i flera årskursurval. Två prov i åk 1–3 hade samma fråga i överlappande delmoment; även där granskades över 100 olika frågor. Fördelningen mellan flerval och eget svar i stickprovet skiljer sig från bibliotekets fördelning per mallvariant.

Åtgärder från genomgången:

- **Omgång 1:** Nämnarfrågan anger nu att bråket ska skrivas utan förkortning. Annars kunde exempelvis både 4 och 2 tolkas som nämnare för två färgade fjärdedelar. Bråkmodeller, prickar, former och tabeller granskades visuellt.
- **Omgång 2:** Decimalomvandlingar får decimalalternativ även inom bråkområdet. Platsvärdesuppgifter avrundas inte till tre decimaler i alternativen. Bråkfacit visas exakt, exempelvis `1/3`, och decimaler i listor skiljs åt med semikolon. Svarshjälpen följer det begärda formatet.
- **Omgång 3:** Primtalsfrågor blandar inte längre talalternativ med en definitionsmening. Bråkjämförelser behåller de två bråk som faktiskt ska jämföras. Alternativ visar inte negativ nolla.
- **Omgång 4:** Höga färdhastigheter gäller en bil. Klädval räknar par byxor. En omvänd kombinationsfråga anger uttryckligen att varje färg finns i varje storlek. Sambandstabeller, färdgrafer och sannolikhetsträd kontrollerades.
- **Omgång 5:** Nollan vid origo flyttades så att `−1` och `0` inte flyter ihop till `−10`. Momsfrågans inledning fick en fullständig mening. Nya uttryckliga decimalomvandlingar tillåter inte att eleven bara skriver av det givna bråket; formatvägledning räknas inte som ett inskickat svar. Det nya formatkravet lagras med frågan och ändrar inte äldre frågors rättning eller utkast.

Skärmbilder granskades för tabeller, bråkmodeller, tallinje, stapel-, linje- och cirkeldiagram, koordinatsystem, flera linjer, Pythagoras, lådagram och sannolikhetsträd. Elevläget testades med verkliga klick och tangentbordsinmatning vid 1366 × 768 och 390 × 844. För de 48 bildfrågorna kontrollerades dessutom att SVG-texterna ryms inom bildytan.

Regressionstesterna kontrollerar de konstaterade felen, exakta äldre alternativ, äldre svarsregler och utkast, samt formatvägledningen i både manuell kontroll och elevläge. Den fullständiga sviten omfattar även 13 005 oberoende facitkontroller, 7 590 blandade svarskontroller, rapporter, paus/återupptagning, profilbyte och export/import.

Återskapa kontrollerna:

```powershell
python tests/run_browser.py
python tests/ui_preview.py tests/question-audit.json
python tests/ui_preview.py tests/question-visual-audit.json
python tests/ui_preview.py tests/question-audit.json https://pontusedvardsson.github.io/MAtree/
```

Det reproducerbara stickprovet ligger i `tests/question-audit.js`. Körningen skriver frågor, facit, frö och årskurs till `.verification/question-audit-600.json`; gränssnittsresultat och skärmbilder hamnar också i `.verification/`. Materialet innehåller inga riktiga elevresultat och publiceras inte som en del av appen.

Kvarvarande begränsningar: stickprovet täcker inte varje möjlig slumpvariant eller en elevs resonemang och metod. Vissa felalternativ är fortfarande lätta att utesluta. Bedömning av öppna bråksvar gäller talvärdet och kräver inte en viss förkortning eller skriven metod.

Avrunda heltal och Avrunda och uppskatta heltal är en gemensam nod. Även identiska eller överlappande grundkontroller för positionssystemet, likhetstecknet, bråk av antal, likvärdiga bråk, bråkaddition, decimaler, decimaljämförelse, decimaladdition, räkneordning, enkla ekvationer, former, omkrets, tabellavläsning, frekvens, medelvärde och enkel sannolikhet har sammanförts. Överslagsräkning, negativa koordinater och senare geometri behåller separata moment där innehållet skiljer sig. Gamla resultat raderas inte; den senaste kontrollen på någon av de sammanslagna noderna visas på den gemensamma noden.

Ytterligare överlapp för negativa tal på tallinjen, talmönster, delning och multiplikationssamband, spegelsymmetri, vanliga procenttal och överslag delar nu färdighet. Gruppering av exempelvis bråk, Pythagoras, skala och ränta behåller däremot varje delmoments underlag. Beräkning av uttrycksvärden är fortsatt ett eget delmoment. Blandade kontroller kan prövas separat men godkänner inte övriga gruppmedlemmar.

## Viktiga ändringar

| Tidigare svaghet | Ändring |
|---|---|
| Division med rest gav alltid resten 1. | Rest och antal hela grupper varierar och kontrolleras separat. |
| Förlängning av bråk frågade bara efter täljaren. | Täljare, nämnare och fullständig omskrivning kontrolleras. Distraktorer ändrar bara ena delen. |
| Gemensam nämnare var nästan samma kontroll som förlängning. | Eleven identifierar en användbar nämnare och skriver om båda bråken till en angiven nämnare. |
| Medelvärde utgick ofta från en jämn talföljd. | Oregelbundna, osorterade data och olika antal observationer används. |
| Frekvensfrågor hade förutsägbara svar och typvärde var alltid ett enda värde. | Antalen och ordningen varierar. Flera typvärden prövas också. |
| Grundläggande sannolikhet räknade mest färger eller tärningssidor. | Omöjligt, möjligt men inte säkert och säkert skiljs uttryckligen åt. |
| Diagram och geometriska figurer beskrevs bara i text. | Tabeller, stapel- och linjediagram, cirkeldiagram, former, rutnät, koordinater, bråkmodeller och tallinjer visas. |
| Distributiva lagen kontrollerade bara koefficienten. | Även konstanten och hela utvecklingen prövas. |
| Mönsterfrågor bad främst om nästa tal. | Saknat tal, minskande följder och generell regel ingår. |
| Skala och procent gav ofta samma förhållanden eller svar. | Skalor och andelar varierar. Bild till verklighet och omvänd beräkning hålls isär. Rabattbelopp och nytt pris skiljs åt. |
| Skriftlig subtraktion kunde råka sakna växling. | Växlingsfallen konstrueras med lägre ental i det första talet. |
| Multiplikationsbanken missade 10 samt 0 och 1. | Dessa faktorer ingår i tabellfrågorna. |
| Extra kontroll kunde återgå till en redan klar frågetyp. | Den fjärde frågan återgår till den variant eleven missade. |

Frågorna för lågstadiets längd omvandlar hela meter, centimeter och blandade hela enheter. Decimalomvandling hör till senare grundmoment. Positiva decimalers avrundningsfacit beräknas från heltalsrepresentation för att undvika avrundningsfel i JavaScripts binära flyttal.

## Åk 8–9

| Område | Vad uppgifterna nu prövar |
|---|---|
| Tal och potenser | Decimalmultiplikation och division, olika teckenkombinationer, stora tal, prefix, negativa exponenter, normaliserad grundpotensform och räkning med både koefficient och exponent. Små prefixvärden visas utan att avrundas till noll. |
| Bråk | Heltal gånger bråk, två bråk, division med invers, saknad faktor eller divisor, minsta gemensamma nämnare och explicit förkortning mellan täljare och nämnare före multiplikation. |
| Algebra | Tecken framför parenteser, koefficienter och konstanter, hela utvecklingar, faktorisering, bråkuttryck, ekvationer med variabler i båda leden och olika nämnare. Andragradsekvationer skiljer mellan båda reella lösningarna och inga reella lösningar. |
| Geometri | Radie respektive diameter, bågar och sektorer, omvända beräkningar, olika volymformler och öppna respektive slutna ytor. Pythagoras använder flera slags trianglar. Förstorings- och förminskningsfaktorer prövas även för area och volym. |
| Samband | Koordinatsystem med negativa koordinater, avläsning i båda riktningarna, negativ och positiv lutning, startvärde, sambandstabeller, väg–tid-diagram och skärningspunkter. När en regel kopplas till en linje innehåller alternativen fel i både lutning och startvärde. |
| Procent | Varierade andelar, rätt jämförelsebas, omvända förändringar, upprepade ökningar och minskningar, procentenheter kontra relativ förändring samt index som inte alltid utgår från 100 i det aktuella jämförelseledet. |
| Statistik | Oregelbundna data och frekvenser, viktade medelvärden, lika breda histogramintervall, kvartiler med uttryckligen angiven metod, lådagram, venndiagram och avklippta diagramaxlar. |
| Sannolikhet | Komplement, förväntat kontra faktiskt antal, träddiagram med och utan återläggning, skilda vägar, minst en, experiment, ordnade och oordnade val samt tre drag. |
| Problemlösning | Sträckmodeller, baklängesräkning i olika ordningar, biljettfördelningar, grafavläsning, rimlighetsbedömning, flera steg, kod med variabler och loopar, kalkylbladsreferenser, simulering, densitet, materialåtgång och givna ekonomiska räknesituationer. |

Nya strukturerade bilder omfattar koordinatsystem och flera grafer, sambandstabeller, histogram, lådagram, venndiagram, träddiagram, markerade sträckor och rätvinkliga trianglar. Dessa används också i elevläget och sparas med frågorna. Triangelbilderna anger uttryckligen att de inte är skalenliga. Alla cirkel- och klotberäkningar anger vilket pi-värde som ska användas.

Kvartiler beräknas enligt medianen av respektive halva, med det mittersta talet uteslutet vid udda antal. Andra konventioner finns; den angivna metoden gör facit entydigt för dessa uppgifter. Ränte-, moms- och amorteringsuppgifter anger sina antaganden i själva uppgiften.

## Variation och sparat underlag

Nya frågor jämförs med nyligen använda frågor i elevprofilen. Frågetext och bilddata ingår i jämförelsen. Manuella och automatiska kontroller kan undvika frågor som använts i det andra läget. Om alla varianter av en begränsad begreppsfråga har använts kan den återkomma.

Gamla elevresultat och pausade frågor finns kvar med sina ursprungliga facit. Diagram, svarstyp och frågevariant sparas med nya frågor och följer med vid export/import. Bilder renderas från begränsade strukturerade data, aldrig från HTML i en importfil.

För att pröva den nya banken även för färdigheter som redan har gröna resultat: välj **Pröva även tidigare visade färdigheter** när elevpasset startas.

## Verifiering

`python tests/run_browser.py` kontrollerar bland annat:

- 13 005 oberoende facitfall för den granskade banken: 15 parameterfall för var och en av de tre varianterna inom samtliga 289 färdigheter. Beräkningarna utgår från tal och förhållanden i den tryckta frågetexten eller diagrammets data. För algebra kontrolleras uttryckens värden, för två tärningar räknas utfallsparen och för oordnade val räknas grupperna separat.
- 86 700 genererade frågor över hela kartan för giltiga svar och unika alternativ.
- 7 590 kontroller av blandade svarssätt på de 253 delmomenten: korrekta och entydiga alternativ, numeriska visningsvärden, fördelning per område, strikt val av alternativ och sparade alternativ. Felsvar bedöms som underlag för uppföljning, inte som bevis på en viss missuppfattning.
- 51 kombinationer av grupper, årskursurval, områden, nivåer och öppnade delmoment: inga tappade färdigheter eller beroenden, inga cirkulära grafer. Lärarvyn kontrolleras för separata resultat, öppning, sökning och bevarade blandade kontroller.
- Tidigare mallars 72, 570 och 165 fasta facitfall, så att de äldre bankerna fortsatt kan kontrolleras för bakåtkompatibilitet.
- Variation i tidigare konstanta svar, undvikande av nyligen använda frågor och återgång till missad frågevariant.
- Sparade bilder efter omladdning, export/import, återupptagning av äldre profiler och resultat med rätt antal frågor.
- Serialisering och rendering av samtliga nya bildtyper, avvisning av felaktiga bilddata och läsbarhet av mycket små prefixvärden. Dator- och mobilvyer kontrolleras; skärmbilder tas även för de nya representationerna.

Exempel och skärmbilder skrivs till `.verification/question-audit.json` och `.verification/preview-question-*.png`.

## Bedömningens gränser

Korrekt facit och bättre variation gör kontrollfrågorna mer användbara, men innebär inte pedagogisk validering eller en betygsprognos. Tre frågor täcker inte alla representationer och strategier för en färdighet. Konstruktion, mätning, längre resonemang och elevens muntliga förklaring behöver fortfarande undersökas separat. En svarsmall som accepterar likvärdiga numeriska bråk kan heller inte ensam avgöra om eleven faktiskt skrev ett bråk i enklaste form.

Att välja rätt linje visar koppling mellan regel och graf, men prövar inte att eleven själv kan rita linjen. Sträckmodellerna hjälper till att tolka en bild; elevens egen förmåga att skapa en modell behöver också följas upp. Ett korrekt slutsvar visar inte vilken metod eleven använde, även när uppgiften uppmuntrar förkortning eller tabellarbete. De ursprungliga svaren i avslutade eller pausade pass ändras inte av den nya uppgiftsbanken.

## Fem omgångar med webbläsargranskning · 2026-10-14

Granskningen växlade mellan skärmbilder i isolerad Chrome, förbättringar och nya kontroller. Frågor öppnades också i den riktiga uppgiftsdialogen. Mobilvyer kontrollerades vid 390 px bredd. Webbgranskningen omfattade representativa bild- och språkfall; den var inte en manuell genomläsning av varje möjlig slumpad fråga.

| Omgång | Problem och åtgärd | Kontroll |
|---|---|---|
| 1 | Grafbokstäver kunde hamna tillsammans och göra linjerna svåra att identifiera. Koordinatsystem fick ljusare rutnät, tydliga axlar, separata linjestilar, en teckenförklaring och bokstäver på rätt linje. | Skärmbilder av flera grafer, negativa koordinater, mobilvy och uppgiftsdialog. |
| 2 | Statistikbilder behövde tydligare axlar och större utrymme. Stapel-, linje- och histogram fick tunnare hjälplinjer. Lådagrammets tal separerades. Avklippt axel markeras och träddiagram förklarar V och S. | Histogram, staplar, linjediagram, avklippt axel, lådagram och träddiagram öppnades på nytt; träddiagram även på mobil. |
| 3 | Ränte- och momsfrågor kunde visa långa decimalutvecklingar. Belopp beräknas och väljs nu så att dessa frågetexter får hanterbara tal. Flervalsalternativ för längder, priser och andra storheter begränsas till icke-negativa värden. | Nya exempel, riktade kontroller samt fullständig testsvit. Negativa tal finns fortsatt i frågor där tecknet är relevant. |
| 4 | Några formuleringar var vaga eller terminologiskt missvisande. Ränta i kronor skiljs från räntesats i procent, skaluppgifter anger enheter och riktning, och grafval beskriver vad eleven faktiskt ska göra. Även bråk, varv, prismor och sannolikhetsfrågor fick språkjusteringar. | Samma slumpfrön jämfördes före och efter. Testets oberoende ekvationstolkning uppdaterades för både äldre och nya graftexter. Facitkontrollerna passerade. |
| 5 | Grundläggande koordinatsystem klippte axeltext. De använder nu samma tydliga renderer som övriga koordinatsystem, med originalets punktdata. Flervalsfrågor ger inte längre en instruktion om att skriva utan enhet. | Geometri och grundbilder öppnades på nytt. Mobilbild, uppgiftsdialog, bildgränser och hela testsviten kontrollerades. |

### Jämförelse med bokmaterialet

Språkets riktmärke var textutdrag från de tillhandahållna Matte Direkt-böckerna: åk 7 bråk, åk 8 samband och sannolikhet samt åk 9 geometri och procent/statistik. Frågorna använder kortare, direkta uppmaningar och etablerade matematiska termer. Denna jämförelse gäller formuleringar och begrepp, inte en fullständig visuell jämförelse med alla originalbilder. Uppgifterna är egna genererade frågor.

### Slutlig verifiering

- Hela `python tests/run_browser.py` passerade: 13 005 oberoende facitberäkningar, 86 700 kontroller av genererade frågor och 7 590 kontroller av blandade svarssätt, plus användarflöden och sparat underlag.
- Ett extra stickprov omfattade 5 202 nya frågor från samtliga 289 ursprungliga färdighets-ID:n, med 19 bildtyper. Kvarvarande långa decimaler i detta stickprovs frågetexter hörde till avsiktliga omvandlingar av mycket små prefixvärden.
- Nya regressionstester mäter SVG-texternas faktiska utbredning i webbläsaren för tre exempel per frågevariant. Ingen text klipptes i slutkontrollen. Ränte-/momsformatering och negativa mängdalternativ kontrolleras också.
- Testsviten verifierar fortsatt paus, omladdning, elevläge, lärarens sammanställning, export/import och äldre sparade frågor. Äldre frågetext, facit och svarsalternativ skrivs inte om. Bildernas utseende förbättras även när samma äldre bilddata används.

Skärmbilder och stickprov finns i `.verification/tasks-r*-*.png`, `.verification/tasks-audit-final.json` och `.verification/tasks-visual-bounds-after.json`. Granskningshjälpen `tests/question-gallery.js` används endast av webbläsarkontrollerna; facit som visas i granskningsgalleriet visas inte i elevens uppgift.

### Kvarvarande begränsningar

Automatiska kontroller kan kontrollera facit, alternativ och bildgränser, men avgör inte att varje slumpad fråga är pedagogiskt välformulerad. Några geometribilder är avsiktligt schematiska och anges som icke skalenliga. Numeriska svar och grafval prövar fortfarande inte elevens egen konstruktion, längre resonemang eller valda metod. De tidigare beskrivna bedömningsgränserna gäller fortsatt.
