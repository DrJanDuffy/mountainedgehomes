
document.addEventListener('DOMContentLoaded', function() {
    // Get the current neighborhood from the HTML filename
    const pagePath = window.location.pathname;
    const pageFilename = pagePath.substring(pagePath.lastIndexOf('/') + 1);
    
    // Extract neighborhood name from filename (e.g., neighborhood-aspire.html -> aspire)
    let neighborhoodName = pageFilename.replace('neighborhood-', '').replace('.html', '');
    
    // Format neighborhood name for display (replace hyphens with spaces and capitalize)
    let formattedName = neighborhoodName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Update page title and subtitle
    document.querySelectorAll('.neighborhood-title').forEach(el => {
        el.textContent = formattedName;
    });
    
    document.title = formattedName + ' | Mountain Edge Homes';
    
    // Update property listings
    const propertiesContainer = document.getElementById('neighborhood-properties');
    if (propertiesContainer) {
        // Filter properties for this neighborhood
        const neighborhoodProperties = properties.filter(property => {
            // Replace spaces with hyphens and make lowercase for comparison
            const propNeighborhood = property.neighborhood.toLowerCase().replace(/\s+/g, '-');
            return propNeighborhood === neighborhoodName;
        });
        
        if (neighborhoodProperties.length > 0) {
            propertiesContainer.innerHTML = neighborhoodProperties.map(property => 
                generatePropertyCard(property)
            ).join('');
        } else {
            propertiesContainer.innerHTML = `
                <div class="no-properties">
                    <p>There are currently no properties available in ${formattedName}.</p>
                    <p>Please check back soon or <a href="index.html#contact">contact us</a> for upcoming listings.</p>
                </div>
            `;
        }
    }
});
