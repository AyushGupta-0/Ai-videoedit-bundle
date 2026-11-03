#!/usr/bin/env python3
"""Synthesise a music-box + pad bed for the Anaya series.

Openverse's API is gated now and nothing in the local library fits a warm kids
story (the only bed we had is space-suspense). A music box is physically just a
struck tine: a few inharmonic partials under a fast exponential decay. That is
cheap to synthesise and sounds like the real thing, which a sampled loop would
not necessarily do better.

Progression is vi-IV-I-V in C — wistful resolving to hopeful, which is the
episode's shape. One bar per 4s so chord changes land near the shot cuts.

    python3 make_bed.py <seconds> <out.wav>
"""
import sys
import numpy as np
import soundfile as sf

SR = 44100
# vi - IV - I - V, voiced high for the box, low for the pad
CHORDS = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]
BAR = 4.0


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def box(freq, dur, amp):
    """One struck tine: inharmonic partials, fast decay, slight detune."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    env = np.exp(-t * 3.1)
    y = np.zeros_like(t)
    for mult, lvl in ((1.0, 1.0), (2.01, 0.42), (3.03, 0.17), (5.07, 0.07)):
        y += lvl * np.sin(2 * np.pi * freq * mult * t)
    strike = np.exp(-t * 180) * 0.25 * np.random.default_rng(int(freq)).normal(size=t.size)
    return (y * env + strike * env) * amp


def pad(freqs, dur, amp):
    """Slow-attack sine stack, a fifth below the box, to glue the whole thing."""
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    env = np.minimum(1.0, t / 1.3) * np.minimum(1.0, (dur - t) / 1.3)
    y = sum(np.sin(2 * np.pi * f * t + i) * (0.6 ** i) for i, f in enumerate(freqs))
    vib = 1 + 0.0015 * np.sin(2 * np.pi * 0.21 * t)       # breathe, don't sit still
    return y * env * amp * vib


def main():
    total = float(sys.argv[1])
    out = sys.argv[2]
    buf = np.zeros(int(SR * (total + 2)), dtype=np.float64)
    rng = np.random.default_rng(7)

    bars = int(total / BAR) + 1
    for b in range(bars):
        ch = CHORDS[b % len(CHORDS)]
        t0 = b * BAR
        # pad holds the bar
        p = pad([midi(n - 12) for n in ch], BAR + 0.6, 0.085)
        i = int(t0 * SR)
        p = p[:max(0, buf.size - i)]          # last bar can overhang the buffer
        buf[i:i + p.size] += p
        # music box: a sparse arpeggio, not every eighth — space is what makes it tender
        for k, off in enumerate((0.0, 0.75, 1.5, 2.25, 3.0)):
            if rng.random() < 0.22:          # leave real gaps
                continue
            n = ch[k % 3] + (12 if k >= 3 else 0)
            v = box(midi(n), 1.9, 0.115 * (0.82 + 0.3 * rng.random()))
            j = int((t0 + off) * SR)
            v = v[:max(0, buf.size - j)]
            buf[j:j + v.size] += v

    buf = buf[:int(SR * total)]
    # gentle fade in/out so it never announces itself
    f = int(SR * 1.8)
    buf[:f] *= np.linspace(0, 1, f)
    buf[-f:] *= np.linspace(1, 0, f)
    buf *= 0.72 / max(1e-9, np.abs(buf).max())
    sf.write(out, np.column_stack([buf, buf]).astype(np.float32), SR)
    print(f"{out}  {total:.1f}s  {bars} bars")


if __name__ == "__main__":
    main()
