import { BasePage } from './base.page.js';
import { aboutMeSelectors, performanceThresholds, testData } from './selectors.js';

export class AboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.selectors = aboutMeSelectors;
    this.testData = testData;
  }

  async open() {
    await super.open('');
  }

  // ========== CONTENT VALIDATION METHODS ==========
  
  async getPageTitle() {
    return await this.page.title();
  }

  async getProfileName() {
    return await this.getElementText(this.selectors.fullName);
  }

  async getJobTitle() {
    return await this.getElementText(this.selectors.jobTitle);
  }

  async getProfileBio() {
    return await this.getElementText(this.selectors.biography);
  }

  async getLocation() {
    return await this.getElementText(this.selectors.location);
  }

  async validatePersonalInfo() {
    const name = await this.getProfileName();
    const title = await this.getJobTitle();
    const location = await this.getLocation();
    
    await this.expect(name).toContain(this.testData.personalInfo.expectedName);
    await this.expect(title).toBeTruthy();
    await this.expect(location).toBeTruthy();
    
    return { name, title, location };
  }

  async validateContactInfo() {
    const results = {};
    
    // Email validation
    if (await this.isElementPresent(this.selectors.emailLink)) {
      const emailHref = await this.getElementAttribute(this.selectors.emailLink, 'href');
      results.email = {
        present: true,
        valid: emailHref && emailHref.startsWith('mailto:'),
        href: emailHref
      };
    }
    
    // Phone validation
    if (await this.isElementPresent(this.selectors.phoneNumber)) {
      const phoneText = await this.getElementText(this.selectors.phoneNumber);
      results.phone = {
        present: true,
        text: phoneText,
        valid: /[\d\-\+\(\)\s]+/.test(phoneText)
      };
    }
    
    return results;
  }

  async validateSocialLinks() {
    const socialLinks = await this.page.locator(this.selectors.socialLinks).all();
    const results = [];
    
    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      const isExternal = href && (href.startsWith('http') || href.startsWith('https'));
      
      results.push({
        href,
        text,
        isExternal,
        isValid: href && href.length > 0
      });
    }
    
    return results;
  }

  async validateExternalLinks() {
    const links = await this.page.locator('a[href^="http"]').all();
    const results = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      
      // Test if link opens in new tab/window for external links
      results.push({
        href,
        target,
        opensInNewTab: target === '_blank',
        hasNoopener: (await link.getAttribute('rel') || '').includes('noopener')
      });
    }
    
    return results;
  }

  // ========== PERFORMANCE TESTING METHODS ==========
  
  async measureCoreWebVitals() {
    // Measure Core Web Vitals using Performance API
    const vitals = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.name === 'first-input-delay') {
              vitals.fid = entry.duration;
            }
            if (entry.name === 'cumulative-layout-shift') {
              vitals.cls = entry.value;
            }
          });
          
          // Also get FCP
          const navigationEntry = performance.getEntriesByType('navigation')[0];
          if (navigationEntry) {
            vitals.loadTime = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;
          }
          
          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });
    
    return vitals;
  }

  async testImageOptimization() {
    const images = await this.page.locator('img').all();
    const results = [];
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const loading = await img.getAttribute('loading');
      
      // Check if image has proper attributes
      results.push({
        src,
        hasAlt: !!alt,
        isLazyLoaded: loading === 'lazy',
        altText: alt
      });
    }
    
    return results;
  }

  async validatePageLoadPerformance() {
    const metrics = await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      };
    });
    
    return metrics;
  }

  // ========== ACCESSIBILITY TESTING METHODS ==========
  
  async testKeyboardNavigation() {
    // Test Tab navigation through interactive elements
    const focusableElements = await this.page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    const results = [];
    
    for (let i = 0; i < focusableElements.length; i++) {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.locator(':focus').first();
      const tagName = await focusedElement.evaluate(el => el.tagName);
      const hasVisibleFocus = await focusedElement.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.outline !== 'none' || style.boxShadow !== 'none';
      });
      
      results.push({
        index: i,
        tagName,
        hasVisibleFocus
      });
    }
    
    return results;
  }

  async validateAriaLabels() {
    const elementsWithAria = await this.page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
    const results = [];
    
    for (const element of elementsWithAria) {
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledby = await element.getAttribute('aria-labelledby');
      const ariaDescribedby = await element.getAttribute('aria-describedby');
      const tagName = await element.evaluate(el => el.tagName);
      
      results.push({
        tagName,
        ariaLabel,
        ariaLabelledby,
        ariaDescribedby,
        hasAccessibleName: !!(ariaLabel || ariaLabelledby)
      });
    }
    
    return results;
  }

  async validateHeadingStructure() {
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    const results = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const text = await heading.textContent();
      const level = parseInt(tagName.charAt(1));
      
      results.push({
        level,
        text: text?.trim(),
        tagName
      });
    }
    
    // Check for proper heading hierarchy
    const hierarchy = results.map(h => h.level);
    const hasValidHierarchy = this.validateHeadingHierarchy(hierarchy);
    
    return {
      headings: results,
      hasValidHierarchy,
      hasH1: hierarchy.includes(1),
      h1Count: hierarchy.filter(level => level === 1).length
    };
  }

  validateHeadingHierarchy(levels) {
    if (levels.length === 0) return true;
    if (levels[0] !== 1) return false; // Should start with H1
    
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      if (diff > 1) return false; // Can't skip levels
    }
    
    return true;
  }

  async testColorContrast() {
    // Basic color contrast test using computed styles
    const textElements = await this.page.locator('p, span, a, h1, h2, h3, h4, h5, h6').all();
    const results = [];
    
    for (const element of textElements) {
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      results.push(styles);
    }
    
    return results;
  }

  // ========== RESPONSIVE DESIGN TESTING METHODS ==========
  
  async testResponsiveLayout(viewport) {
    await this.page.setViewportSize(viewport);
    await this.page.waitForLoadState('networkidle');
    
    const layoutInfo = await this.page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    
    return layoutInfo;
  }

  async testTouchTargets() {
    const interactiveElements = await this.page.locator('a, button, input, [onclick], [role="button"]').all();
    const results = [];
    
    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox();
      const isValidTouchTarget = boundingBox && 
        boundingBox.width >= 44 && 
        boundingBox.height >= 44;
      
      results.push({
        width: boundingBox?.width,
        height: boundingBox?.height,
        isValidTouchTarget,
        element: await element.evaluate(el => el.tagName)
      });
    }
    
    return results;
  }

  // ========== SECURITY TESTING METHODS ==========
  
  async validateSecurityHeaders() {
    const response = await this.page.goto(this.page.url());
    const headers = response?.headers() || {};
    
    return {
      contentSecurityPolicy: headers['content-security-policy'],
      strictTransportSecurity: headers['strict-transport-security'],
      xFrameOptions: headers['x-frame-options'],
      xContentTypeOptions: headers['x-content-type-options'],
      referrerPolicy: headers['referrer-policy'],
      hasCSP: !!headers['content-security-policy'],
      hasHSTS: !!headers['strict-transport-security']
    };
  }

  async checkMixedContent() {
    const resources = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const isHTTPS = location.protocol === 'https:';
      
      if (!isHTTPS) return { isHTTPS: false, mixedContent: [] };
      
      const mixedContent = resources.filter(resource => 
        resource.name.startsWith('http:')
      );
      
      return {
        isHTTPS,
        mixedContent: mixedContent.map(r => r.name),
        hasMixedContent: mixedContent.length > 0
      };
    });
    
    return resources;
  }

  // ========== SEO TESTING METHODS ==========
  
  async validateMetaTags() {
    const metaTags = await this.page.evaluate(() => {
      const tags = {};
      
      // Basic meta tags
      tags.title = document.title;
      tags.description = document.querySelector('meta[name="description"]')?.content;
      tags.keywords = document.querySelector('meta[name="keywords"]')?.content;
      tags.viewport = document.querySelector('meta[name="viewport"]')?.content;
      
      // Open Graph tags
      tags.ogTitle = document.querySelector('meta[property="og:title"]')?.content;
      tags.ogDescription = document.querySelector('meta[property="og:description"]')?.content;
      tags.ogImage = document.querySelector('meta[property="og:image"]')?.content;
      tags.ogUrl = document.querySelector('meta[property="og:url"]')?.content;
      
      // Twitter Card tags
      tags.twitterCard = document.querySelector('meta[name="twitter:card"]')?.content;
      tags.twitterTitle = document.querySelector('meta[name="twitter:title"]')?.content;
      tags.twitterDescription = document.querySelector('meta[name="twitter:description"]')?.content;
      
      return tags;
    });
    
    return metaTags;
  }

  async validateStructuredData() {
    const structuredData = await this.page.evaluate(() => {
      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const data = [];
      
      jsonLdScripts.forEach(script => {
        try {
          const parsedData = JSON.parse(script.textContent || '');
          data.push(parsedData);
        } catch (e) {
          data.push({ error: 'Invalid JSON-LD' });
        }
      });
      
      return data;
    });
    
    return structuredData;
  }

  // ========== UTILITY METHODS ==========
  
  async takeFullPageScreenshot(name) {
    return await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  async generateAccessibilityReport() {
    // This would integrate with axe-core for comprehensive accessibility testing
    const axeResults = await this.page.evaluate(() => {
      // Placeholder for axe-core integration
      return { placeholder: 'Integrate axe-core for full accessibility audit' };
    });
    
    return axeResults;
  }

  async validatePagePerformance() {
    const vitals = await this.measureCoreWebVitals();
    const loadMetrics = await this.validatePageLoadPerformance();
    
    const performance = {
      coreWebVitals: vitals,
      loadMetrics,
      passed: {
        lcp: !vitals.lcp || vitals.lcp < performanceThresholds.maxLCPTime,
        fid: !vitals.fid || vitals.fid < performanceThresholds.maxFIDTime,
        cls: !vitals.cls || vitals.cls < performanceThresholds.maxCLSScore,
        loadTime: !loadMetrics.loadComplete || loadMetrics.loadComplete < performanceThresholds.maxLoadTime
      }
    };
    
    return performance;
  }
}