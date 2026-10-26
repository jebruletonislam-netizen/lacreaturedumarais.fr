(function(){
  var s=document.getElementById('slime');
  if(s){
    var go=function(rev){s.className='slime go'+(rev?' rev':'');};
    s.addEventListener('animationend',function(){s.className='slime';});
    var t=document.getElementById('trap'),u=document.getElementById('up');
    if(t)t.addEventListener('click',function(){go(false);});
    if(u)u.addEventListener('click',function(ev){ev.preventDefault();go(true);});
  }
  Array.prototype.forEach.call(document.querySelectorAll('.play'),function(b){
    b.addEventListener('click',function(){
      var c=b.closest('.card'),f=c.querySelector('iframe');
      if(f){f.remove();c.classList.remove('open');b.textContent='▶ ÉCOUTER';return;}
      f=document.createElement('iframe');
      f.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(b.dataset.sc)+'&color=%2339ff6e&auto_play=true&show_teaser=false';
      f.height=b.dataset.h;f.allow='autoplay';f.title='Lecteur SoundCloud';
      c.appendChild(f);c.classList.add('open');b.textContent='■ FERMER';
    });
  });
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('[data-lb]');
    if(!a||!window.openLB)return;
    ev.preventDefault();
    window.openLB([{src:a.getAttribute('href'),alt:a.dataset.lb}],0);
  });
  var eph=document.getElementById('eph');
  if(eph){
    var tog=function(){var on=eph.classList.toggle('on');eph.setAttribute('aria-pressed',on);};
    eph.addEventListener('pointerdown',function(ev){if(ev.pointerType!=='mouse')tog();});
    eph.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();tog();}});
  }
})();
