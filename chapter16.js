/* SENDAS 1.6 — La cuenta del canal: desenlace jugable con testigos.
   Reutiliza escenas y retratos ya validados. No requiere red ni añade un guardado paralelo. */
(function(){
'use strict';
var PEOPLE={
  mara:{name:'Mara',place:'mercado',scene:'market',portrait:'mara',way:'revisar las mercancías con quien las vendió',
    counsel:'«Si esa familia no recibió la mercancía, quiero oír su relato y cotejar las medidas. No basta una marca para condenar a nadie».',
    ending:'Mara acepta revisar su propia cuenta con los vecinos presentes. No declara anulada la deuda: promete que nadie volverá a reclamarla sin escuchar primero a la familia.',
    afterward:'«He guardado las dos cuentas juntas. Antes de vender, también hay que saber escuchar».'},
  jonas:{name:'Jonás',place:'muelle',scene:'dock',portrait:'jonas',way:'reunir a quienes conocen el trabajo del lago',
    counsel:'«Conozco los nudos y los plomos; de las deudas sé menos. Pero puedo reunir a los vecinos para que nadie hable por una familia ausente».',
    ending:'Jonás reúne a varios vecinos dispuestos a acompañar a la familia del canal. La cuenta sigue discutida, pero ya no tienen que responder solos.',
    afterward:'«Las redes se sostienen con muchos nudos. Con los vecinos ocurre algo parecido».'},
  simeon:{name:'Siméon',place:'casa del escriba',scene:'simeon',portrait:'simeon',way:'preparar una copia legible y contrastar los nombres',
    counsel:'«Copiaré el registro sin añadir una palabra. La tinta ayuda a recordar; no reemplaza el testimonio de quienes estuvieron allí».',
    ending:'Siméon prepara una copia clara y ofrece acompañar a la familia cuando se revisen las cantidades. El escrito ya no queda oculto, aunque todavía falta comprobar la reclamación.',
    afterward:'«Una copia bien hecha conserva palabras. Para comprenderlas, todavía necesitamos personas».'}
};
function esc(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];});}
function get(){return window.SENDAS_CODEX_API&&window.SENDAS_CODEX_API.get()||{};}
function current(){return window.SENDAS_READONLY&&window.SENDAS_READONLY.getState()||{scene:'home'};}
function who(v){return PEOPLE[v.entrusted]||null;}
function note(line){if(window.SENDAS_CODEX_API&&window.SENDAS_CODEX_API.note)window.SENDAS_CODEX_API.note(line);}
function save(changes){var updated=Object.assign({},get(),changes);window.SENDAS_CODEX_API.set(updated);if(window.SENDAS_CODEX_API.refresh)window.SENDAS_CODEX_API.refresh();}
function buttons(items){return '<div class="codex-actions">'+items.map(function(item){return '<button type="button" class="codex-button" data-ledger="'+esc(item[1])+'">'+esc(item[0])+'</button>';}).join('')+'</div>';}
function portrait(person){return '<div class="ledger16-portrait"><img src="assets/portrait_'+esc(person.portrait)+'.webp" alt="Retrato de '+esc(person.name)+'"></div>';}
function page(over,title,body,items){
 window.SENDAS_UI.show({module:'ledger',overline:over,title:title,body:body+buttons(items||[['Volver al camino','close']]),attribute:'data-ledger'});
}
function close(){window.SENDAS_UI.close();}
function plan(){
 var v=get();if(!v.solved)return;
 if(v.delivered)return progress();
 var preview='<p class="codex-intro">La copia encontrada junto al agua muestra una reclamación discutida. Natán no conoce a la familia del canal, y no quiere decidir por ella. Necesita a alguien que escuche, preserve el escrito y le permita hablar.</p>';
 if(v.entrusted)preview+='<p class="ledger16-note">Pensabas acudir a '+esc(PEOPLE[v.entrusted].name)+'. Aún puedes cambiar de idea antes de entregar el registro.</p>';
 var cards=Object.keys(PEOPLE).map(function(k){var p=PEOPLE[k];return '<button class="ledger16-person" type="button" data-ledger="choose:'+k+'"><img src="assets/portrait_'+p.portrait+'.webp" alt=""><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.way)+'</small></span></button>';}).join('');
 page('CAPÍTULO I · TESTIMONIOS','¿A quién confiar la cuenta?',preview+'<div class="ledger16-people">'+cards+'</div>',[['Seguir explorando','close']]);
}
function choose(key){
 var p=PEOPLE[key],v=get();if(!p||!v.solved||v.delivered)return;
 save({entrusted:key,delivered:false,resolved:false,followup:false});
 note('Decidí consultar a '+p.name+' antes de hablar de la cuenta oculta.');
 page('EL SIGUIENTE PASO','Un camino para la verdad',portrait(p)+'<p class="codex-intro">Natán decide acudir a '+esc(p.name)+' para '+esc(p.way)+'.</p><p class="ledger16-note">Ve al '+esc(p.place)+'. Allí podrás mostrar la copia y explicar cómo la encontraste.</p>',[['Regresar al sendero','close']]);
}
function deliver(){
 var v=get(),p=who(v),st=current();
 if(!v.solved||!p||v.delivered||st.scene!==p.scene)return;
 page('TESTIGO · '+p.name.toUpperCase(),'¿De dónde salió la copia?',portrait(p)+'<p class="codex-intro">Antes de recibir el registro, '+esc(p.name)+' te pide que expliques cómo relacionaste las señales. ¿Qué puedes afirmar con lo que has visto?</p>',[
  ['El mercado citó la cuerda; la red mostró tres plomos y Siméon señaló el agua','check:correct'],
  ['Una vasija antigua demuestra por sí sola quién contrajo la deuda','check:wrong'],
  ['Jesús confirmó el nombre en la cuenta encontrada','check:wrong'],
  ['Guardar el documento para más tarde','close']
 ]);
}
function check(value){
 var v=get(),p=who(v),st=current();if(!v.solved||!p||v.delivered||st.scene!==p.scene)return;
 if(value!=='correct'){
   page('UNA PRUEBA NO ES TODA LA HISTORIA','Mirar con más atención','<p class="codex-intro">Natán no puede atribuir a la vasija una fecha que desconoce ni poner palabras en boca de Jesús. Las tres pistas le sirvieron para encontrar la copia; no demuestran por sí solas quién debe pagar.</p>',[['Volver a explicar las señales','deliver'],['Cerrar','close']]);
   return;
 }
 save({delivered:true,resolved:false,followup:false});
 note('Confié a '+p.name+' la copia del registro del canal. Aún debo escuchar a la familia.');
 page('UN TESTIMONIO MÁS','Las palabras de '+p.name,portrait(p)+'<p class="codex-intro">'+esc(p.counsel)+'</p><p class="ledger16-note">Regresa a la aldea. La familia podrá hablar ahora ante alguien que conoce el registro.</p>',[['Volver al camino','close']]);
}
function conclude(){
 var v=get(),p=who(v),st=current();if(!v.solved||!v.delivered||v.resolved||!p||st.scene!=='village')return;
 save({resolved:true});
 note('Escuché a la familia del canal. '+p.name+' ayudó a que su reclamación no quedara sin respuesta.');
 page('LA CUENTA DEL CANAL','Una familia toma la palabra','<p class="codex-intro">Una mujer de la familia del canal explica qué bienes recibieron y cuáles nunca llegaron a su casa. Natán escucha sin interrumpir: la copia encontrada no resuelve por sí sola la disputa.</p><div class="codex-parchment"><p>'+esc(p.ending)+'</p></div><p class="ledger16-note">Tus decisiones forman parte de tu diario. Puedes regresar a ver a '+esc(p.name)+' antes de continuar el viaje.</p>',[['Regresar a los caminos','close']]);
}
function followup(){
 var v=get(),p=who(v),st=current();if(!v.resolved||!p||v.followup||st.scene!==p.scene)return;
 save({followup:true});
 note('Volví a hablar con '+p.name+' después de escuchar a la familia del canal.');
 page('UNA VOZ QUE PERMANECE','Otra visita a '+p.name,portrait(p)+'<p class="codex-intro">'+esc(p.afterward)+'</p><p class="ledger16-note">El registro está a salvo. Aún quedan personas por escuchar y caminos por recorrer.</p>',[['Continuar','close']]);
}
function progress(){
 var v=get(),p=who(v);if(!v.solved)return;
 if(v.resolved){page('EL REGISTRO RECUPERADO','Lo que cambió', '<p class="codex-intro">'+esc(p?p.ending:'La familia pudo contar su versión de los hechos.')+'</p><p class="ledger16-note">El desacuerdo sigue abierto, pero el testimonio ya no está escondido.</p>',[['Regresar','close']]);return;}
 if(v.delivered){page('UN ENCUENTRO PENDIENTE','Escuchar a la familia','<p class="codex-intro">Has mostrado la copia a '+esc(p.name)+'. Ve a la aldea: la familia del canal merece hablar por sí misma.</p>',[['Regresar','close']]);return;}
 plan();
}
function actionsFor(id){
 var v=get(),p=who(v),items=[];if(!v.solved)return items;
 if(id==='spring'&&!v.delivered)items.push({label:v.entrusted?'Reconsiderar a quién confiar la cuenta':'Decidir qué hacer con la cuenta encontrada',id:'story:plan',icon:'▤'});
 if(p&&!v.delivered&&id===p.scene)items.push({label:'Mostrar la copia a '+p.name,id:'story:deliver',icon:'▤'});
 if(v.delivered&&!v.resolved&&id==='village')items.push({label:'Escuchar a la familia del canal',id:'story:conclude',icon:'◎'});
 if(v.resolved&&p&&!v.followup&&id===p.scene)items.push({label:'Volver a hablar con '+p.name+' sobre la familia',id:'story:followup',icon:'◎'});
 return items;
}
function ambientLine(id){
 var v=get(),p=who(v);
 if(v.resolved&&id==='village')return '\n\nEn las conversaciones del patio aún se habla de la familia del canal. Algunos vecinos han escuchado su versión; no todos comparten una conclusión.';
 if(v.delivered&&!v.resolved&&id==='village')return '\n\nUna familia espera junto a los patios. Alguien les ha hablado de una copia de la cuenta que creían perdida.';
 if(p&&v.delivered&&id===p.scene)return '\n\n'+p.name+' conserva noticia del registro hallado junto al agua.';
 return '';
}
function epilogue(){var v=get(),p=who(v);if(v.resolved&&p)return 'La familia del canal ha podido contar su historia con ayuda de '+p.name+'. No todas las disputas se resuelven de inmediato.';return '';}
function run(action){
 if(action==='close')return close();
 if(action==='plan')return plan();
 if(action==='deliver')return deliver();
 if(action==='conclude')return conclude();
 if(action==='followup')return followup();
 if(action==='result')return progress();
 if(action.indexOf('choose:')===0)return choose(action.slice(7));
 if(action.indexOf('check:')===0)return check(action.slice(6));
}
window.SENDAS_UI.register('ledger',run,function(action){return action.indexOf('choose:')===0||action.indexOf('check:')===0;});
window.SENDAS_LEDGER={run:run,actionsFor:actionsFor,ambientLine:ambientLine,epilogue:epilogue,status:get};
})();