/* ============================================================
   corruption.js — 退化主控（滚动深度 + 停留时间）／光标灯
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var root = document.documentElement;
  var lamp = document.getElementById('lamp');
  var lastMove = Date.now();
  var lampR = 520, lampTarget = 520;
  var depth = 0;              /* 全局滚动深度 0..1 */
  var holdBonus = {};         /* 每个 exhibit 的停留加成 */
  var holdStart = {};         /* 进入时刻 */
  var currentEx = null;
  var warpFilter = null, lastWarp = 0;

  /* ---------- 注入 SVG 位移滤镜（整体漂移用） ---------- */
  function injectWarp() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:fixed;width:0;height:0;overflow:hidden;pointer-events:none';
    var f = document.createElementNS(ns, 'filter');
    f.setAttribute('id', 'warpFilter');
    f.setAttribute('x', '-12%'); f.setAttribute('y', '-12%');
    f.setAttribute('width', '124%'); f.setAttribute('height', '124%');
    var turb = document.createElementNS(ns, 'feTurbulence');
    turb.setAttribute('type', 'fractalNoise');
    turb.setAttribute('baseFrequency', '0.012 0.024');
    turb.setAttribute('numOctaves', '3');
    turb.setAttribute('seed', '17');
    turb.setAttribute('result', 'n');
    var disp = document.createElementNS(ns, 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'n');
    disp.setAttribute('scale', '0');
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');
    f.appendChild(turb); f.appendChild(disp);
    svg.appendChild(f);
    document.body.appendChild(svg);
    warpFilter = disp;
  }

  /* ---------- 光标灯 ---------- */
  var LAMP_MAX = 520, LAMP_MIN = 300;
  function initLamp() {
    if (!lamp) return;
    if (A.quiet) { document.body.classList.add('lamp-off'); return; }
    var raf = false;
    document.addEventListener('mousemove', function (e) {
      if (!raf) {
        raf = true;
        requestAnimationFrame(function () {
          lamp.style.setProperty('--mx', e.clientX + 'px');
          lamp.style.setProperty('--my', e.clientY + 'px');
          raf = false;
        });
      }
      lastMove = Date.now();
      lampTarget = LAMP_MAX;

      /* 目录只在鼠标靠左时浮现 —— 第一眼应该是场景，不是网页 */
      if (e.clientX < 150) document.body.classList.add('nav-on');
      else document.body.classList.remove('nav-on');
    }, { passive: true });

    /* 滚动时灯跟着亮起来（移动＝在找东西） */
    window.addEventListener('scroll', function () {
      lastMove = Date.now();
      lampTarget = LAMP_MAX;
    }, { passive: true });

    /* 静止 → 光圈缓慢收缩（15 秒才收到最小，避免读不动） */
    setInterval(function () {
      var idle = Date.now() - lastMove;
      if (idle > 3000) {
        var shrink = Math.min(1, (idle - 3000) / 15000);
        lampTarget = LAMP_MAX - shrink * (LAMP_MAX - LAMP_MIN);
      }
      lampR += (lampTarget - lampR) * .05;
      lamp.style.setProperty('--lamp-r', lampR.toFixed(1) + 'px');
    }, 80);
  }

  /* ---------- 滚动深度 ---------- */
  function calcDepth() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    depth = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  /* ---------- 停留时间加成 ---------- */
  function initHold() {
    var exs = document.querySelectorAll('.exhibit');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (en.isIntersecting && en.intersectionRatio > .55) {
          if (!holdStart[id]) holdStart[id] = Date.now();
          currentEx = id;
        } else {
          if (holdStart[id]) {
            /* 离开时保留一小部分加成 */
            var held = (Date.now() - holdStart[id]) / 1000;
            holdBonus[id] = Math.min(.15, (holdBonus[id] || 0) + Math.max(0, held - 20) * .004);
            delete holdStart[id];
          }
        }
      });
    }, { threshold: [0, .55, 1] });
    exs.forEach(function (e) { io.observe(e); });

    /* 每 2 秒结算一次当前停留 */
    setInterval(function () {
      if (!currentEx || !holdStart[currentEx]) return;
      var held = (Date.now() - holdStart[currentEx]) / 1000;
      if (held > 20) {
        var extra = Math.min(.15, (held - 20) * .004);
        holdBonus[currentEx] = Math.max(holdBonus[currentEx] || 0, extra);
        /* 憋气：声音变闷 */
        if (A.audio) A.audio.setBreath(true);
      } else {
        if (A.audio) A.audio.setBreath(false);
      }
    }, 2000);
  }

  /* ---------- 主更新 ---------- */
  var lastApply = 0;
  function update() {
    calcDepth();
    var local = currentEx ? (holdBonus[currentEx] || 0) : 0;
    var v = Math.min(1, depth * .92 + local);

    var now = Date.now();
    if (now - lastApply > 120) {
      lastApply = now;
      root.style.setProperty('--corruption', v.toFixed(3));

      document.body.classList.toggle('corrupt-mid', v > .35 && v <= .68);
      document.body.classList.toggle('corrupt-high', v > .68);

      /* 整体位移：v>0.4 才开，最多 5px */
      if (warpFilter && now - lastWarp > 240) {
        lastWarp = now;
        var s = v > .42 ? ((v - .42) / .58 * 5.2).toFixed(2) : 0;
        warpFilter.setAttribute('scale', s);
        var stack = document.getElementById('stack');
        if (stack) stack.style.filter = s > 0 ? 'url(#warpFilter)' : '';
      }
    }

    if (A.audio) A.audio.setDepth(depth);
    requestAnimationFrame(update);
  }

  A.corrupt = {
    init: function () {
      injectWarp();
      initLamp();
      initHold();
      requestAnimationFrame(update);
    },
    depth: function () { return depth; },
    value: function () {
      var local = currentEx ? (holdBonus[currentEx] || 0) : 0;
      return Math.min(1, depth * .92 + local);
    },
    currentEx: function () { return currentEx; }
  };

})(window.ABYSS);
