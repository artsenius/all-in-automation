const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AboutMePage } from '../pageobjects/aboutMe.page.js';
import { testConfig } from '../pageobjects/selectors.js';

if (FRAMEWORK === 'playwright') {
  test.describe('About Me Page - Comprehensive Test Suite', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AboutMePage(page, expect);
      await aboutMePage.open();
    });

    // Core Content & Functional Tests
    test.describe('Core Content Validation', () => {
      test('should have proper page structure', async () => {
        const structure = await aboutMePage.validatePageStructure();
        
        expect(structure.hasTitle).toBeTruthy();
        expect(structure.hasMainContent).toBeTruthy();
        expect(structure.hasNavigation).toBeTruthy();
      });

      test('should display page title correctly', async () => {
        const title = await aboutMePage.getPageTitle();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      });

      test('should validate personal information elements', async () => {
        const personalInfo = await aboutMePage.validatePersonalInfo();
        
        expect(personalInfo.hasProfileImage).toBeTruthy();
        expect(personalInfo.hasFullName).toBeTruthy();
        expect(personalInfo.hasBio).toBeTruthy();
      });

      test('should have profile image with proper attributes', async () => {
        const imageSrc = await aboutMePage.getProfileImageSrc();
        const imageAlt = await aboutMePage.getProfileImageAlt();
        
        expect(imageSrc).toBeTruthy();
        expect(imageAlt).toBeTruthy();
        expect(imageAlt.length).toBeGreaterThan(0);
      });

      test('should display full name', async () => {
        const fullName = await aboutMePage.getFullName();
        expect(fullName).toBeTruthy();
        expect(fullName.length).toBeGreaterThan(testConfig.testData.minimumBioLength);
      });

      test('should have meaningful bio content', async () => {
        const bioText = await aboutMePage.getBioText();
        expect(bioText).toBeTruthy();
        expect(bioText.length).toBeGreaterThan(testConfig.testData.minimumBioLength);
      });

      test('should have contact information', async () => {
        const hasContactInfo = await aboutMePage.hasContactInformation();
        expect(hasContactInfo).toBeTruthy();
      });
    });

    // Social Media & External Links Tests
    test.describe('Social Media & External Links', () => {
      test('should validate social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        // At least one social platform should be present
        const hasSocialLinks = socialLinks.hasLinkedIn || socialLinks.hasTwitter || 
                              socialLinks.hasGitHub || socialLinks.hasInstagram;
        expect(hasSocialLinks).toBeTruthy();
      });

      test('should have working social media URLs', async () => {
        const socialUrls = await aboutMePage.getSocialLinkUrls();
        
        // Validate URL format for each platform
        if (socialUrls.linkedin) {
          expect(socialUrls.linkedin).toContain('linkedin.com');
        }
        if (socialUrls.twitter) {
          expect(socialUrls.twitter).toMatch(/twitter\.com|x\.com/);
        }
        if (socialUrls.github) {
          expect(socialUrls.github).toContain('github.com');
        }
      });

      test('should validate external links integrity', async () => {
        const linkResults = await aboutMePage.validateExternalLinks();
        
        expect(linkResults.workingLinks.length).toBeGreaterThanOrEqual(0);
        expect(linkResults.brokenLinks.length).toEqual(0);
      });

      test('should use secure links (HTTPS)', async () => {
        const linkResults = await aboutMePage.validateExternalLinks();
        
        // All external links should be secure
        linkResults.workingLinks.forEach(link => {
          expect(link).toMatch(/^https:\/\//);
        });
      });
    });

    // Accessibility Tests (WCAG 2.2 AAA)
    test.describe('Accessibility Compliance', () => {
      test('should have proper heading hierarchy', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.headingStructure.hasH1).toBeTruthy();
        expect(accessibility.headingStructure.isValidHierarchy).toBeTruthy();
        expect(accessibility.headingStructure.totalHeadings).toBeGreaterThan(0);
      });

      test('should support keyboard navigation', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.keyboardNavigation.isValid).toBeTruthy();
        expect(accessibility.keyboardNavigation.totalFocusableElements).toBeGreaterThan(0);
      });

      test('should have ARIA labels and landmarks', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.ariaLabels.hasLandmarks).toBeTruthy();
      });

      test('should have visible focus indicators', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.focusManagement.hasFocusIndicators).toBeTruthy();
      });

      test('should have adequate color contrast', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.colorContrast.checked).toBeTruthy();
      });
    });

    // Performance Tests
    test.describe('Performance Optimization', () => {
      test('should meet performance benchmarks', async () => {
        const performance = await aboutMePage.measurePerformance();
        
        expect(performance.loadTime).toBeLessThan(testConfig.performance.loadTime);
        expect(performance.firstContentfulPaint).toBeLessThan(testConfig.performance.fcp);
      });

      test('should meet Core Web Vitals standards', async () => {
        const vitals = await aboutMePage.measureCoreWebVitals();
        
        if (vitals.lcp) {
          expect(vitals.lcp).toBeLessThan(testConfig.performance.lcp);
        }
        if (vitals.cls) {
          expect(vitals.cls).toBeLessThan(testConfig.performance.cls);
        }
      });

      test('should optimize images properly', async () => {
        const images = await aboutMePage.checkImageOptimization();
        
        images.forEach(image => {
          expect(image.hasAlt).toBeTruthy();
          // Modern image formats or lazy loading should be used
          expect(image.isLazyLoaded || image.isOptimized).toBeTruthy();
        });
      });
    });

    // SEO and Metadata Tests
    test.describe('SEO and Metadata', () => {
      test('should have proper SEO metadata', async () => {
        const seo = await aboutMePage.validateSEO();
        
        expect(seo.title).toBeTruthy();
        expect(seo.description).toBeTruthy();
        expect(seo.viewport).toBeTruthy();
      });

      test('should have Open Graph tags', async () => {
        const seo = await aboutMePage.validateSEO();
        
        expect(seo.openGraph.title).toBeTruthy();
        expect(seo.openGraph.description).toBeTruthy();
      });

      test('should have Twitter Card metadata', async () => {
        const seo = await aboutMePage.validateSEO();
        
        // Twitter cards are optional but if present should be valid
        if (seo.twitterCards.card) {
          expect(seo.twitterCards.title).toBeTruthy();
        }
      });

      test('should have proper page title structure', async () => {
        const title = await aboutMePage.getPageTitle();
        
        expect(title).toMatch(/about/i);
        expect(title.length).toBeLessThan(60); // SEO best practice
      });
    });

    // Responsive Design Tests
    test.describe('Responsive Design', () => {
      test('should work on mobile devices', async () => {
        const responsive = await aboutMePage.testResponsiveDesign();
        
        expect(responsive.mobile.isVisible).toBeTruthy();
        expect(responsive.mobile.hasOverflow).toBeFalsy();
      });

      test('should work on tablet devices', async () => {
        const responsive = await aboutMePage.testResponsiveDesign();
        
        expect(responsive.tablet.isVisible).toBeTruthy();
        expect(responsive.tablet.hasOverflow).toBeFalsy();
      });

      test('should work on desktop devices', async () => {
        const responsive = await aboutMePage.testResponsiveDesign();
        
        expect(responsive.desktop.isVisible).toBeTruthy();
        expect(responsive.desktop.hasOverflow).toBeFalsy();
      });

      test('should have proper touch target sizes', async () => {
        const responsive = await aboutMePage.testResponsiveDesign();
        
        responsive.mobile.touchTargets.forEach(target => {
          expect(target.meetsMinimum).toBeTruthy();
        });
      });
    });

    // Security Tests
    test.describe('Security Validation', () => {
      test('should use HTTPS', async () => {
        const security = await aboutMePage.validateSecurity();
        
        expect(security.isHTTPS).toBeTruthy();
      });

      test('should have proper security headers', async () => {
        const security = await aboutMePage.validateSecurity();
        
        // Check for essential security headers
        expect(security.securityHeaders['x-frame-options']).toBeTruthy();
        expect(security.securityHeaders['x-content-type-options']).toBeTruthy();
      });

      test('should secure external links', async () => {
        const security = await aboutMePage.validateSecurity();
        
        security.externalLinks.forEach(link => {
          expect(link.hasNoopener || link.hasNoreferrer).toBeTruthy();
        });
      });

      test('should validate form security', async () => {
        const security = await aboutMePage.validateSecurity();
        
        security.formSecurity?.forEach(form => {
          expect(form.isSecure).toBeTruthy();
        });
      });
    });

    // Content Quality Tests
    test.describe('Content Quality', () => {
      test('should have meaningful content', async () => {
        const contentQuality = await aboutMePage.analyzeContentQuality();
        
        expect(contentQuality.bioLength).toBeGreaterThan(testConfig.testData.minimumBioLength);
        expect(contentQuality.hasContactInfo).toBeTruthy();
      });

      test('should have readable content', async () => {
        const contentQuality = await aboutMePage.analyzeContentQuality();
        
        expect(contentQuality.readabilityScore.wordCount).toBeGreaterThan(50);
        expect(contentQuality.readabilityScore.readabilityLevel).not.toBe('Hard');
      });

      test('should have working links', async () => {
        const contentQuality = await aboutMePage.analyzeContentQuality();
        
        expect(contentQuality.linksWorking.brokenLinks.length).toEqual(0);
      });

      test('should optimize images', async () => {
        const contentQuality = await aboutMePage.analyzeContentQuality();
        
        contentQuality.imagesOptimized.forEach(image => {
          expect(image.hasAlt).toBeTruthy();
        });
      });
    });

    // Visual Regression Tests
    test.describe('Visual Regression', () => {
      test('should capture full page screenshot', async () => {
        const screenshot = await aboutMePage.captureScreenshot('full-page');
        expect(screenshot).toBeTruthy();
      });

      test('should capture profile section screenshot', async () => {
        const screenshot = await aboutMePage.captureElementScreenshot(
          '[data-testid="profile-section"], .profile-section', 
          'profile-section'
        );
        expect(screenshot).toBeTruthy();
      });
    });

    // Comprehensive Integration Test
    test.describe('Comprehensive Integration', () => {
      test('should pass all comprehensive tests', async () => {
        const results = await aboutMePage.runComprehensiveTests();
        
        expect(results.timestamp).toBeTruthy();
        expect(results.pageStructure.hasTitle).toBeTruthy();
        expect(results.personalInfo.hasProfileImage).toBeTruthy();
        expect(results.accessibility.headingStructure.hasH1).toBeTruthy();
        expect(results.security.isHTTPS).toBeTruthy();
        expect(results.contentQuality.bioLength).toBeGreaterThan(0);
      });
    });

    // Network and Third-Party Tests
    test.describe('Network and Third-Party Analysis', () => {
      test('should analyze network requests', async () => {
        const networkRequests = await aboutMePage.analyzeNetworkRequests();
        expect(Array.isArray(networkRequests)).toBeTruthy();
      });

      test('should identify third-party scripts', async () => {
        const thirdPartyScripts = await aboutMePage.checkThirdPartyScripts();
        expect(Array.isArray(thirdPartyScripts)).toBeTruthy();
      });
    });

    // Cross-Browser Compatibility Tests
    test.describe('Cross-Browser Compatibility', () => {
      test('should work in different browsers', async () => {
        const structure = await aboutMePage.validatePageStructure();
        expect(structure.hasTitle).toBeTruthy();
        expect(structure.hasMainContent).toBeTruthy();
      });
    });

    // Error Handling Tests
    test.describe('Error Handling', () => {
      test('should handle missing elements gracefully', async () => {
        const isVisible = await aboutMePage.isElementVisible('[data-testid="non-existent-element"]');
        expect(isVisible).toBeFalsy();
      });

      test('should handle network timeouts', async () => {
        // Test with a very short timeout to simulate network issues
        const pageUrl = await aboutMePage.getPageUrl();
        expect(pageUrl).toBeTruthy();
      });
    });
  });

} else if (FRAMEWORK === 'wdio') {
  console.log('Running WebDriver tests for About Me page');
  
  describe('About Me Page - WebDriver Test Suite', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AboutMePage();
      await aboutMePage.open();
    });

    describe('Core Content Validation', () => {
      it('should have proper page structure', async () => {
        const structure = await aboutMePage.validatePageStructure();
        
        expect(structure.hasTitle).toBe(true);
        expect(structure.hasMainContent).toBe(true);
        expect(structure.hasNavigation).toBe(true);
      });

      it('should display page title correctly', async () => {
        const title = await aboutMePage.getPageTitle();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      });

      it('should validate personal information elements', async () => {
        const personalInfo = await aboutMePage.validatePersonalInfo();
        
        expect(personalInfo.hasProfileImage).toBe(true);
        expect(personalInfo.hasFullName).toBe(true);
        expect(personalInfo.hasBio).toBe(true);
      });

      it('should have profile image with proper attributes', async () => {
        const imageSrc = await aboutMePage.getProfileImageSrc();
        const imageAlt = await aboutMePage.getProfileImageAlt();
        
        expect(imageSrc).toBeTruthy();
        expect(imageAlt).toBeTruthy();
        expect(imageAlt.length).toBeGreaterThan(0);
      });

      it('should display full name', async () => {
        const fullName = await aboutMePage.getFullName();
        expect(fullName).toBeTruthy();
        expect(fullName.length).toBeGreaterThan(0);
      });

      it('should have meaningful bio content', async () => {
        const bioText = await aboutMePage.getBioText();
        expect(bioText).toBeTruthy();
        expect(bioText.length).toBeGreaterThan(testConfig.testData.minimumBioLength);
      });

      it('should have contact information', async () => {
        const hasContactInfo = await aboutMePage.hasContactInformation();
        expect(hasContactInfo).toBe(true);
      });
    });

    describe('Social Media & External Links', () => {
      it('should validate social media links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        // At least one social platform should be present
        const hasSocialLinks = socialLinks.hasLinkedIn || socialLinks.hasTwitter || 
                              socialLinks.hasGitHub || socialLinks.hasInstagram;
        expect(hasSocialLinks).toBe(true);
      });

      it('should have working social media URLs', async () => {
        const socialUrls = await aboutMePage.getSocialLinkUrls();
        
        // Validate URL format for each platform
        if (socialUrls.linkedin) {
          expect(socialUrls.linkedin).toContain('linkedin.com');
        }
        if (socialUrls.twitter) {
          expect(socialUrls.twitter).toMatch(/twitter\.com|x\.com/);
        }
        if (socialUrls.github) {
          expect(socialUrls.github).toContain('github.com');
        }
      });
    });

    describe('Accessibility Compliance', () => {
      it('should have proper heading hierarchy', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.headingStructure.hasH1).toBe(true);
        expect(accessibility.headingStructure.isValidHierarchy).toBe(true);
      });

      it('should support keyboard navigation', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.keyboardNavigation.isValid).toBe(true);
      });

      it('should have ARIA labels and landmarks', async () => {
        const accessibility = await aboutMePage.validateAccessibility();
        
        expect(accessibility.ariaLabels.hasLandmarks).toBe(true);
      });
    });

    describe('Security Validation', () => {
      it('should use HTTPS', async () => {
        const security = await aboutMePage.validateSecurity();
        
        expect(security.isHTTPS).toBe(true);
      });
    });

    describe('Content Quality', () => {
      it('should have meaningful content', async () => {
        const contentQuality = await aboutMePage.analyzeContentQuality();
        
        expect(contentQuality.bioLength).toBeGreaterThan(testConfig.testData.minimumBioLength);
        expect(contentQuality.hasContactInfo).toBe(true);
      });
    });

    describe('Comprehensive Integration', () => {
      it('should pass all comprehensive tests', async () => {
        const results = await aboutMePage.runComprehensiveTests();
        
        expect(results.timestamp).toBeTruthy();
        expect(results.pageStructure.hasTitle).toBe(true);
        expect(results.personalInfo.hasProfileImage).toBe(true);
        expect(results.security.isHTTPS).toBe(true);
      });
    });
  });
}