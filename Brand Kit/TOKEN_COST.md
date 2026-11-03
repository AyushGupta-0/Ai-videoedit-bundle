# What this actually costs to run

Measured from this project's own session transcripts on 2026-11-04 — the API's own
accounting, not an estimate.

## The whole project to date

| | |
|---|---|
| Assistant turns | 7,544 |
| Output tokens | 8.5 M |
| Cache reads | **3.22 B** |
| Cache writes | 38.4 M |
| **Cost at Opus 5 rates** | **≈ $2,065** |

Opus 5 is $5/MTok in, $25/MTok out; cache reads bill at ~$0.50/MTok and writes at ~$6.25.
Without prompt caching the identical work would have cost about **$16,300**, so caching is
already saving ~87%.

That $2,065 covers everything: two light-speed explainers, two kids episodes, four Ten Days
episodes, *and* all the dead ends — SDXL, Stable Video Diffusion, three image checkpoints,
the kids-art attempts that never shipped.

## Per video

The number that matters is marginal cost, not average, because the first episode in a new
visual style pays for inventing it and every one after that doesn't.

| Scenario | ~75s episode | Per 10s | Per 60s |
|---|---|---|---|
| **First episode in a brand-new style** — design the look, build the composition, 2-3 render passes | **$80 – 150** | $11 – 20 | $65 – 120 |
| **Next episode on an existing pipeline** — new script, new panels, one render | **$30 – 50** | $4 – 7 | $25 – 40 |
| **Research / exploration** (no video produced) | $100 – 400 per session | — | — |

Ten Days EP01 landed in the first band. EP02–EP04, once `make_episode.py` existed, landed
in the second.

## The one lever that actually matters

**Cache reads are 97% of all token volume** — 3.22 B of them. They are cheap per token but
the volume is enormous, because every turn re-reads the whole conversation so far. Across
7,544 turns the average context was **~427 K tokens**.

That is the bill. Not the thinking, not the output — the accumulated context.

**So: one session per episode.** Start fresh, let `CLAUDE.md` carry the knowledge instead of
the scrollback, and finish. A session that stays near 60 K of context instead of drifting to
400 K costs roughly **1/7th** for the same work.

Concretely:

- `/clear` between episodes, or quit and relaunch
- Trust `CLAUDE.md` — it exists precisely so a new session doesn't re-derive anything
- Don't keep a research session and a production session in the same window
- Batch review notes instead of one-at-a-time round trips

## Cheaper models

Episode production on an established pipeline is mechanical: write lines, write panels,
render, check frames. It does not need the strongest model.

| Model | In / Out per MTok | vs Opus 5 |
|---|---|---|
| Opus 5 | $5 / $25 | — |
| Sonnet 5 | $2 / $10 | **~2.5× cheaper** |
| Haiku 4.5 | $1 / $5 | ~5× cheaper |

Use Opus for the things that are genuinely hard — designing a new visual style, writing the
series, debugging a render. Switch to Sonnet for Days 5–10 of a series whose engine already
works. That plus short sessions is the difference between ~$40 and well under $10 an episode.

## Is it worth it?

At **$30–50 per 75-second episode** on an established pipeline, a 10-part series costs
roughly **$300–500** end to end. Compare that against the alternatives before deciding:

- Paid text-to-video (Veo/Kling class) runs **$2–4 per reel** in model cost — far cheaper
  per video, but it only renders footage. It does not write the series, build the
  composition, sync captions, mix audio, or package for upload.
- A freelance editor for ten 75-second animated explainers is not a $400 job.

The honest read: the pipeline is expensive while you are *building* it and cheap once it
exists. The four Ten Days episodes cost far less than the two weeks of research that
preceded them, and Days 5–10 will cost less again.


## On installing skills and plugins

315 plugins are available in the official marketplace. **Do not install them all.** Every
installed plugin's description loads into context on every session, so it is bought once and
paid for on every turn forever.

Measured with `claude plugin details`:

| Plugin | Always-on cost |
|---|---|
| `frontend-design` | ~80 tok |
| `runway-api` | ~745 tok (+ an MCP server) |

That averages ~412 tokens each. All 315 would add **~130 K tokens to every turn** — about
0.98 B extra cache-read tokens over this project's 7,544 turns, or **~$490 spent on nothing**.

Installed deliberately:

| | Why |
|---|---|
| `hyperframes`, `hyperframes-cli`, `hyperframes-registry` | the render engine |
| `media-use`, `real-sfx`, `video-use` | media sourcing, sound design, editing |
| `frontend-design` | compositions are CSS/HTML; this lifts visual quality directly |
| `runway-api` | only earns its 745 tokens if the paid text-to-video route gets used — remove it with `claude plugin disable runway-api` otherwise |

Check any plugin's real cost before adding it:

```bash
claude plugin details <name>
```
