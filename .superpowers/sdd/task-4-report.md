# Task 4 report: shared liquid-glass shell and mode routing

## Status

Complete.

## Delivered

- Pathname-first Software (`/`) and Visual (`/visual`, including trailing slash) identity.
- Normal mode links enhanced with History API navigation, metadata updates, live announcements,
  intentional-switch scroll reset, destination `h1` focus, and PopState scroll restoration.
- Stable `main` with keyed `AnimatePresence` page trees under `MotionConfig` and `LazyMotion`.
- Data-driven header navigation, current-section scroll spy, integrated progress, persistent mode
  switch, and accessible mobile disclosure with Escape/focus return.
- Progressive desktop/fine-pointer Lenis enhancement disabled for reduced motion and Save-Data;
  native scrolling remains the baseline.
- Warm-black liquid-glass shell with Software orange and Visual spectral accents plus opaque,
  forced-colors, higher-contrast, and reduced-transparency fallbacks.
- Existing simple sections remain behind a compatibility adapter for Tasks 5 and 6.

## TDD evidence

- RED: focused App/CSS suite failed 7 acceptance tests for the missing route and glass behaviors.
- GREEN: focused App/CSS suite passes 10/10 tests.
- Full frontend suite passes 38/38 tests across 8 files.

## Verification

- `npm run test --workspace frontend -- src/App.test.tsx`
- `npm run lint --workspace frontend`
- `npm run type-check --workspace frontend`
- `npm run test --workspace frontend`
- `npm run build --workspace frontend`

## Commit

`feat: add dual portfolio glass shell`

## Follow-up boundary

Tasks 5 and 6 replace the compatibility-rendered Software and Visual section presentations. Task 4
does not implement their final long-form content or Visual hero scene.
