const fs = require('fs');
const path = require('path');

console.log('📦 Building frontend production bundle...');

const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

let jsBundle = '';
if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.forEach(f => {
        if (f.endsWith('.js') && !f.endsWith('.test.js')) {
            jsBundle += `\n/* Minified/Bundled: ${f} */\n` + fs.readFileSync(path.join(srcDir, f), 'utf8') + '\n';
        }
    });
}

fs.writeFileSync(path.join(distDir, 'app.min.js'), jsBundle);

// Copy and inject bundle in HTML
const htmlSrc = path.join(srcDir, 'index.html');
if (fs.existsSync(htmlSrc)) {
    let html = fs.readFileSync(htmlSrc, 'utf8');
    // Inject bundle right before closing body
    html = html.replace('<!-- BUNDLE_INJECT -->', '<script src="app.min.js"></script>');
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
}

console.log('✨ Build succeeded! Output saved in /dist');
process.exit(0);
