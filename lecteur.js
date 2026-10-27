/* Lecteur du site (normal et mode putride) : une barre fine en bas de page. */
(function () {
  if (window.LCMPlayer) return;

  var PU = !!document.querySelector('link[href*="putride.css"]');
  var CAT = {
    'album-jubile': { apple: 1855845168 },
    'album-in-odium-fidei': { apple: 1855845168, tracks: [0, null] },
    'album-confiteor': { apple: 1842647218 },
    'album-chyren': { apple: 1835753265 },
    'album-omerta434': { apple: 1739538878 },
    'album-machines': { apple: 1842736843 }
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
    '#lcmp.pu{--lc:#39ff6e;--bg:rgba(8,0,18,.94)}',
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
    });
  }
  function seekTo(s, dur) { if (dur > 0) seek(Math.min(1, Math.max(0, s / dur))); }
  function seek(r) {
    if (mode === 'sc' && wg && sc.dur) { sc.pos = r * sc.dur; wg.seekTo(sc.pos); setProg(sc.pos / 1000, sc.dur / 1000); }
  }

  function act(a) {
    if (a === 'close') return close();
    if (mode === 'sc' && wg) {
      if (a === 'toggle') wg.toggle(); else wg[a]();
    }
  }

  function stopAll() {
    if (wg) { try { wg.pause(); } catch (e) {} }
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
    if (c.apple) return playAP(o, c);
  }

  window.LCMPlayer = { play: play, close: close, pause: pause };
})();
