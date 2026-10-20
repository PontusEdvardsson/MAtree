# Naturligt elevläge, överföring och omtag · 2026-10-20

Uppföljning till [första förståelsegranskningen](FORSTAELSEGRANSKNING.md). Publicerad version `88769fd`. Alla försök gjordes i isolerade, fiktiva profiler. Appens frågor, urval, bedömningsgränser och befintliga elevdata ändrades inte.

## Frysta modeller och metod

Tre mycket smala modeller bestämdes före frågorna: Tal kan endast multiplikation av potenser med samma bas; Samband kan endast insättning i den skrivna standardformen y = kx + m; Sannolikhet kan endast formeln för två uttryckligen ordnade drag utan återläggning. Övriga frågor besvaras med Jag vet inte. Inget lärande från återkoppling och inga gissningar i dessa naturliga pass.

Svarsrutinerna från föregående granskning återanvändes utan ändrad beräkning. En kontroll mot de 27 tidigare sparade avancerade frågorna gav exakt samma modellsvar efter att rutinerna gjorts gemensamt åtkomliga. Rutinerna fick endast synlig frågetext, alternativ och tabellceller. Inga facit, mall-ID:n eller dolda bildparametrar gavs till dem. Naturliga pass startades och besvarades via gränssnittets formulär. Ingen aktiv fråga, urvalslista eller rättning injicerades.

Lagrade resultat och moment-ID:n lästes av den tekniska drivern **efter** avslut för att sammanställa utfall och faktiskt prövade förkunskaper. Detta är en teknisk UI-simulering, inte en blind användargranskning eller en studie av verkliga elever.

## 1. Naturligt elevläge

| Begärt urval | Faktiskt utfall | Nya svar | Visad i passet |
|---|---|---:|---:|
| Tal åk 9 | Urvalsreglerna avslutade passet, `coverage` | 8, samtliga överhoppade | 0 |
| Samband & funktioner åk 8 | Urvalsreglerna avslutade passet, `coverage` | 6, samtliga överhoppade | 0 |
| Sannolikhet åk 9 | Start spärrad: inga basmoment i urvalet; appen hänvisar till Testa alla | 0 | Inget pass |
| Sannolikhet åk 8, separat komplettering | Urvalsreglerna avslutade passet, `coverage` | 6, samtliga överhoppade | 0 |

Samtliga startade pass använde `selection: 'course'` och gränsen 30. Åk 9 tvingades inte igång och byttes inte obemärkt till fördjupningsläget Testa alla. Åk 8 är ett separat kompletterande prov med samma svarsrutin.

**Vad prövades faktiskt?** Tal gav två frågor vardera på Miljoner och miljarder, Bas och exponent, Milli/mikro/nano och Naturliga/hela/rationella tal. Samband gav två vardera på Proportionella samband, Samband i tabeller och Timmar/minuter/decimaler. Sannolikhet åk 8 gav två vardera på Gynnsamma och möjliga utfall, Multiplikationsprincipen och Sannolikhet mellan 0 och 1. Alla fick 0/2 och uppföljning.

De riktade avancerade rutinerna efterfrågades aldrig av de naturliga passen. Ingen tidpunkt för Visad i passet finns därför att redovisa. De prövade ingångsmomentens direkta förkunskaper fick inga egna frågor i dessa pass; exakt lista finns i stickprovsfilens `outcomes[].prerequisites`. Förkunskaper utanför valt kursurval godkändes inte automatiskt.

**Begränsning:** resultatet säger att just dessa modeller inte tog sig förbi ingångarna. Eftersom modellerna inte kände igen en enda fråga som erbjöds blir detta i praktiken tre överhoppningsförlopp. Det är inte belägg för att elevläget generellt skiljer procedurkunskap från begreppsförståelse. Nästa relevanta test är en modell som kan några ingångsrutiner men har en preciserad lucka; den måste frysas före nya frågor.

Två tekniska förkörningar avbröts när drivern felaktigt förväntade sig ett startbart baspass i Sannolikhet åk 9. De sparade inga kompletta frågetranskript och räknas inte som fullföljda försök. Startfelet dokumenterades och drivern rättades; svarsrutinerna ändrades inte.

### Separat komplettering: modell som kan ingångsrutiner

Efter användarens uppmaning att fortsätta frystes en **ny, separat modell** före nya frågor. Den ersätter inte ovanstående negativa resultat. Modellutformningen utgick från de tidigare transkripten och frågeformerna, så detta är inte ett blindtest.

Talmodellen kan standardomvandling av miljoner/miljarder, potensberäkning, räkna faktorer och samma bas-regeln. Sambandsmodellen kan standardsituationer med styckepris/fast avgift, linjär extrapolering från tabell, tidsomvandling och insättning i kx+m. Den avstår från bland annat grafavläsning, andra definitioner och andra former. Reglerna och beräkningarna finns i `entryPolicy` i auditkoden. De får fortfarande bara synlig text, alternativ och tabellceller. Ingen anpassning gjordes efter nya facit. En JavaScript-syntaxmiss rättades innan något pass med den nya modellen hann starta.

| Naturligt pass | Totalt | Visad i passet och första tidpunkt | Övrigt underlag |
|---|---:|---|---|
| Tal åk 9 | 21 svar; slutorsak coverage | Miljoner och miljarder vid svar 3; Bas och exponent vid svar 6; Multiplicera potenser vid svar 15. Alla 3/3. | Sex andra moment fick 0/2 efter avstående. |
| Samband åk 8 | 17 svar; slutorsak coverage | Proportionella samband vid svar 3; Samband i tabeller vid svar 6; Timmar, minuter och decimaler vid svar 9. Alla 3/3. | Hastighet/sträcka/tid, recept, grafavläsning och enhetspris fick 0/2 efter avstående. |

I potensmultiplikationens faktiska förkunskaper hade Bas och exponent prövats och blivit visad i samma pass; Addition hade inte prövats. Tabellmomentets direkta förkunskaper Frekvenstabell och Mönster hade inte prövats. De oprövade förkunskaperna till de andra visade momenten listas också i [kompletteringens fullständiga stickprov](tests/understanding-entry-sample.json). Oprövat betyder inte konstaterad kunskapslucka.

**Tolkning:** dessa två modeller kan komma fram till Visad i passet genom naturlig progression, utan att behärska andra former i området. Det är inte automatiskt en felregistrering: rätt tabellberäkning visar något annat än grafavläsning. Samma smala potensmultiplikationsrutin har i det tidigare kontrastprovet gett 32 i stället för 72 vid olika baser. Godkänt på lika baser visar därför inte att den regeln generaliseras rätt. Ingen verklig elevs förståelse är diagnostiserad.

Kompletteringen körs separat med `python tests/ui_preview.py tests/understanding-entry-scenarios.json https://pontusedvardsson.github.io/MAtree/`. De ursprungliga nio rutinerna och första omgångens resultat är bevarade.

## 2. Överföringsfrågor i alla nio områden

Nio nya frågor och referenslösningar skrevs före körningen. Samma frysta rutin anropades med respektive frågas synliga text/tabell, utan referenssvaret. En separat aritmetisk kontroll bekräftade samtliga referensvärden. Dessa prov ligger utanför appens frågebank och registrerar **ingen** elevstatus.

| Område och nytt krav | Modellsvar | Referens | Tolkning |
|---|---:|---:|---|
| Tal: 2³ × 3² | 32 | 72 | Samma-bas-rutinen överanvänds på olika baser. |
| Bråk: antal halvlitersflaskor från 3/2 liter | Inget ändligt svar | 3 | Rutinens symbolparser klarar inte situationens representation. Inte ett observerat matematiskt felsvar. |
| Algebra: koefficient för x i (2x + 3)² | −4 | 12 | Första talets roll och den nya koefficienten hanteras fel. Parser och algebra är sammanblandade i denna begränsning. |
| Geometri: hela halvklotsytan inklusive plan cirkelyta, r = 3 | 56,52 | 84,78 | Rutinen ger bara krökt yta och skiljer inte efterfrågade ytor. |
| Samband: läs y när x är två i en tabell | Inget ändligt svar | 5 | Ny representation stöds inte; inte ett observerat missförstånd om funktioner. |
| Procent: +20 %, sedan −20 %, slutvärde 96; sök ursprung | 0,96 | 100 | Framåtrutinen tolkar givna tal som en startsumma och två satser; omvänd problemstruktur stöds inte. |
| Statistik: gemensamt medel för tre grupper | 5 | 14 | Rutinen använder bara de två första grupperna och ignorerar den tredje. |
| Sannolikhet: en vit och en svart i valfri ordning, 2 vita/3 svarta | Avstår | 3/5 | Utan orden först/sedan matchar inte rutinen. Visar en tolkningsgräns, inte att eleven faktiskt skulle addera vägar fel. |
| Problemlösning: momsbelopp från pris med moms 1250 och 25 % | 1000 | 250 | Rutinen returnerar nettopriset, inte det efterfrågade momsbeloppet. |

Det blev sex oriktiga svar och tre otolkade uppgifter. **Detta är inte nio påvisade begreppsliga missförstånd hos elever.** Frågorna visar gränser i de frysta programmens generalisering, delvis på grund av språk- och strukturmatchning. Exakta formuleringar, tabeller, rutinsvar och referensresonemang finns i stickprovsfilen. Inga rutiner trimmades efter dessa resultat.

## 3. Tio förutbestämda gissningsomtag

En ny fiktiv profil gjorde exakt tio manuella omgångar på Välja och jämföra lägesmått. Regeln var alltid första synliga alternativet, utan att lära från rättning eller sluta när ett önskat resultat inträffade. Samma profil behöll historiken mellan omgångarna.

Poäng i ordning: **2, 2, 0, 1, 0, 1, 1, 0, 1, 2 av 3**. Inget av dessa tio faktiska försök gav Visad kunskap. Alla frågor, alternativ och val sparades. Inga misslyckade omgångar sorterades bort.

De observerade frågorna hade **2, 4 och 4 alternativ**. Under de uttryckliga antagandena att korrekt position är likformigt och oberoende slumpad både mellan frågor och mellan omtag skulle godkänt ha sannolikheten 1/(2·4·4) = 1/32 per omgång, och minst ett godkänt på tio omgångar cirka 27,2 %. Detta är en villkorad matematisk modell, inte en uppmätt appsannolikhet: färskfrågeregler, historik och återkommande innehåll kan påverka oberoendet. Den gäller inte hela frågebanken. Att tio omtag inte gav godkänt visar inte att gissningsrisken är noll.

## 4. Förslag innan frågebanken ändras

- **Tal:** kontrastera lika och olika baser och be eleven ange varför en exponentregel gäller.
- **Bråk:** kombinera symbolisk division med att välja eller skapa en passande mätningssituation.
- **Algebra:** variera koefficienten framför x och be om båda korsprodukterna, inte bara ett isolerat tal.
- **Geometri:** låt eleven välja vilka ytor som ingår innan formeln används, och jämför area med volym.
- **Samband:** bind samman tabell, graf och uttryck; skilj rätt insättning från funktionsbegreppet.
- **Procent:** välj beräkningsbas och räkneriktning innan beräkning; pröva också en motivering till successiva förändringar.
- **Statistik:** variera antalet grupper och deras storlek; låt eleven förklara när ett oviktat gruppmedel blir fel.
- **Sannolikhet:** jämför angiven/valfri ordning och med/utan återläggning; låt eleven konstruera eller komplettera ett träd.
- **Problemlösning:** be eleven identifiera efterfrågat belopp och välja modell i en mindre standardiserad situation.

Ett smalt automatiskt rättat underlag stödjer säkrast **rätt svar i de prövade uppgifterna** och möjligen en specificerad procedur inom dessa former. Bred begreppsförståelse och överföring bör få eget underlag, till exempel nya representationer och observerat resonemang. Det betyder inte att förkunskaper ska godkännas automatiskt eller att senare moment ska spärras tills hela kedjan är grön.

Den tidigare flaggade förklaringstexten om bråkdivision används fortfarande också för multiplikationsfrågor. Dela upp den när frågebanken ändras och bevara gamla sparade frågeobjekt. Den har inte ändrats under detta experiment. Inte heller statusnamn eller trösklar har ändrats.

## Underlag och verifiering

[Körbar audit](tests/understanding-followup.js), [körkonfiguration](tests/understanding-followup-scenarios.json) och [fullständigt stickprov](tests/understanding-followup-sample.json). Kör: `python tests/ui_preview.py tests/understanding-followup-scenarios.json https://pontusedvardsson.github.io/MAtree/`.

Tre ursprungliga naturliga pass gav 20 registrerade svar; tio omtag gav ytterligare 30; de två kompletterande passen gav 38. De fullständigt redovisade körningarna innehåller alltså 88 registrerade svar. Överföringsproven är nio separata rutinanrop och ingår inte i dessa appresultat. Referenslösningar, `selection: 'course'`, högst 30 svar per startat pass samt exakt tio kompletta omtag kontrollerades. Auditkoden kördes i Chrome; inga produktändringar motiverade en ny full produktregression.
