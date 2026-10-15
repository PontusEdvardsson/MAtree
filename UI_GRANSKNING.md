# UI-granskning · fem omgångar

Arbetet omfattade kartan, navigationen, manuella kontroller, elevläget och lärarens sammanställning. Varje omgång började med en renderad vy i Chrome, följdes av ändringar och avslutades med nya skärmbilder och kontroller. Testerna använder separata webbläsarprofiler.

| Omgång | Observerat problem | Ändring | Verifiering |
|---|---|---|---|
| 1 | Gruppkartan var 4 012 px bred i ett kartfönster på 1 097 px, med mycket tom yta och korsande pilar. | Kompakt rutnät per område, anpassat efter fönsterbredd. Kopplingar visas vid pekning eller tangentbordsfokus och kan slås på tillsammans. Detaljvyn behåller förkunskapskedjan. | Kartan ryms i samma 1 097 px fönster. Gruppöppning, filter, beroenden och sparade resultat kontrollerades. |
| 2 | Små skärmar visade bara menyikoner. Knappen för manuell kontroll låg efter långa förkunskapslistor. | Meny med text på små skärmar, kompaktare överdel och filterrad, separat märkning av manuell kontroll. Kontrollknappen ligger nära beskrivningen. | Verkliga klick öppnade elevöversikt och startade en manuell kontroll på mobil. |
| 3 | Första elevfrågan hade långa generella instruktioner. Autofokus kunde scrolla bort frågerubriken när det fanns en bild. | Kort introduktion, svarshjälp anpassad till aktuellt svarssätt, fokus på frågan vid flerval och bilder utan automatisk scrollning. | Klickat svar sparades, nästa fråga visades utan facit, paus behöll exakt fråga och bildfrågans rubrik förblev synlig. |
| 4 | Långa regeltexter och redan visade delmoment kom före uppföljningen i rapporten. | Klickbara antal, uppföljning först, utfällbara grupper, tidigare underlag och oprövade moment. Separata rutor för elevsvar och facit, bevarade alternativ och en knapp tillbaka från delmomentet till samma rapport. | Rapportens antal jämfördes med sparade svar. Ett delmoment öppnades och samma rapport återställdes. Alla svar kunde granskas. |
| 5 | Escape i lärarrapporten öppnade startdialogen. Dialogrubriker och återgång med tangentbord behövde förtydligas. | Escape stänger lärarvyer och pausar elevläge. Dialoger har kopplade rubriker och fokus återgår till öppnande kontroll. Starturval följer vald årskurs eller senaste pass. Gruppkort ryms även på 320 px. | Faktisk Escape, inmatning med Enter, sökning, musdragning, årskursval och vyer på 320, 390, 768 och 1 440 px kontrollerades. |

## Bevarat underlag

Inga frågebanker, facit, färdighets-ID:n eller bedömningsregler ändrades i dessa UI-omgångar. Alla 289 ursprungliga ID:n finns kvar, med 253 delmoment i kartan. Manuella resultat, automatiska pass, äldre alias, pausade frågor och export/import kontrollerades i den fullständiga testsviten.

## Kontroller och skärmbilder

- python tests/run_browser.py: PASS efter sista produktändringen. Kontrollerar bland annat 86 700 genererade frågor, 13 005 oberoende facitfall, 7 590 kontroller av blandade svarssätt, 51 grupp- och filterkombinationer samt profiler, sparade frågor, återupptagning och export/import.
- python tests/ui_preview.py tests/ui-scenarios.json: riktad slutkontroll med faktisk mus och tangentbord i en separat Chrome-profil.
- Före- och efterbilder för varje omgång ligger i .verification/ui-r1-* till .verification/ui-r5-*. Rapporten visas i ui-r4-after-report.png och elevläget i ui-r3-after-student-mobile.png.
- Slutbilder: ui-r5-final-home.png, ui-r5-final-map.png och ui-r5-after-small-map.png.

## Kvarvarande begränsningar

Detaljvyn för alla år kan fortfarande bli bred. Använd område, sökning, förkunskapsfokus eller zoom när många enskilda färdigheter visas. Alla kopplingar samtidigt kan också ge korsande pilar; gruppöversikten visar dem därför vid behov.

Kontrollerna utfördes i installerad Chrome med flera fönsterstorlekar. Edge, Firefox, fysisk mobil och användning med skärmläsare har inte provats separat.

## Uppföljande fem omgångar · 2026-10-15

Genomförandet följer prioriteringarna i FORBATTRINGSPROMPT.md. Varje omgång började med aktuell sida i en isolerad Chrome-profil och avslutades med nya skärmbilder och riktade kontroller. Elevdata i den vanliga webbläsaren berördes inte.

| Omgång | Ändring | Verifiering |
|---|---|---|
| 1: rapporternas underlag | Delmoment öppnade från rapporter visar det valda passets frågor, svar, datum och utfall. Samlat underlag öppnas separat. Överhoppat skiljs från saknade äldre svar. Tillbaka återställer rapportens utfällda avsnitt och scrolläge. | Äldre 3/3 följt av nyare 0/2 på samma färdighet. Exakt frågetext och antal svar, Jag vet inte, saknade äldre svar och återgång kontrolleras i tests/improvements-tests.js. |
| 2: elevens arbetsyta | Bilder och svar visas bredvid varandra på större skärmar. Svara och Jag vet inte samlas i formuläret och kan följa med vid scrollning. Mindre tomrum och två kolumner för korta svarsalternativ på mobil. | Grafens Svara flyttades från cirka y=791 till y=524 på 1366 × 768. Graf, triangel, tabell, numeriskt svar, flerval och lång text kontrollerades på laptop och 390 px. Enter, klick, överhoppning och paus provades. |
| 3: nästa kontroller | Högst tre förslag utifrån delmoment med uppföljning eller begränsat underlag. Motiveringarna anger passets faktiska utfall. Direkt förkunskap märks som oprövad eller som tillhörande annat årskursurval när det är relevant. Alla svar grupperas per delmoment med filter för felsvar, överhoppat och begränsat underlag. | Ett blandat pass med 30 svar öppnades på laptop och mobil. Regressionstester kontrollerar antal förslag, motiveringar, filterantal, gruppering och att underlaget aldrig ändras av rapportfunktionerna. |
| 4: karta och orientering | Samlat elevunderlag är utfällbart i kartvyn. Överdelen är kompaktare och filtren ligger tillsammans och följer med vid scrollning. Sökläge och årskursurval anges uttryckligen. Kartans och sidans läge bevaras vid dialogbesök. Navigering lämnar plats för den fasta filterraden. | Kartan börjar omkring y=479 i en ny profil på 1366 × 768, jämfört med omkring y=706 före ändringen. Sökning, återställd gruppvy, full detaljkarta, zoom, musdragning och återgång kontrollerades. |
| 5: profiler och genvägar | Profiler räknar unika delmoment från manuella och automatiska kontroller samt sparade svar i pågående pass. Sammanslagna ID:n räknas en gång. Avslutade pass har en separat räknare. Aktiv elev visas överst; pausat pass och senaste rapport finns vid elevlägets startknapp. | Tio automatiskt prövade delmoment visas som tio i profillistan. Tester täcker alias, blandade manuella/automatiska resultat, pågående svar, profilnamn, senaste rapport och exakt återupptagen fråga. |

### Slutkontroller

- `python tests/run_browser.py`: PASS efter sista produktändringen. Befintliga kontroller för frågebank, facit, förkunskaper, profilbyte, paus, omladdning och export/import passerar tillsammans med de nya regressionstesterna.
- `python tests/ui_preview.py tests/ui-scenarios.json`: PASS. Verklig mus och tangentbord används för bland annat sökning, Enter, Escape, återställt fokus, paus, rapport och vänsterdragning.
- `python tests/ui_preview.py tests/student-workspace-scenarios.json`: bild, tabell, numeriskt svar och lång text kontrollerades i elevläget. Scenariot använder syntetiska frågor i en isolerad profil.
- Nya regressionsfunktioner finns i `tests/improvements-tests.js`. Testhjälpen inväntar stabila koordinater efter scrollning och rapporterar fel från Chromes inmatningsprotokoll.

Frågebank, facit, färdighets-ID:n, beroenden, årskursurval och formatet för sparade elevprofiler ändrades inte. Inga förkunskaper godkänns automatiskt. Historiska frågor och alternativ återges från sparade data.

Skärmbilder finns i `.verification/improve-r1-after-*` till `improve-r5-after-*`. Slutliga kartbilder finns i `.verification/ui-r5-final-home.png`, `ui-r5-final-map.png` och `ui-r5-final-drag.png`.

### Kvarvarande begränsningar

Hela detaljkartan är fortfarande stor och kan kräva område, årskurs, fokus eller zoom. Långa uppgifter och små skärmar kan kräva scrollning även med de nya svarsknapparna. Förslagen är regelstyrda möjligheter att undersöka; de fastställer inte orsaken till en elevs svårigheter. Fysisk mobil med skärmtangentbord, andra webbläsare och skärmläsare har inte provats separat.

## Utkast, manuell historik och fortsatt kontroll · 2026-10-15

Fem omgångar genomfördes i användarens prioriteringsordning. Före-bilderna ligger i `.verification/review-next-r1-*` till `review-next-r5-*`. Samma fall öppnades igen efter respektive ändring i en isolerad Chrome-profil. Efterbilder och körbara scenarier heter `continuity-r1-after*` till `continuity-r5-after*`.

| Omgång | Konstaterat fel och ändring | Verifierat fall |
|---|---|---|
| 1. Påbörjade svar | Text och val försvann vid paus. Separata utkast sparas per profil och exakt fråga, inklusive alternativens ordning. De återställs utan att rättas. Inskickning eller Jag vet inte rensar utkastet. | Numerisk text, även ett ofärdigt minustecken, och valt alternativ återkommer efter paus. Omladdning, profilbyte, export/import, äldre profiler och oförändrat antal inskickade svar kontrolleras. |
| 2. Manuell historik | En historikrad öppnade senaste samlade resultatet. Varje rad öppnar nu det utpekade historiska objektet med dess sparade frågor, svar, bilder, alternativ och utfall. | Äldre 3/3 följt av nyare 0/3 på samma färdighet, även över sammanslagna ID:n. En annan pausad kontroll ändras inte. Äldre kontroller utan uppgiftssvar visas uttryckligen som enbart poäng och datum. |
| 3. Begränsat underlag | NP-vyn räknade ett delmoment med 1/1 som oprövat. Gemensamma status- och räknarfunktioner skiljer visat, uppföljning, begränsat och oprövat. | 1/1 visas som begränsat i rapport, elevöversikt och NP-vy. Nämnare och delsummeringar kontrolleras för hela kartan respektive basurvalet. Även inskickade svar i pausade manuella kontroller räknas; utkast gör det inte. |
| 4. Tidigt avslut | Läraren fick ingen förklaring när urvalsreglerna stoppade ett pass före taket. Rapporten visar nu separat orsak, antal svar, prövade delmoment och återstående oprövade moment. | Åk 1–3, tak 90, enbart Jag vet inte: oförändrat fyra svar på två delmoment, 24 ej prövade. Åk 9 stannar oförändrat vid 16 svar. Tak, läraravslut och äldre okänd orsak har egna texter. Tidigare årskurs kan väljas utan att skriva över ett annat pausat pass. |
| 5. Fortsatt kontroll | Förslaget krävde tre knappsteg. Starta kontroll ligger nu bredvid underlagsgranskningen och öppnar första frågan direkt. Elev och färdighet syns, med länk tillbaka till ursprungsrapporten. | Laptop 1366 × 768 och mobil 390 × 844. Återgång till äldre rapport, utfällda avsnitt, utkast, återupptagning, feedback och slutförd kontroll. Rapportreferens överlever omladdning. Annan pausad manuell kontroll skyddas och kan återupptas uttryckligen. |

### Slutlig verifiering

- `python tests/run_browser.py`: PASS efter sista produktändringen. Fem nya regressionsfunktioner i `tests/continuity-tests.js` ingår. Befintliga kontroller av frågebank, facit, årskurser, graf, äldre data och export/import passerar.
- `python tests/ui_preview.py tests/ui-scenarios.json`: PASS med faktisk mus och tangentbord.
- `python tests/ui_preview.py tests/student-workspace-scenarios.json`: PASS; numeriska frågor, flerval, bilder och långa texter på laptop och mobil.
- `python tests/ui_preview.py .verification/continuity-r5-after.json`: PASS; direktstart och samma kontroll återupptagen från samma rapport på mobil och laptop.
- `python tests/ui_preview.py .verification/continuity-early-1-3.json`: PASS; exakt det rapporterade fyrasvarsfallet med tak 90.
- Testresultatet finns i `.verification/test-results.txt`. Alla skärmbilder har granskats i relevanta ändrade vyer. Testprofilerna påverkar inte elevdata i den vanliga webbläsaren.

Frågebank, facit, färdighets-ID:n, beroenden, årskursurval och urvalsregler är bevarade. Inga förkunskaper godkänns automatiskt. Sparformatet har samma versionsnummer; utkast, svarstidpunkt och rapportreferens är bakåtkompatibla valfria fält.

### Kvarvarande begränsningar

Tidigt stopp kan fortfarande inträffa efter få svar; denna omgång förklarar befintliga urvalsregler och ändrar dem inte. Saknade frågor och elevsvar i gamla sammanfattade manuella resultat kan inte återskapas. Rapportlänken från en pausad kontroll kräver att ursprungspasset fortfarande finns bland de sparade passen. Mobil har testats genom Chromes fönster- och mobilenhetsläge, utan fysisk enhet eller skärmtangentbord.



## Testa alla · 2026-10-15

Startdialogen har ett nytt alternativ, **Testa alla · hela årskursurvalet**. Det prövar varje delmoment i den valda årskursvyn, inklusive fördjupning och tidigare visade färdigheter, utan att förkunskapsutfall blockerar återstående moment. Vanliga pass på 30, 60 och 90 frågor behåller sina regler. Samma individuella bedömning gäller: 2–4 frågor per delmoment, utan automatiskt godkännande av förkunskaper.

Före start visas ett dynamiskt intervall för frågor och arbetstid. Tiden bygger uttryckligen på en minut per fråga; elevens tempo och pauser kan ändra den. Åk 4–6 ger 62 delmoment och 124–248 frågor. Åk 9 ger 106 delmoment, varav 18 fördjupningsmoment, och 212–424 frågor. Antalen beräknas från den aktuella färdighetskartan.

Regressionstester i `verifyTestAll` täcker alla fem årskursurval med alla rätt, alla överhoppade respektive ett överhoppat följt av tre rätt per delmoment. De kontrollerar full täckning, minimi-/maximiantal, bedömning, tidigare visade färdigheter, större exportformat och oförändrat standardläge. Start, dynamisk uppskattning, paus, utkast, omladdning och slutrapport kontrolleras också i `.verification/test-all-scenarios.json` med Chrome. Skärmbilder finns i `.verification/test-all-*.png` och antalen i `test-all-estimates.json`.
