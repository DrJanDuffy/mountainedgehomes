
document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Initialize first accordion item as active
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message with animation
            const formParent = contactForm.parentElement;
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! Dr. Jan Duffy will contact you shortly.';
            
            formParent.appendChild(successMessage);
            
            // Reset form and remove message after delay
            contactForm.reset();
            setTimeout(() => {
                successMessage.classList.add('fade-out');
                setTimeout(() => {
                    formParent.removeChild(successMessage);
                }, 500);
            }, 4000);
        });
    }
    
    // Add animated stars to review cards
    const reviewStars = document.querySelectorAll('.review-stars');
    reviewStars.forEach(starsContainer => {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.animationDelay = `${i * 0.1}s`;
            star.classList.add('animated-star');
            starsContainer.appendChild(star);
        }
    });
    
    // Gallery image hover effect
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('p');
        
        item.addEventListener('mouseenter', () => {
            caption.classList.add('caption-hover');
        });
        
        item.addEventListener('mouseleave', () => {
            caption.classList.remove('caption-hover');
        });
    });
    
    // Add smooth scroll for navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.profile-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.8) {
                section.classList.add('visible');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Scroll to top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    const handleScrollBtnVisibility = () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    };
    
    window.addEventListener('scroll', handleScrollBtnVisibility);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize visibility check
    handleScrollBtnVisibility();
});
