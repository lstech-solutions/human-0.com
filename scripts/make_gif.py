from PIL import Image, ImageDraw
import random
from pathlib import Path

"""
Generates an animated GIF where each opaque pixel of the Vitruvian asset
holds a persistent 0/1 digit that flips randomly over time.

Usage:
    python scripts/make_gif.py

Outputs:
    vitruvian_flip.gif in the repo root.
"""

ASSET_PATH = Path("apps/web/public/images/vitruvian01.png")
OUTPUT_PATH = Path("vitruvian_flip.gif")

# Toggle this to switch palette
USE_DARK = True  # True: neon green digits on dark, False: black digits on light

NUM_FRAMES = 60  # ~1s at 60fps
FRAME_DURATION_MS = 50
FLIP_PROBABILITY = 0.08  # 8% chance each frame for each pixel to flip 0<->1
ALPHA_THRESHOLD = 32     # ignore nearly transparent pixels

DARK_COLOR = (0, 255, 156, 255)
LIGHT_COLOR = (0, 0, 0, 255)


def main():
    if not ASSET_PATH.exists():
        raise FileNotFoundError(f"Asset not found: {ASSET_PATH}")

    src = Image.open(ASSET_PATH).convert("RGBA")
    w, h = src.size
    pixels = src.load()

    # Build mask of significant pixels and initial digits
    mask_coords = []
    base_digits = {}
    for y in range(h):
        for x in range(w):
            _, _, _, a = pixels[x, y]
            if a > ALPHA_THRESHOLD:
                mask_coords.append((x, y))
                base_digits[(x, y)] = random.choice(("0", "1"))

    frames = []
    digit_color = DARK_COLOR if USE_DARK else LIGHT_COLOR

    for _ in range(NUM_FRAMES):
        frame = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame)

        for (x, y) in mask_coords:
            if random.random() < FLIP_PROBABILITY:
                base_digits[(x, y)] = "1" if base_digits[(x, y)] == "0" else "0"
            draw.text((x, y), base_digits[(x, y)], fill=digit_color)

        frames.append(frame)

    frames[0].save(
        OUTPUT_PATH,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_DURATION_MS,
        loop=0,
        optimize=True,
    )

    print(
        f"Saved {OUTPUT_PATH} "
        f"({NUM_FRAMES} frames, {FRAME_DURATION_MS} ms/frame, "
        f"{len(mask_coords)} pixels animated)"
    )


if __name__ == "__main__":
    main()
