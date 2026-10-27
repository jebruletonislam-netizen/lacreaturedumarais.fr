(function(){
  /* Accordéon des albums */
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('.alb');
    if(!b)return;
    var p=b.parentNode.querySelector('.apanel');
    if(!p)return;
    var open=p.hidden;p.hidden=!open;
    b.setAttribute('aria-expanded',open);
    b.parentNode.classList.toggle('open',open);
  });

  /* Lecteur SoundCloud persistant */
  var pb=null,wg=null,cur=null,apiState=0,apiQ=[],dur=0,pos=0,fbT=null;
  var IC={
    play:'<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><path d="M6 4.5h4.4v15H6zM13.6 4.5H18v15h-4.4z"/></svg>',
    prev:'<svg viewBox="0 0 24 24"><path d="M6 5h2.4v14H6zM19 5v14L9.5 12z"/></svg>',
    next:'<svg viewBox="0 0 24 24"><path d="M15.6 5H18v14h-2.4zM5 5l9.5 7L5 19z"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
  function withApi(cb){
    if(window.SC&&window.SC.Widget)return cb();
    apiQ.push(cb);
    if(apiState)return;
    apiState=1;
    var s=document.createElement('script');
    s.src='https://w.soundcloud.com/player/api.js';
    s.onload=function(){apiQ.splice(0).forEach(function(f){f();});};
    document.head.appendChild(s);
  }
  function mark(){
    Array.prototype.forEach.call(document.querySelectorAll('.al'),function(li){
      var p=li.querySelector('.play');
      li.classList.toggle('playing',!!(p&&cur&&p.dataset.sc===cur));
    });
  }
  function fmt(ms){var s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+('0'+s%60).slice(-2);}
  function q(sel){return pb&&pb.querySelector(sel);}
  function setPP(on){
    if(!pb)return;
    var b=q('.pp');b.innerHTML=on?IC.pause:IC.play;b.setAttribute('aria-label',on?'Pause':'Lecture');
    pb.classList.toggle('on',on);
  }
  function setProg(rel){
    if(!pb)return;
    rel=clampP(rel);
    q('.pb-fill').style.width=(rel*100)+'%';
    q('.pb-bar').setAttribute('aria-valuenow',Math.round(rel*100));
    q('.pb-cur').textContent=fmt(pos);
    q('.pb-dur').textContent=dur?fmt(dur):'0:00';
  }
  function clampP(v){return v<0?0:v>1?1:v;}
  function info(album){
    if(!wg||!pb)return;
    wg.getCurrentSound(function(s){
      if(!s||!pb)return;
      wg.getSounds(function(a){
        wg.getCurrentSoundIndex(function(i){
          if(!pb)return;
          var n=a&&a.length>1?(i+1)+' / '+a.length+'  ·  ':'';
          q('.pb-tr').textContent=n+s.title;
          dur=s.duration||dur;setProg(dur?pos/dur:0);
        });
      });
    });
  }
  function mkbar(){
    if(pb)return;
    pb=document.createElement('div');pb.id='pbar';pb.setAttribute('role','region');pb.setAttribute('aria-label','Lecteur de la fosse');
    pb.innerHTML='<div class="pb-drip" aria-hidden="true"></div>'
      +'<div class="pb-main">'
      +'<img class="pb-art" alt="" width="56" height="56">'
      +'<div class="pb-info"><b class="pb-al"></b><span class="pb-tr">Chargement…</span></div>'
      +'<div class="pb-ctl"><button class="pb-b" type="button" data-a="prev" aria-label="Titre précédent">'+IC.prev+'</button>'
      +'<button class="pb-b pp" type="button" data-a="toggle" aria-label="Lecture">'+IC.play+'</button>'
      +'<button class="pb-b" type="button" data-a="next" aria-label="Titre suivant">'+IC.next+'</button></div>'
      +'<div class="pb-prog"><span class="pb-cur">0:00</span><div class="pb-bar" role="slider" tabindex="0" aria-label="Position dans le titre" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="pb-fill"></i></div><span class="pb-dur">0:00</span></div>'
      +'<div class="pb-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'
      +'<div class="pb-end"><button class="pb-b sm" type="button" data-a="list" aria-label="Afficher la liste des titres" aria-expanded="false">'+IC.list+'</button>'
      +'<button class="pb-b sm" type="button" data-a="close" aria-label="Fermer le lecteur">'+IC.close+'</button></div>'
      +'</div><div class="pb-f"></div>';
    document.body.appendChild(pb);
    document.body.classList.add('has-pbar');
    if(window.ResizeObserver)new ResizeObserver(function(){if(pb)document.body.style.paddingBottom=pb.offsetHeight+'px';}).observe(pb);
    pb.addEventListener('click',function(ev){
      var b=ev.target.closest('[data-a]');
      if(b){
        var a=b.dataset.a;
        if(a==='close'){pb.remove();pb=null;wg=null;cur=null;dur=pos=0;document.body.classList.remove('has-pbar');document.body.style.paddingBottom='';mark();return;}
        if(a==='list'){var o=pb.classList.toggle('open');b.setAttribute('aria-expanded',o);return;}
        if(wg)wg[a]();
        return;
      }
      var bar=ev.target.closest('.pb-bar');
      if(bar&&wg&&dur){var r=bar.getBoundingClientRect();pos=clampP((ev.clientX-r.left)/r.width)*dur;wg.seekTo(pos);setProg(pos/dur);}
    });
    pb.addEventListener('keydown',function(ev){
      if(!ev.target.classList.contains('pb-bar')||!wg||!dur)return;
      var d=ev.key==='ArrowRight'?5000:ev.key==='ArrowLeft'?-5000:0;
      if(!d)return;
      ev.preventDefault();pos=Math.max(0,Math.min(dur,pos+d));wg.seekTo(pos);setProg(pos/dur);
    });
  }
  function playSC(url,h,title,art){
    mkbar();
    var box=q('.pb-f'),f=box.querySelector('iframe');
    if(f&&cur===url){if(wg)wg.toggle();return;}
    cur=url;wg=null;dur=pos=0;
    if(f)f.remove();
    f=document.createElement('iframe');
    f.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(url)+'&color=%2339ff6e&auto_play=true&show_teaser=false';
    f.height=h;f.allow='autoplay';f.title='Liste des titres SoundCloud';
    box.appendChild(f);
    var im=q('.pb-art');if(art){im.src=art;im.hidden=false;}else im.hidden=true;
    q('.pb-al').textContent=title||'';q('.pb-tr').textContent='Chargement…';
    setPP(true);setProg(0);mark();
    clearTimeout(fbT);
    fbT=setTimeout(function(){if(pb&&!wg)pb.classList.add('open');},6000);
    withApi(function(){
      if(!pb||f.parentNode!==box)return;
      wg=SC.Widget(f);
      var E=SC.Widget.Events;
      wg.bind(E.READY,function(){info(title);});
      wg.bind(E.PLAY,function(){setPP(true);info(title);});
      wg.bind(E.PAUSE,function(){setPP(false);});
      wg.bind(E.FINISH,function(){setPP(false);});
      wg.bind(E.PLAY_PROGRESS,function(e){pos=e.currentPosition;if(!dur&&e.relativePosition)dur=pos/e.relativePosition;setProg(e.relativePosition);});
    });
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest&&ev.target.closest('.play');
    if(!b)return;
    ev.preventDefault();
    var im=b.closest('.al')&&b.closest('.al').querySelector('.alb>img');
    playSC(b.dataset.sc,b.dataset.h,b.dataset.t,im&&im.getAttribute('src'));
  });

  /* Modale vidéo YouTube */
  function closeVid(){var m=document.getElementById('vmodal');if(m)m.remove();document.removeEventListener('keydown',escVid);}
  function escVid(ev){if(ev.key==='Escape')closeVid();}
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('[data-yt]');
    if(a){
      ev.preventDefault();closeVid();
      if(wg)wg.pause();
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
    window.openLB([{src:a.getAttribute('href'),alt:a.dataset.lb}],0);
  });

  /* Éveil d'Éphébus */
  function tog(e){var on=e.classList.toggle('on');e.setAttribute('aria-pressed',on);}
  document.addEventListener('pointerdown',function(ev){
    var e=ev.target.closest&&ev.target.closest('#eph');
    if(e&&ev.pointerType!=='mouse')tog(e);
  });
  document.addEventListener('keydown',function(ev){
    var e=ev.target.closest&&ev.target.closest('#eph');
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
        inl.forEach(function(s){var x=document.createElement('script');x.textContent=s.textContent;document.body.appendChild(x);x.remove();});
        mark();
      });
    });
  }
  document.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey)return;
    var a=ev.target.closest&&ev.target.closest('a[href]');
    if(!a||a.target||a.hasAttribute('data-lb')||a.hasAttribute('download'))return;
    var h=a.getAttribute('href');
    if(!/^brouillon-[^#?]*\.html$/.test(h)||busy)return;
    ev.preventDefault();busy=true;
    swap(h,true).catch(function(){location.href=h;}).then(function(){busy=false;});
  });
  window.addEventListener('popstate',function(){
    var p=location.pathname.split('/').pop();
    if(/^brouillon-.*\.html$/.test(p))swap(p,false).catch(function(){location.reload();});
    else location.reload();
  });

  /* Gouttes de slime accrochées aux bords verts */
  (function(){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    var rnd=function(a,b){return a+Math.random()*(b-a);};
    var layer=document.createElement('div');layer.id='drips';layer.setAttribute('aria-hidden','true');
    var pool=document.createElement('div');pool.className='dpool';
    layer.appendChild(pool);document.body.appendChild(layer);
    var lvl=0;try{lvl=+sessionStorage.getItem('lcm-pool')||0;}catch(e){}
    var cap=function(){return innerHeight*(innerWidth<900?.08:.11);};
    var show=function(){pool.style.height=lvl+'px';pool.style.opacity=lvl>1?1:0;try{sessionStorage.setItem('lcm-pool',lvl);}catch(e){}};
    show();
    function sources(){
      var r=[],h=document.querySelector('header');
      if(h)r.push({y:h.getBoundingClientRect().bottom-3,a:0,b:innerWidth});
      var n=document.querySelector('nav');
      if(n){
        if(innerWidth<900)r.push({y:n.getBoundingClientRect().bottom-3,a:0,b:innerWidth});
        else Array.prototype.forEach.call(n.querySelectorAll('a'),function(a){var q=a.getBoundingClientRect();if(q.bottom>0&&q.bottom<innerHeight-80)r.push({y:q.bottom-3,a:q.left+12,b:q.right-12});});
      }
      Array.prototype.forEach.call(document.querySelectorAll('main h2'),function(e){var q=e.getBoundingClientRect();if(q.bottom>180&&q.bottom<innerHeight-120)r.push({y:q.bottom-2,a:q.left+10,b:Math.min(q.right,q.left+400)});});
      return r;
    }
    function splash(x,y,w){
      var add=function(cls,css){var e=document.createElement('i');e.className=cls;e.style.cssText=css;layer.appendChild(e);return e;};
      lvl=Math.min(cap(),lvl+w*w*.035);show();
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
      if(!S.length||document.hidden)return;
      var s=S[(Math.random()*S.length)|0],x=rnd(s.a,s.b),w=rnd(5,9),y0=s.y,k=rnd(2.2,3.2);
      var d=document.createElement('i');d.className='dd';
      d.style.cssText='left:'+(x-w/2)+'px;top:'+y0+'px;width:'+w+'px;height:'+w+'px';
      layer.appendChild(d);
      d.animate([{transform:'scale(.2)'},{transform:'scale(1)',offset:.3},{transform:'scale(.85,'+k+')'}],{duration:rnd(2000,3400),easing:'ease-in',fill:'forwards'}).finished.then(function(){
        var floor=innerHeight-lvl,dist=floor-y0-w*k;
        if(dist<20){d.remove();return;}
        var bead=document.createElement('i');bead.className='dd';bead.style.cssText='left:'+(x-w*.3)+'px;top:'+(y0-1)+'px;width:'+w*.6+'px;height:'+w*.45+'px';
        layer.appendChild(bead);
        bead.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.4)',opacity:0}],{duration:900}).finished.then(function(){bead.remove();});
        d.animate([{transform:'translateY(0) scale(.85,'+k+')'},{transform:'translateY('+dist+'px) scale(.75,'+k*1.3+')'}],{duration:Math.sqrt(dist/innerHeight)*850+180,easing:'cubic-bezier(.55,0,.9,.55)',fill:'forwards'}).finished.then(function(){splash(x,floor,w);d.remove();});
      }).catch(function(){d.remove();});
    }
    (function tick(){drop();setTimeout(tick,rnd(3200,7500));})();
  })();

})();
