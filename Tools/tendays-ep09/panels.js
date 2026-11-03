/* Ten Days — Day 9: Rig Bravo.
 *
 * Same template. The safest building on Earth, and the episode where the
 * radio stops being trusted. Plant: "Hold at Rig Bravo" — the radio is
 * giving you instructions now. Recall: forty people, a year of food, zero
 * ways up — and the fortieth log entry is four words. The winter fuel sends
 * you four hundred miles further south, which is where Day 10 happens.
 *
 * Deterministic throughout — no unseeded randomness anywhere.
 */

function figure(pose, x, y, s = 1, tone = "#1c2538", hood = "#2a3650") {
  const skin = "#d9b08c", pack = "#3a4a6a";
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
const HER = "#5a3a2e";

/* the cockpit from behind, as in Day 8 */
function cockpit(night = false) {
  return `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:60px;top:200px;width:960px;height:640px;border-radius:70px 70px 20px 20px;background:linear-gradient(180deg,${night ? "#0a1526" : "#1b3a5f"} 0%,${night ? "#122a44" : "#4a86c0"} 58%,#0a1a2c 59%,#061020 100%);border:10px solid #2a3449;overflow:hidden;"></div>
  <div style="position:absolute;left:0;right:0;top:840px;height:420px;background:linear-gradient(180deg,#1f2a3f,#121a28);border-top:8px solid #33425e;"></div>
  ${[200, 420, 660, 880].map((x, i) => `<div style="position:absolute;left:${x - 54}px;top:900px;width:108px;height:108px;border-radius:50%;background:#0b111b;border:5px solid #3a4967;"></div>
    <div style="position:absolute;left:${x - 3}px;top:916px;width:6px;height:46px;border-radius:3px;background:var(--amber);transform-origin:50% 100%;transform:rotate(${[-40, 20, -10, 35][i]}deg);"></div>`).join("")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 330, 760, 1.15)}${figure("back", 750, 760, 1.15, "#1c2538", HER)}</svg>
  <div style="position:absolute;left:0;right:0;top:1260px;bottom:0;background:#0a0f17;"></div>`;
}

/* the rig, side on: four legs in the sea, a deck, modules, a helideck, a flare, one ladder */
function rig(k, night = false) {
  const sky = night ? "#04060b" : "#0b1626", mid = night ? "#0a1526" : "#122a44";
  let swell = "";
  for (let i = 0; i < 8; i++) swell += `<div style="position:absolute;left:0;right:0;top:${1500 + i * 30}px;height:3px;background:#1d3a5c;opacity:${0.2 + ((i * 5) % 4) * 0.12};"></div>`;
  const wins = [[280, 750], [340, 750], [400, 750], [460, 750], [600, 790], [660, 790], [720, 790]]
    .map(([x, y]) => `<div class="rigwin${k}" style="position:absolute;left:${x}px;top:${y}px;width:34px;height:26px;border-radius:3px;background:#f0d08a;opacity:.85;box-shadow:0 0 14px #f0d08a;"></div>`).join("");
  const lights = [140, 190, 240, 290, 340, 390]
    .map((x) => `<div class="decklight${k}" style="position:absolute;left:${x}px;top:676px;width:12px;height:12px;border-radius:50%;background:#5df2b0;box-shadow:0 0 16px #5df2b0;"></div>`).join("");
  return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,${sky} 0%,${mid} 77%,#0a1a2c 78%,#040a14 100%);"></div>
  ${swell}
  <div id="rigbody${k}" style="position:absolute;inset:0;">
    ${[300, 460, 620, 780].map((x) => `<div style="position:absolute;left:${x}px;top:960px;width:44px;height:540px;background:#2a3650;border:4px solid #3a4967;"></div>`).join("")}
    <svg width="1080" height="1920" style="position:absolute;inset:0;"><path d="M322,1000 L802,1300 M802,1000 L322,1300 M322,1300 L802,1490 M802,1300 L322,1490" stroke="#3a4967" stroke-width="6" fill="none"/></svg>
    <div style="position:absolute;left:220px;top:880px;width:680px;height:90px;background:#3a4967;border:4px solid #4a5a7c;"></div>
    <div style="position:absolute;left:260px;top:720px;width:300px;height:160px;background:#2a3650;border:4px solid #3a4967;"></div>
    <div style="position:absolute;left:580px;top:760px;width:220px;height:120px;background:#2a3650;border:4px solid #3a4967;"></div>
    ${wins}
    <div style="position:absolute;left:120px;top:690px;width:300px;height:22px;background:#4a5a7c;"></div>
    <div style="position:absolute;left:250px;top:640px;color:#9fb0d0;font-size:40px;font-weight:800;">H</div>
    <div style="position:absolute;left:180px;top:712px;width:30px;height:170px;background:#3a4967;"></div>
    ${lights}
    <div style="position:absolute;left:860px;top:520px;width:16px;height:360px;background:#3a4967;"></div>
    <div id="flare${k}" style="position:absolute;left:846px;top:470px;width:44px;height:60px;border-radius:50% 50% 40% 40%;background:#f0a93c;box-shadow:0 0 40px #f0a93c;"></div>
    <div id="ladder${k}" style="position:absolute;left:836px;top:980px;width:40px;height:520px;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:6px;background:#9fb0d0;"></div><div style="position:absolute;right:0;top:0;bottom:0;width:6px;background:#9fb0d0;"></div>
      ${Array.from({ length: 12 }, (_, i) => `<div style="position:absolute;left:0;right:0;top:${20 + i * 42}px;height:5px;background:#9fb0d0;"></div>`).join("")}
    </div>
  </div>`;
}

/* the radio, with the crank handle */
function radio(top) {
  return `<div style="position:absolute;left:250px;top:${top}px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>`;
}

/* the crew log as a page: two columns of entries */
function logPage() {
  const row = (n) => `<div class="lr" style="color:#9fb0d0;font-size:22px;letter-spacing:2px;line-height:44px;font-variant-numeric:tabular-nums;opacity:0;">DAY ${String(n).padStart(2, "0")} · ROUTINE</div>`;
  return `<div style="position:absolute;left:100px;right:100px;top:420px;height:1060px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;"></div>
  <div style="position:absolute;left:150px;top:450px;color:#55617a;font-size:22px;letter-spacing:6px;">CREW LOG · RIG BRAVO</div>
  <div style="position:absolute;left:150px;top:520px;width:380px;">${Array.from({ length: 20 }, (_, i) => row(i + 1)).join("")}</div>
  <div style="position:absolute;left:560px;top:520px;width:380px;">${Array.from({ length: 19 }, (_, i) => row(i + 21)).join("")}
    <div id="r40" style="color:#fff;font-size:22px;letter-spacing:2px;line-height:44px;opacity:0;">DAY 40 · <span id="cur" style="display:inline-block;width:14px;height:24px;background:var(--red);vertical-align:middle;"></span></div></div>`;
}

/* ============================ PANELS ============================ */

mk("recap", `${cockpit(true)}
  <div class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1320px;font-size:30px;">SILENCE · 2,000 FT</div>
  <div class="vign"></div>`);

mk("hook", `${rig("h")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M100,970 L100,1500" stroke="#9fb0d0" stroke-width="4" fill="none"/>
    <path d="M80,970 L120,970 M80,1500 L120,1500" stroke="#9fb0d0" stroke-width="4"/>
  </svg>
  <div style="position:absolute;left:40px;top:1200px;color:#fff;font-size:44px;font-weight:800;line-height:1;">180<br><span style="font-size:20px;color:#9fb0d0;letter-spacing:4px;">FEET</span></div>
  <div id="auto" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:380px;font-size:30px;opacity:0;">NO CREW · 40 DAYS ON AUTO</div>
  <div class="vign"></div>`);

mk("wide", `${rig("w")}
  <div style="position:absolute;left:60px;top:560px;color:#9fb0d0;font-size:22px;letter-spacing:5px;">ONE HELIDECK ↓</div>
  <div style="position:absolute;left:890px;top:1120px;width:180px;color:#9fb0d0;font-size:22px;letter-spacing:5px;">← ONE<br>LADDER</div>
  <div style="position:absolute;left:60px;top:1505px;color:#5aa9ff;font-size:22px;letter-spacing:5px;">4°C WATER</div>
  <div id="cant" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:380px;font-size:30px;opacity:0;">CAN'T SWIM · CAN'T CLIMB</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "RAISE THE<br>BOAT-LANDING LADDER.", ""));

mk("obey1", `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#0b1626 0%,#122a44 72%,#0a1a2c 73%,#040a14 100%);"></div>
  ${Array.from({ length: 6 }, (_, i) => `<div style="position:absolute;left:0;right:0;top:${1420 + i * 30}px;height:3px;background:#1d3a5c;opacity:${0.2 + ((i * 5) % 4) * 0.12};"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:300px;height:120px;background:#3a4967;border-bottom:6px solid #4a5a7c;"></div>
  <div style="position:absolute;left:380px;top:420px;width:200px;height:1100px;background:#2a3650;border:6px solid #3a4967;"></div>
  <div style="position:absolute;left:640px;top:330px;width:120px;height:80px;border-radius:14px;background:#1b2435;border:5px solid #4a5a7c;"></div>
  <div id="ladder2" style="position:absolute;left:660px;top:700px;width:80px;height:720px;">
    <div style="position:absolute;left:0;top:0;bottom:0;width:10px;background:#9fb0d0;"></div><div style="position:absolute;right:0;top:0;bottom:0;width:10px;background:#9fb0d0;"></div>
    ${Array.from({ length: 12 }, (_, i) => `<div style="position:absolute;left:0;right:0;top:${30 + i * 58}px;height:8px;background:#9fb0d0;"></div>`).join("")}
  </div>
  <div id="noway" class="stamp" style="top:1180px;font-size:64px;opacity:0;">NO WAY UP</div>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${radio(500)}
  <div id="hold" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:860px;font-size:30px;opacity:0;">HOLD AT RIG BRAVO</div>
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:980px;display:flex;gap:22px;">
    ${[["p1", "WATER"], ["p2", "POWER"], ["p3", "60 BUNKS"]].map(([id, t]) => `<div id="${id}" style="padding:14px 26px;border-radius:12px;border:3px solid #5df2b0;color:#5df2b0;font-size:26px;font-weight:800;letter-spacing:4px;opacity:0;">${t} ✓</div>`).join("")}
  </div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "KEEP THE HELIDECK<br>LIGHTS OFF.", ""));

mk("obey2", `${rig("n", true)}
  <div id="gone" class="stamp" style="top:380px;font-size:64px;opacity:0;">GONE</div>
  <div class="vign"></div>`);

mk("good", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:90px;right:90px;top:460px;height:420px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;"></div>
  <div style="position:absolute;left:130px;top:500px;display:grid;grid-template-columns:repeat(10,1fr);gap:12px;width:820px;">
    ${Array.from({ length: 60 }, () => `<div class="bunk" style="height:44px;border-radius:5px;background:#1d5742;border:3px solid #5df2b0;opacity:0;"></div>`).join("")}
  </div>
  <div style="position:absolute;left:0;right:0;top:960px;display:flex;justify-content:center;gap:60px;text-align:center;">
    ${[["s60", "60", "BUNKS"], ["s1", "1", "YEAR OF FOOD"], ["s0", "0", "WAYS UP"]].map(([id, n, l]) => `<div id="${id}" style="opacity:0;"><div style="color:${n === "0" ? "var(--amber)" : "#fff"};font-size:110px;font-weight:800;line-height:1;">${n}</div><div style="color:#7d8aa6;font-size:20px;letter-spacing:5px;margin-top:10px;">${l}</div></div>`).join("")}
  </div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "READ THE LOG<br>BEFORE YOU TOUCH ANYTHING.", ""));

mk("obey3", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1000px;background:linear-gradient(180deg,#0a0f18,#111826);"></div>
  <div style="position:absolute;left:90px;top:300px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;width:900px;">
    ${Array.from({ length: 12 }, (_, i) => `<div style="height:150px;border-radius:8px;background:#0b111b;border:4px solid #2b3650;position:relative;overflow:hidden;">
      ${[0, 1, 2].map((r) => `<div style="position:absolute;left:14px;top:${26 + r * 30}px;width:${60 + ((i * 7 + r * 11) % 90)}px;height:8px;border-radius:4px;background:#1d5742;"></div>`).join("")}</div>`).join("")}
  </div>
  <div style="position:absolute;left:0;right:0;top:1000px;height:120px;background:#1f2a3f;border-top:8px solid #33425e;"></div>
  <div id="logbook" style="position:absolute;left:720px;top:1020px;width:200px;height:70px;border-radius:6px;background:#2a2218;border:4px solid #6d5a26;"></div>
  <div style="position:absolute;left:0;right:0;top:1120px;bottom:0;background:#0a0f17;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 400, 1060, 1.2)}</svg>
  <div id="thelog" class="badge" style="position:absolute;left:720px;top:1120px;font-size:24px;opacity:0;">THE LOG</div>
  <div class="vign"></div>`);

mk("log", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${logPage()}
  <div class="vign"></div>`);

mk("words", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:100px;right:100px;top:420px;height:1060px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;"></div>
  <div style="position:absolute;left:150px;top:450px;color:#55617a;font-size:22px;letter-spacing:6px;">CREW LOG · DAY 40</div>
  <div style="position:absolute;left:150px;right:150px;top:780px;text-align:center;">
    <span id="entry" style="display:block;color:var(--red);font-size:80px;font-weight:800;letter-spacing:4px;line-height:1.2;">IT CAME BY RADIO.</span></div>
  <div class="vign"></div>`);

mk("twist", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:0;right:0;top:520px;display:flex;justify-content:center;gap:70px;text-align:center;">
    ${[["t40", "40", "PEOPLE"], ["t0", "0", "WAYS UP"]].map(([id, n, l]) => `<div id="${id}" style="opacity:0;"><div style="color:#fff;font-size:120px;font-weight:800;line-height:1;">${n}</div><div style="color:#7d8aa6;font-size:20px;letter-spacing:5px;margin-top:10px;">${l}</div></div>`).join("")}
  </div>
  ${radio(900)}
  <div id="byradio" class="stamp" style="top:1230px;font-size:60px;opacity:0;">IT CAME BY RADIO</div>
  <div class="vign"></div>`);

mk("fuel", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:60px;right:60px;top:420px;height:1060px;border-radius:18px;background:#0b1a2c;border:4px solid #2b3650;overflow:hidden;">
    <svg width="960" height="1060" style="position:absolute;inset:0;">
      <rect x="430" y="90" width="100" height="40" rx="6" fill="#2a3650" stroke="var(--amber)" stroke-width="4"/>
      ${[440, 480, 520].map((x) => `<rect x="${x - 4}" y="130" width="8" height="50" fill="#3a4967"/>`).join("")}
      <path id="south" d="M480,190 L480,900" stroke="var(--red)" stroke-width="8" stroke-dasharray="20 16" fill="none"/>
      <path d="M0,930 L120,880 L260,930 L380,870 L520,920 L660,860 L800,920 L960,880 L960,1060 L0,1060 Z" fill="#dfe8f3"/>
    </svg>
  </div>
  <div style="position:absolute;left:0;right:0;top:450px;text-align:center;color:var(--amber);font-size:22px;letter-spacing:6px;">RIG BRAVO</div>
  <div id="nofuel" style="position:absolute;left:600px;top:470px;display:flex;align-items:center;gap:14px;opacity:0;">
    <div style="width:46px;height:60px;border-radius:6px;background:#2a3650;border:3px solid var(--red);position:relative;"><div style="position:absolute;left:-6px;top:26px;width:52px;height:6px;background:var(--red);transform:rotate(-40deg);"></div></div>
    <div style="color:var(--red);font-size:22px;letter-spacing:4px;font-weight:800;">FUEL · NOT HERE</div></div>
  <div style="position:absolute;left:120px;top:900px;color:#fff;font-size:56px;font-weight:800;line-height:1;">400<br><span style="font-size:22px;color:#7d8aa6;letter-spacing:5px;">MILES SOUTH</span></div>
  <div id="ice" style="position:absolute;left:0;right:0;top:1400px;text-align:center;color:#0b1a2c;font-size:40px;font-weight:800;letter-spacing:8px;opacity:0;">THE ICE</div>
  <div class="vign"></div>`);
