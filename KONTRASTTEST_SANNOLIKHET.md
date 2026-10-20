# Riktat kontrasttest och tillförlitlig inmatning

2026-10-20. Fortsättning på [tre elevtester](ELEVTEST_TRE_NIVAER.md). Endast testverktyg, rapporter och försöksfrågor ändrades. **Inga produktfrågor, bedömningströsklar, resultatregler eller rekommendationer ändrades.**

## 1. Separat DOM-adapter

[pupil-dom-adapter.js](tests/pupil-dom-adapter.js) tar emot ett redan bestämt svar eller ett uttryckligt avstående. Den innehåller ingen matematisk elevpolicy, rättning eller läsning av intern appdata. `read()` lämnar bara synlig frågetext, alternativ och en teknisk frågeidentifierare (`token`) baserad på synligt frågenummer och text.

Adaptern filtrerar bort dolda kontroller, behandlar 0 som ett riktigt svar, stöder implicita HTML-submitknappar och spärrar ett andra inskickningsförsök på samma fråga. Efter inskickning inväntar den nästa synliga fråga eller slutvyn. Formatfel och utebliven bekräftelse blir verktygsfel; de görs aldrig om till Jag vet inte. Vid osäker leverans stoppas körningen utan automatisk omsändning.

Tretton syntetiska kontroller passerade: 0, decimal med komma, Unicode-minus och vanligt minustecken, bråk, flerval med dolt fritextfält, samtidig dubbelinskickning, implicit submitknapp, formatfel, utebliven bekräftelse, uttryckligt avstående, slutvy och saknat svar. Den syntetiska formulärlyssnaren räknade mottagna svar och kontrollerade värdet; dessa tester prövar leverans, inte appens matematiska rättning. Den första förtesten hade tolv godkända fall; därefter lades implicit submit till före frysning och mätning.

En separat **teknisk appkontroll** använde en nyskapad fiktiv profil i isolerad Chrome, lokala appen på produktversion `a7127a0`, Sannolikhet åk 8, max 30. Alla svar var förutbestämda Jag vet inte. Passet avslutades naturligt efter 22 svar. Efter avslut verifierades endast den uttryckligt namngivna testprofilen: exakt 22 sparade svar, alla avståenden, `endReason:'all-tested'`. Ingen annan profillagring exporterades. Detta är ett kompatibilitets- och täckningstest, inte ett elevtest av kunskap.

**Gräns för kvittot:** DOM-övergång bekräftar att gränssnittet gått vidare. Den ensam bevisar inte att exakt ett svar är hållbart lagrat. Exakt en mottagning kontrolleras separat i de syntetiska formulären, och motsvarande antal sparade svar kontrollerades efter det tekniska apppasset. Använd samma oberoende efterkontroll i framtida elevpass utan att ge lagringsdata till svarspolicyn.

## 2. Frysta modeller och nya kontrastfrågor

De tre matematiska kunskapsmodellerna från föregående granskning behölls. Den nya deterministiska tolken i [probability_contrast_policy.py](tests/probability_contrast_policy.py) läser bara synlig frågetext. Den får inga fråge-ID:n, facit, lagrade svar eller tidigare rättning. Tolkningsfel har egen kategori och räknas inte som ett matematiskt missförstånd eller ett avstående.

- Låg modell kan enstaka gynnsamma/alla, men har ingen rutin för villkorade drag eller mellansteget antal kvar: uttryckligt avstående.
- Blandad modell räknar vidare med oförändrat påsinnehåll även utan återläggning. Den kan multiplicera bråk och summera två ordningar. Antal kvar följer samma redan definierade felregel; ingen ny matematikförmåga har lagts till.
- Stark modell ändrar antal när en kula tas bort och kan beräkna båda ordningarna.

Adaptern, frågorna och policyn låstes med SHA-256 före modellkörningen. Råsvar sparades före rättning. Därefter skapades en separat lösning genom uppräkning av märkta kulor och alla ordnade dragpar. Den lösningen anropade inte elevpolicyn. Inga modeller ändrades efter rättning och inget försök kasserades. De åtta frågorna är fritext utan alternativ; den blandade modellens reservgissningsregel behövde alltså aldrig användas.

Detta är **en teknisk överföringskörning, inte ett nytt oberoende blindtest**. Samma granskare skrev en ny begränsad texttolk och frågorna utifrån den dokumenterade modellen. Frågornas språk anpassades före frysning för att kunna läsas av denna tolk. Utfallet bekräftar skillnaden mellan de kodade reglerna, men visar inte hur en verklig elev eller en ny oinsatt granskare skulle läsa frågorna. Modellerna sattes inte genom nya naturliga apppass. Försöksfrågorna ligger utanför produktbanken och påverkar inga elevstatusar.

## 3. Resultat och självständig lösning

Alla uppgifter utgår från samma påse: **3 röda och 5 blå kulor**. Lösningen antar att varje kvarvarande kula är lika sannolik att dras. Den premissen står inte uttryckligen i pilottexterna och bör läggas till före en ny frysning och språkgranskning; de genomförda frågorna har inte ändrats efter rättning. Vid de första sex frågorna är första kulan given som röd. Med återläggning läggs den tillbaka före nästa drag; utan återläggning läggs den åt sidan. De sista två frågorna gäller två drag från ursprungspåsen, utan att första färgen är given.

| Fråga | Oberoende lösning | Blandad modell | Stark modell |
|---|---:|---:|---:|
| Med återläggning: antal inför andra draget | 8 | 8 | 8 |
| Med återläggning: andra kulan röd | 3/8 | 3/8 | 3/8 |
| Med återläggning: andra kulan blå | 5/8 | 5/8 | 5/8 |
| Utan återläggning: antal inför andra draget | 7 | 8 | 7 |
| Utan återläggning: andra kulan röd | 2/7 | 3/8 | 2/7 |
| Utan återläggning: andra kulan blå | 5/7 | 5/8 | 5/7 |
| Med återläggning: en av varje, valfri ordning | 15/32 | 15/32 | 15/32 |
| Utan återläggning: en av varje, valfri ordning | 15/28 | 15/32 | 15/28 |

Utan återläggning är 2 röda och 5 blå kvar efter den givna röda kulan. För en av varje finns 30 gynnsamma ordnade par: 3×5 röda–blå och 5×3 blå–röda. Med återläggning finns 64 ordnade par; utan återläggning finns 56. Därav 30/64 respektive 30/56.

| Modell | Rätt | Fel | Avstår | Parserfel |
|---|---:|---:|---:|---:|
| Låg | 0 | 0 | 8 | 0 |
| Blandad | 4 | 4 | 0 | 0 |
| Stark | 8 | 0 | 0 | 0 |

Den blandade modellen klarade samtliga frågor med återläggning och missade samtliga utan återläggning. Den låga modellens avståenden ger inget stöd för just felidén om oförändrad påse. Inga parserfel observerades på dessa åtta formuleringar; det innebär inte att tolken klarar godtyckliga omformuleringar.

## 4. Vilken slutsats kan ett svar stödja?

Ett korrekt antal kvar stödjer att eleven kan hålla reda på påsens totala antal i den givna situationen. Ett korrekt nästa-dragsbråk stödjer att eleven kan sätta samman gynnsamma och möjliga utfall efter den angivna första färgen. Ett korrekt ”en av varje” stödjer beräkning över båda ordningarna i just denna situation. Inget enskilt slutsvar bevisar varför eleven valt metoden; en kort muntlig eller skriftlig motivering behövs för det. Frågorna ger inte stöd för att hela sannolikhetsområdet eller andra förkunskaper ska godkännas.

## 5. Minsta motiverade produktförslag

Lägg, efter separat språk- och lärargranskning, till en **frivillig riktad nästa kontroll inom det befintliga momentet utan återläggning**. Låt den pröva antal kvar och nästa drags sannolikhet med ett kontrastpar. En separat uppgift kan sedan undersöka de två alternativa ordningarna. Det behövs ingen ny global status eller ändrad godkännandetröskel för detta försök.

Ett möjligt förslag i rapporten är: ”Undersök hur antalet kulor och sannolikheten ändras mellan dragen, med och utan återläggning.” Behåll bråkkontroller som möjliga alternativ, men framställ inget av förslagen som en konstaterad orsak. De här proven motiverar att **pröva** en sådan uppföljning; de motiverar inte automatisk diagnos eller att tolka alla felsvar på samma sätt.

Denna produktändring är **föreslagen, inte införd eller elevvaliderad**. Ny uppföljning ska inte blockera det naturliga passets övriga delar. Ett godkänt senare moment får inte godkänna förkunskaper, och äldre sparade frågor och regler ska bevaras. Den tidigare noterade felaktiga delade förklaringen för bråkmultiplikation är inte ändrad i detta experiment.

## Underlag och verifiering

- [Adapterförtest](tests/pupil-adapter-preflight-sample.json), [tekniskt apppass](tests/pupil-adapter-app-smoke-sample.json).
- [Fryst manifest](tests/probability-contrast-frozen.json), [råsvar före rättning](tests/probability-contrast-responses.json), [oberoende lösning](tests/probability-contrast-key.json), [samtliga rättade svar](tests/probability-contrast-sample.json).
- Kör `python tests/ui_preview.py tests/pupil-adapter-scenarios.json` för adaptertesterna i isolerad Chrome.
- Kör `python tests/run_probability_contrast.py` för första kontrastkörningen. För en ytterligare körning används ett nytt namn, exempelvis `python tests/run_probability_contrast.py probability-contrast-2`. Befintliga försöksmappar skrivs aldrig över. Alla filer hamnar under `.verification/`.
- `python tests/verify_pupil_levels.py` passerade även efter tilläggen. Ingen full produktregression kördes eftersom produktkoden inte ändrades.

Nästa avgränsade steg finns i [fortsättningsprompten](ATGARDSPROMPT_ELEVTESTER.md).
