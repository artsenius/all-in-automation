// Basic selectors for About Me page elements
export const aboutMeSelectors = {
  // Profile and personal information
  profileImage: '[data-testid="profile-image"], img[alt*="Arthur"], img[alt*="profile"], .profile-image, .avatar',
  profileBio: '[data-testid="bio"], .bio, .about-text, .description, .profile-description',
  pageTitle: 'h1, .page-title, .main-title',
  contactInfo: '[data-testid="contact"], .contact-info, .contact-details',
  
  // Navigation and structure
  navigationMenu: 'nav, .navigation, .nav-menu, .main-nav',
  mainContent: 'main, .main-content, .content, [role="main"]',
  header: 'header, .header, .page-header',
  footer: 'footer, .footer, .page-footer',
  
  // Social media and links
  socialLinks: '[data-testid="social-links"], .social-links a, .social-media a, .social a',
  externalLinks: 'a[href^="http"]:not([href*="arthursenko.com"])',
  internalLinks: 'a[href^="/"], a[href^="./"], a[href^="#"]',
  
  // Content sections
  skillsSection: '[data-testid="skills"], .skills, .expertise, .capabilities',
  experienceSection: '[data-testid="experience"], .experience, .work-experience, .career',
  educationSection: '[data-testid="education"], .education, .academic-background',
  portfolioSection: '[data-testid="portfolio"], .portfolio, .projects, .work-samples',
  testimonialsSection: '[data-testid="testimonials"], .testimonials, .reviews, .recommendations',
  
  // Interactive elements
  buttons: 'button, .btn, input[type="button"], input[type="submit"]',
  forms: 'form, .form, .contact-form',
  inputs: 'input, textarea, select',
  downloadLinks: 'a[href*=".pdf"], a[href*=".doc"], a[href*=".docx"], a[download]',
  
  // Media elements
  images: 'img',
  videos: 'video',
  audio: 'audio',
  
  // Accessibility elements
  skipLinks: 'a[href="#main"], a[href="#content"], .skip-link',
  headings: 'h1, h2, h3, h4, h5, h6',
  landmarks: 'main, nav, section, article, aside, header, footer, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]',
  
  // Performance critical elements
  aboveFoldContent: '.hero, .banner, .intro, .above-fold',
  lazyLoadedImages: 'img[loading="lazy"], img[data-src]',
  
  // SEO elements
  metaDescription: 'meta[name="description"]',
  metaKeywords: 'meta[name="keywords"]',
  canonicalLink: 'link[rel="canonical"]',
  ogTags: 'meta[property^="og:"]',
  twitterTags: 'meta[name^="twitter:"]',
  structuredData: 'script[type="application/ld+json"]'
};

// Performance thresholds and benchmarks
export const performanceThresholds = {
  // Core Web Vitals
  largestContentfulPaint: {
    good: 2500,
    needsImprovement: 4000,
    poor: 4000
  },
  firstInputDelay: {
    good: 100,
    needsImprovement: 300,
    poor: 300
  },
  cumulativeLayoutShift: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: 0.25
  },
  interactionToNextPaint: {
    good: 200,
    needsImprovement: 500,
    poor: 500
  },
  timeToFirstByte: {
    good: 800,
    needsImprovement: 1800,
    poor: 1800
  },
  
  // Additional performance metrics
  speedIndex: {
    good: 3400,
    needsImprovement: 5800,
    poor: 5800
  },
  totalBlockingTime: {
    good: 200,
    needsImprovement: 600,
    poor: 600
  },
  timeToInteractive: {
    good: 3800,
    needsImprovement: 7300,
    poor: 7300
  },
  
  // Resource loading thresholds
  pageWeight: {
    good: 1000000, // 1MB
    needsImprovement: 2000000, // 2MB
    poor: 2000000 // 2MB
  },
  imageOptimization: {
    maxImageSize: 500000, // 500KB
    supportedFormats: ['webp', 'avif', 'jpeg', 'png', 'svg']
  },
  
  // Network conditions
  networkConditions: {
    'Regular3G': { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 768 * 1024 / 8, latency: 300 },
    'Slow3G': { downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
    'Fast3G': { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 768 * 1024 / 8, latency: 150 },
    'Regular4G': { downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8, latency: 20 }
  }
};

// Accessibility testing rules and thresholds
export const accessibilityRules = {
  // Color contrast ratios
  colorContrast: {
    normal: 4.5,
    large: 3.0,
    aaa: 7.0
  },
  
  // Touch targets
  touchTargets: {
    minSize: 44, // pixels
    recommendedSize: 48 // pixels
  },
  
  // Text sizing
  textSizing: {
    minFontSize: 16, // pixels
    lineHeight: 1.5,
    maxLineLength: 80 // characters
  },
  
  // Focus management
  focusManagement: {
    visibleFocusRequired: true,
    focusOrderLogical: true,
    skipLinksPresent: true
  },
  
  // ARIA requirements
  ariaRequirements: {
    landmarksPresent: true,
    headingStructure: true,
    altTextPresent: true,
    formLabels: true
  },
  
  // Screen reader support
  screenReader: {
    semanticMarkup: true,
    descriptiveText: true,
    contextualInformation: true
  }
};

// Device viewports for responsive testing
export const deviceViewports = {
  mobile: {
    small: { width: 320, height: 568, name: 'iPhone SE' },
    medium: { width: 375, height: 667, name: 'iPhone 8' },
    large: { width: 414, height: 736, name: 'iPhone 8 Plus' },
    modern: { width: 375, height: 812, name: 'iPhone X' }
  },
  tablet: {
    portrait: { width: 768, height: 1024, name: 'iPad Portrait' },
    landscape: { width: 1024, height: 768, name: 'iPad Landscape' },
    pro: { width: 1024, height: 1366, name: 'iPad Pro' }
  },
  desktop: {
    small: { width: 1280, height: 720, name: 'Desktop Small' },
    medium: { width: 1440, height: 900, name: 'Desktop Medium' },
    large: { width: 1920, height: 1080, name: 'Desktop Large' },
    wide: { width: 2560, height: 1440, name: 'Desktop Wide' }
  },
  foldable: {
    galaxyFold: { width: 280, height: 653, name: 'Galaxy Fold' },
    surfaceDuo: { width: 540, height: 720, name: 'Surface Duo' }
  }
};

// SEO rules and requirements
export const seoRules = {
  // Meta tags
  metaTags: {
    titleLength: { min: 30, max: 60 },
    descriptionLength: { min: 120, max: 160 },
    keywordsCount: { min: 3, max: 10 }
  },
  
  // Open Graph
  openGraph: {
    required: ['og:title', 'og:description', 'og:image', 'og:url'],
    imageSize: { width: 1200, height: 630 }
  },
  
  // Twitter Cards
  twitterCards: {
    required: ['twitter:card', 'twitter:title', 'twitter:description'],
    cardTypes: ['summary', 'summary_large_image', 'app', 'player']
  },
  
  // Structured data
  structuredData: {
    required: ['@context', '@type'],
    types: ['Person', 'Organization', 'WebSite', 'WebPage']
  },
  
  // Link attributes
  linkAttributes: {
    externalLinks: ['noopener', 'noreferrer'],
    downloadLinks: ['download'],
    sponsoredLinks: ['sponsored']
  },
  
  // Heading structure
  headingStructure: {
    h1Count: 1,
    hierarchical: true,
    descriptive: true
  }
};

// Content quality metrics
export const contentQuality = {
  // Readability
  readability: {
    fleschKincaidGrade: { max: 12 },
    averageWordsPerSentence: { max: 20 },
    averageSentencesPerParagraph: { max: 4 }
  },
  
  // Content length
  contentLength: {
    wordCount: { min: 300, max: 2000 },
    paragraphCount: { min: 3, max: 15 },
    sentenceCount: { min: 10, max: 100 }
  },
  
  // Content diversity
  contentDiversity: {
    lexicalDiversity: { min: 0.4 },
    uniqueWords: { min: 100 },
    repetitiveContent: { max: 0.1 }
  },
  
  // Content freshness
  contentFreshness: {
    lastModified: true,
    datePublished: true,
    updateFrequency: 'monthly'
  }
};

// Security rules and headers
export const securityRules = {
  // Required security headers
  requiredHeaders: [
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy'
  ],
  
  // Content Security Policy
  contentSecurityPolicy: {
    present: true,
    level: 'level2', // minimum required level
    nonce: true,
    strictDynamic: false // optional for level 3
  },
  
  // HTTPS requirements
  httpsRequirements: {
    enforced: true,
    httpsRedirect: true,
    mixedContent: false
  },
  
  // Cookie security
  cookieSecurity: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  },
  
  // Vulnerability checks
  vulnerabilityChecks: {
    outdatedDependencies: true,
    knownVulnerabilities: true,
    securityScanning: true
  }
};

// Test data for various scenarios
export const testData = {
  // User agents for testing
  userAgents: {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
    mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  
  // Network conditions
  networkConditions: performanceThresholds.networkConditions,
  
  // Localization
  localization: {
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'],
    rtlLanguages: ['ar', 'he', 'fa', 'ur'],
    regions: ['US', 'EU', 'APAC', 'SA']
  },
  
  // Test scenarios
  scenarios: {
    firstVisit: { cookies: false, cache: false },
    returningUser: { cookies: true, cache: true },
    slowConnection: { networkCondition: 'Slow3G' },
    lowEndDevice: { cpu: 'slow', memory: 'low' },
    highEndDevice: { cpu: 'fast', memory: 'high' }
  }
};

// Sustainability metrics
export const sustainabilityMetrics = {
  // Carbon footprint thresholds
  carbonFootprint: {
    excellent: 0.005, // kg CO2
    good: 0.01,
    average: 0.02,
    poor: 0.05
  },
  
  // Energy efficiency
  energyEfficiency: {
    pageWeight: { max: 1000000 }, // 1MB
    resourceRequests: { max: 50 },
    thirdPartyRequests: { max: 10 }
  },
  
  // Green hosting indicators
  greenHosting: {
    renewableEnergy: true,
    carbonOffset: true,
    greenCertification: true
  }
};

// AI and ML testing parameters
export const aiTestingParams = {
  // Visual regression thresholds
  visualRegression: {
    threshold: 0.1, // 10% difference threshold
    ignoreRegions: ['.timestamp', '.dynamic-content'],
    comparisonMethod: 'ssim' // structural similarity
  },
  
  // Content analysis
  contentAnalysis: {
    sentimentAnalysis: true,
    topicModeling: true,
    readabilityScoring: true,
    languageDetection: true
  },
  
  // User experience prediction
  uxPrediction: {
    bounceRatePrediction: true,
    engagementScoring: true,
    conversionOptimization: true
  }
};

// Error handling and retry configurations
export const errorHandling = {
  // Retry configurations
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    exponentialBackoff: true
  },
  
  // Timeout configurations
  timeouts: {
    pageLoad: 30000, // 30 seconds
    elementWait: 10000, // 10 seconds
    networkRequest: 30000, // 30 seconds
    testExecution: 300000 // 5 minutes
  },
  
  // Error recovery
  errorRecovery: {
    screenshotOnFailure: true,
    videoRecording: true,
    consoleLogCapture: true,
    networkLogCapture: true
  }
};

// Export all configurations as default
export default {
  aboutMeSelectors,
  performanceThresholds,
  accessibilityRules,
  deviceViewports,
  seoRules,
  contentQuality,
  securityRules,
  testData,
  sustainabilityMetrics,
  aiTestingParams,
  errorHandling
}; 