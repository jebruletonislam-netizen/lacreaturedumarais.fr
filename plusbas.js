/* « Plus bas » : porte à mot de passe des archives.
   La bonne réponse n'est pas écrite en clair dans le fichier (simple empreinte : ce n'est pas un vrai coffre-fort).
   Une mauvaise réponse déclenche une giclée de fluide vert, de sang et de merde, liquide et dessinée comme un dessin animé des années 2000. */
(function(){
  if(window.PBInit)return;
  var KEY='lcm-plusbas',EMPREINTE='pvtfr1cpdw';
  var MSG=['Raté. Le fluide te remercie.','Non. Prends-le en pleine face.','Faux. Te voilà tout vert.','Mauvaise réponse. Ça gicle.'];
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;

  function norm(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
  function empreinte(s){
    var h1=0xdeadbeef,h2=0x41c6ce57,i,c;
    for(i=0;i<s.length;i++){c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677);}
    h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
    h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
    return (4294967296*(2097151&h2)+(h1>>>0)).toString(36);
  }

  /* ---------- le fluide ---------- */
  var VERT=['#7cff1c','#58e000','#a8ff4a','#3fc400'],ROUGE=['#e0102c','#ff3a3a','#b8001d'],MARRON=['#6b3a14','#8a5a24','#4a2808'];
  var pick=function(a){return a[(Math.random()*a.length)|0];};
  var rr=function(a,b){return a+Math.random()*(b-a);};
  var ease=function(t){var c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};

  function ensureFilter(){
    if(document.getElementById('pb-defs'))return;
    var d=document.createElement('div');d.id='pb-defs';d.setAttribute('aria-hidden','true');
    d.innerHTML='<svg width="0" height="0" style="position:absolute"><defs><filter id="pb-goo" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"/></filter></defs></svg>';
    document.body.appendChild(d);
  }

  function giclee(done){
    if(calm){
      var f=document.createElement('div');f.className='pb-flash';document.body.appendChild(f);
      setTimeout(function(){f.remove();if(done)done();},1000);return;
    }
    ensureFilter();
    var W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);
    var big=W<700?7:10;
    function mk(cls){var c=document.createElement('canvas');c.className=cls;c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);var x=c.getContext('2d');x.scale(dpr,dpr);document.body.appendChild(c);return [c,x];}
    var A=mk('pb-fx pb-goo'),G=mk('pb-fx pb-gloss'),ca=A[0],cx=A[1],cg=G[0],gx=G[1];
    var splats=[],drops=[],drips=[],t0=performance.now(),last=t0,ended=false;
    var disc=function(x,y,r,col){cx.fillStyle=col;cx.beginPath();cx.arc(x,y,Math.max(.5,r),0,6.2832);cx.fill();};

    for(var i=0;i<big;i++){
      var gx0=rr(.08,.92)*W,gy0=rr(.08,.86)*H,R=rr(.12,.24)*Math.min(W,H)*(W<700?1.5:1);
      var sp=[],q,ns=7+((Math.random()*5)|0);for(q=0;q<ns;q++)sp.push({a:Math.random()*6.2832,L:rr(1.15,1.85),w:rr(.1,.2)});
      splats.push({x:gx0,y:gy0,R:R,sp:sp,at:i*.07+Math.random()*.08,col:pick(VERT),mix:[[pick(ROUGE),rr(-.5,.5),rr(-.4,.5),rr(.35,.6)],[pick(MARRON),rr(-.55,.55),rr(-.3,.6),rr(.3,.55)],[pick(VERT),rr(-.4,.4),rr(-.4,.4),rr(.35,.6)]],done:false});
    }
    function burst(s){
      var n=(W<700?14:22)+((Math.random()*8)|0),k;
      for(k=0;k<n;k++){var a=Math.random()*6.2832,v=rr(260,900);drops.push({x:s.x,y:s.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,r:rr(5,s.R*.2),col:Math.random()<.2?pick(ROUGE):Math.random()<.14?pick(MARRON):pick(VERT),life:rr(.12,.34)});}
      var m=(W<700?3:5)+((Math.random()*3)|0);
      for(k=0;k<m;k++){drips.push({x:s.x+rr(-.8,.8)*s.R*.7,y:s.y+s.R*rr(.15,.7),r:rr(8,17),vy:rr(30,70),col:Math.random()<.22?pick(ROUGE):Math.random()<.1?pick(MARRON):s.col,start:t0+s.at*1000+500});}
    }
    function frame(now){
      var t=(now-t0)/1000,dt=Math.min((now-last)/1000,.05);last=now;
      splats.forEach(function(s){
        var u=(t-s.at)/.28;if(u<0)return;
        if(u<1.2){var r=s.R*ease(Math.min(u,1));disc(s.x,s.y,r,s.col);s.mix.forEach(function(m){disc(s.x+m[1]*s.R,s.y+m[2]*s.R,r*m[3],m[0]);});
          var e=Math.min(u,1);s.sp.forEach(function(k){for(var j=0;j<7;j++){var d=r*.7+(s.R*k.L-s.R*.7)*(j/6)*e;disc(s.x+Math.cos(k.a)*d,s.y+Math.sin(k.a)*d,Math.max(2,s.R*k.w*(1-j/7.5)),s.col);}});
          s.cur=r;}
        if(!s.done&&u>=.05){s.done=true;burst(s);gx.clearRect(0,0,W,H);}
      });
      drops.forEach(function(d){
        if(d.life<=0)return;d.life-=dt;d.vx*=.9;d.vy=d.vy*.9+500*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;disc(d.x,d.y,d.r,d.col);
      });
      drips.forEach(function(d){
        if(now<d.start)return;d.vy+=90*dt;d.y+=d.vy*dt;d.r=Math.max(3.2,d.r-1.1*dt);disc(d.x,d.y,d.r,d.col);disc(d.x,d.y-d.r*1.5,d.r*.8,d.col);
      });
      gx.clearRect(0,0,W,H);
      splats.forEach(function(s){
        if(!s.cur)return;var r=s.cur,u=Math.min(1,(t-s.at)/.28);
        gx.save();gx.translate(s.x-r*.36,s.y-r*.42);gx.rotate(-.6);gx.fillStyle='rgba(255,255,255,.9)';gx.beginPath();gx.ellipse(0,0,r*.3,r*.1,0,0,6.2832);gx.fill();
        gx.fillStyle='rgba(255,255,255,.85)';gx.beginPath();gx.arc(r*.42,r*.34,Math.max(1.5,r*.045),0,6.2832);gx.fill();gx.restore();
      });
      drips.forEach(function(d){if(now<d.start)return;gx.fillStyle='rgba(255,255,255,.8)';gx.beginPath();gx.ellipse(d.x-d.r*.35,d.y-d.r*.2,Math.max(1,d.r*.16),d.r*.5,0,0,6.2832);gx.fill();});
      if(t<3.0){requestAnimationFrame(frame);}
      else if(!ended){
        ended=true;
        var dur=1500,opt={duration:dur,easing:'cubic-bezier(.55,0,.95,.55)',fill:'forwards'},kf=[{transform:'translateY(0)'},{transform:'translateY(118vh)'}];
        ca.animate(kf,opt);var an=cg.animate(kf,opt);
        (function drain(n){requestAnimationFrame(function(now){if(n<80){frame2(now);drain(n+1);}});})(0);
        an.onfinish=function(){ca.remove();cg.remove();if(done)done();};
      }
    }
    function frame2(now){ /* pendant l'écoulement, les gouttes continuent de s'étirer */
      var dt=.016;drips.forEach(function(d){d.vy+=140*dt;d.y+=d.vy*dt;disc(d.x,d.y,d.r,d.col);});
    }
    requestAnimationFrame(function(n){last=n;t0=n;frame(n);});
  }

  /* ---------- la porte ---------- */
  window.PBInit=function(){
    var box=document.getElementById('pb');if(!box||box.__ok)return;box.__ok=1;
    var lock=box.querySelector('.pb-lock'),open=box.querySelector('.pb-open'),form=box.querySelector('form'),inp=box.querySelector('input'),msg=box.querySelector('.pb-msg');
    function show(){lock.hidden=true;open.hidden=false;}
    /* le mot de passe se redemande à chaque descente : le laissez-passer est périmé dès qu'on revient ici */
    try{sessionStorage.removeItem(KEY);}catch(e){}
    var n=0,tp=0,cases=lock.querySelectorAll('.vt2-l b'),mot=['É','P','H','É','B','A','A','L'];
    /* chaque lettre tapée s'inscrit dans un quadrilobe du vitrail (huit, comme ÉPHÉBAAL) */
    function lettres(arr,pop){
      for(var i=0;i<cases.length;i++){
        var c=arr[i]||'';
        if(cases[i].textContent!==c){
          cases[i].textContent=c;cases[i].classList.remove('on');
          if(c&&pop){void cases[i].offsetWidth;cases[i].classList.add('on');}
        }
      }
    }
    function saisie(){var m=inp.value.match(/[A-Za-z\u00C0-\u00FF]/g)||[];return m.slice(0,cases.length).map(function(x){return x.toUpperCase();});}
    inp.addEventListener('input',function(){lock.classList.add('pb-typing');clearTimeout(tp);tp=setTimeout(function(){lock.classList.remove('pb-typing');},900);lettres(saisie(),true);});
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var v=norm(inp.value);if(!v){inp.focus();return;}
      if(empreinte(v)===EMPREINTE){
        try{sessionStorage.setItem(KEY,'o'+Date.now());}catch(e){}
        msg.textContent='';lock.classList.remove('pb-typing');lettres(mot,false);lock.classList.add('pb-ok');setTimeout(show,1700);return;
      }
      msg.textContent=MSG[n++%MSG.length];lock.classList.remove('pb-no');void lock.offsetWidth;lock.classList.add('pb-no');
      inp.value='';setTimeout(function(){lettres([],false);},900);inp.disabled=true;form.querySelector('button').disabled=true;
      giclee(function(){inp.disabled=false;form.querySelector('button').disabled=false;inp.focus();});
    });
  };
})();
