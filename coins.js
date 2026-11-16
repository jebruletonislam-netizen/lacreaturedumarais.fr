/* Les deux coins du bas, dans le mode putride et dans les cachots.
   À gauche : couper (ou rétablir) les effets ; le choix est gardé, et vaut comme le réglage « moins d'animations » de l'appareil.
   À droite : l'Oracle, qui répond aux questions sur le lore. Il ne répond qu'avec les textes du site (/oracle-*.json, tirés des pages
   par _outils/oracle.py) et montre toujours où lire la suite : il n'invente rien. Chaque couche n'interroge que ses propres registres. */
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

  /* ---------- à droite : l'Oracle ---------- */
  var ACC={
    putride:'Je suis l’Oracle du mode putride. Interroge-moi sur le bestiaire, le territoire, les disques ou les méfaits : je te réponds avec les registres, et je te montre où lire la suite.',
    cachot:'Je suis l’Oracle des cachots. Interroge-moi sur les prisonniers, les fonds d’archives ou la Gazette : je ne réponds qu’avec ce que gardent les registres.'
  };
  var SUG={
    putride:['Qui est Éphébito ?','Qu’est-ce que le Vampirium ?','Qui est Vampirix ?','La Gargouille de Rouen','Le Ver du baptistère','De quoi parle Chyren ?'],
    cachot:['Qui est Kavod TinkiWizkhi ?','Qui est Noo-Noo ?','Pourquoi PUANTEUR PUTRIDE est-il au cachot ?','Le fonds du Baron','La Gazette du Prisonnier']
  };
  var ICO_OR='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5C21 15 13 27 13 40v18h38V40C51 27 43 15 32 5z"/><path d="M19 39q13-11 26 0q-13 11-26 0z"/><circle cx="32" cy="39" r="3.6" style="fill:currentColor"/></svg>';
  var ob=el('<button type="button" class="cn-b cn-or'+cls+'" aria-expanded="false" aria-controls="cn-oracle" aria-label="L’Oracle : questions sur le lore" title="L’Oracle : questions sur le lore">'+ICO_OR+'</button>');
  var pan=el('<section class="cn-p'+cls+'" id="cn-oracle" role="dialog" aria-labelledby="cn-ot" hidden>'
    +'<div class="cn-h"><div><b id="cn-ot">L’Oracle</b><small>Il ne répond qu’avec ce que disent les registres du site.</small></div><button type="button" class="cn-x" aria-label="Fermer l’Oracle">×</button></div>'
    +'<div class="cn-log" aria-live="polite"></div><div class="cn-sug"></div>'
    +'<form class="cn-f" autocomplete="off"><label class="cn-sr" for="cn-q">Ta question à l’Oracle</label><input id="cn-q" type="text" maxlength="160" enterkeyhint="send" placeholder="Pose ta question…"><button type="submit" aria-label="Demander">➤</button></form>'
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
    if(!log.childNodes.length){
      if(!hist.length)hist.push({r:'a',h:esc(ACC[couche])});
      hist.forEach(function(m){bulle(m,false);});
    }
    suggestions();bas();charge();
    if(matchMedia('(pointer:fine)').matches)setTimeout(function(){try{inp.focus({preventScroll:true});}catch(_){}},60);
  }
  function ferme(){if(!ouvert)return;ouvert=false;pan.hidden=true;ob.setAttribute('aria-expanded','false');}
  ob.addEventListener('click',function(){ouvert?ferme():ouvre();});
  pan.querySelector('.cn-x').addEventListener('click',function(){ferme();ob.focus();});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&ouvert){ferme();ob.focus();}});
  D.addEventListener('pointerdown',function(e){if(ouvert&&!pan.contains(e.target)&&!ob.contains(e.target))ferme();},true);
  pan.querySelector('form').addEventListener('submit',function(e){e.preventDefault();var q=inp.value.trim();if(q){inp.value='';demande(q);}});
  /* un lien de l'Oracle mène à sa page : il se referme (le mode putride change de page sans recharger) */
  log.addEventListener('click',function(e){if(e.target.closest('a'))setTimeout(ferme,30);});
  D.addEventListener('putride:page',ferme);

  /* ---------- les registres et la recherche ---------- */
  var KB=null,attente=null;
  var STOP=('a ai alors au aussi aux avait avec ca ce cela ces cest cet cette ci comme comment connais d dans de des dis dit donc du elle elles en es est et etaient etait ete etre eu fait faire fais il ils j je l la le les leur leurs lui m ma mais me meme mes moi mon n ne ni nos notre nous on ont ou par parle parler pas peu peut peux plus pour pourquoi qu quand que quel quelle quelles quels qui quoi raconte s sa sais savoir se ses si son sont sur t ta te tes toi ton tu un une vos votre vous y '
    +'est-ce dire veux voudrais aimerais explique expliquer cest qu\'est quest moi histoire bonjour salut merci stp svp sil plait').split(' ');
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
    if(KB||attente)return attente;
    attente=fetch('/oracle-'+couche+'.json?v=2',{credentials:'same-origin'}).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(d){KB=prepare(d);return KB;}).catch(function(){attente=null;return null;});
    return attente;
  }
  function idf(w){var n=KB.df[w]||0;return Math.log(1+(KB.N-n+.5)/(n+.5));}
  /* un mot de la question vaut ses formes proches dans les registres (Éphébito, Éphébitos…) */
  function variantes(w){
    if(KB.df[w]||w.length<4)return [[w,1]];
    var r=[];for(var i=0;i<KB.voc.length&&r.length<10;i++){var v=KB.voc[i];if(v.length>=4&&(v.indexOf(w)===0||(w.indexOf(v)===0&&v.length>=5)))r.push([v,.75]);}
    return r.length?r:[[w,1]];
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
      if(!s)return;
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
  function repond(q){
    var r=cherche(q);
    if(!r.length||r[0].s<2.2){
      return {r:'a',h:'Les registres restent muets sur ce point. Essaie un nom, un lieu ou un titre : les suggestions ci-dessous sont un bon début.'};
    }
    var b=r[0],e=b.e,autres=[],pages={};pages[e.p]=1;
    /* la suite immédiate du même passage, si elle répond aussi */
    var suite=KB.E[b.ix+1],txt=coupe(e.t,430);
    if(txt.length<170&&suite&&suite.p===e.p&&suite.h===e.h&&suite.k!==2){
      /* si la suite redit déjà le chapeau (résumé puis texte), on ne garde que la suite */
      var a=mots(e.t),dans={},com=0;mots(suite.t).forEach(function(w){dans[w]=1;});a.forEach(function(w){if(dans[w])com++;});
      txt=coupe(com>=a.length*.6?suite.t:e.t+' '+suite.t,430);
    }
    for(var i=1;i<r.length&&autres.length<2;i++){if(!pages[r[i].e.p]&&r[i].s>b.s*.42){pages[r[i].e.p]=1;autres.push(r[i].e);}}
    var h='<span class="src">'+esc(nom(e))+'</span><q>'+esc(txt)+'</q><br><a class="lire" href="'+esc(lien(e))+'">Lire la suite →</a>';
    if(autres.length)h+='<span class="va">Voir aussi : '+autres.map(function(o){return '<a href="'+esc(lien(o))+'">'+esc(nom(o))+'</a>';}).join(' · ')+'</span>';
    return {r:'a',h:h};
  }
  function demande(q){
    ajoute({r:'q',t:q},false);
    var att=D.createElement('div');att.className='cn-m a cn-dots';att.setAttribute('aria-label','L’Oracle consulte les registres');att.innerHTML='<i></i><i></i><i></i>';log.appendChild(att);bas();
    var t0=performance.now();
    Promise.resolve(charge()).then(function(kb){
      var m=kb?repond(q):{r:'a',h:'Les registres sont hors d’atteinte pour l’instant. Réessaie dans un moment.'};
      setTimeout(function(){att.remove();ajoute(m,true);},Math.max(0,(calme?0:420)-(performance.now()-t0)));
    });
  }

  function pose(){D.body.appendChild(fx);D.body.appendChild(ob);D.body.appendChild(pan);}
  if(D.body)pose();else D.addEventListener('DOMContentLoaded',pose);
  window.Coins={ouvre:ouvre,ferme:ferme,calme:function(){return calme;},cherche:function(q){return KB?cherche(q).slice(0,5).map(function(r){return [r.s.toFixed(2),nom(r.e),r.e.t.slice(0,80)];}):null;},charge:charge};
})();
