const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const url = require('url');

const dbPath = path.join(__dirname, 'local-test.db');
const db = new sqlite3.Database(dbPath);
const port = 3001;

// Initialize database
const initDB = `
CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, name TEXT, subscribed BOOLEAN DEFAULT 1);
CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_slug TEXT, author_id INTEGER, content TEXT, approved BOOLEAN DEFAULT 0);
CREATE TABLE IF NOT EXISTS likes (id INTEGER PRIMARY KEY AUTOINCREMENT, post_slug TEXT UNIQUE, count INTEGER DEFAULT 0);
`;

db.exec(initDB);

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    try {
        // Handle API routes
        if (pathname.startsWith('/api/comments/') && req.method === 'GET') {
            const slug = pathname.split('/').pop();
            const comments = await runQuery(
                `SELECT c.*, a.name as author_name, a.email as author_email 
                 FROM comments c JOIN authors a ON c.author_id = a.id 
                 WHERE c.post_slug = ? AND c.approved = 1`,
                [slug]
            );
            respondJSON(res, comments);
            
        } else if (pathname.startsWith('/api/comments/') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const data = JSON.parse(body);
                const slug = pathname.split('/').pop();
                
                // Insert or get author
                const author = await runQuery(
                    `INSERT INTO authors (email, name) VALUES (?, ?)
                     ON CONFLICT(email) DO UPDATE SET name = excluded.name
                     RETURNING id`,
                    [data.email, data.name]
                );
                
                // Insert comment
                await runQuery(
                    `INSERT INTO comments (post_slug, author_id, content, approved)
                     VALUES (?, ?, ?, 0)`,
                    [slug, author[0].id, data.content]
                );
                
                respondJSON(res, { success: true, message: 'Comment submitted' });
            });
            
        } else if (pathname.startsWith('/api/likes/') && req.method === 'GET') {
            const slug = pathname.split('/').pop();
            const likes = await runQuery(
                'SELECT count FROM likes WHERE post_slug = ?',
                [slug]
            );
            respondJSON(res, { count: likes[0]?.count || 0 });
            
        } else if (pathname.startsWith('/api/likes/') && req.method === 'POST') {
            const slug = pathname.split('/').pop();
            const result = await runQuery(
                `INSERT INTO likes (post_slug, count) VALUES (?, 1)
                 ON CONFLICT(post_slug) DO UPDATE SET count = count + 1
                 RETURNING count`,
                [slug]
            );
            respondJSON(res, { count: result[0]?.count });
            
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    } catch (error) {
        console.error('API Error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
    }
});

function respondJSON(res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

server.listen(port, () => {
    console.log(`Local API server running on http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  GET  /api/comments/:slug');
    console.log('  POST /api/comments/:slug');
    console.log('  GET  /api/likes/:slug');
    console.log('  POST /api/likes/:slug');
});