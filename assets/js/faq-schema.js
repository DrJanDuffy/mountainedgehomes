
document.addEventListener('DOMContentLoaded', function() {
    // Create FAQ Schema for Voice Search Optimization
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What areas of Las Vegas does Mountain Edge Homes serve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain Edge Homes specializes in the Mountain's Edge community in southwest Las Vegas, particularly the 89178 zip code. We also serve Enterprise, Spring Valley, and surrounding neighborhoods in Clark County, Nevada."
                }
            },
            {
                "@type": "Question",
                "name": "What is the average home price in Mountain's Edge Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The average home price in Mountain's Edge is approximately $750,000, though prices can range from $500,000 to over $1.5 million depending on the specific neighborhood, home size, and features."
                }
            },
            {
                "@type": "Question",
                "name": "Which neighborhoods are part of Mountain's Edge in Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain's Edge includes eight distinctive neighborhoods: Aspire, Cascade at Mountain Pass, Collina, Mesa/Valla, Montelano, Quintessa, San Gabriel, and Sierra Madre. Each offers unique home styles and community amenities."
                }
            },
            {
                "@type": "Question",
                "name": "How do I schedule a home showing in Mountain's Edge?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can schedule a home showing by using our online booking system at mountainedgehomes.com/index.html#booking, calling us at (702) 919-5002, or emailing DrJanSells@MountainEdgeHomes.com. We offer various appointment types including in-person showings, virtual tours, and open house visits."
                }
            },
            {
                "@type": "Question",
                "name": "What real estate services does Mountain Edge Homes provide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain Edge Homes provides comprehensive real estate services including home buying guidance, property selling, investment property consulting, and property management specifically for the Mountain's Edge community and surrounding Las Vegas neighborhoods."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find out what my Mountain's Edge home is worth?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can get an instant home value estimate by using our free valuation tool at mountainedgehomes.com/home-value.html. For a more comprehensive analysis, you can schedule a personalized home valuation consultation with one of our Mountain's Edge specialists."
                }
            },
            {
                "@type": "Question",
                "name": "What are the best schools near Mountain's Edge Las Vegas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Mountain's Edge is served by several highly-rated schools including Wright Elementary School, Faiss Middle School, and Sierra Vista High School. There are also several private and charter school options nearby including Pinecrest Academy and American Preparatory Academy."
                }
            }
        ]
    };
    
    // Add FAQ schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
});
