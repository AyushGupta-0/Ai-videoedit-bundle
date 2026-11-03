/* Ten Days — Day 2, v3 panels.
 *
 * What changed from v2, and why: the reference reels keep a CHARACTER in frame
 * — second person does not mean nobody on screen, it means the figure is you.
 * v2 had objects and one silhouette. v3 has a consistent vector "you" (hood,
 * backpack) in the car, at the door, between the pillars, and a top-down map
 * of level four for the count, so the thirteenth car is a thing that appears
 * in a bay that was empty rather than a number that changes.
 *
 * Everything is deterministic: seeded jitter only, no unseeded randomness.
 * (The literal name of that function trips the linter even inside a comment.)
 */

/* ---------------- the character: "you" ---------------- */
/* A hooded figure built from rounded rects and one circle, the way REF C's
   lookout is. pose: "seat" (profile, in a seat), "peer" (3/4, leaning),
   "crouch" (low, between cars). scale and x/y position the whole figure. */
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

/* ---------------- a parking level, side-on, in perspective ---------------- */
function level(litIndex, dim = 1) {
  let h = "";
  for (let i = 0; i < 6; i++) {
    const t = i / 5, x = 120 + t * 430, w = 60 - t * 34, top = 620 + t * 120, hgt = 700 - t * 300;
    for (const side of [0, 1]) {
      const px = side ? 1080 - x - w : x;
      h += `<div style="position:absolute;left:${px}px;top:${top}px;width:${w}px;height:${hgt}px;
             background:linear-gradient(90deg,#333c4e,#222a38);opacity:${(1 - t * 0.45) * dim};"></div>`;
    }
  }
  for (let i = 0; i < 5; i++) {
    const t = i / 4, w = 300 - t * 180, hh = 120 - t * 72, y = 1180 - t * 300;
    for (const side of [0, 1]) {
      const x = side ? 1080 - (96 + t * 300) - w : 96 + t * 300;
      const lit = (i * 2 + side) === litIndex;
      h += `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hh}px;
             border-radius:${10 - t * 5}px;background:${lit
               ? "linear-gradient(180deg,#4b4426,#2c2714)" : "linear-gradient(180deg,#2d384f,#1c2433)"};
             opacity:${(0.95 - t * 0.35) * dim};"></div>
            <div style="position:absolute;left:${x + w * 0.16}px;top:${y - hh * 0.40}px;
             width:${w * 0.68}px;height:${hh * 0.44}px;border-radius:${7 - t * 3}px ${7 - t * 3}px 0 0;
             background:${lit ? "#5c5230" : "#36425c"};opacity:${(0.9 - t * 0.35) * dim};"></div>`;
    }
  }
  return h;
}

/* ---------------- top-down map of level four ---------------- */
/* 16 bays in two rows. Twelve cars, yours amber; bay 13 is empty and waits.
   This is the count made visible, so when a car appears there is nothing to
   explain — the viewer did the counting themselves. */
function mapLevel() {
  const bays = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 8; c++) bays.push({ x: 120 + c * 108, y: 700 + r * 330, r, c });
  let h = `<div style="position:absolute;left:60px;right:60px;top:560px;height:800px;border-radius:18px;
             background:#141b28;border:4px solid #2b3650;"></div>
           <div style="position:absolute;left:540px;top:560px;width:4px;height:800px;background:#2b3650;opacity:.0"></div>
           <div style="position:absolute;left:60px;right:60px;top:950px;height:6px;background:#2b3650;"></div>
           <div style="position:absolute;left:96px;top:1270px;color:#55617a;font-size:22px;letter-spacing:4px;">RAMP ↓</div>`;
  // bay lines
  bays.forEach((b) => {
    h += `<div style="position:absolute;left:${b.x - 4}px;top:${b.y - 20}px;width:3px;height:250px;background:#263148;"></div>`;
  });
  // cars: bays 0..10 grey, bay 11 (yours) amber, bay 12 empty -> "#car13"
  bays.forEach((b, i) => {
    if (i === 12) {
      h += `<div id="car13" style="position:absolute;left:${b.x + 10}px;top:${b.y}px;width:80px;height:200px;
             border-radius:22px;background:#5a1e1e;border:3px solid var(--red);opacity:0;
             box-shadow:0 0 0 0 rgba(255,66,66,.0);"></div>`;
      return;
    }
    if (i > 12) return;
    const mine = i === 11;
    h += `<div style="position:absolute;left:${b.x + 10}px;top:${b.y}px;width:80px;height:200px;border-radius:22px;
           background:${mine ? "#5a4a1e" : "#2a3650"};border:3px solid ${mine ? "var(--amber)" : "#3a4967"};"></div>
          <div style="position:absolute;left:${b.x + 24}px;top:${b.y + 40}px;width:52px;height:60px;border-radius:10px;
           background:${mine ? "#6d5a26" : "#1a2234"};"></div>`;
  });
  h += `<div id="mapcount" style="position:absolute;left:0;right:0;top:1400px;text-align:center;color:#fff;
          font-size:84px;font-weight:800;letter-spacing:3px;font-variant-numeric:tabular-nums;">12</div>`;
  return h;
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <!-- in the driver's seat, the jam's tail lights behind: four words, then gone -->
  <div style="position:absolute;left:0;right:0;top:120px;height:600px;
       background:linear-gradient(180deg,#0e1726,#0a1322);"></div>
  ${[150, 400, 650, 880].map((x, i) => `<div style="position:absolute;left:${x}px;top:${420 + (i % 2) * 60}px;
       width:90px;height:20px;border-radius:5px;background:#ff3b3b;opacity:.75;
       box-shadow:0 0 40px rgba(255,60,60,.8);"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:720px;bottom:0;
       background:linear-gradient(180deg,#192234,#0d1422);"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    ${figure("seat", 540, 980, 2.4)}
  </svg>
  <div style="position:absolute;left:170px;top:1360px;width:740px;height:740px;border-radius:50%;
       border:36px solid #141c2c;"></div>
  <div class="vign"></div>`);

mk("hook", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <!-- CLOSE: you, curled in the back seat under the sodium light. This is the
       frame the hook lands on at 1.6s, so the figure fills a third of it -->
  <div style="position:absolute;left:0;right:0;top:0;height:560px;background:linear-gradient(180deg,#1a212e,#0f1520);"></div>
  <div style="position:absolute;left:0;right:0;top:300px;height:14px;border-radius:7px;
       background:#ffd9a0;opacity:.6;box-shadow:0 0 120px 40px rgba(255,200,120,.20);"></div>
  <!-- rear window, car park pillars beyond -->
  <div style="position:absolute;left:60px;right:60px;top:380px;height:420px;border-radius:30px 30px 10px 10px;
       background:linear-gradient(180deg,#121b2c,#0b1220);border:6px solid #2b3650;overflow:hidden;">
    ${[120, 330, 540, 750].map((x) => `<div style="position:absolute;left:${x}px;top:40px;width:60px;height:380px;
         background:linear-gradient(90deg,#2a3449,#1b2333);opacity:.7;"></div>`).join("")}
  </div>
  <!-- the seat back and the seat -->
  <div style="position:absolute;left:0;right:0;top:800px;height:120px;background:linear-gradient(180deg,#242e44,#1a2336);"></div>
  <div style="position:absolute;left:0;right:0;top:1180px;bottom:0;background:linear-gradient(180deg,#1c2538,#0e1422);"></div>
  <svg id="hookfig" width="1080" height="1920" style="position:absolute;inset:0;">
    ${figure("crouch", 560, 1120, 3.1)}
    <!-- the blanket over your legs -->
    <rect x="220" y="1190" width="640" height="150" rx="60" fill="#2a3650" opacity=".9"/>
  </svg>
  <div class="vign"></div>`);

mk("wide", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:620px;background:linear-gradient(180deg,#1a212e,#10161f);"></div>
  <div style="position:absolute;left:0;right:0;top:618px;height:4px;background:#2b3444;"></div>
  <div style="position:absolute;left:0;right:0;top:1280px;bottom:0;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div id="levelart" style="position:absolute;inset:0;">${level(4)}</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <text id="bigfour" x="540" y="430" text-anchor="middle" font-size="190" font-weight="800"
          fill="none" stroke="#55617a" stroke-width="5" font-family="Avenir Next,Arial">4</text>
  </svg>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <!-- from the back seat: dead dashboard, dark gauges. the facts the viewer will need later -->
  <div style="position:absolute;left:0;right:0;top:160px;height:560px;border-radius:0 0 40px 40px;
       background:linear-gradient(180deg,#0f1a2b,#0a1322);"></div>
  <div style="position:absolute;left:0;right:0;top:720px;bottom:0;background:linear-gradient(180deg,#192234,#0a0f17);"></div>
  <div style="position:absolute;left:160px;top:800px;width:760px;height:260px;border-radius:22px;
       background:linear-gradient(180deg,#1b2434,#111826);border:4px solid #2c3850;"></div>
  ${[260, 460, 660].map((x) => `<div style="position:absolute;left:${x}px;top:850px;width:160px;height:160px;border-radius:50%;
       background:#0b111b;border:5px solid #2a3650;"></div>
     <div style="position:absolute;left:${x + 74}px;top:860px;width:6px;height:70px;background:#39465e;
       transform-origin:50% 100%;transform:rotate(-55deg);"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:1130px;display:flex;justify-content:center;gap:18px;">
    <div id="plant1" class="badge" style="font-size:30px;opacity:0;">NO BRAKES</div>
    <div id="plant2" class="badge" style="font-size:30px;opacity:0;">NO LIGHTS</div>
    <div id="plant3" class="badge" style="font-size:30px;opacity:0;">NOBODY SAW YOU</div>
  </div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:720px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;
         background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span>
    </div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}
    </div>
  </div>
  <!-- your hand on the crank: the thing you do every night without thinking -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <rect x="800" y="860" width="60" height="150" rx="26" fill="#d9b08c" transform="rotate(-20 830 935)"/>
  </svg>
  <div id="radioline" style="position:absolute;left:0;right:0;top:1100px;text-align:center;color:#6f7b93;
       font-size:30px;letter-spacing:4px;">STAY ABOVE STREET LEVEL</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "PARK FACING<br>THE RAMP", "the only way down"));
/* rule 1 obeyed: the level from the ramp's end, your car turned nose-on, an
   arrow from it to the ramp drawing itself on. The rule becomes a thing you did. */
mk("nose", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:620px;background:linear-gradient(180deg,#1a212e,#10161f);"></div>
  <div style="position:absolute;left:0;right:0;top:618px;height:4px;background:#2b3444;"></div>
  <div style="position:absolute;left:0;right:0;top:1280px;bottom:0;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div style="position:absolute;inset:0;opacity:.55;">${level(-1)}</div>
  <!-- your car, nose-on, centre: headlights dark -->
  <div style="position:absolute;left:340px;top:980px;width:400px;height:300px;border-radius:40px 40px 18px 18px;
       background:linear-gradient(180deg,#5a4a1e,#2c2714);border:5px solid var(--amber);"></div>
  <div style="position:absolute;left:390px;top:1010px;width:300px;height:110px;border-radius:24px;background:#0d1726;border:4px solid #6d5a26;overflow:hidden;">
    <svg width="300" height="110" style="position:absolute;inset:0;">${figure("seat", 150, 70, 0.6)}</svg>
  </div>
  ${[380, 640].map((x) => `<div style="position:absolute;left:${x}px;top:1200px;width:60px;height:34px;border-radius:10px;background:#1a2234;border:3px solid #3a4967;"></div>`).join("")}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path id="nosearrow" d="M540,960 L540,760" stroke="var(--amber)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="nosehead" d="M500,800 L540,750 L580,800" stroke="var(--amber)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <text x="540" y="710" text-anchor="middle" fill="#8b97ab" font-size="26" letter-spacing="6" font-family="Avenir Next,Arial">RAMP</text>
  </svg>
  <div class="vign"></div>`);

/* rule 2 obeyed: from the back seat, looking out of the rear window — the
   view the driver's seat does not give you */
mk("rear", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:560px;background:linear-gradient(180deg,#1a212e,#0f1520);"></div>
  <div style="position:absolute;left:60px;right:60px;top:380px;height:520px;border-radius:30px 30px 10px 10px;
       background:linear-gradient(180deg,#121b2c,#0b1220);border:6px solid #2b3650;overflow:hidden;">
    ${[120, 330, 540, 750].map((x) => `<div style="position:absolute;left:${x}px;top:40px;width:60px;height:480px;
         background:linear-gradient(90deg,#2a3449,#1b2333);opacity:.7;"></div>`).join("")}
    <!-- far end of the level: the stairwell door, small, lit -->
    <div id="fardoor" style="position:absolute;left:440px;top:120px;width:80px;height:200px;border-radius:6px;
         background:#1a2230;border:4px solid #35425a;"></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:900px;height:120px;background:linear-gradient(180deg,#242e44,#1a2336);"></div>
  <div style="position:absolute;left:0;right:0;top:1180px;bottom:0;background:linear-gradient(180deg,#1c2538,#0e1422);"></div>
  <!-- you, in the back, turned to look out -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 300, 1240, 2.2)}</svg>
  <div class="vign"></div>`);

mk("rule2", rule(2, "SLEEP IN<br>THE BACK", "never the driver's seat — you cannot see behind you"));
mk("rule3", rule(3, "COUNT THE CARS<br>BEFORE DARK", ""));

mk("map", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">LEVEL 4 · TOP DOWN</div>
  <div id="maparea" style="position:absolute;inset:0;">${mapLevel()}</div>
  <div class="vign"></div>`);

mk("bad", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the fire door, and you, watching it from the back seat -->
  <div style="position:absolute;left:300px;top:300px;width:480px;height:900px;border-radius:8px;
       background:linear-gradient(180deg,#232c3c,#151c28);border:5px solid #35425a;"></div>
  <div style="position:absolute;left:330px;top:720px;width:420px;height:32px;border-radius:7px;background:#49587a;"></div>
  <div style="position:absolute;left:0;right:0;top:1060px;text-align:center;">
    <div class="badge red" style="font-size:34px;">NO LOCK</div>
  </div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 160, 1330, 1.25)}</svg>
  <div class="vign"></div>`);

mk("door", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:300px;top:300px;width:480px;height:900px;border-radius:8px;
       background:linear-gradient(180deg,#1a2230,#11171f);border:5px solid #2b344a;"></div>
  <div id="wedge" style="position:absolute;left:300px;top:300px;width:0px;height:900px;
       background:linear-gradient(90deg,#6d7fa6,#2b344a);"></div>
  <!-- you freeze. the only thing that moves is the light -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 160, 1330, 1.25, "#141b2a")}</svg>
  <div class="vign"></div>`);

mk("steps", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:1280px;bottom:0;background:#101620;"></div>
  <div style="position:absolute;inset:0;opacity:.55;">${level(-1)}</div>
  <div id="pool1" style="position:absolute;left:170px;top:1310px;width:230px;height:70px;border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <div id="pool2" style="position:absolute;left:430px;top:1310px;width:230px;height:70px;border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <div id="pool3" style="position:absolute;left:690px;top:1310px;width:230px;height:70px;border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <!-- a shadow crosses the pools, low, between the cars -->
  <div id="shadow" style="position:absolute;left:120px;top:1150px;width:120px;height:230px;border-radius:60px 60px 10px 10px;
       background:#03060b;opacity:.9;"></div>
  <!-- and you, crouched low behind your own car -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("crouch", 880, 1500, 0.9)}</svg>
  <div class="vign"></div>`);

mk("voice", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;opacity:.5;">${level(-1)}</div>
  <div style="position:absolute;left:400px;top:700px;width:180px;height:180px;border-radius:50%;background:#03060b;"></div>
  <div style="position:absolute;left:300px;top:870px;width:380px;height:460px;border-radius:130px 130px 0 0;background:#03060b;"></div>
  <div id="halo" style="position:absolute;left:180px;top:620px;width:620px;height:760px;
       background:radial-gradient(circle at 50% 28%,rgba(190,215,255,.17),rgba(0,0,0,0) 62%);"></div>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;">
    <span id="lvl" style="display:inline-block;color:var(--red);font-size:60px;font-weight:800;letter-spacing:8px;
          font-variant-numeric:tabular-nums;">LEVEL ??</span>
  </div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:0;right:0;top:160px;height:560px;border-radius:0 0 40px 40px;
       background:linear-gradient(180deg,#0f1a2b,#0a1322);"></div>
  <div style="position:absolute;left:0;right:0;top:720px;bottom:0;background:linear-gradient(180deg,#192234,#0a0f17);"></div>
  <div style="position:absolute;left:160px;top:800px;width:760px;height:260px;border-radius:22px;
       background:linear-gradient(180deg,#1b2434,#111826);border:4px solid #2c3850;"></div>
  ${[260, 460, 660].map((x) => `<div style="position:absolute;left:${x}px;top:850px;width:160px;height:160px;border-radius:50%;
       background:#0b111b;border:5px solid #2a3650;"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:1130px;display:flex;justify-content:center;gap:18px;">
    <div class="badge red" style="font-size:30px;">NO BRAKES</div>
    <div class="badge red" style="font-size:30px;">NOBODY SAW YOU</div>
  </div>
  <div id="brakestamp" class="stamp" style="top:1260px;font-size:64px;opacity:0;">NEVER ON</div>
  <div class="vign"></div>`);

mk("count", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">LEVEL 4 · TOP DOWN</div>
  <div id="maparea2" style="position:absolute;inset:0;">${mapLevel().replace('id="car13"', 'id="car13b"').replace('id="mapcount"', 'id="mapcount2"')}</div>
  <div class="vign"></div>`);
