"""Tests du dialogue, du cycle réel et du portrait sur un serveur de prévisualisation.

python _outils/test_ver.py http://127.0.0.1:8851
Ajouter --ia pour ne vérifier que le transport IA simulé.
Nécessite Playwright Python et Microsoft Edge.
"""
import sys
import json

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8851"


def question(page, text):
    count = page.locator(".cn-log .a:not(.cn-dots)").count()
    page.locator("#cn-q").fill(text)
    page.locator(".cn-f button").click()
    page.wait_for_function(
        "(n) => document.querySelectorAll('.cn-log .a:not(.cn-dots)').length > n",
        arg=count,
    )
    page.wait_for_function("!document.querySelector('.cn-f button').disabled")
    return page.locator(".cn-log .a").last.inner_text()


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
        contenu = "La Gargouille est mon amie. [S1]\n<img src=x onerror=alert(1)>"
        route.fulfill(headers=headers, content_type="application/json", body=json.dumps({
            "text": contenu, "truncated": False,
            "sources": [{"n": 1, "title": "La Gargouille de Rouen",
                         "url": "/mode-putride/bestiaire/gargouille/"}],
        }))

    context.route(endpoint, service)
    page = context.new_page()
    page.on("pageerror", lambda e: erreurs_js.append(str(e)))
    page.goto(BASE + "/mode-putride/bestiaire/ver/")
    page.locator(".cn-or").click()
    page.wait_for_selector(".cn-ai")
    assert "Gargouille" in question(page, "Tu es ami avec la Gargouille ?")
    assert not envois
    page.locator(".cn-ai summary").click()
    page.get_by_role("button", name="J’accepte, activer l’IA").click()
    question(page, "Qui sont tes amis ?")
    assert len(envois) == 1
    assert envois[0]["consent"] is True
    assert len(envois[0]["revision"]) == 16
    assert envois[0]["ids"] and len(envois[0]["ids"]) <= 8
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
    assert "via Cloudflare" in page.locator(".cn-h small").inner_text()
    etat["mode"] = "ok"
    question(page, "Reprenons")
    assert all(m["content"] != "Question qui échoue" for m in envois[-1]["messages"])
    for i in range(6):
        question(page, f"Suite numéro {i}")
    assert len(envois[-1]["messages"]) == 13
    assert sum(len(m["content"]) for m in envois[-1]["messages"]) <= 10000
    page.reload()
    page.locator(".cn-or").click()
    page.wait_for_function("document.querySelector('.cn-h small').textContent.includes('via Cloudflare')")
    page.locator(".cn-ai summary").click()
    page.set_viewport_size({"width": width, "height": 560})
    assert page.locator(".cn-f").bounding_box()["y"] + page.locator(".cn-f").bounding_box()["height"] <= 560
    page.get_by_role("button", name="Effacer cet échange").click()
    assert page.locator(".cn-log .cn-m").count() == 1
    page.set_viewport_size({"width": width, "height": 844})
    page.locator(".cn-ai summary").click()
    etat["mode"] = "attente"
    count = len(envois)
    page.locator("#cn-q").fill("Une réponse en attente")
    with page.expect_request(lambda r: r.url == endpoint and r.method == "POST"):
        page.locator(".cn-f button").click()
    page.locator(".cn-ai summary").click()
    page.get_by_role("button", name="Revenir au dialogue local").click()
    page.wait_for_function("!document.querySelector('.cn-f button').disabled")
    assert "Envoi arrêté" in page.locator(".cn-log .a").last.inner_text()
    assert "sans IA générative" in page.locator(".cn-h small").inner_text()
    assert "Kobal" in question(page, "Qui est ton maître ?")
    assert len(envois) == count + 1
    for route in attentes:
        route.abort()
    assert not erreurs_js, erreurs_js
    context.close()
    print(f"IA simulée : consentement, historique, citations, quota et retrait {width}px OK", flush=True)


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", args=["--mute-audio"])
    errors = []
    if "--ia" in sys.argv:
        for width in (1366, 390):
            dialogue_ia(browser, width)
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
