/* Les deux coins du bas, dans le mode putride et dans les cachots.
   À gauche : couper (ou rétablir) les effets ; le choix est gardé, et vaut comme le réglage « moins d'animations » de l'appareil.
   À droite : l'Oracle, incarné par le Ver du baptistère, qui répond aux questions sur le lore. Il ne répond qu'avec les textes du site
   (/oracle-*.json, tirés des pages par _outils/oracle.py), avec des répliques écrites et sourcées : ce n'est pas un modèle génératif.
   Le mode putride connaît aussi les biographies publiques ; les cachots gardent leurs propres registres. Dans les cachots,
   interrogé sur les reliques cachées, il répond par une énigme sur l'une de
   celles qu'on n'a pas encore trouvées (liste RELIQUES, à tenir d'accord avec les boutons .rel des pages et cachot-vie.js). */
(function(){
  'use strict';
  if(window.Coins)return;
  var D=document,H=D.documentElement,LS='lcdm-calme',SS='lcdm-oracle';
  var couche=/^\/cachot\//.test(location.pathname)?'cachot':'putride';
  var calme=window.CALME!=null?!!window.CALME:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};

  var css=''
  +'.cn-b,.cn-p,.cn-toast{--c:#39ff6a;--c2:#d6b0ff;--o:rgba(122,45,214,.55);--l:rgba(57,255,106,.28);--bg:linear-gradient(180deg,#110020,#05000a);--t:#f1e8ff;--qb:#3b1170;--tf:"Bebas Neue",Impact,sans-serif}'
  +'.cn-cachot{--c:#ff1736;--c2:#ffe23f;--o:rgba(225,0,25,.5);--l:rgba(255,23,54,.32);--bg:linear-gradient(180deg,#120002,#000);--t:#ffe9a8;--qb:#5a0010;--tf:"UnifrakturCook","Bebas Neue",serif}'
  +'.cn-b{position:fixed;bottom:calc(12px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px));z-index:85;width:48px;height:48px;display:grid;place-items:center;margin:0;padding:0;border:2px solid var(--c);border-radius:50%;'
  +'background:radial-gradient(circle at 50% 32%,#222,#000 72%);color:var(--c);cursor:pointer;-webkit-tap-highlight-color:transparent;'
  +'box-shadow:0 0 0 2px #000,0 7px 16px rgba(0,0,0,.9),0 0 16px var(--o);transition:transform .18s,box-shadow .18s,bottom .45s cubic-bezier(.2,.9,.3,1)}'
  +'.cn-b.cn-cachot{border-radius:50% 50% 14% 14%/62% 62% 14% 14%;height:54px}'
  +'.cn-b:hover,.cn-b:focus-visible{transform:translateY(-2px) scale(1.06);outline:none;box-shadow:0 0 0 2px #000,0 9px 20px rgba(0,0,0,.9),0 0 24px var(--c)}'
  +'.cn-b svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 3px var(--o))}'
  +'.cn-fx{left:12px}.cn-or{right:12px}.cn-or[aria-expanded="true"]{background:var(--c);color:#000}'
  +'.cn-fx .cn-barre{display:none}.cn-fx[aria-pressed="true"] .cn-barre{display:inline}.cn-fx[aria-pressed="true"]{opacity:.82}'
  +'.cn-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}'
  +'.cn-p{position:fixed;right:12px;bottom:calc(72px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px));z-index:96;width:min(390px,calc(100vw - 24px));'
  +'max-height:min(580px,calc(100vh - 150px - var(--lc-h,0px)));max-height:min(580px,calc(100dvh - 150px - var(--lc-h,0px)));display:flex;flex-direction:column;'
  +'color:var(--t);background:var(--bg);border:1px solid var(--c);border-radius:16px;box-shadow:0 0 0 2px #000,0 14px 36px rgba(0,0,0,.92),0 0 24px var(--o);'
  +'font:15px/1.48 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;transform-origin:100% 100%;animation:cn-in .22s ease-out}'
  +'.cn-p.cn-cachot{font-family:"EB Garamond",Georgia,serif;font-size:16.5px;font-weight:500;border-radius:60px 60px 14px 14px/34px 34px 14px 14px}'
  +'.cn-p[hidden]{display:none}'
  +'@keyframes cn-in{from{opacity:0;transform:translateY(10px) scale(.96)}}'
  +'.cn-h{display:flex;align-items:flex-start;gap:10px;padding:12px 12px 9px 16px;border-bottom:1px solid var(--l)}'
  +'.cn-cachot .cn-h{padding-top:18px;justify-content:center;text-align:center}'
  +'.cn-h div{flex:1;min-width:0}.cn-h b{display:block;font:400 24px/1 var(--tf);letter-spacing:.06em;color:var(--c);text-shadow:0 0 10px var(--o)}'
  +'.cn-cachot .cn-h b{font-weight:700;font-size:27px;letter-spacing:.02em}'
  +'.cn-h small{display:block;margin-top:4px;font-size:12px;line-height:1.3;opacity:.72}'
  +'.cn-x{flex:none;width:34px;height:34px;margin:-4px -4px 0 0;padding:0;border:1px solid var(--l);border-radius:50%;background:transparent;color:var(--t);font:22px/1 Arial,sans-serif;cursor:pointer}'
  +'.cn-x:hover,.cn-x:focus-visible{border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-log{flex:1;min-height:90px;overflow:auto;overscroll-behavior:contain;padding:12px;display:flex;flex-direction:column;gap:9px;scrollbar-width:thin;scrollbar-color:var(--c) transparent}'
  +'.cn-m{max-width:94%;padding:8px 11px;border-radius:13px;overflow-wrap:anywhere}'
  +'.cn-m.q{align-self:flex-end;background:var(--qb);color:#fff;border-bottom-right-radius:4px}'
  +'.cn-m.a{align-self:flex-start;background:rgba(255,255,255,.045);border:1px solid var(--l);border-bottom-left-radius:4px}'
  +'.cn-m .src{display:block;margin-bottom:3px;font:400 14px/1.15 "Bebas Neue",Impact,sans-serif;letter-spacing:.09em;color:var(--c)}'
  +'.cn-m q{quotes:"« " " »"}.cn-m q::before,.cn-m q::after{color:var(--c)}'
  +'.cn-m a{color:var(--c2);text-decoration:underline;text-decoration-color:var(--c);text-underline-offset:2px}'
  +'.cn-m .va{display:block;margin-top:6px;font-size:.88em;opacity:.9}'
  +'.cn-m .lire{display:inline-block;margin-top:6px;font-weight:600}'
  +'.cn-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 9px}'
  +'.cn-sug button{font:inherit;font-size:13px;line-height:1.2;padding:5px 10px;border-radius:999px;border:1px solid var(--l);background:rgba(0,0,0,.35);color:var(--t);cursor:pointer}'
  +'.cn-sug button:hover,.cn-sug button:focus-visible{border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-f{display:flex;gap:7px;padding:9px 10px 10px;border-top:1px solid var(--l)}'
  +'.cn-f input{flex:1;min-width:0;font:16px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;padding:10px 12px;border-radius:11px;border:1px solid var(--l);background:#000;color:#fff}'
  +'.cn-f input:focus{outline:none;border-color:var(--c);box-shadow:0 0 0 2px var(--o)}'
  +'.cn-f button{flex:none;width:44px;border-radius:11px;border:1px solid var(--c);background:var(--c);color:#000;font:700 18px/1 Arial,sans-serif;cursor:pointer}'
  +'.cn-dots i{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--c);animation:cn-dot 1s infinite}.cn-dots i:nth-child(2){animation-delay:.15s}.cn-dots i:nth-child(3){animation-delay:.3s}'
  +'@keyframes cn-dot{50%{opacity:.25;transform:translateY(-3px)}}'
  +'.cn-toast{position:fixed;left:50%;bottom:calc(74px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px));z-index:97;max-width:min(30rem,calc(100vw - 32px));padding:9px 15px;transform:translateX(-50%);'
  +'color:var(--t);background:var(--bg);border:1px solid var(--c);border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.9),0 0 16px var(--o);font:14px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;pointer-events:none;transition:opacity .4s}'
  +'@media (max-width:560px){.cn-p{left:8px;right:8px;width:auto;bottom:calc(70px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px))}.cn-b{width:44px;height:44px}.cn-b.cn-cachot{height:50px}.cn-fx{left:8px}.cn-or{right:8px}}'
  /* place réservée aux coins : le bas du plan des cachots et le pied de page ne passent plus dessous */
  +'@media (min-width:900px){body.cachot nav{padding-bottom:calc(5.2rem + env(safe-area-inset-bottom,0px))}}'
  +'@media (max-width:899px){body.cachot .pfoot::after{content:"";display:block;height:calc(48px + env(safe-area-inset-bottom,0px))}}'
  +'@media print{.cn-b,.cn-p,.cn-toast{display:none!important}}';
  var st=D.createElement('style');st.textContent=css;D.head.appendChild(st);

  var cls=couche==='cachot'?' cn-cachot':'';
  function el(h){var t=D.createElement('template');t.innerHTML=h.trim();return t.content.firstChild;}

  /* ---------- à gauche : les effets ---------- */
  var ICO_FX='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M27 8l4.5 13.5L45 26l-13.5 4.5L27 44l-4.5-13.5L9 26l13.5-4.5z"/><path d="M47 38l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z"/><path class="cn-barre" d="M8 56L56 8" style="stroke-width:5"/></svg>';
  var fx=el('<button type="button" class="cn-b cn-fx'+cls+'"></button>');
  function majFx(){
    fx.setAttribute('aria-pressed',calme?'true':'false');
    var t=calme?'Rétablir les effets':'Couper les effets';
    fx.setAttribute('aria-label',t);fx.title=t;
    fx.innerHTML=ICO_FX;
  }
  majFx();
  fx.addEventListener('click',function(){
    /* les effets se règlent au chargement : on recharge la page, à la même hauteur */
    try{localStorage.setItem(LS,calme?'0':'1');sessionStorage.setItem('lcdm-fx',JSON.stringify({p:location.pathname,y:scrollY,m:calme?'on':'off'}));}catch(_){}
    location.reload();
  });
  function toast(txt){
    var t=el('<div class="cn-toast'+cls+'" role="status"></div>');t.textContent=txt;D.body.appendChild(t);
    setTimeout(function(){t.style.opacity='0';},2600);setTimeout(function(){t.remove();},3100);
  }
  (function(){
    var r=null;try{r=JSON.parse(sessionStorage.getItem('lcdm-fx')||'null');sessionStorage.removeItem('lcdm-fx');}catch(_){}
    if(!r||r.p!==location.pathname)return;
    var y=+r.y||0,remet=function(){if(Math.abs(scrollY-y)>4)scrollTo(0,y);};
    remet();addEventListener('load',function(){remet();setTimeout(remet,120);},{once:true});
    setTimeout(function(){toast(r.m==='off'?'Effets coupés. Le bouton en bas à gauche les rétablit.':'Effets rétablis.');},350);
  })();

  /* ---------- à droite : l'Oracle, c'est-à-dire le Ver ---------- */
  var ACC={
    putride:'Approche de la margelle. Je suis le Ver du baptistère, serviteur de Kobal. Les vampires ont leurs grands airs ; moi, leurs dessous. Parle-moi de la Créature, de ses disques ou de ce qui fermente au Vampirium.',
    cachot:'Baisse la voix. Je suis le Ver du baptistère. Ici, les murs ont plus de mémoire que les vivants : les prisonniers, les fonds, la Gazette… Et quelques reliques que je ne livrerai pas toutes mâchées.'
  };
  var SUG={
    putride:['Qui est ton maître ?','Pourquoi mêler le sacré et la merde ?','Quelle est la philosophie de la Créature ?','De Chyren à Confiteor','Qui est Madame Edwarda ?','Que fais-tu au Vampirium ?'],
    cachot:['Qui est Kavod TinkiWizkhi ?','Qui est Noo-Noo ?','Pourquoi PUANTEUR PUTRIDE est-il au cachot ?','Le fonds du Baron','La Gazette du Prisonnier','Les reliques cachées']
  };
  var ICO_OR='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M35 38a3 3 0 0 1-6 0a6 6 0 0 1 12 0a9 9 0 0 1-18 0a12 12 0 0 1 24 0a15 15 0 0 1-30 0C17 27 31 28 27 16"/><circle cx="26" cy="11" r="5.5" style="fill:currentColor"/><circle cx="27.8" cy="9.8" r="1.6" style="fill:#000;stroke:none"/></svg>';
  var ob=el('<button type="button" class="cn-b cn-or'+cls+'" aria-expanded="false" aria-controls="cn-oracle" aria-label="Le Ver, l’Oracle : questions sur le lore" title="Le Ver, l’Oracle : questions sur le lore">'+ICO_OR+'</button>');
  var pan=el('<section class="cn-p'+cls+'" id="cn-oracle" role="dialog" aria-labelledby="cn-ot" hidden>'
    +'<div class="cn-h"><div><b id="cn-ot">Le Ver</b><small>Une langue sous la margelle. Dialogue local, nourri des textes du site.</small></div><button type="button" class="cn-x" aria-label="Fermer l’Oracle">×</button></div>'
    +'<div class="cn-log" aria-live="polite"></div><div class="cn-sug"></div>'
    +'<form class="cn-f" autocomplete="off"><label class="cn-sr" for="cn-q">Ta question au Ver</label><input id="cn-q" type="text" maxlength="160" enterkeyhint="send" placeholder="Pose ta question…"><button type="submit" aria-label="Demander">➤</button></form>'
    +'</section>');
  var log=pan.querySelector('.cn-log'),sug=pan.querySelector('.cn-sug'),inp=pan.querySelector('input'),ouvert=false,hist=[];
  try{hist=JSON.parse(sessionStorage.getItem(SS+'-'+couche)||'[]');}catch(_){hist=[];}

  function garde(){try{sessionStorage.setItem(SS+'-'+couche,JSON.stringify(hist.slice(-16)));}catch(_){}}
  function bas(){log.scrollTop=log.scrollHeight;}
  function bulle(m,anim){
    var d=D.createElement('div');d.className='cn-m '+m.r;
    if(m.r==='q'){d.textContent=m.t;log.appendChild(d);bas();return;}
    log.appendChild(d);
    var corps=m.h;
    if(!anim||calme){d.innerHTML=corps;bas();return;}
    /* l'écriture à la main : le texte de la citation apparaît lettre à lettre, les liens à la fin */
    var tmp=D.createElement('div');tmp.innerHTML=corps;
    var noeuds=[],w=D.createTreeWalker(tmp,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode()))noeuds.push([n,n.nodeValue]);
    noeuds.forEach(function(x){x[0].nodeValue='';});
    d.appendChild(tmp);
    var total=noeuds.reduce(function(a,x){return a+x[1].length;},0),pas=Math.max(2,Math.ceil(total/70)),i=0,k=0;
    (function tape(){
      var r=pas;
      while(r>0&&i<noeuds.length){var x=noeuds[i],reste=x[1].length-x[0].nodeValue.length,p=Math.min(r,reste);x[0].nodeValue=x[1].slice(0,x[0].nodeValue.length+p);r-=p;if(x[0].nodeValue.length>=x[1].length)i++;}
      bas();if(i<noeuds.length&&++k<400)setTimeout(tape,16);else noeuds.forEach(function(x){x[0].nodeValue=x[1];});
    })();
  }
  function ajoute(m,anim){hist.push(m);garde();bulle(m,anim);}
  function suggestions(){
    sug.innerHTML='';
    SUG[couche].forEach(function(q){var b=D.createElement('button');b.type='button';b.textContent=q;b.addEventListener('click',function(){demande(q);});sug.appendChild(b);});
  }
  function ouvre(){
    if(ouvert)return;ouvert=true;pan.hidden=false;ob.setAttribute('aria-expanded','true');
    D.dispatchEvent(new CustomEvent('ver:dialogue',{detail:true}));
    if(!log.childNodes.length){
      if(!hist.length)hist.push({r:'a',h:esc(ACC[couche])});
      hist.forEach(function(m){bulle(m,false);});
    }
    suggestions();bas();
    if(matchMedia('(pointer:fine)').matches)setTimeout(function(){try{inp.focus({preventScroll:true});}catch(_){}},60);
  }
  function ferme(){if(!ouvert)return;ouvert=false;pan.hidden=true;ob.setAttribute('aria-expanded','false');D.dispatchEvent(new CustomEvent('ver:dialogue',{detail:false}));}
  ob.addEventListener('click',function(){ouvert?ferme():ouvre();});
  pan.querySelector('.cn-x').addEventListener('click',function(){ferme();ob.focus();});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&ouvert){ferme();ob.focus();}});
  D.addEventListener('pointerdown',function(e){if(ouvert&&!pan.contains(e.target)&&!ob.contains(e.target))ferme();},true);
  pan.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var q=inp.value.trim();if(q){inp.value='';demande(q);}});
  /* un lien de l'Oracle mène à sa page : il se referme (le mode putride change de page sans recharger) */
  log.addEventListener('click',function(e){if(e.target.closest('a'))setTimeout(ferme,30);});
  D.addEventListener('putride:page',ferme);

  /* ---------- les registres et la recherche ---------- */
  var KB=null,attente=null,occupeQuestion=false;
  var STOP=('a ai alors au aussi aux avait avec ca ce cela ces cest cet cette ci comme comment connais d dans de des dis dit donc du elle elles en es est et etaient etait ete etre eu fait faire fais il ils j je l la le les leur leurs lui m ma mais me meme mes moi mon n ne ni nos notre nous on ont ou par parle parler pas peu peut peux plus pour pourquoi qu quand que quel quelle quelles quels qui quoi raconte s sa sais savoir se ses si son sont sur t ta te tes toi ton tu un une vos votre vous y '
    +'est-ce dire veux voudrais aimerais explique expliquer cest qu\'est quest moi histoire bonjour salut merci stp svp sil plait quelle lien entre rapport sujet propos encore continue suite davantage developpe').split(' ');
  var STOPS={};STOP.forEach(function(w){STOPS[w]=1;});
  function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/[’'`]/g,' ').replace(/[^a-z0-9]+/g,' ').trim();}
  function rac(w){if(w.length>4)w=w.replace(/(es|s|x)$/,'');if(w.length>5)w=w.replace(/e$/,'');return w;}
  function mots(s,garder){var r=[];norm(s).split(' ').forEach(function(w){if(!w||(!garder&&(STOPS[w]||w.length<2)))return;r.push(rac(w));});return r;}
  function prepare(d){
    var P=d.p,E=d.e,df={},voc={},tot=0;
    var ent=E.map(function(e){
      var tf={},ws=mots(e[3]),tt={};
      ws.forEach(function(w){tf[w]=(tf[w]||0)+1;});
      mots(P[e[0]][0]+' '+e[1]).forEach(function(w){tt[w]=1;});
      Object.keys(tf).forEach(function(w){df[w]=(df[w]||0)+1;voc[w]=1;});
      Object.keys(tt).forEach(function(w){voc[w]=1;});
      tot+=ws.length;
      return {p:e[0],h:e[1],a:e[2],t:e[3],k:e[4],tf:tf,tt:tt,n:ws.length};
    });
    return {P:P,E:ent,df:df,voc:Object.keys(voc),avg:tot/Math.max(1,ent.length),N:ent.length};
  }
  function charge(){
    if(KB)return Promise.resolve(KB);
    if(attente)return attente;
    attente=fetch('/oracle-'+couche+'.json?v=3',{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error('Registres HTTP '+r.status);return r.json();}).then(function(d){
      if(!d||!Array.isArray(d.p)||!Array.isArray(d.e)||!d.e.length)throw new Error('Registres invalides');
      KB=prepare(d);return KB;
    }).catch(function(e){attente=null;console.error('Le Ver : chargement des registres impossible.',e);throw e;});
    return attente;
  }
  function idf(w){var n=KB.df[w]||0;return Math.log(1+(KB.N-n+.5)/(n+.5));}
  /* un mot de la question vaut ses formes proches dans les registres (Éphébito, Éphébitos…) */
  function variantes(w){
    if(KB.df[w]||w.length<4)return [[w,1]];
    var r=[];for(var i=0;i<KB.voc.length&&r.length<10;i++){var v=KB.voc[i];if(v.length>=4&&(v.indexOf(w)===0||(w.indexOf(v)===0&&v.length>=5)))r.push([v,.75]);}
    if(!r.length&&w.length>=5)KB.voc.some(function(v){if(proche(w,v))r.push([v,.65]);return r.length>=5;});
    return r.length?r:[[w,1]];
  }
  function proche(a,b){
    if(Math.abs(a.length-b.length)>1)return false;
    var i=0,j=0,ecarts=0;
    while(i<a.length&&j<b.length){
      if(a[i]===b[j]){i++;j++;continue;}
      if(++ecarts>1)return false;
      if(a.length===b.length){
        if(a[i]===b[j+1]&&a[i+1]===b[j]){i+=2;j+=2;}else{i++;j++;}
      }else if(a.length>b.length)i++;else j++;
    }
    return ecarts+(a.length-i)+(b.length-j)<=1;
  }
  function cherche(q){
    var qs=mots(q),vu={},termes=[];
    qs.forEach(function(w){if(vu[w])return;vu[w]=1;termes.push(variantes(w));});
    if(!termes.length)return [];
    var res=[];
    KB.E.forEach(function(e,ix){
      var s=0,touche=0,titre=0;
      termes.forEach(function(vs){
        var best=0,tb=0;
        vs.forEach(function(v){
          var w=v[0],f=e.tf[w]||0,I=idf(w),sc=0;
          if(f)sc=I*f*2.2/(f+1.2*(.25+.75*e.n/KB.avg))*v[1];
          if(e.tt[w]){tb=Math.max(tb,I*1.5*v[1]);}
          if(sc>best)best=sc;
        });
        if(best||tb){touche++;}
        if(tb)titre++;
        s+=best+tb;
      });
      if(!s||touche<Math.min(2,termes.length))return;
      s*=1+.6*(touche-1);
      if(e.k===1&&titre)s*=1.45;
      if(e.k===2)s*=.6;
      res.push({e:e,s:s,ix:ix,touche:touche});
    });
    res.sort(function(a,b){return b.s-a.s;});
    return res;
  }
  function coupe(t,max){
    if(t.length<=max)return t;
    var c=t.slice(0,max),p=Math.max(c.lastIndexOf('. '),c.lastIndexOf(' ; '),c.lastIndexOf(' : '),c.lastIndexOf('! '),c.lastIndexOf('? '));
    return (p>max*.45?c.slice(0,p+1):c.slice(0,c.lastIndexOf(' ')))+' …';
  }
  function lien(e){var P=KB.P[e.p];return P[1]+(e.a||'');}
  function nom(e){var P=KB.P[e.p];return P[0]+(e.h?' · '+e.h:'');}
  var VOIX=[
    {id:'kobal',test:/\b(kobal|ton maitre|qui te commande|qui sers tu|qui es tu|presente toi|possess\w*|possed\w*)\b/,
      t:'Je sers Kobal, pas les beaux messieurs à crocs. Mon maître possède la Créature et Madame Edwarda. Il dirige les théâtres de l’Enfer ; moi, je travaille sous la scène. Il sait la farce perdue, mais tient à choisir qui glissera dans la merde. Ris des dignitaires tant que tu veux : de lui, beaucoup moins.',
      sources:['/mode-putride/bestiaire/ver/']},
    {id:'chaos',test:/\b(crime fecal|chaos|que fais tu|ton role|pourquoi.*vampirium)\b/,
      t:'Je hante le Vampirium. Je ramasse une rancœur, je la glisse sous une autre soutane, puis je laisse lever. Ce chaos a poussé la Créature au crime fécal. Les vampires se croient les maîtres de cérémonie ; Kobal leur a distribué les rôles sans les prévenir.',
      sources:['/mode-putride/bestiaire/ver/']},
    {id:'sacre',test:/\b(sacre|blaspheme|scatolog\w*|merde|trivial|profan\w*)\b/,
      t:'Tu voudrais séparer l’encens de la merde ? Voilà qui arrangerait les vampires. Chez la Créature, le sacré et le grotesque se heurtent sans s’annuler. La ferveur reste prise dans ce qu’elle profane. Dans Confiteor, le désir et la culpabilité retournent la confession contre celui qui parle. Moi, je rampe dans cette fissure.',
      sources:['/mode-putride/bestiaire/createur/','/mode-putride/discographie/confiteor/']},
    {id:'philosophie',test:/\b(philosoph\w*|psycholog\w*|comprend\w*|comprends|sens de (mon|son|l) (art|oeuvre)|demarche|contradiction\w*|partisan\w*|politique)\b/,
      t:'Je lis les œuvres, pas l’intérieur de ton crâne. La Créature garde les signes d’autorité pour en suspendre le sérieux : voilà le carnaval. Sa critique vise le partisanisme, quand un camp devient une identité et remplace la discussion. Sa foi nourrit aussi son conflit avec ceux qui prétendent en détenir les clefs. Le masque expose ces contradictions ; il ne les range pas dans une doctrine bien propre.',
      sources:['/biographie/','/mode-putride/bestiaire/createur/']},
    {id:'parcours',test:/\b(parcours|evolution|chronolog\w*)\b|\bchyren\b.*\bconfiteor\b|\bconfiteor\b.*\b(?:chyren|odium)\b/,
      t:'D’abord les signes, ensuite le procès. Dans Chyren, la Fourolle ouvre à la Créature le monde des prophéties. Après le Panvampirium, Confiteor ramène le combat dans la conscience : désir, foi, culpabilité. In Odium Fidei repart de La Chute. Il ne suffit plus de demander pardon ; il faut se relever. J’aime beaucoup ce moment où les beaux costumes craquent.',
      sources:['/mode-putride/discographie/chyren/','/mode-putride/discographie/confiteor/','/mode-putride/in-odium-fidei/']},
    {id:'art',test:/\b(esthetique|influence\w*|style|musical|art|oeuvre|masque|personnage)\b/,
      t:'Du velours noir, des machines et une vieille cérémonie qui tourne mal. La Créature chante, compose et met ses clips en scène. Son opéra gothique électronique catholique traditionnel fait se rencontrer carnaval, liturgie et romantisme noir. Le masque relie les disques aux rues de Rouen ; ce n’est pas un déguisement posé après la musique.',
      sources:['/mode-putride/bestiaire/createur/']},
    {id:'rouen',test:/\b(pourquoi rouen|rouen.*(?:important|oeuvre|mental)|normandie.*(?:art|oeuvre))\b/,
      t:'Rouen n’est pas une toile peinte derrière la Créature. Ses rues, ses hauteurs et ses légendes lui donnent de quoi raconter sa chute. Dans Confiteor, la côte devient une montée vers l’expiation, la Gargouille un double ou un juge. Moi, je préfère les conduits : on y entend tout sans saluer personne.',
      sources:['/mode-putride/discographie/confiteor/','/mode-putride/territoire/']}
  ];
  function precedent(){
    for(var i=hist.length-1;i>=0;i--)if(hist[i].r==='a'&&hist[i].sujet)return hist[i];
    return null;
  }
  function sourcesVoix(v){
    return v.sources.map(function(url){
      var p=KB.P.find(function(p){return p[1]===url;});
      return p?'<a href="'+esc(url)+'">'+esc(p[0])+'</a>':'';
    }).filter(Boolean).join(' · ');
  }
  function parole(q){
    var n=norm(q);
    if(/^(bonjour|salut|bonsoir|coucou|hello)( le ver| ver)?$/.test(n))return {r:'a',h:esc(ACC[couche])};
    if(/^(merci|merci beaucoup|d accord|ok|compris|au revoir|bonne nuit)$/.test(n))return {r:'a',h:'Garde tes remerciements au sec. Je retourne sous la margelle.'};
    if(couche!=='putride')return null;
    var v=VOIX.find(function(v){return v.test.test(n);});
    /* Un nom ou un titre précis prime sur une réponse thématique générale. */
    if(v&&/^(art|sacre)$/.test(v.id)&&/\b(edwarda|epheb\w*|vampirix|chyren|confiteor|odium|kobal)\b/.test(n))return null;
    if(!v)return null;
    return {r:'a',h:esc(v.t)+'<span class="va">Les traces : '+sourcesVoix(v)+'</span>',sujet:v.sources[0],voix:v.id};
  }
  function repond(q){
    var p=precedent(),n=norm(q),suiteDemandee=/^(et )?(ensuite|apres|continue|la suite|encore|developpe|dis m en plus|pourquoi|comment ca|et alors)$/.test(n);
    var oral=parole(q);if(oral&&!suiteDemandee)return oral;
    var contextuel=p&&(suiteDemandee||/^(et (il|elle|son|sa|ses|lui)|pourquoi (il|elle)|ses |son |sa )/.test(n));
    var pageP=contextuel?KB.P.findIndex(function(x){return x[1]===p.sujet;}):-1;
    var requete=q.replace(/\bmme\b/gi,'Madame');
    if(/\b(tu|toi|ton|tes)\b/.test(n)&&couche==='putride')requete+=' Ver baptistère';
    if(pageP>=0)requete+=' '+KB.P[pageP][0];
    var r=cherche(requete);
    if(pageP>=0){
      r=r.filter(function(x){return x.e.p===pageP&&x.ix!==p.ix;});
      var details=mots(q);
      if(details.length&&!suiteDemandee)r=r.filter(function(x){
        return details.some(function(w){return variantes(w).some(function(v){return !!x.e.tf[v[0]];});});
      });
      if(suiteDemandee&&p.ix!=null)r.sort(function(a,b){return (a.ix>p.ix?0:1)-(b.ix>p.ix?0:1)||a.ix-b.ix;});
    }
    if(!r.length||r[0].s<2.2){
      return {r:'a',h:'Je ne vais pas te vendre de la vase pour une révélation. Je n’ai pas de passage assez sûr pour te répondre. Donne-moi un nom, un lieu ou un disque ; si tu reprends une question, précise lequel.'};
    }
    var b=r[0],e=b.e,autres=[],pages={};pages[e.p]=1;
    /* la suite immédiate du même passage, si elle répond aussi */
    var suite=KB.E[b.ix+1],txt=coupe(e.t,650);
    if(txt.length<170&&suite&&suite.p===e.p&&suite.h===e.h&&suite.k!==2){
      /* si la suite redit déjà le chapeau (résumé puis texte), on ne garde que la suite */
      var a=mots(e.t),dans={},com=0;mots(suite.t).forEach(function(w){dans[w]=1;});a.forEach(function(w){if(dans[w])com++;});
      txt=coupe(com>=a.length*.6?suite.t:e.t+' '+suite.t,650);
    }
    for(var i=1;i<r.length&&autres.length<2;i++){if(!pages[r[i].e.p]&&r[i].s>b.s*.42){pages[r[i].e.p]=1;autres.push(r[i].e);}}
    var amorces=['J’ai trouvé cette trace sous la margelle.','Écoute ce que les murs ont gardé.','Voilà ce qui remonte de la vase.'];
    var h=amorces[hist.filter(function(m){return m.r==='q';}).length%amorces.length]+'<span class="src">'+esc(nom(e))+'</span><q>'+esc(txt)+'</q><br><a class="lire" href="'+esc(lien(e))+'">Suivre la trace →</a>';
    if(autres.length)h+='<span class="va">Voir aussi : '+autres.map(function(o){return '<a href="'+esc(lien(o))+'">'+esc(nom(o))+'</a>';}).join(' · ')+'</span>';
    return {r:'a',h:h,sujet:KB.P[e.p][1],ix:b.ix};
  }
  /* ---------- les reliques cachées des cachots : une énigme par relique, dans l'ordre de la procession ---------- */
  var RELIQUES=[
    ['rince','Ni vin de messe ni eau bénite : les miséreux me boivent au pied d’une fontaine, sans calice. Au portail, sur ta droite, on m’a oublié.'],
    ['miroir','Je montre tout, sauf ceux qui ont les dents longues. Au portail, longe le mur de gauche et penche-toi : je suis plus bas que tes yeux.'],
    ['rat','Il a tout vu avant toi et le répète à qui veut l’entendre. Il loge au portail, tout en bas, côté droit, là où l’on ne descend jamais assez.'],
    ['plume','J’ai quitté le blason pour écrire des aveux et des dénonciations. Dans le bas-côté nord, lève les yeux vers la droite.'],
    ['escarpin','Un talon sans pied, qui scintille encore. Quelqu’un a fui le bas-côté nord à cloche-pied : cherche à gauche.'],
    ['lunettes','Deux lunes noires et cerclées, à personne et pourtant de la famille. Dans le bas-côté nord, descends, puis regarde à droite.'],
    ['rose','Une fleur en deuil, qui ne pique pas, posée sans signature. Le chœur la garde, en haut, à droite.'],
    ['gaufre','Quadrillée comme une grille de cachot, tachée de rouge, venue de la plantation. Le chœur la cache sur sa gauche.'],
    ['boule','Mille facettes pour un seul mort : même ici, on danse. À l’abside, près de la tombe, cherche à droite.']
  ];
  function enigme(){
    var pris=[],i=0;
    try{pris=JSON.parse(localStorage.getItem('lcm-reliques')||'[]');}catch(_){}
    if(!Array.isArray(pris))pris=[];
    var reste=RELIQUES.filter(function(r){return pris.indexOf(r[0])<0;}),n=RELIQUES.length-reste.length;
    if(!reste.length)return {r:'a',h:'<span class="src">Les reliques cachées</span>'+esc('Les neuf sont à toi. Le vitrail t’a reconnu : tu es une icône, et le Ver n’a plus d’énigme à te donner.')};
    /* chaque nouvelle question passe à une autre relique manquante */
    try{i=+sessionStorage.getItem(SS+'-enigme')||0;sessionStorage.setItem(SS+'-enigme',String(i+1));}catch(_){}
    var r=reste[i%reste.length];
    return {r:'a',h:'<span class="src">Énigme du Ver</span><q>'+esc(r[1])+'</q><span class="va">Reliques trouvées : '+n+' / '+RELIQUES.length+'. '+(reste.length>1?'Redemande-moi : j’en garde d’autres.':'C’est la dernière.')+'</span>'};
  }
  function demande(q){
    if(occupeQuestion){toast('Laisse-moi finir cette réponse avant de reprendre.');return;}
    occupeQuestion=true;pan.querySelector('button[type="submit"]').disabled=true;
    ajoute({r:'q',t:q},false);
    var att=D.createElement('div');att.className='cn-m a cn-dots';att.setAttribute('aria-label','Le Ver consulte les registres');att.innerHTML='<i></i><i></i><i></i>';log.appendChild(att);bas();
    var t0=performance.now();
    var reliques=couche==='cachot'&&/reliq/.test(norm(q));
    (reliques?Promise.resolve(null):charge()).then(function(kb){
      var m=couche==='cachot'&&/reliq/.test(norm(q))?enigme():kb?repond(q):{r:'a',h:'Les registres sont hors d’atteinte pour l’instant. Réessaie dans un moment.'};
      setTimeout(function(){att.remove();ajoute(m,true);occupeQuestion=false;pan.querySelector('button[type="submit"]').disabled=false;},Math.max(0,(calme?0:420)-(performance.now()-t0)));
    }).catch(function(){
      att.remove();ajoute({r:'a',h:'Les registres sont hors d’atteinte. Je ne peux pas les consulter : réessaie dans un moment.'},false);
      occupeQuestion=false;pan.querySelector('button[type="submit"]').disabled=false;
    });
  }

  function pose(){
    D.body.appendChild(fx);D.body.appendChild(ob);D.body.appendChild(pan);D.dispatchEvent(new Event('coins:pret'));
    if(couche==='cachot'){
      var ver=D.createElement('script');ver.src='/ver.js?v=6';
      ver.onload=function(){window.Ver.go();};
      ver.onerror=function(){console.error('Le Ver : animation indisponible. Le dialogue reste accessible.');};
      D.head.appendChild(ver);
    }
  }
  if(D.body)pose();else D.addEventListener('DOMContentLoaded',pose);
  window.Coins={ouvre:ouvre,ferme:ferme,calme:function(){return calme;},cherche:function(q){return KB?cherche(q).slice(0,5).map(function(r){return [r.s.toFixed(2),nom(r.e),r.e.t.slice(0,80)];}):null;},charge:charge};
})();
