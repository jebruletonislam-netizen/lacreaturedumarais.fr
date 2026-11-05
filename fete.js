/* Le Délycium : lieu de vie et de fête des gueux, résidence de la Créature et de Madame Edwarda, riche en fluide vert et en copeaux de merde.
   C'est la cour des miracles de Jubilé. La fête éclate sur la carte du Territoire, à l'épingle du Délycium : quand la carte apparaît à l'écran,
   quand on clique sur « Sur la carte » (ou lien #delycium) : confettis et crottes qui jaillissent de l'épingle, et un cercle de cierges qui
   s'allument un à un autour d'elle, accrochés à l'épingle (ils suivent la carte quand on la déplace ou la zoome).
   Chargé à la demande par putride.js, seulement sur la page du Territoire. */
(function(){
  'use strict';
  if(window.Fete)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU=6.283185307,rnd=function(a,b){return a+Math.random()*(b-a);},clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var io=null,vu=false,run=null,cool=0,styled=false,onClick=null,onHash=null,poll=0,wait=0;
  var COUL=['#9608f8','#c6ff3c','#ffcc00','#ff1736','#7dffd0','#ffffff','#ff7ad9'];

  function css(){
    if(styled)return;styled=true;
    var s=document.createElement('style');
    s.textContent='.fete-cierges{position:absolute;left:0;top:0;width:28px;height:28px;pointer-events:none;z-index:-1}'
      +'.fete-cierges i{position:absolute;display:block;width:7px;margin-left:-3.5px;border-radius:1.5px 1.5px 0 0;background:linear-gradient(90deg,#d8c79a,#fff4d2 45%,#c9b27a);box-shadow:0 2px 3px rgba(0,0,0,.6)}'
      +'.fete-cierges i::before{content:"";position:absolute;left:50%;top:-4px;width:1.2px;height:5px;margin-left:-.6px;background:#2b1b0b}'
      +'.fete-cierges i::after{content:"";position:absolute;left:50%;top:-17px;width:9px;height:14px;margin-left:-4.5px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:radial-gradient(ellipse at 50% 80%,#fffbd0 0,#ffd23a 34%,#ff6a1f 66%,transparent 76%);transform-origin:50% 100%;transform:scale(0);opacity:0}'
      +'.fete-cierges i.on::after{opacity:1;animation:fete-allume .45s cubic-bezier(.2,1.7,.4,1) forwards,fete-feu .16s ease-in-out .45s infinite alternate}'
      +'.fete-cierges i.on{box-shadow:0 0 14px 3px rgba(255,190,60,.3),0 2px 3px rgba(0,0,0,.6)}'
      +'.fete-cierges i.cg::after{animation-duration:.45s,.13s}'
      +'.pin.fete i{border-color:#fc0;box-shadow:0 0 1rem rgba(255,200,60,.95),0 0 2.2rem rgba(255,150,40,.55);animation:fete-pouls 2.4s ease-in-out infinite}'
      +'@keyframes fete-pouls{50%{box-shadow:0 0 1.4rem rgba(255,210,80,1),0 0 3rem rgba(255,150,40,.7)}}'
      +'@keyframes fete-allume{from{transform:scale(0)}to{transform:scale(1)}}'
      +'@keyframes fete-feu{from{transform:scale(1,1) skewX(-5deg)}to{transform:scale(.86,1.15) skewX(5deg)}}'
      +'@media (prefers-reduced-motion:reduce){.fete-cierges i.on::after{animation:none;transform:scale(1)}.pin.fete i{animation:none}}';
    document.head.appendChild(s);
  }

  function carte(){var c=window.CarteLM;return c&&c.mk&&c.mk.delycium&&c.mk.delycium._icon?c:null;}
  function pinEl(){var c=carte();return c?c.mk.delycium._icon:null;}

  /* ---------- les cierges : un cercle autour de l'épingle, allumés un à un ---------- */
  function cierges(){
    var pin=pinEl();if(!pin)return;
    css();pin.classList.add('fete');
    try{carte().mk.delycium.setZIndexOffset(2000);}catch(_){}
    var row=pin.querySelector('.fete-cierges'),mob=innerWidth<900;
    if(!row){
      row=document.createElement('div');row.className='fete-cierges';row.setAttribute('aria-hidden','true');
      var n=mob?9:13,Rx=mob?34:44,Ry=mob?20:26,list=[],i,a,k;
      for(i=0;i<n;i++){a=i/n*TAU+Math.PI/2;list.push({a:a,y:14+Math.sin(a)*Ry,x:14+Math.cos(a)*Rx});}
      list.sort(function(p,q){return p.y-q.y;});
      list.forEach(function(p,j){
        var h=10+Math.random()*8;
        k=document.createElement('i');k.style.left=p.x.toFixed(1)+'px';k.style.height=h.toFixed(1)+'px';k.style.top=(p.y-h).toFixed(1)+'px';
        if(j%5===2)k.className='cg';row.appendChild(k);
      });
      pin.appendChild(row);
    }
    var cs=row.querySelectorAll('i');
    Array.prototype.forEach.call(cs,function(k,i){
      clearTimeout(k._t);
      k._t=setTimeout(function(){k.classList.add('on');},calm?0:260+i*(mob?170:120)+Math.random()*60);
    });
  }

  /* ---------- confettis et crottes volantes, jaillissant de l'épingle ---------- */
  function fin(){if(!run)return;cancelAnimationFrame(run.raf);run.cv.remove();run=null;}
  function fete(){
    var pin=pinEl();
    if(calm||document.hidden||run||!pin)return;
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),mob=W<900,SL=window.Slime||{},b=pin.getBoundingClientRect();
    if(b.bottom<0||b.top>H||b.right<0||b.left>W)return;
    var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:41;pointer-events:none';
    var c=cv.getContext('2d');document.body.appendChild(cv);
    var ox=clamp(b.left+b.width/2,20,W-20),oy=clamp(b.top+b.height/2,40,H-20),conf=[],pq=[],i,t=0,last=performance.now();
    var NC=mob?70:130,NP=mob?6:10;
    function lance(n,from){
      for(var j=0;j<n;j++){
        var a=-Math.PI/2+rnd(-1.05,1.05),v=rnd(300,900)*(mob?.8:1);
        conf.push({x:from[0]+rnd(-10,10),y:from[1],vx:Math.cos(a)*v,vy:Math.sin(a)*v,w:rnd(5,10),h:rnd(3,5.5),r:rnd(0,TAU),vr:rnd(-9,9),ph:rnd(0,TAU),c:COUL[(Math.random()*COUL.length)|0],l:rnd(2.4,3.8)});
      }
    }
    lance(NC,[ox,oy]);
    /* deux salves de plus, de part et d'autre de l'épingle */
    setTimeout(function(){if(run)lance(Math.round(NC*.4),[clamp(ox-46,10,W-10),oy+6]);},420);
    setTimeout(function(){if(run)lance(Math.round(NC*.4),[clamp(ox+46,10,W-10),oy+6]);},760);
    for(i=0;i<NP;i++){
      var a2=-Math.PI/2+rnd(-1.15,1.15),v2=rnd(520,1050)*(mob?.78:1);
      pq.push({x:ox+rnd(-12,12),y:oy,vx:Math.cos(a2)*v2,vy:Math.sin(a2)*v2,s:rnd(30,50)*(mob?.8:1),r:rnd(-.8,.8),vr:rnd(-5,5),d:i*.07,ph:rnd(0,TAU)});
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
    var now=performance.now();
    cierges();
    if(!force&&now<cool)return;
    cool=now+6000;fete();
  }
  /* on attend que la carte soit chargée, que l'épingle existe et que le défilement lisse soit fini */
  function quand(force,delay){
    clearTimeout(wait);
    var t0=performance.now(),lastY=null,same=0;
    wait=setTimeout(function again(){
      var pin=pinEl();
      if(pin){
        var b=pin.getBoundingClientRect(),y=Math.round(b.top+scrollY);
        same=(lastY===y&&b.width)?same+1:0;lastY=y;
        if(same>=2&&b.top>0&&b.bottom<innerHeight){allume(force);return;}
      }
      if(performance.now()-t0<5000)wait=setTimeout(again,260);
    },delay);
  }

  function go(){
    stop();
    if(!document.getElementById('lmap'))return;
    onClick=function(e){
      var b=e.target.closest&&e.target.closest('.goto[data-k="delycium"]');
      if(b)quand(true,700);
    };
    document.addEventListener('click',onClick,true);
    onHash=function(){if(location.hash==='#delycium')quand(true,900);};
    addEventListener('hashchange',onHash);
    if(location.hash==='#delycium')quand(true,1400);
    if('IntersectionObserver' in window){
      io=new IntersectionObserver(function(es){
        es.forEach(function(en){if(en.isIntersecting&&!vu){vu=true;quand(false,900);}});
      },{threshold:.6});
      io.observe(document.getElementById('lmap'));
    }
  }
  function stop(){
    clearTimeout(wait);
    if(io){io.disconnect();io=null;}
    if(onClick){document.removeEventListener('click',onClick,true);onClick=null;}
    if(onHash){removeEventListener('hashchange',onHash);onHash=null;}
    vu=false;fin();
  }
  window.Fete={go:go,stop:stop,show:function(){quand(true,0);},actif:function(){return !!run;}};
})();
