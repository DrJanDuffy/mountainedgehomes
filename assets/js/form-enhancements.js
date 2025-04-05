
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced forms
    initializeEnhancedForms();
    
    // Form validation
    setupFormValidation();
    
    // Handle form submissions
    setupFormSubmissions();
});

function initializeEnhancedForms() {
    // Add focus/blur effects for inputs
    const formInputs = document.querySelectorAll('.enhanced-form input, .enhanced-form textarea, .enhanced-form select');
    
    formInputs.forEach(input => {
        // Add focus class to parent on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        // Remove focus class from parent on blur
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            
            // Add has-value class if the input has a value
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Check initial state
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
    });
    
    // Initialize custom select boxes
    initCustomSelects();
}

function setupFormValidation() {
    const forms = document.querySelectorAll('.enhanced-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                // Custom validation on blur
                input.addEventListener('blur', function() {
                    validateInput(this);
                });
                
                // Remove error on focus
                input.addEventListener('focus', function() {
                    this.classList.remove('input-error');
                    
                    // Remove error message if it exists
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                });
            }
        });
    });
}

function validateInput(input) {
    let isValid = true;
    let errorMessage = '';
    
    // Check if input is empty
    if (input.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
            if (input.value.trim() !== '' && !phoneRegex.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
    }
    
    // Update UI based on validation
    if (!isValid) {
        input.classList.add('input-error');
        
        // Add error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (!existingError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            input.parentElement.appendChild(errorElement);
        }
    } else {
        input.classList.remove('input-error');
        
        // Remove error message if it exists
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    return isValid;
}

function setupFormSubmissions() {
    const forms = document.querySelectorAll('.enhanced-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required inputs
            const requiredInputs = form.querySelectorAll('[required]');
            let formIsValid = true;
            
            requiredInputs.forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });
            
            if (formIsValid) {
                // Add loading state to button
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Here you would normally send the form data to your server
                // For this example, we'll simulate a successful submission
                setTimeout(() => {
                    // Show success message
                    showFormMessage(form, 'success', 'Thank you! Your message has been sent successfully.');
                    
                    // Reset form
                    form.reset();
                    
                    // Restore button
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1000);
                }, 1500);
            }
        });
    });
}

function showFormMessage(form, type, message) {
    const messageElement = form.querySelector('.form-message');
    
    if (messageElement) {
        messageElement.className = 'form-message ' + type;
        messageElement.innerHTML = type === 'success' 
            ? `<i class="fas fa-check-circle"></i> ${message}`
            : `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        messageElement.style.display = 'flex';
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide the message after some time
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
}

function initCustomSelects() {
    const selects = document.querySelectorAll('.enhanced-form select:not(.initialized)');
    
    selects.forEach(select => {
        select.classList.add('initialized');
        
        // Add change listener to update styling based on selection
        select.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Check initial state
        if (select.value) {
            select.classList.add('has-value');
        }
    });
}
