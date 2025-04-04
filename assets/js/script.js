// Initialize RealScout component when DOM is loaded
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