const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('chapter29.js','utf8');
const days=['patio29','consejo29','orilla29'];
function harness(previous='transparent',oldChoice='records',oldPlan='secure',source){
 let s=source?structuredClone(source):{
  version:1,scene:'yael',chapter26:{ending:previous},chapter27:{choice:oldChoice},chapter28:{plan:oldPlan,closing:oldPlan},
  logs:['La familia guarda sus notas.'],visited:['yael'],flags:{},inv:{}
 };
 let panels=[];
 const host={SENDAS_UI:{register(name,run){assert.equal(name,'tresdias29');host.dispatch=run},show(data){panels.push(data)}},
 SENDAS_CHAPTER_API:{get(){return structuredClone(s)}},
 SENDAS_GAME_API:{change(fn){fn(s);},remember(msg){if(!s.logs.includes(msg))s.logs.push(msg)},refresh(){},closePanel(){},navigate(id){s.scene=id;if(!s.visited.includes(id))s.visited.push(id);}}};
 vm.runInNewContext(code,{window:host});
 return{host,api:host.SENDAS_CHAPTER29,s,panels};
}
const allFirst=['verify','mend','family'],allSecond=['gather','quiet','wait'],allFinal=['notes','offer','invite'];
let scenarios=0,replayAttempts=0;
for(const ending of ['transparent','privacy','accuse']){
 for(const first of allFirst)for(const second of allSecond)for(const final of allFinal){
  const p=harness(ending,ending==='accuse'?'reconcile':'records','secure'),a=p.api,s=p.s;
  assert.equal(a.version,'2.9.0');assert.equal(a.unlocked(),true);
  assert.equal(a.canEnter('patio29'),false);
  a.run('start');assert.equal(s.scene,'patio29');assert.equal(a.currentScene(),'patio29');
  assert.equal(a.canEnter('consejo29'),false);
  a.run('pick:first:'+first);assert.equal(s.chapter29.first,undefined,'Must hear before deciding');
  a.run('hear:yael');a.run('hear:neria');a.run('hear:yael');
  assert.equal(s.chapter29.heard.patio29.length,2);
  a.run('pick:first:'+first);assert.equal(s.chapter29.first,first);
  a.run('pick:first:'+allFirst.find(x=>x!==first));assert.equal(s.chapter29.first,first);
  a.run('advance:3');assert.equal(s.chapter29.day,1,'Skipping a day is forbidden');
  a.run('advance:2');assert.equal(s.scene,'consejo29');assert.equal(s.chapter29.day,2);
  a.run('pick:second:'+second);assert.equal(s.chapter29.second,undefined);
  a.run('hear:simeon');a.run('hear:jonas');
  a.run('pick:second:'+second);assert.equal(s.chapter29.second,second);
  a.run('pick:second:'+allSecond.find(x=>x!==second));assert.equal(s.chapter29.second,second);
  a.run('advance:3');assert.equal(s.scene,'orilla29');assert.equal(s.chapter29.day,3);
  a.run('hear:asaf');a.run('hear:yael');
  a.run('pick:final:'+final);assert.equal(s.chapter29.final,final);
  a.run('pick:final:'+allFinal.find(x=>x!==final));assert.equal(s.chapter29.final,final);
  assert.equal(a.objective().complete,true);
  assert.ok(a.status('orilla29').includes('3'));
  assert.ok(a.narration('orilla29').length>300);
  assert.equal(a.actions('orilla29').some(x=>x.id==='m29:deliberate'),true);
  assert.equal(a.canEnter('patio29'),false,'No time travel to first day');
  assert.ok(a.statusLines().every(x=>x.label&&x.value));
  assert.equal(s.chapter26.ending,ending);assert.equal(s.chapter28.plan,'secure');
  const length=s.logs.length;
  a.run('start');a.run('advance:2');a.run('advance:3');a.run('pick:first:family');
  assert.equal(s.logs.length,length,'No duplicate journal entries for old decisions');
  const saved=structuredClone(s);const reloaded=harness(ending,'records','secure',saved);
  assert.equal(reloaded.api.state().final,final);
  assert.equal(reloaded.api.state().second,second);
  assert.equal(reloaded.api.canEnter('orilla29'),true);
  scenarios++;
  for(let i=0;i<8;i++){
    reloaded.api.run('pick:final:notes');reloaded.api.run('advance:2');reloaded.api.run('advance:3');replayAttempts++;
  }
  assert.equal(reloaded.api.state().final,final);
 }
}
const blocked=harness();blocked.s.chapter28.closing=null;
assert.equal(blocked.api.unlocked(),false);blocked.api.run('start');assert.equal(blocked.s.chapter29,undefined);
const missing=harness();missing.s.chapter27.choice=null;assert.equal(missing.api.unlocked(),false);
const old=harness();assert.equal(old.api.objective().started,false);assert.equal(old.api.state().day,1);
const malformed=harness();malformed.s.chapter29={started:true,day:3,heard:{},first:null,second:'gather',final:'notes'};
assert.equal(malformed.api.state().day,1,'Malformed imported save cannot bypass the first day');
assert.equal(malformed.api.state().final,null);
console.log('SENDAS 2.9: '+scenarios+'/'+scenarios+' complete three-day routes, '+replayAttempts+' blocked overwrites and save/reload checks PASS');
