/* SENDAS 1.7b: visited action history, compatible with existing saves. */
(function(){
'use strict';
var KEY='sendas_cronicas_ilustrada_1';
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){return null;}}
function mark(){
 var data=read(),root=document.getElementById('actions');
 if(!data||!root)return;
 var history=(data.actionHistory&&data.actionHistory[data.scene])||[];
 root.querySelectorAll('.action-btn[data-run]').forEach(function(b){
  var seen=history.indexOf(b.getAttribute('data-run'))!==-1;
  b.classList.toggle('action-btn-seen',seen);
  if(seen)b.setAttribute('aria-label',b.innerText+' (ya explorado)');
 });
}
document.addEventListener('click',function(e){
 var b=e.target.closest('#actions .action-btn[data-run]');
 if(!b)return;
 var data=read();if(!data||!data.scene)return;
 var action=b.getAttribute('data-run'),scene=data.scene;
 b.classList.add('action-btn-seen');
 setTimeout(function(){var latest=read();if(!latest)return;
 latest.actionHistory=latest.actionHistory||{};
 var history=latest.actionHistory[scene]||[];
 if(history.indexOf(action)===-1){latest.actionHistory[scene]=history.concat(action).slice(-120);
 try{localStorage.setItem(KEY,JSON.stringify(latest));}catch(err){}}
 mark();},0);
},true);
var root=document.getElementById('actions');
if(root)new MutationObserver(mark).observe(root,{childList:true});
document.addEventListener('click',function(){setTimeout(mark,0);});
mark();
})();