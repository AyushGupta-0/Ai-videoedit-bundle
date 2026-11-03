/* Ten Days — Day 5: the signal box.
 *
 * Same template. This is the series' reversal episode: the radio loop that has
 * saved you every night plays its second half, and it is a warning. The plant
 * is "all rail staff evacuated on day one" (on the radio, as a badge); the
 * recall is "there is no driver" when a voice claims to be one.
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

/* a railway line in perspective: two rails, sleepers, fences both sides */
function railway() {
  let h = `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#070b14 0%,#0d1422 46%,#141b28 48%,#0b1119 100%);"></div>`;
  for (let i = 0; i < 16; i++) {
    const t = i / 15, y = 920 + Math.pow(t, 1.8) * 760, w = 40 + t * 700, hgt = 4 + t * 22;
    h += `<div style="position:absolute;left:${540 - w / 2}px;top:${y}px;width:${w}px;height:${hgt}px;border-radius:3px;background:#3a4560;opacity:${0.2 + t * 0.7};"></div>`;
  }
  h += `<svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M520,920 L300,1700" stroke="#6b7fa8" stroke-width="10" fill="none"/>
    <path d="M560,920 L780,1700" stroke="#6b7fa8" stroke-width="10" fill="none"/>
    <path d="M470,900 L60,1500" stroke="#2b3650" stroke-width="6" fill="none"/>
    <path d="M610,900 L1020,1500" stroke="#2b3650" stroke-width="6" fill="none"/>
  </svg>`;
  return h;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,#070b14 0%,#0d1422 48%,#151c2a 50%,#0b1119 100%);"></div>
  <div style="position:absolute;left:190px;top:300px;width:700px;height:300px;border-radius:40px;background:linear-gradient(180deg,#0a1020,#060a12);border:8px solid #2a3449;"></div>
  <div style="position:absolute;left:0;right:0;top:1180px;bottom:0;background:linear-gradient(180deg,#192234,#0a0f17);"></div>
  <div style="position:absolute;left:170px;top:1420px;width:740px;height:740px;border-radius:50%;border:36px solid #141c2c;"></div>
  <div class="vign"></div>`);

mk("hook", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:120px;height:600px;background:linear-gradient(180deg,#1a2a44,#0e1726);"></div>
  <div style="position:absolute;left:0;right:0;top:720px;bottom:0;background:linear-gradient(180deg,#192234,#0d1422);"></div>
  <svg id="hookfig" width="1080" height="1920" style="position:absolute;inset:0;">${figure("seat", 540, 980, 2.4)}</svg>
  <div id="fuel11" style="position:absolute;left:720px;top:1320px;width:220px;height:120px;border-radius:14px;background:#0b111b;border:4px solid var(--red);display:grid;place-items:center;color:var(--red);font-size:44px;font-weight:800;">11 MI</div>
  <div class="vign"></div>`);

mk("bridge", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">EVERY ROAD SOUTH</div>
  <div style="position:absolute;left:60px;right:60px;top:560px;height:860px;border-radius:18px;background:#141b28;border:4px solid #2b3650;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path id="r1" d="M150,640 L540,1120" stroke="#3a4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="r2" d="M540,620 L540,1120" stroke="#3a4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="r3" d="M930,640 L540,1120" stroke="#3a4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="r4" d="M120,900 L540,1120" stroke="#3a4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="r5" d="M960,900 L540,1120" stroke="#3a4560" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="500" y="1120" width="80" height="60" rx="10" fill="var(--amber)"/>
    <path d="M540,1180 L540,1380" stroke="#3a4560" stroke-width="10" fill="none"/>
    <path id="queue" d="M540,1110 L540,660" stroke="var(--red)" stroke-width="22" fill="none" stroke-dasharray="14 10"/>
  </svg>
  <div style="position:absolute;left:0;right:0;top:1200px;text-align:center;color:var(--amber);font-size:26px;letter-spacing:6px;font-weight:800;">ONE BRIDGE</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "WALK THE SLEEPERS<br>NEVER THE BALLAST", "stone is loud"));

mk("obey1", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div id="rail" style="position:absolute;inset:0;">${railway()}</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 540, 1330, 1.7)}</svg>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:720px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;"><rect x="800" y="860" width="60" height="150" rx="26" fill="#d9b08c" transform="rotate(-20 830 935)"/></svg>
  <div id="staffbadge" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1100px;font-size:30px;opacity:0;">RAIL STAFF: GONE DAY 1</div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "COUNT BRIDGES,<br>NOT MILES", ""));

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;opacity:.7;">${railway()}</div>
  <!-- four bridges, as arcs over the line, lighting one by one -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    ${[0, 1, 2, 3].map((i) => { const t = i / 3, y = 1500 - t * 420, w = 520 - t * 320;
      return `<path id="br${i}" d="M${540 - w / 2},${y} Q540,${y - w * 0.35} ${540 + w / 2},${y}" stroke="#4a5775" stroke-width="${12 - t * 6}" fill="none" opacity=".35"/>`; }).join("")}
  </svg>
  <div id="brcount" style="position:absolute;left:0;right:0;top:560px;text-align:center;color:#fff;font-size:92px;font-weight:800;font-variant-numeric:tabular-nums;">0</div>
  <div style="position:absolute;left:0;right:0;top:680px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">BRIDGES</div>
  <div class="vign"></div>`);

mk("good", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,#070b14,#0f1626);"></div>
  <!-- the locomotive: a long dark block, one lit cab window, idling -->
  <div style="position:absolute;left:60px;top:760px;width:960px;height:520px;border-radius:30px 60px 12px 12px;background:linear-gradient(180deg,#2a3650,#171f30);border:6px solid #3a4967;"></div>
  <div id="cabwin" style="position:absolute;left:760px;top:820px;width:180px;height:140px;border-radius:14px;background:#5a4a1e;border:4px solid var(--amber);box-shadow:0 0 40px rgba(240,169,60,.35);"></div>
  ${[160, 400, 640].map((x) => `<div style="position:absolute;left:${x}px;top:1300px;width:120px;height:120px;border-radius:50%;background:#1a2234;border:8px solid #3a4967;"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:1440px;bottom:0;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div id="idle" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:640px;font-size:30px;">IDLING · NOBODY IN THE CAB</div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "NEVER SHELTER<br>WITH ONE DOOR", ""));

mk("bad", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1400px;background:linear-gradient(180deg,#070b14,#0f1626);"></div>
  <!-- the signal box: a wooden room on stilts, one staircase, one door -->
  <div style="position:absolute;left:260px;top:520px;width:560px;height:420px;border-radius:12px;background:linear-gradient(180deg,#3a2e1e,#241c12);border:6px solid #5a4a2e;"></div>
  ${[300, 440, 580, 720].map((x) => `<div style="position:absolute;left:${x}px;top:580px;width:90px;height:150px;border-radius:6px;background:#0b111b;border:4px solid #5a4a2e;"></div>`).join("")}
  <div id="boxdoor" style="position:absolute;left:470px;top:760px;width:120px;height:180px;border-radius:6px 6px 0 0;background:#0b111b;border:5px solid #6d5a26;"></div>
  ${[320, 740].map((x) => `<div style="position:absolute;left:${x}px;top:940px;width:40px;height:460px;background:#2a2218;"></div>`).join("")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M530,940 L380,1400" stroke="#5a4a2e" stroke-width="14" fill="none"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${530 - i * 19},${940 + i * 57} L${590 - i * 19},${940 + i * 57}" stroke="#6d5a26" stroke-width="8"/>`).join("")}
    ${figure("peer", 880, 1330, 1.1)}
  </svg>
  <div style="position:absolute;left:0;right:0;top:1400px;bottom:0;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div id="onedoor" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:400px;font-size:30px;">ONE ROOM · ONE DOOR</div>
  <div class="vign"></div>`);

mk("inside", `<div style="position:absolute;inset:0;background:#0d0a06;"></div>
  <!-- inside the box: a row of levers, a key board, you at it -->
  <div style="position:absolute;left:0;right:0;top:0;height:1300px;background:linear-gradient(180deg,#1a140c,#120d07);"></div>
  ${[160, 300, 440, 580, 720, 860].map((x, i) => `<div style="position:absolute;left:${x}px;top:${560 + (i % 2) * 40}px;width:24px;height:300px;border-radius:12px;background:#5a4a2e;transform-origin:50% 100%;transform:rotate(${(i % 2 ? 14 : -10)}deg);"></div>
    <div style="position:absolute;left:${x - 10}px;top:${540 + (i % 2) * 40}px;width:44px;height:44px;border-radius:50%;background:var(--red);"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:860px;height:40px;background:#3a2e1e;"></div>
  <div id="keyboard" style="position:absolute;left:380px;top:300px;width:320px;height:200px;border-radius:10px;background:#241c12;border:4px solid #5a4a2e;"></div>
  ${[420, 500, 580].map((x) => `<div style="position:absolute;left:${x}px;top:360px;width:40px;height:70px;border-radius:6px;background:#6d5a26;"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:1300px;bottom:0;background:#0c0905;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("crouch", 540, 1150, 2.0, "#241c12")}</svg>
  <div class="vign"></div>`);

mk("creak", `<div style="position:absolute;inset:0;background:#0d0a06;"></div>
  <!-- the stairwell opening in the floor behind you, and light coming UP it -->
  <div style="position:absolute;left:0;right:0;top:0;height:1300px;background:linear-gradient(180deg,#1a140c,#120d07);"></div>
  <div style="position:absolute;left:300px;top:900px;width:480px;height:420px;border-radius:8px;background:#05030100;border:6px solid #3a2e1e;overflow:hidden;">
    <div id="stairlight" style="position:absolute;left:0;right:0;bottom:0;height:0px;background:linear-gradient(0deg,#8aa0cc,#3a2e1e00);"></div>
    ${Array.from({ length: 6 }, (_, i) => `<div style="position:absolute;left:0;right:0;top:${60 + i * 60}px;height:6px;background:#241c12;"></div>`).join("")}
  </div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 190, 1250, 1.5, "#241c12")}</svg>
  <div class="vign"></div>`);

mk("voice", `<div style="position:absolute;inset:0;background:#0d0a06;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1300px;background:linear-gradient(180deg,#1a140c,#120d07);"></div>
  <div style="position:absolute;left:300px;top:700px;width:480px;height:620px;border-radius:8px;background:#05030a;border:6px solid #3a2e1e;overflow:hidden;">
    <div style="position:absolute;left:0;right:0;bottom:0;height:280px;background:linear-gradient(0deg,#8aa0cc55,transparent);"></div>
    <div style="position:absolute;left:170px;top:360px;width:140px;height:140px;border-radius:50%;background:#02030a;"></div>
    <div style="position:absolute;left:110px;top:490px;width:260px;height:200px;border-radius:90px 90px 0 0;background:#02030a;"></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;">
    <span id="drv" style="display:inline-block;color:var(--red);font-size:60px;font-weight:800;letter-spacing:8px;">DRIVER?</span></div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:250px;top:720px;width:580px;height:290px;border-radius:16px;background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#2a0e0e;border:3px solid #5c1f1f;display:flex;align-items:center;justify-content:center;">
      <span style="color:#ff6b6b;font-size:40px;font-weight:800;letter-spacing:3px;">CH 09</span></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1100px;font-size:30px;">RAIL STAFF: GONE DAY 1</div>
  <div id="nodriver" class="stamp" style="top:1230px;font-size:70px;opacity:0;">NO DRIVER</div>
  <div class="vign"></div>`);

mk("loop", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the loop as a waveform: the part you have always heard, then past it -->
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">THE LOOP</div>
  <div style="position:absolute;left:90px;right:90px;top:760px;height:300px;display:flex;align-items:center;gap:6px;" id="wave">
    ${Array.from({ length: 60 }, (_, i) => { const hgt = 30 + ((i * 37) % 23) * 9; const past = i >= 34;
      return `<div class="wb" style="flex:1;height:${hgt}px;border-radius:4px;background:${past ? "var(--red)" : "#5aa9ff"};opacity:${past ? 0 : 0.9};"></div>`; }).join("")}
  </div>
  <div id="heremark" style="position:absolute;left:${90 + 34 * (900 / 60)}px;top:700px;width:4px;height:420px;background:#fff;"></div>
  <div style="position:absolute;left:${90 + 34 * (900 / 60) - 90}px;top:1140px;width:180px;text-align:center;color:#fff;font-size:22px;letter-spacing:4px;">AS FAR AS IT GOES</div>
  <div id="warnword" style="position:absolute;left:0;right:0;top:1230px;text-align:center;color:var(--red);font-size:84px;font-weight:800;letter-spacing:8px;opacity:0;">WARNING</div>
  <div class="vign"></div>`);
