#!/bin/bash
# Normalise, cover and package one Ten Days episode.
#   pack_ep.sh <ep#> <slug> <date> <coverSeconds> <line1> <line2> <kicker>
set -eu
cd "$(dirname "$0")/../.."
EP=$1; SLUG=$2; DATE=$3; CT=$4; L1=$5; L2=$6; KICK=$7
D="Tools/tendays-ep$(printf %02d "$EP")"
M=$(ls -t "$D"/renders/*.mp4 | head -1)
OUT="Raw footage /tendays-ep$(printf %02d "$EP")-${SLUG}.mp4"
ffmpeg -y -v error -i "$M" -c:v copy -af "loudnorm=I=-14:TP=-1.2:LRA=11" -c:a aac -b:a 192k "$OUT"
mkdir -p "$D/assets/cover"
ffmpeg -y -v error -ss "$CT" -i "$M" -frames:v 1 "$D/assets/cover/key.png"
~/Developer/tools-venv/manim/bin/python Tools/publish/make_covers.py --plate key \
  --plates-dir "$D/assets/cover" --line1 "$L1" --line2 "$L2" --kicker "$KICK" \
  --out "Exports/covers/ten-days-day-$EP" >/dev/null
~/Developer/tools-venv/manim/bin/python Tools/publish/make_package.py \
  "$OUT" "Tools/publish/meta_tendays_ep$(printf %02d "$EP").json" \
  --date "$DATE" --channel "Story 1" \
  --cover "Exports/covers/ten-days-day-$EP/reel_cover_1080x1920.png" | head -1
