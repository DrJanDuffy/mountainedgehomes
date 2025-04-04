
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

// Initialize the map
function initMap() {
    // Create the map
    map = new google.maps.Map(document.getElementById("mountain-edge-map"), {
        center: mountainEdgeCenter,
        zoom: 14,
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

// Load the map when the window is fully loaded
window.addEventListener('load', function() {
    // Create fallback map content first
    const mapElement = document.getElementById('mountain-edge-map');
    
    // Define error handler for Google Maps authentication failures
    window.gm_authFailure = function() {
        if (mapElement) {
            document.getElementById('map-error').style.display = 'block';
            console.error('Google Maps authentication error');
        }
    };
    
    // Function to handle map script loading
    function loadMapScript() {
        if (typeof google === 'undefined') {
            // Create script element
            const script = document.createElement('script');
            
            // Use hardcoded coordinates if Google Maps fails to load
            if (mapElement) {
                // Add a basic static map as fallback using a div with styling 
                // that displays the Mountain Edge area
                mapElement.innerHTML += `
                    <div class="static-map-fallback" style="display: none; height: 100%; background-color: #f0f0f0; 
                        display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                        <h3>Mountain Edge, Las Vegas</h3>
                        <p>Coordinates: 36.0051°N, 115.2552°W</p>
                        <p>A beautiful master-planned community in southwest Las Vegas.</p>
                    </div>
                `;
            }
            
            // Load Maps API with your key
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDt84u_m6IGyrNZ9Eyc2W0fAIx6yD3peTo&callback=initMap';
            script.async = true;
            script.defer = true;
            
            // Handle script loading errors
            script.onerror = function() {
                if (mapElement) {
                    document.getElementById('map-error').style.display = 'block';
                    document.querySelector('.static-map-fallback').style.display = 'flex';
                    console.error('Failed to load Google Maps API');
                }
            };
            
            document.head.appendChild(script);
        } else {
            // Google Maps is already loaded, just initialize the map
            initMap();
        }
    }
    
    // Load the map
    loadMapScript();
});
