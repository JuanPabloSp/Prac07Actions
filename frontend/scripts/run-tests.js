const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Finding and running unit tests programmatically...');

const srcDir = path.join(__dirname, '../src');

function getFilesRecursively(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getFilesRecursively(filePath, fileList);
        } else if (file.endsWith('.test.js')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

if (!fs.existsSync(srcDir)) {
    console.error('❌ Error: src directory not found!');
    process.exit(1);
}

const testFiles = getFilesRecursively(srcDir);

if (testFiles.length === 0) {
    console.log('⚠️ No test files found.');
    process.exit(0);
}

console.log(`Running tests for files:\n${testFiles.map(f => `  - ${path.relative(path.join(__dirname, '..'), f)}`).join('\n')}\n`);

// Run node --test with all test files as arguments
const result = spawnSync('node', ['--test', ...testFiles], { stdio: 'inherit' });

process.exit(result.status === null ? 1 : result.status);
