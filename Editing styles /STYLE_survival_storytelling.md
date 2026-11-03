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
