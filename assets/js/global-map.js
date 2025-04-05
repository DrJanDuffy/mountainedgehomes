// Global Map initialization
window.addEventListener('load', function() {
    // Check if the global map element exists on this page
    const mapElement = document.getElementById('global-mountain-edge-map');
    if (!mapElement) return;
    
    console.log('Global map element found');
    
    // Function to handle map script loading
    function loadGlobalMapScript() {
        console.log('Attempting to load Google Maps API for global map');
        
        // First add fallback regardless of script loading status
        if (!mapElement.querySelector('.static-map-fallback')) {
            mapElement.insertAdjacentHTML('beforeend', `
                <div class="static-map-fallback" style="display: none; height: 100%; background-color: #f0f0f0; 
                    display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                    <h3>Mountain Edge, Las Vegas</h3>
                    <p>Coordinates: 36.0051°N, 115.2552°W</p>
                    <p>A beautiful master-planned community in southwest Las Vegas.</p>
                </div>
            `);
        }
        
        // Check if Google Maps API is already loaded
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
            console.log('Google Maps API already loaded, initializing global map');
            initGlobalMap();
            return;
        }
        
        // Set flag to prevent duplicate loading
        window.googleMapsLoading = true;
        
        // Create script element
        const script = document.createElement('script');
        
        // Load Maps API with your key from environment variables
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initGlobalMap`;
        script.async = true;
        script.defer = true;
        
        // Handle script loading errors
        script.onerror = function() {
            console.error('Failed to load Google Maps API for global map');
            window.googleMapsLoading = false;
            showGlobalMapError();
        };
        
        // Set a timeout to show error if maps doesn't load within 10 seconds
        const mapTimeout = setTimeout(function() {
            if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
                console.error('Google Maps API timeout for global map');
                window.googleMapsLoading = false;
                showGlobalMapError();
            }
        }, 10000);
        
        // Add script to page
        document.head.appendChild(script);
        
        console.log('Google Maps script added to head for global map');
    }
    
    // Try to load the map after a short delay to ensure the DOM is ready
    setTimeout(loadGlobalMapScript, 1000);
    
    // Log for debugging
    console.log('Global map initialization scheduled');
});

// Function to show global map error
function showGlobalMapError() {
    console.error('Showing global map error');
    const errorElement = document.getElementById('global-map-error');
    if (errorElement) {
        errorElement.style.display = 'block';
    } else {
        const mapElement = document.getElementById('global-mountain-edge-map');
        if (mapElement) {
            mapElement.innerHTML = `
                <div id="global-map-error" style="text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 32px; color: #e74c3c; margin-bottom: 15px;"></i>
                    <h3>Map Loading Error</h3>
                    <p>We're having trouble loading the map. Please try again later.</p>
                    <div style="margin-top: 15px; font-size: 14px; color: #666;">
                        <p><strong>Mountain Edge Location:</strong> 36.0051°N, 115.2552°W</p>
                        <p>A beautiful master-planned community in southwest Las Vegas.</p>
                    </div>
                </div>
            `;
        }
    }

    // Show fallback if it exists
    const mapElement = document.getElementById('global-mountain-edge-map');
    if (mapElement) {
        const fallback = mapElement.querySelector('.static-map-fallback');
        if (fallback) {
            fallback.style.display = 'flex';
        }
    }
}

// Initialize the global map
function initGlobalMap() {
    console.log('Initializing global map');
    const mountainEdgeCenter = { lat: 36.0051, lng: -115.2552 };
    const mapElement = document.getElementById('global-mountain-edge-map');

    if (!mapElement) {
        console.log('Global map element not found');
        return;
    }

    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error('Google Maps API not available for global map');
        showGlobalMapError();
        return;
    }

    try {
        // Create the map
        const map = new google.maps.Map(mapElement, {
            center: mountainEdgeCenter,
            zoom: 12,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            styles: [
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "simplified" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#a3ccff" }],
                },
            ],
        });

        // Add Mountain Edge boundary overlay
        const mountainEdgeBoundary = [
            { lat: 36.0227, lng: -115.2697 },
            { lat: 36.0227, lng: -115.2365 },
            { lat: 35.9932, lng: -115.2365 },
            { lat: 35.9932, lng: -115.2697 },
            { lat: 36.0227, lng: -115.2697 }
        ];

        const mountainEdgePolygon = new google.maps.Polygon({
            paths: mountainEdgeBoundary,
            strokeColor: "#FF9800",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FFC107",
            fillOpacity: 0.1,
        });
        mountainEdgePolygon.setMap(map);

        // Add Mountain Edge center marker
        new google.maps.Marker({
            position: mountainEdgeCenter,
            map: map,
            title: "Mountain Edge",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4CAF50",
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: "#fff"
            },
            animation: google.maps.Animation.DROP
        });

        console.log('Global map initialized successfully');
    } catch (error) {
        console.error('Error initializing global map:', error);
        showGlobalMapError();
    }
}

// Define error handler for Google Maps authentication failures
if (!window.gm_authFailure) {
    window.gm_authFailure = function() {
        console.error('Google Maps authentication error');
        showGlobalMapError();
    };
}