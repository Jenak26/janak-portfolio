import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  workers: 1, // the takeover test switches what the shared server serves
  reporter: "list",
  use: {
    baseURL: "http://localhost:4174",
    channel: "chrome",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    serviceWorkers: "allow",
    acceptDownloads: true,
    timezoneId: "Asia/Kolkata",
  },
  webServer: { command: "node tests/e2e/server.mjs", url: "http://localhost:4174/deadlines/", reuseExistingServer: true },
});
