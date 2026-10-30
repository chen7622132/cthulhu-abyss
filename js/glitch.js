/* ============================================================
   glitch.js — 间歇污染（出现 → 模糊 → 消失，不留痕迹）
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var fired = {};          /* 每条只触发一次 */
  var lastFire = 0;

  /* 元素在视口内的相对进度 0..1 */
  function exProgress(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = r.height + vh;
    var passed = vh - r.top;
    return Math.max(0, Math.min(1, passed / total));
  }

  function blurPulse(node) {
    node.classList.remove('blur-pulse');
    /* 强制重排，让动画能重播 */
    void node.offsetWidth;
    node.classList.add('blur-pulse');
    setTimeout(function () { node.classList.remove('blur-pulse'); }, 260);
  }

  function runEcho(g) {
    var el = document.querySelector(g.sel);
    if (!el) return;
    var origin = el.innerHTML;
    var originEcho = el.getAttribute('data-echo');

    el.innerHTML = g.text;
    el.setAttribute('data-echo', g.text);
    el.classList.add('echo-on');

    /* 0.15s 后模糊一下（像失焦） */
    setTimeout(function () { blurPulse(el); }, 150);
    /* 中途再模糊一次 */
    setTimeout(function () { blurPulse(el); }, Math.max(400, g.dur * .55));

    setTimeout(function () {
      el.innerHTML = origin;
      if (originEcho) el.setAttribute('data-echo', originEcho);
      else el.removeAttribute('data-echo');
      el.classList.remove('echo-on');
    }, g.dur);

    if (A.audio) A.audio.paper();
  }

  function runSwap(g) {
    var el = document.querySelector(g.sel);
    if (!el) return;
    var origin = el.innerHTML;
    el.innerHTML = g.text;
    setTimeout(function () { blurPulse(el); }, 120);
    setTimeout(function () { blurPulse(el); }, Math.max(380, g.dur * .6));
    setTimeout(function () { el.innerHTML = origin; }, g.dur);
  }

  function runShape(g) {
    var el = document.querySelector(g.sel);
    if (!el) return;
    var ghost = document.createElement('div');
    ghost.className = 'ghost-shape';
    el.appendChild(ghost);
    setTimeout(function () { blurPulse(el); }, 200);
    setTimeout(function () { blurPulse(el); }, Math.max(700, g.dur * .6));
    setTimeout(function () {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }, g.dur);
  }

  function runRow(g) {
    var el = document.querySelector(g.sel);
    if (!el) return;
    var tds = el.querySelectorAll('td');
    if (!tds.length) return;
    var backup = [];
    for (var i = 0; i < tds.length; i++) backup.push(tds[i].innerHTML);
    for (var j = 0; j < tds.length; j++) {
      if (A.ROW07[j] !== undefined) tds[j].innerHTML = A.ROW07[j];
    }
    el.classList.remove('carbon-gap');
    el.classList.add('carbon-ghost');

    setTimeout(function () { blurPulse(el); }, 160);
    setTimeout(function () { blurPulse(el); }, Math.max(600, g.dur * .6));

    setTimeout(function () {
      for (var k = 0; k < tds.length; k++) tds[k].innerHTML = backup[k];
      el.classList.add('carbon-gap');
      el.classList.remove('carbon-ghost');
    }, g.dur);
  }

  var RUNNERS = { echo: runEcho, swap: runSwap, shape: runShape, row: runRow };

  function tick() {
    var now = Date.now();
    if (now - lastFire < 3200) return;   /* 冷却，避免连着爆 */

    for (var i = 0; i < A.GLITCHES.length; i++) {
      var g = A.GLITCHES[i];
      if (fired[i]) continue;
      var host = document.getElementById('ex0' + g.ex);
      if (!host) continue;
      var p = exProgress(host);
      if (p >= g.at) {
        fired[i] = true;
        lastFire = now;
        window.__glitchFired = (window.__glitchFired || 0) + 1;
        var fn = RUNNERS[g.type];
        if (fn) fn(g);
        break;
      }
    }
  }

  A.glitch = {
    init: function () {
      /* 补充样式：重影元素需要 data-echo */
      setInterval(tick, 220);
    },
    reset: function () { fired = {}; }
  };

})(window.ABYSS);
