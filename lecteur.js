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
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'
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
    '#lcmp.on{transform:translate(-50%,0);opacity:1}',
    '#lcmp::before{content:"";position:absolute;left:1.4rem;right:1.4rem;top:-1px;height:1px;background:linear-gradient(90deg,transparent,var(--lc),transparent);filter:drop-shadow(0 0 3px var(--lc))}',
    '#lcmp .lp-r{display:flex;align-items:center;gap:.8rem;padding:.55rem .7rem .55rem .8rem}',
    '#lcmp .lp-c{display:flex;align-items:center;gap:.3rem;flex:none}',
    '#lcmp .lp-m{flex:1;min-width:0}',
    '#lcmp .lp-n{display:flex;align-items:baseline;gap:.55rem;min-width:0;line-height:1.1;white-space:nowrap}',
    '#lcmp .lp-t{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;font:400 1.2rem "Bebas Neue",sans-serif;letter-spacing:.06em;color:#fff}',
    '#lcmp .lp-t:empty,#lcmp .lp-a:empty{display:none}',
    '#lcmp .lp-t:not(:empty)+.lp-a:not(:empty)::before{content:"\\00b7";margin-right:.55rem;color:var(--lc)}',
    '#lcmp .lp-a{flex:0 100 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;font:400 .95rem "Bebas Neue",sans-serif;letter-spacing:.1em;color:rgba(255,255,255,.62)}',
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
    '#lcmp .lp-f iframe.hid{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}',
    '#lcmp>.sph{position:fixed;left:-420px;top:0;width:300px;height:80px;pointer-events:none}',
    '#lcmp>.sph.vis{position:static;width:auto;height:auto;padding:0 .8rem .6rem;pointer-events:auto}',
    '#lcmp>.sph iframe{display:block;width:100%;height:80px;border:0;border-radius:.7rem;color-scheme:dark}',
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
  function setNames(t, a) { $('.lp-t').textContent = t || ''; $('.lp-a').textContent = a || ''; }
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
      '<div class="lp-m"><div class="lp-n"><span class="lp-t"></span><span class="lp-a"></span></div>' +
      '<div class="lp-p"><span class="lp-cur">0:00</span><div class="lp-bar" role="slider" tabindex="0" aria-label="Position dans le titre" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="lp-fill"></i></div><span class="lp-dur">0:00</span></div></div>' +
      '<button class="lp-b lp-x" type="button" data-a="close" aria-label="Fermer le lecteur">' + svg(IC.close) + '</button></div>' +
      '<div class="lp-f"></div>';
    document.body.appendChild(el);
    if (window.ResizeObserver) new ResizeObserver(pad).observe(el);
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
      if (mode === 'sc') seekTo(sc.pos / 1000 + d, sc.dur / 1000);
      else if (mode === 'sp') seekTo(sp.pos / 1000 + d, sp.dur / 1000);
    });
  }
  function seekTo(s, dur) { if (dur > 0) seek(Math.min(1, Math.max(0, s / dur))); }
  function seek(r) {
    if (mode === 'sp' && spc && sp.dur) { sp.pos = r * sp.dur; spc.seek(sp.pos / 1000); setProg(sp.pos / 1000, sp.dur / 1000); }
    else if (mode === 'sc' && wg && sc.dur) { sc.pos = r * sc.dur; wg.seekTo(sc.pos); setProg(sc.pos / 1000, sc.dur / 1000); }
  }

  function act(a) {
    if (a === 'close') return close();
    if (mode === 'sp' && spc) {
      if (a === 'toggle') spc.togglePlay();
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
    spStop();
    wg = null; mode = ''; key = '';
    if (el) $('.lp-f').textContent = '';
  }
  function show(bc) {
    el.classList.toggle('bc', !!bc);
    el.classList.add('on');
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
    if (mode === 'sp' && spc) { try { spc.pause(); } catch (e) {} return; }
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
    host.className = 'sph';
    var inner = document.createElement('div');
    host.appendChild(inner);
    el.appendChild(host);
    withSpotify(function (api) {
      if (tok !== spTok) return;
      api.createController(inner, { uri: 'spotify:track:' + c.sp[idx], width: '100%', height: 80 }, function (ctl) {
        if (tok !== spTok) { try { ctl.destroy(); } catch (e) {} return; }
        spc = ctl;
        ctl.addListener('ready', function () { if (tok === spTok) ctl.play(); });
        ctl.addListener('playback_update', function (e) {
          var d = e && e.data;
          if (!d || tok !== spTok) return;
          sp.pos = d.position || 0; sp.dur = d.duration || 0;
          setPP(!d.isPaused);
          if (!d.isPaused) { sp.played = true; host.classList.remove('vis'); pad(); }
          setProg(sp.pos / 1000, sp.dur / 1000);
          if (d.isPaused && sp.played && sp.dur > 0 && sp.pos >= sp.dur - 400 && !sp.fin) { sp.fin = true; setTimeout(function () { if (tok === spTok) spStep(1); }, 300); }
        });
        /* si le navigateur bloque la lecture automatique, le lecteur Spotify apparait pour un clic */
        sp.timer = setTimeout(function () { if (tok === spTok && !sp.played) { host.classList.add('vis'); setPP(false); pad(); } }, 6000);
      });
    }, function () {
      if (tok !== spTok) return;
      stopAll();
      if (c.apple) playAP(o, c);
    });
    return true;
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
    fr.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(o.sc) + '&auto_play=' + (sc.i ? 'false' : 'true') + '&show_teaser=false&visual=false';
    $('.lp-f').appendChild(fr);
    withApi(function () {
      if (mode !== 'sc' || key !== k) return;
      var w = wg = SC.Widget(fr), E = SC.Widget.Events;
      w.bind(E.READY, function () {
        if (sc.i) { w.skip(sc.i); w.play(); }
        scInfo(artist);
      });
      w.bind(E.PLAY, function () { setPP(true); scInfo(artist); });
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
    if (o.sc) return playSC(o);
    var c = CAT[o.section];
    if (!c) return;
    if (c.sp && playSP(o, c) !== false) return;
    if (c.apple) return playAP(o, c);
  }

  window.LCMPlayer = { play: play, close: close, pause: pause };
})();
