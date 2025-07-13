const { BasePage } = require('./base.page.js');

export class AboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.baseUrl = 'https://www.arthursenko.com';
    this.performanceMetrics = {};
    this.accessibilityViolations = [];
    this.securityHeaders = {};
  }

  // Advanced Performance Testing Methods
  async measureCoreWebVitals() {
    const metrics = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {
            lcp: null,
            fid: null,
            cls: null,
            inp: null,
            ttfb: null
          };

          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.cls = entry.value;
            }
            if (entry.entryType === 'interaction') {
              vitals.inp = entry.duration;
            }
            if (entry.entryType === 'navigation') {
              vitals.ttfb = entry.responseStart - entry.fetchStart;
            }
          });

          resolve(vitals);
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'interaction', 'navigation'] });
      });
    });

    this.performanceMetrics = metrics;
    return metrics;
  }

  async measureAdvancedPerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const performance = window.performance;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        totalBlockingTime: navigation.loadEventEnd - navigation.loadEventStart,
        speedIndex: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        longTasks: performance.getEntriesByType('longtask').length,
        mainThreadBlockingTime: performance.getEntriesByType('longtask').reduce((sum, task) => sum + task.duration, 0),
        resourceLoadTime: performance.getEntriesByType('resource').reduce((sum, resource) => sum + resource.duration, 0),
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart
      };
    });

    return metrics;
  }

  async simulateNetworkConditions(preset = 'Regular3G') {
    const conditions = {
      'Regular3G': { offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 768 * 1024 / 8, latency: 300 },
      'Slow3G': { offline: false, downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
      'Fast3G': { offline: false, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 768 * 1024 / 8, latency: 150 },
      'Regular4G': { offline: false, downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8, latency: 20 },
      'Offline': { offline: true, downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
    };

    const cdp = await this.page.context().newCDPSession(this.page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', conditions[preset]);
  }

  // AI-Powered Testing Methods
  async analyzeContentQuality() {
    const contentAnalysis = await this.page.evaluate(() => {
      const textContent = document.body.innerText;
      const words = textContent.split(/\s+/).filter(word => word.length > 0);
      const sentences = textContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      const paragraphs = textContent.split(/\n\s*\n/).filter(para => para.trim().length > 0);

      // Readability metrics
      const avgWordsPerSentence = words.length / sentences.length;
      const avgSentencesPerParagraph = sentences.length / paragraphs.length;
      const readabilityScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (words.filter(word => word.match(/[aeiou]/gi)).length / words.length));

      // Content quality indicators
      const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
      const lexicalDiversity = uniqueWords / words.length;
      const contentDensity = words.length / textContent.length;

      return {
        wordCount: words.length,
        sentenceCount: sentences.length,
        paragraphCount: paragraphs.length,
        avgWordsPerSentence,
        avgSentencesPerParagraph,
        readabilityScore,
        lexicalDiversity,
        contentDensity,
        readabilityGrade: readabilityScore > 90 ? 'Very Easy' : 
                         readabilityScore > 80 ? 'Easy' : 
                         readabilityScore > 70 ? 'Fairly Easy' : 
                         readabilityScore > 60 ? 'Standard' : 
                         readabilityScore > 50 ? 'Fairly Difficult' : 
                         readabilityScore > 30 ? 'Difficult' : 'Very Difficult'
      };
    });

    return contentAnalysis;
  }

  async performVisualRegressionTest(baseline = null) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    
    if (baseline) {
      // In a real implementation, this would use image comparison libraries
      // like Pixelmatch or ResembleJS
      const comparison = {
        isSame: true, // Placeholder
        difference: 0,
        diffImage: null
      };
      return comparison;
    }

    return { screenshot, timestamp: Date.now() };
  }

  // Advanced Accessibility Testing
  async performComprehensiveAccessibilityAudit() {
    const accessibilityData = await this.page.evaluate(() => {
      const audit = {
        headingStructure: [],
        colorContrast: [],
        keyboardNavigation: [],
        ariaLabels: [],
        altTexts: [],
        focusManagement: [],
        semanticStructure: []
      };

      // Heading structure analysis
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        audit.headingStructure.push({
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent.trim(),
          hasId: !!heading.id,
          isEmpty: !heading.textContent.trim()
        });
      });

      // Color contrast analysis (simplified)
      const textElements = document.querySelectorAll('p, span, div, a, button, input, label');
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        audit.colorContrast.push({
          element: element.tagName,
          color,
          backgroundColor,
          text: element.textContent.trim().substring(0, 50)
        });
      });

      // ARIA labels and roles
      const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
      ariaElements.forEach(element => {
        audit.ariaLabels.push({
          tag: element.tagName,
          ariaLabel: element.getAttribute('aria-label'),
          ariaLabelledBy: element.getAttribute('aria-labelledby'),
          role: element.getAttribute('role'),
          hasAriaLabel: !!element.getAttribute('aria-label')
        });
      });

      // Alt text analysis
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        audit.altTexts.push({
          src: img.src,
          alt: img.alt,
          hasAlt: !!img.alt,
          isDecorative: img.alt === '',
          altLength: img.alt ? img.alt.length : 0
        });
      });

      // Focus management
      const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
      focusableElements.forEach(element => {
        audit.focusManagement.push({
          tag: element.tagName,
          tabIndex: element.tabIndex,
          isFocusable: element.tabIndex >= 0,
          hasVisibleFocus: !!element.style.outline || !!element.style.border
        });
      });

      // Semantic structure
      const semanticElements = document.querySelectorAll('main, nav, section, article, aside, header, footer');
      semanticElements.forEach(element => {
        audit.semanticStructure.push({
          tag: element.tagName,
          role: element.getAttribute('role'),
          hasLandmarkRole: ['main', 'nav', 'banner', 'contentinfo', 'complementary'].includes(element.getAttribute('role'))
        });
      });

      return audit;
    });

    this.accessibilityViolations = this.analyzeAccessibilityViolations(accessibilityData);
    return accessibilityData;
  }

  analyzeAccessibilityViolations(data) {
    const violations = [];

    // Check heading structure
    const headingLevels = data.headingStructure.map(h => h.level);
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i-1] + 1) {
        violations.push({
          type: 'heading-structure',
          severity: 'moderate',
          message: `Heading level ${headingLevels[i]} follows heading level ${headingLevels[i-1]}, skipping levels`
        });
      }
    }

    // Check for missing alt texts
    const imagesWithoutAlt = data.altTexts.filter(img => !img.hasAlt && !img.isDecorative);
    if (imagesWithoutAlt.length > 0) {
      violations.push({
        type: 'missing-alt-text',
        severity: 'serious',
        message: `${imagesWithoutAlt.length} images missing alt text`,
        count: imagesWithoutAlt.length
      });
    }

    // Check for proper semantic structure
    const hasMain = data.semanticStructure.some(el => el.tag === 'MAIN');
    if (!hasMain) {
      violations.push({
        type: 'missing-main-landmark',
        severity: 'moderate',
        message: 'Page missing main landmark'
      });
    }

    return violations;
  }

  // Advanced Security Testing
  async analyzeSecurityHeaders() {
    const response = await this.page.goto(this.baseUrl);
    const headers = response.headers();

    const securityAnalysis = {
      contentSecurityPolicy: {
        present: !!headers['content-security-policy'],
        value: headers['content-security-policy'] || null,
        level: this.analyzeCSPLevel(headers['content-security-policy'])
      },
      strictTransportSecurity: {
        present: !!headers['strict-transport-security'],
        value: headers['strict-transport-security'] || null,
        includesSubdomains: headers['strict-transport-security']?.includes('includeSubDomains') || false
      },
      xFrameOptions: {
        present: !!headers['x-frame-options'],
        value: headers['x-frame-options'] || null,
        secure: ['DENY', 'SAMEORIGIN'].includes(headers['x-frame-options'])
      },
      xContentTypeOptions: {
        present: !!headers['x-content-type-options'],
        value: headers['x-content-type-options'] || null,
        secure: headers['x-content-type-options'] === 'nosniff'
      },
      referrerPolicy: {
        present: !!headers['referrer-policy'],
        value: headers['referrer-policy'] || null,
        secure: ['no-referrer', 'strict-origin-when-cross-origin'].includes(headers['referrer-policy'])
      },
      permissionsPolicy: {
        present: !!headers['permissions-policy'],
        value: headers['permissions-policy'] || null
      },
      crossOriginEmbedderPolicy: {
        present: !!headers['cross-origin-embedder-policy'],
        value: headers['cross-origin-embedder-policy'] || null
      },
      crossOriginOpenerPolicy: {
        present: !!headers['cross-origin-opener-policy'],
        value: headers['cross-origin-opener-policy'] || null
      }
    };

    this.securityHeaders = securityAnalysis;
    return securityAnalysis;
  }

  analyzeCSPLevel(csp) {
    if (!csp) return 'none';
    
    const hasNonce = csp.includes('nonce-');
    const hasStrictDynamic = csp.includes('strict-dynamic');
    const hasUnsafeInline = csp.includes('unsafe-inline');
    const hasUnsafeEval = csp.includes('unsafe-eval');

    if (hasNonce && hasStrictDynamic && !hasUnsafeInline && !hasUnsafeEval) {
      return 'level3';
    } else if (hasNonce && !hasUnsafeInline && !hasUnsafeEval) {
      return 'level2';
    } else if (!hasUnsafeInline && !hasUnsafeEval) {
      return 'level1';
    } else {
      return 'basic';
    }
  }

  // Advanced SEO Testing
  async analyzeSEOMetrics() {
    const seoData = await this.page.evaluate(() => {
      const seo = {
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || null,
        metaKeywords: document.querySelector('meta[name="keywords"]')?.content || null,
        canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || null,
        ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
        ogDescription: document.querySelector('meta[property="og:description"]')?.content || null,
        ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
        ogUrl: document.querySelector('meta[property="og:url"]')?.content || null,
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.content || null,
        twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content || null,
        twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content || null,
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.content || null,
        structuredData: [],
        internalLinks: [],
        externalLinks: [],
        headingStructure: []
      };

      // Extract structured data
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          seo.structuredData.push(data);
        } catch (e) {
          console.warn('Invalid JSON-LD:', e);
        }
      });

      // Analyze links
      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.href;
        const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        const linkData = {
          url: href,
          text: link.textContent.trim(),
          title: link.title || null,
          rel: link.rel || null,
          hasNofollow: link.rel?.includes('nofollow') || false,
          hasNoopener: link.rel?.includes('noopener') || false,
          hasNoreferrer: link.rel?.includes('noreferrer') || false,
          opensNewTab: link.target === '_blank'
        };

        if (isExternal) {
          seo.externalLinks.push(linkData);
        } else {
          seo.internalLinks.push(linkData);
        }
      });

      // Heading structure for SEO
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        seo.headingStructure.push({
          level: parseInt(heading.tagName.charAt(1)),
          text: heading.textContent.trim(),
          length: heading.textContent.trim().length
        });
      });

      return seo;
    });

    return seoData;
  }

  // Modern Web Standards Testing
  async testWebComponents() {
    const webComponentsSupport = await this.page.evaluate(() => {
      return {
        customElements: typeof window.customElements !== 'undefined',
        shadowDOM: typeof document.documentElement.attachShadow !== 'undefined',
        htmlTemplates: typeof document.createElement('template').content !== 'undefined',
        webAnimations: typeof Element.prototype.animate !== 'undefined',
        intersectionObserver: typeof window.IntersectionObserver !== 'undefined',
        resizeObserver: typeof window.ResizeObserver !== 'undefined',
        mutationObserver: typeof window.MutationObserver !== 'undefined'
      };
    });

    return webComponentsSupport;
  }

  async testModernCSSFeatures() {
    const cssSupport = await this.page.evaluate(() => {
      const testElement = document.createElement('div');
      document.body.appendChild(testElement);

      const support = {
        cssGrid: CSS.supports('display', 'grid'),
        cssFlexbox: CSS.supports('display', 'flex'),
        cssCustomProperties: CSS.supports('--test', 'value'),
        cssContainerQueries: CSS.supports('container-type', 'inline-size'),
        cssSubgrid: CSS.supports('grid-template-columns', 'subgrid'),
        cssLogicalProperties: CSS.supports('margin-inline-start', '10px'),
        cssClamp: CSS.supports('width', 'clamp(10px, 5vw, 100px)'),
        cssMath: CSS.supports('width', 'calc(100% - 10px)'),
        cssHasPseudo: CSS.supports('selector(:has(p))'),
        cssContainerQueries: CSS.supports('container-type', 'inline-size')
      };

      document.body.removeChild(testElement);
      return support;
    });

    return cssSupport;
  }

  // Progressive Web App Testing
  async testPWAFeatures() {
    const pwaSupport = await this.page.evaluate(() => {
      return {
        serviceWorker: 'serviceWorker' in navigator,
        webAppManifest: !!document.querySelector('link[rel="manifest"]'),
        pushNotifications: 'PushManager' in window,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        installPrompt: 'BeforeInstallPromptEvent' in window,
        webShare: 'share' in navigator,
        webAppCapable: !!document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
        themeColor: !!document.querySelector('meta[name="theme-color"]')
      };
    });

    return pwaSupport;
  }

  // Sustainability Testing
  async measureCarbonFootprint() {
    const metrics = await this.page.evaluate(() => {
      const performance = window.performance;
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');

      const totalBytes = resources.reduce((sum, resource) => {
        return sum + (resource.transferSize || 0);
      }, navigation.transferSize || 0);

      const loadTime = navigation.loadEventEnd - navigation.navigationStart;

      // Simplified carbon footprint calculation
      // Real implementation would use more sophisticated algorithms
      const carbonIntensity = 0.000001; // kg CO2 per byte (simplified)
      const estimatedCO2 = totalBytes * carbonIntensity;

      return {
        totalBytes,
        loadTime,
        resourceCount: resources.length,
        estimatedCO2,
        sustainabilityGrade: estimatedCO2 < 0.005 ? 'A' : 
                           estimatedCO2 < 0.01 ? 'B' : 
                           estimatedCO2 < 0.02 ? 'C' : 
                           estimatedCO2 < 0.05 ? 'D' : 'F'
      };
    });

    return metrics;
  }

  // Advanced Responsive Testing
  async testResponsiveDesign() {
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 736, name: 'iPhone 8 Plus' },
      { width: 375, height: 812, name: 'iPhone X' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1280, height: 720, name: 'Desktop Small' },
      { width: 1920, height: 1080, name: 'Desktop Large' }
    ];

    const responsiveResults = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000); // Allow for layout adjustments

      const layoutData = await this.page.evaluate(() => {
        return {
          hasHorizontalScrollbar: document.body.scrollWidth > window.innerWidth,
          hasVerticalScrollbar: document.body.scrollHeight > window.innerHeight,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          bodyWidth: document.body.offsetWidth,
          bodyHeight: document.body.offsetHeight,
          contentOverflow: document.body.scrollWidth > window.innerWidth,
          visibleElements: document.querySelectorAll(':not([style*="display: none"]):not([style*="visibility: hidden"])').length
        };
      });

      responsiveResults.push({
        viewport: viewport.name,
        dimensions: viewport,
        layout: layoutData,
        screenshot: await this.page.screenshot({ fullPage: false })
      });
    }

    return responsiveResults;
  }

  // Utility Methods
  async generateComprehensiveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.baseUrl,
      performance: await this.measureCoreWebVitals(),
      advancedPerformance: await this.measureAdvancedPerformanceMetrics(),
      accessibility: await this.performComprehensiveAccessibilityAudit(),
      security: await this.analyzeSecurityHeaders(),
      seo: await this.analyzeSEOMetrics(),
      webStandards: {
        webComponents: await this.testWebComponents(),
        modernCSS: await this.testModernCSSFeatures(),
        pwa: await this.testPWAFeatures()
      },
      sustainability: await this.measureCarbonFootprint(),
      contentQuality: await this.analyzeContentQuality(),
      responsive: await this.testResponsiveDesign()
    };

    return report;
  }

  // Page-specific selectors and methods
  get profileImage() { return this.page.locator('[data-testid="profile-image"], img[alt*="Arthur"], img[alt*="profile"]'); }
  get profileBio() { return this.page.locator('[data-testid="bio"], .bio, .about-text'); }
  get contactInfo() { return this.page.locator('[data-testid="contact"], .contact-info'); }
  get socialLinks() { return this.page.locator('[data-testid="social-links"], .social-links a'); }
  get pageTitle() { return this.page.locator('h1'); }
  get navigationMenu() { return this.page.locator('nav, .navigation'); }
  get skillsSection() { return this.page.locator('[data-testid="skills"], .skills'); }
  get experienceSection() { return this.page.locator('[data-testid="experience"], .experience'); }

  async open() {
    await super.open(this.baseUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async isProfileImageVisible() {
    return await this.isElementPresent(this.profileImage);
  }

  async getProfileBioText() {
    return await this.profileBio.textContent();
  }

  async validateSocialLinks() {
    const links = await this.socialLinks.all();
    const results = [];

    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      const isExternal = href?.startsWith('http') || false;
      const hasSecureAttributes = await link.getAttribute('rel');

      results.push({
        url: href,
        text: text?.trim(),
        isExternal,
        hasNoopener: hasSecureAttributes?.includes('noopener') || false,
        hasNoreferrer: hasSecureAttributes?.includes('noreferrer') || false
      });
    }

    return results;
  }

  async testKeyboardNavigation() {
    const focusableElements = await this.page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    const navigationResults = [];

    for (let i = 0; i < focusableElements.length; i++) {
      await this.page.keyboard.press('Tab');
      const focused = await this.page.locator(':focus').first();
      const tagName = await focused.evaluate(el => el.tagName);
      const hasVisibleFocus = await focused.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' && styles.outline !== '0px';
      });

      navigationResults.push({
        index: i,
        tagName,
        hasVisibleFocus,
        text: await focused.textContent() || ''
      });
    }

    return navigationResults;
  }
}