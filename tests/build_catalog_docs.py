"""Rebuild the readable catalog from the isolated browser audit."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
nodes = json.loads((root / '.verification/skill-catalog.json').read_text(encoding='utf-8'))
audit = json.loads((root / '.verification/question-audit.json').read_text(encoding='utf-8'))
by_id = {n['id']: n for n in nodes}
details = [by_id[i] for i in audit['detailSkills']]
groups = audit['groups']
controls = [by_id[i] for g in groups for i in g['controls']]
categories = [
    ('tal', 'Tal & räkning'), ('brak', 'Bråk & andelar'), ('algebra', 'Algebra'),
    ('geometri', 'Geometri & mätning'), ('samband', 'Samband & funktioner'),
    ('procent', 'Procent'), ('statistik', 'Statistik'), ('sannolikhet', 'Sannolikhet'),
    ('problem', 'Problemlösning & verktyg'),
]

def year(value):
    return 'Åk ' + value.replace('-', '–')

def source(s):
    if s.get('kind') == 'curriculum':
        return 'Lgr22 · ' + s['chapter']
    return f"MD {s['grade']} · {s['chapter']} · s. {s['printed']} (PDF {s['page']})"

def references(n):
    refs = [source(n['source'])]
    for s in [*n.get('mergedSources', []), *([n['npSource']] if n.get('npSource') else [])]:
        value = source(s)
        if value not in refs:
            refs.append(value)
    return '; '.join(refs)

def skill(n):
    return f"{n['title']} ({n['id']})"

def row(n):
    learned = ('Grunder ' + n['learnedAt'].replace('-', '–')) if n['grade'] == 0 else year(n['learnedAt'])
    deps = '; '.join(skill(by_id[i]) for i in n['deps']) or '—'
    level = 'Bas' if n['level'] == 'core' else 'Fördjupning'
    values = [skill(n), learned, ', '.join(map(year, n['yearViews'])), level, deps, references(n)]
    return '| ' + ' | '.join(v.replace('|', '/') for v in values) + ' |'

foundation = [n for n in details if n['grade'] == 0]
lines = [
    '# Kunskapskarta · tidigare grunder och Matte Direkt 7–9', '',
    f"{len(details)} delmoment · {sum(len(n['deps']) for n in details)} riktade förkunskapskopplingar · nio områden.", '',
    f"Översiktsvyn samlar dem i {len(groups)} öppningsbara grupper och sex fristående delmoment: {len(audit['projection']['entries'])} kort när alla år visas. Grupper är en vy över färdigheterna; resultat hör fortfarande till varje delmoment. Elva blandade kontroller och alla {len(audit['aliases'])} tidigare ID:n för sammanslagna färdigheter finns kvar med sina frågor och resultat.", '',
    f"Grunder omfattar {len(foundation)} delmoment efter första inlärning: {sum(n['foundationBand']==1 for n in foundation)} inom åk 1–3 och {sum(n['foundationBand']==2 for n in foundation)} inom åk 4–6. Vissa delmoment återkommer i båda urvalen. Stadieindelning och beroenden är pedagogiska förslag, inte en officiell checklista eller betygsgräns.", '',
    'Varje färdighet har ett gemensamt elevresultat i alla sina årskursvyer. ”Lärs in” visar föreslagen första inlärning och ”Visas i” visar årskursurvalen. Bokhänvisningen kan gälla repetition i en senare årskurs.', '',
    '## Grupper och separat underlag', '',
    'Öppna en grupp för att välja delmoment. Gruppens räknare gäller delmoment som ingår i aktuellt urval; övriga ligger i en separat utfällbar lista. En grupp får markeringen visad kunskap först när alla delmoment i urvalet har direkt visad kunskap. Välj ”Visa delmoment i kartan” för en grupp eller ”Alla delmoment” för hela kartan. Sökning och förkunskapsfokus visar enskilda färdigheter.', '',
    'Gruppöversikten använder ett kompakt rutnät anpassat efter fönstrets bredd. Kopplingar visas när ett kort pekas ut eller fokuseras med tangentbordet. ”Visa alla kopplingar” visar samtliga pilar i urvalet. Detaljvyn behåller progressionens kolumner, rullning och zoom.', '',
    'Alla förkunskapskopplingar behålls. Pilar mellan grupper sammanfattar kopplingar mellan deras delmoment. Om en gruppering skulle ge ett cirkulärt beroende öppnas berörd grupp i delmoment i stället. Kopplingar inom en grupp framgår när delmomenten öppnas.', '',
    'Att beräkna värdet av ett uttryck är ett eget delmoment. Att lösa en ekvation, förstå en variabel och förenkla ett uttryck visar andra saker. På samma sätt behåller Pythagoras hypotenusa, katet och kontroll av rät vinkel separata frågor och resultat, liksom olika riktningar av skala och olika procentberäkningar.', '',
    'Blandade kontroller kan öppnas i sin grupp. De godkänner inte delmomenten automatiskt och ingår inte i kartans eller NP-vyns delmomentsräknare. Äldre pausade pass kan återupptas med sina sparade frågor. Sammanslagningar gäller överlappande kontroller av samma färdighet; det senaste direkta resultatet gäller den gemensamma färdigheten.', '',
    '## Hänvisningar', '',
    'Bokreferenser anger tryckt sida och PDF-sida i de lokala Matte Direkt-böckerna, v3. Grundmoment hänvisar till Lgr22:s centrala innehåll som områdesunderlag. Delmoment, frågor och beroenden är egna pedagogiska förslag. Genrepet-hänvisningar finns kvar som bokreferenser och bildar inget separat urval.', '',
    'Automatiskt elevläge väljer delmoment ur basen. Direkt visad kunskap, begränsat underlag och lärarbekräftad indirekt metod hålls isär. Ett senare godkänt moment godkänner inte tidigare noder. Se [README.md](README.md) för regler och begränsningar.', '',
    '## Täckning', '',
    '| Område | Delmoment | Grupper | Grunder efter första inlärning | Bas | Fördjupning |',
    '|---|---:|---:|---:|---:|---:|',
]
for cat, name in categories:
    ns = [n for n in details if n['category'] == cat]
    lines.append(f"| {name} | {len(ns)} | {sum(g['category']==cat for g in groups)} | {sum(n['grade']==0 for n in ns)} | {sum(n['level']=='core' for n in ns)} | {sum(n['level']=='extension' for n in ns)} |")

header = ['| Färdighet och ID | Lärs in | Visas i | Urval | Direkta förkunskaper | Hänvisning |', '|---|---|---|---|---|---|']
for cat, name in categories:
    lines.extend(['', '## ' + name, ''])
    for g in (g for g in groups if g['category'] == cat):
        lines.extend(['### ' + g['title'], '', *header])
        lines.extend(row(by_id[i]) for i in g['members'])
        if g['controls']:
            lines.extend(['', 'Blandade kontroller i gruppen: ' + '; '.join(skill(by_id[i]) for i in g['controls']) + '.'])
        lines.append('')
    grouped = {i for g in groups for i in g['members']}
    standalone = [n for n in details if n['category'] == cat and n['id'] not in grouped]
    if standalone:
        lines.extend(['### Fristående delmoment', '', *header, *(row(n) for n in standalone)])

lines.extend(['', '## Bevarade blandade kontroller', '', 'Dessa frågor och historiker finns kvar utanför delmomentsräknaren.', '', *header, *(row(n) for n in controls), '', '## Äldre ID:n för samma färdighet', '', 'Inga frågor eller elevhistoriker raderas. De äldre ID:na finns kvar för import och pausade omgångar. Nya direkta resultat på någon av samma färdighets ID:n visas gemensamt.', '', '| Tidigare ID och namn | Gemensamt delmoment |', '|---|---|'])
for old, new in audit['aliases'].items():
    lines.append(f"| {skill(by_id[old])} | {skill(by_id[new])} |")
lines.append('')
(root / 'KUNSKAPSKARTA.md').write_text('\n'.join(lines), encoding='utf-8')
print(f"Built KUNSKAPSKARTA.md: {len(details)} details, {len(groups)} groups, {len(controls)} mixed checks, {len(audit['aliases'])} older IDs.")
