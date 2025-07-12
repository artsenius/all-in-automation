// Global setup for About Me page testing
const fs = require('fs');
const path = require('path');

async function globalSetup() {
  console.log('🚀 Starting About Me page testing suite...');
  
  // Create test result directories
  const directories = [
    'test-results',
    'test-results/html-report',
    'test-results/allure-results',
    'test-results/artifacts',
    'screenshots',
    'visual-baselines'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Set environment variables for testing
  process.env.TEST_START_TIME = Date.now().toString();
  
  // Log test configuration
  console.log('🔧 Test Configuration:');
  console.log(`   Framework: ${process.env.FRAMEWORK || 'playwright'}`);
  console.log(`   Base URL: ${process.env.PLAYWRIGHT_BASE_URL || 'https://artsenius.github.io/about'}`);
  console.log(`   CI Mode: ${process.env.CI ? 'Yes' : 'No'}`);
  console.log(`   Node Version: ${process.version}`);
  
  // Validate base URL accessibility (basic check)
  try {
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('🌐 Validating base URL accessibility...');
    const response = await page.goto('https://artsenius.github.io/about', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    if (response.status() === 200) {
      console.log('✅ Base URL is accessible');
    } else {
      console.warn(`⚠️  Base URL returned status: ${response.status()}`);
    }
    
    await browser.close();
  } catch (error) {
    console.warn(`⚠️  Could not validate base URL: ${error.message}`);
  }

  console.log('✅ Global setup completed successfully\n');
}

module.exports = globalSetup;