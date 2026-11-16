Site officiel de La Créature du Marais — version visuelle basée sur le fichier index.html fourni. Conserver le dossier images/ existant du dépôt lors du remplacement des fichiers HTML/CSS.

## Le Ver

Le dialogue fonctionne localement, sans API ni modèle génératif. `coins.js` combine
des répliques sourcées, la recherche d'extraits (avec tolérance aux fautes) et le
contexte des questions précédentes. Il décrit l'œuvre, sans diagnostiquer son auteur.
Après une modification éditoriale, lancer `python _outils/oracle.py` et incrémenter
la version des registres dans `coins.js`. Le mode putride connaît ses pages et les
deux biographies publiques ; les registres des cachots restent séparés.

Le bouton du dialogue est le nid du Ver : clic pour parler, glissement pour le
faire suivre le pointeur. Premier départ après 3 secondes sans interaction,
puis 13 secondes de promenade et 13 secondes de repos. Dialogue, survol, liseuse
et onglet masqué suspendent les départs. Le mode calme conserve le dialogue sans
promenade. Incrémenter les versions des scripts dans tous leurs chargeurs.

Tests ciblés : `python -m unittest discover -s _outils -p test_oracle.py`, puis
`python _outils/test_ver.py http://127.0.0.1:8851` avec Playwright Python et Edge.
Le second test mesure le cycle en temps réel et vérifie le dialogue et les gestes.

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
