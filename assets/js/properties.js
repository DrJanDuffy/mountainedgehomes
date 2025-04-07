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
        image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
    // Extract high-res version for srcset if available
    const highResImage = property.highResImage || property.image;

    return `
    <div class="property-card">
        <div class="property-image image-container image-hover-zoom">
            ${property.featured ? '<div class="featured-tag">Featured</div>' : ''}
            <img 
                src="assets/images/property-placeholder.jpg" 
                data-src="${property.image}" 
                data-srcset="${highResImage} 2x" 
                alt="${property.title} - ${property.description || 'Beautiful property in Mountain\'s Edge'}" 
                class="optimized-image" 
                width="800" 
                height="600"
                loading="lazy">
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

// Function to initialize property listings
function initializePropertyListings() {
    // Handle featured properties display
    const featuredPropertiesContainer = document.getElementById('featured-properties');
    if (featuredPropertiesContainer) {
        // Filter to get only featured properties
        const featuredProperties = properties.filter(property => property.featured);
        
        // Generate HTML for featured properties
        let featuredHTML = '';
        featuredProperties.forEach(property => {
            featuredHTML += generatePropertyCard(property);
        });
        
        // Insert properties into container
        featuredPropertiesContainer.innerHTML = featuredHTML;
    }
}

// Initialize property listings when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePropertyListings();
});

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = { properties, generatePropertyCard };
}
//Assuming this is where the select element is located.  Adjust as needed.
const neighborhoodSelectElement = document.getElementById('neighborhood-select'); //replace 'neighborhood-select' with the actual id of your select element.
if (neighborhoodSelectElement) {
    neighborhoodSelectElement.innerHTML = `
<option value="">All Neighborhoods</option>
                        <option value="alpian-meadows">Alpian Meadows</option>
                        <option value="alturas">Alturas</option>
                        <option value="arlington-ranch">Arlington Ranch</option>
                        <option value="aspire">Aspire (gated)</option>
                        <option value="azure-canyon">Azure Canyon/Versante</option>
                        <option value="beacon-hill">Beacon Hill</option>
                        <option value="blue-diamond-springs">Blue Diamond Springs</option>
                        <option value="cascade">Cascade at Mountain Pass (guard-gated)</option>
                        <option value="cattara">Cattara</option>
                        <option value="chaco-canyon">Chaco Canyon</option>
                        <option value="coldwater-crossing">Coldwater Crossing</option>
                        <option value="collina">Collina (gated)</option>
                        <option value="denali">Denali</option>
                        <option value="jasmine-falls">Jasmine Falls</option>
                        <option value="las-colinas">Las Colinas</option>
                        <option value="los-serranos">Los Serranos</option>
                        <option value="madera">Madera</option>
                        <option value="mandolin">Mandolin</option>
                        <option value="maravilla">Maravilla</option>
                        <option value="mesa-valla">Mesa/Valla (gated)</option>
                        <option value="mirasol">Mirasol</option>
                        <option value="montelano">Montelano (gated)</option>
                        <option value="montecito">Montecito</option>
                        <option value="monterey-ranch">Monterey Ranch</option>
                        <option value="pyrenees">Pyrenees At Mountain Pass</option>
                        <option value="quintessa">Quintessa (gated)</option>
                        <option value="rio-vista">Rio Vista</option>
                        <option value="rivendell">Rivendell</option>
                        <option value="rockdale">Rockdale</option>
                        <option value="sage-canyon">Sage Canyon</option>
                        <option value="san-gabriel">San Gabriel (gated)</option>
                        <option value="serenada">Serenada/Mountains Edge Pod 135</option>
                        <option value="sierra-madre">Sierra Madre (gated)</option>
                        <option value="silver-hills">Silver Hills</option>
                        <option value="sonoma-summit">Sonoma Summit</option>
                        <option value="south-mountain">South Mountain</option>
                        <option value="sterling-ridge">Sterling Ridge</option>
                        <option value="stonebridge">Stonebridge (gated)</option>
                        <option value="stonehurst">Stonehurst</option>
                        <option value="sutter">Sutter</option>
                        <option value="sutter-point">Sutter Point</option>
                        <option value="tierra-vista">Tierra Vista</option>
                        <option value="tularosa">Tularosa/Pod 227</option>
                        <option value="tuscalante">Tuscalante/Mountains Edge Pod 211</option>
                        <option value="via-valencia">Via Valencia</option>
                        <option value="willow-creek">Willow Creek</option>
                        <option value="yellowstone">Yellowstone</option>
`;
}