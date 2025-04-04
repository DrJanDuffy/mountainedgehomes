
/**
 * Alt Text Checker and Enhancer
 * Improves SEO and accessibility by ensuring all images have descriptive alt text
 */

document.addEventListener('DOMContentLoaded', function() {
    // Run the alt text checker
    checkAltText();
    
    // Add keyboard accessibility for image galleries
    enhanceImageGalleryAccessibility();
});

// Check all images for proper alt text
function checkAltText() {
    const images = document.querySelectorAll('img');
    let missingAltCount = 0;
    
    images.forEach((img, index) => {
        // Skip background/decorative images with role="presentation"
        if (img.getAttribute('role') === 'presentation') {
            return;
        }
        
        // Check if alt text exists and is not empty
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            missingAltCount++;
            
            // Generate alt text based on context if possible
            let generatedAlt = generateContextualAlt(img);
            
            // Apply the generated alt text
            if (generatedAlt) {
                img.setAttribute('alt', generatedAlt);
                console.log('Generated alt text for image:', generatedAlt);
            } else {
                // Mark as missing alt text for debugging
                img.classList.add('missing-alt');
                console.warn('Image missing alt text:', img.src);
            }
        }
    });
    
    // Log results for debugging
    if (missingAltCount > 0) {
        console.warn(`Fixed ${missingAltCount} images with missing alt text`);
    } else {
        console.log('All images have alt text. Great job!');
    }
}

// Generate contextual alt text based on surrounding content
function generateContextualAlt(img) {
    // Try to get context from parent elements
    const parent = img.closest('figure, .property-card, .neighborhood-card, .team-member, .image-container');
    
    if (parent) {
        // Look for captions or heading text
        const caption = parent.querySelector('figcaption');
        const heading = parent.querySelector('h1, h2, h3, h4, h5, h6');
        const description = parent.querySelector('p');
        
        if (caption) {
            return caption.textContent.trim();
        } else if (heading) {
            return heading.textContent.trim() + ' image';
        } else if (description) {
            // Use first sentence of description
            const firstSentence = description.textContent.split('.')[0].trim();
            if (firstSentence.length > 10) {
                return firstSentence;
            }
        }
        
        // Try to get context from parent classes
        if (parent.classList.contains('property-card')) {
            return 'Mountain\'s Edge property';
        } else if (parent.classList.contains('neighborhood-card')) {
            return 'Mountain\'s Edge neighborhood';
        } else if (parent.classList.contains('team-member')) {
            return 'Mountain Edge Homes team member';
        }
    }
    
    // Extract filename as last resort
    const filename = img.src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
    if (filename && filename.length > 3) {
        return 'Image: ' + filename.charAt(0).toUpperCase() + filename.slice(1);
    }
    
    return null;
}

// Enhance keyboard accessibility for image galleries
function enhanceImageGalleryAccessibility() {
    const galleries = document.querySelectorAll('.property-gallery, .neighborhood-grid, .gallery-grid');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        
        images.forEach(img => {
            // Make images focusable
            if (!img.hasAttribute('tabindex')) {
                img.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event for images
            img.addEventListener('keydown', function(e) {
                // Enter key will simulate click
                if (e.key === 'Enter') {
                    // Find parent link or trigger modal
                    const parentLink = img.closest('a');
                    if (parentLink) {
                        parentLink.click();
                    } else {
                        // Show larger version in modal
                        showImageModal(img);
                    }
                }
            });
        });
    });
}

// Show image in accessible modal
function showImageModal(img) {
    // Check if modal already exists
    let modal = document.getElementById('accessible-image-modal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'accessible-image-modal';
        modal.className = 'accessible-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close image preview">&times;</button>
                <img src="" alt="" class="modal-image">
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Update modal content
    const modalImg = modal.querySelector('.modal-image');
    const modalCaption = modal.querySelector('.modal-caption');
    
    // Use high-res version if available, otherwise use src
    modalImg.src = img.dataset.src || img.src;
    modalImg.alt = img.alt;
    modalCaption.textContent = img.alt;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus the close button for accessibility
    setTimeout(() => {
        modal.querySelector('.modal-close').focus();
    }, 100);
}
