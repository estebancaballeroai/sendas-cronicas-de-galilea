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
