/* SENDAS mobile controls 1.3.1 — zoom photographs without hiding actions or hotspots. */
(()=>{'use strict';
 const q=id=>document.getElementById(id),light=q('scene-lightbox'),viewport=q('zoom-viewport'),image=q('zoom-art');
 let scale=1,dx=0,dy=0,pointers=new Map(),lastDistance=0;
 function clamp(){scale=Math.max(1,Math.min(4,scale));const r=viewport.getBoundingClientRect();dx=Math.max(-r.width*(scale-1)/2,Math.min(r.width*(scale-1)/2,dx));dy=Math.max(-r.height*(scale-1)/2,Math.min(r.height*(scale-1)/2,dy));}
 function draw(){clamp();image.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${scale})`;}
 function close(){light.hidden=true;pointers.clear();lastDistance=0;}
 function open(){image.src=q('scene-art').currentSrc||q('scene-art').src;image.alt=q('scene-art').alt; q('zoom-scene-title').textContent=q('scene-place').textContent;scale=1;dx=dy=0;draw();light.hidden=false;q('zoom-close').focus();}
 q('btn-scene-zoom').addEventListener('click',open);
 q('zoom-close').addEventListener('click',close);
 q('zoom-plus').addEventListener('click',()=>{scale=Math.min(scale+.5,4);draw();});
 q('zoom-minus').addEventListener('click',()=>{scale=Math.max(1,scale-.5);if(scale===1){dx=dy=0;}draw();});
 viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});lastDistance=0;});
 viewport.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const previous=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});let arr=[...pointers.values()];if(arr.length===1){dx+=e.clientX-previous.x;dy+=e.clientY-previous.y;}else if(arr.length>=2){const dist=Math.hypot(arr[0].x-arr[1].x,arr[0].y-arr[1].y);if(lastDistance>0)scale*=dist/lastDistance;lastDistance=dist;}draw();});
 function end(e){pointers.delete(e.pointerId);lastDistance=0;}
 viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
 viewport.addEventListener('dblclick',()=>{scale=scale>1?1:2;if(scale===1)dx=dy=0;draw();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!light.hidden)close();});
})();
