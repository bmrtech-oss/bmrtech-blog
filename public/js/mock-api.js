// Auto-disable in production environments
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '0.0.0.0' ||
                          window.location.hostname.includes('.local');

const isProduction = window.location.hostname.includes('.pages.dev') || 
                    window.location.hostname.includes('.workers.dev') ||
                    window.location.hostname === 'your-production-domain.com'; // Replace with your actual domain

if (isProduction) {
    console.log('🚫 Production environment detected - mock API disabled');
} else if (isLocalDevelopment) {
    console.log('🔧 Development environment - mock API enabled');
    
    // Comprehensive mock API for local development
    class MockAPI {
        constructor() {
            this.commentsData = new Map();
            this.likesData = new Map();
            this.authorsData = new Map();
            this.initializeMockData();
        }

        initializeMockData() {
            // Initialize with some sample data
            this.commentsData.set('first-post', [
                {
                    id: 1,
                    author_name: 'John Doe',
                    author_email: 'john@example.com',
                    content: 'This is a great post! I really enjoyed reading it.',
                    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    approved: true
                },
                {
                    id: 2,
                    author_name: 'Jane Smith',
                    author_email: 'jane@example.com',
                    content: 'Thanks for sharing this valuable information!',
                    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                    approved: true
                }
            ]);

            this.commentsData.set('second-post', [
                {
                    id: 3,
                    author_name: 'Bob Wilson',
                    author_email: 'bob@example.com',
                    content: 'Looking forward to more content like this!',
                    created_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
                    approved: true
                }
            ]);

            this.likesData.set('first-post', 8);
            this.likesData.set('second-post', 5);
            this.likesData.set('third-post', 2);
            
            // Sample authors
            this.authorsData.set('john@example.com', {
                id: 1,
                email: 'john@example.com',
                name: 'John Doe',
                subscribed: true
            });
            this.authorsData.set('jane@example.com', {
                id: 2,
                email: 'jane@example.com',
                name: 'Jane Smith',
                subscribed: false
            });
            this.authorsData.set('bob@example.com', {
                id: 3,
                email: 'bob@example.com',
                name: 'Bob Wilson',
                subscribed: true
            });
        }

        async mockFetch(url, options) {
            console.log('🔧 Mock API call:', url, options);

            // Simulate network delay (150-500ms)
            const delay = 150 + Math.random() * 350;
            await new Promise(resolve => setTimeout(resolve, delay));

            try {
                // Handle different API endpoints
                if (url.includes('/api/comments/')) {
                    return this.handleCommentsAPI(url, options);
                } else if (url.includes('/api/likes/')) {
                    return this.handleLikesAPI(url, options);
                } else if (url.includes('/api/subscribe')) {
                    return this.handleSubscribeAPI(url, options);
                } else if (url.includes('/api/author/')) {
                    return this.handleAuthorAPI(url, options);
                }

                // Fallback for unknown endpoints
                return this.createResponse(404, { error: 'Endpoint not found' });
            } catch (error) {
                console.error('Mock API error:', error);
                return this.createResponse(500, { error: 'Internal server error' });
            }
        }

        handleCommentsAPI(url, options) {
            const slug = this.extractSlug(url, '/api/comments/');
            
            if (!slug) {
                return this.createResponse(400, { error: 'Post slug required' });
            }

            if (options?.method === 'POST') {
                return this.handlePostComment(slug, options);
            } else {
                return this.handleGetComments(slug);
            }
        }

        handleGetComments(slug) {
            const comments = this.commentsData.get(slug) || [];
            const approvedComments = comments.filter(comment => comment.approved);
            
            return this.createResponse(200, approvedComments);
        }

        async handlePostComment(slug, options) {
            try {
                const data = await this.parseJsonBody(options.body);
                const comments = this.commentsData.get(slug) || [];
                
                const newComment = {
                    id: Date.now(),
                    author_name: data.name,
                    author_email: data.email,
                    content: data.content,
                    created_at: new Date().toISOString(),
                    approved: false
                };
                
                comments.push(newComment);
                this.commentsData.set(slug, comments);

                // Store author for subscription management
                this.authorsData.set(data.email, {
                    email: data.email,
                    name: data.name,
                    subscribed: data.subscribe !== false // Default to true
                });

                return this.createResponse(201, { 
                    success: true, 
                    message: 'Comment submitted for moderation! (Local mock)' 
                });
            } catch (error) {
                return this.createResponse(400, { error: 'Invalid JSON data' });
            }
        }

        handleLikesAPI(url, options) {
            const slug = this.extractSlug(url, '/api/likes/');
            
            if (!slug) {
                return this.createResponse(400, { error: 'Post slug required' });
            }

            if (options?.method === 'POST') {
                return this.handlePostLike(slug);
            } else {
                return this.handleGetLikes(slug);
            }
        }

        handleGetLikes(slug) {
            const count = this.likesData.get(slug) || 0;
            return this.createResponse(200, { count });
        }

        handlePostLike(slug) {
            let count = this.likesData.get(slug) || 0;
            count++;
            this.likesData.set(slug, count);
            
            return this.createResponse(200, { count });
        }

        handleSubscribeAPI(url, options) {
            if (options?.method === 'POST') {
                return this.handlePostSubscribe(options);
            }
            return this.createResponse(405, { error: 'Method not allowed' });
        }

        async handlePostSubscribe(options) {
            try {
                const data = await this.parseJsonBody(options.body);
                
                if (!data.email) {
                    return this.createResponse(400, { error: 'Email is required' });
                }

                const author = this.authorsData.get(data.email) || {
                    email: data.email,
                    name: 'Unknown',
                    subscribed: false
                };
                
                author.subscribed = data.action === 'subscribe';
                this.authorsData.set(data.email, author);

                return this.createResponse(200, { 
                    success: true, 
                    message: `Successfully ${data.action}d!` 
                });
            } catch (error) {
                return this.createResponse(400, { error: 'Invalid JSON data' });
            }
        }

        handleAuthorAPI(url) {
            const email = this.extractSlug(url, '/api/author/');
            if (!email) {
                return this.createResponse(400, { error: 'Email required' });
            }

            const author = this.authorsData.get(email) || {
                email: email,
                name: 'Unknown',
                subscribed: false
            };

            return this.createResponse(200, author);
        }

        // Helper methods
        extractSlug(url, prefix) {
            return url.split(prefix).pop().replace(/\/$/, '');
        }

        async parseJsonBody(body) {
            if (body instanceof ReadableStream) {
                const reader = body.getReader();
                const chunks = [];
                let done = false;
                
                while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    if (value) chunks.push(value);
                    done = readerDone;
                }
                
                const text = new TextDecoder().decode(Buffer.concat(chunks));
                return JSON.parse(text);
            }
            return JSON.parse(body);
        }

        createResponse(status, data) {
            return {
                ok: status >= 200 && status < 300,
                status: status,
                json: () => Promise.resolve(data),
                text: () => Promise.resolve(JSON.stringify(data)),
                headers: {
                    get: (key) => {
                        const headers = {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        };
                        return headers[key.toLowerCase()];
                    }
                }
            };
        }
    }

    // Initialize and activate mock API
    const mockAPI = new MockAPI();
    const originalFetch = window.fetch;
    
    window.fetch = function(url, options) {
        // Only intercept API calls in development
        if (typeof url === 'string' && url.includes('/api/')) {
            return mockAPI.mockFetch(url, options);
        }
        // Pass through all other requests
        return originalFetch(url, options);
    };

    // Add debug functions to global scope for testing
    window.__mockAPI = {
        clearData: () => {
            mockAPI.commentsData.clear();
            mockAPI.likesData.clear();
            mockAPI.authorsData.clear();
            mockAPI.initializeMockData();
            console.log('🧹 Mock API data cleared and reset');
        },
        getData: () => ({
            comments: Object.fromEntries(mockAPI.commentsData),
            likes: Object.fromEntries(mockAPI.likesData),
            authors: Object.fromEntries(mockAPI.authorsData)
        }),
        addTestData: (slug, comments = [], likes = 0) => {
            mockAPI.commentsData.set(slug, comments);
            mockAPI.likesData.set(slug, likes);
            console.log(`📝 Added test data for slug: ${slug}`);
        }
    };

    console.log('🎯 Mock API initialized. Use window.__mockAPI for debugging');
    
} else {
    console.log('🌐 Unknown environment - mock API disabled for safety');
}
