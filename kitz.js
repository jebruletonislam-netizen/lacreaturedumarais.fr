/* Le père Kitz-Latouch, vampire de Rouen centre et supérieur d'Éphébus, surgit vampiriquement dans son tricycle, avec ses enfants de chœur.
   Quand on ouvre « Misérables » sur la page d'In Odium Fidei (le clip, c'est le tournage qu'il a perturbé), son ombre traverse le bas de
   l'écran, pédale, sonne, et disparaît : un clin d'œil furtif. Chargé à la demande par putride.js ; ne fait rien si l'on a demandé moins d'animations. */
(function(){
  'use strict';
  if(window.Kitz)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU=6.283185307,rnd=function(a,b){return a+Math.random()*(b-a);},clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var AC=null,timer=0,vues=0,run=null,mode=false,detEl=null;

  /* le son : la sonnette du tricycle, discrète ; le contexte audio naît au premier geste (clic sur le titre) */
  function audio(){
    try{
      if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return;AC=new AX();}
      if(AC.state==='suspended')AC.resume();
    }catch(_){}
  }
  addEventListener('pointerdown',audio,{passive:true});addEventListener('keydown',audio,{passive:true});
  function dring(){
    var c=AC;if(!c||c.state!=='running'||document.hidden)return;
    try{
      [0,.17].forEach(function(dl){
        var t=c.currentTime+dl,g=c.createGain();
        g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.6);g.connect(c.destination);
        [[2093,1],[3136,.5],[4186,.25]].forEach(function(p){var o=c.createOscillator(),q=c.createGain();o.type='sine';o.frequency.value=p[0]*(1+dl*.01);q.gain.value=p[1];o.connect(q);q.connect(g);o.start(t);o.stop(t+.65);});
      });
    }catch(_){}
  }

  function ik(a,b,l1,l2){
    var dx=b.x-a.x,dy=b.y-a.y,d0=Math.hypot(dx,dy)||1,d=Math.min(d0,l1+l2-.5),aa=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-aa*aa)),ux=dx/d0,uy=dy/d0;
    return {x:a.x+ux*aa+uy*h,y:a.y+uy*aa-ux*h};
  }
  function roue(c,x,y,r,a){
    var i;c.lineWidth=3;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();
    c.lineWidth=1.6;c.beginPath();for(i=0;i<5;i++){c.moveTo(x,y);c.lineTo(x+Math.cos(a+i*TAU/5)*r,y+Math.sin(a+i*TAU/5)*r);}c.stroke();
    c.beginPath();c.arc(x,y,2.6,0,TAU);c.fill();
  }
  /* le père sur son tricycle, vu de profil, tourné vers la droite ; origine au sol ; d = distance parcourue (les pédales sont sur la grande roue) */
  function cure(c,d){
    var F={x:62,y:-22},Rr={x:-40,y:-14},ph=d/22,bob=Math.sin(ph*2)*1.3,H={x:-20,y:-42+bob},S={x:-4,y:-84+bob},HB={x:56,y:-54},k,P,K;
    c.lineCap='round';c.lineJoin='round';
    roue(c,F.x,F.y,22,ph);roue(c,Rr.x,Rr.y,14,d/14);
    c.lineWidth=4;c.beginPath();c.moveTo(Rr.x,Rr.y);c.lineTo(-24,-40);c.lineTo(50,-48);c.moveTo(F.x,F.y);c.lineTo(54,-50);c.moveTo(HB.x-3,HB.y+1);c.lineTo(HB.x+7,HB.y-3);c.stroke();
    c.lineWidth=5;c.beginPath();c.moveTo(-32,-41);c.lineTo(-12,-41);c.stroke();
    for(k=1;k>=0;k--){
      if(k===0){
        c.lineWidth=17;c.beginPath();c.moveTo(H.x,H.y);c.lineTo(S.x,S.y);c.stroke();
        c.lineWidth=6;c.beginPath();c.moveTo(S.x,S.y);c.lineTo(24,-68+bob);c.lineTo(HB.x,HB.y);c.stroke();
        c.beginPath();c.arc(0,-102+bob,9.5,0,TAU);c.fill();
        c.lineWidth=7;c.beginPath();c.moveTo(-3,-90+bob);c.lineTo(-2,-95+bob);c.stroke();
      }
      P={x:F.x+11*Math.cos(ph+k*Math.PI),y:F.y+11*Math.sin(ph+k*Math.PI)};K=ik(H,P,34,36);
      c.lineWidth=10;c.beginPath();c.moveTo(H.x,H.y);c.lineTo(K.x,K.y);c.stroke();
      c.lineWidth=7;c.beginPath();c.moveTo(K.x,K.y);c.lineTo(P.x,P.y);c.lineTo(P.x+8,P.y+1);c.stroke();
    }
    /* le col romain : la petite pièce blanche sous le menton */
    var sb=c.shadowBlur;c.shadowBlur=0;c.fillStyle='#f6f1ff';c.fillRect(-5.2,-95.5+bob,7.2,4);c.shadowBlur=sb;c.fillStyle='#05000b';
  }
  function enfant(c,x,d,k){
    var s=Math.sin(d/6+k*2),sb=c.shadowBlur;
    c.lineWidth=3;c.beginPath();c.moveTo(x,-12);c.lineTo(x+s*5,-1);c.moveTo(x,-12);c.lineTo(x-s*5,-1);c.stroke();
    c.beginPath();c.moveTo(x-5,-12);c.lineTo(x+5,-12);c.lineTo(x+1,-30);c.lineTo(x-2,-30);c.closePath();c.fill();
    c.beginPath();c.arc(x,-35+Math.abs(s)*-1.5,4.6,0,TAU);c.fill();
    c.shadowBlur=0;c.fillStyle='#efe6ff';c.beginPath();c.moveTo(x-6,-16);c.lineTo(x+6,-16);c.lineTo(x+8,-6);c.lineTo(x-8,-6);c.closePath();c.fill();c.fillStyle='#05000b';c.shadowBlur=sb;
  }

  function passe(){
    if(run||document.hidden||calm)return;
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),mob=W<900,s=mob?.62:.95,dir=Math.random()<.5?1:-1,sp=(mob?150:190),
        len=260*s,x=dir>0?-len:W+len,d=0,last=performance.now(),dr=false;
    var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:41;pointer-events:none';
    var c=cv.getContext('2d');document.body.appendChild(cv);
    var R={cv:cv,raf:0};run=R;
    var ground=H-(mob?22:30);
    function frame(now){
      if(run!==R)return;
      var dt=Math.min(.05,(now-last)/1000);last=now;
      if(document.hidden){R.raf=requestAnimationFrame(frame);return;}
      var v=sp*(1+.12*Math.sin(now/300));x+=dir*v*dt;d+=v*dt/s;
      if(!dr&&(dir>0?x>W*.3:x<W*.7)){dr=true;dring();}
      if(dir>0?x>W+len:x<-len){fin();return;}
      c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
      c.save();c.translate(x,ground);c.scale(dir*s,s);
      c.globalAlpha=.94;c.fillStyle=c.strokeStyle='#05000b';c.shadowColor='rgba(165,60,255,.85)';c.shadowBlur=11;
      enfant(c,-92,d,0);enfant(c,-126,d,1);
      cure(c,d);
      c.restore();
      R.raf=requestAnimationFrame(frame);
    }
    R.raf=requestAnimationFrame(frame);
  }
  function fin(){if(!run)return;cancelAnimationFrame(run.raf);run.cv.remove();run=null;}

  function plan(delai){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!mode||!detEl||!detEl.open)return;
      passe();
      if(++vues<3)plan(rnd(16000,28000));
    },delai);
  }
  document.addEventListener('toggle',function(e){
    var d=e.target;
    if(!mode||!d||!d.matches||!d.matches('details[data-t="Misérables"]'))return;
    detEl=d;
    if(d.open){vues=0;plan(1300);}else{clearTimeout(timer);}
  },true);

  function go(){stop();if(calm)return;mode=true;vues=0;detEl=document.querySelector('details[data-t="Misérables"]');if(detEl&&detEl.open)plan(2200);}
  function stop(){mode=false;clearTimeout(timer);fin();detEl=null;}
  window.Kitz={go:go,stop:stop,show:function(){stop();mode=true;passe();},actif:function(){return !!run;}};
})();
