document.addEventListener('DOMContentLoaded', function() {
    // Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        // Set up automatic slide transition
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'block';
        }, 5000);
    }

    // Animate sections on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('animate-section');
        observer.observe(section);
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize RealScout component
    window.addEventListener('load', function() {
        console.log('Window loaded');
        // Check if the RealScout component exists on the page
        const realscoutElement = document.querySelector('realscout-office-listings');

        if (realscoutElement) {
            console.log('RealScout element found');
            // Force a refresh of the component by removing and re-adding it
            const parent = realscoutElement.parentNode;
            const clone = realscoutElement.cloneNode(true);
            parent.removeChild(realscoutElement);
            setTimeout(() => {
                parent.appendChild(clone);
                console.log('RealScout component refreshed');
            }, 500);
        } else {
            console.log('RealScout element not found');
        }
    });
    
    // Form submission handling is now in followupboss.js
});