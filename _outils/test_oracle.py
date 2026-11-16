import tempfile
import unittest
from pathlib import Path

from oracle import extraits


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


if __name__ == "__main__":
    unittest.main()
