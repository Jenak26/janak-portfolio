# Deadline board (installable web app)

Static files, no build step. Everything the app stores stays in the browser on the device.

## Put it on janakkabra.in (Vite)

1. Copy this whole `deadlines` folder into your site's `public/` folder, so you have `public/deadlines/index.html`.
2. Build and deploy the site the way you normally do.
3. On the phone, open `https://janakkabra.in/deadlines/index.html` in Safari.
4. Share, then Add to Home Screen.

Open it once while online. After that it works offline.

## Changing it later

Edit `index.html`, then bump `VERSION` in `sw.js` (for example `deadlines-v2`) and redeploy. The phone picks up the new copy on the second launch after that.

## Things to know

- Data lives in the browser's storage for this site on this device. There is no sync and no account.
- Use Export backup at the bottom of the page before clearing browser data or changing phones.
- The font loads from Google Fonts on the first online visit and is kept for offline use. Before that, the system font shows.
- If your host redirects `/deadlines/index.html` to a clean URL, the app still loads, but test offline mode once (airplane mode, then open it from the home screen).
