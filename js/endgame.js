/* ============================================================
   endgame.js — 触发／阅卷记录／瞳孔开洞／轮回
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var triggered = false;
  var deadCount = 0;

  /* ============================================================
     阅卷记录（眼睛上的文字）
     ============================================================ */
  var ro, roFinal, lines = [], finalText = '我看到你了。';

  function cacheDom() {
    ro = document.getElementById('eye-readout');
    roFinal = document.getElementById('roFinal');
    if (ro) {
      lines = [
        ['roTime', A.readout().time],
        ['roOS', A.readout().osbr],
        ['roSize', A.readout().size],
        ['roTZ', A.readout().tz]
      ];
    }
  }

  A.eyeReadout = {
    show: function () {
      if (!ro) cacheDom();
      if (!ro) return;
      var r = A.readout();
      var map = { roTime: r.time, roOS: r.osbr, roSize: r.size, roTZ: r.tz };
      Object.keys(map).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = map[id];
      });
      /* 深夜特供 */
      var h = new Date().getHours();
      var prev = document.getElementById('roPrev');
      if (prev && h >= 2 && h < 4) prev.textContent = '仍在室內　·　此時不應有人閱卷';

      ro.classList.add('show');
      if (A.audio) A.audio.paper();
    },
    say: function () {
      if (!ro) return;
      var say = ro.querySelector('.ro-say');
      if (!say) return;
      say.classList.add('show');
      /* 逐字打出 */
      if (roFinal) {
        roFinal.textContent = '';
        var i = 0;
        var tick = function () {
          if (i >= finalText.length) return;
          roFinal.textContent += finalText[i++];
          var gap = 120 + i * i * 26;          /* 越来越慢 */
          setTimeout(tick, gap);
        };
        setTimeout(tick, 700);
      }
    },
    hide: function () {
      if (ro) ro.classList.remove('show');
    },
    hintFirst: function () {
      if (ro && !ro.classList.contains('show')) ro.classList.add('show');
    },
    hintSecond: function () { },
    peel: function () {
      /* 瞳孔开洞：露出下层 */
      var layer = document.getElementById('eye-layer');
      var end = document.getElementById('endcard');
      if (end) { end.hidden = false; A.endgame.revealEnd(); }
      if (!layer) return;
      var hole = 0;
      var max = Math.max(window.innerWidth, window.innerHeight) * 1.5;
      var step = function () {
        hole += max * .012;
        layer.style.setProperty('--hole', hole.toFixed(1) + 'px');
        if (hole < max) requestAnimationFrame(step);
        else layer.style.opacity = '0';
      };
      requestAnimationFrame(step);
      if (A.audio) A.audio.pulse(.3);
    }
  };

  /* ============================================================
     触发：07 末尾继续滚
     ============================================================ */
  function atBottom() {
    return (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 6);
  }

  function armTrigger() {
    window.addEventListener('wheel', function (e) {
      if (triggered) return;
      if (!atBottom()) return;
      if (e.deltaY <= 0) return;
      deadCount++;
      /* 前两次：滚轮在转，页面不动 —— 让它真的不动 */
      e.preventDefault();
      if (deadCount === 1) {
        document.body.classList.add('scroll-dead');
        if (A.audio) A.audio.silence();
      }
      if (deadCount >= 3) {
        triggered = true;
        playEnding();
      }
    }, { passive: false });

    /* 触屏：到底后再上拉 */
    var touchY = 0;
    window.addEventListener('touchstart', function (e) {
      touchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (triggered || !atBottom()) return;
      var dy = touchY - e.touches[0].clientY;
      if (dy > 40) { triggered = true; playEnding(); }
    }, { passive: true });
  }

  /* ============================================================
     播放
     ============================================================ */
  function playEnding() {
    document.body.classList.add('locked');
    if (A.audio) A.audio.silence();
    /* 记录阅读页数（用于失踪案填空） */
    A._pageNo = Math.max(1, Math.round(A.corrupt.depth() * 96));

    setTimeout(function () {
      A.eye.start(function () {
        afterEye();
      });
    }, 600);
  }

  function afterEye() {
    /* 眼睛结束 → 失踪案已显示 → 停顿 → 滚回顶部 */
    var end = document.getElementById('endcard');
    setTimeout(function () {
      if (end) {
        /* 打字机：填名字 */
        typeName();
      }
    }, 400);
  }

  function typeName() {
    var el = document.getElementById('endName');
    if (!el) return;
    var txt = '下一個';
    var i = 0;
    var step = function () {
      if (i < txt.length) {
        el.textContent = txt.slice(0, ++i);
        setTimeout(step, 420);
      } else {
        /* 打完停住，然后滚回顶部 */
        setTimeout(function () { backToTop(); }, 2400);
      }
    };
    setTimeout(step, 900);
  }

  function backToTop() {
    var layer = document.getElementById('eye-layer');
    var end = document.getElementById('endcard');
    if (layer) { layer.hidden = true; layer.style.opacity = '1'; }
    if (end) end.hidden = true;
    document.body.classList.remove('locked', 'eye-open', 'scroll-dead');
    window.scrollTo(0, 0);

    mutateFirst();

    /* 不自动收走：留一个「归还」的出口，让读者自己看完 01 的变化 */
    setTimeout(function () {
      if (document.getElementById('returnHint')) return;
      var hint = document.createElement('div');
      hint.id = 'returnHint';
      hint.className = 'return-hint';
      hint.innerHTML = '<p>本卷已閱畢。</p>' +
        '<button type="button" id="returnBtn">歸　還　卷　宗</button>';
      document.body.appendChild(hint);
      requestAnimationFrame(function () { hint.classList.add('on'); });

      document.getElementById('returnBtn').addEventListener('click', function () {
        var filed = document.getElementById('filed');
        var archive = document.getElementById('archive');
        var cover = document.getElementById('cover');
        if (archive) archive.hidden = true;
        if (cover) cover.hidden = true;
        if (hint.parentNode) hint.parentNode.removeChild(hint);
        if (filed) filed.hidden = false;
        document.body.classList.add('stage-filed');
        document.body.classList.remove('stage-read');
        if (A.audio) A.audio.mute(true);
        window.scrollTo(0, 0);
      });
    }, 3200);
  }

  /* ============================================================
     回到顶部后：01 已变
     ============================================================ */
  function mutateFirst() {
    var stamp = document.querySelector('#ex01 .stamp-recv');
    if (stamp) {
      var d = new Date();
      stamp.innerHTML = '霞浦縣公署<br>收文　' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
      stamp.classList.add('stamp-today');
    }
    var sheet = document.querySelector('#ex01 .sheet');
    if (sheet && !document.getElementById('lastNote')) {
      var p = document.createElement('p');
      p.id = 'lastNote';
      p.className = 'last-note';
      p.textContent = '这次是你。';
      sheet.appendChild(p);
    }
    /* 扉页调阅记录第二格 */
    var rows = document.querySelectorAll('.borrow-table tr');
    if (rows.length > 1) {
      var tds = rows[1].querySelectorAll('td');
      if (tds.length >= 2) {
        var t = new Date();
        tds[0].textContent = '民國' + (t.getFullYear() - 1911) + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日';
        tds[1].textContent = '　';
        tds[0].classList.remove('borrow-empty');
        tds[1].classList.remove('borrow-empty');
      }
    }
    var s = A.store.read();
    s.finished = true;
    s.finishedAt = Date.now();
    A.store.write(s);
  }

  /* ============================================================
     对外
     ============================================================ */
  A.endgame = {
    init: function () {
      cacheDom();
      armTrigger();
      /* 再次调阅 */
      var again = document.getElementById('again');
      if (again) {
        again.addEventListener('click', function () {
          location.search = '';
          location.reload();
        });
      }
    },
    revealEnd: function () {
      var end = document.getElementById('endcard');
      if (!end) return;
      var bodies = end.querySelectorAll('.end-body');
      var pg = document.getElementById('endPage');
      if (pg) pg.textContent = A._pageNo || 47;
      bodies.forEach(function (b, i) {
        setTimeout(function () { b.classList.add('show'); }, 700 + i * 1400);
      });
      var dial = end.querySelector('.end-dialect');
      if (dial) setTimeout(function () { dial.classList.add('show'); }, 5200);
      if (A.audio) A.audio.paper();
    }
  };

})(window.ABYSS);
