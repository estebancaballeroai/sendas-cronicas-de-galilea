/* SENDAS 3.0: one continuity graph, no new save key or competing dialogue engine. */
(function(host){'use strict';
const read=()=>host.SENDAS_READONLY.getState(), api=()=>host.SENDAS_GAME_API;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stages=[
 {id:'home',name:'I · Lo que escuchaste',label:'Aprender el valor de escuchar', scene:'village'},
 {id:'family',name:'II · El peso de la verdad',label:'La familia de Yael y el consentimiento',scene:'yael'},
 {id:'journey',name:'III · El camino a Magdala',label:'Seguir el mensaje y escuchar a los testigos',scene:'road3'},
 {id:'witness',name:'III · Los testimonios',label:'Entender las pruebas antes de hablar',scene:'almacen26'},
 {id:'after',name:'III · La memoria de las palabras',label:'Revisar tus relaciones con Neria y Asaf',scene:'almacen26'},
 {id:'shore',name:'IV · El peso del amanecer',label:'Investigar las necesidades en la orilla',scene:'orilla28'},
 {id:'days',name:'V · Tres días junto al lago',label:'Vivir las consecuencias de tus decisiones',scene:'yael'}
];
function graph(s){const v=s.visited||[],ch22=s.chapter22||{},ch26=s.chapter26||{},ch27=s.chapter27||{},ch28=s.chapter28||{},ch29=s.chapter29||{};
 const full=[!!s.codex?.resolved||!!s.codex?.delivered,!!s.chapter18?.decision,!!ch22.clue||Number(ch22.stage)>=4,!!ch26.ending,!!ch27.choice,!!ch28.closing,!!ch29.final];
 let active=full.indexOf(false);if(active<0)active=stages.length-1;
 const lines=stages.map((d,i)=>({...d,complete:full[i],active:i===active,available:i===0||(i<=active&&v.includes(d.scene))}));
 const d29=host.SENDAS_CHAPTER29?.state?.();
 const destination=(i)=>{if(i===0)return v.includes('village')?'village':'home';if(i===1)return 'yael';if(i===2)return ch22.stage>=2?'road3':'yael';if(i===3)return v.includes('almacen26')?'almacen26':ch22.stage>=3?'magdala3':'road3';if(i===4)return v.includes('almacen26')?'almacen26':'yael';if(i===5)return v.includes('orilla28')?'orilla28':'yael';if(i===6)return d29?.started?(d29.day===1?'patio29':d29.day===2?'consejo29':'orilla29'):'yael';};
 const target=(host.SENDAS_BRIDGES31?.next(s))||destination(active);
 const possible=!!host.SENDAS_BRIDGES31?.ids.includes(target)||s.scene===target||v.includes(target)||target==='yael'&&!!s.codex?.resolved||target==='home'||target==='village';
 const choices=[
  ['La voz de Yael',s.chapter18?.decision==='impose'?'El consentimiento quedó herido.':s.chapter18?.decision==='postpone'?'La espera sigue pesando sobre la familia.':s.chapter18?.decision==='consult'?'La familia participa en la revisión.':'Todavía no conoces su decisión.'],
  ['Las palabras en Magdala',ch26.ending==='accuse'?'La acusación sigue teniendo consecuencias.':ch26.ending==='privacy'?'Los nombres se conservaron en reserva.':ch26.ending==='transparent'?'Se compartieron pruebas y dudas.':'El relato está por construir.'],
  ['Los compromisos',ch28.plan?'El reparto sigue condicionado por '+({secure:'el amarre',council:'el acuerdo provisional',record:'la revisión de marcas'}[ch28.plan]||'lo acordado')+'.':'Los vecinos aún esperan acuerdos verificables.'],
  ['Tres días',ch29.final?'El compromiso final permanece: '+({notes:'notas entregadas',offer:'trabajo ofrecido',invite:'nuevo encuentro propuesto'}[ch29.final]||'decisión conservada')+'.':ch29.started?'Día '+(d29?.day||1)+' de 3: no todas las tareas caben en una jornada.':'La nueva secuencia aún no ha comenzado.']
 ];return{stages:lines,active,target,possible,complete:full.every(Boolean),choices};}
function open(){const s=read(),g=graph(s);
const list=g.stages.map((step,i)=>'<div class="continuity-step '+(step.complete?'continuity-done':step.active?'continuity-now':'continuity-later')+'"><span class="continuity-mark">'+(step.complete?'✓':step.active?'◉':'·')+'</span><div><strong>'+esc(step.name)+'</strong><small>'+esc(step.label)+'</small></div></div>').join('');
const bridges=host.SENDAS_BRIDGES31?.overview(s)||[];const interludes=bridges.map(b=>'<div class="continuity-consequence"><strong>'+esc(b.label)+'</strong><span>'+(b.complete?'Compromiso conservado':b.past?'Recuerdo del camino ya recorrido':b.heard>=2?'Las voces fueron escuchadas; puedes decidir':'Escucha al menos dos voces antes de decidir')+'</span></div>').join('');
const trail=g.choices.map(([a,b])=>'<div class="continuity-consequence"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>').join('');
const button=g.possible?'<button class="continuity-go" data-run="continuity:resume">'+(g.complete?'Volver a la última jornada':'Continuar el relato')+' →</button>':'<p class="continuity-alert">Sigue explorando las escenas abiertas para desbloquear el próximo paso. No se saltarán capítulos ni decisiones.</p>';
api().openPanel('Un solo camino','<section class="continuity"><p>Lo que pasó en Galilea no quedó atrás: tus decisiones viajan contigo. Este cuaderno reúne la historia sin cambiar una sola elección.</p><h3>Los actos de Natán</h3>'+list+'<h3>Encuentros entre capítulos</h3>'+interludes+'<h3>Lo que permanece</h3>'+trail+button+'<p class="continuity-note">Partida original conservada · Sin retroceder capítulos ni reescribir testimonios</p></section>','CAMPAÑA · CAPÍTULOS I–V');}
function resume(){const g=graph(read());if(!g.possible)return open();if(g.target===read().scene)return api().closePanel();api().navigate(g.target);}
document.addEventListener('click',e=>{const hit=e.target.closest('[data-run="continuity:resume"]');if(hit){e.preventDefault();e.stopImmediatePropagation();resume();}},true);
host.SENDAS_CAMPAIGN30=Object.freeze({version:'3.0.0',graph,open,resume});
})(window);
