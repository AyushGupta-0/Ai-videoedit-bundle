# Brand Kit

Source: frame-by-frame analysis (`ffmpeg fps=1`) of 6 reference reels, see `References/_source_temp/` (temporary — not redistributed, local analysis only). Full source list and raw observations at the bottom.

## Reference Findings (honest read, not assumptions)

- **"Core Aesthetics" refs** turned out to be meta/tutorial content about AI video tools, not direct 3D-explainer footage. Still valuable for typography and motion-graphic conventions (see below).
- **Explainer ref** matches the brief closely: dark-void backgrounds, neon accent lighting, and — notably — a **recurring cartoon host character** who reacts to the diagram on screen. Recommend adopting this as a franchise device (same host character across all explainer episodes).
- **Kids refs split into two distinct looks**, not one:
  - Glossy toy-cartoon (matches brief) — bright primaries, bubbly characters, rainbow environments.
  - Photoreal/hyperreal "cute AI baby" — soft golden lighting, realistic skin, earthy desaturated tones.
  - **Decision:** defaulting to the cartoon look as primary (matches your written spec). Flag if you'd rather standardize on photoreal, or run both as parallel sub-brands.

---

## Color Palettes

### Explainer (Category 1)

**Cool / Deep (primary — matches observed ref):**
| Role | Hex | Use |
|---|---|---|
| Void background | `#0B0710` | background, deep space |
| Neon purple | `#8A5CF0` | energy lines, primary accent |
| Light purple glow | `#C9A6FF` | highlights, bloom |
| Amber glow | `#F2A33D` | secondary accent, warm contrast pop |
| White | `#F5F0FA` | headline text |

**Warm / Earth (alternate, for grounded topics — boiling river, Richat Structure, Lake Natron):**
| Role | Hex | Use |
|---|---|---|
| Base clay | `#E8D9C5` | ground / primary surfaces |
| Deep clay shadow | `#8C6E54` | AO, recesses |
| Accent terracotta | `#C8694B` | highlight objects |
| Navy ink | `#1F2A3C` | text, line art |

**Utility (from tutorial-meta refs, use across both):**
| Role | Hex | Use |
|---|---|---|
| UI navy | `#0A0E16` | caption plates, lower-third bars |
| Gold accent | `#E8C468` | counters, data callouts, "did you know" numerals |
| Alert red | `#FF3B3B` | use sparingly — single "wait, what?" emphasis moment per video only |

### Kids (Category 2) — cartoon primary

| Role | Hex | Use |
|---|---|---|
| Sky / background | `#6FC7F0` | primary background |
| Grass / ground | `#6ECB63` | ground plane |
| Sun / highlight yellow | `#FFD93D` | key light accents, sparkle FX |
| Character red | `#FF5C5C` | primary character/prop accent |
| Character purple | `#A35CFF` | secondary character/prop accent |
| White | `#FFFFFF` | caption fill |
| Outline ink | `#2B2240` | character outlines, caption stroke |

Rule: one accent color does the pointing per scene. Never two saturated accents competing in frame.

---

## Typography

- **Explainer:** Bold rounded geometric sans for headlines (weight 700-800); small-caps/monospace for data labels and counters (matches the "FILMED / 0s" counter-box convention seen in refs). Caption stroke 6-8px UI-navy behind white/warm-neutral fill.
- **Kids:** Bubble/rounded display font, weight 700+ only. Multi-color word-by-word fill (red/blue/purple/yellow cycling per word) matches the observed "I take a shower" title treatment — adopt this as the kids title-card convention specifically (not for body captions, which stay single-color sing-along highlight per the style guide).
- **Safe zones (1080×1920), both categories:** top <250px avoid (profile/UI icons), bottom >1700px avoid (engagement buttons), 72px side margins.

## Motion Conventions (from refs)

- **Highlight-box + jump-cut motif:** a red-bordered box snaps onto the subject of interest with a small "+Npx" or numeric readout label — useful as a recurring "zoom to detail" beat in explainers.
- **Host character reactions:** explainer host character should react (point, raise eyebrows, lean in) at every major reveal beat, not just stand idle — this is the single biggest "watchability" signal from the reference set.
- **Title cards open cold** — no logo bumper before the hook, confirmed across all 6 refs without exception.

## Sound Design Specs

- **Explainer target:** -14 LUFS integrated, true peak ≤ -1 dBTP. Warm ambient pad (or synth drone for cool palette topics) sidechained to VO, 4:1 duck ratio.
- **Kids target:** -12 LUFS integrated. Upbeat major-key bed, 2:1 duck ratio (lighter touch — the bed is part of the fun).
- **Transitions:** source via Earshot (`earshot describe` spectral matching) and Real SFX library first; Openverse (CC0) as fallback only when no local match scores above threshold.
- Full ducking/layering detail lives in the two style guides — see `Editing styles/style_explainer_3d.md` and `Editing styles/style_kids_rhymes_animation.md`.

---

## Source Reference Log

| Local ref | Category | Real content (as observed) |
|---|---|---|
| core1 | Core aesthetics | AI video-editing tutorial, frame-review UI |
| core2 | Core aesthetics | AI video-editing tutorial, "I don't film/draw" hook |
| explainer1 | Explainer | not accessible (private/restricted, skipped) |
| explainer2 | Explainer | sci-fi diagram explainer w/ cartoon host character |
| kids1 | Kids | photoreal/hyperreal toddler scene (market) |
| kids2 | Kids | glossy 3D toy-cartoon (bath time) — primary style match |
| kids3 | Kids | photoreal/hyperreal toddler scene (jungle) |

Raw downloaded clips and extracted frames are in `References/_source_temp/` for internal analysis only — not used, reproduced, or redistributed in any output. Safe to delete once this brand kit is approved.
