
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Calendly popup functionality
    const bookingButtons = document.querySelectorAll('.btn-book-now');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const calendlyUrl = this.getAttribute('data-calendly-url');
            
            if (calendlyUrl) {
                Calendly.initPopupWidget({
                    url: calendlyUrl
                });
            }
        });
    });

    // Add animation to booking cards
    const bookingCards = document.querySelectorAll('.booking-card');
    
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
    
    bookingCards.forEach(card => {
        observer.observe(card);
    });
});
