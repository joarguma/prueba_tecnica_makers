import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  forbidOnly: true,
  retries: 1,
  workers: 3,
  reporter: 'html',

  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});

export default config;
