import tempfile
import unittest
from pathlib import Path

from oracle import extraits, url_page


class OracleExtractionTests(unittest.TestCase):
    def extrait(self, html):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "index.html"
            path.write_text(html, encoding="utf-8")
            return extraits(path)

    def test_relation_garde_son_libelle(self):
        _, entries = self.extrait(
            "<main><h1>Madame Edwarda</h1><dl>"
            "<dt>ENFANT</dt><dd><a>Éphébito</a>, avec Éphébelle</dd>"
            "<dt>LIEUX</dt><dd>Normandie</dd></dl></main>"
        )
        texts = [entry[2] for entry in entries]
        self.assertIn("ENFANT : Éphébito, avec Éphébelle", texts)
        self.assertIn("LIEUX : Normandie", texts)

    def test_biographie_jekyll_sans_layout(self):
        title, entries = self.extrait(
            "---\nlayout: seo-page\nsecret: metadata-only\n---\n"
            "<h1>Biographie</h1><h2>La méthode</h2>"
            "<p>Prendre une forme reconnaissable et la faire dérailler.</p>"
        )
        self.assertEqual(title, "Biographie")
        self.assertEqual(len(entries), 1)
        self.assertNotIn("metadata-only", entries[0][2])

    def test_navigation_et_blocs_masques_exclus(self):
        _, entries = self.extrait(
            "<main><h1>Registres</h1><nav><p>Navigation à ne pas indexer.</p></nav>"
            "<p hidden>Secret masqué à ne jamais reprendre dans une réponse.</p>"
            "<p>Le texte visible assez long reste bien présent dans les registres.</p></main>"
        )
        self.assertEqual(len(entries), 1)
        self.assertTrue(entries[0][2].startswith("Le texte visible"))

    def test_sous_titre_et_description_de_piece_restent_interrogeables(self):
        _, entries = self.extrait(
            '<main><h1>Dossier</h1><h2 id="temoins">Témoignages</h2>'
            '<h3>Les anciennes sœurs</h3><p>Elles décrivent les conditions de vie dans leur communauté.</p>'
            '<img alt="Description publiée d’une pièce numérisée, sans inventer sa transcription."></main>'
        )
        self.assertIn("anciennes sœurs", entries[0][0])
        self.assertEqual(entries[0][1], "#temoins")
        self.assertEqual(entries[1][3], 2)

    def test_permalink_et_liquid(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "index.html"
            path.write_text(
                '---\npermalink: "/video/clip-la-chute/"\n---\n'
                '<h1>La Chute</h1><p>Un récit qui reste accessible sur sa véritable adresse publique.</p>'
                '{% include clip-gallery.html %}', encoding='utf-8'
            )
            self.assertEqual(url_page(path), "/video/clip-la-chute/")
            self.assertEqual(len(extraits(path)[1]), 1)

    def test_album_sans_biographie_garde_date_interprete_et_titres(self):
        _, entries = self.extrait(
            '<main><section data-artist="Les Retard-Tinables"><h1>Rien à déclarer</h1>'
            '<p class="am">2018 · 6 titres · 17 min 50 s</p><h2>Titres</h2>'
            '<button class="trp"><b>1.</b><span>Casso</span></button>'
            '<button>Tout écouter</button></section></main>'
        )
        texts = ' '.join(e[2] for e in entries)
        self.assertIn('Interprète : Les Retard-Tinables', texts)
        self.assertIn('2018', texts)
        self.assertIn('Casso', texts)
        self.assertNotIn('Tout écouter', texts)


if __name__ == "__main__":
    unittest.main()
