// Meme garde pour paroles.json (paroles completes, _outils/paroles.py).
// coulisses.json contient les notes privees de l'auteur : il n'est jamais versionne.
// Tests et previsualisation : un fichier vide est cree s'il manque.
// Deploiement (argument "deploiement") : refus si les notes manquent ou sont vides,
// pour ne jamais publier un Ver amnesique.
import {existsSync, readFileSync, writeFileSync} from 'node:fs';

const chemin = new URL('./coulisses.json', import.meta.url);
const deploiement = process.argv[2] === 'deploiement';

function echec(message) {
  console.error('coulisses.json : ' + message);
  process.exit(1);
}

const cheminParoles = new URL('./paroles.json', import.meta.url);
if (!existsSync(cheminParoles)) {
  if (deploiement) echec('paroles.json absent. Lancer python -X utf8 _outils/paroles.py.');
  writeFileSync(cheminParoles, '[]\n');
  console.warn('paroles.json absent : liste vide creee (les IA seront sans paroles).');
} else {
  let liste;
  try {
    liste = JSON.parse(readFileSync(cheminParoles, 'utf8'));
  } catch {
    echec('paroles.json : JSON invalide.');
  }
  if (!Array.isArray(liste) || !liste.every(e => typeof e?.t === 'string' && typeof e.x === 'string'))
    echec('paroles.json : structure attendue [{t, a, al, d, x}].');
  if (deploiement && !liste.length) echec('paroles.json vide. Relancer _outils/paroles.py.');
}

if (!existsSync(chemin)) {
  if (deploiement) echec('absent. Restaurer la copie privee avant de deployer.');
  writeFileSync(chemin, JSON.stringify({noyau: '', sections: []}, null, 1) + '\n');
  console.warn('coulisses.json absent : fichier vide cree (le Ver sera sans notes).');
  process.exit(0);
}

let notes;
try {
  notes = JSON.parse(readFileSync(chemin, 'utf8'));
} catch {
  echec('JSON invalide.');
}
if (typeof notes?.noyau !== 'string' || !Array.isArray(notes.sections) ||
    !notes.sections.every(s => typeof s?.t === 'string' && typeof s.x === 'string' &&
      Array.isArray(s.k) && s.k.length && s.k.every(k => typeof k === 'string' && k.trim())))
  echec('structure attendue {noyau, sections: [{t, k: [mots-cles], x}]}.');
if (deploiement && (!notes.noyau.trim() || !notes.sections.length))
  echec('notes vides. Restaurer la copie privee avant de deployer.');
