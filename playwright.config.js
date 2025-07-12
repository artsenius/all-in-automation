const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/specs',
  testMatch: '**/*.spec.js',
  timeout: 60000, // Increased timeout for comprehensive tests
  
  use: {
    baseURL: 'https://artsenius.github.io/about',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Global test settings
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Additional context options
    ignoreHTTPSErrors: true,
    bypassCSP: false
  },
  
  // Test execution settings
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  projects: [
    // Desktop browsers - Core testing
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      }
    },
    
    // Mobile devices - Responsive testing
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5']
      }
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12']
      }
    },
    {
      name: 'mobile-edge',
      use: { 
        ...devices['Galaxy S9+']
      }
    },
    
    // Tablet devices
    {
      name: 'tablet-ipad',
      use: { 
        ...devices['iPad Pro']
      }
    },
    {
      name: 'tablet-android',
      use: {
        ...devices['Galaxy Tab S4']
      }
    },
    
    // Performance testing (throttled network)
    {
      name: 'performance-test',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Simulate slow 3G for performance testing
        launchOptions: {
          args: ['--enable-features=NetworkService']
        }
      }
    },
    
    // Accessibility testing
    {
      name: 'accessibility-test',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        // Reduced motion for accessibility testing
        reducedMotion: 'reduce'
      }
    }
  ],
  
  // Enhanced reporting
  reporter: [
    ['html', { 
      outputFolder: 'test-results/html-report',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results/results.json'
    }],
    ['junit', { 
      outputFile: 'test-results/junit.xml'
    }],
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'test-results/allure-results',
      suiteTitle: false
    }]
  ],
  
  // Output configuration
  outputDir: 'test-results/artifacts',
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),
  
  // Test configuration
  expect: {
    // Visual comparison threshold
    threshold: 0.2,
    // Animation handling
    toHaveScreenshot: { 
      threshold: 0.2,
      maxDiffPixels: 100,
      animations: 'disabled'
    },
    toMatchSnapshot: { 
      threshold: 0.2,
      maxDiffPixels: 100
    }
  },
  
  // Web server configuration (if needed for local development)
  webServer: process.env.NODE_ENV === 'development' ? {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  } : undefined
}); 