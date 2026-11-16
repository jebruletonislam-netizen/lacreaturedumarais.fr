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
  var CBR=['#4b2a0e','#6b3d17','#9a6a2c'],CVE=['#3f8d12','#8fd61f','#d6ff86'],CSA=['#5c0710','#9a0c1c','#e0283a'],SANG=['#9a0c1c','#e0283a','#5c0710','#c4122a'];
  /* contour irrégulier d'une plaie ou d'un morceau arraché (même graine = même forme) */
  function polyPts(seed,r){
    var R=rng(seed),a=[],i,k=10,an,rr;
    for(i=0;i<k;i++){an=i/k*TAU;rr=r*(.7+R()*.55);a.push([Math.cos(an)*rr,Math.sin(an)*rr]);}
    return a;
  }
  function pathPts(g,pts,x,y,f){g.beginPath();pts.forEach(function(p,i){var px=x+p[0]*(f||1),py=y+p[1]*(f||1);if(i)g.lineTo(px,py);else g.moveTo(px,py);});g.closePath();}
  /* la boue : une couche marron qui recouvre tout le corps */
  function coat(cv,k){
    var a=S.mud*.92;if(a<=.02)return;
    var g=cv.getContext('2d'),R=rng(7+k.charCodeAt(0)),i,x,y,w=cv.width,h=cv.height,r;
    g.save();g.globalCompositeOperation='source-atop';
    g.fillStyle='rgba(86,50,20,'+a+')';g.fillRect(0,0,w,h);
    for(i=0;i<30;i++){x=R()*w;y=R()*h;r=w*(.03+R()*.07);g.fillStyle=R()<.5?'rgba(50,26,9,'+a*.65+')':'rgba(142,94,46,'+a*.5+')';g.beginPath();g.ellipse(x,y,r,r*(.5+R()*.5),R()*3,0,TAU);g.fill();}
    g.restore();
  }

  /* ---------- géométrie : il pend à la tringle (le bas des barres du haut) par ses deux collants, chacun glissant sur son anneau comme un rideau.
     Les deux collants restent parallèles (un parallélogramme) : le corps ne se déforme jamais, seuls les collants s'allongent ou raccourcissent.
     S.rx : milieu des deux anneaux sur la tringle ; S.len : longueur des collants ; S.ang : leur inclinaison ; S.th : la légère inclinaison du corps.
     Le repère local du corps a son origine en (S.ox,S.oy) ; le milieu des deux attaches des collants y est en (0,S.ext). ---------- */
  var LMIN=10,GRAV=1500;
  function lenMax(){return Math.max(LMIN+20,FX.CH-S.rod-44);}
  function cw2(i){return Math.max(7,M[S.k].sa[i].w*S.g.dw*1.05);}
  function ringHalf(){return S.g.ha+Math.max(cw2(0),cw2(1))/2+6;}
  function lay(){
    var X=FX.ext,m=M[S.k],cw=m.crop[2]-m.crop[0],g=S.g,h;
    S.hs=FX.isM()?clamp(FX.CH*.2,112,200):clamp(FX.CH*.44,170,440);S.f=S.hs/1024;S.ext=S.hs*.2;
    g.dw=cw*S.f;g.dh=(m.crop[3]-m.crop[1])*S.f;g.mx=(m.sa[0].x+m.sa[1].x)/2*g.dw;g.ha=(m.sa[1].x-m.sa[0].x)/2*g.dw;
    S.rod=FX.bord();h=ringHalf();
    if(S.free){S.rx=clamp(S.rx,h,Math.max(h,FX.CW-h));if(S.rxt!==null)S.rxt=clamp(S.rxt,h,Math.max(h,FX.CW-h));if(!S.drag||!S.drag.moved)S.len=clamp(S.len,LMIN,lenMax());}
    else{S.rx=(X.x0+X.x1)/2;S.len=S.ext;}
    geo();
  }
  /* la secousse verticale (S.dy : chute à l'apparition, rebond au lâcher) allonge ou raccourcit les collants ; trop courte, elle soulève le tout */
  function geo(){
    var Le=S.len+S.dy,ry=S.rod,c,s,bx,by;
    if(Le<LMIN){ry+=Le-LMIN;Le=LMIN;}
    S.ry=ry;S.le=Le;
    bx=S.rx-Le*Math.sin(S.ang);by=ry+Le*Math.cos(S.ang);c=Math.cos(S.th);s=Math.sin(S.th);
    S.ox=bx+S.ext*s;S.oy=by-S.ext*c;
  }
  function toW(lx,ly){var c=Math.cos(S.th),s=Math.sin(S.th);return [S.ox+lx*c-ly*s,S.oy+lx*s+ly*c];}
  function toL(wx,wy){var dx=wx-S.ox,dy=wy-S.oy,c=Math.cos(S.th),s=Math.sin(S.th);return [dx*c+dy*s,-dx*s+dy*c];}
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
  function bakeW(cv,wd,k){
    var m=M[k],g=cv.getContext('2d'),sc=m.w/(m.crop[2]-m.crop[0]),x=wd.u*m.w,y=wd.v*m.h,r=wd.r*sc,pts=polyPts(wd.s,r);
    g.save();
    if(wd.h){
      /* le morceau manque : on voit l'intérieur, sombre et rouge */
      g.globalCompositeOperation='destination-out';pathPts(g,pts,x,y);g.fill();
      g.globalCompositeOperation='destination-over';pathPts(g,pts,x,y,.96);g.fillStyle='#4a0009';g.fill();
      g.globalCompositeOperation='source-atop';pathPts(g,pts,x,y,1.12);g.lineWidth=Math.max(2,r*.28);g.strokeStyle='#8a0f20';g.stroke();
      pathPts(g,pts,x,y,1.3);g.lineWidth=Math.max(1.5,r*.12);g.strokeStyle='rgba(224,40,58,.8)';g.stroke();
    }else{
      g.globalCompositeOperation='source-atop';
      g.fillStyle='rgba(170,40,60,.55)';g.beginPath();g.ellipse(x,y,r*1.5,r*1.2,0,0,TAU);g.fill();
      g.fillStyle='#4a0009';g.beginPath();g.ellipse(x,y,r*.7,r*.55,wd.s%3,0,TAU);g.fill();
      g.fillStyle='#b0102a';g.beginPath();g.ellipse(x,y+r*.12,r*.4,r*.28,wd.s%3,0,TAU);g.fill();
    }
    g.restore();
  }
  function tache(kind,u,v,r){
    S.st.push({c:kind,u:u,v:v,r:r,s:(Math.random()*1e9)|0});
    if(S.st.length>44){S.st.splice(0,16);rebake(S.k);}else bake(S.cv[S.k],S.st[S.st.length-1],S.k);
  }
  function rebake(k){
    var c=S.cv[k],g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(IM[k],0,0);
    coat(c,k);
    if(k!=='n'){S.st.forEach(function(st){bake(c,st,k);});S.wd.forEach(function(w){bakeW(c,w,k);});}
  }
  function rebakeAll(){rebake(S.k);if(S.cv.n)rebake('n');}

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
    S={ab:0,zc:0,bl:0,cl:0,zp:0,mud:0,mudR:0,dp:0,hits:0,wd:[],ch:[],free:false,vx:0,ax:0,vis:false,k:'a',th:0,om:0,omL:null,al:0,alv:0,dy:0,dyv:0,t:0,drag:null,st:[],pl:[],bts:[],born:false,nais:0,sw:false,bs:0,bsv:0,fl:0,sh:[],sub:false,wet:false,lt:-1,
       hs:300,f:.3,ext:60,rod:0,rx:0,prx:null,rxt:null,len:60,le:60,ang:0,ry:0,ox:0,oy:0,bvx:0,bvy:0,pbx:null,pby:0,vib:0,g:{dw:1,dh:1,mx:0,ha:0},cv:{},mk:{},bE:null,bN:null,sg:null,hk:'',fx:null};
    ['a','b'].forEach(function(k){var c=document.createElement('canvas');c.width=IM[k].width;c.height=IM[k].height;c.getContext('2d').drawImage(IM[k],0,0);S.cv[k]=c;S.mk[k]=maskOf(IM[k]);});
    S.mk.n=maskOf(IM.n);
    var cn=document.createElement('canvas');cn.width=IM.n.width;cn.height=IM.n.height;cn.getContext('2d').drawImage(IM.n,0,0);S.cv.n=cn;
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
    if(FX.dep(o.x,o.y)>-40)FX.wave(o.x,9,o.y);
    FX.lvlAdd(14);
    for(i=0;i<3;i++)FX.mk(0,o.x+rnd(-20,20),o.y,rnd(-260,260),rnd(-520,-180));
    FX.mk(1,o.x+rnd(-20,20),o.y-20,rnd(-160,160),rnd(-460,-240));
  }

  /* ---------- plantés, salis ---------- */
  /* un morceau est arraché : le trou reste, le morceau tombe, entraînant du sang */
  function arrache(u,v){
    var m=M[S.k],src=S.cv[S.k],sc=m.w/(m.crop[2]-m.crop[0]),r=40+Math.random()*22,rc=r*sc,x=u*m.w,y=v*m.h,seed=(Math.random()*1e9)|0,pts=polyPts(seed,rc),
        ok=inMask(S.mk[S.k],u,v)&&inMask(S.mk[S.k],u-r*.4/(m.crop[2]-m.crop[0]),v)&&inMask(S.mk[S.k],u+r*.4/(m.crop[2]-m.crop[0]),v)&&inMask(S.mk[S.k],u,v-r*.4/(m.crop[3]-m.crop[1]))&&inMask(S.mk[S.k],u,v+r*.4/(m.crop[3]-m.crop[1]));
    if(!ok||S.ch.length>=8)return false;
    var D=Math.ceil(rc*2.7)+6,cv=document.createElement('canvas'),g=cv.getContext('2d');cv.width=cv.height=D;
    g.save();g.translate(D/2,D/2);pathPts(g,pts,0,0);g.clip();g.drawImage(src,-x,-y);g.restore();
    g.translate(D/2,D/2);pathPts(g,pts,0,0);g.lineWidth=Math.max(2,rc*.18);g.strokeStyle='#8a0f20';g.stroke();
    var w=toW(-S.g.mx+u*S.g.dw,S.ext+v*S.g.dh),ws=D*S.g.dw/m.w;
    S.ch.push({x:w[0],y:w[1],vx:rnd(-260,260),vy:rnd(-380,-120),rot:rnd(-1,1),vr:rnd(-7,7),cv:cv,w:ws,t:0,wet:false,bt:0});
    S.wd.push({u:u,v:v,r:r,h:1,s:seed,age:0,t:0,pu:0});
    rebakeAll();
    FX.spray(w[0],w[1],22,1.3,SANG,'b');
    S.om+=(Math.random()<.5?-1:1)*rnd(1.5,3);
    return true;
  }
  function plant(it,px,py){
    var uv=toUV(px,py),p={k:it.k,u:uv[0],v:uv[1],a:it.k?it.rot-S.th:rnd(-.5,.5),s:it.s/S.f},dedans=inZone(p);
    if(it.held){it.held=false;document.documentElement.classList.remove('cro-prise');}
    it.dead=true;
    S.om+=clamp(-it.vx/Math.max(120,S.ext+S.g.dh*.45)*.9,-3.2,3.2)+(Math.random()<.5?-.5:.5);
    S.ab+=dedans?2:1;
    if(it.k){
      /* le clystère reste planté ; la plaie s'ouvre, gicle et saigne ; à force, des morceaux s'arrachent */
      if(S.pl.length>=16)S.pl.shift();
      S.pl.push(p);S.hits++;
      tache('r',p.u,p.v,40+Math.random()*26);tache('r',p.u+rnd(-.04,.04),p.v+rnd(-.03,.05),24+Math.random()*16);
      if(S.wd.length>=14)S.wd.shift();
      S.wd.push({u:p.u,v:p.v,r:26+Math.random()*16,h:0,s:(Math.random()*1e9)|0,age:0,t:0,pu:0});
      var dx=Math.cos(p.a+S.th),dy=Math.sin(p.a+S.th),j,vv;
      FX.spray(px,py,16,1.0,SANG,'b');
      for(j=0;j<9;j++){vv=rnd(380,900);FX.drops.push({x:px,y:py,vx:-dx*vv*.5+rnd(-160,160),vy:-dy*vv*.4-rnd(80,300),r:rnd(1.6,3.2),l:rnd(.7,1.3),c:SANG[(Math.random()*4)|0],f:'b'});}
      rebakeAll();
      if(S.hits>=4&&Math.random()<clamp((S.hits-3)*.15,0,.7))arrache(p.u,p.v);
    }else{
      /* la crotte s'écrase : sa tache reste ; à six, tout le corps est marron */
      tache('c',p.u,p.v,(46+Math.random()*24));
      FX.spray(px,py,5,.5,['#6b3d17','#4b2a0e','#9a6a2c']);
      S.zp++;
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
    S.vis=true;lay();S.dy=-(S.ext+S.g.dh+90);S.dyv=0;S.om=rnd(-.5,.5);geo();
    var b=document.createElement('button');b.type='button';b.className='eph-btn';
    b.setAttribute('aria-label','Éphébito : touchez-le, il parle ; tirez-le pour le faire glisser sur sa tringle et allonger ses collants (flèches du clavier aussi)');
    document.body.appendChild(b);S.bE=b;bind(b,0);
    var sg=document.createElement('button');sg.type='button';sg.className='eph-btn eph-sg';
    sg.setAttribute('aria-label','Les collants d’Éphébito : faites-les glisser comme un rideau, tirez-les pour les allonger (flèches du clavier aussi)');
    document.body.appendChild(sg);S.sg=sg;bind(sg,2);
  }
  /* le son : un petit « tchoing » d'élastique, discret, synthétisé à la volée (rien à charger) ; le contexte audio naît au premier geste */
  var AC=null;
  function audio(){
    try{
      if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return null;AC=new AX();}
      if(AC.state==='suspended')AC.resume();
      return AC;
    }catch(_){return null;}
  }
  function twang(f,a,d){
    var c=AC;if(!c||c.state!=='running'||document.hidden)return;
    try{
      var t=c.currentTime,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();
      o.type='triangle';o2.type='sine';
      o.frequency.setValueAtTime(f*1.35,t);o.frequency.exponentialRampToValueAtTime(f,t+.05);o2.frequency.setValueAtTime(f*2.01,t);
      lp.type='lowpass';lp.frequency.value=2600;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(a,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);
      o.connect(g);o2.connect(g);g.connect(lp);lp.connect(c.destination);
      o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05);
    }catch(_){}
  }
  var NOTES=[196,220,261.6,293.7,329.6,392,440,523.3];
  /* lâché : il reste là où on l'a laissé ; ses anneaux finissent de glisser au-dessus de lui, l'élan le balance un peu et fait rebondir les collants */
  function lache(d){
    var Le=Math.max(LMIN,S.len),c=Math.cos(S.ang),s=Math.sin(S.ang),vx=clamp(S.bvx,-1800,1800),vy=clamp(S.bvy,-1800,1800),h=ringHalf(),dl=Math.abs(S.len-d.l0);
    S.om=clamp(-(vx*c+vy*s)/Le*.5,-3,3);S.omL=S.om;S.ax=0;
    S.dyv=clamp((-vx*s+vy*c)*.3,-260,260);
    S.rxt=clamp(S.rx-Le*s,h,Math.max(h,FX.CW-h));
    if(dl>24){S.vib=Math.min(16,dl*.05);twang(150+Math.min(dl,520)*.45,.07,.55);}
  }
  /* où qu'on le saisisse (corps, Éphénégro, collants), on le tire tout entier : seuls les collants s'allongent, et leurs anneaux glissent sur la tringle.
     who : 0 Éphébito, 1 Éphénégro, 2 les collants */
  function bind(b,who){
    b.addEventListener('pointerdown',function(e){
      if(e.button||!S.vis||S.drag)return;
      audio();
      e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(_){}
      S.drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:0,oy:0,tx:0,ty:0,moved:false,l0:S.len};
      var B=toW(0,S.ext);S.drag.ox=B[0]-e.clientX;S.drag.oy=B[1]-e.clientY;
    });
    b.addEventListener('pointermove',function(e){
      var d=S.drag;if(!d||e.pointerId!==d.id)return;
      if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>6){
        d.moved=true;S.free=true;FX.ferme();document.documentElement.classList.add('cro-prise');
        S.len=S.le;S.dy=S.dyv=0;S.rxt=null;S.pbx=null;S.bvx=S.bvy=0;d.l0=S.len;
      }
      if(!d.moved)return;
      d.tx=e.clientX+d.ox;d.ty=e.clientY+d.oy;
    });
    function fin(e,annule){
      var d=S.drag;if(!d||e.pointerId!==d.id)return;
      S.drag=null;document.documentElement.classList.remove('cro-prise');try{b.releasePointerCapture(d.id);}catch(_){}
      if(!d.moved){if(!annule)FX.parle(who===1?oN:oE);}else lache(d);
    }
    b.addEventListener('pointerup',function(e){fin(e,false);});
    b.addEventListener('pointercancel',function(e){fin(e,true);});
    /* au clavier : Entrée le fait parler, les flèches le font glisser le long de la tringle ou allongent ses collants */
    b.addEventListener('keydown',function(e){
      var k=e.key,h=ringHalf(),l0;
      if(k==='Enter'||k===' '){e.preventDefault();FX.parle(who===1?oN:oE);}
      else if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();S.free=true;S.rxt=clamp((S.rxt===null?S.rx:S.rxt)+(k==='ArrowLeft'?-40:40),h,Math.max(h,FX.CW-h));}
      else if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();S.free=true;l0=S.len;S.len=clamp(S.len+(k==='ArrowUp'?-40:40),LMIN,lenMax());S.dy-=S.len-l0;}
    });
    if(who===2){
      b.addEventListener('pointerenter',function(){S.hov=true;});
      b.addEventListener('pointerleave',function(){S.hov=false;});
    }
  }
  function step(dt){
    if(!S)return;
    if(S.lt!==FX.t){S.lt=FX.t;lay();}
    var i,s;
    /* éclats : pesanteur, puis ils plongent dans le fluide */
    for(i=S.sh.length-1;i>=0;i--){
      s=S.sh[i];s.vy+=1700*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.r+=s.vr*dt;s.l-=dt;
      var dsh=FX.dep(s.x,s.y);
      if(dsh>0||s.l<=0||s.y>FX.CH+40){if(dsh>0)FX.wave(s.x,s.cork?2.4:1.4,s.y);S.sh.splice(i,1);}
    }
    if(S.fx){S.fx.t+=dt;if(S.fx.t>.5)S.fx=null;}
    if(S.fl>0)S.fl=Math.max(0,S.fl-dt*3);
    if(!S.vis){S.t+=dt;if(S.t>.55)apparait();return;}
    var g=S.g,dm=S.drag&&S.drag.moved,om0=S.om,a0=S.ang,h=ringHalf(),Le,rv,i2,gl=!dm&&S.rxt!==null,bx0=S.rx-S.le*Math.sin(S.ang);
    /* les anneaux : tenus, ils glissent sur la tringle pour rester au-dessus de lui ; lâchés, ils finissent de glisser là où on l'a laissé, puis ne bougent plus */
    if(dm)S.rx+=(clamp(clamp(S.drag.tx,-g.dw*.25,FX.CW+g.dw*.25),h,Math.max(h,FX.CW-h))-S.rx)*(1-Math.exp(-14*dt));
    else if(gl){S.rx+=(S.rxt-S.rx)*(1-Math.exp(-7*dt));if(Math.abs(S.rxt-S.rx)<.3){S.rx=S.rxt;S.rxt=null;}}
    /* pendant qu'ils glissent, lui ne bouge pas : seuls les collants changent d'inclinaison */
    if(gl)S.ang=Math.asin(clamp((S.rx-bx0)/Math.max(LMIN,S.le),-.99,.99));
    rv=S.prx===null?0:(S.rx-S.prx)/dt;S.prx=S.rx;
    if(gl)S.ax=0;else S.ax+=((rv-S.vx)/dt-S.ax)*.3;
    S.vx=rv;
    if(dm){
      /* tenu : le point saisi suit le doigt ; le corps ne tourne pas, seuls les collants s'allongent, raccourcissent ou s'inclinent */
      var d=S.drag,lm=lenMax(),tx=clamp(d.tx,-g.dw*.25,FX.CW+g.dw*.25),ddx=S.rx-tx,ty=clamp(d.ty,S.rod+LMIN,S.rod+Math.sqrt(Math.max(LMIN*LMIN,lm*lm-ddx*ddx)));
      S.len=Math.max(LMIN,Math.hypot(ddx,ty-S.rod));S.ang=Math.atan2(ddx,ty-S.rod);S.dy=S.dyv=0;
      if(S.pbx!==null){S.bvx+=((tx-S.pbx)/dt-S.bvx)*.3;S.bvy+=((ty-S.pby)/dt-S.bvy)*.3;}
      S.pbx=tx;S.pby=ty;
      S.om+=((S.ang-a0)/dt-S.om)*.35;
    }else{
      /* pendu : deux collants parallèles de même longueur, il se balance sans tourner ; le fluide et le survol des collants l'apaisent */
      Le=Math.max(LMIN,S.len+S.dy)+g.dh*.35;
      /* les secousses venues d'ailleurs (crottes, clystères, paroles) balancent moins un pendu aux longs collants */
      if(S.omL!==null&&S.om!==S.omL)S.om=S.omL+(S.om-S.omL)*Math.min(1,(S.ext+g.dh*.35)/Le);
      S.om+=(-GRAV/Le*Math.sin(S.ang)+clamp(S.ax,-25000,25000)/Le*Math.cos(S.ang)-(.9+(S.sub?2.6:0)+(S.hov?9:0))*S.om)*dt;
      S.ang+=S.om*dt;
      if(S.ang>1.3){S.ang=1.3;S.om*=-.35;}else if(S.ang<-1.3){S.ang=-1.3;S.om*=-.35;}
      S.dyv+=(-140*S.dy-8*S.dyv)*dt;S.dy+=S.dyv*dt;
    }
    S.omL=S.om;
    S.th+=(clamp(S.ang*.3,-.22,.22)-S.th)*Math.min(1,dt*10);
    S.vib*=Math.exp(-3.2*dt);
    geo();
    /* de longs collants sont des cordes : ce qu'on y jette rebondit, et ils vibrent en chantant */
    if(S.le>40&&FX.items.length){
      for(i2=0;i2<2;i2++){
        var lx=-g.mx+M[S.k].sa[i2].x*g.dw,ax0=S.rx+lx,ay0=S.ry,at=toW(lx,S.ext),ddx2=at[0]-ax0,ddy2=at[1]-ay0,dl=Math.hypot(ddx2,ddy2),
            ux=ddx2/dl,uy=ddy2/dl,nx2=-uy,ny2=ux,ii,it2,px,py,tt,sd,rr,sg,vn;
        for(ii=0;ii<FX.items.length;ii++){
          it2=FX.items[ii];if(it2.held||it2.dead||it2.out)continue;
          px=it2.x-ax0;py=it2.y-ay0;tt=(px*ux+py*uy)/dl;if(tt<.02||tt>.98)continue;
          sd=px*nx2+py*ny2;rr=(it2.k===1?9:it2.k===2?5:it2.s*.36)+cw2(i2)/2;if(Math.abs(sd)>=rr)continue;
          sg=sd>=0?1:-1;vn=it2.vx*nx2+it2.vy*ny2;
          it2.x+=nx2*sg*(rr-Math.abs(sd));it2.y+=ny2*sg*(rr-Math.abs(sd));
          if(vn*sg<0){
            it2.vx-=1.5*vn*nx2;it2.vy-=1.5*vn*ny2;it2.vr+=rnd(-3,3);
            if(-vn*sg>90&&FX.t-(S.plk||0)>70){S.plk=FX.t;S.vib=Math.min(16,S.vib+Math.abs(vn)*.012);twang(NOTES[Math.min(7,Math.floor(tt*8))]*(i2?2:1),.05,.7);}
          }
        }
      }
    }
    var hp=toW(-g.mx+g.dw*.5,S.ext+g.dh*.97),dh=FX.dep(hp[0],hp[1]);
    S.sub=dh>6;
    /* le sang : chaque plaie coule, gicle par saccades au début et laisse des traînées ; le fluide vert, lui, lave et guérit tout ce qu'il touche */
    for(i=0;i<S.wd.length;i++){
      var wd=S.wd[i];wd.age+=dt;wd.t-=dt;
      if(wd.t>0)continue;
      wd.t=wd.age<6?rnd(.09,.16):rnd(.2,.42);
      var wp=toW(-g.mx+wd.u*g.dw,S.ext+wd.v*g.dh);
      if(FX.dep(wp[0],wp[1])>0)continue;
      if(FX.drops.length<120){
        FX.drops.push({x:wp[0]+rnd(-4,4),y:wp[1],vx:rnd(-30,30),vy:rnd(30,170),r:rnd(1.5,3),l:rnd(.7,1.3),c:SANG[(Math.random()*4)|0],f:'b'});
        if(wd.age<6){var pu=Math.floor(wd.age*2.4);if(pu!==wd.pu){wd.pu=pu;FX.spray(wp[0],wp[1],8,.9,SANG,'b');}}
      }
      if(Math.random()<.14&&S.st.length<40)tache('r',wd.u+rnd(-.02,.02),wd.v+rnd(0,.06),9+Math.random()*9);
    }
    /* les morceaux arrachés tombent, saignent, puis coulent dans le fluide */
    for(i=S.ch.length-1;i>=0;i--){
      var c=S.ch[i];c.t+=dt;c.vy+=1700*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.rot+=c.vr*dt;
      var dc=FX.dep(c.x,c.y);
      if(dc>0){
        if(!c.wet){c.wet=true;FX.wave(c.x,3,c.y);FX.spray(c.x,c.y,8,.7,SANG,'b');}
        c.vx*=1-Math.min(1,dt*3);c.vy+=(70-c.vy)*Math.min(1,dt*3.5);c.vr*=1-Math.min(1,dt*2);
      }else{
        c.bt-=dt;if(c.bt<=0&&c.t<3&&FX.drops.length<120){c.bt=.07;FX.drops.push({x:c.x,y:c.y,vx:rnd(-30,30),vy:rnd(0,60),r:rnd(1.5,2.6),l:1,c:SANG[(Math.random()*4)|0],f:'b'});}
      }
      var flc=FX.ext.fl-c.w*.35;if(c.y>flc){c.y=flc;c.vy=0;c.vx*=.6;c.vr*=.5;}
      if(c.t>7||c.y>FX.CH+60)S.ch.splice(i,1);
    }
    S.cl+=dt;
    if(S.cl>.15&&FX.niv>2){
      S.cl=0;var lav=0,k2,q2,w2,pol=[];
      for(k2=S.st.length-1;k2>=0;k2--){
        q2=S.st[k2];w2=toW(-g.mx+q2.u*g.dw,S.ext+q2.v*g.dh);
        if(FX.dep(w2[0],w2[1])>0){S.st.splice(k2,1);lav++;}
      }
      for(k2=S.pl.length-1;k2>=0;k2--){
        q2=S.pl[k2];w2=toW(-g.mx+q2.u*g.dw,S.ext+q2.v*g.dh);
        if(FX.dep(w2[0],w2[1])>0){
          var it2=FX.mk(q2.k,w2[0],w2[1],rnd(-80,80),rnd(-60,40));it2.rot=q2.a+S.th;it2.usr=false;S.pl.splice(k2,1);lav++;
          FX.spray(w2[0],w2[1],4,.4,['#d6ff86','#8fd61f']);
        }
      }
      for(k2=S.wd.length-1;k2>=0;k2--){
        q2=S.wd[k2];w2=toW(-g.mx+q2.u*g.dw,S.ext+q2.v*g.dh);
        if(FX.dep(w2[0],w2[1])>0){S.wd.splice(k2,1);lav++;FX.spray(w2[0],w2[1],3,.3,['#d6ff86','#f4ffd9']);}
      }
      if(lav){rebakeAll();S.ab=Math.max(0,S.ab-lav*.8);FX.spray(hp[0],hp[1],3,.4,['#d6ff86','#f4ffd9']);}
    }
    /* six crottes : tout le corps devient marron, et la boue goutte ; dans le fluide elle se lave */
    if(S.sub&&S.mud>0){S.mud=Math.max(0,S.mud-dt*.45);if(S.mud<=0)S.zp=0;}
    else if(S.zp>=6&&S.mud<1)S.mud=Math.min(1,S.mud+dt*.8);
    if(Math.abs(S.mud-S.mudR)>.06||(S.mud===0&&S.mudR>0)||(S.mud===1&&S.mudR<1)){S.mudR=S.mud;rebakeAll();}
    if(S.mud>.5&&!S.sub){
      S.dp-=dt;
      if(S.dp<=0){
        S.dp=rnd(.16,.36);
        for(var tr=0;tr<8;tr++){
          var uu=rnd(.1,.9),vv2=rnd(.25,.98),on=S.born&&Math.random()<.4,ok2;
          if(on){var pn=M.n.pos;uu=pn[0]+uu*pn[2];vv2=pn[1]+vv2*pn[3];ok2=inMask(S.mk.n,(uu-pn[0])/pn[2],(vv2-pn[1])/pn[3]);}
          else ok2=inMask(S.mk[S.k],uu,vv2);
          if(ok2){var wm=toW(-g.mx+uu*g.dw,S.ext+vv2*g.dh);if(FX.drops.length<120)FX.drops.push({x:wm[0],y:wm[1],vx:rnd(-15,15),vy:rnd(10,50),r:rnd(1.8,3.2),l:7,c:'#5a3414',f:'p'});break;}
        }
      }
    }
    if(S.sub&&!S.wet){S.wet=true;FX.wave(hp[0],clamp(Math.abs(S.om)*g.dh*.012,1,10),hp[1]);FX.spray(hp[0],hp[1],5,.6);}
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
          b.setAttribute('aria-label','Éphénégro : touchez-le, il parle ; tirez-le pour faire glisser Éphébito sur sa tringle et allonger ses collants');
          document.body.appendChild(b);S.bN=b;bind(b,1);S.hk='';
          b.style.clipPath=poly(M.n.hull);
        }
        if(S.sw){S.bsv+=(-170*(S.bs-1)-11*S.bsv)*dt;S.bs+=S.bsv*dt;}
      }
    }
    objets();
  }
  /* les collants : deux rubans parallèles, chacun de sa largeur, de son anneau sur la tringle jusqu'à son attache sur le corps ; au lâcher, ils vibrent ensemble */
  function collants(){
    var m=M[S.k],g=S.g,i,k,n=12,sa,w,lx,a,b0,b1,bc,dx,dy,d,nx,ny,t,lat,L,R,gr,
        wig=S.vib>.3?Math.sin(performance.now()/26)*Math.min(16,S.vib):0;
    for(i=0;i<2;i++){
      sa=m.sa[i];if(!sa.d){sa.d=shade(sa.c,.55);sa.l=shade(sa.c,1.5);}
      w=cw2(i);lx=-g.mx+sa.x*g.dw;
      a=[S.rx+lx,S.ry];b0=toW(lx-w/2,S.ext+3);b1=toW(lx+w/2,S.ext+3);bc=[(b0[0]+b1[0])/2,(b0[1]+b1[1])/2];
      dx=bc[0]-a[0];dy=bc[1]-a[1];d=Math.hypot(dx,dy)||1;nx=-dy/d;ny=dx/d;
      L=[];R=[];
      for(k=0;k<=n;k++){
        t=k/n;lat=wig*Math.sin(Math.PI*t);
        L.push([a[0]+nx*w/2+(b0[0]-a[0]-nx*w/2)*t+nx*lat,a[1]+ny*w/2+(b0[1]-a[1]-ny*w/2)*t+ny*lat]);
        R.push([a[0]-nx*w/2+(b1[0]-a[0]+nx*w/2)*t+nx*lat,a[1]-ny*w/2+(b1[1]-a[1]+ny*w/2)*t+ny*lat]);
      }
      cx.beginPath();cx.moveTo(L[0][0],L[0][1]);
      for(k=1;k<=n;k++)cx.lineTo(L[k][0],L[k][1]);
      for(k=n;k>=0;k--)cx.lineTo(R[k][0],R[k][1]);
      cx.closePath();
      gr=cx.createLinearGradient(a[0],a[1],bc[0],bc[1]);gr.addColorStop(0,sa.d);gr.addColorStop(Math.min(1,26/d),sa.c);gr.addColorStop(1,sa.c);
      cx.fillStyle=gr;cx.fill();cx.lineWidth=1;cx.strokeStyle='rgba(0,0,0,.5)';cx.stroke();
      /* un reflet le long du ruban */
      cx.beginPath();
      for(k=0;k<=n;k++){t=k/n;lat=wig*Math.sin(Math.PI*t)-w*.12;var hx=(L[k][0]+R[k][0])/2+nx*lat,hy=(L[k][1]+R[k][1])/2+ny*lat;if(k)cx.lineTo(hx,hy);else cx.moveTo(hx,hy);}
      cx.lineWidth=Math.max(1,w*.18);cx.strokeStyle=sa.l;cx.globalAlpha=.3;cx.stroke();cx.globalAlpha=1;
      /* l'anneau qui glisse sur la tringle */
      cx.beginPath();cx.ellipse(a[0],a[1],w*.5+3,4.5,0,0,TAU);cx.lineWidth=3.6;cx.strokeStyle='#14171a';cx.stroke();cx.lineWidth=1.7;cx.strokeStyle='#b9c1c5';cx.stroke();
    }
  }
  function draw(){
    if(!S||!S.vis)return;
    if(S.lt!==FX.t){S.lt=FX.t;lay();}
    var g=S.g,i,x,p,q;
    collants();
    cx.save();cx.translate(S.ox,S.oy);cx.rotate(S.th);
    cx.drawImage(S.cv[S.k],-g.mx,S.ext,g.dw,g.dh);
    /* ce qu'on lui a planté : clystères (la canule dedans) et crottes */
    for(i=0;i<S.pl.length;i++){
      p=S.pl[i];x=-g.mx+p.u*g.dw;var y=S.ext+p.v*g.dh,s=p.s*S.f;
      if(p.k)FX.SL.clystere(cx,x-Math.cos(p.a)*s*.44,y-Math.sin(p.a)*s*.44,s,p.a);
      else FX.SL.crotte(cx,x,y,s,p.a,.08);
    }
    if(S.born&&S.bs>.01){
      q=M.n.pos;var bw=q[2]*g.dw,bh=q[3]*g.dh,bx=-g.mx+q[0]*g.dw,by=S.ext+q[1]*g.dh,px=bx+M.n.piv[0]*bw,py=by+M.n.piv[1]*bh;
      cx.save();cx.translate(px,py);cx.rotate(S.al);cx.scale(S.bs,S.bs);cx.drawImage(S.cv.n,bx-px,by-py,bw,bh);cx.restore();
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
    for(i=0;i<S.ch.length;i++){
      s=S.ch[i];cx.save();cx.globalAlpha=clamp((7-s.t)/1.2,0,1);cx.translate(s.x,s.y);cx.rotate(s.rot);cx.drawImage(s.cv,-s.w/2,-s.w/2,s.w,s.w);cx.restore();
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
      b.style.transform='translate('+S.ox+'px,'+S.oy+'px) rotate('+S.th+'rad) translate('+(-g.mx)+'px,'+S.ext+'px)';
      if(S.sg){
        /* la prise des collants : un quadrilatère qui suit les deux rubans, des anneaux jusqu'au haut du corps */
        var m2=M[S.k],pad=FX.isM()?22:16,l0=-g.mx+m2.sa[0].x*g.dw-cw2(0)/2,l1=-g.mx+m2.sa[1].x*g.dw+cw2(1)/2,
            q0=toW(l0-pad,S.ext+8),q1=toW(l1+pad,S.ext+8),pth;
        if(S.le>4){
          pth='polygon('+[[S.rx+l0-pad,S.ry-12],[S.rx+l1+pad,S.ry-12],q1,q0].map(function(v){return v[0].toFixed(1)+'px '+v[1].toFixed(1)+'px';}).join(',')+')';
          if(S.sg.style.display)S.sg.style.display='';
          if(!S.sg.style.width||S.sgw!==FX.CW+'x'+FX.CH){S.sgw=FX.CW+'x'+FX.CH;S.sg.style.width=FX.CW+'px';S.sg.style.height=FX.CH+'px';S.sg.style.transform='none';}
          if(S.sgk!==pth){S.sgk=pth;S.sg.style.clipPath=pth;}
        }else S.sg.style.display='none';
      }
      if(S.bN){
        q=M.n.pos;var bw=q[2]*g.dw,bh=q[3]*g.dh,bx=-g.mx+q[0]*g.dw,by=S.ext+q[1]*g.dh,px=bx+M.n.piv[0]*bw,py=by+M.n.piv[1]*bh;
        S.bN.style.display=S.bs>.5?'':'none';
        S.bN.style.width=bw+'px';S.bN.style.height=bh+'px';
        S.bN.style.transform='translate('+S.ox+'px,'+S.oy+'px) rotate('+S.th+'rad) translate('+px+'px,'+py+'px) rotate('+S.al+'rad) translate('+(bx-px)+'px,'+(by-py)+'px)';
      }
    }
  }
  window.Ephebito={pre:pre,ok:ok,boum:boum,S:function(){return S;}};
})();
