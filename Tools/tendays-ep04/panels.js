/* Ten Days — Day 4: the car behind you.
 *
 * Same template: a consistent vector "you", each rule followed by the shot of
 * you obeying it. This episode's turn is moral rather than a lie exposed —
 * the SOS pattern is the thing you drive away from, and it comes back as
 * knocking on Day 7. The plant: "nobody knows you're alive" — the headlights
 * do, which is also a Day 10 plant.
 *
 * Deterministic throughout — no unseeded randomness anywhere.
 */

function figure(pose, x, y, s = 1, tone = "#1c2538") {
  const hood = "#2a3650", skin = "#d9b08c", pack = "#3a4a6a";
  let body;
  if (pose === "seat") {
    body = `
      <rect x="-70" y="-10" width="140" height="150" rx="34" fill="${hood}"/>
      <rect x="-50" y="60" width="60" height="110" rx="22" fill="${tone}"/>
      <circle cx="-8" cy="-50" r="52" fill="${hood}"/>
      <circle cx="4" cy="-44" r="34" fill="${skin}"/>
      <rect x="-26" y="-56" width="56" height="26" rx="12" fill="${hood}"/>`;
  } else { // "back" — seen from behind, driving: hood and shoulders only
    body = `
      <rect x="-90" y="-20" width="180" height="170" rx="46" fill="${hood}"/>
      <circle cx="0" cy="-70" r="58" fill="${hood}"/>
      <rect x="-30" y="-98" width="60" height="22" rx="11" fill="#1f2a40"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})">${body}</g>`;
}

/* the road ahead, from the driver's seat: verges and dashes converging */
function roadAhead(lightsOn) {
  let h = `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#070b14 0%,#0d1422 48%,#151c2a 50%,#0b1119 100%);"></div>`;
  for (let i = 0; i < 12; i++) {
    const t = i / 11, y = 960 + Math.pow(t, 1.9) * 700, w = 6 + t * 26, len = 18 + t * 110;
    h += `<div style="position:absolute;left:${540 - w / 2}px;top:${y}px;width:${w}px;height:${len}px;border-radius:3px;
           background:${lightsOn ? "#cfd6e3" : "#4a5570"};opacity:${lightsOn ? 0.25 + t * 0.6 : 0.12 + t * 0.25};"></div>`;
  }
  if (lightsOn) h += `<div style="position:absolute;left:0;right:0;top:860px;height:560px;
         background:radial-gradient(60% 100% at 50% 100%,rgba(255,235,190,.35),rgba(0,0,0,0) 70%);"></div>`;
  return h;
}

/* the rear-view mirror, with two headlights in it (or none) */
function mirror(lights, extraId = "") {
  return `<div style="position:absolute;left:190px;top:300px;width:700px;height:300px;border-radius:40px;
            background:linear-gradient(180deg,#0a1020,#060a12);border:8px solid #2a3449;overflow:hidden;">
    <div style="position:absolute;left:0;right:0;top:150px;height:3px;background:#1b2434;"></div>
    ${lights ? `<div id="hl1${extraId}" style="position:absolute;left:240px;top:120px;width:70px;height:36px;border-radius:50%;
         background:#fff3cf;box-shadow:0 0 50px 18px rgba(255,235,190,.6);"></div>
       <div id="hl2${extraId}" style="position:absolute;left:390px;top:120px;width:70px;height:36px;border-radius:50%;
         background:#fff3cf;box-shadow:0 0 50px 18px rgba(255,235,190,.6);"></div>` : ""}
  </div>`;
}

/* dashboard foreground: wheel arc and your shoulders */
function dash() {
  return `<div style="position:absolute;left:0;right:0;top:1180px;bottom:0;background:linear-gradient(180deg,#192234,#0a0f17);"></div>
    <div style="position:absolute;left:170px;top:1420px;width:740px;height:740px;border-radius:50%;border:36px solid #141c2c;"></div>
    <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("back", 540, 1480, 1.6)}</svg>`;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:280px;top:260px;width:520px;height:1100px;border-radius:10px;background:#0a1020;border:8px solid #35425a;overflow:hidden;">
    <div style="position:absolute;left:0;right:0;top:0;height:60%;background:linear-gradient(180deg,#0a1020,#152034);"></div>
    <div style="position:absolute;left:0;right:0;top:60%;bottom:0;background:#1a2234;"></div>
  </div>
  <div style="position:absolute;left:560px;top:1180px;width:260px;height:180px;border-radius:12px;background:#4a3a1e;border:5px solid #6d5a26;"></div>
  <div style="position:absolute;left:120px;top:1120px;width:150px;height:240px;border-radius:14px;background:#1f3a5a;border:5px solid #5aa9ff;"></div>
  <div style="position:absolute;left:0;right:0;top:1400px;bottom:0;background:#0c1119;"></div>
  <div class="vign"></div>`);

mk("hook", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${roadAhead(true)}
  <div style="position:absolute;left:0;right:0;top:0;height:200px;background:linear-gradient(180deg,#05080f,transparent);"></div>
  ${dash()}
  <div class="vign"></div>`);

mk("road", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div id="roadart" style="position:absolute;inset:0;">${roadAhead(true)}</div>
  <div id="speedo" style="position:absolute;left:390px;top:1240px;width:300px;height:300px;border-radius:50%;
       background:#0b111b;border:6px solid #2a3650;display:grid;place-items:center;">
    <span id="speed" style="color:#cfd6e3;font-size:84px;font-weight:800;font-variant-numeric:tabular-nums;">50</span></div>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:160px;top:560px;width:760px;height:420px;border-radius:22px;background:linear-gradient(180deg,#1b2434,#111826);border:4px solid #2c3850;"></div>
  <div id="fuelgauge" style="position:absolute;left:300px;top:620px;width:480px;height:280px;border-radius:140px 140px 0 0;background:#0b111b;border:5px solid #2a3650;overflow:hidden;">
    <div style="position:absolute;left:236px;top:230px;width:8px;height:230px;background:var(--amber);transform-origin:50% 100%;transform:rotate(-40deg);"></div>
    <div style="position:absolute;left:40px;top:220px;color:#55617a;font-size:26px;font-weight:800;">E</div>
    <div style="position:absolute;right:40px;top:220px;color:#55617a;font-size:26px;font-weight:800;">F</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1030px;text-align:center;color:var(--amber);font-size:48px;font-weight:800;letter-spacing:3px;">90 MILES</div>
  <div style="position:absolute;left:0;right:0;top:1130px;display:flex;justify-content:center;gap:18px;">
    <div id="plant1" class="badge" style="font-size:30px;opacity:0;">NO WEAPON</div>
    <div id="plant2" class="badge" style="font-size:30px;opacity:0;">NOBODY KNOWS YOU'RE ALIVE</div>
  </div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "NEVER DRIVE TO<br>WHERE YOU SLEEP", "circle first"));

mk("obey1", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">THE LONG WAY</div>
  <div style="position:absolute;left:60px;right:60px;top:560px;height:860px;border-radius:18px;background:#141b28;border:4px solid #2b3650;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M200,1300 L200,700 L880,700 L880,1300 Z" fill="none" stroke="#2b3650" stroke-width="4"/>
    <path id="loop" d="M540,1320 L540,1000 L260,1000 L260,760 L820,760 L820,1240 L540,1240 L540,1000"
          fill="none" stroke="var(--amber)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="540" cy="1320" r="22" fill="var(--amber)"/>
  </svg>
  <div class="vign"></div>`);

mk("mirror", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${roadAhead(true)}
  ${mirror(true)}
  <div id="dist" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:640px;font-size:30px;">400 M · 60 MILES</div>
  ${dash()}
  <div class="vign"></div>`);

mk("rule2", rule(2, "NEVER LET A STRANGER<br>SEE YOUR FUEL", ""));

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div id="roadart2" style="position:absolute;inset:0;">${roadAhead(true)}</div>
  ${mirror(true, "b")}
  <div id="speedo2" style="position:absolute;left:390px;top:1240px;width:300px;height:300px;border-radius:50%;background:#0b111b;border:6px solid #2a3650;display:grid;place-items:center;">
    <span id="speed2" style="color:#cfd6e3;font-size:84px;font-weight:800;font-variant-numeric:tabular-nums;">50</span></div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
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
  <div id="radioline" style="position:absolute;left:0;right:0;top:1100px;text-align:center;color:#6f7b93;font-size:30px;letter-spacing:4px;">DO NOT CONVOY</div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "DO NOT STOP<br>ON OPEN ROAD", ""));

mk("obey3", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div id="roadoff" style="position:absolute;inset:0;">${roadAhead(false)}</div>
  <div id="roadon" style="position:absolute;inset:0;">${roadAhead(true)}</div>
  <!-- the junction: a second road peeling off right -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M540,1300 Q700,1000 1000,900" stroke="#4a5570" stroke-width="12" fill="none" stroke-dasharray="30 26" opacity=".6"/>
  </svg>
  ${dash()}
  <div class="vign"></div>`);

mk("flash", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${roadAhead(false)}
  ${mirror(true, "c")}
  ${dash()}
  <div class="vign"></div>`);

mk("sos", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <!-- the pattern, drawn on as it is spoken: long long long · short short short · long long long -->
  <div style="position:absolute;left:0;right:0;top:640px;display:flex;justify-content:center;gap:26px;">
    ${[0,1,2].map((i) => `<div id="dl${i}" style="width:150px;height:34px;border-radius:17px;background:#fff3cf;opacity:0;box-shadow:0 0 40px rgba(255,235,190,.7);"></div>`).join("")}</div>
  <div style="position:absolute;left:0;right:0;top:800px;display:flex;justify-content:center;gap:40px;">
    ${[0,1,2].map((i) => `<div id="ds${i}" style="width:34px;height:34px;border-radius:50%;background:#fff3cf;opacity:0;box-shadow:0 0 40px rgba(255,235,190,.7);"></div>`).join("")}</div>
  <div style="position:absolute;left:0;right:0;top:960px;display:flex;justify-content:center;gap:26px;">
    ${[0,1,2].map((i) => `<div id="dl${i + 3}" style="width:150px;height:34px;border-radius:17px;background:#fff3cf;opacity:0;box-shadow:0 0 40px rgba(255,235,190,.7);"></div>`).join("")}</div>
  <div class="vign"></div>`);

mk("sos2", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:0;right:0;top:700px;text-align:center;color:#fff3cf;font-size:60px;letter-spacing:14px;font-weight:800;opacity:.5;">— — —&nbsp;&nbsp;· · ·&nbsp;&nbsp;— — —</div>
  <div style="position:absolute;left:0;right:0;top:860px;text-align:center;">
    <span id="sosword" style="display:inline-block;color:var(--red);font-size:150px;font-weight:800;letter-spacing:20px;">???</span></div>
  <div class="vign"></div>`);

mk("drive", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div id="roadart3" style="position:absolute;inset:0;">${roadAhead(false)}</div>
  ${mirror(true, "d")}
  ${dash()}
  <div class="vign"></div>`);

mk("out", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${roadAhead(false)}
  ${mirror(true, "e")}
  ${dash()}
  <div class="vign"></div>`);

mk("out2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  ${roadAhead(false)}
  ${mirror(false)}
  ${dash()}
  <div class="vign"></div>`);
