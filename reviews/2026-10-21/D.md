# Oberoende helhetsgranskning D

Datum: 2026-10-21. Lokal index.html, uppdragets HEAD 45c362e. Isolerad Chrome-profil på port 9914, enbart fiktiva Elev 1. Ingen produktkod ändrad, ingen commit. Webbläsaren stängd med stop. README, tidigare granskningar och andra agenters rapporter lästes inte. Första intryck sparades före produktkod i holistic-d-first-impression.md. Därefter lästes begränsad metodkod i app.js, adaptive.js, curriculum.js, questions-mixed.js och question-media.js.

Detta är en fokuserad UI-simulering, inte pedagogisk validering eller ett faktiskt elev-/lärartest. Slutsatserna gäller stickprovet. Inga externa standardpåståenden görs.

## Samlad bedömning

Appen erbjuder ett användbart lärarunderlag: direktkontroller, synliga förkunskapskopplingar, sparade elevsvar och tydlig åtskillnad mellan visat, uppföljning, begränsat och oprövat. De största förbättringsmöjligheterna i stickprovet är acceptans av siffergruppering och hur knappen Nästa steg motiverar sitt val. Jag fann inget felaktigt facit bland de nio besvarade frågorna.

## Genomförda praktiska steg

1. Startade index.html i ny profil, desktop 1280 × 900. Bedömde första skärmen och tog skärmbild före kodläsning.
2. Starta elevläge → Årskursurval Åk 9 genom End och Enter i select → Starta kontrollen. Sex svar skickades in. Fråga 7 visades men besvarades inte. Avsluta → Senaste sammanställningen → Elevöversikten.
3. Öppna föreslaget moment → Bråk som del av en hel → Prova förståelsen. Bytte till 390 × 844 och besvarade alla tre frågor. Se resultatet → Nästa steg → öppnade Ekvation: addition och subtraktion. Escape återgick till översikten.
4. Desktop → Kunskapsträdet → Fullskärm → Escape → Tab. DOM-mätning bekräftade att fullskärm lämnats och att fokus låg på Alla år, samt ingen horisontell dokumentoverflow vid den mätningen.
5. Mobil 390 × 844 → kunskapsträdet och Inför NP. Läste NP-sidans text och tog bilder. Avslutade Chrome.

## Frågor, egna lösningar före facit

| Nr | Läge/område | Synlig fråga | Egen lösning/svar | Utfall |
|---|---|---|---|---|
| 1 | Auto åk 9/geometri | Symmetrilinjer i liksidig triangel | 3, en genom varje hörn och motstående sidmitt | Rätt i rapport |
| 2 | Auto/geometri | Vad måste gälla för symmetrilinje? | Delarna täcker varandra vid vikning | Rätt i rapport |
| 3 | Auto/geometri | Är en diagonal symmetrilinje i kvadrat? | Ja, de två trianglarna överlappar vid vikning | Rätt i rapport |
| 4 | Auto/tal | 13 miljoner och 89 tusen som tal | 13 000 000 + 89 000 = 13 089 000 | Mellanslag avvisades; 13089000 rätt |
| 5 | Auto/tal | Hur många miljoner är 6500000? | 6500000/1000000 = 6,5 | Rätt i rapport |
| 6 | Auto/tal | 9 miljarder som antal miljoner | 9 × 1000 = 9000 | Rätt i rapport |
| 7 | Manuell/bråk | Hur stor andel av figuren är färgad? | Tre av fyra lika delar = 3/4 | Rätt, rimlig förklaring |
| 8 | Manuell/bråk | Fem lika delar, tre färgade; vilken nämnare? | 3/5 har nämnaren 5 | Rätt |
| 9 | Manuell/bråk | 2/3, hur många lika stora delar markerade? | Täljaren är 2 | Rätt |

Automatiska åk 9-urvalet gav Spegelsymmetri och Miljoner och miljarder, tre varianter vardera. Bråk som del av en hel är märkt Åk 4–6 och ingår enligt UI även i åk 7–9. Fråga 7 i automatpasset om pärlor 4:4, totalt 32, löstes i huvudet till 16 men skickades inte in och ingår inte i de nio svaren.

## Problem och minsta åtgärd

### D1. Korrekt grupperat heltal avvisas

Prioritet P2, säkerhet hög. Reproduktion: automatpass, frågan Skriv 13 miljoner och 89 tusen som ett tal → skriv `13 089 000` → Enter. Samma fråga ligger kvar och säger Skriv ett heltal. Ta bort mellanslagen och skicka `13089000` → nästa fråga; rapporten visar rätt.

Bevis: holistic-d-16.json till holistic-d-20.json och holistic-d-integer-spaces.png. curriculum.js:145–152 använder trim men tillåter inte interna blanksteg; questions-mixed.js:523 kräver ett ändligt parsningresultat.

Påverkan: eleven kan kunna positionssystemet men få ett oklart formatfel. Detta blev inte ett registrerat felsvar i försöket, vilket begränsar skadan. Minsta åtgärd: acceptera kontrollerad gruppering med vanliga/tunna/hårda mellanslag, eller ange exakt Skriv siffrorna utan mellanslag i feltexten och svarshjälpen. Första alternativet ger mindre friktion.

### D2. Nästa steg efter ett lyckat moment ser mer individuellt ut än det är

Prioritet P2, säkerhet hög för beteendet, medel för tolkningsrisken. Efter 3/3 på Bråk som del av en hel: Se resultatet → Nästa steg öppnar Ekvation: addition och subtraktion. Ingen motivering eller måltext för nästa moment visas på resultatkortet. Det går därför att läsa knappen som en undervisningsrekommendation direkt härledd från bråksvaren.

Elevöversikten ger däremot en bra förklaring: En allmän startpunkt för fortsatt kartläggning, inte en slutsats från det senaste svaret. app.js:157–167 bekräftar en fast lista ingångsmoment efter eventuella oprövade förkunskaper till svaga resultat. app.js:411 kopplar resultatknappen direkt till nextSkill().

Bevis: holistic-d-manual-result.png, kommandon holistic-d-45.json och holistic-d-46.json. Minsta åtgärd: skriv exempelvis Nästa kontroll: Ekvation … och återanvänd förklaringen från elevöversikten, eller låt läraren välja mellan fortsatt breddning och ett relaterat bråkmoment.

### D3. Oprövad grupp framställs som 0/n visad kunskap

Prioritet P2/P3, säkerhet hög för texten och medel för risken. En helt ny profil visar Elevunderlag 0 av 249 prövade, men alla gruppkort visar exempelvis Visad kunskap: 0/7. Enskilda kort kan samtidigt säga Inte prövad. Detta är numeriskt konsekvent men kräver att läraren förstår skillnaden mellan en grupps visade delmoment och ett testresultat.

Bevis: holistic-d-first.png och holistic-d-first-impression.md. Minsta åtgärd: på helt oprövade grupper visa Inte prövad · 7 delmoment. På blandade grupper lägg till antalet prövade eller oprövade, exempelvis 1 visat · 2 prövade av 7. Rapporten och elevöversikten gör redan denna åtskillnad bättre.

### D4. Frågan om nämnare har två konkurrerande instruktioner

Prioritet P3, säkerhet hög. Manuell bråkfråga 2 säger Skriv den färgade andelen som ett bråk utan att förkorta det. Vilken är nämnaren? Men gränssnittet är ett val mellan heltal. Eleven måste välja vilken instruktion som faktiskt ska besvaras.

Bevis: holistic-d-38.json till holistic-d-40.json och frågetabellen. Minsta åtgärd: formulera Om du skriver andelen som ett bråk utan att förkorta, vilket tal står i nämnaren? Behåll alternativen.

## Styrkor och metodtolkning

- Rapporten säger 6 svar på 2 delmoment och anger uttryckligen att passet avslutades manuellt. 55 ej prövade blandas inte ihop med fel. Två visade delmoment har 3/3 rätt.
- Elevöversikten visar totalt 3 visade och 246 oprövade efter båda passen. Den anger de olika kriterierna: manuellt 3/3, automatiskt minst tre rätt och högst ett fel.
- adaptive.js:27–29 är förenlig med den synliga regeln: minst tre rätt och högst ett fel ger shown, minst två fel followup, övrigt partial. Dessa trösklar är regler, inte verifierad mätprecision. Kommentar i adaptive.js anger också regelstyrt urval, inte kalibrerad psykometrisk modell.
- Manuella resultatet säger att tre frågor ger en första indikation och att elevens resonemang och fler uppgifter behövs för säkrare bedömning. Förkunskaperna godkänns inte automatiskt. Det stödjer en försiktig lärartolkning.
- Momentdialogens Bygger på och Leder vidare till har begripliga konkreta motiveringar. Texten skiljer pedagogiska förslag från krav fastställda av böcker eller Skolverket.
- Inför NP lovar kartläggning mot Genrepet och grön kurs vid slutet av nian. Sidan visar 3/221 i basräknaren, förklarar att röda fördjupningar inte ingår och säger uttryckligen att det är kartlagt underlag, inte betyg eller prognos för provet. Antalet och de externa bokkopplingarnas riktighet har inte verifierats mot källmaterialet. Ingen separat prognos eller betygsgaranti sågs.

## Visuellt, färg, mobil och tangentbord

Bilderna holistic-d-first.png, holistic-d-report.png, holistic-d-mobile-q.png, holistic-d-manual-result.png, holistic-d-fullscreen.png, holistic-d-mobile-tree.png och holistic-d-np.png sparas som granskningsunderlag.

Subjektivt intryck: sammanhållen mörk palett, tydliga huvudknappar och behaglig gruppering. Statusrapportens färger kompletteras med ord och siffror. Inget kontrastförhållande mättes och ingen standardefterlevnad påstås. Trädets många linjer och stora tomma ytor i fullskärm gör helheten mer krävande att läsa; detta är en visuell bedömning, inte en konstaterad defekt.

Mobil 390 × 844: frågefigur och samtliga fyra svarsalternativ ryms i bredd. Dialogen behöver rullas, och pauskontrollerna ligger längre ned; ingen uppmätt överlappning eller horisontell klippning sågs. Trädet visar ett kort i bredd och har både sidrullning och intern rullning. Det är användbart men arbetskrävande när områdesval och kort ligger långt från varandra.

Tangentbord: årskursselect med End/Enter, svarsfält med Enter, Escape ur dialog och fullskärm samt efterföljande Tab provades. Tab-fokus på Alla år hade synlig grön kontur i mobilbilden. Fullskärm gav mer kartyta och fungerande Avsluta fullskärm. Detta är inte ett komplett tangentbordstest.

## Begränsningar och misslyckade försök

- Inte testat: felvägar/uppföljning efter två fel, gräns 30/60/90, slutförd automatisk täckning, återtest/återupptagning, flera profiler, export/import, lagringsfel, skärmläsare, zoom, ljus färgpalett, andra mobilstorlekar eller verklig touch. Inget påstående om samtliga 249 färdigheter eller frågebankens täckning.
- Fråga 4 med `13 089 000` misslyckades i UI och finns dokumenterad ovan. Inga svar ändrades genom interna appfunktioner eller tillståndsinspektion.
- Ett tekniskt rg-försök med argumentet questions*.js avvisades av Windows med os error 123. Därefter användes rg med -g '*.js'. Det är ett granskningskommando-fel, inte produktfel. En pipeline med Select-Object -First gav exit 1 efter att förväntade rader skrivits; ingen applikationskrasch observerades.
- Kommandofiler holistic-d-02.json till holistic-d-56.json bevarar UI-stegen. Textutdata för mobilträd, NP och tabbsteg är sparade separat; övriga svarstexter och misslyckandet är transkriberade i denna rapport. Ingen produktkod ändrades för att få fram ett resultat.
