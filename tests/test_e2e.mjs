/* Real Chromium/Playwright smoke tests against the actual served SENDAS HTML. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const base='http://127.0.0.1:8777/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let failures=0,tests=0;
await mkdir('tests/screenshots',{recursive:true});
async function check(name,work){
  tests++;
  try{await work();console.log('PASS',name);}
  catch(e){failures++;console.error('FAIL',name,e.stack||String(e));}
}
async function pageAt(width=390,height=844,seed=null){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:width<900,hasTouch:width<900});
  if(seed)await context.addInitScript((s)=>{if(!sessionStorage.getItem('__sendas_test_seeded')){localStorage.setItem('sendas_cronicas_ilustrada_1',JSON.stringify(s));sessionStorage.setItem('__sendas_test_seeded','1');}},seed);
  const page=await context.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(String(e)));
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  return {context,page,errs};
}
function seed(){
  return {version:1,scene:'spring',inv:{agua:1,pan:1,moneda:1},flags:{netDone:true,iritDone:true,simeonPuzzle:true,springSolved:true},choices:{},visited:['home','village','market','dock','irit','herbs','simeon','spring'],logs:['El pergamino fue hallado junto al agua.'],time:3,fontScale:1,completed:false,codex:{found:['market','dock','simeon','spring','revealed'],solved:true}};
}
const choose=(page,action)=>page.locator('#modal-content [data-sendas-ui="'+action+'"]').last().click({timeout:10000});
const action=(page,act)=>page.locator('.action-btn[data-run="'+act+'"]').first().click({timeout:10000});
const state=page=>page.evaluate(()=>window.SENDAS_READONLY.getState());
await check('new game mobile and image decoding',async()=>{
  const {context,page,errs}=await pageAt();
  try{
    await page.locator('#start-new').click();
    await page.locator('#modal-close').click();
    assert.match(await page.locator('#scene-place').innerText(),/Casa de Natán/i);
    assert.ok((await page.locator('#scene-art').evaluate(img=>img.complete&&img.naturalWidth>50)),'Opening image failed to load');
    await action(page,'go:village');
    assert.match(await page.locator('#story-title').innerText(),/voces del pueblo/i);
    assert.deepEqual(errs,[]);
  }finally{await context.close();}
});
await check('chapter II is a real navigable scene and choices survive reload',async()=>{
 const initial=seed();initial.scene='village';initial.codex={...initial.codex,entrusted:'jonas',delivered:true,resolved:true};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'go:yael');
  assert.match(await page.locator('#story-title').innerText(),/amanecer de las deudas/i);
  assert.match(await page.locator('.chapter-chip').innerText(),/CAPÍTULO II/);
  await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth>100);
  await action(page,'ch2:talk:yael');
  assert.ok(await page.locator('#modal-content .dialog-head').count(),'Shared dialogue renderer missing');
  await page.locator('#modal-content [data-run="ch2:topic:listen"]').click();
  assert.ok((await state(page)).chapter18.choices.includes('listen'));
  await page.locator('#modal-close').click();
  await action(page,'ch2:observe:grain');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).scene,'yael');
  assert.ok((await state(page)).chapter18.notes.includes('provisiones'));
  assert.ok((await state(page)).chapter18.choices.includes('listen'));
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('chapter II WebP originals decode and zoom is absent',async()=>{
 const initial=seed();initial.scene='village';initial.codex={...initial.codex,entrusted:'jonas',delivered:true,resolved:true};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'go:yael');
  const paths=['assets/chapter18/galilea_courtyard_detail.webp','assets/chapter18/yael_portrait.webp','assets/chapter18/eliab_portrait.webp'];
  const result=await page.evaluate(async(paths)=>Promise.all(paths.map(async path=>{const img=new Image();img.src=path;try{await img.decode();return {path,width:img.naturalWidth,height:img.naturalHeight};}catch(e){return {path,error:String(e)};}})),paths);
  assert.ok(result.every(x=>x.width>0&&x.height>0),'Missing chapter art: '+JSON.stringify(result));
  assert.equal(await page.locator('#btn-scene-zoom').count(),0);
  assert.equal(await page.locator('#scene-lightbox').count(),0);
  assert.equal(await page.locator('#hotspot-layer [data-run="ch2:talk:yael"]').count(),1);
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('one gray dialogue history for Yael survives reopening and reload',async()=>{
 const initial=seed();initial.scene='village';initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'go:yael');
  await action(page,'ch2:talk:yael');
  await page.locator('#modal-content [data-run="ch2:topic:listen"]').click();
  await page.locator('#modal-close').click();
  await action(page,'ch2:talk:yael');
  await page.locator('#modal-content [data-run="ch2:topic:grain"]').click();
  const seenChoice=page.locator('#modal-content [data-run="ch2:topic:listen"]');
  assert.ok(await seenChoice.evaluate(el=>el.closest('.dialog-option').classList.contains('dialog-option-seen')),'Dialogue choice is not gray');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  await action(page,'ch2:talk:yael');
  assert.ok(await page.locator('#modal-content [data-run="ch2:topic:listen"]').evaluate(el=>el.closest('.dialog-option').classList.contains('dialog-option-seen')),'Gray state lost after reload');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
for(const [w,person] of [['mara','Mara'],['jonas','Jonás'],['simeon','Siméon']]){
 await check('Chapter II continuity from '+w+' testimony',async()=>{
  const initial=seed();initial.scene='village';initial.codex={...initial.codex,entrusted:w,delivered:true,resolved:true};
  const {context,page,errs}=await pageAt(390,844,initial);
  try{
   await page.locator('#start-continue').click();await action(page,'go:yael');await action(page,'ch2:talk:yael');
   assert.ok((await page.locator('#modal-content').innerText()).includes(person),'Missing testimony consequence');
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}
await check('Chapter II informed decision persists and appears in journal',async()=>{
 const initial=seed();initial.scene='village';initial.codex={...initial.codex,entrusted:'simeon',delivered:true,resolved:true};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();await action(page,'go:yael');
  await action(page,'ch2:observe:grain');await page.locator('#modal-close').click();
  await action(page,'ch2:observe:measure');await page.locator('#modal-close').click();
  await action(page,'ch2:talk:yael');
  await page.locator('#modal-content [data-run="ch2:topic:permission"]').click();
  await page.locator('#modal-content [data-run="ch2:topic:promise"]').click();
  await page.locator('#modal-content [data-run="ch2:topic:commit"]').click();
  await page.locator('#modal-close').click();
  await action(page,'ch2:meeting');
  await page.locator('#modal-content [data-run="ch2:decision:consult"]').click();
  assert.equal((await state(page)).chapter18.resolution,'revisión-con-consentimiento');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).chapter18.decision,'consult');
  assert.ok((await state(page)).logs.some(x=>x.includes('revisión')||x.includes('revisar')));
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('NPC dialogue history persists across reopening and reload',async()=>{
 const initial=seed();initial.scene='dock';initial.flags.netDone=false;
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'talkJonas');
  await page.locator('#modal-content [data-run="jonasFaith"]').click();
  await page.locator('#modal-close').click();
  await action(page,'talkJonas');
  assert.ok(await page.locator('#modal-content [data-run="jonasFaith"]').evaluate(el=>el.closest('.dialog-option').classList.contains('dialog-option-seen')),'Reopened dialogue lost visited state');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  await action(page,'talkJonas');
  assert.ok(await page.locator('#modal-content [data-run="jonasFaith"]').evaluate(el=>el.closest('.dialog-option').classList.contains('dialog-option-seen')),'Reload lost visited dialogue state');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('visited scene action becomes gray and survives reload',async()=>{
 const {context,page,errs}=await pageAt();
 try{
  await page.locator('#start-new').click();
  await page.locator('#modal-close').click();
  const b=page.locator('#actions .action-btn').first();
  const id=await b.getAttribute('data-run');
  assert.ok(id,'Opening action missing');
  await b.click();
  await page.waitForTimeout(150);
  assert.ok(await page.locator('#actions .action-btn[data-run="'+id+'"]').evaluate(el=>el.classList.contains('action-btn-seen')),'Visited action not gray');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.ok(await page.locator('#actions .action-btn[data-run="'+id+'"]').evaluate(el=>el.classList.contains('action-btn-seen')),'Visited action not retained');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});

await check('unified codex shell reads the old archive and persists gray history',async()=>{
 const s=seed();s.scene='spring';
 const {context,page,errs}=await pageAt(390,844,s);
 try{
  await page.locator('#start-continue').click();
  await page.locator('#btn-codex').click();
  assert.equal(await page.locator('#modal-content .sendas-panel-codex').count(),1);
  assert.equal(await page.locator('#codex-overlay,#ledger16-overlay,#sendas17-voice').count(),0);
  assert.ok(await page.locator('#modal-content [data-sendas-ui="read:market"]').evaluate(el=>el.classList.contains('sendas-ui-seen')),'Old document visit did not migrate');
  await page.screenshot({path:'tests/screenshots/unified-codex-390.png'});
  await page.locator('#modal-content [data-sendas-ui="read:market"]').click();
  assert.match(await page.locator('#modal-title').innerText(),/El registro de Mara/i);
  await page.locator('#modal-content [data-sendas-ui="collection"]').click();
  assert.ok(await page.locator('#modal-content [data-sendas-ui="read:market"]').evaluate(el=>el.classList.contains('sendas-ui-seen')));
  await page.locator('#modal-close').click();
  assert.ok(await page.locator('#modal-root').isHidden());
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();await page.locator('#btn-codex').click();
  assert.ok(await page.locator('#modal-content [data-sendas-ui="read:market"]').evaluate(el=>el.classList.contains('sendas-ui-seen')));
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('ledger witnesses are visited in unified native modal',async()=>{
 const s=seed();s.scene='spring';
 const {context,page,errs}=await pageAt(390,844,s);
 try{
  await page.locator('#start-continue').click();
  await action(page,'story:plan');
  assert.equal(await page.locator('#modal-content .sendas-panel-ledger').count(),1);
  await page.locator('#modal-content [data-sendas-ui="choose:mara"]').click();
  assert.equal((await state(page)).codex.entrusted,'mara');
  await page.locator('#modal-close').click();
  await action(page,'story:plan');
  assert.ok(await page.locator('#modal-content [data-sendas-ui="choose:mara"]').evaluate(el=>el.classList.contains('sendas-ui-seen')));
  await page.locator('#modal-close').click();
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('echoes can be postponed, revisited and accepted with one gray history',async()=>{
 const s=seed();s.scene='irit';s.codex={...s.codex,entrusted:'mara',delivered:true,resolved:true};
 const {context,page,errs}=await pageAt(390,844,s);
 try{
  await page.locator('#start-continue').click();
  await action(page,'echo:irit');
  assert.equal(await page.locator('#modal-content .sendas-panel-echo').count(),1);
  await page.screenshot({path:'tests/screenshots/unified-echo-390.png'});
  await page.locator('#modal-content [data-sendas-ui="decline:irit"]').click();
  assert.equal((await state(page)).codex.echoes.irit,'later');
  await page.locator('#modal-close').click();
  await action(page,'echo:irit');
  assert.ok(await page.locator('#modal-content [data-sendas-ui="decline:irit"]').evaluate(el=>el.classList.contains('sendas-ui-seen')));
  await page.locator('#modal-content [data-sendas-ui="accept:irit"]').click();
  assert.equal((await state(page)).codex.echoes.irit,'help');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).codex.echoes.irit,'help');
  assert.equal(await page.locator('#actions [data-run="echo:irit"]').count(),0);
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await check('one overlay responds to Escape and focus returns to Papeles',async()=>{
 const {context,page,errs}=await pageAt(360,640,seed());
 try{
  await page.locator('#start-continue').click();await page.locator('#btn-codex').click();
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#modal-root').isHidden());
  assert.ok(await page.locator('#btn-codex').evaluate(b=>b===document.activeElement));
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
for(const [width,height] of [[360,640],[390,844],[800,1280],[1365,768]]){
 await check('responsive '+width+'x'+height,async()=>{
  const {context,page,errs}=await pageAt(width,height,seed());
  try{
    await page.locator('#start-continue').click();
    const sw=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:window.innerWidth}));
    assert.ok(sw.w<=sw.v+3,'Horizontal overflow '+JSON.stringify(sw));
    assert.ok(await page.locator('.action-btn[data-run="story:plan"]').count()===1,'No quest action');
    assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}
for(const [key,location] of [['mara','market'],['jonas','dock'],['simeon','simeon']]){
 await check('complete ledger quest and reload '+key,async()=>{
  const {context,page,errs}=await pageAt(390,844,seed());
  try{
    await page.locator('#start-continue').click();
    await action(page,'story:plan');
    await choose(page,'choose:'+key);
    assert.equal((await state(page)).codex.entrusted,key,'Entrusted selection should persist: '+JSON.stringify(await page.evaluate(()=>({state:window.SENDAS_READONLY.getState().codex,ledger:window.SENDAS_LEDGER.status(),overlay:document.querySelector('#modal-content')?.innerText.slice(0,200)}))));
    await page.locator('#modal-close').click();
    await action(page,'go:village');
    await action(page,'go:'+location);
    await action(page,'story:deliver');
    await choose(page,'check:wrong');
    assert.ok(!(await state(page)).codex.delivered,'Wrong answer incorrectly accepted');
    await choose(page,'deliver');
    await choose(page,'check:correct');
    assert.ok((await state(page)).codex.delivered,'Correct response not saved');
    await page.locator('#modal-close').click();
    await action(page,'go:village');
    await action(page,'story:conclude');
    assert.ok((await state(page)).codex.resolved,'Audience was not saved');
    await page.locator('#modal-close').click();
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#start-continue').click();
    assert.equal((await state(page)).codex.entrusted,key);
    assert.ok((await state(page)).codex.resolved);
    assert.ok((await state(page)).codex.found.includes('revealed'),'Previous collection lost');
    await action(page,'go:'+location);
    await action(page,'story:followup');
    assert.ok((await state(page)).codex.followup,'Followup not saved');
    assert.deepEqual(errs,[]);
  }catch(e){await page.screenshot({path:'tests/screenshots/'+key+'.png',fullPage:true}).catch(()=>{});throw e;}
  finally{await context.close();}
 });
}

await check('chapter III route, choice, Magdala clue and reload',async()=>{
 const initial=seed();initial.scene='yael';initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};initial.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'ch3:start');
  await page.locator('#modal-content [data-run="ch3:yael"]').click();
  await page.locator('#modal-content [data-run="ch3:consult"]').click();
  await page.locator('#modal-content [data-run="ch3:travel"]').click();
  assert.equal((await state(page)).scene,'road3');
  await action(page,'ch3:talk');
  assert.equal((await state(page)).chapter22.roadChoice,'talk');
  await page.locator('#modal-close').click();
  await action(page,'ch3:magdala');
  assert.equal((await state(page)).scene,'magdala3');
  await action(page,'ch3:observe');
  assert.ok((await state(page)).chapter22.observed);
  await page.locator('#modal-close').click();
  await action(page,'ch3:question');
  assert.equal((await state(page)).chapter22.clue,'question');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).scene,'magdala3');
  assert.equal((await state(page)).chapter22.clue,'question');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});

await check('chapter III Yael return and persistent resolution',async()=>{
 const initial=seed();initial.scene='yael';
 initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};
 initial.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
 initial.chapter22={stage:4,clue:'record',choices:{route:'consult'},roadChoice:'talk'};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'ch4:open');
  await page.locator('#modal-content [data-run="ch4:compare"]').click();
  await page.locator('#modal-content [data-run="ch4:listen"]').click();
  await page.locator('#modal-content [data-run="ch4:gather"]').click();
  assert.equal((await state(page)).chapter23.outcome,'gather');
  await page.locator('#modal-close').click();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).chapter23.finished,true);
  await action(page,'ch4:open');
  assert.match(await page.locator('#modal-title').innerText(),/Lo que queda pendiente/);
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});

await check('chapter 2.4 clues and Yael persistence',async()=>{
 const initial=seed();initial.scene='magdala3';
 initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};
 initial.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
 initial.chapter22={stage:4,clue:'record',choices:{route:'consult'},roadChoice:'talk'};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  for(const k of ['weights','origin','dates']){
   await action(page,'m24:'+k);
   await page.locator('#modal-close').click();
  }
  assert.equal((await state(page)).chapter24.clues.length,3);
  await action(page,'m24:compare');
  await page.locator('#modal-content [data-run="m24:theory:measures"]').click();
  assert.equal((await state(page)).chapter24.compared,true);
  await page.locator('#modal-content [data-run="m24:return"]').click();
  assert.equal((await state(page)).scene,'yael');
  await action(page,'m24:report');
  await page.locator('#modal-content [data-run="m24:honest"]').click();
  assert.equal((await state(page)).chapter24.reported,'honest');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).chapter24.reported,'honest');
  assert.equal((await state(page)).chapter24.clues.length,3);
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});


await check('2.5 responsive route, port hotspots and persistent discoveries',async()=>{
 for(const [width,height] of [[390,844],[800,1280]]){
  const initial=seed();initial.scene='road3';
  initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};
  initial.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
  initial.chapter22={stage:2,choices:{route:'consult'}};
  const {context,page,errs}=await pageAt(width,height,initial);
  try{
   await page.locator('#start-continue').click();
   await page.waitForFunction(()=>{const im=document.querySelector('#scene-art');return im?.complete&&im.naturalWidth===1672&&im.naturalHeight===941&&im.src.includes('assets/chapter23/road_galilee.webp');});
   assert.equal(await page.locator('#hotspot-layer [data-run="ch3:talk"]').count(),1);
   if(width<600){const h=await page.locator('#scene-stage').evaluate(el=>el.getBoundingClientRect().height);assert.ok(h<=width*.68&&h>=width*.54,'Panorama is cropped on narrow screens, height='+h);}
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/cinema25-road-'+width+'.png'});
   await action(page,'ch3:talk');
   await page.locator('#modal-close').click();
   await action(page,'ch3:magdala');
   await page.waitForFunction(()=>{const im=document.querySelector('#scene-art');return im?.complete&&im.naturalWidth===1672&&im.naturalHeight===941&&im.src.includes('assets/chapter23/magdala_port.webp');});
   assert.equal((await state(page)).scene,'magdala3');
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/cinema25-port-'+width+'.png'});
   assert.equal(await page.locator('#hotspot-layer [data-run="m24:weights"]').count(),1);
   await action(page,'m24:weights');
   await page.locator('#modal-close').click();
   assert.match(await page.locator('#scene-discovery').innerText(),/1 de 4/);
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#start-continue').click();
   assert.ok((await state(page)).chapter24.clues.includes('weights'));
   const dimensions=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));
   assert.ok(dimensions.page<=dimensions.screen+3,'horizontal overflow '+JSON.stringify(dimensions));
   assert.deepEqual(errs,[]);
   await page.screenshot({path:'tests/screenshots/cinema25-port-reloaded-'+width+'.png'});
  }finally{await context.close();}
 }
});
await check('2.5 arriving messenger uses illustration with fallback',async()=>{
 const initial=seed();initial.scene='yael';
 initial.codex={...initial.codex,entrusted:'mara',delivered:true,resolved:true};
 initial.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'ch3:start');
  assert.equal(await page.locator('#modal-content .cinema25-arrival img').count(),1);
  await page.waitForFunction(()=>{const im=document.querySelector('#modal-content .cinema25-arrival img');return im?.complete&&im.naturalWidth===1672&&im.naturalHeight===941&&im.src.includes('assets/chapter23/messenger_courtyard.webp');});
  await page.locator('#modal-content .cinema25-arrival').screenshot({path:'tests/screenshots/cinema25-messenger-390.png'});
  await page.locator('#modal-close').click();
  assert.ok(await page.locator('#modal-root').isHidden());
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});


// SENDAS 2.6 — browser-level regression. Uses original image decoding, not a fallback.
const seed26=()=>{
 const s=seed();s.scene='magdala3';s.codex={...s.codex,entrusted:'mara',delivered:true,resolved:true};
 s.visited=[...s.visited,'yael','road3','magdala3'];
 s.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
 s.chapter22={stage:4,clue:'record',choices:{route:'consult'},roadChoice:'talk'};
 s.chapter24={clues:['weights','origin','dates'],compared:true,theory:'measures',reported:'honest'};
 return s;
};
const m26=(page,id)=>page.locator('#modal-content [data-sendas-ui="'+id+'"]').click({timeout:12000});
async function real26(page,name,w,h){
 await page.waitForFunction(fragment=>{const im=document.querySelector('#scene-art');return im?.complete&&im.naturalWidth===1536&&im.src.includes('assets/chapter26/'+fragment+'.webp');},name,{timeout:15000});
 const hActual=await page.locator('#scene-art').evaluate(img=>img.naturalHeight);
 assert.equal(hActual,name==='almacen_magdala'?506:508);
 await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas26-'+name+'-'+w+'.png'});
 const overflow=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:window.innerWidth}));
 assert.ok(overflow.w<=overflow.v+3,'Horizontal overflow '+JSON.stringify(overflow));
 if(w===390){const hScene=await page.locator('#scene-stage').evaluate(el=>el.getBoundingClientRect().height);assert.ok(hScene>=200&&hScene<=270,'Unexpected scene height '+hScene);}
}
for(const [w,h] of [[390,844],[800,1280]]){
 await check('2.6 original cinematic art and interactive witness investigation '+w+'x'+h,async()=>{
  const initial=seed26();const {context,page,errs}=await pageAt(w,h,initial);
  try{
   await page.locator('#start-continue').click();
   await action(page,'m26:enter');assert.equal((await state(page)).scene,'almacen26');
   await real26(page,'almacen_magdala',w,h);
   await action(page,'m26:neria');await m26(page,'neria:deliveries');
   assert.ok((await state(page)).chapter26.clues.includes('neria'));
   await m26(page,'neria:open');
   assert.ok(await page.locator('#modal-content [data-sendas-ui="neria:deliveries"]').evaluate(el=>el.classList.contains('sendas-ui-seen')),'Neria topic not gray');
   await m26(page,'neria:listen');
   assert.equal((await state(page)).chapter26.stance.neria,'neria:listen');
   await page.locator('#modal-close').click();
   await action(page,'m26:asaf');await m26(page,'asaf:shifts');
   assert.ok((await state(page)).chapter26.clues.includes('asaf'));
   await page.locator('#modal-close').click();
   await action(page,'m26:table');assert.equal((await state(page)).scene,'mesa26');
   await real26(page,'voces_magdala',w,h);
   await action(page,'m26:weights');
   assert.ok((await state(page)).chapter26.clues.includes('weights'));
   await page.locator('#modal-close').click();
   assert.match(await page.locator('#scene-discovery').innerText(),/3 de 4/);
   await action(page,'m26:compare');await m26(page,'theory:deliveries');
   assert.equal((await state(page)).chapter26.theory,'deliveries');
   await m26(page,'return');assert.equal((await state(page)).scene,'yael');
   await action(page,'m26:report');
   await page.locator('#modal-content').screenshot({path:'tests/screenshots/sendas26-yael-'+w+'.png'});
   await m26(page,'ending:transparent');
   assert.equal((await state(page)).chapter26.ending,'transparent');
   await page.locator('#modal-close').click();
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#start-continue').click();
   assert.equal((await state(page)).chapter26.ending,'transparent');
   await action(page,'m26:report');
   assert.match(await page.locator('#modal-title').innerText(),/Un relato que no se borra/);
   await page.locator('#modal-close').click();
   await page.evaluate(()=>window.SENDAS_GAME_API.navigate('almacen26'));
   await action(page,'m26:neria');
   assert.ok(await page.locator('#modal-content [data-sendas-ui="neria:deliveries"]').evaluate(el=>el.classList.contains('sendas-ui-seen')),'dialogue state lost after reload');
   assert.deepEqual(errs,[]);
   assert.equal(await page.locator('#btn-scene-zoom').count(),0);
  }finally{await context.close();}
 });
}
await check('2.6 routes inaccessible before a completed Magdala journey',async()=>{
 const initial=seed26();initial.chapter22.stage=2;
 const {context,page,errs}=await pageAt(390,844,initial);
 try{await page.locator('#start-continue').click();assert.equal(await page.locator('#actions [data-run="m26:enter"]').count(),0);await page.evaluate(()=>window.SENDAS_CHAPTER26.run('enter'));assert.equal((await state(page)).scene,'magdala3');assert.deepEqual(errs,[]);}finally{await context.close();}
});
await check('2.6 evidence gate cannot be bypassed with optional moral answers',async()=>{
 const initial=seed26();initial.scene='almacen26';initial.chapter26={clues:['neria','consent','respect'],topics:[],stance:{},theory:null};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await action(page,'m26:compare');
  assert.match(await page.locator('#modal-title').innerText(),/La cuenta aún no habla/);
  await page.evaluate(()=>window.SENDAS_CHAPTER26.run('theory:deliveries'));
  assert.ok(!(await state(page)).chapter26.theory);
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
for(const ending of ['privacy','accuse']){
 await check('2.6 Yael alternative '+ending+' is persistent and irreversible',async()=>{
  const initial=seed26();initial.scene='yael';initial.chapter26={clues:['neria','asaf','weights'],topics:['neria:deliveries','asaf:shifts'],stance:{},theory:'measures',ending:null};
  const {context,page,errs}=await pageAt(390,844,initial);
  try{
   await page.locator('#start-continue').click();
   await action(page,'m26:report');await m26(page,'ending:'+ending);
   assert.equal((await state(page)).chapter26.ending,ending);
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#start-continue').click();
   assert.equal((await state(page)).chapter26.ending,ending);
   await action(page,'m26:report');assert.equal(await page.locator('#modal-content [data-sendas-ui="ending:transparent"]').count(),0);
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}
await check('2.6 new chapter scenes work offline after PWA cache installation',async()=>{
 const initial=seed26();const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:20000});
  await action(page,'m26:enter');
  await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1536);
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1536);
  assert.equal((await state(page)).scene,'almacen26');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});


// SENDAS 2.7 — consequence paths using the real shared UI and save.
for(const previous of ['transparent','privacy','accuse']){
 await check('2.7 reencounters persist after '+previous,async()=>{
  const initial=seed26(); initial.scene='almacen26';initial.chapter26={clues:['neria','asaf','weights'],topics:[],stance:{},theory:'measures',ending:previous};
  const {context,page,errs}=await pageAt(390,844,initial);
  try{
   await page.locator('#start-continue').click();
   await action(page,'m27:neria');
   assert.ok((await state(page)).chapter27.visits.neria);
   await page.locator('#modal-close').click();
   await action(page,'m27:asaf');
   assert.ok((await state(page)).chapter27.visits.asaf);
   await page.locator('#modal-close').click();
   await page.evaluate(()=>window.SENDAS_GAME_API.navigate('yael'));
   await action(page,'m27:yael');
   assert.ok((await state(page)).chapter27.visits.yael);
   await page.locator('#modal-close').click();
   await action(page,'m27:resolve');
   const choice=previous==='accuse'?'reconcile':'records';
   await page.locator('#modal-content [data-sendas-ui="'+choice+'"]').click();
   assert.equal((await state(page)).chapter27.choice,choice);
   await page.locator('#modal-close').click();
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#start-continue').click();
   assert.equal((await state(page)).chapter27.choice,choice);
   assert.equal((await state(page)).chapter26.ending,previous);
   await action(page,'m27:resolve');
   assert.match(await page.locator('#modal-title').innerText(),/confianza tiene memoria/);
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}


// 2.8: real Chromium original backgrounds, shared dialogue, three consequences and reload
for(const [outcome,choice] of [['transparent','records'],['privacy','patient'],['accuse','reconcile']]){
 await check('2.8 original scenes, evidence, final choice and reload '+outcome,async()=>{
  const initial=seed26();initial.scene='yael';initial.chapter26={clues:['neria','asaf','weights'],topics:[],stance:{},theory:'measures',ending:outcome};initial.chapter27={visits:{neria:true,asaf:true,yael:true},choice};
  const {context,page,errs}=await pageAt(390,844,initial);
  try{
   await page.locator('#start-continue').click();await action(page,'m28:begin');
   assert.equal((await state(page)).scene,'orilla28');
   await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1600&&document.querySelector('#scene-art')?.src.includes('orilla_amanecer'));
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas28-orilla-'+outcome+'.png'});
   await action(page,'m28:rope');await page.locator('#modal-close').click();
   await action(page,'m28:dialogue');await page.locator('#modal-close').click();
   await action(page,'m28:turn');await page.locator('#modal-close').click();
   await action(page,'go:refugio28');
   await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1600&&document.querySelector('#scene-art')?.src.includes('refugio_reparto'));
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas28-refugio-'+outcome+'.png'});
   await action(page,'m28:voice');await page.locator('#modal-close').click();
   await action(page,'m28:compare');await page.locator('#modal-content [data-sendas-ui="secure"]').click();
   assert.equal((await state(page)).chapter28.plan,'secure');
   await page.locator('#modal-close').click();await page.evaluate(()=>window.SENDAS_GAME_API.navigate('yael'));
   await action(page,'m28:finale');assert.equal((await state(page)).chapter28.closing,'secure');
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#start-continue').click();
   assert.equal((await state(page)).chapter28.closing,'secure');assert.equal((await state(page)).chapter27.choice,choice);
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}


// SENDAS 2.9 — three days, original cinematic assets, limited actions and irreversible consequences.
for(const [previous,priorChoice,priorPlan,dayOne,dayTwo,dayThree] of [
 ['transparent','records','secure','verify','gather','notes'],
 ['privacy','patient','council','family','quiet','offer'],
 ['accuse','reconcile','record','mend','wait','invite']
]){
 await check('2.9 three-day campaign after '+previous,async()=>{
  const initial=seed26();initial.scene='yael';initial.chapter26={ending:previous,clues:['neria','asaf','weights'],theory:'measures'};
  initial.chapter27={choice:priorChoice,visits:{neria:true,asaf:true,yael:true}};
  initial.chapter28={plan:priorPlan,closing:priorPlan,evidence:['rope','turn','voice'],spoke:true};
  const {context,page,errs}=await pageAt(390,844,initial);
  const pick=(value)=>page.locator('#modal-content [data-sendas-ui="'+value+'"]').click({timeout:10000});
  const waitArt=async(file)=>{await page.waitForFunction(file=>{const im=document.querySelector('#scene-art');return im?.complete&&im.naturalWidth===1672&&im.naturalHeight===941&&im.src.includes('/chapter29/'+file+'.webp')&&im.dataset.artSource==='cinema29';},file);};
  try{
   await page.locator('#start-continue').click();
   assert.equal(await page.locator('#actions [data-run="m29:start"]').count(),1);
   await action(page,'m29:start');assert.equal((await state(page)).scene,'patio29');await waitArt('patio_acuerdos');
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas29-day1-'+previous+'.png'});
   await action(page,'m29:deliberate');assert.ok(!(await state(page)).chapter29.first);await page.locator('#modal-close').click();
   await action(page,'m29:hear:yael');await page.locator('#modal-close').click();
   await action(page,'m29:hear:neria');await page.locator('#modal-close').click();
   await action(page,'m29:deliberate');await pick('pick:first:'+dayOne);
   assert.equal((await state(page)).chapter29.first,dayOne);
   await pick('advance:2');assert.equal((await state(page)).scene,'consejo29');await waitArt('consejo_lamparas');
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas29-day2-'+previous+'.png'});
   await action(page,'m29:hear:simeon');await page.locator('#modal-close').click();
   await action(page,'m29:hear:jonas');await page.locator('#modal-close').click();
   await action(page,'m29:deliberate');await pick('pick:second:'+dayTwo);
   assert.equal((await state(page)).chapter29.second,dayTwo);
   await pick('advance:3');assert.equal((await state(page)).scene,'orilla29');await waitArt('orilla_tercer_dia');
   await page.locator('#scene-stage').screenshot({path:'tests/screenshots/sendas29-day3-'+previous+'.png'});
   await action(page,'m29:hear:asaf');await page.locator('#modal-close').click();
   await action(page,'m29:hear:yael');await page.locator('#modal-close').click();
   await action(page,'m29:deliberate');await pick('pick:final:'+dayThree);
   assert.equal((await state(page)).chapter29.final,dayThree);
   await page.locator('#modal-close').click();
   await page.reload({waitUntil:'domcontentloaded'});await page.locator('#start-continue').click();await waitArt('orilla_tercer_dia');
   const restored=await state(page);
   assert.equal(restored.chapter29.first,dayOne);assert.equal(restored.chapter29.second,dayTwo);assert.equal(restored.chapter29.final,dayThree);
   assert.equal(restored.chapter26.ending,previous);assert.equal(restored.chapter28.plan,priorPlan);
   assert.match(await page.locator('#chapter-progress').innerText(),/3 \/ 3/);
   await page.evaluate(()=>window.SENDAS_GAME_API.navigate('patio29'));assert.equal((await state(page)).scene,'orilla29');
   await action(page,'m29:status');assert.ok(await page.locator('#modal-content .m29-effect').count()===3);
   await page.locator('#modal-close').click();
   const w=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));assert.ok(w.page<=w.screen+3,'Horizontal overflow '+JSON.stringify(w));
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 });
}
await check('2.9 day-two scene and new art remain available offline',async()=>{
 const initial=seed26();initial.scene='consejo29';initial.chapter26={ending:'transparent'};
 initial.chapter27={choice:'records'};initial.chapter28={plan:'record',closing:'record'};
 initial.chapter29={started:true,day:2,first:'verify',heard:{patio29:['yael','neria'],consejo29:[],orilla29:[]}};
 const {context,page,errs}=await pageAt(390,844,initial);
 try{
  await page.locator('#start-continue').click();await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1672);
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:20000});
  const keys=await page.evaluate(async()=>{const c=await caches.open('sendas-campana-integrada-v3.0.0');return (await c.keys()).map(r=>new URL(r.url).pathname)});
  assert.ok(keys.some(p=>p.endsWith('/assets/chapter29/consejo_lamparas.webp')),'New WebP not in PWA cache');
  await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.locator('#start-continue').click();
  await page.waitForFunction(()=>document.querySelector('#scene-art')?.naturalWidth===1672);
  assert.equal((await state(page)).chapter29.day,2);assert.deepEqual(errs,[]);
 }finally{await context.close();}
});


await check('3.0 continuity opens from each chapter and preserves save',async()=>{
 for(const scene of ['home','yael','road3','magdala3','almacen26','orilla28','patio29']){
  const saved=seed();saved.scene=scene;saved.visited=[...new Set([...(saved.visited||[]),scene,'yael','road3','magdala3','almacen26','orilla28'])];
  saved.codex={...saved.codex,entrusted:'mara',delivered:true,resolved:true};
  saved.chapter18={stage:3,decision:'consult',choices:['listen'],notes:['provisiones']};
  saved.chapter22={stage:4,clue:'record',choices:{route:'consult'},roadChoice:'talk'};
  saved.chapter26={ending:'transparent',clues:['neria','asaf','weights']};
  saved.chapter27={choice:'records',visits:{neria:true,asaf:true}};
  saved.chapter28={plan:'record',closing:'share',evidence:['rope','load','turn','voice']};
  saved.chapter29={started:true,day:1,heard:{patio29:[],consejo29:[],orilla29:[]}};
  const {context,page,errs}=await pageAt(390,844,saved);
  try{
   await page.locator('#start-continue').click();
   assert.equal(await page.locator('#actions [data-run="continuity:open"]').count(),1);
   const before=await state(page);
   await action(page,'continuity:open');
   assert.equal(await page.locator('.continuity-step').count(),7);
   assert.equal(await page.locator('.continuity-consequence').count(),4);
   assert.match(await page.locator('#modal-title').innerText(),/Un solo camino/);
   await page.locator('#modal-close').click();
   const after=await state(page);
   assert.equal(after.chapter29.day,before.chapter29.day);
   assert.equal(after.chapter27.choice,before.chapter27.choice);
   assert.deepEqual(errs,[]);
  }finally{await context.close();}
 }
});
await check('3.0 continuity never unlocks a future scene or rewrites a save',async()=>{
 const saved=seed();saved.scene='home';
 const {context,page,errs}=await pageAt(360,640,saved);
 try{
  await page.locator('#start-continue').click();
  await action(page,'continuity:open');
  const info=await page.evaluate(()=>window.SENDAS_CAMPAIGN30.graph(window.SENDAS_READONLY.getState()));
  assert.equal(info.active,0);assert.equal(info.target,'village');
  assert.ok(!info.stages[6].complete);
  await page.locator('#modal-content [data-run="continuity:resume"]').click();
  assert.equal((await state(page)).scene,'village');
  assert.ok(!(await state(page)).chapter29?.final);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start-continue').click();
  assert.equal((await state(page)).scene,'village');
  assert.deepEqual(errs,[]);
 }finally{await context.close();}
});
await browser.close();
console.log('RESULT',tests-failures,'/',tests,'passing');
if(failures)process.exit(1);
