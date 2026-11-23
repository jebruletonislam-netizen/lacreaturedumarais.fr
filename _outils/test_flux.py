"""Le flux RSS des Nouvelles (flux.xml) est écrit à la main : chaque article publié doit y figurer.

    python -m unittest discover -s _outils -p test_flux.py
"""
import re
import unittest
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent


class FluxNouvelles(unittest.TestCase):
    def setUp(self):
        self.canal = ET.parse(RACINE / 'flux.xml').getroot().find('channel')
        self.items = self.canal.findall('item')

    def test_chaque_article_est_dans_le_flux(self):
        liens = {item.findtext('link') for item in self.items}
        for page in (RACINE / 'nouvelles').glob('*/index.html'):
            texte = page.read_text(encoding='utf-8')
            if 'noindex' in texte[:600]:
                continue
            url = f'https://lacreaturedumarais.fr/nouvelles/{page.parent.name}/'
            self.assertIn(url, liens, f'{url} manque dans flux.xml')

    def test_items_complets_et_du_plus_recent_au_plus_ancien(self):
        dates = []
        for item in self.items:
            for champ in ('title', 'link', 'guid', 'pubDate', 'description'):
                self.assertTrue((item.findtext(champ) or '').strip(), champ)
            self.assertTrue(re.match(r'https://lacreaturedumarais\.fr/nouvelles/[^/]+/$', item.findtext('link')))
            self.assertNotRegex(item.findtext('link'), r'mode-putride|cachot')
            dates.append(parsedate_to_datetime(item.findtext('pubDate')))
        self.assertEqual(dates, sorted(dates, reverse=True))
        self.assertEqual(parsedate_to_datetime(self.canal.findtext('lastBuildDate')), dates[0])


if __name__ == '__main__':
    unittest.main()
