#!/usr/bin/env python3
"""Build a ready-to-upload package for one video.

Creates, under Exports/:
    Instagram/<date>/<slug>/   video, caption.txt, _checklist.txt
    YouTube/<date>/<slug>/     video, title.txt, caption.txt, tags.txt, _checklist.txt
    Facebook/<date>/<slug>/    video, caption.txt, _checklist.txt

caption.txt holds ONLY what goes in the caption box — select all, copy, paste.
Anything that is not pasteable lives in _checklist.txt.

    python3 make_package.py <video.mp4> <meta.json> [--date YYYY-MM-DD]
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXPORTS = ROOT / "Exports"
PLATFORMS = ["Instagram", "YouTube", "Facebook"]


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def probe(p):
    try:
        j = json.loads(subprocess.check_output([
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-show_entries", "format=duration,size", "-of", "json", str(p)
        ]).decode())
        st = (j.get("streams") or [{}])[0]
        return {"w": st.get("width"), "h": st.get("height"),
                "dur": round(float(j["format"]["duration"]), 1),
                "mb": round(int(j["format"]["size"]) / 1048576, 1)}
    except Exception:
        return {}


def tags(meta, n):
    return " ".join("#" + t.lstrip("#") for t in meta["hashtags"][:n])


# ---------- caption bodies: short, crisp, paste-ready ----------

def cap_instagram(m):
    return f"{m['short']}\n\n{m['cta']}\n\n{tags(m, 30)}\n"


def cap_youtube(m):
    return f"{m['short']}\n\n{m['cta']}\n\n{m.get('credits','')}\n\n{tags(m, 3)} #Shorts\n"


def cap_facebook(m):
    return f"{m['short']}\n\n{m['cta']}\n\n{tags(m, 4)}\n"


CAPTIONS = {"Instagram": cap_instagram, "YouTube": cap_youtube, "Facebook": cap_facebook}

CHECKS = {
    "Instagram": lambda m, i: f"""INSTAGRAM REEL
  [ ] Cover frame ~{m.get('cover_at','0')}s
  [ ] Audio ON (voice-led — muted autoplay loses it)
  [ ] Share to Facebook Page: ON
  [ ] Allow remix + download: ON
  [ ] Location: a big metro widens the first push
  [ ] Post 7-10pm IST
  First 125 chars show before "more" — they carry it.
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
    "YouTube": lambda m, i: f"""YOUTUBE SHORT
  [ ] Title from title.txt ({len(m['yt_title'])}/100 chars)
  [ ] Tags from tags.txt
  [ ] #Shorts present
  [ ] Audience: not made for kids
  [ ] Language set — enables the Hindi audio track later
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
    "Facebook": lambda m, i: f"""FACEBOOK REEL
  Easiest: publish on Instagram with "Share to Facebook" ON and skip this folder.
  Facebook rewards few hashtags — 3-5 only.
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("meta")
    ap.add_argument("--date", default=date.today().isoformat())
    a = ap.parse_args()

    vid = Path(a.video)
    if not vid.exists():
        sys.exit(f"no such video: {vid}")
    meta = json.loads(Path(a.meta).read_text())
    for k in ("short", "cta", "hashtags", "yt_title"):
        if k not in meta:
            sys.exit(f"meta is missing '{k}'")
    info = probe(vid)
    slug = slugify(meta.get("slug") or meta["yt_title"])

    for p in PLATFORMS:
        d = EXPORTS / p / a.date / slug
        d.mkdir(parents=True, exist_ok=True)
        shutil.copy2(vid, d / vid.name)
        (d / "caption.txt").write_text(CAPTIONS[p](meta), encoding="utf-8")
        (d / "_checklist.txt").write_text(CHECKS[p](meta, info), encoding="utf-8")
        if p == "YouTube":
            (d / "title.txt").write_text(meta["yt_title"] + "\n", encoding="utf-8")
            (d / "tags.txt").write_text(
                ", ".join(t.lstrip("#") for t in meta["hashtags"][:15]) + "\n", encoding="utf-8")

    print(f"packaged '{slug}'  ({info.get('dur')}s, {info.get('mb')}MB)")
    for p in PLATFORMS:
        print("  ", (EXPORTS / p / a.date / slug).relative_to(ROOT))


if __name__ == "__main__":
    main()
