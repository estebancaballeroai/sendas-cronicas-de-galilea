/* SENDAS 2.2 · Umbral del capítulo III; usa motor, guardado y modal compartidos. */
(function(){
'use strict';
const api=()=>window.SENDAS_GAME_API;
const get=()=>window.SENDAS_CHAPTER_API.get();
const seen=s=>s.chapter22||{};
const view=(title,text,options)=>api().openPanel(title,'<p class="lead">'+text+'</p><div class="modal-actions">'+options.map(o=>'<button class="modal-choice" type="button" data-run="ch3:'+o[1]+'">'+o[0]+'<span>›</span></button>').join('')+'</div>','CAPÍTULO III · EL MENSAJERO');
const change=(key,value)=>{api().change(s=>{s.chapter22=s.chapter22||{stage:0,choices:{}};s.chapter22.choices=s.chapter22.choices||{};s.chapter22.choices[key]=value;s.chapter22.stage=Math.max(s.chapter22.stage||0,key==='route'?2:1);});};
function start(){const s=get();if(s.scene!=='yael')return;const c=seen(s);
if(c.stage>=2)return view('El camino que elegiste','El mensajero ha partido. Has guardado tu respuesta; aún no se ha abierto el camino a Magdala. Tu elección espera el próximo episodio.',[['Regresar a Yael','close']]);
view('Una voz desde Magdala','El sol cae sobre el patio. Un hombre cubierto de polvo pide agua y entrega a Natán una pequeña tablilla. Habla de una segunda cuenta en Magdala. No sabe quién la escribió ni si es verdadera. Yael escucha desde el umbral: «Antes de marcharte, dime qué esperas encontrar. Mi familia no puede vivir de promesas».',[['Preguntar al mensajero por el origen de la tablilla','ask'],['Escuchar primero a Yael','yael'],['Guardar silencio y examinar la marca','mark']]);}
function run(k){if(k==='close'){api().closePanel();return;}if(!['ask','yael','mark','stay','go','consult'].includes(k))return;
const s=get();if(s.scene!=='yael')return;
if(['ask','yael','mark'].includes(k)){
change('approach',k);
const lines={ask:'El viajero admite que recibió la tablilla de otra mano. No puede asegurar que la segunda cuenta sea auténtica.',yael:'Yael señala el telar: «Puedes buscar la verdad; solo te pido que no confundas nuestro silencio con una autorización».',mark:'La marca se parece a una medida de grano, pero podría ser un sello de almacén. Natán se niega a extraer una certeza de un signo incompleto.'};
view('Lo que todavía no sabes',lines[k]+' Debes decidir cómo preparar el viaje.',[['Consultar a Yael antes de salir','consult'],['Partir para verificar el documento','go'],['Quedarte para ayudar a la familia','stay']]);return;}
change('route',k);
const lines={consult:'Le pides permiso para hablar de su caso fuera de Cafarnaúm. Yael consiente en que investigues la medida, pero no en divulgar el nombre de Eliab.',go:'Decides seguir el rastro, sin usar los nombres de la familia. Yael no te impide partir, aunque tu prisa deja una conversación pendiente.',stay:'Decides ayudar a organizar las provisiones antes de viajar. La tablilla espera en tu bolsa; el camino no se cierra, pero la búsqueda se retrasa.'};
api().remember('Capítulo III: '+lines[k]);
view('La promesa del camino',lines[k]+' La segunda cuenta conduce hacia Magdala; el capítulo continuará desde esta elección.',[['Volver al patio','close']]);
}
window.SENDAS_CHAPTER22={start,run,available:()=>{const s=get();return s.scene==='yael'&&!!(s.chapter18&&s.chapter18.decision);}};
})();