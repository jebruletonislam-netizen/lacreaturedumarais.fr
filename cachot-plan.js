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
  /* ---------- la marche : on part du lieu que l'on vient de quitter (mémorisé le temps de l'onglet), pas du portail ----------
     Le chemin remonte la procession du lieu quitté jusqu'au point où les deux trajets se séparent, puis descend vers le lieu courant. */
  var SOLE='M-1.6,.6C-2.6,-1 -2.9,-3 -2.5,-4.6C-2,-6 2,-6 2.5,-4.6C2.9,-3 2.4,-1 1.6,.6C1,1.5 -1,1.5 -1.6,.6Z',
      TOES=[[-1.8,-6.5,.9],[-.7,-7.3,.76],[.4,-7.5,.7],[1.4,-7.1,.64],[2.2,-6.3,.54]],NS='http://www.w3.org/2000/svg';
  function el(n,a,p){var e=document.createElementNS(NS,n),k;for(k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
  function chemin(R,de,vers){
    var A=R[de],B=R[vers],k=0,i;
    if(!A||!B)return null;
    while(k<A.length&&k<B.length&&A[k][0]===B[k][0]&&A[k][1]===B[k][1])k++;
    var pts=[];
    for(i=A.length-1;i>=Math.max(0,k-1);i--)pts.push(A[i]);
    for(i=k;i<B.length;i++)pts.push(B[i]);
    return pts;
  }
  function pas(g,pts,final){
    var segs=[],total=0,i,n,d,k,s,x,y,ang,side,gp,dx,dy,u;
    for(i=1;i<pts.length;i++){s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(s>0){segs.push([pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],s]);total+=s;}}
    if(!segs.length)return;
    n=Math.max(1,Math.floor(total/11));
    for(i=0;i<=n;i++){
      d=Math.min(total,i*total/n);k=0;
      while(k<segs.length-1&&d>segs[k][4]){d-=segs[k][4];k++;}
      s=segs[k];u=Math.min(1,d/s[4]);dx=(s[2]-s[0])/s[4];dy=(s[3]-s[1])/s[4];side=i%2?1:-1;
      x=s[0]+(s[2]-s[0])*u-dy*2.5*side;y=s[1]+(s[3]-s[1])*u+dx*2.5*side;ang=Math.atan2(dy,dx)*180/Math.PI+90;
      gp=el('g',{'class':'pas'+(final&&i===n?' fin':'')+(i>=n-2?' dern':''),transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+ang.toFixed(1)+') scale('+(side<0?-1.2:1.2)+' 1.2)'},g);
      gp.style.animationDelay=(i*.085).toFixed(2)+'s,'+(i*.085+1.3).toFixed(2)+'s';
      el('path',{d:SOLE},gp);
      TOES.forEach(function(t){el('circle',{'class':'t',cx:t[0],cy:t[1],r:t[2]},gp);});
    }
  }
  (function(){
    var svgs=document.querySelectorAll('svg.plan[data-lieu]'),cur=svgs.length?svgs[0].getAttribute('data-lieu'):'',prev=null,calmeSvg=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    try{prev=sessionStorage.getItem('lcm-lieu');if(cur)sessionStorage.setItem('lcm-lieu',cur);}catch(_){}
    if(!cur||!prev||prev===cur)return;
    [].forEach.call(svgs,function(v){
      var R;try{R=JSON.parse(v.getAttribute('data-routes')||'{}');}catch(_){return;}
      var pts=chemin(R,prev,cur),g=v.querySelector('.pl-pas');
      if(!pts||!g)return;
      while(g.firstChild)g.removeChild(g.firstChild);
      pas(g,pts,cur!=='portail');
    });
  })();
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
