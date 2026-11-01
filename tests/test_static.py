from pathlib import Path
import json, re, hashlib
R=Path(__file__).resolve().parent.parent
needed=['index.html','game.js','historical-context.js','styles.css','premium.css','sw.js','manifest.webmanifest','icon-192.png','icon-512.png']
for f in needed:assert (R/f).exists(),f
m=json.loads((R/'ASSETS_MANIFEST.json').read_text(encoding='utf-8'))
for name,info in m.items():
    data=(R/'assets'/f'{name}.webp').read_bytes()
    assert data[:4]==b'RIFF' and data[8:12]==b'WEBP',name
    assert hashlib.sha256(data).hexdigest().startswith(info['sha256']),name
cache=(R/'sw.js').read_text(encoding='utf-8')
for f in re.findall(r'"\.\/([^\"]+)"',cache):assert (R/f).exists(),f
assert 'maximum-scale=1' not in (R/'index.html').read_text(encoding='utf-8')
for n in ('home','village','market','irit','dock','shore','herbs','olive','injured','simeon','spring','ruins','hill','jesus'):
    assert re.search(rf'\b{n}:\{{',(R/'historical-context.js').read_text(encoding='utf-8'))
print('SENDAS static validation: PASS')

# 2.6: prevent a visually stale release where the code exists but is never loaded.
html=(R/'index.html').read_text(encoding='utf-8')
for needle in ('chapter26.js', 'chapter26.css', 'Versión 2.8.0', 'chapter27.js'):
    assert needle in html, 'Missing 2.6 UI integration: '+needle
for path in ['assets/chapter26/almacen_magdala.webp','assets/chapter26/voces_magdala.webp','assets/chapter26/neria_portrait.webp','assets/chapter26/asaf_portrait.webp']:
    d=(R/path).read_bytes()
    assert d[:4]==b'RIFF' and d[8:12]==b'WEBP', path
for path in ('chapter26.js','chapter26.css','DESIGN_26.md','QA_26.md'):
    assert (R/path).is_file(), path
print('SENDAS 2.6 static chapter integration: PASS')

assert (R/"chapter27.js").exists()
print("SENDAS 2.7 static integration: PASS")

assert (R/"chapter28.js").exists() and (R/"chapter28.css").exists()
for p in ["assets/chapter28/orilla_amanecer.webp","assets/chapter28/refugio_reparto.webp"]: assert (R/p).is_file(), p
print("SENDAS 2.8 asset and entrypoint integration: PASS")
