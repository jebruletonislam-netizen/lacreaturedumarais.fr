/* écran d'entrée du mode putride : la bouche d'égout s'ouvre, le fluide monte, puis le glissement vers le mode putride (slime.js) */
(function () {
  var busy = false, ok = false;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  function overlay() {
    var o = document.createElement('div'); o.id = 'egin'; o.setAttribute('role', 'presentation');
    o.innerHTML = '<svg viewBox="0 0 160 130" aria-hidden="true" focusable="false">' +
      '<ellipse cx="80" cy="92" rx="58" ry="21" fill="#000" stroke="currentColor" stroke-width="3"/>' +
      '<ellipse cx="80" cy="92" rx="45" ry="15" fill="#000"/>' +
      '<g class="egin-f"><path d="M38 92C38 76 56 72 64 80C68 62 94 62 98 80C110 72 124 78 124 92A44 15 0 0 1 38 92Z" fill="rgba(127,209,58,.7)" stroke="#7fd13a" stroke-width="2.5"/></g>' +
      '<g class="egin-d"><path d="M52 104c-3 4-5 7-5 9.500a5 5 0 0 0 10 0c0-2.500-2-5.500-5-9.500z"/><path d="M80 108c-3 4-5 7-5 9.500a5 5 0 0 0 10 0c0-2.500-2-5.500-5-9.500z"/><path d="M108 104c-3 4-5 7-5 9.500a5 5 0 0 0 10 0c0-2.500-2-5.500-5-9.500z"/></g>' +
      '<g class="egin-lid"><ellipse cx="80" cy="92" rx="55" ry="19.500" fill="#000" stroke="currentColor" stroke-width="3"/><ellipse cx="80" cy="92" rx="40" ry="13" fill="none" stroke="currentColor" stroke-width="2.500"/>' +
      '<path d="M80 79v26M52 92h56M60 83l40 18M100 83l-40 18" stroke="currentColor" stroke-width="2" fill="none"/></g></svg>' +
      '<p>ENTRER DANS L’ÉGOUT</p><small>Respirez par la bouche.</small>';
    document.body.appendChild(o); return o;
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.egout');
    if (!a || ok || calm || ev.defaultPrevented || ev.button || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (busy) return; busy = true;
    var o = overlay(); requestAnimationFrame(function () { o.className = 'on'; });
    setTimeout(function () { ok = true; a.click(); setTimeout(function () { ok = false; busy = false; if (o.parentNode) o.parentNode.removeChild(o); }, 4500); }, 1700);
  }, true);
  addEventListener('pageshow', function (e) { if (e.persisted) { var o = document.getElementById('egin'); if (o) o.remove(); busy = false; ok = false; } });
})();
