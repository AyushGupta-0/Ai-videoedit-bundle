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
# Duration from PHONEMES, not words. Fitted by least squares against 130 real
# lines across 8 episodes in this repo:
#
#   phonemes  dur = 0.0671*P + 0.699   R2=0.956  MAE=0.155s   <- used here
#   words     dur = 0.3596*W + 0.761   R2=0.825  MAE=0.332s
#   WPS=2.6                            MAE=0.593s, bias -0.57s PER LINE
#
# The old constant under-estimated every line, so a 17-line episode came out
# ~10s longer than planned and every scripted pause got eaten. Phonemes win
# because "forty" and "through" are two words of very different length.
#
# misaki (Kokoro's own g2p) is the right phonemiser precisely because it is
# what Kokoro will actually say. KPipeline(model=False) loads no weights and
# touches no network. Keep the intercept: a pure proportional fit is worse.
PHON_A, PHON_B = 0.0671, 0.699     # am_michael @ 0.97
WPS = 2.6                          # fallback only, if misaki is unavailable

_g2p = None


def est_duration(text):
    """Seconds of speech for one line, before synthesis."""
    global _g2p
    if _g2p is None:
        try:
            from kokoro import KPipeline
            _g2p = KPipeline(lang_code="a", model=False)
        except Exception:
            _g2p = False
    if not _g2p:
        return len(text.split()) / WPS
    n = sum(len(r.phonemes) for r in _g2p(text))
    return PHON_A * n + PHON_B


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
        at += est_duration(text) + 0.1 + pause
    p = ROOT / "Tools" / "publish" / f"lines_tendays_ep{ep:02d}.json"
    p.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    est = at + 1.2
    print(f"{p.name}  {len(rows)} lines  ~{est:.0f}s estimated")
    return est
