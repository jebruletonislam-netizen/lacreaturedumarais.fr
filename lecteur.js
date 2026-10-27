/* Lecteur du site (normal et mode putride) : une barre fine en bas de page. */
(function () {
  if (window.LCMPlayer) return;

  var PU = !!document.querySelector('link[href*="putride.css"]');
  var CAT = {
    'album-jubile': { apple: 1855845168, sp: ["4a4mHcekaU92QW4BsYpWlh"] },
    'album-in-odium-fidei': { apple: 1855845168, sp: ["4a4mHcekaU92QW4BsYpWlh"], tracks: [0, null] },
    'album-confiteor': { apple: 1842647218, sp: ["466yv6V3WKBuUswl7n8YMJ","3JdzgZNrULJH41nI9lkxum","0aK2QerKM9cG1JXV4tdK6o","3z6t176IZ6rHiBSdVoLaYN","0QG1R046K3uPJODsklrPGv","7MLsEj75aIXH0ab2WTLZrj","77cjiEF7Byluo36G5BkBja","23LL3xNNdj9aKfVEubuUoe","51MTVoOVkhRyXOzASIH1x6","1YAQeVHaCdOYR8iXJFkllr","0KCZJY0zfPXZAxWmjATNi4","4UVRYCfSKMHFlEPu1aQQzz","66MfrvaNE8iXzLLFYgjjUh","6VO87A9bE4wpo3decYyDgj","6uOgRskGVolCSM0kr4Kerc","3WZiYhszdIkBmdAmb3nCwh","7765UbTJ4ZISrUJ9QpVSM6","6DPlM3jZFys7BvX7ZO9Qmc","4jujwrwHZnhCPxrLhHkUWS","4CNCyEFSWfAhyLvXKzW9Ze","3PJ2ish86VhSWqIwOoLi5F","2yNzp3vLWHwPGtLEqOoDUi","3F9ZVo2jEmaky2ecLbOYaY","4Xc6zFzYYCJiznSWl0Nk27","00v7sy5XEe25ceVRU2pQ9z","3IkJgUNwrDYD7HoTiGvFcB","3yfzJfgQ61oe68RHw934EE","6NJ7blHTK7O1MdXx7EwX4q","2IxXkODFFTo9OVnfFFIZ4g","1uXLjVo3FO4ZJTC4irP0pm","72EUM4YFsy60zx5JQRLc3N","6RqebngtfZvLGojO7wE0LS","4NnaCa9cSnc5YH1f6CTWDW","5EADpuGgS6zaFr4Of2u4dW"] },
    'album-chyren': { apple: 1835753265, sp: ["1h9n1OmcyW5yMkvc5fic55","7nufqJdxZBdd0aV432tRGt","0Ly56ID5ePXLbBHig0Yzil","6T1I3npVTWtgKd82xOiOs6","04sQoqi1syBQ5zmmpIoPeO","4UC8kddvp6FfeKMz7hCqEs","7fOgCNHOkJ46llOHcMnqh0","5TOXSnsJZgeoe6c5LhjON0","2csH47elMlJknVPLBtDOVI","0qfhNodSU61z3AmQc8cEnb","1u9oV8fFrKXQCNm2dBXAl0","1MoQvT4HVye63nC9auGCy8","0GFed54W5TfKU6eoyvT5TJ","2m0MnEulQyyvHxTtKymfQX","7uGx8JDJClKSOsevsTmadq","0EYoPwXIoUqQt8u1zYxk5D","56PCPhWLQGoTkZJ2dmaX0p","4Yv6wvMHV2uCh55n7RuuSf","3H7SIcXiFwEoarAOPHJbhJ","1QM2Lssu2fAfn7WG4MKVe4","2B9mBQr6JGA72s1nxDDCe1","0jfeKtXcFX8Qey78LFcCCJ","0z1yWyvooHGernzfXE7LnJ","3SBOzMP7Wgsi1oCplqQQIx","19i61yMBKlKjBgomh0juXn","22DT15t7A1CsMdpgzh63Ob"] },
    'album-omerta434': { apple: 1739538878, sp: ["1iHnodeN7hFHQ7yDD2oY9w","0JZLVXcLTcCX8aYyowE7vP","25NfCP2VAcC7t8b34tcDkI","4t8Fzw8R7XfQ6f5062i08o","1X2vUtdcghtlAdC33DZCJw","1ghnMnMPhTSlClNSwMN0mc","3gIJbMy6bTYq5duZdMEIhp","4aebIOPaGxhrlZTDCmAu67","6cBfLgR2CdJ9Gv0z35lW2K","5qXYY1oYKdOJe2eGWDA28U","1JdWvyY28LnvHpMGoJEzrB","4SWM5kPsNTz0qqgnbfVRne","6kSjqn9Er9tO2sOOZNcTvE","4J4Y1PoApPnplLDeAXTUgc","1XeGUZLMnXqLXWyLi6X9Ch","2DOEt97UQaGqWHqAtAmq1P","0LFdL7zex0mTHO7IsE6zup"] },
    'album-machines': { apple: 1842736843, sp: ["7holxlJunu6Of8BcYbsvIk","2G4wmTK7MCjpJLkto5bSL3","7nAO9NVWD2vE2Ekgr5PerD","1UrAHsWBPIg2hM92YJ9Tnz","59GkXd6lgUQjHSCqiVhvi1","1GrBv29iooXao0QjRvbALQ","0ayte0POHyDCQXzu4gqv2O","1BeeHijbO8pLeuBlAkAKJF","0G5MpkiVKdZAoNj5MhnK8j","4SoGQ43WmpPDWRUrHg233F","15bedmuSSsTP2MrFUjtiWE","1vEaS6ROYED4gtQjafKKdA","4KSkIbdi09JbZoOX26jlNY","3js313E4RZfmSsEjiAKXmF","5nWQWznkWb6P9LDGdihWIz","5ozFvuV9JsP7fPoPIgahe9","4V6e2h947T2Jxwnf07fkbU","0wIylud2rJHUzmLubUCAmp","3bbklUSjxyHsrpho6xot5k","3lfJeK3kwO2lw2RL05r0yG"] }
  };

  var IC = {
    play: '<path d="M8.5 5.2v13.6L19 12z"/>',
    pause: '<path d="M9 5.5v13M15 5.5v13"/>',
    prev: '<path d="M6.5 5.5v13M18 5.5v13L9.5 12z"/>',
    next: '<path d="M17.5 5.5v13M6 5.5v13L14.5 12z"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    vol: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11"/>',
    mute: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>'; }

  var st = document.createElement('style');
  st.textContent = [
    '#lcmp{--lc:#f00;--hv:#fc0;--bg:rgba(0,0,0,.93);position:fixed;left:50%;bottom:.7rem;z-index:90;width:min(46rem,calc(100vw - 1.4rem));transform:translate(-50%,160%);opacity:0;transition:transform .45s cubic-bezier(.2,.9,.3,1),opacity .3s;color:#fff;background:var(--bg);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);border:1px solid var(--lc);border-radius:1rem;box-shadow:0 .5rem 1.6rem rgba(0,0,0,.85)}',
    '#lcmp.pu{--lc:#c58bff;--hv:#39ff6e;--bg:rgba(11,0,22,.95);border-color:#39ff6e;box-shadow:0 .5rem 1.6rem rgba(0,0,0,.85),0 0 .9rem rgba(122,45,214,.45)}',
    '#lcmp.pu::before{background:linear-gradient(90deg,transparent,#39ff6e,transparent);filter:drop-shadow(0 0 3px #39ff6e)}',
    '#lcmp.pu .lp-t{color:#c58bff}#lcmp.pu .lp-a{color:rgba(197,139,255,.68)}#lcmp.pu .lp-p{color:rgba(197,139,255,.7)}',
    '#lcmp.pu .lp-b{color:#c58bff}#lcmp.pu .lp-x{color:rgba(197,139,255,.75)}#lcmp.pu .lp-bar{background:rgba(197,139,255,.3)}',
    '#lcmp.pu .lp-b:hover,#lcmp.pu .lp-b:focus-visible,#lcmp.pu .lp-x:hover{color:#39ff6e;border-color:#39ff6e}',
    '#lcmp .lp-v{display:flex;align-items:center;gap:.3rem;flex:none}',
    '#lcmp .lp-vol{-webkit-appearance:none;appearance:none;width:5.2rem;height:1rem;margin:0;background:transparent;cursor:pointer}',
    '#lcmp .lp-vol::-webkit-slider-runnable-track{height:2px;background:linear-gradient(90deg,var(--lc) var(--vp,100%),rgba(255,255,255,.28) var(--vp,100%))}',
    '#lcmp .lp-vol::-moz-range-track{height:2px;background:rgba(255,255,255,.28)}',
    '#lcmp .lp-vol::-moz-range-progress{height:2px;background:var(--lc)}',
    '#lcmp .lp-vol::-webkit-slider-thumb{-webkit-appearance:none;width:.7rem;height:.7rem;margin-top:-.3rem;border-radius:50%;background:var(--lc);border:0}',
    '#lcmp .lp-vol::-moz-range-thumb{width:.7rem;height:.7rem;border-radius:50%;background:var(--lc);border:0}',
    '#lcmp .lp-vol:focus-visible{outline:1px solid var(--hv);outline-offset:.2rem}',
    '#lcmp.nv .lp-v{opacity:.35}#lcmp.nv .lp-vol{pointer-events:none}',
    '@media (max-width:899px){#lcmp .lp-v{display:none}}',
    '#lcmp.on{transform:translate(-50%,0);opacity:1}',
    '#lcmp::before{content:"";position:absolute;left:1.4rem;right:1.4rem;top:-1px;height:1px;background:linear-gradient(90deg,transparent,var(--lc),transparent);filter:drop-shadow(0 0 3px var(--lc))}',
    '#lcmp .lp-r{display:flex;align-items:center;gap:.8rem;padding:.55rem .7rem .55rem .8rem}',
    '#lcmp .lp-c{display:flex;align-items:center;gap:.3rem;flex:none}',
    '#lcmp .lp-m{flex:1;min-width:0}',
    '#lcmp .lp-n{overflow:hidden;line-height:1.1;white-space:nowrap}',
    '#lcmp .lp-w{display:inline-flex;align-items:baseline;gap:.55rem;will-change:transform}',
    '#lcmp .lp-n.ov{-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}',
    '#lcmp .lp-n.ov .lp-w{animation:lpscroll var(--ld,8s) ease-in-out infinite alternate}',
    '@keyframes lpscroll{0%,18%{transform:translateX(0)}82%,100%{transform:translateX(var(--lx,0))}}',
    '@media (prefers-reduced-motion:reduce){#lcmp .lp-n.ov .lp-w{animation:none}}',
    '#lcmp .lp-t{flex:none;font:400 1.2rem "Bebas Neue",sans-serif;letter-spacing:.06em;color:#fff}',
    '#lcmp .lp-t:empty,#lcmp .lp-a:empty{display:none}',
    '#lcmp .lp-t:not(:empty)+.lp-a:not(:empty)::before{content:"\\00b7";margin-right:.55rem;color:var(--lc)}',
    '#lcmp .lp-a{flex:none;font:400 .95rem "Bebas Neue",sans-serif;letter-spacing:.1em;color:rgba(255,255,255,.62)}',
    '#lcmp .lp-p{display:flex;align-items:center;gap:.6rem;margin-top:.1rem;font:400 .85rem "Bebas Neue",sans-serif;letter-spacing:.08em;color:rgba(255,255,255,.6);font-variant-numeric:tabular-nums}',
    '#lcmp .lp-p span{flex:none;min-width:2.1rem}#lcmp .lp-p span:last-child{text-align:right}',
    '#lcmp .lp-bar{position:relative;flex:1;height:1px;background:rgba(255,255,255,.28);cursor:pointer;touch-action:none}',
    '#lcmp .lp-bar::before{content:"";position:absolute;left:0;right:0;top:-.8rem;bottom:-.8rem}',
    '#lcmp .lp-bar:focus-visible{outline:1px solid var(--hv);outline-offset:.5rem}',
    '#lcmp .lp-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--lc);box-shadow:0 0 4px var(--lc)}',
    '#lcmp .lp-fill::after{content:"";position:absolute;right:-.28rem;top:50%;width:.55rem;height:.55rem;margin-top:-.275rem;border-radius:50%;background:var(--lc);box-shadow:0 0 5px var(--lc)}',
    '#lcmp .lp-b{all:unset;box-sizing:border-box;cursor:pointer;flex:none;width:1.9rem;height:1.9rem;display:flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:50%;color:#fff;transition:color .2s,border-color .2s}',
    '#lcmp .lp-b svg{width:62%;height:62%;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}',
    '#lcmp .lp-b.pp{width:2.5rem;height:2.5rem;border-color:var(--lc)}',
    '#lcmp .lp-b.pp svg{width:56%;height:56%}',
    '#lcmp .lp-b:hover,#lcmp .lp-b:focus-visible{color:var(--hv);border-color:var(--hv)}',
    '#lcmp .lp-x{width:1.7rem;height:1.7rem;color:rgba(255,255,255,.7)}',
    '#lcmp .lp-f{padding:0 .8rem .6rem}#lcmp .lp-f:empty{display:none}',
    '#lcmp .lp-f iframe{display:block;width:100%;border:0;border-radius:.7rem;background:transparent;color-scheme:dark}',
    '#lcmp .lp-yt{display:block;margin-top:.4rem;text-align:center;font:400 .9rem "Bebas Neue",sans-serif;letter-spacing:.1em;color:rgba(255,255,255,.62);text-decoration:none}',
    '#lcmp .lp-yt:hover,#lcmp .lp-yt:focus-visible{color:var(--hv);text-decoration:underline;outline:0}',
    '#lcmp .lp-f iframe.hid{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}',
    '.lcm-sph{position:fixed;left:0;bottom:0;width:300px;height:80px;opacity:0;pointer-events:none;z-index:-1;overflow:hidden}',
    '.lcm-sph iframe{display:block;width:100%;height:80px;border:0;color-scheme:dark}',
    '#lcmp>.lcm-sph.vis{position:static;width:auto;height:auto;opacity:1;pointer-events:auto;z-index:auto;overflow:visible;padding:0 .8rem .6rem}',
    '#lcmp>.lcm-sph.vis iframe{border-radius:.7rem}',
    '#lcmp.bc .lp-c,#lcmp.bc .lp-p{display:none}',
    '#lcmp.bc .lp-r{padding-bottom:.4rem}',
    '@media (max-width:899px){#lcmp{bottom:.45rem;width:calc(100vw - .9rem);border-radius:.9rem}#lcmp .lp-r{gap:.55rem;padding:.5rem .5rem .5rem .6rem}#lcmp .lp-t{font-size:1.1rem}#lcmp .lp-a{font-size:.85rem}#lcmp .lp-b{width:1.8rem;height:1.8rem}#lcmp .lp-b.pp{width:2.3rem;height:2.3rem}}',
    '@media (prefers-reduced-motion:reduce){#lcmp{transition:none}}'
  ].join('');
  document.head.appendChild(st);

  var el = null, mode = '', key = '';
  var wg = null, sc = { url: '', i: 0, dur: 0, pos: 0 };
  var apiState = 0, apiQ = [];

  function $(s) { return el && el.querySelector(s); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function setPP(on) {
    if (!el) return;
    var b = $('.pp');
    b.innerHTML = svg(on ? IC.pause : IC.play);
    b.setAttribute('aria-label', on ? 'Pause' : 'Lecture');
  }
  function fitNames() {
    var n = $('.lp-n'), w = $('.lp-w');
    if (!n || !w) return;
    n.classList.remove('ov');
    var d = w.scrollWidth - n.clientWidth;
    if (d > 4) {
      w.style.setProperty('--lx', '-' + (d + 12) + 'px');
      w.style.setProperty('--ld', Math.max(6, (d + 12) / 28) + 's');
      n.classList.add('ov');
    }
  }
  function setNames(t, a) { $('.lp-t').textContent = t || ''; $('.lp-a').textContent = a || ''; fitNames(); }
  window.addEventListener('resize', fitNames);
  function setProg(pos, dur) {
    if (!el) return;
    var r = dur > 0 ? Math.min(1, Math.max(0, pos / dur)) : 0;
    $('.lp-fill').style.width = (r * 100) + '%';
    $('.lp-bar').setAttribute('aria-valuenow', Math.round(r * 100));
    $('.lp-cur').textContent = fmt(pos);
    $('.lp-dur').textContent = dur > 0 ? fmt(dur) : '0:00';
  }
  function pad() { document.body.style.paddingBottom = el && el.classList.contains('on') ? (el.offsetHeight + 28) + 'px' : ''; }

  function mk() {
    if (el) return;
    el = document.createElement('div');
    el.id = 'lcmp';
    if (PU) el.className = 'pu';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Lecteur');
    el.innerHTML =
      '<div class="lp-r">' +
      '<div class="lp-c"><button class="lp-b" type="button" data-a="prev" aria-label="Titre précédent">' + svg(IC.prev) + '</button>' +
      '<button class="lp-b pp" type="button" data-a="toggle" aria-label="Lecture">' + svg(IC.play) + '</button>' +
      '<button class="lp-b" type="button" data-a="next" aria-label="Titre suivant">' + svg(IC.next) + '</button></div>' +
      '<div class="lp-m"><div class="lp-n"><div class="lp-w"><span class="lp-t"></span><span class="lp-a"></span></div></div>' +
      '<div class="lp-p"><span class="lp-cur">0:00</span><div class="lp-bar" role="slider" tabindex="0" aria-label="Position dans le titre" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="lp-fill"></i></div><span class="lp-dur">0:00</span></div></div>' +
      '<div class="lp-v"><button class="lp-b lp-mu" type="button" data-a="mute" aria-label="Couper le son">' + svg(IC.vol) + '</button><input class="lp-vol" type="range" min="0" max="100" step="1" aria-label="Volume"></div>' +
      '<button class="lp-b lp-x" type="button" data-a="close" aria-label="Fermer le lecteur">' + svg(IC.close) + '</button></div>' +
      '<div class="lp-f"></div>';
    document.body.appendChild(el);
    if (window.ResizeObserver) new ResizeObserver(pad).observe(el);
    var vr = $('.lp-vol');
    vr.addEventListener('input', function () { vol = vr.value / 100; muted = false; try { localStorage.setItem('lcm-vol', vol); } catch (x) {} applyVol(); });
    applyVol();
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]');
      if (b) act(b.dataset.a);
    });
    var bar = $('.lp-bar'), drag = false;
    function seekAt(x) {
      var r = bar.getBoundingClientRect();
      seek(Math.min(1, Math.max(0, (x - r.left) / r.width)));
    }
    bar.addEventListener('pointerdown', function (e) { drag = true; try { bar.setPointerCapture(e.pointerId); } catch (x) {} seekAt(e.clientX); });
    bar.addEventListener('pointermove', function (e) { if (drag) seekAt(e.clientX); });
    bar.addEventListener('pointerup', function () { drag = false; });
    bar.addEventListener('pointercancel', function () { drag = false; });
    bar.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 5 : e.key === 'ArrowLeft' ? -5 : 0;
      if (!d) return;
      e.preventDefault();
      if (mode === 'au' && au.a) seekTo(au.a.currentTime + d, au.a.duration);
      else if (mode === 'sc') seekTo(sc.pos / 1000 + d, sc.dur / 1000);
      else if (mode === 'sp') seekTo(sp.pos / 1000 + d, sp.dur / 1000);
    });
  }
  function seekTo(s, dur) { if (dur > 0) seek(Math.min(1, Math.max(0, s / dur))); }
  function seek(r) {
    if (mode === 'au' && au.a && au.a.duration) { au.a.currentTime = r * au.a.duration; setProg(au.a.currentTime, au.a.duration); }
    else if (mode === 'sp' && spc && sp.dur) { sp.pos = r * sp.dur; spc.seek(sp.pos / 1000); setProg(sp.pos / 1000, sp.dur / 1000); }
    else if (mode === 'sc' && wg && sc.dur) { sc.pos = r * sc.dur; wg.seekTo(sc.pos); setProg(sc.pos / 1000, sc.dur / 1000); }
  }

  var vol = 1, muted = false;
  try { var sv = parseFloat(localStorage.getItem('lcm-vol')); if (sv >= 0 && sv <= 1) vol = sv; } catch (e) {}
  function applyVol() {
    var v = muted ? 0 : vol;
    if (el) {
      var r = $('.lp-vol'), m = $('.lp-mu');
      r.value = Math.round(v * 100); r.style.setProperty('--vp', Math.round(v * 100) + '%');
      m.innerHTML = svg(v === 0 ? IC.mute : IC.vol);
      m.setAttribute('aria-label', v === 0 ? 'Rétablir le son' : 'Couper le son');
      var nv = mode === 'sp' || mode === 'am';
      el.classList.toggle('nv', nv);
      r.title = nv ? 'Volume géré par le lecteur Spotify / Apple (non réglable ici)' : '';
    }
    if (au.a) au.a.volume = v;
    if (wg) { try { wg.setVolume(Math.round(v * 100)); } catch (e) {} }
  }
  function act(a) {
    if (a === 'close') return close();
    if (a === 'mute') { muted = !muted; if (!muted && vol === 0) vol = .5; applyVol(); return; }
    if (mode === 'au' && au.a) {
      if (a === 'toggle') { if (au.a.paused) au.a.play(); else au.a.pause(); }
      else auStep(a === 'next' ? 1 : -1);
      return;
    }
    if (mode === 'sp' && spc) {
      if (a === 'toggle') { sp.want = sp.paused; spc.togglePlay(); }
      else if (a === 'next') spStep(1);
      else spStep(-1);
      return;
    }
    if (mode === 'sc' && wg) {
      if (a === 'toggle') wg.toggle(); else wg[a]();
    }
  }

  function stopAll() {
    if (wg) { try { wg.pause(); } catch (e) {} }
    auStop();
    spStop();
    wg = null; mode = ''; key = '';
    if (el) $('.lp-f').textContent = '';
  }
  function show(bc) {
    el.classList.toggle('bc', !!bc);
    el.classList.add('on');
    applyVol();
    pad();
  }
  function close() {
    if (!el) return;
    stopAll();
    el.classList.remove('on');
    setNames('', '');
    setProg(0, 0);
    setPP(false);
    pad();
  }
  function pause() {
    if (mode === 'au' && au.a) { au.a.pause(); return; }
    if (mode === 'sp' && spc) { sp.want = false; try { spc.pause(); } catch (e) {} return; }
    if (mode === 'sc' && wg) wg.pause();
  }

  /* Apple Musique : lecteur integre sous la barre (ecoute complete pour les abonnes, extraits sinon) */
  var cache = {};
  function lookup(id) {
    if (!cache[id]) {
      cache[id] = fetch('https://itunes.apple.com/lookup?id=' + id + '&entity=song&country=fr').then(function (r) { return r.json(); }).then(function (j) {
        return j.results.filter(function (x) { return x.wrapperType === 'track'; }).sort(function (a, b) {
          return (a.discNumber - b.discNumber) || (a.trackNumber - b.trackNumber);
        });
      });
    }
    return cache[id];
  }
  function playAP(o, c) {
    var idx = o.index || 0;
    if (c.tracks) { if (c.tracks[idx] == null) return; idx = c.tracks[idx]; }
    var k = 'am' + c.apple + ':' + idx;
    if (key === k && mode === 'am') { show(true); return; }
    stopAll();
    mode = 'am'; key = k;
    setNames(o.title, o.artist || 'Cul-Pointu');
    show(true);
    lookup(c.apple).catch(function () { return []; }).then(function (list) {
      if (key !== k) return;
      var t = list[idx];
      var fr = document.createElement('iframe');
      fr.height = 175;
      fr.allow = 'autoplay *; encrypted-media *; fullscreen *';
      fr.title = 'Lecture : ' + (o.title || '');
      fr.src = 'https://embed.music.apple.com/fr/album/' + c.apple + (t ? '?i=' + t.trackId + '&' : '?') + 'theme=dark';
      $('.lp-f').appendChild(fr);
      var yq = encodeURIComponent((t ? t.artistName + ' ' + t.trackName : (o.artist || 'Cul-Pointu') + ' ' + (o.title || '')).trim());
      var ym = document.createElement('a');
      ym.className = 'lp-yt';
      ym.target = '_blank'; ym.rel = 'noopener';
      ym.href = 'https://music.youtube.com/search?q=' + yq;
      ym.textContent = 'Ne joue pas ? Écouter sur YouTube Musique ↗';
      $('.lp-f').appendChild(ym);
      if (t) setNames(t.trackName, t.artistName);
      pad();
    });
  }

  /* Spotify : lecteur invisible, commandé par la barre */
  var spApi = null, spQ = [], spState = 0, spc = null, spTok = 0;
  var sp = { c: null, idx: 0, names: [], pos: 0, dur: 0, played: false, fin: false, host: null, timer: 0 };
  function withSpotify(cb, fail) {
    if (spApi) return cb(spApi);
    if (spState === 2) return fail();
    spQ.push([cb, fail]);
    if (spState) return;
    spState = 1;
    window.onSpotifyIframeApiReady = function (api) { spApi = api; spState = 2; spQ.splice(0).forEach(function (f) { f[0](api); }); };
    var s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    s.onerror = function () { spState = 3; spQ.splice(0).forEach(function (f) { f[1](); }); };
    document.head.appendChild(s);
  }
  function spStop() {
    spTok++;
    clearTimeout(sp.timer);
    if (spc) { try { spc.pause(); spc.destroy(); } catch (e) {} }
    if (sp.host && sp.host.parentNode) sp.host.parentNode.removeChild(sp.host);
    spc = null; sp.host = null;
  }
  function spLoad(i) {
    sp.idx = i; sp.pos = 0; sp.dur = 0; sp.fin = false;
    key = 'sp' + sp.c.sp[0] + ':' + i;
    setProg(0, 0);
    var n = sp.names[i];
    if (n) setNames(n.trackName, n.artistName);
    spc.loadUri('spotify:track:' + sp.c.sp[i]);
    setTimeout(function () { if (spc) spc.play(); }, 450);
  }
  function spStep(d) {
    if (d < 0 && sp.pos > 3000) { spc.seek(0); return; }
    var n = sp.idx + d;
    if (n < 0 || n >= sp.c.sp.length) return;
    spLoad(n);
  }
  function playSP(o, c) {
    var idx = o.index || 0;
    if (c.tracks) { if (c.tracks[idx] == null) return true; idx = c.tracks[idx]; }
    if (!c.sp[idx]) return false;
    if (mode === 'sp' && sp.c === c && spc) {
      show(false);
      if (idx === sp.idx) spc.togglePlay(); else spLoad(idx);
      return true;
    }
    stopAll();
    mode = 'sp'; key = 'sp' + c.sp[0] + ':' + idx;
    sp = { c: c, idx: idx, names: [], pos: 0, dur: 0, played: false, fin: false, host: null, timer: 0 };
    var tok = ++spTok;
    setNames(o.title, o.artist || 'Cul-Pointu');
    setProg(0, 0); setPP(true);
    show(false);
    lookup(c.apple).catch(function () { return []; }).then(function (list) {
      if (tok !== spTok) return;
      sp.names = list;
      var n = list[sp.idx];
      if (n) setNames(n.trackName, n.artistName);
    });
    var host = sp.host = document.createElement('div');
    host.className = 'lcm-sph';
    var inner = document.createElement('div');
    host.appendChild(inner);
    document.body.appendChild(host);
    sp.want = true; sp.paused = false; sp.res = 0;
    withSpotify(function (api) {
      if (tok !== spTok) return;
      api.createController(inner, { uri: 'spotify:track:' + c.sp[idx], width: '100%', height: 80 }, function (ctl) {
        if (tok !== spTok) { try { ctl.destroy(); } catch (e) {} return; }
        spc = ctl;
        ctl.addListener('ready', function () { if (tok === spTok) ctl.play(); });
        ctl.addListener('playback_update', function (e) {
          var d = e && e.data;
          if (!d || tok !== spTok) return;
          var was = sp.paused === false, near = sp.dur > 0 && sp.pos >= sp.dur - 1500;
          sp.pos = d.position || 0; sp.dur = d.duration || 0;
          setPP(!d.isPaused);
          sp.paused = !!d.isPaused;
          if (d.isPaused && was && !near && sp.want && document.hidden && Date.now() - sp.res > 4000) { sp.res = Date.now(); try { ctl.resume(); } catch (x) {} }
          if (!d.isPaused) { sp.played = true; sp.want = true; if (host.classList.contains('vis')) { host.classList.remove('vis'); sp.hide = 1; } pad(); }
          setProg(sp.pos / 1000, sp.dur / 1000);
          if (d.isPaused && sp.played && sp.dur > 0 && sp.pos >= sp.dur - 400 && !sp.fin) { sp.fin = true; setTimeout(function () { if (tok === spTok) spStep(1); }, 300); }
        });
        /* si le navigateur bloque la lecture automatique, le lecteur Spotify apparait pour un clic */
        sp.timer = setTimeout(function () { if (tok === spTok && !sp.played) { el.appendChild(host); host.classList.add('vis'); setPP(false); pad(); } }, 6000);
      });
    }, function () {
      if (tok !== spTok) return;
      stopAll();
      if (c.apple) playAP(o, c);
    });
    return true;
  }

  /* Fichiers retrouves, heberges sur le site : meme barre, aucun lecteur visible */
  var au = { a: null, list: [], i: 0, o: null };
  function auStop() {
    if (au.a) { au.a.onended = au.a.ontimeupdate = au.a.onplay = au.a.onpause = au.a.onloadedmetadata = au.a.onerror = null; au.a.pause(); au.a.removeAttribute('src'); au.a.load(); }
    au.a = null;
  }
  function auLoad(i) {
    var n = au.list[i];
    if (!n) return;
    au.i = i;
    key = 'au' + n.src;
    setNames(n.title, au.o.artist || 'Cul-Pointu');
    setProg(0, 0);
    au.a.src = n.src;
    var p = au.a.play();
    if (p && p.catch) p.catch(function () { setPP(false); });
  }
  function auStep(d) {
    if (d < 0 && au.a.currentTime > 3) { au.a.currentTime = 0; return; }
    var n = au.i + d;
    if (n >= 0 && n < au.list.length) auLoad(n);
  }
  function playAU(o) {
    var list = o.list && o.list.length ? o.list : [{ src: o.src, title: o.title }];
    var i = Math.max(0, list.findIndex(function (x) { return x.src === o.src; }));
    if (mode === 'au' && au.a && key === 'au' + o.src) {
      show(false);
      if (au.a.paused) au.a.play(); else au.a.pause();
      return;
    }
    stopAll();
    mode = 'au';
    var a = new Audio();
    a.preload = 'auto';
    au = { a: a, list: list, i: i, o: o };
    applyVol();
    a.onplay = function () { setPP(true); };
    a.onpause = function () { setPP(false); };
    a.ontimeupdate = function () { setProg(a.currentTime, a.duration || 0); };
    a.onloadedmetadata = function () { setProg(a.currentTime, a.duration || 0); };
    a.onerror = function () { setPP(false); setNames(au.list[au.i].title, 'Fichier indisponible'); };
    a.onended = function () { if (au.i < au.list.length - 1) auLoad(au.i + 1); else setPP(false); };
    setPP(true);
    show(false);
    auLoad(i);
  }

  /* SoundCloud : album complet, commandé par la barre */
  function withApi(cb) {
    if (window.SC && window.SC.Widget) return cb();
    apiQ.push(cb);
    if (apiState) return;
    apiState = 1;
    var s = document.createElement('script');
    s.src = 'https://w.soundcloud.com/player/api.js';
    s.onload = function () { apiQ.splice(0).forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }
  function scInfo(artist) {
    if (!wg) return;
    wg.getCurrentSound(function (s) {
      if (!s || !wg) return;
      sc.dur = s.duration || sc.dur;
      setNames(s.title, artist);
      setProg(sc.pos / 1000, sc.dur / 1000);
    });
  }
  function playSC(o) {
    var k = 'sc' + o.sc;
    if (mode === 'sc' && key === k && wg) {
      show(false);
      if (o.index != null && o.index !== sc.i) { sc.i = o.index; wg.skip(o.index); wg.play(); } else wg.toggle();
      return;
    }
    stopAll();
    mode = 'sc'; key = k;
    sc = { url: o.sc, i: o.index || 0, dur: 0, pos: 0 };
    var artist = o.artist || 'Cul-Pointu';
    setNames(o.title, artist);
    setProg(0, 0); setPP(true);
    show(false);
    var fr = document.createElement('iframe');
    fr.className = 'hid';
    fr.allow = 'autoplay';
    fr.title = 'Lecture : ' + (o.title || '');
    fr.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(o.sc) + '&auto_play=true' + (sc.i ? '&start_track=' + sc.i : '') + '&show_teaser=false&visual=false';
    $('.lp-f').appendChild(fr);
    withApi(function () {
      if (mode !== 'sc' || key !== k) return;
      var w = wg = SC.Widget(fr), E = SC.Widget.Events;
      w.bind(E.READY, function () {
        applyVol();
        scInfo(artist);
        setTimeout(function () { if (wg === w) w.isPaused(function (p) { if (p) w.play(); }); }, 1200);
      });
      w.bind(E.PLAY, function () { setPP(true); scInfo(artist); applyVol(); });
      w.bind(E.PAUSE, function () { setPP(false); });
      w.bind(E.FINISH, function () { setPP(false); });
      w.bind(E.PLAY_PROGRESS, function (e) {
        sc.pos = e.currentPosition;
        if (!sc.dur && e.relativePosition) sc.dur = sc.pos / e.relativePosition;
        setProg(sc.pos / 1000, sc.dur / 1000);
      });
    });
  }

  function play(o) {
    mk();
    if (o.src) return playAU(o);
    if (o.sc) return playSC(o);
    var c = CAT[o.section];
    if (!c) return;
    if (c.sp && playSP(o, c) !== false) return;
    if (c.apple) return playAP(o, c);
  }

  document.addEventListener('visibilitychange', function () {
    if (mode === 'sp' && spc && sp.want && sp.paused && sp.played && !(sp.dur > 0 && sp.pos >= sp.dur - 1500)) { try { spc.resume(); } catch (e) {} }
  });
  if ('mediaSession' in navigator) {
    var ms = function (n, f) { try { navigator.mediaSession.setActionHandler(n, f); } catch (e) {} };
    ms('play', function () { if (el && mode) act('toggle'); });
    ms('pause', function () { if (el && mode) pause(); });
    ms('nexttrack', function () { if (el && mode) act('next'); });
    ms('previoustrack', function () { if (el && mode) act('prev'); });
  }

  window.LCMPlayer = { play: play, close: close, pause: pause };
})();
