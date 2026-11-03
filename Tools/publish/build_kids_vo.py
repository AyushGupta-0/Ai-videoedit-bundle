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
    """Synthesise one line AND return its word times.

    Kokoro emits token timestamps as it synthesises (English: lang 'a'/'b').
    They are exact by construction — the aligner is inside the synthesiser —
    which beats re-transcribing the output with whisper and matching words
    back: that pass was measured at a 3.7s MEDIAN error because `-ml 1` just
    spreads tokens evenly across each segment. Hindi tokens carry no times
    upstream, so `words` comes back empty there and callers fall back.
    """
    chunks, words, off = [], [], 0.0
    for r in pipe(text, voice=voice, speed=speed):
        a = r.audio.numpy().astype(np.float32)
        for t in (getattr(r, "tokens", None) or []):
            if getattr(t, "start_ts", None) is not None and any(c.isalnum() for c in t.text):
                words.append({"w": t.text, "s": round(off + t.start_ts, 3),
                              "e": round(off + t.end_ts, 3)})
        chunks.append(a)
        off += len(a) / SR
    if not chunks:
        raise RuntimeError(f"Kokoro returned nothing for {text!r}")
    y = np.concatenate(chunks)
    # a phrase-final end_ts includes the trailing pause: end at the next start
    for k in range(len(words) - 1):
        words[k]["e"] = min(words[k]["e"], words[k + 1]["s"])
    if words:
        words[-1]["e"] = min(words[-1]["e"], round(len(y) / SR, 3))
    if abs(semitones) > 0.01:          # pitch_shift preserves length, so times hold
        y = librosa.effects.pitch_shift(y=y, sr=SR, n_steps=semitones)
    return y, words


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
        y, words = say(pipe, ln["text"], v["kokoro"], v["speed"], v["semitones"])
        rendered.append((ln, y, words))
        print(f"  {ln['id']}  {ln['who']}  {len(y)/SR:5.2f}s  {ln['text'][:46]}")

    # lay out, pushing a line later only if the one before it overruns
    cursor = 0.0
    for ln, y, words in rendered:
        start = max(ln["at"], cursor)
        dur = len(y) / SR
        timings.append({"id": ln["id"], "who": ln["who"], "shot": ln["shot"],
                        "text": ln["text"], "cap": ln.get("cap", ""),
                        "start": round(start, 3), "end": round(start + dur, 3),
                        # absolute word times, for word-level captions
                        "words": [{"w": w["w"], "s": round(start + w["s"], 3),
                                   "e": round(start + w["e"], 3)} for w in words]})
        # A scripted pause is a performance instruction, not slack. Without it
        # every line butts against the next and the tension beats disappear.
        cursor = start + dur + ln.get("pause", 0.06)

    total = cursor + TAIL
    bed = np.zeros(int(total * SR), dtype=np.float32)
    for (ln, y, _w), t in zip(rendered, timings):
        i = int(t["start"] * SR)
        bed[i:i + len(y)] += y

    peak = np.abs(bed).max()
    if peak > 0:
        bed *= 0.89 / peak
    sf.write(out, bed, SR)

    tj = out.with_name(out.stem + "_timings.json")
    tj.write_text(json.dumps({"duration": round(total, 3), "lines": timings}, indent=2))

    # only flag drift on lines with no deliberate pause before them — a pause
    # legitimately pushes everything after it and is not a problem to report
    drift = [t for t, ln in zip(timings, spec["lines"])
             if t["start"] - ln["at"] > 0.25 and not ln.get("pause")]
    print(f"\n{out}  {total:.2f}s")
    print(f"{tj.name}  {len(timings)} lines")
    if drift:
        print(f"\n{len(drift)} line(s) pushed later than scripted — tighten the text "
              f"or move the beat:")
        for t in drift:
            print(f"   {t['id']} scripted, now at {t['start']:.2f}s")


if __name__ == "__main__":
    main()
