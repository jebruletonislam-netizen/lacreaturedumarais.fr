"""Le flux RSS des Nouvelles (flux.xml) est généré par Jekyll à partir du front matter.

Chaque article public de nouvelles/ porte un `flux_date` (ISO 8601) : Jekyll le
place alors dans le flux, du plus récent au plus ancien.

    python -m unittest discover -s _outils -p test_flux.py

Après publication, vérifier aussi le flux rendu :

    set FLUX_URL=https://lacreaturedumarais.fr/flux.xml
    python -m unittest discover -s _outils -p test_flux.py
"""
import os
import re
import unittest
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent


def articles():
    for page in sorted((RACINE / 'nouvelles').glob('*/index.html')):
        texte = page.read_text(encoding='utf-8')
        entete = texte.split('---')[1] if texte.startswith('---') else ''
        yield page, texte, entete


def champ(entete, nom):
    m = re.search(rf'^{nom}:\s*"?(.*?)"?\s*$', entete, re.M)
    return m.group(1) if m else None


class FluxNouvelles(unittest.TestCase):
    def test_gabarit_jekyll(self):
        texte = (RACINE / 'flux.xml').read_text(encoding='utf-8')
        self.assertTrue(texte.startswith('---\n'), 'flux.xml doit avoir un front matter pour être rendu par Jekyll')
        self.assertIn('where_exp: "p", "p.flux_date"', texte)
        self.assertIn('| reverse', texte)

    def test_chaque_article_public_est_date(self):
        vus = 0
        for page, texte, entete in articles():
            nom = page.parent.name
            if 'noindex' in texte[:1200]:
                self.assertIsNone(champ(entete, 'flux_date'), f'{nom} est noindex mais entre dans le flux')
                continue
            date = champ(entete, 'flux_date')
            self.assertTrue(date, f'{nom} : flux_date manquant, l’article n’apparaîtra pas dans flux.xml')
            self.assertIsNotNone(datetime.fromisoformat(date).tzinfo, f'{nom} : flux_date sans fuseau')
            self.assertTrue(champ(entete, 'description'), f'{nom} : description manquante')
            self.assertTrue(champ(entete, 'title'), f'{nom} : titre manquant')
            vus += 1
        self.assertGreater(vus, 0)

    @unittest.skipUnless(os.environ.get('FLUX_URL'), 'FLUX_URL non défini : flux rendu non vérifié')
    def test_flux_rendu(self):
        requete = urllib.request.Request(os.environ['FLUX_URL'], headers={'User-Agent': 'controle-flux'})
        with urllib.request.urlopen(requete, timeout=30) as r:
            canal = ET.fromstring(r.read()).find('channel')
        items = canal.findall('item')
        liens = {item.findtext('link') for item in items}
        for page, texte, entete in articles():
            if champ(entete, 'flux_date'):
                self.assertIn(f'https://lacreaturedumarais.fr/nouvelles/{page.parent.name}/', liens)
        dates = []
        for item in items:
            for nom in ('title', 'link', 'guid', 'pubDate', 'description'):
                self.assertTrue((item.findtext(nom) or '').strip(), nom)
            self.assertRegex(item.findtext('link'), r'^https://lacreaturedumarais\.fr/nouvelles/[^/]+/$')
            dates.append(parsedate_to_datetime(item.findtext('pubDate')))
        self.assertEqual(dates, sorted(dates, reverse=True))
        self.assertEqual(parsedate_to_datetime(canal.findtext('lastBuildDate')), dates[0])


if __name__ == '__main__':
    unittest.main()
