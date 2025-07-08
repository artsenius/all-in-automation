import { BasePage } from './base.page.js';
import { aboutMeSelectors } from './selectors.js';

export class AboutMePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
    this.selectors = aboutMeSelectors;
  }

  async open() {
    await super.open('https://www.arthursenko.com');
  }

  // Core Content Validation Methods
  async getPageTitle() {
    return await this.page.locator('h1').textContent();
  }

  async getPersonalBio() {
    return await this.page.locator('[data-testid="personal-bio"]').textContent();
  }

  async getContactEmail() {
    return await this.page.locator('[data-testid="contact-email"]').textContent();
  }

  async getProfessionalSummary() {
    return await this.page.locator('[data-testid="professional-summary"]').textContent();
  }

  async getSkillsList() {
    return await this.page.locator('[data-testid="skills-list"] li').all();
  }

  async getExperienceSection() {
    return await this.page.locator('[data-testid="experience"]').textContent();
  }

  // Profile Image Validation Methods
  async isProfileImagePresent() {
    return await super.isElementPresent(this.selectors.profileImage.image);
  }

  async getProfileImageAltText() {
    return await this.page.locator(this.selectors.profileImage.image).getAttribute('alt');
  }

  async isProfileImageLoaded() {
    const image = this.page.locator(this.selectors.profileImage.image);
    const naturalWidth = await image.evaluate(img => img.naturalWidth);
    return naturalWidth > 0;
  }

  async validateImageDimensions() {
    const image = this.page.locator(this.selectors.profileImage.image);
    const boundingBox = await image.boundingBox();
    return {
      width: boundingBox.width,
      height: boundingBox.height,
      aspectRatio: boundingBox.width / boundingBox.height
    };
  }

  // Social Media Links Validation
  async validateSocialLinks() {
    const results = {};
    
    for (const [platform, selector] of Object.entries(this.selectors.socialMedia)) {
      const link = this.page.locator(selector);
      const isVisible = await link.isVisible();
      const href = isVisible ? await link.getAttribute('href') : null;
      const opensInNewTab = isVisible ? await link.getAttribute('target') === '_blank' : false;
      
      results[platform] = {
        isVisible,
        href,
        opensInNewTab,
        isValidUrl: href ? this.isValidUrl(href) : false
      };
    }
    
    return results;
  }

  // Navigation and Interactive Elements
  async validateNavigationMenu() {
    const menuItems = await this.page.locator('[data-testid="nav-menu"] a').all();
    const results = [];
    
    for (const item of menuItems) {
      const text = await item.textContent();
      const href = await item.getAttribute('href');
      const isActive = await item.getAttribute('class').then(classes => 
        classes.includes('active') || classes.includes('current')
      );
      
      results.push({ text, href, isActive });
    }
    
    return results;
  }

  // Responsive Design Validation
  async validateResponsiveDesign(viewportSizes) {
    const results = {};
    
    for (const viewport of viewportSizes) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      results[viewport.name] = {
        viewport: viewport,
        profileImageVisible: await this.isProfileImagePresent(),
        navigationCollapsed: await this.page.locator('[data-testid="mobile-menu-toggle"]').isVisible(),
        contentLayout: await this.getContentLayoutInfo(),
        scrollable: await this.isPageScrollable()
      };
    }
    
    return results;
  }

  async getContentLayoutInfo() {
    const main = this.page.locator('main');
    const sidebar = this.page.locator('[data-testid="sidebar"]');
    
    return {
      mainWidth: await main.boundingBox().then(box => box?.width || 0),
      sidebarVisible: await sidebar.isVisible(),
      sidebarWidth: await sidebar.boundingBox().then(box => box?.width || 0)
    };
  }

  async isPageScrollable() {
    return await this.page.evaluate(() => {
      return document.body.scrollHeight > window.innerHeight;
    });
  }

  // Performance Validation
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.page.waitForLoadState('networkidle');
    const endTime = Date.now();
    return endTime - startTime;
  }

  async getWebVitals() {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) vitals.fcp = fcpEntry.startTime;
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(vitals), 2000);
      });
    });
  }

  // SEO and Meta Tags Validation
  async validateMetaTags() {
    const metaTags = {
      title: await this.page.locator('title').textContent(),
      description: await this.page.locator('meta[name="description"]').getAttribute('content'),
      keywords: await this.page.locator('meta[name="keywords"]').getAttribute('content'),
      ogTitle: await this.page.locator('meta[property="og:title"]').getAttribute('content'),
      ogDescription: await this.page.locator('meta[property="og:description"]').getAttribute('content'),
      ogImage: await this.page.locator('meta[property="og:image"]').getAttribute('content'),
      ogUrl: await this.page.locator('meta[property="og:url"]').getAttribute('content'),
      twitterCard: await this.page.locator('meta[name="twitter:card"]').getAttribute('content')
    };
    
    return metaTags;
  }

  // Accessibility Validation
  async validateKeyboardNavigation() {
    const focusableElements = await this.page.locator('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])').all();
    const results = [];
    
    for (let i = 0; i < focusableElements.length; i++) {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.locator(':focus').first();
      const tagName = await focusedElement.evaluate(el => el.tagName);
      const hasVisibleFocus = await focusedElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });
      
      results.push({
        elementIndex: i,
        tagName,
        hasVisibleFocus,
        isVisible: await focusedElement.isVisible()
      });
    }
    
    return results;
  }

  async validateHeadingHierarchy() {
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    const hierarchy = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const text = await heading.textContent();
      const level = parseInt(tagName.charAt(1));
      
      hierarchy.push({ tagName, text, level });
    }
    
    return hierarchy;
  }

  // Security Validation
  async validateSecurityHeaders() {
    const response = await this.page.goto(this.page.url());
    const headers = response.headers();
    
    return {
      contentSecurityPolicy: headers['content-security-policy'] || null,
      xFrameOptions: headers['x-frame-options'] || null,
      xContentTypeOptions: headers['x-content-type-options'] || null,
      strictTransportSecurity: headers['strict-transport-security'] || null,
      referrerPolicy: headers['referrer-policy'] || null
    };
  }

  // Content Quality Validation
  async validateBioLength() {
    const bio = await this.getPersonalBio();
    return {
      length: bio ? bio.length : 0,
      isValid: bio && bio.length >= 100 && bio.length <= 500
    };
  }

  async validateEmailFormat() {
    const email = await this.getContactEmail();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      email,
      isValid: email ? emailRegex.test(email) : false
    };
  }

  // Visual Regression Testing
  async takeVisualSnapshot(testName) {
    const browserName = await this.page.context().browser().browserType().name();
    await this.page.screenshot({
      path: `screenshots/${testName}-${browserName}.png`,
      fullPage: true
    });
  }

  // Error Handling and Edge Cases
  async validateErrorStates() {
    const results = {};
    
    // Test broken image handling
    await this.page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    await this.page.reload();
    results.brokenImageHandling = await this.page.locator('[data-testid="profile-image-fallback"]').isVisible();
    
    // Test network failure
    await this.page.route('**/*', route => route.abort());
    try {
      await this.page.reload();
      results.networkFailureHandling = false;
    } catch (error) {
      results.networkFailureHandling = true;
    }
    
    return results;
  }

  // Utility Methods
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async waitForPageStability() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every(img => img.complete);
    });
  }
}