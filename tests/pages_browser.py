"""Check the deployable package under /MAtree/, as on GitHub Pages."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys
import threading

from build_pages import build_site

ROOT = Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding='utf-8')


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


directory = build_site()
handler = partial(QuietHandler, directory=str(directory))
with ThreadingHTTPServer(('127.0.0.1', 0), handler) as server:
    worker = threading.Thread(target=server.serve_forever, daemon=True)
    worker.start()
    try:
        result = subprocess.run([
            sys.executable, str(ROOT / 'tests/ui_preview.py'),
            str(ROOT / 'tests/pages-scenarios.json'),
            f'http://127.0.0.1:{server.server_port}/MAtree/'
        ], cwd=ROOT, creationflags=subprocess.CREATE_NO_WINDOW, capture_output=True, text=True, encoding='utf-8')
        print(result.stdout, end='')
        if result.stderr:
            print(result.stderr, end='')
    finally:
        server.shutdown()
        worker.join(timeout=5)
raise SystemExit(result.returncode)
