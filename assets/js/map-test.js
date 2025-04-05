
// Map Testing Utility
window.addEventListener('load', function() {
    console.log('Map test utility loaded');
    
    // Check if any map elements exist
    const mainMap = document.getElementById('mountain-edge-map');
    const globalMap = document.getElementById('global-mountain-edge-map');
    
    if (mainMap || globalMap) {
        console.log('Map element found on page:', mainMap ? 'mountain-edge-map' : 'global-mountain-edge-map');
        
        // Add a test button to the page
        const testButton = document.createElement('button');
        testButton.innerText = 'Test Maps';
        testButton.style.position = 'fixed';
        testButton.style.bottom = '10px';
        testButton.style.right = '10px';
        testButton.style.zIndex = '9999';
        testButton.style.padding = '10px';
        testButton.style.background = '#4285f4';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        
        testButton.addEventListener('click', function() {
            // Test Google Maps API status
            console.log('Google API object exists:', typeof google !== 'undefined');
            
            if (typeof google !== 'undefined') {
                console.log('Google Maps object exists:', typeof google.maps !== 'undefined');
                
                // If maps exists but there was an issue with initMap
                if (typeof google.maps !== 'undefined') {
                    if (mainMap && !mainMap.querySelector('.gm-style')) {
                        console.log('Manually initializing main map');
                        if (typeof initMap === 'function') {
                            initMap();
                        }
                    }
                    
                    if (globalMap && !globalMap.querySelector('.gm-style')) {
                        console.log('Manually initializing global map');
                        if (typeof initGlobalMap === 'function') {
                            initGlobalMap();
                        }
                    }
                }
                
            } else {
                console.error('Google API not loaded');
                alert('Google Maps API is not loaded. Attempting to load it now...');
                
                // Function to run when testing the API
                window.initMapsCallback = function() {
                    console.log('Google Maps API loaded successfully via test');
                    alert('Google Maps API loaded successfully!');
                    
                    // Try to initialize maps if they exist
                    if (mainMap && typeof initMap === 'function') {
                        initMap();
                    }
                    
                    if (globalMap && typeof initGlobalMap === 'function') {
                        initGlobalMap();
                    }
                };
                
                // Try to reload the maps API
                const script = document.createElement('script');
                const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapsCallback`;
                script.async = true;
                script.defer = true;
                
                // Handle script loading errors
                script.onerror = function() {
                    console.error('Failed to load Google Maps API during test');
                    alert('Failed to load Google Maps API. Check your internet connection or API key restrictions.');
                };
                
                document.head.appendChild(script);
            }
        });
        
        document.body.appendChild(testButton);
        
        // Add diagnostics to the console
        console.log('Map initialization diagnostics:');
        console.log('- window.google exists:', typeof window.google !== 'undefined');
        console.log('- initMap function exists:', typeof window.initMap === 'function');
        console.log('- initGlobalMap function exists:', typeof window.initGlobalMap === 'function');
        
        // Check for API key issues in URL
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && script.src.includes('maps.googleapis.com')) {
                console.log('Found Google Maps script:', script.src);
            }
        });
    }
});
