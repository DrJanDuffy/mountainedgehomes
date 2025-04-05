
/**
 * Enhanced Page Loader for Mountain Edge Homes
 * Prevents page flickering by ensuring content is shown only when critical images are loaded
 */

// Create page loader immediately in the head to prevent flash
(function() {
  // Create a style element for the loader
  const style = document.createElement('style');
  style.textContent = `
    .page-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #f8f9fa;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.5s ease;
    }
    
    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(42, 65, 106, 0.2);
      border-top: 5px solid #2a416a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loader-hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    body {
      opacity: 0;
      transition: opacity 0.3s ease-in;
    }
    
    body.content-visible {
      opacity: 1;
    }
    
    .preload-hero {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      z-index: -1;
    }
  `;
  document.head.appendChild(style);
  
  // Create and add the loader
  const pageLoader = document.createElement('div');
  pageLoader.className = 'page-loader';
  pageLoader.innerHTML = '<div class="loader-spinner"></div>';
  
  // Append to body when it's available
  if (document.body) {
    document.body.appendChild(pageLoader);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(pageLoader);
    });
  }
  
  // Store reference to the loader in window for access by other scripts
  window.pageLoader = pageLoader;
})();

// Create inline SVG for fallback image
const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E`;

// Primary loader functionality
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const pageLoader = window.pageLoader || document.querySelector('.page-loader');
  
  if (!pageLoader) {
    console.warn('Page loader element not found');
    body.classList.add('content-visible');
    return;
  }
  
  // Set global fallback image
  window.IMAGE_LOAD_ERROR_PLACEHOLDER = FALLBACK_SVG;
  
  // Get critical images - hero and above-the-fold content only
  const criticalImages = Array.from(document.querySelectorAll('.hero img, .hero-background, img[loading="eager"], .preload-hero'));
  let loadedCriticalImagesCount = 0;
  let totalCriticalImages = criticalImages.length;
  
  // Function to check if critical images are loaded
  const criticalImageLoaded = () => {
    loadedCriticalImagesCount++;
    
    if (loadedCriticalImagesCount >= totalCriticalImages) {
      // Critical images loaded, remove loader
      setTimeout(() => {
        pageLoader.classList.add('loader-hidden');
        body.classList.add('content-visible');
        
        setTimeout(() => {
          if (document.body.contains(pageLoader)) {
            pageLoader.remove();
          }
          
          // Now handle remaining non-critical images with lazy loading
          initLazyLoading();
        }, 500);
      }, 300);
    }
  };
  
  // Handle image error - replace with fallback
  const handleImageError = (img) => {
    if (!img.src.includes('data:image')) {
      console.warn(`Failed to load image: ${img.src}`);
      img.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
    }
    criticalImageLoaded();
  };
  
  // Check if critical images are cached or need loading
  if (totalCriticalImages === 0) {
    // No critical images, remove loader after a brief delay
    setTimeout(() => {
      pageLoader.classList.add('loader-hidden');
      body.classList.add('content-visible');
      
      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }
        
        // Initialize lazy loading for remaining images
        initLazyLoading();
      }, 500);
    }, 300);
  } else {
    // Preload hero images first
    preloadHeroImages().then(() => {
      // Process critical images
      criticalImages.forEach(img => {
        // For images with data-src, load them directly
        if (img.dataset.src && !img.src.includes(img.dataset.src)) {
          const tempImg = new Image();
          tempImg.onload = () => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            criticalImageLoaded();
          };
          tempImg.onerror = () => {
            handleImageError(img);
          };
          tempImg.src = img.dataset.src;
        } else if (img.complete) {
          // Image is already loaded
          criticalImageLoaded();
        } else {
          // Image is loading normally
          img.addEventListener('load', criticalImageLoaded);
          img.addEventListener('error', () => handleImageError(img));
        }
      });
    });
  }
  
  // Safety timeout in case some images fail to load
  setTimeout(() => {
    if (!body.classList.contains('content-visible')) {
      console.log('Safety timeout reached, showing content');
      pageLoader.classList.add('loader-hidden');
      body.classList.add('content-visible');
      
      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }
      }, 500);
    }
  }, 5000);
  
  // Global error handler for all images
  document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && !e.target.classList.contains('error-handled')) {
      e.target.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
      e.target.classList.add('error-handled');
      e.preventDefault();
    }
  }, true);
});

// Initialize lazy loading for non-critical images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          
          // Replace src with data-src
          if (lazyImage.dataset.src) {
            const img = new Image();
            img.onload = () => {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove('lazy');
              lazyImage.classList.add('loaded');
            };
            img.onerror = () => {
              lazyImage.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
              lazyImage.classList.remove('lazy');
              lazyImage.classList.add('error-handled');
            };
            img.src = lazyImage.dataset.src;
          }
          
          // Replace srcset with data-srcset
          if (lazyImage.dataset.srcset) {
            lazyImage.srcset = lazyImage.dataset.srcset;
          }
          
          observer.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '200px', // Load images when they're 200px from viewport
      threshold: 0.01
    });
    
    // Target all images with lazy class and data-src
    const lazyImages = document.querySelectorAll('img[data-src]:not(.loaded), img.lazy');
    lazyImages.forEach(lazyImage => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('img[data-src]:not(.loaded), img.lazy').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }
}

// Preload hero images
function preloadHeroImages() {
  return new Promise(resolve => {
    const heroImages = [
      'assets/images/hero-mountains-edge-1600w.jpg',
      'assets/images/hero-mountains-edge-800w.jpg'
    ];
    
    let loadedCount = 0;
    const totalImages = heroImages.length;
    
    // If no hero images to preload, resolve immediately
    if (totalImages === 0) {
      resolve();
      return;
    }
    
    heroImages.forEach(src => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          resolve();
        }
      };
      img.onerror = () => {
        loadedCount++;
        console.warn(`Failed to preload hero image: ${src}`);
        if (loadedCount >= totalImages) {
          resolve();
        }
      };
      img.fetchPriority = 'high';
      img.src = src;
    });
    
    // Safety timeout
    setTimeout(() => {
      if (loadedCount < totalImages) {
        console.warn('Hero image preload timeout reached');
        resolve();
      }
    }, 3000);
  });
}

// Generate a data URI for a placeholder
function generatePlaceholder(width = 300, height = 200, text = 'Image not found') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#999';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);
  
  return canvas.toDataURL();
}
