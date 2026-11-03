/* Review & Edit — front end.
 *
 * Three things make this usable rather than merely functional:
 *   1. the waveform IS the scrubber, so you can see where narration sits and
 *      click straight at a beat instead of hunting;
 *   2. keyboard control, because reviewing a cut is a two-hand job and reaching
 *      for a mouse between every shot is what makes review slow;
 *   3. the script panel, which flags pacing problems against measured timings
 *      rather than leaving you to notice them.
 */

const $ = (id) => document.getElementById(id);
const pick = $("pick"), beatsEl = $("beats"), stripEl = $("strip");
const player = $("player"), waveHead = $("wavehead"), waveWrap = $("wavewrap");

let P = null;          // current project
let peaks = [];        // waveform
let script = null;     // lines + pacing notes
let activeBeat = -1;

const fmt = (s) => {
  if (!isFinite(s)) s = 0;
  const m = Math.floor(s / 60), r = s - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, "0")}`;
};
const esc = (s) => (s || "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let toastT;
function toast(msg, ms = 2400) {
  const t = $("toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms);
}

/* ---------------------------------------------------------------- boot ---- */
async function boot() {
  const vids = await (await fetch("/api/videos")).json();
  if (!vids.length) { $("wrap").style.display = "none"; $("empty").style.display = "block"; return; }
  pick.innerHTML = vids.map((v) => `<option value="${v.id}">${esc(v.filename)}</option>`).join("");
  await load(vids[0].id);
}

async function load(id) {
  P = await (await fetch(`/api/project/${id}`)).json();
  player.src = `/video/${id}`;
  activeBeat = -1;
  renderStrip(); render(); drawWave([]);
  // these two are slower, so never block first paint on them
  fetch(`/api/project/${id}/waveform`).then((r) => r.json())
    .then((p) => { peaks = Array.isArray(p) ? p : []; drawWave(peaks); }).catch(() => {});
  fetch(`/api/project/${id}/script`).then((r) => r.json())
    .then((s) => { script = s; renderScript(); }).catch(() => {});
}

/* ------------------------------------------------------------ waveform ---- */
function drawWave(data) {
  const c = $("wave"), dpr = window.devicePixelRatio || 1;
  const w = waveWrap.clientWidth, h = waveWrap.clientHeight;
  c.width = w * dpr; c.height = h * dpr;
  const g = c.getContext("2d"); g.scale(dpr, dpr);
  g.clearRect(0, 0, w, h);
  if (!data.length) return;

  const mid = h / 2, step = w / data.length;
  
  for (let i = 0; i < data.length; i++) {
    const v = Math.max(0.02, data[i]);
    const bar = v * (h * 0.86);
    // quiet = dim, loud = bright: the shape of the read is visible at a glance
    g.fillStyle = `rgba(90,169,255,${0.25 + v * 0.55})`;
    g.fillRect(i * step, mid - bar / 2, Math.max(1, step - 0.4), bar);
  }

  // shot boundaries over the top
  const cuts = $("wavecuts");
  cuts.innerHTML = (P?.beats || []).map((b) =>
    `<i style="left:${(b.start / P.duration) * 100}%"></i>`).join("");
}
window.addEventListener("resize", () => drawWave(peaks));

waveWrap.addEventListener("click", (e) => {
  const r = waveWrap.getBoundingClientRect();
  player.currentTime = ((e.clientX - r.left) / r.width) * (P?.duration || 0);
});

/* -------------------------------------------------------------- strip ----- */
function renderStrip() {
  const cutAt = new Set((P.beats || []).map((b) => Math.round(b.start * 100) / 100));
  stripEl.innerHTML = (P.strip || []).map((s) =>
    `<img src="${s.src}" data-t="${s.t}" class="${cutAt.has(s.t) ? "cut" : ""}" loading="lazy">`
  ).join("");
}

stripEl.addEventListener("click", (e) => {
  const t = e.target.dataset?.t;
  if (t !== undefined) player.currentTime = parseFloat(t);
});

/* -------------------------------------------------------------- shots ----- */
function thread(b) {
  if (!b.thread?.length) return "";
  return `<div class="thread">${b.thread.map((m) => `
    <div class="msg ${m.role === "user" ? "you" : "agent"}">
      <div class="who">${m.role === "user" ? "you" : "agent"}${
        m.pending ? ' <span class="spin"></span>' : ""}</div>
      ${esc(m.text)}
    </div>`).join("")}</div>`;
}

function render() {
  const bs = P.beats || [];
  beatsEl.innerHTML = bs.map((b, i) => `
    <div class="beat ${b.included === false ? "dropped" : ""} ${
         b.status === "approved" ? "approved" : ""}" data-id="${b.id}" data-i="${i}">
      <div class="beat-top">
        <img src="${b.thumb}" data-jump="${b.start}" loading="lazy">
        <div class="beat-no">${i + 1}</div>
        <div class="beat-t">${fmt(b.start)}–${fmt(b.end)}</div>
      </div>
      <div class="beat-body">
        <div class="row">
          <button class="mini ${b.status === "approved" ? "go on" : "go"}" data-act="approve">
            ${b.status === "approved" ? "✓ Approved" : "Approve"}</button>
          <button class="mini no" data-act="keep">${b.included === false ? "Restore" : "Drop"}</button>
        </div>
        <input type="text" data-field="note" placeholder="Note to self…" value="${esc(b.note || "")}">
        <select class="sel" data-field="kind">
          <option value="">Change the animation…</option>
          <option value="camera">Camera move — slower / faster</option>
          <option value="text">Text — wording, size, position</option>
          <option value="timing">Timing — hold longer / cut sooner</option>
          <option value="color">Colour / grade</option>
          <option value="sfx">Sound effect on this beat</option>
          <option value="rebuild">Rebuild this panel</option>
        </select>
        <textarea data-field="instruct" placeholder="What should change in this shot?"></textarea>
        <div class="row"><button class="mini on" data-act="send" style="margin-left:auto">Send ▸</button></div>
        ${thread(b)}
      </div>
    </div>`).join("");
  renderStats();
  highlight(player.currentTime || 0);
}

function renderStats() {
  const bs = P.beats || [];
  const kept = bs.filter((b) => b.included !== false);
  const ok = bs.filter((b) => b.status === "approved").length;
  const cutLen = kept.reduce((a, b) => a + (b.end - b.start), 0);
  const warn = (script?.notes || []).filter((n) => n.level === "warn").length;
  $("stats").innerHTML = `
    <span class="chip">shots <b>${bs.length}</b></span>
    <span class="chip ok">approved <b>${ok}</b></span>
    <span class="chip ${bs.length - kept.length ? "bad" : ""}">dropped <b>${bs.length - kept.length}</b></span>
    <span class="chip">cut <b>${fmt(cutLen)}</b></span>
    ${warn ? `<span class="chip warn">notes <b>${warn}</b></span>` : ""}`;
}

/* ------------------------------------------------------------- script ----- */
function renderScript() {
  if (!script?.lines?.length) {
    $("script").innerHTML = `<div style="padding:16px;color:var(--faint)">
      No narration timings found for this cut.</div>`;
    return;
  }
  const byId = {};
  (script.notes || []).forEach((n) => (byId[n.id] = byId[n.id] || []).push(n));
  $("scriptsrc").textContent = `${script.source} · ${script.spokenPct}% spoken`;
  $("script").innerHTML = script.lines.map((l) => {
    const dur = l.end - l.start;
    const words = (l.text || "").trim().split(/\s+/).filter(Boolean).length;
    const wps = words / Math.max(0.01, dur);
    return `<div class="sl" data-t="${l.start}" data-id="${l.id}">
      <div class="t">${fmt(l.start)}</div>
      <div class="txt">${esc(l.text)}
        ${(byId[l.id] || []).map((n) =>
          `<span class="note ${n.level}">▸ ${esc(n.msg)}</span>`).join("")}</div>
      <div class="wps">${wps.toFixed(1)} w/s</div>
    </div>`;
  }).join("");
  renderStats();
}

$("script").addEventListener("click", (e) => {
  const row = e.target.closest(".sl");
  if (row) player.currentTime = parseFloat(row.dataset.t);
});

/* ------------------------------------------------------ live highlight ---- */
function highlight(t) {
  const bs = P?.beats || [];
  let idx = -1;
  for (let i = 0; i < bs.length; i++) if (t >= bs[i].start && t < bs[i].end) { idx = i; break; }
  if (idx !== activeBeat) {
    activeBeat = idx;
    [...beatsEl.children].forEach((el, i) => el.classList.toggle("now", i === idx));
    $("nowshot").textContent = idx >= 0 ? `shot ${idx + 1} of ${bs.length}` : "";
  }
  // nearest strip frame
  let best = null, bd = 1e9;
  [...stripEl.children].forEach((im) => {
    const d = Math.abs(parseFloat(im.dataset.t) - t);
    if (d < bd) { bd = d; best = im; }
    im.classList.remove("now");
  });
  if (best) best.classList.add("now");

  // live caption + script row
  if (script?.lines) {
    const line = script.lines.find((l) => t >= l.start && t <= l.end);
    const cap = $("capline");
    cap.textContent = line ? line.text : "";
    cap.classList.toggle("on", !!line);
    [...$("script").children].forEach((r) =>
      r.classList.toggle("now", !!line && r.dataset.id === line.id));
  }
  waveHead.style.left = `${(t / (P?.duration || 1)) * 100}%`;
}

/* ------------------------------------------------------------ actions ---- */
const save = (id, patch) =>
  fetch(`/api/project/${P.videoId}/beat/${id}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

const beatOf = (el) => {
  const card = el.closest(".beat");
  return card ? P.beats.find((x) => x.id === card.dataset.id) : null;
};

beatsEl.addEventListener("click", async (e) => {
  const jump = e.target.dataset?.jump;
  if (jump !== undefined) { player.currentTime = parseFloat(jump); return; }
  const act = e.target.dataset?.act;
  if (!act) return;
  const b = beatOf(e.target);
  if (!b) return;

  if (act === "approve") {
    b.status = b.status === "approved" ? "" : "approved";
    save(b.id, { status: b.status }); render();
  } else if (act === "keep") {
    b.included = b.included === false;
    save(b.id, { included: b.included }); render();
  } else if (act === "send") {
    const card = e.target.closest(".beat");
    const ta = card.querySelector('[data-field="instruct"]');
    const kind = card.querySelector('[data-field="kind"]').value;
    const text = ta.value.trim();
    if (!text) { toast("Write what should change first"); ta.focus(); return; }
    e.target.disabled = true; e.target.innerHTML = '<span class="spin"></span>';
    try {
      const r = await fetch(`/api/project/${P.videoId}/beat/${b.id}/instruct`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, kind }),
      });
      const j = await r.json();
      if (j.thread) { b.thread = j.thread; ta.value = ""; render(); toast(`Agent briefed on shot ${b.index + 1}`); }
      else toast(j.error || "Could not brief the agent");
    } catch { toast("Could not reach the agent"); }
    e.target.disabled = false; e.target.textContent = "Send ▸";
  }
});

beatsEl.addEventListener("change", (e) => {
  const f = e.target.dataset?.field;
  if (f !== "note") return;
  const b = beatOf(e.target);
  if (b) { b.note = e.target.value; save(b.id, { note: b.note }); toast("Note saved"); }
});

$("approveall").addEventListener("click", () => {
  let n = 0;
  (P.beats || []).forEach((b) => {
    if (b.included !== false && b.status !== "approved") { b.status = "approved"; save(b.id, { status: "approved" }); n++; }
  });
  render(); toast(n ? `Approved ${n} shot${n > 1 ? "s" : ""}` : "Nothing left to approve");
});

/* -------------------------------------------------------- transport ------ */
$("play").addEventListener("click", () => (player.paused ? player.play() : player.pause()));
player.addEventListener("play", () => ($("play").textContent = "❚❚"));
player.addEventListener("pause", () => ($("play").textContent = "▶"));
player.addEventListener("timeupdate", () => {
  $("time").textContent = `${fmt(player.currentTime)} / ${fmt(player.duration)}`;
  highlight(player.currentTime);
});

const cutTimes = () => (P?.beats || []).map((b) => b.start);
function gotoCut(dir) {
  const ts = cutTimes(); if (!ts.length) return;
  const t = player.currentTime;
  const next = dir > 0 ? ts.find((x) => x > t + 0.05)
                       : [...ts].reverse().find((x) => x < t - 0.25);
  player.currentTime = next ?? (dir > 0 ? P.duration - 0.05 : 0);
}
$("prevcut").addEventListener("click", () => gotoCut(-1));
$("nextcut").addEventListener("click", () => gotoCut(1));

pick.addEventListener("change", () => load(pick.value));
$("regen").addEventListener("click", async () => {
  toast("Re-analysing…", 8000);
  P = await (await fetch(`/api/project/${P.videoId}/regenerate`, { method: "POST" })).json();
  renderStrip(); render(); toast("Re-analysed");
});
$("export").addEventListener("click", async () => {
  toast("Exporting…", 30000);
  const r = await fetch(`/api/project/${P.videoId}/export`, { method: "POST" });
  const j = await r.json();
  toast(j.error ? j.error : `Exported → ${j.out || "Exports/"}`, 6000);
});

/* ------------------------------------------------------- keyboard -------- */
$("help").addEventListener("click", () => $("keys").classList.add("on"));
$("keys").addEventListener("click", () => $("keys").classList.remove("on"));

document.addEventListener("keydown", (e) => {
  // never hijack typing
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  const b = activeBeat >= 0 ? P?.beats?.[activeBeat] : null;

  switch (e.key) {
    case " ": e.preventDefault(); player.paused ? player.play() : player.pause(); break;
    case "ArrowRight": player.currentTime += 1; break;
    case "ArrowLeft":  player.currentTime -= 1; break;
    case ".": player.currentTime += 1 / (P?.fps || 30); break;
    case ",": player.currentTime -= 1 / (P?.fps || 30); break;
    case "]": gotoCut(1); break;
    case "[": gotoCut(-1); break;
    case "Escape": $("keys").classList.remove("on"); break;
    case "?": $("keys").classList.toggle("on"); break;
    case "k": case "K":
      if (b) { b.included = b.included === false; save(b.id, { included: b.included }); render();
               toast(b.included === false ? "Shot dropped" : "Shot kept"); }
      break;
    case "a": case "A":
      if (b) { b.status = b.status === "approved" ? "" : "approved";
               save(b.id, { status: b.status }); render();
               toast(b.status ? "Approved" : "Approval removed"); }
      break;
    default:
      if (/^[1-9]$/.test(e.key)) {
        const t = P?.beats?.[+e.key - 1];
        if (t) player.currentTime = t.start;
      }
  }
});

boot();
