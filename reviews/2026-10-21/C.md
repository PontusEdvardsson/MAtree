# Oberoende helhetsgranskning C

2026-10-21. Lokal index.html, uppgiven HEAD 45c362e. Ingen README, tidigare rapport eller annan granskares fynd läst. Ingen produktkod ändrad. Isolerad Chromeprofil på port 9913, fiktiv profil **Fiktiv C**. Webbläsaren stängd med helperns stop. Granskningen omfattade cirka 8 minuter praktiskt UI-stickprov samt dokumentation.

## Samlad bedömning

Appen fungerar väl som en konkret ingång till samtal om elevens matematikkunskaper. Elevläget är märkbart tydligare än lärarens karta: stor fråga, tydligt svarsfält, stora svarsalternativ och ett synligt alternativ att inte veta. Rapporten visar verkliga frågor, elevsvar och facit och skiljer oprövat från visat. Jag fann inget matematiskt fel i mina nio inskickade svar över tre områden. Det är ett mycket begränsat stickprov, inte ett godkännande av hela uppgiftsbanken eller metodens diagnostiska giltighet.

Störst förbättringsbehov: precisera löftet om täckning före passet, förstärk några ljusa kontroller och dämpa kartans visuella konkurrens. Tre rätt på närliggande enkla frågor är tydlig lokal evidens men ett smalt kunskapsunderlag. Rapportens försiktiga formuleringar är därför viktiga.

## Första intryck, före produktkod

Desktop 1365×900 började i mörkt tema. Karta, sidomeny och huvudknappar är konsekventa och det framgår vilken elev som är aktiv och att arbetet sparas på enheten. Grön färgskala och olika områdessymboler känns sammanhållna. Detta är en estetisk bedömning, inte en kontrastmätning.

Samtidigt konkurrerar elevläge, föreslaget moment, årskursflikar, grupper/delmoment, områden, sök och Fler val om uppmärksamheten. 62 kort, 249 delmoment och 481 kopplingar ger omfattning men förklarar inte direkt vad en ny lärare bör göra först. Delar av kartan och sidan har separata rullytor. Elevlägets avskalning är lyckad.

## Genomförda UI-steg och egen matematik

Skapade profil via profilknappen, valde Åk 7 och alla områden, högst 30. Löste frågorna före facit. Bytte tema i elevläget och storlek till 390×844. Avslutade efter sex inskickade svar, öppnade Visa svar och facit och kontrollerade resultatet. Startade sedan Åk 7 / Statistik och skickade tre ytterligare svar. Följande egna lösningar skrevs in före rapportvisning:

| Område | Synlig fråga | Egen lösning/svar | Efterkontroll |
|---|---|---|---|
| Geometri | Hur många hörn har figuren? Visad kvadrat. | Fyra hörn, svar 4. | Rätt i rapport. |
| Geometri | Hur många sidor har figuren? Visad triangel. | Tre kanter, val 3. | Rätt i rapport. |
| Geometri | Vilken figur visas? Visad triangel. | Triangel. | Rätt i rapport. |
| Tal | Värdet på tiotalsplatsen i 881. | 8×10 = 80. | Rätt i rapport. |
| Tal | 2 hundratal, 6 tiotal, 9 ental. | 200+60+9 = 269. | Rätt i rapport. |
| Tal | Hur många hela tiotal finns i 47? | 47 = 4×10+7, svar 4. | Rätt i rapport. |
| Statistik | Kim i tabell Ali 15, Kim 5, Sam 8. | Rätt rad ger 5 böcker. | Rätt i rapport. |
| Statistik | Största antalet: måndag 11, tisdag 5, onsdag 19. | Max = 19. | Rätt i rapport. |
| Statistik | Minsta antalet: Ali 18, Kim 11, Sam 1. | Min = 1. | Rätt i rapport. |

Ytterligare två frågor syntes men skickades inte in: Kim hade 1 bok i första passets sjunde fråga; medelvärdet av 6, 1, 12 i andra passets fjärde fråga blir 19/3 = 6,333 avrundat till tre decimaler. De ingår inte i påståendet om nio kontrollerade svar.

De synliga frågorna har kort, begripligt språk och anger när heltal krävs. Tabellrubriken Värde eller kategori är teknisk men själva frågorna enkla att förstå. Åk7-valet började med hörn och sidor och därefter hundratal/tiotal. Det kan vara pedagogiskt avsiktligt, men en förklaring om ingångsfrågor skulle hjälpa en högstadielärare att förstå passets början.

## Fynd med prioritet, säkerhet och minsta åtgärd

### C1 — P2: Starttexten lovar mer täckning än uppgiftstaket tillåter

**Reproduktion:** Nytt pass → Åk7 → Alla områden → Högst30. UI visade 79 delmoment och texten ”Alla delmoment i urvalet undersöks, men högst 30 uppgifter.” Ett enda pass med 30 frågor kan inte undersöka vart och ett av 79 delmoment ens en gång. Mina sex frågor gav bara två prövade delmoment; rapporten redovisade korrekt 77 ej prövade.

**Säkerhet:** Hög. Synlig UI-text och enkel räkning; kodstöd i adaptive-ui.js:74. **Konsekvens:** Läraren kan överskatta bredden hos en kort kontroll redan vid start. **Minsta åtgärd:** Skriv ”Urvalet innehåller 79 delmoment. Passet undersöker ett urval tills högst 30 uppgifter har besvarats” och visa att upprepade frågor på samma delmoment använder taket.

### C2 — P2: Ljust tema har svag svarsetikett och mycket diskret inmatningskant

**Reproduktion:** Starta elevläge, byt till ljust tema, öppna heltalsfråga. I den synliga statistikfrågan mättes Ditt svar, 14px, till rgb(123,139,114) mot vit frågeyta: **3,634:1**. Inmatningskant rgb(215,223,208) mot vit yta: **1,368:1**. Den fungerar visuellt men kanten blir mycket svag. Etiketten är tydligare i mörkt tema enligt faktisk skärmbild, men mörk etikettkontrast mättes inte.

**Säkerhet:** Hög för färger och beräkning; medel för praktisk effekt hos olika användare. Detta är punktmätningar, inget generellt standard- eller överensstämmelseanspråk. Hjälptextens uppmätta kontrast var 5,011:1 och vit text på primärknappen 7,966:1, så fyndet gäller specifika element. **Minsta åtgärd:** Mörkna svarsetiketten och inmatningskanten i ljust tema. Underlag: holistic-c-statistics3.png, mätning i steg35 och holistic-c-contrast.py.

### C3 — P3: Kartans kopplingar tar över i mobil fullskärm

**Reproduktion:** 390×844 → Kunskapsträdet → Fullskärm. Kort staplas i en kolumn och långa gröna kopplingar bildar ett tätt diagonalt knippe längs högerkanten. Text och öppnaknappar fungerade i stickprovet, men linjerna är visuellt nästan lika starka som innehållet.

**Säkerhet:** Hög om observationen, medel om användbarhetseffekten eftersom ingen användarstudie gjorts. **Minsta åtgärd:** Dämpa kopplingarnas vikt/opacity på smal skärm eller visa främst kopplingar för valt kort. Underlag: holistic-c-fullscreen-mobile.png. Detta är ett hierarki- och läsbarhetsfynd, inte ett uppmätt kontrastfel.

### C4 — P3: Nära besläktade frågor kan ge en starkare känsla av bredd än underlaget har

**Reproduktion:** Åk7, alla områden. Första delmomentet gav kvadratens hörn, triangelns sidor, och igenkänning av en triangel. Tre korrekta svar gav Visad i passet / Former & hörn. Rapporten är korrekt enligt sin egen regel.

**Säkerhet:** Hög för frågeserien och regeln; medel för risk för feltolkning. Ingen empirisk validering av metoden har gjorts här. **Minsta åtgärd:** Lägg en kort synlig förklaring nära Visad i passet: ”Tre rätt i dessa uppgifter; följ upp resonemang och andra representationer.” Behåll rapportens tydliga avgränsning och undvik vidare slutsatser om hela geometriområdet. Detta är en metodisk begränsning att kommunicera, inte ett facitfel.

## Styrkor och observerade fungerande flöden

- Elevläget har tydligt större text och bättre hierarki än kartan. Mobilbilden hade fråga, figur, alternativ och svarsknappar inom skärmen i det prövade exemplet.
- Enter skickade numeriska svar. Tab från numeriskt svar nådde Svara, och Enter aktiverade knappen. Ingen tangentbordsfälla på just den prövade vägen.
- Fullskärm fungerade på mobil och desktop. Desktop DOM-kontroll gav document.fullscreenElement=true och 1365px dokumentbredd vid 1365px viewport. Escape återgick från fullskärm.
- Rapporten gav korrekt 6 svar / 2 delmoment respektive 3 svar / 1 delmoment och särskilde 77 respektive 9 ej prövade. Oprövade redovisades inte som fel eller automatiskt godkända.
- Elevens svar och rätt svar redovisas separat; visuella frågor och tabeller sparas i rapporten. Profilnamnet är synligt i elevvy, rapport och fullskärm.
- Metodtexten anger uttryckligen tre rätt och högst ett fel, två fel/överhoppade som uppföljning, begränsat underlag vid för få svar, inga automatiskt godkända förkunskaper och ingen betygs- eller NP-prognos.

## Kodspårning efter UI-intrycket

adaptive.js:25–29 beräknar status per delmoment med right>=3 och wrong<=1, eller uppföljning vid wrong>=2. adaptive.js:64–65 väljer en av tre varianter och återanvänder vid behov en variant. adaptive-ui.js:198 beskriver tolkningen för läsaren. adaptive.js inleds med att urvalet är regelstyrt och inte kalibrerat psykometriskt. Jag gjorde ingen statistisk validering och tolkar inte Visad som behärskning av ett helt område.

Förkunskaps-/kurskopplingar återanvänder grundmoment; bland annat mappas f-shapes till former och f-place till positionssystem i skills-consolidated.js. Det förklarar delvis varför enkla uppgifter kan förekomma i Åk7. Jag har inte bedömt samtliga kurs- eller årskursmappningar.

## Underlag och begränsningar

Faktiskt granskade skärmbilder: holistic-c-start-desktop.png, question-1/2/3.png, mobile-light-question3.png, statistics3.png, report-mobile.png, report-desktop.png, fullscreen-mobile.png och fullscreen-desktop-dark.png. Övriga holistic-c-bilder och numrerade steg-JSON finns kvar som råunderlag. Kontrastberäkningen finns i holistic-c-contrast.py.

Ingen uppgiftsbank i sin helhet, inget helt 30-frågorspass, inga felaktiga eller överhoppade svar, ingen återupptagning efter omladdning, ingen import/export, ingen utskrift/PDF, ingen skärmläsare, ingen riktig mobil/pekfunktion, ingen 200–400-procents zoom, ingen fullständig tabbordningskontroll, inga andra webbläsare och ingen integritets-/säkerhetsgranskning. Elevöversikt och InförNP öppnades inte. Rapportens alla fällbara sektioner granskades inte. Jag gjorde inga anspråk på standarduppfyllelse eller diagnostisk validitet.

Inga misslyckade browserkommandon med felutskrift inträffade. Ett selektorsök gav tom lista eftersom jag antog fel behållar-id; det följande UI-söket rättades och inga appdata lästes för facit före lösning. Steg och råfiler har bevarats. Inga commits.
