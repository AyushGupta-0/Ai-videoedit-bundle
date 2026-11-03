/* An empty A-road at night: verges converging, dashes running away from camera. */
function road(){
  let h = `<div style="position:absolute;left:0;right:0;top:0;height:700px;
            background:linear-gradient(180deg,#0a1020,#16233a);"></div>
           <div style="position:absolute;left:0;right:0;top:700px;bottom:0;
            background:linear-gradient(180deg,#1b2230,#0b0f17);"></div>`;
  h += `<svg width="1080" height="1920" style="position:absolute;inset:0;">
          <polygon points="-180,1920 1260,1920 640,700 440,700" fill="#171e2b"/>
          <line x1="-180" y1="1920" x2="440" y2="700" stroke="#3a4a66" stroke-width="6"/>
          <line x1="1260" y1="1920" x2="640" y2="700" stroke="#3a4a66" stroke-width="6"/>
        </svg>`;
  for (let i = 0; i < 11; i++){
    const t = i / 10;
    const y = 1920 - Math.pow(1 - t, 1.9) * 1180;
    const w = 26 - t * 20, len = 150 - t * 128;
    h += `<div style="position:absolute;left:${540 - w/2}px;top:${y - len}px;width:${w}px;
           height:${len}px;border-radius:4px;background:#5a6a86;opacity:${0.55 - t*0.34};"></div>`;
  }
  return h;
}

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;opacity:.4;">${road()}</div>
  <div class="stamp" style="top:800px;border-color:var(--amber);color:var(--amber);">OUT THE BACK</div>
  <div class="vign"></div>`);

mk("road", `<div style="position:absolute;inset:0;">${road()}</div>
  <div id="roadart" style="position:absolute;inset:0;"></div>
  <div class="vign"></div>`);

mk("follow", `<div style="position:absolute;inset:0;">${road()}</div>
  <!-- their headlights, held at a constant distance in your mirror -->
  <div id="lamps" style="position:absolute;left:430px;top:830px;width:220px;height:60px;">
    <div style="position:absolute;left:0;top:0;width:78px;height:40px;border-radius:20px;
         background:#fff3cf;box-shadow:0 0 70px 26px rgba(255,238,190,.40);"></div>
    <div style="position:absolute;right:0;top:0;width:78px;height:40px;border-radius:20px;
         background:#fff3cf;box-shadow:0 0 70px 26px rgba(255,238,190,.40);"></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:1060px;text-align:center;">
    <span class="badge">400 METRES — FOR 60 MILES</span></div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:760px;width:580px;height:290px;
       border-radius:16px;background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;
         background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;
         background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({length:10},()=>`<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}
    </div></div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "NEVER DRIVE<br>STRAIGHT TO WHERE<br>YOU SLEEP", ""));
mk("rule2", rule(2, "NEVER LET A<br>STRANGER SEE<br>YOUR FUEL", ""));
mk("rule3", rule(3, "DO NOT STOP<br>ON OPEN ROAD", ""));

mk("good", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div class="news"><h4>GOOD NEWS</h4>
    <div class="row"><span>Fuel remaining</span><span>90 MILES</span></div>
    <div class="row"><span>Gap they closed</span><span>NONE</span></div>
    <div class="row"><span>Hours followed</span><span>1.5</span></div></div>
  <div class="vign"></div>`);

mk("bad", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- every road converging on a single crossing -->
  <svg width="1080" height="1920" style="position:absolute;inset:0;">
    ${[0,1,2,3,4].map(i=>{const x=120+i*210;
      return `<line x1="${x}" y1="430" x2="540" y2="1060" stroke="#3a4a66" stroke-width="7"/>`;}).join("")}
    <line x1="540" y1="1060" x2="540" y2="1520" stroke="#f0a93c" stroke-width="9"/>
  </svg>
  <div style="position:absolute;left:452px;top:1012px;width:176px;height:96px;border-radius:10px;
       border:5px solid var(--red);background:rgba(10,14,22,.9);"></div>
  <div style="position:absolute;left:0;right:0;top:1200px;text-align:center;">
    <span class="badge red">ONE BRIDGE</span></div>
  <div class="vign"></div>`);

mk("junction", `<div style="position:absolute;inset:0;">${road()}</div>
  <div id="dark" style="position:absolute;inset:0;background:#05080e;opacity:0;"></div>
  <div class="vign"></div>`);

mk("sos", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <!-- mirror view: their lamps, flashing the pattern -->
  <div style="position:absolute;left:190px;top:620px;width:700px;height:300px;border-radius:18px;
       border:6px solid #2d3850;background:#080d16;"></div>
  <div id="sosL" style="position:absolute;left:330px;top:730px;width:110px;height:60px;
       border-radius:30px;background:#fff3cf;opacity:.12;"></div>
  <div id="sosR" style="position:absolute;left:640px;top:730px;width:110px;height:60px;
       border-radius:30px;background:#fff3cf;opacity:.12;"></div>
  <div style="position:absolute;left:0;right:0;top:1010px;text-align:center;">
    <div style="display:inline-flex;gap:16px;align-items:center;">
      ${[1,1,1,0,0,0,1,1,1].map((lng,i)=>`<div style="width:${lng?54:20}px;height:18px;
        border-radius:9px;background:var(--amber);opacity:.9;"></div>`).join("")}
    </div>
    <div style="margin-top:26px;color:var(--red);font-size:44px;font-weight:800;
         letter-spacing:8px;">S.O.S.</div>
  </div>
  <div class="vign"></div>`);

mk("drive", `<div style="position:absolute;inset:0;">${road()}</div>
  <div style="position:absolute;left:0;right:0;top:1180px;text-align:center;">
    <span class="badge red">YOU KEEP DRIVING</span></div>
  <div class="vign"></div>`);

mk("out", `<div style="position:absolute;inset:0;background:#05080e;"></div>
  <div style="position:absolute;left:190px;top:620px;width:700px;height:300px;border-radius:18px;
       border:6px solid #2d3850;background:#080d16;"></div>
  <div id="outL" style="position:absolute;left:330px;top:730px;width:110px;height:60px;
       border-radius:30px;background:#fff3cf;box-shadow:0 0 60px 20px rgba(255,238,190,.35);"></div>
  <div id="outR" style="position:absolute;left:640px;top:730px;width:110px;height:60px;
       border-radius:30px;background:#fff3cf;box-shadow:0 0 60px 20px rgba(255,238,190,.35);"></div>
  <div class="vign"></div>`);
