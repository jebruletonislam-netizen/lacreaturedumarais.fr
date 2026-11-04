/* Les cachots : le fond vivant. Fumées, reflets, chauves-souris, paillettes, reliques cachées, petits secrets. */
(function(){
  'use strict';
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var NS='http://www.w3.org/2000/svg',KEY='lcm-reliques',TOTAL=9;
  var body=document.body;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  function div(c,p){var d=document.createElement('div');d.className=c;(p||body).appendChild(d);return d;}

  /* ---------- le petit mot qui apparaît en bas de l'écran ---------- */
  var toast=null,tt=0;
  function dire(t,ms){
    if(!toast){toast=div('cr-toast');toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');}
    toast.textContent=t;toast.classList.add('on');
    clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on');},ms||5200);
  }
  window.crDire=dire;

  /* ---------- paillettes : une étoile à quatre branches, blanche, dorée ou rouge ---------- */
  var COUL=['#fff','#fff','#ffe58a','#ffcc00','#e10019'],live=0;
  function paillette(x,y,gros){
    if(calm||live>46)return;
    var p=document.createElement('i');p.className='paillette';live++;
    p.style.setProperty('--x',x.toFixed(0)+'px');p.style.setProperty('--y',y.toFixed(0)+'px');
    p.style.setProperty('--s',(gros?rnd(10,22):rnd(6,13)).toFixed(0)+'px');
    p.style.setProperty('--c',COUL[(Math.random()*COUL.length)|0]);
    p.style.setProperty('--dx',rnd(-26,26).toFixed(0)+'px');p.style.setProperty('--dy',rnd(10,44).toFixed(0)+'px');
    p.addEventListener('animationend',function(){p.remove();live--;});
    body.appendChild(p);
  }
  function gerbe(x,y,n){for(var i=0;i<n;i++)paillette(x+rnd(-60,60),y+rnd(-50,50),true);}
  window.crGerbe=gerbe;
  if(fine&&!calm){
    var last=0;
    addEventListener('pointermove',function(e){
      var now=performance.now();
      if(now-last<70)return;last=now;
      if(Math.random()<.55)paillette(e.clientX+rnd(-6,6),e.clientY+rnd(-6,6),false);
    },{passive:true});
  }
  /* confettis : le sac qui a sauté, un grand jour */
  function confettis(n){
    if(calm)return;
    var C=['#fff','#ffcc00','#e10019','#bdbdbd','#fff'];
    for(var i=0;i<n;i++){
      var c=document.createElement('i');c.className='cr-conf';
      c.style.left=rnd(0,100).toFixed(1)+'%';c.style.setProperty('--c',C[(Math.random()*C.length)|0]);
      c.style.setProperty('--dx',rnd(-12,12).toFixed(0)+'vw');c.style.setProperty('--r',rnd(360,1100).toFixed(0)+'deg');
      c.style.setProperty('--d',rnd(2.6,4.6).toFixed(1)+'s');c.style.animationDelay=rnd(0,.9).toFixed(2)+'s';
      c.addEventListener('animationend',function(){this.remove();});
      body.appendChild(c);
    }
  }
  window.crConfettis=confettis;

  if(!calm){
    /* ---------- fumées qui montent du sol, reflets d'une boule à facettes qui tourne ---------- */
    var fu=div('cr-fumee');fu.setAttribute('aria-hidden','true');for(var i=0;i<3;i++)fu.appendChild(document.createElement('i'));
    var di=div('cr-disco');di.setAttribute('aria-hidden','true');
    for(i=0;i<(fine?16:8);i++){
      var s=document.createElement('i');s.style.left=rnd(6,92).toFixed(0)+'%';s.style.top=rnd(6,92).toFixed(0)+'%';
      s.style.setProperty('--s',rnd(3,9).toFixed(1)+'rem');s.style.setProperty('--d',rnd(4,9).toFixed(1)+'s');s.style.animationDelay='-'+rnd(0,8).toFixed(1)+'s';
      di.appendChild(s);
    }

    /* ---------- une chauve-souris traverse la salle de temps en temps ---------- */
    var BAT='M0-3C2-6 4-5 5-2C9-6 15-8 20-4C17-3 16 0 15 3C13 1 11 1 9 3C8 1 6 2 5 4L3 3C2 6 1 8 0 10C-1 8-2 6-3 3L-5 4C-6 2-8 1-9 3C-11 1-13 1-15 3C-16 0-17-3-20-4C-15-8-9-6-5-2C-4-5-2-6 0-3Z';
    var bat=function(){
      if(document.hidden){setTimeout(bat,8000);return;}
      var b=div('cr-chauve'+(Math.random()<.5?' g':''));b.setAttribute('aria-hidden','true');
      b.style.setProperty('--y',rnd(8,46).toFixed(0)+'vh');b.style.setProperty('--d',rnd(8,13).toFixed(1)+'s');
      b.innerHTML='<span class="v"><svg viewBox="-22 -10 44 22"><path d="'+BAT+'" fill="#000" stroke="#d9d9d9" stroke-width=".7"/><circle cx="-1.6" cy="-1.4" r=".75" fill="#e10019"/><circle cx="1.6" cy="-1.4" r=".75" fill="#e10019"/></svg></span>';
      b.addEventListener('animationend',function(){b.remove();});
      setTimeout(bat,rnd(22000,48000));
    };
    setTimeout(bat,7000);
  }

  /* ---------- l'araignée ---------- */
  var ar=document.querySelector('.cr-araignee .corps-a');
  if(ar)ar.addEventListener('click',function(){dire('Elle tisse l’histoire des cachots. Ne lui demandez pas de qui elle tient son fil.');});

  /* ---------- les reliques cachées ---------- */
  var trouvees=[];
  try{trouvees=JSON.parse(localStorage.getItem(KEY)||'[]').filter(function(k){return typeof k==='string';});}catch(e){}
  var cpt=document.getElementById('rel-n');
  function maj(){
    if(cpt)cpt.textContent=trouvees.length;
    if(trouvees.length>=TOTAL)body.classList.add('icone');
  }
  var rels=[].slice.call(document.querySelectorAll('button.rel'));
  rels.forEach(function(r){
    if(trouvees.indexOf(r.getAttribute('data-r'))>-1)r.classList.add('trouve');
    r.addEventListener('click',function(){
      var k=r.getAttribute('data-r'),neuf=trouvees.indexOf(k)<0,b=r.getBoundingClientRect();
      if(neuf){trouvees.push(k);try{localStorage.setItem(KEY,JSON.stringify(trouvees));}catch(e){}}
      r.classList.add('trouve');gerbe(b.left+b.width/2,b.top+b.height/2,neuf?10:4);maj();
      if(neuf&&trouvees.length>=TOTAL){
        dire('Neuf reliques. Le vitrail vous reconnaît : vous êtes une icône.',8000);confettis(70);gerbe(innerWidth/2,innerHeight/2,26);
      }else{
        dire(r.getAttribute('data-q')+(neuf?'  ('+trouvees.length+' / '+TOTAL+')':''),6200);
      }
    });
  });
  maj();

  /* ---------- le vitrail réagit au toucher ---------- */
  var vt=document.getElementById('vitrail');
  if(vt)vt.addEventListener('click',function(e){gerbe(e.clientX,e.clientY,8);dire('Le vitrail ne dit rien, mais il a l’air content.');});

  /* ---------- pour qui connaît le code ---------- */
  var SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],pos=0;
  addEventListener('keydown',function(e){
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    pos=(k===SEQ[pos])?pos+1:(k===SEQ[0]?1:0);
    if(pos===SEQ.length){pos=0;confettis(60);gerbe(innerWidth/2,innerHeight/2,30);dire('Les cachots vous acclament. Bis !',6500);}
  });
})();
