
/**
 * Page Loader for Mountain Edge Homes
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
    }
    
    body:not(.content-visible) {
      overflow: hidden;
    }
    
    .content-visible {
      opacity: 1;
      transition: opacity 0.5s ease;
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

// Primary loader functionality
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const pageLoader = window.pageLoader || document.querySelector('.page-loader');
  
  if (!pageLoader) {
    console.warn('Page loader element not found');
    body.classList.add('content-visible');
    return;
  }
  
  // Create a placeholder image path checker
  const checkImageExists = (imagePath) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  };
  
  // Handle missing placeholder images
  const handleMissingPlaceholders = async () => {
    const placeholderPath = 'assets/images/placeholders/image-not-found.jpg';
    const exists = await checkImageExists(placeholderPath);
    
    if (!exists) {
      console.warn('Creating fallback for missing placeholder images');
      // Create a simple fallback for the missing placeholder
      window.IMAGE_LOAD_ERROR_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3e%3crect width="300" height="200" fill="%23f0f0f0"/%3e%3ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-family="Arial" font-size="14"%3eImage not found%3c/text%3e%3c/svg%3e';
    }
  };
  
  // Call immediately
  handleMissingPlaceholders();
  
  // Get critical images - hero and above-the-fold content only
  const criticalImages = Array.from(document.querySelectorAll('.hero img, .hero-background, img[loading="eager"]'));
  let loadedCriticalImagesCount = 0;
  
  // Function to check if critical images are loaded
  const criticalImageLoaded = () => {
    loadedCriticalImagesCount++;
    if (loadedCriticalImagesCount >= criticalImages.length) {
      // Critical images loaded, remove loader
      setTimeout(() => {
        pageLoader.classList.add('loader-hidden');
        setTimeout(() => {
          if (document.body.contains(pageLoader)) {
            pageLoader.remove();
          }
          body.classList.add('content-visible');
          
          // Now handle remaining non-critical images with lazy loading
          initLazyLoading();
        }, 500);
      }, 300);
    }
  };
  
  // Check if critical images are cached or need loading
  if (criticalImages.length === 0) {
    // No critical images, remove loader after a brief delay
    setTimeout(() => {
      pageLoader.classList.add('loader-hidden');
      setTimeout(() => {
        pageLoader.remove();
        body.classList.add('content-visible');
        
        // Initialize lazy loading for remaining images
        initLazyLoading();
      }, 500);
    }, 300);
  } else {
    // Load critical images
    criticalImages.forEach(img => {
      // For images with data-src, load them directly
      if (img.dataset.src && !img.src.includes(img.dataset.src)) {
        // Create a new image object to preload
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          criticalImageLoaded();
        };
        tempImg.onerror = () => {
          console.warn('Failed to load critical image:', img.dataset.src);
          criticalImageLoaded();
        };
        tempImg.src = img.dataset.src;
      } else if (img.complete) {
        // Image is already loaded
        criticalImageLoaded();
      } else {
        // Image is loading normally
        img.addEventListener('load', criticalImageLoaded);
        img.addEventListener('error', () => {
          console.warn('Error loading image:', img.src);
          criticalImageLoaded();
        });
      }
    });
  }
  
  // Safety timeout in case some images fail to load
  setTimeout(() => {
    if (document.body.contains(pageLoader)) {
      console.log('Safety timeout reached, removing loader');
      pageLoader.classList.add('loader-hidden');
      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }
        body.classList.add('content-visible');
      }, 500);
    }
  }, 8000); // 8 second timeout (increased from 5 for slower connections)
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
            lazyImage.src = lazyImage.dataset.src;
          }
          
          // Replace srcset with data-srcset
          if (lazyImage.dataset.srcset) {
            lazyImage.srcset = lazyImage.dataset.srcset;
          }
          
          lazyImage.classList.remove('lazy');
          lazyImage.classList.add('loaded');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
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
  const heroImages = [
    'assets/images/hero-mountains-edge-1600w.jpg',
    'assets/images/hero-mountains-edge-800w.jpg'
  ];
  
  heroImages.forEach(src => {
    const img = new Image();
    img.fetchPriority = 'high';
    img.src = src;
  });
}

// Call preload function immediately
preloadHeroImages();
