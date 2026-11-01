/* SENDAS 2.2 · Umbral del capítulo III; usa motor, guardado y modal compartidos. */
(function(){
'use strict';
const api=()=>window.SENDAS_GAME_API;
const get=()=>window.SENDAS_CHAPTER_API.get();
const seen=s=>s.chapter22||{};
const view=(title,text,options)=>api().openPanel(title,'<p class="lead">'+text+'</p><div class="modal-actions">'+options.map(o=>'<button class="modal-choice" type="button" data-run="ch3:'+o[1]+'">'+o[0]+'<span>›</span></button>').join('')+'</div>','CAPÍTULO III · EL MENSAJERO');
const change=(key,value)=>{api().change(s=>{s.chapter22=s.chapter22||{stage:0,choices:{}};s.chapter22.choices=s.chapter22.choices||{};s.chapter22.choices[key]=value;s.chapter22.stage=Math.max(s.chapter22.stage||0,key==='route'?2:1);});};
function start(){const s=get();if(s.scene!=='yael')return;const c=seen(s);
if(c.stage>=2)return view('La decisión de Natán','El mensajero ha partido, y la tablilla espera su respuesta. El sendero hacia Magdala está abierto. Puedes seguirlo desde las rutas del pueblo.',[['Caminar hacia Magdala','travel'],['Regresar a Yael','close']]);
view('Una voz desde Magdala','El sol cae sobre el patio. Un hombre cubierto de polvo pide agua y entrega a Natán una pequeña tablilla. Habla de una segunda cuenta en Magdala. No sabe quién la escribió ni si es verdadera. Yael escucha desde el umbral: «Antes de marcharte, dime qué esperas encontrar. Mi familia no puede vivir de promesas».',[['Preguntar al mensajero por el origen de la tablilla','ask'],['Escuchar primero a Yael','yael'],['Guardar silencio y examinar la marca','mark']]);}
function run(k){if(k==='close'){api().closePanel();return;}if(k==='travel'){if(seen(get()).stage>=2)api().navigate('road3');return;}if(k==='return'){api().navigate('yael');return;}if(['water','bread','talk','ignore','observe','record','question','leave','magdala','doubt'].includes(k)){encounter(k);return;}if(!['ask','yael','mark','stay','go','consult'].includes(k))return;
const s=get();if(s.scene!=='yael')return;
if(['ask','yael','mark'].includes(k)){
change('approach',k);
const lines={ask:'El viajero admite que recibió la tablilla de otra mano. No puede asegurar que la segunda cuenta sea auténtica.',yael:'Yael señala el telar: «Puedes buscar la verdad; solo te pido que no confundas nuestro silencio con una autorización».',mark:'La marca se parece a una medida de grano, pero podría ser un sello de almacén. Natán se niega a extraer una certeza de un signo incompleto.'};
view('Lo que todavía no sabes',lines[k]+' Debes decidir cómo preparar el viaje.',[['Consultar a Yael antes de salir','consult'],['Partir para verificar el documento','go'],['Quedarte para ayudar a la familia','stay']]);return;}
change('route',k);
const lines={consult:'Le pides permiso para hablar de su caso fuera de Cafarnaúm. Yael consiente en que investigues la medida, pero no en divulgar el nombre de Eliab.',go:'Decides seguir el rastro, sin usar los nombres de la familia. Yael no te impide partir, aunque tu prisa deja una conversación pendiente.',stay:'Decides ayudar a organizar las provisiones antes de viajar. La tablilla espera en tu bolsa; el camino no se cierra, pero la búsqueda se retrasa.'};
api().remember('Capítulo III: '+lines[k]);
view('La promesa del camino',lines[k]+' La segunda cuenta conduce hacia Magdala. El sendero queda abierto.',[['Tomar el camino a Magdala','travel'],['Volver al patio','close']]);
}
function encounter(k){
 const s=get(),c=seen(s);if(!['road3','magdala3'].includes(s.scene)||c.stage<2)return;
 if(k==='water'||k==='bread'||k==='talk'||k==='ignore'){
  if(s.scene!=='road3'||c.roadChoice)return;
  const story={water:'Compartiste agua con un viajero que lleva dos días caminando. A cambio te indicó dónde se guardan las pesas del pequeño embarcadero.',bread:'Compartiste un trozo de pan. El viajero habló de un almacén junto al lago, pero no conocía al dueño.',talk:'Escuchaste al viajero sin ofrecer algo que no podías dar. Reconoció una marca parecida a la de la tablilla.',ignore:'Continuaste el trayecto sin detenerte. Llegaste antes, pero el origen de la tablilla sigue siendo más incierto.'};
  api().change(v=>{v.chapter22.roadChoice=k;v.chapter22.stage=3;if(k==='water'&&v.inv.agua>0){v.inv.agua--;}if(k==='bread'&&v.inv.pan>0){v.inv.pan--;}});
  api().remember('Camino a Magdala: '+story[k]);view('La senda del lago',story[k],[['Seguir hasta Magdala','magdala']]);return;
 }
 if(k==='observe'){
   api().change(v=>{v.chapter22.observed=true;v.chapter22.stage=Math.max(3,v.chapter22.stage);});
   view('La marca del almacén','Un cordel viejo ata tres tablillas. La inscripción de una coincide solo parcialmente con el signo del mensajero. Una semejanza no basta para identificar al deudor.',[['Hablar con el custodio','question'],['Volver a la orilla','close']]);return;
 }
 if(k==='question'||k==='record'||k==='doubt'){
   if(s.scene!=='magdala3')return;
   const result={question:'El custodio recuerda dos medidas empleadas en distintos intercambios. No quiere asegurar cuál llegó a Cafarnaúm.',record:'Copias las marcas sin llevarte el registro. El custodio pide conservar el original para que nadie cambie lo anotado.',doubt:'La segunda tablilla podría referirse a otra familia. Decides que no acusarás a nadie hasta comparar nombres y fechas.'};
   api().change(v=>{v.chapter22.clue=k;v.chapter22.stage=4;});
   api().remember('En Magdala: '+result[k]);
   view('Lo que todavía falta',result[k]+' Necesitarás volver a escuchar a Yael antes de sacar conclusiones.',[['Regresar a Cafarnaúm','return'],['Seguir observando el embarcadero','close']]);return;
 }
 if(k==='leave'){api().navigate('magdala3');return;}
 if(k==='magdala'){api().navigate('magdala3');return;}
}
function actions(scene){
 const s=get(),c=seen(s);if(c.stage<2)return [];
 const a=(label,id)=>({label,id:'ch3:'+id,icon:'▤'});
 if(scene==='road3'){
   if(!c.roadChoice)return [a('Compartir agua con el caminante','water'),a('Compartir pan','bread'),a('Escuchar su relato','talk'),a('Continuar sin detenerte','ignore'),a('Proseguir a Magdala','leave'),{label:'Regresar a la casa de Yael',id:'go:yael',icon:'←'}];
   return [a('Continuar hacia Magdala','magdala'),{label:'Volver a Cafarnaúm',id:'go:yael',icon:'←'}];
 }
 if(scene==='magdala3')return [a('Examinar las marcas de las tablillas','observe'),a('Preguntar al custodio por las medidas','question'),a('Copiar las señales sin llevar el original','record'),a('Considerar una explicación alternativa','doubt'),{label:'Volver a Cafarnaúm',id:'go:yael',icon:'←'}];
 return [];
}
function narration(scene){
 const c=seen(get()),approach=c.choices?.approach||'ask',road=c.roadChoice;
 if(scene==='road3')return 'La orilla del lago acompaña el sendero hacia Magdala. Un caminante descansa a la sombra, con el cántaro vacío. Natán lleva la tablilla bajo el manto. '+(road?'El encuentro ya ha dejado una huella en su diario.':'La decisión de ayudar puede costarle parte de sus provisiones.')+'\\n\\n'+(approach==='yael'?'Recuerda lo que Yael le pidió: no hablar en nombre de su hijo.':'Una señal grabada no es todavía una prueba.');
 if(scene==='magdala3')return 'Un embarcadero diferente, redes y comerciantes junto al agua. Un custodio ordena tablillas con señales de medidas de grano. Natán busca una segunda cuenta; aún desconoce si está relacionada con Yael.'+(c.clue?'\\n\\nLa conversación ha añadido una pista, no una sentencia.':'');
 return '';
}
window.SENDAS_CHAPTER22={start,run,actions,narration,available:()=>{const s=get();return s.scene==='yael'&&!!(s.chapter18&&s.chapter18.decision);}};
})();