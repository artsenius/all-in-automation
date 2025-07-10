// Advanced selectors configuration for comprehensive About Me page testing

export const advancedSelectors = {
    // Content Structure
    pageContent: {
        mainHeading: 'h1, [role="heading"][aria-level="1"]',
        subHeadings: 'h2, h3, h4, h5, h6, [role="heading"]',
        profileImage: '[data-testid="profile-image"], .profile-image, .avatar, img[alt*="profile"], img[alt*="Arthur"]',
        biography: '[data-testid="biography"], .bio, .about-content, .description',
        contactInfo: '[data-testid="contact"], .contact, .contact-info',
        socialLinks: '[data-testid="social-links"], .social-links, .social-media',
        skillsList: '[data-testid="skills"], .skills, .expertise',
        experience: '[data-testid="experience"], .experience, .work-history',
        education: '[data-testid="education"], .education, .qualifications'
    },

    // Interactive Elements
    interactiveElements: [
        'a', 'button', 'input', 'select', 'textarea',
        '[tabindex]', '[role="button"]', '[role="link"]',
        '[role="tab"]', '[role="menuitem"]', '.clickable'
    ].join(', '),

    // Navigation Elements
    navigation: {
        mainNav: 'nav, [role="navigation"]',
        breadcrumbs: '[aria-label*="breadcrumb"], .breadcrumb',
        skipLinks: '[href*="#main"], [href*="#content"]',
        backToTop: '[href="#top"], .back-to-top',
        pagination: '.pagination, [role="navigation"][aria-label*="page"]'
    },

    // Accessibility Elements
    accessibility: {
        landmarks: '[role="main"], [role="banner"], [role="contentinfo"], [role="navigation"], [role="complementary"]',
        headingStructure: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
        focusableElements: 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ariaLabels: '[aria-label], [aria-labelledby], [aria-describedby]',
        altTexts: 'img[alt], area[alt], input[type="image"][alt]',
        formLabels: 'label, [aria-label], [aria-labelledby]'
    },

    // Performance Critical Elements
    performance: {
        images: 'img, picture, svg, [style*="background-image"]',
        videos: 'video, iframe[src*="youtube"], iframe[src*="vimeo"]',
        scripts: 'script[src]',
        stylesheets: 'link[rel="stylesheet"]',
        fonts: 'link[href*="font"], @font-face',
        lazyLoadElements: '[loading="lazy"], [data-lazy], .lazy'
    },

    // SEO Elements
    seo: {
        metaTags: 'meta[name], meta[property]',
        structuredData: 'script[type="application/ld+json"]',
        microdata: '[itemscope], [itemtype], [itemprop]',
        canonicalLink: 'link[rel="canonical"]',
        alternateLinks: 'link[rel="alternate"]',
        robotsMeta: 'meta[name="robots"]'
    },

    // Security Elements
    security: {
        externalLinks: 'a[href^="http"]:not([href*="arthursenko.com"])',
        forms: 'form',
        inputs: 'input, textarea, select',
        iframes: 'iframe',
        scripts: 'script',
        embeds: 'embed, object'
    },

    // Layout Elements
    layout: {
        containers: '.container, .wrapper, .main, .content',
        grid: '.grid, .row, .column, [class*="col-"]',
        flexbox: '[style*="display: flex"], [class*="flex"]',
        responsive: '[class*="mobile"], [class*="tablet"], [class*="desktop"]'
    },

    // Content Quality Elements
    contentQuality: {
        textBlocks: 'p, div, span, article, section',
        lists: 'ul, ol, dl',
        quotes: 'blockquote, q, cite',
        emphasis: 'strong, b, em, i, mark',
        code: 'code, pre, kbd, samp'
    },

    // Animation Elements
    animations: {
        cssAnimations: '[style*="animation"], [class*="animate"]',
        transitions: '[style*="transition"], [class*="transition"]',
        transforms: '[style*="transform"], [class*="transform"]',
        parallax: '[class*="parallax"], [data-parallax]'
    }
};

// Advanced testing configuration
export const advancedConfig = {
    // Performance Thresholds
    performance: {
        coreWebVitals: {
            LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
            FID: { good: 100, needsImprovement: 300 },   // milliseconds
            CLS: { good: 0.1, needsImprovement: 0.25 }   // score
        },
        pageLoadTime: {
            excellent: 1000,
            good: 3000,
            poor: 5000
        },
        resourceSizes: {
            image: { good: 100000, warning: 500000 }, // bytes
            script: { good: 50000, warning: 200000 },
            stylesheet: { good: 20000, warning: 100000 }
        }
    },

    // Accessibility Standards
    accessibility: {
        colorContrast: {
            normal: 4.5,
            large: 3.0,
            enhanced: 7.0
        },
        targetSizes: {
            minimum: 44,    // pixels
            recommended: 48
        },
        readability: {
            excellent: 90,
            good: 70,
            needsImprovement: 50
        }
    },

    // Viewport Configurations
    viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
        ultrawide: { width: 3440, height: 1440 },
        print: { width: 794, height: 1123 } // A4 at 96 DPI
    },

    // Network Conditions
    networkConditions: {
        'slow-3g': {
            downloadThroughput: 500 * 1024,
            uploadThroughput: 500 * 1024,
            latency: 400
        },
        'fast-3g': {
            downloadThroughput: 1.6 * 1024 * 1024,
            uploadThroughput: 750 * 1024,
            latency: 150
        },
        '4g': {
            downloadThroughput: 4 * 1024 * 1024,
            uploadThroughput: 3 * 1024 * 1024,
            latency: 20
        }
    },

    // Browser Configurations
    browsers: {
        chrome: { name: 'chromium', version: 'latest' },
        firefox: { name: 'firefox', version: 'latest' },
        safari: { name: 'webkit', version: 'latest' },
        edge: { name: 'msedge', version: 'latest' }
    },

    // Security Testing
    security: {
        cspDirectives: [
            'default-src',
            'script-src',
            'style-src',
            'img-src',
            'font-src',
            'connect-src',
            'frame-src'
        ],
        securityHeaders: [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
            'Referrer-Policy',
            'Permissions-Policy'
        ],
        vulnerabilityChecks: [
            'xss',
            'clickjacking',
            'information_disclosure',
            'social_engineering'
        ]
    },

    // SEO Configuration
    seo: {
        requiredMetaTags: [
            'title',
            'description',
            'viewport',
            'charset'
        ],
        openGraphTags: [
            'og:title',
            'og:description',
            'og:image',
            'og:url',
            'og:type'
        ],
        twitterTags: [
            'twitter:card',
            'twitter:title',
            'twitter:description',
            'twitter:image'
        ],
        structuredDataTypes: [
            'Person',
            'Organization',
            'WebPage',
            'AboutPage'
        ]
    },

    // Content Quality Standards
    contentQuality: {
        readingLevel: {
            elementary: { min: 90, max: 100 },
            middleSchool: { min: 60, max: 70 },
            highSchool: { min: 30, max: 50 },
            college: { min: 0, max: 30 }
        },
        wordCount: {
            minimum: 150,
            optimal: 300,
            maximum: 1500
        },
        sentenceLength: {
            optimal: 20,
            maximum: 25
        }
    },

    // Animation Standards
    animations: {
        duration: {
            micro: { min: 100, max: 300 },
            macro: { min: 300, max: 500 }
        },
        easing: {
            standard: 'ease',
            entrance: 'ease-out',
            exit: 'ease-in',
            emphasis: 'ease-in-out'
        },
        respectsReducedMotion: true
    },

    // Test Data
    testData: {
        sampleText: 'This is a sample text for testing purposes.',
        longText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50),
        specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        unicodeText: '🌟 Hello World 🌍 こんにちは 🇯🇵',
        rtlText: 'مرحبا بالعالم',
        emails: ['test@example.com', 'user+tag@domain.co.uk'],
        urls: ['https://example.com', 'http://test.org/path?query=value'],
        phoneNumbers: ['+1-555-123-4567', '(555) 123-4567']
    }
};

// Test Environment Configuration
export const testEnvironment = {
    baseUrl: 'https://www.arthursenko.com',
    timeouts: {
        short: 5000,
        medium: 15000,
        long: 30000,
        performance: 60000
    },
    retries: {
        flaky: 3,
        stable: 1
    },
    screenshots: {
        onFailure: true,
        onSuccess: false,
        fullPage: true
    },
    video: {
        record: 'retain-on-failure',
        quality: 'high'
    }
};