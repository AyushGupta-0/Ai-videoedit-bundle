# AI Video Edit Bundle

Make vertical 9:16 short-form videos — scripted, voiced, captioned, scored, rendered and
packaged for Instagram Reels, YouTube Shorts and Facebook — by describing what you want to
Claude Code and reviewing the result in a local dashboard.

Everything runs **on your machine**. No API keys, no per-video cost, no upload automation.

---

## Quick start

> **macOS with Apple Silicon.** Everything below is free. Budget ~20 minutes and ~12 GB of
> disk for the first install, most of which is the speech and image models.

```bash
git clone git@github.com:AyushGupta-0/Ai-videoedit-bundle.git
cd Ai-videoedit-bundle
./setup.sh
```

`setup.sh` installs ffmpeg, Node, Python 3.12, whisper.cpp with its models, four Python
environments and the dashboard's packages. It is safe to re-run, and it checks before it
installs anything.

```bash
./setup.sh --check     # verify an install, change nothing
```

Then start the review dashboard:

```bash
node Tools/dashboard/server.js        # → http://localhost:4321
```

---

## Making your first video

**1. Make a folder for your project and open Claude Code in it.**

```bash
mkdir ~/my-videos && cd ~/my-videos
claude
```

**2. Point it at this repo and tell it your idea.** The repo is the engine; your folder is
where your work lives. One sentence is enough to start:

> *"Use the pipeline in `/path/to/Ai-videoedit-bundle`. Make me a 60-second explainer on
> why the ocean is salty."*

or hand it a script you've already written:

> *"Here's my script — make it into a reel in the Ten Days style."*

**3. It will ask what it needs and then build.** You'll get a finished MP4 plus a dated
upload folder with a cover image and a paste-ready caption.

**4. Review it in the dashboard** at `localhost:4321` — scrub the filmstrip, trim shots,
and use **Brief the agent** on any shot to ask for a change in plain English.

**Read [`CLAUDE.md`](CLAUDE.md) before your first session.** It holds every decision already
settled and every bug already paid for — it will save you hours and a lot of tokens.

---

## What it actually does

```
your idea  →  script  →  TTS voice  →  force-aligned captions
           →  composition  →  render  →  upload package
```

| Stage | How |
|---|---|
| **Voice** | [Kokoro 82M](https://huggingface.co/hexgrad/Kokoro-82M) locally — English and Hindi, several voices, per-character pitch |
| **Captions** | Force-aligned to the real audio with whisper.cpp. Never estimated — estimation drifts badly against TTS prosody |
| **Visuals** | [HyperFrames](https://hyperframes.heygen.com): HTML + GSAP rendered to MP4 at 1080×1920. Either NASA stills with Ken Burns moves, or pure CSS vector scenes |
| **Score** | Procedurally synthesised bed plus CC0 effects, sidechained so the voice always wins |
| **Review** | Local dashboard, per-shot trimming, AI briefing per shot |
| **Output** | Dated per-platform folders with cover, caption and checklist |

## Two visual styles, both free

**Photoreal** — public-domain NASA imagery with slow camera moves. Good for science and
space explainers. See `Tools/lightspeed-v2/`.

**Flat vector** — characters, rooms and props drawn entirely in CSS and SVG, with a HUD,
rule cards and info panels. No image model, no generation time, no character-consistency
problem. Good for survival, mystery and situation stories. See `Tools/tendays-ep01/`.

> A third route — local image generation with Stable Diffusion — is wired up in
> `Tools/publish/gen_kids_art.py`, but read gotcha 16 in `CLAUDE.md` first. It fits a 16 GB
> machine only at SD1.5 size, and it cannot stage a scene with two characters in it.

## Layout

| Path | What's in it |
|---|---|
| `Tools/<project>/index.html` | One composition = one entire video |
| `Tools/dashboard/` | Review + edit UI, port 4321 |
| `Tools/publish/` | Voice, covers, packaging, mixing, cleanup |
| `Brand Kit/` | Brand rules, channel plan, account setup, bios |
| `Editing styles /` | Style guides and full series scripts |
| `Exports/` | Upload-ready folders, by channel and date |

⚠️ `Raw footage `, `Editing styles ` and `Approved videos ` **end with a space.** Quote them.

## Everyday commands

```bash
# review dashboard
node Tools/dashboard/server.js

# render a composition
cd Tools/<project> && npx hyperframes check && npx hyperframes render

# package for upload
python3 Tools/publish/make_package.py "Raw footage /video.mp4" \
        Tools/publish/meta_x.json --channel "Story 1" --cover <cover.png>

# reclaim disk once a video is live
python3 Tools/publish/cleanup.py --list
python3 Tools/publish/cleanup.py --slug <slug> --caches
```

## Publishing

Deliberately manual. Each `Exports/<channel>/<platform>/<date>/<slug>/` folder holds the
video, `cover.png`, a paste-ready `caption.txt` and a `_checklist.txt` of settings.

Post to **Instagram first** with *Share to Facebook* on, and Facebook fills itself.

## Not in this repo

Rendered MP4s, generated audio, model caches and downloaded reference clips are gitignored —
all large, all reproducible from what is here. The cropped 9:16 NASA plates in `assets/shots/`
**are** tracked, because re-fetching them from the NASA API is unreliable.

## Credits

Imagery: **NASA** (public domain) — SDO, Hubble, Apollo 17, ISS, JWST.
Sound effects: **CC0** via [Openverse](https://openverse.org).
Voices: **Kokoro 82M** (Apache-2.0).
