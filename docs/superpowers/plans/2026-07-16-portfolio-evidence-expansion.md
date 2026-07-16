# Portfolio Evidence Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add source-backed milestones, credentials, corrected work history, multiple proof links, expanded skills/services, and the SIGGRAPH post asset to the dual portfolio.

**Architecture:** Keep portfolio content in typed data modules. Introduce one reusable link-group component and one Milestones section, then connect them through `PortfolioPage`. Reuse cleared gallery media and add only one new self-authored LinkedIn image.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, authored CSS, native Windows image tooling.

## Global Constraints

- Preserve unrelated dirty-worktree changes.
- Use native Windows tooling only; no Docker, WSL, VMs, or virtualization.
- Never expose LinkedIn authentication data or private employer material.
- Use canonical public URLs and accessible external-link disclosure.
- Follow red-green TDD for every behavior change.

---

### Task 1: Multiple proof links

**Files:**
- Modify: `frontend/src/data/types.ts`
- Create: `frontend/src/components/ui/LinkGroup.tsx`
- Create: `frontend/src/components/ui/LinkGroup.test.tsx`
- Modify: `frontend/src/components/story/ExperienceChapter.tsx`
- Modify: `frontend/src/components/story/ProjectChapter.tsx`
- Modify: `frontend/src/data/software.ts`
- Test: `frontend/src/pages/SoftwarePortfolio.test.tsx`

**Interfaces:**
- Produces: `LinkGroup({ links, label })` and `links?: PortfolioLink[]` on `ExperienceStory` and `ProjectStory`.
- Consumes: existing `PortfolioLink` shape.

- [ ] **Step 1: Write failing link tests**

Add assertions that Dily renders `https://www.dily.cl/` in experience and project, PoliTikTok renders DOI/project/post links, and Drone Response renders site/post links.

- [ ] **Step 2: Verify red**

Run: `npm test -- src/pages/SoftwarePortfolio.test.tsx`

Expected: failures for missing project links and unsupported multiple links.

- [ ] **Step 3: Implement the link-array model and renderer**

```ts
export type ExperienceStory = {
  // existing fields
  links?: PortfolioLink[]
}

export type ProjectStory = {
  // existing fields
  links?: PortfolioLink[]
}
```

```tsx
export function LinkGroup({ links, label }: { links?: PortfolioLink[]; label: string }) {
  if (!links?.length) return null
  return (
    <div aria-label={label} className="software-link-group" role="group">
      {links.map((link) => (
        <a className="software-text-link" href={link.href} key={`${link.label}-${link.href}`}>
          {link.label}
        </a>
      ))}
    </div>
  )
}
```

Migrate all single links to arrays and use `LinkGroup` from both story components.

- [ ] **Step 4: Verify green**

Run: `npm test -- src/components/ui/LinkGroup.test.tsx src/pages/SoftwarePortfolio.test.tsx`

Expected: all selected tests pass.

### Task 2: Milestone data model and section

**Files:**
- Modify: `frontend/src/data/types.ts`
- Modify: `frontend/src/data/software.ts`
- Create: `frontend/src/sections/Milestones.tsx`
- Create: `frontend/src/sections/Milestones.test.tsx`
- Modify: `frontend/src/pages/SoftwarePortfolio.tsx`
- Modify: `frontend/src/pages/SoftwarePortfolio.test.tsx`

**Interfaces:**
- Produces: `MilestoneStory`, `softwarePortfolio.milestones`, and `<Milestones items id />`.
- Consumes: `getMedia(mediaId)` and `LinkGroup`.

- [ ] **Step 1: Write failing milestone tests**

Assert eight milestone articles, the three categories, SIGGRAPH 2026, the PUC degree with distinction,
SA-SGW, Ayudante Senior, Escuela Militar, KHIPU, PoliTikTok publication, and Drone Response presentation.

- [ ] **Step 2: Verify red**

Run: `npm test -- src/sections/Milestones.test.tsx src/pages/SoftwarePortfolio.test.tsx`

Expected: module/section or content assertions fail because Milestones does not exist.

- [ ] **Step 3: Implement typed data and semantic section**

```ts
export type MilestoneStory = {
  id: string
  category: 'Education' | 'Publication & communication' | 'Recognition & community'
  period: string
  title: string
  issuer: string
  summary: string
  skills?: string[]
  mediaId?: string
  links: PortfolioLink[]
}
```

Render a section heading, grouped category label, article image/copy, optional skills, and `LinkGroup`.
Place the section after About on the Software route.

- [ ] **Step 4: Verify green**

Run: `npm test -- src/sections/Milestones.test.tsx src/pages/SoftwarePortfolio.test.tsx`

Expected: selected tests pass.

### Task 3: SIGGRAPH media

**Files:**
- Create: `frontend/src/assets/images/optimized/siggraph-2026-main.webp`
- Create: `frontend/src/assets/images/optimized/siggraph-2026-thumb.webp`
- Modify: `frontend/src/data/media.ts`
- Modify: `frontend/src/data/media.test.ts`

**Interfaces:**
- Produces: media ID `siggraph-2026` owned by José Carter and cleared as a self-authored social-post image.
- Consumes: authenticated LinkedIn post image and the existing media manifest.

- [ ] **Step 1: Write failing media test**

Assert dimensions, story ID `profile`, source `LinkedIn authored post`, publication `approved`, and cleared rights metadata.

- [ ] **Step 2: Verify red**

Run: `npm test -- src/data/media.test.ts`

Expected: `getMedia('siggraph-2026')` throws.

- [ ] **Step 3: Capture and optimize the image**

Use the authenticated authored post's `View image` element, save only the image content, and create a bounded main rendition plus thumbnail without enlarging.

- [ ] **Step 4: Register media**

Add imports and a `PortfolioImageMedia` entry with accurate alt text, caption, dimensions, source, rights, and focal treatment.

- [ ] **Step 5: Verify green**

Run: `npm test -- src/data/media.test.ts`

Expected: media tests pass.

### Task 4: Work history and research copy

**Files:**
- Modify: `frontend/src/data/software.ts`
- Modify: `frontend/src/pages/SoftwarePortfolio.test.tsx`

**Interfaces:**
- Produces: eight accurate experience entries and expanded PoliTikTok evidence.
- Consumes: existing `ExperienceStory` and media IDs.

- [ ] **Step 1: Write failing content assertions**

Assert Dily combined title, Flair August end date, separate PUC and Escuela Militar entries, 6 April 2026,
second publication, transcription filtering, research-ready datasets, political-discourse purpose, and ANID/Fondecyt context.

- [ ] **Step 2: Verify red**

Run: `npm test -- src/pages/SoftwarePortfolio.test.tsx`

Expected: exact content assertions fail.

- [ ] **Step 3: Apply minimal data corrections**

Update the source data without changing component behavior. Keep PUC and Escuela Militar as separate chronological stories and reuse the teaching gallery where appropriate.

- [ ] **Step 4: Verify green**

Run: `npm test -- src/pages/SoftwarePortfolio.test.tsx`

Expected: page tests pass.

### Task 5: Capabilities, services, navigation, and visual positioning

**Files:**
- Modify: `frontend/src/data/types.ts`
- Modify: `frontend/src/data/shared.ts`
- Modify: `frontend/src/data/software.ts`
- Modify: `frontend/src/data/visual.ts`
- Modify: `frontend/src/sections/Capabilities.tsx`
- Modify: `frontend/src/pages/SoftwarePortfolio.test.tsx`
- Modify: `frontend/src/pages/VisualPortfolio.test.tsx`

**Interfaces:**
- Produces: `PortfolioPage.services?: ServiceStory[]`, LeetCode contact link, Milestones navigation, and Visual SIGGRAPH positioning.
- Consumes: existing capabilities and navigation renderers.

- [ ] **Step 1: Write failing service/navigation tests**

Assert LeetCode, Milestones navigation, service headings, missing technology evidence, and SIGGRAPH 2026 on the Visual route.

- [ ] **Step 2: Verify red**

Run: `npm test -- src/pages/SoftwarePortfolio.test.tsx src/pages/VisualPortfolio.test.tsx`

Expected: missing links/content assertions fail.

- [ ] **Step 3: Implement data and rendering**

Add concise service items inside Capabilities, expand the four existing capability groups, add LeetCode to contact links, and update Visual hero/about copy with truthful SIGGRAPH positioning.

- [ ] **Step 4: Verify green**

Run: `npm test -- src/pages/SoftwarePortfolio.test.tsx src/pages/VisualPortfolio.test.tsx`

Expected: selected tests pass.

### Task 6: Styling and final verification

**Files:**
- Modify: `frontend/src/styles/software.css`
- Modify: `frontend/src/styles/visual.css` only if Visual positioning requires layout support.

**Interfaces:**
- Consumes: milestone, link-group, and services class names.
- Produces: responsive editorial layout with no overflow or hover dependency.

- [ ] **Step 1: Add milestone, link-group, and services styles**

Use existing spacing, warm-black surfaces, orange accent, mono labels, focus treatment, and mobile breakpoints. Avoid a generic dashboard-card grid.

- [ ] **Step 2: Run complete automated verification**

Run: `npm test`

Run: `npm run lint`

Run: `npm run type-check`

Run: `npm run build`

Run: `git diff --check`

Expected: every command exits zero; the existing Vite chunk-size advisory may remain informational.

- [ ] **Step 3: Browser verification**

Verify `/` and `/visual` at desktop and mobile widths. Confirm navigation, all proof links, milestone reading order, image crops, focus behavior, and absence of horizontal overflow. Save final screenshots and close the browser session.
