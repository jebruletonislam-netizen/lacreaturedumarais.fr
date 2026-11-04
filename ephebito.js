/* Éphébito : le mode putride (secouer la dame-jeanne jusqu'à ce qu'elle explose).
   Il tombe, pendu par ses collants, en haut de la section texte ; on le balance, on le salit de crottes, on le torture de clystères.
   Si l'on plante assez de clystères et de crottes dans son entrejambe, il accouche d'Éphénégro, avec qui il se balance désormais.
   La dame-jeanne, Éphébito et Éphénégro disent les tweets. Chargé à la demande par putride.js (window.PutrideFx). */
(function(){
  'use strict';
  if(window.Ephebito)return;
  var P='/images/putride/',V='?v=1',TAU=Math.PI*2;
  /* découpes : taille du fichier, cadre dans la photo source, enveloppe (clic), attaches des collants, entrejambe (centre et rayon, normalisés) */
  var M={
    a:{w:392,h:573,crop:[114,0,747,925],hull:[[.5071,.9989],[0,.6659],[.3318,0],[.7741,0],[.9984,.6984]],sa:[{x:.3649,w:.0648,c:'#645e5a'},{x:.7512,w:.0442,c:'#776e69'}],zone:[.4518,.4541,.1659]},
    b:{w:427,h:634,crop:[53,0,743,1024],hull:[[.3652,.999],[.2725,.999],[0,.7061],[.1841,.1318],[.2942,0],[.7754,0],[.9971,.6758]],sa:[{x:.313,w:.0362,c:'#a1a2a6'},{x:.7543,w:.0406,c:'#9a9da2'}],zone:[.5101,.4199,.1522]},
    n:{w:151,h:348,hull:[[.3714,0],[.6,.0498],[.9959,.306],[.8776,.9395],[.2041,.9982],[0,.3665],[.1429,.073]],pos:[.2986,.0352,.3551,.5488],piv:[.52,.72]}
  };
  var IM={},lance=0,FX=null,cx=null,S=null;
  function pre(){
    if(lance)return;lance=1;
    ['a','b','n'].forEach(function(k){var i=new Image();i.onload=function(){IM[k]=i;};i.src=P+'eph-'+k+'.webp'+V;});
  }
  function ok(){return !!(IM.a&&IM.b&&IM.n);}
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function poly(h){return 'polygon('+h.map(function(p){return (p[0]*100).toFixed(1)+'% '+(p[1]*100).toFixed(1)+'%';}).join(',')+')';}
  function maskOf(img){
    var w=72,h=Math.round(72*img.height/img.width),c=document.createElement('canvas');c.width=w;c.height=h;
    var g=c.getContext('2d');g.drawImage(img,0,0,w,h);
    var d=g.getImageData(0,0,w,h).data,a=new Uint8Array(w*h),i;for(i=0;i<a.length;i++)a[i]=d[i*4+3]>110?1:0;
    return {w:w,h:h,a:a};
  }
  function inMask(mk,u,v){if(u<0||u>=1||v<0||v>=1)return false;return mk.a[((v*mk.h)|0)*mk.w+((u*mk.w)|0)]===1;}
  function shade(hex,f){
    var n=parseInt(hex.slice(1),16);
    return 'rgb('+Math.min(255,((n>>16)&255)*f|0)+','+Math.min(255,((n>>8)&255)*f|0)+','+Math.min(255,(n&255)*f|0)+')';
  }
  var CBR=['#4b2a0e','#6b3d17','#9a6a2c'],CVE=['#3f8d12','#8fd61f','#d6ff86'],CSA=['#5c0710','#9a0c1c','#e0283a'];

  /* ---------- géométrie : tout est dans le repère du crochet, le corps pend de la longueur des collants ---------- */
  function lay(){
    var X=FX.ext,m=M[S.k],cw=m.crop[2]-m.crop[0],g=S.g;
    S.hs=clamp(FX.CH*(FX.isM()?.3:.44),170,440);S.f=S.hs/1024;S.ext=S.hs*.2;
    S.hx=(X.x0+X.x1)/2;S.hy=FX.bord();
    g.dw=cw*S.f;g.dh=(m.crop[3]-m.crop[1])*S.f;g.mx=(m.sa[0].x+m.sa[1].x)/2*g.dw;
  }
  function toW(lx,ly){var c=Math.cos(S.th),s=Math.sin(S.th);return [S.hx+lx*c-ly*s,S.hy+S.dy+lx*s+ly*c];}
  function toL(wx,wy){var dx=wx-S.hx,dy=wy-S.hy-S.dy,c=Math.cos(S.th),s=Math.sin(S.th);return [dx*c+dy*s,-dx*s+dy*c];}
  function toUV(wx,wy){var l=toL(wx,wy),g=S.g;return [(l[0]+g.mx)/g.dw,(l[1]-S.ext)/g.dh];}
  function pointIn(wx,wy){
    var uv=toUV(wx,wy);
    if(inMask(S.mk[S.k],uv[0],uv[1]))return true;
    if(S.born&&S.bs>.6){var p=M.n.pos;return inMask(S.mk.n,(uv[0]-p[0])/p[2],(uv[1]-p[1])/p[3]);}
    return false;
  }
  function inZone(p){
    var z=M[S.k].zone,g=S.g;
    return Math.hypot((p.u-z[0])*g.dw,(p.v-z[1])*g.dh)<=z[2]*g.dw*1.15;
  }

  /* ---------- salissures : cuites dans le sprite, donc elles suivent le corps ---------- */
  function bake(cv,st,k){
    var m=M[k],g=cv.getContext('2d'),sc=m.w/(m.crop[2]-m.crop[0]),x=st.u*m.w,y=st.v*m.h,r=st.r*sc,R=rng(st.s),col=st.c==='c'?CBR:st.c==='r'?CSA:CVE,i,a,d;
    g.save();g.globalCompositeOperation='source-atop';
    for(i=0;i<7;i++){a=R()*TAU;d=r*R()*.7;g.beginPath();g.ellipse(x+Math.cos(a)*d,y+Math.sin(a)*d,r*(.38+R()*.4),r*(.34+R()*.4),R()*3,0,TAU);g.fillStyle=col[i%2];g.fill();}
    for(i=0;i<3;i++){a=R()*TAU;d=r*R()*.45;g.beginPath();g.ellipse(x+Math.cos(a)*d-r*.1,y+Math.sin(a)*d-r*.12,r*.22,r*.16,R()*3,0,TAU);g.fillStyle=col[2];g.globalAlpha=.7;g.fill();g.globalAlpha=1;}
    var L=r*(1+R()*2.2),dx=x+(R()-.5)*r*.8;
    g.beginPath();g.moveTo(dx-r*.16,y);g.lineTo(dx+r*.16,y);g.lineTo(dx+r*.1,y+L);g.arc(dx,y+L,r*.12,0,Math.PI);g.closePath();g.fillStyle=col[1];g.fill();
    g.restore();
  }
  function tache(kind,u,v,r){
    S.st.push({c:kind,u:u,v:v,r:r,s:(Math.random()*1e9)|0});
    if(S.st.length>44){S.st.splice(0,16);rebake(S.k);}else bake(S.cv[S.k],S.st[S.st.length-1],S.k);
  }
  function rebake(k){
    var c=S.cv[k],g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(IM[k],0,0);
    S.st.forEach(function(st){bake(c,st,k);});
  }

  /* ---------- la parole ---------- */
  function ancre(n){
    var g=S.g,x0,y0,w,h;
    if(n){var p=M.n.pos;x0=-g.mx+p[0]*g.dw;y0=S.ext+p[1]*g.dh;w=p[2]*g.dw;h=p[3]*g.dh;}
    else{x0=-g.mx;y0=S.ext;w=g.dw;h=g.dh;}
    var c=[toW(x0,y0),toW(x0+w,y0),toW(x0,y0+h),toW(x0+w,y0+h)],xs=c.map(function(q){return q[0];}),ys=c.map(function(q){return q[1];});
    return {x:(Math.min.apply(0,xs)+Math.max.apply(0,xs))/2,top:Math.min.apply(0,ys),bot:Math.max.apply(0,ys)+8,up:false};
  }
  var oE={nom:'Éphébito',gone:function(){return !S||!S.vis;},ouvre:function(){kick(1);},anc:function(){return S&&S.vis?ancre(false):null;}};
  var oN={nom:'Éphénégro',gone:function(){return !S||!S.born||S.bs<.3;},ouvre:function(){kick(1);S.alv+=rnd(-3,3);},anc:function(){return S&&S.born?ancre(true):null;}};
  function kick(f){S.om+=(Math.random()<.5?-1:1)*rnd(.8,1.5)*f;}

  /* ---------- l'explosion ---------- */
  function boum(fx,o){
    if(S)return;
    FX=fx;cx=fx.cx;pre();
    S={ab:0,zc:0,bl:0,cl:0,vis:false,k:'a',th:0,om:0,omP:0,al:0,alv:0,dy:0,dyv:0,t:0,drag:null,tt:0,st:[],pl:[],bts:[],born:false,nais:0,sw:false,bs:0,bsv:0,fl:0,sh:[],sub:false,wet:false,lt:-1,
       hs:300,f:.3,ext:60,hx:0,hy:0,g:{dw:1,dh:1,mx:0},cv:{},mk:{},bE:null,bN:null,hk:'',fx:null};
    ['a','b'].forEach(function(k){var c=document.createElement('canvas');c.width=IM[k].width;c.height=IM[k].height;c.getContext('2d').drawImage(IM[k],0,0);S.cv[k]=c;S.mk[k]=maskOf(IM[k]);});
    S.mk.n=maskOf(IM.n);
    var API={on:true,step:step,draw:draw,top:top,place:place};
    FX.eph=API;
    /* éclats de verre, bouchon, éclaboussures des cinq liquides */
    var i,h=o.h,n=FX.LOW?12:18;
    for(i=0;i<n;i++){
      var a=rnd(0,TAU),sp=rnd(180,720);
      S.sh.push({x:o.x+rnd(-.25,.25)*h,y:o.y+rnd(-.45,.3)*h,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-260,r:rnd(0,TAU),vr:rnd(-12,12),s:rnd(.05,.14)*h,p:[rnd(.5,1),rnd(.5,1),rnd(.5,1)],l:rnd(1.3,2.2),cork:false});
    }
    S.sh.push({x:o.x,y:o.y-h*.55,vx:rnd(-120,120),vy:-640,r:0,vr:9,s:h*.14,p:[1,1,1],l:3,cork:true});
    S.fx={x:o.x,y:o.y,t:0,r:h};
    FX.spray(o.x,o.y,FX.LOW?30:44,1.5,['#4a2d12','#9a6a1c','#e3cf2e','#efe6c0','#fbfbf3']);
    var sy=FX.vsurf(o.x);if(FX.niv>2&&o.y>sy-40)FX.wave(o.x,9);
    FX.lvlAdd(14);
    for(i=0;i<3;i++)FX.mk(0,o.x+rnd(-20,20),o.y,rnd(-260,260),rnd(-520,-180));
    FX.mk(1,o.x+rnd(-20,20),o.y-20,rnd(-160,160),rnd(-460,-240));
  }

  /* ---------- plantés, salis ---------- */
  function plant(it,px,py){
    var uv=toUV(px,py),p={k:it.k,u:uv[0],v:uv[1],a:it.k?it.rot-S.th:rnd(-.5,.5),s:it.s/S.f},dedans=inZone(p);
    if(it.held){it.held=false;document.documentElement.classList.remove('cro-prise');}
    it.dead=true;
    S.om+=clamp(-it.vx/Math.max(120,S.ext+S.g.dh*.45)*.9,-3.2,3.2)+(Math.random()<.5?-.5:.5);
    S.ab+=dedans?2:1;
    if(it.k){
      /* le clystère reste planté, et la plaie saigne */
      if(S.pl.length>=16)S.pl.shift();
      S.pl.push(p);
      tache('r',p.u,p.v,26+Math.random()*14);
      FX.spray(px,py,8,.7,['#9a0c1c','#e0283a','#5c0710']);
    }else{
      /* la crotte s'écrase et disparaît, ne laissant que sa tache */
      tache('c',p.u,p.v,(46+Math.random()*24));
      FX.spray(px,py,5,.5,['#6b3d17','#4b2a0e','#9a6a2c']);
      if(dedans)S.zc++;
    }
    var n1=0;S.pl.forEach(function(q){if(q.k&&inZone(q))n1++;});
    if(dedans){S.om+=(Math.random()<.5?-1:1)*1.4;FX.spray(px,py,5,.7,['#8fd61f','#efe6c0']);}
    if(!S.born&&((n1>=2&&S.zc>=2)||S.ab>=10))naissance();
  }
  function naissance(){
    S.born=true;S.nais=.001;S.fl=1;S.om+=(Math.random()<.5?-1:1)*4.5;S.dyv-=140;
    var z=M[S.k].zone,g=S.g,w=toW(-g.mx+z[0]*g.dw,S.ext+z[1]*g.dh);
    FX.spray(w[0],w[1],FX.LOW?26:40,1.3,['#8d1d1d','#6b3d17','#8fd61f','#efe6c0','#d6ff86']);
    FX.wave(w[0],4);
    setTimeout(function(){if(S&&!FX.bulle())FX.parle(oN);},2400);
  }

  function objets(){
    var its=FX.items,i,it,px,py;
    for(i=0;i<its.length;i++){
      it=its[i];
      if(it.out||it.dead||it.sc<.9||!S.vis)continue;
      if(it.k){px=it.x+Math.cos(it.rot)*it.s*.5;py=it.y+Math.sin(it.rot)*it.s*.5;}else{px=it.x;py=it.y-it.s*.3;}
      if(it.held)continue;
      if(!pointIn(px,py))continue;
      if(it.usr)plant(it,px,py);
      else if(!it.k&&!it.wet&&it.vy>120){
        var uv=toUV(px,py);tache('c',uv[0],uv[1],40+Math.random()*24);it.out=true;S.ab+=.5;
        S.om+=clamp(-it.vx/300,-1,1)+(Math.random()<.5?-.3:.3);
        FX.spray(px,py,3,.4,['#6b3d17','#4b2a0e']);
      }
    }
  }

  /* ---------- la vie ---------- */
  function apparait(){
    S.vis=true;lay();S.dy=-(S.ext+S.g.dh+90);S.dyv=0;S.om=rnd(-.5,.5);
    var b=document.createElement('button');b.type='button';b.className='eph-btn';
    b.setAttribute('aria-label','Éphébito : touchez-le, il parle ; saisissez-le pour le balancer');
    document.body.appendChild(b);S.bE=b;bind(b);
  }
  function bind(b){
    b.addEventListener('pointerdown',function(e){
      if(e.button||!S.vis)return;
      e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(_){}
      var l=toL(e.clientX,e.clientY);
      S.drag={id:e.pointerId,who:b===S.bN?1:0,sx:e.clientX,sy:e.clientY,moved:false,phi:Math.atan2(-l[0],l[1])};S.tt=S.th;
    });
    b.addEventListener('pointermove',function(e){
      var d=S.drag;if(!d||e.pointerId!==d.id)return;
      if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>6){d.moved=true;FX.ferme();document.documentElement.classList.add('cro-prise');}
      if(!d.moved)return;
      var a=Math.atan2(-(e.clientX-S.hx),e.clientY-S.hy-S.dy)-d.phi;
      while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;
      S.tt=clamp(a,-1.45,1.45);
    });
    function fin(e,annule){
      var d=S.drag;if(!d||e.pointerId!==d.id)return;
      S.drag=null;document.documentElement.classList.remove('cro-prise');try{b.releasePointerCapture(d.id);}catch(_){}
      if(!d.moved){if(!annule)FX.parle(d.who?oN:oE);}else S.om=clamp(S.om,-9,9);
    }
    b.addEventListener('pointerup',function(e){fin(e,false);});
    b.addEventListener('pointercancel',function(e){fin(e,true);});
    b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();FX.parle(b===S.bN?oN:oE);}});
  }
  function step(dt){
    if(!S)return;
    if(S.lt!==FX.t){S.lt=FX.t;lay();}
    var i,s;
    /* éclats : pesanteur, puis ils plongent dans le fluide */
    for(i=S.sh.length-1;i>=0;i--){
      s=S.sh[i];s.vy+=1700*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=s.vr*dt;s.l-=dt;
      var sy=FX.niv>2?FX.vsurf(s.x):FX.ext.fl;
      if(s.y>sy||s.l<=0||s.y>FX.CH+40){if(s.y>sy&&FX.niv>2)FX.wave(s.x,s.cork?2.4:1.4);S.sh.splice(i,1);}
    }
    if(S.fx){S.fx.t+=dt;if(S.fx.t>.5)S.fx=null;}
    if(S.fl>0)S.fl=Math.max(0,S.fl-dt*3);
    if(!S.vis){S.t+=dt;if(S.t>.55)apparait();return;}
    var g=S.g,grab=S.drag&&S.drag.moved,th0=S.th,om0=S.om;
    if(grab){
      S.th+=(S.tt-S.th)*Math.min(1,dt*18);S.om+=((S.th-th0)/dt-S.om)*.35;
    }else{
      S.om+=(-11*Math.sin(S.th)-(.3+(S.sub?2.6:0))*S.om)*dt;S.th+=S.om*dt;
      if(S.th>1.45){S.th=1.45;S.om*=-.35;}else if(S.th<-1.45){S.th=-1.45;S.om*=-.35;}
    }
    S.dyv+=(-140*S.dy-8*S.dyv)*dt;S.dy+=S.dyv*dt;
    var hp=toW(-g.mx+g.dw*.5,S.ext+g.dh*.97),sf=FX.niv>2?FX.vsurf(hp[0]):1e9;
    S.sub=hp[1]>sf+6;
    /* le sang coule des clystères plantés ; le fluide vert, lui, lave et guérit tout ce qu'il touche */
    S.bl+=dt;
    if(S.bl>.35){
      S.bl=0;
      for(i=0;i<S.pl.length;i++){
        if(!S.pl[i].k)continue;
        var wp=toW(-g.mx+S.pl[i].u*g.dw,S.ext+S.pl[i].v*g.dh);
        if(FX.niv>2&&wp[1]>FX.vsurf(wp[0]))continue;
        if(FX.drops.length<60)FX.drops.push({x:wp[0]+rnd(-4,4),y:wp[1],vx:rnd(-20,20),vy:rnd(40,160),r:rnd(1.4,2.6),l:rnd(.6,1.1),c:Math.random()<.5?'#9a0c1c':'#e0283a'});
        if(Math.random()<.18&&S.st.length<40)tache('r',S.pl[i].u+rnd(-.02,.02),S.pl[i].v+rnd(0,.05),9+Math.random()*8);
      }
    }
    S.cl+=dt;
    if(S.cl>.15&&FX.niv>2){
      S.cl=0;var lav=0,k2,q2,w2,pol=[];
      for(k2=S.st.length-1;k2>=0;k2--){
        q2=S.st[k2];w2=toW(-g.mx+q2.u*g.dw,S.ext+q2.v*g.dh);
        if(w2[1]>FX.vsurf(w2[0])){S.st.splice(k2,1);lav++;}
      }
      for(k2=S.pl.length-1;k2>=0;k2--){
        q2=S.pl[k2];w2=toW(-g.mx+q2.u*g.dw,S.ext+q2.v*g.dh);
        if(w2[1]>FX.vsurf(w2[0])){
          var it2=FX.mk(q2.k,w2[0],w2[1],rnd(-80,80),rnd(-60,40));it2.rot=q2.a+S.th;it2.usr=false;S.pl.splice(k2,1);lav++;
          FX.spray(w2[0],w2[1],4,.4,['#d6ff86','#8fd61f']);
        }
      }
      if(lav){rebake(S.k);S.ab=Math.max(0,S.ab-lav*.8);FX.spray(hp[0],sf,3,.4,['#d6ff86','#f4ffd9']);}
    }
    if(S.sub&&!S.wet){S.wet=true;FX.wave(hp[0],clamp(Math.abs(S.om)*g.dh*.012,1,10));FX.spray(hp[0],sf,5,.6);}
    else if(!S.sub)S.wet=false;
    if(S.born){
      S.alv+=(-60*S.al-5*S.alv-((S.om-om0)/dt)*.14)*dt;S.al=clamp(S.al+S.alv*dt,-.2,.2);
      if(S.nais>0){
        S.nais+=dt;
        if(!S.sw&&S.nais>.16){
          S.sw=true;
          /* ce qui était planté dans l'entrejambe est expulsé */
          var keep=[];
          S.pl.forEach(function(q){
            if(inZone(q)){var w=toW(-g.mx+q.u*g.dw,S.ext+q.v*g.dh),it=FX.mk(q.k,w[0],w[1],rnd(-300,300),rnd(-380,-120));it.rot=q.a+S.th;it.usr=false;}
            else keep.push(q);
          });
          S.pl=keep;S.k='b';lay();rebake('b');S.bs=0;S.bsv=0;
          var b=document.createElement('button');b.type='button';b.className='eph-btn';
          b.setAttribute('aria-label','Éphénégro : touchez-le, il parle ; saisissez-le pour le balancer avec Éphébito');
          document.body.appendChild(b);S.bN=b;bind(b);S.hk='';
          b.style.clipPath=poly(M.n.hull);
        }
        if(S.sw){S.bsv+=(-170*(S.bs-1)-11*S.bsv)*dt;S.bs+=S.bsv*dt;}
      }
    }
    objets();
  }
  function draw(){
    if(!S||!S.vis)return;
    if(S.lt!==FX.t){S.lt=FX.t;lay();}
    var g=S.g,m=M[S.k],i,sa,x,w,gr,p,q;
    cx.save();cx.translate(S.hx,S.hy+S.dy);cx.rotate(S.th);
    /* les deux collants partent d'un même crochet */
    for(i=0;i<2;i++){
      sa=m.sa[i];if(!sa.d)sa.d=shade(sa.c,.55);
      x=-g.mx+sa.x*g.dw;w=Math.max(7,sa.w*g.dw*1.05);
      cx.beginPath();cx.moveTo(-w*.22,-1);cx.lineTo(w*.22,-1);cx.lineTo(x+w/2,S.ext+3);cx.lineTo(x-w/2,S.ext+3);cx.closePath();
      gr=cx.createLinearGradient(0,0,0,S.ext);gr.addColorStop(0,sa.d);gr.addColorStop(1,sa.c);
      cx.fillStyle=gr;cx.fill();cx.lineWidth=1;cx.strokeStyle='rgba(0,0,0,.5)';cx.stroke();
    }
    cx.beginPath();cx.arc(0,0,5.5,0,TAU);cx.fillStyle='#9aa3a8';cx.fill();cx.lineWidth=2;cx.strokeStyle='#14171a';cx.stroke();
    cx.drawImage(S.cv[S.k],-g.mx,S.ext,g.dw,g.dh);
    /* ce qu'on lui a planté : clystères (la canule dedans) et crottes */
    for(i=0;i<S.pl.length;i++){
      p=S.pl[i];x=-g.mx+p.u*g.dw;var y=S.ext+p.v*g.dh,s=p.s*S.f;
      if(p.k)FX.SL.clystere(cx,x-Math.cos(p.a)*s*.44,y-Math.sin(p.a)*s*.44,s,p.a);
      else FX.SL.crotte(cx,x,y,s,p.a,.08);
    }
    if(S.born&&S.bs>.01){
      q=M.n.pos;var bw=q[2]*g.dw,bh=q[3]*g.dh,bx=-g.mx+q[0]*g.dw,by=S.ext+q[1]*g.dh,px=bx+M.n.piv[0]*bw,py=by+M.n.piv[1]*bh;
      cx.save();cx.translate(px,py);cx.rotate(S.al);cx.scale(S.bs,S.bs);cx.drawImage(IM.n,bx-px,by-py,bw,bh);cx.restore();
    }
    cx.restore();
  }
  function top(){
    if(!S)return;
    var i,s,its=FX.items;
    if(S.fx){
      var a=1-S.fx.t/.5,gr=cx.createRadialGradient(S.fx.x,S.fx.y,0,S.fx.x,S.fx.y,S.fx.r*(1.2+S.fx.t*5));
      gr.addColorStop(0,'rgba(240,255,225,'+(.85*a)+')');gr.addColorStop(.5,'rgba(200,255,140,'+(.35*a)+')');gr.addColorStop(1,'rgba(200,255,140,0)');
      cx.fillStyle=gr;cx.fillRect(S.fx.x-S.fx.r*7,S.fx.y-S.fx.r*7,S.fx.r*14,S.fx.r*14);
    }
    if(S.fl>0&&S.vis){
      var z=M[S.k].zone,g=S.g,w=toW(-g.mx+z[0]*g.dw,S.ext+z[1]*g.dh),gr2=cx.createRadialGradient(w[0],w[1],0,w[0],w[1],g.dh*.4);
      gr2.addColorStop(0,'rgba(255,255,235,'+S.fl+')');gr2.addColorStop(1,'rgba(255,240,180,0)');
      cx.fillStyle=gr2;cx.fillRect(w[0]-g.dh*.4,w[1]-g.dh*.4,g.dh*.8,g.dh*.8);
    }
    for(i=0;i<S.sh.length;i++){
      s=S.sh[i];cx.save();cx.translate(s.x,s.y);cx.rotate(s.r);
      if(s.cork){
        cx.beginPath();cx.moveTo(-s.s*.45,-s.s*.55);cx.lineTo(s.s*.45,-s.s*.55);cx.lineTo(s.s*.52,s.s*.55);cx.lineTo(-s.s*.52,s.s*.55);cx.closePath();
        cx.fillStyle='#c9985a';cx.fill();cx.lineWidth=1.6;cx.strokeStyle='#3b2610';cx.stroke();
      }else{
        cx.globalAlpha=Math.min(1,s.l*1.5);
        cx.beginPath();cx.moveTo(-s.s*s.p[0],0);cx.lineTo(s.s*s.p[1]*.6,-s.s*.7);cx.lineTo(s.s*s.p[2],s.s*.5);cx.closePath();
        cx.fillStyle='rgba(176,224,204,.4)';cx.fill();cx.lineWidth=1.3;cx.strokeStyle='rgba(235,255,245,.95)';cx.stroke();
      }
      cx.restore();
    }
  }
  function place(){
    if(!S)return;
    var g=S.g,i,it,w,h,b,q;
    if(S.vis&&S.bE){
      b=S.bE;
      if(S.hk!==S.k){S.hk=S.k;b.style.clipPath=poly(M[S.k].hull);}
      b.style.width=g.dw+'px';b.style.height=g.dh+'px';
      b.style.transform='translate('+S.hx+'px,'+(S.hy+S.dy)+'px) rotate('+S.th+'rad) translate('+(-g.mx)+'px,'+S.ext+'px)';
      if(S.bN){
        q=M.n.pos;var bw=q[2]*g.dw,bh=q[3]*g.dh,bx=-g.mx+q[0]*g.dw,by=S.ext+q[1]*g.dh,px=bx+M.n.piv[0]*bw,py=by+M.n.piv[1]*bh;
        S.bN.style.display=S.bs>.5?'':'none';
        S.bN.style.width=bw+'px';S.bN.style.height=bh+'px';
        S.bN.style.transform='translate('+S.hx+'px,'+(S.hy+S.dy)+'px) rotate('+S.th+'rad) translate('+px+'px,'+py+'px) rotate('+S.al+'rad) translate('+(bx-px)+'px,'+(by-py)+'px)';
      }
    }
  }
  window.Ephebito={pre:pre,ok:ok,boum:boum};
})();
