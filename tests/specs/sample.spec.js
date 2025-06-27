const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { SamplePage } from '../pageobjects/sample.page.js';

if (FRAMEWORK === 'playwright') {
  test.describe('Profile image', () => {
    test('should be present', async ({ page }) => {
      const samplePage = new SamplePage(page, expect);
      await samplePage.open();
      await samplePage.isProfileImagePresent();
    });
  });
} else {
  console.log('Running in WDIO');
  describe('Profile image', () => {
    it('should be present', async() => {
      const samplePage = new SamplePage();
      await samplePage.open();
      await samplePage.isProfileImagePresent();
    });
  }); 
}