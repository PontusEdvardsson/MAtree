# Oberoende helhetsgranskning E – MAtree

Granskad lokal version: HEAD `45c362e`, `index.html`, 2026-10-21. Ingen produktkod ändrad. Granskaren läste varken README, tidigare granskningar eller andra granskares fynd. Första intryck och sex egna lösningar gjordes i gränssnittet innan produktkod lästes. Endast en egen isolerad Chrome-profil, port 9915, med den fiktiva elevprofilen **Fiktiv granskning E** användes. Browsern är stängd.

## Samlad bedömning

MAtree fungerar i detta stickprov som ett lättillgängligt verktyg för att välja ett delmoment, samla korta elevsvar och planera fortsatt samtal. Det är särskilt bra att oprövade förkunskaper inte automatiskt godkänns och att avbrutna omgångar får begränsat underlag. Den viktigaste konstaterade svagheten är ett för starkt löfte om täckning när ett begränsat automatiskt pass startas. Varken sex korrekta fiktiva svar eller en grön markering visar vad en riktig elev faktiskt förstår. Stickprovet belägger inte hela frågebankens giltighet.

## Första intryck före produktkod

Desktop 1365×900, mörkt tema: tydlig sidnavigation, synlig elevidentitet och tydliga ingångar till elevläge respektive eget momentval. Den stora kartan med 62 kort och 249 delmoment kändes omfattande; som ny lärare behövde jag välja mellan föreslaget moment, elevläge och sökning. Sökningen blev en effektiv ingång när jag visste vad jag ville undersöka. Gruppkorten gjorde helheten hanterligare, men en grupp med ”Visad kunskap: 0/7” uttrycker inte på kortet om allt är oprövat eller faktiskt har prövats utan visat utfall.

Visuellt är färgskalan lugn och sammanhållen. Det är en smakbedömning, inte en uppmätt fördel. Textetiketter kompletterar statusfärgerna. Inga påståenden om efterlevnad av någon extern tillgänglighetsstandard görs; kontrastförhållanden har inte mätts. Underlag: `holistic-e-initial.png`.

## Sex synliga frågor och egna lösningar

Alla nedanstående svar bestämdes före facit. De tre första gavs i automatiskt elevläge, årskurs 9, alla områden, högst 30 frågor. De övriga valdes manuellt via sökning. Flervalsknappar klickades genom sina synliga svarsalternativ; DOM lästes för selektorer, inte för dolda facit.

| Område | Synlig uppgift | Egen lösning före facit | Observerat utfall |
| --- | --- | --- | --- |
| Geometri | Hur många symmetrilinjer har en liksidig triangel? | 3, en genom varje hörn och motstående sidas mittpunkt | Rätt, facit 3 |
| Geometri | Vad måste gälla för en symmetrilinje? | Delarna täcker varandra vid vikning längs linjen | Rätt |
| Geometri | Är en diagonal en symmetrilinje i en kvadrat? | Ja, kvadratens två halvor sammanfaller vid vikning | Rätt |
| Tal | Skriv 1 500 000 som a × 10^n. Vad är koefficienten a? | 1,5 eftersom 1,5×10^6 = 1 500 000 | Svenskt decimaltecken accepterades, rätt |
| Tal | Skriv 840 000 i grundpotensform. Vilken exponent n? | 5 eftersom 8,4×10^5 = 840 000 | Rätt |
| Procent | En andel ökar från 15 % till 35 %. Ökning i procentenheter? | 35−15 = 20 procentenheter | Rätt |

Språket i de sex frågorna var kort och begripligt. Ingen felaktig matematik eller facit upptäcktes i dessa frågor. Symmetrifrågorna prövar antal och igenkänning av en egenskap; de visar inte att eleven själv kan konstruera eller motivera symmetrier i nya figurer. Grundpotensfrågorna isolerar koefficient och exponent, vilket gör svaren lätta att tolka men ger en begränsad bild av att självständigt skriva hela uttrycket. Inga uppgifter med diagram, algebraiska fritextsvar eller problemlösning i flera steg prövades.

## Flöden, rapport och metod

Automatiskt läge: profil skapades med Enter. Årskurs 9 valdes med tangentbord i årskurslistan. Svaret 3 skrevs och skickades med Enter. Nästa fråga visades utan facit, och ”Svar sparat” bekräftade inskickningen. Efter tre svar avslutades passet manuellt. Rapporten redovisade **3 svar på 1 delmoment**, **1 visad i passet**, **56 ej prövade**, samt att passet avslutats manuellt. Elevens svar och facit kunde granskas. Detta är en bra avgränsning av vad passet faktiskt innehöll. Underlag: loggar för kommandoserier 06–15 och `holistic-e-report.png`.

Manuellt läge: sökning på Grundpotens gav tre individuella moment. Ett ”locked”-klassat men synligt öppningsbart kort gick att pröva trots oprövade förkunskaper. Dialogen förklarade att tre frågor ger en första indikation och att resonemang behöver komplettera. Efter två rätt avslutades omgången: **Begränsat underlag**, inte visad kunskap. Motsvarande gällde efter ett rätt procentsvar. I manuellt läge gavs facit och förklaring direkt efter varje svar. Därmed är resultaten från senare frågor i en manuell omgång insamlade efter viss återkoppling; läraren bör väga in detta när syftet är första kartläggning.

Efter UI-provet lästes produktkod. `adaptive.js:27–30` kräver minst tre rätt och högst ett fel för ”shown”; minst två fel/överhoppade ger uppföljning. `app.js:112–120` gör en ofullständig manuell kontroll till begränsat underlag; manuellt fullutfall kräver 3/3. `adaptive-ui.js:198` förklarar reglerna och säger att frågorna inte täcker alla uttrycksformer. Regeln är transparent men kodens trösklar är inte i sig belägg för diagnostisk eller psykometrisk giltighet. Någon sådan giltighet har inte undersökts här.

Inför NP öppnades i mobilvy. Sidan visar först globalt elevunderlag för 249 färdigheter, därefter en särskild basräknare 1 av 221 och en uttrycklig avgränsning: kartlagt underlag, inget betyg eller provprognos. Det är ett bra sakligt löfte för denna vy. Kopplingen till Genrepet och grön kurs presenteras som riktmärke. Jag öppnade inte bokkällan och verifierade inte att alla 174 angivna kopplingar eller 221 basmoment motsvarar den. Underlag: kommandoserie25 och `holistic-e-np-mobile.png`.

## Fynd och minsta åtgärder

### E1 – För starkt täckningslöfte i begränsat elevpass

**Prioritet P2, hög säkerhet.** Repro: ny fiktiv profil → Starta elevläge → Åk9 → Alla områden → Högst30. Formuläret visar **57 delmoment i basen** och samtidigt ”Alla delmoment i urvalet undersöks, men högst 30 uppgifter.” Det kan inte uppfylla minst en fråga per delmoment i det här urvalet. Koden fortsätter dessutom normalt på samma moment tills utfallet avgjorts (`adaptive.js:35–37`), så 30 uppgifter täcker ännu färre än 30 moment. Belägg: `holistic-e-06-1.log`, `holistic-e-06-2.log`; ordalydelsen finns i `adaptive-ui.js:74`. Slutrapportens avgränsning är korrekt, men startlöftet kan få läraren att överskatta täckningen. Minsta åtgärd: skriv ”Delmoment i urvalet undersöks tills högst30 uppgifter har besvarats. Hela urvalet kanske inte hinns med.” Visa gärna ”57 möjliga delmoment” och hänvisa till Testa alla.

### E2 – Gruppkortens nollvärde ger begränsad information om underlaget

**Prioritet P3, hög säkerhet för observationen; medelhög för tolkningsrisken.** Repro: ny profil → Kunskapsträdet → grupper. Alla visar exempelvis ”Visad kunskap:0/7” utan antalet prövade på samma kort. Globalt står 0/249 prövade, och individuella moment säger Inte prövad, så informationen finns. På gruppnivå får läraren ändå öppna gruppen för att skilja oprövat från uppföljningsbehov. Belägg: `holistic-e-initial.png`. Minsta åtgärd: komplettera gruppkort med ”0 av7 prövade” eller motsvarande. Detta är en förbättring av överblick, inte belagt fel i lagrade resultat.

### E3 – Mobilkartan kommer långt ned efter filter och introduktion

**Prioritet P3, hög säkerhet; användbarhetsvärdering.** Vid390×844 och filter synliga började själva kartytan omkring y660, första kortet vid y758. Kortets nederdel låg nedanför första skärmen, trots ett enda sökresultat. Dokumentbredden var exakt390, så detta är vertikal prioritering, inte sidledes överflöde. Repro: sök procentenheter → mobil390×844 → synliga filter. Belägg: `holistic-e-mobile-map.png`, kommandoserie24. Minsta åtgärd: överväg hopfällda filter efter genomförd sökning eller en tydlig ”Visa kartan”-förflyttning. Att användaren kan trycka Dölj filter är en befintlig lösning.

### E4 – NP-avgränsningen hamnar nedanför första mobilskärmen

**Prioritet P3, hög säkerhet för läget; medelhög för tolkningsrisken.** Vid390×844 visas huvudrubrik Inför NP, globala249-räknare och början av basräknaren221. Förklaringen att räknaren inte är betyg/prognos ligger längre ned i samma introduktionskort. Texten är tydlig när man läser hela sidan. Minsta åtgärd: lägg en kort ”Kartlagt underlag – ingen provprognos” direkt under huvudrubriken. Belägg: `holistic-e-np-mobile.png`. Inga påståenden om provets krav eller externa regler görs här.

## Mobil, tangentbord, fullskärm och visuellt

Mobilfrågans återkoppling rymdes i en362px bred dialog inom390px viewport, från x14 till376 och y125,5 till718,5. Nästa fråga, paus och avslut var synliga. Dokumentets scrollbredd390 = viewport390. Tab flyttade fokus från Nästa fråga till Pausa och fortsätt senare. Desktopfullskärm aktiverade faktisk `document.fullscreenElement`, behöll fokus på fullskärmsknappen, och Escape återställde normalvy. Fokusramen syntes efteråt i mobilkartan. Underlag: `holistic-e-mobile-question.png`, `holistic-e-fullscreen.png`, kommandoserier23–24. Det är stickprov, inte ett fullständigt tangentbords- eller skärmläsartest.

Den mörka paletten, stora primärknappar och återkopplingskort gjorde den provade frågan lätt att följa. Kartans prickrutnät och många likartade grupper kan upplevas visuellt täta; det är en preferens/bedömning. Ingen färgblindhetssimulering eller uppmätt kontrastanalys gjordes. Inget färg- eller layoutfel påstås där mätning saknas.

## Begränsningar och bevarade försök

Endast sex svar inom tre områden och tre delmoment; inga felaktiga svar, Jag vet inte, återupptagning efter omladdning, export/import, ljud/skärmläsare eller pekskärmsgester prövades. Ingen slutsats om verklig elevförståelse, elevgrupp, rättssäker bedömning eller hela bankens innehåll dras. Ljust tema granskades inte.

KommandoJSON och browserloggar `holistic-e-03` till `holistic-e-25` är sparade tillsammans med skärmbilder. Första driverskriptet misslyckades vid utskrift med cp1252/UnicodeEncodeError efter att profildialogen redan öppnats; browserns utdata finns i `holistic-e-03-0.log`, körningen rättades utan produktändring. Försöket att klicka ett moment under en hopfälld rapportsektion gav ingen navigation (`holistic-e-15-1.log`); granskningen fortsatte med synlig sökning i trädet. Misslyckandena har inte raderats eller tolkats som produktfel.
