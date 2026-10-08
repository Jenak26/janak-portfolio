/* Installability, checked the way Chrome decides it: manifest parse errors, installability
   errors, icons that load, and a service worker controlling the page. */
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
// A normal profile: Chrome never offers install in incognito, which is what newContext() is.
const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), "dl-inst-")), { channel: "chrome" });
const p = await ctx.newPage();
await p.goto("http://localhost:4174/deadlines/");
await p.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(() => {});
await p.reload();
const cdp = await ctx.newCDPSession(p);
const man = await cdp.send("Page.getAppManifest");
const inst = await cdp.send("Page.getInstallabilityErrors");
const parsed = JSON.parse(man.data);
const icons = await Promise.all(parsed.icons.map(async i => [i.src, i.sizes, i.purpose, (await p.request.get(new URL(i.src, man.url).href)).status()]));
console.log(JSON.stringify({
  manifestUrl: man.url, manifestErrors: man.errors, installabilityErrors: inst.installabilityErrors,
  name: parsed.name, display: parsed.display, start_url: parsed.start_url, scope: parsed.scope, icons,
  swControls: await p.evaluate(() => !!navigator.serviceWorker.controller),
  swScope: await p.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.scope),
  appleTouchIcon: (await p.request.get("http://localhost:4174/deadlines/apple-touch-icon.png")).status(),
}, null, 1));
await ctx.close();
