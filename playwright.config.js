const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'https://artsenius.github.io/about',
  },
  testDir: 'tests/specs',
  testMatch: 'sample.spec.js',
}); 