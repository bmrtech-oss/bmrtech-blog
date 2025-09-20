// Add this to your existing mock-api.js
const USE_LOCAL_API = true;
const LOCAL_API_BASE = 'http://localhost:3001';

// Modify the fetch function to use local API
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    // Use local API server for testing
    if (USE_LOCAL_API && url.includes('/api/') && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1')) {
        
        const localUrl = url.replace(/.*\/api/, LOCAL_API_BASE + '/api');
        console.log('📡 Using local API:', localUrl);
        return originalFetch(localUrl, options);
    }
    
    // Use mock API as fallback
    if (url.includes('/api/')) {
        // Your existing mock API logic
    }
    
    return originalFetch(url, options);
};