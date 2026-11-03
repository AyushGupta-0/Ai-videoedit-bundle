/* Ten Days — Day 10: minus sixty.
 *
 * The finale. Three rules, three ticks, on paper everything is thought of.
 * Then the radio is turned over: a receiver with an aerial. Every night you
 * cranked it to listen — Day 1, Day 3, Day 5 — you were transmitting. The
 * loop was someone answering you. The runway lights you switched off come
 * back on by themselves. Every episode's radio beat was this plant.
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

/* the plain: a black sky, a faint aurora, ice from the horizon down, wind streaking across */
function ice(k) {
  let wind = "";
  for (let i = 0; i < 16; i++) wind += `<div style="position:absolute;left:${(i * 233) % 2000}px;top:${560 + (i * 61) % 560}px;width:${160 + (i * 47) % 300}px;height:3px;border-radius:2px;background:#dfe8f3;opacity:${0.12 + ((i * 3) % 4) * 0.09};"></div>`;
  return `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#04060f 0%,#0b1630 50%,#0e2a3a 55%,#8fa6c9 58%,#5c6f94 74%,#1c2538 100%);"></div>
  <div style="position:absolute;left:0;right:0;top:380px;height:700px;background:radial-gradient(60% 50% at 50% 100%,rgba(93,242,176,.16),transparent);"></div>
  <div style="position:absolute;inset:0;overflow:hidden;"><div id="wind${k}" style="position:absolute;left:-700px;top:0;width:2700px;height:1920px;">${wind}</div></div>`;
}

/* the station: a long module on stilts, windows lit or not, a mast */
function station(k, lit = true) {
  return `<div style="position:absolute;left:240px;top:880px;width:600px;height:220px;border-radius:14px;background:#2a3650;border:6px solid #3a4967;"></div>
  ${[300, 420, 540, 660, 780].map((x) => `<div class="stwin${k}" style="position:absolute;left:${x}px;top:930px;width:60px;height:50px;border-radius:5px;background:${lit ? "#f0d08a" : "#0b111b"};${lit ? "box-shadow:0 0 18px #f0d08a;" : ""}"></div>`).join("")}
  ${[300, 520, 740].map((x) => `<div style="position:absolute;left:${x}px;top:1100px;width:30px;height:90px;background:#3a4967;"></div>`).join("")}
  <div style="position:absolute;left:800px;top:700px;width:10px;height:190px;background:#3a4967;"></div>
  <div style="position:absolute;left:780px;top:680px;width:50px;height:24px;border-radius:12px;background:#3a4967;"></div>`;
}

/* the runway, in perspective, lights along both edges; the station small at its end */
function runway(k, lit) {
  let h = `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#04060f 0%,#0b1630 52%,#0e2a3a 55%,#3b4a6b 58%,#2a3650 80%,#141b28 100%);"></div>
  <div style="position:absolute;left:470px;top:1000px;width:140px;height:56px;border-radius:6px;background:#2a3650;border:4px solid #3a4967;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M140,1500 L500,1070" stroke="#4a5a7c" stroke-width="4" fill="none"/>
    <path d="M940,1500 L580,1070" stroke="#4a5a7c" stroke-width="4" fill="none"/>`;
  for (let i = 0; i < 9; i++) {
    const t = i / 8, y = 1500 - t * 420, xl = 140 + t * 360, xr = 940 - t * 360, r = 13 - t * 8;
    h += `<circle class="rl${k}" cx="${xl}" cy="${y}" r="${r}" fill="#f0a93c" style="opacity:${lit ? 1 : 0.08}"/><circle class="rl${k}" cx="${xr}" cy="${y}" r="${r}" fill="#f0a93c" style="opacity:${lit ? 1 : 0.08}"/>`;
  }
  return h + `</svg>`;
}

/* a check tile */
function tile(id, text, top = 1300) {
  return `<div id="${id}" style="position:absolute;left:50%;transform:translateX(-50%);top:${top}px;padding:18px 44px;border-radius:14px;border:4px solid #5df2b0;color:#5df2b0;font-size:38px;font-weight:800;letter-spacing:6px;opacity:0;white-space:nowrap;">${text} ✓</div>`;
}

/* the radio, front; and its back, which nobody looked at */
function radioFront(id) {
  return `<div id="${id}" style="position:absolute;left:250px;top:620px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>`;
}
function radioBack(id, big = false) {
  const sc = big ? "scale(1.35)" : "scale(1)";
  return `<div id="${id}" style="position:absolute;left:250px;top:620px;width:580px;height:290px;border-radius:16px;transform:${sc};transform-origin:50% 50%;
       background:linear-gradient(180deg,#1a2234,#111826);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    ${[[20, 20], [540, 20], [20, 250], [540, 250]].map(([x, y]) => `<div style="position:absolute;left:${x}px;top:${y}px;width:16px;height:16px;border-radius:50%;background:#3a4967;"></div>`).join("")}
    <div style="position:absolute;left:60px;top:50px;color:#55617a;font-size:18px;letter-spacing:4px;">FIELD SET · MK II</div>
    <!-- the aerial socket, and the switch -->
    <div id="${id}_sock" style="position:absolute;left:440px;top:46px;width:60px;height:60px;border-radius:50%;background:#0b111b;border:4px solid #4a5a7c;"></div>
    <div style="position:absolute;left:60px;top:120px;width:300px;height:90px;border-radius:12px;background:#0b111b;border:3px solid #3a4967;"></div>
    <div style="position:absolute;left:84px;top:150px;color:#55617a;font-size:22px;letter-spacing:5px;">RX</div>
    <div style="position:absolute;left:280px;top:150px;color:var(--red);font-size:22px;letter-spacing:5px;font-weight:800;">TX</div>
    <div id="${id}_sw" style="position:absolute;left:230px;top:132px;width:70px;height:66px;border-radius:10px;background:#b8352c;border:3px solid #ff6b6b;box-shadow:0 0 18px rgba(255,107,107,.5);"></div>
    <div style="position:absolute;left:60px;top:230px;color:#55617a;font-size:18px;letter-spacing:4px;">TRANSMIT / RECEIVE</div>
  </div>`;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1500px;background:linear-gradient(180deg,#0a0f18,#1a1208);"></div>
  <div style="position:absolute;left:340px;top:980px;width:400px;height:360px;border-radius:10px 10px 30px 30px;background:#1b2435;border:6px solid #3a4967;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path id="fl1" d="M440,980 C430,880 500,860 490,780 C560,840 600,760 590,700 C650,800 700,820 660,980 Z" fill="#f0a93c" opacity=".9"/>
    <path id="fl2" d="M470,980 C470,900 520,880 520,820 C570,870 600,840 600,790 C640,880 640,930 620,980 Z" fill="#ff6b6b" opacity=".9"/>
    <rect x="490" y="900" width="120" height="70" rx="6" fill="#3a2e1e" transform="rotate(-12 550 935)"/>
  </svg>
  <div style="position:absolute;left:0;right:0;top:1360px;bottom:0;background:linear-gradient(180deg,#1a1208,#0a0f17);"></div>
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:560px;font-size:30px;">THE LOG · BURNED</div>
  <div class="vign"></div>`);

mk("hook", `${ice("h")}
  ${station("h")}
  <div id="safest" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:460px;font-size:30px;opacity:0;">THE SAFEST PERSON ALIVE</div>
  <div id="fourh" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1300px;font-size:30px;opacity:0;">FOR FOUR MORE HOURS</div>
  <div class="vign"></div>`);

mk("wide", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <!-- the thermometer, the two-minute clock, and what the cold does -->
  <div style="position:absolute;left:170px;top:480px;width:80px;height:860px;border-radius:40px;background:#0b111b;border:6px solid #3a4967;overflow:hidden;">
    <div id="merc" style="position:absolute;left:14px;right:14px;bottom:14px;height:120px;border-radius:26px;background:#5aa9ff;"></div></div>
  <div style="position:absolute;left:140px;top:1360px;width:140px;text-align:center;color:#5aa9ff;font-size:64px;font-weight:800;line-height:1;">−60°</div>
  <div style="position:absolute;left:380px;top:560px;color:#55617a;font-size:22px;letter-spacing:6px;">TIME TO FREEZE SOLID</div>
  <div id="frz" style="position:absolute;left:380px;top:600px;color:#fff;font-size:150px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;">2:00</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 700, 1150, 1.3)}</svg>
  <div id="frost" style="position:absolute;left:520px;top:900px;width:420px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(223,232,243,.9),rgba(223,232,243,0) 70%);opacity:0;"></div>
  <div id="solid" class="stamp" style="top:1180px;font-size:60px;opacity:0;">SOLID</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "SHELTER.", ""));

mk("obey1", `${ice("a")}
  ${station("a")}
  <div style="position:absolute;left:60px;top:560px;color:#dfe8f3;font-size:44px;font-weight:800;line-height:1;">100<br><span style="font-size:20px;color:#9fb0d0;letter-spacing:5px;">MPH WIND</span></div>
  ${tile("ck1", "SHELTER")}
  <div class="vign"></div>`);

mk("rule2", rule(2, "FOOD.", ""));

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${[["st1", "1 YEAR", "FROZEN STORES"], ["st2", "10,000", "GALLONS OF FUEL"], ["st3", "ALL OF IT", "WATER, ON THE GROUND"]].map(([id, n, l], i) => `
    <div id="${id}" style="position:absolute;left:110px;right:110px;top:${470 + i * 250}px;height:200px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;opacity:0;">
      <div style="position:absolute;left:40px;top:40px;color:#fff;font-size:72px;font-weight:800;line-height:1;">${n}</div>
      <div style="position:absolute;left:40px;top:130px;color:#7d8aa6;font-size:22px;letter-spacing:5px;">${l}</div>
      <div style="position:absolute;right:40px;top:60px;color:#5df2b0;font-size:70px;">✓</div></div>`).join("")}
  ${tile("ck2", "FOOD", 1280)}
  <div class="vign"></div>`);

mk("rule3", rule(3, "COLD.", ""));

mk("obey3", `${runway("o", true)}
  ${tile("ck3", "COLD", 1300)}
  <div class="vign"></div>`);

mk("paper", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:110px;right:110px;top:460px;height:780px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;"></div>
  <div style="position:absolute;left:160px;top:500px;color:#55617a;font-size:22px;letter-spacing:6px;">ON PAPER</div>
  ${[["1", "SHELTER"], ["2", "FOOD"], ["3", "COLD"]].map(([n, t], i) => `
    <div style="position:absolute;left:160px;right:160px;top:${580 + i * 200}px;height:150px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1a2234;">
      <div style="color:#fff;font-size:56px;font-weight:800;letter-spacing:6px;"><span style="color:#55617a;font-size:28px;margin-right:24px;">RULE ${n}</span>${t}</div>
      <div style="width:90px;height:90px;border-radius:14px;border:4px solid #5df2b0;color:#5df2b0;font-size:60px;display:grid;place-items:center;">✓</div></div>`).join("")}
  <div id="everything" class="stamp" style="top:1290px;font-size:56px;opacity:0;border-color:#5df2b0;color:#5df2b0;">EVERYTHING</div>
  <div class="vign"></div>`);

mk("turn", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 160, 1250, 1.2, "#1c2538", HER)}
    <rect x="200" y="760" width="70" height="200" rx="30" fill="#d9b08c" transform="rotate(30 235 860)"/></svg>
  ${radioFront("rfront")}
  ${radioBack("rback")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path id="aer" d="M720,668 L720,300" stroke="#dfe8f3" stroke-width="8" fill="none" stroke-linecap="round"/>
  </svg>
  <div id="aerlbl" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1080px;font-size:30px;opacity:0;">A RECEIVER. WITH AN AERIAL.</div>
  <div class="vign"></div>`);

mk("twoway", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${radioBack("rback2", true)}
  <div id="twostamp" class="stamp" style="top:380px;font-size:64px;opacity:0;">TWO-WAY</div>
  <div id="worn" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1130px;font-size:30px;opacity:0;">TX · WORN SMOOTH</div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${[["n1", "DAY 1", "THE TRAFFIC"], ["n3", "DAY 3", "THE SERVICE STATION"], ["n5", "DAY 5", "THE SIGNAL BOX"]].map(([id, d, w], i) => `
    <div id="${id}" style="position:absolute;left:110px;right:110px;top:${500 + i * 220}px;height:170px;border-radius:14px;background:#0d1422;border:4px solid #2b3650;opacity:0;">
      <div style="position:absolute;left:40px;top:34px;color:var(--amber);font-size:30px;letter-spacing:6px;font-weight:800;">${d}</div>
      <div style="position:absolute;left:40px;top:86px;color:#fff;font-size:40px;font-weight:800;">${w}</div>
      <div class="txdot" style="position:absolute;right:40px;top:50px;display:flex;align-items:center;gap:14px;"><div style="width:24px;height:24px;border-radius:50%;background:var(--red);box-shadow:0 0 20px var(--red);"></div><div style="color:var(--red);font-size:26px;letter-spacing:5px;font-weight:800;">TX</div></div></div>`).join("")}
  <div id="txstamp" class="stamp" style="top:1230px;font-size:60px;opacity:0;">TRANSMITTING</div>
  <div class="vign"></div>`);

mk("twist", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:90px;top:470px;color:#5aa9ff;font-size:22px;letter-spacing:6px;">YOU</div>
  <div style="position:absolute;left:90px;right:90px;top:510px;height:150px;display:flex;align-items:center;gap:6px;">
    ${Array.from({ length: 60 }, (_, i) => `<div class="wy" style="flex:1;height:${20 + ((i * 37) % 23) * 5}px;border-radius:4px;background:#5aa9ff;opacity:0;"></div>`).join("")}</div>
  <div style="position:absolute;left:90px;top:690px;color:var(--red);font-size:22px;letter-spacing:6px;">SOMETHING</div>
  <div style="position:absolute;left:90px;right:90px;top:730px;height:150px;display:flex;align-items:center;gap:6px;">
    ${Array.from({ length: 60 }, (_, i) => `<div class="wt" style="flex:1;height:${20 + ((i * 53 + 11) % 23) * 5}px;border-radius:4px;background:var(--red);opacity:0;"></div>`).join("")}</div>
  <div id="answer" class="stamp" style="top:900px;font-size:56px;opacity:0;">ANSWERING YOU</div>
  <!-- and where you are: bearings closing on the station -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    ${[90, 180, 270].map((r) => `<circle cx="540" cy="1300" r="${r}" stroke="#2b3650" stroke-width="3" fill="none"/>`).join("")}
    ${[[-520, -200], [520, -180], [-480, 180], [500, 160]].map(([dx, dy], i) => `<path id="w${i + 1}" d="M${540 + dx},${1300 + dy} L540,1300" stroke="var(--red)" stroke-width="8" fill="none" stroke-linecap="round"/>`).join("")}
    <rect x="500" y="1282" width="80" height="36" rx="6" fill="#2a3650" stroke="var(--amber)" stroke-width="4"/>
  </svg>
  <div id="winter" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1420px;font-size:28px;opacity:0;">WHERE YOU'LL BE ALL WINTER</div>
  <div class="vign"></div>`);

mk("lights", `${runway("l", false)}
  <div id="bythem" class="stamp" style="top:420px;font-size:60px;opacity:0;">BY THEMSELVES</div>
  <div class="vign"></div>`);
