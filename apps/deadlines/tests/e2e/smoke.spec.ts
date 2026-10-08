import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const APP = "/deadlines/";
const fixture = readFileSync(fileURLToPath(new URL("../fixtures/v1-storage.json", import.meta.url)), "utf8");

/* Desktop Chrome can share files on Windows, which would open a system sheet. Force the
   download path so the test can catch the file. */
async function noShare(page: Page) {
  await page.addInitScript(() => { Object.defineProperty(navigator, "canShare", { value: undefined }); });
}

async function unlock(page: Page) {
  await expect(page.getByRole("heading", { name: "Deadlines" })).toBeVisible();
  await page.getByLabel("Code").fill("1313");
  await page.getByRole("button", { name: "Open" }).click();
  await expect(page.getByRole("heading", { name: "On your plate" })).toBeVisible();
}

const row = (page: Page, title: string) => page.locator("main .group li.task", { hasText: title }).first();

async function swControlled(page: Page) {
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.getRegistration("/deadlines/");
    return !!reg?.active && !!navigator.serviceWorker.controller;
  }, null, { timeout: 20_000 });
}

test("lock, first-run seed, quick add, tick, undo, edit, delete", async ({ page }) => {
  await page.goto(APP);
  // Wrong code first
  await page.getByLabel("Code").fill("0000");
  await page.getByRole("button", { name: "Open" }).click();
  await expect(page.getByRole("alert")).toHaveText(/not right/);
  await unlock(page);

  // Seed: the 14 v1 deadlines
  await expect(page.locator("main .group li.task")).toHaveCount(14);
  await expect(row(page, "DBMS lab project")).toBeVisible();

  // Quick add reads course, type and date, and strips the date from the title
  const qa = page.getByLabel(/Add a deadline/);
  await qa.fill("CN viva 15 oct");
  await expect(page.locator("#qa-hint")).toContainText("CN");
  await expect(page.locator("#qa-hint")).toContainText("Present");
  await expect(page.locator("#qa-hint")).toContainText("15 Oct");
  await qa.press("Enter");
  await expect(page.locator(".toast")).toContainText("Added CN viva");
  const viva = page.locator("section.group").filter({ has: page.locator("h2", { hasText: "Thu 15 Oct" }) }).locator("li.task", { hasText: "CN viva" });
  await expect(viva).toBeVisible();
  await expect(qa).toHaveValue("");

  // Tick and undo
  const lab = row(page, "DBMS lab project");
  await lab.getByRole("checkbox", { name: "Done: DBMS lab project" }).check();
  await expect(page.locator(".toast")).toContainText("Ticked off DBMS lab project");
  await expect(lab).toHaveClass(/done/);
  await page.locator(".toast").getByRole("button", { name: "Undo" }).click();
  await expect(row(page, "DBMS lab project")).not.toHaveClass(/done/);
  await expect(page.locator(".toast")).toContainText("Undone");

  // Edit: rename and add checklist steps
  await row(page, "DBMS lab project").getByRole("button", { name: /Edit DBMS lab project/ }).click();
  const dlg = page.getByRole("dialog", { name: "Edit deadline" });
  await expect(dlg).toBeVisible();
  await expect(page.locator("#ed-h")).toBeFocused();
  await dlg.getByLabel("What is due").fill("DBMS lab project final");
  await dlg.getByLabel("New step").fill("ER diagram");
  await dlg.getByLabel("New step").press("Enter");
  await dlg.getByLabel("New step").fill("Schema and seed data");
  await dlg.getByRole("button", { name: "Add step" }).click();
  await dlg.getByRole("button", { name: "Save" }).click();
  await expect(dlg).toBeHidden();
  const edited = row(page, "DBMS lab project final");
  await expect(edited.getByRole("button", { name: /0 of 2 steps done/ })).toBeVisible();
  // Focus returns to the row that opened the editor
  await expect(edited.getByRole("button", { name: /Edit DBMS lab project final/ })).toBeFocused();
  // Tick a step from the row
  await edited.getByRole("button", { name: /steps done/ }).click();
  await edited.getByRole("checkbox", { name: "ER diagram" }).check();
  await expect(edited.getByRole("button", { name: /1 of 2 steps done/ })).toBeVisible();

  // Delete and undo
  await row(page, "OS review 2").getByRole("button", { name: /Edit OS review 2/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await expect(page.locator(".toast")).toContainText("Deleted OS review 2");
  await expect(page.locator("main .group li.task", { hasText: "OS review 2" })).toHaveCount(0);
  await page.locator(".toast").getByRole("button", { name: "Undo" }).click();
  await expect(row(page, "OS review 2")).toBeVisible();

  // Survives a reload
  await page.reload();
  await expect(row(page, "DBMS lab project final")).toBeVisible();
  await expect(page.locator("main .group li.task")).toHaveCount(15);
});

test("backup export and import round trip", async ({ page }) => {
  await noShare(page);
  await page.goto(APP);
  await unlock(page);
  await page.getByLabel(/Add a deadline/).fill("Round trip check tomorrow");
  await page.getByLabel(/Add a deadline/).press("Enter");
  await expect(row(page, "Round trip check")).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export backup" }).first().click()]);
  expect(download.suggestedFilename()).toMatch(/^deadlines-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const path = await download.path();
  const saved = JSON.parse(readFileSync(path, "utf8"));
  expect(saved).toMatchObject({ app: "deadline-board", v: 2 });
  expect(saved.tasks).toHaveLength(15);

  // Lose some data, then bring it back from the file
  for (const title of ["Round trip check", "CN lab midterm"]) {
    await row(page, title).getByRole("button", { name: new RegExp(`Edit ${title}`) }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  }
  await expect(page.locator("main .group li.task")).toHaveCount(13);

  await page.locator('input[type="file"]').setInputFiles(path);
  await expect(page.getByText(/That backup holds 15 deadlines/)).toBeVisible();
  await page.getByRole("button", { name: "Replace with backup" }).click();
  await expect(page.locator("main .group li.task")).toHaveCount(15);
  await expect(row(page, "Round trip check")).toBeVisible();

  // Import is undoable too
  await page.locator(".toast").getByRole("button", { name: "Undo" }).click();
  await expect(page.locator("main .group li.task")).toHaveCount(13);

  // A file that is not a backup changes nothing
  await page.locator('input[type="file"]').setInputFiles({ name: "x.json", mimeType: "application/json", buffer: Buffer.from('{"hello":1}') });
  await expect(page.getByText("That file is not a deadline backup")).toBeVisible();
  await expect(page.locator("main .group li.task")).toHaveCount(13);
});

test("migrates v1 localStorage on first run and keeps the v1 key", async ({ page }) => {
  await page.addInitScript(raw => { if (!localStorage.getItem("deadlines-v1")) localStorage.setItem("deadlines-v1", raw); }, fixture);
  await page.goto(APP);
  await unlock(page);
  await expect(page.getByText("Moved 15 deadlines over from the old version.")).toBeVisible();
  await expect(row(page, "Fixture only essay")).toBeVisible();
  await expect(row(page, "Fixture only essay")).toContainText("Other"); // unknown course maps to Other
  await expect(row(page, "OS lab mid term 2")).toHaveClass(/done/);
  const store = await page.evaluate(() => ({ v1: localStorage.getItem("deadlines-v1"), v2: JSON.parse(localStorage.getItem("deadlines") || "null") }));
  expect(store.v1).toBe(fixture);
  expect(store.v2.v).toBe(2);
  expect(store.v2.tasks).toHaveLength(15);
});

test("works offline after one visit", async ({ page, context }) => {
  await page.goto(APP);
  await unlock(page);
  await swControlled(page);
  await page.getByLabel(/Add a deadline/).fill("Offline proof fri");
  await page.getByLabel(/Add a deadline/).press("Enter");
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "On your plate" })).toBeVisible();
  await expect(row(page, "Offline proof")).toBeVisible();
  // Self-hosted font came from the cache
  expect(await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('16px "Bricolage Grotesque"'); })).toBe(true);
  // Changes still save while offline
  await row(page, "Offline proof").getByRole("checkbox").check();
  await page.reload();
  await expect(row(page, "Offline proof")).toHaveClass(/done/);
  await context.setOffline(false);
});

test("takes over from an installed v1 and keeps its data", async ({ page, request }) => {
  await request.get("/__mode/v1");
  try {
    await page.goto("/deadlines/index.html");
    await expect(page.getByRole("heading", { name: "Deadlines" })).toBeVisible();
    await swControlled(page);
    // Real v1 use: tick one off so the data differs from the seed
    await page.getByRole("checkbox", { name: "Mark done: CN theory quiz" }).check();
    expect(await page.evaluate(() => caches.keys())).toEqual(["deadlines-v1"]);
    const v1raw = await page.evaluate(() => localStorage.getItem("deadlines-v1"));

    await request.get("/__mode/v2");
    // v1's worker answers this launch from its cache; its update check installs v2,
    // which skips waiting and reloads the page into v2.
    await page.reload();
    await expect(page.getByLabel("Code")).toBeVisible({ timeout: 20_000 });
    await page.waitForFunction(async () => (await caches.keys()).every(k => k.startsWith("deadlines-v2-")) && (await caches.keys()).length === 1, null, { timeout: 20_000 });
    await unlock(page);
    await expect(page.getByText(/Moved 14 deadlines over/)).toBeVisible();
    await expect(row(page, "CN theory quiz")).toHaveClass(/done/);
    expect(await page.evaluate(() => localStorage.getItem("deadlines-v1"))).toBe(v1raw);
  } finally {
    await request.get("/__mode/v2");
  }
});

test("offers an update instead of swapping versions under you", async ({ page, request }) => {
  await page.goto(APP);
  await unlock(page);
  await swControlled(page);
  const before = await page.evaluate(async () => (await caches.keys()).join());
  await request.get("/__mode/next");
  try {
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration("/deadlines/"))!.update());
    const prompt = page.locator(".toast", { hasText: "Update ready" });
    await expect(prompt).toBeVisible({ timeout: 20_000 });
    // Until Reload is pressed, the running version keeps serving.
    expect(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration("/deadlines/"))!.waiting)).toBe(true);
    await Promise.all([page.waitForEvent("load"), prompt.getByRole("button", { name: "Reload" }).click()]);
    await expect(page.getByRole("heading", { name: "On your plate" })).toBeVisible();
    await page.waitForFunction(async b => (await caches.keys()).join() !== b && (await caches.keys()).length === 1, before);
    await expect(page.locator(".toast", { hasText: "Update ready" })).toHaveCount(0);
  } finally {
    await request.get("/__mode/v2");
  }
});
