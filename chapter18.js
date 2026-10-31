/* SENDAS 2.0 — Capítulo II, El peso de la verdad.
 * Story data + consequences only. Presentation, scene, history, saving and
 * dialogue are all provided by the shared game/core engine.
 */
(function () {
  'use strict';
  var CORE = window.SENDAS_CORE;
  var api = function () { return window.SENDAS_GAME_API; };
  var read = function () { return window.SENDAS_CHAPTER_API.get(); };
  var witness = {
    mara: 'Mara ha ofrecido revisar sus pesas. Yael acepta escucharla, pero no quiere que otra persona decida por la familia.',
    jonas: 'Jonás ha hablado de reparar redes en el muelle. Yael necesita saber las condiciones antes de aceptar el trabajo.',
    simeon: 'Siméon conserva una copia del registro. Yael pregunta quién podrá leer las palabras de su familia.'
  };
  var topics = {
    listen: {label:'¿Qué necesita tu familia?',speaker:'Yael',text:'«Que nos escuches antes de ofrecer una solución. No quiero que Eliab aprenda a pedir permiso para tener hambre».',next:['grain','work','account']},
    grain: {label:'¿Cuánto grano os queda?',speaker:'Yael',text:'«Dos días. Tal vez tres, si mezclo la harina con lentejas. Antes guardábamos para una semana».',next:['future','account','listen']},
    future: {label:'¿Y después de esos días?',speaker:'Yael',text:'«He pensado vender el telar. Pero si lo vendo, no tendré con qué trabajar. A veces elegir entre dos pérdidas no es elegir».',next:['work','account','listen']},
    work: {label:'¿Qué te dijo Jonás del trabajo?',speaker:'Yael',text:'«Podrían necesitar redes remendadas. No he dicho que sí. Quiero conocer el pago antes de cambiar una deuda por otra».',next:['promise','account','listen']},
    account: {label:'¿Qué ocurrió con la cuenta?',speaker:'Yael',text:'«El comerciante afirma que recibimos más grano. Recuerdo dos medidas distintas. Mara estaba allí, pero no quiero acusarla sin saber».',next:['measure','mara','permission']},
    measure: {label:'¿Puedo examinar las medidas?',speaker:'Natán',text:'Una marca coincide con la copia del escriba. La otra parece más reciente. La diferencia plantea una pregunta; no demuestra quién modificó la medida.',next:['permission','mara','account']},
    mara: {label:'¿Confías en Mara?',speaker:'Yael',text:'«Confío en que no quisiera dañarnos. Pero confiar en alguien no significa entregarle nuestra voz».',next:['permission','account','listen']},
    permission: {label:'¿Puedo consultar el registro?',speaker:'Yael',text:'«Sí, si volvemos a hablar antes de mostrarlo a otros. No menciones a Eliab en el mercado. Mi hijo no es una prueba».',next:['promise','account','listen']},
    promise: {label:'¿Qué puedo prometerte?',speaker:'Yael',text:'«No me prometas justicia antes de conocer la verdad. Promete volver, y preguntarnos antes de actuar».',next:['commit','listen','account']},
    commit: {label:'Prometer discreción y regresar',speaker:'Yael',text:'«Entonces esperaré tu regreso. No porque hayas resuelto nada, sino porque has escuchado lo que te pedía».',next:['account','work','future']},
    eliab: {label:'¿Qué ha ocurrido, Eliab?',speaker:'Eliab',text:'«Mi madre dice que no me preocupe, pero anoche contó las monedas dos veces. Creía que yo dormía».',next:['eliabHope','eliabFear','listen']},
    eliabHope: {label:'¿Qué esperas de mañana?',speaker:'Eliab',text:'«Que mamá pueda trabajar en el telar sin contar cuántos panes quedan. Yo puedo ayudarla a ordenar la lana».',next:['eliabFear','grain','future']},
    eliabFear: {label:'¿Qué te preocupa más?',speaker:'Eliab',text:'«Que todos hablen de nosotros en el mercado. Me gustaría que alguien nos preguntara primero».',next:['eliabHope','permission','listen']},
    observeLoom: {label:'Examinar el telar con cuidado',speaker:'Natán',text:'El telar está reparado varias veces. En las tramas hay horas de trabajo y una posibilidad de obtener alimento. Venderlo aliviaría un día y comprometería los siguientes.',next:['future','work','listen']},
    observeGrain: {label:'Revisar las reservas',speaker:'Natán',text:'Dos cántaros casi vacíos; una medida pequeña de lentejas; el pan para mañana todavía sin moler. Natán ya no puede pensar en la deuda como una cifra aislada.',next:['grain','future','listen']},
    observeMeasure: {label:'Contrastar las marcas de la medida',speaker:'Natán',text:'La marca inferior concuerda con la copia de Siméon. La superior podría indicar un cambio de recipiente, un error o una alteración. Solo el testimonio puede aclararlo.',next:['account','permission','mara']},
    consult: {label:'Pedir permiso antes de presentar el registro',speaker:'Yael',text:'«Ven con quien pueda comprobar las medidas. Estaré presente y Eliab no tendrá que hablar ante nadie. Eso sí puedo aceptarlo».',next:['aftercare','account','listen']},
    impose: {label:'Enseñar la cuenta en el mercado sin esperar',speaker:'Yael',text:'«No te pedí que escondieras el registro. Te pedí que no hablaras por nosotros. Ahora habrá que recuperar nuestra confianza antes de reunir a nadie».',next:['consult','listen','permission']},
    postpone: {label:'Esperar y volver más adelante',speaker:'Yael',text:'«Puedes regresar. Pero el grano no espera. Si te marchas hoy, al menos no digas que el asunto está resuelto».',next:['consult','grain','future']},
    aftercare: {label:'¿Qué ocurrirá después?',speaker:'Yael',text:'«Puede que la deuda resulte distinta. Puede que no. Necesitamos que la medida sea justa y que nadie nos quite la posibilidad de trabajar».',next:['listen','work','account']}
  };
  function chapter(s) {
    return s.chapter18 || {stage:0,choices:[],notes:[],current:null};
  }
  function update(mutator) {
    return api().change(function (s) {
      s.chapter18 = chapter(s);
      if (!Array.isArray(s.chapter18.notes)) s.chapter18.notes = [];
      if (!Array.isArray(s.chapter18.choices)) s.chapter18.choices = [];
      mutator(s.chapter18, s);
    });
  }
  function notes(s) { return chapter(s).notes || []; }
  function logged(note) { return notes(read()).indexOf(note) !== -1; }
  function addNote(id, sentence) {
    update(function (c) { if (c.notes.indexOf(id) < 0) c.notes.push(id); });
    api().remember(sentence);
  }
  function speakerAsset(speaker) {
    if (speaker === 'Eliab') return 'chapter18/eliab_portrait';
    if (speaker === 'Natán') return 'portrait_natan';
    return 'chapter18/yael_portrait';
  }
  function display(topic, opening) {
    var s=read(),c=chapter(s),who=topic?topic.speaker:'Yael';
    var selections=topic?topic.next:['listen','account','eliab','measure','permission'];
    var text=topic?topic.text:('«Natán, quisiera pagar lo que debemos. Pero si entrego el grano que queda, ¿qué comerá Eliab mañana?» ' + (witness[(s.codex||{}).entrusted] || witness.mara));
    api().conversation({
      name:who,portrait:speakerAsset(who),desc:'Casa de Yael · Cafarnaúm',
      title:'El peso de la verdad',overline:'CAPÍTULO II · EL AMANECER DE LAS DEUDAS',
      scope:'chapter2:family',text:text,
      choices:selections.map(function (id) { return [topics[id].label,'ch2:topic:'+id]; })
    });
  }
  function talk(person) {
    var s=read(),c=chapter(s);
    if (person==='eliab') {api().change(function (s) {CORE.mark(s,'dialog:chapter2:family','ch2:topic:eliab');});return display(topics.eliab);}
    if (c.current && topics[c.current]) return display(topics[c.current]);
    return display(null);
  }
  function observe(which) {
    var look={
      loom:['observeLoom','telar','El telar es el medio de trabajo de Yael; su venta tendría consecuencias duraderas.'],
      grain:['observeGrain','provisiones','He visto las provisiones de Yael; alcanzarán solo para unos días.'],
      measure:['observeMeasure','medida','Dos marcas distintas en una medida; necesito contrastar testimonios.']
    }[which];
    if (!look) return;
    addNote(look[1],look[2]);
    display(topics[look[0]]);
  }
  function meeting() {
    var s=read(),c=chapter(s);
    if (!logged('medida') || !logged('provisiones') || !CORE.seen(s,'dialog:chapter2:family','ch2:topic:commit')) {
      api().conversation({name:'Natán',portrait:'portrait_natan',desc:'Antes de actuar',
        title:'Todavía falta escuchar',overline:'CAPÍTULO II · RESPONSABILIDAD',
        scope:'chapter2:family',
        text:'Antes de hablar con los vecinos, Natán necesita comprender la diferencia entre las medidas, saber qué provisiones quedan y escuchar lo que Yael consiente que se haga.',
        choices:[['Volver a hablar con Yael','ch2:talk:yael'],['Revisar la medida','ch2:observe:measure'],['Comprobar el grano','ch2:observe:grain']]});
      return;
    }
    api().conversation({name:'Yael',portrait:'chapter18/yael_portrait',desc:'Decidir con la familia',
      title:'¿Quién puede hablar por nosotros?',overline:'CAPÍTULO II · EL PESO DE LA VERDAD',
      scope:'chapter2:family',
      text:'El registro está sobre la mesa. En el mercado esperan rumores, no certezas. Yael pregunta qué piensa hacer Natán con una prueba que todavía debe contrastarse.',
      choices:[['Pedir permiso y contrastar la medida','ch2:decision:consult'],['Mostrar la cuenta sin esperar','ch2:decision:impose'],['Aplazar la decisión','ch2:decision:postpone']]});
  }
  function decision(choice) {
    var s=read(),c=chapter(s);
    if (['consult','impose','postpone'].indexOf(choice)<0) return;
    update(function (ch) {
      ch.stage=Math.max(ch.stage||0,2);
      ch.decision=choice;
      if (choice==='consult') {ch.stage=3;ch.resolution='revisión-con-consentimiento';}
      else if (choice==='impose') ch.resolution='confianza-herida';
      else ch.resolution='pendiente';
    });
    var diary={
      consult:'Yael autorizó una revisión de la cuenta ante testigos y quiso estar presente. No se ha declarado saldada la deuda.',
      impose:'Mostré el registro antes de recibir permiso. Yael me hizo ver que tenía que recuperar su confianza.',
      postpone:'Decidí esperar. Las provisiones de la familia siguen siendo escasas.'
    };
    api().remember(diary[choice]);
    display(topics[choice]);
  }
  function narration() {
    var s=read(),c=chapter(s);
    var intro='En el patio, el telar guarda las horas de trabajo de Yael. Eliab escucha desde el umbral. Natán reconoce las marcas de la cuenta que examinó junto al canal. Aquí una decisión puede cambiar algo más que un número.\n\n';
    var consequence=c.decision==='consult'?'Yael ha aceptado una revisión ante testigos, pero el resultado todavía debe comprobarse.':c.decision==='impose'?'La confianza de Yael ha quedado herida: Natán deberá volver a escucharla antes de actuar.':c.decision==='postpone'?'La decisión está aplazada y el grano sigue escaseando.':'Antes de hablar por la familia, Natán necesita oír sus palabras.';
    return intro+consequence;
  }
  function actions() {
    var s=read(),c=chapter(s);
    var list=[
      {label:'Hablar con Yael',id:'ch2:talk:yael',icon:'◎'},
      {label:'Escuchar a Eliab',id:'ch2:talk:eliab',icon:'◎'},
      {label:'Examinar el telar',id:'ch2:observe:loom',icon:'◇'},
      {label:'Contar las provisiones',id:'ch2:observe:grain',icon:'◌'},
      {label:'Comparar la medida y el registro',id:'ch2:observe:measure',icon:'▤'},
      {label:'Decidir con la familia',id:'ch2:meeting',icon:'✧'},
      {label:'Regresar a la aldea',id:'go:village',icon:'←'}
    ];
    return list;
  }
  function run(id) {
    if (!CORE || !api()) return;
    if (id==='talk:yael') return talk('yael');
    if (id==='talk:eliab') return talk('eliab');
    if (id.indexOf('observe:')===0) return observe(id.slice(8));
    if (id.indexOf('topic:')===0) {
      var key=id.slice(6);
      if (!topics[key]) return;
      update(function (c) { c.current=key;c.stage=Math.max(c.stage||0,1);c.lastChoice=key; });
      return display(topics[key]);
    }
    if (id==='meeting') return meeting();
    if (id.indexOf('decision:')===0) return decision(id.slice(9));
  }
  window.SENDAS_CHAPTER_TWO=Object.freeze({actions:actions,run:run,narration:narration,topics:topics});
})();