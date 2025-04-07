// Property search functionality
// This script works with both RealScout and our fallback system

document.addEventListener('DOMContentLoaded', function() {
    // Check if RealScout is loaded
    const isRealScoutAvailable = typeof window.RealScout !== 'undefined';

    // Initialize property search functionality
    initPropertySearch(isRealScoutAvailable);

    function initPropertySearch(useRealScout) {
        console.log(`Property search initialized. Using RealScout: ${useRealScout}`);

        const searchForm = document.getElementById('property-search-form');

        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Get search parameters
                const location = document.getElementById('search-location').value;
                const propertyType = document.getElementById('search-property-type').value;
                const priceRange = document.getElementById('search-price-range').value;

                if (useRealScout && window.RealScout && window.RealScout.search) {
                    // Use RealScout API if available
                    console.log('Using RealScout for property search');
                    try {
                        window.RealScout.search({
                            location: location,
                            propertyType: propertyType,
                            priceRange: priceRange,
                            callback: handleRealScoutResults
                        });
                    } catch (error) {
                        console.error('RealScout error:', error);
                        // Fall back to local search if RealScout fails
                        showLocalSearchResults({
                            location: location,
                            propertyType: propertyType,
                            priceRange: priceRange
                        });
                    }
                } else {
                    // Use our local search implementation
                    console.log('Using local search implementation');
                    showLocalSearchResults({
                        location: location,
                        propertyType: propertyType,
                        priceRange: priceRange
                    });
                }
            });
        }
    }

    function handleRealScoutResults(results) {
        // Process results from RealScout
        console.log('Received results from RealScout');
        const resultsContainer = document.getElementById('property-results');
        if (!resultsContainer) return;

        if (results && results.properties && results.properties.length > 0) {
            // Display RealScout results
            let htmlContent = `
                <h3>Properties Found (${results.properties.length})</h3>
                <div class="property-grid">
            `;

            results.properties.forEach(property => {
                htmlContent += `
                    <div class="property-card">
                        <img src="${property.imageUrl || 'assets/images/property-placeholder.jpg'}" 
                             alt="${property.address || 'Property'}">
                        <div class="property-details">
                            <h4>${property.address || 'Property Listing'}</h4>
                            <p>${property.price || 'Price on request'}</p>
                            <p>${property.bedrooms || '0'} bed | ${property.bathrooms || '0'} bath | ${property.sqft || '0'} sqft</p>
                            <a href="property-details.html?id=${property.id}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                `;
            });

            htmlContent += '</div>';
            resultsContainer.innerHTML = htmlContent;
        } else {
            // No results found
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No properties found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
        }
    }

    function showLocalSearchResults(params) {
        const resultsContainer = document.getElementById('property-results');
        if (!resultsContainer) return;

        // Show loading state
        resultsContainer.innerHTML = '<div class="loading">Searching for properties...</div>';

        // Simulate API delay
        setTimeout(function() {
            // First, remove any existing fallback messages to prevent duplicates
            const existingMessages = resultsContainer.parentNode.querySelectorAll('.fallback-message');
            existingMessages.forEach(msg => msg.remove());
            
            // In a real application, this would be populated with actual database results
            resultsContainer.innerHTML = `
                <h3>Search Results for ${params.propertyType} in ${params.location}</h3>
                <p>Price range: ${params.priceRange}</p>
                <div class="property-grid">
                    <div class="property-card">
                        <img src="assets/images/property1.jpg" alt="Luxury Home in Mountain's Edge">
                        <div class="property-details">
                            <h4>Luxury Home in ${params.location}</h4>
                            <p>$850,000</p>
                            <p>4 bed | 3 bath | 3,200 sqft</p>
                            <a href="property-details.html?id=1" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                    <div class="property-card">
                        <img src="assets/images/property2.jpg" alt="Modern Villa in Mountain's Edge">
                        <div class="property-details">
                            <h4>Modern Villa in ${params.location}</h4>
                            <p>$920,000</p>
                            <p>5 bed | 4 bath | 3,800 sqft</p>
                            <a href="property-details.html?id=2" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                    <div class="property-card">
                        <img src="assets/images/property3.jpg" alt="Family Home in Mountain's Edge">
                        <div class="property-details">
                            <h4>Family Home in ${params.location}</h4>
                            <p>$750,000</p>
                            <p>3 bed | 2.5 bath | 2,800 sqft</p>
                            <a href="property-details.html?id=3" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            
            // Add fallback message only once
            const fallbackMessage = document.createElement('div');
            fallbackMessage.className = 'fallback-message';
            fallbackMessage.innerHTML = '<p><i class="fas fa-info-circle"></i> Showing local property data. Live search is temporarily unavailable.</p>';
            resultsContainer.parentNode.insertBefore(fallbackMessage, resultsContainer);
        }, 1000);
    }
});