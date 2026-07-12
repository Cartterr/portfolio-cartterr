# Dual Portfolio Rework Design

## Status

Approved architecture. Detailed visual checkpoints and the asset-clearance matrix must be reviewed
before implementation planning begins.

This specification replaces the simplified case-study-first direction in
`2026-07-09-portfolio-rebuild-design.md`. The structural source of truth is the portfolio at
commit `c94ed511111254d523051644a36ac25bbe3fcbe3`, upgraded into two complete page-level
identities.

## Objective

Rebuild `josecarter.dev` as a memorable, professional portfolio that communicates José Carter
as both:

1. A software engineer and computer scientist working across production systems, AI, data,
   simulation, and autonomous systems.
2. A creative technologist working across 3D graphics, real-time rendering, XR, simulation,
   visual computing, and VFX-adjacent pipelines.

The experience must create an immediate sense of technical range and visual ambition while
remaining credible, navigable, fast, and useful to recruiters, engineering leaders, founders,
creative studios, research teams, and potential freelance clients.

The site is not a conference microsite, a résumé template, a sparse landing page, or an image
archive. It is a long-form portfolio with contextual visual evidence.

## Non-negotiable product decisions

- Preserve the complete portfolio rhythm of `c94ed511...`: navigation, hero, About, Experience,
  Selected Work, Capabilities, Contact, and footer.
- Restore all 57 previously used gallery entries and place them in their original professional,
  academic, teaching, research, or personal context. Before publication, record their rights,
  sensitivity, and publication status. If a newly discovered legal, privacy, or employer restriction
  blocks an entry, replace it contextually and obtain user approval rather than silently omitting it.
- Never display the legacy media as a contact sheet, masonry wall, or all-at-once collage.
- Use one dominant image at a time inside each gallery, with crossfade, restrained image motion,
  arrows, counter, thumbnail navigation, and an accessible expanded view.
- Provide two complete identities: `Software` and `Visual / 3D`. The full visual-page positioning is
  `VFX, 3D & Visual Computing`, with copy that distinguishes demonstrated visual-computing work from
  future VFX opportunities.
- Switching identity replaces the entire page tree: navigation, hero, sections, content,
  projects, capabilities, visuals, accent system, and contact positioning.
- Keep both identities recognizably part of the same personal brand.
- Do not mention, brand, or optimize copy around SIGGRAPH anywhere on the public site.
- Use only work José can represent honestly. Upstream samples must not be claimed as original
  work, and the unpublished `3d-daniel` material remains excluded until publication rights are
  confirmed.
- Use native Windows tooling only. Do not introduce Docker, WSL, VMs, or virtualization.

## Experience model

### Routes and mode switching

- `/` is the canonical Software portfolio.
- `/visual` is the canonical VFX / 3D / Visual Computing portfolio.
- A persistent two-option mode switch appears in the primary header at every viewport size.
- The switch updates browser history without a document reload and supports Back/Forward.
- The current page tree exits before the next tree enters. The header shell remains visually
  continuous, but its navigation items and accent state update with the destination mode.
- Vite builds two HTML entries: `/index.html` and `/visual/index.html`. Each entry has its own title,
  description, canonical URL, Open Graph copy, and structured-data emphasis while hydrating the same
  shared React application.
- A direct visit to `/visual` must render the visual identity immediately rather than flashing
  the Software page first.
- Mode selection is derived from the pathname before the first React render. The mode control uses
  normal links enhanced by History API navigation, so it remains a valid destination without the
  client transition.
- Each HTML entry contains a concise `noscript` identity, direct contact method, CV link, and link to
  the other portfolio. Full no-JavaScript rendering is not a launch requirement.
- On an intentional mode switch, scroll resets to the top and focus moves to the destination `h1`
  after the transition. The change is announced through a polite live region.
- Browser Back/Forward restores the previous route and stored scroll position. Hash navigation waits
  for the destination tree to mount before scrolling and moving focus to the target heading.

### Shared header

The header expands the successful `c94ed511...` floating navigation pattern.

- Left: portrait mark, `José Carter`, and a concise current role label.
- Center: scroll-spy navigation for the active mode.
- Right: the Software / Visual mode switch. Do not add an availability indicator unless the final
  content explicitly establishes a truthful current status.
- Desktop: a floating, optically layered bar with a maximum width aligned to the page grid.
- Mobile: a compact top bar with the mode switch always visible and navigation in an accessible
  disclosure panel.
- A thin scroll-progress treatment belongs to the header rather than becoming a separate
  decorative object.
- Glass is used here as a functional navigation material: translucent fill, blur/saturation,
  refractive highlight, hairline border, dark shadow, and an opaque fallback.

## Software portfolio

The Software mode retains the exact density and professional completeness that made
`c94ed511...` feel like a portfolio.

### 1. Software hero

- Height: approximately `90-100svh` on desktop, content-driven on smaller screens.
- Large two-line positioning statement, short supporting paragraph, location/availability, and
  two primary actions: view work and download CV.
- The initial viewport contains no grid of four focus cards and no four-way CTA cluster.
- A restrained proof rail begins immediately after the hero rather than inside the first viewport.
  It introduces four verified signals without competing with the headline:
  50% HVAC energy reduction, 100k+ research records, 15x simulation speedup, and 14+ teaching or
  mentoring roles.
- Visual impact comes from typography, layered depth, controlled reveal, a subtle optical field,
  and the floating navigation—not from exposing multiple photographs at once.

### 2. About / personal context

- Asymmetric two-column chapter based on the original About section.
- Left: the restored 13-entry profile carousel in a tall cinematic frame.
- Right: biography, current positioning, international/research context, selected interests, and
  four compact proof metrics.
- The carousel retains the personal character of the old page while using stronger crops,
  consistent captions, and a controlled 7-second autoplay with an explicit pause control.
- Autoplay stops on hover, focus, manual interaction, page invisibility, and reduced motion.

### 3. Experience

- Seven substantial professional/research/teaching stories remain the backbone of the page.
- Preserve dates, organizations, role, concise context, contribution, outcomes, and technologies.
- Pair each eligible story with its contextual gallery:
  - Dily: 3 entries.
  - GridWorks: 2 entries.
  - Flair: 4 entries.
  - Notre Dame / Drone Response: 9 entries.
  - Politiktok: 12 entries.
  - Teaching: 5 entries.
  - Geoscience: 9 entries.
- The stories do not repeat one identical rounded-card template. Use a deliberate sequence:
  - Dily: flagship split chapter with the gallery occupying the wider column.
  - GridWorks: compact dark systems row with evidence and a contained interface carousel.
  - Flair: alternating media/text energy-platform chapter.
  - Notre Dame: full-width field chapter with a sticky narrative column and featured gallery.
  - Politiktok: pinned-media research passage with progressive findings.
  - Teaching: compact multi-role timeline with one shared gallery.
  - Geoscience: full-width visual research finale bridging to the Visual portfolio.
- Notre Dame retains its slower 9-second gallery sequence. All other experience galleries are
  manually advanced unless the user explicitly starts playback.

### 4. Selected software work

- Present four to six strongest engineering case studies as real portfolio work rather than
  text-only project cards.
- Initial set: GridWorks alerting migration, Notre Dame mission planning, Politiktok research
  infrastructure, CUDA geoscience simulation, Dily fintech systems, and Flair energy systems.
- Each case study communicates context, role, constraints, contribution, outcome, technologies,
  visual evidence, and verified public link when one exists.
- Projects that substantially overlap an Experience story use a different view: architecture,
  decision, result, or interface evidence rather than duplicate prose.

### 5. Software capabilities

- Replace the 66-tag wall with four legible capability systems:
  - Product and platform engineering.
  - AI, data, and research infrastructure.
  - Simulation, GPU, and scientific computing.
  - Production, autonomy, and connected systems.
- Each group contains a short positioning statement, representative tools, and linked proof from
  projects or experience.
- Technology names remain supporting evidence, not the main visual content.

### 6. Software contact

- Headline focuses on engineering, AI, research infrastructure, scientific computing, and
  autonomous systems.
- Preserve email, LinkedIn, GitHub, CV, and the real contact form.
- The form remains same-origin, accessible, rate-limited, and backed by the existing Railway
  service.

## Visual / 3D portfolio

The Visual mode is a complete page, not a themed hero followed by Software content.

### 1. Visual hero

- Height: approximately `100svh` on desktop.
- Positioning: creative technologist building real-time graphics, simulation, XR, interactive 3D,
  and visual-computing systems.
- One lazy-loaded React Three Fiber scene provides the signature moment: a refractive terrain-like
  form derived from José's geoscience and simulation visual language, intersected by a controlled
  spectral particle field. It reacts gently to pointer input and the first portion of scroll.
- The scene supports the text and never obscures it. It must have a designed static poster and
  CSS fallback.
- Primary actions: explore visual work and discuss a visual/interactive project.
- No demo-reel claims, film-credit claims, or studio-language claims that are not supported by
  the work.

### 2. Visual profile

- Introduce the bridge between computer science, graphics, simulation, and artistic tooling.
- Use one contained carousel drawing from relevant profile, fieldwork, lab, XR, and event media.
- Include a concise statement of the visual problems José can help solve: interactive product
  visualization, technical 3D prototypes, simulation visuals, real-time installations, XR
  experiences, graphics programming, and pipeline tooling.

### 3. Visual experience and laboratories

- Long-form chapters for the strongest visual-computing evidence:
  - 3D Marga-Marga geoscience model and 1,000-year simulation work.
  - Autonomous drone / spatial mission-planning research.
  - XR teaching and experimentation.
  - GPU and real-time graphics exploration.
- These chapters may reuse relevant legacy images because their context is different, but they
  must link back to the same truthful underlying role and outcome.

### 4. Selected visual work

- Minimum launch set:
  - Marga-Marga 3D geoscience and simulation pipeline.
  - Parametric Three.js / React Three Fiber shelving configurator.
  - Electron / Matter.js Newton's cradle desktop physics overlay.
- Additional launch work when its capture and contribution audit pass:
  - Native OpenXR / D3D11 / Unreal experimentation from `xr-home-suite`, with original contributions
    separated explicitly from upstream samples.
  - `playful-balls` 5,000-particle D3D11/HLSL desktop fluid overlay after a representative capture
    is produced.
- Each visual project uses a contained carousel or media stage. Video, before/after, viewport
  recording, wireframe, shaded result, or process frames are shown only when real assets exist.
- Repositories derived from upstream vendor samples are labeled as experiments or integrations,
  with original contributions described precisely.

### 5. Visual process and capabilities

- Show an end-to-end visual-computing pipeline rather than a decorative software-logo cloud:
  research and reference, modeling/geometry, simulation, shading/rendering, real-time integration,
  optimization, and delivery.
- Representative tools are included only where supported by work: Blender, Houdini, Three.js,
  React Three Fiber, WebGL, HLSL, D3D11, Unreal, OpenXR, CUDA, Python, and scientific meshing tools.
- The section uses real process frames and concise explanations, not invented diagrams.

### 6. Visual contact

- Headline focuses on visual computing, interactive 3D, graphics prototypes, simulation, XR, and
  VFX-adjacent technical work.
- Provide direct email and the shared contact form with mode-specific subject/context metadata.
- Do not promise services beyond demonstrated or reasonably supported capabilities.

## Gallery system

The rebuilt gallery preserves the character of the original component while fixing its technical
and accessibility weaknesses.

- Embla Carousel v8 provides slide state and input handling; the Fade plugin provides the
  one-image-at-a-time transition.
- Only active, previous, and next media receive full-resolution sources. Other thumbnails remain
  lightweight until they approach selection.
- Every gallery supports:
  - Native Previous and Next buttons.
  - Keyboard navigation.
  - `n of total` status.
  - Thumbnail rail with active-state visibility.
  - Image caption and story label.
  - Optional playback with visible Pause/Play.
  - Pointer swipe and touch swipe without blocking page scroll.
  - Accessible lightbox dialog with close button, Escape, focus trap, focus restoration, and
    keyboard navigation.
- Autoplay never restarts automatically after focus or manual interaction.
- Reduced motion removes image panning and uses a short opacity change or instant replacement.
- Original aspect ratios are respected. Portraits, landscapes, and interface screenshots use
  deliberate object positioning rather than a single destructive crop rule.

## Visual system

### Brand continuity

- Preserve the original warm-black canvas and warm-white typography.
- Software accent: restrained warm orange derived from the original portfolio.
- Visual accent: the original unused cyan/violet token family, refined into a spectral highlight.
- The identities share typography, grid, spacing, header geometry, gallery controls, and contact
  language, so the switch feels like changing lenses rather than visiting another person's site.

### Typography

- Restore self-hosted variable Space Grotesk as the primary display and interface face.
- Restore IBM Plex Mono for dates, labels, gallery counts, and technical metadata.
- Hero display scale: fluid `clamp()` sizing with a practical desktop ceiling, tight line height,
  and no text clipping at 200% browser zoom.
- Body copy remains comfortably readable at 17-20px with controlled line length.

### Grid and spacing

- Main desktop canvas: `min(92vw, 1520px)`.
- Reading copy stays narrower inside the wide canvas.
- Standard vertical chapter spacing: roughly 120-180px desktop and 80-112px mobile.
- Major chapters approach viewport scale but remain content-driven; do not force content into
  inaccessible fixed heights.
- Radii use a controlled 20/28/36px system rather than arbitrary values on every component.

### Liquid-material rules

- Liquid glass is a functional material for the header, mode switch, carousel controls, captions,
  primary buttons, and occasional floating metadata.
- Large text cards and every content section must not become translucent blur panels.
- Baseline implementation uses CSS `backdrop-filter`, translucent neutral fill, saturation,
  hairline borders, inset highlights, and layered shadows.
- `@supports` and forced-colors/high-contrast fallbacks produce opaque readable surfaces.
- The only true scene refraction is the selective Drei transmission material in the Visual hero.
- Do not add novelty liquid-glass React packages with expensive screenshot initialization,
  browser-specific displacement failures, or weak maintenance signals.

## Motion system

- Motion for React is the orchestration layer.
- Wrap the experience in `MotionConfig reducedMotion="user"`.
- Use `LazyMotion` with `domAnimation` for the normal interface path.
- Mode switch: keyed page trees under a stable `main` shell, approximately 350-500ms total. The
  outgoing tree fades/depth-shifts while the destination DOM enters; the shell maintains page
  continuity and the Three scene remains behind its own lazy boundary.
- Section entrances: short opacity/translate reveals with limited stagger. Content must never wait
  for an animation before becoming accessible.
- Scroll-linked motion is limited to progress, subtle hero depth, and selected pinned chapters.
- Do not add a custom cursor, perpetual card floating, scroll-jacking, or large parallax on body
  copy.
- Reduced motion disables transforms, autoplay, parallax, and continuous WebGL response while
  preserving state clarity through opacity or instant changes.

## Smooth scrolling

- Lenis is installed as a removable progressive enhancement for capable desktop devices.
- It retains native document scroll, anchors, sticky positioning, and keyboard semantics.
- Keep touch/mobile scrolling native (`syncTouch: false`).
- Configure `anchors: true` and coordinate cross-route hashes after the destination tree mounts.
- Do not instantiate Lenis when reduced motion is requested.
- Anchors remain functional and URL-addressable with or without Lenis.

## 3D runtime

- Three.js, React Three Fiber 9, and Drei power the Visual hero only.
- The Visual DOM shell renders immediately. Only `VisualHeroScene` and its graphics dependencies are
  code-split behind Suspense and an Error Boundary.
- Canvas defaults: DPR capped to `1-1.5`, adaptive quality, conservative geometry/material count,
  and no heavy post-processing by default.
- Prefer on-demand rendering when the scene is idle; pause rendering when offscreen or when the
  document is hidden.
- Transmission material uses deliberately low samples/resolution and only one primary refractive
  subject.
- Never mount WebGL when WebGL2 is unavailable, `Save-Data` is enabled, or reduced motion is
  requested. Use the designed poster instead. When available, device-memory/concurrency hints can
  select a lower baseline but never act as the only failure gate.
- Provide an Error Boundary, loading state, static poster, WebGL failure fallback, adaptive quality,
  and document-visibility pause. Drei PerformanceMonitor can lower DPR/effects after measured
  degradation rather than guessing from user agent.
- No audio autoplay and no interaction required to reach the page content.

## Responsive behavior

- Validate at minimum: 1600x1000, 1440x1000, 1024x768, 768x1024, 430x932, and 390x844.
- Wide split chapters collapse into readable single-column sequences while keeping media adjacent
  to its story.
- Mobile galleries remain one-image stages with large native controls and a horizontally
  scrollable thumbnail rail.
- Mode selection remains visible on mobile and never moves exclusively into the navigation menu.
- No horizontal page overflow, clipped headings, inaccessible pinned content, or hover-only
  information.
- At 200% zoom, navigation, mode selection, galleries, and contact remain usable.

## Required visual checkpoints before implementation

Implementation does not begin from prose alone. The design pass must produce and compare the
following checkpoints against the captured `c94ed511...` reference at the same viewport:

1. Software desktop at 1440x1000: floating header, simplified hero, and the beginning of the proof
   rail.
2. Software desktop long-page overview: About carousel, mapped Experience chapter sequence,
   Selected Work, capabilities, and contact.
3. Visual desktop at 1440x1000: matching header shell, Visual mode selected, immediate DOM hero
   content, poster/3D stage composition, and first transition into Visual Profile.
4. Visual desktop long-page overview: visual laboratories, minimum launch work, pipeline, and
   contact.
5. Software and Visual mobile at 390x844: persistent mode switch, menu state, hero hierarchy,
   single-image gallery stage, thumbnails, and contact controls.
6. Shared gallery/lightbox detail: default, focus, active thumbnail, paused autoplay, and expanded
   dialog states.

The checkpoints must use the real Space Grotesk/IBM Plex typography, actual cleared photographs or
project captures, the documented warm-black/orange and warm-black/spectral systems, and measured
component dimensions. Generated placeholder imagery, image walls, fake dashboards, or conference
branding invalidate the checkpoint. The user reviews these checkpoints before the implementation
plan is executed.

## Accessibility

- Semantic landmarks, skip link, logical heading order, current-section navigation state, visible
  focus, and minimum 44px targets.
- Every carousel follows the WAI carousel pattern with labeled regions, slide position, and pause
  behavior.
- Lightboxes use real dialog semantics and restore focus to the invoking control.
- Decorative 3D is hidden from the accessibility tree; equivalent page meaning exists in text.
- Contact errors are connected to fields and announced; success/failure status uses `aria-live`.
- Meet WCAG AA contrast in both the transparent and opaque glass states.
- Support `prefers-reduced-motion`, forced colors, increased contrast, and reduced transparency
  fallbacks where the browser exposes them.

## Content and asset architecture

- Use typed data modules for shared identity, Software content, Visual content, projects,
  experiences, capabilities, and galleries.
- Maintain a single gallery manifest that records media source, optimized variants, dimensions,
  alt text, caption, story ownership, rights owner/source, publication status, sensitivity review,
  fit mode, focal point/object position, and replacement decision when applicable.
- Generate responsive AVIF, WebP, and JPEG source sets at build time with `vite-imagetools`.
- Use bounded renditions: thumbnails at 160/240px and content media at approximately
  640/960/1440px, with `withoutEnlargement`. Do not generate every width/format combination for tiny
  originals.
- The initial LCP asset alone is eager/high priority. Below-fold and inactive gallery media are
  lazy/async and size-stable.
- New visual-project screenshots and recordings must be captured from the real project surface.
- Do not publish personal identity documents, secrets, private dashboards, unreleased employer
  material, or assets with unclear rights.

## Technical stack

- Native Node.js 24 LTS and npm on Windows.
- React and React DOM pinned to the React 19.2 line so the stable R3F 9 peer range cannot drift to an
  incompatible future minor.
- Vite 8 with the React plugin.
- TypeScript 5.9 initially, avoiding a simultaneous unnecessary TypeScript 7 and lint-stack
  migration.
- Motion 12 via `motion/react`.
- Three.js and `@types/three` 0.185, React Three Fiber 9.6, and Drei 10.7 stable lines, pinned as one
  compatible graphics set.
- Embla Carousel React and Fade 8.6 stable lines.
- Lenis 1.3.
- `vite-imagetools` 10.
- Vitest 4, Testing Library React 16, Testing Library DOM 10, user-event 14, and jsdom 29 for React
  19/Vite 8 compatibility.
- ESLint 8.57 or a deliberate current flat-config migration with typescript-eslint 8; do not retain
  the unsupported ESLint 8.53/typescript-eslint 6 pairing.
- Tailwind CSS 4 for grid, tokens, and responsive layout, with dedicated authored CSS for optical
  glass, galleries, typography, and the 3D stage. Avoid arbitrary one-off utility values replacing
  the documented design tokens.
- Existing Express service for health, contact, static production hosting, and SPA route fallback.
- Existing single Railway service; no containers are required or permitted for this workflow.
- npm is the only package manager and lockfile authority. Remove obsolete Yarn lockfiles and update
  all root/frontend/backend scripts atomically during the migration.

## Backend, routing, and deployment

- Preserve `GET /api/health` and the hardened `POST /api/contact` contract.
- Express serves the Software HTML entry for `/` and the Visual HTML entry for `/visual`, then uses
  an explicit allowlisted fallback for client-side navigation while preserving real asset and API
  404 behavior.
- Railway starts one production Express process and gates activation on `/api/health`.
- Hashed assets receive long immutable caching; HTML and public metadata revalidate.
- Preserve the current live deployment as a rollback point until the new version passes all
  production gates.
- Deployment requires successful Railway build/health, apex and `/visual` 200 responses, valid
  TLS, working static assets, working contact delivery, and no new console/runtime errors.

## Quality and performance targets

- Full local test, lint, type-check, and production build pass.
- Under the pinned Lighthouse/profile used by verification, Software route targets are Performance
  95+, Accessibility 100, Best Practices 100, and SEO 100. Visual route targets are Performance 90+
  mobile and 95+ desktop, Accessibility 100, Best Practices 100, and SEO 100. Scores are targets;
  Core Web Vitals, transfer budgets, and functional checks are the hard gates.
- Mobile LCP below 2.5s, CLS below 0.1, and INP below 200ms under the tested profile.
- Initial compressed JavaScript target: no more than 190KB on Software and 220KB for the Visual DOM
  shell before the graphics chunk. The lazy graphics chunk target is no more than 400KB compressed.
- Initial fonts target: no more than 150KB compressed. The LCP image target is no more than 300KB;
  a normal gallery main rendition should remain below 450KB unless visual QA proves the exception.
- Visual hero text and CTA render before the Three.js chunk is interactive.
- No Three.js, R3F, or visual-scene payload is requested on the Software route before the user
  selects Visual or explicitly signals intent by hovering/focusing the mode link after page load.
  Do not prefetch it for Save-Data, slow effective connections, hidden tabs, reduced motion, or
  poster-only clients.
- Gallery navigation, mode switching, mobile menu, CV, external links, contact form, and browser
  Back/Forward are covered by automated or browser-level verification.

## Acceptance criteria

The design is complete when:

1. Both routes feel like full, professional portfolios with the structural completeness of
   `c94ed511...`.
2. Switching modes visibly replaces the entire identity while preserving a coherent personal
   brand.
3. All 57 legacy gallery entries complete the asset-clearance matrix and are restored contextually;
   any blocked asset has a user-approved contextual replacement. They never appear as an image wall.
4. The Visual route contains honest, substantial 3D/graphics/XR/simulation work and a reliable
   real-time centerpiece with graceful fallbacks.
5. Liquid glass materially improves navigation and control hierarchy without reducing content
   legibility or becoming a blanket style.
6. Motion feels cinematic and controlled, respects accessibility settings, and does not make the
   site harder to navigate.
7. The site works at the required viewports, passes quality gates, deploys safely to Railway, and
   preserves a verified rollback path.
