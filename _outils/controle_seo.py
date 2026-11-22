"""Vérifie le sitemap et les pages rendues, sans modifier leur contenu.

python _outils/controle_seo.py _site
python _outils/controle_seo.py --base-url http://127.0.0.1:8851
python _outils/controle_seo.py _site --as-of 2026-11-30
"""
import argparse
from datetime import date
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit
from urllib.request import urlopen
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

ORIGIN = "https://lacreaturedumarais.fr"
NS = {
    "s": "http://www.sitemaps.org/schemas/sitemap/0.9",
    "i": "http://www.google.com/schemas/sitemap-image/1.1",
    "v": "http://www.google.com/schemas/sitemap-video/1.1",
}


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.canonicals = []
        self.meta = {}
        self.title = ""
        self.jsonld = []
        self.in_title = False
        self.ld = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href"))
        if tag == "meta":
            self.meta[a.get("name", a.get("property", ""))] = a.get("content", "")
        if tag == "title":
            self.in_title = True
        if tag == "script" and a.get("type") == "application/ld+json":
            self.ld = ""

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.ld is not None:
            self.ld += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.ld is not None:
            self.jsonld.append(json.loads(self.ld))
            self.ld = None


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


def controle(site, base_url=None, as_of=None):
    today = as_of if as_of is not None else date.today()

    def read(path):
        if base_url:
            with urlopen(base_url.rstrip("/") + path, timeout=20) as response:
                if response.status != 200 or urlsplit(response.url).path != path:
                    raise ValueError(f"{path} : réponse non canonique")
                return response.read().decode("utf-8")
        target = site / unquote(path).lstrip("/")
        if path.endswith("/"):
            target /= "index.html"
        return target.read_text(encoding="utf-8")

    sitemap = ET.fromstring(read("/sitemap.xml"))
    if sitemap.tag != "{" + NS["s"] + "}urlset":
        raise ValueError("Le sitemap doit être un urlset.")
    robots = RobotFileParser()
    robots.parse(read("/robots.txt").splitlines())
    if ORIGIN + "/sitemap.xml" not in (robots.site_maps() or []):
        raise ValueError("Le sitemap manque dans robots.txt.")
    errors, seen = [], set()
    videos = images = 0
    for item in sitemap.findall("s:url", NS):
        url = item.findtext("s:loc", namespaces=NS)
        try:
            if not url or not url.startswith(ORIGIN + "/"):
                raise ValueError("URL hors du domaine canonique")
            path = urlsplit(url).path
            if url in seen or urlsplit(url).query or urlsplit(url).fragment:
                raise ValueError("URL répétée ou contenant paramètres/ancre")
            seen.add(url)
            if path.startswith(("/mode-putride", "/cachot")):
                raise ValueError("Une couche cachée apparaît dans le sitemap")
            for bot in ("Googlebot", "Bingbot"):
                if not robots.can_fetch(bot, url):
                    raise ValueError(f"Page bloquée pour {bot}")
            lastmod = item.findtext("s:lastmod", namespaces=NS)
            if lastmod and date.fromisoformat(lastmod[:10]) > today:
                raise ValueError("lastmod dans le futur")
            page = Page(read(path))
            if page.canonicals != [url]:
                raise ValueError(f"Canonical incorrect : {page.canonicals}")
            if "noindex" in page.meta.get("robots", "").lower():
                raise ValueError("Page noindex dans le sitemap")
            if not page.title.strip() or not page.meta.get("description"):
                raise ValueError("Titre ou description absent")
            for ld in objects(page.jsonld):
                if ld.get("@type") == "VideoObject":
                    for key in ("name", "description", "thumbnailUrl", "uploadDate", "embedUrl"):
                        if not ld.get(key):
                            raise ValueError(f"VideoObject sans {key}")
            for image in item.findall("i:image/i:loc", NS):
                images += 1
                if not image.text or not image.text.startswith(ORIGIN + "/"):
                    raise ValueError("Image hors du domaine")
                for bot in ("Googlebot-Image", "Bingbot"):
                    if not robots.can_fetch(bot, image.text):
                        raise ValueError(f"Image bloquée pour {bot} : {image.text}")
                target = site / unquote(urlsplit(image.text).path).lstrip("/")
                if not target.is_file():
                    raise ValueError(f"Image absente : {image.text}")
            for video in item.findall("v:video", NS):
                videos += 1
                for key in ("thumbnail_loc", "title", "description", "player_loc"):
                    if not video.findtext("v:" + key, namespaces=NS):
                        raise ValueError(f"Vidéo du sitemap sans {key}")
        except (ValueError, OSError) as error:
            errors.append(f"{url} : {error}")
    if not seen:
        errors.append("Sitemap vide")
    if not base_url:
        for file in site.rglob("*.html"):
            path = "/" + file.relative_to(site).as_posix()
            path = path.removesuffix("index.html")
            page = Page(file.read_text(encoding="utf-8"))
            if page.canonicals == [ORIGIN + path] and "noindex" not in page.meta.get("robots", ""):
                if ORIGIN + path not in seen:
                    errors.append(f"Page canonique absente du sitemap : {path}")
    if errors:
        raise ValueError("\n".join(errors))
    print(f"SEO valide : {len(seen)} pages, {images} images, {videos} vidéos.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site", nargs="?", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--base-url", help="Serveur de pages rendues ; images vérifiées dans le dossier site.")
    parser.add_argument("--as-of", type=date.fromisoformat,
                        help="Date ISO simulée pour vérifier une sortie future, sans la publier.")
    args = parser.parse_args()
    controle(args.site, args.base_url, args.as_of)
