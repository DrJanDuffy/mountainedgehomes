/**
 * Enhanced Page Loader for Mountain Edge Homes
 * Prevents page flickering by ensuring content is shown only when critical images are loaded
 */

// Define a fallback SVG for image errors
const FALLBACK_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';

// Create page loader immediately in the head to prevent flash
(function() {
  // Aggressively block rendering until critical content is ready
  document.documentElement.style.visibility = 'hidden';
  document.documentElement.style.opacity = '0';
  document.documentElement.style.display = 'block';

  // Create a style element for the loader
  const style = document.createElement('style');
  style.textContent = `
    html {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    html.content-loaded {
      visibility: visible;
      opacity: 1;
    }
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
      transition: opacity 0.3s ease;
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

    img[data-src]:not(.loaded) {
      opacity: 0;
      min-height: 1px;
      min-width: 1px;
    }
  `;
  document.head.appendChild(style);

  // Create and add the loader
  const pageLoader = document.createElement('div');
  pageLoader.className = 'page-loader';
  pageLoader.innerHTML = '<div class="loader-spinner"></div>';

  if (document.body) {
    document.body.appendChild(pageLoader);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(pageLoader);
    });
  }

  // Store reference to the loader in window for access by other scripts
  window.pageLoader = pageLoader;

  // Preload critical images right away
  preloadCriticalImages();
  
  // Allow rendering once the DOM is ready but maintain opacity control
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.documentElement.style.display = 'block';
    }, 10);
  });
})();

// Preload critical hero images immediately
function preloadCriticalImages() {
  const criticalImages = [
    'assets/images/hero-mountains-edge-1600w.jpg',
    'assets/images/hero-mountains-edge-800w.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.fetchPriority = 'high';
    img.src = src;
  });
}

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
  let totalCriticalImages = criticalImages.length || 1; // Ensure at least 1 to prevent division by zero

  // Function to check if critical images are loaded
  const criticalImageLoaded = () => {
    loadedCriticalImagesCount++;

    // Update progress indicator if needed
    const progressPct = Math.min(90, Math.floor((loadedCriticalImagesCount / totalCriticalImages) * 100));

    if (loadedCriticalImagesCount >= totalCriticalImages) {
      // Critical images loaded, remove loader and make content visible immediately
      document.documentElement.classList.add('content-loaded');
      pageLoader.classList.add('loader-hidden');
      body.classList.add('content-visible');

      // Force immediate reflow to apply styles
      void document.documentElement.offsetHeight;

      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }

        // Now handle remaining non-critical images with lazy loading
        initLazyLoading();
      }, 100);
    }
  };

  // Handle image error - replace with fallback
  const handleImageError = (img) => {
    if (!img.src.includes('data:image') && !img.classList.contains('error-handled')) {
      console.warn('Image failed to load:', img.src);
      img.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
      img.classList.add('error-handled');
      if (criticalImages.includes(img)) {
        criticalImageLoaded();
      }
    }
  };

  // Preload critical images
  if (criticalImages.length > 0) {
    criticalImages.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        // Image is already loaded
        criticalImageLoaded();
      } else {
        img.addEventListener('load', criticalImageLoaded);
        img.addEventListener('error', () => handleImageError(img));

        // Force load image if it has a data-src attribute
        if (img.dataset && img.dataset.src && !img.src.includes(img.dataset.src)) {
          img.src = img.dataset.src;
        }
      }
    });
  } else {
    // No critical images found, show content
    setTimeout(() => {
      pageLoader.classList.add('loader-hidden');
      body.classList.add('content-visible');

      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }
      }, 300);
    }, 300);
  }

  // Initialize lazy loading for non-critical images
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]:not(.loaded):not(.hero-background)');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loading');

              img.onload = () => {
                img.classList.remove('loading');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
              };

              img.onerror = () => {
                handleImageError(img);
                img.classList.remove('loading');
                img.classList.add('loaded', 'error-handled');
                imageObserver.unobserve(img);
              };
            }
          }
        });
      }, { rootMargin: '200px 0px' });

      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        if (img.dataset && img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          img.addEventListener('error', () => handleImageError(img));
        }
      });
    }
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
      }, 300);
    }
  }, 3000); // Reduced from 5000ms to 3000ms for more aggressive loading

  // Global error handler for all images
  document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && !e.target.classList.contains('error-handled')) {
      e.target.src = window.IMAGE_LOAD_ERROR_PLACEHOLDER;
      e.target.classList.add('error-handled');
      e.preventDefault();
    }
  }, true);
});

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