/* A service-station interior: shelf bays receding, one exit at the far end.
   Deterministic throughout — the renderer seeks frames out of order. */
function bays(empty){
  let h = "";
  for (let i = 0; i < 5; i++){
    const t = i / 4;
    const w = 56 - t * 30, hgt = 560 - t * 250, top = 700 + t * 120;
    for (const side of [0, 1]){
      const x = side ? 1080 - (110 + t * 330) - w : 110 + t * 330;
      h += `<div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;height:${hgt}px;
             background:linear-gradient(90deg,#44506a,#2a3448);opacity:${1 - t*0.34};"></div>`;
      // shelves: full bays get stock blocks, stripped ones get bare rails
      for (let s = 0; s < 4; s++){
        const sy = top + 60 + s * (hgt / 4.4);
        h += `<div style="position:absolute;left:${x - 52 + t*26}px;top:${sy}px;
               width:${150 - t*72}px;height:${9 - t*3}px;background:#3c4a66;
               opacity:${0.75 - t*0.3};"></div>`;
        if (!empty && s % 2 === 0){
          h += `<div style="position:absolute;left:${x - 44 + t*26}px;top:${sy - 26 + t*10}px;
                 width:${128 - t*62}px;height:${26 - t*10}px;background:#4a3a24;
                 opacity:${0.6 - t*0.25};"></div>`;
        }
      }
    }
  }
  return h;
}

mk("recap", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <div style="position:absolute;inset:0;opacity:.35;">${bays(true)}</div>
  <div class="stamp" style="top:800px;border-color:var(--amber);color:var(--amber);">YOU WAITED</div>
  <div class="vign"></div>`);

mk("station", `<div style="position:absolute;inset:0;background:#080c14;"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:700px;
       background:linear-gradient(180deg,#161d29,#0d1219);"></div>
  <div style="position:absolute;left:0;right:0;top:1380px;bottom:0;
       background:linear-gradient(180deg,#141a24,#090d14);"></div>
  <div id="bayart" style="position:absolute;inset:0;">${bays(true)}</div>
  <div style="position:absolute;left:440px;top:980px;width:200px;height:300px;
       background:#0e1522;"></div>
  <div class="vign"></div>`);

mk("plumb", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- a water heater: the thing nobody takes -->
  <div style="position:absolute;left:340px;top:420px;width:400px;height:700px;border-radius:200px;
       background:linear-gradient(180deg,#2c3448,#1a2230);border:5px solid #3a4967;"></div>
  <div style="position:absolute;left:470px;top:1120px;width:140px;height:150px;
       background:#2a3448;"></div>
  <div style="position:absolute;left:300px;top:1250px;width:480px;height:26px;border-radius:7px;
       background:#3a4967;"></div>
  <div id="drip" style="position:absolute;left:528px;top:1290px;width:24px;height:24px;
       border-radius:50%;background:#6fa8e0;box-shadow:0 0 26px rgba(110,170,230,.6);"></div>
  <div style="position:absolute;left:0;right:0;top:1340px;text-align:center;">
    <span class="badge">40 LITRES</span></div>
  <div class="vign"></div>`);

mk("radio", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div id="radiobox" style="position:absolute;left:250px;top:760px;width:580px;height:290px;
       border-radius:16px;background:linear-gradient(180deg,#222d41,#161e2e);border:4px solid #33425e;
       box-shadow:0 26px 70px rgba(0,0,0,.6);">
    <div style="position:absolute;left:32px;top:30px;width:350px;height:108px;border-radius:8px;
         background:#0b2a21;border:3px solid #1d5742;display:flex;align-items:center;justify-content:center;">
      <span style="color:#5df2b0;font-size:56px;font-weight:800;letter-spacing:5px;
            text-shadow:0 0 26px rgba(93,242,176,.8);">CH 09</span></div>
    <div style="position:absolute;right:34px;top:42px;width:86px;height:86px;border-radius:50%;
         background:#2b374f;border:4px solid #44557a;"></div>
    <div style="position:absolute;right:-26px;top:150px;width:26px;height:74px;border-radius:5px;
         background:#44557a;"></div>
    <div style="position:absolute;left:32px;bottom:28px;right:32px;height:56px;display:flex;gap:11px;">
      ${Array.from({length:10},()=>`<div style="flex:1;border-radius:5px;background:#2b374f;"></div>`).join("")}
    </div></div>
  <div class="vign"></div>`);

mk("rule1", rule(1, "FILL FROM THE<br>LOWEST TAP", "gravity does the work"));
mk("rule2", rule(2, "NEVER LET A DOOR<br>CLOSE BEHIND YOU", ""));
mk("rule3", rule(3, "IF THE LIGHTS<br>COME ON, LEAVE", ""));

mk("good", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div class="news"><h4>GOOD NEWS</h4>
    <div class="row"><span>Water carried out</span><span>31 LITRES</span></div>
    <div class="row"><span>Paper road map</span><span>YES</span></div>
    <div class="row"><span>Phone</span><span>DEAD 36 HRS</span></div></div>
  <div class="vign"></div>`);

mk("bad", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <!-- the floor plan: one door, and you at the far end of it -->
  <div style="position:absolute;left:170px;top:520px;width:740px;height:860px;border:5px solid #3a4967;
       border-radius:10px;background:#0d131d;"></div>
  <div style="position:absolute;left:170px;top:900px;width:5px;height:100px;background:#070c16;"></div>
  <div style="position:absolute;left:112px;top:915px;width:70px;height:70px;border-radius:50%;
       border:4px solid var(--amber);"></div>
  <div id="youdot" style="position:absolute;left:830px;top:915px;width:46px;height:46px;
       border-radius:50%;background:var(--red);box-shadow:0 0 40px rgba(255,66,66,.7);"></div>
  <div style="position:absolute;left:0;right:0;top:1270px;text-align:center;">
    <span class="badge red">ONE EXIT</span></div>
  <div class="vign"></div>`);

mk("lights", `<div style="position:absolute;inset:0;background:#080c14;"></div>
  <div id="flood" style="position:absolute;inset:0;background:
       radial-gradient(70% 45% at 50% 34%,rgba(255,246,214,.55),rgba(0,0,0,0) 72%);opacity:0;"></div>
  <div style="position:absolute;inset:0;">${bays(true)}</div>
  <div style="position:absolute;left:0;right:0;top:230px;display:flex;justify-content:center;gap:40px;">
    ${Array.from({length:4},()=>`<div class="lamp" style="width:150px;height:22px;border-radius:11px;
      background:#fff6d6;opacity:.14;"></div>`).join("")}
  </div>
  <div class="vign"></div>`);

mk("pa", `<div style="position:absolute;inset:0;background:#06090f;"></div>
  <!-- a ceiling speaker, lit from inside. The voice has a body and this is it;
       a bare dark ring read as nothing, so it needs a grille and a bracket. -->
  <div style="position:absolute;left:510px;top:300px;width:60px;height:150px;
       background:linear-gradient(180deg,#39465e,#232c3c);"></div>
  <div style="position:absolute;left:452px;top:430px;width:176px;height:34px;border-radius:8px;
       background:#39465e;"></div>
  <div style="position:absolute;left:330px;top:470px;width:420px;height:420px;border-radius:50%;
       background:linear-gradient(160deg,#38435a,#1b2230);border:7px solid #46557a;
       box-shadow:0 30px 80px rgba(0,0,0,.7);"></div>
  <div style="position:absolute;left:386px;top:526px;width:308px;height:308px;border-radius:50%;
       background:radial-gradient(circle at 42% 36%,#2b3448,#0b1018 72%);
       border:5px solid #55668c;overflow:hidden;">
    ${Array.from({length:7},(_,r)=>
      `<div style="position:absolute;left:0;right:0;top:${18+r*40}px;height:13px;
        background:#0a0e16;opacity:.75;border-radius:7px;"></div>`).join("")}
  </div>
  <div id="cone" style="position:absolute;left:386px;top:526px;width:308px;height:308px;
       border-radius:50%;background:radial-gradient(circle,rgba(240,169,60,.42),rgba(0,0,0,0) 68%);
       opacity:0;"></div>
  <div id="wave1" style="position:absolute;left:330px;top:470px;width:420px;height:420px;
       border-radius:50%;border:5px solid rgba(240,169,60,.85);opacity:0;"></div>
  <div id="wave2" style="position:absolute;left:330px;top:470px;width:420px;height:420px;
       border-radius:50%;border:5px solid rgba(240,169,60,.85);opacity:0;"></div>
  <div style="position:absolute;left:0;right:0;top:1000px;text-align:center;">
    <span class="badge">PA — LIVE</span></div>
  <div class="vign"></div>`);

mk("grid", `<div style="position:absolute;inset:0;background:#070c16;"></div>
  <div class="news bad"><h4>GRID STATUS</h4>
    <div class="row"><span>Mains power</span><span>FAILED DAY 1</span></div>
    <div class="row"><span>Backup generator</span><span>NONE</span></div>
    <div class="row"><span>Lights</span><span>ON</span></div></div>
  <div class="vign"></div>`);

mk("lights2", `<div style="position:absolute;inset:0;background:#0d1016;"></div>
  <div style="position:absolute;inset:0;background:
       radial-gradient(70% 45% at 50% 34%,rgba(255,246,214,.6),rgba(0,0,0,0) 72%);"></div>
  <div style="position:absolute;inset:0;">${bays(true)}</div>
  <div style="position:absolute;left:0;right:0;top:230px;display:flex;justify-content:center;gap:40px;">
    ${Array.from({length:4},()=>`<div style="width:150px;height:22px;border-radius:11px;
      background:#fff6d6;opacity:.85;box-shadow:0 0 70px 26px rgba(255,240,200,.35);"></div>`).join("")}
  </div>
  <div class="vign"></div>`);
