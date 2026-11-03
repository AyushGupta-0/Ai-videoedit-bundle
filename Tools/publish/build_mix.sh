#!/usr/bin/env bash
# Build the final audio mix for one video.
#   build_mix.sh <vo.wav> <sfx_dir> <out.wav> [duration]
#
# Voice intelligibility is the priority. Two things protect it:
#   1. sidechain ducking  — bed and SFX drop whenever the voice is present
#
# NOTE on the sidechain KEY: Kokoro's raw VO sits around -25 dB mean, which is
# well under these thresholds, so the compressor barely engaged — measured at
# about 1.7 LU of bed reduction where the intent was 6-7. The key is a control
# signal nobody hears, so it costs nothing to normalise it to -16 LUFS first;
# that is what makes the threshold mean what it says. The separation you heard
# before this came from static levels and spectral carving, not from ducking.
#
# NOTE on alimiter: its `level` option defaults to TRUE, which auto-levels the
# output up toward the limit — measured here, a -19.5 dB input came out at
# -18.5 dB, i.e. the "limiter" made it louder. That is the opposite of a safety
# limiter, so both calls below pass level=false. The final loudnorm was already
# enforcing the true-peak ceiling, so this was not audibly broken; it was just
# the wrong tool doing the wrong thing before the right one cleaned up.
#   2. spectral carving   — the bed is kept BELOW the voice band and both the bed
#                           and the SFX bus have a dip at 1.6-4 kHz, which is
#                           where consonants live. Ducking alone is not enough;
#                           without the carve, loud effects still smear speech.
set -euo pipefail

VO="$1"; SFX_DIR="$2"; OUT="$3"
D="${4:-$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VO")}"
TMP="$(dirname "$OUT")"

# ---------- 1. ambient bed: layered drone that swells into the climax ----------
ffmpeg -y -v error \
 -f lavfi -i "sine=frequency=55:duration=${D}:sample_rate=48000" \
 -f lavfi -i "sine=frequency=82.41:duration=${D}:sample_rate=48000" \
 -f lavfi -i "sine=frequency=110:duration=${D}:sample_rate=48000" \
 -f lavfi -i "sine=frequency=164.81:duration=${D}:sample_rate=48000" \
 -f lavfi -i "sine=frequency=220:duration=${D}:sample_rate=48000" \
 -f lavfi -i "anoisesrc=duration=${D}:color=brown:sample_rate=48000:amplitude=0.6" \
 -f lavfi -i "anoisesrc=duration=${D}:color=white:sample_rate=48000:amplitude=0.6" \
 -filter_complex "\
[0:a]volume=0.38,tremolo=f=0.18:d=0.35[d1];\
[1:a]volume=0.15[d2];\
[2:a]volume=0.14,tremolo=f=0.11:d=0.4[d3];\
[3:a]volume='0.03+0.08*min(1,max(0,(t-16)/12))':eval=frame[d4];\
[4:a]volume='0.02+0.05*min(1,max(0,(t-24)/8))*max(0,1-max(0,(t-44)/10))':eval=frame,tremolo=f=0.5:d=0.6[d5];\
[5:a]lowpass=f=300,volume=0.32[rum];\
[6:a]highpass=f=6200,lowpass=f=11000,volume=0.022[air];\
[d1][d2][d3][d4][d5][rum][air]amix=inputs=7:normalize=0[mx];\
[mx]volume='0.50+0.50*min(1,max(0,(t-16)/13))-0.42*min(1,max(0,(t-41)/13))':eval=frame,\
highpass=f=28,lowpass=f=2400,\
equalizer=f=2000:t=q:w=1.4:g=-6,\
aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[out]" \
 -map "[out]" -t "${D}" "$TMP/_bed.wav"

# ---------- 2. SFX layer ----------
have() { [ -f "$SFX_DIR/$1" ]; }
n() { ffmpeg -y -v error -i "$SFX_DIR/$1" -ar 48000 -ac 2 "$TMP/_s_$2.wav" 2>/dev/null || true; }
for f in whoosh riser impact sub_drop shimmer swoosh2 heartbeat clock static drone_dark; do
  src=$(ls "$SFX_DIR/$f".* 2>/dev/null | grep -v '_n\.wav$' | head -1 || true)
  [ -n "$src" ] && ffmpeg -y -v error -i "$src" -ar 48000 -ac 2 "$TMP/_s_$f.wav" || true
done

build_sfx() {
  local args=( -f lavfi -i "anullsrc=r=48000:cl=stereo:d=${D}" )
  local fc="" labels="[0:a]" idx=1
  add() { # file  time_ms  gain
    [ -f "$TMP/_s_$1.wav" ] || return 0
    args+=( -i "$TMP/_s_$1.wav" )
    fc+="[${idx}:a]volume=$3,adelay=$2|$2[x${idx}];"
    labels+="[x${idx}]"
    idx=$((idx+1))
  }
  # transitions
  add whoosh   5300  0.26
  add swoosh2  9600  0.24
  add whoosh  13200  0.26
  add swoosh2 17400  0.24
  add whoosh  21200  0.24
  add swoosh2 31900  0.26
  add whoosh  36200  0.24
  add swoosh2 44700  0.24
  # tension + reveals  (kept modest so speech stays on top)
  add riser   21600  0.20
  add impact  24300  0.26
  add shimmer 28600  0.20
  add clock   36300  0.16
  add impact  38400  0.22
  add shimmer 42000  0.20
  add static  28700  0.07
  add sub_drop 50400 0.30
  fc+="${labels}amix=inputs=${idx}:normalize=0:duration=first[m];"
  # carve the consonant band out of the whole effects bus
  fc+="[m]equalizer=f=2600:t=q:w=1.6:g=-5,equalizer=f=1600:t=q:w=1.8:g=-3,alimiter=limit=0.7:level=false[out]"
  ffmpeg -y -v error "${args[@]}" -filter_complex "$fc" -map "[out]" -t "${D}" "$TMP/_sfx.wav"
}
build_sfx

# ---------- 3. mix: voice forward, everything else ducked and carved ----------
ffmpeg -y -v error -i "$VO" -i "$TMP/_bed.wav" -i "$TMP/_sfx.wav" -filter_complex "\
[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,\
highpass=f=85,\
equalizer=f=250:t=q:w=1.2:g=-2,\
equalizer=f=3200:t=q:w=1.1:g=3.5,\
equalizer=f=7500:t=q:w=2.0:g=-2,\
acompressor=threshold=0.05:ratio=3.4:attack=8:release=180:makeup=2.2[vo];\
[vo]asplit=3[vo_out][sc_raw1][sc_raw2];\
[sc_raw1]loudnorm=I=-16:LRA=7:TP=-1[sc1];\
[sc_raw2]loudnorm=I=-16:LRA=7:TP=-1[sc2];\
[1:a]volume=0.46[bed];\
[2:a]volume=0.62[sfx];\
[bed][sc1]sidechaincompress=threshold=0.022:ratio=9:attack=8:release=240:makeup=1[bed_d];\
[sfx][sc2]sidechaincompress=threshold=0.030:ratio=5:attack=6:release=190:makeup=1[sfx_d];\
[vo_out][bed_d][sfx_d]amix=inputs=3:normalize=0:duration=first[mixed];\
[mixed]alimiter=limit=0.95:level=false,loudnorm=I=-14:TP=-1.2:LRA=11,\
aformat=sample_fmts=s16:sample_rates=48000:channel_layouts=stereo[out]" \
 -map "[out]" -t "${D}" "$OUT"

rm -f "$TMP"/_bed.wav "$TMP"/_sfx.wav "$TMP"/_s_*.wav
echo "mix → $OUT  ($(printf '%.1f' "$D")s)"
