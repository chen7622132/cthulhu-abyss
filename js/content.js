/* ============================================================
   content.js — 内容与配置数据层
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  /* ---------- 三份附件（L3 放大镜打开） ---------- */
  A.ATTACH = {
    1: {
      title: '底片袋 · 細看',
      html: '<p>袋口折叠处，有一道铅笔记号：</p>' +
        '<p style="font-family:var(--f-kai);font-size:17px;letter-spacing:.12em;">「三張。三號另寄。」</p>' +
        '<p>「另寄」二字被人用指甲刮过，但刮不掉。</p>' +
        '<p>袋背右下角，冲印店字号已模糊，可辨「澳口 · 光華照相」六字。</p>' +
        '<p style="color:#9d2b20;">冲印单存根第三行：十月十六日。案发于十月十一日。</p>'
    },
    2: {
      title: '船牌存根 · 調閱原件',
      html: '<p><b>閩霞字第〇四七號</b>　存根　民國十五年三月初二</p>' +
        '<p>船名：順發</p><p>船式：十三股艚</p>' +
        '<p>保結人：林阿火、陳水來（族鄰）；王番薯（澳甲）。</p>' +
        '<p>核發：霞浦縣船政房　經手　<span style="color:#9d2b20;">▉▉▉</span></p>' +
        '<hr style="border:0;border-top:1px dashed rgba(74,58,36,.4);margin:16px 0">' +
        '<p>按：本縣例，一船為盜，同結連坐。故此三保結人，於本案後均被傳訊。</p>' +
        '<p style="color:#9d2b20;">傳訊記錄：無。三人皆未到案。</p>'
    },
    3: {
      title: '訊問筆錄 · 背面',
      html: '<p style="font-family:var(--f-kai);color:#5a4830;">（不是公文紙。背面用鉛筆寫著，字很輕。）</p>' +
        '<p style="font-family:var(--f-kai);font-size:16px;line-height:2.1;">' +
        '他今日說「街上跟澳裏一樣」。<br>我問他街上有人否。他說有。<br>' +
        '我問他幾個人。他說六個。<br>' +
        '<span style="color:#9d2b20;">我問他：「順發」船上幾個人。他說六個。</span><br>' +
        '我不寫進去了。寫進去科員會罵我。</p>' +
        '<p style="font-family:var(--f-kai);color:#5a4830;">——十 月 廿 九 夜</p>'
    }
  };

  /* ---------- 间歇污染（会消失的幻觉） ---------- */
  A.GLITCHES = [
    { ex: 1, at: 0.55, type: 'echo', sel: '#ex01 .stamp-recv', text: '霞浦縣公署<br>收文　九月廿九', dur: 900 },
    { ex: 2, at: 0.45, type: 'shape', sel: '#ex02 .film-slot.missing', dur: 1600 },
    { ex: 3, at: 0.38, type: 'echo', sel: '#ex03 .depo-dialect td', text: '稱：伊猶在咧。', dur: 1200 },
    { ex: 3, at: 0.72, type: 'swap', sel: '#ex03 .depo:nth-of-type(2) .depo-num', text: '船上七個人。', dur: 1400 },
    { ex: 4, at: 0.30, type: 'swap', sel: '#ex04 .ship-name', text: '順　興', dur: 1100 },
    { ex: 4, at: 0.66, type: 'swap', sel: '#ex04 .ship-name', text: '　　？', dur: 700 },
    { ex: 5, at: 0.22, type: 'swap', sel: '#ex05 .typed-1', text: '答：不在海上。', dur: 1000 },
    { ex: 5, at: 0.52, type: 'echo', sel: '#ex05 .typed-3', text: '答：他們沒有影子。', dur: 900 },
    { ex: 5, at: 0.80, type: 'swap', sel: '#ex05 .typed-1', text: '問：你現在在看什麼？', dur: 1500 },
    { ex: 6, at: 0.28, type: 'row', sel: '#ex06 .carbon-gap', dur: 1300 },
    { ex: 6, at: 0.55, type: 'row', sel: '#ex06 .carbon-gap', dur: 900 },
    { ex: 6, at: 0.82, type: 'row', sel: '#ex06 .carbon-gap', dur: 2000 }
  ];

  A.ROW07 = ['〇七', '照片　一張', '三寸', '第三張'];

  A.ARCHIVIST = '陳守義';

  /* ---------- 时辰 ---------- */
  A.shichen = function (d) {
    var h = d.getHours();
    var names = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    var idx = Math.floor(((h + 1) % 24) / 2);
    var m = d.getMinutes();
    var part = m < 15 ? '初' : m < 30 ? '一' : m < 45 ? '二' : '三';
    return names[idx] + '时' + part + '刻';
  };

  var CN = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  function digits(v) {
    var s = String(v), out = '';
    for (var i = 0; i < s.length; i++) out += (CN[+s[i]] !== undefined ? CN[+s[i]] : s[i]);
    return out;
  }
  A.digits = digits;

  A.gregorianCN = function (d) {
    return digits(d.getFullYear()) + '年' + digits(d.getMonth() + 1) + '月' + digits(d.getDate()) + '日';
  };

  /* ---------- 设备信息 ---------- */
  A.readout = function () {
    var d = new Date();
    var ua = navigator.userAgent;
    var os = /Windows/.test(ua) ? 'Windows'
      : /Mac OS X|Macintosh/.test(ua) ? 'macOS'
        : /Android/.test(ua) ? 'Android'
          : /iPhone|iPad/.test(ua) ? 'iOS'
            : /Linux/.test(ua) ? 'Linux' : '未詳';
    var br = /Edg\//.test(ua) ? 'Edge'
      : /Firefox\//.test(ua) ? 'Firefox'
        : /Chrome\//.test(ua) ? 'Chrome'
          : /Safari\//.test(ua) ? 'Safari' : '未詳';
    var tz = '';
    try {
      var z = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/Shanghai|Chongqing|Harbin|Urumqi/.test(z)) tz = '東八區';
      else if (/Tokyo/.test(z)) tz = '東九區';
      else tz = z.split('/').pop().replace(/_/g, ' ') || '未詳';
    } catch (e) { tz = '未詳'; }
    return {
      time: A.gregorianCN(d) + '　' + A.shichen(d),
      osbr: os + ' ／ ' + br,
      size: digits(screen.width) + ' × ' + digits(screen.height),
      tz: tz
    };
  };

  /* ---------- 存档 ---------- */
  var KEY = 'abyss.v1';
  A.store = {
    read: function () {
      try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
    },
    write: function (o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } },
    bump: function () {
      var s = A.store.read();
      s.count = (s.count || 0) + 1;
      if (!s.first) s.first = Date.now();
      s.last = Date.now();
      A.store.write(s);
      return s.count;
    }
  };

  A.quiet = /[?&]quiet=1/.test(location.search) ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

})(window.ABYSS);
