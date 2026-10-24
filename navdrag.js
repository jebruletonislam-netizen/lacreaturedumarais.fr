(function(){
  var nv=document.querySelector('nav');
  if(!nv)return;
  var sy=0,st=0,drag=false,moved=false;
  nv.addEventListener('mousedown',function(e){if(e.button||nv.scrollHeight<=nv.clientHeight)return;drag=true;moved=false;sy=e.clientY;st=nv.scrollTop;});
  window.addEventListener('mousemove',function(e){if(!drag)return;var d=e.clientY-sy;if(Math.abs(d)>4)moved=true;nv.scrollTop=st-d;});
  window.addEventListener('mouseup',function(){drag=false;});
  nv.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
  nv.addEventListener('dragstart',function(e){e.preventDefault();});
})();
