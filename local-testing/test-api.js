const { test } = require('node:test');
const assert = require('node:assert');
const http = require('http');

const TEST_PORT = 3001;
const TEST_BASE = `http://localhost:${TEST_PORT}`;

async function testAPI() {
    console.log('Running API tests...\n');
    
    // Test 1: Get comments for non-existent post
    await testGET('/api/comments/non-existent', [], 'Empty comments array');
    
    // Test 2: Create a comment
    const commentData = {
        name: 'Test User',
        email: 'test@example.com',
        content: 'Automated test comment'
    };
    
    const commentResult = await testPOST('/api/comments/test-post', commentData);
    assert.ok(commentResult.success, 'Comment should be created successfully');
    
    // Test 3: Get comments should now return data
    const comments = await testGET('/api/comments/test-post');
    assert.ok(Array.isArray(comments), 'Should return array of comments');
    
    // Test 4: Test likes
    const initialLikes = await testGET('/api/likes/test-post');
    await testPOST('/api/likes/test-post');
    const updatedLikes = await testGET('/api/likes/test-post');
    
    assert.strictEqual(updatedLikes.count, (initialLikes.count || 0) + 1, 
        'Like count should increment');
    
    console.log('✅ All tests passed!');
}

async function testGET(endpoint, expectedData = null, description = '') {
    return new Promise((resolve) => {
        http.get(TEST_BASE + endpoint, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const result = JSON.parse(data);
                if (expectedData !== null) {
                    assert.deepStrictEqual(result, expectedData, description);
                }
                resolve(result);
            });
        });
    });
}

async function testPOST(endpoint, data = null) {
    return new Promise((resolve) => {
        const postData = data ? JSON.stringify(data) : '';
        const req = http.request(TEST_BASE + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => resolve(JSON.parse(responseData)));
        });
        
        if (postData) req.write(postData);
        req.end();
    });
}

// Start local server and run tests
const { exec } = require('child_process');
const apiServer = exec('node local-api-server.js');

setTimeout(() => {
    testAPI().then(() => {
        apiServer.kill();
        process.exit(0);
    }).catch(error => {
        console.error('❌ Test failed:', error);
        apiServer.kill();
        process.exit(1);
    });
}, 1000);