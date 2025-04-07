
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the advanced property search
    initAdvancedPropertySearch();
    
    // Handle form submission and filtering
    const searchForm = document.getElementById('advanced-property-search');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const location = document.getElementById('search-location')?.value || '';
            const propertyType = document.getElementById('search-property-type')?.value || '';
            const priceRange = document.getElementById('search-price-range')?.value || '';
            const bedrooms = document.getElementById('search-bedrooms')?.value || '';
            const bathrooms = document.getElementById('search-bathrooms')?.value || '';
            const neighborhood = document.getElementById('search-neighborhood')?.value || '';
            
            // Parse price range
            let minPrice = 0, maxPrice = 0;
            if (priceRange) {
                const [min, max] = priceRange.split('-');
                minPrice = min ? parseInt(min) : 0;
                maxPrice = max ? parseInt(max) : 10000000;
            }
            
            // Build the search query for RealScout
            let searchQuery = '';
            
            if (location) searchQuery += location + ' ';
            if (neighborhood) searchQuery += neighborhood + ' ';
            if (propertyType) searchQuery += propertyType + ' ';
            
            // Try to use RealScout first
            updateRealScoutSearch(searchQuery.trim(), minPrice, maxPrice, bedrooms, bathrooms);
            
            // Also update URL parameters for fallback system
            const searchParams = new URLSearchParams();
            if (neighborhood) searchParams.set('neighborhood', neighborhood);
            if (minPrice) searchParams.set('min-price', minPrice);
            if (maxPrice) searchParams.set('max-price', maxPrice);
            if (bedrooms) searchParams.set('min-beds', bedrooms);
            if (bathrooms) searchParams.set('min-baths', bathrooms);
            
            // Update URL without reloading page
            const newUrl = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState({}, '', newUrl);
            
            // If we're using fallback, trigger it directly
            if (document.getElementById('fallback-properties') && 
                document.getElementById('fallback-properties').style.display === 'block') {
                showFallbackProperties();
            }
            
            // Show the search params summary
            showSearchSummary({
                location, 
                propertyType, 
                priceRange, 
                bedrooms, 
                bathrooms, 
                neighborhood
            });
            
            // Scroll to results
            const searchResults = document.getElementById('search-results');
            if (searchResults) {
                searchResults.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Add reset functionality
    const resetButton = document.getElementById('reset-search');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (searchForm) {
                searchForm.reset();
            }
            
            // Reset RealScout to default state
            resetRealScoutSearch();
            
            // Clear search summary
            const searchSummary = document.getElementById('search-summary');
            if (searchSummary) {
                searchSummary.innerHTML = '';
                searchSummary.style.display = 'none';
            }
            
            // Reset URL parameters
            window.history.pushState({}, '', window.location.pathname);
            
            // If using fallback, show all properties
            if (document.getElementById('fallback-properties') && 
                document.getElementById('fallback-properties').style.display === 'block') {
                showFallbackProperties();
            }
        });
    }
});

function updateRealScoutSearch(searchQuery, minPrice, maxPrice, bedrooms, bathrooms) {
    // Find all RealScout elements that need updating
    const realscoutListings = document.querySelectorAll('realscout-office-listings');
    const realscoutSimpleSearch = document.querySelectorAll('realscout-simple-search');
    const realscoutAdvancedSearch = document.querySelectorAll('realscout-advanced-search');
    
    // Update office listings component
    realscoutListings.forEach(element => {
        console.log('Updating RealScout office listings with search parameters');
        
        // Set the custom search if we have search terms
        if (searchQuery) {
            element.setAttribute('custom-search', searchQuery);
        } else {
            element.removeAttribute('custom-search');
        }
        
        // Set price range
        if (minPrice) {
            element.setAttribute('price-min', minPrice);
        } else {
            element.setAttribute('price-min', '500000'); // Default
        }
        
        if (maxPrice) {
            element.setAttribute('price-max', maxPrice);
        } else {
            element.removeAttribute('price-max');
        }
        
        // Set bed/bath filters if available in the API
        if (bedrooms) {
            element.setAttribute('beds-min', bedrooms);
        }
        
        if (bathrooms) {
            element.setAttribute('baths-min', bathrooms);
        }
        
        // Force refresh the component
        refreshRealScoutElement(element);
    });
    
    // Update simple search fields
    realscoutSimpleSearch.forEach(element => {
        if (searchQuery) {
            // Find the input field within the shadow DOM or use attribute if available
            try {
                element.setAttribute('search-text', searchQuery);
            } catch (error) {
                console.error('Error setting search text on simple search:', error);
            }
        }
    });
    
    // Update advanced search fields if possible
    realscoutAdvancedSearch.forEach(element => {
        // Try to set filters through attributes if the API supports it
        try {
            if (minPrice) element.setAttribute('price-min', minPrice);
            if (maxPrice) element.setAttribute('price-max', maxPrice);
            if (bedrooms) element.setAttribute('beds-min', bedrooms);
            if (bathrooms) element.setAttribute('baths-min', bathrooms);
        } catch (error) {
            console.error('Error setting filters on advanced search:', error);
        }
    });
}

function resetRealScoutSearch() {
    const realscoutElements = document.querySelectorAll('realscout-office-listings');
    
    realscoutElements.forEach(element => {
        // Reset to default parameters
        element.removeAttribute('custom-search');
        element.setAttribute('price-min', '500000');
        element.removeAttribute('price-max');
        element.removeAttribute('beds-min');
        element.removeAttribute('baths-min');
        
        // Force refresh
        refreshRealScoutElement(element);
    });
}

function refreshRealScoutElement(element) {
    try {
        const parent = element.parentNode;
        if (parent) {
            const clone = element.cloneNode(true);
            parent.removeChild(element);
            setTimeout(() => {
                parent.appendChild(clone);
                console.log('RealScout search updated');
            }, 300);
        }
    } catch (error) {
        console.error('Error refreshing RealScout element:', error);
    }
}

function initAdvancedPropertySearch() {
    // Populate neighborhoods dropdown if it exists
    const neighborhoodSelect = document.getElementById('search-neighborhood');
    if (neighborhoodSelect) {
        // Get the neighborhoods from our existing select (if available)
        const existingNeighborhoodSelect = document.getElementById('neighborhood-select');
        if (existingNeighborhoodSelect) {
            neighborhoodSelect.innerHTML = existingNeighborhoodSelect.innerHTML;
        } else {
            // Fallback to hardcoded neighborhoods
            neighborhoodSelect.innerHTML = `
                <option value="">Any Neighborhood</option>
                <option value="Aspire">Aspire (gated)</option>
                <option value="Cascade">Cascade at Mountain Pass (guard-gated)</option>
                <option value="Collina">Collina (gated)</option>
                <option value="Mesa-Valla">Mesa/Valla (gated)</option>
                <option value="Montelano">Montelano (gated)</option>
                <option value="Quintessa">Quintessa (gated)</option>
                <option value="San-Gabriel">San Gabriel (gated)</option>
                <option value="Sierra-Madre">Sierra Madre (gated)</option>
            `;
        }
    }
    
    // Set values from URL if they exist
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set form values based on URL parameters
    if (urlParams.has('neighborhood')) {
        const neighborhoodParam = urlParams.get('neighborhood');
        if (neighborhoodSelect) {
            for (let i = 0; i < neighborhoodSelect.options.length; i++) {
                if (neighborhoodSelect.options[i].value === neighborhoodParam) {
                    neighborhoodSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    // Set other search parameters from URL if they exist
    const priceRangeSelect = document.getElementById('search-price-range');
    const bedroomsSelect = document.getElementById('search-bedrooms');
    const bathroomsSelect = document.getElementById('search-bathrooms');
    
    // Apply saved search parameters from URL if they exist
    if (urlParams.has('min-price') && urlParams.has('max-price') && priceRangeSelect) {
        const minPrice = urlParams.get('min-price');
        const maxPrice = urlParams.get('max-price');
        const priceRangeValue = `${minPrice}-${maxPrice}`;
        
        for (let i = 0; i < priceRangeSelect.options.length; i++) {
            if (priceRangeSelect.options[i].value === priceRangeValue) {
                priceRangeSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    if (urlParams.has('min-beds') && bedroomsSelect) {
        const minBeds = urlParams.get('min-beds');
        for (let i = 0; i < bedroomsSelect.options.length; i++) {
            if (bedroomsSelect.options[i].value === minBeds) {
                bedroomsSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    if (urlParams.has('min-baths') && bathroomsSelect) {
        const minBaths = urlParams.get('min-baths');
        for (let i = 0; i < bathroomsSelect.options.length; i++) {
            if (bathroomsSelect.options[i].value === minBaths) {
                bathroomsSelect.selectedIndex = i;
                break;
            }
        }
    }
}

function showSearchSummary(params) {
    const summaryElement = document.getElementById('search-summary');
    if (!summaryElement) return;
    
    let summaryHTML = '<div class="search-params">';
    
    if (params.location) {
        summaryHTML += `<span class="search-param"><i class="fas fa-map-marker-alt"></i> ${params.location}</span>`;
    }
    
    if (params.neighborhood) {
        const neighborhoodElement = document.getElementById('search-neighborhood');
        if (neighborhoodElement) {
            const selectedOption = neighborhoodElement.options[neighborhoodElement.selectedIndex];
            if (selectedOption) {
                summaryHTML += `<span class="search-param"><i class="fas fa-home"></i> ${selectedOption.text}</span>`;
            }
        }
    }
    
    if (params.propertyType) {
        const propertyTypeElement = document.getElementById('search-property-type');
        if (propertyTypeElement) {
            const selectedOption = propertyTypeElement.options[propertyTypeElement.selectedIndex];
            if (selectedOption) {
                summaryHTML += `<span class="search-param"><i class="fas fa-building"></i> ${selectedOption.text}</span>`;
            }
        }
    }
    
    if (params.priceRange) {
        const [min, max] = params.priceRange.split('-');
        let priceText = '';
        
        if (min && max) {
            priceText = `$${parseInt(min).toLocaleString()} - $${parseInt(max).toLocaleString()}`;
        } else if (min && !max) {
            priceText = `$${parseInt(min).toLocaleString()}+`;
        }
        
        if (priceText) {
            summaryHTML += `<span class="search-param"><i class="fas fa-dollar-sign"></i> ${priceText}</span>`;
        }
    }
    
    if (params.bedrooms && params.bedrooms !== '') {
        summaryHTML += `<span class="search-param"><i class="fas fa-bed"></i> ${params.bedrooms}+ Beds</span>`;
    }
    
    if (params.bathrooms && params.bathrooms !== '') {
        summaryHTML += `<span class="search-param"><i class="fas fa-bath"></i> ${params.bathrooms}+ Baths</span>`;
    }
    
    summaryHTML += '</div>';
    
    summaryElement.innerHTML = summaryHTML;
    summaryElement.style.display = 'block';
}
