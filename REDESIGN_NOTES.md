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

## Off Script refinement (2026-09-06)

Prior Off Script and the two-concept comparison are preserved at commit `669edde`.
The comparison bar now provides A Curiosity Lab, B Original, and B Refined.
- `/concept-b-original` renders the prior Off Script component with its original particle field.
- `/concept-b` and `/` render the refinement.

The refined opening morphs a shared set of particles from deterministic scatter into sorting, network, and mathematical-surface arrangements. A keyboard-accessible slider controls organization. The forms link to the corresponding project studies. Scroll introduces a subtle handoff toward the eight-exploration motif, without scroll locking. A custom SVG JK signature animates on entry.

All eight projects receive interactive illustrations at equal prominence. The sorting study steps through a real bubble sort; the other studies are conceptual diagrams or explicitly synthetic data. They are not embedded executions of the linked repositories. The project descriptions and source links remain unchanged.

New files: `src/OffScriptClassic.jsx`, `src/ComplexityField.jsx`, `src/ProjectExperiment.jsx`, `src/refinement.css`. These also need removal for a full restoration to the original website. Existing checkpoint commits preserve all earlier versions.

Validation: completed bubble sort in 33 swaps and reset; changed leader, agent stage, envelope layer and backtest bar; exercised all four sliders with keyboard input; checked filtered-to-project navigation and focus; verified eight studies and no clipped headings/controls or horizontal overflow at 320, 390, 768, 1440 and 1920 pixels. Original route confirmed. No browser error/warning logs during validation. Reduced motion has static composed forms and disables CSS motion; hidden/offscreen rendering is suspended and pause stops autonomous frame updates.

## Pre-push review changes (2026-09-06)

Removed Digital Evidence Engine from the shared dataset at the user's request. Both comparison designs now show seven projects. Counts derive from the shared dataset, and the transition motif has seven points.

Expanded all seven project stacks after reading their GitHub READMEs. The backtester's requirements.txt and RaftKV's go.mod were checked as well. RaftKV has no third-party Go dependencies; its listed items include its actual standard-library transport and testing techniques rather than invented frameworks. Roadmap-only gRPC/Grafana items were excluded.

Replaced the large Arrange/Connect/Model buttons with compact Sorting/Network/Surface icon controls and a selected underline. The pause control remains available. Verified seven entries, removed project absence, and no overflow or clipped selector/stack sections at 320, 390, 768 and 1440 pixels. Build and lint passed.

GitHub push is pending the requested preview review. Nothing has been pushed or deployed in this step.

Latest direction: removed the hero Sorting/Network/Surface modes, related links, and clarity slider. Restored a single expressive helix sculpture. Added a five-second, session-once JK opening with skip, Escape, replay, and reduced-motion support, plus a fine-pointer custom cursor. Build and lint pass. Local automatic reveal and replay/skip verified. No push yet.

Publication: approved refined design is the root site, with comparison navigation removed. Original bc70af8 site is preserved as an isolated static build in public/oldsite with router basename /oldsite. Vercel redirects /oldsite to /oldsite/ and serves its index; Vite mirrors this locally. Archive compiled assets are excluded from source lint. Both routes visually verified; lint and production build pass.
