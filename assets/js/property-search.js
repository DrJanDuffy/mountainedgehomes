
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
            
            // Build the search query for RealScout
            let searchQuery = '';
            
            if (location) searchQuery += location + ' ';
            if (neighborhood) searchQuery += neighborhood + ' ';
            if (propertyType) searchQuery += propertyType + ' ';
            
            // If you have a RealScout element, update its search attributes
            const realscoutElement = document.querySelector('realscout-office-listings');
            
            if (realscoutElement) {
                // Set the custom search if we have search terms
                if (searchQuery.trim()) {
                    realscoutElement.setAttribute('custom-search', searchQuery.trim());
                }
                
                // Set price range if selected
                if (priceRange) {
                    const [min, max] = priceRange.split('-');
                    if (min) realscoutElement.setAttribute('price-min', min);
                    if (max) realscoutElement.setAttribute('price-max', max);
                }
                
                // Force refresh the component
                const parent = realscoutElement.parentNode;
                const clone = realscoutElement.cloneNode(true);
                parent.removeChild(realscoutElement);
                setTimeout(() => {
                    parent.appendChild(clone);
                    console.log('RealScout search updated with parameters:', { 
                        location, propertyType, priceRange, bedrooms, bathrooms, neighborhood 
                    });
                    
                    // Scroll to results
                    const searchResults = document.getElementById('search-results');
                    if (searchResults) {
                        searchResults.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
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
        });
    }
    
    // Add reset functionality
    const resetButton = document.getElementById('reset-search');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (searchForm) {
                searchForm.reset();
            }
            
            // Reset RealScout to default state if it exists
            const realscoutElement = document.querySelector('realscout-office-listings');
            if (realscoutElement) {
                realscoutElement.removeAttribute('custom-search');
                realscoutElement.setAttribute('price-min', '500000');
                realscoutElement.removeAttribute('price-max');
                
                // Force refresh
                const parent = realscoutElement.parentNode;
                const clone = realscoutElement.cloneNode(true);
                parent.removeChild(realscoutElement);
                setTimeout(() => {
                    parent.appendChild(clone);
                    console.log('RealScout search reset to defaults');
                }, 300);
            }
            
            // Clear search summary
            const searchSummary = document.getElementById('search-summary');
            if (searchSummary) {
                searchSummary.innerHTML = '';
                searchSummary.style.display = 'none';
            }
        });
    }
});

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
