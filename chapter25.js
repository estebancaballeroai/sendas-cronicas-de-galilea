/* SENDAS 2.5: panoramic scene art and context-aware hotspots.
   Preserve prior chapters, saves and the no-zoom decision. */
(function(host){
 'use strict';
 function fallbackFor(scene){return ({road3:'olive',magdala3:'dock'})[scene]||'cover';}
 function hotspots(scene,state){
   var compact=typeof host.innerWidth==='number'&&host.innerWidth<600;
   if(scene==='road3'){
     return state&&state.chapter22&&state.chapter22.roadChoice?
      [{x:68,y:52,label:'Ir a Magdala',id:'ch3:magdala'},{x:19,y:57,label:'Volver',id:'go:yael'}]:
      [{x:18,y:58,label:'Caminante',id:'ch3:talk'},{x:72,y:54,label:'Seguir camino',id:'ch3:leave'}];
   }
   if(scene==='magdala3'){
     var points=[{x:23,y:45,label:'Almacén',id:'m24:origin'},
      {x:53,y:53,label:'Pesas',id:'m24:weights'},
      {x:78,y:56,label:'Testigos',id:'m24:voices'},
      {x:47,y:76,label:'Estaciones',id:'m24:dates'}];
     return compact?points.slice(0,3):points;
   }
   return null;
 }
 function sceneStatus(scene,state){
   if(scene==='road3')return state&&state.chapter22&&state.chapter22.roadChoice?
      'El encuentro permanece en tu diario · Partida guardada':
      'Observa al caminante o sigue hacia Magdala';
   if(scene==='magdala3'){
     var d=state&&state.chapter24||{},n=Array.isArray(d.clues)?d.clues.length:0;
     if(d.reported)return 'Tu relato ha llegado a Yael · Partida guardada';
     if(d.compared)return 'Hipótesis formulada · Vuelve a hablar con Yael';
     return n+' de 4 indicios examinados · Necesitas 3 para comparar';
   }
   return '';
 }
 function messageVisual(title){
   if(title!=='Una voz desde Magdala')return '';
   return '<figure class="cinema25-arrival"><img src="assets/chapter23/messenger_courtyard.webp" data-sendas-fallback="assets/chapter18/galilea_courtyard_detail.webp" alt="Mensajero con una tablilla ante Natán y Yael, en el patio de la casa."><figcaption>EL MENSAJE · CAFARNAÚM</figcaption></figure>';
 }
 if(typeof document!=='undefined'&&document.addEventListener){
   document.addEventListener('error',function(event){
     var image=event.target;
     if(!image||image.tagName!=='IMG'||!image.dataset||!image.dataset.sendasFallback)return;
     var fallback=image.dataset.sendasFallback;
     image.dataset.sendasFallback='';
     image.src=fallback;
   },true);
 }
 host.SENDAS_CINEMA25=Object.freeze({version:'2.5.0',fallbackFor:fallbackFor,hotspots:hotspots,sceneStatus:sceneStatus,messageVisual:messageVisual});
})(window);