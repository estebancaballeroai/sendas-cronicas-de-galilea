/* SENDAS 2.4 — El puerto habla: pistas persistentes y síntesis sin certezas falsas */
(function(){'use strict';
const api=()=>window.SENDAS_GAME_API, state=()=>window.SENDAS_CHAPTER_API.get(), info=()=>state().chapter24||{};
const names={weights:'Pesas del almacén',origin:'Procedencia de la tablilla',dates:'Marcas y estaciones',voices:'Voces del muelle'};
function render(title,message,options){
const content='<p class="lead">'+message+'</p><div class="modal-actions">'+options.map(x=>'<button class="modal-choice" type="button" data-run="m24:'+x[1]+'">'+x[0]+'<span>›</span></button>').join('')+'</div>';
api().openPanel(title,content,'CAPÍTULO III · INDICIOS DEL PUERTO');
}
function change(fn){api().change(s=>{s.chapter24=s.chapter24||{clues:[]};fn(s.chapter24);});api().refresh();}
function observed(k){return (info().clues||[]).includes(k);}
function examine(k){
if(state().scene!=='magdala3'||!names[k])return;
if(!observed(k)){change(d=>{d.clues=[...(d.clues||[]),k]});api().remember('Magdala: examiné '+names[k].toLowerCase()+'.');}
const text={
weights:'Hay pesas de piedra de tamaños diferentes. La diferencia no indica por sí misma qué se utilizó en una entrega.',
origin:'La tablilla pasó por dos almacenes. Quien la llevó al lago quizá no sea la persona que la escribió.',
dates:'Las tablillas parecen referirse a distintas estaciones. La madera sola no revela quién recibió el cargamento.',
voices:'Un estibador recuerda cebada; una comerciante menciona aceite. Ninguno conoce con certeza al destinatario.'
}[k];
render(names[k],text,[['Confrontar las pistas','compare'],['Regresar al puerto','close']]);
}
function compare(){
const n=(info().clues||[]).length;
if(n<3)return render('Faltan observaciones','Has reunido '+n+' de 4 indicios. Necesitas al menos tres para comparar posibles explicaciones.',[['Volver a investigar','close']]);
render('Tres posibles explicaciones','Los indicios pueden apoyar más de una historia. ¿Cuál sería prudente investigar, sin acusar a nadie todavía?',[
['Dos medidas distintas','theory:measures'],['Dos entregas confundidas','theory:deliveries'],['Una acusación prematura','theory:accuse'],['Releer el puerto','close']]);}
function theory(k){
if((info().clues||[]).length<3||!['measures','deliveries','accuse'].includes(k))return;
change(d=>{d.compared=true;d.theory=k;});
const messages={measures:'Dos medidas distintas podrían explicar los números, pero no sabemos cuál se empleó.',deliveries:'Las cantidades podrían pertenecer a envíos diferentes. Es preciso escuchar a los destinatarios.',accuse:'La sospecha no demuestra una intención. Acusar sin contrastar podría perjudicar a inocentes.'};
render('Una hipótesis, no una prueba',messages[k]+' Natán debe volver a escuchar a Yael antes de afirmar nada.',[['Volver a Yael','return'],['Explorar otra hipótesis','compare'],['Seguir en el puerto','close']]);}
function report(){
if(state().scene!=='yael'||!info().compared)return;
if(info().reported)return render('Lo que permanece',info().reported==='honest'?'Yael conoce las dudas de la investigación.':info().reported==='patient'?'Yael conserva las notas sin que nadie la apure.':'Yael espera que Natán le explique las pruebas que omitió.',[['Cerrar','close']]);
render('Lo que sabe Natán','Yael escucha atentamente. Has encontrado indicios nuevos, pero no una sentencia. ¿Cómo presentarás tus observaciones?',[
['Mostrar también los testimonios contradictorios','honest'],['Hablar solo de los indicios favorables','selective'],['Dejar los escritos para que ella decida','patient'],['Cerrar','close']]);}
function outcome(k){if(state().scene!=='yael'||!info().compared||info().reported||!['honest','selective','patient'].includes(k))return;
change(d=>{d.reported=k;});
const t={honest:'Yael aprecia que Natán no esconda las dudas: podrá decidir con más información.',selective:'Yael descubre que faltan voces. Le pide que regrese con un relato completo antes de confiar en su hipótesis.',patient:'Yael guarda las notas y elige cuándo compartirlas con su familia.'}[k];
api().remember('Mi regreso de Magdala: '+t);render('Una decisión que permanece',t,[['Regresar al patio','close']]);}
function actions(scene){
if(scene==='magdala3'&&state().chapter22?.stage>=2)return Object.keys(names).map(k=>({label:'Examinar: '+names[k],id:'m24:'+k,icon:'▤'})).concat([{label:'Relacionar las pruebas reunidas',id:'m24:compare',icon:'⌖'}]);
if(scene==='yael'&&info().compared)return [{label:info().reported?'Recordar la conversación sobre Magdala':'Explicar los indicios a Yael',id:'m24:report',icon:'▤'}];
return [];}
function run(k){if(k==='close')return api().closePanel();if(k==='compare')return compare();if(k==='return')return api().navigate('yael');if(k==='report')return report();if(names[k])return examine(k);if(k.startsWith('theory:'))return theory(k.slice(7));return outcome(k);}
window.SENDAS_MAGDALA24={run,actions,status:()=>JSON.parse(JSON.stringify(info()))};
})();