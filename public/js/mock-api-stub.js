// Mock API for local testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('Running in local mode - using mock APIs');
  
  // Mock fetch function
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    // Mock likes API
    if (url.includes('/api/likes/')) {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: Math.floor(Math.random() * 10) + 1 })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: Math.floor(Math.random() * 5) })
      });
    }
    
    // Mock comments API
    if (url.includes('/api/comments/')) {
      if (options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            success: true, 
            message: 'Comment submitted for moderation! (Local mock)' 
          })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    }
    
    // For all other requests, use original fetch
    return originalFetch(url, options);
  };
}