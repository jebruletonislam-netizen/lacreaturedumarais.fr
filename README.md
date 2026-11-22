# La Créature du Marais

Site officiel de [lacreaturedumarais.fr](https://lacreaturedumarais.fr), publié par
GitHub Pages (Jekyll). Trois couches :

- **mode normal** : accueil `index.html` et pages publiques indexées (`discographie/`,
  `nouvelles/`, `biographie/`, `presse/`, `faq/`…), la plupart sur le gabarit
  `_layouts/seo-page.html` ;
- **mode putride** (`mode-putride/`) : bestiaire, discographie d'archives, lore,
  pages en `noindex` ;
- **les cachots** (`cachot/`) : troisième couche, également en `noindex`.

Les images vivent dans `images/` (et `SECTIONS/` pour les anciennes) ; une photo de
galerie s'affiche en vignette `X.th.webp` (grand côté ≤ 900 px) et ouvre la version
complète. Les scripts et styles partagés sont chargés avec `?v=N` : après une
modification, incrémenter `N` dans **toutes** les pages qui les chargent, accueil et
`_layouts/seo-page.html` compris. Jekyll, Ruby et Docker ne tournent pas sur le poste
local : prévisualiser avec un serveur statique (`python -m http.server`), en sachant
que les pages en `layout: seo-page` et les routes déclarées seulement par
`permalink` ne s'y affichent pas comme en production.

`apercu.js` affiche l'aperçu d'un lien interne au survol (souris seulement). L'image
retenue est, dans l'ordre : `og:image` de la page visée, portrait de sa fiche
(`.fiche2 [data-lb-src]`), puis la première image de contenu, en ignorant décors,
icônes, ailes, auras et en-têtes.

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
compagnons. Les paragraphes sont indexés séparément : garder les expressions
caractéristiques et leur contexte dans le même paragraphe pour qu'ils soient
transmis ensemble. Les coupures de presse numérisées sont transcrites à la main dans
`_outils/transcriptions.json` (clé = adresse de l'image liée par la page) ; une
transcription orpheline fait échouer la génération. `_outils/reperes.json` ajoute
des repères de culture générale sur les références que le site cite, rattachés à
la page qui les cite : ce ne sont pas des affirmations du site et aucune page n'est
modifiée. L'audio et les films ne sont pas transcrits : le Ver renvoie aux pièces
et aux descriptions existantes.
Le dialogue local ne comprend pas librement tous les sujets comme un modèle
génératif. Une question sans trace fiable reçoit une réponse d'incertitude.

### Interface du dialogue

- **Entrée** envoie, **Maj+Entrée** va à la ligne (champ multiligne, 2 000 caractères).
- Chaque réponse a un bouton **Copier** (texte brut, sans les marqueurs `[S1]`).
- Le crayon d'une question la remet dans le champ : à l'envoi, l'échange reprend
  depuis elle et les réponses suivantes sont remplacées (Échap ou « Annuler » pour
  renoncer). Seules les questions encore dans l'historique de 48 messages se modifient.
- La dernière réponse de l'IA propose **Autre réponse** ; après une erreur,
  **Réessayer** renvoie la même question.
- Pendant une requête IA, le bouton d'envoi devient **Arrêter la réponse**.
- Les relances proposées tiennent sur une seule ligne défilante (molette ou glissé).
- Les réponses de l'IA rendent `**gras**`, `*italique*` et les listes à tirets ;
  tout le reste est échappé.
- Le panneau porte `aria-busy="true"` tant qu'une réponse est en cours.

### Conversation IA facultative

`_ver-worker/worker.mjs` branche Cloudflare Workers AI, avec
`@cf/google/gemma-4-26b-a4b-it`. Le modèle reste sur leurs serveurs : pas de poids
à télécharger pour les visiteurs. Ce choix privilégie la conversation française,
la culture générale et un quota raisonnable ; ce n'est pas une garantie d'exactitude
ou d'intelligence équivalente aux plus grands assistants. Qwen3-30B-A3B a été
écarté : Cloudflare annonce son retrait le 20 novembre 2026.

L'accord est lié à l'adresse du service et à la session de l'onglet. Les messages
locaux antérieurs ne sont pas transmis. Le navigateur envoie le message courant,
au plus six paires question/réponse IA et dix indices d'extraits. Le Worker vérifie
la révision du corpus et prend les textes dans sa propre copie ou dans le corpus
publié par le site, jamais dans un
texte documentaire fourni par le visiteur. Limites : 10 000 caractères d'historique,
15 000 de contexte documentaire (2 200 par extrait), 640 tokens de sortie. Les seules citations
cliquables sont des liens du corpus. Les erreurs et réponses tronquées sont visibles,
sans bascule automatique vers des répliques locales présentées comme de l'IA.

La personnalité distingue le personnage, la légende, l'interprétation et les faits
sourcés. Le Ver n'est pas une parodie : farceur attachant au service de Kobal, il
pense par lui-même, propose des pistes et suit l'actualité de la Créature. Il
discute et analyse, mais ne sert pas à commander des œuvres, du code
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

Notes de coulisses : `_ver-worker/coulisses.json` contient des notes privées de
l'auteur (un noyau toujours joint, puis au plus deux sections choisies par mots-clés
dans les derniers messages). Ce fichier est ignoré par Git, car le dépôt est public :
en garder une copie hors du dépôt. `npm test`, `npm run dev` et `npm run check`
créent un fichier vide s'il manque ; `npm run deploy` refuse de partir si les notes
sont absentes, vides ou mal formées.

Après chaque changement éditorial : régénérer les corpus, incrémenter leur version
dans `coins.js`, puis publier le site. Quand un visiteur envoie une révision que le
Worker n'embarque pas, il relit `https://lacreaturedumarais.fr/oracle-putride.json`
(au plus une lecture par minute et par instance) : publier sans redéployer ne casse
plus le Ver. Redéployer reste utile pour aligner la copie embarquée, et obligatoire
après un changement de `worker.mjs` ou des notes de coulisses.
Une révision ni embarquée ni publiée renvoie 409 plutôt que de citer un autre passage.
Après toute modification de `coins.js`, incrémenter ses références sur toutes les
pages. Pour revenir au dialogue local uniquement, vider `url` dans `ver-ia.json`.
Le Ver reconnaît un personnage par le titre de sa fiche et par le champ « Surnom »
(variantes séparées par `·` ou `/`). Un surnom ne s'y reconnaît qu'à l'identique ;
seuls les surnoms d'un seul mot valent le titre de la fiche dans la recherche.

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
Le second test mesure le cycle en temps réel et vérifie le dialogue et les gestes,
ainsi que la copie, la modification, la relance et l'arrêt avec une IA simulée
(`--ia` pour ne lancer que cette partie).

## Citations des compagnons

Les cachots et le mode putride partagent les tweets de `cachot-paroles.js`.
Conserver le texte original. Pour une archive fournie sans date ni permalien,
utiliser `d:"Archives"` et ne pas inventer d’adresse : la bulle renvoie au compte.

Le workflow **Veille des citations X** ouvre le profil public chaque dimanche à
08 h 17 UTC, ou sur lancement manuel, dans un navigateur neuf, sans clé ni session.
Il capture les publications du compte visibles des huit derniers jours. L’artefact
GitHub Actions conserve pendant 30 jours les PNG et un relevé JSON (texte, date,
permalien). Les captures ne sont pas publiées automatiquement sur le site.
Sans connexion, X peut limiter la liste : le relevé n’est pas exhaustif. Un refus
ou un fil illisible fait échouer le contrôle, au lieu d’annoncer zéro publication.

Dans le Territoire, « Sur la carte » situe le Délycium sans déclencher la fête.
Seul le zoom maximal sur l’épingle souffle les cierges ; ils se rallument un à un.

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

## Sorties programmées

Un nouveau single reprend la présentation habituelle des titres : même gabarit
discographique, lecteur Genius, bouton clip, page vidéo et liens entre ces pages.
Son statut de nouveauté se signale dans les actualités et la promotion, pas par une
présentation particulière dans la discographie. Les liens et lecteurs restent sur
la branche datée jusqu'à leur publication.

Une sortie datée se prépare sur une branche dédiée (par exemple
`sortie-monsieur-clerge`) : pages, galeries, sitemap (avec `lastmod` à la date de
sortie) et `llms.txt`. Le workflow `.github/workflows/sortie-monsieur-clerge.yml`
prépare la fusion, construit le site et vérifie son SEO avant de pousser dans
`main`. Deux étapes sont prévues, y compris lors d'un lancement manuel :

- **Annonce** : branche `annonce-monsieur-clerge`, le **23 novembre 2026 à 15 h
  (Paris, 14 h UTC)**. Pochette et texte court seulement, sans paroles ni galerie.
- **Sortie** : branche `sortie-monsieur-clerge`, le **30 novembre 2026 à 18 h 30
  (Paris, 17 h 30 UTC)**. Clip, paroles Genius, description complète et photos.

La publication de chaque étape est interdite avant son heure cible. Les crons
démarrent trente minutes en avance et attendent ; chaque étape dispose d'un second
passage vingt minutes après l'heure cible. GitHub peut retarder les tâches et le
build Pages prend du temps : ces horaires ne garantissent pas une visibilité à la
seconde près.

Depuis Actions, choisir **etape = annonce** ou **etape = sortie** sur `main`, avec **verification = true**
(valeur par défaut) pour répéter la fusion et le build **sans pousser la sortie**.
Le contrôle SEO emploie explicitement `--as-of` avec la date de l'étape pour cette simulation ;
sans cette option, il continue à refuser les dates futures. Le rendu HTML, les
photos et les SHA contrôlés sont conservés dans l'artefact
`verification-annonce-monsieur-clerge` ou `verification-sortie-monsieur-clerge` pendant 30 jours.

Les deux modes demandent ensuite un vrai build de **main** par l'API Pages avec
`GITHUB_TOKEN` et le droit `pages: write`, puis suivent le **nouveau** workflow
`pages build and deployment` jusqu'à son succès, pour le SHA attendu
(`actions: read`). Le statut de `/pages/builds/latest` n'est pas utilisé : il peut
rester sur un ancien build annulé du même SHA. Aucun secret `PAGES_TOKEN` n'est
nécessaire. La vérification reconstruit uniquement le site déjà public.
La publication peut être relancée avec **verification = false** après l'heure
prévue : même si la branche est déjà fusionnée, la demande Pages est réessayée.
Une branche introuvable, un conflit, un refus API ou un build échoué fait échouer
le workflow au lieu de signaler un faux succès.

- Si `main` avance avant la date, relancer la vérification ; en cas de conflit,
  fusionner `main` dans la branche de sortie et résoudre le conflit avant la date.
- Intégrer aussi la branche d'annonce dans la branche de sortie : le 30, la brève
  du 23 reste dans les archives, mais son encart promotionnel disparaît de l'accueil.
- La branche ne régénère pas `oracle-putride.json` : le corpus se régénère sur
  `main` après la sortie. Régénérer alors les corpus, incrémenter les versions
  concernées et synchroniser ; le Worker relit la révision publiée.
