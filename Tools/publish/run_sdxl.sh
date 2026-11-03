#!/bin/bash
# Safe launcher for local SDXL on a 16GB Mac.
#
# Background: running SDXL resident at 832x1216 wedged this machine hard enough
# to need a power cycle. Nothing here is optional ceremony — each guard maps to
# a way that actually failed.
#
#   ./run_sdxl.sh <out_dir> [extra args for gen_kids_art.py]
#
set -u
cd "$(dirname "$0")/../.."

OUT="${1:?usage: run_sdxl.sh <out_dir> [args...]}"; shift || true

# --- guard 1: refuse to start on a machine that is already swapping ----------
SWAP=$(sysctl -n vm.swapusage | awk '{gsub("M","",$6); print int($6)}')
if [ "$SWAP" -gt 2000 ]; then
  echo "swap is already ${SWAP}MB. SDXL will not fit on top of that."
  echo "Reboot to clear it, then run this again. (A reboot is the only thing"
  echo "that reliably releases macOS compressed memory.)"
  exit 1
fi

# --- guard 2: cap torch so it raises OOM instead of swapping the machine -----
export HF_HOME="$PWD/.hf-cache"
export PYTORCH_MPS_LOW_WATERMARK_RATIO=0.70
export PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.85
export PYTORCH_ENABLE_MPS_FALLBACK=1
export TOKENIZERS_PARALLELISM=false

# --- guard 3: watchdog — kill the run before the Mac becomes unusable --------
BASE=$SWAP
( while sleep 5; do
    pgrep -f gen_kids_art.py >/dev/null || break
    S=$(sysctl -n vm.swapusage | awk '{gsub("M","",$6); print int($6)}')
    if [ $((S - BASE)) -gt 2500 ]; then
      echo "" >&2
      echo "WATCHDOG: swap grew $((S-BASE))MB — stopping before the machine locks up." >&2
      echo "Plates already written are kept. Lower --width/--height and retry." >&2
      pkill -f gen_kids_art.py
      break
    fi
  done ) &
WD=$!
trap 'kill $WD 2>/dev/null' EXIT

echo "swap ${SWAP}MB at start · watchdog armed · plates -> $OUT"
~/Developer/tools-venv/sdxl/bin/python Tools/publish/gen_kids_art.py \
  --shots Tools/publish/shots_kids_chintu.json --out "$OUT" "$@"
