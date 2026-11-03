# Kids EP01 — "Chintu Can't Trumpet"

**Characters:** Chintu, a baby elephant · Mira, his human best friend
**Length target:** 62s · **Language:** English (Hindi version reuses the same timeline)
**Arc:** problem → funny failures → the viewer joins in → triumph → sharing

Why this shape: the interactive beat sits at 0:22, not at the end. A pre-schooler
who is asked to *do* something in the first half stays for the second half. Asking
at 0:55 is asking someone who has already left.

---

## Beat sheet

| # | t (s) | VO | Who | Shot |
|---|---|---|---|---|
| 1 | 0.0–3.4 | "Chintu the baby elephant had a *big* problem." | N | Chintu alone in a sunny jungle clearing, ears drooping, looking down |
| 2 | 3.4–6.6 | "He could not trumpet." | N | Close on Chintu's face, trunk curled sadly |
| 3 | 6.6–11.0 | "Every elephant in the jungle went — PAAA-POOO!" | N | Wide: three big elephants trumpeting, sound rings flying |
| 4 | 11.0–14.6 | "But Chintu went…" | N | Chintu puffs cheeks, eyes squeezed shut |
| 5 | 14.6–16.4 | *(squeak SFX)* "…pfft." | C | Tiny puff of air, one leaf flutters. Beat of silence. |
| 6 | 16.4–20.4 | "Then his best friend Mira had an idea!" | N | Mira runs in, arm up, grinning |
| 7 | 20.4–24.6 | "Take a big breath — like a big round balloon!" | M | Mira puffs her cheeks, demonstrating |
| 8 | 24.6–28.6 | "Can you help him? Take a breath with Chintu!" | N | **Interactive.** Chintu looks at camera, waiting |
| 9 | 28.6–32.4 | "Ready? One… two… three!" | M | Mira counting on fingers |
| 10 | 32.4–34.6 | *(wet raspberry SFX)* | C | Chintu's trunk flops. Mira laughs. |
| 11 | 34.6–38.4 | "Oh no! Try again — BIGGER!" | M | Mira cheering, arms wide |
| 12 | 38.4–42.4 | "One… two… THREE!" | M+N | Chintu inhales, body inflating, anticipation |
| 13 | 42.4–47.0 | "PAAAAA-POOOOO!" | C | **Payoff.** Huge trumpet, birds scatter, sound rings |
| 14 | 47.0–51.0 | "So loud, the mangoes fell right out of the tree!" | N | Mangoes raining down, both kids wide-eyed |
| 15 | 51.0–55.4 | "Chintu caught one… and gave it to Mira." | N | Chintu offering a mango with his trunk |
| 16 | 55.4–58.6 | "Because the best sound in the jungle…" | N | Two friends sitting together, warm late light |
| 17 | 58.6–62.0 | "…is sharing it with a friend." | N | Pull back, both eating mango, fireflies |

**N** = narrator (warm storyteller) · **C** = Chintu (pitched up, small) · **M** = Mira (bright, kid)

---

## Voice plan

Three voices, not one. A single flat narrator is what makes most kids content
forgettable; the back-and-forth is the entertainment.

| Role | Voice | Treatment |
|---|---|---|
| Narrator | `af_sarah` | natural. 93.6% intelligibility, 189 Hz — warm, clear, soothing |
| Mira | `af_bella` | +3 semitones — brighter, child-adjacent, still legible |
| Chintu | `af_heart` | +5 semitones, slight slow — small and round, comic |

Measured with `kids_voice_test.py`: `af_sarah`, `bf_emma` and `af_nicole` tied at
93.6%, and `af_sarah` was the brightest of the three at 189 Hz. `af_bella` scored
higher on pitch (206 Hz) but lower on intelligibility (87.5%), which is the right
trade for a side character and the wrong one for the narrator.

---

## SFX

| t | Cue |
|---|---|
| 9.0 | big elephant trumpet (distant, three overlapping) |
| 15.2 | tiny air squeak + single leaf rustle |
| 16.6 | footsteps running in + a bright "idea" chime |
| 33.0 | wet raspberry / trunk flop |
| 34.0 | Mira giggle |
| 42.8 | huge trumpet + bird flutter |
| 47.4 | mangoes thudding into grass (4-5, irregular) |
| 55.6 | warm resolve chime (the franchise sting) |

Bed: ukulele + marimba, major key, 8-bar loop. **-12 LUFS**, ducking 2:1 — lighter
than the explainer, per the kids style guide. The bed is part of the fun here.

---

## Captions

Karaoke sing-along, per the style guide: active word fills Sun Yellow `#FFD93D` and
scales to 1.15, completed words stay white, upcoming at 70%. Caption block sits
y≈1150–1550, not glued to the bottom. 10–12px ink outline `#2B2240` always — these
sit over bright moving backgrounds and will vanish without it.

Captions here stay **on** for English, unlike the explainer. Pre-readers track word
shape and rhythm; it is part of how the format teaches.
