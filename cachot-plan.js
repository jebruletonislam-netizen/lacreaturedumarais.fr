/* Navigation mobile des cachots : une barre « vous êtes ici » (mini-plan, lieu, flèches vers le lieu précédent et suivant, dans l'ordre de la procession)
   et une feuille qui monte du bas, en arc d'ogive, avec le plan complet du château. Un lieu touché, on y descend ; on referme d'un geste vers le bas,
   d'un appui sur le fond ou de la touche Échap. Sur ordinateur, le plan reste affiché à gauche : rien ne se passe ici. */
(function(){
  'use strict';
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)[].forEach.call(document.querySelectorAll('svg.plan'),function(v){try{v.pauseAnimations();}catch(_){}});
  /* ---------- les pas : ils s'effacent derrière le visiteur et se redessinent à chaque arrivée (et à l'ouverture de la feuille) ---------- */
  function rejoue(){
    [].forEach.call(document.querySelectorAll('svg.plan .pl-pas'),function(g){var n=g.cloneNode(true);g.parentNode.replaceChild(n,g);});
  }

  /* ---------- le baptistère : « ploc » ou rire du ver, au survol ou au toucher ---------- */
  var AC=null,derniere=0;
  function audio(){try{if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return;AC=new AX();}if(AC.state==='suspended')AC.resume();}catch(_){}}
  ['pointerdown','keydown','touchstart'].forEach(function(n){addEventListener(n,audio,{passive:true});});
  function ploc(){
    var c=AC,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(rnd(440,620),t);o.frequency.exponentialRampToValueAtTime(rnd(110,150),t+.11);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+.16);
    o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.2);
    var o2=c.createOscillator(),g2=c.createGain();o2.type='triangle';o2.frequency.setValueAtTime(900,t);o2.frequency.exponentialRampToValueAtTime(300,t+.04);
    g2.gain.setValueAtTime(.0001,t);g2.gain.exponentialRampToValueAtTime(.05,t+.003);g2.gain.exponentialRampToValueAtTime(.0001,t+.06);
    o2.connect(g2);g2.connect(c.destination);o2.start(t);o2.stop(t+.08);
  }
  function rire(){
    var c=AC,t=c.currentTime,n=3+((Math.random()*3)|0),base=rnd(300,420),i;
    for(i=0;i<n;i++){
      var s=t+i*.115,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
      o.type='sawtooth';o.frequency.setValueAtTime(base*(1+i*.06),s);o.frequency.exponentialRampToValueAtTime(base*(.72+i*.03),s+.09);
      f.type='bandpass';f.frequency.value=900+i*60;f.Q.value=2.2;
      g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(.09,s+.012);g.gain.exponentialRampToValueAtTime(.0001,s+.095);
      o.connect(f);f.connect(g);g.connect(c.destination);o.start(s);o.stop(s+.11);
    }
  }
  function rnd(a,b){return a+Math.random()*(b-a);}
  function reagit(zone){
    var v=zone.parentNode.querySelector('.pl-ver');
    if(v){v.classList.remove('rit');void v.getBoundingClientRect();v.classList.add('rit');setTimeout(function(){v.classList.remove('rit');},900);}
    var now=performance.now();
    if(now-derniere<1300)return;derniere=now;
    if(!AC||AC.state!=='running')return;
    try{if(Math.random()<.5)ploc();else rire();}catch(_){}
  }
  document.addEventListener('pointerenter',function(e){if(e.target.classList&&e.target.classList.contains('pl-hit'))reagit(e.target);},true);
  document.addEventListener('pointerdown',function(e){if(e.target.classList&&e.target.classList.contains('pl-hit'))reagit(e.target);},true);
  var feuille=document.getElementById('pl-feuille'),bouton=document.querySelector('.pl-cur');
  if(!feuille||!bouton)return;
  var vo=feuille.querySelector('.pl-vo'),vi=feuille.querySelector('.pl-vi'),fond=feuille.querySelector('.pl-fond'),x=feuille.querySelector('.pl-x');
  var calme=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches,mobile=window.matchMedia('(max-width:899px)'),ouvert=false,t0=0;
  var html=document.documentElement;

  function ouvre(){
    if(ouvert||!mobile.matches)return;
    ouvert=true;clearTimeout(t0);
    feuille.hidden=false;vo.style.transform='';
    void feuille.offsetWidth;
    feuille.classList.add('ouvert');html.classList.add('pl-ouvert');rejoue();
    bouton.setAttribute('aria-expanded','true');
    setTimeout(function(){var c=feuille.querySelector('.pl-z.on')||x;try{x.focus({preventScroll:true});}catch(_){}},calme?0:280);
    var on=feuille.querySelector('.pl-lf a[aria-current]');if(on&&on.scrollIntoView)setTimeout(function(){try{on.scrollIntoView({block:'nearest'});}catch(_){}},320);
  }
  function ferme(retour){
    if(!ouvert)return;
    ouvert=false;
    feuille.classList.remove('ouvert');html.classList.remove('pl-ouvert');
    bouton.setAttribute('aria-expanded','false');
    t0=setTimeout(function(){if(!ouvert){feuille.hidden=true;vo.style.transform='';}},calme?0:420);
    if(retour!==false){try{bouton.focus({preventScroll:true});}catch(_){}}
  }
  bouton.addEventListener('click',function(){ouvert?ferme():ouvre();});
  x.addEventListener('click',function(){ferme();});
  fond.addEventListener('click',function(){ferme();});
  addEventListener('keydown',function(e){
    if(!ouvert)return;
    if(e.key==='Escape'){e.preventDefault();ferme();return;}
    if(e.key!=='Tab')return;
    var f=[].slice.call(feuille.querySelectorAll('a[href],button')).filter(function(n){return n.offsetParent!==null;});
    if(!f.length)return;
    var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  });
  /* un lien du plan pris : la feuille se referme sans attendre la page suivante */
  feuille.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a)ferme(false);});
  mobile.addEventListener&&mobile.addEventListener('change',function(){if(!mobile.matches&&ouvert){ferme(false);feuille.hidden=true;}});

  /* se referme d'un geste vers le bas, quand le contenu est en haut (événements tactiles : le défilement natif est alors retenu) */
  var g=null;
  vi.addEventListener('touchstart',function(e){
    if(e.touches.length!==1){g=null;return;}
    var q=e.touches[0];
    g={y0:q.clientY,dy:0,on:false,ok:vi.scrollTop<=1,vy:0,ly:q.clientY,lt:performance.now()};
  },{passive:true});
  vi.addEventListener('touchmove',function(e){
    if(!g)return;
    var q=e.touches[0],dy=q.clientY-g.y0;
    if(!g.on){
      if(dy>8&&g.ok&&vi.scrollTop<=1){g.on=true;vo.style.transition='none';}
      else{if(dy<-4||!g.ok)g=null;return;}
    }
    g.dy=Math.max(0,dy);var n=performance.now();g.vy=(q.clientY-g.ly)/Math.max(1,n-g.lt);g.ly=q.clientY;g.lt=n;
    vo.style.transform='translateY('+g.dy+'px)';
    if(e.cancelable)e.preventDefault();
  },{passive:false});
  function fin(annule){
    var d=g;g=null;
    if(!d||!d.on)return;
    vo.style.transition='';
    if(!annule&&(d.dy>vo.offsetHeight*.2||d.vy>.7)){ferme();vo.style.transform='translateY(100%)';}
    else vo.style.transform='';
  }
  vi.addEventListener('touchend',function(){fin(false);});
  vi.addEventListener('touchcancel',function(){fin(true);});
})();
