"""Base de l'Oracle : extrait, mot pour mot, les textes des pages du mode putride et des cachots.

L'Oracle ne répond qu'avec ces extraits (et un lien vers leur page) : il n'invente rien.
Relancer après avoir modifié le contenu de ces pages :  python _outils/oracle.py
"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

RACINE = Path(__file__).resolve().parent.parent
COUCHES = {
    'putride': {'dossier': 'mode-putride', 'sortie': 'oracle-putride.json',
                # la porte du bas reste un secret : l'Oracle ne la connaît pas
                'exclus': {'/mode-putride/', '/mode-putride/archives/ordures/'}},
    'cachot': {'dossier': 'cachot', 'sortie': 'oracle-cachot.json', 'exclus': set()},
}
BLOCS = {'p', 'li', 'blockquote', 'dd', 'dt', 'figcaption', 'h1', 'h2', 'h3', 'h4'}
IGNORES = {'script', 'style', 'svg', 'button', 'nav', 'noscript', 'template', 'select', 'form'}
CLASSES_IGNOREES = {'kicker', 'back', 'gal', 'voixnone', 'pl-t', 'pl-t2', 'sr-only', 'pfoot'}
VIDES = {'br', 'img', 'hr', 'input', 'source', 'meta', 'link', 'wbr'}


def propre(t):
    return re.sub(r'\s+', ' ', t).strip()


class Lecteur(HTMLParser):
    """Relève, dans <main>, chaque bloc de texte (titre, paragraphe, élément de liste…) et les ancres qui le précèdent."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.dans_main = 0
        self.pile = []
        self.ouverts = []
        self.sortie = []
        self.ids = {}

    def ignore(self):
        return any(i for _, i in self.pile)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'main':
            self.dans_main += 1
            return
        if not self.dans_main:
            return
        if tag in VIDES:
            if tag == 'br' and self.ouverts:
                self.ouverts[-1][2].append(' ')
            return
        cls = set((a.get('class') or '').split())
        ign = tag in IGNORES or bool(cls & CLASSES_IGNOREES) or a.get('aria-hidden') == 'true' or 'hidden' in a
        self.pile.append((tag, ign))
        if self.ignore():
            return
        if a.get('id'):
            self.ids[len(self.sortie)] = a['id']
        if 'bio' in cls:
            # la présentation d'un album suit la liste des titres : elle ouvre une section à part
            self.sortie.append(('sec', a.get('id'), '', cls))
        if tag in ('small', 'time') and self.ouverts:
            self.ouverts[-1][2].append(' · ')
        if tag in BLOCS:
            self.ouverts.append([tag, a.get('id'), [], cls])

    def handle_endtag(self, tag):
        if not self.dans_main or tag in VIDES:
            return
        if tag == 'main':
            self.dans_main -= 1
            return
        while self.pile:
            if self.pile.pop()[0] == tag:
                break
        if tag in BLOCS and self.ouverts and self.ouverts[-1][0] == tag:
            b, i, m, c = self.ouverts.pop()
            txt = propre(''.join(m))
            if txt:
                self.sortie.append((b, i, txt, c))

    def handle_data(self, data):
        if self.dans_main and self.ouverts and not self.ignore():
            # seul le bloc le plus profond garde le texte : un li dans un li ne se répète pas
            self.ouverts[-1][2].append(data)


def titre_page(html_txt, blocs):
    h1 = next((t for b, _, t, _ in blocs if b == 'h1'), None)
    if h1:
        return h1
    m = re.search(r'<title>(.*?)</title>', html_txt, re.S)
    t = re.sub(r'\s*\|.*$', '', propre(m.group(1)) if m else '')
    return re.sub(r'^(MODE PUTRIDE|Mode Putride|Les cachots)\s*·\s*', '', t)


def extraits(chemin):
    html_txt = chemin.read_text(encoding='utf-8')
    lec = Lecteur()
    lec.feed(html_txt)
    titre = titre_page(html_txt, lec.sortie)
    res, h2, ancre, sous, section = [], '', '', '', False
    for n, (b, i, t, c) in enumerate(lec.sortie):
        if b == 'h1':
            continue
        if b in ('h2', 'sec'):
            h2, sous, ancre, section = t, '', i or lec.ids.get(n, ''), True
            continue
        if b in ('h3', 'h4'):
            sous = t
            continue
        court = len(t) < 40
        if (court and not sous) or 'role' in c:
            continue
        texte = f'{sous} : {t}' if sous and court else t
        if len(texte) < 12 or texte.startswith('Voir aussi'):
            continue
        # 1 : présentation de la page ; 2 : légende (crédits, titres de films), moins prioritaire
        k = 1 if ('accroche' in c or (not section and not sous)) else 2 if b == 'figcaption' else 0
        a = i or lec.ids.get(n) or (ancre if section else '')
        res.append([h2, '#' + a if a else '', texte, k])
        if court:
            sous = ''
    vus, uniques = set(), []
    for e in res:
        if e[2] not in vus:
            vus.add(e[2])
            uniques.append(e)
    return titre, uniques


def construit(conf):
    pages, ent = [], []
    for f in sorted((RACINE / conf['dossier']).rglob('index.html')):
        url = '/' + f.parent.relative_to(RACINE).as_posix() + '/'
        if url in conf['exclus']:
            continue
        titre, ex = extraits(f)
        if not ex:
            continue
        pages.append([titre, url])
        for h, a, t, l in ex:
            ent.append([len(pages) - 1, h, a, t, l])
    sortie = RACINE / conf['sortie']
    sortie.write_text(json.dumps({'v': 1, 'p': pages, 'e': ent}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'{conf["sortie"]} : {len(pages)} pages, {len(ent)} extraits, {sortie.stat().st_size // 1024} Ko')


if __name__ == '__main__':
    for conf in COUCHES.values():
        construit(conf)
