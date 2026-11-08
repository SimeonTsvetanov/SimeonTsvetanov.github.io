# scripts/icons.py — regenerates the committed raster assets in static/ (favicons, OG image).
# Run only when the monogram changes: python3 scripts/icons.py  (needs Pillow + Inter Bold).
# The build (scripts/build.mjs) just copies static/ into dist/, so CI needs no Python.
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "static"
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FONT_SEMI = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
ACCENT = (0, 113, 227)  # tokens.css --color-accent #0071E3
WHITE = (255, 255, 255)
TEXT = (29, 29, 31)  # --color-text light #1D1D1F
TEXT2 = (110, 110, 115)  # --color-text-secondary light #6E6E73
BG = (245, 245, 247)  # --color-bg light #F5F5F7


def monogram(size: int, rounded: bool) -> Image.Image:
    scale = 4  # supersample for smooth edges
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0) if rounded else ACCENT + (255,))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.22), fill=ACCENT)
    font = ImageFont.truetype(FONT, int(s * 0.46))
    d.text((s / 2, s / 2), "ST", font=font, fill=WHITE, anchor="mm")
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    monogram(48, True).save(OUT / "favicon-48.png", optimize=True)
    monogram(32, True).save(OUT / "favicon.ico", sizes=[(32, 32)])
    monogram(180, False).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)  # opaque
    monogram(512, False).convert("RGB").save(OUT / "icon-512.png", optimize=True)

    og = Image.new("RGB", (1200, 630), BG)
    og.paste(monogram(160, True), (96, 96), monogram(160, True))
    d = ImageDraw.Draw(og)
    d.text((96, 340), "Free micro-apps", font=ImageFont.truetype(FONT, 76), fill=TEXT)
    d.text((96, 430), "by Simeon Tsvetanov", font=ImageFont.truetype(FONT, 76), fill=TEXT)
    d.text((96, 540), "simeontsvetanov.github.io", font=ImageFont.truetype(FONT_SEMI, 34), fill=TEXT2)
    og.save(OUT / "og-image.png", optimize=True)


if __name__ == "__main__":
    main()
