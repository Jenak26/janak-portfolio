# Deadlines

Personal deadline board served at `/deadlines/`. Preact and TypeScript, built separately from the
portfolio into `dist/deadlines/`. Everything is stored in the browser on the device.

## Commands (run in this folder)

- `npm run dev` for a dev server (no service worker in dev)
- `npm test` for unit tests (parser, dates, planning, migrations, storage, calendar export)
- `npm run build` then `npm run e2e` for the Playwright smoke suite at 390x844 (uses installed Chrome)
- `npm run lighthouse` with the e2e server running (`node tests/e2e/server.mjs`)

The root `npm run build` builds the portfolio, then this app.

## How updates reach a phone

Every build hashes all of its files into the service worker. A changed file means a changed
worker, the open app shows "Update ready", and Reload switches to it. No manual version bump.

## Data

- `deadlines`: the board, `{v: 2, courses, tasks}`. Migrations are in `src/store/migrate.ts`.
- `deadlines-good`: the last copy that loaded cleanly, used if the main copy is ever unreadable.
- `deadlines-v1`: v1's data. Read once to migrate, never written or deleted.
- `deadlines-unreadable-*`: raw copies of anything that failed to load.

## The 1313 lock

A lock screen, not security. There is no server, so the check and the seed list ship to every
visitor and a 4-digit code can be guessed. It keeps the board out of sight; it does not protect it.

## v1

`legacy-v1/` is the original, kept as the behaviour reference and the takeover test fixture.
`public/deadlines-v1/` is a comparison copy with its service worker removed (its cleanup would delete
v2's offline cache) and the same lock. Delete both when the comparison is done.
