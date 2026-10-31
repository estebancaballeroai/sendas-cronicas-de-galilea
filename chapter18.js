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
function show(){
 var s=get();if(!eligible(s))return;
 var ch=s.chapter18||{stage:0,choices:[]},w=s.codex.entrusted||'mara';
 var root=document.getElementById('chapter18-root');if(!root){root=document.createElement('div');root.id='chapter18-root';document.body.appendChild(root);}
 var lead=branches[w]||branches.mara;
 var text=ch.stage===0?'El sol alcanza la casa del canal. Yael separa un pequeño montón de grano para el día. Eliab observa sus manos sin preguntar. '+lead:ch.stage===1?'Yael deja la medida sobre la mesa. «No necesito que hables por mí, Natán. Necesito saber qué estás dispuesto a escuchar».': 'Yael asiente lentamente. «Mañana veremos qué queda por hacer. Por hoy, al menos, me has escuchado».';
 var choices=ch.stage===0?[['Preguntar a Yael qué necesita','listen'],['Examinar la medida de grano','measure'],['Ofrecer ayuda antes de preguntar','offer']]:ch.stage===1?[['Escuchar sin prometer nada','respect'],['Prometer hablar por la familia','speak'],['Pedir permiso para consultar el registro','ask']]:[['Volver al pueblo','close']];
 root.innerHTML='<div class="ch18-shade"><section class="ch18-panel" role="dialog" aria-modal="true" aria-label="El amanecer de las deudas"><button class="ch18-close" data-ch18-choice="close" aria-label="Cerrar">×</button><p class="ch18-overline">CAPÍTULO II · EL PESO DE LA VERDAD</p><h2>El amanecer de las deudas</h2><p class="ch18-scene">Casa de Yael · Cafarnaúm · Amanecer</p><p class="ch18-story">'+text+'</p><div class="ch18-options">'+choices.map(function(c){return '<button data-ch18-choice="'+c[1]+'" class="'+((ch.choices||[]).indexOf(c[1])!==-1?'ch18-seen':'')+'">'+c[0]+'</button>';}).join('')+'</div><p class="ch18-foot">Las decisiones se guardan en esta partida.</p></section></div>';
}
document.addEventListener('click',function(e){var b=e.target.closest('[data-ch18],[data-ch18-choice]');if(!b)return;var choice=b.getAttribute('data-ch18-choice');if(!choice){show();return;}if(choice==='close'){document.getElementById('chapter18-root')?.remove();return;}
 patch(function(ch){ch.choices=ch.choices||[];if(ch.choices.indexOf(choice)<0)ch.choices.push(choice);if(ch.stage===0){ch.stage=1;}else if(ch.stage===1){ch.stage=2;}ch.lastChoice=choice;});
 show();
});
var actions=document.getElementById('actions');if(actions)new MutationObserver(button).observe(actions,{childList:true});document.addEventListener('click',function(){setTimeout(button,0)});button();
})();