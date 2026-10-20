"""Small persistent isolated Chrome session for manual, UI-only review commands.

python tests/browser_probe.py PORT command.json
Commands: start(url,width,height), read, click(selector), type(selector,text),
key(key), size(width,height), screenshot(name), eval(code), stop.
No application state or answers are inspected by this helper.
"""
import ast
import base64
import json
from pathlib import Path
import socket
import struct
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import os

sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent.parent
out=root/'.verification'
port=int(sys.argv[1])
command=json.loads(Path(sys.argv[2]).read_text(encoding='utf-8-sig'))
action=command['action']
meta=out/f'probe-{port}.json'
if action=='start':
    if meta.exists():
        raise RuntimeError('Choose an unused port for a new isolated profile.')
    settings={'width':command.get('width',390),'height':command.get('height',844)}
    meta.write_text(json.dumps(settings),encoding='utf-8')
    log=(out/f'probe-{port}.log').open('w')
    subprocess.Popen([r'C:\Program Files\Google\Chrome\Application\chrome.exe','--headless','--disable-gpu','--no-first-run','--disable-extensions',f'--remote-debugging-port={port}','--remote-allow-origins=*',f'--user-data-dir={out/f"probe-{port}-profile"}','about:blank'],stdout=log,stderr=log,creationflags=subprocess.CREATE_NO_WINDOW)
settings=json.loads(meta.read_text(encoding='utf-8'))
tree=ast.parse((root/'tests/run_browser.py').read_text(encoding='utf-8'))
client=next(n for n in tree.body if isinstance(n,ast.ClassDef) and n.name=='CDP')
exec(compile(ast.Module(body=[client],type_ignores=[]),'browser-client','exec'))
for attempt in range(60):
    try:
        tabs=json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json',timeout=.5))
        tab=next(t for t in tabs if t['type']=='page')
        break
    except (OSError,ValueError,StopIteration):
        time.sleep(.1)
else:
    raise RuntimeError('Chrome did not start.')
b=CDP(tab['webSocketDebuggerUrl'])
def call(method,params=None):
    result=b.call(method,params or {})
    if result.get('error'):
        raise RuntimeError(result)
    return result.get('result',{})
def evaluate(code):
    result=call('Runtime.evaluate',{'expression':code,'returnByValue':True,'awaitPromise':True})
    if result.get('exceptionDetails'):
        raise RuntimeError(result['exceptionDetails'])
    return result.get('result',{}).get('value')
def metrics():
    call('Emulation.setDeviceMetricsOverride',{**settings,'deviceScaleFactor':1,'mobile':settings['width']<600})
metrics()
if action=='start':
    call('Page.navigate',{'url':command['url']})
    time.sleep(1)
elif action=='size':
    settings={'width':command['width'],'height':command['height']}
    meta.write_text(json.dumps(settings),encoding='utf-8');metrics()
elif action=='click':
    selector=json.dumps(command['selector'])
    evaluate(f'document.querySelector({selector}).scrollIntoView({{block:"center",inline:"nearest"}})')
    time.sleep(.1)
    point=evaluate(f'(()=>{{const r=document.querySelector({selector}).getBoundingClientRect();return {{x:r.x+r.width/2,y:r.y+r.height/2}}}})()')
    for event in ['mousePressed','mouseReleased']:
        call('Input.dispatchMouseEvent',{'type':event,'button':'left','clickCount':1,**point})
elif action=='type':
    evaluate('document.querySelector('+json.dumps(command['selector'])+').focus()')
    call('Input.insertText',{'text':command['text']})
elif action=='key':
    key=command['key'];codes={'Enter':13,'Escape':27,'Tab':9,'ArrowDown':40,'ArrowUp':38}
    for event in ['keyDown','keyUp']:
        args={'type':event,'key':key,'windowsVirtualKeyCode':codes.get(key,0)}
        if key=='Enter' and event=='keyDown':args['text']='\r'
        call('Input.dispatchKeyEvent',args)
elif action=='eval':
    print(json.dumps(evaluate(command['code']),ensure_ascii=False))
elif action=='stop':
    call('Browser.close');sys.exit(0)
time.sleep(.2)
if action=='screenshot' or command.get('screenshot'):
    name=command.get('name') or command['screenshot']
    if Path(name).name!=name or not name.endswith('.png'):raise ValueError('Use a PNG filename.')
    (out/name).write_bytes(base64.b64decode(call('Page.captureScreenshot',{'format':'png'})['data']))
    print('Screenshot: '+name)
if action!='eval':
    print(evaluate('(document.querySelector("dialog[open]")||document.body).innerText'))
