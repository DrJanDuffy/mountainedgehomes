document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background change on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(44, 62, 80, 0.9)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = 'var(--primary-color)';
            header.style.padding = '20px 0';
        }
    });

    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });

    // Simple property search functionality
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get search parameters
            const location = document.getElementById('location').value;
            const propertyType = document.getElementById('property-type').value;
            const priceRange = document.getElementById('price-range').value;

            // For demo purposes, just alert the search parameters
            alert(`Searching for ${propertyType || 'all properties'} in ${location || 'all locations'} with price range ${priceRange || 'any price'}`);

            // In a real application, you would:
            // 1. Send these parameters to a server
            // 2. Filter properties based on parameters
            // 3. Display filtered results
        });
    }

    // Simple form validation for contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (name === '' || email === '' || message === '') {
                alert('Please fill out all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // For demo purposes, just alert success
            alert('Thank you for your message. We will contact you soon!');
            contactForm.reset();

            // In a real application, you would:
            // 1. Send form data to a server
            // 2. Process the form submission
            // 3. Display success/error message
        });
    }

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
        });

        // Set up automatic slide transition
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'block';
        }, 5000);
    }

    // Initialize RealScout component
    setTimeout(() => {
        const realscoutElement = document.querySelector('realscout-office-listings');
        if (realscoutElement) {
            console.log('RealScout element found, initializing...');
        }
    }, 1000);
});