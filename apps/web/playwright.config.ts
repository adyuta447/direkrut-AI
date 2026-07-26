import { defineConfig, devices } from "@playwright/test"

const baseURL = "http://127.0.0.1:3100"

export default defineConfig({
  testDir: "./tests/ui",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  outputDir: "../../output/qa/ui-artifacts",
  reporter: [
    ["list"],
    ["html", { outputFolder: "../../output/qa/ui-report", open: "never" }],
    ["junit", { outputFile: "../../output/qa/ui-results.xml" }],
    ["json", { outputFile: "../../output/qa/ui-results.json" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3999 yarn dev --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
