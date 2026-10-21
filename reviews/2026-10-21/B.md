# Oberoende helhetsgranskning B

2026-10-21. Lokal index.html, uppgiven HEAD 45c362e. Isolerad Chrome-profil på port 9912, fiktiv Elev 1; ingen produktändring, ingen commit. README, andra rapporter och andra granskares fynd har inte lästs. Första intryck och praktiska frågor kom före produktkod. Detta är ett avgränsat kvalitativt stickprov, inte belägg för faktisk elevförståelse eller metodens validitet.

## Första intryck

Desktop 1366×900: sammanhållet mörkt grönt tema, ordentligt luftiga kort och tydlig ljusgrön knapp för elevläge. Som osäker elev möts jag dock av 62 kort, 249 delmoment och 481 kopplingar; många 0/x-etiketter före första svaret ger en känsla av ett stort återstående arbete. Som ny lärare får jag bra ämnesindelning men behöver tolka skillnaden mellan gruppkort och delmoment. Detta är ett orienterings-/språkproblem, inte uppmätt misslyckande hos elever. Bild: holistic-b-initial.png.

## Faktiskt genomförande och matematik

Automatiskt elevläge med standardval Åk 1–3, alla områden, högst 30: tre inskickade svar, paus/återuppta och manuell avslutning. Rapport öppnades. Manuellt bråkpass genomfördes till 3/3 och resultat. Geometripass avslutades efter ett rätt svar, därefter öppnades sparat underlag och elevöversikten. Sju besvarade frågor inom tre områden:

| Område | Synlig fråga | Egen lösning före rättning | Utfall |
|---|---|---|---|
| Tal | Vilket tal kommer efter 7? | 8 | Rätt |
| Tal | Vilket tal kommer före 7? | 6 | Rätt |
| Tal | Hur många prickar ser du? | 8 + 5 = 13 | Rätt; se metodbegränsning nedan |
| Bråk | Vad är 1/4 av 44? | 44/4 = 11 | Rätt |
| Bråk | 7/8 av 56 pärlor är blå | 56/8×7 = 49 | Rätt |
| Bråk | 25 klossar, använder 1/5 | 25/5 = 5 | Rätt |
| Geometri | En vinkel är 20°. Vilken typ? | 0 < 20 < 90: spetsig | Rätt |

Prickfrågans SVG-alttext med antalet lästes av misstag i en DOM-kontroll före visuell egenräkning. Därför räknas den inte som helt blind självständig facitjämförelse. Övriga sex frågor löstes före facit. Nästa automatiska fråga om hörn sågs endast som text, besvarades inte och ingår inte i sju.

Språket i dessa frågor var kort och begripligt. Bråkformatet 7/8 är praktiskt i text men saknar typografiskt bråkstreck; det är en preferens, inget konstaterat matematikfel. Förklaringarna stämde i stickprovet. Exempelvis “Dela med nämnaren och multiplicera med täljaren” var direkt kopplad till pärlfrågan.

## Styrkor med belägg

- Elevläget gav en fråga i taget, papper tillåts, svar sparas lokalt och “Jag vet inte” finns. Utseendet är lugnare än trädet. holistic-b-dots.png.
- Paus visade “2 sparade svar”, återupptog samma obesvarade prickfråga. Enter skickade in både automatiskt och manuellt fritextsvar.
- Automatisk slutrapport visade 3 svar på 1 delmoment, 1 visat och 25 ej prövade, samt “Passet avslutades manuellt”. Den blandade inte ihop obesvarade med fel.
- Manuellt 3/3 gav “Visad kunskap” med explicit reservation att tre frågor är en första indikation och resonemang/fler uppgifter behövs. Förkunskaper behöll egna resultat.
- Geometripassets 1/1 blev “Begränsat underlag · Avslutad i förtid”, inte visad kunskap. Elevöversikten sammanförde korrekt 2 visade, 1 begränsat, 246 oprövade.
- Vid 390×844 rymdes hela geometrifrågan inklusive fyra stora svarsknappar och avslut. Dokumentets scrollWidth var 390 vid innerWidth 390. Ingen observerad horisontell sidöverskridning i detta läge. holistic-b-mobile-question.png.
- Mörk frågetext rgb(227,234,228) mot dialogbakgrund rgb(27,40,34) gav beräknat luminanskontrastförhållande cirka 12,49:1. Texten var lätt att läsa visuellt; geometrihuvudfrågan var 21px, rubrik 25px.

## Fynd och minsta förbättring

### B1 – Ljust tema tonar ned betydelsefull metodtext (P2, hög säkerhet för färgmätning, medel för användarpåverkan)

Repro: elevöversikt → växla till ljust tema → läs förklaringen under “Förslag på nästa kontroll” och texten “Manuellt: 3/3. Automatiskt: minst tre rätt och högst ett fel.” Dessa 14px-texter renderas rgb(131,144,120) på vit panel, beräknat kontrastförhållande 3,37:1. Kortetiketterna är 12px, rgb(125,137,126) på vitt, cirka 3,65:1. Inga påståenden om extern standard görs här. Konkret blir just reservationer och tolkningshjälp klart blekare än rubriker och svar. Bild holistic-b-mobile-light.png; mörk jämförelse holistic-b-mobile-tree.png (filnamnet är missvisande: bilden visar elevöversikt).

Minsta förbättring: mörkare färgtoken för metod-/hjälptext och små kortetiketter i ljust tema; verifiera på samma vy och storlek. Den gröna paletten i sig är en smakfråga; denna relativa läsbarhet är ett mätt problem.

### B2 – Prickräkningens tillgängliga bildnamn ger svaret (P2, hög säkerhet i DOM, skärmläsarbeteende ej testat)

Repro: elevläge Åk 1–3 → Antal och talordning → fråga “Hur många prickar ser du?” → inspektera bildens tillgängliga namn. Den visade bilden hade role=img och aria-label="13 prickar.". Källkod efter UI-provet bekräftar generell konstruktion i question-media.js:88 och :170. Den som får detta namn uppläst får själva antalet i stället för en likvärdig räkningsuppgift. Att bara ta bort alternativtext skulle göra frågan otillgänglig.

Minsta förbättring: erbjud en uttrycklig icke-visuell motsvarighet som fortfarande kräver räknande/antal, eller markera denna kontroll som en annan uppgiftsform när bilden behöver beskrivas med totalen. Bedöm inte dessa två former som identisk evidens utan avsiktligt beslut. Bild holistic-b-dots.png och DOM-belägg ovan. Ingen verklig skärmläsare kördes.

### B3 – Gruppkortens 0/x skiljer inte oprövat från uppföljning i startögonblicket (P3, hög säkerhet i text, låg–medel för användarpåverkan)

Repro: ny isolerad profil → trädet → många gruppkort visar “Visad kunskap: 0/7” osv, samtidigt som andra enskilda kort säger “Inte prövad”. Det går att förstå rätt genom “Elevunderlag · 0 av 249 prövade”, men status kräver tolkning över flera ställen. Detta observerades innan källkod; holistic-b-initial.png.

Minsta förbättring: lägg “Ännu inte prövat” på helt oprövade gruppkort; använd 0/x främst när något faktiskt har prövats. Detta är ett förbättringsförslag, ingen visad feltolkning av en elev.

## Bedömningsmetod efter kodläsning

app.js:120 skiljer mastered/practice/partial/untried. Manuellt fullständigt pass kräver 3/3; partiellt pass omtolkas till begränsat underlag (app.js:113). adaptive.js:28–29 använder minst tre rätt och högst ett fel för shown, minst två fel för followup, annars partial. Elevöversikten anger denna skillnad öppet. Trösklarna har alltså olika stränghet, men det är dokumenterat och inget konstaterat programfel. Bedömningsmodellens pedagogiska träffsäkerhet kan inte avgöras med sju syntetiska svar. Rubriken “Visad kunskap” är mer kategorisk än underlagets omfattning; reservationen på resultatsidan hjälper, men en kort “i denna kontroll” även i trädet skulle göra begränsningen mer närvarande.

## Begränsningar och försök som inte slutförts

Ingen riktig elev eller lärare deltog. Ingen negativ/felaktig svarsväg, decimal-/enhetsnormalisering, export/import, profilsäkerhet, flera samtidiga profiler, fullständig automatisk körning, omladdning/återöppning, NP-vy, tangentbordsnavigering av hela trädet eller verklig skärmläsare testades. Tangentbordsprov var Enter i två fritextfrågor samt Tab efter rättning: fokus gick till “Pausa och fortsätt senare”. Ingen slutsats om hela appens tangentbordstillgänglighet dras. Mobilprovet var emulerat, ingen fysisk telefon eller skärmtangentbord. Inga tekniska kommandofel eller krasch observerades. Geometripasset avslutades avsiktligt efter 1/3 och auto efter tre svar; dessa är avgränsningar, inte misslyckade användaruppgifter.

Skärmbilder: holistic-b-initial.png, holistic-b-dots.png, holistic-b-mobile-question.png, holistic-b-partial-result.png, holistic-b-mobile-tree.png (elevöversikt), holistic-b-mobile-light.png. Browser stängs efter rapportskrivning.
