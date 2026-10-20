# Tre nya granskningsomgångar med bredare uppgifter · 2026-10-20

Uppföljning till [de första tre omgångarna](ANVANDARTEST_TRE_OMGANGAR.md). Varje omgång använder en ny lärargranskare och en ny elevgranskare utan projekthistorik, produktkod eller tidigare rapporter. De använder isolerade Chrome-profiler och den publicerade webbplatsen. Frågorna löses före facitjämförelsen. Granskarna får arbetsuppgifter men ingen genomgång av gränssnittet.

Detta är simulerade användargranskningar, inte observationer av faktiska elever eller lärare. Mobilformat emuleras utan fysisk touch eller skärmtangentbord. Avsiktliga felsvar anges separat från egna lösningsförsök.

## Omgång 1: elevprofiler, procent och algebra

Granskad version: `ca021f8`. Lärargranskaren skapade Nora och Omar, genomförde en procentkontroll för Nora, bytte elev och återfann sedan Noras exakta historik. Omar förblev oprövad. Sökningen Procent betyder hundradelar hittade rätt moment. Egna lösningar var 50 % = 0,5, 0,5 = 50 % och 1/5 = 20 %. Det avsiktliga felsvaret 25 % sparades som fel med facit 50 %.

Elevgranskaren löste fyra ekvationer: 8x + 4 = 6x + 24 (x = 10), 5x + 4 = 2x + 22 (x = 6), 6x + 3 = 5x + 11 (x = 8, avsiktligt svar 9) och 5x + 4 = x − 16 (x = −5). Tomt svar och texten hej avvisades utan att räknas som inskickade svar. Escape på obesvarad fråga 5 avslutade kontrollen och sparade exakt de fyra svaren. Historikens frågor, svar och facit stämde.

**Fynd och ändringar:**

- Samma uppföljningsstatus hade två namn. Trädkort och teckenförklaring använder nu Behöver följas upp, liksom resultatdialogen.
- Knappen Manuell kontroll öppnade oväntat ett föreslaget moment. Den heter nu Öppna föreslaget moment och behåller samma handling; en uttryckligen pausad kontroll har fortsatt Fortsätt kontroll.
- Normal svarshjälp och valideringsfel angav olika format. Numeriska felmeddelanden återanvänder nu frågans svarshjälp. Särskild decimal- och flervalshjälp kvarstår.
- Elevöversiktens tomma manuella historik uppmanade till att börja samla underlag trots ett sparat automatiskt pass. Rubrik och tomtext anger nu att listan gäller manuella kontroller och hänvisar till automatiska sammanställningar ovan.
- Facit till ekvationer med x i båda leden gav bara ett generellt råd. Nya frågor visar nu konkreta mellanled med frågans egna koefficienter. Facit och tidigare sparade frågeobjekt ändras inte.

Escape som avslut upplevdes överraskande av elevgranskaren. Beteendet behålls enligt produktbeslutet att lämna alltid avslutar om paus inte uttryckligen väljs. Inskickade svar sparas och avslutsbekräftelsen ger en direkt väg till facit. Inget bekräftat matematiskt fel eller sammanblandade elevresultat hittades i stickprovet.

Ändringarna publicerades i `d16d616` före omgång 2. Full regression och riktade mobil- och desktopklick passerade. Den generiska browserhjälparen utökades med verkliga redigeringstangenter samt filhämtning/uppladdning så att nästa omgång kan prova export/import genom gränssnittet.

## Omgång 2: säkerhetskopiering, statistik och sannolikhet

Granskad version: `d16d616`. Lärargranskaren valde Stapel- och stolpdiagram i åk 7 och räknade själv ut 3 personer i stapel A respektive största värdet 7 i ett annat diagram. Båda svaren stämde med facit. Tidigt avslut sparade två frågor som Begränsat underlag. Ett markerat alternativ behölls efter uttrycklig paus, omladdning och återupptagning.

En faktisk säkerhetskopia exporterades genom profilknappen och samma fil importerades via filväljaren. Gränssnittet bekräftade att två profiler importerats och att befintliga profiler fanns kvar. Den fiktiva elevens importkopia innehöll samma två frågor, elevsvar och facit, inklusive diagrammens värden. Originalets historik kontrollerades också efter import och hade kvar samma två svar och Begränsat underlag.

Elevgranskaren valde Sannolikhet i åk 8 och räknade själv ut 3/4 för röda kulor, 1/8 för ett lyckohjul, 2/3 för tärningsutfall mindre än 5 och 1/4 för ett annat lyckohjul. Ett inskrivet 2/3 accepterades. Efter egna uträkningar lämnades avsiktligt Jag vet inte på 1/8-frågan och 1/2 på 1/4-frågan. Alla fyra sparade frågor och facit stämde. Överhoppade visade exakt den andra frågan, Felsvar exakt den fjärde, och Alla återställde alla fyra. Rotation från 768 × 1024 till 1024 × 768 och byte från mörkt till ljust tema behöll både fråga och valt alternativ.

**Fynd och ändringar:** Inga funktionsfel bekräftades i elevflödet. Rapportens ”1 överhoppade” ändras till ”1 överhoppat svar”, med plural vid flera. Browserhjälparens downloadregel behövde sättas vid varje ny CDP-anslutning för att fånga en faktisk exportfil; detta var ett verktygsfel, inte ett bekräftat fel i MAtrees export.

Ändringarna finns i `b67262b`. Full regression passerade. Det separata export/import-provet bekräftar faktiskt filflöde och synligt återställt underlag; det ersätter inte prov på en annan fysisk dator.

## Omgång 3: urval, förkunskapskedjor och tidigare grunder

Granskad version: `b67262b`. Elevgranskaren valde Åk 4–6 och Samband & funktioner, med fyra delmoment i urvalet. Fyra koordinatfrågor löstes före facit: x-koordinaten för A = (1, 1), y-koordinaten för A = (4, 3), samt punkterna (3, 4) och (6, 3) utifrån steg från origo. Tre korrekta svar skickades och (3, 4)-frågan hoppades avsiktligt över med Jag vet inte. Alla egna lösningar stämde med sparade facit.

Första frågans diagram och svarsknappar var läsbara även vid 320 × 740 utan horisontell överbredd. Enter skickade fritextsvaret en gång. Avslut på den obesvarade femte frågan sparade exakt de fyra koordinatfrågorna. Rapporten visade 3/4 rätt och den uppdaterade texten 1 överhoppat svar. Inget säkert funktionsfel hittades i detta flöde.

Lärargranskaren gick Inför NP → bas → fördjupning → Samband & funktioner åk 9 → Ekvationssystem: substitution. NP-vyn skiljde tydligt 225 basmoment från de röda fördjupningarna och beskrev Genrepet som bokreferens, inte en provprognos. Bokhänvisningen till Styva linan och reservationerna för pedagogiskt föreslagna beroenden gick att hitta. Substitutionens koppling till grafisk jämförelse var märkt Samband att granska, och kopplingen till additionsmetoden sade att substitution inte är ett krav.

Hela förkunskapskedjan öppnades med 37 förkunskaper plus valt moment och direkt nästa steg, totalt 39 delmoment. Tillbaka till urvalet återställde samma årskurs, område och fördjupning. Fullskärm och Escape fungerade när ingen kontroll pågick.

Två egna substitutionslösningar jämfördes med facit: y = 5x + 13 och x + y = −5 gav x = −3; y = 5x + 21 och x + y = 3 gav y = 6. Tidigt avslut gav 2/2 rätt men Begränsat underlag, inte visad kunskap. Förkunskaperna förblev oprövade. NP-basens räknare förblev 0/225 och den röda fördjupningen ingick bara i det globala underlaget.

**Fynd och ändring:** Knappen för hela kedjan angav 37 noder, vilket först kunde jämföras med fokusvyns totalt 39 delmoment. Knappen anger nu 37 förkunskaper, samma benämning som i fokusvyn. Antal, graf och urval ändras inte. Inga blockerande fel eller felaktiga facit bekräftades i omgången.

## Verifiering och begränsningar

Samtliga tre nya omgångar med sex nya oinsatta granskaragenter är genomförda. De omfattar 19 egna lösningsförsök före facit, med avsiktliga felsvar och Jag vet inte redovisade separat. Områdena skiljer sig från de föregående omgångarnas tal, bråk och cirkelarea: procent, algebra, statistik, sannolikhet, koordinater i tidigare grunder och fördjupning med ekvationssystem.

Full regression passerade efter produktändringarna. På den publicerade sidan verifierades också alla 24 appresurser, 21 bok-PDF-länkar, beständig profil och pausat utkast, export/import samt hela Testa alla-urvalet för Tal åk 7. Det testets äldre förväntning Tal & räkning uppdaterades till det beslutade områdesnamnet Tal; ingen produktdefekt låg bakom den testavvikelsen.

Inga bekräftade matematiska facitfel eller förlorade svar hittades i dessa stickprov. Det validerar inte hela frågebanken eller beroendegrafens pedagogik. Säkerhetskopiering provades i samma isolerade webbläsare, inte mellan fysiska datorer. Verklig touch, skärmtangentbord, skärmläsare och faktiska användares förståelse ingår inte. Fortsatt mänsklig prövning bör särskilt följa tolkningen av tidigt avslut, vägen till nästa relevanta kontroll och skillnaden mellan begränsat underlag och visad kunskap.
