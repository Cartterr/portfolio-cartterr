# Task 7 Report — Production delivery contract

## Status

- Complete.
- Base: `a3edae9`.
- Production routes are explicit: `/` serves the Software document; `/visual` and `/visual/` serve the Visual document.
- Unknown documents and missing assets return real `404` responses; unknown documents receive a branded, `noindex`, `no-store` page.
- Existing API health, canonical-host redirect, CORS, rate limits, parser hardening, CSP, compression, and cache policies remain in place.

## Contact context

- `POST /api/contact` accepts optional `portfolioMode: 'software' | 'visual'`.
- Unknown and non-string mode values are rejected with the existing safe validation response.
- The frontend sends the fixed mode owned by each portfolio page.
- The mode is mapped through a fixed server-side label and used only in the email subject; it is not used as an address or copied into the message body.

## Metadata and runtime

- Software and Visual HTML documents retain distinct title, description, canonical, Open Graph, Twitter, and JSON-LD identities.
- Visual metadata now describes the evidence-backed visual-computing, real-time 3D, scientific-visualization, and simulation work.
- Root `engines.node` is pinned to `24.x`; the lockfile is synchronized.
- Native setup entry points enforce Node 24 and use the root npm workspace install only.
- Railway remains one native npm service with `npm run start` and `/api/health` health gating.
- README now documents Node 24, native npm setup, both document routes, and hard-404 behavior.

## TDD evidence

- RED: `npm run test --workspace backend -- src/app.test.ts src/contact.test.ts` failed with 5 expected failures: two accepted-mode cases, two subject-label cases, and `/visual` returning the old static-directory redirect.
- RED: the focused Contact suite failed because mode context was absent from request bodies.
- RED: the production contract failed on Visual metadata and the Node 24 engine assertion.
- Review RED: production-like Vite hashes missed immutable caching, required React/Motion style attributes were blocked by CSP, the Visual page reused the Software social card, and legacy setup entry points still used the retired package-manager flow.
- GREEN: focused backend suites passed `40/40`; focused Contact suite passed `5/5`; production contract passed `8/8`.
- Review GREEN: real Vite hashes receive immutable caching, CSP keeps stylesheet sources same-origin while allowing required style attributes, HTML revalidates, Visual metadata uses a truthful neutral social asset, and all setup paths are Node 24/npm-only.

## Full root gate

Command:

```powershell
npm test && npm run lint && npm run type-check && npm run build
```

Result: exit `0`.

- Production contract: `8/8` passed.
- Backend: `82/82` passed across 6 files.
- Frontend: `65/65` passed across 13 files.
- ESLint: passed with zero warnings.
- Frontend and backend type checks: passed.
- Backend TypeScript build and dual-entry Vite build: passed.

## Self-review and concerns

- `git diff --check` passed; no secrets or deployment identifiers were added.
- Independent review found no Critical issues; all four Important findings were addressed before the final gate.
- The Visual scene chunk remains above Vite's default 500 kB advisory threshold, and Vite reports plugin timing advisories. The scene is already isolated in its own lazy chunk; these warnings do not fail the production gate.
- The package-lock refresh reported 3 dependency advisories (1 low, 2 moderate). No forced dependency upgrade was applied because it is outside this routing/runtime task.
