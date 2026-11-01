(function () {
  var G = window.LCM_G || {};
  var UA = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  function facade(id, label) {
    var w = document.createElement('div'); w.className = 'vid';
    w.innerHTML = '<button class="yt" type="button" data-yt="' + id + '" data-title="' + label.replace(/"/g, '&quot;') + '" aria-label="Lire la vidéo : ' + label.replace(/"/g, '&quot;') + '">' +
      '<img alt="" loading="lazy" width="1280" height="720" src="https://img.youtube.com/vi/' + id + '/maxresdefault.jpg" onerror="this.onerror=null;this.src=\'https://img.youtube.com/vi/' + id + '/hqdefault.jpg\'">' +
      '<span class="yt-p" aria-hidden="true"></span></button>';
    return w;
  }

  function lyrics(g, t) {
    var f = document.createElement('iframe'); f.title = 'Paroles de ' + t; f.className = 'lyf'; f.setAttribute('loading', 'lazy');
    f.srcdoc = "<!doctype html><html><head><meta charset='utf-8'><base target='_blank'><style>html,body{margin:0;padding:0;background:#fff;color:#000;color-scheme:light}body{padding:.5rem;font:16px/1.4 Arial,sans-serif}</style></head><body><div id='rg_embed_link_" + g.id + "' class='rg_embed_link' data-song-id='" + g.id + "'><a href='" + g.url + "'>Paroles de “" + t.replace(/&/g, '&amp;') + "” — Cul-Pointu</a></div><script crossorigin src='https://genius.com/songs/" + g.id + "/embed.js'><\/script></body></html>";
    function fit() { try { var h = f.contentDocument.documentElement.scrollHeight; if (h > 40) f.style.height = h + 'px'; } catch (e) {} }
    f.addEventListener('load', function () {
      fit(); var n = 0, iv = setInterval(function () { fit(); if (++n > 40) clearInterval(iv); }, 500);
      try { if (window.ResizeObserver) new ResizeObserver(fit).observe(f.contentDocument.body); } catch (e) {}
    });
    return f;
  }

  function play(o) { try { if (window.LCMPlayer) LCMPlayer.play(o); } catch (e) {} }

  /* panneaux statiques des singles : paroles Genius injectées au chargement */
  [].forEach.call(document.querySelectorAll('.tp-static'), function (tp) {
    var g = G[tp.getAttribute('data-g')], r = tp.querySelector('.tp-r');
    if (g && r) r.appendChild(lyrics(g, tp.getAttribute('data-g')));
  });

  /* liste des titres */
  function open(d) {
    var tl = d.parentNode, sec = tl.getAttribute('data-sec'), t = d.getAttribute('data-t'), ly = d.querySelector('.ly');
    [].forEach.call(tl.querySelectorAll('details[open]'), function (o) { if (o !== d) o.open = false; });
    if (d.getAttribute('data-l')) return; d.setAttribute('data-l', '1');
    var g = G[t], yt = d.getAttribute('data-yt'), clipUrl = d.getAttribute('data-clip');
    var tp = document.createElement('div'); tp.className = 'tp';
    var r = document.createElement('div'); r.className = 'tp-r';
    if (g) r.appendChild(lyrics(g, t)); else { var p = document.createElement('p'); p.textContent = 'Paroles à venir'; r.appendChild(p); }
    var l = document.createElement('div'); l.className = 'tp-l';
    if (yt) {
      l.appendChild(facade(yt, t));
      if (clipUrl) { var a = document.createElement('a'); a.className = 'clip-gallery-link'; a.href = clipUrl; a.textContent = 'PAGE DU CLIP →'; l.appendChild(a); }
    }
    tp.appendChild(r); tp.appendChild(l); ly.appendChild(tp);
    play({ section: sec, index: +d.getAttribute('data-i'), apple: d.getAttribute('data-apple') || undefined, title: t, art: tl.getAttribute('data-art') });
  }
  document.addEventListener('toggle', function (ev) {
    var d = ev.target; if (!d.matches || !d.matches('.tl details')) return;
    var ly = d.querySelector('.ly');
    if (!d.open) { ly.textContent = ''; d.removeAttribute('data-l'); return; }
    open(d);
  }, true);

  document.addEventListener('click', function (ev) {
    var y = ev.target.closest && ev.target.closest('button.yt');
    if (y) {
      ev.preventDefault(); try { if (window.LCMPlayer) LCMPlayer.pause(); } catch (e) {}
      var f = document.createElement('iframe'); f.className = 'yt-live'; f.src = 'https://www.youtube.com/embed/' + y.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.allow = UA; f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.title = y.getAttribute('data-title') || 'Vidéo';
      y.parentNode.replaceChild(f, y); return;
    }
    var b = ev.target.closest && ev.target.closest('.play-track');
    if (b) play({ section: b.getAttribute('data-sec'), index: +(b.getAttribute('data-i') || 0), apple: b.getAttribute('data-apple') || undefined, title: b.getAttribute('data-t'), art: b.getAttribute('data-art') });
  });

  /* lien direct vers un titre : /discographie/confiteor/#titre-3 */
  var h = location.hash.match(/^#titre-(\d+)$/);
  if (h) { var d = document.getElementById('titre-' + h[1]); if (d) { d.open = true; setTimeout(function () { d.scrollIntoView({ block: 'center' }); }, 300); } }
})();
