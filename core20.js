/* SENDAS 2.0 — a single, offline-first history and save migration contract.
 * Pure, framework-free model used by every chapter. Never changes the save key
 * or removes previous data; deliberately accepts all valid legacy v1 saves.
 */
(function (host) {
  'use strict';
  var VERSION = '2.0.0';
  var MAX_ENTRIES = 240;
  var owns = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  function bucket(state, scope) {
    if (!state || typeof state !== 'object' || typeof scope !== 'string') return null;
    state.interactions = state.interactions && typeof state.interactions === 'object' ? state.interactions : {};
    var dialogue = scope.indexOf('dialog:') === 0;
    var category = dialogue ? 'dialogue' : 'actions';
    var key = scope.slice(dialogue ? 7 : scope.indexOf('action:') === 0 ? 7 : 0);
    if (!key) return null;
    state.interactions[category] = state.interactions[category] && typeof state.interactions[category] === 'object' ? state.interactions[category] : {};
    var group = state.interactions[category];
    if (!Array.isArray(group[key])) group[key] = [];
    return group[key];
  }
  function append(target, id) {
    if (!target || typeof id !== 'string' || !id || id.length > 180) return false;
    if (target.indexOf(id) >= 0) return false;
    target.push(id);
    if (target.length > MAX_ENTRIES) target.splice(0, target.length - MAX_ENTRIES);
    return true;
  }
  function migrate(state) {
    if (!state || typeof state !== 'object') return state;
    if (state.version !== 1) return state;
    state.dialogHistory = state.dialogHistory && typeof state.dialogHistory === 'object' ? state.dialogHistory : {};
    state.actionHistory = state.actionHistory && typeof state.actionHistory === 'object' ? state.actionHistory : {};
    Object.keys(state.dialogHistory).forEach(function (k) {
      var saved = state.dialogHistory[k];
      if (!Array.isArray(saved)) return;
      var key = k.indexOf('npc:') === 0 ? k : 'npc:' + k.split('|')[0];
      var dst = bucket(state, 'dialog:' + key);
      saved.forEach(function (id) { append(dst, id); });
    });
    Object.keys(state.actionHistory).forEach(function (scene) {
      var saved = state.actionHistory[scene];
      if (!Array.isArray(saved)) return;
      var dst = bucket(state, 'action:' + scene);
      saved.forEach(function (id) { append(dst, id); });
    });
    // 1.8 dialogue choices used plain topic ids: map to the unified conversation
    // namespace, so no visited question is lost when upgrading an old save.
    if (state.chapter18 && Array.isArray(state.chapter18.choices)) {
      var ch2 = bucket(state, 'dialog:chapter2:family');
      state.chapter18.choices.forEach(function (id) {
        if (typeof id === 'string') append(ch2, 'ch2:topic:' + id);
      });
    }
    // Migrate old collected documents and resolved witness/echo choices into the same
    // visited-option history. Old saves keep their data and become visually coherent.
    var oldCodex=state.codex && typeof state.codex==='object' ? state.codex : {};
    if(Array.isArray(oldCodex.found))oldCodex.found.forEach(function(id){
      if(typeof id==='string')append(bucket(state,'dialog:panel:codex'),'read:'+id);
    });
    if(oldCodex.solved)append(bucket(state,'dialog:panel:codex'),'answer:canal');
    if(['mara','jonas','simeon'].indexOf(oldCodex.entrusted)>=0)
      append(bucket(state,'dialog:panel:ledger'),'choose:'+oldCodex.entrusted);
    if(oldCodex.delivered)append(bucket(state,'dialog:panel:ledger'),'check:correct');
    var oldEchoes=oldCodex.echoes&&typeof oldCodex.echoes==='object'?oldCodex.echoes:{};
    Object.keys(oldEchoes).forEach(function(name){
      if(oldEchoes[name]==='help')append(bucket(state,'dialog:panel:echo'),'accept:'+name);
      if(oldEchoes[name]==='later')append(bucket(state,'dialog:panel:echo'),'decline:'+name);
    });
    state.saveSchema = 2;
    return state;
  }
  function seen(state, scope, id) {
    migrate(state);
    var list = bucket(state, scope);
    return !!list && list.indexOf(id) !== -1;
  }
  function mark(state, scope, id) {
    migrate(state);
    var list = bucket(state, scope);
    var changed = append(list, id);
    if (!changed || !state) return changed;
    if (scope.indexOf('dialog:npc:') === 0) {
      var key = scope.slice(7);
      state.dialogHistory = state.dialogHistory || {};
      state.dialogHistory[key] = list.slice();
    } else if (scope.indexOf('action:') === 0) {
      var scene = scope.slice(7);
      state.actionHistory = state.actionHistory || {};
      state.actionHistory[scene] = list.slice();
    } else if (scope === 'dialog:chapter2:family' && id.indexOf('ch2:topic:') === 0) {
      state.chapter18 = state.chapter18 || {stage:0,choices:[],notes:[]};
      if (!Array.isArray(state.chapter18.choices)) state.chapter18.choices = [];
      append(state.chapter18.choices, id.slice(10));
    }
    return changed;
  }
  function chapter(state) {
    if (!state || !state.codex) return 1;
    return state.scene === 'yael' ? 2 : 1;
  }
  function unlocked(state) {
    var c = state && state.codex;
    return !!(c && (c.delivered || c.resolved || c.followup));
  }
  host.SENDAS_CORE = Object.freeze({VERSION:VERSION,migrate:migrate,seen:seen,mark:mark,chapter:chapter,unlocked:unlocked});
})(typeof window !== 'undefined' ? window : globalThis);