import contextlib
from datetime import date, timedelta
import io
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from controle_seo import ORIGIN, controle


class ScheduledSeoTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.site = Path(self.directory.name)
        self.release = date.today() + timedelta(days=1)
        (self.site / "robots.txt").write_text(
            f"User-agent: *\nAllow: /\nSitemap: {ORIGIN}/sitemap.xml\n",
            encoding="utf-8",
        )
        (self.site / "index.html").write_text(
            f'<title>Single</title><link rel="canonical" href="{ORIGIN}/">'
            '<meta name="description" content="Scheduled single">',
            encoding="utf-8",
        )
        (self.site / "sitemap.xml").write_text(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            f'<url><loc>{ORIGIN}/</loc><lastmod>{self.release}</lastmod></url>'
            '</urlset>',
            encoding="utf-8",
        )

    def test_future_release_stays_invalid_before_its_date(self):
        for as_of in (None, self.release - timedelta(days=1)):
            with self.subTest(as_of=as_of):
                with self.assertRaisesRegex(ValueError, "lastmod dans le futur"):
                    controle(self.site, as_of=as_of)
        with contextlib.redirect_stdout(io.StringIO()):
            controle(self.site, as_of=self.release)

    def test_cli_passes_the_explicit_release_date(self):
        result = subprocess.run(
            [sys.executable, "-X", "utf8", str(Path(__file__).with_name("controle_seo.py")),
             str(self.site), "--as-of", self.release.isoformat()],
            capture_output=True, text=True, encoding="utf-8",
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("1 pages", result.stdout)


if __name__ == "__main__":
    unittest.main()
