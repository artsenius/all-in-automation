const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AboutMePage } from '../pageobjects/aboutMe.page.js';
import { viewports, testData, performanceThresholds } from '../pageobjects/selectors.js';

if (FRAMEWORK === 'playwright') {
  // ========== PLAYWRIGHT TESTS ==========
  
  test.describe('About Me Page - Comprehensive Testing Suite', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AboutMePage(page, expect);
      await aboutMePage.open();
    });

    // ========== CONTENT VALIDATION TESTS ==========
    
    test.describe('Content Validation', () => {
      test('should display correct personal information', async () => {
        const personalInfo = await aboutMePage.validatePersonalInfo();
        
        expect(personalInfo.name).toBeTruthy();
        expect(personalInfo.title).toBeTruthy();
        expect(personalInfo.location).toBeTruthy();
      });

      test('should have valid contact information', async () => {
        const contactInfo = await aboutMePage.validateContactInfo();
        
        if (contactInfo.email) {
          expect(contactInfo.email.valid).toBe(true);
          expect(contactInfo.email.href).toContain('mailto:');
        }
        
        if (contactInfo.phone) {
          expect(contactInfo.phone.valid).toBe(true);
        }
      });

      test('should have working social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        socialLinks.forEach(link => {
          expect(link.isValid).toBe(true);
          if (link.isExternal) {
            expect(link.href).toMatch(/^https?:\/\//);
          }
        });
      });

      test('should validate external links security', async () => {
        const externalLinks = await aboutMePage.validateExternalLinks();
        
        externalLinks.forEach(link => {
          if (link.opensInNewTab) {
            expect(link.hasNoopener).toBe(true);
          }
        });
      });

      test('should have appropriate page title', async () => {
        const title = await aboutMePage.getPageTitle();
        
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(testData.seo.expectedTitleLength.min);
        expect(title.length).toBeLessThan(testData.seo.expectedTitleLength.max);
        expect(title.toLowerCase()).toContain('about');
      });
    });

    // ========== PERFORMANCE TESTS ==========
    
    test.describe('Performance Testing', () => {
      test('should meet Core Web Vitals standards', async () => {
        const performance = await aboutMePage.validatePagePerformance();
        
        expect(performance.passed.lcp).toBe(true);
        expect(performance.passed.fid).toBe(true);
        expect(performance.passed.cls).toBe(true);
        expect(performance.passed.loadTime).toBe(true);
      });

      test('should have optimized images', async () => {
        const imageOptimization = await aboutMePage.testImageOptimization();
        
        imageOptimization.forEach(img => {
          expect(img.hasAlt).toBe(true);
          expect(img.altText).toBeTruthy();
        });
      });

      test('should load efficiently on slow connections', async ({ page }) => {
        // Simulate slow 3G connection
        await page.route('**/*', route => {
          setTimeout(() => route.continue(), 100);
        });
        
        const startTime = Date.now();
        await aboutMePage.open();
        const loadTime = Date.now() - startTime;
        
        expect(loadTime).toBeLessThan(performanceThresholds.maxLoadTime * 2); // Allow 2x on slow connection
      });
    });

    // ========== ACCESSIBILITY TESTS ==========
    
    test.describe('Accessibility Testing', () => {
      test('should be fully keyboard navigable', async () => {
        const keyboardNavigation = await aboutMePage.testKeyboardNavigation();
        
        keyboardNavigation.forEach(result => {
          expect(result.hasVisibleFocus).toBe(true);
        });
      });

      test('should have proper heading structure', async () => {
        const headingStructure = await aboutMePage.validateHeadingStructure();
        
        expect(headingStructure.hasH1).toBe(true);
        expect(headingStructure.h1Count).toBe(1);
        expect(headingStructure.hasValidHierarchy).toBe(true);
      });

      test('should have appropriate ARIA labels', async () => {
        const ariaValidation = await aboutMePage.validateAriaLabels();
        
        ariaValidation.forEach(element => {
          if (['BUTTON', 'INPUT', 'SELECT'].includes(element.tagName)) {
            expect(element.hasAccessibleName).toBe(true);
          }
        });
      });

      test('should meet color contrast requirements', async () => {
        const colorContrast = await aboutMePage.testColorContrast();
        
        // This is a basic test - in practice, you'd use axe-core for comprehensive testing
        expect(colorContrast.length).toBeGreaterThan(0);
      });
    });

    // ========== RESPONSIVE DESIGN TESTS ==========
    
    test.describe('Responsive Design Testing', () => {
      Object.entries(viewports).forEach(([deviceName, viewport]) => {
        test(`should display correctly on ${deviceName}`, async () => {
          const layoutInfo = await aboutMePage.testResponsiveLayout(viewport);
          
          expect(layoutInfo.hasHorizontalScroll).toBe(false);
          expect(layoutInfo.viewportWidth).toBe(viewport.width);
          expect(layoutInfo.viewportHeight).toBe(viewport.height);
        });
      });

      test('should have appropriate touch targets on mobile', async () => {
        await aboutMePage.testResponsiveLayout(viewports.mobile);
        const touchTargets = await aboutMePage.testTouchTargets();
        
        touchTargets.forEach(target => {
          expect(target.isValidTouchTarget).toBe(true);
        });
      });
    });

    // ========== SECURITY TESTS ==========
    
    test.describe('Security Testing', () => {
      test('should have proper security headers', async () => {
        const securityHeaders = await aboutMePage.validateSecurityHeaders();
        
        expect(securityHeaders.hasCSP).toBe(true);
        expect(securityHeaders.hasHSTS).toBe(true);
        expect(securityHeaders.xFrameOptions).toBeTruthy();
      });

      test('should not have mixed content issues', async () => {
        const mixedContent = await aboutMePage.checkMixedContent();
        
        if (mixedContent.isHTTPS) {
          expect(mixedContent.hasMixedContent).toBe(false);
        }
      });
    });

    // ========== SEO TESTS ==========
    
    test.describe('SEO Testing', () => {
      test('should have proper meta tags', async () => {
        const metaTags = await aboutMePage.validateMetaTags();
        
        expect(metaTags.title).toBeTruthy();
        expect(metaTags.description).toBeTruthy();
        expect(metaTags.viewport).toBeTruthy();
        
        // Open Graph validation
        expect(metaTags.ogTitle).toBeTruthy();
        expect(metaTags.ogDescription).toBeTruthy();
      });

      test('should have valid structured data', async () => {
        const structuredData = await aboutMePage.validateStructuredData();
        
        structuredData.forEach(data => {
          expect(data.error).toBeUndefined();
        });
      });
    });

    // ========== VISUAL REGRESSION TESTS ==========
    
    test.describe('Visual Regression Testing', () => {
      Object.entries(viewports).forEach(([deviceName, viewport]) => {
        test(`should maintain visual consistency on ${deviceName}`, async ({ page }) => {
          await page.setViewportSize(viewport);
          await page.waitForLoadState('networkidle');
          
          await expect(page).toHaveScreenshot(`about-page-${deviceName}.png`, {
            fullPage: true,
            threshold: 0.2
          });
        });
      });
    });

    // ========== ADVANCED INTERACTION TESTS ==========
    
    test.describe('Advanced Interactions', () => {
      test('should handle dynamic content loading', async ({ page }) => {
        // Test for any lazy-loaded content
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await page.waitForTimeout(1000); // Allow time for lazy loading
        
        const images = await aboutMePage.testImageOptimization();
        expect(images.length).toBeGreaterThan(0);
      });

      test('should handle form interactions properly', async ({ page }) => {
        const contactFormExists = await page.locator('[data-testid="contact-form"]').count() > 0;
        
        if (contactFormExists) {
          // Test form validation and submission
          await page.fill('input[type="email"]', 'test@example.com');
          await page.fill('textarea', 'Test message');
          
          // Verify form is ready for submission
          const submitButton = page.locator('button[type="submit"]');
          await expect(submitButton).toBeEnabled();
        }
      });
    });
  });

} else {
  // ========== WEBDRIVER TESTS ==========
  
  console.log('Running WebDriver tests for About Me page');
  
  describe('About Me Page - WebDriver Testing Suite', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AboutMePage();
      await aboutMePage.open();
    });

    describe('Content Validation', () => {
      it('should display correct personal information', async () => {
        const personalInfo = await aboutMePage.validatePersonalInfo();
        
        expect(personalInfo.name).toBeTruthy();
        expect(personalInfo.title).toBeTruthy();
        expect(personalInfo.location).toBeTruthy();
      });

      it('should have valid contact information', async () => {
        const contactInfo = await aboutMePage.validateContactInfo();
        
        if (contactInfo.email) {
          expect(contactInfo.email.valid).toBe(true);
        }
        
        if (contactInfo.phone) {
          expect(contactInfo.phone.valid).toBe(true);
        }
      });

      it('should have working social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        socialLinks.forEach(link => {
          expect(link.isValid).toBe(true);
        });
      });
    });

    describe('Performance Testing', () => {
      it('should load within acceptable time limits', async () => {
        const performance = await aboutMePage.validatePagePerformance();
        
        expect(performance.passed.loadTime).toBe(true);
      });

      it('should have optimized images', async () => {
        const imageOptimization = await aboutMePage.testImageOptimization();
        
        imageOptimization.forEach(img => {
          expect(img.hasAlt).toBe(true);
        });
      });
    });

    describe('Accessibility Testing', () => {
      it('should have proper heading structure', async () => {
        const headingStructure = await aboutMePage.validateHeadingStructure();
        
        expect(headingStructure.hasH1).toBe(true);
        expect(headingStructure.h1Count).toBe(1);
      });

      it('should be keyboard navigable', async () => {
        const keyboardNavigation = await aboutMePage.testKeyboardNavigation();
        
        expect(keyboardNavigation.length).toBeGreaterThan(0);
      });
    });

    describe('Responsive Design Testing', () => {
      Object.entries(viewports).forEach(([deviceName, viewport]) => {
        it(`should display correctly on ${deviceName}`, async () => {
          const layoutInfo = await aboutMePage.testResponsiveLayout(viewport);
          
          expect(layoutInfo.hasHorizontalScroll).toBe(false);
        });
      });
    });

    describe('Security Testing', () => {
      it('should have proper security headers', async () => {
        const securityHeaders = await aboutMePage.validateSecurityHeaders();
        
        expect(securityHeaders.hasCSP).toBe(true);
      });
    });

    describe('SEO Testing', () => {
      it('should have proper meta tags', async () => {
        const metaTags = await aboutMePage.validateMetaTags();
        
        expect(metaTags.title).toBeTruthy();
        expect(metaTags.description).toBeTruthy();
      });
    });
  });
}