
/**
 * Image optimization and loading utilities for Mountain Edge Homes
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
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
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
            img.classList.add('loaded');
        });
    }
}

// Handle image load event to remove blur
document.addEventListener('DOMContentLoaded', function() {
    // Apply to all images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.filter = 'none';
            this.classList.add('loaded');
        });
    });
    
    // Initialize lazy loading
    initLazyLoading();
});

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { initLazyLoading };
}
