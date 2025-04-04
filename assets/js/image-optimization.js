
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
    // Apply to all images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.filter = 'none';
            this.classList.add('loaded');
        });
        
        // Add error handling
        img.addEventListener('error', function() {
            console.error('Failed to load image:', this.src);
            // Try fallback if available
            if (this.dataset.fallback && this.src !== this.dataset.fallback) {
                console.log('Attempting fallback image:', this.dataset.fallback);
                this.src = this.dataset.fallback;
            } else {
                // Show error placeholder
                this.classList.add('error');
                // Replace with generic error image if available
                if (window.IMAGE_LOAD_ERROR_PLACEHOLDER) {
                    this.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
                }
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
    const imagesToPreload = document.querySelectorAll('img.preload');
    imagesToPreload.forEach(img => {
        if (img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = img.dataset.src;
            preloadLink.as = 'image';
            document.head.appendChild(preloadLink);
        }
    });
}

// Call preload on window load
window.addEventListener('load', preloadCriticalImages);

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { 
        initLazyLoading,
        enhanceImageQuality,
        preloadCriticalImages
    };
}
