"""Business card graphics: the page's wave point field as print-safe vector dots, and a QR code.

Usage: python make_assets.py <out_dir> [time]
All sizes are in the card's design units: 4 px per printed 0.2646 mm (15.118 px = 1 mm).
"""
import math
import sys
from collections import defaultdict

import segno

OUT = sys.argv[1]
TIME = float(sys.argv[2]) if len(sys.argv) > 2 else 20.2
SHIFT = float(sys.argv[3]) if len(sys.argv) > 3 else 2.3
AMP = 1.55

TRIM_W, TRIM_H, BLEED = 1360, 756, 45
VIEW_X, VIEW_Y = -BLEED, -BLEED
VIEW_W, VIEW_H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED

INK = (13, 13, 12)
PAPER = (242, 240, 235)
SIGNAL = (255, 74, 28)


def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def mix(c0, c1, t):
    return tuple(round(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))


def wave_field(cols, rows, top, height, size_scale, ground, dot):
    """The same swell as the site's WebGL shader, frozen at TIME and projected to the card."""
    aspect = VIEW_W / height
    focal = 1.9
    groups = defaultdict(list)
    count = 0
    for row in range(rows):
        gy = row / (rows - 1)
        z = 1.1 + (13.0 - 1.1) * gy * gy
        for col in range(cols):
            gx = col / (cols - 1)
            x = (gx * 2 - 1) * (2.2 + z * 1.05)
            t = TIME
            wx = x - SHIFT  # slides the swell sideways without moving the grid
            h = 0.34 * math.sin((wx * 0.62 + z * 0.78) * 0.9 + t * 0.7)
            h += 0.17 * math.sin((wx * -0.71 + z * 0.70) * 1.9 - t * 1.1)
            h += 0.08 * math.sin((wx * 0.21 + z * -0.98) * 3.7 + t * 1.7)
            h += 0.04 * math.sin((wx * 0.95 + z * 0.31) * 7.1 - t * 2.3)
            h *= AMP
            crest = smoothstep(0.26 * AMP, 0.6 * AMP, h)
            ndc_x = x * focal / z / aspect
            ndc_y = (h - 1.55) * focal / z + 0.62
            px = VIEW_X + (ndc_x * 0.5 + 0.5) * VIEW_W
            py = top + (1 - (ndc_y * 0.5 + 0.5)) * height
            if not (VIEW_X - 6 <= px <= VIEW_X + VIEW_W + 6 and VIEW_Y <= py <= VIEW_Y + VIEW_H + 6):
                continue
            fade = smoothstep(13.0, 6.0, z) * smoothstep(1.0, 1.9, z)
            fade *= smoothstep(0.66, 0.2, ndc_y)
            alpha = fade * (0.5 + 0.5 * crest)
            if alpha < 0.07:
                continue
            diameter = max(2.4, min(9.5, size_scale * (5.4 / z) * (1 + crest * 0.8)))
            hot = smoothstep(0.5, 0.95, crest)
            base = mix(dot, SIGNAL, hot)
            # Baked against the ground colour: no transparency for the printer to flatten.
            color = mix(ground, base, min(1.0, alpha * (1.0 + 0.55 * hot)))
            level = tuple(round(channel / 12) * 12 for channel in color)
            key = ('#%02x%02x%02x' % tuple(min(255, c) for c in level), round(diameter * 2) / 2)
            groups[key].append((round(px, 1), round(py, 1)))
            count += 1
    return groups, count


def field_svg(groups):
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%d %d %d %d" width="%d" height="%d" '
        'fill="none" stroke-linecap="round">' % (VIEW_X, VIEW_Y, VIEW_W, VIEW_H, VIEW_W, VIEW_H)
    ]
    for (color, diameter), points in sorted(groups.items()):
        d = ''.join('M%g %gh.01' % point for point in points)
        parts.append('<path stroke="%s" stroke-width="%g" d="%s"/>' % (color, diameter, d))
    parts.append('</svg>')
    return ''.join(parts)


groups, count = wave_field(cols=112, rows=50, top=215, height=640, size_scale=2.2, ground=INK, dot=PAPER)
with open(OUT + '/field-ink.svg', 'w', encoding='utf-8', newline='\n') as handle:
    handle.write(field_svg(groups))
print('field-ink.svg', count, 'dots in', len(groups), 'paths')

# QR: the site's address, error correction M (version 2, 25 modules), drawn as one path.
qr = segno.make('https://josecarter.dev', error='m', micro=False)
size = qr.symbol_size(border=0)[0]
rects = []
for y, row in enumerate(qr.matrix):
    x = 0
    while x < len(row):
        if row[x]:
            start = x
            while x < len(row) and row[x]:
                x += 1
            rects.append('M%d %dh%dv1h-%dz' % (start, y, x - start, x - start))
        else:
            x += 1
with open(OUT + '/qr.svg', 'w', encoding='utf-8', newline='\n') as handle:
    handle.write(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" '
        'shape-rendering="crispEdges"><path fill="#0d0d0c" d="%s"/></svg>'
        % (size, size, size * 10, size * 10, ''.join(rects))
    )
print('qr.svg version', qr.version, 'modules', size, 'error', qr.error)
