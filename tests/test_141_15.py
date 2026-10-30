#!/usr/bin/env python3
"""Static and art consistency verification for SENDAS 1.4.1/1.5."""
from pathlib import Path
import json, re, sys
from PIL import Image, ImageChops
root = Path(__file__).resolve().parents[1]
issues=[]
def check(cond, msg):
    if not cond: issues.append(msg)
def read(p): return (root/p).read_text(encoding='utf-8')
code=read('game.js'); html=read('index.html'); sw=read('sw.js')
check('Interior de la casa de Natán' in code,'home is not interior')
check("const KEY='sendas_cronicas_ilustrada_1'" in code,'save key changed')
check('window.SENDAS_READONLY' in code,'no introspection hook')
check("'netDone','iritDone','springSolved'" in code,'primary quest flags missing')
check('openJournal()' in code,'journal missing')
check('historical-context.js' not in html, 'meta history script still loaded')
if (root/'manuscripts.js').exists():
    manuscripts=read('manuscripts.js')
    check('manuscripts.js' in html,'manuscripts script missing')
    check(html.index('manuscripts.js')<html.index('game.js'),'manuscripts script after game script')
    check(len(re.findall(r'^  [a-z_]+: \{',manuscripts,re.M))>=14,'fewer than 14 documents')
    check('doc_' in code,'document-state flags not present')
    check('Escritos del camino' in code,'in-game documents index missing')
    check('no son retratos hist' not in code,'cast meta notice remains')
    check(not re.search(r'ficci[oó]n|fictici[oa]',code,re.I),'meta fiction notice remains')
files=re.findall(r'"\.\/([^"\n]+)"',sw)
for f in files:
    check((root/f).is_file(),f'missing precache file {f}')
for key in ['home','home_late','home_dusk','home_night']:
    p=root/'assets'/f'{key}.webp';check(p.is_file(),f'missing art {key}')
    if p.exists():
        with Image.open(p) as im:check(im.size==(1536,864),f'bad frame {key}: {im.size}')
# sanity-check geometry: the same 4 phase variants must have a recognizable master composition
base=Image.open(root/'assets/home.webp').convert('RGB').resize((128,72))
for key in ['home_late','home_dusk','home_night']:
    image=Image.open(root/'assets'/f'{key}.webp').convert('RGB').resize((128,72))
    gray0=base.convert('L');gray1=image.convert('L')
    # Compare strong changes in edges; avoids treating exposure as geometry change.
    from PIL import ImageFilter, ImageStat
    edge0=gray0.filter(ImageFilter.FIND_EDGES)
    edge1=gray1.filter(ImageFilter.FIND_EDGES)
    diff=ImageChops.difference(edge0,edge1)
    avg=ImageStat.Stat(diff).mean[0]
    check(avg<35,f'edges differ too much for {key}: {avg:.1f}')
if issues:
    print('FAIL',len(issues))
    for x in issues:print(' -',x)
    sys.exit(1)
print('PASS: story, documents, offline assets, 4 scene variants, save compatibility hooks')