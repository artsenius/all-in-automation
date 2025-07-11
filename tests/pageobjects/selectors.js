// Enhanced selectors for About Me page comprehensive testing

// Main Page Structure
export const pageStructure = {
  // Core page elements
  pageTitle: 'h1, [data-testid="page-title"]',
  mainContent: 'main, [role="main"], .main-content',
  navigation: 'nav, [role="navigation"], .navigation',
  header: 'header, [role="banner"], .header',
  footer: 'footer, [role="contentinfo"], .footer',
  
  // Navigation elements
  navMenu: 'nav ul, .nav-menu, [data-testid="nav-menu"]',
  navItems: 'nav li, .nav-item, [data-testid="nav-item"]',
  homeLink: 'a[href="/"], a[href="#home"], [data-testid="home-link"]',
  aboutLink: 'a[href="/about"], a[href="#about"], [data-testid="about-link"]',
  
  // Skip links for accessibility
  skipLink: 'a[href="#main"], .skip-link, [data-testid="skip-link"]'
};

// Personal Information Elements
export const personalInfo = {
  // Profile image with multiple fallbacks
  profileImage: '[data-testid="profile-image"], .profile-image, .profile-photo, img[alt*="profile"], img[alt*="photo"]',
  profileImageAlt: '[data-testid="profile-image"] img, .profile-image img, .profile-photo img',
  
  // Name and title
  fullName: '[data-testid="full-name"], .name, .full-name, h1',
  jobTitle: '[data-testid="job-title"], .job-title, .title, .position',
  tagline: '[data-testid="tagline"], .tagline, .subtitle, .description',
  
  // Contact information
  emailAddress: '[data-testid="email"], .email, a[href^="mailto:"]',
  phoneNumber: '[data-testid="phone"], .phone, a[href^="tel:"]',
  location: '[data-testid="location"], .location, .address',
  
  // Professional information
  bio: '[data-testid="bio"], .bio, .about-text, .description',
  skills: '[data-testid="skills"], .skills, .expertise',
  experience: '[data-testid="experience"], .experience, .work-history',
  education: '[data-testid="education"], .education, .academic-background'
};

// Social Media & External Links
export const socialLinks = {
  // Social media containers
  socialContainer: '[data-testid="social-links"], .social-links, .social-media',
  
  // Individual social platforms
  linkedIn: 'a[href*="linkedin.com"], [data-testid="linkedin-link"]',
  twitter: 'a[href*="twitter.com"], a[href*="x.com"], [data-testid="twitter-link"]',
  github: 'a[href*="github.com"], [data-testid="github-link"]',
  instagram: 'a[href*="instagram.com"], [data-testid="instagram-link"]',
  facebook: 'a[href*="facebook.com"], [data-testid="facebook-link"]',
  
  // Professional links
  portfolio: 'a[href*="portfolio"], [data-testid="portfolio-link"]',
  resume: 'a[href*="resume"], a[href*="cv"], [data-testid="resume-link"]',
  website: 'a[href*="website"], [data-testid="website-link"]'
};

// Interactive Elements
export const interactiveElements = {
  // Buttons
  primaryButton: '.btn-primary, [data-testid="primary-button"]',
  secondaryButton: '.btn-secondary, [data-testid="secondary-button"]',
  ctaButton: '.cta-button, [data-testid="cta-button"]',
  
  // Forms
  contactForm: '[data-testid="contact-form"], .contact-form, form',
  formFields: 'input, textarea, select',
  submitButton: 'button[type="submit"], input[type="submit"], [data-testid="submit-button"]',
  
  // Interactive content
  accordion: '.accordion, [data-testid="accordion"]',
  tabs: '.tabs, [data-testid="tabs"]',
  modal: '.modal, [data-testid="modal"]',
  dropdown: '.dropdown, [data-testid="dropdown"]'
};

// Content Sections
export const contentSections = {
  // About sections
  aboutSection: '[data-testid="about-section"], .about-section, #about',
  skillsSection: '[data-testid="skills-section"], .skills-section, #skills',
  experienceSection: '[data-testid="experience-section"], .experience-section, #experience',
  portfolioSection: '[data-testid="portfolio-section"], .portfolio-section, #portfolio',
  
  // Content elements
  headings: 'h1, h2, h3, h4, h5, h6',
  paragraphs: 'p',
  lists: 'ul, ol',
  images: 'img',
  links: 'a'
};

// Accessibility Elements
export const accessibilityElements = {
  // ARIA elements
  landmarks: '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]',
  ariaLabels: '[aria-label]',
  ariaDescriptions: '[aria-describedby]',
  
  // Focus elements
  focusableElements: 'a, button, input, textarea, select, [tabindex]',
  skipLinks: '.skip-link, [href="#main"]',
  
  // Heading structure
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6'
};

// Performance & SEO Elements
export const metaElements = {
  // SEO meta tags
  metaTitle: 'title',
  metaDescription: 'meta[name="description"]',
  metaKeywords: 'meta[name="keywords"]',
  
  // Open Graph tags
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',
  ogUrl: 'meta[property="og:url"]',
  
  // Twitter Cards
  twitterCard: 'meta[name="twitter:card"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
  twitterImage: 'meta[name="twitter:image"]',
  
  // Technical SEO
  canonicalLink: 'link[rel="canonical"]',
  viewport: 'meta[name="viewport"]',
  charset: 'meta[charset]'
};

// Test Configuration
export const testConfig = {
  // Viewport sizes for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
    ultrawide: { width: 1920, height: 1080 }
  },
  
  // Performance thresholds
  performance: {
    loadTime: 3000, // 3 seconds
    lcp: 2500, // Largest Contentful Paint
    fid: 100, // First Input Delay
    cls: 0.1, // Cumulative Layout Shift
    fcp: 1800 // First Contentful Paint
  },
  
  // Accessibility thresholds
  accessibility: {
    colorContrast: 4.5, // WCAG AA standard
    touchTargetSize: 44, // Minimum touch target size in pixels
    maxViolations: 0 // Maximum allowed accessibility violations
  },
  
  // Test data
  testData: {
    expectedTitle: 'About Me',
    expectedName: 'Arthur', // Adjust based on actual content
    expectedSocialPlatforms: ['linkedin', 'github', 'twitter'],
    minimumBioLength: 50, // Minimum bio text length
    expectedSections: ['about', 'skills', 'experience']
  },
  
  // Timeouts
  timeouts: {
    pageLoad: 30000,
    elementVisible: 5000,
    networkIdle: 10000
  }
};

// Security Test Elements
export const securityElements = {
  // Security headers to check
  securityHeaders: [
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'strict-transport-security',
    'referrer-policy'
  ],
  
  // External resource patterns
  externalImages: 'img[src^="http"]',
  externalLinks: 'a[href^="http"]:not([href*="' + window.location.hostname + '"])',
  externalScripts: 'script[src^="http"]',
  
  // Form security
  secureForm: 'form[action^="https://"]',
  csrfToken: 'input[name*="csrf"], input[name*="token"]'
};

// Visual Regression Test Elements
export const visualElements = {
  // Key visual areas for regression testing
  hero: '[data-testid="hero"], .hero, .hero-section',
  profileSection: '[data-testid="profile-section"], .profile-section',
  contentArea: '[data-testid="content-area"], .content-area, main',
  sidebar: '[data-testid="sidebar"], .sidebar, aside',
  
  // Visual components
  cards: '.card, [data-testid="card"]',
  buttons: 'button, .btn, [data-testid="button"]',
  icons: '.icon, [data-testid="icon"], svg',
  
  // Layout elements
  grid: '.grid, [data-testid="grid"]',
  flexbox: '.flex, [data-testid="flex"]',
  container: '.container, [data-testid="container"]'
};

// Network Testing Elements
export const networkElements = {
  // Critical resources
  criticalCSS: 'link[rel="stylesheet"][href*="critical"]',
  criticalJS: 'script[src*="critical"]',
  
  // Lazy loaded elements
  lazyImages: 'img[loading="lazy"], img[data-src]',
  lazyContent: '[data-lazy], [loading="lazy"]',
  
  // External dependencies
  cdnResources: 'link[href*="cdn"], script[src*="cdn"]',
  thirdPartyScripts: 'script[src*="google"], script[src*="facebook"], script[src*="twitter"]'
};

// Export all selectors for easy access
export const allSelectors = {
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
};

// Legacy selector for backward compatibility
export const profileImage = '[data-testid="profile-image"]'; 