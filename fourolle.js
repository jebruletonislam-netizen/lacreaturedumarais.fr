/* La Fourolle : feu-follet normand, âme d'une femme condamnée à courir.
   Elle ne se montre qu'à de rares instants, furtivement, sur la page de Chyren (où elle initie la Créature aux prophéties)
   et sur celle de Confiteor quand on ouvre Charia Blanche (le titre où on la poursuit : « Cesse de courir, cesse de te cacher »).
   Une flamme pâle qui file, hésite, vacille et s'éteint ; si on l'attrape d'un clic ou d'un toucher, elle se laisse reconnaître.
   Chargé à la demande par putride.js ; ne fait rien si l'on a demandé moins d'animations. */
(function(){
  'use strict';
  if(window.Fourolle)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var FICHE='/mode-putride/bestiaire/la-fourolle/';
  var TEXTES={
    chyren:'Feu-follet normand : c’est elle qui, en 2023, a ouvert à la Créature l’arrière-pays des prophéties.',
    charia:'« Cesse de courir, cesse de te cacher… » Courir est son sort, et la voix qui la traque lui promet de la rattraper.'
  };
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var TAU=6.283185307;
  var mode='',timer=0,vues=0,run=null,mx=-999,my=-999,styled=false,detEl=null;

  /* le son : un petit souffle de flamme qui s'allume, avec quelques crépitements ; synthétisé à la volée, discret. Le contexte audio naît au toucher. */
  var AC=null;
  function audio(){
    try{
      if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return;AC=new AX();}
      if(AC.state==='suspended')AC.resume();
    }catch(_){}
  }
  function souffle(){
    var c=AC;if(!c||document.hidden)return;
    function joue(){
      try{
        var t=c.currentTime,len=Math.floor(c.sampleRate*.9),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0),i,k;
        for(i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.5);
        var s=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain();
        s.buffer=buf;bp.type='bandpass';bp.Q.value=.9;
        bp.frequency.setValueAtTime(450,t);bp.frequency.exponentialRampToValueAtTime(2300,t+.32);bp.frequency.exponentialRampToValueAtTime(800,t+.85);
        g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.085,t+.07);g.gain.exponentialRampToValueAtTime(.0001,t+.85);
        s.connect(bp);bp.connect(g);g.connect(c.destination);s.start(t);
        /* crépitements */
        var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1800;hp.connect(c.destination);
        for(k=0;k<8;k++){
          var tt=t+.1+Math.random()*.6,cs=c.createBufferSource(),cg=c.createGain();
          cs.buffer=buf;cg.gain.setValueAtTime(.0001,tt);cg.gain.exponentialRampToValueAtTime(.03+Math.random()*.03,tt+.002);cg.gain.exponentialRampToValueAtTime(.0001,tt+.025);
          cs.connect(cg);cg.connect(hp);cs.start(tt,Math.random()*.4,.04);
        }
      }catch(_){}
    }
    if(c.state==='running')joue();else if(c.resume)c.resume().then(joue).catch(function(){});
  }

  function css(){
    if(styled)return;styled=true;
    var s=document.createElement('style');
    s.textContent='.ff-cv{position:fixed;inset:0;width:100%;height:100%;z-index:41;pointer-events:none}'
      +'.ff-hit{position:fixed;left:0;top:0;width:54px;height:54px;margin:-27px 0 0 -27px;z-index:42;border:0;padding:0;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'
      +'.ff-bulle{position:fixed;z-index:43;max-width:min(24rem,calc(100vw - 24px));padding:.9rem 1.1rem 1rem;border:.15rem solid #7dffd0;background:rgba(6,0,20,.94);color:#fff;font:400 1.35rem/1.25 "Bebas Neue","Arial Narrow",Impact,sans-serif;letter-spacing:.03em;box-shadow:0 0 1.4rem rgba(90,255,200,.55),0 0 .4rem rgba(90,255,200,.9) inset;opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s}'
      +'.ff-bulle.on{opacity:1;transform:none}'
      +'.ff-bulle b{display:block;margin-bottom:.35rem;color:#9bffe0;font-weight:400;font-size:1.6rem;letter-spacing:.08em;text-shadow:0 0 .6rem rgba(120,255,210,.8)}'
      +'.ff-bulle a{display:inline-block;margin-top:.5rem;color:#fc0;text-decoration:underline;text-underline-offset:.15em}'
      +'.ff-bulle a:hover{color:#fff}';
    document.head.appendChild(s);
  }

  addEventListener('pointermove',function(e){if(e.pointerType==='mouse'){mx=e.clientX;my=e.clientY;}},{passive:true});

  function fin(){
    if(!run)return;
    cancelAnimationFrame(run.raf);
    if(run.cv)run.cv.remove();
    if(run.hit)run.hit.remove();
    if(run.bul){var b=run.bul;b.classList.remove('on');setTimeout(function(){b.remove();},400);}
    run=null;
  }

  /* une apparition : une flamme qui traverse l'écran en hésitant */
  function apparait(m,from){
    if(run||document.hidden||calm)return;
    css();
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),pts=[],t=0,last=performance.now(),acc=0;
    var cv=document.createElement('canvas');cv.className='ff-cv';cv.setAttribute('aria-hidden','true');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);document.body.appendChild(cv);
    var hit=document.createElement('button');hit.type='button';hit.className='ff-hit';hit.setAttribute('aria-label','La Fourolle, un feu-follet : toucher pour la voir de près');document.body.appendChild(hit);
    var hb=document.querySelector('header'),top=hb?hb.getBoundingClientRect().bottom+30:80;
    var dir=Math.random()<.5?1:-1,x,y,vit=m==='charia'?rnd(210,260):rnd(110,160);
    if(from){x=clamp(from.x,20,W-20);y=clamp(from.y,top,H-40);dir=x>W/2?-1:1;}
    else{x=dir>0?-30:W+30;y=rnd(top+40,Math.max(top+60,H-90));}
    var th=dir>0?0:Math.PI,D=m==='charia'?rnd(6.5,8):rnd(7,9.5),ph=rnd(0,TAU),R={cv:cv,hit:hit,c:c,raf:0,mode:m,pris:false,bul:null};
    run=R;
    function pris(){
      if(R.pris)return;R.pris=true;
      audio();souffle();
      var b=document.createElement('div');b.className='ff-bulle';b.setAttribute('role','status');
      b.innerHTML='<b>La Fourolle</b>'+TEXTES[m]+'<br><a href="'+FICHE+'">Voir sa fiche →</a>';
      document.body.appendChild(b);R.bul=b;
      var w=b.offsetWidth,h=b.offsetHeight;
      b.style.left=clamp(x-w/2,12,W-w-12)+'px';b.style.top=(y+46+h<H-8?y+46:Math.max(8,y-46-h))+'px';
      requestAnimationFrame(function(){b.classList.add('on');});
      R.tf=t;
    }
    hit.addEventListener('pointerdown',audio,{passive:true});
    hit.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();pris();});
    hit.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pris();}});
    function frame(now){
      if(run!==R)return;
      var dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
      if(document.hidden){R.raf=requestAnimationFrame(frame);return;}
      var u=t/D;
      if(!R.pris){
        /* elle file, hésite, repart ; le curseur l'effraie, elle s'en écarte */
        var sp=vit*(.55+.45*Math.sin(t*1.3+ph))*(1+.25*Math.sin(t*5.1));
        th+=Math.sin(t*1.7+ph)*dt*1.5+Math.sin(t*.6)*dt*.5;
        var dx=x-mx,dy=y-my,dm=Math.hypot(dx,dy),R0=m==='charia'?170:110;
        if(dm<R0){var f=(1-dm/R0),a=Math.atan2(dy,dx),da=a-th;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;th+=da*dt*5*f;sp*=1+1.6*f;}
        x+=Math.cos(th)*sp*dt;y+=Math.sin(th)*sp*dt+Math.sin(t*9+ph)*.6;
        if(y<top){th+=(Math.PI/2-th)*dt*2;y=Math.max(y,top-12);}else if(y>H-30){th+=(-Math.PI/2-th)*dt*2;}
        if(x<-60||x>W+60){if(t>1.5){fin();return;}}
      }
      var al=R.pris?(1-clamp((t-R.tf-6)/1.2,0,1)):Math.min(clamp(t/.7,0,1),clamp((D-t)/1.2,0,1));
      if(R.pris&&t-R.tf>7.2){fin();return;}
      var fl=.78+.22*Math.sin(t*23)*Math.sin(t*7.3+ph);if(!R.pris&&Math.random()<dt*.9)fl*=.25;
      acc+=dt;
      if(acc>.032){acc=0;pts.push([x,y]);if(pts.length>30)pts.shift();}
      c.clearRect(0,0,W,H);c.globalCompositeOperation='lighter';
      var i,p,k,r;
      for(i=0;i<pts.length;i++){
        p=pts[i];k=(i+1)/pts.length;r=2+9*k*k;
        c.fillStyle='rgba(110,255,200,'+(.2*k*k*al*fl).toFixed(3)+')';c.beginPath();c.arc(p[0]+Math.sin(i*.9+t*6)*2*(1-k),p[1]+(1-k)*3,r,0,TAU);c.fill();
      }
      var halo=c.createRadialGradient(x,y,0,x,y,44);
      halo.addColorStop(0,'rgba(210,255,240,'+(.9*al*fl).toFixed(3)+')');halo.addColorStop(.25,'rgba(110,255,200,'+(.45*al*fl).toFixed(3)+')');halo.addColorStop(.6,'rgba(70,150,255,'+(.14*al*fl).toFixed(3)+')');halo.addColorStop(1,'rgba(70,150,255,0)');
      c.fillStyle=halo;c.fillRect(x-44,y-44,88,88);
      /* la flamme elle-même : une goutte pâle qui vacille vers le haut */
      var h=15+4*Math.sin(t*17+ph),wv=Math.sin(t*13+ph)*3;
      c.fillStyle='rgba(235,255,248,'+(.95*al*fl).toFixed(3)+')';
      c.beginPath();c.moveTo(x-5,y+3);c.quadraticCurveTo(x-6,y-h*.45,x+wv,y-h);c.quadraticCurveTo(x+6,y-h*.45,x+5,y+3);c.quadraticCurveTo(x,y+8,x-5,y+3);c.fill();
      hit.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';hit.style.pointerEvents=al>.15?'auto':'none';
      if(R.bul){var w=R.bul.offsetWidth,hh=R.bul.offsetHeight;R.bul.style.left=clamp(x-w/2,12,W-w-12)+'px';R.bul.style.top=(y+46+hh<H-8?y+46:Math.max(8,y-46-hh))+'px';}
      R.raf=requestAnimationFrame(frame);
    }
    R.raf=requestAnimationFrame(frame);
  }

  /* quand reparaît-elle ? */
  function plan(delai){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!mode)return;
      if(mode==='charia'){
        var d=detEl;if(!d||!d.open){return;}
        var r=d.getBoundingClientRect();
        if(r.bottom>0&&r.top<innerHeight)apparait('charia',{x:r.left+rnd(.1,.6)*r.width,y:clamp(r.top+30,0,innerHeight)});else apparait('charia');
        if(++vues<4)plan(rnd(9000,15000));
      }else{
        apparait('chyren');
        if(++vues<4)plan(rnd(26000,44000));
      }
    },delai);
  }
  function suivi(e){
    var d=e.target;
    if(!d||!d.matches||!d.matches('details[data-t="Charia Blanche"]'))return;
    detEl=d;
    if(d.open&&mode==='charia'){vues=0;plan(1800);}else{clearTimeout(timer);fin();}
  }
  document.addEventListener('toggle',suivi,true);

  function go(){
    var p=location.pathname;
    stop();
    if(calm)return;
    if(/^\/mode-putride\/discographie\/chyren\/?$/.test(p)){mode='chyren';vues=0;plan(rnd(9000,15000));}
    else if(/^\/mode-putride\/discographie\/confiteor\/?$/.test(p)){
      mode='charia';vues=0;detEl=document.querySelector('details[data-t="Charia Blanche"]');
      if(detEl&&detEl.open)plan(2500);
    }
  }
  function stop(){mode='';clearTimeout(timer);fin();detEl=null;}
  window.Fourolle={go:go,stop:stop,show:function(m,from){stop();mode=m||'chyren';apparait(mode,from);},actif:function(){return !!run;}};
})();
