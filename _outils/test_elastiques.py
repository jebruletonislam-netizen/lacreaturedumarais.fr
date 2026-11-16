"""Régressions des tractions : vrai code navigateur, horloge contrôlée, sans attendre les animations."""
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8851"

HARNESS = """<!doctype html><meta charset="utf-8">
<style>body{margin:0}header{height:60px}.ar-couche{position:fixed;inset:0}
.ar-toile,.corps-a{position:absolute;left:0;top:0;width:40px;height:44px}
.ar-corde{position:fixed;inset:0}.ar-svg{position:fixed;inset:0}
</style><header></header><div class="cr-araignee"></div>"""


def setup(page, kind, width):
    page.set_viewport_size({"width": width, "height": 900})
    page.route("**/__elastic_test__", lambda route: route.fulfill(body=HARNESS, content_type="text/html"))
    page.goto(BASE + "/__elastic_test__")
    page.evaluate("""() => {
      window.CALME=true; window.requestAnimationFrame=f=>{window.frame=f;return 1;};
      window.clock=performance.now();
    }""")
    if kind == "spider":
        page.add_script_tag(url=BASE + "/cachot-vie.js")
        page.evaluate("""() => {
          window.advance=dt=>{clock+=dt*1000;frame(clock);};
          window.position=()=>{const r=document.querySelector('.corps-a').getBoundingClientRect();
            return {x:r.x+r.width/2,y:r.y+r.height/2};};
        }""")
    else:
        page.add_script_tag(url=BASE + "/ephebito.js")
        page.evaluate("Ephebito.pre()")
        page.wait_for_function("Ephebito.ok()", polling=50)
        page.evaluate("""() => {
          const noop=()=>{};
          window.fx={CW:innerWidth,CH:innerHeight,t:0,LOW:true,niv:0,
            cx:document.createElement('canvas').getContext('2d'),
            ext:{x0:0,x1:innerWidth,fl:innerHeight},items:[],drops:[],
            isM:()=>innerWidth<900,bord:()=>70,dep:()=>-100,
            spray:noop,wave:noop,lvlAdd:noop,mk:noop,ferme:noop,parle:noop};
          Ephebito.boum(fx,{x:200,y:300,h:80});
          window.advance=dt=>{fx.t+=dt*1000;fx.eph.step(dt);fx.eph.place();};
          for(let i=0;i<600;i++)advance(1/120);
          const s=Ephebito.S();s.free=true;s.rx=innerWidth/2;s.len=160;
          s.dy=s.dyv=s.ang=s.om=s.th=s.ax=s.vx=0;s.omL=0;s.prx=s.rx;
          advance(1/120);
          window.position=()=>{const s=Ephebito.S();
            return {x:s.rx-s.le*Math.sin(s.ang),y:s.ry+s.le*Math.cos(s.ang)};};
        }""")
    page.evaluate("for(let i=0;i<600;i++)advance(1/120)")
    if kind == "spider":
        page.evaluate("""() => {
          const el=document.querySelector('.ar-toile'),r=el.getBoundingClientRect();
          for(const [type,x] of [['pointerdown',r.x+20],['pointermove',innerWidth/2]]){
            el.dispatchEvent(new PointerEvent(type,{pointerId:8,clientX:x,clientY:r.y+22,bubbles:true}));
            advance(1/120);
          }
          el.dispatchEvent(new PointerEvent('pointerup',{pointerId:8,bubbles:true}));
          for(let i=0;i<1800;i++)advance(1/120);
        }""")


def stretch(page, kind, dx, dy, dt, cancel=False):
    selector = ".ar-toile" if kind == "web" else ".ar-corde" if kind == "spider" else ".eph-sg"
    return page.evaluate("""({selector,dx,dy,dt,cancel})=>{
      const el=document.querySelector(selector),start=position();
      const send=(type,x,y)=>el.dispatchEvent(new PointerEvent(type,{
        pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true,button:0}));
      send('pointerdown',start.x,start.y);
      for(let i=1;i<=30;i++){send('pointermove',start.x+dx*i/30,start.y+dy*i/30);advance(dt);}
      for(let i=0;i<Math.ceil(.8/dt);i++)advance(dt);
      const held=position();send(cancel?'pointercancel':'pointerup',start.x+dx,start.y+dy);
      const samples=[];
      for(let i=0;i<Math.ceil(5/dt);i++){advance(dt);samples.push(position());}
      return {start,held,samples};
    }""", {"selector": selector, "dx": dx, "dy": dy, "dt": dt, "cancel": cancel})


with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", args=["--mute-audio"])
    for kind in ("ephebito", "spider"):
        amplitudes = {}
        for width in (390, 1366):
            for dx, dy in ((0, 60), (0, 120), (-75, 65), (75, 65)):
                for hz in (30, 120):
                    page = browser.new_page()
                    errors = []
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    setup(page, kind, width)
                    result = stretch(page, kind, dx, dy, 1 / hz)
                    a, held, samples = result["start"], result["held"], result["samples"]
                    assert not errors, errors
                    assert abs(held["x"] - a["x"] - dx) < 3, (kind, "prise horizontale", result)
                    assert abs(held["y"] - a["y"] - dy) < 3, (kind, "prise verticale", result)
                    assert min(s["y"] for s in samples) < a["y"] - 2, (kind, "aucun rebond après maintien")
                    assert abs(samples[-1]["y"] - a["y"]) < 5, (kind, "pas de retour amorti")
                    if dx:
                        assert any((s["x"] - a["x"]) * dx < -2 for s in samples), (kind, "direction du rebond")
                    else:
                        amplitudes[width, dy, hz] = a["y"] - min(s["y"] for s in samples)
                    assert all(0 <= s["x"] <= width and 0 <= s["y"] <= 900 for s in samples)
                    page.close()
            for hz in (30, 120):
                ratio = amplitudes[width, 120, hz] / amplitudes[width, 60, hz]
                assert 1.65 < ratio < 2.35, (kind, width, hz, "proportion", ratio)
            for dy in (60, 120):
                ratio = amplitudes[width, dy, 30] / amplitudes[width, dy, 120]
                assert .85 < ratio < 1.15, (kind, width, "dépendance au rafraîchissement", ratio)
        print(kind, "traction maintenue, deux sens, amplitudes, amortissement et 30/120 Hz : OK", flush=True)
        page = browser.new_page()
        setup(page, kind, 390)
        result = stretch(page, kind, 0, 100, 1 / 60, cancel=True)
        assert abs(result["samples"][-1]["y"] - result["start"]["y"]) < 5
        assert not page.locator("body.ar-prise,html.cro-prise").count()
        if kind == "spider":
            result = stretch(page, "web", 0, 90, 1 / 60)
            assert abs(result["held"]["y"] - result["start"]["y"] - 90) < 3
            assert min(s["y"] for s in result["samples"]) < result["start"]["y"] - 2
        page.close()
    print("Annulation des prises et traction verticale de la toile : OK", flush=True)
    browser.close()
