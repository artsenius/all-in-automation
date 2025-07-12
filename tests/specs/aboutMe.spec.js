const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AboutMePage } from '../pageobjects/aboutMe.page.js';
import { performanceThresholds, accessibilityRules, seoRules, contentQuality } from '../pageobjects/selectors.js';

if (FRAMEWORK === 'playwright') {
  test.describe('About Me Page - Comprehensive Testing Suite', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AboutMePage(page, expect);
      await aboutMePage.measureCoreWebVitals();
      await aboutMePage.measureUserEngagement();
      await aboutMePage.open();
    });

    test.describe('Core Functionality', () => {
      test('should display essential page elements', async () => {
        // Basic page structure validation
        const title = await aboutMePage.getPageTitle();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(10);

        // Profile image presence
        await aboutMePage.isProfileImagePresent();

        // Main content visibility
        const content = await aboutMePage.getMainContent();
        expect(content).toBeTruthy();
        expect(content.length).toBeGreaterThan(50);
      });

      test('should have proper page title and metadata', async () => {
        const title = await aboutMePage.getPageTitle();
        expect(title).toMatch(/about|arthur|senko/i);
        expect(title.length).toBeLessThanOrEqual(60);
      });
    });

    test.describe('Performance Excellence', () => {
      test('should meet Core Web Vitals standards', async () => {
        // Wait for page to fully load
        await aboutMePage.page.waitForLoadState('networkidle');
        
        const vitals = await aboutMePage.getCoreWebVitals();
        console.log('Core Web Vitals:', vitals);

        if (vitals.lcp) {
          expect(vitals.lcp).toBeLessThan(performanceThresholds.coreWebVitals.lcp.good);
        }
        
        if (vitals.cls !== undefined) {
          expect(vitals.cls).toBeLessThan(performanceThresholds.coreWebVitals.cls.good);
        }
        
        if (vitals.fid !== undefined) {
          expect(vitals.fid).toBeLessThan(performanceThresholds.coreWebVitals.fid.good);
        }
      });

      test('should load content within acceptable timeframes', async () => {
        const loadMetrics = await aboutMePage.measureLoadTime();
        console.log('Load Metrics:', loadMetrics);

        expect(loadMetrics.domContentLoaded).toBeLessThan(performanceThresholds.loadTimes.domContentLoaded);
        expect(loadMetrics.firstContentfulPaint).toBeLessThan(performanceThresholds.loadTimes.firstContentfulPaint);
        
        if (loadMetrics.loadComplete > 0) {
          expect(loadMetrics.loadComplete).toBeLessThan(performanceThresholds.loadTimes.loadComplete);
        }
      });

      test('should maintain performance on slower networks', async ({ page }) => {
        // Simulate slow 3G connection
        await page.route('**/*', (route) => {
          setTimeout(() => route.continue(), 150);
        });

        await aboutMePage.open();
        const loadMetrics = await aboutMePage.measureLoadTime();
        
        // Allow longer load times for simulated slow network
        expect(loadMetrics.domContentLoaded).toBeLessThan(performanceThresholds.loadTimes.domContentLoaded * 2);
      });
    });

    test.describe('Accessibility Compliance', () => {
      test('should pass basic accessibility checks', async () => {
        const accessibilityResults = await aboutMePage.runBasicAccessibilityCheck();
        console.log('Accessibility Results:', accessibilityResults);

        // Images should have alt text
        expect(accessibilityResults.imagesWithoutAlt).toBe(0);

        // Should have proper heading structure
        expect(accessibilityResults.hasH1).toBe(true);
        expect(accessibilityResults.headingCount).toBeGreaterThan(0);

        // Form inputs should be properly labeled
        expect(accessibilityResults.unlabeledInputs).toBe(0);
      });

      test('should support keyboard navigation', async () => {
        const focusResult = await aboutMePage.testKeyboardNavigation();
        console.log('Keyboard Navigation:', focusResult);

        // Should be able to focus on interactive elements
        expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA']).toContain(focusResult.tagName);
      });

      test('should have proper heading hierarchy', async ({ page }) => {
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
          elements.map(el => ({ tag: el.tagName, text: el.textContent.trim() }))
        );

        // Should start with H1
        if (headings.length > 0) {
          expect(headings[0].tag).toBe('H1');
        }

        // Should not skip heading levels
        let currentLevel = 1;
        for (let i = 1; i < headings.length; i++) {
          const level = parseInt(headings[i].tag.substring(1));
          expect(level).toBeLessThanOrEqual(currentLevel + 1);
          currentLevel = level;
        }
      });
    });

    test.describe('SEO Optimization', () => {
      test('should have complete and valid SEO metadata', async () => {
        const seoData = await aboutMePage.validateSEOBasics();
        console.log('SEO Metadata:', seoData);

        // Title validation
        expect(seoData.title).toBeTruthy();
        expect(seoData.title.length).toBeGreaterThanOrEqual(seoRules.title.minLength);
        expect(seoData.title.length).toBeLessThanOrEqual(seoRules.title.maxLength);

        // Meta description validation
        if (seoData.description) {
          expect(seoData.description.length).toBeGreaterThanOrEqual(seoRules.description.minLength);
          expect(seoData.description.length).toBeLessThanOrEqual(seoRules.description.maxLength);
        }

        // Viewport meta tag should be present for mobile optimization
        expect(seoData.viewport).toBeTruthy();
      });

      test('should have proper Open Graph metadata', async () => {
        const seoData = await aboutMePage.validateSEOBasics();

        // Open Graph tags for social media sharing
        if (seoData.ogTitle || seoData.ogDescription) {
          expect(seoData.ogTitle).toBeTruthy();
          expect(seoData.ogDescription).toBeTruthy();
        }
      });

      test('should include structured data if present', async () => {
        const seoData = await aboutMePage.validateSEOBasics();
        
        if (seoData.structuredData && seoData.structuredData.length > 0) {
          const personSchema = seoData.structuredData.find(data => 
            data['@type'] === 'Person' || data['@type'] === 'ProfilePage'
          );
          
          if (personSchema) {
            expect(personSchema.name || personSchema.author).toBeTruthy();
          }
        }
      });
    });

    test.describe('Responsive Design', () => {
      test('should work properly across different screen sizes', async () => {
        const responsiveResults = await aboutMePage.testResponsiveDesign();
        console.log('Responsive Test Results:', responsiveResults);

        // Check each breakpoint
        for (const [device, result] of Object.entries(responsiveResults)) {
          expect(result.isContentVisible).toBe(true);
          expect(result.hasHorizontalScroll).toBe(false);
          expect(result.isReadable).toBe(true);
          expect(result.minFontSize).toBeGreaterThanOrEqual(accessibilityRules.textSize.minimum);
        }
      });

      test('should maintain usability on mobile devices', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Check touch target sizes
        const touchTargets = await page.$$eval('a, button, input, textarea', elements =>
          elements.map(el => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              width: rect.width,
              height: rect.height,
              area: rect.width * rect.height
            };
          }).filter(target => target.width > 0 && target.height > 0)
        );

        // Touch targets should meet minimum size requirements
        for (const target of touchTargets) {
          expect(Math.min(target.width, target.height)).toBeGreaterThanOrEqual(
            accessibilityRules.touchTargets.minimumSize
          );
        }
      });
    });

    test.describe('Content Quality', () => {
      test('should have high-quality, readable content', async () => {
        const contentAnalysis = await aboutMePage.validateContentQuality();
        console.log('Content Quality Analysis:', contentAnalysis);

        if (contentAnalysis) {
          // Should have substantial content
          expect(contentAnalysis.hasSubstantialContent).toBe(true);
          expect(contentAnalysis.wordCount).toBeGreaterThanOrEqual(contentQuality.readability.minWordCount);

          // Should have good readability
          expect(contentAnalysis.avgWordsPerSentence).toBeLessThanOrEqual(
            contentQuality.readability.maxWordsPerSentence
          );

          // Should have reasonable structure
          expect(contentAnalysis.paragraphCount).toBeGreaterThanOrEqual(contentQuality.structure.minParagraphs);
        }
      });

      test('should include relevant personal and professional information', async () => {
        const content = await aboutMePage.getMainContent();
        
        // Content should mention key personal/professional elements
        const hasPersonalInfo = /name|about|profile|bio/i.test(content);
        const hasProfessionalInfo = /work|experience|skill|developer|engineer|consultant/i.test(content);
        
        expect(hasPersonalInfo || hasProfessionalInfo).toBe(true);
      });
    });

    test.describe('Social Media & External Links', () => {
      test('should have functional social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        console.log('Social Links:', socialLinks);

        if (socialLinks.length > 0) {
          for (const link of socialLinks) {
            expect(link.isWorking).toBe(true);
            expect(link.href).toMatch(/^https?:\/\//);
          }
        }
      });

      test('should properly secure external links', async ({ page }) => {
        const externalLinks = await page.$$eval('a[href^="http"]', links =>
          links.filter(link => !link.href.includes(window.location.hostname))
            .map(link => ({
              href: link.href,
              rel: link.rel,
              target: link.target
            }))
        );

        // External links should have proper security attributes
        for (const link of externalLinks) {
          if (link.target === '_blank') {
            expect(link.rel).toMatch(/noopener/);
            expect(link.rel).toMatch(/noreferrer/);
          }
        }
      });
    });

    test.describe('Security & Privacy', () => {
      test('should implement basic security measures', async () => {
        const securityAnalysis = await aboutMePage.validateBasicSecurity();
        console.log('Security Analysis:', securityAnalysis);

        if (securityAnalysis) {
          // Check for security headers
          const headers = securityAnalysis.securityHeaders;
          if (headers.xframe) {
            expect(headers.xframe).toMatch(/DENY|SAMEORIGIN/i);
          }

          // External links should be properly secured
          if (securityAnalysis.totalExternalLinks > 0) {
            const secureRatio = securityAnalysis.secureExternalLinks / securityAnalysis.totalExternalLinks;
            expect(secureRatio).toBeGreaterThanOrEqual(0.8); // At least 80% of external links should be secure
          }
        }
      });
    });

    test.describe('User Experience & Engagement', () => {
      test('should provide engaging user experience', async ({ page }) => {
        // Simulate user interactions
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(1000);
        
        // Try to click on the first available link
        const firstLink = await page.locator('a').first();
        if (await firstLink.isVisible()) {
          await firstLink.click();
        }

        const engagement = await aboutMePage.getEngagementMetrics();
        console.log('Engagement Metrics:', engagement);

        if (engagement) {
          expect(engagement.timeOnPage).toBeGreaterThan(500); // At least 500ms
          expect(engagement.scrollDepth).toBeGreaterThan(0);
        }
      });

      test('should have clear call-to-action elements', async ({ page }) => {
        const ctas = await page.$$eval(
          'a[href*="contact"], a[href*="email"], a[href^="mailto:"], button, [role="button"]',
          elements => elements.length
        );

        expect(ctas).toBeGreaterThan(0);
      });
    });

    test.describe('Contact Form Functionality', () => {
      test('should have properly configured contact form if present', async () => {
        const formAnalysis = await aboutMePage.testContactForm();
        console.log('Contact Form Analysis:', formAnalysis);

        if (formAnalysis.hasForm) {
          expect(formAnalysis.hasSubmitButton).toBe(true);
          expect(formAnalysis.inputCount).toBeGreaterThan(0);
          
          // Should have at least email field for contact
          expect(formAnalysis.hasEmailField).toBe(true);
        }
      });
    });

    test.describe('Visual Consistency', () => {
      test('should maintain visual consistency across page load', async () => {
        // Take screenshot for visual regression testing
        await aboutMePage.takeScreenshot('about-page-desktop');
        
        // Basic visual validation
        const isVisible = await aboutMePage.page.locator('body').isVisible();
        expect(isVisible).toBe(true);
      });

      test('should maintain mobile visual consistency', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await aboutMePage.takeScreenshot('about-page-mobile');
        
        const isVisible = await page.locator('body').isVisible();
        expect(isVisible).toBe(true);
      });
    });
  });

} else {
  // WebDriver implementation for comparison
  describe('About Me Page - WebDriver Tests', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AboutMePage();
      await aboutMePage.open();
    });

    it('should display profile image', async () => {
      await aboutMePage.isProfileImagePresent();
    });

    it('should have readable content', async () => {
      const content = await aboutMePage.getMainContent();
      expect(content.length).toBeGreaterThan(50);
    });

    it('should have proper page title', async () => {
      const title = await aboutMePage.getPageTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
    });

    it('should work on mobile viewport', async () => {
      await browser.setWindowSize(375, 667);
      await aboutMePage.isProfileImagePresent();
      
      const content = await aboutMePage.getMainContent();
      expect(content).toBeTruthy();
    });
  });
}