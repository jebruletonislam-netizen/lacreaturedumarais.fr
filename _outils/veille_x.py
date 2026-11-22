"""Capture les publications récentes accessibles sans compte. Ne modifie pas le site."""

import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from playwright.sync_api import Error as BrowserError, sync_playwright


COMPTE = "TancredeCharon"
PROFIL = f"https://x.com/{COMPTE}"
PERMALIEN = re.compile(rf"/{COMPTE}/status/([0-9]{{1,20}})", re.I)


def publications(page):
    articles = page.locator("main article")
    articles.first.wait_for(timeout=20000)
    ids = set()
    for _ in range(8):
        # Le premier permalien de la carte est celui de l’auteur, pas celui du post cité.
        liens = articles.evaluate_all("""cards => cards.map(a =>
            a.querySelector('a[href*="/status/"]')?.pathname || '')""")
        avant = len(ids)
        ids.update(m[1] for lien in liens if (m := PERMALIEN.fullmatch(lien)))
        if len(ids) == avant:
            break
        articles.last.scroll_into_view_if_needed()
        page.wait_for_timeout(800)
    if not ids:
        raise ValueError("Aucune publication du compte identifiable sur le profil public.")
    return sorted(ids, key=int, reverse=True)


def capturer(page, dossier, maintenant):
    def ouvrir(url):
        reponse = page.goto(url, wait_until="domcontentloaded", timeout=25000)
        if not reponse or not reponse.ok:
            raise ValueError(f"X refuse la page publique ({reponse.status if reponse else 'sans réponse'}).")

    ouvrir(PROFIL)
    refus = page.get_by_role("button", name="Refuse non-essential cookies")
    if refus.is_visible():
        refus.click()
    ids = publications(page)
    resultats = []
    for identifiant in ids:
        # Huit jours pour couvrir deux dimanches consécutifs malgré le retard possible du cron.
        date = datetime.fromtimestamp(((int(identifiant) >> 22) + 1288834974657) / 1000, timezone.utc)
        if not maintenant - timedelta(days=8) <= date <= maintenant:
            continue
        chemin = f"/{COMPTE}/status/{identifiant}"
        url = f"https://x.com{chemin}"
        ouvrir(url)
        article = page.locator("main article").first
        date_affichee = article.locator(f'a[href="{chemin}"]').first
        date_affichee.wait_for(timeout=15000)
        if not article.locator(f'a[href="/{COMPTE}"]').count():
            raise ValueError(f"Auteur non confirmé : {url}")
        texte = article.locator('[data-testid="tweetText"], [lang]').first
        transcription = texte.inner_text() if texte.count() else ""
        fichier = f"{identifiant}.png"
        article.scroll_into_view_if_needed()
        article.screenshot(path=dossier / fichier, timeout=10000)
        resultats.append({"url": url, "date_utc": date.isoformat(), "texte": transcription,
                          "date_affichee": date_affichee.inner_text(), "capture": fichier})
    return resultats


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dossier", type=Path)
    parser.add_argument("--resume", type=Path)
    args = parser.parse_args()
    args.dossier.mkdir(parents=True, exist_ok=True)
    try:
        with sync_playwright() as playwright:
            navigateur = playwright.chromium.launch()
            page = navigateur.new_page(viewport={"width": 1280, "height": 900}, locale="en-US",
                                       timezone_id="Europe/Paris")
            posts = capturer(page, args.dossier, datetime.now(timezone.utc))
            navigateur.close()
        (args.dossier / "publications.json").write_text(
            json.dumps(posts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        resume = (f"{len(posts)} publication(s) récente(s) visible(s) sur le profil public. "
                  "Relevé non exhaustif ; aucune publication sur le site.\n\n"
                  + "\n".join(f"- {p['url']}" for p in posts))
        code = 0
    except (BrowserError, ValueError, OSError) as erreur:
        print(erreur, file=sys.stderr)
        resume = "Lecture ou capture du profil public impossible. Le relevé n’est pas validé."
        code = 1
    if args.resume:
        args.resume.write_text(resume + "\n", encoding="utf-8")
    print(resume)
    return code


if __name__ == "__main__":
    sys.exit(main())
