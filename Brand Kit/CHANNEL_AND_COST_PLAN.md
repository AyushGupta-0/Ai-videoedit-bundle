# Channels, Platforms & What a Hindi Version Actually Costs

---

## 1. What the Hindi version costs (short answer: very little)

Most of what you've paid for so far was **one-time pipeline build** — researching tools, installing
Manim/Kokoro/Whisper, analysing your references, building the composition engine, building the
dashboard, and debugging all of it. None of that repeats.

A Hindi version of an **existing** English video reuses: the NASA plates, the camera moves, the
title cards, the stat numbers, the ambient score, the SFX, the composition code. What changes is
the audio track and the timing.

| Step | Reused from English? | Relative effort |
|---|---|---|
| NASA plates + Ken Burns moves | ✅ identical | 0 |
| Title cards, stat numbers (stay English) | ✅ identical | 0 |
| Ambient bed + SFX | ✅ identical | 0 |
| Composition / render code | ✅ identical | 0 |
| Hindi script + performance direction | ✍️ new | small |
| Hindi VO (your recording, or Kokoro `hm_psi`) | 🎙️ new | small |
| Retime shots to the new audio length | 🔧 new | small |
| Word-by-word captions | ❌ **you're dropping these** | **0** |
| Render | 💻 local, free | 0 |

**Estimate: roughly 10% of what the English build cost** — and dropping the word-by-word captions
is what makes it that cheap, because force-aligning captions to audio is one of the more involved
steps. You're removing the single most expensive recurring piece.

**If you record the Hindi VO yourself, it gets cheaper still** — no TTS iteration, no voice
selection loop.

> Honest caveat: I can't see your billing dashboard, so I can't quote rupees. But in *work* terms,
> Hindi is a cheap add-on, not a second production. If the English one is worth making, the Hindi
> one is close to free. **My recommendation: do it.**

The one thing to watch: each round of "change this, re-render, let me see" costs more than the
initial build of that piece. Batching your notes (via the dashboard) is cheaper than one-at-a-time.

---

## 2. Platforms — you need fewer accounts than you think

### YouTube does multi-language audio natively

YouTube supports **multiple audio tracks on a single video**. You upload the English video once and
attach a Hindi audio track to it. Viewers get served their language automatically.

**So you do NOT need a separate Hindi YouTube channel.** One channel, one video, two audio tracks.
This also means all your views, watch time and subscribers compound on one channel instead of
splitting across two — which matters a lot for the algorithm.

### Instagram + Facebook can be one workflow

Meta lets you crosspost Reels from Instagram to a linked Facebook Page automatically through Meta
Business Suite. You publish to Instagram; Facebook gets it without separate work.

Instagram and Facebook **don't** support multi-language audio, so Hindi does need its own IG
account there.

### Revised account list

| Channel | Instagram | Facebook | YouTube |
|---|---|---|---|
| What If — English | ✅ own account | 🔁 crosspost from IG | ✅ own channel |
| What If — Hindi | ✅ own account | 🔁 crosspost from IG | 🎧 **audio track on the EN channel** |
| Kids — English | ✅ own account | 🔁 crosspost from IG | ✅ own channel |
| Kids — Hindi | ✅ own account | 🔁 crosspost from IG | 🎧 **audio track on the EN channel** |

**4 Instagram accounts + 4 linked Facebook Pages + 2 YouTube channels.** Not 12.

### Where to put your effort first

1. **Instagram Reels** — best discovery for this format right now, and all three of your references are IG. Start here.
2. **YouTube Shorts** — slower to start, but compounds; Shorts views feed your long-form later if you ever go there.
3. **Facebook** — effectively free via crosspost. Don't spend separate effort on it.

---

## 3. Kids channel structure

Two content types alternating, as you described:

| Day | Type | Notes |
|---|---|---|
| Mon / Wed / Fri | **Kids tales** — 3D kid characters | Chintu-style stories, daily-life situations |
| Tue / Thu / Sat | **Animal tales** | The higher performer on IG historically — animals travel across languages better |

Both get EN + HI. Same visual master, two audio tracks — identical economics to the What If channel.

One note from your own reference set: the kids references split into two *visual* styles (glossy
toy-cartoon vs photoreal AI toddlers). Pick one per channel and stay consistent — mixing them reads
as two different channels to a viewer scrolling fast.

---

## 4. What I need from you to post on your behalf — and what I won't take

**I will never ask for, store, or type your passwords.** Not for Instagram, not for Google, not for
anything. If a setup step needs your password, you do that step yourself.

Here's the clean way to do it:

### Instagram + Facebook
1. Convert each IG account to **Professional** (Creator or Business) — free, in Settings
2. Link each to a **Facebook Page** you own
3. Create one **Meta Developer app** → add Instagram Graph API
4. Generate a **long-lived access token** with `instagram_business_content_publish`
5. Paste the token into a local file I'll create at `Tools/publish/.env`

I write the publishing script; it reads the token from that file at runtime. **I never need to read
the token's value**, and it never leaves your machine.

⚠️ **One real constraint:** the Instagram API cannot upload a file. It fetches the video from a
**public HTTPS URL**. So we need somewhere to host the MP4 (Cloudflare R2, S3, or even a GitHub
release). Budget for that — it's the one piece that isn't free.

### YouTube
1. Create a **Google Cloud project** → enable YouTube Data API v3
2. Download the **OAuth client JSON** → put it in `Tools/publish/`
3. Run the consent flow **yourself, once** in your browser — it writes a local token file

Same principle: you authorise, the token stays local, I never see credentials.

### On automated posting

I can build the scheduler. But I'd push back on **fully blind auto-posting** from day one — a bad
or mistimed post is public and hard to walk back, and early on you'll want to watch how each piece
lands before the next goes out.

My recommendation: **schedule → hold for your approval → publish.** The dashboard already has the
approve/reject flow; I'd wire publishing to the same gate. Once you've seen 10–15 posts go out
clean and you trust the output, we flip it to fully automatic.

Tell me when the accounts exist and I'll build the publishing layer around them.

---

## 5. Suggested next step

Record the Hindi take from `Editing styles/VOICE_RECORDING_GUIDE_HI.md`. That single recording:

- gives us the Hindi light-speed video almost immediately
- teaches me your natural delivery, so every future script is written in your rhythm
- costs nothing but 15 minutes of your time

Then create the first **two** accounts only — What If EN on Instagram, and the YouTube channel.
Prove the format works before spinning up four more.
