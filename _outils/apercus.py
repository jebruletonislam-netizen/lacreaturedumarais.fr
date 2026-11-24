"""Fabrique les images d'aperçu (og:image, 1200x630) des sorties du mode normal.

Usage :
  python -m http.server 8851        (à la racine du dépôt, dans un autre terminal)
  python -X utf8 _outils/apercus.py [--base http://127.0.0.1:8851] [slug ...]

Chaque page discographie/<slug>/index.html est rejouée dans l'accueil local, qui
charge coins.js et les polices du site ; coins.js dessine la fiche « DISPONIBLE »
à l'horizontale (window.LCMApercu, actif avec ?apercu). Le JPEG va dans
images/apercu/<slug>.jpg et le front matter reçoit og_image et og_alt.
"""
import argparse
import base64
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

RACINE = Path(__file__).resolve().parent.parent
SITE = 'https://lacreaturedumarais.fr'


def bloc(html, debut):
    """Le bloc <div …> complet qui commence à l'indice debut."""
    profondeur = 0
    for m in re.finditer(r'<(/?)div\b[^>]*>', html[debut:]):
        profondeur += -1 if m.group(1) else 1
        if not profondeur:
            return html[debut:debut + m.end()]
    raise ValueError('bloc .ah non fermé')


def source(slug):
    p = RACINE / 'discographie' / slug / 'index.html'
    s = p.open(encoding='utf-8', newline='').read()
    i = s.find('<div class="ah">')
    h1 = re.search(r'<h1\b[^>]*>.*?</h1>', s, re.S)
    if i < 0 or not h1:
        return None
    desc = re.search(r'^description:\s*"(.*)"\s*$', s, re.M)
    ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    return {'chemin': p, 'texte': s, 'ah': bloc(s, i), 'h1': h1.group(0),
            'desc': desc.group(1) if desc else '', 'ld': [x for x in ld if 'datePublished' in x][:1],
            'titre': re.sub(r'<[^>]+>', '', h1.group(0)).strip()}


def front(texte, cle, valeur):
    ligne = f'{cle}: "{valeur}"'
    fin = texte.index('\n---', 3)
    tete, reste = texte[:fin], texte[fin:]
    if re.search(rf'^{cle}:.*$', tete, re.M):
        tete = re.sub(rf'^{cle}:.*$', lambda _: ligne, tete, count=1, flags=re.M)
    else:
        tete += '\n' + ligne
    return tete + reste


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://127.0.0.1:8851')
    ap.add_argument('slugs', nargs='*')
    a = ap.parse_args()
    slugs = a.slugs or sorted(d.name for d in (RACINE / 'discographie').iterdir() if (d / 'index.html').exists())
    sortie = RACINE / 'images' / 'apercu'
    sortie.mkdir(parents=True, exist_ok=True)
    faits = 0
    with sync_playwright() as p:
        nav = p.chromium.launch(channel='msedge')
        page = nav.new_page(viewport={'width': 1366, 'height': 900})
        page.add_init_script("localStorage.setItem('lcdm-calme','1')")
        for slug in slugs:
            src = source(slug)
            if not src:
                print('ignoré (pas de fiche) :', slug)
                continue
            page.goto(a.base + '/?apercu')
            page.wait_for_function('window.LCMApercu')
            page.evaluate("""([slug, ah, h1, desc, ld]) => {
                history.replaceState(null, '', '/discographie/' + slug + '/?apercu');
                document.querySelectorAll('.ah, script[type="application/ld+json"]').forEach(e => e.remove());
                const m = document.querySelector('meta[name="description"]'); if (m) m.content = desc;
                const t = document.createElement('template'); t.innerHTML = ah;
                const bloc = t.content.firstElementChild; bloc.insertAdjacentHTML('afterbegin', h1);
                bloc.hidden = true; document.body.appendChild(bloc);
                ld.forEach(x => { const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = x; document.head.appendChild(s); });
            }""", [slug, src['ah'], src['h1'], src['desc'], src['ld']])
            url = page.evaluate("LCMApercu('DISPONIBLE')")
            (sortie / f'{slug}.jpg').write_bytes(base64.b64decode(url.split(',', 1)[1]))
            t = front(src['texte'], 'og_image', f'{SITE}/images/apercu/{slug}.jpg')
            t = front(t, 'og_alt', f'{src["titre"]} de Cul-Pointu (La Créature du Marais) : pochette et plateformes d’écoute')
            if t != src['texte']:
                src['chemin'].write_text(t, encoding='utf-8', newline='')
            print('ok', slug)
            faits += 1
        nav.close()
    return 0 if faits else 1


if __name__ == '__main__':
    sys.exit(main())
