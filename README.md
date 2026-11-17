Site officiel de La Créature du Marais — version visuelle basée sur le fichier index.html fourni. Conserver le dossier images/ existant du dépôt lors du remplacement des fichiers HTML/CSS.

## Le Ver

Par défaut, le dialogue fonctionne localement, sans API ni modèle génératif. `coins.js` combine
des répliques sourcées, des échanges quotidiens écrits pour le personnage, la
recherche d'extraits (fautes, synonymes, noms et sous-sections) et le contexte des
questions précédentes. Les relances proposées suivent le sujet. Il décrit l'œuvre,
sans diagnostiquer son auteur ; les témoignages restent attribués, distincts du lore.
Après une modification éditoriale, lancer `python _outils/oracle.py` et incrémenter
la version des registres dans `coins.js`. Sur choix du propriétaire, les deux couches
connaissent désormais l'ensemble des textes publics, putrides et des cachots.
Les deux fichiers `oracle-*.json` contiennent les mêmes registres, tout en conservant
leurs adresses existantes. L'historique reste limité à 48 messages par couche dans
la session de l'onglet. Sans activation explicite de l'IA, aucun échange n'est envoyé
à un service d'IA. Le Ver est ami de la Gargouille de Rouen ; Kobal reste son maître.

Le générateur conserve les permaliens, les libellés, les titres des morceaux,
les données de parution, les descriptions d'images et les paroles publiées des
compagnons. Les coupures de presse numérisées sont transcrites à la main dans
`_outils/transcriptions.json` (clé = adresse de l'image liée par la page) ; une
transcription orpheline fait échouer la génération. `_outils/reperes.json` ajoute
des repères de culture générale sur les références que le site cite, rattachés à
la page qui les cite : ce ne sont pas des affirmations du site et aucune page n'est
modifiée. L'audio et les films ne sont pas transcrits : le Ver renvoie aux pièces
et aux descriptions existantes.
Le dialogue local ne comprend pas librement tous les sujets comme un modèle
génératif. Une question sans trace fiable reçoit une réponse d'incertitude.

### Conversation IA facultative

`_ver-worker/worker.mjs` branche Cloudflare Workers AI, avec
`@cf/google/gemma-4-26b-a4b-it`. Le modèle reste sur leurs serveurs : pas de poids
à télécharger pour les visiteurs. Ce choix privilégie la conversation française,
la culture générale et un quota raisonnable ; ce n'est pas une garantie d'exactitude
ou d'intelligence équivalente aux plus grands assistants. Qwen3-30B-A3B a été
écarté : Cloudflare annonce son retrait le 20 novembre 2026.

L'accord est lié à l'adresse du service et à la session de l'onglet. Les messages
locaux antérieurs ne sont pas transmis. Le navigateur envoie le message courant,
au plus six paires question/réponse IA et huit indices d'extraits. Le Worker vérifie
la révision du corpus et prend les textes dans sa propre copie, jamais dans un
texte documentaire fourni par le visiteur. Limites : 10 000 caractères d'historique,
12 000 de contexte documentaire, 640 tokens de sortie. Les seules citations
cliquables sont des liens du corpus. Les erreurs et réponses tronquées sont visibles,
sans bascule automatique vers des répliques locales présentées comme de l'IA.

La personnalité distingue le personnage, la légende, l'interprétation et les faits
sourcés. Elle discute et analyse, mais ne sert pas à commander des œuvres, du code
ou de nouveaux épisodes du lore. Pas de recherche web ni de transcription audio.
Chaque extrait envoyé porte sa nature (texte du site, transcription de pièce, repère
culturel). Hors citation, le Worker remplace aussi « paroisse », « paroissien » et
« paroissial » par le vocabulaire du Vampirium (minuscules seulement, la « paroisse
Saint-… » historique et les noms propres restent intacts).
La mémoire n'est ni permanente ni exhaustive. Les consignes réduisent les inventions,
sans les rendre impossibles.

Le forfait **Workers Free** fournit actuellement 10 000 neurons par jour, partagés
avec les autres usages Workers AI du compte. Il refuse les requêtes au dépassement :
ne pas activer Workers Paid ou la facturation AI Gateway. Le volume réel dépend du
contexte et des réponses. Les limites applicatives (6 demandes/minute par IP,
30 globales/minute) sont approximatives et propres à chaque centre Cloudflare :
ce n'est pas un quota mondial strict ni une protection anti-bot absolue. CORS n'est
pas une authentification. Un abus peut épuiser l'allocation gratuite. Aucun stockage
de conversation, journal de contenu ou AI Gateway n'est configuré.

Déploiement, depuis `_ver-worker` :

```powershell
$env:WRANGLER_SEND_METRICS='false'
npm ci
npx wrangler login
npm test
npm run check
npm run deploy
```

Se connecter au compte du propriétaire, vérifier qu'il reste sur **Free**, puis
mettre l'URL HTTPS `https://le-ver.<sous-domaine>.workers.dev/chat` obtenue dans
`ver-ia.json`. Service actuel : `https://le-ver.vampirium.workers.dev/chat`. Un
premier déploiement exige un sous-domaine workers.dev choisi dans le tableau de bord ;
juste après, un 404 (10007) de propagation se règle en redéployant. Les URL
d'aperçu sont désactivées (`preview_urls: false`). Une URL vide conserve seulement
le dialogue local ; aucune IA n'est alors active. Aucune clé ni aucun identifiant
secret ne va dans le dépôt.
Le site reste sur GitHub Pages ; aucun changement DNS n'est nécessaire.

Après chaque changement éditorial : régénérer les corpus, incrémenter leur version
dans `coins.js`, **redéployer le Worker avec le même corpus**, puis publier le site.
Un décalage de révision renvoie 409 plutôt que de citer un autre passage.
Après toute modification de `coins.js`, incrémenter ses références sur toutes les
pages. Pour revenir au dialogue local uniquement, vider `url` dans `ver-ia.json`.

`npm test` et `npm run check` dans `_ver-worker` ne prouvent pas une vraie inférence :
tester aussi le service déployé et le consentement dans le navigateur. Le endpoint
`GET /health` expose modèle/révision sans appeler le modèle. La prévisualisation locale
doit ajouter explicitement son origine à `ORIGINES` ; ne pas la garder en production.
Le délai Worker de 25 secondes limite l'attente, pas nécessairement le calcul
d'une inférence déjà lancée. Aucun nouvel essai automatique ne consomme le quota.

Documentation vérifiée :
[quota gratuit](https://developers.cloudflare.com/workers-ai/platform/pricing/),
[modèle](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/),
[données](https://developers.cloudflare.com/workers-ai/platform/data-usage/).

Le bouton du dialogue est le nid du Ver : clic pour parler, glissement pour le
faire suivre le pointeur. Premier départ après 3 secondes sans interaction,
puis 13 secondes de promenade et 13 secondes de repos. Dialogue, survol, liseuse
et onglet masqué suspendent les départs. Le mode calme conserve le dialogue sans
promenade. Incrémenter les versions des scripts dans tous leurs chargeurs.

Tests ciblés : `python -m unittest discover -s _outils -p test_oracle.py`, puis
`python _outils/test_ver.py http://127.0.0.1:8851` avec Playwright Python et Edge.
Le second test mesure le cycle en temps réel et vérifie le dialogue et les gestes.

## Collants et fil de l'araignée

Tirer les collants conserve leur attache ; déplacer le corps d'Éphébito déplace
aussi ses anneaux. La toile déplace l'attache de l'araignée horizontalement ; la
traction verticale sur la toile étire son fil. Le fil et le corps de l'araignée
se tirent dans les deux directions. Au lâcher, la longueur de repos ne change pas :
l'étirement et la vitesse du geste produisent un rebond amorti, même après un maintien.
Les flèches du clavier permettent toujours de régler la position et la longueur.

`python _outils/test_elastiques.py http://127.0.0.1:8851` vérifie les vrais scripts
dans Edge avec une horloge contrôlée : directions opposées, amplitudes, retour au
repos et stabilité à 30/120 Hz, sur des largeurs de 390 et 1366 px.

## Référencement

Le sitemap réunit seulement les URL canoniques publiques, leurs images et les
cinq clips. Garder les dates `lastmod` fidèles aux modifications réelles ; les
couches cachées conservent leur `noindex` et restent hors du sitemap.

La CI contrôle le rendu Jekyll avec `python _outils/controle_seo.py _site`.
Pour un serveur local qui rend déjà les gabarits :
`python _outils/controle_seo.py --base-url http://127.0.0.1:8851`.
Le contrôle vérifie les URL, les canoniques, les directives robots, les images,
le JSON-LD et les champs vidéo. Il ne simule pas la décision d'indexation des moteurs.

Après synchronisation et publication, soumettre ou relire
`https://lacreaturedumarais.fr/sitemap.xml` dans Google Search Console et Bing
Webmaster Tools. Les exclusions volontaires (`noindex`, doublons avec canonical)
ne sont pas des pages à forcer dans l'index.
