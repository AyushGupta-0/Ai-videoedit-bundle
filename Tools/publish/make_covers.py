#!/usr/bin/env python3
"""Generate the cover image for one reel.

We publish reels only — Instagram Reels, YouTube Shorts, Facebook Reels — so there
is exactly ONE cover: 1080x1920, used on all three. No landscape thumbnail.

  reel_cover_1080x1920.png   All text sits inside the centre 1080x1080, because
                             the Instagram profile grid crops it to a square.

  --page-cover also writes page_cover_1640x856.png, the Facebook *Page* banner.
  That's a one-time channel asset, not a per-video one.

    python3 make_covers.py --plate sun_surface --line1 "YOU CAN NEVER" \
        --line2 "REACH LIGHT SPEED" --kicker "here's what happens if you try" \
        --out Exports/covers/light-speed-en
"""

import argparse
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[2]
PLATES = ROOT / "Tools" / "lightspeed-v2" / "assets" / "shots"
IDENT = ROOT / "Brand Kit" / "identity"
LAT = "/System/Library/Fonts/Avenir Next.ttc"
DEV = "/System/Library/Fonts/Kohinoor.ttc"   # Avenir has no Devanagari glyphs
HEAVY, DEMI = 8, 2
DEV_BOLD, DEV_SEMI = 3, 2
GOLD = (245, 181, 61)
SAFFRON = (255, 138, 42)
INK = (5, 6, 10)


def fit_cover(img, w, h):
    """Scale to cover w×h, centre-crop."""
    s = max(w / img.width, h / img.height)
    img = img.resize((max(w, int(img.width * s)), max(h, int(img.height * s))), Image.LANCZOS)
    return img.crop(((img.width - w) // 2, (img.height - h) // 2,
                     (img.width - w) // 2 + w, (img.height - h) // 2 + h))


def scrim(img, top=0.55, bottom=0.75):
    """Darken so type always reads, heavier at the edges."""
    w, h = img.size
    ov = Image.new("L", (1, h))
    for y in range(h):
        t = y / h
        edge = max(0.0, 1 - t / 0.45) * top + max(0.0, (t - 0.55) / 0.45) * bottom
        ov.putpixel((0, y), int(255 * min(0.85, edge + 0.22)))
    ov = ov.resize((w, h))
    dark = Image.new("RGB", (w, h), INK)
    return Image.composite(dark, img, ov)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if draw.textlength(t, font=font) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur); cur = w_
    if cur:
        lines.append(cur)
    return lines


def draw_block(d, lines, font, cx, y, fill, gap=1.12, shadow=True):
    for ln in lines:
        l, t, r, b = d.textbbox((0, 0), ln, font=font)
        x = cx - (r - l) / 2 - l
        if shadow:
            d.text((x + 4, y + 5), ln, font=font, fill=(0, 0, 0, 190))
        d.text((x, y), ln, font=font, fill=fill)
        y += int((b - t) * gap) + int(font.size * 0.22)
    return y


def badge(img, mark_path, size, xy):
    m = Image.open(mark_path).resize((size, size), Image.LANCZOS)
    msk = Image.new("L", (size, size), 0)
    ImageDraw.Draw(msk).ellipse([0, 0, size - 1, size - 1], fill=255)
    img.paste(m, xy, msk)


def build(plate, l1, l2, kicker, outdir, accent, mark, hindi=False, page_cover=False):
    face, bold_i, semi_i = (DEV, DEV_BOLD, DEV_SEMI) if hindi else (LAT, HEAVY, DEMI)
    outdir.mkdir(parents=True, exist_ok=True)
    src = Image.open(PLATES / f"{plate}.jpg").convert("RGB")
    src = ImageEnhance.Color(src).enhance(1.08)

    # ---------- Reel / Shorts cover : keep type inside the centre square ----------
    W, H = 1080, 1920
    img = scrim(fit_cover(src, W, H), 0.50, 0.70)
    d = ImageDraw.Draw(img, "RGBA")
    f1 = ImageFont.truetype(face, 104 if hindi else 118, index=bold_i)
    fk = ImageFont.truetype(face, 44, index=semi_i)
    sq_top = (H - W) // 2                      # the 1:1 crop window
    lines = wrap(d, l1, f1, W - 150) + wrap(d, l2, f1, W - 150)
    block_h = len(lines) * 150
    y = sq_top + (W - block_h) // 2 - 40
    y = draw_block(d, lines, f1, W / 2, y, (255, 255, 255, 255))
    d.rectangle([W / 2 - 150, y + 26, W / 2 + 150, y + 32], fill=accent + (255,))
    kl = wrap(d, kicker, fk, W - 220)
    draw_block(d, kl, fk, W / 2, y + 68, accent + (255,))
    badge(img, mark, 118, (W // 2 - 59, sq_top + W - 214))   # fully inside the 1:1 crop
    img.save(outdir / "reel_cover_1080x1920.png")

    # ---------- Facebook *Page* banner : channel asset, not per video ----------
    if page_cover:
        W, H = 1640, 856
        img = scrim(fit_cover(src, W, H), 0.45, 0.60)
        d = ImageDraw.Draw(img, "RGBA")
        fn = ImageFont.truetype(LAT, 104, index=HEAVY)
        fs = ImageFont.truetype(LAT, 44, index=DEMI)
        # mobile crops to roughly the centre 640-wide band — keep everything inside it
        cx = W / 2
        badge(img, mark, 190, (int(cx - 95), int(H / 2 - 190)))
        name = "1min.thinker"
        l, t, r, b = d.textbbox((0, 0), name, font=fn)
        d.text((cx - (r - l) / 2 - l, H / 2 + 36), name, font=fn, fill=(255, 255, 255, 255))
        tag = "one big idea, every week"
        l, t, r, b = d.textbbox((0, 0), tag, font=fs)
        d.text((cx - (r - l) / 2 - l, H / 2 + 162), tag, font=fs, fill=accent + (255,))
        img.save(outdir / "page_cover_1640x856.png")

    print(f"covers → {outdir.relative_to(ROOT)}")
    for f in sorted(outdir.glob("*.png")):
        if not f.name.startswith("."):      # exFAT AppleDouble ._ twins
            print("   ", f.name)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--plate", default="sun_surface")
    ap.add_argument("--line1", required=True)
    ap.add_argument("--line2", default="")
    ap.add_argument("--kicker", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--hindi", action="store_true")
    ap.add_argument("--page-cover", action="store_true",
                    help="also write the Facebook Page banner (one-time channel asset)")
    a = ap.parse_args()
    build(a.plate, a.line1, a.line2, a.kicker, ROOT / a.out,
          SAFFRON if a.hindi else GOLD,
          IDENT / ("hindi_avatar_400.png" if a.hindi else "avatar_400.png"),
          hindi=a.hindi, page_cover=a.page_cover)


if __name__ == "__main__":
    main()
