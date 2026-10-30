/* ============================================================
   eye.js — 3D 光线步进眼睛（SDF Ray Marching）
   ============================================================ */

window.ABYSS = window.ABYSS || {};

(function (A) {
  'use strict';

  var canvas, gl, prog, loc = {}, raf = null, t0 = 0, running = false;
  var scale = 0.62;

  var VS = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FS = [
    'precision highp float;',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'uniform vec2 uLook;',
    'uniform float uOpen;',
    'uniform float uPupil;',
    '',
    'float hash21(vec2 p){',
    '  p = fract(p * vec2(123.34, 345.45));',
    '  p += dot(p, p + 34.345);',
    '  return fract(p.x * p.y);',
    '}',
    'float vnoise(vec2 p){',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f*f*(3.0-2.0*f);',
    '  float a = hash21(i);',
    '  float b = hash21(i+vec2(1.0,0.0));',
    '  float c = hash21(i+vec2(0.0,1.0));',
    '  float d = hash21(i+vec2(1.0,1.0));',
    '  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float v=0.0, a=0.5;',
    '  for(int i=0;i<5;i++){ v += a*vnoise(p); p *= 2.03; a *= 0.5; }',
    '  return v;',
    '}',
    'float smin(float a,float b,float k){',
    '  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);',
    '  return mix(b,a,h) - k*h*(1.0-h);',
    '}',
    'float sdEye(vec3 p){',
    '  float ball = length(p) - 1.0;',
    '  vec3 q = p - vec3(0.0, 0.0, 0.80);',
    '  float cor = length(vec3(q.x, q.y, q.z*0.70)) - 0.285;',
    '  return smin(ball, cor, 0.14);',
    '}',
    'vec3 nrm(vec3 p){',
    '  vec2 e = vec2(0.0018, 0.0);',
    '  return normalize(vec3(',
    '    sdEye(p+e.xyy) - sdEye(p-e.xyy),',
    '    sdEye(p+e.yxy) - sdEye(p-e.yxy),',
    '    sdEye(p+e.yyx) - sdEye(p-e.yyx)));',
    '}',
    '',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;',
    '  uv += vec2(sin(uTime*0.7)*0.0014, cos(uTime*0.53)*0.0010);',
    '',
    '  vec3 ro = vec3(0.0, 0.0, 1.66);',
    '  vec3 rd = normalize(vec3(uv * 1.06, -1.30));',
    '',
    '  float t = 0.0;',
    '  bool hit = false;',
    '  for(int i=0;i<88;i++){',
    '    vec3 p = ro + rd*t;',
    '    float d = sdEye(p);',
    '    if(d < 0.0013){ hit = true; break; }',
    '    t += d * 0.82;',
    '    if(t > 6.0) break;',
    '  }',
    '',
    '  vec3 col = vec3(0.0);',
    '',
    '  if(hit){',
    '    vec3 p = ro + rd*t;',
    '    vec3 n = nrm(p);',
    '    vec3 dir = normalize(p);',
    '    vec3 L = normalize(vec3(uLook * 0.42, 1.0));',
    '',
    '    float facing = dot(dir, L);',
    '    float irisMask = smoothstep(0.842, 0.872, facing);',
    '',
    '    vec3 T = normalize(cross(vec3(0.0,1.0,0.0), L));',
    '    vec3 B = cross(L, T);',
    '    vec2 pc = vec2(dot(dir, T), dot(dir, B));',
    '    float ax = 0.255;',
    '    float by = 0.102 * uPupil;',
    '    float ee = (pc.x*pc.x)/(ax*ax) + (pc.y*pc.y)/(by*by);',
    '    float pupilMask = smoothstep(1.0, 0.80, ee);',
    '',
    '    float r = length(pc);',
    '    float ang = atan(pc.y, pc.x);',
    '    float fib = fbm(vec2(ang*9.0 + uTime*0.05, r*13.0));',
    '    float streak = fbm(vec2(ang*54.0 + fib*3.4, r*3.2));',
    '    float t2 = smoothstep(0.30, 0.76, fib*0.62 + streak*0.58);',
    '    vec3 iris = mix(vec3(0.33,0.016,0.016), vec3(0.96,0.135,0.095), t2);',
    '    iris = mix(iris, vec3(1.00,0.26,0.20), smoothstep(0.40, 0.12, r)*0.62);',
    '    iris *= mix(1.0, 0.38, smoothstep(0.19, 0.30, r));',
    '',
    '    float vein = smoothstep(0.48, 0.94, fbm(dir.xy*8.6 + dir.z*3.4));',
    '    vec3 sclera = mix(vec3(0.82,0.77,0.70), vec3(0.56,0.11,0.09), vein*0.72);',
    '    sclera *= mix(0.46, 1.0, smoothstep(-0.3, 0.6, facing));',
    '',
    '    col = mix(sclera, iris, irisMask);',
    '    col = mix(col, vec3(0.014,0.0,0.0), pupilMask);',
    '',
    '    vec3 lightDir = normalize(vec3(-0.5, 0.72, 0.92));',
    '    float diff = clamp(dot(n, lightDir), 0.0, 1.0);',
    '    col *= (0.54 + 1.10*diff);',
    '',
    '    vec3 h = normalize(lightDir - rd);',
    '    float spec = pow(clamp(dot(n, h), 0.0, 1.0), 92.0);',
    '    col += vec3(1.0,0.94,0.90) * spec * 1.45;',
    '',
    '    float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);',
    '    col += vec3(0.28,0.09,0.09) * fres * 0.55;',
    '    col += iris * irisMask * 0.08;',
    '  }',
    '',
    '  float openH = mix(0.015, 0.64, uOpen);',
    '  float lid = smoothstep(openH, openH*0.90, abs(uv.y));',
    '  vec3 lidCol = vec3(0.070, 0.010, 0.012);',
    '  col = mix(lidCol, col, lid);',
    '',
    '  float edge = smoothstep(openH, openH*0.93, abs(uv.y)) * (1.0 - smoothstep(openH, openH*1.22, abs(uv.y)));',
    '  col *= (1.0 - edge*0.5);',
    '',
    '  float vig = 1.0 - smoothstep(0.34, 1.12, length(uv*vec2(0.86,1.0)));',
    '  col *= vig;',
    '  col = pow(max(col, 0.0), vec3(1.06));',
    '  float dth = (hash21(gl_FragCoord.xy * 1.37) - 0.5) * 0.024;',
    '  col += dth;',
    '',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[eye] shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function init() {
    canvas = document.getElementById('eye');
    if (!canvas) return false;
    var opts = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) return false;

    var vs = compile(gl.VERTEX_SHADER, VS);
    var fs = compile(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return false;

    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[eye] link error:', gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    loc.uRes = gl.getUniformLocation(prog, 'uRes');
    loc.uTime = gl.getUniformLocation(prog, 'uTime');
    loc.uLook = gl.getUniformLocation(prog, 'uLook');
    loc.uOpen = gl.getUniformLocation(prog, 'uOpen');
    loc.uPupil = gl.getUniformLocation(prog, 'uPupil');
    return true;
  }

  function resize() {
    if (!gl) return;
    var w = Math.max(320, Math.floor(window.innerWidth * scale));
    var h = Math.max(240, Math.floor(window.innerHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  /* ---------- 状态 ---------- */
  var st = { open: 0.02, lookX: 0, lookY: 0, pupil: 1, lookTX: 0, lookTY: 0 };
  var mouseNX = 0, mouseNY = 0;

  function onMouse(e) {
    mouseNX = (e.clientX / window.innerWidth - .5) * 2;
    mouseNY = -((e.clientY / window.innerHeight - .5) * 2);
  }

  function frame(now) {
    if (!running) return;
    var t = (now - t0) / 1000;

    /* 平滑逼近目标 */
    st.open += (st.targetOpen - st.open) * .12;
    st.lookX += (st.lookTX - st.lookX) * .16;
    st.lookY += (st.lookTY - st.lookY) * .16;

    resize();
    gl.uniform2f(loc.uRes, canvas.width, canvas.height);
    gl.uniform1f(loc.uTime, t);
    gl.uniform2f(loc.uLook, st.lookX, st.lookY);
    gl.uniform1f(loc.uOpen, st.open);
    gl.uniform1f(loc.uPupil, st.pupil);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    raf = requestAnimationFrame(frame);
  }

  /* ---------- 时间轴 ---------- */
  var timeline = [];
  function at(sec, fn) { timeline.push({ t: sec, fn: fn, done: false }); }

  function buildTimeline() {
    timeline = [];
    st.targetOpen = .34;
    st.pupil = 1;

    at(0.0, function () { st.targetOpen = .34; });
    at(0.7, function () { st.targetOpen = 1.0; });

    /* 扫视：快、停、快、停（横向） */
    at(1.4, function () { st.lookTX = -.62; st.lookTY = .10; });
    at(2.1, function () { st.lookTX = -.58; st.lookTY = .08; });
    at(2.6, function () { st.lookTX = .66; st.lookTY = -.06; });
    at(3.3, function () { st.lookTX = .60; st.lookTY = -.04; });
    at(3.9, function () { st.lookTX = -.20; st.lookTY = .16; });

    /* 锁定：正视光标 */
    at(5.0, function () {
      st.lookTX = 0; st.lookTY = 0;
      st.pupil = .58;                 /* 瞳孔猛缩 */
      if (A.audio) A.audio.pulse(.34);
    });
    at(5.6, function () { st.pupil = .82; });

    /* 读数 */
    at(6.0, function () { A.eyeReadout.show(); });
    at(9.4, function () { A.eyeReadout.say(); });
    at(10.6, function () { st.pupil = .56; if (A.audio) A.audio.pulse(.42); });
    at(12.2, function () { A.eyeReadout.hide(); });

    /* 注视：极慢呼吸 */
    at(13.0, function () { breathLoop(true); });

    /* 眨眼三次 */
    at(20.0, function () { blink(); });
    at(23.2, function () { blink(); });
    at(25.6, function () { blink(); A.eyeReadout.hintFirst(); });

    /* 闭眼 → 瞳孔开洞 */
    at(27.0, function () { st.targetOpen = 0.015; A.eyeReadout.hintSecond(); });
    at(28.6, function () { A.eyeReadout.peel(); });
    at(30.0, function () { finish(); });
  }

  var breathTimer = null;
  function breathLoop(on) {
    if (breathTimer) { clearInterval(breathTimer); breathTimer = null; }
    if (!on) return;
    breathTimer = setInterval(function () {
      st.pupil = .80 + Math.sin(Date.now() / 1400) * .07;
    }, 90);
  }

  function blink() {
    st.targetOpen = .02;
    var b = document.getElementById('blink');
    if (b) {
      b.classList.remove('on');
      void b.offsetWidth;
      b.classList.add('on');
    }
    if (A.audio) A.audio.pulse(.10);
    setTimeout(function () { st.targetOpen = 1; }, 170);
  }

  function runTimeline() {
    var t = (performance.now() - t0) / 1000;
    for (var i = 0; i < timeline.length; i++) {
      var e = timeline[i];
      if (!e.done && t >= e.t) { e.done = true; e.fn(); }
    }
  }

  /* ---------- 对外 ---------- */
  A.eye = {
    available: function () {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    },

    precompile: function () {
      /* 后台静默编译一次，避免出现时卡顿 */
      if (!init()) return false;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return true;
    },

    start: function (onFinish) {
      A._eyeFinish = onFinish || function () { };
      var layer = document.getElementById('eye-layer');
      if (!layer) return;

      if (!prog && !init()) {
        /* 无 WebGL：CSS 降级 */
        layer.classList.add('fallback');
        document.body.classList.add('eye-open');
        layer.hidden = false;
        A.eyeReadout.show();
        setTimeout(function () { A.eyeReadout.say(); }, 2600);
        setTimeout(function () { A.eyeReadout.peel(); }, 9000);
        setTimeout(function () { finish(); }, 14000);
        return;
      }

      document.body.classList.add('eye-open');
      layer.hidden = false;
      layer.style.setProperty('--hole', '0px');
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', onMouse, { passive: true });

      buildTimeline();
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
      if (A.audio) A.audio.subOn();

      setInterval(runTimeline, 60);
    }
  };

  function finish() {
    running = false;
    breathLoop(false);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMouse);
    window.removeEventListener('resize', resize);
    if (A.audio) A.audio.subOff();
    if (A._eyeFinish) A._eyeFinish();
  }

})(window.ABYSS);
