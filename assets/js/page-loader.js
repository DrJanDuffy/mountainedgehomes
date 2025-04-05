/**
 * Mountain Edge Homes - Ultra-Aggressive Page Loader
 * Immediate content display approach to eliminate white screen
 */

// Define a fallback SVG for image errors
const FALLBACK_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';

// Make content visible immediately - highest priority
(function() {
  // Force content visibility - fail-safe approach
  document.documentElement.style.display = 'block';
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

  // Prevent other scripts from hiding content
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
    if (propertyName === 'visibility' && value === 'hidden') {
      // Prevent setting visibility to hidden
      return;
    }
    if (propertyName === 'opacity' && parseFloat(value) < 0.5) {
      // Prevent low opacity
      return;
    }
    originalSetProperty.call(this, propertyName, value, priority);
  };

  // Create a style element for the loader
  const style = document.createElement('style');
  style.textContent = `
    /* Force content visibility */
    html, body {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      background-color: #fff;
    }

    /* Override any styles that might hide content */
    [style*="visibility: hidden"], 
    [style*="opacity: 0"], 
    [style*="display: none"] {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }

    /* Simple loader */
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

    /* Image placeholders */
    img[data-src] {
      min-height: 1px;
      min-width: 1px;
    }
  `;
  document.head.appendChild(style);

  // Create a simple loader
  const pageLoader = document.createElement('div');
  pageLoader.className = 'page-loader';
  pageLoader.innerHTML = '<div class="loader-spinner"></div>';

  // Try to add loader immediately
  if (document.body) {
    document.body.appendChild(pageLoader);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(pageLoader);
    });
  }

  // Store loader reference
  window.pageLoader = pageLoader;
})();

// Force content visibility after 200ms (ultra-aggressive)
setTimeout(function() {
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';
  document.documentElement.style.display = 'block';

  if (document.body) {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  }

  // Remove loader
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader && document.body && document.body.contains(pageLoader)) {
    pageLoader.classList.add('loader-hidden');
    setTimeout(() => {
      if (document.body.contains(pageLoader)) {
        pageLoader.remove();
      }
    }, 300);
  }

  console.log('Force showing content after safety timeout');
}, 200); // Ultra-short timeout

// Handle DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // Double ensure content visibility
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

  if (document.body) {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  }

  // Remove loader
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    pageLoader.classList.add('loader-hidden');
    setTimeout(() => {
      if (document.body.contains(pageLoader)) {
        pageLoader.remove();
      }
    }, 300);
  }

  // Load all images immediately
  document.querySelectorAll('img[data-src]').forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    }
  });

  // Handle image errors
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      if (!this.src.includes('fallback') && !this.classList.contains('error-handled')) {
        this.src = 'assets/images/placeholders/fallback.svg';
        this.classList.add('error-handled');
      }
    };
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

// Function to generate placeholder image
function generatePlaceholder(width = 300, height = 200, text = 'Image not found') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#999';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  return canvas.toDataURL();
}