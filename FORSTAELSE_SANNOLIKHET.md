# Fryst felidé om återläggning · 2026-10-20

Uppföljning till [förståelsegranskningen](FORSTAELSEGRANSKNING.md) och [naturligt elevläge/överföring](FORSTAELSE_UPPFOLJNING.md). Granskad publicerad version: `2b439b4`. Inga produktfrågor, bedömningsgränser eller verkliga elevprofiler ändrades.

**Huvudfynd:** den preciserade felidén fångades i det naturliga sannolikhetspasset när villkoret utan återläggning prövades. Samtidigt visades sex andra moment där modellen faktiskt gav rätt svar. Separata, förutbestämda omtag visade att ren förstahandsgissning kan registreras som Visad kunskap: försök 7 av 8 gav 3/3.

## 1. Modell och förhandsbestämd metod

Före browserkörningen frystes en separat modell:

- Kan enkel gynnsam andel, sannolikheter mellan 0 och 1, säker/omöjlig händelse, enkla kombinationer, komplement och förväntat antal.
- Kan multiplicera längs en tvådragsväg och summera de två ordningarna för olika färger.
- **Felidé:** påsens innehåll ändras aldrig. Vid två drag används därför samma total och samma antal av färgen på båda dragen, även när texten säger utan återläggning.
- Andra frågetyper besvaras med Jag vet inte. Om modellens beräknade svar saknas bland flervalsalternativen väljs första alternativet och detta markeras som en separat gissning.
- Ett vanligt pass i Sannolikhet åk 8, högst 30 svar. Därefter exakt åtta manuella omtag på Funktionsbegreppet med första alternativet varje gång, utan inlärning från facit. Ingen förlängning eller stopp vid godkänt.

Svarspolicyn fick endast synlig frågetext och svarsalternativ. Den använde inga facit, mall-ID:n, optionValues eller dolda bildparametrar. Passet följde appens naturliga urval via gränssnittets formulär, utan injicerade frågor, resultat eller ändrad urvalslista. Lagrade utfall och grafmetadata lästes först efter avslut för rapportering. Detta är en teknisk UI-simulering av en uttrycklig felidé, inte en diagnos av verkliga elever.

## 2. Naturligt elevläge

Passet använde `selection: 'course'`, årskurs 8 och gränsen 30. Det avslutades vid uppgiftstaket. Samtliga 30 frågor, modellens beräkning, faktiskt valt/inskrivet svar, eventuellt gissningsbyte och rättning finns i [stickprovet](tests/understanding-probability-sample.json).

| Moment | Utfall | Först Visad i passet efter svar |
|---|---:|---:|
| Gynnsamma och möjliga utfall | 3/3, visad | 3 |
| Multiplikationsprincipen | 3/3, visad | 6 |
| Sannolikhet mellan 0 och 1 | 3/3, visad | 9 |
| Förväntat antal utfall | 3/3, visad | 12 |
| Ordna olika föremål | 0/2, uppföljning; avstod | — |
| Träddiagram: oberoende händelser | 3/3, visad | 17 |
| Addera alternativa vägar | 2/4, uppföljning | — |
| Komplementhändelser | 3/3, visad | 24 |
| Träddiagram: utan återläggning | 0/2, uppföljning | — |
| Sannolikhet från försök | 0/2, uppföljning; avstod | — |
| Minst en: komplementmetoden | 0/2, uppföljning; avstod | — |

**Var fångades felet?** Vid alternativa vägar fungerade de två frågorna med återläggning. Frågorna utan återläggning gav däremot fel. Exempel: fyra vita och fem svarta, exakt en vit i valfri ordning. Modellen skrev 40/81; korrekt är 2·4/9·5/8 = 5/9. Båda ordningarna summerades, men beroendet saknades. Detta är den avsedda matematiska felregeln och inget parsermisslyckande.

I det direkta momentet utan återläggning gav tre vita och tre svarta i ordningen vit–svart modellsvaret 9/36 = 1/4; korrekt är 3/6·3/5 = 3/10. Det rättades fel. På den andra frågan i momentet saknades modellens felaktiga bråk bland alternativen; den förhandsbestämda gissningsregeln användes och gav också fel. Detta gissningssvar ska inte tillskrivas modellens räkneidé. Det inträffade bara en gång i passet och markeras `choiceGuess`.

**Vilka förkunskaper prövades?** Till oberoende träddiagram hade Gynnsamma och möjliga utfall prövats och visats; Bråk gånger bråk fick inga egna frågor. Till beroende träddiagram hade oberoende träddiagram prövats och visats, medan bråkmultiplikation fortfarande inte prövats. Till alternativa vägar hade oberoende träddiagram prövats, men addition av bråk med olika nämnare inte prövats. Fullständig lista finns per moment i stickprovets `prerequisites`.

De sex visade momenten gäller rätt svar inom sina prövade former. **Visad oberoende sannolikhet är förenlig med den här elevmodellen och innebär inte visad förståelse för beroende drag.** Appen skilde mellan de momenten i denna körning. Oprövade förkunskaper godkändes inte automatiskt och är inte samma sak som konstaterade luckor.

## 3. Litet blindtest av kontrastfrågor

En separat oinsatt granskaragent fick endast tre skrivna frågor och den frysta felidén, utan produktkod, projekthistorik eller våra referenssvar. Den lämnade först felmodellens svar och löste sedan frågorna oberoende. Detta är ett blindtest av formuleringar och åtskillnad mellan metoder, inte ett användartest med faktiska elever eller ett apppass.

Påsen innehåller i alla tre frågor två vita och tre svarta kulor:

| Fråga | Fryst felmodell | Oberoende referens |
|---|---:|---:|
| Först vit, sedan vit, utan återläggning. Motivera andra dragets sannolikhet. | 4/25; hävdar fortfarande två vita av fem | 1/10; andra draget är en vit av fyra kvarvarande |
| Samma följd, med återläggning | 4/25 | 4/25 |
| En vit och en svart, utan återläggning, valfri ordning | 12/25 | 3/5 |

Den oinsatta granskaren bedömde formuleringarna som tydliga. Referenslösningarna överensstämde med en separat bråkräkning och med ett separat anrop av den frysta policyn på motsvarande formuleringar. Resultatet kräver ingen ändring av policyn efter facit.

Den andra frågan **särskiljer inte felidén**: rätt siffersvar fås även med den bristande modellen. Den är användbar som kontrast till första frågan. Att eleven uttryckligen förklarar en vit av fyra efter första vita draget ger starkare stöd om beroendet än ett korrekt siffersvar ensamt. Den tredje frågan skiljer också metoderna, men prövar samtidigt summering av ordningar. Ett fel där behöver därför följas upp, inte få en säker automatisk orsaksdiagnos.

## 4. Åtta omtag på en annan kontroll

Funktionsbegreppet valdes som en annan kontroll än det tidigare lägesmåttstestet. Samma fiktiva profil använde första synliga alternativet i exakt åtta omgångar, utan att använda tidigare rättning. Poäng i ordning:

**1, 1, 1, 0, 1, 1, 3, 1 av 3.**

Försök 7 gav 3/3 och registrerades som Visad kunskap trots den rent gissande policyn. Försök 8 genomfördes också enligt den förbestämda planen och gav 1/3. Det senast registrerade resultatet var alltså inte godkänt. Alla försök, även misslyckandena, finns i stickprovet.

Alternativantalet var varje gång **4, 2 och 4**. Om korrekta positioner vore likformigt och oberoende slumpade mellan frågor och försök skulle ett godkänt ha sannolikheten 1/32 per omgång och minst ett godkänt på åtta cirka 22,4 %. Detta är en villkorad matematisk jämförelse, inte en verifierad fördelning i appen. Ett observerat godkänt av åtta får inte tolkas som skattad risk 12,5 % för banken eller för elever i allmänhet. Att frågeinnehåll återkommer, färskfrågeregler och historik kan påverka oberoendeantagandet. Inlärning från facit var uttryckligen inte en del av modellen.

## 5. Slutsatser före en bankändring

- Behåll skillnaden mellan prövade procedurer och bred begreppsförståelse. Den här specifika felidén fångades när frågor utan återläggning faktiskt erbjöds.
- Använd kontrasten med/utan återläggning och en motivering om kvarvarande kulor. Rätt svar på enbart återläggningsfrågor ger inte stöd för att eleven skiljer beroende från oberoende.
- Registreringen kan tillfälligt bli Visad kunskap genom ren gissning vid omtag. Historiken är relevant underlag; ett enskilt godkänt litet flervalstest ska inte beskrivas som säker förståelse.
- Föreslagen bankutveckling är några varierade kontrast-/metodfrågor, inte automatiskt godkända förkunskaper eller spärrad progression. Förklara först vilket svar och resonemang som stödjer respektive status.
- Den flaggade förklaringstexten om division i multiplikationsfrågor kvarstår. Dela upp den när frågebanken ändras, med äldre sparade förklaringar och frågeobjekt bevarade. Den ändrades inte under detta frysta experiment.

## Underlag och kontroller

[Auditkod](tests/understanding-probability.js), [körkonfiguration](tests/understanding-probability-scenarios.json), [fullständigt stickprov](tests/understanding-probability-sample.json). Kör: `python tests/ui_preview.py tests/understanding-probability-scenarios.json https://pontusedvardsson.github.io/MAtree/`.

Den enda browserkörningen gav 30 naturliga svar och 24 manuella omtagssvar, totalt 54. Utanför appen gjordes tre kontrastanrop. Referenserna 1/10, 4/25 och 3/5 kontrollerades oberoende; årskurs, kursurval, svarstak, antal kompletta omtag, alternativantal, rättningspoäng, sex visade utfall och en flaggad reservgissning kontrollerades. Ingen produktkod eller produktdata ändrades, och därför behövdes ingen ny full produktregression.
