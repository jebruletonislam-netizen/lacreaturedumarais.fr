/* Mode Fengsel : les vidéos YouTube ne se chargent qu'au clic sur leur vignette. */
(function(){
  'use strict';
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('button.fv');
    if(!b)return;
    var w=document.createElement('div'),f=document.createElement('iframe');
    w.className='vfr';
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.getAttribute('data-yt'))+'?autoplay=1&rel=0'+(b.getAttribute('data-s')?'&start='+encodeURIComponent(b.getAttribute('data-s')):'');
    f.title=b.getAttribute('data-t')||'Vidéo';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen','');
    f.referrerPolicy='strict-origin-when-cross-origin';
    w.appendChild(f);
    b.replaceWith(w);
  });
})();
