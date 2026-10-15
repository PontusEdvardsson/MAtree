"""Package the static app and referenced PDFs, excluding results and test artifacts."""
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / '.verification' / 'github-pages'


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        path = values.get('src') if tag == 'script' else values.get('href') if tag == 'link' and values.get('rel') == 'stylesheet' else None
        if path:
            candidate = Path(path)
            if candidate.is_absolute() or '..' in candidate.parts or ':' in path:
                raise ValueError('Expected project-relative asset: ' + path)
            self.paths.append(path)


def build_site():
    parser = Assets()
    parser.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    files = ['index.html', '.nojekyll', *parser.paths]
    catalog = (ROOT / 'skill-catalog.js').read_text(encoding='utf-8')
    books = re.findall(r"^\s*(?:'[^']+'|\w+): \[(\d), '([^']+\.pdf)'", catalog, re.MULTILINE)
    if not books:
        raise ValueError('No textbook references found.')
    missing = []
    for grade, filename in books:
        path = f'{grade}/Matte Direkt {grade} v3/{filename}'
        if (ROOT / path).is_file():
            files.append(path)
        else:
            missing.append(path)
    files = list(dict.fromkeys(files))
    archive = ROOT / '.verification' / 'matree-github-pages.zip'
    target = OUTPUT / 'MAtree'
    target.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        for path in files:
            source = ROOT / path
            destination = target / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
            package.write(source, path)
    # The zip uses an explicit file list, never previous staging contents.
    print(f'Packaged {len(parser.paths)} app assets and {len(books)-len(missing)} referenced PDFs: {archive.name}')
    if missing:
        print(f'{len(missing)} PDFs are absent; the app works but those book links will not open.')
    return OUTPUT


if __name__ == '__main__':
    build_site()
