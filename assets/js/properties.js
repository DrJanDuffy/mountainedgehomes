
// Property listings data
const properties = [
    {
        id: 1,
        title: "Mountain View Estate",
        location: "Aspen, CO",
        price: "$2,450,000",
        bedrooms: 5,
        bathrooms: 4.5,
        area: "4,200",
        description: "Stunning mountain estate with panoramic views, gourmet kitchen, and luxury finishes throughout.",
        image: "assets/images/property1.jpg",
        featured: true
    },
    {
        id: 2,
        title: "Eagle's Nest Retreat",
        location: "Vail, CO",
        price: "$3,200,000",
        bedrooms: 6,
        bathrooms: 5.5,
        area: "5,500",
        description: "Spectacular mountain home with floor-to-ceiling windows, home theater, and outdoor entertaining spaces.",
        image: "assets/images/property2.jpg",
        featured: true
    },
    {
        id: 3,
        title: "Alpine Timber Lodge",
        location: "Telluride, CO",
        price: "$1,850,000",
        bedrooms: 4,
        bathrooms: 3.5,
        area: "3,800",
        description: "Charming timber frame lodge with stone fireplace, chef's kitchen, and private hot tub on deck.",
        image: "assets/images/property3.jpg",
        featured: true
    },
    {
        id: 4,
        title: "Snowcapped Chalet",
        location: "Park City, UT",
        price: "$2,750,000",
        bedrooms: 5,
        bathrooms: 4,
        area: "4,100",
        description: "Luxurious ski-in/ski-out chalet with magnificent mountain views and custom interior design.",
        image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false
    },
    {
        id: 5,
        title: "Ridgeline Residence",
        location: "Aspen, CO",
        price: "$4,100,000",
        bedrooms: 7,
        bathrooms: 6.5,
        area: "6,200",
        description: "Contemporary mountain mansion with smart home features, wine cellar, and panoramic valley views.",
        image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false
    },
    {
        id: 6,
        title: "Creekside Cabin",
        location: "Telluride, CO",
        price: "$1,250,000",
        bedrooms: 3,
        bathrooms: 2,
        area: "2,400",
        description: "Cozy mountain cabin with authentic rustic charm, located alongside a peaceful mountain creek.",
        image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false
    }
];

// Function to generate property cards HTML
function generatePropertyCard(property) {
    return `
    <div class="property-card">
        <div class="property-image">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-price">${property.price}</div>
        </div>
        <div class="property-details">
            <h3>${property.title}</h3>
            <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <div class="property-specs">
                <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                <span><i class="fas fa-ruler-combined"></i> ${property.area} Sq Ft</span>
            </div>
            <p class="property-description">${property.description}</p>
            <a href="property-details.html?id=${property.id}" class="btn btn-secondary">View Details</a>
        </div>
    </div>
    `;
}

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { properties, generatePropertyCard };
}
