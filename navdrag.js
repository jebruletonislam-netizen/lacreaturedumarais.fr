(function(){
  /* écouté depuis le document : le menu reste glissable après une navigation douce du mode putride, qui le remplace */
  if(!document.querySelector('nav'))return;
  var nv=null,sy=0,st=0,drag=false,moved=false;
  document.addEventListener('mousedown',function(e){var n=e.target.closest&&e.target.closest('nav');if(e.button||!n||n!==document.querySelector('nav')||n.scrollHeight<=n.clientHeight)return;nv=n;drag=true;moved=false;sy=e.clientY;st=n.scrollTop;});
  window.addEventListener('mousemove',function(e){if(!drag)return;var d=e.clientY-sy;if(Math.abs(d)>4)moved=true;nv.scrollTop=st-d;});
  window.addEventListener('mouseup',function(){drag=false;});
  document.addEventListener('click',function(e){if(moved){moved=false;if(nv&&nv.contains(e.target)){e.preventDefault();e.stopPropagation();}}},true);
  document.addEventListener('dragstart',function(e){var n=document.querySelector('nav');if(n&&n.contains(e.target))e.preventDefault();});
})();
