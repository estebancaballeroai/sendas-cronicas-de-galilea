'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
let state=null, lastPanel=null, navigations=[];let passed=0;
const json=x=>JSON.parse(JSON.stringify(x));
const ui={register(n,handler,track){assert.equal(n,'magdala26');ui.handler=handler;ui.track=track;},show(x){lastPanel=x;}};
const host={SENDAS_UI:ui,SENDAS_CHAPTER_API:{get:()=>json(state)},SENDAS_GAME_API:{
 change(fn){fn(state);return json(state);},remember(text){if(!state.logs.includes(text))state.logs.push(text);},
 navigate(scene){state.scene=scene;navigations.push(scene);},refresh(){},closePanel(){}
}};
const c={window:host};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'chapter26.js'),'utf8'),c);
const mod=host.SENDAS_CHAPTER26;
function eq(name,fn){fn();passed++;console.log('PASS',name);}
function seed(stage=4){state={version:1,scene:'magdala3',chapter22:{stage},chapter24:{clues:['weights'],theory:'measures',compared:true},chapter18:{stage:3},logs:['Una historia anterior'],inv:{agua:1},flags:{netDone:true},codex:{resolved:true},visited:['home','magdala3']};lastPanel=null;navigations=[];}
eq('2.6 API, 2 scenes and action providers',()=>{seed();assert.equal(mod.version,'2.6.0');assert.ok(mod.actions('magdala3').some(x=>x.id==='m26:enter'));assert.equal(mod.hotspots('almacen26').length,3);assert.equal(mod.hotspots('mesa26').length,3);});
eq('cannot unlock the warehouse until historical chapter III stage 3',()=>{seed(2);assert.equal(mod.unlocked(),false);mod.run('enter');assert.equal(navigations.length,0);assert.equal(mod.actions('magdala3').length,0);});
eq('chapter26 old save defaults do not overwrite earlier chapter',()=>{seed();const original=json(state.chapter24);assert.equal(mod.data().clues.length,0);mod.run('enter');assert.equal(state.scene,'almacen26');assert.deepEqual(state.chapter24,original);assert.equal(state.version,1);});
eq('witness questions, ethical stances, and evidence are persisted once',()=>{
 seed();mod.run('enter');mod.run('neria:deliveries');mod.run('neria:listen');mod.run('asaf:shifts');mod.run('asaf:listen');
 assert.equal(state.chapter26.stance.neria,'neria:listen');assert.equal(state.chapter26.stance.asaf,'asaf:listen');
 assert.ok(state.chapter26.clues.includes('neria'));assert.ok(state.chapter26.clues.includes('asaf'));
 const n=state.logs.length;mod.run('neria:deliveries');assert.equal(state.logs.length,n);
 assert.ok(!state.chapter26.theory);
});
eq('theory gate requires 3 primary evidence units including 1 witness',()=>{
 seed();mod.run('enter');mod.run('neria:listen');mod.run('asaf:listen');mod.run('theory:deliveries');assert.equal(mod.ready(),false);assert.ok(!state.chapter26.theory);
 mod.run('neria:deliveries');mod.run('theory:deliveries');assert.equal(mod.ready(),false);assert.ok(!state.chapter26.theory);
 state.scene='mesa26';mod.run('weights');assert.equal(mod.ready(),false);state.scene='almacen26';mod.run('asaf:shifts');state.scene='mesa26';mod.run('theory:deliveries');assert.equal(mod.ready(),true);assert.equal(state.chapter26.theory,'deliveries');
});
for(const hyp of ['deliveries','measures','accusation'])eq('three nuanced hypotheses: '+hyp,()=>{seed();mod.run('enter');mod.run('neria:deliveries');mod.run('asaf:shifts');state.scene='mesa26';mod.run('marks');assert.equal(mod.ready(),true);mod.run('theory:'+hyp);assert.equal(state.chapter26.theory,hyp);});
for(const ending of ['transparent','privacy','accuse'])eq('three persistent Yael choices: '+ending,()=>{
 seed();mod.run('enter');mod.run('neria:deliveries');mod.run('asaf:shifts');state.scene='mesa26';mod.run('marks');mod.run('theory:measures');mod.run('return');assert.equal(state.scene,'yael');mod.run('report');assert.equal(lastPanel.title,'Lo que Yael quiere saber');mod.run('ending:'+ending);assert.equal(state.chapter26.ending,ending);assert.equal(state.chapter26.finalVisit,true);const serialized=json(state);mod.run('ending:privacy');assert.deepEqual(json(state),serialized);
});
eq('tracked gray choices are per NPC and exclude navigation',()=>{seed();assert.ok(ui.track('neria:listen'));assert.ok(ui.track('asaf:shifts'));assert.ok(!ui.track('close'));assert.ok(!ui.track('return'));});
for(let i=0;i<240;i++){
 const end=['transparent','privacy','accuse'][i%3],hyp=['deliveries','measures','accusation'][i%3];seed();mod.run('enter');mod.run('neria:deliveries');mod.run('asaf:shifts');state.scene='mesa26';mod.run('weights');mod.run('theory:'+hyp);mod.run('return');mod.run('ending:'+end);const copy=json(state);assert.equal(copy.chapter26.ending,end);assert.equal(copy.chapter26.theory,hyp);assert.ok(copy.chapter24.compared);assert.equal(copy.version,1);
}
console.log('SENDAS 2.6 chapter narrative/state tests: '+passed+'/'+passed+' PASS; 240/240 branch/save simulations PASS');
