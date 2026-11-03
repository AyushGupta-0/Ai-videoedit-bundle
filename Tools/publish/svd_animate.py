#!/usr/bin/env python3
"""Animate still plates into short clips with Stable Video Diffusion.

!! DOES NOT RUN ON THIS MACHINE. Kept for a 32GB+ host. !!
SVD's weights are ~9.5GB. On this 16GB Mac: model_cpu_offload hits a clean MPS
OOM at the 10GB cap, and sequential_cpu_offload thrashes CPU RAM instead
(21k swapins/sec, watchdog kill) — during model *loading*, before a single
frame. Dropping resolution does not help; the weights are the problem, not
the activations.

SVD is image-to-video: it takes one of our SD1.5 plates and produces ~2s of real
motion from it. That keeps the character identical to the plate — the thing that
made every text-to-image attempt at a *scene* fail — while adding the motion that
a Ken Burns pan only imitates.

What it will not do is invent new content. It animates what is in the frame; it
cannot add a second character or a new action.

    python3 svd_animate.py <plates_dir> <out_dir> [--only w10 w01]
"""
import argparse, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# SVD is trained at 1024x576; the portrait transpose is the supported tall size.
W, H = 576, 1024


def guard(frames, w=W, h=H):
    import subprocess
    gb = int(subprocess.run(["sysctl", "-n", "hw.memsize"],
                            capture_output=True, text=True).stdout) / 2**30
    need = 6.5 + frames * 0.12 * (w * h) / (W * H)
    if need > gb - 2.0:
        sys.exit(f"{frames} frames needs ~{need:.1f}GB, machine has {gb:.0f}GB")
    print(f"{gb:.0f}GB RAM · {w}x{h} · {frames} frames · needs ~{need:.1f}GB · ok", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plates"); ap.add_argument("out")
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--frames", type=int, default=14)
    ap.add_argument("--fps", type=int, default=7)
    ap.add_argument("--motion", type=int, default=127, help="motion_bucket_id: higher = more")
    ap.add_argument("--model", default="stabilityai/stable-video-diffusion-img2vid")
    ap.add_argument("--offload", choices=["sequential", "model"], default="sequential")
    ap.add_argument("--width", type=int, default=W)
    ap.add_argument("--height", type=int, default=H)
    a = ap.parse_args()

    plates = sorted(p for p in Path(a.plates).glob("*.png") if not p.name.startswith("."))
    if a.only:
        plates = [p for p in plates if p.stem in a.only]
    if not plates:
        sys.exit("no plates matched")

    guard(a.frames, a.width, a.height)
    import torch
    from diffusers import StableVideoDiffusionPipeline
    from diffusers.utils import export_to_video
    from PIL import Image

    pipe = StableVideoDiffusionPipeline.from_pretrained(
        a.model, torch_dtype=torch.float16, variant="fp16")
    pipe.set_progress_bar_config(disable=True)
    # SVD's AutoencoderKLTemporalDecoder has no slicing/tiling — decode_chunk_size=1
    # below is the equivalent knob, and the decode is where the memory spike lives.
    # model_cpu_offload still OOMs here: SVD's UNet alone peaks past the 10GB MPS
    # cap at 576x1024/14 frames. sequential offload moves weights a *submodule* at
    # a time instead of a model at a time — far slower, but it fits.
    if a.offload == "sequential":
        pipe.enable_sequential_cpu_offload(device="mps")
    else:
        pipe.enable_model_cpu_offload(device="mps")  # never .to(mps): see CLAUDE.md

    outdir = Path(a.out); outdir.mkdir(parents=True, exist_ok=True)
    for p in plates:
        img = Image.open(p).convert("RGB").resize((a.width, a.height), Image.LANCZOS)
        g = torch.Generator(device="cpu").manual_seed(7)
        frames = pipe(img, decode_chunk_size=1,          # the decode is the memory spike
                      num_frames=a.frames, motion_bucket_id=a.motion,
                      noise_aug_strength=0.02, generator=g).frames[0]
        dst = outdir / f"{p.stem}.mp4"
        export_to_video(frames, str(dst), fps=a.fps)
        print(f"  {p.stem} -> {dst.name}", flush=True)
        del frames
        torch.mps.empty_cache()


if __name__ == "__main__":
    main()
