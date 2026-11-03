#!/usr/bin/env python3
"""Generate a channel's identity set: avatars at every size, plus covers.

The hard constraint is 40px. That is how big a profile picture actually is in a
feed, and it is why these marks carry no small text — one bold silhouette, one
thick ring, high contrast. The 98px render exists so you can check that before
uploading anything.

    python3 make_identity.py --name "Kids Adventure" --slug kids-adventure \
        --mark plane --out "Brand Kit/identity/kids-adventure"
"""
import argparse
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
LAT = "/System/Library/Fonts/Avenir Next.ttc"
HEAVY, DEMI = 8, 2

PALETTES = {
    # from the kids style guide
    "kids":  {"bg": (111, 199, 240), "ring": (255, 217, 61), "mark": (255, 255, 255),
              "ink": (43, 34, 64), "accent": (255, 92, 92)},
    "think": {"bg": (10, 12, 20), "ring": (245, 181, 61), "mark": (245, 181, 61),
              "ink": (5, 6, 10), "accent": (245, 181, 61)},
}


def plane(d, cx, cy, r, fill, ink):
    """A paper dart seen from above-behind: nose right, two swept wings meeting
    at a fold. Drawn as two polygons sharing the fold line so the near wing can
    be shaded — that shading is the only thing that stops it reading as a plain
    chevron, which the first version did."""
    s = r * 1.08
    nose = (cx + s * 1.00, cy)
    top = (cx - s * 0.86, cy - s * 0.70)
    bot = (cx - s * 0.86, cy + s * 0.70)
    fold = (cx - s * 0.40, cy)
    w = max(2, int(r * 0.085))
    # far wing (lighter), then near wing (shaded) over it
    d.polygon([nose, top, fold], fill=fill, outline=ink, width=w)
    d.polygon([nose, bot, fold],
              fill=tuple(int(c * 0.78) for c in fill[:3]), outline=ink, width=w)
    d.line([fold, nose], fill=ink, width=w)


def star(d, cx, cy, r, fill, ink):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.44
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    d.polygon(pts, fill=fill, outline=ink, width=max(2, int(r * 0.1)))


MARKS = {"plane": plane, "star": star}


def avatar(size, pal, markfn):
    S = 1024
    img = Image.new("RGB", (S, S), pal["bg"])
    d = ImageDraw.Draw(img)
    # soft sky wash so the flat fill is not dead
    for i in range(S):
        k = i / S
        d.line([(0, i), (S, i)],
               fill=tuple(int(c + (255 - c) * 0.18 * (1 - k)) for c in pal["bg"]))
    ringw = int(S * 0.055)
    d.ellipse([ringw // 2, ringw // 2, S - ringw // 2, S - ringw // 2],
              outline=pal["ring"], width=ringw)
    markfn(d, S / 2, S / 2, S * 0.30, pal["mark"], pal["ink"])
    return img.resize((size, size), Image.LANCZOS)


def banner(w, h, name, tag, pal, markfn, mark_r, name_y, tag_y, fs_name, fs_tag):
    img = Image.new("RGB", (w, h), pal["bg"])
    d = ImageDraw.Draw(img)
    for i in range(h):
        k = i / h
        d.line([(0, i), (w, i)],
               fill=tuple(int(c + (255 - c) * 0.22 * (1 - k)) for c in pal["bg"]))
    cx = w / 2
    markfn(d, cx, h * mark_r[0], h * mark_r[1], pal["mark"], pal["ink"])
    fn = ImageFont.truetype(LAT, fs_name, index=HEAVY)
    fs = ImageFont.truetype(LAT, fs_tag, index=DEMI)
    for text, font, y, col in ((name, fn, name_y, (255, 255, 255)),
                               (tag, fs, tag_y, pal["ring"])):
        l, t, r, b = d.textbbox((0, 0), text, font=font)
        x = cx - (r - l) / 2 - l
        d.text((x + 3, h * y + 4), text, font=font, fill=pal["ink"])
        d.text((x, h * y), text, font=font, fill=col)
    return img


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--tagline", default="")
    ap.add_argument("--palette", default="kids", choices=list(PALETTES))
    ap.add_argument("--mark", default="plane", choices=list(MARKS))
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    pal, markfn = PALETTES[a.palette], MARKS[a.mark]
    out = ROOT / a.out
    out.mkdir(parents=True, exist_ok=True)

    for s in (1024, 800, 400, 180, 98):
        avatar(s, pal, markfn).save(out / f"avatar_{s}.png")
    # YouTube banner: everything inside the 1546x423 centre, the only part that
    # survives on a phone
    banner(2560, 1440, a.name, a.tagline, pal, markfn,
           (0.345, 0.165), 0.495, 0.615, 168, 72).save(out / "youtube_banner_2560x1440.png")
    banner(1640, 856, a.name, a.tagline, pal, markfn,
           (0.31, 0.205), 0.485, 0.645, 126, 56).save(out / "fb_page_cover_1640x856.png")

    print(f"identity → {out.relative_to(ROOT)}")
    for f in sorted(out.glob("*.png")):
        if not f.name.startswith("."):
            print("   ", f.name)


if __name__ == "__main__":
    main()
