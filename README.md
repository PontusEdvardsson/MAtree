# MAtree

En körbar prototyp för kartläggning av matematikkunskaper hos högstadieelever, inspirerad av quest-träd i moddat Minecraft.

Öppna `index.html` i Chrome, Edge eller Firefox. Ingen installation, server, inloggning eller API-nyckel krävs. Alla resurser finns lokalt.

Växla mellan **Mörkt tema** och **Ljust tema** med sol-/månknappen uppe till höger, även i elevläget. På mobil visas bara ikonen. Sidan följer datorns tema tills du väljer själv; ditt val sparas i webbläsaren separat från elevprofilerna. Kartan, uppgiftsbilderna och sammanställningarna följer samma tema.

Sidan kan också publiceras på GitHub Pages. Se [GITHUB_PAGES.md](GITHUB_PAGES.md) för uppladdning till PontusEdvardsson/MAtree, PDF-filer och flytt av elevprofiler. `python tests/build_pages.py` skapar ett paket med appen och dess länkade bokfiler.

## Vad som går att göra

- Utforska **253 delmoment och 489 beroenden** i nio områden. Standardvyn visar 57 öppningsbara grupper och sex fristående delmoment, totalt 63 kort. 25 överlappande ID:n delar nu en gemensam färdighet och elevhistorik.
- Filtrera på område, årskurs, grön bas eller röd fördjupning. En färdighet kan ingå i flera årskursvyer och har alltid ett gemensamt elevresultat.
- Öppna en nod och välj **Visa hela förkunskapskedjan** för att se alla tidigare byggstenar över områdesgränserna. Zooma och rulla kartan i båda riktningar.
- Se bok och sida för bokanknutna moment, och kursplanen som områdesunderlag för de nya grundmomenten. Läs hela kartan i [KUNSKAPSKARTA.md](KUNSKAPSKARTA.md).
- Klicka på valfri nod och genomför tre frågor med återkoppling. Frågor skapas med matematiska mallar; tal varierar där det passar.
- Välj ett klickbart svarsalternativ eller ange heltal, negativa tal, decimaltal och bråk som `1/3`.
- Se elevöversikt, senaste resultat och förslag på nästa kontroll. Öppna en prövad nod för att granska elevens faktiska svar och frågornas förklaringar från senaste omgången.
- Skapa elevprofiler och fortsätt senare, även mitt i en omgång. Exportera/importera JSON för säkerhetskopiering och flytt mellan datorer. Import lägger till kopior och skriver inte över befintliga profiler.

## Motiveringar till kopplingarna

Alla 489 riktade kopplingar har en egen kort matematisk motivering. Öppna ett delmoment för att läsa **Bygger på** och **Leder vidare till**. Samma motivering visas från båda håll. I grupper finns utfällbara listor för inkommande, utgående och interna kopplingar mellan de faktiska delmomenten. Kartpilarnas hjälptexter visar också motiveringarna.

**Samband att granska** markerar en möjlig metod, jämförelse eller begränsad tillämpning som inte ska tolkas som ett generellt förkunskapskrav. Texten anger begränsningen. Markeringen ändrar inte grafen, elevresultat eller urvalet i elevpass. Kopplingarna är pedagogiska förslag och är inte fastställda av böckerna eller Skolverket.

Motiveringarna sätts efter sammanslagningen i [dependency-reasons.js](dependency-reasons.js), med ett uttryckligt par av förkunskap och mål för varje text. Filen omfattar också de 24 kopplingarna till bevarade blandade kontroller. Saknade, dubbla eller inaktuella par ger ett fel vid laddning i stället för att ersättas av generiska beskrivningar.

## Rapporter och elevprofiler

När ett delmoment öppnas från ett automatiskt pass visas just det passets sparade frågor, svar och utfall. Det senaste samlade underlaget öppnas separat. Rapporten ger högst tre motiverade förslag på fortsatta kontroller och samlar svar per delmoment. Filtren skiljer på felsvar, överhoppade frågor och begränsat underlag.

Profillistan räknar unika prövade delmoment från både manuella och automatiska kontroller, även sparade svar i pågående pass. Sammanslagna färdigheter räknas en gång. Antalet avslutade pass visas separat. Aktiv elev visas överst på sidan och senaste sammanställningen nås vid startknappen för elevläge.

Elevläget visar bild och svar bredvid varandra när skärmen rymmer det. Svara och Jag vet inte ligger tillsammans. I kartvyn kan samlad statistik fällas ut; filtren följer med vid scrollning och sökning visar uttryckligen enskilda delmoment.

## Uppgifter upp till åk 9

Samtliga 253 delmoment använder en granskad bank med tre mallvarianter per färdighet, totalt 759 generatorvarianter. Dessutom finns 33 varianter i elva blandade kontroller och 75 varianter under äldre sammanslagna ID:n. Alla ursprungliga 289 ID:n och 867 varianter finns kvar. Efter åk 1–7 har även de återstående 136 färdigheterna i åk 8–9 gåtts igenom, inklusive fördjupningar. Frågorna kan innehålla bråkmodeller, geometriska figurer, koordinatsystem, flera grafer, tabeller, histogram, lådagram, venndiagram och träddiagram. Facit, bilder och svarstyp sparas med frågan.

Ungefär hälften av varianterna i varje område är flerval. Eleven klickar på ett alternativ och sedan **Svara**. Numeriska flervalsfrågor har normalt fyra alternativ. Vid jämförelse av givna tal eller bråk behålls just de angivna talen. Frågor med naturligt två eller tre svar, exempelvis ja/nej och större/lika/mindre, behåller dessa. Begrepp kan prövas oftare med flerval, medan andra delmoment blandar båda svarssätten. Fördelningen gäller biblioteket och garanterar inte exakt hälften under ett kort elevpass. Alternativen blandas och sparas i sin exakta ordning med frågan. Lärarvyn visar det valda alternativets text.

Nya frågor som uttryckligen ber eleven skriva ett tal i decimalform kräver decimalnotation. Att kopiera bråket ger formatvägledning och räknas inte som ett inskickat svar. Det nya formatkravet sparas med frågan; äldre frågor, elevresultat och påbörjade utkast behåller sina tidigare regler. Bråkfacit visas som exakta bråk.

Avrunda heltal och Avrunda och uppskatta heltal delar en nod. Andra sammanslagningar omfattar bland annat likvärdiga bråk, decimaladdition, räkneordning, omkrets, medelvärde, frekvenstabeller, negativa tal på tallinjen, enkla talmönster, delning och multiplikationssamband, spegelsymmetri, vanliga procenttal och överslag. Gamla resultat behålls under sina ursprungliga ID:n och används i den gemensamma färdigheten; senaste direkta kontrollen har företräde. Pausade äldre frågor behåller sitt svarssätt och facit. Avrundning och överslagsräkning är fortsatt olika delmoment.

Grupperna samlar närliggande färdigheter utan att slå ihop deras underlag. Klicka på en grupp för att välja delmoment. ”Visa delmoment i kartan” öppnar en grupp i kartan och ”Alla delmoment” visar varje färdighet. Sökning och förkunskapsfokus visar också de enskilda färdigheterna. Gruppens räknare gäller delmoment i aktuellt urval; de övriga går att öppna i en separat lista. En delvis prövad grupp får inte markeringen visad kunskap för hela gruppen.

Gruppvyn ligger i ett kompakt rutnät anpassat efter fönstret. Peka på ett kort eller fokusera det med tangentbordet för att se dess kopplingar. ”Visa alla kopplingar” visar pilarna tillsammans. Detaljvyn behåller progressionens kolumner, rullning, zoom och dragning. På små skärmar visas en meny med text högst upp.

Pythagoras, olika riktningar av skala, ränta och procentförändringar behåller separata frågor och resultat inom sina grupper. Att beräkna värdet av ett uttryck är ett eget delmoment. Elva breda blandade kontroller finns kvar inne i respektive grupp, med sina frågor och tidigare resultat. De räknas inte som ytterligare delmoment och väljs inte i nya automatiska pass. Inga frågor eller elevsvar har raderats.

Frågor väljs så att nyligen använda frågor undviks när det finns alternativ. Historiken från manuella och automatiska pass kan användas tillsammans. Vid en extra kontroll återgår elevläget till den frågevariant eleven missade. Gamla frågor och elevresultat bevaras. Se [UPPGIFTSGRANSKNING.md](UPPGIFTSGRANSKNING.md) för ändringar, kontrollfall och begränsningar.

## Automatisk kartläggning

Välj **Årskursurval** och **Kunskapsområde** för att till exempel kartlägga **Tal · åk 7**. **Alla områden** behåller en bred kartläggning. Både vanliga pass och **Testa alla** håller sig till kombinationen av årskurs och område. Förkunskaper utanför urvalet undersöks separat och godkänns inte automatiskt. Området följer med vid paus, omladdning, export/import och i rapportens rubrik.

Antal delmoment, frågor och tid för Testa alla anpassas till urvalet. Tal i åk 7 omfattar 18 delmoment och 36–72 frågor, ungefär 36–72 minuters arbete vid en minut per fråga. Ett urval utan delmoment kan inte startas; om endast fördjupning finns föreslås Testa alla.

Välj en elevprofil och klicka **Starta elevläge**. Välj **åk 1–3, 4–6, 7, 8 eller 9** och högst 30, 60 eller 90 uppgifter, eller **Testa alla**. Passet håller sig till det valda årskursurvalet. Tidigare förkunskaper undersöks i ett separat pass och godkänns inte automatiskt. Eleven väljer ett alternativ och klickar Svara, eller skriver ett eget svar och trycker Enter. Eleven kan också välja ”Jag vet inte”. Facit och rätt/fel visas först i lärarens sammanställning. Årskurs och färdighetsnivå visas inte under elevens arbete.

Ett delmoment får upp till fyra frågor. Enstaka fel följs av en annan variant. Minst tre rätt och högst ett fel ger visad kunskap i passet; två fel eller överhoppade frågor ger uppföljning. Efter svårigheter undersöks en närliggande förkunskap inom samma årskursurval. Urvalet prioriterar områden med färre insamlade svar och går vidare till efterföljande moment när direkta förkunskaper inom urvalet har visats. Förkunskaper utanför urvalet ger varken uppgifter eller ett automatiskt godkännande i passet. Bekräftat indirekt underlag räknas inte som direkt prövning. Varje nytt pass börjar inom valt årskursurval; ett pausat pass fortsätter exakt där det slutade. Äldre blandade pass behåller sitt ursprungliga urval och kan fortfarande återupptas.

Passet avslutas vid vald gräns eller när inga fler lämpliga moment finns under dessa regler. Kryss, Escape, klick utanför kontrollrutan och att lämna sidan avslutar en öppen kontroll. Endast ett uttryckligt val av **Pausa** sparar kontrollen för fortsatt arbete. Ett pausat pass kan återupptas efter omladdning. Sammanställningen skiljer på visat, uppföljning, begränsat underlag och det som inte prövats. Inskickade frågor, elevsvar, facit och urvalsskäl sparas i elevprofilen och följer med vid export/import. Elevöversikten listar tidigare pass.

**Testa alla** prövar samtliga delmoment i den valda årskursens innehåll, inklusive fördjupning och tidigare visade färdigheter. Det vanliga urvalets stopp vid bristande förkunskaper används inte i detta läge. Varje delmoment får fortfarande 2–4 frågor och bedöms separat; inga förkunskaper godkänns automatiskt. De vanliga passen på 30, 60 och 90 frågor behåller sina urvalsregler och sin basavgränsning.

Före start visas antal delmoment, minsta och högsta frågeantal samt grov arbetstid vid ungefär en minut per fråga. Exempel: åk 4–6 har 62 delmoment och kräver 124–248 frågor, ungefär 2–4 timmar utan pauser. Uppskattningen följer valt årskursurval; elevens tempo kan ge kortare eller längre tid. Kartläggningen kan delas över flera tillfällen genom paus och återupptagning.

Ett fullföljt Testa alla-pass märks **Alla delmoment i valt årskursurval har prövats**. Detta innebär insamlade svar på varje delmoment, inte att alla färdigheter är visade eller att kartläggningen är pedagogiskt validerad. Läget följer med vid omladdning och export/import; äldre pass fungerar som tidigare.

Urvalet är en första regelstyrd version. Det har ingen kalibrerad svårighetsskala eller statistisk skattning av elevens nivå. Frågorna ger ett begränsat underlag; läraren behöver följa upp elevens resonemang.

## Årskursens innehåll i elevpass

Nya pass för åk 7–9 utgår från delmomentens kursplacering och primära bokhänvisning (`courseYears`). Kartans extra återkommande förkunskaper (`yearViews`) läggs inte automatiskt till i passet. Detta gäller både vanliga pass och **Testa alla**, i alla områden. Färdigheter som faktiskt ingår i flera kurser behåller ett gemensamt resultat.

Exempel: **Tal · åk 9** innehåller 15 basmoment om stora tal, prefix, potenser, grundpotensform, kvadratrötter och talmängder. Testa alla lägger till fördjupningen Räkna med kvadratrötter: totalt 16 delmoment, 32–64 frågor och ungefär 32–64 minuter vid en minut per fråga. Ett nytt pass startar på årskursens innehåll även när eleven saknar tidigare resultat. Grunder väljs separat; kunskap där godkänns aldrig automatiskt.

Urvalsregeln sparas som `selection: 'course'` i nya pass och bevaras genom paus, omladdning och export/import. Äldre pass utan denna markering behåller sitt tidigare urval, sina frågor och utkast. Äldre högstadiepass märks **äldre urval med grunder**. Avsluta ett sådant pass och starta ett nytt för det nya årskursurvalet. Rapporternas antal oprövade moment beräknas från det urval som hör till respektive pass.

`tests/course-scope-tests.js` kontrollerar det uttryckliga innehållet för Tal åk 9, skillnaden mot Grunder, årskurs 7–9, fullständiga pass även efter överhoppade svar samt äldre och nya sparade frågor. `python tests/ui_preview.py tests/course-scope-preview.json` testar start, utkast, paus, mobilvy, omladdning och rapport i Chrome.

## Färdigheter i flera årskurser

Varje färdighet har ett unikt ID, en föreslagen första inlärning (`learnedAt`) och en lista över årskursvyer där den ingår (`yearViews`). Exempel: Förlänga bråk lärs in under åk 4–6 och ingår även i åk 7, 8 och 9. Resultat och frågor hör till samma ID i alla vyer. ”Alla år” räknar varje färdighet en gång. Svårare delmoment behåller separata ID:n och godkänns inte genom ett resultat på en enklare färdighet.

Vyerna bygger på tidigare kursplacering och bokhänvisning, plus uttryckligen angivna återkommande moment i åk 8 och 9. Repetitionslistorna är pedagogiska förslag och kan justeras i `foundations.js`. Genrepet-hänvisning innebär inte automatiskt att alla sådana noder läggs i åk 9-vyn. Ingen vy innehåller kopior av noder eller resultat.

Vid start av ett automatiskt pass används det senaste direkt visade underlaget på samma färdighet, även om det kom från en annan årskursvy. Dessa färdigheter behöver inte prövas igen och visas separat i sammanställningen som tidigare visade vid passets start. Välj **Pröva även tidigare visade färdigheter** för en ny kontroll. Indirekta metodbekräftelser används inte som direkt godkännande. Äldre pausade pass återupptas med sina befintliga frågor.

## Tidigare grunder och indirekt underlag

Grunder innehåller 86 delmoment efter första inlärning: 26 inom åk 1–3 och 60 inom åk 4–6. Vissa färdigheter ingår i båda urvalen, så 4–6-filtret visar 62 delmoment. Ursprungligen tillkom 55 mindre grundmoment; överlappande kontroller delar nu samma färdighet. Andra moment har flyttats från högstadiet till tidigare grunder. Bokhänvisningen kan fortfarande vara till åk 7–9: bokens placering bestämmer inte när kunskapen först lärs in. Ingen grundnod kräver en högstadienod.

De nya delmomenten använder Lgr22:s centrala innehåll som områdesunderlag, inte som en officiell lista med exakt denna finfördelning. Grundkartan är fortfarande ett pedagogiskt förslag, med enklare textfrågor och begränsad representation av exempelvis diagram, konstruktioner och programmering.

Indirekt underlag skapas bara för särskilt angivna kopplingar mellan en uppgift och en möjlig delfärdighet, exempelvis förlängning av bråk vid addition med olika nämnare. Ett rätt slutsvar markerar möjligheten att granska metoden; det godkänner aldrig alla förkunskaper. Öppna den tidigare noden och välj **Bekräfta observerad metod** när elevens lösning eller muntliga förklaring faktiskt visar metoden. Bekräftelsen får en separat markering och kan ångras. Ett direkt felsvar har fortsatt företräde i nodens status.

## Pedagogisk idé

Högstadiet är målgruppen. Trädet utgår från delområden i de lokala PDF-böckerna Matte Direkt 7–9 v3. Gröna grundkursen används, enligt lärarens önskemål, som riktmärke för basen vid slutet av nian. Genrepet i Sluttampen, tryckta sidor 178–241, ger en särskild koppling till bokens repetition inför NP. Styva linan och röda avsnitt är fördjupning. Gymnasieblickar är också märkta fördjupning.

Nivån avgörs utifrån hela progressionen. Ett moment som är rött i åttan kan vara bas i nian om det där behandlas i gröna kursen eller Genrepet. Exempel: upprepad procentuell förändring. Ingen basnod kräver en fördjupningsnod.

Det finns 225 delmoment i basen och 28 fördjupningsmoment. Elva blandade kontroller hålls utanför dessa räknare. NP-översikten visar alltså 225 delområden i basen, inklusive tidigare grunder. Genrepet-hänvisningarna finns kvar som bokreferenser. Räknaren visar insamlat underlag, inte betyg eller sannolikhet att klara NP.

Alla noder kan prövas direkt. I manuella kontroller ger tre rätt av tre **visad kunskap**. Automatiska pass kräver minst tre rätt och högst ett fel på samma delmoment. Färre rätt markerar **behöver följas upp**, vilket i elevöversikten presenteras som något att undersöka vidare. Oprövade förkunskaper markeras separat; ett godkänt resultat på en senare nod godkänner inte automatiskt tidigare noder. Manuella och automatiska resultat visas tillsammans med datum och faktiskt antal frågor. Manuella historiker behåller högst 100 omgångar per färdighet; de 30 senaste automatiska passen sparas. Ett delmoment med få svar i ett automatiskt pass markeras som begränsat underlag.

Förslaget på nästa kontroll prioriterar en oprövad direkt förkunskap till en nod som behöver uppföljning. Annars föreslås centrala ingångar för högstadiet och därefter andra oprövade färdigheter. Detta är en enkel navigationsregel, inte en statistisk diagnosmodell.

## Begränsningar och nästa utvecklingssteg

Detta är ett pedagogiskt utkast, **inte en validerad diagnos eller en officiell NP-kravlista**. Bokreferenserna identifierar var ett moment behandlas; uppdelningen i mindre färdigheter och beroendepilarna är egna pedagogiska förslag. Hänvisningarna innebär inte att boken uttryckligen anger varje beroende. Granska och justera dem tillsammans med lärare.

Kartan täcker en bred progression i huvudkapitlen, Genrepet, utvalda röda avsnitt, Styva linan och gymnasietillämpningar. Den är inte en inventering av varje enskild uppgift eller av alla svarta utmaningssidor. Frågorna är nyskrivna mallfrågor, inte återgivna bokuppgifter. Svar är numeriska eller val av ett numrerat alternativ; algebraiska uttryck kontrolleras genom delkomponenter eller alternativ, inte en allmän symbolisk rättare. Diagram och grafer visas nu även för åk 8–9. Att välja rätt graf eller tolka en bild ersätter inte en kontroll där eleven själv ritar och förklarar.

Tre korta frågor visar ett begränsat underlag. Fritextsvar, muntliga resonemang, varierade representationer och uppgifter som skiljer mellan typiska missuppfattningar bör tillföras inför verklig diagnostisk användning. Ett felaktigt svar pekar inte säkert ut en viss bristande förkunskap. De föreslagna kopplingarna är saker att undersöka.

Profiler sparas i webbläsarens `localStorage`, inte på en server. Det finns inga konton, åtkomstroller eller automatisk synkning mellan datorer. Använd smeknamn i prototypen. Den som har tillgång till samma webbläsarprofil kan se uppgifterna. Säkerhetskopior innehåller profilnamn och resultat. Lagring för lokala filer kan bete sig olika mellan webbläsare och sökvägar; exportera innan du flyttar mappen eller rensar webbläsaren. Om lagringen inte fungerar visas det tydligt och profiler kan fortfarande exporteras.

En nästa version för skolbruk bör ha en lärargranskad färdighetskarta, en bredare uppgiftsbank med koppling mellan felsvar och möjliga missuppfattningar, samt skolans godkända lösning för inloggning och elevdata.

## Filer

- `index.html`: gränssnitt och dialoger.
- `styles.css`: responsiv formgivning, utan externa resurser.
- `curriculum.js`: färdighetsgraf, frågemallar och tolkning av svar.
- `skill-catalog.js`: utökad färdighetskarta med nivå, beroenden, bokhänvisningar och NP-kopplingar.
- `questions-expanded.js`: egna frågor för de nya delområdena.
- `foundations.js`: 55 nya grundmoment, frågor och korrigering av stadieindelningen.
- `skills-consolidated.js`: 25 sammanslagningar, gemensamma beroenden och kompatibilitet med äldre ID:n.
- `skill-groups.js`: öppningsbara grupper, separata blandade kontroller och sammanfattning av förkunskapsgrafen utan att tappa kopplingar.
- [dependency-reasons.js](dependency-reasons.js): specifika motiveringar och granskningsmarkeringar för de slutliga riktade kopplingarna.
- `questions-reviewed*.js`: granskade och utökade mallar för alla 289 färdigheter upp till åk 9.
- `questions-mixed.js`: fördelning av svarssätt, numeriska och begreppsliga svarsalternativ och formatoberoende jämförelse av nyligen använda frågor.
- `question-media.js`: validering och visning av strukturerade figurer och diagram samt svarshjälp.
- `adaptive.js`: regelstyrt uppgiftsurval, underlag, importvalidering och indirekta kopplingar.
- `adaptive-ui.js`: elevens arbetsyta och lärarens sammanställning.
- `app.js`: trädet, elevprofiler, kontroller och lagring.

De ursprungliga 24 nodernas ID:n och frågor finns kvar så att tidigare elevresultat och pausade omgångar kan läsas. Nya delnoder får inte automatiskt resultat från en tidigare översiktskontroll.

Boklänkarna utgår från projektets egna mappar `7/Matte Direkt 7 v3`, `8/Matte Direkt 8 v3` och `9/Matte Direkt 9 v3`. Samma relativa länkar fungerar lokalt och på GitHub Pages, inklusive PDF-sidnumret. Appen och frågorna fungerar även utan PDF-filerna; då kan boklänkarna inte öppnas.

## Verifiering

[ANVANDARTEST.md](ANVANDARTEST.md) sammanfattar två separata oinsatta granskaragenters lärar- och elevflöden, ett frågestickprov och prioriterade förbättringsförslag. Det är simulerad granskning och ersätter inte test med faktiska användare.

[ANVANDARTEST_TRE_OMGANGAR.md](ANVANDARTEST_TRE_OMGANGAR.md) följer tre ytterligare omgångar med nya lärar- och elevgranskare, ändringar mellan versionerna och verifiering.

[ANVANDARTEST_BREDDNING.md](ANVANDARTEST_BREDDNING.md) följer tre nya omgångar med fokus på andra områden, elevprofiler, verklig export/import, rotation, rapportfilter och urval.

[FORSTAELSEGRANSKNING.md](FORSTAELSEGRANSKNING.md) prövar smala räknerutiner mot avancerade manuella kontroller i samtliga nio områden, med separat underkänd förkunskap. Det är en simulering av underlagets räckvidd, inte en diagnos av faktiska elevers förståelse. [Fortsättningsprompt](FORTSATT_FORSTAELSETEST_PROMPT.md) avgränsar nästa etapp till automatiskt elevläge och överföring.

[FORSTAELSE_UPPFOLJNING.md](FORSTAELSE_UPPFOLJNING.md) följer naturliga elevpass med två separat frysta modellnivåer, nio överföringsfrågor och tio förbestämda gissningsomtag. Fullständiga stickprov och körbara audits finns under `tests/`.

Kunskapsträdet har **Fullskärm** ovanför kartan. Läget avslutas med samma knapp eller Escape; en öppen dialog stängs först. På mobil fälls filterpanelen in i fullskärm; **Visa filter** öppnar samma filter och sökning med bevarade val. Zoom finns under **Fler val**. När webbläsarens fullskärmsfunktion saknas fyller kartan fönstret. Hjälp, teckenförklaring och Fler val samlar instruktioner och mindre använda kartverktyg. Urvalet bas eller fördjupning visas även i kartans rubrik.

[MOTIVERINGSGRANSKNING.md](MOTIVERINGSGRANSKNING.md) beskriver språkgranskningen av alla 513 kopplingsmotiveringar och vilka bokbegrepp som används. 66 texter har ändrats; granskningsmarkeringarna är bevarade.

Fem tester av den publicerade Pages-sidan, med rättningar av rapportåtergång och stora säkerhetskopior, dokumenteras i [LIVE_GRANSKNING.md](LIVE_GRANSKNING.md). Säkerhetskopior får vara upp till 20 MB vid import; befintliga profiler skrivs inte över.

Fem UI-omgångar med före- och efterbilder dokumenteras i [UI_GRANSKNING.md](UI_GRANSKNING.md). `python tests/ui_preview.py tests/ui-scenarios.json` kör en separat kontroll med faktisk mus och tangentbord: små skärmar, årskursval, Enter, Escape, återställt fokus och musdragning. Den använder också en isolerad Chrome-profil och ändrar inte elevdata i användarens vanliga webbläsare.

`python tests/run_browser.py` kör integrationstester i installerad Chrome på Windows, utan extra Python-paket. Testerna använder en separat webbläsarprofil. De kontrollerar 86 700 genererade frågor för giltiga svar och unika alternativ, 570 och 165 äldre facitfall, de ursprungliga 72 variantfallen och 13 005 oberoende facitfall för den granskade banken upp till åk 9. Därutöver kontrolleras grafens beroenden, att basen inte kräver fördjupning, att kort inte överlappar, årskurs- och nivåfilter, fokusvy, NP-vy, profilswitch, återupptagning, export/import och de nya bildtypernas data och rendering. Detta är teknisk och matematisk kontroll, inte pedagogisk validering.

Skärmbilder för dator och mobil, en maskinläsbar färdighetskatalog och testresultat läggs i `.verification/`. Webbläsaren behöver kunna starta utanför en eventuell exekveringssandlåda.

Ytterligare 7 590 kontroller prövar den blandade banken mot oberoende lösningar, alternativens entydighet och visade värden. UI-tester klickar på alternativen i båda lägena och kontrollerar lärarens svarstext och äldre resultat. 51 grupp- och filterkombinationer kontrolleras för bevarade delmoment, samtliga förkunskapskopplingar och frånvaro av cirkulära beroenden. Gruppernas resultat, öppning, sökning och äldre blandade frågor kontrolleras också.

[tests/dependency-tests.js](tests/dependency-tests.js) kontrollerar motiveringarnas täckning efter laddning, båda riktningarna, gruppkopplingar, äldre ID:n, granskningsmarkeringar och oförändrade elevdata. `python tests/ui_preview.py tests/dependency-scenarios.json` kontrollerar även läsning av motiveringarna på dator och 320-pixels mobil, tangentbordsnavigation och ljust tema. Det automatiska årskurstestet skriver små tal som decimaler, så att exempelvis nano inte skickas som det otillåtna svarsformatet `1e-9`.

Efter ett nytt browser-audit kan `python tests/build_catalog_docs.py` återskapa [KUNSKAPSKARTA.md](KUNSKAPSKARTA.md) med aktuella grupper, delmoment, beroenden, blandade kontroller och äldre ID:n.

## Utkast, historik och fortsatt kontroll · 2026-10-15

Inskriven svarstext och valda alternativ sparas som utkast för den exakta frågan i respektive elevprofil, både manuellt och i elevläget. De återställs efter paus, omladdning och profilbyte och följer med vid export/import. Utkast räknas inte som inskickade svar. Ett inskickat eller överhoppat svar tar bort utkastet. Äldre profiler utan utkast fungerar fortfarande.

I elevöversiktens manuella kontrollhistorik öppnar varje rad den valda kontrollens sparade frågor, svar, alternativ och utfall. Senaste samlade underlaget öppnas separat. Om en äldre kontroll bara innehåller poäng och datum anges det; frågor och svar återskapas inte.

Begränsat underlag har en egen status och räknare i elevöversikten och NP-vyn. Exempelvis är ett inskickat 1/1 ett prövat delmoment med begränsat underlag, inte oprövat och inte visad färdighet. Historiska rapporter gäller sitt eget pass; översikterna visar senaste underlaget per färdighet.

Automatiska sammanställningar anger om passet nådde uppgiftstaket, avslutades manuellt eller stannade enligt urvalsreglerna. Antalet ej prövade delmoment inom urvalet visas. För äldre pass utan sparad avslutsorsak anges att uppgiften saknas. Urvalsreglerna har inte ändrats.

Rapportens förslag har **Starta kontroll** bredvid **Granska underlaget**. Den manuella kontrollen visar elev och färdighet samt en länk tillbaka till samma rapport. En annan pausad manuell kontroll skrivs inte över; den namnges och kan återupptas uttryckligen. Rapportlänken följer med en pausad kontroll även efter omladdning.

Sparformatets version är fortfarande 1. Utkast, datum för senast inskickat manuellt svar och rapportreferens är valfria fält. Se [UI_GRANSKNING.md](UI_GRANSKNING.md) för omgångarna och verifieringen.

## Avsluta när kontrollen lämnas · 2026-10-20

En manuell kontroll avslutas även när länken tillbaka till en rapport används. **Pausa och fortsätt senare** är det uttryckliga undantaget. Inskickade svar arkiveras; ett oskickat utkast räknas inte som ett svar. En kontroll utan inskickade svar ger inget resultat. Ett eller två manuella svar sparas med sitt verkliga antal och visas som **Begränsat underlag · Avslutad i förtid**. Inga obesvarade frågor görs om till fel. Tre inskickade svar bedöms som en fullständig kontroll även om resultatknappen inte har tryckts.

Manuella historikposter kan nu ha det valfria fältet `total` (1–3) och `endReason: 'teacher'` vid tidigt avslut. Äldre poster utan `total` behåller nämnaren 3. Importvalidering och historikvisning stöder båda formerna; tidigare uttryckligen pausade eller äldre sparade kontroller kan fortfarande återupptas.

[tests/closing-controls-tests.js](tests/closing-controls-tests.js) kontrollerar avslut, uttrycklig paus, exakta svar, begränsat underlag, historik och import. `python tests/ui_preview.py tests/closing-scenarios.json` använder även verkliga klick och Escape samt mobilvyn med separata Pausa- och Avsluta-knappar.

Efter avslut visas en bekräftelse med antal sparade svar. **Visa svar och facit** öppnar det aktuella underlaget, fäller ut första svaret och rullar dit. Bekräftelsen försvinner när man går vidare. Den manuella återkopplingen visar det faktiskt inskickade elevsvaret. Elevstarten samlar årskurs, område och omfattning före startknappen; regler och extra inställningar är utfällbara. Frågevyn visar uppgiftstaket utan att lova en exakt återstående längd.
