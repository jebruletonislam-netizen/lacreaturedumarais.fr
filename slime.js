/* Passages entre le site normal et le mode putride.
   Descente (data-slime="down") : depuis la bouche d'égout, tout l'écran plonge dans le tuyau ; le mode putride apparaît
   au fond, puis le tuyau s'élargit et crache le point de vue.
   Remontée (data-slime="up") : un clystère aspire l'écran par son trou, noir, puis la page est recrachée comme par un canon,
   floue et secouée.
   Cachot (data-slime="cachot" / "cachot-up") : chute dans le puits du cachot, noir puis lueur de torche ; la remontée va vers une lumière blanche. */
(function(){
  'use strict';
  var KEY='lcm-slime',busy=false,TAU=6.283185307,Z=99999;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var eOut=function(t){return 1-Math.pow(1-t,3);};
  var eIO=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  var smooth=function(t){t=clamp(t,0,1);return t*t*(3-2*t);};
  var VERT='#8fd61f',VERT_OMBRE='#4f9a17',VERT_CLAIR='#d6ff86',VERT_TRAIT='#2c6a0c',REFLET='#f4ffd9';
  var BRUN='#8a5524',BRUN_OMBRE='#5a3311',BRUN_CLAIR='#c98d4c',BRUN_TRAIT='#2a1405';
  var OUT='#101516';

  /* Crotte de dessin animé : trois étages et une pointe. Origine au milieu de la base ; s = largeur de la base. */
  function crotte(c,x,y,s,rot){
    c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s/28,s/28);
    c.lineJoin='round';c.lineCap='round';c.lineWidth=2.2;c.strokeStyle=BRUN_TRAIT;
    var pointe=new Path2D();
    pointe.moveTo(-5,-26);pointe.bezierCurveTo(-4,-33,3,-32,7,-37);pointe.bezierCurveTo(7,-31,5,-27,4,-25);pointe.closePath();
    c.fillStyle=BRUN;c.fill(pointe);c.stroke(pointe);
    [[0,-23.5,7.5,5],[0,-15.5,11,6],[0,-6.5,14,6.8]].forEach(function(e){
      var p=new Path2D();p.ellipse(e[0],e[1],e[2],e[3],0,0,TAU);
      c.fillStyle=BRUN_OMBRE;c.fill(p);
      c.save();c.clip(p);
      c.fillStyle=BRUN;c.beginPath();c.ellipse(e[0]-e[2]*.12,e[1]-e[3]*.2,e[2]*.92,e[3]*.78,0,0,TAU);c.fill();
      c.fillStyle=BRUN_CLAIR;c.beginPath();c.ellipse(e[0]-e[2]*.45,e[1]-e[3]*.4,e[2]*.34,e[3]*.26,-.35,0,TAU);c.fill();
      c.restore();c.stroke(p);
    });
    c.restore();
  }

  function mkCanvas(){
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(2.6e6/(W*H)));
    var cv=document.createElement('canvas');cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    cv.setAttribute('aria-hidden','true');cv._lcm=true;
    cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:'+Z+';pointer-events:auto';
    document.documentElement.appendChild(cv);
    var c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
    return {cv:cv,c:c,W:W,H:H};
  }
  function loop(dur,draw){
    return new Promise(function(res,rej){
      var t0=null,last=0;
      (function f(now){
        if(t0===null){t0=now;last=now;}
        var t=clamp((now-t0)/1000,0,dur),dt=clamp((now-last)/1000,0,.06);last=now;
        try{draw(t,dt);}catch(error){rej(error);return;}
        if(t<dur)requestAnimationFrame(f);else res();
      })(performance.now());
    });
  }
  function mix(a,b,f){return 'rgb('+((a[0]+(b[0]-a[0])*f)|0)+','+((a[1]+(b[1]-a[1])*f)|0)+','+((a[2]+(b[2]-a[2])*f)|0)+')';}

  /* ---------- le tuyau de fluide vert (vue de l'intérieur, on y tombe) ---------- */
  var TA=[79,154,23],TB=[112,192,38],TN=[0,8,0],TJ=[20,62,10];
  function tuyau(c,W,H,cx,cy,sc,roll,disc,t,opts){
    opts=opts||{};
    var R=Math.hypot(W,H)*(.55+(opts.grow||0)),N=opts.count||17,fr=sc-Math.floor(sc),id0=Math.floor(sc),k,i;
    if(!opts.transparent){c.fillStyle='#000';c.fillRect(0,0,W,H);}
    for(k=1;k<=N;k++){
      var z=Math.max(.18,k-fr),zi=Math.max(.18,k+1-fr),r=R/z,ri=R/zi,f=Math.exp(-(z-1)/6);
      c.fillStyle=mix(((k+id0)&1)?TA:TB,TN,1-f);
      c.beginPath();c.arc(cx,cy,r,0,TAU);c.arc(cx,cy,ri,TAU,0,true);c.fill('evenodd');
      c.lineWidth=Math.max(1,r*.05);c.strokeStyle=mix(TJ,[0,0,0],1-f);c.stroke();
      c.lineWidth=Math.max(1,r*.018);c.strokeStyle='rgba(214,255,134,'+(.5*f).toFixed(2)+')';
      c.beginPath();c.arc(cx,cy,r*.93,0,TAU);c.stroke();
    }
    /* filets de fluide qui s'écoulent le long des parois */
    c.lineCap='round';
    for(i=0;!opts.noParticles&&i<18;i++){
      var a=i/18*TAU+roll;
      c.beginPath();
      for(k=0;k<=8;k++){
        var rr=R*(.05+1.45*Math.pow(k/8,2)),aa=a+Math.sin(rr*.012+t*1.6+i*1.7)*.045;
        var x=cx+Math.cos(aa)*rr,y=cy+Math.sin(aa)*rr;
        if(k)c.lineTo(x,y);else c.moveTo(x,y);
      }
      c.lineWidth=(i%3?R*.006:R*.014)+1;c.strokeStyle='rgba(214,255,134,'+(i%3?.18:.14)+')';c.stroke();
    }
    /* bulles */
    for(i=0;!opts.noParticles&&i<22;i++){
      var zj=1+(((i*.731-sc*1.15)%(N-1))+(N-1))%(N-1),aj=i*2.399+roll,rj=R/zj,sj=Math.max(1.5,R*.022/zj);
      var bx=cx+Math.cos(aj)*rj,by=cy+Math.sin(aj)*rj,al=(.55*Math.exp(-(zj-1)/7)).toFixed(2);
      c.lineWidth=Math.max(1,sj*.22);c.strokeStyle='rgba(214,255,134,'+al+')';
      c.beginPath();c.arc(bx,by,sj,0,TAU);c.stroke();
      c.fillStyle='rgba(244,255,217,'+al+')';c.beginPath();c.arc(bx-sj*.35,by-sj*.35,sj*.22,0,TAU);c.fill();
    }
    if(!opts.transparent){
      var g=c.createRadialGradient(cx,cy,0,cx,cy,R*.42);
      g.addColorStop(0,'rgba(0,0,0,.96)');g.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=g;c.fillRect(0,0,W,H);
    }
    /* crottes emportées par le courant */
    for(i=0;!opts.noParticles&&i<5;i++){
      var zc=.45+(((i*3.4-sc*.9)%(N-3))+(N-3))%(N-3),ac=i*1.9+roll*1.2,rc=R*.8/zc;
      if(rc>R*3)continue;
      var s=R*.15/zc;
      c.globalAlpha=clamp(Math.exp(-(zc-1)/5),0,1);
      crotte(c,cx+Math.cos(ac)*rc,cy+Math.sin(ac)*rc,s,t*3+i);
      c.globalAlpha=1;
    }
    if(disc>0){c.fillStyle='#000';c.beginPath();c.arc(cx,cy,disc,0,TAU);c.fill();}
  }

  var DOWN=2.5;
  function coverDown(a){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,rc=a.getBoundingClientRect(),mx=rc.left+rc.width/2,my=rc.top+rc.height*.62;
    var maxd=Math.max(Math.hypot(mx,my),Math.hypot(W-mx,my),Math.hypot(mx,H-my),Math.hypot(W-mx,H-my))*1.05,R=Math.hypot(W,H)*.55,sc=0;
    return loop(DOWN,function(t,dt){
      var u=clamp(t/.65,0,1),e=eIO(u),rad=lerp(Math.max(8,rc.width*.3),maxd,e),vx=lerp(mx,W/2,e),vy=lerp(my,H/2,e);
      sc+=dt*(3+20*Math.pow(t/DOWN,2));
      var q=clamp((t-1.45)/(DOWN-1.45),0,1),d=R*(.045+.16*q*q);
      c.clearRect(0,0,W,H);
      c.save();c.beginPath();c.arc(vx,vy,rad,0,TAU);c.clip();
      tuyau(c,W,H,vx,vy,sc,t*.5+Math.sin(t*1.3)*.15,d,t);
      c.restore();
      if(u<1){
        c.lineJoin='round';c.lineWidth=9;c.strokeStyle=VERT_TRAIT;c.beginPath();c.arc(vx,vy,rad,0,TAU);c.stroke();
        c.lineWidth=4;c.strokeStyle=VERT;c.stroke();
      }
    }).then(function(){return o;});
  }
  function revealDown(){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,sc=7,D=2.85,de=document.documentElement,body=document.body;
    var oldOverflow=de.style.overflow,oldTransform=body.style.transform,oldOrigin=body.style.transformOrigin,oldWill=body.style.willChange;
    var drops=[],shots=[],i;
    for(i=0;i<32;i++)drops.push({a:rnd(0,TAU),s:rnd(.45,1.2),r:rnd(.005,.014),d:rnd(0,.18)});
    for(i=0;i<4;i++)shots.push({a:rnd(0,TAU),s:rnd(.65,1.15),r:rnd(-3,3)});
    de.classList.remove('slx');de.classList.add('slv');de.style.overflow='hidden';
    body.style.transformOrigin='50% 50vh';body.style.willChange='transform';
    function restore(){
      o.cv.remove();de.classList.remove('slv');de.style.overflow=oldOverflow;
      body.style.transform=oldTransform;body.style.transformOrigin=oldOrigin;body.style.willChange=oldWill;
    }
    return loop(D,function(t,dt){
      var q=eOut(clamp(t/2.15,0,1)),grow=4.5*q,count=Math.max(1,Math.round(17-16*q));
      var R=Math.hypot(W,H)*(.55+grow),d=R*.27*Math.pow(1-q,1.7);
      sc+=dt*(5+13*q);
      c.clearRect(0,0,W,H);
      tuyau(c,W,H,W/2,H/2,sc,t*.35+3,d,t+3,{transparent:true,count:count,grow:grow,noParticles:q>.62});
      body.style.transform='scale('+lerp(.02,1,q).toFixed(4)+')';
      var spit=clamp((t-2.05)/.8,0,1),fade=1-smooth((t-2.68)/.17);
      if(spit>0){
        c.globalAlpha=fade;
        drops.forEach(function(a){
          var p=clamp(spit-a.d,0,1),r=eOut(p)*Math.hypot(W,H)*.62*a.s,x=W/2+Math.cos(a.a)*r,y=H/2+Math.sin(a.a)*r,s=Math.hypot(W,H)*a.r*(.45+p*1.6);
          c.fillStyle=VERT;c.beginPath();c.ellipse(x,y,s,s*(1.3+.8*p),a.a,0,TAU);c.fill();
          c.fillStyle=REFLET;c.beginPath();c.arc(x-s*.3,y-s*.35,s*.22,0,TAU);c.fill();
        });
        shots.forEach(function(a){
          var p=clamp(spit-a.d,0,1);
          if(p>0)crotte(c,W/2+Math.cos(a.a)*eOut(p)*Math.hypot(W,H)*.6*a.s,H/2+Math.sin(a.a)*eOut(p)*Math.hypot(W,H)*.6*a.s,lerp(Math.min(W,H)*.07,Math.min(W,H)*.18,p),a.r+a.a);
        });
        c.globalAlpha=1;
      }
    }).then(restore,function(error){restore();throw error;});
  }

  /* ---------- le clystère ---------- */
  function ell(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);}
  function clystere(c,t,wob){
    var lw=.032,i,g;
    c.lineJoin='round';c.lineCap='round';c.lineWidth=lw;c.strokeStyle=OUT;
    /* l'arrière du corps, en perspective : piston, collerette à ailettes, long cylindre qui s'éloigne */
    var bx=-.95,by=-.78,rB=.6,th=Math.atan2(by,bx),ph=Math.acos((1-rB)/Math.hypot(bx,by)),px=bx*1.6,py=by*1.6;
    c.beginPath();c.moveTo(bx,by);c.lineTo(px,py);c.lineWidth=.11;c.strokeStyle=OUT;c.stroke();c.lineWidth=.06;c.strokeStyle='#cbd0d1';c.stroke();
    c.lineWidth=lw;c.strokeStyle=OUT;
    c.save();c.translate(px,py);c.rotate(th);ell(c,0,0,.12,.36);c.fillStyle='#cbd0d1';c.fill();c.stroke();c.restore();
    c.save();c.translate(bx,by);c.rotate(th);
    g=c.createLinearGradient(0,-1,0,1);g.addColorStop(0,'#555d61');g.addColorStop(.5,'#eef2f2');g.addColorStop(1,'#555d61');
    ell(c,0,0,.13,1.02);c.fillStyle=g;c.fill();c.stroke();c.restore();
    ell(c,bx,by,rB,rB);c.fillStyle='#303537';c.fill();c.stroke();
    var sa=th+ph,sb=th-ph,nx=-Math.sin(th),ny=Math.cos(th);
    g=c.createLinearGradient(nx,ny,-nx,-ny);g.addColorStop(0,'#353a3d');g.addColorStop(.35,'#e1e4e6');g.addColorStop(.7,'#a6adaf');g.addColorStop(1,'#353a3d');
    c.beginPath();c.moveTo(Math.cos(sa),Math.sin(sa));c.lineTo(bx+rB*Math.cos(sa),by+rB*Math.sin(sa));c.lineTo(bx+rB*Math.cos(sb),by+rB*Math.sin(sb));c.lineTo(Math.cos(sb),Math.sin(sb));c.closePath();c.fillStyle=g;c.fill();
    c.beginPath();c.moveTo(Math.cos(sa),Math.sin(sa));c.lineTo(bx+rB*Math.cos(sa),by+rB*Math.sin(sa));c.moveTo(Math.cos(sb),Math.sin(sb));c.lineTo(bx+rB*Math.cos(sb),by+rB*Math.sin(sb));c.stroke();
    c.strokeStyle='rgba(42,20,5,.55)';c.lineWidth=.02;
    [.2,.4,.6,.8].forEach(function(s){ell(c,bx*s,by*s,1+(rB-1)*s,1+(rB-1)*s);c.stroke();});
    c.strokeStyle=OUT;c.lineWidth=lw;
    /* le cylindre vu de face : bague de laiton et graduations */
    g=c.createRadialGradient(-.3,-.3,.1,0,0,1.05);g.addColorStop(0,'#f1f4f4');g.addColorStop(.7,'#a6adaf');g.addColorStop(1,'#2b3032');
    ell(c,0,0,1.02,1.02);c.fillStyle=g;c.fill();c.stroke();
    c.strokeStyle='rgba(42,20,5,.75)';c.lineWidth=.014;
    for(i=0;i<48;i++){var a=i/48*TAU,r1=.9,r2=i%4?.95:.98;c.beginPath();c.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);c.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);c.stroke();}
    c.strokeStyle=OUT;c.lineWidth=lw;
    /* le liquide dans le cylindre */
    ell(c,0,0,.86,.86);c.fillStyle='#13320a';c.fill();c.stroke();
    c.beginPath();
    for(i=0;i<=72;i++){var b=i/72*TAU,rr=.82+Math.sin(b*5+wob)*.014;c.lineTo(Math.cos(b)*rr,Math.sin(b)*rr);}
    c.closePath();c.fillStyle=VERT;c.fill();
    c.lineWidth=.05;c.strokeStyle=VERT_CLAIR;c.beginPath();c.arc(0,0,.7,Math.PI*1.05,Math.PI*1.4);c.stroke();
    c.lineWidth=lw;c.strokeStyle=OUT;
    /* le cône : gradins de laiton jusqu'au bec */
    var steps=[[.64,'#e8ebec'],[.54,'#aeb4b6'],[.45,'#7d8588'],[.37,'#4a5053']];
    steps.forEach(function(s){ell(c,0,0,s[0],s[0]);c.fillStyle=s[1];c.fill();c.stroke();});
    c.lineWidth=.03;c.strokeStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(0,0,.59,Math.PI*1.1,Math.PI*1.45);c.stroke();
    c.lineWidth=lw;c.strokeStyle=OUT;
    /* le trou, qui respire */
    var hr=.2*(1+.07*Math.sin(t*7));
    ell(c,0,0,.31,.31);c.fillStyle='#9ba2a4';c.fill();c.stroke();
    g=c.createRadialGradient(0,0,0,0,0,hr);g.addColorStop(0,'#000');g.addColorStop(.7,'#000');g.addColorStop(1,'#0c2406');
    ell(c,0,0,hr,hr);c.fillStyle=g;c.fill();c.stroke();
    c.fillStyle=VERT_CLAIR;c.beginPath();c.arc(-hr*.42,-hr*.45,hr*.12,0,TAU);c.fill();
  }
  var SPK=[];for(var q=0;q<80;q++)SPK.push({a:rnd(0,TAU),p:Math.random(),s:rnd(.7,1.4),l:rnd(.06,.16)});
  var CRO=[];for(q=0;q<9;q++)CRO.push({a:rnd(0,TAU),p:Math.random(),s:rnd(.5,.9),k:rnd(.6,1.1)});
  var UP=2.15;
  function coverUp(){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,cx=W/2,cy=H/2,u=Math.min(W*.24,H*.26),hypot=Math.hypot(W,H),Rm=hypot*.55;
    var zmax=(hypot*.62)/(.2*u)*1.08;
    return loop(UP,function(t){
      var inT=clamp(t/.3,0,1),sc=lerp(.72,1,eOut(inT)),zoom=1;
      if(t>1.2){var q2=clamp((t-1.2)/(UP-1.2),0,1);zoom=1+(zmax-1)*q2*q2*q2;}
      c.setTransform(o.cv.width/W,0,0,o.cv.height/H,0,0);
      c.clearRect(0,0,W,H);
      c.fillStyle='rgba(0,0,0,'+inT.toFixed(3)+')';c.fillRect(0,0,W,H);
      /* anneaux qui se resserrent vers le trou */
      c.lineWidth=3;
      for(var k=0;k<4;k++){
        var ph=(t*.9+k/4)%1;c.strokeStyle='rgba(143,214,31,'+(.5*(1-ph)*inT).toFixed(2)+')';
        c.beginPath();c.arc(cx,cy,Rm*(1-ph)*.95+u*.2,0,TAU);c.stroke();
      }
      /* traînées aspirées */
      c.lineCap='round';
      SPK.forEach(function(s){
        var ph=Math.pow((t*s.s*.9+s.p)%1,1.5),r=lerp(Rm*1.05,u*.2*zoom,ph),l=r*s.l*(1+t);
        c.strokeStyle='rgba(214,255,134,'+(.55*inT*(1-ph*.5)).toFixed(2)+')';c.lineWidth=1+3*(1-ph);
        c.beginPath();c.moveTo(cx+Math.cos(s.a)*r,cy+Math.sin(s.a)*r);c.lineTo(cx+Math.cos(s.a)*(r+l),cy+Math.sin(s.a)*(r+l));c.stroke();
      });
      c.save();c.translate(cx,cy);c.scale(u*sc*zoom,u*sc*zoom);
      c.globalAlpha=inT;
      clystere(c,t,t*6);
      c.restore();
      /* les crottes entraînées dans la spirale */
      if(t<1.7)CRO.forEach(function(s){
        var ph=((t*s.k*.55+s.p)%1),r=lerp(Rm*.9,u*.25,Math.pow(ph,1.2)),a=s.a+ph*5;
        c.globalAlpha=Math.min(1,inT)*(1-smooth((t-1.35)/.35));
        crotte(c,cx+Math.cos(a)*r,cy+Math.sin(a)*r,lerp(u*.34,u*.07,ph)*s.s*1.6,a*2+t*3);c.globalAlpha=1;
      });
      if(t>=UP){c.fillStyle='#000';c.fillRect(0,0,W,H);}
    }).then(function(){return o;});
  }
  function revealUp(){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,cx=W/2,cy=H/2,hy=Math.hypot(W,H),D=1.8,amp=W<700?9:16,body=document.body,de=document.documentElement,sh=(window.scrollY||0)<5;
    var bl=document.createElement('div');
    bl.style.cssText='position:fixed;inset:0;z-index:'+(Z-1)+';pointer-events:none;-webkit-backdrop-filter:blur(28px);backdrop-filter:blur(28px)';bl._lcm=true;
    de.appendChild(bl);
    var ov=de.style.overflow;if(sh){de.style.overflow='hidden';body.style.transformOrigin='50% '+(H/2)+'px';}
    var sparks=[];for(var i=0;i<40;i++)sparks.push({a:rnd(0,TAU),l:rnd(.12,.4),s:rnd(.7,1.2)});
    var shots=[];for(i=0;i<7;i++)shots.push({a:rnd(0,TAU),s:rnd(.7,1.2),r:rnd(-3,3)});
    return loop(D,function(t){
      var black=t<.14?1:1-eOut(clamp((t-.14)/1.15,0,1));
      de.classList.remove('slx');
      c.clearRect(0,0,W,H);
      c.fillStyle='rgba(0,0,0,'+black.toFixed(3)+')';c.fillRect(0,0,W,H);
      var px=28*(1-eOut(clamp(t/1.6,0,1)));
      bl.style.webkitBackdropFilter=bl.style.backdropFilter='blur('+px.toFixed(1)+'px)';
      if(sh){
        var A=amp*Math.pow(Math.max(0,1-t/1.3),2);
        body.style.transform=t<1.3?'translate('+(A*(Math.sin(t*95)+.6*Math.sin(t*53))).toFixed(1)+'px,'+(A*(Math.cos(t*81)+.5*Math.sin(t*67))).toFixed(1)+'px) rotate('+(A*.07*Math.sin(t*71)).toFixed(2)+'deg)':'';
      }
      /* déflagration : éclair, onde de choc, rayons, projectiles */
      var fl=clamp(1-t/.55,0,1);
      if(fl>0){
        var g=c.createRadialGradient(cx,cy,0,cx,cy,hy*(.18+t*1.6));
        g.addColorStop(0,'rgba(255,244,190,'+(.95*fl*fl).toFixed(2)+')');g.addColorStop(.5,'rgba(214,255,134,'+(.4*fl).toFixed(2)+')');g.addColorStop(1,'rgba(214,255,134,0)');
        c.fillStyle=g;c.fillRect(0,0,W,H);
      }
      var sw=clamp(t/.75,0,1);
      if(sw<1){
        c.lineWidth=2+16*(1-sw);c.strokeStyle='rgba(214,255,134,'+(1-sw).toFixed(2)+')';
        c.beginPath();c.arc(cx,cy,eOut(sw)*hy*.62,0,TAU);c.stroke();
        c.lineCap='round';
        sparks.forEach(function(s){
          var r1=eOut(sw)*hy*.5*s.s,r2=r1+hy*s.l*(1-sw);
          c.lineWidth=1+3*(1-sw);c.strokeStyle='rgba(244,255,217,'+(.8*(1-sw)).toFixed(2)+')';
          c.beginPath();c.moveTo(cx+Math.cos(s.a)*r1,cy+Math.sin(s.a)*r1);c.lineTo(cx+Math.cos(s.a)*r2,cy+Math.sin(s.a)*r2);c.stroke();
        });
      }
      var sp=clamp(t/.95,0,1);
      if(sp<1)shots.forEach(function(s){
        c.globalAlpha=1-smooth((sp-.55)/.45);
        crotte(c,cx+Math.cos(s.a)*eOut(sp)*hy*.6*s.s,cy+Math.sin(s.a)*eOut(sp)*hy*.6*s.s,lerp(u0(),u0()*3.2,sp),s.r*sp+s.a);c.globalAlpha=1;
      });
    }).then(function(){
      o.cv.remove();bl.remove();body.style.transform='';body.style.transformOrigin='';de.style.overflow=ov;
    },function(error){
      o.cv.remove();bl.remove();body.style.transform='';body.style.transformOrigin='';de.style.overflow=ov;
      throw error;
    });
    function u0(){return Math.min(W,H)*.1;}
  }

  /* ---------- le puits du cachot : on tombe dans les cachots (down) ou on remonte vers la lumière (up) ---------- */
  var PIERRE_A=[34,34,34],PIERRE_B=[58,58,58],PIERRE_N=[0,0,0],PIERRE_UP=[120,120,120];
  function puits(c,W,H,cx,cy,sc,up,t){
    var R=Math.hypot(W,H)*.62,N=16,fr=sc-Math.floor(sc),id0=Math.floor(sc),k,i,a;
    c.fillStyle=up?'#2b2b2b':'#000';c.fillRect(0,0,W,H);
    for(k=1;k<=N;k++){
      var z=Math.max(.2,k-fr),zi=Math.max(.2,k+1-fr),r=R/z,ri=R/zi,f=Math.exp(-(z-1)/5.5),odd=(k+id0)&1,seg=14;
      c.fillStyle=mix(odd?PIERRE_A:PIERRE_B,up?PIERRE_UP:PIERRE_N,1-f);
      c.beginPath();c.arc(cx,cy,r,0,TAU);c.arc(cx,cy,ri,TAU,0,true);c.fill('evenodd');
      c.strokeStyle='rgba(12,8,6,'+(.15+.8*f).toFixed(2)+')';c.lineWidth=Math.max(1,r*.012);
      c.beginPath();
      for(i=0;i<seg;i++){a=(i+(odd?.5:0))/seg*TAU;c.moveTo(cx+Math.cos(a)*ri,cy+Math.sin(a)*ri);c.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}
      c.stroke();
      c.lineWidth=Math.max(1.5,r*.03);c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();
      if(((k+id0)&3)===0){
        a=(k+id0)*2.4;
        var rm=(r+ri)/2,tx=cx+Math.cos(a)*rm,ty=cy+Math.sin(a)*rm,tr=Math.max(6,(r-ri)*.9),fl=.75+.25*Math.sin(t*23+k*3.1)*Math.sin(t*11+k);
        var g=c.createRadialGradient(tx,ty,0,tx,ty,tr);
        g.addColorStop(0,'rgba(255,255,255,'+(.95*f*fl).toFixed(2)+')');g.addColorStop(.35,'rgba(255,204,0,'+(.45*f*fl).toFixed(2)+')');g.addColorStop(1,'rgba(225,0,25,0)');
        c.fillStyle=g;c.fillRect(tx-tr,ty-tr,tr*2,tr*2);
      }
    }
    var g2=c.createRadialGradient(cx,cy,0,cx,cy,R*.45);
    if(up){g2.addColorStop(0,'rgba(255,255,255,1)');g2.addColorStop(.5,'rgba(255,255,255,.55)');g2.addColorStop(1,'rgba(255,255,255,0)');}
    else{g2.addColorStop(0,'rgba(0,0,0,1)');g2.addColorStop(.55,'rgba(0,0,0,.85)');g2.addColorStop(1,'rgba(0,0,0,0)');}
    c.fillStyle=g2;c.fillRect(0,0,W,H);
  }
  var FG=2.1;
  function coverCachot(up){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,sc=0;
    return loop(FG,function(t,dt){
      var inT=smooth(t/.45),end=smooth((t-(FG-.4))/.4);
      sc+=dt*(2+14*Math.pow(t/FG,1.6));
      c.clearRect(0,0,W,H);
      c.globalAlpha=inT;
      puits(c,W,H,W/2,H/2,sc,up,t);
      c.globalAlpha=1;
      if(end>0){c.fillStyle=up?'rgba(255,255,255,'+end.toFixed(3)+')':'rgba(0,0,0,'+end.toFixed(3)+')';c.fillRect(0,0,W,H);}
    }).then(function(){return o;});
  }
  function revealCachot(up){
    var o=mkCanvas(),c=o.c,W=o.W,H=o.H,D=up?1.5:2.3,cx=W/2,cy=H/2,hy=Math.hypot(W,H);
    document.documentElement.classList.remove('slx');
    return loop(D,function(t){
      c.clearRect(0,0,W,H);
      if(up){
        c.fillStyle='rgba(255,255,255,'+(1-eOut(clamp(t/1.3,0,1))).toFixed(3)+')';c.fillRect(0,0,W,H);
        return;
      }
      var u=clamp(t/D,0,1),open=eOut(u),vis=1-smooth((u-.55)/.45),fl=.9+.1*Math.sin(t*37)*Math.sin(t*13);
      var g=c.createRadialGradient(cx,cy,0,cx,cy,hy*(.05+.75*open)*fl);
      g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.6,'rgba(0,0,0,'+(.5*vis).toFixed(3)+')');g.addColorStop(1,'rgba(0,0,0,'+vis.toFixed(3)+')');
      c.fillStyle=g;c.fillRect(0,0,W,H);
    }).then(function(){o.cv.remove();});
  }

  function clearAll(){
    var el=document.documentElement;
    el.classList.remove('slx');
    Array.prototype.forEach.call(el.children,function(x){if(x._lcm)x.remove();});
    if(document.body){document.body.style.transform='';document.body.style.transformOrigin='';}
    el.style.overflow='';
  }

  var arriving=null;
  try{arriving=sessionStorage.getItem(KEY);sessionStorage.removeItem(KEY);}catch(e){}
  if(arriving&&!reduce){
    busy=true;
    (arriving==='up'?revealUp():arriving==='cachot'?revealCachot(false):arriving==='cachot-up'?revealCachot(true):revealDown()).then(function(){busy=false;}).catch(function(error){console.error('Transition d’arrivée impossible',error);clearAll();busy=false;});
    setTimeout(function(){busy=false;},6000);
  }else{
    document.documentElement.classList.remove('slx');
  }
  window.addEventListener('pageshow',function(e){if(e.persisted){clearAll();busy=false;}});

  document.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
    var a=ev.target.closest&&ev.target.closest('a[data-slime]');
    if(!a)return;
    ev.preventDefault();
    if(busy)return;
    var dir=a.getAttribute('data-slime'),href=a.href;
    if(reduce){location.href=href;return;}
    busy=true;
    (dir==='up'?coverUp():dir==='cachot'?coverCachot(false):dir==='cachot-up'?coverCachot(true):coverDown(a)).then(function(){
      try{sessionStorage.setItem(KEY,dir);}catch(e){}
      location.href=href;
      setTimeout(function(){clearAll();busy=false;},4500);
    }).catch(function(error){console.error('Transition impossible',error);clearAll();busy=false;});
  });
})();
