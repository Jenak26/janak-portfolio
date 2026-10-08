/* Deadlines service worker.
   - Saves every file of this exact build at install (all or nothing), under deadlines-v2-<hash>.
   - Answers everything from that copy, so a launch in airplane mode looks and works the same.
   - A new build waits until the page says "reload", so a running app never mixes two versions.
   - Taking over from v1 (whose page has no update prompt) happens at once, then old caches go. */
/// <reference lib="webworker" />
export {};
declare const self: ServiceWorkerGlobalScope;

const VERSION = "deadlines-v2-__VERSION__";
const PRECACHE: string[] = "__PRECACHE__" as unknown as string[];
const V1_CACHE = "deadlines-v1";

const scopeURL = new URL(self.registration.scope);
const INDEX = new URL("index.html", scopeURL).href;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(PRECACHE.map(path => new Request(new URL(path, scopeURL).href, { cache: "reload" })));
    if (await caches.has(V1_CACHE)) await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  const done = (async () => {
    const fromV1 = await caches.has(V1_CACHE);
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith("deadlines-") && n !== VERSION).map(n => caches.delete(n)));
    await self.clients.claim();
    return fromV1;
  })();
  event.waitUntil(done);
  // Pages still running v1 code reload into v2. Data is untouched: it lives in localStorage.
  // This must run after activation: the reload's own request waits for this worker to be active.
  done.then(async fromV1 => {
    if (!fromV1) return;
    const pages = await self.clients.matchAll({ type: "window" });
    await Promise.all(pages.map(c => (c as WindowClient).navigate(c.url).catch(() => null)));
  });
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== scopeURL.origin || !url.pathname.startsWith(scopeURL.pathname)) return;

  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const hit = await cache.match(INDEX);
      if (hit) return hit;
      try { return await fetch(req); } catch {
        return new Response("You are offline and this app has not been saved on this device yet. Open it once while online.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { return await fetch(req); } catch { return new Response("", { status: 504 }); }
  })());
});
