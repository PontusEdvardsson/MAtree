# Tre förbättringsomgångar med oinsatta granskare · 2026-10-20

Varje omgång använder två nya granskaragenter med tomma kontexter och isolerade webbläsarprofiler. Den ena provar ett lärarflöde, den andra ett elevflöde. De får uppgifter och den publicerade länken, men inte produktkod, tidigare rapporter eller anvisningar om knappar. Inga verkliga elevdata används. Ändringar görs mellan omgångarna och publiceras före nästa teststart.

Detta är simulerade användartester, inte observationer av faktiska lärare och elever. Mobilformat provas i Chrome, utan fysisk touch eller skärmtangentbord. Förslagens nytta bedöms genom följande omgångs konkreta handlingar, inte genom att granskarna tillfrågas om våra ändringar.

## Omgång 1

Granskad version: `54fe99f`. Läraren hittade åk 8 och bråk och löste den visade frågan 3/6 + 1/8 = 5/8. Elevgranskaren löste fyra frågor och använde Jag vet inte på en femte. De synliga facitjämförelserna stämde. Paus behöll markerat svar.

**Observationer:** Läraren behövde en omväg för att läsa ett inskickat svar i en pausad kontroll. Eleven behövde flera utfällningar för att hitta facit och fick en avslutsorsak som felaktigt tillskrev handlingen läraren. Läraren uppfattade det allmänna förslaget på nästa kontroll som svagt kopplat till det prövade momentet. Mobilens stora kontrollpanel begränsade kartöverblicken.

**Ändringar, publicerade i `61388aa`:**

- Avslut ger en kvarliggande bekräftelse med antal sparade svar och direktlänk till den rätta manuella kontrollen eller det automatiska passet.
- Den manuella återkopplingen visar det faktiskt inskickade elevsvaret, även när samma pausade kontroll återupptas.
- Rapportens ingång heter Frågor, elevsvar och facit. Avslutsorsaken säger manuellt i stället för att tillskriva handlingen en viss person.
- En generell startrekommendation beskrivs uttryckligen som allmän och som något annat än en slutsats från det senaste svaret.

**Verifiering:** Full regression samt riktade kontroller av avslut, direktlänk till exakt historik, automatisk rapport, tidiga delresultat och import. Den sista ändringen av elevsvarsraden verifierades med riktat UI-test. Frågebank och bedömningsregler ändrades inte.

En elevbild visade klippta bokstäver i en lång mobilrubrik. Samma rubrik kunde visas fullständigt i en separat reproduktion med 390 px bredd, utan överflöde eller horisontell rullning. Observationen är inte fastställd som ett reproducerbart produktfel och redovisas separat.

## Omgång 2

Granskad version: `61388aa`. Läraren löste 4/6 + 4/8 = 7/6 och kunde nu läsa samma inskickade svar direkt efter paus. Sparad kontroll med rätt nämnare, facit och vald förkunskap gick att återfinna. Den allmänna startpunkten uppfattades som tydligt märkt. Eleven provade fyra figurfrågor, inklusive ett avsiktligt Jag vet inte; de tre inskickade lösningarna och det överhoppade svaret återgavs korrekt.

**Observationer:** Den nya bekräftelsen och länken hittades, men knappen öppnade först en sammanställning i stället för själva svaren. Bekräftelsen följde dessutom med genom flera vyer och täckte mobilkartan. Start och paus talade fortfarande till läraren. En figurförklaring sade bara att figurens egenskaper skulle användas.

**Ändringar, publicerade i `00d454c`:**

- Kortare start med årskurs, område och omfattning först. Regler och extra inställningar är utfällbara. Startknappen syns utan scrollning i normalt kortläge vid 320 × 740.
- Direkt tilltal och Fortsätt kontrollen i pausvyn. Den pågående frågan visar uppgiftstaket.
- Visa svar och facit öppnar frågloggen och första sparade svaret direkt, både manuellt och automatiskt.
- Bekräftelsen stängs när man går vidare, så att den inte följer med och skymmer senare vyer.
- Figurförklaringar anger konkreta hörn, sidor och räta vinklar. Facit, figurer och alternativ behåller samma betydelse; äldre sparade frågor skrivs inte om.
- Mobilens fullskärm börjar med filterpanelen infälld. Visa filter öppnar samma val med bevarat urval. Vid 390 × 844 ökade själva kartytan från ungefär 440 till ungefär 640 px.

**Verifiering:** Full regression passerade efter slutliga produktändringar. Riktade mus- och tangentbordstester täcker direktöppnade svar, statusnotisens försvinnande, start på 320 px, uppgiftstak, paus, import/export, fullskärm och öppning av de infällda filtren. Fullskärm testades också på den publicerade sidan.

## Omgång 3

Granskad version: `00d454c`. Två ytterligare oinsatta granskare breddade stickprovet till geometri i åk 8 och tal i åk 9.

Lärargranskaren valde Cirkelns area och räknade själv ut 706,5 cm² vid radie 15 cm och 530,66 cm² vid diameter 26 cm, med π = 3,14. Både flervalsvalet och det skrivna svaret bevarades efter paus. Tidigt avslut gav två sparade svar och Begränsat underlag. Knappen Visa svar och facit ledde till rätt kontroll. Förkunskapen om radie och diameter kunde öppnas via motiveringen att diametern halveras före πr²; den förblev oprövad. Mobil fullskärm och momentdialog fungerade vid 390 × 844.

Elevgranskaren startade Tal i åk 9, gav fyra korrekta svar om stora tal och potenser samt valde Jag vet inte på en femte fråga. Facit och de fem sparade svaren stämde med det faktiskt inskickade. Ett markerat flerval behölls genom uttrycklig paus. Avslut på obesvarad fråga 6 sparade exakt de fem tidigare svaren. Jag vet inte visades som Överhoppad och avslutet som manuellt.

**Observationer:** Inga blockerande fel hittades i dessa två flöden. Läraren gjorde fortfarande en liten omväg vid första återöppningen av den pausade kontrollen och behövde själv välja den ämnesrelevanta förkunskapen i stället för översiktens uttryckligen allmänna startförslag. Eleven såg språkfelet ”1 miljoner”.

**Slutlig ändring:** Nya frågor använder ”1 miljon” respektive ”1 miljard” och plural vid större antal. Beräkningar, facit och tidigare sparade frågor ändras inte.

**Verifiering:** Full regression passerade även efter språkändringen, inklusive oberoende beräkningar av frågesvar, grafens 489 kopplingar, årskursurval, avslut, paus, historik och export/import.

## Bedömning och fortsatt prövning

Tre omgångar med sammanlagt sex nya granskaragenter är genomförda. Återkommande hinder kring start, sparade svar, facit och mobilens kartutrymme har lett till ändringar och prövats igen av nästa oinsatta granskare. Inget matematiskt facitfel bekräftades i de visade frågorna. Stickproven innebär inte att hela frågebanken eller de pedagogiska beroendena är validerade.

En kvarstående möjlighet är att göra vägen från begränsat underlag till en ämnesrelevant nästa kontroll lättare att upptäcka. Nu går den via det senaste momentets förkunskaper; översiktens allmänna startförslag är tydligt märkt men ersätter inte lärarens val. Den enstaka observationen om klippt mobilrubrik bör också följas upp om den återkommer.

Nästa användbarhetsprövning bör göras med faktiska lärare och elever, på deras egna enheter. Särskilt värdefullt är att observera vad de förväntar sig efter paus och tidigt avslut, hur de hittar nästa kontroll och hur de tolkar skillnaden mellan begränsat underlag och visad kunskap.
