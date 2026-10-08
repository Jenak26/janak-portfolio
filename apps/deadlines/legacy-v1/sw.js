/* Deadline board service worker. Bump VERSION whenever you change any file. */
const VERSION = "deadlines-v1";
const SHELL = ["index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

/* A redirected response cannot answer a page load, so store a plain copy. */
async function plain(res){
  if (!res.redirected) return res;
  return new Response(await res.blob(), {status: res.status, statusText: res.statusText, headers: res.headers});
}
async function stash(cache, key, res){
  if (res && (res.ok || res.type === "opaque")) await cache.put(key, await plain(res.clone()));
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(SHELL.map(path => fetch(path, {cache: "reload"}).then(res => stash(cache, path, res)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith("deadlines-") && n !== VERSION).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* Page loads: answer from the saved copy at once, refresh it in the background. */
  if (req.mode === "navigate"){
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const hit = await cache.match("index.html");
      const fresh = fetch(req).then(async res => { await stash(cache, "index.html", res); return res; }).catch(() => null);
      if (hit){ event.waitUntil(fresh); return hit; }
      return (await fresh) || new Response("You are offline and the app has not been saved on this device yet.", {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}});
    })());
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  /* Icons, manifest and fonts: saved copy first, network as the fallback. */
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req);
    if (hit){
      if (sameOrigin) event.waitUntil(fetch(req).then(res => stash(cache, req, res)).catch(() => {}));
      return hit;
    }
    try {
      const res = await fetch(req);
      await stash(cache, req, res);
      return res;
    } catch (e) {
      return new Response("", {status: 504});
    }
  })());
});
