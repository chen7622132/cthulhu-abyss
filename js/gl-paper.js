/* ============================================================
   gl-paper.js —— 纸面光照（真实高度图 + 法线光照 + AO）
   把 7 张暗版图当作 albedo，用真实纸纹当高度场，光跟手走。
   ============================================================ */
(function(){
  var cv = document.getElementById('gl');
  if (!cv) return;
  var gl = cv.getContext('webgl', {antialias:false, alpha:false, premultipliedAlpha:false});
  if (!gl) { cv.style.display='none'; document.body.classList.add('no-gl'); return; }

  var VS = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

  var FS = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform sampler2D uH;
  uniform vec2  uRes;
  uniform vec2  uLight;
  void main(){
    vec2 uv = vUv;
    float e = 1.25/uRes.x;
    float s = 1.7;
    float h  = texture2D(uH, uv*s).r;
    float hx = texture2D(uH, uv*s + vec2(e,0.0)).r;
    float hy = texture2D(uH, uv*s + vec2(0.0,e)).r;
    vec3 N = normalize(vec3((h-hx)*30.0, (h-hy)*30.0, 1.0));

    vec2 L2 = uLight - uv;  L2.x *= uRes.x/uRes.y;
    float dist = length(L2);
    vec3 L = normalize(vec3(L2*2.2, 0.55));

    vec3 albedo = mix(texture2D(uTex, uv).rgb, texture2D(uTexB, uv).rgb, uMix);
    albedo = pow(albedo, vec3(1.10)) * 2.6;

    float ao    = mix(0.40, 1.20, h);
    float ndl   = max(dot(N,L), 0.0);
    float atten = 1.0/(1.0 + dist*dist*5.0);
    float rim   = smoothstep(0.66, 0.08, dist);

    vec3 warm = vec3(1.00,0.755,0.465);
    vec3 amb  = vec3(0.040,0.046,0.040);
    vec3 col  = albedo * amb;
    col += albedo * warm * ndl * atten * rim * 6.6 * ao;

    float spec = pow(max(dot(reflect(-L,N), vec3(0.0,0.0,1.0)),0.0), 22.0);
    col += warm * spec * atten * rim * 0.85 * smoothstep(0.45,0.95,h);

    vec2 vq = uv - 0.5;
    col *= smoothstep(0.90, 0.26, length(vq*vec2(1.05,1.0)));

    col = mix(col, col*vec3(1.10,0.96,0.80), 0.55);
    gl_FragColor = vec4(col,1.0);
  }`;

  function sh(t, src){
    var s = gl.createShader(t); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog,'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);

  var uTex = gl.getUniformLocation(prog,'uTex'),
      uTexB= gl.getUniformLocation(prog,'uTexB'),
      uMix = gl.getUniformLocation(prog,'uMix'),
      uH   = gl.getUniformLocation(prog,'uH'),
      uRes = gl.getUniformLocation(prog,'uRes'),
      uLt  = gl.getUniformLocation(prog,'uLight');

  /* ---------- 高度图 ---------- */
  var texH = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texH);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  var imH = new Image();
  imH.onload = function(){
    gl.bindTexture(gl.TEXTURE_2D, texH);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,gl.LUMINANCE,gl.UNSIGNED_BYTE,imH);
    gl.uniform1i(uH, 1);
  };
  imH.src = 'assets/height.webp';

  /* ---------- 七张底图 ---------- */
  var PATHS = ['01','02','03','04','05','06','07'].map(function(n){
    return 'assets/plate-'+n+'-dark.webp';
  });
  var texs = new Array(PATHS.length);
  PATHS.forEach(function(p,i){
    var t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var im = new Image();
    im.onload = function(){
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);
      gl.uniform1i(uTex, 0);
    };
    im.src = p;
    texs[i] = t;
  });

  /* ---------- 尺寸 ---------- */
  function resize(){
    var dpr = Math.min(devicePixelRatio||1, 1.5);
    cv.width  = Math.floor(innerWidth*dpr);
    cv.height = Math.floor(innerHeight*dpr);
    gl.viewport(0,0,cv.width,cv.height);
  }
  resize(); addEventListener('resize', resize);

  /* ---------- 对外接口 ---------- */
  var lx=0.5, ly=0.5, page=0;

  var pageB = 0, mix = 0;
  window.PAPER = {
    light: function(x,y){ lx=x; ly=1-y; },
    page:  function(f){
      if(f<0) f=0;
      if(f>PATHS.length-1.001) f=PATHS.length-1.001;
      page  = Math.floor(f);
      pageB = Math.min(page+1, PATHS.length-1);
      mix   = f - page;
    }
  };

  var last=0;
  function frame(ts){
    if(ts-last > 16){
      last = ts;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texs[page]);
      gl.uniform1i(uTex, 0);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texs[pageB]);
      gl.uniform1i(uTexB, 2);
      gl.uniform1f(uMix, mix);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform2f(uLt, lx, ly);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
