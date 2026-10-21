# Oberoende helhetsgranskning A — MAtree

Granskad lokal version: HEAD `45c362e`, 2026-10-21. Granskare A. Ingen README, tidigare rapport eller annan agents slutsatser lästes. Produktkod lästes först efter praktisk UI-granskning. Ingen produktkod ändrades. Isolerad Chrome på port 9911, separat profil, elevnamn **Fiktiv granskning A**; browser stängd efteråt.

## Första intryck före produktkod

Desktop 1366×900: samlad och lugn mörkgrön arbetsyta; elevnamn och beskedet om lagring på enheten är lätta att hitta. Tydliga huvudingångar till träd, elevöversikt och NP. Att 62 kort döljer 249 delmoment kräver orientering; jag behövde öppna grupp och sedan delmoment innan prövningen kunde starta. De två översta startvalen är användbara, men sambandet mellan föreslaget moment och elevläge framgår inte direkt på startsidan. Detta är första intryck, ingen observerad funktionsdefekt. Bevis: `holistic-a-first.png`.

## Faktiskt genomfört

- Skapade fiktiv profil i appens profilsystem. Läste informationen om lokal lagring och export.
- Manuellt positionssystem: tre frågor besvarade, facit lästa, 3/3-resultat granskat.
- Manuellt former/hörn: två frågor besvarade, facit lästa; omgången pausad före tredje frågan.
- Automatiskt elevläge: Åk 1–3, Bråk, högst 30. En fråga besvarad, passet avslutat manuellt, rapport och sparat facit lästa. Den andra automatiska frågan granskades inte och ingår inte i stickprovet.
- Totalt **sex synliga frågor i tre områden**, varje fråga löst före facit. Inga medvetet felaktiga svar i detta begränsade stickprov.
- Fullskärm genom knapp: `document.fullscreenElement` blev sann, knapptext blev ”Avsluta fullskärm”. Escape tog ur fullskärm. Rapporten stängdes med Escape.
- Mobilstorlek 390×844, mörkt och ljust tema. Dokumentbredd uppmätt 390 vid viewport 390. Tab flyttade fokus till Fortsätt kontroll. Numeriskt svar skickades med Enter. Select för område valdes med tangentbord.
- Efteråt riktad kodläsning av `app.js`: rad 120, 411, 439 bekräftar resultatetiketter och att manuell visad kunskap kräver 3/3; elevöversiktens text skiljer manuellt och automatiskt utfall. Inga breda anspråk om kodens korrekthet.

## Frågor: egen matematik respektive förståelsetolkning

| Område | Synlig uppgift | Egen lösning före facit | Observerat facit | Vad detta faktiskt undersöker |
|---|---|---|---|---|
| Tal | Värdet av siffran på tiotalsplatsen i 703 | 0; tiotalssiffran är noll | Rätt på 0 | Ett specifikt platsvärde med nolla; inte allmän talförståelse |
| Tal | 1 hundratal, 4 tiotal, 1 ental | 100+40+1=141 | Rätt på 141 | Sammanfogning av tre platsvärden |
| Tal | Antal hela tiotal i 67 | 6 eftersom 67=6×10+7 | Rätt på 6 | Gruppering i tiotal, kompletterar de två första |
| Geometri | Antal hörn i avbildad sexhörning | 6 hörn räknade i skärmbild | Rätt på 6 | Hörnräkning på en bekant konvex figur |
| Geometri | Antal sidor i avbildad sexhörning | 6 sidor räknade | Rätt på 6 | Sidräkning; samma form som föregående fråga gör underlagen nära besläktade |
| Bråk | Färgad andel i tvådelad rektangel | En av två lika delar = 1/2 | Rapporten visar 1/2 som rätt svar | Bildavläsning av en halv; visar inte ännu fjärdedelar trots delmomentets titel |

Inget matematiskt facitfel hittades i de sex frågorna. Språket är kort och begripligt i dessa exempel. Figurerna var tydliga i desktopbilderna. Inga slutsatser dras om återstående frågor, felhantering, högre årskurser eller diagnostisk träffsäkerhet.

## Vad fungerar väl

1. Manuell prövning säger före start att tre frågor ger en första indikation. Resultatet 3/3 upprepar att resonemang och fler uppgifter behövs; förkunskaper godkänns inte automatiskt. Det är en tydlig och viktig avgränsning.
2. Autoresultatet efter en korrekt bråkfråga säger **Begränsat underlag**, 1/1 rätt, och föreslår komplettering. Det gör ingen stark kompetensslutsats av ett enda svar. Rapporten säger dessutom att passet avslutades manuellt och att svaren inte avgör orsaken till svårigheter.
3. Rapporten skiljer elevens svar, rätt svar och förklaring. ”Ej prövade i urvalet” visas separat. Den enda Åk 1–3-bråkfärdigheten hade fått ett svar; noll oprövade var därför rimligt i just detta urval.
4. Tydligt elevnamn i elevläge och lokallagringsbesked, stora svarsknappar, möjlighet till ”Jag vet inte”, paus och avslut. Enter på textsvaret fungerade. Fullskärm och Escape fungerade i den prövade browsern.
5. Mobilen staplar navigation och filter och gav ingen yttre horisontell överskjutning i det observerade läget. Temaväxlingen fungerade.

## Förbättringar, prioriterade men avgränsade

### A1 — P2: Oprövad grupp uttrycks som ”Visad kunskap: 0/N”

**Steg:** ny tom profil → startsidans gruppkort. Taluppfattning visar ”Visad kunskap: 0/7”, liksom övriga grupper med 0/N. Öppna gruppen: de enskilda momenten säger ”Inte prövad”.

**Konsekvens:** en lärare vid första mötet behöver tolka om nollan betyder saknad kunskap eller avsaknad av underlag. Den övergripande raden ”0 av 249 prövade” hjälper, men varje kort bär inte den distinktionen självt. Detta är en risk för felläsning, inte bevis för att någon lärare faktiskt feltolkat resultatet.

**Bevis:** `holistic-a-first.png`, UI-loggen. **Säkerhet:** hög för etikettbeteendet, måttlig för tolkningseffekten. **Minsta förbättring:** skriv ”Inte prövat · 7 delmoment” när hela gruppen saknar underlag; annars visa både visade och prövade.

### A2 — P2: Mobilens kontrollområde skjuter ned själva kartan

**Steg:** träd → mobil 390×844, filter öppna. Första synliga kortets överkant ligger cirka y=673; huvuddelen av första skärmen upptas av navigation, sammanfattning och filter. Urvalet och kartans inre scrollposition var kvar från desktop; detta är inte ett prov av en helt ny mobilstart.

**Konsekvens:** lite kartinnehåll syns på en vanlig smal skärm, och man behöver hantera både sidans och kartans scroll. Dölj filter är en användbar befintlig utväg.

**Bevis:** `holistic-a-mobile.png`, `holistic-a-mobile-light.png`. **Säkerhet:** hög för den observerade layouten; måttlig för generell användarfriktion. **Minsta förbättring:** vik ihop filter som mobilstandard eller samla dem i en ”Filter”-knapp med kort urvalstext.

### A3 — P3: Två geometrifrågor ger närbesläktat underlag

**Steg:** Former & hörn → Prova förståelsen → fråga 1 sexhörningens hörn → fråga 2 samma sexhörnings sidor.

**Konsekvens:** två rätta svar behöver inte visa överföring mellan figurtyper eller förståelse av skillnaden hörn/sida; det kan räcka att räkna samma form två gånger. Båda frågorna är matematiskt korrekta, men informationsbredden i just paret är begränsad. Den tredje frågan undersöktes inte, så ingen slutsats dras om hela delmomentets prov.

**Bevis:** `holistic-a-geometry-q1.png`, `holistic-a-geometry-q2.png`. **Säkerhet:** hög för upprepningen, måttlig för bedömningsvärdet. **Minsta förbättring:** låt andra frågan visa en annan form eller be eleven skilja på sida och hörn i en markerad figur.

### A4 — P3: Startvalens arbetssätt kan förklaras närmare

**Steg:** startsida med ”Öppna föreslaget moment” och ”Starta elevläge”. Först när elevläge öppnas syns årskurs, område och uppgiftsgräns; manuell delmomentsprövning kräver grupp → delmoment → Prova förståelsen.

**Konsekvens:** första användningen kräver utforskning för att välja arbetssätt. Detta hindrade inte genomförandet i mitt prov.

**Bevis:** `holistic-a-first.png`, UI-loggen. **Säkerhet:** måttlig, bedömning som förstagångsanvändare. **Minsta förbättring:** en rad under knapparna: ”Välj moment tillsammans med läraren, eller låt elevläget välja en uppgift i taget.”

## Visuell bedömning och tillgänglighetsgränser

Subjektiv bedömning: sammanhängande färgsättning, lugn bakgrund och tydlig hierarki. Mörka temat skiljer kort från bakgrund diskret; ljusa temat gör de ljusa ramarna subtila. Detta är visuella preferenser, **inga mätta kontrastfel**. Ingen kontrastkvot mättes, inga externa standardpåståenden görs. En tangentbordsväg och Enter/Escape prövades; detta är inte en fullständig tangentbords-, skärmläsar- eller tillgänglighetsgranskning. Verklig mobil enhet, zoom, pekinmatning och utskrift prövades inte.

## Spårbarhet, misslyckat försök och begränsningar

Egna UI-utdata sparade i `holistic-a-ui-log.txt`. Första skärmbilden och sex efterföljande bevisbilder har prefix `holistic-a-`. Ett inmatningsanrop blockerades av automatisk granskning eftersom tidigare flervalsfråga hade dolt `#answer`. Aktuell DOM kontrollerades därefter läsande och visade ett synligt textfält (483×54 px); ett nytt anrop med selektor `#answer[type="text"]` godkändes. Ingen dold inmatning utfördes. Se `holistic-a-failed-attempt.txt`.

Tidsbegränsat stickprov. Inga verkliga elevdata användes. Inget felaktigt svar prövades, inget helt automatiskt 30-frågepass slutfördes, inga exporter/importer eller dataöverföringar granskades. Rapporten stöder en första förbättringslista, inte ett påstående om generell matematisk eller pedagogisk validering.
