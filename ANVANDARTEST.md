# Två oinsatta granskningar av MAtree · 2026-10-20

Granskad version: `bbd5836`, publicerad på [MAtree](https://pontusedvardsson.github.io/MAtree/).

Två separata granskaragenter fick nya kontexter utan projekthistorik, produktkod, dokumentation eller tidigare rapporter. De fick länken och uppgifter, utan anvisningar om vilka knappar som skulle lösa dem. En granskade som förstagångslärare och en som elev. Granskarna använde varsin tom Chrome-profil och påhittade elevdata. Inga produktändringar gjordes under granskningen.

Detta är simulerade förstagångstester med AI, inte en användarstudie med verkliga lärare eller elever. Mobilstorlekar emulerades i Chrome; fysisk touch, skärmtangentbord och mobila webbläsarfält testades inte. Resultaten är underlag för konkreta förbättringar och nästa användartest.

## Vad som faktiskt provades

**Lärare:** hitta innehåll för åk 8 och bråk, välja ett delmoment, skicka ett felsvar, avsluta kontrollen i förtid, hitta exakt fråga och elevsvar i historiken, ladda om, undersöka närmaste förkunskap samt använda mobilkarta och fullskärm.

**Elev:** hitta start för åk 7, besvara tolv uppgifter, använda Jag vet inte, pausa med ett markerat alternativ, fortsätta, växla mellan mobil och dator, avsluta och öppna facit via rapportens synliga kontroller. Frågor löstes utan interna appobjekt eller dolda facit. Båda granskarna använde faktiska klick och tangenttryckningar samt läste gränssnittets synliga text.

## Prioriterade fynd

Prioriteringen nedan är huvudgranskarens sammanvägning. Förslagen har inte implementerats eller effektprövats i denna omgång.

| Ordning | Observerad friktion | Belägg och konsekvens | Föreslagen ändring |
|---|---|---|---|
| 1 | Svag bekräftelse efter avslut. | Båda kom direkt tillbaka till kartan och behövde leta efter underlaget. De sparade svaren fanns. Elevrapporten sa dessutom att läraren avslutat, trots att Avsluta-knappen i elevläget användes. | Bekräfta att passet avslutats och svaren sparats, med direkt väg till just detta underlag. Använd neutral aktör när den inte är känd. |
| 2 | Elevstarten talar till läraren. | På 390 × 844 behövde elevgranskaren scrolla förbi en lång inställnings- och regeltext till ”Starta elevens pass”. Det skapade osäkerhet om vem som skulle göra detta steg. | Tydliggör lärarens inställningssteg och elevens start. Korta den synliga introduktionen och gör nästa handling lättare att hitta. |
| 3 | Förslaget på nästa kontroll ser mer situationsanpassat ut än förklaringen visar. | Efter ett fel på addition av bråk med olika nämnare och tidigt avslut föreslogs Bråk som del av en hel med en allmän startmotivering. Läraren valde själv Gemensam nämnare via det prövade momentet. | Märk en allmän startpunkt som sådan. Erbjud de närmaste förkunskaperna med befintliga matematiska motiveringar utan att påstå att ett felsvar bevisar en viss lucka. |
| 4 | ”0 av N visade” kan tolkas som öppnade eller synliga kort. | Lärarens första tolkning handlade om visningsläge. Först i gruppdialogen klargjordes att räknaren gäller visad kunskap. | Skriv exempelvis ”Visad kunskap: 0/2” och håll antalet prövade moment separat. |
| 5 | Elevens återstående omfattning är otydlig. | Ett standardpass med högst 30 uppgifter visade ”Uppgift 12” i frågevyn, utan tak eller lokal förklaring till när passet blir klart. | Visa besvarat antal och uppgiftstak, med en kort upplysning om att passet kan sluta tidigare. Undvik en missvisande exakt procent när längden varierar. |
| 6 | Mobilens fullskärm ger begränsad sambandsöverblick. | Gruppvyn fungerade, men delmomentskartan krävde sidoförflyttning. Kontrollerna tog drygt 300 px i 390 × 844. Panorering, sökning och öppning fungerade. | Prova infällbara kartkontroller i fullskärm och en kompakt vy för valt moment med närmaste kopplingar. Jämför med samma uppgifter i nästa test. |

Fynden handlar främst om begriplighet, återkoppling och orientering. Ingen dataförlust observerades. Det finns inget belägg från dessa tester för att hela grafen, urvalsreglerna eller bedömningen är pedagogiskt validerade.

## Frågestickprov

Tolv frågor från elevgranskarens sista sammanhängande körning dokumenterades. Elva hade ett giltigt oberoende lösningsförsök före facitjämförelsen. Samtliga tolv facit öppnades genom rapportens gränssnitt och stämde med de slutligt visade frågorna.

| Fråga i sista körningen | Oberoende lösning / facit | Bedömning |
|---|---|---|
| Antal hörn i en femhörning | Facit 5. Inget giltigt oberoende försök i denna körning. | Figuren och facit stämde. Se metodbegränsningen nedan. |
| Antal sidor i en sexhörning | 6 / 6. Jag vet inte skickades avsiktligt. | Matematik och överhoppning fungerade. |
| Värdet på tiotalsplatsen i 914 | 10 / 10 | Korrekt; markerat svar bevarades under paus. |
| 2 hundratal, 7 tiotal och 3 ental | 273 / 273 | Korrekt och entydigt. |
| Antal hela tiotal i 24 | 2 / 2 | Korrekt; fritext och Enter fungerade. |
| Sams antal böcker i en tabell med värdet 16 | 16 / 16 | Korrekt tabellavläsning. |
| Största av 7, 1 och 18 | 18 / 18 | Korrekt. |
| Minsta av 10, 2 och 15 | 2 / 2 | Korrekt. |
| 2 + 6 = □ + 6 | 2 / 2 | Korrekt. |
| Likhetstecknets betydelse i 6 = 3 + 3 | Båda leden har samma värde. | Korrekt begreppsfråga. |
| 8 + 9 = 18 − □ | 1 / 1 | Korrekt; symbolerna var läsbara på mobil. |
| 5/12 + 7/12 | 1 / 1 | Korrekt; förenklad summa fanns bland alternativen. |

Stickprovet täcker några grundläggande frågor med figurer, tabeller, tal, likhet och bråk. Det räcker inte för slutsatser om hela frågebanken eller om svårighetsnivån i ett helt åk 7-pass. Granskaren noterade att de första elva frågorna upplevdes som grundläggande; detta behöver följas upp mot avsiktligt starturval och verkliga elevförutsättningar.

**Metodbegränsning:** Tidigare avbrutna körningar hade andra frågor. Elevgranskaren blandade först ihop en rektangel från ett tidigare försök med den sista körningens femhörning och rapporterade ett möjligt facitfel. Skärmbildskontrollen visade att facit 5 var korrekt. Påståendet rättades och räknas inte som ett produktfel. Den frågan ingår inte bland de elva oberoende lösningsförsöken. Det illustrerar varför varje fynd måste kopplas till samma sparade fråga och bild.

## Det som fungerade

- Årskurs och område gjorde det möjligt att hitta ett hanterligt urval och ett relevant bråkmoment utan instruktioner om knapparna.
- Motiveringarna i **Bygger på** hjälpte läraren välja en närliggande förkunskap. Förklaringen om lika stora delar före addition var särskilt användbar.
- Exakta manuella frågor, elevsvar och facit gick att hitta i historiken även efter omladdning. Tidigt avslut gav begränsat underlag med rätt nämnare.
- Elevens frågevy var lugnare än startsidan. De provade figurerna, tabellerna, fritextfälten och alternativen gick att använda.
- Paus och fortsättning bevarade samma fråga och markerade alternativ. Avslut, sökning, dialoger, fullskärm och faktisk panorering fungerade i de provade flödena.

## Nästa tandemomgång

Gör först små, avgränsade ändringar kring avslutskvittens, statusord och startflöde. Ge sedan en ny oinsatt granskare samma uppgifter och jämför om färre gissningar och omvägar krävs. De nuvarande granskarna känner redan sidan och kan inte längre ge ett nytt förstagångsintryck. Testa därefter med en faktisk lärare och elev, inklusive fysisk mobil och skärmtangentbord.
