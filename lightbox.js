/* Liseuse de photos protégée : jamais d'ouverture du fichier image dans le navigateur. */
(function(){
  var css='#lb{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.96);display:flex;flex-direction:column;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}'
  +'#lb .lb-stage{position:relative;flex:1;min-height:0;overflow:hidden;touch-action:pan-y;cursor:zoom-out}'
  +'#lb .lb-track{display:flex;height:100%;will-change:transform}'
  +'#lb .lb-track.anim{transition:transform .28s ease}'
  +'#lb .lb-slide{flex:0 0 100%;width:100%;height:100%;display:flex;align-items:center;justify-content:center}'
  +'#lb img{max-width:94vw;max-height:90%;object-fit:contain;pointer-events:none;-webkit-user-drag:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}'
  +'#lb .lb-slide{position:relative}#lb .lb-slide::after{content:"";position:absolute;inset:0;z-index:1}'
  +'#lb .lb-mark{position:absolute;right:3vw;bottom:5vh;z-index:2;color:rgba(255,255,255,.32);font:400 1.5rem/1 "Bebas Neue",Arial,sans-serif;letter-spacing:.14em;text-shadow:0 0 .4rem #000;pointer-events:none}'
  +'#lb button{background:#000;color:#f00;border:.2rem solid #f00;font:400 3.4rem/1 "Bebas Neue",Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}'
  +'#lb button:hover,#lb button:focus-visible{background:#f00;color:#000;outline:0}'
  +'#lb .lb-x{position:absolute;top:1rem;right:1rem;width:5rem;height:5rem;font-size:2.8rem;z-index:2}'
  +'#lb .lb-c{color:#ccc;font-size:1.8rem;text-align:center;pointer-events:none}'
  +'@media(min-width:900px){#lb .lb-bar{position:absolute;inset:0;pointer-events:none}'
  +'#lb .lb-bar button{position:absolute;pointer-events:auto;top:50%;margin-top:-3rem;width:4.6rem;height:6rem}'
  +'#lb .lb-p{left:1rem}#lb .lb-n{right:1rem}'
  +'#lb .lb-c{position:absolute;left:0;right:0;bottom:.8rem}}'
  +'@media(max-width:899px){#lb .lb-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem .6rem calc(.5rem + env(safe-area-inset-bottom))}'
  +'#lb .lb-bar button{flex:none;width:4.2rem;height:3.4rem;font-size:2.4rem}'
  +'#lb .lb-c{flex:1;font-size:1.2rem}'
  +'#lb .lb-x{width:3.8rem;height:3.8rem;font-size:2.2rem}}';
  if(document.querySelector('link[href*="putride.css"]'))css+='#lb{background:rgba(8,0,18,.97)}#lb button{background:#0b0016;color:#c58bff;border-color:#39ff6e}#lb button:hover,#lb button:focus-visible{background:#39ff6e;color:#0b0016}#lb .lb-c{color:#c58bff}#lb img{box-shadow:0 0 1.6rem rgba(122,45,214,.55);border:.12rem solid #39ff6e}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var LB=null;
  function closeLB(){
    if(!LB)return;
    document.removeEventListener('keydown',LB.key,true);
    LB.box.remove();document.documentElement.style.overflow='';LB=null;
  }
  function openLB(list,i){
    closeLB();
    var n=list.length,dragging=false,moved=false,startX=0,startY=0,dx=0,locked=null;
    var box=document.createElement('div');box.id='lb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Photo agrandie');
    var stage=document.createElement('div');stage.className='lb-stage';
    var track=document.createElement('div');track.className='lb-track';
    var imgs=list.map(function(it){
      var s=document.createElement('div');s.className='lb-slide';var mk=document.createElement('span');mk.className='lb-mark';mk.textContent='© LA CRÉATURE DU MARAIS';
      var im=document.createElement('img');im.draggable=false;im.alt=it.alt||'';s.appendChild(im);s.appendChild(mk);track.appendChild(s);return im;
    });
    stage.appendChild(track);box.appendChild(stage);
    var bar=document.createElement('div');bar.className='lb-bar';
    var cap=document.createElement('div');cap.className='lb-c';
    function btn(cls,txt,lab,fn){var b=document.createElement('button');b.type='button';b.className=cls;b.textContent=txt;b.setAttribute('aria-label',lab);b.addEventListener('click',function(e){e.stopPropagation();fn();});return b;}
    function load(k){var m=(k+n)%n;if(!imgs[m].getAttribute('src'))imgs[m].src=list[m].src;}
    function place(extra,anim){
      track.classList.toggle('anim',!!anim);
      track.style.transform='translate3d(calc('+(-100*i)+'% + '+(extra||0)+'px),0,0)';
    }
    function show(k,anim){
      i=(k+n)%n;load(i-1);load(i);load(i+1);
      cap.textContent=n>1?(i+1)+' / '+n:'';
      place(0,anim);
    }
    box.appendChild(btn('lb-x','✕','Fermer la photo',closeLB));
    if(n>1){
      bar.appendChild(btn('lb-p','‹','Photo précédente',function(){show(i-1,i>0);}));
      bar.appendChild(cap);
      bar.appendChild(btn('lb-n','›','Photo suivante',function(){show(i+1,i<n-1);}));
      box.appendChild(bar);
    }
    stage.addEventListener('pointerdown',function(e){
      if(n<2||(e.pointerType==='mouse'&&e.button!==0))return;
      dragging=true;moved=false;locked=null;startX=e.clientX;startY=e.clientY;dx=0;
      track.classList.remove('anim');
    });
    stage.addEventListener('pointermove',function(e){
      if(!dragging)return;
      var mx=e.clientX-startX,my=e.clientY-startY;
      if(locked===null&&(Math.abs(mx)>6||Math.abs(my)>6))locked=Math.abs(mx)>Math.abs(my)?'x':'y';
      if(locked!=='x')return;
      if(!moved){moved=true;try{stage.setPointerCapture(e.pointerId);}catch(_){}}
      dx=mx;
      var edge=(i===0&&dx>0)||(i===n-1&&dx<0);
      place(edge?dx*.3:dx,false);
    });
    function endDrag(){
      if(!dragging)return;dragging=false;
      if(!moved){place(0,false);return;}
      var w=stage.clientWidth||1,k=i;
      if(Math.abs(dx)>Math.min(80,w*.2))k=i+(dx<0?1:-1);
      if(k<0||k>=n)k=i;
      show(k,true);
    }
    stage.addEventListener('pointerup',endDrag);
    stage.addEventListener('pointercancel',endDrag);
    stage.addEventListener('click',function(){if(moved){moved=false;return;}closeLB();});
    box.addEventListener('contextmenu',function(e){e.preventDefault();});
    box.addEventListener('dragstart',function(e){e.preventDefault();});
    var key=function(e){
      if(e.key==='Escape'){e.preventDefault();closeLB();}
      else if(e.key==='ArrowRight'&&n>1){e.preventDefault();show(i+1,i<n-1);}
      else if(e.key==='ArrowLeft'&&n>1){e.preventDefault();show(i-1,i>0);}
    };
    document.addEventListener('keydown',key,true);
    LB={box:box,key:key};document.body.appendChild(box);document.documentElement.style.overflow='hidden';
    show(i,false);
    box.querySelector('.lb-x').focus();
  }
  window.openLB=openLB;window.closeLB=closeLB;

  /* lbProtege : les photos ne se glissent pas, ne s'ouvrent pas dans un onglet, n'ont pas de menu « enregistrer l'image ». */
  var pst=document.createElement('style');
  pst.textContent='main img,.rfig img,.aff img,.vt-arc img,.gal img,.ph img{-webkit-user-drag:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}[data-lb-src],.ah>img{cursor:zoom-in}';
  document.head.appendChild(pst);
  var isImg=function(t){return t&&t.closest&&t.closest('main img,.rfig,.aff,.armes,.gal,.rgal,.ph,a[data-lb],[data-lb-src],.vt-arc,#lb');};
  document.addEventListener('contextmenu',function(e){if(isImg(e.target))e.preventDefault();});
  document.addEventListener('dragstart',function(e){if(e.target&&e.target.tagName==='IMG')e.preventDefault();});
  document.addEventListener('auxclick',function(e){var a=e.target.closest&&e.target.closest('a[data-lb]');if(a)e.preventDefault();});
  /* sur les pages qui ne chargent pas putride.js (les cachots), les liens à photo s'ouvrent aussi dans la liseuse */
  if(!document.querySelector('script[src*="putride.js"]')){
    document.addEventListener('click',function(ev){
      if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
      var a=ev.target.closest&&ev.target.closest('a[data-lb]');
      if(!a)return;
      ev.preventDefault();
      var g=a.closest('.gal,.rt,.rgal,.affiches,.armes'),L=g?[].slice.call(g.querySelectorAll('a[data-lb]')):[a];
      openLB(L.map(function(l){return {src:l.getAttribute('href'),alt:l.dataset.lb};}),Math.max(0,L.indexOf(a)));
    });
  }
  window.addEventListener('hashchange',closeLB);

  /* pages SEO (Jekyll) : galeries de tournage */
  [].slice.call(document.querySelectorAll('.route-content .tour-gallery')).forEach(function(g){
    g.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('.ph a');
      if(!a)return;
      e.preventDefault();
      var links=[].slice.call(g.querySelectorAll('.ph a'));
      openLB(links.map(function(l){var im=l.querySelector('img');return {src:l.href,alt:im?im.alt:''};}),links.indexOf(a));
    });
    g.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('.ph'))e.preventDefault();});
    g.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  /* Portraits des fiches et pochettes d'album : l'image principale de la page s'ouvre dans la liseuse, en pleine résolution.
     [data-lb-src] désigne le fichier ; les pochettes (.ah>img hors lien) sont reconnues d'elles-mêmes (fichier : data-art). */
  function grande(t){
    var e=t.closest('[data-lb-src]'),im;
    if(e){im=e.querySelector('img[alt]:not([alt=""])');return {src:e.getAttribute('data-lb-src'),alt:e.getAttribute('data-lb-alt')||(im&&im.alt)||e.getAttribute('aria-label')||''};}
    im=t.closest('.ah>img');
    if(!im)return null;
    var alp=im.closest('.alp'),d=im.parentNode.querySelector('[data-art]');
    var src=(alp&&alp.getAttribute('data-art'))||(d&&d.getAttribute('data-art'))||im.currentSrc||im.src;
    if(!/^(\/|[a-z]+:)/i.test(src))src='/'+src;
    return {src:src,alt:im.alt};
  }
  document.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
    var t=ev.target;
    if(!t||!t.closest||t.closest('a[href],button,input,#lb'))return;
    var it=grande(t);
    if(!it)return;
    ev.preventDefault();
    openLB([it],0);
  });

  /* Retour à la bonne hauteur. Chaque entrée de l'historique note sa position de défilement (sessionStorage).
     Le mode putride (navigation sans rechargement) et l'accueil (rubriques à ancre) la rétablissent eux-mêmes
     (history.scrollRestoration='manual'), les autres pages laissent faire le navigateur.
     Les liens de retour (« ← BESTIAIRE », « ← VIDÉOS », fil d'Ariane) reviennent par l'historique quand ils visent
     la page précédente ; sinon la page visée rouvre à la hauteur où on l'avait quittée. */
  (function(){
    var SS=null;try{SS=window.sessionStorage;SS.getItem('lcm-pos');}catch(e){SS=null;}
    if(!SS||!window.history||!history.replaceState)return;
    var POS='lcm-pos',VIA='lcm-via',VEUT='lcm-veut',FRAIS=60000;
    function lire(k){try{return JSON.parse(SS.getItem(k)||'null');}catch(e){return null;}}
    function ecrire(k,v){try{if(v==null)SS.removeItem(k);else SS.setItem(k,JSON.stringify(v));}catch(e){}}
    function cle(u){
      var a;try{a=new URL(u||location.href,location.href);}catch(e){return null;}
      if(a.origin!==location.origin)return null;
      return a.pathname.replace(/\/index\.html$/,'/')+a.hash;
    }
    function etat(){var s=history.state;return s&&typeof s==='object'?s:{};}
    function marquer(o){var s=etat(),n={},k;for(k in s)n[k]=s[k];for(k in o)n[k]=o[k];try{history.replaceState(n,'');}catch(e){}return n;}
    function neuf(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
    function hauteur(){return Math.round(window.pageYOffset||document.documentElement.scrollTop||0);}
    function vers(y){try{window.scrollTo({top:y,left:0,behavior:'instant'});}catch(e){window.scrollTo(0,y);}}
    function galeries(){return [].map.call(document.querySelectorAll('ul.gal'),function(g){return g._pages?g._pages.st.page:0;});}
    function noter(k,u,y,g){
      var m=lire(POS)||{},t=Date.now(),ks;
      if(k)m['e:'+k]=[y,t,g&&g.some(Boolean)?g:0];
      if(u)m['u:'+u]=[y,t];
      ks=Object.keys(m);
      if(ks.length>160){ks.sort(function(a,b){return m[a][1]-m[b][1];});ks.slice(0,ks.length-120).forEach(function(x){delete m[x];});}
      ecrire(POS,m);
    }
    var curK=null,curU=null,lastY=hauteur(),cible=null,pause=false,tw=0,arret=null;
    function garder(){clearTimeout(tw);if(curK&&!pause)noter(curK,cle(curU),lastY,galeries());}
    /* l'entrée d'historique affichée a changé (retour, avance, ancre, navigation douce) */
    function sync(){
      var s=etat(),v;
      if(s.lcmK&&s.lcmK===curK&&location.href===curU)return false;
      garder();
      if(!s.lcmK){s=marquer({lcmK:neuf()});cible=null;}
      else{v=(lire(POS)||{})['e:'+s.lcmK];cible=v?{y:v[0],g:v[2]||null}:null;}
      curK=s.lcmK;curU=location.href;
      return true;
    }
    /* défile jusqu'à y, puis recommence tant que la mise en page bouge (images, polices, plis), sauf si le visiteur reprend la main */
    function aller(v){
      if(arret)arret();
      if(!v)return false;
      if(v.g)[].forEach.call(document.querySelectorAll('ul.gal'),function(g,i){if(g._pages&&v.g[i])g._pages.afficher(v.g[i],false);});
      var y=v.y,ro=null,tm=0,EV=['wheel','touchstart','keydown','mousedown'];
      function ap(){if(arret!==stop)return;if(Math.abs(hauteur()-y)>1)vers(y);lastY=hauteur();}
      function stop(){
        if(arret===stop)arret=null;
        clearTimeout(tm);if(ro)ro.disconnect();
        EV.forEach(function(e){removeEventListener(e,stop,true);});
        removeEventListener('load',ap);
        lastY=hauteur();
      }
      arret=stop;
      ap();
      requestAnimationFrame(function(){ap();requestAnimationFrame(ap);});
      if(window.ResizeObserver){ro=new ResizeObserver(ap);ro.observe(document.body);}
      EV.forEach(function(e){addEventListener(e,stop,{capture:true,passive:true});});
      addEventListener('load',ap);
      tm=setTimeout(stop,2500);
      return true;
    }
    function voulue(){
      var w=lire(VEUT),v;ecrire(VEUT,null);
      if(!w||w.u!==cle()||Date.now()-w.t>FRAIS)return null;
      v=(lire(POS)||{})['u:'+w.u];
      return v?{y:v[0]}:null;
    }
    function retour(a){return !a.closest('.prevnext')&&(a.matches('.back a,a.back,a.clip-back,.crumbs a')||/^\s*←/.test(a.textContent));}

    addEventListener('scroll',function(){
      if(pause)return;
      if(location.href!==curU)sync();
      lastY=hauteur();
      clearTimeout(tw);tw=setTimeout(garder,150);
    },{passive:true});
    addEventListener('popstate',sync);
    addEventListener('hashchange',sync);
    addEventListener('pagehide',function(){if(location.href!==curU)sync();garder();});
    addEventListener('pageshow',function(e){if(e.persisted){pause=false;if(arret)arret();}});
    document.addEventListener('click',function(ev){
      if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
      var a=ev.target.closest&&ev.target.closest('a[href]');
      if(!a||(a.target&&a.target!=='_self')||a.hasAttribute('download')||a.hasAttribute('data-lb'))return;
      var to=cle(a.href),ici;
      if(!to)return;
      if(location.href!==curU)sync();
      if(!arret)lastY=hauteur();
      garder();
      ici=cle();
      if(to===ici)return;
      if(retour(a)){
        if(etat().lcmFrom===to&&history.length>1){ev.preventDefault();history.back();return;}
        ecrire(VEUT,{u:to,t:Date.now()});
      }
      ecrire(VIA,{from:ici,to:to,t:Date.now()});
    });

    /* arrivée sur la page */
    var nt='navigate';
    try{var pe=performance.getEntriesByType('navigation')[0];if(pe&&pe.type)nt=pe.type;}catch(e){}
    var neuve=!etat().lcmK,via=lire(VIA),initC;
    ecrire(VIA,null);
    sync();
    initC=cible;cible=null;
    if(neuve&&via&&via.to===cle()&&Date.now()-via.t<FRAIS)marquer({lcmFrom:via.from});
    function debut(){
      var w=voulue();
      if(neuve){if(w)aller(w);}
      else if(history.scrollRestoration==='manual'&&(nt==='back_forward'||nt==='reload'))aller(initC);
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',debut);else debut();

    window.LCMNav={
      /* navigation douce : juste avant de remplacer le contenu par une nouvelle page */
      quitter:function(){if(location.href!==curU)sync();if(!arret)lastY=hauteur();garder();if(arret)arret();curK=null;pause=true;},
      /* état de la nouvelle entrée, à passer à history.pushState */
      etat:function(){ecrire(VIA,null);return {lcmK:neuf(),lcmFrom:cle()};},
      /* retour/avance : le contenu va être remplacé */
      attendre:function(){if(arret)arret();pause=true;},
      /* contenu en place : nouvelle page en haut (ou à la hauteur voulue par un lien de retour), page revisitée à sa hauteur */
      arriver:function(push){
        var c,h;
        pause=false;sync();c=cible;cible=null;
        if(push){c=voulue();return c?aller(c):false;}
        if(aller(c))return true;
        h=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if(h)h.scrollIntoView();
        return false;
      },
      /* accueil (rubriques à ancre) : rétablit la hauteur d'une rubrique revisitée ; faux pour une nouvelle rubrique */
      route:function(){sync();var c=cible;cible=null;return history.scrollRestoration==='manual'&&aller(c);},
      manuel:function(){try{history.scrollRestoration='manual';}catch(e){}}
    };
  })();
})();
