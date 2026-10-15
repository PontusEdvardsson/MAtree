# Fem tester av den publicerade sidan · 2026-10-15

Utgångspunkt: https://pontusedvardsson.github.io/MAtree/. Varje omgång använde en ny, isolerad Chrome-profil. Alla elevprofiler och svar som skapades var testdata; besökarnas befintliga profiler berördes inte. Laptop 1366 × 768 och mobilstorlekar 360/390 px användes.

| Omgång | Nytt fokus | Utfall |
|---|---|---|
| 1 | Navigation och karta | Årskurs och område gav rätt delmoment. Zoom 160 %, vänsterdragning, dialogåtergång, Pythagoras förkunskapskedja och mobilnavigation passerade. |
| 2 | Manuella kontroller | Ogiltigt svar räknades inte. Svensk decimal och motsvarande bråk godtogs. En slutförd kontroll sparade 3/3. Avbruten respektive godkänd bekräftelse för att kassera en ny omgång lämnade tidigare resultat intakt. |
| 3 | Elevläge och profilbyten | Åtta svar, ett utkast och ett annat områdesval hölls åtskilda för två elever. Överhoppning och läraravslut sparades korrekt. En koordinatbild från ett verkligt urval i åk 9 fungerade på mobil. |
| 4 | Rapporter och fortsatt kontroll | Äldre 3/3 och nyare 0/2 samt manuella historikposter och begränsat underlag passerade. Ett fel hittades: samma pausade kontroll återupptagen från en annan rapport behöll förra rapportens Tillbaka-länk. Länken följer nu rapporten som just användes, medan fråga, utkast och svar bevaras. Samma fall verifierades efter push på Pages. |
| 5 | Säkerhetskopior och dataskydd vid fel | Ett giltigt, sparat underlag med 24 pass gav en egen export på drygt 5 MB, som appens gamla importgräns avvisade. Gränsen höjdes till 20 MB. Filen kunde därefter importeras i en tom webbläsarprofil och överlevde omladdning: 24 pass och 106 unika prövade delmoment. Felaktig import och avbruten radering ändrade inga befintliga resultat. En fil över 20 MB avvisas. |

## Återkör testerna

Kör följande mot Pages, eller utelämna webbadressen för den lokala versionen:

```text
python tests/ui_preview.py tests/live-round-1.json https://pontusedvardsson.github.io/MAtree/
python tests/ui_preview.py tests/live-round-2.json https://pontusedvardsson.github.io/MAtree/
python tests/ui_preview.py tests/live-round-3.json https://pontusedvardsson.github.io/MAtree/
python tests/ui_preview.py tests/live-round-4.json https://pontusedvardsson.github.io/MAtree/
python tests/ui_preview.py tests/live-round-5-export.json https://pontusedvardsson.github.io/MAtree/
python tests/ui_preview.py tests/live-round-5-import.json https://pontusedvardsson.github.io/MAtree/
```

Omgång 5 består av export och import i två separata webbläsarprofiler. Exporten skriver ett tillfälligt testunderlag i `.verification/live-r5-export.json`; kör därför exportscenariot först. Filen innehåller enbart genererade testdata och följer inte med till GitHub.

`python tests/run_browser.py` kontrollerar dessutom hela frågebanken och befintliga regressioner. `verifyCrossReportResume` är regressionen för rapportfelet. Testhjälpen stöder nu verkliga bekräftelsedialoger och filval via webbläsarens protokoll. Läsning av protokollmeddelandens längd har också korrigerats.

Skärmbilder finns i `.verification/live-r1-*` till `live-r5-*`. De två produktändringarna är begränsade till rapportlänken och importens filstorleksgräns. Frågor, facit, bedömningsregler, färdighets-ID:n och befintliga elevresultat har bevarats.

Tester i andra webbläsare, på fysisk mobil och med skärmläsare ingår inte i dessa fem omgångar.
