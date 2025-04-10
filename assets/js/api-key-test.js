
// Simple test script to verify API key access
console.log('Testing API key access...');

// Use window context for browser environment
const apiKey = (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) || '';
if (apiKey) {
    console.log('API key is available (key is hidden for security)');
} else {
    console.warn('API key appears to be missing. Make sure it is set as a global variable on the window object.');
}
