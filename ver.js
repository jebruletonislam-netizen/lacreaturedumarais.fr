/* Le Ver du baptistère : maître du réseau de baptistères, il se repaît de snuff movies scato et hante le Vampirium.
   De loin en loin, sur les pages du mode putride, il surgit d'un bord de l'écran, rampe entre les images, s'enroule autour d'une ou deux lignes de texte
   (il passe tantôt devant, tantôt derrière les mots), puis s'enfuit à toute vitesse :
   - soit vers la plus grosse forme circulaire qu'il trouve : il s'y enroule et y forme un baptistère (la vraie margelle, détourée), dont le couvercle
     s'ouvre sur un bain de sang ; le ver y plonge, le couvercle se referme, et tout disparaît ;
   - soit vers la dame-jeanne : il entre par le goulot (le bouchon saute), son contenu tourne au sang et il y nage jusqu'à ce qu'on la brise ; alors
     le sang se déverse dans le fluide vert, le rougit, et le ver y nage à son tour avant de s'y dissoudre. Si on la laisse intacte, il s'y dissout seul.
   Chargé à la demande par putride.js ; ne fait rien si l'on a demandé moins d'animations. */
(function(){
  'use strict';
  if(window.Ver)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TAU=6.283185307,rnd=function(a,b){return a+Math.random()*(b-a);},clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var smooth=function(t){t=clamp(t,0,1);return t*t*(3-2*t);};
  var run=null,timer=0,vues=0,on=false,AC=null,ph0='',force='';

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
      if(e.closest&&e.closest('.ff-cv,.ff-hit,.ff-bulle,.fx-it,.eph-btn,.cro-btn,#drips,.ver-cv'))continue;
      b=e.getBoundingClientRect();w=b.width;h=b.height;
      if(w<36||w>420||h<36||h>420||w/h<.86||w/h>1.16||b.left<4||b.top<4||b.right>W-4||b.bottom>H-4)continue;
      st=getComputedStyle(e);rad=st.borderTopLeftRadius;
      ok=rad&&(rad.indexOf('%')>0?parseFloat(rad)>=45:parseFloat(rad)>=Math.min(w,h)*.45);
      if(!ok)continue;
      if(!best||w*h>best.a*1.02)best={el:e,a:w*h,r:(w+h)/4,fx:!!(e.closest&&e.closest('header,nav'))};
    }
    return best;
  }

  /* ---------- le baptistère : la vraie margelle (photo détourée), couvercle en deux dalles qui coulissent, bain de sang ---------- */
  var BI=null,DI=null,DP=null,HI=null;
  function charge(){
    if(BI)return;
    BI=new Image();BI.decoding='async';BI.src='/images/putride/bapteme.webp?v=1';
    DI=new Image();DI.decoding='async';DI.src='/images/putride/dalle.webp?v=1';
    HI=new Image();HI.decoding='async';HI.src='/images/putride/ver-tete.webp?v=1';
  }
  function pret(){return !!(BI&&BI.complete&&BI.naturalWidth>0);}
  function bapt(c,x,y,R,al,sc,open,blood,t,rip){
    if(al<=.01||!pret())return;
    /* l'image fait 436 x 420 pour une margelle de 214 px de demi-largeur ; le bassin occupe 190 x 188 */
    var k=R/214,w=436*k,h=420*k,px=190*k,py=188*k,i,q,p;
    c.save();c.globalAlpha=clamp(al,0,1);c.translate(x,y);c.scale(sc,sc);
    c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(0,R*.06,R*1.04,R*.99,0,0,TAU);c.fill();
    c.drawImage(BI,-w/2,-h/2,w,h);
    if(blood>0){
      c.save();c.beginPath();c.ellipse(0,0,px*.97,py*.97,0,0,TAU);c.clip();c.globalAlpha=clamp(al,0,1)*clamp(blood,0,1);
      c.lineWidth=Math.max(1.4,R*.025);
      for(i=0;i<rip.length;i++){p=rip[i];c.strokeStyle='rgba(255,140,130,'+(.6*(1-p)).toFixed(3)+')';c.beginPath();c.ellipse(0,0,px*(.1+.8*p),py*(.1+.8*p),0,0,TAU);c.stroke();}
      for(q=0;q<7;q++){
        p=(t*.8+q*.31)%1;
        c.fillStyle='rgba(255,120,120,'+(.5*(1-p)).toFixed(3)+')';c.beginPath();c.arc(Math.cos(q*2.4)*px*(.18+.4*((q*.37)%1)),Math.sin(q*2.4)*py*(.14+.4*((q*.53)%1)),R*.04*p+.6,0,TAU);c.fill();
      }
      c.restore();
    }
    /* le couvercle : deux demi-dalles du pavage, gravées d'une croix rouge, qui coulissent de part et d'autre */
    if(open<.995){
      c.save();c.beginPath();c.ellipse(0,0,px,py,0,0,TAU);c.clip();
      if(!DP&&DI&&DI.complete&&DI.naturalWidth)DP=c.createPattern(DI,'repeat');
      [-1,1].forEach(function(sd){
        c.save();c.translate(sd*open*px*1.04,0);
        c.beginPath();c.rect(sd>0?0:-px,-py,px,py*2);c.clip();
        c.fillStyle=DP||'#2a1420';
        if(DP&&DP.setTransform&&window.DOMMatrix)DP.setTransform(new DOMMatrix().scale(k*.8));
        c.beginPath();c.ellipse(0,0,px,py,0,0,TAU);c.fill();
        c.fillStyle='rgba(10,0,16,.55)';c.fill();
        c.lineCap='round';
        c.strokeStyle='rgba(90,230,245,.5)';c.lineWidth=Math.max(1.4,R*.03);c.beginPath();c.ellipse(-R*.008,0,px*.95,py*.95,0,0,TAU);c.stroke();
        c.strokeStyle='rgba(255,40,60,.7)';c.beginPath();c.ellipse(R*.008,0,px*.95,py*.95,0,0,TAU);c.stroke();
        c.strokeStyle='rgba(255,60,80,.8)';c.lineWidth=Math.max(1.6,R*.045);
        c.beginPath();c.moveTo(0,-py*.5);c.lineTo(0,py*.5);c.moveTo(-px*.3,-py*.16);c.lineTo(px*.3,-py*.16);c.stroke();
        c.strokeStyle='#050007';c.lineWidth=Math.max(1,R*.02);c.beginPath();c.moveTo(0,-py);c.lineTo(0,py);c.stroke();
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
      /* d'après l'image de référence : chair rose annelée, liseré pâle, lueur rouge tout autour */
      pass(fnSel,function(o){c.save();c.shadowColor='rgba(255,36,48,.85)';c.shadowBlur=Math.max(4,rad(o)*1.1);c.fillStyle='#f1d3cc';c.beginPath();c.arc(o.x,o.y,rad(o)+1.2,0,TAU);c.fill();c.restore();});
      pass(fnSel,function(o,i){c.fillStyle=(i%2===0)?'#c98085':'#d8979a';c.beginPath();c.arc(o.x,o.y,rad(o),0,TAU);c.fill();});
      pass(fnSel,function(o,i){
        var p=out[Math.max(0,i-1)],q=out[Math.min(n-1,i+1)],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy)||1,r=rad(o);
        c.strokeStyle='rgba(110,46,56,.5)';c.lineWidth=Math.max(.8,r*.12);c.beginPath();c.moveTo(o.x-dy/d*r*.9,o.y+dx/d*r*.9);c.lineTo(o.x+dy/d*r*.9,o.y-dx/d*r*.9);c.stroke();
      });
      pass(fnSel,function(o){c.fillStyle='rgba(255,236,226,.4)';c.beginPath();c.arc(o.x-rad(o)*.28,o.y-rad(o)*.3,rad(o)*.36,0,TAU);c.fill();});
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
    /* la tête : celle de l'image de référence (yeux exorbités, bouche ouverte, langue pendante) */
    if(n>1){
      var h=out[0],nx=out[Math.min(3,n-1)],a=Math.atan2(h.y-nx.y,h.x-nx.x);
      if(HI&&HI.complete&&HI.naturalWidth){
        var sw=TH*2.6,sh=sw*HI.naturalHeight/HI.naturalWidth;
        /* le visage regarde le visiteur, comme sur l'image : il reste droit, et s'incline un peu du côté où le ver avance */
        c.save();c.translate(h.x,h.y);c.rotate(Math.cos(a)*.32+Math.sin(tNow*6)*.06);
        c.shadowColor='rgba(255,36,48,.85)';c.shadowBlur=TH*.8;
        c.drawImage(HI,-sw/2,-sh+TH*.95,sw,sh);
        c.restore();
      }else{
        var hr=r0*1.28;
        c.save();c.translate(h.x,h.y);c.rotate(a);
        c.fillStyle='#d8979a';c.beginPath();c.ellipse(1,0,hr*1.18,hr,0,0,TAU);c.fill();
        c.fillStyle='#3a0a10';c.beginPath();c.ellipse(hr*.82,0,hr*.42,hr*.5,0,0,TAU);c.fill();
        c.restore();
      }
    }
  }

  /* ---------- la dame-jeanne : le ver entre par le goulot, le contenu tourne au sang, il y nage ; brisée, tout se vide dans le fluide vert ---------- */
  function fx(){return window.PutrideFx||null;}
  function jarLue(){var f=fx();return f&&f.cro&&!f.cro.gone?f.cro:null;}
  function jarLibre(hb,W,H){
    var o=jarLue();
    if(!o||o.sc<.9||o.held||o.ret||o.plong||o.vin||o.vcasse||!fx().dep)return null;
    if(o.x<o.r+4||o.x>W-o.r-4||o.y<hb+o.h*.55||o.y>H-o.h*.55)return null;
    return o;
  }
  /* repère du verre (unités de 1/100e de sa hauteur) vers l'écran */
  function jp(o,lx,ly){var k=o.h/100*o.sc,c=Math.cos(o.rot),s=Math.sin(o.rot);return [o.x+(lx*c-ly*s)*k,o.y+(lx*s+ly*c)*k];}

  /* ---------- l'apparition ---------- */
  function passe(){
    if(run||document.hidden||calm)return;
    charge();
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),s=W<900?.72:1,TH=16*s,sp=4.6*s,hdr=document.querySelector('header'),hb=hdr?hdr.getBoundingClientRect().bottom:0;
    var jo=jarLibre(hb,W,H),mode=(jo&&(force==='jar'||(force!=='bap'&&Math.random()<.5)))?'jar':'bap';force='';
    if(mode==='bap'&&!pret()){BI.addEventListener('load',function(){if(!run&&on)passe();},{once:true});return;}
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
    var R0=cir?clamp(Math.max(cir.r*1.15,60*s),60*s,108*s):76*s;
    var fallback=cir?null:{x:rnd(W*.3,W*.7),y:rnd(hb+R0+30,Math.max(hb+R0+31,H-R0-30))};
    function centre(){
      if(cir){
        var b=cir.el.getBoundingClientRect();
        return {x:clamp(b.left+b.width/2,R0+6,W-R0-6),y:clamp(b.top+b.height/2,R0*.96+6,H-R0*.96-6)};
      }
      return fallback;
    }
    function ln(k){var q=ls[k],dy=sy0-scrollY,dx=sx0-scrollX;return {l:q.l+dx,t:q.t+dy,w:q.w,h:q.h};}
    var side=Math.random()<.5?-1:1,hx=side<0?-30*s:W+30*s,hy=rnd(hb+50,H-60),th=side<0?0:Math.PI,L=200*s,pts=[{x:hx,y:hy,b:0,ln:-1}],last={x:hx,y:hy};
    var ph='in',pt=0,t=0,li=0,u=0,dir=1,uMax=0,x0=0,A=0,lam=64*s,ang=0,trav=0,rr=0,rip=[],drops=[],rippled=0,clipsL=[],bform=0,open=0,blood=0,film=0,sc=1,balpha=0,splashed=false,lastT=performance.now();
    var R={cv:cv,raf:0,ph:function(){return ph;},mode:function(){return mode;},dbg:function(){return {hx:hx,hy:hy,L:L,TH:TH,n:pts.length,al:alpha,tg:ftg,Lin:Lin};}};run=R;

    /* --- dans la dame-jeanne : le ver dans le repère du verre --- */
    var J=null,yl=-66,ipts=[],ihx=0,ihy=0,ith=Math.PI/2,Lin=0,iT={x:0,y:20,t:0},swimEnd=0,vx=0,vy=0,ftg=null,fat=0,alpha=1;
    var THI=8.4,SPI=2.6,LINMAX=100,ISP=54;
    function ipush(){var d=ipts.length?Math.hypot(ihx-ipts[ipts.length-1].x,ihy-ipts[ipts.length-1].y):9;if(d>=.8){ipts.push({x:ihx,y:ihy,b:0,ln:-1});if(ipts.length>420)ipts.splice(0,150);}}
    function inner(dt){
      var dx,dy,da,want,ex,ey,d;
      iT.t-=dt;
      if(iT.t<=0||Math.hypot(iT.x-ihx,iT.y-ihy)<4){iT={x:rnd(-17,17),y:rnd(6,40),t:rnd(.8,1.7)};}
      dx=iT.x-ihx;dy=iT.y-ihy;want=Math.atan2(dy,dx);da=want-ith;
      while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;
      ith+=clamp(da,-5*dt,5*dt)+Math.sin(t*5.1)*dt*2.2;
      ihx+=Math.cos(ith)*ISP*dt;ihy+=Math.sin(ith)*ISP*dt;
      ex=ihx/21;ey=(ihy-24)/20;d=Math.hypot(ex,ey);
      if(d>1){ihx=ex/d*21;ihy=24+ey/d*20;ith+=clamp(Math.atan2(24-ihy,-ihx)-ith,-1,1)*.35;}
      ipush();
    }
    function accroche(o){
      J=o;
      o.vbT=0;o.vcasse=spill;
      o.vin=function(cx,tt){
        if(!Lin)return;
        cx.save();cx.rotate(o.rot-o.sl);cx.translate(0,-14);
        dessineVer(cx,ipts,ihx,ihy,Lin,THI,SPI,[],tt);
        cx.restore();
      };
      /* le bouchon saute (la dame-jeanne le lit dès qu'elle porte le ver) */
      o.ckv+=70;
    }
    function lache(){
      var o=J;if(!o)return;
      if(o.vin)o.vin=null;if(o.vcasse===spill)o.vcasse=null;o.vbT=0;J=null;
    }
    /* la dame-jeanne se brise : le sang jaillit, le ver tombe avec lui */
    function spill(info){
      var f=fx(),k=info.h/100*info.sc,cs=Math.cos(info.rot),sn=Math.sin(info.rot),n=ipts.length,i2,j,p0;
      var map=function(q){return [info.x+(q.x*cs-q.y*sn)*k,info.y+(q.x*sn+q.y*cs)*k];};
      pts=[];
      for(i2=0;i2<n;i2++){p0=map(ipts[i2]);pts.push({x:p0[0],y:p0[1],b:0,ln:-1});}
      p0=map({x:ihx,y:ihy});hx=p0[0];hy=p0[1];
      if(pts.length>1){var q1=pts[pts.length-1],q2=pts[Math.max(0,pts.length-4)];th=Math.atan2(q1.y-q2.y,q1.x-q2.x);}
      pts.push({x:hx,y:hy,b:0,ln:-1});last={x:hx,y:hy};
      L=Math.max(20,Lin*k);TH=THI*k;sp=SPI*k;vx=(info.vx||0)*.4;vy=-80;
      J=null;ph='fall';pt=0;alpha=1;
      if(f){
        f.spray(info.x,info.y+info.h*.35,f.LOW?20:30,1.3,['#7a0010','#c10a22','#e3112b','#ff4a5a']);
        for(j=0;j<(f.LOW?22:36)&&f.drops.length<110;j++)f.drops.push({x:info.x+rnd(-.28,.28)*info.h,y:info.y+info.h*.32+rnd(0,.12)*info.h,vx:rnd(-70,70),vy:rnd(30,280),r:rnd(1.8,3.8),l:3,c:['#7a0010','#a30019','#c80a22','#e3112b'][(Math.random()*4)|0],f:'b'});
        f.red(.14);
      }
    }
    function sortie(){lache();fin();}

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
      var b=0,lk=-1,cc=centre(),e,a,o=null,f=fx(),kk=1,clipJ=null;
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
        o=mode==='jar'?jarLue():null;
        if(mode==='jar'&&(!o||o.held||o.ret||o.plong||o.vin||o.vcasse))mode='bap';
        if(mode==='jar'){
          var tp=jp(o,0,-66);
          e=steer(tp[0],tp[1],560*s,dt,.4);
          if(e<16*s){ph='enter';pt=0;yl=-66;accroche(o);}
        }else{
          a=Math.atan2(hy-cc.y,hx-cc.x);
          e=steer(cc.x+Math.cos(a)*R0*.88,cc.y+Math.sin(a)*R0*.88,560*s,dt,.4);
          balpha=Math.max(balpha,smooth(pt/1.1)*.35);sc=.8+.2*smooth(pt/1.1);
          if(e<14*s){ph='ring';pt=0;ang=Math.atan2(hy-cc.y,hx-cc.x);trav=0;dir=Math.random()<.5?1:-1;rr=R0*.88;}
        }
      }else if(ph==='enter'){
        o=J;
        if(!o||o.gone){sortie();return;}
        kk=o.h/100*o.sc;
        var vv=230*s;
        if(yl<-6){
          yl=Math.min(-6,yl+vv/kk*dt);
          var pj=jp(o,0,yl);hx=pj[0];hy=pj[1];th=o.rot+Math.PI/2;
          if(yl>-47){ihx=0;ihy=yl;ith=Math.PI/2;ipush();Lin=Math.min(LINMAX,Lin+vv/kk*dt);}
        }else{
          var pj2=jp(o,0,-6);hx=pj2[0];hy=pj2[1];
          Lin=Math.min(LINMAX,Lin+vv/kk*dt*.6);inner(dt);
        }
        if(yl>-47)L=Math.max(0,L-vv*dt);
        o.vbT=clamp((yl+47)/30,0,1);
        if(L<=2&&yl>=-6){ph='swim';pt=0;swimEnd=rnd(26,40);}
      }else if(ph==='swim'){
        o=J;
        if(!o||o.gone){sortie();return;}
        o.vbT=1;inner(dt);Lin=Math.min(LINMAX,Lin+dt*18);
        if(pt>swimEnd)ph='leave';
      }else if(ph==='leave'){
        o=J;
        if(!o||o.gone){sortie();return;}
        o.vbT=0;inner(dt);Lin=Math.max(0,Lin-70*dt);
        if(Lin<=1){sortie();return;}
      }else if(ph==='fall'){
        var gs=f&&f.sim?f.sim():null,gx=gs?gs.gx:0,gy=gs?gs.gy:1;
        vx+=gx*1500*dt;vy+=gy*1500*dt;vx*=1-.4*dt;
        hx+=vx*dt;hy+=vy*dt;th+=(Math.atan2(vy,vx)-th)*Math.min(1,dt*8);
        var floorY=f?Math.min(H-10,f.ext.fl-6):H;
        if(f&&f.niv>2&&(f.dep(hx,hy)>4||(hy>=floorY&&f.niv>3))){
          hy=Math.min(hy,floorY);
          var spd=Math.hypot(vx,vy);
          f.wave(hx,clamp(spd*.006,2,11),hy);f.spray(hx,hy,12,1,['#e8fff4','#c11830','#7dd6a2']);plouf();
          vx*=.25;vy*=.25;ph='fswim';pt=0;ftg=null;fat=0;
        }else if(hy>H+80||hx<-80||hx>W+80||pt>4.5){ph='fade';pt=0;}
      }else if(ph==='fswim'){
        fat-=dt;
        if(f&&f.dep){
          if(!ftg||fat<=0||f.dep(ftg[0],ftg[1])<Math.min(14,f.niv*.2)){
            var ps=f.parts(),bp=null,tries=0,pp;
            while(ps.length&&tries++<14){pp=ps[(Math.random()*ps.length)|0];if(pp[1]<H-16&&pp[0]>12&&pp[0]<W-12&&f.dep(pp[0],pp[1])>Math.min(18,f.niv*.3)&&(!bp||Math.random()<.4))bp=pp;}
            ftg=bp;fat=rnd(.9,1.9);
          }
          if(ftg)steer(ftg[0],ftg[1],150*s,dt,2.6);
          else{hx+=vx*dt;hy+=vy*dt;}
          hx=clamp(hx,10,W-10);hy=Math.min(hy,Math.min(H-10,f.ext.fl-6));
          f.stir(hx,hy,Math.cos(th)*150,Math.sin(th)*150,1.1);
          f.red(dt*.012);
          if(f.bubs.length<30&&Math.random()<dt*7)f.bubs.push({x:hx+rnd(-6,6),y:hy+rnd(-4,4),r:rnd(1.6,3.2),vy:rnd(25,50),ph:rnd(0,6)});
        }
        if(pt>9.5||!f||(f.niv<1.5&&pt>1)){ph='fade';pt=0;}
      }else if(ph==='fade'){
        alpha=1-smooth(pt/1.1);
        if(pt>1.1){fin();return;}
      }else if(ph==='ring'){
        var w=520*s/rr;ang+=dir*w*dt;trav+=w*dt;
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr*.96;th=ang+dir*Math.PI/2;
        var Lt=TAU*rr*1.02+10;L+=(Lt-L)*Math.min(1,dt*4);
        bform=smooth(trav/(TAU*.95));balpha=Math.max(balpha,bform);sc=1;blood=0;
        if(trav>=TAU*1.12){ph='open';pt=0;}
      }else if(ph==='open'){
        var w2=520*s/rr;ang+=dir*w2*dt;rr=R0*.88*(1-.3*smooth(pt/.9));
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr*.96;th=ang+dir*Math.PI/2;
        open=smooth(pt/.6);blood=smooth(pt/.5);balpha=1;
        if(pt>.9){ph='dive';pt=0;}
      }else if(ph==='dive'){
        var kd=smooth(pt/1.05);rr=R0*.62*(1-kd);ang+=dir*Math.min(11,520*s/Math.max(rr,14*s))*dt;
        hx=cc.x+Math.cos(ang)*rr;hy=cc.y+Math.sin(ang)*rr*.96;th=ang+dir*Math.PI/2;
        film=smooth(pt/.7)*.5;
        if(pt>.25)L=Math.max(0,L-(TAU*R0*.88)*.62*dt*1.5);
        if(Math.random()<dt*14)rip.push(0);
        if(L<=3||pt>1.9){ph='splash';pt=0;plouf();}
      }else if(ph==='splash'){
        if(!splashed){splashed=true;for(i=0;i<30;i++){var aa=rnd(0,TAU),vvv=rnd(120,520)*s;drops.push({x:cc.x+Math.cos(aa)*R0*.1,y:cc.y,vx:Math.cos(aa)*vvv*.6,vy:-rnd(260,640)*s,r:rnd(1.8,4.6)*s,l:rnd(.6,1.1)});}rip.push(0,-.2,-.4);}
        open=1-smooth((pt-.15)/.5);film=Math.max(0,film-dt*1.6);
        if(pt>.8){balpha=1-smooth((pt-.8)/.5);sc=1-.12*smooth((pt-.8)/.5);}
        if(pt>1.4){fin();return;}
      }
      if(ph!=='splash'&&ph!=='swim'&&ph!=='leave'&&ph!=='fade'&&ph!=='fswim')push(b,lk);
      else if(ph==='fswim')push(0,-1);
      /* dessin */
      c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
      for(i=rip.length-1;i>=0;i--){rip[i]+=dt*.9;if(rip[i]>1)rip.splice(i,1);}
      var rp=rip.filter(function(v){return v>=0;});
      var cx2=cc.x,cy2=cc.y;
      if(mode==='bap'&&(ph==='flee'||ph==='ring'||ph==='open'||ph==='dive'||ph==='splash'))bapt(c,cx2,cy2,R0,balpha,sc,ph==='ring'||ph==='flee'?0:open,blood,t,rp);
      /* les rectangles de lignes sont recalculés à chaque image (ils suivent la page qui défile) */
      var cl=[];for(i=0;i<ls.length;i++)cl.push(ln(i));
      if(L>3&&ph!=='splash'&&ph!=='swim'&&ph!=='leave'){
        c.save();
        if(ph==='enter'&&J){
          /* la part du ver déjà dans le goulot est cachée : elle est dessinée dans le verre */
          o=J;clipJ=new Path2D();clipJ.rect(-5,-5,1e5,1e5);
          var z=[jp(o,-70,-47),jp(o,70,-47),jp(o,70,90),jp(o,-70,90)];
          clipJ.moveTo(z[0][0],z[0][1]);clipJ.lineTo(z[1][0],z[1][1]);clipJ.lineTo(z[2][0],z[2][1]);clipJ.lineTo(z[3][0],z[3][1]);clipJ.closePath();
          c.clip(clipJ,'evenodd');
        }
        if(alpha<1)c.globalAlpha=Math.max(0,alpha);
        dessineVer(c,pts,hx,hy,L,TH,sp,(ph==='fall'||ph==='fswim'||ph==='fade'||ph==='enter')?[]:cl,t);
        if(ph==='fswim'||ph==='fade'){c.globalCompositeOperation='source-atop';c.fillStyle='rgba(70,8,26,.34)';c.fillRect(0,0,W,H);}
        c.restore();
      }
      if(film>0.01&&mode==='bap'&&pret()){
        var kb=R0/214;
        c.save();c.beginPath();c.ellipse(cx2,cy2,190*kb*.97,188*kb*.97,0,0,TAU);c.clip();c.globalAlpha=film;
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
  function fin(){
    if(!run)return;
    cancelAnimationFrame(run.raf);run.cv.remove();run=null;
    var o=jarLue();if(o){if(o.vcasse&&o.vcasse.name==='spill')o.vcasse=null;o.vin=null;o.vbT=0;}
  }

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
    charge();stopFx();on=true;if(!vues)plan(rnd(22000,45000));else plan(rnd(30000,70000));
  }
  function stopFx(){clearTimeout(timer);fin();}
  function stop(){on=false;stopFx();}
  window.Ver={go:go,stop:stop,show:function(m){on=true;fin();force=m||'';passe();},actif:function(){return !!run;},phase:function(){return run?run.ph():'';},mode:function(){return run?run.mode():'';},dbg:function(){return run?run.dbg():null;}};
})();
