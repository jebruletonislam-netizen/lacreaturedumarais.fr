"""Tests du dialogue, du cycle réel et du portrait sur un serveur de prévisualisation.

python _outils/test_ver.py http://127.0.0.1:8851
Nécessite Playwright Python et Microsoft Edge.
"""
import sys

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


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", args=["--mute-audio"])
    errors = []
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
