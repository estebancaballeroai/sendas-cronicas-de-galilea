from pathlib import Path
import re, json,hashlib,sys
from PIL import Image
root=Path(sys.argv[1]);results=[]
def check(ok,desc):
 results.append((bool(ok),desc));print(('PASS' if ok else 'FAIL'),desc)
for f in ['index.html','styles.css','premium.css','historical-context.js','game.js','sw.js','manifest.webmanifest','ASSETS_MANIFEST.json','.nojekyll']:
 check((root/f).is_file(),f+' presente')
html=(root/'index.html').read_text();js=(root/'game.js').read_text();sw=(root/'sw.js').read_text()
manifest=json.loads((root/'ASSETS_MANIFEST.json').read_text())
refs=re.findall(r'"\.\/([^\"]+)"',sw)
for ref in refs:check((root/ref).is_file(),ref+' disponible para caché')
check(all(f in html for f in ['game.js','historical-context.js','premium.css','styles.css']),'dependencias JavaScript y CSS conectadas')
check("const KEY='sendas_cronicas_ilustrada_1'" in js,'clave de guardado conservada')
check('function readData()' in js or 'const readData=' in js,'lectura de partida activa')
check("version:'1.4.0'" in js if root.name=='v1.4' else "version:'1.3.1'" in js,'versión del motor')
check('Mundo vivo 1.4' in html if root.name=='v1.4' else '1.3.1' in html,'versión mostrada en portada')
if root.name=='v1.4':
 variants=json.loads((root/'SCENE_VARIANTS.json').read_text())
 check(len(variants)==12,'12 variantes fotográficas')
 for name,datum in variants.items():
  p=root/'assets'/name;source=root/datum['source']
  check(p.is_file() and source.is_file(),'variante + original '+name)
  if p.is_file() and source.is_file():
   a=Image.open(p);b=Image.open(source)
   check(a.size==b.size,'geometría idéntica '+name)
   check(hashlib.sha256(p.read_bytes()).hexdigest()==datum['sha256'],'SHA256 correcto '+name)
 check("state.completed?'NOCHE'" in js,'fase nocturna ligada a la historia')
 check('jonasFollow' in js and 'iritFollow' in js and 'simeonFollow' in js,'tres seguimientos opcionales')
 check('ambientSound:false' in js,'sonido inicialmente apagado')
 check("sendas-mundo-vivo-v1.4.0" in sw,'caché versionada')
else:
 check('sendas-estabilidad-v1.3.1' in sw,'caché 1.3.1 versionada')
print('TOTAL',sum(ok for ok,_ in results),'/',len(results))
sys.exit(0 if all(ok for ok,_ in results) else 1)
