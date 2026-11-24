"""Questions d'ouverture les plus posées aux IA du site, pour nourrir la FAQ publique.

Usage : python -X utf8 _outils/faq_questions.py [AAAA-MM] [--tous]

Lit les compteurs anonymes du KV STATS du Worker (clés q:<persona>:<mois>:<question>).
Par défaut, seules les questions posées à Tristana (mode normal, public) sont listées :
celles du Ver concernent le mode putride, qui ne doit pas nourrir la FAQ publique.
"""
import datetime
import json
import os
import subprocess
import sys

DOSSIER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_ver-worker")


def wrangler(*args):
    env = dict(os.environ, WRANGLER_SEND_METRICS="false")
    sortie = subprocess.run("npx wrangler kv " + " ".join(args) + " --binding STATS --remote",
                            cwd=DOSSIER, env=env, shell=True, capture_output=True,
                            text=True, encoding="utf-8", check=True).stdout
    return sortie


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    mois = args[0] if args else datetime.date.today().strftime("%Y-%m")
    personas = ("tristana", "ver") if "--tous" in sys.argv else ("tristana",)
    lignes = []
    for persona in personas:
        prefixe = f"q:{persona}:{mois}:"
        cles = json.loads(wrangler("key list", f'--prefix "{prefixe}"'))
        for cle in cles:
            n = int(wrangler("key get", f'"{cle["name"]}"', "--text").strip() or 0)
            lignes.append((n, persona, cle["name"][len(prefixe):]))
    lignes.sort(key=lambda l: (-l[0], l[2]))
    print(f"{mois} : {len(lignes)} questions distinctes")
    for n, persona, question in lignes:
        print(f"{n:>4}  {persona:<8}  {question}")


if __name__ == "__main__":
    main()
