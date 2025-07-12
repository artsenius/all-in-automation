import { BasePage } from './base.page.js';
import { aboutMeSelectors } from './selectors.js';

export class AboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.performanceMetrics = {};
  }

  async open() {
    await super.open('');
  }

  // Basic Element Checks
  async isProfileImagePresent() {
    return await super.isElementPresent(aboutMeSelectors.profileImage);
  }

  async getPageTitle() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.title();
    } else {
      return await browser.getTitle();
    }
  }

  async getMainContent() {
    if (FRAMEWORK === 'playwright') {
      return await this.page.locator(aboutMeSelectors.mainContent).textContent();
    } else {
      return await $(aboutMeSelectors.mainContent).getText();
    }
  }

  // Performance Testing Methods
  async measureCoreWebVitals() {
    if (FRAMEWORK === 'playwright') {
      await this.page.addInitScript(() => {
        window.webVitalsData = {};
        
        // LCP measurement
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            window.webVitalsData.lcp = lastEntry.startTime;
          }
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

  async measureLoadTime() {
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

  // Accessibility Testing Methods
  async runBasicAccessibilityCheck() {
    if (FRAMEWORK === 'playwright') {
      // Check for alt text on images
      const imagesWithoutAlt = await this.page.$$eval('img', images => 
        images.filter(img => !img.alt || img.alt.trim() === '').length
      );
      
      // Check for proper heading structure
      const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
        elements.map(el => el.tagName)
      );
      
      // Check for form labels
      const unlabeledInputs = await this.page.$$eval('input, textarea, select', inputs =>
        inputs.filter(input => {
          const label = document.querySelector(`label[for="${input.id}"]`);
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          return !label && !ariaLabel && !ariaLabelledBy;
        }).length
      );

      return {
        imagesWithoutAlt,
        headingStructure: headings,
        unlabeledInputs,
        hasH1: headings.includes('H1'),
        headingCount: headings.length
      };
    }
  }

  async testKeyboardNavigation() {
    if (FRAMEWORK === 'playwright') {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.evaluate(() => ({
        tagName: document.activeElement.tagName,
        type: document.activeElement.type,
        id: document.activeElement.id,
        className: document.activeElement.className
      }));
      return focusedElement;
    }
  }

  // SEO Testing Methods
  async validateSEOBasics() {
    const metadata = {};
    
    if (FRAMEWORK === 'playwright') {
      metadata.title = await this.page.title();
      metadata.description = await this.page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
      metadata.keywords = await this.page.locator('meta[name="keywords"]').getAttribute('content').catch(() => null);
      metadata.ogTitle = await this.page.locator('meta[property="og:title"]').getAttribute('content').catch(() => null);
      metadata.ogDescription = await this.page.locator('meta[property="og:description"]').getAttribute('content').catch(() => null);
      metadata.ogImage = await this.page.locator('meta[property="og:image"]').getAttribute('content').catch(() => null);
      metadata.viewport = await this.page.locator('meta[name="viewport"]').getAttribute('content').catch(() => null);
      
      // Check for structured data
      const structuredData = await this.page.$$eval('script[type="application/ld+json"]', scripts =>
        scripts.map(script => {
          try {
            return JSON.parse(script.textContent);
          } catch {
            return null;
          }
        }).filter(data => data !== null)
      );
      metadata.structuredData = structuredData;
    }
    
    return metadata;
  }

  // Responsive Design Testing
  async testResponsiveDesign() {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    const results = {};

    for (const breakpoint of breakpoints) {
      if (FRAMEWORK === 'playwright') {
        await this.page.setViewportSize({ 
          width: breakpoint.width, 
          height: breakpoint.height 
        });
        
        // Check if content is visible and readable
        const isContentVisible = await this.page.locator(aboutMeSelectors.mainContent).isVisible();
        const hasHorizontalScroll = await this.page.evaluate(() => 
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        
        // Check minimum font sizes
        const fontSizes = await this.page.$$eval('p, h1, h2, h3, h4, h5, h6', elements =>
          elements.map(el => parseInt(window.getComputedStyle(el).fontSize))
        );
        const minFontSize = Math.min(...fontSizes);
        
        results[breakpoint.name] = {
          viewport: breakpoint,
          isContentVisible,
          hasHorizontalScroll,
          minFontSize,
          isReadable: minFontSize >= 16
        };
      }
    }

    return results;
  }

  // Content Quality Testing
  async validateContentQuality() {
    const content = await this.getMainContent();
    if (!content) return null;
    
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    // Simple readability metrics
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    const avgSentencesPerParagraph = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 100) / 100,
      avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 100) / 100,
      hasSubstantialContent: words.length > 100,
      readabilityScore: avgWordsPerSentence < 20 ? 'Good' : avgWordsPerSentence < 30 ? 'Fair' : 'Poor'
    };
  }

  // Social Media & External Links Testing
  async validateSocialLinks() {
    if (FRAMEWORK === 'playwright') {
      const socialLinks = await this.page.$$eval('a[href*="linkedin"], a[href*="twitter"], a[href*="github"], a[href*="facebook"], a[href*="instagram"]', links =>
        links.map(link => ({
          platform: this.getSocialPlatform(link.href),
          href: link.href,
          isWorking: link.href.startsWith('http'),
          hasTarget: link.target === '_blank',
          hasRel: link.rel.includes('noopener') && link.rel.includes('noreferrer')
        }))
      );
      
      return socialLinks;
    }
    return [];
  }

  getSocialPlatform(url) {
    if (url.includes('linkedin')) return 'LinkedIn';
    if (url.includes('twitter')) return 'Twitter';
    if (url.includes('github')) return 'GitHub';
    if (url.includes('facebook')) return 'Facebook';
    if (url.includes('instagram')) return 'Instagram';
    return 'Other';
  }

  // Security Testing
  async validateBasicSecurity() {
    if (FRAMEWORK === 'playwright') {
      const response = await this.page.goto('');
      const headers = response.headers();
      
      // Check for external links security
      const externalLinks = await this.page.$$eval('a[href^="http"]', links =>
        links.filter(link => !link.href.includes(window.location.hostname))
          .map(link => ({
            href: link.href,
            rel: link.rel,
            target: link.target,
            hasSecureRel: link.rel.includes('noopener') && link.rel.includes('noreferrer')
          }))
      );
      
      return {
        securityHeaders: {
          csp: headers['content-security-policy'] || null,
          xframe: headers['x-frame-options'] || null,
          hsts: headers['strict-transport-security'] || null,
          referrerPolicy: headers['referrer-policy'] || null
        },
        externalLinks,
        secureExternalLinks: externalLinks.filter(link => link.hasSecureRel).length,
        totalExternalLinks: externalLinks.length
      };
    }
  }

  // Visual Testing Support
  async takeScreenshot(name) {
    if (FRAMEWORK === 'playwright') {
      await this.page.screenshot({
        path: `screenshots/${name}.png`,
        fullPage: true
      });
    }
  }

  async compareVisual(name, threshold = 0.2) {
    if (FRAMEWORK === 'playwright') {
      await this.expect(this.page).toHaveScreenshot(`${name}.png`, {
        threshold,
        maxDiffPixels: 100
      });
    }
  }

  // User Experience Metrics
  async measureUserEngagement() {
    if (FRAMEWORK === 'playwright') {
      await this.page.addInitScript(() => {
        window.engagementMetrics = {
          scrollDepth: 0,
          timeOnPage: Date.now(),
          interactions: 0,
          clicks: 0
        };

        // Track scroll depth
        window.addEventListener('scroll', () => {
          const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
          window.engagementMetrics.scrollDepth = Math.max(window.engagementMetrics.scrollDepth, scrollPercent);
        });

        // Track interactions
        window.addEventListener('click', () => {
          window.engagementMetrics.interactions++;
          window.engagementMetrics.clicks++;
        });

        window.addEventListener('keydown', () => {
          window.engagementMetrics.interactions++;
        });
      });
    }
  }

  async getEngagementMetrics() {
    if (FRAMEWORK === 'playwright') {
      const metrics = await this.page.evaluate(() => {
        if (window.engagementMetrics) {
          const current = { ...window.engagementMetrics };
          current.timeOnPage = Date.now() - current.timeOnPage;
          return current;
        }
        return null;
      });
      return metrics;
    }
  }

  // Contact Form Testing (if present)
  async testContactForm() {
    if (FRAMEWORK === 'playwright') {
      const formExists = await this.page.locator('form').count() > 0;
      if (!formExists) return { hasForm: false };

      const formInfo = await this.page.evaluate(() => {
        const form = document.querySelector('form');
        if (!form) return { hasForm: false };

        const inputs = form.querySelectorAll('input, textarea, select');
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        return {
          hasForm: true,
          inputCount: inputs.length,
          hasSubmitButton: !!submitButton,
          hasEmailField: !!form.querySelector('input[type="email"], input[name*="email"]'),
          hasNameField: !!form.querySelector('input[name*="name"]'),
          hasMessageField: !!form.querySelector('textarea'),
          hasValidation: Array.from(inputs).some(input => input.required || input.pattern)
        };
      });

      return formInfo;
    }
  }
}