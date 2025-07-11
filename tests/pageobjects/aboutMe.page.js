import { BasePage } from './base.page.js';
import { 
  pageStructure, 
  personalInfo, 
  socialLinks, 
  interactiveElements,
  contentSections,
  accessibilityElements,
  metaElements,
  testConfig,
  securityElements,
  visualElements,
  networkElements
} from './selectors.js';

const FRAMEWORK = process.env.FRAMEWORK;

export class AboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.performanceMetrics = {};
    this.accessibilityResults = {};
  }

  // Navigation and Basic Page Operations
  async open() {
    await super.open('');
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    if (FRAMEWORK === 'playwright') {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
    } else if (FRAMEWORK === 'wdio') {
      await browser.waitUntil(
        () => browser.execute(() => document.readyState === 'complete'),
        { timeout: testConfig.timeouts.pageLoad }
      );
    }
  }

  // Core Content Validation Methods
  async validatePageStructure() {
    const results = {
      hasTitle: await this.isElementPresent(pageStructure.pageTitle),
      hasMainContent: await this.isElementPresent(pageStructure.mainContent),
      hasNavigation: await this.isElementPresent(pageStructure.navigation),
      hasHeader: await this.isElementPresent(pageStructure.header),
      hasFooter: await this.isElementPresent(pageStructure.footer)
    };

    if (FRAMEWORK === 'playwright') {
      await this.expect(results.hasTitle).toBeTruthy();
      await this.expect(results.hasMainContent).toBeTruthy();
    }

    return results;
  }

  async getPageTitle() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.title();
    } else if (FRAMEWORK === 'wdio') {
      return await browser.getTitle();
    }
  }

  async getPageUrl() {
    if (FRAMEWORK === 'playwright') {
      return this.page.url();
    } else if (FRAMEWORK === 'wdio') {
      return await browser.getUrl();
    }
  }

  // Personal Information Validation
  async validatePersonalInfo() {
    const results = {
      hasProfileImage: await this.isElementPresent(personalInfo.profileImage),
      hasFullName: await this.isElementPresent(personalInfo.fullName),
      hasJobTitle: await this.isElementPresent(personalInfo.jobTitle),
      hasBio: await this.isElementPresent(personalInfo.bio),
      hasContactInfo: await this.hasContactInformation()
    };

    return results;
  }

  async getProfileImageSrc() {
    if (FRAMEWORK === 'playwright') {
      const img = await this.page.locator(personalInfo.profileImage).first();
      return await img.getAttribute('src');
    } else if (FRAMEWORK === 'wdio') {
      const img = await $(personalInfo.profileImage);
      return await img.getAttribute('src');
    }
  }

  async getProfileImageAlt() {
    if (FRAMEWORK === 'playwright') {
      const img = await this.page.locator(personalInfo.profileImage).first();
      return await img.getAttribute('alt');
    } else if (FRAMEWORK === 'wdio') {
      const img = await $(personalInfo.profileImage);
      return await img.getAttribute('alt');
    }
  }

  async getFullName() {
    if (FRAMEWORK === 'playwright') {
      const nameElement = await this.page.locator(personalInfo.fullName).first();
      return await nameElement.textContent();
    } else if (FRAMEWORK === 'wdio') {
      const nameElement = await $(personalInfo.fullName);
      return await nameElement.getText();
    }
  }

  async getBioText() {
    if (FRAMEWORK === 'playwright') {
      const bioElement = await this.page.locator(personalInfo.bio).first();
      return await bioElement.textContent();
    } else if (FRAMEWORK === 'wdio') {
      const bioElement = await $(personalInfo.bio);
      return await bioElement.getText();
    }
  }

  async hasContactInformation() {
    const hasEmail = await this.isElementPresent(personalInfo.emailAddress);
    const hasPhone = await this.isElementPresent(personalInfo.phoneNumber);
    const hasLocation = await this.isElementPresent(personalInfo.location);
    
    return hasEmail || hasPhone || hasLocation;
  }

  // Social Media and External Links
  async validateSocialLinks() {
    const results = {
      hasLinkedIn: await this.isElementPresent(socialLinks.linkedIn),
      hasTwitter: await this.isElementPresent(socialLinks.twitter),
      hasGitHub: await this.isElementPresent(socialLinks.github),
      hasInstagram: await this.isElementPresent(socialLinks.instagram),
      hasFacebook: await this.isElementPresent(socialLinks.facebook)
    };

    return results;
  }

  async getSocialLinkUrls() {
    const links = {};
    
    if (FRAMEWORK === 'playwright') {
      const socialElements = await this.page.locator(`${socialLinks.linkedIn}, ${socialLinks.twitter}, ${socialLinks.github}`).all();
      
      for (const element of socialElements) {
        const href = await element.getAttribute('href');
        if (href) {
          if (href.includes('linkedin')) links.linkedin = href;
          if (href.includes('twitter') || href.includes('x.com')) links.twitter = href;
          if (href.includes('github')) links.github = href;
        }
      }
    } else if (FRAMEWORK === 'wdio') {
      const allSocialLinks = await $$(`${socialLinks.linkedIn}, ${socialLinks.twitter}, ${socialLinks.github}`);
      
      for (const element of allSocialLinks) {
        const href = await element.getAttribute('href');
        if (href) {
          if (href.includes('linkedin')) links.linkedin = href;
          if (href.includes('twitter') || href.includes('x.com')) links.twitter = href;
          if (href.includes('github')) links.github = href;
        }
      }
    }

    return links;
  }

  async validateExternalLinks() {
    const results = {
      workingLinks: [],
      brokenLinks: [],
      secureLinks: []
    };

    if (FRAMEWORK === 'playwright') {
      const allLinks = await this.page.locator('a[href^="http"]').all();
      
      for (const link of allLinks) {
        const href = await link.getAttribute('href');
        if (href) {
          try {
            const response = await this.page.request.get(href);
            if (response.ok()) {
              results.workingLinks.push(href);
            } else {
              results.brokenLinks.push(href);
            }
            
            if (href.startsWith('https://')) {
              results.secureLinks.push(href);
            }
          } catch (error) {
            results.brokenLinks.push(href);
          }
        }
      }
    }

    return results;
  }

  // Accessibility Testing Methods
  async validateAccessibility() {
    const results = {
      headingStructure: await this.validateHeadingStructure(),
      keyboardNavigation: await this.validateKeyboardNavigation(),
      ariaLabels: await this.validateAriaLabels(),
      colorContrast: await this.validateColorContrast(),
      focusManagement: await this.validateFocusManagement()
    };

    return results;
  }

  async validateHeadingStructure() {
    if (FRAMEWORK === 'playwright') {
      const headings = await this.page.locator(accessibilityElements.headings).all();
      const headingLevels = [];
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        headingLevels.push(parseInt(tagName.replace('h', '')));
      }

      // Check for proper heading hierarchy
      let previousLevel = 0;
      let isValid = true;
      
      for (const level of headingLevels) {
        if (level > previousLevel + 1) {
          isValid = false;
          break;
        }
        previousLevel = level;
      }

      return {
        levels: headingLevels,
        isValidHierarchy: isValid,
        hasH1: headingLevels.includes(1),
        totalHeadings: headingLevels.length
      };
    }

    return { isValidHierarchy: true, hasH1: true };
  }

  async validateKeyboardNavigation() {
    if (FRAMEWORK === 'playwright') {
      const focusableElements = await this.page.locator(accessibilityElements.focusableElements).all();
      
      let tabIndex = 0;
      for (const element of focusableElements) {
        await element.focus();
        const isFocused = await element.evaluate(el => el === document.activeElement);
        if (!isFocused) {
          return { isValid: false, failedAt: tabIndex };
        }
        tabIndex++;
      }

      return { isValid: true, totalFocusableElements: focusableElements.length };
    }

    return { isValid: true };
  }

  async validateAriaLabels() {
    const results = {
      hasAriaLabels: await this.isElementPresent(accessibilityElements.ariaLabels),
      hasLandmarks: await this.isElementPresent(accessibilityElements.landmarks),
      hasSkipLinks: await this.isElementPresent(accessibilityElements.skipLinks)
    };

    return results;
  }

  async validateColorContrast() {
    // This would typically use a specialized library like axe-core
    // For now, we'll do a basic check
    if (FRAMEWORK === 'playwright') {
      const textElements = await this.page.locator('p, h1, h2, h3, h4, h5, h6, span, div').all();
      const contrastResults = [];

      for (const element of textElements.slice(0, 5)) { // Check first 5 elements
        try {
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor
            };
          });
          
          contrastResults.push({
            element: await element.textContent(),
            color: styles.color,
            backgroundColor: styles.backgroundColor
          });
        } catch (error) {
          // Skip elements that can't be evaluated
        }
      }

      return { elements: contrastResults, checked: true };
    }

    return { checked: false };
  }

  async validateFocusManagement() {
    if (FRAMEWORK === 'playwright') {
      const focusableElements = await this.page.locator(accessibilityElements.focusableElements).all();
      
      for (const element of focusableElements.slice(0, 3)) {
        await element.focus();
        const focusVisible = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });
        
        if (!focusVisible) {
          return { hasFocusIndicators: false };
        }
      }

      return { hasFocusIndicators: true };
    }

    return { hasFocusIndicators: true };
  }

  // Performance Testing Methods
  async measurePerformance() {
    if (FRAMEWORK === 'playwright') {
      const performanceEntries = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });

      this.performanceMetrics = performanceEntries;
      return performanceEntries;
    }

    return {};
  }

  async measureCoreWebVitals() {
    if (FRAMEWORK === 'playwright') {
      const vitals = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            
            entries.forEach(entry => {
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.lcp = entry.startTime;
              }
              if (entry.entryType === 'layout-shift') {
                vitals.cls = (vitals.cls || 0) + entry.value;
              }
            });
            
            setTimeout(() => resolve(vitals), 2000);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        });
      });

      return vitals;
    }

    return {};
  }

  async checkImageOptimization() {
    if (FRAMEWORK === 'playwright') {
      const images = await this.page.locator('img').all();
      const imageResults = [];

      for (const img of images) {
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const loading = await img.getAttribute('loading');
        
        if (src) {
          imageResults.push({
            src,
            hasAlt: !!alt,
            isLazyLoaded: loading === 'lazy',
            isOptimized: src.includes('webp') || src.includes('avif')
          });
        }
      }

      return imageResults;
    }

    return [];
  }

  // SEO and Metadata Validation
  async validateSEO() {
    const results = {
      title: await this.getMetaContent('title'),
      description: await this.getMetaContent('meta[name="description"]'),
      keywords: await this.getMetaContent('meta[name="keywords"]'),
      openGraph: await this.validateOpenGraph(),
      twitterCards: await this.validateTwitterCards(),
      canonicalUrl: await this.getMetaContent('link[rel="canonical"]'),
      viewport: await this.getMetaContent('meta[name="viewport"]')
    };

    return results;
  }

  async getMetaContent(selector) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      if (selector === 'title') {
        return await element.textContent();
      } else {
        return await element.getAttribute('content') || await element.getAttribute('href');
      }
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      if (selector === 'title') {
        return await element.getText();
      } else {
        return await element.getAttribute('content') || await element.getAttribute('href');
      }
    }
  }

  async validateOpenGraph() {
    const ogData = {
      title: await this.getMetaContent(metaElements.ogTitle),
      description: await this.getMetaContent(metaElements.ogDescription),
      image: await this.getMetaContent(metaElements.ogImage),
      url: await this.getMetaContent(metaElements.ogUrl)
    };

    return ogData;
  }

  async validateTwitterCards() {
    const twitterData = {
      card: await this.getMetaContent(metaElements.twitterCard),
      title: await this.getMetaContent(metaElements.twitterTitle),
      description: await this.getMetaContent(metaElements.twitterDescription),
      image: await this.getMetaContent(metaElements.twitterImage)
    };

    return twitterData;
  }

  // Responsive Design Testing
  async testResponsiveDesign() {
    const results = {};

    for (const [deviceName, viewport] of Object.entries(testConfig.viewports)) {
      if (FRAMEWORK === 'playwright') {
        await this.page.setViewportSize(viewport);
        await this.page.waitForTimeout(1000); // Wait for layout to adjust
        
        results[deviceName] = {
          viewport,
          isVisible: await this.isElementVisible(pageStructure.mainContent),
          hasOverflow: await this.checkHorizontalOverflow(),
          touchTargets: await this.validateTouchTargets()
        };
      }
    }

    return results;
  }

  async checkHorizontalOverflow() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });
    }
    return false;
  }

  async validateTouchTargets() {
    if (FRAMEWORK === 'playwright') {
      const interactiveElements = await this.page.locator('a, button, input, textarea, select').all();
      const results = [];

      for (const element of interactiveElements.slice(0, 10)) {
        const box = await element.boundingBox();
        if (box) {
          results.push({
            width: box.width,
            height: box.height,
            meetsMinimum: box.width >= testConfig.accessibility.touchTargetSize && 
                         box.height >= testConfig.accessibility.touchTargetSize
          });
        }
      }

      return results;
    }

    return [];
  }

  // Security Testing Methods
  async validateSecurity() {
    const results = {
      isHTTPS: await this.isUsingHTTPS(),
      securityHeaders: await this.checkSecurityHeaders(),
      externalLinks: await this.validateExternalLinkSecurity(),
      formSecurity: await this.validateFormSecurity()
    };

    return results;
  }

  async isUsingHTTPS() {
    const url = await this.getPageUrl();
    return url.startsWith('https://');
  }

  async checkSecurityHeaders() {
    if (FRAMEWORK === 'playwright') {
      const response = await this.page.waitForResponse(response => response.url().includes(this.page.url()));
      const headers = response.headers();
      
      const securityHeaders = {};
      for (const header of securityElements.securityHeaders) {
        securityHeaders[header] = headers[header] || null;
      }

      return securityHeaders;
    }

    return {};
  }

  async validateExternalLinkSecurity() {
    if (FRAMEWORK === 'playwright') {
      const externalLinks = await this.page.locator('a[href^="http"]:not([href*="' + new URL(this.page.url()).hostname + '"])').all();
      const results = [];

      for (const link of externalLinks) {
        const rel = await link.getAttribute('rel');
        results.push({
          href: await link.getAttribute('href'),
          hasNoopener: rel && rel.includes('noopener'),
          hasNoreferrer: rel && rel.includes('noreferrer')
        });
      }

      return results;
    }

    return [];
  }

  async validateFormSecurity() {
    if (FRAMEWORK === 'playwright') {
      const forms = await this.page.locator('form').all();
      const results = [];

      for (const form of forms) {
        const action = await form.getAttribute('action');
        const method = await form.getAttribute('method');
        
        results.push({
          action,
          method,
          isSecure: !action || action.startsWith('https://') || action.startsWith('/')
        });
      }

      return results;
    }

    return [];
  }

  // Visual Regression Testing
  async captureScreenshot(name = 'aboutme-page') {
    if (FRAMEWORK === 'playwright') {
      return await this.page.screenshot({ 
        path: `screenshots/${name}.png`,
        fullPage: true 
      });
    }

    return null;
  }

  async captureElementScreenshot(selector, name) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      return await element.screenshot({ 
        path: `screenshots/${name}.png` 
      });
    }

    return null;
  }

  // Utility Methods
  async isElementVisible(selector) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      return await element.isVisible();
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      return await element.isDisplayed();
    }

    return false;
  }

  async getElementText(selector) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      return await element.textContent();
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      return await element.getText();
    }

    return '';
  }

  async getElementAttribute(selector, attribute) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      return await element.getAttribute(attribute);
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      return await element.getAttribute(attribute);
    }

    return null;
  }

  async clickElement(selector) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      await element.click();
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      await element.click();
    }
  }

  async scrollToElement(selector) {
    if (FRAMEWORK === 'playwright') {
      const element = await this.page.locator(selector).first();
      await element.scrollIntoViewIfNeeded();
    } else if (FRAMEWORK === 'wdio') {
      const element = await $(selector);
      await element.scrollIntoView();
    }
  }

  // Network and Performance Analysis
  async analyzeNetworkRequests() {
    if (FRAMEWORK === 'playwright') {
      const requests = [];
      
      this.page.on('request', request => {
        requests.push({
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType()
        });
      });

      return requests;
    }

    return [];
  }

  async checkThirdPartyScripts() {
    if (FRAMEWORK === 'playwright') {
      const scripts = await this.page.locator('script[src]').all();
      const thirdPartyScripts = [];

      for (const script of scripts) {
        const src = await script.getAttribute('src');
        if (src && !src.startsWith('/') && !src.includes(new URL(this.page.url()).hostname)) {
          thirdPartyScripts.push(src);
        }
      }

      return thirdPartyScripts;
    }

    return [];
  }

  // Content Quality Analysis
  async analyzeContentQuality() {
    const results = {
      bioLength: await this.getBioLength(),
      hasContactInfo: await this.hasContactInformation(),
      linksWorking: await this.validateExternalLinks(),
      imagesOptimized: await this.checkImageOptimization(),
      readabilityScore: await this.calculateReadabilityScore()
    };

    return results;
  }

  async getBioLength() {
    const bioText = await this.getBioText();
    return bioText ? bioText.length : 0;
  }

  async calculateReadabilityScore() {
    if (FRAMEWORK === 'playwright') {
      const textContent = await this.page.locator('p, h1, h2, h3, h4, h5, h6').allTextContents();
      const allText = textContent.join(' ');
      
      // Simple readability calculation (word count, sentence count)
      const wordCount = allText.split(/\s+/).length;
      const sentenceCount = allText.split(/[.!?]+/).length;
      const avgWordsPerSentence = wordCount / sentenceCount;

      return {
        wordCount,
        sentenceCount,
        avgWordsPerSentence,
        readabilityLevel: avgWordsPerSentence < 20 ? 'Easy' : avgWordsPerSentence < 30 ? 'Medium' : 'Hard'
      };
    }

    return { readabilityLevel: 'Unknown' };
  }

  // Comprehensive Test Runner
  async runComprehensiveTests() {
    const results = {
      timestamp: new Date().toISOString(),
      pageStructure: await this.validatePageStructure(),
      personalInfo: await this.validatePersonalInfo(),
      socialLinks: await this.validateSocialLinks(),
      accessibility: await this.validateAccessibility(),
      performance: await this.measurePerformance(),
      seo: await this.validateSEO(),
      security: await this.validateSecurity(),
      responsive: await this.testResponsiveDesign(),
      contentQuality: await this.analyzeContentQuality()
    };

    return results;
  }
}