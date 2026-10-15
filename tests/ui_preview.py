"""Render and interact with the local app in an isolated Chrome profile."""
import ast
import base64
import json
import os
from pathlib import Path
import socket
import struct
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import uuid

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
root = Path(__file__).resolve().parent.parent
output = root / '.verification'
output.mkdir(exist_ok=True)
# Reuse the existing, dependency-free CDP client without running its test suite.
tree = ast.parse((root / 'tests/run_browser.py').read_text(encoding='utf-8'))
client = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == 'CDP')
exec(compile(ast.Module(body=[client], type_ignores=[]), 'browser-client', 'exec'))
steps = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
with socket.socket() as available:
    available.bind(('127.0.0.1', 0))
    port = available.getsockname()[1]
log = (output / 'ui-preview.log').open('w', encoding='utf-8')
process = subprocess.Popen([
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    '--headless', '--disable-gpu', '--no-first-run', '--disable-extensions',
    '--disable-background-networking', f'--remote-debugging-port={port}',
    '--remote-allow-origins=*', f'--user-data-dir={output / ("ui-" + uuid.uuid4().hex[:8])}',
    '--allow-file-access-from-files', 'about:blank'
], stdout=log, stderr=log, creationflags=subprocess.CREATE_NO_WINDOW)

try:
    page = None
    for _ in range(80):
        try:
            pages = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json', timeout=.5))
            page = next((p for p in pages if p['type'] == 'page'), None)
            if page:
                break
        except (OSError, ValueError):
            pass
        time.sleep(.1)
    if not page:
        raise RuntimeError('Chrome did not start.')
    browser = CDP(page['webSocketDebuggerUrl'])
    browser.call('Page.setDownloadBehavior', {'behavior': 'deny'})

    def evaluate(expression):
        r = browser.call('Runtime.evaluate', {'expression': expression, 'returnByValue': True, 'awaitPromise': True, 'replMode': True})
        if r.get('error') or r.get('result', {}).get('exceptionDetails'):
            raise RuntimeError(json.dumps(r, ensure_ascii=False))
        return r.get('result', {}).get('result', {}).get('value')

    def click(selector):
        evaluate('(()=>{const e=document.querySelector(' + json.dumps(selector) + ');if(!e)throw Error("Missing control");e.scrollIntoView({block:"center",inline:"nearest"});})()')
        time.sleep(.06)
        coordinates = evaluate('(()=>{const e=document.querySelector(' + json.dumps(selector) + '),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()')
        for event in ['mouseMoved', 'mousePressed', 'mouseReleased']:
            args = {**coordinates, 'type': event}
            if event != 'mouseMoved':
                args.update(button='left', clickCount=1)
            response=browser.call('Input.dispatchMouseEvent', args)
            if response.get('error'):
                raise RuntimeError(json.dumps({'selector':selector,'coordinates':coordinates,'response':response},ensure_ascii=False))

    browser.call('Emulation.setDeviceMetricsOverride', {'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
    browser.call('Page.navigate', {'url':sys.argv[2] if len(sys.argv)>2 else (root / 'index.html').as_uri()})
    for _ in range(80):
        if evaluate('!!window.MATREE_APP'):
            break
        time.sleep(.1)
    if not evaluate('!!window.MATREE_APP'):
        raise RuntimeError('App failed to load.')
    for step in steps:
        if 'script' in step:
            script=(root/step['script']).resolve()
            if not script.is_relative_to(root):
                raise ValueError('Script must be inside the workspace.')
            evaluate(script.read_text(encoding='utf-8'))
        if 'size' in step:
            width,height = step['size']
            browser.call('Emulation.setDeviceMetricsOverride', {'width':width,'height':height,'deviceScaleFactor':1,'mobile':width<600})
            time.sleep(.15)
        if 'click' in step:
            click(step['click'])
        if 'drag' in step:
            drag=step['drag']
            point=evaluate('(()=>{const e=document.querySelector('+json.dumps(drag['selector'])+'),r=e.getBoundingClientRect();return {x:r.left+e.clientWidth-30,y:r.top+100};})()')
            browser.call('Input.dispatchMouseEvent', {'type':'mousePressed',**point,'button':'left','clickCount':1})
            browser.call('Input.dispatchMouseEvent', {'type':'mouseMoved','x':point['x']+drag.get('dx',0),'y':point['y']+drag.get('dy',0),'buttons':1})
            browser.call('Input.dispatchMouseEvent', {'type':'mouseReleased','x':point['x']+drag.get('dx',0),'y':point['y']+drag.get('dy',0),'button':'left','clickCount':1})
        if 'type' in step:
            browser.call('Input.insertText', {'text':step['type']})
        if 'key' in step:
            for event in ['keyDown','keyUp']:
                key_codes={'Enter':13,'Tab':9,'Escape':27,'ArrowLeft':37,'ArrowUp':38,'ArrowRight':39,'ArrowDown':40}
                args={'type':event,'key':step['key'],'code':step['key'],'windowsVirtualKeyCode':key_codes.get(step['key'],0)}
                if step['key']=='Enter' and event=='keyDown':
                    args.update(text='\r',unmodifiedText='\r')
                browser.call('Input.dispatchKeyEvent', args)
        if 'eval' in step:
            value = evaluate(step['eval'])
            if 'json_output' in step:
                name=step['json_output']
                if Path(name).name!=name or not name.endswith('.json'):
                    raise ValueError('Audit must be a JSON filename.')
                (output/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
                print('Audit: '+name)
            elif value is not None:
                encoded = json.dumps(value, ensure_ascii=False)
                print(encoded if len(encoded)<1200 else encoded[:1000]+' [output shortened]')
        if 'screenshot' in step:
            name = step['screenshot']
            if Path(name).name != name or not name.endswith('.png'):
                raise ValueError('Screenshot must be a PNG filename.')
            time.sleep(.1)
            screenshot = browser.call('Page.captureScreenshot', {'format':'png'})
            (output / name).write_bytes(base64.b64decode(screenshot['result']['data']))
            print('Screenshot: ' + name)
    browser.call('Browser.close')
finally:
    if process.poll() is None:
        process.terminate()
    log.close()
