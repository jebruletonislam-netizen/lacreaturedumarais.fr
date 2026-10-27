(function(){
  'use strict';
  var KEY='lcm-slime',busy=false;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var fall=function(q){return Math.pow(q,1.55);};

  /* Palette facon dessin anime (Martin Mystere) : aplats, ombre franche en bas
     a droite, liseré clair en haut a gauche, reflets blancs en trainees. */
  var VERT='#8fd61f',VERT_OMBRE='#4f9a17',VERT_CLAIR='#d6ff86',VERT_TRAIT='#2c6a0c',REFLET='#f4ffd9';
  var BRUN='#8a5524',BRUN_OMBRE='#5a3311',BRUN_CLAIR='#c98d4c',BRUN_TRAIT='#2a1405';

  /* Crotte de dessin anime : trois etages et une pointe, contour franc, ombre
     et reflet en aplats. Origine au milieu de la base ; s = largeur de la base ;
     sq ecrase (>0) ou etire (<0) la forme, pour les rebonds. */
  function crotte(c,x,y,s,rot,sq){
    sq=sq||0;
    c.save();c.translate(x,y);c.rotate(rot||0);c.scale((1+sq*.6)*s/28,(1-sq)*s/28);
    c.lineJoin='round';c.lineCap='round';c.lineWidth=2.2;c.strokeStyle=BRUN_TRAIT;
    var pointe=new Path2D();
    pointe.moveTo(-5,-26);pointe.bezierCurveTo(-4,-33,3,-32,7,-37);pointe.bezierCurveTo(7,-31,5,-27,4,-25);pointe.closePath();
    c.fillStyle=BRUN;c.fill(pointe);c.stroke(pointe);
    [[0,-23.5,7.5,5],[0,-15.5,11,6],[0,-6.5,14,6.8]].forEach(function(e){
      var p=new Path2D();p.ellipse(e[0],e[1],e[2],e[3],0,0,6.2832);
      c.fillStyle=BRUN_OMBRE;c.fill(p);
      c.save();c.clip(p);
      c.fillStyle=BRUN;c.beginPath();c.ellipse(e[0]-e[2]*.12,e[1]-e[3]*.2,e[2]*.92,e[3]*.78,0,0,6.2832);c.fill();
      c.fillStyle=BRUN_CLAIR;c.beginPath();c.ellipse(e[0]-e[2]*.45,e[1]-e[3]*.4,e[2]*.34,e[3]*.26,-.35,0,6.2832);c.fill();
      c.restore();
      c.stroke(p);
    });
    c.fillStyle='#fff3dc';c.beginPath();c.ellipse(-3.4,-25.4,1.7,1,-.4,0,6.2832);c.fill();
    c.restore();
  }
  /* Lignes d'odeur au-dessus d'une crotte (t en secondes). */
  function odeur(c,x,y,s,t){
    c.save();c.lineCap='round';c.lineWidth=Math.max(1.5,s*.075);
    for(var i=0;i<3;i++){
      var ph=(t*.5+i/3)%1,ox=x+(i-1)*s*.34,oy=y-s*1.15-ph*s*.8,a=Math.sin(ph*Math.PI);
      c.strokeStyle='rgba(196,240,96,'+(a*.8).toFixed(2)+')';
      c.beginPath();
      for(var k=0;k<=8;k++){var yy=oy-k*s*.06,xx=ox+Math.sin(k*.9+t*5+i*2)*s*.08;if(k)c.lineTo(xx,yy);else c.moveTo(xx,yy);}
      c.stroke();
    }
    c.restore();
  }

  function run(dir,phase,hold){
    return new Promise(function(resolve){
      var W=window.innerWidth,H=window.innerHeight,dpr=Math.min(window.devicePixelRatio||1,1.5);
      var cv=document.createElement('canvas');
      cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
      cv.setAttribute('aria-hidden','true');
      cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:'+(phase==='reveal'?'none':'auto');
      document.documentElement.appendChild(cv);
      var c=cv.getContext('2d');
      var n=W<700?22:46,sp=W/n,cols=[],D=1.25,DR=1.1,hld=hold||.35;
      for(var i=0;i<n;i++){
        var w=sp*rnd(1.7,2.5),L=H*rnd(.05,.24),r=Math.max(4,w*rnd(.3,.42));
        cols.push({x:(i+.5)*sp+rnd(-sp*.25,sp*.25),w:w,L:L,r:r,Lt:H*rnd(.04,.12),
          F0:-r-L-10,Ff:H+L+r+40,s:rnd(0,.3),d:rnd(.7,1),
          /* reflet : une trainee courte qui descend avec le front de la coulure,
             une autre accrochee plus haut, qui glisse avec la queue du rideau */
          rg:rnd(.15,.6)*L+r,rl:rnd(.25,.5)*L+20,rb:rnd(-.05,.05),rt:rnd(.08,.55)*H,rh:rnd(.04,.1)*H});
      }
      /* des crottes emportees par le slime : grosses, et des miettes */
      var chunks=[];
      var cs=clamp(sp*2.6,34,80);
      for(var k=0;k<(W<700?7:13);k++)chunks.push({j:(Math.random()*n)|0,off:rnd(.05,.9)*H*.6+cs,s:cs*rnd(.75,1.15),rot:rnd(-.5,.5),dx:rnd(-.25,.25)*sp,wob:rnd(0,6.28)});
      for(var b=0;b<(W<700?6:12);b++)chunks.push({j:(Math.random()*n)|0,off:rnd(10,H*.7),s:rnd(11,18),rot:rnd(-.9,.9),dx:rnd(-.35,.35)*sp,wob:rnd(0,6.28)});
      var sy=dir==='up'?-1:1;
      var tCover=D*1.3,tTotal=phase==='both'?tCover+hld+DR*1.3:(phase==='cover'?tCover:DR*1.3);

      function hw(o,y,T,F){
        var b=o.w/2,h=b,nb=F-o.L;
        if(y>nb){var u=clamp((y-nb)/o.L,0,1);u=u*u*(3-2*u);h=Math.min(h,b*(1-.72*u));}
        var nt=y-T;
        if(nt<o.Lt)h=Math.min(h,b*Math.sqrt(clamp(nt/o.Lt,0,1)));
        return h;
      }
      function state(o,t){
        var mode=phase,tt=t;
        if(phase==='both'){
          if(t<tCover)mode='cover';
          else if(t<tCover+hld)return {T:-o.Lt-40,F:o.Ff};
          else{mode='reveal';tt=t-tCover-hld;}
        }
        if(mode==='cover'){
          return {T:-o.Lt-40,F:lerp(o.F0,o.Ff,fall(clamp((tt-o.s*D)/(o.d*D),0,1)))};
        }
        var q=fall(clamp((tt-o.s*DR)/(o.d*DR),0,1));
        return {T:lerp(-o.Lt-40,H+10,q),F:o.Ff};
      }
      var t0=null;
      function frame(now){
        if(t0===null)t0=now;
        var t=(now-t0)/1000;
        c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
        if(dir==='up'){c.translate(0,H);c.scale(1,-1);}
        var P=new Path2D(),S=cols.map(function(o){return state(o,t);});
        cols.forEach(function(o,i){
          var T=S[i].T,F=S[i].F,y0=Math.max(T,-20),y1=Math.min(F-o.r*.5,H+20);
          if(y1>y0){
            var ys=[];for(var y=y0;y<y1;y+=6)ys.push(y);ys.push(y1);
            P.moveTo(o.x+hw(o,ys[0],T,F),ys[0]);
            ys.forEach(function(yy){P.lineTo(o.x+hw(o,yy,T,F),yy);});
            for(var q=ys.length-1;q>=0;q--)P.lineTo(o.x-hw(o,ys[q],T,F),ys[q]);
            P.closePath();
          }
          if(F>-o.r&&F<H+o.r&&F>T){P.moveTo(o.x+o.r,F);P.arc(o.x,F,o.r,0,6.2832);}
        });
        /* contour, puis trois aplats : l'ombre reste en bas a droite, le liseré clair en haut a gauche */
        c.lineJoin='round';c.lineWidth=5;c.strokeStyle=VERT_TRAIT;c.stroke(P);
        c.save();c.clip(P);
        c.fillStyle=VERT_OMBRE;c.fill(P);
        c.save();c.translate(-6,-9*sy);c.fillStyle=VERT_CLAIR;c.fill(P);c.restore();
        c.save();c.translate(-3,-5*sy);c.fillStyle=VERT;c.fill(P);c.restore();
        /* les crottes baignent dans le slime : dessinees dedans, puis voilees */
        chunks.forEach(function(ch){
          var o=cols[ch.j],y=S[ch.j].F-o.L-ch.off;
          if(y<-ch.s*2||y>H+ch.s*2)return;
          if(y<S[ch.j].T+ch.s*.6)return;
          c.save();c.translate(o.x+ch.dx,y);if(sy<0)c.scale(1,-1);
          crotte(c,0,0,ch.s,ch.rot+Math.sin(t*4+ch.wob)*.12,Math.sin(t*6+ch.wob)*.06);
          /* elle s'enfonce : un bourrelet de slime lui mange le bas, cerne d'ombre et de reflet */
          var bx=ch.s*.68,by=ch.s*.2,bc=-ch.s*.04;
          c.fillStyle=VERT;c.beginPath();c.ellipse(0,bc,bx,by,0,0,6.2832);c.fill();
          c.lineCap='round';c.lineWidth=Math.max(1.5,ch.s*.06);
          c.strokeStyle=VERT_OMBRE;c.beginPath();c.ellipse(0,bc,bx,by,0,Math.PI*1.06,Math.PI*1.94);c.stroke();
          c.strokeStyle=REFLET;c.beginPath();c.ellipse(0,bc+by*.25,bx*.8,by*.7,0,Math.PI*1.12,Math.PI*1.38);c.stroke();
          c.restore();
        });
        c.globalAlpha=.16;c.fillStyle=VERT;c.fill(P);c.globalAlpha=1;
        /* reflets : trainees blanches courtes et galbees, eclat sur les gouttes */
        c.lineCap='round';
        cols.forEach(function(o,i){
          var T=S[i].T,F=S[i].F,yb=F-o.rg,ya=Math.max(yb-o.rl,T+o.Lt);
          var xr=o.x-o.w*.27;
          if(yb>ya+8&&i%2===0){
            c.strokeStyle=REFLET;c.globalAlpha=.9;c.lineWidth=Math.max(2.5,o.w*.08);
            c.beginPath();c.moveTo(xr,ya);c.quadraticCurveTo(xr+o.w*o.rb*4,(ya+yb)/2,xr+o.w*.04,yb);c.stroke();
            c.globalAlpha=1;
          }
          /* du relief : une arete d'ombre au-dessus de la goutte, quelques reflets plus haut */
          var bas=F-o.L*.9,haut=Math.max(T+o.Lt+10,F-o.L*2.4),h1=T+o.Lt+o.rt,h2=Math.min(h1+o.rh,bas);
          if(i%3===1&&bas>haut+20){
            c.strokeStyle=VERT_OMBRE;c.globalAlpha=.5;c.lineWidth=Math.max(2,o.w*.07);
            c.beginPath();c.moveTo(o.x+o.w*.3,haut);c.lineTo(o.x+o.w*.3,bas);c.stroke();
            c.globalAlpha=1;
          }
          if(i%4===1&&h2>h1+10){
            c.strokeStyle=REFLET;c.globalAlpha=.85;c.lineWidth=Math.max(2.5,o.w*.08);
            c.beginPath();c.moveTo(xr,h1);c.quadraticCurveTo(xr+o.w*o.rb*4,(h1+h2)/2,xr+o.w*.03,h2);c.stroke();
            c.globalAlpha=1;
          }
          if(F>-o.r&&F<H+o.r){
            c.fillStyle=REFLET;c.beginPath();c.ellipse(o.x-o.r*.38,F-o.r*.3*sy,o.r*.16,o.r*.34,.3*sy,0,6.2832);c.fill();
          }
        });
        c.restore();
        document.documentElement.classList.remove('slx');
        if(t<tTotal){requestAnimationFrame(frame);}
        else{
          if(phase==='cover'){resolve();}
          else{cv.remove();resolve();}
        }
      }
      requestAnimationFrame(frame);
      cv._lcm=true;
    });
  }

  function clearCover(){
    var el=document.documentElement;
    el.classList.remove('slx');
    Array.prototype.forEach.call(document.querySelectorAll('canvas'),function(x){if(x._lcm)x.remove();});
  }

  var arriving=null;
  try{arriving=sessionStorage.getItem(KEY);sessionStorage.removeItem(KEY);}catch(e){}
  if(arriving&&!reduce){
    busy=true;
    run(arriving,'reveal').then(function(){busy=false;});
  }else{
    document.documentElement.classList.remove('slx');
  }
  window.addEventListener('pageshow',function(e){if(e.persisted){clearCover();busy=false;}});

  document.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
    var a=ev.target.closest&&ev.target.closest('a[data-slime]');
    if(a){
      ev.preventDefault();
      if(busy)return;
      var dir=a.getAttribute('data-slime'),href=a.href;
      if(reduce){location.href=href;return;}
      busy=true;
      run(dir,'cover').then(function(){
        try{sessionStorage.setItem(KEY,dir);}catch(e){}
        location.href=href;
        setTimeout(function(){clearCover();busy=false;},4000);
      });
      return;
    }
    var d=ev.target.closest&&ev.target.closest('#trap');
    if(d&&!busy&&!reduce){busy=true;run('down','both').then(function(){busy=false;});}
  });
  /* crotte et odeur sont aussi utilisees par la flaque du mode putride (putride.js) */
  window.Slime={run:run,crotte:crotte,odeur:odeur,couleurs:{vert:VERT,ombre:VERT_OMBRE,clair:VERT_CLAIR,trait:VERT_TRAIT,reflet:REFLET}};
})();
