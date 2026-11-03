/* Ten Days — Day 7: carriage 32.
 *
 * Same template. You walk the train you did not check. The plant is the
 * radio's "do not open sealed compartments"; the recall is Day 4 — the SOS
 * pattern you watched in a mirror and drove away from is now being knocked
 * on the far side of a steel door. Rule 3 ("never open a door you can't
 * close") is the one the end card asks you to break.
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

/* a carriage from inside, in perspective: floor, walls, the far door, your torch pooled on the floor */
function corridor(k) {
  return `<div style="position:absolute;inset:0;background:#05070c;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <defs><radialGradient id="pool${k}"><stop offset="0" stop-color="#f0d08a" stop-opacity=".85"/><stop offset="1" stop-color="#f0d08a" stop-opacity="0"/></radialGradient></defs>
    <polygon points="0,260 400,760 400,980 0,1520" fill="#0d1320"/>
    <polygon points="1080,260 680,760 680,980 1080,1520" fill="#0d1320"/>
    <polygon points="0,1520 1080,1520 680,980 400,980" fill="#141b28"/>
    <rect x="400" y="760" width="280" height="220" fill="#080c14" stroke="#2b3650" stroke-width="4"/>
    ${[0, 1, 2, 3].map((i) => { const x = 60 + i * 80, y = 560 + i * 70, w = 60, h = 180 - i * 20, sl = [40, 35, 29, 24][i];
      return `<polygon points="${x},${y} ${x + w},${y + sl} ${x + w},${y + h + sl} ${x},${y + h}" fill="#070a12"/>
      <polygon points="${1020 - x - w},${y + sl} ${1020 - x},${y} ${1020 - x},${y + h} ${1020 - x - w},${y + h + sl}" fill="#070a12"/>`; }).join("")}
    <ellipse id="pool${k}e" cx="540" cy="1080" rx="200" ry="46" fill="url(#pool${k})"/>
    ${figure("back", 540, 1180, 1.25)}
  </svg>`;
}

/* the far door of carriage 32 and the brake lever beside it */
function doorScene() {
  return `<div style="position:absolute;inset:0;background:#05070c;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1500px;background:linear-gradient(180deg,#0a0f18,#111826);"></div>
  <div id="door" style="position:absolute;left:320px;top:420px;width:440px;height:1000px;border-radius:14px 14px 0 0;background:linear-gradient(180deg,#2a3650,#1b2435);border:10px solid #3a4967;">
    ${[0, 1, 2, 3, 4, 5].map((i) => `<div style="position:absolute;left:14px;top:${40 + i * 180}px;width:16px;height:16px;border-radius:50%;background:#4a5a7c;"></div>
      <div style="position:absolute;right:14px;top:${40 + i * 180}px;width:16px;height:16px;border-radius:50%;background:#4a5a7c;"></div>`).join("")}
    <div style="position:absolute;left:0;right:0;top:120px;text-align:center;color:#7d8aa6;font-size:120px;font-weight:800;">32</div>
    <div style="position:absolute;left:160px;top:560px;width:100px;height:26px;border-radius:13px;background:#0b111b;border:3px solid #4a5a7c;"></div>
  </div>
  <div id="lever" style="position:absolute;left:880px;top:720px;width:22px;height:300px;border-radius:11px;background:#4a5a7c;transform-origin:50% 100%;"></div>
  <div style="position:absolute;left:866px;top:690px;width:50px;height:50px;border-radius:50%;background:var(--red);"></div>
  <div style="position:absolute;left:820px;top:1040px;color:#55617a;font-size:20px;letter-spacing:5px;">BRAKE</div>
  <div style="position:absolute;left:0;right:0;top:1420px;height:80px;background:#1b2435;"></div>
  <div style="position:absolute;left:0;right:0;top:1500px;bottom:0;background:#0a0f17;"></div>`;
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

/* the SOS pattern as bars: long long long · short short short · long long long */
function sos(cls, color) {
  return [90, 90, 90, 36, 36, 36, 90, 90, 90].map((w, i) => `<div class="${cls}" style="width:${w}px;height:28px;border-radius:6px;background:${color};box-shadow:0 0 22px ${color};opacity:0;${i === 3 || i === 6 ? "margin-left:26px;" : ""}"></div>`).join("");
}

/* ============================ PANELS ============================ */

mk("recap", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${diagram(11)}
  <div style="position:absolute;left:184px;top:950px;width:42px;height:130px;border-radius:6px;background:var(--red);box-shadow:0 0 30px var(--red);"></div>
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1300px;font-size:30px;">→ CARRIAGE 32</div>
  <div class="vign"></div>`);

mk("hook", `${corridor("h")}
  <div style="position:absolute;right:70px;top:300px;text-align:right;">
    <div id="togo" style="color:#fff;font-size:120px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;">31</div>
    <div style="color:#55617a;font-size:22px;letter-spacing:6px;">TO THE BRAKE</div></div>
  <div id="sealedb" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1400px;font-size:30px;opacity:0;">SEALED · FROM THE INSIDE</div>
  <div class="vign"></div>`);

mk("wide", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,#070b14,#0f1626);"></div>
  <!-- the whole train, side on, tiny: engine left, 32 carriages, the lever at the far end -->
  <div style="position:absolute;left:50px;top:900px;width:70px;height:70px;border-radius:24px 8px 6px 6px;background:#2a3650;border:4px solid var(--amber);"></div>
  ${Array.from({ length: 32 }, (_, i) => `<div style="position:absolute;left:${130 + i * 28}px;top:912px;width:22px;height:58px;border-radius:4px;background:${i === 31 ? "#2a0e0e" : "#1f2a3f"};border:3px solid ${i === 31 ? "var(--red)" : "#3a4967"};"></div>`).join("")}
  <div style="position:absolute;left:0;right:0;top:976px;height:8px;background:#4a5775;"></div>
  <div style="position:absolute;left:0;right:0;top:984px;height:90px;background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div style="position:absolute;left:1038px;top:850px;width:10px;height:60px;border-radius:5px;background:var(--red);"></div>
  <div style="position:absolute;left:0;right:0;top:770px;text-align:center;color:#55617a;font-size:22px;letter-spacing:6px;">ENGINE → LEVER</div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M90,830 L1030,830" stroke="#3a4560" stroke-width="6" stroke-dasharray="10 14" fill="none"/>
    <g id="walker">${figure("peer", 100, 790, 0.42)}</g>
  </svg>
  <div style="position:absolute;left:0;right:0;top:1180px;text-align:center;color:#fff;font-size:72px;font-weight:800;">ON FOOT</div>
  <div style="position:absolute;left:0;right:0;top:1280px;text-align:center;color:#55617a;font-size:24px;letter-spacing:6px;">HALF A MILE OF DARK</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "TORCH AT THE FLOOR.<br>NEVER AHEAD.", "legs before faces"));

mk("obey1", `${corridor("a")}
  <div style="position:absolute;right:70px;top:300px;text-align:right;">
    <div style="color:#fff;font-size:120px;font-weight:800;line-height:1;">1</div>
    <div style="color:#55617a;font-size:22px;letter-spacing:6px;">CARRIAGE</div></div>
  <div id="empty1" class="stamp" style="top:1330px;font-size:64px;opacity:0;border-color:#5df2b0;color:#5df2b0;">EMPTY</div>
  <div class="vign"></div>`);

mk("plant", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div style="position:absolute;left:250px;top:600px;width:580px;height:290px;border-radius:16px;
       background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({ length: 10 }, () => `<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}</div>
  </div>
  <div class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:980px;font-size:30px;">RECOVERY · 4 DAYS</div>
  <div id="noopen" class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1100px;font-size:30px;opacity:0;">DO NOT OPEN SEALED DOORS</div>
  <div class="vign"></div>`);

mk("rule2", rule(2, "ONE HAND<br>ALWAYS EMPTY.", ""));

mk("obey2", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;">
    <div id="cnum" style="color:#fff;font-size:120px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;">12</div>
    <div style="color:#55617a;font-size:22px;letter-spacing:6px;">CARRIAGE</div></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <defs><linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d08a" stop-opacity=".8"/><stop offset="1" stop-color="#f0d08a" stop-opacity="0"/></linearGradient></defs>
    <!-- left: the torch hand, beam down -->
    <rect x="150" y="760" width="220" height="330" rx="90" fill="#d9b08c"/>
    <rect x="210" y="1040" width="100" height="220" rx="26" fill="#3a4967"/>
    <polygon points="200,1260 320,1260 420,1480 100,1480" fill="url(#tb)"/>
    <!-- right: the empty hand -->
    <rect x="700" y="780" width="230" height="300" rx="70" fill="#d9b08c"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${704 + i * 58}" y="${600 + (i === 0 || i === 3 ? 40 : 0)}" width="46" height="220" rx="23" fill="#d9b08c"/>`).join("")}
    <rect x="640" y="820" width="64" height="170" rx="32" fill="#d9b08c" transform="rotate(28 672 905)"/>
  </svg>
  <div style="position:absolute;left:150px;width:220px;top:1120px;text-align:center;color:#55617a;font-size:22px;letter-spacing:6px;">TORCH</div>
  <div style="position:absolute;left:700px;width:230px;top:1120px;text-align:center;color:#5df2b0;font-size:22px;letter-spacing:6px;">FREE</div>
  <div id="empty2" class="stamp" style="top:1330px;font-size:64px;opacity:0;border-color:#5df2b0;color:#5df2b0;">EMPTY</div>
  <div class="vign"></div>`);

mk("count", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  ${diagram(31)}
  <div id="c31read" style="position:absolute;left:0;right:0;top:1300px;text-align:center;color:#5df2b0;font-size:30px;letter-spacing:6px;font-weight:800;">CHECKED · <span id="cn">11</span> / 31</div>
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:1370px;font-size:30px;">32 · SEALED</div>
  <div class="vign"></div>`);

mk("rule3", rule(3, "NEVER OPEN A DOOR<br>YOU CAN'T CLOSE.", "behind you"));

mk("obey3", `${doorScene()}
  <svg width="1080" height="1920" style="position:absolute;inset:0;">${figure("peer", 170, 1290, 1.15)}</svg>
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:300px;font-size:30px;">SEALED · FROM THE INSIDE</div>
  <div id="noneed" class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:1300px;font-size:28px;opacity:0;">YOU DON'T NEED THE DOOR</div>
  <div class="vign"></div>`);

mk("knock", `${doorScene()}
  <svg width="1080" height="1920" style="position:absolute;inset:0;"><rect x="820" y="760" width="60" height="150" rx="26" fill="#d9b08c" transform="rotate(-20 850 835)"/></svg>
  <div id="knocks" style="position:absolute;left:0;right:0;top:820px;display:flex;justify-content:center;align-items:center;gap:14px;">${sos("kb", "#ffffff")}</div>
  <div id="knockword" style="position:absolute;left:0;right:0;top:300px;text-align:center;color:var(--red);font-size:60px;font-weight:800;letter-spacing:8px;opacity:0;">KNOCKING</div>
  <div class="vign"></div>`);

mk("recall", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:1500px;background:linear-gradient(180deg,#0a0f18,#0d1422);"></div>
  <!-- the rear-view mirror from Day 4, and the lights in it -->
  <div style="position:absolute;left:140px;top:560px;width:800px;height:300px;border-radius:40px;background:#02030a;border:12px solid #2a3449;overflow:hidden;">
    <div id="mirrorlight" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:14px;">${sos("mb", "#f0a93c")}</div>
  </div>
  <div style="position:absolute;left:160px;top:470px;width:40px;height:90px;background:#2a3449;"></div>
  <div class="badge" style="position:absolute;left:50%;transform:translateX(-50%);top:940px;font-size:30px;">DAY 4 · YOUR MIRROR</div>
  <div id="lightsout" class="stamp" style="top:1180px;font-size:64px;opacity:0;">LIGHTS OUT</div>
  <div class="vign"></div>`);

mk("walk", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div style="position:absolute;left:60px;right:60px;top:420px;height:1060px;border-radius:18px;background:#141b28;border:4px solid #2b3650;"></div>
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <path d="M540,540 L540,1340" stroke="#3a4560" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="28 18"/>
    <circle cx="540" cy="540" r="22" fill="#3a4560"/>
    <rect x="518" y="1318" width="44" height="44" rx="8" fill="var(--red)"/>
    <g id="her">${figure("peer", 540, 600, 0.55, "#3a2e1e")}</g>
  </svg>
  <div style="position:absolute;left:0;right:0;top:450px;text-align:center;color:#55617a;font-size:22px;letter-spacing:6px;">DAY 4 · THE ROAD</div>
  <div style="position:absolute;left:0;right:0;top:1390px;text-align:center;color:var(--red);font-size:24px;letter-spacing:6px;font-weight:800;">DAY 7 · CARRIAGE 32</div>
  <div style="position:absolute;left:120px;top:900px;color:#fff;font-size:44px;font-weight:800;line-height:1.1;">3<br><span style="font-size:22px;color:#55617a;letter-spacing:5px;">DAYS</span></div>
  <div style="position:absolute;right:120px;top:900px;text-align:right;color:#fff;font-size:44px;font-weight:800;line-height:1.1;">ON<br><span style="font-size:22px;color:#55617a;letter-spacing:5px;">FOOT</span></div>
  <div id="following" class="stamp" style="top:1160px;font-size:60px;opacity:0;">FOLLOWING YOU</div>
  <div class="vign"></div>`);

mk("twist", `${doorScene()}
  <div class="badge red" style="position:absolute;left:50%;transform:translateX(-50%);top:300px;font-size:30px;">SEALED · FROM THE INSIDE</div>
  <div id="against" class="stamp" style="top:1180px;font-size:60px;opacity:0;">AGAINST SOMETHING</div>
  <div class="vign"></div>`);
