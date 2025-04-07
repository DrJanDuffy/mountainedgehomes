document.addEventListener('DOMContentLoaded', function() {
    // Function to check if RealScout is loaded properly
    function isRealScoutLoaded() {
        return typeof window.RealScout !== 'undefined';
    }

    // Check if RealScout is loaded after a timeout
    setTimeout(function() {
        if (!isRealScoutLoaded()) {
            console.log('RealScout not loaded. Falling back to local property search.');
            const localSearch = setupLocalPropertySearch();
            localSearch.init();
        } else {
            console.log('RealScout loaded successfully.');
        }
    }, 3000); // Wait 3 seconds to check

    // Fallback property search functionality
    function setupLocalPropertySearch() {
        // Return an object with init method
        return {
            init: function() {
                // Initialize local property search
                const searchForm = document.getElementById('property-search-form');
                if (searchForm) {
                    searchForm.addEventListener('submit', handleLocalSearch);
                }
            }
        };
    }

    // Handle local search function
    function handleLocalSearch(e) {
        e.preventDefault();
        console.log('Local search executed');

        // Get search form values
        const location = document.getElementById('search-location').value;
        const propertyType = document.getElementById('search-property-type').value;
        const priceRange = document.getElementById('search-price-range').value;

        // Log search parameters
        console.log(`Searching for ${propertyType} in ${location} with price range ${priceRange}`);

        // Display search results (this would fetch from a database in production)
        showLocalSearchResults({
            location: location,
            propertyType: propertyType,
            priceRange: priceRange
        });
    }

    // Function to display search results
    function showLocalSearchResults(params) {
        const resultsContainer = document.getElementById('property-results');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <h3>Search Results for ${params.propertyType} in ${params.location}</h3>
            <p>Price range: ${params.priceRange}</p>
            <div class="property-grid">
                <div class="property-card">
                    <img src="assets/images/property1.jpg" alt="Luxury Home in Mountain's Edge">
                    <div class="property-details">
                        <h4>Luxury Home</h4>
                        <p>$850,000</p>
                        <p>4 bed | 3 bath | 3,200 sqft</p>
                    </div>
                </div>
                <div class="property-card">
                    <img src="assets/images/property2.jpg" alt="Modern Villa in Mountain's Edge">
                    <div class="property-details">
                        <h4>Modern Villa</h4>
                        <p>$920,000</p>
                        <p>5 bed | 4 bath | 3,800 sqft</p>
                    </div>
                </div>
                <div class="property-card">
                    <img src="assets/images/property3.jpg" alt="Family Home in Mountain's Edge">
                    <div class="property-details">
                        <h4>Family Home</h4>
                        <p>$750,000</p>
                        <p>3 bed | 2.5 bath | 2,800 sqft</p>
                    </div>
                </div>
            </div>
        `;
    }
});

// RealScout Fallback Script
//Check if RealScout has loaded after 5 seconds (increased from 3)
setTimeout(function() {
    checkRealScoutStatus();
}, 5000);

// Load RealScout script with error handling
loadRealScoutScript();


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

            // Make sure we don't have duplicate fallback messages
            // First, check if a fallback message already exists
            const existingMessages = document.querySelectorAll('.fallback-message');
            let shouldAddMessage = true;
            
            // If there are existing messages, we'll keep only one
            if (existingMessages.length > 0) {
                // Remove all but the first one
                for (let i = 1; i < existingMessages.length; i++) {
                    existingMessages[i].remove();
                }
                // If we already have one message, don't add another
                if (existingMessages[0].textContent.includes('Showing local property data')) {
                    shouldAddMessage = false;
                }
            }

            // Only add a new message if needed
            if (shouldAddMessage) {
                const fallbackMessage = document.createElement('div');
                fallbackMessage.className = 'fallback-message';
                fallbackMessage.innerHTML = '<p><i class="fas fa-info-circle"></i> Showing local property data because the live RealScout search is currently unavailable.</p>';
                
                // Add the message before the properties container
                const propertiesContainer = document.getElementById('search-result-properties');
                if (propertiesContainer && propertiesContainer.parentNode) {
                    propertiesContainer.parentNode.insertBefore(fallbackMessage, propertiesContainer);
                } else {
                    // Fallback - add it to the beginning of searchResultProperties parent
                    searchResultProperties.parentNode.insertBefore(fallbackMessage, searchResultProperties);
                }
            }
        }
    }
}