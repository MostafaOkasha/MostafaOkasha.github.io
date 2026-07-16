/* OKBackdrop — living WebGL aurora/nebula field.
   Reactive to cursor + scroll, filmic, with a graceful 2D fallback.
   Usage: window.OKBackdrop.mount(canvasEl, { seed, intensity }) -> controller */
(function () {
  if (window.OKBackdrop) return;

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';

  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;uniform float uSeed;uniform float uIntensity;uniform vec3 uBg;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
    ' float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));',
    ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'float fbm(vec2 p){float v=0.0;float amp=0.55;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    ' for(int i=0;i<6;i++){v+=amp*noise(p);p=m*p;amp*=0.5;}return v;}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/uRes;',
    ' vec2 p=(gl_FragCoord.xy-0.5*uRes)/uRes.y;',
    ' p.y+=uScroll*0.35;',
    ' float t=uTime*0.035+uSeed;',
    ' vec2 mo=(uMouse-0.5)*vec2(uRes.x/uRes.y,1.0);',
    ' vec2 q=vec2(fbm(p*1.35+vec2(0.0,t)),fbm(p*1.35+vec2(5.2,1.3)+t*0.8));',
    ' vec2 mw=mo*0.4;',
    ' vec2 r=vec2(fbm(p*1.35+1.8*q+mw+vec2(1.7,9.2)),fbm(p*1.35+1.8*q-mw+vec2(8.3,2.8)-t*0.5));',
    ' float f=fbm(p*1.35+2.6*r);',
    ' f=f*f*1.25;',
    ' float ribbon=exp(-pow(p.y+0.30-0.20*sin(p.x*1.4+t*1.6+r.x*2.2),2.0)*3.2);',
    ' float ribbon2=exp(-pow(p.y-0.12-0.16*sin(p.x*1.9-t*1.1+r.y*2.0),2.0)*4.0);',
    ' float glow=clamp(f*0.85+ribbon*0.45+ribbon2*0.28,0.0,1.5);',
    ' vec3 bg=uBg;',
    ' vec3 c1=uC1;',
    ' vec3 c2=uC2;',
    ' vec3 c3=uC3;',
    ' vec3 col=bg;',
    ' col=mix(col,c1,smoothstep(0.05,0.90,f)*0.85);',
    ' col=mix(col,c2,smoothstep(0.62,1.25,glow)*0.55);',
    ' col+=c3*smoothstep(0.95,1.45,glow)*0.18*ribbon;',
    ' col*=uIntensity;',
    ' float vig=smoothstep(1.35,0.10,length(p));',
    ' col*=mix(0.30,1.0,vig);',
    ' col*=mix(1.0,0.42,smoothstep(-0.05,-0.7,-uv.y));',
    ' col*=0.78;',
    ' float g=hash(gl_FragCoord.xy+fract(uTime)*97.0);',
    ' col+=(g-0.5)*0.04;',
    ' gl_FragColor=vec4(max(col,0.0),1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('OKBackdrop shader error', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function fallback2D(canvas, opts) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return { destroy: function () {} };
    function paint() {
      var w = canvas.width, h = canvas.height;
      var g = ctx.createRadialGradient(w * 0.35, h * 0.25, 0, w * 0.35, h * 0.25, Math.max(w, h));
      g.addColorStop(0, '#241a4d');
      g.addColorStop(0.5, '#0d0b26');
      g.addColorStop(1, '#060512');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; paint(); }
    resize();
    window.addEventListener('resize', resize);
    return { destroy: function () { window.removeEventListener('resize', resize); } };
  }

  function mount(canvas, opts) {
    opts = opts || {};
    var seed = opts.seed || 0;
    var intensity = opts.intensity == null ? 1.0 : opts.intensity;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'high-performance', preserveDrawingBuffer: true })
          || canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!gl) return fallback2D(canvas, opts);

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return fallback2D(canvas, opts);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fallback2D(canvas, opts);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'uRes');
    var uTime = gl.getUniformLocation(prog, 'uTime');
    var uMouse = gl.getUniformLocation(prog, 'uMouse');
    var uScroll = gl.getUniformLocation(prog, 'uScroll');
    var uSeed = gl.getUniformLocation(prog, 'uSeed');
    var uIntensity = gl.getUniformLocation(prog, 'uIntensity');
    gl.uniform1f(uSeed, seed);
    gl.uniform1f(uIntensity, intensity);

    // palette: {bg, c1, c2, c3} as hex strings; defaults = violet dusk
    var PALETTES = {
      'violet-dusk': { bg: '#04040d', c1: '#6b42eb', c2: '#48d9d9', c3: '#ffb866' },
      'ember':       { bg: '#0a0406', c1: '#ff5a3c', c2: '#ffb03a', c3: '#ffe08a' },
      'aurora':      { bg: '#03080a', c1: '#2ee6a8', c2: '#3ad0ff', c3: '#b6ff8a' },
      'rose-gold':   { bg: '#0b040a', c1: '#ff4d8d', c2: '#c86bff', c3: '#ffd0a0' },
      'ice':         { bg: '#04070f', c1: '#3a7bff', c2: '#5ce0ff', c3: '#e8f4ff' },
      'mono-plasma': { bg: '#060606', c1: '#8a8a8a', c2: '#d8d8d8', c3: '#ffffff' }
    };
    function hex(h) { h = h.replace('#', ''); return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255]; }
    var pal = (typeof opts.palette === 'object' && opts.palette) ? opts.palette : (PALETTES[opts.palette] || PALETTES['violet-dusk']);
    gl.uniform3fv(gl.getUniformLocation(prog, 'uBg'), hex(pal.bg));
    gl.uniform3fv(gl.getUniformLocation(prog, 'uC1'), hex(pal.c1));
    gl.uniform3fv(gl.getUniformLocation(prog, 'uC2'), hex(pal.c2));
    gl.uniform3fv(gl.getUniformLocation(prog, 'uC3'), hex(pal.c3));

    var scale = Math.min(window.devicePixelRatio || 1, 1.4) * 0.68;
    function resize() {
      var w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      var h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener('resize', resize);

    var tmx = 0.5, tmy = 0.5, mx = 0.5, my = 0.5;
    function onMove(e) {
      var t = e.touches ? e.touches[0] : e;
      tmx = t.clientX / window.innerWidth;
      tmy = 1.0 - t.clientY / window.innerHeight;
    }
    if (!opts.noMouse) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
    }

    var scroll = 0;
    function onScroll() { scroll = (window.scrollY || 0) / Math.max(400, window.innerHeight); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var start = performance.now();
    var raf = 0, running = true;
    function frame(now) {
      if (!running) return;
      var t = reduce ? 8.0 : (now - start) / 1000;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) { running = false; return; }
      raf = requestAnimationFrame(frame);
    }
    // initial synchronous paint (also the only paint in static mode)
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, opts.static ? 6.0 : 0);
    gl.uniform2f(uMouse, 0.5, 0.5);
    gl.uniform1f(uScroll, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (opts.static) {
      // frozen: repaint only on resize, never animate or react to the cursor
      function repaint() {
        resize();
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, 6.0);
        gl.uniform2f(uMouse, 0.5, 0.5);
        gl.uniform1f(uScroll, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      window.addEventListener('resize', repaint);
      return { destroy: function () { window.removeEventListener('resize', resize); window.removeEventListener('resize', repaint); } };
    }
    raf = requestAnimationFrame(frame);

    function onVis() {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduce && !running) { running = true; start = performance.now() - 8000; raf = requestAnimationFrame(frame); }
    }
    document.addEventListener('visibilitychange', onVis);

    return {
      destroy: function () {
        running = false; cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVis);
      }
    };
  }

  window.OKBackdrop = { mount: mount };
})();
