
// Global Map initialization
window.addEventListener('load', function() {
    // Check if the global map element exists on this page
    const mapElement = document.getElementById('global-mountain-edge-map');
    if (!mapElement) return;
    
    // Hide error initially
    const errorElement = document.getElementById('global-map-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    // Define Mountain Edge coordinates
    const mountainEdgeCenter = { lat: 36.0051, lng: -115.2552 };
    
    // Function to show map error
    function showMapError() {
        if (errorElement) {
            errorElement.style.display = 'block';
        } else {
            // Create error element if it doesn't exist
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
        
        // Show fallback if it exists
        const fallback = mapElement.querySelector('.static-map-fallback');
        if (fallback) {
            fallback.style.display = 'flex';
        }
    }
    
    // Define error handler for Google Maps authentication failures
    if (!window.gm_authFailure) {
        window.gm_authFailure = function() {
            console.error('Google Maps authentication error');
            showMapError();
        };
    }
    
    // Function to handle map script loading
    function loadMapScript() {
        if (typeof google === 'undefined') {
            // Create script element
            const script = document.createElement('script');
            
            // Add a basic static map as fallback using a div with styling 
            mapElement.innerHTML += `
                <div class="static-map-fallback" style="display: none; height: 100%; background-color: #f0f0f0; 
                    display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                    <h3>Mountain Edge, Las Vegas</h3>
                    <p>Coordinates: 36.0051°N, 115.2552°W</p>
                    <p>A beautiful master-planned community in southwest Las Vegas.</p>
                </div>
            `;
            
            // Load Maps API with your key
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDt84u_m6IGyrNZ9Eyc2W0fAIx6yD3peTo&callback=initGlobalMap';
            script.async = true;
            script.defer = true;
            
            // Handle script loading errors
            script.onerror = function() {
                console.error('Failed to load Google Maps API');
                showMapError();
            };
            
            // Set a timeout to show error if maps doesn't load within 10 seconds
            const mapTimeout = setTimeout(function() {
                if (typeof google === 'undefined') {
                    console.error('Google Maps API timeout');
                    showMapError();
                }
            }, 10000);
            
            document.head.appendChild(script);
        } else {
            // Google Maps is already loaded, just initialize the map
            initGlobalMap();
        }
    }
    
    // Load the map
    loadMapScript();
    
    // Log for debugging
    console.log('Global map initialization attempted');
});

// Initialize the global map
function initGlobalMap() {
    const mountainEdgeCenter = { lat: 36.0051, lng: -115.2552 };
    const mapElement = document.getElementById('global-mountain-edge-map');
    
    if (!mapElement || typeof google === 'undefined') return;
    
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
}
