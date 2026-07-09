# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current portfolio with a concise, case-study-first experience for hiring leaders and deploy it safely to the existing Railway service.

**Architecture:** Keep the proven React/Vite frontend and Express production server. Drive the UI from one typed portfolio model, render all sections eagerly, keep only a small same-origin contact API, and use Railway health checks for zero-downtime cutover.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Vitest, Testing Library, Express, Nodemailer, Railway Nixpacks.

## Global Constraints

- Use native Windows tooling only; do not use Docker, WSL, virtual machines, or virtualization.
- Preserve the discounts dashboard on `wip/discount-dashboard-preserved-2026-07-09` and implement only on `feat/portfolio-rebuild`.
- Primary positioning is exactly: `Software engineer building reliable AI, data, and autonomous systems.`
- The audience is engineering managers, technical recruiters, and founders hiring for high-impact software/AI roles.
- Use real existing project/event assets only; no generated decorative art, fake diagrams, or handcrafted SVG illustrations.
- Keep `GET /api/health` and `POST /api/contact`; remove the unused `/api/portfolio-data` endpoint.
- Keep the existing Railway project/service, Nixpacks builder, repository-root build, and single Express process.
- Do not expose SMTP, Railway, Porkbun, or other secret values in files, logs, commits, or chat.
- Quality gate: deployed Lighthouse Performance 95+, Accessibility 100, Best Practices 100, SEO 100; mobile LCP <2.5s and CLS <0.1.

---

### Task 1: Typed content model and frontend test harness

**Files:**
- Create: `frontend/src/data/portfolio.ts`
- Create: `frontend/src/data/portfolio.test.ts`
- Create: `frontend/src/test/setup.ts`
- Modify: `frontend/package.json`
- Modify: `frontend/vite.config.ts`

**Interfaces:**
- Produces: `PortfolioContent`, `CaseStudy`, `ExperienceItem`, `CapabilityGroup`, and `portfolioContent`.
- `CaseStudy` contains `slug`, `title`, `eyebrow`, `role`, `summary`, `problem`, `contribution`, `outcome`, `technologies`, `image`, `imageAlt`, and optional `link`.

- [ ] **Step 1: Add Vitest and Testing Library dependencies and scripts**

Add `test: "vitest run"` and `test:watch: "vitest"`; add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` as dev dependencies.

- [ ] **Step 2: Write the failing content-contract test**

```ts
import { describe, expect, it } from 'vitest'
import { portfolioContent } from './portfolio'

describe('portfolioContent', () => {
  it('leads with one focused positioning statement and four complete case studies', () => {
    expect(portfolioContent.hero.title).toBe(
      'Software engineer building reliable AI, data, and autonomous systems.',
    )
    expect(portfolioContent.caseStudies).toHaveLength(4)
    for (const study of portfolioContent.caseStudies) {
      expect(study.problem.length).toBeGreaterThan(30)
      expect(study.contribution.length).toBeGreaterThan(30)
      expect(study.outcome.length).toBeGreaterThan(15)
      expect(study.imageAlt.length).toBeGreaterThan(10)
    }
  })
})
```

- [ ] **Step 3: Run the test and verify RED**

Run: `yarn test frontend/src/data/portfolio.test.ts`

Expected: FAIL because `./portfolio` does not exist.

- [ ] **Step 4: Implement the typed content model**

Create the exact exported interfaces above and populate the hero, four metrics, four case studies, compact experience, three capability groups, about copy, contact links, and existing verified URLs from the committed portfolio content. Use `satisfies PortfolioContent` so missing fields fail compilation.

- [ ] **Step 5: Run tests and type checking**

Run: `yarn test && yarn build`

Expected: all content tests pass and TypeScript compiles.

- [ ] **Step 6: Commit**

```text
git add frontend/package.json frontend/yarn.lock frontend/vite.config.ts frontend/src/data frontend/src/test
git commit -m "test: define portfolio content contract"
```

### Task 2: Rebuild the portfolio experience

**Files:**
- Create: `frontend/src/components/layout/SiteHeader.tsx`
- Create: `frontend/src/components/layout/SiteFooter.tsx`
- Create: `frontend/src/components/ui/ArrowLink.tsx`
- Create: `frontend/src/components/ui/Metric.tsx`
- Create: `frontend/src/sections/Hero.tsx`
- Create: `frontend/src/sections/FeaturedWork.tsx`
- Create: `frontend/src/sections/Experience.tsx`
- Create: `frontend/src/sections/About.tsx`
- Create: `frontend/src/sections/Capabilities.tsx`
- Create: `frontend/src/sections/Contact.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/index.css`
- Create: `frontend/src/App.test.tsx`

**Interfaces:**
- Consumes: `portfolioContent` from Task 1.
- Produces: anchors `#work`, `#experience`, `#about`, and `#contact` present at initial render.

- [ ] **Step 1: Write the failing semantic-page test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('renders one focused hero and every primary navigation target immediately', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Software engineer building reliable AI, data, and autonomous systems.',
    )
    for (const id of ['work', 'experience', 'about', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main')
  })
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `yarn test frontend/src/App.test.tsx`

Expected: FAIL because the current hero text and anchor structure differ.

- [ ] **Step 3: Implement the new structure and design system**

Replace the old navigation, hero, About, gallery-heavy Experience, Projects, Skills, scroll progress, and lazy below-fold tree. Render a semantic `header`, `main#main`, sections in the approved order, and footer. Use the design tokens and visual rules from the design spec; keep major components below roughly 180 lines.

- [ ] **Step 4: Curate media**

Use only existing optimized WebP images for the four case studies and two About images. Supply explicit width/height, descriptive alt text, `loading="lazy"` below the fold, and `fetchPriority="high"` only for the hero image. Do not import the old gallery manifest into the new page.

- [ ] **Step 5: Verify GREEN and responsive CSS**

Run: `yarn test && yarn lint && yarn build`

Expected: tests, ESLint, and Vite production build pass with no warnings from application code.

- [ ] **Step 6: Commit**

```text
git add frontend/src
git commit -m "feat: rebuild portfolio around case studies"
```

### Task 3: Harden the contact flow with test-first API behavior

**Files:**
- Create: `backend/src/contact.ts`
- Create: `backend/src/app.ts`
- Create: `backend/src/contact.test.ts`
- Modify: `backend/src/server.ts`
- Modify: `backend/package.json`
- Modify: `frontend/src/sections/Contact.tsx`
- Create: `frontend/src/sections/Contact.test.tsx`

**Interfaces:**
- `validateContactPayload(input: unknown): ContactValidationResult`
- `createApp(options?: { sendContactEmail?: (message: ContactMessage) => Promise<void> }): Express`
- `POST /api/contact` accepts `{ name, email, message, website? }` and returns `{ success, message }`.

- [ ] **Step 1: Write failing backend validation tests**

Test a valid trimmed payload, missing fields, invalid email, overlong input, and a populated honeypot. The honeypot response must be a generic success without invoking mail delivery.

- [ ] **Step 2: Run backend tests and verify RED**

Run: `yarn test`

Expected: FAIL because `contact.ts` and `createApp` do not exist.

- [ ] **Step 3: Implement validation and injectable app creation**

Use maximum lengths of 80 characters for name, 254 for email, and 4000 for message. Trim before validation, never log message content, retain rate limiting, CORS, Helmet, compression, and SMTP environment-variable use. Keep `server.ts` to process startup only.

- [ ] **Step 4: Write the failing accessible-contact test**

```tsx
render(<Contact />)
await user.type(screen.getByLabelText(/name/i), 'José')
await user.type(screen.getByLabelText(/email/i), 'jose@example.com')
await user.type(screen.getByLabelText(/message/i), 'Hello from the portfolio test.')
await user.click(screen.getByRole('button', { name: /send message/i }))
expect(await screen.findByRole('status')).toHaveTextContent(/message sent/i)
```

- [ ] **Step 5: Implement the contact UI**

Add explicit labels, autocomplete attributes, a visually hidden honeypot, disabled/submitting state, inline validation, and an `aria-live` status. Keep direct email as the primary fallback.

- [ ] **Step 6: Verify both packages and commit**

Run: `yarn test && yarn type-check` in `backend`, then `yarn test && yarn lint && yarn build` in `frontend`.

```text
git add backend frontend/src/sections/Contact.tsx frontend/src/sections/Contact.test.tsx
git commit -m "feat: harden portfolio contact flow"
```

### Task 4: SEO, caching, and Railway deployment contract

**Files:**
- Modify: `frontend/index.html`
- Create: `frontend/public/favicon.png`
- Create: `frontend/public/og-preview.png`
- Modify: `backend/src/app.ts`
- Create: `railway.json`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Railway starts with `npm run start` and gates activation on `GET /api/health` returning 200 within 100 seconds.
- HTML and non-hashed public files use revalidation; `/assets/*` uses one-year immutable caching.

- [ ] **Step 1: Write failing server tests for canonical hosts and caching**

Verify `www.josecarter.dev` returns a 308 apex redirect, Railway-domain `/api/health` remains 200, and built `/assets/*` responses contain `public, max-age=31536000, immutable`.

- [ ] **Step 2: Implement host and cache behavior**

Set `trust proxy`, preserve `/api/*`, redirect only public HTML traffic from the Railway service domain, and redirect all `www` traffic to apex with method-preserving 308 semantics.

- [ ] **Step 3: Update metadata and structured data**

Use the exact primary positioning in title/description/OG metadata, keep canonical `https://josecarter.dev/`, reference PNG social imagery, add `Person` and `WebSite` JSON-LD, and replace the inline SVG favicon with the real PNG asset.

- [ ] **Step 4: Add Railway config-as-code**

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  }
}
```

- [ ] **Step 5: Normalize scripts and documentation**

Add working root `test`, `lint`, and `type-check` scripts. Document the native Windows development/build flow and current Railway deployment path; do not document Docker as the preferred workflow.

- [ ] **Step 6: Verify and commit**

Run: `npm run test && npm run lint && npm run type-check && npm run build`.

```text
git add railway.json package.json README.md frontend backend
git commit -m "chore: prepare portfolio for safe Railway deployment"
```

### Task 5: Browser QA, production deployment, domain repair, and rollback gate

**Files:**
- Modify only when verification reveals a defect covered by a failing regression test.

**Interfaces:**
- Production apex: `https://josecarter.dev/`
- Railway health: `https://portfolio-cartterr-production.up.railway.app/api/health`

- [ ] **Step 1: Run full local verification**

Run: `npm run test && npm run lint && npm run type-check && npm run build`.

Start production mode with `NODE_ENV=production` and verify `/`, `/api/health`, both CV files, all internal anchors, and representative static assets.

- [ ] **Step 2: Perform browser QA**

Inspect 1440x1000, 768x1024, and 390x844. Verify navigation, reading order, focus visibility, no horizontal overflow, reduced-motion behavior, external links, CV download, contact success/error states, and no console errors.

- [ ] **Step 3: Produce social-preview PNG from the finished visual system**

Capture a dedicated 1200x630 preview surface using the in-app browser, inspect the saved PNG, then wire it to metadata. Do not ship the old SVG preview.

- [ ] **Step 4: Create a rollback point and push the feature branch**

Tag production commit `c94ed511` as `portfolio-pre-rebuild-2026-07-09`, push `feat/portfolio-rebuild`, and use a Railway PR environment when available.

- [ ] **Step 5: Deploy and verify**

Merge/push only after review. Require Railway `SUCCESS`, apex 200, health 200, canonical apex, immutable hashed assets, valid CV links, no console errors, and one real contact delivery.

- [ ] **Step 6: Repair `www` and confirm TLS**

Publish Railway's exact `_railway-verify.www` TXT value through the authorized Porkbun account/API, wait for Railway ownership verification and certificate issuance, and verify `https://www.josecarter.dev/` resolves with valid TLS then redirects to apex.

- [ ] **Step 7: Roll back on any failed gate**

Use Railway's rollback action immediately if the production smoke test fails. The durable source rollback is tag `portfolio-pre-rebuild-2026-07-09` at `c94ed511`.
