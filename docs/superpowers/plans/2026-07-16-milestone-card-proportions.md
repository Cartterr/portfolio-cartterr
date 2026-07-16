# Milestone Card Proportions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual evidence to the Politiktok publication milestone and make milestone cards wider and shorter.

**Architecture:** Reuse the existing media registry and `mediaId` contract. Change only milestone data, its rendered-behavior test, and milestone-specific CSS.

**Tech Stack:** React 19, TypeScript, Vitest, CSS.

## Global Constraints

- Preserve all existing milestone copy and evidence links.
- Reuse approved local media; add no dependency.
- Keep the responsive one-column mobile layout.

---

### Task 1: Publication Media and Compact Milestone Cards

**Files:**
- Test: `frontend/src/pages/SoftwarePortfolio.test.tsx`
- Modify: `frontend/src/data/software.ts`
- Modify: `frontend/src/styles/software.css`

**Interfaces:**
- Consumes: `MilestoneStory.mediaId?: string` and `getMedia(mediaId)`.
- Produces: a rendered image in `#software-milestones` for `politiktok-publication`.

- [ ] **Step 1: Write the failing rendered-behavior test**

Assert that the article containing `Second published paper · PoliTikTok` has an image.

- [ ] **Step 2: Run the focused test and verify failure**

Run `npm test -- src/pages/SoftwarePortfolio.test.tsx` in `frontend` and expect the publication image assertion to fail.

- [ ] **Step 3: Add approved publication media**

Set `mediaId: 'politiktok1'` on the `politiktok-publication` milestone.

- [ ] **Step 4: Constrain milestone geometry**

Use a wider desktop media-to-copy ratio, a bounded landscape media viewport, and responsive stacked cards below 820px.

- [ ] **Step 5: Verify**

Run the focused test, lint, type checking, and the production build; all must pass.
