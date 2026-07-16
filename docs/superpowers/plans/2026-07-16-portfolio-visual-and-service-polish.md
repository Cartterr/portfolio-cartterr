# Portfolio Visual and Service Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand future-facing services, make the Visual hero field full-bleed, and eliminate intermediate-width Software About clipping.

**Architecture:** Keep content in `software.ts`, preserve the existing graphics capability and fallback pipeline, and change only hero/About presentation CSS plus small semantic hooks needed for regression tests.

**Tech Stack:** React 19, TypeScript, React Three Fiber, CSS, Vitest.

## Global Constraints

- Preserve existing links, graphics performance governance, and poster fallback.
- Do not claim shipped AR smart-glasses products.
- Preserve unrelated worktree changes.

---

### Task 1: Future-facing services

**Files:**
- Test: `frontend/src/pages/SoftwarePortfolio.test.tsx`
- Modify: `frontend/src/data/software.ts`

- [ ] Add failing assertions for `Spatial computing & AR prototyping` and `Agentic AI & automation`.
- [ ] Run the focused Software test and confirm both headings are missing.
- [ ] Add the two service records with concrete prototype and automation deliverables.
- [ ] Run the focused test and confirm it passes.

### Task 2: Full-bleed Visual field

**Files:**
- Test: `frontend/src/pages/VisualPortfolio.test.tsx`
- Modify: `frontend/src/pages/VisualPortfolio.tsx`
- Modify: `frontend/src/styles/visual.css`

- [ ] Add a failing assertion that the hero stage is a background layer and exposes no mode label.
- [ ] Run the focused Visual test and confirm failure.
- [ ] Remove mode-label markup and convert the stage to an absolute full-hero layer.
- [ ] Add gradient contrast layers and keep copy/actions/proof above the scene.
- [ ] Run the focused test and confirm it passes.

### Task 3: Software About responsive containment

**Files:**
- Test: `frontend/src/pages/SoftwarePortfolio.test.tsx`
- Modify: `frontend/src/styles/software.css`

- [ ] Add a raw-CSS regression assertion for the `1100px` one-column About layout.
- [ ] Run the focused test and confirm failure.
- [ ] Stack About, order copy first, cap copy width safely, and bound heading size at `1100px` and below.
- [ ] Run the focused test and confirm it passes.

### Task 4: Final verification

- [ ] Run full tests, lint, type checking, production build, and diff checks.
- [ ] Inspect Software About and Visual hero at desktop and intermediate widths.
