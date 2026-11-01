/* SENDAS 2.6 — Las voces de Magdala.
 * A complete optional chapter-III investigation: witnesses, contradictory evidence,
 * consent-based return to Yael, one UI and the existing version-1 save key.
 */
(function(host){
 'use strict';
 const ui=host.SENDAS_UI, get=()=>host.SENDAS_CHAPTER_API.get(), game=()=>host.SENDAS_GAME_API;
 const witnesses={
  neria:{name:'Neria',role:'Comerciante del almacén',portrait:'assets/chapter26/neria_portrait.webp'},
  asaf:{name:'Asaf',role:'Trabajador del embarcadero',portrait:'assets/chapter26/asaf_portrait.webp'}
 };
 const questions={
  neria:[
   {id:'neria:deliveries',label:'¿Cómo llegan las mercancías a este almacén?',clue:'neria',title:'Dos entregas no son una deuda',text:'«Un saco lleva una marca de salida; otro, una de llegada. Cuando el viento cambia, una embarcación puede descargar dos veces. Nadie debería convertir esos trazos en el nombre de un deudor». Neria aparta una tablilla sin ocultarla.'},
   {id:'neria:families',label:'¿Quién garantiza que las familias cobraron?',title:'Un nombre que no se pronuncia',text:'«No llevo las cuentas de todas las casas del lago. A veces la misma señal pasa de mano en mano. Si una familia reclama justicia, primero pregúntale qué autoriza contar». Neria parece conocer el precio de una mala acusación.'},
   {id:'neria:listen',label:'Prometer que no divulgarás nombres',title:'Confianza a la luz del día',clue:'consent',text:'«Entonces podrás mirar la tabla pequeña. Si mencionas a alguien fuera de aquí, no uses mis palabras como si yo hubiera visto la entrega». Neria acepta que observes los signos de expedición.'},
   {id:'neria:press',label:'Insistir en saber quién se equivocó',title:'La prudencia de Neria',text:'«No tengo nombres que regalarte. La prisa por señalar a alguien convierte a los vecinos en enemigos». Neria guarda silencio. Todavía puedes examinar las marcas, pero ya no hablará con la misma confianza.'}
  ],
  asaf:[
   {id:'asaf:shifts',label:'Preguntar por los turnos de carga',clue:'asaf',title:'El tiempo entre dos barcas',text:'«Ayudé con cebada al alba. Más tarde llegaron jarras de aceite. Me pidieron llevar la cuerda y pesar otra cesta, pero no vi a quién se entregó después». Asaf diferencia lo que hizo de lo que solo oyó.'},
   {id:'asaf:signs',label:'¿Reconoces la marca del mensajero?',title:'Una semejanza incompleta',text:'«La vi junto a una pesa pequeña, pero no puedo jurar que sea la misma. En la sombra, dos marcas parecen iguales». Se aparta para que Natán pueda mirar sin taparle la luz.'},
   {id:'asaf:listen',label:'Preguntar sin exigir una respuesta',title:'Un testigo no es dueño del relato',clue:'respect',text:'«Gracias por no hacerme decir lo que no sé. Puedo contarte la hora de mis turnos, no la intención de quienes escribieron». Asaf no promete una solución, pero vuelve a hablar con calma.'},
   {id:'asaf:press',label:'Pedir que acuse al custodio',title:'Una acusación sin testigo',text:'«¿Y si mañana dicen que fui yo? No lo vi cambiar una sola medida». Asaf retrocede. Natán comprende que la sospecha puede dañar a quien nunca participó en la cuenta.'}
  ]
 };
 const allowedClues=['neria','asaf','weights','marks','consent','respect'];
 const unique=v=>Array.isArray(v)?[...new Set(v.filter(s=>typeof s==='string'))]:[];
 function data(){
  const c=get().chapter26||{};
  return {clues:unique(c.clues).filter(k=>allowedClues.includes(k)),
   topics:unique(c.topics),stance:c.stance&&typeof c.stance==='object'?c.stance:{},
   theory:typeof c.theory==='string'?c.theory:null, ending:typeof c.ending==='string'?c.ending:null,
   finalVisit:!!c.finalVisit};
 }
 function unlocked(){const s=get();return !!(s.chapter22&&s.chapter22.stage>=3);}
 function ready(){const c=data(),main=c.clues.filter(k=>['neria','asaf','weights','marks'].includes(k));return unlocked()&&main.length>=3&&main.some(k=>k==='neria'||k==='asaf');}
 function record(patch,remember){
  let changed=false;
  game().change(s=>{
   s.chapter26=s.chapter26||{clues:[],topics:[],stance:{},theory:null,ending:null};
   const d=s.chapter26;
   if(patch.clue){d.clues=unique(d.clues);if(!d.clues.includes(patch.clue)){d.clues.push(patch.clue);changed=true;}}
   if(patch.topic){d.topics=unique(d.topics);if(!d.topics.includes(patch.topic)){d.topics.push(patch.topic);changed=true;}}
   if(patch.stance){d.stance=d.stance||{};if(!d.stance[patch.stance[0]]){d.stance[patch.stance[0]]=patch.stance[1];changed=true;}}
   if(patch.theory && !d.theory){d.theory=patch.theory;changed=true;}
   if(patch.ending && !d.ending){d.ending=patch.ending;changed=true;}
   if(patch.finalVisit&&!d.finalVisit){d.finalVisit=true;changed=true;}
  });
  if(changed&&remember)game().remember(remember);
  game().refresh();
  return changed;
 }
 function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function button(text,id,secondary){return '<button type="button" class="m26-option'+(secondary?' m26-option-secondary':'')+'" data-m26="'+esc(id)+'">'+esc(text)+'<span aria-hidden="true">›</span></button>';}
 function panel(title,body,buttons,extra){
  const content='<div class="m26-content">'+(extra||'')+body+'</div><div class="m26-options">'+buttons.map(x=>button(x[0],x[1],x[2])).join('')+'</div>';
  ui.show({module:'magdala26',attribute:'data-m26',title,overline:'CAPÍTULO III · LAS VOCES DE MAGDALA',body:content});
 }
 function portrait(who){const x=witnesses[who];return '<div class="m26-person"><img src="'+x.portrait+'" alt="Retrato de '+esc(x.name)+'"><div><strong>'+esc(x.name)+'</strong><span>'+esc(x.role)+'</span></div></div>';}
 function pills(){const c=data(), count=c.clues.filter(k=>['neria','asaf','weights','marks'].includes(k)).length;
  return '<div class="m26-meter" aria-label="'+count+' de 4 indicios reunidos"><span>INDICIOS '+count+' / 4</span><div class="m26-bar"><i style="width:'+(25*count)+'%"></i></div></div>';
 }
 function entry(){if(!unlocked()||get().scene!=='magdala3')return;game().navigate('almacen26');}
 function opening(){
  const c=data();
  panel('La puerta del almacén','<p>Tras el puerto, Natán descubre un patio de sacos, redes y jarras de aceite. Dos personas recuerdan el mismo día de forma distinta. <strong>¿Qué es realmente una prueba?</strong></p><p class="m26-muted">Neria administra las entregas. Asaf transporta las cargas. Ninguno sabe con certeza si la tablilla llegó a la casa de Yael.</p>'+pills(),[
   ['Escuchar a Neria','neria:open'],['Hablar con Asaf','asaf:open'],['Acercarte a las pesas','table'],['Cerrar','close',true]
  ]);
 }
 function person(who){
  if(!['neria','asaf'].includes(who)||!unlocked()||!['almacen26','mesa26'].includes(get().scene))return;
  const c=data(),note=who==='neria'?'«La medida escrita es una parte de la historia, no su dueño».':'«Puedo decir lo que cargué; no sé quién lo recibió».';
  const text='<p class="m26-quote">'+note+'</p><p>Natán observa la mesa y espera. El silencio permite que el otro elija qué contar.</p>'+pills();
  panel('Conversación con '+witnesses[who].name,text,questions[who].filter(q=>!q.id.endsWith('press')&&!q.id.endsWith('listen')).map(q=>[q.label,q.id]).concat(
   c.stance[who]?[]:questions[who].filter(q=>q.id.endsWith('press')||q.id.endsWith('listen')).map(q=>[q.label,q.id])
  ).concat([['Volver al almacén','close',true]]),portrait(who));
 }
 function topic(id){
  const who=id.split(':')[0],q=questions[who]?.find(q=>q.id===id);
  if(!q||!unlocked()||!['almacen26','mesa26'].includes(get().scene))return;
  const c=data(), isStance=id.endsWith('press')||id.endsWith('listen');
  if(isStance&&c.stance[who]&&c.stance[who]!==id)return person(who);
  const patch={topic:id};
  if(q.clue)patch.clue=q.clue;
  if(isStance)patch.stance=[who,id];
  record(patch,'Magdala, '+witnesses[who].name+': '+q.title+'.');
  panel(q.title,'<p class="m26-quote">'+esc(q.text)+'</p>'+(isStance?'<p>Esta forma de escuchar quedará en tu diario y afectará a la conversación posterior.</p>':'<p>El recuerdo es valioso, pero no demuestra a quién pertenecía el cargamento.</p>')+pills(),[
   ['Seguir hablando con '+witnesses[who].name,who+':open'],['Volver a la mesa','table'],['Cerrar','close',true]
  ],portrait(who));
 }
 function inspect(which){
  if(!['weights','marks'].includes(which)||get().scene!=='mesa26')return;
  const descriptions={
   weights:['Las piedras de pesar','Sobre la madera hay dos pesas de tamaños distintos. Neria admite que una pudo servir para el grano y otra para el aceite, pero nadie ha conservado el nombre del comprador.'],
   marks:['Los trazos en dos tablillas','El mismo signo aparece junto a dos días de carga. Asaf recuerda que a veces las señales indicaban el depósito, no la persona que debía recibir la mercancía. Ninguna tablilla contiene el nombre de Eliab.']
  };
  record({clue:which},'Magdala: observé '+descriptions[which][0].toLowerCase()+'.');
  panel(descriptions[which][0],'<img class="m26-illustration" src="assets/chapter26/voces_magdala.webp" alt="Neria y Asaf ante pesas y tablillas del puerto"><p>'+descriptions[which][1]+'</p>'+pills(),[
   ['Relacionar los indicios','compare'],['Volver a los objetos','close',true]
  ]);
 }
 function compare(){
  if(!unlocked()||!['mesa26','almacen26','magdala3'].includes(get().scene))return;
  const c=data(),count=c.clues.filter(x=>['neria','asaf','weights','marks'].includes(x)).length;
  if(count<3||!c.clues.some(x=>['neria','asaf'].includes(x)))return panel('La cuenta aún no habla','<p>Necesitas <strong>tres indicios</strong>, entre ellos al menos una conversación con alguien que trabajó en el puerto. Una pesa y una marca no pueden prestar testimonio.</p>'+pills(),[['Escuchar a Neria','neria:open'],['Escuchar a Asaf','asaf:open'],['Volver a examinar','table',true]]);
  if(c.theory)return interpretation(c.theory,true);
  panel('Una mesa, tres hipótesis','<p>Coloca lado a lado los testimonios y los objetos. Las tres explicaciones son posibles, pero no están igualmente respaldadas. Natán no puede cambiar una duda por una certeza.</p><div class="m26-evidence">'+[
   ['Neria','neria'],['Asaf','asaf'],['Las pesas','weights'],['Las tablillas','marks']].map(x=>'<span class="'+(c.clues.includes(x[1])?'m26-found':'')+'">'+esc(x[0])+' · '+(c.clues.includes(x[1])?'Examinado':'Pendiente')+'</span>').join('')+'</div>',[
   ['Dos entregas se confundieron','theory:deliveries'],['Se emplearon medidas distintas','theory:measures'],['Alguien alteró la cuenta a propósito','theory:accusation'],['Seguir investigando','close',true]
  ]);
 }
 function interpretation(which,revisit){
  const explanations={
   deliveries:'Dos movimientos de mercancías pudieron quedar anotados juntos. La diferencia es posible; sin destinatarios identificados, no demuestra quién debe una entrega.',
   measures:'Las pesas no parecen iguales, pero no sabes cuál se usó ni si los registros hablan del mismo producto. Una discrepancia no identifica a un culpable.',
   accusation:'La sospecha de manipulación podría investigarse, pero ningún testigo vio falsificar la cuenta. Llevar una acusación como certeza dañaría a quienes esperan justicia.'
  };
  if(!explanations[which])return;
  if(!revisit)record({theory:which},'Magdala: elegí una hipótesis de trabajo, no una sentencia ('+which+').');
  panel('Lo que puedes decirle a Yael','<p class="m26-quote">'+explanations[which]+'</p><p>'+((data().stance.neria==='neria:press'||data().stance.asaf==='asaf:press')?'Al insistir, una parte de la confianza quedó dañada. Puedes reconocerlo ante Yael.':'Las conversaciones han dejado abiertas varias explicaciones.')+'</p><p>Yael debe decidir qué hacer con esta información. No puedes hacerlo en su lugar.</p>',[
   ['Regresar para hablar con Yael','return'],['Releer los indicios','compare:recap'],['Permanecer en Magdala','close',true]
  ]);
 }
 function goYael(){if(!data().theory)return;game().navigate('yael');}
 function outcome(){
  if(get().scene!=='yael'||!data().theory)return;
  const c=data(),previous=get().chapter24?.reported||null;
  if(c.ending)return epilogue();
  const trust=(c.stance.neria==='neria:listen'?1:0)+(c.stance.asaf==='asaf:listen'?1:0);
  const intro=previous==='selective'?'Yael recuerda que antes omitiste ciertas voces. Necesita saber si esta vez hablas con franqueza.':
   previous==='honest'?'Yael recuerda que ya compartiste tus dudas, sin ocultar los testimonios que no coincidían.':
   previous==='patient'?'Yael todavía conserva las notas que decidiste dejarle.':'Yael contempla las marcas sin apresurarte.';
  panel('Lo que Yael quiere saber','<p>Natán encuentra a Yael recogiendo la tela que seca en el patio. Eliab escucha desde la puerta. '+intro+'</p><p class="m26-quote">«Dime qué viste. Después quiero decidir yo qué hacer con ello».</p><div class="m26-note">Tu investigación: '+c.clues.filter(x=>['neria','asaf','weights','marks'].includes(x)).length+' indicios · '+trust+' conversaciones respetuosas.</div>',[
   ['Contar las dudas y los dos testimonios','ending:transparent'],['Dejarle las notas y reservar los nombres','ending:privacy'],['Señalar a un culpable sin nuevas pruebas','ending:accuse'],['Todavía necesito pensar','close',true]
  ]);
 }
 function finish(which){
  if(get().scene!=='yael'||!data().theory||data().ending||!['transparent','privacy','accuse'].includes(which))return;
  const c=data(),trust=(c.stance.neria==='neria:listen'?1:0)+(c.stance.asaf==='asaf:listen'?1:0);
  const endings={
   transparent:'Yael escucha ambas voces y las diferencias que has observado. «No me prometes una victoria; me das elementos para decidir», dice. Con su autorización, podrá pedir una revisión compartida de las medidas.',
   privacy:'Dejas las notas sin mencionar a las personas del puerto. Yael las guarda bajo un paño. «Necesito tiempo y quiero escoger a quién mostrar esto». Tu prudencia conserva una posibilidad de diálogo.',
   accuse:'Pronuncias una acusación que ninguno de tus testigos sostuvo. Yael frunce el ceño. «No pongas mi nombre detrás de una certeza que no tienes». Tu relación se resiente; todavía puedes reconocer el daño, pero la confianza no se recupera por decreto.'
  };
  const consequence=which==='transparent'&&trust===2?' Neria y Asaf aceptaron que transmitieras únicamente las observaciones, no sus nombres: Yael valora ese cuidado.':
    which==='transparent'&&trust===0?' Yael advierte tu prisa al tratar a los testigos y pide revisar la información contigo.':'';
  record({ending:which,finalVisit:true},'Capítulo III, las voces de Magdala: '+endings[which]);
  panel('Lo que permaneció', '<p class="m26-quote">'+endings[which]+consequence+'</p><p>La verdad no cabe en una sola tablilla. Tus decisiones ya forman parte de la historia de Natán y Yael.</p><div class="m26-resolution">CAPÍTULO III · EPISODIO 2.6 COMPLETADO</div>',[
   ['Releer el desenlace','recap'],['Seguir recorriendo Galilea','close',true]
  ]);
 }
 function epilogue(){
  const c=data(),texts={transparent:'Yael conoce los testimonios contradictorios y podrá proponer una revisión con consentimiento.',privacy:'Yael conserva las notas y elegirá cuándo compartir lo que ahora sabe.',accuse:'La acusación apresurada dañó la confianza; aún queda un camino de reparación.'};
  panel('Un relato que no se borra','<p class="m26-quote">'+texts[c.ending]+'</p><p>La decisión no se reinicia al volver al puerto. Puedes recordar las conversaciones, pero no borrar sus consecuencias de esta partida.</p>',[['Cerrar el diario','close',true]]);
 }
 function actions(scene){
  if(scene==='magdala3'&&unlocked())return [{label:'Entrar al almacén de Magdala · Nuevo',id:'m26:enter',icon:'◎'}];
  if(scene==='almacen26')return [
   {label:'Conocer el almacén y sus voces',id:'m26:intro',icon:'▤'},
   {label:'Hablar con Neria, comerciante',id:'m26:neria',icon:'◎'},
   {label:'Escuchar a Asaf, trabajador del muelle',id:'m26:asaf',icon:'◎'},
   {label:'Acercarse a la mesa de los registros',id:'m26:table',icon:'▤'},
   {label:'Relacionar lo descubierto',id:'m26:compare',icon:'⌖'},
   {label:'Volver al embarcadero',id:'go:magdala3',icon:'←'}];
  if(scene==='mesa26')return [
   {label:'Examinar las pesas de piedra',id:'m26:weights',icon:'▤'},
   {label:'Comparar los trazos de las tablillas',id:'m26:marks',icon:'▤'},
   {label:'Confrontar testimonios y objetos',id:'m26:compare',icon:'⌖'},
   {label:'Volver con Neria y Asaf',id:'go:almacen26',icon:'←'}];
  if(scene==='yael'&&data().theory)return [{label:data().ending?'Recordar las voces de Magdala':'Contar a Yael lo que sabes de Magdala · Nuevo',id:'m26:report',icon:'◎'}];
  return [];
 }
 function hotspots(scene){
  if(scene==='almacen26')return [{x:30,y:47,label:'Neria',id:'m26:neria'},{x:69,y:43,label:'Asaf',id:'m26:asaf'},{x:50,y:72,label:'La mesa',id:'m26:table'}];
  if(scene==='mesa26')return [{x:27,y:44,label:'Neria',id:'m26:neria'},{x:69,y:43,label:'Asaf',id:'m26:asaf'},{x:51,y:69,label:'Las pesas',id:'m26:weights'}];
  return [];
 }
 function narration(scene){
  const c=data();
  if(scene==='almacen26')return 'Neria pesa el grano a plena luz. Asaf espera junto al muelle. Hablan de dos movimientos de mercancías que las tablillas podrían haber confundido. Natán sabe que las familias de Cafarnaúm vivirán con las consecuencias de lo que él diga.\n\n'+(c.theory?'Llevas una hipótesis, pero todavía no una prueba.':'Escucha antes de comparar; ningún testimonio puede hablar por otro.');
  if(scene==='mesa26')return 'Las tablillas están a la vista, sobre madera gastada. Hay pesos distintos, marcas repetidas y silencios que el viajero tendrá que respetar.\n\n'+(c.ending?'Yael ha escuchado tu relato; los objetos conservan sus preguntas.':'Las preguntas importantes no son solamente cuánto falta, sino a quién se ha escuchado.');
  return '';
 }
 function status(scene){const c=data(),count=c.clues.filter(x=>['neria','asaf','weights','marks'].includes(x)).length;
  if(!['almacen26','mesa26'].includes(scene))return '';
  if(c.ending)return 'Capítulo III concluido · El desenlace permanece en el diario';
  if(c.theory)return 'Hipótesis elegida · Regresa para hablar con Yael';
  return count+' de 4 indicios reunidos · Necesitas 3 y un testigo';
 }
 function run(k){
  if(k==='close'){game().closePanel();return;}
  if(k==='enter'){entry();return;}
  if(k==='intro'){opening();return;}
  if(k==='neria'||k==='neria:open')return person('neria');
  if(k==='asaf'||k==='asaf:open')return person('asaf');
  if(k==='table'){if(unlocked())game().navigate('mesa26');return;}
  if(k==='weights'||k==='marks')return inspect(k);
  if(k==='compare')return compare();
  if(k==='compare:recap')return panel('Lo que todavía no sabes','<p>Las marcas del puerto admiten varias explicaciones. Has escogido una para trabajar, no para proclamarla verdadera.</p>'+pills(),[['Volver a Yael','return'],['Volver al almacén','table',true]]);
  if(k.startsWith('neria:')||k.startsWith('asaf:'))return topic(k);
  if(k.startsWith('theory:')){if(ready())return interpretation(k.slice(7),false);return compare();}
  if(k==='return')return goYael();
  if(k==='report')return outcome();
  if(k.startsWith('ending:'))return finish(k.slice(7));
  if(k==='recap')return epilogue();
 }
 if(ui&&typeof ui.register==='function')ui.register('magdala26',run,k=>/^(neria|asaf):(?:deliveries|families|listen|press|shifts|signs)$/.test(k));
 host.SENDAS_CHAPTER26=Object.freeze({version:'2.6.0',run,actions,hotspots,narration,status,ready,unlocked,data});
})(window);
