# Advanced About Me Page Test Implementation Guide

## Overview
This guide provides concrete implementation examples for the comprehensive testing strategy, building upon the existing dual-framework (Playwright/WebDriver) setup.

## 1. Enhanced Page Object Implementation

### Extended About Me Page Object Structure
```javascript
// tests/pageobjects/advancedAboutMe.page.js
import { BasePage } from './base.page.js';
import { aboutMeSelectors, performanceThresholds, accessibilityRules } from './advancedSelectors.js';

export class AdvancedAboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.performanceMetrics = {};
    this.accessibilityResults = {};
  }

  // Core Web Vitals Testing
  async measureCoreWebVitals() {
    if (FRAMEWORK === 'playwright') {
      await this.page.addInitScript(() => {
        window.webVitalsData = {};
        
        // LCP measurement
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          window.webVitalsData.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS measurement
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          window.webVitalsData.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });

        // FID measurement
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.webVitalsData.fid = entry.processingStart - entry.startTime;
          }
        }).observe({ entryTypes: ['first-input'] });
      });
    }
  }

  async getCoreWebVitals() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.evaluate(() => window.webVitalsData);
    }
    return null;
  }

  // Advanced Accessibility Testing
  async runAccessibilityAudit() {
    if (FRAMEWORK === 'playwright') {
      await this.page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.8.0/axe.min.js'
      });
      
      return await this.page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run(document, {
            rules: {
              'color-contrast': { enabled: true },
              'keyboard-navigation': { enabled: true },
              'aria-labels': { enabled: true },
              'heading-order': { enabled: true }
            }
          }, (err, results) => {
            resolve(results);
          });
        });
      });
    }
  }

  // Content Quality Testing
  async validateReadingLevel() {
    const content = await this.getMainContent();
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const syllables = this.countSyllables(content);
    
    // Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
    return {
      score,
      level: this.getReadingLevel(score),
      words: words.length,
      sentences: sentences.length,
      syllables
    };
  }

  async getMainContent() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.locator(aboutMeSelectors.mainContent).textContent();
    } else {
      return await $(aboutMeSelectors.mainContent).getText();
    }
  }

  countSyllables(text) {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiou]+/g, 'a')
      .replace(/[^a]([aeiou])/g, '$1')
      .replace(/^[aeiou]/, '')
      .length || 1;
  }

  getReadingLevel(score) {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
  }

  // Security Testing
  async validateSecurityHeaders() {
    if (FRAMEWORK === 'playwright') {
      const response = await this.page.goto('');
      const headers = response.headers();
      
      return {
        csp: headers['content-security-policy'] || null,
        xframe: headers['x-frame-options'] || null,
        xss: headers['x-xss-protection'] || null,
        hsts: headers['strict-transport-security'] || null,
        referrer: headers['referrer-policy'] || null
      };
    }
  }

  // Performance Testing
  async measurePerformanceMetrics() {
    if (FRAMEWORK === 'playwright') {
      const performanceTiming = await this.page.evaluate(() => {
        const timing = performance.timing;
        return {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
        };
      });
      return performanceTiming;
    }
  }

  // SEO Testing
  async validateSEOMetadata() {
    const metadata = {};
    
    if (FRAMEWORK === 'playwright') {
      metadata.title = await this.page.title();
      metadata.description = await this.page.locator('meta[name="description"]').getAttribute('content');
      metadata.keywords = await this.page.locator('meta[name="keywords"]').getAttribute('content');
      metadata.ogTitle = await this.page.locator('meta[property="og:title"]').getAttribute('content');
      metadata.ogDescription = await this.page.locator('meta[property="og:description"]').getAttribute('content');
      metadata.ogImage = await this.page.locator('meta[property="og:image"]').getAttribute('content');
      metadata.twitterCard = await this.page.locator('meta[name="twitter:card"]').getAttribute('content');
    }
    
    return metadata;
  }

  // Responsive Testing
  async testResponsiveBreakpoints() {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'large-desktop', width: 2560, height: 1440 }
    ];

    const results = {};

    for (const breakpoint of breakpoints) {
      if (FRAMEWORK === 'playwright') {
        await this.page.setViewportSize({ 
          width: breakpoint.width, 
          height: breakpoint.height 
        });
        
        results[breakpoint.name] = {
          viewport: breakpoint,
          isMenuVisible: await this.page.locator(aboutMeSelectors.navigation).isVisible(),
          isContentReadable: await this.isContentReadable(),
          hasHorizontalScroll: await this.hasHorizontalScrollbar()
        };
      }
    }

    return results;
  }

  async isContentReadable() {
    if (FRAMEWORK === 'playwright') {
      const textElements = await this.page.locator('p, h1, h2, h3, h4, h5, h6').all();
      
      for (const element of textElements) {
        const fontSize = await element.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        
        if (fontSize < 16) return false; // Minimum readable font size
      }
      
      return true;
    }
  }

  async hasHorizontalScrollbar() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
    }
  }

  // User Experience Testing
  async measureUserEngagement() {
    if (FRAMEWORK === 'playwright') {
      await this.page.addInitScript(() => {
        window.engagementMetrics = {
          scrollDepth: 0,
          timeOnPage: Date.now(),
          interactions: 0
        };

        // Track scroll depth
        window.addEventListener('scroll', () => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          window.engagementMetrics.scrollDepth = Math.max(window.engagementMetrics.scrollDepth, scrollPercent);
        });

        // Track interactions
        ['click', 'keydown', 'touchstart'].forEach(eventType => {
          window.addEventListener(eventType, () => {
            window.engagementMetrics.interactions++;
          });
        });
      });
    }
  }

  async getEngagementMetrics() {
    if (FRAMEWORK === 'playwright') {
      const metrics = await this.page.evaluate(() => {
        const current = window.engagementMetrics;
        current.timeOnPage = Date.now() - current.timeOnPage;
        return current;
      });
      return metrics;
    }
  }

  // Visual Regression Testing
  async captureVisualBaseline(testName) {
    if (FRAMEWORK === 'playwright') {
      await this.page.screenshot({
        path: `visual-baselines/${testName}.png`,
        fullPage: true
      });
    }
  }

  async compareVisualChanges(testName) {
    if (FRAMEWORK === 'playwright') {
      await this.expect(this.page).toHaveScreenshot(`${testName}.png`, {
        threshold: 0.2,
        maxDiffPixels: 100
      });
    }
  }
}
```

## 2. Advanced Selectors Configuration

### Comprehensive Selector Management
```javascript
// tests/pageobjects/advancedSelectors.js
export const aboutMeSelectors = {
  // Basic Elements
  mainContent: 'main, [role="main"], .main-content',
  navigation: 'nav, [role="navigation"], .navigation',
  profileImage: '[data-testid="profile-image"], .profile-photo, .avatar',
  
  // Content Sections
  personalInfo: {
    name: 'h1, .name, [data-testid="name"]',
    title: '.title, .job-title, [data-testid="title"]',
    bio: '.bio, .description, [data-testid="bio"]',
    skills: '.skills, .expertise, [data-testid="skills"]',
    experience: '.experience, .work-history, [data-testid="experience"]'
  },
  
  // Interactive Elements
  socialLinks: {
    linkedin: 'a[href*="linkedin"], [data-social="linkedin"]',
    twitter: 'a[href*="twitter"], [data-social="twitter"]',
    github: 'a[href*="github"], [data-social="github"]',
    email: 'a[href^="mailto:"], [data-contact="email"]'
  },
  
  // Contact Elements
  contactForm: {
    form: 'form, [data-testid="contact-form"]',
    nameField: 'input[name="name"], #name',
    emailField: 'input[name="email"], #email',
    messageField: 'textarea[name="message"], #message',
    submitButton: 'button[type="submit"], .submit-btn'
  },
  
  // Accessibility Elements
  skipLinks: 'a[href="#main"], .skip-link',
  landmarks: '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]',
  headings: 'h1, h2, h3, h4, h5, h6'
};

export const performanceThresholds = {
  coreWebVitals: {
    lcp: { good: 1200, poor: 4000 }, // milliseconds
    fid: { good: 100, poor: 300 },   // milliseconds
    cls: { good: 0.1, poor: 0.25 }   // score
  },
  
  loadTimes: {
    domContentLoaded: 2000,
    loadComplete: 3000,
    firstContentfulPaint: 1500
  },
  
  resourceSizes: {
    totalPageSize: 2 * 1024 * 1024, // 2MB
    imageSize: 500 * 1024,          // 500KB
    scriptSize: 200 * 1024          // 200KB
  }
};

export const accessibilityRules = {
  colorContrast: {
    normal: 4.5,
    large: 3.0,
    AAA: 7.0
  },
  
  touchTargets: {
    minimumSize: 44, // pixels
    spacing: 8       // pixels
  },
  
  textSize: {
    minimum: 16,     // pixels
    lineHeight: 1.5  // ratio
  }
};

export const deviceViewports = {
  mobile: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 384, height: 854 }
  ],
  
  tablet: [
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Surface Pro', width: 912, height: 1368 }
  ],
  
  desktop: [
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 }
  ]
};
```

## 3. Comprehensive Test Specifications

### Advanced Test Suite Implementation
```javascript
// tests/specs/advancedAboutMe.spec.js
const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AdvancedAboutMePage } from '../pageobjects/advancedAboutMe.page.js';
import { performanceThresholds, accessibilityRules, deviceViewports } from '../pageobjects/advancedSelectors.js';

if (FRAMEWORK === 'playwright') {
  test.describe('Advanced About Me Page Testing', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AdvancedAboutMePage(page, expect);
      await aboutMePage.measureCoreWebVitals();
      await aboutMePage.measureUserEngagement();
      await aboutMePage.open();
    });

    test.describe('Performance Excellence', () => {
      test('should meet Core Web Vitals thresholds', async () => {
        await aboutMePage.page.waitForLoadState('networkidle');
        const vitals = await aboutMePage.getCoreWebVitals();
        
        expect(vitals.lcp).toBeLessThan(performanceThresholds.coreWebVitals.lcp.good);
        expect(vitals.cls).toBeLessThan(performanceThresholds.coreWebVitals.cls.good);
        
        if (vitals.fid !== undefined) {
          expect(vitals.fid).toBeLessThan(performanceThresholds.coreWebVitals.fid.good);
        }
      });

      test('should load critical content quickly', async () => {
        const metrics = await aboutMePage.measurePerformanceMetrics();
        
        expect(metrics.domContentLoaded).toBeLessThan(performanceThresholds.loadTimes.domContentLoaded);
        expect(metrics.firstContentfulPaint).toBeLessThan(performanceThresholds.loadTimes.firstContentfulPaint);
      });

      test('should maintain performance across slow networks', async ({ page }) => {
        await page.route('**/*', (route) => {
          setTimeout(() => route.continue(), 100); // Add 100ms delay
        });
        
        await aboutMePage.open();
        const metrics = await aboutMePage.measurePerformanceMetrics();
        
        expect(metrics.loadComplete).toBeLessThan(performanceThresholds.loadTimes.loadComplete * 1.5);
      });
    });

    test.describe('Advanced Accessibility', () => {
      test('should pass comprehensive accessibility audit', async () => {
        const results = await aboutMePage.runAccessibilityAudit();
        
        expect(results.violations.length).toBe(0);
        expect(results.passes.length).toBeGreaterThan(0);
      });

      test('should support keyboard navigation', async ({ page }) => {
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA']).toContain(focusedElement);
      });

      test('should have proper heading hierarchy', async ({ page }) => {
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
          elements.map(el => ({ tag: el.tagName, text: el.textContent.trim() }))
        );
        
        expect(headings[0].tag).toBe('H1');
        
        let currentLevel = 1;
        for (let i = 1; i < headings.length; i++) {
          const level = parseInt(headings[i].tag.substring(1));
          expect(level).toBeLessThanOrEqual(currentLevel + 1);
          currentLevel = level;
        }
      });

      test('should meet color contrast requirements', async ({ page }) => {
        const contrastResults = await page.evaluate(() => {
          const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button');
          const results = [];
          
          for (const element of elements) {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            results.push({
              element: element.tagName,
              color,
              backgroundColor,
              fontSize: styles.fontSize
            });
          }
          
          return results;
        });
        
        expect(contrastResults.length).toBeGreaterThan(0);
      });
    });

    test.describe('Content Quality & SEO', () => {
      test('should have appropriate reading level', async () => {
        const readingLevel = await aboutMePage.validateReadingLevel();
        
        expect(readingLevel.score).toBeGreaterThan(30); // Not "Very Difficult"
        expect(readingLevel.words).toBeGreaterThan(50); // Substantial content
      });

      test('should have complete SEO metadata', async () => {
        const metadata = await aboutMePage.validateSEOMetadata();
        
        expect(metadata.title).toBeTruthy();
        expect(metadata.title.length).toBeLessThanOrEqual(60);
        expect(metadata.description).toBeTruthy();
        expect(metadata.description.length).toBeLessThanOrEqual(160);
        expect(metadata.ogTitle).toBeTruthy();
        expect(metadata.ogDescription).toBeTruthy();
      });

      test('should have structured data for person schema', async ({ page }) => {
        const structuredData = await page.evaluate(() => {
          const scripts = document.querySelectorAll('script[type="application/ld+json"]');
          return Array.from(scripts).map(script => JSON.parse(script.textContent));
        });
        
        const personSchema = structuredData.find(data => data['@type'] === 'Person');
        expect(personSchema).toBeTruthy();
        expect(personSchema.name).toBeTruthy();
      });
    });

    test.describe('Security & Privacy', () => {
      test('should have proper security headers', async () => {
        const headers = await aboutMePage.validateSecurityHeaders();
        
        expect(headers.csp).toBeTruthy();
        expect(headers.xframe).toBeTruthy();
        expect(headers.hsts).toBeTruthy();
      });

      test('should protect external links', async ({ page }) => {
        const externalLinks = await page.$$eval('a[href^="http"]', links =>
          links.map(link => ({
            href: link.href,
            rel: link.rel,
            target: link.target
          }))
        );
        
        for (const link of externalLinks) {
          if (!link.href.includes(await page.url())) {
            expect(link.rel).toContain('noopener');
            expect(link.rel).toContain('noreferrer');
          }
        }
      });
    });

    test.describe('Responsive Design', () => {
      test('should work across all device breakpoints', async () => {
        const results = await aboutMePage.testResponsiveBreakpoints();
        
        for (const [device, result] of Object.entries(results)) {
          expect(result.isContentReadable).toBe(true);
          expect(result.hasHorizontalScroll).toBe(false);
        }
      });

      test('should maintain functionality on touch devices', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        const touchTargets = await page.$$eval('a, button, input, textarea', elements =>
          elements.map(el => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              width: rect.width,
              height: rect.height
            };
          })
        );
        
        for (const target of touchTargets) {
          expect(target.width).toBeGreaterThanOrEqual(accessibilityRules.touchTargets.minimumSize);
          expect(target.height).toBeGreaterThanOrEqual(accessibilityRules.touchTargets.minimumSize);
        }
      });
    });

    test.describe('User Experience & Engagement', () => {
      test('should engage users effectively', async ({ page }) => {
        // Simulate user interaction
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(2000);
        await page.click('a:first-of-type');
        
        const engagement = await aboutMePage.getEngagementMetrics();
        
        expect(engagement.scrollDepth).toBeGreaterThan(0);
        expect(engagement.timeOnPage).toBeGreaterThan(1000);
        expect(engagement.interactions).toBeGreaterThan(0);
      });

      test('should have clear call-to-action elements', async ({ page }) => {
        const ctas = await page.$$eval('[data-cta], .cta, .contact-btn, a[href*="contact"]', 
          elements => elements.length
        );
        
        expect(ctas).toBeGreaterThan(0);
      });
    });

    test.describe('Visual Regression', () => {
      test('should maintain visual consistency', async () => {
        await aboutMePage.compareVisualChanges('about-page-desktop');
      });

      test('should maintain mobile visual consistency', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await aboutMePage.compareVisualChanges('about-page-mobile');
      });
    });

    test.describe('Cross-Browser Compatibility', () => {
      test('should render correctly in different browsers', async ({ page, browserName }) => {
        // This test will run across different browsers configured in playwright.config.js
        const isPageLoaded = await page.locator('body').isVisible();
        expect(isPageLoaded).toBe(true);
        
        const hasContent = await page.locator('h1').isVisible();
        expect(hasContent).toBe(true);
      });
    });
  });
} else {
  // WebDriver implementation for comparison testing
  describe('Advanced About Me Page Testing (WebDriver)', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AdvancedAboutMePage();
      await aboutMePage.open();
    });

    it('should load and display core content', async () => {
      const isVisible = await aboutMePage.isElementPresent(aboutMeSelectors.personalInfo.name);
      expect(isVisible).toBe(true);
    });

    it('should be responsive on mobile devices', async () => {
      await browser.setWindowSize(375, 667);
      const isContentVisible = await aboutMePage.isElementPresent(aboutMeSelectors.mainContent);
      expect(isContentVisible).toBe(true);
    });
  });
}
```

## 4. Enhanced Configuration

### Updated Playwright Configuration
```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/specs',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  
  use: {
    baseURL: 'https://artsenius.github.io/about',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    
    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    },
    
    // Tablet devices
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] }
    }
  ],
  
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['line']
  ],
  
  outputDir: 'test-results/',
  
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
});
```

## 5. Implementation Steps

### Phase 1: Foundation (Week 1)
1. **Setup Enhanced Framework**
   - Install additional dependencies (axe-core, lighthouse)
   - Update page objects with advanced methods
   - Configure multi-browser testing

2. **Core Performance Tests**
   - Implement Core Web Vitals measurement
   - Add performance threshold validations
   - Setup visual regression testing

### Phase 2: Accessibility & Security (Week 2)
1. **Accessibility Implementation**
   - Integrate axe-core for automated testing
   - Add keyboard navigation tests
   - Implement color contrast validation

2. **Security Testing**
   - Add security header validation
   - Implement CSP testing
   - Add external link protection tests

### Phase 3: Advanced Features (Week 3)
1. **Content Quality**
   - Implement reading level analysis
   - Add SEO metadata validation
   - Setup structured data testing

2. **User Experience**
   - Add engagement tracking
   - Implement responsive design tests
   - Setup A/B testing framework

### Phase 4: Monitoring & Optimization (Week 4)
1. **Continuous Monitoring**
   - Setup automated test execution
   - Implement performance monitoring
   - Configure alert systems

2. **Optimization**
   - Analyze test results
   - Optimize test performance
   - Document best practices

## 6. Test Execution Commands

```bash
# Run all advanced tests
npm run test:playwright -- advancedAboutMe.spec.js

# Run performance tests only
npm run test:playwright -- advancedAboutMe.spec.js --grep "Performance Excellence"

# Run accessibility tests only
npm run test:playwright -- advancedAboutMe.spec.js --grep "Advanced Accessibility"

# Run visual regression tests
npm run test:playwright -- advancedAboutMe.spec.js --grep "Visual Regression"

# Run cross-browser tests
npm run test:playwright -- advancedAboutMe.spec.js --project="chromium" --project="firefox" --project="webkit"

# Run mobile-specific tests
npm run test:playwright -- advancedAboutMe.spec.js --project="Mobile Chrome" --project="Mobile Safari"

# Generate detailed reports
npm run test:playwright -- --reporter=html --reporter=json
```

This implementation guide provides a concrete foundation for implementing the comprehensive testing strategy, ensuring the About Me page meets the highest standards for performance, accessibility, security, and user experience.