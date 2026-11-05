/* Les cachots : le fond vivant. Fumées, reflets, chauves-souris, paillettes, reliques cachées, petits secrets. */
(function(){
  'use strict';
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var NS='http://www.w3.org/2000/svg',KEY='lcm-reliques',TOTAL=9;
  var body=document.body;
  var rnd=function(a,b){return a+Math.random()*(b-a);};
  function div(c,p){var d=document.createElement('div');d.className=c;(p||body).appendChild(d);return d;}

  /* ---------- le petit mot qui apparaît en bas de l'écran ---------- */
  var toast=null,tt=0;
  function dire(t,ms){
    if(!toast){toast=div('cr-toast');toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');}
    toast.textContent=t;toast.classList.add('on');
    clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on');},ms||5200);
  }
  window.crDire=dire;

  /* ---------- paillettes : une étoile à quatre branches, blanche, dorée ou rouge ---------- */
  var COUL=['#fff','#fff','#ffe58a','#ffcc00','#e10019'],live=0;
  function paillette(x,y,gros){
    if(calm||live>46)return;
    var p=document.createElement('i');p.className='paillette';live++;
    p.style.setProperty('--x',x.toFixed(0)+'px');p.style.setProperty('--y',y.toFixed(0)+'px');
    p.style.setProperty('--s',(gros?rnd(10,22):rnd(6,13)).toFixed(0)+'px');
    p.style.setProperty('--c',COUL[(Math.random()*COUL.length)|0]);
    p.style.setProperty('--dx',rnd(-26,26).toFixed(0)+'px');p.style.setProperty('--dy',rnd(10,44).toFixed(0)+'px');
    p.addEventListener('animationend',function(){p.remove();live--;});
    body.appendChild(p);
  }
  function gerbe(x,y,n){for(var i=0;i<n;i++)paillette(x+rnd(-60,60),y+rnd(-50,50),true);}
  window.crGerbe=gerbe;
  if(fine&&!calm){
    var last=0;
    addEventListener('pointermove',function(e){
      var now=performance.now();
      if(now-last<70)return;last=now;
      if(Math.random()<.55)paillette(e.clientX+rnd(-6,6),e.clientY+rnd(-6,6),false);
    },{passive:true});
  }
  /* confettis : le sac qui a sauté, un grand jour */
  function confettis(n){
    if(calm)return;
    var C=['#fff','#ffcc00','#e10019','#bdbdbd','#fff'];
    for(var i=0;i<n;i++){
      var c=document.createElement('i');c.className='cr-conf';
      c.style.left=rnd(0,100).toFixed(1)+'%';c.style.setProperty('--c',C[(Math.random()*C.length)|0]);
      c.style.setProperty('--dx',rnd(-12,12).toFixed(0)+'vw');c.style.setProperty('--r',rnd(360,1100).toFixed(0)+'deg');
      c.style.setProperty('--d',rnd(2.6,4.6).toFixed(1)+'s');c.style.animationDelay=rnd(0,.9).toFixed(2)+'s';
      c.addEventListener('animationend',function(){this.remove();});
      body.appendChild(c);
    }
  }
  window.crConfettis=confettis;

  if(!calm){
    /* ---------- fumées qui montent du sol, reflets d'une boule à facettes qui tourne ---------- */
    var fu=div('cr-fumee');fu.setAttribute('aria-hidden','true');for(var i=0;i<3;i++)fu.appendChild(document.createElement('i'));
    var di=div('cr-disco');di.setAttribute('aria-hidden','true');
    for(i=0;i<(fine?16:8);i++){
      var s=document.createElement('i');s.style.left=rnd(6,92).toFixed(0)+'%';s.style.top=rnd(6,92).toFixed(0)+'%';
      s.style.setProperty('--s',rnd(3,9).toFixed(1)+'rem');s.style.setProperty('--d',rnd(4,9).toFixed(1)+'s');s.style.animationDelay='-'+rnd(0,8).toFixed(1)+'s';
      di.appendChild(s);
    }

    /* ---------- une chauve-souris traverse la salle de temps en temps ---------- */
    var BAT='M0-3C2-6 4-5 5-2C9-6 15-8 20-4C17-3 16 0 15 3C13 1 11 1 9 3C8 1 6 2 5 4L3 3C2 6 1 8 0 10C-1 8-2 6-3 3L-5 4C-6 2-8 1-9 3C-11 1-13 1-15 3C-16 0-17-3-20-4C-15-8-9-6-5-2C-4-5-2-6 0-3Z';
    var bat=function(){
      if(document.hidden){setTimeout(bat,8000);return;}
      var b=div('cr-chauve'+(Math.random()<.5?' g':''));b.setAttribute('aria-hidden','true');
      b.style.setProperty('--y',rnd(8,46).toFixed(0)+'vh');b.style.setProperty('--d',rnd(8,13).toFixed(1)+'s');
      b.innerHTML='<span class="v"><svg viewBox="-22 -10 44 22"><path d="'+BAT+'" fill="#000" stroke="#d9d9d9" stroke-width=".7"/><circle cx="-1.6" cy="-1.4" r=".75" fill="#e10019"/><circle cx="1.6" cy="-1.4" r=".75" fill="#e10019"/></svg></span>';
      b.addEventListener('animationend',function(){b.remove();});
      setTimeout(bat,rnd(22000,48000));
    };
    setTimeout(bat,7000);
  }

  /* ---------- l'araignée : suspendue à sa toile, qu'on peut saisir pour la tirer n'importe où ; elle dit les tweets et les phrases de cachot-paroles.js, dans des bulles vampiriques ---------- */
  var arc0=document.querySelector('.cr-araignee'),hd=document.querySelector('header');
  var ar=null,arc=null;
  if(arc0){
    arc0.remove();
    var TOILE='<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M50 50L50 2M50 50L84 16M50 50L98 50M50 50L84 84M50 50L50 98M50 50L16 84M50 50L2 50M50 50L16 16"/><path d="M50 36L61 39L64 50L61 61L50 64L39 61L36 50L39 39Z"/><path d="M50 22L69 28L78 50L69 72L50 78L31 72L22 50L31 28Z" opacity=".85"/><path d="M50 9L77 17L91 50L77 83L50 91L23 83L9 50L23 17Z" opacity=".65"/></g><circle cx="50" cy="50" r="3.2" fill="#e10019" stroke="#fff" stroke-width=".8"/></svg>';
    var ARAIGNEE='<svg viewBox="0 0 40 44" aria-hidden="true" focusable="false"><g class="ar-p" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 25Q9 15 3 23"/><path d="M20 26Q8 24 2 32"/><path d="M20 27Q9 33 6 42"/><path d="M20 28Q13 35 12 43"/><path d="M20 25Q31 15 37 23"/><path d="M20 26Q32 24 38 32"/><path d="M20 27Q31 33 34 42"/><path d="M20 28Q27 35 28 43"/></g><ellipse cx="20" cy="13" rx="8" ry="10.5" fill="#050505" stroke="#fff" stroke-width="1"/><path d="M20 6L25 13L20 20L15 13Z" fill="#e10019"/><path d="M17 9.5L23 9.5L20 13L23 16.5L17 16.5L20 13Z" fill="#050505"/><circle cx="20" cy="27" r="5.4" fill="#0b0b0b" stroke="#fff" stroke-width="1"/><circle cx="17.6" cy="25.8" r="1" fill="#e10019"/><circle cx="22.4" cy="25.8" r="1" fill="#e10019"/><circle cx="19" cy="23.6" r=".6" fill="#ff5a6e"/><circle cx="21" cy="23.6" r=".6" fill="#ff5a6e"/><path d="M18.3 30.4L19 33.6L19.7 30.4M20.3 30.4L21 33.6L21.7 30.4" fill="#fff" stroke="#fff" stroke-width=".6" stroke-linejoin="round"/></svg>';
    arc=document.createElement('div');arc.className='ar-couche';
    arc.innerHTML='<svg class="ar-svg" aria-hidden="true"><path class="ar-etire" d="M0 0"/><path class="ar-etire" d="M0 0"/><path class="ar-etire" d="M0 0"/><path class="ar-fil" d="M0 0"/></svg><button class="ar-corde" type="button" aria-label="Les fils tendus : saisissez-les pour tirer la toile où vous voulez"></button><button class="ar-toile" type="button" aria-label="La toile : saisissez-la pour déplacer l’araignée n’importe où sur l’écran">'+TOILE+'</button><button class="corps-a" type="button" aria-label="Toucher l’araignée : elle parle">'+ARAIGNEE+'</button>';
    body.appendChild(arc);
    ar=arc.querySelector('.corps-a');
  }
  if(ar){
    var tl=arc.querySelector('.ar-toile'),corde=arc.querySelector('.ar-corde'),fil=arc.querySelector('.ar-fil'),fils=arc.querySelectorAll('.ar-etire'),He=null;
    /* le son : un petit « tchoing » d'élastique au lâcher de la toile, discret, synthétisé à la volée */
    var AC=null;
    var audio=function(){try{if(!AC){var AX=window.AudioContext||window.webkitAudioContext;if(!AX)return;AC=new AX();}if(AC.state==='suspended')AC.resume();}catch(_){}};
    var twang=function(f,a,d){
      var c=AC;if(!c||c.state!=='running'||document.hidden)return;
      try{
        var t=c.currentTime,o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();
        o.type='triangle';o2.type='sine';o.frequency.setValueAtTime(f*1.35,t);o.frequency.exponentialRampToValueAtTime(f,t+.05);o2.frequency.setValueAtTime(f*2.01,t);
        lp.type='lowpass';lp.frequency.value=2600;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(a,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);
        o.connect(g);o2.connect(g);g.connect(lp);lp.connect(c.destination);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05);
      }catch(_){}
    };
    var PA=window.CR_PAROLES||{},pool=[],sac=[],bulle=null,traine=[],tb=0,tc=0,last=-1,PROFIL='https://x.com/TancredeCharon';
    (PA.tweets||[]).forEach(function(x){if(x&&(x.t||typeof x==='string'))pool.push({t:x.t||x,u:x.u||PROFIL,d:x.d||'',k:'tweet'});});
    (PA.phrases||[]).forEach(function(x){if(x)pool.push({t:x,u:'',d:'',k:'phrase'});});
    var tire=function(){
      if(!pool.length)return {t:'Elle a tout entendu, mais personne ne lui a encore soufflé ce qu’il faut dire.',u:'',d:'',k:'vide'};
      if(!sac.length){for(var i=0;i<pool.length;i++)if(i!==last||pool.length===1)sac.push(i);for(i=sac.length-1;i>0;i--){var r=(Math.random()*(i+1))|0,tmp=sac[i];sac[i]=sac[r];sac[r]=tmp;}}
      last=sac.pop();return pool[last];
    };
    var vb=function(x,y,s,dx,dy,d,cls,dl){
      var e=document.createElement('i');e.className='cr-vb'+(cls?' '+cls:'');
      e.style.setProperty('--x',x.toFixed(0)+'px');e.style.setProperty('--y',y.toFixed(0)+'px');e.style.setProperty('--s',s.toFixed(0)+'px');
      e.style.setProperty('--dx',dx.toFixed(0)+'px');e.style.setProperty('--dy',dy.toFixed(0)+'px');e.style.setProperty('--d',d.toFixed(1)+'s');
      if(dl)e.style.setProperty('--dl',dl+'s');
      if(!cls)e.addEventListener('animationend',function(){e.remove();});
      body.appendChild(e);return e;
    };
    var ferme=function(){
      clearInterval(tb);clearTimeout(tc);
      traine.forEach(function(e){e.remove();});traine=[];
      if(bulle){var b=bulle;bulle=null;b.classList.remove('on');setTimeout(function(){b.remove();},320);}
      arc.classList.remove('parle');
    };

    /* ----- la toile (point d'attache), le fil et le pendule ----- */
    var A={x:0,y:0},libre=false,drag=null,th=0,om=0,L=60,tt=0,gvx=0,gvy=0,pAx=null,vx=0,pvx=0,axl=0,grimpe=0,tlast=performance.now();
    var maison=function(){
      var m=innerWidth<900,hb=hd?hd.getBoundingClientRect().bottom:0,nv=m&&document.querySelector('nav');
      if(nv){var q=nv.getBoundingClientRect();if(q.top<innerHeight/3)hb=Math.max(hb,q.bottom);}
      A.x=innerWidth*(m?.88:.58);A.y=hb+(m?46:10);
    };
    maison();
    var bord=function(){A.x=Math.max(14,Math.min(innerWidth-14,A.x));A.y=Math.max(14,Math.min(innerHeight-60,A.y));};
    addEventListener('resize',function(){if(libre)bord();else maison();});
    var prise=function(tl){
    tl.addEventListener('pointerdown',function(e){
      if(e.button)return;
      e.preventDefault();try{tl.setPointerCapture(e.pointerId);}catch(_){}
      audio();
      drag={id:e.pointerId,ox:A.x-e.clientX,oy:A.y-e.clientY,sx:e.clientX,sy:e.clientY,moved:false};gvx=gvy=0;
    });
    tl.addEventListener('pointermove',function(e){
      if(!drag||e.pointerId!==drag.id)return;
      if(!drag.moved&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>5){drag.moved=true;libre=true;if(!He)He={x:A.x,y:A.y,vx:0,vy:0};ferme();body.classList.add('ar-prise');}
      if(!drag.moved)return;
      A.x=e.clientX+drag.ox;A.y=e.clientY+drag.oy;bord();
    });
    var lache=function(e,annule){
      if(!drag||e.pointerId!==drag.id)return;
      var d=drag;drag=null;body.classList.remove('ar-prise');try{tl.releasePointerCapture(d.id);}catch(_){}
      if(d.moved){gvx=Math.max(-1500,Math.min(1500,vx));gvy=0;if(He){var dd=Math.hypot(A.x-He.x,A.y-He.y);if(dd>24)twang(170+Math.min(dd,520)*.5,.06,.5);}}
      else if(!annule)grimpe=4;
    };
    tl.addEventListener('pointerup',function(e){lache(e,false);});
    tl.addEventListener('pointercancel',function(e){lache(e,true);});
    tl.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();grimpe=4;}});
    };
    prise(tl);prise(corde);
    var sw=0,sh=0;
    (function boucle(now){
      var dt=Math.min(.04,(now-tlast)/1000)||.016;tlast=now;
      if(!document.hidden){
        tt+=dt;if(grimpe>0)grimpe-=dt;
        if(!drag||!drag.moved){
          if(gvx){A.x+=gvx*dt;gvx*=Math.exp(-5*dt);if(Math.abs(gvx)<10)gvx=0;bord();}
        }
        /* l'ancienne attache reste collée là où la toile était ; lâchée, la toile claque comme un élastique et la rejoint en vibrant */
        if(He){
          if(drag&&drag.moved){He.vx=He.vy=0;}
          else{He.vx+=((A.x-He.x)*150-He.vx*5.5)*dt;He.vy+=((A.y-He.y)*150-He.vy*5.5)*dt;He.x+=He.vx*dt;He.y+=He.vy*dt;if(Math.hypot(A.x-He.x,A.y-He.y)<1.5&&Math.hypot(He.vx,He.vy)<20)He=null;}
        }
        var rv=pAx===null?0:(A.x-pAx)/dt;pAx=A.x;
        vx+=(rv-vx)*.25;axl+=(((vx-pvx)/dt)-axl)*.3;pvx=vx;
        /* longueur du fil : elle monte et descend à son rythme, descend en parlant, remonte quand on touche la toile */
        var Lmax=Math.max(60,Math.min(230,innerHeight-A.y-34)),cible=arc.classList.contains('parle')?Lmax:grimpe>0?Lmax*.12:calm?Lmax*.7:Lmax*(.3+.7*(.5-.5*Math.cos(tt/17*6.2832)));
        L+=(cible-L)*Math.min(1,dt*1.6);
        om+=(-(1500/L)*Math.sin(th)+Math.max(-12000,Math.min(12000,axl))/L*Math.cos(th)-1.8*om)*dt;
        th+=om*dt;if(th>1.5){th=1.5;om*=-.3;}else if(th<-1.5){th=-1.5;om*=-.3;}
        if(!calm)om+=Math.sin(tt*1.3)*.05*dt*60*.02;
        sw=sw||ar.offsetWidth;sh=sh||ar.offsetHeight;
        var s=Math.sin(th),c=Math.cos(th),sx=A.x+s*L,sy=A.y+c*L;/* l'araignée ne quitte jamais l'écran : le fil se raccourcit ou elle rebondit */ var mn=sw/2+6,mx=innerWidth-sw/2-6;if(sx<mn){sx=mn;if(om<0)om*=-.4;}else if(sx>mx){sx=mx;if(om>0)om*=-.4;}sy=Math.min(sy,innerHeight-sh/2-6);var ex=sx-s*sh*.42,ey=sy-c*sh*.42;
        ar.style.transform='translate('+(sx-sw/2).toFixed(1)+'px,'+(sy-sh/2).toFixed(1)+'px) rotate('+(-th).toFixed(3)+'rad)';
        tl.style.transform='translate('+(A.x-tl.offsetWidth/2).toFixed(1)+'px,'+(A.y-tl.offsetHeight/2).toFixed(1)+'px)';
        fil.setAttribute('d','M'+A.x.toFixed(1)+' '+A.y.toFixed(1)+'L'+ex.toFixed(1)+' '+ey.toFixed(1));
        var dh=He?Math.hypot(A.x-He.x,A.y-He.y):0;
        if(He&&dh>6){
          /* trois brins tendus, amincis par l'étirement, qui s'évasent vers l'ancienne attache */
          var ux=(A.x-He.x)/dh,uy=(A.y-He.y)/dh,nx=-uy,ny=ux,sag=Math.max(0,90-dh)*.3,wg=Math.sin(now/24)*Math.min(14,Math.hypot(He.vx,He.vy)*.012);
          for(var q=0;q<3;q++){
            var o=(q-1)*Math.max(4,16/(1+dh/120)),mx2=(A.x+He.x)/2+nx*(o*.5+sag+wg*(q-1)),my2=(A.y+He.y)/2+ny*(o*.5+sag+wg*(q-1));
            fils[q].setAttribute('d','M'+(He.x+nx*o).toFixed(1)+' '+(He.y+ny*o).toFixed(1)+'Q'+mx2.toFixed(1)+' '+my2.toFixed(1)+' '+A.x.toFixed(1)+' '+A.y.toFixed(1));
            fils[q].style.strokeWidth=Math.max(.5,1.6/(1+dh/260)).toFixed(2)+'px';
          }
          /* un ruban de prise le long des fils tendus : on peut les saisir n'importe où */
          var hw=innerWidth<900?20:26;
          corde.style.display='block';
          corde.style.clipPath='polygon('+[[He.x+nx*hw,He.y+ny*hw],[A.x+nx*hw,A.y+ny*hw],[A.x-nx*hw,A.y-ny*hw],[He.x-nx*hw,He.y-ny*hw]].map(function(v){return v[0].toFixed(1)+'px '+v[1].toFixed(1)+'px';}).join(',')+')';
        }else{for(var q2=0;q2<3;q2++)fils[q2].setAttribute('d','M0 0');corde.style.display='none';}
        if(bulle){
          var w=bulle.offsetWidth,hb2=bulle.offsetHeight,dessous=sy+sh/2+62+hb2<innerHeight-8;
          bulle.style.left=Math.max(8,Math.min(innerWidth-w-8,sx-w/2))+'px';
          bulle.style.top=(dessous?sy+sh/2+62:Math.max(8,sy-sh/2-hb2-22))+'px';
          var sg=dessous?1:-1;
          traine.forEach(function(e,k){e.style.setProperty('--x',(sx+[0,5,-3][k]).toFixed(0)+'px');e.style.setProperty('--y',(sy+sg*(sh/2+[10,23,40][k])).toFixed(0)+'px');});
        }
      }
      requestAnimationFrame(boucle);
    })(performance.now());

    ar.addEventListener('click',function(e){
      e.stopPropagation();
      var p=tire();ferme();
      arc.classList.add('parle');
      var r=ar.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
      /* une gerbe de petites bulles vampiriques s'échappe de l'araignée */
      if(!calm)for(var i=0;i<12;i++)vb(cx+rnd(-6,6),cy+rnd(-4,8),rnd(7,24),rnd(-70,70),rnd(-120,-30),rnd(1.8,3.2),Math.random()<.4?'croc':'');
      /* et trois bulles de plus en plus grosses mènent à la parole */
      traine=[vb(cx,r.bottom+10,7,0,0,0,'fixe',0),vb(cx+5,r.bottom+23,11,0,0,0,'fixe',.12),vb(cx-3,r.bottom+40,17,0,0,0,'fixe',.24)];
      var b=document.createElement('div');b.className='cr-bulle';b.setAttribute('role','status');b.setAttribute('aria-live','polite');
      var q=document.createElement('q');b.appendChild(q);
      body.appendChild(b);bulle=b;
      setTimeout(function(){if(bulle===b)b.classList.add('on');},calm?0:380);
      var texte=String(p.t),fin=function(){
        if(p.k==='tweet'){
          var s=document.createElement('small'),a=document.createElement('a');
          a.href=p.u;a.target='_blank';a.rel='noopener';a.textContent='@TancredeCharon'+(p.d?' · '+p.d:'');s.appendChild(a);b.appendChild(s);
        }
        tc=setTimeout(ferme,Math.max(7000,texte.length*75));
      };
      if(calm){q.textContent=texte;fin();}
      else{var n=0;setTimeout(function(){if(bulle!==b)return;tb=setInterval(function(){n+=2;q.textContent=texte.slice(0,n);if(n>=texte.length){clearInterval(tb);fin();}},24);},420);}
      b.addEventListener('click',function(ev){if(ev.target.closest('a'))return;ferme();});
    });
    addEventListener('keydown',function(e){if(e.key==='Escape'&&bulle)ferme();});
  }

  /* ---------- lettrines : la première lettre des longs paragraphes ---------- */
  [].forEach.call(document.querySelectorAll('.cachot .rsec'),function(s){
    [].forEach.call(s.children,function(p,i){
      if(p.tagName!=='P'||p.classList.contains('note')||p.textContent.length<230||/^[«"“(]/.test(p.textContent.trim()))return;
      var pr=p.previousElementSibling;
      if(!pr||pr.tagName==='H2'||(i<3&&pr.tagName==='FIGURE'&&!s.querySelector('p.lettrine')))p.classList.add('lettrine');
    });
  });

  /* ---------- les reliques cachées ---------- */
  var trouvees=[];
  try{trouvees=JSON.parse(localStorage.getItem(KEY)||'[]').filter(function(k){return typeof k==='string';});}catch(e){}
  var cpt=document.getElementById('rel-n');
  function maj(){
    if(cpt)cpt.textContent=trouvees.length;
    if(trouvees.length>=TOTAL)body.classList.add('icone');
  }
  var rels=[].slice.call(document.querySelectorAll('button.rel'));
  rels.forEach(function(r){
    if(trouvees.indexOf(r.getAttribute('data-r'))>-1)r.classList.add('trouve');
    r.addEventListener('click',function(){
      var k=r.getAttribute('data-r'),neuf=trouvees.indexOf(k)<0,b=r.getBoundingClientRect();
      if(neuf){trouvees.push(k);try{localStorage.setItem(KEY,JSON.stringify(trouvees));}catch(e){}}
      r.classList.add('trouve');gerbe(b.left+b.width/2,b.top+b.height/2,neuf?10:4);maj();
      if(neuf&&trouvees.length>=TOTAL){
        dire('Neuf reliques. Le vitrail vous reconnaît : vous êtes une icône.',8000);confettis(70);gerbe(innerWidth/2,innerHeight/2,26);
      }else{
        dire(r.getAttribute('data-q')+(neuf?'  ('+trouvees.length+' / '+TOTAL+')':''),6200);
      }
    });
  });
  maj();

  /* ---------- le vitrail réagit au toucher ---------- */
  var vt=document.getElementById('vitrail');
  if(vt)vt.addEventListener('click',function(e){gerbe(e.clientX,e.clientY,8);dire('Le vitrail ne dit rien, mais il a l’air content.');});

  /* ---------- pour qui connaît le code ---------- */
  var SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],pos=0;
  addEventListener('keydown',function(e){
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    pos=(k===SEQ[pos])?pos+1:(k===SEQ[0]?1:0);
    if(pos===SEQ.length){pos=0;confettis(60);gerbe(innerWidth/2,innerHeight/2,30);dire('Les cachots vous acclament. Bis !',6500);}
  });
})();
