/* SENDAS 1.8.0 — El amanecer de las deudas. Additive module, preserves 1.7 saves. */
(function(){
'use strict';
var KEY='sendas_cronicas_ilustrada_1';
var branches={
 mara:'Mara ha traído sus pesos para revisar la cuenta. Yael no sabe si aceptar la ayuda de quien participó en la venta.',
 jonas:'Jonás ha ofrecido preguntar por trabajo en el embarcadero. Yael teme que la propuesta se convierta en otra deuda.',
 simeon:'Siméon conserva una copia del registro. Yael quiere saber quién tendrá acceso a lo que su familia diga.'
};
function get(){return window.SENDAS_CHAPTER_API?window.SENDAS_CHAPTER_API.get():null;}
function patch(fn){var s=get();if(!s)return null;s.chapter18=s.chapter18||{stage:0,choices:[],notes:[]};fn(s.chapter18,s);if(window.SENDAS_CHAPTER_API)window.SENDAS_CHAPTER_API.setChapter18(s.chapter18);return s;}
function eligible(s){return !!(s&&s.codex&&(s.codex.delivered||s.codex.resolved||s.codex.followup));}
function button(){var s=get(),host=document.getElementById('actions');if(!host||!eligible(s))return; if(host.querySelector('[data-ch18]'))return;
 var b=document.createElement('button');b.type='button';b.className='action-btn';b.setAttribute('data-ch18','open');b.textContent='Capítulo II · Visitar a la familia del canal';host.appendChild(b);
}
var topics={
 listen:{label:'¿Qué necesita tu familia?',speaker:'Yael',text:'«Que nos escuches antes de ofrecer una solución. No quiero que Eliab aprenda a pedir permiso para tener hambre».',next:['grain','work','account']},
 grain:{label:'¿Cuánto grano os queda?',speaker:'Yael',text:'«Dos días. Tal vez tres, si mezclo la harina con lentejas. Antes de esta cuenta guardábamos para una semana».',next:['future','account','listen']},
 future:{label:'¿Y después de esos días?',speaker:'Yael',text:'«No lo sé. Y eso me avergüenza más que la deuda. He pensado vender el telar, pero entonces tampoco tendré trabajo».',next:['work','account','listen']},
 work:{label:'¿Qué te dijo Jonás del trabajo?',speaker:'Yael',text:'«Que podría haber redes que remendar. No he dicho que sí. Necesito conocer las condiciones, no cambiar una deuda por otra».',next:['promise','account','listen']},
 account:{label:'¿Qué ocurrió con la cuenta?',speaker:'Yael',text:'«El comerciante afirma que recibimos más grano. Recuerdo dos medidas distintas. Mara estaba allí, pero no quiero acusarla sin saber».',next:['measure','mara','listen']},
 measure:{label:'¿Puedo examinar las medidas?',speaker:'Natán',text:'La medida tiene dos marcas. Una coincide con el registro; la otra parece trazada después. Una diferencia no demuestra todavía quién la hizo.',next:['permission','mara','account']},
 mara:{label:'¿Confías en Mara?',speaker:'Yael',text:'«Confío en que no quisiera hacernos daño. Pero confiar en alguien no significa entregarle nuestra voz».',next:['permission','account','listen']},
 permission:{label:'¿Puedo consultar el registro?',speaker:'Yael',text:'«Sí. Pero antes prométeme que no mencionarás a Eliab en el mercado. Mi hijo no es una prueba que puedas exhibir».',next:['promise','account','listen']},
 promise:{label:'¿Qué puedo prometerte?',speaker:'Yael',text:'«No me prometas justicia antes de conocer la verdad. Promete que volverás y que nos preguntarás antes de actuar».',next:['commit','listen','account']},
 commit:{label:'Prometer discreción y regresar',speaker:'Yael',text:'«Entonces esperaré tu regreso. No porque hayas resuelto nada, sino porque has escuchado lo que te pedía».',next:['listen','account','work']},
 eliab:{label:'Hablar con Eliab',speaker:'Eliab',text:'«Mi madre dice que no me preocupe. Pero anoche contó las monedas dos veces. Creía que yo dormía».',next:['listen','grain','future']}
};
var first={mara:'Mara ha ofrecido revisar las medidas, pero Yael todavía duda si aceptar su intervención.',jonas:'Jonás ha mencionado trabajo en el lago. Yael teme aceptar sin conocer las condiciones.',simeon:'Siméon conserva una copia del registro; Yael pregunta quién podrá leerla.'};
function show(){
 var s=get();if(!eligible(s))return;
 var ch=s.chapter18||{stage:0,choices:[],notes:[]},w=s.codex.entrusted||'mara';
 var root=document.getElementById('chapter18-root');if(!root){root=document.createElement('div');root.id='chapter18-root';document.body.appendChild(root);}
 var topic=topics[ch.current]||null;
 var speaker=topic?topic.speaker:'Yael';
 var line=topic?topic.text:'«Natán, quisiera pagar lo que debemos. Pero si entrego el grano que queda, ¿qué comerá Eliab mañana?» '+(first[w]||first.mara);
 var options=topic?topic.next:['listen','account','eliab','measure'];
 var seen=ch.choices||[];
 root.innerHTML='<div class="ch18-shade"><section class="ch18-panel" role="dialog" aria-modal="true" aria-label="Conversación con Yael"><button class="ch18-close" data-ch18-choice="close" aria-label="Cerrar">×</button><p class="ch18-overline">CAPÍTULO II · EL PESO DE LA VERDAD</p><h2>El amanecer de las deudas</h2><p class="ch18-scene">Casa de Yael · Cafarnaúm · Amanecer</p><div class="ch18-art" role="img" aria-label="Patio de una casa galilea al amanecer"><div class="ch18-art-label">CASA DE YAEL · GALILEA</div></div><div class="ch18-dialogue-head"><img class="ch18-avatar" src="assets/portrait_irit.webp" alt="Retrato ilustrado de referencia"><p class="ch18-speaker">'+speaker+'</p></div><p class="ch18-story">'+line+'</p><p class="ch18-questions">¿Qué quieres preguntar?</p><div class="ch18-options">'+options.map(function(id){var item=topics[id];return '<button data-ch18-choice="'+id+'" class="'+(seen.indexOf(id)!==-1?'ch18-seen':'')+'" aria-label="'+item.label+(seen.indexOf(id)!==-1?' (ya conversado)':'')+'">'+item.label+(seen.indexOf(id)!==-1?' <small>Ya conversado</small>':'')+'</button>';}).join('')+'</div><button class="ch18-leave" data-ch18-choice="close">Terminar conversación</button><p class="ch18-foot">Puedes volver a consultar cualquier pregunta. Las elecciones quedan guardadas.</p></section></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ch18],[data-ch18-choice]');if(!b)return;var choice=b.getAttribute('data-ch18-choice');if(!choice){show();return;}if(choice==='close'){document.getElementById('chapter18-root')?.remove();return;}
 patch(function(ch){ch.choices=ch.choices||[];if(ch.choices.indexOf(choice)<0)ch.choices.push(choice);ch.current=choice;ch.stage=Math.max(ch.stage||0,1);ch.lastChoice=choice;});
 show();
});
var actions=document.getElementById('actions');if(actions)new MutationObserver(button).observe(actions,{childList:true});document.addEventListener('click',function(){setTimeout(button,0)});button();
})();