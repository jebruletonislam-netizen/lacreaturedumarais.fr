(function(){
  var s=document.getElementById('slime');
  if(s){
    var NS='http://www.w3.org/2000/svg',busy=false;
    var rnd=function(a,b){return a+Math.random()*(b-a);};
    var poo=function(){
      var h=rnd(0,360),d='#3b220d',m='#5a3615',l='#7a4e22';
      return '<svg class="poo" viewBox="0 0 80 64" width="100%" height="100%"><g stroke="#1d0f05" stroke-width="2.4" stroke-linejoin="round">'
      +'<path fill="'+d+'" d="M6 52 Q2 40 14 38 Q10 28 24 28 Q22 16 36 16 Q38 6 50 10 Q58 12 54 20 Q68 22 62 32 Q76 36 70 46 Q72 58 52 58 L16 59 Q6 58 6 52Z"/>'
      +'<path fill="'+m+'" d="M14 50 Q10 42 20 40 Q18 32 28 32 Q28 24 38 24 Q42 16 50 20 Q56 26 52 30 Q62 32 58 40 Q66 46 56 52 Q40 56 14 50Z"/></g>'
      +'<path d="M22 44 Q30 40 38 44 M36 30 Q44 26 50 32" stroke="'+l+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
      +'<g fill="#2a1a08" opacity=".9"><circle cx="20" cy="52" r="2.2"/><circle cx="44" cy="52" r="3"/><circle cx="58" cy="44" r="1.8"/><circle cx="32" cy="22" r="1.6"/></g>'
      +'<g fill="#b9c36a" opacity=".75"><circle cx="26" cy="38" r="2"/><circle cx="48" cy="40" r="1.6"/></g>'
      +'<path d="M52 12 Q58 6 56 0" stroke="#7a8a2a" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/></svg>';
    };
    var bug=function(){
      return '<svg class="bug" viewBox="0 0 30 12" width="100%" height="100%"><g fill="#e9e3b4" stroke="#6b6430" stroke-width="1"><ellipse cx="6" cy="6" rx="4.2" ry="3.4"/><ellipse cx="12.5" cy="6" rx="4" ry="3.4"/><ellipse cx="18.5" cy="6" rx="3.8" ry="3.2"/><ellipse cx="24" cy="6" rx="3.2" ry="2.8"/></g><circle cx="4.5" cy="5" r=".8" fill="#222"/></svg>';
    };
    var column=function(x,w,h){
      var c=document.createElement('div');c.className='col';
      c.style.cssText='left:'+x+'%;width:'+w+'%;height:'+h+'vh';
      var bulb=rnd(1.6,2.6),tip=rnd(.15,.35),mid=rnd(.4,.6),pale=rnd(-12,10)|0;
      var id='g'+Math.random().toString(36).slice(2,8);
      var svg='<svg class="dr" viewBox="0 0 100 400" preserveAspectRatio="none"><defs><linearGradient id="'+id+'" x1="0" x2="1">'
      +'<stop offset="0" stop-color="#1f7a4a"/><stop offset=".3" stop-color="hsl('+(82+pale)+',48%,52%)"/><stop offset=".62" stop-color="#9bbf62"/><stop offset="1" stop-color="#2c8a4c"/></linearGradient></defs>'
      +'<path fill="url(#'+id+')" stroke="#145a34" stroke-width="2" vector-effect="non-scaling-stroke" d="M'+(50-tip*4)+' 0 L'+(50+tip*4)+' 0 C'+(50+tip*6)+' 150 96 190 96 270 L96 360 C96 380 '+(50+bulb*10)+' 380 '+(50+bulb*9)+' 390 C'+(50+bulb*6)+' 404 '+(50-bulb*6)+' 404 '+(50-bulb*9)+' 390 C'+(50-bulb*10)+' 380 4 380 4 360 L4 270 C4 190 '+(50-tip*6)+' 150 '+(50-tip*4)+' 0Z"/>'
      +'<path d="M24 20 L22 340" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke"/>'
      +'<path d="M78 60 L80 300" stroke="#0e3d22" stroke-opacity=".35" stroke-width="5" fill="none" vector-effect="non-scaling-stroke"/></svg>';
      c.innerHTML=svg;
      return c;
    };
    var go=function(rev,done){
      if(busy)return;busy=true;
      s.innerHTML='';
      var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
      var n=window.innerWidth<700?16:30,cols=[],hv=170,wcol=100/n;
      var vw=window.innerWidth/100,vh=window.innerHeight/100;
      for(var i=0;i<n;i++){
        var w=wcol*rnd(1.5,2.1),c=column(i*wcol-wcol*.4,w,hv);
        s.appendChild(c);cols.push(c);
        if(Math.random()<.45){
          var p=document.createElement('div');
          var sz=Math.min(w*vw*rnd(1.1,1.5),170);
          p.style.cssText='position:absolute;width:'+sz+'px;height:'+sz*.8+'px;left:'+(50-sz/(w*vw)*50)+'%;top:'+rnd(55,130)+'vh;transform:rotate('+rnd(-18,18)+'deg)';
          p.innerHTML=poo();c.appendChild(p);
        }
        if(Math.random()<.3){
          var b=document.createElement('div');
          b.style.cssText='position:absolute;width:'+Math.min(w*vw*.9,46)+'px;height:'+Math.min(w*vw*.36,18)+'px;left:'+rnd(15,45)+'%;top:'+rnd(25,120)+'vh;transform:rotate('+rnd(-70,70)+'deg)';
          b.innerHTML=bug();c.appendChild(b);
        }
      }
      var T=reduce?.3:1,fin=0;
      var cover=-(hv-110),start=-hv-8,out=105;
      var anims=cols.map(function(c){
        var d1=rnd(0,.5)*T,u1=rnd(.9,1.5)*T,d2=rnd(0,.6)*T,u2=rnd(1.2,2)*T,hold=1.0*T;
        var t1=d1+u1,t2=t1+hold+d2,tot=t2+u2;
        var f=function(v){return 'translateY('+v+'vh)';};
        return c.animate([
          {transform:f(start),offset:0},
          {transform:f(start),offset:d1/tot},
          {transform:f(cover),offset:t1/tot,easing:'ease-out'},
          {transform:f(cover),offset:t2/tot},
          {transform:f(out),offset:1}
        ],{duration:tot*1000,fill:'forwards',easing:'cubic-bezier(.5,0,.6,1)'});
      });
      var maxCover=0;
      setTimeout(function(){if(done)done();},(reduce?.5:2.2)*1000);
      Promise.all(anims.map(function(a){return a.finished;})).then(function(){s.innerHTML='';busy=false;}).catch(function(){s.innerHTML='';busy=false;});
    };
    var t=document.getElementById('trap'),u=document.getElementById('up');
    if(t)t.addEventListener('click',function(){go(false);});
    if(u)u.addEventListener('click',function(ev){ev.preventDefault();go(true);});
  }
  Array.prototype.forEach.call(document.querySelectorAll('.play'),function(b){
    b.addEventListener('click',function(){
      var c=b.closest('.card'),f=c.querySelector('iframe');
      if(f){f.remove();c.classList.remove('open');b.textContent='▶ ÉCOUTER';return;}
      f=document.createElement('iframe');
      f.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(b.dataset.sc)+'&color=%2339ff6e&auto_play=true&show_teaser=false';
      f.height=b.dataset.h;f.allow='autoplay';f.title='Lecteur SoundCloud';
      c.appendChild(f);c.classList.add('open');b.textContent='■ FERMER';
    });
  });
  document.addEventListener('click',function(ev){
    var a=ev.target.closest&&ev.target.closest('[data-lb]');
    if(!a||!window.openLB)return;
    ev.preventDefault();
    window.openLB([{src:a.getAttribute('href'),alt:a.dataset.lb}],0);
  });
  var eph=document.getElementById('eph');
  if(eph){
    var tog=function(){var on=eph.classList.toggle('on');eph.setAttribute('aria-pressed',on);};
    eph.addEventListener('pointerdown',function(ev){if(ev.pointerType!=='mouse')tog();});
    eph.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();tog();}});
  }
})();
