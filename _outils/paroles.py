"""Rassemble les paroles completes depuis Genius pour la memoire des IA.

Usage : python -X utf8 _outils/paroles.py
Ecrit _ver-worker/paroles.json (hors depot, comme coulisses.json).
Chaque titre : t (titre), a (artiste), al (album), d (date ISO), x (paroles).
Un titre embargo n'est servi par le Worker qu'apres sa date de sortie.
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ARTISTES = {2370139: 'Cul-Pointu'}
EMBARGO = {'Monsieur Clergé': '2026-11-30T17:30:00Z'}
# Genius ignore certaines dates ; l'annee publiee sur le site fait foi.
ANNEES = {'Mauvaises Nouvelles des Enfers': '2020'}
SORTIE = Path(__file__).resolve().parent.parent / '_ver-worker' / 'paroles.json'
ENTETES = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
           '(KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Accept-Language': 'fr-FR,fr;q=0.9'}


def lit(url, essais=3):
    for n in range(essais):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=ENTETES), timeout=30) as r:
                return r.read().decode('utf-8')
        except Exception:
            if n == essais - 1:
                raise
            time.sleep(2 + n * 3)


def chansons(artiste):
    page, tout = 1, []
    while page:
        d = json.loads(lit(f'https://genius.com/api/artists/{artiste}/songs?per_page=50&page={page}&sort=title'))
        tout += d['response']['songs']
        page = d['response']['next_page']
    return tout


def texte(page):
    blocs = []
    for m in re.finditer(r'<div[^>]*data-lyrics-container="true"[^>]*>', page):
        profondeur, i = 1, m.end()
        for b in re.finditer(r'<(/?)div\b[^>]*>', page[i:]):
            profondeur += -1 if b.group(1) else 1
            if not profondeur:
                blocs.append(page[i:i + b.start()])
                break
    lignes = []
    for b in blocs:
        b = re.sub(r'<div[^>]*data-exclude-from-selection="true"[^>]*>.*?</div>', '', b, flags=re.S)
        b = re.sub(r'<br\s*/?>', '\n', b)
        b = re.sub(r'<[^>]+>', '', b)
        lignes.append(html.unescape(b))
    x = '\n'.join(lignes)
    x = re.sub(r'^.*?Lyrics(?=\[)', '', x, flags=re.S) if re.match(r'^\d+ Contributors?', x) else x
    return re.sub(r'\n{3,}', '\n\n', x).strip()


def main():
    vus, sortie = set(), []
    artistes = dict(ARTISTES)
    file = list(artistes)
    while file:
        a = file.pop(0)
        for s in chansons(a):
            pa = s['primary_artist']
            if pa['id'] not in artistes and pa['id'] != a:
                artistes[pa['id']] = pa['name']
                file.append(pa['id'])
            if s['id'] in vus or s.get('lyrics_state') != 'complete':
                continue
            vus.add(s['id'])
            info = json.loads(lit(f"https://genius.com/api/songs/{s['id']}"))['response']['song']
            x = texte(lit(s['url']))
            if not x:
                print('sans paroles :', s['title'], file=sys.stderr)
                continue
            titre = html.unescape(s['title'])
            e = {'t': titre, 'a': pa['name'], 'al': (info.get('album') or {}).get('name', ''),
                 'd': info.get('release_date') or '', 'x': x}
            e['d'] = e['d'] or ANNEES.get(e['al'], '')
            if titre in EMBARGO:
                e['embargo'] = EMBARGO[titre]
            sortie.append(e)
            print(f"{len(sortie):3} {titre} / {e['al']} ({len(x)} c.)")
            time.sleep(0.4)
    sortie.sort(key=lambda e: (e['d'] or '9999', e['t']))
    SORTIE.write_text(json.dumps(sortie, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
    print(len(sortie), 'titres,', sum(len(e['x']) for e in sortie), 'caracteres ->', SORTIE)


if __name__ == '__main__':
    main()
