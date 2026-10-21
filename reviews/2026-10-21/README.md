# Underlag till helhetsgranskningen

De fem rapporterna [A](A.md), [B](B.md), [C](C.md), [D](D.md) och [E](E.md) är fristående originaltexter från separata instanser. De kopierades efter avslut utan att deras slutsatser redigerades av sammanvägaren. Deras ursprungliga råfilnamn med prefix `holistic-` finns kvar i texten. Kommandon, extra bilder och loggar ligger kvar lokalt under `.verification/`; de är inte alla inkluderade i detta underlag.

[Sammanvägd rapport](../../HELHETSGRANSKNING.md) · [föreslagen fortsättningsprompt](../../FORTSATT_HELHETSGRANSKNING_PROMPT.md) · [manifest](manifest.json).

Utvalda bestående bilder:

| Här | Ursprungligt filnamn | Visar |
|---|---|---|
| [Startvy](start-desktop.png) | holistic-b-initial.png | Tom profil, desktop |
| [Elevvy](student-desktop.png) | holistic-b-dots.png | Prickfrågan vars tillgängliga namn gav totalen |
| [Ljus mobilöversikt](progress-mobile-light.png) | holistic-b-mobile-light.png | Sekundär text och metodhjälp |
| [Mobil fullskärmskarta](tree-fullscreen-mobile.png) | holistic-c-fullscreen-mobile.png | Kort och kopplingslinjer |
| [Grupperat tal avvisat](integer-spaces-rejected.png) | holistic-d-integer-spaces.png | Talformat och felmeddelande |
| [Manuellt resultat](manual-result-next.png) | holistic-d-manual-result.png | Nästa steg utan målnamn på knappen |
| [NP på mobil](np-mobile.png) | holistic-e-np-mobile.png | Räknare före sidans utförligare avgränsning |

Sammanvägarens tekniska kontroller är [publik filjämförelse](public-version.json), [kursurval](catalog-scope.json), [slutliga bråkförklaringar](fraction-explanations.json), [svarstolk](number-parser.json) och [ljusa](contrast-light.json)/[mörka](contrast-dark.json) kontrastpunktprov. [Kontrastproben](contrast-probe.js) förklarar beräkningen och dess begränsningar. Inget av dessa är ett ytterligare oberoende elevtest.

[A:s strukturerade fynd](A-findings.json) och [det stoppade inmatningsförsöket](reviewer-a-blocked-attempt.txt) bevaras också. I B:s rapport undantas ett försök från helt blind jämförelse. Detta material är avsiktligt bevarat, inte bortsorterat för att ge ett mer gynnsamt resultat.
