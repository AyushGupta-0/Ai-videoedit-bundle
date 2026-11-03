#!/usr/bin/env python3
"""Turn a compact (id, panel, spoken, caption, pause) table into a lines JSON.

Keeping the caption next to the line it belongs to is the only way they stay in
sync; the 'at' times here are estimates that build_kids_vo.py then corrects
against the real audio.

    python3 ep_lines.py <ep_number>      # reads EPISODES[<n>] below
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WPS = 2.6          # measured narration pace for am_michael at speed 0.97


def write(ep, rows):
    out = {"episode": f"tendays-ep{ep:02d}",
           "voices": {"N": {"kokoro": "am_michael", "speed": 0.97, "semitones": 0.0}},
           "lines": []}
    at = 0.25
    for lid, shot, text, cap, pause in rows:
        e = {"id": lid, "at": round(at, 2), "who": "N", "shot": shot,
             "text": text, "cap": cap}
        if pause:
            e["pause"] = pause
        out["lines"].append(e)
        at += len(text.split()) / WPS + 0.1 + pause
    p = ROOT / "Tools" / "publish" / f"lines_tendays_ep{ep:02d}.json"
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    est = at + 1.2
    print(f"{p.name}  {len(rows)} lines  ~{est:.0f}s estimated")
    return est
