# Språkgranskning av kopplingsmotiveringar · 2026-10-20

Alla 513 slutliga motiveringar i [dependency-reasons.js](dependency-reasons.js) har lästs igenom: 489 kopplingar i kunskapsträdet och 24 till de separata blandade kontrollerna. 66 texter har justerats för att använda mer igenkännbara begrepp och beräkningssätt från Matte Direkt 7–9.

## Ordval och bokunderlag

Sidnumren nedan är bokens tryckta sidnummer. Genomgången använder de lokala OCR-PDF:erna. Utvalda termexempel i textutdragen har dessutom jämförts med de faktiska PDF-filerna.

| Område | Språkligt val i motiveringarna | Bokunderlag |
|---|---|---|
| Delbarhet och division | Division går jämnt upp utan rest. Täljare, nämnare och kvot ersätter dividend och divisor. | [Matte Direkt 7, Tal](7/Matte%20Direkt%207%20v3/MD%207%20kap%201%20tal_ocr.pdf), s. 12–13; [Matte Direkt 8, Tal](8/Matte%20Direkt%208%20v3/MD%208%20kap%201%20Tal_ocr.pdf), avsnittet division med tal i decimalform. |
| Bråk | Samma nämnare, lika stora delar, förlänga och förkorta. Vid division förklaras det inverterade talet med att täljare och nämnare byter plats. | [Matte Direkt 7, Bråk](7/Matte%20Direkt%207%20v3/MD%207%20kap%204%20br%C3%A5k_ocr.pdf), avsnitten förlängning, förkortning och olika nämnare; [Matte Direkt 9, Styva linan](9/Matte%20Direkt%209%20v3/MD9%20kap%205.2%20Styva%20linan_ocr.pdf), s. 245. |
| Grundpotensform | Talet framför tiopotensen och talets storleksordning. Koefficient och normalisering behövs inte i dessa förklaringar. Gränsen preciseras till minst 1 men mindre än 10. | [Matte Direkt 9, Tal](9/Matte%20Direkt%209%20v3/MD9%20kap%201%20Tal_ocr.pdf), s. 11 och 14–15. |
| Algebra | Samma slags bokstavstermer, bryta ut en gemensam faktor och balansmetoden. Stegen beskriver hur det obekanta talet får stå ensamt. | [Matte Direkt 8, Algebra](8/Matte%20Direkt%208%20v3/MD%208%20kap%203%20Algebra_ocr.pdf), s. 100–102; [Matte Direkt 9, Styva linan](9/Matte%20Direkt%209%20v3/MD9%20kap%205.2%20Styva%20linan_ocr.pdf), s. 248. |
| Funktioner | x-värde och y-värde ersätter invärde och utvärde. Lutningen beskrivs som skillnaden i y-led delad med skillnaden i x-led. Startvärdet knyts till konstanttermen m och lutningen till riktningskoefficienten k. | [Matte Direkt 9, Samband och funktioner](9/Matte%20Direkt%209%20v3/MD9%20kap%203%20Samband%20och%20funktioner_ocr.pdf), s. 98 och 104–106. |
| Geometri | Symmetrilinje, rätvinklig triangel och cylinderns begränsningsyta. | [Matte Direkt 9, Geometri](9/Matte%20Direkt%209%20v3/MD9%20kap%202%20Geometri_ocr.pdf), s. 68; [Matte Direkt 9, Genrepet](9/Matte%20Direkt%209%20v3/MD9%20kap%205.1%20Sluttampen_ocr.pdf), geometrins begreppskarta. |
| Procent | Delen, andelen och det hela. Andelen skrivs i decimalform vid multiplikation och division. | [Matte Direkt 8, Procent](8/Matte%20Direkt%208%20v3/MD%208%20kap%205%20Procent_ocr.pdf), s. 175–178. |
| Statistik och sannolikhet | Relativ frekvens, komplementhändelse och sannolikhet genom försök. Onödig notation och ordet empirisk har tagits bort. | [Matte Direkt 7, Statistik](7/Matte%20Direkt%207%20v3/MD%207%20kap%206%20statistik_ocr.pdf), s. 265; [Matte Direkt 8, Sannolikhet](8/Matte%20Direkt%208%20v3/MD%208%20kap%206%20Sannolikhet_ocr.pdf), s. 211 och 218. |

## Granskningens gräns

Detta är en språk- och begreppsgranskning. Bokunderlaget fastställer inte beroendena i grafen. De 77 granskningsmarkerade sambanden i kartan behåller sina markeringar och beskriver fortsatt möjliga metoder, jämförelser eller tillämpningar. Graf, förkunskaps-ID:n, bedömningsregler och sparade elevuppgifter har inte ändrats.

## Verifiering

- `python tests/run_browser.py`: samtliga kopplingar, rendering i båda riktningarna och grupper, frågor och facit samt elevhistorik, utkast, pausade frågor och export/import.
- `python tests/ui_preview.py tests/fullscreen-scenarios.json`: fullskärm och reservläge, dialoger, Escape, zoom, återställd kartposition, oförändrade elevdata och mobil ned till 320 px.
