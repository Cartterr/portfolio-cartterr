# Portfolio Rebuild Design

## Objective

Rebuild `josecarter.dev` into a case-study-first portfolio that helps engineering managers, technical recruiters, and founders understand José's value within one short scan and validate it through concrete work.

Primary positioning:

> Software engineer building reliable AI, data, and autonomous systems.

The site must feel like a carefully edited technical publication, not a résumé template, glassmorphism dashboard, or gallery of every technology José has touched.

## Experience and content

The home page uses this order:

1. Minimal fixed header with Work, Experience, About, Contact, and CV.
2. Hero with one positioning statement, one supporting paragraph, `Explore selected work`, and `Download CV`.
3. Proof strip with four contextual metrics: up to 50% HVAC energy reduction, 100k+ research records, 15x simulation speedup, and 14+ teaching/mentoring roles.
4. Four featured case studies: GridWorks production migration, Notre Dame autonomous mission planning, Politiktok research infrastructure, and CUDA geoscience simulation.
5. Compact experience timeline for Dily, Flair, teaching, and the featured roles without repeating case-study copy.
6. Short About section using two curated professional images: the South American Space Generation Workshop and KHIPU 2025.
7. Three evidence-backed capability groups with no more than 18 total items.
8. Contact section with direct email, LinkedIn, GitHub, and a functional accessible form.

Each featured case study communicates context, role, problem, constraints, contribution, outcome, technologies, one representative image, and a public link where one exists. Private work is clearly labeled and does not imply public source access.

## Visual system

- Editorial light canvas (`#f4f1ea`) with deep ink (`#111722`) and occasional full-width ink sections.
- Copper (`#c45a35`) is the primary accent; muted teal (`#3d8f87`) is reserved for data/research signals.
- Self-hosted variable sans for body/UI and a restrained editorial serif for major display lines; monospace is limited to metadata.
- Generous white space, strong grid alignment, thin dividers, and flat surfaces. No glassmorphism, mouse-follow glows, autoplay, custom cursor, card nesting, or tag clouds.
- Real project and event photography supplies the visual character. No decorative generated art, fake diagrams, or handcrafted SVG illustrations.
- Motion is limited to short opacity/transform transitions under 250ms and is disabled under `prefers-reduced-motion`.

## Architecture and behavior

- Preserve React, TypeScript, Vite, Tailwind, Express, and the existing single Railway service.
- Replace the current component tree with focused layout, section, and UI components driven by one typed content module.
- Render all navigation targets immediately; remove idle-delayed below-fold mounting and the anchor/layout-shift bug it creates.
- Remove the multi-image gallery and load only curated responsive WebP assets.
- Keep `GET /api/health` and `POST /api/contact`; remove the unused duplicate portfolio-data API.
- Contact accepts `{ name, email, message, website? }`, where `website` is an invisible honeypot. It trims input, enforces maximum lengths, returns stable JSON, and never logs full message bodies.
- Keep same-origin `/api` in production. Redirect `www.josecarter.dev` to the apex after Railway ownership is verified; do not redirect health checks.
- Add Railway config-as-code with `/api/health` as the deployment health check.

## Quality bar

- Semantic landmarks, skip link, logical heading order, visible focus, 44px touch targets, accessible form errors/status, and AA contrast.
- Desktop, tablet, and mobile layouts at 1440px, 768px, and 390px without horizontal overflow.
- Lighthouse targets on the deployed apex: Performance 95+, Accessibility 100, Best Practices 100, SEO 100; LCP below 2.5s and CLS below 0.1 on mobile.
- All internal anchors, external links, CV download, API health, and contact delivery work after deployment.
- Preserve the current production commit as a Railway rollback point and the unrelated discounts dashboard on its dedicated WIP branch.

