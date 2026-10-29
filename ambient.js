/* Original, softly synthesized environmental atmosphere; OFF by default; user action only. */
(()=>{'use strict';
 let ctx=null,nodes=[],active=false;
 function stop(){nodes.forEach(n=>{try{n.disconnect();}catch(e){}});nodes=[];if(ctx){ctx.close().catch(()=>{});ctx=null;}active=false;}
 function start(){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;ctx=new Audio();
  const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);let seed=6437;
  for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=((seed/4294967295)*2-1)*.25;}
  const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=340;
  const gain=ctx.createGain();gain.gain.value=.027;
  source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start();nodes=[source,filter,gain];active=true;return true;}
 window.SENDAS_AMBIENT={get active(){return active;},toggle(){if(active){stop();}else if(!start()){window.alert('Este navegador no admite audio ambiental.');}const toast=document.getElementById('toast');if(toast){toast.textContent=active?'Ambiente activado':'Ambiente desactivado';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800);}const root=document.getElementById('modal-root');if(root)root.hidden=true;}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop();});
})();
