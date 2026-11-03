#!/usr/bin/env python3
"""Reclaim SSD space after a video has been uploaded.

Deletes the heavy, regenerable artefacts for one video and leaves everything
needed to rebuild it: the composition, the script, the metadata and the docs.

    python3 cleanup.py --list                  # what is taking up space
    python3 cleanup.py --slug light-speed-hindi --dry-run
    python3 cleanup.py --slug light-speed-hindi
    python3 cleanup.py --caches                # shared caches only
"""

import argparse
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXPORTS = ROOT / "Exports"
RAW = next((ROOT / n for n in ("Raw footage ", "Raw footage") if (ROOT / n).exists()), None)

# Regenerable in minutes — safe to delete once the video is live.
# NOTE: Tools/dashboard/cache is deliberately NOT here. Deleting it leaves every
# dashboard filmstrip rendering as black boxes. server.js now heals missing
# thumbnails on its own, but there is no reason to make it do that work.
SHARED_CACHES = [
    ROOT / "References" / "_source_temp",            # downloaded reference reels
    ROOT / ".hf-cache",                              # HuggingFace model cache
]

# Never touched: compositions, scripts, assets/shots, docs, meta json.


def human(n):
    for u in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f}{u}"
        n /= 1024
    return f"{n:.1f}TB"


def size_of(p: Path):
    if not p.exists():
        return 0
    if p.is_file():
        return p.stat().st_size
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file())


def targets_for(slug):
    """Only what belongs to THIS published video.

    An earlier version swept every raw mp4 and every lightspeed-*/renders dir
    regardless of slug, which would have taken the un-uploaded Hindi master with
    it. Now a raw master or a render only goes if it is byte-for-byte the video
    sitting in this slug's Exports folder — i.e. the copy that is now live on the
    platforms, so the local one is redundant.
    """
    exports = []
    for platform in ("Instagram", "YouTube", "Facebook"):
        d = EXPORTS / platform
        if d.exists():
            exports += [p for p in d.rglob(slug) if p.is_dir()]
    if not exports:
        sys.exit(f"no Exports folder named '{slug}' — check the slug with --list")

    # fingerprint the uploaded video itself
    uploaded = {p.stat().st_size for d in exports for p in d.glob("*.mp4")
                if not p.name.startswith(".")}

    out = list(exports)
    pool = list(RAW.glob("*.mp4")) if RAW else []
    for r in (ROOT / "Tools").glob("*/renders"):
        pool += list(r.rglob("*.mp4"))
    out += [p for p in pool
            if not p.name.startswith(".") and p.stat().st_size in uploaded]

    return [p for p in out if p.exists()]


def build_scratch():
    """Frame caches and render scratch — always regenerable from the composition."""
    out = []
    for proj in (ROOT / "Tools").glob("*"):
        hf = proj / ".hyperframes" / "artifacts"
        if hf.exists():
            out.append(hf)
    return out


def show(paths, label):
    total = sum(size_of(p) for p in paths)
    print(f"\n{label}  ({human(total)})")
    for p in paths:
        print(f"   {human(size_of(p)):>9}  {p.relative_to(ROOT)}")
    return total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", help="video slug that has been uploaded")
    ap.add_argument("--caches", action="store_true", help="clear shared caches too")
    ap.add_argument("--builds", action="store_true",
                    help="clear .hyperframes frame scratch (regenerable, any project)")
    ap.add_argument("--list", action="store_true", help="show sizes, delete nothing")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.list:
        show([p for p in SHARED_CACHES if p.exists()], "shared caches")
        for proj in sorted((ROOT / "Tools").glob("lightspeed-*")):
            show([p for p in (proj / "renders", proj / ".hyperframes") if p.exists()],
                 f"{proj.name} build output")
        if RAW:
            show(list(RAW.glob("*.mp4")), "Raw footage")
        return

    picked = []
    if a.slug:
        picked += targets_for(a.slug)
    if a.caches:
        picked += [p for p in SHARED_CACHES if p.exists()]
    if a.builds:
        picked += build_scratch()
    if not picked:
        sys.exit("nothing selected — pass --slug / --caches / --builds, or use --list")

    picked = sorted(set(picked))
    total = show(picked, "WILL DELETE")

    if a.dry_run:
        print(f"\ndry run — nothing removed. Would free {human(total)}")
        return

    for p in picked:
        shutil.rmtree(p, ignore_errors=True) if p.is_dir() else p.unlink(missing_ok=True)
    print(f"\nfreed {human(total)}")
    print("Kept: compositions, scripts, NASA plates, metadata, docs — the video can be rebuilt.")


if __name__ == "__main__":
    main()
