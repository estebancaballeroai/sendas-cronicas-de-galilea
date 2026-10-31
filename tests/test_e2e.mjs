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
  if(seed)await context.addInitScript((s)=>localStorage.setItem('sendas_cronicas_ilustrada_1',JSON.stringify(s)),seed);
  const page=await context.newPage();
  const errs=[];page.on('pageerror',e=>errs.push(String(e)));
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  return {context,page,errs};
}
function seed(){
  return {version:1,scene:'spring',inv:{agua:1,pan:1,moneda:1},flags:{netDone:true,iritDone:true,simeonPuzzle:true,springSolved:true},choices:{},visited:['home','village','market','dock','irit','herbs','simeon','spring'],logs:['El pergamino fue hallado junto al agua.'],time:3,fontScale:1,completed:false,codex:{found:['market','dock','simeon','spring','revealed'],solved:true}};
}
const choose=(page,action)=>page.locator('[data-ledger="'+action+'"]').last().click({timeout:10000});
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
    assert.equal((await state(page)).codex.entrusted,key);
    await page.locator('.ledger16-sheet .codex-close').click();
    await action(page,'go:village');
    await action(page,'go:'+location);
    await action(page,'story:deliver');
    await choose(page,'check:wrong');
    assert.ok(!(await state(page)).codex.delivered,'Wrong answer incorrectly accepted');
    await choose(page,'deliver');
    await choose(page,'check:correct');
    assert.ok((await state(page)).codex.delivered,'Correct response not saved');
    await page.locator('.ledger16-sheet .codex-close').click();
    await action(page,'go:village');
    await action(page,'story:conclude');
    assert.ok((await state(page)).codex.resolved,'Audience was not saved');
    await page.locator('.ledger16-sheet .codex-close').click();
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
await browser.close();
console.log('RESULT',tests-failures,'/',tests,'passing');
if(failures)process.exit(1);
