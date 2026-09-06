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

## Second design and comparison (2026-09-05)

The first complete design is also preserved at commit `fa6fb04`.

- `/concept-a`: Curiosity Lab, now with eight equal project cards.
- `/concept-b`: Off Script, a dark alternative with a reactive particle field and eight equal project entries.
- `/`: opens Off Script while comparing the alternatives.
- A sticky comparison bar changes between the two options locally without covering bottom-of-page controls.

InternshipGOAT was removed from shared project content and page metadata at the user's request. No projects are marked featured and there is no secondary archive. Both concepts use the same eight-project dataset.

Additional new files for this comparison: `src/ConceptSwitcher.jsx`, `src/OffScript.jsx`, `src/SignalField.jsx`, `src/ProjectArt.jsx`, `src/ExtraProjectArt.jsx`, `src/offscript.css`. Include these when removing redesign files for a full restoration to the original site. Restore `src/data.js` as well if reverting the removal of the scrapped project from legacy data.

Comparison validation: both designs checked at 320, 390, 768, 1440, and 1920 pixels with eight visible project entries, no scrapped project text, no horizontal overflow, and no clipped headings. Verified concept navigation, particle mode selection, motion pause, Systems filtering, and email copy feedback.
