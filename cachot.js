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
})();
