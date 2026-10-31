/* SENDAS 2.1 — All narrative panels use the main modal, one choice history and one save.
 * Standalone ES2018; no dependencies, network calls, secondary overlays or storage keys.
 */
(function () {
  'use strict';
  var modules=Object.create(null);
  var CORE=window.SENDAS_CORE;
  var api=function(){return window.SENDAS_GAME_API;};
  var escape=function(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  function register(name, handler, track) {
    if(!/^[a-z0-9-]{2,32}$/.test(name)||typeof handler!=='function')throw Error('Módulo de SENDAS no válido');
    if(modules[name])throw Error('Módulo duplicado: '+name);
    modules[name]={handler:handler,track:typeof track==='function'?track:function(){return false;}};
  }
  function scope(name){return 'dialog:panel:'+name;}
  function decorate(button, visited){
    button.classList.toggle('sendas-ui-seen',visited);
    if(visited){
      if(!button.querySelector('.sendas-ui-visited')){
        var tag=document.createElement('span');tag.className='sendas-ui-visited';tag.textContent='Ya consultado';button.appendChild(tag);
      }
      if(!button.hasAttribute('data-sendas-aria-base'))button.setAttribute('data-sendas-aria-base',button.getAttribute('aria-label')||button.textContent.replace('Ya consultado','').trim());
      button.setAttribute('aria-label',button.getAttribute('data-sendas-aria-base')+' (ya consultado)');
    }
  }
  function decorateAll(module){
    var cfg=modules[module],panel=document.querySelector('#modal-content .sendas-panel[data-sendas-module="'+module+'"]');
    if(!cfg||!panel)return;
    var saved=window.SENDAS_READONLY.getState();
    panel.querySelectorAll('[data-sendas-ui]').forEach(function(b){
      var id=b.getAttribute('data-sendas-ui');
      if(cfg.track(id))decorate(b,CORE.seen(saved,scope(module),id));
    });
  }
  function show(opts){
    opts=opts||{};
    var module=opts.module;
    if(!modules[module])throw Error('Panel no registrado: '+module);
    var attr=opts.attribute||'data-'+module;
    if(!/^data-[a-z][a-z0-9-]*$/.test(attr))throw Error('Atributo de panel no válido');
    // The trusted game modules retain their existing authored button markup.
    // Only the action attribute is adapted; a single event dispatcher owns it.
    var html=String(opts.body||'').replace(new RegExp('\\b'+attr+'(?=\\s*=)','g'),'data-sendas-ui');
    var content='<section class="sendas-panel sendas-panel-'+escape(module)+'" data-sendas-module="'+escape(module)+'">'+html+'</section>';
    api().openPanel(opts.title||'El camino',content,opts.overline||'SENDAS');
    decorateAll(module);
  }
  function close(){api().closePanel();}
  document.addEventListener('click',function(e){
    var button=e.target.closest('#modal-content [data-sendas-ui]');
    if(!button)return;
    var panel=button.closest('.sendas-panel'),name=panel&&panel.getAttribute('data-sendas-module');
    var cfg=name&&modules[name];if(!cfg)return;
    e.preventDefault();e.stopPropagation();
    var action=button.getAttribute('data-sendas-ui');
    if(cfg.track(action)){
      api().change(function(state){CORE.mark(state,scope(name),action);});
      decorate(button,true);
    }
    cfg.handler(action);
  });
  window.SENDAS_UI=Object.freeze({register:register,show:show,close:close,version:'2.1.0',active:function(){return document.querySelector('#modal-content .sendas-panel')?.getAttribute('data-sendas-module')||null;}});
})();