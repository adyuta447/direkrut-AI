from pathlib import Path
from PIL import Image, ImageDraw

src = Path("tmp/rendered_lampiran")
pages = sorted(src.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[1]))
thumb_w = 260
thumb_h = 368
cols = 4
rows_per_sheet = 3
per_sheet = cols * rows_per_sheet

for sheet_idx in range((len(pages) + per_sheet - 1) // per_sheet):
    subset = pages[sheet_idx * per_sheet:(sheet_idx + 1) * per_sheet]
    canvas = Image.new("RGB", (cols * thumb_w, rows_per_sheet * (thumb_h + 24)), "white")
    draw = ImageDraw.Draw(canvas)
    for i, path in enumerate(subset):
        img = Image.open(path).convert("RGB")
        img.thumbnail((thumb_w - 12, thumb_h - 12))
        x = (i % cols) * thumb_w + (thumb_w - img.width) // 2
        y = (i // cols) * (thumb_h + 24) + 4
        canvas.paste(img, (x, y))
        draw.text((x, y + img.height + 3), f"Page {int(path.stem.split('-')[1])}", fill="black")
    canvas.save(src / f"contact-{sheet_idx + 1}.png")
