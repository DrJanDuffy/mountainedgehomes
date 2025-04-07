
// RealScout Fallback Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if RealScout has loaded after 5 seconds (increased from 3)
    setTimeout(function() {
        checkRealScoutStatus();
    }, 5000);
    
    // Load RealScout script with error handling
    loadRealScoutScript();
});

function checkRealScoutStatus() {
    const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');
    let realscoutFailed = false;
    
    realscoutElements.forEach(element => {
        // Check if the element exists but isn't rendering properly
        if (!element.shadowRoot || element.offsetHeight < 50) {
            console.log('RealScout element not rendering properly:', element);
            realscoutFailed = true;
            element.style.display = 'none';
        }
    });
    
    if (realscoutFailed || realscoutElements.length === 0) {
        console.log('RealScout not loading properly, showing fallback properties');
        showFallbackProperties();
    }
}

function loadRealScoutScript() {
    if (document.querySelector('script[src*="realscout"]')) {
        console.log('RealScout script already loaded, attempting to refresh components');
        refreshRealScoutComponents();
        return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://em.realscout.com/widgets/realscout-web-components.umd.js';
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = function() {
        console.log('RealScout script loaded successfully');
        refreshRealScoutComponents();
    };
    
    script.onerror = function() {
        console.error('Failed to load RealScout script');
        showFallbackProperties();
    };
    
    document.head.appendChild(script);
}

function refreshRealScoutComponents() {
    // Find all RealScout elements and refresh them
    const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');
    
    realscoutElements.forEach(element => {
        try {
            // Force refresh by removing and re-adding the element
            const parent = element.parentNode;
            if (parent) {
                const clone = element.cloneNode(true);
                // Add refresh attribute if it exists in the API
                clone.setAttribute('refresh', 'true');
                parent.removeChild(element);
                setTimeout(() => {
                    parent.appendChild(clone);
                    console.log('RealScout component refreshed');
                }, 300);
            }
        } catch (error) {
            console.error('Error refreshing RealScout component:', error);
        }
    });
    
    // Check status after refresh
    setTimeout(checkRealScoutStatus, 3000);
}

function showFallbackProperties() {
    // Hide all RealScout elements
    const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');
    realscoutElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Show fallback properties container
    const fallbackProperties = document.getElementById('fallback-properties');
    if (fallbackProperties) {
        fallbackProperties.style.display = 'block';
        
        // Load properties from our local data
        const searchResultProperties = document.getElementById('search-result-properties');
        if (searchResultProperties && typeof properties !== 'undefined' && typeof generatePropertyCard !== 'undefined') {
            let propertiesHTML = '';
            
            // If we have search params, apply filtering
            const urlParams = new URLSearchParams(window.location.search);
            const selectedNeighborhood = urlParams.get('neighborhood') || '';
            const minPrice = urlParams.get('min-price') || 0;
            const maxPrice = urlParams.get('max-price') || 10000000;
            const minBeds = urlParams.get('min-beds') || 0;
            const minBaths = urlParams.get('min-baths') || 0;
            
            // Filter properties based on search criteria
            const filteredProperties = properties.filter(property => {
                // Parse price (remove $ and commas)
                const price = parseInt(property.price.replace(/[$,]/g, ''));
                
                // Get number values
                const beds = property.bedrooms;
                const baths = property.bathrooms;
                
                // Apply filters
                return (!selectedNeighborhood || property.neighborhood === selectedNeighborhood) && 
                    price >= minPrice && 
                    price <= maxPrice && 
                    beds >= minBeds && 
                    baths >= minBaths;
            });
            
            if (filteredProperties.length > 0) {
                filteredProperties.forEach(property => {
                    propertiesHTML += generatePropertyCard(property);
                });
            } else {
                propertiesHTML = '<div class="no-results">No properties found matching your criteria. Please try adjusting your search.</div>';
            }
            
            searchResultProperties.innerHTML = propertiesHTML;
            
            // Show a message about using fallback data
            const fallbackMessage = document.createElement('div');
            fallbackMessage.className = 'fallback-message';
            fallbackMessage.innerHTML = '<p><i class="fas fa-info-circle"></i> Showing local property data because the live RealScout search is currently unavailable.</p>';
            searchResultProperties.parentNode.insertBefore(fallbackMessage, searchResultProperties);
        }
    }
}
