# Task 6 Report — Visual Computing Portfolio and Bounded Hero

## Status

Implemented the complete Visual / 3D portfolio as a dedicated long-form document with an immediate DOM shell and an optional, bounded real-time hero scene.

## Delivered

- Replaced the temporary `VisualCompatibilityPortfolio` with the final `VisualPortfolio` while leaving `SoftwarePortfolio` unchanged.
- Added the full Visual document in the required order: hero, creative-technology profile, laboratories, selected work, pipeline/capabilities, and visual contact.
- Preserved the canonical section IDs used by navigation and scroll spy: `hero`, `about`, `experience`, `work`, `capabilities`, and `contact`.
- Added three truthful launch stories with contextual, one-active-image carousels:
  - Marga-Marga geoscience and scientific visualization.
  - Parametric shelving configurator using the three cleared native captures in `assets/visual`.
  - Drone Response spatial autonomy using cleared Notre Dame field evidence.
- Added a spectral warm-black/cyan-violet responsive identity with accessible high-contrast, forced-colors, and reduced-motion handling.
- Added a geoscience poster that remains present while the graphics import loads and when poster-only capability is selected.
- Added a `poster | low | full` capability gate covering reduced motion, Save-Data, WebGL2 availability, conservative hardware hints, and measured runtime downgrade events.
- Kept `VisualHeroScene`, Fiber, Drei, Three, `TerrainLens`, and `SpectralField` behind one `React.lazy` boundary inside the Visual hero.
- Added import-error and render-error boundaries plus WebGL context-loss fallback to the static poster path.
- Added a deterministic conservative terrain mesh, one low-resolution `MeshTransmissionMaterial` subject, and a bounded deterministic spectral field without post-processing.
- Capped Canvas DPR at 1.5, used `frameloop="demand"`, limited invalidation rate by quality and interaction, stopped invalidation offscreen, and paused it for hidden documents.

## TDD Evidence

### RED

Command:

```text
npm run test --workspace frontend -- src/pages/VisualPortfolio.test.tsx src/visual/VisualHeroScene.test.tsx
```

Observed failure: Vite could not resolve `VisualPortfolio` or `useGraphicsCapability`, confirming the new page and capability contracts did not exist.

A second RED cycle added the lazy-import error fallback contract. It failed because `VisualHeroErrorBoundary` was not yet exported.

### GREEN

- Focused Task 6 suites: 10/10 passed.
- Tests cover immediate six-section DOM rendering while the scene suspends, both hero CTAs, all three cleared project stories and contextual galleries, truthful authorship copy, poster selection, low/full classification, runtime downgrades, and lazy-import rejection fallback.
- Existing App tests cover `/visual` mode labels, route identity, section navigation, mode switching, focus, history, and the final Visual tree.
- R3F/WebGL is not mounted in JSDOM; scene tests stay at the capability and module boundary.

## Verification

- Focused Visual + App integration suites: 18/18 passed.
- Full frontend suite: 57/57 passed across 12 files.
- ESLint: passed with zero warnings.
- TypeScript type-check: passed.
- TypeScript and Vite production build: passed; 1,140 modules transformed.
- `git diff --check`: no whitespace errors.

## Chunk Audit

- Shared application JavaScript: `403.25 kB` raw / `125.30 kB` gzip.
- Lazy `VisualHeroScene` graphics chunk: `912.88 kB` raw / `240.67 kB` gzip.
- Shared CSS: `74.00 kB` raw / `13.68 kB` gzip.
- The graphics chunk is below the `400 kB` gzip target.
- Neither generated `dist/index.html` nor `dist/visual/index.html` contains a `VisualHeroScene` preload or static script reference.
- The shared main chunk contains a dynamic import edge for `VisualHeroScene`; the Software document does not request Three/Fiber/Drei unless the Visual page mounts and capability is not `poster`.

## Self-Review

- The React page shell stays synchronous; only the scene import can suspend.
- Hook subscriptions, intersection observers, visibility listeners, timers, and animation frames include cleanup paths.
- Semantic sections, headings, links, carousels, poster alt text, direct contact paths, and focus behavior reuse the established accessible shell.
- Galleries show one dominant image at a time and retain the shared lazy-source, keyboard, thumbnail, lightbox, and reduced-motion behavior.
- Copy distinguishes demonstrated visual-computing work from unsupported production credits; no demo-reel, film-credit, studio, SIGGRAPH, private-dashboard, or unpublished XR/particle claims were added.
- No secrets, virtualized tooling, Docker, WSL, VMs, heavy post-processing, or new media with unclear rights were introduced.

## Concern / Deferred Gate

Vite reports the raw graphics chunk as larger than 500 kB because Three/Fiber/Drei are isolated together, but its `240.67 kB` gzip size remains within the approved graphics budget and it is not preloaded by either HTML entry. Browser screenshot comparison, real WebGL visual QA, and final multi-viewport verification remain intentionally deferred to Task 8.

## Post-Review Runtime Hardening

Three Important review findings were verified against the Task 6 runtime before implementation:

1. `useFrame` delta included the deliberate demand-ticker interval, so the former `0.034s` and `0.055s` thresholds would eventually classify the intentional 28fps and 18fps idle cadences as slow.
2. Signal refreshes replaced the current capability directly, allowing a runtime or WebGL-context downgrade to upgrade again without a reload.
3. Missing `IntersectionObserver` left the scene's initial `nearViewport=true`, so demand invalidation could remain active without a trustworthy offscreen signal.

### Review RED

Command:

```text
npm run test --workspace frontend -- src/visual/VisualHeroScene.test.tsx src/visual/VisualHeroRuntimePolicy.test.ts
```

Observed failures:

- A connection refresh upgraded the live hook from the runtime ceiling `low` back to baseline `full`.
- The cadence and visibility policy module did not exist, so the deliberate-cadence and missing-observer regressions could not pass.

### Review Fix

- Added a pure runtime-window policy that derives a sustainable threshold from the selected demand cadence with a `1.5x + 4ms` scheduling tolerance. Two slow windows are still required for downgrade, while exact 28fps and 18fps cadences remain stable.
- Reset governor samples when quality or target cadence changes so partial windows are never compared against a different scheduler target.
- Split the capability hook into a live baseline and a sticky runtime ceiling; the returned capability is always the minimum of the two.
- Applied both runtime and WebGL-context fallback events to the ceiling, so motion and connection refreshes can become more restrictive but cannot undo a measured downgrade.
- Selected poster fallback and paused demand rendering when `IntersectionObserver` is unavailable, then dispatched the sticky poster ceiling to unmount the scene path.

### Review Verification

- Focused capability/runtime suites: 11/11 passed across 2 files.
- Cadence regression covers both deliberate 28fps and 18fps schedules plus sustained 12fps degradation.
- Sticky-ceiling regression covers Save-Data connection refresh and reduced-motion refresh after runtime/context downgrade.
- Missing-observer regression selects the conservative poster policy.
- ESLint: passed with zero warnings.
- TypeScript type-check: passed.
- TypeScript and Vite production build: passed; 1,141 modules transformed.
- Shared application JavaScript: `403.30 kB` raw / `125.31 kB` gzip.
- Lazy `VisualHeroScene` graphics chunk: `913.27 kB` raw / `240.80 kB` gzip.
- Neither generated HTML entry preloads the scene; the shared main bundle retains only its dynamic import edge.
- `git diff --check`: no whitespace errors.

The existing raw graphics-chunk warning remains unchanged in nature; the isolated scene stays below the approved `400 kB` gzip budget.
