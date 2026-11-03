#!/usr/bin/env python3
"""Assemble one Anaya episode: composition + audio mix, ready to render.

Everything that was hand-written for EP01-03 is derived here instead:
 - shot in/out times come from the VO timings, so picture and narration cannot
   drift apart (the thing that goes wrong first when these are typed by hand)
 - Ken Burns moves alternate push-in / pull-out and flip direction each shot, so
   no two neighbours drift the same way
 - caption lines are the measured VO lines, never estimates

    python3 build_episode.py <comp_dir> <shots.json> --id ep03 --title "…"
"""
import argparse, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LEAD, TAIL_PAD, FADE = 0.20, 0.40, 0.55

TPL = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>__TITLE__</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
  html,body { margin:0; background:#000; }
  #root { position:relative; width:1080px; height:1920px; overflow:hidden;
          background:#000; font-family:"Avenir Next","Helvetica Neue",sans-serif; }
  .plate { position:absolute; inset:0; opacity:0; will-change:opacity; }
  .plate img { position:absolute; left:50%; top:50%; width:1080px; height:1920px;
               margin:-960px 0 0 -540px; object-fit:cover; will-change:transform; }
  #grade { position:absolute; inset:0; pointer-events:none;
           background:
             radial-gradient(118% 80% at 50% 42%, rgba(0,0,0,0) 48%, rgba(10,6,2,.62) 100%),
             linear-gradient(180deg, rgba(255,176,92,.10) 0%, rgba(0,0,0,0) 34%,
                             rgba(0,0,0,0) 62%, rgba(24,10,2,.40) 100%); }
  /* A text-shadow alone is not enough: on a bright plate the caption washed out
     (EP03 shot f03). This scrim sits behind the caption band only, is invisible
     over dark plates, and guarantees contrast over light ones. */
  #capscrim { position:absolute; left:0; right:0; top:120px; height:330px;
              pointer-events:none;
              background:linear-gradient(180deg, rgba(8,5,2,0) 0%, rgba(8,5,2,.46) 26%,
                                         rgba(8,5,2,.46) 74%, rgba(8,5,2,0) 100%); }
  #capwrap { position:absolute; left:84px; right:84px; top:196px; text-align:center; }
  #cap { display:inline-block; color:#fff; font-size:52px; line-height:1.3;
         font-weight:600; letter-spacing:.2px; opacity:0;
         text-shadow:0 3px 18px rgba(0,0,0,.85), 0 1px 3px rgba(0,0,0,.9); }
  #progress { position:absolute; left:0; bottom:0; height:5px; width:0;
              background:linear-gradient(90deg,#ffb45c,#ffe3b0); opacity:.85; }
</style>
  </head>
  <body>
<div id="root" data-composition-id="__ID__" data-start="0" data-duration="__DUR__"
     data-width="1080" data-height="1920" data-track-kind="graphics">
  <div id="plates" class="clip" data-start="0" data-duration="__DUR__" data-track-index="0"></div>
  <div id="grade"  class="clip" data-start="0" data-duration="__DUR__" data-track-index="1"
       data-layout-ignore></div>
  <div id="capscrim" class="clip" data-start="0" data-duration="__DUR__" data-track-index="2"
       data-layout-ignore></div>
  <div id="capwrap" class="clip" data-start="0" data-duration="__DUR__" data-track-index="3"
       data-track-kind="captions"><span id="cap"></span></div>
  <div id="progress" class="clip" data-start="0" data-duration="__DUR__" data-track-index="4"
       data-layout-ignore></div>
</div>

<audio id="vo" src="assets/audio/mix.wav" data-start="0" data-volume="1"></audio>

<script>
  const DUR = __DUR__;
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#progress", { width: 0 }, { width: 1080, duration: DUR, ease: "none" }, 0);

  const SHOTS = __SHOTS__;

  const platesEl = document.getElementById("plates");
  SHOTS.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "plate"; d.id = `plate${i}`;
    const im = document.createElement("img");
    im.src = `assets/shots/${s.img}.png`;
    d.appendChild(im); platesEl.appendChild(d);
    const FADE = __FADE__;
    tl.to(d, { opacity: 1, duration: FADE }, s.in);
    if (s.out < DUR) tl.to(d, { opacity: 0, duration: FADE }, s.out - FADE);
    tl.fromTo(im,
      { scale: s.from[0], x: s.from[1], y: s.from[2] },
      { scale: s.to[0], x: s.to[1], y: s.to[2], duration: s.out - s.in, ease: "none" },
      s.in);
  });

  const LINES = __LINES__;
  const capEl = document.getElementById("cap");
  LINES.forEach(([text, a, b], i) => {
    tl.call(() => { capEl.textContent = text; }, null, a);
    tl.fromTo(capEl, { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" }, a);
    const next = LINES[i + 1] ? LINES[i + 1][1] : DUR;
    tl.to(capEl, { opacity: 0, duration: 0.26 }, Math.min(b, next - 0.30));
  });

  window.__timelines = window.__timelines || {};
  window.__timelines["__ID__"] = tl;
</script>
  </body>
</html>
"""


def moves(n):
    """Alternate push-in and pull-out, and flip the drift axis every shot, so no
    two neighbouring shots move the same way. Stills are the only motion here, so
    repetition reads as a stuck camera."""
    out = []
    for i in range(n):
        push = i % 2 == 0
        sx = 1 if (i // 2) % 2 == 0 else -1
        sy = 1 if (i % 4) < 2 else -1
        lo, hi = 1.05, 1.32 + 0.04 * (i % 3)
        a = [lo, -28 * sx, 24 * sy] if push else [hi, 30 * sx, -26 * sy]
        b = [hi, 32 * sx, -28 * sy] if push else [lo, -26 * sx, 22 * sy]
        out.append((a, b))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("comp"); ap.add_argument("shots")
    ap.add_argument("--id", required=True); ap.add_argument("--title", required=True)
    a = ap.parse_args()

    comp = Path(a.comp)
    tj = json.loads((comp / "assets/audio/vo_timings.json").read_text())
    order = [s["id"] for s in json.loads(Path(a.shots).read_text())["shots"]]
    lines = tj["lines"]
    dur = round(tj["duration"] + TAIL_PAD, 2)

    # a shot runs from its first line to the start of the next shot's first line
    first = {}
    for L in lines:
        first.setdefault(L["shot"], L["start"])
    used = [s for s in order if s in first]
    mv = moves(len(used))
    shots = []
    for i, sid in enumerate(used):
        start = 0.0 if i == 0 else max(0.0, first[sid] - LEAD)
        end = dur if i == len(used) - 1 else max(start + 1.2, first[used[i + 1]] - LEAD)
        f, t = mv[i]
        shots.append({"img": sid, "in": round(start, 2), "out": round(end, 2),
                      "from": f, "to": t})
    # overlap neighbours by the dissolve length
    for i in range(len(shots) - 1):
        shots[i]["out"] = round(shots[i]["out"] + FADE * 0.35, 2)

    sj = "[\n" + ",\n".join(
        f'    {{ img:"{s["img"]}", in:{s["in"]}, out:{s["out"]}, '
        f'from:[{s["from"][0]},{s["from"][1]},{s["from"][2]}], '
        f'to:[{s["to"][0]},{s["to"][1]},{s["to"][2]}] }}' for s in shots) + "\n  ]"
    lj = "[\n" + ",\n".join(
        f'    [{json.dumps(L["text"])}, {L["start"]}, {L["end"]}]' for L in lines) + "\n  ]"

    html = (TPL.replace("__TITLE__", a.title).replace("__ID__", a.id)
               .replace("__DUR__", str(dur)).replace("__SHOTS__", sj)
               .replace("__LINES__", lj).replace("__FADE__", str(FADE)))
    (comp / "index.html").write_text(html)
    print(f"{comp}/index.html  {dur}s  {len(shots)} shots  {len(lines)} captions")


if __name__ == "__main__":
    main()
