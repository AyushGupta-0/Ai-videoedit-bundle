#!/usr/bin/env python3
"""Mix one episode: narration + a real bed + placed SFX, voice always on top.

build_mix.sh synthesises its own sine-wave drone with a swell shape baked in at
fixed seconds, which was right for the space explainer and wrong for anything
else. This takes a real bed file and a cue sheet instead, and keeps the parts of
that chain that were measured to matter:

  - key normalised to -16 LUFS BEFORE the sidechain, or the compressor barely
    engages (Kokoro VO sits near -25 dB mean; measured 1.7 LU of ducking vs ~7)
  - bed lowpassed at 2.4 kHz with a -6 dB notch at 2 kHz; SFX bus notched at
    1.6 / 2.6 kHz — consonants live there and ducking alone does not protect them
  - alimiter with level=false (the default auto-levels UP toward the limit)
  - loudnorm last, then verify with ebur128, never loudnorm's own printout

    python3 mix_episode.py Tools/tendays-ep02 --bed assets/audio/bed_x.mp3 \\
        --cues cues.json --out assets/audio/mix.wav [--bed-gain 0.42] [--target -14]
"""
import argparse
import json
import subprocess
from pathlib import Path


def dur_of(p):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", str(p)]).decode().strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode_dir")
    ap.add_argument("--vo", default="assets/audio/vo.wav")
    ap.add_argument("--bed", required=True)
    ap.add_argument("--cues", default="cues.json")
    ap.add_argument("--out", default="assets/audio/mix.wav")
    ap.add_argument("--bed-gain", type=float, default=0.42)
    ap.add_argument("--sfx-gain", type=float, default=1.0)
    ap.add_argument("--target", type=float, default=-14.0, help="integrated LUFS")
    ap.add_argument("--duration", type=float, default=None,
                    help="composition length; defaults to VO length + 1.2s")
    a = ap.parse_args()

    d = Path(a.episode_dir)
    vo, bed, out = d / a.vo, d / a.bed, d / a.out
    cues = json.loads((d / a.cues).read_text()) if (d / a.cues).exists() else []
    D = a.duration or (dur_of(vo) + 1.2)

    inputs = ["-i", str(vo), "-stream_loop", "-1", "-i", str(bed)]
    fc = []

    # --- voice: light compression so quiet lines don't vanish, then split a key
    fc.append(f"[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,"
              f"apad=whole_dur={D:.3f},"          # VO is amix's reference: pad it to the full cut
              "acompressor=threshold=0.05:ratio=3.2:attack=8:release=180:makeup=2.0,"
              "asplit=3[vo][k1][k2]")
    fc.append("[k1]loudnorm=I=-16:LRA=7:TP=-1[sc1]")
    fc.append("[k2]loudnorm=I=-16:LRA=7:TP=-1[sc2]")

    # --- bed: looped, trimmed, carved out of the voice band, faded
    fc.append(f"[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,"
              f"atrim=0:{D:.3f},asetpts=PTS-STARTPTS,"
              f"highpass=f=28,lowpass=f=2400,equalizer=f=2000:t=q:w=1.4:g=-6,"
              f"afade=t=in:st=0:d=1.6,afade=t=out:st={max(0, D-2.2):.3f}:d=2.2,"
              f"volume={a.bed_gain}[bed]")

    # --- sfx bus: each cue delayed into place, then the bus is carved and capped
    labels = []
    for i, c in enumerate(cues):
        f = d / c["file"]
        if not f.exists():
            print(f"  skip (missing): {c['file']}")
            continue
        inputs += ["-i", str(f)]
        idx = 2 + len(labels)
        ms = int(round(c["at"] * 1000))
        fc.append(f"[{idx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,"
                  f"volume={c.get('gain', 0.5) * a.sfx_gain},adelay={ms}|{ms}[x{idx}]")
        labels.append(f"[x{idx}]")
    if labels:
        fc.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,"
                  f"atrim=0:{D:.3f},"
                  "equalizer=f=2600:t=q:w=1.6:g=-5,equalizer=f=1600:t=q:w=1.8:g=-3,"
                  "alimiter=limit=0.7:level=false[sfx]")
    else:
        fc.append(f"anullsrc=r=48000:cl=stereo,atrim=0:{D:.3f}[sfx]")

    # --- duck both under the (normalised) voice key, mix, cap, normalise
    fc.append("[bed][sc1]sidechaincompress=threshold=0.022:ratio=9:attack=8:release=240:makeup=1[bed_d]")
    fc.append("[sfx][sc2]sidechaincompress=threshold=0.030:ratio=5:attack=6:release=190:makeup=1[sfx_d]")
    fc.append("[vo][bed_d][sfx_d]amix=inputs=3:normalize=0:duration=first,"
              f"alimiter=limit=0.95:level=false,loudnorm=I={a.target}:TP=-1.2:LRA=11,"
              "aformat=sample_fmts=s16:sample_rates=48000:channel_layouts=stereo[out]")

    cmd = ["ffmpeg", "-y", "-v", "error", *inputs,
           "-filter_complex", ";".join(fc), "-map", "[out]", "-t", f"{D:.3f}", str(out)]
    subprocess.run(cmd, check=True)

    # verify with the real meter
    meter = subprocess.run(["ffmpeg", "-v", "info", "-i", str(out), "-af", "ebur128=peak=true",
                            "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = [l.strip() for l in meter.splitlines() if l.strip().startswith(("I:", "Peak:"))][-2:]
    print(f"mix -> {out}  ({D:.1f}s, {len(labels)} cues)  " + "  ".join(tail))


if __name__ == "__main__":
    main()
