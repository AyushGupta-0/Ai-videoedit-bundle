#!/bin/bash
# Mix, check, render and package one episode. Everything after the plates.
#   ./finish_episode.sh <ep_dir> <shots.json> <meta.json> <id> "<Title>" <date>
set -euo pipefail
cd "$(dirname "$0")/../.."
D="$1"; SHOTS="$2"; META="$3"; ID="$4"; TITLE="$5"; DATE="$6"
PY=~/Developer/tools-venv/manim/bin/python
KO=~/Developer/tools-venv/kokoro/bin/python

DUR=$($PY -c "import json;print(round(json.load(open('$D/assets/audio/vo_timings.json'))['duration']+0.4,2))")
$KO Tools/publish/make_bed.py "$DUR" "$D/assets/audio/bed.wav"
( cd "$D/assets/audio" && ffmpeg -y -v error -i vo.wav -i bed.wav -filter_complex "
  [0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=2[vo][k];
  [1:a]lowpass=f=2400,equalizer=f=2000:t=q:w=1.4:g=-6,volume=0.34[bedf];
  [bedf][k]sidechaincompress=threshold=0.030:ratio=9:attack=6:release=320[duck];
  [vo][duck]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,
  loudnorm=I=-12:TP=-1.2:LRA=11[out]" -map "[out]" -ar 44100 mix.wav )

$PY Tools/publish/build_episode.py "$D" "$SHOTS" --id "$ID" --title "$TITLE"
( cd "$D" && npx hyperframes check 2>&1 | grep -E "Check (passed|failed)" )
( cd "$D" && npx hyperframes render 2>&1 | grep -E "renders/.*mp4|rendered in" )

M=$(ls -t "$D"/renders/*.mp4 | grep -v '\._' | head -1)
SLUG=$($PY -c "import json;print(json.load(open('$META'))['slug'])")
cp "$M" "Raw footage /kids-$SLUG.mp4"
PLATE=$($PY -c "import json;print(json.load(open('$SHOTS'))['shots'][-1]['id'])")
$PY Tools/publish/make_covers.py --plate "$PLATE" --plates-dir "$D/assets/shots" \
  --line1 "$(echo "$TITLE" | tr '[:lower:]' '[:upper:]')" \
  --kicker "$(printf 'day %s of 10' "${ID#ep}" | sed 's/^day 0/day /')" \
  --out "Exports/covers/$SLUG" >/dev/null
$PY Tools/publish/make_package.py "Raw footage /kids-$SLUG.mp4" "$META" \
  --date "$DATE" --channel Kids --cover "Exports/covers/$SLUG/reel_cover_1080x1920.png"
