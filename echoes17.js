/* SENDAS 1.7 — Ecos de la aldea. Continuación de las decisiones, sin nuevas imágenes ficticias. */
(function(){
'use strict';
const NPC={
 irit:{name:'Irit',scene:'irit',portrait:'irit',opening:'«La niña está mejor. Pero la familia del canal necesita algo más que una cuenta corregida: tiempo para recuperar su trabajo».',task:'Llevar alimento a la casa del canal',help:'La comida no salda la cuenta; permite que la familia afronte el día siguiente.'},
 jonas:{name:'Jonás',scene:'dock',portrait:'jonas',opening:'«En las redes hay trabajo para quien sabe remendarlas. Pero no quiero hablar por quien aún no ha pedido ayuda».',task:'Ofrecer trabajo sin imponerlo',help:'Jonás acepta preguntar primero si desean trabajar con los pescadores.'},
 mara:{name:'Mara',scene:'market',portrait:'mara',opening:'«La cuenta sigue a la vista. Los vecinos preguntan por qué nadie advirtió antes el error».',task:'Comparar los pesos y medidas',help:'Mara muestra sus marcas de medida y escucha las dudas de la familia.'}
};
const state=()=>window.SENDAS_READONLY?.getState?.()||{};
const codex=()=>window.SENDAS_CODEX_API?.get?.()||{};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const save=patch=>{window.SENDAS_CODEX_API?.set?.({...codex(),echoes:{...(codex().echoes||{}),...patch}});};
function close(){window.SENDAS_UI.close();}
function show(title,html,options){
 const buttons='<div class="codex-actions">'+options.map(o=>'<button type="button" class="codex-button" data-echo="'+esc(o[1])+'">'+esc(o[0])+'</button>').join('')+'</div>';
 window.SENDAS_UI.show({module:'echo',overline:'LOS ECOS DEL PUEBLO',title:title,body:html+buttons,attribute:'data-echo'});
}
function start(n){const p=NPC[n],s=state(),e=codex().echoes||{};if(!codex().resolved||!p||s.scene!==p.scene||e[n]==='help')return;
show('Una petición de '+p.name,'<div class="ledger16-portrait"><img src="assets/portrait_'+p.portrait+'.webp" alt="Retrato de '+p.name+'"></div><p class="codex-intro">'+esc(p.opening)+'</p><div class="codex-parchment"><p>'+esc(p.task)+'</p><p>'+esc(p.help)+'</p></div>',[['Escuchar y ofrecer ayuda','accept:'+n],['Todavía no puedo hacerlo','decline:'+n],['Volver al camino','close']]);}
function accept(n){const p=NPC[n],s=state();if(!p||!codex().resolved||s.scene!==p.scene)return;save({[n]:'help'});window.SENDAS_CODEX_API?.note?.('Ayudé a '+p.name+' en una nueva necesidad del pueblo.');show('Una ayuda concreta','<p class="codex-intro">'+esc(p.help)+'</p><p class="ledger16-note">La familia conserva el derecho de decidir por sí misma. Natán descubre que ayudar también significa respetar esa libertad.</p>',[['Continuar','close']]);}
function decline(n){const p=NPC[n],s=state();if(!p||!codex().resolved||s.scene!==p.scene)return;save({[n]:'later'});window.SENDAS_CODEX_API?.note?.('No pude atender la petición de '+p.name+'; puedo reconsiderarla en otro encuentro.');show('Una petición pendiente','<p class="codex-intro">Natán se despide. '+esc(p.name)+' continuará con su trabajo, aunque algunas necesidades sigan sin respuesta.</p>',[['Seguir explorando','close']]);}
function actionsFor(scene){const e=codex().echoes||{};if(!codex().resolved)return [];return Object.entries(NPC).filter(([k,p])=>p.scene===scene && e[k]!=='help').map(([k,p])=>({label:e[k]==='later'?'Volver a hablar con '+p.name+' sobre la ayuda':'Escuchar una nueva petición de '+p.name,id:'echo:'+k,icon:'◎'}));}
function epilogue(){const e=codex().echoes||{};const helped=Object.keys(NPC).filter(n=>e[n]==='help');if(!helped.length)return '';return '\n\nEn la aldea, Natán encontró nuevas formas de acompañar a sus vecinos: '+helped.map(n=>NPC[n].name).join(', ')+'. No eran gestas memorables para el mundo, pero los destinatarios los recordarían.';}
window.SENDAS_UI.register('echo',function(a){
 if(a==='close')return close();
 if(a.indexOf('accept:')===0)return accept(a.slice(7));
 if(a.indexOf('decline:')===0)return decline(a.slice(8));
},function(a){return a.indexOf('accept:')===0||a.indexOf('decline:')===0;});
window.SENDAS_ECHOES={open:start,actionsFor,epilogue};
})();