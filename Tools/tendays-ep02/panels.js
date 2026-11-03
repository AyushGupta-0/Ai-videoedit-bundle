/* A parking level in perspective: slab above, slab below, pillars receding.
   Deterministic throughout — the renderer seeks frames out of order. */
function level(litIndex){
  let h = "";
  for (let i = 0; i < 6; i++){
    const t = i / 5;
    const x = 120 + t * 430, w = 60 - t * 34, top = 620 + t * 120, hgt = 700 - t * 300;
    for (const side of [0, 1]){
      const px = side ? 1080 - x - w : x;
      h += `<div style="position:absolute;left:${px}px;top:${top}px;width:${w}px;height:${hgt}px;
             background:linear-gradient(90deg,#333c4e,#222a38);opacity:${1 - t*0.45};"></div>`;
    }
  }
  // parked cars down both sides, one of them lit
  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const w = 300 - t * 180, hh = 120 - t * 72;
    const y = 1180 - t * 300;
    for (const side of [0, 1]){
      const x = side ? 1080 - (96 + t * 300) - w : 96 + t * 300;
      const lit = (i * 2 + side) === litIndex;
      h += `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hh}px;
             border-radius:${10 - t*5}px;background:${lit
               ? "linear-gradient(180deg,#4b4426,#2c2714)" : "linear-gradient(180deg,#2d384f,#1c2433)"};
             opacity:${0.95 - t*0.35};"></div>
            <div style="position:absolute;left:${x + w*0.16}px;top:${y - hh*0.40}px;
             width:${w*0.68}px;height:${hh*0.44}px;border-radius:${7-t*3}px ${7-t*3}px 0 0;
             background:${lit ? "#5c5230" : "#36425c"};opacity:${0.9 - t*0.35};"></div>`;
    }
  }
  return h;
}

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:150px;top:430px;width:780px;height:740px;border-radius:14px;
       background:linear-gradient(180deg,#0f1a2b,#0a1322);border:4px solid #2c3850;overflow:hidden;">
    <div style="position:absolute;left:285px;top:150px;width:210px;height:210px;border-radius:50%;
         background:#05080f;opacity:.55;"></div>
    <div style="position:absolute;left:170px;top:345px;width:440px;height:430px;
         border-radius:150px 150px 0 0;background:#05080f;opacity:.55;"></div>
  </div>
  <div id="recapx" style="position:absolute;left:50%;top:760px;transform:translateX(-50%) rotate(-6deg);
       border:7px solid var(--amber);color:var(--amber);font-size:72px;font-weight:800;
       letter-spacing:6px;padding:12px 40px;border-radius:8px;">YOU DROVE</div>
  <div class="vign"></div>`);

mk("park", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:620px;
       background:linear-gradient(180deg,#1a212e,#10161f);"></div>
  <div style="position:absolute;left:0;right:0;top:618px;height:4px;background:#2b3444;"></div>
  <div style="position:absolute;left:0;right:0;top:1280px;bottom:0;
       background:linear-gradient(180deg,#161d28,#0c1119);"></div>
  <div id="levelart" style="position:absolute;inset:0;">${level(4)}</div>
  <!-- strip lights: the only light source on a parking level -->
  <div style="position:absolute;left:300px;top:540px;width:480px;height:10px;border-radius:5px;
       background:#cfe0ff;opacity:.5;box-shadow:0 0 70px 24px rgba(180,210,255,.18);"></div>
  <div style="position:absolute;left:0;right:0;top:300px;text-align:center;color:#55617a;
       font-size:150px;font-weight:800;letter-spacing:10px;opacity:.5;">4</div>
  <div class="vign"></div>`);

mk("ramp", `<div style="position:absolute;inset:0;background:#0a0f17;"></div>
  <!-- the single ramp, drawn as a converging trapezoid: one way in -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    <polygon points="140,1600 940,1600 700,760 380,760" fill="#1b2330"/>
    <polygon id="rampline" points="140,1600 940,1600 700,760 380,760" fill="none"
             stroke="#5b6d94" stroke-width="6"/>
    <line id="rampmid" x1="540" y1="1560" x2="540" y2="820" stroke="#6b7fa8" stroke-width="7"/>
  </svg>
  <div style="position:absolute;left:0;right:0;top:600px;text-align:center;">
    <div style="display:inline-block;border:4px solid var(--amber);color:var(--amber);
         font-size:38px;font-weight:800;letter-spacing:4px;padding:14px 34px;border-radius:8px;">
      ONE WAY IN</div>
  </div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:780px;width:580px;height:290px;
       border-radius:16px;background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;
       box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;
         background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;
            text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span>
    </div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;
         background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;
         background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({length:10},()=>`<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}
    </div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1150px;text-align:center;color:#6f7b93;
       font-size:30px;letter-spacing:4px;">STAY OFF THE GROUND FLOOR</div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "PARK FACING<br>THE RAMP", "the only way down"));
mk("rule2", rule(2, "SLEEP IN THE<br>BACK SEAT", "never the driver's — you cannot see behind you"));
mk("rule3", rule(3, "COUNT THE CARS<br>BEFORE DARK", ""));

mk("good", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div class="news">
    <h4>GOOD NEWS</h4>
    <div class="row"><span>Cars on level four</span><span>11</span></div>
    <div class="row"><span>Yours</span><span>THE 12TH</span></div>
    <div class="row"><span>Ways up</span><span>1</span></div>
  </div>
  <div class="vign"></div>`);

mk("bad", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- a fire door: push bar, no keyhole. the vulnerability as an object -->
  <div style="position:absolute;left:250px;top:380px;width:580px;height:1080px;border-radius:8px;
       background:linear-gradient(180deg,#232c3c,#151c28);border:5px solid #35425a;"></div>
  <div style="position:absolute;left:286px;top:880px;width:508px;height:34px;border-radius:7px;
       background:#49587a;"></div>
  <div style="position:absolute;left:0;right:0;top:1190px;text-align:center;">
    <div style="display:inline-block;border:4px solid var(--red);color:var(--red);font-size:38px;
         font-weight:800;letter-spacing:4px;padding:14px 32px;border-radius:8px;
         background:rgba(8,12,20,.85);">NO LOCK</div>
  </div>
  <div class="vign"></div>`);

mk("door", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:250px;top:380px;width:580px;height:1080px;border-radius:8px;
       background:linear-gradient(180deg,#1a2230,#11171f);border:5px solid #2b344a;"></div>
  <!-- the door ajar: a wedge of stairwell light, opening then closing -->
  <div id="wedge" style="position:absolute;left:250px;top:380px;width:0px;height:1080px;
       background:linear-gradient(90deg,#6d7fa6,#2b344a);"></div>
  <div class="vign"></div>`);

mk("steps", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;left:0;right:0;top:1280px;bottom:0;background:#101620;"></div>
  <div style="position:absolute;inset:0;opacity:.55;">${level(-1)}</div>
  <!-- pools of light; something crosses them one at a time -->
  <div id="pool1" style="position:absolute;left:170px;top:1310px;width:230px;height:70px;
       border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <div id="pool2" style="position:absolute;left:430px;top:1310px;width:230px;height:70px;
       border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <div id="pool3" style="position:absolute;left:690px;top:1310px;width:230px;height:70px;
       border-radius:50%;background:rgba(190,215,255,.13);"></div>
  <div class="vign"></div>`);

mk("voice", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;opacity:.5;">${level(-1)}</div>
  <div style="position:absolute;left:400px;top:700px;width:180px;height:180px;border-radius:50%;
       background:#03060b;"></div>
  <div style="position:absolute;left:300px;top:870px;width:380px;height:460px;
       border-radius:130px 130px 0 0;background:#03060b;"></div>
  <div id="halo" style="position:absolute;left:180px;top:620px;width:620px;height:760px;
       background:radial-gradient(circle at 50% 28%,rgba(190,215,255,.17),rgba(0,0,0,0) 62%);"></div>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;">
    <span id="lvl" style="display:inline-block;color:var(--red);font-size:60px;font-weight:800;
          letter-spacing:8px;font-variant-numeric:tabular-nums;">LEVEL ??</span>
  </div>
  <div class="vign"></div>`);

mk("dash", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:0;right:0;top:1180px;bottom:0;
       background:linear-gradient(180deg,#161d2a,#0a0f17);"></div>
  <!-- brake pedal, unlit. the thing the voice claims to have seen -->
  <div style="position:absolute;left:400px;top:820px;width:280px;height:340px;border-radius:14px;
       background:linear-gradient(180deg,#2a3448,#1a2230);border:4px solid #39465e;"></div>
  <div style="position:absolute;left:432px;top:860px;width:216px;height:260px;border-radius:9px;
       background:#141b26;"></div>
  <div style="position:absolute;left:0;right:0;top:1240px;display:flex;justify-content:center;gap:22px;">
    <div id="plant1" class="badge" style="font-size:32px;opacity:0;">NO BRAKES</div>
    <div id="plant2" class="badge" style="font-size:32px;opacity:0;">NO LIGHTS</div>
  </div>
  <div class="vign"></div>`);

mk("dash2", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:0;right:0;top:1180px;bottom:0;
       background:linear-gradient(180deg,#161d2a,#0a0f17);"></div>
  <!-- brake pedal, unlit. the thing the voice claims to have seen -->
  <div style="position:absolute;left:400px;top:820px;width:280px;height:340px;border-radius:14px;
       background:linear-gradient(180deg,#2a3448,#1a2230);border:4px solid #39465e;"></div>
  <div style="position:absolute;left:432px;top:860px;width:216px;height:260px;border-radius:9px;
       background:#141b26;"></div>
  <div style="position:absolute;left:0;right:0;top:1260px;text-align:center;">
    <div id="brakestamp" class="badge red" style="font-size:34px;">BRAKE LIGHTS — NEVER ON</div>
  </div>
  <div class="vign"></div>`);

mk("count", `<div style="position:absolute;inset:0;background:#07090f;"></div>
  <div class="grid">
    ${Array.from({length:11},()=>`<div class="cc"></div>`).join("")}
    <div class="cc me"></div>
    <div class="cc extra" id="extra"></div>
  </div>
  <div class="countlabel" id="cnum">12</div>
  <div class="vign"></div>`);
