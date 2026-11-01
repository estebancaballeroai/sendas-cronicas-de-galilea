const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('chapter23.js','utf8');
let count=0;
for(const ending of ['ask','gather','leave']){
 let s={scene:'yael',chapter22:{stage:4,clue:'record',choices:{route:'consult'}},chapter23:{},logs:[]};
 let last='';
 const game={
   openPanel:(title,body)=>{last=title+' '+body;},
   closePanel:()=>{},
   change:fn=>{fn(s);return structuredClone(s);},
   remember:t=>{if(!s.logs.includes(t))s.logs.push(t);},
   refresh:()=>{}
 };
 const window={SENDAS_GAME_API:game,SENDAS_CHAPTER_API:{get:()=>structuredClone(s)}};
 vm.runInNewContext(source,{window});
 const feature=window.SENDAS_CHAPTER23;
 assert.equal(feature.actionsFor('yael').length,1);
 feature.run('open');
 assert.match(last,/Lo que trae Natán/);
 feature.run('compare');
 assert.equal(s.chapter23.compared,true);
 feature.run('listen');
 assert.equal(s.chapter23.listened,true);
 feature.run(ending);
 assert.equal(s.chapter23.finished,true);
 assert.equal(s.chapter23.outcome,ending);
 assert.equal(feature.actionsFor('yael').length,1);
 assert.equal(s.logs.filter(x=>x.includes('Magdala y Yael')).length,1);
 const persisted=JSON.parse(JSON.stringify(s));
 s=persisted;
 feature.run('open');
 assert.match(last,/Lo que queda pendiente/);
 count++;
}
let s={scene:'yael',chapter22:{stage:3},chapter23:{},logs:[]};
const window={SENDAS_GAME_API:{openPanel:()=>{},change:fn=>fn(s),remember:()=>{},refresh:()=>{}},SENDAS_CHAPTER_API:{get:()=>s}};
vm.runInNewContext(source,{window});
assert.equal(window.SENDAS_CHAPTER23.actionsFor('yael').length,0);
console.log('SENDAS 2.3 model checks:',count,'outcomes + unavailable before evidence: PASS');
