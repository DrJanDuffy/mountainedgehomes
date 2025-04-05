/**
 * Mountain Edge Homes - Simplified Page Loader
 * Direct approach to eliminate white screen without flicker
 */

// Execute immediately to ensure content is visible
document.documentElement.style.visibility = 'visible';
document.documentElement.style.opacity = '1';
document.documentElement.style.display = 'block';

// Ensure content is visible when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Make everything visible
  document.documentElement.style.visibility = 'visible';
  document.documentElement.style.opacity = '1';

  if (document.body) {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
  }

  // Remove any loader element if it exists
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader && document.body.contains(pageLoader)) {
    pageLoader.classList.add('loader-hidden');
    setTimeout(() => {
      if (document.body && document.body.contains(pageLoader)) {
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