
# Mountain Edge Homes Development Wiki

## Project Overview

Mountain Edge Homes is a specialized real estate website focused on the Mountain's Edge community in Las Vegas, Nevada. The site serves as a comprehensive resource for potential homebuyers and sellers in the 89178 zip code area.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Maps**: Google Maps API
- **Appointment Scheduling**: Calendly integration
- **Hosting**: Replit

## Site Structure

### Key Pages

- **Homepage** (`index.html`): Features property search, neighborhood highlights, and booking options
- **Neighborhood Pages**: Eight individual pages highlighting each Mountain's Edge neighborhood
- **Team Page**: Agent profiles and contact information
- **Blog**: Real estate articles and community information
- **Home Value**: Tool for homeowners to get property valuations

### Directory Structure

- `assets/css/`: Style sheets for the website
- `assets/js/`: JavaScript files for interactive features
- `assets/images/`: Website images and property photos

## Features Documentation

### Property Search

The property search functionality allows users to filter homes by:
- Price range
- Bedrooms/bathrooms
- Property type
- Neighborhood

### Google Maps Integration

The site uses Google Maps to display:
- Mountain's Edge boundaries
- Neighborhood locations
- Points of interest (schools, parks, shopping)

### Booking System

The booking system uses Calendly to allow users to schedule:
- Property showings
- Real estate consultations
- Virtual meetings

## Development Guidelines

### CSS Naming Conventions

We use BEM (Block Element Modifier) methodology for CSS classes:
- `.block`: Component container
- `.block__element`: Elements within components
- `.block--modifier`: Variations of components

### JavaScript Best Practices

- Use ES6 syntax where possible
- Organize code by feature/functionality
- Implement error handling for all API calls

### Environment Variables

Environment variables are used for:
- API keys
- External service credentials

## Maintenance

### Image Optimization

All images should be:
- Compressed appropriately for web
- Include descriptive alt text
- Have responsive versions where needed

### SEO Guidelines

Each page should have:
- Unique meta title and description
- Proper heading structure (H1, H2, etc.)
- Alt text for all images
- Structured data where applicable

## Future Development Roadmap

1. **Q2 2023**: Implement advanced property filtering
2. **Q3 2023**: Add virtual tour capabilities
3. **Q4 2023**: Integrate CRM system for lead tracking
4. **Q1 2024**: Develop mobile app version

## Troubleshooting

### Common Issues

- **Maps not loading**: Check Google Maps API key in environment variables
- **Images not displaying**: Verify path references and image optimization
- **Booking calendar issues**: Verify Calendly integration settings

## Contact

For questions about the codebase, contact the development team at dev@mountainedgehomes.com
