/* Liseuse de photos protégée : jamais d'ouverture du fichier image dans le navigateur. */
(function(){
  var css='#lb{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.96);display:flex;flex-direction:column;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}'
  +'#lb .lb-stage{position:relative;flex:1;min-height:0;overflow:hidden;touch-action:pan-y;cursor:zoom-out}'
  +'#lb .lb-track{display:flex;height:100%;will-change:transform}'
  +'#lb .lb-track.anim{transition:transform .28s ease}'
  +'#lb .lb-slide{flex:0 0 100%;width:100%;height:100%;display:flex;align-items:center;justify-content:center}'
  +'#lb img{max-width:94vw;max-height:90%;object-fit:contain;pointer-events:none;-webkit-user-drag:none}'
  +'#lb button{background:#000;color:#f00;border:.2rem solid #f00;font:400 3.4rem/1 "Bebas Neue",Arial,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}'
  +'#lb button:hover,#lb button:focus-visible{background:#f00;color:#000;outline:0}'
  +'#lb .lb-x{position:absolute;top:1rem;right:1rem;width:5rem;height:5rem;font-size:2.8rem;z-index:2}'
  +'#lb .lb-c{color:#ccc;font-size:1.8rem;text-align:center;pointer-events:none}'
  +'@media(min-width:900px){#lb .lb-bar{position:absolute;inset:0;pointer-events:none}'
  +'#lb .lb-bar button{position:absolute;pointer-events:auto;top:50%;margin-top:-3rem;width:4.6rem;height:6rem}'
  +'#lb .lb-p{left:1rem}#lb .lb-n{right:1rem}'
  +'#lb .lb-c{position:absolute;left:0;right:0;bottom:.8rem}}'
  +'@media(max-width:899px){#lb .lb-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.5rem .6rem calc(.5rem + env(safe-area-inset-bottom))}'
  +'#lb .lb-bar button{flex:none;width:4.2rem;height:3.4rem;font-size:2.4rem}'
  +'#lb .lb-c{flex:1;font-size:1.2rem}'
  +'#lb .lb-x{width:3.8rem;height:3.8rem;font-size:2.2rem}}';
  if(document.querySelector('link[href*="putride.css"]'))css+='#lb{background:rgba(8,0,18,.97)}#lb button{background:#0b0016;color:#c58bff;border-color:#39ff6e}#lb button:hover,#lb button:focus-visible{background:#39ff6e;color:#0b0016}#lb .lb-c{color:#c58bff}#lb img{box-shadow:0 0 1.6rem rgba(122,45,214,.55);border:.12rem solid #39ff6e}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var LB=null;
  function closeLB(){
    if(!LB)return;
    document.removeEventListener('keydown',LB.key,true);
    LB.box.remove();document.documentElement.style.overflow='';LB=null;
  }
  function openLB(list,i){
    closeLB();
    var n=list.length,dragging=false,moved=false,startX=0,startY=0,dx=0,locked=null;
    var box=document.createElement('div');box.id='lb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Photo agrandie');
    var stage=document.createElement('div');stage.className='lb-stage';
    var track=document.createElement('div');track.className='lb-track';
    var imgs=list.map(function(it){
      var s=document.createElement('div');s.className='lb-slide';
      var im=document.createElement('img');im.draggable=false;im.alt=it.alt||'';s.appendChild(im);track.appendChild(s);return im;
    });
    stage.appendChild(track);box.appendChild(stage);
    var bar=document.createElement('div');bar.className='lb-bar';
    var cap=document.createElement('div');cap.className='lb-c';
    function btn(cls,txt,lab,fn){var b=document.createElement('button');b.type='button';b.className=cls;b.textContent=txt;b.setAttribute('aria-label',lab);b.addEventListener('click',function(e){e.stopPropagation();fn();});return b;}
    function load(k){var m=(k+n)%n;if(!imgs[m].getAttribute('src'))imgs[m].src=list[m].src;}
    function place(extra,anim){
      track.classList.toggle('anim',!!anim);
      track.style.transform='translate3d(calc('+(-100*i)+'% + '+(extra||0)+'px),0,0)';
    }
    function show(k,anim){
      i=(k+n)%n;load(i-1);load(i);load(i+1);
      cap.textContent=n>1?(i+1)+' / '+n:'';
      place(0,anim);
    }
    box.appendChild(btn('lb-x','✕','Fermer la photo',closeLB));
    if(n>1){
      bar.appendChild(btn('lb-p','‹','Photo précédente',function(){show(i-1,i>0);}));
      bar.appendChild(cap);
      bar.appendChild(btn('lb-n','›','Photo suivante',function(){show(i+1,i<n-1);}));
      box.appendChild(bar);
    }
    stage.addEventListener('pointerdown',function(e){
      if(n<2||(e.pointerType==='mouse'&&e.button!==0))return;
      dragging=true;moved=false;locked=null;startX=e.clientX;startY=e.clientY;dx=0;
      track.classList.remove('anim');
    });
    stage.addEventListener('pointermove',function(e){
      if(!dragging)return;
      var mx=e.clientX-startX,my=e.clientY-startY;
      if(locked===null&&(Math.abs(mx)>6||Math.abs(my)>6))locked=Math.abs(mx)>Math.abs(my)?'x':'y';
      if(locked!=='x')return;
      if(!moved){moved=true;try{stage.setPointerCapture(e.pointerId);}catch(_){}}
      dx=mx;
      var edge=(i===0&&dx>0)||(i===n-1&&dx<0);
      place(edge?dx*.3:dx,false);
    });
    function endDrag(){
      if(!dragging)return;dragging=false;
      if(!moved){place(0,false);return;}
      var w=stage.clientWidth||1,k=i;
      if(Math.abs(dx)>Math.min(80,w*.2))k=i+(dx<0?1:-1);
      if(k<0||k>=n)k=i;
      show(k,true);
    }
    stage.addEventListener('pointerup',endDrag);
    stage.addEventListener('pointercancel',endDrag);
    stage.addEventListener('click',function(){if(moved){moved=false;return;}closeLB();});
    box.addEventListener('contextmenu',function(e){e.preventDefault();});
    box.addEventListener('dragstart',function(e){e.preventDefault();});
    var key=function(e){
      if(e.key==='Escape'){e.preventDefault();closeLB();}
      else if(e.key==='ArrowRight'&&n>1){e.preventDefault();show(i+1,i<n-1);}
      else if(e.key==='ArrowLeft'&&n>1){e.preventDefault();show(i-1,i>0);}
    };
    document.addEventListener('keydown',key,true);
    LB={box:box,key:key};document.body.appendChild(box);document.documentElement.style.overflow='hidden';
    show(i,false);
    box.querySelector('.lb-x').focus();
  }
  window.openLB=openLB;window.closeLB=closeLB;
  window.addEventListener('hashchange',closeLB);

  /* pages SEO (Jekyll) : galeries de tournage */
  [].slice.call(document.querySelectorAll('.route-content .tour-gallery')).forEach(function(g){
    g.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('.ph a');
      if(!a)return;
      e.preventDefault();
      var links=[].slice.call(g.querySelectorAll('.ph a'));
      openLB(links.map(function(l){var im=l.querySelector('img');return {src:l.href,alt:im?im.alt:''};}),links.indexOf(a));
    });
    g.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('.ph'))e.preventDefault();});
    g.addEventListener('dragstart',function(e){e.preventDefault();});
  });
})();
