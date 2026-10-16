import base64
import json
import os
from pathlib import Path
import socket
import struct
import subprocess
import time
import urllib.request
import uuid
import sys

sys.stdout.reconfigure(encoding='utf-8')

root = Path(__file__).resolve().parent.parent
directory = root / '.verification'
directory.mkdir(exist_ok=True)
html = (root / 'index.html').read_text(encoding='utf-8')
for filename in ['theme.js', 'theme.css', 'styles.css', 'curriculum.js', 'skill-catalog.js', 'questions-expanded.js', 'foundations.js', 'skills-consolidated.js', 'skill-groups.js', 'questions-reviewed.js', 'questions-reviewed-foundations.js', 'questions-reviewed-course.js', 'questions-reviewed-extra.js', 'questions-reviewed-highschool.js', 'questions-reviewed-geometry.js', 'questions-reviewed-relations.js', 'questions-reviewed-statistics.js', 'questions-reviewed-problems.js', 'questions-mixed.js', 'question-media.js', 'adaptive.js', 'app.js', 'adaptive-ui.js']:
    html = html.replace(f'"{filename}"', f'"../{filename}"')
html = html.replace('</head>', '<script src="../tests/math-tests.js" defer></script><script src="../tests/highschool-tests.js" defer></script><script src="../tests/reviewed-tests.js" defer></script><script src="../tests/mixed-tests.js" defer></script><script src="../tests/question-quality-tests.js" defer></script><script src="../tests/adaptive-tests.js" defer></script><script src="../tests/group-tests.js" defer></script><script src="../tests/improvements-tests.js" defer></script><script src="../tests/continuity-tests.js" defer></script><script src="../tests/theme-tests.js" defer></script><script src="../tests/browser-tests.js" defer></script></head>')
(directory / 'test.html').write_text(html, encoding='utf-8')
profile_dir = directory / ('cdp-' + uuid.uuid4().hex[:8])
port = 9237
log = (directory / 'browser.log').open('w', encoding='utf-8')
process = subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe', '--headless', '--disable-gpu', '--no-first-run', '--disable-extensions', '--disable-background-networking', f'--remote-debugging-port={port}', '--remote-allow-origins=*', f'--user-data-dir={profile_dir}', '--allow-file-access-from-files', 'about:blank'], stdout=log, stderr=log, creationflags=subprocess.CREATE_NO_WINDOW)

class CDP:
    def __init__(self, url):
        address = urllib.parse.urlparse(url)
        self.socket = socket.create_connection((address.hostname, address.port), timeout=30)
        nonce = base64.b64encode(os.urandom(16)).decode()
        self.socket.sendall(f'GET {address.path} HTTP/1.1\r\nHost: {address.netloc}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {nonce}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
        header = b''
        while b'\r\n\r\n' not in header: header += self.socket.recv(1)
        if b'101' not in header: raise RuntimeError(header)
        self.sequence = 0
        self.pending = {}
        self.on_event = None
    def read(self, n):
        data = b''
        while len(data) < n:
            packet = self.socket.recv(n - len(data))
            if not packet: raise ConnectionError('Websocket closed')
            data += packet
        return data
    def call(self, method, params=None):
        self.sequence += 1
        command_id = self.sequence
        raw = json.dumps({'id': self.sequence, 'method': method, 'params': params or {}}).encode()
        mask = os.urandom(4)
        size = len(raw)
        header = bytes([129, 128 | size]) if size < 126 else bytes([129, 254]) + struct.pack('!H', size) if size < 65536 else bytes([129, 255]) + struct.pack('!Q', size)
        self.socket.sendall(header + mask + bytes(value ^ mask[i % 4] for i, value in enumerate(raw)))
        while True:
            if command_id in self.pending:
                return self.pending.pop(command_id)
            first, second = self.read(2)
            size = second & 127
            if size == 126: size = struct.unpack('!H', self.read(2))[0]
            elif size == 127: size = struct.unpack('!Q', self.read(8))[0]
            payload = self.read(size)
            message = json.loads(payload)
            if message.get('id') == command_id: return message
            if 'id' in message:
                self.pending[message['id']] = message
            elif self.on_event:
                self.on_event(message)

try:
    page = None
    for i in range(80):
        try:
            pages = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json', timeout=.5))
            page = next((p for p in pages if p['type'] == 'page'), None)
            if page: break
        except Exception: pass
        time.sleep(.25)
    if not page: raise RuntimeError('No debugging page. ' + (directory / 'browser.log').read_text(encoding='utf-8')[-2500:])
    browser = CDP(page['webSocketDebuggerUrl'])
    browser.call('Page.setDownloadBehavior', {'behavior': 'deny'})
    browser.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
    browser.call('Page.navigate', {'url': (directory / 'test.html').as_uri()})
    report = ''
    for i in range(100):
        response = browser.call('Runtime.evaluate', {'expression': 'document.getElementById("test-report")?.textContent || ""', 'returnByValue': True})
        report = response.get('result', {}).get('result', {}).get('value', '')
        if report.startswith(('PASS', 'FAIL')): break
        time.sleep(.1)
    print(report or 'No test report: ' + json.dumps(browser.call('Runtime.evaluate', {'expression': 'document.body.innerText', 'returnByValue': True})))
    (directory / 'test-results.txt').write_text(report, encoding='utf-8')
    browser.call('Page.navigate', {'url': (root / 'index.html').as_uri()})
    time.sleep(1)
    catalog = browser.call('Runtime.evaluate', {'expression':'JSON.stringify(MATREE.nodes)', 'returnByValue':True})
    (directory / 'skill-catalog.json').write_text(catalog['result']['result']['value'], encoding='utf-8')
    for width in [1440, 390]:
        browser.call('Emulation.setDeviceMetricsOverride', {'width': width, 'height': 1000 if width == 1440 else 844, 'deviceScaleFactor': 1, 'mobile': width == 390})
        screenshot = browser.call('Page.captureScreenshot', {'format': 'png'})
        (directory / f'preview-{width}.png').write_bytes(base64.b64decode(screenshot['result']['data']))
        result = browser.call('Runtime.evaluate', {'expression': 'JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,nodes:document.querySelectorAll(".skill-node").length})', 'returnByValue': True})
        print('Layout', result['result']['result'].get('value'))
    browser.call('Emulation.setDeviceMetricsOverride', {'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
    browser.call('Runtime.evaluate', {'expression':'document.querySelector("#skill-map").scrollIntoView({block:"start"})'})
    screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
    (directory/'preview-groups.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Runtime.evaluate', {'expression':'MATREE_APP.openGroup("right-triangles")'})
    for group_width in [1440,390]:
        browser.call('Emulation.setDeviceMetricsOverride', {'width':group_width,'height':1000 if group_width==1440 else 844,'deviceScaleFactor':1,'mobile':group_width==390})
        screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
        (directory/f'preview-group-dialog-{group_width}.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Runtime.evaluate', {'expression':'document.querySelector("#skill-dialog").close(); scrollTo(0,0)'})
    browser.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
    for mode, expression in [
        ('np', 'document.querySelector(\'[data-view="np"]\').click()'),
        ('focus', 'document.querySelector(\'[data-view="tree"]\').click(); MATREE_APP.openSkill(\'brak-add-olika\'); document.querySelector(\'[data-focus="brak-add-olika"]\').click()')
    ]:
        browser.call('Runtime.evaluate', {'expression':expression})
        screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
        (directory/f'preview-{mode}.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Runtime.evaluate', {'expression': 'document.querySelector(\'[data-stage="7"]\').click()'})
    screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
    (directory/'preview-year7.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Runtime.evaluate', {'expression': 'document.querySelector(\'[data-stage="0"]\').click(); document.querySelector(\'[data-foundation="1"]\').click()'})
    screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
    (directory/'preview-foundations.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    for mode, expression in [
        ('adaptive-setup', 'document.querySelector("#adaptive-open").click()'),
        ('adaptive-student', 'document.querySelector("#adaptive-setup").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}))')
    ]:
        browser.call('Runtime.evaluate', {'expression':expression})
        screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
        (directory/f'preview-{mode}.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Emulation.setDeviceMetricsOverride', {'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
    screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
    (directory/'preview-adaptive-mobile.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    browser.call('Emulation.setDeviceMetricsOverride', {'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
    browser.call('Runtime.evaluate', {'expression':'for(let i=0;i<30;i++){const q=MATREE_APP.profile().adaptive.active?.pending;if(!q)break;document.querySelector("#adaptive-answer").value=String(q.answer);document.querySelector("#adaptive-answer-form").dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));} document.querySelector("#adaptive-teacher-report").click()'})
    screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
    (directory/'preview-adaptive-report.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    for mode, skill in [('bars','stapel-stolp'),('fraction','f-half'),('coordinate','f-coordinate'),('lines','rita-linje'),('signed-coordinate','koordinater'),('histogram','histogram'),('boxplot','ladagram'),('venn','venndiagram'),('tree','trad-beroende'),('triangle','pythagoras-hyp')]:
        browser.call('Runtime.evaluate', {'expression': f'document.querySelector("#adaptive-dialog").close(); document.querySelector("#skill-dialog").close(); MATREE_APP.profile().quiz=null; MATREE_APP.openSkill("{skill}"); document.querySelector("[data-start={skill}]").click()'})
        screenshot=browser.call('Page.captureScreenshot', {'format':'png'})
        (directory/f'preview-question-{mode}.png').write_bytes(base64.b64decode(screenshot['result']['data']))
    audit=browser.call('Runtime.evaluate', {'expression':'JSON.stringify({skills:[...MATREE.reviewedTargetIds],visibleSkills:MATREE.visibleNodes.map(n=>n.id),detailSkills:MATREE.detailNodes.map(n=>n.id),groups:MATREE.skillGroups,projection:MATREE.projectMap(MATREE.detailNodes),aliases:MATREE.skillAliases,responseCounts:MATREE.responseCounts,templates:Object.keys(MATREE.reviewedBank).length*3,samples:Object.keys(MATREE.reviewedBank).map(id=>({id,questions:[0,1,2].map(v=>MATREE.generate(id,v))}))})','returnByValue':True})
    (directory/'question-audit.json').write_text(audit['result']['result']['value'],encoding='utf-8')
    browser.call('Browser.close')
    raise SystemExit(0 if report.startswith('PASS') else 1)
finally:
    if process.poll() is None: process.terminate()
    log.close()
