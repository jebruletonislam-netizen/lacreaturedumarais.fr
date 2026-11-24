/* Les deux coins du bas, dans le mode putride et dans les cachots ; sur le site normal, seulement Tristana.
   À gauche : couper (ou rétablir) les effets ; le choix est gardé, et vaut comme le réglage « moins d'animations » de l'appareil.
   À droite : le Ver (Tristana, attachée de presse du label, sur le site normal, qui ne lit que les pages publiques).
   Dialogue local par défaut ; modèle distant seulement après consentement.
   Les registres /oracle-*.json, tirés des pages par _outils/oracle.py, servent aux deux dialogues.
   Les deux couches connaissent les textes publics, putrides et les cachots. Dans les cachots,
   interrogé sur les reliques cachées, il répond par une énigme sur l'une de
   celles qu'on n'a pas encore trouvées (liste RELIQUES, à tenir d'accord avec les boutons .rel des pages et cachot-vie.js). */
(function(){
  'use strict';
  if(window.Coins)return;
  var D=document,H=D.documentElement,LS='lcdm-calme',SS='lcdm-oracle';
  var couche=/^\/cachot\//.test(location.pathname)?'cachot':/^\/mode-putride\//.test(location.pathname)?'putride':'normal';
  var normal=couche==='normal',NOM=normal?'Tristana':'le Ver';
  var calme=window.CALME!=null?!!window.CALME:!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};

  var css=''
  +'.cn-b,.cn-p,.cn-toast,.cn-sel{--c:#39ff6a;--c2:#d6b0ff;--o:rgba(122,45,214,.55);--l:rgba(57,255,106,.28);--bg:linear-gradient(180deg,#110020,#05000a);--t:#f1e8ff;--qb:#3b1170;--tf:"Bebas Neue",Impact,sans-serif}'
  +'.cn-normal{--c:#fc0;--c2:#ff5a5a;--o:rgba(255,0,0,.45);--l:rgba(255,204,0,.3);--bg:linear-gradient(180deg,#00005e,#000016);--t:#fff;--qb:#600000}'
  +'.cn-b img{width:34px;height:34px;display:block;pointer-events:none}.cn-or.cn-normal[aria-expanded="true"] img{filter:invert(1)}.cn-sel img{width:18px;height:18px}'
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
  +'.cn-p{position:fixed;right:12px;bottom:calc(72px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px));z-index:96;width:min(410px,calc(100vw - 24px));'
  +'max-height:min(580px,calc(100vh - 150px - var(--lc-h,0px)));max-height:min(580px,calc(100dvh - 150px - var(--lc-h,0px)));display:flex;flex-direction:column;'
  +'color:var(--t);background:var(--bg);border:1px solid var(--c);border-radius:16px;box-shadow:0 0 0 2px #000,0 14px 36px rgba(0,0,0,.92),0 0 24px var(--o);'
  +'font:15px/1.48 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;transform-origin:100% 100%;animation:cn-in .22s ease-out}'
  +'.cn-p.cn-cachot{font-family:"EB Garamond",Georgia,serif;font-size:16.5px;font-weight:500;border-radius:60px 60px 14px 14px/34px 34px 14px 14px}'
  +'.cn-p[hidden]{display:none}'
  /* « Agrandir » : une fenêtre de lecture large sur ordinateur, tout l'écran sur mobile */
  +'.cn-p.cn-grand{width:min(760px,calc(100vw - 24px));height:min(900px,calc(100vh - 100px - var(--lc-h,0px)));height:min(900px,calc(100dvh - 100px - var(--lc-h,0px)));max-height:none}'
  +'@keyframes cn-in{from{opacity:0;transform:translateY(10px) scale(.96)}}'
  +'.cn-h{display:flex;align-items:flex-start;gap:10px;padding:12px 12px 9px 16px;border-bottom:1px solid var(--l)}'
  +'.cn-cachot .cn-h{padding-top:18px;justify-content:center;text-align:center}'
  +'.cn-h div{flex:1;min-width:0}.cn-h b{display:block;font:400 24px/1 var(--tf);letter-spacing:.06em;color:var(--c);text-shadow:0 0 10px var(--o)}'
  +'.cn-cachot .cn-h b{font-weight:700;font-size:27px;letter-spacing:.02em}'
  +'.cn-h small{display:block;margin-top:4px;font-size:12px;line-height:1.3;opacity:.72}'
  +'.cn-hb{flex:none;display:flex;gap:4px;margin:-4px -4px 0 0}'
  +'.cn-x,.cn-hx{flex:none;display:grid;place-items:center;width:32px;height:32px;margin:0;padding:0;border:1px solid var(--l);border-radius:50%;background:transparent;color:var(--t);font:22px/1 Arial,sans-serif;cursor:pointer}'
  +'.cn-hx svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
  +'.cn-x:hover,.cn-x:focus-visible,.cn-hx:hover,.cn-hx:focus-visible{border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-lw{position:relative;flex:1;min-height:90px;display:flex;flex-direction:column}'
  +'.cn-bas{position:absolute;right:14px;bottom:8px;z-index:1;width:34px;height:34px;padding:0;border:1px solid var(--c);border-radius:50%;background:#000;color:var(--c);font:700 17px/1 Arial,sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.8)}.cn-bas[hidden]{display:none}'
  +'.cn-log{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:12px;display:flex;flex-direction:column;gap:9px;scrollbar-width:thin;scrollbar-color:var(--c) transparent}'
  +'.cn-m{max-width:94%;padding:8px 11px;border-radius:13px;overflow-wrap:anywhere}'
  +'.cn-m.q{align-self:flex-end;background:var(--qb);color:#fff;border-bottom-right-radius:4px;white-space:pre-wrap}'
  +'.cn-m.a{align-self:flex-start;background:rgba(255,255,255,.045);border:1px solid var(--l);border-bottom-left-radius:4px}'
  /* chaque bulle a ses gestes : copier la réponse, modifier la question, demander une autre réponse */
  +'.cn-w{display:flex;max-width:100%}.cn-wq{justify-content:flex-end;align-items:flex-end;gap:3px}.cn-wa{flex-direction:column;align-items:flex-start}'
  +'.cn-wq .cn-m{max-width:calc(100% - 30px)}.cn-wa .cn-m{max-width:94%}'
  +'.cn-w.cn-edit .cn-m{outline:2px dashed var(--c);outline-offset:2px}'
  +'.cn-act{display:flex;gap:2px;margin-top:2px}'
  /* « Partager en image » des pages de disque, sous les plateformes, au style des boutons de la page */
  +'.cn-pdisque{display:flex;flex-wrap:wrap;gap:8px;flex-basis:100%;width:100%;margin-top:10px}.cn-pd{cursor:pointer;font:inherit}.cn-pd:disabled{opacity:.5;cursor:progress}.cn-pds{opacity:.78}'
  +'.cn-ic{flex:none;display:grid;place-items:center;width:27px;height:27px;margin:0;padding:0;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--t);opacity:.55;cursor:pointer;-webkit-tap-highlight-color:transparent}'
  +'.cn-ic svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
  +'@media (hover:hover) and (pointer:fine){.cn-wq .cn-ic{opacity:0}.cn-wq:hover .cn-ic{opacity:.6}}'
  +'.cn-w .cn-ic:hover,.cn-w .cn-ic:focus-visible,.cn-w .cn-ic.ok{opacity:1;color:var(--c);border-color:var(--l);outline:none}'
  +'.cn-m .src{display:block;margin-bottom:3px;font:400 14px/1.15 "Bebas Neue",Impact,sans-serif;letter-spacing:.09em;color:var(--c)}'
  +'.cn-m q{quotes:"« " " »"}.cn-m q::before,.cn-m q::after{color:var(--c)}'
  +'.cn-m a{color:var(--c2);text-decoration:underline;text-decoration-color:var(--c);text-underline-offset:2px}'
  +'.cn-m .va{display:block;margin-top:6px;font-size:.88em;opacity:.9}'
  +'.cn-m .lire{display:inline-block;margin-top:6px;font-weight:600}'
  +'.cn-live::after{content:"▍";margin-left:2px;color:var(--c);animation:cn-dot 1s infinite}'
  /* trois suggestions au plus, toujours lisibles en entier : elles passent à la ligne au lieu de défiler */
  +'.cn-sug{display:flex;flex-wrap:wrap;gap:5px 6px;padding:2px 12px 8px}.cn-sug:empty{display:none}'
  +'.cn-sug button{flex:0 1 auto;max-width:100%;min-width:0;text-align:left;white-space:normal;overflow-wrap:anywhere;font:inherit;font-size:12.5px;line-height:1.25;padding:4px 10px;border-radius:13px;border:1px solid var(--l);background:rgba(0,0,0,.35);color:var(--t);cursor:pointer}'
  +'.cn-sug button:hover,.cn-sug button:focus-visible{border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-fo{font:inherit;font-size:12px;line-height:1;margin:0 0 0 2px;padding:5px 8px;border:1px solid var(--l);border-radius:999px;background:transparent;color:var(--t);opacity:.8;cursor:pointer}'
  +'.cn-fo:hover,.cn-fo:focus-visible{opacity:1;border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-act{flex-wrap:wrap;align-items:center}'
  +'.cn-ai{flex:none;padding:6px 12px;border-bottom:1px solid var(--l);font:12px/1.4 system-ui,sans-serif;max-height:165px;max-height:min(165px,25dvh);overflow:auto}.cn-ai[hidden]{display:none}'
  +'.cn-ai-settings .cn-sug{display:none}.cn-ai-settings .cn-lw{min-height:50px}'
  +'.cn-ai summary{cursor:pointer;color:var(--c2)}.cn-ai p{margin:8px 0}.cn-ai a{color:var(--c2)}'
  +'.cn-ai button{font:inherit;border:1px solid var(--l);border-radius:6px;padding:6px;margin:2px;background:#000;color:var(--t);cursor:pointer}.cn-ai button[hidden]{display:none}'
  +'.cn-ed{display:flex;align-items:center;gap:8px;padding:6px 10px 0 14px;font-size:12.5px;line-height:1.3;color:var(--c2)}.cn-ed[hidden]{display:none}.cn-ed span{flex:1}'
  +'.cn-ed button{font:inherit;border:1px solid var(--l);border-radius:8px;background:transparent;color:var(--t);padding:3px 9px;cursor:pointer}.cn-ed button:hover,.cn-ed button:focus-visible{border-color:var(--c);color:var(--c);outline:none}'
  +'.cn-f{display:flex;align-items:flex-end;gap:7px;padding:9px 10px 10px;border-top:1px solid var(--l)}'
  +'.cn-f textarea{flex:1;min-width:0;box-sizing:border-box;height:43px;max-height:140px;resize:none;overflow-y:auto;font:16px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;padding:10px 12px;border-radius:11px;border:1px solid var(--l);background:#000;color:#fff;scrollbar-width:thin}'
  +'.cn-f textarea:focus{outline:none;border-color:var(--c);box-shadow:0 0 0 2px var(--o)}'
  +'.cn-f button{flex:none;width:44px;height:43px;border-radius:11px;border:1px solid var(--c);background:var(--c);color:#000;font:700 18px/1 Arial,sans-serif;cursor:pointer}'
  +'.cn-f button:disabled{opacity:.55;cursor:default}.cn-f button.cn-stop{background:transparent;color:var(--c);font-size:15px}'
  +'.cn-f .cn-mic{width:40px;background:transparent;color:var(--c);display:grid;place-items:center}.cn-f .cn-mic[hidden]{display:none}'
  +'.cn-mic svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
  +'.cn-f .cn-mic.on{background:var(--c);color:#000;animation:cn-dot 1.2s infinite}'
  /* surligner un passage du site fait apparaître « Demander au Ver » */
  +'.cn-sel{position:fixed;z-index:97;display:flex;align-items:center;gap:6px;margin:0;padding:7px 12px 7px 9px;border:1px solid var(--c);border-radius:999px;background:#000;color:var(--c);'
  +'font:600 13px/1 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;white-space:nowrap;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.85),0 0 12px var(--o);-webkit-tap-highlight-color:transparent}'
  +'.cn-sel[hidden]{display:none}.cn-sel svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round}.cn-sel:hover,.cn-sel:focus-visible{background:var(--c);color:#000;outline:none}'
  +'.cn-dots i{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--c);animation:cn-dot 1s infinite}.cn-dots i:nth-child(2){animation-delay:.15s}.cn-dots i:nth-child(3){animation-delay:.3s}'
  +'@keyframes cn-dot{50%{opacity:.25;transform:translateY(-3px)}}'
  +'.cn-toast{position:fixed;left:50%;bottom:calc(74px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px));z-index:97;max-width:min(30rem,calc(100vw - 32px));padding:9px 15px;transform:translateX(-50%);'
  +'color:var(--t);background:var(--bg);border:1px solid var(--c);border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.9),0 0 16px var(--o);font:14px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;pointer-events:none;transition:opacity .4s}'
  +'@media (max-width:560px){.cn-p{left:8px;right:8px;width:auto;bottom:calc(70px + env(safe-area-inset-bottom,0px) + var(--lc-h,0px))}.cn-b{width:44px;height:44px}.cn-b.cn-cachot{height:50px}.cn-fx{left:8px}.cn-or{right:8px}'
  +'.cn-p.cn-grand,.cn-p.cn-cachot.cn-grand{inset:0;width:auto;height:auto;max-height:none;border-radius:0;border-width:0;padding-bottom:env(safe-area-inset-bottom,0px)}}'
  /* place réservée aux coins : le bas du plan des cachots et le pied de page ne passent plus dessous */
  +'@media (min-width:900px){body.cachot nav{padding-bottom:calc(5.2rem + env(safe-area-inset-bottom,0px))}}'
  +'@media (max-width:899px){body.cachot .pfoot::after{content:"";display:block;height:calc(48px + env(safe-area-inset-bottom,0px))}}'
  +'@media print{.cn-b,.cn-p,.cn-toast,.cn-sel{display:none!important}}';
  var st=D.createElement('style');st.textContent=css;D.head.appendChild(st);

  var cls=couche==='cachot'?' cn-cachot':normal?' cn-normal':'';
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
    normal:'Bonjour. Tristana, attachée de presse et archiviste de PUANTEUR PUTRIDE Productions. Je tiens les communiqués, les dates et les cartons du label. Demandez-moi un disque, un clip, une date… ou ce que le marais garde pour lui.',
    cachot:'Baisse la voix. Je suis le Ver du baptistère. Ici, les murs ont plus de mémoire que les vivants : les prisonniers, les fonds, la Gazette… Et quelques reliques que je ne livrerai pas toutes mâchées.'
  };
  var SUG={
    putride:['Comment vas-tu ?','Qu’est-ce qui te fait rire ?','Quelle est la philosophie de la Créature ?','Les témoignages sur Vampirix','Qui est Madame Edwarda ?','Par quel album commencer ?'],
    normal:['Par quel disque commencer ?','Quoi de neuf ?','Que cache le marais ?','Qui est la Créature du Marais ?','Où écouter Cul-Pointu ?','Comment suivre les sorties ?'],
    cachot:['Comment vas-tu ?','Qui est Kavod TinkiWizkhi ?','Qui est Noo-Noo ?','Pourquoi PUANTEUR PUTRIDE est-il au cachot ?','La Gazette du Prisonnier','Les reliques cachées']
  };
  var ICO_OR='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M35 38a3 3 0 0 1-6 0a6 6 0 0 1 12 0a9 9 0 0 1-18 0a12 12 0 0 1 24 0a15 15 0 0 1-30 0C17 27 31 28 27 16"/><circle cx="26" cy="11" r="5.5" style="fill:currentColor"/><circle cx="27.8" cy="9.8" r="1.6" style="fill:#000;stroke:none"/></svg>';
  var ICO_PP='<img src="/images/cachot/logo-pp-blanc.webp" alt="" width="34" height="34" decoding="async">';
  if(normal)ICO_OR=ICO_PP;
  var TITRE_OB=normal?'Tristana, attachée de presse de PUANTEUR PUTRIDE Productions : questions sur la Créature':'Le Ver, l’Oracle : questions sur le lore';
  var ROLE=normal?'Presse et archives de PUANTEUR PUTRIDE.':'Serviteur de Kobal.';
  var ob=el('<button type="button" class="cn-b cn-or'+cls+'" aria-expanded="false" aria-controls="cn-oracle" aria-label="'+TITRE_OB+'" title="'+TITRE_OB+'">'+ICO_OR+'</button>');
  var pan=el('<section class="cn-p'+cls+'" id="cn-oracle" role="dialog" aria-labelledby="cn-ot" hidden>'
    +'<div class="cn-h"><div><b id="cn-ot">'+(normal?'Tristana':'Le Ver')+'</b><small>'+ROLE+' Dialogue local, sans IA générative.</small></div><span class="cn-hb">'
    +'<button type="button" class="cn-hx cn-new" aria-label="Nouvelle conversation" title="Nouvelle conversation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M12 7.5v6M9 10.5h6"/></svg></button>'
    +'<button type="button" class="cn-hx cn-gr" aria-pressed="false"></button>'
    +'<button type="button" class="cn-x" aria-label="Fermer la conversation">×</button></span></div>'
    +'<details class="cn-ai" hidden><summary>Conversation IA et confidentialité</summary>'
    +'<p>Sur ton accord, Cloudflare reçoit tes messages, jusqu’à six échanges IA précédents, l’adresse de la page consultée, les passages que tu soumets '+(normal?'à Tristana':'au Ver')+' et des extraits '+(normal?'publics ':'')+'du site. Aucun modèle à télécharger. L’IA peut se tromper ; quota gratuit partagé. N’envoie rien de confidentiel. <a href="/mentions-legales/#dialogue-ver">Détails</a>.</p>'
    +'<button type="button" class="cn-ai-on">J’accepte, activer l’IA</button><button type="button" class="cn-ai-off" hidden>Revenir au dialogue local</button></details>'
    +'<div class="cn-lw"><div class="cn-log" aria-live="polite"></div><button type="button" class="cn-bas" hidden aria-label="Revenir en bas" title="Revenir en bas">↓</button></div><div class="cn-sug"></div>'
    +'<div class="cn-ed" hidden><span>Tu modifies ta question : les réponses suivantes seront remplacées.</span><button type="button">Annuler</button></div>'
    +'<form class="cn-f" autocomplete="off"><label class="cn-sr" for="cn-q">Ta question '+(normal?'à Tristana':'au Ver')+'</label><textarea id="cn-q" rows="1" maxlength="2000" enterkeyhint="send" placeholder="'+(normal?'Écrire à Tristana…':'Parle au Ver…')+'" title="Entrée pour envoyer, Maj+Entrée pour aller à la ligne"></textarea>'
    +'<button type="button" class="cn-mic" hidden aria-pressed="false" aria-label="Dicter ta question" title="Dicter ta question (service vocal du navigateur)"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg></button>'
    +'<button type="submit" aria-label="Demander">➤</button></form>'
    +'</section>');
  var log=pan.querySelector('.cn-log'),sug=pan.querySelector('.cn-sug'),inp=pan.querySelector('textarea'),envoyer=pan.querySelector('.cn-f button[type=submit]'),ed=pan.querySelector('.cn-ed'),ouvert=false,hist=[];
  var basB=pan.querySelector('.cn-bas'),grandB=pan.querySelector('.cn-gr'),mic=pan.querySelector('.cn-mic');
  try{hist=JSON.parse(sessionStorage.getItem(SS+'-'+couche)||'[]');}catch(_){hist=[];}
  var IA_CLE=SS+'-ia'+(normal?'-normal':''),iaURL='',iaActive=false,iaConfig=null,iaRequete=null,iaOptions=pan.querySelector('.cn-ai');
  iaOptions.addEventListener('toggle',function(){pan.classList.toggle('cn-ai-settings',iaOptions.open);});
  function majIA(){
    pan.querySelector('.cn-h small').textContent=iaActive?
      ROLE+' Conversation IA via Cloudflare ; réponses à vérifier.':
      ROLE+' Dialogue local, sans IA générative.';
    iaOptions.querySelector('.cn-ai-on').hidden=iaActive;
    iaOptions.querySelector('.cn-ai-off').hidden=!iaActive;
    majRelance();
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
      try{iaActive=sessionStorage.getItem(IA_CLE)===iaURL;}catch(e){console.warn('Le Ver : consentement non restauré.');}
      majIA();
    }).catch(function(e){
      iaConfig=null;console.error('Le Ver : configuration IA inaccessible.',e);
      pan.querySelector('.cn-h small').textContent='IA inaccessible. Le dialogue local reste disponible.';
    }).finally(function(){clearTimeout(timer);});
  }
  iaOptions.querySelector('.cn-ai-on').addEventListener('click',function(){
    if(occupeQuestion){toast('Attends la fin de cette réponse.');return;}
    iaActive=true;
    try{sessionStorage.setItem(IA_CLE,iaURL);}catch(e){console.warn('Le Ver : consentement non mémorisé.');toast('Accord valable sur cette page seulement.');}
    majIA();iaOptions.open=false;toast('Conversation IA activée. Les échanges restent limités à cette session.');
  });
  iaOptions.querySelector('.cn-ai-off').addEventListener('click',function(){
    iaActive=false;
    if(iaRequete)iaRequete.controleur.abort();
    try{sessionStorage.removeItem(IA_CLE);}catch(e){console.warn('Le Ver : retrait du consentement non mémorisé.');toast('Retrait valable sur cette page seulement.');}
    majIA();iaOptions.open=false;toast('Dialogue local : aucun nouvel échange envoyé à l’IA.');
  });
  pan.querySelector('.cn-new').addEventListener('click',function(){
    if(occupeQuestion){toast('Attends la fin de la réponse, ou arrête-la avec ■.');return;}
    var efface=true;
    try{sessionStorage.removeItem(SS+'-'+couche);}catch(e){efface=false;console.warn('Le Ver : stockage de l’historique inaccessible.');}
    hist=[];garde();annuleEdition(true);log.textContent='';ajoute({r:'a',h:esc(ACC[couche]),ac:1},false);majRelance();
    toast(efface?'Nouvelle conversation. L’historique de cette couche est effacé dans cet onglet.':'Historique visible effacé, mais le stockage de cet onglet est inaccessible.');
    try{inp.focus({preventScroll:true});}catch(_){}
  });
  var ICO_GR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5"/></svg>',
    ICO_PT='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10h-6V4M4 14h6v6M14 10l6.5-6.5M10 14l-6.5 6.5"/></svg>';
  function majGrand(g){
    pan.classList.toggle('cn-grand',g);grandB.setAttribute('aria-pressed',g?'true':'false');
    var t=g?'Réduire la fenêtre':'Agrandir la fenêtre';
    grandB.setAttribute('aria-label',t);grandB.title=t;grandB.innerHTML=g?ICO_PT:ICO_GR;
  }
  try{majGrand(localStorage.getItem('lcdm-ver-grand')==='1');}catch(_){majGrand(false);}
  grandB.addEventListener('click',function(){
    var g=!pan.classList.contains('cn-grand');majGrand(g);
    try{localStorage.setItem('lcdm-ver-grand',g?'1':'0');}catch(_){}
    if(colle)bas();
  });

  var IC={
    copie:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    ok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    edite:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    relance:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/></svg>',
    partage:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>'
  };
  function icone(nom,label,fn){
    var b=D.createElement('button');b.type='button';b.className='cn-ic';b.innerHTML=IC[nom];
    b.setAttribute('aria-label',label);b.title=label;
    b.addEventListener('click',function(e){e.stopPropagation();fn(b);});
    return b;
  }
  /* le défilement suit la réponse, sauf si on est remonté relire plus haut */
  var colle=true;
  function majBas(){basB.hidden=colle||log.scrollHeight<=log.clientHeight+4;}
  log.addEventListener('scroll',function(){colle=log.scrollHeight-log.scrollTop-log.clientHeight<48;majBas();},{passive:true});
  basB.addEventListener('click',function(){bas();try{inp.focus({preventScroll:true});}catch(_){}});
  function garde(){hist=hist.slice(-48);try{sessionStorage.setItem(SS+'-'+couche,JSON.stringify(hist));}catch(_){}}
  function bas(){log.scrollTop=log.scrollHeight;colle=true;majBas();}
  function bulle(m,anim){
    var w=D.createElement('div');w.className='cn-w cn-w'+m.r;w._m=m;
    var d=D.createElement('div');d.className='cn-m '+m.r;
    if(m.r==='q'){
      d.textContent=m.t;
      w.appendChild(icone('edite','Modifier cette question',function(){edite(w);}));
      w.appendChild(d);log.appendChild(w);bas();return;
    }
    w.appendChild(d);
    if(!m.ac){var act=D.createElement('div');act.className='cn-act';act.appendChild(icone('copie','Copier la réponse',function(b){copie(d,b);}));
      if(!m.err&&window.HTMLCanvasElement)act.appendChild(icone('partage','Partager en image',function(b){partage(w,b);}));
      w.appendChild(act);}
    log.appendChild(w);
    var corps=m.h;
    if(!anim||calme){d.innerHTML=corps;bas();return;}
    bas();
    /* l'écriture à la main : le texte de la citation apparaît lettre à lettre, les liens à la fin */
    var tmp=D.createElement('div');tmp.innerHTML=corps;
    var noeuds=[],tw=D.createTreeWalker(tmp,NodeFilter.SHOW_TEXT,null),n;
    while((n=tw.nextNode()))noeuds.push([n,n.nodeValue]);
    noeuds.forEach(function(x){x[0].nodeValue='';});
    d.appendChild(tmp);
    var total=noeuds.reduce(function(a,x){return a+x[1].length;},0),pas=Math.max(2,Math.ceil(total/70)),i=0,k=0;
    (function tape(){
      var r=pas;
      while(r>0&&i<noeuds.length){var x=noeuds[i],reste=x[1].length-x[0].nodeValue.length,p=Math.min(r,reste);x[0].nodeValue=x[1].slice(0,x[0].nodeValue.length+p);r-=p;if(x[0].nodeValue.length>=x[1].length)i++;}
      if(colle)bas();if(i<noeuds.length&&++k<400)setTimeout(tape,16);else noeuds.forEach(function(x){x[0].nodeValue=x[1];});
    })();
  }
  function ajoute(m,anim){hist.push(m);garde();bulle(m,anim);if(m.r==='a')suggestions();}
  function rendu(){log.textContent='';hist.forEach(function(m){bulle(m,false);});suggestions();majRelance();bas();}
  function dernierQ(){for(var i=hist.length-1;i>=0;i--)if(hist[i].r==='q')return i;return -1;}
  /* « Autre réponse » sur la dernière réponse de l'IA, « Réessayer » après un échec ;
     les gestes de forme reposent la même question pour une réponse plus courte, plus longue ou plus simple */
  var FORMES=[['court','Plus court'],['long','Développer'],['simple','Plus simple']];
  function retireGestes(){Array.prototype.forEach.call(log.querySelectorAll('.cn-relance,.cn-fo'),function(b){b.remove();});}
  function majRelance(){
    retireGestes();
    if(occupeQuestion)return;
    var ws=log.querySelectorAll('.cn-wa'),w=ws[ws.length-1];if(!w)return;
    var m=w._m,i=hist.indexOf(m),act=w.querySelector('.cn-act');
    if(!act||i<1||i!==hist.length-1||hist[i-1].r!=='q'||!(m.ai||m.err))return;
    var b=icone('relance',m.err?'Réessayer':'Autre réponse',function(){relance(m.forme);});b.classList.add('cn-relance');act.appendChild(b);
    if(!m.ai||!iaActive)return;
    FORMES.forEach(function(f){
      if(m.forme===f[0])return;
      var g=D.createElement('button');g.type='button';g.className='cn-fo';g.textContent=f[1];
      g.title=f[1]+' : même question, autre forme de réponse';
      g.addEventListener('click',function(e){e.stopPropagation();relance(f[0]);});
      act.appendChild(g);
    });
  }
  function relance(forme){
    if(occupeQuestion)return;
    var i=dernierQ();if(i<0)return;
    var q=hist[i].t;annuleEdition(true);hist=hist.slice(0,i);garde();rendu();demande(q,forme);
  }
  function copie(d,b){
    var t=(d.innerText||d.textContent).replace(/[ \t]*\[S\d+\]/g,'').replace(/\n{3,}/g,'\n\n').trim();
    function ok(){
      b.classList.add('ok');b.innerHTML=IC.ok;b.setAttribute('aria-label','Copié');b.title='Copié';
      setTimeout(function(){b.classList.remove('ok');b.innerHTML=IC.copie;b.setAttribute('aria-label','Copier la réponse');b.title='Copier la réponse';},1600);
    }
    function repli(){
      var ta=D.createElement('textarea'),r=false;ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';
      pan.appendChild(ta);ta.select();try{r=D.execCommand('copy');}catch(_){}ta.remove();try{b.focus({preventScroll:true});}catch(_){}
      if(r)ok();else toast('Copie impossible : sélectionne le texte à la main.');
    }
    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,repli);else repli();
  }
  /* partager en image : une réponse, ou la fiche d'un disque, en 1080×1350 (ou 1080×1920 pour les stories),
     aux couleurs de la couche ; crédit daté en chiffres romains de l'année de publication du contenu */
  var TEINTES={
    putride:{fond:['#14002a','#030007'],c:'#39ff6a',c2:'#d6b0ff',t:'#f1e8ff',lueur:'rgba(122,45,214,.55)'},
    cachot:{fond:['#220005','#000'],c:'#ff1736',c2:'#ffe23f',t:'#ffe9a8',lueur:'rgba(225,0,25,.45)'},
    normal:{fond:['#00006e','#000012'],c:'#fc0',c2:'#ff3b3b',t:'#fff',lueur:'rgba(255,0,0,.35)'}
  };
  function romain(n){
    var r='',v=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    n=Math.floor(n);if(!(n>0))return '';
    v.forEach(function(x){while(n>=x[0]){r+=x[1];n-=x[0];}});
    return r;
  }
  function lignes(ctx,texte,large){
    var r=[];
    texte.split('\n').forEach(function(par){
      var l='';
      par.split(/\s+/).forEach(function(w){
        if(!w)return;
        var x=l?l+' '+w:w;
        if(ctx.measureText(x).width>large&&l){r.push(l);l=w;}else l=x;
      });
      r.push(l);
    });
    return r;
  }
  function textePartage(h){
    var t=D.createElement('template');t.innerHTML=h;var c=t.content;
    Array.prototype.forEach.call(c.querySelectorAll('.va,a.lire,br'),function(x){x.replaceWith(x.tagName==='BR'?'\n':'');});
    Array.prototype.forEach.call(c.querySelectorAll('.src,q'),function(x){x.prepend('\n');x.append('\n');});
    return c.textContent.replace(/[ \t]*\[S\d+\]/g,'').replace(/[ \t]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{2,}/g,'\n').trim();
  }
  /* espacement des lettres à la main : ctx.letterSpacing manque à certains navigateurs */
  function espace(ctx,texte,x,y,ecart,centre){
    var ch=Array.from(texte),l=ch.reduce(function(a,c){return a+ctx.measureText(c).width;},0)+ecart*(ch.length-1);
    if(centre)x-=l/2;
    ch.forEach(function(c){ctx.fillText(c,x,y);x+=ctx.measureText(c).width+ecart;});
    return l;
  }
  function ajuste(ctx,texte,police,taille,large){
    for(;taille>24;taille-=2){ctx.font=police.replace('#',taille);if(ctx.measureText(texte).width<=large)break;}
    return taille;
  }
  /* fond de cinéma : dégradé (ou pochette floutée), halo, vignette, grain, bandes noires */
  function fondCinema(ctx,W,Hh,T,pochette){
    var g=ctx.createLinearGradient(0,0,0,Hh);g.addColorStop(0,T.fond[0]);g.addColorStop(1,T.fond[1]);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,Hh);
    if(pochette){
      ctx.save();ctx.globalAlpha=.5;
      if('filter' in ctx)ctx.filter='blur(46px) saturate(1.2)';
      var s=Math.max(W,Hh)*1.25;ctx.drawImage(pochette,(W-s)/2,(Hh-s)/2,s,s);
      ctx.restore();
      ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,0,W,Hh);
    }
    var h=ctx.createRadialGradient(W/2,Hh*.3,0,W/2,Hh*.3,W*.85);h.addColorStop(0,T.lueur);h.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=h;ctx.fillRect(0,0,W,Hh);
    var v=ctx.createRadialGradient(W/2,Hh/2,Math.min(W,Hh)*.35,W/2,Hh/2,Math.max(W,Hh)*.78);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.82)');
    ctx.fillStyle=v;ctx.fillRect(0,0,W,Hh);
    var gr=D.createElement('canvas');gr.width=gr.height=160;
    var gc=gr.getContext('2d'),px=gc.createImageData(160,160);
    for(var i=0;i<px.data.length;i+=4){var n=Math.random()*255|0;px.data[i]=px.data[i+1]=px.data[i+2]=n;px.data[i+3]=16;}
    gc.putImageData(px,0,0);ctx.fillStyle=ctx.createPattern(gr,'repeat');ctx.fillRect(0,0,W,Hh);
    ctx.fillStyle='#000';ctx.fillRect(0,0,W,22);ctx.fillRect(0,Hh-22,W,22);
    ctx.strokeStyle=T.c;ctx.globalAlpha=.55;ctx.lineWidth=1.5;ctx.strokeRect(46,46,W-92,Hh-92);
    ctx.globalAlpha=.22;ctx.strokeRect(56,56,W-112,Hh-112);ctx.globalAlpha=1;
  }
  /* mentions discrètes : « Fourni par le Ver du Baptistère » en haut chez le Ver, le crédit daté en bas */
  function mentions(ctx,W,Hh,T,annee){
    ctx.textBaseline='alphabetic';ctx.fillStyle=T.t;ctx.globalAlpha=.55;ctx.font='22px Georgia,serif';
    if(!normal)espace(ctx,'FOURNI PAR LE VER DU BAPTISTÈRE',W/2,92,4,true);
    espace(ctx,'© PUANTEUR PUTRIDE Productions, '+romain(annee),W/2,Hh-74,2,true);
    ctx.globalAlpha=1;
  }
  function pied(ctx,W,Hh,T,y){
    ctx.textBaseline='alphabetic';ctx.fillStyle=T.c;ctx.globalAlpha=.9;ctx.fillRect(W/2-60,y-58,120,2);ctx.globalAlpha=1;
    ctx.font='50px "Bebas Neue",Impact,sans-serif';espace(ctx,'LACREATUREDUMARAIS.FR',W/2,y,6,true);
  }
  function dessine(question,texte,logo){
    var W=1080,Hh=1350,M=110,cv=D.createElement('canvas'),ctx=cv.getContext('2d'),T=TEINTES[couche];
    cv.width=W;cv.height=Hh;
    fondCinema(ctx,W,Hh,T,null);
    if(logo){ctx.save();ctx.globalAlpha=.06;ctx.drawImage(logo,W-560,Hh-700,620,620);ctx.restore();}
    ctx.textBaseline='top';
    var titre=normal?'TRISTANA':'LE VER',y=132;
    ctx.fillStyle=T.c2;ctx.font='92px "Bebas Neue",Impact,sans-serif';
    if(logo){ctx.drawImage(logo,M,y-2,92,92);espace(ctx,titre,M+118,y,5);}else espace(ctx,titre,M,y,5);
    y+=98;ctx.fillStyle=T.t;ctx.globalAlpha=.7;ctx.font='28px "Bebas Neue",Impact,sans-serif';
    espace(ctx,normal?'ATTACHÉE DE PRESSE · PUANTEUR PUTRIDE PRODUCTIONS':'SERVITEUR DE KOBAL · LE VAMPIRIUM',logo?M+118:M,y-10,3);
    ctx.globalAlpha=1;y+=56;
    var large=W-2*M,fin=Hh-250;
    if(question){
      ctx.fillStyle=T.c;ctx.font='italic 38px Georgia,serif';
      var lq=lignes(ctx,'« '+question.replace(/\s+/g,' ').slice(0,220)+' »',large).slice(0,3);
      lq.forEach(function(l){ctx.fillText(l,M,y);y+=50;});y+=34;
    }
    /* la taille du texte s'adapte ; au plus petit, la fin est coupée net avec « … » */
    var taille=62,ls;
    for(;;){
      ctx.font=taille+'px Georgia,serif';ls=lignes(ctx,texte,large);
      if(y+ls.length*taille*1.4<=fin||taille<=30)break;
      taille-=2;
    }
    var max=Math.floor((fin-y)/(taille*1.4));
    if(ls.length>max){ls=ls.slice(0,Math.max(1,max));ls[ls.length-1]=ls[ls.length-1].replace(/\s*\S*$/,'')+' …';}
    else y+=Math.max(0,(fin-y-ls.length*taille*1.4)/3);
    ctx.fillStyle=T.c;ctx.globalAlpha=.8;ctx.fillRect(M-34,y+8,4,ls.length*taille*1.4-taille*.3);ctx.globalAlpha=1;
    ctx.fillStyle=T.t;ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=12;
    ls.forEach(function(l){ctx.fillText(l,M,y);y+=taille*1.4;});
    ctx.shadowBlur=0;
    pied(ctx,W,Hh,T,Hh-136);
    mentions(ctx,W,Hh,T,new Date().getFullYear());
    return cv;
  }
  /* la fiche d'un disque : pochette, titre, ligne de dates, et le jour J un bandeau « DISPONIBLE » */
  function dessineDisque(f,pochette,histoire){
    var W=1080,Hh=histoire?1920:1350,cv=D.createElement('canvas'),ctx=cv.getContext('2d'),T=TEINTES[couche];
    cv.width=W;cv.height=Hh;
    fondCinema(ctx,W,Hh,T,pochette);
    var c=histoire?820:680,x=(W-c)/2,y=186;
    /* en story, le bloc pochette + titre est centré dans l'espace libre entre les mentions et le pied */
    if(histoire){var bloc=34+c+(f.bandeau?150:140)+(f.meta?70:0)+(f.appel?110:0);y=Math.max(190,Math.round(150+(Hh-420-bloc)/2+34));}
    ctx.textBaseline='alphabetic';ctx.fillStyle=T.t;ctx.globalAlpha=.78;ctx.font='30px "Bebas Neue",Impact,sans-serif';
    espace(ctx,f.artiste.toUpperCase(),W/2,y-34,8,true);ctx.globalAlpha=1;
    ctx.save();ctx.shadowColor=T.lueur;ctx.shadowBlur=70;ctx.fillStyle='#000';ctx.fillRect(x,y,c,c);ctx.restore();
    ctx.save();ctx.shadowColor='rgba(0,0,0,.9)';ctx.shadowBlur=40;ctx.shadowOffsetY=18;
    if(pochette){
      var s=Math.min(pochette.naturalWidth||pochette.width,pochette.naturalHeight||pochette.height);
      ctx.drawImage(pochette,((pochette.naturalWidth||pochette.width)-s)/2,((pochette.naturalHeight||pochette.height)-s)/2,s,s,x,y,c,c);
    }
    ctx.restore();
    ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,c-1,c-1);
    if(f.bandeau){
      var bh=histoire?104:90,by=y+c-bh*.55;
      ctx.save();ctx.shadowColor=T.lueur;ctx.shadowBlur=30;ctx.fillStyle=T.c;ctx.fillRect(x-40,by,c+80,bh);ctx.restore();
      ctx.fillStyle='#000';ctx.font=(histoire?78:68)+'px "Bebas Neue",Impact,sans-serif';
      espace(ctx,f.bandeau,W/2,by+bh*.78,f.bandeau.length>14?4:12,true);
    }
    y+=c+(f.bandeau?(histoire?150:118):(histoire?140:104));
    ctx.fillStyle=T.c2;var tt=ajuste(ctx,f.titre.toUpperCase(),'#px "Bebas Neue",Impact,sans-serif',histoire?150:118,W-200);
    ctx.shadowColor='rgba(0,0,0,.8)';ctx.shadowBlur=18;espace(ctx,f.titre.toUpperCase(),W/2,y,tt>80?6:3,true);ctx.shadowBlur=0;
    y+=histoire?70:56;
    if(f.meta){ctx.fillStyle=T.t;ctx.globalAlpha=.82;ajuste(ctx,f.meta.toUpperCase(),'#px "Bebas Neue",Impact,sans-serif',34,W-220);
      espace(ctx,f.meta.toUpperCase(),W/2,y,3,true);ctx.globalAlpha=1;}
    if(f.appel){ctx.fillStyle=T.c;ctx.font='italic '+(histoire?40:34)+'px Georgia,serif';ctx.textAlign='center';ctx.fillText(f.appel,W/2,y+(histoire?110:66));ctx.textAlign='left';}
    pied(ctx,W,Hh,T,Hh-(histoire?190:136));
    mentions(ctx,W,Hh,T,f.annee);
    return cv;
  }
  function exporte(cv,nomF,b){
    return new Promise(function(ok,ko){cv.toBlob(function(bl){bl?ok(bl):ko(new Error('image'));},'image/png');}).then(function(bl){
      var f=null;
      try{f=new File([bl],nomF,{type:'image/png'});}catch(_){}
      if(f&&navigator.canShare&&navigator.canShare({files:[f]}))
        return navigator.share({files:[f],title:'La Créature du Marais',text:'https://lacreaturedumarais.fr'+location.pathname}).catch(function(e){if(e&&e.name!=='AbortError')throw e;});
      var a=D.createElement('a'),u=URL.createObjectURL(bl);a.href=u;a.download=nomF;D.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(u);},4000);
      toast(normal?'Image enregistrée : publiez-la où vous voulez.':'Image enregistrée : publie-la où tu veux.');
    }).catch(function(e){console.error('Partage en image impossible.',e);toast('Image impossible à créer sur cet appareil.');})
      .finally(function(){if(b)b.disabled=false;});
  }
  function polices(){return D.fonts&&D.fonts.load?Promise.all([D.fonts.load('96px "Bebas Neue"'),D.fonts.load('46px Georgia'),D.fonts.load('italic 40px Georgia')]).catch(function(){}):Promise.resolve();}
  function image(src){return new Promise(function(ok){if(!src){ok(null);return;}var im=new Image();im.onload=function(){ok(im);};im.onerror=function(){ok(null);};im.src=src;});}
  function partage(w,b){
    var i=hist.indexOf(w._m),q='',texte=textePartage(w._m.h||'');
    for(var j=i-1;j>=0;j--)if(hist[j].r==='q'){q=hist[j].t;break;}
    if(/^Explique ce passage/i.test(q))q='';
    if(!texte){toast('Rien à partager dans cette réponse.');return;}
    b.disabled=true;
    Promise.all([polices(),normal?image('/images/cachot/logo-pp-blanc.webp'):null]).then(function(r){
      return exporte(dessine(q,texte,r[1]),(normal?'tristana':'le-ver')+'-lacreaturedumarais.png',b);
    });
  }
  /* sur chaque page de disque, sous les plateformes : « Partager en image » (et le format story) */
  var MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  function dateDisque(ah){
    var ld=Array.prototype.map.call(D.querySelectorAll('script[type="application/ld+json"]'),function(s){return s.textContent;}).join(' ');
    var m=/"datePublished"\s*:\s*"(\d{4})(?:-(\d\d)-(\d\d))?/.exec(ld);
    if(m)return {a:+m[1],m:m[2]?+m[2]:0,j:m[3]?+m[3]:0};
    var t=(ah.querySelector('.meta,.am')||{}).textContent||'';
    if((m=/(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(t)))return {a:+m[3],m:+m[2],j:+m[1]};
    if((m=new RegExp('(\\d{1,2})(?:er)? ('+MOIS.join('|')+') (\\d{4})').exec(t)))return {a:+m[3],m:MOIS.indexOf(m[2])+1,j:+m[1]};
    if((m=/\b(19|20)\d\d\b/.exec(t)))return {a:+m[0],m:0,j:0};
    return null;
  }
  function ficheDisque(ah){
    var h1=ah.querySelector('h1')||D.querySelector('main h1, .wrap h1, h1'),img=ah.querySelector('img');
    if(!h1||!img)return null;
    var meta=((ah.querySelector('.meta,.am')||{}).textContent||'').replace(/\s+/g,' ').trim();
    var alp=ah.closest('.alp'),d=dateDisque(ah),t=Date.now(),bandeau='',appel='';
    var artiste=normal?'Cul-Pointu · La Créature du Marais':(alp&&alp.getAttribute('data-artist'))||'Cul-Pointu';
    var s=SORTIES.find(function(x){return x.page.test(location.pathname);});
    var jour=s?s.date:d&&d.m&&d.j?Date.UTC(d.a,d.m-1,d.j,12):0;
    if(jour&&t<jour){var dj=new Date(jour);bandeau=s&&s.libelle||'LE '+dj.getUTCDate()+' '+MOIS[dj.getUTCMonth()].toUpperCase();appel='Bientôt partout.';}
    else if(jour&&t-jour<15*864e5){bandeau='DISPONIBLE';appel='Disponible partout.';}
    return {titre:h1.textContent.replace(/\s+/g,' ').trim(),meta:meta.split(' · ').slice(0,3).join(' · '),artiste:artiste,
      annee:d?d.a:new Date().getFullYear(),pochette:img.currentSrc||img.src,bandeau:bandeau,appel:appel||(normal?'Écoutez sur toutes les plateformes.':'')};
  }
  function partageDisque(ah,b,histoire){
    var f=ficheDisque(ah);if(!f){toast('Rien à partager sur cette page.');return;}
    b.disabled=true;
    Promise.all([polices(),image(f.pochette)]).then(function(r){
      var nomF=f.titre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+(histoire?'-story':'')+'-lacreaturedumarais.png';
      return exporte(dessineDisque(f,r[1],histoire),nomF,b);
    });
  }
  function boutonsDisque(){
    if(!/\/discographie\/[^/]+\/(?:index\.html)?$/.test(location.pathname)||!window.HTMLCanvasElement)return;
    Array.prototype.forEach.call(D.querySelectorAll('.ah'),function(ah){
      var zone=ah.querySelector('.abt')||ah.querySelector('.ah-text');
      if(!zone||ah.querySelector('.cn-pdisque'))return;
      var r=D.createElement('div');r.className='cn-pdisque';
      var b=D.createElement('button');b.type='button';b.className='btn cn-pd';b.textContent='PARTAGER EN IMAGE';
      b.title='Créer une image de ce disque pour les réseaux (format publication)';
      var s=D.createElement('button');s.type='button';s.className='btn cn-pd cn-pds';s.textContent='FORMAT STORY';
      s.title='Créer une image verticale 9:16 pour les stories Instagram et TikTok';
      b.addEventListener('click',function(){partageDisque(ah,b,false);});
      s.addEventListener('click',function(){partageDisque(ah,s,true);});
      r.appendChild(b);r.appendChild(s);
      zone.appendChild(r);
    });
  }
  /* modifier une question : elle revient dans le champ ; à l'envoi, l'échange reprend depuis elle */
  var edition=null,brouillon='';
  function hauteur(){
    if(!inp.value||pan.hidden){inp.style.height='';return;}
    inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight+2,140)+'px';
  }
  function edite(w){
    if(occupeQuestion){toast('Attends la fin de cette réponse.');return;}
    if(hist.indexOf(w._m)<0){toast('Cette question est trop ancienne pour être modifiée.');return;}
    if(!edition)brouillon=inp.value;
    edition=w._m;ed.hidden=false;
    var x=log.querySelector('.cn-edit');if(x)x.classList.remove('cn-edit');w.classList.add('cn-edit');
    try{w.scrollIntoView({block:'nearest'});}catch(_){}
    inp.value=w._m.t;hauteur();
    try{inp.focus({preventScroll:true});inp.setSelectionRange(inp.value.length,inp.value.length);}catch(_){}
  }
  function annuleEdition(rendre){
    if(!edition)return;
    edition=null;ed.hidden=true;
    var x=log.querySelector('.cn-edit');if(x)x.classList.remove('cn-edit');
    if(rendre){inp.value=brouillon;hauteur();}
    brouillon='';
  }
  ed.querySelector('button').addEventListener('click',function(){annuleEdition(true);inp.focus();});
  function envoi(){
    if(occupeQuestion){toast('Laisse-moi finir cette réponse avant de reprendre.');return;}
    arreteDictee();
    var q=inp.value.trim();if(!q)return;
    if(edition){
      var i=hist.indexOf(edition);annuleEdition();
      if(i>=0){hist=hist.slice(0,i);garde();rendu();}
    }
    inp.value='';hauteur();demande(q);
  }
  inp.addEventListener('input',hauteur);
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();envoi();}
    else if(e.key==='Escape'&&edition){e.preventDefault();e.stopPropagation();annuleEdition(true);}
  });
  /* trois suggestions au plus, dans cet ordre : relances proposées par l'IA, suite du sujet en cours,
     page consultée, puis les amorces de la couche ; jamais une question déjà posée */
  function suggestions(){
    sug.innerHTML='';
    var vu={},choix=[],p=precedent(),n0;
    hist.forEach(function(m){if(m.r==='q')vu[norm(m.t)]=1;});
    function pousse(q,max){
      if(typeof q!=='string'||choix.length>=Math.min(3,max==null?3:max))return;
      var k=norm(q);if(!k||vu[k])return;
      vu[k]=1;choix.push(q);
    }
    if(p&&Array.isArray(p.suites))p.suites.forEach(function(q){pousse(q);});
    if(p&&p.dialogue)(normal?['Et vous ?','Pourquoi ?','Que gardent vos archives ?']:['Et toi ?','Pourquoi ?','Qui est ton maître ?']).forEach(function(q){pousse(q,2);});
    sortie().forEach(function(q){pousse(q,choix.length+2);});
    if(!p||p.ac)amorcesPage().forEach(function(q){pousse(q,choix.length+2);});
    if(KB){
      n0=choix.length;suitesSujet(p).forEach(function(q){pousse(q,n0+2);});
      n0=choix.length;suitesPage(p).forEach(function(q){pousse(q,n0+2);});
    }
    SUG[couche].forEach(function(q){pousse(q);});
    choix.forEach(function(q){var b=D.createElement('button');b.type='button';b.textContent=q;b.addEventListener('click',function(){demande(q);});sug.appendChild(b);});
  }
  /* sorties annoncées : des amorces propres à leurs pages, et avant la date, une invitation sur le site normal */
  var SORTIES=[{page:/monsieur-clerge/,date:Date.parse('2026-11-30T17:30:00Z'),libelle:'LE 30 NOVEMBRE · 18 H 30',
    avant:['Que se passe-t-il le 30 novembre ?'],
    page_normal:['Qui est Monsieur Clergé ?','Où écouter Monsieur Clergé ?','Que raconte le clip ?'],
    page_autre:['Qui est Monsieur Clergé ?','Monsieur Clergé, c’est qui au Vampirium ?']}];
  function sortie(){
    var r=[],t=Date.now();
    SORTIES.forEach(function(s){
      if(s.page.test(location.pathname))r=r.concat(normal?s.page_normal:s.page_autre);
      else if(normal&&t<s.date)r=r.concat(s.avant);
    });
    return r;
  }
  /* amorces propres à la page consultée : un disque, la biographie, la presse… */
  function amorcesPage(){
    var u=location.pathname.replace(/index\.html$/,''),img=D.querySelector('.ah img');
    if(/\/discographie\/[^/]+\/$/.test(u)){
      var single=img&&/du single|single/i.test(img.alt+' '+((D.querySelector('.ah .meta,.ah .am')||{}).textContent||''));
      return normal?(single?['Que raconte ce single ?','D’où vient ce titre ?']:['Quel morceau écouter en premier ?','Que raconte cet album ?'])
        :(single?['Que raconte ce single ?']:['Quel morceau écouter en premier ?','Que cache cet album ?']);
    }
    if(!normal)return [];
    if(/^\/discographie\/$/.test(u))return ['Par quel disque commencer ?','Quelle est la dernière sortie ?'];
    if(/^\/biographie\/$/.test(u))return ['D’où vient Cul-Pointu ?','Qui est Tancrède Charon ?'];
    if(/^\/presse\/$/.test(u))return ['Demander un dossier de presse','Quelle est l’actualité du label ?'];
    if(/^\/videos?\//.test(u))return ['Quel clip regarder d’abord ?'];
    if(/^\/nouvelles\//.test(u))return ['Quelle est la prochaine sortie ?','Comment suivre les sorties ?'];
    if(/^\/contact\/$/.test(u))return ['Comment proposer un concert ?'];
    return [];
  }
  function pageDe(url){
    if(!KB||typeof url!=='string')return -1;url=url.split('#')[0];
    return KB.P.findIndex(function(x){return x[1]===url&&!/^Repère /.test(x[0]);});
  }
  function pageCourante(){return pageDe(location.pathname.replace(/index\.html$/,''));}
  /* « Les saints · Saint RomainDOMPTEUR » devient « Saint Romain » */
  function titreSection(h){return String(h).split(' · ').pop().replace(/([a-zà-ÿ’'»)\d])[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ .’'-]{2,}$/,'$1').trim();}
  function sections(pi){
    var r=[],vus={};
    KB.E.forEach(function(e,ix){if(e.p===pi&&e.h&&e.a&&e.k!==2&&e.h!=='Surnom'&&!vus[e.h]){vus[e.h]=1;r.push(ix);}});
    return r;
  }
  function chapeau(pi){
    var i=KB.E.findIndex(function(e){return e.p===pi&&e.k===1;});
    return i>=0?i:KB.E.findIndex(function(e){return e.p===pi&&e.k!==2;});
  }
  function vusIx(){return hist.filter(function(m){return m.r==='a'&&m.ix!=null;}).map(function(m){return m.ix;});}
  function sectionNeuve(pi){
    var tetes=vusIx().map(function(ix){return KB.E[ix]&&KB.E[ix].h;});
    var s=sections(pi).find(function(ix){return tetes.indexOf(KB.E[ix].h)<0;});
    return s==null?'':titreSection(KB.E[s].h);
  }
  function court(pi){return KB.P[pi][0].replace(/^(La|Le|Les) /,function(a){return a.toLowerCase();});}
  function questionSur(pi){
    var t=KB.P[pi][0],u=KB.P[pi][1];
    if(/\/discographie\//.test(u))return 'Parle-moi de « '+t+' »';
    if(/\/(?:bestiaire\/(?!rouen\/|saints-de-rouen\/)|cachot\/(?:kavod|noo-noo|puanteur))/.test(u))
      return /^Les /.test(t)?'Qui sont les '+t.slice(4)+' ?':'Qui est '+court(pi)+' ?';
    return 'Parle-moi '+(/^Le /.test(t)?'du '+t.slice(3):/^Les /.test(t)?'des '+t.slice(4):/^La /.test(t)?'de la '+t.slice(3):/^L’/.test(t)?'de l’'+t.slice(2):'de '+t);
  }
  function suitesSujet(p){
    var r=[];if(!p)return r;
    var pi=pageDe(p.sujet||(p.sources&&p.sources[0])),vus=vusIx();
    if(pi<0)return r;
    if(p.ix!=null&&!p.ai&&KB.E.some(function(e,ix){return e.p===pi&&e.k!==2&&vus.indexOf(ix)<0;}))r.push('Dis-m’en plus');
    var s=sectionNeuve(pi);if(s)r.push('Et « '+s+' » ?');
    var texte=typeof p.t==='string'?p.t:String(p.h||'').replace(/<[^>]+>/g,' ').replace(/&\w+;/g,' ');
    entites(texte).forEach(function(i){if(i!==pi&&r.length<4)r.push(questionSur(i));});
    /* deux personnages abordés à la suite : leur lien */
    var sujets=[];
    for(var i=hist.length-1;i>=0&&sujets.length<2;i--){
      var j=hist[i].r==='a'?pageDe(hist[i].sujet||(hist[i].sources&&hist[i].sources[0])):-1;
      if(j>=0&&/\/bestiaire\//.test(KB.P[j][1])&&sujets.indexOf(j)<0)sujets.push(j);
    }
    if(sujets.length===2)r.push('Quel lien entre '+court(sujets[1])+' et '+court(sujets[0])+' ?');
    return r;
  }
  function suitesPage(p){
    var pc=pageCourante(),r=[];if(pc<0)return r;
    r.push('Résume cette page');
    /* la page déjà au cœur de l'échange : sa prochaine section est proposée par la suite du sujet */
    var s=pageDe(p&&(p.sujet||(p.sources&&p.sources[0])))===pc?'':sectionNeuve(pc);if(s)r.push('Raconte « '+s+' »');
    var c=chapeau(pc);
    if(c>=0)entites(KB.E[c].t).some(function(i){if(i!==pc){r.push(questionSur(i));return true;}return false;});
    return r;
  }
  function ouvre(){
    if(ouvert)return;ouvert=true;pan.hidden=false;ob.setAttribute('aria-expanded','true');
    configureIA();
    D.dispatchEvent(new CustomEvent('ver:dialogue',{detail:true}));
    if(!log.childNodes.length){
      if(!hist.length)hist.push({r:'a',h:esc(ACC[couche]),ac:1});
      rendu();
    }else{suggestions();bas();}
    /* les registres chargés, les suggestions connaissent la page consultée */
    if(!KB)charge().then(function(){if(ouvert&&!occupeQuestion)suggestions();},function(){});
    hauteur();
    if(matchMedia('(pointer:fine)').matches)setTimeout(function(){try{inp.focus({preventScroll:true});}catch(_){}},60);
  }
  function ferme(){if(!ouvert)return;ouvert=false;arreteDictee();pan.hidden=true;ob.setAttribute('aria-expanded','false');D.dispatchEvent(new CustomEvent('ver:dialogue',{detail:false}));}
  ob.addEventListener('click',function(){ouvert?ferme():ouvre();});
  pan.querySelector('.cn-x').addEventListener('click',function(){ferme();ob.focus();});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&ouvert){ferme();ob.focus();}});
  D.addEventListener('pointerdown',function(e){if(ouvert&&!pan.contains(e.target)&&!ob.contains(e.target)&&!selB.contains(e.target))ferme();},true);
  /* pendant une réponse de l'IA, le bouton d'envoi devient « Arrêter » */
  pan.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();
    if(envoyer.classList.contains('cn-stop')){if(iaRequete)iaRequete.controleur.abort();return;}
    envoi();
  });
  /* un lien de l'Oracle mène à sa page : il se referme (le mode putride change de page sans recharger) */
  log.addEventListener('click',function(e){if(e.target.closest('a'))setTimeout(ferme,30);});
  D.addEventListener('putride:page',function(){ferme();selB.hidden=true;choisi='';boutonsDisque();});

  /* ---------- la dictée : reconnaissance vocale du navigateur, jamais d'envoi automatique ---------- */
  var Reco=window.SpeechRecognition||window.webkitSpeechRecognition,reco=null;
  var ERREURS_DICTEE={'not-allowed':'Micro refusé : autorise-le dans le navigateur pour dicter.','service-not-allowed':'La dictée est désactivée dans ce navigateur.',
    'no-speech':'Je n’ai rien entendu. Réessaie en parlant plus près du micro.','audio-capture':'Aucun micro détecté.',
    'network':'Le service de dictée du navigateur est injoignable.','language-not-supported':'La dictée en français n’est pas disponible dans ce navigateur.'};
  function majMic(){
    var on=!!reco,t=on?'Arrêter la dictée':'Dicter ta question';
    mic.classList.toggle('on',on);mic.setAttribute('aria-pressed',on?'true':'false');
    mic.setAttribute('aria-label',t);mic.title=on?t:t+' (service vocal du navigateur)';
  }
  function arreteDictee(){if(!reco)return;var r=reco;reco=null;try{r.abort();}catch(_){}majMic();}
  if(Reco){
    mic.hidden=false;
    mic.addEventListener('click',function(){
      if(reco){try{reco.stop();}catch(_){arreteDictee();}return;}
      try{if(!localStorage.getItem('lcdm-ver-dictee')){toast('Dictée : ton navigateur transmet ta voix à son service de reconnaissance (Google, Microsoft ou Apple).');localStorage.setItem('lcdm-ver-dictee','1');}}catch(_){}
      var r=new Reco(),base=inp.value.replace(/\s+$/,'');if(base)base+=' ';
      r.lang='fr-FR';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
      r.onresult=function(e){
        if(reco!==r)return;
        var t='';for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;
        inp.value=(base+t.trim()).slice(0,2000);hauteur();
      };
      r.onerror=function(e){if(reco===r&&e.error!=='aborted')toast(ERREURS_DICTEE[e.error]||'Dictée interrompue.');};
      r.onend=function(){if(reco!==r)return;reco=null;majMic();try{inp.focus({preventScroll:true});}catch(_){}};
      reco=r;majMic();
      try{r.start();}catch(_){reco=null;majMic();toast('Dictée indisponible pour le moment.');}
    });
  }

  /* ---------- « Demander au Ver » sur un passage surligné de la page ---------- */
  var selB=el('<button type="button" class="cn-sel'+cls+'" hidden>'+ICO_OR+'<span>'+(normal?'Demander à Tristana':'Demander au Ver')+'</span></button>'),choisi='',selT=0;
  function passageChoisi(){
    var s=window.getSelection&&getSelection();
    if(!s||s.isCollapsed||!s.rangeCount)return null;
    var t=String(s).replace(/\s+/g,' ').trim();
    if(t.length<3||t.length>700)return null;
    var g=s.getRangeAt(0),n=g.commonAncestorContainer,x=n.nodeType===1?n:n.parentElement;
    if(!x||pan.contains(x)||x.closest('input,textarea,select,[contenteditable],.cn-b,.cn-sel,.cn-toast'))return null;
    var r=g.getBoundingClientRect();
    return r.width||r.height?{t:t,r:r}:null;
  }
  function placeSel(){
    var c=passageChoisi();
    if(!c){selB.hidden=true;choisi='';return;}
    choisi=c.t;selB.hidden=false;
    var w=selB.offsetWidth,h=selB.offsetHeight,tactile=!matchMedia('(pointer:fine)').matches;
    /* au doigt, le menu natif occupe le dessus de la sélection : le bouton passe dessous */
    var y=tactile?c.r.bottom+30:c.r.top-h-10;
    if(y<8)y=c.r.bottom+10;
    if(y+h>innerHeight-8)y=Math.max(8,c.r.top-h-10);
    selB.style.left=Math.max(8,Math.min(innerWidth-w-8,c.r.left+c.r.width/2-w/2))+'px';
    selB.style.top=y+'px';
  }
  D.addEventListener('selectionchange',function(){clearTimeout(selT);selT=setTimeout(placeSel,180);});
  addEventListener('scroll',function(){if(!selB.hidden)placeSel();},{passive:true});
  addEventListener('resize',function(){if(!selB.hidden)placeSel();});
  selB.addEventListener('pointerdown',function(e){e.preventDefault();});
  selB.addEventListener('mousedown',function(e){e.preventDefault();});
  selB.addEventListener('click',function(){
    var t=choisi;if(!t)return;
    selB.hidden=true;choisi='';
    try{getSelection().removeAllRanges();}catch(_){}
    if(t.length>600){t=t.slice(0,600);t=t.slice(0,Math.max(300,t.lastIndexOf(' ')))+' …';}
    ouvre();demande('Explique ce passage : « '+t.replace(/[«»]/g,'"')+' »');
  });

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
    /* sur le site normal, les entrées cachées gardent leur rang (l'IA les désigne par indice) mais restent vides */
    var cache=function(e){return normal&&/^\/(?:mode-putride|cachot)\//.test(P[e[0]][1]);};
    var ent=E.map(function(e){
      if(cache(e))return {p:e[0],h:'',a:'',t:'',k:e[4],tf:{},tt:{},n:0};
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
      if(e[1]!=='Surnom'||cache(e))return;
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
      if(!(normal?/^\/(?:discographie|video)\/[^/]+\/$|^\/la-creature-du-marais\/$/:/^\/(?:mode-putride\/bestiaire|mode-putride\/discographie|cachot)\/[^/]+\/$/).test(p[1]))return;
      if(/\/(?:archives|respects)\/$/.test(p[1]))return;
      var slug=p[1].split('/').filter(Boolean).pop(),alias=[norm(slug),norm(p[0])];
      if(slug==='createur'||slug==='la-creature-du-marais')alias=['la creature','creature du marais','cul pointu','tancrede'];
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
    attente=fetch('/oracle-'+(normal?'putride':couche)+'.json?v=28',{credentials:'same-origin',signal:controleur.signal}).then(function(r){if(!r.ok)throw new Error('Registres HTTP '+r.status);return r.json();}).then(function(d){
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
  var CAUSERIE_T=[
    {id:'salut',test:/^(salut|bonjour|bonsoir|coucou|hello|hey)( a (toi|vous))?( tristana)?$/,
      lignes:['Bonsoir. Le bureau de presse est ouvert, les archives aussi, à quelques cartons près. Vous cherchez un disque, une date… ou juste quelqu’un à qui parler ?','Rebonjour. J’ai rangé deux communiqués, perdu une agrafe et gardé mon rouge à lèvres : journée ordinaire. Que puis-je pour vous ?']},
    {id:'identite',test:/\b(qui es tu|qui etes vous|presente toi|presentez vous|ton nom|votre nom|qui est tristana|ton role|votre role|ton metier|votre metier)\b/,
      lignes:['Tristana : « triste » et « tana », un prénom qui annonce la couleur. Je suis l’attachée de presse et l’archiviste de PUANTEUR PUTRIDE Productions, le label de la Créature du Marais. Je rédige les annonces, je classe les sorties, je réponds aux curieux. Certaines boîtes, en revanche, restent fermées.','Communiqués, pochettes, coupures de presse, dates de sortie : je connais le catalogue par cœur. Ce qui dort dans la réserve du fond, je le connais aussi ; ce n’est simplement pas mon rayon de le raconter.']},
    {id:'humeur',test:/\b(comment (vas tu|allez vous|ca va|tu vas)|ca va( et (toi|vous))?|tu vas bien|vous allez bien)\b/,
      lignes:['Mélancolique, mais à jour dans mon classement : c’est mon état normal. Il y a des jours où Confiteor tourne en boucle, et je ne m’en plains pas. Et vous ?','Assez bien pour une archiviste : il pleut sur Rouen, les cartons sont secs, et j’ai l’air plus sage que je ne le suis. Vous venez pour la musique ?']},
    {id:'indice',test:/\b(secrets?|cach\w*|myster\w*|dessous|envers|autre (mode|site|cote|face|monde)|cartons?|reserve|fond du marais|egouts?|vase|lore|easter egg|passage secret|sous sol|caves?|cote obscur|interdit\w*)\b/,
      lignes:['Il y a des cartons que je n’ouvre pas pendant les heures de bureau. Ils sentent la vase, et leurs étiquettes sont écrites d’une main qui tremble. Je ne vous dirai pas ce qu’ils contiennent ; seulement qu’un site, comme un marais, a un fond.','Regardez tout en bas des pages, là où quelque chose suinte. Je n’en dis pas plus : certaines choses se trouvent mieux qu’elles ne se racontent.','Les disques publiés ici ne racontent qu’une moitié de l’histoire. L’autre se lit plus bas, dans l’humidité, avec d’autres visages et d’autres noms. Moi, je reste à la surface : c’est mon métier.','Si vous avez trouvé le passage, vous savez déjà que je ne peux pas vous y accompagner. Sinon : penchez-vous davantage.']},
    {id:'ailleurs',test:/\b(le ver|kobal|vampir\w*|edwarda|epheb\w*|gargouille|cachots?)\b/,
      lignes:['Ce nom-là n’est pas dans mes communiqués. Je sais où il traîne, évidemment ; mais je ne vous y conduirai pas par la main.','Vous avez de bonnes lectures, ou de mauvaises fréquentations. J’aime assez les deux. Ce dossier-là, pourtant, ne se consulte pas à la surface.']},
    {id:'suivre',test:/\b(abonne\w*|newsletter|rss|flux|prevenir|previens|alertes?|suivre les sorties|etre au courant)\b/,
      lignes:['Le plus sûr, sans algorithme : l’infolettre, en bas de la page Nouvelles. Une adresse e-mail, et chaque sortie vous arrive directement. Il y a aussi le flux RSS, lacreaturedumarais.fr/flux.xml, pour les lecteurs de flux. Les réseaux de la Créature sont en bas de page.']},
    {id:'dossier',test:/\b(dossier de presse|kit presse|press kit|epk)\b/,
      lignes:['Le dossier de presse est prêt : la page Presse le propose en PDF, avec les visuels HD et une archive ZIP. En deux mots : Tancrède Charon, Rouen, chanson gothique et baroque, post-punk et poésie décadente ; Confiteor (2024), puis le cycle In Odium Fidei. Pour une interview, la page Contact. Vous voulez que je vous résume la dernière sortie ?']},
    {id:'presse',test:/\b(contacter|contact|journalist\w*|concerts?|booking|interview|programmat\w*|visuels?|photos? presse|kit presse)\b/,
      lignes:['Pour une interview, un concert ou une demande particulière : la page Contact. Les visuels et leurs conditions sont sur la page Presse et dans les Droits d’utilisation, avec le crédit « © PUANTEUR PUTRIDE Productions ».']},
    {id:'rire',test:/\b(blague|fais moi rire|humour|plaisanterie|drole|farce)\b/,
      lignes:['Mon humour est rangé entre « deuil » et « dossier de presse » : il est sec. La Créature, elle, préfère la farce : sacré et trivial, ferveur et grotesque. C’est souvent là que ses titres mordent.']},
    {id:'ennui',test:/\b(ennui|ennuie|rien a faire|parler de tout|tout et de rien|bavard\w*|discut\w*|quoi parler|parlons d autre chose)\b/,
      lignes:['Parlons musique, alors. Je peux vous conseiller un disque selon votre humeur : quelque chose de fervent, de grinçant ou de franchement malpoli. Qu’est-ce qui vous tente ?','Je peux aussi vous raconter une sortie, un clip, une coupure de presse. Ou vous laisser chercher ce que le marais garde au fond : c’est plus amusant, je vous assure.']},
    {id:'tristesse',test:/\b(triste|tristesse|seul|solitude|malheureux|ca ne va pas|vais mal|moral|fatigue|epuise)\b/,
      lignes:['Je connais la tristesse de près : elle est dans mon prénom. Vous pouvez en parler ici sans faire de belle phrase. Si cela pèse trop ou dure, parlez-en aussi à quelqu’un de confiance ; je reste un personnage.']},
    {id:'desaccord',test:/\b(pas d accord|tu as tort|vous avez tort|n importe quoi|c est faux|tu mens|vous mentez)\b/,
      lignes:['Reprenons alors : quelle phrase contestez-vous ? Mes archives font foi, pas mon ton.']},
    {id:'pique',test:/\b((tu es|vous etes) (nulle?|idiote?|bete|stupide)|t es (nulle?|conne?))\b/,
      lignes:['Je classe aussi les critiques. Dites-moi ce qui cloche dans ma réponse, je reprendrai le dossier.']},
    {id:'scene',test:/\b(invente|raconte une histoire|ecris (moi )?(une|un) (chanson|poeme))\b/,
      lignes:['Je tiens les archives, pas la plume de l’artiste : je n’écris ni chansons ni épisodes sur commande. Parlons plutôt d’une œuvre publiée.']},
    {id:'merci',test:/^(merci( beaucoup| tristana)?|c est gentil|super|tres bien)$/,
      lignes:['Avec plaisir. Le bureau reste ouvert.','Je vous en prie. Partagez un titre, si le cœur vous en dit : c’est ce qui aide le plus un artiste indépendant.']},
    {id:'depart',test:/^(au revoir|a bientot|a plus|bonne nuit|bonne soiree|bye)$/,
      lignes:['Au revoir. Suivez le flux des Nouvelles : je préviens toujours quand quelque chose sort.','Bonne soirée. Et si un soir vous entendez quelque chose suinter en bas de page… vous saurez.']},
    {id:'limites',test:/\b(une ia|intelligence artificielle|comment (fonctionnes|fonctionnez|marches)|tes limites|vos limites|es tu reelle?|etes vous reelle?)\b/,
      lignes:['Je suis un personnage animé par des répliques écrites et une recherche dans les pages publiques du site. Sans votre accord pour l’IA, rien ne part vers un service extérieur.']}
  ];
  function secours(q){
    if(/\b(suicide|me tuer|me faire du mal|veux en finir)\b/.test(norm(q)))return {r:'a',h:esc('Je mets le personnage de côté : si tu risques de te faire du mal, contacte immédiatement une personne de confiance ou les secours. En France, le 3114 est gratuit, 24 h/24 ; en cas de danger immédiat, appelle le 112.')};
    return null;
  }
  function bavarde(q){
    var n=norm(q),p=precedent(),CA=normal?CAUSERIE_T:CAUSERIE,v=CA.find(function(v){return v.test.test(n);}),aide=secours(q);
    if(aide)return aide;
    if(normal&&v&&/^(indice|ailleurs|suivre|presse|identite)$/.test(v.id))return {r:'a',h:esc(v.lignes[hist.filter(function(m){return m.dialogue===v.id;}).length%v.lignes.length]),dialogue:v.id};
    if((KB&&entites(q).length)||/\b(creature|edwarda|epheb\w*|kobal|vampirix|confiteor|chyren|odium|kavod|noo noo|puanteur|temoign\w*|accus\w*|album|disque|sources?|site)\b/.test(n))return null;
    var court=/^(et toi|et vous|oui|non|peut etre|pourquoi|comment ca|continue|et ensuite|encore|developpe|dis m en plus)$/.test(n);
    if(!v&&court&&p&&p.dialogue)v=CA.find(function(v){return v.id===p.dialogue;});
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
    if(normal)return null;
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
  /* ---------- la page consultée, ses sections et les passages surlignés ---------- */
  var PASSAGE=/^explique ce passage\s*:\s*«\s*([\s\S]+?)\s*»\s*$/i;
  var DEICTIQUE=/\b(cette page|la page|ici|cette fiche|cette section|ce personnage|ce disque|cet album|ce titre|ce morceau|ce lieu)\b/;
  function demandeResume(n){
    return /^(resume|resumer|resume moi)( cette page| la page| ca| ici)?$/.test(n)||
      (/\b(resume\w*|de quoi (parle|traite)|que (dit|raconte)|en bref|presente moi)\b/.test(n)&&DEICTIQUE.test(n));
  }
  /* la page désignée : « cette page » est celle qu'on lit ; « ce personnage » suit d'abord la conversation */
  function pageDesignee(n,p){
    var sujet=p&&pageDe(p.sujet||(p.sources&&p.sources[0]));
    return /\b(page|ici|fiche|section)\b/.test(n)||!(sujet>=0)?pageCourante():sujet;
  }
  function sectionCitee(q,pis){
    var m=q.match(/[«“"]\s*([^»”"]{2,90}?)\s*[»”"]/);if(!m)return -1;
    var k=norm(m[1]);
    return KB.E.findIndex(function(e){return pis.indexOf(e.p)>=0&&e.h&&e.k!==2&&(norm(e.h)===k||norm(titreSection(e.h))===k);});
  }
  function localise(t){
    var debut=norm(t).split(' ').slice(0,8).join(' ');
    if(debut.length>=12){var i=KB.E.findIndex(function(e){return norm(e.t).indexOf(debut)>=0;});if(i>=0)return i;}
    var r=cherche(t);return r.length&&r[0].s>=2.2?r[0].ix:-1;
  }
  function extrait(ix,intro,question){
    var e=KB.E[ix],t=e.t,s=KB.E[ix+1];
    if(t.length<170&&s&&s.p===e.p&&s.h===e.h&&s.k!==2)t+=' '+s.t;
    return {r:'a',h:esc(intro)+'<span class="src">'+esc(nom(e))+'</span><q>'+esc(coupe(t,650))+'</q><br><a class="lire" href="'+esc(lien(e))+'">Suivre la trace →</a>',
      sujet:KB.P[e.p][1],sources:[lien(e)],ix:ix,question:question};
  }
  function resume(pi){
    var c=chapeau(pi);if(c<0)return null;
    var e=KB.E[c],t=e.t,s=KB.E[c+1],secs=sections(pi).slice(0,6);
    if(t.length<200&&s&&s.p===pi&&s.k!==2)t+=' '+s.t;
    var h=esc('En deux mots, et le reste se lit sur place.')+'<span class="src">'+esc(KB.P[pi][0])+'</span><q>'+esc(coupe(t,560))+'</q>';
    if(secs.length)h+='<span class="va">Au fil de la page : '+secs.map(function(ix){return '<a href="'+esc(lien(KB.E[ix]))+'">'+esc(titreSection(KB.E[ix].h))+'</a>';}).join(' · ')+'</span>';
    return {r:'a',h:h,sujet:KB.P[pi][1],sources:[KB.P[pi][1]],ix:c,question:KB.P[pi][0]};
  }
  /* sans IA, le Ver ne paraphrase pas : il situe le passage, montre la suite et les noms qu'il convoque */
  function explique(t){
    var ix=localise(t);
    if(ix<0)return {r:'a',h:esc('Ce passage n’est pas dans mes registres, ou trop morcelé pour que j’en retrouve la trace. Pose-moi plutôt une question sur ce qu’il évoque.')};
    var e=KB.E[ix],s=KB.E[ix+1],h=esc(normal?'Voici d’où vient ce passage et ce qui l’entoure.':'Je te dis d’où sort ce passage et ce qui l’entoure.')+'<span class="src">'+esc(nom(e))+'</span>';
    if(s&&s.p===e.p&&s.k!==2&&norm(t).indexOf(norm(s.t).slice(0,40))<0)h+='<q>'+esc(coupe(s.t,420))+'</q><span class="va">C’est ce qui suit sur la page.</span>';
    var ns=entites(t).filter(function(i){return i!==e.p;}).slice(0,3);
    if(ns.length)h+='<span class="va">Il convoque : '+ns.map(function(i){return '<a href="'+esc(KB.P[i][1])+'">'+esc(KB.P[i][0])+'</a>';}).join(' · ')+'</span>';
    h+='<a class="lire" href="'+esc(lien(e))+'">Suivre la trace →</a>';
    if(iaURL&&!iaActive)h+='<span class="va">Pour une explication rédigée, active la conversation IA dans les options'+(normal?' de Tristana':' du Ver')+'.</span>';
    return {r:'a',h:h,sujet:KB.P[e.p][1],sources:[lien(e)],ix:ix,question:nom(e)};
  }
  function repond(q){
    var p=precedent(),n=norm(q),suiteDemandee=/^(et )?(ensuite|apres|continue|la suite|encore|developpe|dis m en plus|pourquoi|comment ca|et alors)$/.test(n);
    var pc=pageCourante(),pass=q.match(PASSAGE);
    if(pass)return explique(pass[1]);
    if(demandeResume(n)&&!entites(q).length){var pr=pageDesignee(n,p),rs=pr>=0&&resume(pr);if(rs)return rs;}
    var sc=sectionCitee(q,[pageDe(p&&p.sujet),pc].filter(function(i){return i>=0;}));
    if(sc>=0&&mots(q.replace(/[«“"][^»”"]*[»”"]/,'')).length<=2)return extrait(sc,'Voici la section.',KB.P[KB.E[sc].p][0]+' '+KB.E[sc].h);
    if(p&&p.sujet&&/^(et toi|tu en penses quoi|qu en penses tu|ton avis)$/.test(n)){
      var avis=AVIS[p.voix]||(normal?'Mon avis d’archiviste : écoutez les sorties dans l’ordre, chacune répond à la précédente. Pour le reste, je laisse l’œuvre parler.':'Moi, je regarde ce que cette trace révèle des rôles et des contradictions. Je ne prétends pas connaître les pensées privées des personnages ou de leur auteur.');
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
    if(!normal&&/\b(ton histoire|tes lieux|ou (habites|vis) tu)\b/.test(n)&&!noms.length&&!contextuel)requete+=' Ver baptistère';
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
      if(normal)return {r:'a',h:'Rien d’assez sûr dans mes archives publiques pour vous répondre. Donnez-moi un titre, une date ou un clip ; certains dossiers, eux, ne sont pas de mon ressort.'};
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
    var amorces=normal?['Voici ce que disent les archives.','Le dossier est classé ici.','Extrait des archives du label, sans retouche.']:['Les grands discours sont moins solides quand on regarde leurs coutures. Voici le passage.','Je garde la trace ; à toi de juger le costume.','Pas besoin d’inventer une révélation : les registres ont déjà de quoi faire grincer la scène.'];
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
    var n=norm(q),p=precedent(),requete=q,pass=q.match(PASSAGE),nomme=entites(q).length,compte={},ids=[];
    function prend(ix){if(ix>=0&&ids.length<10&&ids.indexOf(ix)<0){ids.push(ix);compte[KB.E[ix].p]=(compte[KB.E[ix].p]||0)+1;}}
    if(!pass&&p&&p.ai&&p.question&&!nomme&&
      (/^(et |pourquoi|comment ca|continue|encore|developpe|dis m en plus|ses |son |sa |il |elle )/.test(n)||mots(q).length<2))requete=(p.question+' '+q).slice(-3000);
    /* un passage surligné part avec son entrée ; « cette page » ou « ce personnage » avec le chapeau de la page désignée */
    if(pass)prend(localise(pass[1]));
    else{
      if(!nomme&&(DEICTIQUE.test(n)||demandeResume(n))){
        var pd=pageDesignee(n,p);
        if(pd>=0){requete+=' '+KB.P[pd][0];prend(chapeau(pd));if(demandeResume(n))sections(pd).slice(0,3).forEach(prend);}
      }
      prend(sectionCitee(q,[pageDe(p&&(p.sujet||(p.sources&&p.sources[0]))),pageCourante()].filter(function(i){return i>=0;})));
    }
    if(!normal){
      if(/\b(ton maitre|qui es tu|qui sers tu)\b/.test(n))requete+=' Ver Kobal';
      if(/\b(tes amis|ton amie?|amitie)\b/.test(n))requete+=' Ver Gargouille Rouen';
      if(/\bkobal\b/.test(n)&&!/\bver\b/.test(n))requete+=' Ver farces';
    }
    var noms=entites(requete),r=cherche(requete);
    /* l'actualité vient des derniers articles de /nouvelles/, rangés du plus récent au plus ancien */
    if(/\b(quoi de neuf|actu|actus|actualites?|nouvelles|news|recemment|en ce moment|derniere?s? (sortie|sorties|nouvelle|nouvelles|clip|single|album|news))\b/.test(n)){
      var pn=KB.P.findIndex(function(p){return p[1]==='/nouvelles/';}),k=0;
      KB.E.forEach(function(e,ix){if(e.p===pn&&e.h&&k<3){prend(ix);k++;}});
    }
    /* un personnage nommé apporte sa fiche, même si la question n'en reprend pas les mots */
    noms.slice(0,2).forEach(function(p){
      var f=KB.E.findIndex(function(e){return e.p===p&&e.k===1;});
      if(f<0)f=KB.E.findIndex(function(e){return e.p===p;});
      prend(f);
      /* un disque nommé apporte aussi sa présentation (sort, disponibilité), que la question ne reprend jamais mot pour mot */
      prend(KB.E.findIndex(function(e){return e.p===p&&e.k===0&&!e.h&&e.t.length>=150;}));
    });
    r.forEach(function(x){if(noms.indexOf(x.e.p)>=0)x.s*=1.6;});
    r.sort(function(a,b){return b.s-a.s;});
    r.some(function(x){
      if(x.s>=2.2&&(compte[x.e.p]||0)<(noms.indexOf(x.e.p)>=0?4:3))prend(x.ix);
      return ids.length>=10;
    });
    /* une accusation part toujours avec la contestation publiée de la direction */
    if(ids.some(function(i){return /ames-exsangues/.test(KB.E[i].a);})){
      var contestation=KB.E.findIndex(function(e){return /ames-exsangues/.test(e.a)&&/réponse de la direction/i.test(e.h)&&/conteste/.test(e.t);});
      if(contestation>=0&&ids.indexOf(contestation)<0){if(ids.length===10)ids.pop();ids.push(contestation);}
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
  /* mise en forme légère : listes, **gras** et *italique* du modèle ; sans sources, les renvois restent du texte */
  function miseEnForme(t,sources){
    return esc(t).replace(/^[-*] /gm,'• ').replace(/\*\*(?!\s)([^*\n]+?)\*\*/g,'<strong>$1</strong>')
      .replace(/(^|[\s(«'’])\*(?!\s)([^*\n]+?)\*(?=[\s).,;:!?»'’]|$)/gm,'$1<em>$2</em>')
      .replace(/\[S(\d+)\]/g,function(m,n){
        if(!sources)return m;
        var s=sources.find(function(s){return s.n===Number(n);});
        if(!s)throw fauteIA('sources');
        return '<a href="'+esc(s.url)+'" title="'+esc(s.title)+'">'+m+'</a>';
      }).replace(/\n/g,'<br>');
  }
  /* la réponse arrive en morceaux (NDJSON) : vivant(texte) l'affiche au fil de l'eau ;
     un service plus ancien qui répond d'un bloc en JSON reste accepté */
  function reponseIA(q,forme,vivant){
    if(!iaActive)throw fauteIA('annule');
    var contexte=contexteIA(q),req={controleur:new AbortController(),expire:false,texte:''},pc=pageCourante(),timer=0;
    iaRequete=req;
    function arme(ms){clearTimeout(timer);timer=setTimeout(function(){req.expire=true;req.controleur.abort();},ms);}
    arme(30000);
    var corps={consent:true,revision:KB.revision,ids:contexte.ids,messages:historiqueIA(q),stream:true};
    if(pc>=0)corps.page=KB.P[pc][1];
    if(forme)corps.forme=forme;
    if(normal)corps.persona='tristana';
    return fetch(iaURL,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',
      headers:{'Content-Type':'application/json'},signal:req.controleur.signal,body:JSON.stringify(corps)
    }).then(function(r){
      if(!r.ok)return r.json().then(function(d){throw fauteIA(d.error||'service');});
      if(!/ndjson/i.test(r.headers.get('Content-Type')||'')||!r.body||!r.body.getReader)return r.json();
      var lecteur=r.body.getReader(),dec=new TextDecoder(),tampon='',fin=null;
      function ligne(l){
        if(!l.trim()||fin)return;
        var o;try{o=JSON.parse(l);}catch(_){throw fauteIA('reponse');}
        if(!o||typeof o!=='object')throw fauteIA('reponse');
        if(o.error)throw fauteIA(String(o.error));
        if(o.fin){fin=o;return;}
        if(typeof o.d==='string')req.texte+=o.d;
        else if(typeof o.t==='string')req.texte=o.t;
        else return;
        if(vivant&&!req.controleur.signal.aborted)vivant(req.texte);
      }
      function lit(){
        arme(20000);
        return lecteur.read().then(function(x){
          if(x.value){tampon+=dec.decode(x.value,{stream:true});var ls=tampon.split('\n');tampon=ls.pop();ls.forEach(ligne);}
          if(x.done){ligne(tampon+dec.decode());if(!fin)throw fauteIA('reponse');}
          if(fin){if(!x.done)lecteur.cancel().catch(function(){});return fin;}
          return lit();
        });
      }
      return lit();
    }).then(function(d){
      if(!iaActive||req.controleur.signal.aborted)throw fauteIA('annule');
      if(!d||typeof d.text!=='string'||!d.text.trim()||d.text.length>4000||
        typeof d.truncated!=='boolean'||!Array.isArray(d.sources)||d.sources.length>10||
        !d.sources.every(function(s){return Number.isInteger(s.n)&&s.n>=1&&s.n<=10&&typeof s.title==='string'&&
          typeof s.url==='string'&&KB.P.some(function(p){return p[1]===s.url.split('#')[0];});}))throw fauteIA('reponse');
      var h=miseEnForme(d.text,d.sources);
      if(d.sources.length)h+='<span class="va">Traces citées : '+d.sources.map(function(s){return '<a href="'+esc(s.url)+'">'+esc(s.title)+'</a>';}).join(' · ')+'</span>';
      if(d.truncated)h+='<span class="va">Réponse arrêtée à la limite de longueur. Tu peux demander de poursuivre.</span>';
      /* les relances proposées par l'IA deviennent des suggestions ; une relance mal formée est ignorée */
      var suites=(Array.isArray(d.suites)?d.suites:[]).filter(function(s){return typeof s==='string'&&s.trim()&&s.length<=80;}).slice(0,3);
      return {r:'a',h:h,t:d.text,ai:true,question:contexte.question,ids:contexte.ids,sources:d.sources.map(function(s){return s.url;}),suites:suites};
    }).catch(function(e){
      if(req.controleur.signal.aborted)e=fauteIA(req.expire?'delai':'annule');
      e.partiel=req.texte;e.question=contexte.question;
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
    taille:'Cet échange dépasse la limite de taille du service. Ouvre une nouvelle conversation pour recommencer.',
    page:'Cette page n’est pas reconnue par l’IA. Recharge la page ; si cela persiste, le service doit être mis à jour.',
    forme:'Cette forme de réponse n’est pas reconnue par le service. Recharge la page, puis réessaie.'
  };
  /* pendant une réponse : une seule question à la fois ; l'IA distante peut être arrêtée */
  function occupe(on,distant){
    occupeQuestion=on;
    if(on)pan.setAttribute('aria-busy','true');else pan.removeAttribute('aria-busy');
    var stop=on&&!!distant;
    envoyer.disabled=on&&!distant;
    envoyer.classList.toggle('cn-stop',stop);
    envoyer.textContent=stop?'■':'➤';
    envoyer.setAttribute('aria-label',stop?'Arrêter la réponse':'Demander');
    envoyer.title=stop?'Arrêter la réponse':'';
    if(on)retireGestes();else majRelance();
  }
  function demande(q,forme){
    if(occupeQuestion){toast('Laisse-moi finir cette réponse avant de reprendre.');return;}
    /* un passage cité du site n'est ni une causerie ni une chasse aux reliques, même s'il en contient les mots */
    var pass=PASSAGE.test(q),aide=secours(q),reliques=!aide&&!pass&&/reliq/.test(norm(q)),social=aide||(iaActive||pass?null:bavarde(q)),distant=iaActive&&!reliques&&!social;
    sug.innerHTML='';
    occupe(true,distant);
    ajoute({r:'q',t:q,ai:distant},false);
    var att=D.createElement('div'),vu=false;att.className='cn-m a cn-dots';att.setAttribute('aria-label',(normal?'Tristana ':'Le Ver ')+(distant?'prépare sa réponse avec l’IA':'consulte les registres'));att.innerHTML='<i></i><i></i><i></i>';log.appendChild(att);bas();
    /* la réponse de l'IA s'écrit à mesure ; la région annoncée attend la version finale */
    function vivant(t){
      if(!vu){vu=true;att.className='cn-m a cn-live';att.removeAttribute('aria-label');att.setAttribute('aria-hidden','true');}
      att.innerHTML=miseEnForme(t);
      if(colle)bas();else majBas();
    }
    var t0=performance.now();
    (reliques||social?Promise.resolve(null):charge()).then(function(kb){
      return distant?reponseIA(q,forme,vivant):reliques?enigme():social||repond(q);
    }).then(function(m){
      if(distant&&forme)m.forme=forme;
      setTimeout(function(){att.remove();ajoute(m,!vu);occupe(false);},vu?0:Math.max(0,(calme?0:420)-(performance.now()-t0)));
    }).catch(function(e){
      if(distant)console.error('Le Ver : conversation IA interrompue.',e.code||'service');
      att.remove();
      var partiel=distant&&(e.code==='annule'||e.code==='delai')&&typeof e.partiel==='string'?e.partiel.replace(/[ \t]*\[S\d+\]/g,'').trim():'';
      if(partiel){
        /* une réponse arrêtée en route reste lisible, sans ses renvois qu'on ne peut plus vérifier */
        ajoute({r:'a',h:miseEnForme(partiel)+'<span class="va">'+(e.code==='delai'?'L’IA s’est tue en route : réponse incomplète.':'Réponse arrêtée.')+'</span>',
          t:partiel,ai:true,question:e.question||q,sources:[],forme:forme},false);
      }else{
        var message=distant?(ERREURS_IA[e.code]||'L’IA est inaccessible. Aucune réponse générée. Réessaie, ou reviens au dialogue local dans les options.'):
          'Les registres sont hors d’atteinte. Je ne peux pas les consulter : réessaie dans un moment.';
        ajoute({r:'a',h:esc(message),err:true,forme:forme},false);
      }
      occupe(false);
    });
  }

  function pose(){
    if(!normal)D.body.appendChild(fx);D.body.appendChild(ob);D.body.appendChild(pan);D.body.appendChild(selB);D.dispatchEvent(new Event('coins:pret'));
    if(couche==='cachot'){
      var ver=D.createElement('script');ver.src='/ver.js?v=6';
      ver.onload=function(){window.Ver.go();};
      ver.onerror=function(){console.error('Le Ver : animation indisponible. Le dialogue reste accessible.');};
      D.head.appendChild(ver);
    }
  }
  if(D.body)pose();else D.addEventListener('DOMContentLoaded',pose);
  boutonsDisque();
  function poseQuestion(q){ouvre();if(typeof q==='string'&&q.trim()&&!occupeQuestion)demande(q.trim());}
  /* un bouton [data-tristana] de la page (Presse…) pose sa question dans la fenêtre */
  D.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-tristana]');if(b){e.preventDefault();poseQuestion(b.getAttribute('data-tristana'));}});
  window.Coins={pose:poseQuestion,ouvre:ouvre,ferme:ferme,calme:function(){return calme;},cherche:function(q){return KB?cherche(q).slice(0,5).map(function(r){return [r.s.toFixed(2),nom(r.e),r.e.t.slice(0,80)];}):null;},charge:charge};
})();
