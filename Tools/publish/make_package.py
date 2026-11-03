#!/usr/bin/env python3
"""Build a ready-to-upload package for one video.

Creates, under Exports/:
    Instagram/<date>/<slug>/   video + caption.txt
    YouTube/<date>/<slug>/     video + caption.txt
    Facebook/<date>/<slug>/    video + caption.txt

Each caption.txt is written for that platform's own rules, so you can copy-paste
straight into the upload box.

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
        out = subprocess.check_output([
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-show_entries", "format=duration,size",
            "-of", "json", str(p)
        ]).decode()
        j = json.loads(out)
        st = (j.get("streams") or [{}])[0]
        return {
            "w": st.get("width"), "h": st.get("height"),
            "dur": round(float(j["format"]["duration"]), 1),
            "mb": round(int(j["format"]["size"]) / 1048576, 1),
        }
    except Exception:
        return {}


def tag_block(tags, limit):
    return " ".join("#" + t.lstrip("#") for t in tags[:limit])


def build_instagram(m, info):
    tags = tag_block(m["hashtags"], 30)
    return f"""{m['hook']}

{m['caption']}

{m.get('cta', '')}

.
.
.
{tags}

— — — — — — — — — — — — — — —
CHECKLIST BEFORE POSTING
  [ ] Cover frame: pick ~{m.get('cover_at', '0')}s (the strongest visual)
  [ ] Audio: ON (this reel is voice-led — muted autoplay loses it)
  [ ] Share to Facebook Page: ON (free crosspost)
  [ ] Allow remix / download: ON (helps reach)
  [ ] Location tag: a big metro (Mumbai / Delhi) widens the first push
  [ ] Post time: 7–10pm IST
  FILE  {info.get('w')}x{info.get('h')} · {info.get('dur')}s · {info.get('mb')}MB
  NOTE  The first 125 characters are what shows before "more" — they do the work.
"""


def build_youtube(m, info):
    tags = ", ".join(t.lstrip("#") for t in m["hashtags"][:15])
    short_tags = tag_block(m["hashtags"], 3)
    return f"""TITLE  (max 100 chars — currently {len(m['yt_title'])})
{m['yt_title']}

— — — — — — — — — — — — — — —
DESCRIPTION

{m['hook']}

{m['caption']}

{m.get('credits', '')}

{short_tags} #Shorts

— — — — — — — — — — — — — — —
TAGS  (paste into the Tags field)
{tags}

— — — — — — — — — — — — — — —
CHECKLIST BEFORE POSTING
  [ ] Title ends up under 100 chars
  [ ] #Shorts is in the title or description
  [ ] Thumbnail: not needed for Shorts, YouTube takes a frame
  [ ] Audience: "No, not made for kids"  (for the What If channel)
  [ ] Language: set correctly — this drives the multi-audio feature later
  FILE  {info.get('w')}x{info.get('h')} · {info.get('dur')}s · {info.get('mb')}MB
"""


def build_facebook(m, info):
    tags = tag_block(m["hashtags"], 5)
    return f"""{m['hook']}

{m['caption']}

{tags}

— — — — — — — — — — — — — — —
NOTE
  Easiest path: publish on Instagram with "Share to Facebook" ON and skip this folder.
  Only upload here manually if the crosspost fails or you want a different caption.
  Facebook rewards fewer hashtags than Instagram — 3–5 is the sweet spot.
  FILE  {info.get('w')}x{info.get('h')} · {info.get('dur')}s · {info.get('mb')}MB
"""


BUILDERS = {"Instagram": build_instagram, "YouTube": build_youtube, "Facebook": build_facebook}


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
    info = probe(vid)
    slug = slugify(meta.get("slug") or meta["yt_title"])

    made = []
    for p in PLATFORMS:
        d = EXPORTS / p / a.date / slug
        d.mkdir(parents=True, exist_ok=True)
        shutil.copy2(vid, d / vid.name)
        (d / "caption.txt").write_text(BUILDERS[p](meta, info), encoding="utf-8")
        made.append(d)

    print(f"packaged '{slug}'  ({info.get('dur')}s, {info.get('mb')}MB)")
    for d in made:
        print("  ", d.relative_to(ROOT))


if __name__ == "__main__":
    main()
