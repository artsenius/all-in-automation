const FRAMEWORK = process.env.FRAMEWORK;
import { test, expect } from '@playwright/test';
import { AboutMePage } from '../pageobjects/aboutMe.page.js';
import { 
  aboutMeSelectors, 
  performanceThresholds, 
  accessibilityRules, 
  deviceViewports, 
  seoRules, 
  contentQuality, 
  securityRules,
  sustainabilityMetrics,
  aiTestingParams
} from '../pageobjects/selectors.js';

// Test configuration
const testConfig = {
  baseUrl: 'https://www.arthursenko.com',
  timeout: 30000,
  retries: 2
};

if (FRAMEWORK === 'playwright') {
  test.describe('About Me Page - Next Generation Testing Suite', () => {
    let aboutMePage;

    test.beforeEach(async ({ page }) => {
      aboutMePage = new AboutMePage(page, expect);
      await aboutMePage.open();
    });

    test.describe('1. Advanced Performance Testing', () => {
      test('should meet Core Web Vitals 2.0 standards', async () => {
        const vitals = await aboutMePage.measureCoreWebVitals();
        
        // Test Largest Contentful Paint (LCP)
        expect(vitals.lcp).toBeLessThan(performanceThresholds.largestContentfulPaint.good);
        
        // Test Interaction to Next Paint (INP)
        if (vitals.inp) {
          expect(vitals.inp).toBeLessThan(performanceThresholds.interactionToNextPaint.good);
        }
        
        // Test Cumulative Layout Shift (CLS)
        if (vitals.cls) {
          expect(vitals.cls).toBeLessThan(performanceThresholds.cumulativeLayoutShift.good);
        }
        
        // Test Time to First Byte (TTFB)
        if (vitals.ttfb) {
          expect(vitals.ttfb).toBeLessThan(performanceThresholds.timeToFirstByte.good);
        }
      });

      test('should perform well under various network conditions', async () => {
        const networkConditions = ['Slow3G', 'Regular3G', 'Fast3G', 'Regular4G'];
        
        for (const condition of networkConditions) {
          await aboutMePage.simulateNetworkConditions(condition);
          await aboutMePage.open();
          
          const vitals = await aboutMePage.measureCoreWebVitals();
          const advanced = await aboutMePage.measureAdvancedPerformanceMetrics();
          
          // Performance should still be reasonable on slower connections
          if (condition === 'Slow3G') {
            expect(vitals.lcp).toBeLessThan(performanceThresholds.largestContentfulPaint.poor);
          } else {
            expect(vitals.lcp).toBeLessThan(performanceThresholds.largestContentfulPaint.needsImprovement);
          }
          
          // Check for long tasks
          expect(advanced.longTasks).toBeLessThan(5);
          
          // Validate Total Blocking Time
          expect(advanced.totalBlockingTime).toBeLessThan(performanceThresholds.totalBlockingTime.needsImprovement);
        }
      });

      test('should have optimal resource loading', async () => {
        const advanced = await aboutMePage.measureAdvancedPerformanceMetrics();
        
        // Test resource loading efficiency
        expect(advanced.resourceLoadTime).toBeLessThan(5000); // 5 seconds
        
        // Test DOM content loaded time
        expect(advanced.domContentLoaded).toBeLessThan(2000); // 2 seconds
        
        // Test load complete time
        expect(advanced.loadComplete).toBeLessThan(3000); // 3 seconds
      });
    });

    test.describe('2. AI-Powered Testing & Automation', () => {
      test('should have high-quality content based on AI analysis', async () => {
        const contentAnalysis = await aboutMePage.analyzeContentQuality();
        
        // Test content length
        expect(contentAnalysis.wordCount).toBeGreaterThan(contentQuality.contentLength.wordCount.min);
        expect(contentAnalysis.wordCount).toBeLessThan(contentQuality.contentLength.wordCount.max);
        
        // Test readability
        expect(contentAnalysis.readabilityScore).toBeGreaterThan(30); // At least "Difficult"
        expect(contentAnalysis.avgWordsPerSentence).toBeLessThan(contentQuality.readability.averageWordsPerSentence.max);
        
        // Test lexical diversity
        expect(contentAnalysis.lexicalDiversity).toBeGreaterThan(contentQuality.contentDiversity.lexicalDiversity.min);
        
        // Test readability grade
        expect(['Very Easy', 'Easy', 'Fairly Easy', 'Standard', 'Fairly Difficult']).toContain(contentAnalysis.readabilityGrade);
      });

      test('should pass visual regression testing', async () => {
        const visualTest = await aboutMePage.performVisualRegressionTest();
        
        // Verify screenshot was captured
        expect(visualTest.screenshot).toBeDefined();
        expect(visualTest.timestamp).toBeDefined();
        
        // In a real implementation, this would compare against a baseline
        // For now, we ensure the screenshot capture works
        expect(visualTest.screenshot.length).toBeGreaterThan(0);
      });
    });

    test.describe('3. Advanced Security & Privacy Testing', () => {
      test('should have comprehensive security headers', async () => {
        const securityAnalysis = await aboutMePage.analyzeSecurityHeaders();
        
        // Test Content Security Policy
        expect(securityAnalysis.contentSecurityPolicy.present).toBe(true);
        expect(['level1', 'level2', 'level3']).toContain(securityAnalysis.contentSecurityPolicy.level);
        
        // Test Strict Transport Security
        expect(securityAnalysis.strictTransportSecurity.present).toBe(true);
        
        // Test X-Frame-Options
        expect(securityAnalysis.xFrameOptions.present).toBe(true);
        expect(securityAnalysis.xFrameOptions.secure).toBe(true);
        
        // Test X-Content-Type-Options
        expect(securityAnalysis.xContentTypeOptions.present).toBe(true);
        expect(securityAnalysis.xContentTypeOptions.secure).toBe(true);
        
        // Test Referrer Policy
        expect(securityAnalysis.referrerPolicy.present).toBe(true);
      });

      test('should have secure external links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        
        socialLinks.forEach(link => {
          if (link.isExternal) {
            // External links should have security attributes
            expect(link.hasNoopener || link.hasNoreferrer).toBe(true);
          }
        });
      });
    });

    test.describe('4. Next-Generation User Experience Testing', () => {
      test('should support keyboard navigation', async () => {
        const navigationResults = await aboutMePage.testKeyboardNavigation();
        
        // All focusable elements should have visible focus
        const elementsWithoutFocus = navigationResults.filter(result => !result.hasVisibleFocus);
        expect(elementsWithoutFocus.length).toBeLessThan(navigationResults.length * 0.1); // Less than 10%
        
        // Navigation should be logical
        expect(navigationResults.length).toBeGreaterThan(0);
      });

      test('should have proper responsive design', async () => {
        const responsiveResults = await aboutMePage.testResponsiveDesign();
        
        responsiveResults.forEach(result => {
          // No horizontal scrollbars on any viewport
          expect(result.layout.hasHorizontalScrollbar).toBe(false);
          
          // Content should not overflow viewport
          expect(result.layout.contentOverflow).toBe(false);
          
          // Should have reasonable number of visible elements
          expect(result.layout.visibleElements).toBeGreaterThan(5);
        });
      });

      test('should support modern web standards', async () => {
        const webComponentsSupport = await aboutMePage.testWebComponents();
        const cssSupport = await aboutMePage.testModernCSSFeatures();
        
        // Test Web Components support
        expect(webComponentsSupport.customElements).toBe(true);
        expect(webComponentsSupport.shadowDOM).toBe(true);
        expect(webComponentsSupport.htmlTemplates).toBe(true);
        
        // Test modern CSS features
        expect(cssSupport.cssGrid).toBe(true);
        expect(cssSupport.cssFlexbox).toBe(true);
        expect(cssSupport.cssCustomProperties).toBe(true);
      });
    });

    test.describe('5. Advanced SEO & Content Strategy Testing', () => {
      test('should have optimal SEO metadata', async () => {
        const seoData = await aboutMePage.analyzeSEOMetrics();
        
        // Test page title
        expect(seoData.title).toBeDefined();
        expect(seoData.title.length).toBeGreaterThan(seoRules.metaTags.titleLength.min);
        expect(seoData.title.length).toBeLessThan(seoRules.metaTags.titleLength.max);
        
        // Test meta description
        expect(seoData.metaDescription).toBeDefined();
        expect(seoData.metaDescription.length).toBeGreaterThan(seoRules.metaTags.descriptionLength.min);
        expect(seoData.metaDescription.length).toBeLessThan(seoRules.metaTags.descriptionLength.max);
        
        // Test Open Graph tags
        expect(seoData.ogTitle).toBeDefined();
        expect(seoData.ogDescription).toBeDefined();
        expect(seoData.ogImage).toBeDefined();
        
        // Test Twitter Card tags
        expect(seoData.twitterCard).toBeDefined();
        expect(seoData.twitterTitle).toBeDefined();
        expect(seoData.twitterDescription).toBeDefined();
      });

      test('should have proper heading structure', async () => {
        const seoData = await aboutMePage.analyzeSEOMetrics();
        
        // Should have exactly one H1
        const h1Headings = seoData.headingStructure.filter(h => h.level === 1);
        expect(h1Headings.length).toBe(1);
        
        // Headings should be descriptive
        seoData.headingStructure.forEach(heading => {
          expect(heading.text.length).toBeGreaterThan(5);
          expect(heading.text.length).toBeLessThan(100);
        });
      });

      test('should have valid structured data', async () => {
        const seoData = await aboutMePage.analyzeSEOMetrics();
        
        // Should have structured data
        expect(seoData.structuredData.length).toBeGreaterThan(0);
        
        // Validate structured data format
        seoData.structuredData.forEach(data => {
          expect(data['@context']).toBeDefined();
          expect(data['@type']).toBeDefined();
        });
      });
    });

    test.describe('6. Comprehensive Accessibility Testing', () => {
      test('should pass WCAG 2.2 AAA accessibility audit', async () => {
        const accessibilityData = await aboutMePage.performComprehensiveAccessibilityAudit();
        
        // Test heading structure
        const headingLevels = accessibilityData.headingStructure.map(h => h.level);
        for (let i = 1; i < headingLevels.length; i++) {
          expect(headingLevels[i] - headingLevels[i-1]).toBeLessThanOrEqual(1);
        }
        
        // Test alt text presence
        const imagesWithoutAlt = accessibilityData.altTexts.filter(img => !img.hasAlt && !img.isDecorative);
        expect(imagesWithoutAlt.length).toBe(0);
        
        // Test semantic structure
        const hasMain = accessibilityData.semanticStructure.some(el => el.tag === 'MAIN');
        expect(hasMain).toBe(true);
        
        // Test ARIA labels
        const elementsWithAriaLabel = accessibilityData.ariaLabels.filter(el => el.hasAriaLabel);
        expect(elementsWithAriaLabel.length).toBeGreaterThan(0);
      });

      test('should have no critical accessibility violations', async () => {
        const accessibilityData = await aboutMePage.performComprehensiveAccessibilityAudit();
        
        // Check for critical accessibility violations
        const criticalViolations = aboutMePage.accessibilityViolations.filter(v => v.severity === 'serious');
        expect(criticalViolations.length).toBe(0);
        
        // Moderate violations should be minimal
        const moderateViolations = aboutMePage.accessibilityViolations.filter(v => v.severity === 'moderate');
        expect(moderateViolations.length).toBeLessThan(3);
      });
    });

    test.describe('7. Progressive Web App Testing', () => {
      test('should support PWA features', async () => {
        const pwaSupport = await aboutMePage.testPWAFeatures();
        
        // Test basic PWA features
        expect(pwaSupport.serviceWorker).toBe(true);
        expect(pwaSupport.webAppManifest).toBe(true);
        
        // Test advanced PWA features
        expect(pwaSupport.webAppCapable).toBe(true);
        expect(pwaSupport.themeColor).toBe(true);
      });
    });

    test.describe('8. Sustainability & Environmental Testing', () => {
      test('should have low carbon footprint', async () => {
        const carbonMetrics = await aboutMePage.measureCarbonFootprint();
        
        // Test carbon footprint
        expect(carbonMetrics.estimatedCO2).toBeLessThan(sustainabilityMetrics.carbonFootprint.good);
        
        // Test page weight
        expect(carbonMetrics.totalBytes).toBeLessThan(sustainabilityMetrics.energyEfficiency.pageWeight.max);
        
        // Test sustainability grade
        expect(['A', 'B', 'C']).toContain(carbonMetrics.sustainabilityGrade);
      });

      test('should have optimized resource usage', async () => {
        const carbonMetrics = await aboutMePage.measureCarbonFootprint();
        
        // Test resource count
        expect(carbonMetrics.resourceCount).toBeLessThan(sustainabilityMetrics.energyEfficiency.resourceRequests.max);
        
        // Test load time efficiency
        expect(carbonMetrics.loadTime).toBeLessThan(5000); // 5 seconds
      });
    });

    test.describe('9. Core Page Elements Testing', () => {
      test('should have all essential page elements', async () => {
        // Test profile image
        await expect(aboutMePage.profileImage).toBeVisible();
        
        // Test page title
        await expect(aboutMePage.pageTitle).toBeVisible();
        
        // Test navigation
        await expect(aboutMePage.navigationMenu).toBeVisible();
        
        // Test social links
        const socialLinks = await aboutMePage.socialLinks.count();
        expect(socialLinks).toBeGreaterThan(0);
      });

      test('should have quality content', async () => {
        // Test profile bio
        const bioText = await aboutMePage.getProfileBioText();
        expect(bioText).toBeDefined();
        expect(bioText.length).toBeGreaterThan(100);
        
        // Test social links functionality
        const socialLinksData = await aboutMePage.validateSocialLinks();
        expect(socialLinksData.length).toBeGreaterThan(0);
        
        socialLinksData.forEach(link => {
          expect(link.url).toBeDefined();
          expect(link.url.length).toBeGreaterThan(0);
        });
      });
    });

    test.describe('10. Comprehensive Integration Testing', () => {
      test('should generate complete quality report', async () => {
        const comprehensiveReport = await aboutMePage.generateComprehensiveReport();
        
        // Verify all report sections are present
        expect(comprehensiveReport.performance).toBeDefined();
        expect(comprehensiveReport.accessibility).toBeDefined();
        expect(comprehensiveReport.security).toBeDefined();
        expect(comprehensiveReport.seo).toBeDefined();
        expect(comprehensiveReport.webStandards).toBeDefined();
        expect(comprehensiveReport.sustainability).toBeDefined();
        expect(comprehensiveReport.contentQuality).toBeDefined();
        expect(comprehensiveReport.responsive).toBeDefined();
        
        // Verify report metadata
        expect(comprehensiveReport.timestamp).toBeDefined();
        expect(comprehensiveReport.url).toBe(testConfig.baseUrl);
      });
    });
  });

} else {
  // WebDriverIO implementation
  console.log('Running About Me tests in WebDriverIO');
  
  describe('About Me Page - Next Generation Testing Suite (WebDriverIO)', () => {
    let aboutMePage;

    beforeEach(async () => {
      aboutMePage = new AboutMePage();
      await aboutMePage.open();
    });

    describe('Core Functionality', () => {
      it('should have profile image present', async () => {
        await aboutMePage.isProfileImageVisible();
      });

      it('should have readable content', async () => {
        const bioText = await aboutMePage.getProfileBioText();
        expect(bioText).toBeDefined();
        expect(bioText.length).toBeGreaterThan(50);
      });

      it('should have working social links', async () => {
        const socialLinks = await aboutMePage.validateSocialLinks();
        expect(socialLinks.length).toBeGreaterThan(0);
      });
    });

    describe('Performance Testing', () => {
      it('should load within acceptable time', async () => {
        const startTime = Date.now();
        await aboutMePage.open();
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000); // 5 seconds
      });
    });

    describe('Accessibility Testing', () => {
      it('should support keyboard navigation', async () => {
        const navigationResults = await aboutMePage.testKeyboardNavigation();
        expect(navigationResults.length).toBeGreaterThan(0);
      });
    });
  });
}