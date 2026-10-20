# Kan en smal rutin registreras som kunskap? · 2026-10-20

**Ja, i de provade manuella kontrollerna kunde en smal räknerutin ge Visad kunskap samtidigt som en faktisk förkunskap hade Behöver följas upp.** Det inträffade i åtta av nio områden i den samlade körningen. Algebra gav i stället 2/3 när rutinens hantering av minustecken blev fel. Ingen förkunskap godkändes automatiskt.

Detta visar vad de valda frågorna och registreringsreglerna släpper igenom. Det är **inte ett bevis för att en verklig elev saknar förståelse**, och inte en uppmätt frekvens av falska godkännanden bland elever. Procedurkunskap är också kunskap. Risken gäller hur brett ett godkänt smalt underlag tolkas.

## Metod och avgränsning

Publicerad version `eff6cb4`. En samlad körning använde nio separata fiktiva profiler, en per område, med en avancerad kontroll och en kontroll av en faktisk direkt förkunskap. Förkunskapsmodellen kunde inte lösa uppgifterna och gissade alltid första alternativet eller skrev 0. Det modellerar en lucka; de avsiktliga gissningarna diagnostiserar inte någon människa.

Den avancerade modellen använde områdets smala formel- eller talmall, med beräkningar motsvarande en miniräknare. Den fick endast synlig frågetext, alternativ och tabellceller. Inga facit, dolda bildparametrar, mall-ID:n eller tidigare återkoppling gavs till svarspolicyn. Frågorna och svarsalternativen genererades av den publicerade appen. Svaren lämnades genom formulären och rättades normalt; resultat injicerades inte. Tekniska navigeringsfunktioner användes för att direkt öppna valt moment, så denna del är en riktad UI-simulering och ingen blind användbarhetsgranskning.

Policyns generiska läsning av synliga minustecken med mellanrum korrigerades efter en teknikkörning. Den redovisade huvudkörningen och dess frågor finns i [tests/understanding-sample.json](tests/understanding-sample.json). Modellens fel i algebra behölls; inga extra försök gjordes för att få godkänt där.

En separat oinsatt granskaragent provade sannolikhet med verkliga klick och tangenter. Den fick ingen produktkod, tidigare rapport eller facit före sina svar. Totalt registrerades 54 svar i huvudkörningen och sex i den separata granskningen. Alla svar gäller isolerade testprofiler.

## Resultat i samtliga områden

Förkunskapens poäng nedan var oförändrad efter den senare kontrollen. 3/3 gav Visad kunskap; lägre resultat i en fullständig manuell kontroll gav Behöver följas upp.

| Område | Senare moment och smal strategi | Provad förkunskap | Förkunskap | Senare moment |
|---|---|---|---:|---:|
| Tal | Multiplicera potenser: addera exponenter vid samma bas och använda potensberäkning | Bas och exponent | 0/3 | **3/3, visad** |
| Bråk | Dividera med bråk: invertera och multiplicera, även i standardiserad luckuppgift | Likvärdiga bråk | 0/3 | **3/3, visad** |
| Algebra | Kvadreringsreglerna: avläst konstant i a² och ett memorerat koefficientuttryck | Multiplicera två parenteser | 0/3 | **2/3, följ upp** |
| Geometri | Klotets begränsningsyta: 4·3,14·r², halveringsregler för diameter och halvklot | Cirkelns area | 0/3 | **3/3, visad** |
| Samband & funktioner | Beräkna funktionsvärden: sätt tre avlästa tal i k·x+m | Funktionsbegreppet | 0/3 | **3/3, visad** |
| Procent | Flera förändringar: multiplicera två faktorer 1±p/100 efter orden höjs/sänks | Förändringsfaktor | 1/3 | **3/3, visad** |
| Statistik | Viktat medel: multiplicera tabellkolumner, summera, dividera vid medelvärde | Medelvärde | 1/3 | **3/3, visad** |
| Sannolikhet | Två drag utan återläggning: memorerad produkt med minskad total | Oberoende träddiagram | 1/3 | **3/3, visad** |
| Problemlösning & verktyg | Moms: välj multiplikation eller division med 1+p/100 efter standardordalydelsen | Ursprungsvärde efter förändring | 0/3 | **3/3, visad** |

### Konkreta observationer

- **Tal:** 5^5 × 5^1 gav exponenten 6; 2^4 × 2^4 gav 256. Ingen av de tre frågorna prövade när regeln inte får användas, exempelvis olika baser, eller krävde en förklaring med lika faktorer.
- **Bråk:** 7/4 ÷ 3/9 besvarades med 63/12 och godkändes. Luckuppgiften 5/9 ÷ □ = 45/27 löstes också med samma beräkningsrutin. Ingen av de tre frågorna krävde tolkning av division i en situation eller förklaring av inversen.
- **Algebra:** konstanten i (x + 8)² och hela utvecklingen av (x + 9)² blev rätt. För (x − 2)² gav modellen felaktigt koefficienten +4 i stället för −4. Detta stoppade godkännandet. Ett fel som kontrollen faktiskt fångade ska inte räknas som en genomsläppt lucka.
- **Geometri:** radie, diameter och krökt halvklotsyta varierades, vilket är bättre än tre identiska insättningar. Den memorerade formeln och två halveringsregler räckte ändå; ingen fråga krävde att härleda, välja mellan area och volym eller bedöma hur arean ändras när radien fördubblas.
- **Samband:** alla tre frågor var av formen Beräkna y = kx + m när x = ett tal. Insättningsrutinen behövde inte förklara funktion, knyta uttrycket till graf eller avgöra om en relation är en funktion.
- **Procent:** höjning/sänkning, två sänkningar och två höjningar provades. Rutinen räknade exempelvis 1500 efter +15 % och −15 % till 1466,25. Ingen motivering till varför förändringarna inte tar ut varandra behövde lämnas.
- **Statistik:** både frekvenstabell och två grupper ingick. Det gemensamma medelvärdet för fyra elever med medelvärde 2 och sju med medelvärde 12 blev 92/11. Viktning beräknades, men eleven behövde inte förklara varför gruppmedelvärden inte alltid får medelvärdesbildas direkt.
- **Sannolikhet:** tre uppgifter frågade efter två färger i uttryckligen angiven ordning. Färdiga träddiagram visade grenbråken. Det prövade inte att konstruera trädet, skilja angiven ordning från valfri ordning eller förklara beroendet.
- **Problemlösning:** tre momsuppgifter hade tydliga standardord: pris utan moms, pris med moms, respektive momsbelopp. Rutinen behövde inte själv välja modell i en ny problemtext eller förklara beräkningsbasen.

## Separat blind kontroll av sannolikhet

Granskaren bestämde tvådragsformeln före frågorna. Med tre vita och åtta svarta kulor gav den 3/55 för vit–vit och 12/55 för vit–svart. Med fyra vita och tre svarta gav den 1/7 för svart–svart. Resultatet var 3/3 och Visad kunskap.

Därefter provades den direkta förkunskapen Bråk gånger bråk med förbestämd gissningsregel: 0, 0, första alternativet. Det sista råkade vara rätt, vilket gav 1/3 och Behöver följas upp. Vid återöppning visades samtidigt Visad kunskap på det avancerade momentet och Behöver följas upp på förkunskapen. Den andra förkunskapen var fortfarande Inte prövad. Ingen ändrad resultatlogik eller lagringsinspektion användes i denna granskning.

Granskaren observerade dessutom att en multiplikationsfråga hade förklaringen ”Vid division multipliceras med det andra bråkets invers”. Den delade förklaringstexten är olämplig för den frågan och bör delas upp i nästa ändring. Facit var korrekt.

## Slutsats för fortsatt arbete

1. **Registreringen håller isär underlagen.** Ett senare godkännande godkänner inte förkunskaper. Det är önskat beteende och ska bevaras. En underkänd förkunskap bevisar inte heller att senare uppgifter måste vara omöjliga att lösa.
2. **Godkännandet är bredare formulerat än vad dessa tre frågor säkert visar.** De undersöker främst procedurer inom kända former. De provade kontrollerna krävde inget eget resonemang. Visad kunskap kan därför övertolkas som säker begreppsförståelse eller förmåga att överföra kunskapen.
3. **Nästa tester bör försöka falsifiera rutinens räckvidd.** Lägg separata överföringsfrågor och kontraster utanför den invanda formen: olika potensbaser, tolkning av bråkdivision, annan koefficient framför x, skalning av klotyta, graf–uttryck, procentens beräkningsbas, oviktat kontra viktat medel, dragordning samt ny momsituation. Pröva dem med samma frysta elevpolicy, utan att ge facit först.
4. **Ändra inte till automatiskt godkända förkunskaper eller krav på grön förkunskapskedja.** Det löser inte mätproblemet. Eventuell skärpning bör gälla mer varierat underlag och tydligare skillnad mellan rätt svar, visad metod och begreppslig förståelse.

Automatiskt elevläge, gissning över många omtag, långsiktig inlärning av mallarna och faktiska elever ingår inte i denna begränsade omgång. Inga appfrågor, trösklar eller elevresultat har ändrats. Körbar audit finns i [tests/understanding-audit.js](tests/understanding-audit.js); anrop: `python tests/ui_preview.py tests/understanding-scenarios.json https://pontusedvardsson.github.io/MAtree/`. En ny körning ger nya slumpade exempel och kan få andra gissningspoäng. Resultatet är utforskande, inte ett regressionstest som kräver åtta godkännanden.
