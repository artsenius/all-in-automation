// About Me Page Selectors
export const aboutMeSelectors = {
  // Basic page elements
  profileImage: '[data-testid="profile-image"], .profile-photo, .avatar, img[alt*="profile"], img[alt*="photo"]',
  mainContent: 'main, [role="main"], .main-content, .content, article',
  navigation: 'nav, [role="navigation"], .navigation, .nav, .menu',
  
  // Content sections
  personalInfo: {
    name: 'h1, .name, [data-testid="name"], .profile-name, .author-name',
    title: '.title, .job-title, [data-testid="title"], .position, .role, h2',
    bio: '.bio, .description, [data-testid="bio"], .about-text, .summary, p',
    skills: '.skills, .expertise, [data-testid="skills"], .technologies, .abilities',
    experience: '.experience, .work-history, [data-testid="experience"], .career, .background'
  },
  
  // Social media and contact links
  socialLinks: {
    linkedin: 'a[href*="linkedin"], [data-social="linkedin"]',
    twitter: 'a[href*="twitter"], [data-social="twitter"]',
    github: 'a[href*="github"], [data-social="github"]',
    facebook: 'a[href*="facebook"], [data-social="facebook"]',
    instagram: 'a[href*="instagram"], [data-social="instagram"]',
    email: 'a[href^="mailto:"], [data-contact="email"]',
    website: 'a[href*="website"], a[href*="portfolio"], [data-contact="website"]'
  },
  
  // Contact form elements
  contactForm: {
    form: 'form, [data-testid="contact-form"], .contact-form',
    nameField: 'input[name="name"], #name, input[placeholder*="name"]',
    emailField: 'input[name="email"], #email, input[type="email"]',
    messageField: 'textarea[name="message"], #message, textarea[placeholder*="message"]',
    submitButton: 'button[type="submit"], .submit-btn, input[type="submit"]'
  },
  
  // Accessibility elements
  skipLinks: 'a[href="#main"], .skip-link, .sr-only a',
  landmarks: '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]',
  headings: 'h1, h2, h3, h4, h5, h6',
  
  // Interactive elements
  buttons: 'button, .btn, [role="button"]',
  links: 'a[href]',
  externalLinks: 'a[href^="http"]',
  
  // Content structure
  sections: 'section, .section, [role="region"]',
  articles: 'article, .article, [role="article"]',
  headers: 'header, .header, [role="banner"]',
  footers: 'footer, .footer, [role="contentinfo"]'
};

// Performance testing thresholds
export const performanceThresholds = {
  coreWebVitals: {
    lcp: { excellent: 1200, good: 2500, poor: 4000 }, // milliseconds
    fid: { excellent: 100, good: 200, poor: 300 },   // milliseconds
    cls: { excellent: 0.1, good: 0.15, poor: 0.25 }  // score
  },
  
  loadTimes: {
    domContentLoaded: 2000,   // 2 seconds
    loadComplete: 3000,       // 3 seconds
    firstPaint: 1000,         // 1 second
    firstContentfulPaint: 1500 // 1.5 seconds
  },
  
  resourceSizes: {
    totalPageSize: 2 * 1024 * 1024,  // 2MB
    imageSize: 500 * 1024,           // 500KB per image
    scriptSize: 200 * 1024,          // 200KB per script
    stylesheetSize: 100 * 1024       // 100KB per stylesheet
  }
};

// Accessibility testing rules and thresholds
export const accessibilityRules = {
  colorContrast: {
    normal: 4.5,     // WCAG AA normal text
    large: 3.0,      // WCAG AA large text
    AAA: 7.0         // WCAG AAA compliance
  },
  
  touchTargets: {
    minimumSize: 44,  // pixels (iOS/Android guidelines)
    spacing: 8        // pixels between targets
  },
  
  textSize: {
    minimum: 16,      // pixels
    lineHeight: 1.5,  // ratio
    maxLineLength: 75 // characters
  },
  
  focusManagement: {
    skipLinks: true,
    tabOrder: true,
    visualFocus: true
  }
};

// Device viewport configurations for responsive testing
export const deviceViewports = {
  mobile: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPhone 14 Pro', width: 393, height: 852 },
    { name: 'Samsung Galaxy S21', width: 384, height: 854 },
    { name: 'Samsung Galaxy S22', width: 360, height: 780 }
  ],
  
  tablet: [
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Air', width: 820, height: 1180 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'Surface Pro', width: 912, height: 1368 },
    { name: 'Galaxy Tab', width: 800, height: 1280 }
  ],
  
  desktop: [
    { name: 'Laptop Small', width: 1366, height: 768 },
    { name: 'Laptop Large', width: 1440, height: 900 },
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: '4K Monitor', width: 3840, height: 2160 },
    { name: 'Ultrawide', width: 2560, height: 1080 }
  ]
};

// SEO validation rules
export const seoRules = {
  title: {
    minLength: 30,
    maxLength: 60,
    required: true
  },
  
  description: {
    minLength: 120,
    maxLength: 160,
    required: true
  },
  
  headings: {
    h1Count: 1,
    hierarchyRequired: true,
    maxSkipLevel: 1
  },
  
  images: {
    altTextRequired: true,
    maxSizeKB: 500,
    optimizedFormats: ['webp', 'avif', 'jpg', 'png']
  },
  
  socialMedia: {
    ogTitle: true,
    ogDescription: true,
    ogImage: true,
    twitterCard: true
  }
};

// Content quality metrics
export const contentQuality = {
  readability: {
    maxWordsPerSentence: 20,
    maxSentencesPerParagraph: 5,
    minWordCount: 100,
    maxWordCount: 2000
  },
  
  structure: {
    minParagraphs: 3,
    maxParagraphLength: 150, // words
    headingDistribution: true
  },
  
  engagement: {
    callToActionPresent: true,
    socialLinksPresent: true,
    contactInfoPresent: true
  }
};

// Security testing configurations
export const securityRules = {
  headers: {
    csp: 'content-security-policy',
    xframe: 'x-frame-options',
    hsts: 'strict-transport-security',
    xss: 'x-xss-protection',
    referrer: 'referrer-policy',
    permissions: 'permissions-policy'
  },
  
  externalLinks: {
    requireNoopener: true,
    requireNoreferrer: true,
    httpsRequired: true
  },
  
  forms: {
    csrfProtection: true,
    inputValidation: true,
    rateLimiting: true
  }
};

// Test data for various scenarios
export const testData = {
  sampleContent: {
    validName: 'Arthur Senko',
    validEmail: 'test@example.com',
    validMessage: 'This is a test message for the contact form.',
    longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
    specialCharacters: 'Test with special chars: @#$%^&*()[]{}|\\:";\'<>?,./',
    unicodeText: 'Test with unicode: 你好 🌟 ñáéíóú'
  },
  
  invalidData: {
    invalidEmail: 'invalid-email',
    emptyString: '',
    sqlInjection: "'; DROP TABLE users; --",
    xssAttempt: '<script>alert("xss")</script>',
    oversizeText: 'x'.repeat(10000)
  }
};

// Default export for backward compatibility
export const profileImage = aboutMeSelectors.profileImage; 