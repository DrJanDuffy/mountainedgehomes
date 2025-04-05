
// Simple test script to verify API key access
console.log('Testing API key access...');
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
if (apiKey) {
    console.log('API key is available (key is hidden for security)');
} else {
    console.warn('API key appears to be missing. Make sure it is set in Secrets.');
}
