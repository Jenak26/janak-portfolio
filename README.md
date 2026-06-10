# Janak Kabra | Personal Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-janakkabra.in-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://janakkabra.in)

Source for my personal portfolio. A single-page React app with a crosshair
"lock-on" brand system, real project screenshots pulled from my live apps,
and an accessibility-first build (focus rings, reduced-motion support,
WCAG AA contrast).

## Stack

- **React 19 + Vite 7** — SPA with `react-router-dom` for the 404 route
- **Tailwind CSS 3.4** — warm stone palette + single `#ff4d4d` accent
- **Framer Motion** — one motion system (expo-out easing, shared tokens in `src/motion.js`)
- **Vercel** — hosting + analytics, SPA rewrite in `vercel.json`

## Structure

All content lives in `src/data.js` (profile, projects, experience, skills).
Components only render what that file declares, so updating the site means
editing one file.

```
src/
  data.js          ← edit your content here
  motion.js        ← motion tokens (easing, durations, stagger)
  App.jsx          ← shell: routes, skip link, background
  Nav.jsx          ← scroll-spy pill nav (bottom on mobile, top on desktop)
  Hero.jsx  Work.jsx  Experience.jsx  About.jsx  Contact.jsx
  Corners.jsx      ← signature crosshair brackets (scroll + hover modes)
  SectionHeading.jsx  SpotlightCard.jsx  Beams.jsx  HireMe.jsx  NotFound.jsx
```

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run lint     # eslint
```

## Updating project screenshots

Screenshots live in `public/projects/`. Capture any live app at 1280px wide
and drop it in, then point the `image` field in `src/data.js` at it.
