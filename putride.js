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
    /* au plus un tiers de la zone de texte visible, quelle que soit la façon dont il est réparti */
    var cap=function(){var m=document.querySelector('main');return Math.min(Math.max(40,innerHeight-hdrBottom())/3,m?m.offsetHeight*.5:1e9);};
    /* ---------- le fluide : une surface d'ondes (champ de hauteurs) dessinée sur un seul canvas, la même sur ordinateur et téléphone ----------
       Il monte avec les gouttes, jusqu'au tiers de l'écran au maximum. Chaque goutte, chaque objet qui tombe y fait des vagues ;
       sur téléphone, l'inclinaison et les secousses le font glisser et déborder. Les crottes flottent, les clystères en étain coulent. */
    var cv=document.createElement('canvas');cv.id='mpool';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
    var cxF=cv.getContext('2d'),cx=cxF;
    /* les objets (dame-jeanne, crottes, clystères, gouttes) vivent sur un second canvas, au-dessus du texte ; le fluide, lui, passe sous le texte */
    var cv2=document.createElement('canvas');cv2.id='mobj';cv2.setAttribute('aria-hidden','true');document.body.appendChild(cv2);
    var cxO=cv2.getContext('2d');
    var LOW=(navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||4)<=4||innerWidth*(window.devicePixelRatio||1)<700;
    var dpr=LOW?1:Math.min(window.devicePixelRatio||1,1.5);
    var CW=0,CH=0,DX=LOW?10:7,NC=0,OFF=0,HH=null,VV=null,ext={x0:0,x1:0,fl:0,tp:0};
    var SF={c:0,nx:0,ny:1,tx:1,ty:0,t0:0,t1:0},ang=0,angv=0,tdown=0,rm0=0;
    var tint=0,tintT=0,rT=0,rd=0,puffs=[],FP=null,pours=[],scr=[],scrDirty=true,scrT=0;
    var gx=0,gy=1,gm=1,tgx=0,tgy=1,tgm=1,sens=false,lvlD=0,tnow=0,pendX=0,wasWork=false;
    var drops=[],items=[],bubs=[],cro=null,FX={};
    /* hauteur des barres collées en haut (en-tête, et navigation sur téléphone) */
    function hdrBottom(){
      var b=0,hd=document.querySelector('header'),nv=document.querySelector('nav');
      if(hd)b=hd.getBoundingClientRect().bottom;
      if(nv&&isM()){var r=nv.getBoundingClientRect();if(r.top<innerHeight/3)b=Math.max(b,r.bottom);}
      return Math.max(0,Math.round(b));
    }
    /* la cuve du fluide : la zone de texte visible, du bas des barres du haut jusqu'à la barre verte du pied de page (ou le bas de l'écran) */
    function upd(){
      var m=mainBox(),ft=document.querySelector('.pfoot'),fb=ft?ft.getBoundingClientRect().top:CH;
      ext.x0=Math.max(0,m?m.left:0);ext.x1=Math.min(CW,m?m.right:CW);
      ext.fl=Math.min(CH,fb,m?Math.max(m.bottom,60):CH);
      ext.tp=Math.min(ext.fl-40,Math.max(hdrBottom(),m?m.top:0));
    }
    function sizeCv(){
      CW=innerWidth;CH=innerHeight;cv.width=cv2.width=Math.round(CW*dpr);cv.height=cv2.height=Math.round(CH*dpr);cxF.setTransform(dpr,0,0,dpr,0,0);cxO.setTransform(dpr,0,0,dpr,0,0);scrDirty=true;
      OFF=CW+CH;NC=Math.ceil(2*OFF/DX)+4;HH=new Float32Array(NC);VV=new Float32Array(NC);upd();
    }
    sizeCv();pendX=CW/2;
    addEventListener('resize',sizeCv);
    /* ---------- le fluide : une cuve dont le volume est conservé ----------
       La surface est une droite perpendiculaire à la pesanteur du fluide (n, vers le « bas » du fluide), placée de sorte que l'aire en dessous
       vaille le volume ; un champ de hauteurs d'ondes court le long de cette droite. Quand on incline le téléphone, la pesanteur du fluide
       suit avec un ressort (il déborde, clapote) : il peut grimper sur les côtés ou au plafond, mais le total reste le même. */
    function hAt(t){
      var c=(t+OFF)/DX;if(c<0)c=0;if(c>NC-2)c=NC-2;var i=c|0,f=c-i;return HH[i]*(1-f)+HH[i+1]*f;
    }
    function amb(t){return (Math.sin(t*.021+tnow/620)*1.5+Math.sin(t*.049-tnow/430)*.9)*Math.min(1,lvlD/14);}
    function areaBelow(c){
      var R=[[ext.x0,ext.tp],[ext.x1,ext.tp],[ext.x1,ext.fl],[ext.x0,ext.fl]],o=[],i,a,b,da,db,k,sa=0;
      for(i=0;i<4;i++){
        a=R[i];b=R[(i+1)&3];da=SF.nx*a[0]+SF.ny*a[1]-c;db=SF.nx*b[0]+SF.ny*b[1]-c;
        if(da>=0)o.push(a);
        if((da>=0)!==(db>=0)){k=da/(da-db);o.push([a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k]);}
      }
      for(i=0;i<o.length;i++){a=o[i];b=o[(i+1)%o.length];sa+=a[0]*b[1]-b[0]*a[1];}
      return Math.abs(sa)/2;
    }
    function solve(){
      var s=Math.sin(ang),c=Math.cos(ang),W=ext.x1-ext.x0,H=ext.fl-ext.tp,i,lo=1e9,hi=-1e9,d,V,tmn=1e9,tmx=-1e9,t;
      SF.nx=s;SF.ny=c;SF.tx=c;SF.ty=-s;
      var K=[[ext.x0,ext.tp],[ext.x1,ext.tp],[ext.x1,ext.fl],[ext.x0,ext.fl]];
      for(i=0;i<4;i++){d=s*K[i][0]+c*K[i][1];if(d<lo)lo=d;if(d>hi)hi=d;t=c*K[i][0]-s*K[i][1];if(t<tmn)tmn=t;if(t>tmx)tmx=t;}
      SF.t0=tmn-DX;SF.t1=tmx+DX;
      V=Math.min(lvlD*W,W*H*.985);
      var a=lo,b=hi;
      for(i=0;i<18;i++){d=(a+b)/2;if(areaBelow(d)>V)a=d;else b=d;}
      SF.c=(a+b)/2;
    }
    /* profondeur d'un point dans le fluide, mesurée le long de la pesanteur du fluide (positive dedans) */
    function dep(x,y){
      if(lvlD<.5||x<ext.x0||x>ext.x1||y<ext.tp-40||y>ext.fl+10)return -1e4;
      var t=x*SF.tx+y*SF.ty;
      return SF.nx*x+SF.ny*y-(SF.c-hAt(t)-amb(t));
    }
    /* un point de la surface, juste « au-dessus » de (x,y) */
    function surfPt(x,y,d){return [x-SF.nx*d,y-SF.ny*d];}
    /* ordonnée de la surface en x (utile tant que le téléphone est plutôt droit) */
    function surfAt(x){
      if(lvlD<.5||SF.ny<.2)return ext.fl;
      var y=ext.fl,k,t;
      for(k=0;k<2;k++){t=x*SF.tx+y*SF.ty;y=clamp((SF.c-hAt(t)-amb(t)-SF.nx*x)/SF.ny,ext.tp,ext.fl);}
      return y;
    }
    var vsurf=function(x){return lvlD>.5?surfAt(clamp(x,ext.x0,ext.x1)):ext.fl;};
    /* tangente locale de la surface (vecteur unitaire), pente des ondes comprise */
    function slopeT(x,y){
      var t=x*SF.tx+y*SF.ty,i=clamp(((t+OFF)/DX)|0,1,NC-3),sl=-(HH[i+1]-HH[i-1])/(2*DX),vx=SF.tx+sl*SF.nx,vy=SF.ty+sl*SF.ny,l=Math.hypot(vx,vy)||1;
      return [vx/l,vy/l];
    }
    function waveT(t,amt){
      var c=Math.round((t+OFF)/DX),d,k;
      for(d=-4;d<=4;d++){k=c+d;if(k>0&&k<NC-1)VV[k]-=amt*(1-Math.abs(d)/5);}
    }
    function wave(x,amt,y){
      if(y===undefined)y=surfAt(x);
      waveT(x*SF.tx+y*SF.ty,amt);
    }
    /* un objet qui se déplace dans le fluide le pousse devant lui et le creuse derrière */
    function stir(x,y,vx,vy,w){
      var t=x*SF.tx+y*SF.ty,vt=vx*SF.tx+vy*SF.ty,vn=vx*SF.nx+vy*SF.ny,a=clamp(Math.abs(vt)*.0024,0,4.5)*w,sg=vt>0?1:-1;
      if(a>.15){
        waveT(t+sg*14,-a);waveT(t-sg*14,a*.6);
        if(a>1.6&&bubs.length<18&&Math.random()<.25)bubs.push({x:x+rnd(-10,10),y:y+rnd(-6,10),r:rnd(1.6,3.2),vy:rnd(25,55),ph:rnd(0,6)});
      }
      var b=clamp(vn*.0013,-3,3)*w;if(Math.abs(b)>.2)waveT(t,-b);
    }
    function spray(x,y,n,pw,col,f){
      for(var i=0;i<n&&drops.length<(col?(f?140:90):50);i++)drops.push({x:x+rnd(-8,8),y:y,vx:rnd(-190,190)*pw,vy:-rnd(160,520)*pw,r:rnd(1.4,3.6),l:rnd(.5,1),c:col&&(col.pop?col[(Math.random()*col.length)|0]:col),f:f});
    }
    function stepW(dt){
      var i0=Math.max(1,Math.floor((SF.t0+OFF)/DX)),i1=Math.min(NC-2,Math.ceil((SF.t1+OFF)/DX)),i,l,r;
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
      x/=9.8;y/=9.8;sens=true;
      var m=Math.sqrt(x*x+y*y);
      if(m<.12){tgx=0;tgy=1;tgm=.3;return;}
      tgx=x/m;tgy=y/m;tgm=clamp(m,.18,3.4);
      if(m>1.5&&lvlD>2){for(var k=0;k<6;k++)waveT(rnd(SF.t0,SF.t1),rnd(-9,9)*(m-1));spray(rnd(ext.x0,ext.x1),vsurf(CW/2),3,.6);}
    };
    var ios=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(window.DeviceMotionEvent){
      /* on écoute d'emblée (Android, navigateurs sans autorisation) ; iOS ne livre rien avant l'autorisation, réclamée au premier geste */
      addEventListener('devicemotion',onMot);
      if(typeof DeviceMotionEvent.requestPermission==='function'){
        var demande=false,ask=function(){
          if(demande)return;demande=true;
          try{DeviceMotionEvent.requestPermission().then(function(r){if(r==='granted')addEventListener('devicemotion',onMot);}).catch(function(){demande=false;});}catch(_){demande=false;}
        };
        ['touchend','click'].forEach(function(n){document.addEventListener(n,ask,{passive:true});});
      }
    }
    /* un doigt (ou le curseur appuyé) dans le fluide le brasse */
    var fing=null;
    var tmv=function(ev){
      var t=ev.touches[0],n=performance.now();
      if(!t){fing=null;return;}
      if(!fing||ev.type==='touchstart'){fing={x:t.clientX,y:t.clientY,t:n};return;}
      var dt=Math.max(8,n-fing.t)/1000,vx=(t.clientX-fing.x)/dt;
      if(lvlD>2&&dep(t.clientX,t.clientY)>-30)wave(t.clientX,clamp(vx*.006,-5,5),t.clientY);
      fing.x=t.clientX;fing.y=t.clientY;fing.t=n;
    };
    document.addEventListener('touchstart',tmv,{passive:true});
    document.addEventListener('touchmove',tmv,{passive:true});
    document.addEventListener('touchend',tmv,{passive:true});
    document.addEventListener('touchcancel',function(){fing=null;},{passive:true});

    /* ---------- objets qui tombent dans le fluide : les crottes flottent, les clystères en étain coulent ---------- */
    function mkItem(k,x,y,vx,vy){
      var sz=k===2?(isM()?10:13):k?(isM()?78:106):(isM()?30:36),it={k:k,x:x,y:y,vx:vx,vy:vy,rot:rnd(-1,1),vr:rnd(-4,4),s:sz,sq:0,z:rnd(.9,1.1),wet:false,out:false,sc:1,dz:rnd(0,6)};
      items.push(it);return it;
    }
    function spawnItem(){
      var E=FX.eph&&FX.eph.on;
      var np=0;items.forEach(function(it){if(it.k!==2)np++;});
      if(np>=(E?10:6)||(lvl<7&&!E)||document.hidden||vidFin||gy<.3)return;
      var nc=0,nk=0,mx=E?5:3;items.forEach(function(it){if(it.k===1)nk++;else if(it.k===0)nc++;});
      var k=Math.random()<.5?0:1;if(k&&nk>=mx)k=0;else if(!k&&nc>=mx)k=1;
      var sz=k?(isM()?78:106):(isM()?30:36),w=Math.max(10,ext.x1-ext.x0-60);
      mkItem(k,ext.x0+30+Math.random()*w,-sz,rnd(-40,40),rnd(0,120));
    }
    (function loopSpawn(){spawnItem();setTimeout(loopSpawn,(FX.eph&&FX.eph.on)?rnd(2400,4600):rnd(4500,10000));})();
    function stepItem(it,dt){
      var A=1700*Math.max(.6,gm),dp,inW,T,a,k1,vn,vt,push,tg,df;
      if(it.out){it.sc-=dt*1.2;if(it.sc<=0){it.dead=true;return;}}
      if(it.held){
        it.wet=false;
        if(lvlD>2&&dep(it.x,it.y)>-it.s*.15)stir(it.x,it.y,it.hvx||0,it.hvy||0,it.k?1.3:.9);
        it.hvx=(it.hvx||0)*.86;it.hvy=(it.hvy||0)*.86;return;
      }
      if(it.k===2){
        /* galet : une petite crotte dure, qui coule lentement et reste au fond */
        it.age=(it.age||0)+dt;
        it.vx+=gx*A*dt;it.vy+=gy*A*dt;
        if(lvlD>2&&dep(it.x,it.y)>0){
          if(!it.wet){it.wet=true;wave(it.x,clamp(it.vy*.003,0,3),it.y);}
          it.vx+=(gx*90-it.vx)*Math.min(1,dt*2);it.vy+=(gy*90-it.vy)*Math.min(1,dt*2);it.vr*=1-Math.min(1,dt*3);
        }else it.wet=false;
        it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=it.vr*dt;
        if(it.x<ext.x0+6){it.x=ext.x0+6;it.vx*=-.3;}else if(it.x>ext.x1-6){it.x=ext.x1-6;it.vx*=-.3;}
        var flp=ext.fl-it.s*.4;if(it.y>flp){it.y=flp;it.vy=0;it.vx*=.7;it.vr=0;}
        if(it.age>45&&!it.out)it.out=true;
        return;
      }
      it.vx+=gx*A*dt;it.vy+=gy*A*dt;
      dp=dep(it.x,it.y);inW=lvlD>2&&dp>-(it.k?it.s*.04:it.s*.15);
      if(inW){
        T=slopeT(it.x,it.y);vn=it.vx*SF.nx+it.vy*SF.ny;
        if(!it.wet){
          it.wet=true;var sp=surfPt(it.x,it.y,dp);
          wave(it.x,clamp(vn*.011*(it.k?1.6:1),0,14),it.y);spray(sp[0],sp[1],it.k?8:5,.7);
          for(var q=0;q<4;q++)bubs.push({x:it.x+rnd(-12,12),y:it.y+rnd(-4,10),r:rnd(1.6,3.4),vy:rnd(25,60),ph:rnd(0,6)});
        }
        if(it.k===0){
          /* la crotte flotte : poussée vers la surface, entraînée vers le bas de la pente, couchée sur la houle */
          a=-(dp-it.s*.1)*55;it.vx+=SF.nx*a*dt;it.vy+=SF.ny*a*dt;
          k1=Math.min(1,dt*3.5);vn=it.vx*SF.nx+it.vy*SF.ny;it.vx-=SF.nx*vn*k1;it.vy-=SF.ny*vn*k1;
          push=(SF.nx*T[0]+SF.ny*T[1])*900*dt;it.vx+=T[0]*push;it.vy+=T[1]*push;
          k1=Math.min(1,dt*1.6);vt=it.vx*SF.tx+it.vy*SF.ty;it.vx-=SF.tx*vt*k1;it.vy-=SF.ty*vt*k1;
          tg=Math.atan2(T[1],T[0]);if(tg>1.5708)tg-=3.1416;else if(tg<-1.5708)tg+=3.1416;
          df=tg*.9+Math.sin(tnow/700+it.dz)*.12-it.rot;it.rot+=df*Math.min(1,dt*5);it.vr*=1-Math.min(1,dt*4);
        }else{
          /* le clystère en étain coule doucement */
          k1=Math.min(1,dt*3);vn=it.vx*SF.nx+it.vy*SF.ny;it.vx+=SF.nx*(78-vn)*k1;it.vy+=SF.ny*(78-vn)*k1;
          k1=Math.min(1,dt*2.2);vt=it.vx*SF.tx+it.vy*SF.ty;it.vx-=SF.tx*vt*k1;it.vy-=SF.ty*vt*k1;
          it.vr+=Math.sin(tnow/520+it.dz)*.5*dt;it.vr*=1-Math.min(1,dt*1.2);
        }
        stir(it.x,it.y,it.vx,it.vy,it.k?1.1:.7);
      }else it.wet=false;
      it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=it.vr*dt;
      if(it.x<ext.x0+10){it.x=ext.x0+10;it.vx*=-.4;}else if(it.x>ext.x1-10){it.x=ext.x1-10;it.vx*=-.4;}
      var fl=ext.fl-it.s*(it.k?.1:.45);
      if(it.y>fl){it.y=fl;if(it.vy>260)it.sq=.2;it.vy=it.k?0:-it.vy*.25;it.vx*=.8;if(it.k)it.rot+=((it.z>1?.1:-.1)-it.rot)*Math.min(1,dt*3);}
      /* au plafond quand le téléphone est à l'envers */
      if(it.y>ext.tp+40)it.in=true;
      if(it.in&&it.y<ext.tp+it.s*.4){it.y=ext.tp+it.s*.4;it.vy*=-.3;}
      var sqv=clamp(-Math.abs(it.vy)/1600,-.16,0);it.sq+=(sqv-it.sq)*Math.min(1,dt*9);
    }
    var bts=[];
    function mkBtn(it){
      var b=document.createElement('button');b.type='button';b.className='fx-it';b.tabIndex=-1;
      b.setAttribute('aria-label',it.k?'Clystère : saisissez-le et lancez-le':'Crotte : saisissez-la et lancez-la');
      document.body.appendChild(b);it.bt=b;bts.push(it);
      var dr=null,hist=[];
      b.addEventListener('pointerdown',function(e){
        if(e.button||it.dead)return;
        e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(_){}
        dr={id:e.pointerId,ox:it.x-e.clientX,oy:it.y-e.clientY};it.held=true;it.usr=true;it.vx=it.vy=0;it.vr=0;it.hv=0;it.hvx=it.hvy=0;it.wet=false;
        hist=[{x:it.x,y:it.y,t:performance.now()}];document.documentElement.classList.add('cro-prise');
      });
      b.addEventListener('pointermove',function(e){
        if(!dr||e.pointerId!==dr.id||!it.held)return;
        it.x=clamp(e.clientX+dr.ox,8,CW-8);it.y=clamp(e.clientY+dr.oy,8,CH-8);
        var n=performance.now(),f,l;hist.push({x:it.x,y:it.y,t:n});while(hist.length>2&&n-hist[0].t>110)hist.shift();
        f=hist[0];l=hist[hist.length-1];var dt=Math.max(16,l.t-f.t)/1000,vx=(l.x-f.x)/dt,vy=(l.y-f.y)/dt;it.hv=Math.hypot(vx,vy);it.hvx=vx;it.hvy=vy;
        /* le clystère pointe où on l'emmène, et sa canule suit le doigt : de quoi planter avec précision */
        if(it.k){
          if(it.hv>240){var d=Math.atan2(vy,vx)-it.rot;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;it.rot+=d*.35;}
          dr.ox+=(-Math.cos(it.rot)*it.s*.42-dr.ox)*.18;dr.oy+=(-Math.sin(it.rot)*it.s*.42-dr.oy)*.18;
        }else it.rot+=(clamp(vx/2600,-.4,.4)-it.rot)*.3;
      });
      function fin(e){
        if(!dr||e.pointerId!==dr.id)return;dr=null;
        if(!it.held)return;
        it.held=false;document.documentElement.classList.remove('cro-prise');
        var f=hist[0],l=hist[hist.length-1],dt=Math.max(30,l.t-f.t)/1000,vx=(l.x-f.x)/dt,vy=(l.y-f.y)/dt,sp=Math.hypot(vx,vy);
        if(sp>2400){vx*=2400/sp;vy*=2400/sp;}
        it.vx=vx;it.vy=vy;it.vr=it.k?0:vx*.004;it.wet=false;
      }
      b.addEventListener('pointerup',fin);b.addEventListener('pointercancel',fin);
    }
    function placeItems(){
      var i,it,w,h;
      for(i=0;i<items.length;i++){it=items[i];if(!it.bt&&!it.out&&!it.dead&&it.k!==2)mkBtn(it);}
      for(i=bts.length-1;i>=0;i--){
        it=bts[i];
        if(it.dead||items.indexOf(it)<0){if(it.held)document.documentElement.classList.remove('cro-prise');it.bt.remove();bts.splice(i,1);continue;}
        it.bt.style.display=it.out?'none':'';if(!it.bt)continue;
        if(it.k){w=Math.max(46,it.s*1.05);h=Math.max(46,it.s*.34);it.bt.style.width=w+'px';it.bt.style.height=h+'px';it.bt.style.transform='translate('+it.x+'px,'+it.y+'px) rotate('+it.rot+'rad) translate('+(-w/2)+'px,'+(-h/2)+'px)';}
        else{w=Math.max(46,it.s*1.5);it.bt.style.width=it.bt.style.height=w+'px';it.bt.style.transform='translate('+(it.x-w/2)+'px,'+(it.y-it.s*.5-w/2)+'px)';}
      }
    }
    function drawItem(it){
      var e=it.sc;
      if(it.k===2){
        var pr2=it.s*e;cx.save();cx.translate(it.x,it.y);cx.rotate(it.rot);
        cx.beginPath();cx.ellipse(0,0,pr2*.56,pr2*.4,0,0,6.3);cx.fillStyle=it.z>1?'#6b3d17':'#5a3414';cx.fill();cx.lineWidth=1.2;cx.strokeStyle='#241206';cx.stroke();
        cx.fillStyle='rgba(190,130,70,.55)';cx.beginPath();cx.ellipse(-pr2*.15,-pr2*.13,pr2*.2,pr2*.1,-.3,0,6.3);cx.fill();cx.restore();
      }
      else if(it.k===0){if(SL.crotte)SL.crotte(cx,it.x,it.y+it.s*.35,it.s*e,it.rot,it.sq);}
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
           sl:0,slv:0,en:0,pev:0,ck:0,ckv:0,ph:rnd(0,6),mix:0,boom:false,ret:false,plong:0,pvx:0,pt:0,cool:0,dirt:0,pier:[],deb:null};
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
        if(cro.gone){stepDeb(dt);return;}
        cro.sc+=(1-cro.sc)*Math.min(1,dt*5);
        var h=cro.h,r=cro.r,sy,sx,inW,pi,dpc=dep(cro.x,cro.y),Tv,vn0,vt0,k1;
        sx=cro.x-SF.nx*Math.max(dpc,0);sy=cro.y-SF.ny*Math.max(dpc,0);
        /* dans le fluide : elle se lave, perd ses clystères, et brasse ce qu'elle déplace */
        var sub0=lvlD>2&&dpc>h*.08;
        if(sub0){
          rm0=0;
          if(cro.pier.length&&(cro.rm=(cro.rm||0)-dt)<=0){
            cro.rm=.28;var pr0=cro.pier.pop(),wq=wpt(pr0.x,pr0.y),qi=mkItem(1,wq[0],wq[1],rnd(-70,70),rnd(-40,30));
            qi.rot=pr0.a+cro.rot;qi.usr=false;spray(wq[0],wq[1],5,.5,['#e8fff4','#d6ff86']);
            for(var qz=0;qz<3;qz++)bubs.push({x:wq[0]+rnd(-8,8),y:wq[1]+rnd(-6,6),r:rnd(1.6,3),vy:rnd(25,50),ph:rnd(0,6)});
          }
          if(cro.dirt>0){cro.dirt=Math.max(0,cro.dirt-dt*.9);if(bubs.length<18&&Math.random()<dt*10)bubs.push({x:cro.x+rnd(-12,12),y:cro.y+rnd(-10,20),r:rnd(1.6,3),vy:rnd(25,50),ph:rnd(0,6)});}
          stir(cro.x,cro.y,(cro.x-cro.px)/dt,(cro.y-(cro.py||cro.y))/dt,1.5);
        }
        cro.py=cro.y;
        /* chaque trou laisse couler un peu de ce qu'il y a dedans */
        for(pi=0;pi<cro.pier.length;pi++){
          var pr=cro.pier[pi];pr.lk-=dt;
          if(pr.lk<=0&&drops.length<80){pr.lk=rnd(.12,.3);var wp=wpt(pr.x,pr.y);drops.push({x:wp[0]+rnd(-2,2),y:wp[1],vx:rnd(-18,18),vy:rnd(20,90),r:rnd(1.3,2.4),l:rnd(.7,1.1),c:LIQ[bandAt(pr.y)]});}
        }
        if(!cro.held){
          if(cro.fly>0)cro.fly-=dt;
          if(cro.cool>0)cro.cool-=dt;
          cro.vy+=(cro.fly>0?1500:0)*dt;
          inW=lvlD>2&&dpc>-h*.12;
          /* lancée dans le fluide : elle s'y enfonce en freinant, puis en ressort avec la force avec laquelle on l'y a envoyée */
          if(cro.fly>0&&inW&&cro.cool<=0&&!cro.plong&&dpc>h*.1&&Math.hypot(cro.vx,cro.vy)>300){
            cro.plong=Math.min(2600,Math.hypot(cro.vx,cro.vy));cro.pvx=cro.vx;cro.pt=0;
            wave(cro.x,clamp(cro.plong*.006,2,14),cro.y);spray(sx,sy,10,1,CO.vert);cro.slv+=rnd(-4,4);
            for(var qb=0;qb<5;qb++)bubs.push({x:cro.x+rnd(-14,14),y:sy+rnd(4,22),r:rnd(1.8,4),vy:rnd(25,60),ph:rnd(0,6)});
          }
          if(cro.plong){
            cro.pt+=dt;cro.vx*=1-Math.min(1,dt*8);cro.vy*=1-Math.min(1,dt*8);cro.rot+=cro.vr*dt*.3;
            if(cro.pt>.2){
              var dir=cro.pvx<0?-1:1;cro.vy=-cro.plong;cro.vx=cro.pvx*.5+dir*40;cro.vr=cro.vx*.004;cro.fly=2.4;cro.cool=.6;cro.plong=0;
              wave(cro.x,-clamp(cro.vy*-.004,1,9),cro.y);spray(sx,sy,12,1.25,CO.vert);
            }
          }
          if(inW&&cro.fly<=0&&!cro.plong){
            /* elle ne coule pas : elle flotte, le col hors du fluide */
            if(!cro.wet){cro.wet=true;wave(cro.x,clamp(Math.abs(cro.vy)*.012,0,13),cro.y);spray(sx,sy,6,.7);cro.slv+=rnd(-2,2);}
            Tv=slopeT(cro.x,cro.y);
            var ab=-(dpc-h*.1)*55;cro.vx+=SF.nx*ab*dt;cro.vy+=SF.ny*ab*dt;
            k1=Math.min(1,dt*3.5);vn0=cro.vx*SF.nx+cro.vy*SF.ny;cro.vx-=SF.nx*vn0*k1;cro.vy-=SF.ny*vn0*k1;
            var pu=(SF.nx*Tv[0]+SF.ny*Tv[1])*900*dt;cro.vx+=Tv[0]*pu;cro.vy+=Tv[1]*pu;
            k1=Math.min(1,dt*1.6);vt0=cro.vx*SF.tx+cro.vy*SF.ty;cro.vx-=SF.tx*vt0*k1;cro.vy-=SF.ty*vt0*k1;
            var tg0=Math.atan2(Tv[1],Tv[0]);if(tg0>1.5708)tg0-=3.1416;else if(tg0<-1.5708)tg0+=3.1416;
            cro.rot+=((tg0*.9+Math.sin(tnow/700)*.07)-cro.rot)*Math.min(1,dt*5);
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
      /* taches de merde : positions fixes sur le verre (repère du verre) */
      var DB=[];for(var di=0;di<26;di++)DB.push([Math.sin(di*12.9898)*27,Math.sin(di*78.233)*36+10,5+(di%4)*1.7]);
      var LIQ=['#55300f','#a8691a','#d99a1f','#eee3b4','#f8f3d8'];
      function bandAt(y){return y>26?0:y>12?1:y>0?2:y>-8?3:4;}
      function wpt(lx,ly){var k=cro.h/100*cro.sc,c=Math.cos(cro.rot),s2=Math.sin(cro.rot);return [cro.x+(lx*c-ly*s2)*k,cro.y+(lx*s2+ly*c)*k];}
      var JAG=[[-33,10],[-26,4],[-19,13],[-11,3],[-3,12],[5,2],[13,12],[21,4],[28,11],[33,8]];
      function stepDeb(dt){
        var d=cro.deb;if(!d)return;
        d.t+=dt;d.vy+=1500*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.rot+=d.vr*dt;
        var dd2=dep(d.x,d.y);
        if(dd2>8&&!d.w){d.w=1;wave(d.x,7,d.y);spray(d.x,d.y-SF.ny*dd2,8,.8,['#e8fff4','#bfe6d3']);}
        if(d.t>3.2||d.y>CH+120||d.y>ext.fl+90)cro.deb=null;
      }
      function drawDeb(){
        var d=cro.deb;if(!d)return;
        var k=cro.h/100,i;
        cx.save();cx.translate(d.x,d.y);cx.rotate(d.rot);cx.scale(k,k);cx.globalAlpha=clamp(1-(d.t-2)/1.2,0,1);
        cx.beginPath();cx.moveTo(-60,-70);cx.lineTo(60,-70);cx.lineTo(60,8);for(i=JAG.length-1;i>=0;i--)cx.lineTo(JAG[i][0],JAG[i][1]);cx.lineTo(-60,10);cx.closePath();
        cx.save();cx.clip();
        cx.lineJoin='round';cx.fillStyle='rgba(170,215,195,.28)';cx.fill(BODY);
        cx.fillStyle='rgba(255,255,255,.4)';cx.beginPath();cx.ellipse(-22,0,3.2,10,.12,0,6.3);cx.fill();
        cx.lineWidth=2.8;cx.strokeStyle='#14211a';cx.stroke(BODY);
        cx.restore();
        cx.beginPath();cx.moveTo(JAG[0][0],JAG[0][1]);for(i=1;i<JAG.length;i++)cx.lineTo(JAG[i][0],JAG[i][1]);cx.lineWidth=1.6;cx.strokeStyle='rgba(235,255,245,.95)';cx.stroke();
        cx.lineWidth=2.4;cx.strokeStyle='#14211a';cx.beginPath();cx.moveTo(-10,-33);cx.bezierCurveTo(-25,-38,-25,-22,-10,-24);cx.moveTo(10,-33);cx.bezierCurveTo(25,-37,25,-22,10,-24);cx.stroke();
        cx.beginPath();cx.moveTo(-6.4,-58);cx.lineTo(6.4,-58);cx.lineTo(7.4,-43);cx.lineTo(-7.4,-43);cx.closePath();cx.fillStyle='#c9985a';cx.fill();cx.lineWidth=2;cx.strokeStyle='#3b2610';cx.stroke();
        cx.restore();
      }
      /* un coup : crotte jetée (elle s'écrase, six la couvrent) ou clystère planté (six la percent et la brisent) */
      cro.hit=function(it){
        if(cro.gone||cro.sc<.8)return;
        var px,py;if(it.k){px=it.x+Math.cos(it.rot)*it.s*.5;py=it.y+Math.sin(it.rot)*it.s*.5;}else{px=it.x;py=it.y-it.s*.3;}
        var dx=px-cro.x,dy=py-cro.y,ex=cro.r*1.12,ey=cro.h*.5;
        if(dx*dx/(ex*ex)+dy*dy/(ey*ey)>1)return;
        var sp=it.held?(it.hv||0):Math.hypot(it.vx,it.vy);if(sp<300)return;
        if(it.held){it.held=false;document.documentElement.classList.remove('cro-prise');}
        it.dead=true;
        if(!cro.held){cro.vx+=clamp(it.vx||0,-900,900)*.12;cro.vy+=clamp(it.vy||0,-900,900)*.06;}
        cro.slv+=rnd(-4,4);
        var k=cro.h/100*cro.sc,c=Math.cos(cro.rot),s2=Math.sin(cro.rot),lx=(dx*c+dy*s2)/k,ly=(-dx*s2+dy*c)/k;
        if(!it.k){
          cro.dirt=Math.min(7,cro.dirt+1);
          spray(px,py,6,.55,['#6b3d17','#4b2a0e','#9a6a2c']);
        }else{
          cro.pier.push({x:lx,y:ly,a:it.rot-cro.rot,sl:it.s/k,lk:0});
          spray(px,py,6,.5,[LIQ[bandAt(ly)],'#e8fff4']);
          if(cro.pier.length>=6)casse();
        }
      };
      function casse(){
        var x=cro.x,y=cro.y,h=cro.h,i,col=['#55300f','#a8691a','#d99a1f','#eee3b4','#f8f3d8'];
        /* le fond cède : les liquides se déversent dans le fluide, qui tourne au beige foncé, et les crottes remontent à sa surface */
        pours.push({x:x,y:y+h*.4,t:0,d:2.8,c:col});
        spray(x,y+h*.35,28,1.2,['#e8fff4','#bfe6d3','#ffffff']);
        for(i=0;i<4;i++){var q=mkItem(0,x+rnd(-18,18),y+h*.3,rnd(-90,90),rnd(-40,110));q.rot=rnd(-1,1);}
        lvl=Math.min(cap(),lvl+16);wave(x,10,y+h*.4);
        cro.deb={x:x,y:y-h*.16,vx:cro.vx*.5+rnd(-50,50),vy:-140,rot:cro.rot,vr:rnd(-2.4,2.4),t:0,w:0};
        gone();
      }
      var CROUTES=[[-17,-12,3.4,.3,0],[-22,-3,2.6,-.4,0],[-13,-22,2.4,.6,0],[16,-13,3,-.2,0],[21,-5,2.4,.5,0],[12,-23,2.2,0,0],[-8,-31,2.4,.4,1],[7,-33,2.8,-.3,1],[-5,-40,2.2,.2,1],[5,-42,2.4,.1,1],[0,-27,2,0,0]];
      var BANDS=[['#55300f',38],['#a8691a',26],['#d99a1f',12],['#eee3b4',0],['#f8f3d8',-8]];
      cro.draw=function(){
        if(cro.gone){drawDeb();return;}
        var e=cro.sc,k=cro.h/100*e,t=tnow/1000,en=cro.en,amp=1+en*2.4,i,j;
        var tr=cro.mix>.3?cro.mix*cro.mix*3.2:0,bi,bq;
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
        /* la saleté, puis les clystères plantés */
        if(cro.dirt>.05){
          var nb=Math.ceil(Math.min(cro.dirt,6)/6*DB.length),bi,bq;
          cx.save();cx.clip(BODY);
          if(cro.dirt>5){cx.globalAlpha=clamp(cro.dirt-5,0,1)*.95;cx.fillStyle='#4b2a0e';cx.fillRect(-40,-50,80,110);cx.globalAlpha=1;}
          for(bi=0;bi<nb;bi++){
            bq=DB[bi];cx.beginPath();cx.ellipse(bq[0],bq[1],bq[2],bq[2]*.78,bi,0,6.3);cx.fillStyle=bi%3?'#5e3714':'#7a4a1c';cx.fill();cx.lineWidth=.9;cx.strokeStyle='#2b1707';cx.stroke();
            cx.fillStyle='rgba(190,130,60,.55)';cx.beginPath();cx.ellipse(bq[0]-bq[2]*.3,bq[1]-bq[2]*.3,bq[2]*.28,bq[2]*.2,.4,0,6.3);cx.fill();
          }
          cx.restore();
        }
        for(bi=0;bi<cro.pier.length;bi++){bq=cro.pier[bi];if(SL.clystere)SL.clystere(cx,bq.x-Math.cos(bq.a)*bq.sl*.47,bq.y-Math.sin(bq.a)*bq.sl*.47,bq.sl,bq.a);}
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
    var GRN={back:[64,196,92,.42],s0:[196,255,128,.58],s1:[120,240,112,.58],s2:[48,206,118,.6],s3:[20,160,104,.66],halo:[236,255,190,.30],lite:[226,255,170,.34],trait:[44,106,12],reflet:[244,255,217],vert:[143,214,31]};
    var BGE={back:[120,92,48,.5],s0:[178,142,86,.66],s1:[150,116,66,.68],s2:[118,88,48,.72],s3:[84,60,32,.8],halo:[255,236,190,.22],lite:[255,226,170,.3],trait:[74,52,20],reflet:[255,241,210],vert:[176,138,68]};
    var RED={back:[150,20,30,.5],s0:[226,70,56,.62],s1:[196,34,42,.66],s2:[156,18,34,.7],s3:[104,8,26,.78],halo:[255,176,150,.22],lite:[255,150,140,.3],trait:[92,10,18],reflet:[255,212,206],vert:[205,30,42]};
    function cc(k,al){
      var a=GRN[k],b=BGE[k],r=RED[k],o=[],i,v,a0;
      for(i=0;i<3;i++){v=a[i]+(b[i]-a[i])*tint;o.push(Math.round(v+(r[i]-v)*rd));}
      if(al===undefined&&a.length>3){a0=a[3]+(b[3]-a[3])*tint;a0+=(r[3]-a0)*rd;al=+a0.toFixed(3);}
      return al===undefined?'rgb('+o.join(',')+')':'rgba('+o.join(',')+','+al+')';
    }
    /* texte derrière le fluide : il passe au-dessus (voir putride.css) ; dessous, un voile sombre et doux, ligne par ligne, garde le contraste sans éteindre le fluide */
    var SEL='h1,h2,h3,h4,p,li,dt,dd,figcaption,blockquote,.kicker,.note',rg=null;
    function scan(){
      scr.length=0;if(!FP)return;
      var m=document.querySelector('main');if(!m)return;
      var top=FP.mn-10,els=m.querySelectorAll(SEL),i,j,e,b,rs,r;
      rg=rg||document.createRange();
      for(i=0;i<els.length&&scr.length<150;i++){
        e=els[i];b=e.getBoundingClientRect();
        if(b.bottom<top||b.top>ext.fl||b.width<4||b.height<4||b.right<ext.x0||b.left>ext.x1)continue;
        rg.selectNodeContents(e);rs=rg.getClientRects();
        for(j=0;j<rs.length&&scr.length<150;j++){r=rs[j];if(r.width<3||r.height<4||r.height>160||r.bottom<top||r.top>ext.fl)continue;scr.push([r.left,r.top,r.width,r.height]);}
      }
    }
    addEventListener('scroll',function(){scrDirty=true;},{passive:true});
    function drawFluid(){
      var x0=ext.x0,x1=ext.x1,fl=ext.fl,tp=ext.tp,nx=SF.nx,ny=SF.ny,tx=SF.tx,ty=SF.ty,c=SF.c,t,s,st=DX,pts=[],mn=1e9,i,L=CW+CH;
      FP=null;
      if(lvlD<.5)return;
      for(t=SF.t0;t<=SF.t1+st;t+=st){
        s=c-hAt(t)-amb(t);pts.push(t*tx+s*nx,t*ty+s*ny);
        if(t*ty+s*ny<mn)mn=t*ty+s*ny;
      }
      var n=pts.length,lx=pts[n-2]+L*nx,ly=pts[n-1]+L*ny,fx=pts[0]+L*nx,fy=pts[1]+L*ny;
      FP={pts:pts,mn:clamp(mn,tp,fl),L:L};
      cx.save();cx.beginPath();cx.rect(x0,tp,x1-x0,fl-tp);cx.clip();
      function trace(off,wob){
        cx.beginPath();cx.moveTo(pts[0]-nx*off,pts[1]-ny*off);
        for(i=2;i<n;i+=2)cx.lineTo(pts[i]-nx*(off+(wob?Math.sin(pts[i]*.03+pts[i+1]*.02-tnow/700)*2:0)),pts[i+1]-ny*(off+(wob?Math.sin(pts[i]*.03+pts[i+1]*.02-tnow/700)*2:0)));
        cx.lineTo(lx,ly);cx.lineTo(fx,fy);cx.closePath();
      }
      /* couche du fond, plus sombre, légèrement décalée */
      trace(5,true);cx.fillStyle=cc('back');cx.fill();
      /* le corps du fluide : vert de canalisation, comme le bocal de l'autel, translucide, lumineux, qui ne s'assombrit pas au fond */
      var Dm=Math.max(60,Math.max(nx*x0+ny*tp,nx*x1+ny*tp,nx*x0+ny*fl,nx*x1+ny*fl)-c);
      var g=cx.createLinearGradient(nx*c,ny*c,nx*(c+Dm),ny*(c+Dm));
      g.addColorStop(0,cc('s0'));g.addColorStop(.25,cc('s1'));g.addColorStop(.65,cc('s2'));g.addColorStop(1,cc('s3'));
      trace(0,false);cx.fillStyle=g;cx.fill();
      /* deux filets de lumière qui ondulent sous la surface, et un halo : la lumière traverse le fluide */
      cx.save();cx.clip();
      var cxm=(x0+x1)/2,cym=(tp+fl)/2,tm=cxm*tx+cym*ty,sm=c-hAt(tm),hx=tm*tx+sm*nx,hy=tm*ty+sm*ny;
      var hg=cx.createRadialGradient(hx,hy,0,hx,hy,(x1-x0)*.55);hg.addColorStop(0,cc('halo'));hg.addColorStop(1,cc('halo',0));
      cx.fillStyle=hg;cx.fillRect(x0,tp,x1-x0,fl-tp);
      /* le voile de contraste sous le texte */
      var si,sp,sr,pd=[[18,.045],[12,.055],[7,.07],[3,.095]];
      for(si=0;si<scr.length;si++){
        sr=scr[si];
        for(sp=0;sp<4;sp++){cx.fillStyle='rgba(6,0,20,'+pd[sp][1]+')';cx.fillRect(sr[0]-pd[sp][0],sr[1]-pd[sp][0]*.55,sr[2]+pd[sp][0]*2,sr[3]+pd[sp][0]*1.1);}
      }
      cx.lineWidth=2;cx.strokeStyle=cc('lite');
      for(var b=0;b<2;b++){
        var dy=24+b*46,k=0;cx.beginPath();
        for(i=0;i<n;i+=4){var w=dy+Math.sin(pts[i]*.017+pts[i+1]*.011+tnow/(900+b*300)+b*2)*5;if(!k){cx.moveTo(pts[i]+nx*w,pts[i+1]+ny*w);k=1;}else cx.lineTo(pts[i]+nx*w,pts[i+1]+ny*w);}
        cx.stroke();
      }
      cx.restore();
      /* le liséré sombre du dessin animé, puis le reflet blanc qui glisse sur la surface */
      cx.lineJoin='round';cx.lineCap='round';
      cx.beginPath();cx.moveTo(pts[0],pts[1]);for(i=2;i<n;i+=2)cx.lineTo(pts[i],pts[i+1]);
      cx.lineWidth=3;cx.strokeStyle=cc('trait');cx.stroke();
      cx.beginPath();cx.moveTo(pts[0]+nx*6,pts[1]+ny*6);for(i=2;i<n;i+=2)cx.lineTo(pts[i]+nx*6,pts[i+1]+ny*6);
      cx.save();cx.strokeStyle=cc('reflet');cx.globalAlpha=.8;cx.lineWidth=2.4;cx.setLineDash([30,16,9,34,20,28]);cx.lineDashOffset=-tnow/80;cx.stroke();cx.restore();
      cx.restore();
    }
    function drawBubs(dt){
      var i,b,d,x,y,mx=LOW?7:14;
      /* nuages de sang qui se dissolvent */
      for(i=puffs.length-1;i>=0;i--){
        b=puffs[i];b.t+=dt;if(b.t>1.4||lvlD<2){puffs.splice(i,1);continue;}
        var pr=10+b.t*26,pg=cx.createRadialGradient(b.x,b.y,0,b.x,b.y,pr);
        pg.addColorStop(0,'rgba(190,20,36,'+(.42*(1-b.t/1.4))+')');pg.addColorStop(1,'rgba(190,20,36,0)');
        cx.fillStyle=pg;cx.fillRect(b.x-pr,b.y-pr,pr*2,pr*2);
      }
      if(lvlD>10&&bubs.length<mx&&Math.random()<dt*3){
        for(i=0;i<5;i++){x=rnd(ext.x0+10,ext.x1-10);y=rnd(ext.tp,ext.fl-4);if(dep(x,y)>12){bubs.push({x:x,y:y,r:rnd(1.6,4.6),vy:rnd(18,48),ph:rnd(0,6)});break;}}
      }
      cx.lineWidth=1.3;
      for(i=bubs.length-1;i>=0;i--){
        b=bubs[i];
        /* elles remontent à contre-pesanteur */
        b.x-=SF.nx*b.vy*dt-SF.tx*Math.sin(tnow/380+b.ph)*10*dt;b.y-=SF.ny*b.vy*dt-SF.ty*Math.sin(tnow/380+b.ph)*10*dt;
        d=dep(b.x,b.y);
        if(d<3||lvlD<2){if(d<3&&d>-30&&lvlD>2)wave(b.x,-.7,b.y);bubs.splice(i,1);continue;}
        cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.3);cx.fillStyle='rgba(214,255,134,.14)';cx.fill();cx.strokeStyle='rgba(235,255,200,.75)';cx.stroke();
        cx.fillStyle='rgba(255,255,255,.85)';cx.fillRect(b.x-b.r*.45,b.y-b.r*.5,Math.max(1,b.r*.3),Math.max(1,b.r*.3));
      }
    }
    function drawDrops(dt){
      var A=1700*Math.max(.6,gm),i,d;
      cx.lineWidth=1.2;
      for(i=drops.length-1;i>=0;i--){
        d=drops[i];cx.fillStyle=d.c||cc('vert');cx.strokeStyle=d.c?'#1a0f05':cc('trait');d.vx+=gx*A*dt*.8;d.vy+=gy*A*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.l-=dt;
        if(lvlD>2&&dep(d.x,d.y)>0){
          wave(d.x,d.pour?.9:.25,d.y);if(d.pour)tintT=Math.min(1,tintT+.011);
          /* le sang se dissout dans le fluide et le rougit ; la boue y tombe en petits galets qui coulent */
          if(d.f==='b'){rT=Math.min(1,rT+.0042);if(puffs.length<26)puffs.push({x:d.x,y:d.y,t:0});}
          else if(d.f==='p'){var pb=mkItem(2,d.x,d.y,rnd(-20,20),rnd(0,30));pb.rot=rnd(0,6);pb.vr=rnd(-3,3);pb.age=0;}
          drops.splice(i,1);continue;
        }
        if(d.l<=0||d.y>ext.fl||d.x<0||d.x>CW){drops.splice(i,1);continue;}
        cx.beginPath();cx.ellipse(d.x,d.y,d.r*(1+Math.min(1,Math.hypot(d.vx,d.vy)/1500)),d.r,Math.atan2(d.vy,d.vx),0,6.3);cx.fill();cx.stroke();
      }
    }
    /* ---------- passerelle vers Éphébito (ephebito.js, chargé quand on secoue la dame-jeanne) ---------- */
    Object.defineProperties(FX,{CW:{get:function(){return CW;}},CH:{get:function(){return CH;}},t:{get:function(){return tnow;}},niv:{get:function(){return lvlD;}},tilt:{get:function(){return tilt;}},slope:{get:function(){return ang;}},cro:{get:function(){return cro;}},off:{get:function(){return 0;}}});
    FX.rnd=rnd;FX.clamp=clamp;FX.isM=isM;FX.SL=SL;FX.CO=CO;FX.cx=cxO;FX.ext=ext;FX.items=items;FX.drops=drops;FX.bubs=bubs;FX.LOW=LOW;
    FX.surfAt=surfAt;FX.vsurf=vsurf;FX.dep=dep;FX.wave=wave;FX.spray=spray;FX.red=function(a){rT=Math.min(1,rT+a);};FX.mk=mkItem;FX.drawItem=drawItem;FX.parle=parle;FX.ferme=ferme;
    FX.bulle=function(){return bulle;};FX.lvlAdd=function(n){lvl=Math.min(cap(),lvl+n);};
    FX.bord=hdrBottom;
    var plugT=0;
    FX.pret=function(){return !!(window.Ephebito&&window.Ephebito.ok());};
    FX.pre=function(){
      if(plugT)return;plugT=1;
      var sc=document.createElement('script');sc.src='/ephebito.js?v=6';
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
        /* la pesanteur du fluide suit celle du téléphone avec un ressort : il déborde, clapote, puis se cale */
        var tgA=sens?Math.atan2(gx,gy)*clamp(gm*1.6,0,1):0,dA=tgA-ang;
        while(dA>Math.PI)dA-=6.2832;while(dA<-Math.PI)dA+=6.2832;
        angv+=(dA*30-angv*3.2)*dt;ang+=angv*dt;if(ang>Math.PI)ang-=6.2832;else if(ang<-Math.PI)ang+=6.2832;
        /* vidange : au changement de page, le niveau baisse, les objets s'en vont */
        if(vidFin){var reste=clamp((vidFin-last)/1000,0,VIDANGE);lvl=lvlVid*reste/VIDANGE;if(!reste){vidFin=0;lvl=0;items.length=0;tintT=0;rT=0;}}
        lvl=Math.min(lvl,cap());
        lvlD+=(lvl-lvlD)*Math.min(1,dt*2.6);if(lvlD<.05&&lvl===0)lvlD=0;
        tint+=(tintT-tint)*Math.min(1,dt*.7);
        rT=Math.max(0,rT-dt*.0035);rd+=(rT-rd)*Math.min(1,dt*.9);
        solve();
        if(lvlD>2&&Math.abs(angv)>.7&&Math.random()<dt*16)waveT(rnd(SF.t0,SF.t1),clamp(angv*2.2,-6,6));
        var ns=clamp(Math.round(dt*60),1,3),k,i;
        for(k=0;k<ns;k++){
          stepW(1/60);
          for(i=items.length-1;i>=0;i--){var it=items[i];stepItem(it,1/60);if(it.usr&&!it.dead&&!it.out&&cro&&!cro.gone)cro.hit(it);if(it.dead)items.splice(i,1);}
          /* ce qui se déverse de la dame-jeanne brisée */
          for(i=pours.length-1;i>=0;i--){
            var pq=pours[i];pq.t+=1/60;
            if(drops.length<120)drops.push({x:pq.x+rnd(-12,12),y:pq.y+rnd(0,8),vx:rnd(-30,30),vy:rnd(40,170),r:rnd(1.8,3.6),l:3,c:pq.c[(Math.random()*pq.c.length)|0],pour:true});
            if(pq.t>pq.d)pours.splice(i,1);
          }
          if(cro)cro.step(1/60);if(FX.eph)FX.eph.step(1/60);
        }
        work=lvlD>.5||drops.length>0||items.length>0||pours.length>0||(cro&&(!cro.gone||cro.deb))||(FX.eph&&FX.eph.on);
        cxF.clearRect(0,0,CW,CH);cxO.clearRect(0,0,CW,CH);
        if(work){
          if(FP&&(scrDirty||last-scrT>450)){scan();scrDirty=false;scrT=last;}
          cx=cxF;drawFluid();drawBubs(dt);
          if(!FP)scr.length=0;
          document.documentElement.classList.toggle('fl',!!FP);
          cx=cxO;
          for(i=0;i<items.length;i++)if(!items[i].held)drawItem(items[i]);
          if(FX.eph)FX.eph.draw();
          if(cro&&!cro.held)cro.draw();
          drawDrops(dt);
          for(i=0;i<items.length;i++)if(items[i].held)drawItem(items[i]);
          if(cro&&cro.held)cro.draw();
          if(FX.eph)FX.eph.top();
          /* ce qui est sous la surface se teinte de la couleur du fluide */
          if(FP){
            var pt=FP.pts,pn=pt.length,pj,L2=FP.L;
            cx.save();cx.beginPath();cx.rect(ext.x0,ext.tp,ext.x1-ext.x0,ext.fl-ext.tp);cx.clip();
            cx.beginPath();cx.moveTo(pt[0],pt[1]);for(pj=2;pj<pn;pj+=2)cx.lineTo(pt[pj],pt[pj+1]);
            cx.lineTo(pt[pn-2]+L2*SF.nx,pt[pn-1]+L2*SF.ny);cx.lineTo(pt[0]+L2*SF.nx,pt[1]+L2*SF.ny);cx.closePath();cx.clip();
            cx.globalCompositeOperation='source-atop';cx.fillStyle=cc('s2',.44);cx.fillRect(ext.x0,ext.tp,ext.x1-ext.x0,ext.fl-ext.tp);cx.restore();
          }
          placeItems();
          if(FX.eph)FX.eph.place();
          if(cro)cro.place();
          placeBulle();
        }else document.documentElement.classList.remove('fl');
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
