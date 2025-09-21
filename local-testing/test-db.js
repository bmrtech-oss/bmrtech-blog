const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create local SQLite database for testing
const dbPath = path.join(__dirname, 'local-test.db');
const db = new sqlite3.Database(dbPath);

// Create tables (same schema as Cloudflare D1)
const createTables = `
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    subscribed BOOLEAN DEFAULT 1,
    subscription_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES authors (id)
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL UNIQUE,
    count INTEGER DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_authors_email ON authors(email);
CREATE INDEX IF NOT EXISTS idx_authors_subscribed ON authors(subscribed);
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
`;

// Test data
const testData = `
INSERT OR IGNORE INTO authors (email, name, subscribed) VALUES 
('test1@example.com', 'Test User 1', 1),
('test2@example.com', 'Test User 2', 0);

INSERT OR IGNORE INTO comments (post_slug, author_id, content, approved) VALUES 
('first-post', 1, 'This is a test comment', 1),
('first-post', 2, 'Another test comment', 0);

INSERT OR IGNORE INTO likes (post_slug, count) VALUES 
('first-post', 5),
('second-post', 3);
`;

// Run tests
async function testDatabase() {
    console.log('Testing database operations...\n');
    
    try {
        // Create tables
        await runQuery(createTables);
        console.log('✅ Tables created successfully');
        
        // Insert test data
        await runQuery(testData);
        console.log('✅ Test data inserted');
        
        // Test queries
        console.log('\n--- Testing Queries ---');
        
        // 1. Get comments for a post
        const comments = await runQuery(
            `SELECT c.*, a.name as author_name, a.email as author_email 
             FROM comments c 
             JOIN authors a ON c.author_id = a.id 
             WHERE c.post_slug = ? AND c.approved = 1`,
            ['first-post']
        );
        console.log('📝 Comments for first-post:', comments);
        
        // 2. Get like count
        const likes = await runQuery(
            'SELECT count FROM likes WHERE post_slug = ?',
            ['first-post']
        );
        console.log('❤️  Likes for first-post:', likes[0]?.count);
        
        // 3. Insert new comment
        const newComment = await runQuery(
            `INSERT INTO comments (post_slug, author_id, content, approved) 
             VALUES (?, ?, ?, ?) RETURNING *`,
            ['test-post', 1, 'New test comment', 0]
        );
        console.log('💬 New comment inserted:', newComment);
        
        // 4. Update like count
        const updatedLikes = await runQuery(
            `INSERT INTO likes (post_slug, count) VALUES (?, 1)
             ON CONFLICT(post_slug) DO UPDATE SET count = count + 1
             RETURNING count`,
            ['test-post']
        );
        console.log('👍 Like count updated:', updatedLikes[0]?.count);
        
        // 5. Get all data
        const allData = await runQuery(`
            SELECT 
                (SELECT COUNT(*) FROM authors) as author_count,
                (SELECT COUNT(*) FROM comments) as comment_count,
                (SELECT COUNT(*) FROM likes) as like_count
        `);
        console.log('📊 Database stats:', allData[0]);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        db.close();
    }
}

// Helper function to run queries
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        }
    });
}

// Run the tests
testDatabase();