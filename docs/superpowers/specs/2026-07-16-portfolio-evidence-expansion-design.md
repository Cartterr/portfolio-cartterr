# Portfolio Evidence Expansion Design

## Status

Approved by the user's instruction to fully implement the July 16 content audit and to use the
authenticated LinkedIn profile and authored posts as source material. This specification supersedes
the earlier `2026-07-12-dual-portfolio-rework-design.md` prohibition on SIGGRAPH copy.

## Objective

Turn the existing portfolio from a project-focused presentation into a complete, source-backed
professional profile without making it read like a copied LinkedIn page. Add the missing education,
publication, conference, teaching, credential, service, and proof-link evidence while preserving the
current editorial visual system and existing project galleries.

## Source hierarchy

1. The user's current instruction and the supplied six-post LinkedIn evidence file.
2. The authenticated LinkedIn profile and authored posts inspected in Chrome.
3. Canonical public destinations: DOI, PoliTikTok, Dily, Drone Response, and externally verifiable
   credential pages.
4. Existing portfolio copy and media manifest.

The portfolio must not expose authentication data, private employer material, identity documents, or
other sensitive information.

## Content architecture

### 1. Multiple proof links

Replace the single optional `link` field on experience and project stories with `links`, an array of
`PortfolioLink`. Render links as a compact wrapping group in both story components. Migrate every
existing Flair, Drone Response, Dily, and PoliTikTok link.

Required link sets:

- Dily experience and project: canonical `https://www.dily.cl/`.
- PoliTikTok experience and project: DOI, public project website, and authored publication post.
- Drone Response experience and project: public project website and authored research-fair post.
- Flair: existing company website.
- Shared contact links: add LeetCode.

### 2. Milestones and credentials

Add a typed `MilestoneStory` model and a single `Milestones` section after About. The section groups
evidence into three editorial categories while retaining one continuous layout:

- Education: PUC Computer Engineering degree, Major in Software Engineering, Minor in Data Science,
  graduated with distinction.
- Publications and research communication: second published PoliTikTok paper and Drone Response
  research-fair presentation.
- Recognition and technical community: SIGGRAPH 2026 Student Volunteer, SA-SGW 2026 Delegate,
  Ayudante Senior DCC UC 2025, Escuela Militar teaching recognition, and KHIPU 2025.

Each milestone contains period, title, issuer, category, summary, optional skills, one existing or
new media ID, and one or more proof links. LinkedIn overlay links remain secondary when a public post
or external certificate is available.

### 3. Media

Reuse existing cleared media:

- Graduation: `profile14`.
- SA-SGW: `profile15`.
- Ayudante Senior: `profile10`.
- KHIPU: `profile1`.
- Drone Response: `profile6-alt`.

Download the authored SIGGRAPH post image from the authenticated LinkedIn post, create bounded WebP
main and thumbnail renditions, and register it in the media manifest as a cleared self-authored social
post capture. Milestones without unique imagery may share contextual media already owned by the user.

### 4. Work-history corrections

- Dily title: `Software Engineer · Full Stack Developer`.
- Dily canonical website on both experience and project.
- Flair period: `Dec 2024 - Aug 2025`.
- Split the combined teaching story into:
  - PUC: `Advanced Teaching Assistant & Technical Mentor`, `Mar 2023 - Present`.
  - Escuela Militar: `Programming Instructor`, `Jul 2024 - Dec 2025`.
- Preserve the overall chronological ordering and existing teaching gallery.

### 5. PoliTikTok expansion

State the 6 April 2026 publication date, the user's description of it as their second published paper,
and that the technical work began in 2023. Explicitly include transcription filtering, research-ready
dataset construction from noisy social-media data, computational political-discourse analysis, and
ANID/Fondecyt context. Do not invent or link an unidentified first publication.

### 6. Skills and services

Expand existing capability groups rather than creating a tag wall. Incorporate Flask, Django, Pandas,
NumPy, Docker, AWS EC2/S3/Lambda, distributed systems, design patterns, functional programming, unit
testing, and Azure as a learning direction. Add a concise `Services` subsection inside Capabilities
covering research engineering, IT consulting, SaaS, business analytics, information management,
application/database/custom-software development, and cloud application development.

### 7. Dual-portfolio behavior

The complete Milestones section appears on the Software route. The Visual route receives a concise
SIGGRAPH 2026 signal in its hero/about positioning and retains KHIPU/SA-SGW imagery through the shared
profile evidence. The main navigation adds `Milestones` only where the section exists.

## Components and data flow

- `data/types.ts`: add `MilestoneStory`, multiple story links, services, and optional milestones.
- `data/shared.ts`: add LeetCode and shared milestone data where appropriate.
- `data/software.ts`: work-history corrections, enriched copy, links, milestones, capabilities, and
  services.
- `data/visual.ts`: concise SIGGRAPH positioning and any shared evidence references.
- `data/media.ts`: SIGGRAPH post media registration and rights metadata.
- `sections/Milestones.tsx`: semantic section with category labels, media, skills, and proof links.
- `components/ui/LinkGroup.tsx`: shared accessible multiple-link renderer.
- Existing experience/project components consume `LinkGroup`.
- `pages/SoftwarePortfolio.tsx`: place Milestones after About.
- `sections/Capabilities.tsx`: render concise services after the four capability systems.
- `styles/software.css`: responsive milestone, link-group, and services styling using existing
  typography, spacing, borders, and focus treatments.

## Accessibility and responsive behavior

- Milestones use a section heading followed by semantic articles with logical heading order.
- External links include visible labels, new-tab disclosure for assistive technology, and existing
  focus styles.
- Images use source-specific alt text and fixed dimensions.
- Link groups wrap without horizontal overflow.
- Milestone cards collapse to one column on mobile and never depend on hover.
- No autoplay, animation dependency, or credential-only image conveys essential meaning.

## Testing

Use red-green TDD for:

1. Multiple links in experience and project stories.
2. Dily canonical URL in both locations.
3. PoliTikTok DOI, project, and post links plus expanded publication copy.
4. Drone Response website and research-fair proof links.
5. LeetCode contact link.
6. Milestone count, category coverage, exact major credentials, and SIGGRAPH visibility.
7. Corrected Dily, Flair, PUC, and Escuela Militar work-history data.
8. Services and expanded capability evidence.
9. SIGGRAPH media metadata and publication clearance.

Run focused tests during each cycle, then full tests, lint, type-check, production build,
`git diff --check`, and a browser-level desktop/mobile visual verification.

## Acceptance criteria

The change is complete when every high-value item in the July 16 audit is either represented as
content, a canonical proof link, or an explicitly corrected work-history fact; existing project and
gallery behavior remains intact; no LinkedIn-only chrome or sensitive information appears in copied
media; and all automated and visual verification gates pass.
