/* Ten Days — Day 3: the service station.
 *
 * Same template as Day 2 v4: a consistent vector "you" in shot, each rule
 * followed by the shot of you obeying it, the tell planted early (grid seven
 * died on day one) and recalled when the lights come on.
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
  } else if (pose === "crouch") {
    body = `
      <rect x="-90" y="20" width="180" height="120" rx="48" fill="${hood}"/>
      <rect x="-100" y="-30" width="70" height="90" rx="26" fill="${pack}"/>
      <circle cx="30" cy="-30" r="50" fill="${hood}"/>
      <circle cx="40" cy="-24" r="32" fill="${skin}"/>
      <rect x="6" y="-40" width="60" height="24" rx="12" fill="${hood}"/>`;
  } else if (pose === "walk") {
    body = `
      <rect x="-54" y="-30" width="108" height="190" rx="36" fill="${hood}"/>
      <rect x="-96" y="-16" width="56" height="116" rx="22" fill="${pack}"/>
      <rect x="-40" y="150" width="34" height="110" rx="14" fill="${tone}"/>
      <rect x="10" y="150" width="34" height="100" rx="14" fill="${tone}" transform="rotate(-14 27 150)"/>
      <circle cx="8" cy="-80" r="52" fill="${hood}"/>
      <circle cx="16" cy="-74" r="34" fill="${skin}"/>
      <rect x="-18" y="-88" width="60" height="24" rx="12" fill="${hood}"/>`;
  } else { // peer
    body = `
      <rect x="-64" y="-20" width="128" height="200" rx="40" fill="${hood}"/>
      <rect x="-104" y="-6" width="60" height="120" rx="24" fill="${pack}"/>
      <circle cx="14" cy="-68" r="54" fill="${hood}"/>
      <circle cx="22" cy="-62" r="36" fill="${skin}"/>
      <rect x="-14" y="-78" width="64" height="26" rx="13" fill="${hood}"/>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s})">${body}</g>`;
}

/* a retail aisle in one-point perspective: shelves both sides, stripped */
function aisle(lit) {
  let h = "";
  const floor = lit ? "#2a3345" : "#141b28", wall = lit ? "#3a4560" : "#1b2434";
  h += `<div style="position:absolute;left:0;right:0;top:0;height:640px;background:${lit ? "#e8edf6" : "#0f1520"};"></div>`;
  h += `<div style="position:absolute;left:0;right:0;top:640px;bottom:0;background:linear-gradient(180deg,${floor},#0c1119);"></div>`;
  for (let i = 0; i < 7; i++) {
    const t = i / 6, x = 60 + t * 400, w = 150 - t * 110, top = 520 + t * 180, hgt = 820 - t * 560;
    for (const side of [0, 1]) {
      const px = side ? 1080 - x - w : x;
      h += `<div style="position:absolute;left:${px}px;top:${top}px;width:${w}px;height:${hgt}px;
             background:${wall};opacity:${1 - t * 0.5};"></div>`;
      for (let s = 1; s < 4; s++)
        h += `<div style="position:absolute;left:${px}px;top:${top + hgt * s / 4}px;width:${w}px;height:${4 - t * 2}px;
               background:${lit ? "#8b97ab" : "#2b3650"};opacity:${1 - t * 0.5};"></div>`;
    }
  }
  if (lit) for (let i = 0; i < 5; i++) {
    const t = i / 4;
    h += `<div style="position:absolute;left:${300 + t * 140}px;top:${120 + t * 100}px;width:${480 - t * 280}px;height:${14 - t * 8}px;
           border-radius:7px;background:#fff;box-shadow:0 0 60px 20px rgba(255,255,255,.55);"></div>`;
  }
  return h;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:120px;height:600px;background:linear-gradient(180deg,#2a3a5a,#0e1726);"></div>
  <div style="position:absolute;left:0;right:0;top:120px;height:120px;background:linear-gradient(180deg,#f0a93c33,transparent);"></div>
  <div style="position:absolute;left:0;right:0;top:720px;bottom:0;background:linear-gradient(180deg,#192234,#0d1422);"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("seat", 540, 980, 2.4)}</svg>
  <div style="position:absolute;left:170px;top:1360px;width:740px;height:740px;border-radius:50%;border:36px solid #141c2c;"></div>
  <div class="vign"></div>`);

mk("hook", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <!-- the forecourt at 2am: dead sign, dead pumps, and you walking in -->
  <div style="position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,#0a1020,#121b2c);"></div>
  <div style="position:absolute;left:120px;top:200px;width:840px;height:160px;border-radius:16px;background:#141b28;border:5px solid #2b3650;"></div>
  <div style="position:absolute;left:120px;top:200px;width:840px;height:160px;display:flex;align-items:center;justify-content:center;
       color:#3a4560;font-size:70px;font-weight:800;letter-spacing:12px;">SERVICES</div>
  <div style="position:absolute;left:0;right:0;top:900px;bottom:0;background:linear-gradient(180deg,#1a2234,#0c1119);"></div>
  ${[220, 540, 860].map((x) => `<div style="position:absolute;left:${x - 60}px;top:700px;width:120px;height:260px;border-radius:14px;
       background:linear-gradient(180deg,#2a3650,#1a2234);border:4px solid #3a4967;"></div>`).join("")}
  <svg id="hookfig" width="1080" height="1920" style="position:absolute;inset:0;">${figure("walk", 540, 1280, 2.6)}</svg>
  <div class="vign"></div>`);

mk("wide", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div id="aisledark" style="position:absolute;inset:0;">${aisle(false)}</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "NOBODY LOOTS<br>THE PLUMBING", "everyone takes the shelves"));

mk("obey1", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the back room: a water heater tank and you, crouched at its valve -->
  <div style="position:absolute;left:0;right:0;top:1300px;bottom:0;background:linear-gradient(180deg,#1a2234,#0c1119);"></div>
  <div style="position:absolute;left:600px;top:420px;width:300px;height:880px;border-radius:150px 150px 40px 40px;
       background:linear-gradient(90deg,#3a4560,#242e44);border:6px solid #4a5775;"></div>
  <div style="position:absolute;left:560px;top:1120px;width:120px;height:30px;background:#4a5775;border-radius:8px;"></div>
  <div id="tankgauge" style="position:absolute;left:690px;top:640px;width:120px;height:120px;border-radius:50%;
       background:#0b111b;border:5px solid #4a5775;display:grid;place-items:center;color:var(--amber);font-size:30px;font-weight:800;">40L</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("crouch", 330, 1150, 2.1)}</svg>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the breaker panel: the fact the whole episode turns on -->
  <div style="position:absolute;left:240px;top:420px;width:600px;height:820px;border-radius:14px;
       background:linear-gradient(180deg,#263048,#171f30);border:6px solid #3a4560;"></div>
  ${Array.from({ length: 8 }, (_, i) => `<div style="position:absolute;left:${300 + (i % 2) * 260}px;top:${500 + Math.floor(i / 2) * 150}px;
       width:220px;height:100px;border-radius:12px;background:#0b111b;border:4px solid #2b3650;"></div>
     <div style="position:absolute;left:${330 + (i % 2) * 260}px;top:${530 + Math.floor(i / 2) * 150}px;width:60px;height:40px;border-radius:8px;
       background:#39465e;"></div>`).join("")}
  <div id="gridbadge" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1290px;font-size:34px;opacity:0;">GRID 7 — DEAD · DAY 1</div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "NEVER LET A DOOR<br>CLOSE BEHIND YOU", "between you and the car"));

mk("obey2", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the back door, wedged with a crate; the car outside, sixty feet off -->
  <div style="position:absolute;left:0;right:0;top:0;height:1400px;background:linear-gradient(180deg,#0f1520,#141b28);"></div>
  <div style="position:absolute;left:280px;top:260px;width:520px;height:1100px;border-radius:10px;background:#0a1020;border:8px solid #35425a;overflow:hidden;">
    <div style="position:absolute;left:0;right:0;top:0;height:60%;background:linear-gradient(180deg,#0a1020,#152034);"></div>
    <div style="position:absolute;left:0;right:0;top:60%;bottom:0;background:#1a2234;"></div>
    <div id="farcar" style="position:absolute;left:190px;top:560px;width:140px;height:90px;border-radius:16px;background:#5a4a1e;border:3px solid var(--amber);"></div>
  </div>
  <div style="position:absolute;left:560px;top:1180px;width:260px;height:180px;border-radius:12px;background:#4a3a1e;border:5px solid #6d5a26;"></div>
  <div style="position:absolute;left:0;right:0;top:1400px;bottom:0;background:#0c1119;"></div>
  <div id="sixty" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:170px;font-size:30px;">60 FT</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 190, 1260, 1.5)}</svg>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:720px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;
         display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;"><rect x="800" y="860" width="60" height="150" rx="26" fill="#d9b08c" transform="rotate(-20 830 935)"/></svg>
  <div id="radioline" style="position:absolute;left:0;right:0;top:1100px;text-align:center;color:#6f7b93;font-size:30px;letter-spacing:4px;">AVOID ENCLOSED RETAIL</div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "IF THE LIGHTS<br>COME ON, LEAVE", ""));

mk("obey3", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div class="news">
    <h4>WHAT YOU GOT</h4>
    <div class="row"><span>Water</span><span>31 LITRES</span></div>
    <div class="row"><span>Map</span><span>PAPER</span></div>
    <div class="row"><span>Time inside</span><span id="mins">11 MIN</span></div>
  </div>
  <div class="vign"></div>`);

mk("bad", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the floor plan: one long room, one exit, and YOU at the far end -->
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">FLOOR PLAN</div>
  <div style="position:absolute;left:140px;top:560px;width:800px;height:900px;border-radius:14px;background:#141b28;border:5px solid #2b3650;"></div>
  ${[0, 1, 2, 3].map((i) => `<div style="position:absolute;left:${220 + i * 170}px;top:640px;width:70px;height:560px;border-radius:8px;background:#1f283a;border:3px solid #2b3650;"></div>`).join("")}
  <div id="exitmark" style="position:absolute;left:470px;top:1452px;width:140px;height:16px;background:var(--amber);border-radius:4px;"></div>
  <div style="position:absolute;left:0;right:0;top:1480px;text-align:center;color:var(--amber);font-size:26px;letter-spacing:6px;font-weight:800;">THE ONLY EXIT</div>
  <div id="youdot" style="position:absolute;left:510px;top:600px;width:60px;height:60px;border-radius:50%;background:var(--red);box-shadow:0 0 0 0 rgba(255,66,66,0);"></div>
  <div style="position:absolute;left:580px;top:605px;color:var(--red);font-size:30px;font-weight:800;letter-spacing:4px;">YOU</div>
  <div class="vign"></div>`);

mk("lights", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div style="position:absolute;inset:0;">${aisle(false)}</div>
  <!-- the whole building comes on at once: the lit aisle fades in over the dark one -->
  <div id="aislelit" style="position:absolute;inset:0;opacity:0;">${aisle(true)}</div>
  <div id="flash" style="position:absolute;inset:0;background:#fff;opacity:0;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 540, 1420, 1.3)}</svg>
  <div class="vign"></div>`);

mk("pa", `<div style="position:absolute;inset:0;background:#0d1220;"></div>
  <div style="position:absolute;inset:0;opacity:.35;">${aisle(true)}</div>
  <!-- the PA grille, and sound rings spreading from it -->
  <div style="position:absolute;left:380px;top:720px;width:320px;height:320px;border-radius:50%;background:#1b2434;border:8px solid #3a4560;"></div>
  ${Array.from({ length: 6 }, (_, i) => `<div style="position:absolute;left:440px;top:${780 + i * 36}px;width:200px;height:12px;border-radius:6px;background:#0b111b;"></div>`).join("")}
  ${[1, 2, 3].map((i) => `<div id="ring${i}" style="position:absolute;left:400px;top:740px;width:280px;height:280px;border-radius:50%;border:4px solid rgba(255,255,255,.7);opacity:0;"></div>`).join("")}
  <div class="vign"></div>`);

mk("voice", `<div style="position:absolute;inset:0;background:#0d1220;"></div>
  <div style="position:absolute;inset:0;opacity:.55;">${aisle(true)}</div>
  <!-- you, small, at the far end of a lit aisle that wants you to walk to the front -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("walk", 540, 1180, 1.0, "#141b2a")}</svg>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;">
    <span id="checkout" style="display:inline-block;color:#fff;font-size:44px;font-weight:800;letter-spacing:6px;background:rgba(10,14,22,.8);padding:12px 30px;border-radius:10px;">CHECKOUT →</span></div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:240px;top:420px;width:600px;height:820px;border-radius:14px;background:linear-gradient(180deg,#263048,#171f30);border:6px solid #3a4560;"></div>
  ${Array.from({ length: 8 }, (_, i) => `<div style="position:absolute;left:${300 + (i % 2) * 260}px;top:${500 + Math.floor(i / 2) * 150}px;
       width:220px;height:100px;border-radius:12px;background:#0b111b;border:4px solid #2b3650;"></div>`).join("")}
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1290px;font-size:34px;">GRID 7 — DEAD · DAY 1</div>
  <div id="onstamp" class="stamp" style="top:1400px;font-size:70px;opacity:0;">LIGHTS ON</div>
  <div class="vign"></div>`);
