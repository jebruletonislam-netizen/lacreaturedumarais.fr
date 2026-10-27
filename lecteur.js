/* Lecteur du site : un petit dock en bas de page, qui charge le titre ouvert. */
(function () {
  if (window.LCMPlayer) return;

  var BC = 'https://bandcamp.com/EmbeddedPlayer/';
  var CAT = {
    'album-jubile': { bc: { track: 3122725257 }, tracks: [3122725257] },
    'album-in-odium-fidei': { bc: { track: 3122725257 }, tracks: [3122725257, null] },
    'album-confiteor': {
      bc: { album: 2622800798 },
      tracks: [529538052, 1953726612, 307222221, 1293959869, 3563231983, 1065734181, 1376355599, 3712871818, 236502483, 2978539117, 3947055957, 3015407476, 1467769340, 3534172063, 727326060, 552797033, 3727861423, 1195546728, 617627255, 1808643370, 2359246974, 3106310752, 3899465197, 3836476605, 3322594165, 2870407366, 176692474, 3789271194, 1289517984, 3181543043, 3629528581, 1994685982, 100489308, 2863169318]
    }
  };

  var st = document.createElement('style');
  st.textContent =
    '#lcmp{position:fixed;left:50%;bottom:.7rem;z-index:90;width:min(44rem,calc(100vw - 1.4rem));transform:translate(-50%,140%);opacity:0;transition:transform .45s cubic-bezier(.2,.9,.3,1),opacity .3s;color:#fff;background:linear-gradient(180deg,rgba(18,0,0,.96),rgba(0,0,0,.97));border:1px solid rgba(255,0,0,.75);border-radius:1.1rem;box-shadow:0 .6rem 1.8rem rgba(0,0,0,.85),0 0 1.1rem rgba(255,0,0,.28);overflow:hidden}' +
    '#lcmp.on{transform:translate(-50%,0);opacity:1}' +
    '#lcmp::before{content:"";position:absolute;left:1rem;right:1rem;top:.28rem;height:1px;background:linear-gradient(90deg,transparent,rgba(255,0,0,.9),transparent)}' +
    '#lcmp .lp-r{display:flex;align-items:center;gap:.8rem;padding:.7rem .8rem .55rem .7rem}' +
    '#lcmp .lp-a{flex:none;width:2.7rem;height:2.7rem;object-fit:contain;background:#000;border:1px solid rgba(255,0,0,.7);border-radius:.55rem}' +
    '#lcmp .lp-i{flex:1;min-width:0;line-height:1}' +
    '#lcmp .lp-k{display:block;font:400 .72rem "Bebas Neue",sans-serif;letter-spacing:.26em;color:#f00;opacity:.85}' +
    '#lcmp .lp-t{display:inline-block;max-width:100%;margin-top:.22rem;font:400 1.25rem "Bebas Neue",sans-serif;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-bottom:1px solid rgba(255,0,0,.75);padding-bottom:.12rem}' +
    '#lcmp .lp-b{all:unset;box-sizing:border-box;cursor:pointer;flex:none;width:1.9rem;height:1.9rem;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.28);border-radius:50%;color:#fff;transition:.2s}' +
    '#lcmp .lp-b svg{width:50%;height:50%;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}' +
    '#lcmp .lp-b:hover,#lcmp .lp-b:focus-visible{border-color:#fc0;color:#fc0}' +
    '#lcmp.big .lp-ch svg{transform:rotate(180deg)}' +
    '#lcmp .lp-f{padding:0 .8rem .7rem}' +
    '#lcmp iframe{display:block;width:100%;border:0;border-radius:.6rem;background:transparent}' +
    '@media (max-width:899px){#lcmp{bottom:.45rem;width:calc(100vw - .9rem);border-radius:.9rem}#lcmp .lp-t{font-size:1.1rem}}' +
    '@media (prefers-reduced-motion:reduce){#lcmp{transition:none}}';
  document.head.appendChild(st);

  var el = null, cur = '';

  function mk() {
    if (el) return;
    el = document.createElement('div');
    el.id = 'lcmp';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Lecteur');
    el.innerHTML =
      '<div class="lp-r"><img class="lp-a" alt="" width="44" height="44">' +
      '<div class="lp-i"><span class="lp-k">EN ÉCOUTE</span><span class="lp-t"></span></div>' +
      '<button class="lp-b lp-ch" type="button" aria-label="Agrandir ou réduire le lecteur" aria-expanded="true"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<button class="lp-b lp-x" type="button" aria-label="Fermer le lecteur"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="lp-f"></div>';
    document.body.appendChild(el);
    el.querySelector('.lp-x').addEventListener('click', close);
    el.querySelector('.lp-ch').addEventListener('click', function (e) {
      var f = el.querySelector('.lp-f'), open = f.hidden;
      f.hidden = !open;
      e.currentTarget.setAttribute('aria-expanded', open);
      el.classList.toggle('big', !open);
      pad();
    });
    if (window.ResizeObserver) new ResizeObserver(pad).observe(el);
  }
  function pad() { if (el) document.body.style.paddingBottom = el.classList.contains('on') ? (el.offsetHeight + 24) + 'px' : ''; }
  function close() {
    if (!el) return;
    el.classList.remove('on');
    cur = '';
    var f = el.querySelector('.lp-f');
    f.textContent = '';
    document.body.style.paddingBottom = '';
  }

  function src(o) {
    var c = CAT[o.section], i = o.index, id = c && c.tracks[i];
    if (c && c.bc && id) {
      var base = c.bc.album ? 'album=' + c.bc.album + '/' : '';
      return { u: BC + base + 'size=small/bgcol=000000/linkcol=ff3030/artwork=none/transparent=true/track=' + id + '/', h: 42 };
    }
    if (o.apple) return { u: 'https://embed.music.apple.com/fr/song/' + o.apple + '?theme=dark', h: 150 };
    return null;
  }

  function play(o) {
    var s = src(o);
    if (!s) return;
    mk();
    if (cur === s.u) { el.classList.add('on'); pad(); return; }
    cur = s.u;
    var f = el.querySelector('.lp-f');
    f.textContent = '';
    f.hidden = false;
    var fr = document.createElement('iframe');
    fr.height = s.h;
    fr.allow = 'autoplay *; encrypted-media *; clipboard-write';
    fr.title = 'Lecteur : ' + (o.title || '');
    fr.src = s.u;
    f.appendChild(fr);
    var a = el.querySelector('.lp-a');
    if (o.art) { a.src = o.art; a.hidden = false; } else a.hidden = true;
    el.querySelector('.lp-t').textContent = o.title || '';
    el.querySelector('.lp-ch').setAttribute('aria-expanded', 'true');
    el.classList.remove('big');
    el.classList.add('on');
    pad();
  }

  window.LCMPlayer = { play: play, close: close };
})();
