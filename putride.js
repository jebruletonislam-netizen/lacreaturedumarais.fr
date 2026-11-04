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
    var g=a.closest('.gal,.rt,.rgal'),L=g?[].slice.call(g.querySelectorAll('a[data-lb]')):[a];
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
    var inc=function(w){return w*w*.085*(isM()?1.8:1);};
    var mainBox=function(){var m=document.querySelector('main');return m&&m.getBoundingClientRect();};
    var cap=function(){var m=document.querySelector('main');return Math.min(innerHeight/3,m?m.offsetHeight*.5:1e9);};
    /* ---------- le fluide : une surface d'ondes (champ de hauteurs) dessinée sur un seul canvas, la même sur ordinateur et téléphone ----------
       Il monte avec les gouttes, jusqu'au tiers de l'écran au maximum. Chaque goutte, chaque objet qui tombe y fait des vagues ;
       sur téléphone, l'inclinaison et les secousses le font glisser et déborder. Les crottes flottent, les clystères en étain coulent. */
    var cv=document.createElement('canvas');cv.id='mpool';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
    var cx=cv.getContext('2d');
    var LOW=(navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||4)<=4||innerWidth*(window.devicePixelRatio||1)<700;
    var dpr=LOW?1:Math.min(window.devicePixelRatio||1,1.5);
    var CW=0,CH=0,DX=LOW?10:7,NC=0,HH=null,VV=null,ext={x0:0,x1:0,fl:0};
    var gx=0,gy=1,gm=1,tgx=0,tgy=1,tgm=1,slope=0,lvlD=0,tnow=0,pendX=0,wasWork=false;
    var drops=[],items=[],bubs=[],cro=null,FX={};
    function upd(){var m=mainBox();ext.x0=Math.max(0,m?m.left:0);ext.x1=Math.min(CW,m?m.right:CW);ext.fl=Math.min(CH,m?m.bottom:CH)-3;}
    function sizeCv(){
      CW=innerWidth;CH=innerHeight;cv.width=Math.round(CW*dpr);cv.height=Math.round(CH*dpr);cx.setTransform(dpr,0,0,dpr,0,0);
      NC=Math.ceil(CW/DX)+3;HH=new Float32Array(NC);VV=new Float32Array(NC);upd();
    }
    sizeCv();pendX=CW/2;
    addEventListener('resize',sizeCv);
    /* hauteur de la surface en x : niveau, vagues, houle ambiante, inclinaison ; jamais plus haut qu'un tiers de l'écran */
    function surfAt(x){
      var c=x/DX;if(c<0)c=0;if(c>NC-2)c=NC-2;var i=c|0,f=c-i,h=HH[i]*(1-f)+HH[i+1]*f,am=Math.min(1,lvlD/14);
      var y=ext.fl-lvlD-h+(Math.sin(x*.021+tnow/620)*1.5+Math.sin(x*.049-tnow/430)*.9)*am-slope*(x-(ext.x0+ext.x1)/2);
      return y<CH*.667-10?CH*.667-10:y>ext.fl?ext.fl:y;
    }
    var vsurf=function(x){return lvlD>.5?surfAt(clamp(x,ext.x0,ext.x1)):ext.fl;};
    function wave(x,amt){
      var c=Math.round(x/DX),d,k;
      for(d=-4;d<=4;d++){k=c+d;if(k>0&&k<NC-1)VV[k]-=amt*(1-Math.abs(d)/5);}
    }
    function spray(x,y,n,pw,col){
      for(var i=0;i<n&&drops.length<(col?90:50);i++)drops.push({x:x+rnd(-8,8),y:y,vx:rnd(-190,190)*pw,vy:-rnd(160,520)*pw,r:rnd(1.4,3.6),l:rnd(.5,1),c:col&&(col.pop?col[(Math.random()*col.length)|0]:col)});
    }
    function stepW(dt){
      var i0=Math.max(1,Math.floor(ext.x0/DX)),i1=Math.min(NC-2,Math.ceil(ext.x1/DX)),i,l,r;
      for(i=i0;i<=i1;i++){
        l=i>i0?HH[i-1]:HH[i];r=i<i1?HH[i+1]:HH[i];
        VV[i]=(VV[i]+(l+r-2*HH[i])*.3-HH[i]*.004)*.988;
      }
      for(i=i0;i<=i1;i++){HH[i]+=VV[i];if(HH[i]>46)HH[i]=46;else if(HH[i]<-46)HH[i]=-46;}
    }
    /* le fluide subit l'inclinaison du téléphone, et une secousse le remue */
    var onMot=function(ev){
      var a=ev.accelerationIncludingGravity;if(!a||a.x==null||a.y==null)return;
      var sg=ios?-1:1,ax=a.x*sg,ay=a.y*sg,an=(screen.orientation&&screen.orientation.angle)||0,x,y;
      if(an===90){x=ay;y=ax;}else if(an===270||an===-90){x=-ay;y=-ax;}else if(an===180){x=ax;y=-ay;}else{x=-ax;y=ay;}
      x/=9.8;y/=9.8;
      var m=Math.sqrt(x*x+y*y);
      if(m<.12){tgx=0;tgy=1;tgm=.3;return;}
      tgx=x/m;tgy=y/m;tgm=clamp(m,.18,3.4);
      if(m>1.5&&lvlD>2){for(var k=0;k<6;k++){var c=1+((Math.random()*(NC-3))|0);VV[c]+=rnd(-9,9)*(m-1);}spray(rnd(ext.x0,ext.x1),vsurf(CW/2),3,.6);}
    };
    var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(window.DeviceMotionEvent){
      if(typeof DeviceMotionEvent.requestPermission==='function'){
        document.addEventListener('touchend',function(){DeviceMotionEvent.requestPermission().then(function(r){if(r==='granted')addEventListener('devicemotion',onMot);}).catch(function(){});},{once:true});
      }else addEventListener('devicemotion',onMot);
    }
    /* un doigt (ou le curseur appuyé) dans le fluide le brasse */
    var fing=null;
    var tmv=function(ev){
      var t=ev.touches[0],n=performance.now();
      if(!t){fing=null;return;}
      if(!fing||ev.type==='touchstart'){fing={x:t.clientX,y:t.clientY,t:n};return;}
      var dt=Math.max(8,n-fing.t)/1000,vx=(t.clientX-fing.x)/dt;
      if(lvlD>2&&t.clientY>vsurf(t.clientX)-30&&t.clientX>ext.x0&&t.clientX<ext.x1)wave(t.clientX,clamp(vx*.006,-5,5));
      fing.x=t.clientX;fing.y=t.clientY;fing.t=n;
    };
    document.addEventListener('touchstart',tmv,{passive:true});
    document.addEventListener('touchmove',tmv,{passive:true});
    document.addEventListener('touchend',tmv,{passive:true});
    document.addEventListener('touchcancel',function(){fing=null;},{passive:true});

    /* ---------- objets qui tombent dans le fluide : les crottes flottent, les clystères en étain coulent ---------- */
    function mkItem(k,x,y,vx,vy){
      var sz=k?(isM()?78:106):(isM()?30:36),it={k:k,x:x,y:y,vx:vx,vy:vy,rot:rnd(-1,1),vr:rnd(-4,4),s:sz,sq:0,z:rnd(.9,1.1),wet:false,out:false,sc:1,dz:rnd(0,6)};
      items.push(it);return it;
    }
    function spawnItem(){
      var E=FX.eph&&FX.eph.on;
      if(items.length>=(E?10:6)||(lvl<7&&!E)||document.hidden||vidFin)return;
      var nc=0,nk=0,mx=E?5:3;items.forEach(function(it){if(it.k)nk++;else nc++;});
      var k=Math.random()<.5?0:1;if(k&&nk>=mx)k=0;else if(!k&&nc>=mx)k=1;
      var sz=k?(isM()?78:106):(isM()?30:36),w=Math.max(10,ext.x1-ext.x0-60);
      mkItem(k,ext.x0+30+Math.random()*w,-sz,rnd(-40,40),rnd(0,120));
    }
    (function loopSpawn(){spawnItem();setTimeout(loopSpawn,(FX.eph&&FX.eph.on)?rnd(2400,4600):rnd(4500,10000));})();
    function stepItem(it,dt){
      var A=1700*Math.max(.6,gm),sy,inW,dz;
      if(it.out){it.sc-=dt*1.2;if(it.sc<=0){it.dead=true;return;}}
      if(it.held){it.wet=false;return;}
      it.vx+=gx*A*dt;it.vy+=gy*A*dt;
      sy=surfAt(clamp(it.x,ext.x0,ext.x1));inW=lvlD>2&&it.y>sy-(it.k?it.s*.04:it.s*.15);
      if(inW){
        if(!it.wet){it.wet=true;wave(it.x,clamp(it.vy*.011*(it.k?1.6:1),0,14));spray(it.x,sy,it.k?8:5,.7);for(var q=0;q<4;q++)bubs.push({x:it.x+rnd(-12,12),y:sy+rnd(4,16),r:rnd(1.6,3.4),vy:rnd(25,60),ph:rnd(0,6)});}
        if(it.k===0){
          dz=(surfAt(clamp(it.x+9,ext.x0,ext.x1))-surfAt(clamp(it.x-9,ext.x0,ext.x1)))/18;
          it.vy+=(sy+it.s*.1-it.y)*55*dt;it.vy*=1-Math.min(1,dt*3.5);
          it.vx+=dz*900*dt;it.vx*=1-Math.min(1,dt*1.6);
          it.rot+=((Math.atan(dz)*.9+Math.sin(tnow/700+it.dz)*.12)-it.rot)*Math.min(1,dt*5);it.vr*=1-Math.min(1,dt*4);
        }else{
          it.vy+=(78-it.vy)*Math.min(1,dt*3);it.vx*=1-Math.min(1,dt*2.2);
          it.vr+=Math.sin(tnow/520+it.dz)*.5*dt;it.vr*=1-Math.min(1,dt*1.2);
        }
      }else it.wet=false;
      it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=it.vr*dt;
      if(it.x<ext.x0+10){it.x=ext.x0+10;it.vx*=-.4;}else if(it.x>ext.x1-10){it.x=ext.x1-10;it.vx*=-.4;}
      var fl=ext.fl-it.s*(it.k?.1:.45);
      if(it.y>fl){it.y=fl;if(it.vy>260)it.sq=.2;it.vy=it.k?0:-it.vy*.25;it.vx*=.8;if(it.k)it.rot+=((it.z>1?.1:-.1)-it.rot)*Math.min(1,dt*3);}
      var sqv=clamp(-Math.abs(it.vy)/1600,-.16,0);it.sq+=(sqv-it.sq)*Math.min(1,dt*9);
    }
    function drawItem(it){
      var e=it.sc;
      if(it.k===0){if(SL.crotte)SL.crotte(cx,it.x,it.y+it.s*.35,it.s*e,it.rot,it.sq);}
      else if(SL.clystere)SL.clystere(cx,it.x,it.y,it.s*e,it.rot);
    }

    /* ---------- la parole : un seul bulle à la fois ; la dame-jeanne, Éphébito et Éphénégro disent les tweets ----------
       Chaque parleur (own) fournit son nom, s'il est parti (gone), ce qu'il fait à l'ouverture (ouvre) et où se placer (anc). */
    var PROFIL='https://x.com/TancredeCharon',pool=[],sac=[],last=-1,bulle=null,tb=0,tc=0,PA=null;
    function charger(cb){
      if(window.CR_PAROLES){cb();return;}
      var sc=document.createElement('script');sc.src='/cachot-paroles.js?v=3';sc.onload=cb;sc.onerror=cb;document.head.appendChild(sc);
    }
    function tire(){
      if(!pool.length){
        PA=window.CR_PAROLES||{};
        (PA.tweets||[]).forEach(function(x){if(x&&(x.t||typeof x==='string'))pool.push({t:x.t||x,u:x.u||PROFIL,d:x.d||'',k:1});});
        (PA.phrases||[]).forEach(function(x){if(x)pool.push({t:x,u:'',d:'',k:0});});
      }
      if(!pool.length)return {t:'Je n’ai rien à dire. Pour l’instant.',u:'',d:'',k:0};
      if(!sac.length){var i;for(i=0;i<pool.length;i++)if(i!==last||pool.length===1)sac.push(i);for(i=sac.length-1;i>0;i--){var r=(Math.random()*(i+1))|0,t=sac[i];sac[i]=sac[r];sac[r]=t;}}
      last=sac.pop();return pool[last];
    }
    function ferme(){
      clearInterval(tb);clearTimeout(tc);
      if(bulle){var b=bulle;bulle=null;b.classList.remove('on');setTimeout(function(){b.remove();},200);}
    }
    function parle(own){
      charger(function(){
        if(own.gone())return;
        var p=tire();ferme();
        /* même fiche que les aperçus au survol des liens : kicker en capitales espacées, puis le texte */
        var b=document.createElement('div');b.className='cro-bulle';b.setAttribute('role','status');b.setAttribute('aria-live','polite');
        var k=document.createElement('div');k.className='cb-k';
        if(p.k){var a=document.createElement('a');a.href=p.u;a.target='_blank';a.rel='noopener';a.textContent='@TancredeCharon'+(p.d?' · '+p.d:'');k.appendChild(a);}else k.textContent=own.nom;
        var q=document.createElement('q');q.className='cb-t';b.appendChild(k);b.appendChild(q);document.body.appendChild(b);bulle=b;b.own=own;
        b.bw=b.offsetWidth;setTimeout(function(){if(bulle===b)b.classList.add('on');},30);
        var texte=String(p.t),n=0;
        if(own.ouvre)own.ouvre();
        tb=setInterval(function(){
          n+=2;q.textContent=texte.slice(0,n);
          if(n>=texte.length){clearInterval(tb);tc=setTimeout(ferme,Math.max(7000,texte.length*75));}
        },24);
        b.addEventListener('click',function(ev){if(ev.target.closest('a'))return;ferme();});
      });
    }
    function placeBulle(){
      if(!bulle)return;
      var a=bulle.own.anc();if(!a){ferme();return;}
      var bw=bulle.bw||bulle.offsetWidth,bh=bulle.offsetHeight,ty=a.up?a.top-bh:a.bot;
      if(!a.up&&ty+bh>CH-8&&a.top-bh>=8)ty=a.top-bh;
      bulle.style.left=clamp(a.x-bw/2,8,CW-bw-8)+'px';bulle.style.top=clamp(ty,8,CH-bh-8)+'px';
    }
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bulle)ferme();});
    /* un va-et-vient (changement de sens d'au moins 36 px) : sert à mesurer qu'on secoue */
    function rev(s,p){
      if(!s.d){if(Math.abs(p-s.e)>10)s.d=p>s.e?1:-1;else return 0;}
      var amp;
      if(s.d>0){if(p>s.e)s.e=p;else if(s.e-p>14){amp=s.e-s.a;s.a=s.e;s.e=p;s.d=-1;return amp>=36?1:0;}}
      else{if(p<s.e)s.e=p;else if(p-s.e>14){amp=s.a-s.e;s.a=s.e;s.e=p;s.d=1;return amp>=36?1:0;}}
      return 0;
    }

    /* ---------- la dame-jeanne compagne : elle dit les tweets comme l'araignée des cachots, se prend, se pose où l'on veut, s'envoie valser ----------
       Dedans : des crottes, de la diarrhée, de la pisse, du lait cru périmé et, par-dessus, du sperme. Le liquide suit les gestes :
       il penche et clapote quand on la secoue. Le bouchon de liège saute quand un tweet s'ouvre et se remet quand il se ferme. */
    (function(){
      var S0=isM()?54:66,btn=document.createElement('button');
      btn.type='button';btn.className='cro-btn';btn.setAttribute('aria-label','La dame-jeanne : touchez-la, elle parle ; saisissez-la pour la déplacer ou l’envoyer valser');
      document.body.appendChild(btn);
      var H0=S0*1.9;
      cro={x:CW*(isM()?.8:.86),y:CH*(isM()?.42:.5),px:0,vx:0,vy:0,rot:0,vr:0,s:S0,h:H0,r:H0*.33,sq:0,sc:0,held:false,fly:0,gone:false,wet:false,
           sl:0,slv:0,en:0,pev:0,ck:0,ckv:0,ph:rnd(0,6),mix:0,boom:false,ret:false,plong:0,pvx:0,pt:0,cool:0};
      cro.px=cro.x;
      var own={nom:'La dame-jeanne',gone:function(){return cro.gone;},
        ouvre:function(){cro.slv+=rnd(2.4,3.6)*(Math.random()<.5?-1:1);},
        anc:function(){return {x:cro.x,top:cro.y-cro.h*1.02,bot:cro.y+cro.h*.6+10,up:cro.y>CH*.4};}};
      /* fissures qui gagnent le verre à mesure qu'on la secoue (repère du verre) */
      var CRK=[[-33,10,-24,14,-20,8,-12,13],[33,12,25,9,22,17,14,16],[-10,-26,-16,-18,-12,-12,-21,-8],[10,-28,14,-20,9,-14,18,-9],[-6,48,-9,38,-3,31,-8,24],[8,48,6,40,13,34,9,26],[-30,30,-22,28,-18,36,-10,33],[30,28,22,32,19,25,12,28]];
      /* les morceaux qui flottent dans le liquide : couche (0 crottes, 1 diarrhée, 3 lait), position, taille */
      var LUMPS=[];
      [[0,-18,6],[0,4,5],[0,20,7],[0,-4,4],[1,-22,4],[1,14,5],[1,-6,4],[3,-16,3],[3,10,4],[3,22,3]].forEach(function(q){LUMPS.push({l:q[0],u:q[1],z:q[2],ph:rnd(0,6)});});
      var BODY=new Path2D('M-10,-44L-10,-26C-10,-14-33,-10-33,12C-33,36-26,50 0,50C26,50 33,36 33,12C33,-10 10,-14 10,-26L10,-44Z');
      var dr=null,hist=[],shx={d:0,e:cro.x,a:cro.x},shy={d:0,e:cro.y,a:cro.y};
      function gone(){cro.gone=true;if(bulle&&bulle.own===own)ferme();dr=null;document.documentElement.classList.remove('cro-prise');btn.remove();}
      btn.addEventListener('pointerdown',function(e){
        if(e.button)return;
        e.preventDefault();try{btn.setPointerCapture(e.pointerId);}catch(_){}
        dr={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:cro.x-e.clientX,oy:cro.y-e.clientY,moved:false};
        hist=[{x:cro.x,y:cro.y,t:performance.now()}];cro.held=true;cro.ret=false;cro.plong=0;cro.vx=cro.vy=0;cro.fly=0;shx.d=shy.d=0;shx.e=shx.a=cro.x;shy.e=shy.a=cro.y;
      });
      btn.addEventListener('pointermove',function(e){
        if(!dr||e.pointerId!==dr.id)return;
        if(!dr.moved&&Math.hypot(e.clientX-dr.sx,e.clientY-dr.sy)>6){dr.moved=true;ferme();document.documentElement.classList.add('cro-prise');}
        if(!dr.moved)return;
        cro.x=clamp(e.clientX+dr.ox,cro.r,CW-cro.r);cro.y=clamp(e.clientY+dr.oy,cro.h*.5,CH-cro.h*.5);
        var rv=rev(shx,cro.x)+rev(shy,cro.y);if(rv)cro.mix=Math.min(1.05,cro.mix+.11*rv);
        var n=performance.now();hist.push({x:cro.x,y:cro.y,t:n});while(hist.length>2&&n-hist[0].t>110)hist.shift();
      });
      function lache(e,annule){
        if(!dr||(e&&e.pointerId!==dr.id))return;
        var d=dr;dr=null;cro.held=false;document.documentElement.classList.remove('cro-prise');
        try{btn.releasePointerCapture(d.id);}catch(_){}
        if(!d.moved){if(!annule)parle(own);return;}
        var f=hist[0],l=hist[hist.length-1],dt=Math.max(30,l.t-f.t)/1000,vx=(l.x-f.x)/dt,vy=(l.y-f.y)/dt,sp=Math.hypot(vx,vy);
        if(sp>2600){vx*=2600/sp;vy*=2600/sp;sp=2600;}
        /* lancée à la volée : elle s'en va ; sinon elle glisse un peu et reste là où on l'a posée */
        if(sp>1100){cro.fly=2.4;cro.vx=vx;cro.vy=vy;cro.vr=vx*.008;}
        else if(sp>180){cro.vx=vx*.9;cro.vy=vy*.9;}
        else{cro.vx=cro.vy=0;}
      }
      btn.addEventListener('pointerup',function(e){lache(e,false);});
      btn.addEventListener('pointercancel',function(e){lache(e,true);});
      btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();parle(own);}});
      cro.step=function(dt){
        if(cro.gone)return;
        cro.sc+=(1-cro.sc)*Math.min(1,dt*5);
        var h=cro.h,r=cro.r,sy,inW,dz;
        if(!cro.held){
          if(cro.fly>0)cro.fly-=dt;
          if(cro.cool>0)cro.cool-=dt;
          cro.vy+=(cro.fly>0?1500:0)*dt;
          sy=surfAt(clamp(cro.x,ext.x0,ext.x1));inW=lvlD>2&&cro.x>ext.x0&&cro.x<ext.x1&&cro.y>sy-h*.12;
          /* lancée dans le fluide : elle s'y enfonce en freinant, puis en ressort avec la force avec laquelle on l'y a envoyée */
          if(cro.fly>0&&inW&&cro.cool<=0&&!cro.plong&&cro.y>sy+h*.1&&Math.hypot(cro.vx,cro.vy)>300){
            cro.plong=Math.min(2600,Math.hypot(cro.vx,cro.vy));cro.pvx=cro.vx;cro.pt=0;
            wave(cro.x,clamp(cro.plong*.006,2,14));spray(cro.x,sy,10,1,CO.vert);cro.slv+=rnd(-4,4);
            for(var qb=0;qb<5;qb++)bubs.push({x:cro.x+rnd(-14,14),y:sy+rnd(4,22),r:rnd(1.8,4),vy:rnd(25,60),ph:rnd(0,6)});
          }
          if(cro.plong){
            cro.pt+=dt;cro.vx*=1-Math.min(1,dt*8);cro.vy*=1-Math.min(1,dt*8);cro.rot+=cro.vr*dt*.3;
            if(cro.pt>.2){
              var dir=cro.pvx<0?-1:1;cro.vy=-cro.plong;cro.vx=cro.pvx*.5+dir*40;cro.vr=cro.vx*.004;cro.fly=2.4;cro.cool=.6;cro.plong=0;
              wave(cro.x,-clamp(cro.vy*-.004,1,9));spray(cro.x,sy,12,1.25,CO.vert);
            }
          }
          if(inW&&cro.fly<=0&&!cro.plong){
            /* elle ne coule pas : elle flotte, le col hors du fluide */
            if(!cro.wet){cro.wet=true;wave(cro.x,clamp(Math.abs(cro.vy)*.012,0,13));spray(cro.x,sy,6,.7);cro.slv+=rnd(-2,2);}
            dz=(surfAt(clamp(cro.x+9,ext.x0,ext.x1))-surfAt(clamp(cro.x-9,ext.x0,ext.x1)))/18;
            cro.vy+=(sy+h*.1-cro.y)*55*dt;cro.vy*=1-Math.min(1,dt*3.5);
            cro.vx+=dz*900*dt;cro.vx*=1-Math.min(1,dt*1.6);
            cro.rot+=((Math.atan(dz)*.9+Math.sin(tnow/700)*.07)-cro.rot)*Math.min(1,dt*5);
          }else{
            cro.wet=false;
            if(cro.fly<=0&&!cro.ret){cro.vx*=1-Math.min(1,dt*5);cro.vy*=1-Math.min(1,dt*5);cro.rot+=(Math.sin(tnow/900)*.03+clamp(cro.vx/2000,-.3,.3)-cro.rot)*Math.min(1,dt*4);}
          }
          if(cro.ret){
            /* envoyée hors de l'écran : elle revient lentement et reste au bord, le temps qu'on la reprenne */
            var tx=clamp(cro.x,r,CW-r),ty=clamp(cro.y,h*.5,CH-h*.5),ddx=tx-cro.x,ddy=ty-cro.y,dd=Math.hypot(ddx,ddy);
            if(dd<3){cro.ret=false;cro.vx=cro.vy=0;}
            else{var spd=clamp(dd*.5,24,95);cro.vx+=(ddx/dd*spd-cro.vx)*Math.min(1,dt*3);cro.vy+=(ddy/dd*spd-cro.vy)*Math.min(1,dt*3);}
            cro.rot+=(Math.sin(tnow/700)*.12-cro.rot)*Math.min(1,dt*2);
          }
          cro.x+=cro.vx*dt;cro.y+=cro.vy*dt;cro.rot+=cro.vr*dt;if(cro.fly<=0)cro.vr*=1-Math.min(1,dt*5);
          if(cro.fly>0){
            if(!cro.plong&&(cro.x<-h*1.6||cro.x>CW+h*1.6||cro.y<-h*2||cro.y>CH+h*1.6)){cro.fly=0;cro.ret=true;cro.vr=0;cro.vx*=.25;cro.vy*=.25;}
          }else if(!cro.ret){
            if(cro.x<r){cro.x=r;cro.vx*=-.5;}else if(cro.x>CW-r){cro.x=CW-r;cro.vx*=-.5;}
            if(cro.y<h*.5){cro.y=h*.5;cro.vy*=-.5;}else if(cro.y>ext.fl-h*.47&&!inW){cro.y=ext.fl-h*.47;cro.vy*=-.3;}
          }
        }else{
          /* dans la main, elle penche du côté où on l'emmène */
          cro.rot+=(clamp(((cro.x-cro.px)/dt)/1800,-.4,.4)-cro.rot)*Math.min(1,dt*8);
        }
        /* le liquide : un ressort amorti que pousse l'accélération horizontale du verre ; l'énergie agite la surface */
        var ev=(cro.x-cro.px)/dt,ax=(ev-cro.pev)/dt,evy=cro.vy;
        cro.px=cro.x;cro.pev=ev;
        cro.slv+=(-46*cro.sl-3.4*cro.slv-clamp(ax,-40000,40000)*.00085)*dt;cro.sl=clamp(cro.sl+cro.slv*dt,-.95,.95);
        cro.en+=((Math.min(3,Math.abs(cro.sl)*2.4+Math.abs(cro.slv)*.45+Math.abs(evy)/2600))-cro.en)*Math.min(1,dt*6);
        /* le bouchon : ouvert tant qu'un tweet est affiché, avec un peu de rebond */
        cro.mix=Math.max(0,cro.mix-dt*.14);
        if(cro.mix>.3)FX.pre();
        if(cro.mix>=1){
          if(FX.pret()&&!cro.boom){cro.boom=true;FX.boum({x:cro.x,y:cro.y,rot:cro.rot,h:cro.h});gone();return;}
          if(FX.echec)cro.mix=.3;else cro.mix=1;
        }
        cro.en=Math.max(cro.en,cro.mix*2.4);
        cro.ckv+=(-150*(cro.ck-(bulle&&bulle.own===own?1:0))-15*cro.ckv)*dt;cro.ck+=cro.ckv*dt;
        if(cro.fly<=0&&cro.held===false&&cro.sq)cro.sq=0;
      };
      var CROUTES=[[-17,-12,3.4,.3,0],[-22,-3,2.6,-.4,0],[-13,-22,2.4,.6,0],[16,-13,3,-.2,0],[21,-5,2.4,.5,0],[12,-23,2.2,0,0],[-8,-31,2.4,.4,1],[7,-33,2.8,-.3,1],[-5,-40,2.2,.2,1],[5,-42,2.4,.1,1],[0,-27,2,0,0]];
      var BANDS=[['#55300f',38],['#a8691a',26],['#d99a1f',12],['#eee3b4',0],['#f8f3d8',-8]];
      cro.draw=function(){
        if(cro.gone)return;
        var e=cro.sc,k=cro.h/100*e,t=tnow/1000,en=cro.en,amp=1+en*2.4,i,j;
        var tr=cro.mix>.3?cro.mix*cro.mix*3.2:0;
        cx.save();cx.translate(cro.x+(tr?rnd(-tr,tr):0),cro.y+(tr?rnd(-tr,tr):0)+(cro.held||cro.wet?0:Math.sin(tnow/820+cro.ph)*2));cx.rotate(cro.rot);cx.scale(k,k);
        cx.lineJoin='round';cx.lineCap='round';
        /* le liquide, couche par couche (de la plus dense à la plus légère), dans le repère du liquide qui reste à l'horizontale */
        cx.save();cx.clip(BODY);
        cx.translate(0,14);cx.rotate(-cro.rot+cro.sl);
        for(i=BANDS.length-1;i>=0;i--){
          var top=BANDS[i][1]-14-(i===0?0:0);
          cx.beginPath();cx.moveTo(-60,top+130);
          for(j=-60;j<=60;j+=6)cx.lineTo(j,top+Math.sin(j*.16+t*(2.2+i*.4)+i*1.7)*amp*.9*(i===4?1.2:1)+Math.sin(j*.07-t*1.3)*en*1.4);
          cx.lineTo(60,top+130);cx.closePath();cx.fillStyle=BANDS[i][0];cx.globalAlpha=i>=3?.96:.94;cx.fill();
        }
        cx.globalAlpha=1;
        /* ce qui flotte : crottes, grumeaux de lait ; et des filaments de sperme sous la surface */
        for(i=0;i<LUMPS.length;i++){
          var m=LUMPS[i],bt=BANDS[m.l===3?3:m.l][1]-14,bb=(BANDS[m.l===3?2:m.l-1]||[0,76])[1]-14,
              yy=(m.l===0?bt+8:(bt+bb)/2)+Math.sin(t*1.1+m.ph)*(1.6+en*1.5),xx=m.u+Math.sin(t*.8+m.ph*2)*(2+en*3);
          cx.beginPath();cx.ellipse(xx,yy,m.z,m.z*.72,Math.sin(m.ph)*.6,0,6.3);
          cx.fillStyle=m.l===3?'#fff6d2':'#6b3d17';cx.fill();cx.lineWidth=.9;cx.strokeStyle=m.l===3?'#cdbb86':'#2b1707';cx.stroke();
        }
        cx.strokeStyle='rgba(255,255,255,.85)';cx.lineWidth=2;
        for(i=0;i<3;i++){var sx=-18+i*17+Math.sin(t*.9+i)*3,sy0=BANDS[4][1]-14+3;cx.beginPath();cx.moveTo(sx,sy0);cx.bezierCurveTo(sx+4,sy0+6,sx-4,sy0+10,sx+2,sy0+16+Math.sin(t*1.4+i)*2);cx.stroke();}
        cx.restore();
        /* des croûtes séchées sur le verre au-dessus du liquide, et la collerette du goulot encroûtée (d'après le vrai bocal) */
        for(i=0;i<CROUTES.length;i++){
          var cr=CROUTES[i];cx.beginPath();cx.ellipse(cr[0],cr[1],cr[2],cr[2]*.7,cr[3],0,6.3);
          cx.fillStyle=cr[4]?'#d8cba4':'#8d6a38';cx.fill();cx.lineWidth=.8;cx.strokeStyle=cr[4]?'#8a7c55':'#4a3319';cx.stroke();
        }
        /* le verre : teinte, reflets, contour, anses et collerette */
        cx.fillStyle='rgba(170,215,195,.15)';cx.fill(BODY);
        cx.fillStyle='rgba(255,255,255,.34)';cx.beginPath();cx.ellipse(-22,6,3.4,15,.12,0,6.3);cx.fill();
        cx.fillStyle='rgba(255,255,255,.55)';cx.beginPath();cx.ellipse(-24,-6,1.8,4,.3,0,6.3);cx.fill();
        cx.fillStyle='rgba(255,255,255,.18)';cx.fillRect(-6,-42,3,18);
        cx.lineWidth=2.8;cx.strokeStyle='#14211a';cx.stroke(BODY);
        if(cro.mix>.3){
          var nk=Math.min(CRK.length,Math.ceil((cro.mix-.3)/.7*CRK.length)),pass,q2,w2;
          for(pass=0;pass<2;pass++){
            cx.lineWidth=pass?1.1:2.6;cx.strokeStyle=pass?'rgba(240,255,248,.95)':'rgba(10,20,15,.8)';cx.beginPath();
            for(q2=0;q2<nk;q2++){w2=CRK[q2];cx.moveTo(w2[0],w2[1]);for(j=2;j<w2.length;j+=2)cx.lineTo(w2[j],w2[j+1]);}
            cx.stroke();
          }
        }
        cx.lineWidth=2.4;cx.beginPath();cx.moveTo(-10,-33);cx.bezierCurveTo(-25,-37-1,-25,-22,-10,-24);cx.moveTo(10,-33);cx.bezierCurveTo(25,-37,25,-22,10,-24);cx.stroke();
        cx.lineWidth=1.3;cx.strokeStyle='rgba(190,225,205,.7)';cx.beginPath();cx.moveTo(-10,-33);cx.bezierCurveTo(-23,-36,-23,-23,-10,-25);cx.moveTo(10,-33);cx.bezierCurveTo(23,-36,23,-23,10,-25);cx.stroke();
        cx.beginPath();cx.moveTo(-12.5,-47);cx.lineTo(12.5,-47);cx.lineWidth=5;cx.strokeStyle='#14211a';cx.stroke();cx.lineWidth=2.6;cx.strokeStyle='#a9d6bd';cx.stroke();
        /* le bouchon de liège : planté dans le goulot, il saute et tourne quand on l'ouvre */
        var ck=cro.ck;cx.save();cx.translate(ck*13,-50-ck*30);cx.rotate(ck*.7);
        cx.beginPath();cx.moveTo(-6.4,-8);cx.lineTo(6.4,-8);cx.lineTo(7.4,7);cx.lineTo(-7.4,7);cx.closePath();
        cx.fillStyle='#c9985a';cx.fill();cx.lineWidth=2;cx.strokeStyle='#3b2610';cx.stroke();
        cx.fillStyle='rgba(92,58,22,.65)';[[-3,-3],[2,0],[-1,4],[4,-5],[-4.5,3]].forEach(function(q){cx.beginPath();cx.arc(q[0],q[1],.9,0,6.3);cx.fill();});
        cx.fillStyle='rgba(255,230,180,.55)';cx.fillRect(-5,-7,1.6,12);
        cx.restore();
        cx.restore();
        /* ouverte, elle dégage une odeur */
        if(SL.odeur&&ck>.4){var q=cro.h*.5;SL.odeur(cx,cro.x+q*Math.sin(cro.rot),cro.y-q*Math.cos(cro.rot)+cro.h*.12,cro.h*.34*e*ck,t);}
      };
      cro.place=function(){
        if(cro.gone)return;
        var w=cro.h*.95;btn.style.width=btn.style.height=w+'px';btn.style.transform='translate('+(cro.x-w/2)+'px,'+(cro.y-w/2)+'px)';
      };
    })();

    /* ---------- le fluide : dessin ---------- */
    function drawFluid(){
      var x0=ext.x0,x1=ext.x1,fl=ext.fl,x,y,mn=1e9,pts=[],i;
      if(lvlD<.5&&!(drops.length))return;
      for(x=x0;x<x1;x+=DX){y=surfAt(x);pts.push(x,y);if(y<mn)mn=y;}
      y=surfAt(x1);pts.push(x1,y);if(y<mn)mn=y;
      if(lvlD<.5)return;
      var n=pts.length;
      /* couche du fond, plus sombre, légèrement décalée */
      cx.beginPath();cx.moveTo(pts[0],pts[1]-5);
      for(i=2;i<n;i+=2)cx.lineTo(pts[i],pts[i+1]-5-Math.sin(pts[i]*.03-tnow/700)*2);
      cx.lineTo(x1,fl+4);cx.lineTo(x0,fl+4);cx.closePath();cx.fillStyle='rgba(64,196,92,.42)';cx.fill();
      /* le corps du fluide : citron en surface, vert profond au fond, assez translucide pour lire le texte au travers */
      var g=cx.createLinearGradient(0,mn,0,fl);
      /* vert de canalisation, comme le bocal de l'autel : émeraude vif et lumineux, translucide, qui ne s'assombrit pas au fond */
      g.addColorStop(0,'rgba(196,255,128,.58)');g.addColorStop(.25,'rgba(120,240,112,.58)');g.addColorStop(.65,'rgba(48,206,118,.6)');g.addColorStop(1,'rgba(20,160,104,.66)');
      cx.beginPath();cx.moveTo(pts[0],pts[1]);
      for(i=2;i<n;i+=2)cx.lineTo(pts[i],pts[i+1]);
      cx.lineTo(x1,fl+4);cx.lineTo(x0,fl+4);cx.closePath();cx.fillStyle=g;cx.fill();
      /* deux filets de lumière qui ondulent sous la surface, et un halo : la lumière traverse le fluide */
      cx.save();cx.clip();
      var hg=cx.createRadialGradient((x0+x1)/2,mn,0,(x0+x1)/2,mn,(x1-x0)*.55);hg.addColorStop(0,'rgba(236,255,190,.30)');hg.addColorStop(1,'rgba(236,255,190,0)');
      cx.fillStyle=hg;cx.fillRect(x0,mn,x1-x0,fl-mn+4);
      cx.lineWidth=2;cx.strokeStyle='rgba(226,255,170,.34)';
      for(var b=0;b<2;b++){
        var dy=24+b*46;cx.beginPath();
        for(x=x0;x<=x1;x+=DX*2){y=surfAt(x)+dy+Math.sin(x*.017+tnow/(900+b*300)+b*2)*5;if(x===x0)cx.moveTo(x,y);else cx.lineTo(x,y);}
        cx.stroke();
      }
      cx.restore();
      /* le liséré sombre du dessin animé, puis le reflet blanc qui glisse sur la surface */
      cx.lineJoin='round';cx.lineCap='round';
      cx.beginPath();cx.moveTo(pts[0],pts[1]);for(i=2;i<n;i+=2)cx.lineTo(pts[i],pts[i+1]);
      cx.lineWidth=3;cx.strokeStyle=CO.trait;cx.stroke();
      cx.beginPath();cx.moveTo(pts[0],pts[1]+6);for(i=2;i<n;i+=2)cx.lineTo(pts[i],pts[i+1]+6);
      cx.save();cx.strokeStyle=CO.reflet;cx.globalAlpha=.8;cx.lineWidth=2.4;cx.setLineDash([30,16,9,34,20,28]);cx.lineDashOffset=-tnow/80;cx.stroke();cx.restore();
    }
    function drawBubs(dt){
      var i,b,sy;
      if(lvlD>12&&bubs.length<(LOW?7:14)&&Math.random()<dt*3)bubs.push({x:rnd(ext.x0+10,ext.x1-10),y:ext.fl-rnd(2,Math.max(4,lvlD*.8)),r:rnd(1.6,4.6),vy:rnd(18,48),ph:rnd(0,6)});
      cx.lineWidth=1.3;
      for(i=bubs.length-1;i>=0;i--){
        b=bubs[i];b.y-=b.vy*dt;b.x+=Math.sin(tnow/380+b.ph)*10*dt;sy=surfAt(clamp(b.x,ext.x0,ext.x1));
        if(b.y<sy+3||lvlD<2||b.x<ext.x0||b.x>ext.x1){if(b.y<sy+3&&lvlD>2)wave(b.x,-.7);bubs.splice(i,1);continue;}
        cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fillStyle='rgba(214,255,134,.14)';cx.fill();cx.strokeStyle='rgba(235,255,200,.75)';cx.stroke();
        cx.fillStyle='rgba(255,255,255,.85)';cx.fillRect(b.x-b.r*.45,b.y-b.r*.5,Math.max(1,b.r*.3),Math.max(1,b.r*.3));
      }
    }
    function drawDrops(dt){
      var A=1700*Math.max(.6,gm),i,d;
      cx.lineWidth=1.2;
      for(i=drops.length-1;i>=0;i--){
        d=drops[i];cx.fillStyle=d.c||CO.vert;cx.strokeStyle=d.c?'#1a0f05':CO.trait;d.vx+=gx*A*dt*.8;d.vy+=gy*A*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.l-=dt;
        if(d.l<=0||d.y>ext.fl||d.x<0||d.x>CW){drops.splice(i,1);continue;}
        cx.beginPath();cx.ellipse(d.x,d.y,d.r*(1+Math.min(1,Math.hypot(d.vx,d.vy)/1500)),d.r,Math.atan2(d.vy,d.vx),0,6.3);cx.fill();cx.stroke();
      }
    }
    /* ---------- passerelle vers Éphébito (ephebito.js, chargé quand on secoue la dame-jeanne) ---------- */
    Object.defineProperties(FX,{CW:{get:function(){return CW;}},CH:{get:function(){return CH;}},t:{get:function(){return tnow;}},niv:{get:function(){return lvlD;}},tilt:{get:function(){return tilt;}}});
    FX.rnd=rnd;FX.clamp=clamp;FX.isM=isM;FX.SL=SL;FX.CO=CO;FX.cx=cx;FX.ext=ext;FX.items=items;FX.drops=drops;FX.bubs=bubs;FX.LOW=LOW;
    FX.surfAt=surfAt;FX.vsurf=vsurf;FX.wave=wave;FX.spray=spray;FX.mk=mkItem;FX.drawItem=drawItem;FX.parle=parle;FX.ferme=ferme;
    FX.bulle=function(){return bulle;};FX.lvlAdd=function(n){lvl=Math.min(cap(),lvl+n);};
    FX.bord=function(){
      var b=0,hd=document.querySelector('header'),nv=document.querySelector('nav');
      if(hd)b=hd.getBoundingClientRect().bottom;
      if(nv&&isM()){var r=nv.getBoundingClientRect();if(r.top<innerHeight/3)b=Math.max(b,r.bottom);}
      return Math.max(0,Math.round(b));
    };
    var plugT=0;
    FX.pret=function(){return !!(window.Ephebito&&window.Ephebito.ok());};
    FX.pre=function(){
      if(plugT)return;plugT=1;
      var sc=document.createElement('script');sc.src='/ephebito.js?v=1';
      sc.onload=function(){if(window.Ephebito)window.Ephebito.pre();else FX.echec=true;};sc.onerror=function(){FX.echec=true;};
      document.head.appendChild(sc);
    };
    FX.boum=function(o){window.Ephebito.boum(FX,o);};
    window.PutrideFx=FX;
    var last=performance.now(),skip=0;
    (function frame(now){
      var dt=Math.min(.05,((now||last)-last)/1000||0);last=now||last;tnow=last;
      var work=false;
      if(!document.hidden){
        if(LOW&&wasWork&&(skip^=1)){requestAnimationFrame(frame);return;}
        if(innerWidth!==CW||innerHeight!==CH)sizeCv();else upd();
        gx+=(tgx-gx)*.35;gy+=(tgy-gy)*.35;gm+=(tgm-gm)*.35;tilt+=(gx-tilt)*.1;
        slope+=(clamp(isM()?tilt*.32:0,-.4,.4)-slope)*.12;
        /* vidange : au changement de page, le niveau baisse, les objets s'en vont */
        if(vidFin){var reste=clamp((vidFin-last)/1000,0,VIDANGE);lvl=lvlVid*reste/VIDANGE;if(!reste){vidFin=0;lvl=0;items.length=0;}}
        lvlD+=(lvl-lvlD)*Math.min(1,dt*2.6);if(lvlD<.05&&lvl===0)lvlD=0;
        var ns=clamp(Math.round(dt*60),1,3),k,i;
        for(k=0;k<ns;k++){stepW(1/60);for(i=items.length-1;i>=0;i--){stepItem(items[i],1/60);if(items[i].dead)items.splice(i,1);}if(cro)cro.step(1/60);if(FX.eph)FX.eph.step(1/60);}
        work=lvlD>.5||drops.length>0||items.length>0||(cro&&!cro.gone)||(FX.eph&&FX.eph.on);
        cx.clearRect(0,0,CW,CH);
        if(work){
          for(i=0;i<items.length;i++)if(!items[i].held)drawItem(items[i]);
          if(FX.eph)FX.eph.draw();
          if(cro&&!cro.held)cro.draw();
          drawFluid();drawBubs(dt);drawDrops(dt);
          if(cro&&cro.held)cro.draw();
          if(FX.eph){FX.eph.top();FX.eph.place();}
          if(cro)cro.place();
          placeBulle();
        }
      }
      wasWork=work;
      if(work)requestAnimationFrame(frame);else setTimeout(function(){requestAnimationFrame(frame);},document.hidden?1000:220);
    })(last);
    /* chaque nouvelle page repart d'un sol propre */
    document.addEventListener('putride:page',function(){
      if(lvl>0){vidFin=performance.now()+VIDANGE*1000;lvlVid=lvl;items.forEach(function(it){it.out=true;});}
      layer.textContent='';
    });
    function sources(){
      var r=[],m=mainBox();if(!m)return r;
      var a=Math.max(m.left,0)+10,b=Math.min(m.right,innerWidth-16)-10,floor=ext.fl-lvl;
      /* sous les barres du haut, ce sont les coulures de la nappe qui lachent les gouttes (cf. plus bas) */
      Array.prototype.forEach.call(document.querySelectorAll('main h2'),function(e){var q=e.getBoundingClientRect();if(q.bottom>180&&q.bottom<Math.min(innerHeight,floor)-120)r.push({y:q.bottom-2,a:q.left+10,b:Math.min(q.right,q.left+400)});});
      Array.prototype.forEach.call(document.querySelectorAll('main .rtfig'),function(e){var q=e.getBoundingClientRect();if(q.bottom>180&&q.bottom<Math.min(innerHeight,floor)-120)r.push({y:q.bottom-2,a:q.left+10,b:q.right-10});});
      return r;
    }
    function splash(x,y,w){
      if(isM())pendX=x;
      var add=function(cls,css){var e=document.createElement('i');e.className=cls;e.style.cssText=css;layer.appendChild(e);return e;};
      lvl=Math.min(cap(),lvl+inc(w));wave(x,w*.55);
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
        var mob=isM(),floor=vsurf(x),seen=floor<innerHeight,dist=Math.min(floor,innerHeight+30)-y0-w*k;
        if(dist<20){d.remove();return;}
        var dx=mob?clamp(tilt*dist*.5,-innerWidth*.45,innerWidth*.45):0,x2=clamp(x+dx,6,innerWidth-6);dx=x2-x;
        var rot=mob?' rotate('+(-Math.atan2(dx,dist)*57.3).toFixed(1)+'deg)':'';
        var bead=document.createElement('i');bead.className='dd';bead.style.cssText='left:'+(x-w*.3)+'px;top:'+(y0-1)+'px;width:'+w*.6+'px;height:'+w*.45+'px';
        /* la perle qui reste accrochee au bord (pas pour les coulures de la nappe, qui remontent d'elles-memes) */
        if(perle){layer.appendChild(bead);bead.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.4)',opacity:0}],{duration:900}).finished.then(function(){bead.remove();});}
        d.animate([{transform:'translateY(0) scale(.85,'+k+')'},{transform:'translate('+dx+'px,'+dist+'px)'+rot+' scale(.75,'+k*1.3+')'}],{duration:Math.sqrt(dist/innerHeight)*850+180,easing:'cubic-bezier(.55,0,.9,.55)',fill:'forwards'}).finished.then(function(){
          var nb=mainBox();
          if(nb&&seen){splash(x2,vsurf(x2),w);}else{lvl=Math.min(cap(),lvl+inc(w));}
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
    (function tick(){drop();setTimeout(tick,isM()?rnd(1500,3300):rnd(1800,3800));})();
  })();

  /* Recherche : uniquement dans les pages du mode putride */
  var PAGES=['/mode-putride/accueil/','/mode-putride/territoire/','/mode-putride/bestiaire/','/mode-putride/discographie/','/mode-putride/ustensiles/','/mode-putride/mefaits/','/mode-putride/univers/','/mode-putride/archives/','/mode-putride/archives/dossiers-compromettants/','/mode-putride/archives/dossiers-compromettants/deguise-en-nazi/','/mode-putride/archives/dossiers-compromettants/montages-sataniques/','/mode-putride/in-odium-fidei/','/mode-putride/discographie/ces-beau-cela/','/mode-putride/discographie/chyren/','/mode-putride/discographie/confiteor/','/mode-putride/discographie/connasse/','/mode-putride/discographie/jarrive-en-tesla/','/mode-putride/discographie/le-retour-de-la-couche/','/mode-putride/discographie/les-gamins-jleur-mets-la-puree/','/mode-putride/discographie/lincontinence/','/mode-putride/discographie/machines/','/mode-putride/discographie/mais-si-quest-vrai/','/mode-putride/discographie/mauvaises-nouvelles-des-enfers-1/','/mode-putride/discographie/mauvaises-nouvelles-des-enfers-2/','/mode-putride/discographie/mets-la-cam/','/mode-putride/discographie/oh-non-herve/','/mode-putride/discographie/oh-non-je-fais-appel/','/mode-putride/discographie/omerta434/','/mode-putride/discographie/palestine-gratuit/','/mode-putride/discographie/peter-sur-la-friture/','/mode-putride/discographie/putain-de-sa-race/','/mode-putride/discographie/rien-a-declarer/','/mode-putride/bestiaire/createur/','/mode-putride/bestiaire/edwarda/','/mode-putride/bestiaire/rouen/','/mode-putride/bestiaire/ephebus/','/mode-putride/bestiaire/ephebelle/','/mode-putride/bestiaire/ephebito/','/mode-putride/bestiaire/ver/','/mode-putride/bestiaire/gargouille/','/mode-putride/bestiaire/saints-de-rouen/','/mode-putride/bestiaire/la-fourolle/','/mode-putride/bestiaire/pere-kitz-latouch/','/mode-putride/bestiaire/vampirix/','/mode-putride/bestiaire/retard-tinables/','/mode-putride/bestiaire/christophe-chevanne/','/mode-putride/bestiaire/herve-martin/','/mode-putride/bestiaire/jean-marie-gomis/','/mode-putride/bestiaire/thierry-haye/','/mode-putride/bestiaire/patrice-strilli/','/mode-putride/bestiaire/patrick-servanin/','/mode-putride/bestiaire/jean-pierre-herlant/','/mode-putride/bestiaire/gilbert-chabrolles/','/mode-putride/bestiaire/pacificsound3003/'];
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
