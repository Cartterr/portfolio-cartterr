# Dual Portfolio Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and deploy a complete dual-mode Software and Visual/3D portfolio based on the long-form structure and contextual galleries from commit `c94ed511111254d523051644a36ac25bbe3fcbe3`.

**Architecture:** One React 19 application hydrates two Vite HTML entries (`/` and `/visual`) with route-correct metadata. The application keeps a shared liquid-glass shell and swaps complete Software and Visual page trees. Typed content/media manifests drive contextual Embla galleries; the Visual hero lazy-loads one bounded React Three Fiber scene. Express serves the two explicit document routes, preserves the contact/health API, and deploys as the existing single Railway service.

**Tech Stack:** Native Node.js 24, npm workspaces, React 19.2, TypeScript 5.9, Vite 8, Tailwind CSS 4, Motion 12, Lenis 1.3, Embla 8.6, Three.js 0.185, React Three Fiber 9.6, Drei 10.7, Vitest 4, Testing Library 16, Express, Railway.

## Global Constraints

- Work only in `V:\dev\portfolio-cartterr\.worktrees\portfolio-rebuild` on `feat/portfolio-rebuild`.
- Preserve unrelated local changes and the production rollback history.
- Use native Windows tools only; no Docker, WSL, VMs, VMMs, or virtualization.
- Preserve the long portfolio order: Hero, About, Experience, Selected Work, Capabilities, Contact, Footer.
- Provide complete Software and Visual/3D page trees; switching mode replaces the whole page content.
- Restore all 57 legacy gallery entries contextually; never render an image wall.
- Do not mention SIGGRAPH anywhere in public content, metadata, code-visible copy, or assets.
- Use real existing assets and project captures. Do not claim upstream samples or unclear work as original.
- Keep `/api/health`, the contact flow, the apex domain, and the existing Railway service.
- Liquid glass is limited to navigation, controls, captions, and actions; content chapters remain readable.
- The Visual DOM must render before the Three.js chunk; the Software route must not request Three.js.
- Respect reduced motion, Save-Data, keyboard navigation, focus management, and WCAG AA contrast.
- Follow red-green-refactor for every behavior change; capture the expected failing output before implementation.
- Normalize to npm workspaces and one root `package-lock.json`; remove Yarn authority only in the migration task.
- Never expose credentials, tokens, SMTP values, Railway identifiers, or private content in output or commits.

---

### Task 1: Modernize the native toolchain and create two HTML entry contracts

**Files:**
- Modify: `package.json`
- Modify: `frontend/package.json`
- Modify: `backend/package.json`
- Modify: `frontend/vite.config.ts`
- Create: `frontend/visual/index.html`
- Modify: `frontend/index.html`
- Create: `frontend/eslint.config.js`
- Modify: `frontend/src/test/setup.ts`
- Modify: `scripts/production-contract.test.mjs`
- Delete: `frontend/yarn.lock`
- Delete: `backend/yarn.lock`
- Delete: `yarn.lock`
- Create/Modify: `package-lock.json`

**Interfaces:**
- Produces root npm workspaces `frontend` and `backend`.
- Produces Vite entry documents at `dist/index.html` and `dist/visual/index.html`.
- Produces `npm run test`, `npm run lint`, `npm run type-check`, and `npm run build` from the root.

- [ ] **Step 1: Write failing production-contract tests**

Add assertions that the root has npm workspaces, no script invokes Yarn, React is pinned to `19.2.7`, Vite is `8.1.4`, both HTML entries exist, `/visual` has its own canonical/OG metadata, and Vitest/Testing Library match React 19.

```js
test('native npm workspace owns the modern dual-entry frontend', () => {
  const root = readJson('package.json')
  const frontend = readJson('frontend/package.json')
  assert.deepEqual(root.workspaces, ['frontend', 'backend'])
  assert.equal(Object.values(root.scripts).some((script) => /\byarn\b/.test(script)), false)
  assert.equal(frontend.dependencies.react, '19.2.7')
  assert.equal(frontend.devDependencies.vite, '8.1.4')
  assert.equal(existsSync(resolve(repoRoot, 'frontend/visual/index.html')), true)
  assert.match(readFileSync(resolve(repoRoot, 'frontend/visual/index.html'), 'utf8'), /canonical.*\/visual/s)
})
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `node --test scripts/production-contract.test.mjs`

Expected: FAIL because workspaces, package versions, and `frontend/visual/index.html` do not yet exist.

- [ ] **Step 3: Migrate package authority and install the pinned stack**

Set root workspaces and scripts to `npm run <script> --workspace frontend|backend`. Pin the frontend runtime to:

```json
{
  "react": "19.2.7",
  "react-dom": "19.2.7",
  "motion": "12.42.2",
  "lenis": "1.3.25",
  "three": "0.185.1",
  "@react-three/fiber": "9.6.1",
  "@react-three/drei": "10.7.7",
  "embla-carousel-react": "8.6.0",
  "embla-carousel-fade": "8.6.0",
  "lucide-react": "1.24.0",
  "@fontsource-variable/space-grotesk": "5.2.10",
  "@fontsource/ibm-plex-mono": "5.2.7"
}
```

Pin Vite `8.1.4`, plugin-react `6.0.3`, TypeScript `5.9.3`, Vitest `4.1.10`, Testing Library React `16.3.2`, DOM `10.4.1`, user-event `14.6.1`, jsdom `29.1.1`, Tailwind and `@tailwindcss/vite` `4.3.2`, vite-imagetools `10.0.1`, ESLint `10.7.0`, typescript-eslint `8.63.0`, React types `19.2.17`/`19.2.3`, and `@types/three` `0.185.1`.

Use `apply_patch` for JSON/config edits, remove obsolete lockfiles with `Remove-Item -LiteralPath`, then run `npm install` at the repository root.

- [ ] **Step 4: Configure Vite multi-page output and Tailwind 4**

Use Rollup inputs for both entry documents and the Tailwind Vite plugin:

```ts
build: {
  rollupOptions: {
    input: {
      software: path.resolve(__dirname, 'index.html'),
      visual: path.resolve(__dirname, 'visual/index.html'),
    },
  },
}
```

Both HTML files mount `/src/main.tsx`; the Visual document has `data-portfolio-mode="visual"`, `/visual` canonical metadata, and a useful `noscript` contact/CV fallback.

- [ ] **Step 5: Verify GREEN**

Run: `node --test scripts/production-contract.test.mjs && npm run type-check && npm run build`

Expected: all production-contract tests pass; TypeScript and both Vite entries build successfully.

- [ ] **Step 6: Commit**

```text
git add package.json package-lock.json frontend backend scripts/production-contract.test.mjs
git commit -m "build: modernize dual portfolio toolchain"
```

### Task 2: Define dual-mode content and the cleared contextual media manifest

**Files:**
- Replace: `frontend/src/data/portfolio.ts`
- Create: `frontend/src/data/types.ts`
- Create: `frontend/src/data/shared.ts`
- Create: `frontend/src/data/software.ts`
- Create: `frontend/src/data/visual.ts`
- Create: `frontend/src/data/media.ts`
- Create: `frontend/src/data/media.test.ts`
- Modify: `frontend/src/data/portfolio.test.ts`
- Copy/add only cleared captures under: `frontend/src/assets/visual/`

**Interfaces:**
- Produces `PortfolioMode = 'software' | 'visual'`.
- Produces `PortfolioPage`, `ExperienceStory`, `ProjectStory`, `CapabilityStory`, and discriminated `PortfolioMedia` types.
- Produces `softwarePortfolio`, `visualPortfolio`, `legacyMedia`, and `getPortfolio(mode)`.
- Every media entry includes `id`, `kind`, `src`, `thumbnail`, `width`, `height`, `alt`, `caption`, `fit`, `objectPosition`, `rights`, `publication`, and `storyId`.

- [ ] **Step 1: Write failing content and media tests**

```ts
it('restores every legacy gallery entry to its original story', () => {
  expect(legacyMedia).toHaveLength(57)
  expect(countByStory(legacyMedia)).toEqual({
    profile: 13,
    dily: 3,
    gridworks: 2,
    flair: 4,
    notreDame: 9,
    politiktok: 12,
    teaching: 5,
    geoscience: 9,
  })
})

it('defines two complete portfolio trees without conference branding', () => {
  for (const page of [softwarePortfolio, visualPortfolio]) {
    expect(page.sections.map((section) => section.kind)).toEqual([
      'hero', 'about', 'experience', 'work', 'capabilities', 'contact',
    ])
    expect(JSON.stringify(page)).not.toMatch(/siggraph/i)
  }
  expect(visualPortfolio.projects.length).toBeGreaterThanOrEqual(3)
})
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace frontend -- src/data/media.test.ts src/data/portfolio.test.ts`

Expected: FAIL because the dual content modules and 57-entry manifest do not exist.

- [ ] **Step 3: Port and enrich the legacy manifest**

Read the exact gallery membership and captions from `c94ed511...:frontend/src/data/imageManifest.ts`. Port all 57 entries without changing story membership. Add explicit focal/object positioning and rights/publication fields. Treat previously public portfolio media as `publication: 'approved'` unless inspection reveals identity documents, secrets, private dashboards, or newly restricted employer content; stop and report any such specific conflict.

Use existing optimized main/thumbnail WebPs for the legacy entries so this restoration does not recompress them. New visual captures use original PNG/JPEG inputs with bounded vite-imagetools renditions.

- [ ] **Step 4: Implement the two truthful content trees**

Software order: Hero, personal About, seven-story Experience, six selected engineering projects, four capability groups, engineering Contact.

Visual order: Visual hero, creative-technology profile, visual laboratories, minimum launch work (geoscience, parametric configurator, cleared Drone Response spatial autonomy), visual pipeline/capabilities, visual collaboration Contact. Add XR and `playful-balls` only when the capture and authorship audit passes.

Use the user's full name, real verified dates/outcomes/links already present in committed content, and no SIGGRAPH text.

- [ ] **Step 5: Verify GREEN and asset integrity**

Run: `npm run test --workspace frontend -- src/data/media.test.ts src/data/portfolio.test.ts && npm run type-check --workspace frontend`

Expected: content tests pass, exactly 57 legacy entries resolve to existing files, and every published visual project has real media.

- [ ] **Step 6: Commit**

```text
git add frontend/src/data frontend/src/assets/visual
git commit -m "feat: define dual portfolio content and media"
```

### Task 3: Build the accessible one-image carousel and lightbox system

**Files:**
- Create: `frontend/src/components/media/PortfolioCarousel.tsx`
- Create: `frontend/src/components/media/PortfolioCarousel.test.tsx`
- Create: `frontend/src/components/media/LightboxDialog.tsx`
- Create: `frontend/src/components/media/LightboxDialog.test.tsx`
- Create: `frontend/src/components/media/MediaFrame.tsx`
- Create: `frontend/src/hooks/useNearViewport.ts`
- Create: `frontend/src/styles/gallery.css`

**Interfaces:**
- `PortfolioCarousel({ id, label, media, autoplayMs?, featured? })`.
- `LightboxDialog({ open, media, index, onIndexChange, onClose, returnFocusRef })`.
- Dormant galleries omit main `src/srcSet`; near-viewport galleries source only active and adjacent slides.

- [ ] **Step 1: Write failing carousel interaction tests**

Test region/slide semantics, one visible active slide, native Previous/Next, ArrowLeft/ArrowRight, selected thumbnails, `n of total`, disabled autoplay under reduced motion, stopping autoplay on focus/manual interaction, and loading only active/adjacent media after viewport activation.

```tsx
expect(screen.getByRole('region', { name: /profile gallery/i })).toHaveAttribute(
  'aria-roledescription',
  'carousel',
)
await user.click(screen.getByRole('button', { name: /next image/i }))
expect(screen.getByText('2 of 3')).toBeInTheDocument()
expect(screen.getByRole('button', { name: /image 2 of 3/i })).toHaveAttribute('aria-current', 'true')
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace frontend -- src/components/media/PortfolioCarousel.test.tsx`

Expected: FAIL because the carousel component does not exist.

- [ ] **Step 3: Implement the Embla Fade carousel**

Use `useEmblaCarousel({ loop: media.length > 1, duration: 28 }, [Fade()])`. Inactive slides get `aria-hidden="true"` and no interactive descendants. User navigation updates a polite status; autoplay changes do not spam the live region. Autoplay is an explicit local timer so it can stop permanently on focus, hover, visibility change, interaction, or reduced motion.

- [ ] **Step 4: Write failing lightbox tests and verify RED**

Test `role="dialog"`, close button, Escape, focus trap, body scroll lock, inert background callback, arrow navigation, and focus restoration.

Run: `npm run test --workspace frontend -- src/components/media/LightboxDialog.test.tsx`

Expected: FAIL because expanded-view behavior is not implemented.

- [ ] **Step 5: Implement lightbox and media loading**

Use a portal, focus sentinels or a bounded focus-loop helper, Escape/arrow handlers, body overflow restoration, and an explicit close control. `MediaFrame` renders deliberate image fit/object position and never mounts a full-size source until the gallery is near viewport and the slide is active/adjacent.

- [ ] **Step 6: Verify GREEN**

Run: `npm run test --workspace frontend -- src/components/media && npm run lint --workspace frontend && npm run type-check --workspace frontend`

Expected: all carousel/lightbox tests pass with no lint or type errors.

- [ ] **Step 7: Commit**

```text
git add frontend/src/components/media frontend/src/hooks frontend/src/styles/gallery.css
git commit -m "feat: restore accessible contextual galleries"
```

### Task 4: Implement the shared liquid-glass shell and complete mode routing

**Files:**
- Modify: `frontend/src/main.tsx`
- Replace: `frontend/src/App.tsx`
- Replace: `frontend/src/App.test.tsx`
- Replace: `frontend/src/components/layout/SiteHeader.tsx`
- Modify: `frontend/src/components/layout/SiteFooter.tsx`
- Create: `frontend/src/components/layout/ModeLink.tsx`
- Create: `frontend/src/components/layout/MobileNavigation.tsx`
- Create: `frontend/src/hooks/usePortfolioRoute.ts`
- Create: `frontend/src/hooks/useScrollSpy.ts`
- Create: `frontend/src/components/providers/MotionProvider.tsx`
- Create: `frontend/src/components/providers/SmoothScrollProvider.tsx`
- Modify: `frontend/src/index.css`

**Interfaces:**
- `usePortfolioRoute()` returns `{ mode, navigateMode, announcement }`.
- `navigateMode(mode)` updates `/` or `/visual`, records current scroll, resets intentional switches, restores PopState scroll, updates metadata, and focuses the destination `h1`.
- Header receives current page navigation and keeps the mode switch visible at all widths.

- [ ] **Step 1: Write failing route/shell tests**

Test pathname-derived initial mode, normal-link hrefs, complete nav replacement, History API updates, popstate restoration, destination `h1` focus, live announcement, mobile disclosure, initial section availability, and skip-link behavior.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace frontend -- src/App.test.tsx`

Expected: FAIL because the current application has no page-level mode routing.

- [ ] **Step 3: Implement route state and shared shell**

Derive mode synchronously from `window.location.pathname`; normalize only `/`, `/visual`, and trailing-slash variants. Render keyed page trees inside `AnimatePresence` under a stable `main`. Use `MotionConfig reducedMotion="user"`, `LazyMotion`, and `domAnimation`. Keep route links functional without interception when modifier keys or external targets apply.

- [ ] **Step 4: Implement glass navigation and progressive smooth scroll**

Use semantic links/buttons, scroll spy, visible focus, and a mobile disclosure with Escape/focus return. Use CSS custom properties for warm-black/orange and warm-black/spectral modes. Glass uses `backdrop-filter` with opaque `@supports`, forced-colors, and contrast fallbacks.

Instantiate `ReactLenis` only for desktop fine-pointer users without reduced motion or Save-Data. Use `anchors: true`, `syncTouch: false`; native scrolling remains the baseline.

- [ ] **Step 5: Verify GREEN**

Run: `npm run test --workspace frontend -- src/App.test.tsx && npm run lint --workspace frontend && npm run type-check --workspace frontend`

Expected: all shell/routing tests pass.

- [ ] **Step 6: Commit**

```text
git add frontend/src
git commit -m "feat: add dual portfolio glass shell"
```

### Task 5: Build the complete Software portfolio from the c94 structure

**Files:**
- Replace: `frontend/src/sections/Hero.tsx`
- Replace: `frontend/src/sections/About.tsx`
- Replace: `frontend/src/sections/Experience.tsx`
- Replace: `frontend/src/sections/FeaturedWork.tsx`
- Replace: `frontend/src/sections/Capabilities.tsx`
- Modify: `frontend/src/sections/Contact.tsx`
- Create: `frontend/src/pages/SoftwarePortfolio.tsx`
- Create: `frontend/src/pages/SoftwarePortfolio.test.tsx`
- Create: `frontend/src/components/story/ExperienceChapter.tsx`
- Create: `frontend/src/components/story/ProjectChapter.tsx`
- Create: `frontend/src/styles/software.css`

**Interfaces:**
- `SoftwarePortfolio` renders IDs `software-home`, `software-about`, `software-experience`, `software-work`, `software-capabilities`, and `software-contact` immediately.
- Experience layout variants map exactly to Dily, GridWorks, Flair, Notre Dame, Politiktok, Teaching, and Geoscience.

- [ ] **Step 1: Write failing Software-page tests**

Assert long-form section order, two hero CTAs, proof rail below hero, 13-image About gallery, seven mapped Experience stories, the exact legacy gallery counts, selected work, four capability systems, CV/social/contact links, and absence of an all-images grid or SIGGRAPH copy.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace frontend -- src/pages/SoftwarePortfolio.test.tsx`

Expected: FAIL because the page and restored chapters do not exist.

- [ ] **Step 3: Implement the hero and About chapters**

Build a `90-100svh` typography-led hero with only View Work and Download CV primary actions. Put the four proof metrics immediately after the hero. Restore the 13-entry profile carousel in the asymmetric About composition with 7-second controlled autoplay.

- [ ] **Step 4: Implement the varied Experience sequence**

Use the approved layout mapping: Dily flagship split, GridWorks systems row, Flair alternating chapter, Notre Dame sticky/full-width field chapter with 9-second gallery, Politiktok pinned-media research passage, Teaching compact timeline, Geoscience visual finale. Each story includes real dates, role, contribution, outcome, technologies, and contextual gallery.

- [ ] **Step 5: Implement selected work, capabilities, and contact**

Render six evidence-rich projects without duplicating Experience prose, four capability systems with linked proof, and the existing accessible contact flow with Software context.

- [ ] **Step 6: Verify GREEN and production build**

Run: `npm run test --workspace frontend -- src/pages/SoftwarePortfolio.test.tsx && npm run build --workspace frontend`

Expected: page tests pass and the Software document builds without source-map or asset warnings.

- [ ] **Step 7: Commit**

```text
git add frontend/src/pages frontend/src/sections frontend/src/components/story frontend/src/styles/software.css
git commit -m "feat: rebuild the complete software portfolio"
```

### Task 6: Build the Visual/3D portfolio and bounded real-time hero

**Files:**
- Create: `frontend/src/pages/VisualPortfolio.tsx`
- Create: `frontend/src/pages/VisualPortfolio.test.tsx`
- Create: `frontend/src/visual/VisualHeroScene.tsx`
- Create: `frontend/src/visual/VisualHeroScene.test.tsx`
- Create: `frontend/src/visual/VisualHeroPoster.tsx`
- Create: `frontend/src/visual/TerrainLens.tsx`
- Create: `frontend/src/visual/SpectralField.tsx`
- Create: `frontend/src/hooks/useGraphicsCapability.ts`
- Create: `frontend/src/styles/visual.css`
- Add cleared real captures under: `frontend/src/assets/visual/`

**Interfaces:**
- `VisualPortfolio` renders full sections before the Three chunk resolves.
- `useGraphicsCapability()` returns `poster | low | full` based on WebGL2, Save-Data, reduced motion, and measured runtime fallback.
- `VisualHeroScene` is imported only through `React.lazy` inside the Visual hero.

- [ ] **Step 1: Write failing Visual-page and capability tests**

Test immediate text/CTA/section rendering with the scene import suspended, minimum three real project stories, `/visual` navigation labels, poster-only results for reduced motion/Save-Data/no WebGL2, and absence of unsupported authorship claims.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace frontend -- src/pages/VisualPortfolio.test.tsx src/visual/VisualHeroScene.test.tsx`

Expected: FAIL because the Visual page and graphics capability gate do not exist.

- [ ] **Step 3: Capture and curate real visual-project evidence**

Use existing native project surfaces and current screenshots from the audited repos. Capture missing `playful-balls` media only if the native app can be launched safely. Do not publish screenshots containing secrets, private dashboards, or upstream branding that obscures José's contribution. Create concise captions describing the actual authored work.

- [ ] **Step 4: Implement the complete Visual DOM page**

Build the Visual hero, profile, laboratories, selected visual work, pipeline/capabilities, and mode-specific contact. Use geoscience, the shelving configurator, and cleared Drone Response spatial-autonomy evidence as the minimum launch set; add XR/particle work only when cleared.

- [ ] **Step 5: Implement the terrain-lens hero scene**

Create a deterministic terrain-like geometry derived from the geoscience visual language, one low-resolution `MeshTransmissionMaterial` subject, and a bounded spectral point field. Cap DPR at 1.5, use conservative geometry, render only while visible/interactive, pause on hidden documents, and fall back to the geoscience poster on context loss/error. Do not add heavy post-processing.

- [ ] **Step 6: Verify GREEN and route chunking**

Run: `npm run test --workspace frontend -- src/pages/VisualPortfolio.test.tsx src/visual/VisualHeroScene.test.tsx && npm run build --workspace frontend`

Inspect the Vite manifest/bundle output and verify the Software entry does not statically import the Three/R3F scene chunk.

- [ ] **Step 7: Commit**

```text
git add frontend/src/pages frontend/src/visual frontend/src/hooks frontend/src/styles/visual.css frontend/src/assets/visual
git commit -m "feat: add visual computing portfolio experience"
```

### Task 7: Finish backend routing, route metadata, contact context, and Railway contract

**Files:**
- Modify: `backend/src/contact.ts`
- Modify: `backend/src/contact.test.ts`
- Modify: `backend/src/app.ts`
- Modify: `backend/src/app.test.ts`
- Modify: `frontend/src/sections/Contact.tsx`
- Modify: `frontend/src/sections/Contact.test.tsx`
- Modify: `frontend/index.html`
- Modify: `frontend/visual/index.html`
- Modify: `railway.json`
- Modify: `README.md`
- Modify: `scripts/production-contract.test.mjs`

**Interfaces:**
- `POST /api/contact` accepts the existing payload plus optional validated `portfolioMode: 'software' | 'visual'`.
- Express serves only `/`, `/visual`, `/visual/`, and known documents; missing assets and unknown routes return real 404s.

- [ ] **Step 1: Write failing backend/document-route tests**

Test Software and Visual HTML files at their explicit routes, route-specific canonical/OG content, unknown-route 404, missing-asset 404, health preservation, www redirect, cache policies, valid/invalid contact mode, and same-origin CSP compatibility with Motion/Three assets.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm run test --workspace backend -- src/app.test.ts src/contact.test.ts`

Expected: FAIL because Express currently sends the Software shell for every path and contact rejects mode context.

- [ ] **Step 3: Implement explicit production routing and contact context**

Serve `/` from `dist/index.html`, `/visual` and `/visual/` from `dist/visual/index.html`, preserve asset/API 404s, and return a branded 404 for unknown documents. Validate `portfolioMode` as an optional enum and use it only to label the email subject; never trust it as an address/header.

- [ ] **Step 4: Finalize metadata, structured data, and Railway/runtime policy**

Give each entry truthful title/description/canonical/OG/JSON-LD. Pin Node 24 in root `engines`. Keep Railway health path `/api/health`, single start command, immutable hashed assets, and revalidated HTML/public metadata.

- [ ] **Step 5: Verify GREEN**

Run: `npm test && npm run lint && npm run type-check && npm run build`

Expected: every root/frontend/backend test passes, lint/type-check pass, and both documents build.

- [ ] **Step 6: Commit**

```text
git add backend frontend railway.json package.json README.md scripts
git commit -m "feat: prepare dual portfolio production delivery"
```

### Task 8: Real-browser QA, visual comparison, performance hardening, and Railway deployment

**Files:**
- Create: `frontend/e2e/portfolio.spec.ts`
- Create: `frontend/playwright.config.ts`
- Modify only when a failing regression test identifies a defect.
- Save final screenshots under a git-ignored verification directory.

**Interfaces:**
- Production apex: `https://josecarter.dev/`.
- Visual route: `https://josecarter.dev/visual`.
- Health route: `https://portfolio-cartterr-production.up.railway.app/api/health` or the currently linked Railway domain discovered by the read-only audit.

- [ ] **Step 1: Add failing end-to-end contracts**

Cover Software and Visual direct navigation, full mode replacement, Back/Forward and scroll behavior, mobile navigation, carousel arrows/keyboard/thumbnails, autoplay pause, lightbox focus/Escape, CV/external links, contact success/error, reduced motion, Save-Data poster fallback where supported, and no console/page errors.

- [ ] **Step 2: Run E2E tests against the local production server and verify RED**

Run the built Express server natively, then run: `npm run test:e2e --workspace frontend`.

Expected: initial failures expose any missing browser-only behavior or visual integration defect.

- [ ] **Step 3: Fix each observed defect through a failing regression test**

Keep fixes inside scope. Re-run the focused E2E/unit test after every fix, then run the full suite.

- [ ] **Step 4: Perform matched visual comparison**

Capture Software and Visual at 1440x1000, 768x1024, and 390x844. Compare the new Software screenshots beside the saved `c94ed511...` reference at the same viewport. Verify long-form portfolio density, one-image galleries, real imagery, coherent glass controls, no clipped text, no image walls, and no horizontal overflow. Fix visible mismatches and compare again.

- [ ] **Step 5: Verify performance and accessibility gates**

Run the full local verification fresh:

```text
npm test
npm run lint
npm run type-check
npm run build
npm run test:e2e --workspace frontend
```

Inspect compressed entry/chunk sizes, confirm Three is absent from the Software entry graph, run Lighthouse on both routes under one recorded profile, and document measured results without claiming unmeasured scores.

- [ ] **Step 6: Commit the verified release candidate and push**

```text
git add frontend backend package.json package-lock.json railway.json README.md scripts
git commit -m "test: verify dual portfolio release"
git push origin feat/portfolio-rebuild
```

- [ ] **Step 7: Deploy to the linked Railway production service**

Record the current successful Railway deployment ID/commit as rollback evidence without exposing secrets. Deploy the verified branch using the linked Railway CLI/project configuration. Wait for `SUCCESS`; if build, health, route smoke, or asset smoke fails, immediately redeploy/rollback to the recorded successful deployment.

- [ ] **Step 8: Run production smoke tests**

Verify apex `/`, `/visual`, `/api/health`, both canonical/OG documents, representative hashed assets, CVs, mode links, carousel behavior, browser console, TLS, and one controlled contact delivery when SMTP is configured. Capture final desktop and mobile screenshots for handoff.

- [ ] **Step 9: Final review and deployment commit record**

Run a whole-branch review against the merge base, resolve every Critical/Important finding with tests, then record the deployed commit and production verification in the final handoff without committing secrets or transient deployment IDs.
