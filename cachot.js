/* Mode Cachot : lampe qui suit le curseur, films chargés au clic, tombe de Kavod (cierges offerts). */
(function(){
  'use strict';
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- la lampe ---------- */
  if(!calm&&window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    var de=document.documentElement,tx=innerWidth/2,ty=innerHeight*.34,x=tx,y=ty,go=false;
    addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!go){go=true;requestAnimationFrame(tick);}},{passive:true});
    function tick(){
      x+=(tx-x)*.18;y+=(ty-y)*.18;
      de.style.setProperty('--mx',x.toFixed(0)+'px');de.style.setProperty('--my',y.toFixed(0)+'px');
      if(Math.abs(tx-x)>.5||Math.abs(ty-y)>.5)requestAnimationFrame(tick);else go=false;
    }
  }

  /* ---------- poussière dans le rayon ---------- */
  var pous=document.querySelector('.cr-poussiere');
  if(pous&&!calm){
    for(var i=0;i<14;i++){
      var p=document.createElement('i');
      p.style.left=(8+Math.random()*84).toFixed(1)+'%';
      p.style.animationDelay='-'+(Math.random()*14).toFixed(1)+'s';
      p.style.animationDuration=(10+Math.random()*9).toFixed(1)+'s';
      pous.appendChild(p);
    }
  }

  /* ---------- films au clic ---------- */
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('button.fv');
    if(!b)return;
    var w=document.createElement('div'),f=document.createElement('iframe');
    w.className='vfr';
    f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(b.getAttribute('data-yt'))+'?autoplay=1&rel=0'+(b.getAttribute('data-s')?'&start='+encodeURIComponent(b.getAttribute('data-s')):'');
    f.title=b.getAttribute('data-t')||'Film';
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen','');
    f.referrerPolicy='strict-origin-when-cross-origin';
    w.appendChild(f);
    b.replaceWith(w);
  });

  /* ---------- pour qui sait regarder ---------- */
  try{console.log('%cPerdu dans le dédale anarchique des cachots du château de Fengsel.','font:700 14px serif;color:#fff;background:#000;padding:6px 10px;border-left:6px solid #e10019');}catch(e){}

  /* ---------- la tombe de Kavod ---------- */
  var tombe=document.getElementById('tombe');
  if(!tombe)return;
  var KEY='lcm-kavod',ATT='lcm-kavod-attente',NS='http://www.w3.org/2000/svg';
  var n=0;
  try{n=Math.min(+(JSON.parse(localStorage.getItem(KEY)||'{}').offerts)||0,999);}catch(e){}
  var msg=document.getElementById('tb-etat'),offres=document.getElementById('tb-offerts'),braises=document.getElementById('tb-braises'),cpt=document.getElementById('tb-compteur'),form=document.getElementById('tb-offrande');
  /* places des cierges dorés, des plus proches de la stèle aux plus lointaines : x, y du pied */
  var PLACES=[[438,664],[562,664],[388,672],[612,672],[338,680],[662,680],[288,688],[712,688],[238,694],[762,694],[463,684],[537,684],[188,698],[812,698]];

  function save(){try{localStorage.setItem(KEY,JSON.stringify({offerts:n}));}catch(e){}}
  function dire(t){msg.textContent=t;}
  function bougie(p,nouveau){
    var x=p[0],y=p[1],t=y-38,g=
      '<g class="bg or" transform="translate('+x+' 0)"><circle class="halo" cx="0" cy="'+(t-8)+'" r="96" fill="url(#tb-or)"/>'+
      '<path class="plat" d="M-10,'+(y+6)+'L-8,'+(y-3)+'H8L10,'+(y+6)+'Z"/>'+
      '<rect class="cire" x="-4.2" y="'+t+'" width="8.4" height="38" rx="2"/>'+
      '<path class="goutte" d="M-4.2,'+(t+6)+'q-2,12 1,20"/><path class="meche" d="M0,'+t+'v-7"/>'+
      '<g transform="translate(0 '+(t-6)+')"><g class="flamme"><path class="ext" d="M0,0C-5,-5 -3,-13 0,-20C3,-13 5,-5 0,0Z"/><path class="int" d="M0,-2C-2,-4 -2,-8 0,-12C2,-8 2,-4 0,-2Z"/></g></g></g>';
    offres.insertAdjacentHTML('beforeend',nouveau?'<g class="nv">'+g+'</g>':g);
  }
  function compte(){
    cpt.textContent=n?(n+(n>1?' cierges allumés par vos soins':' cierge allumé par vos soins')):'';
  }

  for(var i=0;i<Math.min(n,PLACES.length);i++)bougie(PLACES[i],false);
  compte();
  if(n)dire('Vos cierges brûlent toujours.');

  /* braises qui montent des deux grands cierges */
  if(!calm){
    for(i=0;i<12;i++){
      var c=document.createElementNS(NS,'circle'),gauche=i%2===0;
      c.setAttribute('cx',((gauche?318:682)+(Math.random()*14-7)).toFixed(1));
      c.setAttribute('cy','560');c.setAttribute('r',(.9+Math.random()*1.1).toFixed(1));
      c.style.setProperty('--dx',(Math.random()*40-20).toFixed(0)+'px');
      c.style.animationDelay='-'+(Math.random()*7).toFixed(1)+'s';
      c.style.animationDuration=(5+Math.random()*4).toFixed(1)+'s';
      braises.appendChild(c);
    }
  }

  /* ---------- le cierge offert ----------
     Avant de partir, on garde un jeton ; on revient sur cette page avec ce même jeton,
     et c'est ce retour qui allume le cierge doré. Aucun serveur ne vérifie : le retour fait foi. */
  function jeton(){
    var a=new Uint8Array(12);
    (window.crypto||window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a,function(v){return ('0'+v.toString(16)).slice(-2);}).join('');
  }
  if(form){
    form.addEventListener('submit',function(){
      var j=jeton(),base=location.origin+location.pathname;
      try{localStorage.setItem(ATT,JSON.stringify({j:j,t:Date.now()}));}catch(e){}
      form.elements.return.value=base+'?cierge='+j;
      form.elements.cancel_return.value=base+'?cierge=annule';
      form.elements.custom.value=j;
    });
  }
  var q=new URLSearchParams(location.search).get('cierge');
  if(q){
    var ok=false;
    if(q!=='annule'){
      try{
        var att=JSON.parse(localStorage.getItem(ATT)||'null');
        if(att&&att.j===q&&Date.now()-att.t<6*3600*1000){ok=true;localStorage.removeItem(ATT);}
      }catch(e){}
    }
    try{history.replaceState(null,'',location.pathname);}catch(e){}
    if(ok){
      n++;save();
      if(n<=PLACES.length)bougie(PLACES[n-1],true);
      compte();
      dire('Merci. Un cierge doré vient de s’allumer pour Kavod TinkiWizkhi.');
      tombe.scrollIntoView({behavior:calm?'auto':'smooth',block:'center'});
    }else if(q==='annule'){
      dire('Le cierge n’a pas été allumé.');
    }else{
      dire('Ce retour n’a pas été reconnu : aucun cierge n’a été ajouté.');
    }
  }
  /* ---------- le sac à main : le jeu de la tombe ----------
     Un cadenas à six molettes. Les nombres sont ceux du document « Tchernobyl 2.0 » (fiche de Kavod).
     Une fois entrés, la bombe est tenue en respect 65 heures ; passé ce délai, elle saute, et il ne reste que des confettis. */
  var sac=document.getElementById('tb-sac'),cad=document.getElementById('tb-cad'),ce=document.getElementById('cad-etat');
  if(sac&&cad){
    var CODE=[4,8,15,16,23,42],DELAI=65*3600*1000,SK='lcm-sac',mols=[].slice.call(cad.querySelectorAll('.mol')),val=[0,0,0,0,0,0],blanches=document.getElementById('tb-blanches'),ouvert=false,bomb=null;
    var st={t:0,n:0};
    try{var q0=JSON.parse(localStorage.getItem(SK)||'{}');st.t=+q0.t||0;st.n=Math.min(+q0.n||0,99);}catch(e){}
    function sauve(){try{localStorage.setItem(SK,JSON.stringify(st));}catch(e){}}
    function ecrit(i){mols[i].querySelector('b').textContent=('0'+val[i]).slice(-2);mols[i].setAttribute('aria-valuenow',val[i]);}
    function rose(k){
      var x=360+k*17,y=640+(k%2)*5,g=document.createElementNS(NS,'g');g.setAttribute('class','blanche');g.setAttribute('transform','translate('+x+' '+y+') rotate('+((k%3)*9-9)+')');
      g.innerHTML='<path class="tige-b" d="M0 0C-2 -10 2 -20 0 -30"/>'+[0,72,144,216,288].map(function(a){return '<ellipse class="petale" cx="0" cy="-39" rx="5" ry="8.5" transform="rotate('+a+' 0 -32)"/>';}).join('')+'<circle class="coeur-b" cx="0" cy="-32" r="3.4"/>';
      blanches.appendChild(g);
    }
    function reste(){return st.t?DELAI-(Date.now()-st.t):0;}
    function duree(ms){var h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000);return h+' h '+('0'+m).slice(-2);}
    function etatSac(){
      var r=reste();
      sac.classList.toggle('desamorce',r>0);
      if(r>0){
        cad.classList.add('ouvert');CODE.forEach(function(c,i){val[i]=c;ecrit(i);});
        ce.textContent='La bombe est tenue en respect. Elle reprendra son compte à rebours dans '+duree(r)+'. Veille n° '+st.n+'.';
      }else{cad.classList.remove('ouvert');}
    }
    function essai(){
      if(reste()>0)return;
      if(val.some(function(v,i){return v!==CODE[i];}))return;
      st.t=Date.now();st.n++;sauve();
      sac.classList.add('desamorce');cad.classList.add('ouvert');
      if(st.n<=6)rose(st.n-1);
      var b=sac.getBoundingClientRect(),m=new Date(),noel=m.getMonth()===11&&m.getDate()>=24&&m.getDate()<=26;
      window.crGerbe&&window.crGerbe(b.left+b.width/2,b.top+b.height/2,14);
      ce.textContent=noel?'Clic. Sous le rabat, un mot : « C’est bientôt Noël, je vais donc vous faire un cadeau, mais c’est une surprise. » K.'
        :'Clic. Le compte à rebours repart pour soixante-cinq heures. Une rose blanche est posée sur la stèle. Veille n° '+st.n+'.';
      if(noel&&window.crConfettis)window.crConfettis(60);
    }
    function pas(i,d){
      if(reste()>0){dire('Le cadenas est ouvert : la bombe est tenue en respect.');return;}
      val[i]=(val[i]+d+100)%100;ecrit(i);essai();
      if(val.every(function(v){return v===0;})===false&&!ouvert){ouvert=true;}
    }
    mols.forEach(function(m,i){
      m.addEventListener('click',function(e){var r=m.getBoundingClientRect();pas(i,e.clientY<r.top+r.height/2?1:-1);});
      m.addEventListener('wheel',function(e){e.preventDefault();pas(i,e.deltaY<0?1:-1);},{passive:false});
      m.addEventListener('keydown',function(e){
        if(e.key==='ArrowUp'||e.key==='ArrowRight'){e.preventDefault();pas(i,1);}
        else if(e.key==='ArrowDown'||e.key==='ArrowLeft'){e.preventDefault();pas(i,-1);}
        else if(e.key==='PageUp'){e.preventDefault();pas(i,10);}
        else if(e.key==='PageDown'){e.preventDefault();pas(i,-10);}
      });
    });
    function ouvre(){
      cad.hidden=false;
      if(!sac.classList.contains('desamorce'))sac.classList.add('tremble');
      setTimeout(function(){sac.classList.remove('tremble');},520);
      cad.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'});
      if(reste()<=0)ce.textContent='Six molettes, et le tic-tac d’un minuteur. Sur la fiche de Kavod, un document donne les nombres.';
    }
    sac.addEventListener('click',ouvre);
    sac.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();ouvre();}});
    /* le délai est passé : la bombe a sauté en l'absence du visiteur */
    if(st.t&&reste()<=0){
      var n0=st.n;st.t=0;st.n=0;sauve();
      cad.hidden=false;ce.textContent='Pendant votre absence, la bombe a sauté : il ne reste du sac que des confettis. La vieille dame en a racheté un autre. (Veilles accomplies : '+n0+'.)';
      setTimeout(function(){window.crConfettis&&window.crConfettis(70);},600);
    }
    for(var k=0;k<Math.min(st.n,6)&&reste()>0;k++)rose(k);
    if(reste()>0){cad.hidden=false;etatSac();}
  }
  /* les deux grands cierges : un souffle les éteint */
  [].forEach.call(tombe.querySelectorAll('.bg.feu'),function(c){
    c.addEventListener('click',function(){
      c.classList.toggle('eteint');
      dire(c.classList.contains('eteint')?'Un courant d’air. Quelqu’un a soufflé.':'Quelqu’un a rallumé.');
    });
  });
})();
