/* ============================================================
   paper.js — 材质层注入（第 2 轮）
   给每张 .sheet 塞一个 .paper-bg，纸在下面，字在上面
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var DEFS = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"',
    ' style="position:fixed;width:0;height:0;overflow:hidden;pointer-events:none">',
    '<defs>',
    '<filter id="tornEdge" x="-16%" y="-16%" width="132%" height="132%">',
    '  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="5" result="n1"/>',
    '  <feTurbulence type="fractalNoise" baseFrequency="0.095" numOctaves="4" seed="13" result="n2"/>',
    '  <feDisplacementMap in="SourceGraphic" in2="n1" scale="26" xChannelSelector="R" yChannelSelector="G" result="d1"/>',
    '  <feDisplacementMap in="d1" in2="n2" scale="7" xChannelSelector="R" yChannelSelector="G" result="d2"/>',
    '  <feGaussianBlur in="d2" stdDeviation="0.4"/>',
    '</filter>',
    '</defs>',
    '</svg>'
  ].join('');

  function injectFilters() {
    if (document.getElementById('abyss-filters')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = DEFS;
    var svg = wrap.firstChild;
    if (svg) {
      svg.id = 'abyss-filters';
      document.body.appendChild(svg);
    }
  }

  var PARTS = ['lightpass', 'mold', 'film', 'water'];

  /* 档案元信息：让每一页都像被编过号、入过柜的东西 */
  var META = '全宗號　閩海關·十七·〇〇七　／　案卷　三　／　保管期限　永久　／　密';

  function stampMeta(s) {
    if (s.querySelector('.sheet-meta')) return;
    var m = document.createElement('div');
    m.className = 'sheet-meta';
    m.textContent = META;
    s.appendChild(m);
  }

  /* 07 最后：一句只有抬起眼才读得到的话 */
  function stampLastWords() {
    var nb = document.querySelector('#ex07 .nb-body');
    if (!nb || document.getElementById('lastWords')) return;
    var p = document.createElement('p');
    p.id = 'lastWords';
    p.className = 'last-words';
    p.textContent = '你現在抬頭了嗎。';
    nb.appendChild(p);
  }

  function buildPaper() {
    [].forEach.call(document.querySelectorAll('.sheet'), function (s) {
      if (s.querySelector('.paper-bg')) return;
      var bg = document.createElement('div');
      bg.className = 'paper-bg';
      bg.setAttribute('aria-hidden', 'true');
      PARTS.forEach(function (c) {
        var d = document.createElement('div');
        d.className = c;
        bg.appendChild(d);
      });
      s.insertBefore(bg, s.firstChild);
      stampMeta(s);
      /* 污渍层：盖在文字之上，让字也被"泡"一遍 */
      if (!s.querySelector('.grime')) {
        var g = document.createElement('div');
        g.className = 'grime';
        g.setAttribute('aria-hidden', 'true');
        var gm = document.createElement('div'); gm.className = 'mold';
        var gw = document.createElement('div'); gw.className = 'water';
        g.appendChild(gm); g.appendChild(gw);
        s.appendChild(g);
      }
    });
  }

  A.paper = {
    init: function () {
      injectFilters();
      buildPaper();
    }
  };

})(window.ABYSS);
