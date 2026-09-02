# Design QA: Politiktok project title overflow

Source visual truth: `C:\Users\josec\AppData\Local\Temp\codex-clipboard-7c6b1824-1ef3-4c74-a577-d57c1d615d15.png`

Implementation screenshot: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\12-politiktok-title-overflow-fixed.png`

Focused comparison: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\14-politiktok-title-overflow-comparison.png`

Viewport: 1280 x 720 CSS px at device scale factor 1. The source capture is 720 x 743 px. The focused comparison uses the source at native size beside a 720 x 720 crop of the implementation's affected copy column. This preserves the source pixels while aligning the visible title and evidence region for comparison.

State: Software portfolio, Politiktok project chapter, production deployment `ef596b7d-fc35-4080-a6b8-cf5fb379f8e2`.

## Findings

- No remaining P0, P1, or P2 issues. The full title is visible and wraps as three complete lines.
- Typography: Space Grotesk family, weight, tracking, line height, and hierarchy remain consistent with the source. Only the emergency long-word wrapping behavior changed.
- Spacing and layout: the title stays within its 375 px text column. Its rendered and scroll widths are both 375 px, its right edge is 1221 px inside the 1280 px viewport, and the document scroll width is 1265 px.
- Colors and tokens: the dark canvas, warm paper text, orange metadata, and divider tones are unchanged.
- Image quality: the existing Politiktok carousel asset, crop, masking, and thumbnail treatment are unchanged.
- Copy and content: all title, evidence, technology, and link copy remains unchanged.
- Console: zero browser console errors.

## Comparison history

1. Earlier P1: `Politiktok research infrastructure` exceeded its grid item's min-content width and was clipped by the document boundary.
2. Fix: allowed the copy and heading grid items to shrink with `min-width: 0`, then added `overflow-wrap: anywhere` as a defensive fallback for long unbroken project-name words.
3. Post-fix evidence: production screenshot and focused comparison show the complete word `infrastructure`; title `clientWidth` and `scrollWidth` match at 375 px, and there is no document-level horizontal overflow.

## Implementation checklist

- [x] Constrain the responsive copy grid.
- [x] Add a safe long-word wrapping fallback.
- [x] Add a CSS regression test.
- [x] Run frontend tests and the production build.
- [x] Verify the deployed page and health endpoint.

Focused-region comparison was required because the full source is a crop of the affected copy column. The combined evidence image was used for the final comparison.

final result: passed
