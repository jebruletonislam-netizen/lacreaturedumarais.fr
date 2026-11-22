"""Signale les liens du compte visibles dans le widget public, sans les publier."""

import json
import re
import sys
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen


COMPTE = "TancredeCharon"
WIDGET = f"https://syndication.twitter.com/srv/timeline-profile/screen-name/{COMPTE}"


def liens_visibles(html):
    donnees = re.search(r'<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not donnees:
        raise ValueError("Le widget public ne fournit pas son fil.")
    entrees = json.loads(donnees[1])["props"]["pageProps"]["timeline"]["entries"]
    if not isinstance(entrees, list) or not entrees:
        raise ValueError("Fil vide ou illisible : contrôle impossible.")
    ids = set()
    for entree in entrees:
        if entree.get("type") != "tweet":
            continue
        tweet = entree["content"]["tweet"]
        if tweet["user"]["screen_name"].casefold() != COMPTE.casefold() or tweet.get("retweeted_status"):
            continue
        identifiant = tweet["id_str"]
        if not re.fullmatch(r"[0-9]{1,20}", identifiant):
            raise ValueError("Identifiant de publication inattendu.")
        ids.add(identifiant)
    if not ids:
        raise ValueError("Aucune publication du compte identifiable dans le widget.")
    return [f"https://x.com/{COMPTE}/status/{i}" for i in sorted(ids, key=int, reverse=True)]


def rapport():
    with urlopen(WIDGET, timeout=25) as reponse:
        html = reponse.read(4_000_001)
    if len(html) > 4_000_000:
        raise ValueError("Réponse du widget trop volumineuse.")
    liens = liens_visibles(html.decode("utf-8"))
    return (f"### @{COMPTE} : {len(liens)} publication(s) visible(s)\n\n"
            "Instantané public, potentiellement incomplet. Rien n’est publié sur le site.\n\n"
            + "\n".join(f"- {lien}" for lien in liens) + "\n")


if __name__ == "__main__":
    try:
        resultat = rapport()
    except (URLError, TimeoutError, KeyError, TypeError, ValueError) as erreur:
        resultat = f"Contrôle X impossible : {erreur}. Aucun changement sur le site.\n"
        print(resultat, file=sys.stderr)
        if len(sys.argv) > 1:
            Path(sys.argv[1]).write_text(resultat, encoding="utf-8")
        sys.exit(1)
    if len(sys.argv) > 1:
        Path(sys.argv[1]).write_text(resultat, encoding="utf-8")
    print(resultat)
