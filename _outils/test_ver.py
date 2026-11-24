"""Tests du dialogue, du cycle réel et du portrait sur un serveur de prévisualisation.

python _outils/test_ver.py http://127.0.0.1:8851
Ajouter --ia pour ne vérifier que le transport IA simulé, --fenetre pour la fenêtre seule.
Les captures vont dans VER_CAPTURES (dossier temporaire par défaut).
Nécessite Playwright Python et Microsoft Edge.
"""
import os
import sys
import json
import tempfile

from playwright.sync_api import sync_playwright

BASE = next((a for a in sys.argv[1:] if not a.startswith("--")), "http://127.0.0.1:8851")
SORTIE = os.environ.get("VER_CAPTURES", tempfile.gettempdir())
SUITES_IA = ["Qui est Kobal ?", "Que garde la Gargouille ?"]


def question(page, text):
    count = page.locator(".cn-log .a:not(.cn-dots):not(.cn-live)").count()
    page.locator("#cn-q").fill(text)
    page.locator(".cn-f button[type=submit]").click()
    page.wait_for_function(
        "(n) => document.querySelectorAll('.cn-log .a:not(.cn-dots):not(.cn-live)').length > n",
        arg=count,
    )
    libre(page)
    return page.locator(".cn-log .a").last.inner_text()


def libre(page):
    page.wait_for_function("!document.querySelector('#cn-oracle').hasAttribute('aria-busy')")


def puces(page):
    """Trois suggestions au plus, entièrement visibles dans le panneau, sans défilement horizontal."""
    boites = page.locator(".cn-sug button")
    assert 1 <= boites.count() <= 3, boites.all_inner_texts()
    panneau = page.locator("#cn-oracle").bounding_box()
    for b in boites.all():
        r = b.bounding_box()
        assert r["x"] >= panneau["x"] and r["x"] + r["width"] <= panneau["x"] + panneau["width"] + 0.5, (r, panneau)
        assert b.evaluate("(b) => b.scrollWidth <= b.clientWidth + 1")
    assert page.locator(".cn-sug").evaluate("(s) => s.scrollWidth <= s.clientWidth + 1")
    assert page.locator(".cn-sug").bounding_box()["height"] < 110
    return boites.all_inner_texts()


def flux(lignes):
    return "".join(json.dumps(l, ensure_ascii=False) + "\n" for l in lignes)


def dialogue_ia(browser, width):
    """Vérifie le transport et le consentement avec un service simulé, pas le modèle."""
    context = browser.new_context(viewport={"width": width, "height": 844})
    context.add_init_script("localStorage.setItem('lcdm-calme','1')")
    endpoint = "https://ver-tests.workers.dev/chat"
    context.route("**/ver-ia.json*", lambda route: route.fulfill(
        content_type="application/json", body=json.dumps({"url": endpoint})))
    envois, erreurs_js, attentes = [], [], []
    etat = {"mode": "ok"}

    def service(route):
        headers = {"Access-Control-Allow-Origin": BASE,
                   "Access-Control-Allow-Methods": "POST",
                   "Access-Control-Allow-Headers": "Content-Type"}
        if route.request.method == "OPTIONS":
            route.fulfill(status=204, headers=headers)
            return
        envois.append(route.request.post_data_json)
        assert "referer" not in route.request.headers
        if etat["mode"] == "attente":
            attentes.append(route)
            return
        if etat["mode"] == "quota":
            route.fulfill(status=429, headers=headers, content_type="application/json",
                          body='{"error":"quota"}')
            return
        contenu = "La Gargouille est mon **amie**. [S1]\n- *Rouen* veille\n<img src=x onerror=alert(1)>"
        fin = {"text": contenu, "truncated": False, "suites": SUITES_IA,
               "sources": [{"n": 1, "title": "La Gargouille de Rouen",
                            "url": "/mode-putride/bestiaire/gargouille/"}]}
        if etat["mode"] == "json" or not route.request.post_data_json.get("stream"):
            route.fulfill(headers=headers, content_type="application/json", body=json.dumps(fin))
            return
        route.fulfill(headers=headers, content_type="application/x-ndjson; charset=utf-8", body=flux([
            {"d": "La Gargouille est "}, {"d": "mon **ami"}, {"t": "La Gargouille est mon **amie**."},
            {"d": " [S1]\n- *Rouen* veille\n<img src=x onerror=alert(1)>"}, dict(fin, fin=True)]))

    context.route(endpoint, service)
    context.grant_permissions(["clipboard-read", "clipboard-write"], origin=BASE)
    page = context.new_page()
    page.on("pageerror", lambda e: erreurs_js.append(str(e)))
    page.goto(BASE + "/mode-putride/bestiaire/ver/")
    page.locator(".cn-or").click()
    page.wait_for_selector(".cn-ai")
    assert "Gargouille" in question(page, "Tu es ami avec la Gargouille ?")
    assert not envois
    page.get_by_role("button", name="ACTIVER L’IA").click()
    question(page, "Qui sont tes amis ?")
    assert len(envois) == 1
    assert envois[0]["consent"] is True
    assert envois[0]["stream"] is True and "forme" not in envois[0]
    assert envois[0]["page"] == "/mode-putride/bestiaire/ver/", envois[0].get("page")
    assert len(envois[0]["revision"]) == 16
    assert envois[0]["ids"] and len(envois[0]["ids"]) <= 10
    corpus = page.request.get(BASE + "/oracle-putride.json").json()
    textes = [corpus["e"][i][3] for i in envois[0]["ids"]]
    assert any("ami" in t and "Gargouille" in t for t in textes), textes
    pages = {corpus["p"][corpus["e"][i][0]][1] for i in envois[0]["ids"]}
    assert "/mode-putride/bestiaire/gargouille/" in pages, pages
    assert envois[0]["messages"] == [{"role": "user", "content": "Qui sont tes amis ?"}]
    assert page.locator(".cn-log img").count() == 0
    assert page.locator(".cn-log .a").last.locator("a[href='/mode-putride/bestiaire/gargouille/']").count() == 2
    question(page, "Je préfère le piano. Et toi ?")
    assert len(envois[-1]["messages"]) == 3
    assert "[S1]" not in envois[-1]["messages"][1]["content"]
    derniere = page.locator(".cn-log .cn-wa").last
    assert derniere.locator(".cn-m strong").count() == 1 and derniere.locator(".cn-m em").count() == 1
    derniere.get_by_role("button", name="Copier la réponse").click()
    page.wait_for_function("document.querySelectorAll('.cn-log .cn-ic.ok').length === 1")
    copie = page.evaluate("navigator.clipboard.readText()")
    assert "Gargouille est mon amie" in copie and "[S1]" not in copie and "**" not in copie, copie
    questions, count = page.locator(".cn-log .cn-m.q").count(), len(envois)
    derniere.get_by_role("button", name="Autre réponse").click()
    libre(page)
    assert len(envois) == count + 1
    assert envois[-1]["messages"][-1]["content"] == "Je préfère le piano. Et toi ?"
    assert page.locator(".cn-log .cn-m.q").count() == questions
    page.locator(".cn-log .cn-wq").last.get_by_role("button", name="Modifier cette question").click()
    assert page.locator("#cn-q").input_value() == "Je préfère le piano. Et toi ?"
    assert page.locator(".cn-ed").is_visible()
    page.locator("#cn-q").fill("ligne 1")
    page.locator("#cn-q").press("Shift+Enter")
    assert page.locator("#cn-q").input_value() == "ligne 1\n" and len(envois) == count + 1
    page.locator("#cn-q").fill("Je préfère l’orgue. Et toi ?")
    page.locator("#cn-q").press("Enter")
    libre(page)
    assert len(envois) == count + 2 and len(envois[-1]["messages"]) == 3
    assert envois[-1]["messages"][-1]["content"] == "Je préfère l’orgue. Et toi ?"
    assert page.locator(".cn-log .cn-m.q").count() == questions
    assert "piano" not in page.locator(".cn-log").inner_text()
    assert not page.locator(".cn-ed").is_visible()
    assert puces(page)[:2] == SUITES_IA
    derniere = page.locator(".cn-log .cn-wa").last
    assert derniere.locator(".cn-fo").all_inner_texts() == ["Plus court", "Développer", "Plus simple"]
    derniere.get_by_role("button", name="Plus court").click()
    libre(page)
    assert envois[-1]["forme"] == "court" and len(envois) == count + 3
    assert envois[-1]["messages"][-1]["content"] == "Je préfère l’orgue. Et toi ?"
    assert page.locator(".cn-log .cn-wa").last.locator(".cn-fo").all_inner_texts() == ["Développer", "Plus simple"]
    etat["mode"] = "json"
    assert "Gargouille est mon amie" in question(page, "Réponse d’un service ancien")
    etat["mode"] = "ok"
    question(page, "Et la Créature, elle a été jugée pour quoi ?")
    ids = envois[-1]["ids"]
    assert any(corpus["e"][i][4] == 4 for i in ids), ids
    assert "/mode-putride/bestiaire/createur/" in {corpus["p"][corpus["e"][i][0]][1] for i in ids}, ids
    question(page, "Sermions, on l’appelle comment aussi ?")
    textes = [corpus["e"][i][3] for i in envois[-1]["ids"]]
    assert any(t.startswith("Surnom") and "Patrick Mions" in t for t in textes), textes
    question(page, "Christophe Chevanne a fait quoi en dehors des Retard-Tinables ?")
    textes = [corpus["e"][i][3] for i in envois[-1]["ids"]]
    assert any("File au lavabo" in t for t in textes), textes
    question(page, "Quoi de neuf en ce moment ?")
    ids = envois[-1]["ids"]
    assert [corpus["p"][corpus["e"][i][0]][1] for i in ids[:3]] == ["/nouvelles/"] * 3, ids
    question(page, "Que penserait Kobal du père Kitz-Latouch ?")
    pages = {corpus["p"][corpus["e"][i][0]][1] for i in envois[-1]["ids"]}
    assert {"/mode-putride/bestiaire/ver/", "/mode-putride/bestiaire/pere-kitz-latouch/"} <= pages, pages
    for query, slug, expressions in [
        ("Quelles expressions de Quermite parlent du jean bleu et du prisonnier ?",
         "herve-martin", ("foto ti jeans bleu", "ti jean au casso", "la robe roje")),
        ("Quelles expressions emploie JPH dans ses premières vidéos ?",
         "jean-pierre-herlant", ("Arrêtez de triquiter", "Faisez-nous des trucs", "Disez-moi-la")),
    ]:
        question(page, query)
        textes = [corpus["e"][i][3] for i in envois[-1]["ids"]
                  if corpus["p"][corpus["e"][i][0]][1] == f"/mode-putride/bestiaire/{slug}/"]
        assert any(all(expression in t for expression in expressions) for t in textes), (query, textes)
    etat["mode"] = "quota"
    assert "quota gratuit" in question(page, "Question qui échoue")
    assert "IA active" in page.locator(".cn-h small").inner_text()
    etat["mode"] = "ok"
    question(page, "Reprenons")
    assert all(m["content"] != "Question qui échoue" for m in envois[-1]["messages"])
    for i in range(6):
        question(page, f"Suite numéro {i}")
    assert len(envois[-1]["messages"]) == 13
    assert sum(len(m["content"]) for m in envois[-1]["messages"]) <= 10000
    page.reload()
    page.locator(".cn-or").click()
    page.wait_for_function("document.querySelector('.cn-h small').textContent.includes('IA active')")
    page.set_viewport_size({"width": width, "height": 560})
    assert page.locator(".cn-f").bounding_box()["y"] + page.locator(".cn-f").bounding_box()["height"] <= 560
    page.get_by_role("button", name="Nouvelle conversation").click()
    assert page.locator(".cn-log .cn-m").count() == 1
    page.set_viewport_size({"width": width, "height": 844})
    # un flux coupé en route : le début reste lisible, sans renvois
    page.evaluate("""(url) => {
      const original = window.fetch;
      window.fetch = (u, o) => {
        if (u !== url) return original(u, o);
        window.fetch = original;
        return Promise.resolve(new Response(new ReadableStream({start(c) {
          c.enqueue(new TextEncoder().encode('{"d":"Début de **réponse** [S1]"}\\n'));
          o.signal.addEventListener('abort', () => c.error(new DOMException('arrêt', 'AbortError')));
        }}), {headers: {'Content-Type': 'application/x-ndjson'}}));
      };
    }""", endpoint)
    page.locator("#cn-q").fill("Une réponse coupée")
    page.locator("#cn-q").press("Enter")
    page.wait_for_selector(".cn-log .cn-live strong")
    page.get_by_role("button", name="Arrêter la réponse").click()
    libre(page)
    coupee = page.locator(".cn-log .a").last.inner_text()
    assert "Début de réponse" in coupee and "Réponse arrêtée" in coupee and "[S1]" not in coupee, coupee
    etat["mode"] = "attente"
    page.locator("#cn-q").fill("Une réponse à arrêter")
    with page.expect_request(lambda r: r.url == endpoint and r.method == "POST"):
        page.locator("#cn-q").press("Enter")
    page.get_by_role("button", name="Arrêter la réponse").click()
    libre(page)
    assert "Envoi arrêté" in page.locator(".cn-log .a").last.inner_text()
    assert page.locator(".cn-log .cn-wa").last.get_by_role("button", name="Réessayer").count() == 1
    count = len(envois)
    page.locator("#cn-q").fill("Une réponse en attente")
    with page.expect_request(lambda r: r.url == endpoint and r.method == "POST"):
        page.locator(".cn-f button[type=submit]").click()
    page.get_by_role("button", name="Revenir au dialogue local").click()
    libre(page)
    assert "Envoi arrêté" in page.locator(".cn-log .a").last.inner_text()
    assert "sans IA générative" in page.locator(".cn-h small").inner_text()
    assert "Kobal" in question(page, "Qui est ton maître ?")
    assert len(envois) == count + 1
    for route in attentes:
        route.abort()
    assert not erreurs_js, erreurs_js
    context.close()
    print(f"IA simulée : consentement, historique, citations, quota et retrait {width}px OK", flush=True)


def tristana(browser, width):
    """Mode normal : Tristana, extraits publics seulement, puces et partage en image."""
    context = browser.new_context(viewport={"width": width, "height": 844}, accept_downloads=True)
    context.add_init_script("localStorage.setItem('lcdm-calme','1');"
                            "Object.defineProperty(navigator,'canShare',{value:()=>false})")
    endpoint = "https://ver-tests.workers.dev/chat"
    context.route("**/ver-ia.json*", lambda route: route.fulfill(
        content_type="application/json", body=json.dumps({"url": endpoint})))
    envois, erreurs_js = [], []

    def service(route):
        headers = {"Access-Control-Allow-Origin": BASE, "Access-Control-Allow-Methods": "POST",
                   "Access-Control-Allow-Headers": "Content-Type"}
        if route.request.method == "OPTIONS":
            route.fulfill(status=204, headers=headers)
            return
        envois.append(route.request.post_data_json)
        route.fulfill(headers=headers, content_type="application/json", body=json.dumps(
            {"text": "Commencez par Confiteor, c’est la somme.", "truncated": False,
             "suites": ["Et Chyren ?"], "sources": []}))

    context.route(endpoint, service)
    page = context.new_page()
    page.on("pageerror", lambda e: erreurs_js.append(str(e)))
    page.goto(BASE + "/")
    bouton = page.locator(".cn-or")
    assert bouton.locator("img[src*='logo-pp']").count() == 1
    assert page.locator(".cn-fx").count() == 0
    bouton.click()
    page.wait_for_selector(".cn-ai")
    assert "Tristana" in page.locator("#cn-oracle").inner_text()
    assert page.locator(".cn-ai-on").is_visible() and "Cloudflare" not in page.locator("#cn-oracle").inner_text()
    puces(page)
    question(page, "Bonjour, qui êtes-vous ?")
    assert not envois
    question(page, "Pouvez-vous me préparer un dossier de presse ?")
    kit = page.locator(".cn-log a.cn-kit[href='/presse/dossier-de-presse.zip'][download]")
    kit.wait_for()
    assert kit.count() == 1 and "kit presse" in kit.locator("xpath=..").inner_text().lower(), kit.locator("xpath=..").inner_text()
    assert not envois
    page.locator(".cn-ai-on").click()
    question(page, "Par quel disque commencer ?")
    assert len(envois) == 1 and envois[0]["persona"] == "tristana", envois
    corpus = page.request.get(BASE + "/oracle-putride.json").json()
    urls = [corpus["p"][corpus["e"][i][0]][1] for i in envois[0]["ids"]]
    assert envois[0]["ids"] and not any(u.startswith(("/mode-putride/", "/cachot/")) for u in urls), urls
    assert "Et Chyren ?" in puces(page)
    with page.expect_download() as dl:
        page.locator(".cn-log .cn-act").last.get_by_role("button", name="Partager en image").click()
    chemin = f"{SORTIE}/tristana-partage-{width}.png"
    dl.value.save_as(chemin)
    assert dl.value.suggested_filename == "tristana-lacreaturedumarais.png"
    page.screenshot(path=f"{SORTIE}/tristana-{width}.png")
    assert not erreurs_js, erreurs_js
    context.close()
    print(f"Tristana, extraits publics, puces et partage en image {width}px OK", flush=True)


def fenetre(browser, width):
    """Sans IA : suggestions liées à la page, résumé, fenêtre agrandie, retour en bas et passage surligné."""
    mobile = width < 900
    context = browser.new_context(viewport={"width": width, "height": 844}, is_mobile=mobile, has_touch=mobile)
    context.add_init_script("localStorage.setItem('lcdm-calme','1')")
    erreurs = []
    page = context.new_page()
    page.on("pageerror", lambda e: erreurs.append(str(e)))
    page.goto(BASE + "/mode-putride/bestiaire/vampirix/")
    page.locator(".cn-or").click()
    page.wait_for_function("[...document.querySelectorAll('.cn-sug button')].some(b => b.textContent === 'Résume cette page')")
    puces(page)
    assert page.locator(".cn-mic").is_visible()
    form, panneau = page.locator(".cn-f").bounding_box(), page.locator("#cn-oracle").bounding_box()
    assert form["x"] + form["width"] <= panneau["x"] + panneau["width"] + 0.5, (form, panneau)
    resume = question(page, "Résume cette page")
    assert "Au fil de la page" in resume, resume
    choix = puces(page)
    assert "Résume cette page" not in choix, choix
    page.get_by_role("button", name="Agrandir la fenêtre").click()
    page.wait_for_function("(w) => document.querySelector('#cn-oracle').getBoundingClientRect().width >= w",
                           arg=width - 1 if mobile else 700)
    grand = page.locator("#cn-oracle").bounding_box()
    assert (grand["width"] >= width - 1 and grand["x"] <= 0.5) if mobile else grand["width"] >= 700, grand
    assert page.evaluate("localStorage.getItem('lcdm-ver-grand')") == "1"
    page.screenshot(path=f"{SORTIE}/ver-grand-{width}.png")
    page.get_by_role("button", name="Réduire la fenêtre").click()
    page.wait_for_function("(w) => document.querySelector('#cn-oracle').getBoundingClientRect().width < w",
                           arg=width if mobile else 500)
    for q in ("Qui est Vampirix ?", "Dis-m’en plus", "Et le Vampirium ?"):
        question(page, q)
    page.locator(".cn-log").evaluate("(l) => { l.scrollTop = 0; l.dispatchEvent(new Event('scroll')); }")
    assert page.locator(".cn-bas").is_visible()
    page.locator(".cn-bas").click()
    assert page.locator(".cn-bas").is_hidden()
    puces(page)
    page.screenshot(path=f"{SORTIE}/ver-puces-{width}.png")
    page.locator(".cn-x").click()
    texte = page.evaluate("""() => {
      const p = [...document.querySelectorAll('p')].find((p) => !p.closest('.cn-p') && p.offsetParent &&
        p.innerText.trim().length > 120 && p.innerText.trim().length < 600);
      p.scrollIntoView({block: 'center'});
      const r = document.createRange(); r.selectNodeContents(p);
      getSelection().removeAllRanges(); getSelection().addRange(r);
      return p.innerText.trim();
    }""")
    page.wait_for_selector(".cn-sel:not([hidden])")
    page.screenshot(path=f"{SORTIE}/ver-selection-{width}.png")
    page.locator(".cn-sel").click()
    page.wait_for_function("[...document.querySelectorAll('.cn-log .cn-m.q')].at(-1)?.textContent.startsWith('Explique ce passage')")
    libre(page)
    explication = page.locator(".cn-log .a").last.inner_text()
    assert "d’où sort ce passage" in explication, (texte, explication)
    assert page.locator(".cn-sel").is_hidden()
    assert not erreurs, erreurs
    context.close()
    print(f"Fenêtre, puces, résumé de page et passage surligné {width}px OK", flush=True)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", args=["--mute-audio"])
    errors = []
    if "--ia" in sys.argv:
        for width in (1366, 390):
            dialogue_ia(browser, width)
            tristana(browser, width)
        browser.close()
        sys.exit(0)
    for width in (1366, 390):
        fenetre(browser, width)
    if "--fenetre" in sys.argv:
        browser.close()
        sys.exit(0)
    for width in (1366, 390):
        context = browser.new_context(
            viewport={"width": width, "height": 844},
            is_mobile=width < 900, has_touch=width < 900,
        )
        context.add_init_script("localStorage.setItem('lcdm-calme','1')")
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(BASE + "/mode-putride/bestiaire/ver/")
        page.wait_for_selector(".ver-nid")
        page.locator(".cn-or").click()
        cases = [
            ("Qui est ton maître ?", "Je sers Kobal"),
            ("Quelle est la philosophie de la Créature ?", "partisanisme"),
            ("Pourquoi mêler le sacré et la merde ?", "ferveur"),
            ("De Chyren à Confiteor", "Panvampirium"),
            ("Qui est Madame Edwarda ?", "Edwarda"),
            ("Et son enfant ?", "Éphébito"),
            ("Qui est Ephebto ?", "Éphébito"),
            ("Comment réparer mon moteur quantique intergalactique ?", "pas de passage assez sûr"),
            ("<img src=x onerror=alert(1)>", "pas de passage assez sûr"),
        ]
        for query, expected in cases:
            answer = question(page, query)
            assert expected in answer, (width, query, answer)
        assert page.locator(".cn-log img").count() == 0
        cases = [
            ("Salut", "journée"),
            ("Comment vas-tu ?", "Kobal"),
            ("Et toi ?", "petit personnel"),
            ("Continue", "victime facile"),
            ("Quelle météo aujourd'hui ?", "pas de bulletin"),
            ("Qui est Noo-Noo ?", "Noo-Noo"),
            ("Les témoignages sur Vampirix", "témoignages"),
            ("Et les anciennes sœurs ?", "regarder"),
            ("Et la réponse de la direction ?", "conteste"),
            ("Par quel album commencer ?", "Confiteor"),
            ("Je ne sais pas de quoi parler", "déclarer"),
            ("Tu es nul", "critique"),
            ("Quelle est ta philosophie ?", "partisanisme"),
            ("Et toi ?", "question qui survit"),
            ("Quelles sont tes sources ?", "Biographie"),
            ("Sur quel album est Casso ?", "Rien à déclarer"),
            ("En quelle année est sorti Rien à déclarer ?", "2018"),
            ("Quelle est la date de naissance exacte d’Edwarda ?", "pas de passage assez sûr"),
        ]
        for query, expected in cases:
            answer = question(page, query)
            assert expected in answer, (width, query, answer)
        assert page.locator(".cn-log a[href^='/cachot/']").count() > 0
        assert page.evaluate("Ver.actif()") is False
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        page.reload()
        page.locator(".cn-or").click()
        assert "2018" in page.locator(".cn-log").inner_text()
        assert page.locator(".cn-log .cn-m").count() <= 48

        page.goto(BASE + "/mode-putride/bestiaire/edwarda/")
        portrait = page.locator(".fiche2 .cz-edw")
        assert portrait.get_attribute("data-lb-src") == "/images/putride/edwarda-portrait.webp"
        assert page.locator(".gal a[href='/SECTIONS/actu/dive1.jpg']").count() == 1
        assert page.locator(".fiche2 .fgz").evaluate(
            "(im) => im.complete && im.naturalWidth === 900"
        )
        photos = page.locator(".gal a[href*='/edw-']")
        assert photos.count() == 9
        for photo in photos.all():
            if photo.evaluate("(a)=>a.closest('li').hidden"):
                page.get_by_role("button", name="Page suivante", exact=True).click()
            image = photo.locator("img")
            image.scroll_into_view_if_needed()
            page.wait_for_function("(im)=>im.complete && im.naturalWidth>0", arg=image.element_handle())
            assert image.evaluate("(im)=>Math.max(im.naturalWidth,im.naturalHeight)<=900")
            full = photo.get_attribute("href")
            photo.click()
            page.wait_for_selector("#lb")
            active = int(page.locator("#lb .lb-c").inner_text().split("/")[0]) - 1
            enlarged = page.locator("#lb .lb-slide img").nth(active)
            assert enlarged.get_attribute("src") == full
            page.wait_for_function("(im)=>im.complete && im.naturalWidth===1050", arg=enlarged.element_handle())
            page.keyboard.press("Escape")
        context.close()
        print(f"Dialogue, contexte, fautes, historique et portrait : {width}px OK", flush=True)

    for width in (1366, 390):
        dialogue_ia(browser, width)

    context = browser.new_context(viewport={"width": 1366, "height": 844})
    context.add_init_script("""document.addEventListener('coins:pret', () => {
      const button = document.querySelector('.cn-or');
      window.verTemps = [];
      new MutationObserver(() => {
        const state = button.dataset.verEtat;
        const previous = window.verTemps.at(-1);
        if (state && (!previous || previous.state !== state))
          window.verTemps.push({state, time:performance.now()});
      }).observe(button, {attributes:true, attributeFilter:['data-ver-etat']});
    });""")
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE + "/mode-putride/bestiaire/ver/")
    page.wait_for_selector(".ver-nid")
    rect = page.locator(".ver-nid").bounding_box()
    assert rect["x"] > 1250 and rect["y"] > 730, rect
    assert page.locator(".cn-or,.ver-nid").count() == 1
    page.wait_for_function("window.verTemps.length >= 5", timeout=48000)
    timeline = page.evaluate("window.verTemps.slice(0,5)")
    assert [s["state"] for s in timeline] == [
        "repos", "promenade", "repos", "promenade", "repos"
    ], timeline
    durations = [timeline[i]["time"] - timeline[i - 1]["time"] for i in range(1, 5)]
    for actual, expected in zip(durations, (3000, 13000, 13000, 13000)):
        assert abs(actual - expected) < 500, (durations, timeline)
    page.locator(".cn-or").click()
    page.wait_for_timeout(14000)
    assert page.evaluate("Ver.actif()") is False
    print(f"Cycle réel et pause du dialogue : {durations} ms OK", flush=True)
    page.locator(".cn-x").click()
    rect = page.locator(".ver-nid").bounding_box()
    page.mouse.move(rect["x"] + 20, rect["y"] + 20)
    page.mouse.down()
    page.mouse.move(900, 600, steps=12)
    page.mouse.up()
    page.wait_for_function("Ver.mode() === 'suit'")
    before = page.evaluate("Ver.dbg().hx")
    page.mouse.move(450, 500, steps=12)
    page.wait_for_timeout(600)
    after = page.evaluate("Ver.dbg().hx")
    assert abs(after - before) > 20, (before, after)
    assert not page.locator("#cn-oracle").is_visible()
    page.keyboard.press("Escape")
    page.wait_for_function("!Ver.actif()", timeout=10000)
    print("Glissement, suivi du pointeur et retour par Échap : OK", flush=True)
    context.close()

    for width in (320, 390, 820):
        context = browser.new_context(
            viewport={"width": width, "height": 844}, is_mobile=True, has_touch=True
        )
        page = context.new_page()
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(BASE + "/mode-putride/bestiaire/edwarda/")
        portrait = page.locator(".fiche2 .cz-edw")
        portrait.tap()
        assert "on" in portrait.get_attribute("class")
        assert not page.locator("#lb").is_visible()
        portrait.tap()
        page.wait_for_selector("#lb")
        assert page.locator("#lb img[src$='edwarda-portrait.webp']").count() > 0
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        context.close()
    print("Portrait tactile : effet puis liseuse à 320, 390 et 820px OK", flush=True)

    context = browser.new_context(reduced_motion="reduce")
    context.add_init_script("sessionStorage.setItem('lcm-plusbas','o'+Date.now())")
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE + "/cachot/")
    page.wait_for_selector(".ver-nid")
    page.route("**/oracle-cachot.json*", lambda route: route.fulfill(status=503, body="indisponible"))
    page.locator(".cn-or").click()
    assert "Énigme" in question(page, "Les reliques cachées")
    assert "Kobal" in question(page, "Comment vas-tu ?")
    assert "hors d’atteinte" in question(page, "Qui est Kobal ?")
    page.unroute("**/oracle-cachot.json*")
    answer = question(page, "Qui est Kobal ?")
    assert "Je sers Kobal" in answer
    assert page.locator(".cn-log a[href^='/mode-putride/']").count() > 0
    assert page.evaluate("Ver.actif()") is False
    context.close()
    browser.close()
    assert not errors, errors
    print("Registres partagés, énigmes, conversation hors ligne et réduction des mouvements : OK", flush=True)
