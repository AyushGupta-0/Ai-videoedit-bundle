# AI Video Studio — operating context

**Read this before doing anything.** It exists so a new session does not re-research,
re-install, or re-discover what is already settled. Everything below is decided and working.
If something here conflicts with what you'd do by default, this file wins.

---

## 1. What this repo makes

Vertical 9:16 short-form explainers, 50–60s, for Instagram Reels / YouTube Shorts / Facebook.

| Channel | Topic | Status |
|---|---|---|
| **What If** | Science / space "what if" explainers | English shipping; Hindi pending real VO |
| **Kids** | 3D kid tales + animal tales, alternating days | scripted, not yet produced |

---

## 2. Decisions already made — do not re-litigate

| Question | Answer | Why |
|---|---|---|
| Visual style | **Photoreal NASA stills + Ken Burns**, not vector | The owner's reference reels are photoreal space cinematography. Manim vector art was rejected on sight. |
| Animation engine | **HyperFrames** (HTML + GSAP → MP4) | Already wired, seek-safe, renders 1080x1920. |
| Manim | Installed, kept for *diagram-led* topics only | Owner liked a vector reference for future explainers. Not for space topics. |
| English voice | **Kokoro `am_michael`**, speed 0.97 | Chosen by the owner from a 5-voice test. |
| Hindi voice | **Kokoro `hm_omega`**, speed ~1.5 | Won a measured intelligibility test (see §6). Temporary — owner is recording their own. |
| English audio | **Voice only.** No bed, no SFX. | Owner found the score too loud. Removed by request. |
| Hindi audio | **Full score kept** — bed + SFX | Owner asked for suspense music on the Hindi cut. |
| Captions | EN: word-by-word, force-aligned. **HI: none** — English info cards + numbers only | Owner's spec. |
| Ending | Loop hook, no CTA, no watermark | Last line answers the first line on replay. |
| Publishing | **Manual.** Folders + caption files, no API | Owner uploads by hand. Never ask for credentials. |
| Format | **Vertical reels only, all three platforms** | YouTube gets the Short, not a landscape upload. Never build a 16:9 thumbnail — one 1080x1920 cover serves IG, Shorts and FB Reels. |

---

## 3. Layout

```
Raw footage /          finished renders the dashboard reads   (NOTE: trailing space in name)
Exports/               Instagram|YouTube|Facebook / <date> / <slug> / video + caption.txt
Brand Kit/             brand-kit.md, CHANNEL_AND_COST_PLAN.md
Editing styles /       style guides + VOICE_RECORDING_GUIDE_HI.md   (trailing space)
References/_source_temp/   downloaded reference reels + extracted frames
Tools/
  lightspeed-v2/       ENGLISH composition  (index.html = the whole video)
  lightspeed-hi/       HINDI composition
  manim-project/       Manim scenes (vector style, parked)
  dashboard/           review + edit UI, port 4321
  publish/             make_package.py, build_mix.sh, meta_*.json
```

⚠️ **`Raw footage `, `Editing styles `, `Approved videos ` all end with a space.** Quote them.
Do not "fix" this by creating a duplicate folder — that bug already happened once.

---

## 4. Toolchain (all installed — do not reinstall)

| Tool | Where | Notes |
|---|---|---|
| ffmpeg / ffprobe | `/opt/homebrew/bin` | |
| whisper.cpp | `~/Developer/whisper.cpp` | models: `ggml-base.en.bin` (EN), `ggml-base.bin` (multilingual) |
| Kokoro TTS | `~/Developer/tools-venv/kokoro` | EN + HI voices |
| Manim CE | `~/Developer/tools-venv/manim` | |
| yt-dlp | `~/Developer/tools-venv/ytdlp` | **symlinked over the broken brew one** |
| HyperFrames | `npx hyperframes` | run inside a composition dir |
| Claude CLI | `~/.local/bin/claude` | used headless by the dashboard |
| mflux | `~/Developer/tools-venv/mflux` | FLUX.2 klein 4B (Apache-2.0) — the image path that replaces SD1.5. **Reboot before first run** (peak 7.7–9.9 GB) |
| mlx-audio | `~/Developer/tools-venv/mlxaudio` | TTS A/B candidates (Chatterbox Turbo 4-bit, Ming-3.0-tts) and Qwen3 forced aligner |

---

## 5. The pipeline

```bash
# 1. script → VO
~/Developer/tools-venv/kokoro/bin/python  # KPipeline(lang_code='a'|'h')

# 2. word times come FREE from Kokoro — build_kids_vo.py writes them into
#    vo_timings.json as `words:[{w,s,e}]`. Verified within ~5-40 ms of acoustic
#    onsets. Do NOT re-transcribe synthesised VO with whisper (see §6 #21).
#    whisper is only for audio we did not synthesise (owner's recorded Hindi):
#    use ctc-forced-aligner with a permissive CTC model, never the NC MMS default.

# 3. audio mix (Hindi / anything wanting a score)
bash Tools/publish/build_mix.sh <vo.wav> <sfx_dir> <out.wav>

# 4. render
cd Tools/lightspeed-v2 && npx hyperframes check && npx hyperframes render

# 5. package for upload
python3 Tools/publish/make_package.py "Raw footage /x.mp4" Tools/publish/meta_x.json

# 6. after the owner confirms upload
python3 Tools/publish/cleanup.py --slug <slug>
```

Composition anatomy (`index.html`): `SHOTS[]` plates + Ken Burns · `TITLES[]` gold headline +
sub · `STATS[]` big number · `ALL[]` caption words · all times in seconds on one paused GSAP
timeline registered at `window.__timelines["<id>"]`.

---

## 6. Gotchas that already cost hours — do not rediscover

1. **Caption timing must be force-aligned, never estimated.** Character-weight estimation drifts
   badly against natural TTS prosody. Transcribe the VO, then difflib-match the known script.
2. **Whisper overruns the file.** Its last timestamp can exceed the real duration (60s vs 57.4s).
   **Rescale** the whole clock by `dur/max_end` — clamping piles the final words onto one frame.
3. **Kokoro truncates at 510 phonemes per chunk** and its splitter ignores the Devanagari danda
   (।). Split Hindi sentence-by-sentence yourself or it silently drops half the script.
4. **Kokoro Hindi runs slow** — needs `speed≈1.5` to match English pacing.
5. **`facebook/mms-tts-hin` is broken** — stutters ("up-up-up-up"). Do not use.
6. **`ai4bharat/IndicF5` is a gated repo** — needs the owner's HF login. It is also voice-cloning,
   so it needs a reference clip.
7. **Neither scene nor silence detection works on our own renders.** Scene detection finds
   *zero* cuts even at threshold 0.015 — every transition is a slow cross-dissolve over a
   drifting Ken Burns plate, so no two adjacent frames differ sharply. `silencedetect` then
   fails too on any cut with a music bed, because the audio never reaches the floor (0 hits
   at both -32dB and -22dB on the Hindi mix). The dashboard now reads `SHOTS[]` straight out
   of the matching `Tools/*/index.html`, matched by `data-duration` — exact and instant.
   Pixel/audio guessing is only for footage we did not render ourselves.
8. **macOS `._` AppleDouble files** on this exFAT SSD break every `readdir`/glob. Always filter
   `!name.startsWith(".")`. This bit three separate times.
9. **zsh eats `:c`** — `$D:color=` becomes garbage. Use `${D}:color=`.
10. **Voice clarity is spectral, not just level.** Ducking alone is not enough. The bed must be
    lowpassed ~2.4 kHz and the SFX bus needs dips at 1.6 / 2.6 kHz, or speech smears.
11. **HyperFrames `drop()` must not filter on `m in self.mobjects`** (Manim equivalent) — objects
    animated inside a temporary VGroup survive into later beats as ghosts.
12. **Writing an HTML file auto-opens it in the Browser pane** and can hijack the tab the
    dashboard was in. Open `localhost:4321` in a *new* tab.
13. **Titles must not repeat the narration word-for-word.** Make them add information.
14. **Port 3000 is taken** by an unrelated Next.js app on this machine. Dashboard uses **4321**.
15. **This Mac has 16GB of RAM and SDXL does not fit in it resident.** Running
    SDXL at 832x1216 with weights on the GPU wedged the machine badly enough to
    need a power cycle, and left 8GB stuck in swap afterwards. Rules:
    **never** `pipe.to("mps")` — use `enable_model_cpu_offload()`; cap at
    768x1152; `pipe.vae.enable_slicing()/enable_tiling()` (diffusers >=0.42 moved
    these off the pipe); and always launch via `Tools/publish/run_sdxl.sh`, which
    refuses to start above 2GB swap and kills the run if swap grows 2.5GB.
    **macOS only releases compressed memory on reboot** — after a wedge, reboot
    before retrying. Spotlight also indexes this SSD; turning that off helps.
16. **Local image models on this machine: what was actually tried.** Do not repeat these.
    - *SDXL* (`dreamshaper-xl`): best quality, but ~7GB of weights does not fit in 16GB.
      Resident it froze the Mac; with `enable_model_cpu_offload` it still thrashed at
      23k swapins/sec and the watchdog killed it. Needs a 32GB machine.
    - *SD1.5 `stablediffusionapi/disney-pixar-cartoon`*: fits easily (~2GB, ~60s/image) and
      nails the glossy Pixar look **for humans** — the Mira plate was excellent. It cannot
      render an elephant: across 4 seeds it produced a human child body with elephant ears
      and no trunk. It is a human-character checkpoint. Fine for human-only casts.
    - *SD1.5 `Lykon/dreamshaper-8`*: renders a real elephant but photoreal, not Pixar.
    - *SD1.5 `nitrosocke/mo-di-diffusion`* (trigger "modern disney style"): the best local
      result — genuinely stylised elephants with correct trunks. But it still cannot render
      a *specific action*: asked for "trunk raised, trumpeting" it returns an adult with its
      trunk down; asked for "sad, ears drooping" it returns two cheerful elephants; asked for
      "mango held in trunk" it puts the mango on the grass. Good for portraits, not for
      story beats. This is SD1.5's prompt-adherence ceiling, not a prompt-wording problem —
      three checkpoints and ~12 generations all hit it.
    - Raising CFG to 9-12 or putting the action before the subject makes SD1.5 *worse* —
      the subject dissolves. Subject first, CFG ~7.5.
    - "baby elephant in jungle" reliably pulls mother-and-calf compositions; a negative
      prompt does not suppress it.
    - *Two-character scenes*: SD1.5 cannot do them at all. A 10-shot sibling episode with a
      human-only cast (the thing the Pixar checkpoint is *best* at) returned a single child
      standing in a room for 9 of 10 shots — no second character, no specified emotion, no
      specified setting. Only "two kids walking holding hands" landed.
    Conclusion: SD1.5 locally is a **single-character portrait generator**. It cannot stage a
    scene. Any episode whose beats are interactions or actions needs a paid model.
    - *Stable Video Diffusion* (image-to-video, would have animated the existing plates):
      ~9.5GB of weights, does not fit. `model_cpu_offload` -> clean MPS OOM at the 10GB
      cap; `enable_sequential_cpu_offload` -> CPU RAM thrash at 21k swapins/sec. Both fail
      during model *loading*, so lowering resolution or frame count changes nothing.
      `Tools/publish/svd_animate.py` is written and correct — run it on a 32GB+ host.
      AnimateDiff (~4GB) is the only video model that would fit here, but it is
      text-to-video with subtle motion only; it cannot animate an existing plate faithfully.
    NOTE ON THE 2026-11 REFERENCE REELS: those are AI-generated *video* (Veo/Kling class),
    not stills — real character animation and moving cameras. No local still-image pipeline
    reaches that, however good the plates. Matching them means a paid text-to-video model
    (~$0.30-0.75 per 5-8s clip, so roughly $2-4 for a 25s reel).
17. **A locked seed is not enough to hold a character — say the hair colour every time.**
    EP02's shot e09 came back blonde mid-episode on the same seed that produced a
    black-haired girl in the other nine. Adding "with black hair" to the prompt fixed it
    on the first try. Put the one or two identity-critical features (hair colour, dress
    colour) into *every* prompt, not just the character bible constant.
18. **CLIP truncates prompts at 77 tokens and the warning is easy to miss.** A
    first pass ran 161 tokens, so the entire style suffix was silently dropped
    and the plates came out styleless. `gen_kids_art.py` now hard-fails via
    `check_len()`. Keep character bibles terse.
19. **`tl.call()` is a style preference here, NOT a live bug — I got this wrong once.**
    HyperFrames' GSAP adapter seeks with `n.totalTime(r, o)` where
    `o = t.suppressEvents === true`, i.e. **false by default**, and its runtime
    deliberately replays zero-duration callback boundaries on a cold frame grab.
    So `tl.call()` captions and clocks render correctly in our renders, and
    always did. If you test with `tl.seek(t, true)` in a plain browser you WILL
    see empty captions and a frozen clock — that is raw GSAP semantics, not the
    renderer's, and it is not evidence of a bug. I made exactly that mistake and
    briefly "fixed" seven compositions for nothing.
    What is still true: `tl.set()` is safer (it holds under plain GSAP with no
    reliance on undocumented adapter behaviour), it is cheaper per frame (ep02
    had ~61 zero-duration points, 29 of them the minute-by-minute clock), and
    the frame-presets do say "never tl.call()". The compositions now use
    `tl.set()` for that reason, not to fix broken output.
20. **Never set a repo-local `user.email`.** The global identity
    (`ayush5555.ag@gmail.com`) is the owner's real GitHub address. A repo-local override
    pointed at the Claude session address instead, and because GitHub attributes commits by
    *email* and not name, 31 commits rendered with a grey avatar, linked to no account, and
    earned the owner no contribution credit — while still reading "Ayush Gupta", which is
    exactly why it went unnoticed. `.git/config` has no user section now. Leave it that way.
21. **More than one Claude session works in this folder.** Check `git log origin/main` and
    `git status` before committing: stage your own files by name, never `git add -A`
    blindly, and never rewrite history or force-push without confirming the other session
    is stopped.
22. **Kokoro is not bit-deterministic, but it is timing-deterministic.** Re-synthesising an
    identical lines file changed the wav's md5 while every line boundary shifted by 0 ms
    across 19 lines. So: never assume a re-run reproduces the file, but a re-run never
    invalidates a composition synced to the previous timings. Also: **macOS has no `timeout`
    binary** — a command wrapped in it silently never runs. Use the watchdog pattern instead.
23. **whisper `-ml 1` word times are not alignment — they are token-count interpolation.**
    Measured median error **3.7 s** on a 14 s clip; the last word of a 78 s file landed at
    87.8 s. The whole whisper+difflib caption pass was built on this. `-dtw` fixes the overrun
    (150 ms late bias) but is **silently disabled unless you also pass `-nfa`** — flash-attn
    is on by default and the only sign is a log line and `t_dtw = -1` everywhere.
24. **Kokoro already emits exact word timestamps.** `KPipeline.Result.tokens[i].start_ts/end_ts`
    for English — exact by construction, the aligner is inside the synthesiser; verified within
    5–40 ms of acoustic onsets. Phrase-final `end_ts` includes the trailing pause, so end each
    word at the next word's start and clamp the last. Hindi tokens carry no times upstream
    (`join_timestamps` is gated to `'ab'`); split `output.pred_dur` on the phoneme spaces
    (600 samples/frame @ 24 kHz). `build_kids_vo.py` writes these as `words:[{w,s,e}]`.
25. **Image generation: FLUX.2 klein 4B via mflux is the SD1.5 replacement.** GenEval two-object
    0.92 vs SD1.5's 0.38; position 0.67 vs 0.04 — the exact staging failure in §16. Apache-2.0
    for DiT, Qwen3-4B encoder and VAE. Measured on a 16 GB M4: ~85 s/image at 1 MP with
    `--low-ram`, peak 7.7–9.9 GB. Start with `--model-path Runpod/FLUX.2-klein-4B-mflux-4bit`
    (4.6 GB; nothing bf16 ever loads). Never `--small-text-encoder` — the 4B LLM encoder IS
    what fixes staging. **Reboot before the first run.** Keep `HF_HOME` on the internal disk for
    this one. Runner-up Z-Image-Turbo: same adherence, 50% heavier, 2× slower.
26. **TTS licences that look open and are not** (weights, not code): F5-TTS base, OpenAudio
    S1-mini, Fish S2 Pro / Drama 3, OmniVoice, Breeze TTS 2, Voxtral TTS, Spark-TTS, rumik-oss,
    MMS-TTS-hin, Phonon 40M variants, Higgs TTS 3, XTTS-v2. Piper's `lessac` voice and everything
    fine-tuned from it are research-only. Clean and <4 GB on Mac: Kokoro (Apache), Chatterbox
    family (MIT, has a Hindi pack; use the MLX 4-bit builds — PyTorch on a 16 GB M2 swapped to
    20 GB), Qwen3-TTS (Apache; CustomVoice needs `--voice`, only 1.7B has `instruct`),
    Ming-3.0-tts-0.5B (MIT, #4 open leaderboard), VoxCPM2 (Apache, Hindi), Pocket TTS
    (CC-BY-4.0), Supertonic 3 (OpenRAIL-M). Kokoro is #10 on that board; swap only on a
    measured A/B.
27. **TTS A/B done 2026-11-04 — Kokoro stays. Do not re-run without a new candidate.**
    Same Day 2 line, measured (whisper transcribe-back = intelligibility; pyin f0 std = pitch
    movement; RMS p95/p20 = dynamic range):

    | voice | dur | intellig | f0 std | dyn dB | note |
    |---|---|---|---|---|---|
    | Kokoro am_michael 0.97 | 7.7s | 85% | 27.6 | 23.1 | baseline |
    | Chatterbox Turbo 4-bit, cloning Kokoro's clip | 6.3s | 85% | 30.0 | 22.9 | a wash; 18% faster |
    | Qwen3-TTS 0.6B "ryan" 8-bit | 9.8s | 81% | 46.1 | 25.9 | most movement, dropped a word, 27% slower |

    Chatterbox with NO reference clip defaults to a female voice (230 Hz) — always pass
    `--ref_audio`. Qwen3 CustomVoice refuses to load without `--voice`. Pitch std is a crude
    proxy; the owner's ear decides. Samples: scratchpad `ttsab/`. Both venvs stay installed.
28. **git on this exFAT SSD**: macOS writes `._` AppleDouble files *inside* `.git`, which corrupt
    pack indexes and refs. Before and after any git write, run:
    `find .git -name '._*' -delete`. Repo: `github.com/AyushGupta-0/Ai-videoedit-bundle` (ssh).
29. **GSAP drops an SVG `<g>`'s own `transform` attribute when you tween it.** Day 8's
    helicopter was `<g id="h1" transform="translate(560,760) scale(.78)">` with a `y` bob
    tweened on `#h1`; GSAP rebuilt the transform from its own cache and the translate/scale
    were gone — the aircraft rendered at 1:1 at the origin, off-screen, and both review
    passes showed an empty sky. Put the id on an **outer** `<g>` with no attribute and keep
    the translate/scale on an inner one (`#walker` / `#her` in Day 7 already did this).
    Same rule for `attr:{cy}` on circles vs `y` on groups: tween what has no transform.

---

## 7. Dashboard (port 4321)

`node Tools/dashboard/server.js` — review + edit UI.

- filmstrip under the player, shot cards with trim / keep / approve / notes
- **Brief the agent**: each shot spawns a real detached `claude -p` subagent with full shot
  context. It edits the composition, runs `check`, writes its answer back into the thread.
  Scoped via `--allowedTools` (Read/Edit/Write/Grep/Glob + `hyperframes check`). It never renders.
- **Export cut** → writes into `Exports/{Instagram,YouTube,Facebook}/<date>/<slug>/`

---

## 8. House style

- Hook in frame 0 — never fade up from black
- Gold `#f5b53d` headline + white subtitle, top; captions bottom with one gold keyword
- Readable text stays clear of the bottom caption band
- No "follow/subscribe" CTA — the loop does the work
- -14 LUFS, under 60s
- NASA imagery is public domain; **verify every image visually** — a "Blue Marble" search once
  returned two men holding an award

---

## 9. Token discipline for future sessions

- Trust this file. Do not re-run tool discovery, reference analysis, or voice selection.
- Reuse `Tools/lightspeed-v2/index.html` as the template for any new English video — change
  `SHOTS/TITLES/STATS/ALL` and the audio. The engine does not need rebuilding.
- Reuse the NASA plates in `Tools/lightspeed-v2/assets/shots/` before fetching new ones.
- Batch review notes through the dashboard rather than one-at-a-time round trips.
- Render is local and free; **iteration in chat is the expensive part.**
