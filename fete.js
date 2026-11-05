/* Le Délycium : lieu de vie et de fête des gueux, résidence de la Créature et de Madame Edwarda, riche en fluide vert et en copeaux de merde.
   C'est la cour des miracles de Jubilé. Quand on vient le voir (clic sur « Sur la carte », lien #delycium, ou simplement quand sa fiche apparaît
   à l'écran), la fête éclate : confettis, crottes qui volent, et une rangée de cierges qui s'allument un à un sous sa fiche.
   Chargé à la demande par putride.js, seulement sur la page du Territoire. */
(function(){
  'use strict';
  if(window.Fete)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU=6.283185307,rnd=function(a,b){return a+Math.random()*(b-a);},clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var io=null,vu=false,run=null,cool=0,styled=false,onClick=null,onHash=null;
  var COUL=['#9608f8','#c6ff3c','#ffcc00','#ff1736','#7dffd0','#ffffff','#ff7ad9'];

  function css(){
    if(styled)return;styled=true;
    var s=document.createElement('style');
    s.textContent='li#delycium.fete{position:relative;padding-bottom:4.4rem;border-color:#fc0;box-shadow:0 0 1.8rem rgba(255,190,60,.3);transition:padding .5s,border-color .6s,box-shadow .6s}'
      +'.fete-cierges{position:absolute;left:1rem;right:1rem;bottom:.55rem;height:3.2rem;display:flex;justify-content:space-between;align-items:flex-end;padding:0 .4rem;border-bottom:.28rem solid #6b5424;pointer-events:none}'
      +'.fete-cierges i{position:relative;display:block;width:.8rem;border-radius:.15rem .15rem 0 0;background:linear-gradient(90deg,#d8c79a,#fff4d2 45%,#c9b27a);box-shadow:0 .1rem .2rem rgba(0,0,0,.5)}'
      +'.fete-cierges i::before{content:"";position:absolute;left:50%;top:-.45rem;width:.12rem;height:.5rem;margin-left:-.06rem;background:#2b1b0b}'
      +'.fete-cierges i::after{content:"";position:absolute;left:50%;top:-1.75rem;width:.9rem;height:1.5rem;margin-left:-.45rem;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 80%,#fffbd0 0,#ffd23a 34%,#ff6a1f 66%,transparent 76%);transform-origin:50% 100%;transform:scale(0);opacity:0;filter:blur(.02rem)}'
      +'.fete-cierges i.on::after{opacity:1;animation:fete-allume .45s cubic-bezier(.2,1.7,.4,1) forwards,fete-feu .16s ease-in-out .45s infinite alternate}'
      +'.fete-cierges i.on{box-shadow:0 0 1.6rem .2rem rgba(255,190,60,.28),0 .1rem .2rem rgba(0,0,0,.5)}'
      +'.fete-cierges i.cg::after{animation-duration:.45s,.13s}'
      +'@keyframes fete-allume{from{transform:scale(0)}to{transform:scale(1)}}'
      +'@keyframes fete-feu{from{transform:scale(1,1) skewX(-5deg)}to{transform:scale(.86,1.15) skewX(5deg)}}'
      +'@media (prefers-reduced-motion:reduce){.fete-cierges i.on::after{animation:none;transform:scale(1)}}';
    document.head.appendChild(s);
  }

  /* ---------- les cierges : une rangée, allumée un à un ---------- */
  function cierges(li){
    css();li.classList.add('fete');
    var row=li.querySelector('.fete-cierges');
    if(!row){
      row=document.createElement('div');row.className='fete-cierges';row.setAttribute('aria-hidden','true');
      var n=innerWidth<900?9:16,i,k;
      for(i=0;i<n;i++){k=document.createElement('i');k.style.height=(1.3+Math.random()*1.6).toFixed(2)+'rem';if(i%5===2)k.className='cg';row.appendChild(k);}
      li.appendChild(row);
    }
    var cs=row.querySelectorAll('i');
    Array.prototype.forEach.call(cs,function(k,i){
      clearTimeout(k._t);
      k._t=setTimeout(function(){k.classList.add('on');},calm?0:260+i*(innerWidth<900?190:130)+Math.random()*60);
    });
  }

  /* ---------- confettis et crottes volantes ---------- */
  function fin(){if(!run)return;cancelAnimationFrame(run.raf);run.cv.remove();run=null;}
  function fete(li){
    if(calm||document.hidden||run)return;
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),mob=W<900,SL=window.Slime||{},b=li.getBoundingClientRect();
    var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:41;pointer-events:none';
    var c=cv.getContext('2d');document.body.appendChild(cv);
    var ox=clamp(b.left+b.width*.5,30,W-30),oy=clamp(b.top+b.height*.45,60,H-40),conf=[],pq=[],i,t=0,last=performance.now();
    var NC=mob?70:130,NP=mob?6:10;
    function lance(n,k,from){
      for(i=0;i<n;i++){
        var a=-Math.PI/2+rnd(-.95,.95),v=rnd(380,1000)*(mob?.8:1);
        conf.push({x:from[0]+rnd(-20,20),y:from[1],vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:rnd(5,10),h:rnd(3,5.5),r:rnd(0,TAU),vr:rnd(-9,9),ph:rnd(0,TAU),c:COUL[(Math.random()*COUL.length)|0],l:rnd(2.4,3.8)});
      }
    }
    lance(NC,0,[ox,oy]);
    /* deux salves de plus, depuis les coins de la fiche */
    setTimeout(function(){if(run)lance(Math.round(NC*.4),0,[clamp(b.left+30,20,W-20),oy]);},420);
    setTimeout(function(){if(run)lance(Math.round(NC*.4),0,[clamp(b.right-30,20,W-20),oy]);},760);
    for(i=0;i<NP;i++){
      var a2=-Math.PI/2+rnd(-1.15,1.15),v2=rnd(520,1050)*(mob?.78:1);
      pq.push({x:ox+rnd(-30,30),y:oy,vx:Math.cos(a2)*v2,vy:Math.sin(a2)*v2,s:rnd(30,50)*(mob?.8:1),r:rnd(-.8,.8),vr:rnd(-5,5),d:i*.07,ph:rnd(0,TAU)});
    }
    var R={cv:cv,raf:0};run=R;
    function frame(now){
      if(run!==R)return;
      var dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
      c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
      var alive=0,p,q,k;
      for(k=0;k<conf.length;k++){
        p=conf[k];if(p.l<=0||p.y>H+30)continue;alive++;
        p.vy+=980*dt;p.vx*=1-1.1*dt;p.vy*=1-.5*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.l-=dt;
        c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.cos(t*7+p.ph));c.globalAlpha=clamp(p.l*1.5,0,1);c.fillStyle=p.c;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore();
      }
      for(k=0;k<pq.length;k++){
        q=pq[k];if(q.d>0){q.d-=dt;alive++;continue;}
        if(q.y>H+80)continue;alive++;
        q.vy+=980*dt;q.vx*=1-.35*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=q.vr*dt;
        if(q.x<-80||q.x>W+80)continue;
        /* une petite traînée d'odeur, puis la crotte, hilare */
        c.save();c.globalAlpha=.35;c.strokeStyle='#d6ff86';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(q.x-q.vx*.04,q.y-q.vy*.04);c.lineTo(q.x-q.vx*.1,q.y-q.vy*.1);c.stroke();c.restore();
        if(SL.crotte)SL.crotte(c,q.x,q.y,q.s,q.r,0,{mouth:.7+.3*Math.sin(t*14+q.ph),lx:0,ly:0});
        else{c.fillStyle='#8a5524';c.beginPath();c.arc(q.x,q.y,q.s*.4,0,TAU);c.fill();}
      }
      if(t>9||!alive){fin();return;}
      R.raf=requestAnimationFrame(frame);
    }
    R.raf=requestAnimationFrame(frame);
  }

  function allume(force){
    var li=document.getElementById('delycium');if(!li)return;
    var now=performance.now();
    cierges(li);
    if(!force&&now<cool)return;
    cool=now+6000;fete(li);
  }

  function go(){
    stop();
    if(!document.getElementById('delycium'))return;
    onClick=function(e){
      var b=e.target.closest&&e.target.closest('.goto[data-k="delycium"]');
      if(b)setTimeout(function(){allume(true);},350);
    };
    document.addEventListener('click',onClick,true);
    onHash=function(){if(location.hash==='#delycium')setTimeout(function(){allume(true);},900);};
    addEventListener('hashchange',onHash);
    if(location.hash==='#delycium')setTimeout(function(){allume(true);},1400);
    if('IntersectionObserver' in window){
      io=new IntersectionObserver(function(es){
        es.forEach(function(en){if(en.isIntersecting&&!vu){vu=true;setTimeout(function(){allume(false);},500);}});
      },{threshold:.6});
      io.observe(document.getElementById('delycium'));
    }
  }
  function stop(){
    if(io){io.disconnect();io=null;}
    if(onClick){document.removeEventListener('click',onClick,true);onClick=null;}
    if(onHash){removeEventListener('hashchange',onHash);onHash=null;}
    vu=false;fin();
  }
  window.Fete={go:go,stop:stop,show:function(){allume(true);},actif:function(){return !!run;}};
})();
