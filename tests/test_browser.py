#!/usr/bin/env python3
"""Real browser traversal of SENDAS chapter I and manuscript collection."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from functools import partial
import os,sys,traceback
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
URL='http://127.0.0.1:%d/'%server.server_port
errors=[]
checks=0
def verify(expr,description):
    global checks
    checks+=1
    if not expr:raise AssertionError(description)

def play():
 with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
    page.on('pageerror',lambda e:errors.append(str(e)))
    responses=[]
    page.on('response',lambda r:responses.append((r.url,r.status)) if r.status>=400 else None)
    page.goto(URL,wait_until='networkidle',timeout=30000)
    page.locator('#start-new').click()
    page.locator('#modal-close').click()
    verify(page.locator('#story-title').inner_text()=='El primer amanecer','wrong scene opening')
    verify('Interior de la casa' in page.locator('#scene-place').inner_text(),'opening not in the house')
    verify(page.locator('#scene-art').evaluate('(e)=>e.naturalWidth')>=1500,'home art not loaded')
    def do(action):
      selector='[data-run="'+action+'"]'
      # Dialog controls must take precedence over hotspots behind a modal.
      if page.locator('#modal-root').is_visible():
        choice=page.locator('#modal-content '+selector)
        if choice.count()>0:
          choice.first.click(timeout=15000)
          return
      button=page.locator('#actions '+selector)
      if button.count()>0:
        button.first.click(timeout=15000)
      else:
        page.locator(selector+':visible').first.click(timeout=15000)
    def close():page.locator('#modal-close').click()
    def flag(k):return page.evaluate('window.SENDAS_READONLY.getState().flags['+repr(k)+'] || false')
    do('introLetter')
    verify(page.locator('.manuscript-sheet').is_visible(),'note not presented as readable document')
    verify('La nota del maestro' in page.locator('.manuscript-sheet').inner_text(),'wrong starting manuscript')
    close();verify(flag('doc_home_note'),'starting document not collected')
    do('field:home');close();verify(flag('doc_home_house'),'home tools observation did not produce reading')
    page.locator('#btn-history').click()
    verify('Escritos' in page.locator('#modal-title').inner_text(),'journal of collected documents missing')
    verify(page.locator('[data-run="history:home_note"]').count()==1,'document not in collection')
    close()
    do('go:village');do('go:market')
    do('scroll:market_accounts')
    verify('Mara' in page.locator('.manuscript-sheet').inner_text(),'market record unreadable')
    close();do('buyCord')
    do('go:dock');do('talkJonas');close()
    do('inspectNet');do('knot:Tensar');do('knot:Cruzar');do('knot:Fijar')
    verify(flag('netDone'),'Jonás network mission was blocked')
    close();do('go:village');do('go:irit');do('talkIrit');do('go:herbs')
    do('herbPuzzle');do('herb:correct');do('herb:correct')
    do('go:irit');do('talkIrit');do('giveHerbs')
    verify(flag('iritDone'),'Irit herbal mission blocked')
    close();do('go:village');do('go:simeon')
    do('scroll:simeon_register');close()
    do('scriptPuzzle');do('script:Olivo');do('script:Agua');do('script:Piedra')
    do('go:spring');do('springPuzzle');do('spring:correct')
    verify(flag('springSolved'),'mentor quest blocked')
    close();do('go:village');do('go:hill');do('go:jesus');do('reflect');do('end:practice')
    verify(page.evaluate('window.SENDAS_READONLY.getState().completed'),'chapter not completed')
    verify(page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'),'horizontal overflow on mobile')
    close()
    saved=page.evaluate('localStorage.getItem("sendas_cronicas_ilustrada_1")')
    verify(bool(saved),'game does not store progress')
    page.reload(wait_until='networkidle')
    page.locator('#start-continue').click()
    verify(page.evaluate('window.SENDAS_READONLY.getState().completed'),'save not recovered after reload')
    page.locator('#btn-history').click()
    verify(page.locator('[data-run="history:simeon_register"]').count()>0,'document collection lost after reload')
    close()
    verify(not errors,'JavaScript page errors: '+str(errors))
    verify(not responses,'HTTP errors: '+str(responses))
    page.screenshot(path='/tmp/sendas_390_final.png')
    # Narrow screen and tablet checks
    for w,h in [(360,640),(800,1280)]:
      tab=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<600,has_touch=w<600)
      tab.goto(URL,wait_until='networkidle')
      tab.locator('#start-new').click();tab.locator('#modal-close').click()
      verify(tab.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'),f'horizontal overflow at {w}')
      tab.locator('#btn-scene-zoom').click()
      verify(tab.locator('#scene-lightbox').is_visible(),f'zoom unavailable at {w}')
      tab.locator('#zoom-close').click()
      tab.close()
    browser.close()
print('Checking',URL)
try:
    play()
except Exception:
    traceback.print_exc()
    print('FAILED after',checks,'checks')
    sys.exit(1)
finally:server.shutdown()
print('PASS',checks,'real browser checks, no runtime exceptions')