/**
 * Mountain Edge Homes - Simplified Page Loader
 * No-nonsense approach to prevent white screen and flickering
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

  // Allow rendering once the DOM is ready but maintain opacity control
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.documentElement.style.display = 'block';
    }, 10);
  });
})();


// Force content visibility after a short timeout regardless of loading state
setTimeout(function() {
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

  if (document.body) {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  }

  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader && document.body.contains(pageLoader)) {
    pageLoader.classList.add('loader-hidden');
    setTimeout(() => pageLoader.remove(), 300);
  }

  console.log('Force showing content after safety timeout');
}, 800); // Reduced timeout to 800ms

// Create page loader and add to DOM immediately
document.addEventListener('DOMContentLoaded', function() {
  // Ensure all content is visible
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';
  document.documentElement.classList.add('content-loaded');

  if (document.body) {
    document.body.classList.add('content-visible');
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  }

  // Remove loader after a short delay
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.classList.add('loader-hidden');
      setTimeout(() => {
        if (document.body.contains(pageLoader)) {
          pageLoader.remove();
        }
      }, 300);
    }, 300);
  }

  // Handle image errors gracefully
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      if (!this.src.includes('fallback') && !this.classList.contains('error-handled')) {
        this.src = 'assets/images/placeholders/fallback.svg';
        this.classList.add('error-handled');
      }
    };
  });

  // Show all lazy-loaded images immediately in a controlled way
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    if (img.dataset.src && !img.src.includes(img.dataset.src)) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    }
  });
});

// Handle image errors globally
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG' && !e.target.classList.contains('error-handled')) {
    e.target.src = 'assets/images/placeholders/fallback.svg';
    e.target.classList.add('error-handled');
    e.preventDefault();
  }
}, true);

// Set global fallback image
window.IMAGE_LOAD_ERROR_PLACEHOLDER = FALLBACK_SVG;

//Function to generate placeholder image - moved here to avoid unnecessary loading
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
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL();
}