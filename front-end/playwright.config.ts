import { defineConfig, devices } from "@playwright/test";

/** Phase 6 read-only browser smoke tests against a running frontend + staging backend. */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "phase6.spec.ts",
  timeout: 25_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [ ["list"], ["junit", { outputFile: "test-results/phase6.xml" }] ] : "list",
  use: {
    baseURL: process.env.PHASE6_WEB_URL || "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 10_000,
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
});
