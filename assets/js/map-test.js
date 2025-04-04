
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
            } else {
                console.error('Google API not loaded');
                alert('Google Maps API is not loaded. Check the console for details.');
                
                // Try to reload the maps API
                const script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDt84u_m6IGyrNZ9Eyc2W0fAIx6yD3peTo&callback=testMapCallback';
                script.async = true;
                script.defer = true;
                
                // Create a callback to test the API
                window.testMapCallback = function() {
                    console.log('Google Maps API loaded successfully via test');
                    alert('Google Maps API loaded successfully. Refresh the page to see maps.');
                };
                
                // Handle script loading errors
                script.onerror = function() {
                    console.error('Failed to load Google Maps API during test');
                    alert('Failed to load Google Maps API. Your API key may be invalid or restricted.');
                };
                
                document.head.appendChild(script);
            }
        });
        
        document.body.appendChild(testButton);
    }
});
