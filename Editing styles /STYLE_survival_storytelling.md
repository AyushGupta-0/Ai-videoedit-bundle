# Style — survival / situation storytelling

Decoded from two reference reels, 2026-11-03.

## REF A — "Noor / Antarctica" (95s, English, 1080x1920)

**Narration template.** This is the whole format, and it is reusable verbatim:

| Beat | Reference line |
|---|---|
| Conditional hook + promise of a mistake | "If the zombie apocalypse catches you at a research station in Antarctica, consider yourself lucky — it's the safest place on Earth. **But only if you don't make one fatal mistake.**" |
| Named subject, hard specifics | "Meet Noor. She's 27. The station's weather scientist, **900 miles** from the nearest coast." |
| Routine, so the break lands | "Every night the same routine: launch the balloon, log the temperature, radio in, all clear." |
| Inciting incident, timestamped | "**10:15.** The satellite phone buzzed." |
| Reasoning shown, not just the decision | "Her first thought was to get on that plane. **But she stopped.** What if the plane is coming from an infected city?" |
| Numbers as proof | "a year of frozen food, **10,000 gallons** of fuel" |
| Checklist cadence | "Shelter, check. Food, check. Cold, check." |
| Cliffhanger, mid-thought | "It seemed like she'd thought of everything. On paper. **But Noor forgot one thing.**" |
| Comment bait end card | "WHAT DID SHE FORGET? — tell me in the comments" |

**Visual language.** Low-poly 3D, simple shapes, one character in a red parka with a
near-blank face. The *story* is told by the overlays, not by acting:

- Persistent clock, top-left: `9:58 PM` → `10:15 PM` → `11:58 PM`, plus a `DAY 1` tag
- Info cards that appear over the plate: `900 MILES TO THE NEAREST COAST`,
  `7 HOURS IN THE AIR`, `ZOMBIES CAN'T MOVE AT -60°C`, `10,000 GALLONS OF FUEL`
- Isolated prop shots: a thermometer reading **-61°C**, a fuel drum, a satellite phone
- A live checklist UI: `NOOR'S SURVIVAL PLAN — Shelter ✓ Food ✓ Cold ✓`
- Captions bottom, white, **one word in red** per line

## REF B — "Train / Berth 32" (49s, Hindi, 720x1280)

Flat **2D vector**. Silhouettes, no faces at all. Near-black palette with a single warm
light source (a phone torch). Text is the whole design: huge caps, one word red
(`MAT KHOLNA`). One shot is a literal document — a `COACH S7 PASSENGER CHART` table
with berth 32 blank. Ends on a title card: `PART 2 — DARWAAZA`, "Would you open the
door? Follow for Part 2."

## Why this matters for us

Both are **within reach of the free pipeline**, unlike the Pixar kids reels:

1. **The drama lives in overlays and narration, not in character acting.** HUD clocks,
   info cards, checklists, document props — all of that is HTML, CSS and GSAP. We render
   it perfectly and for free. It is the thing HyperFrames is actually best at.
2. **REF B needs no image model at all.** Silhouettes, flat colour, one light source:
   pure SVG/CSS. No SD1.5, no plate generation, no character-consistency problem.
3. **REF A's plates are environments and props** — a station on stilts, an aurora, an
   ocean, a fuel drum. SD1.5 renders those far better than it renders people acting,
   which was the wall we hit on the kids series.
4. The one character wears a parka and barely emotes, so consistency is easy.

**Production rule:** write every beat so the *information* carries it. If a shot needs a
character to perform an emotion, rewrite it as a prop, a number, or a document.

---

# Evidence-backed writing rules (researched 2026-11-04)

Tiered: **[A]** hard data · **[B]** platform/practitioner · **[C]** craft consensus.

## Stats that are FABRICATED — never cite or design around these
"65% leave in 3 seconds" (no origin) · "85% of video watched muted" (two publishers'
2016 self-report, never confirmed by Meta; the real figure is **69% public / 25%
private**) · "8-second attention span" (traces to a deck citing a website) ·
karaoke-caption retention lifts (vendor marketing — **no comparative A/B data on
word-by-word vs block captions exists**).

Two corrections that change how we think:
- **The Zeigarnik effect does not replicate.** Meta-analysis of 38 studies: recall
  ratio **0.99** with Zeigarnik's own 1927 data excluded. What survives is
  **Ovsiankina resumption, ~67% vs a 50% baseline** — behavioural, not memory. So a
  cliffhanger buys a return *only if the next episode is findable*. The day number
  on frame and consistent titling are doing the work people credit to the cliff.
- **Cliffhangers are free, not magic.** Two controlled studies (N=133 with cortisol
  and electrodermal; N≈500) found higher arousal but **no** lift in enjoyment or
  intention to continue. Don't buy cliff intensity at the cost of episode quality.

## The rules

1. **[A] Write LOSS, not FEAR.** *Nature Human Behaviour* 2023: 12,448 RCTs, 53,699
   headlines, 370M impressions. Per extra word: negative **+2.3% CTR**, positive
   **−1.0%**. By emotion — **sadness raises clicks (p<.001); fear LOWERS them
   (β=−0.007); anger does nothing.** Our hooks are fear-coded ("outbreak",
   "no windows"). This is the biggest available rewrite.
   - ✗ "A car park is the safest place to sleep in an outbreak."
   - ✓ "The car park kept you alive one night. You lost the twelfth car."
2. **[A] Make the gap COUNTABLE, never atmospheric.** Loewenstein 1994: curiosity
   needs a *specific bounded* gap; total ignorance produces none. "Eleven cars.
   Yours is the twelfth." → "Thirteen." Never "something was wrong."
3. **[A] Use "someone else knows and won't say."** Loewenstein's strongest trigger
   and we have zero of them. *"The voice used your name before you said it."*
4. **[A] Hook must resolve under ~2.5s.** Measured: EP01 **5.55s**, EP02 3.30s,
   EP03 2.83s, EP04 2.23s. EP01 is the series front door and the slowest by 2.5x.
5. **[A] One cliff at 0–8s; there is no mid-video cliff.** Panel study of 464M
   views: median swipe at **6s**, 33% gone by 3s — then the curve decays *smoothly*,
   and the 8–15s bucket is larger than the 3–5s one. Past ~8s people get stickier.
6. **[A] 60–90s is the favoured band, not a penalty.** TikTok (1.1M videos): 60s+
   gets **+43% reach, +64% watch time** vs 30–60s. Reels peak at 45–60s. Shorts with
   AVD over 50s averaged 4.1M views. Stop trimming for completion rate — the
   recommender already debiases it for length.
7. **[A] Vary shot length in correlated runs.** Cutting et al. 2010 (150 films):
   shot-length sequences evolved toward a **1/f spectrum** matching human attention.
   Runs of short, runs of long — never metronomic. Our flat stretches are the
   rule blocks (EP01 6.0/3.9/5.0, EP02 3.2/3.6/3.5).
8. **[A] ~30% narration-speed headroom exists.** We run **130 wpm**; comprehension
   holds to ~275 wpm. The real ceiling is the *subtitle* limit: BBC 160–180 wpm
   (16–18 cps), Netflix 20 cps. **Target ~170 wpm ≈ Kokoro speed 1.25.** Worth an
   A/B on one episode.
9. **[B] End abruptly, mid-thought.** We land the question at **95%** with ~0.7s of
   tail. Already right — keep it.
10. **[C] Plant the tell by 0:15; it must be a RECALL, not new information.**
    EP02 is textbook (rule 3 at 31.8s → "twelfth" at 35.9s → "thirteen" at 69.6s).
    **EP03 cheats** — its tell introduces brand-new information at 57.2s. Fix by
    moving "grid seven is dead" into the radio line at ~20s.
11. **[C] Recap gets ONE line.** The day number supplies premise, position and the
    promise of an ending in zero narration seconds. Padding the opening with
    re-established context taxes the most loyal viewer.
12. **Series architecture.** Day 1's cliff should be the strongest (commitment
    point). Day 5 needs a *reversal*, not a bigger version of the same problem —
    days 4–7 are where countdown formats die. Honour the declared ten.

## Second person: real but small
Meta-analysis of 66 studies: narrative comprehension **r = 0.15**, persuasion
r = 0.10, and dyadic communication **r = −0.15** (reactance — a stranger using
assertive "you" backfires). Hypothetical "you" ("you count the cars again") is the
safe register and is what we use. **No study measures second vs third person against
video retention** — our switch is well-motivated, not proven.

## Captions
- **Upload an SRT alongside burned-in captions.** The one clean causal study (334
  videos) measured **+7.32% views** through *search indexing* — burned-in pixels are
  not indexed. Modest, real, free.
- **Our no-watermark rule is now data-backed:** captions gave +8% ad recall, but
  **logo + captions on mobile measured −12% ad memory.**
- Safe zone 1080x1920: reserve **~670px at the bottom**, ~250px top, 65px sides.

## Duration estimation
Use phonemes, never words. Fitted on 130 real lines here:
`dur = 0.0671 * phonemes + 0.699` → R²=0.956, MAE 0.155s, episode error ±0.7%.
The old `WPS = 2.6` under-estimated **every** line by 0.57s.
`KPipeline(lang_code='a', model=False)` runs misaki's g2p with no weights and no
network — it is what Kokoro will actually say, so it beats any external phonemiser.
