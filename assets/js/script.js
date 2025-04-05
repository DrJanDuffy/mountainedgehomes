// Performance tracking
const perfMetrics = {
    pageLoadStart: Date.now(),
    domContentLoaded: 0,
    heroImageLoaded: 0,
    fullLoad: 0
};

// Create a performance optimization function to batch DOM operations
function optimizeDOMOperations(callback) {
    return new Promise(resolve => {
        // Use requestAnimationFrame to sync with browser rendering
        window.requestAnimationFrame(() => {
            // Create a document fragment to batch DOM changes
            const fragment = document.createDocumentFragment();
            callback(fragment);
            resolve(fragment);
        });
    });
}

// Preconnect to important domains - called immediately on script parse
(function setupPreconnect() {
    const domains = [
        'https://fonts.googleapis.com', 
        'https://fonts.gstatic.com', 
        'https://cdnjs.cloudflare.com'
    ];
    
    optimizeDOMOperations(fragment => {
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            fragment.appendChild(link);
        });
        document.head.appendChild(fragment);
    });
})();

// Preload hero image as early as possible
(function preloadHeroImage() {
    const heroImage = new Image();
    heroImage.src = 'assets/images/hero-mountains-edge-1600w.jpg';
    heroImage.fetchPriority = 'high';
    heroImage.onload = () => {
        perfMetrics.heroImageLoaded = Date.now() - perfMetrics.pageLoadStart;
        console.log('Hero image preloaded in ' + perfMetrics.heroImageLoaded + 'ms');
    };
})();

// Critical content loading handler
document.addEventListener('DOMContentLoaded', function() {
    perfMetrics.domContentLoaded = Date.now() - perfMetrics.pageLoadStart;
    console.log('DOM content loaded in ' + perfMetrics.domContentLoaded + 'ms');
    
    // Use double requestAnimationFrame for reliable rendering timing
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Load hero image with highest priority
            const heroImages = document.querySelectorAll('.hero-background, .hero img');
            Promise.all(
                Array.from(heroImages).map(img => {
                    if (img.dataset && img.dataset.src) {
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        });
                    }
                    return Promise.resolve();
                })
            ).then(() => {
                // Remove loading class after hero images are loaded
                setTimeout(() => {
                    if (document.documentElement.classList.contains('loading')) {
                        console.log('Revealing content after hero loaded');
                        document.documentElement.classList.remove('loading');
                    }
                }, 10);
            });
        });
    });
});

// Add page load complete handler with improved performance
window.addEventListener('load', function() {
    // Ensure page is fully visible
    document.documentElement.classList.remove('loading');
    
    const loadTime = Date.now() - pageLoadStart;
    console.log('Page fully loaded in ' + loadTime + 'ms');
    
    // Report performance metrics
    if (window.performance && window.performance.mark) {
        window.performance.mark('fullLoad');
        window.performance.measure('fullPageLoad', 'navigationStart', 'fullLoad');
    }
    
    // Lazy load remaining images after critical content is displayed
    const nonCriticalImages = document.querySelectorAll('img[data-src]:not(.loaded):not(.hero-background)');
    if (nonCriticalImages.length > 0) {
        setTimeout(() => {
            nonCriticalImages.forEach(img => {
                if (img.dataset && img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
            });
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Cache frequently accessed DOM elements to reduce lookups
    const cachedElements = {};
    
    function getElement(id) {
        if (!cachedElements[id]) {
            cachedElements[id] = document.getElementById(id);
        }
        return cachedElements[id];
    }
    
    // Announcement banner close functionality
    const announcementBanner = getElement('announcement-banner');
    const closeBanner = getElement('close-banner');

    if (closeBanner && announcementBanner) {
        closeBanner.addEventListener('click', function() {
            announcementBanner.style.display = 'none';

            // Store in session storage that the banner was closed
            sessionStorage.setItem('bannerClosed', 'true');
        });

        // Check if banner was previously closed in this session
        if (sessionStorage.getItem('bannerClosed') === 'true') {
            announcementBanner.style.display = 'none';
        }
    }

    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('open');

            // Change the icon based on menu state
            if (nav.classList.contains('open')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Testimonials slider functionality
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    // Initialize and set interval for testimonials
    if (testimonials.length > 0) {
        showTestimonial(0);
        setInterval(nextTestimonial, 5000);
    }

    // Scroll reveal animation
    const animateSections = document.querySelectorAll('.animate-section');

    const revealSection = function(entries, observer) {
        const [entry] = entries;

        if (!entry.isIntersecting) return;

        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    animateSections.forEach(function(section) {
        sectionObserver.observe(section);
        section.classList.add('animate-section');
    });

    // Sticky header
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');

    if (header && heroSection) {
        const stickyHeader = function() {
            if (window.scrollY > heroSection.offsetHeight / 2) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', stickyHeader);
    }

    // Lightbox functionality for property images
    const propertyImages = document.querySelectorAll('.property-image img');

    propertyImages.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            document.body.appendChild(lightbox);

            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            lightbox.appendChild(lightboxContent);

            const lightboxImage = document.createElement('img');
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxContent.appendChild(lightboxImage);

            const closeButton = document.createElement('span');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '&times;';
            lightboxContent.appendChild(closeButton);

            closeButton.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Viewport height fix for mobile browsers
    function setVhProperty() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set initially and on resize
    setVhProperty();
    window.addEventListener('resize', setVhProperty);

    console.log("Window loaded");

    // Copy RSS feed URL to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show brief success message
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';

            setTimeout(function() {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // Check for RealScout components and refresh if needed
    const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-home-value');
    if (realscoutElements.length > 0) {
        console.log("RealScout element found");

        // You can add additional logic here if needed
        // For example, you might need to refresh the component
        realscoutElements.forEach(element => {
            // This is a placeholder - the actual refresh method would depend on the RealScout API
            console.log("RealScout component refreshed");
        });
    }

    // Initialize RealScout components
    setTimeout(() => {
        // Handle office listings component
        const realscoutListingsElement = document.querySelector('realscout-office-listings');
        if (realscoutListingsElement) {
            console.log('RealScout listings element found, initializing...');
            // Complete initialization if needed
            realscoutListingsElement.setAttribute('refresh', 'true');
            console.log('RealScout listings component refreshed');
        }

        // Handle home value component
        const realscoutHomeValueElement = document.querySelector('realscout-home-value');
        if (realscoutHomeValueElement) {
            console.log('RealScout home value element found, initializing...');
            // Complete initialization if needed
            realscoutHomeValueElement.setAttribute('refresh', 'true');
            console.log('RealScout home value component refreshed');
        }
    }, 1000);

    // Advanced search toggle
    const searchToggle = document.getElementById('search-toggle');
    const advancedSearchForm = document.getElementById('advanced-property-search');
    const advancedFields = document.querySelectorAll('.advanced-field');

    if (searchToggle && advancedSearchForm) {
        // Initially hide advanced fields
        advancedFields.forEach(field => {
            field.style.display = 'none';
        });

        searchToggle.addEventListener('click', function() {
            // Toggle advanced fields visibility
            const isCollapsed = searchToggle.classList.contains('collapsed');

            if (isCollapsed) {
                // Show advanced fields
                advancedFields.forEach(field => {
                    field.style.display = 'block';
                });
                searchToggle.classList.remove('collapsed');
                advancedSearchForm.classList.add('search-form-full');
            } else {
                // Hide advanced fields
                advancedFields.forEach(field => {
                    field.style.display = 'none';
                });
                searchToggle.classList.add('collapsed');
                advancedSearchForm.classList.remove('search-form-full');
            }
        });

        // Initialize in collapsed state
        searchToggle.classList.add('collapsed');
    }
});