/* ============================================================
   main.js — 入口
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var count = 0;

  function boot() {
    count = A.store.bump();

    /* 静阅模式 */
    if (A.quiet) document.body.classList.add('quiet');

    /* 阅读次数 */
    var rc = document.getElementById('readCount');
    if (rc && rc.parentNode) {
      var cn = ['', '一', '二', '三', '四', '五'];
      rc.textContent = count >= 6 ? '多次' : (cn[count] || count);
      if (count >= 3) {
        /* 先抱住父节点，禁止在 innerHTML 之后再用 rc.parentNode（会变 null） */
        var noteEl = rc.parentNode;
        noteEl.innerHTML = '本卷已是<strong>最後一份副本</strong>。';
        noteEl.style.color = '#9d2b20';
      }
    }

    /* 调试／重置：地址加 ?reset=1 可清空"已阅次数" */
    try {
      if (/[?&]reset=1/.test(location.search)) localStorage.removeItem('abyss.v1');
    } catch (e) { }

    /* 颗粒噪点 */
    initGrain();

    /* 解封 */
    var untie = document.getElementById('untie');
    var cover = document.getElementById('cover');
    if (untie) {
      untie.addEventListener('click', function () {
        openArchive();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAll();
      }
    });

    /* 预编译眼睛 shader（避免出现时卡顿） */
    try { A.eye.precompile(); } catch (err) { }
  }

  function openArchive() {
    document.body.classList.remove('stage-cover');
    document.body.classList.add('stage-read');
    if (A.audio) A.audio.start();

    var cover = document.getElementById('cover');
    var archive = document.getElementById('archive');
    if (cover) {
      cover.style.transition = 'opacity 1.2s, transform 1.2s';
      cover.style.opacity = '0';
      setTimeout(function () { cover.hidden = true; }, 1250);
    }
    if (archive) archive.hidden = false;

    A.paper.init();
    A.corrupt.init();
    A.glitch.init();
    A.reveal.init(count);
    A.endgame.init();

    window.scrollTo(0, 0);
    if (A.audio) A.audio.paper();
  }

  function closeAll() {
    /* Esc = 合卷 */
    document.body.classList.add('quiet');
    var layer = document.getElementById('loupe-layer');
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    var eye = document.getElementById('eye-layer');
    if (eye && !eye.hidden) return;   /* 眼睛段不允许中途退出 */
  }

  /* ---------- 颗粒噪点 ---------- */
  function initGrain() {
    var cv = document.getElementById('grain');
    if (!cv) return;
    if (A.quiet) { cv.style.display = 'none'; return; }
    var ctx = cv.getContext('2d');
    var w = 180, h = 180;
    cv.width = w; cv.height = h;
    var img = ctx.createImageData(w, h);
    var buf = new Uint32Array(img.data.buffer);
    var t = 0;

    function paint() {
      for (var i = 0; i < buf.length; i++) {
        var v = (Math.random() * 255) | 0;
        buf[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
      ctx.putImageData(img, 0, 0);
    }

    function loop() {
      t++;
      if (t % 2 === 0) paint();
      requestAnimationFrame(loop);
    }
    paint();
    setTimeout(loop, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.ABYSS);
