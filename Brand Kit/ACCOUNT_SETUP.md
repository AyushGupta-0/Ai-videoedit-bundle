# Account setup — @1min.thinker

Handle to claim everywhere: **`1min.thinker`** (YouTube uses `@1min.thinker`; if the dot is
rejected, fall back to `@1minthinker` and keep the display name "1min.thinker").

Assets are in `Brand Kit/identity/`:

| File | Use |
|---|---|
| `avatar_1024.png` | master — upload this anywhere that accepts it |
| `avatar_400.png` | Facebook Page picture |
| `avatar_180.png` | Instagram (it downsizes to 110px anyway) |
| `avatar_98.png` | preview of how it reads tiny |
| `youtube_banner_2560x1440.png` | YouTube channel banner |
| `fb_page_cover_1640x856.png` | Facebook Page cover |

The mark is built to survive being shown at 40px — a gold ring, a bold "1", one gold body on the
ring. No small text, because small text disappears at profile size.

---

## Instagram — you already have the handle

1. **Settings → Account type and tools → Switch to professional account**
2. Pick **Creator** (not Business). Creator gives you the full audio library and better
   follower analytics; Business is for shops.
3. Category: **Video Creator** or **Science Website**
4. Profile picture: `avatar_1024.png`
5. Bio — keep it one line plus a promise:

```
One big idea, explained in 60 seconds.
Space · physics · what-ifs
New drop every week
```

6. **Settings → Creator tools and controls → Sharing to other apps → Facebook → ON.**
   This is the whole Facebook strategy. Every Reel crossposts automatically.

---

## Facebook — you need a *Page*, not a profile

Your personal profile can't be a channel. A Page can, and only a Page can receive Instagram
crossposts.

1. On facebook.com, left sidebar → **Pages** → **Create new Page**
   (the screenshot you sent shows Pages in your sidebar already)
2. **Page name:** `1min.thinker`
3. **Category:** `Science, Technology & Engineering` → or `Video Creator`
4. **Bio:** same one-liner as Instagram
5. Create → then **Profile picture:** `avatar_400.png`,
   **Cover photo:** `fb_page_cover_1640x856.png`
6. Page settings → **Username** → set `@1min.thinker` so the URL is
   `facebook.com/1min.thinker`
7. **Link it to Instagram:** Page → Settings → **Linked accounts** → Instagram → connect

Once linked and crossposting is on, you post once on Instagram and Facebook fills itself. Only
upload from `Exports/Facebook/` if a crosspost fails.

---

## YouTube — one channel, two audio tracks

1. youtube.com → avatar → **Create a channel**
2. Name: `1min.thinker`
3. **Customise channel → Branding**
   - Picture: `avatar_800.png`
   - Banner: `youtube_banner_2560x1440.png`
   - Watermark: `avatar_180.png`
4. **Customise channel → Basic info**
   - Handle: `@1min.thinker`
   - Description:

```
One big idea, explained in 60 seconds.

Space, physics and the what-ifs that don't have simple answers —
built from real data and real imagery, not hype.

New video every week.
```

5. **Settings → Channel → Advanced → set your channel language.** Do this before you upload.
   It's what unlocks adding a **Hindi audio track** to an English video later, which is how you
   serve both languages from one channel instead of splitting your watch time across two.

⚠️ Do **not** make a separate Hindi YouTube channel. Multi-language audio is free and keeps all
the compounding on one channel.

---

## Posting order

1. **Instagram** first (crossposts to Facebook automatically)
2. **YouTube Shorts** — same file, title from `title.txt`, tags from `tags.txt`
3. Facebook only if the crosspost didn't fire

Each folder in `Exports/<platform>/<date>/<slug>/` has the video, a paste-ready `caption.txt`,
and `_checklist.txt` with the cover-frame timestamp and posting settings.

---

## Before the first post

- [ ] Instagram switched to Creator, bio set, avatar up
- [ ] Facebook Page created, username claimed, linked to Instagram
- [ ] Crossposting toggled ON
- [ ] YouTube channel created, banner + avatar up, **channel language set**
- [ ] Post the English light-speed reel from `Exports/Instagram/2026-11-03/`
