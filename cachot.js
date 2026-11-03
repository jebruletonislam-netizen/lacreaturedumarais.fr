/* Mode Cachot : vidéos YouTube chargées au clic, et recueillement devant la tombe de Kavod. */
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

  var tombe=document.getElementById('tombe');
  if(!tombe)return;
  var KEY='lcm-kavod',NS='http://www.w3.org/2000/svg';
  var etat={cierges:false,fleurs:0};
  try{var s=JSON.parse(localStorage.getItem(KEY)||'{}');etat.cierges=!!s.cierges;etat.fleurs=Math.min(+s.fleurs||0,9);}catch(e){}
  var bC=document.getElementById('tb-cierge'),bF=document.getElementById('tb-fleur'),msg=document.getElementById('tb-etat'),gerbe=document.getElementById('tb-fleurs');
  /* places au pied de la stèle : x, y, inclinaison */
  var PLACES=[[318,436,-14],[352,442,8],[386,438,-4],[420,444,12],[454,438,-9],[488,442,6],[336,452,10],[404,454,-6],[470,452,14]];

  function save(){try{localStorage.setItem(KEY,JSON.stringify(etat));}catch(e){}}
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
  function dire(t){msg.textContent=t;}

  function cierges(on,silencieux){
    etat.cierges=on;tombe.classList.toggle('allume',on);
    bC.setAttribute('aria-pressed',on?'true':'false');
    bC.textContent=on?'ÉTEINDRE LES CIERGES':'ALLUMER LES CIERGES';
    if(!silencieux){dire(on?'Les cierges brûlent pour Kavod TinkiWizkhi.':'Les cierges sont éteints.');save();}
  }
  function fleur(i,anime){
    var p=PLACES[i],g=el('g',{transform:'translate('+p[0]+' '+p[1]+') rotate('+p[2]+')'},gerbe),h=el('g',{class:anime?'fleur-nv':''},g);
    el('path',{class:'tige',d:'M0 0 C-2 -10 2 -20 0 -30'},h);
    [0,72,144,216,288].forEach(function(a){el('ellipse',{class:'fleur',cx:0,cy:-39,rx:5,ry:8.5,transform:'rotate('+a+' 0 -32)'},h);});
    el('circle',{cx:0,cy:-32,r:3.6,fill:'#ffcc00'},h);
  }
  function fleurs(n){
    bF.disabled=n>=PLACES.length;
    bF.textContent=bF.disabled?'LES FLEURS SONT DÉPOSÉES':'DÉPOSER UNE FLEUR';
  }

  for(var i=0;i<etat.fleurs;i++)fleur(i,false);
  fleurs(etat.fleurs);
  cierges(etat.cierges,true);
  if(etat.cierges||etat.fleurs)dire('Vos hommages sont toujours là.');

  bC.addEventListener('click',function(){cierges(!etat.cierges);});
  bF.addEventListener('click',function(){
    if(etat.fleurs>=PLACES.length)return;
    fleur(etat.fleurs,true);etat.fleurs++;fleurs(etat.fleurs);save();
    dire(etat.fleurs>=PLACES.length?'La stèle disparaît sous les fleurs.':'Une fleur déposée au pied de la stèle.');
  });
})();
