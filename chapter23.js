/* SENDAS 2.3 — Regreso de Magdala. Investigación con consentimiento y efectos persistentes. */
(function(){'use strict';
const api=()=>window.SENDAS_GAME_API;
const state=()=>window.SENDAS_CHAPTER_API.get();
const detail=()=>state().chapter23||{};
const choice=()=>state().chapter22||{};
const panel=(title,body,buttons)=>api().openPanel(title,'<p class="lead">'+body+'</p><div class="modal-actions">'+buttons.map(b=>'<button type="button" class="modal-choice" data-run="ch4:'+b[1]+'">'+b[0]+'<span>›</span></button>').join('')+'</div>','CAPÍTULO III · LA SEGUNDA CUENTA');
function save(patch){api().change(s=>{s.chapter23=Object.assign({},s.chapter23||{},patch);});api().refresh();}
function valid(){const s=state();return s.chapter22?.stage>=4&&!!s.chapter22.clue;}
function open(){if(state().scene!=='yael'||!valid())return;const d=detail();if(d.finished)return recap();
 if(d.listened)return decide();
 const c=choice();const lead=c.choices?.route==='consult'?'Yael recuerda que le pediste permiso para consultar las medidas.':'Yael recuerda tu partida y espera saber qué has averiguado.';
 panel('Lo que trae Natán',lead+' La segunda tablilla no basta para identificar una deuda. Eliab escucha detrás del telar. Yael desea comprender qué puede demostrar el registro, y qué no.',[['Mostrar primero las diferencias entre las medidas','compare'],['Pedir a Yael que explique lo que recibió','listen'],['Afirmar que el registro ya demuestra el fraude','claim']]);
}
function compare(){if(!valid())return;save({compared:true});panel('Dos medidas distintas','Natán enseña los trazos que copió en Magdala. Los signos se parecen, pero las cantidades y el momento del intercambio no coinciden claramente. Yael pide mirar el documento a su ritmo.',[['Escuchar la versión de Yael','listen'],['Guardar la copia','close']]);}
function listen(){if(!valid())return;save({listened:true});api().remember('Escuché a Yael antes de interpretar la segunda cuenta de Magdala.');decide();}
function claim(){if(!valid())return;save({hasty:true,listened:true});api().remember('Afirmé más de lo que demostraba la tablilla; Yael me pidió prudencia.');panel('La confianza se vuelve frágil','Yael te interrumpe: «No quiero una historia que suene bien; quiero saber qué puede comprobarse». Natán reconoce su precipitación.',[['Reconocer el error y escuchar','decide'],['Volver después','close']]);}
function decide(){if(!valid()||!detail().listened)return open();const c=choice(),d=detail();const found=c.clue==='record'?'Tienes una copia de las marcas.':c.clue==='question'?'El custodio recordó dos medidas diferentes.':'Tu duda evitó una acusación precipitada.';
 panel('La decisión de Yael','Yael escucha el relato y explica las provisiones que llegaron a su casa. '+found+' ¿Qué harás ahora?',[
 ['Pedir permiso para volver a comparar las cuentas','ask'],
 ['Invitar a Mara y Siméon a revisar los registros juntos','gather'],
 ['Dejar el documento a Yael y respetar su tiempo','leave']
 ]);}
function finish(k){if(!valid()||!detail().listened||!['ask','gather','leave'].includes(k))return;
 const c=choice(),d=detail();
 const endings={
 ask:'Yael autoriza a Natán a pedir una segunda copia, sin mencionar el nombre de Eliab. No declara la deuda resuelta: primero desea comparar ambas medidas.',
 gather:'Yael acepta una conversación con los vecinos, pero exige estar presente y decidir qué partes de su historia se compartirán. El testimonio de Mara y la escritura de Siméon se contrastarán sin convertirlos en jueces.',
 leave:'Yael guarda la copia con sus objetos familiares. Agradece que Natán no le imponga una respuesta. El registro espera una revisión futura y su decisión queda abierta.'
 };
 const consequence=(c.choices?.route==='go'?' Recuerda que Natán se marchó con demasiada prisa.':'')+(d.hasty?' La afirmación precipitada de Natán ha dejado una sombra sobre la confianza.':'');
 save({finished:true,outcome:k});
 api().remember('Magdala y Yael: '+endings[k]);
 panel('El peso de una palabra',endings[k]+consequence,[['Volver al patio','close']]);}
function recap(){const d=detail();const endings={ask:'La segunda copia será solicitada con consentimiento de Yael.',gather:'Los vecinos podrán comparar las cuentas en presencia de Yael.',leave:'Yael conserva el registro y decidirá cuándo continuar.'};panel('Lo que queda pendiente',endings[d.outcome]||'Todavía quedan relatos por escuchar.',[['Regresar a la aldea','close']]);}
function run(k){if(k==='close')return api().closePanel();if(k==='open')return open();if(k==='compare')return compare();if(k==='listen')return listen();if(k==='claim')return claim();if(k==='decide')return decide();if(k==='ask'||k==='gather'||k==='leave')return finish(k);}
function actionsFor(scene){if(scene!=='yael'||!valid())return [];return [{label:detail().finished?'Recordar lo acordado con Yael':'Contarle a Yael lo descubierto en Magdala',id:'ch4:open',icon:'▤'}];}
function epilogue(){const d=detail();if(!d.finished)return '';return {ask:'Natán deberá pedir una copia sin divulgar nombres.',gather:'La familia espera una conversación conjunta.',leave:'Yael conserva el derecho de decidir cuándo seguir.'}[d.outcome]||'';}
window.SENDAS_CHAPTER23={run,actionsFor,epilogue};
})();