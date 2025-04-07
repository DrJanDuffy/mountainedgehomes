// Google Maps initialization
let map;
let markers = [];
let infoWindow;

// Callback function for Google Maps API
function initMapsCallback() {
    // Check if the map element exists on this page
    if (document.getElementById('mountain-edge-map')) {
        // Delay initialization slightly to ensure DOM is ready
        setTimeout(initMap, 100);
    }
}

function initMap() {
    try {
        const mountainEdgeCoordinates = { lat: 36.0051, lng: -115.2552 };

        // Check if Google Maps is loaded
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded");
            document.getElementById('map-error').style.display = 'block';
            return;
        }

        // Initialize the map
        map = new google.maps.Map(document.getElementById("mountain-edge-map"), {
            zoom: 13,
            center: mountainEdgeCoordinates,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        // Create info window for markers
        infoWindow = new google.maps.InfoWindow();

        // Add main marker for Mountain's Edge
        addMarker(
            mountainEdgeCoordinates,
            "Mountain's Edge",
            "A beautiful master-planned community in southwest Las Vegas"
        );

        console.log("Map initialized successfully");

        // Set up map controls
        setupMapControls();
    } catch (error) {
        console.error("Error initializing map:", error);
        document.getElementById('map-error').style.display = 'block';
    }
}

function addMarker(position, title, content) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP
    });

    markers.push(marker);

    marker.addListener("click", () => {
        infoWindow.setContent(`<div class="info-window"><h3>${title}</h3><p>${content}</p></div>`);
        infoWindow.open(map, marker);
    });

    return marker;
}

function setupMapControls() {
    const mapButtons = document.querySelectorAll('.map-btn');

    mapButtons.forEach(button => {
        button.addEventListener('click', function() {
            const poiType = this.getAttribute('data-poi');
            showPointsOfInterest(poiType);

            // Toggle active class
            mapButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showPointsOfInterest(type) {
    // Clear existing POI markers
    clearMarkers();

    // Example POI data - in a real app, this would come from an API
    const poiData = {
        schools: [
            { position: { lat: 36.0021, lng: -115.2452 }, title: "Canarelli Middle School", content: "Top-rated middle school serving Mountain's Edge" },
            { position: { lat: 36.0121, lng: -115.2352 }, title: "Wright Elementary School", content: "Elementary school within the Mountain's Edge community" }
        ],
        parks: [
            { position: { lat: 36.0051, lng: -115.2652 }, title: "Exploration Peak Park", content: "2,800-acre park with hiking trails and picnic areas" },
            { position: { lat: 36.0151, lng: -115.2452 }, title: "Mountain's Edge Regional Park", content: "Large park with sports fields and recreation areas" }
        ],
        shopping: [
            { position: { lat: 36.0091, lng: -115.2352 }, title: "Mountain's Edge Marketplace", content: "Shopping center with restaurants and retail stores" },
            { position: { lat: 36.0181, lng: -115.2452 }, title: "Blue Diamond Marketplace", content: "Convenience shopping with everyday essentials" }
        ],
        restaurants: [
            { position: { lat: 36.0071, lng: -115.2552 }, title: "Settebello Pizzeria", content: "Authentic Neapolitan-style pizzeria" },
            { position: { lat: 36.0111, lng: -115.2452 }, title: "Hokkaido Teppanyaki", content: "Japanese hibachi and sushi restaurant" }
        ]
    };

    // Add markers for the selected POI type
    if (poiData[type]) {
        poiData[type].forEach(poi => {
            addMarker(poi.position, poi.title, poi.content);
        });
    }
}

function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];

    // Re-add main marker
    addMarker(
        { lat: 36.0051, lng: -115.2552 },
        "Mountain's Edge",
        "A beautiful master-planned community in southwest Las Vegas"
    );
}

//This function was kept from the original file because it handles map errors in a way that the edited code did not.
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

//This was kept because the edited code did not include a way to handle the case where the map failed to load.  This function provides a timeout to check for that.
window.addEventListener('load', function() {
    setTimeout(function() {
        const mapElement = document.getElementById('mountain-edge-map');
        if (mapElement && !mapElement.querySelector('iframe') && !mapElement.querySelector('canvas')) {
            document.getElementById('map-error').style.display = 'block';
        }
    }, 3000);
});