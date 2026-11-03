#!/usr/bin/env bash
# One-shot setup for the AI Video Edit Bundle, on a fresh macOS machine.
#
#   ./setup.sh            install everything
#   ./setup.sh --check    verify an existing install, change nothing
#
# Safe to re-run: every step checks before it installs.
set -uo pipefail
CHECK_ONLY=false
[[ "${1:-}" == "--check" ]] && CHECK_ONLY=true

VENVS="$HOME/Developer/tools-venv"
WHISPER="$HOME/Developer/whisper.cpp"
ok(){ printf "  \033[32m✓\033[0m %s\n" "$1"; }
no(){ printf "  \033[31m✗\033[0m %s\n" "$1"; }
step(){ printf "\n\033[1m%s\033[0m\n" "$1"; }
have(){ command -v "$1" >/dev/null 2>&1; }

MISSING=0
need(){ if have "$1"; then ok "$1"; else no "$1 — $2"; MISSING=1; fi; }

step "1. System tools"
if ! have brew; then
  no "Homebrew — install from https://brew.sh, then re-run this script"
  exit 1
fi
ok "homebrew"
for pkg in ffmpeg node git cmake; do
  if have "${pkg}"; then ok "$pkg"
  elif $CHECK_ONLY; then no "$pkg"; MISSING=1
  else echo "  installing $pkg…"; brew install -q "$pkg" && ok "$pkg"; fi
done
# python@3.12 specifically: 3.13+ breaks pyexpat for some wheels, and 3.15's
# broke yt-dlp outright on this machine
if [[ -x /opt/homebrew/bin/python3.12 ]] || have python3.12; then ok "python 3.12"
elif $CHECK_ONLY; then no "python 3.12"; MISSING=1
else echo "  installing python@3.12…"; brew install -q python@3.12 && ok "python 3.12"; fi

step "2. whisper.cpp (caption alignment)"
if [[ -x "$WHISPER/build/bin/whisper-cli" ]]; then ok "whisper-cli built"
elif $CHECK_ONLY; then no "whisper-cli"; MISSING=1
else
  mkdir -p "$HOME/Developer"
  [[ -d "$WHISPER" ]] || git clone -q https://github.com/ggerganov/whisper.cpp "$WHISPER"
  ( cd "$WHISPER" && cmake -B build -DCMAKE_BUILD_TYPE=Release >/dev/null \
    && cmake --build build -j --config Release >/dev/null ) && ok "whisper-cli built"
fi
for m in ggml-base.en.bin ggml-base.bin; do
  if [[ -f "$WHISPER/models/$m" ]]; then ok "model $m"
  elif $CHECK_ONLY; then no "model $m"; MISSING=1
  else ( cd "$WHISPER" && bash ./models/download-ggml-model.sh "${m#ggml-}" >/dev/null 2>&1 ) \
       && ok "model $m" || no "model $m — download failed"; fi
done

step "3. Python environments"
PY312=$(command -v python3.12 || echo /opt/homebrew/bin/python3.12)
mkvenv(){ # name, packages...
  local name=$1; shift
  if [[ -x "$VENVS/$name/bin/python" ]]; then ok "venv $name"
  elif $CHECK_ONLY; then no "venv $name"; MISSING=1
  else
    echo "  creating venv $name… (this one takes a while)"
    "$PY312" -m venv "$VENVS/$name" \
      && "$VENVS/$name/bin/pip" install -q --upgrade pip \
      && "$VENVS/$name/bin/pip" install -q "$@" && ok "venv $name"
  fi
}
mkdir -p "$VENVS"
mkvenv kokoro kokoro soundfile numpy librosa          # TTS + pitch shifting
mkvenv manim  manim pillow                            # diagrams + cover generation
mkvenv ytdlp  yt-dlp                                  # reference reel downloads
mkvenv sdxl   torch torchvision diffusers transformers accelerate safetensors peft

# brew's yt-dlp has been broken by python 3.15's pyexpat; point at the venv one
if [[ -x "$VENVS/ytdlp/bin/yt-dlp" ]] && ! $CHECK_ONLY; then
  ln -sf "$VENVS/ytdlp/bin/yt-dlp" /opt/homebrew/bin/yt-dlp 2>/dev/null \
    && ok "yt-dlp symlinked over the brew build" || true
fi

step "4. Node packages"
if [[ -d Tools/dashboard/node_modules ]]; then ok "dashboard deps"
elif $CHECK_ONLY; then no "dashboard deps"; MISSING=1
else ( cd Tools/dashboard && npm install --silent ) && ok "dashboard deps"; fi
if have npx; then ok "npx (HyperFrames runs via npx, nothing to install)"; fi

step "5. Claude Code"
need claude "install from https://claude.com/claude-code"

step "6. Model cache location"
# multi-GB downloads belong on the external disk, not the boot volume
if [[ -L "$HOME/.cache/huggingface" ]]; then ok "HF cache redirected to this repo"
elif $CHECK_ONLY; then no "HF cache still on the internal disk"
else
  mkdir -p "$PWD/.hf-cache-home"
  [[ -d "$HOME/.cache/huggingface" && ! -L "$HOME/.cache/huggingface" ]] && \
    rsync -a --remove-source-files "$HOME/.cache/huggingface/" "$PWD/.hf-cache-home/" 2>/dev/null
  rm -rf "$HOME/.cache/huggingface"
  mkdir -p "$HOME/.cache" && ln -s "$PWD/.hf-cache-home" "$HOME/.cache/huggingface" \
    && ok "HF cache redirected to this repo"
fi

step "Result"
if [[ $MISSING -eq 0 ]]; then
  echo "  Everything is in place."
  echo "  Next:  node Tools/dashboard/server.js   →  http://localhost:4321"
else
  echo "  Some pieces are missing — see the ✗ lines above."
  $CHECK_ONLY && echo "  Run ./setup.sh (without --check) to install them."
fi
