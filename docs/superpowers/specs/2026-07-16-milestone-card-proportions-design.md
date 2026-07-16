# Milestone Card Proportions Design

## Goal

Make the milestone gallery scan faster by giving the Politiktok publication visual evidence and preventing portrait media from making the first rows excessively tall.

## Design

- Reuse the approved `politiktok1` portfolio image for the second-paper milestone.
- Keep the two-column milestone grid on desktop.
- Use a wider card composition with a bounded landscape media viewport.
- Crop images with `object-fit: cover`; retain the existing responsive single-column layout below 820px.
- Preserve all copy, links, semantic headings, and accessible image alternatives.

## Verification

- The Politiktok milestone renders an image.
- Desktop milestone media is constrained to a short landscape frame.
- Existing portfolio tests, lint, type checking, and production build pass.
