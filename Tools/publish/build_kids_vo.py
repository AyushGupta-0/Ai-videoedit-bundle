#!/usr/bin/env python3
"""Build a multi-character kids VO track from a lines JSON.

Each line is synthesised with its character's Kokoro voice, pitch-shifted with
librosa (ffmpeg here has no rubberband), and laid onto a silent bed at its
scripted time. Writes the mix plus the REAL per-line timings, which the
composition uses for captions — scripted times are intent, measured times are
truth, and they drift as soon as a line runs long.

    python3 build_kids_vo.py lines_kids_chintu_en.json out/vo.wav
"""

import json
import sys
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf
from kokoro import KPipeline

SR = 24000
TAIL = 1.2          # let the last line breathe before the loop point


def say(pipe, text, voice, speed, semitones):
    chunks = [a for _, _, a in pipe(text, voice=voice, speed=speed)]
    if not chunks:
        raise RuntimeError(f"Kokoro returned nothing for {text!r}")
    y = np.concatenate(chunks).astype(np.float32)
    if abs(semitones) > 0.01:
        y = librosa.effects.pitch_shift(y=y, sr=SR, n_steps=semitones)
    return y


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    spec = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2])
    out.parent.mkdir(parents=True, exist_ok=True)

    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    rendered, timings = [], []

    for ln in spec["lines"]:
        v = spec["voices"][ln["who"]]
        y = say(pipe, ln["text"], v["kokoro"], v["speed"], v["semitones"])
        rendered.append((ln, y))
        print(f"  {ln['id']}  {ln['who']}  {len(y)/SR:5.2f}s  {ln['text'][:46]}")

    # lay out, pushing a line later only if the one before it overruns
    cursor = 0.0
    for ln, y in rendered:
        start = max(ln["at"], cursor)
        dur = len(y) / SR
        timings.append({"id": ln["id"], "who": ln["who"], "shot": ln["shot"],
                        "text": ln["text"], "start": round(start, 3),
                        "end": round(start + dur, 3)})
        cursor = start + dur + 0.06

    total = cursor + TAIL
    bed = np.zeros(int(total * SR), dtype=np.float32)
    for (ln, y), t in zip(rendered, timings):
        i = int(t["start"] * SR)
        bed[i:i + len(y)] += y

    peak = np.abs(bed).max()
    if peak > 0:
        bed *= 0.89 / peak
    sf.write(out, bed, SR)

    tj = out.with_name(out.stem + "_timings.json")
    tj.write_text(json.dumps({"duration": round(total, 3), "lines": timings}, indent=2))

    drift = [t for t, ln in zip(timings, spec["lines"]) if t["start"] - ln["at"] > 0.25]
    print(f"\n{out}  {total:.2f}s")
    print(f"{tj.name}  {len(timings)} lines")
    if drift:
        print(f"\n{len(drift)} line(s) pushed later than scripted — tighten the text "
              f"or move the beat:")
        for t in drift:
            print(f"   {t['id']} scripted, now at {t['start']:.2f}s")


if __name__ == "__main__":
    main()
