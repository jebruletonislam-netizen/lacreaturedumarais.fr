"""Registres du Ver : textes publiés du site, avec leurs pages et leurs sections.

Le Ver cite ces extraits et les relie à des répliques écrites dans coins.js.
Les deux couches consultent désormais les mêmes connaissances, sur choix du propriétaire.
Relancer après avoir modifié le contenu de ces pages :  python _outils/oracle.py
"""
from html.parser import HTMLParser
from pathlib import Path
from hashlib import sha256
import json
import re

RACINE = Path(__file__).resolve().parent.parent
SORTIES = ('oracle-putride.json', 'oracle-cachot.json')
BLOCS = {'p', 'li', 'blockquote', 'dd', 'dt', 'figcaption', 'summary', 'button', 'h1', 'h2', 'h3', 'h4'}
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
            if tag == 'img' and not self.ignore() and a.get('aria-hidden') != 'true' and 'hidden' not in a and len(a.get('alt', '')) >= 40:
                self.sortie.append(('figcaption', None, propre(a['alt']), set()))
            return
        cls = set((a.get('class') or '').split())
        ign = (tag in IGNORES and not (tag == 'button' and 'trp' in cls)) or bool(cls & CLASSES_IGNOREES) or a.get('aria-hidden') == 'true' or 'hidden' in a
        self.pile.append((tag, ign))
        if self.ignore():
            return
        if a.get('id'):
            self.ids[len(self.sortie)] = a['id']
        if a.get('data-artist'):
            self.sortie.append(('p', None, 'Interprète : ' + a['data-artist'], set()))
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
    inclusion = '{% include discographie-content.html %}'
    if inclusion in html_txt:
        html_txt = html_txt.replace(inclusion, (RACINE / '_includes' / 'discographie-content.html').read_text(encoding='utf-8'))
    if html_txt.startswith('---'):
        html_txt = re.sub(r'\A---\r?\n.*?\r?\n---\r?\n', '', html_txt, count=1, flags=re.S)
        if not re.search(r'<main\b', html_txt):
            html_txt = '<main>' + html_txt + '</main>'
    html_txt = re.sub(r'{%.*?%}|{{.*?}}', '', html_txt, flags=re.S)
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
        if b in ('h3', 'h4', 'dt', 'summary'):
            sous = t
            continue
        if 'am' in c:
            t = 'Parution : ' + t
        if 'trp' in c:
            t = 'Titre : ' + t
        court = len(t) < 40 and not (c & {'am', 'trp'}) and not t.startswith('Interprète :')
        if (court and not sous) or 'role' in c:
            continue
        texte = f'{sous} : {t}' if sous and (court or b == 'dd') else t
        if len(texte) < 12 or texte.startswith('Voir aussi'):
            continue
        # 1 : présentation de la page ; 2 : légende (crédits, titres de films), moins prioritaire
        k = 1 if ('accroche' in c or (not section and not sous)) else 2 if b == 'figcaption' else 0
        a = i or lec.ids.get(n) or (ancre if section else '')
        res.append([' · '.join(x for x in (h2, sous) if x), '#' + a if a else '', texte, k])
        if court or b == 'dd':
            sous = ''
    vus, uniques = set(), []
    for e in res:
        if e[2] not in vus:
            vus.add(e[2])
            uniques.append(e)
    return titre, uniques


def url_page(chemin):
    contenu = chemin.read_text(encoding='utf-8')
    if contenu.startswith('---'):
        entete = re.split(r'\r?\n---\r?\n', contenu, maxsplit=1)[0]
        lien = re.search(r'''(?m)^permalink:\s*["']?(/[^"'\s]*)''', entete)
        if lien:
            return lien[1]
    parent = chemin.parent.relative_to(RACINE).as_posix()
    return '/' if parent == '.' else '/' + parent + '/'


def construit():
    pages, ent = [], []
    fichiers = sorted(
        p for p in RACINE.rglob('index.html')
        if not any(x.startswith(('.', '_')) or x == 'node_modules'
                   for x in p.relative_to(RACINE).parts)
    )
    for f in fichiers:
        url = url_page(f)
        titre, ex = extraits(f)
        if not ex:
            continue
        pages.append([titre, url])
        for h, a, t, l in ex:
            ent.append([len(pages) - 1, h, a, t, l])
    # Les paroles déjà publiées par les compagnons sont des citations, pas des faits à extrapoler.
    paroles = (RACINE / 'cachot-paroles.js').read_text(encoding='utf-8')
    chaine = r'"(?:\\.|[^"\\])*"'
    lignes = re.findall(r'\{t:(' + chaine + r')(?:,d:(' + chaine + r'))?(?:,u:(' + chaine + r'))?\}', paroles)
    if len(lignes) != len(re.findall(r'\{t:', paroles)):
        raise ValueError('Format des paroles non reconnu : adapter le lecteur avant de publier.')
    pages.append(['Paroles publiées des compagnons', '/cachot/'])
    for texte, date, _ in lignes:
        ent.append([len(pages) - 1, 'Parole publiée' + (' · ' + json.loads(date) if date else ''),
                    '', json.loads(texte), 2])
    donnees = {'v': 2, 'p': pages, 'e': ent}
    empreinte = json.dumps(donnees, ensure_ascii=False, separators=(',', ':'))
    donnees['revision'] = sha256(empreinte.encode('utf-8')).hexdigest()[:16]
    contenu = json.dumps(donnees, ensure_ascii=False, separators=(',', ':'))
    for nom in SORTIES:
        sortie = RACINE / nom
        sortie.write_text(contenu, encoding='utf-8')
        print(f'{nom} : {len(pages)} pages, {len(ent)} extraits, {sortie.stat().st_size // 1024} Ko')


if __name__ == '__main__':
    construit()
