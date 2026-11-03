#!/usr/bin/env python3
"""Derive an episode's caption times and panel windows from the measured VO.

Hand-typing timings twice (once in the lines file, once in the composition) is
how they drift apart. The VO is the only source of truth: this reads
vo_timings.json, pairs each line with its caption and its panel, and writes both
arrays into episode.json.

    python3 sync_episode.py Tools/tendays-ep03 Tools/publish/lines_tendays_ep03.json
"""
import json
import sys
from pathlib import Path

PAD = 0.20          # panels come up fractionally before their first word


def main():
    d = Path(sys.argv[1])
    lines_spec = json.loads(Path(sys.argv[2]).read_text())
    timings = json.loads((d / "assets" / "audio" / "vo_timings.json").read_text())
    cfg = json.loads((d / "episode.json").read_text())

    caps = {l["id"]: l.get("cap", "") for l in lines_spec["lines"]}
    rows = timings["lines"]

    # captions, in VO order, plus a silent tail row so the last one clears
    out_lines = [[caps.get(r["id"], ""), r["start"], r["end"]] for r in rows]

    # panel windows: first start to last end for each run of the same shot id
    wins, cur, a, b = [], None, 0.0, 0.0
    for r in rows:
        if r["shot"] != cur:
            if cur is not None:
                wins.append([cur, round(max(0.0, a - PAD), 2), round(b + PAD, 2)])
            cur, a = r["shot"], r["start"]
        b = r["end"]
    wins.append([cur, round(max(0.0, a - PAD), 2), round(b + PAD, 2)])

    # first panel starts at 0, last runs to the end of the composition
    wins[0][1] = 0.0
    wins[-1][2] = cfg["dur"]
    # butt them together so nothing shows black between panels
    for i in range(len(wins) - 1):
        wins[i][2] = max(wins[i][2], wins[i + 1][1] + 0.20)

    cfg["lines"] = out_lines
    cfg["panels"] = wins
    (d / "episode.json").write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n")

    dur = timings["duration"]
    print(f"synced {d.name}: {len(out_lines)} captions, {len(wins)} panels, VO {dur:.1f}s")
    if cfg["dur"] < dur:
        print(f"  ⚠ episode.json dur={cfg['dur']} is shorter than the VO ({dur:.1f}s)")
    missing = [r["id"] for r in rows if not caps.get(r["id"])]
    if missing:
        print(f"  ⚠ no caption text for: {', '.join(missing)}")


if __name__ == "__main__":
    main()
