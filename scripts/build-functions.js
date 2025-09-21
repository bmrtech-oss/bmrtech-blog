const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Cloudflare Functions...');

// Create _worker.js from functions directory
try {
    // Use wrangler to build functions
    execSync('npx wrangler pages functions build --outdir _site', {
        stdio: 'inherit',
        cwd: process.cwd()
    });

    console.log('✅ Functions built successfully');
    console.log('📁 _site/_worker.js should now exist');

    // Verify the new bundle file was created
    if (fs.existsSync(path.join(process.cwd(), '_worker.bundle'))) {
        console.log('✅ _worker.bundle created successfully');
    } else {
        console.log('❌ _worker.bundle was not created');
    }

} catch (error) {
    console.error('❌ Failed to build functions:', error.message);
    process.exit(1);
}
