# Software hero editorial-image design QA

## Evidence

- Source visual truth: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\01-current-hero-audit.png`
- Browser-rendered implementation: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\06-final-editorial-hero.png`
- Rollback verification capture: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\09-hero-restored-editorial-treatment.png`
- Viewport: 1850 × 1526 CSS px at device pixel ratio 0.75.
- Pixel dimensions: implementation and rollback captures are both 2440 × 2035 px. No density normalization was needed.
- State: software hero at `/`, first slideshow image (`nd1`).
- Full-view comparison evidence: the pre-change implementation and rollback capture were opened together in one comparison input and match visually.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: heading, summary, navigation, buttons, and quiet image context label preserve the established type system and hierarchy.
- Spacing and layout rhythm: the two-column composition remains intact. The image extends to the right viewport edge and is anchored to the page grid instead of floating as a separate object.
- Colors and visual tokens: the warm-black canvas, restrained neutral/orange palette, and per-slide tonal balancing remain unchanged.
- Image quality and asset fidelity: the vertical alpha mask was removed. The previous directional left-edge transition and restrained tonal top/bottom falloff are restored without a card, border, radius, or spotlight shape.
- Copy and content: hero copy is unchanged. The slideshow counter and divider were removed; the concise project context label remains.
- Responsiveness: desktop has no horizontal overflow. Existing tablet and mobile ratios retain their horizontal edge mask when the layout stacks.
- Accessibility: figure/figcaption semantics and reduced-motion behavior remain. Screenshot evidence cannot prove keyboard or assistive-technology behavior, but existing automated coverage passed.
- Runtime: all three slideshow images were inspected; no new browser errors were recorded.

## Comparison history

### Pass 1

- [P1] The radial mask created an obvious oval spotlight, making the image feel decorative and detached from the layout.
- Fix: replaced it with a directional editorial bleed tied to the right viewport edge.

### Pass 2

- [P2] The detached counter, divider, and caption competed with the image while the bright dashboard slide disrupted the dark composition.
- Fix: removed the counter and divider, retained one quiet contextual label, and added per-slide tonal balancing for the geoscience and GridWorks images.
- Post-fix evidence: `06-final-editorial-hero.png` and `07-final-editorial-hero-slide-2.png`.

## Implementation checklist

- [x] Remove the oval spotlight geometry.
- [x] Anchor the media treatment to the page grid and viewport edge.
- [x] Keep a soft copy-side transition without hard image borders.
- [x] Simplify the slideshow caption treatment.
- [x] Balance all three slideshow images individually.
- [x] Preserve responsive ratios, reduced motion, and image timing.
- [x] Pass 12 frontend test files / 76 tests, production frontend build, browser checks, and diff checks.

## Follow-up polish

- No blocking polish remains. Any further changes would be art-direction choices rather than corrections to the current treatment.

final result: passed
