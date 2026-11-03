#!/usr/bin/env python3
"""Pick the kids-story narrator the same way we picked the English one: measured,
not guessed.

Two numbers per candidate:
  intelligibility — transcribe the VO back with whisper and score it against the
                    script. A voice a child can't parse is useless however cute.
  median f0       — perceived pitch. A storyteller for pre-schoolers wants to sit
                    bright (200-260 Hz); chipmunk territory starts around 300.

Writes every sample to Tools/publish/voicetest_kids/ so they can be listened to.
"""

import difflib
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "voicetest_kids"
WHISPER = Path.home() / "Developer" / "whisper.cpp"
MODEL = WHISPER / "models" / "ggml-base.en.bin"

LINE = ("Chintu the baby elephant had a big problem. He could not trumpet! "
        "Take a big breath, like a balloon. Ready? One, two, three!")

# bright/warm candidates + the two we already own
CANDIDATES = [
    ("af_heart",  1.0, 0),
    ("af_bella",  1.0, 0),
    ("af_nicole", 1.0, 0),
    ("af_sarah",  1.0, 0),
    ("bf_emma",   1.0, 0),
    ("af_heart",  1.0, 2),    # +2 semitones, formant-preserved
    ("af_bella",  1.0, 2),
]


def norm(s):
    return re.sub(r"[^a-z ]", "", s.lower()).split()


def transcribe(wav):
    stem = wav.with_suffix("")
    subprocess.run([str(WHISPER / "build" / "bin" / "whisper-cli"),
                    "-m", str(MODEL), "-f", str(wav), "-otxt", "-of", str(stem), "-nt"],
                   capture_output=True)
    t = stem.with_suffix(".txt")
    return t.read_text() if t.exists() else ""


def median_f0(wav):
    """Crude but adequate: autocorrelation peak per voiced frame."""
    y, sr = sf.read(wav)
    if y.ndim > 1:
        y = y.mean(1)
    f0s = []
    n = int(0.04 * sr)
    for i in range(0, len(y) - n, n):
        fr = y[i:i + n]
        if np.sqrt((fr ** 2).mean()) < 0.02:
            continue
        fr = fr - fr.mean()
        ac = np.correlate(fr, fr, "full")[n - 1:]
        lo, hi = int(sr / 400), int(sr / 120)      # 120-400 Hz search
        if hi >= len(ac):
            continue
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.3 * ac[0]:
            f0s.append(sr / k)
    return float(np.median(f0s)) if f0s else 0.0


def pitch_shift(src, dst, semitones):
    """Formant-preserving shift — plain resampling makes a chipmunk."""
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src),
                    "-af", f"rubberband=pitch={2 ** (semitones / 12):.5f}",
                    str(dst)], check=True)


def main():
    OUT.mkdir(exist_ok=True)
    want = norm(LINE)
    rows = []

    for voice, speed, shift in CANDIDATES:
        tag = f"{voice}{'' if not shift else f'_up{shift}'}"
        wav = OUT / f"{tag}.wav"
        try:
            pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
            chunks = [a for _, _, a in pipe(LINE, voice=voice, speed=speed)]
            if not chunks:
                raise RuntimeError("no audio")
            audio = np.concatenate(chunks)
            sf.write(wav, audio, 24000)
            if shift:
                raw = OUT / f"{tag}_raw.wav"
                wav.rename(raw)
                pitch_shift(raw, wav, shift)
                raw.unlink()
        except Exception as e:
            print(f"  {tag:18} FAILED  {str(e)[:70]}")
            continue

        heard = norm(transcribe(wav))
        acc = difflib.SequenceMatcher(None, want, heard).ratio()
        f0 = median_f0(wav)
        rows.append((tag, acc, f0))
        print(f"  {tag:18} intelligibility {acc:5.1%}   pitch {f0:5.1f} Hz")

    if not rows:
        sys.exit("every candidate failed")
    print("\nranked (intelligibility first, brightness as tiebreak):")
    for tag, acc, f0 in sorted(rows, key=lambda r: (-r[1], -r[2])):
        note = "bright" if 200 <= f0 < 300 else ("deep" if f0 < 200 else "very high")
        print(f"  {tag:18} {acc:5.1%}  {f0:5.1f} Hz  {note}")
    print(f"\nsamples: {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
