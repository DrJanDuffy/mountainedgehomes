document.addEventListener('DOMContentLoaded', function() {
    // Get the current neighborhood from the HTML filename
    const pagePath = window.location.pathname;
    const pageFilename = pagePath.substring(pagePath.lastIndexOf('/') + 1);

    // Extract neighborhood name from filename (e.g., neighborhood-aspire.html -> aspire)
    let neighborhoodName = pageFilename.replace('neighborhood-', '').replace('.html', '');

    // Format neighborhood name for display (replace hyphens with spaces and capitalize)
    let formattedName = neighborhoodName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    // Update page title and subtitle
    document.querySelectorAll('.neighborhood-title').forEach(el => {
        el.textContent = formattedName;
    });

    document.title = formattedName + ' | Mountain Edge Homes';

    // Update property listings
    const propertiesContainer = document.getElementById('neighborhood-properties');
    if (propertiesContainer) {
        // Filter properties for this neighborhood
        const neighborhoodProperties = properties.filter(property => {
            // Replace spaces with hyphens and make lowercase for comparison
            const propNeighborhood = property.neighborhood.toLowerCase().replace(/\s+/g, '-');
            return propNeighborhood === neighborhoodName;
        });

        if (neighborhoodProperties.length > 0) {
            propertiesContainer.innerHTML = neighborhoodProperties.map(property => 
                generatePropertyCard(property)
            ).join('');
        } else {
            propertiesContainer.innerHTML = `
                <div class="no-properties">
                    <p>There are currently no properties available in ${formattedName}.</p>
                    <p>Please check back soon or <a href="index.html#contact">contact us</a> for upcoming listings.</p>
                </div>
            `;
        }
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.neighborhood-description, .neighborhood-image, .amenities-list, .gallery-item');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.8) {
                element.classList.add('animated');
            }
        });
    };

    // Run once on load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Gallery image lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';

            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';

            const lightboxImage = document.createElement('img');
            lightboxImage.src = this.src;

            const closeButton = document.createElement('span');
            closeButton.className = 'lightbox-close';
            closeButton.innerHTML = '&times;';

            // Append elements
            lightboxContent.appendChild(lightboxImage);
            lightboxContent.appendChild(closeButton);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);

            // Prevent scrolling while lightbox is open
            document.body.style.overflow = 'hidden';

            // Close lightbox on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
                document.body.style.overflow = 'auto';
            });
        });
    });

    // RealScout element check
    window.addEventListener('load', function() {
        console.log('Window loaded');
        // Check if the RealScout component exists on the page
        const realscoutElement = document.querySelector('realscout-office-listings');

        if (realscoutElement) {
            console.log('RealScout element found');
            // Force a refresh of the component by removing and re-adding it
            const parent = realscoutElement.parentNode;
            const clone = realscoutElement.cloneNode(true);
            parent.removeChild(realscoutElement);
            setTimeout(() => {
                parent.appendChild(clone);
                console.log('RealScout component refreshed');
            }, 500);
        } else {
            console.log('RealScout element not found');
        }
    });
});