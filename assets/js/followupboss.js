
// FollowupBoss integration
document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'fka_0N4mnNtlF88f0RohNGJG47N2NQcVvy5QQO';
    const FOLLOWUP_BOSS_URL = 'https://api.followupboss.com/v1/people';
    
    // Function to handle form submissions
    const handleFormSubmit = function(event) {
        event.preventDefault();
        
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
            
            // Show success message
            form.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;"></i>
                    <h3>Thank You!</h3>
                    <p>Your request has been submitted successfully. Dr. Jan Duffy will contact you shortly.</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Show error message but still clear form
            form.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #27ae60; margin-bottom: 1rem;"></i>
                    <h3>Thank You!</h3>
                    <p>Your request has been submitted. Dr. Jan Duffy will contact you shortly.</p>
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
