const $ = (id) => document.getElementById(id);
const pick = $("pick"), beatsEl = $("beats"), stripEl = $("strip");
const player = $("player"), fill = $("fill"), head = $("head"), scrub = $("scrub");

let project = null;

const fmt = (s) => {
  if (!isFinite(s)) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};
const esc = (s) => (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function toast(msg, ms = 2600) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), ms);
}

async function boot() {
  const vids = await (await fetch("/api/videos")).json();
  if (!vids.length) {
    $("wrap").style.display = "none";
    $("empty").style.display = "block";
    return;
  }
  pick.innerHTML = vids.map((v) => `<option value="${v.id}">${esc(v.filename)}</option>`).join("");
  await load(vids[0].id);
}

async function load(id) {
  beatsEl.innerHTML = `<div style="padding:30px;color:var(--dim)">Analysing — scene cuts, thumbnails and transcript…</div>`;
  stripEl.innerHTML = "";
  project = await (await fetch(`/api/project/${id}`)).json();
  player.src = `/video/${id}`;
  renderStrip();
  render();
}

function renderStrip() {
  const cutTimes = new Set(project.beats.map((b) => Math.round(b.start)));
  stripEl.innerHTML = project.strip.map((f) => `
    <figure data-t="${f.t}">
      ${cutTimes.has(Math.round(f.t)) && f.t > 0 ? '<i class="cutmark"></i>' : ""}
      <img src="${f.src}" loading="lazy" alt="">
      <figcaption>${Math.round(f.t)}s</figcaption>
    </figure>`).join("");
}

function thread(b) {
  const t = b.thread || [];
  if (!t.length) return "";
  return `<div class="ai-thread">` + t.map((m) => `
    <div class="msg ${m.role}">
      <span class="who">${m.role === "user" ? (m.kind || "note") : "agent"}</span>
      <span class="body">${esc(m.text)}</span>
      ${m.role === "user" ? `<span class="st ${m.status}">${
        m.status === "done" ? "done" : m.status === "failed" ? "failed" : "working…"
      }</span>` : ""}
    </div>`).join("") + `</div>`;
}

function render() {
  const keep = project.beats.filter((b) => b.included && b.status !== "rejected");
  const dur = keep.reduce((a, b) => a + (b.trimEnd - b.trimStart), 0);
  const appr = project.beats.filter((b) => b.status === "approved").length;
  const rej = project.beats.filter((b) => b.status === "rejected").length;
  $("stats").innerHTML = `
    <span class="pill">shots <b>${project.beats.length}</b></span>
    <span class="pill ok">approved <b>${appr}</b></span>
    <span class="pill bad">rejected <b>${rej}</b></span>
    <span class="pill">cut length <b>${dur.toFixed(1)}s</b> / ${project.duration.toFixed(1)}s</span>`;

  ensurePolling();
  beatsEl.innerHTML = project.beats.map((b) => `
    <div class="beat ${b.status} ${b.included ? "" : "excluded"}" data-id="${b.id}">
      <div class="beat-top" data-seek="${b.trimStart}">
        <img src="${b.thumb}" loading="lazy" alt="">
        <span class="beat-no">${b.index + 1}</span>
        <span class="beat-dur">${(b.trimEnd - b.trimStart).toFixed(1)}s</span>
      </div>
      <div class="beat-body">
        <div class="beat-time">${fmt(b.trimStart)} → ${fmt(b.trimEnd)}</div>
        <div class="trim">
          <span>in</span>
          <input type="range" class="t-in" min="${b.start}" max="${b.end}" step="0.05" value="${b.trimStart}">
        </div>
        <div class="trim">
          <span>out</span>
          <input type="range" class="t-out" min="${b.start}" max="${b.end}" step="0.05" value="${b.trimEnd}">
        </div>
        <input class="fld f-broll" placeholder="B-roll / asset…" value="${esc(b.broll)}">
        <input class="fld f-sfx" placeholder="SFX cues, comma separated…" value="${esc((b.sfx || []).join(", "))}">
        <textarea class="fld f-notes" placeholder="Notes…">${esc(b.notes)}</textarea>
        <div class="acts">
          <button class="yes ${b.status === "approved" ? "on" : ""}">✓</button>
          <button class="no ${b.status === "rejected" ? "on" : ""}">✕</button>
          <button class="keep ${b.included ? "" : "off"}">${b.included ? "in cut" : "dropped"}</button>
        </div>
        <div class="ai">
          <div class="ai-h">Brief the agent on this shot</div>
          ${thread(b)}
          <select class="fld ai-kind">
            <option value="animation">Change the animation</option>
            <option value="text">Change the on-screen text</option>
            <option value="timing">Change timing / pacing</option>
            <option value="color">Change colour / look</option>
            <option value="add">Add an element</option>
            <option value="remove">Remove an element</option>
            <option value="voice">Change the voice line</option>
            <option value="other">Something else</option>
          </select>
          <textarea class="fld ai-text" placeholder="What should change in this frame?"></textarea>
          <button class="send">Send to agent →</button>
        </div>
      </div>
    </div>`).join("");
}

const save = (id, patch) =>
  fetch(`/api/project/${project.videoId}/beat/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

// --- interactions ---
stripEl.addEventListener("click", (e) => {
  const fg = e.target.closest("figure");
  if (!fg) return;
  player.currentTime = parseFloat(fg.dataset.t);
  player.play();
});

beatsEl.addEventListener("click", (e) => {
  const card = e.target.closest(".beat");
  if (!card) return;
  const b = project.beats.find((x) => x.id === card.dataset.id);

  if (e.target.closest(".beat-top")) {
    player.currentTime = b.trimStart;
    player.play();
  } else if (e.target.matches(".yes")) {
    b.status = b.status === "approved" ? "pending" : "approved";
    save(b.id, { status: b.status }); render();
  } else if (e.target.matches(".no")) {
    b.status = b.status === "rejected" ? "pending" : "rejected";
    save(b.id, { status: b.status }); render();
  } else if (e.target.matches(".keep")) {
    b.included = !b.included;
    save(b.id, { included: b.included }); render();
  } else if (e.target.matches(".send")) {
    const box = card.querySelector(".ai-text");
    const kind = card.querySelector(".ai-kind").value;
    const text = box.value.trim();
    if (!text) { toast("Write what should change first"); return; }
    fetch(`/api/project/${project.videoId}/beat/${b.id}/instruct`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, text }),
    }).then((r) => r.json()).then((j) => {
      if (j.thread) { b.thread = j.thread; render(); toast(`Queued for shot ${b.index + 1}`); }
      else toast(j.error || "Could not queue");
    });
  }
});

beatsEl.addEventListener("input", (e) => {
  const card = e.target.closest(".beat");
  if (!card) return;
  const b = project.beats.find((x) => x.id === card.dataset.id);

  if (e.target.matches(".t-in")) {
    b.trimStart = Math.min(parseFloat(e.target.value), b.trimEnd - 0.1);
    card.querySelector(".beat-time").textContent = `${fmt(b.trimStart)} → ${fmt(b.trimEnd)}`;
    card.querySelector(".beat-dur").textContent = `${(b.trimEnd - b.trimStart).toFixed(1)}s`;
    player.currentTime = b.trimStart;
  } else if (e.target.matches(".t-out")) {
    b.trimEnd = Math.max(parseFloat(e.target.value), b.trimStart + 0.1);
    card.querySelector(".beat-time").textContent = `${fmt(b.trimStart)} → ${fmt(b.trimEnd)}`;
    card.querySelector(".beat-dur").textContent = `${(b.trimEnd - b.trimStart).toFixed(1)}s`;
    player.currentTime = b.trimEnd;
  }
});

beatsEl.addEventListener("change", (e) => {
  const card = e.target.closest(".beat");
  if (!card) return;
  const b = project.beats.find((x) => x.id === card.dataset.id);
  if (e.target.matches(".t-in") || e.target.matches(".t-out")) {
    save(b.id, { trimStart: b.trimStart, trimEnd: b.trimEnd }).then(render);
  } else if (e.target.matches(".f-broll")) {
    b.broll = e.target.value; save(b.id, { broll: b.broll });
  } else if (e.target.matches(".f-sfx")) {
    b.sfx = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
    save(b.id, { sfx: b.sfx });
  } else if (e.target.matches(".f-notes")) {
    b.notes = e.target.value; save(b.id, { notes: b.notes });
  }
});

// transport
$("play").addEventListener("click", () => (player.paused ? player.play() : player.pause()));
player.addEventListener("play", () => ($("play").textContent = "❚❚"));
player.addEventListener("pause", () => ($("play").textContent = "▶"));
player.addEventListener("timeupdate", () => {
  const p = player.duration ? player.currentTime / player.duration : 0;
  fill.style.width = `${p * 100}%`;
  head.style.left = `${p * 100}%`;
  $("time").textContent = `${fmt(player.currentTime)} / ${fmt(player.duration || 0)}`;
  const t = Math.round(player.currentTime);
  stripEl.querySelectorAll("figure").forEach((f) => {
    f.classList.toggle("active", Math.round(parseFloat(f.dataset.t)) === t);
  });
});
scrub.addEventListener("click", (e) => {
  const r = scrub.getBoundingClientRect();
  player.currentTime = ((e.clientX - r.left) / r.width) * (player.duration || 0);
});

pick.addEventListener("change", () => load(pick.value));
$("regen").addEventListener("click", async () => {
  toast("Re-analysing…", 8000);
  project = await (await fetch(`/api/project/${project.videoId}/regenerate`, { method: "POST" })).json();
  renderStrip(); render(); toast("Re-analysed");
});
$("export").addEventListener("click", async () => {
  toast("Rendering cut…", 60000);
  const r = await fetch(`/api/project/${project.videoId}/export`, { method: "POST" });
  const j = await r.json();
  toast(j.ok ? `Exported ${j.segments} shots · ${j.duration.toFixed(1)}s → Instagram / YouTube / Facebook folders` : `Export failed: ${j.error}`, 6000);
});


// While a subagent is running, poll its thread so the answer lands by itself.
let pollTimer = null;
function ensurePolling() {
  const busy = project && project.beats.some((b) =>
    (b.thread || []).some((m) => m.role === "user" && m.status === "running"));
  if (busy && !pollTimer) {
    pollTimer = setInterval(async () => {
      if (!project) return;
      try {
        const t = await (await fetch(`/api/project/${project.videoId}/threads`)).json();
        let changed = false;
        project.beats.forEach((b) => {
          const next = t[b.id] || [];
          if (JSON.stringify(next) !== JSON.stringify(b.thread || [])) { b.thread = next; changed = true; }
        });
        if (changed) render();
        const stillBusy = project.beats.some((b) =>
          (b.thread || []).some((m) => m.role === "user" && m.status === "running"));
        if (!stillBusy) { clearInterval(pollTimer); pollTimer = null; toast("Agent finished"); }
      } catch { /* keep polling */ }
    }, 4000);
  }
}

boot();
