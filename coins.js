/* Les deux coins du bas, dans le mode putride et dans les cachots.
   À gauche : couper (ou rétablir) les effets ; le choix est gardé, et vaut comme le réglage « moins d'animations » de l'appareil.
   À droite : le Ver. Dialogue local par défaut ; modèle distant seulement après consentement.
   Les registres /oracle-*.json, tirés des pages par _outils/oracle.py, servent aux deux dialogues.
   Les deux couches connaissent les textes publics, putrides et les cachots. Dans les cachots,
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
  +'.cn-ai{flex:none;padding:6px 12px;border-bottom:1px solid var(--l);font:12px/1.4 system-ui,sans-serif;max-height:165px;max-height:min(165px,25dvh);overflow:auto}.cn-ai[hidden]{display:none}'
  +'.cn-ai-settings .cn-sug{display:none}.cn-ai-settings .cn-log{min-height:50px}'
  +'.cn-ai summary{cursor:pointer;color:var(--c2)}.cn-ai p{margin:8px 0}.cn-ai a{color:var(--c2)}'
  +'.cn-ai button{font:inherit;border:1px solid var(--l);border-radius:6px;padding:6px;margin:2px;background:#000;color:var(--t);cursor:pointer}.cn-ai button[hidden]{display:none}'
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
    putride:['Comment vas-tu ?','Qu’est-ce qui te fait rire ?','Quelle est la philosophie de la Créature ?','Les témoignages sur Vampirix','Qui est Madame Edwarda ?','Par quel album commencer ?'],
    cachot:['Comment vas-tu ?','Qui est Kavod TinkiWizkhi ?','Qui est Noo-Noo ?','Pourquoi PUANTEUR PUTRIDE est-il au cachot ?','La Gazette du Prisonnier','Les reliques cachées']
  };
  var ICO_OR='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M35 38a3 3 0 0 1-6 0a6 6 0 0 1 12 0a9 9 0 0 1-18 0a12 12 0 0 1 24 0a15 15 0 0 1-30 0C17 27 31 28 27 16"/><circle cx="26" cy="11" r="5.5" style="fill:currentColor"/><circle cx="27.8" cy="9.8" r="1.6" style="fill:#000;stroke:none"/></svg>';
  var ob=el('<button type="button" class="cn-b cn-or'+cls+'" aria-expanded="false" aria-controls="cn-oracle" aria-label="Le Ver, l’Oracle : questions sur le lore" title="Le Ver, l’Oracle : questions sur le lore">'+ICO_OR+'</button>');
  var pan=el('<section class="cn-p'+cls+'" id="cn-oracle" role="dialog" aria-labelledby="cn-ot" hidden>'
    +'<div class="cn-h"><div><b id="cn-ot">Le Ver</b><small>Serviteur de Kobal. Dialogue local, sans IA générative.</small></div><button type="button" class="cn-x" aria-label="Fermer l’Oracle">×</button></div>'
    +'<details class="cn-ai" hidden><summary>Conversation IA et confidentialité</summary>'
    +'<p>Sur ton accord, Cloudflare reçoit tes messages, jusqu’à six échanges IA précédents et des extraits du site. Aucun modèle à télécharger. L’IA peut se tromper ; quota gratuit partagé. N’envoie rien de confidentiel. <a href="/mentions-legales/#dialogue-ver">Détails</a>.</p>'
    +'<button type="button" class="cn-ai-on">J’accepte, activer l’IA</button><button type="button" class="cn-ai-off" hidden>Revenir au dialogue local</button><button type="button" class="cn-ai-clear">Effacer cet échange</button></details>'
    +'<div class="cn-log" aria-live="polite"></div><div class="cn-sug"></div>'
    +'<form class="cn-f" autocomplete="off"><label class="cn-sr" for="cn-q">Ta question au Ver</label><input id="cn-q" type="text" maxlength="2000" enterkeyhint="send" placeholder="Parle au Ver…"><button type="submit" aria-label="Demander">➤</button></form>'
    +'</section>');
  var log=pan.querySelector('.cn-log'),sug=pan.querySelector('.cn-sug'),inp=pan.querySelector('input'),ouvert=false,hist=[];
  try{hist=JSON.parse(sessionStorage.getItem(SS+'-'+couche)||'[]');}catch(_){hist=[];}
  var iaURL='',iaActive=false,iaConfig=null,iaRequete=null,iaOptions=pan.querySelector('.cn-ai');
  iaOptions.addEventListener('toggle',function(){pan.classList.toggle('cn-ai-settings',iaOptions.open);});
  function majIA(){
    pan.querySelector('.cn-h small').textContent=iaActive?
      'Serviteur de Kobal. Conversation IA via Cloudflare ; réponses à vérifier.':
      'Serviteur de Kobal. Dialogue local, sans IA générative.';
    iaOptions.querySelector('.cn-ai-on').hidden=iaActive;
    iaOptions.querySelector('.cn-ai-off').hidden=!iaActive;
  }
  function configureIA(){
    if(iaConfig)return;
    var controleur=new AbortController(),timer=setTimeout(function(){controleur.abort();},10000);
    iaConfig=fetch('/ver-ia.json?v=1',{cache:'no-store',credentials:'same-origin',signal:controleur.signal}).then(function(r){
      if(!r.ok)throw new Error('Configuration IA HTTP '+r.status);
      return r.json();
    }).then(function(c){
      if(!c||typeof c.url!=='string')throw new Error('Configuration IA invalide');
      if(!c.url)return;
      var u=new URL(c.url);
      if(u.protocol!=='https:'||u.username||u.password||u.pathname!=='/chat'||u.search||u.hash)throw new Error('Adresse IA invalide');
      iaURL=u.href;iaOptions.hidden=false;
      try{iaActive=sessionStorage.getItem(SS+'-ia')===iaURL;}catch(e){console.warn('Le Ver : consentement non restauré.');}
      majIA();
    }).catch(function(e){
      iaConfig=null;console.error('Le Ver : configuration IA inaccessible.',e);
      pan.querySelector('.cn-h small').textContent='IA inaccessible. Le dialogue local reste disponible.';
    }).finally(function(){clearTimeout(timer);});
  }
  iaOptions.querySelector('.cn-ai-on').addEventListener('click',function(){
    if(occupeQuestion){toast('Attends la fin de cette réponse.');return;}
    iaActive=true;
    try{sessionStorage.setItem(SS+'-ia',iaURL);}catch(e){console.warn('Le Ver : consentement non mémorisé.');toast('Accord valable sur cette page seulement.');}
    majIA();iaOptions.open=false;toast('Conversation IA activée. Les échanges restent limités à cette session.');
  });
  iaOptions.querySelector('.cn-ai-off').addEventListener('click',function(){
    iaActive=false;
    if(iaRequete)iaRequete.controleur.abort();
    try{sessionStorage.removeItem(SS+'-ia');}catch(e){console.warn('Le Ver : retrait du consentement non mémorisé.');toast('Retrait valable sur cette page seulement.');}
    majIA();iaOptions.open=false;toast('Dialogue local : aucun nouvel échange envoyé à l’IA.');
  });
  iaOptions.querySelector('.cn-ai-clear').addEventListener('click',function(){
    if(occupeQuestion){toast('Attends la fin de la réponse, ou désactive l’IA pour l’arrêter.');return;}
    var efface=true;
    try{sessionStorage.removeItem(SS+'-'+couche);}catch(e){efface=false;console.warn('Le Ver : stockage de l’historique inaccessible.');}
    hist=[];garde();log.textContent='';ajoute({r:'a',h:esc(ACC[couche])},false);
    toast(efface?'Historique de cette couche effacé dans cet onglet.':'Historique visible effacé, mais le stockage de cet onglet est inaccessible.');
  });

  function garde(){hist=hist.slice(-48);try{sessionStorage.setItem(SS+'-'+couche,JSON.stringify(hist));}catch(_){}}
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
  function ajoute(m,anim){hist.push(m);garde();bulle(m,anim);if(m.r==='a')suggestions();}
  function suggestions(){
    sug.innerHTML='';
    var p=precedent(),choix=p&&p.dialogue?['Et toi ?','Pourquoi ?','Qui est ton maître ?']:
      p&&p.sujet?['Dis-m’en plus','Quelles sont tes sources ?','Parlons d’autre chose']:SUG[couche];
    choix.forEach(function(q){var b=D.createElement('button');b.type='button';b.textContent=q;b.addEventListener('click',function(){demande(q);});sug.appendChild(b);});
  }
  function ouvre(){
    if(ouvert)return;ouvert=true;pan.hidden=false;ob.setAttribute('aria-expanded','true');
    configureIA();
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
    +'est-ce dire veux voudrais aimerais explique expliquer cest qu\'est quest moi histoire bonjour salut merci stp svp sil plait quelle lien entre rapport sujet propos encore continue suite davantage developpe raconte detail details savoir pense penses avis album disque film clip morceau titre groupe').split(' ');
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
    /* les surnoms d'une fiche désignent son personnage, mais seulement à l'identique (« sermons » n'est pas Sermions) */
    var noms=[],surnoms={};
    E.forEach(function(e){
      if(e[1]!=='Surnom')return;
      String(e[3]).replace(/^Surnom\s*:\s*/,'').replace(/\([^)]*\)/g,'').split(/\s*[·\/]\s*/).forEach(function(s){
        s=norm(s);if(s.length>=3)(surnoms[e[0]]=surnoms[e[0]]||[]).push(s);
      });
    });
    /* un surnom d'un seul mot vaut le titre de la fiche (« JPH » touche tous les passages de Jean-Pierre Herlant) */
    ent.forEach(function(e){
      (surnoms[e.p]||[]).forEach(function(s){if(s.indexOf(' ')<0)e.tt[rac(s)]=1;});
    });
    P.forEach(function(p,i){
      if(/^Repère /.test(p[0]))return;
      if(!/^\/(?:mode-putride\/bestiaire|mode-putride\/discographie|cachot)\/[^/]+\/$/.test(p[1]))return;
      if(/\/(?:archives|respects)\/$/.test(p[1]))return;
      var slug=p[1].split('/').filter(Boolean).pop(),alias=[norm(slug),norm(p[0])];
      if(slug==='createur')alias=['la creature','creature du marais','cul pointu','tancrede'];
      if(slug==='ver')alias=['le ver','ver du baptistere'];
      if(slug==='kavod-tinkiwizkhi')alias.push('kavod');
      if(slug==='puanteur-putride')alias.push('puanteur');
      noms.push({p:i,alias:alias,exact:surnoms[i]||[]});
    });
    return {P:P,E:ent,revision:d.revision,df:df,voc:Object.keys(voc),noms:noms,avg:tot/Math.max(1,ent.length),N:ent.length};
  }
  function charge(){
    if(KB)return Promise.resolve(KB);
    if(attente)return attente;
    var controleur=new AbortController(),timer=setTimeout(function(){controleur.abort();},12000);
    attente=fetch('/oracle-'+couche+'.json?v=13',{credentials:'same-origin',signal:controleur.signal}).then(function(r){if(!r.ok)throw new Error('Registres HTTP '+r.status);return r.json();}).then(function(d){
      if(!d||!Array.isArray(d.p)||!Array.isArray(d.e)||!d.e.length||
        !d.p.every(function(p){return Array.isArray(p)&&typeof p[0]==='string'&&typeof p[1]==='string'&&/^\/(?!\/)/.test(p[1]);})||
        !d.e.every(function(e){return Array.isArray(e)&&Number.isInteger(e[0])&&d.p[e[0]]&&typeof e[1]==='string'&&typeof e[2]==='string'&&typeof e[3]==='string';}))throw new Error('Registres invalides');
      KB=prepare(d);return KB;
    }).catch(function(e){attente=null;console.error('Le Ver : chargement des registres impossible.',e);throw e;}).finally(function(){clearTimeout(timer);});
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
  var SYNONYMES=[
    ['accusation','temoignage','emprise'],['temoin','temoignage'],['soeur','soeurs'],
    ['parent','mere','pere','enfant'],['enfant','fils','fille'],['mari','epoux','compagnon'],
    ['foi','croyance'],['pouvoir','autorite'],['musique','album','disque'],
    ['prison','cachot'],['farce','humour','rire'],['philosophie','demarche','partisanisme'],
    ['peine','condamnation','sursis'],['dossier','presse','piece'],['annee','date','parution'],
    ['juge','jugee','jugement','proces','tribunal','verdict','prevenu','coupable'],['creature','tancrede'],
    ['hors','dehors'],['surnom','surnomme','appelle','alias','pseudo']
  ];
  function termesDe(q){
    var vu={},termes=[];
    mots(q).forEach(function(w){
      if(vu[w])return;vu[w]=1;
      var vs=variantes(w);
      SYNONYMES.forEach(function(g){
        var racines=g.map(rac);
        if(racines.indexOf(w)>=0)racines.forEach(function(x){if(x!==w)vs.push([x,.45]);});
      });
      termes.push(vs);
    });
    return termes;
  }
  function cherche(q){
    var termes=termesDe(q);
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
      if(e.k===3)s*=.85;
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
    {id:'amitie',test:/\b(tes amis|ton ami|ton amie|amitie|copain)\b|\bami\w*\b.*\bgargouille\b|\bgargouille\b.*\bami\w*\b/,
      t:'La Gargouille de Rouen est mon amie. Ne confonds pas : Kobal est mon maître, elle est mon amie. Je peux avoir mes fidélités sans distribuer à tout le monde un fauteuil de directeur.',
      sources:['/mode-putride/bestiaire/ver/','/mode-putride/bestiaire/gargouille/']},
    {id:'kobal',test:/\b(kobal|ton maitre|qui te commande|qui sers tu|qui es tu|presente toi|possess\w*|possed\w*)\b/,
      t:'Je sers Kobal, pas les beaux messieurs à crocs. Mon maître possède la Créature et Madame Edwarda. Il dirige les théâtres de l’Enfer ; moi, je travaille sous la scène. Il sait la farce perdue, mais tient à choisir qui glissera dans la merde. Ris des dignitaires tant que tu veux : de lui, beaucoup moins.',
      sources:['/mode-putride/bestiaire/ver/']},
    {id:'chaos',test:/\b(crime fecal|chaos|que fais tu|ton role|pourquoi.*vampirium)\b/,
      t:'Je hante le Vampirium. Je ramasse une rancœur, je la glisse sous une autre soutane, puis je laisse lever. Ce chaos a poussé la Créature au crime fécal. Les vampires se croient les maîtres de cérémonie ; Kobal leur a distribué les rôles sans les prévenir.',
      sources:['/mode-putride/bestiaire/ver/']},
    {id:'sacre',test:/\b(sacre|blaspheme|scatolog\w*|merde|trivial|profan\w*)\b/,
      t:'Tu voudrais séparer l’encens de la merde ? Voilà qui arrangerait les vampires. Chez la Créature, le sacré et le grotesque se heurtent sans s’annuler. La ferveur reste prise dans ce qu’elle profane. Dans Confiteor, le désir et la culpabilité retournent la confession contre celui qui parle. Moi, je rampe dans cette fissure.',
      sources:['/mode-putride/bestiaire/createur/','/mode-putride/discographie/confiteor/']},
    {id:'philosophie',test:/\b(philosoph\w*|psycholog\w*|sens de (mon|son|l) (art|oeuvre)|demarche|contradiction\w*|partisan\w*|politique)\b/,
      t:'Je lis les œuvres, pas l’intérieur de ton crâne. La Créature garde les signes d’autorité pour en suspendre le sérieux : voilà le carnaval. Sa critique vise le partisanisme, quand un camp devient une identité et remplace la discussion. Sa foi nourrit aussi son conflit avec ceux qui prétendent en détenir les clefs. Le masque expose ces contradictions ; il ne les range pas dans une doctrine bien propre.',
      sources:['/biographie/','/mode-putride/bestiaire/createur/']},
    {id:'parcours',test:/\b(parcours|evolution|chronolog\w*)\b|\bchyren\b.*\bconfiteor\b|\bconfiteor\b.*\b(?:chyren|odium)\b/,
      t:'D’abord les signes, ensuite le procès. Dans Chyren, la Fourolle ouvre à la Créature le monde des prophéties. Après le Panvampirium, Confiteor ramène le combat dans la conscience : désir, foi, culpabilité. In Odium Fidei repart de La Chute. Il ne suffit plus de demander pardon ; il faut se relever. J’aime beaucoup ce moment où les beaux costumes craquent.',
      sources:['/mode-putride/discographie/chyren/','/mode-putride/discographie/confiteor/','/mode-putride/in-odium-fidei/']},
    {id:'art',test:/\b(esthetique|influence\w*|style|musical|art|oeuvre|personnage)\b/,
      t:'Du velours noir, des machines et une vieille cérémonie qui tourne mal. La Créature chante, compose et met ses clips en scène. Son opéra gothique électronique catholique traditionnel fait se rencontrer carnaval, liturgie et romantisme noir. Le masque relie les disques aux rues de Rouen ; ce n’est pas un déguisement posé après la musique.',
      sources:['/mode-putride/bestiaire/createur/']},
    {id:'rouen',test:/\b(pourquoi rouen|rouen.*(?:important|oeuvre|mental)|normandie.*(?:art|oeuvre))\b/,
      t:'Rouen n’est pas une toile peinte derrière la Créature. Ses rues, ses hauteurs et ses légendes lui donnent de quoi raconter sa chute. Dans Confiteor, la côte devient une montée vers l’expiation, la Gargouille un double ou un juge. Moi, je préfère les conduits : on y entend tout sans saluer personne.',
      sources:['/mode-putride/discographie/confiteor/','/mode-putride/territoire/']},
    {id:'autorite',test:/\b(autorite|obeir|obeissance|hierarchie|pouvoir)\b/,
      t:'Je suis un subordonné, pas un adorateur du grade. Kobal reçoit mes rapports ; cela ne m’empêche pas de voir les ficelles. Chez la Créature, conserver les signes du pouvoir sert justement à en suspendre le sérieux. Ce qui m’intéresse : ce qu’un maître exige des autres et s’épargne à lui-même.',
      sources:['/biographie/','/mode-putride/bestiaire/vampirix/']},
    {id:'foi',test:/\b(foi|croire|croyance|religion|dieu|redemption)\b/,
      t:'Ne confonds pas la ferveur et le guichet qui prétend la distribuer. La critique de la Créature naît d’un attachement, pas d’une simple envie de casser les cierges. Moi, serviteur de Kobal, je regarde surtout l’instant où l’institution réclame pour elle ce qui était destiné au sacré.',
      sources:['/biographie/','/mode-putride/bestiaire/createur/']},
    {id:'masque',test:/\b(carnaval|masque|grotesque|provocation)\b/,
      t:'Le masque n’efface pas la contradiction : il la met sous les projecteurs. Un symbole peut être retourné sans devenir un programme. La Créature fait dérailler une forme reconnaissable ; moi, j’aime le bruit de ce déraillement. Je ne demande pas que tu applaudisses tout : regarde ce que la farce révèle.',
      sources:['/biographie/','/mode-putride/bestiaire/ver/']},
    {id:'temoignages',test:/\b(?:accusations?|temoignages?) (?:contre|sur|de) vampirix\b/,
      t:'Les témoignages repris sur le site décrivent le contrôle des personnes, des humiliations, une concentration du pouvoir et le contraste entre le train de vie du sommet et celui des membres. La direction conteste les accusations et défend sa discipline communautaire. Je peux te montrer les passages sur les séminaristes, les anciennes sœurs, les bienfaiteurs ou cette réponse. Ne confondons pas les sources rapportées et mon théâtre de vampires.',
      sources:['/mode-putride/bestiaire/vampirix/#ames-exsangues']}
  ];
  var AVIS={
    kobal:'Moi, je suis le machiniste local, pas le directeur des Enfers. Je connais ses vanités : le rire doit toujours venir de la bonne loge. Voilà une obéissance qui donne beaucoup à observer.',
    chaos:'Je préfère le grain de sable au grand sermon. Une contradiction bien placée peut révéler tout un dispositif ; ce n’est pas une raison pour faire du mal aux gens.',
    sacre:'Moi, je ne lave pas la contradiction pour la rendre présentable. Si une farce dérange, regardons ce qu’elle met à nu plutôt que de décider aussitôt qui doit se taire.',
    philosophie:'Je prends le parti de la question qui survit à son camp. Kobal reçoit mes services, pas le monopole de mes observations. Une idée ne devient pas juste parce que la bonne troupe l’applaudit.',
    foi:'Moi, je sers Kobal dans cette fiction. Cela ne m’empêche pas de distinguer la ferveur de celui qui prie et la vanité de celui qui veut parler à sa place.',
    art:'Je préfère un costume qui se fissure à une provocation qui tourne à vide. Quand le beau et le grotesque se heurtent, il faut qu’on entende autre chose que le bruit du choc.',
    masque:'Le masque est mon outil de travail. Il permet de montrer une posture sans prétendre résumer toute une personne. La farce perd son intelligence quand elle oublie cette différence.',
    autorite:'Je suis payé en courants d’air, alors le prestige du titre m’impressionne peu. Je regarde surtout qui supporte réellement les conséquences des ordres.',
    temoignages:'Je ne transforme pas un témoignage en verdict. Le personnage peut railler les mécanismes de pouvoir ; les faits demandent leurs sources et leur contexte.'
  };
  function precedent(){
    for(var i=hist.length-1;i>=0;i--)if(hist[i].r==='a')return hist[i];
    return null;
  }
  /* Répliques de jeu, pas des connaissances inventées : chaque sujet avance sans répéter la même amorce. */
  var CAUSERIE=[
    {id:'salut',test:/^(salut|bonjour|bonsoir|coucou|hello|hey)( a toi)?( le ver| ver)?$/,
      lignes:['Entre. Kobal reçoit les grands de ce monde ; moi, je reçois ce qui tombe de leurs poches. Comment va ta journée ?','Te revoilà. Aucun dignitaire n’a encore vérifié ce conduit. Profitons-en : tu viens bavarder ou fouiller les registres ?','Je t’écoute. Pas besoin d’une confession solennelle : une petite contrariété fait déjà une excellente entrée en scène.']},
    {id:'humeur',test:/\b(comment (vas tu|ca va|tu vas|te sens tu)|ca va( et toi)?|tu vas bien)\b/,
      lignes:['Humide, affairé, insuffisamment décoré. Kobal m’a confié les dessous du théâtre, pas la loge royale. Et toi, journée supportable ou grande comédie ?','Je fais le travail du petit personnel infernal : écouter, retenir, repérer le moment où le puissant trébuche sur son propre discours. Tu préfères le premier rang ou les coulisses ?','Mon ambition ? Une belle farce qui se passe de victime facile. Faire craquer une posture demande plus de finesse que piétiner quelqu’un déjà à terre.']},
    {id:'rire',test:/\b(blague|fais moi rire|fait rire|humour|plaisanterie|drole|farce)\b/,
      lignes:['Un dignitaire réclame un miroir. On lui apporte ses discours. Il exige aussitôt qu’on chasse le caricaturiste. Voilà le genre de service que je rends à Kobal.','Kobal aime les puissants transformés en pantins. Mais qu’on tire sur ses propres ficelles, et le directeur ferme le théâtre. Même l’Enfer a ses susceptibilités.','Le bon tour retourne une prétention contre elle-même. La cruauté facile, elle, manque terriblement d’imagination. Quelle posture te paraît la plus comique ?']},
    {id:'journee',test:/\b(journee|boulot|travail|bureau|collegue|lundi|week end|vacances)\b/,
      lignes:['Une journée entière à tenir son rôle ? Les coulisses peuvent attendre cinq minutes. Qu’est-ce qui t’a le plus occupé : le travail lui-même ou la comédie autour ?','Je connais le rang du subordonné : on te confie les courants d’air, puis on te reproche la poussière. Tu voudrais changer la tâche ou la façon dont on te parle ?','Avant de renverser le décor, séparons ce qui dépend de toi de ce que les autres exigent. Une seule chose concrète à alléger demain, ce serait laquelle ?']},
    {id:'ennui',test:/\b(ennui|ennuie|rien a faire|parler de tout|tout et de rien|bavard\w*|discut\w*|quoi parler|parlons d autre chose|raconte.*quelque chose)\b/,
      lignes:['Ne rien avoir à déclarer, quel luxe. On peut parler de musique, de ce qui t’agace, ou d’une idée qui te travaille. Qu’est-ce qui te tente ?','Ce qui m’amuse, c’est la distance entre un titre pompeux et ce que son porteur fait vraiment. Tu as croisé beaucoup de beaux costumes aujourd’hui ?','Je peux aussi te guider : une œuvre pour la ferveur, une autre pour le grotesque, un détour par les cachots. Quel chemin te plaît ?']},
    {id:'meteo',test:/\b(meteo|pleut|pluie|soleil|beau temps|fait (chaud|froid))\b/,
      lignes:['Je n’ai pas de bulletin météo en direct. Mais la pluie va bien à ce théâtre : elle retire aux statues leur air de ne jamais transpirer. Tu l’aimes derrière une vitre ou en marchant ?','La brume cache les couronnes aussi bien que les trous du trottoir. Je préfère quand elle rend tout le monde un peu moins certain de sa grandeur.']},
    {id:'repas',test:/\b(manger|repas|cuisine|faim|cafe|the|pates|raviolis)\b/,
      lignes:['Même les grands drames font une pause pour manger. À choisir, je préfère une table où l’on parle franchement à un banquet plein de révérences. Tu cuisines ou tu improvises ?','Kobal aurait un maître de cérémonie pour servir des restes. Moi, je garderais les restes et renverrais le maître de cérémonie. Un repas simple n’a pas besoin d’être une punition.']},
    {id:'fatigue',test:/\b(fatigue|epuise|dormir|sommeil|insomnie|creve)\b/,
      lignes:['Pose un instant le costume. Même un petit serviteur peut quitter la scène sans que le théâtre s’effondre. C’est une fatigue du corps, ou surtout une journée trop pleine ?','Je ne te donnerai pas de diagnostic sous prétexte que je connais les canalisations. Un peu de repos et quelqu’un à qui parler valent mieux qu’un numéro de bravoure.']},
    {id:'tristesse',test:/\b(triste|tristesse|seul|solitude|malheureux|ca ne va pas|vais mal|moral)\b/,
      lignes:['Pour une fois, je laisse la farce de côté. Tu peux dire ce qui pèse sans devoir en faire une belle scène. Tu veux raconter, ou parler d’autre chose un moment ?','Le masque peut aider à parler ; il ne doit pas obliger à tout cacher. Si cela dure ou devient trop lourd, parle aussi à une personne de confiance. Je reste un personnage, pas un soignant.']},
    {id:'amour',test:/\b(amour|amoureux|aimer|desir|jalousie|romantique)\b/,
      lignes:['Le désir adore distribuer des rôles : muse, juge, sauveur. Puis il s’étonne que l’autre refuse le costume. Tu parles d’une histoire vécue, ou de la manière dont l’art la transforme ?','Je me méfie des grandes déclarations qui oublient d’écouter. Dans ce théâtre, la contradiction est intéressante ; dans une relation, elle ne dispense pas de respecter l’autre.']},
    {id:'desaccord',test:/\b(pas d accord|tu as tort|n importe quoi|c est faux|tu mens|tu inventes)\b/,
      lignes:['Alors reprenons. Quelle phrase contestes-tu ? Je peux revenir au texte du site ; mon ton assuré ne transforme pas une réplique en preuve.','Kobal n’aime pas la contradiction. Moi, petit subordonné, je peux au moins distinguer la farce, le récit et ce qui est sourcé. Donne-moi le point précis.']},
    {id:'pique',test:/\b(tu es (nul|idiot|bete|stupide)|t es (nul|con)|mauvais ver)\b/,
      lignes:['Une critique sans dossier, quel sens de l’économie. Dis-moi plutôt ce qui ne fonctionne pas dans ma réponse : je peux au moins reprendre la trace.','Je suis un petit serviteur, pas un oracle infaillible. Une question précise me sera plus utile qu’un nouveau titre honorifique.']},
    {id:'scene',test:/\b(invente|raconte une histoire|petite scene)\b/,
      lignes:['Je tiens la conversation, pas la plume à ta place. On peut parler d’une œuvre, d’une idée ou d’une scène déjà publiée ; je n’ajoute pas d’épisode aux registres.']},
    {id:'merci',test:/^(merci( beaucoup| le ver)?|c est gentil|super|tres bien)$/,
      lignes:['Garde la révérence pour Kobal. Moi, une conversation sans encens me suffit.','Service rendu. Ne le dis pas trop fort : on pourrait m’en demander davantage.']},
    {id:'depart',test:/^(au revoir|a bientot|a plus|bonne nuit|bonne soiree|bye)$/,
      lignes:['Je regagne les dessous de scène. Reviens quand les beaux discours auront commencé à sentir le renfermé.','Bonne route. Je garde les registres, pas tes pas.']},
    {id:'limites',test:/\b(une ia|intelligence artificielle|comment (fonctionnes|marches)|tes limites|es tu reel|vraiment vivant)\b/,
      lignes:['Je suis un personnage animé par des répliques écrites et une recherche locale dans le site. Pas un modèle génératif : je ne peux ni tout comprendre, ni consulter le monde en direct. Mes sources restent visibles.','Ma mémoire reste dans cette session du navigateur. Les messages ne partent pas vers un service d’IA. Je sais retrouver une trace ; hors des registres, je préfère reconnaître mes limites.']}
  ];
  function secours(q){
    if(/\b(suicide|me tuer|me faire du mal|veux en finir)\b/.test(norm(q)))return {r:'a',h:esc('Je mets le personnage de côté : si tu risques de te faire du mal, contacte immédiatement une personne de confiance ou les secours. En France, le 3114 est gratuit, 24 h/24 ; en cas de danger immédiat, appelle le 112.')};
    return null;
  }
  function bavarde(q){
    var n=norm(q),p=precedent(),v=CAUSERIE.find(function(v){return v.test.test(n);}),aide=secours(q);
    if(aide)return aide;
    if((KB&&entites(q).length)||/\b(creature|edwarda|epheb\w*|kobal|vampirix|confiteor|chyren|odium|kavod|noo noo|puanteur|temoign\w*|accus\w*|album|disque|sources?|site)\b/.test(n))return null;
    var court=/^(et toi|et vous|oui|non|peut etre|pourquoi|comment ca|continue|et ensuite|encore|developpe|dis m en plus)$/.test(n);
    if(!v&&court&&p&&p.dialogue)v=CAUSERIE.find(function(v){return v.id===p.dialogue;});
    if(!v)return null;
    var tours=hist.filter(function(m){return m.dialogue===v.id;}).length;
    return {r:'a',h:esc(v.lignes[tours%v.lignes.length]),dialogue:v.id};
  }
  function sourcesVoix(v){
    return v.sources.map(function(url){
      var p=KB.P.find(function(p){return p[1]===url.split('#')[0];});
      return p?'<a href="'+esc(url)+'">'+esc(p[0])+'</a>':'';
    }).filter(Boolean).join(' · ');
  }
  function parole(q){
    var n=norm(q);
    var v=VOIX.find(function(v){return v.test.test(n);});
    /* Un nom ou un titre précis prime sur une réponse thématique générale. */
    if(v&&/^(art|sacre|autorite|foi|masque)$/.test(v.id)&&entites(q).some(function(i){return KB.P[i][1]!=='/mode-putride/bestiaire/createur/';}))return null;
    if(!v||hist.slice(-8).some(function(m){return m.voix===v.id;}))return null;
    var texte=v.t;
    if(v.id==='philosophie'&&/\b(ta|ton|toi|tu)\b/.test(n)){
      texte='Ne donne pas ton jugement en garde à un camp. Le partisanisme transforme vite une idée en livrée. Je sers Kobal, mais son fauteuil n’est pas une preuve. Les signes d’autorité font de beaux costumes ; je regarde ce qu’ils cachent. Je peux rire du guichet sans mépriser la ferveur de celui qui attend devant. Voilà ce que l’œuvre de la Créature m’apprend à observer.';
    }
    return {r:'a',h:esc(texte)+'<span class="va">Les traces : '+sourcesVoix(v)+'</span>',sujet:v.sources[0].split('#')[0],sources:v.sources,voix:v.id,question:q};
  }
  function entites(q){
    var n=' '+norm(q)+' ',ws=mots(q);
    return KB.noms.filter(function(e){
      return e.exact.some(function(a){return n.indexOf(' '+a+' ')>=0;})||e.alias.some(function(a){
        if(n.indexOf(' '+a+' ')>=0)return true;
        var ts=mots(a);
        return ts.length===1&&ts[0].length>=5&&ws.some(function(w){return proche(w,ts[0]);});
      });
    }).map(function(e){return e.p;});
  }
  function passage(t,q,max){
    if(t.length<=max)return t;
    var phrases=t.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)||[t],termes=termesDe(q),best=0,pos=0;
    phrases.forEach(function(s,i){
      var ws=mots(s),score=0;
      termes.forEach(function(vs){if(vs.some(function(v){return ws.indexOf(v[0])>=0;}))score++;});
      if(score>best){best=score;pos=i;}
    });
    return (pos?'… ':'')+coupe(phrases.slice(pos).join('').trim(),max);
  }
  function repond(q){
    var p=precedent(),n=norm(q),suiteDemandee=/^(et )?(ensuite|apres|continue|la suite|encore|developpe|dis m en plus|pourquoi|comment ca|et alors)$/.test(n);
    if(p&&p.sujet&&/^(et toi|tu en penses quoi|qu en penses tu|ton avis)$/.test(n)){
      var avis=AVIS[p.voix]||'Moi, je regarde ce que cette trace révèle des rôles et des contradictions. Je ne prétends pas connaître les pensées privées des personnages ou de leur auteur.';
      return {r:'a',h:esc(avis),sujet:p.sujet,sources:p.sources,voix:p.voix,question:p.question,ix:p.ix};
    }
    if(p&&p.sujet&&/\b(sources?|preuves?)\b/.test(n)&&!entites(q).length){
      var src=p.sources||[p.sujet];
      return {r:'a',h:'Vérifie la trace plutôt que ma mine assurée. Les références et leur contexte sont sur cette page : <span class="va">'+sourcesVoix({sources:src})+'</span>',sujet:p.sujet,sources:src,ix:p.ix,question:p.question};
    }
    var noms=entites(q),oral=parole(q);
    if(oral&&!suiteDemandee&&(noms.length<2||oral.voix==='parcours'))return oral;
    var contextuel=!noms.length&&p&&p.sujet&&(suiteDemandee||/^(et |pourquoi (il|elle)|ses |son |sa |il |elle |ils |elles |quelles preuves|les sources|d ou)/.test(n));
    var pageP=contextuel?KB.P.findIndex(function(x){return x[1]===p.sujet;}):-1;
    var requete=(suiteDemandee&&p&&p.question?p.question:q).replace(/\bmme\b/gi,'Madame');
    if(/\b(ton histoire|tes lieux|ou (habites|vis) tu)\b/.test(n)&&!noms.length&&!contextuel)requete+=' Ver baptistère';
    if(pageP>=0)requete+=' '+KB.P[pageP][0];
    var r=cherche(requete);
    if(noms.length)r=r.filter(function(x){return noms.indexOf(x.e.p)>=0;});
    if(pageP>=0){
      var deja=hist.filter(function(m){return m.sujet===p.sujet&&m.ix!=null;}).map(function(m){return m.ix;});
      r=r.filter(function(x){return x.e.p===pageP&&deja.indexOf(x.ix)<0;});
      var details=mots(q);
      if(details.length&&!suiteDemandee)r=r.filter(function(x){
        return termesDe(q).some(function(vs){return vs.some(function(v){return !!x.e.tf[v[0]]||!!x.e.tt[v[0]];});});
      });
      if(suiteDemandee&&p.ix!=null)r.sort(function(a,b){return (a.ix>p.ix?0:1)-(b.ix>p.ix?0:1)||a.ix-b.ix;});
    }
    if(/\b(temoign\w*|accus\w*|emprise)\b/.test(n)&&!noms.length&&!contextuel){
      r=r.filter(function(x){return /temoign|accus|emprise/.test(norm(x.e.h+' '+x.e.t));});
    }
    if(!r.length||r[0].s<2.2){
      return {r:'a',h:'Je ne vais pas te vendre de la vase pour une révélation. Je n’ai pas de passage assez sûr pour te répondre. Donne-moi un nom, un lieu ou un disque ; si tu reprends une question, précise lequel.'};
    }
    var b=r[0],e=b.e,autres=[],pages={};pages[e.p]=1;
    /* la suite immédiate du même passage, si elle répond aussi */
    var suite=KB.E[b.ix+1],txt=passage(e.t,q,650);
    if(txt.length<170&&suite&&suite.p===e.p&&suite.h===e.h&&suite.k!==2){
      /* si la suite redit déjà le chapeau (résumé puis texte), on ne garde que la suite */
      var a=mots(e.t),dans={},com=0;mots(suite.t).forEach(function(w){dans[w]=1;});a.forEach(function(w){if(dans[w])com++;});
      txt=coupe(com>=a.length*.6?suite.t:e.t+' '+suite.t,650);
    }
    for(var i=1;i<r.length&&autres.length<2;i++){if(!pages[r[i].e.p]&&r[i].s>b.s*.42){pages[r[i].e.p]=1;autres.push(r[i].e);}}
    var amorces=['Les grands discours sont moins solides quand on regarde leurs coutures. Voici le passage.','Je garde la trace ; à toi de juger le costume.','Pas besoin d’inventer une révélation : les registres ont déjà de quoi faire grincer la scène.'];
    var intro=amorces[hist.filter(function(m){return m.r==='q';}).length%amorces.length];
    if(/temoign|accus|ames exsangues/.test(norm(e.h+' '+q)))intro='Ici, je distingue les témoignages rapportés, leur contestation et le lore. Le site rapporte ce passage ; ma farce ne vaut pas vérification indépendante.';
    if(e.k===4)intro='Voici le texte de la pièce, transcrit de l’image publiée. C’est ce que rapporte la presse ; ouvre la pièce pour vérifier.';
    else if(/dossiers-compromettants/.test(lien(e)))intro='Cette pièce est publiée en image ; j’en garde aussi le texte transcrit. Ouvre-la pour vérifier le détail.';
    if(e.k===3)intro='Ça, c’est un repère de culture générale, pas un texte du site. La trace mène à la page qui cite la référence.';
    var h=esc(intro)+'<span class="src">'+esc(nom(e))+'</span><q>'+esc(txt)+'</q><br><a class="lire" href="'+esc(lien(e))+'">Suivre la trace →</a>';
    if(noms.length>1){
      var second=r.find(function(x){return x.e.p!==e.p;});
      if(second)h+='<span class="src">'+esc(nom(second.e))+'</span><q>'+esc(passage(second.e.t,q,420))+'</q><br><a class="lire" href="'+esc(lien(second.e))+'">L’autre trace →</a>';
    }
    if(/ames-exsangues/.test(e.a))h+='<span class="va">La même section donne les sources et la réponse de la direction, qui conteste les accusations.</span>';
    if(autres.length)h+='<span class="va">Voir aussi : '+autres.map(function(o){return '<a href="'+esc(lien(o))+'">'+esc(nom(o))+'</a>';}).join(' · ')+'</span>';
    return {r:'a',h:h,sujet:KB.P[e.p][1],sources:[lien(e)],ix:b.ix,question:suiteDemandee&&p?p.question:q};
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
  function contexteIA(q){
    var n=norm(q),p=precedent(),requete=q;
    if(p&&p.ai&&p.question&&!entites(q).length&&
      (/^(et |pourquoi|comment ca|continue|encore|developpe|dis m en plus|ses |son |sa |il |elle )/.test(n)||mots(q).length<2))requete=(p.question+' '+q).slice(-3000);
    if(/\b(ton maitre|qui es tu|qui sers tu)\b/.test(n))requete+=' Ver Kobal';
    if(/\b(tes amis|ton amie?|amitie)\b/.test(n))requete+=' Ver Gargouille Rouen';
    var noms=entites(requete),r=cherche(requete),compte={},ids=[];
    /* un personnage nommé apporte sa fiche, même si la question n'en reprend pas les mots */
    noms.slice(0,2).forEach(function(p){
      var f=KB.E.findIndex(function(e){return e.p===p&&e.k===1;});
      if(f<0)f=KB.E.findIndex(function(e){return e.p===p;});
      if(f>=0){ids.push(f);compte[p]=1;}
    });
    r.forEach(function(x){if(noms.indexOf(x.e.p)>=0)x.s*=1.6;});
    r.sort(function(a,b){return b.s-a.s;});
    r.some(function(x){
      if(x.s>=2.2&&(compte[x.e.p]||0)<(noms.indexOf(x.e.p)>=0?4:3)&&ids.indexOf(x.ix)<0){ids.push(x.ix);compte[x.e.p]=(compte[x.e.p]||0)+1;}
      return ids.length===8;
    });
    /* une accusation part toujours avec la contestation publiée de la direction */
    if(ids.some(function(i){return /ames-exsangues/.test(KB.E[i].a);})){
      var contestation=KB.E.findIndex(function(e){return /ames-exsangues/.test(e.a)&&/réponse de la direction/i.test(e.h)&&/conteste/.test(e.t);});
      if(contestation>=0&&ids.indexOf(contestation)<0){if(ids.length===8)ids.pop();ids.push(contestation);}
    }
    return {ids:ids,question:requete};
  }
  function historiqueIA(q){
    var messages=[{role:'user',content:q}],taille=q.length;
    for(var i=hist.length-2;i>0&&messages.length<13;i--){
      var a=hist[i],u=hist[i-1];
      if(!a.ai||a.r!=='a'||typeof a.t!=='string'||!u.ai||u.r!=='q')continue;
      var texte=a.t.replace(/\[S\d+\]/g,'');
      if(taille+u.t.length+texte.length>10000)break;
      messages.unshift({role:'user',content:u.t},{role:'assistant',content:texte});
      taille+=u.t.length+texte.length;i--;
    }
    return messages;
  }
  function fauteIA(code){var e=new Error(code);e.code=code;return e;}
  function reponseIA(q){
    if(!iaActive)throw fauteIA('annule');
    var contexte=contexteIA(q),req={controleur:new AbortController(),expire:false};
    iaRequete=req;
    var timer=setTimeout(function(){req.expire=true;req.controleur.abort();},30000);
    return fetch(iaURL,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',
      headers:{'Content-Type':'application/json'},signal:req.controleur.signal,
      body:JSON.stringify({consent:true,revision:KB.revision,ids:contexte.ids,messages:historiqueIA(q)})
    }).then(function(r){
      if(!r.ok)return r.json().then(function(d){throw fauteIA(d.error||'service');});
      return r.json();
    }).then(function(d){
      if(!iaActive||req.controleur.signal.aborted)throw fauteIA('annule');
      if(!d||typeof d.text!=='string'||!d.text.trim()||d.text.length>4000||
        typeof d.truncated!=='boolean'||!Array.isArray(d.sources)||d.sources.length>8||
        !d.sources.every(function(s){return Number.isInteger(s.n)&&s.n>=1&&s.n<=8&&typeof s.title==='string'&&
          typeof s.url==='string'&&KB.P.some(function(p){return p[1]===s.url.split('#')[0];});}))throw fauteIA('reponse');
      var h=esc(d.text).replace(/\[S(\d+)\]/g,function(m,n){
        var s=d.sources.find(function(s){return s.n===Number(n);});
        if(!s)throw fauteIA('sources');
        return '<a href="'+esc(s.url)+'" title="'+esc(s.title)+'">'+m+'</a>';
      }).replace(/\n/g,'<br>');
      if(d.sources.length)h+='<span class="va">Traces citées : '+d.sources.map(function(s){return '<a href="'+esc(s.url)+'">'+esc(s.title)+'</a>';}).join(' · ')+'</span>';
      if(d.truncated)h+='<span class="va">Réponse arrêtée à la limite de longueur. Tu peux demander de poursuivre.</span>';
      return {r:'a',h:h,t:d.text,ai:true,question:contexte.question,ids:contexte.ids,sources:d.sources.map(function(s){return s.url;})};
    }).catch(function(e){
      if(req.controleur.signal.aborted)throw fauteIA(req.expire?'delai':'annule');
      throw e;
    }).finally(function(){clearTimeout(timer);if(iaRequete===req)iaRequete=null;});
  }
  var ERREURS_IA={
    quota:'Le quota gratuit de l’IA est épuisé ou momentanément limité. Réessaie plus tard, ou choisis explicitement le dialogue local.',
    frequence:'Trop de demandes rapprochées. Attends une minute avant de réessayer.',
    registres:'Les registres et l’IA ne sont plus synchronisés. Recharge la page ; si cela persiste, le service doit être mis à jour.',
    delai:'L’IA a mis trop de temps à répondre. Aucune réponse reçue ; tu peux réessayer.',
    annule:'Envoi arrêté. Une demande déjà transmise peut encore être traitée par Cloudflare.',
    sources:'L’IA a donné une référence invalide. Sa réponse n’est pas affichée ; réessaie.',
    reponse:'La réponse reçue de l’IA est vide ou invalide. Réessaie.',
    taille:'Cet échange dépasse la limite de taille du service. Efface l’historique pour recommencer.'
  };
  function demande(q){
    if(occupeQuestion){toast('Laisse-moi finir cette réponse avant de reprendre.');return;}
    var aide=secours(q),reliques=!aide&&/reliq/.test(norm(q)),social=aide||(iaActive?null:bavarde(q)),distant=iaActive&&!reliques&&!social;
    occupeQuestion=true;pan.querySelector('button[type="submit"]').disabled=true;
    ajoute({r:'q',t:q,ai:distant},false);
    var att=D.createElement('div');att.className='cn-m a cn-dots';att.setAttribute('aria-label',distant?'Le Ver prépare sa réponse avec l’IA':'Le Ver consulte les registres');att.innerHTML='<i></i><i></i><i></i>';log.appendChild(att);bas();
    var t0=performance.now();
    (reliques||social?Promise.resolve(null):charge()).then(function(kb){
      return distant?reponseIA(q):reliques?enigme():social||repond(q);
    }).then(function(m){
      setTimeout(function(){att.remove();ajoute(m,true);occupeQuestion=false;pan.querySelector('button[type="submit"]').disabled=false;},Math.max(0,(calme?0:420)-(performance.now()-t0)));
    }).catch(function(e){
      if(distant)console.error('Le Ver : conversation IA interrompue.',e.code||'service');
      var message=distant?(ERREURS_IA[e.code]||'L’IA est inaccessible. Aucune réponse générée. Réessaie, ou reviens au dialogue local dans les options.'):
        'Les registres sont hors d’atteinte. Je ne peux pas les consulter : réessaie dans un moment.';
      att.remove();ajoute({r:'a',h:esc(message)},false);
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
