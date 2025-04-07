document.addEventListener('DOMContentLoaded', function() {
    // Initialize RealScout components with improved error handling
    initializeRealScoutComponents();

    // Lazy load images when they come into view
    initializeLazyLoading();

    // Set up basic interactivity
    setupEventListeners();

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
            header.style.background = 'rgba(10, 37, 64, 0.95)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = 'var(--primary-dark)';
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

    // Advanced property search functionality with debounce
    const searchForm = document.querySelector('.search-form');
    const searchToggle = document.getElementById('search-toggle');
    const advancedFields = document.querySelector('.advanced-fields');

    if (searchToggle && advancedFields) {
        // Initially hide advanced fields
        advancedFields.style.display = 'none';

        searchToggle.addEventListener('click', function() {
            const isExpanded = advancedFields.style.display !== 'none';
            advancedFields.style.display = isExpanded ? 'none' : 'grid';

            // Update toggle button text and icon
            searchToggle.innerHTML = isExpanded ?
                'Advanced Search <i class="fas fa-chevron-down"></i>' :
                'Simple Search <i class="fas fa-chevron-up"></i>';
        });
    }

    // Debounce function for search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Setup address autocomplete with debounce
    const addressInput = document.getElementById('location');
    if (addressInput) {
        // Cache for search results to minimize API calls
        const searchCache = {};

        const performSearch = debounce(function(query) {
            // Check cache first
            if (searchCache[query]) {
                displaySearchResults(searchCache[query]);
                return;
            }

            // In a real implementation, this would call an API
            console.log('Searching for:', query);

            // Mock results for demonstration
            const mockResults = [
                { address: query + ' Main St, Las Vegas, NV 89178' },
                { address: query + ' Park Ave, Las Vegas, NV 89178' },
                { address: query + ' Mountain View, Las Vegas, NV 89178' }
            ];

            // Cache the results
            searchCache[query] = mockResults;

            // Display results
            displaySearchResults(mockResults);
        }, 1500); // 1.5 second debounce

        addressInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                performSearch(query);
            }
        });

        function displaySearchResults(results) {
            console.log('Search results:', results);
            // In a real implementation, display results in a dropdown
        }
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get search parameters
            const location = document.getElementById('location')?.value;
            const propertyType = document.getElementById('property-type')?.value;
            const priceRange = document.getElementById('price-range')?.value;
            const minBeds = document.getElementById('min-beds')?.value;
            const minBaths = document.getElementById('min-baths')?.value;
            const maxPrice = document.getElementById('max-price')?.value;

            // For demo purposes, just log the search parameters
            console.log('Search parameters:', {
                location: location || 'any',
                propertyType: propertyType || 'any',
                priceRange: priceRange || 'any',
                minBeds: minBeds || 'any',
                minBaths: minBaths || 'any',
                maxPrice: maxPrice || 'any'
            });

            // Simulate search result loading
            const propertiesSection = document.getElementById('properties');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({ behavior: 'smooth' });

                // Add loading state
                const propertiesGrid = propertiesSection.querySelector('.properties-grid');
                if (propertiesGrid) {
                    propertiesGrid.innerHTML = '<div class="loading-animation"><i class="fas fa-circle-notch fa-spin"></i><span>Searching properties...</span></div>';

                    // Simulate API delay
                    setTimeout(() => {
                        // Replace with actual API call in production
                        propertiesGrid.innerHTML = ''; // Clear loading animation
                        // Reinitialize property cards (in a real app this would show filtered results)
                        initializePropertyCards();
                    }, 1500);
                }
            }
        });
    }

    // Initialize property card interactions
    function initializePropertyCards() {
        // Add favorite functionality
        const favoriteButtons = document.querySelectorAll('.property-favorite');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.classList.toggle('active');
                const propertyId = this.getAttribute('data-property-id');

                // Save favorite status in localStorage
                const favorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');

                if (this.classList.contains('active')) {
                    if (!favorites.includes(propertyId)) {
                        favorites.push(propertyId);
                        showToast('Property added to favorites');
                    }
                } else {
                    const index = favorites.indexOf(propertyId);
                    if (index !== -1) {
                        favorites.splice(index, 1);
                        showToast('Property removed from favorites');
                    }
                }

                localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
            });
        });

        // Load favorite status from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
        favoriteButtons.forEach(button => {
            const propertyId = button.getAttribute('data-property-id');
            if (savedFavorites.includes(propertyId)) {
                button.classList.add('active');
            }
        });

        // Make property cards clickable
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach(card => {
            card.addEventListener('click', function() {
                const propertyUrl = this.getAttribute('data-url') || 'property-details.html';
                window.location.href = propertyUrl;
            });
        });
    }

    // Initialize property cards on page load
    initializePropertyCards();

    // Toast notification function
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Show with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500); // Wait for fade out animation
        }, duration);
    }

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    if (testimonials.length > 0) {
        // Create navigation dots
        const testimonialsContainer = testimonials[0].parentElement;
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';

        testimonials.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                goToTestimonial(index);
            });

            dotsContainer.appendChild(dot);
        });

        testimonialsContainer.appendChild(dotsContainer);

        // Show first testimonial
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
        });

        // Function to switch testimonials
        function goToTestimonial(index) {
            testimonials[currentTestimonial].style.display = 'none';
            document.querySelectorAll('.testimonial-dot')[currentTestimonial].classList.remove('active');

            currentTestimonial = index;

            testimonials[currentTestimonial].style.display = 'block';
            document.querySelectorAll('.testimonial-dot')[currentTestimonial].classList.add('active');
        }

        // Set up automatic slide transition
        let testimonialsInterval = setInterval(() => {
            goToTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 5000);

        // Pause rotation on hover
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            testimonialsSection.addEventListener('mouseenter', () => {
                clearInterval(testimonialsInterval);
            });

            testimonialsSection.addEventListener('mouseleave', () => {
                testimonialsInterval = setInterval(() => {
                    goToTestimonial((currentTestimonial + 1) % testimonials.length);
                }, 5000);
            });
        }
    }


    //New functions from edited code
    function initializeRealScoutComponents() {
        console.log('Initializing RealScout components');

        const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');

        if (realscoutElements.length > 0) {
            console.log(`Found ${realscoutElements.length} RealScout elements on page`);

            // Check if script is already loaded
            if (!document.querySelector('script[src*="realscout-web-components.umd.js"]')) {
                console.log('Loading RealScout script dynamically');

                const script = document.createElement('script');
                script.src = 'https://em.realscout.com/widgets/realscout-web-components.umd.js';
                script.crossOrigin = 'anonymous';
                script.async = true;

                script.onload = () => {
                    console.log('RealScout script loaded successfully');
                    refreshAllRealScoutComponents();
                };

                script.onerror = () => {
                    console.error('Failed to load RealScout script, activating fallback');
                    showFallbackProperties();
                };

                document.head.appendChild(script);
            } else {
                // Script already loaded, just refresh components
                console.log('RealScout script already loaded, refreshing components');
                refreshAllRealScoutComponents();
            }
        } else {
            console.log('No RealScout elements found on page');
        }
    }

    function refreshAllRealScoutComponents() {
        const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');

        realscoutElements.forEach(element => {
            try {
                // Set refresh attribute if available in API
                element.setAttribute('refresh', 'true');
                console.log('RealScout component refreshed:', element);
            } catch (error) {
                console.error('Error refreshing RealScout component:', error);
            }
        });

        // Check status after refreshing
        setTimeout(() => {
            checkRealScoutRenderStatus();
        }, 3000);
    }

    function checkRealScoutRenderStatus() {
        const realscoutElements = document.querySelectorAll('realscout-office-listings, realscout-simple-search, realscout-advanced-search, realscout-home-value');
        let anyFailed = false;

        realscoutElements.forEach(element => {
            // Check if the element is rendering properly
            if (!element.shadowRoot || element.offsetHeight < 50) {
                console.log('RealScout element not rendering properly:', element);
                anyFailed = true;
            }
        });

        if (anyFailed) {
            console.log('Some RealScout components failed to render, activating fallback');
            if (typeof showFallbackProperties === 'function') {
                showFallbackProperties();
            }
        }
    }

    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;

                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }

                        img.classList.add('loaded');
                        imageObserver.unobserve(img);

                        // Log image loading for debugging
                        console.log('Image loaded:', img.alt || 'unnamed image');
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        }
    }

    function setupEventListeners() {
        // Toggle mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav ul');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('show');
            });
        }

        // Close announcement banner
        const closeBanner = document.getElementById('close-banner');
        const banner = document.getElementById('announcement-banner');

        if (closeBanner && banner) {
            closeBanner.addEventListener('click', function() {
                banner.style.display = 'none';
                // Store preference in localStorage
                localStorage.setItem('announcement-closed', 'true');
            });

            // Check if previously closed
            if (localStorage.getItem('announcement-closed') === 'true') {
                banner.style.display = 'none';
            }
        }

        // Initialize FAQ accordions
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;

                this.classList.toggle('active');

                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // Prevent duplicate call to showFallbackProperties
let fallbackShown = false;
    
function showFallbackProperties() {
    if (fallbackShown) {
        console.log('Fallback properties already shown, skipping duplicate call');
        return;
    }
    
    console.warn('RealScout failed to load. Showing fallback properties.');
    // Call the implementation from realscout-fallback.js
    if (typeof window.showFallbackProperties === 'function') {
        window.showFallbackProperties();
    } else {
        console.error('Fallback function not found in global scope');
        // Basic fallback if the main one is not available
        const fallbackContainer = document.getElementById('fallback-properties');
        if (fallbackContainer) {
            fallbackContainer.style.display = 'block';
        }
    }
    
    fallbackShown = true;
}
});