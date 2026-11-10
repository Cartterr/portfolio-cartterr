# Business card

Two sides, in the look of the Software page: ink and paper, Geist with one Instrument Serif
italic, signal orange, and the hero's wave point field frozen as vector dots.

| File | What it is |
|---|---|
| `jose-carter-card-print.pdf` | Print file. Two pages (front, back), each 96 × 56 mm: the 90 × 50 mm card plus 3 mm bleed on every side. All vector; type is embedded as outlines. No crop marks. |
| `jose-carter-card-front.png`, `-back.png` | Each side at the trim size, 1360 × 756 px (4× the print size). |
| `jose-carter-card-mockup.png` | Both sides together, for sharing. |
| `source/` | The two artboards (`Main.dc.html` front, `Back.dc.html` back), drawn at 4×: 15.1 px = 1 mm. |
| `assets/` | `field-ink.svg` (the dot field, already extended into the bleed) and `qr.svg` (https://josecarter.dev, 25 modules, error correction M). |
| `tools/` | `make_assets.py` draws the two graphics; `build_print.py` and `render.sh` turn the artboards into the PDF and PNGs with headless Chrome. |

The editable canvas is https://claude.ai/artifact/Rx1ZV5taR9GuCE53PoPJDT (private to José).

## For the printer

- Trim 90 × 50 mm, 3 mm bleed, text at least 4 mm inside the trim.
- Colours are sRGB: ink `#0d0d0c`, paper `#f2f0eb`, orange `#ff4a1c`. Ask for a rich black on the
  ink side; the orange is near Pantone Orange 021 C if a spot colour is on offer.
- Smallest type: 6 px at print size (4.5 pt) for the grey mono labels on the paper side, 6.75 px
  (5 pt) reversed out of the ink side. Ask for a proof before a full run.
- The QR code is 14.9 mm wide (0.6 mm modules) and was decoded from the rendered back at both 4×
  and 300 dpi.

## Rebuild

```sh
cd brand/business-card
python tools/make_assets.py assets        # needs: pip install segno
sh tools/render.sh                        # needs Chrome; writes the PDF and PNGs here
```

There is no phone number on the card because the site does not publish one; add a row to the
contact list in `source/Back.dc.html` if you want it.
