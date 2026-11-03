/* Ten Days — Day 6: twenty miles an hour.
 *
 * Same template. The first episode where you are safe, and safety is the
 * mistake: you stop checking. Plant: 32 carriages, you checked 11, the rest
 * were sealed (as a diagram). Recall: the brake is pulled from carriage 32,
 * the one you did not check. The radio loop plays whole for the first time
 * and names the rig (Days 8-9); "six-two south" is where Day 10 ends.
 *
 * Deterministic throughout — no unseeded randomness anywhere.
 */

function figure(pose, x, y, s = 1, tone = "#1c2538") {
  const hood = "#2a3650", skin = "#d9b08c", pack = "#3a4a6a";
  let body;
  if (pose === "seat") {
    body = `<rect x="-70" y="-10" width="140" height="150" rx="34" fill="${hood}"/>
      <rect x="-50" y="60" width="60" height="110" rx="22" fill="${tone}"/>
      <circle cx="-8" cy="-50" r="52" fill="${hood}"/><circle cx="4" cy="-44" r="34" fill="${skin}"/>
      <rect x="-26" y="-56" width="56" height="26" rx="12" fill="${hood}"/>`;
  } else if (pose === "crouch") {
    body = `<rect x="-90" y="20" width="180" height="120" rx="48" fill="${hood}"/>
      <rect x="-100" y="-30" width="70" height="90" rx="26" fill="${pack}"/>
      <circle cx="30" cy="-30" r="50" fill="${hood}"/><circle cx="40" cy="-24" r="32" fill="${skin}"/>
      <rect x="6" y="-40" width="60" height="24" rx="12" fill="${hood}"/>`;
  } else if (pose === "back") {
    body = `<rect x="-62" y="-30" width="124" height="200" rx="40" fill="${hood}"/>
      <rect x="-40" y="-10" width="80" height="120" rx="24" fill="${pack}"/>
      <rect x="-44" y="160" width="34" height="110" rx="14" fill="${tone}"/>
      <rect x="10" y="160" width="34" height="100" rx="14" fill="${tone}"/>
      <circle cx="0" cy="-80" r="52" fill="${hood}"/>`;
  } else { // peer
    body = `<rect x="-64" y="-20" width="128" height="200" rx="40" fill="${hood}"/>
      <rect x="-104" y="-6" width="60" height="120" rx="24" fill="${pack}"/>
      <circle cx="14" cy="-68" r="54" fill="${hood}"/><circle cx="22" cy="-62" r="36" fill="${skin}"/>
      <rect x="-14" y="-78" width="64" height="26" rx="13" fill="${hood}"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})">${body}</g>`;
}

/* the driver's cab from behind: windscreen with the line streaking past, console */
function cab(streakId, night = false) {
  const sky = night ? "#04060b" : "#0a1120";
  let streaks = "";
  for (let i = 0; i < 26; i++) {
    const y = 40 + ((i * 53) % 540), w = 120 + ((i * 97) % 420), x = (i * 331) % 1800;
    streaks += `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:3px;border-radius:2px;background:${night ? "#2b3a58" : "#4a5f8c"};opacity:${0.25 + ((i * 7) % 5) * 0.12};"></div>`;
  }
  return `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:90px;top:240px;width:900px;height:620px;border-radius:40px 40px 18px 18px;background:linear-gradient(180deg,${sky},#0f1727);border:10px solid #2a3449;overflow:hidden;">
    <div id="${streakId}" style="position:absolute;left:0;top:0;width:1800px;height:100%;">${streaks}</div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:140px;background:linear-gradient(0deg,#1b2435,transparent);"></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:860px;height:400px;background:linear-gradient(180deg,#1f2a3f,#121a28);border-top:8px solid #33425e;"></div>
  ${[230, 540, 850].map((x) => `<div style="position:absolute;left:${x - 70}px;top:920px;width:140px;height:140px;border-radius:50%;background:#0b111b;border:5px solid #3a4967;"></div>
    <div style="position:absolute;left:${x - 3}px;top:940px;width:6px;height:62px;border-radius:3px;background:var(--amber);transform-origin:50% 100%;transform:rotate(${x === 540 ? 30 : -35}deg);"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:1260px;bottom:0;background:#0a0f17;"></div>`;
}

/* a speed dial: half circle, red zone under 20, needle at v */
function dial(cx, cy, r, v, ids = {}, max = 80) {
  const P = (a, rr) => `${(cx - rr * Math.cos(a * Math.PI / 180)).toFixed(1)},${(cy - rr * Math.sin(a * Math.PI / 180)).toFixed(1)}`;
  const za = (20 / max) * 180;
  let h = `<svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M${P(0, r)} A${r},${r} 0 0 1 ${P(180, r)}" stroke="#2b374f" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path id="${ids.zone || "zone"}" d="M${P(0, r)} A${r},${r} 0 0 1 ${P(za, r)}" stroke="var(--red)" stroke-width="26" fill="none" stroke-linecap="round" opacity=".85"/>`;
  for (let k = 0; k <= 4; k++) {
    const a = k * 45;
    h += `<text x="${P(a, r - 70).split(",")[0]}" y="${P(a, r - 70).split(",")[1]}" fill="#7d8aa6" font-size="30" font-weight="700" text-anchor="middle" dominant-baseline="middle">${k * 20}</text>`;
  }
  h += `<g id="${ids.needle || "needle"}" transform="rotate(${(v / max) * 180} ${cx} ${cy})">
      <line x1="${cx}" y1="${cy}" x2="${cx - r * 0.82}" y2="${cy}" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>
    <circle cx="${cx}" cy="${cy}" r="22" fill="#fff"/>
  </svg>
  <div id="${ids.read || "read"}" style="position:absolute;left:0;right:0;top:${cy + 40}px;text-align:center;color:#fff;font-size:96px;font-weight:800;font-variant-numeric:tabular-nums;">${v}</div>
  <div style="position:absolute;left:0;right:0;top:${cy + 160}px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">MPH</div>`;
  return h;
}

/* the train from above: 32 carriages as a snake, the first `checked` lit */
function diagram(checked) {
  let h = `<div style="position:absolute;left:60px;right:60px;top:620px;height:600px;border-radius:18px;background:#0d1422;border:4px solid #2b3650;"></div>
  <div style="position:absolute;left:110px;top:650px;color:#55617a;font-size:22px;letter-spacing:6px;">32 CARRIAGES</div>
  <div style="position:absolute;left:110px;top:700px;width:60px;height:130px;border-radius:10px 14px 14px 10px;background:#2a3650;border:4px solid var(--amber);"></div>`;
  for (let i = 0; i < 32; i++) {
    const row = i < 16 ? 0 : 1, col = row === 0 ? i : 31 - i;
    const x = 184 + col * 50, y = 700 + row * 250, n = i + 1, done = n <= checked;
    h += `<div id="c${n}" style="position:absolute;left:${x}px;top:${y}px;width:42px;height:130px;border-radius:6px;background:${done ? "#1d5742" : "#1a2234"};border:3px solid ${done ? "#5df2b0" : "#3a4967"};">
      ${done ? "" : `<div style="position:absolute;left:11px;top:8px;width:14px;height:12px;border:3px solid #5a4a2e;border-radius:3px;"></div>`}</div>`;
  }
  h += `<div style="position:absolute;left:184px;top:840px;color:#5df2b0;font-size:22px;letter-spacing:4px;">1</div>
  <div style="position:absolute;left:174px;top:1090px;color:#7d8aa6;font-size:22px;letter-spacing:4px;">32</div>`;
  return h;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#0d0a06;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1300px;background:linear-gradient(180deg,#1a140c,#120d07);"></div>
  ${[160, 300, 440, 580, 720, 860].map((x, i) => `<div style="position:absolute;left:${x}px;top:${560 + (i % 2) * 40}px;width:24px;height:300px;border-radius:12px;background:#5a4a2e;transform-origin:50% 100%;transform:rotate(${(i % 2 ? 14 : -10)}deg);"></div>
    <div style="position:absolute;left:${x - 10}px;top:${540 + (i % 2) * 40}px;width:44px;height:44px;border-radius:50%;background:var(--red);"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:860px;height:40px;background:#3a2e1e;"></div>
  <div style="position:absolute;left:380px;top:300px;width:320px;height:200px;border-radius:10px;background:#241c12;border:4px solid #5a4a2e;"></div>
  ${[420, 500].map((x) => `<div style="position:absolute;left:${x}px;top:360px;width:40px;height:70px;border-radius:6px;background:#6d5a26;"></div>`).join("")}
  <div style="position:absolute;left:580px;top:360px;width:40px;height:70px;border-radius:6px;border:3px dashed #6d5a26;"></div>
  <div style="position:absolute;left:0;right:0;top:1300px;bottom:0;background:#0c0905;"></div>
  <div class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1060px;font-size:30px;">NOBODY. ONE KEY GONE.</div>
  <div class="vign"></div>`);

mk("hook", `${cab("streaks1")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 540, 800, 1.35)}</svg>
  <div id="checks" style="position:absolute;right:70px;top:1300px;width:330px;border-radius:14px;background:#0b111bdd;border:3px solid #2b3650;padding:16px 22px;color:#9fb0d0;font-size:26px;letter-spacing:3px;line-height:1.5;">
    <div style="color:#55617a;font-size:20px;letter-spacing:6px;">CHECKS</div>
    <div>01:40 <span style="color:#5df2b0">✓</span></div>
    <div>02:00 <span style="color:#5df2b0">✓</span></div>
    <div>02:20 <span id="chk3" style="color:#5df2b0;opacity:0">✓</span></div>
    <div id="chk4" style="opacity:.45">02:40 —</div>
  </div>
  <div id="safe" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:140px;font-size:30px;opacity:0;">NOTHING CAN REACH YOU</div>
  <div class="vign"></div>`);

mk("wide", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:760px;background:linear-gradient(180deg,#070b14,#0f1626);"></div>
  <div id="strip" style="position:absolute;left:60px;top:520px;width:3000px;height:170px;">
    <div style="position:absolute;left:0;top:10px;width:170px;height:130px;border-radius:40px 12px 10px 10px;background:#2a3650;border:4px solid var(--amber);"></div>
    ${Array.from({ length: 16 }, (_, i) => `<div style="position:absolute;left:${200 + i * 176}px;top:30px;width:156px;height:110px;border-radius:8px;background:#1f2a3f;border:4px solid #3a4967;"></div>`).join("")}
  </div>
  <div style="position:absolute;left:0;right:0;top:690px;height:8px;background:#4a5775;"></div>
  <div style="position:absolute;left:0;right:0;top:700px;height:60px;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  ${dial(540, 1290, 330, 54)}
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:830px;font-size:28px;">UNDER 20 · THEY BOARD</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "HOLD THE SWITCH.<br>LET GO, IT STOPS.", "sixty seconds, then the brakes"));

mk("obey1", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(180deg,#121a28,#0a0f17);"></div>
  <!-- the dead-man's switch, close: a big button, a thumb on it, a lamp that stays lit -->
  <div style="position:absolute;left:190px;top:560px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle at 50% 40%,#2a3650,#121a28);border:12px solid #33425e;"></div>
  <div style="position:absolute;left:300px;top:670px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#3a4967,#1f2a3f);border:10px solid #4a5a7c;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <rect x="470" y="560" width="140" height="420" rx="64" fill="#d9b08c" transform="rotate(-14 540 770)"/>
    <rect x="455" y="820" width="170" height="130" rx="50" fill="#d9b08c"/>
  </svg>
  <div id="held" style="position:absolute;left:50%;transform:translateX(-50%);top:1320px;display:flex;align-items:center;gap:18px;">
    <div style="width:26px;height:26px;border-radius:50%;background:#5df2b0;box-shadow:0 0 24px #5df2b0;"></div>
    <div style="color:#5df2b0;font-size:30px;letter-spacing:8px;font-weight:800;">HELD</div></div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:1400px;color:#55617a;font-size:22px;letter-spacing:6px;">COUNTDOWN 60 · NEVER STARTS</div>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${diagram(11)}
  <div id="chk11" style="position:absolute;left:0;right:0;top:1300px;text-align:center;color:#5df2b0;font-size:30px;letter-spacing:6px;font-weight:800;">CHECKED · 11</div>
  <div id="sealed" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1370px;font-size:30px;opacity:0;">THE REST · SEALED</div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "SLEEP IN<br>20-MINUTE BLOCKS.", "never longer"));

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <circle cx="540" cy="880" r="270" stroke="#2b374f" stroke-width="22" fill="none"/>
    <circle id="ring" cx="540" cy="880" r="270" stroke="var(--amber)" stroke-width="22" fill="none" stroke-linecap="round" transform="rotate(-90 540 880)"/>
  </svg>
  <div id="tmr" style="position:absolute;left:0;right:0;top:810px;text-align:center;color:#fff;font-size:120px;font-weight:800;font-variant-numeric:tabular-nums;">20:00</div>
  <div style="position:absolute;left:0;right:0;top:960px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">BLOCK</div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:1260px;display:flex;gap:40px;">
    ${[1, 2, 3].map((k) => `<div id="t${k}" style="width:150px;height:84px;border-radius:14px;border:4px solid var(--amber);color:var(--amber);display:grid;place-items:center;font-size:40px;font-weight:800;opacity:.22;">20</div>`).join("")}
  </div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:250px;top:520px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>
  <!-- the whole loop this time: every bar blue, none red -->
  <div style="position:absolute;left:90px;right:90px;top:900px;height:220px;display:flex;align-items:center;gap:6px;">
    ${Array.from({ length: 60 }, (_, i) => `<div class="lb" style="flex:1;height:${24 + ((i * 37) % 23) * 7}px;border-radius:4px;background:#5aa9ff;opacity:0;"></div>`).join("")}
  </div>
  <div style="position:absolute;left:0;right:0;top:1140px;text-align:center;color:#55617a;font-size:22px;letter-spacing:6px;">WHOLE, FOR THE FIRST TIME</div>
  <div style="position:absolute;left:0;right:0;top:1220px;text-align:center;">
    <span id="rigword" style="display:inline-block;color:var(--amber);font-size:56px;font-weight:800;letter-spacing:6px;">RIG BRAVO · 62 SOUTH</span></div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "DO NOT STOP.<br>FOR ANYTHING ON THE LINE.", ""));

mk("obey3", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:60px;right:60px;top:420px;height:1060px;border-radius:18px;background:#141b28;border:4px solid #2b3650;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M540,520 L540,1400" stroke="#3a4560" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="28 18"/>
    ${figure("peer", 600, 1000, 0.55)}
    <circle id="traindot" cx="540" cy="540" r="26" fill="var(--amber)"/>
  </svg>
  <div style="position:absolute;left:0;right:0;top:450px;text-align:center;color:#55617a;font-size:22px;letter-spacing:6px;">YOU</div>
  <div style="position:absolute;left:0;right:0;top:1410px;text-align:center;color:var(--amber);font-size:26px;letter-spacing:6px;font-weight:800;">THE COAST</div>
  <div id="range" style="position:absolute;left:120px;top:900px;color:#fff;font-size:44px;font-weight:800;line-height:1.1;">1,000<br><span style="font-size:22px;color:#55617a;letter-spacing:5px;">MILES OF RANGE</span></div>
  <div style="position:absolute;right:120px;top:900px;text-align:right;color:#fff;font-size:44px;font-weight:800;line-height:1.1;">2<br><span style="font-size:22px;color:#55617a;letter-spacing:5px;">DAYS</span></div>
  <div class="vign"></div>`);

mk("slow", `${cab("streaks2", true)}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 540, 800, 1.35)}</svg>
  <!-- the engine note, as bars that drop; the switch lamp, still green -->
  <div style="position:absolute;left:80px;top:1300px;width:400px;height:150px;display:flex;align-items:flex-end;gap:8px;">
    ${Array.from({ length: 18 }, (_, i) => `<div class="eb" style="flex:1;height:${60 + ((i * 29) % 17) * 5}px;border-radius:3px;background:#5aa9ff;transform-origin:50% 100%;"></div>`).join("")}
  </div>
  <div style="position:absolute;left:80px;top:1460px;color:#55617a;font-size:20px;letter-spacing:6px;">ENGINE NOTE</div>
  <div id="held2" style="position:absolute;right:120px;top:1340px;display:flex;align-items:center;gap:18px;">
    <div style="width:26px;height:26px;border-radius:50%;background:#5df2b0;box-shadow:0 0 24px #5df2b0;"></div>
    <div style="color:#5df2b0;font-size:30px;letter-spacing:8px;font-weight:800;">HELD</div></div>
  <div class="vign"></div>`);

mk("gauge", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${dial(540, 1000, 400, 54, { needle: "needle2", read: "spd", zone: "zone2" })}
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1260px;font-size:28px;">UNDER 20 · THEY BOARD</div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${diagram(11)}
  <div id="c32hot" style="position:absolute;left:184px;top:950px;width:42px;height:130px;border-radius:6px;background:var(--red);box-shadow:0 0 30px var(--red);opacity:0;"></div>
  <div id="brakestamp" class="stamp" style="top:420px;font-size:64px;opacity:0;">BRAKE PULLED</div>
  <div id="unchecked" class="stamp" style="top:1300px;font-size:64px;opacity:0;">UNCHECKED</div>
  <div class="vign"></div>`);
