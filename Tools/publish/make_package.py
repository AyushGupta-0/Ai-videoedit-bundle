#!/usr/bin/env python3
"""Build a ready-to-upload package for one video.

Creates, under Exports/:
    [<channel>/]Instagram/<date>/<slug>/   video, cover.png, caption.txt, _checklist.txt
    [<channel>/]YouTube/<date>/<slug>/     + title.txt, tags.txt
    [<channel>/]Facebook/<date>/<slug>/

--channel keeps separate shows apart: Exports/Kids/Instagram/... vs the
flat Exports/Instagram/... the What If explainers use.

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

# YouTube's "Made for kids" flag is a legal declaration under COPPA, not a
# preference. A children's story channel must answer YES; it costs comments and
# personalised ads, and answering NO to keep those is the thing that gets
# channels penalised. Driven by --channel so it cannot be got wrong by hand.
def audience(ch):
    return ("  [ ] Audience: YES, made for kids  (required — this is children's content;\n"
            "      it disables comments and personalised ads, that is expected)"
            if ch.lower().startswith("kid")
            else "  [ ] Audience: not made for kids")


CHECKS = {
    "Instagram": lambda m, i, ch="": f"""INSTAGRAM REEL
  [ ] Cover: Edit cover -> Add from gallery -> cover.png (in this folder)
      Fallback if you skip it: pick frame ~{m.get('cover_at','0')}s
  [ ] Audio ON (voice-led — muted autoplay loses it)
  [ ] Share to Facebook Page: ON
  [ ] Allow remix + download: ON
  [ ] Location: a big metro widens the first push
  [ ] Post 7-10pm IST
  First 125 chars show before "more" — they carry it.
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
    "YouTube": lambda m, i, ch="": f"""YOUTUBE SHORT
  [ ] Cover: upload cover.png as the thumbnail
      If YouTube doesn't offer a custom thumbnail, it auto-picks a frame. Leave it.
  [ ] Title from title.txt ({len(m['yt_title'])}/100 chars)
  [ ] Tags from tags.txt
  [ ] #Shorts present
{audience(ch)}
  [ ] Language set — enables the Hindi audio track later
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
    "Facebook": lambda m, i, ch="": f"""FACEBOOK REEL
  Easiest: publish on Instagram with "Share to Facebook" ON and skip this folder.
  [ ] Cover: Edit cover -> Upload -> cover.png
  Facebook rewards few hashtags — 3-5 only.
  FILE {i.get('w')}x{i.get('h')} · {i.get('dur')}s · {i.get('mb')}MB
""",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("meta")
    ap.add_argument("--date", default=date.today().isoformat())
    ap.add_argument("--cover", help="reel_cover_1080x1920.png — copied into all three folders")
    ap.add_argument("--channel", default="",
                    help="channel section, e.g. Kids -> Exports/Kids/Instagram/<date>/<slug>")
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

    # one vertical cover, same image on all three — we publish reels only
    cover = Path(a.cover) if a.cover else None
    if cover and not cover.exists():
        sys.exit(f"no such cover: {cover}")

    for p in PLATFORMS:
        d = (EXPORTS / a.channel / p / a.date / slug) if a.channel else (EXPORTS / p / a.date / slug)
        d.mkdir(parents=True, exist_ok=True)
        if (d / vid.name).resolve() != vid.resolve():
            shutil.copy2(vid, d / vid.name)
        if cover:
            shutil.copy2(cover, d / "cover.png")
        (d / "caption.txt").write_text(CAPTIONS[p](meta), encoding="utf-8")
        (d / "_checklist.txt").write_text(CHECKS[p](meta, info, a.channel), encoding="utf-8")
        if p == "YouTube":
            (d / "title.txt").write_text(meta["yt_title"] + "\n", encoding="utf-8")
            (d / "tags.txt").write_text(
                ", ".join(t.lstrip("#") for t in meta["hashtags"][:15]) + "\n", encoding="utf-8")

    print(f"packaged '{slug}'  ({info.get('dur')}s, {info.get('mb')}MB)")
    for p in PLATFORMS:
        base = (EXPORTS / a.channel / p) if a.channel else (EXPORTS / p)
        print("  ", (base / a.date / slug).relative_to(ROOT))


if __name__ == "__main__":
    main()
