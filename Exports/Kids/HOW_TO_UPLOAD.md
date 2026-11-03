# Kids channel — how to upload

```
Exports/Kids/
  Instagram/2026-11-03/ep01-the-girl-who-waited/
  YouTube/  2026-11-03/ep01-the-girl-who-waited/
  Facebook/ 2026-11-03/ep01-the-girl-who-waited/
  …/2026-11-04/ep02-forty-two-rupees/
```

Every folder holds the same four things (YouTube gets two more):

| File | What to do with it |
|---|---|
| `kids-ep01-….mp4` | the video to upload |
| `cover.png` | set as the cover / thumbnail — do not skip this |
| `caption.txt` | select all → copy → paste into the caption box. Nothing to edit |
| `_checklist.txt` | the settings to tick for that platform |
| `title.txt` *(YouTube only)* | the title — IG and FB have no title field |
| `tags.txt` *(YouTube only)* | paste into the tags box |

---

## Order: Instagram first

Instagram crossposts to your Facebook Page automatically, so doing it first
means Facebook fills itself and you can skip that folder entirely.

### 1. Instagram
1. New post → **Reel** → pick the `.mp4`
2. **Cover** → Edit cover → *Add from gallery* → `cover.png`
3. Caption → paste all of `caption.txt`
4. Check these are **on**: *Share to Facebook*, *Allow remix*, *Allow download*
5. Add a location — a big metro widens the first push
6. Post between **7–10pm IST**

### 2. YouTube Shorts
1. Create → Upload video → pick the same `.mp4`
2. Title ← `title.txt`  ·  Description ← `caption.txt`  ·  Tags ← `tags.txt`
3. Thumbnail ← `cover.png` (if Shorts doesn't offer one, let it auto-pick — fine)
4. **Audience: "Yes, it's made for kids."**
   This is a legal declaration under COPPA, not a preference. It turns off
   comments and personalised ads on the video. That is expected and correct —
   answering "no" to keep them is what gets children's channels penalised.

### 3. Facebook
Only if the Instagram crosspost didn't appear on the Page after ~10 minutes.
Same video, paste `caption.txt`, set `cover.png`. Facebook rewards **3–5**
hashtags, so that caption is deliberately shorter.

---

## The series matters more than any one episode

These are 10 episodes of one countdown story, so post **one a day, same time**.
EP01's caption ends with "EP2 tomorrow" — that promise is what builds the habit,
so don't break the daily rhythm once it starts.

Worth doing: post **EP01 and EP02 on the same day** (a few hours apart). One
episode is a video; two is a series, and people only subscribe once they can see
it's a series.

---

## After you've uploaded

Tell me which episode is live and I'll reclaim the disk space:

```bash
python3 Tools/publish/cleanup.py --slug ep01-the-girl-who-waited
```

It deletes only the uploaded copies and keeps everything needed to rebuild —
composition, plates, script, audio.
