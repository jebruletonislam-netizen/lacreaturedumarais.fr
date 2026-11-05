/* Le Ver du baptistère : maître du réseau de baptistères, il se repaît de snuff movies scato et hante le Vampirium.
   De loin en loin, sur les pages du mode putride, il surgit d'un bord de l'écran, rampe entre les images, s'enroule autour d'une ou deux lignes de texte
   (il passe tantôt devant, tantôt derrière les mots), puis s'enfuit à toute vitesse vers la plus grosse forme circulaire qu'il trouve : il s'y enroule et y forme
   un baptistère de pierre. Celui-ci s'ouvre sur un bain de sang, le ver y plonge, le couvercle se referme, et tout disparaît.
   Chargé à la demande par putride.js ; ne fait rien si l'on a demandé moins d'animations. */
(function(){
  'use strict';
  if(window.Ver)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU=6.283185307,rnd=function(a,b){return a+Math.random()*(b-a);},clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var smooth=function(t){t=clamp(t,0,1);return t*t*(3-2*t);};
  var run=null,timer=0,vues=0,on=false,AC=null,ph0='';

  /* le son : un « plouf » lourd et humide quand il plonge dans le sang ; le contexte audio naît au premier geste */
  function audio(){try{if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return;AC=new AX();}if(AC.state==='suspended')AC.resume();}catch(_){}}
  addEventListener('pointerdown',audio,{passive:true});addEventListener('keydown',audio,{passive:true});
  function plouf(){
    var c=AC;if(!c||c.state!=='running'||document.hidden)return;
    try{
      var t=c.currentTime,o=c.createOscillator(),g=c.createGain(),len=Math.floor(c.sampleRate*.4),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0),i;
      o.type='sine';o.frequency.setValueAtTime(240,t);o.frequency.exponentialRampToValueAtTime(55,t+.22);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.3);
      o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.34);
      for(i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2);
      var s=c.createBufferSource(),lp=c.createBiquadFilter(),ng=c.createGain();
      s.buffer=buf;lp.type='lowpass';lp.frequency.setValueAtTime(1800,t);lp.frequency.exponentialRampToValueAtTime(240,t+.35);
      ng.gain.setValueAtTime(.07,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.38);s.connect(lp);lp.connect(ng);ng.connect(c.destination);s.start(t);
    }catch(_){}
  }

  /* ---------- ce que le ver trouve sur la page ---------- */
  function lignes(W,H,hb){
    var els=document.querySelectorAll('main p,main li,main h2,main h3,main dd,main .accroche,main blockquote'),res=[],rg=document.createRange(),i,j,b,rs,r;
    for(i=0;i<els.length&&res.length<160;i++){
      b=els[i].getBoundingClientRect();
      if(b.bottom<hb+30||b.top>H-50||b.width<150)continue;
      rg.selectNodeContents(els[i]);rs=rg.getClientRects();
      for(j=0;j<rs.length;j++){
        r=rs[j];
        if(r.width>=150&&r.height>=13&&r.height<=64&&r.top>hb+24&&r.bottom<H-40&&r.left>=0&&r.right<=W)res.push({l:r.left,t:r.top,w:r.width,h:r.height});
      }
    }
    return res;
  }
  /* la plus grosse forme circulaire visible : logo, pastille, médaillon, photo ronde… */
  function cercle(W,H){
    var els=document.querySelectorAll('img,a,button,span,i,div,svg,b,em'),best=null,i,e,b,st,rad,w,h,n=0,ok;
    for(i=0;i<els.length&&n<2500;i++){
      e=els[i];n++;
      if(e.closest&&e.closest('.ff-cv,.ff-hit,.ff-bulle,.fx-it,.eph-btn,#drips,.ver-cv'))continue;
      b=e.getBoundingClientRect();w=b.width;h=b.height;
      if(w<36||w>420||h<36||h>420||w/h<.86||w/h>1.16||b.left<4||b.top<4||b.right>W-4||b.bottom>H-4)continue;
      st=getComputedStyle(e);rad=st.borderTopLeftRadius;
      ok=rad&&(rad.indexOf('%')>0?parseFloat(rad)>=45:parseFloat(rad)>=Math.min(w,h)*.45);
      if(!ok)continue;
      if(!best||w*h>best.a*1.02)best={el:e,a:w*h,r:(w+h)/4,fx:!!(e.closest&&e.closest('header,nav'))};
    }
    return best;
  }

  /* ---------- le baptistère : pierre, couvercle en deux demi-disques, bain de sang ---------- */
  function bapt(c,x,y,R,al,sc,open,blood,t,rip){
    if(al<=.01)return;
    var i,k,g,a,p;
    c.save();c.globalAlpha=clamp(al,0,1);c.translate(x,y);c.scale(sc,sc);
    c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.arc(0,R*.07,R*1.05,0,TAU);c.fill();
    g=c.createRadialGradient(-R*.25,-R*.3,R*.2,0,0,R);g.addColorStop(0,'#a9a9b4');g.addColorStop(.7,'#74747e');g.addColorStop(1,'#4a4a54');
    c.fillStyle=g;c.beginPath();c.arc(0,0,R,0,TAU);c.fill();c.lineWidth=Math.max(2,R*.04);c.strokeStyle='#0e0e14';c.stroke();
    /* trèfles gravés dans la margelle */
    c.strokeStyle='rgba(12,12,18,.75)';c.lineWidth=Math.max(1.2,R*.022);
    for(i=0;i<12;i++){a=i/12*TAU;c.beginPath();c.arc(Math.cos(a)*R*.89,Math.sin(a)*R*.89,R*.045,0,TAU);c.stroke();}
    c.beginPath();c.arc(0,0,R*.82,0,TAU);c.stroke();
    c.fillStyle='#14040a';c.beginPath();c.arc(0,0,R*.79,0,TAU);c.fill();
    if(blood>0){
      c.save();c.beginPath();c.arc(0,0,R*.77,0,TAU);c.clip();c.globalAlpha=clamp(al,0,1)*clamp(blood,0,1);
      g=c.createRadialGradient(0,-R*.1,R*.05,0,0,R*.78);g.addColorStop(0,'#e3112b');g.addColorStop(.55,'#a30019');g.addColorStop(1,'#5c000d');
      c.fillStyle=g;c.fillRect(-R,-R,R*2,R*2);
      c.fillStyle='rgba(255,170,160,.3)';c.beginPath();c.ellipse(-R*.3,-R*.34,R*.3,R*.09,-.6,0,TAU);c.fill();
      c.lineWidth=Math.max(1.4,R*.025);
      for(i=0;i<rip.length;i++){p=rip[i];c.strokeStyle='rgba(255,130,120,'+(.6*(1-p)).toFixed(3)+')';c.beginPath();c.arc(0,0,R*(.1+.66*p),0,TAU);c.stroke();}
      for(k=0;k<7;k++){
        p=(t*.8+k*.31)%1;a=k*2.4;
        c.fillStyle='rgba(255,120,120,'+(.55*(1-p)).toFixed(3)+')';c.beginPath();c.arc(Math.cos(a)*R*(.18+.32*((k*.37)%1)),Math.sin(a)*R*(.14+.3*((k*.53)%1)),R*.045*p+.6,0,TAU);c.fill();
      }
      c.restore();
    }
    /* le couvercle : deux demi-disques qui coulissent sous la margelle */
    if(open<.995){
      c.save();c.beginPath();c.arc(0,0,R*.79,0,TAU);c.clip();
      [-1,1].forEach(function(sd){
        c.save();c.translate(sd*open*R*.82,0);
        c.beginPath();c.rect(sd>0?0:-R,-R,R,R*2);c.clip();
        var lg=c.createLinearGradient(sd*R*.7,0,0,0);lg.addColorStop(0,'#3a3140');lg.addColorStop(1,'#26202c');
        c.fillStyle=lg;c.beginPath();c.arc(0,0,R*.79,0,TAU);c.fill();
        c.strokeStyle='#8b8696';c.lineWidth=Math.max(1.4,R*.03);c.beginPath();c.arc(0,0,R*.74,0,TAU);c.stroke();
        c.strokeStyle='#cfc7dd';c.lineWidth=Math.max(1.6,R*.05);c.lineCap='round';
        c.beginPath();c.moveTo(0,-R*.5);c.lineTo(0,R*.5);c.moveTo(-R*.3,-R*.16);c.lineTo(R*.3,-R*.16);c.stroke();
        c.strokeStyle='#0a0710';c.lineWidth=Math.max(1,R*.02);c.beginPath();c.moveTo(0,-R*.79);c.lineTo(0,R*.79);c.stroke();
        c.restore();
      });
      c.restore();
    }
    c.restore();
  }

  /* ---------- le ver ---------- */
  function dessineVer(c,pts,hx,hy,L,TH,sp,clips,tNow){
    var out=[],acc=0,tgt=0,i=pts.length-1,k=0,ax=hx,ay=hy,dx,dy,d,q,f;
    out.push({x:hx,y:hy,b:pts[i]?pts[i].b:0,ln:pts[i]?pts[i].ln:-1,f:0});
    for(;i>0&&tgt<L;i--){
      dx=pts[i-1].x-ax;dy=pts[i-1].y-ay;d=Math.hypot(dx,dy);
      if(d<.001)continue;
      while(acc+d>=tgt+sp&&tgt+sp<=L){
        tgt+=sp;q=(tgt-acc)/d;
        out.push({x:ax+dx*q,y:ay+dy*q,b:pts[i-1].b,ln:pts[i-1].ln,f:tgt/L});
      }
      acc+=d;ax=pts[i-1].x;ay=pts[i-1].y;
    }
    var n=out.length,r0=TH/2;
    function rad(o,idx){var t=o.f;return r0*(t>.55?1-.62*smooth((t-.55)/.45):1)*(idx<3?1+.05*idx:1);}
    function pass(sel,fn){for(k=n-1;k>=0;k--)if(sel(out[k]))fn(out[k],k);}
    function tout(fnSel){
      /* contour, corps, anneaux, reflet */
      pass(fnSel,function(o){c.fillStyle='#2c1111';c.beginPath();c.arc(o.x,o.y,rad(o)+1.7,0,TAU);c.fill();});
      pass(fnSel,function(o,i){c.fillStyle=(i%4===0)?'#b98672':'#d6ab98';c.beginPath();c.arc(o.x,o.y,rad(o),0,TAU);c.fill();});
      pass(fnSel,function(o){c.fillStyle='rgba(255,230,215,.42)';c.beginPath();c.arc(o.x-rad(o)*.28,o.y-rad(o)*.3,rad(o)*.38,0,TAU);c.fill();});
    }
    /* les anneaux passés derrière le texte sont masqués là où se trouve la ligne */
    var gi,seen={};
    for(gi=0;gi<clips.length;gi++){
      c.save();
      var P=new Path2D();P.rect(-5,-5,1e5,1e5);P.rect(clips[gi].l-1,clips[gi].t-1,clips[gi].w+2,clips[gi].h+2);c.clip(P,'evenodd');
      tout(function(o){return o.b&&o.ln===gi;});
      c.restore();
    }
    tout(function(o){return !o.b;});
    /* la tête : plus large, une gueule sombre ronde et deux petits yeux */
    if(n>1){
      var h=out[0],nx=out[Math.min(3,n-1)],a=Math.atan2(h.y-nx.y,h.x-nx.x),hr=r0*1.28;
      c.save();c.translate(h.x,h.y);c.rotate(a);
      c.fillStyle='#2c1111';c.beginPath();c.ellipse(1,0,hr*1.18+1.7,hr+1.7,0,0,TAU);c.fill();
      c.fillStyle='#e0b5a2';c.beginPath();c.ellipse(1,0,hr*1.18,hr,0,0,TAU);c.fill();
      c.fillStyle='#3a0a10';c.beginPath();c.ellipse(hr*.82,0,hr*.42,hr*.5*(.65+.35*Math.sin(tNow*9)),0,0,TAU);c.fill();
      c.fillStyle='#f6dfe0';for(var j=-1;j<=1;j+=2){c.beginPath();c.arc(hr*.35,j*hr*.5,hr*.2,0,TAU);c.fill();c.fillStyle='#1b0306';c.beginPath();c.arc(hr*.4,j*hr*.5,hr*.09,0,TAU);c.fill();c.fillStyle='#f6dfe0';}
      c.restore();
    }
  }

  /* ---------- l'apparition ---------- */
  function passe(){
    if(run||document.hidden||calm)return;
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),s=W<900?.72:1,TH=12*s,sp=4.4*s,hdr=document.querySelector('header'),hb=hdr?hdr.getBoundingClientRect().bottom:0;
    var all=lignes(W,H,hb),ls=[],cir=cercle(W,H),i;
    if(all.length){
      var l1=all[(Math.random()*all.length)|0];ls.push(l1);
      if(Math.random()<.5){
        var near=all.filter(function(q){var dy=Math.abs(q.t-l1.t);return dy>l1.h*1.5&&dy<280;});
        if(near.length)ls.push(near[(Math.random()*near.length)|0]);
      }
    }
    var sy0=scrollY,sx0=scrollX;
    var cv=document.createElement('canvas');cv.className='ver-cv';cv.setAttribute('aria-hidden','true');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:41;pointer-events:none';
    var c=cv.getContext('2d');document.body.appendChild(cv);
    var R0=cir?clamp(Math.max(cir.r*1.1,46*s),46*s,100*s):64*s;
    var fallback=cir?null:{x:rnd(W*.3,W*.7),y:rnd(hb+R0+30,Math.max(hb+R0+31,H-R0-30))};
    function centre(){
      if(cir){
        var b=cir.el.getBoundingClientRect();
        return {x:clamp(b.left+b.width/2,R0+6,W-R0-6),y:clamp(b.top+b.height/2,R0+6,H-R0-6)};
      }
      return fallback;
    }
    function ln(k){var q=ls[k],dy=sy0-scrollY,dx=sx0-scrollX;return {l:q.l+dx,t:q.t+dy,w:q.w,h:q.h};}
    var side=Math.random()<.5?-1:1,hx=side<0?-30*s:W+30*s,hy=rnd(hb+50,H-60),th=side<0?0:Math.PI,L=170*s,pts=[{x:hx,y:hy,b:0,ln:-1}],last={x:hx,y:hy};
    var ph='in',pt=0,t=0,li=0,u=0,dir=1,uMax=0,x0=0,A=0,lam=64*s,ang=0,trav=0,rr=0,rip=[],drops=[],rippled=0,clipsL=[],bform=0,open=0,blood=0,film=0,sc=1,balpha=0,splashed=false,lastT=performance.now();
    var R={cv:cv,raf:0,ph:function(){return ph;}};run=R;
    function startWrap(k){
      var q=ln(k);li=k;uMax=Math.min(q.w,440*s);dir=Math.random()<.5?1:-1;
      x0=dir>0?q.l+rnd(0,q.w-uMax):q.l+q.w-rnd(0,q.w-uMax);A=q.h/2+7*s;u=0;
    }
    function wrapPos(k){var q=ln(k),phi=u/lam*TAU;return {x:x0+dir*u,y:q.t+q.h/2+A*Math.sin(phi),b:Math.cos(phi)>0?1:0};}
    function steer(tx,ty,sp0,dt,wob){
      var dx=tx-hx,dy=ty-hy,want=Math.atan2(dy,dx),da=want-th;
      while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
      th+=clamp(da,-6*dt,6*dt)+Math.sin(t*4.3)*dt*wob;
      hx+=Math.cos(th)*sp0*dt;hy+=Math.sin(th)*sp0*dt;
      return Math.hypot(tx-hx,ty-hy);
    }
    function push(b,lnk){var d=Math.hypot(hx-last.x,hy-last.y);if(d>=1.4){pts.push({x:hx,y:hy,b:b,ln:lnk});last={x:hx,y:hy};if(pts.length>1100)pts.splice(0,400);}}
    if(!ls.length)ph='flee';else{startWrap(0);}
    function frame(now){
      if(run!==R)return;
      var dt=Math.min(.05,(now-lastT)/1000);lastT=now;
      if(document.hidden){R.raf=requestAnimationFrame(frame);return;}
      t+=dt;pt+=dt;
      var b=0,lk=-1,cc=centre(),e,a;
      if(ph==='in'){
        var q0=ln(li);e=steer(x0,q0.t+q0.h/2,150*s,dt,1.8);
        if(e<12*s){ph='wrap';pt=0;}
      }else if(ph==='wrap'){
        u+=118*s*dt;
        var p=wrapPos(li);hx=p.x;hy=p.y;b=p.b;lk=li;
        var prev=pts[pts.length-1];th=Math.atan2(hy-prev.y,hx-prev.x)||th;
        if(u>=uMax){
          if(li+1<ls.length){startWrap(li+1);ph='trans';pt=0;}else{ph='flee';pt=0;}
        }
      }else if(ph==='trans'){
        var nq=ln(li);
        e=steer(x0,nq.t+nq.h/2,260*s,dt,1.2);
        if(e<12*s){ph='wrap';pt=0;}
      }else if(ph==='flee'){
        a=Math.atan2(hy-cc.y,hx-cc.x);
        e=steer(cc.x+Math.cos(a)*R0*.88,cc.y+Math.sin(a)*R0*.88,560*s,dt,.4);
        balpha=Math.max(balpha,smooth(pt/1.1)*.35);sc=.8+.2*smooth(pt/1.1);
        if(e<14*s){ph='ring';pt=0;ang=Math.atan2(hy-cc.y,hx-cc.x);trav=0;dir=Math.random()<.5?1:-1;rr=R0*.88;}
      }else if(ph==='ring'){
        var w=520*s/rr;ang+=dir*w*dt;trav+=w*dt;
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr;th=ang+dir*Math.PI/2;
        var Lt=TAU*rr*1.02+10;L+=(Lt-L)*Math.min(1,dt*4);
        bform=smooth(trav/(TAU*.95));balpha=Math.max(balpha,bform);sc=1;blood=0;
        if(trav>=TAU*1.12){ph='open';pt=0;}
      }else if(ph==='open'){
        var w2=520*s/rr;ang+=dir*w2*dt;rr=R0*.88*(1-.3*smooth(pt/.9));
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr;th=ang+dir*Math.PI/2;
        open=smooth(pt/.6);blood=smooth(pt/.5);balpha=1;
        if(pt>.9){ph='dive';pt=0;}
      }else if(ph==='dive'){
        var kk=smooth(pt/1.05);rr=R0*.62*(1-kk);ang+=dir*Math.min(11,520*s/Math.max(rr,14*s))*dt;
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr;th=ang+dir*Math.PI/2;
        film=smooth(pt/.7)*.75;
        if(pt>.25)L=Math.max(0,L-(TAU*R0*.88)*.62*dt*1.5);
        if(Math.random()<dt*14)rip.push(0);
        if(L<=3||pt>1.9){ph='splash';pt=0;plouf();}
      }else if(ph==='splash'){
        if(!splashed){splashed=true;for(i=0;i<30;i++){var aa=rnd(0,TAU),vv=rnd(120,520)*s;drops.push({x:cc.x+Math.cos(aa)*R0*.1,y:cc.y,vx:Math.cos(aa)*vv*.6,vy:-rnd(260,640)*s,r:rnd(1.8,4.6)*s,l:rnd(.6,1.1)});}rip.push(0,-.2,-.4);}
        open=1-smooth((pt-.15)/.5);film=Math.max(0,film-dt*1.6);
        if(pt>.8){balpha=1-smooth((pt-.8)/.5);sc=1-.12*smooth((pt-.8)/.5);}
        if(pt>1.4){fin();return;}
      }
      if(ph!=='splash')push(b,lk);
      /* dessin */
      c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
      for(i=rip.length-1;i>=0;i--){rip[i]+=dt*.9;if(rip[i]>1)rip.splice(i,1);}
      var rp=rip.filter(function(v){return v>=0;});
      var cx2=cc.x,cy2=cc.y;
      if(ph==='flee'||ph==='ring'||ph==='open'||ph==='dive'||ph==='splash')bapt(c,cx2,cy2,R0,balpha,sc,ph==='ring'||ph==='flee'?0:open,blood,t,rp);
      /* les rectangles de lignes sont recalculés à chaque image (ils suivent la page qui défile) */
      var cl=[];for(i=0;i<ls.length;i++)cl.push(ln(i));
      if(L>3&&(ph!=='splash'))dessineVer(c,pts,hx,hy,L,TH,sp,cl,t);
      if(film>0.01){
        c.save();c.beginPath();c.arc(cx2,cy2,R0*.77,0,TAU);c.clip();c.globalAlpha=film;
        var g=c.createRadialGradient(cx2,cy2-R0*.1,R0*.05,cx2,cy2,R0*.78);g.addColorStop(0,'#d80f29');g.addColorStop(1,'#6a000f');
        c.fillStyle=g;c.fillRect(cx2-R0,cy2-R0,R0*2,R0*2);c.restore();
      }
      for(i=drops.length-1;i>=0;i--){
        var d=drops[i];d.vy+=1100*s*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.l-=dt;
        if(d.l<=0){drops.splice(i,1);continue;}
        c.fillStyle='rgba(190,6,30,'+clamp(d.l*1.6,0,1).toFixed(2)+')';c.beginPath();c.ellipse(d.x,d.y,d.r,d.r*(1+Math.min(1,Math.abs(d.vy)/1200)),0,0,TAU);c.fill();
      }
      R.raf=requestAnimationFrame(frame);
    }
    R.raf=requestAnimationFrame(frame);
  }
  function fin(){if(!run)return;cancelAnimationFrame(run.raf);run.cv.remove();run=null;}

  /* quand reparaît-il ? rarement, jamais deux effets à la fois */
  function occupe(){return (window.Fourolle&&window.Fourolle.actif&&window.Fourolle.actif())||(window.Kitz&&window.Kitz.actif&&window.Kitz.actif())||document.querySelector('.lb-open,.lightbox.open,#lb.open');}
  function plan(delai){
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(!on)return;
      if(document.hidden||run||occupe()){plan(7000);return;}
      passe();
      if(++vues<4)plan(rnd(70000,140000));
    },delai);
  }
  function go(){
    if(calm)return;
    stopFx();on=true;if(!vues)plan(rnd(22000,45000));else plan(rnd(30000,70000));
  }
  function stopFx(){clearTimeout(timer);fin();}
  function stop(){on=false;stopFx();}
  window.Ver={go:go,stop:stop,show:function(){on=true;fin();passe();},actif:function(){return !!run;},phase:function(){return run?run.ph():''}};
})();
