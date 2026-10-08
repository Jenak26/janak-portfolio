/* Lighthouse, mobile defaults, against the local server. Runs twice: the lock screen as a
   first visit sees it, and the unlocked board (seeded data) with storage kept between runs. */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const URL_ = "http://localhost:4174/deadlines/";
const PORT = 9333;
const run = (args) => new Promise((ok, bad) => {
  const p = spawn(process.execPath, ["node_modules/lighthouse/cli/index.js", URL_, `--port=${PORT}`, "--output=json", "--quiet", "--only-categories=performance,accessibility,best-practices,seo", ...args], { stdio: "inherit" });
  p.on("exit", c => (c === 0 ? ok() : bad(new Error("lighthouse exit " + c))));
});
// A persistent context is Chrome's default profile, the one Lighthouse audits in.
const ctx = await chromium.launchPersistentContext(mkdtempSync(join(tmpdir(), "dl-lh-")), { channel: "chrome", headless: true, args: [`--remote-debugging-port=${PORT}`] });
const report = name => {
  const r = JSON.parse(readFileSync(`.lighthouse/${name}.json`, "utf8"));
  const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const fails = Object.values(r.audits).filter(a => a.score !== null && a.score < 1 && ["accessibility"].some(c => r.categories[c].auditRefs.some(x => x.id === a.id))).map(a => a.id);
  const m = r.audits;
  console.log(name, JSON.stringify(s), "FCP", m["first-contentful-paint"].displayValue, "LCP", m["largest-contentful-paint"].displayValue, "TBT", m["total-blocking-time"].displayValue, "CLS", m["cumulative-layout-shift"].displayValue, fails.length ? "a11y fails: " + fails.join(",") : "");
};
try {
  await run(["--output-path=.lighthouse/locked.json"]);
  report("locked");
  const page = await ctx.newPage();
  await page.goto(URL_);
  await page.evaluate(() => localStorage.setItem("deadlines-unlocked", "1cfafff6d51a0366"));
  await page.close();
  await run(["--output-path=.lighthouse/board.json", "--disable-storage-reset"]);
  report("board");
  const shot = JSON.parse(readFileSync(".lighthouse/board.json", "utf8")).audits["final-screenshot"].details.data;
  const p2 = await ctx.newPage();
  await p2.goto(URL_);
  console.log("board run showed the board:", await p2.locator("#plate-h").count() === 1, "screenshot bytes", shot.length);
} finally { await ctx.close(); }
