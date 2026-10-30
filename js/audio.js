/* ============================================================
   audio.js — Web Audio 实时合成（零音频文件）
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var ctx = null, master = null, droneGain = null, lp = null;
  var noiseSrc = null, noiseGain = null, noiseFilter = null;
  var started = false, muted = true;
  var depth = 0;         /* 0..1 阅读深度 */
  var timer = null;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function makeNoiseBuffer(c) {
    var len = Math.floor(c.sampleRate * 2);
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function init() {
    if (ctx) return true;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1200;
    lp.Q.value = .6;
    lp.connect(master);

    /* ---- 低频 drone：两个相近频率产生拍频 ---- */
    droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    droneGain.connect(lp);

    var o1 = ctx.createOscillator();
    o1.type = 'sine'; o1.frequency.value = 47.5;
    var o2 = ctx.createOscillator();
    o2.type = 'sine'; o2.frequency.value = 48.9;   /* 拍频 ~1.4Hz */
    var o3 = ctx.createOscillator();
    o3.type = 'triangle'; o3.frequency.value = 96;
    var g3 = ctx.createGain(); g3.gain.value = 0.14;
    o3.connect(g3); g3.connect(droneGain);
    o1.connect(droneGain); o2.connect(droneGain);
    o1.start(); o2.start(); o3.start();

    /* ---- 纸页／环境噪声 ---- */
    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = makeNoiseBuffer(ctx);
    noiseSrc.loop = true;

    noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1600;
    noiseFilter.Q.value = 0.8;

    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.0;

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSrc.start();

    return true;
  }

  function fade(v, t) {
    if (!ctx || !master) return;
    var n = ctx.currentTime;
    master.gain.cancelScheduledValues(n);
    master.gain.setTargetAtTime(v, n, t || 1.2);
  }

  /* 一次极轻的纸页摩擦 */
  function paperRustle() {
    if (!ctx || muted) return;
    var n = ctx.currentTime;
    var src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx);
    var bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = rnd(2200, 4200); bp.Q.value = 1.6;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(rnd(.012, .03), n + .06);
    g.gain.exponentialRampToValueAtTime(.0001, n + rnd(.35, .8));
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(n); src.stop(n + 1);
  }

  /* 远处水滴 */
  function drop() {
    if (!ctx || muted) return;
    var n = ctx.currentTime;
    var o = ctx.createOscillator();
    o.type = 'sine';
    var f0 = rnd(700, 1300);
    o.frequency.setValueAtTime(f0, n);
    o.frequency.exponentialRampToValueAtTime(f0 * .45, n + .18);
    var g = ctx.createGain();
    g.gain.setValueAtTime(.035, n);
    g.gain.exponentialRampToValueAtTime(.0001, n + .5);
    var dl = ctx.createDelay(1);
    dl.delayTime.value = .3;
    var fb = ctx.createGain(); fb.gain.value = .22;
    o.connect(g); g.connect(master);
    g.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(master);
    o.start(n); o.stop(n + .6);
  }

  /* 低频脉冲（心跳） */
  function pulse(strength) {
    if (!ctx || muted) return;
    var n = ctx.currentTime;
    var o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(64, n);
    o.frequency.exponentialRampToValueAtTime(38, n + .22);
    var g = ctx.createGain();
    var peak = (strength || .2);
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(peak, n + .02);
    g.gain.exponentialRampToValueAtTime(.0001, n + .45);
    o.connect(g); g.connect(master);
    o.start(n); o.stop(n + .5);
  }

  /* 眼睛段的次声嗡鸣 */
  var subOsc = null, subGain = null;
  function subOn() {
    if (!ctx) return;
    if (subOsc) return;
    subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = 37;
    subGain = ctx.createGain();
    subGain.gain.value = 0;
    subOsc.connect(subGain); subGain.connect(master);
    subOsc.start();
    subGain.gain.setTargetAtTime(.22, ctx.currentTime, 1.5);
  }
  function subOff() {
    if (!ctx || !subOsc) return;
    subGain.gain.setTargetAtTime(0, ctx.currentTime, .8);
    var o = subOsc, g = subGain;
    subOsc = null; subGain = null;
    setTimeout(function () { try { o.stop(); o.disconnect(); g.disconnect(); } catch (e) { } }, 2600);
  }

  /* ---- 对外 API ---- */
  A.audio = {
    start: function () {
      if (!init()) return false;
      if (ctx.state === 'suspended') ctx.resume();
      if (!started) {
        started = true;
        muted = false;
        fade(0.5, 2.0);
        /* 随机环境声 */
        timer = setInterval(function () {
          if (muted) return;
          var r = Math.random();
          if (r < .55) paperRustle();
          else if (r < .85) drop();
          else pulse(.12);
        }, 9000);
      }
      return true;
    },
    mute: function (on) {
      muted = !!on;
      fade(on ? 0 : 0.5, .8);
    },
    isMuted: function () { return muted; },
    hasStarted: function () { return started; },

    /* 阅读深度：越深，低通越暗 */
    setDepth: function (x) {
      depth = Math.max(0, Math.min(1, x));
      if (!ctx) return;
      var n = ctx.currentTime;
      lp.frequency.setTargetAtTime(1400 - depth * 820, n, .8);
      if (droneGain) droneGain.gain.setTargetAtTime(.16 + depth * .10, n, 1.2);
    },

    /* 憋气：长时间停留，声音变闷变小 */
    setBreath: function (hold) {
      if (!ctx) return;
      var n = ctx.currentTime;
      lp.frequency.setTargetAtTime(hold ? 260 : (1400 - depth * 820), n, hold ? 3.5 : .5);
      if (droneGain) droneGain.gain.setTargetAtTime(hold ? .05 : (.16 + depth * .10), n, hold ? 3.0 : .6);
    },

    pulse: pulse,
    drop: drop,
    paper: paperRustle,
    subOn: subOn,
    subOff: subOff,

    /* 声音比画面晚一拍消失 */
    lateOut: function (ms) {
      if (!ctx) return;
      var n = ctx.currentTime;
      master.gain.setTargetAtTime(master.gain.value, n, 0.01);
      setTimeout(function () { fade(0, .35); }, ms || 200);
    },

    silence: function () {
      fade(0, .25);
    }
  };

})(window.ABYSS);
