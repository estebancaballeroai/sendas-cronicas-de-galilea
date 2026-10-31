'use strict';
/* Deterministic Monte Carlo compatibility/replay simulation for SENDAS 2.0. */
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.resolve(__dirname,'..');const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'core20.js'),'utf8'),context);
const C=context.window.SENDAS_CORE;
let seed=18201821;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const witnesses=['mara','jonas','simeon'];const topics=['listen','grain','account','measure','promise','commit','eliab'];
let total=0;
for(let i=0;i<1200;i++){
 const w=witnesses[Math.floor(random()*3)];
 const save={version:1,scene:'village',visited:['home','village'],flags:{},inv:{pan:1},logs:['Amanece'],codex:{entrusted:w,delivered:true},dialogHistory:{},actionHistory:{},chapter18:{stage:1,choices:[],notes:[]}};
 for(let j=0;j<topics.length;j++)if(random()>.45)save.chapter18.choices.push(topics[j]);
 const old=JSON.parse(JSON.stringify(save));C.migrate(save);
 assert.equal(save.codex.entrusted,w);
 for(const topic of old.chapter18.choices)assert.equal(C.seen(save,'dialog:chapter2:family','ch2:topic:'+topic),true);
 const newTopic=topics[Math.floor(random()*topics.length)];C.mark(save,'dialog:chapter2:family','ch2:topic:'+newTopic);
 const scene=['home','village','dock','market'][Math.floor(random()*4)];C.mark(save,'action:'+scene,'go:village');
 const copy=JSON.parse(JSON.stringify(save));C.migrate(copy);
 assert.equal(C.seen(copy,'dialog:chapter2:family','ch2:topic:'+newTopic),true);
 assert.equal(C.seen(copy,'action:'+scene,'go:village'),true);
 assert.deepEqual(copy.inv,old.inv);assert.deepEqual(copy.flags,old.flags);
 assert.equal(copy.version,1);assert.equal(copy.saveSchema,2);
 assert.equal(copy.codex.delivered,true);
 total++;
}
console.log('PASS deterministic simulated save/reload branches: '+total+'/'+total);