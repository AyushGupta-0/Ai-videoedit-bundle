#!/usr/bin/env python3
"""Assemble a Ten Days episode from its panels + the measured VO timings.

Writing each episode's index.html by hand meant repeating the shell, the HUD,
the caption machinery and the timeline wiring every time, and re-fixing the same
layout bugs. Only the panels and the words actually differ per episode, so this
takes those two and generates the rest.

    Tools/tendays-epNN/
        episode.json    day, clock window, end card, panel windows, captions
        panels.js       mk("id", `...`) calls — the only bespoke part

    python3 make_episode.py Tools/tendays-ep03
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

SHELL = r'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Ten Days — Day {day}</title>
    <!-- vendored: no network fetch during render. The plugin set has been free
         for commercial use since GSAP 3.13; copied in from Tools/_shared/gsap -->
    <script src="assets/gsap/gsap.min.js"></script>
    <script src="assets/gsap/ScrambleTextPlugin.min.js"></script>
    <script src="assets/gsap/SplitText.min.js"></script>
    <script src="assets/gsap/DrawSVGPlugin.min.js"></script>
    <script src="assets/gsap/CustomEase.min.js"></script>
<style>
  :root{{
    --night:#0b1220; --night2:#131d30; --road:#161d2b;
    --amber:#f0a93c; --amber-lt:#ffd38a; --warm:#ffb64d;
    --red:#ff4242; --red-dk:#c22b2b;
    --ink:#060a12; --white:#ffffff; --grey:#8b97ab;
  }}
  html,body{{margin:0;background:#000;}}
  #root{{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--night);
        font-family:"Avenir Next","Helvetica Neue",Arial,sans-serif;}}
  .panel{{position:absolute;inset:0;opacity:0;will-change:opacity;}}
  #hud{{position:absolute;left:46px;top:44px;z-index:40;}}
  #daytag{{display:flex;align-items:center;gap:9px;font-size:23px;font-weight:700;
          letter-spacing:2.4px;color:var(--red);}}
  #daytag i{{width:11px;height:11px;border-radius:50%;background:var(--red);display:block;}}
  #clock{{font-size:54px;font-weight:700;color:var(--white);letter-spacing:1px;margin-top:2px;
         font-variant-numeric:tabular-nums;}}
  #recov{{font-size:20px;font-weight:600;letter-spacing:2.6px;color:var(--grey);margin-top:1px;}}
  #mark{{position:absolute;right:46px;top:52px;z-index:40;font-size:18px;
        letter-spacing:1.6px;color:#55617a;}}
  /* Captions sit above y=1500. Anything a panel draws below that collides with a
     two-line caption, which is a hard lint error — keep panel text above it. */
  #capwrap{{position:absolute;left:70px;right:70px;bottom:230px;text-align:center;z-index:38;}}
  #cap{{display:inline-block;color:var(--white);font-size:58px;line-height:1.26;font-weight:700;
       letter-spacing:.4px;opacity:0;
       text-shadow:0 4px 22px rgba(0,0,0,.95),0 2px 4px rgba(0,0,0,.9);}}
  #cap b{{color:var(--amber);font-weight:700;}}
  #cap u{{color:var(--red);text-decoration:none;}}
  .vign{{position:absolute;inset:0;pointer-events:none;
        background:radial-gradient(125% 85% at 50% 45%,rgba(0,0,0,0) 42%,rgba(0,0,0,.82) 100%);}}
  .sky{{position:absolute;inset:0;
       background:linear-gradient(180deg,#0a1020 0%,#16233a 46%,#0c1322 100%);}}
  .rulecard{{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
            justify-content:center;gap:34px;
            background:linear-gradient(180deg,rgba(6,10,18,.90),rgba(6,10,18,.96));}}
  .rulebadge{{background:var(--red);color:#fff;font-size:26px;font-weight:800;letter-spacing:3.4px;
             padding:11px 26px;border-radius:5px;}}
  .ruletext{{color:#fff;font-size:92px;font-weight:800;letter-spacing:1px;text-align:center;
            line-height:1.1;max-width:880px;}}
  .rulesub{{color:var(--grey);font-size:34px;font-weight:600;max-width:800px;text-align:center;
           line-height:1.35;}}
  .news{{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:830px;
        border:3px solid var(--amber);border-radius:12px;background:rgba(8,13,22,.93);
        padding:36px 40px;}}
  .news.bad{{border-color:var(--red);}}
  .news h4{{margin:0 0 22px;color:var(--amber);font-size:30px;letter-spacing:3.4px;font-weight:800;}}
  .news.bad h4{{color:var(--red);}}
  .news .row{{display:flex;justify-content:space-between;align-items:center;color:#fff;
             font-size:40px;font-weight:600;padding:15px 0;
             border-bottom:1px solid rgba(255,255,255,.10);}}
  .news .row:last-child{{border-bottom:0;}}
  .news .row span:last-child{{color:var(--amber);font-weight:800;}}
  .news.bad .row span:last-child{{color:var(--red);}}
  .stamp{{position:absolute;left:50%;transform:translateX(-50%) rotate(-7deg);border:7px solid var(--red);
         color:var(--red);font-size:80px;font-weight:800;letter-spacing:6px;padding:13px 42px;
         border-radius:8px;}}
  .badge{{display:inline-block;border:4px solid var(--amber);color:var(--amber);font-size:38px;
         font-weight:800;letter-spacing:4px;padding:14px 32px;border-radius:8px;
         background:rgba(8,12,20,.85);}}
  .badge.red{{border-color:var(--red);color:var(--red);}}
{extra_css}
</style>
  </head>
  <body>
<div id="root" data-composition-id="td{day}" data-start="0" data-duration="{dur}"
     data-width="1080" data-height="1920" data-track-kind="graphics">
  <div id="panels" class="clip" data-start="0" data-duration="{dur}" data-track-index="0"></div>
  <div id="hud" class="clip" data-start="0" data-duration="{dur}" data-track-index="1" data-layout-ignore>
    <div id="daytag"><i></i>DAY {day} / 10</div>
    <div id="clock">{clock0}</div>
    <div id="recov">RECOVERY IN {recov_txt}</div>
  </div>
  <div id="mark" class="clip" data-start="0" data-duration="{dur}" data-track-index="2"
       data-layout-ignore>1min.thinker</div>
  <div id="capwrap" class="clip" data-start="0" data-duration="{dur}" data-track-index="3"
       data-track-kind="captions"><span id="cap"></span></div>
</div>

<audio id="vo" src="assets/audio/vo.wav" data-start="0" data-volume="1"></audio>

<script>
gsap.registerPlugin(ScrambleTextPlugin, SplitText, DrawSVGPlugin, CustomEase);
const DUR = {dur};
const tl = gsap.timeline({{ paused: true }});
const S = document.getElementById("panels");
const mk = (id, html) => {{ const d=document.createElement("div");
  d.className="panel"; d.id=id; d.innerHTML=html; S.appendChild(d); return d; }};
const rule = (n, text, sub) => `<div class="rulecard">
    <div class="rulebadge">RULE #${{n}}</div><div class="ruletext">${{text}}</div>
    ${{sub ? `<div class="rulesub">${{sub}}</div>` : ""}}</div>`;

{panels}

/* ---- end card: the question, the buttons, and the next day's hook ---- */
mk("end", `<div style="position:absolute;inset:0;
       background:radial-gradient(90% 60% at 50% 46%,#2a0b0b 0%,#07090f 72%);"></div>
  <div style="position:absolute;left:0;right:0;top:690px;text-align:center;">
    <div style="color:#fff;font-size:84px;font-weight:800;">{q1}</div>
    <div style="color:var(--red);font-size:84px;font-weight:800;">{q2}</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:980px;display:flex;justify-content:center;gap:34px;">
    <div style="background:var(--amber);color:#1a1205;font-size:38px;font-weight:800;
         padding:20px 52px;border-radius:10px;letter-spacing:2px;">{btnA}</div>
    <div style="background:var(--red-dk);color:#fff;font-size:38px;font-weight:800;
         padding:20px 52px;border-radius:10px;letter-spacing:2px;">{btnB}</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1160px;text-align:center;">
    <div style="color:#7d879b;font-size:26px;letter-spacing:4px;">{nextlabel}</div>
    <div style="color:#fff;font-size:44px;font-weight:800;margin-top:10px;">{nexthook}</div>
    <div style="color:var(--amber);font-size:27px;letter-spacing:3px;margin-top:22px;">
      {followlabel}</div>
  </div>`);

const SH = {panelwins};
const FADE = 0.30;
SH.forEach(([id, a, b]) => {{
  const el = document.getElementById(id);
  if (!el) {{ console.warn("missing panel", id); return; }}
  tl.to(el, {{ opacity: 1, duration: FADE }}, a);
  if (b < DUR) tl.to(el, {{ opacity: 0, duration: FADE }}, b - FADE);
}});

{motion}

/* ---- HUD clock, stepping minute by minute ---- */
const S0 = {m0}, S1 = {m1}, AMPM = "{ampm}";
const clockEl = document.getElementById("clock");
// seek(t, true) suppresses onUpdate as well as .call(), so neither survives a
// renderer grabbing frames out of order. Only tl.set() actually renders: it is
// a zero-duration tween, and tweens render at any playhead position.
for (let m = S0; m <= S1; m++){{
  const at = ((m - S0) / Math.max(1, S1 - S0)) * (DUR - 4.0);
  tl.set(clockEl, {{ textContent:
    `${{((Math.floor(m / 60) + 11) % 12) + 1}}:${{String(m % 60).padStart(2, "0")}} ${{AMPM}}` }}, at);
}}

const LINES = {lines};
const capEl = document.getElementById("cap");
LINES.forEach(([html, a, b], i) => {{
  tl.set(capEl, {{ innerHTML: html }}, a);   // render-time, survives seek
  tl.fromTo(capEl, {{ opacity: 0, y: 14 }},
            {{ opacity: html ? 1 : 0, duration: 0.26, ease: "power2.out" }}, a);
  const next = LINES[i + 1] ? LINES[i + 1][1] : DUR;
  tl.to(capEl, {{ opacity: 0, duration: 0.20 }}, Math.min(b, next - 0.24));
}});

window.__timelines = window.__timelines || {{}};
window.__timelines["td{day}"] = tl;
</script>
  </body>
</html>
'''


def main():
    d = Path(sys.argv[1])
    cfg = json.loads((d / "episode.json").read_text())
    panels = (d / "panels.js").read_text()
    html = SHELL.format(
        day=cfg["day"], dur=cfg["dur"], clock0=cfg["clock0"], recov=cfg["recov"],
        extra_css=cfg.get("extra_css", ""), panels=panels,
        q1=cfg["q1"], q2=cfg["q2"], btnA=cfg["btnA"], btnB=cfg["btnB"],
        nextday=cfg["day"] + 1, nexthook=cfg["nexthook"],
        nextlabel=cfg.get("nextlabel", f'DAY {cfg["day"] + 1}'),
        followlabel=cfg.get("followlabel", f'FOLLOW FOR DAY {cfg["day"] + 1}'),
        recov_txt=f'{cfg["recov"]} DAY' + ("" if cfg["recov"] == 1 else "S"),
        panelwins=json.dumps(cfg["panels"]),
        motion=cfg.get("motion", ""),
        m0=cfg["m0"], m1=cfg["m1"], ampm=cfg["ampm"],
        lines=json.dumps(cfg["lines"], ensure_ascii=False),
    )
    # every episode needs the vendored GSAP beside it; copy once from _shared
    import shutil
    g = d / "assets" / "gsap"
    if not g.exists():
        shutil.copytree(ROOT / "Tools" / "_shared" / "gsap", g)
    (d / "index.html").write_text(html)
    print(f"{d.name}/index.html  ·  {cfg['dur']}s  ·  "
          f"{len(cfg['panels'])} panels  ·  {len(cfg['lines'])} captions")


if __name__ == "__main__":
    main()
