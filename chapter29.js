/* SENDAS 2.9 — Tres dias junto al lago.
 * Consequences unfold over three days. Uses the existing single save and shared modal.
 * No external services, extra counters or retroactive changes to earlier decisions.
 */
(function(host){'use strict';
const API=()=>host.SENDAS_GAME_API, READ=()=>host.SENDAS_CHAPTER_API.get(), UI=host.SENDAS_UI;
const DAYS={patio29:1,consejo29:2,orilla29:3};
const HEAR={patio29:['yael','neria','mara'],consejo29:['simeon','jonas','irit'],orilla29:['asaf','yael','neria']};
const CHOICES={
 first:{verify:'Acompa\u00f1ar a Neria para cotejar las marcas de los sacos',mend:'Dedicar la tarde a revisar la cuerda con Jon\u00e1s',family:'Quedarte con Yael y escuchar qu\u00e9 necesita la familia'},
 second:{gather:'Proponer una conversaci\u00f3n con consentimiento de los presentes',quiet:'Buscar acuerdos discretos, sin divulgar nombres',wait:'Conservar la carga bajo techo y aplazar el reparto'},
 final:{notes:'Dejar las notas en manos de Yael',offer:'Ofrecer una jornada de trabajo, sin prometer resultados',invite:'Pedir permiso para una nueva conversaci\u00f3n con los testigos'}
};
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=(value,valid)=>Array.isArray(value)?[...new Set(value.filter(x=>valid.includes(x)))]:[];
function shape(value){const d=value&&typeof value==='object'?value:{};
 const first=CHOICES.first[d.first]?d.first:null;
 const second=first&&CHOICES.second[d.second]?d.second:null;
 const final=second&&CHOICES.final[d.final]?d.final:null;
 let day=d.day===2||d.day===3?d.day:1;
 if(!first)day=1;else if(!second&&day===3)day=2;
 return{started:!!d.started,day,
 heard:{patio29:list(d.heard?.patio29,HEAR.patio29),consejo29:list(d.heard?.consejo29,HEAR.consejo29),orilla29:list(d.heard?.orilla29,HEAR.orilla29)},
 first,second,final};}
function state(){return shape(READ().chapter29);}
function unlocked(){const s=READ();return !!(s.chapter28?.closing&&s.chapter28?.plan&&CHOICES.first&&['transparent','privacy','accuse'].includes(s.chapter26?.ending)&&['reconcile','records','patient'].includes(s.chapter27?.choice));}
function currentScene(){const d=state();return d.day===1?'patio29':d.day===2?'consejo29':'orilla29';}
function canEnter(scene){return unlocked()&&state().started&&scene===currentScene();}
function note(text){API().remember('Tres d\u00edas: '+text);}
function change(mutator,log){let altered=false;API().change(s=>{s.chapter29=s.chapter29||{started:false,day:1,heard:{patio29:[],consejo29:[],orilla29:[]}};altered=!!mutator(s.chapter29);});if(altered&&log)note(log);if(altered)API().refresh();return altered;}
function start(){if(!unlocked()||READ().scene!=='yael')return;if(window.SENDAS_BRIDGES31?.redirect('patio29',READ()))return API().navigate('velada31');change(d=>{if(d.started)return false;d.started=true;d.day=1;return true;},'Yael invit\u00f3 a Nat\u00e1n a escuchar lo que sucede despu\u00e9s del reparto.');API().navigate(currentScene());}
const before={
 transparent:'Neria recuerda que contaste tambi\u00e9n lo que ignorabas. Ahora permite que examines sus marcas, pero no promete un resultado.',
 privacy:'La reserva de nombres ha evitado rumores. Neria aprecia la prudencia, aunque todav\u00eda no sabe qu\u00e9 cantidad puede salir.',
 accuse:'Neria no ha olvidado las sospechas que difundiste. Se mantiene a distancia: solo explicar\u00e1 aquello que presenci\u00f3.'
};
const planBody={
 secure:'La barca permanece asegurada. Los sacos est\u00e1n a cubierto, pero la espera pesa en las casas.',
 council:'La entrega provisional ha aliviado una necesidad, pero nadie sabe a\u00fan cu\u00e1nto podr\u00e1 compartirse despu\u00e9s.',
 record:'La revisi\u00f3n de las marcas ha comenzado. Las anotaciones se conservan sin declarar resuelta ninguna deuda.'
};
const talks={
 patio29:{
 yael:['La mesa de la familia','Yael muestra una cesta casi vac\u00eda. "No quiero que mi necesidad se convierta en la historia favorita del pueblo. Eliab pregunta cu\u00e1ndo habr\u00e1 pan; yo solo puedo decirle lo que s\u00e9". Acepta escuchar propuestas, pero insiste en conservar la decisi\u00f3n sobre su familia.'],
 neria:['Las marcas de Neria','Neria coloca una pesa de piedra junto a una tablilla. '+before.transparent+' "Estas marcas pueden referirse a dos entregas; nadie debe sumar las dos sin saber qui\u00e9n las recibi\u00f3".'],
 mara:['La voz de Mara','Mara se acerca desde el mercado. "No puedo ofrecer todo el grano que guardo: parte tiene destinatario". No huye de las preguntas. Pregunta si alguien ha pensado en quienes dependen de la pr\u00f3xima venta.']
 },
 consejo29:{
 simeon:['El consejo de Sim\u00e9on','Sim\u00e9on ha copiado solo lo que vio: dos columnas no permiten afirmar que hubo una sola entrega. "El nombre de alguien no convierte una hip\u00f3tesis en una prueba". Est\u00e1 dispuesto a cotejar los signos cuando las personas afectadas lo pidan.'],
 jonas:['El turno de Jon\u00e1s','Jon\u00e1s levanta una cuerda reparada a medias. "Puedo prestar mis manos, no prometer buen tiempo ni una embarcaci\u00f3n que no controlo". Si quieres su ayuda ma\u00f1ana, tendr\u00e1s que aceptar que otro trabajo quede sin hacer.'],
 irit:['La pregunta de Irit','Irit conoce las casas donde ya se racionan las provisiones. "Una entrega urgente ayuda, pero \u00bfqui\u00e9n vigila que no dejemos a otra familia sin nada?". Prefiere visitar a quienes no pueden acudir a una reuni\u00f3n.']
 },
 orilla29:{
 asaf:['Asaf junto al amarre','Asaf indica que el trabajo de la barca depende del viento y de manos disponibles. "Lo decidido hace dos d\u00edas ya cambi\u00f3 lo que hacemos. No digas que todo est\u00e1 arreglado solo porque te marchas".'],
 yael:['Lo que conserva Yael','Yael ha guardado las anotaciones bajo un pa\u00f1o. Eliab ayuda a separar unas espigas de la paja. "No sabemos cu\u00e1ndo acabar\u00e1 esto. S\u00ed sabemos qui\u00e9n nos escuch\u00f3 sin decidir por nosotros".'],
 neria:['Neria ante el trabajo','Neria vuelve a contar lo que es suyo y a apartar lo que falta verificar. "Si alguien pregunta ma\u00f1ana, mostrar\u00e9 mis propias marcas. No tengo derecho a revelar las de todos".']
 }
};
function meter(){const d=state(),scene=currentScene(),count=d.heard[scene].length;const steps=[d.first,d.second,d.final].filter(Boolean).length;
 return '<div class="m29-meter" aria-label="D\u00eda '+d.day+' de 3"><div class="m29-days"><strong>D\u00cdA '+d.day+' / 3</strong><span>'+steps+' decisiones que permanecen</span></div><div class="m29-track"><i style="width:'+(100*steps/3)+'%"></i></div><p>'+count+' de 3 voces escuchadas hoy. Necesitas escuchar al menos dos antes de decidir.</p></div>';
}
function btn(label,id){return '<button type="button" class="m29-option" data-m29="'+esc(id)+'">'+esc(label)+'<span aria-hidden="true">›</span></button>';}
function show(title,body,options){UI.show({module:'tresdias29',attribute:'data-m29',title,overline:'CAP\u00cdTULO V · TRES D\u00cdAS JUNTO AL LAGO',body:'<div class="m29-body">'+meter()+body+'</div><div class="m29-options">'+options.map(x=>btn(x[0],x[1])).join('')+'</div>'});}
function hear(person){const scene=READ().scene,d=state();if(!unlocked()||!d.started||scene!==currentScene()||!HEAR[scene].includes(person))return;
 change(raw=>{raw.heard=raw.heard||{};raw.heard[scene]=list(raw.heard[scene],HEAR[scene]);if(raw.heard[scene].includes(person))return false;raw.heard[scene].push(person);return true;},'escuch\u00e9 a '+person+' en el d\u00eda '+d.day+'.');
 const details=talks[scene][person],old=READ();let body=details[1];
 if(scene==='patio29'&&person==='neria')body=body.replace(before.transparent,before[old.chapter26.ending]);
 if(scene==='consejo29'&&person==='jonas'&&d.first==='mend')body+=' El tiempo que compartiste reparando el amarre ha dejado los nudos m\u00e1s seguros; a\u00fan necesita revisarlos.';
 if(scene==='orilla29'&&person==='yael'&&d.second==='gather')body+=' La conversaci\u00f3n de anoche fue posible porque preguntaste a quienes iban a participar.';
 show(details[0],'<p class="m29-quote">'+body+'</p><p>Nat\u00e1n anota lo que escuch\u00f3, distinguiendo el testimonio de su propia interpretaci\u00f3n.</p>',[['Seguir escuchando','close'],['Pensar en lo que cambia','status']]);
}
function ready(){const d=state(),scene=currentScene();return !!(unlocked()&&d.started&&d.heard[scene].length>=2);}
const narration={
 first:{verify:'Vuelves a la mesa de Neria. Ella acepta ense\u00f1ar sus marcas propias y explica por qu\u00e9 no debes interpretar las de otros. El tiempo empleado deja el amarre para el turno siguiente.',mend:'Ayudas a Jon\u00e1s a revisar los nudos de la cuerda. Cuando terminas, la luz se ha ido y la balanza del mercado permanece sin comparar.',family:'Te quedas cerca de Yael. Eliab pide escuchar una historia corta antes de dormir. La familia agradece tu presencia, pero otra persona tendr\u00e1 que comprobar las marcas.'},
 second:{gather:'Yael acepta una conversaci\u00f3n peque\u00f1a con quienes consienten en estar presentes. Sim\u00e9on no hace p\u00fablicas las copias y Neria explica solo sus propias medidas.',quiet:'Hablas en privado con quienes pueden decidir. Irit visita una casa que no acudi\u00f3 al encuentro; las noticias llegan m\u00e1s despacio, pero no se divulgan nombres.',wait:'Las personas acuerdan esperar un turno verificable. Los sacos quedan protegidos y nadie sale con promesas que no puede cumplir. La necesidad, sin embargo, no espera.'},
 final:{notes:'Dejas la copia con Yael y le explicas qu\u00e9 marcas siguen sin contrastar. Ella elige d\u00f3nde guardarla y a qui\u00e9n mostrarla.',offer:'Ofreces una jornada de trabajo en lugar de anunciar una soluci\u00f3n. Jon\u00e1s podr\u00e1 llamarte cuando haya manos y barca disponibles.',invite:'Pides permiso para un nuevo encuentro. Yael no responde por los dem\u00e1s; consultar\u00e1 a Neria, Asaf y a quienes tienen inter\u00e9s en la carga.'}
};
function statusLines(){const d=state(),s=READ(),plan=s.chapter28?.plan,origin=s.chapter26?.ending;
 let family=origin==='accuse'?'Confianza herida':origin==='privacy'?'Confianza cautelosa':'Escucha abierta';
 if(d.first==='family')family='Acompa\u00f1amiento reconocido';
 if(d.second==='gather'&&origin!=='accuse')family='Acuerdo incipiente';
 if(d.second==='quiet'&&origin==='accuse')family='Una confianza por reconstruir';
 let cargo={secure:'Sacos a cubierto; distribuci\u00f3n pendiente',council:'Reparto provisional; medidas pendientes',record:'Medidas en revisi\u00f3n; propiedad por aclarar'}[plan]||'Situaci\u00f3n pendiente';
 if(d.first==='verify')cargo='Marcas contrastadas parcialmente; sin resolver la propiedad';
 if(d.first==='mend')cargo='Amarre m\u00e1s seguro; reparto sin concluir';
 if(d.second==='wait')cargo='Carga conservada; familias todav\u00eda a la espera';
 if(d.second==='gather')cargo='Acuerdo limitado; ninguna deuda extinguida';
 const labor=d.first==='mend'?'Jon\u00e1s revis\u00f3 contigo una cuerda':d.second==='quiet'?'Irit pudo visitar una casa apartada':d.first==='verify'?'Neria pudo contrastar parte de sus marcas':'El trabajo del muelle sigue';
 return [{label:'La familia de Yael',value:family},{label:'La carga',value:cargo},{label:'Los vecinos',value:labor}];
}
function statusPanel(){if(!unlocked()||!state().started)return;const d=state();const rows=statusLines().map(x=>'<div class="m29-effect"><strong>'+esc(x.label)+'</strong><span>'+esc(x.value)+'</span></div>').join('');
 const previous=['first','second','final'].filter(k=>d[k]).map(k=>'<p><strong>'+({first:'Primera tarde',second:'Segunda noche',final:'Tercer d\u00eda'}[k])+':</strong> '+esc(CHOICES[k][d[k]])+'</p>').join('');
 show('Lo que est\u00e1 cambiando','<p>Ninguna cifra de confianza sustituye la voz de una persona. Estas consecuencias describen hechos y relaciones, no puntos de juego.</p><div class="m29-effects">'+rows+'</div>'+previous,[['Regresar al lugar','close']]);
}
function deliberate(){const scene=READ().scene,d=state();if(!unlocked()||!d.started||scene!==currentScene())return;
 if(!ready())return show('Escuchar antes de elegir','<p>Hay personas que todav\u00eda no has escuchado. Necesitas al menos dos voces de esta jornada antes de elegir; las otras pueden quedar sin consultar y eso formar\u00e1 parte de tu historia.</p>',[['Volver a escuchar','close']]);
 const key=d.day===1?'first':d.day===2?'second':'final';
 if(d[key])return consequence(key,d[key]);
 const question=d.day===1?'Queda poco sol. Solo puedes dedicar esta tarde a una de estas acciones. \u00bfD\u00f3nde estar\u00e1s?':d.day===2?'La noche cae y siguen faltando respuestas. Cada posibilidad deja a alguien esperando. \u00bfQu\u00e9 propones?':'Tercer d\u00eda. Has visto resultados parciales y l\u00edmites reales. \u00bfQu\u00e9 compromiso s\u00ed puedes asumir?';
 show(d.day===1?'La tarde tiene un l\u00edmite':d.day===2?'Cuando se hace de noche':'La promesa que puede cumplirse','<p>'+question+'</p><div class="m29-effects">'+statusLines().map(x=>'<div class="m29-effect"><strong>'+esc(x.label)+'</strong><span>'+esc(x.value)+'</span></div>').join('')+'</div>',Object.entries(CHOICES[key]).map(([code,text])=>[text,'pick:'+key+':'+code]).concat([['Seguir escuchando','close']]));
}
function choose(key,code){const d=state(),scene=READ().scene;if(!unlocked()||!ready()||scene!==currentScene())return;
 const expected=d.day===1?'first':d.day===2?'second':'final';if(expected!==key||!CHOICES[key][code])return;
 if(d[key]&&d[key]!==code)return;
 change(raw=>{if(raw[key])return false;raw[key]=code;return true;},'decid\u00ed '+CHOICES[key][code].toLowerCase()+'.');
 consequence(key,code);
}
function consequence(key,code){const d=state();if(!CHOICES[key]?.[code]||d[key]!==code)return;let text=narration[key][code];
 if(key==='second'&&d.first==='family')text+=' Yael reconoce que te quedaste a escucharla antes de proponer nada.';
 if(key==='second'&&d.first==='verify')text+=' Neria aporta las marcas que comparti\u00f3 contigo, no el cuaderno completo de otra persona.';
 if(key==='second'&&d.first==='mend')text+=' Jon\u00e1s insiste en revisar el amarre antes de cualquier viaje.';
 if(key==='final'&&READ().chapter26?.ending==='accuse')text+=' Las palabras precipitadas de Magdala no desaparecen; reparar la confianza tomar\u00e1 tiempo.';
 if(key==='final'&&d.second==='wait')text+=' Otra jornada habr\u00e1 de llegar antes de saber si el transporte es posible.';
 const buttons=key==='first'?[['Terminar la tarde · Segundo d\u00eda','advance:2'],['Quedarse un momento','close']]:key==='second'?[['Dejar pasar la noche · Tercer d\u00eda','advance:3'],['Quedarse un momento','close']]:[['Ver las consecuencias en el diario','status'],['Volver a la orilla','close']];
 show(key==='first'?'Lo que dejaste para ma\u00f1ana':key==='second'?'Una noche que deja huella':'Tres d\u00edas, un camino abierto','<p class="m29-quote">'+text+'</p><p>Esta decisi\u00f3n permanece en tu partida. No se cambia regresando a la escena.</p>',buttons);
}
function advance(day){const d=state(),scene=READ().scene;const prev=day===2?'first':'second';if(!unlocked()||!d.started||!((d.day===day-1)||(d.day===day))||!d[prev])return;
 if(d.day===day-1&&scene!==currentScene())return;
 change(raw=>{if(raw.day===day)return false;raw.day=day;return true;},day===2?'pas\u00f3 la primera noche; vuelvo a escuchar a quienes esperan.':'llega el tercer d\u00eda; el trabajo y las relaciones muestran sus consecuencias.');
 API().navigate(currentScene());
}
function actions(scene){if(!unlocked())return[];const d=state();if(scene==='yael')return[{label:!d.started?'Tres d\u00edas junto al lago · Comenzar cap\u00edtulo V':'Regresar al d\u00eda '+d.day+' · Tres d\u00edas junto al lago',id:d.started?'go:'+currentScene():'m29:start',icon:'\u25cc'},...(d.started?[{label:'Recordar lo que cambi\u00f3 durante estos d\u00edas',id:'m29:status',icon:'\u25a4'}]:[])];
 if(scene!==currentScene()||!d.started)return[];
 const people=HEAR[scene],names={yael:'Yael',neria:'Neria',mara:'Mara',simeon:'Sim\u00e9on',jonas:'Jon\u00e1s',irit:'Irit',asaf:'Asaf'};
 const key=d.day===1?'first':d.day===2?'second':'final';
 const choices=people.map(w=>({label:(d.heard[scene].includes(w)?'Recordar las palabras de ':'Escuchar a ')+names[w],id:'m29:hear:'+w,icon:'\u25ce'}));
 choices.push({label:d[key]?'Recordar tu decisi\u00f3n':'Decidir c\u00f3mo actuar hoy',id:'m29:deliberate',icon:'\u25a4'});
 if(d.day===1&&d.first)choices.push({label:'Ir al segundo d\u00eda',id:'m29:advance:2',icon:'\u2192'});
 if(d.day===2&&d.second)choices.push({label:'Ir al tercer d\u00eda',id:'m29:advance:3',icon:'\u2192'});
 choices.push({label:'Ver cambios en la aldea',id:'m29:status',icon:'\u25c7'});
 choices.push({label:'Visitar la casa de Yael',id:'go:yael',icon:'\u2302'});
 return choices;
}
function narrationFor(scene){const d=state(),plan=READ().chapter28?.plan;
 if(scene==='patio29')return 'PRIMER D\u00cdA · LA TARDE DESPU\u00c9S DEL REPARTO\n\n'+planBody[plan]+' En el patio, Yael, Neria y Mara no comparten una sola versi\u00f3n de lo que hace falta. Eliab escucha tras la puerta.\n\nEl sol empieza a bajar. Puedes escuchar a todos, pero solo tendr\u00e1s tiempo para una tarea antes de la noche.'+(d.first?'\n\nLo que elegiste ya ha ocupado esta tarde. '+narration.first[d.first]:'');
 if(scene==='consejo29')return 'SEGUNDO D\u00cdA · LA NOCHE DE LAS VOCES\n\n'+(d.first?narration.first[d.first]+'\n\n':'')+'En una mesa iluminada por una l\u00e1mpara se han reunido algunos vecinos. Sim\u00e9on aporta prudencia, Jon\u00e1s recuerda el trabajo pendiente e Irit pregunta por quienes no pueden venir. Nadie espera que Nat\u00e1n resuelva todas las cuentas.'+(d.second?'\n\nLa conversaci\u00f3n termin\u00f3 en un acuerdo limitado: '+narration.second[d.second]:'');
 if(scene==='orilla29')return 'TERCER D\u00cdA · EL LAGO GUARDA MEMORIA\n\n'+(d.second?narration.second[d.second]+'\n\n':'')+'Las barcas contin\u00faan junto al agua, algunas medidas siguen sin aclararse y Yael guarda las notas que decidi\u00f3 conservar. Asaf, Neria y la familia no han vivido estos d\u00edas del mismo modo. Puedes escuchar lo que cambi\u00f3 antes de comprometerte con un paso posible.'+(d.final?'\n\nTu compromiso: '+narration.final[d.final]:'');
 return '';
}
function hotspots(scene){if(scene==='patio29')return[{x:44,y:47,label:'Yael',id:'m29:hear:yael'},{x:72,y:53,label:'Neria',id:'m29:hear:neria'},{x:52,y:78,label:'Las medidas',id:'m29:status'}];
 if(scene==='consejo29')return[{x:19,y:49,label:'Sim\u00e9on',id:'m29:hear:simeon'},{x:46,y:56,label:'Irit',id:'m29:hear:irit'},{x:63,y:55,label:'Jon\u00e1s',id:'m29:hear:jonas'}];
 if(scene==='orilla29')return[{x:29,y:64,label:'Asaf',id:'m29:hear:asaf'},{x:76,y:61,label:'Neria',id:'m29:hear:neria'},{x:88,y:37,label:'Yael',id:'m29:hear:yael'}];return[];}
function status(scene){if(!unlocked())return'';const d=state();if(scene===currentScene()&&d.started)return d.final?'D\u00eda 3 · Tu compromiso permanece':'D\u00eda '+d.day+'/3 · '+d.heard[scene].length+' de 3 voces escuchadas';if(scene==='yael'&&d.started)return 'Cap\u00edtulo V · D\u00eda '+d.day+' de 3';return'';}
function objective(){const d=state();return {unlocked:unlocked(),started:d.started,day:d.day,complete:!!d.final,description:d.final?'Una promesa limitada, con consecuencias permanentes.':d.started?'D\u00eda '+d.day+' de 3; escucha al menos dos voces de la jornada.':'Contin\u00faa despu\u00e9s de hablar con Yael al terminar el cap\u00edtulo IV.'};}
function run(action){if(action==='close')return API().closePanel();if(action==='start')return start();if(action==='status')return statusPanel();if(action==='deliberate')return deliberate();if(action.indexOf('hear:')===0)return hear(action.slice(5));if(action.indexOf('pick:')===0){const parts=action.split(':');if(parts.length===3)return choose(parts[1],parts[2]);}if(action==='advance:2')return advance(2);if(action==='advance:3')return advance(3);}
if(UI)UI.register('tresdias29',run,action=>action.startsWith('hear:')||action==='status');
host.SENDAS_CHAPTER29=Object.freeze({version:'2.9.0',unlocked,state,canEnter,currentScene,actions,narration:narrationFor,hotspots,status,objective,statusLines,run});
})(window);
