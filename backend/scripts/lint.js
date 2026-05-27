const fs = require('fs');
const path = require('path');

console.log('🔍 Running static analysis / lint check on backend files...');

const srcDir = path.join(__dirname, '../src');
let errors = 0;

function checkFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        const cleanLine = line.replace('\r', '');
        if (cleanLine.endsWith(' ') && cleanLine.trim().length > 0) {
            console.warn(`⚠️ Warning: Trailing whitespace in ${path.basename(file)} on line ${idx + 1}`);
        }
        if (cleanLine.includes('debugger;')) {
            console.error(`❌ Error: Debugger statement found in ${path.basename(file)} on line ${idx + 1}`);
            errors++;
        }
    });
}

if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.forEach(f => {
        if (f.endsWith('.js')) {
            checkFile(path.join(srcDir, f));
        }
    });
}

if (errors > 0) {
    console.error(`🚨 Lint check failed with ${errors} error(s).`);
    process.exit(1);
} else {
    console.log('✅ Lint check completed successfully. No errors found!');
    process.exit(0);
}
