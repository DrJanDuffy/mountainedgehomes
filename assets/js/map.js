// Google Maps initialization
let map;
let markers = [];
const mountainEdgeCenter = { lat: 36.0051, lng: -115.2552 }; // Mountain Edge, Las Vegas coordinates

// Points of Interest data 
const pointsOfInterest = {
    schools: [
        { position: { lat: 36.0059, lng: -115.2501 }, title: "Carolyn S. Reedom Elementary School" },
        { position: { lat: 36.0142, lng: -115.2526 }, title: "Wright Elementary School" },
        { position: { lat: 36.0113, lng: -115.2363 }, title: "Tarkanian Middle School" }
    ],
    parks: [
        { position: { lat: 36.0024, lng: -115.2452 }, title: "Exploration Peak Park" },
        { position: { lat: 36.0127, lng: -115.2639 }, title: "Mountain's Edge Regional Park" },
        { position: { lat: 36.0067, lng: -115.2508 }, title: "Nathaniel Jones Park" }
    ],
    shopping: [
        { position: { lat: 36.0137, lng: -115.2370 }, title: "Mountain's Edge Marketplace" },
        { position: { lat: 36.0251, lng: -115.2419 }, title: "South Valley Shopping Center" },
        { position: { lat: 36.0136, lng: -115.2237 }, title: "Retail Plaza" }
    ],
    restaurants: [
        { position: { lat: 36.0138, lng: -115.2376 }, title: "Distill" },
        { position: { lat: 36.0141, lng: -115.2371 }, title: "Napoli Pizzeria" },
        { position: { lat: 36.0139, lng: -115.2368 }, title: "Thai BBQ" }
    ]
};

// Global maps initialization callback
function initMapsCallback() {
    console.log('Google Maps API loaded successfully');

    // Initialize maps if elements exist
    if (document.getElementById('mountain-edge-map')) {
        initMap();
    }

    if (document.getElementById('global-mountain-edge-map')) {
        initGlobalMap();
    }
}

// Initialize the main map
function initMap() {
    console.log('Initializing main map');
    const mapElement = document.getElementById("mountain-edge-map");
    if (!mapElement) return;

    try {
        // Create the map
        map = new google.maps.Map(mapElement, {
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

        // Set up map button event listeners
        document.querySelectorAll('.map-btn').forEach(button => {
            button.addEventListener('click', function() {
                const poiType = this.getAttribute('data-poi');
                showPointsOfInterest(poiType);

                // Toggle active class
                document.querySelectorAll('.map-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });

        console.log('Main map initialized successfully');
    } catch (error) {
        console.error('Error initializing main map:', error);
        showMapError(mapElement);
    }
}

// Show points of interest by type
function showPointsOfInterest(type) {
    // Clear existing markers
    clearMarkers();

    // Add new markers based on type
    if (pointsOfInterest[type]) {
        pointsOfInterest[type].forEach((poi, i) => {
            setTimeout(() => {
                addMarker(poi.position, poi.title, type);
            }, i * 200);
        });
    }
}

// Add a marker to the map
function addMarker(position, title, type) {
    // Set icon based on type
    let icon = {
        url: '',
        scaledSize: new google.maps.Size(30, 30)
    };

    switch(type) {
        case 'schools':
            icon.url = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            break;
        case 'parks':
            icon.url = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
            break;
        case 'shopping':
            icon.url = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
        case 'restaurants':
            icon.url = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
        default:
            icon.url = 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
    }

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: icon,
        animation: google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `<div class="info-window"><h3>${title}</h3><p>Point of interest in Mountain Edge</p></div>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// Function to show map error
function showMapError(element) {
    console.error('Showing map error');
    // Make sure the error element exists
    const errorElement = document.getElementById('map-error');
    if (errorElement) {
        errorElement.style.display = 'block';
    } else {
        // Create error element if it doesn't exist
        element.innerHTML = `
            <div id="map-error" style="text-align: center; padding: 20px;">
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
    const fallback = element.querySelector('.static-map-fallback');
    if (fallback) {
        fallback.style.display = 'flex';
    }
}

// Error handler for Google Maps authentication failures
window.gm_authFailure = function() {
    console.error('Google Maps authentication error');
    const mainMap = document.getElementById('mountain-edge-map');
    if (mainMap) showMapError(mainMap);

    const globalMap = document.getElementById('global-mountain-edge-map');
    if (globalMap) {
        const errorElement = document.getElementById('global-map-error');
        if (errorElement) errorElement.style.display = 'block';
    }
};

//This section was removed because the edited code provided a better implementation.  The original's window.addEventListener was redundant given the new structure.