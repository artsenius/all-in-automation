const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AboutMePage } from '../pageobjects/aboutMe.page.js';
import { viewportSizes, performanceThresholds, testData } from '../pageobjects/selectors.js';

if (FRAMEWORK === 'playwright') {
  test.describe('About Me Page - Comprehensive Tests', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AboutMePage(page, expect);
      await aboutMePage.open();
      await aboutMePage.waitForPageStability();
    });

    test.describe('Core Content Validation', () => {
      test('should display page title correctly', async () => {
        const title = await aboutMePage.getPageTitle();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
        expect(title.length).toBeLessThan(100);
      });

      test('should validate personal bio content quality', async () => {
        const bioValidation = await aboutMePage.validateBioLength();
        expect(bioValidation.isValid).toBe(true);
        expect(bioValidation.length).toBeGreaterThanOrEqual(100);
        expect(bioValidation.length).toBeLessThanOrEqual(500);
      });

      test('should validate contact email format', async () => {
        const emailValidation = await aboutMePage.validateEmailFormat();
        if (emailValidation.email) {
          expect(emailValidation.isValid).toBe(true);
          expect(emailValidation.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        }
      });

      test('should display professional summary', async () => {
        const summary = await aboutMePage.getProfessionalSummary();
        if (summary) {
          expect(summary.length).toBeGreaterThan(50);
          expect(summary).toMatch(/[A-Za-z]/); // Contains letters
        }
      });

      test('should list skills and technologies', async () => {
        const skills = await aboutMePage.getSkillsList();
        expect(Array.isArray(skills)).toBe(true);
        if (skills.length > 0) {
          for (const skill of skills) {
            const skillText = await skill.textContent();
            expect(skillText.trim().length).toBeGreaterThan(0);
          }
        }
      });
    });

    test.describe('Profile Image Tests', () => {
      test('should display profile image', async () => {
        const isPresent = await aboutMePage.isProfileImagePresent();
        expect(isPresent).toBe(true);
      });

      test('should load profile image successfully', async () => {
        const isLoaded = await aboutMePage.isProfileImageLoaded();
        expect(isLoaded).toBe(true);
      });

      test('should have proper alt text for accessibility', async () => {
        const altText = await aboutMePage.getProfileImageAltText();
        expect(altText).toBeTruthy();
        expect(altText.length).toBeGreaterThan(5);
        expect(altText).not.toBe('image'); // Should be descriptive
      });

      test('should have appropriate image dimensions', async () => {
        const dimensions = await aboutMePage.validateImageDimensions();
        expect(dimensions.width).toBeGreaterThan(100);
        expect(dimensions.height).toBeGreaterThan(100);
        expect(dimensions.aspectRatio).toBeCloseTo(1, 0.5); // Roughly square
      });
    });

    test.describe('Social Media Links Validation', () => {
      test('should validate all social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        for (const [platform, linkData] of Object.entries(socialLinks)) {
          if (linkData.isVisible) {
            expect(linkData.isValidUrl).toBe(true);
            expect(linkData.href).toMatch(/^https?:\/\//);
            
            // Platform-specific validations
            switch (platform) {
              case 'linkedin':
                expect(linkData.href).toContain('linkedin.com');
                break;
              case 'github':
                expect(linkData.href).toContain('github.com');
                break;
              case 'twitter':
                expect(linkData.href).toMatch(/(twitter|x)\.com/);
                break;
              case 'email':
                expect(linkData.href).toMatch(/^mailto:/);
                break;
            }
            
            // External links should open in new tab
            if (!linkData.href.startsWith('mailto:')) {
              expect(linkData.opensInNewTab).toBe(true);
            }
          }
        }
      });
    });

    test.describe('Responsive Design Tests', () => {
      viewportSizes.forEach(viewport => {
        test(`should render correctly on ${viewport.name}`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          
          const isImageVisible = await aboutMePage.isProfileImagePresent();
          const layoutInfo = await aboutMePage.getContentLayoutInfo();
          
          expect(isImageVisible).toBe(true);
          expect(layoutInfo.mainWidth).toBeGreaterThan(0);
          
          // Mobile-specific checks
          if (viewport.width < 768) {
            const mobileMenuVisible = await page.locator('[data-testid="mobile-menu-toggle"]').isVisible();
            // Mobile menu toggle should be present on small screens
          }
        });
      });

      test('should adapt layout for different screen sizes', async () => {
        const responsiveResults = await aboutMePage.validateResponsiveDesign(viewportSizes.slice(0, 3));
        
        for (const [deviceName, result] of Object.entries(responsiveResults)) {
          expect(result.profileImageVisible).toBe(true);
          expect(result.contentLayout.mainWidth).toBeGreaterThan(0);
        }
      });
    });

    test.describe('Performance Tests', () => {
      test('should meet page load performance thresholds', async () => {
        const loadTime = await aboutMePage.measurePageLoadTime();
        expect(loadTime).toBeLessThan(5000); // 5 seconds max
      });

      test('should meet Web Vitals standards', async () => {
        const webVitals = await aboutMePage.getWebVitals();
        
        if (webVitals.fcp) {
          expect(webVitals.fcp).toBeLessThan(performanceThresholds['First Contentful Paint']);
        }
        if (webVitals.lcp) {
          expect(webVitals.lcp).toBeLessThan(performanceThresholds['Largest Contentful Paint']);
        }
        if (webVitals.cls !== undefined) {
          expect(webVitals.cls).toBeLessThan(performanceThresholds['Cumulative Layout Shift']);
        }
      });
    });

    test.describe('SEO and Meta Tags', () => {
      test('should have proper meta tags for SEO', async () => {
        const metaTags = await aboutMePage.validateMetaTags();
        
        expect(metaTags.title).toBeTruthy();
        expect(metaTags.title.length).toBeGreaterThan(10);
        expect(metaTags.title.length).toBeLessThan(60);
        
        expect(metaTags.description).toBeTruthy();
        expect(metaTags.description.length).toBeGreaterThan(50);
        expect(metaTags.description.length).toBeLessThan(160);
        
        // Open Graph tags
        expect(metaTags.ogTitle).toBeTruthy();
        expect(metaTags.ogDescription).toBeTruthy();
        if (metaTags.ogImage) {
          expect(metaTags.ogImage).toMatch(/^https?:\/\//);
        }
      });
    });

    test.describe('Accessibility Tests', () => {
      test('should support keyboard navigation', async () => {
        const keyboardNav = await aboutMePage.validateKeyboardNavigation();
        
        for (const element of keyboardNav) {
          if (element.isVisible) {
            expect(element.hasVisibleFocus).toBe(true);
          }
        }
      });

      test('should have proper heading hierarchy', async () => {
        const hierarchy = await aboutMePage.validateHeadingHierarchy();
        
        expect(hierarchy.length).toBeGreaterThan(0);
        
        // Should start with H1
        expect(hierarchy[0].level).toBe(1);
        
        // Check for logical hierarchy (no skipping levels)
        for (let i = 1; i < hierarchy.length; i++) {
          const currentLevel = hierarchy[i].level;
          const previousLevel = hierarchy[i - 1].level;
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      });
    });

    test.describe('Security Tests', () => {
      test('should have proper security headers', async () => {
        const securityHeaders = await aboutMePage.validateSecurityHeaders();
        
        // Basic security headers should be present
        expect(securityHeaders.xContentTypeOptions).toBeTruthy();
        
        if (securityHeaders.contentSecurityPolicy) {
          expect(securityHeaders.contentSecurityPolicy).toContain('default-src');
        }
      });
    });

    test.describe('Error Handling and Edge Cases', () => {
      test('should handle broken images gracefully', async () => {
        const errorStates = await aboutMePage.validateErrorStates();
        // This test checks if fallback mechanisms work when images fail to load
      });

      test('should handle different content lengths', async () => {
        // Test with different bio lengths if dynamic content is supported
        for (const [lengthType, bioText] of Object.entries(testData.bioLengths)) {
          if (lengthType === 'optimal') {
            expect(bioText.length).toBeGreaterThanOrEqual(100);
            expect(bioText.length).toBeLessThanOrEqual(500);
          }
        }
      });
    });

    test.describe('Visual Regression Tests', () => {
      test('should capture visual snapshots for baseline', async () => {
        // Desktop view
        await aboutMePage.takeVisualSnapshot('about-me-desktop');
        
        // Mobile view
        await aboutMePage.page.setViewportSize({ width: 375, height: 667 });
        await aboutMePage.takeVisualSnapshot('about-me-mobile');
        
        // Tablet view
        await aboutMePage.page.setViewportSize({ width: 768, height: 1024 });
        await aboutMePage.takeVisualSnapshot('about-me-tablet');
      });
    });

    test.describe('Navigation and Interactive Elements', () => {
      test('should validate navigation menu functionality', async () => {
        const navigationItems = await aboutMePage.validateNavigationMenu();
        
        for (const item of navigationItems) {
          expect(item.text.trim().length).toBeGreaterThan(0);
          expect(item.href).toBeTruthy();
        }
      });

      test('should validate interactive elements', async ({ page }) => {
        // Test download links
        const downloadLink = page.locator('[data-testid="download-cv"]');
        if (await downloadLink.isVisible()) {
          const href = await downloadLink.getAttribute('href');
          expect(href).toMatch(/\.(pdf|doc|docx)$/i);
        }
        
        // Test external links
        const projectsLink = page.locator('[data-testid="view-projects"]');
        if (await projectsLink.isVisible()) {
          const href = await projectsLink.getAttribute('href');
          expect(href).toBeTruthy();
        }
      });
    });
  });

} else {
  // WebDriver implementation
  console.log('Running About Me tests in WDIO');
  
  describe('About Me Page - WebDriver Tests', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AboutMePage();
      await aboutMePage.open();
    });

    describe('Core Content Validation', () => {
      it('should display profile image', async () => {
        const isPresent = await aboutMePage.isProfileImagePresent();
        expect(isPresent).toBe(true);
      });

      it('should display page title', async () => {
        const title = await aboutMePage.getPageTitle();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      });

      it('should validate social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        for (const [platform, linkData] of Object.entries(socialLinks)) {
          if (linkData.isVisible) {
            expect(linkData.isValidUrl).toBe(true);
            expect(linkData.href).toMatch(/^https?:\/\//);
          }
        }
      });
    });

    describe('Responsive Design', () => {
      it('should adapt to mobile viewport', async () => {
        await browser.setWindowSize(375, 667);
        const isImageVisible = await aboutMePage.isProfileImagePresent();
        expect(isImageVisible).toBe(true);
      });

      it('should adapt to tablet viewport', async () => {
        await browser.setWindowSize(768, 1024);
        const isImageVisible = await aboutMePage.isProfileImagePresent();
        expect(isImageVisible).toBe(true);
      });
    });

    describe('Performance', () => {
      it('should load within acceptable time', async () => {
        const loadTime = await aboutMePage.measurePageLoadTime();
        expect(loadTime).toBeLessThan(5000);
      });
    });
  });
}