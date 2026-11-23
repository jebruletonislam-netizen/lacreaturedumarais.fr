/* Instagram mesure la publication entière, commandes comprises, à chaque changement de largeur. */
window.addEventListener('message', function (event) {
  if (event.origin !== 'https://www.instagram.com') return;
  var frame = document.querySelector('.reel iframe');
  if (!frame || event.source !== frame.contentWindow) return;
  var message = event.data;
  if (typeof message === 'string') {
    try { message = JSON.parse(message); }
    catch (error) { if (error instanceof SyntaxError) return; throw error; }
  }
  if (!message || message.type !== 'MEASURE' || !message.details) return;
  var height = message.details.height;
  if (Number.isFinite(height) && height > 0 && height <= 2000) {
    frame.style.height = Math.ceil(height) + 'px';
  }
});
