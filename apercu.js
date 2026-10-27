/* Fiche d'aperçu au survol des liens (site normal, mode putride, pages SEO). */
(function () {
  if (window.__apercu) return;
  window.__apercu = 1;

  var fine = matchMedia('(hover:hover) and (pointer:fine)');
  var PUT = !!document.querySelector('link[href$="putride.css"]');
  var ACC = PUT ? (getComputedStyle(document.documentElement).getPropertyValue('--g').trim() || '#39ff6a') : '#ff0000';
  var GLOW = PUT ? 'rgba(57,255,106,.35)' : 'rgba(255,0,0,.4)';
  var PROD = 'https://lacreaturedumarais.fr';

  var st = document.createElement('style');
  st.textContent =
    '.ap{position:fixed;left:0;top:0;z-index:99990;width:330px;max-width:calc(100vw - 24px);background:#000;color:#fff;border:2px solid ' + ACC + ';box-shadow:0 10px 30px rgba(0,0,0,.8),0 0 16px ' + GLOW + ';text-shadow:0 1px 2px #000;pointer-events:none;opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .16s,transform .16s,visibility 0s .16s;text-align:left;font-size:14px;line-height:1.35;letter-spacing:0;text-transform:none}' +
    '.ap.on{opacity:1;visibility:visible;transform:none;transition:opacity .16s,transform .16s}' +
    '.ap-i{display:block;width:100%;height:auto;max-height:170px;object-fit:contain;background:#000;border-bottom:2px solid ' + ACC + '}' +
    '.ap-b{padding:10px 12px 11px}' +
    '.ap-k,.ap-t,.ap-f{font-family:"Bebas Neue",Impact,sans-serif;font-weight:400}' +
    '.ap-k{font-size:13px;line-height:1;letter-spacing:.14em;color:' + ACC + '}' +
    '.ap-t{margin:5px 0 0;font-size:24px;line-height:1.05;text-transform:uppercase;overflow-wrap:anywhere}' +
    '.ap-p{margin:6px 0 0;font-size:14px;line-height:1.35;color:#e8e8e8}' +
    '.ap-f{margin-top:9px;font-size:13px;line-height:1;letter-spacing:.12em;opacity:.65;overflow-wrap:anywhere}' +
    '@media (prefers-reduced-motion:reduce){.ap,.ap.on{transition:none;transform:none}}';
  document.head.appendChild(st);

  var card = document.createElement('div');
  card.className = 'ap';
  card.id = 'apercu';
  card.setAttribute('role', 'tooltip');
  document.body.appendChild(card);

  var PF = [
    ['spotify.com', 'Spotify'], ['youtube.com', 'YouTube'], ['youtu.be', 'YouTube'], ['deezer.com', 'Deezer'],
    ['apple.com', 'Apple Musique'], ['instagram.com', 'Instagram'], ['x.com', 'X'], ['twitter.com', 'X'],
    ['tiktok.com', 'TikTok'], ['soundcloud.com', 'SoundCloud'], ['genius.com', 'Genius'], ['wikipedia.org', 'Wikipédia'],
    ['facebook.com', 'Facebook'], ['bandcamp.com', 'Bandcamp']
  ];
  var KINDS = { artist: 'Artiste', album: 'Album', track: 'Titre', playlist: 'Playlist', video: 'Vidéo' };

  var cache = new Map(), cur = null, pend = null, tShow = 0, tHide = 0, stripped = null;

  function txt(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function cut(s, n) {
    if (s.length <= n) return s;
    s = s.slice(0, n);
    return s.slice(0, Math.max(s.lastIndexOf(' '), n * 0.6)).replace(/[\s,;:.]+$/, '') + '…';
  }
  function norm(p) { return p.replace(/index\.html$/, ''); }
  function sameDoc(u) { return u.origin === location.origin && norm(u.pathname) === norm(location.pathname) && u.search === location.search; }
  function hostOf(h, d) { return h === d || h.slice(-d.length - 1) === '.' + d; }

  function eligible(a) {
    if (!a || a.closest('.ap') || a.hasAttribute('data-noapercu') || a.hasAttribute('download')) return null;
    var h = a.getAttribute('href');
    if (!h || h === '#' || /^(mailto:|tel:|javascript:|sms:)/i.test(h)) return null;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return null; }
    if (!/^https?:$/.test(u.protocol)) return null;
    if (/\.(jpe?g|png|webp|gif|svg|avif|mp3|wav|pdf|zip)$/i.test(u.pathname)) return null;
    return u;
  }

  function external(u) {
    var host = u.hostname.replace(/^www\./, ''), label = '', i;
    for (i = 0; i < PF.length; i++) if (hostOf(host, PF[i][0])) { label = PF[i][1]; break; }
    var parts = u.pathname.split('/').filter(Boolean), sub = '', img = '';
    if (label === 'Spotify') {
      var k = parts[0] && /^intl-/.test(parts[0]) ? parts[1] : parts[0];
      sub = KINDS[k] || '';
    } else if (label === 'Apple Musique') {
      var j = parts.indexOf('artist'); if (j > -1) sub = 'Artiste'; else if (parts.indexOf('album') > -1) sub = 'Album';
    } else if (label === 'Deezer') {
      var d = parts.filter(function (x) { return KINDS[x]; })[0]; sub = KINDS[d] || '';
    } else if (label === 'YouTube') {
      var id = host === 'youtu.be' ? parts[0] : (parts[0] === 'watch' ? u.searchParams.get('v') : (parts[0] === 'embed' || parts[0] === 'shorts' ? parts[1] : ''));
      if (id && /^[\w-]{6,15}$/.test(id)) { img = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'; sub = 'Vidéo'; }
      else if (parts[0] && parts[0].charAt(0) === '@') sub = decodeURIComponent(parts[0]);
    } else if (label === 'Instagram' || label === 'X' || label === 'TikTok') {
      if (parts[0]) sub = decodeURIComponent(parts[0]);
      if (sub && sub.charAt(0) !== '@') sub = '@' + sub;
    } else if (label === 'Wikipédia') {
      var w = parts[parts.length - 1]; if (w) { try { sub = decodeURIComponent(w).replace(/_/g, ' '); } catch (e) { sub = w.replace(/_/g, ' '); } }
    }
    var wiki = label === 'Wikipédia' && sub;
    var text = wiki ? 'Article encyclopédique : de quoi situer le lieu ou le sujet.' :
      label ? 'Ouvre ' + label + ' hors du site.' : 'Lien vers un autre site.';
    return Promise.resolve({
      kind: (wiki ? label : (label ? (sub ? label + ' · ' + sub : label) : 'Lien externe')).toUpperCase() + ' ↗',
      title: wiki ? sub : (label || host),
      text: img ? '' : text,
      img: img,
      foot: 'S’OUVRE DANS UN NOUVEL ONGLET · ' + host.toUpperCase()
    });
  }

  function firstP(root, skipHeadingSiblings) {
    var list = [], n, i;
    if (skipHeadingSiblings) {
      n = root.nextElementSibling;
      for (i = 0; n && i < 5; i++, n = n.nextElementSibling) {
        if (/^H[1-3]$/.test(n.tagName)) break;
        list = list.concat(n.tagName === 'P' ? [n] : [].slice.call(n.querySelectorAll('p')));
      }
    } else list = [].slice.call(root.querySelectorAll('p'));
    for (i = 0; i < list.length; i++) { var t = txt(list[i]); if (t.length >= 40) return t; }
    return '';
  }
  function pickImg(root, base) {
    var imgs = root.querySelectorAll('img'), i, s;
    for (i = 0; i < imgs.length; i++) {
      if (/\b(aur|bl|ico)\b/.test(imgs[i].className)) continue;
      s = imgs[i].getAttribute('src') || imgs[i].getAttribute('data-src') || '';
      if (!s || /^data:/.test(s)) continue;
      try { return new URL(s, base).href; } catch (e) { }
    }
    return '';
  }

  function extract(d, u, base) {
    var id = '', el = null;
    if (u.hash.length > 1) { try { id = decodeURIComponent(u.hash.slice(1)); } catch (e) { id = u.hash.slice(1); } el = d.getElementById(id); }
    var title, text, img, kind, main = d.querySelector('main') || d.body;
    if (el) {
      var isH = /^H[1-6]$/.test(el.tagName);
      title = el.getAttribute('data-title') || (isH ? txt(el) : txt(el.querySelector('h1,h2,h3')));
      text = firstP(el, isH);
      img = pickImg(isH ? (el.parentNode || el) : el, base);
      kind = 'APERÇU · ' + (el.classList && el.classList.contains('pg') ? 'SECTION' : 'PASSAGE');
    }
    if (!title || !text) {
      var ptitle = txt(main.querySelector('h1')) || txt(d.querySelector('title')).split(' | ')[0];
      if (!el) title = ptitle; else if (!title) title = ptitle;
      if (!text && !el) {
        var md = d.querySelector('meta[name="description"]');
        text = (!el && md && md.content) ? md.content.trim() : firstP(main, false);
      }
    }
    if (!img) {
      var og = d.querySelector('meta[property="og:image"]');
      var s = og && og.content ? og.content.replace(PROD, location.origin) : '';
      img = s || pickImg(main, base);
    }
    return { kind: kind || 'APERÇU · PAGE', title: title || '', text: cut(text || '', 190), img: img, foot: 'CLIQUER POUR Y ALLER' };
  }

  function internal(u) {
    var base = u.origin + u.pathname + u.search;
    if (sameDoc(u)) return Promise.resolve(extract(document, u, location.href));
    var p = cache.get(base);
    if (!p) {
      p = fetch(base, { credentials: 'same-origin' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function (t) { return new DOMParser().parseFromString(t, 'text/html'); });
      p.catch(function () { cache.delete(base); });
      cache.set(base, p);
    }
    return p.then(function (d) { return extract(d, u, base); });
  }

  function data(u) { return u.origin === location.origin ? internal(u) : external(u); }

  function render(m) {
    card.textContent = '';
    if (m.img) {
      var im = document.createElement('img');
      im.className = 'ap-i'; im.alt = ''; im.decoding = 'async';
      im.onerror = function () { im.remove(); place(); };
      im.onload = place;
      im.src = m.img;
      card.appendChild(im);
    }
    var b = document.createElement('div'); b.className = 'ap-b';
    function add(c, t, tag) { if (!t) return; var e = document.createElement(tag || 'div'); e.className = c; e.textContent = t; b.appendChild(e); }
    add('ap-k', m.kind);
    add('ap-t', m.title);
    add('ap-p', m.text);
    add('ap-f', m.foot);
    card.appendChild(b);
  }

  function place() {
    if (!cur) return;
    var r = cur.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight, M = 12;
    var x = Math.min(Math.max(M, r.left), Math.max(M, innerWidth - w - M));
    var below = r.bottom + 10, y = below;
    if (below + h > innerHeight - M && r.top - 10 - h >= M) y = r.top - 10 - h;
    y = Math.max(M, Math.min(y, innerHeight - h - M));
    card.style.left = x + 'px';
    card.style.top = y + 'px';
  }

  function unstrip() { if (stripped) { stripped.a.setAttribute('title', stripped.t); stripped = null; } }
  function strip(a) {
    if (a.hasAttribute('title') && !(stripped && stripped.a === a)) { unstrip(); stripped = { a: a, t: a.getAttribute('title') }; a.removeAttribute('title'); }
  }

  function close() {
    clearTimeout(tShow); clearTimeout(tHide);
    pend = null;
    card.classList.remove('on');
    if (cur) { cur.removeAttribute('aria-describedby'); cur = null; }
    unstrip();
  }

  function open(a, u) {
    data(u).then(function (m) {
      if (pend !== a || !m || (!m.title && !m.text)) return;
      render(m);
      cur = a;
      a.setAttribute('aria-describedby', 'apercu');
      place();
      card.classList.add('on');
    }).catch(function () { });
  }

  function arm(a, delay) {
    var u = eligible(a);
    if (!u) return;
    strip(a);
    clearTimeout(tShow); clearTimeout(tHide);
    if (a === cur) return;
    pend = a;
    tShow = setTimeout(function () { open(a, u); }, cur ? 60 : delay);
  }
  function disarm(a) {
    if (pend === a) { clearTimeout(tShow); pend = null; }
    if (cur === a) { clearTimeout(tHide); tHide = setTimeout(close, 120); }
    else if (!cur) unstrip();
  }

  document.addEventListener('mouseover', function (e) {
    if (!fine.matches) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && !(e.relatedTarget && a.contains(e.relatedTarget))) arm(a, 380);
  });
  document.addEventListener('mouseout', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && !(e.relatedTarget && a.contains(e.relatedTarget))) disarm(a);
  });
  document.addEventListener('focusin', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a && a.matches(':focus-visible')) arm(a, 150);
  });
  document.addEventListener('focusout', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (a) disarm(a);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  document.addEventListener('pointerdown', close, true);
  document.addEventListener('scroll', function () { if (cur) place(); }, true);
  addEventListener('resize', close);
  addEventListener('pagehide', close);
  document.addEventListener('putride:page', close);
})();
