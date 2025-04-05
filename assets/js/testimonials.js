
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Maps
    if (typeof initGlobalMap === 'function') {
        initGlobalMap();
    }

    // Animation for testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card, .community-testimonial, .video-testimonial');
    
    if (testimonialCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        testimonialCards.forEach(card => {
            card.classList.add('animate-section');
            observer.observe(card);
        });
    }

    // Handle Google Review submission button
    const reviewButtons = document.querySelectorAll('.btn-review');
    
    reviewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track the click event (you can add analytics here)
            console.log('Review button clicked');
            
            // Continue with the default action (opening the link)
            // The link opens in a new tab due to target="_blank"
        });
    });

    // Display current Google Review count by fetching it dynamically
    // Note: This would require actual integration with Google's API
    // This is a placeholder function
    function updateGoogleReviewStats() {
        // In a real implementation, you would fetch this data from Google's API
        const staticReviewCount = 87;
        const staticRating = 4.9;
        
        const ratingCountElement = document.querySelector('.rating-count');
        if (ratingCountElement) {
            ratingCountElement.textContent = `Based on ${staticReviewCount} reviews`;
        }
        
        const ratingNumberElement = document.querySelector('.rating-number');
        if (ratingNumberElement) {
            ratingNumberElement.textContent = staticRating;
        }
    }
    
    updateGoogleReviewStats();
    
    // Add Rich Snippets for SEO
    function addRichSnippets() {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        
        // Aggregate rating schema for the business
        const jsonData = {
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Mountain Edge Homes",
            "image": "https://mountainedgehomes.com/assets/images/logo.jpg",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "8015 Blue Diamond Rd",
                "addressLocality": "Las Vegas",
                "addressRegion": "NV",
                "postalCode": "89178",
                "addressCountry": "US"
            },
            "telephone": "(702) 919-5002",
            "url": "https://mountainedgehomes.com",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "87"
            },
            "review": [
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Amanda Parker"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5"
                    },
                    "datePublished": "2023-01-15",
                    "reviewBody": "Dr. Jan's knowledge of Mountain's Edge is truly impressive. She found us our dream home in a competitive market and negotiated a great price."
                },
                {
                    "@type": "Review",
                    "author": {
                        "@type": "Person",
                        "name": "Michael Thompson"
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "5"
                    },
                    "datePublished": "2023-02-03",
                    "reviewBody": "The team at Mountain Edge Homes went above and beyond when selling our property. We had multiple offers within days and sold for well above asking price!"
                }
            ]
        };
        
        script.textContent = JSON.stringify(jsonData);
        document.head.appendChild(script);
    }
    
    addRichSnippets();
});
// Testimonials Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Preload randomuser.me images to prevent flicker on load
    const testimonialsImages = [
        'https://randomuser.me/api/portraits/couples/68.jpg',
        'https://randomuser.me/api/portraits/women/54.jpg',
        'https://randomuser.me/api/portraits/couples/32.jpg',
        'https://randomuser.me/api/portraits/men/42.jpg',
        'https://randomuser.me/api/portraits/women/36.jpg',
        'https://randomuser.me/api/portraits/men/47.jpg',
        'https://randomuser.me/api/portraits/couples/23.jpg',
        'https://randomuser.me/api/portraits/women/33.jpg',
        'https://randomuser.me/api/portraits/men/52.jpg'
    ];
    
    // Preload images
    testimonialsImages.forEach(imgSrc => {
        const img = new Image();
        img.src = imgSrc;
    });
    
    // Fade in testimonial cards with a staggered effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 150);
    });
    
    // Add hover effect to video testimonials
    const videoTestimonials = document.querySelectorAll('.video-testimonial');
    videoTestimonials.forEach(video => {
        video.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            this.style.transition = 'all 0.3s ease';
        });
        
        video.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Handle Google review "Write a Review" button click
    const writeReviewBtn = document.querySelector('.btn-review');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function(e) {
            // Analytics tracking could be added here
            console.log('Review button clicked');
        });
    }
    
    // Handle CTA buttons
    const ctaButtons = document.querySelectorAll('.testimonial-cta .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Analytics tracking could be added here
            console.log('CTA button clicked: ' + this.textContent.trim());
        });
    });
});
