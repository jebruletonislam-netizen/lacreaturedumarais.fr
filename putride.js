(function(){
  /* Pages d'album : lecture et paroles */
  var CLIPS={'Chimaera Rothomagensis':'A_SfjREwRWI','La côte Sainte-Catherine':'bThq8uPYgFA','La Chute':'34-C5ls5eWM','Dis, ferme un instant les yeux':'65E0wA7msv4','Jubilé':'btnbqG0_kc0','Misérables':'7K6sEj3D5BQ'};
  function cfg(s,i,t){
    var o={index:i,title:t||s.dataset.title,artist:s.dataset.artist,art:s.dataset.art};
    if(s.dataset.sc)o.sc=s.dataset.sc;else o.section=s.dataset.sec;
    return o;
  }
  document.addEventListener('click',function(ev){
    var t=ev.target.closest&&ev.target.closest('[data-all],.trp');
    if(!t||!window.LCMPlayer)return;
    var s=t.closest('.alp');if(!s)return;
    ev.preventDefault();
    var loc=function(b){
      var o=cfg(s,0,b.querySelector('span').textContent);
      o.src=b.dataset.src;
      o.list=Array.prototype.map.call(s.querySelectorAll('.trp[data-src]'),function(x){return {src:x.dataset.src,title:x.querySelector('span').textContent};});
      return o;
    };
    if(t.matches('.trp'))LCMPlayer.play(t.dataset.src?loc(t):cfg(s,+t.dataset.i,t.querySelector('span').textContent));
    else if(!s.dataset.sc&&s.querySelector('.trp[data-src]'))LCMPlayer.play(loc(s.querySelector('.trp[data-src]')));
    else LCMPlayer.play(cfg(s,0));
  });
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('.lyb');
    if(!b)return;
    ev.preventDefault();
    var row=b.closest('.trw'),nx=row.nextElementSibling;
    if(nx&&nx.classList.contains('lyw')){nx.remove();return;}
    var w=document.createElement('div');w.className='lyw';
    var g={id:b.dataset.g,url:b.dataset.gu},t=b.dataset.t;
    var f=document.createElement('iframe');f.className='lyf';f.title='Paroles de '+t;f.loading='lazy';
    f.srcdoc="<!doctype html><html><head><meta charset='utf-8'><base target='_blank'><style>html,body{margin:0;padding:0;background:#fff;color:#000;color-scheme:light}body{padding:.5rem;font:16px/1.4 Arial,sans-serif}</style></head><body><div id='rg_embed_link_"+g.id+"' class='rg_embed_link' data-song-id='"+g.id+"'><a href='"+g.url+"'>Paroles de \u201C"+t.replace(/&/g,'&amp;')+"\u201D \u2014 Les Retard-Tinables</a></div><script crossorigin src='https://genius.com/songs/"+g.id+"/embed.js'><\/script></body></html>";
    var fit=function(){try{var h=f.contentDocument.documentElement.scrollHeight;if(h>40)f.style.height=h+'px';}catch(e){}};
    f.addEventListener('load',function(){fit();var n=0,iv=setInterval(function(){fit();if(++n>40||!f.isConnected)clearInterval(iv);},500);});
    w.appendChild(f);
    var after=row.nextElementSibling&&row.nextElementSibling.classList.contains('trn')?row.nextElementSibling:row;
    after.after(w);
  });
  function lyrics(b,t){
    var g=window.LCM_G&&window.LCM_G[t],yt=CLIPS[t];
    if(yt){
      var c=document.createElement('button');c.type='button';c.className='vid big';c.dataset.yt=yt;c.dataset.t=t+' (clip)';c.textContent='\u25B6 CLIP';
      b.appendChild(c);
    }
    if(g){
      var f=document.createElement('iframe');f.className='lyf';f.title='Paroles de '+t;f.loading='lazy';
      f.srcdoc="<!doctype html><html><head><meta charset='utf-8'><base target='_blank'><style>html,body{margin:0;padding:0;background:#fff;color:#000;color-scheme:light}body{padding:.5rem;font:16px/1.4 Arial,sans-serif}</style></head><body><div id='rg_embed_link_"+g.id+"' class='rg_embed_link' data-song-id='"+g.id+"'><a href='"+g.url+"'>Paroles de \u201C"+t.replace(/&/g,'&amp;')+"\u201D \u2014 Cul-Pointu</a></div><script crossorigin src='https://genius.com/songs/"+g.id+"/embed.js'><\/script></body></html>";
      var fit=function(){try{var h=f.contentDocument.documentElement.scrollHeight;if(h>40)f.style.height=h+'px';}catch(e){}};
      f.addEventListener('load',function(){fit();var n=0,iv=setInterval(function(){fit();if(++n>40||!f.isConnected)clearInterval(iv);},500);});
      b.appendChild(f);
    }else if(!yt){
      var p=document.createElement('p');p.className='lypend';p.textContent='Paroles \u00E0 venir';b.appendChild(p);
    }
  }
  document.addEventListener('toggle',function(ev){
    var d=ev.target;
    if(!d.matches||!d.matches('.alp .tl details'))return;
    var b=d.querySelector('.ly'),s=d.closest('.alp');
    if(!d.open){b.textContent='';d.dataset.l='';return;}
    Array.prototype.forEach.call(d.parentNode.querySelectorAll('details[open]'),function(o){if(o!==d)o.open=false;});
    if(d.dataset.l)return;d.dataset.l=1;
    var t=d.dataset.t,i=Array.prototype.indexOf.call(d.parentNode.children,d);
    if(window.LCMPlayer)LCMPlayer.play(cfg(s,i,t));
    var go=function(){if(d.open&&d.dataset.l)lyrics(b,t);};
    if(window.LCM_G)go();else loadScript('/putride-genius.js?v=2').then(go);
  },true);

  /* Modale vidéo YouTube */
  function closeVid(){var m=document.getElementById('vmodal');if(m)m.remove();document.removeEventListener('keydown',escVid);}
  function escVid(ev){if(ev.key==='Escape')closeVid();}
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('[data-yt]');
    if(a){
      ev.preventDefault();closeVid();
      if(window.LCMPlayer)LCMPlayer.pause();
      var m=document.createElement('div');m.id='vmodal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
      m.innerHTML='<div class="vbox"><div class="vbar"><span></span><button type="button" class="vx" aria-label="Fermer la vidéo">✕</button></div><div class="vfr"><iframe allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Lecteur YouTube"></iframe></div></div>';
      m.querySelector('span').textContent=a.dataset.t||'';
      m.querySelector('iframe').src='https://www.youtube-nocookie.com/embed/'+a.getAttribute('data-yt')+'?autoplay=1&rel=0';
      document.body.appendChild(m);
      document.addEventListener('keydown',escVid);
      return;
    }
    var m2=document.getElementById('vmodal');
    if(m2&&(ev.target===m2||ev.target.closest('.vx')))closeVid();
  });

  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('[data-lb]');
    if(!a||!window.openLB)return;
    ev.preventDefault();
    var g=a.closest('.gal,.rt'),L=g?[].slice.call(g.querySelectorAll('a[data-lb]')):[a];
    window.openLB(L.map(function(l){return {src:l.getAttribute('href'),alt:l.dataset.lb};}),Math.max(0,L.indexOf(a)));
  });

  /* Éveil d'Éphébus */
  function tog(e){var on=e.classList.toggle('on');e.setAttribute('aria-pressed',on);}
  document.addEventListener('pointerdown',function(ev){
    var e=ev.target.closest&&ev.target.closest('#eph,.fx');
    if(e&&ev.pointerType!=='mouse')tog(e);
  });
  document.addEventListener('keydown',function(ev){
    var e=ev.target.closest&&ev.target.closest('#eph,.fx');
    if(e&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();tog(e);}
  });

  /* Navigation sans rechargement : le lecteur survit */
  var busy=false;
  function loadScript(src){return new Promise(function(r){var s=document.createElement('script');s.src=src;s.onload=s.onerror=r;document.head.appendChild(s);});}
  function swap(url,push){
    return fetch(url).then(function(r){if(!r.ok)throw 0;return r.text();}).then(function(h){
      var d=new DOMParser().parseFromString(h,'text/html');
      var nw=d.querySelector('.wrap'),ow=document.querySelector('.wrap');
      if(!nw||!ow)throw 0;
      var want=[];
      Array.prototype.forEach.call(d.querySelectorAll('link[rel=stylesheet][href^="http"]'),function(l){
        if(!document.querySelector('link[href="'+l.getAttribute('href')+'"]'))document.head.appendChild(l.cloneNode());
      });
      Array.prototype.forEach.call(d.querySelectorAll('script[src^="http"]'),function(s){
        var u=s.getAttribute('src');
        if(!document.querySelector('script[src="'+u+'"]'))want.push(loadScript(u));
      });
      var inl=Array.prototype.filter.call(d.querySelectorAll('body script:not([src])'),function(s){return s.textContent.trim();});
      var hd=document.querySelector('header'),nh=d.querySelector('header');
      return Promise.all(want).then(function(){
        document.title=d.title;
        if(hd&&nh)hd.innerHTML=nh.innerHTML;
        ow.innerHTML=nw.innerHTML;
        if(push)history.pushState({},'',url);
        window.scrollTo(0,0);
        document.dispatchEvent(new Event('putride:page'));
        inl.forEach(function(s){var x=document.createElement('script');x.textContent=s.textContent;document.body.appendChild(x);x.remove();});
      });
    });
  }
  document.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
    var a=ev.target.closest&&ev.target.closest('a[href]');
    if(!a||a.target||a.hasAttribute('data-lb')||a.hasAttribute('download'))return;
    var h=a.getAttribute('href');
    if(!/^\/mode-putride\/[^#?]*$/.test(h)||busy)return;
    ev.preventDefault();busy=true;
    swap(h,true).catch(function(){location.href=h;}).then(function(){busy=false;});
  });
  window.addEventListener('popstate',function(){
    var p=location.pathname;
    if(/^\/mode-putride\//.test(p))swap(p,false).catch(function(){location.reload();});
    else location.reload();
  });

  /* images hors ecran : chargement differe et decodage asynchrone (telephones modestes) */
  Array.prototype.forEach.call(document.images,function(im,i){if(i>1){if(!im.loading)im.loading='lazy';im.decoding='async';}});

  /* Gouttes de slime accrochées aux bords verts */
  (function(){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    var rnd=function(a,b){return a+Math.random()*(b-a);};
    /* couleurs et crottes de dessin anime : definies dans slime.js */
    var SL=window.Slime||{},CO=SL.couleurs||{vert:'#8fd61f',ombre:'#4f9a17',clair:'#d6ff86',trait:'#2c6a0c',reflet:'#f4ffd9'};
    var layer=document.createElement('div');layer.id='drips';layer.setAttribute('aria-hidden','true');
    document.body.appendChild(layer);
    var lvl=0,pool=null,dl=0,tilt=0,tiltT=0,tv=0,vidFin=0,lvlVid=0,VIDANGE=2.4;
    var isM=function(){return innerWidth<900;};
    var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
    var inc=function(w){return w*w*.035*(isM()?2.2:1);};
    var mainBox=function(){var m=document.querySelector('main');return m&&m.getBoundingClientRect();};
    var cap=function(){var m=document.querySelector('main');return Math.min(innerHeight*(isM()?.08:.11),m?m.offsetHeight*.5:1e9);};
    /* mobile : fluide simule en particules ; gravite et secousses viennent des capteurs du telephone */
    var cv=document.createElement('canvas');cv.id='mpool';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
    var cx=cv.getContext('2d'),lo=document.createElement('canvas'),lc=lo.getContext('2d',{willReadFrequently:true});
    var LOW=(navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||4)<=4||innerWidth*(window.devicePixelRatio||1)<700;var dpr=LOW?1:Math.min(window.devicePixelRatio||1,1.5);
    var CW=0,CH=0,LW=0,LH=0,GC=0,GR=0;
    var S=11,H=24,H2=H*H,NMAX=LOW?260:420,SC=LOW?.27:.35,AREA=S*S*.866,SR=Math.ceil(H*.62*SC),KP=1.1,KN=2.2;
    var P=[],drops=[],items=[],bo=0,pendX=0,top=[],head=null,nxt=new Int32Array(NMAX+8),tnow=0;
    var gx=0,gy=1,gm=1,tgx=0,tgy=1,tgm=1,fing=null;
    var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    var spr=document.createElement('canvas');spr.width=spr.height=SR*2+2;
    (function(){var c=spr.getContext('2d'),g=c.createRadialGradient(SR+1,SR+1,0,SR+1,SR+1,SR);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(.5,'rgba(255,255,255,.13)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,SR*2+2,SR*2+2);})();
    var RHO0=0;
    (function(){for(var i=-5;i<=5;i++)for(var j=-5;j<=5;j++){if(!i&&!j)continue;var x=S*(i+.5*(j&1)),y=S*.866*j,d=Math.sqrt(x*x+y*y);if(d<H){var q=1-d/H;RHO0+=q*q;}}})();
    var bOff=function(){var m=mainBox();return m?Math.max(0,innerHeight-m.bottom):0;};
    var floorY=function(){return CH-bo-4;};
    function sizeCv(){
      CW=innerWidth;CH=innerHeight;cv.width=Math.round(CW*dpr);cv.height=Math.round(CH*dpr);cx.setTransform(dpr,0,0,dpr,0,0);
      LW=Math.ceil(CW*SC);LH=Math.ceil(CH*SC);lo.width=LW;lo.height=LH;
      GC=Math.ceil(CW/H)+2;GR=Math.ceil(CH/H)+2;head=new Int32Array(GC*GR);top.length=Math.ceil(CW/12)+2;
    }
    sizeCv();bo=bOff();pendX=CW/2;
    addEventListener('resize',sizeCv);
    var vsurf=function(x){var t=top[clamp(Math.floor(x/12),0,top.length-1)];return t==null||t>=1e9?floorY():t;};
    function spit(x,y,n,pw){
      for(var i=0;i<n&&drops.length<60;i++)drops.push({x:x+rnd(-6,6),y:y,vx:-gx*rnd(100,420)*pw+rnd(-170,170)*pw,vy:-gy*rnd(100,420)*pw+rnd(-170,170)*pw,r:rnd(1.6,4.2),l:rnd(.5,1.2)});
    }
    [0,1,0,0,1,0,1,0].forEach(function(k,q){items.push({k:k,thr:10+q*9,on:false,x:0,y:0,vx:0,vy:0,rot:0,s:0,sq:0,z:rnd(.85,1.15)});});
    function resetFx(){P.length=0;drops.length=0;pendX=CW/2;items.forEach(function(it){it.on=false;it.s=0;});}
    /* le fluide subit la gravite moins l'acceleration du telephone : incliner ou secouer le fait couler de tous les cotes */
    var onMot=function(ev){
      var a=ev.accelerationIncludingGravity;if(!a||a.x==null||a.y==null)return;
      var s=ios?-1:1,ax=a.x*s,ay=a.y*s,an=(screen.orientation&&screen.orientation.angle)||0,x,y;
      if(an===90){x=ay;y=ax;}else if(an===270||an===-90){x=-ay;y=-ax;}else if(an===180){x=ax;y=-ay;}else{x=-ax;y=ay;}
      x/=9.8;y/=9.8;
      var m=Math.sqrt(x*x+y*y);
      if(m<.12){tgx=0;tgy=1;tgm=.3;return;}
      tgx=x/m;tgy=y/m;tgm=clamp(m,.18,3.4);
    };
    if(window.DeviceMotionEvent){
      if(typeof DeviceMotionEvent.requestPermission==='function'){
        document.addEventListener('touchend',function(){DeviceMotionEvent.requestPermission().then(function(s){if(s==='granted')addEventListener('devicemotion',onMot);}).catch(function(){});},{once:true});
      }else addEventListener('devicemotion',onMot);
    }
    /* un doigt dans le fluide le brasse */
    var tmv=function(ev){
      var t=ev.touches[0],n=performance.now();
      if(!t){fing=null;return;}
      if(!fing||ev.type==='touchstart'){fing={x:t.clientX,y:t.clientY,vx:0,vy:0,t:n};if(ev.type==='touchstart'&&P.length&&t.clientY>vsurf(t.clientX)-40)spit(t.clientX,vsurf(t.clientX),5,.8);return;}
      var dt=Math.max(8,n-fing.t)/1000;
      fing.vx=fing.vx*.5+(t.clientX-fing.x)/dt*.5;fing.vy=fing.vy*.5+(t.clientY-fing.y)/dt*.5;
      fing.x=t.clientX;fing.y=t.clientY;fing.t=n;
    };
    document.addEventListener('touchstart',tmv,{passive:true});
    document.addEventListener('touchmove',tmv,{passive:true});
    document.addEventListener('touchend',tmv,{passive:true});
    document.addEventListener('touchcancel',function(){fing=null;},{passive:true});
    var NB=new Int32Array(80),NQ=new Float32Array(80),NX=new Float32Array(80),NY=new Float32Array(80);
    function step(dt){
      var n=P.length,i,j,k,p,A=1900*gm,ax=gx*A,ay=gy*A,minx=6,maxx=CW-6,miny=6,maxy=floorY(),c,sp,f;
      for(i=0;i<n;i++){
        p=P[i];p.vx=(p.vx+ax*dt)*.996;p.vy=(p.vy+ay*dt)*.996;
        if(fing){
          var fx=p.x-fing.x,fy=p.y-fing.y,fd=fx*fx+fy*fy;
          if(fd<3364){fd=Math.sqrt(fd)||1;var w=1-fd/58;p.vx+=(fing.vx-p.vx)*w*.25+fx/fd*700*w*dt;p.vy+=(fing.vy-p.vy)*w*.25+fy/fd*700*w*dt;}
        }
        sp=p.vx*p.vx+p.vy*p.vy;if(sp>2.4e6){f=1550/Math.sqrt(sp);p.vx*=f;p.vy*=f;}
        p.px=p.x;p.py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;
      }
      head.fill(-1);
      for(i=0;i<n;i++){p=P[i];p.x=clamp(p.x,minx,maxx);p.y=clamp(p.y,miny,maxy);c=((p.y/H)|0)*GC+((p.x/H)|0);nxt[i]=head[c];head[c]=i;}
      for(i=0;i<n;i++){
        p=P[i];
        var cnt=0,rho=0,rn=0,gcx=(p.x/H)|0,gcy=(p.y/H)|0,cy0,cx0;
        for(cy0=gcy-1;cy0<=gcy+1;cy0++){
          if(cy0<0||cy0>=GR)continue;
          for(cx0=gcx-1;cx0<=gcx+1;cx0++){
            if(cx0<0||cx0>=GC)continue;
            for(j=head[cy0*GC+cx0];j>=0;j=nxt[j]){
              if(j===i)continue;
              var o=P[j],dx=o.x-p.x,dy=o.y-p.y,d2=dx*dx+dy*dy;
              if(d2<H2&&cnt<80){
                var d=Math.sqrt(d2);
                if(d<.05){dx=Math.random()-.5;dy=Math.random()-.5;var l=Math.sqrt(dx*dx+dy*dy)||1;dx/=l;dy/=l;d=.05;}else{dx/=d;dy/=d;}
                var q=1-d/H;NB[cnt]=j;NQ[cnt]=q;NX[cnt]=dx;NY[cnt]=dy;cnt++;rho+=q*q;rn+=q*q*q;
              }
            }
          }
        }
        var Pp=KP*(rho-RHO0),Pn=KN*rn;
        if(Pp<-KP*RHO0*.3)Pp=-KP*RHO0*.3;
        for(k=0;k<cnt;k++){
          var qq=NQ[k],D=.5*(Pp*qq+Pn*qq*qq),jp=P[NB[k]];
          jp.x+=D*NX[k];jp.y+=D*NY[k];p.x-=D*NX[k];p.y-=D*NY[k];
        }
      }
      for(i=0;i<n;i++){
        p=P[i];var ox=p.x,oy=p.y;
        p.x=clamp(p.x,minx,maxx);p.y=clamp(p.y,miny,maxy);
        p.vx=(p.x-p.px)/dt;p.vy=(p.y-p.py)/dt;
        if((p.x!==ox||p.y!==oy)&&Math.abs(ox-p.x)+Math.abs(oy-p.y)>3&&Math.random()<.08)spit(p.x,p.y,1,.7);
      }
      for(i=items.length-1;i>=0;i--){
        var it=items[i];if(!it.on)continue;
        /* une crotte qui s'en va retrecit doucement au lieu de disparaitre */
        it.s=it.sort?it.s-dt*2:Math.min(1,it.s+dt*3);
        if(it.s<=0&&it.sort){it.on=false;it.sort=false;it.s=0;continue;}
        it.vx+=ax*dt;it.vy+=ay*dt;
        var nc=0,mvx=0,mvy=0,icx=clamp((it.x/H)|0,0,GC-1),icy=clamp((it.y/H)|0,0,GR-1);
        for(var yy=Math.max(0,icy-1);yy<=Math.min(GR-1,icy+1);yy++)for(var xx=Math.max(0,icx-1);xx<=Math.min(GC-1,icx+1);xx++)for(j=head[yy*GC+xx];j>=0;j=nxt[j]){
          var ddx=P[j].x-it.x,ddy=P[j].y-it.y;
          if(ddx*ddx+ddy*ddy<900){nc++;mvx+=P[j].vx;mvy+=P[j].vy;}
        }
        if(nc){
          var bu=Math.min(1,nc/8),kk=Math.min(1,dt*6*bu);
          it.vx-=ax*dt*1.3*bu;it.vy-=ay*dt*1.3*bu;
          it.vx+=(mvx/nc-it.vx)*kk;it.vy+=(mvy/nc-it.vy)*kk;
        }
        it.x+=it.vx*dt;it.y+=it.vy*dt;
        if(it.x<14){it.x=14;it.vx*=-.4;}else if(it.x>CW-14){it.x=CW-14;it.vx*=-.4;}
        if(it.y>maxy-7){it.y=maxy-7;it.vy*=-.3;it.vx*=.9;}else if(it.y<14){it.y=14;it.vy*=-.3;}
        it.rot+=((clamp(it.vx/500,-1,1)*.7+Math.sin(tnow/700+i)*.18)-it.rot)*Math.min(1,dt*6);
        /* une crotte flotte : remontee vers la surface, la pointe hors du slime */
        if(nc){var sf=vsurf(it.x)+9*it.z;it.vy-=clamp(it.y-sf,-30,60)*38*dt;it.vy*=1-Math.min(1,dt*3);}
        var sqv=clamp(-Math.abs(it.vy)/1400,-.18,0);if(it.y>=maxy-7.5&&it.vy<0)sqv=.22;
        it.sq+=(sqv-it.sq)*Math.min(1,dt*9);
      }
      for(i=drops.length-1;i>=0;i--){
        var dd=drops[i];dd.vx+=ax*dt;dd.vy+=ay*dt;dd.x+=dd.vx*dt;dd.y+=dd.vy*dt;dd.l-=dt;
        if(dd.l<=0||dd.x<0||dd.x>CW||dd.y<0||dd.y>maxy+2)drops.splice(i,1);
      }
    }
    function drawItem(it){
      var e=it.s,pop=e<1&&!it.sort?1+Math.sin(e*Math.PI)*.35:1;
      if(SL.crotte)SL.crotte(cx,it.x,it.y+10*it.z,28*it.z*Math.min(1,e*1.4)*pop,it.rot,it.sq);
    }
    function odeurs(){
      if(!SL.odeur)return;
      items.forEach(function(it){if(it.on&&it.s>.6)SL.odeur(cx,it.x,it.y+10*it.z,26*it.z,tnow/1000+it.thr);});
    }
    /* reflet blanc qui suit la surface du slime, en traits qui glissent doucement */
    function reflets(){
      cx.save();cx.strokeStyle=CO.reflet;cx.globalAlpha=.85;cx.lineWidth=2.4;cx.lineCap='round';cx.lineJoin='round';
      cx.setLineDash([30,16,9,34,20,28]);cx.lineDashOffset=-tnow/80;
      cx.beginPath();var on=false,py=0;
      for(var i=0;i<top.length;i++){var t=top[i];if(t>=1e9){on=false;continue;}var x=i*12+6,y=t+8;if(on&&Math.abs(y-py)<12)cx.lineTo(x,y);else cx.moveTo(x,y);on=true;py=y;}
      cx.stroke();cx.restore();
    }
    function drawFluid(){
      var i,n=P.length;
      lc.globalCompositeOperation='source-over';lc.clearRect(0,0,LW,LH);lc.globalCompositeOperation='lighter';
      for(i=0;i<n;i++)lc.drawImage(spr,P[i].x*SC-SR-1,P[i].y*SC-SR-1);
      var im=lc.getImageData(0,0,LW,LH),d=im.data,len=d.length,v,t,s;
      for(i=0;i<len;i+=4){
        v=d[i+3];
        if(v<62){d[i+3]=0;continue;}
        /* facon dessin anime : un lisere sombre au bord, puis un aplat citron translucide : on lit le texte au travers */
        if(v<80){d[i]=44;d[i+1]=106;d[i+2]=12;d[i+3]=255;}
        else if(v<96){d[i]=79;d[i+1]=154;d[i+2]=23;d[i+3]=205;}
        else{d[i]=143;d[i+1]=214;d[i+2]=31;d[i+3]=150;}
      }
      lc.putImageData(im,0,0);
      cx.drawImage(lo,0,0,CW,CH);
    }
    var last=performance.now(),skip=0;
    (function frame(now){
      var dt=Math.min(.05,((now||last)-last)/1000||0);last=now||last;tnow=last;
      var work=false;
      if(isM()&&!document.hidden&&!(LOW&&(skip^=1)&&P.length)){
        if(innerWidth!==CW||innerHeight!==CH)sizeCv();
        bo=bOff();
        gx+=(tgx-gx)*.35;gy+=(tgy-gy)*.35;gm+=(tgm-gm)*.35;tilt+=(gx-tilt)*.1;
        /* vidange : le niveau baisse, on retire des particules au hasard, les crottes coulent */
        if(vidFin){var reste=clamp((vidFin-last)/1000,0,VIDANGE);lvl=lvlVid*reste/VIDANGE;var garde=Math.round(lvl*CW/AREA);while(P.length>garde)P.splice((Math.random()*P.length)|0,1);if(!reste){vidFin=0;lvl=0;resetFx();}}
        var target=Math.min(NMAX,Math.round(lvl*CW/AREA)),k=0,i;
        while(P.length<target&&k<3){
          var sx=clamp((pendX||CW/2)+rnd(-8,8),10,CW-10);
          P.push({x:sx,y:Math.min(vsurf(sx)-14,floorY()-8),px:0,py:0,vx:rnd(-30,30),vy:140});k++;
        }
        items.forEach(function(it){
          if(!it.on&&lvl>it.thr){it.on=true;it.sort=false;it.s=0;it.x=clamp(pendX||CW/2,20,CW-20)+rnd(-20,20);it.y=Math.max(14,vsurf(it.x)-30);it.vx=0;it.vy=0;it.rot=0;}
          else if(it.on&&lvl<it.thr-8)it.sort=true;
        });
        var any=P.length||drops.length||items.some(function(it){return it.on;});
        work=!!any;
        if(any){
          var ns=clamp(Math.round(dt*60),1,3);
          for(i=0;i<ns;i++)step(1/60);
          for(i=0;i<top.length;i++)top[i]=1e9;
          for(i=0;i<P.length;i++){var ci=Math.floor(P[i].x/12),yy=P[i].y-4;if(ci>=0&&ci<top.length&&yy<top[ci])top[ci]=yy;}
          /* les crottes d'abord : le slime passe par-dessus, seule la pointe depasse */
          cx.clearRect(0,0,CW,CH);
          items.forEach(function(it){if(it.on)drawItem(it);});
          drawFluid();reflets();odeurs();
          cx.fillStyle=CO.vert;cx.strokeStyle=CO.trait;cx.lineWidth=1.2;
          drops.forEach(function(d){cx.beginPath();cx.ellipse(d.x,d.y,d.r*(1+Math.min(1,Math.hypot(d.vx,d.vy)/1500)),d.r,Math.atan2(d.vy,d.vx),0,6.3);cx.fill();cx.stroke();});
        }else cx.clearRect(0,0,CW,CH);
      }
      if(work||(LOW&&P.length))requestAnimationFrame(frame);else setTimeout(function(){requestAnimationFrame(frame);},document.hidden?1000:220);
    })(last);
    var show=function(){
      var m=document.querySelector('main');if(!m)return;
      if(!pool||pool.parentNode!==m){pool=document.createElement('div');pool.className='dpool';pool.setAttribute('aria-hidden','true');m.appendChild(pool);}
      pool.style.height=lvl+'px';pool.style.opacity=lvl>1?1:0;
    };
    /* chaque nouvelle page repart d'un sol propre */
    document.addEventListener('putride:page',function(){if(isM()&&P.length){vidFin=performance.now()+VIDANGE*1000;lvlVid=lvl;}else{lvl=0;resetFx();}dl=0;pool=null;layer.textContent='';show();});
    show();
    function sources(){
      var r=[],m=mainBox();if(!m)return r;
      var a=Math.max(m.left,0)+10,b=Math.min(m.right,innerWidth-16)-10,floor=isM()?innerHeight-bOff()-lvl:m.bottom-lvl;
      /* sous les barres du haut, ce sont les coulures de la nappe qui lachent les gouttes (cf. plus bas) */
      Array.prototype.forEach.call(document.querySelectorAll('main h2'),function(e){var q=e.getBoundingClientRect();if(q.bottom>180&&q.bottom<Math.min(innerHeight,floor)-120)r.push({y:q.bottom-2,a:q.left+10,b:Math.min(q.right,q.left+400)});});
      return r;
    }
    function splash(x,y,w){
      if(isM())pendX=x;
      var add=function(cls,css){var e=document.createElement('i');e.className=cls;e.style.cssText=css;layer.appendChild(e);return e;};
      lvl=Math.min(cap(),lvl+inc(w));show();
      var bu=add('dbu','left:'+(x-24)+'px;top:'+(y-14)+'px');
      bu.animate([{transform:'scale(.3,.1)'},{transform:'scale(1.05,1)',offset:.35},{transform:'scale(.4,0)'}],{duration:520,easing:'ease-out'}).finished.then(function(){bu.remove();});
      var rp=add('drp','left:'+(x-22)+'px;top:'+(y-4)+'px');
      rp.animate([{transform:'scale(.2)',opacity:.9},{transform:'scale(1.8,1.3)',opacity:0}],{duration:900,easing:'ease-out'}).finished.then(function(){rp.remove();});
      var n=3+Math.round(w/3);
      for(var i=0;i<n;i++){
        var s=rnd(2,w*.5),vx=rnd(-26,26),hgt=rnd(10,26)+w,d=add('dsp','width:'+s+'px;height:'+s+'px;left:'+x+'px;top:'+(y-s)+'px');
        d.animate([{transform:'translate(0,0)'},{transform:'translate('+vx*.5+'px,'+(-hgt)+'px)',offset:.45,easing:'ease-in'},{transform:'translate('+vx+'px,2px)'}],{duration:rnd(420,620),easing:'ease-out'}).finished.then((function(e){return function(){e.remove();};})(d));
      }
    }
    function drop(){
      var S=sources();
      if(!S.length||document.hidden||layer.childElementCount>(LOW?12:28))return;
      var s=S[(Math.random()*S.length)|0],x=rnd(s.a,s.b),w=rnd(5,9),y0=s.y,k=rnd(2.2,3.2);
      var d=document.createElement('i');d.className='dd';
      d.style.cssText='left:'+(x-w/2)+'px;top:'+y0+'px;width:'+w+'px;height:'+w+'px';
      layer.appendChild(d);
      d.animate([{transform:'scale(.2)'},{transform:'scale(1)',offset:.3},{transform:'scale(.85,'+k+')'}],{duration:rnd(2000,3400),easing:'ease-in',fill:'forwards'}).finished.then(function(){
        chute(d,x,y0,w,k,true);
      }).catch(function(){d.remove();});
    }
    /* fait tomber une goutte deja formee (d) jusqu'au slime du bas, puis l'eclabousse */
    function chute(d,x,y0,w,k,perle){
        var mb=mainBox();if(!mb){d.remove();return;}
        var mob=isM(),floor=mob?vsurf(x):mb.bottom-lvl,seen=floor<innerHeight,dist=Math.min(floor,innerHeight+30)-y0-w*k;
        if(dist<20){d.remove();return;}
        var dx=mob?clamp(tilt*dist*.5,-innerWidth*.45,innerWidth*.45):0,x2=clamp(x+dx,6,innerWidth-6);dx=x2-x;
        var rot=mob?' rotate('+(-Math.atan2(dx,dist)*57.3).toFixed(1)+'deg)':'';
        var bead=document.createElement('i');bead.className='dd';bead.style.cssText='left:'+(x-w*.3)+'px;top:'+(y0-1)+'px;width:'+w*.6+'px;height:'+w*.45+'px';
        /* la perle qui reste accrochee au bord (pas pour les coulures de la nappe, qui remontent d'elles-memes) */
        if(perle){layer.appendChild(bead);bead.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.4)',opacity:0}],{duration:900}).finished.then(function(){bead.remove();});}
        d.animate([{transform:'translateY(0) scale(.85,'+k+')'},{transform:'translate('+dx+'px,'+dist+'px)'+rot+' scale(.75,'+k*1.3+')'}],{duration:Math.sqrt(dist/innerHeight)*850+180,easing:'cubic-bezier(.55,0,.9,.55)',fill:'forwards'}).finished.then(function(){
          var nb=mainBox();
          if(nb&&seen){splash(x2,mob?vsurf(x2):nb.bottom-lvl,w);}else{lvl=Math.min(cap(),lvl+inc(w));show();}
          d.remove();
        });
    }
    /* Nappe de slime facon Martin Mystere, accrochee sous la barre du haut :
       une couche qui deborde du bord vert, et des coulures qui s'allongent
       lentement, s'etranglent puis lachent leur goutte, avant de remonter
       mollement. Une coulure ne descend jamais sur du texte : elle s'arrete
       au-dessus du premier mot, et se retire doucement si un mot passe
       dessous quand on fait defiler la page. */
    (function(){
      var NS='http://www.w3.org/2000/svg',svg=null,coul=[],haut=-1,larg=0,der=0,revu=0,aRevoir=true,net=false;
      function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
      function bord(){
        var b=0,hd=document.querySelector('header'),nv=document.querySelector('nav');
        if(hd)b=hd.getBoundingClientRect().bottom;
        if(nv&&isM()){var r=nv.getBoundingClientRect();if(r.top<innerHeight/3)b=Math.max(b,r.bottom);}
        return Math.round(b);
      }
      /* y a-t-il une lettre a cet endroit de l'ecran ? (la nappe, les gouttes et
         la flaque ignorent le pointeur : on touche bien ce qu'il y a dessous) */
      var caret=document.caretPositionFromPoint?function(x,y){var p=document.caretPositionFromPoint(x,y);return p&&[p.offsetNode,p.offset];}
        :document.caretRangeFromPoint?function(x,y){var r=document.caretRangeFromPoint(x,y);return r&&[r.startContainer,r.startOffset];}:null;
      var plage=document.createRange();
      function lettre(x,y){
        if(!caret||x<0||y<0||x>=innerWidth||y>=innerHeight)return false;
        var p=caret(x,y);
        if(!p||!p[0])return false;
        if(p[0].nodeType!==3){
          /* au-dessus des paroles (iframe) ou d'un champ de saisie, on recoit l'element ou son parent */
          var cs=p[0].childNodes,cand=/^(INPUT|TEXTAREA)$/.test(p[0].nodeName)?[p[0]]:[cs[p[1]],cs[p[1]-1],document.elementFromPoint(x,y)];
          for(var i=0;i<cand.length;i++){
            var e=cand[i];
            if(e&&/^(IFRAME|INPUT|TEXTAREA|SELECT)$/.test(e.nodeName)){var r=e.getBoundingClientRect();if(x>=r.left&&x<=r.right&&y>=r.top-2&&y<=r.bottom)return true;}
          }
          return false;
        }
        var t=p[0].data;
        for(var o=Math.max(0,p[1]-1);o<=Math.min(t.length-1,p[1]);o++){
          if(/\s/.test(t.charAt(o)))continue;
          plage.setStart(p[0],o);plage.setEnd(p[0],o+1);
          var b=plage.getBoundingClientRect();
          if(x>=b.left-3&&x<=b.right+3&&y>=b.top-2&&y<=b.bottom+2)return true;
        }
        return false;
      }
      /* longueur que peut prendre la coulure avant de toucher un mot */
      function limite(c){
        var x0=c.x-c.w*.18,xs=[x0-c.w*.38,x0,x0+c.w*.38],y0=haut-3,fin=Math.min(c.lmax,140)+8;
        for(var dy=10;dy<=fin;dy+=6)for(var k=0;k<3;k++)if(lettre(xs[k],y0+dy))return Math.max(5,dy-8);
        return 999;
      }
      /* une coulure : tige qui s'affine, puis goutte ronde au bout ; e (0..1) l'etrangle avant la chute */
      function forme(x,w,L,e){
        var h=w/2,r=w*.42,n=r*.8*(1-e*.7),yc=L-r,yn=yc-r*.6,c1=Math.min(L*.35,yn-2),c2=Math.min(L*.5,yn-1);
        return 'M'+(x-h)+',-4C'+(x-h)+','+c1+' '+(x-n)+','+c2+' '+(x-n)+','+yn+
          'A'+r+','+r+' 0 1 0 '+(x+n)+','+yn+'C'+(x+n)+','+c2+' '+(x+h)+','+c1+' '+(x+h)+',-4Z';
      }
      function construire(){
        larg=innerWidth;haut=bord();aRevoir=true;net=true;
        if(svg)svg.remove();
        svg=el('svg',{id:'nappe','aria-hidden':'true',width:larg,height:150,viewBox:'0 0 '+larg+' 150'});
        svg.style.top=(haut-3)+'px';
        document.body.appendChild(svg);
        var go=el('g',{fill:CO.ombre},svg),gb=el('g',{fill:CO.vert},svg),gr=el('g',{stroke:CO.reflet,'stroke-linecap':'round',fill:'none'},svg),ge=el('g',{fill:CO.reflet},svg);
        /* la couche : bord du bas bossele, ombre franche dessous, trait de reflet dessus */
        var p1=rnd(0,6),p2=rnd(0,6),d='M0,-4';
        for(var x=0;x<=larg+8;x+=8)d+='L'+x+','+(7+3.5*Math.sin(x/41+p1)+2*Math.sin(x/17+p2)).toFixed(1);
        d+='L'+(larg+8)+',-4Z';
        el('path',{d:d},go);
        el('path',{d:d,transform:'translate(0,-3)'},gb);
        el('path',{d:'M6,3H'+(larg-6),'stroke-width':2.2,'stroke-dasharray':'38 22 12 46 26 34','stroke-dashoffset':rnd(0,170).toFixed(0),opacity:.8},gr);
        /* les coulures : moins nombreuses et plus fines sur telephone et sur les appareils modestes */
        coul=[];
        var n=Math.max(3,Math.round(larg/(LOW?160:115))),mob=isM();
        for(var i=0;i<n;i++){
          var w=mob?rnd(9,16):rnd(11,22),cx0=clamp((i+.5)*larg/n+rnd(-.3,.3)*larg/n,w,larg-w),lmin=w*rnd(1.6,2.4);
          var c={x:cx0,w:w,lmin:lmin,lmax:Math.min(115,lmin+rnd(25,70)),lim:999,L:lmin*rnd(1,1.8),v:rnd(3,7),ph:'pousse',t:rnd(0,3),f:rnd(0,6.28),e:0};
          c.o=el('path',{},go);c.b=el('path',{transform:'translate('+(-w*.18).toFixed(1)+',-2)'},gb);
          c.r=el('path',{'stroke-width':Math.max(2,w*.12).toFixed(1),opacity:.9},gr);c.g=el('ellipse',{},ge);
          coul.push(c);
        }
      }
      function dessiner(c,tt){
        /* une coulure tres courte devient une simple bosse : sa goutte se reduit avec elle */
        var w=Math.max(4,Math.min(c.w,c.L/1.7))*(1+.05*Math.sin(tt*2.6+c.f)),r=w*.42,d=forme(c.x,w,c.L,c.e),dx=c.w*.18-w*.18;
        c.o.setAttribute('d',d);c.b.setAttribute('d',d);c.b.setAttribute('transform','translate('+(-c.w*.18+dx).toFixed(1)+',-2)');
        var xr=c.x-w*.3-c.w*.18,y2=c.L-r*1.9;
        c.r.setAttribute('d',y2>10?'M'+xr.toFixed(1)+',6Q'+(xr+w*.05).toFixed(1)+','+((6+y2)/2).toFixed(1)+' '+(xr+w*.08).toFixed(1)+','+y2.toFixed(1):'M0,0');
        c.g.setAttribute('cx',(c.x-r*.36-c.w*.18).toFixed(1));c.g.setAttribute('cy',(c.L-r*1.15).toFixed(1));
        c.g.setAttribute('rx',(r*.2).toFixed(1));c.g.setAttribute('ry',(r*.34).toFixed(1));
      }
      /* la goutte se detache au bout de la coulure et tombe comme les autres */
      function lacher(c){
        var w=clamp(c.w*.8,6,14),k=1.5,x=c.x-c.w*.18,y0=haut-3+c.L-w*k;
        var d=document.createElement('i');d.className='dd';
        d.style.cssText='left:'+(x-w/2)+'px;top:'+y0+'px;width:'+w+'px;height:'+w+'px;transform:scale(.85,'+k+')';
        layer.appendChild(d);
        chute(d,x,y0,w,k,false);
      }
      var REPLI=2.8; /* secondes pour remonter apres avoir lache sa goutte */
      function animer(now){
        var dt=Math.min(.1,(now-der)/1000||0);der=now;
        if(innerWidth!==larg||Math.abs(bord()-haut)>1)construire();
        /* sonder le texte sous les coulures : au defilement, et de temps en temps
           (images qui se chargent, page qui change sans rechargement) */
        if((aRevoir&&now-revu>200)||now-revu>900){
          revu=now;aRevoir=false;
          /* net : page qui s'affiche (chargement, changement de page, rotation) : le texte est deja la,
             la coulure se cale aussitot au-dessus ; le retrait lent reste pour un mot qui arrive en defilant */
          coul.forEach(function(c){
            c.lim=limite(c);
            if(net){var pl=Math.min(c.lmax,c.lim);if(c.ph==='rebond')c.from=Math.min(c.from,pl);else if(c.L>pl){c.L=pl;if(c.ph==='etrangle'){c.ph='pousse';c.e=0;}}}
          });
          net=false;
        }
        var tt=now/1000;
        coul.forEach(function(c){
          c.t+=dt;
          var plafond=Math.min(c.lmax,c.lim);
          /* un mot passe dessous : elle se retire, lentement, sans lacher sa goutte */
          if(c.L>plafond+(c.ph==='etrangle'?5:1)&&c.ph!=='rebond'){c.L=Math.max(plafond,c.L-dt*40);if(c.ph==='etrangle'){c.ph='pousse';c.e=0;}}
          if(c.ph==='pousse'){
            /* plus elle est lourde, plus elle descend vite */
            if(c.L<plafond)c.L=Math.min(plafond,c.L+c.v*dt*(1+(c.L-c.lmin)/c.lmax*1.5));
            /* arretee par un mot assez longtemps, elle lache quand meme sa goutte si elle est
               assez longue pour en former une : la goutte ne fait que traverser le texte */
            c.bloque=c.L>=plafond-.5&&plafond<c.lmax?(c.bloque||0)+dt:0;
            if(c.L>=c.lmax-.5||(c.bloque>4&&c.L>c.w*1.8)){c.ph='etrangle';c.t=0;c.bloque=0;}
          }else if(c.ph==='etrangle'){
            c.e=Math.min(1,c.t/.35);c.L=Math.min(c.L+dt*18,plafond+4);
            if(c.t>=.35){
              /* pas trop de gouttes a la fois ; sinon elle remonte sans lacher */
              var part=!document.hidden&&layer.childElementCount<(LOW?10:22)&&Math.random()<(isM()?.7:.4);
              if(part)lacher(c);
              /* la goutte emporte le bout de la coulure, le reste remonte en douceur */
              c.ph='rebond';c.t=0;c.e=0;c.from=part?c.L-c.w*.35:c.L;
            }
          }else if(c.ph==='rebond'){
            /* remontee molle, comme une pate qui se retracte, avec un leger tremblement */
            var u=Math.min(1,c.t/REPLI),cible=Math.min(c.lmin,c.lim);
            c.L=c.from+(cible-c.from)*(1-Math.pow(1-u,3))+Math.sin(c.t*6.5)*2.5*(1-u);
            if(u>=1){c.ph='repos';c.t=0;c.L=cible;c.pause=rnd(.8,4);c.lmax=Math.min(115,c.lmin+rnd(25,70));c.v=rnd(3,7);}
          }else if(c.t>c.pause)c.ph='pousse';
          dessiner(c,tt);
        });
      }
      addEventListener('scroll',function(){aRevoir=true;},{passive:true});
      document.addEventListener('putride:page',function(){aRevoir=true;net=true;revu=-1e9;});
      /* la loupe ouvre le champ de recherche juste sous la barre */
      document.addEventListener('focusin',function(){aRevoir=true;net=true;revu=-1e9;});
      construire();
      var sauter=false;
      (function boucle(now){
        /* une image sur deux suffit : la nappe bouge lentement */
        if(!document.hidden&&(sauter=!sauter))animer(now||performance.now());
        requestAnimationFrame(boucle);
      })();
    })();
    (function tick(){drop();setTimeout(tick,isM()?rnd(3000,6500):rnd(5000,10000));})();
  })();

  /* Recherche : uniquement dans les pages du mode putride */
  var PAGES=['/mode-putride/accueil/','/mode-putride/territoire/','/mode-putride/bestiaire/','/mode-putride/discographie/','/mode-putride/ustensiles/','/mode-putride/mefaits/','/mode-putride/archives/','/mode-putride/in-odium-fidei/','/mode-putride/discographie/ces-beau-cela/','/mode-putride/discographie/chyren/','/mode-putride/discographie/confiteor/','/mode-putride/discographie/connasse/','/mode-putride/discographie/jarrive-en-tesla/','/mode-putride/discographie/le-retour-de-la-couche/','/mode-putride/discographie/les-gamins-jleur-mets-la-puree/','/mode-putride/discographie/lincontinence/','/mode-putride/discographie/machines/','/mode-putride/discographie/mais-si-quest-vrai/','/mode-putride/discographie/mauvaises-nouvelles-des-enfers-1/','/mode-putride/discographie/mauvaises-nouvelles-des-enfers-2/','/mode-putride/discographie/mets-la-cam/','/mode-putride/discographie/oh-non-herve/','/mode-putride/discographie/oh-non-je-fais-appel/','/mode-putride/discographie/omerta434/','/mode-putride/discographie/palestine-gratuit/','/mode-putride/discographie/peter-sur-la-friture/','/mode-putride/discographie/putain-de-sa-race/','/mode-putride/discographie/rien-a-declarer/','/mode-putride/bestiaire/createur/','/mode-putride/bestiaire/edwarda/','/mode-putride/bestiaire/rouen/','/mode-putride/bestiaire/ephebus/','/mode-putride/bestiaire/ephebelle/','/mode-putride/bestiaire/ephebito/','/mode-putride/bestiaire/ver/','/mode-putride/bestiaire/christophe-chevanne/','/mode-putride/bestiaire/herve-martin/','/mode-putride/bestiaire/jean-marie-gomis/','/mode-putride/bestiaire/thierry-haye/','/mode-putride/bestiaire/patrice-strilli/','/mode-putride/bestiaire/patrick-servanin/','/mode-putride/bestiaire/jean-pierre-herlant/','/mode-putride/bestiaire/gilbert-chabrolles/','/mode-putride/bestiaire/pacificsound3003/'];
  var IX=null,IXP=null;
  function norm(s){return s.toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/[’‘]/g,"'").normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function build(){
    if(IXP)return IXP;
    IX=[];
    IXP=Promise.all(PAGES.map(function(u){
      return fetch(u).then(function(r){return r.text();}).then(function(h){
        var d=new DOMParser().parseFromString(h,'text/html'),m=d.querySelector('main');if(!m)return;
        var t=(d.querySelector('main h1')||{}).textContent||d.title.split('|')[0];t=t.replace(/\s+/g,' ').trim();
        var k=d.title.split('|')[0].replace(/^\s*mode putride\s*·?\s*/i,'').replace(/\s+/g,' ').trim();
        if(norm(k)===norm(t))k='';
        var parts=[];
        Array.prototype.forEach.call(m.querySelectorAll('h2,h3,p,li,figcaption'),function(p){
          if(p.closest('.pup,.pfoot'))return;
          var c=p.cloneNode(true);Array.prototype.forEach.call(c.querySelectorAll('*'),function(e){e.appendChild(document.createTextNode(' '));});
          var x=c.textContent.replace(/\s+/g,' ').trim();
          if(x.length>24||/^H[23]$/.test(p.tagName)&&x.length>2)parts.push({x:x,n:norm(x)});
        });
        IX.push({t:t,k:k,h:u,n:norm(t+' '+k),parts:parts});
      }).catch(function(){});
    }));
    return IXP;
  }
  function find(q){
    var nq=norm(q).trim();if(nq.length<2)return[];
    var w=nq.split(/\s+/);
    function all(n){return w.every(function(x){return n.indexOf(x)>-1;});}
    var R=[],has={};
    IX.forEach(function(e,i){if(all(e.n)){has[e.h]=1;R.push({t:e.t,k:e.k,h:e.h,sc:e.n.indexOf(w[0])===0?0:1,i:i});}});
    IX.forEach(function(e,i){
      if(has[e.h])return;
      for(var j=0;j<e.parts.length;j++){
        var p=e.parts[j];
        if(all(p.n)){var a=Math.max(0,Math.max(0,p.n.indexOf(w[0]))-30);if(a)a=p.x.indexOf(' ',a-1)+1||a;R.push({t:e.t,k:e.k,h:e.h,sn:(a?'… ':'')+p.x.substr(a,90)+(a+90<p.x.length?' …':''),sc:6,i:i});break;}
      }
    });
    R.sort(function(a,b){return a.sc-b.sc||a.i-b.i;});
    return R.slice(0,8);
  }
  function out(f){return f.parentNode.querySelector('.sr');}
  function shut(f){var o=out(f);o.classList.remove('on');o.textContent='';}
  function upd(inp){
    var o=out(inp.form),v=inp.value.trim();
    build().then(function(){
      if(inp.value.trim()!==v)return;
      o.textContent='';
      if(v.length<2){o.classList.remove('on');return;}
      var R=find(v);
      if(!R.length){var n=document.createElement('div');n.className='sn';n.textContent='Rien dans l\u2019égout';o.appendChild(n);}
      R.forEach(function(r){
        var a=document.createElement('a');a.href=r.h;var b=document.createElement('b');b.textContent=r.t;a.appendChild(b);
        var s=r.sn?(r.k?r.k+' — ':'')+r.sn:r.k;
        if(s){var sm=document.createElement('small');sm.textContent=s;a.appendChild(sm);}
        o.appendChild(a);
      });
      o.classList.add('on');
    });
  }
  document.addEventListener('input',function(ev){var i=ev.target;if(i.matches&&i.matches('.sform input'))upd(i);});
  document.addEventListener('focusin',function(ev){var i=ev.target;if(i.matches&&i.matches('.sform input')){build();if(i.value.trim().length>1)upd(i);}});
  document.addEventListener('submit',function(ev){
    var f=ev.target;if(!f.matches||!f.matches('.sform'))return;
    ev.preventDefault();var a=out(f).querySelector('a');if(a)a.click();
  });
  document.addEventListener('click',function(ev){
    var t=ev.target;
    var b=t.closest&&t.closest('.sbtn');
    if(b){
      var mp=document.getElementById('msearch');
      if(mp.hasAttribute('hidden')){mp.removeAttribute('hidden');b.setAttribute('aria-expanded','true');mp.querySelector('input').focus();}
      else{mp.setAttribute('hidden','');b.setAttribute('aria-expanded','false');}
      return;
    }
    Array.prototype.forEach.call(document.querySelectorAll('.sr.on'),function(o){if(!o.parentNode.contains(t))shut(o.parentNode.querySelector('form'));});
  });
  document.addEventListener('keydown',function(ev){
    var t=ev.target,box=t.closest&&t.closest('.dsearch,.msp');if(!box)return;
    var inp=box.querySelector('input'),as=Array.prototype.slice.call(box.querySelectorAll('.sr a')),i=as.indexOf(t);
    if(ev.key==='ArrowDown'&&as.length){ev.preventDefault();as[Math.min(as.length-1,i+1)].focus();}
    else if(ev.key==='ArrowUp'&&as.length){ev.preventDefault();if(i<=0)inp.focus();else as[i-1].focus();}
    else if(ev.key==='Escape'){shut(inp.form);inp.value='';inp.focus();}
  });
  /* Galeries des fiches : pagination, six rangees par page (12 photos sur
     telephone, 18 sur tablette, 24 sur ordi). Les photos des autres pages
     sont seulement masquees : la visionneuse les parcourt toujours toutes,
     et leurs images (chargement differe) ne sont telechargees qu'une fois
     affichees. */
  (function(){
    var RANGEES=6;
    function colonnes(g){return getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length||1;}
    function bandeau(){/* hauteur des barres collees en haut de l'ecran : en-tete, navigation du telephone */
      var b=0;
      Array.prototype.forEach.call(document.querySelectorAll('header,nav'),function(e){
        var p=getComputedStyle(e).position;if(p!=='sticky'&&p!=='fixed')return;
        var r=e.getBoundingClientRect();if(r.top<innerHeight/4&&r.bottom<innerHeight/2)b=Math.max(b,r.bottom);
      });
      return b;
    }
    function remonter(g){
      var t=g.previousElementSibling&&/^H[23]$/.test(g.previousElementSibling.tagName)?g.previousElementSibling:g;
      var y=t.getBoundingClientRect().top+scrollY-bandeau()-12;
      window.scrollTo({top:Math.max(0,y),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
    }
    function bouton(texte,nom,fn){
      var b=document.createElement('button');b.type='button';b.className='btn';b.textContent=texte;
      b.setAttribute('aria-label',nom);b.addEventListener('click',fn);return b;
    }
    function installer(g){
      var items=Array.prototype.slice.call(g.children);
      /* une div et non une <nav> : le theme stylise toutes les <nav> en barre de navigation collante */
      var nav=document.createElement('div');nav.className='gpag';nav.setAttribute('role','navigation');nav.setAttribute('aria-label','Pages de photos');
      g.parentNode.insertBefore(nav,g.nextSibling);
      var st={page:0,par:0};
      function afficher(p,clic){
        var par=colonnes(g)*RANGEES,n=Math.ceil(items.length/par);
        st.par=par;
        if(n<=1){items.forEach(function(li){li.hidden=false;});nav.hidden=true;st.page=0;return;}
        p=Math.max(0,Math.min(n-1,p));st.page=p;nav.hidden=false;
        items.forEach(function(li,i){li.hidden=i<p*par||i>=(p+1)*par;});
        nav.textContent='';
        var prec=bouton('‹','Page précédente',function(){afficher(st.page-1,true);});prec.disabled=p===0;nav.appendChild(prec);
        var vues=[0,p-1,p,p+1,n-1].filter(function(x,i,a){return x>=0&&x<n&&a.indexOf(x)===i;}).sort(function(a,b){return a-b;});
        vues.forEach(function(x,i){
          if(i&&x-vues[i-1]>1){var et=document.createElement('span');et.className='gp-et';et.textContent='…';et.setAttribute('aria-hidden','true');nav.appendChild(et);}
          var b=bouton(String(x+1),'Page '+(x+1),function(){afficher(x,true);});
          if(x===p)b.setAttribute('aria-current','page');
          nav.appendChild(b);
        });
        var suiv=bouton('›','Page suivante',function(){afficher(st.page+1,true);});suiv.disabled=p===n-1;nav.appendChild(suiv);
        var info=document.createElement('span');info.className='gp-info';
        info.textContent='Photos '+(p*par+1)+' – '+Math.min(items.length,(p+1)*par)+' sur '+items.length;
        nav.appendChild(info);
        if(clic){remonter(g);var c=nav.querySelector('[aria-current]');if(c)c.focus({preventScroll:true});}
      }
      g._pages={afficher:afficher,st:st};
      afficher(0,false);
    }
    function installerTout(){Array.prototype.forEach.call(document.querySelectorAll('ul.gal'),function(g){if(!g._pages)installer(g);});}
    installerTout();
    /* navigation sans rechargement : nouvelles galeries a chaque page */
    document.addEventListener('putride:page',installerTout);
    /* changement de nombre de colonnes : on garde la premiere photo affichee */
    var rz;
    window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){
      Array.prototype.forEach.call(document.querySelectorAll('ul.gal'),function(g){
        var pg=g._pages;if(!pg)return;
        var par=colonnes(g)*RANGEES;
        if(par!==pg.st.par)pg.afficher(Math.floor(pg.st.page*pg.st.par/par),false);
      });
    },150);});
  })();
})();
