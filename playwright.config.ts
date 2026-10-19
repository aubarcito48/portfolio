import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4300';
const useExternalServer = Boolean(process.env.PLAYWRIGHT_BASE_URL);
const browsers = ['chromium', 'firefox', 'webkit'] as const;
const viewports = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
] as const;

export default defineConfig({
  testDir: './e2e',
  testIgnore: process.env.PORTFOLIO_REAL_API === '1' ? [] : ['**/real-api.spec.ts'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR || 'playwright-report',
        open: 'never',
      },
    ],
    [
      'json',
      { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_FILE || 'test-results/results.json' },
    ],
  ],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: browsers.flatMap((browserName) =>
    viewports.map(({ name, width, height }) => ({
      name: `${browserName}-${name}`,
      use: {
        browserName,
        viewport: { width, height },
        deviceScaleFactor: 1,
      },
    })),
  ),
  ...(useExternalServer
    ? {}
    : {
        webServer: {
          command: 'npm start -- --host 127.0.0.1 --port 4300',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
