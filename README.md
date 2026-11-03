# AI Video Edit Bundle

A working pipeline for producing vertical 9:16 short-form explainers (50–60s) for Instagram
Reels, YouTube Shorts and Facebook — scripted, voiced, scored, rendered and packaged for upload
from one repo.

**New session? Read [`CLAUDE.md`](CLAUDE.md) first.** It holds every decision already made and
every bug already paid for.

---

## What it does

```
script  →  TTS voice  →  force-aligned captions  →  composition  →  render  →  upload package
```

- **Visuals** — public-domain NASA imagery with cinematic Ken Burns moves, composed in
  [HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP rendered to MP4 at 1080×1920)
- **Voice** — [Kokoro 82M](https://huggingface.co/hexgrad/Kokoro-82M) locally, English and Hindi
- **Captions** — force-aligned to the real audio with whisper.cpp, not estimated
- **Score** — procedural ambient bed plus CC0 effects, mixed voice-first
- **Review** — a local dashboard with per-shot trimming and AI briefing
- **Output** — dated, per-platform folders with captions and hashtags ready to paste

## Layout

| Path | What's in it |
|---|---|
| `Tools/lightspeed-v2/` | English composition — `index.html` is the entire video |
| `Tools/lightspeed-hi/` | Hindi composition (no captions, English info cards) |
| `Tools/dashboard/` | Review + edit UI, port 4321 |
| `Tools/publish/` | Packaging, audio mixing, cleanup |
| `Tools/manim-project/` | Manim scenes — kept for diagram-led topics |
| `Brand Kit/` | Brand rules, channel and cost plan |
| `Editing styles /` | Style guides + Hindi voice recording guide |

## Running it

```bash
# review dashboard
node Tools/dashboard/server.js            # → http://localhost:4321

# render a composition
cd Tools/lightspeed-v2 && npx hyperframes check && npx hyperframes render

# build an audio mix (bed + SFX, ducked under the voice)
bash Tools/publish/build_mix.sh <vo.wav> <sfx_dir> <out.wav>

# package for upload
python3 Tools/publish/make_package.py "Raw footage /video.mp4" Tools/publish/meta_x.json

# reclaim space once a video is live
python3 Tools/publish/cleanup.py --list
python3 Tools/publish/cleanup.py --slug <slug> --caches
```

## Dashboard

Filmstrip under the player, one card per shot: trim in/out, keep or drop, approve or reject,
B-roll and SFX notes. **Brief the agent** on any shot spawns a detached headless Claude process
scoped to that shot — it edits the composition, runs the linter and writes its answer back into
the card. **Export cut** renders your selections into the per-platform upload folders.

## Not in this repo

Rendered MP4s, generated audio, NASA source originals, model caches and the downloaded reference
reels are all gitignored — they're large and every one of them is reproducible from what is here.
The cropped 9:16 plates in `assets/shots/` **are** tracked, because re-fetching them from the NASA
API is unreliable.

## Credits

Imagery: **NASA** (public domain) — SDO, Hubble, Apollo 17, ISS, JWST.
Sound effects: **CC0** via [Openverse](https://openverse.org).
Voices: **Kokoro 82M** (Apache-2.0).
