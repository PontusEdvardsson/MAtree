# Publicera MAtree på GitHub Pages

Appen är statisk HTML, CSS och JavaScript och behöver ingen serverkod eller API-nyckel. Den fungerar både direkt från `index.html` och under projektadressen `https://pontusedvardsson.github.io/MAtree/`.

## Uppladdningspaket

Kör `python tests/build_pages.py` för att skapa `.verification/matree-github-pages.zip`. Paketet innehåller appens filer, `.nojekyll` och de 21 PDF-filer som appens bokhänvisningar använder. Bokfilerna ligger kvar under exempelvis `7/Matte Direkt 7 v3/`. Fristående lärarmaterial ingår inte i paketets filurval.

1. Packa upp zipfilen.
2. Öppna https://github.com/PontusEdvardsson/MAtree och välj **Add file → Upload files**. I ett tomt repo finns motsvarande länk för att ladda upp filer.
3. Ladda upp de uppackade filerna och mapparna. `index.html`, `styles.css`, JavaScript-filerna och `.nojekyll` ska ligga direkt i repots rot; `7`, `8` och `9` ska vara mappar bredvid dem. Ladda inte upp zipfilen som webbplatsens innehåll.
4. Spara uppladdningen med **Commit changes** på `main`.
5. Välj **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
6. Välj **main** och **/(root)** och klicka **Save**.
7. När publiceringen är klar visas adressen https://pontusedvardsson.github.io/MAtree/ under Pages.

Ingen byggtjänst eller egen GitHub Actions-fil krävs. `.nojekyll` gör att filerna publiceras utan Jekyll-bearbetning. Instruktionerna följer [GitHubs dokumentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## PDF-filer

Länkarna är relativa till projektet och behåller PDF-sidnumret, exempelvis `7/Matte%20Direkt%207%20v3/MD%207%20kap%201%20tal_ocr.pdf#page=5`. Behåll filnamn och stora/små bokstäver exakt. Appens frågor fungerar även utan böckerna, men en boklänk kräver att motsvarande PDF har laddats upp.

Repot och Pages-webbplatsen är offentliga. PDF-filer som publiceras blir åtkomliga för besökare; publicera bara sådant som får delas offentligt.

## Flytta elevprofiler från den lokala sidan

1. Öppna den gamla lokala sidan och välj **Elevprofiler → Exportera profiler**.
2. Öppna Pages-adressen och välj **Elevprofiler → Importera profiler**.

Den nya webbadressen har egen webbläsarlagring, så de lokala profilerna flyttas inte automatiskt. Profiler, resultat och utkast stannar i den webbläsare som används; de skickas inte till GitHub och synkas inte mellan elevernas datorer. För över resultat med export/import när det behövs. Säkerhetskopior med elevresultat ska inte läggas i repot.

## Verifiering

Områdesvalet finns i startdialogen under årskursurvalet. Välj exempelvis **Åk 7**, **Tal & räkning** och **Testa alla** för ett fullständigt pass inom just det området. Rapporter och pausade pass visar både årskurs och område. Regressionstesterna täcker alla 45 kombinationer av fem årskursurval och nio kunskapsområden, inklusive tomma urval och bakåtkompatibilitet med äldre pass utan områdesfilter.

`python tests/pages_browser.py` bygger paketet och öppnar det via en lokal HTTP-server under `/MAtree/`, med en isolerad Chrome-profil. Testet kontrollerar samtliga 21 appresurser och 21 boklänkar, skapad elevprofil, manuell kontroll, Testa alla, paus, omladdning, utkast och export/import. Importen behåller den aktiva eleven från exporten även när den inte är första profilen.

Skärmbilder finns i `.verification/pages-*.png`. Den vanliga regressionstestsviten körs med `python tests/run_browser.py`.
