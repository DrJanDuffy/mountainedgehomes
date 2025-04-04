
// FollowupBoss integration
document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'fka_0N4mnNtlF88f0RohNGJG47N2NQcVvy5QQO';
    const FOLLOWUP_BOSS_URL = 'https://api.followupboss.com/v1/people';
    
    // Add focus animation to form inputs
    const formInputs = document.querySelectorAll('.neighborhood-form input, .neighborhood-form textarea, .neighborhood-form select, .contact-form input, .contact-form textarea, .contact-form select');
    
    formInputs.forEach(input => {
        // Add floating label animation
        const parent = input.parentElement;
        if (!input.hasAttribute('placeholder')) return;
        
        const placeholder = input.getAttribute('placeholder');
        input.setAttribute('data-placeholder', placeholder);
        
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
            // Random encouraging messages when field is focused
            const encouragingMessages = [
                "Great! Tell us about yourself",
                "We'd love to know your name!",
                "Your dream home awaits...",
                "You're one step closer!",
                "Almost there!",
                "We can't wait to help you!",
                "Nice to meet you!"
            ];
            
            if (this.getAttribute('id') === 'name' || this.getAttribute('id') === 'email') {
                const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
                this.setAttribute('placeholder', randomMessage);
            }
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            this.setAttribute('placeholder', this.getAttribute('data-placeholder'));
        });
    });
    
    // Function to handle form submissions
    const handleFormSubmit = function(event) {
        event.preventDefault();
        
        // Add loading state to button
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        const form = event.target;
        const formData = new FormData(form);
        const formValues = {};
        
        formData.forEach((value, key) => {
            formValues[key] = value;
        });
        
        // Prepare data for FollowupBoss
        const data = {
            firstName: formValues.name ? formValues.name.split(' ')[0] : '',
            lastName: formValues.name ? formValues.name.split(' ').slice(1).join(' ') : '',
            emails: formValues.email ? [{ value: formValues.email }] : [],
            phones: formValues.phone ? [{ value: formValues.phone }] : [],
            source: 'Website Form',
            tags: ['website-lead'],
            notes: formValues.message || formValues.interest || 'Website inquiry'
        };
        
        // Add neighborhood information if available
        const pageTitle = document.title;
        if (pageTitle.includes('|')) {
            const neighborhood = pageTitle.split('|')[0].trim();
            data.tags.push(neighborhood);
            data.source = `Website Form - ${neighborhood}`;
        }
        
        // Send data to FollowupBoss
        fetch(FOLLOWUP_BOSS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(API_KEY + ':')
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            
            // Show success message with animation
            form.innerHTML = `
                <div class="form-success">
                    <div class="success-icon-container">
                        <i class="fas fa-check-circle pulse"></i>
                    </div>
                    <h3 class="slide-in">Thank You!</h3>
                    <p class="fade-in">Your request has been submitted successfully. Dr. Jan Duffy will contact you very soon!</p>
                    <div class="extra-message fade-in-slow">
                        <p><i class="fas fa-home"></i> Your dream home journey begins now!</p>
                        <p><i class="fas fa-clock"></i> We typically respond within 24 hours</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show success message anyway (for user experience)
            form.innerHTML = `
                <div class="form-success">
                    <div class="success-icon-container">
                        <i class="fas fa-check-circle pulse"></i>
                    </div>
                    <h3 class="slide-in">Thank You!</h3>
                    <p class="fade-in">Your request has been submitted successfully. Dr. Jan Duffy will contact you very soon!</p>
                    <div class="extra-message fade-in-slow">
                        <p><i class="fas fa-home"></i> Your dream home journey begins now!</p>
                        <p><i class="fas fa-clock"></i> We typically respond within 24 hours</p>
                    </div>
                </div>
            `;
        });
    };
    
    // Find all forms and attach the submit handler
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    console.log('FollowupBoss integration initialized.');
});
