// Existing profile image selector
export const profileImage = '[data-testid="profile-image"]';

// About Me Page Selectors
export const aboutMeSelectors = {
  // Profile Image Selectors
  profileImage: {
    image: '[data-testid="profile-image"]',
    container: '[data-testid="profile-image-container"]',
    fallback: '[data-testid="profile-image-fallback"]',
    caption: '[data-testid="profile-image-caption"]'
  },

  // Content Selectors
  content: {
    pageTitle: 'h1',
    personalBio: '[data-testid="personal-bio"]',
    professionalSummary: '[data-testid="professional-summary"]',
    contactEmail: '[data-testid="contact-email"]',
    skillsList: '[data-testid="skills-list"]',
    experience: '[data-testid="experience"]',
    education: '[data-testid="education"]',
    achievements: '[data-testid="achievements"]'
  },

  // Social Media Links
  socialMedia: {
    linkedin: '[data-testid="linkedin-link"]',
    github: '[data-testid="github-link"]',
    twitter: '[data-testid="twitter-link"]',
    instagram: '[data-testid="instagram-link"]',
    email: '[data-testid="email-link"]',
    resume: '[data-testid="resume-download"]',
    portfolio: '[data-testid="portfolio-link"]'
  },

  // Navigation Elements
  navigation: {
    menu: '[data-testid="nav-menu"]',
    menuItems: '[data-testid="nav-menu"] a',
    mobileToggle: '[data-testid="mobile-menu-toggle"]',
    breadcrumbs: '[data-testid="breadcrumbs"]',
    backToTop: '[data-testid="back-to-top"]'
  },

  // Contact Form (if present)
  contactForm: {
    form: '[data-testid="contact-form"]',
    nameInput: '[data-testid="contact-name"]',
    emailInput: '[data-testid="contact-email-input"]',
    messageInput: '[data-testid="contact-message"]',
    submitButton: '[data-testid="contact-submit"]',
    successMessage: '[data-testid="contact-success"]',
    errorMessage: '[data-testid="contact-error"]',
    loadingState: '[data-testid="contact-loading"]'
  },

  // Layout Elements
  layout: {
    header: 'header',
    main: 'main',
    sidebar: '[data-testid="sidebar"]',
    footer: 'footer',
    container: '[data-testid="page-container"]',
    contentWrapper: '[data-testid="content-wrapper"]'
  },

  // Skills and Technologies
  skills: {
    technicalSkills: '[data-testid="technical-skills"]',
    softSkills: '[data-testid="soft-skills"]',
    tools: '[data-testid="tools"]',
    languages: '[data-testid="languages"]',
    frameworks: '[data-testid="frameworks"]',
    certifications: '[data-testid="certifications"]'
  },

  // Interactive Elements
  interactive: {
    downloadCV: '[data-testid="download-cv"]',
    viewProjects: '[data-testid="view-projects"]',
    scrollIndicator: '[data-testid="scroll-indicator"]',
    themeToggle: '[data-testid="theme-toggle"]',
    languageSelector: '[data-testid="language-selector"]'
  },

  // Media Elements
  media: {
    gallery: '[data-testid="photo-gallery"]',
    videos: '[data-testid="video-content"]',
    testimonials: '[data-testid="testimonials"]',
    timeline: '[data-testid="career-timeline"]'
  },

  // Accessibility Elements
  accessibility: {
    skipNavigation: '[data-testid="skip-navigation"]',
    screenReaderText: '.sr-only',
    focusIndicator: ':focus',
    ariaLive: '[aria-live]',
    landmarks: '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]'
  },

  // Error and Loading States
  states: {
    loading: '[data-testid="loading"]',
    error: '[data-testid="error-message"]',
    noContent: '[data-testid="no-content"]',
    offline: '[data-testid="offline-indicator"]'
  }
};

// Viewport Configurations for Responsive Testing
export const viewportSizes = [
  { width: 320, height: 568, name: 'iPhone SE' },
  { width: 375, height: 667, name: 'iPhone 8' },
  { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
  { width: 768, height: 1024, name: 'iPad Portrait' },
  { width: 1024, height: 768, name: 'iPad Landscape' },
  { width: 1280, height: 720, name: 'Desktop HD' },
  { width: 1920, height: 1080, name: 'Desktop FHD' },
  { width: 2560, height: 1440, name: 'Desktop 2K' }
];

// Performance Thresholds
export const performanceThresholds = {
  'First Contentful Paint': 1500,
  'Largest Contentful Paint': 2500,
  'Cumulative Layout Shift': 0.1,
  'First Input Delay': 100,
  'Time to Interactive': 3000
};

// Browser Matrix for Cross-browser Testing
export const browserMatrix = [
  { browser: 'Chrome', versions: ['latest', 'latest-1', 'latest-2'] },
  { browser: 'Firefox', versions: ['latest', 'latest-1', 'latest-2'] },
  { browser: 'Safari', versions: ['latest', 'latest-1'] },
  { browser: 'Edge', versions: ['latest', 'latest-1'] },
  { browser: 'Chrome Mobile', versions: ['latest'] },
  { browser: 'Safari Mobile', versions: ['latest'] }
];

// Test Data Configurations
export const testData = {
  validEmails: [
    'test@example.com',
    'user+tag@domain.co.uk',
    'firstname.lastname@company.org'
  ],
  invalidEmails: [
    'invalid-email',
    '@domain.com',
    'user@',
    'user..double.dot@example.com',
    'user@.com'
  ],
  testMessages: {
    short: 'Hi',
    normal: 'This is a test message with normal length for testing purposes.',
    long: 'A'.repeat(1000),
    specialChars: 'Test message with special characters: äöü ñ 中文 🎉',
    xss: '<script>alert("xss")</script>',
    sql: "'; DROP TABLE users; --"
  },
  bioLengths: {
    tooShort: 'Short bio.',
    optimal: 'This is an optimal length bio that provides enough information about the person while staying within the recommended character limit for better readability and user engagement.',
    tooLong: 'A'.repeat(501)
  }
}; 