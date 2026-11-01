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
for needle in ('chapter26.js', 'chapter26.css', 'Versión 3.0.0', 'chapter27.js'):
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

# 2.9: the chapter must be loaded and its three cinematic originals must exist.
for needle in ('chapter29.js','chapter29.css','Cap\u00edtulos I\u2013V'):
    assert needle in html, 'Missing 2.9 entrypoint: '+needle
for p in ('chapter29.js','chapter29.css','DESIGN_29.md','QA_29.md','tests/test_chapter29.cjs'):
    assert (R/p).is_file(),p
for name in ('patio_acuerdos','consejo_lamparas','orilla_tercer_dia'):
    path=R/'assets/chapter29'/f'{name}.webp'
    data=path.read_bytes()
    assert data[:4]==b'RIFF' and data[8:12]==b'WEBP',str(path)
    info=m['chapter29/'+name]
    assert len(data)==info['bytes'] and info['px']==[1672,941] and hashlib.sha256(data).hexdigest()==info['sha256'],name
assert 'sendas-campana-integrada-v3.0.0' in cache
print('SENDAS 2.9 three-day scenes, manifest, cache and entrypoint: PASS')

assert (R/"campaign30.js").exists() and (R/"campaign30.css").exists()
assert "campaign30.js" in html and "campaign30.css" in html
assert "./campaign30.js" in cache and "./campaign30.css" in cache
print("SENDAS 3.0 continuity integration: PASS")
