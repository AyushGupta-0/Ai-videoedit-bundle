#!/bin/bash
# Build episodes end to end: plates -> VO -> mix -> composition -> render -> package.
#
# Plate generation gets killed by the memory watchdog when the machine is busy,
# so this waits for headroom before each episode and retries the missing plates.
# gen_kids_art.py saves per shot, so a retry only redoes what is absent.
#
#   ./run_series.sh ep04 "Six O'Clock" 2026-11-06 [ep05 "The Market" 2026-11-07 ...]
set -uo pipefail
cd "$(dirname "$0")/../.."
PY=~/Developer/tools-venv/manim/bin/python
KO=~/Developer/tools-venv/kokoro/bin/python

free_pct(){ memory_pressure 2>/dev/null | awk '/free percentage/{gsub("%","",$NF);print $NF+0}'; }
wait_mem(){ for _ in $(seq 1 40); do [ "$(free_pct)" -ge 55 ] && return 0; sleep 20; done; }

while [ $# -ge 3 ]; do
  ID="$1"; TITLE="$2"; DATE="$3"; shift 3
  D="Tools/kids-$ID"; S="Tools/publish/shots_$ID.json"; M="Tools/publish/meta_$ID.json"
  mkdir -p "$D/assets/shots" "$D/assets/audio"
  echo "=============== $ID  $TITLE ==============="

  for attempt in 1 2 3 4; do
    MISSING=$($PY - "$S" "$D/assets/shots" <<'PX'
import json,sys,pathlib
ids=[s["id"] for s in json.load(open(sys.argv[1]))["shots"]]
d=pathlib.Path(sys.argv[2])
print(" ".join(i for i in ids if not (d/f"{i}.png").exists()))
PX
)
    [ -z "$MISSING" ] && break
    echo "--- plates attempt $attempt: $MISSING"
    wait_mem
    SHOTS="$S" ./Tools/publish/run_sdxl.sh "$D/assets/shots" --only $MISSING >"/tmp/$ID.log" 2>&1
  done

  if [ -n "$MISSING" ]; then echo "!! $ID still missing: $MISSING — skipping"; continue; fi

  export HF_HOME="$PWD/.hf-cache"
  $KO Tools/publish/build_kids_vo.py "Tools/publish/lines_$ID.json" "$D/assets/audio/vo.wav" \
    2>&1 | grep -E "wav |scripted" || true
  ./Tools/publish/finish_episode.sh "$D" "$S" "$M" "$ID" "$TITLE" "$DATE" 2>&1 \
    | grep -E "Check |rendered in|packaged|Exports/" || true
done
