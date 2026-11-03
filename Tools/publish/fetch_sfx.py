#!/usr/bin/env python3
"""Fetch CC0 sound effects and music beds from Openverse.

Openverse needs NO API KEY. It does need a User-Agent — a request without one
returns HTTP 000 (connection refused), which I previously mis-read as "the API
is gated now" and went off and synthesised a sine-wave music bed instead. It
was never gated. Always send a UA.

Everything returned here is filtered to `license=cc0`, i.e. public domain: safe
for monetised video, no attribution required. We still record attribution in
CREDITS.json as evidence of provenance if a claim is ever raised.

    python3 fetch_sfx.py --out Tools/x/assets/sfx whoosh riser impact
    python3 fetch_sfx.py --out Tools/x/assets/audio --bed "suspense ambient"
"""
import argparse
import json
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.openverse.org/v1/audio/"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")


def get(url, tries=4, timeout=40):
    """Anonymous Openverse allows 20 req/min. Past that it 429s, and a 429 that
    is not handled comes back as an empty result set rather than an error —
    i.e. you silently get nothing and think the query was bad."""
    import time
    for i in range(tries):
        try:
            return urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": UA}), timeout=timeout)
        except urllib.error.HTTPError as e:
            if e.code != 429 or i == tries - 1:
                raise
            wait = 4 * (i + 1)
            print(f"    rate limited, waiting {wait}s")
            time.sleep(wait)
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            # The Freesound CDN times out intermittently under a burst. Retrying
            # is almost always enough; failing the whole run for one slow file
            # is not.
            if i == tries - 1:
                raise
            wait = 3 * (i + 1)
            print(f"    {type(e).__name__}, retrying in {wait}s")
            time.sleep(wait)


def search(q, n=12):
    qs = urllib.parse.urlencode({"q": q, "license": "cc0", "page_size": n})
    return json.loads(get(f"{API}?{qs}").read()).get("results", [])


def pick(results, bed):
    """Openverse's `category` field is null on almost every row, so split beds
    from one-shots on duration instead: a bed has to be long enough to loop
    under a whole episode."""
    out = []
    for r in results:
        secs = (r.get("duration") or 0) / 1000
        if bed and secs < 25:
            continue
        if not bed and not (0.2 <= secs <= 12):
            continue
        if r.get("license") != "cc0" or not r.get("url"):
            continue
        out.append((secs, r))
    out.sort(key=lambda x: -x[0] if bed else x[0])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("queries", nargs="*")
    ap.add_argument("--out", required=True)
    ap.add_argument("--bed", help="fetch one long bed for this query instead")
    ap.add_argument("--each", type=int, default=1, help="files per query")
    a = ap.parse_args()

    outdir = Path(a.out); outdir.mkdir(parents=True, exist_ok=True)
    credits_path = outdir / "CREDITS.json"
    credits = json.loads(credits_path.read_text()) if credits_path.exists() else []

    jobs = [(a.bed, True)] if a.bed else [(q, False) for q in a.queries]
    if not jobs:
        raise SystemExit("give some queries, or --bed <query>")

    for q, is_bed in jobs:
        hits = pick(search(q), is_bed)
        if not hits:
            print(f"  {q}: no CC0 match"); continue
        for secs, r in hits[:a.each]:
            # The -hq.mp3 preview is public; alt_files' WAV needs OAuth (401).
            # Freesound serves the same preview as .ogg at 192kbps vorbis vs the
            # mp3's 174kbps — better quality AND a smaller file, so prefer it and
            # fall back only if it 404s.
            url, ext = r["url"], "mp3"
            if url.endswith("-hq.mp3"):
                ogg = url[:-len("-hq.mp3")] + "-hq.ogg"
                # HEAD, not a partial GET: reading one byte and abandoning the
                # response leaves the socket open and the NEXT query times out.
                try:
                    req = urllib.request.Request(ogg, method="HEAD",
                                                 headers={"User-Agent": UA})
                    with urllib.request.urlopen(req, timeout=20) as resp:
                        if resp.status == 200:
                            url, ext = ogg, "ogg"
                except Exception:
                    pass
            name = f"{'bed' if is_bed else q.replace(' ', '_')}_{r['id'][:8]}.{ext}"
            dst = outdir / name
            data = None
            for attempt in range(3):
                try:
                    data = get(url, timeout=240 if is_bed else 40).read(); break
                except (TimeoutError, OSError) as e:
                    print(f"    read {type(e).__name__}, retry {attempt + 1}/3")
            if data is None:
                print(f"  giving up on {name}"); continue
            dst.write_bytes(data)
            credits.append({
                "file": name, "query": q, "license": r.get("license"),
                "title": r.get("title"), "source": r.get("foreign_landing_url"),
                "url": url, "attribution": r.get("attribution"),
                "duration_s": round(secs, 1),
            })
            print(f"  {name}  {secs:.1f}s  {r.get('title','')[:40]}")
            __import__("time").sleep(1.2)     # stay well under 20 req/min

    credits_path.write_text(json.dumps(credits, indent=2))
    print(f"\n{len(credits)} entries -> {credits_path}")


if __name__ == "__main__":
    main()
