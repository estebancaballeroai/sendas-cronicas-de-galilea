'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let assertions=0;
function t(name,fn){fn(); assertions++;console.log('PASS '+name);}
function makeSave(witness){return {version:1,scene:'dock',visited:['home','village','dock'],inv:{pan:1},flags:{netDone:true},logs:[],codex:{delivered:true,resolved:true,entrusted:witness},dialogHistory:{'npc:Jonás':['jonasFaith'],'Mara|legacy':['maraTrail']},actionHistory:{dock:['talkJonas']},chapter18:{stage:1,choices:['listen'],notes:[],current:'listen'}};}
const ctx={window:{},console};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'core20.js'),'utf8'),ctx);
const core=ctx.window.SENDAS_CORE;
const json=x=>JSON.parse(JSON.stringify(x));
t('v1 legacy save migration is non-destructive',()=>{
 const old=makeSave('mara'),snapshot=json(old),same=core.migrate(old);
 assert.equal(same,old);assert.equal(old.version,1);assert.equal(old.saveSchema,2);
 assert.deepEqual(json(old.inv),snapshot.inv);assert.deepEqual(json(old.codex),snapshot.codex);
 assert.deepEqual(json(old.visited),snapshot.visited);
 assert.ok(core.seen(old,'dialog:npc:Jonás','jonasFaith'));
 assert.ok(core.seen(old,'dialog:npc:Mara','maraTrail'));
 assert.ok(core.seen(old,'action:dock','talkJonas'));
 assert.ok(core.seen(old,'dialog:chapter2:family','ch2:topic:listen'));
});
t('migration is idempotent with repeated saves and reloads',()=>{
 const s=core.migrate(makeSave('simeon'));const first=JSON.stringify(s);
 core.migrate(s);core.migrate(JSON.parse(JSON.stringify(s)));
 assert.equal(first,JSON.stringify(s));
});
t('dialogue choices gray per character and persist on serialization',()=>{
 const s=core.migrate(makeSave('jonas'));
 assert.equal(core.mark(s,'dialog:npc:Jonás','jonasHope'),true);
 assert.equal(core.mark(s,'dialog:npc:Jonás','jonasHope'),false);
 assert.equal(core.seen(s,'dialog:npc:Jonás','jonasHope'),true);
 assert.equal(core.seen(s,'dialog:npc:Mara','jonasHope'),false);
 assert.equal(core.seen(json(s),'dialog:npc:Jonás','jonasHope'),true);
 assert.ok(s.dialogHistory['npc:Jonás'].includes('jonasHope'));
});
t('action history is scene-scoped and round-trips through v1 key',()=>{
 const s=core.migrate(makeSave('mara'));
 core.mark(s,'action:dock','go:village');
 assert.equal(core.seen(s,'action:dock','go:village'),true);
 assert.equal(core.seen(s,'action:market','go:village'),false);
 assert.ok(s.actionHistory.dock.includes('go:village'));
});
t('chapter II choice migration and gray history use same core',()=>{
 const s=core.migrate(makeSave('mara'));
 core.mark(s,'dialog:chapter2:family','ch2:topic:promise');
 assert.ok(s.chapter18.choices.includes('promise'));
 assert.equal(core.seen(json(s),'dialog:chapter2:family','ch2:topic:promise'),true);
});
t('invalid dialogue actions cannot corrupt save',()=>{
 const s=core.migrate(makeSave('mara'));
 assert.equal(core.mark(s,'dialog:chapter2:family',''),false);
 assert.equal(core.mark(s,'dialog:chapter2:family','x'.repeat(500)),false);
 assert.equal(core.mark(s,'dialog:chapter2:family','ch2:topic:listen'),false);
});
t('chapter gating and scene numbering',()=>{
 const a=makeSave('mara');a.scene='yael';assert.equal(core.unlocked(a),true);assert.equal(core.chapter(a),2);
 const b={version:1,scene:'village'};assert.equal(core.unlocked(b),false);assert.equal(core.chapter(b),1);
});
function makeChapter(w){
 let state=core.migrate(makeSave(w));let last=null;let notes=[];
 const game={
  change(fn){fn(state);return json(state);},remember(note){if(!state.logs.includes(note))state.logs.push(note);notes.push(note);},
  conversation(opt){last=opt;}
 };
 ctx.window.SENDAS_GAME_API=game;
 ctx.window.SENDAS_CHAPTER_API={get:()=>json(state)};
 vm.runInContext(fs.readFileSync(path.join(root,'chapter18.js'),'utf8'),ctx);
 return {get state(){return state;},get last(){return last;},get notes(){return notes;},run:id=>ctx.window.SENDAS_CHAPTER_TWO.run(id),core};
}
for(const w of ['mara','jonas','simeon'])t('chapter II witness route and decision consequences: '+w,()=>{
 const session=makeChapter(w);
 session.state.chapter18.current=null;session.run('talk:yael');assert.ok(session.last.text.includes(w==='mara'?'Mara':w==='jonas'?'Jonás':'Siméon'));
 session.run('observe:grain');session.run('observe:measure');
 session.run('topic:commit');core.mark(session.state,'dialog:chapter2:family','ch2:topic:commit');
 session.run('meeting');assert.equal(session.last.title,'¿Quién puede hablar por nosotros?');
 session.run('decision:consult');assert.equal(session.state.chapter18.decision,'consult');
 assert.equal(session.state.chapter18.resolution,'revisión-con-consentimiento');
 assert.ok(session.notes.length>=3);
 const latest=json(session.state);core.migrate(latest);
 assert.equal(latest.chapter18.decision,'consult');
 assert.equal(latest.codex.entrusted,w);
});
t('chapter II blocks decision until observations and promise',()=>{
 const session=makeChapter('mara');session.run('meeting');assert.equal(session.last.title,'Todavía falta escuchar');
 session.run('observe:grain');session.run('meeting');assert.equal(session.last.title,'Todavía falta escuchar');
});
t('chapter II different choices carry different outcomes',()=>{
 const a=makeChapter('jonas');a.run('decision:impose');assert.equal(a.state.chapter18.resolution,'confianza-herida');
 const b=makeChapter('jonas');b.run('decision:postpone');assert.equal(b.state.chapter18.resolution,'pendiente');
});
t('chapter II is a standard action provider and has no overlay or localStorage calls',()=>{
 const mod=ctx.window.SENDAS_CHAPTER_TWO;
 assert.ok(mod.actions().some(x=>x.id==='ch2:talk:yael'));
 assert.ok(mod.actions().some(x=>x.id==='ch2:observe:grain'));
 assert.ok(!fs.readFileSync(path.join(root,'chapter18.js'),'utf8').includes('localStorage'));
 assert.ok(!fs.readFileSync(path.join(root,'chapter18.js'),'utf8').includes('innerHTML'));
});

t('historical documents and witness/echo options migrate to unified panel history',()=>{
 const s=makeSave('jonas');s.codex.found=['market','dock','simeon'];s.codex.solved=true;s.codex.echoes={irit:'later',mara:'help'};
 core.migrate(s);
 assert.ok(core.seen(s,'dialog:panel:codex','read:market'));
 assert.ok(core.seen(s,'dialog:panel:codex','answer:canal'));
 assert.ok(core.seen(s,'dialog:panel:ledger','choose:jonas'));
 assert.ok(core.seen(s,'dialog:panel:ledger','check:correct'));
 assert.ok(core.seen(s,'dialog:panel:echo','decline:irit'));
 assert.ok(core.seen(s,'dialog:panel:echo','accept:mara'));
 const copy=json(s);core.migrate(copy);
 assert.deepEqual(json(copy.interactions),json(s.interactions));
});
console.log('INTERMEDIATE TEST RESULT',assertions,'/',assertions,'passing');