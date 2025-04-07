
// RealScout Fallback Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if RealScout has loaded after 3 seconds
    setTimeout(function() {
        const realscoutContainer = document.querySelector('.realscout-container');
        const realscoutElement = document.querySelector('realscout-office-listings');
        const fallbackProperties = document.getElementById('fallback-properties');
        
        // If RealScout element exists but isn't rendering properly
        if (realscoutElement && 
            (!realscoutElement.shadowRoot || 
             realscoutElement.offsetHeight < 50)) {
            
            console.log('RealScout not loading properly, showing fallback properties');
            
            // Hide RealScout and show fallback
            if (realscoutElement) {
                realscoutElement.style.display = 'none';
            }
            
            if (fallbackProperties) {
                fallbackProperties.style.display = 'block';
                
                // Load properties from our local data
                const searchResultProperties = document.getElementById('search-result-properties');
                if (searchResultProperties && typeof properties !== 'undefined' && typeof generatePropertyCard !== 'undefined') {
                    let propertiesHTML = '';
                    properties.forEach(property => {
                        propertiesHTML += generatePropertyCard(property);
                    });
                    searchResultProperties.innerHTML = propertiesHTML;
                }
            }
        }
    }, 3000);
    
    // Add RealScout script with error handling
    function loadRealScoutScript() {
        if (document.querySelector('script[src*="realscout"]')) {
            console.log('RealScout script already loaded');
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://listing-widgets.realscout.com/listingWidgets.js';
        script.async = true;
        script.onerror = function() {
            console.error('Failed to load RealScout script');
            showFallbackProperties();
        };
        document.head.appendChild(script);
    }
    
    function showFallbackProperties() {
        const realscoutElement = document.querySelector('realscout-office-listings');
        const fallbackProperties = document.getElementById('fallback-properties');
        
        if (realscoutElement) {
            realscoutElement.style.display = 'none';
        }
        
        if (fallbackProperties) {
            fallbackProperties.style.display = 'block';
            
            // Load properties from our local data
            const searchResultProperties = document.getElementById('search-result-properties');
            if (searchResultProperties && typeof properties !== 'undefined' && typeof generatePropertyCard !== 'undefined') {
                let propertiesHTML = '';
                properties.forEach(property => {
                    propertiesHTML += generatePropertyCard(property);
                });
                searchResultProperties.innerHTML = propertiesHTML;
            }
        }
    }
    
    // Try to load RealScout script
    loadRealScoutScript();
});
