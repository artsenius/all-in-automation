// ========== ABOUT ME PAGE SELECTORS ==========

export const aboutMeSelectors = {
  // Personal information elements
  profileImage: '[data-testid="profile-image"]',
  fullName: '[data-testid="full-name"], h1, .name, .profile-name',
  jobTitle: '[data-testid="job-title"], .job-title, .title, .profession',
  biography: '[data-testid="biography"], .bio, .about-text, .description',
  location: '[data-testid="location"], .location, .address',
  
  // Contact information
  emailLink: '[data-testid="email-link"], a[href^="mailto:"]',
  phoneNumber: '[data-testid="phone-number"], .phone, .tel',
  contactForm: '[data-testid="contact-form"], #contact-form, .contact-form',
  
  // Social media links
  socialLinks: '[data-testid="social-links"] a, .social-links a, .social-media a',
  linkedinLink: '[data-testid="linkedin-link"], a[href*="linkedin.com"]',
  githubLink: '[data-testid="github-link"], a[href*="github.com"]',
  twitterLink: '[data-testid="twitter-link"], a[href*="twitter.com"]',
  facebookLink: '[data-testid="facebook-link"], a[href*="facebook.com"]',
  instagramLink: '[data-testid="instagram-link"], a[href*="instagram.com"]',
  
  // Interactive elements
  downloadResumeBtn: '[data-testid="download-resume"], .download-resume, .cv-download',
  contactFormBtn: '[data-testid="contact-form-btn"], .contact-btn, .get-in-touch',
  expandBioBtn: '[data-testid="expand-bio"], .read-more, .expand',
  
  // Navigation elements
  navigationMenu: '[data-testid="nav-menu"], nav, .navigation',
  mobileMenuToggle: '[data-testid="mobile-menu"], .hamburger, .menu-toggle',
  
  // Content sections
  skillsSection: '[data-testid="skills"], .skills, .expertise',
  experienceSection: '[data-testid="experience"], .experience, .work-history',
  educationSection: '[data-testid="education"], .education, .academic',
  portfolioSection: '[data-testid="portfolio"], .portfolio, .projects',
  
  // Media elements
  heroImage: '[data-testid="hero-image"], .hero-img, .banner-image',
  galleryImages: '[data-testid="gallery"] img, .gallery img, .portfolio-images img'
};

// ========== PERFORMANCE THRESHOLDS ==========

export const performanceThresholds = {
  maxLoadTime: 3000,        // 3 seconds
  maxLCPTime: 2500,         // 2.5 seconds (Core Web Vitals)
  maxFIDTime: 100,          // 100ms (Core Web Vitals)
  maxCLSScore: 0.1,         // 0.1 (Core Web Vitals)
  maxFCPTime: 1800,         // 1.8 seconds
  maxTTITime: 3800,         // 3.8 seconds
  
  // Image optimization thresholds
  maxImageSize: 1000000,    // 1MB
  minImageCompression: 0.8, // 80% compression
  
  // Accessibility thresholds
  minColorContrast: 4.5,    // WCAG AA standard
  minTouchTargetSize: 44,   // 44px minimum touch target
};

// ========== TEST DATA ==========

export const testData = {
  personalInfo: {
    expectedName: "Arthur Senko",
    expectedTitle: "Software Engineer",
    expectedLocation: "Location TBD",
    expectedBioMinLength: 50,
    expectedBioMaxLength: 1000
  },
  
  socialMedia: {
    linkedin: "https://linkedin.com/in/arthursenko",
    github: "https://github.com/arthursenko", 
    twitter: "https://twitter.com/arthursenko",
    facebook: "https://facebook.com/arthursenko",
    instagram: "https://instagram.com/arthursenko"
  },
  
  contactInfo: {
    emailDomain: "@arthursenko.com",
    phonePattern: /^[\+]?[1-9][\d]{0,15}$/,
    locationPattern: /[A-Za-z\s,]+/
  },
  
  seo: {
    expectedTitleLength: { min: 30, max: 60 },
    expectedDescriptionLength: { min: 120, max: 160 },
    expectedKeywords: ["software engineer", "developer", "about", "portfolio"]
  }
};

// ========== VIEWPORT CONFIGURATIONS ==========

export const viewports = {
  mobile: { width: 375, height: 667 },     // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
  tablet: { width: 768, height: 1024 },     // iPad
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1366, height: 768 },    // Common desktop
  desktopLarge: { width: 1920, height: 1080 }, // Full HD
  ultrawide: { width: 3440, height: 1440 }  // Ultrawide monitor
};

// ========== BROWSER CONFIGURATIONS ==========

export const browsers = {
  chrome: { name: 'chrome', version: 'latest' },
  firefox: { name: 'firefox', version: 'latest' },
  safari: { name: 'safari', version: 'latest' },
  edge: { name: 'edge', version: 'latest' }
};

// ========== ACCESSIBILITY CONFIGURATIONS ==========

export const accessibilityRules = {
  colorContrast: {
    normal: 4.5,      // WCAG AA normal text
    large: 3.0,       // WCAG AA large text
    enhanced: 7.0     // WCAG AAA
  },
  
  headingStructure: {
    requireH1: true,
    maxH1Count: 1,
    allowSkipping: false
  },
  
  ariaRequirements: {
    interactiveElements: ['button', 'link', 'input'],
    requiredAttributes: ['aria-label', 'aria-labelledby', 'aria-describedby']
  }
};

// ========== SECURITY CONFIGURATIONS ==========

export const securityHeaders = {
  required: [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options'
  ],
  
  recommended: [
    'referrer-policy',
    'permissions-policy',
    'x-xss-protection'
  ]
};

// ========== URL CONFIGURATIONS ==========

export const urls = {
  production: 'https://www.arthursenko.com',
  staging: 'https://staging.arthursenko.com',
  development: 'http://localhost:3000',
  aboutPage: '/about',
  contactPage: '/contact'
};

// Legacy export for backward compatibility
export const profileImage = aboutMeSelectors.profileImage; 