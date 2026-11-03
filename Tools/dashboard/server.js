import express from "express";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(__dirname, "data");
const CACHE_DIR = path.join(__dirname, "cache");
const RAW_DIRS = ["Raw footage ", "Raw footage"];
const EXPORT_DIRS = ["Exports"];
const WHISPER_BIN = path.join(process.env.HOME, "Developer/whisper.cpp/build/bin/whisper-cli");
const WHISPER_MODEL = path.join(process.env.HOME, "Developer/whisper.cpp/models/ggml-base.en.bin");

await fs.mkdir(DATA_DIR, { recursive: true });
await fs.mkdir(CACHE_DIR, { recursive: true });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/cache", express.static(CACHE_DIR));

function firstExisting(names, fallbackIdx = 0) {
  for (const n of names) {
    const p = path.join(ROOT, n);
    if (fssync.existsSync(p)) return p;
  }
  return path.join(ROOT, names[fallbackIdx]);
}
const rawDir = () => firstExisting(RAW_DIRS);
const exportDir = () => firstExisting(EXPORT_DIRS);

const slug = (f) => path.basename(f).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();

async function listVideos() {
  try {
    const entries = await fs.readdir(rawDir());
    return entries
      .filter((f) => !f.startsWith(".") && /\.(mp4|mov|mkv|webm)$/i.test(f))
      .map((f) => ({ id: slug(f), filename: f, dir: rawDir() }));
  } catch {
    return [];
  }
}

async function probe(videoPath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,avg_frame_rate",
    "-show_entries", "format=duration",
    "-of", "json", videoPath,
  ]);
  const j = JSON.parse(stdout);
  const st = (j.streams && j.streams[0]) || {};
  const [num, den] = (st.avg_frame_rate || "30/1").split("/").map(Number);
  return {
    width: st.width || 1080,
    height: st.height || 1920,
    fps: den ? num / den : 30,
    duration: parseFloat(j.format.duration),
  };
}

async function detectSceneCuts(videoPath, duration, threshold = 0.12) {
  let err = "";
  try {
    const r = await execFileAsync("ffmpeg", [
      "-i", videoPath, "-vf", `select='gt(scene,${threshold})',showinfo`,
      "-an", "-f", "null", "-",
    ], { maxBuffer: 1024 * 1024 * 96 });
    err = r.stderr || "";
  } catch (e) {
    err = e.stderr || "";
  }
  const times = [...err.matchAll(/pts_time:([\d.]+)/g)].map((m) => parseFloat(m[1]));
  const pts = [0, ...times.filter((t) => t > 0.6 && t < duration - 0.6), duration];
  const uniq = [...new Set(pts.map((t) => Math.round(t * 100) / 100))].sort((a, b) => a - b);
  const merged = [uniq[0]];
  for (let i = 1; i < uniq.length; i++) {
    if (uniq[i] - merged[merged.length - 1] >= 1.2 || i === uniq.length - 1) merged.push(uniq[i]);
  }
  return merged;
}

async function thumb(videoPath, t, outPath, width = 240) {
  if (fssync.existsSync(outPath)) return;
  await execFileAsync("ffmpeg", [
    "-y", "-ss", String(t), "-i", videoPath,
    "-frames:v", "1", "-vf", `scale=${width}:-1`, "-q:v", "4", outPath,
  ]);
}

async function transcript(videoPath, key) {
  const jsonPath = path.join(CACHE_DIR, `${key}.json`);
  if (fssync.existsSync(jsonPath)) return JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  if (!fssync.existsSync(WHISPER_BIN) || !fssync.existsSync(WHISPER_MODEL)) return null;
  const wav = path.join(CACHE_DIR, `${key}.wav`);
  await execFileAsync("ffmpeg", ["-y", "-i", videoPath, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
  await execFileAsync(WHISPER_BIN, [
    "-m", WHISPER_MODEL, "-f", wav, "-oj", "-of", path.join(CACHE_DIR, key), "-nt", "-ml", "1",
  ], { maxBuffer: 1024 * 1024 * 96 });
  return fssync.existsSync(jsonPath) ? JSON.parse(await fs.readFile(jsonPath, "utf-8")) : null;
}

function mergeTokens(tr) {
  if (!tr || !tr.transcription) return [];
  const out = [];
  for (const tok of tr.transcription) {
    const raw = tok.text;
    const s = tok.offsets ? tok.offsets.from / 1000 : 0;
    const e = tok.offsets ? tok.offsets.to / 1000 : 0;
    if (raw.startsWith(" ") || out.length === 0) out.push({ text: raw.trim(), start: s, end: e });
    else {
      const last = out[out.length - 1];
      last.text += raw.trim();
      last.end = e;
    }
  }
  return out;
}

const textFor = (words, a, b) =>
  words.filter((w) => w.end >= a && w.start <= b).map((w) => w.text).join(" ").trim();

// Narrated pieces often cross-fade over a moving background, so frame deltas never
// spike and scene detection finds nothing. Real pauses in the voice track are the
// shot boundaries there. Whisper's token spans are contiguous (no measurable gaps),
// so read the pauses straight off the audio with silencedetect.
async function cutsFromSilence(videoPath, duration, minShot = 2.0) {
  let err = "";
  try {
    const r = await execFileAsync("ffmpeg", [
      "-i", videoPath, "-af", "silencedetect=noise=-32dB:d=0.22",
      "-vn", "-f", "null", "-",
    ], { maxBuffer: 1024 * 1024 * 64 });
    err = r.stderr || "";
  } catch (e) {
    err = e.stderr || "";
  }
  const ends = [...err.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
  if (!ends.length) return null;
  const bounds = [0];
  for (const t of ends) {
    if (t > 0.5 && t < duration - 0.5 && t - bounds[bounds.length - 1] >= minShot) {
      bounds.push(Math.round(t * 100) / 100);
    }
  }
  bounds.push(duration);
  return bounds.length >= 3 ? bounds : null;
}

function mergeBounds(a, b, duration, minShot = 1.4) {
  const all = [...new Set([...a, ...b].map((t) => Math.round(t * 100) / 100))].sort((x, y) => x - y);
  const out = [all[0]];
  for (const t of all.slice(1)) {
    if (t - out[out.length - 1] >= minShot) out.push(t);
  }
  if (out[out.length - 1] < duration - 0.05) out.push(duration);
  else out[out.length - 1] = duration;
  return out;
}

async function buildProject(video, { force = false } = {}) {
  const videoPath = path.join(video.dir, video.filename);
  const dataPath = path.join(DATA_DIR, `${video.id}.json`);
  if (!force && fssync.existsSync(dataPath)) return JSON.parse(await fs.readFile(dataPath, "utf-8"));

  const meta = await probe(videoPath);
  const sceneCuts = await detectSceneCuts(videoPath, meta.duration);
  const words = mergeTokens(await transcript(videoPath, video.id));

  let cuts = sceneCuts;
  if (sceneCuts.length < 4 && meta.duration > 12) {
    const speech = await cutsFromSilence(videoPath, meta.duration);
    if (speech) cuts = mergeBounds(sceneCuts, speech, meta.duration);
  }

  const beats = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const start = cuts[i], end = cuts[i + 1];
    const name = `${video.id}-b${i}.jpg`;
    await thumb(videoPath, (start + end) / 2, path.join(CACHE_DIR, name), 300);
    beats.push({
      id: `${video.id}-b${i}`,
      index: i,
      start, end,
      trimStart: start, trimEnd: end,
      included: true,
      thumb: `/cache/${name}`,
      text: textFor(words, start, end),
      broll: "", sfx: [], status: "pending", notes: "",
    });
  }

  // filmstrip: one frame per second across the whole timeline
  const strip = [];
  for (let t = 0; t < meta.duration; t += 1) {
    const name = `${video.id}-s${String(Math.round(t)).padStart(4, "0")}.jpg`;
    await thumb(videoPath, t, path.join(CACHE_DIR, name), 150);
    strip.push({ t: Math.round(t * 100) / 100, src: `/cache/${name}` });
  }

  const project = {
    videoId: video.id, filename: video.filename,
    ...meta, beats, strip,
    transcriptWords: words.map((w) => [w.text, Math.round(w.start * 100) / 100, Math.round(w.end * 100) / 100]),
  };
  await fs.writeFile(dataPath, JSON.stringify(project, null, 2));
  return project;
}

const findVideo = async (id) => (await listVideos()).find((v) => v.id === id);

app.get("/api/videos", async (_req, res) => res.json(await listVideos()));

app.get("/api/project/:id", async (req, res) => {
  const v = await findVideo(req.params.id);
  if (!v) return res.status(404).json({ error: "not found" });
  try { res.json(await buildProject(v)); }
  catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/project/:id/regenerate", async (req, res) => {
  const v = await findVideo(req.params.id);
  if (!v) return res.status(404).json({ error: "not found" });
  try { res.json(await buildProject(v, { force: true })); }
  catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/project/:id/beat/:beatId", async (req, res) => {
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  const b = proj.beats.find((x) => x.id === req.params.beatId);
  if (!b) return res.status(404).json({ error: "no beat" });
  for (const k of ["status", "notes", "broll", "sfx", "included", "trimStart", "trimEnd"]) {
    if (req.body[k] !== undefined) b[k] = req.body[k];
  }
  if (b.trimStart < b.start) b.trimStart = b.start;
  if (b.trimEnd > b.end) b.trimEnd = b.end;
  if (b.trimEnd - b.trimStart < 0.1) b.trimEnd = Math.min(b.end, b.trimStart + 0.1);
  await fs.writeFile(p, JSON.stringify(proj, null, 2));
  res.json(b);
});

// --- per-shot instruction → real background subagent ------------------------
// Each instruction spawns its own headless `claude -p` process with the full
// context for that one shot. It runs detached, so the main conversation is
// never blocked, and its answer is written back into the shot's thread.

// which composition source belongs to which rendered video
const PROJECT_MAP = {
  "light-speed-en-mp4": "Tools/lightspeed-v2",
  "light-speed-hi-mp4": "Tools/lightspeed-hi",
  "light-speed-v3-mp4": "Tools/lightspeed-v2",
  "light-speed-v2-mp4": "Tools/lightspeed-v2",
};

function compositionDirFor(videoId) {
  if (PROJECT_MAP[videoId]) return PROJECT_MAP[videoId];
  if (/-hi-|hindi/.test(videoId)) return "Tools/lightspeed-hi";
  return "Tools/lightspeed-v2";
}

function buildPrompt({ proj, beat, kind, text, compDir }) {
  return `You are editing ONE shot of a finished 9:16 explainer video. Work only on this shot.

PROJECT
  repo root    : ${ROOT}
  composition  : ${compDir}/index.html   (HyperFrames: HTML + GSAP, seek-driven)
  rendered file: ${proj.filename}  (${proj.duration.toFixed(1)}s, ${proj.width}x${proj.height})

THIS SHOT
  shot number  : ${beat.index + 1} of ${proj.beats.length}
  time range   : ${beat.start.toFixed(2)}s - ${beat.end.toFixed(2)}s
  transcript   : ${JSON.stringify(beat.text || "")}
  current notes: ${JSON.stringify(beat.notes || "")}

REQUEST (${kind})
  ${text}

HOW THIS COMPOSITION WORKS
  - SHOTS[]  : photoreal NASA plates with Ken Burns {in, out, from:[scale,x,y], to:[...]}
  - TITLES[] : gold headline + small subtitle  {t, u, a, b}
  - STATS[]  : big gold number + label         {t, u, a, b}
  - captions : built from ALL[] (word, start, end, isBreak) — the Hindi cut has none
  - Timings are in seconds on the root GSAP timeline and must stay inside this
    shot's range above. Do not shift other shots.

RULES
  1. Change ONLY what the request asks for, inside this shot's time range.
  2. Keep readable text above y=-3.0 equivalent (clear of the caption band).
  3. Run: cd "${ROOT}/${compDir}" && npx hyperframes check    — it must pass with 0 errors.
  4. Do NOT render. Rendering is a separate, explicit step.
  5. Reply with 2-4 plain sentences: what you changed and why. No preamble.`;
}

function runSubagent({ dataPath, beatId, prompt, compDir }) {
  const args = [
    "-p", prompt,
    "--add-dir", ROOT,
    "--allowedTools", "Read", "Edit", "Write", "Glob", "Grep",
    "Bash(npx hyperframes check:*)", "Bash(cd:*)",
  ];
  const child = spawn("claude", args, {
    cwd: path.join(ROOT, compDir),
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let out = "", err = "";
  child.stdout.on("data", (d) => (out += d.toString()));
  child.stderr.on("data", (d) => (err += d.toString()));

  const finish = async (status, body) => {
    try {
      const proj = JSON.parse(await fs.readFile(dataPath, "utf-8"));
      const b = proj.beats.find((x) => x.id === beatId);
      if (!b) return;
      b.thread = b.thread || [];
      for (const m of b.thread) if (m.role === "user" && m.status === "running") m.status = status;
      b.thread.push({ role: "agent", text: body.trim().slice(0, 4000), ts: Date.now() });
      await fs.writeFile(dataPath, JSON.stringify(proj, null, 2));
    } catch { /* thread write is best-effort */ }
  };

  child.on("close", (code) => {
    if (code === 0 && out.trim()) finish("done", out);
    else finish("failed", out.trim() || err.trim() || `subagent exited with code ${code}`);
  });
  child.on("error", (e) => finish("failed", `could not start subagent: ${e.message}`));
  child.unref();
}

app.post("/api/project/:id/beat/:beatId/instruct", async (req, res) => {
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  const b = proj.beats.find((x) => x.id === req.params.beatId);
  if (!b) return res.status(404).json({ error: "no beat" });
  const { kind = "other", text = "" } = req.body;
  if (!text.trim()) return res.status(400).json({ error: "empty instruction" });

  b.thread = b.thread || [];
  b.thread.push({ role: "user", kind, text: text.trim(), ts: Date.now(), status: "running" });
  await fs.writeFile(p, JSON.stringify(proj, null, 2));

  const compDir = compositionDirFor(proj.videoId);
  runSubagent({
    dataPath: p, beatId: b.id, compDir,
    prompt: buildPrompt({ proj, beat: b, kind, text: text.trim(), compDir }),
  });

  res.json({ ok: true, thread: b.thread, dispatched: true });
});

// poll one project's threads so the UI can show the agent answering
app.get("/api/project/:id/threads", async (req, res) => {
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  res.json(Object.fromEntries(proj.beats.map((b) => [b.id, b.thread || []])));
});

app.post("/api/project/:id/beat/:beatId/reply", async (req, res) => {
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  const b = proj.beats.find((x) => x.id === req.params.beatId);
  if (!b) return res.status(404).json({ error: "no beat" });
  b.thread = b.thread || [];
  b.thread.filter((m) => m.role === "user" && m.status === "queued")
    .forEach((m) => (m.status = "done"));
  b.thread.push({ role: "agent", text: String(req.body.text || ""), ts: Date.now() });
  await fs.writeFile(p, JSON.stringify(proj, null, 2));
  res.json({ ok: true, thread: b.thread });
});

// everything still waiting on the agent, across all projects
app.get("/api/queue", async (_req, res) => {
  const out = [];
  for (const f of await fs.readdir(DATA_DIR)) {
    // "._x.json" AppleDouble sidecars on exFAT are not JSON
    if (!f.endsWith(".json") || f.startsWith(".")) continue;
    let proj;
    try {
      proj = JSON.parse(await fs.readFile(path.join(DATA_DIR, f), "utf-8"));
    } catch {
      continue;
    }
    for (const b of proj.beats) {
      for (const m of b.thread || []) {
        if (m.role === "user" && m.status === "queued") {
          out.push({
            project: proj.videoId, beat: b.id, shot: b.index + 1,
            start: b.start, end: b.end, text: b.text,
            kind: m.kind, instruction: m.text, ts: m.ts,
          });
        }
      }
    }
  }
  out.sort((a, b) => a.ts - b.ts);
  res.json(out);
});

app.post("/api/project/:id/reorder", async (req, res) => {
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  const order = req.body.order || [];
  proj.beats.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  proj.beats.forEach((b, i) => (b.index = i));
  await fs.writeFile(p, JSON.stringify(proj, null, 2));
  res.json({ ok: true });
});

// Render the kept beats, in their current order, into Exports/
app.post("/api/project/:id/export", async (req, res) => {
  const v = await findVideo(req.params.id);
  const p = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!v || !fssync.existsSync(p)) return res.status(404).json({ error: "not found" });
  const proj = JSON.parse(await fs.readFile(p, "utf-8"));
  const keep = proj.beats.filter((b) => b.included && b.status !== "rejected");
  if (!keep.length) return res.status(400).json({ error: "no beats selected" });

  const src = path.join(v.dir, v.filename);
  const work = path.join(CACHE_DIR, `cut-${req.params.id}`);
  await fs.rm(work, { recursive: true, force: true });
  await fs.mkdir(work, { recursive: true });

  const parts = [];
  for (let i = 0; i < keep.length; i++) {
    const b = keep[i];
    const out = path.join(work, `p${String(i).padStart(3, "0")}.mp4`);
    await execFileAsync("ffmpeg", [
      "-y", "-ss", String(b.trimStart), "-to", String(b.trimEnd), "-i", src,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
      "-c:a", "aac", "-b:a", "192k", "-avoid_negative_ts", "make_zero", out,
    ], { maxBuffer: 1024 * 1024 * 64 });
    parts.push(out);
  }

  const listFile = path.join(work, "list.txt");
  await fs.writeFile(listFile, parts.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n"));

  // Land the cut straight in the per-platform, per-date upload folders so it is
  // ready to post — never loose in Exports/.
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const day = new Date().toISOString().slice(0, 10);
  const base = path.parse(v.filename).name;
  const name = `${base}_cut_${stamp}.mp4`;

  const staged = path.join(work, name);
  await execFileAsync("ffmpeg", [
    "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", staged,
  ], { maxBuffer: 1024 * 1024 * 64 });

  const written = [];
  for (const platform of ["Instagram", "YouTube", "Facebook"]) {
    const dir = path.join(exportDir(), platform, day, base);
    await fs.mkdir(dir, { recursive: true });
    await fs.copyFile(staged, path.join(dir, name));
    written.push(path.relative(ROOT, path.join(dir, name)));
  }
  await fs.rm(work, { recursive: true, force: true });

  const meta = await probe(path.join(exportDir(), "Instagram", day, base, name));
  res.json({ ok: true, files: written, duration: meta.duration, segments: keep.length });
});

app.get("/video/:id", async (req, res) => {
  const v = await findVideo(req.params.id);
  if (!v) return res.status(404).end();
  res.sendFile(path.join(v.dir, v.filename));
});

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
  console.log(`Review dashboard → http://localhost:${PORT}`);
  console.log(`Watching: ${rawDir()}`);
  console.log(`Exports:  ${exportDir()}`);
});
