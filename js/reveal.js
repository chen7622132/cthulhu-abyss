/* ============================================================
   reveal.js — 目录／放大镜／回看验证／双层阅读
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var pass2 = false;       /* 第二遍 */
  var backCount = 0;       /* 往回滚次数 */
  var lastY = 0;
  var whisperShown = false;

  /* ---------- 给元素补类（供 glitch 选中） ---------- */
  function tagNodes() {
    /* 每张纸都放一个水渍元素，由 --corruption 控制大小 */
    [].forEach.call(document.querySelectorAll('.sheet'), function (s) {
      if (!s.querySelector('.stain')) {
        var st = document.createElement('div');
        st.className = 'stain';
        s.appendChild(st);
      }
    });

    var depo = document.querySelectorAll('#ex03 .depo');
    for (var i = 0; i < depo.length; i++) {
      var tds = depo[i].querySelectorAll('td');
      for (var j = 0; j < tds.length; j++) tds[j].classList.add('depo-num');
    }
    var typed = document.querySelectorAll('#ex05 .typed');
    for (var k = 0; k < typed.length; k++) {
      var day = k < 4 ? 1 : (k < 6 ? 2 : 3);
      typed[k].classList.add('typed-' + day);
    }
  }

  /* ---------- 目录高亮 ---------- */
  function initIndex() {
    var links = Array.prototype.slice.call(document.querySelectorAll('#index a'));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      map[id] = a;
    });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting && en.intersectionRatio > .18) {
          links.forEach(function (x) { x.classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { threshold: [.18, .6] });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- 放大镜 ---------- */
  function initLoupe() {
    [].forEach.call(document.querySelectorAll('.loupe'), function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openAttach(btn.getAttribute('data-loupe'));
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAttach();
    });
  }

  function openAttach(key) {
    var data = A.ATTACH[key];
    if (!data) return;
    closeAttach();
    var layer = document.createElement('div');
    layer.id = 'loupe-layer';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.innerHTML =
      '<div class="attach">' +
      '<button class="close" type="button" aria-label="關閉">✕</button>' +
      '<h3>' + data.title + '</h3>' + data.html +
      '</div>';
    document.body.appendChild(layer);
    layer.querySelector('.close').addEventListener('click', closeAttach);
    layer.addEventListener('click', function (e) {
      if (e.target === layer) closeAttach();
    });
    if (A.audio) A.audio.paper();
    /* 记住：看过附件 */
    var s = A.store.read(); s.l3 = s.l3 || {};
    s.l3[key] = true; A.store.write(s);
  }

  function closeAttach() {
    var l = document.getElementById('loupe-layer');
    if (l && l.parentNode) l.parentNode.removeChild(l);
  }

  /* ---------- 局部永久损坏（07） ---------- */
  function initWreck() {
    var ex7 = document.getElementById('ex07');
    if (!ex7) return;
    if (!('IntersectionObserver' in window)) { ex7.classList.add('wrecked'); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio > .18) {
          ex7.classList.add('wrecked');
        }
      });
    }, { threshold: [.18, .5] });
    io.observe(ex7);
  }

  /* ---------- 往回滚 → 「你刚才看到了，是不是。」 ---------- */
  function initBackTrack() {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < lastY - 220) backCount++;
      lastY = y;

      if (backCount >= 2 && !whisperShown && !pass2) {
        whisperShown = true;
        var w = document.createElement('div');
        w.className = 'whisper';
        w.textContent = '你刚才看到了，是不是。';
        document.body.appendChild(w);
        setTimeout(function () { w.classList.add('on'); }, 60);
        setTimeout(function () {
          w.classList.remove('on');
          setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 2000);
        }, 6200);
        if (A.audio) A.audio.pulse(.10);
      }
    }, { passive: true });
  }

  /* ---------- 二刷：开提示 ---------- */
  A.reveal = {
    init: function (count) {
      tagNodes();
      initIndex();
      initLoupe();
      initWreck();
      pass2 = count > 1;
      if (pass2) {
        document.body.classList.add('l3-hint');
        document.body.classList.add('pass2');
        /* 二刷起点就带一点退化 */
        document.documentElement.style.setProperty('--corruption', '.22');
      }
      initBackTrack();
    },
    isPass2: function () { return pass2; }
  };

})(window.ABYSS);
