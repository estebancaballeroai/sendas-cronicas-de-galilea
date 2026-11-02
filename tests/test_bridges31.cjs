const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
let pass=0;
function simulator(seed){const s=JSON.parse(JSON.stringify(seed)),events=[],ui={};let panel='';const ctx={window:{},document:{}};
ctx.window.SENDAS_READONLY={getState:()=>JSON.parse(JSON.stringify(s))};
ctx.window.SENDAS_GAME_API={change(fn){fn(s);return JSON.parse(JSON.stringify(s));},remember(msg){s.logs=s.logs||[];if(!s.logs.includes(msg))s.logs.push(msg);},refresh(){},navigate(id){s.scene=id;events.push(id);},closePanel(){panel='';}};
ctx.window.SENDAS_UI={register(name,fn,track){ui[name]={fn,track};},show(a){panel=a.body;}};
ctx.window.SENDAS_CHAPTER29={run(a){if(a==='start')s.chapter29={...s.chapter29,started:true,day:1};}};
vm.runInNewContext(fs.readFileSync(__dirname+'/../bridges31.js','utf8'),ctx);
return {b:ctx.window.SENDAS_BRIDGES31,state:s,events,ui,get panel(){return panel;}};}
function sample(){return {version:1,scene:'village',codex:{delivered:true,entrusted:'simeon'},chapter18:{},chapter22:{stage:0},chapter26:{},chapter27:{},chapter28:{},chapter29:{},bridges31:{fresh:true,heard:{},choices:{},entered:{}}};}
function check(name,fn){fn();pass++;console.log('PASS',name);}
check('new and legacy saves have different, safe access',()=>{
let x=simulator(sample());assert.equal(x.b.next(),'umbral31');assert.equal(x.b.redirect('yael'),'umbral31');
let old=sample();delete old.bridges31;let y=simulator(old);assert.equal(y.b.redirect('yael'),null);assert.equal(y.b.eligible('umbral31'),true);
});
const cases=[
['umbral31',s=>{s.scene='umbral31';},'yael',null],
['partida31',s=>{s.scene='partida31';s.chapter18={decision:'consult'};s.chapter22={stage:2};},'road3',null],
['regreso31',s=>{s.scene='regreso31';s.chapter18={decision:'consult'};s.chapter22={stage:4,roadChoice:'talk'};s.chapter26={ending:'transparent'};s.chapter27={choice:'reconcile'};},'yael',null],
['velada31',s=>{s.scene='velada31';s.chapter18={decision:'consult'};s.chapter22={stage:4,roadChoice:'talk'};s.chapter26={ending:'privacy'};s.chapter27={choice:'records'};s.chapter28={plan:'record',closing:'record'};},'yael',true],
['despedida31',s=>{s.scene='despedida31';s.chapter29={started:true,final:'notes'};},'village',null]
];
for(const [id,prep,destination,started] of cases)check('two witnesses, one choice and persistence: '+id,()=>{
 const s=sample();prep(s);const x=simulator(s),b=x.b;assert.equal(b.eligible(id),true);assert.ok(b.state().heard[id].length===0);
 b.run('decide');assert.equal(b.state().choices[id],null,'must block decision without witnesses');
 const people={umbral31:['simeon','mara'],partida31:['yael','eliab'],regreso31:['neria','asaf'],velada31:['irit','jonas'],despedida31:['eliab','yael']}[id];
 for(const p of people)b.run('talk:'+p);
 assert.equal(b.state().heard[id].length,2);let first={umbral31:'escuchar',partida31:'reserva',regreso31:'reconocer',velada31:'ausentes',despedida31:'quedar'}[id];
 b.run('choose:'+first);assert.equal(b.state().choices[id],first);
 b.run('choose:'+(id==='umbral31'?'preguntar':id==='partida31'?'copia':id==='regreso31'?'hechos':id==='velada31'?'reunion':'volver'));
 assert.equal(b.state().choices[id],first,'irreversible');b.run('exit');assert.equal(x.state.scene,destination);
 if(started)assert.equal(x.state.chapter29.started,true);
 let reload=simulator(x.state);assert.equal(reload.b.state().choices[id],first);assert.equal(reload.b.state().heard[id].length,2);
});
check('the next bridge depends on history and no gate is bypassed',()=>{
 const s=sample();s.chapter18={decision:'consult'};s.chapter22={stage:2};let x=simulator(s);assert.equal(x.b.next(),'partida31');
 s.chapter22.roadChoice='water';s.chapter26={ending:'privacy'};s.chapter27={choice:'patient'};x=simulator(s);assert.equal(x.b.next(),'regreso31');
 s.chapter28={opened:true,plan:'secure',closing:'secure'};x=simulator(s);assert.equal(x.b.next(),'velada31');
 s.chapter29={started:true,final:'notes'};x=simulator(s);assert.equal(x.b.next(),null);
});
check('completed old episodes cannot receive retroactive bridge choices',()=>{
 let s=sample();s.scene='umbral31';s.chapter18={decision:'impose'};let x=simulator(s);x.b.run('talk:simeon');x.b.run('talk:mara');x.b.run('choose:escuchar');assert.equal(x.b.state().choices.umbral31,null);
});
check('existing chapter 18/26/27/28/29 decisions stay untouched',()=>{
 let s=sample();s.scene='despedida31';s.chapter29={final:'invite',first:'mend',second:'quiet',started:true};s.chapter28={plan:'council',closing:'council'};s.chapter26={ending:'accuse'};s.chapter27={choice:'patient'};s.chapter18={decision:'impose'};const before=JSON.stringify({a:s.chapter18,b:s.chapter26,c:s.chapter27,d:s.chapter28,e:s.chapter29});let x=simulator(s);x.b.run('talk:eliab');x.b.run('talk:yael');x.b.run('choose:volver');assert.equal(JSON.stringify({a:s.chapter18,b:s.chapter26,c:s.chapter27,d:s.chapter28,e:s.chapter29}),before);
});
console.log('SENDAS 3.1 bridge model:',pass,'/',pass,'PASS');
