# Software hero visual audit

## Audit scope

- Surface: software portfolio hero at `http://127.0.0.1:3000/`
- User goal: understand whether the current slideshow hero feels intentional, tasteful, and credible as a software-engineering portfolio introduction.
- Evidence: `01-hero-current-accepted.png`, captured at the top of the page at a 1341 × 1266 CSS viewport.

![Current software hero](01-hero-current-accepted.png)

## Step 1 — Initial hero

Health: needs refinement.

### Strengths

- The shortened headline is clear, direct, and readable.
- The typography, orange accent, and monochrome controls establish a recognizable editorial system.
- The slideshow introduces real project imagery instead of generic stock photography.

### UX and design risks

1. The frame has two competing focal points. The oversized headline and the full-height person both demand attention, so neither feels deliberately composed.
2. The active portrait crop is accidental-looking: the head sits close to the navigation and the body cuts directly through the headline and controls.
3. The slideshow lacks a framing device. Without a caption, slide number, or constrained image region, the images read as changing wallpaper rather than evidence from specific projects.
4. The current image set mixes portraits, landscapes, dashboards, and research interfaces. Their lighting and visual density differ too much for one shared full-bleed treatment.
5. The vignette improves edge integration, but it cannot solve the underlying composition. The image remains visible everywhere, leaving the hero slightly muddy rather than producing clean dark negative space.
6. The polished pill navigation and compact mono labels feel precise, while the full-bleed photo feels loose and cinematic. The two systems are not yet joined by a consistent frame or grid.

### Accessibility risks

- Text contrast is strong on this captured frame, but it can vary as subjects and lighter backgrounds rotate beneath the fixed copy.
- Motion has a reduced-motion fallback in code, but screenshots alone cannot verify its runtime behavior or keyboard/focus behavior.

## Highest-impact opportunity

Keep the slideshow, but stop using it as undifferentiated full-bleed wallpaper. Constrain it to an art-directed right-side image field occupying roughly 42–48% of the hero, keep the left copy on a clean dark canvas, and add a small slide index plus project caption. Use only three visually compatible wide technical images. This adds the missing framing and context while preserving motion and personality.

## Evidence limits

- This audit covers one desktop frame and one slideshow state.
- It does not claim full accessibility compliance.
- Alternate slides may create different crop and contrast issues and should be checked after the image set is narrowed.
