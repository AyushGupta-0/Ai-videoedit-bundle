# Style Guide — Sleek & Cozy 3D Explainers

Category 1. Science/geography curiosity shorts, 9:16, 30–75s.

## Visual Language

- **Camera:** Isometric or 3/4 macro pans. Slow, continuous drift — never a hard cut on camera move mid-sentence. Occasional slow push-in on the "reveal" beat.
- **Material language:** Matte clay / soft-plastic shaders, no hard specular highlights. Subtle ambient occlusion in crevices. Avoid photoreal PBR — stay stylized.
- **Motion curves:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo family) for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for looping/idle motion. Nothing linear.
- **Hook window:** 0–1.5s must contain the core visual payoff or question on screen — no logo bumper, no slow fade-in.
- **Captions:** Kinetic, word-by-word reveal mapped to Whisper word-level timestamps (±1 frame tolerance). One line visible at a time, 3–6 words. Emphasis word scales 1.0→1.12 on its own timestamp.
- **Cut pacing:** New composition beat every 2.5–4s. Faster (1.5–2s) only in the cold-open hook.

## Color Palettes

Two interchangeable palettes — pick per-topic based on subject temperature (warm earth topics vs. cold/space/deep topics).

**Warm / Earth (default):**
| Role | Hex | Use |
|---|---|---|
| Base clay | `#E8D9C5` | ground / primary surfaces |
| Deep clay shadow | `#8C6E54` | AO, recesses |
| Accent terracotta | `#C8694B` | highlight objects, call-to-attention shapes |
| Navy ink | `#1F2A3C` | text, line art, background void |
| Warm neutral bg | `#F4EEE4` | card backgrounds, caption plates |

**Cool / Deep (space, ocean, core topics):**
| Role | Hex | Use |
|---|---|---|
| Base slate | `#D7DEE6` | primary surfaces |
| Deep navy | `#121826` | background void |
| Accent cyan | `#5AC8E0` | energy lines, data viz |
| Accent amber | `#E8A33D` | single warm pop accent, used sparingly |
| Warm neutral bg | `#F4EEE4` | caption plates (stays consistent across both palettes) |

Rule: **one accent color does the pointing** — never two saturated accents competing in the same frame.

## Typography

- **Family:** Rounded geometric sans (e.g. Cabinet Grotesk / General Sans / Poppins as fallback). Headline weight 700–800, body/captions weight 600.
- **Caption stroke:** 6–8px navy-ink stroke behind warm-neutral fill when captions sit over busy 3D backgrounds; drop shadow `0 2px 8px rgba(0,0,0,0.25)` as the lighter alternative over flat cards.
- **Safe zones (1080×1920):**
  - Top: keep primary text below **y=250px** (UI/profile icons overlay zone)
  - Bottom: keep primary text above **y=1700px** (caption bar / engagement buttons zone)
  - Sides: 72px margin minimum
- **Hierarchy:** One headline size (title cards only), one caption size (kinetic captions), one micro-label size (data annotations). Never introduce a fourth size.

## Sound Design

- **Target loudness:** **-14 LUFS** integrated, true peak ≤ -1 dBTP.
- **Bed:** Warm ambient pad, low-mid heavy, sidechained to voice (duck -6dB on VO presence, 80ms attack / 250ms release).
- **Auto-ducking ratio:** 4:1 on music bus when VO is active; SFX bus ducks music -3dB only (SFX stays punchy).
- **Transition sweeps:** 300–500ms whoosh, pitch rising on push-in, falling on push-out. Source from Earshot (`earshot describe` to match target spectral profile) or Real SFX library — never a synthesized/generic whoosh if a real recording matches within tolerance.
- **Tactile layer:** Soft UI clicks (26–40ms transients) on every caption word-group change — these should sit **under** the music bed, barely conscious, not foregrounded.
- **Layering order (back to front):** ambient pad → data/energy drone (cool palette only) → tactile clicks → whoosh transitions → VO (always on top, never ducked by SFX).

## Content Calendar — Top 10 High-Curiosity Science & Geography Topics

1. **The Kola Superdeep Borehole** — what we actually found 12 km under the Earth.
2. **The Zone of Silence (Mapimí)** — where radio signals die and meteorites gather.
3. **Why Time Moves Slower on Mount Everest** — gravitational time dilation visualized with 3D curves.
4. **The Boiling River of the Amazon** — geothermal anomaly without an active volcano.
5. **The Deep-Sea Mariana Trench Anomalies** — extreme pressure vs. acoustic travel in water.
6. **Point Nemo** — the oceanic pole of inaccessibility and spacecraft graveyard.
7. **The Richat Structure (Eye of the Sahara)** — concentric geological dome vs. myth.
8. **Earth's Core Rotational Shift** — 3D seismic tomography made intuitive.
9. **The Mystery of Lake Natron** — the alkaline red lake that calcifies organic matter.
10. **The Great Attractor** — the gravitational anomaly pulling our galactic supercluster.

**Status key:** 🟡 scripted · 🟠 in production · 🟢 rendered · ✅ approved & exported

| # | Topic | Status |
|---|---|---|
| 1 | Kola Superdeep Borehole | 🟠 in production (Phase 4) |
| 2–10 | — | not started |
