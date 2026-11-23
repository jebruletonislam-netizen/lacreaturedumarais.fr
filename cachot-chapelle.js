/* La chapelle des cachots : la photo sert de base à des zones à toucher, chacune lit un texte sous l'image. */
(function(){
  var fig=document.getElementById('chap'),txt=document.getElementById('chap-txt');
  if(!fig||!txt)return;
  var T={
    vitrail:'Éphébus, le col romain bien droit, un masque noir sur les yeux et une boule rouge entre les dents. Le verre a tenu : c’est la seule chose intacte de la chapelle, et la seule qui soit en couleur.',
    gauche:'Les losanges de plomb ont perdu leurs vitres, une à une. Le vent entre par là, et personne n’a jamais vu qui le remplace.',
    droite:'Les toiles d’araignée tiennent encore les vitres ensemble. Elles sont plus solides que le plomb, et mieux entretenues.',
    gravats:'Des éclats de pierre sont tombés de la voûte. Ils ne sont pas tombés tous le même jour, et un seul est tombé devant le vitrail.',
    rec:'« REC 14/07/2026 ». Quelqu’un filmait. Personne ne dit qui, ni pour qui.'
  };
  var bs=fig.querySelectorAll('.chap-h');
  [].forEach.call(bs,function(b){
    b.addEventListener('click',function(){
      [].forEach.call(bs,function(x){x.classList.remove('on');x.removeAttribute('aria-pressed');});
      b.classList.add('on');b.setAttribute('aria-pressed','true');
      txt.textContent=T[b.getAttribute('data-k')]||'';
      fig.classList.add('lu');
    });
  });
})();
