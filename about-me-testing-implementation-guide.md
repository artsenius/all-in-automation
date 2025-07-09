# About Me Page Testing Implementation Guide
## Advanced Testing Framework for https://www.arthursenko.com

### 🚀 Quick Start

#### Running the Tests
```bash
# Run Playwright tests
npm run test:playwright

# Run WebDriver tests  
npm run test:wdio

# Run specific test suites
npx playwright test --grep "Content Validation"
npx playwright test --grep "Performance Testing"
npx playwright test --grep "Accessibility Testing"
```

#### Environment Configuration
```bash
# Set framework environment variable
export FRAMEWORK=playwright  # or 'wdio'

# Set target environment
export TEST_ENV=production    # or 'staging', 'development'
```

## 📋 Additional Test Scenarios

### 1. **Advanced Content Testing**

#### Dynamic Content Validation
```javascript
test('should handle dynamic content updates', async ({ page }) => {
  // Test content that changes based on user interaction
  await aboutMePage.open();
  
  const initialBio = await aboutMePage.getProfileBio();
  
  // Click "Read More" if available
  const expandButton = page.locator('[data-testid="expand-bio"]');
  if (await expandButton.count() > 0) {
    await expandButton.click();
    const expandedBio = await aboutMePage.getProfileBio();
    
    expect(expandedBio.length).toBeGreaterThan(initialBio.length);
  }
});
```

#### Content Localization Testing
```javascript
test('should support multiple languages', async ({ page }) => {
  const languages = ['en', 'es', 'fr', 'de'];
  
  for (const lang of languages) {
    await page.goto(`https://www.arthursenko.com?lang=${lang}`);
    
    const pageTitle = await aboutMePage.getPageTitle();
    const metaTags = await aboutMePage.validateMetaTags();
    
    expect(pageTitle).toBeTruthy();
    expect(metaTags.title).toBeTruthy();
    
    // Verify language-specific content
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe(lang);
  }
});
```

### 2. **Advanced Performance Testing**

#### Memory Leak Detection
```javascript
test('should not have memory leaks during navigation', async ({ page }) => {
  const initialMemory = await page.evaluate(() => {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  });
  
  // Navigate around the page multiple times
  for (let i = 0; i < 10; i++) {
    await page.reload();
    await page.waitForLoadState('networkidle');
  }
  
  const finalMemory = await page.evaluate(() => {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  });
  
  // Memory shouldn't increase significantly
  const memoryIncrease = finalMemory - initialMemory;
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB threshold
});
```

#### Resource Loading Optimization
```javascript
test('should prioritize critical resources', async ({ page }) => {
  const resourceTimings = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    return resources.map(resource => ({
      name: resource.name,
      startTime: resource.startTime,
      responseEnd: resource.responseEnd,
      transferSize: resource.transferSize
    }));
  });
  
  // CSS should load before non-critical images
  const cssFiles = resourceTimings.filter(r => r.name.includes('.css'));
  const images = resourceTimings.filter(r => r.name.includes('.jpg') || r.name.includes('.png'));
  
  if (cssFiles.length > 0 && images.length > 0) {
    const firstCSS = Math.min(...cssFiles.map(f => f.startTime));
    const firstImage = Math.min(...images.map(i => i.startTime));
    
    expect(firstCSS).toBeLessThanOrEqual(firstImage);
  }
});
```

### 3. **Advanced Accessibility Testing**

#### Screen Reader Simulation
```javascript
test('should work with screen readers', async ({ page }) => {
  // Inject axe-core for comprehensive accessibility testing
  await page.addScriptTag({
    url: 'https://unpkg.com/axe-core@4.0.0/axe.min.js'
  });
  
  const axeResults = await page.evaluate(() => {
    return new Promise((resolve) => {
      axe.run(document, (err, results) => {
        resolve(results);
      });
    });
  });
  
  expect(axeResults.violations).toHaveLength(0);
  
  // Test specific screen reader scenarios
  const landmarkElements = await page.locator('[role="main"], [role="navigation"], [role="banner"]').count();
  expect(landmarkElements).toBeGreaterThan(0);
});
```

#### Voice Navigation Testing
```javascript
test('should support voice commands', async ({ page }) => {
  // Test voice-accessible elements
  const voiceTargets = await page.locator('[aria-label], [title], button, a').all();
  
  for (const target of voiceTargets) {
    const ariaLabel = await target.getAttribute('aria-label');
    const title = await target.getAttribute('title');
    const textContent = await target.textContent();
    
    // Every interactive element should have a voice-accessible name
    const hasVoiceName = !!(ariaLabel || title || textContent?.trim());
    expect(hasVoiceName).toBe(true);
  }
});
```

### 4. **Advanced Security Testing**

#### Content Security Policy Validation
```javascript
test('should have strict CSP policy', async ({ page }) => {
  const securityHeaders = await aboutMePage.validateSecurityHeaders();
  
  if (securityHeaders.contentSecurityPolicy) {
    const csp = securityHeaders.contentSecurityPolicy;
    
    // Verify CSP directives
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src");
    expect(csp).toContain("style-src");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("'unsafe-inline'");
  }
});
```

#### Third-Party Script Security
```javascript
test('should validate third-party script integrity', async ({ page }) => {
  const scripts = await page.locator('script[src]').all();
  
  for (const script of scripts) {
    const src = await script.getAttribute('src');
    const integrity = await script.getAttribute('integrity');
    
    // External scripts should have integrity attributes
    if (src && (src.includes('//') && !src.includes(page.url()))) {
      expect(integrity).toBeTruthy();
    }
  }
});
```

### 5. **Advanced Responsive Testing**

#### Orientation Change Testing
```javascript
test('should handle device orientation changes', async ({ page }) => {
  const orientations = [
    { width: 375, height: 667 },  // Portrait
    { width: 667, height: 375 }   // Landscape
  ];
  
  for (const viewport of orientations) {
    await page.setViewportSize(viewport);
    await page.waitForLoadState('networkidle');
    
    const layoutInfo = await aboutMePage.testResponsiveLayout(viewport);
    expect(layoutInfo.hasHorizontalScroll).toBe(false);
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot(`orientation-${viewport.width}x${viewport.height}.png`);
  }
});
```

#### Print Media Testing
```javascript
test('should have appropriate print styles', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  
  // Check print-specific styles
  const printStyles = await page.evaluate(() => {
    const style = window.getComputedStyle(document.body);
    return {
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize
    };
  });
  
  // Print styles should optimize for readability
  expect(printStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)'); // Transparent
  expect(printStyles.color).toContain('rgb(0, 0, 0)'); // Black text
});
```

### 6. **Analytics and Tracking Testing**

#### Google Analytics Integration
```javascript
test('should properly track user interactions', async ({ page }) => {
  // Mock Google Analytics
  await page.route('**/google-analytics.com/**', route => {
    route.fulfill({ status: 200, body: '{}' });
  });
  
  let analyticsEvents = [];
  
  // Capture GA events
  page.on('request', request => {
    if (request.url().includes('google-analytics.com/collect')) {
      analyticsEvents.push(request.url());
    }
  });
  
  await aboutMePage.open();
  
  // Interact with tracked elements
  const socialLinks = await page.locator('[data-testid="social-links"] a').all();
  if (socialLinks.length > 0) {
    await socialLinks[0].click();
  }
  
  // Verify tracking events were fired
  expect(analyticsEvents.length).toBeGreaterThan(0);
});
```

### 7. **Load Testing Scenarios**

#### Concurrent User Simulation
```javascript
test('should handle multiple concurrent users', async ({ browser }) => {
  const contexts = [];
  const pages = [];
  
  // Simulate 10 concurrent users
  for (let i = 0; i < 10; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    contexts.push(context);
    pages.push(page);
  }
  
  // All users visit the page simultaneously
  const loadPromises = pages.map(page => page.goto('https://www.arthursenko.com'));
  const loadResults = await Promise.all(loadPromises);
  
  // All requests should succeed
  loadResults.forEach(response => {
    expect(response.status()).toBe(200);
  });
  
  // Cleanup
  await Promise.all(contexts.map(context => context.close()));
});
```

### 8. **API Integration Testing**

#### Contact Form Backend Testing
```javascript
test('should validate contact form submission', async ({ page }) => {
  let formSubmissionCaptured = false;
  
  // Intercept form submission
  await page.route('**/contact', route => {
    formSubmissionCaptured = true;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
  
  const contactForm = page.locator('[data-testid="contact-form"]');
  
  if (await contactForm.count() > 0) {
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message content');
    
    await page.click('button[type="submit"]');
    
    // Wait for form submission
    await page.waitForTimeout(1000);
    
    expect(formSubmissionCaptured).toBe(true);
  }
});
```

## 🔧 Custom Test Utilities

### Performance Monitoring Utility
```javascript
class PerformanceMonitor {
  static async measurePageLoad(page) {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    return metrics;
  }
  
  static async measureCoreWebVitals(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.name === 'cumulative-layout-shift') {
              vitals.cls = entry.value;
            }
          });
          
          if (vitals.lcp !== undefined && vitals.cls !== undefined) {
            resolve(vitals);
          }
        }).observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve(vitals), 5000);
      });
    });
  }
}
```

### Accessibility Testing Utility
```javascript
class AccessibilityTester {
  static async auditPage(page) {
    // Inject axe-core
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@latest/axe.min.js'
    });
    
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run(document, {
          rules: {
            'color-contrast': { enabled: true },
            'keyboard-navigation': { enabled: true },
            'aria-labels': { enabled: true }
          }
        }, (err, results) => {
          resolve(results);
        });
      });
    });
    
    return results;
  }
  
  static async testKeyboardFlow(page) {
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    const focusOrder = [];
    
    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el.tagName,
          id: el.id,
          className: el.className,
          text: el.textContent?.trim().substring(0, 50)
        };
      });
      
      focusOrder.push(focused);
    }
    
    return focusOrder;
  }
}
```

## 📊 Test Reporting and Monitoring

### Custom Reporter Integration
```javascript
// Add to playwright.config.js
module.exports = {
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['./custom-reporter.js']
  ],
  
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
};
```

### CI/CD Integration Example
```yaml
# .github/workflows/about-me-tests.yml
name: About Me Page Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *' # Daily at 6 AM

jobs:
  test-about-page:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        framework: [playwright, wdio]
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install
        
      - name: Run About Me tests
        env:
          FRAMEWORK: ${{ matrix.framework }}
        run: npm run test:${{ matrix.framework }}
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.framework }}-${{ matrix.browser }}
          path: test-results/
```

This comprehensive implementation guide provides you with advanced testing scenarios and utilities that go beyond basic functionality testing, ensuring your About Me page meets the highest standards for performance, accessibility, security, and user experience.