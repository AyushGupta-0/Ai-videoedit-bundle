#!/bin/bash
# Safe launcher for local SDXL on a 16GB Mac.
#
# Background: running SDXL resident at 832x1216 wedged this machine hard enough
# to need a power cycle. Each guard below maps to a way this actually failed.
#
# On measuring pressure: do NOT gate on `sysctl vm.swapusage`. macOS leaves
# stale compressed pages in swap long after the processes that owned them died,
# so "6.8GB used" routinely coexists with 75% of memory genuinely free. Gating
# on that number blocks runs that would have finished fine. The real signals are
# `memory_pressure`'s free percentage and the *rate* of swapins.
#
#   ./run_sdxl.sh <out_dir> [extra args for gen_kids_art.py]
#
set -u
cd "$(dirname "$0")/../.."

OUT="${1:?usage: run_sdxl.sh <out_dir> [args...]}"; shift || true

free_pct() { memory_pressure 2>/dev/null | awk '/free percentage/{gsub("%","",$NF); print $NF+0}'; }
swapins()  { vm_stat | awk '/Swapins/{gsub("\\.","",$NF); print $NF+0}'; }

# --- guard 1: refuse to start on a genuinely starved machine ----------------
FREE=$(free_pct)
if [ "${FREE:-0}" -lt 35 ]; then
  echo "only ${FREE}% of memory is free. SDXL needs roughly 5GB and will not fit."
  echo "Close some apps, or reboot to release compressed memory, then retry."
  exit 1
fi

# --- guard 2: cap torch so it raises OOM instead of swapping the machine ----
export HF_HOME="$PWD/.hf-cache"
export PYTORCH_MPS_LOW_WATERMARK_RATIO=0.70
export PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.85
export PYTORCH_ENABLE_MPS_FALLBACK=1
export TOKENIZERS_PARALLELISM=false

# --- guard 3: watchdog on thrash rate, not on swap size ---------------------
( PREV=$(swapins)
  while sleep 5; do
    pgrep -f gen_kids_art.py >/dev/null || break
    NOW=$(swapins); RATE=$((NOW - PREV)); PREV=$NOW
    F=$(free_pct)
    if [ "$RATE" -gt 20000 ] || [ "${F:-100}" -lt 10 ]; then
      echo "" >&2
      echo "WATCHDOG: ${RATE} swapins/5s, ${F}% free — stopping before the machine locks up." >&2
      echo "Plates already written are kept. Retry with smaller --width/--height." >&2
      pkill -f gen_kids_art.py
      break
    fi
  done ) &
WD=$!
trap 'kill $WD 2>/dev/null' EXIT

echo "${FREE}% memory free · watchdog armed · plates -> $OUT"
~/Developer/tools-venv/sdxl/bin/python Tools/publish/gen_kids_art.py \
  --shots "${SHOTS:-Tools/publish/shots_kids_chintu.json}" --out "$OUT" "$@"
