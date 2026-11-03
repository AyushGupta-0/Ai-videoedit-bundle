#!/usr/bin/env python3
"""Generate the character plates for a kids episode with SDXL, locally.

The whole problem with AI art for a *series* is consistency: a different-looking
elephant in every shot reads as a different elephant. Three things hold it
together here, and all three matter:

  1. A character bible that is pasted verbatim into every prompt that contains
     that character. Never paraphrased — paraphrase drifts the face.
  2. A fixed seed per character, so the model starts from the same noise.
  3. One style suffix shared by every shot, so lighting and finish match.

    python3 gen_kids_art.py --shots shots_kids_chintu.json --out <dir>
    python3 gen_kids_art.py --shots ... --only s01 s13     # re-roll two shots
"""

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Everything below is prompt text, reused verbatim. Edit with care: changing a
# word changes the face in every shot at once, which is the point.

BOY = "a cute little Indian boy, messy black hair, green striped t-shirt"
GIRL = "a cute little Indian girl, two small pigtails, yellow dress"
# kept for the parked elephant episode
CHINTU = "chubby baby elephant calf, grey skin, huge round eyes, red collar"
MIRA = "little Indian girl, black bob hair, yellow sun t-shirt, blue shorts"
STYLE = "Pixar 3D animation still, glossy, warm cinematic light, shallow depth of field"
NEGATIVE = ("text, watermark, extra limbs, deformed hands, duplicate, clone, twins, "
            "photo, scary, blurry, low quality, 2d, adult, old")

SEEDS = {"chintu": 770041, "mira": 881502, "both": 990213, "world": 220817,
         "boy": 414477, "girl": 626188}

CLIP_LIMIT = 77


def check_len(pipe, prompts):
    tok = pipe.tokenizer
    bad = []
    for pid, text in prompts:
        n = len(tok(text).input_ids)
        if n > CLIP_LIMIT:
            bad.append((pid, n))
    if bad:
        lines = "\n".join(f"   {pid}: {n} tokens ({n - CLIP_LIMIT} over)" for pid, n in bad)
        sys.exit(f"these prompts would be truncated by CLIP at {CLIP_LIMIT} tokens:\n{lines}\n"
                 f"shorten the shot text or the character bible.")




def pipeline(model, lora, arch):
    import torch
    from diffusers import (StableDiffusionPipeline, StableDiffusionXLPipeline,
                           EulerAncestralDiscreteScheduler)

    dev = "mps" if torch.backends.mps.is_available() else "cpu"
    dtype = torch.float16 if dev == "mps" else torch.float32
    # SDXL is ~7GB of weights and does not fit in this machine's 16GB even with
    # offload — it thrashed swap at 23k swapins/sec. SD1.5 is ~2GB and fits with
    # room to spare. Keep the SDXL branch for a bigger machine.
    if arch == "sdxl":
        pipe = StableDiffusionXLPipeline.from_pretrained(
            model, torch_dtype=dtype, variant="fp16", use_safetensors=True)
    else:
        pipe = StableDiffusionPipeline.from_pretrained(
            model, torch_dtype=dtype, safety_checker=None, requires_safety_checker=False)
    pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
    pipe.set_progress_bar_config(disable=True)
    # This machine has 16GB of unified memory and SDXL fp16 does not fit in it
    # alongside the OS. Resident-everything wedged the Mac hard enough to need a
    # power cycle, and even model *loading* pushed 3GB into swap.
    #
    # So: never pipe.to(device). enable_model_cpu_offload keeps the weights in
    # CPU memory and streams one submodule at a time onto the GPU, which caps
    # peak around 4-5GB. Slicing and tiling cut the VAE decode spike on top of
    # that. Slower per image, but it finishes instead of killing the machine.
    pipe.enable_attention_slicing()
    pipe.vae.enable_slicing()      # diffusers >=0.42 moved these onto the VAE
    pipe.vae.enable_tiling()
    if dev == "mps":
        pipe.enable_model_cpu_offload(device=dev)
    else:
        pipe = pipe.to(dev)
    if lora:
        pipe.load_lora_weights(lora)
    return pipe, dev


def guard_memory(w, h):
    """Refuse to start a run that will not fit. Freezing the machine is a much
    worse failure than printing a number and stopping."""
    import subprocess
    free = int(subprocess.run(["sysctl", "-n", "hw.memsize"],
                              capture_output=True, text=True).stdout) / 2**30
    px = (w * h) / (512 * 768)
    need = 3.0 * px                      # SD1.5 fp16 with offload + sliced/tiled VAE
    if need > free - 2.0:
        sys.exit(f"{w}x{h} needs about {need:.1f}GB and this machine has {free:.0f}GB. "
                 f"Use a smaller --width/--height.")
    print(f"{free:.0f}GB RAM · {w}x{h} needs about {need:.1f}GB · ok")


PLATE_W, PLATE_H = 1080, 1920


def to_plate(img):
    """SD1.5 renders at 512x768 (2:3). The composition needs 1080x1920 (9:16),
    and Ken Burns pushes into the plate, so upscale to *cover* and centre-crop
    rather than padding — a padded plate shows bars the moment the camera moves."""
    from PIL import Image
    s = max(PLATE_W / img.width, PLATE_H / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    l, t = (img.width - PLATE_W) // 2, (img.height - PLATE_H) // 2
    return img.crop((l, t, l + PLATE_W, t + PLATE_H))


def expand(shot):
    """Substitute the character bibles into the shot's prompt."""
    body = (shot["prompt"].replace("{CHINTU}", CHINTU).replace("{MIRA}", MIRA)
            .replace("{BOY}", BOY).replace("{GIRL}", GIRL))
    return f"{body}, {STYLE}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="stablediffusionapi/disney-pixar-cartoon")
    ap.add_argument("--arch", choices=["sd15", "sdxl"], default="sd15")
    ap.add_argument("--lora", default=None)
    ap.add_argument("--steps", type=int, default=30)
    ap.add_argument("--cfg", type=float, default=6.5)
    ap.add_argument("--width", type=int, default=512)     # SD1.5 native; taller warps anatomy
    ap.add_argument("--height", type=int, default=768)
    ap.add_argument("--only", nargs="*", help="regenerate just these shot ids")
    ap.add_argument("--bump", type=int, default=0, help="offset seeds to re-roll")
    a = ap.parse_args()

    shots = json.loads(Path(a.shots).read_text())["shots"]
    if a.only:
        shots = [s for s in shots if s["id"] in a.only]
        if not shots:
            sys.exit(f"no shot ids matched {a.only}")

    outdir = Path(a.out)
    outdir.mkdir(parents=True, exist_ok=True)

    import torch
    guard_memory(a.width, a.height)
    pipe, dev = pipeline(a.model, a.lora, a.arch)
    check_len(pipe, [(x["id"], expand(x)) for x in shots])
    print(f"{a.model} on {dev} · {a.width}x{a.height} · {a.steps} steps\n")

    for s in shots:
        seed = SEEDS[s["seed"]] + a.bump
        g = torch.Generator(device="cpu").manual_seed(seed)
        img = pipe(prompt=expand(s), negative_prompt=NEGATIVE,
                   num_inference_steps=a.steps, guidance_scale=a.cfg,
                   width=a.width, height=a.height, generator=g).images[0]
        p = outdir / f"{s['id']}.png"
        to_plate(img).save(p)            # save per shot: a crash costs one plate, not all
        print(f"  {s['id']}  seed {seed}  {s['note']}", flush=True)
        del img
        if dev == "mps":
            torch.mps.empty_cache()

    print(f"\n{len(shots)} plates → {outdir}")


if __name__ == "__main__":
    main()
