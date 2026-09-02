# Design QA: shared software-project title treatment

Source visual truth: `C:\Users\josec\AppData\Local\Temp\codex-clipboard-18fc3834-0886-435c-b072-4669a807346f.png`

Implementation screenshot: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\15-project-title-scale-final.png`

Focused comparison: `C:\Users\josec\Documents\Codex\2026-08-26\okay-based-on-what-you-find\outputs\portfolio-cartterr\artifacts\16-project-title-scale-comparison.png`

Viewport: 1280 x 720 CSS px at device scale factor 1. The source capture is 869 x 749 px. The implementation capture is 1265 x 720 px.

State: Live software portfolio, Politiktok project chapter, production deployment `de5e8429-a6f8-42f9-9fd9-2f6e050d03bc`.

## Findings

- No remaining P0, P1, or P2 issues. Politiktok now wraps cleanly as three whole-word lines with no orphaned letter.
- Typography: every software-project title uses the same reduced responsive scale, full column width, and normal whole-word wrapping.
- Spacing and layout: all six titles share the exact left edge of their role/date metadata. The page has no horizontal overflow at 1280 x 720.
- Colors and tokens: unchanged.
- Image quality: existing carousel assets, crops, masks, and thumbnail treatments are unchanged.
- Copy and content: all project titles, evidence, technology, and link copy remain unchanged.
- Console: zero browser console errors.

## Comparison history

1. Earlier P1: the emergency `overflow-wrap: anywhere` fallback kept the Politiktok title in bounds but split `infrastructure` into an orphaned final `e`.
2. Fix: reduced the shared title scale, removed the narrow character-based title limit, used the full text-column width, and restored normal whole-word wrapping.
3. Post-fix evidence: Politiktok renders as `Politiktok` / `research` / `infrastructure`; all six project titles are aligned with their role/date metadata and remain inside the viewport.

## Implementation checklist

- [x] Apply the title treatment globally to all software-project chapters.
- [x] Remove forced mid-word wrapping.
- [x] Add a CSS regression test.
- [x] Run frontend tests and the production build.
- [x] Verify all six titles in the deployed page.
- [x] Verify the deployed health endpoint.

The focused comparison preserves the supplied screenshot beside the live implementation to make the corrected title wrapping and alignment directly visible.

final result: passed
