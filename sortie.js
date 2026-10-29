/* Sortie de Misérables et de son clip : 31 octobre 2026, 19 h 15 (heure de Paris).
   Avant : annonce et compte à rebours textuel. Après : clip, nouvelles, discographie et accueil changent d'eux-mêmes. */
(function () {
  var T = Date.parse('2026-10-31T19:15:00+01:00'), h = document.documentElement;
  function on() { return Date.now() >= T; }
  var st = document.createElement('style');
  st.textContent = 'html:not(.released) .rel-a,html.released .rel-b{display:none!important}' +
    '.vsoon{display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;border:.25rem solid #000;text-align:center;padding:1rem;color:#fff;font:400 clamp(1.6rem,4.5vw,3.6rem)/1.05 "Bebas Neue",Impact,sans-serif;letter-spacing:.04em;background:linear-gradient(rgba(0,0,0,.74),rgba(0,0,0,.74)),url(/images/pochette-miserables.jpg) center/cover}';
  (document.head || h).appendChild(st);
  window.LCM_UNLOCK = function () {
    [].forEach.call(document.querySelectorAll('iframe[data-rsrc]'), function (f) {
      f.setAttribute('data-src', f.getAttribute('data-rsrc')); f.removeAttribute('data-rsrc');
    });
  };
  function set() { window.LCM_RELEASED = on(); h.classList.toggle('released', window.LCM_RELEASED); return window.LCM_RELEASED; }
  if (!set()) {
    var d = T - Date.now();
    if (d < 2147483647) setTimeout(function () { set(); window.LCM_UNLOCK(); window.dispatchEvent(new Event('hashchange')); }, d + 500);
  }
})();
