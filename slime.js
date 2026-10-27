(function(){
  'use strict';
  var KEY='lcm-slime',busy=false;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
  var lerp=function(a,b,t){return a+(b-a)*t;};
  var fall=function(q){return Math.pow(q,1.55);};

  function mess(s){
    var lobes=[],n=3+((Math.random()*3)|0);
    for(var i=0;i<n;i++)lobes.push({x:(i/(n-1||1)-.5)*s*1.1+rnd(-.08,.08)*s,y:rnd(-.12,.12)*s,r:s*rnd(.22,.36),pts:(function(){var p=[];for(var k=0;k<18;k++)p.push(rnd(.85,1.14));return p;})()});
    var corn=[],seeds=[];
    for(var c=0;c<4;c++)corn.push({x:rnd(-.45,.45)*s,y:rnd(-.2,.2)*s,a:rnd(0,3)});
    for(var q=0;q<7;q++)seeds.push({x:rnd(-.5,.5)*s,y:rnd(-.25,.25)*s});
    return {lobes:lobes,corn:corn,seeds:seeds,drip:rnd(.2,.5)*s,dx:rnd(-.3,.3)*s};
  }
  function blob(c,l){
    var n=l.pts.length;
    c.beginPath();
    for(var i=0;i<=n;i++){
      var a=i/n*6.2832,r=l.r*l.pts[i%n],x=l.x+Math.cos(a)*r*1.18,y=l.y+Math.sin(a)*r*.82;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.closePath();
  }
  function turd(c,x,y,s,rot,m){
    c.save();c.translate(x,y);c.rotate(rot);
    c.lineJoin='round';c.lineWidth=Math.max(2,s*.05);c.strokeStyle='#120802';
    c.fillStyle='#2b1807';
    c.beginPath();c.moveTo(m.dx-s*.05,0);c.quadraticCurveTo(m.dx,m.drip*.6,m.dx,m.drip);c.lineTo(m.dx+s*.05,m.drip*.2);c.lineTo(m.dx+s*.05,0);c.fill();
    c.beginPath();c.arc(m.dx,m.drip,s*.05,0,6.2832);c.fill();
    m.lobes.forEach(function(l){
      var g=c.createRadialGradient(l.x-l.r*.4,l.y-l.r*.5,l.r*.1,l.x,l.y,l.r*1.3);
      g.addColorStop(0,'#7b5a28');g.addColorStop(.45,'#4a2c0e');g.addColorStop(1,'#1e1004');
      c.fillStyle=g;blob(c,l);c.fill();c.stroke();
    });
    c.strokeStyle='rgba(15,8,2,.7)';c.lineWidth=Math.max(1.5,s*.03);
    m.lobes.forEach(function(l){c.beginPath();c.moveTo(l.x-l.r*.7,l.y+l.r*.1);c.quadraticCurveTo(l.x,l.y+l.r*.35,l.x+l.r*.6,l.y-l.r*.05);c.stroke();});
    m.lobes.forEach(function(l){
      c.fillStyle='rgba(255,226,160,.55)';c.beginPath();c.ellipse(l.x-l.r*.35,l.y-l.r*.42,l.r*.3,l.r*.12,-.4,0,6.2832);c.fill();
      c.fillStyle='rgba(150,170,60,.25)';c.beginPath();c.ellipse(l.x+l.r*.3,l.y+l.r*.3,l.r*.3,l.r*.14,.3,0,6.2832);c.fill();
    });
    c.fillStyle='#e0c040';
    m.corn.forEach(function(k){c.save();c.translate(k.x,k.y);c.rotate(k.a);c.beginPath();c.ellipse(0,0,s*.05,s*.032,0,0,6.2832);c.fill();c.restore();});
    c.fillStyle='#0d0601';
    m.seeds.forEach(function(k){c.beginPath();c.arc(k.x,k.y,s*.02,0,6.2832);c.fill();});
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
          F0:-r-L-10,Ff:H+L+r+40,s:rnd(0,.3),d:rnd(.7,1)});
      }
      var chunks=[],bubbles=[],murk=[];
      var cs=clamp(sp*2.6,34,92);
      for(var k=0;k<(W<700?7:13);k++){var j=(Math.random()*n)|0;chunks.push({m:mess(cs),j:j,off:rnd(.05,.9)*H*.6+cs,s:cs*rnd(.8,1.2),rot:rnd(-.6,.6),dx:rnd(-.3,.3)*sp});}
      for(var b=0;b<34;b++)bubbles.push({j:(Math.random()*n)|0,off:rnd(10,H*.7),dx:rnd(-.4,.4),r:rnd(3,9)});
      for(var m=0;m<14;m++)murk.push({j:(Math.random()*n)|0,off:rnd(20,H*.8),r:rnd(30,90)});
      var grad=c.createLinearGradient(0,0,W*.35,H);
      grad.addColorStop(0,'#3f9a1f');grad.addColorStop(.5,'#84d13a');grad.addColorStop(1,'#a8de4a');
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
        c.lineJoin='round';c.lineWidth=8;c.strokeStyle='#0a2e0e';c.stroke(P);
        c.fillStyle=grad;c.fill(P);
        c.save();c.clip(P);
        murk.forEach(function(m){
          var o=cols[m.j],y=S[m.j].F-o.L-m.off;
          var g=c.createRadialGradient(o.x,y,0,o.x,y,m.r);
          g.addColorStop(0,'rgba(90,55,12,.4)');g.addColorStop(1,'rgba(90,55,12,0)');
          c.fillStyle=g;c.fillRect(o.x-m.r,y-m.r,m.r*2,m.r*2);
        });
        cols.forEach(function(o,i){
          var T=S[i].T,F=S[i].F,ya=Math.max(T+o.Lt,-10),yb=F-o.L*.9;
          if(yb>ya&&i%3===0){
            c.lineCap='round';
            c.strokeStyle='rgba(255,255,230,.22)';c.lineWidth=Math.max(2,o.w*.07);
            c.beginPath();c.moveTo(o.x-o.w*.22,ya);c.lineTo(o.x-o.w*.22,yb);c.stroke();
            c.strokeStyle='rgba(8,60,14,.3)';c.lineWidth=Math.max(3,o.w*.13);
            c.beginPath();c.moveTo(o.x+o.w*.28,ya);c.lineTo(o.x+o.w*.28,yb);c.stroke();
          }
          if(F>-o.r&&F<H+o.r){
            c.fillStyle='rgba(255,255,235,.65)';c.beginPath();c.ellipse(o.x-o.r*.35,F-o.r*.3,o.r*.22,o.r*.4,.3,0,6.2832);c.fill();
          }
        });
        bubbles.forEach(function(bb){
          var o=cols[bb.j],y=S[bb.j].F-o.L-bb.off,x=o.x+bb.dx*o.w*.5;
          if(y<-20||y>H+20)return;
          c.strokeStyle='rgba(230,255,200,.7)';c.lineWidth=1.5;c.fillStyle='rgba(255,255,255,.12)';
          c.beginPath();c.arc(x,y,bb.r,0,6.2832);c.fill();c.stroke();
          c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(x-bb.r*.35,y-bb.r*.35,bb.r*.22,0,6.2832);c.fill();
        });
        c.restore();
        chunks.forEach(function(ch){
          var o=cols[ch.j],y=S[ch.j].F-o.L-ch.off;
          if(y<-ch.s||y>H+ch.s)return;
          if(y<S[ch.j].T+ch.s*.6)return;
          turd(c,o.x+ch.dx,y,ch.s,ch.rot,ch.m);
        });
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
  window.Slime={run:run};
})();
