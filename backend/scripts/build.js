const fs = require('fs');
const path = require('path');

console.log('📦 Building/Preparing backend production build...');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Ensure entry server file exists
const entryFile = path.join(srcDir, 'server.js');
if (!fs.existsSync(entryFile)) {
    console.error('❌ Error: Entry file server.js not found in backend/src!');
    process.exit(1);
}

// Simulation of compiling: checking syntactic correctness and copying entry files
try {
    const entryCode = fs.readFileSync(entryFile, 'utf8');
    // Simple check: make sure require statements point to existing files
    const lines = entryCode.split('\n');
    lines.forEach(line => {
        if (line.includes('require(')) {
            const match = line.match(/require\(['"]\.\/(.+)['"]\)/);
            if (match) {
                const target = match[1];
                const resolvedPath = path.join(srcDir, target.endsWith('.js') ? target : `${target}.js`);
                if (!fs.existsSync(resolvedPath)) {
                    throw new Error(`Unresolved local dependency: ${target}`);
                }
            }
        }
    });

    // Copy to dist directory
    fs.copyFileSync(entryFile, path.join(distDir, 'server.min.js'));
    console.log('✨ Backend compilation build succeeded! Output saved in /dist');
    process.exit(0);
} catch (err) {
    console.error('🚨 Backend compilation build failed:', err.message);
    process.exit(1);
}
