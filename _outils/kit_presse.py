"""Reconstruit le kit presse en un clic : presse/dossier-de-presse.zip.

Usage : python -X utf8 _outils/kit_presse.py
(après _outils/apercus.py, pour que les cartes soient à jour)

Contenu : le dossier PDF, les visuels HD, la biographie courte et complète
reprise de la page Presse, et les cartes « DISPONIBLE » de chaque sortie.
Dates figées dans l'archive : elle ne change que si son contenu change.
"""
import html
import re
import zipfile
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
ZIP = RACINE / 'presse' / 'dossier-de-presse.zip'
DATE = (2026, 1, 1, 0, 0, 0)
VISUELS = ['creature.jpg', 'odium-fidei.jpg', 'pochette-confiteor.jpg', 'pochette-jubile.jpg',
           'pochette-machines-infernales.jpg', 'pochette-miserables.jpg', 'pochette-omerta434.jpg',
           'pochette-omerta434-chyren.jpg']
CREDIT = '© PUANTEUR PUTRIDE Productions'


def texte(fragment):
    return html.unescape(re.sub(r'<[^>]+>', '', fragment)).strip()


def biographie():
    s = (RACINE / 'presse' / 'index.html').read_text(encoding='utf-8')
    courte = re.search(r'<h3>Version courte</h3>\s*<p>(.*?)</p>', s, re.S)
    complete = re.search(r'<h3>Version complète</h3>\s*<p>(.*?)</p>', s, re.S)
    if not courte or not complete:
        raise SystemExit('Présentations introuvables dans presse/index.html')
    return ('LA CRÉATURE DU MARAIS (CUL-POINTU) — BIOGRAPHIE\n\n'
            f'Version courte\n\n{texte(courte.group(1))}\n\n'
            f'Version complète\n\n{texte(complete.group(1))}\n\n'
            'Textes libres de reprise, avec la mention « La Créature du Marais · lacreaturedumarais.fr ».\n'
            'Biographie détaillée : https://lacreaturedumarais.fr/biographie/\n')


LISEZ_MOI = f"""Kit presse — La Créature du Marais (Cul-Pointu)
https://lacreaturedumarais.fr/presse/
Contact : puanteur.putride.productions@gmail.com

dossier-de-presse.pdf   le dossier complet
biographie.txt          présentations courte et complète, prêtes à publier
visuels/                photo et pochettes en haute définition
cartes/                 visuels « DISPONIBLE » de chaque sortie (1200 × 630)

Visuels : tous droits réservés. Usage presse et promotion autorisé avec la
mention « {CREDIT} ».
Autres usages sur demande : https://lacreaturedumarais.fr/contact/
"""


def ajoute(z, nom, donnees):
    info = zipfile.ZipInfo(nom, DATE)
    info.compress_type = zipfile.ZIP_STORED if nom.endswith('.jpg') else zipfile.ZIP_DEFLATED
    z.writestr(info, donnees)


def main():
    cartes = sorted((RACINE / 'images' / 'apercu').glob('*.jpg'))
    with zipfile.ZipFile(ZIP, 'w') as z:
        ajoute(z, 'LISEZ-MOI.txt', LISEZ_MOI.encode('utf-8'))
        ajoute(z, 'biographie.txt', biographie().encode('utf-8'))
        ajoute(z, 'dossier-de-presse.pdf', (RACINE / 'presse' / 'dossier-de-presse.pdf').read_bytes())
        for v in VISUELS:
            ajoute(z, f'visuels/{v}', (RACINE / 'images' / v).read_bytes())
        for c in cartes:
            ajoute(z, f'cartes/{c.name}', c.read_bytes())
    print(f'{ZIP.relative_to(RACINE)} : {len(VISUELS)} visuels, {len(cartes)} cartes, '
          f'{ZIP.stat().st_size / 1e6:.1f} Mo')


if __name__ == '__main__':
    main()
