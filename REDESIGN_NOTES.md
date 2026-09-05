# Curiosity Lab redesign

The original site is preserved in Git on `codex/before-creative-redesign` at `bc70af8`.
The redesign is on `codex/curiosity-lab`. Nothing has been published.

## Run locally

Use `npm run dev` from the repository. The current preview runs at http://127.0.0.1:5173.
Build with `npm run build`; lint with `npm run lint`.

## Restore the original when requested

Restore these tracked files from `codex/before-creative-redesign`:
- src/App.jsx
- src/index.css
- src/NotFound.jsx
- index.html

Remove only the new redesign files `src/Sculpture.jsx`, `src/labData.js`, and this note.
Rebuild or restart the local preview. Keep unrelated future edits intact.

## Content sources

Project descriptions were checked against the public GitHub profile and repository list on 2026-09-05:
https://github.com/Jenak26
https://github.com/Jenak26?tab=repositories

The digital evidence project was additionally checked against its README, including the four-person team and explicit limitations:
https://github.com/Jenak26/team-peri-peri-fries

Existing biography, experience dates, resumes, social links, and portrait are retained from the supplied site. Marketing copy avoids unverified benchmark claims. Project artwork is illustrative, not live output from the repositories. The algorithm project is displayed as Algorithm Playground and links to the original deterministic execution debugger repository.

## Implementation

React and CSS with a dependency-free Canvas parametric sculpture. No additional packages or remote runtime assets. Geometry is generated per form. Canvas rendering is capped near 30 fps, pixel density is capped at 2, and rendering suspends offscreen or in a hidden document. Reduced motion is honored; the pause control stops all decorative animation. Shape rotation supports pointer and keyboard input. Project filters and expandable details work without hover.

## Validation

Production build and ESLint. Browser checks at 320, 390, 768, 1440, and 1920 pixel widths. Verified shape controls, global pause state, archive filtering, project expansion, navigation, and successful email copy feedback. Local browser logs showed no errors or warnings during these checks.
