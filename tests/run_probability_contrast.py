"""Freeze policy/adapter, record responses, then independently grade by enumeration.

No app bank changes or profile injection. Raw responses are saved before grading.
"""
import hashlib
import json
import sys
from fractions import Fraction
from pathlib import Path
from probability_contrast_policy import MODEL_SPEC, respond

ROOT = Path(__file__).resolve().parent
RUN_NAME = sys.argv[1] if len(sys.argv)>1 else 'probability-contrast'
if Path(RUN_NAME).name != RUN_NAME or RUN_NAME in ('.', '..'):
    raise ValueError('Use a single new run-directory name')
OUTPUT = ROOT.parent / '.verification' / RUN_NAME


def write(name, data):
    # Exclusive creation preserves every run instead of silently overwriting failures.
    with (OUTPUT / name).open('x', encoding='utf-8') as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2)
        stream.write('\n')


def main():
    OUTPUT.mkdir(parents=True, exist_ok=False)
    paths = ['probability_contrast_policy.py', 'probability-contrast-questions.json', 'pupil-dom-adapter.js']
    manifest = {name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in paths}
    preflight = json.loads((ROOT.parent/'.verification/pupil-adapter-preflight.json').read_text(encoding='utf-8'))
    assert preflight['passed'] == 13
    write('frozen.json', {'sha256':manifest,'models':MODEL_SPEC,
                         'method':'New deterministic parser; same mathematical abilities; technical transfer, not independent blind review.',
                         'preflightPassed':preflight['passed']})
    questions = json.loads((ROOT/'probability-contrast-questions.json').read_text(encoding='utf-8'))
    # Policy receives only the displayed prompt, not IDs, key or previous results.
    raw = {level: [{'prompt':q['prompt'], 'response':respond(level,q['prompt'])} for q in questions] for level in MODEL_SPEC}
    write('responses-before-grading.json', raw)
    assert all(hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==value for name,value in manifest.items())

    # Separate solution: enumerate labelled balls. Does not call the answer policy.
    balls = ['R1','R2','R3','B1','B2','B3','B4','B5']
    key = {}
    for replacement in [True,False]:
        prefix = 'with' if replacement else 'without'
        # Condition on the known first red ball, R1 by symmetry.
        remaining = balls if replacement else [x for x in balls if x!='R1']
        key[prefix+'-total'] = Fraction(len(remaining))
        key[prefix+'-red'] = Fraction(sum(x.startswith('R') for x in remaining),len(remaining))
        key[prefix+'-blue'] = Fraction(sum(x.startswith('B') for x in remaining),len(remaining))
        paths = [(a,b) for a in balls for b in balls if replacement or a!=b]
        key[prefix+'-either'] = Fraction(sum(a[0]!=b[0] for a,b in paths),len(paths))
    write('independent-key.json', {k:str(v) for k,v in key.items()})
    graded={}
    for level,rows in raw.items():
        graded[level]=[]
        for question,row in zip(questions,rows):
            response=row['response']
            correct = Fraction(response['value'])==key[question['id']] if response['kind']=='answer' else None
            graded[level].append({'id':question['id'],**row,'expected':str(key[question['id']]),'correct':correct})
    summary={level:{'correct':sum(r['correct'] is True for r in rows),
                    'wrong':sum(r['correct'] is False for r in rows),
                    'abstained':sum(r['response']['kind']=='abstain' for r in rows),
                    'parserErrors':sum(r['response']['kind']=='parser-error' for r in rows)} for level,rows in graded.items()}
    write('graded.json', {'manifest':manifest,'summary':summary,'attempts':graded})
    assert summary['low']=={'correct':0,'wrong':0,'abstained':8,'parserErrors':0}
    assert summary['mixed']=={'correct':4,'wrong':4,'abstained':0,'parserErrors':0}
    assert summary['strong']=={'correct':8,'wrong':0,'abstained':0,'parserErrors':0}
    print(json.dumps(summary))


if __name__=='__main__':
    main()
