/**
 * Image optimization and loading utilities for Mountain Edge Homes
 * Enhanced with improved lazy loading, alt text verification, and responsive handling
 */

// Initialize lazy loading for all images with data-src attribute
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Set the src to the data-src value
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Handle srcset if available
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }

                    // Handle sizes attribute if available
                    if (img.dataset.sizes) {
                        img.sizes = img.dataset.sizes;
                        img.removeAttribute('data-sizes');
                    }

                    img.classList.add('loaded');
                    imageObserver.unobserve(img);

                    // Log successful load for debugging
                    console.log(`Image loaded: ${img.alt || 'no alt text'}`);
                }
            });
        }, {
            rootMargin: '100px 0px', // Increased margin for earlier loading
            threshold: 0.01
        });

        // Target all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            // Add a placeholder blur effect
            if (!img.classList.contains('no-placeholder')) {
                img.style.filter = 'blur(5px)';
                img.style.transition = 'filter 0.5s ease';
            }

            // Verify alt text exists
            if (!img.alt || img.alt.trim() === '') {
                console.warn('Image missing alt text:', img.dataset.src || img.src);
                // Set default alt if missing
                if (img.dataset.defaultAlt) {
                    img.alt = img.dataset.defaultAlt;
                }
            }

            // Add loading="lazy" attribute for browser-level lazy loading
            if (!img.loading) {
                img.loading = 'lazy';
            }

            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            if (img.dataset.sizes) {
                img.sizes = img.dataset.sizes;
            }
            img.classList.add('loaded');
        });
    }
}

// Enhance image quality and loading
function enhanceImageQuality() {
    // Apply LQIP (Low Quality Image Placeholder) technique
    document.querySelectorAll('.lqip-container').forEach(container => {
        const img = container.querySelector('img');
        const canvas = container.querySelector('canvas');

        if (img && canvas) {
            // Draw blurred version of image on canvas
            const ctx = canvas.getContext('2d');
            const tempImg = new Image();
            tempImg.onload = function() {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
                ctx.filter = 'blur(20px)';
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
            };
            tempImg.src = img.dataset.thumbnail || img.dataset.src;
        }
    });

    // Apply WebP format when supported
    if (supportsWebP()) {
        document.querySelectorAll('img[data-webp]').forEach(img => {
            if (img.dataset.src && !img.dataset.src.includes('.webp')) {
                img.dataset.srcOrig = img.dataset.src;
                img.dataset.src = img.dataset.webp;
            }
        });
    }
}

// Check if browser supports WebP
function supportsWebP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// Handle image load event to remove blur
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.optimized-image');

    // Create image loader function that returns a promise
    function loadImage(img) {
        return new Promise((resolve, reject) => {
            if (img.dataset.src) {
                // Check if image is already loaded or loading
                if (img.classList.contains('loaded') || img.src === img.dataset.src) {
                    resolve(img);
                    return;
                }

                // Add loading class to track state
                img.classList.add('loading');
                
                const tempImage = new Image();

                tempImage.onload = function() {
                    requestAnimationFrame(() => {
                        img.src = img.dataset.src;
                        
                        // If there's a srcset, set it too
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        // Add loaded class and remove loading class
                        img.classList.add('loaded');
                        img.classList.remove('loading');
                        
                        // Remove blur filter when loaded
                        if (img.style.filter && img.style.filter.includes('blur')) {
                            img.style.filter = 'none';
                        }
                        
                        resolve(img);
                    });
                };

                tempImage.onerror = function() {
                    console.log('Failed to load image:', img.dataset.src);
                    img.classList.remove('loading');
                    
                    if (typeof window.IMAGE_LOAD_ERROR_PLACEHOLDER !== 'undefined') {
                        img.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
                    }
                    reject(img);
                };

                tempImage.src = img.dataset.src;
            } else {
                resolve(img);
            }
        });
    }

    // Better critical images handling
    const criticalImages = Array.from(images).filter(img => img.getAttribute('loading') === 'eager');
    const nonCriticalImages = Array.from(images).filter(img => img.getAttribute('loading') !== 'eager');

    // Preload hero images immediately with high priority
    const heroImages = criticalImages.filter(img => img.classList.contains('hero-background'));
    if (heroImages.length > 0) {
        heroImages.forEach(img => {
            img.style.willChange = 'opacity';
            loadImage(img);
        });
    }
    
    // Load remaining critical images immediately with high priority
    Promise.all(criticalImages.map(loadImage))
        .then(() => {
            // Signal that critical content is ready
            if (window.performance && window.performance.mark) {
                window.performance.mark('criticalImagesLoaded');
            }
            
            // Load non-critical images after critical ones
            setTimeout(() => {
                nonCriticalImages.forEach(img => {
                    loadImage(img).catch(() => {
                        // Error handling already done in loadImage
                    });
                });
            }, 100); // Small delay to prioritize UI rendering first
        });

    // Set up error handler for all images
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Failed to load image:', img.src);
            if (typeof window.IMAGE_LOAD_ERROR_PLACEHOLDER !== 'undefined') {
                this.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
            }
        });
    });


    // Initialize enhanced image features
    enhanceImageQuality();

    // Initialize lazy loading
    initLazyLoading();
});

// Function to preload critical images
function preloadCriticalImages() {
    // Preload critical images
    const imagesToPreload = document.querySelectorAll('img.preload, img.hero-background, .hero img');
    
    // Create a batch of preload links at once
    const fragment = document.createDocumentFragment();
    
    imagesToPreload.forEach(img => {
        if (img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = img.dataset.src;
            preloadLink.as = 'image';
            preloadLink.fetchpriority = 'high';
            fragment.appendChild(preloadLink);
            
            // Pre-load the image immediately for faster display
            const tempImg = new Image();
            tempImg.onload = function() {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            };
            tempImg.src = img.dataset.src;
        }
    });
    
    document.head.appendChild(fragment);
}

// Immediately execute preload for critical images
document.addEventListener('DOMContentLoaded', preloadCriticalImages);

// Set up error handler once for placeholder images
const IMAGE_LOAD_ERROR_PLACEHOLDER = 'assets/images/placeholders/image-not-found.jpg';

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { 
        initLazyLoading,
        enhanceImageQuality,
        preloadCriticalImages
    };
}