# Style Guide — 3D Kids Rhymes & Stories

Category 2. 3D animal/character rhymes and short stories, 9:16, 60–120s. Dual-language (Hindi + English).

## Visual Language

- **Camera:** Mostly static or gentle handheld-sim bounce, locked to the beat of the rhyme. Push-ins reserved for "surprise" or "reveal" moments only.
- **Character motion:** Full squash-and-stretch — anticipation before every jump/action (2–3 frames), overshoot on landing. Nothing moves at constant velocity; everything breathes.
- **Energy:** High-amplitude bounce on a musical pulse (every beat or every other beat gets a camera/character micro-bounce of 2–4% scale).
- **Subtitles:** Large sing-along captions, karaoke-style highlight sweeping word-to-word in sync with vocal track. Minimum caption height: 8% of frame height (bigger than the explainer style — this is for pre-readers tracking shape, not reading).
- **Cut pacing:** New beat/scene every 3–5s during verses, faster (1.5–2.5s) during the chorus/sing-along hook.

## Color Palettes

High-saturation primaries. No muted/matte materials here — glossy, toy-like finishes.

| Role | Hex | Use |
|---|---|---|
| Sky / background | `#6FC7F0` | primary background |
| Grass / ground | `#6ECB63` | ground plane |
| Sun / highlight yellow | `#FFD93D` | key light accents, stars, sparkle FX |
| Character red | `#FF5C5C` | primary character/prop accent |
| Character purple | `#A35CFF` | secondary character/prop accent |
| White | `#FFFFFF` | caption fill, cloud shapes, teeth/eyes |
| Outline ink | `#2B2240` | character outlines, caption stroke |

Rule: every scene uses **sky + ground + exactly 2 character accents** — don't let more than 2 saturated character colors compete in one frame; everything else (sun, sparkle, outline) is a fixed utility color.

## Typography

- **Family:** Rounded/bubble display font (e.g. Fredoka, Baloo 2). Weight 700+ everywhere — no light weights, ever.
- **Caption stroke:** 10–12px ink outline (`#2B2240`) + soft drop shadow, always — captions must read instantly against bright moving backgrounds.
- **Safe zones (1080×1920):** same as explainer (top <250px avoid, bottom >1700px avoid, 72px side margins), but caption block itself should sit in the lower-middle third (y≈1150–1550) where a child's eye naturally rests mid-screen, not glued to the very bottom edge.
- **Sing-along highlight:** active word fills with Sun Yellow (`#FFD93D`) and scales 1.0→1.15; completed words stay white; upcoming words at 70% opacity.

## Dual-Language Configuration

**Hindi (हिन्दी):**
- Playful regional idioms over textbook-formal phrasing. Warm, rhythmic cadence — favor repetition and alliteration the way Hindi nursery rhymes traditionally do (e.g. "चिंटू हाथी, मोटू हाथी" rhythm patterns).
- Friendly, exaggerated animal vocalizations between lines (not full words — sound-acted, e.g. a trumpet "paaa-poo" before "हाथी ने आवाज़ लगाई").
- VO delivery: warm aunty/elder-sibling storyteller tone, not announcer-flat.

**English:**
- Clear preschool diction — short words, phonics-friendly (CVC patterns where possible: "cat," "hop," "big").
- Upbeat sing-along delivery, slightly exaggerated vowel sounds so lyrics are easy to mouth along to.
- Avoid idioms that don't translate in spirit to the Hindi version — keep both versions emotionally equivalent even when the exact words differ.

Each topic ships as **two separate exports** (not subtitled-only) — full native VO track per language, same visual timeline, re-timed captions per language's natural cadence.

## Audio & SFX

- **Target loudness:** **-12 LUFS** integrated (louder/punchier than explainer content — this plays on phone speakers in noisy rooms).
- **Bed:** Upbeat, major-key, simple instrumentation (ukulele/marimba/glockenspiel led). Looping 8 or 16-bar structure synced to scene changes.
- **Cartoon SFX:** Boings (character jumps), pops (object appear/disappear), joyful chimes (correct-answer / reward beats), animal vocalizations (character-specific, consistent per character across episodes) — sourced via **Real SFX** (project library first) with **Openverse** (CC0) as fallback when no local match exists.
- **Auto-ducking:** lighter touch than explainer style — 2:1 ratio, since the bed is part of the "fun" and shouldn't disappear under VO the way an explainer's ambient pad does.
- **Sparkle/reward stinger:** a fixed 400ms chime cue reused across all kids episodes — builds franchise recognition for returning viewers (same as a theme sting).

## Content Calendar — Top 10 Trending Kids & Animal Curiosity Topics

1. **The Little Elephant Who Forgot How to Trumpet** (Chintu Haathi / चिंटू हाथी) — interactive sound-guessing tale.
2. **Why Do Chameleons Change Color?** — a forest party teaching colors and emotions.
3. **The Sleepy Owl Who Wanted to See the Sun** — contrast between day animals and night animals.
4. **The Five Busy Monkeys' Jungle Bakery** — rhythmic counting rhyme mixing fruit colors and sounds.
5. **Where Does the Rain Go?** — Droppy the Raindrop's water cycle slide through rivers and clouds.
6. **The Baby Dinosaur's First Roar** — confidence and animal sounds rhyme.
7. **The Underwater Turtle Express** — counting glowing coral and playful sea creatures.
8. **Sheru the Lion's Lost Crown** — a gentle jungle story about kindness over might.
9. **The Caterpillar Who Built a Rainbow Cocoon** — colorful metamorphosis dance and song.
10. **The Star That Fell Into a Pond** — a cozy bedtime rhyme teaching curiosity and helping friends.

**Status key:** 🟡 scripted · 🟠 in production · 🟢 rendered · ✅ approved & exported

| # | Topic | Hindi | English | Status |
|---|---|---|---|---|
| 1 | The Little Elephant Who Forgot How to Trumpet | 🟠 | 🟠 | in production (Phase 4) |
| 2–10 | — | — | — | not started |
