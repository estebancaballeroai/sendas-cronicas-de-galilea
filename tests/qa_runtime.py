from pathlib import Path
import base64,re,json,sys,traceback,time
from playwright.sync_api import sync_playwright

root=Path(sys.argv[1]); out=root/'qa_new';out.mkdir(exist_ok=True)
html=(root/'index.html').read_text(encoding='utf-8')
for css in ['styles.css','premium.css']:
 data=(root/css).read_text(encoding='utf-8').replace("url('assets/cover.webp')", "url('data:image/webp;base64,"+base64.b64encode((root/'assets/cover.webp').read_bytes()).decode()+"')")
 html=html.replace(f'<link rel="stylesheet" href="{css}">','<style>'+data+'</style>')
html=re.sub(r'<script>if\("serviceWorker".*?</script>', '',html,flags=re.S)
# embed assets for realistic image loading and game correctness
assets={p.stem:'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (root/'assets').glob('*.webp')}
inline='\n<script>window.__SENDAS_EMBEDDED__='+json.dumps(assets)+';</script>\n'
html=html.replace('<script defer src="historical-context.js"></script>',inline+'<script>'+ (root/'historical-context.js').read_text(encoding='utf-8')+'</script>')
html=html.replace('<script defer src="game.js"></script>', '<script>'+(root/'game.js').read_text(encoding='utf-8').replace('</script>','<\\/script>')+'</script>')
# use stable window-local fake storage in about:blank so tests exercise backup and JSON
storage_patch='''<script>window.__STORAGE={}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return Object.prototype.hasOwnProperty.call(window.__STORAGE,k)?window.__STORAGE[k]:null;},setItem(k,v){window.__STORAGE[k]=String(v);},removeItem(k){delete window.__STORAGE[k];},clear(){window.__STORAGE={};}}});</script>'''
html=html.replace('<!-- no such element -->','').replace(inline,storage_patch+inline)
fail=[];passed=[];errors=[]
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None,args=['--no-sandbox','--disable-web-security','--disable-dev-shm-usage'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,has_touch=True,is_mobile=True)
 page=context.new_page()
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=60000)
 def assert_that(cond,desc):
  if not cond: fail.append(desc);print('FAIL',desc);raise AssertionError(desc)
  passed.append(desc);print('PASS',desc)
 def state():return page.evaluate('window.SENDAS_READONLY.getState()')
 def action(a):
  # visible modal first; otherwise story actions. Use real button clicks.
  if not page.locator('#modal-root').get_attribute('hidden') is not None:
   loc=page.locator('#modal-content button[data-run]').filter(has=page.locator('span[data-nope]')) if False else page.locator(f'#modal-content [data-run="{a}"]')
  else:loc=page.locator('#no-such-button')
  if loc.count()==0:loc=page.locator(f'#actions button[data-run="{a}"]')
  if loc.count()==0:loc=page.locator(f'#hotspot-layer button[data-run="{a}"]')
  assert_that(loc.count()>0,'acción disponible: '+a)
  loc.first.click(timeout=12000)
 def close():
  if not page.locator('#modal-root').get_attribute('hidden') is not None:
   page.locator('#modal-close').click(timeout=10000)
 assert_that(page.locator('#start-screen').is_visible(),'pantalla de inicio')
 page.locator('#start-new').click()
 close()
 assert_that(state()['scene']=='home','inicio de partida')
 assert_that(page.locator('#scene-art').get_attribute('src') is not None,'imagen cargada')
 page.locator('#btn-image-zoom').click()
 assert_that(page.locator('#photo-viewer').is_visible(),'visor de escena abre')
 page.locator('#photo-zoom-in').click()
 assert_that('1.25' in page.locator('#photo-zoom-value').inner_text(),'zoom aumenta')
 page.locator('#photo-zoom-close').click()
 assert_that(not page.locator('#photo-viewer').is_visible(),'visor se cierra')
 action('go:village')
 action('go:dock')
 action('talkJonas');assert_that(state()['flags'].get('jonasTalk'),'diálogo Jonás')
 close();action('go:village');action('go:market');action('buyCord');assert_that(state()['inv'].get('cuerda')==1,'compra cuerda')
 close();action('go:village');action('go:dock');action('inspectNet')
 for x in ['Tensar','Cruzar','Fijar']:action('knot:'+x)
 assert_that(state()['flags'].get('netDone'),'misión 1 red')
 if root.name=='v1.4':
  assert_that('MEDIODÍA' in page.locator('#story-overline').inner_text(),'hora relacionada con misión 1')
 close();action('go:village');action('go:irit');action('talkIrit');close();action('go:herbs');action('herbPuzzle');action('herb:correct');action('herb:correct')
 assert_that(state()['inv'].get('plantas')==2,'recolectar dos plantas')
 close();action('go:irit');action('talkIrit');action('giveHerbs');assert_that(state()['flags'].get('iritDone'),'misión 2 Irit')
 if root.name=='v1.4':
  page.wait_for_function("document.getElementById('scene-art').src===window.__SENDAS_EMBEDDED__.irit_tarde",timeout=8000);assert_that(True,'escena tarde Irit')
 close();action('talkIrit');
 if root.name=='v1.4':
  action('iritFollow');assert_that(state()['flags'].get('iritFollow'),'conversación seguimiento Irit')
 close();action('go:village');action('go:simeon');action('talkSimeon');close();action('scriptPuzzle')
 for x in ['Olivo','Agua','Piedra']:action('script:'+x)
 assert_that(state()['flags'].get('simeonPuzzle'),'enigma Siméon')
 action('go:spring');action('springPuzzle');action('spring:correct');assert_that(state()['flags'].get('springSolved'),'misión 3 manantial')
 close();action('go:village');action('go:hill');action('go:jesus');action('reflect');action('end:practice')
 assert_that(state()['completed'],'capítulo finalizado')
 close();action('go:village')
 if root.name=='v1.4':
  page.wait_for_function("document.getElementById('scene-art').src===window.__SENDAS_EMBEDDED__.village_noche",timeout=8000);assert_that(True,'aldea nocturna después del capítulo')
  assert_that('NOCHE' in page.locator('#scene-badge').inner_text(),'etiqueta nocturna')
  action('go:dock');action('talkJonas');action('jonasFollow');assert_that(state()['flags'].get('jonasFollow'),'seguimiento Jonás')
  close();action('go:village');action('go:simeon');action('talkSimeon');action('simeonFollow');assert_that(state()['flags'].get('simeonFollow'),'seguimiento Siméon')
  close();page.locator('nav button[data-panel="journal"]').click();action('worldJournal');assert_that('Un día en Galilea' in page.locator('#modal-title').inner_text(),'diario mundo vivo')
  assert_that('Irit' in page.locator('#modal-content').inner_text(),'diario recuerda Irit')
  close()
  page.locator('#btn-menu').click();action('soundToggle');assert_that(state()['ambientSound'],'sonido opcional activado')
  action('soundToggle');assert_that(not state()['ambientSound'],'sonido opcional desactivado')
  close()
 # Save/export key regression in both
 assert_that(page.evaluate("Boolean(window.localStorage.getItem('sendas_cronicas_ilustrada_1'))"),'guardado local generado')
 page.screenshot(path=str(out/'game390.png'),full_page=True)
 for width,height in [(360,640),(800,1280),(1365,768)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(100)
  assert_that(page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2'),f'sin scroll horizontal {width}')
  page.screenshot(path=str(out/f'game{width}.png'),full_page=True)
 assert_that(not errors,'sin errores JavaScript')
 browser.close()
(out/'QA_RUNTIME.json').write_text(json.dumps({'passed':len(passed),'failures':fail,'errors':errors,'version':root.name},ensure_ascii=False,indent=2),encoding='utf-8')
print('RESULT',root.name,len(passed),'checks passed')
