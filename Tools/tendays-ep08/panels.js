/* Ten Days — Day 8: six hundred kilos an hour.
 *
 * Same template. The helicopter episode, and the episode that turns the
 * radio from a comfort into a question. Plant: "she found you by tracking
 * your transmissions" (direction-finding lines converging on you). Recall:
 * Day 1, Day 3, Day 5 — you only ever listened. Twist: you have never
 * spoken into it, so what was she tracking? The answer is Day 10.
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
const HER = "#5a3a2e";   // her hood, every time she appears

/* a Sea King, side on, over open water */
function heli(x, y, s, id) {
  return `<g id="${id}"><g transform="translate(${x},${y}) scale(${s})">
    <ellipse id="${id}_disc" cx="0" cy="-150" rx="540" ry="26" fill="#c9d6ee" opacity=".4"/>
    <rect x="-10" y="-150" width="20" height="50" fill="#3a4967"/>
    <path d="M-220,-20 L-540,-70 L-540,-30 L-220,40 Z" fill="#3a4967" stroke="#9fb0d0" stroke-width="7"/>
    <rect x="-556" y="-150" width="16" height="120" rx="4" fill="#9fb0d0"/>
    <ellipse cx="-548" cy="-150" rx="14" ry="70" fill="#9fb0d0" opacity=".35"/>
    <path d="M-220,0 C-220,-70 -150,-110 -60,-110 L120,-110 C200,-110 240,-60 240,-10 L240,30 C240,70 200,90 150,90 L-120,90 C-190,90 -220,50 -220,0 Z" fill="#3a4967" stroke="#9fb0d0" stroke-width="7"/>
    <path d="M130,-100 L228,-44 L228,-8 L130,-30 Z" fill="#5aa9ff" opacity=".7"/>
    ${[-120, -40, 40].map((wx) => `<rect x="${wx}" y="-70" width="44" height="36" rx="8" fill="#5aa9ff" opacity=".45"/>`).join("")}
    <rect x="-170" y="80" width="100" height="36" rx="14" fill="#3a4967"/><rect x="70" y="80" width="100" height="36" rx="14" fill="#3a4967"/>
  </g></g>`;
}

/* the sea from altitude: sky, a hard horizon, bands of swell */
function sea(id) {
  let bands = "";
  for (let i = 0; i < 14; i++) bands += `<div style="position:absolute;left:0;width:2200px;top:${i * 40}px;height:3px;background:#1d3a5c;opacity:${0.25 + ((i * 5) % 4) * 0.12};"></div>`;
  return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#0b1626 0%,#16304d 55%,#0a1a2c 56%,#061020 100%);"></div>
  <div style="position:absolute;left:0;right:0;top:1060px;height:600px;overflow:hidden;"><div id="${id}" style="position:absolute;left:-600px;top:0;width:2200px;height:600px;">${bands}</div></div>`;
}

/* the cockpit from behind: you left, her right */
function cockpit(night = false) {
  return `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:60px;top:200px;width:960px;height:640px;border-radius:70px 70px 20px 20px;background:linear-gradient(180deg,${night ? "#0a1526" : "#1b3a5f"} 0%,${night ? "#122a44" : "#4a86c0"} 58%,#0a1a2c 59%,#061020 100%);border:10px solid #2a3449;overflow:hidden;"></div>
  <div style="position:absolute;left:0;right:0;top:840px;height:420px;background:linear-gradient(180deg,#1f2a3f,#121a28);border-top:8px solid #33425e;"></div>
  ${[200, 420, 660, 880].map((x, i) => `<div style="position:absolute;left:${x - 54}px;top:900px;width:108px;height:108px;border-radius:50%;background:#0b111b;border:5px solid #3a4967;"></div>
    <div style="position:absolute;left:${x - 3}px;top:916px;width:6px;height:46px;border-radius:3px;background:var(--amber);transform-origin:50% 100%;transform:rotate(${[-40, 20, -10, 35][i]}deg);"></div>`).join("")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 330, 760, 1.15)}${figure("back", 750, 760, 1.15, "#1c2538", HER)}</svg>
  <div style="position:absolute;left:0;right:0;top:1260px;bottom:0;background:#0a0f17;"></div>`;
}

/* direction-finding: rings and bearing lines converging on a point */
function df(cx, cy, ids, color) {
  return `<svg width="1080" height="1920" style="position:absolute;inset:0;">
    ${[120, 240, 360, 480].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="#2b3650" stroke-width="3" fill="none"/>`).join("")}
    ${[[-60, -560], [560, -520], [-520, 420], [520, 500]].map(([dx, dy], i) => `<path id="${ids}${i + 1}" d="M${cx + dx},${cy + dy} L${cx},${cy}" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>`).join("")}
  </svg>`;
}

/* the radio, with the crank handle on the right and the transmit key under the dial */
function radio(top, sfx = "") {
  return `<div style="position:absolute;left:250px;top:${top}px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;right:-60px;top:196px;width:60px;height:14px;border-radius:7px;background:#44557a;"></div>
    <div id="txkey${sfx}" style="position:absolute;left:32px;bottom:28px;width:120px;height:56px;border-radius:8px;background:#2a0e0e;border:3px solid #5c1f1f;display:grid;place-items:center;color:#ff6b6b;font-size:24px;font-weight:800;letter-spacing:4px;">TX</div>
    <div style="position:absolute;left:170px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 7 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>`;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#05070c;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1500px;background:linear-gradient(180deg,#0a0f18,#111826);"></div>
  <!-- the door, open: the frame, the dark inside, her in it -->
  <div style="position:absolute;left:320px;top:420px;width:440px;height:1000px;background:#02030a;border:10px solid #3a4967;border-bottom:none;"></div>
  <div style="position:absolute;left:720px;top:420px;width:120px;height:1000px;border-radius:0 14px 0 0;background:linear-gradient(90deg,#1b2435,#2a3650);border:10px solid #3a4967;border-left:none;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 560, 1230, 1.1, "#1c2538", HER)}</svg>
  <div style="position:absolute;left:0;right:0;top:1420px;height:80px;background:#1b2435;"></div>
  <div style="position:absolute;left:0;right:0;top:1500px;bottom:0;background:#0a0f17;"></div>
  <div class="vign"></div>`);

mk("hook", `${sea("swell1")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${heli(560, 760, 0.78, "h1")}</svg>
  <div style="position:absolute;right:80px;top:300px;text-align:right;">
    <div id="alt" style="color:#fff;font-size:96px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;">2,000</div>
    <div style="color:#7d8aa6;font-size:22px;letter-spacing:6px;">FEET</div></div>
  <div id="qmark" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1340px;font-size:30px;opacity:0;">A QUESTION YOU CAN'T ANSWER</div>
  <div class="vign"></div>`);

mk("who", `${cockpit()}
  <div style="position:absolute;left:150px;right:150px;top:1300px;height:180px;border-radius:14px;background:#0b111b;border:3px solid #5a3a2e;padding:22px 30px;">
    <div style="color:#fff;font-size:56px;font-weight:800;letter-spacing:6px;">PRIYA</div>
    <div style="color:#7d8aa6;font-size:22px;letter-spacing:5px;margin-top:8px;">COASTGUARD RADIO · 9 YEARS</div></div>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${df(540, 900, "b", "var(--amber)")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("seat", 540, 900, 0.55)}</svg>
  <div style="position:absolute;left:0;right:0;top:420px;text-align:center;color:#7d8aa6;font-size:22px;letter-spacing:6px;">YOUR TRANSMISSIONS · TRACKED</div>
  <div id="worry" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1400px;font-size:30px;opacity:0;">THAT SHOULD HAVE WORRIED YOU</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "A SEA KING BURNS<br>600 KILOS AN HOUR.", ""));

mk("obey1", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:390px;top:460px;width:300px;height:780px;border-radius:30px;background:#0b111b;border:8px solid #3a4967;overflow:hidden;">
    <div id="fuel" style="position:absolute;left:0;right:0;bottom:0;height:0px;background:linear-gradient(0deg,#b77a1c,#f0a93c);"></div>
    ${[0.25, 0.5, 0.75].map((f) => `<div style="position:absolute;left:0;width:40px;top:${780 - f * 780}px;height:4px;background:#3a4967;"></div>`).join("")}
  </div>
  <div style="position:absolute;left:720px;top:600px;color:#fff;font-size:88px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;"><span id="fpct">0</span><span style="font-size:40px;">%</span></div>
  <div style="position:absolute;left:720px;top:700px;color:#7d8aa6;font-size:22px;letter-spacing:5px;line-height:1.6;">3,000 KG<br>FIVE HOURS</div>
  <div id="brim" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1300px;font-size:30px;opacity:0;">TO THE BRIM</div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "EVERY KILO<br>COSTS YOU RANGE.", ""));

function scaleRows(extra = "") {
  const rows = [["WATER", "w", "20 KG"], ["MAP", "m", "0.2 KG"], ["RADIO", "r", "3 KG"], ["FOOD", "f", "61 KG"]];
  return `<div style="position:absolute;left:70px;right:70px;top:480px;height:800px;border-radius:18px;background:#0d1422;border:4px solid #2b3650;"></div>
  ${rows.map(([n, k, kg], i) => `<div style="position:absolute;left:110px;top:${540 + i * 150}px;width:150px;color:#fff;font-size:30px;font-weight:800;letter-spacing:4px;">${n}</div>
    <div style="position:absolute;left:280px;top:${536 + i * 150}px;width:560px;height:44px;border-radius:8px;background:#161e2e;"></div>
    <div id="bar_${k}${extra}" style="position:absolute;left:280px;top:${536 + i * 150}px;width:0px;height:44px;border-radius:8px;background:${k === "f" ? "var(--red)" : "var(--amber)"};"></div>
    <div id="kg_${k}${extra}" style="position:absolute;left:860px;top:${540 + i * 150}px;width:150px;text-align:right;color:#7d8aa6;font-size:28px;font-weight:800;font-variant-numeric:tabular-nums;opacity:0;">${kg}</div>`).join("")}
  <div style="position:absolute;left:110px;top:1150px;color:#7d8aa6;font-size:22px;letter-spacing:6px;">RANGE</div>
  <div style="position:absolute;left:110px;top:1180px;color:#fff;font-size:72px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;"><span id="rng${extra}">410</span><span style="font-size:28px;color:#7d8aa6;"> MI</span></div>
  <div style="position:absolute;right:110px;top:1180px;text-align:right;color:var(--red);font-size:28px;letter-spacing:4px;font-weight:800;line-height:2.4;">NEED 400</div>`;
}

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${scaleRows()}
  <div class="vign"></div>`);

mk("leave", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${scaleRows("2")}
  <div id="strike" style="position:absolute;left:100px;top:${536 + 3 * 150 + 20}px;width:920px;height:8px;background:var(--red);transform-origin:0 50%;transform:scaleX(0);"></div>
  <div id="ground" class="stamp" style="top:1330px;font-size:56px;opacity:0;">LEFT ON THE GROUND</div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "RANGE IS THE ONLY THING<br>KEEPING YOU ALIVE.", ""));

mk("obey3", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:60px;right:60px;top:420px;height:1060px;border-radius:18px;background:#0b1a2c;border:4px solid #2b3650;overflow:hidden;">
    <!-- the coast, top; the rig, bottom; nothing between -->
    <svg width="960" height="1060" style="position:absolute;inset:0;">
      <path d="M0,0 L960,0 L960,120 C800,170 700,110 560,160 C420,210 300,140 160,190 C90,215 40,200 0,230 Z" fill="#1b2435"/>
      <path id="route" d="M520,160 L520,940" stroke="#4a5775" stroke-width="8" stroke-dasharray="20 16" fill="none"/>
      <circle id="helidot" cx="520" cy="170" r="20" fill="var(--amber)"/>
      <rect x="470" y="930" width="100" height="40" rx="6" fill="#2a3650" stroke="var(--amber)" stroke-width="4"/>
      ${[480, 520, 560].map((x) => `<rect x="${x - 4}" y="970" width="8" height="60" fill="#3a4967"/>`).join("")}
    </svg>
  </div>
  <div style="position:absolute;left:0;right:0;top:450px;text-align:center;color:#7d8aa6;font-size:22px;letter-spacing:6px;">THE COAST</div>
  <div style="position:absolute;left:120px;top:900px;color:#fff;font-size:56px;font-weight:800;line-height:1;">400<br><span style="font-size:22px;color:#7d8aa6;letter-spacing:5px;">MILES</span></div>
  <div style="position:absolute;right:120px;top:900px;text-align:right;color:#fff;font-size:44px;font-weight:800;line-height:1.1;">NO<br><span style="font-size:22px;color:#7d8aa6;letter-spacing:5px;">LAND</span></div>
  <div style="position:absolute;left:0;right:0;top:1410px;text-align:center;color:var(--amber);font-size:26px;letter-spacing:6px;font-weight:800;">RIG BRAVO</div>
  <div class="vign"></div>`);

mk("air", `${cockpit()}
  <!-- the fuel gauge, the halfway mark, and what she says -->
  <div style="position:absolute;left:150px;top:1300px;width:780px;height:60px;border-radius:12px;background:#0b111b;border:4px solid #3a4967;overflow:hidden;">
    <div id="fuelbar" style="position:absolute;left:0;top:0;bottom:0;width:48%;background:linear-gradient(90deg,#b77a1c,#f0a93c);"></div>
  </div>
  <div style="position:absolute;left:${150 + 390 - 3}px;top:1280px;width:6px;height:100px;background:#fff;"></div>
  <div style="position:absolute;left:150px;top:1390px;color:#7d8aa6;font-size:20px;letter-spacing:5px;">FUEL</div>
  <div style="position:absolute;left:${150 + 390 - 120}px;top:1390px;width:240px;text-align:center;color:#fff;font-size:20px;letter-spacing:5px;">HALF</div>
  <div style="position:absolute;left:0;right:0;top:300px;text-align:center;">
    <span id="oneway" style="display:inline-block;color:var(--red);font-size:60px;font-weight:800;letter-spacing:8px;">ONE WAY</span></div>
  <div class="vign"></div>`);

mk("ask", `${cockpit(true)}
  <div style="position:absolute;left:90px;right:90px;top:270px;text-align:center;">
    <span id="askq" style="display:inline-block;color:var(--red);font-size:44px;font-weight:800;letter-spacing:4px;line-height:1.3;">WHO HAVE YOU BEEN<br>TALKING TO?</span></div>
  <div style="position:absolute;left:250px;top:1290px;width:170px;height:90px;border-radius:10px;background:linear-gradient(180deg,#222d41,#161e2e);border:3px solid #33425e;">
    <div style="position:absolute;left:10px;top:10px;width:100px;height:34px;border-radius:5px;background:#0b2a21;border:2px solid #1d5742;"></div>
    <div style="position:absolute;right:-18px;top:30px;width:18px;height:40px;border-radius:4px;background:#44557a;"></div></div>
  <div style="position:absolute;left:250px;top:1395px;width:170px;text-align:center;color:#7d8aa6;font-size:18px;letter-spacing:4px;">YOUR RADIO</div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${radio(520)}
  <div style="position:absolute;left:50%;transform:translateX(-50%);top:880px;display:flex;gap:22px;">
    ${[1, 3, 5].map((d) => `<div id="d${d}" class="badge" style="font-size:26px;opacity:0;">DAY ${d} · LISTENED</div>`).join("")}
  </div>
  <div id="txnever" style="position:absolute;left:0;right:0;top:1040px;text-align:center;color:#7d8aa6;font-size:22px;letter-spacing:6px;opacity:0;">TX · NEVER PRESSED</div>
  <div class="vign"></div>`);

mk("twist", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${df(540, 700, "t", "var(--red)")}
  ${radio(555, "2")}
  <div id="neverstamp" class="stamp" style="top:1000px;font-size:60px;opacity:0;">NEVER SPOKEN</div>
  <div id="tracked" style="position:absolute;left:0;right:0;top:1300px;text-align:center;color:var(--red);font-size:72px;font-weight:800;letter-spacing:10px;opacity:0;">TRACKED</div>
  <div class="vign"></div>`);
