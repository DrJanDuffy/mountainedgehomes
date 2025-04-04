
// Property listings data
const properties = [
    {
        id: 1,
        title: "Spanish-Style Family Home",
        location: "Bella Monte, Enterprise, NV",
        price: "$625,000",
        bedrooms: 4,
        bathrooms: 3.5,
        area: "3,200",
        description: "Beautiful two-story Spanish-style home in the upscale gated Bella Monte community, featuring mountain views, gourmet kitchen, and private backyard. Enjoy community amenities including heated pool and playground.",
        image: "assets/images/property1.jpg",
        featured: true,
        year_built: "2008",
        neighborhood: "Bella Monte"
    },
    {
        id: 2,
        title: "Custom Mediterranean Estate",
        location: "Denali, Enterprise, NV",
        price: "$950,000",
        bedrooms: 5,
        bathrooms: 4.5,
        area: "4,500",
        description: "Spectacular semi-custom home in the premier gated Denali neighborhood. Features outdoor entertaining space, heated pool, and mountain views. One of Mountain's Edge standout communities.",
        image: "assets/images/property2.jpg",
        featured: true,
        year_built: "2006",
        neighborhood: "Denali"
    },
    {
        id: 3,
        title: "Single-Story Ranch Home",
        location: "Tularosa, Enterprise, NV",
        price: "$510,000",
        bedrooms: 3,
        bathrooms: 2.5,
        area: "2,100",
        description: "Charming single-story ranch with open floor plan, upgraded kitchen, and easy access to Exploration Peak Park. Tularosa is known for its convenient one-level living with homes up to 2,100 square feet.",
        image: "assets/images/property3.jpg",
        featured: true,
        year_built: "2010",
        neighborhood: "Tularosa"
    },
    {
        id: 4,
        title: "Spacious Family Home",
        location: "Chaco Canyon, Enterprise, NV",
        price: "$680,000",
        bedrooms: 5,
        bathrooms: 3,
        area: "3,800",
        description: "Beautiful family home in one of the largest non-gated subdivisions in Mountain's Edge. Chaco Canyon offers spacious homes from 1,500 to 3,800 square feet with generous floor plans and desert landscaping.",
        image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        year_built: "2007",
        neighborhood: "Chaco Canyon"
    },
    {
        id: 5,
        title: "Luxury Three-Story Home",
        location: "Azure Canyon, Enterprise, NV",
        price: "$775,000",
        bedrooms: 4,
        bathrooms: 3.5,
        area: "3,300",
        description: "Stunning three-story home in Azure Canyon featuring city and mountain views. This neighborhood is known for its unique three-story designs up to 3,300 square feet, offering ample space and spectacular vistas.",
        image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        year_built: "2009",
        neighborhood: "Azure Canyon"
    },
    {
        id: 6,
        title: "Low-Maintenance Townhouse",
        location: "Beacon Hill, Enterprise, NV",
        price: "$330,000",
        bedrooms: 3,
        bathrooms: 2.5,
        area: "2,300",
        description: "Modern townhouse in the gated Beacon Hill community offering low-maintenance living with access to community pool, park and fitness center. Perfect for first-time buyers or those looking to downsize.",
        image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        year_built: "2012",
        neighborhood: "Beacon Hill"
    }
];

// Function to generate property cards HTML
function generatePropertyCard(property) {
    return `
    <div class="property-card">
        <div class="property-image">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-price">${property.price}</div>
            ${property.neighborhood ? `<div class="property-neighborhood">${property.neighborhood}</div>` : ''}
        </div>
        <div class="property-details">
            <h3>${property.title}</h3>
            <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <div class="property-specs">
                <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                <span><i class="fas fa-ruler-combined"></i> ${property.area} Sq Ft</span>
                ${property.year_built ? `<span><i class="fas fa-calendar-alt"></i> ${property.year_built}</span>` : ''}
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
