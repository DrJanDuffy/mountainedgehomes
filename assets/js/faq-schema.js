
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
/**
 * FAQ Schema Generator
 * Creates structured data for frequently asked questions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Define FAQs for the main site
    const mountainsEdgeFaqs = [
        {
            question: "What are the average home prices in Mountain's Edge?",
            answer: "The average home price in Mountain's Edge is approximately $750,000, with properties ranging from $500,000 to over $1.5 million depending on size, location, and amenities."
        },
        {
            question: "What amenities are available in the Mountain's Edge community?",
            answer: "Mountain's Edge features numerous amenities including community parks, hiking trails, picnic areas, playgrounds, sports courts, and the 2,800-acre Exploration Peak Park with mountain views and recreational facilities."
        },
        {
            question: "How are the schools in Mountain's Edge Las Vegas?",
            answer: "Mountain's Edge is served by highly-rated schools in the Clark County School District, including several within the community itself. Many families choose Mountain's Edge specifically for its quality educational options."
        },
        {
            question: "Is Mountain's Edge a good investment area?",
            answer: "Mountain's Edge has consistently shown strong property value appreciation, making it an excellent investment area in Las Vegas. The master-planned community's amenities, location, and continued development contribute to its investment potential."
        },
        {
            question: "What is the HOA fee structure in Mountain's Edge?",
            answer: "HOA fees in Mountain's Edge typically range from $50-150 per month depending on the specific neighborhood. These fees cover maintenance of common areas, community amenities, and neighborhood security features."
        }
    ];
    
    // Only create FAQ schema on relevant pages
    const path = window.location.pathname;
    if (path === '/' || path.includes('index.html') || path.includes('neighborhood-')) {
        createFaqSchema(mountainsEdgeFaqs);
    }
    
    // Create and add FAQ schema to the page
    function createFaqSchema(faqItems) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
        
        // Add schema to the page
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(script);
        
        console.log('[SEO] Added FAQ schema with', faqItems.length, 'questions');
    }
});
