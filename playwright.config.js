const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://artsenius.github.io/about',
    // Add screenshot capture on failure
    screenshot: 'only-on-failure',
    // Add video recording for comprehensive tests
    video: 'retain-on-failure',
    // Add trace for debugging
    trace: 'on-first-retry',
  },
  testDir: 'tests/specs',
  // Update to include both sample and aboutMe tests
  testMatch: ['sample.spec.js', 'aboutMe.spec.js'],
  // Add timeout for comprehensive tests
  timeout: 60000,
  // Configure reporters
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['line']
  ],
  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
        viewport: { width: 1200, height: 800 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...require('@playwright/test').devices['Desktop Firefox'],
        viewport: { width: 1200, height: 800 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...require('@playwright/test').devices['Desktop Safari'],
        viewport: { width: 1200, height: 800 }
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...require('@playwright/test').devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...require('@playwright/test').devices['iPhone 12'] },
    },
  ],
  // Configure test output directory
  outputDir: 'test-results/',
  // Configure screenshot directory
  use: {
    ...module.exports.use,
    screenshotMode: 'only-on-failure',
  },
}); 