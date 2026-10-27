(function(){
  /* Pages d'album : lecture et paroles */
  var CLIPS={'Chimaera Rothomagensis':'A_SfjREwRWI','La côte Sainte-Catherine':'bThq8uPYgFA','La Chute':'34-C5ls5eWM','Dis, ferme un instant les yeux':'65E0wA7msv4','Jubilé':'btnbqG0_kc0'};
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
    if(t.matches('.trp'))LCMPlayer.play(cfg(s,+t.dataset.i,t.querySelector('span').textContent));
    else LCMPlayer.play(cfg(s,0));
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
    if(window.LCM_G)go();else loadScript('putride-genius.js').then(go);
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
    window.openLB([{src:a.getAttribute('href'),alt:a.dataset.lb}],0);
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
    if(!/^mode-putride[^#?]*\.html$/.test(h)||busy)return;
    ev.preventDefault();busy=true;
    swap(h,true).catch(function(){location.href=h;}).then(function(){busy=false;});
  });
  window.addEventListener('popstate',function(){
    var p=location.pathname.split('/').pop();
    if(/^mode-putride.*\.html$/.test(p))swap(p,false).catch(function(){location.reload();});
    else location.reload();
  });

  /* Gouttes de slime accrochées aux bords verts */
  (function(){
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    var rnd=function(a,b){return a+Math.random()*(b-a);};
    var layer=document.createElement('div');layer.id='drips';layer.setAttribute('aria-hidden','true');
    document.body.appendChild(layer);
    var lvl=0,pool=null,dl=0,tilt=0,tiltT=0,tv=0;
    var isM=function(){return innerWidth<900;};
    var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
    var inc=function(w){return w*w*.035*(isM()?2.2:1);};
    var mainBox=function(){var m=document.querySelector('main');return m&&m.getBoundingClientRect();};
    var cap=function(){var m=document.querySelector('main');return Math.min(innerHeight*(isM()?.14:.11),m?m.offsetHeight*.5:1e9);};
    /* mobile : le fluide s'accumule en bas de l'ecran visible, limite par le bas du texte, et suit l'inclinaison du telephone */
    var mp=document.createElement('div');mp.id='mpool';mp.setAttribute('aria-hidden','true');document.body.appendChild(mp);
    var bOff=function(){var m=mainBox();return m?Math.max(0,innerHeight-m.bottom):0;};
    var amp=function(){return 18*Math.min(1,dl/30);};
    var vsurf=function(x){return innerHeight-bOff()-lvl+tilt*amp()*(1-2*x/innerWidth);};
    var onOri=function(ev){
      if(ev.gamma==null&&ev.beta==null)return;
      var a=(screen.orientation&&screen.orientation.angle)||0,g=ev.gamma||0,b=ev.beta||0;
      var v=a===90?b:(a===270||a===-90)?-b:a===180?-g:g;
      tiltT=clamp(v/35,-1,1);
    };
    if(window.DeviceOrientationEvent){
      if(typeof DeviceOrientationEvent.requestPermission==='function'){
        var ask=function(){DeviceOrientationEvent.requestPermission().then(function(s){if(s==='granted')addEventListener('deviceorientation',onOri);}).catch(function(){});};
        document.addEventListener('touchend',ask,{once:true});
      }else addEventListener('deviceorientation',onOri);
    }
    (function frame(){
      if(isM()&&!document.hidden){
        tv+=(tiltT-tilt)*.05;tv*=.9;tilt+=tv;
        dl+=(lvl-dl)*.06;
        var s=tilt*amp();
        mp.style.cssText='bottom:'+(bOff()-20)+'px;height:'+(dl+40)+'px;opacity:'+(dl>1?1:0)+';clip-path:polygon(0 '+(20+s).toFixed(1)+'px,100% '+(20-s).toFixed(1)+'px,100% 100%,0 100%)';
      }else if(mp.style.opacity!=='0')mp.style.opacity='0';
      requestAnimationFrame(frame);
    })();
    var show=function(){
      var m=document.querySelector('main');if(!m)return;
      if(!pool||pool.parentNode!==m){pool=document.createElement('div');pool.className='dpool';pool.setAttribute('aria-hidden','true');m.appendChild(pool);}
      pool.style.height=lvl+'px';pool.style.opacity=lvl>1?1:0;
    };
    /* chaque nouvelle page repart d'un sol propre */
    document.addEventListener('putride:page',function(){lvl=0;dl=0;pool=null;layer.textContent='';show();});
    show();
    function sources(){
      var r=[],m=mainBox();if(!m)return r;
      var a=Math.max(m.left,0)+10,b=Math.min(m.right,innerWidth-16)-10,floor=isM()?innerHeight-bOff()-lvl:m.bottom-lvl;
      var h=document.querySelector('header');
      if(h)r.push({y:h.getBoundingClientRect().bottom-3,a:a,b:b});
      var n=document.querySelector('nav');
      if(n&&innerWidth<900)r.push({y:n.getBoundingClientRect().bottom-3,a:a,b:b});
      Array.prototype.forEach.call(document.querySelectorAll('main h2'),function(e){var q=e.getBoundingClientRect();if(q.bottom>180&&q.bottom<Math.min(innerHeight,floor)-120)r.push({y:q.bottom-2,a:q.left+10,b:Math.min(q.right,q.left+400)});});
      return r;
    }
    function splash(x,y,w){
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
      if(!S.length||document.hidden)return;
      var s=S[(Math.random()*S.length)|0],x=rnd(s.a,s.b),w=rnd(5,9),y0=s.y,k=rnd(2.2,3.2);
      var d=document.createElement('i');d.className='dd';
      d.style.cssText='left:'+(x-w/2)+'px;top:'+y0+'px;width:'+w+'px;height:'+w+'px';
      layer.appendChild(d);
      d.animate([{transform:'scale(.2)'},{transform:'scale(1)',offset:.3},{transform:'scale(.85,'+k+')'}],{duration:rnd(2000,3400),easing:'ease-in',fill:'forwards'}).finished.then(function(){
        var mb=mainBox();if(!mb){d.remove();return;}
        var mob=isM(),floor=mob?vsurf(x):mb.bottom-lvl,seen=floor<innerHeight,dist=Math.min(floor,innerHeight+30)-y0-w*k;
        if(dist<20){d.remove();return;}
        var dx=mob?clamp(tilt*dist*.5,-innerWidth*.45,innerWidth*.45):0,x2=clamp(x+dx,6,innerWidth-6);dx=x2-x;
        var rot=mob?' rotate('+(-Math.atan2(dx,dist)*57.3).toFixed(1)+'deg)':'';
        var bead=document.createElement('i');bead.className='dd';bead.style.cssText='left:'+(x-w*.3)+'px;top:'+(y0-1)+'px;width:'+w*.6+'px;height:'+w*.45+'px';
        layer.appendChild(bead);
        bead.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.4)',opacity:0}],{duration:900}).finished.then(function(){bead.remove();});
        d.animate([{transform:'translateY(0) scale(.85,'+k+')'},{transform:'translate('+dx+'px,'+dist+'px)'+rot+' scale(.75,'+k*1.3+')'}],{duration:Math.sqrt(dist/innerHeight)*850+180,easing:'cubic-bezier(.55,0,.9,.55)',fill:'forwards'}).finished.then(function(){
          var nb=mainBox();
          if(nb&&seen){splash(x2,mob?vsurf(x2):nb.bottom-lvl,w);}else{lvl=Math.min(cap(),lvl+inc(w));show();}
          d.remove();
        });
      }).catch(function(){d.remove();});
    }
    (function tick(){drop();setTimeout(tick,isM()?rnd(1500,3800):rnd(3200,7500));})();
  })();

  /* Recherche : uniquement dans les pages du mode putride */
  var PAGES=['mode-putride.html','mode-putride-territoire.html','mode-putride-bestiaire.html','mode-putride-discographie.html','mode-putride-ustensiles.html','mode-putride-mefaits.html','mode-putride-archives.html','mode-putride-in-odium-fidei.html','mode-putride-album-ces-beau-cela.html','mode-putride-album-chyren.html','mode-putride-album-confiteor.html','mode-putride-album-connasse.html','mode-putride-album-jarrive-en-tesla.html','mode-putride-album-le-retour-de-la-couche.html','mode-putride-album-les-gamins-jleur-mets-la-puree.html','mode-putride-album-lincontinence.html','mode-putride-album-machines.html','mode-putride-album-mais-si-quest-vrai.html','mode-putride-album-mauvaises-nouvelles-des-enfers-1.html','mode-putride-album-mauvaises-nouvelles-des-enfers-2.html','mode-putride-album-mets-la-cam.html','mode-putride-album-oh-non-herve.html','mode-putride-album-oh-non-je-fais-appel.html','mode-putride-album-omerta434.html','mode-putride-album-palestine-gratuit.html','mode-putride-album-peter-sur-la-friture.html','mode-putride-album-putain-de-sa-race.html','mode-putride-album-rien-a-declarer.html','mode-putride-personnage-createur.html','mode-putride-personnage-edwarda.html','mode-putride-personnage-ephebus.html','mode-putride-personnage-ephebelle.html','mode-putride-personnage-ephebito.html','mode-putride-personnage-ver.html'];
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
})();
