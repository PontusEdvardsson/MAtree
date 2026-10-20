# Tre oberoende simulerade elevtester

2026-10-20. Testad version: publicerad MAtree, produktcommit `4070d0c`. Tre separata granskaragenter använde varsin isolerad, fiktiv elevprofil. Inga produktfrågor eller bedömningsregler ändrades.

Resultatmönstret motsvarade de tre förhandsbeskrivna kunskapsmodellerna. Det svaga testets första körning hade dock tekniska fel och måste redovisas separat. Inget konstaterat bedömningsfel i appen framkom i dessa pass.

## Upplägg och förväntningar

Alla testade samma urval: **Sannolikhet, åk 8, bas, högst 60 uppgifter**, elva delmoment. Det gör profilerna jämförbara utan att blanda ihop kunskapsnivå med olika områden. Frågornas tal och alternativ varierade. Agenterna fick ingen projekthistorik, tidigare granskning eller produktkod. Kunskapsmodellerna bestämdes före frågorna. Endast synlig frågetext, alternativ och eventuella bildetiketter fick styra svaren; lagrat facit och intern session lästes först efter avslut.

- **Låg:** gynnsamma/alla vid ett drag, lyckohjul eller tärning; sannolikhet mellan 0 och 1 samt säkert/omöjligt. Övrigt: Jag vet inte, utan gissning. Förväntat: två visade delmoment och nio för uppföljning.
- **Blandad:** de vanliga ingångsrutinerna, kombinationer, ordningar, komplement, förväntat antal, relativ frekvens och oberoende flerstegsförsök. Felidé: påsens innehåll ändras aldrig, även utan återläggning. Alternativa ordningar summeras, men med ursprungsandelarna. Om det beräknade värdet saknas bland alternativen väljs första alternativet enligt förhandsregel. Förväntat: huvuddelen visas, felidén fångas i relevanta draguppgifter.
- **Stark:** samtliga valda grundmetoder, inklusive ändrade antal utan återläggning och summering av alternativa vägar. Förväntat: alla elva visas och passet avslutas före frågegränsen.

Detta är olika modeller av matematikkunskap, inte uppmätta förkunskapsresultat från tidigare kontroller. Externa förkunskaper prövades inte separat här.

## Utfall

| Modell | Svar | Rätt | Fel | Jag vet inte | Visad i passet | Följs upp | Ej prövade |
|---|---:|---:|---:|---:|---:|---:|---:|
| Låg, tekniskt korrigerad omkörning | 24 | 6 | 0 | 18 | 2 | 9 | 0 |
| Blandad | 33 | 29 | 4 | 0 | 9 | 2 | 0 |
| Stark | 33 | 33 | 0 | 0 | 11 | 0 | 0 |

Alla tre avslutades naturligt när hela urvalet var prövat, före gränsen 60. Ingen fick begränsat underlag. För låg och stark verifierades även lagrat avslutsskäl `all-tested` och metadata `selection:'course'`, `catalogue:'assessed'`, `coveragePolicy:'exhaustive'`. För blandad verifierades årskurs, område, gräns och uttömt urval i den synliga slutrapporten; lagringsmetadata exporterades inte.

Tabellen nedan anger rätt/svar. **V** = Visad i passet; **F** = Behöver följas upp.

| Delmoment | Låg | Blandad | Stark |
|---|---:|---:|---:|
| Gynnsamma och möjliga utfall | V 3/3 | V 3/3 | V 3/3 |
| Multiplikationsprincipen | F 0/2 | V 3/3 | V 3/3 |
| Sannolikhet mellan 0 och 1 | V 3/3 | V 3/3 | V 3/3 |
| Förväntat antal utfall | F 0/2 | V 3/3 | V 3/3 |
| Ordna olika föremål | F 0/2 | V 3/3 | V 3/3 |
| Träddiagram: oberoende händelser | F 0/2 | V 3/3 | V 3/3 |
| Addera alternativa vägar | F 0/2 | F 2/4 | V 3/3 |
| Komplementhändelser | F 0/2 | V 3/3 | V 3/3 |
| Träddiagram: utan återläggning | F 0/2 | F 0/2 | V 3/3 |
| Sannolikhet från försök | F 0/2 | V 3/3 | V 3/3 |
| Minst en: komplementmetoden | F 0/2 | V 3/3 | V 3/3 |

Den svaga modellens uteblivna lösningar är alla uttryckliga avståenden; rapporten kan därför motivera uppföljning men inte ett påstående om ett bestämt matematiskt missförstånd.

## Vad testet visar

**Täckningen fungerade.** Den svaga modellen fick fler delar prövade efter misslyckanden. Passet stannade först när alla elva var färdigprövade. Den blandade modellen kunde samtidigt visa andra färdigheter trots sin lokala felidé. Ingen tvingades först klara en grön förkunskapskedja.

**Den blandade kunskapsbilden skildrades lokalt.** Två uppgifter utan återläggning och två av fyra om alternativa vägar blev fel. De nio andra delmomenten visades. En reservgissning användes när felmodellens beräknade värde saknades bland alternativen; det blev ett felsvar. Därför är inte varje enskilt fel ett rent uttryck för felmodellen, men båda berörda delmomenten fick uppföljning.

**Förslagen behöver tolkas försiktigt.** Den blandade modellen fick förslag att undersöka Bråk gånger bråk och Addera bråk: olika nämnare. De låg utanför urvalet och markerades som oprövade. Appen skrev att förslagen inte avgör orsaken. I modellen fanns bråkräkningen redan; svårigheten gällde ändrade sannolikheter. Förslagen är därför möjliga nästa kontroller men identifierar inte den avsedda felidén. Ett mer riktat koncepttest är en rimlig förbättring att pröva.

**Visad gäller det som faktiskt prövats.** Tre rätta rutinsvar stöder den lokala färdigheten. Dessa körningar visar inte att eleven kan förklara, överföra till en ny situation eller behärska ett helt område. Nio visade delmoment ska inte skrivas om till ”förstår sannolikhet”.

## Tekniska avvikelser och begränsningar

Den låga modellens första körning gav 25 svar, 3 rätt, 22 avståenden, noll visade och elva för uppföljning. Verktyget avstod felaktigt från redan kända tärnings- och intervallfrågor och kunde inte skicka fritextsvaret 0. Det mäter alltså inte den avsedda modellen. Hela försöket är bevarat, inte bortsorterat.

En ny isolerad profil användes efter rättning av endast generisk tolkning/inmatning för de redan angivna färdigheterna. Parsern frystes före omkörningen. Första körningens facit hade lästs efter avslut men före omkörningen: den korrigerade körningen är därför **inte helt blind på frågemallsnivå**. Nya tal användes; inga facitlistor ingick i parsern. Resultatet stödjer väntat beteende tekniskt, men är svagare som oberoende blindtest.

I det blandade testet valde hjälpen först ett dolt svarsfält; Svara var inaktiverad och inget svar registrerades. Samma förberäknade svar skickades därefter via synligt alternativ. I det starka testet lades stöd för fritext till före första fritextsvarets inskickning. Ingen av dessa händelser skapade ett registrerat felsvar. De ska rättas i testverktyget, inte i appens bedömningsregler.

Automatisk säkerhetsgranskning avvisade det blandade testets försök att exportera hela profillagret, eftersom fler profiler potentiellt kunde ingå, och en efterföljande strukturkontroll. Underlaget hämtades i stället från enbart den fiktiva testprofilens synliga slutrapport och momentgranskning. Inget profillager exporterades i det testet. Inga verkliga elevprofiler användes.

Tre simuleringar inom ett område är ett begränsat stickprov. Oberoendet avser granskarna och profilerna; alla testade samma app och frågemallar. Detta är ingen studie av verkliga elevers förståelse och ingen uppskattning av falskt godkända resultat.

## Underlag och nästa arbete

Fullständiga synliga frågor, alternativ, beräkningar, skickade svar och rättning efter avslut finns i:

- [Låg, korrigerad](tests/pupil-low-sample.json), [första misslyckade försöket](tests/pupil-low-failed-sample.json) och [fryst korrigerad parser](tests/pupil-low-corrected-frozen.js).
- [Blandad](tests/pupil-mixed-sample.json).
- [Stark](tests/pupil-strong-sample.json).
- [Maskinellt kontrollerad jämförelse](tests/pupil-levels-summary.json).

[Åtgärdsprompten](ATGARDSPROMPT_ELEVTESTER.md) skiljer bekräftade verktygsfel från ett förslag om mer riktade konceptfrågor. Inga trösklar eller produktfrågor ändrades i denna granskning.

Fortsättningen finns nu i [KONTRASTTEST_SANNOLIKHET.md](KONTRASTTEST_SANNOLIKHET.md): adaptertesterna och ett separat tekniskt kontrastprov är genomförda. Produktförslaget är fortfarande inte infört.

`python tests/verify_pupil_levels.py` kontrollerar antal, delmomentsfördelning, rätt/avstående, förväntat mönster och tillgänglig avslutsmetadata mot de sparade försöken och återskapar jämförelsefilen. Kontrollen passerade. Den kör inga nya elevförsök och ersätter inte produktregression; eftersom endast rapporter och testunderlag ändrades kördes ingen ny full produktregression.
