"""Builds print and preview pages from the card's two artboards.

Usage: python build_print.py <canvas_project_dir> <assets_dir> <fonts_root> <out_dir>

Outputs in <out_dir>:
  front.html, back.html   one side each at 1360 x 756 px (for PNG previews)
  print.html              two pages of 96 x 56 mm: the 90 x 50 mm card plus 3 mm bleed
  mockup.html             both sides on a desk-coloured ground
"""
import pathlib
import re
import sys

project, assets, fonts_root, out = (pathlib.Path(arg) for arg in sys.argv[1:5])

ASSETS = {
    '/_blob/8f34baa72b8e67de1d0c62d93bc6068c': 'field-ink.svg',
    '/_blob/95d0cf405c1517f445991d7635f47baf': 'qr.svg',
}
ACCENT = '#ff4a1c'
TRIM_W, TRIM_H = 1360, 756
MM = 96 / 25.4  # CSS px per millimetre
SCALE = 90 * MM / TRIM_W


def url(path):
    return pathlib.Path(path).resolve().as_uri()


FONT_FACES = """
@font-face { font-family: 'Geist'; font-weight: 100 900; font-style: normal;
  src: url('%s') format('woff2'); }
@font-face { font-family: 'Geist Mono'; font-weight: 100 900; font-style: normal;
  src: url('%s') format('woff2'); }
@font-face { font-family: 'Instrument Serif'; font-weight: 400; font-style: italic;
  src: url('%s') format('woff2'); }
""" % (
    url(fonts_root / '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'),
    url(fonts_root / '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'),
    url(fonts_root / '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'),
)


def artboard(name):
    """The markup inside <x-dc>, without its <helmet>, with tweak holes and asset urls resolved."""
    source = (project / name).read_text(encoding='utf-8')
    body = re.search(r'<x-dc>(.*)</x-dc>', source, re.S).group(1)
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S)
    body = body.replace('{{accent}}', ACCENT)
    for blob, filename in ASSETS.items():
        body = body.replace(blob, url(assets / filename))
    assert '/_blob/' not in body and '{{' not in body, name
    return body.strip()


front, back = artboard('Main.dc.html'), artboard('Back.dc.html')
HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><style>%s%s</style></head><body>'
TAIL = '</body></html>'

for filename, body in (('front.html', front), ('back.html', back)):
    (out / filename).write_text(
        HEAD % (FONT_FACES, 'html,body{margin:0}') + body + TAIL, encoding='utf-8'
    )


def bleed(body):
    # On paper the artwork runs past the trim line, so the root stops clipping.
    return body.replace('overflow: hidden; ', '', 1)


print_css = """
@page { size: 96mm 56mm; margin: 0; }
html, body { margin: 0; }
.sheet { position: relative; width: 96mm; height: 56mm; overflow: hidden; break-after: page; }
.sheet:last-child { break-after: auto; }
.sheet { break-inside: avoid; }
/* zoom, not transform: a transformed card keeps its 4x layout height, and print
   pagination then moves anything below the first 56 mm of it off the page. */
.card { position: absolute; left: 3mm; top: 3mm; }
/* The offset sits outside the zoomed box: zoom would shrink the 3 mm too. */
.card > .scaled { width: %dpx; height: %dpx; zoom: %.6f; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
""" % (TRIM_W, TRIM_H, SCALE)
(out / 'print.html').write_text(
    HEAD % (FONT_FACES, print_css)
    + '<div class="sheet" style="background:#0d0d0c"><div class="card"><div class="scaled">%s</div></div></div>' % bleed(front)
    + '<div class="sheet" style="background:#f2f0eb"><div class="card"><div class="scaled">%s</div></div></div>' % bleed(back)
    + TAIL,
    encoding='utf-8',
)

mockup_css = """
html, body { margin: 0; }
body { width: 2000px; height: 1300px; overflow: hidden; background: #d9d5cc; position: relative; }
.card { position: absolute; width: 1360px; height: 756px; transform-origin: 50% 50%;
  box-shadow: 0 2px 4px rgba(13,13,12,.18), 0 40px 70px -30px rgba(13,13,12,.55); }
/* Scaled about their centres and set on a diagonal so neither side hides the other. */
.front { left: -104px; top: -38px; transform: scale(.7) rotate(-4deg); }
.back { left: 746px; top: 582px; transform: scale(.7) rotate(3deg); }
"""
(out / 'mockup.html').write_text(
    HEAD % (FONT_FACES, mockup_css)
    + '<div class="card front">%s</div><div class="card back">%s</div>' % (front, back)
    + TAIL,
    encoding='utf-8',
)
print('built', sorted(path.name for path in out.glob('*.html')))
