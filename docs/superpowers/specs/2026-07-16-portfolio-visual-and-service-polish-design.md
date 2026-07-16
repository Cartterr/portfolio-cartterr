# Portfolio Visual and Service Polish Design

## Goal

Resolve the outstanding portfolio presentation issues in one pass: expand future-facing services, convert the Visual hero scene into a full-bleed live background, and prevent Software About content from clipping at intermediate widths.

## Design

### Available collaboration

Add two honest, prototype-oriented service cards: `Spatial computing & AR prototyping` and `Agentic AI & automation`. Their copy must emphasize prototypes, integration, evaluation, and delivery without claiming unsupported shipped smart-glasses work.

### Visual hero

The poster and WebGL scene fill the complete hero as an absolute background. Remove the frame, rounded border, status dot, and mode label. Keep the live scene, pointer response, performance governor, reduced-motion path, and static fallback. Layer left-to-right and bottom gradients above the scene, with copy and proof metrics above those gradients.

### Software About responsiveness

At `max-width: 1100px`, switch the About section to one column, place copy before media, give copy a safe full width, and use a bounded intermediate heading size. Preserve the desktop split above that breakpoint and the existing compact mobile rules.

## Verification

- Six service cards render, including AR and agentic automation.
- Visual hero stage is marked and rendered as a background, with no mode label.
- Software About has a one-column intermediate-width contract.
- Focused tests, full tests, lint, type checking, build, and browser screenshots pass.
